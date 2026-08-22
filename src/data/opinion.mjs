/* Um governo com 45% de aprovacao pode ser um governo com apoio morno de todo mundo — que
   aguenta uma crise — ou um governo adorado por metade do pais e odiado pela outra — que nao
   aguenta nenhuma.
   TER PRECO — que e a razao de SONDA existir agora. Regiao entra quando a
   federacao entrar; religiao entra com a bancada evangelica. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const SEGMENT_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  share: { kind: "number", min: 0, max: 1 },
  initial: { kind: "number", min: 0, max: 100 },
  prices: { kind: "number", min: 0, max: 1 },
  jobs: { kind: "number", min: 0, max: 1 },
  services: { kind: "number", min: 0, max: 1 },
  safety: { kind: "number", min: 0, max: 1 },
  economy: { kind: "number", min: 0, max: 1 },
};

/**
 * @typedef {object} Segment
 * @property {string} id
 * @property {string} label - o nome que a interface mostra
 * @property {number} share - fracao da populacao
 * @property {number} initial - a satisfacao herdada na posse, de 0 a 100
 * @property {number} prices - peso da carestia na satisfacao dele
 * @property {number} jobs - peso do desemprego
 * @property {number} services - peso do servico publico (saude, educacao)
 * @property {number} safety - peso da seguranca
 * @property {number} economy - peso da economia em geral (PIB e juro)
 */

/* AS FATIAS SAO AS FAIXAS DE RENDA DOMICILIAR do IBGE, arredondadas: a base da piramide
   brasileira e larga, e e por isso que agradar a classe D/E é a jogada de maior retorno
   eleitoral — e a mais cara, porque ela depende de servico publico e de comida barata ao
   mesmo tempo. */
/** @type {ReadonlyArray<Segment>} */
export const SEGMENTS = [
  {
    id: "baixa",
    label: "Classe D/E",
    share: 0.42,
    /* ⚠ A LUA DE MEL E REAL, e a primeira calibragem a esqueceu: com 38 de satisfacao a
       partida abria com 14% de otimo/bom, que e numero de governo em fim de mandato ruim — e
       nao de governo que acabou de ganhar a eleicao. */
    initial: 70,
    /* Quem gasta 30% da renda com comida sente a inflacao antes de qualquer estatistica sair. */
    prices: 0.4,
    jobs: 0.25,
    services: 0.25,
    safety: 0.1,
    /* PIB NAO SIGNIFICA NADA para quem nao tem aplicacao nem emprego formal, e zero aqui e
       afirmacao: crescimento que nao vira emprego nao e sentido. */
    economy: 0,
  },
  {
    id: "media",
    label: "Classe C",
    share: 0.38,
    initial: 62,
    prices: 0.3,
    /* EMPREGO DOMINA. */
    jobs: 0.35,
    services: 0.15,
    safety: 0.15,
    economy: 0.05,
  },
  {
    id: "alta",
    label: "Classe A/B",
    share: 0.2,
    /* A MENOS SATISFEITA NA ABERTURA, e nao por gosto: ela paga a maior parte do imposto e
       usa a menor parte do servico publico, entao a conta que ela faz do governo comeca mais
       fria — inclusive na lua de mel. */
    initial: 52,
    prices: 0.15,
    jobs: 0.1,
    /* SERVICO PUBLICO QUASE NAO CONTA: quem tem plano de saude e escola privada nao sente a
       fila. */
    services: 0.05,
    safety: 0.3,
    /* ECONOMIA DOMINA: PIB, juro e o que a carteira dela rende. */
    economy: 0.4,
  },
];

/** @type {Schema} */
export const OPINION_SCHEMA = {
  release: { kind: "number", min: 0, max: 12 },
  inertia: { kind: "number", min: 0, max: 1 },
  fallSpeed: { kind: "number", min: 1, max: 5 },
  priceAnchor: { kind: "number", min: 0, max: 0.5 },
  priceSpan: { kind: "number", min: 0.01, max: 0.5 },
  jobAnchor: { kind: "number", min: 0, max: 0.5 },
  jobSpan: { kind: "number", min: 0.01, max: 0.5 },
  growthAnchor: { kind: "number", min: -0.1, max: 0.2 },
  growthSpan: { kind: "number", min: 0.01, max: 0.5 },
  broken: { kind: "number", min: 0, max: 50 },
  wearRate: { kind: "number", min: 0, max: 2 },
  goodSlope: { kind: "number", min: 0, max: 3 },
  poorSlope: { kind: "number", min: 0, max: 3 },
};

/**
 * @typedef {object} OpinionParameters
 * @property {number} release - meses de defasagem do indicador divulgado
 * @property {number} inertia - quanto da opiniao de ontem sobrevive ao mes
 * @property {number} fallSpeed - quantas vezes mais rapido a satisfacao CAI
 * @property {number} priceAnchor - a inflacao anual em que a carestia e neutra
 * @property {number} priceSpan - quanto de inflacao a mais leva a nota ao chao
 * @property {number} jobAnchor - o desemprego em que o emprego e neutro
 * @property {number} jobSpan
 * @property {number} growthAnchor - o crescimento real anual neutro
 * @property {number} growthSpan
 * @property {number} broken - quanto uma promessa quebrada tira da satisfacao
 * @property {number} wearRate - pontos de satisfacao que o desgaste do cargo tira por mes
 * @property {number} goodSlope - como a satisfacao vira "otimo/bom"
 * @property {number} poorSlope - como a insatisfacao vira "ruim/pessimo"
 */

/** @type {OpinionParameters} */
export const OPINION = {
  /* ⚠ O PRESIDENTE NAO SABE O MES EM QUE ESTA. */
  release: 2,

  /* OPINIAO NAO PULA. */
  inertia: 0.88,
  /* ⚠ E ELA CAI TRES VEZES MAIS RAPIDO DO QUE SOBE, que e o achado empirico mais consistente
     da literatura de opiniao publica e a razao de governos gastarem tanto para evitar uma
     crise pequena. */
  fallSpeed: 3,

  /* Com a carestia neutra em 6% ao ano, o pais de abertura — inflacao em 4,2% e desemprego em
     6,8% — dava nota alta em tudo, e a rua ficava satisfeita com o governo por herança. */
  priceAnchor: 0.035,
  priceSpan: 0.06,
  jobAnchor: 0.06,
  jobSpan: 0.06,
  growthAnchor: 0.025,
  growthSpan: 0.04,

  /* PROMESSA QUEBRADA TAMBEM CHEGA A RUA, e nao so ao Congresso. */
  broken: 12,

  /* Sem ele a aprovacao subia de 35 para 54 em 48 meses com o jogador nao fazendo NADA —
     porque o pais de abertura tem inflacao e desemprego dentro das ancoras, e a conta parava
     de pé sozinha. */
  wearRate: 0.25,

  /* ⚠ A 1,35 a primeira captura mostrou 23/19/58, e o meio de 19% denunciava o numero:
     pesquisa nenhuma tem tao pouca gente em cima do muro. */
  goodSlope: 1.8,
  poorSlope: 1.8,
};
