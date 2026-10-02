/* O VIDRO DA BARRA — quem veste as três peças, e quem move o botão.

   ⭐ AS TRÊS SÃO A MESMA PEÇA. A lente, a quina, a aresta e a sombra saem daqui para as
   três; o que muda entre elas e a tinta do corpo — vidro escuro nos dois blocos, branco no
   botão. Mexer numa parada muda as três, e e isso que as mantem uma família. */

import { FRESNEL, LEVELS, RECIPE, glaze, scaleRamp, skin } from "../core/glass.mjs";
import { between, spring } from "../core/spring.mjs";

/* A lente, a quina, o desfoque, a tinta e a aresta são a ESCALA de `glass.mjs` (ciclo 28): a
   barra só escolhe o NÍVEL de densidade. */

/** @typedef {import("../core/glass.mjs").Ramp} Ramp */

const EDGE = FRESNEL;

/* ⛔ O ÚNICO CORPO PRÓPRIO DO JOGO, e ele não e um segundo material: e a peça CHEIA do sistema,
   o botão primário. BRANCO TRANSLÚCIDO SOBRE PRETO NÃO DA BRANCO — DA CINZA: em 0,50 o corpo
   compunha `rgb(116,118,127)` e o botão ficava escuro. */
/** @type {Ramp} */
const WHITE_BODY = [
  [0, 0.93],
  [0.44, 0.83],
  [1, 0.77],
];
const GLEAM = 0.7;
const HOVER_EDGE = scaleRamp(EDGE, 1.9);

/* ⚠ 0,78 E O PISO DA CONDENSADA, medido no clone: abaixo disso a haste vertical afina mais
   de um quinto e a letra deixa de ler como condensada e passa a ler como espremida. */
const FLOOR = 0.78;

/* A sangria lateral da peça, para descontar da largura útil. */
const PAD = 10;

/**
 * AS DUAS LINHAS DO BLOCO SÃO JUSTIFICADAS AO MESMO EIXO — o M do mês e o M da nota saem do
 * mesmo pixel, e o último dígito do ano e a última letra da nota terminam no mesmo.
 *
 * ⛔ TRÊS DEFEITOS TRAVARAM ISTO, e nenhum aparece na caixa: a medida tem de ser do DESENHO
 * e não da caixa, que carrega o rastreio de sobra; a largura tem de ser travada antes da
 * escala, senão a margem da primeira linha estreita o bloco e a segunda mede outra coisa; e
 * nada pode ser medido antes de a fonte chegar.
 *
 * @param {HTMLElement} block
 * @param {number} squeeze
 */
function justify(block, squeeze) {
  const lines = [block.querySelector(".when__date"), block.querySelector(".when__note")];
  if (!lines[0] || !lines[1]) return;
  const said = `${lines[0].textContent}|${lines[1].textContent}|${squeeze}|${settled}`;
  if (block.dataset["said"] === said) return;
  block.dataset["said"] = said;
  for (const line of lines) {
    if (!(line instanceof HTMLElement)) continue;
    line.style.cssText = "";
    /* Fora de um flex a régua vertical perde a largura, e ela e item de flex. */
    line.style.display = "inline-flex";
    line.style.transformOrigin = "left center";
    /* ⛔ LIMPAR O ESTILO INLINE DEVOLVE A REGRA DA FOLHA, e ela já comprime: sem zerar aqui, a
       largura "natural" vinha com a escala dentro e a conta a aplicava duas vezes — a nota
       saia 8% mais larga que a peça e encostava na aresta. */
    line.style.transform = "none";
  }
  /* ⛔ A MEDIDA E DA CAIXA E NÃO DA TINTA, e a diferença custou uma rodada: quem a escala
     transforma e a caixa, e ela carrega os vãos do flex que a tinta não vê. Medindo a tinta,
     a nota fechava 141 onde a conta previa 132,5 e encostava na aresta da peça.
     ⚠ E só pode ser assim porque o rastreio daqui e 0,01em: com os 0,16em dos rótulos a
     caixa levaria um vão inteiro depois da última letra. */
  const inked = lines.map(line =>
    line instanceof HTMLElement ? line.getBoundingClientRect().width : 0,
  );
  /* ⭐ O ALVO E A LARGURA DA PEÇA, e não a linha de cima. A peça e fixa — dimensionada no
     conteúdo mais largo do catálogo —, então nada aqui muda de tamanho de um mês para o
     outro: e isso que faz a barra ler como MENU e não como tela que se refaz.
     ⚠ E NINGUÉM ESTICA: a compressão tem teto no valor escolhido por ele e piso em 0,78,
     abaixo do qual a letra deixa de ser condensada e passa a ser esmagada. A linha que sobra
     curta fica centrada, e não puxada até a aresta. */
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

/* ⛔ A FONTE PODE CHEGAR DEPOIS DA PRIMEIRA MEDIDA, e ai a largura fica PRESA na métrica
   errada: `justify` grava `width` em pixel e o `said` recusa a segunda passada, porque texto e
   compressão continuam os mesmos. Medido com a fonte atrasada em 300ms: as duas linhas do bloco
   do mês vazam 5px, e nada as devolve.
   ⛔ E `document.fonts.status` NÃO SERVE DE MARCADOR: ele diz "loaded" enquanto ninguém pediu
   face nenhuma, então a barra que pinta antes do primeiro pedido gravava "loaded" com a métrica
   de reserva e recusava a remedida. Medido: verde abrindo no Gabinete, 5px de vazamento abrindo
   no Congresso, no mesmo commit. */
let awaited = false;

/* Ele só vira true DEPOIS de `fonts.ready` resolver, e e a única coisa que o `said` aceita
   como prova de que a medida vale. */
let settled = false;

/**
 * VESTE A BARRA — a cada pintura, porque toda peça aqui depende do próprio tamanho.
 *
 * @param {ParentNode} root
 * @returns {void}
 */
export function dressTopbar(root) {
  if (!awaited) {
    awaited = true;
    document.fonts.ready.then(() => {
      settled = true;
      dressTopbar(root);
    });
  }

  const style = getComputedStyle(document.documentElement);
  const squeeze = Number(style.getPropertyValue("--when-squeeze")) || 0.9;

  const when = root.querySelector(".piece--when");
  if (when instanceof HTMLElement) justify(when, squeeze);

  for (const piece of root.querySelectorAll(".piece")) {
    if (piece instanceof HTMLElement) glaze(piece, LEVELS.thin);
  }
  const advance = root.querySelector(".go");
  if (advance instanceof HTMLElement) {
    glaze(advance, { body: WHITE_BODY, edge: EDGE, gleam: GLEAM });
    const w = advance.offsetWidth;
    const h = advance.offsetHeight;
    const cold = skin({
      w,
      h,
      r: RECIPE.r,
      s: RECIPE.s,
      body: WHITE_BODY,
      edge: EDGE,
      gleam: GLEAM,
    });
    const warm = skin({
      w,
      h,
      r: RECIPE.r,
      s: RECIPE.s,
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

/* ⚠ PRESSIONAR E SOLTAR NÃO USAM A MESMA MOLA: descer e INFORMACAO — imediato e sem quique —,
   e voltar e MATÉRIA. E a gota volta tremendo mais que o toque de propósito: a viagem e de
   6,6px na largura, e a 0,55 ela ultrapassa 1,4px; com o quique do toque daria 0,45px, e a
   gota voltaria por decreto. */
const SQUASH = { duration: 0.14, bounce: 0 };
const POUR = { duration: 0.46, bounce: 0.55 };
const SQUASH_X = 1.045;
const SQUASH_Y = 0.915;

/**
 * O GESTO DO BOTÃO — a mola por quadro, e o líquido que conserva volume.
 *
 * ⛔ O QUADRO SÓ TOCA TRANSFORMAÇÃO E OPACIDADE, e e a regra inteira: as duas o compositor
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
  /* ⚠ O RÓTULO TEM MOLA PRÓPRIA, mais lenta: dentro de um fluido o que esta suspenso não
     acompanha a parede do copo, e e o atraso que faz a matéria parecer viscosa. */
  let drag = 0;

  const draw = () => {
    floatBox.style.transform = `translate3d(0,${between(0, -3, lift).toFixed(3)}px,0)`;
    /* A DEFORMAÇÃO CONSERVA VOLUME: o que a largura ganha, a altura perde. */
    button.style.transform =
      `scale3d(${between(1, SQUASH_X, liquid).toFixed(4)},` +
      `${between(1, SQUASH_Y, liquid).toFixed(4)},1)`;
    high.style.opacity = lift.toFixed(3);
    warm.style.opacity = between(0, 0.8, lift).toFixed(3);

    /* O rótulo resiste a deformação — ele não e o fluido, esta DENTRO dele. E ele não responde
       ao hover: quem entra na peça e a leitura, e a palavra que já estava la não se mexe para
       dar lugar a uma que ainda não existe. */
    stack.style.transform =
      `scale3d(${between(1, 1 / SQUASH_X, drag).toFixed(4)},` +
      `${between(1, 1 / SQUASH_Y, drag).toFixed(4)},1)`;

    /* ⚠ O ATRASO E DO MOVIMENTO e não de um relógio: a leitura só começa depois de um quinto
       do caminho, então ela acompanha a interrupção. E a rampa tem ombro — com um corte reto
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

  /* ⛔ BOTÃO MORTO NÃO SE ACENDE: quem escuta e o envoltório, que nunca desabilita, então
     no fim do mandato a peça erguia, clareava e abria a leitura de um botão que não faz
     nada. A saída continua livre, que e o que impede o hover preso. */
  const enter = () => {
    if (button.disabled) return;
    open(1);
  };
  const leave = () => {
    open(0);
    pour(0, POUR);
    trail(0, POUR);
  };

  /* ⛔ QUEM ESCUTA E O ENVOLTÓRIO E NÃO O BOTÃO, e o defeito só aparece depois do clique:
     botão desabilitado não recebe evento de ponteiro, e ele desabilita durante a virada do
     mês. Se o mouse saísse nesse intervalo o `pointerleave` nunca chegava, e a peça ficava
     presa no hover — erguida, com a leitura acesa, até o próximo gesto.
     ⭐ E o envoltório nunca desabilita: ele fica parado e só escuta. */
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
