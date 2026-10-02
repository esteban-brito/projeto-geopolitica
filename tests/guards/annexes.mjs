/* GUARDA · A PEÇA DE DADO — ela e UMA, na caixa e no Gabinete.

   ── POR QUE ELA NASCEU, E O NÚMERO E DELE ──────────────────────────────────
   Palavras do responsável: "todas essas tabelas me incomodam muito, nem queria que fossem
   tabelas". Medido no mesmo dia, abrindo TODA carta de um mandato de 14 meses num navegador:
   **19 de 23 cartas abertas traziam tabela**, com **306 células em tela por mês**, e a caixa
   tinha **CINCO formatos de anexo para quinze espécies** — um formato novo a cada três
   espécies.

   ── POR QUE UMA GUARDA, E NÃO UMA COMBINAÇÃO ───────────────────────────────
   ⚠ O JOGO VAI GANHAR MUITA CARTA NOVA, e essa e a pergunta que ele fez antes de autorizar:
   "da pra fazer mesmo assim?". Da — mas só se a regra for executável. Uma convenção escrita em
   prosa sobrevive três sessões; foi assim que os cinco formatos nasceram, um de cada vez, cada
   um razoável sozinho. Esta guarda faz o portão recusar o sexto no dia em que alguém o
   escrever, inclusive eu, daqui a vinte sessões, sem lembrar desta conversa.

   ── O QUE ELA MEDE ─────────────────────────────────────────────────────────
   Duas coisas, e a segunda entrou no ciclo 15.

   1. TABELA nas duas telas e na peça. ⚠ A TELA DO RELATÓRIO CONTINUA COM A DELA de propósito,
      e a distinção e a doutrina inteira: planilha mora em TELA, e a caixa e correspondência. O
      Gabinete já recusava listar bancada por bancada com essas palavras — "quem lista bancada
      por bancada, com nome e humor, e a tela do Congresso" — e era a CARTA que trazia as onze
      linhas;

   2. RÉGUA DESENHADA PELA TELA. Medido em 29/08/2026, mês 12, a 1440x980: a coluna direita do
      Gabinete tem **18 classes de estilo em quatro blocos** e **TRÊS instrumentos para a mesma
      pergunta** — `gauge`, `meter` e `poles` respondem todos "onde este número esta na régua
      dele?". A caixa resolve quinze espécies de carta com TRÊS peças. Três desenhos para uma
      pergunta só significam que cada bloco foi desenhado sozinho — que e exatamente como os
      cinco formatos de anexo nasceram. Quem desenha régua e a PEÇA; a tela pede. */

import { collect, stripJsComments } from "../lib/project.mjs";

export const name = "annexes";

/* AS DUAS TELAS QUE FALAM A MESMA LÍNGUA, e a peça de onde ela sai. ⚠ A LISTA E DECLARADA e
   não varrida: uma tela nova não herda o vocabulário por acidente — ela entra aqui no dia em
   que alguém decidir que ela fala a mesma língua. */
const INBOX = "src/ui/screens/inbox.mjs";
const CABINET = "src/ui/screens/cabinet.mjs";
const PIECE = "src/ui/components/annex.mjs";
const SCREENS = [INBOX, CABINET];
const WATCHED = [...SCREENS, PIECE];

/* ⚠ `<table` PEGA A ABERTURA E A CLASSE JUNTO, e as células entram porque uma tabela montada
   por pedaços — `thead` numa função, `tbody` noutra — não escreveria a abertura em lugar
   nenhum. Foi assim que a tabela do balanço e a das bancadas dividiram markup. */
const TABLE = /<(table|thead|tbody|tfoot|tr)\b|<t[dh]\b/g;

/* OS INSTRUMENTOS, PELO NOME. ⚠ `\b` E O QUE SALVA A REGRA: `meter__part` e `poles__mark` são
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
    /* A AUSÊNCIA NÃO E VERDE: um arquivo renomeado sem atualizar a guarda a deixaria passando
       sem medir nada, que e o pior estado possível para uma guarda. */
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

  /* ⚠ E A PEÇA TEM DE DESENHAR ALGUMA: sem régua nenhuma la dentro, a regra de cima proíbe
     sem oferecer, e o verde dela não significaria nada. */
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
    /* ⚠ A TABELA MONTADA POR PEDAÇOS E O CASO QUE IMPORTA: era assim que os cinco formatos
       conviviam, cada função escrevendo a própria parte, e nenhuma escrevendo a abertura. */
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
