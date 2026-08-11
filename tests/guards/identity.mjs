/* GUARDA · IDENTIDADE — o que uma coisa E nao se confunde com como ela se CHAMA.
   ══════════════════════════════════════════════════════════════════════════════

   O `standards.md` declara a regra desde o inicio e reservava a guarda para
   quando houvesse objeto de prova. O catalogo e o objeto.

   O QUE ELA IMPEDE, e cada item e um defeito que so aparece tarde:

     1. COLECAO COM ROTULO E SEM IDENTIFICADOR. Se a unica coisa que distingue um
        registro e o texto que a interface mostra, entao renomear "Centrão" para
        "Centro" no futuro editor de nomes QUEBRA toda referencia a ele. Rotulo e
        atributo e muda; identidade e identidade e nao muda;
     2. IDENTIFICADOR REPETIDO. Este e o mais caro, porque nao parece erro: o
        motor acha o primeiro, ignora o segundo, e uma bancada inteira deixa de
        votar sem nada quebrar e sem ninguem ver;
     3. COMPARACAO POR NOME no dominio e no estado. `party.label === "Centrão"`
        funciona ate o dia em que o rotulo muda ou ganha acento diferente, e
        entao uma regra de jogo desliga em silencio. Motor compara por `id`.

   O QUE ELA NAO COBRE, declarado para nao ser confundido com cobertura: se o
   VALOR de um id faz sentido. `centrao` apontando para a esquerda passa aqui —
   isso e revisao, e nao ha casador honesto para intencao. */

import { collect, isGuardSource, stripJsComments } from "../lib/project.mjs";

export const name = "identity";

const DATA_DIR = "src/data/";

/* Onde a comparacao por nome e proibida. A UI PODE comparar rotulo — ela existe
   para mostrar texto —, e o teste tambem, porque prova de igualdade de rotulo e
   exatamente o que uma suite de interface faz. */
const ENGINE_DIRS = ["src/domain/", "src/state/", "src/application/"];

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  for (const [path, raw] of files) {
    if (!path.endsWith(".mjs") || isGuardSource(path)) continue;
    const source = stripJsComments(raw);

    /* 1 e 2 — o catalogo. */
    if (path.startsWith(DATA_DIR)) {
      /* Um esquema que descreve rotulo descreve uma entidade exibida, e toda
         entidade exibida precisa de identidade propria. */
      for (const schema of source.matchAll(/([A-Z][A-Z0-9_]*_SCHEMA)\s*=\s*\{([\s\S]*?)\n\}/g)) {
        const body = schema[2] ?? "";
        if (/\blabel\s*:/.test(body) && !/\bid\s*:/.test(body)) {
          add(
            `${path}: ${schema[1]} declara "label" e nao declara "id" — rotulo e atributo e ` +
              `muda; renomear passaria a quebrar toda referencia ao registro`,
          );
        }
      }

      const seen = new Set();
      for (const hit of source.matchAll(/\bid\s*:\s*"([^"]+)"/g)) {
        const id = hit[1] ?? "";
        if (seen.has(id)) {
          add(`${path}: o id "${id}" aparece mais de uma vez — o motor so enxerga o primeiro`);
        }
        seen.add(id);
      }
    }

    /* 3 — o motor compara por identidade. */
    if (ENGINE_DIRS.some(dir => path.startsWith(dir))) {
      const byName = source.match(
        /\.(label|name|nome)\s*={2,3}\s*["'`]|["'`]\s*={2,3}\s*\w+\.(label|name|nome)\b/,
      );
      if (byName) {
        add(
          `${path} compara por nome (${byName[0].trim()}) — motor compara por id, senao a regra ` +
            `desliga em silencio no dia em que o rotulo mudar`,
        );
      }
    }
  }

  return list;
}

export const synthetic = [
  {
    label: "colecao com rotulo e sem identificador",
    files: new Map([
      [
        "src/data/parties.mjs",
        'export const PARTY_SCHEMA = {\n  label: { kind: "text" },\n  seats: { kind: "number" },\n}',
      ],
    ]),
  },
  {
    label: "identificador repetido no catalogo",
    files: new Map([["src/data/parties.mjs", 'const A = [{ id: "centrao" }, { id: "centrao" }];']]),
  },
  {
    label: "motor comparando por nome",
    files: new Map([["src/domain/congress/index.mjs", 'const alvo = party.label === "Centrão";']]),
  },
];
