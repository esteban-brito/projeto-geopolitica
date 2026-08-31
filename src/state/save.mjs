/* SAVE — o estado inteiro vira texto, e volta identico.
   O cabecalho de `state.mjs` promete isto desde o primeiro dia: "SAVE e serializar o estado.
   Nao existe campo que ficou de fora". */

import { SCHEMA_VERSION, deepFreeze } from "./state.mjs";

/** @typedef {import("./state.mjs").GameState} GameState */

/**
 * @typedef {{ ok: true, state: GameState }} Loaded
 * @typedef {{ ok: false, reason: string }} Refused
 */

/**
 * Escreve o estado como texto.
 *
 * @param {GameState} state
 * @returns {string}
 */
export function serialize(state) {
  return JSON.stringify(state);
}

/**
 * @param {string} text
 * @returns {Loaded | Refused}
 */
export function deserialize(text) {
  /** @type {unknown} */
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: "o arquivo nao e um save valido" };
  }

  if (parsed === null || typeof parsed !== "object") {
    return { ok: false, reason: "o save nao contem um estado" };
  }

  const candidate = /** @type {Record<string, unknown>} */ (parsed);
  const version = candidate["schemaVersion"];

  if (version !== SCHEMA_VERSION) {
    return {
      ok: false,
      reason: `o save e da versao ${String(version)} e esta partida lê a versao ${SCHEMA_VERSION}`,
    };
  }

  /* Sem `levels` o jogo nao sabe quanto o pais gasta; sem `norms` ele nao sabe o que a lei
     manda gastar — e a segunda ausencia e pior que a primeira, porque ausencia de norma e
     ausencia de restricao: o save abriria com a Constituicao inteira revogada, que e um pais
     valido e portanto indistinguivel de um save quebrado. */
  const required = [
    "seed",
    "platform",
    "month",
    "mood",
    "loyalty",
    "fiscal",
    "macro",
    "capacity",
    "levels",
    "norms",
    "memory",
    "streams",
    "series",
    "months",
    "bills",
    "mail",
    "pressure",
    "impeachment",
    "fallen",
  ];

  for (const field of required) {
    if (candidate[field] === undefined) {
      return { ok: false, reason: `o save nao tem o campo "${field}"` };
    }
  }

  /* ⚅ CHECAGEM DE FORMA — presenca nao e formato. Um save corrompido com `"fiscal": 42`
     passaria acima e quebraria em runtime com mensagem incompreensivel. */
  const asObj = (/** @type {unknown} */ v) =>
    v !== null && typeof v === "object" && !Array.isArray(v);
  const asArr = (/** @type {unknown} */ v) => Array.isArray(v);

  const shape = [
    ["platform", asObj, "objeto"],
    ["fiscal", asObj, "objeto"],
    ["macro", asObj, "objeto"],
    ["capacity", asObj, "objeto"],
    ["streams", asObj, "objeto"],
    ["series", asObj, "objeto"],
    ["mail", asArr, "array"],
    ["bills", asArr, "array"],
    ["norms", asArr, "array"],
  ];

  for (const entry of shape) {
    const field = /** @type {string} */ (entry[0]);
    const test = /** @type {(v: unknown) => boolean} */ (entry[1]);
    const expected = /** @type {string} */ (entry[2]);
    if (!test(candidate[field])) {
      return { ok: false, reason: `"${field}" deveria ser ${expected}` };
    }
  }

  return { ok: true, state: deepFreeze(/** @type {GameState} */ (parsed)) };
}
