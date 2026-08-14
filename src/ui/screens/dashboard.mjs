/* A BARRA SUPERIOR — os sinais vitais, e eles nunca somem da tela. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════
   Nenhuma funcao daqui toca o DOM, le o relogio ou guarda estado. Elas recebem
   dado e devolvem string. Quem aplica ao documento e `app.mjs`, e essa fronteira
   e o que permite testar a tela inteira em Node, sem navegador. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent, seats } from "../shared/format.mjs";
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
  const term = Math.floor(state.month / MONTHS_PER_TERM) + 1;
  const year = Math.floor((state.month % MONTHS_PER_TERM) / MONTHS_PER_YEAR) + 1;

  return (
    `<b>${escapeHtml(monthLabel(state.month))}</b>` +
    `<small>${term}º mandato · ano ${year}</small>`
  );
}

/**
 * OS SINAIS VITAIS — quatro numeros com tendencia, e o botao de avancar ao lado.
 *
 * ⚠ OS QUATRO TEM MOTOR, e a lista so ficou honesta em 14/08/2026: a aprovacao
 * dependia de SONDA, que nao existia, e por tres sessoes a barra teria nascido
 * com um quarto do conteudo inventado. O projeto ja pagou por isso uma vez — um
 * indicador congelado ao lado de indicadores vivos ensina a desconfiar da tela
 * inteira —, e por isso a barra so nasceu agora.
 *
 * A TENDENCIA E CONTRA O MES ANTERIOR, e nao contra a abertura. O que a barra
 * responde e "o que mudou desde que eu decidi", e nao "como estou contra a posse".
 *
 * @param {object} input
 * @param {{ gdp: number, inflation: number }} input.macro
 * @param {number} input.approval - "otimo/bom", em pontos
 * @param {number} input.base - cadeiras que respondem ao governo
 * @param {number} input.majority
 * @param {{ gdp: number, inflation: number, approval: number, base: number }} input.before
 * @returns {string}
 */
export function vitalsHtml({ macro, approval, base, majority, before }) {
  const items = [
    {
      label: UI.vitals.gdp,
      value: money(macro.gdp),
      delta: macro.gdp - before.gdp,
      /* CRESCER E BOM: o sinal do delta e o sinal da leitura. */
      good: 1,
      alert: false,
    },
    {
      label: UI.vitals.inflation,
      value: percent(macro.inflation, 1),
      delta: macro.inflation - before.inflation,
      /* ⚠ INFLACAO SUBINDO E RUIM, e por isso o sinal se inverte. Sem esta linha a
         seta ficaria verde quando os precos disparam — e a cor diria o oposto do
         numero que ela acompanha. */
      good: -1,
      alert: macro.inflation > 0.075,
    },
    {
      label: UI.vitals.approval,
      value: `${seats(approval)}%`,
      delta: approval - before.approval,
      good: 1,
      alert: approval < 20,
    },
    {
      label: UI.vitals.base,
      value: seats(base),
      delta: base - before.base,
      good: 1,
      alert: base < majority,
    },
  ];

  return items
    .map(item => {
      const moved = Math.abs(item.delta) < 1e-9 ? 0 : item.delta * item.good;
      const direction = moved > 0 ? "up" : moved < 0 ? "down" : "flat";

      return (
        `<div class="vital${item.alert ? " vital--alert" : ""}">` +
        `<span class="vital__label">${escapeHtml(item.label)}</span>` +
        `<span class="vital__value" data-numeric>${escapeHtml(item.value)}` +
        `<i class="trend" data-direction="${direction}" aria-hidden="true">` +
        `${UI.trend[direction]}</i></span>` +
        `</div>`
      );
    })
    .join("");
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
