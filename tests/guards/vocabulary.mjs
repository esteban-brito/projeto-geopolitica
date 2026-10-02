/* GUARDA · VOCABULÁRIO — nenhuma frase escrita duas vezes, e nenhuma escrita e nunca dita.
   ══════════════════════════════════════════════════════════════════════════════

   ── ELA TEM DOIS TRABALHOS, e o segundo nasceu em 21/08/2026 ────────────────
   O primeiro é a DUPLICATA: a mesma frase teclada em dois lugares. O segundo é a
   ÓRFÃ: uma frase declarada em `strings.mjs` que nenhum arquivo alcança.

   ⚠ A SEGUNDA NASCEU DE UMA CONTAGEM, e o número é 49. A varredura de 21/08 achou
   quarenta e nove frases que nenhum arquivo lê — entre elas `approvalParts`, que era a
   CHAVE das três cores do termômetro da rua: o Gabinete desenhava verde, azul e vermelho
   sem legenda nenhuma, e a legenda existia, escrita, a um caminho de distância. **A
   ausência na tela e a presença no arquivo estavam as duas erradas ao mesmo tempo**, e
   nada podia acusar isso.

   ⚠ E O RESTO DAS 49 É ARQUEOLOGIA DE PEÇA MORTA: `cabinet.archLoyal` e as duas irmãs
   sobreviveram ao arco que morreu em 15/08; `cabinet.inbox`, `cabinet.congress` e
   `cabinet.vault` sobreviveram às cinco legendas que saíram em 20/08; `area.propose`
   sobreviveu ao orçamento granular — e a prosa ao lado dela JÁ DIZIA que ela tinha saído.
   **Prosa que registra a morte não apaga a chave**, e a chave morta é o que faz a próxima
   sessão achar que a peça ainda existe.

   ⚠ E O PROJETO JÁ COBRAVA ISSO NOS OUTROS EIXOS: `tokens` acusa token sem consumidor,
   `orphans` acusa folha de estilo sem produtor, e a doutrina escrita diz que "`export`
   sem quem importe é uma porta aberta". A frase da interface era o único eixo sem a mesma
   cobrança — e foi o único em que cinquenta peças mortas se acumularam.

   ── AS DUAS AUDITORIAS PEDEM COISAS DIFERENTES DO `files` ───────────────────
   ⚠ A DUPLICATA precisa só de `strings.mjs`; a ÓRFÃ precisa do PROJETO INTEIRO, porque o
   consumidor mora fora. Por isso a segunda só roda quando o entrypoint está no mapa — e
   isso NÃO é conveniência: sem a condição, as provas sintéticas da duplicata (que entregam
   só o arquivo de frases) passariam a ser acusadas de orfandade, e aí elas ficariam verdes
   mesmo se a detecção de duplicata quebrasse. **Uma prova que passa pela razão errada é
   uma prova que não prova nada.**

   ⚠ ELA NASCEU DE UMA CONTAGEM, em 18/08/2026: **vinte e três frases estavam
   duplicadas** em `src/ui/strings.mjs`, e uma delas — "Opinião pública" — aparecia
   duas vezes DENTRO DO MESMO OBJETO, em `cabinet.ruptureSocial` e em
   `cabinet.trinity.social`. O nome de cada tela estava escrito duas vezes (no menu e
   no título dela), o carimbo do afastamento duas vezes, "PIB" duas vezes.

   ── POR QUE CÓPIA DUPLICADA É CARA, e a razão não é ruído ───────────────────
   Ela não quebra nada enquanto ninguém mexe. O defeito nasce na PRIMEIRA vez que
   alguém ajusta uma das duas — e a partir dali o menu chama a tela de um nome e a
   tela se chama de outro, sem nada falhar e sem nada acusar.

   ⚠ E O PROJETO JÁ TINHA UM CASO CONSUMADO quando esta guarda nasceu: o estado de
   uma bancada rompida era **"rompida"** em `mood.broken` e **"em ruptura"** em
   `cabinet.archRuptured`. Mesmo estado, mesmo motor, duas palavras — e um jogador
   procurando a diferença entre as duas não ia achar, porque ela não existia.

   ── O QUE ELA MEDE, E POR QUE É O LITERAL ───────────────────────────────────
   Ela conta LITERAIS de string no arquivo, e não os valores resolvidos. A diferença
   é o conserto inteiro: depois que `nav.cabinet` e `cabinet.title` passam a apontar
   para `TERMOS.cabinet`, os dois VALORES continuam sendo "Gabinete" — e devem
   continuar. O que não pode voltar é a palavra estar TECLADA duas vezes.

   ⚠ COMENTÁRIO NÃO CONTA. Este arquivo é o mais comentado do projeto, e a prosa dele
   cita as próprias frases o tempo todo — contar comentário faria a guarda acusar
   justamente a explicação de por que a frase é aquela.

   ── AS EXCEÇÕES SÃO POR VALOR, E CADA UMA TEM RAZÃO ─────────────────────────
   Ver `PERMITIDAS`. Entra ali o que coincide HOJE e pode divergir amanhã por
   decisão: se as duas não mudassem juntas obrigatoriamente, elas não são a mesma
   frase — são duas frases com a mesma palavra. */

import { collect, stripJsComments } from "../lib/project.mjs";

export const name = "vocabulary";

const STRINGS_FILE = "src/ui/strings.mjs";

/* ⚠ CADA ENTRADA É UM BURACO NA GUARDA, e por isso cada uma precisa de razão.

     "Mês"   `context.month` é o RÓTULO de uma coluna e `TERMOS.month` é a unidade
             que sai ao lado de um número — "vence em 2 mês". Caixa diferente e
             papel diferente, e uni-los faria um dos dois ficar errado;
     "de"    idem: `TERMOS.of` é a preposição de "342 de 513". Um segundo "de" solto
             no arquivo é quase certamente um descuido, e por isso ele NÃO entra —
             esta lista guarda o par acima e mais nada. */
const PERMITIDAS = new Set(["Mês"]);

/* ABAIXO DE QUE TAMANHO NÃO VALE A PENA. Uma palavra de uma letra repetida não é
   vocabulário divergindo — é o símbolo de uma unidade, um separador, um travessão. */
const MINIMO = 2;

/**
 * OS LITERAIS DE STRING DO ARQUIVO, com a linha de cada um.
 *
 * ⚠ SÓ ASPAS DUPLAS, e é o suficiente: `prettier` normaliza o projeto inteiro para
 * elas, e um literal em aspas simples não passaria pelo `format` que o `validate`
 * cobra. Template literal fica de fora de propósito — frase com interpolação dentro
 * não é a mesma frase em dois lugares, e sim duas montagens.
 *
 * @param {string} code já sem comentários
 * @returns {Array<[string, number]>}
 */
function literals(code) {
  /** @type {Array<[string, number]>} */
  const found = [];
  let line = 1;
  let cursor = 0;

  for (const match of code.matchAll(/"((?:[^"\\\n]|\\.)*)"/g)) {
    const at = match.index ?? 0;
    while (cursor < at) {
      if (code[cursor] === "\n") line++;
      cursor++;
    }
    const value = match[1] ?? "";
    if (value.length >= MINIMO) found.push([value, line]);
  }

  return found;
}

/* O ENTRYPOINT É O SINAL DE QUE O PROJETO INTEIRO ESTÁ NO MAPA. Ver a prosa do
   cabeçalho: a auditoria de orfandade só pode rodar com os consumidores presentes. */
const ENTRY = "src/main.mjs";

/**
 * AS FOLHAS DECLARADAS EM `export const UI`, com a linha de cada uma.
 *
 * ⚠ ELA LÊ O TEXTO E NÃO IMPORTA O MÓDULO, e a razão é a mesma que faz a duplicata contar
 * LITERAL: a guarda precisa rodar sobre o arquivo FALSO de uma prova sintética, e um
 * `import` só alcança o arquivo de verdade.
 *
 * ⚠ E ELA PULA A STRING ANTES DE CONTAR CHAVE. Sem isso, uma frase com dois-pontos dentro
 * — "vence em: 2 meses" — viraria uma chave, e a guarda acusaria uma órfã que não existe.
 *
 * @param {string} code já sem comentários
 * @returns {Array<[string, number]>} o caminho de cada folha, e a linha dela
 */
function leaves(code) {
  /** @type {Array<[string, number]>} */
  const out = [];
  const start = code.indexOf("export const UI");
  if (start < 0) return out;

  let cursor = code.indexOf("{", start);
  if (cursor < 0) return out;

  let line = 1;
  for (let i = 0; i < cursor; i++) if (code[i] === "\n") line++;

  /** @type {string[]} */
  const path = [];
  /** @type {string | null} */
  let key = null;
  let depth = 0;

  while (cursor < code.length) {
    const ch = code[cursor];

    if (ch === "\n") {
      line++;
      cursor++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      let end = cursor + 1;
      while (end < code.length && code[end] !== ch) {
        if (code[end] === "\\") end++;
        if (code[end] === "\n") line++;
        end++;
      }
      /* CHAVE ou VALOR: o que separa os dois é o `:` depois do fecha-aspas. */
      if (/^\s*:/.test(code.slice(end + 1))) key = code.slice(cursor + 1, end);
      else if (key !== null) {
        out.push([[...path, key].join("."), line]);
        key = null;
      }
      cursor = end + 1;
      continue;
    }

    if (ch === "{") {
      depth++;
      if (key !== null) {
        path.push(key);
        key = null;
      }
      cursor++;
      continue;
    }

    if (ch === "}") {
      depth--;
      if (depth === 0) break;
      path.pop();
      cursor++;
      continue;
    }

    const word = code.slice(cursor).match(/^[A-Za-z_]\w*/)?.[0];
    if (word) {
      /* `TERMOS.cabinet` como VALOR fecha a folha; `cabinet:` abre uma chave. */
      if (/^\s*:/.test(code.slice(cursor + word.length))) key = word;
      else if (key !== null) {
        out.push([[...path, key].join("."), line]);
        key = null;
      }
      cursor += word.length;
      continue;
    }

    cursor++;
  }

  return out;
}

/**
 * TODO CAMINHO `UI.a.b` ESCRITO FORA DO ARQUIVO DE FRASES.
 *
 * ⚠ UM CAMINHO ALCANÇADO COBRE TUDO ABAIXO DELE, e essa é a regra inteira: quem escreve
 * `labelOf(UI.inbox.why, letter.kind)` passa a TABELA, e as nove frases dentro dela são
 * alcançadas sem que nenhuma apareça em código. Exigir a folha ali faria a guarda acusar
 * exatamente o padrão que este projeto usa para não ter nove `case`.
 *
 * @param {Map<string, string>} files
 * @returns {Set<string>}
 */
function reached(files) {
  /** @type {Set<string>} */
  const paths = new Set();
  for (const [path, code] of files) {
    if (path === STRINGS_FILE) continue;
    for (const match of code.matchAll(/\bUI((?:\.[A-Za-z_]\w*)+)/g)) {
      paths.add((match[1] ?? "").slice(1));
    }
  }
  return paths;
}

/**
 * @param {Map<string, string>} files
 */
export function audit(files) {
  const { list, add } = collect(name);

  const raw = files.get(STRINGS_FILE);
  if (raw === undefined) return list;

  /** @type {Map<string, number[]>} */
  const seen = new Map();
  for (const [value, line] of literals(stripJsComments(raw))) {
    const lines = seen.get(value);
    if (lines) lines.push(line);
    else seen.set(value, [line]);
  }

  for (const [value, lines] of seen) {
    if (lines.length < 2 || PERMITIDAS.has(value)) continue;
    add(
      `${STRINGS_FILE}:${lines.join(",")} escreve "${value}" ${lines.length} vezes — ` +
        `duas copias da mesma frase divergem no dia em que alguem ajustar uma delas. ` +
        `Se as duas mudam juntas, ponha em TERMOS; se nao, declare em PERMITIDAS`,
    );
  }

  /* ── A ÓRFÃ ────────────────────────────────────────────────────────────────
     Só com o projeto inteiro no mapa. Ver a prosa do cabeçalho. */
  if (files.has(ENTRY)) {
    const paths = reached(files);
    const covered = (/** @type {string} */ leaf) => {
      for (const used of paths) if (used === leaf || leaf.startsWith(`${used}.`)) return true;
      return false;
    };

    for (const [leaf, line] of leaves(stripJsComments(raw))) {
      if (covered(leaf)) continue;
      add(
        `${STRINGS_FILE}:${line} declara "${leaf}" e nenhum arquivo a alcanca — ` +
          `frase que a tela nunca diz e peca morta que a proxima sessao acha que existe. ` +
          `Ou a tela deixou de dizer o que devia, ou a chave sobreviveu a peca que a usava`,
      );
    }
  }

  return list;
}

/* ── AS PROVAS SINTÉTICAS ────────────────────────────────────────────────────
   Cada uma reintroduz um defeito real que o projeto já pagou. */
export const synthetic = [
  {
    label: "o nome da tela escrito no menu E no titulo dela",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { nav: { finance: "Finanças" }, finance: { title: "Finanças" } };',
      ],
    ]),
  },
  {
    label: "a mesma frase duas vezes DENTRO do mesmo objeto",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { cabinet: { ruptureSocial: "Opinião pública", ' +
          'trinity: { social: "Opinião pública" } } };',
      ],
    ]),
  },
  {
    label: "o carimbo do afastamento repetido em duas telas",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { cabinet: { fallen: "MANDATO INTERROMPIDO" }, ' +
          'closing: { removed: "MANDATO INTERROMPIDO" } };',
      ],
    ]),
  },
  {
    /* ⚠ QUE COMENTÁRIO NÃO CONTA não ganha prova sintética própria, e a razão é que
       ele já tem uma melhor: o arquivo REAL passa verde, e ele é o mais comentado do
       projeto — a prosa dele cita as próprias frases o tempo todo. Uma guarda que
       contasse comentário não chegaria ao fim daquele arquivo. */
    label: "a unidade repetida em dois blocos",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { area: { perYear: \"/ano\" }, finance: { perYear: \"/ano\" } };',
      ],
    ]),
  },
  /* ── AS PROVAS DA ÓRFÃ ────────────────────────────────────────────────────
     ⚠ AS DUAS ENTREGAM O ENTRYPOINT, e sem ele a segunda auditoria nem roda — ver a prosa
     do cabeçalho. E o `src/main.mjs` de cada uma consome UMA das duas chaves, porque a prova
     precisa mostrar que a guarda separa a viva da morta, e não que ela acusa tudo.

     ⚠ E QUE A TABELA PASSADA INTEIRA NÃO É ÓRFÃ não ganha prova sintética própria, pela
     mesma razão que "comentário não conta" não ganha: ela já tem uma melhor, e é o arquivo
     REAL. `UI.inbox.why` tem nove frases e nenhuma delas aparece em código — quem escreve
     é `labelOf(UI.inbox.why, letter.kind)`. Se a guarda exigisse a folha, ela acusaria
     nove frases vivas no primeiro `npm run check`, e o arquivo real é quem prova que não. */
  {
    label: "a chave que sobreviveu a peca que a usava",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { cabinet: { title: "Gabinete", archLoyal: "com o governo" } };',
      ],
      ["src/main.mjs", "el.main.innerHTML = headHtml({ title: UI.cabinet.title });"],
    ]),
  },
  {
    /* ⚠ ESTA É A QUE IMPORTA, e ela é o caso medido de 21/08: `approvalParts` era a CHAVE
       das três cores do termômetro da rua — escrita, correta, e nunca lida. O defeito não
       era uma linha a mais no arquivo: era a tela desenhar verde, azul e vermelho sem
       legenda nenhuma tendo a legenda pronta ao lado. */
    label: "a chave de um grafico, escrita e nunca dita",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { cabinet: { title: "Gabinete" }, ' +
          'approvalParts: { good: "Ótimo/bom", poor: "Ruim/péssimo" } };',
      ],
      ["src/main.mjs", "el.main.innerHTML = headHtml({ title: UI.cabinet.title });"],
    ]),
  },
];
