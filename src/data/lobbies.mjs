/* OS GRUPOS DE PRESSAO — quem consegue derrubar um presidente.

   A SONDA responde QUEM APROVA o governo; estes respondem QUEM CONSEGUE DERRUBA-LO. A rua
   nao esta na lista: ela ja e medida pela SONDA, e entra na queda como CONDICAO — a
   ruptura social — e nao como ator.

   ⚠ A PRESSAO SOBE POR AUSENCIA DE ENTREGA, medida contra um PONTO DE SATISFACAO. Se
   subisse so por acao contraria, o jogador aprenderia que parar e seguro.

   ⚠ CADA LOBBY LE UM LUGAR, E NENHUM LE O MESMO QUE OUTRO: o mercado le o LASTRO (a divida
   acima da herdada), o fisiologismo le a ECLUSA (quanto da promessa o caixa honrou), o
   setor produtivo le agricultura e industria na MALHA, e as forcas de ordem leem seguranca
   e defesa. Os dois ultimos leem o mesmo MOTOR e nao o mesmo NUMERO: uma safra ruim nao
   move a prontidao militar. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const LOBBY_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  /* O QUE ELE COBRA, em uma linha, e ela vai para a tela. */
  wants: { kind: "text" },
  /* A POSICAO NO PLANO, como bloco e pessoa ja tem. */
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  /* O CANAL: qual motor produz o descontentamento dele. */
  reads: { kind: "text", values: ["debt", "share", "capacity"] },
  /* AS AREAS QUE ELE REPRESENTA, e so para quem lê `capacity`. Vazio nos outros. */
  areas: { kind: "text", optional: true },
  /* QUANTO ELE PESA na ruptura economica da queda, de 0 a 1. */
  weight: { kind: "number", min: 0, max: 1 },
};

/**
 * @typedef {object} Lobby
 * @property {string} id
 * @property {string} label
 * @property {string} wants
 * @property {number} economic
 * @property {number} liberty
 * @property {string} reads - `debt`, `share` ou `capacity`
 * @property {string} [areas] - ids separados por espaco; so quando `reads` e `capacity`
 * @property {number} weight
 */

/** @type {ReadonlyArray<Lobby>} */
export const LOBBIES = [
  {
    id: "mercado",
    label: "O mercado",
    /* ELE NAO PEDE LEI, EXIGE SUPERAVIT — e essa e a diferenca dele para os outros tres: nao
       ha o que assinar para agrada-lo, so o que deixar de gastar. */
    wants: "que a dívida pare de crescer",
    /* No extremo liberal do eixo economico, e indiferente no de liberdades: o credor da
       divida nao tem opiniao sobre costumes. */
    economic: 88,
    liberty: 55,
    reads: "debt",
    weight: 0.35,
  },
  {
    id: "fisiologismo",
    label: "O baixo clero",
    /* ⚠ FOME DE EXECUCAO, E NAO IDEOLOGIA. */
    wants: "que a torneira das emendas fique aberta",
    economic: 50,
    liberty: 50,
    reads: "share",
    weight: 0.3,
  },
  {
    id: "produtivo",
    label: "O setor produtivo",
    wants: "estrada, crédito e safra escoada",
    economic: 76,
    liberty: 58,
    reads: "capacity",
    areas: "agriculture industry",
    weight: 0.35,
  },
  {
    id: "ordem",
    label: "As forças de ordem",
    /* O unico dos quatro que se move no eixo das LIBERDADES, e e por isso que ele existe
       separado: um governo pode agradar o mercado e o produtivo ao mesmo tempo e ter este
       contra, porque o que ele cobra nao e dinheiro. */
    wants: "prontidão, efetivo e a folha protegida",
    economic: 62,
    liberty: 22,
    reads: "capacity",
    areas: "security defense",
    weight: 0,
  },
];

/** @type {Schema} */
export const PRESSURE_SCHEMA = {
  rise: { kind: "number", min: 0, max: 1 },
  cool: { kind: "number", min: 0, max: 1 },
  boil: { kind: "number", min: 0, max: 100 },
  streetFloor: { kind: "number", min: 0, max: 100 },
  brokerBoil: { kind: "number", min: 0, max: 100 },
  demandAt: { kind: "number", min: 0, max: 100 },
  spite: { kind: "number", min: 0, max: 1 },
};

/* Medido em 48 meses, com o mercado parando em 65 num governo que promete tudo e nao paga:
   passivo, nao paga ninguem     nunca abre paga metade            abre no mes 48 promete tudo
   e nao honra      abre no mes 47 corta tudo e nao paga       nunca abre ⚠ E O GOVERNO
   PASSIVO SOBREVIVER E UM RESULTADO, e nao um defeito de calibragem: nao gastar AGRADA o
   mercado, e o capital o abriga.
   ECLUSA, o TABLE da Mesa e o ANSWER_TIME da carta.
   a rua — mas nao cai. A CALDEIRA torna a passividade perigosa e nao a torna fatal, e
   forcar numeros ate ela ser fatal seria calibrar para obter a conclusao desejada. */
/* ⚠ Comecei em 35, sem razao nenhuma alem de gosto, e a medicao mostrou o preco de um chute:
   DUAS exigencias em 48 meses, as duas depois do mes 45 — instrumento que nunca dispara e o
   achado 3 deste projeto se repetindo. */
export const PRESSURE = {
  rise: 0.18,
  cool: 0.06,
  /* ⚠ O QUE ELES CONSERTAM ESTA MEDIDO: com a Camara de nove legendas, um governo de
     MANUTENCAO — que aperta o orcamento ate caber no teto e paga so a base — via a ruptura
     politica abrir no mes 12 e caia no mes 50, no ultimo mes do mandato. */
  boil: 68,
  streetFloor: 16,
  brokerBoil: 86,
  demandAt: 30,
  spite: 0.25,
};
