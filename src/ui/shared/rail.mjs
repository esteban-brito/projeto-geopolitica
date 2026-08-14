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

   A TERCEIRA FORMA FOI POR AREA DE GOVERNO, e ela valeu enquanto o jogo era so
   orcamento: toda decisao cabia dentro de uma area, e quem queria mexer na saude
   entrava em Saude.

   ── A QUARTA, E A RAZAO DE ELA NAO SER UMA VOLTA ATRAS ──────────────────────
   Agora ele lista PODERES E LUGARES. A diferenca em relacao ao menu de
   instrumentos que foi recusado esta em uma palavra: legislar deixou de ser um
   RITO e virou uma ATIVIDADE, com tramitacao, relator e adversario. O Congresso
   nao e mais o "como" de uma decisao de saude — ele e um lugar onde se passa o
   mes.

   E a regra antiga sobrevive um nivel abaixo: quem quer mexer na saude entra em
   Ministerios e acha Saude la dentro. O que se perde e um clique; o que se ganha
   e endereco para tudo o que nao e area — a rua, o tribunal, o bastidor.

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
  cabinet:
    '<rect x="2.5" y="4.5" width="11" height="9" rx="2"/><path d="M6 4.5V3.2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.3"/><path d="M2.5 8.5h11"/>',
  congress: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h7"/><circle cx="12" cy="11.5" r="1.6"/>',
  street:
    '<circle cx="5" cy="5" r="1.8"/><circle cx="11" cy="5" r="1.8"/><path d="M2 13.5c0-2 1.3-3.2 3-3.2s3 1.2 3 3.2M8 13.5c0-2 1.3-3.2 3-3.2s3 1.2 3 3.2"/>',
  backstage:
    '<path d="M8 2.5l5.5 2.8v3.4c0 3-2.3 5-5.5 5.8-3.2-.8-5.5-2.8-5.5-5.8V5.3z"/><path d="M8 7v3"/>',
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
  const cabinet = itemHtml({ key: "cabinet", label: UI.nav.cabinet, ready: true }, current);
  const congress = itemHtml({ key: "congress", label: UI.nav.congress, ready: true }, current);
  const finance = itemHtml({ key: "finance", label: UI.nav.finance, ready: true }, current);

  /* ⚠ A FAZENDA CONTINUA SENDO UMA AREA, e nao um item de primeiro nivel como o
     plano de tela sugeria. Enquanto ela for orcamento — programas de fiscalizacao,
     dividia ativa, tecnologia da arrecadacao — ela e uma pasta como as outras. Ela
     sobe de nivel no dia em que virar impostos, que e a Parte 3 do ciclo 3 e esta
     suspensa a espera da clausula de tributo. Promover a tela antes do conteudo
     seria um menu prometendo o que a tela nao entrega. */
  const ministries =
    `<li class="rail__group">` +
    `<p class="rail__legend">${escapeHtml(UI.nav.ministries)}</p>` +
    `<ul class="rail__sub">` +
    areas
      .map(area => itemHtml({ key: area.id, label: area.label, ready: true }, current))
      .join("") +
    `</ul>` +
    `</li>`;

  const estado = itemHtml({ key: "estado", label: UI.nav.estado, ready: true }, current);

  /* O QUE NAO EXISTE ENTRA DESLIGADO E DIZ QUE ESTA DESLIGADO. A Rua depende de
     imprensa como ator; o Bastidor depende do STF, que nasce na Parte 8. Oferecer
     as duas como se abrissem ensinaria a desconfiar do menu inteiro — e a
     aprovacao, que ja tem motor, esta na barra de cima e no Gabinete. */
  const pending = [
    { key: "street", label: UI.nav.street, ready: false },
    { key: "backstage", label: UI.nav.backstage, ready: false },
  ]
    .map(section => itemHtml(section, current))
    .join("");

  const rule = '<li class="rail__rule" aria-hidden="true"></li>';

  return cabinet + congress + finance + rule + ministries + rule + estado + rule + pending;
}
