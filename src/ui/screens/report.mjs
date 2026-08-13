/* O RELATORIO DO MES — o que o turno FEZ. View PURA.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELE E A PECA QUE FALTAVA. Ate aqui o jogador apertava "avancar o mes" e
   a tela trocava em silencio: `playMonth` devolvia um relatorio inteiro — placar,
   deriva por bancada, prometido contra pago, contingenciamento — e o entrypoint
   jogava fora. Sem isso o ciclo nao fecha. Decidir sem saber o que a decisao fez
   nao e jogar, e a segunda decisao passa a ser um chute com a mesma informacao da
   primeira.

   ── A PREVISAO E CONFRONTADA COM O DIA ───────────────────────────────────────
   Esta e a unica tela do jogo onde a banda `± 14` prova que era honesta. A Mesa
   promete uma faixa; aqui aparece o numero que saiu, e o quanto ele desviou. Sem
   esse confronto o jogador nunca aprende a ler a faixa — ele so aprende que a
   tela mostra um numero e depois outro.

   ── A ORDEM E A DA CONSEQUENCIA, e nao a da execucao ─────────────────────────
   O turno resolve orcamento antes de votacao, porque a votacao usa a verba paga.
   O relatorio comeca pela VOTACAO, que e o que o jogador estava esperando, e so
   depois mostra o dinheiro que a produziu, a base que sobrou e o pais que mudou.
   Relatorio na ordem do motor seria relatorio escrito para quem escreveu o
   motor. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent, seats, signed } from "../shared/format.mjs";
import { UI } from "../strings.mjs";
import { monthLabel } from "../../state/state.mjs";

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../application/turn.mjs").Report} Report
 */

/**
 * @param {Record<string, string>} table
 * @param {string} key
 */
function labelOf(table, key) {
  return table[key] ?? key;
}

/**
 * UM AVISO no mesmo cartao do relatorio.
 *
 * Ele existe para o save recusado ter onde aparecer. Recusar em silencio e
 * comecar uma partida nova sem dizer nada seria a pior forma de tratar o caso:
 * o jogador veria o mandato dele desaparecer e nao teria como saber se foi
 * defeito, engano dele ou decisao do jogo.
 *
 * @param {object} input
 * @param {string} input.title
 * @param {string} input.body
 * @returns {string}
 */
export function noticeHtml({ title, body }) {
  return (
    `<h2 class="dialog-card__title" id="monthDialogTitle">${escapeHtml(title)}</h2>` +
    `<p class="report__line">${escapeHtml(body)}</p>`
  );
}

/**
 * O QUE O MES DEIXOU.
 *
 * @param {object} input
 * @param {Report} input.report
 * @param {number} input.quorum zero quando nao houve votacao
 * @param {ReadonlyArray<Party>} input.parties
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.loyaltyBefore o humor ANTES do mes
 * @param {Record<string, number>} input.indexBefore os indices ANTES do mes
 * @returns {string}
 */
export function reportHtml({ report, quorum, parties, areas, loyaltyBefore, indexBefore }) {
  const { bill, tally } = report;

  /* O TITULO CARREGA O `id` QUE O `<dialog>` APONTA em `aria-labelledby`. Ele e
     escrito aqui e nao no documento porque o cartao inteiro e substituido a cada
     mes — um titulo fixo no HTML ficaria descrevendo o mes anterior para quem lê
     por leitor de tela, que e a unica pessoa que nao veria a diferenca. */
  const head =
    `<h2 class="dialog-card__title" id="monthDialogTitle">` +
    `${escapeHtml(monthLabel(report.month))}</h2>` +
    `<p class="report__subject">` +
    (bill
      ? `${escapeHtml(bill.label)} <span class="badge" ` +
        `data-instrument="${escapeHtml(bill.instrument)}">` +
        `${escapeHtml(labelOf(UI.instrument, bill.instrument))}</span>`
      : escapeHtml(UI.report.noBill)) +
    `</p>`;

  return (
    head +
    verdictBlock({ report, quorum, tally }) +
    benchBlock({ report, tally, parties, loyaltyBefore }) +
    moneyBlock(report) +
    countryBlock({ report, areas, indexBefore })
  );
}

/**
 * O PLACAR, e o confronto com a previsao.
 *
 * @param {object} input
 * @param {Report} input.report
 * @param {number} input.quorum
 * @param {import("../../domain/congress/index.mjs").Tally | null} input.tally
 */
function verdictBlock({ report, quorum, tally }) {
  if (!report.bill) return "";

  /* A CANETA NAO TEM PLACAR, e nao e um placar de zero: ela nao foi a plenario.
     Mostrar `0 de 257` para um decreto seria afirmar uma derrota que nao houve. */
  if (!tally) {
    return (
      `<p class="report__verdict" data-passed="true">${escapeHtml(UI.report.decreed)}</p>` +
      `<p class="report__line">${escapeHtml(UI.mesa.decree)}</p>`
    );
  }

  const drift = tally.votes - tally.expected;

  return (
    `<p class="report__verdict" data-passed="${tally.passed}">` +
    `${escapeHtml(tally.passed ? UI.report.passed : UI.report.rejected)}</p>` +
    `<p class="report__score" data-numeric>${seats(tally.votes)}` +
    `<small>${escapeHtml(UI.report.against)} ${seats(quorum)}</small></p>` +
    /* O CONFRONTO. Ele existe para a banda da Mesa provar que era honesta: a
       previsao e deterministica, o dia nao, e e aqui que o jogador ve o tamanho
       real do "nao". */
    `<p class="report__line">${escapeHtml(UI.report.forecastWas)} ` +
    `<b data-numeric>${seats(tally.expected)}</b> · ` +
    `${escapeHtml(UI.report.dayGave)} <b data-numeric>${signed(drift)}</b></p>`
  );
}

/**
 * BANCADA POR BANCADA: quem entregou o que, e o que sobrou de humor.
 *
 * @param {object} input
 * @param {Report} input.report
 * @param {import("../../domain/congress/index.mjs").Tally | null} input.tally
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyaltyBefore
 */
function benchBlock({ report, tally, parties, loyaltyBefore }) {
  const rows = parties
    .map(party => {
      const before = loyaltyBefore[party.id] ?? 0;
      const after = report.loyalty[party.id] ?? 0;
      const moved = after - before;
      const line = tally?.parties.find(item => item.partyId === party.id);

      return (
        `<tr>` +
        `<th scope="row">${escapeHtml(party.label)}</th>` +
        `<td data-numeric>${percent(report.paid[party.id] ?? 0)}</td>` +
        `<td data-numeric>${line ? seats(line.votes) : "—"}</td>` +
        /* A DERIVA E O DIA, e ela merece coluna propria: uma bancada que entregou
           menos do que prometia nao e a mesma coisa que uma que entregou pouco. */
        `<td data-numeric>${line ? signed(line.drift) : "—"}</td>` +
        `<td class="report__mood" data-direction="${moved > 0 ? "up" : moved < 0 ? "down" : "flat"}"` +
        ` data-numeric>${seats(after)} <small>${signed(moved, 1)}</small></td>` +
        `</tr>`
      );
    })
    .join("");

  return (
    `<table class="report__table">` +
    `<caption>${escapeHtml(UI.report.benches)}</caption>` +
    `<thead><tr>` +
    `<th scope="col">${escapeHtml(UI.mesa.bench)}</th>` +
    `<th scope="col">${escapeHtml(UI.report.paid)}</th>` +
    `<th scope="col">${escapeHtml(UI.report.votes)}</th>` +
    `<th scope="col">${escapeHtml(UI.report.drift)}</th>` +
    `<th scope="col">${escapeHtml(UI.mesa.mood)}</th>` +
    `</tr></thead>` +
    `<tbody>${rows}</tbody>` +
    `</table>`
  );
}

/**
 * O DINHEIRO: o que foi prometido, o que o caixa honrou, e por que.
 *
 * @param {Report} report
 */
function moneyBlock(report) {
  const demand = report.promisedCost + report.allocatedTotal;
  const paid = report.paidCost + report.allocatedTotal;
  const cut = demand > 0 ? 1 - paid / demand : 0;

  /* O CORTE SO APARECE QUANDO EXISTE. Uma linha dizendo "cortou 0%" todo mes
     ensina o jogador a parar de ler a linha justamente antes do mes em que ela
     passa a valer alguma coisa. */
  const shortfall =
    cut > 1e-9
      ? `<p class="report__line" data-alert="true">${escapeHtml(UI.report.cut)} ` +
        `<b data-numeric>${percent(cut)}</b> — ${escapeHtml(UI.report.cutWhy)}</p>`
      : "";

  const squeezed = report.budget.contingency
    ? `<p class="report__line" data-alert="true">${escapeHtml(UI.report.contingency)}</p>`
    : "";

  return (
    `<p class="report__legend">${escapeHtml(UI.report.money)}</p>` +
    `<p class="report__line">${escapeHtml(UI.report.promised)} ` +
    `<b data-numeric>${money(demand)}</b> · ${escapeHtml(UI.report.honoured)} ` +
    `<b data-numeric>${money(paid)}</b> · ${escapeHtml(UI.report.room)} ` +
    `<b data-numeric>${money(report.room)}</b></p>` +
    shortfall +
    squeezed
  );
}

/**
 * O PAIS: os indices que a alocacao e as aprovacoes moveram.
 *
 * @param {object} input
 * @param {Report} input.report
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.indexBefore
 */
function countryBlock({ report, areas, indexBefore }) {
  const rows = areas
    .map(area => {
      const before = indexBefore[area.id] ?? area.initial;
      const after = report.capacity.index[area.id] ?? before;
      const moved = after - before;

      return (
        `<li data-direction="${moved > 0 ? "up" : moved < 0 ? "down" : "flat"}">` +
        `<span>${escapeHtml(area.label)}</span>` +
        `<b data-numeric>${seats(after)}</b>` +
        `<small data-numeric>${signed(moved, 1)}</small>` +
        `</li>`
      );
    })
    .join("");

  return (
    `<p class="report__legend">${escapeHtml(UI.report.country)}</p>` +
    `<ul class="report__country">${rows}</ul>`
  );
}
