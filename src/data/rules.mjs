/* AS ALAVANCAS DE REGRA — politica que nao se mede em reais.
   Ninguem escreveu "armadilha da privatizacao". E aritmetica do LASTRO. */

/* AS DUAS FAMILIAS DE REGRA, e o esquema as COBRA — ver `values` em `schema.mjs`. */
const FAMILIES = /** @type {const} */ (["property", "power"]);

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const RULE_SCHEMA = {
  id: { kind: "id" },
  family: { kind: "text", values: FAMILIES },
  label: { kind: "text" },
  unit: { kind: "text" },
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  threat: { kind: "number", min: 0, max: 1 },
  reach: { kind: "number", min: 0, max: 5000 },
  initial: { kind: "number", min: 0, max: 100 },
  floor: { kind: "number", min: 0, max: 100 },
  ceiling: { kind: "number", min: 0, max: 100 },
  guard: { kind: "text" },
  dividend: { kind: "number", min: 0, max: 1 },
  payroll: { kind: "number", min: 0, max: 1 },
  sale: { kind: "number", min: 0, max: 5 },
};

/** As familias. `property` tem canal fiscal; `power` mexe no rito. */

/**
 * @typedef {object} Rule
 * @property {string} id
 * @property {string} family - uma de `FAMILIES`
 * @property {string} label
 * @property {string} unit - o que a intensidade significa no mundo
 * @property {number} economic
 * @property {number} liberty
 * @property {number} threat
 * @property {number} reach - quanto do pais isto toca, em bilhoes
 * @property {number} initial
 * @property {number} floor
 * @property {number} ceiling
 * @property {string} guard - o que protege o piso
 * @property {number} dividend - fracao de `reach` que volta ao Tesouro por ano, a 100
 * @property {number} payroll - fracao de `reach` que vira folha obrigatoria, a 100
 * @property {number} sale - fracao de `reach` arrecadada ao vender os 100 pontos
 */

/** @type {ReadonlyArray<Rule>} */
export const RULES = [
  /* ── PROPRIEDADE ─────────────────────────────────────────────────────────── Um controle
     por setor. */
  {
    id: "petroleo-e-gas",
    family: "property",
    label: "Petróleo e gás",
    unit: "participação da União no setor",
    economic: 26,
    liberty: 48,
    /* AMEACA ALTA: a maior estatal do pais e o maior loteamento de diretoria que existe. */
    threat: 0.4,
    reach: 620,
    initial: 62,
    floor: 0,
    ceiling: 100,
    guard: "law",
    /* Dividendo alto e folha baixa: a estatal do petroleo PAGA ao Tesouro. */
    dividend: 0.055,
    payroll: 0.022,
    sale: 0.85,
  },
  {
    id: "bancos-publicos",
    family: "property",
    label: "Bancos públicos",
    unit: "participação da União no crédito",
    economic: 24,
    liberty: 50,
    threat: 0.35,
    reach: 480,
    initial: 70,
    floor: 0,
    ceiling: 100,
    guard: "law",
    dividend: 0.045,
    payroll: 0.03,
    sale: 0.7,
  },
  {
    id: "energia-eletrica",
    family: "property",
    label: "Energia elétrica",
    unit: "participação da União na geração e transmissão",
    economic: 30,
    liberty: 50,
    threat: 0.25,
    reach: 340,
    /* JA MAJORITARIAMENTE PRIVADO na abertura, e isso e afirmacao sobre o mundo: o setor foi
       desestatizado antes desta partida comecar. */
    initial: 28,
    floor: 0,
    ceiling: 100,
    guard: "law",
    dividend: 0.03,
    payroll: 0.02,
    sale: 0.75,
  },
  {
    id: "correios-e-logistica",
    family: "property",
    label: "Correios e logística",
    unit: "participação da União na entrega e nos portos",
    economic: 32,
    liberty: 52,
    threat: 0.2,
    reach: 90,
    initial: 84,
    floor: 0,
    ceiling: 100,
    guard: "law",
    /* O CASO INVERSO DO PETROLEO: folha maior que dividendo. */
    dividend: 0.008,
    payroll: 0.055,
    sale: 0.45,
  },
  {
    id: "saneamento-e-agua",
    family: "property",
    label: "Saneamento e água",
    unit: "participação pública na rede",
    economic: 22,
    liberty: 54,
    threat: 0.15,
    reach: 150,
    initial: 66,
    floor: 0,
    ceiling: 100,
    guard: "law",
    dividend: 0.012,
    payroll: 0.03,
    sale: 0.6,
  },

  /* ── PODER ───────────────────────────────────────────────────────────────── Uma alavanca
     so, e ela e a mais perigosa do jogo. */
  {
    id: "poder-do-executivo",
    family: "power",
    label: "Poder do Executivo",
    unit: "o quanto se decide sem passar pelo Congresso",
    /* NEUTRA EM ECONOMIA e no chao em liberdades. */
    economic: 50,
    liberty: 3,
    /* A MAIOR AMEACA DO CATALOGO INTEIRO, e por definicao: esta pauta tira poder exatamente
       de quem a vota. */
    threat: 0.95,
    reach: 900,
    initial: 30,
    /* ⚠ A FAIXA E UM PONTO, e nao um intervalo — e essa e a diferenca entre esta alavanca e
       todas as outras. */
    floor: 30,
    ceiling: 30,
    guard: "constitution",
    dividend: 0,
    payroll: 0,
    sale: 0,
  },
];

/* ── O QUE O PODER FAZ COM O RITO ─────────────────────────────────────────── Cada degrau
   derruba UMA exigencia: emenda vira lei, lei vira caneta. */
export const POWER_STEPS = [
  { at: 60, drops: 1 },
  { at: 85, drops: 2 },
];
