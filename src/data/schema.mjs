/* ESQUEMA — a fronteira de validacao do dado editavel.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE UM DADO PRECISA DE FRONTEIRA. O catalogo vai ser editavel pelo jogador
   mais adiante (a aba de edicao de nome e logo e decisao fechada), e dado
   editavel que entra sem validacao vira defeito longe da origem: um campo com
   texto onde deveria haver numero nao quebra na edicao, quebra tres motores
   depois, num calculo que parece errado sem motivo.

   O ESQUEMA E DADO, e nao codigo de validacao espalhado. Ele declara os campos
   de uma colecao num objeto, e a mesma declaracao serve para tres coisas: a
   guarda `schema` prova que toda colecao tem uma, a suite prova que todo
   registro obedece a sua, e a edicao futura tem onde perguntar o que e valido.

   O QUE ELE NAO FAZ, de proposito: nao converte, nao preenche padrao e nao
   conserta. Validador que conserta esconde o erro em vez de mostrar — e o dado
   que chega errado precisa parar na fronteira, nao seguir remendado. */

/**
 * @typedef {object} Field
 * @property {"id" | "text" | "number"} kind
 * @property {number} [min] - so para `number`, e inclusivo
 * @property {number} [max] - so para `number`, e inclusivo
 *
 * @typedef {Record<string, Field>} Schema
 */

/* IDENTIFICADOR E `kebab-case` MINUSCULO, como todo nome deste projeto. Nao e
   preciosismo: id que difere so por caixa funciona no Windows e some no CI
   Linux, e essa classe inteira de defeito desaparece com minusculas. */
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Confere UM registro contra um esquema e devolve os problemas.
 *
 * Devolve lista em vez de lancar porque quem chama quer saber TODOS os
 * problemas de uma vez: validador que morre no primeiro erro obriga a corrigir
 * um por execucao, e um catalogo com doze campos errados viraria doze rodadas.
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
      found.push(`${where}: falta o campo "${field}"`);
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
  }

  /* CAMPO A MAIS TAMBEM E VIOLACAO. Um campo que ninguem declarou e um campo
     que nenhum motor lê: ou o esquema esta incompleto, ou o dado tem lixo. As
     duas leituras exigem decisao humana, e silenciar as duas e o pior caminho. */
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

  /* ID REPETIDO E O DEFEITO MAIS CARO desta lista, porque ele nao aparece como
     erro: o motor acha o primeiro, ignora o segundo, e uma bancada inteira
     simplesmente deixa de votar sem nada quebrar. */
  const seen = new Set();
  for (const record of records) {
    const id = record["id"];
    if (typeof id !== "string") continue;
    if (seen.has(id)) found.push(`${where}: o id "${id}" aparece mais de uma vez`);
    seen.add(id);
  }

  return found;
}
