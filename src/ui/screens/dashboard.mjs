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

/* ── DUAS VIEWS MORRERAM AQUI EM 15/08/2026, e o registro fica ───────────────
   `contextHtml` desenhava a faixa de contexto — mandato, base e situacao — e
   `approvalHtml` era a tela de aprovacao inteira, com o numero grande, o medidor
   e a legenda. As duas eram puras, corretas, e ninguem as importava: a faixa
   morreu quando a barra superior absorveu os tres campos dela, e a tela de
   aprovacao morreu quando SONDA nasceu e deu outra casa ao numero — a propria
   barra, e o cartao da Rua no Gabinete.

   ⚠ O ARQUIVO DE ESTILO DELAS DIZIA QUANDO ELAS DEVIAM MORRER, e a condicao ja
   tinha sido cumprida sem ninguem reparar. `70-screen-approval.css` trazia
   escrito: "se SONDA der outra casa a aprovacao, este arquivo morre com o desenho
   antigo, e morrer inteiro e mais barato do que continuar meio vivo". SONDA nasceu
   em 14/08/2026 e deu — entao o que restava eram duas views e uma folha inteira
   esperando um dia que ja tinha passado. Sairam juntas, que e como o proprio
   arquivo mandava.

   Andaime que sobrevive ao predio vira parte do predio: e a mesma razao que tirou
   `advanceMonth` do reducer. */

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
