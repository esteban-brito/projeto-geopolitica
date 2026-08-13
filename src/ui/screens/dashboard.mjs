/* PAINEL DO MES — views PURAS.
   ══════════════════════════════════════════════════════════════════════════════
   Nenhuma funcao daqui toca o DOM, le o relogio ou guarda estado. Elas recebem
   dado e devolvem string. Quem aplica ao documento e `app.mjs`, e essa fronteira
   e o que permite testar a tela inteira em Node, sem navegador. */

import { escapeHtml } from "../shared/html.mjs";
import { UI } from "../strings.mjs";
import { monthLabel } from "../../state/state.mjs";
import { MONTHS_PER_TERM, MONTHS_PER_YEAR } from "../../data/regime.mjs";

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
 * ⚠ OS TRES CAMPOS ERAM PARTE MENTIRA. O ano do mandato era o texto fixo
 * "ano 1", que continuava dizendo ano 1 no quadragesimo mes. A base aliada era
 * "247 / 513" digitado a mao, ao lado de uma lealdade que o motor calcula de
 * verdade. E a situacao vinha de um campo do estado que nenhum motor movia desde
 * que o turno passou a ser resolvido pela camada de aplicacao — congelada em
 * "Estavel" para sempre, junto com a cor de todo o ambiente da tela.
 * Agora os tres saem de estado real, e o unico numero digitado nesta funcao e o
 * `+ 1` que transforma indice em ordinal.
 *
 * @param {object} input
 * @param {GameState} input.state
 * @param {{ level: Situation, reason: string, base: number }} input.standing
 * @param {number} input.seats o tamanho do plenario
 * @param {number} input.majority quantas cadeiras fazem maioria simples
 */
export function contextHtml({ state, standing, seats, majority }) {
  const items = [
    {
      label: UI.context.mandate,
      value: `${Math.floor(state.month / MONTHS_PER_TERM) + 1}º · ano ${
        Math.floor((state.month % MONTHS_PER_TERM) / MONTHS_PER_YEAR) + 1
      }`,
      alert: false,
    },
    {
      label: UI.context.congress,
      value: `${standing.base} / ${seats}`,
      /* O ALERTA E A MAIORIA, e nao um numero bonito: abaixo dela o governo nao
         passa nada sem comprar, e essa e a unica leitura que muda a decisao. */
      alert: standing.base < majority,
    },
    {
      label: UI.context.situation,
      value: UI.situation[standing.level],
      alert: standing.level === "crisis",
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

/**
 * A frase que diz o que esta em jogo. Ela e indexada pelo MOTIVO e nao pelo
 * nivel: "crise" por teto fechado e "crise" por base rompida sao duas panes
 * diferentes, e uma delas se resolve com dinheiro que nao existe.
 *
 * @param {string} reason
 */
export function verdictHtml(reason) {
  return escapeHtml(UI.verdict[/** @type {keyof typeof UI.verdict} */ (reason)] ?? "");
}
