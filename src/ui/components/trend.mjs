/* A TENDÊNCIA DE UM ÍNDICE — quanto ele andou, e EM QUANTO TEMPO.
   ── POR QUE UM ARQUIVO, PARA UMA SUBTRAÇÃO Porque duas telas mostram a variação da MESMA
   área, e elas mostravam números diferentes. */

import { UI } from "../strings.mjs";

/* MEDIDO ANTES DA TROCA, num mandato passivo de 30 meses: com SEIS degraus, três das quatro
   escadas saem com UM degrau só — planas do primeiro ao último mês. */
export const WINDOW = 12;

/* O primeiro a ser recalibrado divergiria do outro, e o sintoma seria a mesma inflação com
   dois desenhos na mesma janela do jogo. */
export const SCALE = /** @type {const} */ ({
  inflation: [0, 0.15],
  rate: [0, 0.25],
  unemployment: [0, 0.2],
  debtRatio: [0.4, 1.2],
});

/* ⚠ `approval: [0, 60]` E `base: [0, 513]` FORAM ESCRITAS E RETIRADAS EM, junto com a escada
   dos vitais que as consumia — a captura reprovou a peça por largura, e régua sem desenho é
   um número esperando envelhecer. */

/* ⚠ ERA 1,5 — meia vez a mais que a largada — e o número era um chute que nunca tinha sido
   medido. */
const GDP_SPAN = 1.2;

/**
 * A RÉGUA DO PIB, e ela não é fixa: ancora na PRÓPRIA largada da partida.
 *
 * @param {ReadonlyArray<number>} gdp a série, o mais antigo na frente
 * @param {number} fallback o PIB de hoje, para a partida que ainda não guardou mês nenhum
 * @returns {readonly [number, number]}
 */
export function gdpRange(gdp, fallback) {
  const opening = gdp[0] ?? fallback;
  return [opening, opening * GDP_SPAN];
}

/**
 * @typedef {object} Trend
 * @property {number} delta - quanto o índice andou na janela, com sinal
 * @property {number} months - a janela que o histórico de fato suportou
 */

/**
 * O singular mora aqui e não no template porque ele é a mesma frase: espalhar a escolha por
 * duas telas é como as duas variações divergiram em primeiro lugar.
 *
 * @param {number} months
 * @returns {string}
 */
export function windowLabel(months) {
  return `${UI.window.over} ${months} ${months === 1 ? UI.window.month : UI.window.months}`;
}

/**
 * QUANTO ANDOU, E EM QUANTOS MESES — ou `null` quando não há passado guardado.
 *
 * @param {number} value o índice de hoje
 * @param {ReadonlyArray<number>} history o passado guardado, o mais antigo na frente
 * @returns {Trend | null}
 */
export function trendOf(value, history) {
  /* O ÚLTIMO VALOR DO HISTÓRICO É O DE HOJE — a MALHA o empurra ao fechar o mês —, então a
     janela disponível é o comprimento MENOS UM. */
  const months = Math.min(WINDOW, history.length - 1);
  if (months < 1) return null;

  const then = history[history.length - 1 - months];
  if (then === undefined) return null;

  return { delta: value - then, months };
}

/**
 * PARA QUE LADO A LEITURA ANDOU — ou `null` quando não há com que comparar.
 *
 * ⚠ AUSÊNCIA NÃO É RESULTADO: numa recarga não existe mês anterior, e desenhar "não moveu"
 * ali afirmaria que nada andou num mandato em que tudo andou.
 * ⚠ E O LIMIAR É O DA LEITURA ARREDONDADA: as duas colunas imprimem inteiro, e uma seta ao
 * lado de um número que não mudou na tela faz a cor negar o número.
 *
 * @param {number} now
 * @param {number | undefined} before
 * @param {1 | -1} good 1 quando subir é bom; -1 quando subir é ruim
 * @returns {"up" | "down" | "flat" | null}
 */
export function directionOf(now, before, good) {
  if (before === undefined) return null;
  const moved = now - before;
  if (Math.abs(moved) < 0.5) return "flat";
  return moved * good > 0 ? "up" : "down";
}
