/* A PINTURA — `paint` redesenha, `refresh` so troca numero derivado, `transition` troca de tela. */

import {
  CATALOG,
  MONTHS_PER_TERM,
  SEATS,
  SIMPLE_MAJORITY,
  STAGES,
  alertsOf,
  calendarOf,
  governmentOf,
  passageOf,
  pollFrom,
  silences,
  situationOf,
  termOf,
} from "../public/index.mjs";
import { LEVELS, glaze } from "../ui/shared/glass.mjs";
import { dressRail, paintRail, railGovHtml, railNavHtml } from "../ui/shared/rail.mjs";
import { closingHtml } from "../ui/screens/closing.mjs";
import {
  areaHtml,
  chainHtml,
  estadoHtml,
  lawReadHtml,
  outlookHtml,
  poolHtml,
  programReadHtml,
  riteOf,
} from "../ui/screens/area.mjs";
import {
  benchReadHtml,
  capacityStripHtml,
  congressHtml,
  mesaHtml,
  passageHtml,
  tallyHtml,
} from "../ui/screens/mesa.mjs";
import { financeHtml } from "../ui/screens/finance.mjs";
import { vitalsHtml, whenHtml } from "../ui/screens/dashboard.mjs";
import { bindAdvance, dressTopbar } from "../ui/shared/topbar.mjs";
import { cabinetHtml, dressDesk, emailHtml } from "../ui/screens/cabinet.mjs";
import { reportPanelHtml } from "../ui/screens/report.mjs";
import { UI } from "../ui/strings.mjs";
import { INFLATION_CEILING, lawNow, persistSeen, session } from "./session.mjs";
import { areaInput, cabinetInput, emailInput, financeInput, mesaInput } from "./inputs.mjs";

/** @typedef {import("../state/state.mjs").GameState} GameState */

export const el = {
  /* Moldura ganha id para o estado de cerco. */
  shell: must("shell"),
  railNav: must("railNav"),
  railGov: must("railGov"),
  turn: must("turn"),
  vitals: must("vitals"),
  main: must("main"),
  seal: must("seal"),
  advance: /** @type {HTMLButtonElement} */ (must("advance")),
  advanceArrow: must("advanceArrow"),
  restart: must("restart"),
  swearDialog: /** @type {HTMLDialogElement} */ (must("swearDialog")),
  swearForm: /** @type {HTMLFormElement} */ (must("swearForm")),
  swearName: /** @type {HTMLInputElement} */ (must("swearName")),
  swearParty: /** @type {HTMLSelectElement} */ (must("swearParty")),
  swearTitle: must("swearTitle"),
  swearNameLabel: must("swearNameLabel"),
  swearPartyLabel: must("swearPartyLabel"),
  swearPartyHint: must("swearPartyHint"),
  swearHowLabel: must("swearHowLabel"),
  swearSir: must("swearSir"),
  swearMadam: must("swearMadam"),
  swearOk: must("swearOk"),
  swearCancel: must("swearCancel"),
  /* O dialogo carrega apenas avisos operacionais. */
  dialog: /** @type {HTMLDialogElement} */ (must("noticeDialog")),
  noticeSlot: must("noticeSlot"),
  noticeClose: must("noticeClose"),
};

/** @param {string} id */
function must(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`elemento #${id} nao existe no documento`);
  return node;
}

/* ── PINTURA ──────────────────────────────────────────────────────────────── */

/* Identidade do controle para travessia do foco. */
const IDENTITY = /** @type {const} */ ([
  "dispatch",
  "section",
  "answer",
  "letter",
  "party",
  "program",
  "protect",
  "rite",
  "band",
  "side",
]);

/**
 * Seletor do elemento focado; usa apenas atributos de identidade (evita queda em BODY e 8 tabs).
 *
 * @returns {string | null}
 */
export function focusMark() {
  const node = document.activeElement;
  if (!(node instanceof HTMLElement) || node === document.body) return null;
  if (node.id) return `#${node.id}`;

  const parts = IDENTITY.filter(key => node.dataset[key] !== undefined).map(
    key => `[data-${key}=${CSS.escape(String(node.dataset[key]))}]`,
  );
  return parts.length > 0 ? node.tagName.toLowerCase() + parts.join("") : null;
}

export function paint() {
  /* Fixa framed antes de cabinetInput ler a referencia anterior. */
  if (session.painted !== null && session.painted.month !== session.state.month)
    session.framed = session.painted;

  const focused = focusMark();
  const current = situationOf(session.state, CATALOG);
  /* O motor avalia o encerramento do mandato aos 48 meses. */
  const term = termOf(session.state, CATALOG);
  endLabel(term);

  /* Navegacao reflete alertas da capacidade de cada ministerio. */
  el.railNav.innerHTML = railNavHtml(
    session.screen,
    CATALOG.areas,
    alertsOf(CATALOG.areas, session.state.capacity.index),
  );

  /* Atualiza postura politica derivada do orcamento. */
  const gov = governmentOf(session.state, CATALOG);
  el.railGov.innerHTML = railGovHtml({
    president: gov.president,
    stance: gov.stance,
    treatment: gov.treatment,
  });
  paintBoard(term);
  paintTopbar(term, current);
  restoreFocus(focused);
  dressAll();
  session.painted = session.state;
  session.standing = current;
}

/** @param {ReturnType<typeof termOf>} term */
function paintBoard(term) {
  const area = CATALOG.areas.find(item => item.id === session.screen);
  if (session.screen === "estado") {
    el.main.innerHTML = estadoHtml({
      rules: CATALOG.rules,
      levels: session.orders.levels,
      bands: lawNow(),
      requestedBands: session.orders.bands,
    });
    el.main.dataset["screen"] = "estado";
  } else if (session.screen === "finance") {
    el.main.innerHTML = financeHtml(financeInput());
    el.main.dataset["screen"] = "finance";
  } else if (area) {
    el.main.innerHTML = areaHtml(areaInput(area));
    el.main.dataset["screen"] = "area";
  } else if (session.screen === "congress") {
    el.main.innerHTML = congressHtml({
      gauges: capacityStripHtml({
        areas: CATALOG.areas,
        index: session.state.capacity.index,
        history: session.state.series.areas,
        alerts: alertsOf(CATALOG.areas, session.state.capacity.index),
      }),
      mesa: mesaHtml(mesaInput()),
      passage: passageHtml(passageOf(session.state, CATALOG), STAGES),
      report: reportPanelHtml(
        session.last && {
          report: session.last.report,
          quorum: session.last.quorum,
          parties: CATALOG.parties,
          areas: CATALOG.areas,
          loyaltyBefore: session.last.loyaltyBefore,
          indexBefore: session.last.indexBefore,
        },
      ),
    });
    el.main.dataset["screen"] = "congress";
  } else if (term.over) {
    /* Fechamento ocupa o endereco do Gabinete no termino. */
    el.main.innerHTML = closingHtml(term, governmentOf(session.state, CATALOG).treatment);
    el.main.dataset["screen"] = "closing";
  } else if (session.screen === "email") {
    el.main.innerHTML = emailHtml(emailInput());
    el.main.dataset["screen"] = "email";
    /* Marca leitura e poda cartas mortas apos a renderizacao (evita acumulo em 48 meses). */
    rememberRead();
  } else {
    el.main.innerHTML = cabinetHtml(cabinetInput());
    el.main.dataset["screen"] = "cabinet";
    /* Veste a mesa com rubrica e texturas apos a montagem. */
    dressDesk(el.main);
  }
}

/**
 * @param {ReturnType<typeof termOf>} term
 * @param {ReturnType<typeof situationOf>} current
 */
function paintTopbar(term, current) {
  /* Render por identidade de referencia na barra superior. */
  const previous = session.painted;
  const before = session.standing;

  if (!previous || previous.month !== session.state.month) {
    const ahead = calendarOf(session.state.month);
    const due = ahead.now[0] ?? ahead.soon[0] ?? null;
    el.turn.innerHTML = whenHtml({
      month: session.state.month,
      deadline: due ? { label: due.label, due: Number("due" in due ? due.due : 0) } : null,
      left: Math.max(0, MONTHS_PER_TERM - session.state.month),
      over: term.over,
    });
  }

  if (!previous || previous !== session.state) {
    const poll = pollFrom(session.state.mood, CATALOG.segments, CATALOG.opinion);
    const past = [...session.state.months].reverse();
    el.vitals.innerHTML = vitalsHtml({
      macro: session.state.macro,
      approval: poll.good,
      base: current.base,
      majority: SIMPLE_MAJORITY,
      seatsTotal: SEATS,
      streetFloor: CATALOG.pressure.streetFloor,
      ceiling: INFLATION_CEILING,
      horizon: MONTHS_PER_TERM,
      approvalFrom: Math.max(0, session.state.month - past.length),
      series: {
        gdp: session.state.series.gdp,
        inflation: session.state.series.inflation,
        approval: past.map(card => card.balance.streetNow),
      },
    });
  }

  if (before?.reason !== current.reason) {
    document.documentElement.style.setProperty("--situation-tint", `var(--${current.level})`);
  }

  /* Cerco entra por aresta na moldura (evita conflito com o matiz da situacao). */
  const siege = session.state.impeachment !== null && session.state.fallen === null ? "true" : "";
  if (el.shell.dataset["siege"] !== siege) el.shell.dataset["siege"] = siege;
}

/** @param {string | null} focused */
function restoreFocus(focused) {
  /* Restaura foco sem rolagem forcada. */
  if (focused) {
    const back = document.querySelector(focused);
    if (back instanceof HTMLElement && back !== document.activeElement) {
      back.focus({ preventScroll: true });
    }
  }
}

function dressAll() {
  /* O vidro se veste na mesma volta para evitar refluxo visual. */
  dressTopbar(document);
  paintRail(session.screen);
  for (const stage of document.querySelectorAll(".glass-stage")) {
    if (stage instanceof HTMLElement) glaze(stage, LEVELS.regular);
  }
  dressActions();
  bindAdvance(el.advance);
}

/** Atualiza leituras e poda correspondencias mortas no DOM. */
export function rememberRead() {
  const rows = /** @type {HTMLElement[]} */ ([...el.main.querySelectorAll(".tray__row")]);
  if (rows.length === 0) return;

  /* Compara conteudo ordenado; tamanho sozinho atrasava gravacao por 4 meses e 6 de 7 cartas. */
  const before = [...session.readMail].sort().join("|");

  const alive = new Set(rows.map(row => row.dataset["dispatch"] ?? ""));
  for (const id of session.readMail) if (!alive.has(id)) session.readMail.delete(id);

  const current = /** @type {HTMLElement | null} */ (
    el.main.querySelector('.tray__row[aria-current="true"]')
  );
  const id = current?.dataset["dispatch"];
  if (id) session.readMail.add(id);

  /* Rola se a linha estiver fora da visao (medido: 68px abaixo da area visivel). Abaixo de
     940px quem rola e a pagina: list.scrollTop fica em 0 e o ramo nunca dispara — a carta
     clicada fica a vista pelo foco. */
  const list = el.main.querySelector(".tray__list");
  if (current && list instanceof HTMLElement) {
    const acima = current.offsetTop < list.scrollTop;
    const abaixo = current.offsetTop + current.offsetHeight > list.scrollTop + list.clientHeight;
    if (acima || abaixo) current.scrollIntoView({ block: "nearest" });
  }

  /* Persiste apenas quando houver alteracao real no conjunto. */
  if ([...session.readMail].sort().join("|") !== before) persistSeen();
}

/** So os numeros derivados, para o arrasto sobreviver. */
export function refresh() {
  if (el.main.dataset["screen"] === "congress") {
    const input = mesaInput();
    const tally = document.getElementById("tally");
    if (tally) tally.innerHTML = tallyHtml(input);

    for (const party of CATALOG.parties) {
      const slot = el.main.querySelector(`[data-read="${party.id}"]`);
      if (!slot) continue;
      /* Votos do bloco vem consolidados do motor. */
      slot.innerHTML = benchReadHtml({
        party,
        funding: session.orders.funding[party.id] ?? 0,
        votes: input.byBloc[party.id] ?? 0,
        seatPrice: input.seatPrice,
        voting: input.quorum > 0 && input.forecast !== null,
      });
    }
    return;
  }

  if (el.main.dataset["screen"] === "estado") {
    /* Consulta a lei uma unica vez fora do laco. */
    const law = lawNow();

    for (const rule of CATALOG.rules) {
      const level = session.orders.levels[rule.id] ?? rule.initial;
      const band = session.orders.bands[rule.id] ?? law[rule.id];
      const slot = el.main.querySelector(`[data-read="${rule.id}"]`);
      if (slot) slot.innerHTML = programReadHtml({ program: rule, level, ...(band && { band }) });
      const dial = el.main.querySelector(`.dial:has([data-program="${rule.id}"])`);
      if (dial instanceof HTMLElement) {
        dial.dataset["rite"] = riteOf({ ...rule, ...(band ?? {}) }, level);
      }
    }
    return;
  }

  const area = CATALOG.areas.find(item => item.id === session.screen);
  if (!area) return;
  const input = areaInput(area);

  /* Consulta a lei fora do laco para preservar desempenho durante arrasto. */
  const law = lawNow();

  for (const program of input.programs) {
    const band = session.orders.bands[program.id];
    const slot = el.main.querySelector(`[data-read="${program.id}"]`);
    if (slot) {
      slot.innerHTML = programReadHtml({
        program,
        level: session.orders.levels[program.id] ?? program.initial,
        band,
      });
    }

    const lawSlot = el.main.querySelector(`[data-law="${program.id}"]`);
    if (lawSlot && band) {
      lawSlot.innerHTML = lawReadHtml({ program, band: law[program.id] ?? band, asked: band });
    }

    const row = el.main.querySelector(`.law:has([data-band="${program.id}"])`);
    if (row instanceof HTMLElement && band) {
      const now = law[program.id];
      row.dataset["moved"] = String(
        now !== undefined && (band.floor !== now.floor || band.ceiling !== now.ceiling),
      );
    }
  }

  /* Rito atualizado por atributo para nao destruir o elemento em foco. */
  for (const program of input.programs) {
    const dial = el.main.querySelector(`.dial:has([data-program="${program.id}"])`);
    if (dial instanceof HTMLElement) {
      dial.dataset["rite"] = riteOf(
        { ...program, ...(session.orders.bands[program.id] ?? {}) },
        session.orders.levels[program.id] ?? program.initial,
      );
    }
  }

  const pool = document.getElementById("areaPool");
  if (pool) pool.innerHTML = poolHtml(input);

  const outlook = document.getElementById("areaOutlook");
  if (outlook) outlook.innerHTML = outlookHtml(input);

  /* Projecao e corrente sincronizadas com o arrasto da verba. */
  const chain = document.getElementById("areaChain");
  if (chain && input.chain) chain.innerHTML = chainHtml({ chain: input.chain, areas: input.areas });
}

/* ── OS GESTOS ────────────────────────────────────────────────────────────── */

/**
 * Troca de tela com View Transition e fallback direto; callback roda apos termino.
 *
 * @param {() => void} [depois]
 */
export function transition(depois) {
  const start = document.startViewTransition?.bind(document);
  if (!start) {
    paint();
    depois?.();
    return;
  }

  const view = start(paint);

  /* Trata rejeicao em navegacao rapida (48 trocas produziram 46 rejeicoes). */
  view.ready?.catch(() => {});

  /* Garante execucao do callback mesmo em caso de erro na transicao. */
  view.finished
    .catch(() => {})
    .then(() => {
      dressRail();
      depois?.();
    });
}

/* Veste dialogo apos abertura; fechado mede zero e glaze recusa peca menor que 9px. */
export function dressActions() {
  for (const card of document.querySelectorAll("dialog .glass-stage")) {
    if (card instanceof HTMLElement) glaze(card, LEVELS.regular);
  }
  for (const action of document.querySelectorAll(".glass-action")) {
    if (action instanceof HTMLElement) glaze(action, LEVELS.thick);
  }
}

/**
 * @param {HTMLElement} node
 * @param {string} text
 * @param {string} hint
 */
export function label(node, text, hint) {
  /* Preserva elementos internos (.go__label, etc.) do botao de avancar. */
  const own = node.querySelector(".go__label, .action__label");
  if (own) {
    own.textContent = text;
    const note = node.querySelector(".go__hint, .action__hint");
    if (note) note.textContent = hint;
    else if (hint) {
      const small = document.createElement("span");
      small.className = "action__hint";
      small.textContent = hint;
      node.append(small);
    }
    return;
  }
  node.textContent = text;
  if (!hint) return;
  const small = document.createElement("span");
  small.className = "action__hint";
  small.textContent = hint;
  node.append(small);
}

/* Rotulo e preco no botao de avancar; silences conta perguntas urgentes sem travar. */
export function endLabel(/** @type {ReturnType<typeof termOf> | null} */ term_ = null) {
  const term = term_ ?? termOf(session.state, CATALOG);
  /* Trava durante resolving; sem isso a 200ms 3 cliques produziam 1 mes. */
  el.advance.disabled = term.over || session.resolving;

  const quiet = term.over
    ? []
    : silences({
        mail: session.state.mail,
        orders: session.orders.mail,
        month: session.state.month,
      });
  el.advance.dataset["price"] = quiet.length > 0 ? "true" : "";

  label(
    el.advance,
    term.over ? UI.actions.ended : UI.actions.advance,
    /* Rotulo do fim em 166px dispensa legenda (que pedia 194px). */
    term.over
      ? ""
      : quiet.length === 0
        ? `${Math.max(0, MONTHS_PER_TERM - session.state.month)} ${UI.closing.monthsLeft}`
        : /* Conta e nao nomeia a carta (nomear pedia 366px numa coluna de 185px). */
          `${quiet.length} ${quiet.length === 1 ? UI.actions.silenceOne : UI.actions.silenceMany}`,
  );
}
