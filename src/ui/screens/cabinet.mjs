/* GABINETE — a tela inicial, e a unica que so resume. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════

   ── ELA SUBSTITUI A MESA, E NAO E A MESA COM OUTRO NOME ─────────────────────
   A Mesa misturava duas coisas: o resumo do mes e a mesa de negociacao. Quem
   abria o jogo caia no meio de uma decisao — placar, bancadas e controles de
   verba — sem antes saber como o pais estava. Agora sao duas telas: aqui se
   ENTENDE, e no Congresso se DECIDE.

   ── O GABINETE NAO DECIDE NADA ──────────────────────────────────────────────
   Ele e a segunda tela sem controle, depois de Financas, e a diferenca entre as
   duas e o proposito: Financas e o placar que se consulta, o Gabinete e o
   despacho que se resolve. Cada cartao aqui LEVA ao lugar onde a decisao mora —
   e essa e a mesma razao que separou a area da Mesa: decidir onde nao se ve a
   consequencia e decidir no escuro.

   ── A REFERENCIA E O INBOX DO FOOTBALL MANAGER ──────────────────────────────
   E ela nao e estetica: um dashboard de cartoes e a forma que resolve o problema
   de "o mundo tem coisas a me dizer e eu preciso escolher a quais responder".
   Enquanto o mundo nao fala — Congresso, relator e tribunal ainda nao escrevem —,
   a caixa de entrada declara a espera em vez de fingir conteudo. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent, seats } from "../shared/format.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../domain/opinion/index.mjs").Approval} Approval
 * @typedef {import("../../data/opinion.mjs").Segment} Segment
 */

/**
 * @param {object} input
 * @param {string} input.title
 * @param {string} input.body
 * @param {string} [input.action] o rotulo do botao que leva ao lugar de decidir
 * @param {string} [input.target] a secao para onde ele leva
 * @param {string} [input.span] `wide` ocupa a coluna inteira
 * @returns {string}
 */
function cardHtml({ title, body, action, target, span }) {
  return (
    `<section class="card"${span ? ` data-span="${span}"` : ""}>` +
    `<h3 class="card__title">${escapeHtml(title)}` +
    (action && target
      ? `<button class="card__action" type="button" data-section="${escapeHtml(target)}">` +
        `${escapeHtml(action)}</button>`
      : "") +
    `</h3>` +
    `<div class="card__body">${body}</div>` +
    `</section>`
  );
}

/**
 * O ARCO DO PLENARIO — 513 cadeiras, e as que respondem ao governo.
 *
 * ⚠ ELE E UM MEDIDOR, E NAO UM GRAFICO DE ASSENTOS. Desenhar 513 pontos exigiria
 * saber onde cada cadeira senta, e o modelo nao tem deputado individual: ele tem
 * quatro blocos. Um arco preenchido diz a mesma verdade sem inventar a que falta.
 *
 * @param {number} base cadeiras que respondem ao governo
 * @param {number} total
 * @param {number} majority
 */
function archHtml(base, total, majority) {
  const share = total > 0 ? Math.min(1, Math.max(0, base / total)) : 0;

  /* O SEMICIRCULO E UM `stroke-dasharray` sobre um arco, e a conta e a fracao do
     comprimento dele. Sem biblioteca, sem canvas e sem d3 — o projeto nao tem
     dependencia de runtime, e um arco e uma curva so. */
  const length = Math.PI * 42;

  return (
    `<svg class="arch" viewBox="0 0 100 56" role="img" ` +
    `aria-label="${escapeHtml(`${base} de ${total} cadeiras`)}">` +
    `<path class="arch__track" d="M8 50 A42 42 0 0 1 92 50" fill="none" stroke-width="9" />` +
    `<path class="arch__fill" d="M8 50 A42 42 0 0 1 92 50" fill="none" stroke-width="9" ` +
    `stroke-dasharray="${(length * share).toFixed(2)} ${length.toFixed(2)}" ` +
    `data-majority="${base >= majority}" />` +
    `</svg>`
  );
}

/**
 * A tela inteira.
 *
 * @param {object} input
 * @param {string} input.situation o nivel do governo — crisis, stable, growth
 * @param {string} input.verdict a frase que diz o que esta em jogo
 * @param {number} input.base cadeiras que respondem ao governo
 * @param {number} input.seats o plenario inteiro
 * @param {number} input.majority
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.committed o que as ordens do mes ja comprometeram
 * @param {number} input.mandatory a despesa obrigatoria anualizada
 * @param {number} input.revenue a receita anualizada
 * @param {ReadonlyArray<Segment>} input.segments
 * @param {Record<string, Approval>} input.street a pesquisa de cada segmento
 * @returns {string}
 */
export function cabinetHtml(input) {
  const head =
    `<div class="area__head"><div>` +
    `<p class="area__eyebrow">${escapeHtml(UI.cabinet.eyebrow)}</p>` +
    `<p class="area__value">${escapeHtml(UI.cabinet.title)}</p>` +
    `</div>` +
    /* O VEREDITO SOBE PARA CA. Ele morava no rail da direita, que deixou de
       existir — e este e o lugar certo: ele e a leitura do governo inteiro, e o
       Gabinete e a tela do governo inteiro. */
    `<p class="cabinet__verdict" data-situation="${escapeHtml(input.situation)}">` +
    `${escapeHtml(input.verdict)}</p>` +
    `</div>`;

  const inbox = cardHtml({
    title: UI.cabinet.inbox,
    span: "wide",
    body: `<p class="card__waiting">${escapeHtml(UI.cabinet.inboxWaiting)}</p>`,
  });

  const congress = cardHtml({
    title: UI.cabinet.congress,
    action: UI.cabinet.congressAction,
    target: "congress",
    body:
      archHtml(input.base, input.seats, input.majority) +
      `<p class="card__hero" data-numeric>${seats(input.base)}` +
      `<small>${escapeHtml(UI.cabinet.seats)}</small></p>`,
  });

  /* O COFRE MOSTRA O QUE SOBRA E O QUE ESTA PRESO, e os dois na mesma barra: a
     obrigatoria nao e contexto, e a razao de o discricionario ser pequeno. Ver os
     dois separados faria o jogador ler "R$ 25 bi" como o orcamento do pais. */
  const locked = input.revenue > 0 ? Math.min(1, input.mandatory / input.revenue) : 0;

  /* ⚠ O HERO E O QUE CABE, E NAO O QUE SOBRA. A primeira versao mostrava
     `room − committed` sob o rotulo "livre no mes", e a partida abria com
     "R$ 0,0 bi" — porque o orcamento HERDADO ja consome o discricionario inteiro.
     O numero estava certo e a leitura, errada: zero ao lado de "livre" parece
     defeito de carregamento, quando na verdade e a descoberta mais dura do
     modelo. Ela merece uma frase, e nao um zero. */
  const vault = cardHtml({
    title: UI.cabinet.vault,
    action: UI.nav.finance,
    target: "finance",
    body:
      `<p class="card__hero" data-numeric>${money(input.room)}` +
      `<small>${escapeHtml(UI.cabinet.vaultFree)}</small></p>` +
      `<div class="meter meter--vault" role="img" ` +
      `aria-label="${escapeHtml(`${percent(locked)} ${UI.cabinet.vaultLocked}`)}">` +
      `<span class="meter__part" data-part="poor" style="flex-grow:${(locked * 100).toFixed(1)}"></span>` +
      `<span class="meter__part" data-part="good" style="flex-grow:${((1 - locked) * 100).toFixed(1)}"></span>` +
      `</div>` +
      `<p class="card__note">${escapeHtml(UI.cabinet.vaultLocked)} ` +
      `<b data-numeric>${percent(locked)}</b> · ` +
      `${escapeHtml(UI.cabinet.vaultTaken)} ` +
      `<b data-numeric>${money(input.committed)}</b></p>`,
  });

  /* A RUA POR SEGMENTO, e nao a media. A media esconde exatamente o que decide o
     risco de queda: um governo com apoio morno de todo mundo aguenta uma crise, e
     um adorado por metade do pais e odiado pela outra nao aguenta nenhuma. */
  const street = cabinetStreetHtml(input);

  return (
    `<section class="area glass-stage cabinet">` +
    head +
    `<div class="cards">${inbox}${congress}${vault}${street}</div>` +
    `</section>`
  );
}

/**
 * O TERMOMETRO DA RUA.
 *
 * ⚠ ELE E UMA FUNCAO SEPARADA e nao esta inline no corpo acima porque a Caixa de
 * Entrada vai precisar dele: quando o inbox existir, uma carta de pesquisa vai
 * mostrar exatamente este bloco dentro dela. Extrair depois seria mexer nas duas.
 *
 * @param {object} input
 * @param {ReadonlyArray<Segment>} input.segments
 * @param {Record<string, Approval>} input.street
 * @returns {string}
 */
export function cabinetStreetHtml({ segments, street }) {
  const rows = segments
    .map(segment => {
      const poll = street[segment.id];
      if (!poll) return "";

      return (
        `<div class="street__row">` +
        `<span class="street__who">${escapeHtml(segment.label)}</span>` +
        `<div class="meter" role="img" ` +
        `aria-label="${escapeHtml(`${segment.label}: ${poll.good}% ótimo ou bom`)}">` +
        /** @type {const} */ (["good", "fair", "poor"])
          .map(
            part =>
              `<span class="meter__part" data-part="${part}" style="flex-grow:${poll[part]}"></span>`,
          )
          .join("") +
        `</div>` +
        `<span class="street__value" data-numeric>${poll.good}%</span>` +
        `</div>`
      );
    })
    .join("");

  return cardHtml({ title: UI.cabinet.street, body: `<div class="street">${rows}</div>` });
}
