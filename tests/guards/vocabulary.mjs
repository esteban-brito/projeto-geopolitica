/* GUARDA · VOCABULARIO — nenhuma frase escrita duas vezes, e nenhuma escrita e nunca dita.
   ══════════════════════════════════════════════════════════════════════════════

   ── ELA TEM DOIS TRABALHOS, e o segundo nasceu em 21/08/2026 ────────────────
   O primeiro e a DUPLICATA: a mesma frase teclada em dois lugares. O segundo e a
   ORFA: uma frase declarada em `strings.mjs` que nenhum arquivo alcanca.

   ⚠ A SEGUNDA NASCEU DE UMA CONTAGEM, e o numero e 49. A varredura de 21/08 achou
   quarenta e nove frases que nenhum arquivo le — entre elas `approvalParts`, que era a
   CHAVE das tres cores do termometro da rua: o Gabinete desenhava verde, azul e vermelho
   sem legenda nenhuma, e a legenda existia, escrita, a um caminho de distancia. **A
   ausencia na tela e a presenca no arquivo estavam as duas erradas ao mesmo tempo**, e
   nada podia acusar isso.

   ⚠ E O RESTO DAS 49 E ARQUEOLOGIA DE PECA MORTA: `cabinet.archLoyal` e as duas irmas
   sobreviveram ao arco que morreu em 15/08; `cabinet.inbox`, `cabinet.congress` e
   `cabinet.vault` sobreviveram as cinco legendas que sairam em 20/08; `area.propose`
   sobreviveu ao orcamento granular — e a prosa ao lado dela JA DIZIA que ela tinha saido.
   **Prosa que registra a morte nao apaga a chave**, e a chave morta e o que faz a proxima
   sessao achar que a peca ainda existe.

   ⚠ E O PROJETO JA COBRAVA ISSO NOS OUTROS EIXOS: `tokens` acusa token sem consumidor,
   `orphans` acusa folha de estilo sem produtor, e a doutrina escrita diz que "`export`
   sem quem importe e uma porta aberta". A frase da interface era o unico eixo sem a mesma
   cobranca — e foi o unico em que cinquenta pecas mortas se acumularam.

   ── AS DUAS AUDITORIAS PEDEM COISAS DIFERENTES DO `files` ───────────────────
   ⚠ A DUPLICATA precisa so de `strings.mjs`; a ORFA precisa do PROJETO INTEIRO, porque o
   consumidor mora fora. Por isso a segunda so roda quando o entrypoint esta no mapa — e
   isso NAO e conveniencia: sem a condicao, as provas sinteticas da duplicata (que entregam
   so o arquivo de frases) passariam a ser acusadas de orfandade, e ai elas ficariam verdes
   mesmo se a deteccao de duplicata quebrasse. **Uma prova que passa pela razao errada e
   uma prova que nao prova nada.**

   ⚠ ELA NASCEU DE UMA CONTAGEM, em 18/08/2026: **vinte e tres frases estavam
   duplicadas** em `src/ui/strings.mjs`, e uma delas — "Opinião pública" — aparecia
   duas vezes DENTRO DO MESMO OBJETO, em `cabinet.ruptureSocial` e em
   `cabinet.trinity.social`. O nome de cada tela estava escrito duas vezes (no menu e
   no titulo dela), o carimbo do afastamento duas vezes, "PIB" duas vezes.

   ── POR QUE COPIA DUPLICADA E CARA, e a razao nao e ruido ───────────────────
   Ela nao quebra nada enquanto ninguem mexe. O defeito nasce na PRIMEIRA vez que
   alguem ajusta uma das duas — e a partir dali o menu chama a tela de um nome e a
   tela se chama de outro, sem nada falhar e sem nada acusar.

   ⚠ E O PROJETO JA TINHA UM CASO CONSUMADO quando esta guarda nasceu: o estado de
   uma bancada rompida era **"rompida"** em `mood.broken` e **"em ruptura"** em
   `cabinet.archRuptured`. Mesmo estado, mesmo motor, duas palavras — e um jogador
   procurando a diferenca entre as duas nao ia achar, porque ela nao existia.

   ── O QUE ELA MEDE, E POR QUE E O LITERAL ───────────────────────────────────
   Ela conta LITERAIS de string no arquivo, e nao os valores resolvidos. A diferenca
   e o conserto inteiro: depois que `nav.cabinet` e `cabinet.title` passam a apontar
   para `TERMOS.cabinet`, os dois VALORES continuam sendo "Gabinete" — e devem
   continuar. O que nao pode voltar e a palavra estar TECLADA duas vezes.

   ⚠ COMENTARIO NAO CONTA. Este arquivo e o mais comentado do projeto, e a prosa dele
   cita as proprias frases o tempo todo — contar comentario faria a guarda acusar
   justamente a explicacao de por que a frase e aquela.

   ── AS EXCECOES SAO POR VALOR, E CADA UMA TEM RAZAO ─────────────────────────
   Ver `PERMITIDAS`. Entra ali o que coincide HOJE e pode divergir amanha por
   decisao: se as duas nao mudassem juntas obrigatoriamente, elas nao sao a mesma
   frase — sao duas frases com a mesma palavra. */

import { collect, stripJsComments } from "../lib/project.mjs";

export const name = "vocabulary";

const STRINGS_FILE = "src/ui/strings.mjs";

/* ⚠ CADA ENTRADA E UM BURACO NA GUARDA, e por isso cada uma precisa de razao.

     "Mês"   `context.month` e o ROTULO de uma coluna e `TERMOS.month` e a unidade
             que sai ao lado de um numero — "vence em 2 mês". Caixa diferente e
             papel diferente, e uni-los faria um dos dois ficar errado;
     "de"    idem: `TERMOS.of` e a preposicao de "342 de 513". Um segundo "de" solto
             no arquivo e quase certamente um descuido, e por isso ele NAO entra —
             esta lista guarda o par acima e mais nada. */
const PERMITIDAS = new Set(["Mês"]);

/* ABAIXO DE QUE TAMANHO NAO VALE A PENA. Uma palavra de uma letra repetida nao e
   vocabulario divergindo — e o simbolo de uma unidade, um separador, um travessao. */
const MINIMO = 2;

/**
 * OS LITERAIS DE STRING DO ARQUIVO, com a linha de cada um.
 *
 * ⚠ SO ASPAS DUPLAS, e e o suficiente: `prettier` normaliza o projeto inteiro para
 * elas, e um literal em aspas simples nao passaria pelo `format` que o `validate`
 * cobra. Template literal fica de fora de proposito — frase com interpolacao dentro
 * nao e a mesma frase em dois lugares, e sim duas montagens.
 *
 * @param {string} code ja sem comentarios
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

/* O ENTRYPOINT E O SINAL DE QUE O PROJETO INTEIRO ESTA NO MAPA. Ver a prosa do
   cabecalho: a auditoria de orfandade so pode rodar com os consumidores presentes. */
const ENTRY = "app.mjs";

/**
 * AS FOLHAS DECLARADAS EM `export const UI`, com a linha de cada uma.
 *
 * ⚠ ELA LE O TEXTO E NAO IMPORTA O MODULO, e a razao e a mesma que faz a duplicata contar
 * LITERAL: a guarda precisa rodar sobre o arquivo FALSO de uma prova sintetica, e um
 * `import` so alcanca o arquivo de verdade.
 *
 * ⚠ E ELA PULA A STRING ANTES DE CONTAR CHAVE. Sem isso, uma frase com dois-pontos dentro
 * — "vence em: 2 meses" — viraria uma chave, e a guarda acusaria uma orfa que nao existe.
 *
 * @param {string} code ja sem comentarios
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
      /* CHAVE ou VALOR: o que separa os dois e o `:` depois do fecha-aspas. */
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
 * ⚠ UM CAMINHO ALCANCADO COBRE TUDO ABAIXO DELE, e essa e a regra inteira: quem escreve
 * `labelOf(UI.inbox.why, letter.kind)` passa a TABELA, e as nove frases dentro dela sao
 * alcancadas sem que nenhuma apareca em codigo. Exigir a folha ali faria a guarda acusar
 * exatamente o padrao que este projeto usa para nao ter nove `case`.
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

  /* ── A ORFA ────────────────────────────────────────────────────────────────
     So com o projeto inteiro no mapa. Ver a prosa do cabecalho. */
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

/* ── AS PROVAS SINTETICAS ────────────────────────────────────────────────────
   Cada uma reintroduz um defeito real que o projeto ja pagou. */
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
    /* ⚠ QUE COMENTARIO NAO CONTA nao ganha prova sintetica propria, e a razao e que
       ele ja tem uma melhor: o arquivo REAL passa verde, e ele e o mais comentado do
       projeto — a prosa dele cita as proprias frases o tempo todo. Uma guarda que
       contasse comentario nao chegaria ao fim daquele arquivo. */
    label: "a unidade repetida em dois blocos",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { area: { perYear: \"/ano\" }, finance: { perYear: \"/ano\" } };',
      ],
    ]),
  },
  /* ── AS PROVAS DA ORFA ────────────────────────────────────────────────────
     ⚠ AS DUAS ENTREGAM O ENTRYPOINT, e sem ele a segunda auditoria nem roda — ver a prosa
     do cabecalho. E o `app.mjs` de cada uma consome UMA das duas chaves, porque a prova
     precisa mostrar que a guarda separa a viva da morta, e nao que ela acusa tudo.

     ⚠ E QUE A TABELA PASSADA INTEIRA NAO E ORFA nao ganha prova sintetica propria, pela
     mesma razao que "comentario nao conta" nao ganha: ela ja tem uma melhor, e e o arquivo
     REAL. `UI.inbox.why` tem nove frases e nenhuma delas aparece em codigo — quem escreve
     e `labelOf(UI.inbox.why, letter.kind)`. Se a guarda exigisse a folha, ela acusaria
     nove frases vivas no primeiro `npm run check`, e o arquivo real e quem prova que nao. */
  {
    label: "a chave que sobreviveu a peca que a usava",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { cabinet: { title: "Gabinete", archLoyal: "com o governo" } };',
      ],
      ["app.mjs", "el.main.innerHTML = headHtml({ title: UI.cabinet.title });"],
    ]),
  },
  {
    /* ⚠ ESTA E A QUE IMPORTA, e ela e o caso medido de 21/08: `approvalParts` era a CHAVE
       das tres cores do termometro da rua — escrita, correta, e nunca lida. O defeito nao
       era uma linha a mais no arquivo: era a tela desenhar verde, azul e vermelho sem
       legenda nenhuma tendo a legenda pronta ao lado. */
    label: "a chave de um grafico, escrita e nunca dita",
    files: new Map([
      [
        STRINGS_FILE,
        'export const UI = { cabinet: { title: "Gabinete" }, ' +
          'approvalParts: { good: "Ótimo/bom", poor: "Ruim/péssimo" } };',
      ],
      ["app.mjs", "el.main.innerHTML = headHtml({ title: UI.cabinet.title });"],
    ]),
  },
];
