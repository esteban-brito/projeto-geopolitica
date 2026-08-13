/* O REGIME — as regras da CASA, e nao as do governo.
   ══════════════════════════════════════════════════════════════════════════════

   Quantas cadeiras tem a Camara, quantos votos fazem maioria, quanto dura um
   mandato e quantos meses tem um ano. Sao as unicas regras do jogo que o jogador
   nao escolhe: elas o precedem.

   ── POR QUE ELAS VIRARAM DADO, E AGORA ──────────────────────────────────────
   Porque um dia elas vao deixar de preceder. O norte declarado do projeto e
   criatividade sem limite artificial — jogada monarquista, jogada anarquista,
   Constituinte —, e nenhuma dessas jogadas existe enquanto "513" e "48" forem
   numeros digitados dentro de tres arquivos diferentes. Reunidos aqui, torna-los
   mutaveis passa a ser uma sessao de trabalho; espalhados, seria uma refundacao.

   Isso NAO significa que eles ja sao mutaveis. Hoje sao constantes de dado, com
   esquema e validacao como qualquer outro dado do catalogo. O que mudou e o
   endereco — e endereco unico e a diferenca entre poder mudar e ter de procurar.

   ── AS MAIORIAS SAO DERIVADAS, e nao declaradas ─────────────────────────────
   Elas saem de `seats` por regra. Declaradas como numero solto, um ajuste no
   tamanho da Camara deixaria duas maiorias apontando para um plenario que nao
   existe mais — e o sintoma seria uma PEC passando com menos de tres quintos,
   que nenhuma tela denuncia. */

/**
 * @typedef {object} Regime
 * @property {number} seats - o tamanho do plenario
 * @property {number} qualifiedShare - a fracao que faz maioria qualificada
 * @property {number} monthsPerTerm - a duracao do mandato, em meses
 * @property {number} monthsPerYear - quantos meses fecham um exercicio
 * @property {number} firstYear - o ano civil em que a posse acontece
 */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const REGIME_SCHEMA = {
  seats: { kind: "number", min: 1, max: 2000 },
  qualifiedShare: { kind: "number", min: 0.5, max: 1 },
  monthsPerTerm: { kind: "number", min: 1, max: 240 },
  monthsPerYear: { kind: "number", min: 1, max: 24 },
  firstYear: { kind: "number", min: 1900, max: 2999 },
};

/** @type {Regime} */
export const REGIME = {
  seats: 513,
  qualifiedShare: 3 / 5,
  monthsPerTerm: 48,
  monthsPerYear: 12,
  firstYear: 2027,
};

/** O total de cadeiras da Camara dos Deputados. */
export const SEATS = REGIME.seats;

/** Votos necessarios para maioria simples, com o plenario cheio. */
export const SIMPLE_MAJORITY = Math.floor(SEATS / 2) + 1;

/* MAIORIA QUALIFICADA E OUTRO JOGO, e a diferenca nao e de grau.
   Duas bancadas grandes somam maioria simples com folga — esquerda mais centrao
   dao 313, centrao mais direita liberal dao 309. O que nenhuma dupla consegue e
   ENTREGAR 308, porque adesao de bancada nunca e integral nem com verba cheia e
   lealdade cheia. Quem confundir as duas coisas vai concluir que uma dupla
   basta, e vai calibrar o jogo errado. */
export const QUALIFIED_MAJORITY = Math.ceil(SEATS * REGIME.qualifiedShare);

/** Quantos meses cabem num mandato. */
export const MONTHS_PER_TERM = REGIME.monthsPerTerm;

/** Quantos meses fecham um exercicio fiscal. */
export const MONTHS_PER_YEAR = REGIME.monthsPerYear;
