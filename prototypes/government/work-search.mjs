/**
 * @typedef {{id: string, label: string}} SearchWork
 * @typedef {{id?: string, text: string}} SearchPart
 * @typedef {{id: string, parts: readonly SearchPart[]}} SearchOffice
 * @typedef {Readonly<Record<string, readonly string[]>>} Aliases
 * @typedef {{kind: 'term'|'and'|'or'|'not'|'open'|'close', text: string}} Token
 * @typedef {{status: 'matched'|'empty'|'unknown'|'invalid', ids: string[], unknown: string[], reason: string}} SearchResult
 */

/** @type {Aliases} */
export const SEARCH_ALIASES = Object.freeze({
  pf: Object.freeze(["polícia federal"]),
  "sistema unico de saude": Object.freeze(["SUS"]),
  tributos: Object.freeze(["impostos"]),
  ciberseguranca: Object.freeze(["segurança da informação", "defesa cibernética"]),
  escolas: Object.freeze(["educação básica", "escola"]),
  universidades: Object.freeze(["universidades"]),
});

/** @param {string} text */
const fold = text => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
/** @param {string} text */
const phrase = text =>
  fold(text)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/** @param {string} query @returns {Token[]} */
function tokenize(query) {
  /** @type {Token[]} */
  const tokens = [];
  /** @type {Readonly<Record<string, Token['kind']>>} */
  const operators = {
    e: "and",
    and: "and",
    ou: "or",
    or: "or",
    nao: "not",
    not: "not",
    "(": "open",
    ")": "close",
  };
  for (const word of fold(query).match(/\u0022[^\u0022]*\u0022|[()]|[^()\s\u0022]+|\u0022/gu) ??
    []) {
    if (word === '"') throw new Error("Expressão entre aspas incompleta.");
    const quoted = word.startsWith('"');
    const kind = quoted ? "term" : (operators[word] ?? "term");
    const text = kind === "term" ? phrase(word) : word;
    if (kind === "term" && !text) throw new Error("Escreva uma palavra ou expressão.");
    const previous = tokens.at(-1);
    if (!quoted && kind === "term" && previous?.kind === "term") previous.text += " " + text;
    else tokens.push({ kind, text });
  }
  return tokens;
}

/** @param {Token[]} tokens @returns {Token[]} */
function postfix(tokens) {
  /** @type {Token[]} */
  const output = [];
  /** @type {Token[]} */
  const operators = [];
  const priority = { term: 0, open: 0, close: 0, or: 1, and: 2, not: 3 };
  let operand = true;
  for (const token of tokens) {
    if (token.kind === "term") {
      if (!operand) throw new Error("Separe as expressões com e ou ou.");
      output.push(token);
      operand = false;
    } else if (token.kind === "open" || token.kind === "not") {
      if (!operand) throw new Error("Use e ou ou antes desta expressão.");
      operators.push(token);
    } else if (token.kind === "close") {
      if (operand) throw new Error("Falta uma expressão antes de fechar o parêntese.");
      while (operators.at(-1)?.kind !== "open") {
        const operator = operators.pop();
        if (!operator) throw new Error("Parêntese de abertura ausente.");
        output.push(operator);
      }
      operators.pop();
      operand = false;
    } else {
      if (operand) throw new Error("Falta uma expressão junto ao operador.");
      while (
        operators.at(-1) &&
        priority[operators.at(-1)?.kind ?? "open"] >= priority[token.kind]
      ) {
        const operator = operators.pop();
        if (operator) output.push(operator);
      }
      operators.push(token);
      operand = true;
    }
  }
  if (operand) throw new Error("Complete a expressão de busca.");
  while (operators.length) {
    const operator = operators.pop();
    if (!operator) break;
    if (operator.kind === "open") throw new Error("Feche o parêntese da expressão.");
    output.push(operator);
  }
  return output;
}

/** @param {readonly SearchWork[]} works @param {string} query @param {Aliases} [aliases] @returns {SearchResult} */
export function searchWork(works, query, aliases = SEARCH_ALIASES) {
  const inventory = new Map(works.map(work => [work.id, " " + phrase(work.label) + " "]));
  if (inventory.size !== works.length)
    throw new Error("Inventário de busca com identidade duplicada.");
  const ids = [...inventory.keys()].sort();
  if (!query.trim())
    return { status: ids.length ? "matched" : "empty", ids, unknown: [], reason: "" };
  /** @type {Token[]} */
  let expression;
  try {
    expression = postfix(tokenize(query));
  } catch (error) {
    return {
      status: "invalid",
      ids: [],
      unknown: [],
      reason: error instanceof Error ? error.message : "Revise a expressão de busca.",
    };
  }
  const vocabulary = new Map(
    Object.entries(aliases).map(([key, values]) => [phrase(key), values.map(phrase)]),
  );
  /** @type {Map<string, Set<string>>} */
  const terms = new Map();
  for (const token of expression.filter(token => token.kind === "term")) {
    const phrases = vocabulary.get(token.text) ?? [token.text];
    terms.set(
      token.text,
      new Set(
        ids.filter(id => phrases.some(text => inventory.get(id)?.includes(" " + text + " "))),
      ),
    );
  }
  const unknown = [...terms]
    .filter(([, matches]) => !matches.size)
    .map(([text]) => text)
    .sort();
  if (unknown.length)
    return {
      status: "unknown",
      ids: [],
      unknown,
      reason: "Sem correspondência para " + unknown.map(text => "“" + text + "”").join(", ") + ".",
    };
  /** @type {Set<string>[]} */
  const stack = [];
  for (const token of expression) {
    if (token.kind === "term") stack.push(terms.get(token.text) ?? new Set());
    else {
      const right = stack.pop() ?? new Set();
      if (token.kind === "not") stack.push(new Set(ids.filter(id => !right.has(id))));
      else {
        const left = stack.pop() ?? new Set();
        stack.push(
          token.kind === "and"
            ? new Set([...left].filter(id => right.has(id)))
            : new Set([...left, ...right]),
        );
      }
    }
  }
  const result = [...(stack[0] ?? [])].sort();
  return {
    status: result.length ? "matched" : "empty",
    ids: result,
    unknown: [],
    reason: result.length ? "" : "Nenhuma atribuição combina esses termos.",
  };
}

/** @param {readonly SearchOffice[]} offices @param {string} query @param {Aliases} [aliases] */
export function searchDestinations(offices, query, aliases = SEARCH_ALIASES) {
  const candidates = offices.map(office => ({
    id: office.id,
    parts: office.parts.map(part => ({
      id: part.id ?? "work:" + phrase(part.text),
      text: part.text,
    })),
  }));
  /** @type {Map<string, SearchWork>} */
  const works = new Map();
  for (const office of candidates)
    for (const part of office.parts) {
      const previous = works.get(part.id);
      if (previous && previous.label !== part.text)
        throw new Error("Identidade de trabalho com descrições conflitantes.");
      works.set(part.id, { id: part.id, label: part.text });
    }
  const result = searchWork([...works.values()], query, aliases);
  const found = new Set(result.ids);
  return {
    ...result,
    matches: candidates
      .map(office => ({ id: office.id, parts: office.parts.filter(part => found.has(part.id)) }))
      .filter(office => office.parts.length || !query.trim())
      .sort((first, second) => (first.id < second.id ? -1 : first.id > second.id ? 1 : 0)),
  };
}
