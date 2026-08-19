/* O RUNNER DAS GUARDAS.
   ══════════════════════════════════════════════════════════════════════════════

   Ele faz DUAS coisas em cada guarda, e a segunda e a que importa:

     1. AUDITA o projeto real e imprime os achados;
     2. roda as PROVAS SINTETICAS — versoes fabricadas do projeto que contem o
        defeito de proposito — e exige que a guarda acuse cada uma.

   Sem (2), uma guarda verde nao distingue "o projeto esta certo" de "o casador
   nunca casa". Guarda que nunca falhou e cobertura presumida, e cobertura
   presumida e pior que nenhuma: a proxima sessao confia nela.

   As guardas sao descobertas por leitura do diretorio, mas o resultado e
   comparado com a lista ESPERADA abaixo. Descobrir por glob sem lista e como um
   arquivo renomeado vira cobertura ausente em silencio. */

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, readProject } from "./lib/project.mjs";

const EXPECTED = [
  "boundaries",
  "cascade",
  "codenames",
  "identity",
  "material",
  "motion",
  "naming",
  "orphans",
  "schema",
  "tokens",
  "vocabulary",
];

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const OFF = "\x1b[0m";

const dir = join(ROOT, "tests", "guards");
const found = readdirSync(dir)
  .filter(file => file.endsWith(".mjs"))
  .map(file => file.replace(/\.mjs$/, ""))
  .sort();

if (found.join(",") !== EXPECTED.join(",")) {
  process.stderr.write(
    `${RED}a lista de guardas mudou${OFF}\n` +
      `  esperadas: ${EXPECTED.join(", ")}\n  no disco:  ${found.join(", ")}\n` +
      `  atualize EXPECTED em tests/run.mjs no mesmo commit\n`,
  );
  process.exit(1);
}

const files = readProject();
let failures = 0;
let syntheticCount = 0;

for (const guardName of found) {
  const guard = await import(pathToFileURL(join(dir, `${guardName}.mjs`)).href);

  const findings = guard.audit(files);
  for (const finding of findings) {
    process.stdout.write(`  ${RED}✗${OFF} [${finding.guard}] ${finding.detail}\n`);
  }
  failures += findings.length;

  /* Cada prova sintetica reintroduz um defeito e exige acusacao. */
  for (const probe of guard.synthetic ?? []) {
    syntheticCount++;
    const caught = guard.audit(probe.files);
    if (caught.length === 0) {
      failures++;
      process.stdout.write(
        `  ${RED}✗${OFF} [${guardName}] a prova sintetica "${probe.label}" NAO foi acusada — ` +
          `a guarda nao consegue falhar\n`,
      );
    }
  }

  if (findings.length === 0) {
    process.stdout.write(
      `  ${GREEN}✓${OFF} ${guardName} ${DIM}(${guard.synthetic?.length ?? 0} provas sinteticas)${OFF}\n`,
    );
  }
}

const total = `${found.length} guardas · ${syntheticCount} provas sinteticas · ${files.size} arquivos`;
if (failures > 0) {
  process.stdout.write(`\n${RED}${failures} achado(s)${OFF} — ${total}\n`);
  process.exit(1);
}
process.stdout.write(`\n${GREEN}tudo verde${OFF} — ${total}\n`);
