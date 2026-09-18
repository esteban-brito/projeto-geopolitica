/* O RAIL — a navegacao primaria, a esquerda e sempre presente. */

import { escapeHtml } from "./html.mjs";
import { iconHtml } from "./icons.mjs";
import { DEFAULT_TREATMENT, UI, titleOf } from "../strings.mjs";

/** @typedef {import("../../data/areas.mjs").Area} Area */

/**
 * ⚠ `ready` SAIU JUNTO COM AS DUAS ENTRADAS CINZAS, e ele era a metade de codigo do defeito:
 * um parametro que so recebe `true` e uma porta aberta esperando alguem passar por ela.
 * Quando A Rua e Bastidor existirem, elas entram como as outras — com uma linha.
 *
 * @param {object} section
 * @param {string} section.key
 * @param {string} section.label
 * @param {"watch" | "alert"} [section.alert] o quanto a area caiu desde a abertura
 * @param {string} current
 */
function itemHtml({ key, label, alert }, current) {
  const active = key === current;

  const attributes = [
    `class="rail__item${active ? " rail__item--active" : ""}"`,
    'type="button"',
    `data-section="${escapeHtml(key)}"`,
    alert ? `data-alert="${alert}"` : "",
    active ? 'aria-current="page"' : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    `<li><button ${attributes}>` +
    iconHtml(key, "rail__icon") +
    `<span class="rail__label">${escapeHtml(label)}</span>` +
    /* ⚠ O PONTO NAO E A LEITURA, e por isso ele leva rotulo proprio: a cor sozinha diz
       "algo errado aqui" a quem a enxerga, e nada a quem nao enxerga. */
    (alert ? `<span class="rail__alert" title="${escapeHtml(UI.nav[alert])}"></span>` : "") +
    `</button></li>`
  );
}

/**
 * DE QUEM E ESTE GOVERNO — o nome, e no que ele se tornou.
 *
 * @param {object} input
 * @param {{ name: string }} input.president
 * @param {{ near: string, article: string } | null} input.stance
 * @param {"senhor" | "senhora"} [input.treatment] como o jogador quer ser tratado
 * @returns {string}
 */
export function railGovHtml({ president, stance, treatment = DEFAULT_TREATMENT }) {
  return (
    /* ⚠ O CARGO SEGUE O TRATAMENTO: "PRESIDENTE" sobre um nome escolhido com "a senhora"
       e a mesma frase errada que a carta acabou de parar de dizer. */
    `<p class="rail__who">${escapeHtml(titleOf(treatment))}</p>` +
    `<p class="rail__president">${escapeHtml(president.name)}</p>` +
    `<p class="rail__stance">` +
    (stance
      ? `${escapeHtml(UI.gov.nearest)} ${escapeHtml(stance.article)} <b>${escapeHtml(stance.near)}</b>`
      : escapeHtml(UI.gov.untouched)) +
    `</p>`
  );
}

/**
 * ⚠ `alerts` CHEGA DE FORA, e a tela nao o calcula: a escala de queda e regra da MALHA, e
 * refeita aqui ela divergiria da faixa de areas no dia em que um limiar mudasse.
 *
 * @param {string} current chave da secao aberta
 * @param {ReadonlyArray<Area>} areas
 * @param {Record<string, "watch" | "alert">} [alerts] so as areas que caíram
 * @returns {string}
 */
export function railNavHtml(current, areas, alerts = {}) {
  const cabinet = itemHtml({ key: "cabinet", label: UI.nav.cabinet }, current);
  /* ⚠ O EMAIL VEM LOGO DEPOIS DO GABINETE, e nao no fim: as duas eram a MESMA tela ate a
     separacao, e o jogador que abre o jogo no painel vai para a caixa em seguida. */
  const email = itemHtml({ key: "email", label: UI.nav.email }, current);
  const congress = itemHtml({ key: "congress", label: UI.nav.congress }, current);
  const finance = itemHtml({ key: "finance", label: UI.nav.finance }, current);

  /* ⚠ A FAZENDA CONTINUA SENDO UMA AREA, e nao um item de primeiro nivel como o plano de tela
     sugeria. */
  /* No dock (Gabinete, `40-shell.css`) a legenda vira BOTAO e os oito moram numa gaveta: 13
     icones sem rotulo e demais. No rail vertical o botao nao aparece e a legenda fica. A gaveta
     e o proprio dock em outro estado — os seis saem e os oito entram —, e nao um painel
     flutuante: um segundo vidro e um segundo material, que a guarda `material` recusa. */
  const inside = areas.some(area => area.id === current);
  const ministries =
    `<li class="rail__group">` +
    `<button class="rail__item rail__drawer${inside ? " rail__item--active" : ""}" type="button"` +
    ` aria-expanded="false" aria-label="${escapeHtml(UI.nav.ministries)}">` +
    iconHtml("ministries", "rail__icon") +
    `<span class="rail__label">${escapeHtml(UI.nav.ministries)}</span>` +
    `</button>` +
    `<p class="rail__legend">${escapeHtml(UI.nav.ministries)}</p>` +
    `<ul class="rail__sub">` +
    areas
      /* ⚠ O NOME CURTO MANDA AQUI, e a coluna e a razao: o rail tem 109px de rotulo, e o unico
         nome que nao cabe cortava com reticencia. Ausente, `short` cai no `label`. */
      .map(area =>
        itemHtml(
          { key: area.id, label: area.short ?? area.label, alert: alerts[area.id] },
          current,
        ),
      )
      .join("") +
    `</ul>` +
    `</li>`;

  const estado = itemHtml({ key: "estado", label: UI.nav.estado }, current);

  /* ⚠ A RUA E BASTIDOR SAIRAM DO MENU, por decisao dele. Elas viviam aqui desligadas, cinzas,
     com um `title` prometendo que viriam — e uma promessa cinza e pior que a ausencia: ela
     ocupa duas das treze entradas do menu para dizer que o jogo tem menos do que parece.
     ELAS VOLTAM COM DONO: A Rua e a opiniao publica com rosto, e depende da imprensa e das
     pessoas agindo sozinhas; Bastidor e a coalizao, e depende de nomear ministro. */
  const rule = '<li class="rail__rule" aria-hidden="true"></li>';

  return cabinet + email + congress + finance + rule + ministries + rule + estado;
}

/**
 * ARMA A GAVETA DO DOCK — uma vez, no `<ul>` que sobrevive as pinturas. O estado mora no
 * proprio `<ul>` (`data-drawer`), e por isso atravessa o `innerHTML` de cada pintura; quem o
 * fecha e a escolha de uma secao, o Esc, ou um clique fora do rail.
 *
 * @param {HTMLElement} nav o `ul#railNav`
 */
export function armRail(nav) {
  const set = (/** @type {boolean} */ open) => {
    nav.dataset["drawer"] = String(open);
    const drawer = nav.querySelector(".rail__drawer");
    if (drawer instanceof HTMLElement) {
      drawer.setAttribute("aria-expanded", String(open));
      drawer.setAttribute("aria-label", open ? UI.nav.ministriesClose : UI.nav.ministries);
    }
  };
  nav.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".rail__drawer") !== null) {
      set(nav.dataset["drawer"] !== "true");
      return;
    }
    if (target.closest("[data-section]") !== null) set(false);
  });
  nav.ownerDocument.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.dataset["drawer"] === "true") set(false);
  });
  nav.ownerDocument.addEventListener("click", event => {
    const target = event.target;
    if (target instanceof Element && !nav.contains(target) && nav.dataset["drawer"] === "true")
      set(false);
  });
}
