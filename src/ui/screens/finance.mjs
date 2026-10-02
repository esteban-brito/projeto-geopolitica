/* FINANÇAS — o placar do país.
   View PURA, e a única tela sem um controle.
   ── A AUSÊNCIA DE CONTROLE E A INFORMACAO PRINCIPAL Toda outra tela deste jogo pede uma
   decisão. */

import { escapeHtml } from "../core/html.mjs";
import { money, num, percent, seats, signed, sparkline } from "../core/format.mjs";
import { headHtml } from "../components/head.mjs";
import { SCALE, WINDOW, gdpRange, trendOf, windowLabel } from "../components/trend.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../state/state.mjs").Series} Series
 */

/**
 * UMA LINHA DO PAINEL: rótulo, valor, e a curva do que ele vem fazendo.
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
    /* Medido num mandato passivo de 20 meses, em unidades de traço (de 20 possíveis): o PIB
       sobe de 2,8 para 6,0 só por olhar mais para trás. */
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
 * ⚠ ELE MOSTRA O MÊS CORRENTE COMO ELE VAI FECHAR, e não a foto do mês passado.
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
  /* DUAS CONTAS SÃO FEITAS AQUI, e as duas são divisões de uma linha. */
  const perCapita = macro.population > 0 ? macro.gdp / macro.population : 0;
  const gap = macro.potential > 0 ? (macro.gdp - macro.potential) / macro.potential : 0;

  const economy = blockHtml({
    title: UI.finance.economy,
    rows:
      lineHtml({
        label: UI.finance.gdp,
        value: money(macro.gdp),
        past: series.gdp,
        /* O PIB NOMINAL NÃO TEM TETO NATURAL, então a régua dele e a própria largada. */
        range: gdpRange(series.gdp, macro.gdp),
        note: UI.finance.perYear,
      }) +
      lineHtml({
        label: UI.finance.perCapita,
        /* Em mil reais: bilhoes divididos por milhoes dão mil por pessoa. */
        value: `R$ ${num(perCapita)} mil`,
      }) +
      lineHtml({
        label: UI.finance.inflation,
        value: percent(macro.inflation, 1),
        past: series.inflation,
        range: SCALE.inflation,
        note: `${UI.finance.target} ${percent(target, 0)}`,
        /* O alvo e o CENTRO da banda e não um teto, e por isso quem julga e o teto dela. */
        tone: macro.inflation > ceiling ? "down" : "flat",
      }) +
      lineHtml({
        label: UI.finance.rate,
        value: percent(macro.rate, 2),
        past: series.rate,
        range: SCALE.rate,
        note: UI.finance.central,
        /* Selic de 12% com inflação de 10% e dinheiro barato; a mesma Selic com inflação de
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
      /* O PRIMÁRIO NÃO GANHA ESCADA, e a ausência e escolha.
         ⛔ E O SINAL NÃO E O TOM, e essa era a mentira: um primário de +0,1% do PIB com meta
         de +0,5% e uma meta PERDIDA, e a linha o pintava de verde por ser positivo. Quem
         julga e o LASTRO, que compara com a banda da LDO — a tela não refaz a conta. */
      lineHtml({
        label: UI.finance.primary,
        value: money(budget.balance),
        note:
          `${UI.finance.target} ${percent(budget.primaryTarget, 1)} ${UI.finance.ofGdp}` +
          ` · ${percent(budget.primary, 1)}` +
          (budget.atRisk ? ` · ${UI.finance.missing}` : ""),
        tone: budget.atRisk ? "down" : "up",
      }) +
      /* O SERVICO DA DÍVIDA FICA NESTE BLOCO E FORA DO PRIMÁRIO, exatamente como o arcabouço
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
        note: budget.blocked ? UI.finance.squeezed : UI.finance.untilCeiling,
        tone: budget.blocked ? "down" : "flat",
      }),
  });

  const country = blockHtml({
    title: UI.finance.country,
    rows: areas
      .map(area => {
        const value = index[area.id] ?? area.initial;
        const past = history[area.id] ?? [];

        /* O resultado era uma coluna que punha 24 meses de Educacao, 12 de Defesa, 6 de
           Indústria e 3 de Saude uma embaixo da outra, todas sem rótulo, lidas como
           comparáveis. */
        const moved = trendOf(value, past);

        /* O TOM LÊ O NÚMERO ARREDONDADO, e não o valor cheio. */
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
