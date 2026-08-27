/* O FECHO DO MANDATO — a última tela, e ela é a mesma nas duas saídas. */

import { escapeHtml } from "../shared/html.mjs";
import { num, percent, signed } from "../shared/format.mjs";
import { headHtml } from "../shared/head.mjs";
import { DEFAULT_TREATMENT, UI, addressed } from "../strings.mjs";
import { monthLabel } from "../../state/state.mjs";

/** @typedef {import("../../application/turn.mjs").Term} Term */

/**
 * UMA LINHA DE RUBRICA: o que é, quanto era, quanto ficou, e o quanto andou.
 *
 * @param {object} input
 * @param {string} input.label
 * @param {string} input.note o que o número mede
 * @param {string} input.from
 * @param {string} input.to
 * @param {number} input.delta
 * @param {boolean} [input.rising] se subir é bom; `true` por omissão
 * @returns {string}
 */
function rowHtml({ label, note, from, to, delta, rising = true }) {
  const good = delta === 0 ? "flat" : delta > 0 === rising ? "up" : "down";
  return (
    `<div class="closing__row" data-direction="${good}">` +
    `<span class="closing__label">${escapeHtml(label)}` +
    `<small>${escapeHtml(note)}</small></span>` +
    `<span class="closing__from" data-numeric>${escapeHtml(from)}</span>` +
    `<span class="closing__arrow" aria-hidden="true">→</span>` +
    `<span class="closing__to" data-numeric>${escapeHtml(to)}</span>` +
    `<span class="closing__delta" data-numeric>${escapeHtml(signed(delta))}</span>` +
    `</div>`
  );
}

/**
 * O FECHO INTEIRO.
 *
 * @param {Term} term o mandato, perguntado a `termOf`
 * @returns {string}
 */
export function closingHtml(
  term,
  /** @type {"senhor" | "senhora"} */ treatment = DEFAULT_TREATMENT,
) {
  const removed = term.ending === "removed";
  const copy = UI.closing;

  /* ⚠ A DATA É DO MÊS EM QUE ACABOU, e não do mês corrente. */
  const when = monthLabel(term.months);

  const areas = term.areas
    .map(area =>
      rowHtml({
        label: area.label,
        note: area.index,
        from: num(area.from, 0),
        to: num(area.to, 0),
        delta: Math.round(area.to - area.from),
      }),
    )
    .join("");

  const debt = rowHtml({
    label: copy.debt,
    note: copy.debtNote,
    from: percent(term.debt.from),
    to: percent(term.debt.to),
    delta: Math.round((term.debt.to - term.debt.from) * 100),
    /* SUBIR É RUIM AQUI, e é a única linha do fecho em que é. */
    rising: false,
  });

  /* ⚠ AS LEIS SÃO CONTADAS E NOMEADAS, e as duas coisas importam. */
  const laws = term.laws.length
    ? `<ol class="closing__laws">` +
      term.laws
        .map(
          law =>
            `<li><span class="closing__law">${escapeHtml(law.label)}</span>` +
            `<span class="closing__when">${escapeHtml(monthLabel(law.month))}</span></li>`,
        )
        .join("") +
      `</ol>`
    : /* ⚠ AUSÊNCIA DECLARADA, e não ausência disfarçada — a distinção é regra do
         projeto e ela tem lugar aqui: um mandato sem uma lei escrita é um fato
         sobre o governo, e não uma falha da tela. E ela usa a MESMA peça de
         ausência do resto do jogo, no peso discreto: o fecho é um documento, e um
         fato consumado dentro dele não pede chamada centrada. */
      `<div class="empty empty--quiet"><p class="empty__note">` +
      `${escapeHtml(addressed(copy.noLaws, treatment))}</p></div>`;

  const abandoned = term.abandoned.length
    ? `<p class="closing__abandoned">${escapeHtml(copy.abandoned)} ` +
      `<b>${escapeHtml(term.abandoned.join(", "))}</b></p>`
    : `<p class="closing__abandoned">${escapeHtml(copy.noneAbandoned)}</p>`;

  return (
    `<section class="stage closing">` +
    headHtml({
      title: copy.title,
      reading: { label: copy.months, value: `${term.months} de ${escapeHtml(term.of)}` },
    }) +
    `<p class="closing__stamp"><b class="stamp">${escapeHtml(
      removed ? copy.removed : copy.served,
    )}</b> ` +
    `${escapeHtml(removed ? copy.removedNote : copy.servedNote)} — ` +
    `<time datetime="${escapeHtml(monthLabel(term.months))}">${escapeHtml(when)}</time></p>` +
    `<h3 class="block__legend">${escapeHtml(addressed(copy.country, treatment))}</h3>` +
    `<div class="closing__rows">` +
    rowHtml({
      label: copy.approval,
      note: copy.approvalNote,
      from: `${num(term.approval.from, 0)}%`,
      to: `${num(term.approval.to, 0)}%`,
      delta: Math.round(term.approval.to - term.approval.from),
    }) +
    debt +
    areas +
    `</div>` +
    /* ⚠ A LEGENDA E A MESMA DE TODA TELA, e o fecho tinha a propria ate ela ser a DECIMA
       forma de legenda do jogo. */
    `<h3 class="block__legend">${escapeHtml(copy.written)} ` +
    `<span class="closing__count">${term.laws.length}</span></h3>` +
    laws +
    abandoned +
    `</section>`
  );
}
