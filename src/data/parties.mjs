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
  pragmatic: { kind: "flag", optional: true },
  neverBase: { kind: "flag", optional: true },
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
 * @property {true} [pragmatic] - negocia com qualquer governo: aceita pasta longe no Nolan
 * @property {true} [neverBase] - recusa ministério de qualquer Presidente
 */

/* Os 16 da posse (docs/spec/the-parties.md): bancadas e posições decididas por ele em 26/09.
   A venalidade é [DESENHO], herdada do bloco equivalente do catálogo de 9; os pragmáticos da
   posse ficam acima do corte de 0,7 de `baseVenality`. */
/** @type {ReadonlyArray<Party>} */
export const PARTIES = [
  {
    id: "pml",
    label: "Partido Marxista-Leninista",
    sigla: "PML",
    article: "do",
    economic: 3,
    liberty: 8,
    venalityEconomic: 0.02,
    venalityLiberty: 0.02,
    seats: 1,
    neverBase: true,
  },
  {
    id: "pso",
    label: "Partido Socialista Operário",
    sigla: "PSO",
    article: "do",
    economic: 18,
    liberty: 78,
    venalityEconomic: 0.1,
    venalityLiberty: 0.05,
    seats: 12,
  },
  {
    id: "ecos",
    label: "Ecossolidariedade",
    sigla: "ECOS",
    article: "da",
    economic: 32,
    liberty: 76,
    venalityEconomic: 0.15,
    venalityLiberty: 0.1,
    seats: 4,
  },
  {
    id: "pcs",
    label: "Partido da Coalizão Social",
    sigla: "PCS",
    article: "do",
    economic: 28,
    liberty: 62,
    venalityEconomic: 0.3,
    venalityLiberty: 0.1,
    seats: 90,
  },
  {
    id: "ptp",
    label: "Partido do Trabalho e da Pátria",
    sigla: "PTP",
    article: "do",
    economic: 22,
    liberty: 54,
    venalityEconomic: 0.45,
    venalityLiberty: 0.3,
    seats: 10,
  },
  {
    id: "patria",
    label: "Patriota Popular",
    sigla: "PATRIA",
    article: "do",
    economic: 25,
    liberty: 12,
    venalityEconomic: 0.35,
    venalityLiberty: 0.05,
    seats: 3,
  },
  {
    id: "mdn",
    label: "Movimento Democrático Nacional",
    sigla: "MDN",
    article: "do",
    economic: 58,
    liberty: 44,
    venalityEconomic: 0.9,
    venalityLiberty: 0.65,
    seats: 52,
    pragmatic: true,
  },
  {
    id: "pbr",
    label: "Progressistas do Brasil",
    sigla: "PBR",
    article: "do",
    economic: 62,
    liberty: 34,
    venalityEconomic: 0.92,
    venalityLiberty: 0.6,
    seats: 42,
    pragmatic: true,
  },
  {
    id: "pdst",
    label: "Partido Democrático Social dos Trabalhadores",
    sigla: "PDST",
    article: "do",
    economic: 50,
    liberty: 50,
    venalityEconomic: 0.92,
    venalityLiberty: 0.6,
    seats: 50,
    pragmatic: true,
  },
  {
    id: "fbr",
    label: "Força Brasileira",
    sigla: "FBR",
    article: "da",
    economic: 68,
    liberty: 32,
    venalityEconomic: 0.95,
    venalityLiberty: 0.55,
    seats: 48,
    pragmatic: true,
  },
  {
    id: "unidos",
    label: "Unidos pela República",
    sigla: "UNIDOS",
    article: "do",
    economic: 64,
    liberty: 44,
    venalityEconomic: 0.75,
    venalityLiberty: 0.4,
    seats: 24,
    pragmatic: true,
  },
  {
    id: "pab",
    label: "Partido Agrário Brasileiro",
    sigla: "PAB",
    article: "do",
    economic: 60,
    liberty: 32,
    venalityEconomic: 0.9,
    venalityLiberty: 0.5,
    seats: 38,
    pragmatic: true,
  },
  {
    id: "acf",
    label: "Aliança Cristã pela Família",
    sigla: "ACF",
    article: "da",
    economic: 60,
    liberty: 24,
    venalityEconomic: 0.8,
    venalityLiberty: 0.2,
    seats: 36,
    pragmatic: true,
  },
  {
    id: "pcn",
    label: "Partido Conservador Nacional",
    sigla: "PCN",
    article: "do",
    economic: 66,
    liberty: 22,
    venalityEconomic: 0.7,
    venalityLiberty: 0.25,
    seats: 94,
  },
  {
    id: "vanguarda",
    label: "Vanguarda",
    sigla: "VANGUARDA",
    article: "da",
    economic: 85,
    liberty: 52,
    venalityEconomic: 0.08,
    venalityLiberty: 0.4,
    seats: 8,
  },
  {
    id: "pli",
    label: "Partido Libertário",
    sigla: "PLI",
    article: "do",
    economic: 97,
    liberty: 97,
    venalityEconomic: 0.02,
    venalityLiberty: 0.1,
    seats: 1,
    neverBase: true,
  },
];

/* O TAMANHO DA CAMARA E AS MAIORIAS MUDARAM DE ENDERECO. */
