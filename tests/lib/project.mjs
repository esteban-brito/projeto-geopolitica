/* Leitura do projeto, e o contrato que todas as guardas seguem.
   ══════════════════════════════════════════════════════════════════════════════

   TODA GUARDA E UMA FUNCAO PURA: recebe um mapa `caminho -> conteudo` e devolve
   uma lista de achados. Ela nunca lê o disco por conta propria.

   Isso nao e purismo — e o que torna a PROVA SINTETICA trivial. Uma guarda que
   lê arquivos diretamente so pode ser testada criando arquivos de mentira no
   disco, entao na pratica ninguem testa, e uma guarda que nunca falhou e
   cobertura presumida, nao cobertura. Aqui, provar que ela consegue acusar
   custa um objeto literal. */

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
 * Coletor de achados. As sete guardas repetiam as mesmas tres linhas para
 * montar a lista — e repeticao entre pecas que fazem a mesma coisa e como um
 * padrao comeca a divergir, que e literalmente o que este projeto guarda.
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
export function listFiles(dir = ROOT) {
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

/* ARQUIVOS DE GUARDA CONTEM DEFEITO COMO DADO.
   As provas sinteticas carregam, de proposito, `require(`, `export default`,
   `var(--nao-existe)` e um identificador acentuado — e a primeira execucao do
   runner acusou tres guardas por lerem a si mesmas. Uma guarda que se defende do
   proprio teste sintetico parece guarda quebrada, e relaxar o casador para
   silencia-la seria destruir a cobertura real.
   A saida e excluir o CONTEUDO destes arquivos das varreduras de codigo. O NOME
   deles continua sendo cobrado normalmente. */
/** @param {string} path */
export function isGuardSource(path) {
  return path.startsWith("tests/guards/");
}

/** Remove comentarios de JavaScript antes de qualquer casamento.
 *
 * Pela mesma razao da versao de CSS, e o custo de nao fazer isto ja apareceu
 * nesta bancada: o comentario que EXPLICA a excecao acima cita `require(` e
 * `var(--nao-existe)` como exemplos, e duas guardas o leram como codigo. Prosa
 * que descreve um defeito nao e o defeito.
 * O `[^:]` antes de `//` evita comer o resto de uma URL.
 *
 * @param {string} source
 * @returns {string}
 */
export function stripJsComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

/** Remove comentarios de CSS antes de qualquer casamento.
 *
 * Isto nao e detalhe: as folhas deste projeto explicam cada decisao em prosa, e
 * um casador que leia comentario acusa defeito onde ha justificativa. Preserva
 * as quebras de linha para que o numero da linha continue valendo.
 *
 * @param {string} css
 * @returns {string}
 */
export function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (/** @type {string} */ block) =>
    block.replace(/[^\n]/g, " "),
  );
}
