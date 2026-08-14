/* FINANCAS — o placar do pais. View PURA, e a unica tela sem um controle.
   ══════════════════════════════════════════════════════════════════════════════

   ── A AUSENCIA DE CONTROLE E A INFORMACAO PRINCIPAL ─────────────────────────
   Toda outra tela deste jogo pede uma decisao. Esta nao pede nenhuma, e isso
   precisa ser evidente no primeiro segundo — senao o jogador procura o botao,
   nao acha, e conclui que a tela esta quebrada.

   Por isso ela e a unica DENSA do projeto. Em tela que decide, densidade e ruido:
   cada numero a mais disputa com a decisao. Em tela que so informa, densidade e o
   servico — e a comparacao lado a lado e justamente o que ela existe para dar.

   ── TODO NUMERO AQUI TEM MOTOR ATRAS ────────────────────────────────────────
   Nao ha um so valor digitado. PIB, inflacao, juro e desemprego saem da CORRENTE;
   receita, obrigatoria, teto e divida saem do LASTRO; os indices saem da MALHA. O
   projeto ja pagou para aprender que um indicador congelado ao lado de indicadores
   vivos ensina a desconfiar da tela inteira — foi por isso que a aprovacao ficou
   fora dela ate a SONDA existir, e ela continua fora.

   ── A SERIE E O QUE FAZ O NUMERO SIGNIFICAR ─────────────────────────────────
   `9,4%` de inflacao nao diz nada sozinho. `9,4% ▁▂▃▅▇` diz que o jogador perdeu
   o controle ha cinco meses. O painel mostra os dois em toda linha que tem
   passado guardado. */

import { escapeHtml } from "../shared/html.mjs";
import { money, num, percent, seats, signed, sparkline } from "../shared/format.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../state/state.mjs").Series} Series
 */

/* AS REGUAS DA ESCADA, uma por indicador, e todas DECLARADAS.
   ══════════════════════════════════════════════════════════════════════════════
   Elas nao saem da serie: uma escada normalizada pelo proprio historico desenha
   drama quando nao ha nada acontecendo — dois meses de inflacao entre 4,1% e 4,3%
   virariam um degrau cheio de subida. Elas tambem nao sao a regua do indice de
   area: contra 0 a 100, uma inflacao de 0,042 e um juro de 0,105 ficam no degrau
   do chao para sempre, e a escada passa a afirmar que nada nunca muda.

   Cada faixa e uma afirmacao sobre o mundo do jogo — "juro basico vive entre 0 e
   25% ao ano" — e por isso mora aqui, ao lado de quem desenha, e nao no catalogo:
   o catalogo diz onde os numeros COMECAM, e isto diz em que regua eles sao lidos.
   O PIB e o unico ancorado na propria serie, e a ancora e o primeiro mes guardado:
   PIB nominal nao tem teto natural, e o que se quer ver dele e a distancia
   percorrida desde a posse. */
/* A BANDA DE TOLERANCIA DA META, para cada lado. Ela mora aqui e nao no catalogo
   porque nenhum motor a consome: a CORRENTE persegue o CENTRO da meta, e a banda
   so existe para a tela saber quando acender o vermelho. */
const TOLERANCE = 0.015;

const SCALE = /** @type {const} */ ({
  inflation: [0, 0.15],
  rate: [0, 0.25],
  unemployment: [0, 0.2],
  debtRatio: [0.4, 1.2],
});

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
    (past && past.length > 1 ? sparkline([...past], 6, range) : "") +
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
    `<h3 class="area__legend">${escapeHtml(title)}</h3>` +
    `<div class="ledger">${rows}</div>` +
    `</section>`
  );
}

/**
 * O painel inteiro.
 *
 * ⚠ ELE MOSTRA O MES CORRENTE COMO ELE VAI FECHAR, e nao a foto do mes passado.
 * Receita, obrigatoria e teto nao dependem do que o jogador esta decidindo agora;
 * primario e divida dependem, e vem do `ledger` da camada de aplicacao ja com o
 * empenho do mes dentro. E a mesma conta que o turno vai fazer — que e a unica
 * forma de o placar nao discordar do jogo no caso extremo, que e justamente o
 * caso em que o jogador veio olhar.
 *
 * @param {object} input
 * @param {import("../../domain/economy/index.mjs").MacroState} input.macro
 * @param {import("../../domain/budget/index.mjs").BudgetOutput} input.budget
 * @param {Series} input.series
 * @param {number} input.interest o servico da divida NO MES
 * @param {number} input.debt o estoque com que o mes fecha, juro incluido
 * @param {number} input.debtRatio o mesmo estoque sobre o PIB
 * @param {number} input.target a meta de inflacao, do catalogo
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
  target,
  areas,
  index,
  history,
}) {
  /* DUAS CONTAS SAO FEITAS AQUI, e as duas sao divisoes de uma linha.
     O PER CAPITA nao existe em motor nenhum: PIB e populacao atravessam os meses
     separados, e a razao entre eles e leitura.
     O HIATO existe em motor — `EconomyOutput.gap` — mas ele nao e guardado no
     estado, e a razao entre PIB e potencial devolve o MESMO numero: a CORRENTE
     envelhece os dois com o mesmo fator de preco de proposito, justamente para
     que a razao entre eles siga sendo real. Refazer aqui nao diverge; nao poder
     refazer obrigaria o estado a guardar um derivado. */
  const perCapita = macro.population > 0 ? macro.gdp / macro.population : 0;
  const gap = macro.potential > 0 ? (macro.gdp - macro.potential) / macro.potential : 0;

  const economy = blockHtml({
    title: UI.finance.economy,
    rows:
      lineHtml({
        label: UI.finance.gdp,
        value: money(macro.gdp),
        past: series.gdp,
        /* O PIB NOMINAL NAO TEM TETO NATURAL, entao a regua dele e a propria
           largada: do primeiro mes guardado ate metade a mais. E a unica escada
           ancorada em dado, e o dado e o passado do jogador. */
        range: [series.gdp[0] ?? macro.gdp, (series.gdp[0] ?? macro.gdp) * 1.5],
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
        /* A BANDA DA META, E NAO A META. O regime brasileiro tem tolerancia de
           1,5 ponto para cada lado, e o alvo e o CENTRO — nao um teto. Pintar de
           vermelho tudo o que passa de 3% acenderia o alarme em 3,1%, que e
           inflacao dentro da meta, e um alarme que acende sempre e um alarme que
           o jogador aprende a nao ver. */
        tone: macro.inflation > target + TOLERANCE ? "down" : "flat",
      }) +
      lineHtml({
        label: UI.finance.rate,
        value: percent(macro.rate, 2),
        past: series.rate,
        range: SCALE.rate,
        note: UI.finance.central,
        /* O TOM DO JURO LE O JURO REAL, e nao o nominal. Selic de 12% com inflacao
           de 10% e dinheiro barato; a mesma Selic com inflacao de 3% e um freio.
           Um limiar nominal chamaria as duas de aperto. */
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
      /* O PRIMARIO NAO GANHA ESCADA, e a ausencia e escolha. Ele oscila com a
         decisao de cada mes e nao tem faixa natural em bilhoes — desenha-lo contra
         uma regua inventada seria a escada afirmando uma normalidade que ninguem
         definiu. O sinal ja esta no tom, que e a informacao que ele carrega. */
      lineHtml({
        label: UI.finance.primary,
        value: money(budget.balance),
        note: UI.finance.perMonth,
        tone: budget.balance >= 0 ? "up" : "down",
      }) +
      /* O SERVICO DA DIVIDA FICA NESTE BLOCO E FORA DO PRIMARIO, exatamente como o
         arcabouco o trata. Po-lo junto do resultado sugeriria que ele disputa com
         hospital, e ele nao disputa: ele engorda a divida. */
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
        const moved = value - (past.length > 1 ? (past[0] ?? value) : value);

        /* O TOM LE O NUMERO ARREDONDADO, e nao o valor cheio. Uma queda de 0,4
           ponto imprime "0" e tingiria a linha de vermelho — e ai a cor afirma
           uma piora que o proprio numero ao lado nega. Onde a tela mostra zero,
           ela precisa mostrar zero nas duas linguagens. */
        const shift = Number(moved.toFixed(0));

        return lineHtml({
          label: area.label,
          value: seats(value),
          past,
          note: `${area.index} · ${signed(moved)}`,
          tone: shift > 0 ? "up" : shift < 0 ? "down" : "flat",
        });
      })
      .join(""),
  });

  return (
    `<section class="area glass-stage">` +
    `<div class="area__head"><div>` +
    `<p class="area__eyebrow">${escapeHtml(UI.finance.eyebrow)}</p>` +
    `<p class="area__value">${escapeHtml(UI.finance.title)}</p>` +
    `</div></div>` +
    economy +
    accounts +
    stock +
    country +
    `</section>`
  );
}
