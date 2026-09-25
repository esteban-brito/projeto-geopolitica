/* A COALIZÃO — o quanto cada partido está servido pelas pastas que recebeu. Toda cadeira pesa
   igual, e a régua é a bancada: receber pastas na proporção das cadeiras satisfaz por inteiro. */

import { CATALOG } from "../data/catalog.mjs";
import { SEATS } from "../data/regime.mjs";

/**
 * @param {Record<string, { id: string, name: string, party: string | null }>} cabinet
 * @param {typeof CATALOG} [catalog]
 * @returns {Record<string, number>} por partido, de 0 a 1; partido sem pasta fica de fora
 */
export function coalitionOf(cabinet, catalog = CATALOG) {
  /** @type {Record<string, number>} */
  const held = {};
  for (const appointee of Object.values(cabinet)) {
    if (appointee.party !== null) held[appointee.party] = (held[appointee.party] ?? 0) + 1;
  }
  /** @type {Record<string, number>} */
  const served = {};
  for (const party of catalog.parties) {
    const count = held[party.id] ?? 0;
    if (count === 0 || party.seats === 0) continue;
    served[party.id] = Math.min(1, count / catalog.cabinet.length / (party.seats / SEATS));
  }
  return served;
}
