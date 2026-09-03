/* FINANCAS — o placar do pais.
   View PURA, e a unica tela sem um controle.
   ── A AUSENCIA DE CONTROLE E A INFORMACAO PRINCIPAL Toda outra tela deste jogo pede uma
   decisao. */

import { escapeHtml } from "../shared/html.mjs";
import { money, num, percent, seats, signed, sparkline } from "../shared/format.mjs";
import { headHtml } from "../shared/head.mjs";
import { SCALE, WINDOW, gdpRange, trendOf, windowLabel } from "../shared/trend.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../state/state.mjs").Series} Series
 */

/**
 * UMA LINHA DO PAINEL: rotulo, valor, e a curva do que ele vem fazendo.
 *
 * @param {object} input
 * @param {string} input.label
 * @param {string} input.value
 * @param {ReadonlyArray<number>} [input.past]
 * @param {readonly [number, number]} [input.range] a regua da escada
 * @param {string} [input.note]
 * @param {"up" | "down" | "flat"} [input.tone]
 * @returns {string}
 */
function lineHtml({ label, value, past, range, note, tone }) {
  return (
    `<div class="ledger__row"${tone ? ` data-direction="${tone}"` : ""}>` +
    `<span class="ledger__label">${escapeHtml(label)}</span>` +
    `<span class="ledger__value" data-numeric>${value}</span>` +
    `<span class="ledger__spark" aria-hidden="true">` +
    /* Medido num mandato passivo de 20 meses, em unidades de traco (de 20 possiveis): o PIB
       sobe de 2,8 para 6,0 so por olhar mais para tras. */
    (past && past.length > 1 ? sparkline([...past], WINDOW, range) : "") +
    `</span>` +
    `<span class="ledger__note">${note ? escapeHtml(note) : ""}</span>` +
    `</div>`
  );
}

/**
 * @param {object} input
 * @param {string} input.title
 * @param {string} input.rows
 * @returns {string}
 */
function blockHtml({ title, rows }) {
  return (
    `<section class="area__block">` +
    `<h3 class="block__legend">${escapeHtml(title)}</h3>` +
    `<div class="ledger">${rows}</div>` +
    `</section>`
  );
}

/**
 * O painel inteiro.
 *
 * ⚠ ELE MOSTRA O MES CORRENTE COMO ELE VAI FECHAR, e nao a foto do mes passado.
 * @param {object} input
 * @param {import("../../domain/economy/index.mjs").MacroState} input.macro
 * @param {import("../../domain/budget/index.mjs").BudgetOutput} input.budget
 * @param {Series} input.series
 * @param {number} input.interest o servico da divida NO MES
 * @param {number} input.debt o estoque com que o mes fecha, juro incluido
 * @param {number} input.debtRatio o mesmo estoque sobre o PIB
 * @param {number} input.premium o spread que o mercado cobra acima da basica, ao ano
 * @param {number} input.target a meta de inflacao, do catalogo
 * @param {number} input.ceiling o teto da banda da meta, somado na composicao
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.index
 * @param {Record<string, number[]>} input.history
 * @returns {string}
 */
export function financeHtml({
  macro,
  budget,
  series,
  interest,
  debt,
  debtRatio,
  premium,
  target,
  ceiling,
  areas,
  index,
  history,
}) {
  /* DUAS CONTAS SAO FEITAS AQUI, e as duas sao divisoes de uma linha. */
  const perCapita = macro.population > 0 ? macro.gdp / macro.population : 0;
  const gap = macro.potential > 0 ? (macro.gdp - macro.potential) / macro.potential : 0;

  const economy = blockHtml({
    title: UI.finance.economy,
    rows:
      lineHtml({
        label: UI.finance.gdp,
        value: money(macro.gdp),
        past: series.gdp,
        /* O PIB NOMINAL NAO TEM TETO NATURAL, entao a regua dele e a propria largada. */
        range: gdpRange(series.gdp, macro.gdp),
        note: UI.finance.perYear,
      }) +
      lineHtml({
        label: UI.finance.perCapita,
        /* Em mil reais: bilhoes divididos por milhoes dao mil por pessoa. */
        value: `R$ ${num(perCapita)} mil`,
      }) +
      lineHtml({
        label: UI.finance.inflation,
        value: percent(macro.inflation, 1),
        past: series.inflation,
        range: SCALE.inflation,
        note: `${UI.finance.target} ${percent(target, 0)}`,
        /* O alvo e o CENTRO da banda e nao um teto, e por isso quem julga e o teto dela. */
        tone: macro.inflation > ceiling ? "down" : "flat",
      }) +
      lineHtml({
        label: UI.finance.rate,
        value: percent(macro.rate, 2),
        past: series.rate,
        range: SCALE.rate,
        note: UI.finance.central,
        /* Selic de 12% com inflacao de 10% e dinheiro barato; a mesma Selic com inflacao de
           3% e um freio. */
        tone: macro.rate - macro.inflation > 0.07 ? "down" : "flat",
      }) +
      lineHtml({
        label: UI.finance.unemployment,
        value: percent(macro.unemployment, 1),
        past: series.unemployment,
        range: SCALE.unemployment,
        tone: macro.unemployment > 0.09 ? "down" : "flat",
      }) +
      lineHtml({
        label: UI.finance.gap,
        value: percent(gap, 1),
        note: UI.finance.gapNote,
      }),
  });

  const accounts = blockHtml({
    title: UI.finance.accounts,
    rows:
      lineHtml({
        label: UI.finance.revenue,
        value: money(budget.revenue),
        note: UI.finance.perYear,
      }) +
      lineHtml({
        label: UI.finance.mandatory,
        value: money(budget.mandatory),
        note:
          budget.revenue > 0
            ? `${percent(budget.mandatory / budget.revenue)} ${UI.finance.ofRevenue}`
            : UI.finance.perYear,
      }) +
      lineHtml({
        label: UI.finance.room,
        value: money(budget.allowance),
        note: UI.finance.perYear,
      }) +
      /* O PRIMARIO NAO GANHA ESCADA, e a ausencia e escolha. */
      lineHtml({
        label: UI.finance.primary,
        value: money(budget.balance),
        note: UI.finance.perMonth,
        tone: budget.balance >= 0 ? "up" : "down",
      }) +
      /* O SERVICO DA DIVIDA FICA NESTE BLOCO E FORA DO PRIMARIO, exatamente como o arcabouco
         o trata. */
      lineHtml({
        label: UI.finance.interest,
        value: money(interest),
        note: `${UI.finance.outsideCeiling} · ${UI.finance.perMonth}`,
        tone: "down",
      }),
  });

  const ceilingRoom = budget.ceiling - budget.mandatory;

  const stock = blockHtml({
    title: UI.finance.debt,
    rows:
      lineHtml({ label: UI.finance.gross, value: money(debt) }) +
      lineHtml({
        label: UI.finance.overGdp,
        value: percent(debtRatio, 1),
        past: series.debtRatio,
        range: SCALE.debtRatio,
        tone: debtRatio > 0.8 ? "down" : "flat",
      }) +
      (premium > 0
        ? lineHtml({
            label: UI.finance.premium,
            value: percent(premium, 2),
            note: UI.finance.premiumNote,
            tone: "down",
          })
        : "") +
      lineHtml({
        label: UI.finance.ceiling,
        value: money(budget.ceiling),
        note: UI.finance.perYear,
      }) +
      lineHtml({
        label: UI.finance.headroom,
        value: money(ceilingRoom),
        note: budget.contingency ? UI.finance.squeezed : UI.finance.untilCeiling,
        tone: budget.contingency ? "down" : "flat",
      }),
  });

  const country = blockHtml({
    title: UI.finance.country,
    rows: areas
      .map(area => {
        const value = index[area.id] ?? area.initial;
        const past = history[area.id] ?? [];

        /* O resultado era uma coluna que punha 24 meses de Educacao, 12 de Defesa, 6 de
           Industria e 3 de Saude uma embaixo da outra, todas sem rotulo, lidas como
           comparaveis. */
        const moved = trendOf(value, past);

        /* O TOM LE O NUMERO ARREDONDADO, e nao o valor cheio. */
        const shift = Number((moved?.delta ?? 0).toFixed(0));

        return lineHtml({
          label: area.label,
          value: seats(value),
          past,
          note: moved
            ? `${area.index} · ${signed(moved.delta)} ${windowLabel(moved.months)}`
            : area.index,
          tone: shift > 0 ? "up" : shift < 0 ? "down" : "flat",
        });
      })
      .join(""),
  });

  return (
    `<section class="area glass-stage">` +
    headHtml({ title: UI.finance.title }) +
    economy +
    accounts +
    stock +
    country +
    `</section>`
  );
}
