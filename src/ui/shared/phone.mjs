/* O TELEFONE — o unico objeto da mesa que INTERROMPE.

   ⭐ ELE TOCA QUANDO UM GRUPO FERVE, e so entao: e a mesma informacao que o parecer escreve na
   linha 4 e que a carta da fervura conta na Caixa — vista em vez de lida. Quem decide se ele
   toca e `boilerOf`, pelo mesmo limiar que a ruptura le; a tela nao tem limiar proprio.

   ⚠ E ELE APONTA, NAO REPETE: o clique abre o Email, onde a carta do grupo ja esta. Escrever
   aqui quem ferveu e por quanto seria a terceira copia da mesma frase.

   📗 A FORMA E A DO TELEFONE VERMELHO DE MESA, referencia dele: base com o teclado de doze
   teclas, o fone deitado no berco atras, o cordao em espiral saindo pela esquerda. Visto de
   cima, como a mesa. ⚠ AS TECLAS NAO TEM NUMERO: a 220px cada uma tem 6px, e numero de 6px e
   texto falso que o medidor de contraste cobraria como texto. */

import { escapeHtml } from "./html.mjs";
import { UI } from "../strings.mjs";

/* O CORDAO: um traco grosso tracejado ao longo de uma curva le como espiral de longe. */
const CORD =
  `<svg class="phone__cord" viewBox="0 0 90 120" aria-hidden="true">` +
  `<path d="M60 8 C 18 14, 6 50, 14 78 S 40 116, 70 112"/>` +
  `</svg>`;

const KEYS = Array.from({ length: 12 }, () => `<i class="phone__key"></i>`).join("");

/**
 * @param {object} input
 * @param {string | null} input.boiling o grupo que ferveu, ou nulo quando nenhum — quando ha
 * mais de um, o primeiro: o telefone toca uma vez so, e a Caixa lista todos
 * @returns {string}
 */
export function phoneHtml({ boiling }) {
  const ringing = boiling !== null;
  return (
    `<button class="phone" type="button" data-section="email" data-ringing="${ringing}"` +
    ` aria-label="${escapeHtml(ringing ? UI.phone.ringing(boiling) : UI.phone.quiet)}">` +
    CORD +
    `<i class="phone__base"></i>` +
    `<i class="phone__keys">${KEYS}</i>` +
    `<i class="phone__label"></i>` +
    `<i class="phone__cradle"></i>` +
    `<i class="phone__handset"></i>` +
    `</button>`
  );
}
