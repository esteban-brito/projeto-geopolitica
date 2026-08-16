/* O SINETE — a cara de uma pessoa, sem inventar um rosto. View PURA.
   ══════════════════════════════════════════════════════════════════════════════

   ── POR QUE SINETE, E NAO RETRATO ───────────────────────────────────────────
   Uma auditoria externa pediu "a cara do remetente" na Caixa de Entrada, e ela
   tem razao no problema: "ih, carta do lider do Centrao, la vem chantagem" so
   funciona se a identidade chegar ANTES do texto. Mas retrato de personagem
   fictitio e uma promessa que este projeto nao pode cumprir — nao ha ilustracao,
   nao ha dependencia de runtime, e um rosto gerado por forma geometrica lê como
   avatar de aplicativo, que e exatamente a estetica de que a auditoria reclama.

   O sinete resolve o mesmo problema pelo caminho certo: e o objeto com que a
   burocracia de verdade identifica quem assina. Iniciais, um anel, e nada mais.

   ── ELE NAO TEM COR DE PARTIDO, E ISSO E DECISAO ────────────────────────────
   O catalogo nao declara cor de bloco, e inventar uma aqui seria pior do que
   parece: a paleta do jogo ja usa verde para ALTA e vermelho para CRISE, entao
   colorir ideologia com os mesmos tons faria a esquerda parecer boa e a direita
   parecer perigo — ou o contrario, conforme o dia. O sinete e monocromatico, e o
   bloco de cada pessoa ja e dito pelo lugar dela na tela: ela mora DENTRO da
   linha do bloco dela.

   ── O QUE O ANEL DIZ E O ALCANCE, e ele e motor ─────────────────────────────
   O arco do anel e a fracao da bancada que aquela pessoa de fato arrasta. Nao e
   enfeite: e o numero que decide se comprar aquele sujeito resolve a votacao ou
   nao. Mesma linguagem do arco do plenario, e pela mesma razao — um medidor lê
   mais rapido que um numero quando a pergunta e "muito ou pouco?". */

import { escapeHtml } from "./html.mjs";

/* AS INICIAIS SAO DUAS, e nunca tres. Um sinete de 34px com tres letras vira uma
   mancha: o que se lê de relance e forma, e nao texto. Com duas, o olho reconhece
   a pessoa pela silhueta do par — que e como se reconhece um monograma. */

/**
 * @param {string} name
 * @returns {string}
 */
function initialsOf(name) {
  const words = name.split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  /* O SOBRENOME E O ULTIMO, e nao o segundo: o vocabulario gera nomes com dois
     sobrenomes ("Ubirajara Hollanda Cavalcanti"), e pegar o do meio daria a duas
     pessoas da mesma familia o mesmo sinete. */
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

  /* O ANEL E UM `stroke-dasharray` sobre uma circunferencia, como o arco do
     plenario — sem biblioteca e sem canvas. O raio e 15 num quadro de 36. */
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
