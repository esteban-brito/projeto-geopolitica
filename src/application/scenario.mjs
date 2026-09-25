/* O ENSAIO — um começo de partida pronto para testar um Momento, feito só com as regras do jogo.
   O perfil do E0 (ciclo 31): o plano de janeiro vale o ano, e as emendas de manutenção são
   refeitas todo mês. É o jogador da medição, e não um destino: outro jogador chega a outro mês.
   As contas são as da sonda `agenda` de `tools/simulate.mjs`, que a medição reproduziu. */

import { CATALOG } from "../data/catalog.mjs";
import { createState } from "../state/state.mjs";
import { spendOf } from "./agenda.mjs";
import { calendarOf } from "./calendar.mjs";
import { costOf, discretionaryRoom, governmentOf, playMonth } from "./turn.mjs";

/** @typedef {import("../state/state.mjs").GameState} GameState */

/* A emenda de manutenção das sondas: 1,5 ponto de verba por ano. Parâmetro de design, sem fonte. */
export const UPKEEP = 1.5 / 12;

/** @param {number} level @param {typeof CATALOG} catalog */
function everyone(level, catalog) {
  return Object.fromEntries(catalog.parties.map(party => [party.id, level]));
}

/**
 * As emendas de manutenção que cabem no espaço do mês.
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function upkeepOf(state, catalog = CATALOG) {
  const full = costOf(everyone(1, catalog), catalog.parties, catalog.fiscal.seatPrice);
  const level = full <= 0 ? 0 : Math.min(1, discretionaryRoom(state, catalog) / full);
  return everyone(Math.max(0, Math.min(UPKEEP, level)), catalog);
}

/**
 * O plano de janeiro: os níveis de hoje encolhidos até caberem no espaço, com a reserva da
 * emenda de manutenção. Nenhum nível desce abaixo do piso.
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {Record<string, number>}
 */
export function planOf(state, catalog = CATALOG) {
  const reserve = costOf(everyone(UPKEEP, catalog), catalog.parties, catalog.fiscal.seatPrice);
  const room = Math.max(0, discretionaryRoom(state, catalog) - reserve);
  /** @param {number} share */
  const squeeze = share =>
    Object.fromEntries(
      catalog.programs.map(program => {
        const level = state.levels[program.id] ?? program.initial;
        return [program.id, program.floor + Math.max(0, level - program.floor) * share];
      }),
    );
  let low = 0;
  let high = 1;
  for (let step = 0; step < 20; step++) {
    const mid = (low + high) / 2;
    if (spendOf({ programs: catalog.programs, levels: squeeze(mid) }).total > room) high = mid;
    else low = mid;
  }
  return squeeze(low);
}

/**
 * A partida do ensaio no mês pedido, jogada pelo perfil do E0 desde a posse.
 * @param {number} seed
 * @param {number} [until]
 * @param {typeof CATALOG} [catalog]
 * @returns {GameState}
 */
export function rehearsal(seed, until = 21, catalog = CATALOG) {
  const drawn = governmentOf(createState(seed, catalog), catalog).president.name;
  const first = drawn.split(" ")[0] ?? "";
  let state = createState(seed, catalog, {
    name: drawn,
    treatment: catalog.genderOf.get(first) === "f" ? "senhora" : "senhor",
  });
  /** @type {Record<string, number> | null} */
  let plan = null;
  while (state.month < until) {
    if (plan === null || calendarOf(state.month).now.some(landmark => landmark.id === "minimo")) {
      plan = planOf(state, catalog);
    }
    state = playMonth(
      state,
      { levels: plan, funding: upkeepOf(state, catalog) },
      { catalog },
    ).state;
  }
  return state;
}
