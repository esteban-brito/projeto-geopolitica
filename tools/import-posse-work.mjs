/* Importação única do inventário de trabalho aprovado para a posse v2o.
   Cada frase vira uma identidade estável para revisão; ela ainda não é um efeito jurídico. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { POSSE_FILES } from "../prototypes/posse/paths.mjs";
import { CABINET } from "../src/data/cabinet.mjs";

const { values } = parseArgs({
  options: {
    source: { type: "string" },
    output: { type: "string" },
  },
});
const sourcePath = values.source
  ? pathToFileURL(resolve(values.source))
  : new URL("../" + POSSE_FILES.source, import.meta.url);
const outputPath = values.output
  ? pathToFileURL(resolve(values.output))
  : new URL("../prototypes/government/competencies.mjs", import.meta.url);
const source = readFileSync(sourcePath, "utf8");
const start = source.indexOf("const SEATS = [");
const end = source.indexOf("const PRESIDENCY", start);
if (start < 0 || end < 0) throw new Error("Lista de cargos não encontrada");
const literal = source.slice(start, end).replace(/;\s*$/, "");
/** @type {Array<[string, string, string, string, string[]]>} */
const seats = new Function(`${literal}; return SEATS;`)();
const officeByName = new Map(CABINET.map(office => [office.label, office.id]));
/** @param {string} text */
const slug = text =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
/** @type {Array<{ id: string, label: string, office: string, source: string }>} */
const competencies = [];
const used = new Set();
for (const seat of seats) {
  const office = officeByName.get(seat[3]);
  if (!office) throw new Error(`Cargo sem correspondência no jogo: ${seat[0]} (${seat[3]})`);
  for (const label of seat[4]) {
    const id = `${office}-${slug(label)}`;
    if (used.has(id)) throw new Error(`Competência duplicada: ${id}`);
    used.add(id);
    competencies.push({ id, label, office, source: "posse-v2o" });
  }
}
const header =
  `/* Inventário inicial da posse v2o. Frases resumidas, ainda sujeitas à revisão jurídica e\n` +
  `   semântica. IDs independem do nome do órgão que receberá o trabalho.\n` +
  `   Recriar com: node tools/import-posse-work.mjs */\n` +
  `/** @typedef {{ id: string, label: string, office: string, source: string }} Competency */\n` +
  `/** @type {ReadonlyArray<Competency>} */\n`;
writeFileSync(
  outputPath,
  `${header}export const COMPETENCIES = ${JSON.stringify(competencies, null, 2)};\n`,
);
process.stdout.write(`${seats.length} cargos, ${competencies.length} competências importadas\n`);
