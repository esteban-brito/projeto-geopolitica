/* GUARDA · VOCABULARIO — nenhuma frase da interface escrita duas vezes.
   ══════════════════════════════════════════════════════════════════════════════

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
];
