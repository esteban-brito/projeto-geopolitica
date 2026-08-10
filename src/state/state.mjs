/* ESTADO — imutavel, e um reducer puro como unica forma de muda-lo.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE IMUTAVEL. Num jogo de turnos, quatro coisas caem de graca quando o
   estado nunca e mutado no lugar:

     · SAVE e serializar o estado. Nao existe "campo que ficou de fora";
     · REPLAY determinstico: mesma seed, mesmas acoes, mesmo resultado;
     · RENDER POR IDENTIDADE: `anterior.approval === atual.approval` significa
       "esta parte da tela nao mudou". E reatividade correta sem framework e sem
       biblioteca de sinais — mas so funciona porque o objeto e novo quando, e
       somente quando, o conteudo mudou;
     · TESTE de um turno sem UI nenhuma.

   O congelamento e permanente, e nao so em desenvolvimento: o estado e pequeno,
   o custo e desprezivel, e uma mutacao acidental que so falha em producao e
   exatamente o defeito que isto existe para impedir. */

/**
 * @typedef {"crisis" | "stable" | "growth"} Situation
 *
 * @typedef {object} Approval
 * @property {number} good - "otimo/bom", em pontos percentuais
 * @property {number} fair - "regular"
 * @property {number} poor - "ruim/pessimo"
 *
 * @typedef {object} GameState
 * @property {number} schemaVersion - versao do formato do save
 * @property {number} month - meses decorridos desde a posse (0 = janeiro do ano 1)
 * @property {Approval} approval
 * @property {Situation} situation
 */

/** Versao do save. Toda mudanca de forma exige uma migracao explicita. */
export const SCHEMA_VERSION = 1;

/**
 * Congela em profundidade. O estado e uma arvore rasa de objetos simples.
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
function deepFreeze(value) {
  if (value === null || typeof value !== "object") return value;
  for (const key of Object.keys(value)) {
    deepFreeze(/** @type {Record<string, unknown>} */ (value)[key]);
  }
  return Object.freeze(value);
}

/**
 * O estado de abertura.
 *
 * ⚠ OS NUMEROS SAO ANDAIME, nao calibracao. Eles existem para a tela de
 * referencia ter o que mostrar e serao substituidos pelo catalogo real quando
 * SONDA e CORRENTE nascerem. Nenhum deles cita fonte porque nenhum deles e
 * afirmacao sobre o Brasil — e essa e a diferenca entre um numero provisorio
 * declarado e um numero inventado que vira dividia silenciosa.
 *
 * @returns {GameState}
 */
export function createState() {
  return deepFreeze({
    schemaVersion: SCHEMA_VERSION,
    month: 2,
    approval: { good: 31, fair: 34, poor: 35 },
    situation: /** @type {Situation} */ ("stable"),
  });
}

/**
 * @typedef {{ type: "advanceMonth" }} Action
 */

/**
 * A UNICA forma de produzir um estado novo.
 *
 * ⚠ A transicao aqui e ANDAIME e nao pertence a nenhum motor: ela e uma funcao
 * deterministica sem RNG, escrita para a tela mudar quando o botao e apertado.
 * Quando CASCATA, CORRENTE e SONDA existirem, este corpo sai inteiro e a
 * assinatura permanece — que e o ponto de fixar a fronteira antes do conteudo.
 *
 * @param {GameState} state
 * @param {Action} action
 * @returns {GameState}
 */
export function reduce(state, action) {
  switch (action.type) {
    case "advanceMonth": {
      const month = state.month + 1;
      /* Oscilacao deterministica: sobe tres meses, desce dois. Serve para a
         tela exercitar as tres situacoes sem inventar um modelo. */
      const swing = month % 5 < 3 ? 2 : -3;
      const good = clamp(state.approval.good + swing, 5, 80);
      const poor = clamp(state.approval.poor - swing, 5, 80);
      const fair = 100 - good - poor;
      return deepFreeze({
        ...state,
        month,
        approval: { good, fair, poor },
        situation: situationFor(good, poor),
      });
    }
    default:
      return state;
  }
}

/**
 * @param {number} good
 * @param {number} poor
 * @returns {Situation}
 */
function situationFor(good, poor) {
  if (good - poor >= 8) return "growth";
  if (poor - good >= 8) return "crisis";
  return "stable";
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Rotulo do mes de calendario a partir do numero de meses desde a posse.
 * @param {number} month
 */
export function monthLabel(month) {
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
  const name = names[month % 12] ?? "jan";
  const year = 2027 + Math.floor(month / 12);
  return `${name} · ${year}`;
}
