/* GUARDA · ORFAS — nenhuma regra de estilo sem HTML para pintar.
   ⚠ ELA E O ACHADO 5 DA RETOMADA, e ele ficou aberto por seis sessoes.
   O custo dele esta medido, em duas varreduras feitas A MAO: nona sessao  299 linhas —
   `70-screen-approval.css` inteiro, a familia `.strip`/`.chip`, e duas regras de `.strip--
   stacked`; decima sessao 201 linhas de CSS morto, mais uma regra `.cards` duplicada que era
   sobrescrita inteira pela irma vinte linhas abaixo. */

import { collect, isGuardSource, stripCssComments, stripJsComments } from "../lib/project.mjs";

export const name = "orphans";

/* ONDE UMA CLASSE PODE NASCER. */
/**
 * @param {string} path
 */
function produces(path) {
  return path === "index.html" || path === "app.mjs" || path.startsWith("src/");
}

/**
 * O QUE O JOGO ESCREVE NA PAGINA — e so isso conta como produzir.
 *
 * ⛔ ANTES ELE ERA O ARQUIVO INTEIRO, e duas coisas que nao pintam nada mantinham classe
 * morta viva: o `href` de `46-screen-cabinet-desk.css` no `<link>` casava com `.desk`, e uma variavel local
 * chamada `desk` em `cast/index.mjs` casava sozinha. Sessenta linhas de `.desk` sobreviveram
 * a uma tela inteira que foi refeita, com a guarda verde.
 *
 * ⚠ CLASSE SO NASCE DENTRO DE TEXTO: no `.mjs` conta o conteudo dos literais, e no HTML o
 * corpo sem os caminhos de `href` e `src`.
 *
 * @param {string} path
 * @param {string} raw
 * @returns {string}
 */
function writes(path, raw) {
  if (path.endsWith(".html")) return raw.replace(/\b(?:href|src)="[^"]*"/g, " ");
  return (stripJsComments(raw).match(/`[^`]*`|"[^"\n]*"|'[^'\n]*'/g) ?? []).join("\n");
}

/**
 * AS CLASSES QUE UMA FOLHA DECLARA, com a linha em que cada uma aparece.
 *
 * — `@media`, `@layer`, `@property` — nao declaram classe e caem fora pelo filtro do
 * @param {string} css
 * @returns {Map<string, number>}
 */
function declared(css, pick = /\.([a-zA-Z][\w-]*)/g) {
  /** @type {Map<string, number>} */
  const found = new Map();
  let line = 1;
  let cursor = 0;

  for (const match of css.matchAll(/([^{}]+)\{/g)) {
    const selector = match[1] ?? "";
    const at = match.index ?? 0;
    while (cursor < at) {
      if (css[cursor] === "\n") line++;
      cursor++;
    }
    if (selector.trim().startsWith("@")) continue;
    for (const hit of selector.matchAll(pick)) {
      const className = hit[1] ?? "";
      if (!found.has(className)) found.set(className, line);
    }
  }

  return found;
}

/* O ESTADO PINTADO — `[data-x="y"]`, e ele e a segunda especie de regra orfa.
   ⛔ ELA JA CUSTOU DUAS NA MESMA MESA: o seletor era `data-assinado` e o HTML escrevia
   `data-signed`; o seletor era `data-vence` e o HTML escrevia `data-urgent`. A rubrica nunca
   corria e a carta que vence nunca ficava vermelha — e seletor que nao casa nao e erro para
   ninguem: tipo, guarda e 323 provas ficaram verdes as duas vezes. */
const STATE = /\[data-([a-z][\w-]*)/g;

/**
 * ONDE UM ESTADO PODE SER ESCRITO: `data-x=` no texto, ou `dataset` com o nome em camelo.
 *
 * @param {string} attribute
 * @returns {RegExp}
 */
function written(attribute) {
  const camel = attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  return new RegExp(`data-${attribute}\\b|dataset\\[["']${camel}["']\\]|dataset\\.${camel}\\b`);
}

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  /* O QUE O JOGO PRODUZ, num texto so. ⚠ O ESTADO SE PROCURA NO CODIGO INTEIRO, e nao so nos
     literais: quem escreve `data-x` e uma linha de HTML ou uma chamada a `dataset`. */
  let source = "";
  let code = "";
  for (const [path, raw] of files) {
    if (isGuardSource(path) || !produces(path)) continue;
    if (path.endsWith(".mjs") || path.endsWith(".html")) {
      source += `\n${writes(path, raw)}`;
      code += `\n${path.endsWith(".mjs") ? stripJsComments(raw) : raw}`;
    }
  }

  for (const [path, raw] of files) {
    if (!path.endsWith(".css")) continue;
    const css = stripCssComments(raw);

    for (const [className, line] of declared(css)) {
      if (new RegExp(`\\b${className}\\b`).test(source)) continue;
      add(
        `${path}:${line} estiliza .${className} e ninguem produz essa classe — ` +
          `regra orfa nao falha, ela so deixa de existir`,
      );
    }

    for (const [attribute, line] of declared(css, STATE)) {
      if (written(attribute).test(code)) continue;
      add(
        `${path}:${line} pinta [data-${attribute}] e ninguem escreve esse estado — ` +
          `seletor que nao casa nao e erro para ninguem`,
      );
    }
  }

  return list;
}

/* ── AS PROVAS SINTETICAS ──────────────────────────────────────────────────── Cada uma
   reintroduz um defeito real que o projeto ja pagou. */
export const synthetic = [
  {
    label: "uma folha inteira sem HTML para pintar",
    files: new Map([
      ["styles/70-screen-approval.css", "@layer screens { .approval__meter { height: 10px; } }"],
      ["app.mjs", 'const html = `<div class="board"></div>`;'],
    ]),
  },
  {
    label: "o seletor amarrado a um nome de tela que mudou",
    files: new Map([
      ["styles/50-screen-congress.css", "@layer screens { .report--mesa { padding: 8px; } }"],
      ["src/ui/screens/congress.mjs", 'export const html = `<section class="report"></section>`;'],
    ]),
  },
  {
    label: "o bloco morreu e o elemento dele sobreviveu",
    files: new Map([
      [
        "styles/30-components.css",
        "@layer components { .strip { gap: 4px; } .chip__value { color: red; } }",
      ],
      ["src/ui/screens/congress.mjs", 'export const html = `<b class="chip__value">7</b>`;'],
    ]),
  },
  {
    label: "a classe so aparece em COMENTARIO, e comentario nao pinta",
    files: new Map([
      ["styles/30-components.css", "@layer components { .ghost { display: none; } }"],
      ["app.mjs", "/* a peca .ghost desenha o vazio */ const html = `<div></div>`;"],
    ]),
  },
  {
    /* O caso medido: `.desk` sobreviveu a tela inteira que foi refeita porque o `<link>` da
       folha NOVA se chama `46-screen-cabinet-desk.css`, e o nome do arquivo casava com o nome da classe. */
    label: "o CAMINHO da folha mantem viva a classe que ela nao pinta",
    files: new Map([
      ["styles/46-screen-cabinet-desk.css", "@layer screens { .desk { display: grid; } }"],
      ["index.html", '<link rel="stylesheet" href="styles/46-screen-cabinet-desk.css" />'],
    ]),
  },
  {
    /* E o irmao dele: uma variavel local com o nome da classe. Classe so nasce dentro de
       texto, e `const desk = 3` nao e texto. */
    label: "um identificador de JS com o nome da classe, e ele nao pinta nada",
    files: new Map([
      ["styles/45-screen-cabinet.css", "@layer screens { .desk { gap: 8px; } }"],
      ["src/domain/cast/index.mjs", "const desk = crowd * 2;\nexport const table = desk;"],
    ]),
  },
  {
    /* As DUAS da mesa: o seletor em portugues e o HTML em ingles. Nenhuma falhava. */
    label: "o seletor de estado ficou num nome que o HTML nao escreve",
    files: new Map([
      ["styles/46-screen-cabinet-desk.css", '@layer screens { .envelope[data-vence="true"] { color: red; } }'],
      ["src/ui/shared/mail-pile.mjs", 'export const html = `<i class="envelope" data-urgent>`;'],
    ]),
  },
];
