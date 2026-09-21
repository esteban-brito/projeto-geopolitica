/* Estado imutavel com reducer puro. */

import { CATALOG } from "../data/catalog.mjs";
import { waivedOf } from "../data/programs.mjs";
import { MONTHS_PER_YEAR, REGIME } from "../data/regime.mjs";
import { opening } from "../domain/capacity/index.mjs";
import { opening as economyOpening } from "../domain/economy/index.mjs";
import { inherited } from "../domain/norms/index.mjs";
import { opening as opinionOpening } from "../domain/opinion/index.mjs";
import { streamFrom } from "./random.mjs";

/** @typedef {"crisis" | "stable" | "growth"} Situation */

/**
 * @typedef {import("../domain/opinion/index.mjs").Approval} Approval
 * @typedef {import("./random.mjs").Stream} Stream
 * @typedef {object} Streams
 * @property {Stream} congress - o fluxo de tramitacao
 */

/**
 * @typedef {import("../domain/economy/index.mjs").MacroState} MacroState
 * @typedef {object} Fiscal
 * @property {number} mandatory - despesa obrigatoria anualizada
 * @property {number} anchorRevenue - receita do exercicio anterior
 * @property {number} anchorExpense - despesa total do exercicio anterior
 * @property {number} debt - divida bruta
 */

/**
 * @typedef {object} Series
 * @property {number[]} gdp
 * @property {number[]} inflation
 * @property {number[]} rate
 * @property {number[]} unemployment
 * @property {number[]} debtRatio
 * @property {number[]} primary - resultado primario do mes em bilhoes
 * @property {Record<string, number[]>} areas - indice de cada area
 */

/**
 * @typedef {object} MonthCard
 * @property {number} month
 * @property {string | null} bill
 * @property {{ kind: string, label: string } | null} judged
 * @property {number | null} votes
 * @property {number} quorum
 * @property {number} promisedCost
 * @property {number} paidCost
 * @property {{ streetWas: number, streetNow: number, seatsWas: number, seatsNow: number, roomWas: number, roomNow: number }} balance
 */

/**
 * @typedef {object} Letter
 * @property {string} id
 * @property {"posse" | "tabled" | "reported" | "forgotten" | "passed" | "rejected" | "demand" | "rupture" | "siege" | "ceiling" | "contingency" | "minority" | "boiling" | "street" | "seats" | "vault"} kind
 * @property {number} month
 * @property {number | null} due
 * @property {string | null} subject
 * @property {string | null} bill
 * @property {string[]} except
 * @property {string | null} saved
 * @property {number | null} was
 * @property {number | null} now
 * @property {Record<string, number> | null} [attach]
 * @property {string | null} from
 * @property {string | null} lever
 * @property {number | null} level
 * @property {"accept" | "block" | "silence" | null} answer
 * @property {number | null} closedAt
 */

/** @typedef {{ index: Record<string, number>, history: Record<string, number[]> }} Capacity */
/** @typedef {import("../domain/norms/index.mjs").Band} Band */
/** @typedef {import("../domain/norms/index.mjs").Norm} Norm */
/** @typedef {import("../application/passage.mjs").Bill} Bill */
/** @typedef {{ priority: string | null, fiscal: string | null, reform: string | null }} Platform */

/**
 * @typedef {object} GameState
 * @property {number} schemaVersion
 * @property {number} seed
 * @property {{ name: string, treatment: "senhor" | "senhora" } | null} president
 * @property {Platform} platform
 * @property {string | null} [party]
 * @property {number} month
 * @property {Record<string, number>} mood
 * @property {Record<string, number>} loyalty
 * @property {Fiscal} fiscal
 * @property {MacroState} macro
 * @property {Capacity} capacity
 * @property {Series} series
 * @property {Record<string, number>} levels
 * @property {Norm[]} norms
 * @property {MonthCard[]} months
 * @property {Bill[]} bills
 * @property {Letter[]} mail
 * @property {Record<string, number>} pressure
 * @property {number | null} impeachment
 * @property {number | null} fallen
 * @property {Record<string, number>} memory
 * @property {Streams} streams
 */

/* Recusa versao diferente para nao converter save sem inversa util. */
export const SCHEMA_VERSION = 20;

/* Sorteio 50% feminino e masculino; deduzir do nome errava metade das partidas. */
export const TREATMENTS = /** @type {const} */ (["senhor", "senhora"]);

export const INITIAL_LOYALTY = 70;

/* Subir uma bancada de 70 para 95 entrega ate 17 cadeiras, contra 13 da emenda cheia. */
export const RULING_LOYALTY = 90;

/* Posse em 1º de janeiro: valor 2 iniciava em marco com 46 dos 48 meses. */
export const OPENING_MONTH = 0;

export const DEFAULT_SEED = 20270101;

/** @template T @param {T} value @returns {T} */
export function deepFreeze(value) {
  if (value === null || typeof value !== "object") return value;
  for (const key of Object.keys(value)) {
    deepFreeze(/** @type {Record<string, unknown>} */ (value)[key]);
  }
  return Object.freeze(value);
}

/**
 * @param {number} [seed]
 * @param {typeof CATALOG} [catalog]
 * @param {{ name: string, treatment: "senhor" | "senhora" } | null} [president]
 * @param {string | null} [party]
 * @returns {GameState}
 */
export function createState(
  seed = DEFAULT_SEED,
  catalog = CATALOG,
  president = null,
  party = null,
) {
  const { areas, fiscal, macro, parties, programs, rules, segments } = catalog;
  return deepFreeze({
    schemaVersion: SCHEMA_VERSION,
    seed,
    president,
    platform: { priority: null, fiscal: null, reform: null },
    party,
    month: OPENING_MONTH,
    mood: opinionOpening(segments),
    loyalty: Object.fromEntries(
      parties.map(item => [item.id, item.id === party ? RULING_LOYALTY : INITIAL_LOYALTY]),
    ),
    macro: economyOpening(fiscal.initialGdp, macro),
    fiscal: {
      mandatory: fiscal.initialMandatory,
      /* Receita liquida da renuncia: bruta gerava crescimento negativo no ano 1. */
      anchorRevenue:
        fiscal.initialGdp * fiscal.taxLoad -
        waivedOf(
          programs,
          Object.fromEntries(programs.map(program => [program.id, program.initial])),
        ),
      anchorExpense: fiscal.initialMandatory + fiscal.initialDiscretionary,
      debt: fiscal.initialGdp * fiscal.initialDebtRatio,
    },
    capacity: opening(areas),
    series: {
      gdp: [],
      inflation: [],
      rate: [],
      unemployment: [],
      debtRatio: [],
      primary: [],
      areas: Object.fromEntries(areas.map(area => [area.id, []])),
    },
    levels: Object.fromEntries([...programs, ...rules].map(lever => [lever.id, lever.initial])),
    norms: [...programs, ...rules].map(inherited),
    bills: [],
    /** @type {MonthCard[]} */
    months: [],
    mail: [
      {
        id: "posse",
        kind: /** @type {const} */ ("posse"),
        month: OPENING_MONTH,
        due: null,
        subject: null,
        bill: null,
        except: [],
        saved: null,
        from: null,
        lever: null,
        level: null,
        was: null,
        now: null,
        answer: null,
        closedAt: OPENING_MONTH,
      },
    ],
    pressure: Object.fromEntries(catalog.lobbies.map(lobby => [lobby.id, 0])),
    impeachment: null,
    fallen: null,
    memory: {},
    streams: {
      congress: streamFrom(seed, "congress"),
    },
  });
}

/**
 * @typedef {object} Action
 * @property {"monthResolved"} type
 * @property {Record<string, number>} loyalty
 * @property {Fiscal} fiscal
 * @property {Capacity} capacity
 * @property {MacroState} macro
 * @property {Series} series
 * @property {MonthCard[]} months
 * @property {Record<string, number>} mood
 * @property {Record<string, number>} levels
 * @property {Platform} platform
 * @property {Norm[]} norms
 * @property {Bill[]} bills
 * @property {Letter[]} mail
 * @property {Record<string, number>} pressure
 * @property {number | null} impeachment
 * @property {number | null} fallen
 * @property {Record<string, number>} memory
 * @property {Stream} stream
 */

/** @param {GameState} state @param {Action} action @returns {GameState} */
export function reduce(state, action) {
  switch (action.type) {
    case "monthResolved": {
      return deepFreeze({
        ...state,
        month: state.month + 1,
        loyalty: action.loyalty,
        fiscal: action.fiscal,
        capacity: action.capacity,
        macro: action.macro,
        series: action.series,
        months: action.months,
        mood: action.mood,
        levels: action.levels,
        platform: action.platform,
        norms: action.norms,
        bills: action.bills,
        mail: action.mail,
        pressure: action.pressure,
        impeachment: action.impeachment,
        fallen: action.fallen,
        memory: action.memory,
        streams: { ...state.streams, congress: action.stream },
      });
    }

    default:
      return state;
  }
}

/** @param {number} month @returns {{ name: string, year: number }} */
export function monthParts(month) {
  const names = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  const name = names[month % MONTHS_PER_YEAR] ?? "jan";
  const year = REGIME.firstYear + Math.floor(month / MONTHS_PER_YEAR);
  return { name, year };
}

/** @param {number} month @returns {string} */
export function monthLabel(month) {
  const { name, year } = monthParts(month);
  return `${name} · ${year}`;
}
