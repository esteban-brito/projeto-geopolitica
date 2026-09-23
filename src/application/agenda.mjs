/* Composicao da pauta legislativa a partir das variacoes de programas e regras. */

import { quorumOf } from "../data/bills.mjs";
import { MONTHS_PER_YEAR } from "../data/regime.mjs";
import { POWER_STEPS } from "../data/rules.mjs";

/* Fracao mensal do custo orcamentario anual. */
const MONTHLY = 1 / MONTHS_PER_YEAR;

/**
 * @typedef {import("../data/programs.mjs").Program} Program
 * @typedef {import("../data/rules.mjs").Rule} Rule
 * @typedef {import("../state/state.mjs").Band} Band
 * @typedef {object} Breach
 * @property {string} programId
 * @property {"floor" | "ceiling"} side - qual parede foi atravessada
 * @property {string} rite - o rito que ESTA parede exige
 * @typedef {object} Move
 * @property {Program} program
 * @property {number} delta - pontos de intensidade, com sinal
 * @property {number} weight - `|delta| × cost`; o peso na media ponderada
 * @property {number} spend - bilhoes/ano que este movimento acrescenta (ou poupa)
 * @property {string} rite - o rito que ESTE movimento sozinho exigiria
 * @property {"level" | "floor" | "ceiling"} [kind] - o que se moveu; nivel por padrao
 * @typedef {object} Proposal
 * @property {string} id
 * @property {string} label
 * @property {string} area - a area de maior peso; o ASSUNTO da proposta
 * @property {string} instrument - `budget`, `law` ou `amendment`
 * @property {number} economic
 * @property {number} liberty
 * @property {number} threat
 * @property {number} spread - o RAIO ideologico do texto; zero e um texto coeso
 * @property {number} fiscalImpact - positivo POUPA, negativo custa
 * @typedef {object} Agenda
 * @property {Move[]} moves - so o que se moveu
 * @property {Breach[]} breaches
 * @property {Proposal | null} proposal - nulo quando nada se moveu
 * @property {number} quorum - votos necessarios; zero quando nao vai a plenario
 * @property {number} spend - bilhoes/ano que o conjunto acrescenta
 */

const RITES = ["budget", "law", "amendment"];

const FLOOR_RITE = { none: "budget", law: "law", constitution: "amendment" };

/**
 * @param {string} a
 * @param {string} b
 * @returns {string} o mais exigente dos dois
 */
function harder(a, b) {
  return RITES.indexOf(a) >= RITES.indexOf(b) ? a : b;
}

/**
 * @param {string} rite
 * @param {number} power de 0 a 100
 * @returns {string}
 */
function underPower(rite, power) {
  let drops = 0;
  for (const step of POWER_STEPS) if (power >= step.at) drops = Math.max(drops, step.drops);
  const index = RITES.indexOf(rite);
  return RITES[Math.max(0, index - drops)] ?? rite;
}

/** @param {number} value */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/**
 * @param {{ id: string, floor: number, ceiling: number }} lever
 * @param {Record<string, Band>} [bands]
 * @returns {Band}
 */
export function bandOf(lever, bands) {
  const band = bands?.[lever.id];
  return {
    floor: band?.floor ?? lever.floor,
    ceiling: band?.ceiling ?? lever.ceiling,
  };
}

/**
 * @param {string} guard
 * @returns {string}
 */
export function riteForBand(guard) {
  return harder("law", FLOOR_RITE[/** @type {keyof typeof FLOOR_RITE} */ (guard)] ?? "law");
}

/**
 * @param {{ id?: string, floor: number, ceiling: number, guard: string }} lever
 * @param {number} level
 * @param {number} [power]
 * @param {Record<string, Band>} [bands] as faixas VIGENTES; sem elas, as da posse
 * @returns {string}
 */
export function riteFor(lever, level, power = 0, bands) {
  const guard = FLOOR_RITE[/** @type {keyof typeof FLOOR_RITE} */ (lever.guard)] ?? "law";
  const band = bandOf({ id: lever.id ?? "", ...lever }, bands);

  let rite = "budget";
  if (level < band.floor) rite = harder(rite, guard);
  if (level > band.ceiling) rite = harder(rite, harder("law", guard));

  return underPower(rite, power);
}

/**
 * @param {object} input
 * @param {ReadonlyArray<Program>} input.programs
 * @param {ReadonlyArray<Rule>} [input.rules] - as alavancas de regra
 * @param {Record<string, number>} input.levels - o nivel VIGENTE de cada alavanca
 * @param {Record<string, number>} input.requested - o nivel PEDIDO; ausente = sem mudanca
 * @param {number} [input.power] - o poder do Executivo VIGENTE, de 0 a 100
 * @param {Record<string, Band>} [input.bands] - as faixas VIGENTES; a lei de hoje
 * @param {Record<string, Band>} [input.requestedBands] - as faixas PEDIDAS; a lei proposta
 * @returns {Agenda}
 */
export function compose({
  programs,
  rules = [],
  levels,
  requested,
  power = 0,
  bands,
  requestedBands,
}) {
  /** @type {Move[]} */
  const moves = [];
  /** @type {Breach[]} */
  const breaches = [];

  let weightTotal = 0;
  let economic = 0;
  let liberty = 0;
  let threat = 0;
  let spend = 0;
  let rite = "budget";

  /** @type {Record<string, number>} */
  const byArea = {};

  for (const lever of [...programs, ...rules]) {
    const program = /** @type {Program & Partial<Rule>} */ (lever);
    const size = program.cost ?? program.reach ?? 0;
    const from = clamp100(levels[program.id] ?? program.initial);
    const to = clamp100(requested[program.id] ?? from);
    const delta = to - from;

    const band = bandOf(program, bands);
    const asked = requestedBands?.[program.id] ?? band;

    const floorDelta = asked.floor - band.floor;
    const ceilingDelta = asked.ceiling - band.ceiling;

    for (const [side, moved] of /** @type {const} */ ([
      ["floor", floorDelta],
      ["ceiling", ceilingDelta],
    ])) {
      if (moved === 0) continue;

      const weightOfBand = Math.abs(moved) * size;
      const towardsBand = moved > 0;

      economic += weightOfBand * (towardsBand ? program.economic : 100 - program.economic);
      liberty += weightOfBand * (towardsBand ? program.liberty : 100 - program.liberty);
      threat += weightOfBand * program.threat;
      weightTotal += weightOfBand;
      byArea[program.area] = (byArea[program.area] ?? 0) + weightOfBand;

      const own = underPower(riteForBand(program.guard), power);
      rite = harder(rite, own);

      moves.push({
        program,
        delta: moved,
        weight: weightOfBand,
        spend: 0,
        rite: own,
        kind: side,
      });
    }

    if (delta === 0) continue;

    const weight = Math.abs(delta) * size;
    const contribution = program.cost === undefined ? 0 : (delta / 100) * program.cost;

    const towards = delta > 0;
    economic += weight * (towards ? program.economic : 100 - program.economic);
    liberty += weight * (towards ? program.liberty : 100 - program.liberty);

    threat += weight * program.threat;

    weightTotal += weight;
    spend += contribution;
    byArea[program.area] = (byArea[program.area] ?? 0) + weight;

    let own = "budget";

    if (to < asked.floor) {
      const required = FLOOR_RITE[/** @type {keyof typeof FLOOR_RITE} */ (program.guard)] ?? "law";
      breaches.push({ programId: program.id, side: "floor", rite: required });
      own = harder(own, required);
    }

    if (to > asked.ceiling) {
      const required = riteForBand(program.guard);
      breaches.push({ programId: program.id, side: "ceiling", rite: required });
      own = harder(own, required);
    }

    own = underPower(own, power);
    rite = harder(rite, own);
    moves.push({ program, delta, weight, spend: contribution, rite: own, kind: "level" });
  }

  if (weightTotal === 0) {
    return { moves, breaches, proposal: null, quorum: 0, spend: 0 };
  }

  const area = Object.entries(byArea).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

  const centreEconomic = economic / weightTotal;
  const centreLiberty = liberty / weightTotal;

  /* Sem raio ideologico o preco nao escalava: 1 mudanca pedia 358 votos e 85 pediam 334. */
  let variance = 0;
  for (const move of moves) {
    const program = /** @type {Program & Partial<Rule>} */ (move.program);
    const towards = move.delta > 0;
    const positionEconomic = towards ? program.economic : 100 - program.economic;
    const positionLiberty = towards ? program.liberty : 100 - program.liberty;
    variance +=
      move.weight *
      ((positionEconomic - centreEconomic) ** 2 + (positionLiberty - centreLiberty) ** 2);
  }
  const spread = Math.sqrt(variance / weightTotal);

  const proposal = {
    id: "pauta-composta",
    label: labelOf(moves),
    area,
    instrument: rite,
    economic: centreEconomic,
    liberty: centreLiberty,
    threat: threat / weightTotal,
    spread,
    fiscalImpact: -spend,
  };

  return {
    moves,
    breaches,
    proposal,
    quorum: rite === "budget" ? 0 : quorumOf(proposal),
    spend,
  };
}

/**
 * @param {object} input
 * @param {ReadonlyArray<Program>} input.programs
 * @param {Record<string, number>} input.levels
 * @param {Record<string, Band>} [input.bands]
 * @returns {{ byArea: Record<string, number>, byProgram: Record<string, number>,
 * total: number, fullByArea: Record<string, number> }}
 */
export function spendOf({ programs, levels, bands }) {
  /** @type {Record<string, number>} */
  const byArea = {};
  /** @type {Record<string, number>} */
  const fullByArea = {};
  /** @type {Record<string, number>} */
  const byProgram = {};
  let total = 0;

  for (const program of programs) {
    const level = clamp100(levels[program.id] ?? program.initial);
    /* Cortar abaixo do piso nao devolve caixa discricionario: despesa obrigatoria e outra conta. */
    const above = Math.max(0, level - bandOf(program, bands).floor);
    const monthly = (above / 100) * program.cost * MONTHLY;

    /* Cobrar renuncia na bolsa consumia caixa inexistente: desoneracao abate receita via waivedOf. */
    if (program.waiver !== true) {
      byProgram[program.id] = monthly;
      byArea[program.area] = (byArea[program.area] ?? 0) + monthly;
      total += monthly;
    }

    /* Sem gasto cheio por area a politica explorador explorava brecha no rateio. */
    fullByArea[program.area] =
      (fullByArea[program.area] ?? 0) + (level / 100) * program.cost * MONTHLY;
  }

  return { byArea, byProgram, total, fullByArea };
}

/**
 * @param {object} input
 * @param {ReadonlyArray<Program>} input.programs
 * @param {Record<string, number>} input.levels - o pedido
 * @param {number} input.ratio - de 0 a 1
 * @param {Record<string, Band>} [input.bands] - as faixas VIGENTES
 * @param {ReadonlySet<string>} [input.protect] - as AREAS que o decreto poupa
 * @returns {Record<string, number>}
 */
export function honour({ programs, levels, ratio, bands, protect }) {
  /** @type {Record<string, number>} */
  const next = {};
  for (const program of programs) {
    const level = clamp100(levels[program.id] ?? program.initial);

    /* Sem protect o corte era estritamente proporcional, impedindo defender prioridades no rateio. */
    if (protect?.has(program.area)) {
      next[program.id] = level;
      continue;
    }
    /* Contingenciamento sobre renuncia revogava por aperto mensal beneficio fiscal em lei. */
    if (program.waiver === true) {
      next[program.id] = level;
      continue;
    }
    const above = Math.max(0, level - bandOf(program, bands).floor);
    next[program.id] = level - above * (1 - ratio);
  }
  return next;
}

/**
 * @param {Move[]} moves
 * @returns {string}
 */
function labelOf(moves) {
  const ordered = [...moves].sort((a, b) => b.weight - a.weight);
  const first = ordered[0];
  if (!first) return "";

  const verb = first.delta > 0 ? "Ampliar" : "Cortar";
  const rest = ordered.length - 1;

  if (rest === 0) return `${verb} ${first.program.label.toLowerCase()}`;
  return `${verb} ${first.program.label.toLowerCase()} · e mais ${rest}`;
}
