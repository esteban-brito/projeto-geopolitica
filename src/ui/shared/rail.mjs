/* O RAIL — a navegacao primaria, a esquerda e sempre presente. */

import { LEVELS, RECIPE, fresnelFor, glaze, scaleRamp, skin } from "./glass.mjs";
import { spring } from "./spring.mjs";
import { escapeHtml } from "./html.mjs";
import { iconHtml } from "./icons.mjs";
import { DEFAULT_TREATMENT, UI, titleOf } from "../strings.mjs";

/** @typedef {import("../../data/areas.mjs").Area} Area */

/**
 * ⚠ `ready` SAIU JUNTO COM AS DUAS ENTRADAS CINZAS, e ele era a metade de codigo do defeito:
 * um parametro que so recebe `true` e uma porta aberta esperando alguem passar por ela.
 * Quando A Rua e Bastidor existirem, elas entram como as outras — com uma linha.
 *
 * @param {object} section
 * @param {string} section.key
 * @param {string} section.label
 * @param {"watch" | "alert"} [section.alert] o quanto a area caiu desde a abertura
 * @param {string} current
 */
function itemHtml({ key, label, alert }, current) {
  const active = key === current;

  const attributes = [
    `class="rail__item${active ? " rail__item--active" : ""}"`,
    'type="button"',
    `data-section="${escapeHtml(key)}"`,
    alert ? `data-alert="${alert}"` : "",
    active ? 'aria-current="page"' : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    `<li><button ${attributes}>` +
    iconHtml(key, "rail__icon") +
    `<span class="rail__label">${escapeHtml(label)}</span>` +
    /* ⚠ O PONTO NAO E A LEITURA, e por isso ele leva rotulo proprio: a cor sozinha diz
       "algo errado aqui" a quem a enxerga, e nada a quem nao enxerga. */
    (alert ? `<span class="rail__alert" title="${escapeHtml(UI.nav[alert])}"></span>` : "") +
    `</button></li>`
  );
}

/**
 * DE QUEM E ESTE GOVERNO — o nome, e no que ele se tornou.
 *
 * @param {object} input
 * @param {{ name: string }} input.president
 * @param {{ near: string, article: string } | null} input.stance
 * @param {"senhor" | "senhora"} [input.treatment] como o jogador quer ser tratado
 * @returns {string}
 */
export function railGovHtml({ president, stance, treatment = DEFAULT_TREATMENT }) {
  return (
    /* ⚠ O CARGO SEGUE O TRATAMENTO: "PRESIDENTE" sobre um nome escolhido com "a senhora"
       e a mesma frase errada que a carta acabou de parar de dizer. */
    `<p class="rail__who">${escapeHtml(titleOf(treatment))}</p>` +
    `<p class="rail__president">${escapeHtml(president.name)}</p>` +
    `<p class="rail__stance">` +
    (stance
      ? `${escapeHtml(UI.gov.nearest)} ${escapeHtml(stance.article)} <b>${escapeHtml(stance.near)}</b>`
      : escapeHtml(UI.gov.untouched)) +
    `</p>`
  );
}

/**
 * ⚠ `alerts` CHEGA DE FORA, e a tela nao o calcula: a escala de queda e regra da MALHA, e
 * refeita aqui ela divergiria da faixa de areas no dia em que um limiar mudasse.
 *
 * @param {string} current chave da secao aberta
 * @param {ReadonlyArray<Area>} areas
 * @param {Record<string, "watch" | "alert">} [alerts] so as areas que caíram
 * @returns {string}
 */
export function railNavHtml(current, areas, alerts = {}) {
  const cabinet = itemHtml({ key: "cabinet", label: UI.nav.cabinet }, current);
  /* ⚠ O EMAIL VEM LOGO DEPOIS DO GABINETE, e nao no fim: as duas eram a MESMA tela ate a
     separacao, e o jogador que abre o jogo no painel vai para a caixa em seguida. */
  const email = itemHtml({ key: "email", label: UI.nav.email }, current);
  const congress = itemHtml({ key: "congress", label: UI.nav.congress }, current);
  const finance = itemHtml({ key: "finance", label: UI.nav.finance }, current);

  /* ⚠ A FAZENDA CONTINUA SENDO UMA AREA, e nao um item de primeiro nivel como o plano de tela
     sugeria. */
  /* No dock (Gabinete, `40-shell.css`) a legenda vira BOTAO e os oito moram numa gaveta: 13
     icones sem rotulo e demais. No rail vertical o botao nao aparece e a legenda fica. A gaveta
     e o proprio dock em outro estado — os seis saem e os oito entram —, e nao um painel
     flutuante: um segundo vidro e um segundo material, que a guarda `material` recusa. */
  const inside = areas.some(area => area.id === current);
  const ministries =
    `<li class="rail__group">` +
    `<button class="rail__item rail__drawer${inside ? " rail__item--active" : ""}" type="button"` +
    ` aria-expanded="false" aria-label="${escapeHtml(UI.nav.ministries)}">` +
    iconHtml("ministries", "rail__icon") +
    `<span class="rail__label">${escapeHtml(UI.nav.ministries)}</span>` +
    `</button>` +
    `<p class="rail__legend">${escapeHtml(UI.nav.ministries)}</p>` +
    `<ul class="rail__sub">` +
    areas
      /* ⚠ O NOME CURTO MANDA AQUI, e a coluna e a razao: o rail tem 109px de rotulo, e o unico
         nome que nao cabe cortava com reticencia. Ausente, `short` cai no `label`. */
      .map(area =>
        itemHtml(
          { key: area.id, label: area.short ?? area.label, alert: alerts[area.id] },
          current,
        ),
      )
      .join("") +
    `</ul>` +
    `</li>`;

  const estado = itemHtml({ key: "estado", label: UI.nav.estado }, current);

  /* ⚠ A RUA E BASTIDOR SAIRAM DO MENU, por decisao dele. Elas viviam aqui desligadas, cinzas,
     com um `title` prometendo que viriam — e uma promessa cinza e pior que a ausencia: ela
     ocupa duas das treze entradas do menu para dizer que o jogo tem menos do que parece.
     ELAS VOLTAM COM DONO: A Rua e a opiniao publica com rosto, e depende da imprensa e das
     pessoas agindo sozinhas; Bastidor e a coalizao, e depende de nomear ministro. */
  const rule = '<li class="rail__rule" aria-hidden="true"></li>';

  return cabinet + email + congress + finance + rule + ministries + rule + estado;
}

/* ⛔ O MENU DIZIA "ESTOU NO GABINETE" 29 VEZES NO CSS e tinha duas implementacoes. Agora a peca
   declara a ORIENTACAO e o CSS pergunta so isso; o limiar mora aqui, num lugar so. */
const DEITADO = "(min-width: 1181px)";

/* A GOTA: a cabeca da pilula corre na mola rapida e a cauda na lenta; o vao entre as duas vira
   corpo. `STRETCH` e quanto do vao vira corpo; `STRETCH_MAX` e o teto, em fracao da peca. */
const HEAD = { duration: 0.34, bounce: 0.2 };
const TAIL = { duration: 0.46, bounce: 0.1 };
const STRETCH = 0.5;
const STRETCH_MAX = 0.3;
/* O corpo da pilula e a cor do que se pressiona, rasa; a tinta sai do token. */
/** @type {import("./glass.mjs").Ramp} */
const PILL_BODY = [
  [0, 0.22],
  [0.5, 0.17],
  [1, 0.15],
];
const PILL_EDGE = 0.7;
const PILL_GLEAM = 0.16;

/* O MORPH DA GAVETA: a capsula muda de largura na mola. Quem sai apaga em `--dur-touch` ANTES
   da troca de layout; quem entra nasce conforme a capsula anda (`BORN_*`), nao por relogio.
   `LANDED`: a mola so declara repouso a 0,003px, e num curso de 57px isso leva 800ms com a
   capsula parada ha 400; abaixo de 0,05px nada pinta. */
const MORPH = { duration: 0.42, bounce: 0.12 };
const BORN_AT = 0.15;
const BORN_STEP = 0.05;
const BORN_SPAN = 0.4;
const LANDED = 0.05;

/**
 * O ESTADO DO MENU, um objeto so. `gen` mata mola velha: recriada a cada troca de eixo ou
 * morph, a anterior ainda tinha um quadro pendente e escrevia por cima (a pilula nascia 53px
 * fora do rail).
 *
 * @typedef {object} Menu
 * @property {HTMLElement} rail
 * @property {HTMLElement} nav
 * @property {HTMLElement | null} pill
 * @property {number} gen
 * @property {"x" | "y"} axis
 * @property {number} w
 * @property {number} h
 * @property {{ head: number, tail: number, cross: number }} at
 * @property {{ head: (to: number) => void, tail: (to: number) => void,
 *   cross: (to: number) => void } | null} molas
 * @property {string} skin
 * @property {number} fading
 * @property {HTMLElement[]} born
 * @property {number} width
 */

/** @type {Menu | null} */
let menu = null;

/**
 * ARMA O MENU — uma vez, no `<ul>` que sobrevive as pinturas. O estado da gaveta mora no
 * `<ul>` (`data-drawer`) porque o CSS le dali; quem a fecha e a escolha de uma secao, o Esc, ou
 * um clique fora.
 *
 * @param {HTMLElement} nav o `ul#railNav`
 */
export function armRail(nav) {
  const rail = nav.closest(".rail");
  if (!(rail instanceof HTMLElement)) return;
  const pill = rail.querySelector(".rail__pill");
  menu = {
    rail,
    nav,
    pill: pill instanceof HTMLElement ? pill : null,
    gen: 0,
    axis: "y",
    w: 0,
    h: 0,
    at: { head: 0, tail: 0, cross: 0 },
    molas: null,
    skin: "",
    fading: 0,
    born: [],
    width: 0,
  };
  nav.addEventListener("click", event => {
    const hit = event.target;
    if (!(hit instanceof Element)) return;
    if (hit.closest(".rail__drawer") !== null) toggle(nav.dataset["drawer"] !== "true");
    else if (hit.closest("[data-section]") !== null) toggle(false);
  });
  nav.ownerDocument.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.dataset["drawer"] === "true") toggle(false);
  });
  nav.ownerDocument.addEventListener("click", event => {
    const hit = event.target;
    if (hit instanceof Element && !nav.contains(hit) && nav.dataset["drawer"] === "true")
      toggle(false);
  });
}

/**
 * PINTA O MENU depois de a lista estar no lugar: orientacao, vidro e pilula, na mesma volta.
 * ⛔ Na mesma volta e nao no quadro seguinte: entre a escrita e o proximo quadro cabe uma
 * pintura, e a capsula aparecia com a caixa velha.
 *
 * @param {string} screen
 */
export function paintRail(screen) {
  if (!menu) return;
  const deitado = screen === "cabinet" && window.matchMedia(DEITADO).matches;
  menu.rail.dataset["flow"] = deitado ? "row" : "column";
  dress();
  movePill();
}

/* ⛔ A LENTE SO ENTRA NO DOCK: a coluna tem 162 mil px e passa do teto de area de `glaze`. */
function dress() {
  if (menu) glaze(menu.rail, LEVELS.regular);
}

/* ── A PILULA ───────────────────────────────────────────────────────────────────────────── */

/**
 * A CAIXA DE LAYOUT do item, contra a caixa de padding do rail (a que a pilula usa).
 * ⛔ NAO E `getBoundingClientRect`: com o ponteiro sobre o item o `:hover` o escala em 1,02 e a
 * caixa vinha 173x36 em vez de 169x35 — a pilula lia "outra peca" e saltava.
 *
 * @param {HTMLElement} item @param {HTMLElement} rail
 * @returns {{ x: number, y: number, w: number, h: number }}
 */
function layoutBox(item, rail) {
  let x = 0;
  let y = 0;
  /** @type {Element | null} */
  let node = item;
  while (node instanceof HTMLElement && node !== rail) {
    x += node.offsetLeft;
    y += node.offsetTop;
    /** @type {Element | null} */
    const parent = node.offsetParent;
    if (parent instanceof HTMLElement && parent !== rail) {
      x -= parent.scrollLeft;
      y -= parent.scrollTop;
    }
    node = parent;
  }
  return { x, y, w: item.offsetWidth, h: item.offsetHeight };
}

/** O quadro da pilula so toca transformacao: volume conservado, o que alonga afina por `1/√`. */
function drawPill() {
  if (!menu?.pill) return;
  const { axis, w, h, at, pill } = menu;
  const size = axis === "x" ? w : h;
  if (!size) return;
  const gap = at.head - at.tail;
  const stretch = Math.min(STRETCH_MAX * size, STRETCH * Math.abs(gap));
  const center = at.head - Math.sign(gap) * (stretch / 2);
  const along = 1 + stretch / size;
  const across = 1 / Math.sqrt(along);
  const cx = axis === "x" ? center : at.cross;
  const cy = axis === "x" ? at.cross : center;
  const sx = axis === "x" ? along : across;
  const sy = axis === "x" ? across : along;
  pill.style.transform =
    `translate3d(${(cx - w / 2).toFixed(2)}px,${(cy - h / 2).toFixed(2)}px,0) ` +
    `scale3d(${sx.toFixed(4)},${sy.toFixed(4)},1)`;
}

/**
 * As tres molas da pilula, de uma geracao.
 * @param {Menu} m @param {number} main0 @param {number} cross0
 */
function pillSprings(m, main0, cross0) {
  const mine = ++m.gen;
  /** @param {(v: number) => void} write @returns {(v: number) => void} */
  const guard = write => v => {
    if (mine !== m.gen) return;
    write(v);
    drawPill();
  };
  return {
    head: spring(
      guard(v => (m.at.head = v)),
      { ...HEAD, from: main0 },
    ),
    tail: spring(
      guard(v => (m.at.tail = v)),
      { ...TAIL, from: main0 },
    ),
    cross: spring(
      guard(v => (m.at.cross = v)),
      { ...HEAD, from: cross0 },
    ),
  };
}

/** A pele da pilula, no tamanho de repouso; so se refaz quando a caixa muda. @param {Menu} m */
function dressPill(m) {
  if (!m.pill) return;
  const r = parseFloat(getComputedStyle(m.pill).borderTopLeftRadius) || 0;
  const tint = getComputedStyle(m.rail).getPropertyValue("--brand-rgb").trim();
  const stamp = `${m.w}x${m.h}x${r}x${tint}`;
  if (m.skin === stamp) return;
  m.skin = stamp;
  m.pill.style.setProperty("--pill-w", `${m.w}px`);
  m.pill.style.setProperty("--pill-h", `${m.h}px`);
  m.pill.style.backgroundImage = `url("${skin({
    w: m.w,
    h: m.h,
    r,
    s: RECIPE.s,
    body: PILL_BODY,
    edge: scaleRamp(fresnelFor(m.h), PILL_EDGE),
    gleam: PILL_GLEAM,
    tint,
  })}")`;
}

/**
 * A PILULA CORRE ATE O ITEM CORRENTE: desliza em vez de apagar aqui e acender ali.
 * ⛔ NO DOCK NAO HA PILULA — ordem dele: o dock so existe no Gabinete, o corrente e sempre o
 * mesmo, e quem marca ali e o ponto. ⛔ O ativo VISIVEL: numa area o botao da gaveta tambem e
 * ativo e vem antes; escondido, media zero e a pilula apagava nas oito areas.
 */
export function movePill() {
  const m = menu;
  if (!m?.pill) return;
  const atual = [...m.rail.querySelectorAll(".rail__item--active")].find(
    node => node instanceof HTMLElement && node.offsetWidth > 0,
  );
  if (m.rail.dataset["flow"] === "row" || !(atual instanceof HTMLElement)) {
    m.pill.style.opacity = "0";
    return;
  }
  const to = layoutBox(atual, m.rail);
  const eixo = m.rail.dataset["flow"] === "row" ? "x" : "y";
  const main1 = eixo === "x" ? to.x + to.w / 2 : to.y + to.h / 2;
  const cross1 = eixo === "x" ? to.y + to.h / 2 : to.x + to.w / 2;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Nasceu agora, mudou de eixo ou de forma: a mola recomeca onde a pilula deve estar. Entre
     dock e coluna nao ha viagem, e outra peca. */
  const snap = m.pill.style.opacity !== "1" || eixo !== m.axis || to.w !== m.w || to.h !== m.h;
  if (snap || still || !m.molas) {
    m.axis = eixo;
    m.w = to.w;
    m.h = to.h;
    dressPill(m);
    m.at = { head: main1, tail: main1, cross: cross1 };
    m.molas = pillSprings(m, main1, cross1);
    drawPill();
  } else {
    m.molas.head(main1);
    m.molas.tail(main1);
    m.molas.cross(cross1);
  }
  m.pill.style.opacity = "1";
}

/* ── A GAVETA ───────────────────────────────────────────────────────────────────────────── */

/** Os de FORA da gaveta e os de DENTRO — quem sai e quem entra troca de lado com `open`. */
function sides() {
  if (!menu) return { outer: [], inner: [] };
  const foot = menu.rail.querySelector(".rail__foot");
  const only = (/** @type {Iterable<Element>} */ nodes) =>
    [...nodes]
      .filter(node => node instanceof HTMLElement)
      .map(node => /** @type {HTMLElement} */ (node));
  return {
    outer: only([
      ...menu.nav.querySelectorAll(":scope > li > .rail__item, :scope > .rail__rule"),
      ...(foot ? [foot] : []),
    ]),
    inner: only(menu.nav.querySelectorAll(".rail__sub .rail__item")),
  };
}

/** @param {boolean} open */
function aria(open) {
  const drawer = menu?.nav.querySelector(".rail__drawer");
  if (drawer instanceof HTMLElement) {
    drawer.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("aria-label", open ? UI.nav.ministriesClose : UI.nav.ministries);
  }
}

/** O morph pousa: largura inline fora, nascidos limpos, lente no tamanho final. */
function land() {
  if (!menu) return;
  menu.rail.style.width = "";
  delete menu.rail.dataset["morph"];
  for (const item of menu.born) {
    item.style.opacity = "";
    item.style.transform = "";
  }
  menu.born = [];
  dress();
  movePill();
}

/**
 * A troca de layout e o morph a partir dela. ⛔ A LENTE E DO TAMANHO DA CAIXA: instalada no
 * tamanho MAIOR antes de a largura andar (a mascara cobre a caixa o tempo todo) e refeita no
 * final; por quadro nao e opcao — o navegador nao re-resolve `url(#id)` a tempo.
 * ⚠ A largura de partida se mede ANTES da troca: depois ela ja e a de chegada.
 *
 * @param {boolean} open
 */
function swap(open) {
  const m = menu;
  if (!m) return;
  const before = m.rail.dataset["morph"] === "true" ? m.width : m.rail.offsetWidth;
  m.nav.dataset["drawer"] = String(open);
  aria(open);
  if (
    m.rail.dataset["flow"] !== "row" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    requestAnimationFrame(() => {
      dress();
      movePill();
    });
    return;
  }
  m.rail.style.width = "";
  const after = m.rail.offsetWidth;
  if (after >= before) dress();
  m.rail.style.width = `${before.toFixed(2)}px`;
  m.rail.dataset["morph"] = "true";
  const { outer, inner } = sides();
  m.born = (open ? inner : outer).filter(node => node.offsetWidth > 0);
  for (const item of m.born) {
    item.style.opacity = "0";
    item.style.transform = "scale(0.8)";
  }
  m.width = before;
  const mine = ++m.gen;
  const grow = spring(
    value => {
      if (mine !== m.gen) return;
      /* A tela trocou no meio e o menu virou coluna: largura inline nela seria defeito. */
      if (m.rail.dataset["flow"] !== "row") {
        m.gen += 1;
        land();
        return;
      }
      m.width = value;
      m.rail.style.width = `${value.toFixed(2)}px`;
      const p =
        after === before ? 1 : Math.min(1, Math.max(0, (value - before) / (after - before)));
      for (const [i, item] of m.born.entries()) {
        const t = Math.min(1, Math.max(0, (p - BORN_AT - i * BORN_STEP) / BORN_SPAN));
        const ease = t * t * (3 - 2 * t);
        item.style.opacity = ease.toFixed(3);
        item.style.transform = `scale(${(0.8 + 0.2 * ease).toFixed(4)})`;
      }
      if (Math.abs(value - after) < LANDED) land();
    },
    { ...MORPH, from: before },
  );
  grow(after);
}

/**
 * Abre ou fecha a gaveta: quem sai apaga primeiro, e so entao o layout troca.
 * @param {boolean} open
 */
function toggle(open) {
  const m = menu;
  if (!m) return;
  if (m.fading) window.clearTimeout(m.fading);
  m.fading = 0;
  const { outer, inner } = sides();
  const leaving =
    m.rail.dataset["flow"] === "row"
      ? (open ? outer : inner).filter(node => node.offsetWidth > 0)
      : [];
  if (leaving.length === 0) {
    swap(open);
    return;
  }
  const touch = parseFloat(getComputedStyle(m.rail).getPropertyValue("--dur-touch")) || 0;
  for (const item of leaving) item.style.opacity = "0";
  m.fading = window.setTimeout(() => {
    m.fading = 0;
    for (const item of leaving) item.style.opacity = "";
    swap(open);
  }, touch);
}
