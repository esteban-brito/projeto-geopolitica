/* OS GRUPOS DE PRESSÃO — quem consegue derrubar um presidente.

   A SONDA responde QUEM APROVA o governo; estes respondem QUEM CONSEGUE DERRUBA-LO. A rua
   não esta na lista: ela já e medida pela SONDA, e entra na queda como CONDIÇÃO — a
   ruptura social — e não como ator.

   ⚠ A PRESSÃO SOBE POR AUSÊNCIA DE ENTREGA, medida contra um PONTO DE SATISFAÇÃO. Se
   subisse só por ação contraria, o jogador aprenderia que parar e seguro.

   ⚠ CADA LOBBY LÊ UM LUGAR, E NENHUM LÊ O MESMO QUE OUTRO: o mercado lê o LASTRO (a dívida
   acima da herdada), o fisiologismo lê a ECLUSA (quanto da promessa o caixa honrou), o
   setor produtivo lê agricultura e indústria na MALHA, e as forças de ordem leem segurança
   e defesa. Os dois últimos leem o mesmo MOTOR e não o mesmo NÚMERO: uma safra ruim não
   move a prontidão militar. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const LOBBY_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  /* O QUE ELE COBRA, em uma linha, e ela vai para a tela. */
  wants: { kind: "text" },
  /* A POSIÇÃO NO PLANO, como bloco e pessoa já tem. */
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  /* O CANAL: qual motor produz o descontentamento dele. */
  reads: { kind: "text", values: ["debt", "share", "capacity"] },
  /* AS ÁREAS QUE ELE REPRESENTA, e só para quem lê `capacity`. Vazio nos outros. */
  areas: { kind: "text", optional: true },
  /* QUANTO ELE PESA na ruptura econômica da queda, de 0 a 1. */
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
    label: "Mercado financeiro",
    /* ELE NÃO PEDE LEI, EXIGE SUPERÁVIT — e essa e a diferença dele para os outros três: não
       há o que assinar para agrada-lo, só o que deixar de gastar. */
    wants: "que a dívida pare de crescer",
    /* No extremo liberal do eixo econômico, e indiferente no de liberdades: o credor da
       dívida não tem opinião sobre costumes. */
    economic: 88,
    liberty: 55,
    reads: "debt",
    weight: 0.35,
  },
  {
    id: "fisiologismo",
    label: "Parlamentares",
    /* ⚠ FOME DE EXECUÇÃO, E NÃO IDEOLOGIA. */
    wants: "que a torneira das emendas fique aberta",
    economic: 50,
    liberty: 50,
    reads: "share",
    weight: 0.3,
  },
  {
    id: "produtivo",
    label: "Indústria e agro",
    wants: "estrada, crédito e safra escoada",
    economic: 76,
    liberty: 58,
    reads: "capacity",
    areas: "agriculture industry",
    weight: 0.35,
  },
  {
    id: "ordem",
    label: "Militares e polícia",
    /* O único dos quatro que se move no eixo das LIBERDADES, e e por isso que ele existe
       separado: um governo pode agradar o mercado e o produtivo ao mesmo tempo e ter este
       contra, porque o que ele cobra não e dinheiro. */
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

/* A CALIBRAGEM DA CALDEIRA E PRIMEIRO CHUTE DECLARADO — como o PIVOT de ECLUSA, o TABLE da
   Mesa e o ANSWER_TIME da carta. O que NÃO e chute são duas desigualdades:
   ⚠ `cool` MENOR que `rise`, porque reputação se perde mais rapido do que se recupera: a
   0,18 contra 0,06, um mês de descaso custa três meses de atenção para desfazer, e uma
   caldeira simétrica seria um pendulo — bastaria alternar quem se agrada para nunca
   esquentar nada;
   ⚠ `brokerBoil` MAIOR que `boil`, porque o fisiologismo e o último a virar: ele ganha
   dinheiro sustentando, e enquanto houver torneira ele fica. */
/* ⚠ O GOVERNO PASSIVO SOBREVIVER E UM RESULTADO, e não um defeito de calibragem: não
   gastar AGRADA o mercado, e o capital o abriga. Ele perde o baixo clero e perde a rua —
   mas não cai. A CALDEIRA torna a passividade perigosa e não a torna fatal, e forçar
   números até ela ser fatal seria calibrar para obter a conclusão desejada. */
/* ⚠ Comecei em 35, sem razão nenhuma além de gosto, e a medição mostrou o preço de um chute:
   DUAS exigências em 48 meses, as duas depois do mês 45 — instrumento que nunca dispara e o
   achado 3 deste projeto se repetindo. */
export const PRESSURE = {
  rise: 0.18,
  cool: 0.06,
  /* ⚠ O QUE ELES CONSERTAM ESTA MEDIDO: com a Camara de nove legendas, um governo de
     MANUTENCAO — que aperta o orcamento até caber no teto e paga só a base — via a ruptura
     politica abrir no mês 12 e caia no mês 50, no último mês do mandato. */
  boil: 68,
  streetFloor: 16,
  brokerBoil: 86,
  demandAt: 30,
  spite: 0.25,
};
