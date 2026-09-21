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
  STANDING_NEUTRAL,
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
import { calendarOf } from "./calendar.mjs";
import { breachOf, chosenOf, platformOf, spoken } from "./platform.mjs";
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
 * @typedef {object} Orders as ordens do mes
 * @property {Record<string, number>} [funding] verba PROMETIDA por bancada, de 0 a 1
 * @property {Record<string, number>} [levels] a intensidade PEDIDA de cada programa
 * @property {Record<string, import("../state/state.mjs").Band>} [bands] as leis PEDIDAS
 * @property {Record<string, string>} [mail] o que o jogador respondeu a cada carta
 * @property {ReadonlyArray<string>} [protect] as areas poupadas pelo contingenciamento
 * @property {Partial<Record<string, string | null>>} [platform] os tres compromissos da posse
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
 * @property {Balance} balance as tres leituras do mes, com o antes e o depois de cada uma
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
 * @param {typeof CATALOG} catalog
 * @returns {import("../domain/norms/index.mjs").Lever[]}
 */
function leversOf(catalog) {
  return [
    /* Custo e o divisor que converte percentual de receita em pontos de alavanca. */
    ...catalog.programs.map(program => ({
      id: program.id,
      group: program.area,
      cost: program.cost,
    })),
    ...catalog.rules.map(rule => ({ id: rule.id, group: rule.family })),
  ];
}

/**
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
      /* Mesma tolerancia do premio de risco (initialDebtRatio). */
      const excess = debtRatio - catalog.fiscal.initialDebtRatio;
      want[lobby.id] = clamp(excess / DEBT_SPAN, 0, 1);
      continue;
    }

    if (lobby.reads === "share") {
      /* Ler ratio dava 100% honrado com zero promessa (pressao zero em 48 meses). */
      want[lobby.id] = clamp(1 - delivered, 0, 1);
      continue;
    }

    /* Indice das areas contra o ponto neutro. */
    const ids = (lobby.areas ?? "").split(" ").filter(Boolean);
    if (ids.length === 0) {
      want[lobby.id] = 0;
      continue;
    }
    const mean = ids.reduce((sum, id) => sum + (index[id] ?? NEUTRAL), 0) / ids.length;
    want[lobby.id] = clamp((NEUTRAL - mean) / NEUTRAL, 0, 1);
  }

  /* Silencio conta como recusa; soma direto na pressao que ja tem inercia. */
  for (const id of spurned) {
    want[id] = clamp((want[id] ?? 0) + catalog.pressure.spite, 0, 1);
  }

  return want;
}

/**
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function premiumNow(state, catalog) {
  return premiumOf({
    debtRatio: state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0,
    /* Tolerancia e a divida herdada inicial. */
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
        /* Em bilhoes por mes. */
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
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function positionOf(state, catalog) {
  const pressure = pressureOf({ areas: catalog.areas, history: state.capacity.history });

  /* Dividendo de estatais entra no fator de receita. */
  const base = state.macro.gdp * catalog.fiscal.taxLoad;

  /* Privatizar zera o dividendo e reduz a receita imediatamente. */
  const dividendOf = (/** @type {Record<string, number>} */ levels) =>
    catalog.rules.reduce(
      (sum, rule) => sum + (rule.reach * rule.dividend * (levels[rule.id] ?? rule.initial)) / 100,
      0,
    );

  const opening = Object.fromEntries(catalog.rules.map(rule => [rule.id, rule.initial]));
  const dividends = dividendOf(state.levels) - dividendOf(opening);

  /* Lida em delta, o primario de abertura saltaria de −51,2 para −31,4. */
  const waived = waivedOf(catalog.programs, state.levels);

  return {
    gdp: state.macro.gdp,
    /* Inflacao indexa a despesa obrigatoria. */
    inflation: state.macro.inflation,
    mandatory: state.fiscal.mandatory,
    anchorRevenue: state.fiscal.anchorRevenue,
    anchorExpense: state.fiscal.anchorExpense,
    /* Fracao mensal: sem ela, o teto abria com R$ 107 bi a mais sobre 176 de discricionario. */
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
 * @param {ReadonlyArray<import("../data/rules.mjs").Rule>} rules
 * @param {Record<string, number>} before
 * @param {Record<string, number>} after
 * @returns {number} bilhoes, no mes
 */
function saleOf(rules, before, after) {
  let total = 0;
  for (const rule of rules) {
    const sold = (before[rule.id] ?? rule.initial) - (after[rule.id] ?? rule.initial);
    /* So a venda de estatais arrecada no mes. */
    if (sold > 0) total += (rule.reach * rule.sale * sold) / 100;
  }
  return total;
}

/**
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {number}
 */
export function discretionaryRoom(state, catalog = CATALOG) {
  return budgetStep({ ...positionOf(state, catalog), spent: 0 }).allowance / MONTHS_PER_YEAR;
}

/**
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

  /* Teto fechado vem primeiro: sem discricionario nao ha emenda para manter a base. */
  if (budget.blocked) return { level: "crisis", reason: "blocked", base };
  if (ruptured) return { level: "crisis", reason: "rupture", base };
  if (base < SIMPLE_MAJORITY) return { level: "crisis", reason: "minority", base };

  if (obstructing) return { level: "stable", reason: "obstruction", base };
  if (base < QUALIFIED_MAJORITY) return { level: "stable", reason: "tight", base };

  return { level: "growth", reason: "comfortable", base };
}

/**
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 */
export function settlement(state, orders = {}, catalog = CATALOG) {
  const { parties, fiscal, programs } = catalog;

  const bands = bandsOf(state, catalog);

  const written = { ...state.levels, ...(orders.levels ?? {}) };

  /* Piso vinculado anda com a receita: sobe de 63,00 para 64,60 em 5 meses enquanto o vigente cai de 66,00 para 65,60. */
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

  /** @type {Record<string, number>} */
  const promised = {};
  for (const party of parties) {
    promised[party.id] = clamp(orders.funding?.[party.id] ?? 0, 0, 1);
  }

  /* O gasto usa a lei vigente; a proposta pode demorar ate 3 meses na tramitacao. */
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

  /* ID protegido peneirado contra areas validas do catalogo. */
  const protect = new Set(
    (orders.protect ?? []).filter((/** @type {string} */ id) =>
      catalog.areas.some(area => area.id === id),
    ),
  );

  /* Com processo de impeachment aberto, a cadeira custa mais. */
  const seatPrice = fiscal.seatPrice * (state.impeachment === null ? 1 : SIEGE_PRICE);
  const promisedCost = costOf(promised, parties, seatPrice);
  const demand = promisedCost + askedTotal;

  /* Protegido sai dos dois lados da razao: blindar tudo estoura a meta primaria. */
  const shielded = [...protect].reduce((sum, id) => sum + (asked[id] ?? 0), 0);
  const cuttable = demand - shielded;
  const ratio = demand <= room ? 1 : cuttable <= 0 ? 0 : clamp((room - shielded) / cuttable, 0, 1);

  /** @type {Record<string, number>} */
  const paid = {};
  for (const party of parties) {
    /* Emenda entra no contingenciamento (referencia real: R$ 4,71 bi). */
    paid[party.id] = (promised[party.id] ?? 0) * ratio;
  }

  const levels = honour({ programs, levels: held, ratio, bands, protect });
  const honoured = spendOf({ programs, levels, bands });
  const allocated = honoured.byArea;

  /* Capacidade consome o gasto total da area; ler so discricionario fazia desregulamentar sem custo. */
  const funded = honoured.fullByArea;

  /* Elenco deterministico gerado por hash da semente para tela e turno usarem a mesma camara. */
  const people = cast({
    seed: state.seed,
    parties,
    archetypes: catalog.archetypes,
    firstNames: catalog.firstNames,
    surnames: catalog.surnames,
    ambitions: catalog.ambitions,
    areas: catalog.areas.map(area => area.id),
    genderOf: catalog.genderOf,
  });

  const { benches, credit } = benchesOf({
    people,
    parties,
    memory: state.memory,
    parameters: catalog.cast,
  });

  /* Sem esta linha o lider nasceria com lealdade zero (bancada em ruptura no mes 1). */
  /** @type {Record<string, number>} */
  const chamberLoyalty = { ...state.loyalty };
  for (const person of people) chamberLoyalty[person.id] = state.loyalty[person.bloc] ?? 0;

  /* Ambicao medida contra a posse para evitar preco oscilar com rateio mensal. */
  const wasSpent = spendOf({
    programs,
    levels: Object.fromEntries(programs.map(program => [program.id, program.initial])),
  }).fullByArea;

  /** @type {Record<string, number>} */
  const byArea = {};
  for (const [id, was] of Object.entries(wasSpent)) {
    byArea[id] = was > 0 ? clamp((funded[id] ?? 0) / was - 1, -1, 1) : 0;
  }

  /* Ponto neutro de aprovacao unico no jogo inteiro. */
  const street =
    (pollFrom(state.mood, catalog.segments, catalog.opinion).good - STANDING_NEUTRAL) / 100;

  /* Bloco do presidente dividido entre lideres com bancadas proprias. */
  const ruling =
    state.party === null || state.party === undefined
      ? null
      : new Set([
          state.party,
          ...people.filter(person => person.bloc === state.party).map(person => person.id),
        ]);

  const table = (/** @type {Record<string, number>} */ source) =>
    offered({
      people,
      parties,
      funding: source,
      credit,
      parameters: catalog.cast,
      street,
      byArea,
    });

  return {
    agenda,
    held,
    bands,
    people,
    benches,
    ruling,
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

    protect,
    shielded,
    paidCost: promisedCost * ratio,
    /* Empenho sai do rateio efetivo: proporcional e por area dao o mesmo numero ate contingenciar. */
    allocatedTotal: honoured.total,
  };
}

/**
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

    /* Boil (68) > demandAt (30): filtrar por demand evita calar grupos fervendo por 24 a 30 meses. */
    const open = (/** @type {import("../state/state.mjs").Letter} */ letter) =>
      letter.kind === "demand" && letter.from === lobby.id && letter.answer === null;
    if (state.mail.some(open)) continue;

    const worst = leverOf(state, lobby, catalog);

    if (!worst) continue;

    written.push(demand({ lobby, program: worst, level: worst.initial, month: state.month }));
  }

  return written;
}

/**
 * @param {GameState} state
 * @param {import("../data/lobbies.mjs").Lobby} lobby
 * @param {typeof CATALOG} catalog
 * @returns {import("../data/programs.mjs").Program | null}
 */
function leverOf(state, lobby, catalog) {
  /* Mercado olha o orcamento inteiro em vez de area isolada. */
  const areas = new Set((lobby.areas ?? "").split(" ").filter(Boolean));
  const wantsCut = lobby.reads === "debt";

  let chosen = null;
  let deepest = 0;

  for (const program of catalog.programs) {
    if (!wantsCut && !areas.has(program.area)) continue;

    const now = state.levels[program.id] ?? program.initial;

    const moved = ((wantsCut ? now - program.initial : program.initial - now) / 100) * program.cost;

    if (moved > deepest) {
      deepest = moved;
      chosen = program;
    }
  }

  return chosen;
}

/**
 * Capacidade le funded (gasto total); asked na Previdencia era 2,4 bi contra 126,7 bi (2%).
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 * @returns {{ index: Record<string, number>, idle: Record<string, number> }}
 */
export function outlook(state, orders = {}, catalog = CATALOG) {
  /** @param {Orders} given */
  const project = given =>
    capacityStep({
      areas: catalog.areas,
      index: state.capacity.index,
      history: state.capacity.history,

      allocation: settlement(state, given, catalog).funded,
      impacts: {},
      neutral: NEUTRAL,
      capacityTarget: CAPACITY_TARGET,
    }).index;

  return { index: project(orders), idle: project({}) };
}

/* Horizonte de 24 meses: 6 das 8 areas levam mais de um mandato para mover. */
export const HORIZON = 24;

/**
 * Projecao mantendo a alocacao atual com plenario congelado (evita votos estocasticos).
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 * @param {number} [months]
 * @returns {{ index: Record<string, number[]>, idle: Record<string, number[]> }}
 */
export function trajectory(state, orders = {}, catalog = CATALOG, months = HORIZON) {
  const funded = settlement(state, orders, catalog).funded;
  const idleFunded = settlement(state, {}, catalog).funded;

  /** @param {Record<string, number>} allocation */
  const run = allocation => {
    let index = state.capacity.index;
    let history = state.capacity.history;
    /** @type {Record<string, number[]>} */
    const series = {};
    for (const area of catalog.areas) series[area.id] = [];

    for (let month = 0; month < months; month++) {
      const step = capacityStep({
        areas: catalog.areas,
        index,
        history,
        allocation,
        impacts: {},
        neutral: NEUTRAL,
        capacityTarget: CAPACITY_TARGET,
      });
      index = step.index;
      history = step.history;
      for (const area of catalog.areas) series[area.id]?.push(index[area.id] ?? area.initial);
    }

    return series;
  };

  return { index: run(funded), idle: run(idleFunded) };
}

/**
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

      waiting: state.month - bill.since,
      /* Prazo de gaveta antes de caducar. */
      expires: bill.stage === "drawer" ? DRAWER_LIFE - (state.month - bill.writtenAt) : null,
      instrument: agenda.proposal?.instrument ?? "",
      quorum: agenda.quorum,
      saved: bill.saved ?? null,
    };
  });
}

/**
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function chamberOf(state, catalog = CATALOG) {
  const share = settlement(state, {}, catalog);
  return seating({ parties: share.benches, loyalty: share.chamberLoyalty });
}

/**
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
    areas: catalog.areas.map(area => area.id),
    genderOf: catalog.genderOf,
  });

  return {
    people,
    /* Nome digitado sobrepoe o sorteado; null usa o sorteado. */
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

    treatment: state.president?.treatment ?? "senhor",

    adviser: people.find(person => person.office === "chief") ?? null,
    stance: stanceOf(state, catalog),
  };
}

/**
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {{ economic: number, liberty: number, near: string, article: string } | null}
 */
function stanceOf(state, catalog = CATALOG) {
  const levers = [...catalog.programs, ...catalog.rules];

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

  /* Menor distancia euclidiana no plano economico e de costumes. */
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
 * Previsao de votacao usando a mesma camara, empenho e rua do turno.
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 */
export function forecast(state, orders = {}, catalog = CATALOG) {
  const share = settlement(state, orders, catalog);
  const agenda = share.agenda;

  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  /** @type {Record<string, number>} */
  const byBloc = {};
  for (const party of catalog.parties) byBloc[party.id] = 0;

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
    ruling: share.ruling,
  });

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
 * @param {GameState} state
 * @param {ReturnType<typeof settlement>} share
 * @param {import("../domain/congress/index.mjs").Forecast} whip
 * @param {Record<string, number>} byBloc
 * @param {typeof CATALOG} catalog
 */
function blocsOf(state, share, whip, byBloc, catalog) {
  const seatsOf = new Map(share.benches.map(bench => [bench.id, bench.seats]));
  const votesOf = new Map(whip.parties.map(bench => [bench.partyId, bench.votes]));
  const areaLabel = new Map(catalog.areas.map(area => [area.id, area.label]));

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

        portfolio: person.ambition === "cabinet" ? (areaLabel.get(person.portfolio) ?? "") : "",
        seats: seatsOf.get(person.id) ?? 0,
        /* Alcances normalizados para nao estourar a Camara (evita defeito de 730 cadeiras). */
        reach: party.seats > 0 ? (seatsOf.get(person.id) ?? 0) / party.seats : 0,
        votes: votesOf.get(person.id) ?? 0,

        memory: clamp((state.memory[person.id] ?? 0) / (catalog.cast.memoryCap || 1), -1, 1),
      })),
  }));
}

/**
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

const NOTICED = new Set(["tabled", "forgotten", "passed", "rejected"]);

/**
 * @param {GameState} state o mes ANTES do passo
 * @param {ReturnType<typeof rupture>} now as rupturas depois dele
 * @param {number | null} impeachment o mes em que o processo abriu, ja decidido
 * @param {typeof CATALOG} catalog
 * @param {object} after o que o mes acabou de produzir
 * @param {Record<string, number>} after.pressure
 * @param {Record<string, number>} after.loyalty
 * @param {boolean} after.blocked se o teto do arcabouco esta fechado NESTE mes
 * @param {boolean} after.blockedNext se ele estara fechado no mes que vem
 * @param {number} after.ratio a fracao do pedido que o rateio honrou, de 0 a 1
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

  /* Cerco le impeachment aberto e so termina no plenario. */
  if (state.impeachment === null && impeachment !== null) {
    written.push(alarm({ kind: "siege", id: "siege", subject: "siege", month: state.month }));
  }

  /* Aviso antecipado de teto fechado no proximo mes (fechava em 12 dos 48 meses da politica piso). */
  if (!after.blocked && after.blockedNext) {
    written.push(alarm({ kind: "ceiling", id: "ceiling", subject: "ceiling", month: state.month }));
  }

  /* Relatorio bimestral avisado um mes antes; id com mes para nao colidir entregas no ano. */
  if (calendarOf(state.month + 1).now.some(landmark => landmark.id === "bimestral")) {
    written.push(
      alarm({
        kind: "contingency",
        id: String(state.month),
        subject: "contingency",
        month: state.month,

        now: Math.round(after.ratio * 100),
      }),
    );
  }

  /* Alarme dispara apenas na transicao da base para minoria. */
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

  /* Alarme individual por lobby que atinge o ponto de fervura. */
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

        was: catalog.pressure.boil,
        now: after.pressure[lobby.id] ?? 0,
      }),
    );
  }

  const held = new Set(state.mail.map(letter => letter.id));
  return written.filter(letter => !held.has(letter.id));
}

/* Limiares minimos de variacao para disparar relatorio do mes. */
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
 * @param {GameState} state
 * @param {object} world
 * @param {{ benches: Party[], offeredPaid: Record<string, number>,
 * chamberLoyalty: Record<string, number>,
 * people: ReadonlyArray<import("../domain/cast/index.mjs").Person>,
 * ruling: ReadonlySet<string> | null,
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

  /** @type {import("../state/state.mjs").Letter[]} */
  const asked = [];

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
        ruling: share.ruling,
      });

      if (tabled) events.push({ kind: "tabled", label: bill.label, detail: null, bill: bill.id });
      bills.push(tabled ? { ...bill, stage: "rapporteur", since: state.month } : bill);
      continue;
    }

    if (bill.stage === "rapporteur") {
      /* Usa a caixa ja fechada para nao travar em cartas respondidas neste mes. */
      const open = pending(mail, bill.id);
      if (open) {
        bills.push(bill);
        continue;
      }

      const answer = answers.get(bill.id) ?? null;

      if (answer?.answer === "block") {
        events.push({ kind: "blocked", label: bill.label, detail: null, bill: bill.id });
        bills.push({ ...bill, stage: "drawer", since: state.month });
        continue;
      }

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

    if (voted) {
      bills.push(bill);
      continue;
    }
    voted = true;

    const result = vote({
      bill: agenda.proposal,

      parties: share.benches,
      funding: share.offeredPaid,
      loyalty: share.chamberLoyalty,
      stream,
      majority: agenda.quorum,
      standing,
      ruling: share.ruling,
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
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {Options} [options]
 * @returns {{ state: GameState, report: Report }}
 */
export function playMonth(state, orders = {}, options = {}) {
  const catalog = options.catalog ?? CATALOG;
  const { areas, parties } = catalog;

  const position = positionOf(state, catalog);

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
    ruling,
    chamberLoyalty,
    offeredPaid,
    promisedCost,
    paidCost,
    allocatedTotal,
    ratio,
    requestedBands,
  } = settlement(state, orders, catalog);

  /* Rua da votacao e a apurada no mes anterior. */
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  /* Textos antigos avancam antes do protocolo do mes; cartas fecham antes dos textos. */
  const post = settleMail({ mail: state.mail, orders: orders.mail ?? {}, month: state.month });

  /* Concedido move a alavanca no orcamento; recusado sobe a queixa do lobby. */
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
    share: { benches, offeredPaid, chamberLoyalty, people, bands, ruling },
    standing,
    catalog,
    resolved: post.resolved,
    mail: post.mail,
  });

  const tally = passage.tally;

  const loyalty = settle({ parties, loyalty: state.loyalty, promised, paid });
  const memory = remember({
    people,
    memory: state.memory,
    promised,
    paid,
    parameters: catalog.cast,
    ruling: state.party ?? null,
  });

  const approved = passage.passed;
  const enacted = approved !== null;

  /* Concedido entra por cima do texto aprovado se tocarem a mesma alavanca. */
  const intended = { ...(approved ? { ...held, ...approved.levels } : held), ...conceded };

  /* Estado guarda o pedido: gravar rateio travava 92 em 89,70 apos 6 meses; merge evita 44 chaves virarem 38 (poder-executivo 30->0). */
  const settled = { ...state.levels, ...intended };

  const written = approved
    ? normsFrom(bands, { ...bands, ...approved.bands }, state.month, catalog)
    : [];
  const appliedNorms = written.length > 0 ? [...state.norms, ...written] : state.norms;

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

  const capacity = capacityStep({
    areas,
    index: state.capacity.index,
    history: state.capacity.history,
    allocation: funded,
    impacts: {},
    neutral: NEUTRAL,
    capacityTarget: CAPACITY_TARGET,
  });

  /* Venda abate empenho liquido no lastro. */
  const proceeds = saleOf(catalog.rules, state.levels, settled);
  const budget = budgetStep({ ...position, spent: paidCost + allocatedTotal - proceeds });

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

  /* Juros sobre o estoque da divida ao preco do dia anterior a decisao da Selic. */
  const interest = carry({
    debt: state.fiscal.debt,
    rate: state.macro.rate,
    premium: premiumNow(state, catalog),
    parameters: catalog.macro,
  });

  const released = {
    inflation: releasedFrom(state.series.inflation, catalog.opinion.release, state.macro.inflation),
    unemployment: releasedFrom(
      state.series.unemployment,
      catalog.opinion.release,
      state.macro.unemployment,
    ),
    growth: economy.growth,
  };

  const protocolled = draft(agenda, state.month, bands, requestedBands, requested);

  const opinion = opinionStep({
    mood: state.mood,
    released,
    services: mean([capacity.index["health"], capacity.index["education"]]),
    safety: capacity.index["security"] ?? 50,
    /* Traicao e o maior entre emenda nao paga e quebra da posse (evita dupla punicao na rua). */
    betrayal: Math.max(
      promisedCost > 0 ? 1 - paidCost / promisedCost : 0,
      breachOf(state, catalog),
    ),
    tenure: state.month,
    segments: catalog.segments,
    parameters: catalog.opinion,
  });

  const pressure = heat({
    pressure: state.pressure,
    grievance: grievanceOf({
      debtRatio: budget.debtRatio,

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

  const rupturas = rupture({
    pressure,
    lobbies: catalog.lobbies,

    standing: pollFrom(opinion.mood, catalog.segments, catalog.opinion).good,
    broker: BROKER,
    parameters: catalog.pressure,
  });
  const impeachment = state.impeachment ?? (rupturas.open ? state.month : null);

  const seat = stanceOf(state, catalog);
  const survivors =
    /* Plenario de afastamento vota no mes seguinte a abertura do processo. */
    impeachment !== null && impeachment < state.month && state.fallen === null
      ? vote({
          bill: { economic: seat?.economic ?? 50, liberty: seat?.liberty ?? 50, threat: 0 },
          parties: benches,
          funding: offeredPaid,
          loyalty: chamberLoyalty,
          stream: passage.stream,
          majority: SEATS - REMOVAL_MAJORITY + 1,
          standing,
          /* No afastamento nao ha emenda; lealdade partidaria nasce 20 pontos acima. */
          ruling,
        })
      : null;

  const fallen = state.fallen ?? (survivors && !survivors.passed ? state.month : null);

  const nextFiscal = nextPosition(state, budget, settled, catalog, interest, bands, appliedBands);

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
      levels: settled,
      /* Plataforma imutavel apos a posse. */
      platform: spoken(state.platform) ? state.platform : chosenOf(orders.platform, catalog),
      norms: appliedNorms,
      /* Texto entra apos avanco: protocolo antes reduziria tramitacao de 3 meses para 2. */
      bills: protocolled ? [...passage.bills, protocolled] : passage.bills,

      mail: [
        ...alarmsOf(state, rupturas, impeachment, catalog, {
          pressure,
          loyalty,
          blocked: budget.blocked,
          ratio,

          blockedNext: budgetStep({
            ...positionOf({ ...state, fiscal: nextFiscal }, catalog),
            spent: 0,
          }).blocked,
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
            attach: {
              /* A rua: notas pesadas por classe. */
              street: {
                ...Object.fromEntries(
                  Object.entries(opinion.weighed).flatMap(([id, pesos]) =>
                    Object.entries(pesos).map(([nota, valor]) => [`${id}.${nota}`, valor]),
                  ),
                ),
                betrayal: opinion.betrayal,
                wear: opinion.wear,
              },
              /* Caixa: receita menos obrigatoria contra teto de gastos. */
              vault: {
                revenue: budget.revenue,
                mandatory: budget.mandatory,
                ceiling: budget.ceiling,
                allowance: budget.allowance,
              },

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

      stream: passage.stream,
      /* Mes fechado guarda os 7 valores da carta (evita 24 campos x 24 meses no save). */
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
      levels: settled,
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

      events: passage.events,
    },
  };
}

const SERIES_LENGTH = 48;

/* Divida abrindo em 78% ferve perto de 108%. */
const DEBT_SPAN = 0.15;

const BROKER = "fisiologismo";

const SIEGE_PRICE = 3;

/**
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
  /* Efeito fiscal de normas e permanente nos 48 meses. */
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

  /* Folha de estatais entra no alivio obrigatorio permanente. */
  const payrollOf = (/** @type {Record<string, number>} */ levels) =>
    catalog.rules.reduce(
      (sum, rule) => sum + (rule.reach * rule.payroll * (levels[rule.id] ?? rule.initial)) / 100,
      0,
    );

  const relief =
    floorOf(state.levels, bands) -
    floorOf(applied, appliedBands) +
    (payrollOf(state.levels) - payrollOf(applied));

  const mandatory = Math.max(0, budget.mandatoryBase - relief);

  const closesYear = (state.month + 1) % MONTHS_PER_YEAR === 0;

  return {
    mandatory,
    anchorRevenue: closesYear ? budget.revenueBase : state.fiscal.anchorRevenue,
    anchorExpense: closesYear ? budget.ceiling : state.fiscal.anchorExpense,

    debt: budget.debt + interest,
  };
}

/**
 * Indicador divulgado ha release meses; fallback no corrente evita zero no inicio.
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
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function boilerOf(state, catalog = CATALOG) {
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  const broke = rupture({
    pressure: state.pressure,
    lobbies: catalog.lobbies,
    standing,
    broker: BROKER,
    parameters: catalog.pressure,
  });

  const shares = capitalShares(catalog.lobbies);

  return {
    lobbies: catalog.lobbies.map(lobby => ({
      id: lobby.id,
      label: lobby.label,
      wants: lobby.wants,

      share: shares[lobby.id] ?? 0,
      pressure: state.pressure[lobby.id] ?? 0,

      boiling: (state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil,
      boil: catalog.pressure.boil,
      /* Fiador: boil abandona o governo e brokerBoil abre ruptura politica. */
      fall: lobby.id === BROKER ? catalog.pressure.brokerBoil : null,
    })),
    rupture: broke,
    /* Rupturas: social le rua, economica le ponderada dos lobbies e politica le fiador. */
    ruptures: [
      {
        id: "social",
        value: standing,
        threshold: catalog.pressure.streetFloor,

        breaks: "below",
        open: broke.social,
      },
      {
        id: "economic",

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

    price: SIEGE_PRICE,
    removal: REMOVAL_MAJORITY,
    seats: SEATS,
  };
}

/**
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

/* Fecho unificado do mandato: queda antecipada (ex: mes 47) ou 48 meses completos. */

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
 * @property {Array<import("./platform.mjs").Verdict>} pledges - a plataforma da posse, julgada
 * @property {string[]} abandoned - os grupos que fervearam e nao voltaram
 */

/**
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {Term}
 */
export function termOf(state, catalog = CATALOG) {
  const removed = state.fallen !== null;

  const months = state.fallen ?? state.month;
  const served = state.month >= MONTHS_PER_TERM;

  const debtRatio = state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0;

  const levers = [...catalog.programs, ...catalog.rules];

  return {
    over: removed || served,
    ending: removed ? "removed" : served ? "served" : null,
    months,
    of: MONTHS_PER_TERM,

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
    /* EnactedAt > 0 separa leis aprovadas durante o mandato das herdadas na posse. */
    laws: state.norms
      .filter(norm => norm.enactedAt > 0)
      .map(norm => ({
        id: norm.id,
        label: levers.find(lever => lever.id === norm.target.id)?.label ?? norm.target.id ?? "",
        guard: norm.guard,
        month: norm.enactedAt,
      })),
    /* Promessas em aberto ao fim do mandato sao julgadas como nao cumpridas. */
    pledges: platformOf(state, catalog).map(verdict => ({
      ...verdict,
      kept: (removed || served) && verdict.kept === null ? false : verdict.kept,
    })),

    abandoned: catalog.lobbies
      .filter(lobby => (state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil)
      .map(lobby => lobby.label),
  };
}
