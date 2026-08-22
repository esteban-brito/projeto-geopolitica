/* O catalogo vai virar editavel (a aba de nome e logo e decisao fechada), e dado editavel sem
   fronteira produz o pior tipo de defeito: ele nao quebra onde foi digitado, quebra tres
   motores adiante, num calculo que parece errado sem motivo aparente. */

import { collect, isGuardSource, stripJsComments } from "../lib/project.mjs";

export const name = "schema";

const DATA_DIR = "src/data/";
const INDEX = "src/data/catalog.mjs";

/* Os dois modulos que sao INFRAESTRUTURA do catalogo, e nao assunto dele: um define o
   validador, o outro reune. */
const PLUMBING = new Set(["src/data/schema.mjs", INDEX]);

const SCHEMA_NAME = /\b([A-Z][A-Z0-9_]*_SCHEMA)\b/g;

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  /** @type {Set<string>} */
  const declared = new Set();
  let sawDataModule = false;

  for (const [path, raw] of files) {
    if (!path.endsWith(".mjs") || isGuardSource(path)) continue;
    const source = stripJsComments(raw);
    const inData = path.startsWith(DATA_DIR);

    /* 3 — a fronteira e um lugar so. */
    if (!inData) {
      for (const hit of source.matchAll(/export\s+const\s+([A-Z][A-Z0-9_]*_SCHEMA)\b/g)) {
        add(
          `${path} declara ${hit[1]} fora de ${DATA_DIR} — a fronteira de validacao e um lugar, ` +
            `e duas definicoes do mesmo dado divergem assim que ganham consumidor`,
        );
      }
      continue;
    }

    if (PLUMBING.has(path)) continue;
    sawDataModule = true;

    /* 1 — todo modulo de assunto descreve o que declara. */
    const own = [...source.matchAll(/export\s+const\s+([A-Z][A-Z0-9_]*_SCHEMA)\b/g)];
    if (own.length === 0) {
      add(
        `${path} nao exporta nenhum esquema — colecao que ninguem descreve e colecao que ` +
          `ninguem valida, e e sempre a que sobra de fora`,
      );
    }
    for (const hit of own) declared.add(hit[1] ?? "");
  }

  /* 2 — nenhum esquema fica sem validacao. */
  const index = stripJsComments(files.get(INDEX) ?? "");
  if (index === "" && sawDataModule) {
    add(`${INDEX} nao existe — e ele que reune o catalogo e confere todo esquema declarado`);
    return list;
  }

  const cited = new Set([...index.matchAll(SCHEMA_NAME)].map(hit => hit[1] ?? ""));
  for (const schema of declared) {
    if (!cited.has(schema)) {
      add(
        `${schema} e declarado e ${INDEX} nunca o cita — esquema sem validacao e pior que ` +
          `esquema nenhum, porque parece cobertura`,
      );
    }
  }

  return list;
}

export const synthetic = [
  {
    label: "modulo de dado sem esquema",
    files: new Map([
      ["src/data/parties.mjs", "export const PARTIES = [];"],
      [INDEX, "export const CATALOG = {};"],
    ]),
  },
  {
    label: "esquema declarado que o indice nunca valida",
    files: new Map([
      ["src/data/parties.mjs", "export const PARTY_SCHEMA = {};"],
      [INDEX, "export const CATALOG = {};"],
    ]),
  },
  {
    label: "esquema declarado fora do catalogo",
    files: new Map([["src/domain/congress/index.mjs", "export const VOTE_SCHEMA = {};"]]),
  },
];
