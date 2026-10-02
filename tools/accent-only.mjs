/* PROVA DE QUE SÓ O ACENTO DA PROSA MUDOU, para lote de acentuação.
   uso: node tools/accent-only.mjs [--base <commit>] <arquivo>...   (base padrão: HEAD)
   Duas provas por arquivo: sem diacríticos, ele é idêntico ao da base; e, em `.mjs` e `.css`,
   o código sem comentários também é idêntico, string incluída. Sai 0 se passou, 1 se não. */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { tokenizer } from "acorn";

const args = process.argv.slice(2);
const at = args.indexOf("--base");
const base = at >= 0 ? (args.splice(at, 2)[1] ?? "HEAD") : "HEAD";
/* Maiúscula no começo de frase é correção de prosa; código e string seguem conferidos à parte. */
const ignoreCase = args.includes("--ignore-case");
if (ignoreCase) args.splice(args.indexOf("--ignore-case"), 1);
if (!args.length) {
  process.stderr.write(
    "uso: node tools/accent-only.mjs [--base <commit>] [--ignore-case] <arquivo>...\n",
  );
  process.exit(2);
}

/** @param {string} text */
const strip = text => {
  const bare = text.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
  return ignoreCase ? bare.toLowerCase() : bare;
};

/** @param {string} path @param {string} text @returns {string} */
function code(path, text) {
  if (path.endsWith(".css")) return text.replace(/\/\*[\s\S]*?\*\//g, "");
  if (!path.endsWith(".mjs")) return "";
  const options = /** @type {const} */ ({ ecmaVersion: "latest", sourceType: "module" });
  return Array.from(tokenizer(text, options), token => text.slice(token.start, token.end)).join(
    "\n",
  );
}

let failed = 0;
for (const file of args) {
  const path = file.replaceAll("\\", "/");
  const before = execFileSync("git", ["show", `${base}:${path}`], { encoding: "utf8" });
  const after = readFileSync(path, "utf8");
  const a = strip(before).split("\n");
  const b = strip(after).split("\n");
  let line = a.findIndex((row, i) => row !== b[i]);
  if (line < 0 && b.length > a.length) line = a.length;
  if (line >= 0) process.stdout.write(`${path}:${line + 1} mudou além do acento\n`);
  else if (code(path, before) !== code(path, after))
    process.stdout.write(`${path} mudou código ou string; só comentário pode mudar\n`);
  else continue;
  failed++;
}
process.stdout.write(`${args.length - failed} de ${args.length} arquivos: só acento de prosa\n`);
process.exitCode = failed ? 1 : 0;
