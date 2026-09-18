/* O TELEFONE — o unico objeto da mesa que INTERROMPE.

   ⭐ ELE TOCA QUANDO UM GRUPO FERVE, e so entao: e a mesma informacao que o parecer escreve na
   linha 4 e que a carta da fervura conta na Caixa — vista em vez de lida. Quem decide se ele
   toca e `boilerOf`, pelo mesmo limiar que a ruptura le; a tela nao tem limiar proprio.

   ⚠ E ELE APONTA, NAO REPETE: o clique abre o Email, onde a carta do grupo ja esta.

   📗 E IMAGEM, como a madeira: `assets/phone.webp` e um telefone de teclas vermelho visto de
   cima, gerado a pedido dele, com os algarismos e o numero assados nela (`assets/CREDITOS.md`).
   ⛔ O VETOR SAIU (a 78 graus e sem cor literal ele destoava das materias de foto), e a FOTO
   DO COMMONS TAMBEM: um Dialog de disco a 65 graus, que mesmo recortado lia como imagem colada.
   A imagem vem em duas copias: a de cima leva as sombras da sala, a de baixo e o halo do toque
   (mesma silhueta em ambar), que so aparece em opacidade — trabalho de compositor. */

import { escapeHtml } from "./html.mjs";
import { UI } from "../strings.mjs";

const PHOTO = "/assets/phone.webp";
/* A medida do arquivo, para o navegador reservar a caixa antes de a foto chegar. */
const SIZE = 'width="720" height="639"';

/* ⛔ OS ALGARISMOS SAIRAM DO DOM: em texto a 9,5px girado 6 graus eles saiam tortos e nao vibravam
   com a foto no toque. Estao assados na imagem, e o numero vem de `UI.phone.number` no assador. */

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
    `</button>`
  );
}
