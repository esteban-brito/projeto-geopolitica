/* SAVE — o estado inteiro vira texto, e volta identico.
   ══════════════════════════════════════════════════════════════════════════════

   O cabecalho de `state.mjs` promete isto desde o primeiro dia: "SAVE e
   serializar o estado. Nao existe campo que ficou de fora". Promessa que
   ninguem executa e comentario, entao aqui ela vira funcao e a suite a cobra.

   ELE E BARATO AGORA E CARO DEPOIS. O estado tem cinco campos; escrever a
   serializacao e a migracao com cinco campos custa este arquivo. Com sete
   motores dentro dele, custa uma sessao — e a migracao teria de ser inventada
   para um formato que ja existe no disco de alguem.

   ── POR QUE A VERSAO E CONFERIDA, E NAO ADIVINHADA ───────────────────────────
   Um save da versao 1 nao tem semente nem fluxos. Carrega-lo "na marra" produz
   um jogo que PARECE funcionar ate o primeiro sorteio, e ai quebra num lugar que
   nao tem relacao nenhuma com a causa. Formato incompativel e recusa explicita:
   melhor um erro no ato de carregar que um defeito tres telas adiante.

   ── O QUE ELE NAO FAZ ────────────────────────────────────────────────────────
   Nao migra. Quando a versao 3 existir, a migracao da 2 para a 3 entra aqui como
   funcao declarada, e nao como um `if` espalhado. Enquanto nao ha o que migrar,
   escrever o mecanismo seria inventar forma para um problema que ainda nao tem
   formato conhecido. */

import { SCHEMA_VERSION } from "./state.mjs";

/** @typedef {import("./state.mjs").GameState} GameState */

/**
 * @typedef {{ ok: true, state: GameState }} Loaded
 * @typedef {{ ok: false, reason: string }} Refused
 */

/**
 * Escreve o estado como texto.
 *
 * Sem indentacao e sem reordenar chaves: o save nao e para ler a olho, e
 * `JSON.stringify` ja percorre o objeto inteiro — o que garante que nenhum campo
 * fica de fora nao e esta funcao, e o estado ser uma arvore de dados simples.
 *
 * @param {GameState} state
 * @returns {string}
 */
export function serialize(state) {
  return JSON.stringify(state);
}

/**
 * Lê um save. Devolve o motivo em vez de lancar, porque carregar arquivo
 * escolhido por outra pessoa e uma operacao que falha por rotina — e quem chama
 * precisa mostrar o motivo, nao morrer.
 *
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

  for (const field of ["seed", "month", "approval", "situation", "streams"]) {
    if (candidate[field] === undefined) {
      return { ok: false, reason: `o save nao tem o campo "${field}"` };
    }
  }

  return { ok: true, state: /** @type {GameState} */ (parsed) };
}
