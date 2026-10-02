/* A CORRENTE CAUSAL — o DELTA diz quem alimenta quem, e a MALHA diz com que forca hoje.
   ⚠ SÃO DOIS MOTORES, E QUEM OS JUNTA E ESTA CAMADA: o grafo e catálogo, o empurrão e estado,
   e nenhum dos dois alcanca o outro. A tela pergunta uma vez e imprime o que vier. */

import { liftOf, pushOf } from "../domain/capacity/index.mjs";
import { linksOf } from "../domain/graph/index.mjs";
import { CAPACITY_TARGET, NEUTRAL } from "../data/areas.mjs";
import { CATALOG } from "../data/catalog.mjs";

/**
 * @typedef {import("../domain/graph/index.mjs").Link} Link
 * @typedef {import("../data/areas.mjs").Area} Area
 * @typedef {Link & { now: number }} Strand uma aresta com a forca que ela faz HOJE
 */

/**
 * A FORCA CORRENTE DE UMA ARESTA, e cada espécie tem a sua conta — todas do motor.
 *
 * @param {Link} link
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.index
 * @param {Record<string, number[]>} input.history
 * @param {number} input.spent - o gasto CHEIO da area perguntada, no mes
 * @returns {number}
 */
function forceOf(link, { areas, index, history, spent }) {
  const from = areas.find(one => one.id === link.from);

  /* O QUE A VERBA DESTE MÊS PÕE NO ÍNDICE — e não o que ela poria por bilhão, que e o peso. */
  if (link.kind === "spend") return link.weight * spent;

  /* O QUE VAZA DESTE MÊS, em pontos: a fração incide sobre o estoque, e não sobre a abertura. */
  if (link.kind === "decay") return link.weight * (index[link.to] ?? 0);

  if (from === undefined) return 0;

  /* ⚠ AS DUAS ULTIMAS SÃO DA MALHA, E DE PROPÓSITO: refazer `((valor - base) / 100) * force`
     aqui seria a segunda conta para a mesma pergunta — a família de defeito número 1 do
     projeto. Há prova cobrando que a soma delas seja a pressão que o turno executa. */
  if (link.kind === "capacity") return liftOf(from, history, NEUTRAL);
  return pushOf(from, history);
}

/**
 * A CORRENTE DE UMA ÁREA, com peso, sinal, atraso e a forca de hoje.
 *
 * ⚠ ELA E DE UM NÍVEL SÓ, e a ausência e declarada: a Educacao mostra que entrega capacidade a
 * Indústria, e a Indústria e que mostra o que faz com ela. Encadear os dois níveis aqui poria
 * na tela de uma área um número que só a outra sabe explicar.
 *
 * @param {import("../state/state.mjs").GameState} state
 * @param {string} id - a area perguntada
 * @param {number} spent - o gasto CHEIO da area no mes, ja rateado (`funded` do rateio), e
 * não a parte acima do piso: e o dinheiro que chega ao hospital que constrói índice, e não o
 * rótulo jurídico dele
 * @param {typeof CATALOG} [catalog]
 * @returns {{ into: Strand[], out: Strand[] }}
 */
export function chainOf(state, id, spent, catalog = CATALOG) {
  const areas = catalog.areas;
  const { into, out } = linksOf({ areas, id, target: CAPACITY_TARGET });
  const at = { areas, index: state.capacity.index, history: state.capacity.history, spent };

  return {
    into: into.map(link => ({ ...link, now: forceOf(link, at) })),
    out: out.map(link => ({ ...link, now: forceOf(link, at) })),
  };
}
