/* A PLATAFORMA — o que foi prometido na posse, e o que o mandato entregou.
   ⚠ ELA NÃO E UM MOTOR NOVO: cada compromisso e uma pergunta que o estado já responde — o
   índice da MALHA, a dívida do LASTRO, a série do primário, a norma promulgada. O que esta
   camada faz e cruzar o prometido com o entregue, que e o único lugar onde os dois se
   encontram.
   ⚠ E NADA AQUI E MURO: quebrar promessa e caro, e não proibido. Quem cobra e a rua, por
   `betrayal`, que já existia e só olhava o orcamento. */

import { betrayalCost } from "../domain/opinion/index.mjs";
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

/* A PLATAFORMA VAZIA, e ela e o estado de quem não respondeu a carta da posse. */
export const NO_PLATFORM = /** @type {const} */ ({ priority: null, fiscal: null, reform: null });

/**
 * AS OPÇÕES DE CADA EIXO — a lista que a carta da posse oferece.
 *
 * ⚠ AS DE PRIORIDADE SÃO DERIVADAS, e não digitadas: as `PRIORITY_COUNT` áreas com a pior
 * abertura. E a lista muda sozinha se o catálogo mudar, que e o ponto — quem escreve os três
 * ids a mão escreve uma segunda verdade sobre onde o país esta pior.
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
      /* O NOME DA ÁREA E O RÓTULO CURTO, e ele já tem glifo no rail: a carta mostra QUAL, e o
         eixo acima dela já disse que e a prioridade. */
      short: area.short ?? area.label,
      judged: `o índice de ${area.label}, contra os ${area.initial} da posse`,
    }));

  return {
    priority,
    fiscal: PLEDGES.filter(pledge => pledge.axis === "fiscal").map(pledge => ({ ...pledge })),
    reform: PLEDGES.filter(pledge => pledge.axis === "reform").map(pledge => ({ ...pledge })),
  };
}

/**
 * A SOMA DO PRIMÁRIO DOS ÚLTIMOS DOZE MESES, em bilhoes.
 *
 * @param {ReadonlyArray<number>} primary
 */
function lastYear(primary) {
  return primary.slice(-MONTHS_PER_YEAR).reduce((sum, month) => sum + month, 0);
}

/**
 * SE UMA NORMA DAQUELA NATUREZA PASSOU NESTE MANDATO.
 *
 * ⚠ `enactedAt > 0` E O QUE SEPARA A LEI DO JOGADOR DA HERDADA, e o critério não e desta
 * função: `enact` grava o mês, e a posse grava zero. O fecho já usa o mesmo.
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
 * ⚠ OS DOIS EIXOS SE COBRAM DIFERENTE, e a diferença e o mundo: a promessa de índice e a
 * fiscal são ESTADO — ou o número esta acima hoje, ou não esta —, e a de reforma e EVENTO: ela
 * só pode ser dada por quebrada quando o mandato acaba. Cobrar a reforma no mês 3 seria acusar
 * o presidente de não ter aprovado ainda o que ele tem 45 meses para aprovar.
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
    /* Sem mês nenhum fechado não há ano para julgar, e zero não e resposta: seria dizer que
       um governo de um dia já quebrou a promessa de um ano. */
    if (state.series.primary.length === 0) return { ...base, kept: null };
    const to = lastYear(state.series.primary);
    return { ...base, kept: to > 0, from: 0, to, unit: "money" };
  }

  if (pledge.id === "keep") return { ...base, kept: !enacted(state, "constitution") };

  const guard = pledge.id === "amendment" ? "constitution" : "law";
  return { ...base, kept: enacted(state, guard) ? true : null };
}

/**
 * O QUE O JOGADOR MARCOU, LIMPO — ids que não existem no catálogo caem fora.
 *
 * ⚠ A VALIDAÇÃO E AQUI E NÃO NA TELA, e a razão e a de sempre: a tela e uma das entradas, e um
 * save editado a mão ou uma ordem antiga com o id de uma área que saiu do catálogo poriam no
 * estado uma promessa que ninguém sabe julgar — e ela ficaria la para sempre, `null` em
 * silêncio.
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
 * SE O DISCURSO DE POSSE JÁ FOI FEITO — e um eixo marcado basta.
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
 * ⚠ O DENOMINADOR E O QUE FOI PROMETIDO, e não os três eixos: quem assumiu um compromisso e o
 * quebrou quebrou a plataforma inteira. E quem não prometeu nada não deve nada — a rua não
 * cobra o que não foi dito, e o preço de não prometer aparece no fecho, que fica sem critério.
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

/**
 * QUANTO A PLATAFORMA QUEBRADA COBRA DE HUMOR POR MÊS.
 *
 * ⚠ ELA COMPÕE AQUI, e não na tela: `breachOf` da a fração e `betrayalCost` da o preço, e o
 * turno já usa os dois exatamente nesta ordem. Somados na view, seriam dois lugares montando
 * a mesma pergunta — e a divergência só apareceria no mês em que `broken` mudasse.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {number}
 */
export function betrayalOf(state, catalog = CATALOG) {
  return betrayalCost(breachOf(state, catalog), catalog.opinion);
}
