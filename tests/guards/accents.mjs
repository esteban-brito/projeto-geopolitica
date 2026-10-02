/* GUARDA · ACENTOS — comentário e documento ativo se escrevem em português correto.
   Ela lê só a prosa: comentário de `.mjs` (pelo tokenizador) e de `.css`, e o Markdown fora
   de `docs/archive/`. Fica de fora o que é contrato ou código: linha com `@` ou `{`, trecho
   entre crases, caminho, URL, alvo de link, bloco de código e comentário em inglês. Acusa a
   palavra do dicionário de `tests/lib/accents.mjs` escrita sem acento. */

import { tokenizer } from "acorn";
import { ACCENTED } from "../lib/accents.mjs";
import { collect, isGuardSource } from "../lib/project.mjs";

export const name = "accents";

/* Palavra inglesa solta, nunca dentro de caminho: com `\b`, o "the-" de `the-base-model.md` fazia
   o comentário inteiro passar por inglês, e três palavras sem acento escaparam. */
const ENGLISH = /(?<![\w-])(the|and|with|from|this|is|of|when|which)(?![\w-])/;
const MASK = /`[^`\n]*`|[a-z]+:\/\/\S+|\S*\/\S*|\]\([^)]*\)|<[^>\n]+>|\[\^?[\w-]+\]/g;
const ENCLITIC = /^-(lo|la|los|las|se|lhe|lhes|me|te|nos)\b/;

/**
 * As palavras sem acento de uma linha de prosa.
 *
 * @param {string} line
 * @returns {string[]}
 */
function missing(line) {
  if (/[@{}]/.test(line)) return [];
  const text = line.replace(MASK, match => " ".repeat(match.length));
  /** @type {string[]} */
  const found = [];
  for (const match of text.matchAll(/\p{L}+/gu)) {
    const word = match[0];
    if (!ACCENTED.has(word.toLowerCase())) continue;
    const at = match.index;
    const before = text[at - 1] ?? " ";
    const after = text[at + word.length] ?? " ";
    const next = text[at + word.length + 1] ?? " ";
    if (/[._$#\\0-9-]/.test(before) || /[_$(0-9]/.test(after)) continue;
    if (after === "." && /\p{L}/u.test(next)) continue;
    if (after === "-" && !ENCLITIC.test(text.slice(at + word.length))) continue;
    found.push(word);
  }
  return found;
}

/**
 * Os trechos de prosa de um arquivo, com a linha em que cada um começa.
 *
 * @param {string} path
 * @param {string} source
 * @returns {{ line: number, text: string }[]}
 */
function proseOf(path, source) {
  /** @param {number} offset */
  const lineAt = offset => source.slice(0, offset).split("\n").length;
  if (path.endsWith(".md")) {
    return [
      { line: 1, text: source.replace(/^```[\s\S]*?^```$/gm, m => m.replace(/[^\n]/g, " ")) },
    ];
  }
  if (path.endsWith(".css")) {
    return [...source.matchAll(/\/\*[\s\S]*?\*\//g)].map(m => ({
      line: lineAt(m.index),
      text: m[0],
    }));
  }
  /** @type {{ line: number, text: string }[]} */
  const comments = [];
  try {
    const onComment = (
      /** @type {boolean} */ _block,
      /** @type {string} */ text,
      /** @type {number} */ start,
    ) => comments.push({ line: lineAt(start), text });
    Array.from(tokenizer(source, { ecmaVersion: "latest", sourceType: "module", onComment }));
  } catch {
    return [];
  }
  return comments;
}

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);
  for (const [path, source] of files) {
    if (isGuardSource(path) || path === "tests/lib/accents.mjs") continue;
    if (path.endsWith(".md") ? path.startsWith("docs/archive/") : !/\.(mjs|css)$/.test(path))
      continue;
    for (const { line, text } of proseOf(path, source)) {
      if (!path.endsWith(".md") && ENGLISH.test(text)) continue;
      for (const [offset, row] of text.split("\n").entries()) {
        const words = missing(row);
        if (words.length) add(`${path}:${line + offset} sem acento: ${words.join(", ")}`);
      }
    }
  }
  return list;
}

export const synthetic = [
  {
    label: "comentário de código sem acento",
    files: new Map([["src/x.mjs", "/* Isto nao pode. */\nexport const a = 1;"]]),
  },
  {
    label: "comentário de folha sem acento",
    files: new Map([["styles/x.css", "/* So aqui. */\n.a { color: red; }"]]),
  },
  {
    label: "documento ativo sem acento",
    files: new Map([["docs/x.md", "# Titulo\n\nA decisao vale."]]),
  },
];
