import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix } from "node:path";
import { POSSE_FILES } from "../paths.mjs";

const paths = [POSSE_FILES.reference, POSSE_FILES.preview];
const up = posix.relative(posix.dirname(POSSE_FILES.preview), "") + "/";
await mkdir(POSSE_FILES.reports, { recursive: true });
const [original, current] = await Promise.all(
  paths.map(async path => (await readFile(path, "utf8")).replace(/\r\n/g, "\n")),
);
assert.ok(original && current);
/** @param {string} value */
const hash = value => createHash("sha256").update(value).digest("hex");
/** @param {string} html @param {string} start @param {string} end */
function between(html, start, end) {
  const from = html.indexOf(start);
  const to = html.indexOf(end, from + start.length);
  assert.ok(from >= 0 && to > from, `${start} → ${end}`);
  return html.slice(from, to);
}
const styles = (/** @type {string} */ html) =>
  [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]);
assert.deepEqual(styles(current), styles(original), "todas as folhas do Claude, sem alteração");

const template = (/** @type {string} */ html) =>
  html.slice(0, html.indexOf('<script type="text/x-dc"'));
let expected = template(original);
/** @param {string} before @param {string} after */
function replace(before, after) {
  assert.equal(expected.split(before).length, 2, "adaptação única: " + before);
  expected = expected.replace(before, after);
}
replace(
  '<script src="rt/artifact-type/dc-runtime.js"></script>',
  `<base href="${up}${POSSE_FILES.vendor}/"><script type="module" src="${posix.relative(POSSE_FILES.vendor, "prototypes/posse/browser.mjs")}"></script>`,
);
replace("<x-dc>", "<x-dc hidden>");
replace("Votos firmes · estimativa", "Base estrutural · estimativa");
replace(
  '<span class="label" style="flex-shrink: 0;">{{question}}</span>\n',
  '<span class="label" style="flex-shrink: 0;">{{question}}</span>\n' +
    '<sc-if value="{{hasOfficeName}}" hint-placeholder-val="{{ false }}"><label class="stack" style="gap: 6px;"><span class="caption">Nome do ministério</span><input class="field" data-f="office-name" type="text" maxlength="120" value="{{officeName}}" onChange="{{setOfficeName}}"></label></sc-if>\n' +
    '<sc-if value="{{hasDestinationSearch}}" hint-placeholder-val="{{ false }}"><label class="stack" style="gap: 6px;"><span class="caption">Buscar nas atribuições</span><input class="field" data-f="destination-query" type="text" placeholder="Ex.: segurança e não alimentar" value="{{destinationQuery}}" onChange="{{setDestinationQuery}}"></label></sc-if>\n',
);
assert.equal(template(current), expected, "HTML inteiro, com apenas as adaptações enumeradas");

const prelude = (/** @type {string} */ html) =>
  between(html, '<script type="text/x-dc"', "class Component extends DCLogic");
let expectedPrelude = prelude(original);
for (const name of ["HIST", "DEST", "SPLIT", "PRE", "PARTNERS"]) {
  const pattern =
    name === "HIST"
      ? /^const HIST = \[[\s\S]*?^\];\n/m
      : new RegExp("^const " + name + " = [^\\n]*\\n", "m");
  assert.ok(pattern.test(expectedPrelude), name);
  expectedPrelude = expectedPrelude.replace(pattern, "");
}
expectedPrelude = expectedPrelude
  .replace(/^  noPrecedent:[^\n]*\n/m, "")
  .replace(/^  reaction:[^\n]*\n/m, "")
  .replace(" Existiu em 2018.", "")
  .replace(" Existiu até 2016.", "")
  .replace(
    " + (m < 38 ? ' Com menos cargos, os partidos podem votar contra a medida.' : m > 38 ? ' Mais cargos agradam os partidos, e os jornais vão criticar.' : '')",
    "",
  );
assert.equal(
  prelude(current),
  expectedPrelude,
  "ícones, retratos, fichas e auxiliares preservados",
);

/** @param {string} html */
function methods(html) {
  const body = between(html, "class Component extends DCLogic", "  renderVals() {");
  const matches = [...body.matchAll(/^  (\w+)\([^\n]*\) \{/gm)];
  return matches.map((match, index) => {
    assert.ok(match.index !== undefined && match[1]);
    const end = matches[index + 1]?.index ?? body.length;
    const code = body.slice(match.index, end);
    return { name: match[1], code, lines: code.trimEnd().split("\n").length };
  });
}
const beforeMethods = methods(original);
const afterMethods = methods(current);
assert.deepEqual(
  beforeMethods.map(method => method.name),
  afterMethods.map(method => method.name),
);
const methodReport = beforeMethods.map((method, index) => {
  const after = afterMethods[index];
  assert.ok(after);
  let adapted = method.code;
  if (method.name === "constructor")
    adapted = adapted.replace(
      "\n  }\n",
      "\n    this.state = globalThis.PosseEngine.start(this.state);\n  }\n",
    );
  if (method.name === "focusOn")
    adapted = adapted.replace(
      "el.querySelector('[data-tl]').textContent = st + ' · ' + p.seats + ' deputados · vota com o governo ' + ch + '% das vezes';",
      "el.querySelector('[data-tl]').textContent = globalThis.PosseEngine.current.status === 'unknown' ? p.seats + ' deputados · ' + globalThis.PosseEngine.current.reason : st + ' · ' + p.seats + ' deputados · vota com o governo ' + ch + '% das vezes';",
    );
  assert.equal(after.code, adapted, method.name + ": gesto original preservado");
  return {
    name: method.name,
    originalLines: method.lines,
    currentLines: after.lines,
    identical: after.code === method.code,
    originalHash: hash(method.code),
    currentHash: hash(after.code),
    adaptation:
      method.name === "constructor"
        ? "Inicializa a ponte antes da primeira renderização; estado inicial do Claude conservado."
        : method.name === "focusOn"
          ? "Troca somente o texto quando a estimativa não está disponível; posicionamento e eventos conservados."
          : null,
  };
});

const layout = (/** @type {string} */ html) => between(html, "    const nB =", "    const inc =");
assert.equal(
  layout(current),
  layout(original).replace(
    "d: ICON[id] || ICON['casa-civil'], vb: ICON_VB[id] || ICON_VB['casa-civil']",
    "d: ICON[id] || ICON[personSeat(id)] || ICON['casa-civil'], vb: ICON_VB[id] || ICON_VB[personSeat(id)] || ICON_VB['casa-civil']",
  ),
  "geometria dos ministérios, hemiciclo e eventos sem mudanças",
);
const creation = (/** @type {string} */ html) =>
  between(html, "  renderVals() {", "    const created = S.created;");
assert.equal(
  creation(current),
  creation(original) + "    const government = globalThis.PosseEngine.structure(S, LABEL);\n",
  "criação do Presidente preservada",
);
const formEvents = (/** @type {string} */ html) =>
  between(html, "      adv: {", "      finish: function ()");
assert.equal(
  formEvents(current),
  formEvents(original),
  "formulário, validação, randomização, retratos e cerimônia do Claude",
);
const buttonHelpers = (/** @type {string} */ html) =>
  between(html, "    const act =", "    const suggested =");
assert.equal(buttonHelpers(current), buttonHelpers(original), "botões e variantes originais");
const card = (/** @type {string} */ html) =>
  between(html, "      const cardOf =", "      self._cards =");
assert.equal(
  card(current),
  card(original).replace(
    "const brings = hp.kind",
    "const brings = engineCurrent.status === 'unknown' ? engineCurrent.reason : hp.kind",
  ),
  "conteúdo e montagem da ficha; apenas a informação disponível muda",
);
const row = (/** @type {string} */ html) =>
  html.split("\n").find(line => line.includes("rows.push({ isHeader: false"));
assert.ok(row(original));
assert.equal(
  row(current),
  row(original)?.replace("gain: v >", "gain: engineCurrent.status === 'unknown' ? '—' : v >"),
  "linha de candidato: classes, retrato, click e hover preservados",
);
const runtime = POSSE_FILES.runtime;
const runtimeBytes = await readFile(runtime);
/** @type {{workspace_files: Record<string, {bytes: number, sha256: string}>}} */
const inventory = JSON.parse(
  await readFile("prototypes/posse/vendor/workspace-cleanup-2026-09-30.json", "utf8"),
);
const baselineRuntime = inventory.workspace_files["tmp/posse/rt/artifact-type/dc-runtime.js"];
assert.ok(baselineRuntime, "runtime catalogado antes desta correção");
assert.equal(
  createHash("sha256").update(runtimeBytes).digest("hex"),
  baselineRuntime.sha256,
  "runtime original sem alterações",
);

const diff = spawnSync("git", ["diff", "--no-index", "--no-color", "--unified=3", "--", ...paths], {
  encoding: "utf8",
  windowsHide: true,
});
assert.ok(diff.status === 0 || diff.status === 1, diff.stderr);
const patch = diff.stdout.replace(/\r\n/g, "\n");
/** @typedef {{originalStart: number, currentStart: number, removed: string[], added: string[]}} Change */
/** @type {Change[]} */
const changes = [];
let oldLine = 0;
let newLine = 0;
/** @type {Change | null} */
let block = null;
for (const line of patch.split("\n")) {
  const hunk = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if (hunk) {
    oldLine = Number(hunk[1]);
    newLine = Number(hunk[2]);
    block = null;
  } else if (oldLine && (line.startsWith("-") || line.startsWith("+"))) {
    if (!block) {
      block = { originalStart: oldLine, currentStart: newLine, removed: [], added: [] };
      changes.push(block);
    }
    if (line.startsWith("-")) {
      block.removed.push(line.slice(1));
      oldLine++;
    } else {
      block.added.push(line.slice(1));
      newLine++;
    }
  } else if (oldLine && line.startsWith(" ")) {
    oldLine++;
    newLine++;
    block = null;
  }
}
const annotations = [
  [
    "Inicialização",
    "Carrega a ponte ESM e resolve os assets pela fonte importada em vendor/posse; o mesmo runtime do Claude permanece responsável pela UI.",
  ],
  [
    "F5",
    "Oculta o template até o runtime estar pronto; elimina a exposição do HTML sem processamento. Não altera keyframes.",
  ],
  ["Texto", "Identifica o número como estimativa estrutural; mantém classe, tamanho e posição."],
  [
    "Campos novos",
    "Nome e busca reutilizam stack, caption e field no painel original. Visíveis somente nas operações que os exigem.",
  ],
  [
    "Texto removido",
    "Retira duas referências históricas dos atalhos de divisão, conforme solicitado.",
  ],
  ["Critério removido", "Elimina HIST, DEST, SPLIT e PRE. Não redesenha componentes."],
  [
    "Critério removido",
    "Elimina PARTNERS; lista de destinos passa a consultar os trabalhos atuais.",
  ],
  [
    "Conserto",
    "Extinguir não anuncia reação dos partidos sem motor atrás; sobra a contagem de ministérios (defeito de 01/10).",
  ],
  ["Texto removido", "Elimina T.noPrecedent e T.reaction integralmente."],
  ["Inicialização", "Liga a inicialização sem mudar o estado inicial do Claude."],
  [
    "Informação disponível",
    "Na dica da bancada, altera somente o texto quando não há estimativa; gesto e posicionamento idênticos.",
  ],
  [
    "Dados",
    "Obtém a estrutura atual para a tela; nenhuma regra de apresentação é alterada nesta linha.",
  ],
  [
    "Compatibilidade de IDs",
    "Resolve nomes e perfil visual de pastas criadas; reutiliza os catálogos do Claude.",
  ],
  [
    "Dados",
    "Adapta nomes, atribuições e pesos à estrutura atual. Regra estrutural fica fora desta aprovação de UI.",
  ],
  ["Dados", "Conecta a consulta da base. Não cria componente ou animação."],
  ["Cálculo", "Substitui a conta de apoio por consulta da ponte; fora da avaliação de UI."],
  ["Cálculo", "Retira a antiga conta individual para usar a consulta da ponte no bloco seguinte."],
  [
    "Cálculo",
    "Consulta apoio individual e total; mantém geometria dos pontos, conferida em bloco completo.",
  ],
  ["Cálculo", "Consulta estimativas por partido; não altera os estilos ou eventos dos pontos."],
  [
    "Ícones",
    "Pasta criada reutiliza o ícone e viewBox do perfil original; tamanhos, cores, posições e click preservados.",
  ],
  [
    "Compatibilidade de IDs",
    "Permite título de pasta criada sem acesso a OFFICIAL inexistente; mesmo componente.",
  ],
  [
    "Texto e dados",
    "Descrição reflete atribuições atuais e pasta vazia; remove promessa de poder por número de pastas.",
  ],
  ["Critério removido", "Retira sugestões fixas de parceiros; opções usam a lista atual."],
  [
    "Distribuição",
    "Começa com destinos a escolher e aplica a proposta aos controles existentes; sem destino histórico automático.",
  ],
  [
    "Operação",
    "Juntar consulta a estrutura. Vínculo institucional pendente conserva a proposta; regra fica fora da auditoria de UI.",
  ],
  [
    "Operação",
    "Guarda a estrutura resultante da junção; conserva seleção, mensagem e titular pelos mesmos controles.",
  ],
  [
    "Controles novos",
    "Criar, renomear e transferir usam act, classes e painel do Claude; confirmação, seleção e retorno explícitos.",
  ],
  [
    "Nome",
    "Junção conserva nomes atuais, inclusive renomeações; não altera a apresentação do botão.",
  ],
  ["Critério removido", "Retira nomes sugeridos por HIST; permanece o botão com os dois nomes."],
  [
    "Destinos",
    "Escolha individual ou em lote e busca por atribuições atuais. Botões originais, com retorno à divisão.",
  ],
  [
    "Operação",
    "Assinar exige destinos completos e consulta a estrutura; regra fora da avaliação de UI.",
  ],
  ["Operação", "Atualiza seleção após extinção com destino válido; mesma tela e mensagem-base."],
  [
    "Estado do botão",
    "Assinar usa wide off enquanto faltam destinos; reutiliza o estado off original.",
  ],
  ["Texto", "Troca a proposta da Casa Civil por distribuição das atribuições."],
  ["Texto", "Retira precedente/reação genérica e explica a escolha de destinos pendente."],
  [
    "Distribuição",
    'Escolha em lote e recomeço reutilizam os botões; não retomam destinos históricos. Parte sem destino diz "Sem destino" em vez do rótulo do botão (defeito de 01/10).',
  ],
  [
    "Operações e controles",
    "Extinção explícita, atalhos de divisão e três novas ações no painel; estilos originais conservados.",
  ],
  [
    "Operações inversas",
    "Desfazer, recriar e desistir consultam a estrutura atual; mesmas variantes de botão e painel.",
  ],
  [
    "Compatibilidade de IDs",
    "Lista de pessoas de nova pasta usa o perfil original, mantendo os retratos e as fichas.",
  ],
  [
    "Informação disponível",
    "Mensagem de nomeação não inventa apoio após reforma; movimento do retrato continua em lockIn, idêntico.",
  ],
  [
    "Informação disponível",
    "Ganho vira travessão se desconhecido. Todas as demais propriedades, classes e eventos da linha são idênticos.",
  ],
  [
    "Informação disponível",
    "Ficha declara estimativa ausente; montagem, estatísticas e estilo são os originais.",
  ],
  [
    "Informação disponível",
    "Hint de ordenação por votos declara a lacuna; os quatro botões e seu click conservados.",
  ],
  [
    "Informação disponível",
    "Mensagem de exoneração declara apoio desconhecido; botão e remoção do titular usam os gestos existentes.",
  ],
  ["Captura", "Registra a seleção antes da foto; transição para photo e hover permanecem iguais."],
  [
    "Informação disponível",
    "Resumo da foto declara lacuna da estimativa; molduras e animações continuam originais.",
  ],
  ["Informação disponível", "Legenda e travessão na base desconhecida; mesmo medidor e classes."],
  [
    "Campos novos",
    "Liga os dois campos condicionais ao estado; classes e eventos do restante do painel preservados.",
  ],
];
assert.equal(changes.length, annotations.length, "todo bloco do diff precisa de anotação revista");
const annotated = changes.map((change, index) => ({
  ...change,
  category: annotations[index]?.[0],
  review: annotations[index]?.[1],
}));
await writeFile(`${POSSE_FILES.reports}/ui-diff.patch`, patch);
const report = {
  date: new Date().toISOString(),
  scope:
    "Comparação integral das duas páginas, com verificações exatas da apresentação e dos métodos de interação. Alterações de cálculo e estrutura são apenas localizadas no diff; não aprovadas por esta auditoria de UI.",
  paths,
  hashes: { original: hash(original), current: hash(current) },
  styles: {
    blocks: styles(original).length,
    lines: styles(original).reduce((sum, style) => sum + (style?.split("\n").length ?? 0), 0),
    identical: true,
  },
  template: {
    originalLines: template(original).split("\n").length,
    currentLines: template(current).split("\n").length,
    checkedEntirely: true,
    adaptations: [
      "entrada ESM",
      "base dos assets na fonte importada",
      "ocultar template antes do runtime",
      "legenda da estimativa",
      "campo de nome",
      "campo de busca",
    ],
  },
  prelude: {
    checkedEntirely: true,
    removed: [
      "HIST",
      "DEST",
      "SPLIT",
      "PRE",
      "PARTNERS",
      "T.noPrecedent",
      "T.reaction",
      "duas referências históricas nos atalhos de divisão",
    ],
  },
  runtime: { path: runtime, unchangedFromRecoveryInventory: true, sha256: baselineRuntime.sha256 },
  methods: methodReport,
  changes: annotated,
};
await writeFile(`${POSSE_FILES.reports}/ui-audit.json`, JSON.stringify(report, null, 2) + "\n");
const markdown = [
  `# Comparação linha por linha da UI da posse — ${report.date}`,
  "",
  `Referência: [original do Claude](../../../${POSSE_FILES.reference}). Comparada: [versão transformada](../../../${POSSE_FILES.preview}). O original foi preservado. Esta auditoria cobre apresentação e interação; apenas localiza as alterações de dados e cálculos, sem aprovar sistemas por aparência.`,
  "",
  "## O que foi comparado integralmente",
  "",
  `- ${report.styles.blocks} blocos de CSS, ${report.styles.lines} linhas: conteúdo idêntico, incluindo keyframes, transições, curvas, sombras, máscaras, filtros, cores, fontes e foco.`,
  `- HTML inteiro: ${report.template.originalLines} linhas na referência e ${report.template.currentLines} na versão nova. As únicas adaptações são entrada ESM, base dos assets importados, ocultação inicial do template, legenda da base e dois campos condicionais.`,
  "- Catálogos e auxiliares anteriores ao componente: todos conferidos. Apenas as tabelas e os textos de precedente/distribuição fixa solicitados foram removidos. Ícones SVG, retratos, desenho das fichas e demais auxiliares conservados.",
  "- Geometria dos ministérios e hemiciclo, eventos de seleção, botões e variantes, formulário do Presidente, cerimônia, linha de candidato e montagem da ficha: comparações exatas dos blocos. A única adaptação visual dos círculos é buscar o ícone original do perfil de uma pasta criada.",
  `- Runtime: o mesmo arquivo do Claude, SHA-256 ${baselineRuntime.sha256}; igual ao inventário feito antes desta recuperação.`,
  "",
  "## Métodos de interação",
  "",
  "| Método | Linhas no original | Resultado |",
  "| --- | ---: | --- |",
  ...methodReport.map(
    method =>
      `| ${method.name} | ${method.originalLines} | ${method.identical ? "Idêntico" : method.adaptation} |`,
  ),
  "",
  "Os 16 métodos sem adaptação são cópias exatas. Os outros dois preservam todo o gesto: o construtor ganha a inicialização e focusOn troca uma linha de texto quando a estimativa falta. lockIn conserva o voo de 560 ms, a curva cubic-bezier(.2,.8,.2,1) e o pulso de 520 ms com atraso de 440 ms.",
  "",
  "## Todas as diferenças localizadas",
  "",
  "Números referem-se às linhas dos dois HTMLs no estado auditado. Inserções indicam o ponto de inserção no original. O [diff completo](ui-diff.patch) e os [trechos antes/depois em JSON](ui-audit.json) permitem verificar cada linha sem truncamento.",
  "",
  "| Bloco | Original | Transformado | Classificação e revisão |",
  "| ---: | --- | --- | --- |",
  ...annotated.map(
    (change, index) =>
      `| ${index + 1} | ${change.originalStart}${change.removed.length > 1 ? "–" + (change.originalStart + change.removed.length - 1) : ""} | ${change.currentStart}${change.added.length > 1 ? "–" + (change.currentStart + change.added.length - 1) : ""} | **${change.category}:** ${change.review} |`,
  ),
  "",
  "## Conferência no navegador",
  "",
  "Provas de navegador executadas separadamente: [gestos](comparison.json), [movimento e F5](motion.json), [reformas](reforms.json), [teclado](controls.json) e [reinício](reset.json). Links apontam para os resultados da rodada atual quando seus comandos foram executados. Esta auditoria estática não declara aprovação dessas provas.",
  "",
  "A igualdade do código de apresentação não prova todas as combinações possíveis de conteúdo, zoom ou crescimento ilimitado da estrutura. Revisão independente dos sistemas continua pendente. Novos achados de UI devem ser reproduzidos e corrigidos pela referência do Claude.",
  "",
  "Reproduzir a comparação estática: `node prototypes/posse/tools/audit-posse-ui.mjs`. As provas dinâmicas estão em `tests/browser/posse/comparison.mjs`, `posse-motion.mjs`, `posse-reforms.mjs` e `posse-controls.mjs`.",
  "",
].join("\n");
await writeFile(`${POSSE_FILES.reports}/ui-audit.md`, markdown);
process.stdout.write(
  JSON.stringify(
    {
      styles: report.styles,
      template: report.template,
      methods: methodReport.map(({ name, identical, originalLines }) => ({
        name,
        identical,
        originalLines,
      })),
      changes: changes.map((change, index) => ({
        index,
        originalStart: change.originalStart,
        currentStart: change.currentStart,
        removed: change.removed.length,
        added: change.added.length,
        first: change.added[0]?.slice(0, 110) ?? change.removed[0]?.slice(0, 110),
      })),
    },
    null,
    2,
  ) + "\n",
);
