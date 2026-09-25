/* O DECRETO — o ato do mes, na pasta de despachos.

   ⭐ A FORMA E DO GOVERNO E A ESCRITA E DO JOGO, e a decisao foi dele. O que NAO se
   simplifica e o que todo brasileiro reconhece: "entra em vigor na data de sua publicacao" e
   reconhecimento, e nao juridiques.

   ⛔ ELE NAO CALCULA NADA. A bolsa e o rateio chegam prontos de `settlement`, que e a mesma
   funcao que o turno executa — a tela pergunta ao motor e nao refaz a conta.

   ⭐ E AS OITO PASTAS SAO MARCADAS NO PROPRIO PAPEL: o Art. 2 diz "as pastas marcadas ficam
   fora do corte", entao elas moram na frase que fala delas. Um presidente rabisca a minuta;
   ele nao opera um painel ao lado dela. */

import { escapeHtml } from "./html.mjs";
import { money, percent } from "./format.mjs";
import { MONTHS, UI } from "../strings.mjs";
import { monthParts } from "../../state/state.mjs";
import { protocolOf } from "./protocol.mjs";

/* 📗 A conta do fecho, conferida contra o Decreto no 664/1992, que saiu como
   "171o da Independencia e 104o da Republica". */
const INDEPENDENCE = 1822;
const REPUBLIC = 1889;
/* 📗 O DECRETO E NUMERADO, e a serie e a real: o Planalto passou de 12.000 em 2024. O primeiro do
   mandato leva o numero seguinte; e um rotulo do documento, e nao um valor do jogo. */
const FIRST_DECREE = 12_600;

/* A rubrica: um traco so, desenhado para ser percorrido pelo `stroke-dashoffset`. */
const SIGN_PATH =
  `<svg viewBox="0 0 420 46" preserveAspectRatio="none" aria-hidden="true">` +
  `<path d="M8 33 C 44 6, 66 41, 96 21 S 146 3, 174 27 C 196 45, 214 11, 242 25` +
  ` S 292 41, 318 19 C 336 5, 356 31, 380 23 L 412 27"/></svg>`;

/**
 * O ATO DO MES.
 *
 * @param {object} input
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.ratio a fracao do pedido que o rateio honra, de 0 a 1
 * @param {string} input.president quem assina
 * @param {string} input.chief quem referenda — o mesmo nome que assina a EM
 * @param {number} input.month o mes do mandato, de onde saem a data e o ano
 * @param {ReadonlyArray<{ id: string, label: string, short?: string }>} input.areas as oito
 * @param {ReadonlyArray<string>} input.protect quais o decreto deste mes poupa
 * @returns {string}
 */
export function decreeHtml({ room, ratio, president, chief, month, areas, protect }) {
  /* 📗 §5.1.3: mes em MINUSCULA, sem a sigla da UF e sem zero a esquerda no dia. O dia 5 e o
     do fecho do mes anterior, e nao uma escolha. */
  /* ⛔ E O ANO SAI DO MOTOR: ele estava teclado aqui, no parecer e em `monthParts`, e o
     catalogo ja o guardava em `REGIME.firstYear`. A tela pergunta. */
  const { year } = monthParts(month);
  const date = `5 de ${MONTHS[month % MONTHS.length]} de ${year}`;
  const number = (FIRST_DECREE + month).toLocaleString("pt-BR");
  const gazetteDay = `5.${(month % MONTHS.length) + 1}.${year}`;
  const folders = areas
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
    `<article class="sheet" data-signed="false">` +
    /* A MINUTA CORRE NO MESMO PROCESSO DA EM, e leva o mesmo NUP no alto. */
    `<p class="sheet__protocol">${escapeHtml(protocolOf(month).nup)}</p>` +
    `<header class="letterhead">` +
    `<img class="crest" src="/assets/coat-of-arms.webp" alt="">` +
    `<p class="letterhead__org"><b>${escapeHtml(UI.decree.presidency)}</b>` +
    `<span>${escapeHtml(UI.decree.chief)}</span>` +
    `<span>${escapeHtml(UI.decree.legal)}</span></p>` +
    `</header>` +
    `<p class="epigraph">${escapeHtml(UI.decree.title(number, date))}</p>` +
    `<p class="summary">${escapeHtml(UI.decree.summary)}</p>` +
    `<div class="act__body">` +
    `<p>${escapeHtml(UI.decree.preamble)}</p>` +
    `<p class="act__enacts">${escapeHtml(UI.decree.enacts)}</p>` +
    `<p>${escapeHtml(UI.decree.first(money(room), percent(ratio)))}</p>` +
    /* ⚠ AS OITO ENTRAM NA FRASE QUE FALA DELAS, e nao num bloco embaixo: o artigo diz "as
       pastas marcadas", e elas sao as marcas. */
    `<p>${escapeHtml(UI.decree.second)}<span class="act__folders">${folders}</span></p>` +
    `<p>${escapeHtml(UI.decree.third)}</p>` +
    `</div>` +
    `<p class="act__close">${escapeHtml(UI.decree.close(date, year - INDEPENDENCE + 1, year - REPUBLIC + 1))}</p>` +
    /* 📗 QUEM REFERENDA VEM SOB O PRESIDENTE, em caixa normal: e assim no DOU. */
    `<div class="signature">${SIGN_PATH}<b>${escapeHtml(president)}</b>` +
    `<span class="act__referendum">${escapeHtml(chief)}</span></div>` +
    `<p class="sheet__foot">${escapeHtml(UI.decree.gazette(gazetteDay))}</p>` +
    `</article>`
  );
}

/**
 * ARMA A RUBRICA — o traco so corre se o comprimento dele for medido no DOM.
 *
 * ⚠ `getTotalLength` so existe depois de o `<path>` estar na pagina, e por isso ela e uma
 * chamada a parte em vez de sair pronta do HTML.
 *
 * @param {Element | null} sheet
 */
export function armSignature(sheet) {
  const path = sheet?.querySelector(".signature path");
  if (!(path instanceof SVGPathElement)) return;
  path.style.setProperty("--stroke-len", String(path.getTotalLength()));
}
