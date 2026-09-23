/* Forma integrada ao filtro via feComposite operator="in" para contornar
   anulacao de backdrop-filter sob clip-path ou filter ancestral. */

import { squircle } from "./squircle.mjs";

/* Aspas simples exigem escape manual para evitar fechar precocemente url() de SVG. */
/** @param {string} body @returns {string} */
const uri = body => `data:image/svg+xml,${encodeURIComponent(body).split("'").join("%27")}`;

/** @typedef {[number, number][]} Ramp paradas de gradiente, em `[posicao, alfa]` */

/**
 * @param {{ w: number, h: number, r: number, bevel: number, force: number }} input
 * @returns {string}
 */
function lensMap({ w, h, r, bevel, force }) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const bw = w / 2;
  const bh = h / 2;
  /** @param {number} x @param {number} y @returns {number} */
  const sdf = (x, y) => {
    const qx = Math.abs(x - bw) - (bw - r);
    const qy = Math.abs(y - bh) - (bh - r);
    return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = sdf(x + 0.5, y + 0.5);
      let dx = 0;
      let dy = 0;
      if (d > -bevel && d < 0) {
        const gx = sdf(x + 1.5, y + 0.5) - sdf(x - 0.5, y + 0.5);
        const gy = sdf(x + 0.5, y + 1.5) - sdf(x + 0.5, y - 0.5);
        const n = Math.hypot(gx, gy) || 1;
        /* Rampa cubica (3t² - 2t³) garante derivada zero na juncao com a area plana. */
        const t = 1 - -d / bevel;
        const amp = t * t * (3 - 2 * t) * force;
        dx = (-gx / n) * amp;
        dy = (-gy / n) * amp;
      }
      const i = (y * w + x) * 4;
      img.data[i] = 128 + dx * 127;
      img.data[i + 1] = 128 + dy * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

/**
 * Dispersao com blur 10 anulava o friso; blur 3 e escala 0,10 geram friso de 0,7px (+0,738 ms/q).
 * @param {number} scale
 * @param {number} dispersion
 * @returns {string}
 */
function bend(scale, dispersion) {
  /** @param {string} channel @param {number} k @param {string} out @returns {string} */
  const map = (channel, k, out) =>
    `<feDisplacementMap in="SourceGraphic" in2="map" scale="${(scale * k).toFixed(3)}" ` +
    `xChannelSelector="R" yChannelSelector="G" result="${out}raw"/>` +
    `<feColorMatrix in="${out}raw" type="matrix" values="${channel}" result="${out}"/>`;
  if (!dispersion) {
    return (
      `<feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" ` +
      `xChannelSelector="R" yChannelSelector="G" result="bent"/>`
    );
  }
  return (
    map("1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", 1 - dispersion, "red") +
    map("0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", 1, "green") +
    map("0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0", 1 + dispersion, "blue") +
    `<feBlend in="red" in2="green" mode="screen" result="rg"/>` +
    `<feBlend in="rg" in2="blue" mode="screen" result="bent"/>`
  );
}

/* Acima de 600px o mapa e esticado pelo filtro para evitar calcular 1 milhao de pixels. */
const MAP_MAX = 600;

/* Teto de 40 mil px (+0,017 ms/q, 240 fps); a 59 mil salta para +0,536 ms/q e 2 milhoes para 24 fps. */
const LENS_AREA_MAX = 40000;

/**
 * Acima do teto de area devolve null, usando o desfoque estatico do token.
 * @param {object} input
 * @param {string} input.id
 * @param {number} input.w
 * @param {number} input.h
 * @param {number} input.r
 * @param {number} input.s
 * @param {number} input.bevel
 * @param {number} input.force
 * @param {number} input.scale
 * @param {number} input.blur
 * @returns {SVGSVGElement | null}
 */
export function installLens({ id, w, h, r, s, bevel, force, scale, blur }) {
  if (!(w > 8 && h > 8 && w * h <= LENS_AREA_MAX)) return null;
  /* Bevel e r escalam com o mapa reduzido; scale permanece em pixels de tela. */
  const k = Math.min(1, MAP_MAX / Math.max(w, h));
  const map = lensMap({
    w: Math.max(2, Math.round(w * k)),
    h: Math.max(2, Math.round(h * k)),
    r: r * k,
    bevel: bevel * k,
    force,
  });
  const shape = uri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
      `<path d='${squircle({ w, h, r, s })}' fill='#fff'/></svg>`,
  );
  const holder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  holder.setAttribute("width", "0");
  holder.setAttribute("height", "0");
  holder.dataset["lens"] = id;
  holder.style.cssText = "position:absolute;pointer-events:none";
  holder.innerHTML =
    `<defs><filter id="${id}" x="0" y="0" width="100%" height="100%" ` +
    `color-interpolation-filters="sRGB">` +
    `<feImage href="${map}" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>` +
    bend(scale, RECIPE.dispersion) +
    `<feGaussianBlur in="bent" stdDeviation="${blur}" result="soft"/>` +
    `<feImage href="${shape}" width="${w}" height="${h}" preserveAspectRatio="none" result="shape"/>` +
    `<feComposite in="soft" in2="shape" operator="in"/></filter></defs>`;
  document.body.append(holder);
  return holder;
}

/** @param {string} id @param {Ramp} ramp @param {string} [rgb] @returns {string} */
const stops = (id, ramp, rgb = "255,255,255") =>
  `<linearGradient id='${id}' x1='0' y1='0' x2='0' y2='1'>` +
  ramp.map(([at, alpha]) => `<stop offset='${at}' stop-color='rgba(${rgb},${alpha})'/>`).join("") +
  `</linearGradient>`;

/**
 * @param {object} input
 * @param {number} input.w
 * @param {number} input.h
 * @param {number} input.r
 * @param {number} input.s
 * @param {Ramp} input.body
 * @param {Ramp} input.edge
 * @param {number} [input.gleam] o realce especular do topo; 0 desliga
 * @param {string} [input.tint] a cor do corpo, em `r,g,b`; a aresta e sempre a luz
 * @returns {string}
 */
export function skin({ w, h, r, s, body, edge, gleam = 0, tint }) {
  const shape = squircle({ w: w - 1, h: h - 1, r: r - 0.5, s });
  return uri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
      `<defs>${stops("edge", edge)}${stops("body", body, tint)}` +
      (gleam
        ? `<radialGradient id='gleam' cx='.5' cy='-.15' r='.95'>` +
          `<stop offset='0' stop-color='rgba(255,255,255,${gleam})'/>` +
          `<stop offset='.55' stop-color='rgba(255,255,255,${(gleam * 0.28).toFixed(3)})'/>` +
          `<stop offset='1' stop-color='rgba(255,255,255,0)'/></radialGradient>`
        : "") +
      `</defs><g transform='translate(.5 .5)'>` +
      `<path d='${shape}' fill='url(#body)'/>` +
      (gleam ? `<path d='${shape}' fill='url(#gleam)'/>` : "") +
      `<path d='${shape}' fill='none' stroke='url(#edge)' stroke-width='1'/>` +
      `</g></svg>`,
  );
}

/** @param {Ramp} ramp @param {number} k @returns {Ramp} */
export const scaleRamp = (ramp, k) =>
  /** @type {Ramp} */ (ramp.map(([at, alpha]) => [at, Number((alpha * k).toFixed(4))]));

/* Saturacao 1,6 baixava croma de -2,85 para -6,57; escala 17 causava desvio de 8,5px partindo o veio. */
export const RECIPE = {
  bevel: 13,
  force: 1,
  scale: 10,
  blur: 3,
  saturation: 1.9,
  /* Brightness 1,05 reduz perda de luminancia de 0,96 para 0,2 de L sem custo adicional no Skia. */
  brightness: 1.05,
  r: 16,
  s: 0.6,
  dispersion: 0.1,
};

/* Aresta em fracao variava de 6,5px no dock a 180px no palco (30x de divergencia); fixada em pixels. */
/** @type {[number, number][]} */
const ZENITH = [
  [0, 0.4],
  [4.5, 0.26],
  [11, 0.12],
];
/** @type {[number, number][]} */
const NADIR = [
  [11, 0.1],
  [4.5, 0.14],
  [0, 0.18],
];
const MIDDLE = 0.08;

/**
 * @param {number} h @returns {Ramp}
 */
export function fresnelFor(h) {
  /** @type {Ramp} */
  const cru = [
    ...ZENITH.map(([px, a]) => /** @type {[number, number]} */ ([px / h, a])),
    [0.5, MIDDLE],
    ...NADIR.map(([px, a]) => /** @type {[number, number]} */ ([1 - px / h, a])),
  ];
  /* Paradas estritamente crescentes evitam descarte do gradiente pelo parser SVG. */
  let anterior = -1;
  return /** @type {Ramp} */ (
    cru.map(([at, a]) => {
      const valor = Math.min(1, Math.max(at, anterior + 0.0005));
      anterior = valor;
      return [Number(valor.toFixed(4)), a];
    })
  );
}

/* A aresta de referencia, para quem precisa da forma sem a peca: a de uma capsula de 57px. */
/** @type {Ramp} */
export const FRESNEL = fresnelFor(57);

/* Tinta unica (14,20,31) unifica os seis materiais e gradientes opostos anteriores. */
export const GLASS_TINT = "14,20,31";

/** @type {Ramp} */
const BASE_BODY = [
  [0, 0.41],
  [0.5, 0.44],
  [1, 0.48],
];

/** @typedef {{ body: Ramp, tint: string }} Level */

/* Dois degraus de raio (18 e 24) unificam os quatro valores dispersos anteriores (16, 18, 22, 24). */
/** @param {number} h @returns {number} */
export const radiusFor = (/** @type {number} */ h) => (h <= 96 ? 18 : 24);

export const EDGE_FORCE = 1;

/** @type {Record<"thin" | "regular" | "thick", Level>} */
export const LEVELS = {
  thin: { body: scaleRamp(BASE_BODY, 0.45), tint: GLASS_TINT },
  regular: { body: BASE_BODY, tint: GLASS_TINT },
  thick: { body: scaleRamp(BASE_BODY, 1.45), tint: GLASS_TINT },
};

let glazed = 0;

/**
 * Medida via offsetWidth/Height evita deformacao de getBoundingClientRect sob animacao de gesto.
 * Variavel --glaze permite remocao via CSS na troca de tela para evitar piscar de backdrop-filter.
 * @param {HTMLElement} node
 * @param {{ body: Ramp, edge?: Ramp, gleam?: number, r?: number, tint?: string }} paint
 */
export function glaze(node, { body, edge, gleam = 0, r, tint }) {
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  /* Raio lido do CSS evita divergencia de contorno entre a pele e o border-radius. */
  r ??= parseFloat(getComputedStyle(node).borderTopLeftRadius) || radiusFor(h);
  edge ??= scaleRamp(fresnelFor(h), EDGE_FORCE);
  if (w < 9 || h < 9) return;
  const stamp = `${w}x${h}x${gleam}x${r}x${tint ?? ""}x${body[0]?.[1]}x${edge[0]?.[1]}`;
  if (node.dataset["dressed"] !== stamp) {
    const id = node.dataset["lens"] ?? `glaze-${(glazed += 1)}`;
    node.dataset["lens"] = id;
    document.querySelector(`svg[data-lens="${id}"]`)?.remove();
    if (
      installLens({
        id,
        w,
        h,
        r,
        s: RECIPE.s,
        bevel: RECIPE.bevel,
        force: RECIPE.force,
        scale: RECIPE.scale,
        blur: RECIPE.blur,
      })
    ) {
      node.style.setProperty(
        "--glaze",
        `url(#${id}) saturate(${RECIPE.saturation}) brightness(${RECIPE.brightness})`,
      );
    } else {
      node.style.removeProperty("--glaze");
    }
    node.dataset["dressed"] = stamp;
  }
  if (node.dataset["painted"] === stamp) return;
  node.dataset["painted"] = stamp;
  node.style.backgroundImage = `url("${skin({ w, h, r, s: RECIPE.s, body, edge, gleam, tint })}")`;
}
