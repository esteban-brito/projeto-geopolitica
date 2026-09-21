/* GABINETE — a MESA: o tampo, a pasta de despachos e a correspondencia do mes. */

import { escapeHtml } from "../shared/html.mjs";
import { armSignature, decreeHtml } from "../shared/decree.mjs";
import { briefHtml } from "../shared/brief.mjs";
import { mailPileHtml } from "../shared/mail-pile.mjs";
import { letterHtml } from "./inbox.mjs";
import { phoneHtml } from "../shared/phone.mjs";
import { curveOf } from "../shared/spring.mjs";
import { felt, fibre } from "../shared/texture.mjs";
import { UI } from "../strings.mjs";

/* Materias da mesa nascem uma vez; caminho absoluto para resolver contra folha consumidora. */
const TIMBER = 'url("/assets/jacaranda.webp")';
const FIBRE = fibre({ freq: 0.9, octaves: 4, force: 0.13 });
const FELT = felt();

/**
 * @param {object} input
 * @param {string} input.body
 * @param {string} [input.span]
 * @returns {string}
 */
function cardHtml({ body, span }) {
  return (
    `<section class="card"${span ? ` data-span="${span}"` : ""}>` +
    `<div class="card__body">${body}</div>` +
    `</section>`
  );
}

/**
 * @param {object} input
 * @param {boolean} input.resolved
 * @param {string} input.inbox
 * @returns {string}
 */
export function emailHtml(input) {
  /* Vazio ocupa a coluna: em vao de 700px no teto pareceria travado. */
  const inbox = cardHtml({
    span: "lead",
    body:
      input.inbox === ""
        ? `<div class="empty">` +
          `<p class="empty__lead">` +
          `${escapeHtml(input.resolved ? UI.inbox.quietLead : UI.inbox.firstLead)}</p>` +
          `<p class="empty__note">` +
          (input.resolved ? "" : `${escapeHtml(UI.cabinet.inboxSigned)} `) +
          `${escapeHtml(UI.cabinet.inboxWaiting)}</p>` +
          `</div>`
        : input.inbox,
  });

  return `<section class="area cabinet"><div class="cards">${inbox}</div></section>`;
}

/**
 * @param {object} input
 * @param {number} input.room
 * @param {number} input.ratio
 * @param {string} input.president
 * @param {number} input.month
 * @param {ReadonlyArray<{ id: string, label: string, short?: string }>} input.areas
 * @param {ReadonlyArray<string>} input.protect
 * @param {ReadonlyArray<{ urgent: boolean, dispatch: import("./inbox.mjs").Dispatch | null }>} input.letters
 * @param {number} input.sheets
 * @param {Parameters<typeof briefHtml>[0]} input.brief
 * @param {string | null} input.boiling
 * @returns {string}
 */
export function cabinetHtml(input) {
  /* Folhas de baixo sem texto: contingenciamento e a unica caneta. */
  const under = Array.from(
    { length: input.sheets },
    (_, i) => `<div class="stack__under" style="--i:${input.sheets - i}"></div>`,
  ).join("");

  return (
    `<section class="area cabinet">` +
    `<div class="room">` +
    `<div class="folder" tabindex="0" role="button" aria-label="${escapeHtml(UI.cabinet.folder)}">` +
    `<i class="folder__cast" data-cast="lift"></i>` +
    `<i class="folder__open"></i>` +
    /* Aba direita da folha bate com aberta em 0,71%. */
    `<div class="folder__leaf">` +
    briefHtml(input.brief) +
    `<i class="folder__cover"></i>` +
    `</div>` +
    `<div class="stack">${under}${decreeHtml({ ...input, chief: input.brief.chief })}</div>` +
    `</div>` +
    `<div class="mail">${mailPileHtml(input)}</div>` +
    `<div class="post">` +
    input.letters
      .map((letter, i) =>
        !letter.dispatch
          ? ""
          : `<div class="sheet post__sheet" data-letter="${i}" data-id="${escapeHtml(letter.dispatch.id)}" tabindex="-1" aria-label="${escapeHtml(UI.envelope.open)}" hidden>${letterHtml(letter.dispatch)}</div>`,
      )
      .join("") +
    `</div>` +
    phoneHtml(input) +
    `<div class="pen" aria-hidden="true"></div>` +
    `</div>` +
    `</section>`
  );
}

/** @param {ParentNode} root */
export function dressDesk(root) {
  /** @param {string} pick @param {string} name @param {string} value */
  const wear = (pick, name, value) => {
    const node = root.querySelector(pick);
    if (node instanceof HTMLElement) node.style.setProperty(name, value);
  };

  const body = root instanceof Element ? root.ownerDocument.body : null;
  if (body) {
    body.style.setProperty("--timber", TIMBER);
    body.style.setProperty("--room-w", `${DESIGN.width}px`);
    body.style.setProperty("--room-h", `${DESIGN.height}px`);
  }
  wear(".folder", "--fibre", FIBRE);
  wear(".mail", "--felt", FELT);

  armSignature(root.querySelector(".stack .sheet"));
  armFlight(root);
  armPost(root);
  fitDesk(root);
}

/* Base da foto do tampo: 1916x821 (testados 1206x806 e 1672x940). */
const DESIGN = { width: 1916, height: 821 };

const PIECES = [".folder", ".mail", ".phone", ".pen"];
/* Folga de respiro: 12px da cena. */
const BREATH = 12;

/** @type {ResizeObserver | null} */
let watcher = null;
/** @type {{ top: number, bottom: number }} */
let band = { top: 0, bottom: DESIGN.height };

/** @param {HTMLElement} room */
function measureBand(room) {
  const fit = Number(room.style.getPropertyValue("--fit")) || 1;
  const box = room.getBoundingClientRect();
  let top = Infinity,
    bottom = -Infinity;
  for (const piece of room.querySelectorAll(PIECES.join(","))) {
    const r = piece.getBoundingClientRect();
    top = Math.min(top, (r.top - box.top) / fit);
    bottom = Math.max(bottom, (r.bottom - box.top) / fit);
  }
  if (!Number.isFinite(top)) return { top: 0, bottom: DESIGN.height };
  return { top: Math.max(0, top - BREATH), bottom: Math.min(DESIGN.height, bottom + BREATH) };
}

/** @param {ParentNode} root */
function fitDesk(root) {
  const area = root.querySelector(".area.cabinet");
  if (!(area instanceof HTMLElement)) return;

  if (watcher === null)
    watcher = new ResizeObserver(entries => entries.forEach(seen => scale(seen.target)));
  watcher.disconnect();
  const room = area.querySelector(".room");
  if (room instanceof HTMLElement) band = measureBand(room);
  watcher.observe(area);
  scale(area);
}

/* Altura visivel da pasta erguida: 0,90 (0,86 dava 10,5px no ato a 1440x980). */
const READING = 0.9;

/** @type {((seen: number) => void) | null} */
let tune = null;

/** @param {Element} area */
function scale(area) {
  const room = area.querySelector(".room");
  if (!(room instanceof HTMLElement)) return;
  /* Teto 1: foto nao amplia. Altura da foto encolhia 5,1% a 1920x937, corte come 21px, peca a 39px. */
  const fit = Math.min(
    1,
    Math.max(area.clientWidth / DESIGN.width, area.clientHeight / (band.bottom - band.top)),
  );
  room.style.setProperty("--fit", fit.toFixed(4));
  /* Corte na madeira: telefone a 40px, pasta a 120px; a 1920x800 telefone saia 27px. */
  const spare = Math.max(0, (DESIGN.height * fit - area.clientHeight) / 2);
  const shift = ((DESIGN.height - band.top - band.bottom) / 2) * fit;
  room.style.setProperty("--room-dy", `${Math.max(-spare, Math.min(spare, shift)).toFixed(1)}px`);

  /* Telefone na direita: folga de 39px a 1440 e 152px a 1920. Recuo de 160px cortava 36px; 220px usa meia caixa 228px - 32px + 24px. */
  const seenRight = (DESIGN.width + area.clientWidth / fit) / 2;
  room.style.setProperty("--phone-x", `${(seenRight - 220).toFixed(1)}px`);

  /* Esquerda: leque de 217px com vao de 198,7px; beira visivel devolvia 2,9px em 6 de 24 meses. */

  /* Altura de leitura medida: contas teóricas pediam 86% e davam 65% ou 64%. */
  tune?.(area.clientHeight);
}

/* Mola com quique 0 e duracao 0,30s na subida e 0,26s na descida. */
const LIFT = { duration: 0.3, bounce: 0 };
const DROP = { duration: 0.26, bounce: 0 };

/* Voo persiste entre repinturas de tela. */
let lifted = false;
let at = 0;
/* Rubrica sai quando o mes e ato viram. */
let sealed = "";

/** @type {null | {
    curve: ReturnType<typeof curveOf>, from: number, to: number, start: number,
    how: { duration: number, bounce: number } }} */
let flying = null;

/**
 * Posicao e velocidade analiticas do voo em curso.
 *
 * @param {number} now
 * @returns {{ at: number, rate: number }}
 */
function whereIs(now) {
  if (flying === null) return { at, rate: 0 };
  const t = Math.max(0, (now - flying.start) / 1000);
  const span = flying.to - flying.from;
  if (t >= flying.curve.duration) return { at: flying.to, rate: 0 };
  return {
    at: flying.from + span * flying.curve.at(t),
    rate: span * flying.curve.rate(t),
  };
}

/** Limpa o gesto entre partidas; evita decreto rubricado e pasta retida a 710px. */
export function forgetDesk() {
  lifted = false;
  at = 0;
  flying = null;
  sealed = "";
  held = null;
}

/** @param {ParentNode} root */
function armFlight(root) {
  const room = root.querySelector(".room");
  const folder = root.querySelector(".folder");
  const sheet = root.querySelector(".stack .sheet");
  if (!(room instanceof HTMLElement) || !(folder instanceof HTMLElement)) return;
  if (!(sheet instanceof HTMLElement)) return;

  const act = sheet.querySelector(".epigraph")?.textContent ?? "";
  sheet.dataset["signed"] = String(act !== "" && act === sealed);

  /* Alvos lidos uma vez por voo; evita getComputedStyle a cada quadro. */
  const of = getComputedStyle(folder);
  /** @param {string} name @param {number} fallback */
  const num = (name, fallback) => {
    const value = parseFloat(of.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  /* Sem perspectiva: aproximacao de 7,6% integrada na escala de leitura. */
  const aim = {
    dx: num("--lift-dx", 36),
    dy: num("--lift-dy", -57),
    turn: num("--folder-tilt", -2),
    rest: num("--rest", 0.5),
    rise: num("--lift-rise", 0.8),
  };
  const inHand = folder.querySelector('[data-cast="lift"]');
  const leaf = folder.querySelector(".folder__leaf");
  const spread = folder.querySelector(".folder__open");
  const pile = folder.querySelector(".stack");

  /* Termos lineares em t levam voo ao compositor: left: 47% centra caixa aberta, -25% fecha. */
  /** @param {number} t */
  const shape = t =>
    `translate(-50%, -50%) translate(${aim.dx * t}px, ${aim.dy * t}px)` +
    ` rotate(${aim.turn * (1 - t)}deg) scale(${aim.rest + (aim.rise - aim.rest) * t})` +
    ` translateX(${-25 * (1 - t)}%)`;

  /* Dobra no mesmo t: gesto unico de erguer e abrir. */
  /** @param {number} t */
  const fold = t => `rotateY(${180 * (1 - t)}deg)`;

  /* Em opacity: 0 a GPU pagava 75ms para alocar 132px de desfoque (2 quadros). A 0,001 mantem textura ativa. */
  const FLOOR = 0.001;

  /** @param {number} t */
  const draw = t => {
    folder.style.transform = shape(t);
    /* Cruzar opacidade em vez de reescrever sombra: 156,8 fps contra 143,8 no mesmo laco. */
    if (inHand instanceof HTMLElement) inHand.style.opacity = String(Math.max(FLOOR, t));
    if (leaf instanceof HTMLElement) leaf.style.transform = fold(t);
    if (spread instanceof HTMLElement) spread.style.opacity = String(Math.max(FLOOR, t));
    /* Apaga pilha em vez de inflar capa para evitar franja de recorte. */
    if (pile instanceof HTMLElement) pile.style.opacity = String(Math.max(FLOOR, t));
  };

  const parts = () => [
    { node: folder, key: "transform", of: shape },
    { node: inHand, key: "opacity", of: (/** @type {number} */ t) => String(Math.max(FLOOR, t)) },
    { node: leaf, key: "transform", of: fold },
    { node: spread, key: "opacity", of: (/** @type {number} */ t) => String(Math.max(FLOOR, t)) },
    { node: pile, key: "opacity", of: (/** @type {number} */ t) => String(Math.max(FLOOR, t)) },
  ];

  /**
   * @param {number} goal 0 na mesa, 1 na mao
   * @param {{ duration: number, bounce: number }} how
   */
  const move = (goal, how) => {
    const now = performance.now();
    const here = whereIs(now);
    const span = goal - here.at;

    for (const part of parts()) {
      if (!(part.node instanceof HTMLElement)) continue;
      part.node.getAnimations().forEach(one => one.cancel());
    }
    if (Math.abs(span) < 0.001) {
      at = goal;
      flying = null;
      draw(goal);
      return;
    }

    /* Velocidade normalizada pelo curso novo: impulso de 2 cursos/s preservado sem dobrar. */
    const curve = curveOf({ ...how, velocity: here.rate / span });
    flying = { curve, from: here.at, to: goal, start: now, how };
    at = goal;

    for (const part of parts()) {
      if (!(part.node instanceof HTMLElement)) continue;
      part.node.animate([{ [part.key]: part.of(here.at) }, { [part.key]: part.of(goal) }], {
        duration: curve.duration * 1000,
        easing: curve.css,
        fill: "forwards",
      });
    }
  };

  /* Calibragem do tamanho de leitura por pintura, com peca parada no alto. */
  tune = seen => {
    for (const part of parts()) {
      if (part.node instanceof HTMLElement) part.node.getAnimations().forEach(one => one.cancel());
    }
    draw(1);
    const tall = folder.getBoundingClientRect().height;
    if (tall > 0) {
      const fixed = Math.min(1, aim.rise * ((seen * READING) / tall));
      aim.rise = fixed;
      folder.style.setProperty("--lift-rise", fixed.toFixed(4));
    }

    /* Centraliza na tela inteira; centrar na area deixava a peca 132px a direita do meio. */
    draw(1);
    const peca = folder.getBoundingClientRect();
    const janela = folder.ownerDocument.defaultView;
    if (janela !== null && peca.height > 0) {
      aim.dx += janela.innerWidth / 2 - (peca.left + peca.width / 2);
      aim.dy += janela.innerHeight / 2 - (peca.top + peca.height / 2);
    }
    const back = whereIs(performance.now());
    draw(back.at);
    if (flying !== null) move(flying.to, flying.how);
  };

  /* Pintura reassume voo em curso; evita congelar a pasta (medido a 3px da mesa). */
  const here = whereIs(performance.now());
  draw(here.at);
  const goal = lifted ? 1 : 0;
  if (Math.abs(here.at - goal) > 0.001) move(goal, lifted ? LIFT : DROP);
  else {
    at = goal;
    flying = null;
  }

  /* Teclado: Enter e Espaco erguem a pasta, Esc larga. */
  folder.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      folder.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    } else if (event.key === "Escape" && lifted) {
      lifted = false;
      folder.dataset["open"] = "false";
      move(0, DROP);
    }
  });

  room.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest(".folder") === null) {
      if (lifted) {
        lifted = false;
        folder.dataset["open"] = "false";
        move(0, DROP);
      }
      return;
    }

    if (!lifted) {
      /* Clique na mesa ergue; stopPropagation evita marcar a folha no mesmo clique. */
      event.stopPropagation();
      lifted = true;
      folder.dataset["open"] = "true";
      move(1, LIFT);
      return;
    }

    if (target.closest("[data-protect]") !== null) return;

    /* Rubrica leva 1,1s e so corre com pasta assentada na mao (at > 0,94). */
    if (target.closest(".stack .sheet") !== null && whereIs(performance.now()).at > 0.94) {
      sealed = sealed === act ? "" : act;
      sheet.dataset["signed"] = String(sealed === act);
    }
  });
}

/* Carta sobe ao centro na mola LIFT ate escala READING sobre os 1018px da folha.
   ⛔ A MAO GUARDA O ID, NAO O INDICE: a lista da mesa muda a cada pintura (o mes fecha, a
   carta e respondida) e o indice 0 de janeiro reabria a carta de fevereiro sozinho. */
/** @type {string | null} */
let held = null;
/* ⛔ O ESC DO DOCUMENTO ARMA UMA VEZ: cada pintura do Gabinete pendurava outro `keydown`, e o
   mais velho corria primeiro sobre a `.post` descartada — depois de uma repintura o Esc
   nao largava mais a carta. `drop` aponta sempre para o `close` da pintura corrente. */
/** @type {(animate: boolean) => void} */
let drop = () => {};
let escArmed = false;

/** @param {ParentNode} root */
function armPost(root) {
  const room = root.querySelector(".room");
  const post = root.querySelector(".post");
  if (!(room instanceof HTMLElement) || !(post instanceof HTMLElement)) return;

  /** @param {number} i */
  const sheetOf = i => post.querySelector(`.post__sheet[data-letter="${i}"]`);
  /** @param {number} i */
  const envelopeOf = i => room.querySelector(`.envelope[data-letter="${i}"]`);

  /* Coordenadas em px da cena: divididas por --fit para compensar escala. */
  /** @param {HTMLElement} envelope @param {HTMLElement} sheet */
  const ends = (envelope, sheet) => {
    const fit = Number(room.style.getPropertyValue("--fit")) || 1;
    const scene = room.getBoundingClientRect();
    const env = envelope.getBoundingClientRect();
    const win = room.ownerDocument.defaultView;
    const area = room.closest(".area");
    const seen = area instanceof HTMLElement ? area.clientHeight : scene.height;
    const turn = parseFloat(getComputedStyle(envelope).getPropertyValue("--er")) || 0;
    const tall = sheet.offsetHeight || 1018;
    const rise = Math.min(1, (seen * READING) / tall) / fit;
    const cx = (env.left + env.width / 2 - (scene.left + scene.width / 2)) / fit;
    const cy = (env.top + env.height / 2 - (scene.top + scene.height / 2)) / fit;
    const wx = win ? (win.innerWidth / 2 - (scene.left + scene.width / 2)) / fit : 0;
    const wy = win ? (win.innerHeight / 2 - (scene.top + scene.height / 2)) / fit : 0;
    const small = env.width / fit / (sheet.offsetWidth || 720);
    const from =
      `translate(-50%, -50%) translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)` +
      ` rotate(${turn}deg) scale(${small.toFixed(4)})`;
    const to =
      `translate(-50%, -50%) translate(${wx.toFixed(1)}px, ${wy.toFixed(1)}px)` +
      ` rotate(0deg) scale(${rise.toFixed(4)})`;
    return { from, to };
  };

  /* O indice e desta pintura; o que sobrevive a ela e `held`. */
  let reading = -1;

  /** @param {number} i @param {boolean} animate */
  const open = (i, animate) => {
    const sheet = sheetOf(i);
    const envelope = envelopeOf(i);
    if (!(sheet instanceof HTMLElement) || !(envelope instanceof HTMLElement)) return;
    reading = i;
    held = sheet.dataset["id"] ?? null;
    sheet.hidden = false;
    envelope.dataset["open"] = "true";
    const { from, to } = ends(envelope, sheet);
    sheet.getAnimations().forEach(one => one.cancel());
    sheet.style.transform = to;
    if (animate) {
      const curve = curveOf({ ...LIFT, velocity: 0 });
      sheet.animate([{ transform: from }, { transform: to }], {
        duration: curve.duration * 1000,
        easing: curve.css,
        fill: "none",
      });
    }
    sheet.focus({ preventScroll: true });
  };

  /** @param {boolean} animate */
  const close = animate => {
    if (reading < 0) return;
    const sheet = sheetOf(reading);
    const envelope = envelopeOf(reading);
    reading = -1;
    held = null;
    if (!(sheet instanceof HTMLElement)) return;
    if (envelope instanceof HTMLElement) envelope.dataset["open"] = "false";
    const done = () => {
      sheet.hidden = true;
      if (envelope instanceof HTMLElement) envelope.focus({ preventScroll: true });
    };
    if (!animate || !(envelope instanceof HTMLElement)) return done();
    const { from, to } = ends(envelope, sheet);
    const curve = curveOf({ ...DROP, velocity: 0 });
    const fall = sheet.animate([{ transform: to }, { transform: from }], {
      duration: curve.duration * 1000,
      easing: curve.css,
      fill: "forwards",
    });
    fall.finished
      .catch(() => {})
      .then(() => {
        fall.cancel();
        done();
      });
  };

  /* Reabre sem voo a carta que estava na mao, procurando pelo id dela. */
  if (held !== null) {
    const kept = [...post.querySelectorAll(".post__sheet")].find(
      sheet => sheet instanceof HTMLElement && sheet.dataset["id"] === held,
    );
    if (kept instanceof HTMLElement) open(Number(kept.dataset["letter"]), false);
    else held = null;
  }
  drop = close;

  room.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".post__sheet") !== null) return;
    const envelope = target.closest(".envelope[data-letter]");
    if (envelope instanceof HTMLElement) {
      const i = Number(envelope.dataset["letter"]);
      if (i === reading) return close(true);
      close(false);
      open(i, true);
      return;
    }
    if (reading >= 0) close(true);
  });
  if (escArmed) return;
  escArmed = true;
  room.ownerDocument.addEventListener("keydown", event => {
    if (event.key === "Escape" && held !== null) drop(true);
  });
}
