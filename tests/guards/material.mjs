/* Ele e a unica memoria de que `backdrop-filter` derrubou uma tela para 31 fps, e de que fps
   se mede ANTES de levar o material a uma tela nova. */

import { collect, stripCssComments } from "../lib/project.mjs";

export const name = "material";

const MATERIAL_FILE = "styles/20-material.css";

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  /** @type {string[]} */
  const filters = [];

  for (const [path, raw] of files) {
    if (!path.endsWith(".css")) continue;
    const css = stripCssComments(raw);

    const plain = css.match(/(?<!-webkit-)backdrop-filter\s*:\s*([^;}]+)/g) ?? [];
    const prefixed = css.match(/-webkit-backdrop-filter\s*:\s*([^;}]+)/g) ?? [];

    if (plain.length > 0 && path !== MATERIAL_FILE) {
      add(
        `${path} declara backdrop-filter, e o material vive so em ${MATERIAL_FILE} — ` +
          `vidro novo usa as classes do sistema, nao um filtro proprio`,
      );
    }

    if (plain.length !== prefixed.length) {
      add(
        `${path} tem ${plain.length} backdrop-filter contra ${prefixed.length} com -webkit- — ` +
          `no Safari o vidro sem prefixo nao existe`,
      );
    }

    for (const declaration of plain) {
      filters.push(declaration.split(":").slice(1).join(":").trim());
    }
  }

  const distinct = [...new Set(filters)];
  if (distinct.length > 1) {
    add(
      `${distinct.length} materiais de vidro no projeto (${distinct.join(" | ")}) — ` +
        `o que separa os niveis e a densidade do fundo, nunca o filtro`,
    );
  }
  if (distinct.length === 1 && !distinct[0]?.includes("var(--glass-blur)")) {
    add(`o material esta escrito na mao (${distinct[0]}) em vez de sair de --glass-blur`);
  }

  const tokens = files.get("styles/00-tokens.css") ?? "";
  if (!/MECA O FPS/i.test(tokens)) {
    add(
      "o aviso de medir fps sumiu do bloco de tokens — ele e a unica memoria de que " +
        "backdrop-filter ja derrubou uma tela para 31 fps",
    );
  }

  return list;
}

/* PROVAS SINTETICAS — a guarda tem de conseguir FALHAR. */
export const synthetic = [
  {
    label: "um segundo material de vidro",
    files: new Map([
      [
        MATERIAL_FILE,
        ".a{backdrop-filter:var(--glass-blur);-webkit-backdrop-filter:var(--glass-blur)}" +
          ".b{backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}",
      ],
      ["styles/00-tokens.css", "/* MECA O FPS DELA */"],
    ]),
  },
  {
    label: "backdrop-filter fora do arquivo de material",
    files: new Map([
      ["styles/40-screen-dashboard.css", ".x{backdrop-filter:var(--glass-blur)}"],
      ["styles/00-tokens.css", "/* MECA O FPS DELA */"],
    ]),
  },
  {
    label: "declaracao sem o par -webkit-",
    files: new Map([
      [MATERIAL_FILE, ".a{backdrop-filter:var(--glass-blur)}"],
      ["styles/00-tokens.css", "/* MECA O FPS DELA */"],
    ]),
  },
  {
    label: "o aviso de custo de fps sumiu dos tokens",
    files: new Map([["styles/00-tokens.css", ":root{--glass-blur:blur(14px)}"]]),
  },
];
