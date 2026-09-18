/* O PARECER — a face esquerda da pasta, e ele e o que a Casa Civil junta a minuta.

   📗 NAO EXISTE "BOLETIM DA CASA CIVIL", e o ciclo 25 §3.2 pediu uma peca sem lastro. O que vai
   a mesa do presidente e a PASTA DE DESPACHO, e dentro dela a exposicao de motivos com o
   parecer de merito — hoje da Secretaria Especial de Analise Governamental.

   ⛔ E NADA AQUI E INSTRUMENTO DE TELA. Ordem dele: "nenhum elemento alem do que
   um ser humano escreveria, tipo essas barras, linhas". A primeira versao trouxe as reguas do
   vocabulario da Caixa para dentro do papel — e datilografo nao desenha barra. O numero mora na
   FRASE, e o limiar tambem: "38 de pressao, e ele sai em 40" diz o que a marca dizia.

   ⛔ O VOCATIVO E `Senhor Presidente da Republica`: o Decreto 9.758/2019 vedou "Vossa
   Excelencia" e "Excelentissimo", e o Manual de Redacao e de 2018 — norma nova vence manual. */

import { escapeHtml } from "./html.mjs";
import { money, percent } from "./format.mjs";
import { MONTHS, UI } from "../strings.mjs";
import { monthParts } from "../../state/state.mjs";
import { protocolOf } from "./protocol.mjs";

/* A rubrica da ministra: a EM chega ASSINADA, e o traco ja esta inteiro — sem `--stroke-len`
   o `dasharray` do decreto e invalido e o caminho pinta cheio. Outra mao, outro traco. */
const CHIEF_SIGN =
  `<svg viewBox="0 0 420 46" preserveAspectRatio="none" aria-hidden="true">` +
  `<path d="M22 36 C 18 8, 44 2, 50 16 C 56 30, 34 42, 24 34 C 40 30, 70 10, 92 22` +
  ` C 108 30, 118 8, 140 20 S 176 34, 198 18 C 214 6, 228 30, 250 22 S 286 10, 308 22` +
  ` C 326 32, 344 10, 366 16 S 398 28, 408 14"/></svg>`;

/**
 * ⚠ AS SEIS LEITURAS SAO AS DO FILTRO DO CICLO 21 — cada uma muda uma decisao que ele esta
 * prestes a tomar —, e aqui elas sao PARAGRAFOS. 📗 O Manual manda numerar a partir do segundo:
 * o primeiro nao leva numero.
 *
 * @param {object} input
 * @param {number} input.month o mes do mandato
 * @param {string} input.chief quem assina o parecer
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.mandatory a despesa presa por lei
 * @param {number} input.revenue a receita do mes
 * @param {number} input.base as cadeiras que apoiam
 * @param {number} input.majority quantas cadeiras decidem
 * @param {{ label: string, pressure: number, boil: number } | null} input.worst o grupo mais
 * perto do PROPRIO limiar, escolhido na composicao — nao e o de maior pressao
 * @param {number} input.standing a aprovacao, em pontos de 0 a 100 — a escala de `pollFrom`
 * @param {number | null} input.was a aprovacao do mes passado, na mesma escala, para o
 * paragrafo dizer quanto ela andou — e nao uma seta, que e desenho de tela
 * @param {boolean} input.she se quem assina o parecer e mulher, para o cargo concordar
 * @param {number | null} input.impeachment o mes em que o processo abriu
 * @returns {string}
 */
export function briefHtml(input) {
  /* ⛔ O ANO SAI DO MOTOR, e nao de uma constante desta folha — a mesma razao do decreto. */
  const { year } = monthParts(input.month);
  const date = `${UI.brief.city}, 5 de ${MONTHS[input.month % MONTHS.length]} de ${year}.`;

  /* 📗 A EM E NUMERADA POR ANO, e o processo dela no SEI leva o mesmo numero. */
  const { number, nup: protocol } = protocolOf(input.month);

  /* ⛔ A APROVACAO JA VEM EM PONTOS, e nao de 0 a 1: `pollFrom` arredonda para 0..100, e
     multiplicar de novo escreveu "4400%" na folha — a captura pegou. A fracao que `percent`
     espera sai da divisao por cem, e ela e feita UMA vez, aqui.
     ⚠ E A FRASE SO FALA DE MOVIMENTO QUANDO ELE EXISTE: "andou zero" e uma linha gasta. */
  const moved = input.was === null ? 0 : Math.round(input.standing - input.was);

  const paragraphs = [
    UI.brief.lead,
    UI.brief.treasury(money(input.room), money(input.mandatory), money(input.revenue)),
    UI.brief.chamber(input.base, input.majority),
    /* ⚠ PRESSAO ZERO NAO E "O MAIS PERTO DE ROMPER": no mes 1 ninguem esta perto, e a frase
       precisa dizer isso em vez de eleger um grupo que nao esta em lugar nenhum. */
    input.worst === null || input.worst.pressure < 1
      ? UI.brief.calm
      : UI.brief.pressure(
          input.worst.label,
          Math.round(input.worst.pressure),
          Math.round(input.worst.boil),
        ),
    UI.brief.street(percent(input.standing / 100)) +
      (moved === 0 ? "" : ` ${UI.brief.streetMoved(Math.abs(moved), moved > 0)}`),
    input.impeachment === null ? UI.brief.processNone : UI.brief.processOpen(input.impeachment),
  ];

  return (
    `<article class="sheet brief" data-signed="true">` +
    `<p class="sheet__protocol">${escapeHtml(protocol)}</p>` +
    `<header class="letterhead">` +
    `<img class="crest" src="/assets/brasao.webp" alt="">` +
    `<p class="letterhead__org"><b>${escapeHtml(UI.decree.presidency)}</b>` +
    `<span>${escapeHtml(UI.decree.chief)}</span>` +
    `<span>${escapeHtml(UI.brief.unit)}</span></p>` +
    `</header>` +
    `<p class="epigraph">${escapeHtml(UI.brief.kind(number, year))}</p>` +
    `<p class="brief__date">${escapeHtml(date)}</p>` +
    `<p class="brief__vocative">${escapeHtml(UI.brief.vocative)}</p>` +
    `<div class="act__body brief__body">` +
    /* 📗 O NUMERO DO PARAGRAFO E TEXTO, e nao marcador de lista: numa EM ele e digitado, na
       margem, e o texto comeca no recuo de paragrafo — como nos oficios reais, a partir do 1. */
    paragraphs
      .map((line, i) => `<p><span class="brief__mark">${i + 1}.</span>${escapeHtml(line)}</p>`)
      .join("") +
    `</div>` +
    `<p class="brief__close">${escapeHtml(UI.brief.close)}</p>` +
    `<div class="signature">${CHIEF_SIGN}<b>${escapeHtml(input.chief)}</b>` +
    `<span class="brief__role">${escapeHtml(UI.brief.role(input.she))}</span></div>` +
    `<p class="sheet__foot">${escapeHtml(UI.brief.footer(number, protocol))}</p>` +
    `</article>`
  );
}
