/* GABINETE — a mesa de trabalho, e ela nao e mais um painel.
   ⚠ ELA ERA SEIS BLOCOS DO MESMO TAMANHO numa grade que reflui, com vinte leituras e ZERO
   controle, ocupando 55% do tabuleiro. O filtro que a cortou e um so: cada linha tem de mudar
   uma decisao que o jogador esta prestes a tomar. Vinte viraram seis.
   ⚠ E AS ZONAS TEM LUGAR FIXO, e nao refluem: o que se assina ocupa o centro, o que se
   consulta fica na margem, a promessa em cima e o prazo no pe. Numa grade que reflui o
   telefone muda de lado quando a janela encolhe.
   ⚠ A LINGUA E A DA CAIXA, e a guarda `annexes` a fecha: nada de tabela, nada de regua
   desenhada aqui dentro. Quem desenha regua e a peca; a tela pede. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent, signed } from "../shared/format.mjs";
import { lineHtml, linesHtml, noteHtml } from "../shared/annex.mjs";
import { directionOf } from "../shared/trend.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../domain/opinion/index.mjs").Approval} Approval
 * @typedef {import("../../application/platform.mjs").Verdict} Verdict
 */

/**
 * @param {object} input
 * @param {string} input.body
 * @param {string} [input.span] `lead` ocupa a coluna da esquerda
 * @returns {string}
 */
function cardHtml({ body, span }) {
  return (
    `<section class="card"${span ? ` data-span="${span}"` : ""}>` +
    `<div class="card__body">${body}</div>` +
    `</section>`
  );
}

/**
 * A CAIXA DE ENTRADA — ela ocupa a tela inteira, e e outra tela.
 *
 * @param {object} input
 * @param {boolean} input.resolved se ALGUM mes ja foi resolvido. ⚠ Ele existe para o
 * estado vazio escolher a frase verdadeira, e sai do MES do estado e nao do relatorio
 * em memoria: o relatorio nao vai para o save, e o mes vai
 * @param {string} input.inbox a BANDEJA ja montada — lista e oficio aberto —, e vazia
 * enquanto o mundo nao escreve
 * @returns {string}
 */
export function emailHtml(input) {
  /* ── A CAIXA OCUPA A TELA INTEIRA ───────────────────────────────────────── ⚠ O VAZIO
     OCUPA A COLUNA, e nao um paragrafo no alto dela: num vao de 700px o paragrafo encostado
     no teto le como carregamento que travou. A chamada vem antes da explicacao porque ela
     responde em cinco palavras a pergunta que o olho faz primeiro. */
  const inbox = cardHtml({
    span: "lead",
    body:
      input.inbox === ""
        ? `<div class="empty">` +
          `<p class="empty__lead">` +
          `${escapeHtml(input.resolved ? UI.inbox.quietLead : UI.inbox.firstLead)}</p>` +
          `<p class="empty__note">` +
          (input.resolved ? "" : `${escapeHtml(UI.cabinet.inboxSigned)} `) +
          `${escapeHtml(UI.cabinet.inboxWaiting)}</p>` +
          `</div>`
        : input.inbox,
  });

  return `<section class="area cabinet"><div class="cards">${inbox}</div></section>`;
}

/**
 * A MESA — quatro objetos com lugar fixo.
 *
 * @param {object} input
 * @param {number} input.base cadeiras que respondem ao governo
 * @param {number} input.seats o plenario inteiro
 * @param {number} input.majority
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.mandatory a despesa obrigatoria anualizada
 * @param {number} input.revenue a receita anualizada
 * @param {number} input.ratio a fracao do pedido que o rateio honra, de 0 a 1
 * @param {Approval} input.standing a pesquisa do pais inteiro, ja pesada
 * @param {ReadonlyArray<{ id: string, label: string, short?: string }>} input.areas as oito
 * @param {ReadonlyArray<string>} input.protect quais o decreto deste mes poupa
 * @param {ReadonlyArray<Verdict>} input.platform os compromissos da posse, ja julgados
 * @param {number} input.betrayal quanto a promessa quebrada cobra de humor por mes,
 * perguntado a `betrayalCost` — a tela nao multiplica a fracao pelo parametro
 * @param {{ lobbies: ReadonlyArray<{ id: string, label: string, wants: string,
 * share: number, pressure: number, boiling: boolean, boil: number,
 * fall: number | null }>,
 * rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 * ruptures: ReadonlyArray<{ id: string, value: number, threshold: number,
 * breaks: string, open: boolean }>,
 * impeachment: number | null, fallen: number | null }} input.boiler a CALDEIRA
 * @param {{ now: ReadonlyArray<{ id: string, label: string, what: string }>,
 * soon: ReadonlyArray<{ id: string, label: string, what: string, due: number }> }} [input.calendar]
 * @param {{ pressure: Record<string, number>, standing?: Approval } | null} [input.before] o
 * quadro do mes passado, e ele NAO vem do save: e a memoria de uma pintura
 * @returns {string}
 */
export function cabinetHtml(input) {
  return (
    `<section class="area cabinet">` +
    `<div class="desk">` +
    `<div class="desk__band">${pledgeBand(input)}</div>` +
    `<div class="desk__sign">${signHtml(input)}</div>` +
    `<div class="desk__margin">${marginHtml(input)}</div>` +
    `<div class="desk__when">${whenHtml(input)}</div>` +
    `</div>` +
    `</section>`
  );
}

/**
 * A FAIXA DE CIMA — o que ele prometeu, e o que a promessa quebrada cobra.
 *
 * ⚠ ELA LIGA UM CANAL QUE RODAVA CEGO: `breachOf` e recalculado todo turno e nenhuma tela o
 * lia. O jogador escolhia tres compromissos no mes 1 e so os reencontrava no mes 48 — o
 * unico criterio do jogo, invisivel durante o jogo inteiro.
 *
 * @param {Parameters<typeof cabinetHtml>[0]} input
 * @returns {string}
 */
function pledgeBand({ platform, betrayal }) {
  if (platform.length === 0) return noteHtml(UI.cabinet.pledgeLegend, UI.cabinet.pledgeNone);

  const broken = platform.filter(verdict => verdict.kept === false).length;

  const rows = platform
    .map(verdict =>
      lineHtml({
        who: verdict.label,
        aside: verdict.judged,
        value:
          verdict.kept === false
            ? UI.cabinet.pledgeBroken
            : verdict.kept === true
              ? UI.cabinet.pledgeKept
              : UI.cabinet.pledgeOpen,
        ...(verdict.kept === false ? { tone: "crisis" } : {}),
      }),
    )
    .join("");

  /* ⚠ O PRECO SO IMPRIME QUANDO EXISTE, pela mesma regra do resto da tela: uma linha que diz
     "custa 0,00 todo mes" ensina o olho a pular a linha, e ai, no mes em que ela passar a
     cobrar, ela aparece onde o jogador ja parou de ler. */
  const foot =
    broken > 0
      ? `<p class="desk__price"><b class="stamp">` +
        `${escapeHtml(UI.cabinet.pledgeCount(broken, platform.length))}</b> ` +
        `<b data-numeric>${escapeHtml(signed(-betrayal, 2))}</b> ` +
        `${escapeHtml(UI.cabinet.pledgeCost)}</p>`
      : "";

  return linesHtml(UI.cabinet.pledgeLegend, rows, { foot, icon: "risk" });
}

/**
 * ⭐ O CENTRO — o que se assina. Hoje mora uma caneta so.
 *
 * ⚠ A PASTA E UMA LISTA, E NAO UMA TELA POR CANETA: no dia em que a MP e o decreto
 * tributario existirem, eles entram como irmaos desta linha e nada aqui muda de forma.
 *
 * @param {Parameters<typeof cabinetHtml>[0]} input
 * @returns {string}
 */
function signHtml({ areas, protect, ratio }) {
  /* ⚠ A NOTA DIZ O PRECO NOS DOIS ESTADOS: com area poupada ela diz quem paga; sem nenhuma,
     ela diz quanto do pedido o mes honra. Um botao que so dissesse "proteger" seria a jogada
     sem preco, que e o que esta folha proibe por escrito. */
  const note =
    protect.length > 0
      ? UI.area.decreeCost
      : ratio < 1
        ? `${UI.area.decreeHonours} ${percent(ratio)} ${UI.area.decreeAsked}`
        : UI.area.decreeWhole;

  const doors = areas
    .map(area => {
      const spared = protect.includes(area.id);
      return (
        `<button class="decree" type="button" aria-pressed="${spared}" ` +
        `data-protect="${escapeHtml(area.id)}">` +
        `${escapeHtml(area.short ?? area.label)}</button>`
      );
    })
    .join("");

  return (
    `<section class="pen">` +
    `<h2 class="pen__legend">${escapeHtml(UI.cabinet.signLegend)}</h2>` +
    `<b class="pen__name">${escapeHtml(UI.cabinet.penDecree)}</b>` +
    `<p class="pen__note">${escapeHtml(note)}</p>` +
    `<div class="pen__doors">${doors}</div>` +
    `</section>`
  );
}

/**
 * A MARGEM — as seis leituras que mudam uma assinatura.
 *
 * ⚠ ELAS ERAM VINTE, e o filtro que as cortou e uma pergunta so: este numero muda o que ele
 * esta prestes a assinar? A aposentadoria em reais nao muda — ela e estrutura, e mora em
 * Financas. Os quatro grupos um a um nao mudam — ele age sobre o PIOR, e os outros tres sao
 * consulta. A rua repartida em tres faixas nao muda — enquanto se assina, a rua e UM numero.
 *
 * @param {Parameters<typeof cabinetHtml>[0]} input
 * @returns {string}
 */
function marginHtml(input) {
  const locked = input.revenue > 0 ? Math.min(1, input.mandatory / input.revenue) : 0;

  /* ⚠ O PIOR GRUPO, E NAO OS QUATRO: quem esta mais perto do proprio ponto de fervura, medido
     em fracao do limiar dele. Comparar pressao crua poria na frente o grupo que ferve a 90
     em vez do que ferve a 40 e ja esta em 38. */
  const worst = [...input.boiler.lobbies].sort(
    (one, other) => other.pressure / (other.boil || 1) - one.pressure / (one.boil || 1),
  )[0];

  const process =
    input.boiler.fallen !== null
      ? { value: UI.cabinet.fallen, tone: "crisis" }
      : input.boiler.impeachment !== null
        ? { value: UI.cabinet.siege, tone: "crisis" }
        : { value: UI.cabinet.processNone };

  const rows =
    /* ⚠ SEM BARRA, e a ausencia e honesta: nao existe teto MENSAL contra o que medir o que
       sobra — o teto do arcabouco mede o ano. */
    lineHtml({ who: UI.cabinet.vaultFree, value: money(input.room) }) +
    lineHtml({
      who: UI.cabinet.vaultLocked,
      share: locked * 100,
      value: percent(locked),
      aside: `${UI.cabinet.vaultOfRevenue} ${money(input.revenue)}`,
      label: `${percent(locked)} ${UI.cabinet.vaultLocked}`,
    }) +
    lineHtml({
      who: UI.cabinet.baseLine,
      share: (input.base / input.seats) * 100,
      mark: (input.majority / input.seats) * 100,
      danger: "below",
      past: input.base < input.majority,
      /* ⚠ A BASE E FRACIONARIA NO MOTOR — o alcance de cada lider e uma fracao da bancada —,
         e a leitura escrita tem de ser a MESMA que a regua desenha. */
      value: String(Math.round(input.base)),
      aside: `${UI.cabinet.ofNeeded} ${input.majority}`,
      label: `${UI.cabinet.baseLine}: ${Math.round(input.base)} ${UI.cabinet.ofNeeded} ${input.majority}`,
    }) +
    (worst
      ? lineHtml({
          who: worst.label,
          share: worst.pressure,
          mark: worst.boil,
          danger: "above",
          past: worst.boiling,
          trend: directionOf(worst.pressure, input.before?.pressure[worst.id], -1),
          value: String(Math.round(worst.pressure)),
          aside: `${UI.cabinet.boilerBreaksShort} ${worst.boil}`,
          ...(worst.boiling ? { tone: "crisis" } : {}),
        })
      : "") +
    lineHtml({
      who: UI.cabinet.approvalLine,
      share: input.standing.good,
      trend: directionOf(input.standing.good, input.before?.standing?.good, 1),
      value: `${input.standing.good}%`,
      label: `${input.standing.good}% ${UI.approvalParts.good}`,
    }) +
    lineHtml({ who: UI.cabinet.processLine, ...process });

  return linesHtml(UI.cabinet.marginLegend, rows, { icon: "estado" });
}

/* ⚠ O TETO DO PRAZO, e ele existe porque a mesa NAO ROLA. Os outros tres objetos tem numero
   fixo de linhas; este era o unico que crescia sozinho: num mes em que dois marcos vencem e
   tres se aproximam, ele pediria cinco linhas no pe da tela. */
const PRAZOS = 2;

/**
 * O PE — o que o mes cobra, e o que o trimestre ja cobra.
 *
 * ⚠ O QUE VENCE AGORA E LEITURA, e o que vem e QUALIFICADOR: uma linha por marco do trimestre
 * dobraria a faixa. O prazo vai ao lado do nome, como o limiar do risco ja vai.
 *
 * @param {Parameters<typeof cabinetHtml>[0]} input
 * @returns {string}
 */
function whenHtml(input) {
  const agenda = input.calendar;
  if (!agenda) return "";

  const rows =
    agenda.now.length === 0 && agenda.soon.length === 0
      ? lineHtml({ who: UI.cabinet.calendarNone, value: "" })
      : /* ⚠ O QUE A LINHA MOSTRA E O PRAZO, e nao a explicacao: `what` e uma frase de catalogo,
           e numa celula de valor de largura fixa ela saiu cortada em "receitas e despes". Ela
           vira o rotulo de leitor de tela — quem enxerga le a data, quem ouve le a frase. */
        agenda.now
          .slice(0, PRAZOS)
          .map(mark =>
            lineHtml({
              who: mark.label,
              value: UI.cabinet.calendarNow,
              tone: "crisis",
              label: `${mark.label}: ${mark.what}`,
            }),
          )
          .join("") +
        /* O QUE VENCE AGORA TEM PRECEDENCIA sobre o que vem: o teto e da faixa, e nao de cada
           metade. Num mes cheio o trimestre cala, e quem cala e a metade menos urgente. */
        agenda.soon
          .slice(0, Math.max(0, PRAZOS - agenda.now.length))
          .map(mark =>
            lineHtml({
              who: mark.label,
              value: UI.cabinet.calendarIn(mark.due),
              label: `${mark.label}: ${mark.what}`,
            }),
          )
          .join("");

  return linesHtml(UI.cabinet.blockCalendar, rows, { icon: "estado" });
}
