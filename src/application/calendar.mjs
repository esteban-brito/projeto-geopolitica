/* O CALENDÁRIO DO MANDATO — o que vence agora, e o que vence no trimestre.
   ⚠ ELE E FUNÇÃO PURA DE `month`, e isso e a restrição inteira: nenhuma linha aqui lê relógio.
   `Date.now` faria a mesma partida, com a mesma semente, mostrar prazos diferentes conforme o
   dia em que ela fosse aberta — e o mandato deixaria de se refazer da semente. */

import { CALENDAR, REPEATS } from "../data/calendar.mjs";
import { MONTHS_PER_YEAR } from "../data/regime.mjs";

/** @typedef {import("../data/calendar.mjs").Landmark} Landmark */

/* O TRIMESTRE, e ele e a janela do "o que vem": três meses e o horizonte em que uma decisão de
   orcamento ainda da para ser tomada — abaixo disso o jogador só assiste. */
export const AHEAD = 3;

/**
 * Em quantos meses este marco vence, contando do mês dado. Zero e "vence agora".
 *
 * @param {Landmark} landmark
 * @param {number} month o mes da partida
 * @returns {number}
 */
function dueIn(landmark, month) {
  /* O mês do ANO em que a partida esta, de 1 a 12 — a mesma conta de `monthLabel`. */
  const ofYear = (month % MONTHS_PER_YEAR) + 1;
  const period = REPEATS[landmark.id] ?? MONTHS_PER_YEAR;

  /* ⚠ O RESTO PRECISA DO PERÍODO SOMADO ANTES, e não e preciosismo: em JavaScript `-1 % 12` da
     `-1`, e sem isto um marco que já passou no ano apareceria como vencido há meses em vez de
     vencer no ano que vem. */
  return (((landmark.month - ofYear) % period) + period) % period;
}

/**
 * O QUE O MÊS COBRA, e o que o trimestre já cobra.
 *
 * ⚠ O JOGO TINHA 48 MESES E NENHUM ERA DIFERENTE DO OUTRO, e e por isso que avançar parecia
 * apertar um botão em vez de governar. O ano fiscal tem forma, e ela e a mesma todo ano.
 *
 * @param {number} month o mes da partida
 * @param {ReadonlyArray<Landmark>} [landmarks]
 * @returns {{ now: Landmark[], soon: Array<Landmark & { due: number }> }}
 */
export function calendarOf(month, landmarks = CALENDAR) {
  /** @type {Landmark[]} */
  const now = [];
  /** @type {Array<Landmark & { due: number }>} */
  const soon = [];

  for (const landmark of landmarks) {
    const due = dueIn(landmark, month);
    if (due === 0) now.push(landmark);
    else if (due <= AHEAD) soon.push({ ...landmark, due });
  }

  /* O mais próximo primeiro: a fila e de urgência, e não a ordem do catálogo. */
  soon.sort((a, b) => a.due - b.due);
  return { now, soon };
}
