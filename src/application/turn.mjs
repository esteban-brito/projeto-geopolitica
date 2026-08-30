/* O TURNO — onde o orcamento e o Congresso se encontram. */

import { revenueOf, step as budgetStep } from "../domain/budget/index.mjs";
import { pressureOf, step as capacityStep } from "../domain/capacity/index.mjs";
import { benches as benchesOf, cast, offered, president, remember } from "../domain/cast/index.mjs";
import { carry, premiumOf, step as economyStep } from "../domain/economy/index.mjs";
import { capitalShares, heat, rupture } from "../domain/pressure/index.mjs";
import { enact, resolve } from "../domain/norms/index.mjs";
import {
  opening as opinionOpening,
  pollFrom,
  step as opinionStep,
} from "../domain/opinion/index.mjs";
import {
  THRESHOLDS,
  baseCount,
  dispersion,
  seating,
  settle,
  vote,
  whipCount,
} from "../domain/congress/index.mjs";
import { CAPACITY_TARGET, NEUTRAL } from "../data/areas.mjs";
import { CATALOG } from "../data/catalog.mjs";
import { waivedOf } from "../data/programs.mjs";
import { bandOf, compose, honour, spendOf } from "./agenda.mjs";
import { DRAWER_LIFE, forgotten, proposalOf, reports, tables } from "./passage.mjs";
import {
  CARRY,
  alarm,
  amendment,
  demand,
  notice,
  pending,
  report,
  settle as settleMail,
} from "./mail.mjs";
import {
  MONTHS_PER_TERM,
  MONTHS_PER_YEAR,
  QUALIFIED_MAJORITY,
  SIMPLE_MAJORITY,
  SEATS,
  REMOVAL_MAJORITY,
} from "../data/regime.mjs";
import { OPENING_MONTH, reduce } from "../state/state.mjs";

/**
 * @typedef {import("../state/state.mjs").GameState} GameState
 * @typedef {import("../data/bills.mjs").Bill} Bill
 * @typedef {import("../data/parties.mjs").Party} Party
 * @typedef {import("../domain/budget/index.mjs").BudgetOutput} BudgetOutput
 * @typedef {import("../domain/congress/index.mjs").Tally} Tally
 */

/**
 * ⚠ A RESPOSTA E ORDEM, E NAO ACAO PROPRIA, e a alternativa foi recusada com razao escrita em
 * `state.mjs`: o vencimento acontece dentro do turno, e uma resposta que mutasse o estado
 * fora dele criaria dois caminhos para a mesma carta.
 *
 * @typedef {object} Orders as ordens do mes
 * @property {Record<string, number>} [funding] verba PROMETIDA por bancada, de 0 a 1
 * @property {Record<string, number>} [levels] a intensidade PEDIDA de cada programa
 * @property {Record<string, import("../state/state.mjs").Band>} [bands] as leis PEDIDAS
 * @property {Record<string, string>} [mail] o que o jogador respondeu a cada carta
 * @typedef {object} Options
 * @property {typeof CATALOG} [catalog]
 * @property {number} [shock] choque de oferta do mes, em pontos de inflacao anual
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
 * @property {number} ratio a fracao do pedido que o caixa honrou; 1 e mes sem corte
 * @property {Record<string, number>} promised
 * @property {Record<string, number>} paid
 * @property {Record<string, number>} asked bilhoes pedidos por area
 * @property {Record<string, number>} allocated bilhoes que chegaram, por area
 * @property {Tally | null} tally nulo quando nao houve votacao — decreto ou mes parado
 * @property {Record<string, number>} loyalty o humor depois do mes
 * @property {Balance} balance as tres leituras do mes, com o antes e o depois de cada
 * uma. ⚠ ELAS SUBIRAM PARA CA porque a carta da Casa Civil passou a
 * imprimir as tres — e a tela nao pode medir nenhuma delas por fora: `discretionaryRoom`
 * perguntado ao estado vivo daria o mes SEGUINTE, e a view estaria contando outro mes
 * @property {ReadonlyArray<import("../domain/cast/index.mjs").Person>} people o elenco do mandato
 * @property {Record<string, number>} memory o que cada pessoa passou a lembrar
 * @property {ReadonlyArray<{ kind: string, label: string, detail: string | null }>} events
 * o que a tramitacao fez no mes: engavetou, pautou, relatou, aprovou ou derrubou
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
 * AS ALAVANCAS COMO O MOTOR DE NORMAS AS VÊ — id e grupo, e nada mais.
 *
 * @param {typeof CATALOG} catalog
 * @returns {import("../domain/norms/index.mjs").Lever[]}
 */
function leversOf(catalog) {
  return [
    /* ⚠ O CUSTO VAI JUNTO, e ele so serve a VINCULACAO: e o divisor que converte "15% da
       receita" em pontos daquela alavanca. */
    ...catalog.programs.map(program => ({
      id: program.id,
      group: program.area,
      cost: program.cost,
    })),
    ...catalog.rules.map(rule => ({ id: rule.id, group: rule.family })),
  ];
}

/**
 * O QUE OS GATILHOS LEEM, e so o que o estado ja guarda.
 *
 * @param {GameState} state
 * @returns {Record<string, number>}
 */
function indicatorsOf(state) {
  return {
    debtRatio: state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0,
    gdp: state.macro.gdp,
    inflation: state.macro.inflation,
    rate: state.macro.rate,
    unemployment: state.macro.unemployment,
  };
}

/**
 * ⚠ SO O LADO QUE SE MOVEU ENTRA NA NORMA, e a tentacao de gravar os dois e o defeito que
 * isto existe para evitar.
 *
 * @param {Record<string, import("../state/state.mjs").Band>} before as leis vigentes
 * @param {Record<string, import("../state/state.mjs").Band>} after as leis pedidas
 * @param {number} month
 * @param {typeof CATALOG} catalog
 * @returns {import("../domain/norms/index.mjs").Norm[]}
 */
function normsFrom(before, after, month, catalog) {
  /** @type {import("../domain/norms/index.mjs").Norm[]} */
  const written = [];

  for (const lever of [...catalog.programs, ...catalog.rules]) {
    const was = before[lever.id];
    const asked = after[lever.id];
    if (!was || !asked) continue;

    /** @type {{ floor?: number, ceiling?: number }} */
    const moved = {};
    if (asked.floor !== was.floor) moved.floor = asked.floor;
    if (asked.ceiling !== was.ceiling) moved.ceiling = asked.ceiling;
    if (moved.floor === undefined && moved.ceiling === undefined) continue;

    written.push(enact({ lever, month, ...moved }));
  }

  return written;
}

/**
 * Duas montagens da mesma coisa e a definicao de conta que diverge — e esta divergiria no mes
 * em que uma clausula de gatilho ligasse, que e justamente o mes em que o jogador precisava
 * do numero.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {Record<string, import("../state/state.mjs").Band>}
 */
export function bandsOf(state, catalog = CATALOG) {
  return resolve({
    norms: state.norms,
    levers: leversOf(catalog),
    month: state.month,
    indicators: indicatorsOf(state),
    revenue: revenueNow(state, catalog),
  }).bands;
}

/**
 * A RECEITA SOBRE A QUAL A VINCULACAO INCIDE.
 *
 * ⚠ ELA E PERGUNTADA AO LASTRO, e nao remontada aqui: `revenueOf` e a mesma funcao
 * que o turno usa para fechar o mes, e um segundo lugar multiplicando PIB por carga
 * daria dois pisos da saude divergindo no primeiro mes em que a formula mudasse.
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */

/* ── O DESCONTENTAMENTO DE CADA GRUPO, e ele e a UNICA coisa que a CALDEIRA nao sabe fazer
   sozinha. */
/**
 * @param {object} input
 * @param {number} input.debtRatio
 * @param {number} input.delivered - a verba que de fato CHEGOU as bancadas, 0 a 1
 * @param {Record<string, number>} input.index - o indice de cada area
 * @param {ReadonlyArray<string>} [input.spurned] - os lobbies cuja exigencia foi
 * recusada ou deixada vencer NESTE mes
 * @param {typeof CATALOG} input.catalog
 * @returns {Record<string, number>} de 0 (satisfeito) a 1 (fervendo)
 */
function grievanceOf({ debtRatio, delivered, index, spurned = [], catalog }) {
  /** @type {Record<string, number>} */
  const want = {};

  for (const lobby of catalog.lobbies) {
    if (lobby.reads === "debt") {
      /* ⚠ A MESMA TOLERANCIA DO PREMIO DE RISCO, lida do mesmo lugar: o mercado que cobra
         spread e o mercado que abandona o governo sao o mesmo mercado, e dois limiares
         diferentes fariam ele desconfiar em um numero e fugir em outro. */
      const excess = debtRatio - catalog.fiscal.initialDebtRatio;
      want[lobby.id] = clamp(excess / DEBT_SPAN, 0, 1);
      continue;
    }

    if (lobby.reads === "share") {
      /* ⚠ O QUE CHEGOU, E NAO O RATEIO — e esta linha e a correcao do defeito mais grave que
         a CALDEIRA teve, achado na primeira medicao dela.
         A primeira versao lia `ratio`: que FRACAO do prometido o caixa honrou.
         E com isso um governo que nao promete nada a ninguem honra 100% de zero e o baixo
         clero ficava SATISFEITO — pressao zero em 48 meses de descaso completo. */
      want[lobby.id] = clamp(1 - delivered, 0, 1);
      continue;
    }

    /* CAPACIDADE: o indice das areas dele contra o ponto neutro. */
    const ids = (lobby.areas ?? "").split(" ").filter(Boolean);
    if (ids.length === 0) {
      want[lobby.id] = 0;
      continue;
    }
    const mean = ids.reduce((sum, id) => sum + (index[id] ?? NEUTRAL), 0) / ids.length;
    want[lobby.id] = clamp((NEUTRAL - mean) / NEUTRAL, 0, 1);
  }

  /* ── O RANCOR DE QUEM FOI RECUSADO ────────────────────────────────────────── ⚠ E O
     SILENCIO CONTA COMO RECUSA, e nao como meio-termo.
     ⚠ ELE E A UNICA COISA QUE A CHANTAGEM SOMA A CALDEIRA, e ele nao tem memoria
     propria de proposito: a pressao JA e um estoque com inercia, entao um mes de
     queixa alta continua doendo nos meses seguintes sozinho. Guardar um rancor a
     parte seria a mesma verdade em dois lugares — e o que a caldeira guarda E o
     rancor de quem foi recusado. */
  for (const id of spurned) {
    want[id] = clamp((want[id] ?? 0) + catalog.pressure.spite, 0, 1);
  }

  return want;
}

/**
 * O SPREAD QUE O MERCADO COBRA HOJE — e ele e uma LEITURA do estado, e nao um campo.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function premiumNow(state, catalog) {
  return premiumOf({
    debtRatio: state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0,
    /* ⚠ A TOLERANCIA E A DIVIDA HERDADA, lida do catalogo fiscal e nao repetida aqui: o
       mercado ja precificou o pais que o presidente recebeu, e o que ele cobra e a
       DETERIORACAO. */
    tolerance: catalog.fiscal.initialDebtRatio,
    slope: catalog.macro.riskPremium,
  });
}

/**
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function revenueNow(state, catalog) {
  return revenueOf(state.macro.gdp, catalog.fiscal.taxLoad);
}

/**
 * O QUE TRAVA O ORCAMENTO, e QUAL TEXTO o trava.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @param {number} [top] quantas linhas devolver
 * @returns {{ id: string, label: string, area: string, spend: number, guard: string, norm: string }[]}
 */
export function lockedBy(state, catalog = CATALOG, top = 3) {
  const { bands, governs } = resolve({
    norms: state.norms,
    levers: leversOf(catalog),
    month: state.month,
    indicators: indicatorsOf(state),
    revenue: revenueNow(state, catalog),
  });

  return catalog.programs
    .map(program => {
      const floor = Math.min(
        bands[program.id]?.floor ?? program.floor,
        state.levels[program.id] ?? program.initial,
      );
      return {
        id: program.id,
        label: program.label,
        area: program.area,
        /* EM BILHOES POR MES, que e a moeda em que o cofre fala. */
        spend: (Math.max(0, floor) / 100) * program.cost * (1 / MONTHS_PER_YEAR),
        guard: program.guard,
        norm: governs[program.id] ?? "",
      };
    })
    .filter(item => item.spend > 0)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, top);
}

/**
 * A posicao com que o orcamento entra no mes, ja com a capacidade do Estado pesando nela.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function positionOf(state, catalog) {
  const pressure = pressureOf({ areas: catalog.areas, history: state.capacity.history });

  /* O DIVIDENDO DAS ESTATAIS ENTRA PELO FATOR DE RECEITA, e a razao e evitar um campo novo no
     LASTRO por uma linha. */
  const base = state.macro.gdp * catalog.fiscal.taxLoad;

  /* O canal fiscal continua inteiro, porque o que ele sempre mediu foi a MUDANCA: privatizar
     apaga o dividendo e a receita cai na hora — que e a metade da conta que a receita de
     venda esconde no mes em que ela entra. */
  const dividendOf = (/** @type {Record<string, number>} */ levels) =>
    catalog.rules.reduce(
      (sum, rule) => sum + (rule.reach * rule.dividend * (levels[rule.id] ?? rule.initial)) / 100,
      0,
    );

  const opening = Object.fromEntries(catalog.rules.map(rule => [rule.id, rule.initial]));
  const dividends = dividendOf(state.levels) - dividendOf(opening);

  /* ⚠ A RENUNCIA ABATE A RECEITA, e ela e lida CHEIA e nao em delta — ao contrario do
     dividendo logo acima. A assimetria tem aritmetica atras: o dividendo e um ganho que o
     jogador CRIA privatizando, entao so o movimento conta; a desoneracao ja existia na posse
     e a carga do catalogo foi calibrada contra um pais que a tem. Lida em delta, o primario
     de abertura saltaria de −51,2 para −31,4 — recalibragem por efeito colateral. */
  const waived = waivedOf(catalog.programs, state.levels);

  return {
    gdp: state.macro.gdp,
    /* A INFLACAO INDEXA A OBRIGATORIA, e por isso ela atravessa a fronteira: sem ela,
       aposentadoria e salario encolhiam contra o PIB nominal todo mes. */
    inflation: state.macro.inflation,
    mandatory: state.fiscal.mandatory,
    anchorRevenue: state.fiscal.anchorRevenue,
    anchorExpense: state.fiscal.anchorExpense,
    /* Sem esta fracao, o piso da banda entrega o crescimento de um ano inteiro no PRIMEIRO
       mes: medido, R$ 107 bi de teto a mais na posse, sobre um discricionario de 176. */
    elapsed:
      ((state.month < MONTHS_PER_YEAR
        ? state.month - OPENING_MONTH
        : state.month % MONTHS_PER_YEAR) +
        1) /
      MONTHS_PER_YEAR,
    debt: state.fiscal.debt,
    parameters: catalog.fiscal,
    revenueFactor: pressure.revenue + (base > 0 ? (dividends - waived) / base : 0),
    mandatoryFactor: pressure.mandatory,
  };
}

/**
 * A RECEITA DE VENDA — o que entra no mes em que se privatiza.
 *
 * permanente com caixa de uma vez. E aritmetica do LASTRO.
 * @param {ReadonlyArray<import("../data/rules.mjs").Rule>} rules
 * @param {Record<string, number>} before
 * @param {Record<string, number>} after
 * @returns {number} bilhoes, no mes
 */
function saleOf(rules, before, after) {
  let total = 0;
  for (const rule of rules) {
    const sold = (before[rule.id] ?? rule.initial) - (after[rule.id] ?? rule.initial);
    /* SO A VENDA ARRECADA.
       de mercado, que e CORRENTE. Por enquanto reestatizar sai de graca em caixa
       e cobra em folha, que ja e metade da verdade. */
    if (sold > 0) total += (rule.reach * rule.sale * sold) / 100;
  }
  return total;
}

/**
 * QUANTO CABE NESTE MES, em bilhoes — o discricionario ja dividido por doze.
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
 * chama outro: LASTRO diz se sobrou orcamento, ECLUSA diz se sobrou base.
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

  /* O teto fechado vem primeiro porque ele nao se negocia: sem discricionario nao ha emenda,
     e sem emenda a base nao se compra de volta. */
  if (budget.contingency) return { level: "crisis", reason: "contingency", base };
  if (ruptured) return { level: "crisis", reason: "rupture", base };
  if (base < SIMPLE_MAJORITY) return { level: "crisis", reason: "minority", base };

  if (obstructing) return { level: "stable", reason: "obstruction", base };
  if (base < QUALIFIED_MAJORITY) return { level: "stable", reason: "tight", base };

  return { level: "growth", reason: "comfortable", base };
}

/**
 * ⚠ ELA E EXPORTADA PARA A TELA, e a razao e um defeito visto na propria tela.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 */
export function settlement(state, orders = {}, catalog = CATALOG) {
  const { parties, fiscal, programs } = catalog;

  /* A LEI VIGENTE, LIDA UMA VEZ SO. */
  const bands = bandsOf(state, catalog);

  /* O ORCAMENTO PEDIDO E O VIGENTE COM AS MUDANCAS POR CIMA. */
  const written = { ...state.levels, ...(orders.levels ?? {}) };

  /* Um piso vinculado anda com a receita: medido, o da media e alta complexidade sobe de
     63,00 para 64,60 em cinco meses enquanto o nivel vigente cai de 66,00 para 65,60. */
  /* ⚠ OS DOIS LADOS SOBEM JUNTOS, e a primeira versao subiu so um — o que criou um defeito
     novo que uma prova pegou na hora. */
  /** @type {Record<string, number>} */
  const current = {};
  /** @type {Record<string, number>} */
  const requested = {};
  for (const [id, level] of Object.entries(written)) {
    const before = state.levels[id] ?? level;
    const floor = bands[id]?.floor ?? 0;
    current[id] = Math.max(before, floor);
    requested[id] = level < before ? level : Math.max(level, floor);
  }

  /* A promessa, normalizada. */
  /** @type {Record<string, number>} */
  const promised = {};
  for (const party of parties) {
    promised[party.id] = clamp(orders.funding?.[party.id] ?? 0, 0, 1);
  }

  /* A ALOCACAO NAO E MAIS PEDIDA — ELA E DERIVADA DO ORCAMENTO ESCRITO. */
  /* ⚠ O GASTO DO MES USA A LEI VIGENTE, e nunca a proposta. */
  /* De quebra morre o segundo `compose` do arquivo — quem quiser a pauta pergunta ao rateio.
     NAO e cortado — e a MALHA recebia o mes como se tivesse sido, e o caixa cobrava
     o empenho que nao saiu. Antes a divergencia durava um mes (ate a votacao); agora
     dura TRES, ou para sempre se o texto morrer engavetado. */
  /* AS LEIS PEDIDAS ATRAVESSAM O RATEIO INTEIRAS, e nao ha o que ratear nelas: faixa nao
     consome caixa. */
  const requestedBands = { ...bands, ...(orders.bands ?? {}) };

  const agenda = compose({
    programs,
    rules: catalog.rules,
    levels: current,
    requested,
    power: state.levels["poder-do-executivo"] ?? 0,
    bands,
    requestedBands,
  });

  const held = Object.fromEntries(
    programs.map(program => {
      const move = agenda.moves.find(
        item => item.program.id === program.id && item.kind !== "floor" && item.kind !== "ceiling",
      );
      const waits = move && move.rite !== "budget";
      const before = state.levels[program.id] ?? program.initial;
      return [program.id, waits ? before : (requested[program.id] ?? before)];
    }),
  );

  const wanted = spendOf({ programs, levels: held, bands });
  const asked = wanted.byArea;
  const askedTotal = wanted.total;

  const room = discretionaryRoom(state, catalog);

  /* QUANTO CUSTA. */
  /* ⚠ O LEILAO: COM O PROCESSO ABERTO, A CADEIRA CUSTA MAIS. */
  const seatPrice = fiscal.seatPrice * (state.impeachment === null ? 1 : SIEGE_PRICE);
  const promisedCost = costOf(promised, parties, seatPrice);
  const demand = promisedCost + askedTotal;

  const ratio = demand <= room ? 1 : room <= 0 ? 0 : room / demand;

  /** @type {Record<string, number>} */
  const paid = {};
  for (const party of parties) {
    paid[party.id] = (promised[party.id] ?? 0) * ratio;
  }
  /* O CORTE EMPURRA CADA PROGRAMA DE VOLTA NA DIRECAO DO PISO, e nao multiplica a alocacao
     por fora. */
  const levels = honour({ programs, levels: held, ratio, bands });
  const honoured = spendOf({ programs, levels, bands });
  const allocated = honoured.byArea;

  /* O QUE A CAPACIDADE CONSOME E O GASTO CHEIO DA AREA, e nao a parte acima do piso: o
     que constroi capacidade e o dinheiro que chega ao hospital, e nao o rotulo juridico
     dele. Enquanto a MALHA lia so o
     discricionario, derrubar um piso convertia gasto obrigatorio em compra de
     indice sem mover um real — e desregulamentar era a jogada dominante. */
  const funded = honoured.fullByArea;

  /* ── O PLENARIO COM GENTE DENTRO ───────────────────────────────────────── ⚠ A CAMARA E
     MONTADA AQUI, E NAO NO TURNO, pela mesma razao que o rateio: a tela precisa prever com
     EXATAMENTE a mesma camara que vai votar.
     O ELENCO SE REFAZ DA SEMENTE a cada chamada, e isso e barato de proposito: cada pessoa
     sai de um hash da semente com o id do arquetipo, sem consultar fluxo de aleatoriedade
     nenhum. Guardar as pessoas no estado seria guardar valor derivado — e o save so precisa
     da semente e das ordens para refazer o elenco inteiro, identico. */
  const people = cast({
    seed: state.seed,
    parties,
    archetypes: catalog.archetypes,
    firstNames: catalog.firstNames,
    surnames: catalog.surnames,
    ambitions: catalog.ambitions,
    genderOf: catalog.genderOf,
  });

  const { benches, credit } = benchesOf({
    people,
    parties,
    memory: state.memory,
    parameters: catalog.cast,
  });

  /* Sem esta linha o lider nasceria com lealdade zero — bancada em ruptura no mes 1, que e um
     estado de jogo valido e portanto indistinguivel de um defeito. */
  /** @type {Record<string, number>} */
  const chamberLoyalty = { ...state.loyalty };
  for (const person of people) chamberLoyalty[person.id] = state.loyalty[person.bloc] ?? 0;

  const table = (/** @type {Record<string, number>} */ source) =>
    offered({ people, parties, funding: source, credit, parameters: catalog.cast });

  return {
    agenda,
    held,
    bands,
    people,
    benches,
    chamberLoyalty,
    offeredPromised: table(promised),
    offeredPaid: table(paid),
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
    funded,
    paidCost: promisedCost * ratio,
    allocatedTotal: askedTotal * ratio,
  };
}

/**
 * QUEM EXIGE NESTE MES, E O QUE — a chantagem, e ela e DETERMINISTICA.
 *
 * @param {GameState} state
 * @param {Record<string, number>} pressure - a pressao DEPOIS do mes
 * @param {typeof CATALOG} catalog
 * @returns {import("../state/state.mjs").Letter[]}
 */
function demandsOf(state, pressure, catalog) {
  /** @type {import("../state/state.mjs").Letter[]} */
  const written = [];

  for (const lobby of catalog.lobbies) {
    if ((pressure[lobby.id] ?? 0) < catalog.pressure.demandAt) continue;

    /* ⚠ UMA EXIGENCIA ABERTA POR VEZ, POR GRUPO — e o filtro tem de dizer EXIGENCIA.
       Sem a especie, o alarme de fervura satisfazia a condicao sozinho: ele nasce com o mesmo
       remetente e com `answer: null`, porque quem fecha um aviso e `closedAt`. Como `boil` (68)
       e maior que `demandAt` (30), quem ferve esta sempre acima do limiar de exigir — entao o
       grupo que acabava de romper com o governo perdia a voz por ate 24 meses. Medido em 48
       meses: 26 a 30 meses-lobby calados. */
    const open = (/** @type {import("../state/state.mjs").Letter} */ letter) =>
      letter.kind === "demand" && letter.from === lobby.id && letter.answer === null;
    if (state.mail.some(open)) continue;

    const worst = leverOf(state, lobby, catalog);

    /* NADA A EXIGIR, NADA ESCRITO — e o silencio aqui e a informacao. */
    if (!worst) continue;

    written.push(demand({ lobby, program: worst, level: worst.initial, month: state.month }));
  }

  return written;
}

/**
 * QUAL ALAVANCA UM GRUPO COBRA — e cada canal cobra a dele.
 *
 * @param {GameState} state
 * @param {import("../data/lobbies.mjs").Lobby} lobby
 * @param {typeof CATALOG} catalog
 * @returns {import("../data/programs.mjs").Program | null}
 */
function leverOf(state, lobby, catalog) {
  /* O MERCADO OLHA O ORCAMENTO INTEIRO, e nao uma area: o que o incomoda e a despesa, venha
     ela de onde vier. */
  const areas = new Set((lobby.areas ?? "").split(" ").filter(Boolean));
  const wantsCut = lobby.reads === "debt";

  let chosen = null;
  let deepest = 0;

  for (const program of catalog.programs) {
    if (!wantsCut && !areas.has(program.area)) continue;

    const now = state.levels[program.id] ?? program.initial;
    /* `cost` e o gasto anual cheio do programa, entao a diferenca de nivel vezes o custo e
       quanto o pais passou a gastar — ou deixou de gastar — ali. */
    const moved = ((wantsCut ? now - program.initial : program.initial - now) / 100) * program.cost;

    if (moved > deepest) {
      deepest = moved;
      chosen = program;
    }
  }

  return chosen;
}

/**
 * ⚠ ELA NASCEU DE UM DEFEITO MEDIDO, e ele e a SETIMA ocorrencia da familia mais cara deste
 * projeto.
 *
 * · a MALHA consome `funded` — o gasto CHEIO da area, piso incluido e ja rateado —,
 * e `asked` e so a parte ACIMA DO PISO. Na Previdencia os dois
 * numeros sao R$ 2,4 bi e R$ 126,7 bi: a tela projetava com 2% do dinheiro;
 * todas as sete nasceram: `funded` substituiu `asked` na alimentacao da MALHA, e a
 * projecao do entrypoint ficou no numero antigo, em silencio.
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 * @returns {{ index: Record<string, number>, idle: Record<string, number> }}
 * o indice de cada area no fim deste mes: com as ordens, e sem elas
 */
export function outlook(state, orders = {}, catalog = CATALOG) {
  /** @param {Orders} given */
  const project = given =>
    capacityStep({
      areas: catalog.areas,
      index: state.capacity.index,
      history: state.capacity.history,
      /* Perguntar aqui e a unica forma de a linha nao divergir no mes em que o caixa apertar
         — que e justamente o mes em que o jogador precisa dela. */
      allocation: settlement(state, given, catalog).funded,
      impacts: {},
      neutral: NEUTRAL,
      capacityTarget: CAPACITY_TARGET,
    }).index;

  return { index: project(orders), idle: project({}) };
}

/**
 * E a terceira vez que este projeto encontra a mesma familia de defeito, e desta vez ele foi
 * visto antes de existir.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function passageOf(state, catalog = CATALOG) {
  const bands = bandsOf(state, catalog);
  const power = state.levels["poder-do-executivo"] ?? 0;

  return state.bills.map(bill => {
    const agenda = proposalOf(bill, { levels: state.levels, bands, power, catalog });
    return {
      id: bill.id,
      label: bill.label,
      stage: bill.stage,
      /* HA QUANTOS MESES ELE ESPERA, e nao em que mes ele entrou: o jogador conta espera, e
         nao data. */
      waiting: state.month - bill.since,
      /* ⚠ QUANTO FALTA PARA ELE MORRER NA GAVETA, e so na gaveta: um texto que ja passou pela
         Mesa nao volta para la. */
      expires: bill.stage === "drawer" ? DRAWER_LIFE - (state.month - bill.writtenAt) : null,
      instrument: agenda.proposal?.instrument ?? "",
      quorum: agenda.quorum,
      saved: bill.saved ?? null,
    };
  });
}

/**
 * O PLENARIO CADEIRA A CADEIRA — a camara dividida, com o que cada bancada entrega.
 *
 * que e calibragem de ECLUSA. Refeita na tela, ela erraria no dia seguinte a
 * primeira recalibragem dos pedagios, e o sintoma seria um plenario DESENHADO que
 * discorda do numero impresso ao lado dele.
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function chamberOf(state, catalog = CATALOG) {
  const share = settlement(state, {}, catalog);
  return seating({ parties: share.benches, loyalty: share.chamberLoyalty });
}

/**
 * O SEU GOVERNO — quem voce e, quem fala com voce, e no que voce se tornou.
 *
 * O ELENCO E REFEITO AQUI, e isso e barato de proposito — cada pessoa sai de um
 * hash da semente, sem consultar fluxo de aleatoriedade nenhum, exatamente como
 * `settlement` ja o refaz todo mes. Guardar as pessoas seria guardar derivado.
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function governmentOf(state, catalog = CATALOG) {
  const people = cast({
    seed: state.seed,
    parties: catalog.parties,
    archetypes: catalog.archetypes,
    firstNames: catalog.firstNames,
    surnames: catalog.surnames,
    ambitions: catalog.ambitions,
    genderOf: catalog.genderOf,
  });

  return {
    /* O ELENCO INTEIRO SAI JUNTO: as cartas da tramitacao precisam achar quem assina cada uma
       pelo CARGO, e refazer o elenco na tela seria a segunda geracao da mesma gente no mesmo
       turno. */
    people,
    /* ⚠ O NOME DIGITADO VENCE O SORTEADO, e o sorteado continua existindo para a partida
       que abre antes de alguem escolher. O resto do elenco nao tem essa porta: so o
       presidente entra no save, porque so o nome dele nao se refaz da semente. */
    president: state.president
      ? {
          ...president({
            seed: state.seed,
            people,
            firstNames: catalog.firstNames,
            surnames: catalog.surnames,
          }),
          name: state.president.name,
        }
      : president({
          seed: state.seed,
          people,
          firstNames: catalog.firstNames,
          surnames: catalog.surnames,
        }),
    /* COMO ELE QUER SER TRATADO. Ver `TREATMENTS` em `state.mjs`. */
    treatment: state.president?.treatment ?? "senhor",
    /* ⚠ O CONSELHEIRO E ACHADO PELO CARGO, e nao pelo id do arquetipo. */
    adviser: people.find(person => person.office === "chief") ?? null,
    stance: stanceOf(state, catalog),
  };
}

/**
 * O que muda e o par que se compara: `compose` mede o RASCUNHO contra o vigente e devolve a
 * posicao do texto do mes; aqui o vigente e medido contra o ORCAMENTO HERDADO, e a posicao
 * devolvida e a do mandato acumulado.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {{ economic: number, liberty: number, near: string, article: string } | null}
 */
function stanceOf(state, catalog = CATALOG) {
  const levers = [...catalog.programs, ...catalog.rules];

  /* Ele sai do catalogo pela mesma razao que `createState` o tira de la: dois lugares com o
     mesmo numero e um lugar que vai divergir na primeira recalibragem. */
  const inherited = Object.fromEntries(levers.map(lever => [lever.id, lever.initial]));

  const walked = compose({
    programs: catalog.programs,
    rules: catalog.rules,
    levels: inherited,
    requested: state.levels,
    power: state.levels["poder-do-executivo"] ?? 0,
    /* A FAIXA NAO IMPORTA AQUI, e passar a vigente seria pior que nao passar: o que se mede e
       para onde o gasto andou, e nao que rito isso exigiria. */
    bands: {},
    requestedBands: {},
  });

  if (!walked.proposal) return null;

  /* de quem ele mais se APROXIMA, com a mesma distancia euclidiana que ECLUSA usa
     para decidir quem vota a favor. */
  let near = "";
  let article = "";
  let best = Infinity;
  for (const party of catalog.parties) {
    const dx = party.economic - walked.proposal.economic;
    const dy = party.liberty - walked.proposal.liberty;
    const distance = dx * dx + dy * dy;
    if (distance < best) {
      best = distance;
      near = party.label;
      /* ⚠ O ARTIGO VEM JUNTO, e vem do CATALOGO. */
      article = party.article ?? "";
    }
  }

  return {
    economic: walked.proposal.economic,
    liberty: walked.proposal.liberty,
    near,
    article,
  };
}

/**
 * ⚠ O DEFEITO QUE ELA CONSERTA ERA O MAIS CARO DA TELA. A Mesa montava a previsao a mao,
 * no entrypoint, com os blocos crus do catalogo e a lealdade crua — enquanto o turno votava
 * com as bancadas do ELENCO, que sao outras e em outro numero, a verba ja com credito de
 * memoria e desconto de ambicao, e a rua deslocando a resistencia. Nem o ELENCO nem a SONDA
 * quebraram nada ao chegar: a tela so ficou para tras, em silencio.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 */
export function forecast(state, orders = {}, catalog = CATALOG) {
  const share = settlement(state, orders, catalog);
  const agenda = share.agenda;

  /* A MESMA RUA QUE O TURNO USA: a do mes passado, ja divulgada. */
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  /* TODO BLOCO ENTRA NO MAPA, inclusive com zero: a tela desenha uma linha por bloco sempre,
     e uma chave ausente a faria imprimir vazio onde o certo e zero. */
  /** @type {Record<string, number>} */
  const byBloc = {};
  for (const party of catalog.parties) byBloc[party.id] = 0;

  /* A tela ja sabe nao desenhar um travessao de 4,5rem no lugar de um numero. */
  if (!agenda.proposal || agenda.quorum === 0) {
    return {
      agenda,
      share,
      standing,
      whip: null,
      band: 0,
      byBloc,
      blocs: blocsOf(state, share, { votes: 0, parties: [] }, byBloc, catalog),
    };
  }

  const whip = whipCount({
    bill: agenda.proposal,
    parties: share.benches,
    funding: share.offeredPaid,
    loyalty: share.chamberLoyalty,
    standing,
  });

  /* ── O QUE CADA BLOCO ENTREGA, somando as bancadas dele ──────────────────── A tela oferece
     um controle de verba por BLOCO — e o jogador paga bloco, nao pessoa. */
  const blocOf = new Map(share.people.map(person => [person.id, person.bloc]));
  for (const bench of whip.parties) {
    const bloc = blocOf.get(bench.partyId) ?? bench.partyId;
    if (bloc in byBloc) byBloc[bloc] = (byBloc[bloc] ?? 0) + bench.votes;
  }

  return {
    agenda,
    share,
    standing,
    whip,
    band: dispersion({ parties: share.benches, loyalty: share.chamberLoyalty }),
    byBloc,
    blocs: blocsOf(state, share, whip, byBloc, catalog),
  };
}

/**
 * O CONGRESSO COMO A TELA PRECISA VÊ-LO — blocos, e a gente dentro deles.
 *
 * @param {GameState} state
 * @param {ReturnType<typeof settlement>} share
 * @param {import("../domain/congress/index.mjs").Forecast} whip
 * @param {Record<string, number>} byBloc
 * @param {typeof CATALOG} catalog
 */
function blocsOf(state, share, whip, byBloc, catalog) {
  const seatsOf = new Map(share.benches.map(bench => [bench.id, bench.seats]));
  const votesOf = new Map(whip.parties.map(bench => [bench.partyId, bench.votes]));

  return catalog.parties.map(party => ({
    id: party.id,
    label: party.label,
    seats: party.seats,
    votes: byBloc[party.id] ?? 0,
    people: share.people
      .filter(person => person.bloc === party.id && (seatsOf.get(person.id) ?? 0) > 0)
      .map(person => ({
        id: person.id,
        name: person.name,
        office: person.office,
        role: person.label,
        ambition: person.ambition,
        seats: seatsOf.get(person.id) ?? 0,
        /* Os alcances de um bloco sao NORMALIZADOS quando somam mais que `CROWD` — foi o
           conserto do defeito que fechava a Camara com 730 cadeiras —, entao o cru diz o que
           a pessoa queria arrastar e o efetivo diz o que ela arrasta. */
        reach: party.seats > 0 ? (seatsOf.get(person.id) ?? 0) / party.seats : 0,
        votes: votesOf.get(person.id) ?? 0,
        /* ⚠ A MEMORIA VAI NORMALIZADA, de -1 a 1, e nao em pontos. */
        memory: clamp((state.memory[person.id] ?? 0) / (catalog.cast.memoryCap || 1), -1, 1),
      })),
  }));
}

/**
 * Ele e o mesmo que o turno vai cobrar neste mes — refeito na view, ele divergiria no dia em
 * que a forma da curva mudasse, e o jogador leria um spread que o Tesouro nao paga.
 *
 * numeros que sairiam de dois motores — LASTRO e CORRENTE —, e o entrypoint nao
 * alcanca motor: a fachada so abre a camada de aplicacao, e a guarda de
 * fronteiras cobra isso. Sem esta funcao, a saida seria expor `budgetStep` e
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 * @returns {{ budget: BudgetOutput, interest: number, debt: number, debtRatio: number,
 * premium: number }}
 */
export function ledger(state, orders = {}, catalog = CATALOG) {
  const share = settlement(state, orders, catalog);
  const proceeds = saleOf(catalog.rules, state.levels, share.levels);

  const budget = budgetStep({
    ...positionOf(state, catalog),
    spent: share.paidCost + share.allocatedTotal - proceeds,
  });

  const premium = premiumNow(state, catalog);
  const interest = carry({
    debt: state.fiscal.debt,
    rate: state.macro.rate,
    premium,
    parameters: catalog.macro,
  });

  const debt = budget.debt + interest;

  return {
    budget,
    interest,
    debt,
    debtRatio: state.macro.gdp > 0 ? debt / state.macro.gdp : 0,
    premium,
  };
}

/**
 * O TEXTO QUE O MES DE HOJE PROTOCOLA — e ele guarda o PEDIDO, e nao o efeito.
 *
 * @param {import("./agenda.mjs").Agenda} agenda
 * @param {number} month
 * @param {Record<string, import("../state/state.mjs").Band>} bands as leis vigentes
 * @param {Record<string, import("../state/state.mjs").Band>} asked as pedidas
 * @param {Record<string, number>} requested os niveis pedidos
 * @returns {import("./passage.mjs").Bill | null}
 */
function draft(agenda, month, bands, asked, requested) {
  if (!agenda.proposal || agenda.quorum === 0) return null;

  /** @type {Record<string, import("../state/state.mjs").Band>} */
  const bills = {};
  for (const [id, band] of Object.entries(asked)) {
    const now = bands[id];
    if (!now || band.floor !== now.floor || band.ceiling !== now.ceiling) bills[id] = band;
  }

  /** @type {Record<string, number>} */
  const levels = {};
  for (const move of agenda.moves) {
    if (move.kind === "floor" || move.kind === "ceiling") continue;
    if (move.rite === "budget") continue;
    const level = requested[move.program.id];
    if (level !== undefined) levels[move.program.id] = level;
  }

  return {
    id: `texto-m${month}`,
    writtenAt: month,
    stage: "drawer",
    since: month,
    label: agenda.proposal.label,
    bands: bills,
    levels,
    except: [],
  };
}

/* OS EVENTOS DO MES QUE VIRAM AVISO. */
const NOTICED = new Set(["tabled", "forgotten", "passed", "rejected"]);

/**
 * Num governo passivo chegam ZERO cartas em 44 meses, e o processo de impeachment abre no mes
 * 43 no meio desse silencio: o pais desmoronava e a unica noticia era uma barra num cartao da
 * coluna da direita.
 *
 * @param {GameState} state o mes ANTES do passo
 * @param {ReturnType<typeof rupture>} now as rupturas depois dele
 * @param {number | null} impeachment o mes em que o processo abriu, ja decidido
 * @param {typeof CATALOG} catalog
 * @param {object} after o que o mes acabou de produzir
 * @param {Record<string, number>} after.pressure
 * @param {Record<string, number>} after.loyalty
 * @param {boolean} after.contingency se o teto do arcabouco esta fechado NESTE mes
 * @param {boolean} after.contingencyNext se ele estara fechado no mes que vem
 * @returns {import("../state/state.mjs").Letter[]}
 */
function alarmsOf(state, now, impeachment, catalog, after) {
  const before = rupture({
    pressure: state.pressure,
    lobbies: catalog.lobbies,
    standing: pollFrom(state.mood, catalog.segments, catalog.opinion).good,
    broker: BROKER,
    parameters: catalog.pressure,
  });

  /** @type {import("../state/state.mjs").Letter[]} */
  const written = [];

  for (const id of /** @type {const} */ (["social", "economic", "political"])) {
    if (before[id] || !now[id]) continue;
    written.push(alarm({ kind: "rupture", id, subject: id, month: state.month }));
  }

  /* ⚠ O CERCO LE `impeachment`, E NAO `now.open`, e a diferenca importa: o processo NAO SE
     FECHA quando uma das tres melhora — ele so termina no plenario. */
  if (state.impeachment === null && impeachment !== null) {
    written.push(alarm({ kind: "siege", id: "siege", subject: "siege", month: state.month }));
  }

  /* ⚠ A TRAVESSIA E DAQUI PARA O MES QUE VEM, e nao daqui para aqui. A versao anterior media
     o antes com `positionOf(state)` e o depois com `budget` — que sai da MESMA posicao —, e
     contingenciamento e `teto − obrigatoria`, que nao depende do que foi empenhado. A condicao
     era `!X && X`, falsa por construcao: o teto fechou em 12 dos 48 meses da politica `piso` e
     a carta nunca saiu uma vez.
     ⚠ E O AVISO CHEGA ANTES DE PROPOSITO. O mes que esta fechando ja sabe a posicao com que o
     seguinte abre, e informacao que chega depois da decisao e recibo. */
  if (!after.contingency && after.contingencyNext) {
    written.push(alarm({ kind: "ceiling", id: "ceiling", subject: "ceiling", month: state.month }));
  }

  /* ── A BASE CRUZOU A MAIORIA, PARA BAIXO ──────────────────────────────────── ⚠ E ELA E
     TRAVESSIA E NAO ESTADO: um governo que abre em minoria nao recebe carta nenhuma, porque
     nada mudou — ele nasceu assim, e a Trindade ja diz. */
  const seatsBefore = baseCount({ parties: catalog.parties, loyalty: state.loyalty });
  const seatsNow = baseCount({ parties: catalog.parties, loyalty: after.loyalty });
  if (seatsBefore >= SIMPLE_MAJORITY && seatsNow < SIMPLE_MAJORITY) {
    written.push(
      alarm({
        kind: "minority",
        id: "minority",
        subject: "minority",
        month: state.month,
        was: SIMPLE_MAJORITY,
        now: seatsNow,
      }),
    );
  }

  /* ── UM GRUPO PASSOU DO PONTO DE FERVURA ──────────────────────────────────── ⚠ ELE E POR
     GRUPO, e nao um aviso agregado: qual deles ferveu e a informacao inteira — o mercado
     fervendo e o baixo clero fervendo pedem coisas opostas. */
  for (const lobby of catalog.lobbies) {
    const wasBoiling = (state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil;
    const isBoiling = (after.pressure[lobby.id] ?? 0) >= catalog.pressure.boil;
    if (wasBoiling || !isBoiling) continue;
    written.push(
      alarm({
        kind: "boiling",
        id: lobby.id,
        subject: lobby.id,
        month: state.month,
        /* ⚠ SEM `from`: quem assina este aviso e a Casa Civil, e a view sempre o sobrescreveu
           com ela — o id do grupo gravado aqui nunca teve leitor, e ja viaja em `subject`. */
        was: catalog.pressure.boil,
        now: after.pressure[lobby.id] ?? 0,
      }),
    );
  }

  /* ⚠ A CAIXA MANDA NO ID. */
  const held = new Set(state.mail.map(letter => letter.id));
  return written.filter(letter => !held.has(letter.id));
}

/* ⚠ E O PRIMEIRO NUMERO ESTAVA NA MEDIANA, E ISSO ERA O DEFEITO. */
const MOVED = { street: 3, seats: 8, vault: 2 };

/**
 * @typedef {object} Balance as tres leituras do mes, com o valor de ANTES e o de DEPOIS
 * @property {number} streetWas
 * @property {number} streetNow
 * @property {number} seatsWas
 * @property {number} seatsNow
 * @property {number} roomWas
 * @property {number} roomNow
 */

/**
 * O ANTES DAS TRES LEITURAS, medido UMA VEZ no mes que ainda nao andou.
 *
 * @param {GameState} state o mes ANTES do passo
 * @param {{ approval: number, seats: number, room: number }} after
 * @param {typeof CATALOG} catalog
 * @returns {Balance}
 */
function balanceOf(state, after, catalog) {
  return {
    streetWas: pollFrom(state.mood, catalog.segments, catalog.opinion).good,
    streetNow: after.approval,
    seatsWas: baseCount({ parties: catalog.parties, loyalty: state.loyalty }),
    seatsNow: after.seats,
    roomWas: discretionaryRoom(state, catalog),
    roomNow: after.room,
  };
}

/**
 * O QUE O MUNDO ESCREVE POR TEMPO, e nao por evento.
 *
 * @param {GameState} state o mes ANTES do passo
 * @param {object} after o que o mes acabou de produzir
 * @param {number} after.approval
 * @param {number} after.seats
 * @param {number} after.room
 * @param {Record<string, Record<string, number>>} [after.attach] os ANEXOS, um por
 * dominio e com a chave sendo a propria especie da carta.
 * @param {Balance} balance o antes e o depois das tres leituras, ja medido uma vez.
 * @returns {import("../state/state.mjs").Letter[]}
 */
function reportsOf(state, after, balance) {
  const before = { street: balance.streetWas, seats: balance.seatsWas, room: balance.roomWas };

  /** @type {import("../state/state.mjs").Letter[]} */
  const written = [];

  /** @param {"street" | "seats" | "vault"} kind @param {number} was @param {number} now */
  const write = (kind, was, now) => {
    const moved = Math.abs(now - was);
    if (moved < MOVED[kind]) return;
    written.push(
      report({
        kind,
        month: state.month,
        was,
        now,
        /* ⚠ AS TRES TEM ANEXO, e a chave e o proprio `kind` — nao ha `if` por especie aqui, e
           isso e de proposito: no dia em que um quarto dominio escrever, ele so precisa por a
           propria chave em `after`. */
        attach: after.attach?.[kind],
      }),
    );
  };

  write("street", before.street, after.approval);
  write("seats", before.seats, after.seats);
  write("vault", before.room, after.room);

  return written;
}

/**
 * @param {ReadonlyArray<{ kind: string, label: string, detail: string | null, bill: string }>} events
 * @param {number} month
 * @returns {import("../state/state.mjs").Letter[]}
 */
function notices(events, month) {
  return events
    .filter(event => NOTICED.has(event.kind))
    .map(event =>
      notice({
        kind: /** @type {"tabled" | "forgotten" | "passed" | "rejected"} */ (event.kind),
        id: event.bill,
        subject: event.label,
        month,
      }),
    );
}

/**
 * OS TEXTOS UM ESTAGIO ADIANTE — e no maximo UM estagio por mes.
 *
 * distancia que ECLUSA usa, e o plenario vota com `vote`. Ver `passage.mjs`.
 * @param {GameState} state
 * @param {object} world
 * @param {{ benches: Party[], offeredPaid: Record<string, number>,
 * chamberLoyalty: Record<string, number>,
 * people: ReadonlyArray<import("../domain/cast/index.mjs").Person>,
 * bands: Record<string, import("../state/state.mjs").Band> }} world.share
 * @param {number} world.standing
 * @param {typeof CATALOG} world.catalog
 * @param {ReadonlyArray<import("../state/state.mjs").Letter>} world.resolved as
 * perguntas que FECHARAM neste mes, respondidas ou vencidas
 * @param {ReadonlyArray<import("../state/state.mjs").Letter>} world.mail a caixa JA
 * fechada — ver a nota sobre `pending`, abaixo
 */
function advanceBills(state, { share, standing, catalog, resolved, mail }) {
  const speaker = share.people.find(person => person.office === "speaker") ?? null;
  const rapporteur = share.people.find(person => person.office === "rapporteur") ?? null;
  const power = state.levels["poder-do-executivo"] ?? 0;

  /* Duplica-la aqui daria dois lugares dizendo o mesmo, e um deles ia divergir. */
  const answers = new Map(
    resolved
      .filter(letter => letter.bill !== null && letter.kind === "reported")
      .map(letter => [
        /** @type {string} */ (letter.bill),
        { answer: letter.answer, except: letter.except, saved: letter.saved },
      ]),
  );

  /** @type {import("./passage.mjs").Bill[]} */
  const bills = [];
  /** @type {import("./passage.mjs").Bill[]} */
  const dropped = [];
  /* AS PERGUNTAS QUE ESTE MES ABRE. */
  /** @type {import("../state/state.mjs").Letter[]} */
  const asked = [];
  /* ⚠ O QUE ACONTECEU COM CADA TEXTO, e nao so onde ele esta. */
  /** @type {{ kind: string, label: string, detail: string | null, bill: string }[]} */
  const events = [];
  /** @type {Tally | null} */
  let tally = null;
  /** @type {import("./passage.mjs").Bill | null} */
  let passed = null;
  let stream = state.streams.congress;
  let voted = false;

  for (const bill of state.bills) {
    const agenda = proposalOf(bill, { levels: state.levels, bands: share.bands, power, catalog });

    /* ⚠ TEXTO QUE DEIXOU DE PEDIR ALGUMA COISA MORRE, e nao vai a voto. */
    if (!agenda.proposal || agenda.quorum === 0) {
      dropped.push(bill);
      continue;
    }

    if (bill.stage === "drawer") {
      if (forgotten(bill, state.month)) {
        dropped.push(bill);
        events.push({ kind: "forgotten", label: bill.label, detail: null, bill: bill.id });
        continue;
      }
      const { tabled } = tables({
        proposal: agenda.proposal,
        speaker,
        benches: share.benches,
        funding: share.offeredPaid,
        loyalty: share.chamberLoyalty,
        standing,
      });
      /* ⚠ QUEM NAO E PAUTADO NAO PERDE — ELE ESPERA. */
      if (tabled) events.push({ kind: "tabled", label: bill.label, detail: null, bill: bill.id });
      bills.push(tabled ? { ...bill, stage: "rapporteur", since: state.month } : bill);
      continue;
    }

    if (bill.stage === "rapporteur") {
      /* ⚠ A CAIXA JA FECHADA, E NAO `state.mail` — e esta linha e a correcao de um defeito
         que so a simulacao pegou, porque ele nao derruba nada: ele TRAVA.
         de dar. E a mesma familia do achado 14, em que a MALHA lia o nivel PEDIDO
         depois de a tramitacao ter separado pedido de aplicado. */
      const open = pending(mail, bill.id);
      if (open) {
        bills.push(bill);
        continue;
      }

      const answer = answers.get(bill.id) ?? null;

      /* ⚠ TRAVAR DEVOLVE O TEXTO A GAVETA COM O RELOGIO CORRENDO. */
      if (answer?.answer === "block") {
        events.push({ kind: "blocked", label: bill.label, detail: null, bill: bill.id });
        bills.push({ ...bill, stage: "drawer", since: state.month });
        continue;
      }

      /* ACEITO, OU ACEITO POR SILENCIO — e para o texto os dois sao a mesma coisa. */
      if (answer) {
        bills.push({
          ...bill,
          stage: "floor",
          since: state.month,
          except: [...bill.except, ...answer.except],
          ...(answer.saved !== null && { saved: answer.saved }),
        });
        continue;
      }

      const { except, saved } = reports({ rapporteur, agenda, catalog });

      /* ⚠ SEM EMENDA NAO HA PERGUNTA. */
      if (saved === undefined) {
        events.push({ kind: "reported", label: bill.label, detail: null, bill: bill.id });
        bills.push({ ...bill, stage: "floor", since: state.month });
        continue;
      }

      events.push({ kind: "reported", label: bill.label, detail: saved, bill: bill.id });
      asked.push(amendment({ bill, month: state.month, except, saved }));
      bills.push(bill);
      continue;
    }

    /* PLENARIO — e so um por mes. */
    if (voted) {
      bills.push(bill);
      continue;
    }
    voted = true;

    const result = vote({
      bill: agenda.proposal,
      /* ⚠ QUEM VOTA E A CAMARA DIVIDIDA, e nao os blocos crus do catalogo. */
      parties: share.benches,
      funding: share.offeredPaid,
      loyalty: share.chamberLoyalty,
      stream,
      majority: agenda.quorum,
      standing,
    });

    stream = result.stream;
    tally = result;

    events.push({
      kind: result.passed ? "passed" : "rejected",
      label: bill.label,
      detail: null,
      bill: bill.id,
    });

    if (result.passed) {
      /* O QUE PASSA E O TEXTO JA SEM O QUE O RELATOR SALVOU. */
      const spared = new Set(bill.except);
      passed = {
        ...bill,
        bands: Object.fromEntries(Object.entries(bill.bands).filter(([id]) => !spared.has(id))),
        levels: Object.fromEntries(Object.entries(bill.levels).filter(([id]) => !spared.has(id))),
      };
    } else {
      dropped.push(bill);
    }
  }

  return { bills, dropped, tally, passed, stream, voted, events, asked };
}

/**
 * Resolve um mes.
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
    agenda,
    held,
    bands,
    promised,
    asked,
    room,
    paid,
    requested,
    allocated,
    funded,
    people,
    benches,
    chamberLoyalty,
    offeredPaid,
    promisedCost,
    paidCost,
    allocatedTotal,
    ratio,
    requestedBands,
  } = settlement(state, orders, catalog);

  /* Havia dois no projeto com argumentos ligeiramente diferentes; um deles ia divergir e
     ninguem saberia qual. */

  /* ⚠ A RUA QUE PESA NA VOTACAO E A DO MES PASSADO, e nao a que SONDA vai apurar no fim deste
     turno. */
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  /* ── A TRAMITACAO ───────────────────────────────────────────────────────── ⚠ A ORDEM E A
     REGRA: os textos que JA estavam andando avancam PRIMEIRO, e so depois o que o jogador
     escreveu neste mes e protocolado. */
  /* ⚠ A CORRESPONDENCIA FECHA ANTES DE OS TEXTOS ANDAREM, e a ordem e a mecanica: a resposta
     que o jogador deu neste mes tem de valer NESTE mes. */
  const post = settleMail({ mail: state.mail, orders: orders.mail ?? {}, month: state.month });

  /* ── O QUE A CHANTAGEM PRODUZIU NESTE MES ─────────────────────────────────── Duas listas,
     e as duas saem das cartas que FECHARAM agora: CEDIDO  a alavanca vai para o nivel
     exigido, e ela entra no orcamento do mes como qualquer outro movimento de caneta — sai da
     mesma bolsa; RECUSADO quem foi recusado, para a queixa dele subir. */
  /** @type {Record<string, number>} */
  const conceded = {};
  /** @type {string[]} */
  const spurned = [];

  for (const letter of post.resolved) {
    if (letter.kind !== "demand" || letter.lever === null) continue;
    if (letter.answer === "accept") conceded[letter.lever] = letter.level ?? 0;
    else if (letter.from !== null) spurned.push(letter.from);
  }

  const passage = advanceBills(state, {
    share: { benches, offeredPaid, chamberLoyalty, people, bands },
    standing,
    catalog,
    resolved: post.resolved,
    mail: post.mail,
  });

  const tally = passage.tally;

  /* 5 — O QUE SOBROU NA BASE, e o que cada PESSOA passou a lembrar. */
  const loyalty = settle({ parties, loyalty: state.loyalty, promised, paid });
  const memory = remember({
    people,
    memory: state.memory,
    promised,
    paid,
    parameters: catalog.cast,
  });

  /* 6 — A CAPACIDADE DO ESTADO. */
  const approved = passage.passed;
  const enacted = approved !== null;

  /* ── O QUE ACONTECE COM O QUE PRECISA DE VOTO ─────────────────────────────── Nao e tudo ou
     nada, e a distincao e a mesma que separou os ritos. */
  /* ⚠ O QUE FOI CEDIDO ENTRA POR CIMA, e depois do texto aprovado: se as duas coisas tocarem
     a mesma alavanca no mesmo mes, quem manda e a exigencia — porque ela e a que o jogador
     acabou de responder, e o texto foi assinado ha tres meses. */
  const applied = honour({
    programs,
    levels: { ...(approved ? { ...held, ...approved.levels } : held), ...conceded },
    ratio,
    bands,
  });

  /* ── A LEI SO MUDA SE O PLENARIO DEIXAR, e nao ha meio-termo aqui ──────────── Movimento de
     faixa NUNCA e execucao orcamentaria: mexer no que a lei obriga custa lei, no minimo. */
  const written = approved
    ? normsFrom(bands, { ...bands, ...approved.bands }, state.month, catalog)
    : [];
  const appliedNorms = written.length > 0 ? [...state.norms, ...written] : state.norms;

  /* A LEI DEPOIS DA VOTACAO, lida da pilha nova e no MESMO mes. */
  const appliedBands =
    written.length > 0
      ? resolve({
          norms: appliedNorms,
          levers: leversOf(catalog),
          month: state.month,
          indicators: indicatorsOf(state),
          revenue: revenueNow(state, catalog),
        }).bands
      : bands;
  /* O IMPACTO DIRETO NO INDICE SUMIU, e a omissao e proposital. */
  const capacity = capacityStep({
    areas,
    index: state.capacity.index,
    history: state.capacity.history,
    allocation: funded,
    impacts: {},
    neutral: NEUTRAL,
    capacityTarget: CAPACITY_TARGET,
  });

  /* 7 — O ORCAMENTO FECHA com tudo o que de fato saiu do discricionario. */
  /* A VENDA ABATE O EMPENHO DO MES.
     e o saldo do mes e o mesmo nos dois casos. Passa por aqui porque o LASTRO
     raciocina em empenho liquido, e criar uma terceira porta para o mesmo real
     seria duas contas para uma coisa. */
  const proceeds = saleOf(catalog.rules, state.levels, applied);
  const budget = budgetStep({ ...position, spent: paidCost + allocatedTotal - proceeds });

  /* 8 — A ECONOMIA, e ela vem DEPOIS do orcamento porque le o que ele empenhou. */
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

  /* 9 — O QUE A DIVIDA CUSTA.
     nao a que a CORRENTE acabou de decidir: juro se paga sobre o estoque ao preco
     do dia, e usar a taxa nova aqui faria a decisao do Banco Central retroagir um
     mes inteiro. */
  const interest = carry({
    debt: state.fiscal.debt,
    rate: state.macro.rate,
    premium: premiumNow(state, catalog),
    parameters: catalog.macro,
  });

  /* 10 — A RUA, e ela e o ultimo passo de proposito: SONDA le tudo o que os outros motores
     acabaram de produzir, e nao manda em nenhum deles neste mes. */
  const released = {
    inflation: releasedFrom(state.series.inflation, catalog.opinion.release, state.macro.inflation),
    unemployment: releasedFrom(
      state.series.unemployment,
      catalog.opinion.release,
      state.macro.unemployment,
    ),
    growth: economy.growth,
  };

  /* SERVICO E ORDEM SAO LEITURAS DA MALHA, e a composicao mora aqui porque motor nenhum chama
     outro motor. */
  /* O TEXTO QUE ESTE MES ESCREVEU — protocolado, e nao votado. */
  const protocolled = draft(agenda, state.month, bands, requestedBands, requested);

  const opinion = opinionStep({
    mood: state.mood,
    released,
    services: mean([capacity.index["health"], capacity.index["education"]]),
    safety: capacity.index["security"] ?? 50,
    /* A FRACAO DA PROMESSA QUE O CAIXA NAO HONROU. */
    betrayal: promisedCost > 0 ? 1 - paidCost / promisedCost : 0,
    tenure: state.month,
    segments: catalog.segments,
    parameters: catalog.opinion,
  });

  /* 10b — A CALDEIRA, e ela vem DEPOIS de tudo porque le tudo. */
  const pressure = heat({
    pressure: state.pressure,
    grievance: grievanceOf({
      debtRatio: budget.debtRatio,
      /* A MEDIA DA VERBA QUE CHEGOU A CADA BANCADA. */
      delivered:
        parties.length > 0
          ? parties.reduce((sum, party) => sum + (offeredPaid[party.id] ?? 0), 0) / parties.length
          : 0,
      index: capacity.index,
      spurned,
      catalog,
    }),
    parameters: catalog.pressure,
  });

  /* Uma derrota que voce viu chegar e nao conseguiu evitar e uma historia; uma que chega sem
     aviso e um defeito percebido. */
  const rupturas = rupture({
    pressure,
    lobbies: catalog.lobbies,
    /* A RUA APURADA AGORA, e nao a do mes passado: a ruptura social e uma leitura do estado
       do pais no fim deste mes, e nao um insumo de negociacao. */
    standing: pollFrom(opinion.mood, catalog.segments, catalog.opinion).good,
    broker: BROKER,
    parameters: catalog.pressure,
  });
  const impeachment = state.impeachment ?? (rupturas.open ? state.month : null);

  /* ── O PLENARIO DECIDE, e a queda e a TRAMITACAO COM OUTRO OBJETO ──────────── ⚠ ELA NAO
     GANHA FORMULA PROPRIA, exatamente como a Mesa nao ganhou: e `vote`, com o quorum trocado. */
  const seat = stanceOf(state, catalog);
  const survivors =
    /* ⚠ O PLENARIO VOTA NO MES SEGUINTE AO DA ABERTURA, e nao no mesmo — e esta linha e a
       correcao de um defeito de desenho que a primeira medicao pegou. */
    impeachment !== null && impeachment < state.month && state.fallen === null
      ? vote({
          /* A POSICAO DO GOVERNO, e nao a de um texto: `stanceOf` a devolve com o marco, e o
             que importa aqui sao os dois eixos. */
          bill: { economic: seat?.economic ?? 50, liberty: seat?.liberty ?? 50, threat: 0 },
          parties: benches,
          funding: offeredPaid,
          loyalty: chamberLoyalty,
          stream: passage.stream,
          majority: SEATS - REMOVAL_MAJORITY + 1,
          standing,
        })
      : null;

  const fallen = state.fallen ?? (survivors && !survivors.passed ? state.month : null);

  /* Calculada duas vezes, as duas divergiriam no primeiro remendo. */
  const nextFiscal = nextPosition(state, budget, applied, catalog, interest, bands, appliedBands);

  /* Ate entao so os relatorios avulsos as usavam, e podiam medi-las por dentro; agora o
     balanco da Casa Civil imprime os mesmos seis numeros, e dois lugares medindo a mesma
     coisa e o defeito que este projeto ja pagou seis vezes. */
  const closed = {
    approval: pollFrom(opinion.mood, catalog.segments, catalog.opinion).good,
    seats: baseCount({ parties, loyalty }),
    room: discretionaryRoom({ ...state, fiscal: nextFiscal }, catalog),
  };
  const balance = balanceOf(state, closed, catalog);

  return {
    state: reduce(state, {
      type: "monthResolved",
      loyalty,
      fiscal: nextFiscal,
      macro: economy.macro,
      mood: opinion.mood,
      series: extend(
        state.series,
        {
          gdp: economy.macro.gdp,
          inflation: economy.macro.inflation,
          rate: economy.macro.rate,
          unemployment: economy.macro.unemployment,
          debtRatio: budget.debtRatio,
          primary: budget.balance,
        },
        capacity.index,
      ),
      capacity: { index: capacity.index, history: capacity.history },
      levels: applied,
      norms: appliedNorms,
      /* ⚠ O TEXTO DE HOJE ENTRA NA GAVETA DEPOIS de os antigos andarem, e a ordem e a regra:
         protocolado antes, ele andaria um estagio no proprio mes de assinatura, e tres meses
         da caneta ao efeito viraria dois sem ninguem ter decidido isso. */
      bills: protocolled ? [...passage.bills, protocolled] : passage.bills,
      /* ⚠ A ORDEM DENTRO DA CAIXA E A DA URGENCIA, e nao a cronologica — e ela e decidida
         AQUI, e nao na view, porque quem sabe o que pede decisao e quem produziu o fato. */
      /* ⚠ A CHANTAGEM VEM DEPOIS DA PRESSAO SER CALCULADA, e por isso ela entra aqui e nao
         antes: um lobby exige com base no que ele sente AGORA, e nao no que sentia no mes
         passado. */
      /* ⚠ O ALARME VEM PRIMEIRO, e a ordem e a mesma regra do resto da bandeja: o que exige
         leitura antes da proxima decisao fica no alto. */
      mail: [
        ...alarmsOf(state, rupturas, impeachment, catalog, {
          pressure,
          loyalty,
          contingency: budget.contingency,
          /* A POSICAO COM QUE O MES SEGUINTE ABRE, e ela ja esta calculada: e a mesma fonte
             que `closed.room` usa para dizer quanto vai sobrar. */
          contingencyNext: budgetStep({
            ...positionOf({ ...state, fiscal: nextFiscal }, catalog),
            spent: 0,
          }).contingency,
        }),
        ...passage.asked,
        ...demandsOf(state, pressure, catalog),
        ...notices(passage.events, state.month),
        /* ⚠ O RELATORIO VEM POR ULTIMO NA ORDEM, e a razao e a mesma da bandeja inteira: o
           que exige leitura antes da proxima decisao fica no alto. */
        ...reportsOf(
          state,
          {
            ...closed,
            /* ── OS TRES ANEXOS, NUM MAPA SO ──────────────────────────────────── A chave e a
               propria especie da carta, e por isso `reportsOf` nao precisa de nenhum `if`: um
               quarto dominio so poe a propria chave aqui. */
            attach: {
              /* A RUA — as cinco notas JA PESADAS por classe, achatadas em `classe.nota`. */
              street: {
                ...Object.fromEntries(
                  Object.entries(opinion.weighed).flatMap(([id, pesos]) =>
                    Object.entries(pesos).map(([nota, valor]) => [`${id}.${nota}`, valor]),
                  ),
                ),
                betrayal: opinion.betrayal,
                wear: opinion.wear,
              },
              /* O CAIXA — e os quatro numeros sao a IDENTIDADE do LASTRO, e nao uma selecao:
                 receita menos obrigatoria e o que EXISTE, o teto e o que a regra deixa
                 gastar, e o MENOR dos dois e o que se pode empenhar. */
              vault: {
                revenue: budget.revenue,
                mandatory: budget.mandatory,
                ceiling: budget.ceiling,
                allowance: budget.allowance,
              },
              /* ⚠ ELE E O EIXO QUE O SIMULADOR NUNCA MEDIU — pagar uns e abandonar outros —,
                 e ate hoje ele so aparecia agregado. */
              seats: Object.fromEntries(
                parties.flatMap(party => [
                  [`${party.id}.was`, state.loyalty[party.id] ?? 0],
                  [`${party.id}.now`, loyalty[party.id] ?? 0],
                  [`${party.id}.seats`, party.seats],
                ]),
              ),
            },
          },
          balance,
        ),
        ...post.mail,
      ],
      pressure,
      impeachment,
      fallen,
      memory,
      /* O FLUXO VEM DA TRAMITACAO, e nao do placar: quem sorteia e a votacao do plenario, e
         ela agora acontece dentro de `advanceBills`. */
      stream: passage.stream,
      /* ⚠ O MES FECHADO VIRA REGISTRO GUARDADO, e o teto e o mesmo da caixa: `CARRY`. Ele era
         montado na tela a partir de `last`, entao o resumo do mes anterior sumia a cada avanco
         e sumia inteiro no F5. Guardamos os SETE valores que a carta mostra, e nao o relatorio
         inteiro — vinte e quatro campos vezes vinte e quatro meses no save. */
      months: [
        {
          month: state.month,
          bill: agenda.proposal?.label ?? null,
          judged: (() => {
            const hit = passage.events.find(
              event => event.kind === "passed" || event.kind === "rejected",
            );
            return hit ? { kind: hit.kind, label: hit.label } : null;
          })(),
          votes: tally?.votes ?? null,
          quorum: agenda.quorum,
          promisedCost,
          paidCost,
          balance: {
            streetWas: balance.streetWas,
            streetNow: balance.streetNow,
            seatsWas: balance.seatsWas,
            seatsNow: balance.seatsNow,
            roomWas: balance.roomWas,
            roomNow: balance.roomNow,
          },
        },
        ...state.months,
      ].slice(0, CARRY),
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
      ratio,
      promised,
      paid,
      tally,
      loyalty,
      people,
      memory,
      balance,
      /* O QUE A TRAMITACAO FEZ NESTE MES — a materia-prima das cartas. */
      events: passage.events,
    },
  };
}

/* QUANTOS MESES A SERIE GUARDA. */
const SERIES_LENGTH = 48;

/* Trinta, e e primeiro chute declarado: com a divida abrindo em 78%, ele ferve por volta de
   108%. */
const DEBT_SPAN = 0.15;

/* QUEM SUSTENTA O GOVERNO NO CONGRESSO, e portanto quem abre a ruptura POLITICA quando
   conclui que sustentar custa mais que derrubar. */
const BROKER = "fisiologismo";

/* QUANTO A CADEIRA CUSTA A MAIS COM O PROCESSO ABERTO. */
const SIEGE_PRICE = 3;

/**
 * Acrescenta um mes a cada serie e corta o excesso pelo comeco.
 *
 * @param {import("../state/state.mjs").Series} series
 * @param {Record<string, number>} point
 * @param {Record<string, number>} areas o indice de cada area no fim deste mes
 * @returns {import("../state/state.mjs").Series}
 */
function extend(series, point, areas) {
  const next = /** @type {Record<string, number[]>} */ ({});
  for (const [key, past] of Object.entries(series)) {
    if (key === "areas") continue;
    next[key] = [.../** @type {number[]} */ (past), point[key] ?? 0].slice(-SERIES_LENGTH);
  }

  /** @type {Record<string, number[]>} */
  const nextAreas = {};
  for (const [id, past] of Object.entries(series.areas)) {
    nextAreas[id] = [...past, areas[id] ?? 0].slice(-SERIES_LENGTH);
  }

  return /** @type {import("../state/state.mjs").Series} */ (
    /** @type {unknown} */ ({ ...next, areas: nextAreas })
  );
}

/**
 * A posicao orcamentaria com que o mes seguinte comeca.
 *
 * @param {GameState} state
 * @param {BudgetOutput} budget
 * @param {Record<string, number>} applied os niveis com que o mes fechou
 * @param {typeof CATALOG} catalog
 * @param {number} interest o custo de carregar a divida NESTE mes
 * @param {Record<string, import("../state/state.mjs").Band>} bands as leis com que o mes ABRIU
 * @param {Record<string, import("../state/state.mjs").Band>} appliedBands as leis com que ele fechou
 * @returns {import("../state/state.mjs").Fiscal}
 */
function nextPosition(state, budget, applied, catalog, interest, bands, appliedBands) {
  /* E ELE E PERMANENTE NOS DOIS SENTIDOS, que e o que torna a decisao pesada: o custo
     politico se paga uma vez e o efeito fiscal fica nos 48 meses. */
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

  /* A FOLHA DAS ESTATAIS TAMBEM E OBRIGATORIA, e por isso ela entra na mesma conta:
     privatizar tira gente da folha da Uniao para sempre, e esse alivio e tao permanente
     quanto o de furar um piso. */
  const payrollOf = (/** @type {Record<string, number>} */ levels) =>
    catalog.rules.reduce(
      (sum, rule) => sum + (rule.reach * rule.payroll * (levels[rule.id] ?? rule.initial)) / 100,
      0,
    );

  const relief =
    floorOf(state.levels, bands) -
    floorOf(applied, appliedBands) +
    (payrollOf(state.levels) - payrollOf(applied));

  /* A BASE, e nao o valor mostrado. */
  const mandatory = Math.max(0, budget.mandatoryBase - relief);

  const closesYear = (state.month + 1) % MONTHS_PER_YEAR === 0;

  return {
    mandatory,
    anchorRevenue: closesYear ? budget.revenueBase : state.fiscal.anchorRevenue,
    anchorExpense: closesYear ? budget.ceiling : state.fiscal.anchorExpense,
    /* ⚠ O JURO ENTRA AQUI, e so aqui. */
    debt: budget.debt + interest,
  };
}

/**
 * O INDICADOR QUE JA FOI DIVULGADO, `release` meses atras.
 *
 * ⚠ O PADRAO E O VALOR CORRENTE, e nao zero: nos primeiros meses a serie e curta
 * demais para ter passado, e devolver zero faria a rua ler inflacao zero e
 * desemprego zero — um paraiso de dois meses que nenhum jogador causou.
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

/**
 * Refeitas por fora, elas divergiriam no primeiro mês em que um limiar mudasse — e o jogador
 * leria uma caldeira que o turno não usa.
 *
 * A CALDEIRA COMO A TELA PRECISA VÊ-LA — os quatro grupos, o que cada um cobra, e
 * quais das três rupturas já estão abertas.
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function boilerOf(state, catalog = CATALOG) {
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  /* UMA CHAMADA SO, e ela responde as duas leituras: o veredito que o turno usa e a distancia
     que a tela mostra. */
  const broke = rupture({
    pressure: state.pressure,
    lobbies: catalog.lobbies,
    standing,
    broker: BROKER,
    parameters: catalog.pressure,
  });

  /* ⚠ A FATIA DO CAPITAL VEM DO MOTOR, e a tela nao a divide por conta propria. */
  const shares = capitalShares(catalog.lobbies);

  return {
    lobbies: catalog.lobbies.map(lobby => ({
      id: lobby.id,
      label: lobby.label,
      wants: lobby.wants,
      /* QUANTO DA RUPTURA ECONOMICA ESTE GRUPO CARREGA, de 0 a 1. */
      share: shares[lobby.id] ?? 0,
      pressure: state.pressure[lobby.id] ?? 0,
      /* FERVENDO E UM ESTADO, e nao um adjetivo: e o mesmo limiar que a ruptura economica le,
         e por isso a tela nao pode ter o proprio. */
      boiling: (state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil,
      boil: catalog.pressure.boil,
      /* ⚠ O SEGUNDO LIMIAR DO FIADOR, e ele e nulo nos outros tres. UM grupo tem duas linhas:
         em `boil` ele abandona o governo, e em `brokerBoil` a ruptura POLITICA abre. A tela
         imprimia os dois numeros em blocos diferentes com o MESMO verbo e o mesmo nome, a um
         palmo de distancia — e quem sabe qual grupo e o fiador e este motor, nao a view. */
      fall: lobby.id === BROKER ? catalog.pressure.brokerBoil : null,
    })),
    rupture: broke,
    /* O valor de cada ruptura e uma conta diferente — a social le a rua, a economica e uma
       media PONDERADA de quem ferveu, e a politica tem limiar proprio e mais alto —, e
       refeitas na tela as tres divergiriam no primeiro mes em que um peso mudasse. */
    ruptures: [
      {
        id: "social",
        value: standing,
        threshold: catalog.pressure.streetFloor,
        /* `below` quer dizer "rompe quando o valor fica ABAIXO do limiar". */
        breaks: "below",
        open: broke.social,
      },
      {
        id: "economic",
        /* A FRACAO PONDERADA DE QUEM ABANDONOU, na mesma escala de 0 a 100 das outras duas —
           e ela e a MESMA conta de `rupture`, com o mesmo peso zero excluido. */
        value: weightedAbandon(state, catalog),
        threshold: 50,
        breaks: "above",
        open: broke.economic,
      },
      {
        id: "political",
        value: state.pressure[BROKER] ?? 0,
        threshold: catalog.pressure.brokerBoil,
        breaks: "above",
        open: broke.political,
      },
    ],
    impeachment: state.impeachment,
    fallen: state.fallen,
    /* ⚠ O PRECO DO CERCO E O QUORUM DA QUEDA SAEM DAQUI, e nao de uma constante copiada na
       view. */
    price: SIEGE_PRICE,
    removal: REMOVAL_MAJORITY,
    seats: SEATS,
  };
}

/**
 * QUANTO DO CAPITAL JA ABANDONOU, de 0 a 100 — a mesma conta que `rupture` faz.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 * @returns {number}
 */
function weightedAbandon(state, catalog) {
  let abandoned = 0;
  let total = 0;
  for (const lobby of catalog.lobbies) {
    if (lobby.weight <= 0) continue;
    total += lobby.weight;
    if ((state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil) abandoned += lobby.weight;
  }
  return total > 0 ? (abandoned / total) * 100 : 0;
}

/* ── O FECHO DO MANDATO ──────────────────────────────────────────────────────
   O mandato passivo cai no mes 47, e a unica coisa que a tela dizia era um selo de dez
   pixels no canto de um cartao: o botao de avancar continuava aceso, e clicar nele nao
   fazia nada nem explicava por que.

   ⚠ ELE NAO E UMA TELA DE DERROTA. A partida JA E um mandato de 48 meses, sem vitoria e
   sem placar — cair e o mandato terminar antes, e o que muda e a DATA. Ha um fecho so, e
   as duas saidas diferem no motivo e no mes, nunca no tom. */

/**
 * @typedef {object} TermArea uma area, do dia da posse ao ultimo mes
 * @property {string} id
 * @property {string} label
 * @property {string} index - o nome do que ela mede
 * @property {number} from - o indice herdado, do catalogo
 * @property {number} to - o indice do ultimo mes
 * @typedef {object} TermLaw uma lei que o jogador escreveu
 * @property {string} id
 * @property {string} label - a alavanca que ela move
 * @property {string} guard - a natureza dela: `none`, `law` ou `constitution`
 * @property {number} month - o mes em que ela passou
 * @typedef {object} Term o mandato visto de fora, no dia em que ele acaba
 * @property {boolean} over - se acabou
 * @property {"removed" | "served" | null} ending - como acabou; nulo enquanto corre
 * @property {number} months - meses decorridos de mandato quando ele acabou
 * @property {number} of - quantos ele tinha
 * @property {{ from: number, to: number }} approval - "otimo/bom", da posse ao fim
 * @property {{ from: number, to: number }} debt - a divida sobre o PIB
 * @property {TermArea[]} areas - as oito, da posse ao fim
 * @property {TermLaw[]} laws - o que ficou escrito
 * @property {string[]} abandoned - os grupos que fervearam e nao voltaram
 */

/**
 * O MANDATO VISTO DE FORA — e a tela pergunta a ele em vez de decidir sozinha.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {Term}
 */
export function termOf(state, catalog = CATALOG) {
  const removed = state.fallen !== null;
  /* ⚠ O MES DA QUEDA MANDA, e nao o corrente. */
  const months = state.fallen ?? state.month;
  const served = state.month >= MONTHS_PER_TERM;

  const debtRatio = state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0;

  /* AS ALAVANCAS INTEIRAS, para achar o rotulo de cada norma. */
  const levers = [...catalog.programs, ...catalog.rules];

  return {
    over: removed || served,
    ending: removed ? "removed" : served ? "served" : null,
    months,
    of: MONTHS_PER_TERM,
    /* Um numero escrito a mao aqui seria a segunda verdade sobre com quanta popularidade o
       presidente entrou — e ela divergiria no dia em que um segmento mudasse. */
    approval: {
      from: pollFrom(opinionOpening(catalog.segments), catalog.segments, catalog.opinion).good,
      to: pollFrom(state.mood, catalog.segments, catalog.opinion).good,
    },
    debt: { from: catalog.fiscal.initialDebtRatio, to: debtRatio },
    areas: catalog.areas.map(area => ({
      id: area.id,
      label: area.label,
      index: area.index,
      from: area.initial,
      to: state.capacity.index[area.id] ?? area.initial,
    })),
    /* ⚠ `enactedAt > 0` E O QUE SEPARA A LEI DO JOGADOR DA HERDADA, e o criterio nao e desta
       funcao: `enact` grava o mes, e a posse grava zero. */
    laws: state.norms
      .filter(norm => norm.enactedAt > 0)
      .map(norm => ({
        id: norm.id,
        label: levers.find(lever => lever.id === norm.target.id)?.label ?? norm.target.id ?? "",
        guard: norm.guard,
        month: norm.enactedAt,
      })),
    /* QUEM FERVEU E NAO VOLTOU. */
    abandoned: catalog.lobbies
      .filter(lobby => (state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil)
      .map(lobby => lobby.label),
  };
}
