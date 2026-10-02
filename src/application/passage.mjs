/* A TRAMITAÇÃO — o texto deixa de ser instantâneo.
   recebe  os textos protocolados, a camara, o mês e o catálogo devolve os textos um estágio
   adiante, e o que deles chegou ao plenario Este arquivo não e um motor e não tem codinome —
   ele COMPÕE, como `agenda.mjs` e `turn.mjs`. */

import { whipCount } from "../domain/congress/index.mjs";
import { compose } from "./agenda.mjs";

/* ⚠ O CAMINHO E UMA LISTA ORDENADA, e não três literais soltos: a tela precisa saber QUANTOS
   passos existem e em que ordem para desenhar onde o texto esta. Escrever a ordem la seria um
   segundo lugar para ela — e o dia em que um quarto estágio entrasse, a tela não saberia. */
export const STAGES = /** @type {const} */ (["drawer", "rapporteur", "floor"]);

/**
 * @typedef {import("../state/state.mjs").Band} Band
 * @typedef {import("../data/parties.mjs").Party} Party
 * @typedef {import("../domain/cast/index.mjs").Person} Person
 * @typedef {(typeof STAGES)[number]} Stage
 * @typedef {object} Bill um texto protocolado, e ele e o TEXTO e nao o efeito
 * @property {string} id
 * @property {number} writtenAt - o mes em que o presidente assinou
 * @property {Stage} stage
 * @property {number} since - o mes em que entrou neste estagio
 * @property {string} label - o assunto, como a tela o chama
 * @property {Record<string, Band>} bands - as faixas que ele pede
 * @property {Record<string, number>} levels - os niveis que ele pede, e so os que
 * dependem de voto: o que e execução orçamentária nunca entra num texto
 * @property {string[]} except - o que o relator salvou; vazio ate a relatoria
 * @property {string} [saved] - o rotulo do que foi salvo, para a tela dizer
 */

/* ⚠ QUANTO DA BANCADA DO PRESIDENTE DA CAMARA BASTA PARA ELE PAUTAR.
   e primeiro chute declarado, como o PIVOT de ECLUSA — o que NÃO e chute e a
   desigualdade: este limiar tem de ser menor que o de aprovar, senão a Mesa vira um
   segundo veto pelo mesmo preço. */
const TABLE = 0.38;

/* QUANTOS MESES UM TEXTO SOBREVIVE NA GAVETA. */
const DRAWER_LIFE = 6;

/**
 * O TEXTO COMO PROPOSTA — recomposto contra o país de HOJE, e não o de ontem.
 *
 * @param {Bill} bill
 * @param {object} world
 * @param {Record<string, number>} world.levels - os niveis vigentes
 * @param {Record<string, Band>} world.bands - a lei vigente
 * @param {number} world.power
 * @param {import("../data/catalog.mjs").CATALOG} world.catalog
 */
export function proposalOf(bill, { levels, bands, power, catalog }) {
  /* A EXCEÇÃO DO RELATOR SAI AQUI, e não no momento de aplicar: ela muda o que o texto PEDE,
     e portanto muda quem ele incomoda e quanto ele custa. */
  const spared = new Set(bill.except);

  /** @type {Record<string, Band>} */
  const asked = {};
  for (const [id, band] of Object.entries(bill.bands)) {
    if (!spared.has(id)) asked[id] = band;
  }

  /** @type {Record<string, number>} */
  const wanted = { ...levels };
  for (const [id, level] of Object.entries(bill.levels)) {
    if (!spared.has(id)) wanted[id] = level;
  }

  return compose({
    programs: catalog.programs,
    rules: catalog.rules,
    levels,
    requested: wanted,
    power,
    bands,
    requestedBands: { ...bands, ...asked },
  });
}

/**
 * A MESA DECIDE — e ela decide com a mesma fórmula do voto dela.
 *
 * @param {object} input
 * @param {import("./agenda.mjs").Proposal} input.proposal
 * @param {Person | null} input.speaker
 * @param {ReadonlyArray<Party>} input.benches
 * @param {Record<string, number>} input.funding - a verba OFERECIDA, por bancada
 * @param {Record<string, number>} input.loyalty
 * @param {number} input.standing - a rua
 * @param {ReadonlySet<string> | null} [input.ruling] - as bancadas do presidente
 * @returns {{ tabled: boolean, share: number }}
 */
export function tables({ proposal, speaker, benches, funding, loyalty, standing, ruling }) {
  const seat = speaker ? benches.find(bench => bench.id === speaker.id) : undefined;

  /* ⚠ SEM PRESIDENTE DA CAMARA, A GAVETA NÃO EXISTE — e o texto passa direto. */
  if (!seat) return { tabled: true, share: 1 };

  const forecast = whipCount({
    bill: proposal,
    parties: [seat],
    funding: { [seat.id]: funding[seat.id] ?? 0 },
    loyalty: { [seat.id]: loyalty[seat.id] ?? 0 },
    standing,
    ruling,
  });

  const share = seat.seats > 0 ? forecast.votes / seat.seats : 0;
  return { tabled: share >= TABLE, share };
}

/**
 * O RELATOR ESCREVE O JABUTI — e ele protege quem esta mais perto dele.
 *
 * favor do próprio lado. A distancia e a mesma que ECLUSA usa para decidir voto —
 * nenhuma fórmula nova, outro interesse.
 * @param {object} input
 * @param {Person | null} input.rapporteur
 * @param {import("./agenda.mjs").Agenda} input.agenda a proposta recomposta
 * @param {import("../data/catalog.mjs").CATALOG} input.catalog
 * @returns {{ except: string[], saved: string | undefined }}
 */
export function reports({ rapporteur, agenda, catalog }) {
  if (!rapporteur || agenda.moves.length === 0) return { except: [], saved: undefined };

  const levers = new Map([...catalog.programs, ...catalog.rules].map(lever => [lever.id, lever]));

  /** @type {{ id: string, label: string, distance: number } | null} */
  let closest = null;
  /* QUANTAS ALAVANCAS O TEXTO MACHUCA. */
  let hurt = 0;

  for (const move of agenda.moves) {
    const lever = levers.get(move.program.id);
    if (!lever) continue;

    /* ⚠ SÓ O QUE O TEXTO MACHUCA ENTRA NA ESCOLHA. */
    if (move.delta >= 0) continue;
    hurt++;

    const dx = lever.economic - rapporteur.economic;
    const dy = lever.liberty - rapporteur.liberty;
    const distance = dx * dx + dy * dy;

    if (!closest || distance < closest.distance) {
      closest = { id: lever.id, label: lever.label, distance };
    }
  }

  /* ⚠ O RELATOR NÃO PODE ESVAZIAR O TEXTO, e esta linha e a correção de um defeito medido no
     dia em que a tramitação nasceu: um texto que movia UMA alavanca só chegava ao plenario
     vazio, porque o relator tinha salvado exatamente aquela — e um texto vazio não vai a
     voto, ele morre. */
  if (!closest || hurt < 2) return { except: [], saved: undefined };
  return { except: [closest.id], saved: closest.label };
}

/**
 * QUANTO TEMPO UM TEXTO JÁ ESPERA NA GAVETA.
 *
 * @param {Bill} bill
 * @param {number} month
 */
export function forgotten(bill, month) {
  return bill.stage === "drawer" && month - bill.writtenAt >= DRAWER_LIFE;
}

export { DRAWER_LIFE };
