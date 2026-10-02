/* O REGIME — as regras da CASA, e não as do governo. */

/**
 * @typedef {object} Regime
 * @property {number} seats - o tamanho do plenário
 * @property {number} qualifiedShare - a fração que faz maioria qualificada
 * @property {number} removalShare - a fração que autoriza o afastamento do presidente
 * @property {number} monthsPerTerm - a duração do mandato, em meses
 * @property {number} monthsPerYear - quantos meses fecham um exercício
 * @property {number} firstYear - o ano civil em que a posse acontece
 */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const REGIME_SCHEMA = {
  seats: { kind: "number", min: 1, max: 2000 },
  qualifiedShare: { kind: "number", min: 0.5, max: 1 },
  removalShare: { kind: "number", min: 0.5, max: 1 },
  monthsPerTerm: { kind: "number", min: 1, max: 240 },
  monthsPerYear: { kind: "number", min: 1, max: 24 },
  firstYear: { kind: "number", min: 1900, max: 2999 },
};

/** @type {Regime} */
export const REGIME = {
  seats: 513,
  qualifiedShare: 3 / 5,
  /* DOIS TERÇOS DA CÂMARA AUTORIZAM O PROCESSO contra o presidente — CF art. */
  removalShare: 2 / 3,
  monthsPerTerm: 48,
  monthsPerYear: 12,
  firstYear: 2027,
};

/** O total de cadeiras da Câmara dos Deputados. */
export const SEATS = REGIME.seats;

/** Votos necessários para maioria simples, com o plenário cheio. */
export const SIMPLE_MAJORITY = Math.floor(SEATS / 2) + 1;

/* MAIORIA QUALIFICADA É OUTRO JOGO, e a diferença não é de grau. */
export const QUALIFIED_MAJORITY = Math.ceil(SEATS * REGIME.qualifiedShare);

/* QUANTAS ASSINATURAS AFASTAM UM PRESIDENTE. 342 em 513. */
export const REMOVAL_MAJORITY = Math.ceil(SEATS * REGIME.removalShare);

/** Quantos meses cabem num mandato. */
export const MONTHS_PER_TERM = REGIME.monthsPerTerm;

/** Quantos meses fecham um exercício fiscal. */
export const MONTHS_PER_YEAR = REGIME.monthsPerYear;
