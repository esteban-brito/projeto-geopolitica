/* A CABECA DE UMA TELA — a mesma em todas elas. */

import { escapeHtml } from "./html.mjs";

/**
 * @param {object} input
 * @param {string} input.title o nome dela, e ele e sempre um nome
 * @param {{ label: string, value: string }} [input.reading] o que ela diz de si
 * agora. `value` entra como HTML ja montado, porque em duas telas ele carrega
 * marcacao — a escada de tendencia e o tom do veredito.
 * @returns {string}
 */
export function headHtml({ title, reading }) {
  return (
    `<div class="area__head">` +
    `<div>` +
    `<p class="area__value">${escapeHtml(title)}</p>` +
    `</div>` +
    (reading
      ? `<div class="head__reading">` +
        `<p class="head__label">${escapeHtml(reading.label)}</p>` +
        reading.value +
        `</div>`
      : "") +
    `</div>`
  );
}
