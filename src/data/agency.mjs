/* A VONTADE DAS PESSOAS — o que ministros e porta-vozes de partido querem, e quanto pesa cada
   gesto que eles podem fazer. Tudo aqui é desenho sem fonte, a calibrar pela sonda passiva do
   simulador e, depois, pela orientação do governo nos dados abertos da Câmara (pesquisa 15). */

/** @typedef {import("./schema.mjs").Schema} Schema */

/**
 * @typedef {object} Drive o quanto uma ambição pesa cada objetivo do porta-voz
 * @property {string} id - a ambição
 * @property {number} served - receber pastas na proporção da bancada
 * @property {number} wear - não se desgastar com um governo impopular
 * @property {number} money - receber a verba das emendas que o governo promete
 *
 * @typedef {object} Agency
 * @property {number} hurt - fração da dignidade que um pedido recusado ou ignorado leva
 * @property {number} heal - fração do que falta que um pedido atendido devolve
 * @property {number} drift - fração do que falta que um mês sem ofensa devolve
 * @property {number} content - o financiamento da área, contra o pedido, que satisfaz o ministro
 * @property {number} fundingSpan - a distância do financiamento que leva a queixa ao máximo
 * @property {number} dignityTarget - abaixo disso, a pessoa se sente desrespeitada
 * @property {number} dignityFloor - abaixo disso, a humilhação justifica sair
 * @property {number} bandwagon - pontos de aprovação acima do neutro que fazem quem saiu pedir para voltar
 * @property {number} wearFloor - o desgaste que um porta-voz tolera por ficar na base
 * @property {number} pull - a fração do ganho de um pedido que a queixa pública consegue
 * @property {number} face - a fração da dignidade perdida que a queixa pública devolve
 * @property {number} exposure - o risco de perder o cargo por reclamar em público
 * @property {number} threatRisk - a fração do ganho de uma ameaça que pode não vir
 * @property {number} quiet - meses entre dois gestos públicos da mesma pessoa
 * @property {number} answerQuality - o quanto uma resposta do Presidente ensina: uma recusa não é certeza
 * @property {number} repeat - o quanto uma ameaça repetida ainda salva a cara, a cada repetição
 * @property {number} moneyFloor - a fração da verba prometida que satisfaz o porta-voz
 * @property {number} hopeMin - o prior de ser atendido, faixa gerada pela semente
 * @property {number} hopeMax
 * @property {number} prideMin - o peso da dignidade, faixa gerada pela semente
 * @property {number} prideMax
 * @property {number} holdMin - o apego ao cargo do ministro, faixa gerada pela semente
 * @property {number} holdMax
 * @property {number} riskMin - a aversão a risco do porta-voz, faixa gerada pela semente
 * @property {number} riskMax
 */

/** @type {Schema} */
export const AGENCY_SCHEMA = {
  hurt: { kind: "number", min: 0, max: 1 },
  heal: { kind: "number", min: 0, max: 1 },
  drift: { kind: "number", min: 0, max: 1 },
  content: { kind: "number", min: 0, max: 1.5 },
  fundingSpan: { kind: "number", min: 0.01, max: 1 },
  dignityTarget: { kind: "number", min: 0, max: 1 },
  dignityFloor: { kind: "number", min: 0, max: 1 },
  bandwagon: { kind: "number", min: 0, max: 65 },
  wearFloor: { kind: "number", min: 0, max: 1 },
  pull: { kind: "number", min: 0, max: 1 },
  face: { kind: "number", min: 0, max: 1 },
  exposure: { kind: "number", min: 0, max: 1 },
  threatRisk: { kind: "number", min: 0, max: 1 },
  quiet: { kind: "number", min: 0, max: 12 },
  answerQuality: { kind: "number", min: 0.01, max: 0.99 },
  repeat: { kind: "number", min: 0, max: 1 },
  moneyFloor: { kind: "number", min: 0, max: 1 },
  hopeMin: { kind: "number", min: 0, max: 1 },
  hopeMax: { kind: "number", min: 0, max: 1 },
  prideMin: { kind: "number", min: 0, max: 3 },
  prideMax: { kind: "number", min: 0, max: 3 },
  holdMin: { kind: "number", min: 0, max: 3 },
  holdMax: { kind: "number", min: 0, max: 3 },
  riskMin: { kind: "number", min: 0, max: 3 },
  riskMax: { kind: "number", min: 0, max: 3 },
};

/** @type {Agency} */
export const AGENCY = {
  hurt: 0.3,
  heal: 0.5,
  drift: 0.08,
  content: 0.95,
  fundingSpan: 0.3,
  dignityTarget: 0.8,
  dignityFloor: 0.5,
  bandwagon: 15,
  wearFloor: 0.15,
  pull: 0.3,
  face: 0.5,
  exposure: 0.25,
  threatRisk: 0.5,
  quiet: 3,
  answerQuality: 0.6,
  repeat: 0.5,
  moneyFloor: 0.8,
  hopeMin: 0.45,
  hopeMax: 0.9,
  prideMin: 0.2,
  prideMax: 1.6,
  holdMin: 0.5,
  holdMax: 1.5,
  riskMin: 0.6,
  riskMax: 1.6,
};

/** @type {Schema} */
export const DRIVE_SCHEMA = {
  id: { kind: "id" },
  served: { kind: "number", min: 0, max: 3 },
  wear: { kind: "number", min: 0, max: 3 },
  money: { kind: "number", min: 0, max: 3 },
};

/* A ambição decide o que o porta-voz troca por quê: quem quer ministério aguenta governo
   impopular em troca de pasta; quem quer suceder o Presidente em 2030 foge dele; quem quer o
   governo do estado precisa da verba para a base. */
/** @type {ReadonlyArray<Drive>} */
export const DRIVES = [
  { id: "cabinet", served: 1.5, wear: 0.4, money: 0.6 },
  { id: "state", served: 0.8, wear: 1, money: 1.2 },
  { id: "succession", served: 0.4, wear: 1.6, money: 0.4 },
  { id: "seat", served: 0.6, wear: 1.2, money: 1 },
  { id: "court", served: 0.3, wear: 0.3, money: 0.3 },
];
