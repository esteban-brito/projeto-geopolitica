/* A TELA DE AREA — um molde, seis instancias. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════

   ── TRES VERBOS, SEMPRE NESTA ORDEM ──────────────────────────────────────────
   E a ordem nao e arbitraria: ela e o CUSTO DE EXECUTAR cada um.

     ALOCAR   nao precisa de ninguem. Verba do discricionario, todo mes;
     PAUTAR   precisa do Congresso — ou de uma canetada, e a canetada cobra
              atrito em vez de voto;
     VIGENTE  ja foi decidido, e so cobra.

   Quem le a tela de cima para baixo le da acao mais barata para a mais cara, e
   termina na conta que as decisoes passadas continuam mandando todo mes.

   ── A LINHA QUE FAZ A TELA VIRAR DECISAO ─────────────────────────────────────
   "26,9 disponiveis · 18,1 ja prometidos as outras areas".

   Sem ela seriam seis controles independentes, e mover um nao significaria nada.
   Com ela, investir na saude e NAO investir na seguranca — porque a bolsa e uma
   so, e a emenda para o Congresso sai da mesma. E a unica linha da tela que
   transforma um slider numa escolha.

   ── O INDICE MOSTRA TENDENCIA, E NAO SO NIVEL ────────────────────────────────
   `61` sozinho nao diz nada. `61 ▁▂▃▃▂▁ −24 em 12 meses` diz que o jogador esta
   afundando a saude ha um ano — que e a informacao que ele precisa para decidir,
   e nao o numero de hoje. */

import { escapeHtml } from "../shared/html.mjs";
import { attr, money, seats, signed, sparkline } from "../shared/format.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../data/bills.mjs").Bill} Bill
 */

/**
 * @param {Record<string, string>} table
 * @param {string} key
 */
function labelOf(table, key) {
  return table[key] ?? key;
}

/**
 * Uma acao disponivel. O instrumento e ETIQUETA na linha, e nao tela propria:
 * quem quer mexer na saude nao precisa saber antes se aquilo e lei, emenda ou
 * decreto — mas precisa ver, porque e o que decide o preco.
 *
 * @param {object} input
 * @param {Bill} input.bill
 * @param {number} input.quorum
 * @param {boolean} input.onTable
 * @returns {string}
 */
function actionHtml({ bill, quorum, onTable }) {
  const verb = bill.instrument === "decree" ? "decretar" : "pautar";

  return (
    `<li class="action-row${onTable ? " action-row--live" : ""}">` +
    `<span class="action-row__name">${escapeHtml(bill.label)}</span>` +
    `<span class="badge" data-instrument="${escapeHtml(bill.instrument)}">` +
    `${escapeHtml(labelOf(UI.instrument, bill.instrument))}</span>` +
    `<span class="action-row__quorum" data-numeric>${quorum > 0 ? seats(quorum) : "—"}</span>` +
    `<span class="action-row__fiscal" data-numeric>${signed(bill.fiscalImpact)}</span>` +
    `<span class="action-row__lift" data-numeric>${signed(bill.impact)}</span>` +
    (onTable
      ? `<span class="action-row__live">${escapeHtml(UI.mesa.onTable)}</span>`
      : `<button class="action-row__pick" type="button" data-bill="${escapeHtml(bill.id)}">` +
        `${escapeHtml(verb)}</button>`) +
    `</li>`
  );
}

/**
 * A LEITURA da alocacao: o que muda enquanto o controle e arrastado.
 *
 * `parado: NN` e a metade que importa. Sem o contrafactual, o jogador ve o
 * indice subir e conclui que investir "funciona"; com ele, ve que dois tercos do
 * dinheiro estao apenas segurando o decaimento, e que o terco restante e o
 * unico que anda para frente.
 *
 * @param {object} input
 * @param {number} input.value
 * @param {number} input.allocation
 * @param {number} input.projected
 * @param {number} input.idle
 * @returns {string}
 */
export function allotReadHtml({ value, allocation, projected, idle }) {
  return (
    `<span class="allot__value" data-numeric>${money(allocation)}</span>` +
    `<span class="allot__projection" data-numeric>` +
    `${seats(value)} → ${seats(projected)}` +
    `<small>${escapeHtml(UI.area.holding)}: ${seats(idle)}</small>` +
    `</span>`
  );
}

/**
 * A tela inteira de uma area.
 *
 * @param {object} input
 * @param {Area} input.area
 * @param {number} input.value o indice corrente
 * @param {ReadonlyArray<number>} input.history
 * @param {ReadonlyArray<Bill>} input.available
 * @param {ReadonlyArray<Bill>} input.standing ja em vigor, desta area
 * @param {(bill: Bill) => number} input.quorumOf
 * @param {string | null} input.onTable
 * @param {number} input.allocation bilhoes pedidos para ESTA area
 * @param {number} input.room o discricionario do mes
 * @param {number} input.committed o que ja foi prometido fora desta area
 * @param {number} input.projected o indice ao fim do mes com esta alocacao
 * @param {number} input.idle o indice ao fim do mes sem alocacao nenhuma
 * @returns {string}
 */
export function areaHtml(input) {
  const { area, value, history } = input;

  /* A VARIACAO DE DOZE MESES, e nao a do mes: um passo de meio ponto e ruido, e
     doze passos na mesma direcao sao uma politica. */
  const past = history.length > 0 ? history : [value];
  const twelve = value - (past.length >= 12 ? (past.at(-12) ?? area.initial) : area.initial);

  const head =
    `<div class="area__head">` +
    `<div>` +
    `<p class="area__eyebrow">${escapeHtml(area.index)}</p>` +
    `<p class="area__value" data-numeric>${seats(value)}` +
    `<span class="area__spark" aria-hidden="true">${sparkline(past)}</span></p>` +
    `</div>` +
    /* A VARIACAO USA A PECA DE VARIACAO, e nao uma classe propria que repinta o
       mesmo verde. Duas regras para o mesmo conceito e como uma paleta comeca a
       divergir: a que ficar de fora do proximo ajuste vira a cor errada. */
    `<p class="trend area__delta"` +
    ` data-direction="${twelve > 0 ? "up" : twelve < 0 ? "down" : "flat"}"` +
    ` data-numeric>${signed(twelve)} <small>em 12 meses</small></p>` +
    `</div>`;

  /* O TETO DO CONTROLE e o que ainda cabe no mes, e nao um numero fixo: arrastar
     alem do que existe so produziria uma promessa que o rateio corta. */
  const ceiling = Math.max(input.allocation, Math.max(0, input.room - input.committed));

  const allocate =
    `<section class="area__block">` +
    `<h3 class="area__legend">${escapeHtml(UI.area.allocate)}</h3>` +
    `<div class="allot">` +
    /* `attr` E NAO `num`: o teto e o valor sao lidos pelo navegador, e virgula
       decimal num atributo numerico e valor invalido que ele descarta calado. */
    `<input class="allot__slider" type="range" min="0" max="${attr(ceiling)}" step="0.1" ` +
    `value="${attr(input.allocation)}" data-area="${escapeHtml(area.id)}" ` +
    `aria-label="${escapeHtml(`${UI.area.allocate} — ${area.label}`)}" />` +
    /* Mesma razao da mesa: o controle fica FORA do que se repinta, senao trocar o
       HTML no meio do arrasto arranca o elemento que o ponteiro esta segurando. */
    `<span class="allot__read" id="allotRead">` +
    allotReadHtml({
      value,
      allocation: input.allocation,
      projected: input.projected,
      idle: input.idle,
    }) +
    `</span>` +
    `</div>` +
    `<p class="allot__pool">` +
    `${escapeHtml(UI.area.ofMonth)} <b data-numeric>${money(input.room)}</b> ` +
    `${escapeHtml(UI.area.available)} · <b data-numeric>${money(input.committed)}</b> ` +
    `${escapeHtml(UI.area.committed)}` +
    `</p>` +
    `</section>`;

  /* AS TRES COLUNAS DE NUMERO PRECISAM DIZER O QUE SAO. Elas sao quorum em
     cadeiras, despesa obrigatoria em bilhoes por ano e pontos de indice — tres
     unidades diferentes, uma ao lado da outra. A legenda fica FORA da lista, e
     nao como primeira linha dela: uma `<li>` de cabecalho seria um item de lista
     que nao e um item, e quem lê por leitor de tela ouviria "acao 1 de 7".
     Ela tambem NAO e `aria-hidden`. Fora da lista ela e lida logo antes dela, e
     tres palavras na ordem das colunas e a unica pista que quem nao ve a tela
     tem para decifrar `308 · −140 · +8`. A forma completa seria uma tabela de
     verdade, com `<th>` por coluna — e ela e a proxima versao desta lista. */
  const columns =
    `<p class="action-head">` +
    `<span class="action-row__quorum">${escapeHtml(UI.area.quorum)}</span>` +
    `<span class="action-row__fiscal">${escapeHtml(UI.area.fiscal)}</span>` +
    `<span class="action-row__lift">${escapeHtml(UI.area.lift)}</span>` +
    `</p>`;

  const actions =
    `<section class="area__block">` +
    `<h3 class="area__legend">${escapeHtml(UI.area.propose)}</h3>` +
    (input.available.length === 0
      ? `<p class="area__empty">${escapeHtml(UI.area.nothingLeft)}</p>`
      : columns +
        `<ul class="action-list">` +
        input.available
          .map(bill =>
            actionHtml({
              bill,
              quorum: input.quorumOf(bill),
              onTable: bill.id === input.onTable,
            }),
          )
          .join("") +
        `</ul>`) +
    `</section>`;

  const bill = input.standing.reduce((sum, item) => sum + item.fiscalImpact, 0);

  const standing =
    `<section class="area__block">` +
    `<h3 class="area__legend">${escapeHtml(UI.area.standing)}` +
    (input.standing.length > 0
      ? `<span class="area__total" data-numeric>${escapeHtml(UI.area.total)} ` +
        `${signed(bill)}${escapeHtml(UI.area.perYear)}</span>`
      : "") +
    `</h3>` +
    (input.standing.length === 0
      ? `<p class="area__empty">${escapeHtml(UI.area.nothingStanding)}</p>`
      : `<ul class="action-list action-list--done">` +
        input.standing
          .map(
            item =>
              `<li class="action-row">` +
              `<span class="action-row__name">${escapeHtml(item.label)}</span>` +
              `<span class="badge" data-instrument="${escapeHtml(item.instrument)}">` +
              `${escapeHtml(labelOf(UI.instrument, item.instrument))}</span>` +
              `<span class="action-row__fiscal" data-numeric>` +
              `${signed(item.fiscalImpact)}${escapeHtml(UI.area.perYear)}</span>` +
              `</li>`,
          )
          .join("") +
        `</ul>`) +
    `</section>`;

  /* UMA LAMINA POR TELA. Os tres verbos sao secoes DENTRO da mesma peca, e nao
     tres cartoes soltos: eles disputam a mesma bolsa e se leem de cima para
     baixo como uma escala de custo — separa-los em caixas independentes
     desmancharia justamente a relacao que a tela existe para mostrar. */
  return `<section class="area glass-stage">${head}${allocate}${actions}${standing}</section>`;
}
