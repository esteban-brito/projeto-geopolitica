/* A BARRA SUPERIOR — os sinais vitais, e eles nunca somem da tela. */

import { escapeHtml } from "./html.mjs";
import { money, percent, seats } from "./format.mjs";
import { iconHtml } from "./icons.mjs";
import { UI } from "../strings.mjs";
import { monthParts } from "../../state/state.mjs";

/** @typedef {import("../../state/state.mjs").GameState} GameState */
/** @typedef {import("../../data/calendar.mjs").Landmark} Landmark */

/* ⚠ A REFERENCIA E DE PREVIA e nao do motor: a regua de verdade sai das constantes de escala
   de Financas, e traze-las para ca seria uma segunda verdade sobre volatilidade. */
const REFERENCE = 0.25;
const SPARK_W = 88;

/**
 * A FAISCA — o mandato no eixo X, e o movimento no eixo Y.
 *
 * ⛔ O EIXO X ERA A SERIE, e isso mentia sobre o tempo: com tres meses a linha ja cruzava a
 * largura inteira e o ponto nascia na direita, como se o mandato tivesse acabado. Agora o
 * eixo e o MANDATO, e o trilho mostra desde o mes 1 o caminho que o ponto ainda vai andar.
 * ⭐ E o sinal vai so no ponto: quatro linhas coloridas viram quatro alarmes.
 *
 * @param {number[]} series
 * @param {number} good 1 quando subir e bom, -1 quando subir e ruim
 * @param {number} horizon quantos meses o mandato inteiro tem
 * @param {number} [from] o mes do PRIMEIRO ponto, para a serie curta cair no lugar certo
 * @returns {string}
 */
function sparkHtml(series, good, horizon, from = 0) {
  const drawn = series.length > 1;
  const min = drawn ? Math.min(...series) : 0;
  const max = drawn ? Math.max(...series) : 0;
  const mean = drawn ? series.reduce((a, b) => a + b, 0) / series.length : 0;
  const relative = mean === 0 ? 0 : (max - min) / Math.abs(mean);
  const height = Math.min(1, relative / REFERENCE) * 9;
  const spread = max - min || 1;
  const base = 6 + height / 2;
  /* ⛔ O EIXO E O MES E NAO O INDICE, e a diferenca so aparece na serie CURTA: a aprovacao
     vem dos cartoes do mes, que o motor limita a 24. Desenhada do indice zero, ela punha
     os dois ultimos anos no lugar dos dois primeiros — no mes 36 o ponto dela parava na
     metade do trilho enquanto o do PIB estava a tres quartos, no mesmo mes. */
  /** @param {number} i @returns {number} */
  const at = i => ((from + i) / Math.max(1, horizon - 1)) * SPARK_W;

  const points = drawn
    ? series
        .map(
          (value, i) =>
            `${at(i).toFixed(1)},${(base - ((value - min) / spread) * height).toFixed(2)}`,
        )
        .join(" ")
    : "";
  const last = drawn ? (points.split(" ").pop() ?? "0,6").split(",") : ["0", "6"];
  const delta = drawn ? (series[series.length - 1] ?? 0) - (series[0] ?? 0) : 0;
  const sign = !drawn || Math.abs(delta) < 1e-9 ? "flat" : delta * good > 0 ? "up" : "down";

  return (
    `<svg class="vit__spark" viewBox="0 0 90 12" preserveAspectRatio="none" aria-hidden="true">` +
    `<line class="vit__track" x1="0" y1="6" x2="${SPARK_W}" y2="6" ` +
    `vector-effect="non-scaling-stroke"/>` +
    (drawn
      ? `<polyline points="${points}" fill="none" stroke="currentColor" stroke-width="1.4" ` +
        `stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`
      : "") +
    `<circle cx="${last[0]}" cy="${last[1]}" r="1.9" class="vit__end" data-sign="${sign}"/></svg>`
  );
}

/**
 * O MEDIDOR — para a leitura que tem LIMIAR em vez de historia.
 *
 * ⭐ A MARCA DA MAIORIA ERA UM RISCO SEM SIGNIFICADO, e o conserto nao e texto, e FORMA: o
 * preenchimento troca de cor no limiar, e o risco passa a ser lido como "e aqui que a cor
 * muda" sem uma palavra a mais.
 *
 * @param {number} value
 * @param {number} total
 * @param {number} mark
 * @returns {string}
 */
function meterHtml(value, total, mark) {
  return (
    `<div class="vit__meter"><i style="width:${((value / total) * 100).toFixed(1)}%"></i>` +
    `<b style="left:${((mark / total) * 100).toFixed(1)}%"></b></div>`
  );
}

/**
 * O QUANDO — o mes em cima, o prazo mais proximo embaixo.
 *
 * @param {object} input
 * @param {number} input.month
 * @param {{ label: string, due: number } | null} input.deadline o marco mais proximo
 * @param {number} input.left quantos meses restam de mandato
 * @param {boolean} input.over
 * @returns {string}
 */
export function whenHtml({ month, deadline, left, over }) {
  const { name, year } = monthParts(month);
  /* ⚠ SEM PRAZO A LINHA NAO FICA VAZIA: ela volta a dizer o que a barra sempre disse — o que
     resta de mandato. Uma peca que muda de altura conforme o calendario empurra a barra
     inteira, e a linha de baixo e o que da largura ao bloco. */
  const note = over
    ? `<b>${escapeHtml(UI.closing.ended)}</b>`
    : deadline
      ? `<b>${escapeHtml(deadline.label)}</b><em class="when__rule"></em>` +
        `<i>${deadline.due === 0 ? escapeHtml(UI.closing.now) : `${deadline.due} ${escapeHtml(deadline.due === 1 ? UI.window.month : UI.window.months)}`}</i>`
      : `<b>${left}</b><em class="when__rule"></em>` +
        `<i>${escapeHtml(left === 1 ? UI.closing.monthLeft : UI.closing.monthsLeft)}</i>`;

  return (
    `<span class="when__date"><b>${escapeHtml(name)}</b><i>${year}</i></span>` +
    `<span class="when__note">${note}</span>`
  );
}

/**
 * OS SINAIS VITAIS — quatro leituras, cada uma com o desenho que ela pode sustentar.
 *
 * ⚠ NENHUM DESENHO E INVENTADO. PIB e inflacao tem serie no motor; aprovacao e base tem a
 * delas nos cartoes do mes; a base ainda tem limiar, e por isso ela desenha medidor e nao
 * faisca. Sem historia a linha nao existe — o que existe e o ponto, e ele fica cinza.
 *
 * @param {object} input
 * @param {{ gdp: number, inflation: number }} input.macro
 * @param {number} input.approval "otimo/bom", em pontos
 * @param {number} input.base cadeiras que respondem ao governo
 * @param {number} input.majority
 * @param {number} input.seatsTotal
 * @param {number} input.streetFloor a aprovacao abaixo da qual a rua rompe, do catalogo
 * @param {number} input.ceiling o teto da banda de inflacao, do catalogo
 * @param {number} input.horizon o mandato inteiro, em meses — o eixo X das faiscas
 * @param {number} input.approvalFrom o mes do primeiro ponto da serie de aprovacao
 * @param {{ gdp: number[], inflation: number[], approval: number[] }} input.series
 * @returns {string}
 */
export function vitalsHtml({
  macro,
  approval,
  base,
  majority,
  seatsTotal,
  streetFloor,
  ceiling,
  horizon,
  approvalFrom,
  series,
}) {
  /* ⛔ OS DOIS LIMIARES ERAM DAQUI, e os dois tinham envelhecido: a rua acendia em 20
     enquanto o catalogo rompe em 16, e a inflacao acendia em 7,5% enquanto Financas acusa
     desde 4,5%. Numero de catalogo copiado para dentro da tela e a segunda verdade, e ela
     nao e recalibrada junto. */
  const items = [
    {
      icon: "gdp",
      label: UI.vitals.gdp,
      value: money(macro.gdp),
      /* CRESCER E BOM: o sinal do delta e o sinal da leitura. */
      draw: sparkHtml(series.gdp, 1, horizon),
      low: false,
    },
    {
      icon: "prices",
      label: UI.vitals.inflation,
      value: percent(macro.inflation, 1),
      /* ⚠ INFLACAO SUBINDO E RUIM, e por isso o sinal se inverte. */
      draw: sparkHtml(series.inflation, -1, horizon),
      low: macro.inflation > ceiling,
    },
    {
      icon: "opinion",
      label: UI.vitals.approval,
      value: `${seats(approval)}%`,
      draw: sparkHtml(series.approval, 1, horizon, approvalFrom),
      low: approval < streetFloor,
    },
    {
      icon: "congress",
      label: UI.vitals.base,
      value: seats(base),
      draw: meterHtml(base, seatsTotal, majority),
      low: base < majority,
    },
  ];

  return items
    .map(
      item =>
        `<div class="vit${item.low ? " vit--low" : ""}">` +
        `<span class="vit__icon">${iconHtml(item.icon, "icon")}</span>` +
        `<span class="vit__label">${escapeHtml(item.label)}</span>` +
        `<span class="vit__value" data-numeric>${escapeHtml(item.value)}</span>` +
        `<span class="vit__draw">${item.draw}</span></div>`,
    )
    .join("");
}
