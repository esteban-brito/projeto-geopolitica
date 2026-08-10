/* PAINEL DO MES — views PURAS.
   ══════════════════════════════════════════════════════════════════════════════
   Nenhuma funcao daqui toca o DOM, le o relogio ou guarda estado. Elas recebem
   dado e devolvem string. Quem aplica ao documento e `app.mjs`, e essa fronteira
   e o que permite testar a tela inteira em Node, sem navegador. */

import { escapeHtml } from "../shared/html.mjs";
import { UI } from "../strings.mjs";
import { monthLabel } from "../../state/state.mjs";

/** @typedef {import("../../state/state.mjs").GameState} GameState */
/** @typedef {import("../../state/state.mjs").Approval} Approval */
/** @typedef {import("../../state/state.mjs").Situation} Situation */

/**
 * O TURNO, no alto do rail da direita. Ele sai da faixa de contexto e vira
 * cabecalho por simetria: a esquerda abre com a marca, a direita abre com a
 * data — que e exatamente onde o Football Manager poe a dela.
 *
 * @param {GameState} state
 */
export function turnHtml(state) {
  return escapeHtml(monthLabel(state.month));
}

/**
 * A faixa de contexto: todo item e o MESMO objeto, e a diferenca entre eles e
 * so enfase. Forma diferente para informacao do mesmo nivel e o que faz uma
 * faixa parecer bagunçada por mais alinhada que esteja.
 *
 * @param {GameState} state
 */
export function contextHtml(state) {
  const items = [
    {
      label: UI.context.mandate,
      value: `${Math.floor(state.month / 48) + 1}º · ano 1`,
      alert: false,
    },
    { label: UI.context.congress, value: "247 / 513", alert: false },
    {
      label: UI.context.situation,
      value: UI.situation[state.situation],
      alert: state.situation === "crisis",
    },
  ];
  return items
    .map(
      item =>
        `<div class="chip${item.alert ? " chip--alert" : ""}">` +
        `<span class="chip__label">${escapeHtml(item.label)}</span>` +
        `<span class="chip__value">${escapeHtml(item.value)}</span>` +
        `</div>`,
    )
    .join("");
}

/**
 * @param {Approval} approval
 * @param {number} delta variacao de "otimo/bom" contra o mes anterior
 */
export function approvalHtml(approval, delta) {
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const arrow = UI.trend[direction];
  const sign = delta > 0 ? "+" : "";
  const parts = /** @type {const} */ (["good", "fair", "poor"]);

  return (
    `<p class="stage__label">${escapeHtml(UI.approvalLabel)}</p>` +
    `<p class="stage__hero" data-numeric>${approval.good}<span>%</span></p>` +
    `<p class="trend" data-direction="${direction}" data-numeric>` +
    `<span aria-hidden="true">${arrow}</span> ${sign}${delta.toFixed(1)} p.p.` +
    `</p>` +
    `<div class="meter stage__meter" role="img" aria-label="${escapeHtml(legendLabel(approval))}">` +
    parts
      .map(
        part =>
          `<span class="meter__part" data-part="${part}" style="flex-grow:${approval[part]}"></span>`,
      )
      .join("") +
    `</div>` +
    `<ul class="stage__legend">` +
    parts
      .map(
        part =>
          `<li data-part="${part}"><i aria-hidden="true"></i>` +
          `${escapeHtml(UI.approvalParts[part])} <b data-numeric>${approval[part]}%</b></li>`,
      )
      .join("") +
    `</ul>`
  );
}

/** @param {Approval} approval */
function legendLabel(approval) {
  return (
    `${UI.approvalParts.good} ${approval.good}%, ` +
    `${UI.approvalParts.fair} ${approval.fair}%, ` +
    `${UI.approvalParts.poor} ${approval.poor}%`
  );
}

/** @param {Situation} situation */
export function verdictHtml(situation) {
  return escapeHtml(UI.verdict[situation]);
}
