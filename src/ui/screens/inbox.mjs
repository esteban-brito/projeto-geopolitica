/* A CAIXA DE ENTRADA — a primeira carta de verdade. */

import { escapeHtml } from "../shared/html.mjs";
import { iconHtml } from "../shared/icons.mjs";
import { money, percent, seats, signed } from "../shared/format.mjs";
import { sigilHtml } from "../shared/sigil.mjs";
import {
  cardHtml,
  chamberRows,
  lineHtml,
  linesHtml,
  noteHtml,
  rupturesRows,
} from "../shared/annex.mjs";
import { monthLabel } from "../../state/state.mjs";
import { DEFAULT_TREATMENT, UI, addressed, labelOf } from "../strings.mjs";

/**
 * @typedef {object} Dispatch
 * @property {string} id
 * @property {number} month
 * @property {import("../../state/state.mjs").Letter["kind"]} [kind]
 * @property {{ name: string, office: string, label: string, reach: number, gender?: "f" | "m" } | null} from
 * @property {string} subject
 * @property {string} body
 * @property {string | undefined} [annex]
 * @property {string | undefined} [action]
 * @property {string | undefined} [target]
 * @property {string | undefined} [choices]
 * @property {number | null | undefined} [due]
 */

/**
 * @param {number | null | undefined} due
 * @returns {"open" | "soon" | "now" | null}
 */
function urgencyOf(due) {
  if (due === null || due === undefined) return null;
  /* Duas faixas: em 48 meses left devolve 0 ou 1 com prazo de 2 meses. */
  return due <= 0 ? "now" : "soon";
}

/**
 * @param {object} input
 * @param {{ name: string, office: string, label: string, reach: number, gender?: "f" | "m" } | null} input.from
 * @param {string} input.subject
 * @param {string} input.body
 * @param {string} [input.annex]
 * @param {string} [input.action]
 * @param {string} [input.target]
 * @param {string} [input.choices]
 * @param {number | null} [input.due]
 * @param {number | null} [input.month]
 * @returns {string}
 */
export function letterHtml({
  from,
  subject,
  body,
  annex,
  action,
  target,
  choices,
  due = null,
  month = null,
}) {
  const urgency = urgencyOf(due);

  return (
    `<article class="letter"${urgency ? ` data-urgency="${urgency}"` : ""}>` +
    `<header class="letter__head">` +
    (from
      ? sigilHtml({
          name: from.name,
          office: from.office,
          reach: from.reach,
          role: from.label,
          ...(from.gender ? { gender: from.gender } : {}),
        })
      : "") +
    /* Span vazio consumia flex: sem remetente dava 354px de faixa e 15,8% de tinta. */
    (from
      ? `<span class="letter__from">` +
        `<b class="letter__name">${escapeHtml(from.name)}</b>` +
        `<span class="letter__role">${escapeHtml(from.label)}</span>` +
        `</span>`
      : "") +
    /* Data no cabecalho do oficio ao lado da assinatura. */
    `<span class="letter__meta">` +
    (month !== null ? `<span class="letter__date">${escapeHtml(monthLabel(month))}</span>` : "") +
    (urgency ? `<span class="letter__due" data-numeric>${escapeHtml(dueLabel(due))}</span>` : "") +
    `</span>` +
    `</header>` +
    `<h4 class="letter__subject">${escapeHtml(subject)}</h4>` +
    /* Vocativo omitido: "Presidente," fixo custava 20px em toda carta. */
    `<div class="letter__body">${body}</div>` +
    /* Secao 1fr da grade: sem ela o rodape cola no corpo sem anexo. */
    `<section class="letter__annexes">` +
    (annex ? `<div class="annexes">${annex}</div>` : "") +
    `</section>` +
    (choices || (action && target)
      ? `<footer class="letter__foot">` +
        (choices ?? "") +
        (action && target
          ? `<button class="letter__action" type="button" data-section="${escapeHtml(target)}">` +
            `${escapeHtml(action)}</button>`
          : "") +
        `</footer>`
      : "") +
    `</article>`
  );
}

/** @param {number | null} due @returns {string} */
function dueLabel(due) {
  if (due === null) return "";
  if (due <= 0) return UI.inbox.dueNow;
  return `${UI.inbox.dueIn} ${due} ${UI.inbox.month}`;
}

/* Kinds sem prefixo no subject: demand, rupture e siege. */
const DISPATCH_TAG = new Map([
  ["demand", "Exigência"],
  ["rupture", "Ruptura"],
  ["siege", "Cerco"],
]);

/**
 * @param {object} input
 * @param {import("../../state/state.mjs").MonthCard} input.report
 * @param {{ name: string, office: string, label: string, reach: number, gender?: "f" | "m" } | null} input.adviser
 * @returns {Dispatch}
 */
export function describeMonth({ report, adviser }) {
  const judged = report.judged;

  const subject = judged
    ? `${judged.kind === "passed" ? UI.inbox.passed : UI.inbox.rejected}: ${judged.label}`
    : report.bill
      ? `${UI.inbox.filed}: ${report.bill}`
      : UI.report.noBill;

  /** @type {string[]} */
  const lines = [];

  if (report.votes !== null) {
    lines.push(
      `<span>${escapeHtml(UI.inbox.voted)} ` +
        `<b data-numeric>${seats(report.votes)}</b> ` +
        `${escapeHtml(UI.mesa.needs)} <b data-numeric>${seats(report.quorum)}</b></span>`,
    );
  }

  if (report.promisedCost > 0) {
    lines.push(
      `<span>${escapeHtml(UI.report.promised)} ` +
        `<b data-numeric>${money(report.promisedCost)}</b> · ` +
        `${escapeHtml(UI.report.honoured)} ` +
        `<b data-numeric>${money(report.paidCost)}</b></span>`,
    );
  }

  const balance = report.balance;

  /* Mes sem decisao: evita folha em branco com 430px. */
  if (lines.length === 0) lines.push(`<span>${escapeHtml(UI.inbox.quietMonth)}</span>`);

  return {
    id: `month-${report.month}`,
    month: report.month,
    from: adviser,
    /* Sem data repetida no subject: preserva largura na coluna de 208px. */
    subject,
    body: `<div class="letter__lines">${lines.join("")}</div>`,
    annex: balanceAnnex(balance),
    action: UI.inbox.seeMonth,
    target: "congress",
    due: null,
  };
}

/**
 * @param {object} input
 * @param {ReadonlyArray<import("../../state/state.mjs").Letter>} input.mail
 * @param {ReadonlyArray<{ id: string, name: string, office: string, label: string, reach: number, gender?: "f" | "m" }>} input.people
 * @param {(letter: import("../../state/state.mjs").Letter) => number | null} input.left
 * @param {{ mandatory: number, room: number }} input.inherited
 * @param {Record<string, string>} input.answered
 * @param {ReadonlyArray<{ id: string, label: string, reads?: string }>} [input.lobbies]
 * @param {{ price: number, removal: number, seats: number, lobbies?: ReadonlyArray<{ id: string, pressure: number, boil: number, share: number }>, ruptures?: ReadonlyArray<{ id: string, value: number, threshold: number, breaks: string, open: boolean }> }} [input.siege]
 * @param {ReadonlyArray<import("../../state/state.mjs").MonthCard>} [input.months]
 * @param {ReadonlyArray<{ id: string, label: string }>} [input.parties]
 * @param {{ priority: ReadonlyArray<{ id: string, label: string, short: string }>, fiscal: ReadonlyArray<{ id: string, label: string, short: string }>, reform: ReadonlyArray<{ id: string, label: string, short: string }> }} [input.pledges]
 * @param {{ priority: string | null, fiscal: string | null, reform: string | null }} [input.platform]
 * @param {"senhor" | "senhora"} [input.treatment]
 * @param {ReadonlyArray<{ id: string, label: string }>} [input.segments]
 * @param {{ base: number, majority: number, seats: number }} [input.chamber]
 * @returns {Dispatch[]}
 */
export function describeMail({
  mail,
  people,
  left,
  inherited,
  answered,
  lobbies = [],
  siege,
  chamber = { base: 0, majority: 0, seats: 0 },
  months = [],
  segments = [],
  parties = [],
  /* ⚠ COMO O JOGADOR QUER SER TRATADO, e ele escolhe junto com o nome. Sem isto a carta
     dizia "o senhor" em metade das partidas para uma presidenta. Ver `addressed`. */
  treatment = DEFAULT_TREATMENT,
  /* ⚠ AS OPCOES DA POSSE VEM PRONTAS DA FACHADA, e a lista de prioridade e DERIVADA la: as
     tres areas que o pais entrega piores. Monta-la aqui daria uma segunda verdade sobre onde
     o pais esta pior, e ela mentiria no dia em que uma abertura mudasse. */
  pledges = { priority: [], fiscal: [], reform: [] },
  platform = { priority: null, fiscal: null, reform: null },
}) {
  const by = (/** @type {string} */ office) =>
    people.find(person => person.office === office) ?? null;

  const nameOf = (/** @type {string | null} */ id) =>
    lobbies.find(lobby => lobby.id === id)?.label ?? "";

  const cuts = new Set(lobbies.filter(lobby => lobby.reads === "debt").map(lobby => lobby.id));

  return mail
    .map(letter => {
      const subject = letter.subject ?? "";

      const paper = (/** @type {Omit<Dispatch, "id" | "month" | "kind">} */ spec) => ({
        ...spec,
        id: letter.id,
        month: letter.month,
        kind: letter.kind,
      });

      switch (letter.kind) {
        case "posse":
          return paper({
            from: by("chief"),
            subject: addressed(UI.inbox.inauguration, treatment),
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(addressed(UI.inbox.inheritedLead, treatment))}</span>` +
              `</div>` +
              pledgeHtml(
                UI.inbox.pledgePriority,
                "priority",
                pledges.priority,
                platform.priority ?? "",
              ) +
              pledgeHtml(UI.inbox.pledgeFiscal, "fiscal", pledges.fiscal, platform.fiscal ?? "") +
              pledgeHtml(UI.inbox.pledgeReform, "reform", pledges.reform, platform.reform ?? ""),
            annex: linesHtml(
              addressed(UI.inbox.blockInherited, treatment),
              lineHtml({
                who: UI.inbox.inheritedMandatory,
                value: money(inherited.mandatory),
              }) + lineHtml({ who: UI.cabinet.vaultFree, value: money(inherited.room) }),
            ),
            action: UI.inbox.seeMonth,
            target: "congress",
          });

        case "tabled":
          return paper({
            from: by("speaker"),
            subject: `${UI.inbox.tabled}: ${subject}`,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.tabledBody)}</span></div>`,
          });

        case "reported":
          return paper({
            from: by("rapporteur"),
            subject: `${UI.inbox.reported}: ${subject}`,
            due: left(letter),
            body:
              `<div class="letter__lines">` +
              (letter.saved
                ? `<span>${escapeHtml(UI.inbox.reportedSaved)} ` +
                  `<b>${escapeHtml(letter.saved)}</b></span>`
                : "") +
              `<span>${escapeHtml(outcomeOf(letter))}</span>` +
              `</div>`,
            choices:
              letter.answer === null
                ? choicesHtml(letter.id, answered[letter.id] ?? "")
                : undefined,
          });

        case "demand": {
          const cutting = cuts.has(letter.from ?? "");
          /* Escape no renderizador: evita &amp; em nomes com &. */
          const groupName = nameOf(letter.from) || "";

          return paper({
            from: null,
            subject: groupName ? `${groupName}: ${subject}` : subject,
            due: left(letter),
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(cutting ? UI.inbox.demandCutBody : UI.inbox.demandBody)} ` +
              `<b data-numeric>${seats(letter.level ?? 0)}</b></span>` +
              `<span>${escapeHtml(outcomeOf(letter))}</span>` +
              `</div>`,
            /* Bloco de grupo: evita 374px de papel em branco sem dados da caldeira. */
            annex: groupBlock(siege, letter.from),
            choices:
              letter.answer === null
                ? choicesHtml(
                    letter.id,
                    answered[letter.id] ?? "",
                    cutting ? UI.inbox.demandCutChoices : UI.inbox.demandChoices,
                  )
                : undefined,
          });
        }

        case "forgotten":
          return paper({
            from: null,
            subject: `${UI.inbox.forgotten}: ${subject}`,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.forgottenBody)}</span></div>`,
          });

        /* Folha em branco: corpo vazio gerava 430px sem conteudo. */
        case "passed":
        case "rejected":
          return paper({
            from: null,
            subject: `${letter.kind === "passed" ? UI.inbox.passedBill : UI.inbox.rejectedBill}: ${subject}`,
            body:
              `<div class="letter__lines"><span>` +
              `${escapeHtml(letter.kind === "passed" ? UI.inbox.passedBillBody : UI.inbox.rejectedBillBody)}` +
              `</span></div>`,
            annex: plenaryBlock(months, letter.month),
            action: letter.kind === "passed" ? UI.inbox.passedBillAction : undefined,
            target: letter.kind === "passed" ? "estado" : undefined,
          });

        case "street":
        case "seats":
        case "vault":
          return paper({
            from: by("chief"),
            subject: headlineOf(letter),
            body: reportBody(letter, segments, chamber, treatment),
            annex: annexHtml(letter, segments, parties),
          });

        case "ceiling":
          return paper({
            from: by("chief"),
            subject: UI.inbox.ceilingSubject,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.ceilingBody)}</span></div>`,
            annex: linesHtml(
              addressed(UI.inbox.blockInherited, treatment),
              lineHtml({ who: UI.inbox.ceilingNote, value: money(inherited.room) }),
            ),
          });

        case "contingency":
          return paper({
            from: by("chief"),
            subject: UI.inbox.contingencySubject,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.contingencyBody)}</span></div>`,
            annex: linesHtml(
              UI.inbox.contingencyLegend,
              lineHtml({ who: UI.inbox.contingencyNote, value: `${letter.now ?? 0}%` }),
            ),
          });

        case "minority":
          return paper({
            from: by("leader"),
            subject: UI.inbox.minoritySubject,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.minorityBody)}</span>` +
              `</div>`,
            /* Alarme de minoria usa numero da carta: do estado variava 229 para 227. */
            annex: chamberBlock(
              letter.now ?? chamber.base,
              letter.was ?? chamber.majority,
              chamber.seats,
            ),
            action: UI.cabinet.congressAction,
            target: "congress",
          });

        case "boiling": {
          const group = (siege?.lobbies ?? []).find(item => item.id === subject) ?? null;
          return paper({
            from: by("chief"),
            subject: `${UI.inbox.boilingSubject} ${nameOf(subject) || subject}`,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.boilingBody)}</span>` +
              `</div>`,
            /* Pressao do dia da fervura: lido de hoje variava 70 para 75 um mes depois. */
            ...(group
              ? { annex: groupBlock(siege, subject, letter.now ?? null, letter.was ?? null) }
              : {}),
          });
        }

        case "rupture":
          return paper({
            from: by("chief"),
            subject: ruptureText(UI.inbox.ruptureSubject, subject) ?? UI.inbox.ruptureFallback,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(addressed(ruptureText(UI.inbox.ruptureBody, subject) ?? "", treatment))}</span>` +
              `</div>`,
            /* Rupturas em bloco: processo pede as tres; isolada deixava 367px em branco. */
            annex: rupturesBlock(siege) + noteHtml(UI.inbox.ruptureLegend, UI.inbox.ruptureNote),
          });

        case "siege":
          return paper({
            from: by("chief"),
            subject: UI.inbox.siegeSubject,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.siegeBody)}</span></div>`,
            /* Valores de afastamento, cadeiras e preco vem do motor. */
            ...(siege
              ? {
                  annex: linesHtml(
                    UI.inbox.blockProcess,
                    lineHtml({ who: UI.inbox.siegeVote, value: seats(siege.removal) }) +
                      lineHtml({ who: UI.inbox.siegeOf, value: seats(siege.seats) }) +
                      lineHtml({ who: UI.inbox.siegePrice, value: `${seats(siege.price)}×` }),
                  ),
                }
              : {}),
            action: UI.inbox.siegeAction,
            target: "congress",
          });

        default:
          return null;
      }
    })
    .filter(part => part !== null);
}

/**
 * @param {Record<string, string>} texts
 * @param {string} id
 * @returns {string | undefined}
 */
function ruptureText(texts, id) {
  return Object.hasOwn(texts, id) ? texts[id] : undefined;
}

/** @param {import("../../state/state.mjs").Letter} letter @returns {string} */
function outcomeOf(letter) {
  /* Chantagem: silencio recusa, ao contrario da tramitacao onde aprova. */
  const spurns = letter.kind === "demand";

  switch (letter.answer) {
    case "accept":
      return spurns ? UI.inbox.conceded : UI.inbox.accepted;
    case "block":
      return spurns ? UI.inbox.refused : UI.inbox.blocked;
    case "silence":
      return spurns ? UI.inbox.refused : UI.inbox.silenced;
    default:
      return spurns ? UI.inbox.spiteWarns : UI.inbox.silenceWarns;
  }
}

/**
 * AS DUAS SAIDAS, e nenhuma e de graca.
 *
 * @param {string} id
 * @param {string} chosen o que ja esta marcado, se algo estiver
 * @returns {string}
 */
function choicesHtml(id, chosen, texts = UI.inbox.amendmentChoices) {
  const button = (
    /** @type {string} */ answer,
    /** @type {string} */ label,
    /** @type {string} */ cost,
  ) =>
    `<button class="letter__choice" type="button" ` +
    `aria-pressed="${chosen === answer}" ` +
    `data-letter="${escapeHtml(id)}" data-answer="${escapeHtml(answer)}">` +
    `<b>${escapeHtml(label)}</b>` +
    `<span class="letter__cost">${escapeHtml(cost)}</span>` +
    `</button>`;

  return (
    `<div class="letter__choices">` +
    button("accept", texts.accept, texts.acceptCost) +
    button("block", texts.block, texts.blockCost) +
    `</div>`
  );
}

/**
 * @param {string} legend
 * @param {string} axis
 * @param {ReadonlyArray<{ id: string, label: string, short: string }>} options
 * @param {string} chosen
 * @returns {string}
 */
function pledgeHtml(legend, axis, options, chosen) {
  const buttons = options
    .map(
      option =>
        `<button class="letter__choice" type="button" ` +
        `aria-label="${escapeHtml(option.label)}" ` +
        `aria-pressed="${chosen === option.id}" ` +
        `data-pledge="${escapeHtml(axis)}" data-choice="${escapeHtml(option.id)}">` +
        /* Classe propria: icon sem tamanho esticava SVG a 96px sobre o texto. */
        (axis === "priority" ? iconHtml(option.id, "pledge__icon") : "") +
        `<b>${escapeHtml(option.short)}</b>` +
        `</button>`,
    )
    .join("");

  return (
    `<div class="letter__pledge">` +
    `<span class="letter__axis">${escapeHtml(legend)}</span>` +
    `<div class="letter__choices">${buttons}</div>` +
    `</div>`
  );
}

/**
 * @param {Dispatch} dispatch
 * @param {boolean} open
 * @param {boolean} read
 * @returns {string}
 */
function rowHtml(dispatch, open, read) {
  const urgency = urgencyOf(dispatch.due);

  return (
    `<li>` +
    `<button class="tray__row" type="button" ` +
    `data-dispatch="${escapeHtml(dispatch.id)}"` +
    /* Tarja da esquerda exclusiva para prazo. */
    (urgency ? ` data-urgency="${urgency}"` : "") +
    (open ? ` aria-current="true"` : "") +
    (read ? "" : ` data-unread="true"`) +
    `>` +
    `<b class="tray__subject">${escapeHtml(dispatch.subject)}</b>` +
    `<span class="tray__line">` +
    (dispatch.from ? `<span class="tray__from">${escapeHtml(dispatch.from.name)}</span>` : "") +
    /* Tag de especie nos tres kinds sem prefixo no assunto. */
    (dispatch.kind && DISPATCH_TAG.has(dispatch.kind)
      ? ` <span class="tray__kind">${escapeHtml(DISPATCH_TAG.get(dispatch.kind))}</span>`
      : "") +
    (urgency
      ? `<span class="tray__due" data-numeric>${escapeHtml(dueLabel(dispatch.due ?? null))}</span>`
      : "") +
    `</span>` +
    `</button>` +
    `</li>`
  );
}

/** @param {ReadonlyArray<Dispatch>} dispatches @returns {Dispatch[]} */
function sorted(dispatches) {
  return [...dispatches].sort((a, b) => b.month - a.month);
}

/**
 * @param {import("../../state/state.mjs").Letter} letter
 * @param {ReadonlyArray<{ id: string, label: string }>} segments
 * @param {{ base: number, majority: number, seats: number }} chamber
 * @returns {string}
 */
function reportBody(
  letter,
  segments,
  chamber,
  /** @type {"senhor" | "senhora"} */ treatment = DEFAULT_TREATMENT,
) {
  const was = letter.was ?? 0;
  const now = letter.now ?? 0;
  const moved = Math.abs(now - was);
  const way = now >= was ? UI.inbox.pollUp : UI.inbox.pollDown;

  /** @param {string} text */
  const line = text => `<span>${text}</span>`;

  if (letter.kind === "seats") {
    return (
      `<div class="letter__lines">` +
      line(
        `${escapeHtml(UI.inbox.seatsBody)} <b data-numeric>${seats(now)}</b> ` +
          `${escapeHtml(UI.inbox.of)} <b data-numeric>${seats(chamber.seats)}</b>` +
          `${escapeHtml(UI.inbox.seatsMajority)} ` +
          `<b data-numeric>${seats(chamber.majority)}</b>. ` +
          `<b data-numeric>${seats(moved)}</b> ` +
          /* Unidade em cadeiras, distinguindo de pontos percentuais de pesquisa. */
          `${escapeHtml(moved === 1 ? UI.inbox.seat : UI.inbox.seats)} ` +
          `${escapeHtml(way)}`,
      ) +
      line(escapeHtml(addressed(UI.inbox.seatsHint, treatment))) +
      `</div>`
    );
  }

  if (letter.kind === "vault") {
    return (
      `<div class="letter__lines">` +
      line(
        `${escapeHtml(UI.inbox.vaultBody)} <b data-numeric>${money(now)}</b>, ` +
          `${escapeHtml(way.replace(".", ""))} <b data-numeric>${money(was)}</b>.`,
      ) +
      line(escapeHtml(UI.inbox.vaultHint)) +
      `</div>`
    );
  }

  /* Manchete isolada: analise detalhada desce para os cards anexos. */
  return (
    `<div class="letter__lines">` +
    line(
      `${escapeHtml(UI.inbox.pollClosed)} <b data-numeric>${seats(now)}%</b> ` +
        `${escapeHtml(UI.inbox.pollGood)} — <b data-numeric>${seats(moved)}</b> ` +
        `${escapeHtml(moved === 1 ? UI.inbox.pollPoint : UI.inbox.pollPoints)} ` +
        `${escapeHtml(way)}`,
    ) +
    `</div>`
  );
}

/**
 * @param {Record<string, number>} data
 * @param {ReadonlyArray<{ id: string, label: string }>} segments
 * @returns {string}
 */
function pollCards(data, segments) {
  const notes = ANNEX_NOTES;

  /* Sustentacao ponderada pelo peso da classe. */
  let holds = null;
  for (const segment of segments) {
    for (const note of notes) {
      const value = data[`${segment.id}.${note}`] ?? 0;
      if (!holds || value > holds.value) holds = { value, note, segment: segment.label };
    }
  }

  let weakest = null;
  for (const note of notes) {
    const total = segments.reduce((sum, s) => sum + (data[`${s.id}.${note}`] ?? 0), 0);
    if (!weakest || total < weakest.total) weakest = { total, note };
  }

  return (
    (holds
      ? cardHtml(
          /* Rotulo sem vocativo: evita quebra em duas linhas e desalinhamento. */
          UI.inbox.pollHolds,
          `<b>${escapeHtml(labelOf(UI.inbox.annexNote, holds.note))}</b>` +
            `<small>${escapeHtml(holds.segment)}</small>`,
        )
      : "") +
    (weakest
      ? cardHtml(
          UI.inbox.pollDrags,
          `<b>${escapeHtml(labelOf(UI.inbox.annexNote, weakest.note))}</b>`,
        )
      : "")
  );
}

/** @param {import("../../state/state.mjs").Letter} letter @returns {string} */
function headlineOf(letter) {
  const was = letter.was ?? 0;
  const now = letter.now ?? 0;
  const way = now >= was ? "rose" : "fell";
  const verb = labelOf(UI.inbox.headline, `${letter.kind}.${way}`);

  if (letter.kind === "seats") return `${verb} ${seats(now)} ${UI.inbox.headlineSeats}`;
  if (letter.kind === "vault") return `${verb} ${money(now)}`;
  return `${verb} ${seats(now)}%`;
}

const ANNEX_NOTES = /** @type {const} */ (["prices", "jobs", "services", "safety", "economy"]);

/**
 * @param {{ lobbies?: ReadonlyArray<{ id: string, pressure: number, boil: number, share: number }> } | undefined} siege
 * @param {string | null} id
 * @param {number | null} [pressure]
 * @param {number | null} [boil]
 * @returns {string}
 */
function groupBlock(siege, id, pressure = null, boil = null) {
  const group = (siege?.lobbies ?? []).find(item => item.id === id) ?? null;
  if (!group) return "";

  /* Pressao da data gravada: evita salto de 70 para 75 no mes seguinte. */
  const now = pressure ?? group.pressure;
  const point = boil ?? group.boil;

  return linesHtml(
    UI.inbox.blockGroup,
    lineHtml({
      who: UI.inbox.boilingPressure,
      value: seats(now),
      share: point > 0 ? (now / point) * 100 : 0,
      note: `${UI.inbox.boilingNote} ${seats(point)}`,
    }) +
      lineHtml({
        who: UI.inbox.boilingWeight,
        value: group.share > 0 ? percent(group.share) : UI.inbox.boilingNoWeight,
        ...(group.share > 0 ? { share: group.share * 100 } : {}),
      }),
  );
}

/**
 * O QUE FALTA PARA CADA RUPTURA ABRIR — as mesmas linhas que a coluna do Gabinete mostra.
 *
 * @param {{ ruptures?: ReadonlyArray<{ id: string, value: number, threshold: number,
 * breaks: string, open: boolean }> } | undefined} siege
 * @returns {string}
 */
function rupturesBlock(siege) {
  const ruptures = siege?.ruptures ?? [];
  if (ruptures.length === 0) return "";

  return linesHtml(UI.inbox.blockRuptures, rupturesRows(ruptures));
}

/**
 * @param {ReadonlyArray<import("../../state/state.mjs").MonthCard>} months
 * @param {number} month
 * @returns {string}
 */
function plenaryBlock(months, month) {
  const card = months.find(item => item.month === month) ?? null;
  if (!card || card.votes === null) return "";

  const gap = card.votes - card.quorum;
  const top = Math.max(card.votes, card.quorum, 1);

  return linesHtml(
    UI.inbox.blockPlenary,
    lineHtml({
      who: UI.inbox.blockVotes,
      value: seats(card.votes),
      share: (card.votes / top) * 100,
    }) +
      lineHtml({
        who: UI.inbox.blockQuorum,
        value: seats(card.quorum),
        share: (card.quorum / top) * 100,
      }) +
      lineHtml({
        who: gap < 0 ? UI.inbox.blockMissed : UI.inbox.blockSpare,
        value: seats(Math.abs(gap)),
      }),
  );
}

/**
 * @param {number} base
 * @param {number} majority
 * @param {number} seatsTotal
 * @returns {string}
 */
function chamberBlock(base, majority, seatsTotal) {
  return linesHtml(UI.inbox.blockChamber, chamberRows(base, majority, seatsTotal));
}

/** @param {Record<string, number>} data @returns {string} */
function vaultAnnex(data) {
  const keys = ["revenue", "mandatory", "ceiling", "allowance"];
  const top = Math.max(...keys.map(key => Math.abs(data[key] ?? 0)), 1);

  return linesHtml(
    UI.inbox.annexVault,
    keys
      .map(key =>
        lineHtml({
          who: labelOf(UI.inbox.annexVaultRow, key),
          value: money(data[key] ?? 0),
          share: (Math.abs(data[key] ?? 0) / top) * 100,
        }),
      )
      .join(""),
  );
}

/** @param {import("../../application/turn.mjs").Balance} balance @returns {string} */
function balanceAnnex(balance) {
  /* Variacao zero omitida: signed(0) gerava "21% 0" lido como numero unico. */
  const moved = (/** @type {number} */ value, /** @type {number} */ digits = 0) =>
    Number(value.toFixed(digits)) === 0 ? "" : signed(value, digits);

  const rows = [
    {
      key: "street",
      value: `${seats(balance.streetNow)}%`,
      note: moved(balance.streetNow - balance.streetWas),
    },
    {
      key: "seats",
      value: seats(balance.seatsNow),
      note: moved(balance.seatsNow - balance.seatsWas),
    },
    {
      key: "vault",
      value: money(balance.roomNow),
      note: moved(balance.roomNow - balance.roomWas, 1),
    },
  ];

  return linesHtml(
    UI.inbox.annexBalance,
    rows
      .map(row =>
        lineHtml({
          who: labelOf(UI.inbox.annexBalanceRow, row.key),
          value: row.value,
          note: row.note,
        }),
      )
      .join(""),
  );
}

/* Maximo de bancadas exibidas na carta: detalhamento completo fica no Congresso. */
const SEATS_SHOWN = 4;

/**
 * @param {Record<string, number>} data
 * @param {ReadonlyArray<{ id: string, label: string }>} parties
 * @returns {string}
 */
function seatsAnnex(data, parties) {
  const moved = parties
    .map(party => ({
      label: party.label,
      seats: data[`${party.id}.seats`] ?? 0,
      move: (data[`${party.id}.now`] ?? 0) - (data[`${party.id}.was`] ?? 0),
    }))
    .filter(row => Math.abs(row.move) >= 0.5)
    .sort((a, b) => Math.abs(b.move) - Math.abs(a.move));

  if (moved.length === 0) return "";

  const shown = moved.slice(0, SEATS_SHOWN);
  const rest = moved.slice(SEATS_SHOWN);

  /* Normalizado pela maior variacao exibida: evita tracos de 2 a 10px na escala de 100. */
  const deepest = Math.max(
    ...shown.map(row => (row.seats > 0 ? Math.abs(row.move) / row.seats : 0)),
    Number.EPSILON,
  );

  const lines = shown
    .map(row =>
      lineHtml({
        who: row.label,
        value: signed(row.move),
        /* Movimento relativo a propria bancada: 2 de 14 e ruptura; 2 de 80 e ruido. */
        share: row.seats > 0 ? (Math.abs(row.move) / row.seats / deepest) * 100 : 0,
        note: `${UI.inbox.of} ${seats(row.seats)}`,
      }),
    )
    .join("");

  /* Saldo restante explicitado: evita mascarar total de partidos que moveram. */
  const tail =
    rest.length === 0
      ? ""
      : lineHtml({
          who: `${UI.inbox.annexSeatsRest} ${seats(rest.length)}`,
          value: signed(rest.reduce((total, row) => total + row.move, 0)),
        });

  return linesHtml(UI.inbox.annexSeats, lines + tail);
}

/**
 * @param {import("../../state/state.mjs").Letter} letter
 * @param {ReadonlyArray<{ id: string, label: string }>} segments
 * @param {ReadonlyArray<{ id: string, label: string }>} parties
 * @returns {string}
 */
function annexHtml(letter, segments, parties) {
  const data = letter.attach;
  if (!data) return "";

  if (letter.kind === "vault") return vaultAnnex(data);
  if (letter.kind === "seats") return seatsAnnex(data, parties);
  if (segments.length === 0) return "";

  const lines = segments
    .map(segment => {
      const values = ANNEX_NOTES.map(note => ({ note, value: data[`${segment.id}.${note}`] ?? 0 }));
      const mood = values.reduce((total, item) => total + item.value, 0);
      const top = values.reduce(
        (best, item) => (best && item.value > best.value ? item : (best ?? item)),
        values[0],
      );

      return lineHtml({
        who: segment.label,
        value: seats(mood),
        share: mood,
        note: top ? labelOf(UI.inbox.annexNote, top.note) : "",
      });
    })
    .join("");

  /* Descontos em bloco separado sem barra: 7 pontos em 100 liam como traco insignificante. */
  const discounts = [
    { key: "betrayal", value: data.betrayal ?? 0 },
    { key: "wear", value: data.wear ?? 0 },
  ].filter(row => row.value >= 0.5);

  return (
    pollCards(data, segments) +
    linesHtml(UI.inbox.annexLegend, lines) +
    (discounts.length === 0
      ? ""
      : linesHtml(
          UI.inbox.annexDiscounts,
          discounts
            .map(row =>
              lineHtml({
                who: labelOf(UI.inbox.annexDiscount, row.key),
                value: signed(-row.value),
              }),
            )
            .join(""),
        ))
  );
}

/**
 * @param {object} input
 * @param {ReadonlyArray<Dispatch>} input.dispatches
 * @param {string | null} input.open
 * @param {ReadonlyArray<string>} [input.seen]
 * @returns {string}
 */
export function trayHtml({ dispatches, open, seen = [] }) {
  if (dispatches.length === 0) return "";

  const ordered = sorted(dispatches);
  /* Lista completa sem corte fixo em 7: absorvido por rolagem em .tray__list. */
  const current = ordered.find(item => item.id === open) ?? ordered[0];
  if (!current) return "";

  const read = new Set(seen);

  return (
    `<div class="tray">` +
    `<h2 class="tray__head annex__legend">${escapeHtml(UI.inbox.title)}</h2>` +
    `<ul class="tray__list">` +
    ordered
      .map((item, index) => {
        const before = ordered[index - 1];
        /* Divisor mensal unico: evita quebra na cronologia do calendario. */
        const divider =
          !before || before.month !== item.month
            ? `<li class="tray__month">${escapeHtml(monthLabel(item.month))}</li>`
            : "";
        return (
          divider +
          rowHtml(item, item.id === current.id, read.has(item.id) || item.id === current.id)
        );
      })
      .join("") +
    `</ul>` +
    `<div class="tray__open">${letterHtml({ ...current, month: current.month })}</div>` +
    `</div>`
  );
}
