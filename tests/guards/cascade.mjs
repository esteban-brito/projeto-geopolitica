/* GUARDA · CASCATA — a precedência é declarada, nunca emergente. */

import { collect, stripCssComments } from "../lib/project.mjs";

export const name = "cascade";

const LAYER_ORDER = ["tokens", "base", "material", "components", "screens", "motion"];

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  /* 1 — A DECLARAÇÃO DE ORDEM VIVE NO PRIMEIRO ARQUIVO CARREGADO. */
  const html = files.get("index.html") ?? "";
  const links = [...html.matchAll(/<link[^>]+href="(styles\/[^"]+)"/g)].map(m => m[1] ?? "");

  if (links.length === 0) add("index.html nao carrega nenhuma folha de estilo");
  if (links[0] !== "styles/00-tokens.css") {
    add(
      `o primeiro <link> e ${links[0]} — a ordem das camadas e fixada pela primeira mencao, ` +
        `entao a declaracao @layer precisa chegar antes de qualquer outra folha`,
    );
  }

  const sorted = [...links].sort((a, b) => a.localeCompare(b));
  if (links.join("|") !== sorted.join("|")) {
    add(`os <link> estao fora da ordem numerica: ${links.join(", ")}`);
  }

  const tokens = stripCssComments(files.get("styles/00-tokens.css") ?? "");
  const declaration = tokens.match(/@layer\s+([^;{]+);/);
  if (!declaration) {
    add("styles/00-tokens.css nao declara a ordem das camadas");
  } else {
    const declared = (declaration[1] ?? "").split(",").map(s => s.trim());
    if (declared.join(",") !== LAYER_ORDER.join(",")) {
      add(
        `a ordem declarada e "${declared.join(", ")}" e a esperada e "${LAYER_ORDER.join(", ")}"`,
      );
    }
    if (declared.at(-1) !== "motion") {
      add("a camada de movimento tem de ser a ULTIMA, senao a rede perde para as outras");
    }
  }

  /* 2 — NENHUMA REGRA FORA DE CAMADA, E NENHUM `!important` DENTRO DELAS. */
  for (const [path, raw] of files) {
    if (!path.startsWith("styles/")) continue;
    const css = stripCssComments(raw);

    const loose = outsideLayers(css);
    if (loose) {
      add(
        `${path} tem CSS fora de @layer ("${loose.slice(0, 60).trim()}…") — ` +
          `regra sem camada vence TODA regra com camada`,
      );
    }

    if (/!important/.test(css)) {
      add(
        `${path} usa !important — com @layer, declaracoes importantes tem a ordem das ` +
          `camadas INVERTIDA, entao ele enfraquece a regra em vez de reforca-la`,
      );
    }

    /* 3 — A MESMA PROPRIEDADE DUAS VEZES NO MESMO SELETOR E NO MESMO CONTEXTO. */
    /** @type {Map<string, Map<string, number>>} */
    const written = new Map();
    for (const { key, props, line } of rules(css)) {
      const before = written.get(key) ?? new Map();
      for (const prop of props) {
        const first = before.get(prop);
        if (first !== undefined && first !== line) {
          add(
            `${path}:${first} e :${line} declaram \`${prop}\` no mesmo seletor e no mesmo ` +
              `contexto — a ultima vence, e a outra e letra morta. Nao ha erro, nao ha ` +
              `aviso, e a decisao que perdeu continua escrita como se valesse`,
          );
        }
        before.set(prop, first ?? line);
      }
      written.set(key, before);
    }
  }

  return list;
}

/**
 * Devolve o primeiro trecho de CSS que não está dentro de `@layer` nem de
 *
 * `@property`, ou `null` se tudo estiver coberto.
 * @param {string} css
 * @returns {string | null}
 */
function outsideLayers(css) {
  let i = 0;
  while (i < css.length) {
    const rest = css.slice(i);
    const blank = rest.match(/^\s+/);
    if (blank) {
      i += blank[0].length;
      continue;
    }
    /* declaração de ordem: `@layer a, b, c;` */
    const order = rest.match(/^@layer\s+[^;{]+;/);
    if (order) {
      i += order[0].length;
      continue;
    }
    const block = rest.match(/^@(layer|property)\s+[^{]*\{/);
    if (block) {
      const end = matchBrace(css, i + block[0].length - 1);
      if (end === -1) return rest.slice(0, 80);
      i = end + 1;
      continue;
    }
    return rest.slice(0, 80);
  }
  return null;
}

/* O defeito não está em nenhuma das duas regras — está no PAR, e só quem lê as duas juntas o
   vê. */

/**
 * OS BLOCOS DE REGRA, com contexto, seletor, propriedades e linha.
 *
 * @param {string} css já sem comentários
 * @returns {Array<{ key: string, props: string[], line: number }>}
 */
function rules(css) {
  /** @type {Array<{ key: string, props: string[], line: number }>} */
  const out = [];
  /** @type {string[]} */
  const stack = [];
  let line = 1;
  let i = 0;

  while (i < css.length) {
    const ch = css[i];
    if (ch === "\n") line++;

    if (ch === "{") {
      let start = i - 1;
      while (start >= 0 && !"{};".includes(css[start] ?? "")) start--;
      const selector = css
        .slice(start + 1, i)
        .trim()
        .replace(/\s+/g, " ");

      if (selector.startsWith("@")) {
        /* ⚠ `@media` e `@layer` ENTRAM NA CHAVE, e não são ignorados: a mesma regra dentro e
           fora de uma media query é o padrão normal de sobreposição, e acusar isso faria a
           guarda brigar com a forma como todo CSS responsivo se escreve. */
        stack.push(selector);
        i++;
        continue;
      }

      const end = matchBrace(css, i);
      if (end === -1) break;
      const body = css.slice(i + 1, end);
      /* só as declarações DESTE bloco: um `{` dentro seria regra aninhada, e o projeto não
         usa aninhamento — mas cortar no primeiro `{` mantém a leitura honesta. */
      const flat = body.split("{")[0] ?? "";
      const props = [...flat.matchAll(/(^|;)\s*(-{0,2}[a-zA-Z][\w-]*)\s*:/g)].map(m =>
        (m[2] ?? "").toLowerCase(),
      );
      out.push({ key: `${stack.join(" › ")}|${selector}`, props, line });

      for (let k = i; k <= end; k++) if (css[k] === "\n") line++;
      i = end + 1;
      continue;
    }

    if (ch === "}") stack.pop();
    i++;
  }

  return out;
}

/**
 * @param {string} text
 * @param {number} open índice da `{` de abertura
 * @returns {number}
 */
function matchBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return i;
  }
  return -1;
}

export const synthetic = [
  {
    /* ⚠ ESTA É A DE, e ela reintroduz o defeito EXATO que a criou: o corpo do ofício subia um
       degrau e uma segunda declaração, dez linhas abaixo, o devolvia. */
    label: "a mesma propriedade declarada duas vezes no mesmo seletor",
    files: new Map([
      ["index.html", '<link href="styles/00-tokens.css">'],
      [
        "styles/00-tokens.css",
        `@layer ${LAYER_ORDER.join(", ")};\n@layer screens{\n` +
          `.letter__lines{font-size:var(--text-verdict)}\n` +
          `.letter__subject{font-size:var(--text-name)}\n` +
          `.letter__lines{font-size:var(--text-body)}\n}`,
      ],
    ]),
  },
  {
    /* ⚠ E ESTA COBRA O CONTRÁRIO, e sem ela o conserto óbvio da acusação falsa seria afrouxar
       a guarda: o mesmo seletor escrito duas vezes com propriedades DIFERENTES é autoria
       legítima, e este projeto a usa de propósito — a regra do `position: relative` mora ao
       lado do ponto de não lido porque ela existe para ele. */
    label: "regra fora de qualquer camada",
    files: new Map([
      ["index.html", '<link href="styles/00-tokens.css">'],
      ["styles/00-tokens.css", `@layer ${LAYER_ORDER.join(", ")};\n.solta{color:red}`],
    ]),
  },
  {
    label: "!important dentro de uma camada",
    files: new Map([
      ["index.html", '<link href="styles/00-tokens.css">'],
      [
        "styles/00-tokens.css",
        `@layer ${LAYER_ORDER.join(", ")};\n@layer tokens{:root{--a:1px !important}}`,
      ],
    ]),
  },
  {
    label: "os estilos carregam fora de ordem",
    files: new Map([
      ["index.html", '<link href="styles/10-base.css"><link href="styles/00-tokens.css">'],
      ["styles/00-tokens.css", `@layer ${LAYER_ORDER.join(", ")};`],
    ]),
  },
  {
    label: "a camada de movimento deixou de ser a ultima",
    files: new Map([
      ["index.html", '<link href="styles/00-tokens.css">'],
      ["styles/00-tokens.css", "@layer tokens, motion, screens;"],
    ]),
  },
];
