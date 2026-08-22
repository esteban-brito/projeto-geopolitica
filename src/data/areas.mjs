/* AS AREAS DE GOVERNO — onde o presidente pensa que esta mexendo. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/* Tres canais, e nenhuma area usa dois — se usasse, o efeito de uma alocacao ficaria
   impossivel de atribuir, que e exatamente o defeito que o motor de propagacao existe para
   nao ter. */
const CHANNELS = /** @type {const} */ (["revenue", "mandatory", "capacity"]);

/** @type {Schema} */
export const AREA_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  index: { kind: "text" },
  initial: { kind: "number", min: 0, max: 100 },
  /* FRACAO DO ESTOQUE POR MES, e nao pontos por mes — ver a prosa de `decay`
     abaixo e o cabecalho da MALHA. O teto de 1 e a natureza da coisa: uma area que
     perdesse mais que 100% do que tem por mes nao e uma area, e um erro de digitacao. */
  decay: { kind: "number", min: 0, max: 1 },
  yield: { kind: "number", min: 0, max: 5 },
  feeds: { kind: "text", values: CHANNELS },
  force: { kind: "number", min: -10, max: 10 },
  lag: { kind: "number", min: 0, max: 48 },
};

/* O PONTO NEUTRO. */
export const NEUTRAL = 50;

/**
 * ⚠ ELE MUDOU DE NATUREZA EM, e a mudanca e o achado 31 — o defeito mais fundo ja medido
 * aqui.
 *
 * @typedef {object} Area
 * @property {string} id
 * @property {string} label - o nome que a interface mostra; ATRIBUTO, nao identidade
 * @property {string} index - como se chama o indice desta area
 * @property {number} initial - o indice de abertura, de 0 a 100
 * @property {number} decay - a FRACAO do indice que vaza por mes
 * @property {number} yield - quanto o indice sobe por bilhao GASTO no mes na area
 * @property {string} feeds - o canal de realimentacao; um de `CHANNELS`
 * @property {number} force - com que forca o indice age no canal, COM SINAL
 * @property {number} lag - meses ate o efeito chegar ao canal
 */

/* O SINAL DE `force` CARREGA A DIRECAO, e sem ele o molde nao fecharia. */

/* O que a identidade produz, em meia-vida do estoque sem verba nenhuma: industria  12 meses
   previdencia  40 meses   defesa   78 meses seguranca  16 meses   treasury   55 meses
   educacao  79 meses agricultura  61 meses   saude   63 meses E a leitura do desenho MUDOU DE
   LUGAR, porque a velocidade agora e consequencia do custo por ponto de cada area
   (`gasto_herdado / indice`) e nao de uma escolha: · SEGURANCA continua a alavanca populista,
   e agora com a razao explicita: ela custa R$ 0,07 bi por ponto, o mais barato do catalogo.
   pela identidade escrita no `@property {number} decay` acima. O que segue chute e o */
/** @type {ReadonlyArray<Area>} */
export const AREAS = [
  {
    id: "treasury",
    label: "Fazenda",
    index: "arrecadação",
    initial: 72,
    decay: 0.012442,
    yield: 0.0674,
    feeds: "revenue",
    force: 0.25,
    lag: 0,
  },
  {
    id: "agriculture",
    label: "Agricultura",
    index: "safra",
    initial: 63,
    /* DECAI DEVAGAR: a lavoura nao desaba no mes em que o crédito atrasa, e o ciclo dela e
       anual e nao mensal. */
    decay: 0.01138,
    yield: 0.3054,
    feeds: "revenue",
    force: 0.08,
    lag: 6,
  },
  {
    id: "industry",
    label: "Indústria e Infraestrutura",
    index: "capacidade",
    initial: 48,
    decay: 0.056913,
    yield: 0.358,
    feeds: "revenue",
    force: 0.12,
    /* Obra nao vira PIB no mes em que o cheque e assinado. */
    lag: 6,
  },
  {
    id: "welfare",
    label: "Previdência",
    index: "cobertura",
    initial: 71,
    decay: 0.017147,
    yield: 0.0096,
    feeds: "mandatory",
    force: 0.3,
    lag: 0,
  },
  {
    id: "health",
    label: "Saúde",
    index: "atendimento",
    initial: 61,
    decay: 0.010983,
    yield: 0.0335,
    feeds: "mandatory",
    force: -0.18,
    lag: 3,
  },
  {
    id: "education",
    label: "Educação",
    index: "formação",
    initial: 44,
    decay: 0.008788,
    yield: 0.0356,
    feeds: "capacity",
    force: 6,
    /* O numero e o desenho: um mandato tem 48 meses, entao investir em educacao no segundo
       ano so paga no quarto, e investir no terceiro nao paga nunca — para quem investiu. */
    lag: 24,
  },
  {
    id: "security",
    label: "Segurança",
    index: "ordem",
    initial: 38,
    decay: 0.041885,
    yield: 0.6358,
    feeds: "mandatory",
    force: -0.14,
    lag: 3,
  },
  /* Prontidao alta encarece a obrigatoria — 78% do orcamento militar e folha e inativo, e
     cuidar dela cobra, exatamente como a previdencia. */
  {
    id: "defense",
    label: "Defesa",
    index: "prontidão",
    initial: 51,
    decay: 0.0088,
    yield: 0.0415,
    feeds: "mandatory",
    force: 0.12,
    lag: 12,
  },
];

/* PARA ONDE A CAPACIDADE DA EDUCACAO VAI. */
export const CAPACITY_TARGET = "industry";
