/* OS MINISTROS DO CORTE — quem se senta à mesa do contingenciamento (ciclo 31, E0).

   O cargo define o que a pessoa defende: a verba da própria pasta. A semente escolhe, dentro
   das faixas, como ela defende. As faixas são as mesmas para todo cargo e são parâmetro de
   design sem fonte, a calibrar no playtest: temperamento por pasta seria invenção. A Fazenda
   não se senta como competidora; ela dá o parecer e guarda o espaço. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/**
 * @typedef {object} MinisterRole
 * @property {string} id
 * @property {string} area - a pasta que ele defende; o nome vem do catálogo de áreas
 * @property {number} riskMin - aversão a risco: abaixo de 1 insiste depois de uma recusa
 * @property {number} riskMax
 * @property {number} persistMin - persistência: multiplica a mudança que reabre a posição
 * @property {number} persistMax
 * @property {number} hopeMin - o prior de que o Presidente aceite o que ele pede, de 0 a 1
 * @property {number} hopeMax
 * @property {number} fiscalMin - o peso que ele dá ao espaço fiscal contra a verba da pasta
 * @property {number} fiscalMax
 */

/** @type {Schema} */
export const MINISTER_SCHEMA = {
  id: { kind: "id" },
  area: { kind: "id" },
  riskMin: { kind: "number", min: 0, max: 3 },
  riskMax: { kind: "number", min: 0, max: 3 },
  persistMin: { kind: "number", min: 0.5, max: 4 },
  persistMax: { kind: "number", min: 0.5, max: 4 },
  hopeMin: { kind: "number", min: 0, max: 1 },
  hopeMax: { kind: "number", min: 0, max: 1 },
  fiscalMin: { kind: "number", min: 0, max: 1 },
  fiscalMax: { kind: "number", min: 0, max: 1 },
};

const TEMPER = {
  riskMin: 0.4,
  riskMax: 1.6,
  persistMin: 0.8,
  persistMax: 2.5,
  hopeMin: 0.55,
  hopeMax: 0.95,
  fiscalMin: 0,
  fiscalMax: 0.5,
};

/** @type {ReadonlyArray<MinisterRole>} */
export const MINISTERS = [
  { id: "minister-agriculture", area: "agriculture", ...TEMPER },
  { id: "minister-industry", area: "industry", ...TEMPER },
  { id: "minister-welfare", area: "welfare", ...TEMPER },
  { id: "minister-health", area: "health", ...TEMPER },
  { id: "minister-education", area: "education", ...TEMPER },
  { id: "minister-security", area: "security", ...TEMPER },
  { id: "minister-defense", area: "defense", ...TEMPER },
];

/**
 * @typedef {object} Contingency
 * @property {number} material - fração do pedido da pasta que conta como mudança de verba
 * @property {number} hopeMaterial - mudança na chance de aceitação que conta
 * @property {number} conflict
 * @property {number} risk
 */

/** @type {Schema} */
export const CONTINGENCY_SCHEMA = {
  material: { kind: "number", min: 0, max: 1 },
  hopeMaterial: { kind: "number", min: 0, max: 1 },
  conflict: { kind: "number", min: 0, max: 1 },
  risk: { kind: "number", min: 0, max: 1 },
};

/** @type {Contingency} */
export const CONTINGENCY = { material: 0.05, hopeMaterial: 0.25, conflict: 0.05, risk: 0.5 };
