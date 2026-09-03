/* SOBE O JOGO NO INICIO DA SESSAO, e so se ele ainda nao estiver de pe.
   ⚠ ELE NAO E O SERVIDOR DO PASSEIO: `walk` sobe o proprio em 5201, entao os dois convivem.
   Sem a sonda, cada sessao deixaria um processo orfao segurando a porta. */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const PORT = 5173;
const BASE = `http://127.0.0.1:${PORT}`;
const ROOT = fileURLToPath(new URL("..", import.meta.url));

/** @param {number} ms */
const espera = ms => new Promise(resolve => setTimeout(resolve, ms));

const responde = async () =>
  fetch(`${BASE}/index.html`, { signal: AbortSignal.timeout(1200) })
    .then(r => r.ok)
    .catch(() => false);

/** @param {string} texto */
const diz = texto => {
  process.stdout.write(
    JSON.stringify({
      systemMessage: texto,
      hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: texto },
    }),
  );
};

if (await responde()) {
  diz(`O jogo ja esta de pe: ${BASE}`);
  process.exit(0);
}

const filho = spawn(process.execPath, [join(ROOT, "tools", "serve-static.mjs")], {
  cwd: ROOT,
  env: { ...process.env, PORT: String(PORT) },
  detached: true,
  stdio: "ignore",
});
filho.unref();

/* DEZ TENTATIVAS DE 300ms: o servidor e estatico e sobe em uma, mas a primeira sonda dispara
   antes de o `listen` fechar. */
for (let tentativa = 0; tentativa < 10; tentativa += 1) {
  await espera(300);
  if (await responde()) {
    diz(`O jogo subiu: ${BASE}`);
    process.exit(0);
  }
}

diz(`O jogo NAO subiu em ${BASE} — rode \`npm run serve\` a mao e veja o erro.`);
