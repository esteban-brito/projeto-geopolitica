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
import { carry, step as economyStep } from "../domain/economy/index.mjs";
import { pollFrom, step as opinionStep } from "../domain/opinion/index.mjs";
import { THRESHOLDS, baseCount, settle, vote } from "../domain/congress/index.mjs";
import { CAPACITY_TARGET, NEUTRAL } from "../data/areas.mjs";
import { CATALOG } from "../data/catalog.mjs";
import { bandOf, compose, honour, spendOf } from "./agenda.mjs";
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
 * @property {Record<string, number>} [funding] verba PROMETIDA por bancada, de 0 a 1
 * @property {Record<string, number>} [levels] a intensidade PEDIDA de cada programa
 * @property {Record<string, import("../state/state.mjs").Band>} [bands] as leis PEDIDAS
 *
 * @typedef {object} Options
 * @property {typeof CATALOG} [catalog]
 * @property {number} [shock] choque de oferta do mes, em pontos de inflacao anual
 *
 * @typedef {object} Report o que o mes deixou, para a tela ou para o terminal
 * @property {number} month o mes que acabou de ser resolvido
 * @property {import("./agenda.mjs").Agenda} agenda a pauta composta do orcamento
 * @property {Record<string, number>} levels os niveis com que o mes fechou
 * @property {Record<string, import("../state/state.mjs").Band>} bands as leis com que o mes fechou
 * @property {boolean} enacted se a pauta virou realidade
 * @property {BudgetOutput} budget
 * @property {import("../domain/capacity/index.mjs").Outcome} capacity
 * @property {import("../domain/economy/index.mjs").EconomyOutput} economy o mes macro
 * @property {import("../domain/opinion/index.mjs").OpinionOutput} opinion a rua
 * @property {number} interest o custo de carregar a divida no mes
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

  /* O DIVIDENDO DAS ESTATAIS ENTRA PELO FATOR DE RECEITA, e a razao e evitar um
     campo novo no LASTRO por uma linha. O fator ja e "quanto do devido de fato
     entra"; somar a ele a razao entre dividendo e receita-base da exatamente
     `receita = base × pressao + dividendos`, sem o motor precisar aprender uma
     fonte de receita nova.

     ⚠ E ELE E PERMANENTE ENQUANTO A ESTATAL FOR DO ESTADO. Privatizar apaga esta
     linha para sempre — e essa e a metade da conta que a receita de venda esconde
     no mes em que ela entra. */
  const base = state.macro.gdp * catalog.fiscal.taxLoad;
  const dividends = catalog.rules.reduce(
    (sum, rule) =>
      sum + (rule.reach * rule.dividend * (state.levels[rule.id] ?? rule.initial)) / 100,
    0,
  );

  return {
    gdp: state.macro.gdp,
    mandatory: state.fiscal.mandatory,
    anchorRevenue: state.fiscal.anchorRevenue,
    anchorExpense: state.fiscal.anchorExpense,
    debt: state.fiscal.debt,
    parameters: catalog.fiscal,
    revenueFactor: pressure.revenue + (base > 0 ? dividends / base : 0),
    mandatoryFactor: pressure.mandatory,
  };
}

/**
 * A RECEITA DE VENDA — o que entra no mes em que se privatiza.
 *
 * ⚠ ELA E A ARMADILHA MAIS BONITA DO MODELO, e ninguem a escreveu como
 * armadilha. Ela entra UMA VEZ, engorda o resultado do exercicio, e por isso
 * levanta a ancora do arcabouco do ano seguinte — `nextPosition` fecha o ano com
 * o teto que vigorou. No ano depois ela nao se repete, o teto encolhe contra uma
 * obrigatoria que continuou crescendo, e o governo descobre que financiou custeio
 * permanente com caixa de uma vez. E aritmetica do LASTRO.
 *
 * @param {ReadonlyArray<import("../data/rules.mjs").Rule>} rules
 * @param {Record<string, number>} before
 * @param {Record<string, number>} after
 * @returns {number} bilhoes, no mes
 */
function saleOf(rules, before, after) {
  let total = 0;
  for (const rule of rules) {
    const sold = (before[rule.id] ?? rule.initial) - (after[rule.id] ?? rule.initial);
    /* SO A VENDA ARRECADA. Estatizar CUSTA — comprar de volta e desembolso —, e
       isso fica como omissao declarada: o preco de recompra depende de avaliacao
       de mercado, que e CORRENTE. Por enquanto reestatizar sai de graca em caixa
       e cobra em folha, que ja e metade da verdade. */
    if (sold > 0) total += (rule.reach * rule.sale * sold) / 100;
  }
  return total;
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
  const { parties, fiscal, programs } = catalog;

  /* O ORCAMENTO PEDIDO E O VIGENTE COM AS MUDANCAS POR CIMA. Programa que o
     jogador nao citou continua onde estava — e nao volta a zero, que seria a
     leitura de quem confunde "nao mexi" com "nao quero". */
  const requested = { ...state.levels, ...(orders.levels ?? {}) };

  /* A promessa, normalizada. Bancada que o jogador nao citou prometeu zero, e
     valor fora da faixa e cortado em vez de recusado: ordens vem de politica de
     simulacao e de arrastar um controle na tela, e nenhum dos dois deve
     conseguir derrubar o turno. */
  /** @type {Record<string, number>} */
  const promised = {};
  for (const party of parties) {
    promised[party.id] = clamp(orders.funding?.[party.id] ?? 0, 0, 1);
  }

  /* A ALOCACAO NAO E MAIS PEDIDA — ELA E DERIVADA DO ORCAMENTO ESCRITO.
     Antes o jogador arrastava um controle por area e dizia "quero 3 bilhoes na
     saude"; agora ele diz em que intensidade cada programa vai rodar, e o custo
     cai da conta. A diferenca nao e de interface: um numero em bilhoes nao diz o
     que o dinheiro compra, e por isso nao tinha como o Congresso reagir a ele.

     ⚠ SO A PARTE ACIMA DO PISO ENTRA AQUI. O gasto ate o piso e a lei sendo
     cumprida e ja esta na despesa obrigatoria — cobra-lo de novo no
     discricionario seria contar o mesmo real duas vezes. */
  /* ⚠ O GASTO DO MES USA A LEI VIGENTE, e nunca a proposta. A faixa que o texto
     pede so vale depois de o plenario votar — cobrar o discricionario contra ela
     seria o governo executando um orcamento com base numa lei que ainda nao
     existe, que e a definicao de gastar sem autorizacao. */
  const wanted = spendOf({ programs, levels: requested, bands: state.bands });
  const asked = wanted.byArea;
  const askedTotal = wanted.total;

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
  /* O CORTE EMPURRA CADA PROGRAMA DE VOLTA NA DIRECAO DO PISO, e nao multiplica
     a alocacao por fora. A diferenca importa: multiplicar daria um numero de
     bilhoes que nao corresponde a configuracao nenhuma, e o mes seguinte
     comecaria de um estado que o jogador nao consegue ler. Empurrando o NIVEL, o
     contingenciamento vira o que ele e no mundo — o Estado inteiro escorregando
     para o minimo legal, sem ninguem ter escolhido qual programa sofre. */
  const levels = honour({ programs, levels: requested, ratio, bands: state.bands });
  const allocated = spendOf({ programs, levels, bands: state.bands }).byArea;

  /* AS LEIS PEDIDAS ATRAVESSAM O RATEIO INTEIRAS, e nao ha o que ratear nelas:
     faixa nao consome caixa. Elas passam por aqui so para quem consulta o rateio
     — a tela e o turno — receber a proposta completa de uma vez. */
  const requestedBands = { ...state.bands, ...(orders.bands ?? {}) };

  return {
    promised,
    asked,
    room,
    demand,
    ratio,
    paid,
    requested,
    requestedBands,
    levels,
    allocated,
    promisedCost,
    paidCost: promisedCost * ratio,
    allocatedTotal: askedTotal * ratio,
  };
}

/**
 * O PLACAR FISCAL DO MES — a leitura que a tela de Financas mostra.
 *
 * ⚠ ELA EXISTE PORQUE O PAINEL NAO PODE REFAZER A CONTA. Financas mostra dez
 * numeros que sairiam de dois motores — LASTRO e CORRENTE —, e o entrypoint nao
 * alcanca motor: a fachada so abre a camada de aplicacao, e a guarda de
 * fronteiras cobra isso. Sem esta funcao, a saida seria expor `budgetStep` e
 * `carry` crus na fachada, e a tela passaria a montar a posicao orcamentaria por
 * fora — que e a definicao de conta que diverge. `settlement` fez o mesmo
 * caminho, e pela mesma razao.
 *
 * ELA E A FOTO DO MES COMO ELE VAI FECHAR, e nao a do mes que passou. O empenho
 * que entra e o que o caixa HONRA das ordens correntes, exatamente como no passo
 * 7 do turno — inclusive a venda de estatal, que abate empenho. Um painel que
 * ignorasse o mes corrente mostraria uma divida que so anda depois de o jogador
 * avancar, e a decisao que a moveu ja teria saido da tela.
 *
 * O JURO E O DO ESTOQUE QUE CHEGOU, a taxa que vigorava no inicio do mes — a
 * mesma regra do passo 9 —, e a divida que ela devolve ja o carrega, porque e
 * assim que `nextPosition` fecha o mes. Duas verdades sobre o estoque seriam uma
 * a mais.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 * @returns {{ budget: BudgetOutput, interest: number, debt: number, debtRatio: number }}
 */
export function ledger(state, orders = {}, catalog = CATALOG) {
  const share = settlement(state, orders, catalog);
  const proceeds = saleOf(catalog.rules, state.levels, share.levels);

  const budget = budgetStep({
    ...positionOf(state, catalog),
    spent: share.paidCost + share.allocatedTotal - proceeds,
  });

  const interest = carry({
    debt: state.fiscal.debt,
    rate: state.macro.rate,
    parameters: catalog.macro,
  });

  const debt = budget.debt + interest;

  return {
    budget,
    interest,
    debt,
    debtRatio: state.macro.gdp > 0 ? debt / state.macro.gdp : 0,
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
  const { areas, parties, programs } = catalog;

  const position = positionOf(state, catalog);

  /* 1, 2 e 3 — QUANTO CABE, QUANTO CUSTA e QUANTO O CAIXA HONRA. */
  const {
    promised,
    asked,
    room,
    paid,
    requested,
    levels: honoured,
    allocated,
    promisedCost,
    paidCost,
    allocatedTotal,
    ratio,
    requestedBands,
  } = settlement(state, orders, catalog);

  /* 4 — A VOTACAO, com a verba que chegou e nao com a que foi falada.
     A PAUTA NAO E MAIS ESCOLHIDA DE UMA LISTA: ela e composta do orcamento que o
     jogador escreveu, e o quorum sai do que o movimento derrubou. Remanejamento
     dentro das faixas nao vai a plenario — a lei ja autorizou, e pedir voto para
     executar o orcamento seria inventar um rito que nao existe. */
  const agenda = compose({
    programs,
    rules: catalog.rules,
    levels: state.levels,
    requested,
    power: state.levels["poder-do-executivo"] ?? 0,
    bands: state.bands,
    requestedBands,
  });

  /* ⚠ A RUA QUE PESA NA VOTACAO E A DO MES PASSADO, e nao a que SONDA vai apurar
     no fim deste turno. O parlamentar vota com a pesquisa que ele ja leu — e usar
     a de depois faria a decisao de hoje ser julgada por uma opiniao que ainda nao
     existia, que e a mesma armadilha que o juro sobre a divida evita. */
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  const tally =
    agenda.proposal && agenda.quorum > 0
      ? vote({
          bill: agenda.proposal,
          parties,
          funding: paid,
          loyalty: state.loyalty,
          stream: state.streams.congress,
          majority: agenda.quorum,
          standing,
        })
      : null;

  /* 5 — O QUE SOBROU NA BASE. */
  const loyalty = settle({ parties, loyalty: state.loyalty, promised, paid });

  /* 6 — A CAPACIDADE DO ESTADO. */
  const enacted = agenda.proposal !== null && (agenda.quorum === 0 || tally?.passed === true);

  /* ── O QUE ACONTECE QUANDO A REFORMA CAI ────────────────────────────────────
     Nao e tudo ou nada, e a distincao e a mesma que separou os ritos. O que era
     EXECUCAO ORCAMENTARIA acontece de qualquer jeito: ela nunca dependeu de voto,
     e derrubar junto seria o Congresso vetando uma coisa que ninguem lhe
     perguntou. So os movimentos que furaram parede voltam para onde estavam.

     Sem isto, um pacote com dez remanejamentos triviais e uma emenda ambiciosa
     custaria o mes inteiro por causa da parte ambiciosa — e o jogador aprenderia
     a nunca juntar as duas coisas, que e o oposto do que o logrolling existe para
     ensinar. */
  const applied = enacted
    ? honoured
    : honour({
        programs,
        levels: Object.fromEntries(
          programs.map(program => {
            const move = agenda.moves.find(
              item =>
                item.program.id === program.id && item.kind !== "floor" && item.kind !== "ceiling",
            );
            const reverted = move && move.rite !== "budget";
            const before = state.levels[program.id] ?? program.initial;
            return [program.id, reverted ? before : (requested[program.id] ?? before)];
          }),
        ),
        ratio,
        bands: state.bands,
      });

  /* ── A LEI SO MUDA SE O PLENARIO DEIXAR, e nao ha meio-termo aqui ────────────
     Movimento de faixa NUNCA e execucao orcamentaria: mexer no que a lei obriga
     custa lei, no minimo. Entao a regra que separa o que sobrevive a derrota nao
     tem trabalho nenhum deste lado — cai a pauta, cai a lei inteira, e o pais
     continua com as faixas que tinha. */
  const appliedBands = enacted ? requestedBands : state.bands;
  /* O IMPACTO DIRETO NO INDICE SUMIU, e a omissao e proposital. Cada pauta do
     catalogo antigo carregava um `impact` que empurrava o indice da area de uma
     vez, por fora do dinheiro — uma lei aprovada "melhorava a saude" sem que um
     real tivesse sido gasto. Com programa isso deixou de fazer sentido: o que
     move o indice e a VERBA que chegou, e a reforma move o indice porque muda
     quanto de verba passa a caber. Um empurrao extra estaria contando o mesmo
     efeito duas vezes. */
  const capacity = capacityStep({
    areas,
    index: state.capacity.index,
    history: state.capacity.history,
    allocation: allocated,
    impacts: {},
    neutral: NEUTRAL,
    capacityTarget: CAPACITY_TARGET,
  });

  /* 7 — O ORCAMENTO FECHA com tudo o que de fato saiu do discricionario. */
  /* A VENDA ABATE O EMPENHO DO MES. Ela nao e "menos gasto": e caixa que entrou,
     e o saldo do mes e o mesmo nos dois casos. Passa por aqui porque o LASTRO
     raciocina em empenho liquido, e criar uma terceira porta para o mesmo real
     seria duas contas para uma coisa. */
  const proceeds = saleOf(catalog.rules, state.levels, applied);
  const budget = budgetStep({ ...position, spent: paidCost + allocatedTotal - proceeds });

  /* 8 — A ECONOMIA, e ela vem DEPOIS do orcamento porque le o que ele empenhou.
     O impulso fiscal e o discricionario que de fato saiu, medido contra o PIB do
     mes: e a unica forma de "gastar" chegar a inflacao sem ninguem escrever a
     ligacao.

     ⚠ A CAPACIDADE ENTRA COMO MEDIA DAS SETE AREAS contra o ponto neutro, e isso
     e simplificacao declarada. O honesto seria so as areas que empurram o
     potencial — educacao, infraestrutura —, mas o catalogo ja diz qual area
     alimenta qual canal, e replicar esse mapa aqui seria a mesma verdade em dois
     lugares. A media inteira e grossa e nao mente. */
  const spread = areas.reduce(
    (sum, area) => sum + ((capacity.index[area.id] ?? area.initial) - NEUTRAL) / NEUTRAL,
    0,
  );

  const economy = economyStep({
    macro: state.macro,
    parameters: catalog.macro,
    taxLoad: catalog.fiscal.taxLoad,
    baseTaxLoad: catalog.fiscal.taxLoad,
    capacity: clamp(spread / areas.length, -1, 1),
    impulse: ((paidCost + allocatedTotal) * MONTHS_PER_YEAR) / Math.max(1, state.macro.gdp),
    shock: options.shock ?? 0,
  });

  /* 9 — O QUE A DIVIDA CUSTA. Ela roda a taxa que vigorava no INICIO do mes, e
     nao a que a CORRENTE acabou de decidir: juro se paga sobre o estoque ao preco
     do dia, e usar a taxa nova aqui faria a decisao do Banco Central retroagir um
     mes inteiro.

     ⚠ ELE NAO ENTRA NO PRIMARIO, e essa e a distincao que o arcabouco faz e o
     jogo tem de fazer junto: juro fica FORA do teto de despesa. Ele nao disputa
     com hospital — ele engorda a divida, e a divida volta pelo premio de risco. */
  const interest = carry({
    debt: state.fiscal.debt,
    rate: state.macro.rate,
    parameters: catalog.macro,
  });

  /* 10 — A RUA, e ela e o ultimo passo de proposito: SONDA le tudo o que os
     outros motores acabaram de produzir, e nao manda em nenhum deles neste mes.
     A realimentacao existe e chega no mes SEGUINTE, pelo poder de barganha —
     que e como funciona no mundo: popularidade de hoje compra voto amanha.

     ⚠ O QUE ELA LE E O QUE JA FOI DIVULGADO, e nao o mes que acabou de ser
     resolvido. A serie guarda o passado inteiro, entao a defasagem e um indice
     nela — e nao uma fila nova para manter. Nos primeiros meses a serie e curta
     e o valor mais antigo disponivel e o certo: um pais recem-empossado ainda
     esta lendo os numeros do governo anterior, que e exatamente a verdade. */
  const released = {
    inflation: releasedFrom(state.series.inflation, catalog.opinion.release, state.macro.inflation),
    unemployment: releasedFrom(
      state.series.unemployment,
      catalog.opinion.release,
      state.macro.unemployment,
    ),
    growth: economy.growth,
  };

  /* SERVICO E ORDEM SAO LEITURAS DA MALHA, e a composicao mora aqui porque motor
     nenhum chama outro motor. O que a rua sente por "servico publico" e a media
     de saude e educacao; por "ordem", o indice de seguranca sozinho. */
  const opinion = opinionStep({
    mood: state.mood,
    released,
    services: mean([capacity.index["health"], capacity.index["education"]]),
    safety: capacity.index["security"] ?? 50,
    /* A FRACAO DA PROMESSA QUE O CAIXA NAO HONROU. Ela ja custava base no
       Congresso; agora custa rua tambem, e pelo mesmo fato. */
    betrayal: promisedCost > 0 ? 1 - paidCost / promisedCost : 0,
    tenure: state.month,
    segments: catalog.segments,
    parameters: catalog.opinion,
  });

  return {
    state: reduce(state, {
      type: "monthResolved",
      loyalty,
      fiscal: nextPosition(state, budget, applied, catalog, interest, appliedBands),
      macro: economy.macro,
      mood: opinion.mood,
      series: extend(state.series, {
        gdp: economy.macro.gdp,
        inflation: economy.macro.inflation,
        rate: economy.macro.rate,
        unemployment: economy.macro.unemployment,
        debtRatio: budget.debtRatio,
        primary: budget.balance,
      }),
      capacity: { index: capacity.index, history: capacity.history },
      levels: applied,
      bands: appliedBands,
      stream: tally?.stream ?? state.streams.congress,
    }),
    report: {
      month: state.month,
      agenda,
      enacted,
      levels: applied,
      bands: appliedBands,
      capacity,
      economy,
      opinion,
      interest,
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

/* QUANTOS MESES A SERIE GUARDA. Um mandato inteiro, e nem um a mais: o painel
   desenha o mandato, e um buffer que cresce para sempre e um save que engorda
   para sempre — num jogo que ja atravessa o navegador fechado. */
const SERIES_LENGTH = 48;

/**
 * Acrescenta um mes a cada serie e corta o excesso pelo comeco.
 *
 * @param {import("../state/state.mjs").Series} series
 * @param {Record<string, number>} point
 * @returns {import("../state/state.mjs").Series}
 */
function extend(series, point) {
  const next = /** @type {Record<string, number[]>} */ ({});
  for (const [key, past] of Object.entries(series)) {
    next[key] = [...past, point[key] ?? 0].slice(-SERIES_LENGTH);
  }
  return /** @type {import("../state/state.mjs").Series} */ (/** @type {unknown} */ (next));
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
 * @param {Record<string, number>} applied os niveis com que o mes fechou
 * @param {typeof CATALOG} catalog
 * @param {number} interest o custo de carregar a divida NESTE mes
 * @param {Record<string, import("../state/state.mjs").Band>} appliedBands as leis com que o mes fechou
 * @returns {import("../state/state.mjs").Fiscal}
 */
function nextPosition(state, budget, applied, catalog, interest, appliedBands) {
  /* ── A ECONOMIA DA REFORMA DEIXOU DE SER ESCOLHIDA ──────────────────────────
     Enquanto o jogo tinha catalogo de pautas, cada uma trazia um `fiscalImpact`
     digitado a mao: a reforma da previdencia "poupava 48" porque alguem escreveu
     48. O jogador via um numero mudar e nunca via O QUE mudou.

     Agora ela e a conta do PISO QUE CAIU. O piso efetivo de um programa e o menor
     entre o que a lei obriga e onde ele de fato esta — quem furou o piso com 308
     votos passou a ter um piso novo, e essa e a definicao de reforma. A diferenca
     entre a soma dos pisos de antes e a de agora e o alivio permanente.

     E ELE E PERMANENTE NOS DOIS SENTIDOS, que e o que torna a decisao pesada: o
     custo politico se paga uma vez e o efeito fiscal fica nos 48 meses. Furar o
     piso para BAIXO alivia para sempre; ampliar um piso — o que so acontece por
     lei — cobra para sempre.

     ⚠ E A PARTIR DE 14/08/2026 O PISO TAMBEM SE MOVE. Enquanto ele era catalogo,
     a unica forma de aliviar a obrigatoria era furar a parede e deixar o gasto
     abaixo dela; agora a lei em si e movel, e a conta abaixo cobre as duas — ela
     compara o piso EFETIVO de antes com o de agora, e nao importa se o que mudou
     foi onde o programa esta ou onde a lei manda ele estar. Baixar o piso e
     manter o gasto nao alivia nada, e essa e a leitura certa: desvincular sem
     cortar nao economiza um real, so muda de qual bolso ele sai. */
  const floorOf = (
    /** @type {Record<string, number>} */ levels,
    /** @type {Record<string, import("../state/state.mjs").Band>} */ bands,
  ) =>
    catalog.programs.reduce(
      (sum, program) =>
        sum +
        (program.cost *
          Math.min(bandOf(program, bands).floor, levels[program.id] ?? program.initial)) /
          100,
      0,
    );

  /* A FOLHA DAS ESTATAIS TAMBEM E OBRIGATORIA, e por isso ela entra na mesma
     conta: privatizar tira gente da folha da Uniao para sempre, e esse alivio e
     tao permanente quanto o de furar um piso. E o contrario tambem vale —
     estatizar um setor traz a folha dele junto, e ninguem avisa. */
  const payrollOf = (/** @type {Record<string, number>} */ levels) =>
    catalog.rules.reduce(
      (sum, rule) => sum + (rule.reach * rule.payroll * (levels[rule.id] ?? rule.initial)) / 100,
      0,
    );

  const relief =
    floorOf(state.levels, state.bands) -
    floorOf(applied, appliedBands) +
    (payrollOf(state.levels) - payrollOf(applied));

  /* A BASE, e nao o valor mostrado. O fator de capacidade e leitura do mes e nao
     mudanca de estado — guardar o valor multiplicado faria o fator incidir sobre
     si mesmo todo mes. Ver o comentario em `src/domain/budget/`. */
  const mandatory = Math.max(0, budget.mandatoryBase - relief);

  const closesYear = (state.month + 1) % MONTHS_PER_YEAR === 0;

  return {
    mandatory,
    anchorRevenue: closesYear ? budget.revenueBase : state.fiscal.anchorRevenue,
    anchorExpense: closesYear ? budget.ceiling : state.fiscal.anchorExpense,
    /* ⚠ O JURO ENTRA AQUI, e so aqui. Ele nao passa pelo saldo primario — o
       arcabouco o exclui, e o jogo tem de excluir junto — mas ele engorda o
       estoque todo mes. E dai nasce a espiral que o Brasil conhece: gasto vira
       divida, divida vira juro, juro vira mais divida, e nenhuma linha de codigo
       diz "espiral". */
    debt: budget.debt + interest,
  };
}

/**
 * O INDICADOR QUE JA FOI DIVULGADO, `release` meses atras.
 *
 * ⚠ O PADRAO E O VALOR CORRENTE, e nao zero: nos primeiros meses a serie e curta
 * demais para ter passado, e devolver zero faria a rua ler inflacao zero e
 * desemprego zero — um paraiso de dois meses que nenhum jogador causou.
 *
 * @param {ReadonlyArray<number>} series
 * @param {number} release
 * @param {number} fallback
 */
function releasedFrom(series, release, fallback) {
  if (series.length === 0) return fallback;
  return series[Math.max(0, series.length - 1 - release)] ?? fallback;
}

/** @param {ReadonlyArray<number | undefined>} values */
function mean(values) {
  const known = values.filter(value => typeof value === "number");
  if (known.length === 0) return 50;
  return known.reduce((sum, value) => sum + value, 0) / known.length;
}
