/* GUARDA · A PECA DE DADO — ela e UMA, na caixa e no Gabinete.

   ── POR QUE ELA NASCEU, E O NUMERO E DELE ──────────────────────────────────
   Palavras do responsavel: "todas essas tabelas me incomodam muito, nem queria que fossem
   tabelas". Medido no mesmo dia, abrindo TODA carta de um mandato de 14 meses num navegador:
   **19 de 23 cartas abertas traziam tabela**, com **306 celulas em tela por mes**, e a caixa
   tinha **CINCO formatos de anexo para quinze especies** — um formato novo a cada tres
   especies.

   ── POR QUE UMA GUARDA, E NAO UMA COMBINACAO ───────────────────────────────
   ⚠ O JOGO VAI GANHAR MUITA CARTA NOVA, e essa e a pergunta que ele fez antes de autorizar:
   "da pra fazer mesmo assim?". Da — mas so se a regra for executavel. Uma convencao escrita em
   prosa sobrevive tres sessoes; foi assim que os cinco formatos nasceram, um de cada vez, cada
   um razoavel sozinho. Esta guarda faz o portao recusar o sexto no dia em que alguem o
   escrever, inclusive eu, daqui a vinte sessoes, sem lembrar desta conversa.

   ── O QUE ELA MEDE ─────────────────────────────────────────────────────────
   Duas coisas, e a segunda entrou no ciclo 15.

   1. TABELA nas duas telas e na peca. ⚠ A TELA DO RELATORIO CONTINUA COM A DELA de proposito,
      e a distincao e a doutrina inteira: planilha mora em TELA, e a caixa e correspondencia. O
      Gabinete ja recusava listar bancada por bancada com essas palavras — "quem lista bancada
      por bancada, com nome e humor, e a tela do Congresso" — e era a CARTA que trazia as onze
      linhas;

   2. REGUA DESENHADA PELA TELA. Medido em 29/08/2026, mes 12, a 1440x980: a coluna direita do
      Gabinete tem **18 classes de estilo em quatro blocos** e **TRES instrumentos para a mesma
      pergunta** — `gauge`, `meter` e `poles` respondem todos "onde este numero esta na regua
      dele?". A caixa resolve quinze especies de carta com TRES pecas. Tres desenhos para uma
      pergunta so significam que cada bloco foi desenhado sozinho — que e exatamente como os
      cinco formatos de anexo nasceram. Quem desenha regua e a PECA; a tela pede. */

import { collect, stripJsComments } from "../lib/project.mjs";

export const name = "annexes";

/* AS DUAS TELAS QUE FALAM A MESMA LINGUA, e a peca de onde ela sai. ⚠ A LISTA E DECLARADA e
   nao varrida: uma tela nova nao herda o vocabulario por acidente — ela entra aqui no dia em
   que alguem decidir que ela fala a mesma lingua. */
const INBOX = "src/ui/screens/inbox.mjs";
const CABINET = "src/ui/screens/cabinet.mjs";
const PIECE = "src/ui/shared/annex.mjs";
const SCREENS = [INBOX, CABINET];
const WATCHED = [...SCREENS, PIECE];

/* ⚠ `<table` PEGA A ABERTURA E A CLASSE JUNTO, e as celulas entram porque uma tabela montada
   por pedacos — `thead` numa funcao, `tbody` noutra — nao escreveria a abertura em lugar
   nenhum. Foi assim que a tabela do balanco e a das bancadas dividiram markup. */
const TABLE = /<(table|thead|tbody|tfoot|tr)\b|<t[dh]\b/g;

/* OS INSTRUMENTOS, PELO NOME. ⚠ `\b` E O QUE SALVA A REGRA: `meter__part` e `poles__mark` sao
   PARTES do instrumento, e acusa-las faria a guarda cobrar duas vezes a mesma linha. */
const RULER = /class="(gauge|meter|poles)\b/g;

/**
 * @param {string} code
 * @param {number} index
 * @returns {number}
 */
function lineAt(code, index) {
  return code.slice(0, index).split("\n").length;
}

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  /** @type {Map<string, string>} */
  const code = new Map();
  for (const path of WATCHED) {
    const source = files.get(path);
    /* A AUSENCIA NAO E VERDE: um arquivo renomeado sem atualizar a guarda a deixaria passando
       sem medir nada, que e o pior estado possivel para uma guarda. */
    if (source === undefined) {
      add(`${path} nao existe — a guarda da peca perdeu o que ela mede, e verde aqui e mentira`);
      continue;
    }
    code.set(path, stripJsComments(source));
  }

  for (const [path, source] of code) {
    for (const hit of source.matchAll(TABLE)) {
      add(
        `${path}:${lineAt(source, hit.index ?? 0)} monta \`${hit[0]}\` — aqui nao tem tabela. A ` +
          `peca de dado e \`lineHtml\` (nome · barra · valor), e quem lista linha por linha e a ` +
          `TELA do assunto`,
      );
    }
  }

  for (const path of SCREENS) {
    const source = code.get(path);
    if (source === undefined) continue;
    for (const hit of source.matchAll(RULER)) {
      add(
        `${path}:${lineAt(source, hit.index ?? 0)} desenha \`${hit[1]}\` — a tela nao desenha ` +
          `regua, ela pede. O instrumento e um so e mora em \`${PIECE}\``,
      );
    }
  }

  /* ⚠ E A PECA TEM DE DESENHAR ALGUMA: sem regua nenhuma la dentro, a regra de cima proibe
     sem oferecer, e o verde dela nao significaria nada. */
  const piece = code.get(PIECE);
  if (piece !== undefined && piece.match(RULER) === null) {
    add(`${PIECE} nao desenha regua nenhuma — a peca virou vazia, e a regra passa a medir nada`);
  }

  return list;
}

/** @param {Record<string, string>} over */
function sane(over) {
  return new Map([
    [INBOX, "const a = 1;"],
    [CABINET, "const b = 2;"],
    [PIECE, 'const bar = `<span class="gauge"></span>`;'],
    ...Object.entries(over),
  ]);
}

export const synthetic = [
  {
    label: "uma tabela nova na caixa",
    files: sane({ [INBOX]: 'const html = `<table class="annex__table"><tbody></tbody></table>`;' }),
  },
  {
    /* ⚠ A TABELA MONTADA POR PEDACOS E O CASO QUE IMPORTA: era assim que os cinco formatos
       conviviam, cada funcao escrevendo a propria parte, e nenhuma escrevendo a abertura. */
    label: "so a celula, sem a abertura",
    files: sane({ [INBOX]: 'const row = `<tr><th scope="row">${x}</th><td>${y}</td></tr>`;' }),
  },
  {
    label: "uma tabela no Gabinete",
    files: sane({ [CABINET]: "const html = `<table><tr><td>${x}</td></tr></table>`;" }),
  },
  {
    label: "o Gabinete desenha a propria regua",
    files: sane({ [CABINET]: 'const bar = `<div class="meter" role="img"></div>`;' }),
  },
  {
    label: "a peca para de desenhar regua, e a regra passa a medir nada",
    files: sane({ [PIECE]: "const nada = 1;" }),
  },
  {
    label: "a tela da correspondencia sumir sem a guarda saber",
    files: new Map([["src/ui/screens/outra.mjs", "const x = 1;"]]),
  },
];
