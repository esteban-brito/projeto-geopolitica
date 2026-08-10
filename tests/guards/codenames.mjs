/* GUARDA · CODINOMES — um conceito, um nome.
   ══════════════════════════════════════════════════════════════════════════════

   Os motores tem codinome porque e assim que o responsavel os cita. O risco de
   um segundo nome e obvio — dois vocabularios para a mesma coisa e a definicao
   de despadronizacao —, e esta guarda e o que transforma o risco em contrato:

     1. correspondencia 1:1 entre codinome e diretorio de `src/domain/`. Motor
        novo sem codinome reprova; codinome sem motor tambem;
     2. o codinome aparece no CABECALHO do modulo que ele nomeia, para quem abre
        o arquivo saber onde esta;
     3. o codinome NAO aparece em codigo executavel. Ele e rotulo de conversa e
        de documentacao — no codigo existe um nome so, o funcional.

   A tabela vive em `docs/standards.md`, que e a fonte. Aqui nada e digitado de
   novo: a lista abaixo e lida de la. */

import { collect } from "../lib/project.mjs";

export const name = "codenames";

const STANDARDS = "docs/standards.md";

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  const doc = files.get(STANDARDS);
  if (doc === undefined) {
    add(`${STANDARDS} nao existe — e ele que declara a tabela de motores`);
    return list;
  }

  /* A tabela e lida da fonte: linhas `| CODINOME | src/domain/x/ | ... |`. */
  const declared = new Map();
  for (const row of doc.matchAll(/^\|\s*\*\*([A-Z]+)\*\*\s*\|\s*`src\/domain\/([a-z-]+)\/`/gm)) {
    declared.set(row[1] ?? "", row[2] ?? "");
  }
  if (declared.size === 0) {
    add(`${STANDARDS} nao tem nenhuma linha de motor na forma esperada`);
    return list;
  }

  const dirs = new Set(
    [...files.keys()]
      .filter(path => path.startsWith("src/domain/"))
      .map(path => path.split("/")[2] ?? "")
      .filter(Boolean),
  );

  for (const [codename, dir] of declared) {
    if (!dirs.has(dir))
      add(`o codinome ${codename} aponta para src/domain/${dir}/, que nao existe`);

    const header = files.get(`src/domain/${dir}/index.mjs`) ?? "";
    if (header && !header.includes(codename)) {
      add(`src/domain/${dir}/index.mjs nao diz no cabecalho que e o ${codename}`);
    }
  }

  for (const dir of dirs) {
    if (![...declared.values()].includes(dir)) {
      add(`src/domain/${dir}/ nao tem codinome declarado em ${STANDARDS}`);
    }
  }

  /* O codinome nao vaza para o codigo executavel. Comentario e cabecalho podem
     — e devem — cita-lo; identificador, nao. */
  for (const [path, source] of files) {
    if (!path.endsWith(".mjs") || path.startsWith("tests/")) continue;
    const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    for (const codename of declared.keys()) {
      if (new RegExp(`\\b${codename}\\b`).test(code)) {
        add(`${path} usa "${codename}" em codigo — no codigo existe um nome so, o funcional`);
      }
    }
  }

  return list;
}

export const synthetic = [
  {
    label: "motor sem codinome declarado",
    files: new Map([
      [STANDARDS, "| **CASCATA** | `src/domain/propagation/` | x |"],
      ["src/domain/propagation/index.mjs", "/* CASCATA */"],
      ["src/domain/economy/index.mjs", "export {};"],
    ]),
  },
  {
    label: "codinome apontando para diretorio inexistente",
    files: new Map([[STANDARDS, "| **FANTASMA** | `src/domain/nada/` | x |"]]),
  },
  {
    label: "codinome vazando para o codigo",
    files: new Map([
      [STANDARDS, "| **CASCATA** | `src/domain/propagation/` | x |"],
      ["src/domain/propagation/index.mjs", "/* CASCATA */\nexport const CASCATA = 1;"],
    ]),
  },
];
