/* O RAIL — a navegacao primaria, a esquerda e sempre presente. */

import { escapeHtml } from "./html.mjs";
import { DEFAULT_TREATMENT, UI, titleOf } from "../strings.mjs";

/** @typedef {import("../../data/areas.mjs").Area} Area */

/* Icones em SVG inline, 16px, traco de `currentColor`. */
const ICONS = /** @type {Record<string, string>} */ ({
  cabinet:
    '<rect x="2.5" y="4.5" width="11" height="9" rx="2"/><path d="M6 4.5V3.2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.3"/><path d="M2.5 8.5h11"/>',
  congress: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h7"/><circle cx="12" cy="11.5" r="1.6"/>',
  street:
    '<circle cx="5" cy="5" r="1.8"/><circle cx="11" cy="5" r="1.8"/><path d="M2 13.5c0-2 1.3-3.2 3-3.2s3 1.2 3 3.2M8 13.5c0-2 1.3-3.2 3-3.2s3 1.2 3 3.2"/>',
  backstage:
    '<path d="M8 2.5l5.5 2.8v3.4c0 3-2.3 5-5.5 5.8-3.2-.8-5.5-2.8-5.5-5.8V5.3z"/><path d="M8 7v3"/>',
  /* Uma linha subindo dentro de uma moldura: o placar e uma serie, e nao um cofre. */
  finance:
    '<rect x="2.5" y="2.5" width="11" height="11" rx="3"/><path d="m5 10.5 2.4-2.6 2 1.7 2.6-3"/>',
  treasury: '<rect x="2.5" y="4.5" width="11" height="8" rx="2"/><path d="M10 8.5h3.5"/>',
  /* Um talo com duas folhas para a lavoura, e a silhueta de fabrica para o parque produtivo. */
  agriculture:
    '<path d="M8 13.5V6"/><path d="M8 8.5C8 6 6 4.5 3.5 4.5 3.5 7 5.5 8.5 8 8.5z"/>' +
    '<path d="M8 7.5c0-2.5 2-4 4.5-4 0 2.5-2 4-4.5 4z"/>',
  industry: '<path d="M2.5 13.5h11"/><path d="M3.5 13.5V7l3.5 2.5V7l3.5 2.5V4.5h2v9"/>',
  welfare:
    '<path d="M8 13.5S2.5 10.2 2.5 6.6A2.6 2.6 0 0 1 8 5a2.6 2.6 0 0 1 5.5 1.6c0 3.6-5.5 6.9-5.5 6.9z"/>',
  health: '<path d="M8 3.5v9M3.5 8h9"/><rect x="2.5" y="2.5" width="11" height="11" rx="3"/>',
  education:
    '<path d="M8 3 14.5 6 8 9 1.5 6z"/><path d="M4.5 7.4v3.4c0 .9 1.6 1.7 3.5 1.7s3.5-.8 3.5-1.7V7.4"/>',
  security: '<path d="M8 2.5 13 4.5v4c0 3-2.2 4.6-5 5.5-2.8-.9-5-2.5-5-5.5v-4z"/>',
  opinion: '<path d="M13.5 9a2 2 0 0 1-2 2H6l-3.5 2.5V4.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2z"/>',
  estado: '<path d="M8 2.5 2.5 5.5v1h11v-1z"/><path d="M4 6.5v5M8 6.5v5M12 6.5v5M2 13.5h12"/>',
  graph:
    '<circle cx="4" cy="4.5" r="1.6"/><circle cx="12" cy="6.5" r="1.6"/>' +
    '<circle cx="7" cy="12" r="1.6"/><path d="m5.5 5 5 1.2M11 7.8 8.2 10.7M4.9 6l1.6 4.5"/>',
});

/* Formas genericas para uma area que o catalogo ganhar depois. */
const FALLBACK = '<rect x="2.5" y="2.5" width="11" height="11" rx="3"/>';

/**
 * @param {object} section
 * @param {string} section.key
 * @param {string} section.label
 * @param {boolean} section.ready
 * @param {string} current
 */
function itemHtml({ key, label, ready }, current) {
  const active = ready && key === current;

  const attributes = [
    `class="rail__item${active ? " rail__item--active" : ""}"`,
    'type="button"',
    `data-section="${escapeHtml(key)}"`,
    active ? 'aria-current="page"' : "",
    ready ? "" : `disabled title="${escapeHtml(UI.nav.pending)}"`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    `<li><button ${attributes}>` +
    `<svg class="rail__icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" ` +
    `stroke="currentColor" stroke-width="1.4" stroke-linecap="round" ` +
    `stroke-linejoin="round">${ICONS[key] ?? FALLBACK}</svg>` +
    `<span class="rail__label">${escapeHtml(label)}</span>` +
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
 * @param {string} current chave da secao aberta
 * @param {ReadonlyArray<Area>} areas
 * @returns {string}
 */
export function railNavHtml(current, areas) {
  const cabinet = itemHtml({ key: "cabinet", label: UI.nav.cabinet, ready: true }, current);
  const congress = itemHtml({ key: "congress", label: UI.nav.congress, ready: true }, current);
  const finance = itemHtml({ key: "finance", label: UI.nav.finance, ready: true }, current);

  /* ⚠ A FAZENDA CONTINUA SENDO UMA AREA, e nao um item de primeiro nivel como o plano de tela
     sugeria. */
  const ministries =
    `<li class="rail__group">` +
    `<p class="rail__legend">${escapeHtml(UI.nav.ministries)}</p>` +
    `<ul class="rail__sub">` +
    areas
      /* ⚠ O NOME CURTO MANDA AQUI, e a coluna e a razao: o rail tem 109px de rotulo, e o unico
         nome que nao cabe cortava com reticencia. Ausente, `short` cai no `label`. */
      .map(area =>
        itemHtml({ key: area.id, label: area.short ?? area.label, ready: true }, current),
      )
      .join("") +
    `</ul>` +
    `</li>`;

  const estado = itemHtml({ key: "estado", label: UI.nav.estado, ready: true }, current);

  /* O QUE NAO EXISTE ENTRA DESLIGADO E DIZ QUE ESTA DESLIGADO. */
  const pending = [
    { key: "street", label: UI.nav.street, ready: false },
    { key: "backstage", label: UI.nav.backstage, ready: false },
  ]
    .map(section => itemHtml(section, current))
    .join("");

  const rule = '<li class="rail__rule" aria-hidden="true"></li>';

  return cabinet + congress + finance + rule + ministries + rule + estado + rule + pending;
}
