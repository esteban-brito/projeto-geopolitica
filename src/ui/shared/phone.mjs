/* O TELEFONE — o unico objeto da mesa que INTERROMPE.

   ⭐ ELE TOCA QUANDO UM GRUPO FERVE, e so entao: e a mesma informacao que o parecer escreve na
   linha 4 e que a carta da fervura conta na Caixa — vista em vez de lida. Quem decide se ele
   toca e `boilerOf`, pelo mesmo limiar que a ruptura le; a tela nao tem limiar proprio.

   ⚠ E ELE APONTA, NAO REPETE: o clique abre o Email, onde a carta do grupo ja esta.

   📗 E IMAGEM, como a madeira: `assets/phone.webp` e um telefone de teclas vermelho visto de
   cima, gerado a pedido dele (origem em `assets/CREDITOS.md`), com teclas e cartao em branco.
   ⛔ O VETOR SAIU (a 78 graus e sem cor literal ele destoava das materias de foto), e a FOTO
   DO COMMONS TAMBEM: um Dialog de disco a 65 graus, que mesmo recortado lia como imagem colada.
   A imagem vem em duas copias: a de cima leva as sombras da sala, a de baixo e o halo do toque
   (mesma silhueta em ambar), que so aparece em opacidade — trabalho de compositor. */

import { escapeHtml } from "./html.mjs";
import { UI } from "../strings.mjs";

const PHOTO = "/assets/phone.webp";
/* A medida do arquivo, para o navegador reservar a caixa antes de a foto chegar. */
const SIZE = 'width="720" height="639"';

/* AS DOZE TECLAS, na ordem do teclado: a imagem vem com elas em branco, e o algarismo entra por
   cima, cada um no centro da tecla medida (`46-desk.css`, `.phone__keys`). */
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"]
  .map(key => `<b>${key}</b>`)
  .join("");

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
    `<img class="phone__glow" src="${PHOTO}" alt="" ${SIZE}>` +
    `<img class="phone__photo" src="${PHOTO}" alt="" ${SIZE}>` +
    `<span class="phone__keys">${KEYS}</span>` +
    `<span class="phone__number">${escapeHtml(UI.phone.number)}</span>` +
    `</button>`
  );
}
