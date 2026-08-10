/* O RAIL — a navegacao primaria, a esquerda e sempre presente.
   ══════════════════════════════════════════════════════════════════════════════

   A REFERENCIA E O FOOTBALL MANAGER 2020, e o que foi copiado dele e a
   ESTRUTURA, nao a paleta: barra lateral fixa como navegacao primaria, item com
   icone a esquerda e rotulo ao lado, item corrente destacado, e um bloco ancorado
   no rodape do proprio rail (la, o proximo jogo). Roxo e ciano do FM viravam
   outro projeto — aqui a lamina e a mesma da tela e o unico acento e o ambar.

   POR QUE A ACAO DE TURNO MORA NO RODAPE DO RAIL. No FM o `Continue` fica no
   canto superior DIREITO, e essa e a unica divergencia deliberada. O pedido foi
   botao a esquerda, e o rodape ancorado do rail e o lugar que existe na propria
   referencia para um bloco que nao rola com o conteudo.

   ITEM QUE NAO ABRE ENTRA DESLIGADO E DIZ QUE ESTA DESLIGADO. Seis motores tem
   contrato declarado e um so tem tela; oferecer as outras cinco como se
   abrissem ensinaria a desconfiar do menu inteiro. `disabled` nao e provisorio
   por preguica — e a informacao correta sobre o estado do projeto. */

import { escapeHtml } from "./html.mjs";
import { UI } from "../strings.mjs";

/* Icones em SVG inline, 16px, traco de `currentColor`. Inline porque o projeto
   nao tem build nem dependencia de runtime: um sprite externo seria uma
   requisicao e um 404 em potencial, e a suite de custo acusa console sujo. */
const ICONS = {
  dashboard:
    '<rect x="2.5" y="2.5" width="11" height="11" rx="2"/><path d="M2.5 6.5h11M6.5 6.5v7"/>',
  congress: '<path d="M8 2.5 13.5 6h-11z"/><path d="M4.5 6v6M8 6v6M11.5 6v6M2.5 13.5h11"/>',
  economy: '<path d="M2.5 11.5 6 8l2.5 2.5L13.5 5"/><path d="M10.5 5h3v3"/>',
  budget: '<rect x="2.5" y="4.5" width="11" height="8" rx="2"/><path d="M10 8.5h3.5"/>',
  opinion: '<path d="M13.5 9a2 2 0 0 1-2 2H6l-3.5 2.5V4.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2z"/>',
  graph:
    '<circle cx="4" cy="4.5" r="1.6"/><circle cx="12" cy="6.5" r="1.6"/>' +
    '<circle cx="7" cy="12" r="1.6"/><path d="m5.5 5 5 1.2M11 7.8 8.2 10.7M4.9 6l1.6 4.5"/>',
};

/* A ORDEM E A DO TURNO, e nao a alfabetica: e assim que o jogador vai aprender
   que um mes resolve nesta sequencia. */
const SECTIONS = /** @type {const} */ ([
  { key: "dashboard", ready: true },
  { key: "congress", ready: false },
  { key: "economy", ready: false },
  { key: "budget", ready: false },
  { key: "opinion", ready: false },
  { key: "graph", ready: false },
]);

/**
 * @param {string} current chave da secao aberta
 * @returns {string}
 */
export function railNavHtml(current) {
  return SECTIONS.map(({ key, ready }) => {
    const active = ready && key === current;
    /* `aria-current` e o que diz "voce esta aqui" para leitor de tela. A classe
       so pinta; sozinha ela nao informa nada a quem nao ve a tela. */
    const attributes = [
      `class="rail__item${active ? " rail__item--active" : ""}"`,
      'type="button"',
      active ? 'aria-current="page"' : "",
      ready ? "" : `disabled title="${escapeHtml(UI.nav.pending)}"`,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      `<li><button ${attributes}>` +
      `<svg class="rail__icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" ` +
      `stroke="currentColor" stroke-width="1.4" stroke-linecap="round" ` +
      `stroke-linejoin="round">${ICONS[key]}</svg>` +
      `<span class="rail__label">${escapeHtml(UI.nav[key])}</span>` +
      `</button></li>`
    );
  }).join("");
}
