/* Leitura do projeto, e o contrato que todas as guardas seguem. */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

export const ROOT = resolve(import.meta.dirname, "..", "..");

const IGNORED = new Set(["node_modules", ".git", "vendor", "tmp", "captures", "assets-source"]);

/**
 * @typedef {object} Finding
 * @property {string} guard
 * @property {string} detail
 */

/**
 * As sete guardas repetiam as mesmas tres linhas para montar a lista — e repeticao entre
 * pecas que fazem a mesma coisa e como um padrao comeca a divergir, que e literalmente o que
 * este projeto guarda.
 *
 * @param {string} guard
 * @returns {{ list: Finding[], add: (detail: string) => void }}
 */
export function collect(guard) {
  /** @type {Finding[]} */
  const list = [];
  return { list, add: detail => list.push({ guard, detail }) };
}

/**
 * @param {string} [dir]
 * @returns {string[]} caminhos relativos, com "/" como separador em toda plataforma
 */
function listFiles(dir = ROOT) {
  /** @type {string[]} */
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORED.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full));
    else out.push(relative(ROOT, full).split(sep).join("/"));
  }
  return out;
}

/**
 * @param {(path: string) => boolean} filter
 * @returns {Map<string, string>}
 */
export function readProject(filter = () => true) {
  const files = new Map();
  for (const path of listFiles()) {
    if (!filter(path)) continue;
    if (/\.(png|webp|woff2|ico|jpg)$/.test(path)) continue;
    files.set(path, readFileSync(join(ROOT, path), "utf8"));
  }
  return files;
}

/* ARQUIVOS DE GUARDA CONTEM DEFEITO COMO DADO. */
/** @param {string} path */
export function isGuardSource(path) {
  return path.startsWith("tests/guards/");
}

/**
 * Prosa que descreve um defeito nao e o defeito.
 *
 * @param {string} source
 * @returns {string}
 */
/* Esta aqui apagava o comentario INTEIRO, quebras e tudo, e o preco era invisivel porque
   quase nenhuma guarda reporta linha. */
export function stripJsComments(source) {
  const blank = (/** @type {string} */ text) => text.replace(/[^\n]/g, " ");
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])(\/\/[^\n]*)/g, (_, before, comment) => before + blank(comment));
}

/**
 * Isto nao e detalhe: as folhas deste projeto explicam cada decisao em prosa, e um casador
 * que leia comentario acusa defeito onde ha justificativa.
 *
 * @param {string} css
 * @returns {string}
 */
export function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (/** @type {string} */ block) =>
    block.replace(/[^\n]/g, " "),
  );
}
