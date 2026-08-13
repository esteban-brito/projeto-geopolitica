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
   · O IMPACTO FISCAL de uma pauta aprovada cai na despesa OBRIGATORIA, inclusive
     quando o texto e de receita. E a unica linha permanente que o orcamento
     carrega hoje — a receita e funcao do PIB e de mais nada. O sinal e o
     tamanho ficam certos, a linha nao; quando o motor macroeconomico existir,
     pauta de arrecadacao muda de lado;
   · O PIB nao anda sozinho. Ele e o motor macroeconomico, que nao existe, e por
     isso entra aqui como PREMISSA explicita de quem chama — com zero por padrao.
     Um crescimento inventado neste arquivo viraria modelo macro clandestino. */

import { step as budgetStep } from "../domain/budget/index.mjs";
import { pressureOf, step as capacityStep } from "../domain/capacity/index.mjs";
import { THRESHOLDS, baseCount, settle, vote } from "../domain/congress/index.mjs";
import { CAPACITY_TARGET, NEUTRAL } from "../data/areas.mjs";
import { quorumOf } from "../data/bills.mjs";
import { CATALOG } from "../data/catalog.mjs";
import { MONTHS_PER_YEAR, QUALIFIED_MAJORITY, SIMPLE_MAJORITY } from "../data/regime.mjs";
import { reduce } from "../state/state.mjs";

/**
 * @typedef {import("../state/state.mjs").GameState} GameState
 * @typedef {import("../data/bills.mjs").Bill} Bill
 * @typedef {import("../data/parties.mjs").Party} Party
 * @typedef {import("../domain/budget/index.mjs").BudgetOutput} BudgetOutput
 * @typedef {import("../domain/congress/index.mjs").Tally} Tally
 */

/**
 * @typedef {object} Orders as ordens do mes
 * @property {string | null} [billId] a acao levada a voto ou decretada, ou nada
 * @property {Record<string, number>} [funding] verba PROMETIDA por bancada, de 0 a 1
 * @property {Record<string, number>} [allocation] bilhoes pedidos por area
 *
 * @typedef {object} Options
 * @property {typeof CATALOG} [catalog]
 * @property {number} [gdpGrowth] premissa de crescimento REAL ANUAL do PIB
 *
 * @typedef {object} Report o que o mes deixou, para a tela ou para o terminal
 * @property {number} month o mes que acabou de ser resolvido
 * @property {Bill | null} bill
 * @property {boolean} enacted se a acao virou realidade — votada e aprovada, ou decretada
 * @property {BudgetOutput} budget
 * @property {import("../domain/capacity/index.mjs").Outcome} capacity
 * @property {number} room o discricionario que cabia NO MES, em bilhoes
 * @property {number} promisedCost quanto a promessa de emenda custaria
 * @property {number} paidCost quanto o caixa honrou de emenda
 * @property {number} allocatedTotal quanto o caixa honrou de alocacao
 * @property {Record<string, number>} promised
 * @property {Record<string, number>} paid
 * @property {Record<string, number>} asked bilhoes pedidos por area
 * @property {Record<string, number>} allocated bilhoes que chegaram, por area
 * @property {Tally | null} tally nulo quando nao houve votacao — decreto ou mes parado
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
 * A posicao com que o orcamento entra no mes, ja com a capacidade do Estado
 * pesando nela.
 *
 * A PRESSAO VEM DO HISTORICO QUE CHEGOU, e nao do mes que esta sendo resolvido.
 * A ordem nao e detalhe: se a alocacao deste mes ja melhorasse a arrecadacao
 * deste mes, o jogador financiaria a alocacao com a receita que ela mesma vai
 * gerar — dinheiro nascendo de si proprio. O atraso de cada area e o que impede
 * isso, e ele so vale se a leitura for feita antes.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function positionOf(state, catalog) {
  const pressure = pressureOf({
    areas: catalog.areas,
    history: state.capacity.history,
    neutral: NEUTRAL,
  });

  return {
    gdp: state.fiscal.gdp,
    mandatory: state.fiscal.mandatory,
    anchorRevenue: state.fiscal.anchorRevenue,
    anchorExpense: state.fiscal.anchorExpense,
    debt: state.fiscal.debt,
    parameters: catalog.fiscal,
    revenueFactor: pressure.revenue,
    mandatoryFactor: pressure.mandatory,
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
  return budgetStep({ ...positionOf(state, catalog), spent: 0 }).allowance / MONTHS_PER_YEAR;
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
 * A POSICAO DO GOVERNO — e nao a do pais, e muito menos a da opiniao publica.
 *
 * ⚠ ELA NAO E SONDA, e a distincao e o que torna esta funcao legitima. Aprovacao
 * e o que a populacao acha, depende de motor que nao existe, e por isso saiu da
 * tela. Isto aqui e outra coisa: e se o governo TEM COMO GOVERNAR — se o caixa
 * responde e se a base responde. Um governo com o teto fechado e a base rompida
 * esta em crise mesmo que ninguem tenha perguntado nada a populacao.
 *
 * Ela vive na camada de aplicacao porque compoe DOIS motores, e motor nenhum
 * chama outro: LASTRO diz se sobrou orcamento, ECLUSA diz se sobrou base.
 *
 * A ORDEM DAS PERGUNTAS E A DA GRAVIDADE, e cada degrau devolve o proprio
 * motivo — a tela precisa dizer QUAL crise, senao ela vira uma luz vermelha que
 * o jogador aprende a ignorar.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {{ level: "crisis" | "stable" | "growth", reason: string, base: number }}
 */
export function situationOf(state, catalog = CATALOG) {
  const { parties } = catalog;
  const budget = budgetStep({ ...positionOf(state, catalog), spent: 0 });
  const base = baseCount({ parties, loyalty: state.loyalty });

  const mood = (/** @type {Party} */ party) => state.loyalty[party.id] ?? 0;
  const ruptured = parties.some(party => mood(party) < THRESHOLDS.rupture);
  const obstructing = parties.some(party => mood(party) < THRESHOLDS.obstruction);

  /* O teto fechado vem primeiro porque ele nao se negocia: sem discricionario
     nao ha emenda, e sem emenda a base nao se compra de volta. */
  if (budget.contingency) return { level: "crisis", reason: "contingency", base };
  if (ruptured) return { level: "crisis", reason: "rupture", base };
  if (base < SIMPLE_MAJORITY) return { level: "crisis", reason: "minority", base };

  /* OBSTRUCAO SEGURA O GOVERNO EM "ESTAVEL" mesmo com a base grande, e isso e
     desenho: um degrau que so aparece na crise seria um degrau que nunca
     aparece, porque a queda da lealdade passa por ele em um mes. */
  if (obstructing) return { level: "stable", reason: "obstruction", base };
  if (base < QUALIFIED_MAJORITY) return { level: "stable", reason: "tight", base };

  return { level: "growth", reason: "comfortable", base };
}

/**
 * O RATEIO DO MES — o que foi prometido, e o que o caixa de fato honra.
 *
 * ⚠ ELA E EXPORTADA PARA A TELA, e a razao e um defeito visto na propria tela.
 * A Mesa previa o placar com a verba PROMETIDA enquanto o turno vota com a
 * PAGA. Enquanto a promessa cabia no mes as duas eram a mesma coisa e nada
 * aparecia; no instante em que o jogador prometia demais — que e justamente o
 * momento em que ele precisa da previsao — a tela anunciava um placar que o
 * turno nao ia produzir, e podia anunciar "acima do quorum" numa votacao que o
 * corte derrubava. Refazer o rateio por fora seria a mesma conta em dois
 * lugares, e conta refeita por fora e conta que diverge.
 *
 * O corte e o MESMO para emenda e para area: prometer demais ao Congresso
 * encolhe o hospital no mesmo mes, e e assim que o jogador descobre que as duas
 * contas eram uma. Ele tambem e PROPORCIONAL — o governo nao escolhe quem trair
 * quando o teto fecha.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 */
export function settlement(state, orders = {}, catalog = CATALOG) {
  const { areas, parties, fiscal } = catalog;

  /* A promessa, normalizada. Bancada que o jogador nao citou prometeu zero, e
     valor fora da faixa e cortado em vez de recusado: ordens vem de politica de
     simulacao e de arrastar um controle na tela, e nenhum dos dois deve
     conseguir derrubar o turno. */
  /** @type {Record<string, number>} */
  const promised = {};
  for (const party of parties) {
    promised[party.id] = clamp(orders.funding?.[party.id] ?? 0, 0, 1);
  }

  /* A alocacao pedida, em bilhoes e nao em fracao: area nao tem "verba cheia". */
  /** @type {Record<string, number>} */
  const asked = {};
  let askedTotal = 0;
  for (const area of areas) {
    asked[area.id] = Math.max(0, orders.allocation?.[area.id] ?? 0);
    askedTotal += asked[area.id] ?? 0;
  }

  /* QUANTO CABE. O empenho ainda e zero porque e justamente isto que decide o
     empenho. `allowance` e anualizado, como toda a regra fiscal; o turno e
     mensal, e a divisao por doze mora em `discretionaryRoom`. */
  const room = discretionaryRoom(state, catalog);

  /* QUANTO CUSTA. Emenda e ministerio saem da MESMA bolsa, e essa e a decisao de
     desenho mais importante deste arquivo: se cada um tivesse a sua, comprar o
     Congresso nao custaria saude, e a escolha central do jogo — a quem pagar —
     deixaria de existir. O preco da cadeira e o cambio que poe as duas na mesma
     moeda. */
  const promisedCost = costOf(promised, parties, fiscal.seatPrice);
  const demand = promisedCost + askedTotal;

  const ratio = demand <= room ? 1 : room <= 0 ? 0 : room / demand;

  /** @type {Record<string, number>} */
  const paid = {};
  for (const party of parties) {
    paid[party.id] = (promised[party.id] ?? 0) * ratio;
  }
  /** @type {Record<string, number>} */
  const allocated = {};
  for (const area of areas) {
    allocated[area.id] = (asked[area.id] ?? 0) * ratio;
  }

  return {
    promised,
    asked,
    room,
    demand,
    ratio,
    paid,
    allocated,
    promisedCost,
    paidCost: promisedCost * ratio,
    allocatedTotal: askedTotal * ratio,
  };
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
  const { areas, parties, bills } = catalog;
  const gdpGrowth = options.gdpGrowth ?? 0;

  const position = positionOf(state, catalog);

  /* 1, 2 e 3 — QUANTO CABE, QUANTO CUSTA e QUANTO O CAIXA HONRA. */
  const { promised, asked, room, paid, allocated, promisedCost, paidCost, allocatedTotal } =
    settlement(state, orders, catalog);

  /* 4 — A VOTACAO, com a verba que chegou e nao com a que foi falada, e contra
     o quorum DO INSTRUMENTO: 257 para lei, 308 para emenda. Decreto nao vota. */
  const ordered = orders.billId ? (bills.find(item => item.id === orders.billId) ?? null) : null;

  /* O QUE JA ESTA EM VIGOR NAO VOLTA A PAUTA, e a guarda tem de ser AQUI.
     A primeira versao dela vivia na lista do estado, que se recusava a guardar o
     mesmo id duas vezes — e isso resolvia so o sintoma visivel. O mes continuava
     votando: a pauta ia a plenario de novo, o impacto no indice da area entrava
     de novo, e o impacto fiscal era somado a despesa obrigatoria MAIS UMA VEZ.
     Uma reforma aprovada seis vezes cobrava seis vezes, com a lista mostrando
     uma linha so — o pior formato possivel, porque nenhuma tela denunciaria.
     Recusar a ordem inteira e o unico ponto que fecha os tres de uma vez. */
  const bill = ordered && !state.enacted.includes(ordered.id) ? ordered : null;
  const decreed = bill?.instrument === "decree";
  const tally =
    bill && !decreed
      ? vote({
          bill,
          parties,
          funding: paid,
          loyalty: state.loyalty,
          stream: state.streams.congress,
          majority: quorumOf(bill),
        })
      : null;

  /* 5 — O QUE SOBROU NA BASE. */
  const loyalty = settle({ parties, loyalty: state.loyalty, promised, paid });

  /* 6 — A CAPACIDADE DO ESTADO. Decreto vale sem votacao; lei e emenda so movem
     o indice se tiverem passado. */
  const enacted = decreed || tally?.passed === true;
  const capacity = capacityStep({
    areas,
    index: state.capacity.index,
    history: state.capacity.history,
    allocation: allocated,
    impacts: enacted && bill ? { [bill.area]: bill.impact } : {},
    neutral: NEUTRAL,
    capacityTarget: CAPACITY_TARGET,
  });

  /* 7 — O ORCAMENTO FECHA com tudo o que de fato saiu do discricionario. */
  const budget = budgetStep({ ...position, spent: paidCost + allocatedTotal });

  return {
    state: reduce(state, {
      type: "monthResolved",
      loyalty,
      fiscal: nextPosition(state, budget, enacted, bill, gdpGrowth),
      capacity: { index: capacity.index, history: capacity.history },
      /* A lista so cresce, e sem repetido — mas a garantia de nao repetir NAO
         mora aqui: mora na recusa da ordem, la em cima. Uma segunda checagem
         neste ponto nao acrescentaria seguranca nenhuma e daria a impressao de
         que a duplicidade e um problema de lista, que foi exatamente o engano
         que deixou o efeito fiscal dobrando. */
      enacted: enacted && bill ? [...state.enacted, bill.id] : state.enacted,
      stream: tally?.stream ?? state.streams.congress,
    }),
    report: {
      month: state.month,
      bill,
      enacted,
      capacity,
      asked,
      allocated,
      allocatedTotal,
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
 * @param {boolean} enacted
 * @param {Bill | null} bill
 * @param {number} gdpGrowth
 * @returns {import("../state/state.mjs").Fiscal}
 */
function nextPosition(state, budget, enacted, bill, gdpGrowth) {
  /* Acao que virou realidade muda a despesa obrigatoria PARA SEMPRE, e e por
     isso que ela e a decisao mais pesada do jogo: o custo politico se paga uma
     vez e o efeito fiscal fica nos 48 meses. O sinal segue o catalogo — positivo
     poupa. Decreto conta aqui igual a lei: o que separa os dois e o rito, e nao
     a consequencia. */
  const relief = enacted && bill ? bill.fiscalImpact : 0;

  /* A BASE, e nao o valor mostrado. O fator de capacidade e leitura do mes e nao
     mudanca de estado — guardar o valor multiplicado faria o fator incidir sobre
     si mesmo todo mes. Ver o comentario em `src/domain/budget/`. */
  const mandatory = Math.max(0, budget.mandatoryBase - relief);

  const closesYear = (state.month + 1) % MONTHS_PER_YEAR === 0;

  return {
    gdp: state.fiscal.gdp * (1 + gdpGrowth) ** (1 / MONTHS_PER_YEAR),
    mandatory,
    anchorRevenue: closesYear ? budget.revenueBase : state.fiscal.anchorRevenue,
    anchorExpense: closesYear ? budget.ceiling : state.fiscal.anchorExpense,
    debt: budget.debt,
  };
}
