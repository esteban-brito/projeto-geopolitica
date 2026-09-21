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
        /* ⚠ RAMPA HERMITE (`3t² − 2t³`), e nao linear nem quadratica pura: numa lente a
           curvatura cresce para a borda, entao o desvio tambem — linear le como chanfro, um
           corte reto. A cubica tem derivada ZERO na junção com o vidro plano, e e por isso que
           o veio da madeira entra sob a peca em tangencia, sem vinco (tmp/lente-textura.md). */
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
 * A REFRACAO, e com ela a DISPERSAO: o vidro real desvia o azul mais que o vermelho (Cauchy), e
 * e isso que da o friso de cristal na quina. Cada canal atravessa a lente com uma escala propria,
 * entao a separacao nasce PROPORCIONAL ao desvio — zero no centro plano, maxima na aresta.
 * ⚠ ELA SO VIVE COM DESFOQUE BAIXO: com `blur` 10 nao sobrava nada nem em 0,5 de dispersao. Com
 * o desvio no teto da Apple o desfoque voltou a 3, e a 0,10 ela da os 0,7px de friso que a Apple
 * tem (0,6 a 1,2px). Cobra +0,738 ms/q, e cabe nos 4,16 do quadro.
 *
 * @param {number} scale @param {number} dispersion @returns {string}
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

/* O LADO MAIOR DO MAPA. Acima disso ele nasce menor e o filtro o estica: o desvio e uma rampa
   suave, entao esticar nao aparece — e um palco de 1320x760 pediria 1 milhao de pixels no laco. */
const MAP_MAX = 600;

/* ⛔ O TETO DA LENTE E DE AREA, e ele custou uma reversao: o filtro refaz a peca INTEIRA a cada
   quadro em que algo se move sobre ela, e o preco cresce com o numero de pixels. Medido com a
   tela trabalhando (tmp/lente-area.mjs): 24 mil px 240 fps · 40 mil 240 · 59 mil 238 · 81 mil
   203 · 112 mil 120 · 2 milhoes (um palco) 24. O desfoque chapado do token, no mesmo palco, nao
   cobra nada — 240,2. O teto e 40 mil e nao 60: o tracing de GPU (tmp/palcos.md) cobra +0,017
   ms/q a 40 mil e +0,536 a 59 mil, e nenhuma peca do jogo cai nessa faixa — dock 24 mil,
   capsula da barra 17 mil. */
const LENS_AREA_MAX = 40000;

/**
 * INSTALA UMA LENTE com o id pedido, e devolve o elemento que a carrega.
 *
 * ⚠ Acima do teto de area ela devolve `null`, e quem chamou cai no desfoque do token.
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
  if (!(w > 8 && h > 8 && w * h <= LENS_AREA_MAX)) return null;
  /* A peca grande desenha o mapa em escala, e o `feImage` o estica de volta: `bevel` e `r` vao
     com ele, porque sao medidas DENTRO do mapa. `scale` fica, porque e desvio em pixel de tela. */
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

/* ⭐ A RECEITA DO VIDRO, uma para o jogo inteiro (ciclo 28). Medida na barra, um numero por vez,
   com o dono girando e olhando: o bisel e a faixa que refrata, a forca e quanto ela desvia, a
   escala e o ganho do mapa, o desfoque e a saturacao sao a vibrancia.
   ⛔ A SATURACAO PAGA O CORPO: com o corpo do dock em 0,32, baixar de 1,9 para 1,6 levou o croma
   do jacarandá de -2,85 para -6,57. As duas se calibram juntas.
   ⛔ O DESVIO TEM TETO, e era ELE que fazia a madeira parecer lupa — nao o desfoque. `scale: 17`
   dava pico de 8,5px, e acima de 8 o veio se PARTE na quina (2 a 4px e o ponto da Apple, e a
   regra e desvio <= 0,35 x bisel). Com o desvio menor e o desfoque de volta a 3, a madeira
   entorta na aresta em vez de embaçar. tmp/lente-textura.md, tmp/desvio.png */
export const RECIPE = {
  bevel: 13,
  force: 1,
  scale: 10,
  blur: 3,
  saturation: 1.9,
  /* O ganho de luz anda com a saturacao: o corpo escurece o fundo e a vibrancia devolve cor e
     energia. Sem ele o dock escurecia 0,96 de L; com ele, 0,2. Custo zero — o Skia funde
     `saturate` e `brightness` numa matriz de cor so. */
  brightness: 1.05,
  r: 16,
  s: 0.6,
  dispersion: 0.1,
};

/* ⛔ A ARESTA E UMA FAIXA DE LARGURA FIXA EM PIXEL, e nao um gradiente da altura da peca. Como
   fracao ela esticava: 6,5px de zenite no dock (62 de altura) contra 180px no palco (1718) —
   30x de divergencia, medido (tmp/aresta-divergencia.md). Aresta que estica deixa de ser luz
   na quina e vira mancha escorrendo pelo painel. Na Apple a reflexao e funcao da normal da
   superficie, e o bisel tem largura fisica: a quina acende sempre nos mesmos poucos pixels. */
/* ⭐ OS NUMEROS SAO OS DA APPLE (HIG Materials e WWDC23 10076, pela pesquisa 12): zenite 0,40,
   meio 0,08, rim 0,18. Eu tinha escalado a rampa inteira por 0,7 e isso me afastou deles. */
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
 * A ARESTA DA PECA: as paradas sao distancias em PIXEL da quina, convertidas na fracao que o
 * gradiente pede. Numa peca de 57px o zenite ocupa os 11 primeiros; numa de 1718, os mesmos 11.
 *
 * @param {number} h @returns {Ramp}
 */
export function fresnelFor(h) {
  /** @type {Ramp} */
  const cru = [
    ...ZENITH.map(([px, a]) => /** @type {[number, number]} */ ([px / h, a])),
    [0.5, MIDDLE],
    ...NADIR.map(([px, a]) => /** @type {[number, number]} */ ([1 - px / h, a])),
  ];
  /* ⛔ AS PARADAS TEM DE SUBIR: fora de ordem, o SVG ignora o gradiente inteiro e a peca perde
     a aresta. Numa peca muito baixa o zenite e o rim se encontram, e o meio some. */
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

/* ⭐ A ESCALA DO VIDRO — UMA tinta, UMA direcao, UMA aresta, tres densidades.
   ⛔ ANTES ERAM SEIS MATERIAIS: tinta vermelha numas pecas e azul noutras (14,20,31 · 18,26,40 ·
   24,33,50), corpo de 0,07 a 0,72, e o gradiente correndo em direcoes opostas — o dock clareava
   para baixo e o palco escurecia. Lado a lado sobre a mesma madeira nao pareciam a mesma peca
   (tmp/auditoria-vidro.png), e "cada bloco parece um liquid glass diferente" e a critica que
   criou este sistema. Agora a peca escolhe DENSIDADE, e nada mais. */
export const GLASS_TINT = "14,20,31";

/* A luz vem de cima: o topo e mais claro porque reflete, e a base e mais densa. Uma direcao so. */
/** @type {Ramp} */
const BASE_BODY = [
  [0, 0.41],
  [0.5, 0.44],
  [1, 0.48],
];

/** @typedef {{ body: Ramp, tint: string }} Level */

/* ⛔ O RAIO SEGUE A PECA, e sao DOIS degraus para o jogo inteiro. Eram quatro valores teclados
   peca a peca — 16 na capsula, 18 na coluna, 22 no dock, 24 no palco —, e quatro raios em cinco
   superficies e o que faz cada menu parecer de um jogo diferente. A peca baixa e uma capsula; a
   alta e um painel.
   @param {number} h @returns {number} */
export const radiusFor = (/** @type {number} */ h) => (h <= 96 ? 18 : 24);

/* A aresta sai inteira de `fresnelFor`, nos valores da Apple: nao ha forca por peca. */
export const EDGE_FORCE = 1;

/** @type {Record<"thin" | "regular" | "thick", Level>} */
export const LEVELS = {
  /* THIN — informacao que nao se toca, e que precisa deixar o fundo passar. */
  thin: { body: scaleRamp(BASE_BODY, 0.45), tint: GLASS_TINT },
  /* REGULAR — a peca que carrega a tela: dock, coluna, palco. */
  regular: { body: BASE_BODY, tint: GLASS_TINT },
  /* THICK — o que se pressiona, e por isso tem peso. */
  thick: { body: scaleRamp(BASE_BODY, 1.45), tint: GLASS_TINT },
};

let glazed = 0;

/**
 * VESTE UMA PECA DE VIDRO: mede a caixa, instala a lente, pinta a pele e escreve `--glaze`.
 * ⛔ A medida e de LAYOUT: o gesto escala o botao, e `getBoundingClientRect` devolveria a peca
 * esmagada. ⛔ A lente so se refaz quando o tamanho muda: recriada a cada pintura, o navegador
 * nao re-resolve `url(#id)` e o filtro vira nada em silencio. ⛔ A receita vai na VARIAVEL e nao
 * no `backdrop-filter`: filtro inline nao se apaga por CSS, e e por CSS que o rail perde o
 * desfoque na troca de tela — sem isso o pisca laranja volta.
 *
 * @param {HTMLElement} node
 * @param {{ body: Ramp, edge?: Ramp, gleam?: number, r?: number, tint?: string }} paint a aresta
 *   e o raio saem da CAIXA quando nao vem escritos: os dois sao geometria, e nao material.
 */
export function glaze(node, { body, edge, gleam = 0, r, tint }) {
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  /* ⛔ O RAIO SAI DO CSS, e nao de um numero teclado aqui: a pele e uma imagem desenhada na
     caixa, e se ela curva num raio e o `border-radius` recorta noutro a peca ganha duas
     silhuetas. `radiusFor` e so o fallback de quem nao declarou. */
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
      /* Peca grande demais para a lente: ela fica com a pele e com o desfoque do token. */
      node.style.removeProperty("--glaze");
    }
    node.dataset["dressed"] = stamp;
  }
  if (node.dataset["painted"] === stamp) return;
  node.dataset["painted"] = stamp;
  node.style.backgroundImage = `url("${skin({ w, h, r, s: RECIPE.s, body, edge, gleam, tint })}")`;
}
