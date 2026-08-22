/* Formato incompativel e recusa explicita: melhor um erro no ato de carregar que um defeito
   tres telas adiante. */

import { SCHEMA_VERSION } from "./state.mjs";

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
  ];

  for (const field of required) {
    if (candidate[field] === undefined) {
      return { ok: false, reason: `o save nao tem o campo "${field}"` };
    }
  }

  return { ok: true, state: /** @type {GameState} */ (parsed) };
}
