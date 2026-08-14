/* O RAIL — a navegacao primaria, a esquerda e sempre presente.
   ══════════════════════════════════════════════════════════════════════════════

   A REFERENCIA E O FOOTBALL MANAGER 2020, e o que foi copiado dele e a
   ESTRUTURA, nao a paleta: barra lateral fixa como navegacao primaria, item com
   icone a esquerda e rotulo ao lado, item corrente destacado, e um bloco ancorado
   no rodape do proprio rail (la, o proximo jogo).

   ── ELE JA FOI ORGANIZADO DE DOIS JEITOS ERRADOS ─────────────────────────────
   A primeira versao listava MOTORES — Congresso, Economia, Orcamento, Opiniao,
   Rede. E um menu com formato de codigo: ninguem acorda querendo visitar o motor
   de opiniao. A segunda tentativa foi por INSTRUMENTO — Leis, Emendas, Caneta —,
   que e um menu com formato de regra: obriga a saber o rito antes de achar o
   assunto.

   Agora ele lista AREAS DE GOVERNO, que e como um presidente pensa. Quem quer
   mexer na saude entra em Saude. O instrumento virou etiqueta na linha da acao,
   e continua valendo tudo o que valia — 257, 308, ou nenhum voto.

   ── DUAS COISAS QUE NAO MUDARAM ──────────────────────────────────────────────
   A MESA VEM PRIMEIRA e fica separada das areas por uma divisa: ela nao e um
   assunto, e o lugar onde o mes se resolve. Um turno inteiro se decide sem sair
   dela; as areas sao onde se vai quando se QUER olhar, e nao onde se precisa
   passar.

   ITEM QUE NAO ABRE ENTRA DESLIGADO E DIZ QUE ESTA DESLIGADO. Opiniao e Rede tem
   contrato declarado e nao tem tela; oferece-las como se abrissem ensinaria a
   desconfiar do menu inteiro. `disabled` nao e provisorio por preguica — e a
   informacao correta sobre o estado do projeto. */

import { escapeHtml } from "./html.mjs";
import { UI } from "../strings.mjs";

/** @typedef {import("../../data/areas.mjs").Area} Area */

/* Icones em SVG inline, 16px, traco de `currentColor`. Inline porque o projeto
   nao tem build nem dependencia de runtime: um sprite externo seria uma
   requisicao e um 404 em potencial, e a suite de custo acusa console sujo. */
const ICONS = /** @type {Record<string, string>} */ ({
  mesa: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h7"/><circle cx="12" cy="11.5" r="1.6"/>',
  /* Uma linha subindo dentro de uma moldura: o placar e uma serie, e nao um
     cofre. O cofre ja e a Fazenda, que e onde o dinheiro se decide. */
  finance:
    '<rect x="2.5" y="2.5" width="11" height="11" rx="3"/><path d="m5 10.5 2.4-2.6 2 1.7 2.6-3"/>',
  treasury: '<rect x="2.5" y="4.5" width="11" height="8" rx="2"/><path d="M10 8.5h3.5"/>',
  /* Um talo com duas folhas para a lavoura, e a silhueta de fabrica para o parque
     produtivo. As duas eram um icone so ate a Producao virar duas areas. */
  agriculture:
    '<path d="M8 13.5V6"/><path d="M8 8.5C8 6 6 4.5 3.5 4.5 3.5 7 5.5 8.5 8 8.5z"/>' +
    '<path d="M8 7.5c0-2.5 2-4 4.5-4 0 2.5-2 4-4.5 4z"/>',
  industry: '<path d="M2.5 13.5h11"/><path d="M3.5 13.5V7l3.5 2.5V7l3.5 2.5V4.5h2v9"/>',
  welfare:
    '<path d="M8 13.5S2.5 10.2 2.5 6.6A2.6 2.6 0 0 1 8 5a2.6 2.6 0 0 1 5.5 1.6c0 3.6-5.5 6.9-5.5 6.9z"/>',
  health: '<path d="M8 3.5v9M3.5 8h9"/><rect x="2.5" y="2.5" width="11" height="11" rx="3"/>',
  education:
    '<path d="M8 3 14.5 6 8 9 1.5 6z"/><path d="M4.5 7.4v3.4c0 .9 1.6 1.7 3.5 1.7s3.5-.8 3.5-1.7V7.4"/>',
  security: '<path d="M8 2.5 13 4.5v4c0 3-2.2 4.6-5 5.5-2.8-.9-5-2.5-5-5.5v-4z"/>',
  opinion: '<path d="M13.5 9a2 2 0 0 1-2 2H6l-3.5 2.5V4.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2z"/>',
  estado: '<path d="M8 2.5 2.5 5.5v1h11v-1z"/><path d="M4 6.5v5M8 6.5v5M12 6.5v5M2 13.5h12"/>',
  graph:
    '<circle cx="4" cy="4.5" r="1.6"/><circle cx="12" cy="6.5" r="1.6"/>' +
    '<circle cx="7" cy="12" r="1.6"/><path d="m5.5 5 5 1.2M11 7.8 8.2 10.7M4.9 6l1.6 4.5"/>',
});

/* Formas genericas para uma area que o catalogo ganhar depois. Um icone faltando
   nao pode derrubar a navegacao — e um quadrado honesto e melhor que um buraco. */
const FALLBACK = '<rect x="2.5" y="2.5" width="11" height="11" rx="3"/>';

/**
 * @param {object} section
 * @param {string} section.key
 * @param {string} section.label
 * @param {boolean} section.ready
 * @param {string} current
 */
function itemHtml({ key, label, ready }, current) {
  const active = ready && key === current;

  /* `aria-current` e o que diz "voce esta aqui" para leitor de tela. A classe so
     pinta; sozinha ela nao informa nada a quem nao ve a tela. */
  const attributes = [
    `class="rail__item${active ? " rail__item--active" : ""}"`,
    'type="button"',
    `data-section="${escapeHtml(key)}"`,
    active ? 'aria-current="page"' : "",
    ready ? "" : `disabled title="${escapeHtml(UI.nav.pending)}"`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    `<li><button ${attributes}>` +
    `<svg class="rail__icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" ` +
    `stroke="currentColor" stroke-width="1.4" stroke-linecap="round" ` +
    `stroke-linejoin="round">${ICONS[key] ?? FALLBACK}</svg>` +
    `<span class="rail__label">${escapeHtml(label)}</span>` +
    `</button></li>`
  );
}

/**
 * @param {string} current chave da secao aberta
 * @param {ReadonlyArray<Area>} areas
 * @returns {string}
 */
export function railNavHtml(current, areas) {
  const mesa = itemHtml({ key: "mesa", label: UI.nav.mesa, ready: true }, current);

  /* FINANCAS FICA JUNTO DA MESA, e nao entre as areas, porque ela tambem nao e um
     assunto: e o placar do que os assuntos fizeram. Posta na fila das areas, ela
     ensinaria que existe uma pasta de Financas para governar — e nao existe, ela
     e a unica tela do jogo sem um controle. A Fazenda, que decide dinheiro, essa
     sim e area e fica na fila. */
  const finance = itemHtml({ key: "finance", label: UI.nav.finance, ready: true }, current);

  const government = areas
    .map(area => itemHtml({ key: area.id, label: area.label, ready: true }, current))
    .join("");

  /* O ESTADO — o que a Uniao POSSUI e quanto poder o Executivo tem. Ele fica
     depois das areas e antes do que nao existe, porque nao e um assunto de
     governo: e a moldura dentro da qual os assuntos acontecem. */
  const estado = itemHtml({ key: "estado", label: UI.nav.estado, ready: true }, current);

  const pending = [
    { key: "opinion", label: UI.nav.opinion, ready: false },
    { key: "graph", label: UI.nav.graph, ready: false },
  ]
    .map(section => itemHtml(section, current))
    .join("");

  /* A DIVISA E SEMANTICA e nao decorativa: ela separa o lugar onde o mes se
     resolve das areas onde ele se prepara, e depois separa o que existe do que
     ainda nao existe. */
  const rule = '<li class="rail__rule" aria-hidden="true"></li>';

  return mesa + finance + rule + government + rule + estado + rule + pending;
}
