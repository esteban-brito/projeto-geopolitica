/* GUARDA · NOMES — uma forma de nomear, e só uma.
   ══════════════════════════════════════════════════════════════════════════════

   O QUE ELA COBRE, e por que cada item:

     · EXTENSÃO `.mjs` em todo módulo. O projeto anterior convive com 48 módulos
       ES e 63 arquivos CommonJS, e unificar virou escopo recusado por ser grande
       demais. Nascer com um formato só custa esta linha;
     · `kebab-case` sem acento e sem maiuscula. Nome que difere só por caixa
       funciona no Windows e some no CI Linux — a classe inteira de defeito
       desaparece com minúsculas em toda parte;
     · nada de CommonJS.

   O QUE ELA NÃO COBRE, e isto esta escrito de propósito: o IDIOMA dos
   identificadores. A convenção e inglês para mecanismo e português para dado,
   mas não existe casador honesto para isso — um que tentasse acusaria `selic` e
   `ipca`, que são nomes próprios e ficam no original por decisão. Fingir
   cobertura aqui seria pior que não ter: a próxima sessão confiaria nela.
   O que da para provar objetivamente e ACENTO em identificador, e isso e
   cobrado. */

import { tokenizer } from "acorn";
import { collect, isGuardSource, stripJsComments } from "../lib/project.mjs";

export const name = "naming";

const CODE_DIRS = ["src/", "tests/", "tools/"];

/* ARQUIVOS CUJO FORMATO E IMPOSTO POR UMA FERRAMENTA, e não escolhido por nos.
   O flat config do ESLint EXIGE `export default` — a guarda acusou isto na
   primeira execução, e ela estava certa em acusar: a convenção vale, e a
   exceção precisa ser declarada em vez de silenciada com um comentário de
   desativacao. Se um dia a lista crescer além de configuração de ferramenta, e
   sinal de que a convenção virou ficção. */
const TOOL_CONTRACT = new Set(["eslint.config.mjs"]);

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  for (const [path, source] of files) {
    const inCode = CODE_DIRS.some(dir => path.startsWith(dir));

    if (inCode && /\.js$/.test(path)) {
      add(`${path} usa .js — todo modulo do projeto e .mjs`);
    }

    const base = path.split("/").pop() ?? "";
    if (inCode && !/^[a-z0-9]+(-[a-z0-9]+)*\.(mjs|css|json|md)$/.test(base)) {
      add(`${path} foge do kebab-case minusculo`);
    }

    /* O NOME acima vale para todo arquivo; o CONTEÚDO abaixo pula os arquivos de
       guarda, que carregam estes defeitos como dado nas provas sintéticas. */
    if (!path.endsWith(".mjs") || isGuardSource(path)) continue;

    /* Comentário fora ANTES de tudo: prosa que descreve um defeito não e o
       defeito, e este arquivo mesmo explica CommonJS em texto.
       As strings também saem, porque texto de UI e português acentuado por
       decisão — acusa-lo seria falso positivo. */
    const code = stripJsComments(source).replace(
      /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|`(\\.|[^`\\])*`/g,
      '""',
    );

    if (/\brequire\s*\(|module\.exports\b/.test(code)) {
      add(`${path} usa CommonJS — o projeto e ESM em toda parte`);
    }
    if (/export\s+default\b/.test(code) && !TOOL_CONTRACT.has(path)) {
      add(
        `${path} tem export default — a convencao e export nomeado, que renomeia sem ambiguidade`,
      );
    }
    const accented = accentedIdentifier(source, code);
    if (accented) {
      add(`${path} tem o identificador acentuado "${accented}"`);
    }
  }

  return list;
}

/* Pelo tokenizador, não por regex: a regex que tirava as strings saía de fase numa regex
   literal com aspas (tests/suites/screens.mjs) e acusava nome de teste como identificador.
   Fonte que não parseia cai no casador antigo. */
/** @param {string} source @param {string} code @returns {string | null} */
function accentedIdentifier(source, code) {
  try {
    for (const token of tokenizer(source, { ecmaVersion: "latest", sourceType: "module" })) {
      if (token.type.label === "name" || token.type.label === "privateId") {
        const text = source.slice(token.start, token.end);
        if (/[^\x00-\x7F]/.test(text)) return text;
      }
    }
    return null;
  } catch {
    return (
      code.match(/[A-Za-z_$][A-Za-z0-9_$]*[áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ][^\s(){};,]*/)?.[0] ?? null
    );
  }
}

export const synthetic = [
  {
    label: "modulo em .js no lugar de .mjs",
    files: new Map([["src/state/state.js", "export const a = 1;"]]),
  },
  {
    label: "arquivo fora do kebab-case",
    files: new Map([["src/ui/screens/Dashboard.mjs", "export const a = 1;"]]),
  },
  {
    label: "CommonJS num modulo",
    files: new Map([["src/state/state.mjs", 'const fs = require("node:fs");']]),
  },
  {
    label: "export default",
    files: new Map([["src/state/state.mjs", "export default function () {}"]]),
  },
  {
    label: "identificador acentuado",
    files: new Map([["src/state/state.mjs", "export const orçamento = 1;"]]),
  },
  {
    label: "identificador que começa com acento",
    files: new Map([["src/state/state.mjs", "export const índice = 1;"]]),
  },
  {
    label: "chave acentuada depois de uma regex literal com aspas",
    files: new Map([["src/state/state.mjs", 'const r = /"/;\nexport const a = { quórum: 1 };']]),
  },
];
