/* PROVA DE QUE SO A PROSA MUDOU: o arquivo sem comentarios tem de ser identico antes e depois.
   uso: node tools/prose-only.mjs <arquivo-antes> <arquivo-depois>
   Para .mjs o TypeScript reemite o codigo sem comentarios (tokenizador de verdade, nao regex);
   para .css tira-se os blocos e normaliza-se o espaco. Sai 0 se identico, 1 se o codigo mudou. */
import { readFileSync } from "node:fs";
import ts from "typescript";

const [antes, depois] = process.argv.slice(2);
if (!antes || !depois) {
  console.error("uso: node tools/prose-only.mjs <antes> <depois>");
  process.exit(2);
}

/** @param {string} path @returns {string} */
function bare(path) {
  const text = readFileSync(path, "utf8");
  if (path.endsWith(".css")) {
    return text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  const out = ts.transpileModule(text, {
    fileName: "x.mjs",
    compilerOptions: {
      removeComments: true,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
    },
  });
  return out.outputText.replace(/\s+/g, " ").trim();
}

/** @param {string} path */
const prose = path => {
  const lines = readFileSync(path, "utf8").split("\n");
  let p = 0;
  let c = 0;
  let inBlock = false;
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) continue;
    if (inBlock) {
      if (!/^\* @(param|returns|typedef|property|type)/.test(l)) p++;
      if (l.includes("*/")) inBlock = false;
      continue;
    }
    if (l.startsWith("/*")) {
      p++;
      if (!l.includes("*/")) inBlock = true;
      continue;
    }
    if (l.startsWith("//")) {
      p++;
      continue;
    }
    c++;
    if (l.includes("/*") && !l.includes("*/")) inBlock = true;
  }
  return { code: c, prose: p, pct: Math.round((100 * p) / (c + p)) };
};

const a = bare(antes);
const b = bare(depois);
const pa = prose(antes);
const pb = prose(depois);
console.log(`antes:  codigo ${pa.code} · prosa ${pa.prose} (${pa.pct}%)`);
console.log(`depois: codigo ${pb.code} · prosa ${pb.prose} (${pb.pct}%)`);
if (a === b) {
  console.log("codigo identico — so a prosa mudou");
  process.exit(0);
}
let i = 0;
while (i < a.length && a[i] === b[i]) i++;
console.log(
  `CODIGO MUDOU na posicao ${i}:\n  antes:  …${a.slice(Math.max(0, i - 60), i + 80)}…\n  depois: …${b.slice(Math.max(0, i - 60), i + 80)}…`,
);
process.exit(1);
