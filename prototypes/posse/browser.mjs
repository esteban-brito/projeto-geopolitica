import { posseDeputyOf } from "../../src/public/index.mjs";
import { DEFAULT_SEED } from "../../src/state/state.mjs";
import { PARTY_IDS, previewPosse, readPosse } from "./bridge.mjs";
import {
  structureOf,
  mergeStructure,
  splitStructure,
  structureParts,
  structureWeight,
  abolishStructure,
  restoreStructure,
  openingStructure,
  createStructure,
  transferStructure,
  renameStructure,
  cancelCreation,
} from "./structure.mjs";
import { searchDestinations, searchWork } from "../government/work-search.mjs";
import { POSSE_FILES } from "./paths.mjs";

/** @type {Map<string, ReturnType<typeof previewPosse>>} */
const cache = new Map();
/** @type {Map<string, number[]>} */
const deputies = new Map();

export const PosseEngine = {
  /** @type {ReturnType<typeof previewPosse> | null} */
  current: null,
  /** @type {ReturnType<typeof readPosse> | null} */
  snapshot: null,
  /** @type {import("../government/index.mjs").GovernmentState | null} */
  government: null,
  /** @template T @param {T} initial @returns {T} */
  start(initial) {
    try {
      localStorage.removeItem("republica-posse-bridge-v1");
    } catch {
      // A sessão em memória também começa vazia quando o navegador bloqueia armazenamento.
    }
    cache.clear();
    PosseEngine.current = null;
    PosseEngine.snapshot = null;
    PosseEngine.government = null;
    return initial;
  },
  /** @param {import("./bridge.mjs").President} president @param {Readonly<Record<string, import("./bridge.mjs").Nominee>>} people @param {import("./bridge.mjs").Structure} structure */
  bind(president, people, structure) {
    const opening = PosseEngine.government !== null && openingStructure(PosseEngine.government);
    structure = {
      ...structure,
      ...(opening ? { into: {}, gone: {}, created: [] } : {}),
      changedWork: PosseEngine.government !== null && !openingStructure(PosseEngine.government),
    };
    /** @param {Record<string, string>} picks */
    const read = picks => {
      const known = Object.entries(picks).map(([seat, key]) => [
        seat,
        key,
        people[key]?.name,
        people[key]?.party,
      ]);
      const key = JSON.stringify([president, structure, known]);
      let result = cache.get(key);
      if (!result) {
        result = previewPosse(president, picks, people, structure);
        if (cache.size >= 512) cache.clear();
        cache.set(key, result);
      }
      return result;
    };
    return {
      /** @param {Record<string, string>} picks */
      use(picks) {
        const result = read(picks);
        PosseEngine.current = result;
        return result;
      },
      /** @param {Record<string, string>} picks */
      support(picks) {
        const result = read(picks);
        return result.status === "estimated" ? result.support : null;
      },
      /** @param {Record<string, string>} picks */
      capture(picks) {
        PosseEngine.snapshot = readPosse(president, picks, people, structure);
      },
    };
  },
  /** @param {string} legacyParty @param {number} index @param {number} chance */
  deputy(legacyParty, index, chance) {
    const party = PARTY_IDS[legacyParty];
    if (!party) return 0;
    const key = `${party}:${chance}`;
    let list = deputies.get(key);
    if (!list) {
      list = [];
      deputies.set(key, list);
    }
    let value = list[index];
    if (value === undefined) {
      value = posseDeputyOf(party, index, chance, DEFAULT_SEED);
      list[index] = value;
    }
    return value;
  },
  /** @param {import("./structure.mjs").StructureState} state @param {Readonly<Record<string, string>>} labels */
  structure(state, labels) {
    const result = structureOf(state, labels);
    PosseEngine.government = result;
    return result;
  },
  merge: mergeStructure,
  split: splitStructure,
  parts: structureParts,
  weight: structureWeight,
  abolish: abolishStructure,
  restore: restoreStructure,
  create: createStructure,
  transfer: transferStructure,
  rename: renameStructure,
  cancelCreation,
  works: searchWork,
  destinations: searchDestinations,
  partyIds: PARTY_IDS,
};

Reflect.set(globalThis, "PosseEngine", PosseEngine);
const runtime = document.createElement("script");
runtime.src = new URL("../../" + POSSE_FILES.runtime, import.meta.url).href;
document.head.append(runtime);
