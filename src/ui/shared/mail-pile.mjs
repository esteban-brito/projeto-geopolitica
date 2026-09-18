/* AS CARTAS DO MES — um punhado jogado no canto da mesa.

   ⛔ A TELA NAO CONTA PRAZO POR FORA. Escrever `left(carta) <= 0` aqui e a familia de defeito
   mais cara deste projeto, com sete ocorrencias medidas: a view refaz a conta do motor, as
   duas concordam hoje e divergem no dia da primeira mudanca. Quem decide o que vence e
   `silences`, e ela chega pronta.

   📗 A FORMA E A DE UM ENVELOPE DE CONVITE, medida na foto de referencia pelos quatro cantos:
   proporcao 1,504 na foto e 1,42 real — a camera olha de cima e comprime a altura —, o bico da
   aba a 55% e o lacre com 19,3% da largura.

   ⭐ E A LUZ E CALCULADA, e nao pintada: o domo da cera sai de `feSpecularLighting` com ponto
   de luz sobre a propria silhueta. Gradiente desenhado a mao produziu um botao de plastico. */

import { UI } from "../strings.mjs";

/* ONDE CAI CADA CARTA, em fracao do espalhamento a partir do centro do canto.
   ⚠ A TABELA E FIXA E NAO SORTEADA: o dominio nao tem `Math.random`, e um punhado que muda de
   lugar a cada repintura leria como a mesa tremendo. */
/** @type {ReadonlyArray<{ x: number, y: number, r: number }>} */
const FALL = [
  { x: -0.38, y: 0.12, r: -14 },
  { x: 0.28, y: -0.3, r: 11 },
  { x: -0.04, y: 0.46, r: 4 },
  { x: 0.44, y: 0.34, r: 23 },
  { x: -0.5, y: -0.34, r: -7 },
  { x: 0.12, y: -0.62, r: -25 },
  { x: 0.54, y: -0.02, r: 17 },
  { x: -0.28, y: -0.72, r: 30 },
];

/* ⛔ O LACRE, AS ABAS E OS DOIS FILTROS DE CERA SAIRAM COM A FOTO. Eram um `<svg>` de quatro
   peças com `feTurbulence`, `feDisplacementMap` e `feSpecularLighting`, mais três `<div>` de
   aba recortada. Ordem dele: "todos os elementos de cima da mesa serao coisas reais, imagens
   por IA". A cera, a dobra e o grão vêm na foto, e vêm de verdade. */

/**
 * O PUNHADO — todas iguais, e so a cor separa os dois estados.
 *
 * ⚠ ELE MOSTRA O QUE CHEGOU, E NAO A CAIXA INTEIRA: medido em 48 meses, a caixa fecha com 25
 * cartas, e 25 envelopes viram um monte. O fechamento traz 0 ou 1.
 *
 * ⛔ E CADA CARTA DIZ SE VENCE, em vez de o punhado marcar as ULTIMAS N: quem vence sai de
 * `silences`, que olha a caixa inteira, e o punhado desenha so o que chegou.
 *
 * @param {object} input
 * @param {ReadonlyArray<{ urgent: boolean }>} input.letters o que esta na mesa, e o que de
 * verdade vence — perguntado a `silences`, uma carta de cada vez
 * @returns {string}
 */
export function mailPileHtml({ letters }) {
  /* ⛔ O CORTE PRESERVA A QUE VENCE, e nao os oito primeiros: quem chama poe as urgentes no
     FIM para elas cairem por cima, entao fatiar de frente jogava fora justamente as vermelhas
     — a mesa deixando de avisar, que e o defeito que este punhado existe para consertar. Hoje
     o pico medido em 48 meses e 4 de 8, e e no dia em que a Caixa crescer que isto morde. */
  const over = Math.max(0, letters.length - FALL.length);
  const pile = letters
    .filter((letter, i) => letter.urgent || i >= over)
    .slice(0, FALL.length)
    .map((letter, i) => {
      const where = FALL[i] ?? { x: 0, y: 0, r: 0 };

      /* ⭐ CADA CARTA E UM BOTAO PARA A CAIXA (ciclo 25 §3.3: "clicar leva ao Email"), com o gesto
         do rail e do telefone — `data-section`. A mesa nao absorve a Caixa: ela vai crescer. */
      return (
        `<button class="envelope" type="button" data-section="email"` +
        `${letter.urgent ? ' data-urgent="true"' : ""}` +
        ` aria-label="${letter.urgent ? UI.envelope.due : UI.envelope.waiting}"` +
        ` style="--ex:${where.x};--ey:${where.y};--er:${where.r}deg">` +
        `</button>`
      );
    })
    .join("");

  return pile;
}
