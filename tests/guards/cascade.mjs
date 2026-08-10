/* GUARDA · CASCATA — a precedencia e declarada, nunca emergente.
   ══════════════════════════════════════════════════════════════════════════════

   A dor que isto resolve tem numero: numa folha sem camadas, 33 declaracoes
   nunca chegavam a tela e uma media query inteira estava morta porque perdia por
   ORDEM DE FONTE para uma regra de mesma especificidade escrita antes. Nada
   disso e visivel lendo o seletor.

   `@layer` troca isso por uma declaracao unica. Mas ela tem tres pontos cegos, e
   os tres sao cobertos aqui:

     · a ORDEM das camadas e fixada pela PRIMEIRA vez em que sao mencionadas. Se
       outro arquivo carregasse antes do de tokens, registraria a propria camada
       primeiro e inverteria a hierarquia. Dai o primeiro <link> ser cobrado;
     · regra escrita FORA de qualquer camada vence TODA regra dentro de camadas.
       Um unico bloco solto anula o sistema inteiro;
     · `!important` INVERTE a ordem das camadas. Um `!important` na ultima camada
       passa a perder para um na primeira — o oposto do que quem escreveu queria. */

import { collect, stripCssComments } from "../lib/project.mjs";

export const name = "cascade";

export const LAYER_ORDER = ["tokens", "base", "material", "components", "screens", "motion"];

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  /* 1 — A DECLARACAO DE ORDEM VIVE NO PRIMEIRO ARQUIVO CARREGADO. */
  const html = files.get("index.html") ?? "";
  const links = [...html.matchAll(/<link[^>]+href="(styles\/[^"]+)"/g)].map(m => m[1] ?? "");

  if (links.length === 0) add("index.html nao carrega nenhuma folha de estilo");
  if (links[0] !== "styles/00-tokens.css") {
    add(
      `o primeiro <link> e ${links[0]} — a ordem das camadas e fixada pela primeira mencao, ` +
        `entao a declaracao @layer precisa chegar antes de qualquer outra folha`,
    );
  }

  const sorted = [...links].sort((a, b) => a.localeCompare(b));
  if (links.join("|") !== sorted.join("|")) {
    add(`os <link> estao fora da ordem numerica: ${links.join(", ")}`);
  }

  const tokens = stripCssComments(files.get("styles/00-tokens.css") ?? "");
  const declaration = tokens.match(/@layer\s+([^;{]+);/);
  if (!declaration) {
    add("styles/00-tokens.css nao declara a ordem das camadas");
  } else {
    const declared = (declaration[1] ?? "").split(",").map(s => s.trim());
    if (declared.join(",") !== LAYER_ORDER.join(",")) {
      add(
        `a ordem declarada e "${declared.join(", ")}" e a esperada e "${LAYER_ORDER.join(", ")}"`,
      );
    }
    if (declared.at(-1) !== "motion") {
      add("a camada de movimento tem de ser a ULTIMA, senao a rede perde para as outras");
    }
  }

  /* 2 — NENHUMA REGRA FORA DE CAMADA, E NENHUM `!important` DENTRO DELAS. */
  for (const [path, raw] of files) {
    if (!path.startsWith("styles/")) continue;
    const css = stripCssComments(raw);

    const loose = outsideLayers(css);
    if (loose) {
      add(
        `${path} tem CSS fora de @layer ("${loose.slice(0, 60).trim()}…") — ` +
          `regra sem camada vence TODA regra com camada`,
      );
    }

    if (/!important/.test(css)) {
      add(
        `${path} usa !important — com @layer, declaracoes importantes tem a ordem das ` +
          `camadas INVERTIDA, entao ele enfraquece a regra em vez de reforca-la`,
      );
    }
  }

  return list;
}

/**
 * Devolve o primeiro trecho de CSS que nao esta dentro de `@layer` nem de
 * `@property`, ou `null` se tudo estiver coberto.
 *
 * @param {string} css
 * @returns {string | null}
 */
function outsideLayers(css) {
  let i = 0;
  while (i < css.length) {
    const rest = css.slice(i);
    const blank = rest.match(/^\s+/);
    if (blank) {
      i += blank[0].length;
      continue;
    }
    /* declaracao de ordem: `@layer a, b, c;` */
    const order = rest.match(/^@layer\s+[^;{]+;/);
    if (order) {
      i += order[0].length;
      continue;
    }
    const block = rest.match(/^@(layer|property)\s+[^{]*\{/);
    if (block) {
      const end = matchBrace(css, i + block[0].length - 1);
      if (end === -1) return rest.slice(0, 80);
      i = end + 1;
      continue;
    }
    return rest.slice(0, 80);
  }
  return null;
}

/**
 * @param {string} text
 * @param {number} open indice da `{` de abertura
 * @returns {number}
 */
function matchBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return i;
  }
  return -1;
}

export const synthetic = [
  {
    label: "regra fora de qualquer camada",
    files: new Map([
      ["index.html", '<link href="styles/00-tokens.css">'],
      ["styles/00-tokens.css", `@layer ${LAYER_ORDER.join(", ")};\n.solta{color:red}`],
    ]),
  },
  {
    label: "!important dentro de uma camada",
    files: new Map([
      ["index.html", '<link href="styles/00-tokens.css">'],
      [
        "styles/00-tokens.css",
        `@layer ${LAYER_ORDER.join(", ")};\n@layer tokens{:root{--a:1px !important}}`,
      ],
    ]),
  },
  {
    label: "os estilos carregam fora de ordem",
    files: new Map([
      ["index.html", '<link href="styles/10-base.css"><link href="styles/00-tokens.css">'],
      ["styles/00-tokens.css", `@layer ${LAYER_ORDER.join(", ")};`],
    ]),
  },
  {
    label: "a camada de movimento deixou de ser a ultima",
    files: new Map([
      ["index.html", '<link href="styles/00-tokens.css">'],
      ["styles/00-tokens.css", "@layer tokens, motion, screens;"],
    ]),
  },
];
