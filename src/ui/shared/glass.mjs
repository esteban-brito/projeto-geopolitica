/* O VIDRO — a lente que refrata, e a pele que a fecha.

   ⛔ TRES ARMADILHAS ENCADEADAS NASCERAM DAQUI, e cada conserto criava a seguinte:
   `clip-path` em qualquer ancestral mata `backdrop-filter`; um `filter` num ancestral
   tambem mata, porque cria uma raiz de backdrop e o filho amostra o vazio; e um irmao
   opaco atras entra no backdrop, entao o vidro passa a refratar a sombra.
   ⭐ A saida foi tirar a FORMA do CSS e po-la dentro do filtro: depois de refratar e
   borrar, `feComposite operator="in"` contra a silhueta. A forma vira SAIDA do filtro. */

import { squircle } from "./squircle.mjs";

/* ⛔ `encodeURIComponent` NAO ESCAPA ASPA SIMPLES, e todo SVG aqui usa `xmlns='...'`: ela
   fechava o `url('…')` no meio e a imagem inteira virava `none`, sem erro de console. */
/** @param {string} body @returns {string} */
const uri = body => `data:image/svg+xml,${encodeURIComponent(body).split("'").join("%27")}`;

/** @typedef {[number, number][]} Ramp paradas de gradiente, em `[posicao, alfa]` */

/**
 * O MAPA DE DESLOCAMENTO — o que o `feDisplacementMap` le para desviar o fundo.
 *
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
      /* So a FAIXA DA ARESTA refrata: no meio o vidro e plano, e plano nao desvia. */
      if (d > -bevel && d < 0) {
        const gx = sdf(x + 1.5, y + 0.5) - sdf(x - 0.5, y + 0.5);
        const gy = sdf(x + 0.5, y + 1.5) - sdf(x + 0.5, y - 0.5);
        const n = Math.hypot(gx, gy) || 1;
        /* ⚠ RAMPA QUADRATICA, e nao linear: numa lente a curvatura cresce para a borda,
           entao o desvio tambem. Linear le como chanfro — um corte reto. */
        const t = 1 - -d / bevel;
        const amp = t * t * force;
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
 * INSTALA UMA LENTE com o id pedido, e devolve o elemento que a carrega.
 *
 * ⚠ O TAMANHO TEM TETO: a lente desenha um mapa do tamanho da peca, e uma peca absurda
 * pede uma imagem que estoura a memoria do canvas — medido no provador.
 *
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
  if (!(w > 8 && h > 8 && w < 2200 && h < 400)) return null;
  const map = lensMap({ w, h, r, bevel, force });
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
    `<feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" ` +
    `xChannelSelector="R" yChannelSelector="G" result="bent"/>` +
    `<feGaussianBlur in="bent" stdDeviation="${blur}" result="soft"/>` +
    `<feImage href="${shape}" width="${w}" height="${h}" preserveAspectRatio="none" result="shape"/>` +
    `<feComposite in="soft" in2="shape" operator="in"/></filter></defs>`;
  document.body.append(holder);
  return holder;
}

/** @param {string} id @param {Ramp} ramp @returns {string} */
const stops = (id, ramp) =>
  `<linearGradient id='${id}' x1='0' y1='0' x2='0' y2='1'>` +
  ramp
    .map(([at, alpha]) => `<stop offset='${at}' stop-color='rgba(255,255,255,${alpha})'/>`)
    .join("") +
  `</linearGradient>`;

/**
 * A PELE — corpo e aresta na mesma imagem, em qualquer tamanho.
 *
 * ⚠ FRESNEL: numa superficie real a reflexao cresce onde o angulo rasa a superficie, entao
 * a quina de cima recebe o ceu e a de baixo devolve um rim. Um cinza unico no perimetro
 * inteiro e a diferenca entre "borda clara" e vidro.
 *
 * @param {object} input
 * @param {number} input.w
 * @param {number} input.h
 * @param {number} input.r
 * @param {number} input.s
 * @param {Ramp} input.body
 * @param {Ramp} input.edge
 * @param {number} [input.gleam] o realce especular do topo; 0 desliga
 * @returns {string}
 */
export function skin({ w, h, r, s, body, edge, gleam = 0 }) {
  const shape = squircle({ w: w - 1, h: h - 1, r: r - 0.5, s });
  return uri(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
      `<defs>${stops("edge", edge)}${stops("body", body)}` +
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

/* ⭐ A RECEITA DO VIDRO, uma para o jogo inteiro (ciclo 28). Medida na barra, um numero por vez,
   com o dono girando e olhando: o bisel e a faixa que refrata, a forca e quanto ela desvia, a
   escala e o ganho do mapa, o desfoque e a saturacao sao a vibrancia. */
export const RECIPE = { bevel: 13, force: 1, scale: 17, blur: 2.6, saturation: 1.9, r: 16, s: 0.6 };

let glazed = 0;

/**
 * VESTE UMA PECA DE VIDRO: mede a caixa, instala a lente do tamanho dela, pinta a pele e escreve
 * o `backdrop-filter`. O que muda entre as pecas e so a tinta do corpo e a forca da aresta.
 * ⛔ A medida e de LAYOUT: o gesto escala o botao, e `getBoundingClientRect` devolveria a peca
 * esmagada. ⛔ A lente so se refaz quando o tamanho muda: recriada a cada pintura, o navegador
 * nao re-resolve `url(#id)` e o `backdrop-filter` vira nada em silencio.
 *
 * @param {HTMLElement} node
 * @param {{ body: Ramp, edge: Ramp, gleam?: number }} paint
 */
export function glaze(node, { body, edge, gleam = 0 }) {
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  if (w < 9 || h < 9) return;
  const stamp = `${w}x${h}x${gleam}x${body[0]?.[1]}`;
  if (node.dataset["dressed"] !== stamp) {
    const id = node.dataset["lens"] ?? `glaze-${(glazed += 1)}`;
    node.dataset["lens"] = id;
    document.querySelector(`svg[data-lens="${id}"]`)?.remove();
    if (
      installLens({
        id,
        w,
        h,
        r: RECIPE.r,
        s: RECIPE.s,
        bevel: RECIPE.bevel,
        force: RECIPE.force,
        scale: RECIPE.scale,
        blur: RECIPE.blur,
      })
    ) {
      const filter = `url(#${id}) saturate(${RECIPE.saturation})`;
      node.style.backdropFilter = filter;
      node.style.setProperty("-webkit-backdrop-filter", filter);
    }
    node.dataset["dressed"] = stamp;
  }
  if (node.dataset["painted"] === stamp) return;
  node.dataset["painted"] = stamp;
  node.style.backgroundImage = `url("${skin({ w, h, r: RECIPE.r, s: RECIPE.s, body, edge, gleam })}")`;
}
