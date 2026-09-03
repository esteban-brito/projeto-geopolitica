/* GUARDA · PROSA — o comentario tem teto, e o teto e por BLOCO.

   Metade deste projeto ja foi comentario: 15.961 linhas de prosa contra 15.737 de
   codigo, com um arquivo a 85%. O custo nao e disco — e auditoria: quem procura uma
   regra rola por paragrafos de diario para achar tres linhas de CSS.

   ⚠ O TETO E POR BLOCO, E NAO POR ARQUIVO, e a primeira versao desta guarda media o
   percentual do arquivo. Ela punia o lugar errado: um utilitario pequeno e bem
   documentado — nove funcoes, uma linha de resumo cada — dava 38% sem uma linha de
   diario dentro dele, enquanto um arquivo grande escondia um ensaio de 24 linhas e
   passava. O que atrapalha quem le nao e a soma: e o bloco em que ele tropeca.

   ⚠ LINHA DE TIPO NAO CONTA. `@typedef`, `@param` e `@property` sao contrato, e puni-las
   empurraria o projeto para tipagem implicita — o oposto do que se quer.

   ── ELA TEM CINCO TRABALHOS ───────────────────────────────────────────────
   1. o TETO, acima;
   2. a DATA — o `CLAUDE.md` a proibe com todas as letras, e havia 56, 18 no entrypoint;
   3. o BLOCO CORTADO NO MEIO — um corte automatico de prosa ja passou por aqui;
   4. o IDENTIFICADOR MORTO — prosa que cita `--token`, `.classe` ou `arquivo.mjs` que o
      projeto nao tem mais;
   5. o BLOCO DECAPITADO — o mesmo corte comeu o INICIO de treze paragrafos, e a 3 so
      olhava o fim deles.

   ⚠ O QUARTO PEGA A FAMILIA MAIS CARA DAQUI, e so metade dela — ver `standards.md` §7.
   Prosa que continua valida e para de ser verdade: `trend.mjs` afirmou por sessoes que
   "a serie de indices por area nao existe no estado" enquanto ela existia e era
   preenchida todo turno, e duas telas liam a fonte errada por causa disso. */

import { collect, isGuardSource, stripCssComments, stripJsComments } from "../lib/project.mjs";

export const name = "prose";

/* Teto de um bloco no corpo do arquivo. Ver `CLAUDE.md`. */
const CAP = 10;

/* O cabecalho pode mais: ele carrega o proposito do arquivo inteiro. */
const HEAD_CAP = 14;

const TYPE = /@(ts-|type|param|returns?|typedef|property|satisfies|template|see|throws)/;

/* ⚠ O ENTRYPOINT ESTAVA DE FORA ate 23/08/2026, e ele e o maior arquivo do projeto:
   1.283 linhas, 45% de prosa, 12 blocos acima do teto e 18 datas. A guarda escopava
   por `src|styles|tools`, e `app.mjs` mora na raiz — a folha declarava cobertura que
   nao existia, que e o defeito que `standards.md` §7 nomeia. */
const SCOPE = /^(src|styles|tools)\/|^app\.mjs$/;

/* A DATA DE DIARIO, e ela nao colide com CITACAO DE FONTE. O catalogo cita
   procedencia o tempo todo — "Fonte: IBGE", "PLOA 2025", "LC 200/2023, art. 4o" —, e
   nenhuma dessas formas usa dia/mes/ano. Verificado nas 56 ocorrencias: todas eram
   diario ("SAIU em 22/08/2026", "por decisao dele"), nenhuma era fonte. */
const DIARY_DATE = /\b\d{2}\/\d{2}\/\d{4}\b/;

/* O ENTRYPOINT E O SINAL DE QUE O PROJETO INTEIRO ESTA NO MAPA — mesma condicao e
   mesma razao de `vocabulary`: a auditoria de identificador morto precisa do corpus
   completo, e sem a condicao as provas sinteticas das outras duas (que entregam um
   arquivo so) passariam a ser acusadas de citar coisa que nao existe. Uma prova que
   passa pela razao errada nao prova nada. */
const ENTRY = "app.mjs";

/* ⚠ A ASSINATURA DE UM BLOCO CORTADO NO MEIO, e ela e estreita de proposito: a ultima
   palavra e um CONECTIVO, que nenhuma frase inteira usa para terminar. Um corte automatico
   de prosa ja passou por aqui e deixou quatro blocos assim — "deslocaria o indice e",
   "o save so precisa da semente e da" —, e o registro da epoca os deu como falso positivo.
   Medido antes de escrever: com esta lista, ZERO falso positivo no projeto inteiro. Um
   casador mais largo (frase sem ponto final) acusava 25, dos quais 21 eram cabecalho de
   secao e contrato de tipo — e alarme que dispara sem defeito ensina a desligar o alarme. */
/* ⚠ A ASSINATURA DE UM BLOCO DECAPITADO, e ela e o espelho de `CUT`: a PRIMEIRA palavra
   comeca em minuscula, que nenhuma frase inteira faz. O mesmo corte automatico deixou NOVE
   assim — "de Selic custa cerca de R$ 40 bi ao ano" era o que restava de um paragrafo com
   ancora e conta. Medido antes de escrever: exigindo LETRA minuscula, zero falso positivo
   no projeto; com qualquer caractere, os `≈` do catalogo de partidos e o `⚅` do save
   acusavam onze. */
const HEADLESS = /^[a-zà-ÿ]/;

const CUT =
  /\b(?:e|de|em|que|com|para|ou|a|o|as|os|do|da|dos|das|no|na|nos|nas|pela|pelo|por|se|ao|aos|um|uma|nem|mas|como|entre|sem|sob|ate|apos|desde|onde|quando|porque|ja)\s*$/i;

/**
 * Os blocos de comentario de um arquivo, com a linha em que cada um abre.
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
      /* Bloco que abre e fecha na mesma linha nunca e um ensaio. */
      if (text.includes("*/")) continue;
      open = index;
      prose = TYPE.test(text) ? 0 : 1;
      typing = TYPE.test(text);
      continue;
    }

    if (open < 0) continue;

    /* ⚠ A CONTINUACAO DE UM TIPO TAMBEM E TIPO. Uma uniao longa quebra em tres linhas
       e so a primeira traz o `@` — contadas como prosa, elas acusavam a assinatura de
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
 * SO O QUE E COMENTARIO, linha a linha — o codigo vira espaco.
 *
 * ⚠ ELA EXISTE PARA A DATA NAO SER LIDA DE DENTRO DE UMA STRING. `stripJsComments`
 * apaga o comentario preservando a quebra de linha, entao onde ele deixou espaco e
 * onde havia prosa: o resto e codigo, e um literal com barra dentro nao vira acusacao.
 *
 * @param {string} source
 * @param {string} stripped o mesmo arquivo com o comentario apagado
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
 * O QUE O PROJETO DE FATO TEM, para a citacao ser conferida contra ele.
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
 * OS BLOCOS, montados das linhas vizinhas — um bloco e o que o olho le de uma vez.
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
    /* A cerca do bloco e o `*` de continuacao do JSDoc, e ela nao e prosa. */
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
 * ⚠ SO ENTRE CRASES, e o recorte e o que mantem a guarda quieta: este projeto cita
 * identificador em prosa com crase por convencao, e sem esse limite um `.` decimal ou
 * um `.map` de frase corrida viraria acusacao. Medido: 3 achados no projeto inteiro.
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

  /* ⚠ SO COM O PROJETO INTEIRO NO MAPA — ver `ENTRY`. */
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
    /* ⚠ ELA E MINIMA DE PROPOSITO: um bloco de uma linha, sem app.mjs no mapa. Assim
       so a auditoria da DATA pode acusa-la — o teto nao cabe num bloco de uma linha e a
       do identificador morto nem roda. Prova que passa pela razao errada nao prova nada. */
    label: "data de diario num comentario",
    files: new Map([["src/x.mjs", "/* o vocativo saiu em 22/08/2026 */\nconst a = 1;"]]),
  },
  {
    /* ⚠ ELA REINTRODUZ UM DEFEITO CONSUMADO, e nao inventado: e a frase exata que estava
       em `random.mjs` — o bloco parava em "deslocaria o indice e", e o registro da epoca
       contou os quatro cortes deste tipo como falso positivo. */
    label: "bloco que para no meio de uma frase",
    files: new Map([
      ["src/x.mjs", "/* um evento a mais num turno deslocaria o indice e */\nconst a = 1;"],
    ]),
  },
  {
    /* ⚠ ELA REINTRODUZ UM DEFEITO CONSUMADO, e nao inventado: e o que sobrou em
       `macro.mjs` depois de o corte comer o inicio do paragrafo do juro. */
    label: "bloco que comeca no meio de uma frase",
    files: new Map([["src/x.mjs", "/* de Selic custa cerca de R$ 40 bi ao ano. */\nconst a = 1;"]]),
  },
  {
    /* ⚠ E ESTA ENTREGA O ENTRYPOINT, sem o qual a quarta auditoria nem roda. O
       `app.mjs` daqui e limpo de proposito: se ele tambem fosse acusado, a prova ficaria
       verde sem provar que a guarda separa a citacao viva da morta. */
    label: "prosa citando um token que o projeto nao tem mais",
    files: new Map([
      ["app.mjs", "const pintar = () => 1;"],
      ["styles/x.css", "@layer components {\n  /* o rubor vinha de `--fantasma` */\n}"],
    ]),
  },
  {
    label: "prosa citando uma folha que morreu",
    files: new Map([
      ["app.mjs", "const pintar = () => 1;"],
      ["src/ui/x.mjs", "/* a fita vive em `ribbon.mjs` */\nexport const a = 1;"],
    ]),
  },
];
