/* O TURNO — onde o orcamento e o Congresso se encontram.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   o estado, as ordens do mes e o catalogo
   devolve  o estado seguinte e o relatorio do que aconteceu

   Este arquivo nao e um motor e nao tem codinome. Ele COMPOE motores, que e o
   papel declarado da camada de aplicacao: LASTRO diz quanto existe, ECLUSA diz
   quem vota, e a ordem em que os dois sao chamados e a mecanica.

   ── A ORDEM, E POR QUE ELA E A REGRA ─────────────────────────────────────────
   A tentacao e resolver a votacao primeiro e cobrar a conta depois. Feito assim,
   verba prometida sempre compra voto e o orcamento vira placar — um numero que o
   jogador olha DEPOIS de a decisao ter sido tomada, e que portanto nao decide
   nada. Aqui e o inverso:

     1. o teto e o caixa dizem quanto cabe NESTE mes;
     2. o prometido e confrontado com o que cabe;
     3. a votacao acontece com a verba REALMENTE PAGA;
     4. o buraco entre prometido e pago desaba sobre a lealdade;
     5. o orcamento fecha com o que de fato saiu.

   O passo 3 e o acoplamento inteiro. Prometer nao move voto nenhum: o Congresso
   responde ao que caiu na conta. E como o passo 1 pode devolver zero por
   contingenciamento — que nao e escolha do jogador, e aritmetica do teto —,
   existe um caminho em que o governo promete de boa fe, nao entrega, e perde a
   base sem que nenhum evento roteirizado tenha dito "sua base se revoltou".
   Essa era a peca que faltava: aperto fiscal virando crise politica por conta
   propria.

   ── O RATEIO, quando falta ───────────────────────────────────────────────────
   Falta dinheiro para todos, todos recebem menos, na proporcao do prometido. O
   governo NAO escolhe quem trair quando o teto fecha — escolher exigiria uma
   ordem de prioridade que o jogador nunca declarou, e inventa-la aqui seria o
   motor decidindo politica no lugar dele. Quem quiser proteger uma bancada
   promete menos as outras no mes seguinte.

   ── O QUE ESTA DECLARADO COMO SIMPLIFICACAO ──────────────────────────────────
   · O QUORUM e sempre maioria simples. Emenda constitucional exige tres quintos,
     e o catalogo de pautas ainda nao carrega o tipo do projeto. Enquanto nao
     carregar, a PEC do catalogo passa mais barato do que deveria;
   · O IMPACTO FISCAL de uma pauta aprovada cai na despesa OBRIGATORIA, inclusive
     quando o texto e de receita. E a unica linha permanente que o orcamento
     carrega hoje — a receita e funcao do PIB e de mais nada. O sinal e o
     tamanho ficam certos, a linha nao; quando o motor macroeconomico existir,
     pauta de arrecadacao muda de lado;
   · O PIB nao anda sozinho. Ele e o motor macroeconomico, que nao existe, e por
     isso entra aqui como PREMISSA explicita de quem chama — com zero por padrao.
     Um crescimento inventado neste arquivo viraria modelo macro clandestino. */

import { step } from "../domain/budget/index.mjs";
import { settle, vote } from "../domain/congress/index.mjs";
import { CATALOG } from "../data/catalog.mjs";
import { SIMPLE_MAJORITY } from "../data/parties.mjs";
import { reduce } from "../state/state.mjs";

/**
 * @typedef {import("../state/state.mjs").GameState} GameState
 * @typedef {import("../data/bills.mjs").Bill} Bill
 * @typedef {import("../data/parties.mjs").Party} Party
 * @typedef {import("../domain/budget/index.mjs").BudgetOutput} BudgetOutput
 * @typedef {import("../domain/congress/index.mjs").Tally} Tally
 */

const MONTHS_PER_YEAR = 12;

/**
 * @typedef {object} Orders as ordens do mes
 * @property {string | null} [billId] a pauta levada a voto, ou nada
 * @property {Record<string, number>} [funding] verba PROMETIDA por bancada, de 0 a 1
 *
 * @typedef {object} Options
 * @property {typeof CATALOG} [catalog]
 * @property {number} [gdpGrowth] premissa de crescimento REAL ANUAL do PIB
 *
 * @typedef {object} Report o que o mes deixou, para a tela ou para o terminal
 * @property {number} month o mes que acabou de ser resolvido
 * @property {Bill | null} bill
 * @property {BudgetOutput} budget
 * @property {number} room o discricionario que cabia NO MES, em bilhoes
 * @property {number} promisedCost quanto a promessa custaria
 * @property {number} paidCost quanto o caixa honrou
 * @property {Record<string, number>} promised
 * @property {Record<string, number>} paid
 * @property {Tally | null} tally
 * @property {Record<string, number>} loyalty o humor depois do mes
 */

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * A posicao com que o orcamento entra no mes.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function positionOf(state, catalog) {
  return {
    gdp: state.fiscal.gdp,
    mandatory: state.fiscal.mandatory,
    anchorRevenue: state.fiscal.anchorRevenue,
    anchorExpense: state.fiscal.anchorExpense,
    debt: state.fiscal.debt,
    parameters: catalog.fiscal,
  };
}

/**
 * QUANTO CABE NESTE MES, em bilhoes — o discricionario ja dividido por doze.
 *
 * Ele e exportado porque quem decide precisa saber ANTES de decidir: a politica
 * de simulacao consulta para nao prometer o que nao cabe, e a tela vai precisar
 * dele para mostrar o limite enquanto o jogador arrasta o controle de verba.
 * Sem isto, os dois teriam de refazer a conta do orcamento por fora — e conta
 * refeita por fora e conta que diverge.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {number}
 */
export function discretionaryRoom(state, catalog = CATALOG) {
  return step({ ...positionOf(state, catalog), spent: 0 }).allowance / MONTHS_PER_YEAR;
}

/**
 * Quanto custa, em bilhoes, manter uma promessa de verba durante um mes.
 *
 * @param {Record<string, number>} funding
 * @param {ReadonlyArray<Party>} parties
 * @param {number} seatPrice
 * @returns {number}
 */
export function costOf(funding, parties, seatPrice) {
  let total = 0;
  for (const party of parties) {
    total += clamp(funding[party.id] ?? 0, 0, 1) * party.seats * seatPrice;
  }
  return total;
}

/**
 * Resolve um mes.
 *
 * E funcao PURA: mesmo estado, mesmas ordens e mesmo catalogo devolvem
 * exatamente o mesmo par. O unico sorteio do turno sai do fluxo que vive dentro
 * do estado, e ele volta avancado no estado devolvido — que e o que faz um
 * mandato inteiro ser reproduzivel a partir da semente e da lista de ordens.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {Options} [options]
 * @returns {{ state: GameState, report: Report }}
 */
export function playMonth(state, orders = {}, options = {}) {
  const catalog = options.catalog ?? CATALOG;
  const { parties, bills, fiscal } = catalog;
  const gdpGrowth = options.gdpGrowth ?? 0;

  /* A promessa, normalizada. Bancada que o jogador nao citou prometeu zero, e
     valor fora da faixa e cortado em vez de recusado: ordens vem de politica de
     simulacao e de arrastar um controle na tela, e nenhum dos dois deve
     conseguir derrubar o turno. */
  /** @type {Record<string, number>} */
  const promised = {};
  for (const party of parties) {
    promised[party.id] = clamp(orders.funding?.[party.id] ?? 0, 0, 1);
  }

  const position = positionOf(state, catalog);

  /* 1 — QUANTO CABE. O empenho ainda e zero porque e justamente isto que decide
     o empenho. `allowance` e anualizado, como toda a regra fiscal; o turno e
     mensal, e a divisao por doze mora em `discretionaryRoom`. */
  const room = discretionaryRoom(state, catalog);

  /* 2 — QUANTO CUSTA. O preco da cadeira e o cambio entre os dois motores. */
  const promisedCost = costOf(promised, parties, fiscal.seatPrice);

  /* 3 — QUANTO O CAIXA HONRA, rateado quando falta. */
  const ratio = promisedCost <= room ? 1 : room <= 0 ? 0 : room / promisedCost;
  /** @type {Record<string, number>} */
  const paid = {};
  for (const party of parties) {
    paid[party.id] = (promised[party.id] ?? 0) * ratio;
  }
  const paidCost = promisedCost * ratio;

  /* 4 — A VOTACAO, com a verba que chegou e nao com a que foi falada. */
  const bill = orders.billId ? (bills.find(item => item.id === orders.billId) ?? null) : null;
  const tally = bill
    ? vote({
        bill,
        parties,
        funding: paid,
        loyalty: state.loyalty,
        stream: state.streams.congress,
        majority: SIMPLE_MAJORITY,
      })
    : null;

  /* 5 — O QUE SOBROU NA BASE. */
  const loyalty = settle({ parties, loyalty: state.loyalty, promised, paid });

  /* 6 — O ORCAMENTO FECHA com o que de fato saiu. */
  const budget = step({ ...position, spent: paidCost });

  return {
    state: reduce(state, {
      type: "monthResolved",
      loyalty,
      fiscal: nextPosition(state, budget, tally, bill, gdpGrowth),
      stream: tally?.stream ?? state.streams.congress,
    }),
    report: {
      month: state.month,
      bill,
      budget,
      room,
      promisedCost,
      paidCost,
      promised,
      paid,
      tally,
      loyalty,
    },
  };
}

/**
 * A posicao orcamentaria com que o mes seguinte comeca.
 *
 * ── A VIRADA DE EXERCICIO ────────────────────────────────────────────────────
 * A ancora do arcabouco e o ano ANTERIOR, e ela nao pode andar mes a mes: se
 * andasse, o teto perseguiria a despesa e a regra deixaria de restringir
 * qualquer coisa. Entao ela fica parada onze meses e vira em dezembro, que e
 * quando o exercicio fecha.
 *
 * A ANCORA NOVA E O TETO QUE VIGOROU, e nao a despesa realizada. A primeira
 * versao usava o realizado, e a simulacao mostrou na hora por que isso esta
 * errado: um governo que gastou pouco em 2027 via o teto de 2028 desabar para o
 * proprio gasto — a regra PUNIA a economia e o discricionario caia de 25,9 para
 * 5,2 numa virada de ano. Isso nao e o arcabouco, e um catraca. O limite do
 * exercicio seguinte cresce sobre o LIMITE do anterior; quem gastou menos que o
 * teto simplesmente nao usou o espaco, e nao o perde.
 *
 * @param {GameState} state
 * @param {BudgetOutput} budget
 * @param {Tally | null} tally
 * @param {Bill | null} bill
 * @param {number} gdpGrowth
 * @returns {import("../state/state.mjs").Fiscal}
 */
function nextPosition(state, budget, tally, bill, gdpGrowth) {
  /* Pauta aprovada muda a despesa obrigatoria PARA SEMPRE, e e por isso que ela
     e a decisao mais pesada do jogo: o custo politico se paga uma vez e o efeito
     fiscal fica nos 48 meses. O sinal segue o catalogo — positivo poupa. */
  const relief = tally?.passed && bill ? bill.fiscalImpact : 0;
  const mandatory = Math.max(0, budget.mandatory - relief);

  const closesYear = (state.month + 1) % MONTHS_PER_YEAR === 0;

  return {
    gdp: state.fiscal.gdp * (1 + gdpGrowth) ** (1 / MONTHS_PER_YEAR),
    mandatory,
    anchorRevenue: closesYear ? budget.revenue : state.fiscal.anchorRevenue,
    anchorExpense: closesYear ? budget.ceiling : state.fiscal.anchorExpense,
    debt: budget.debt,
  };
}
