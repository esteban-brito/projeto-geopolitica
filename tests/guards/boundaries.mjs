/* GUARDA · FRONTEIRAS — cada camada so alcanca o que lhe cabe. */

import { collect } from "../lib/project.mjs";

export const name = "boundaries";

const ALLOWED_FOR_ENTRYPOINT = [/^\.\/src\/state\//, /^\.\/src\/public\//, /^\.\/src\/ui\//];

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  for (const [path, source] of files) {
    if (!path.endsWith(".mjs")) continue;
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(m => m[1] ?? "");

    /* 1 — O ENTRYPOINT SO COMPOE. */
    if (path === "app.mjs") {
      for (const specifier of imports) {
        if (!ALLOWED_FOR_ENTRYPOINT.some(allowed => allowed.test(specifier))) {
          add(
            `app.mjs importa ${specifier} — o entrypoint compoe por state/, public/ e ui/, ` +
              `e nao alcanca dominio nem infraestrutura direto`,
          );
        }
      }
    }

    /* 2 — O DOMINIO E PURO. */
    if (path.startsWith("src/domain/")) {
      for (const specifier of imports) {
        if (/(ui|application|infra)\//.test(specifier)) {
          add(`${path} importa ${specifier} — o dominio nao conhece camada de cima`);
        }
      }
      for (const forbidden of ["document", "window", "localStorage", "Math.random", "Date.now"]) {
        if (new RegExp(`\\b${forbidden.replace(".", "\\.")}\\b`).test(source)) {
          add(
            `${path} usa ${forbidden} — DOM, relogio e aleatoriedade entram por parametro, ` +
              `senao o motor deixa de ser testavel e reproduzivel`,
          );
        }
      }
    }

    /* 3 — DEPENDENCIA DE DESENVOLVIMENTO NAO VAZA. */
    if (!path.startsWith("tests/")) {
      for (const specifier of imports) {
        if (specifier === "fast-check" || specifier.startsWith("playwright")) {
          add(`${path} importa ${specifier}, que e dependencia de teste e so pode viver em tests/`);
        }
      }
    }
  }

  return list;
}

export const synthetic = [
  {
    label: "entrypoint alcancando o dominio direto",
    files: new Map([["app.mjs", 'import { x } from "./src/domain/economy/index.mjs";']]),
  },
  {
    label: "dominio importando UI",
    files: new Map([
      ["src/domain/economy/index.mjs", 'import { h } from "../../ui/shared/html.mjs";'],
    ]),
  },
  {
    label: "dominio usando aleatoriedade ambiente",
    files: new Map([["src/domain/events/index.mjs", "const roll = Math.random();"]]),
  },
  {
    label: "dependencia de teste vazando para o runtime",
    files: new Map([["src/state/state.mjs", 'import fc from "fast-check";']]),
  },
];
