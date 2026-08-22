/* O FECHO DO MANDATO — a última tela, e ela é a mesma nas duas saídas. View PURA.
   ══════════════════════════════════════════════════════════════════════════════

   ── POR QUE ELA NASCEU ───────────────────────────────────────────────────────
   Porque uma partida jogada até o fim não terminava. O governo passivo cai no mês
   47, e a única coisa que a tela dizia sobre isso era um selo de dez pixels no
   canto de um cartão da coluna da direita. O botão AVANÇAR O MÊS continuava aceso,
   do mesmo tamanho e da mesma cor de sempre; clicar nele não fazia nada e não
   explicava por quê. Um mandato que acaba sem fecho não é uma partida — é uma
   planilha que parou.

   ⚠ ELA NÃO É UMA TELA DE DERROTA, e essa decisão precede esta view: `state.mjs`
   já escrevia que "a partida JÁ é um mandato de 48 meses, sem vitória e sem placar,
   então fim de jogo não é o oposto de nada. Cair é o mandato terminar antes, e o
   que muda é a data". Por isso há um fecho só, e as duas saídas dele diferem no
   MOTIVO e no MÊS — nunca no tom, nunca na forma, e nunca num placar.

   ── O QUE ELA RESPONDE, e a ordem é a das perguntas ──────────────────────────
     1. acabou, e por quê — o carimbo, e a data;
     2. o que eu deixei — os oito índices da posse ao fim, e a dívida;
     3. o que eu escrevi — as leis que sobreviveram à tramitação;
     4. quem me abandonou — os grupos que ferveram e não voltaram;
     5. jogar de novo.

   ⚠ NENHUM NÚMERO NASCE AQUI. Todos vêm de `termOf`, que pergunta ao estado e ao
   catálogo — o índice de abertura é o `initial` do catálogo, a dívida herdada é
   `fiscal.initialDebtRatio` com fonte, e as leis são as normas com mês de
   promulgação acima de zero. Esta view formata e não calcula, como toda outra.

   ── A FORMA É A DA RUBRICA, e não a do painel ────────────────────────────────
   O ciclo 11 decidiu que o registro deste jogo é institucional e não de aplicativo:
   fio em vez de raio, número em coluna, e a data mandando. O fecho é o lugar onde
   isso importa mais — é uma prestação de contas, e prestação de contas tem forma de
   documento. */

import { escapeHtml } from "../shared/html.mjs";
import { num, percent, signed } from "../shared/format.mjs";
import { headHtml } from "../shared/head.mjs";
import { UI } from "../strings.mjs";
import { monthLabel } from "../../state/state.mjs";

/** @typedef {import("../../application/turn.mjs").Term} Term */

/**
 * UMA LINHA DE RUBRICA: o que é, quanto era, quanto ficou, e o quanto andou.
 *
 * ⚠ O SINAL DA VARIAÇÃO É O SINAL DA LEITURA em toda linha menos a da dívida, e
 * por isso o tom é PARÂMETRO e não derivado do número. Um índice que sobe é uma
 * área que entrega mais; uma dívida que sobe é a conta que o próximo paga, e uma
 * função que lesse só o sinal pintaria as duas de verde.
 *
 * @param {object} input
 * @param {string} input.label
 * @param {string} input.note o que o número mede
 * @param {string} input.from
 * @param {string} input.to
 * @param {number} input.delta
 * @param {boolean} [input.rising] se subir é bom; `true` por omissão
 * @returns {string}
 */
function rowHtml({ label, note, from, to, delta, rising = true }) {
  const good = delta === 0 ? "flat" : delta > 0 === rising ? "up" : "down";
  return (
    `<div class="closing__row" data-direction="${good}">` +
    `<span class="closing__label">${escapeHtml(label)}` +
    `<small>${escapeHtml(note)}</small></span>` +
    `<span class="closing__from" data-numeric>${escapeHtml(from)}</span>` +
    `<span class="closing__arrow" aria-hidden="true">→</span>` +
    `<span class="closing__to" data-numeric>${escapeHtml(to)}</span>` +
    `<span class="closing__delta" data-numeric>${escapeHtml(signed(delta))}</span>` +
    `</div>`
  );
}

/**
 * O FECHO INTEIRO.
 *
 * @param {Term} term o mandato, perguntado a `termOf`
 * @returns {string}
 */
export function closingHtml(term) {
  const removed = term.ending === "removed";
  const copy = UI.closing;

  /* ⚠ A DATA É DO MÊS EM QUE ACABOU, e não do mês corrente. São o mesmo hoje
     porque o turno para no instante do afastamento — e se um dia deixarem de ser,
     o fecho datará o afastamento, que é o que ele afirma estar datando. */
  const when = monthLabel(term.months);

  const areas = term.areas
    .map(area =>
      rowHtml({
        label: area.label,
        note: area.index,
        from: num(area.from, 0),
        to: num(area.to, 0),
        delta: Math.round(area.to - area.from),
      }),
    )
    .join("");

  const debt = rowHtml({
    label: copy.debt,
    note: copy.debtNote,
    from: percent(term.debt.from),
    to: percent(term.debt.to),
    delta: Math.round((term.debt.to - term.debt.from) * 100),
    /* SUBIR É RUIM AQUI, e é a única linha do fecho em que é. */
    rising: false,
  });

  /* ⚠ AS LEIS SÃO CONTADAS E NOMEADAS, e as duas coisas importam. O número
     responde "eu governei?" e a lista responde "governei o quê" — e num mandato de
     quarenta e seis meses o número sozinho já foi zero mais de uma vez. */
  const laws = term.laws.length
    ? `<ol class="closing__laws">` +
      term.laws
        .map(
          law =>
            `<li><span class="closing__law">${escapeHtml(law.label)}</span>` +
            `<span class="closing__when">${escapeHtml(monthLabel(law.month))}</span></li>`,
        )
        .join("") +
      `</ol>`
    : /* ⚠ AUSÊNCIA DECLARADA, e não ausência disfarçada — a distinção é regra do
         projeto e ela tem lugar aqui: um mandato sem uma lei escrita é um fato
         sobre o governo, e não uma falha da tela. E ela usa a MESMA peça de
         ausência do resto do jogo, no peso discreto: o fecho é um documento, e um
         fato consumado dentro dele não pede chamada centrada. */
      `<div class="empty empty--quiet"><p class="empty__note">` +
      `${escapeHtml(copy.noLaws)}</p></div>`;

  const abandoned = term.abandoned.length
    ? `<p class="closing__abandoned">${escapeHtml(copy.abandoned)} ` +
      `<b>${escapeHtml(term.abandoned.join(", "))}</b></p>`
    : `<p class="closing__abandoned">${escapeHtml(copy.noneAbandoned)}</p>`;

  return (
    `<section class="stage closing">` +
    headHtml({
      title: copy.title,
      reading: { label: copy.months, value: `${term.months} de ${term.of}` },
    }) +
    `<p class="closing__stamp"><b class="stamp">${escapeHtml(
      removed ? copy.removed : copy.served,
    )}</b> ` +
    `${escapeHtml(removed ? copy.removedNote : copy.servedNote)} — ` +
    `<time>${escapeHtml(when)}</time></p>` +
    `<h3 class="block__legend">${escapeHtml(copy.country)}</h3>` +
    `<div class="closing__rows">` +
    rowHtml({
      label: copy.approval,
      note: copy.approvalNote,
      from: `${num(term.approval.from, 0)}%`,
      to: `${num(term.approval.to, 0)}%`,
      delta: Math.round(term.approval.to - term.approval.from),
    }) +
    debt +
    areas +
    `</div>` +
    /* ⚠ A LEGENDA E A MESMA DE TODA TELA, e o fecho tinha a propria ate ela ser a
       DECIMA forma de legenda do jogo. `.block__legend` reparte em duas pontas, e a
       contagem cai a direita — no mesmo lugar em que a tela de area poe o que aquela
       area custa. */
    `<h3 class="block__legend">${escapeHtml(copy.written)} ` +
    `<span class="closing__count">${term.laws.length}</span></h3>` +
    laws +
    abandoned +
    `</section>`
  );
}
