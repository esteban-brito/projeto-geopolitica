/* A BARRA SUPERIOR — os sinais vitais, e eles nunca somem da tela. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent, seats } from "../shared/format.mjs";
import { UI } from "../strings.mjs";
import { monthLabel } from "../../state/state.mjs";
import { MONTHS_PER_TERM, MONTHS_PER_YEAR } from "../../data/regime.mjs";

/** @typedef {import("../../state/state.mjs").GameState} GameState */
/** @typedef {import("../../state/state.mjs").Approval} Approval */
/** @typedef {import("../../state/state.mjs").Situation} Situation */

/**
 * O TURNO, no alto do rail da direita.
 *
 * @param {GameState} state
 * @param {{ over: boolean, months: number }} closing o mandato, perguntado a `termOf`
 */
export function turnHtml(state, closing) {
  if (closing.over) {
    return (
      `<b>${escapeHtml(monthLabel(closing.months))}</b>` +
      `<small>${escapeHtml(UI.closing.ended)}</small>`
    );
  }

  const term = Math.floor(state.month / MONTHS_PER_TERM) + 1;
  const year = Math.floor((state.month % MONTHS_PER_TERM) / MONTHS_PER_YEAR) + 1;

  /* ⚠ QUANTOS MESES RESTAM, e num jogo com fim duro ele e o numero mais importante da faixa:
     e ele que decide se uma reforma de 24 meses ainda cabe. A faixa dizia `ANO 1` e mais
     nada sobre QUANDO — o mandato tinha 46 meses e nenhum deles era diferente do outro.
     ⚠ O FIM VEM DO MOTOR: `termOf` encerra em `month >= MONTHS_PER_TERM`, e refazer a conta
     aqui daria a faixa uma data de fim propria — que e como duas verdades comecam. */
  const left = Math.max(0, MONTHS_PER_TERM - state.month);

  return (
    `<b>${escapeHtml(monthLabel(state.month))}</b>` +
    `<small>${term}º mandato · ano ${year} · ` +
    `<b class="topbar__left" data-numeric>${left}</b> ` +
    `${escapeHtml(left === 1 ? UI.closing.monthLeft : UI.closing.monthsLeft)}</small>`
  );
}

/**
 * OS SINAIS VITAIS — quatro numeros com tendencia, e o botao de avancar ao lado.
 *
 * dependia de SONDA, que nao existia, e por tres sessoes a barra teria nascido
 * com um quarto do conteudo inventado. O projeto ja pagou por isso uma vez — um
 * indicador congelado ao lado de indicadores vivos ensina a desconfiar da tela
 * inteira —, e por isso a barra so nasceu agora.
 * @param {object} input
 * @param {{ gdp: number, inflation: number }} input.macro
 * @param {number} input.approval - "otimo/bom", em pontos
 * @param {number} input.base - cadeiras que respondem ao governo
 * @param {number} input.majority
 * @param {{ gdp: number, inflation: number, approval: number, base: number } | null} input.before
 *   o mes anterior, ou `null` quando nao ha passado nenhum para comparar
 * @returns {string}
 */
export function vitalsHtml({ macro, approval, base, majority, before }) {
  const items = [
    {
      label: UI.vitals.gdp,
      value: money(macro.gdp),
      delta: before ? macro.gdp - before.gdp : null,
      /* CRESCER E BOM: o sinal do delta e o sinal da leitura. */
      good: 1,
      alert: false,
    },
    {
      label: UI.vitals.inflation,
      value: percent(macro.inflation, 1),
      delta: before ? macro.inflation - before.inflation : null,
      /* ⚠ INFLACAO SUBINDO E RUIM, e por isso o sinal se inverte. */
      good: -1,
      alert: macro.inflation > 0.075,
    },
    {
      label: UI.vitals.approval,
      value: `${seats(approval)}%`,
      delta: before ? approval - before.approval : null,
      good: 1,
      alert: approval < 20,
    },
    {
      label: UI.vitals.base,
      value: seats(base),
      delta: before ? base - before.base : null,
      good: 1,
      alert: base < majority,
    },
  ];

  return items
    .map(item => {
      /* ⚠ AUSENCIA NAO E RESULTADO, e aqui ela era desenhada como "nao moveu".
         `painted` e variavel de modulo, entao numa RECARGA nao existe mes
         anterior nenhum: as quatro setas saiam em `—` no mes 30, afirmando que nada tinha
         andado num mandato em que tudo andou. O traco e um veredito; a falta de passado
         nao e. Sem base de comparacao, a seta simplesmente nao existe. */
      const direction =
        item.delta === null
          ? null
          : Math.abs(item.delta) < 1e-9
            ? "flat"
            : item.delta * item.good > 0
              ? "up"
              : "down";

      /* ⚠ O ROTULO VEM ANTES DO VALOR, NA MESMA LINHA — Parte B do ciclo 11. */
      /* ⚠ O QUE NAO EXISTE E ESPACO, e a captura provou duas vezes. */

      return (
        `<div class="vital${item.alert ? " vital--alert" : ""}">` +
        `<span class="vital__label">${escapeHtml(item.label)}</span>` +
        `<span class="vital__value" data-numeric>${escapeHtml(item.value)}` +
        (direction === null
          ? ""
          : `<i class="trend" data-direction="${direction}" aria-hidden="true">` +
            `${UI.trend[direction]}</i>`) +
        `</span>` +
        `</div>`
      );
    })
    .join("");
}

/* As duas eram puras, corretas, e ninguem as importava: a faixa morreu quando a barra
   superior absorveu os tres campos dela, e a tela de aprovacao morreu quando SONDA nasceu e
   deu outra casa ao numero — a propria barra, e o cartao da Rua no Gabinete. */

/**
 * A frase que diz o que esta em jogo.
 *
 * @param {string} reason
 */
export function verdictHtml(reason) {
  return escapeHtml(UI.verdict[/** @type {keyof typeof UI.verdict} */ (reason)] ?? "");
}
