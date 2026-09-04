/* O VIDRO DA BARRA — quem veste as tres pecas, e quem move o botao.

   ⭐ AS TRES SAO A MESMA PECA. A lente, a quina, a aresta e a sombra saem daqui para as
   tres; o que muda entre elas e a tinta do corpo — vidro escuro nos dois blocos, branco no
   botao. Mexer numa parada muda as tres, e e isso que as mantem uma familia. */

import { installLens, scaleRamp, skin } from "./glass.mjs";
import { between, spring } from "./spring.mjs";

/* ⚠ MEDIDO NO CLONE, um por um, com o dono girando o numero e olhando: o bisel e a faixa que
   refrata, a forca e quanto ela desvia, a escala e o ganho do mapa. */
const LENS = { bevel: 13, force: 1, scale: 17, blur: 2.6, saturation: 1.9, r: 16, s: 0.6 };

/** @typedef {import("./glass.mjs").Ramp} Ramp */

/** @type {Ramp} */
const EDGE = [
  [0, 0.5],
  [0.08, 0.34],
  [0.2, 0.15],
  [0.42, 0.07],
  [0.66, 0.06],
  [0.86, 0.13],
  [1, 0.24],
];

/* ⛔ BRANCO TRANSLUCIDO SOBRE PRETO NAO DA BRANCO — DA CINZA. Em 0,50 o corpo compunha
   `rgb(116,118,127)` e o botao ficava escuro. Sobre um fundo quase preto o que faz uma peca
   LER como vidro nao e o que passa por ela: e o brilho e a aresta. */
/** @type {Ramp} */
const GLASS_BODY = [
  [0, 0.085],
  [0.45, 0.03],
  [1, 0.022],
];
/** @type {Ramp} */
const WHITE_BODY = [
  [0, 0.93],
  [0.44, 0.83],
  [1, 0.77],
];
const GLEAM = 0.7;

/* A aresta do bloco e metade da do botao: nele ela desenha a peca inteira, aqui ela so fecha
   a silhueta — borda forte sobre corpo transparente le como contorno, e nao como vidro. */
const BLOCK_EDGE = scaleRamp(EDGE, 0.52);
const HOVER_EDGE = scaleRamp(EDGE, 1.4);

/* ⚠ 0,78 E O PISO DA CONDENSADA, medido no clone: abaixo disso a haste vertical afina mais
   de um quinto e a letra deixa de ler como condensada e passa a ler como espremida. */
const FLOOR = 0.78;

/* A sangria lateral da peca, para descontar da largura util. */
const PAD = 10;

let lensCount = 0;

/**
 * @param {HTMLElement} node
 * @param {{ body: Ramp, edge: Ramp, gleam?: number }} paint
 */
function dress(node, { body, edge, gleam = 0 }) {
  /* ⛔ A MEDIDA E DE LAYOUT E NAO VISUAL: o gesto escala o botao, e `getBoundingClientRect`
     devolveria a peca esmagada — a pele nasceria com o tamanho do meio do gesto. */
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  if (w < 9 || h < 9) return;

  /* ⛔ E A LENTE SO SE REFAZ QUANDO O TAMANHO MUDA. Removendo e recriando o filtro a cada
     pintura, o navegador nao re-resolve `url(#id)`: a referencia morre com o no antigo e o
     `backdrop-filter` vira nada, EM SILENCIO — o botao perdia o vidro no primeiro mes. */
  const stamp = `${w}x${h}x${gleam}x${body[0]?.[1]}`;
  if (node.dataset["dressed"] !== stamp) {
    const id = node.dataset["lens"] ?? `topbar-lens-${(lensCount += 1)}`;
    node.dataset["lens"] = id;
    document.querySelector(`svg[data-lens="${id}"]`)?.remove();
    if (
      installLens({
        id,
        w,
        h,
        r: LENS.r,
        s: LENS.s,
        bevel: LENS.bevel,
        force: LENS.force,
        scale: LENS.scale,
        blur: LENS.blur,
      })
    ) {
      const filter = `url(#${id}) saturate(${LENS.saturation})`;
      node.style.backdropFilter = filter;
      node.style.setProperty("-webkit-backdrop-filter", filter);
    }
    node.dataset["dressed"] = stamp;
  }
  if (node.dataset["painted"] === stamp) return;
  node.dataset["painted"] = stamp;
  node.style.backgroundImage = `url("${skin({ w, h, r: LENS.r, s: LENS.s, body, edge, gleam })}")`;
}

/**
 * AS DUAS LINHAS DO BLOCO SAO JUSTIFICADAS AO MESMO EIXO — o M do mes e o M da nota saem do
 * mesmo pixel, e o ultimo digito do ano e a ultima letra da nota terminam no mesmo.
 *
 * ⛔ TRES DEFEITOS TRAVARAM ISTO, e nenhum aparece na caixa: a medida tem de ser do DESENHO
 * e nao da caixa, que carrega o rastreio de sobra; a largura tem de ser travada antes da
 * escala, senao a margem da primeira linha estreita o bloco e a segunda mede outra coisa; e
 * nada pode ser medido antes de a fonte chegar.
 *
 * @param {HTMLElement} block
 * @param {number} squeeze
 */
function justify(block, squeeze) {
  const lines = [block.querySelector(".when__date"), block.querySelector(".when__note")];
  if (!lines[0] || !lines[1]) return;
  const said = `${lines[0].textContent}|${lines[1].textContent}|${squeeze}|${document.fonts.status}`;
  if (block.dataset["said"] === said) return;
  block.dataset["said"] = said;
  for (const line of lines) {
    if (!(line instanceof HTMLElement)) continue;
    line.style.cssText = "";
    /* Fora de um flex a regua vertical perde a largura, e ela e item de flex. */
    line.style.display = "inline-flex";
    line.style.transformOrigin = "left center";
    /* ⛔ LIMPAR O ESTILO INLINE DEVOLVE A REGRA DA FOLHA, e ela ja comprime: sem zerar aqui, a
       largura "natural" vinha com a escala dentro e a conta a aplicava duas vezes — a nota
       saia 8% mais larga que a peca e encostava na aresta. */
    line.style.transform = "none";
  }
  /* ⛔ A MEDIDA E DA CAIXA E NAO DA TINTA, e a diferenca custou uma rodada: quem a escala
     transforma e a caixa, e ela carrega os vaos do flex que a tinta nao ve. Medindo a tinta,
     a nota fechava 141 onde a conta previa 132,5 e encostava na aresta da peca.
     ⚠ E so pode ser assim porque o rastreio daqui e 0,01em: com os 0,16em dos rotulos a
     caixa levaria um vao inteiro depois da ultima letra. */
  const inked = lines.map(line =>
    line instanceof HTMLElement ? line.getBoundingClientRect().width : 0,
  );
  /* ⭐ O ALVO E A LARGURA DA PECA, e nao a linha de cima. A peca e fixa — dimensionada no
     conteudo mais largo do catalogo —, entao nada aqui muda de tamanho de um mes para o
     outro: e isso que faz a barra ler como MENU e nao como tela que se refaz.
     ⚠ E NINGUEM ESTICA: a compressao tem teto no valor escolhido por ele e piso em 0,78,
     abaixo do qual a letra deixa de ser condensada e passa a ser esmagada. A linha que sobra
     curta fica centrada, e nao puxada ate a aresta. */
  const target = block.clientWidth - PAD * 2;
  if (target <= 0) return;
  for (const [i, line] of lines.entries()) {
    if (!(line instanceof HTMLElement)) continue;
    const own = inked[i] ?? 1;
    const scale = Math.max(FLOOR, Math.min(squeeze, target / own));
    line.style.width = `${own.toFixed(2)}px`;
    line.style.transform = `scaleX(${scale.toFixed(4)})`;
    line.style.marginRight = `${(own * scale - own).toFixed(2)}px`;
  }
}

/* ⛔ A FONTE PODE CHEGAR DEPOIS DA PRIMEIRA MEDIDA, e ai a largura fica PRESA na metrica
   errada: `justify` grava `width` em pixel e o `said` recusa a segunda passada, porque texto e
   compressao continuam os mesmos. Medido com a fonte atrasada em 300ms: as duas linhas do bloco
   do mes vazam 5px, e nada as devolve. */
let awaited = false;

/**
 * VESTE A BARRA — a cada pintura, porque toda peca aqui depende do proprio tamanho.
 *
 * @param {ParentNode} root
 * @returns {void}
 */
export function dressTopbar(root) {
  if (!awaited && document.fonts.status !== "loaded") {
    awaited = true;
    document.fonts.ready.then(() => dressTopbar(root));
  }

  const style = getComputedStyle(document.documentElement);
  const squeeze = Number(style.getPropertyValue("--when-squeeze")) || 0.9;

  const when = root.querySelector(".piece--when");
  if (when instanceof HTMLElement) justify(when, squeeze);

  for (const piece of root.querySelectorAll(".piece")) {
    if (piece instanceof HTMLElement) dress(piece, { body: GLASS_BODY, edge: BLOCK_EDGE });
  }
  const advance = root.querySelector(".go");
  if (advance instanceof HTMLElement) {
    dress(advance, { body: WHITE_BODY, edge: EDGE, gleam: GLEAM });
    const w = advance.offsetWidth;
    const h = advance.offsetHeight;
    const cold = skin({ w, h, r: LENS.r, s: LENS.s, body: WHITE_BODY, edge: EDGE, gleam: GLEAM });
    const warm = skin({
      w,
      h,
      r: LENS.r,
      s: LENS.s,
      body: WHITE_BODY,
      edge: HOVER_EDGE,
      gleam: GLEAM,
    });
    const edge = advance.querySelector(".go__edge");
    const glow = advance.querySelector(".go__warm");
    if (edge instanceof HTMLElement) edge.style.backgroundImage = `url("${cold}")`;
    if (glow instanceof HTMLElement) glow.style.backgroundImage = `url("${warm}")`;
  }
}

/* ⚠ PRESSIONAR E SOLTAR NAO USAM A MESMA MOLA: descer e INFORMACAO — imediato e sem quique —,
   e voltar e MATERIA. E a gota volta tremendo mais que o toque de proposito: a viagem e de
   6,6px na largura, e a 0,55 ela ultrapassa 1,4px; com o quique do toque daria 0,45px, e a
   gota voltaria por decreto. */
const SQUASH = { duration: 0.14, bounce: 0 };
const POUR = { duration: 0.46, bounce: 0.55 };
const SQUASH_X = 1.045;
const SQUASH_Y = 0.915;

/**
 * O GESTO DO BOTAO — a mola por quadro, e o liquido que conserva volume.
 *
 * ⛔ O QUADRO SO TOCA TRANSFORMACAO E OPACIDADE, e e a regra inteira: as duas o compositor
 * resolve sozinho. Reescrever a sombra ou regerar a imagem da aresta por quadro REPINTA, e
 * foi isso que travava na volta.
 *
 * @param {HTMLButtonElement} button
 * @returns {void}
 */
export function bindAdvance(button) {
  if (button.dataset["bound"]) return;
  button.dataset["bound"] = "true";

  const env = button.closest(".go-env");
  const floatBox = env?.querySelector(".go-float");
  const high = env?.querySelector(".go-shade--high");
  const warm = button.querySelector(".go__warm");
  const stack = button.querySelector(".go__stack");
  const hint = button.querySelector(".go__hint");
  if (
    !(floatBox instanceof HTMLElement) ||
    !(high instanceof HTMLElement) ||
    !(warm instanceof HTMLElement) ||
    !(stack instanceof HTMLElement) ||
    !(hint instanceof HTMLElement)
  ) {
    return;
  }

  let lift = 0;
  let liquid = 0;
  /* ⚠ O ROTULO TEM MOLA PROPRIA, mais lenta: dentro de um fluido o que esta suspenso nao
     acompanha a parede do copo, e e o atraso que faz a materia parecer viscosa. */
  let drag = 0;

  const draw = () => {
    floatBox.style.transform = `translate3d(0,${between(0, -3, lift).toFixed(3)}px,0)`;
    /* A DEFORMACAO CONSERVA VOLUME: o que a largura ganha, a altura perde. */
    button.style.transform =
      `scale3d(${between(1, SQUASH_X, liquid).toFixed(4)},` +
      `${between(1, SQUASH_Y, liquid).toFixed(4)},1)`;
    high.style.opacity = lift.toFixed(3);
    warm.style.opacity = between(0, 0.8, lift).toFixed(3);

    /* O rotulo resiste a deformacao — ele nao e o fluido, esta DENTRO dele. E ele nao responde
       ao hover: quem entra na peca e a leitura, e a palavra que ja estava la nao se mexe para
       dar lugar a uma que ainda nao existe. */
    stack.style.transform =
      `scale3d(${between(1, 1 / SQUASH_X, drag).toFixed(4)},` +
      `${between(1, 1 / SQUASH_Y, drag).toFixed(4)},1)`;

    /* ⚠ O ATRASO E DO MOVIMENTO e nao de um relogio: a leitura so comeca depois de um quinto
       do caminho, entao ela acompanha a interrupcao. E a rampa tem ombro — com um corte reto
       ela sumia de uma vez enquanto todo o resto continuava suavizando. */
    const raw = Math.max(0, Math.min(1, (lift - 0.2) / 0.8));
    const t = raw * raw * (3 - 2 * raw);
    hint.style.opacity = t.toFixed(3);
    const grow = between(0.9, 1, t).toFixed(4);
    hint.style.transform = `translate3d(0,${between(9, 0, t).toFixed(3)}px,0) scale3d(${grow},${grow},1)`;
  };

  const open = spring(
    value => {
      lift = value;
      draw();
    },
    { duration: 0.4, bounce: 0 },
  );
  const pour = spring(value => {
    liquid = value;
    draw();
  }, SQUASH);
  const trail = spring(
    value => {
      drag = value;
      draw();
    },
    { duration: 0.42, bounce: 0.2 },
  );

  /* ⛔ BOTAO MORTO NAO SE ACENDE: quem escuta e o envoltorio, que nunca desabilita, entao
     no fim do mandato a peca erguia, clareava e abria a leitura de um botao que nao faz
     nada. A saida continua livre, que e o que impede o hover preso. */
  const enter = () => {
    if (button.disabled) return;
    open(1);
  };
  const leave = () => {
    open(0);
    pour(0, POUR);
    trail(0, POUR);
  };

  /* ⛔ QUEM ESCUTA E O ENVOLTORIO E NAO O BOTAO, e o defeito so aparece depois do clique:
     botao desabilitado nao recebe evento de ponteiro, e ele desabilita durante a virada do
     mes. Se o mouse saisse nesse intervalo o `pointerleave` nunca chegava, e a peca ficava
     presa no hover — erguida, com a leitura acesa, ate o proximo gesto.
     ⭐ E o envoltorio nunca desabilita: ele fica parado e so escuta. */
  const wrap = /** @type {HTMLElement} */ (env ?? button);
  wrap.addEventListener("pointerenter", enter);
  wrap.addEventListener("pointerleave", leave);
  button.addEventListener("focus", enter);
  button.addEventListener("blur", leave);
  wrap.addEventListener("pointerdown", () => {
    if (button.disabled) return;
    pour(1, SQUASH);
    trail(1, SQUASH);
  });
  wrap.addEventListener("pointerup", () => {
    pour(0, POUR);
    trail(0, POUR);
  });
  draw();
}
