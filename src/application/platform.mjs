/* A PLATAFORMA — o que foi prometido na posse, e o que o mandato entregou.
   ⚠ ELA NAO E UM MOTOR NOVO: cada compromisso e uma pergunta que o estado ja responde — o
   indice da MALHA, a divida do LASTRO, a serie do primario, a norma promulgada. O que esta
   camada faz e cruzar o prometido com o entregue, que e o unico lugar onde os dois se
   encontram.
   ⚠ E NADA AQUI E MURO: quebrar promessa e caro, e nao proibido. Quem cobra e a rua, por
   `betrayal`, que ja existia e so olhava o orcamento. */

import { PLEDGES, PRIORITY_COUNT } from "../data/platform.mjs";
import { CATALOG } from "../data/catalog.mjs";
import { MONTHS_PER_YEAR } from "../data/regime.mjs";

/**
 * @typedef {import("../data/platform.mjs").Pledge} Pledge
 * @typedef {import("../state/state.mjs").GameState} GameState
 * @typedef {object} Verdict um compromisso julgado contra o mandato
 * @property {string} axis
 * @property {string} id
 * @property {string} label - a promessa, na boca do candidato
 * @property {string} judged - como ela e medida
 * @property {boolean | null} kept - `null` enquanto ainda ha mandato para cumpri-la
 * @property {number} [from] - o que ele recebeu, quando a promessa tem numero
 * @property {number} [to] - o que ele entregou ate agora
 * @property {"index" | "ratio" | "money"} [unit] - a grandeza de `from` e `to`. ⚠ ELA E
 * OBRIGATORIA ONDE HA NUMERO: sem ela a tela imprimiu `1 → 1` para uma divida que foi de 78%
 * a 90%, porque arredondou uma fracao como se fosse ponto de indice
 */

/* A PLATAFORMA VAZIA, e ela e o estado de quem nao respondeu a carta da posse. */
export const NO_PLATFORM = /** @type {const} */ ({ priority: null, fiscal: null, reform: null });

/**
 * AS OPCOES DE CADA EIXO — a lista que a carta da posse oferece.
 *
 * ⚠ AS DE PRIORIDADE SAO DERIVADAS, e nao digitadas: as `PRIORITY_COUNT` areas com a pior
 * abertura. E a lista muda sozinha se o catalogo mudar, que e o ponto — quem escreve os tres
 * ids a mao escreve uma segunda verdade sobre onde o pais esta pior.
 *
 * @param {typeof CATALOG} [catalog]
 * @returns {{ priority: Pledge[], fiscal: Pledge[], reform: Pledge[] }}
 */
export function pledgesOf(catalog = CATALOG) {
  const priority = [...catalog.areas]
    .sort((a, b) => a.initial - b.initial || a.id.localeCompare(b.id))
    .slice(0, PRIORITY_COUNT)
    .map(area => ({
      id: area.id,
      axis: "priority",
      label: `entregar ${area.index} acima do que recebi`,
      judged: `o índice de ${area.label}, contra os ${area.initial} da posse`,
    }));

  return {
    priority,
    fiscal: PLEDGES.filter(pledge => pledge.axis === "fiscal").map(pledge => ({ ...pledge })),
    reform: PLEDGES.filter(pledge => pledge.axis === "reform").map(pledge => ({ ...pledge })),
  };
}

/**
 * A SOMA DO PRIMARIO DOS ULTIMOS DOZE MESES, em bilhoes.
 *
 * @param {ReadonlyArray<number>} primary
 */
function lastYear(primary) {
  return primary.slice(-MONTHS_PER_YEAR).reduce((sum, month) => sum + month, 0);
}

/**
 * SE UMA NORMA DAQUELA NATUREZA PASSOU NESTE MANDATO.
 *
 * ⚠ `enactedAt > 0` E O QUE SEPARA A LEI DO JOGADOR DA HERDADA, e o criterio nao e desta
 * funcao: `enact` grava o mes, e a posse grava zero. O fecho ja usa o mesmo.
 *
 * @param {GameState} state
 * @param {string} guard
 */
function enacted(state, guard) {
  return state.norms.some(norm => norm.enactedAt > 0 && norm.guard === guard);
}

/**
 * O JULGAMENTO DE UM COMPROMISSO — e `null` quer dizer "ainda da tempo".
 *
 * ⚠ OS DOIS EIXOS SE COBRAM DIFERENTE, e a diferenca e o mundo: a promessa de indice e a
 * fiscal sao ESTADO — ou o numero esta acima hoje, ou nao esta —, e a de reforma e EVENTO: ela
 * so pode ser dada por quebrada quando o mandato acaba. Cobrar a reforma no mes 3 seria acusar
 * o presidente de nao ter aprovado ainda o que ele tem 45 meses para aprovar.
 *
 * @param {GameState} state
 * @param {Pledge} pledge
 * @param {typeof CATALOG} catalog
 * @returns {Verdict}
 */
function judge(state, pledge, catalog) {
  const base = { axis: pledge.axis, id: pledge.id, label: pledge.label, judged: pledge.judged };

  if (pledge.axis === "priority") {
    const area = catalog.areas.find(one => one.id === pledge.id);
    if (area === undefined) return { ...base, kept: null };
    const to = state.capacity.index[area.id] ?? area.initial;
    return { ...base, kept: to >= area.initial, from: area.initial, to, unit: "index" };
  }

  if (pledge.id === "debt") {
    const to = state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0;
    const from = catalog.fiscal.initialDebtRatio;
    return { ...base, kept: to <= from, from, to, unit: "ratio" };
  }

  if (pledge.id === "primary") {
    /* Sem mes nenhum fechado nao ha ano para julgar, e zero nao e resposta: seria dizer que
       um governo de um dia ja quebrou a promessa de um ano. */
    if (state.series.primary.length === 0) return { ...base, kept: null };
    const to = lastYear(state.series.primary);
    return { ...base, kept: to > 0, from: 0, to, unit: "money" };
  }

  if (pledge.id === "keep") return { ...base, kept: !enacted(state, "constitution") };

  const guard = pledge.id === "amendment" ? "constitution" : "law";
  return { ...base, kept: enacted(state, guard) ? true : null };
}

/**
 * O QUE O JOGADOR MARCOU, LIMPO — ids que nao existem no catalogo caem fora.
 *
 * ⚠ A VALIDACAO E AQUI E NAO NA TELA, e a razao e a de sempre: a tela e uma das entradas, e um
 * save editado a mao ou uma ordem antiga com o id de uma area que saiu do catalogo poriam no
 * estado uma promessa que ninguem sabe julgar — e ela ficaria la para sempre, `null` em
 * silencio.
 *
 * @param {Partial<Record<string, string | null>>} [asked] o que veio das ordens
 * @param {typeof CATALOG} [catalog]
 * @returns {{ priority: string | null, fiscal: string | null, reform: string | null }}
 */
export function chosenOf(asked = {}, catalog = CATALOG) {
  const options = pledgesOf(catalog);
  const pick = (/** @type {"priority" | "fiscal" | "reform"} */ axis) => {
    const id = asked[axis];
    if (typeof id !== "string") return null;
    return options[axis].some(pledge => pledge.id === id) ? id : null;
  };
  return { priority: pick("priority"), fiscal: pick("fiscal"), reform: pick("reform") };
}

/**
 * SE O DISCURSO DE POSSE JA FOI FEITO — e um eixo marcado basta.
 *
 * @param {{ priority: string | null, fiscal: string | null, reform: string | null }} platform
 * @returns {boolean}
 */
export function spoken(platform) {
  return platform.priority !== null || platform.fiscal !== null || platform.reform !== null;
}

/**
 * A PLATAFORMA INTEIRA, julgada contra o mandato de hoje.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {Verdict[]} vazia quando o presidente nao prometeu nada
 */
export function platformOf(state, catalog = CATALOG) {
  const chosen = state.platform ?? NO_PLATFORM;
  const options = pledgesOf(catalog);

  /** @type {Verdict[]} */
  const verdicts = [];
  for (const axis of /** @type {const} */ (["priority", "fiscal", "reform"])) {
    const id = chosen[axis];
    if (id === null || id === undefined) continue;
    const pledge = options[axis].find(one => one.id === id);
    if (pledge !== undefined) verdicts.push(judge(state, pledge, catalog));
  }
  return verdicts;
}

/**
 * QUANTO DA PLATAFORMA ESTA QUEBRADA HOJE, de 0 a 1.
 *
 * ⚠ O DENOMINADOR E O QUE FOI PROMETIDO, e nao os tres eixos: quem assumiu um compromisso e o
 * quebrou quebrou a plataforma inteira. E quem nao prometeu nada nao deve nada — a rua nao
 * cobra o que nao foi dito, e o preco de nao prometer aparece no fecho, que fica sem criterio.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {number}
 */
export function breachOf(state, catalog = CATALOG) {
  const verdicts = platformOf(state, catalog);
  if (verdicts.length === 0) return 0;
  return verdicts.filter(verdict => verdict.kept === false).length / verdicts.length;
}
