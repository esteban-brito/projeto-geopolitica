import { CATALOG } from "../data/catalog.mjs";
import { baseCount, chanceTargets, deputyChances, firmCount } from "../domain/congress/index.mjs";
import { coalitionOf } from "./cabinet.mjs";

/** @typedef {Pick<import("../state/state.mjs").GameState, "seed" | "party" | "cabinet">} Opening */

/** @param {Opening} opening @param {typeof CATALOG} [catalog] */
export function posseOf(opening, catalog = CATALOG) {
  const served = coalitionOf(opening.cabinet ?? {}, catalog);
  const loyalty = chanceTargets({
    parties: catalog.parties,
    ruling: opening.party ?? null,
    served,
  });
  const input = { parties: catalog.parties, loyalty, seed: opening.seed };
  const deputies = deputyChances(input);
  let offset = 0;
  const parties = catalog.parties.map(party => {
    const chances = deputies.slice(offset, offset + party.seats);
    offset += party.seats;
    return {
      id: party.id,
      chance: (loyalty[party.id] ?? 0) / 100,
      share: served[party.id] ?? 0,
      expected: (party.seats * (loyalty[party.id] ?? 0)) / 100,
      firm: firmCount({ parties: [party], loyalty, seed: opening.seed }),
      deputies: chances,
    };
  });
  return {
    kind: /** @type {const} */ ("structural"),
    firm: firmCount(input),
    probable: baseCount(input),
    parties,
  };
}

/** @param {string} party @param {number} index @param {number} chance @param {number} seed */
export function posseDeputyOf(party, index, chance, seed) {
  const bloc = CATALOG.parties.find(item => item.id === party);
  if (
    !bloc ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= bloc.seats ||
    !Number.isFinite(chance) ||
    chance < 0 ||
    chance > 1
  )
    throw new Error("deputado ou estimativa inválida");
  return deputyChances({ parties: [bloc], loyalty: { [party]: chance * 100 }, seed })[index] ?? 0;
}
