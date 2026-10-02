/* GUARDA · PROSA — o comentário tem teto, e o teto é por BLOCO.

   Metade deste projeto já foi comentário: 15.961 linhas de prosa contra 15.737 de
   código, com um arquivo a 85%. O custo não é disco — é auditoria: quem procura uma
   regra rola por parágrafos de diário para achar três linhas de CSS.

   ⚠ O TETO É POR BLOCO, E NÃO POR ARQUIVO, e a primeira versão desta guarda media o
   percentual do arquivo. Ela punia o lugar errado: um utilitário pequeno e bem
   documentado — nove funções, uma linha de resumo cada — dava 38% sem uma linha de
   diário dentro dele, enquanto um arquivo grande escondia um ensaio de 24 linhas e
   passava. O que atrapalha quem lê não é a soma: é o bloco em que ele tropeça.

   ⚠ LINHA DE TIPO NÃO CONTA. `@typedef`, `@param` e `@property` são contrato, e puni-las
   empurraria o projeto para tipagem implícita — o oposto do que se quer.

   ── ELA TEM SEIS TRABALHOS ────────────────────────────────────────────────
   1. o TETO, acima;
   2. a DATA — o `CLAUDE.md` a proíbe com todas as letras, e havia 56, 18 no entrypoint;
   3. o BLOCO CORTADO NO MEIO — um corte automático de prosa já passou por aqui;
   4. o IDENTIFICADOR MORTO — prosa que cita `--token`, `.classe` ou `arquivo.mjs` que o
      projeto não tem mais;
   5. o BLOCO DECAPITADO — o mesmo corte comeu o INÍCIO de treze parágrafos, e a 3 só
      olhava o fim deles;
   6. o CORTE NO MIOLO — e ele é a metade que faltava das duas acima.

   ⚠ AS REGRAS 3 E 5 SÓ OLHAM AS DUAS PONTAS DE UM BLOCO, e é por isso que a sexta
   existe: `blocksFrom` cola as linhas vizinhas num texto só, então `CUT` mede a ÚLTIMA
   linha e `HEADLESS` a PRIMEIRA. Remover um parágrafo do MEIO de um bloco longo não
   move nenhuma das duas — e é exatamente isso que o corte automático fez em
   `state.mjs`, onde um parágrafo parou em "porque tudo" com as duas pontas intactas.

   ⚠ O QUARTO PEGA A FAMÍLIA MAIS CARA DAQUI, e só metade dela — ver `standards.md` §7.
   Prosa que continua válida e para de ser verdade: `trend.mjs` afirmou por sessões que
   "a série de índices por área não existe no estado" enquanto ela existia e era
   preenchida todo turno, e duas telas liam a fonte errada por causa disso. */

import { collect, isGuardSource, stripCssComments, stripJsComments } from "../lib/project.mjs";

export const name = "prose";

/* Teto de um bloco no corpo do arquivo. Ver `CLAUDE.md`. */
const CAP = 10;

/* O cabeçalho pode mais: ele carrega o propósito do arquivo inteiro. */
const HEAD_CAP = 14;

const TYPE = /@(ts-|type|param|returns?|typedef|property|satisfies|template|see|throws)/;

/* ⚠ O ENTRYPOINT ESTAVA DE FORA até 23/08/2026, e ele é o maior arquivo do projeto:
   1.283 linhas, 45% de prosa, 12 blocos acima do teto e 18 datas. A guarda escopava
   por `src|styles|tools`, e `src/main.mjs` mora na raiz — a folha declarava cobertura que
   não existia, que é o defeito que `standards.md` §7 nomeia. */
const SCOPE = /^(src|styles|tools)\/|^app\.mjs$/;

/* A DATA DE DIÁRIO, e ela não colide com CITAÇÃO DE FONTE. O catálogo cita
   procedência o tempo todo — "Fonte: IBGE", "PLOA 2025", "LC 200/2023, art. 4o" —, e
   nenhuma dessas formas usa dia/mês/ano. Verificado nas 56 ocorrências: todas eram
   diário ("SAIU em 22/08/2026", "por decisão dele"), nenhuma era fonte. */
const DIARY_DATE = /\b\d{2}\/\d{2}\/\d{4}\b/;

/* O ENTRYPOINT É O SINAL DE QUE O PROJETO INTEIRO ESTÁ NO MAPA — mesma condição e
   mesma razão de `vocabulary`: a auditoria de identificador morto precisa do corpus
   completo, e sem a condição as provas sintéticas das outras duas (que entregam um
   arquivo só) passariam a ser acusadas de citar coisa que não existe. Uma prova que
   passa pela razão errada não prova nada. */
const ENTRY = "src/main.mjs";

/* ⚠ A ASSINATURA DE UM BLOCO CORTADO NO MEIO, e ela é estreita de propósito: a última
   palavra é um CONECTIVO, que nenhuma frase inteira usa para terminar. Um corte automático
   de prosa já passou por aqui e deixou quatro blocos assim — "deslocaria o índice e",
   "o save só precisa da semente e da" —, e o registro da época os deu como falso positivo.
   Medido antes de escrever: com esta lista, ZERO falso positivo no projeto inteiro. Um
   casador mais largo (frase sem ponto final) acusava 25, dos quais 21 eram cabeçalho de
   seção e contrato de tipo — e alarme que dispara sem defeito ensina a desligar o alarme. */
/* ⚠ A ASSINATURA DE UM BLOCO DECAPITADO, e ela é o espelho de `CUT`: a PRIMEIRA palavra
   começa em minúscula, que nenhuma frase inteira faz. O mesmo corte automático deixou NOVE
   assim — "de Selic custa cerca de R$ 40 bi ao ano" era o que restava de um parágrafo com
   âncora e conta. Medido antes de escrever: exigindo LETRA minúscula, zero falso positivo
   no projeto; com qualquer caractere, os `≈` do catálogo de partidos e o `⚅` do save
   acusavam onze. */
const HEADLESS = /^[a-zà-ÿ]/;

const CUT =
  /(?<![\p{L}\p{N}_])(?:e|de|em|que|com|para|ou|a|à|o|as|às|os|do|da|dos|das|no|na|nos|nas|pela|pelo|por|se|ao|aos|um|uma|nem|mas|como|entre|sem|sob|ate|até|apos|após|desde|onde|quando|porque|ja|já)\s*$/iu;

/**
 * Os blocos de comentário de um arquivo, com a linha em que cada um abre.
 *
 * @param {string} source
 * @returns {{ line: number, prose: number }[]}
 */
export function blocksOf(source) {
  const lines = source.split("\n");
  /** @type {{ line: number, prose: number }[]} */
  const found = [];

  let open = -1;
  let prose = 0;
  let typing = false;

  for (const [index, raw] of lines.entries()) {
    const text = raw.trim();

    if (open < 0 && text.startsWith("/*")) {
      /* Bloco que abre e fecha na mesma linha nunca é um ensaio. */
      if (text.includes("*/")) continue;
      open = index;
      prose = TYPE.test(text) ? 0 : 1;
      typing = TYPE.test(text);
      continue;
    }

    if (open < 0) continue;

    /* ⚠ A CONTINUAÇÃO DE UM TIPO TAMBÉM É TIPO. Uma união longa quebra em três linhas
       e só a primeira traz o `@` — contadas como prosa, elas acusavam a assinatura de
       `cabinetHtml` de ser um ensaio de 18 linhas. */
    const body = text.replace(/^\*\s?/, "");
    const continua = typing && (body === "" || /^[|}[(]/.test(body) || /^[a-z]/.test(body));

    if (TYPE.test(text)) typing = true;
    else if (!continua) typing = false;

    if (!TYPE.test(text) && !continua) prose++;

    if (text.includes("*/")) {
      found.push({ line: open + 1, prose });
      open = -1;
      typing = false;
    }
  }

  return found;
}

/**
 * SÓ O QUE É COMENTÁRIO, linha a linha — o código vira espaço.
 *
 * ⚠ ELA EXISTE PARA A DATA NÃO SER LIDA DE DENTRO DE UMA STRING. `stripJsComments`
 * apaga o comentário preservando a quebra de linha, então onde ele deixou espaço é
 * onde havia prosa: o resto é código, e um literal com barra dentro não vira acusação.
 *
 * @param {string} source
 * @param {string} stripped o mesmo arquivo com o comentário apagado
 * @returns {{ line: number, text: string }[]}
 */
function commentsOf(source, stripped) {
  const raw = source.split("\n");
  const bare = stripped.split("\n");
  /** @type {{ line: number, text: string }[]} */
  const out = [];

  for (const [index, line] of raw.entries()) {
    const clean = bare[index] ?? "";
    let text = "";
    for (let at = 0; at < line.length; at++) text += clean[at] === " " ? line[at] : " ";
    if (text.trim()) out.push({ line: index + 1, text });
  }

  return out;
}

/**
 * O QUE O PROJETO DE FATO TEM, para a citação ser conferida contra ele.
 *
 * @param {Map<string, string>} files
 * @returns {string}
 */
function livingCode(files) {
  let code = "";
  for (const [path, raw] of files) {
    if (isGuardSource(path) || path.startsWith("tests/") || path.startsWith("docs/")) continue;
    if (path.endsWith(".css")) code += stripCssComments(raw);
    else if (path.endsWith(".mjs")) code += stripJsComments(raw);
    else if (path.endsWith(".html")) code += raw;
  }
  return code;
}

/**
 * OS BLOCOS, montados das linhas vizinhas — um bloco é o que o olho lê de uma vez.
 *
 * @param {{ line: number, text: string }[]} comments
 * @returns {{ line: number, text: string }[]}
 */
function blocksFrom(comments) {
  /** @type {{ line: number, text: string }[]} */
  const out = [];
  /** @type {{ line: number, fim: number, text: string } | null} */
  let atual = null;

  for (const comment of comments) {
    /* A cerca do bloco é o `*` de continuação do JSDoc, e ela não é prosa. */
    const limpo = comment.text
      .replace(/^\s*\/\*+/, "")
      .replace(/\*+\/\s*$/, "")
      .replace(/^\s*\*\s?/, "")
      .trim();

    if (atual && comment.line === atual.fim + 1) {
      atual.text = `${atual.text} ${limpo}`.trim();
      atual.fim = comment.line;
      continue;
    }
    if (atual) out.push({ line: atual.line, text: atual.text });
    atual = { line: comment.line, fim: comment.line, text: limpo };
  }
  if (atual) out.push({ line: atual.line, text: atual.text });

  return out;
}

/**
 * ⚠ SÓ ENTRE CRASES, e o recorte é o que mantém a guarda quieta: este projeto cita
 * identificador em prosa com crase por convenção, e sem esse limite um `.` decimal ou
 * um `.map` de frase corrida viraria acusação. Medido: 3 achados no projeto inteiro.
 *
 * @param {string} text
 * @returns {{ kind: string, cited: string }[]}
 */
function citations(text) {
  /** @type {{ kind: string, cited: string }[]} */
  const out = [];
  for (const hit of text.matchAll(/`([^`]{2,60})`/g)) {
    const cited = (hit[1] ?? "").trim();
    if (/^--[a-z0-9-]+$/.test(cited)) out.push({ kind: "token", cited });
    else if (/^\.[a-z][a-z0-9]*(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?$/.test(cited)) {
      out.push({ kind: "classe", cited });
    } else if (/^[a-z0-9-]+(?:\/[a-z0-9-]+)*\.(?:mjs|css)$/.test(cited)) {
      out.push({ kind: "arquivo", cited });
    }
  }
  return out;
}

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  /* ⚠ SÓ COM O PROJETO INTEIRO NO MAPA — ver `ENTRY`. */
  const whole = files.has(ENTRY);
  const code = whole ? livingCode(files) : "";
  const paths = [...files.keys()];

  for (const [path, source] of files) {
    if (!SCOPE.test(path)) continue;
    if (!path.endsWith(".mjs") && !path.endsWith(".css")) continue;

    /* 1 — O TETO. */
    for (const [index, block] of blocksOf(source).entries()) {
      const cap = index === 0 ? HEAD_CAP : CAP;
      if (block.prose <= cap) continue;
      add(
        `${path}:${block.line} tem um bloco de ${block.prose} linhas, e o teto e ${cap} — ` +
          `guarde a licao medida (a alternativa testada, com o numero que a reprovou) ` +
          `e corte o diario: data, citacao e historico moram no handoff e no git`,
      );
    }

    const stripped = path.endsWith(".css") ? stripCssComments(source) : stripJsComments(source);
    const comments = commentsOf(source, stripped);

    /* 2 — A DATA. */
    for (const comment of comments) {
      const found = comment.text.match(DIARY_DATE);
      if (!found) continue;
      add(
        `${path}:${comment.line} tem a data ${found[0]} num comentario — ` +
          `o comentario guarda a LICAO, e a data e diario. Ela mora no handoff e no ` +
          `git log, que sabem responder "quando" sem gastar uma linha do arquivo`,
      );
    }

    /* 3 — O BLOCO CORTADO NO MEIO, e 5 — O BLOCO DECAPITADO. Ver `CUT` e `HEADLESS`. */
    for (const block of blocksFrom(comments)) {
      if (CUT.test(block.text)) {
        add(
          `${path}:${block.line} tem um bloco que para no meio de uma frase — ` +
            `"…${block.text.slice(-56)}". Um corte automatico de prosa ja fez isso aqui e o ` +
            `registro da epoca deu como falso positivo: complete a frase do original`,
        );
      }
      if (HEADLESS.test(block.text)) {
        add(
          `${path}:${block.line} tem um bloco que comeca no meio de uma frase — ` +
            `"${block.text.slice(0, 56)}…". O mesmo corte automatico comeu o inicio de nove ` +
            `paragrafos: devolva a frase do original, que o git guarda`,
        );
      }
    }

    /* ── 6 — O CORTE NO MIOLO, e ele tem duas metades ───────────────────────
       A primeira é mecânica: um `/*` que abre DENTRO de outro bloco quer dizer que o de
       cima nunca fechou, e os dois viram um comentário só. Nada falha — o verificador de
       tipos lê os `@typedef` do bloco fundido —, e por isso ele atravessa o portão.
       A segunda é a frase que para no meio: `CUT` já sabe reconhecê-la, e só não a via
       porque a regra 3 mede a ÚLTIMA linha do bloco colado. */
    let openedAt = 0;
    for (const comment of comments) {
      const text = comment.text.trim();
      if (openedAt === 0) {
        if (text.startsWith("/*") && !text.includes("*/")) openedAt = comment.line;
        continue;
      }
      if (text.startsWith("/*")) {
        add(
          `${path}:${comment.line} abre um bloco dentro do que comecou em ${openedAt} — ` +
            `o de cima nunca fechou, e os dois viraram um comentario so. Feche o primeiro`,
        );
        openedAt = comment.line;
      }
      if (text.includes("*/")) openedAt = 0;
    }

    /* A CERCA DO JSDOC SAI PARA A FRASE APARECER: sem tirar o `*` de continuação, toda
       linha começaria pelo mesmo caractere e `CUT` mediria a cerca. */
    const bodies = comments.map(comment => ({
      line: comment.line,
      body: comment.text
        .trim()
        .replace(/^\/\*+/, "")
        .replace(/\*+\/$/, "")
        .replace(/^\*\s?/, "")
        .trim(),
    }));

    for (const [index, item] of bodies.entries()) {
      const next = bodies[index + 1];
      if (!next || next.line !== item.line + 1) continue;
      /* ⚠ SÓ ONDE A PROSA ENCOSTA NUM TIPO: é ali que o parágrafo removido deixa a frase
         pendurada, e é o único recorte em que `CUT` não acusa quebra legítima de `@param`. */
      if (item.body === "" || TYPE.test(item.body) || !TYPE.test(next.body)) continue;
      if (!CUT.test(item.body)) continue;
      add(
        `${path}:${item.line} tem uma frase que para no meio do bloco — ` +
          `"…${item.body.slice(-56)}". As regras 3 e 5 medem as PONTAS do bloco colado, ` +
          `entao um paragrafo removido do miolo passa: complete a frase do original`,
      );
    }

    /* 4 — O IDENTIFICADOR MORTO. */
    if (!whole || isGuardSource(path)) continue;
    for (const comment of comments) {
      for (const { kind, cited } of citations(comment.text)) {
        const alive =
          kind === "arquivo"
            ? paths.some(other => other.endsWith(cited))
            : code.includes(kind === "token" ? cited : cited.slice(1));
        if (alive) continue;
        add(
          `${path}:${comment.line} cita o ${kind} ${cited}, que o projeto nao tem mais — ` +
            `prosa que sobrevive a peca que ela descreve e o que faz a proxima sessao ` +
            `acreditar que a peca existe. Corte a frase, e nao ressuscite a peca`,
        );
      }
    }
  }

  return list;
}

const CODE = new Array(30).fill("const a = 1;").join("\n");
const HEAD = ["/* cabecalho", "   curto */", "const z = 0;", ""].join("\n");
const ENSAIO = new Array(20).fill("   historia").join("\n");

export const synthetic = [
  {
    label: "ensaio no corpo do arquivo",
    files: new Map([["src/x.mjs", `${HEAD}/*\n${ENSAIO}\n*/\n${CODE}`]]),
  },
  {
    label: "ensaio em folha de estilo",
    files: new Map([["styles/x.css", `${HEAD}/*\n${ENSAIO}\n*/\n.a {\n  color: red;\n}\n`]]),
  },
  {
    label: "cabecalho tambem tem teto",
    files: new Map([["src/x.mjs", `/*\n${ENSAIO}\n*/\n${CODE}`]]),
  },
  {
    /* ⚠ ELA É MÍNIMA DE PROPÓSITO: um bloco de uma linha, sem src/main.mjs no mapa. Assim
       só a auditoria da DATA pode acusá-la — o teto não cabe num bloco de uma linha e a
       do identificador morto nem roda. Prova que passa pela razão errada não prova nada. */
    label: "data de diario num comentario",
    files: new Map([["src/x.mjs", "/* o vocativo saiu em 22/08/2026 */\nconst a = 1;"]]),
  },
  {
    /* ⚠ ELA REINTRODUZ UM DEFEITO CONSUMADO, e não inventado: é a frase exata que estava
       em `random.mjs` — o bloco parava em "deslocaria o índice e", e o registro da época
       contou os quatro cortes deste tipo como falso positivo. */
    label: "bloco que para no meio de uma frase",
    files: new Map([
      ["src/x.mjs", "/* um evento a mais num turno deslocaria o indice e */\nconst a = 1;"],
    ]),
  },
  {
    /* ⚠ ELA REINTRODUZ UM DEFEITO CONSUMADO, e não inventado: é o que sobrou em
       `macro.mjs` depois de o corte comer o início do parágrafo do juro. */
    label: "bloco que comeca no meio de uma frase",
    files: new Map([["src/x.mjs", "/* de Selic custa cerca de R$ 40 bi ao ano. */\nconst a = 1;"]]),
  },
  {
    /* ⚠ ELA REINTRODUZ UM DEFEITO CONSUMADO: o bloco que declarava as séries em `state.mjs`
       nunca fechava, e o `/*` seguinte abria dentro dele. As duas pontas ficam intactas,
       então as regras 3 e 5 passam — e o verificador de tipos também, porque ele lê os
       `@typedef` do bloco fundido. O texto é maiúsculo de propósito: em minúscula a regra 5
       o acusaria, e prova que passa pela razão errada não prova nada. */
    label: "bloco que abre dentro de outro que nunca fechou",
    files: new Map([["src/x.mjs", "/**\n * O pais\n/**\n * O mes\n */\nconst a = 1;"]]),
  },
  {
    /* ⚠ E ESTA É O CORTE NO MIOLO: a frase para num conectivo e a linha seguinte é CONTRATO,
       que é onde o parágrafo removido deixa a ponta pendurada. A regra 3 mede a ÚLTIMA linha
       do bloco colado — aqui um `@param` —, então ela não vê. */
    label: "frase que para no meio do bloco, encostada num tipo",
    files: new Map([
      ["src/x.mjs", "/**\n * A conta nasce de dois motores e\n * @param {number} x\n */\nlet a;"],
    ]),
  },
  {
    label: "frase cortada numa preposição acentuada, encostada num tipo",
    files: new Map([["src/x.mjs", "/**\n * A conta vale até\n * @param {number} x\n */\nlet a;"]]),
  },
  {
    /* ⚠ E ESTA ENTREGA O ENTRYPOINT, sem o qual a quarta auditoria nem roda. O
       `src/main.mjs` daqui é limpo de propósito: se ele também fosse acusado, a prova ficaria
       verde sem provar que a guarda separa a citação viva da morta. */
    label: "prosa citando um token que o projeto nao tem mais",
    files: new Map([
      ["src/main.mjs", "const pintar = () => 1;"],
      ["styles/x.css", "@layer components {\n  /* o rubor vinha de `--fantasma` */\n}"],
    ]),
  },
  {
    label: "prosa citando uma folha que morreu",
    files: new Map([
      ["src/main.mjs", "const pintar = () => 1;"],
      ["src/ui/x.mjs", "/* a fita vive em `ribbon.mjs` */\nexport const a = 1;"],
    ]),
  },
];
