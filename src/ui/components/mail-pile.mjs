/* AS CARTAS DO MÊS — um punhado jogado no canto da mesa.

   ⛔ A TELA NÃO CONTA PRAZO POR FORA. Escrever `left(carta) <= 0` aqui e a família de defeito
   mais cara deste projeto, com sete ocorrências medidas: a view refaz a conta do motor, as
   duas concordam hoje e divergem no dia da primeira mudança. Quem decide o que vence e
   `silences`, e ela chega pronta.

   📗 A FORMA E A DE UM ENVELOPE DE CONVITE, medida na foto de referencia pelos quatro cantos:
   proporção 1,504 na foto e 1,42 real — a câmera olha de cima e comprime a altura —, o bico da
   aba a 55% e o lacre com 19,3% da largura.

   ⭐ E A LUZ E CALCULADA, e não pintada: o domo da cera sai de `feSpecularLighting` com ponto
   de luz sobre a própria silhueta. Gradiente desenhado a mão produziu um botão de plástico. */

import { UI } from "../strings.mjs";

/* ONDE CAI CADA CARTA, em fração do espalhamento a partir do centro do canto.
   ⚠ A TABELA E FIXA E NÃO SORTEADA: o dominio não tem `Math.random`, e um punhado que muda de
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

/* ⛔ O LACRE, AS ABAS E OS DOIS FILTROS DE CERA SAÍRAM COM A FOTO: a cera, a dobra e o grão vem
   nela. */

/**
 * O PUNHADO — todas iguais, e só a cor separa os dois estados. Ele mostra o que chegou, e não
 * a caixa inteira: em 48 meses a caixa fecha com 25 cartas, e 25 envelopes viram um monte.
 * Cada carta diz se vence (`silences` olha a caixa inteira), e o punhado só desenha.
 *
 * @param {object} input
 * @param {ReadonlyArray<{ urgent: boolean }>} input.letters o que esta na mesa, e o que vence,
 * perguntado a `silences`. A ordem e a das folhas de `.post` no `cabinetHtml`: o envelope i
 * abre a carta i
 * @returns {string}
 */
export function mailPileHtml({ letters }) {
  /* ⛔ O CORTE PRESERVA A QUE VENCE, e não os oito primeiros: quem chama põe as urgentes no
     FIM para elas caírem por cima, então fatiar de frente jogava fora justamente as vermelhas
     — a mesa deixando de avisar, que e o defeito que este punhado existe para consertar. Hoje
     o pico medido em 48 meses e 4 de 8, e e no dia em que a Caixa crescer que isto morde. */
  const over = Math.max(0, letters.length - FALL.length);
  const pile = letters
    .map((letter, index) => ({ letter, index }))
    .filter(({ letter, index }) => letter.urgent || index >= over)
    .slice(0, FALL.length)
    .map(({ letter, index }, i) => {
      const where = FALL[i] ?? { x: 0, y: 0, r: 0 };

      /* ⭐ CADA CARTA E UM BOTÃO QUE ABRE A PRÓPRIA CARTA NA MESA (ciclo 27): `data-letter` e o
         índice da folha em `.post`. A Caixa continua sendo o arquivo, pelo dock. */
      return (
        `<button class="envelope" type="button" data-letter="${index}"` +
        `${letter.urgent ? ' data-urgent="true"' : ""}` +
        ` aria-label="${letter.urgent ? UI.envelope.due : UI.envelope.waiting}"` +
        ` style="--ex:${where.x};--ey:${where.y};--er:${where.r}deg">` +
        `</button>`
      );
    })
    .join("");

  return pile;
}
