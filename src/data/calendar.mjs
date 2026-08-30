/* O CALENDARIO — a forma do ano fiscal brasileiro, e ela e a mesma todo ano.
   ⚠ ELE E A PRIMEIRA DATA DO JOGO, e por isso nao ha relogio aqui: cada marco diz em QUE MES
   DO ANO ele cai, de 1 a 12, e quem cruza isso com o mes da partida e uma funcao pura. Ler o
   relogio da maquina faria a mesma partida ter calendarios diferentes em dias diferentes. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/**
 * @typedef {object} Landmark um compromisso do ano fiscal
 * @property {string} id
 * @property {string} label - como o jogador o chama
 * @property {number} month - o mes do ano em que ele vence, de 1 a 12
 * @property {string} what - o que acontece nele, numa frase
 * @property {string} source - a norma que o cria
 */

/** @type {Schema} */
export const LANDMARK_SCHEMA = {
  id: { kind: "text" },
  label: { kind: "text" },
  month: { kind: "number", min: 1, max: 12 },
  what: { kind: "text" },
  source: { kind: "text" },
};

/* ⚠ AS QUATRO SAO REAIS E TEM FONTE, como manda a regra do catalogo. O que e ficcao neste jogo
   sao as PESSOAS; o calendario do orcamento e o do pais. */

/** @type {ReadonlyArray<Landmark>} */
export const CALENDAR = [
  {
    id: "minimo",
    label: "Salário mínimo",
    month: 1,
    what: "o novo piso passa a valer, e ele vale doze meses",
    source: "Lei 14.663/2023, art. 1º",
  },
  {
    id: "ldo",
    label: "LDO",
    month: 4,
    what: "as diretrizes do orçamento do ano que vem vão ao Congresso",
    source: "CF art. 35, §2º, II do ADCT",
  },
  {
    id: "loa",
    label: "LOA",
    month: 8,
    what: "a proposta de orçamento do ano que vem vai ao Congresso",
    source: "CF art. 35, §2º, III do ADCT",
  },
  /* ⚠ ELE E BIMESTRAL, e por isso nao cabe num campo de mes unico: `everyMonths` existe para
     ele e a ausencia dela significa "uma vez por ano". Sem o campo, o relatorio da LRF viraria
     um marco de janeiro e o jogo perderia o unico compromisso que se repete dentro do ano. */
  {
    id: "bimestral",
    label: "Relatório bimestral",
    month: 2,
    what: "receitas e despesas do bimestre são publicadas, e o contingenciamento se decide",
    source: "LRF art. 9º e CF art. 165, §3º",
  },
];

/* Quantos meses separam duas ocorrencias de um marco que nao e anual. */
export const REPEATS = /** @type {Record<string, number>} */ ({ bimestral: 2 });
