/* SAVE — o estado inteiro vira texto, e volta identico.
   ══════════════════════════════════════════════════════════════════════════════

   O cabecalho de `state.mjs` promete isto desde o primeiro dia: "SAVE e
   serializar o estado. Nao existe campo que ficou de fora". Promessa que
   ninguem executa e comentario, entao aqui ela vira funcao e a suite a cobra.

   ELE E BARATO AGORA E CARO DEPOIS. O estado tem sete campos; escrever a
   serializacao e a migracao com sete campos custa este arquivo. Com sete
   motores dentro dele, custa uma sessao — e a migracao teria de ser inventada
   para um formato que ja existe no disco de alguem.

   ── POR QUE A VERSAO E CONFERIDA, E NAO ADIVINHADA ───────────────────────────
   Um save da versao 1 nao tem semente nem fluxos. Carrega-lo "na marra" produz
   um jogo que PARECE funcionar ate o primeiro sorteio, e ai quebra num lugar que
   nao tem relacao nenhuma com a causa. Formato incompativel e recusa explicita:
   melhor um erro no ato de carregar que um defeito tres telas adiante.

   ── O QUE ELE NAO FAZ, e agora com um caso concreto ──────────────────────────
   Nao migra, e a versao 3 ja existe: um save da 2 e RECUSADO em vez de
   convertido. A decisao se sustenta enquanto ninguem tiver uma partida em
   disco — o projeto nunca foi publicado, entao o unico save da versao 2 do mundo
   e um que alguem gerou testando. No dia em que houver jogador, a migracao entra
   aqui como funcao declarada por par de versoes, e nao como um `if` espalhado.
   O que NAO pode acontecer e a recusa virar conversao silenciosa: um save da 2
   nao tem lealdade nem posicao orcamentaria, e completa-lo com zeros abriria a
   partida com o Congresso inteiro em ruptura — um estado de jogo valido, e por
   isso indistinguivel de um defeito. */

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

  /* ⚠ A LISTA E DE CAMPOS QUE NAO TEM SUBSTITUTO, e `norms` entrou nela no dia em
     que as faixas viraram texto. Sem `levels` o jogo nao sabe quanto o pais gasta;
     sem `norms` ele nao sabe o que a lei manda gastar — e a segunda ausencia e
     pior que a primeira, porque ausencia de norma e ausencia de restricao: o save
     abriria com a Constituicao inteira revogada, que e um pais valido e portanto
     indistinguivel de um save quebrado. */
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
