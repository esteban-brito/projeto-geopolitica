/* AS ÁREAS DE GOVERNO — onde o presidente pensa que esta mexendo. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/* Três canais, e nenhuma área usa dois — se usasse, o efeito de uma alocação ficaria
   impossível de atribuir, que e exatamente o defeito que o motor de propagação existe para
   não ter. */
const CHANNELS = /** @type {const} */ (["revenue", "mandatory", "capacity"]);

/** @type {Schema} */
export const AREA_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  /* ⚠ O NOME CURTO E OPCIONAL, e a ausência significa "use o `label`" — declarar os oito
     poria sete cópias do nome cheio no catálogo, e a copia só dói quando alguém renomeia uma
     das duas. E o precedente e `sigla`, que existe em `parties` pela mesma razão medida. */
  short: { kind: "text", optional: true },
  index: { kind: "text" },
  initial: { kind: "number", min: 0, max: 100 },
  /* FRAÇÃO DO ESTOQUE POR MÊS, e não pontos por mês — ver a prosa de `decay`
     abaixo e o cabeçalho da MALHA. O teto de 1 e a natureza da coisa: uma área que
     perdesse mais que 100% do que tem por mês não e uma área, e um erro de digitacao. */
  decay: { kind: "number", min: 0, max: 1 },
  yield: { kind: "number", min: 0, max: 5 },
  feeds: { kind: "text", values: CHANNELS },
  force: { kind: "number", min: -10, max: 10 },
  lag: { kind: "number", min: 0, max: 48 },
};

/* O PONTO NEUTRO. */
export const NEUTRAL = 50;

/**
 * ⚠ ELE MUDOU DE NATUREZA EM, e a mudança e o achado 31 — o defeito mais fundo já medido
 * aqui.
 *
 * @typedef {object} Area
 * @property {string} id
 * @property {string} label - o nome que a interface mostra; ATRIBUTO, nao identidade
 * @property {string} [short] - o nome para coluna estreita; ausente quer dizer `label`
 * @property {string} index - como se chama o indice desta area
 * @property {number} initial - o indice de abertura, de 0 a 100
 * @property {number} decay - a FRACAO do indice que vaza por mes
 * @property {number} yield - quanto o indice sobe por bilhao GASTO no mes na area
 * @property {string} feeds - o canal de realimentacao; um de `CHANNELS`
 * @property {number} force - com que forca o indice age no canal, COM SINAL
 * @property {number} lag - meses ate o efeito chegar ao canal
 */

/* O SINAL DE `force` CARREGA A DIREÇÃO, e sem ele o molde não fecharia. */

/* A MEIA-VIDA DE CADA ÁREA sem verba nenhuma, em meses, e ela sai da identidade do `decay`
   acima e não de uma escolha: indústria 12 · segurança 16 · previdência 40 · treasury 55 ·
   agricultura 61 · saude 63 · defesa 78 · educacao 79.

   ⚠ SEIS DAS OITO LEVAM MAIS QUE UM MANDATO, que tem 48. E uma tese sobre o Brasil —
   defensável — e ninguém a escolheu: ela e consequência aritmética do custo por ponto de
   cada área. E SEGURANÇA e a alavanca populista com a razão explicita: R$ 0,07 bi por
   ponto, o mais barato do catálogo. */
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
    /* DECAI DEVAGAR: a lavoura não desaba no mês em que o crédito atrasa, e o ciclo dela e
       anual e não mensal. */
    decay: 0.01138,
    yield: 0.3054,
    feeds: "revenue",
    force: 0.08,
    lag: 6,
  },
  {
    id: "industry",
    label: "Indústria e Infraestrutura",
    /* ⚠ A ÚNICA DAS OITO QUE NÃO CABE: medido, o nome cheio pede 164px no rail de 109 e 202px
       na faixa de 117, e as duas cortavam com reticência em "Indústria e Infr…". */
    short: "Indústria",
    index: "capacidade",
    initial: 48,
    decay: 0.056913,
    yield: 0.358,
    feeds: "revenue",
    force: 0.12,
    /* Obra não vira PIB no mês em que o cheque e assinado. */
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
    /* O número e o desenho: um mandato tem 48 meses, então investir em educacao no segundo
       ano só paga no quarto, e investir no terceiro não paga nunca — para quem investiu. */
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
  /* Prontidão alta encarece a obrigatória — 78% do orcamento militar e folha e inativo, e
     cuidar dela cobra, exatamente como a previdência. */
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
