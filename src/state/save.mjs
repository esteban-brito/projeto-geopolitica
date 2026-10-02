/* SAVE — o estado inteiro vira texto, e volta idêntico.
   O cabeçalho de `state.mjs` promete isto desde o primeiro dia: "SAVE é serializar o estado.
   Não existe campo que ficou de fora". */

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

  /* Sem `levels` o jogo não sabe quanto o país gasta; sem `norms` ele não sabe o que a lei
     manda gastar — e a segunda ausência é pior que a primeira, porque ausência de norma é
     ausência de restrição: o save abriria com a Constituição inteira revogada, que é um país
     válido e portanto indistinguível de um save quebrado. */
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

  /* ⚅ CHECAGEM DE FORMA — presença não é formato. Um save corrompido com `"fiscal": 42`
     passaria acima e quebraria em runtime com mensagem incompreensível. */
  const asObj = (/** @type {unknown} */ v) =>
    v !== null && typeof v === "object" && !Array.isArray(v);
  const asArr = (/** @type {unknown} */ v) => Array.isArray(v);
  const asNum = (/** @type {unknown} */ v) => typeof v === "number" && Number.isFinite(v);
  const asMonth = (/** @type {unknown} */ v) => v === null || asNum(v);

  /* Os 18 campos, e não só os 9 de estrutura: `"mood": null` passava e quebrava no primeiro
     `pollFrom`. */
  const shape = [
    ["seed", asNum, "numero"],
    ["month", asNum, "numero"],
    ["platform", asObj, "objeto"],
    ["mood", asObj, "objeto"],
    ["loyalty", asObj, "objeto"],
    ["fiscal", asObj, "objeto"],
    ["macro", asObj, "objeto"],
    ["capacity", asObj, "objeto"],
    ["levels", asObj, "objeto"],
    ["memory", asObj, "objeto"],
    ["streams", asObj, "objeto"],
    ["series", asObj, "objeto"],
    ["pressure", asObj, "objeto"],
    ["mail", asArr, "array"],
    ["bills", asArr, "array"],
    ["norms", asArr, "array"],
    ["months", asArr, "array"],
    ["impeachment", asMonth, "numero ou null"],
    ["fallen", asMonth, "numero ou null"],
  ];
  /* Fora dos obrigatórios, como o partido: um save anterior ao decreto abre sem ele. */
  if (candidate["decree"] !== undefined && !asArr(candidate["decree"])) {
    return { ok: false, reason: `"decree" deveria ser array` };
  }

  /* Fora dos obrigatórios, como o decreto: um save anterior ao gabinete abre vazio. */
  const cabinet = candidate["cabinet"];
  const named = (/** @type {unknown} */ seat) => {
    if (!asObj(seat)) return false;
    const { id, name, party } = /** @type {Record<string, unknown>} */ (seat);
    return (
      typeof id === "string" &&
      typeof name === "string" &&
      (party === null || typeof party === "string")
    );
  };
  if (
    cabinet !== undefined &&
    !(asObj(cabinet) && Object.values(/** @type {object} */ (cabinet)).every(named))
  ) {
    return { ok: false, reason: `"cabinet" deveria ser objeto de nomeados` };
  }

  if (candidate["agents"] !== undefined && !asObj(candidate["agents"])) {
    return { ok: false, reason: `"agents" deveria ser objeto` };
  }

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
