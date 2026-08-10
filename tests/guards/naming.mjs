/* GUARDA · NOMES — uma forma de nomear, e so uma.
   ══════════════════════════════════════════════════════════════════════════════

   O QUE ELA COBRE, e por que cada item:

     · EXTENSAO `.mjs` em todo modulo. O projeto anterior convive com 48 modulos
       ES e 63 arquivos CommonJS, e unificar virou escopo recusado por ser grande
       demais. Nascer com um formato so custa esta linha;
     · `kebab-case` sem acento e sem maiuscula. Nome que difere so por caixa
       funciona no Windows e some no CI Linux — a classe inteira de defeito
       desaparece com minusculas em toda parte;
     · nada de CommonJS.

   O QUE ELA NAO COBRE, e isto esta escrito de proposito: o IDIOMA dos
   identificadores. A convencao e ingles para mecanismo e portugues para dado,
   mas nao existe casador honesto para isso — um que tentasse acusaria `selic` e
   `ipca`, que sao nomes proprios e ficam no original por decisao. Fingir
   cobertura aqui seria pior que nao ter: a proxima sessao confiaria nela.
   O que da para provar objetivamente e ACENTO em identificador, e isso e
   cobrado. */

import { collect, isGuardSource, stripJsComments } from "../lib/project.mjs";

export const name = "naming";

const CODE_DIRS = ["src/", "tests/", "tools/"];

/* ARQUIVOS CUJO FORMATO E IMPOSTO POR UMA FERRAMENTA, e nao escolhido por nos.
   O flat config do ESLint EXIGE `export default` — a guarda acusou isto na
   primeira execucao, e ela estava certa em acusar: a convencao vale, e a
   excecao precisa ser declarada em vez de silenciada com um comentario de
   desativacao. Se um dia a lista crescer alem de configuracao de ferramenta, e
   sinal de que a convencao virou ficcao. */
const TOOL_CONTRACT = new Set(["eslint.config.mjs"]);

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  for (const [path, source] of files) {
    const inCode = CODE_DIRS.some(dir => path.startsWith(dir)) || path === "app.mjs";

    if (inCode && /\.js$/.test(path)) {
      add(`${path} usa .js — todo modulo do projeto e .mjs`);
    }

    const base = path.split("/").pop() ?? "";
    if (inCode && !/^[a-z0-9]+(-[a-z0-9]+)*\.(mjs|css|json|md)$/.test(base)) {
      add(`${path} foge do kebab-case minusculo`);
    }

    /* O NOME acima vale para todo arquivo; o CONTEUDO abaixo pula os arquivos de
       guarda, que carregam estes defeitos como dado nas provas sinteticas. */
    if (!path.endsWith(".mjs") || isGuardSource(path)) continue;

    /* Comentario fora ANTES de tudo: prosa que descreve um defeito nao e o
       defeito, e este arquivo mesmo explica CommonJS em texto.
       As strings tambem saem, porque texto de UI e portugues acentuado por
       decisao — acusa-lo seria falso positivo. */
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
    const accented = code.match(/[A-Za-z_$][A-Za-z0-9_$]*[áàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ][^\s(){};,]*/);
    if (accented) {
      add(`${path} tem o identificador acentuado "${accented[0]}"`);
    }
  }

  return list;
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
];
