/* O REGIME — as regras da CASA, e nao as do governo. */

/**
 * @typedef {object} Regime
 * @property {number} seats - o tamanho do plenario
 * @property {number} qualifiedShare - a fracao que faz maioria qualificada
 * @property {number} removalShare - a fracao que autoriza o afastamento do presidente
 * @property {number} monthsPerTerm - a duracao do mandato, em meses
 * @property {number} monthsPerYear - quantos meses fecham um exercicio
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
  /* DOIS TERCOS DA CAMARA AUTORIZAM O PROCESSO contra o presidente — CF art. */
  removalShare: 2 / 3,
  monthsPerTerm: 48,
  monthsPerYear: 12,
  firstYear: 2027,
};

/** O total de cadeiras da Camara dos Deputados. */
export const SEATS = REGIME.seats;

/** Votos necessarios para maioria simples, com o plenario cheio. */
export const SIMPLE_MAJORITY = Math.floor(SEATS / 2) + 1;

/* MAIORIA QUALIFICADA E OUTRO JOGO, e a diferenca nao e de grau. */
export const QUALIFIED_MAJORITY = Math.ceil(SEATS * REGIME.qualifiedShare);

/* QUANTAS ASSINATURAS AFASTAM UM PRESIDENTE. 342 em 513. */
export const REMOVAL_MAJORITY = Math.ceil(SEATS * REGIME.removalShare);

/** Quantos meses cabem num mandato. */
export const MONTHS_PER_TERM = REGIME.monthsPerTerm;

/** Quantos meses fecham um exercicio fiscal. */
export const MONTHS_PER_YEAR = REGIME.monthsPerYear;
