/* ── ELA SUBSTITUIU O HEMICICLO, E A SUBSTITUIÇÃO É A DECISÃO ──────────────── O hemiciclo
   desenhava 513 círculos num arco e custava 170px de uma coluna de 899. */

import { escapeHtml } from "./html.mjs";
import { seats } from "./format.mjs";
import { UI } from "../strings.mjs";

/* CINCO FAIXAS. */
const STOPS = 5;

/**
 * EM QUE FAIXA DO EIXO UMA BANCADA CAI.
 *
 * @param {number} economic de 0 a 100
 * @returns {number} de 1 a 5
 */
function stopOf(economic) {
  const index = Math.floor((economic / 100) * STOPS);
  return Math.min(STOPS, Math.max(1, index + 1));
}

/**
 * @param {object} input
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 * delivered: number, mood: string }>} input.benches
 * @param {number} input.total o plenário inteiro
 * @param {number} input.majority quantos votos fecham uma maioria simples
 * @returns {string}
 */
export function ribbonHtml({ benches, total, majority }) {
  /* AS FAIXAS SE SOMAM, e a soma é o conserto da confusão. */
  /** @type {Map<number, { seats: number, delivered: number }>} */
  const bands = new Map();
  for (const bench of benches) {
    const stop = stopOf(bench.economic);
    const band = bands.get(stop) ?? { seats: 0, delivered: 0 };
    band.seats += bench.seats;
    band.delivered += bench.delivered;
    bands.set(stop, band);
  }

  const blocks = [...bands.entries()]
    .sort(([a], [b]) => a - b)
    .map(([stop, band]) => {
      /* ⚠ A FRAÇÃO ENTREGUE É A ÚNICA CONTA DESTA VIEW. */
      const held = band.seats > 0 ? Math.min(1, band.delivered / band.seats) : 0;

      return (
        `<span class="ribbon__bench" data-axis="${stop}" ` +
        `style="flex-grow:${band.seats.toFixed(1)}">` +
        `<span class="ribbon__held" style="flex-basis:${(held * 100).toFixed(1)}%"></span>` +
        `</span>`
      );
    })
    .join("");

  const held = benches.reduce((sum, bench) => sum + bench.delivered, 0);

  /* ONDE A LINHA CAI. */
  const at = total > 0 ? (majority / total) * 100 : 50;

  return (
    `<div class="ribbon" role="img" ` +
    `aria-label="${escapeHtml(
      `${Math.round(held)} de ${total} ${UI.cabinet.ribbonRead} ` +
        `${bands.size} ${UI.cabinet.ribbonBenches} ${majority}`,
    )}">` +
    blocks +
    `<span class="ribbon__majority" style="left:${at.toFixed(2)}%"></span>` +
    `</div>` +
    /* ⚠ CINCO CORES SEM CHAVE É UM GRÁFICO QUE SÓ O AUTOR LÊ, e este projeto já pagou um dia
       inteiro por isso. */
    `<p class="ribbon__key">` +
    `<span>${escapeHtml(UI.cabinet.axisLeft)}</span>` +
    `<b>${escapeHtml(UI.cabinet.majority)} <span data-numeric>${seats(majority)}</span></b>` +
    `<span>${escapeHtml(UI.cabinet.axisRight)}</span>` +
    `</p>`
  );
}
