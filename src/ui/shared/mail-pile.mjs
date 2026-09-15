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

/* ⭐ O LACRE EM DUAS PECAS: um ANEL de cera derramada por fora e um DISCO REBAIXADO por
   dentro, onde o carimbo apertou. Chapado numa peca so, ele saiu botao.
   ⚠ E OS `id` MORAM NUM `<svg>` SO: um filtro por envelope repetiria o `id`, e ai o primeiro
   venceria para todos os oito — sem erro nenhum no console. */
const DEFS =
  `<svg class="mail__defs" aria-hidden="true"><defs>` +
  /* O domo: a silhueta escorre, o desfoque do alfa vira mapa de altura, o especular le esse
     mapa e o brilho volta recortado na silhueta. */
  `<filter id="wax" x="-30%" y="-30%" width="160%" height="160%">` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11"` +
  ` result="wave"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="wave" scale="4.6"` +
  ` xChannelSelector="R" yChannelSelector="G" result="shape"/>` +
  `<feGaussianBlur in="shape" stdDeviation="2.6" result="height"/>` +
  /* ⛔ COM `specularConstant` EM 0,62 O ANEL INTEIRO ACENDIA e o disco virava um buraco. O
     brilho tem de ser um ARCO na crista: constante baixa e expoente alto. */
  `<feSpecularLighting in="height" surfaceScale="3" specularConstant="0.3"` +
  ` specularExponent="34" lighting-color="#fff0e6" result="lit">` +
  /* A luz e a da sala, a mesma de todo relevo da mesa: azimute 250 (20 graus a esquerda de
     cima), elevacao 52. Era um ponto de luz proprio, e o lacre era a unica peca com luz sua. */
  `<feDistantLight azimuth="250" elevation="52"/>` +
  `</feSpecularLighting>` +
  `<feComposite in="lit" in2="shape" operator="in" result="onWax"/>` +
  `<feComposite in="onWax" in2="shape" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"` +
  ` result="dome"/>` +
  `<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="5" result="g"/>` +
  `<feColorMatrix in="g" type="matrix" values="` +
  `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.17 0 0 0 0" result="grainA"/>` +
  `<feComposite in="grainA" in2="shape" operator="in" result="grainOnWax"/>` +
  `<feBlend in="dome" in2="grainOnWax" mode="multiply"/>` +
  `</filter>` +
  /* O grao sozinho, para o disco: ele nao leva a deformacao — se levasse, a borda entre o
     anel e o disco tremeria e os dois deixariam de ser concentricos. */
  `<filter id="wax-matte" color-interpolation-filters="sRGB">` +
  `<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="3" seed="5" result="g"/>` +
  `<feColorMatrix in="g" type="matrix" values="` +
  `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.15 0 0 0 0" result="a"/>` +
  `<feComposite in="a" in2="SourceGraphic" operator="in" result="inside"/>` +
  `<feBlend in="SourceGraphic" in2="inside" mode="multiply"/>` +
  `</filter>` +
  `</defs></svg>`;

/* ⚠ SO O ANEL LEVA A DEFORMACAO: com o disco dentro do mesmo filtro, a borda entre os dois
   tremia junto e os dois deixavam de ser concentricos.
   ⭐ E OS DOIS ARCOS SAO O DEGRAU: sombra no alto, reflexo embaixo. Um circulo escuro inteiro
   dava uma rosquinha. */
const SEAL =
  `<svg class="envelope__seal" viewBox="0 0 100 100" aria-hidden="true">` +
  `<circle class="seal__ring" cx="50" cy="50" r="46"/>` +
  `<circle class="seal__disc" cx="50" cy="50" r="33"/>` +
  `<path class="seal__step" d="M17 50 A33 33 0 0 1 83 50"/>` +
  `<path class="seal__gleam" d="M20 58 A33 33 0 0 0 80 58"/>` +
  `</svg>`;

/* ⛔ AS ABAS ERAM `<path>` COM TRACO FINO, e de perto o envelope virava um X desenhado. Cada
   uma e uma FORMA recortada: tem luz propria e projeta sombra na de baixo.
   ⭐ E O CORTE E A TERCEIRA PECA: o mesmo triangulo da aba com o bico um degrau mais baixo e
   claro. O que sobra e a ARESTA do papel pegando luz, e na foto e ela que separa a aba do
   corpo, antes da sombra. */
const PAPER =
  `<div class="envelope__back"></div><div class="envelope__edge"></div>` +
  `<div class="envelope__flap"></div>` +
  SEAL;

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
        PAPER +
        `</button>`
      );
    })
    .join("");

  return DEFS + pile;
}
