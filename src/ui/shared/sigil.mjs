/* O SINETE — a cara de uma pessoa, sem inventar um rosto. */

import { escapeHtml } from "./html.mjs";

/* ⚠ AS INICIAIS SAIRAM, e o motivo e do responsavel: "avatar do ministro pode
   ser um icon de pessoa, preto, e se for mulher com cabelo de mulher, padronizado os dois".
   Duas silhuetas, e duas e o teto — nao ha rosto, e um rosto inventado seria a cara de alguem
   que existe (ADR 0003). O disco e claro e a figura e escura: e a mesma leitura do lugar de
   foto vazio do Football Manager, e sobrevive a qualquer cor de fundo atras dela. */
/* ⚠ O RECORTE FOI O DEFEITO, E NAO O DESENHO. `clip-path: circle(13.4px ...)` num SVG que a
   folha escala resolve os 13,4px na caixa RENDERIZADA e nao em unidade de usuario: o recorte
   saia minusculo e cortava cabeca e busto em lascas. Aqui nao ha recorte — a base do busto E
   um arco do proprio disco, entao ela encosta na borda sem ultrapassar.
   ⚠ E A CABECA E UM `<circle>`: escrita como dois arcos de 180 graus ela saiu com os
   `large-arc-flag` inconsistentes e virou uma lente. O elemento nao tem como errar isso. */
const BUSTO = "M7.3 27c0-5.5 4.8-7 10.7-7s10.7 1.5 10.7 7a14 14 0 0 1-21.4 0z";

/* ⚠ O CABELO PRECISA APARECER ABAIXO DA MANDIBULA para a silhueta ler como cabelo: as duas
   figuras sao da mesma cor, entao o que distingue e o CONTORNO. Uma versao mais curta ficou
   como capacete e a cabeca sumiu dentro dela; esta desce ate 22 e deixa as duas mechas
   visiveis contra o disco claro, entre a mandibula e o ombro. */
const CABELO =
  "M18 6.9c-4.4 0-7.5 3.3-7.5 8V22h2.9v-6.7c0-2.7 2.1-4.8 4.6-4.8s4.6 2.1 4.6 4.8V22h2.9v-7.1c0-4.7-3.1-8-7.5-8z";

/**
 * O SINETE DE UMA PESSOA.
 *
 * @param {object} input
 * @param {string} input.name
 * @param {string} input.office o cargo; muda a moldura, e nao a cor
 * @param {number} input.reach a fracao da bancada que ela arrasta, de 0 a 1
 * @param {"f" | "m"} [input.gender] escolhe a silhueta, e nada mais
 * @param {string} [input.role] o arquetipo em uma linha, para o rotulo acessivel
 * @returns {string}
 */
export function sigilHtml({ name, office, reach, gender = "m", role }) {
  /* O ANEL E UM `stroke-dasharray` sobre uma circunferencia, como o arco do plenario — sem
     biblioteca e sem canvas. */
  const ring = 2 * Math.PI * 15;
  const run = ring * Math.min(1, Math.max(0, reach));

  return (
    `<span class="sigil" data-office="${escapeHtml(office)}" role="img" ` +
    `aria-label="${escapeHtml(role ? `${name} — ${role}` : name)}">` +
    `<svg viewBox="0 0 36 36" aria-hidden="true">` +
    `<circle class="sigil__disc" cx="18" cy="18" r="14" />` +
    `<g class="sigil__body">` +
    (gender === "f" ? `<path d="${CABELO}" />` : "") +
    `<circle cx="18" cy="13.6" r="5" />` +
    `<path d="${BUSTO}" />` +
    `</g>` +
    `<circle class="sigil__track" cx="18" cy="18" r="15" fill="none" stroke-width="2" />` +
    /* O ARCO COMECA NO TOPO, e nao a direita: uma medida que nasce em cima lê como
       preenchimento; nascendo a leste, lê como ponteiro de relogio. */
    `<circle class="sigil__reach" cx="18" cy="18" r="15" fill="none" stroke-width="2" ` +
    `transform="rotate(-90 18 18)" ` +
    `stroke-dasharray="${run.toFixed(2)} ${ring.toFixed(2)}" />` +
    `</svg>` +
    `</span>`
  );
}
