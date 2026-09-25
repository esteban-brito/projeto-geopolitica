/* VERIFICADOR DE REFERENCIAS — todo caminho citado num arquivo versionado tem de existir.
   Le links Markdown relativos e caminhos entre crases que comecem por uma pasta do projeto.
   uso: node tools/check-links.mjs [--list]   sai 1 se houver referencia quebrada. */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TEXT = /\.(md|mjs|css|html|json|yml)$/;
const ROOTS = /^(src|docs|tests|tools|styles|assets|vendor|captures|\.agents|\.claude|\.github)\//;
const IGNORED_DIRS = /^(tmp|captures)\//;
/* Registro historico cita arquivos pelo nome que tinham na epoca, e prova sintetica de guarda
   cita caminho inventado de proposito: nos dois, so os links sao cobrados. */
const HISTORY = /^(docs\/(journal\.md|cycles\/|research\/)|tests\/guards\/)/;

const tracked = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
  .split("\n")
  .filter(path => TEXT.test(path) && existsSync(join(ROOT, path)));

/** @type {{ file: string, ref: string }[]} */
const broken = [];

for (const file of tracked) {
  const text = readFileSync(join(ROOT, file), "utf8");
  if (file.endsWith(".md")) {
    for (const hit of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = (hit[1] ?? "").split("#")[0] ?? "";
      if (!target || /^<?[a-z]+:/i.test(target)) continue;
      const resolved = normalize(join(dirname(file), decodeURI(target)));
      if (IGNORED_DIRS.test(resolved.replaceAll("\\", "/"))) continue;
      if (!existsSync(join(ROOT, resolved))) broken.push({ file, ref: target });
    }
  }
  if (HISTORY.test(file)) continue;
  for (const hit of text.matchAll(/`([^`\s]+)`/g)) {
    const ref = (hit[1] ?? "").replace(/[.,;:)]+$/, "");
    if (!ROOTS.test(ref) || /[*<>{}$]/.test(ref) || IGNORED_DIRS.test(ref)) continue;
    const path = ref.split(":")[0] ?? ref;
    if (!existsSync(join(ROOT, path))) broken.push({ file, ref });
  }
}

const unique = [...new Map(broken.map(item => [`${item.file} ${item.ref}`, item])).values()];
console.log(`${unique.length} referencias quebradas em ${tracked.length} arquivos versionados`);
if (process.argv.includes("--list"))
  for (const item of unique) console.log(`${item.file}\t${item.ref}`);
process.exit(unique.length > 0 ? 1 : 0);
