/* GUARDA · FRONTEIRAS — cada camada só alcança o que lhe cabe. */

import { posix } from "node:path";
import { collect } from "../lib/project.mjs";

export const name = "boundaries";

const ALLOWED_FOR_ENTRYPOINT = [/^\.\/state\//, /^\.\/public\//, /^\.\/ui\//, /^\.\/shell\//];

/* `src/shell/` é o entrypoint dividido em módulos: alcança o mesmo que ele, e os irmãos. */
const ALLOWED_FOR_APP = [/^\.\.\/state\//, /^\.\.\/public\//, /^\.\.\/ui\//, /^\.\/[\w-]+\.mjs$/];

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  for (const [path, source] of files) {
    if (!path.endsWith(".mjs")) continue;
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(m => m[1] ?? "");

    /* 1 — O ENTRYPOINT SÓ COMPÕE. */
    if (path === "src/main.mjs") {
      for (const specifier of imports) {
        if (!ALLOWED_FOR_ENTRYPOINT.some(allowed => allowed.test(specifier))) {
          add(
            `src/main.mjs importa ${specifier} — o entrypoint compoe por state/, public/ e ui/, ` +
              `e nao alcanca dominio nem infraestrutura direto`,
          );
        }
      }
    }

    /* 1b — A COMPOSIÇÃO DO NAVEGADOR TAMBÉM SÓ COMPÕE. */
    if (path.startsWith("src/shell/")) {
      for (const specifier of imports) {
        if (!ALLOWED_FOR_APP.some(allowed => allowed.test(specifier))) {
          add(
            `${path} importa ${specifier} — src/shell/ compoe por state/, public/, ui/ e os ` +
              `irmaos, e nao alcanca dominio, aplicacao nem dado direto`,
          );
        }
      }
    }

    /* 2 — O DOMÍNIO É PURO. */
    if (path.startsWith("src/domain/")) {
      const engine = path.split("/")[2] ?? "";
      for (const specifier of imports) {
        if (/(ui|application|infra)\//.test(specifier)) {
          add(`${path} importa ${specifier} — o dominio nao conhece camada de cima`);
        }
        const target = posix.join(posix.dirname(path), specifier).split("/");
        if (target[0] === "src" && target[1] === "domain" && target[2] !== engine) {
          add(
            `${path} importa ${specifier} — motor nenhum chama outro motor; quem compoe e a aplicacao`,
          );
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

    /* 3 — DEPENDÊNCIA DE DESENVOLVIMENTO NÃO VAZA. */
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
    files: new Map([["src/main.mjs", 'import { x } from "./domain/economy/index.mjs";']]),
  },
  {
    label: "composicao do navegador alcancando a aplicacao direto",
    files: new Map([["src/shell/paint.mjs", 'import { x } from "../application/turn.mjs";']]),
  },
  {
    label: "dominio importando UI",
    files: new Map([
      ["src/domain/economy/index.mjs", 'import { h } from "../../ui/core/html.mjs";'],
    ]),
  },
  {
    label: "motor de dominio importando outro motor",
    files: new Map([
      ["src/domain/congress/index.mjs", 'import { step } from "../opinion/index.mjs";'],
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
