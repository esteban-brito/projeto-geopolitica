/* OS BLOCOS PARTIDARIOS — o espaco ideologico do Congresso. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const PARTY_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  sigla: { kind: "text" },
  /* ⚠ O ARTIGO E VOCABULARIO, e por isso ele mora no catalogo e nao no template. */
  article: { kind: "text" },
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  venalityEconomic: { kind: "number", min: 0, max: 1 },
  venalityLiberty: { kind: "number", min: 0, max: 1 },
  seats: { kind: "number", min: 0, max: 513 },
};

/**
 * ⚠ TODA SIGLA E INVENTADA e nenhuma existe no registro do TSE.
 *
 * @typedef {object} Party
 * @property {string} id
 * @property {string} label - o nome que a interface mostra; ATRIBUTO, nao identidade
 * @property {string} sigla - a sigla, e ela e o nome CURTO da bancada na tela estreita.
 * @property {string} [article] - a contracao com que a prosa se refere a ele: `do`, `da`.
 * monta bancadas a partir de PESSOAS, e uma pessoa se refere pelo nome — nao ha
 * contracao a fazer com "Onofre Bastos Quirino". O campo e do vocabulario dos
 * blocos deste catalogo, e `catalogViolations` cobra todos eles.
 * @property {number} economic
 * @property {number} liberty
 * @property {number} venalityEconomic - o preco de ceder em pauta economica
 * @property {number} venalityLiberty - o preco de ceder em liberdades individuais
 * @property {number} seats
 */

/* As 513 cadeiras da Camara, repartidas. */
/* ── O DEFEITO QUE A MEDICAO ACHOU ───────────────────────────────────────────── Com a
   esquerda em **20**, o modelo punha **73 cadeiras medias no primeiro quinto do eixo** — a
   faixa da intervencao maxima, que e onde mora o marxismo revolucionario. */
/** @type {ReadonlyArray<Party>} */
export const PARTIES = [
  {
    /* ≈ a frente socialista das pautas de direitos humanos e identidade: pequena, a mais
       ideologica da Camara, e a que menos vende. */
    id: "frente-socialista",
    label: "Frente Socialista Popular",
    sigla: "FSP",
    article: "da",
    economic: 24,
    liberty: 92,
    venalityEconomic: 0.1,
    venalityLiberty: 0.05,
    seats: 14,
  },
  {
    /* ≈ a maior legenda da centro-esquerda, em federacao com a comunista institucional e a
       ambientalista. */
    id: "trabalhistas-unidos",
    label: "Partido dos Trabalhadores Unidos",
    sigla: "PTU",
    article: "do",
    economic: 30,
    liberty: 78,
    venalityEconomic: 0.3,
    venalityLiberty: 0.1,
    seats: 80,
  },
  {
    /* ≈ o trabalhismo e o socialismo de frente ampla: educacao publica, soberania e
       composicao com quem governa. */
    id: "socialistas",
    label: "Partido Socialista Unificado",
    sigla: "PSU",
    article: "do",
    economic: 38,
    liberty: 72,
    venalityEconomic: 0.45,
    venalityLiberty: 0.3,
    seats: 31,
  },
  {
    /* ≈ a federacao historica de caciques regionais: compoe governo de qualquer matriz, e o
       preco dela e cargo e emenda. */
    id: "democratas-nacionais",
    label: "Movimento Democrático Nacional",
    sigla: "MDN",
    article: "do",
    economic: 55,
    liberty: 45,
    venalityEconomic: 0.9,
    venalityLiberty: 0.65,
    seats: 42,
  },
  {
    /* ≈ a legenda de capilaridade municipal somada aos restos da social-democracia:
       governabilidade acima de doutrina. */
    id: "social-municipalista",
    label: "Partido Social Municipalista",
    sigla: "PSM",
    article: "do",
    economic: 60,
    liberty: 42,
    venalityEconomic: 0.92,
    venalityLiberty: 0.6,
    seats: 71,
  },
  {
    /* ≈ a federacao que detem a maior fatia do orcamento e opera a maquina publica. */
    id: "uniao-progressista",
    label: "União Progressista Brasileira",
    sigla: "UPB",
    article: "da",
    economic: 72,
    liberty: 32,
    venalityEconomic: 0.95,
    venalityLiberty: 0.55,
    seats: 106,
  },
  {
    /* ≈ a maior bancada da Camara: burocracia pragmatica no dinheiro e conservadorismo duro
       nos costumes, somada a bancada de fe. */
    id: "liberais-conservadores",
    label: "Partido Liberal Brasileiro",
    sigla: "PLB",
    article: "do",
    economic: 78,
    liberty: 26,
    venalityEconomic: 0.7,
    venalityLiberty: 0.25,
    seats: 145,
  },
  {
    /* ≈ o liberalismo economico classico: privatizacao, Estado menor, e a recusa de vender a
       propria pauta economica por preco algum. */
    id: "liberais",
    label: "Partido Livre",
    sigla: "PLV",
    article: "do",
    economic: 94,
    liberty: 65,
    venalityEconomic: 0.08,
    venalityLiberty: 0.4,
    seats: 18,
  },
  {
    /* ≈ o nacionalismo militarista de retorica antissistema. */
    id: "nacionalistas",
    label: "Partido Nacionalista Renovador",
    sigla: "PNR",
    article: "do",
    economic: 68,
    liberty: 12,
    venalityEconomic: 0.35,
    venalityLiberty: 0.05,
    seats: 6,
  },
];

/* O TAMANHO DA CAMARA E AS MAIORIAS MUDARAM DE ENDERECO. */
