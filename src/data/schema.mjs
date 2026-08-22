/* O catalogo vai ser editavel pelo jogador mais adiante (a aba de edicao de nome e logo e
   decisao fechada), e dado editavel que entra sem validacao vira defeito longe da origem: um
   campo com texto onde deveria haver numero nao quebra na edicao, quebra tres motores depois,
   num calculo que parece errado sem motivo. */

/**
 * ⚠ ELE E RARO DE PROPOSITO.
 *
 * @typedef {object} Field
 * @property {"id" | "text" | "number"} kind
 * @property {boolean} [optional] - o campo pode faltar, e faltar SIGNIFICA alguma
 * coisa. Ele nasceu com a VINCULACAO: tres programas obrigam por fracao da receita
 * e trinta e cinco obrigam por pontos, e exigir `bound: 0` nos trinta e cinco seria
 * afirmar que eles tem vinculacao de zero por cento — que e diferente de nao ter
 * vinculacao nenhuma. Ausencia declarada, e nao ausencia disfarcada, aplicada a
 * catalogo.
 * @property {ReadonlyArray<string>} [values] - o VOCABULARIO fechado de um `text`.
 * @property {number} [min] - so para `number`, e inclusivo
 * @property {number} [max] - so para `number`, e inclusivo
 * @typedef {Record<string, Field>} Schema
 */

/* Nao e preciosismo: id que difere so por caixa funciona no Windows e some no CI Linux, e
   essa classe inteira de defeito desaparece com minusculas. */
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Confere UM registro contra um esquema e devolve os problemas.
 *
 * @param {Schema} schema
 * @param {Record<string, unknown>} record
 * @param {string} where rotulo de onde o registro veio, para o achado ser util
 * @returns {string[]}
 */
export function violations(schema, record, where) {
  /** @type {string[]} */
  const found = [];

  for (const [field, rule] of Object.entries(schema)) {
    const value = record[field];

    if (value === undefined) {
      if (!rule.optional) found.push(`${where}: falta o campo "${field}"`);
      continue;
    }

    if (rule.kind === "number") {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        found.push(`${where}: "${field}" devia ser numero e e ${typeof value}`);
        continue;
      }
      if (rule.min !== undefined && value < rule.min) {
        found.push(`${where}: "${field}" e ${value}, abaixo do minimo ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        found.push(`${where}: "${field}" e ${value}, acima do maximo ${rule.max}`);
      }
      continue;
    }

    if (typeof value !== "string" || value.length === 0) {
      found.push(`${where}: "${field}" devia ser texto e e ${typeof value}`);
      continue;
    }

    if (rule.kind === "id" && !ID.test(value)) {
      found.push(`${where}: o id "${value}" foge do kebab-case minusculo`);
    }

    if (rule.values && !rule.values.includes(value)) {
      found.push(
        `${where}: "${field}" e "${value}", fora do vocabulario [${rule.values.join(", ")}]`,
      );
    }
  }

  /* CAMPO A MAIS TAMBEM E VIOLACAO. */
  for (const field of Object.keys(record)) {
    if (!(field in schema)) found.push(`${where}: o campo "${field}" nao existe no esquema`);
  }

  return found;
}

/**
 * Confere uma colecao inteira, incluindo a unicidade dos identificadores.
 *
 * @param {Schema} schema
 * @param {ReadonlyArray<Record<string, unknown>>} records
 * @param {string} where
 * @returns {string[]}
 */
export function collectionViolations(schema, records, where) {
  const found = records.flatMap((record, index) =>
    violations(schema, record, `${where}[${index}]`),
  );

  /* ID REPETIDO E O DEFEITO MAIS CARO desta lista, porque ele nao aparece como erro: o motor
     acha o primeiro, ignora o segundo, e uma bancada inteira simplesmente deixa de votar sem
     nada quebrar. */
  const seen = new Set();
  for (const record of records) {
    const id = record["id"];
    if (typeof id !== "string") continue;
    if (seen.has(id)) found.push(`${where}: o id "${id}" aparece mais de uma vez`);
    seen.add(id);
  }

  return found;
}
