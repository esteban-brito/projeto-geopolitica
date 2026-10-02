/* O CALENDÁRIO — a forma do ano fiscal brasileiro, e ela é a mesma todo ano.
   ⚠ ELE É A PRIMEIRA DATA DO JOGO, e por isso não há relógio aqui: cada marco diz em QUE MÊS
   DO ANO ele cai, de 1 a 12, e quem cruza isso com o mês da partida é uma função pura. Ler o
   relógio da máquina faria a mesma partida ter calendários diferentes em dias diferentes. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/**
 * @typedef {object} Landmark um compromisso do ano fiscal
 * @property {string} id
 * @property {string} label - como o jogador o chama
 * @property {number} month - o mês do ano em que ele vence, de 1 a 12
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

/* ⚠ AS QUATRO SÃO REAIS E TÊM FONTE, como manda a regra do catálogo. O que é ficção neste jogo
   são as PESSOAS; o calendário do orçamento é o do país. */

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
    label: "Meta fiscal",
    month: 4,
    what: "as diretrizes do orçamento do ano que vem vão ao Congresso",
    source: "CF art. 35, §2º, II do ADCT",
  },
  {
    id: "loa",
    label: "Orçamento do ano",
    month: 8,
    what: "a proposta de orçamento do ano que vem vai ao Congresso",
    source: "CF art. 35, §2º, III do ADCT",
  },
  /* ⚠ ELE É BIMESTRAL, e por isso não cabe no campo `month` sozinho: quem diz o passo é
     `REPEATS`, embaixo, e a ausência ali significa "uma vez por ano". A repetição ficou FORA
     do esquema de propósito — como campo, ela obrigaria os outros três a escrever
     `everyMonths: 12`, que é a mesma ausência com mais bytes. */
  {
    id: "bimestral",
    label: "Relatório bimestral",
    month: 2,
    what: "receitas e despesas do bimestre são publicadas, e o contingenciamento se decide",
    source: "LRF art. 9º e CF art. 165, §3º",
  },
];

/* Quantos meses separam duas ocorrências de um marco que não é anual. */
export const REPEATS = /** @type {Record<string, number>} */ ({ bimestral: 2 });
