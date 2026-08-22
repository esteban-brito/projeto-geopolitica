/* O SINETE — a cara de uma pessoa, sem inventar um rosto. */

import { escapeHtml } from "./html.mjs";

/* Um sinete de 34px com tres letras vira uma mancha: o que se lê de relance e forma, e nao
   texto. */

/**
 * @param {string} name
 * @returns {string}
 */
function initialsOf(name) {
  const words = name.split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * O SINETE DE UMA PESSOA.
 *
 * @param {object} input
 * @param {string} input.name
 * @param {string} input.office o cargo; muda a moldura, e nao a cor
 * @param {number} input.reach a fracao da bancada que ela arrasta, de 0 a 1
 * @param {string} [input.role] o arquetipo em uma linha, para o rotulo acessivel
 * @returns {string}
 */
export function sigilHtml({ name, office, reach, role }) {
  const initials = initialsOf(name);

  /* O ANEL E UM `stroke-dasharray` sobre uma circunferencia, como o arco do plenario — sem
     biblioteca e sem canvas. */
  const ring = 2 * Math.PI * 15;
  const run = ring * Math.min(1, Math.max(0, reach));

  return (
    `<span class="sigil" data-office="${escapeHtml(office)}" role="img" ` +
    `aria-label="${escapeHtml(role ? `${name} — ${role}` : name)}">` +
    `<svg viewBox="0 0 36 36" aria-hidden="true">` +
    `<circle class="sigil__track" cx="18" cy="18" r="15" fill="none" stroke-width="2" />` +
    /* O ARCO COMECA NO TOPO, e nao a direita: uma medida que nasce em cima lê como
       preenchimento; nascendo a leste, lê como ponteiro de relogio. */
    `<circle class="sigil__reach" cx="18" cy="18" r="15" fill="none" stroke-width="2" ` +
    `transform="rotate(-90 18 18)" ` +
    `stroke-dasharray="${run.toFixed(2)} ${ring.toFixed(2)}" />` +
    `</svg>` +
    `<b class="sigil__mark">${escapeHtml(initials)}</b>` +
    `</span>`
  );
}
