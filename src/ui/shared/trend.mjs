/* A TENDENCIA DE UM INDICE — quanto ele andou, e EM QUANTO TEMPO.
   ── POR QUE UM ARQUIVO, PARA UMA SUBTRACAO Porque duas telas mostram a variacao da MESMA
   area, e elas mostravam numeros diferentes. */

import { UI } from "../strings.mjs";

/* MEDIDO ANTES DA TROCA, num mandato passivo de 30 meses: com SEIS degraus, tres das quatro
   escadas saem com UM degrau so — planas do primeiro ao ultimo mes. */
export const WINDOW = 12;

/* O primeiro a ser recalibrado divergiria do outro, e o sintoma seria a mesma inflacao com
   dois desenhos na mesma janela do jogo. */
export const SCALE = /** @type {const} */ ({
  inflation: [0, 0.15],
  rate: [0, 0.25],
  unemployment: [0, 0.2],
  debtRatio: [0.4, 1.2],
});

/* ⚠ `approval: [0, 60]` E `base: [0, 513]` FORAM ESCRITAS E RETIRADAS EM, junto com a escada
   dos vitais que as consumia — a captura reprovou a peca por largura, e regua sem desenho e
   um numero esperando envelhecer. */

/* ⚠ ERA 1,5 — meia vez a mais que a largada — e o numero era um chute que nunca tinha sido
   medido. */
const GDP_SPAN = 1.2;

/**
 * A REGUA DO PIB, e ela nao e fixa: ancora na PROPRIA largada da partida.
 *
 * @param {ReadonlyArray<number>} gdp a serie, o mais antigo na frente
 * @param {number} fallback o PIB de hoje, para a partida que ainda nao guardou mes nenhum
 * @returns {readonly [number, number]}
 */
export function gdpRange(gdp, fallback) {
  const opening = gdp[0] ?? fallback;
  return [opening, opening * GDP_SPAN];
}

/**
 * @typedef {object} Trend
 * @property {number} delta - quanto o indice andou na janela, com sinal
 * @property {number} months - a janela que o historico de fato suportou
 */

/**
 * O singular mora aqui e nao no template porque ele e a mesma frase: espalhar a escolha por
 * duas telas e como as duas variacoes divergiram em primeiro lugar.
 *
 * @param {number} months
 * @returns {string}
 */
export function windowLabel(months) {
  return `${UI.window.over} ${months} ${months === 1 ? UI.window.month : UI.window.months}`;
}

/**
 * QUANTO ANDOU, E EM QUANTOS MESES — ou `null` quando nao ha passado guardado.
 *
 * @param {number} value o indice de hoje
 * @param {ReadonlyArray<number>} history o passado guardado, o mais antigo na frente
 * @returns {Trend | null}
 */
export function trendOf(value, history) {
  /* O ULTIMO VALOR DO HISTORICO E O DE HOJE — a MALHA o empurra ao fechar o mes —, entao a
     janela disponivel e o comprimento MENOS UM. */
  const months = Math.min(WINDOW, history.length - 1);
  if (months < 1) return null;

  const then = history[history.length - 1 - months];
  if (then === undefined) return null;

  return { delta: value - then, months };
}

/**
 * PARA QUE LADO A LEITURA ANDOU — ou `null` quando nao ha com que comparar.
 *
 * ⚠ AUSENCIA NAO E RESULTADO: numa recarga nao existe mes anterior, e desenhar "nao moveu"
 * ali afirmaria que nada andou num mandato em que tudo andou.
 * ⚠ E O LIMIAR E O DA LEITURA ARREDONDADA: as duas colunas imprimem inteiro, e uma seta ao
 * lado de um numero que nao mudou na tela faz a cor negar o numero.
 *
 * @param {number} now
 * @param {number | undefined} before
 * @param {1 | -1} good 1 quando subir e bom; -1 quando subir e ruim
 * @returns {"up" | "down" | "flat" | null}
 */
export function directionOf(now, before, good) {
  if (before === undefined) return null;
  const moved = now - before;
  if (Math.abs(moved) < 0.5) return "flat";
  return moved * good > 0 ? "up" : "down";
}
