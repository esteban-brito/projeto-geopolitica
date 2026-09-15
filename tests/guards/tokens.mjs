/* GUARDA · TOKENS — nenhum valor visual vive fora do arquivo de tokens.

   Cada item veio de um defeito medido no projeto anterior: literal de cor solto (225 hex e
   178 `rgba()` crus contra ~40 tokens, e o problema nao era ruido — eram cores
   CONCORRENTES para a mesma funcao); `color-mix()` para translucidez, igual a `rgba()` na
   algebra e diferente na tela, com 21 de 21 capturas deslocadas em 1/255; par hex/rgb
   divergente; `var(--x)` para token inexistente, que invalida a declaracao inteira em
   silencio; e token orfao, que atravessa meses sem ninguem notar. */

import { collect, isGuardSource, stripCssComments, stripJsComments } from "../lib/project.mjs";

export const name = "tokens";

const TOKENS_FILE = "styles/00-tokens.css";

/* Um token daqui deixa de ser conferido: se ninguem o injetar, a declaracao que o consome
   fica invalida em silencio — exatamente o defeito que o item 4 desta guarda existe para
   pegar.
   Entra aqui so o que e DADO, e nao valor visual: --part-color a cor de um segmento do
   medidor, declarada na regra do proprio segmento em `30-components.css`; --neutral   o ponto
   neutro do indice de area, que vem do CATALOGO e nao da paleta — 50 e regra de jogo, e
   duplica-lo no arquivo de tokens criaria um segundo lugar para ele divergir; --index    o
   indice corrente de uma area, escrito em estilo inline pela propria faixa de medidores: e um
   numero por elemento, e nao um valor do sistema; --floor    onde a lei daquela alavanca
   comeca, e --ceiling   onde ela acaba; --fall     o SEGUNDO limiar de uma regua, e so um
   grupo da caldeira tem um: em --mark ele abandona o governo, e em --fall a ruptura politica
   abre; --rail-floor a tinta da zona abaixo do piso, trocada pela guarda daquela alavanca
   na regra do proprio controle — e a mesma forma de --part-color; --split    onde o
   preenchimento de uma regua troca de tinta, e so a Camara tem: a base parte em quem se
   convence e quem se compra, e a divisao e por elemento e nao do sistema. */
const RUNTIME = new Set([
  "--part-color",
  "--neutral",
  "--index",
  "--floor",
  "--ceiling",
  "--mark",
  "--fall",
  "--split",
  "--rail-floor",
  /* ── A MESA, e as sete sao a MESMA especie: valor de uma peca, e nao do sistema ──
     --stitch e --stitch-v  o gradiente do ponto de seleiro, montado UMA vez e pousado nas
     quatro bordas da pasta. Inline nas quatro, o mesmo desenho seria teclado quatro vezes, e
     e assim que um padrao comeca a divergir; --furrow e --furrow-v  o sulco que a agulha
     deixa, pela mesma razao; --envelope-size e --envelope-apex  o tamanho da carta e a altura
     do bico da aba, dos quais TODA medida do envelope deriva — eles sao a escala da peca, e
     nao uma cor; --stroke-len  o comprimento do traco da rubrica, e ele so existe depois de o
     `<path>` estar na pagina: quem o escreve e `getTotalLength`, no DOM. */
  "--stitch",
  "--stitch-v",
  "--furrow",
  "--furrow-v",
  "--envelope-size",
  "--envelope-apex",
  "--stroke-len",
  /* ── E a que a bancada da mesa girava: --rest, que o JS le no voo da pasta. */
  "--rest",
  /* ── AS MATERIAS, e quem as escreve e o JS: as tres texturas nascem de `feTurbulence` e
     chegam como data URI, entao elas nao TEM valor ate a tela rodar. --timber o jacaranda do
     tampo; --fibre e --felt o grao do papel e o do envelope. */
  /* ── E O FATOR DE ESCALA DA MESA, que sai de `fitDesk`: a cena tem o tamanho da foto e o JS
     mede quanto dela cabe na janela. `--lift-rise` sai da mesma conta — o tamanho da
     pasta erguida depende da altura que sobrou depois do corte. */
  "--fit",
  "--lift-rise",
  /* ── E A MEDIDA DA CENA, que sai de `DESIGN` no `cabinet.mjs` e e a UNICA fonte dela: o
     `.room` e o `.backdrop` a liam teclada, com um aviso de que as tres copias mudavam
     juntas — e o aviso falhou em quatro comentarios. */
  "--room-w",
  "--room-h",
  /* ── E ONDE O TELEFONE FICA: no meio do vao entre a pasta e a beira visivel da janela, que
     `fitDesk` mede a cada redimensionamento. */
  "--phone-x",
  "--timber",
  "--fibre",
  "--felt",
  "--leather",
  /* ── O VOO DA PASTA: o giro de repouso, que o JS le antes de erguer. As oito medidas das duas
     sombras sairam — elas viraram as classes `--cast-*` da sala, declaradas no arquivo de
     tokens como qualquer outra. */
  "--folder-tilt",
  /* ── ONDE CADA CARTA CAIU, em estilo inline: --ex e --ey o lugar, --er o giro, --i o indice
     na pilha. Sao um valor POR ELEMENTO, e nao do sistema. */
  "--i",
  "--ex",
  "--ey",
  "--er",
  /* ── E O QUE MUDA POR ESTADO, declarado na regra `.envelope[data-urgent="true"]`: a carta que
     vence e vermelha inteira, e a cor e a tinta dela mudam com o papel. E a mesma forma de
     --part-color, que e trocada na regra do proprio segmento. */
  "--envelope-tone",
  "--envelope-lip",
  "--envelope-sheen",
  "--envelope-ink-rgb",
  "--back-dark",
  "--cut-a",
  "--flap-light",
  "--flap-dark",
]);

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  const tokensCss = stripCssComments(files.get(TOKENS_FILE) ?? "");
  const declared = declarations(tokensCss);

  /* `@property` TAMBEM DECLARA. */
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
    /* A METADE HEX DE UM PAR CONSUMIDO NAO E ORFA. */
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
