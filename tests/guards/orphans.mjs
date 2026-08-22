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
 * AS CLASSES QUE UMA FOLHA DECLARA, com a linha em que cada uma aparece.
 *
 * — `@media`, `@layer`, `@property` — nao declaram classe e caem fora pelo filtro do
 * @param {string} css
 * @returns {Map<string, number>}
 */
function declared(css) {
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
    for (const hit of selector.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
      const className = hit[1] ?? "";
      if (!found.has(className)) found.set(className, line);
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

  /* O QUE O JOGO PRODUZ, num texto so. */
  let source = "";
  for (const [path, raw] of files) {
    if (isGuardSource(path) || !produces(path)) continue;
    if (path.endsWith(".mjs")) source += stripJsComments(raw);
    else if (path.endsWith(".html")) source += raw;
  }

  for (const [path, raw] of files) {
    if (!path.endsWith(".css")) continue;

    for (const [className, line] of declared(stripCssComments(raw))) {
      if (new RegExp(`\\b${className}\\b`).test(source)) continue;
      add(
        `${path}:${line} estiliza .${className} e ninguem produz essa classe — ` +
          `regra orfa nao falha, ela so deixa de existir`,
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
      ["styles/50-screen-mesa.css", "@layer screens { .report--mesa { padding: 8px; } }"],
      ["src/ui/screens/mesa.mjs", 'export const html = `<section class="report"></section>`;'],
    ]),
  },
  {
    label: "o bloco morreu e o elemento dele sobreviveu",
    files: new Map([
      [
        "styles/30-components.css",
        "@layer components { .strip { gap: 4px; } .chip__value { color: red; } }",
      ],
      ["src/ui/screens/mesa.mjs", 'export const html = `<b class="chip__value">7</b>`;'],
    ]),
  },
  {
    label: "a classe so aparece em COMENTARIO, e comentario nao pinta",
    files: new Map([
      ["styles/30-components.css", "@layer components { .ghost { display: none; } }"],
      ["app.mjs", "/* a peca .ghost desenha o vazio */ const html = `<div></div>`;"],
    ]),
  },
];
