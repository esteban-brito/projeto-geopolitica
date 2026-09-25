/* A ATA DA REUNIÃO DO CORTE — a folha da esquerda no mês do relatório bimestral (ciclo 31, E0).
   Ela não calcula nada: o parecer e as posições chegam prontos de `momentOf`. Mostra o que
   cada ministro diz e faz, nunca o que ele pesa por dentro. */

import { escapeHtml } from "./html.mjs";
import { money, percent } from "./format.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../public/index.mjs").Stance} Stance
 * @typedef {import("../../public/index.mjs").Briefing} Briefing
 * @typedef {object} MomentView
 * @property {Briefing} briefing
 * @property {ReadonlyArray<Stance>} stances
 * @property {boolean} closed
 * @property {boolean} [rehearsal]
 */

/**
 * @param {MomentView} moment
 * @param {ReadonlyArray<{ id: string, label: string, short?: string }>} areas
 * @returns {string}
 */
export function momentHtml(moment, areas) {
  /** @param {string | null} id */
  const nameOf = id => areas.find(area => area.id === id)?.label ?? "";
  const { briefing } = moment;
  const even = briefing.demand > 0 ? 1 - briefing.room / briefing.demand : 0;
  const rows = moment.stances
    .filter(stance => stance.kind !== "none")
    .map(stance => {
      const cut = percent(stance.cut);
      const position =
        stance.kind === "protect"
          ? UI.moment.protect(nameOf(stance.area))
          : stance.kind === "contest"
            ? UI.moment.contest(nameOf(stance.target))
            : stance.kind === "satisfied"
              ? UI.moment.satisfied
              : UI.moment.accepts(cut);
      const argument =
        stance.kind === "protect"
          ? UI.moment.loses(cut)
          : stance.kind === "contest"
            ? UI.moment.relieves(cut, percent(stance.relief ?? stance.cut))
            : "";
      const turn = stance.insists
        ? UI.moment.insists
        : stance.refused && stance.kind === "accepts"
          ? UI.moment.afterRefusal
          : "";
      const verdict = !moment.closed
        ? ""
        : stance.kind === "protect" || stance.kind === "contest"
          ? UI.moment.dissents
          : UI.moment.agrees;
      const ask =
        !moment.closed && stance.plan
          ? `<button class="moment__ask" type="button" data-refuse="${escapeHtml(stance.minister)}" data-plan="${escapeHtml(stance.plan)}">${escapeHtml(UI.moment.refuse)}</button>`
          : "";
      return (
        `<li class="moment__row" data-minister="${escapeHtml(stance.minister)}">` +
        `<b>${escapeHtml(stance.name)}</b>, <span>${escapeHtml(nameOf(stance.area))}</span>: ` +
        escapeHtml(moment.closed ? verdict : position) +
        (argument ? `. ${escapeHtml(argument)}` : ".") +
        (turn ? ` ${escapeHtml(turn)}` : "") +
        ask +
        `</li>`
      );
    })
    .join("");

  return (
    `<article class="sheet brief moment" data-signed="true">` +
    `<header class="letterhead">` +
    `<img class="crest" src="/assets/coat-of-arms.webp" alt="">` +
    `<p class="letterhead__org"><b>${escapeHtml(UI.decree.presidency)}</b>` +
    `<span>${escapeHtml(UI.decree.chief)}</span>` +
    `<span>${escapeHtml(UI.moment.kind)}</span></p>` +
    `</header>` +
    `<p class="epigraph">${escapeHtml(UI.moment.title)}</p>` +
    `<div class="act__body brief__body">` +
    `<p>${escapeHtml(UI.moment.treasury(money(briefing.hole), money(briefing.room), percent(even)))}</p>` +
    (briefing.overflow > 0
      ? `<p>${escapeHtml(UI.moment.overflow(money(briefing.overflow)))}</p>`
      : "") +
    (moment.rehearsal ? `<p class="moment__note">${escapeHtml(UI.moment.rehearsal)}</p>` : "") +
    `<ul class="moment__list">${rows}</ul>` +
    `</div>` +
    (moment.closed
      ? ""
      : `<button class="moment__close" type="button" data-close-cut>${escapeHtml(UI.moment.close)}</button>`) +
    `</article>`
  );
}
