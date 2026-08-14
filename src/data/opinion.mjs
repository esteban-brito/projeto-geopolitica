/* OS SEGMENTOS E OS PARAMETROS DA OPINIAO — o que SONDA consome.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ AS FATIAS DE POPULACAO SAO REAIS E DATADAS, como o resto do catalogo desde
   13/08/2026; os PESOS de cada segmento sao julgamento declarado, porque nenhuma
   fonte publica mede "quanto a classe C liga para seguranca".

   ── POR QUE TRES SEGMENTOS, E NAO UM NUMERO SO ───────────────────────────────
   Uma aprovacao unica esconde a informacao que decide o jogo. Um governo com 45%
   de aprovacao pode ser um governo com apoio morno de todo mundo — que aguenta
   uma crise — ou um governo adorado por metade do pais e odiado pela outra —
   que nao aguenta nenhuma. A media e a mesma; o risco de queda nao e.

   E a divisao por RENDA nao e sociologia decorativa: ela e a unica que muda o
   sinal dos indicadores. Inflacao de alimentos destroi a classe D/E e mal
   arranha a classe A/B; juro alto premia quem tem aplicacao e afunda quem tem
   credito rotativo; servico publico bom e a diferenca entre ter e nao ter
   medico para quem nao paga plano.

   ── OS PESOS SAO A MODELAGEM, E ELES SOMAM 1 EM CADA SEGMENTO ────────────────
   Cada segmento reparte a propria atencao entre cinco coisas: carestia,
   emprego, servico publico, seguranca e economia. O que muda entre eles e para
   onde a atencao vai — e e isso, e nada mais, que faz a mesma politica agradar
   uns e irritar outros.

   ── O QUE ESTE CATALOGO NAO TEM, declarado ──────────────────────────────────
   Recorte por regiao, por religiao e por escolaridade. Os tres sao reais e
   pesados na politica brasileira, e nenhum deles e necessario para a aprovacao
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

/* AS FATIAS SAO AS FAIXAS DE RENDA DOMICILIAR do IBGE, arredondadas: a base da
   piramide brasileira e larga, e e por isso que agradar a classe D/E é a jogada
   de maior retorno eleitoral — e a mais cara, porque ela depende de servico
   publico e de comida barata ao mesmo tempo. */
/** @type {ReadonlyArray<Segment>} */
export const SEGMENTS = [
  {
    id: "baixa",
    label: "Classe D/E",
    share: 0.42,
    /* ELA COMECA MAIS SATISFEITA que a media, e isso e o retrato de quem acabou
       de eleger o governo: a esperanca do primeiro ano e real e evapora rapido. */
    initial: 38,
    /* CARESTIA DOMINA, e o numero e quase metade da atencao dela. Quem gasta 30%
       da renda com comida sente a inflacao antes de qualquer estatistica sair. */
    prices: 0.4,
    jobs: 0.25,
    services: 0.25,
    safety: 0.1,
    /* PIB NAO SIGNIFICA NADA para quem nao tem aplicacao nem emprego formal, e
       zero aqui e afirmacao: crescimento que nao vira emprego nao e sentido. */
    economy: 0,
  },
  {
    id: "media",
    label: "Classe C",
    share: 0.38,
    initial: 31,
    prices: 0.3,
    /* EMPREGO DOMINA. E o segmento que sobe e desce com o mercado formal, e o que
       mais perde quando a economia trava — ele tem o que perder. */
    jobs: 0.35,
    services: 0.15,
    safety: 0.15,
    economy: 0.05,
  },
  {
    id: "alta",
    label: "Classe A/B",
    share: 0.2,
    /* A MENOS SATISFEITA NA ABERTURA, e nao por gosto: ela paga a maior parte do
       imposto e usa a menor parte do servico publico, entao a conta que ela faz
       do governo comeca negativa quase sempre. */
    initial: 26,
    prices: 0.15,
    jobs: 0.1,
    /* SERVICO PUBLICO QUASE NAO CONTA: quem tem plano de saude e escola privada
       nao sente a fila. E a linha que faz cortar saude custar pouco a este
       segmento e muito ao de baixo — e o jogador descobre isso na pesquisa. */
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
  /* ⚠ O PRESIDENTE NAO SABE O MES EM QUE ESTA. IPCA sai em duas semanas, PNAD em
     dois meses, PIB em um trimestre. Dois meses e a media grosseira, e a
     defasagem e MECANICA e nao limitacao: ela e o que faz uma correcao de rota
     demorar a aparecer na pesquisa, e o que faz o jogador impaciente corrigir
     duas vezes o mesmo problema. */
  release: 2,

  /* OPINIAO NAO PULA. A 0,88, uma mudanca leva perto de um ano para chegar
     inteira — que e a ordem de grandeza real de uma reversao de popularidade. */
  inertia: 0.88,
  /* ⚠ E ELA CAI TRES VEZES MAIS RAPIDO DO QUE SOBE, que e o achado empirico mais
     consistente da literatura de opiniao publica e a razao de governos gastarem
     tanto para evitar uma crise pequena. Sem a assimetria, o jogador aprenderia
     que da para deixar a popularidade desabar e recuperar depois — e nao da. */
  fallSpeed: 3,

  /* AS ANCORAS SAO O PONTO EM QUE O INDICADOR DEIXA DE INCOMODAR, e nao a meta
     tecnica: gente nao comemora inflacao na meta, gente para de reclamar.

     ⚠ ELAS FORAM APERTADAS na primeira medicao. Com a carestia neutra em 6% ao
     ano, o pais de abertura — inflacao em 4,2% e desemprego em 6,8% — dava nota
     alta em tudo, e a rua ficava satisfeita com o governo por herança. Neutro e
     onde o brasileiro para de reclamar, e nao onde o economista aplaude. */
  priceAnchor: 0.035,
  priceSpan: 0.06,
  jobAnchor: 0.06,
  jobSpan: 0.06,
  growthAnchor: 0.025,
  growthSpan: 0.04,

  /* PROMESSA QUEBRADA TAMBEM CHEGA A RUA, e nao so ao Congresso. O rateio que
     corta emenda corta obra inaugurada, e a conta politica dele ja existia de um
     lado so — este e o outro lado. */
  broken: 12,

  /* ⚠ O DESGASTE DO CARGO, e ele e a peca que faltava para a serie fazer sentido.
     Sem ele a aprovacao subia de 35 para 54 em 48 meses com o jogador nao fazendo
     NADA — porque o pais de abertura tem inflacao e desemprego dentro das ancoras,
     e a conta parava de pé sozinha.

     Governo se gasta. Cada mes no cargo acumula decisao que desagradou alguem,
     promessa que nao coube, escandalo pequeno e cansaco — e isso e tao real quanto
     a inflacao. A 0,25 ponto por mes, um mandato inteiro custa 12 pontos de
     satisfacao, que e a ordem de grandeza do desgaste medio de um presidente
     brasileiro que nao entrega nada excepcional.

     E ele e o que transforma popularidade em TRABALHO: manter a rua exige entregar
     mais a cada ano, e nao apenas nao errar. */
  wearRate: 0.25,

  /* A CONVERSAO PARA A ESCALA DE PESQUISA. Ela nao e linear de proposito: os
     extremos sao mais dificeis de alcancar que o meio, porque na vida real
     "regular" e a resposta confortavel e as pontas exigem conviccao.

     ⚠ A 1,35 a primeira captura mostrou 23/19/58, e o meio de 19% denunciava o
     numero: pesquisa nenhuma tem tao pouca gente em cima do muro. A 1,8, uma
     satisfacao mediana da perto de 29/43/29 e um governo ruim da 15/39/46 — que e
     a forma que as pesquisas brasileiras de fato tem. */
  goodSlope: 1.8,
  poorSlope: 1.8,
};
