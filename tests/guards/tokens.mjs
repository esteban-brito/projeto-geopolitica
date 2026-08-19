/* GUARDA · TOKENS — nenhum valor visual vive fora do arquivo de tokens.
   ══════════════════════════════════════════════════════════════════════════════

   O QUE ELA IMPEDE, e cada item veio de um defeito real medido no projeto
   anterior:

     1. LITERAL DE COR solto. La eram 225 hex e 178 `rgba()` crus disputando o
        mesmo papel contra ~40 tokens — e o problema nao era ruido, era cores
        CONCORRENTES para a mesma funcao;
     2. `color-mix()` para translucidez. Ele e igual a `rgba()` na algebra e
        DIFERENTE na tela: 21 de 21 capturas deslocadas em 1/255;
     3. par hex/rgb divergente. Cada cor existe em dois formatos, e nada garante
        que continuem descrevendo a mesma cor depois de um ajuste;
     4. `var(--x)` apontando para token INEXISTENTE. Isto invalida a declaracao
        inteira no tempo de valor computado, em silencio — la um divisor
        anunciado como essencial nao existia havia uma semana;
     5. token ORFAO. Valor morto atravessa meses sem ninguem notar, e o pior
        caso e o token citado em comentario como se estivesse aplicado;
     6. seletor no arquivo de tokens. Ele declara valor, nao aparencia.

   EXCECAO DECLARADA: `rgba(255,255,255,a)` e `rgba(0,0,0,a)` sao permitidos fora
   do arquivo de tokens. Branco e preto puros nao sao cores da paleta — sao LUZ e
   SOMBRA do material (bisel, especular, sombra de contato). Toka-los como cor
   criaria dezenas de tokens sem identidade, e e por isso que a excecao e uma
   linha nesta guarda, e nao um buraco. */

import { collect, isGuardSource, stripCssComments, stripJsComments } from "../lib/project.mjs";

export const name = "tokens";

const TOKENS_FILE = "styles/00-tokens.css";

/* Injetados em runtime por JavaScript ou pelo proprio navegador: nao terem
   declaracao no arquivo de tokens e correto, e acusa-los seria falso positivo.

   ⚠ ESTA LISTA E UM BURACO NA GUARDA, e por isso cada entrada precisa de razao.
   Um token daqui deixa de ser conferido: se ninguem o injetar, a declaracao que
   o consome fica invalida em silencio — exatamente o defeito que o item 4 desta
   guarda existe para pegar. Entra aqui so o que e DADO, e nao valor visual:

     --part-color  a cor de um segmento do medidor, declarada na regra do
                   proprio segmento em `30-components.css`;
     --neutral     o ponto neutro do indice de area, que vem do CATALOGO e nao
                   da paleta — 50 e regra de jogo, e duplica-lo no arquivo de
                   tokens criaria um segundo lugar para ele divergir;
     --index       o indice corrente de uma area, escrito em estilo inline pela
                   propria faixa de medidores: e um numero por elemento, e nao
                   um valor do sistema;
     --floor       onde a lei daquela alavanca comeca, e
     --ceiling     onde ela acaba. Os dois sao a FAIXA VIGENTE, escrita em estilo
                   inline pelo proprio controle: sao dois numeros por elemento e
                   vem do motor de normas, nao da paleta. Eles desenham as tres
                   zonas do trilho — abaixo do piso custa lei, dentro e caneta,
                   acima do teto custa de novo;
     --mark        onde fica o LIMIAR de uma ruptura, escrito em estilo inline pela
                   propria regua da Trindade. Ele e irmao de `--floor` e entra pela
                   mesma razao: e um numero por elemento, vem da CALDEIRA — 20 para a
                   rua, 50 para o capital, 80 para quem sustenta — e nao da paleta.
                   ⚠ Ele nasceu consertando um medidor que MENTIA: sem a marca, a
                   tela precisava normalizar "quanto falta para romper", e com a rua
                   em 44 e o piso em 20 a barra aparecia 70% cheia num governo
                   confortavel. */
const RUNTIME = new Set(["--part-color", "--neutral", "--index", "--floor", "--ceiling", "--mark"]);

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  const tokensCss = stripCssComments(files.get(TOKENS_FILE) ?? "");
  const declared = declarations(tokensCss);

  /* `@property` TAMBEM DECLARA. Um token tipado nao aparece como `--x: valor`
     dentro do `:root` — ele e registrado por um bloco proprio, e ignora-lo fazia
     a guarda acusar `--light-angle` e `--situation-tint` como inexistentes. */
  for (const registered of tokensCss.matchAll(/@property\s+(--[a-z0-9-]+)/g)) {
    const token = registered[1] ?? "";
    if (!declared.has(token)) declared.set(token, "");
  }

  /* 6 — o arquivo de tokens nao estiliza nada. */
  for (const selector of tokensCss.matchAll(/(^|\})\s*([^@{}]+)\{/g)) {
    const selectorText = (selector[2] ?? "").trim();
    if (selectorText && selectorText !== ":root") {
      add(`${TOKENS_FILE} tem o seletor "${selectorText}" — ele declara valor, nao aparencia`);
    }
  }

  /* 1 e 2 — literais e color-mix fora do arquivo de tokens. */
  for (const [path, raw] of files) {
    if (!path.endsWith(".css")) continue;
    const css = stripCssComments(raw);

    if (/color-mix\(/.test(css)) {
      add(
        `${path} usa color-mix() — na tela ele diverge de rgba() em 1/255; use rgba(var(--x-rgb),a)`,
      );
    }
    if (path === TOKENS_FILE) continue;

    for (const hex of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      add(`${path} tem a cor literal ${hex[0]} — toda cor nasce em ${TOKENS_FILE}`);
    }
    for (const fn of css.matchAll(/\brgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)/g)) {
      const [r, g, b] = [Number(fn[1]), Number(fn[2]), Number(fn[3])];
      const neutral = (r === 255 && g === 255 && b === 255) || (r === 0 && g === 0 && b === 0);
      if (!neutral) {
        add(`${path} tem a cor literal ${fn[0]}) — so branco e preto puros sao luz e sombra`);
      }
    }
  }

  /* 3 — o par hex/rgb descreve a mesma cor. */
  for (const [token, value] of declared) {
    if (!token.endsWith("-rgb")) continue;
    const base = token.slice(0, -4);
    const hexValue = declared.get(base);
    if (hexValue === undefined) {
      add(`${token} existe e ${base} nao — toda cor tem os dois formatos`);
      continue;
    }
    const hex = toChannels(resolve(hexValue, declared));
    const rgb = resolve(value, declared)
      .split(",")
      .map(part => Number(part.trim()));
    if (!hex) continue;
    if (rgb.length !== 3 || hex.some((channel, i) => channel !== rgb[i])) {
      add(
        `${base} e ${token} descrevem cores diferentes: ${hex.join(",")} contra ${rgb.join(",")}`,
      );
    }
  }

  /* 4 e 5 — referencia sem alvo, e alvo sem referencia. */
  const used = new Set();
  for (const [path, raw] of files) {
    if (!/\.(css|mjs|html)$/.test(path) || isGuardSource(path)) continue;
    const source = path.endsWith(".css")
      ? stripCssComments(raw)
      : path.endsWith(".mjs")
        ? stripJsComments(raw)
        : raw;
    for (const hit of source.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) used.add(hit[1]);
    for (const hit of source.matchAll(/setProperty\(\s*["'](--[a-z0-9-]+)/g)) used.add(hit[1]);
  }

  for (const token of used) {
    if (!declared.has(token) && !RUNTIME.has(token)) {
      add(`var(${token}) aponta para um token que nao existe — a declaracao inteira fica invalida`);
    }
  }
  for (const token of declared.keys()) {
    if (used.has(token)) continue;
    /* A METADE HEX DE UM PAR CONSUMIDO NAO E ORFA. `--x` pode nao aparecer em
       nenhum `var()` e ainda assim ser obrigatorio: a regra do par exige que ele
       exista, e e dele que a checagem de consistencia tira a cor verdadeira.
       Sem esta linha, as duas regras desta mesma guarda se contradiriam. */
    if (used.has(`${token}-rgb`)) continue;
    add(`${token} e declarado e nunca consumido — token orfao atravessa meses sem ninguem ver`);
  }

  return list;
}

/**
 * @param {string} css
 * @returns {Map<string, string>}
 */
function declarations(css) {
  const out = new Map();
  for (const hit of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+)[;}]/g)) {
    out.set(hit[1] ?? "", (hit[2] ?? "").trim());
  }
  return out;
}

/**
 * Resolve um alias `var(--outro)` de qualquer profundidade.
 *
 * @param {string} value
 * @param {Map<string, string>} declared
 * @param {number} [depth]
 * @returns {string}
 */
function resolve(value, declared, depth = 0) {
  const alias = value.match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/);
  if (!alias || depth > 8) return value;
  return resolve(declared.get(alias[1] ?? "") ?? value, declared, depth + 1);
}

/**
 * @param {string} hex
 * @returns {number[] | null}
 */
function toChannels(hex) {
  const match = hex.trim().match(/^#([0-9a-fA-F]{6})$/);
  if (!match) return null;
  const digits = match[1] ?? "";
  return [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16));
}

export const synthetic = [
  {
    label: "cor literal fora do arquivo de tokens",
    files: new Map([
      [TOKENS_FILE, ":root{--brand:#e8a33d;--brand-rgb:232,163,61}"],
      ["styles/30-components.css", ".x{color:#ff0000}"],
    ]),
  },
  {
    label: "par hex/rgb divergente",
    files: new Map([[TOKENS_FILE, ":root{--brand:#e8a33d;--brand-rgb:1,2,3}"]]),
  },
  {
    label: "var() apontando para token inexistente",
    files: new Map([
      [TOKENS_FILE, ":root{--brand:#e8a33d;--brand-rgb:232,163,61}"],
      ["styles/30-components.css", ".x{border-color:var(--nao-existe)}"],
    ]),
  },
  {
    label: "token declarado e nunca consumido",
    files: new Map([[TOKENS_FILE, ":root{--fantasma:12px}"]]),
  },
  {
    label: "color-mix no lugar de rgba",
    files: new Map([
      [TOKENS_FILE, ":root{--brand:#e8a33d;--brand-rgb:232,163,61}"],
      ["styles/30-components.css", ".x{color:color-mix(in srgb,var(--brand) 40%,transparent)}"],
    ]),
  },
  {
    label: "seletor no arquivo de tokens",
    files: new Map([[TOKENS_FILE, ":root{--a:1px}.botao{color:red}"]]),
  },
];
