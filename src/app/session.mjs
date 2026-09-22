/* A SESSAO — o que o navegador guarda entre pinturas, e a persistencia dele. */

import { createState } from "../state/state.mjs";
import { deserialize, serialize } from "../state/save.mjs";
import { CATALOG, bandsOf } from "../public/index.mjs";

/** @typedef {import("../state/state.mjs").GameState} GameState */
/** @typedef {import("../public/index.mjs").Report} Report */

/* Teto unificado: a soma repetida divergia a barra (7,5%) de Financas (4,5%). */
export const INFLATION_CEILING = CATALOG.macro.inflationTarget + CATALOG.macro.inflationTolerance;

/* Armazenamento em try: aba anonima e cota estourada nao podem travar a abertura. */
const SAVE_KEY = "republica-simulator:partida";
const REFUSED_KEY = "republica-simulator:partida-recusada";

/* Interface tem chave propria: incluir leitura no GameState exigiria bump de esquema. */
const UI_KEY = "republica-simulator:interface";

/* Rascunho preserva decisoes do mes apos recarregamento sem alterar esquema do save. */
const DRAFT_KEY = "republica-simulator:rascunho";

/** @returns {{ seen: string[], open: string | null }} */
function resumeSeen() {
  try {
    const text = window.localStorage.getItem(UI_KEY);
    if (text === null) return { seen: [], open: null };
    const saved = JSON.parse(text);
    /* Filtra por tipo: dado corrompido ou surpresa reinicia sem travar. */
    return {
      seen: Array.isArray(saved?.seen)
        ? saved.seen.filter((/** @type {unknown} */ id) => typeof id === "string")
        : [],
      open: typeof saved?.open === "string" ? saved.open : null,
    };
  } catch {
    return { seen: [], open: null };
  }
}

export function persistSeen() {
  try {
    window.localStorage.setItem(
      UI_KEY,
      JSON.stringify({ seen: [...session.readMail], open: session.openDispatch }),
    );
  } catch {}
}

export function persist() {
  try {
    window.localStorage.setItem(SAVE_KEY, serialize(session.state));
  } catch {}
}

/** @returns {{ state: GameState, refused: boolean }} */
function resume() {
  let text = null;
  try {
    text = window.localStorage.getItem(SAVE_KEY);
  } catch {
    return { state: createState(), refused: false };
  }
  if (!text) return { state: createState(), refused: false };

  const read = deserialize(text);
  if (read.ok) return { state: read.state, refused: false };

  /* Save recusado preserva a chave para conversao futura em vez de apagar. */
  try {
    window.localStorage.setItem(REFUSED_KEY, text);
    window.localStorage.removeItem(SAVE_KEY);
  } catch {}
  return { state: createState(), refused: true };
}

export const opening = resume();
const lembrado = resumeSeen();

/**
 * @param {number} month
 * @returns {ReturnType<typeof blankOrders> | null}
 */
export function resumeDraft(month) {
  try {
    const text = window.localStorage.getItem(DRAFT_KEY);
    if (!text) return null;
    const read = JSON.parse(text);
    if (!read || typeof read !== "object" || read.month !== month) return null;

    const draft = blankOrders();
    const numbers = (/** @type {unknown} */ from, /** @type {Record<string, number>} */ into) => {
      if (!from || typeof from !== "object") return;
      for (const [key, value] of Object.entries(from)) {
        if (typeof value === "number" && Number.isFinite(value) && key in into) into[key] = value;
      }
    };
    numbers(read.orders?.funding, draft.funding);
    numbers(read.orders?.levels, draft.levels);
    for (const [key, value] of Object.entries(read.orders?.mail ?? {})) {
      if (typeof value === "string") draft.mail[key] = value;
    }
    /* Discurso de posse atravessa recarregamento junto com as decisoes de carta. */
    for (const [key, value] of Object.entries(read.orders?.platform ?? {})) {
      if (typeof value === "string") draft.platform[key] = value;
    }
    /* Validacao da area pertence ao turno para evitar duas regras divergentes. */
    if (Array.isArray(read.orders?.protect)) {
      draft.protect = read.orders.protect.filter(
        (/** @type {unknown} */ id) => typeof id === "string",
      );
    }
    for (const [key, value] of Object.entries(read.orders?.bands ?? {})) {
      const band = draft.bands[key];
      if (!band || !value || typeof value !== "object") continue;
      for (const side of ["floor", "ceiling"]) {
        const edge = /** @type {Record<string, unknown>} */ (value)[side];
        if (typeof edge === "number" && Number.isFinite(edge)) {
          /** @type {Record<string, number>} */ (band)[side] = edge;
        }
      }
    }
    return draft;
  } catch {
    return null;
  }
}

export function persistDraft() {
  try {
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ month: session.state.month, orders: session.orders }),
    );
  } catch {}
}

/* Niveis nascem nos vigentes para manter o Estado caso o jogador nao mexa nos seletores. */
export function blankOrders() {
  return {
    /** @type {Record<string, number>} */
    funding: Object.fromEntries(CATALOG.parties.map(party => [party.id, 0])),
    /* Respostas vazias representam silencio formal; prazo encerra aceitando. */
    /** @type {Record<string, string>} */
    mail: {},
    /* Plataforma e imutavel apos a posse; avancar calado governa sem plataforma. */
    /** @type {Record<string, string>} */
    platform: {},
    /* Decreto morre com o mes: contingenciamento nao se perpetua sem renovacao (Achado 36). */
    /** @type {string[]} */
    protect: [],
    /** @type {Record<string, number>} */
    levels: { ...session.state.levels },
    /* Leis nascem das bandas vigentes avaliadas pelo motor com gatilhos e prazos. */
    /** @type {Record<string, import("../state/state.mjs").Band>} */
    bands: Object.fromEntries(
      Object.entries(bandsOf(session.state, CATALOG)).map(([id, band]) => [id, { ...band }]),
    ),
  };
}

/* Consulta dinamica ao motor evita ler copia desatualizada no mes de ativacao de gatilho. */
export function lawNow() {
  return bandsOf(session.state, CATALOG);
}

/**
 * @typedef {object} SessionState
 * @property {GameState} state
 * @property {string} screen
 * @property {ReturnType<typeof blankOrders>} orders
 * @property {string | null} openDispatch
 * @property {Set<string>} readMail
 * @property {{ report: Report, quorum: number, loyaltyBefore: Record<string, number>, indexBefore: Record<string, number>, adviser: { name: string, office: string, label: string, reach: number, gender?: "f" | "m" } | null } | null} last
 * @property {GameState | null} painted
 * @property {GameState | null} framed
 * @property {{ level: string, reason: string, base: number } | null} standing
 * @property {boolean} resolving
 */

/** @type {SessionState} */
export const session = {
  state: opening.state,
  screen: "cabinet",
  orders: /** @type {ReturnType<typeof blankOrders>} */ ({}),
  openDispatch: null,
  readMail: new Set(lembrado.seen),
  last: null,
  painted: null,
  framed: null,
  standing: null,
  resolving: false,
};
session.orders = resumeDraft(session.state.month) ?? blankOrders();
session.openDispatch = lembrado.open ?? session.state.mail[0]?.id ?? null;
