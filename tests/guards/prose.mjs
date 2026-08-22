/* GUARDA · PROSA — o comentario tem teto, e o teto e por BLOCO.

   Metade deste projeto ja foi comentario: 15.961 linhas de prosa contra 15.737 de
   codigo, com um arquivo a 85%. O custo nao e disco — e auditoria: quem procura uma
   regra rola por paragrafos de diario para achar tres linhas de CSS.

   ⚠ O TETO E POR BLOCO, E NAO POR ARQUIVO, e a primeira versao desta guarda media o
   percentual do arquivo. Ela punia o lugar errado: um utilitario pequeno e bem
   documentado — nove funcoes, uma linha de resumo cada — dava 38% sem uma linha de
   diario dentro dele, enquanto um arquivo grande escondia um ensaio de 24 linhas e
   passava. O que atrapalha quem le nao e a soma: e o bloco em que ele tropeca.

   ⚠ LINHA DE TIPO NAO CONTA. `@typedef`, `@param` e `@property` sao contrato, e puni-las
   empurraria o projeto para tipagem implicita — o oposto do que se quer. */

import { collect } from "../lib/project.mjs";

export const name = "prose";

/* Teto de um bloco no corpo do arquivo. Ver `CLAUDE.md`. */
const CAP = 10;

/* O cabecalho pode mais: ele carrega o proposito do arquivo inteiro. */
const HEAD_CAP = 14;

const TYPE = /@(ts-|type|param|returns?|typedef|property|satisfies|template|see|throws)/;

/**
 * Os blocos de comentario de um arquivo, com a linha em que cada um abre.
 *
 * @param {string} source
 * @returns {{ line: number, prose: number }[]}
 */
export function blocksOf(source) {
  const lines = source.split("\n");
  /** @type {{ line: number, prose: number }[]} */
  const found = [];

  let open = -1;
  let prose = 0;
  let typing = false;

  for (const [index, raw] of lines.entries()) {
    const text = raw.trim();

    if (open < 0 && text.startsWith("/*")) {
      /* Bloco que abre e fecha na mesma linha nunca e um ensaio. */
      if (text.includes("*/")) continue;
      open = index;
      prose = TYPE.test(text) ? 0 : 1;
      typing = TYPE.test(text);
      continue;
    }

    if (open < 0) continue;

    /* ⚠ A CONTINUACAO DE UM TIPO TAMBEM E TIPO. Uma uniao longa quebra em tres linhas
       e so a primeira traz o `@` — contadas como prosa, elas acusavam a assinatura de
       `cabinetHtml` de ser um ensaio de 18 linhas. */
    const body = text.replace(/^\*\s?/, "");
    const continua = typing && (body === "" || /^[|}[(]/.test(body) || /^[a-z]/.test(body));

    if (TYPE.test(text)) typing = true;
    else if (!continua) typing = false;

    if (!TYPE.test(text) && !continua) prose++;

    if (text.includes("*/")) {
      found.push({ line: open + 1, prose });
      open = -1;
      typing = false;
    }
  }

  return found;
}

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  for (const [path, source] of files) {
    if (!/^(src|styles|tools)\//.test(path)) continue;
    if (!/\.(mjs|css)$/.test(path)) continue;

    for (const [index, block] of blocksOf(source).entries()) {
      const cap = index === 0 ? HEAD_CAP : CAP;
      if (block.prose <= cap) continue;
      add(
        `${path}:${block.line} tem um bloco de ${block.prose} linhas, e o teto e ${cap} — ` +
          `guarde a licao medida (a alternativa testada, com o numero que a reprovou) ` +
          `e corte o diario: data, citacao e historico moram no handoff e no git`,
      );
    }
  }

  return list;
}

const CODE = new Array(30).fill("const a = 1;").join("\n");
const HEAD = ["/* cabecalho", "   curto */", "const z = 0;", ""].join("\n");
const ENSAIO = new Array(20).fill("   historia").join("\n");

export const synthetic = [
  {
    label: "ensaio no corpo do arquivo",
    files: new Map([["src/x.mjs", `${HEAD}/*\n${ENSAIO}\n*/\n${CODE}`]]),
  },
  {
    label: "ensaio em folha de estilo",
    files: new Map([["styles/x.css", `${HEAD}/*\n${ENSAIO}\n*/\n.a {\n  color: red;\n}\n`]]),
  },
  {
    label: "cabecalho tambem tem teto",
    files: new Map([["src/x.mjs", `/*\n${ENSAIO}\n*/\n${CODE}`]]),
  },
];
