/* A PECA DE DADO — nome, pista, valor e nota, e ela e UMA nas duas telas.
   ⚠ TRES PECAS PARA QUINZE ESPECIES DE CARTA, e antes eram CINCO formatos de anexo: medido
   num mandato de 14 meses, 19 de 23 cartas abertas traziam tabela, com 306 celulas em tela
   por mes. A guarda `annexes` e o que impede a sexta.
   ⚠ E O GABINETE ENTROU NELA NO CICLO 15. A coluna direita tinha 18 classes em quatro blocos
   e TRES instrumentos para a mesma pergunta — `gauge`, `meter` e `poles` —, cada bloco
   desenhado sozinho. Agora a regua e uma: quem desenha e esta peca, e a tela pede.
   ⚠ A SUBSTANCIA E DO CONTEXTO, e nao da peca: dentro da carta ela e papel, na coluna ela e
   vidro. A folha resolve isso por contexto; escrever duas pecas resolveria por duplicacao. */

import { iconHtml } from "./icons.mjs";
import { escapeHtml } from "./html.mjs";
import { attr, seats } from "./format.mjs";
import { UI, labelOf } from "../strings.mjs";

/**
 * UM CARD DE ANEXO — legenda em cima, leitura embaixo.
 *
 * @param {string} legend
 * @param {string} body ja em HTML
 * @returns {string}
 */
export function cardHtml(legend, body) {
  return (
    `<section class="annex">` +
    `<h5 class="annex__legend">${escapeHtml(legend)}</h5>` +
    `<p class="annex__read">${body}</p>` +
    `</section>`
  );
}

/**
 * ── A LINHA — A UNICA PECA DE DADO DAS DUAS TELAS ────────────────────────────
 * ⚠ ELA SUBSTITUIU AS QUATRO TABELAS DA CAIXA e os TRES INSTRUMENTOS DO GABINETE: a 1280x800
 * a tabela cortava a coluna da soma, e tres instrumentos cobravam tres desenhos por pergunta.
 * ⚠ A BARRA E OPCIONAL, E A AUSENCIA E A MODELAGEM: ela so entra onde as linhas dividem a
 * MESMA escala — `%`, cadeiras e reais nao dividem nenhuma.
 * ⚠ E A MARCA SALVA A FUSAO: sem o risco no ponto do limiar, "83" nao diz que rompe em 86.
 *
 * @param {object} input
 * @param {string} input.who o nome da linha
 * @param {string} input.value o numero, ja formatado
 * @param {number} [input.share] de 0 a 100 — sem ele a linha sai sem barra
 * @param {number} [input.mark] o limiar, na mesma escala da barra
 * @param {number} [input.fall] o segundo limiar, quando a mesma regua tem dois
 * @param {boolean} [input.past] a leitura ja passou do limiar
 * @param {"above" | "below"} [input.danger] de que LADO da marca fica o perigo
 * @param {number} [input.split] onde o preenchimento troca de tinta, na mesma escala
 * @param {string} [input.note] o qualificador ao lado do numero
 * @param {string} [input.aside] o qualificador ao lado do NOME — ele nao e uma segunda
 * leitura: e a mesma leitura dizendo o proprio peso
 * @param {string} [input.tone] `crisis` tinge a linha inteira
 * @param {"up" | "down" | "flat" | null} [input.trend] para que lado andou desde o mes passado
 * @param {string} [input.label] a descricao da barra para quem le por som
 * @returns {string}
 */
export function lineHtml({
  who,
  value,
  share,
  mark,
  fall,
  past,
  danger,
  split,
  note,
  aside,
  tone,
  trend,
  label,
}) {
  const width = share === undefined ? 0 : Math.max(0, Math.min(100, share));
  const style =
    `--index:${attr(width)}` +
    (mark === undefined ? "" : `;--mark:${attr(mark)}`) +
    (fall === undefined ? "" : `;--fall:${attr(fall)}`) +
    (split === undefined ? "" : `;--split:${attr(split)}`);

  return (
    `<div class="annex__line"${tone ? ` data-tone="${escapeHtml(tone)}"` : ""}>` +
    `<span class="annex__who">${escapeHtml(who)}` +
    (aside ? `<small class="annex__aside">${escapeHtml(aside)}</small>` : "") +
    `</span>` +
    (share === undefined
      ? ""
      : `<span class="gauge" role="img"` +
        (mark === undefined ? "" : ` data-mark="true"`) +
        /* ⚠ O PREENCHIMENTO TROCA DE TINTA NO MEIO, e nao ganha uma linha nova: a divisao fica
           em cima do numero que ela explica, e custa ZERO de altura numa tela que nao rola. */
        (split === undefined ? "" : ` data-split="true"`) +
        /* ⚠ O LADO E DECLARADO PELO CHAMADOR, e nao deduzido daqui. As duas reguas com marca
           apontam para lados OPOSTOS: no cerco, passar de `boil` e perder o grupo; na Camara,
           passar da maioria e poder aprovar. Pintar "alem da marca" como perigo em ambas
           pintaria de vermelho a zona em que o jogador ganhou. */
        (danger === undefined ? "" : ` data-danger="${danger}"`) +
        (fall === undefined ? "" : ` data-fall="true"`) +
        (past ? ` data-past="true"` : "") +
        ` style="${style}"` +
        (label ? ` aria-label="${escapeHtml(label)}"` : "") +
        `></span>`) +
    `<b class="annex__value" data-numeric>${escapeHtml(value)}` +
    (note ? `<small>${escapeHtml(note)}</small>` : "") +
    (trend
      ? `<i class="trend" data-direction="${trend}" aria-hidden="true">${UI.trend[trend]}</i>`
      : "") +
    `</b></div>`
  );
}

/**
 * UM BLOCO DE LINHAS — a moldura de TODA leitura das duas telas.
 *
 * ⚠ A LEGENDA E A PORTA, e nao o bloco inteiro: um `<div>` com clique nao chega pelo teclado,
 * e este bloco tem leitor de tela em toda barra. Ela so aparece onde ha para onde ir — seta
 * cinza de tela que nao existe e a promessa que o rail ja recusou.
 *
 * @param {string} legend
 * @param {string} lines ja em HTML
 * @param {object} [extra]
 * @param {string} [extra.door] a tela que este bloco abre, quando ela existe
 * @param {string} [extra.foot] o que atravessa a largura toda — carimbo, ruptura aberta
 * @param {string} [extra.icon] a chave do glifo, do MESMO conjunto do rail
 * @returns {string}
 */
export function linesHtml(legend, lines, { door, foot, icon } = {}) {
  /* O GLIFO E O MESMO CONJUNTO DO RAIL, e nao um segundo: a coluna e o menu falam do mesmo
     pais, e dois desenhos para "Congresso" seriam duas palavras para a mesma coisa. */
  const glyph = icon ? iconHtml(icon, "annex__icon") : "";
  const head = door
    ? `<button class="annex__legend block__door" type="button" ` +
      `data-section="${escapeHtml(door)}">${glyph}${escapeHtml(legend)}</button>`
    : `<h5 class="annex__legend">${glyph}${escapeHtml(legend)}</h5>`;

  return `<section class="annex" data-wide="true">` + head + lines + (foot ?? "") + `</section>`;
}

/**
 * UM BLOCO DE NOTA — legenda em cima, e uma frase embaixo.
 *
 * ⚠ ELA E A TERCEIRA E ULTIMA PECA, e nasceu de um defeito visto na captura: a regra do
 * impeachment ia num card de LEITURA, onde o corpo e o tipo de um valor. Doze palavras em
 * `--text-name` ocupavam meia coluna e liam como numero. Regra e prosa, e prosa tem tipo de
 * prosa.
 *
 * @param {string} legend
 * @param {string} text
 * @returns {string}
 */
export function noteHtml(legend, text) {
  return (
    `<section class="annex" data-wide="true">` +
    `<h5 class="annex__legend">${escapeHtml(legend)}</h5>` +
    `<p class="annex__note">${escapeHtml(text)}</p>` +
    `</section>`
  );
}

/**
 * QUANTO FALTA PARA CADA RUPTURA ABRIR — as mesmas linhas na carta e na coluna.
 *
 * ⚠ A BARRA MEDE O CAMINHO ANDADO ATE O LIMIAR, e o lado vem do motor: a social rompe quando
 * CAI e as outras duas quando sobem. Por isso ela nao leva marca — o limiar E o fim da pista.
 * ⚠ E O NUMERO DO LIMIAR CONTINUA ESCRITO, por decisao dele: a marca sozinha diz ONDE, e nao
 * QUANTO. Era a unica coisa que a chave solta no pe do bloco fazia.
 *
 * @param {ReadonlyArray<{ id: string, value: number, threshold: number, breaks: string,
 * open: boolean }>} ruptures
 * @returns {string}
 */
export function rupturesRows(ruptures) {
  return ruptures
    .map(item => {
      const gap = Math.abs(item.value - item.threshold);
      const walked =
        item.breaks === "below"
          ? ((100 - item.value) / Math.max(1, 100 - item.threshold)) * 100
          : (item.value / Math.max(1, item.threshold)) * 100;

      const edge = item.breaks === "below" ? UI.cabinet.trinityBelow : UI.cabinet.trinityAbove;

      return lineHtml({
        who: labelOf(UI.cabinet.trinity, item.id),
        value: item.open ? UI.inbox.blockOpen : `${UI.inbox.blockMissing} ${seats(gap)}`,
        share: walked,
        aside: `${edge} ${seats(item.threshold)}`,
        ...(item.open ? { tone: "crisis" } : {}),
      });
    })
    .join("");
}

/**
 * A CAMARA EM TRES LINHAS — apoiam, o quorum, e o que falta.
 *
 * @param {number} base
 * @param {number} majority
 * @param {number} seatsTotal
 * @param {{ bought: number, convinced: number }} [venality] a base repartida por PRECO
 * @returns {string}
 */
export function chamberRows(base, majority, seatsTotal, venality) {
  const total = Math.max(1, seatsTotal);
  const falta = Math.max(0, majority - base);

  return (
    lineHtml({
      who: UI.cabinet.baseLine,
      value: seats(base),
      share: (base / total) * 100,
      mark: (majority / total) * 100,
      /* Abaixo do quorum nada passa, e e a metade da regua que custa. */
      danger: "below",
      /* ⚠ A CONVICCAO VEM PRIMEIRO, e o aluguel depois: a leitura corre da esquerda, e o que o
         jogador precisa achar de relance e onde a base dele PARA de ser dele.
         ⚠ E ELA NAO GANHA LINHA PROPRIA: o passeio cobrou 557 contra 518 quando ela ganhou, e
         a coluna nao rola. A barra ja estava ali, em cima do numero que a divisao explica. */
      ...(venality === undefined ? {} : { split: (venality.convinced / total) * 100 }),
      note: `${UI.inbox.of} ${seats(seatsTotal)}`,
      ...(venality === undefined
        ? {}
        : { aside: `${seats(venality.bought)} ${UI.inbox.baseBought}` }),
      label: `${UI.cabinet.baseLine}: ${seats(base)} ${UI.inbox.of} ${seats(seatsTotal)}`,
    }) +
    /* ⚠ `Maioria simples 257` SAIU, e ela era a TERCEIRA forma de dizer a mesma coisa: a marca
       de latao ja aponta o quorum na pista, e `Faltam` ja da a distancia ate ele. O numero nao
       se perdeu — virou o qualificador de `Faltam`, que e a linha que fala dele. A linha
       custava 26px numa coluna que estourava em 12. */
    /* ⚠ ZERO NAO E LEITURA AQUI: "faltam 0" ocupa uma linha para dizer que a maioria esta
       feita, e quem ja diz isso e a barra, com a marca do quorum atras do preenchimento. */
    (falta > 0
      ? lineHtml({
          who: UI.inbox.blockMissing,
          aside: `${UI.inbox.forWord} ${seats(majority)}`,
          value: seats(falta),
        })
      : "")
  );
}
