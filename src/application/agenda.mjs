/* A PAUTA DERIVADA — de quanto o jogador moveu para o que o Congresso vota.
   CATALOGO e ESTADO, e motor nenhum chama outro motor. O ECLUSA recebe a
   proposta pronta e nao sabe de onde ela veio — e e justamente por nao saber que
   ele nao precisou mudar uma linha para o catalogo de pautas prontas morrer. */

import { quorumOf } from "../data/bills.mjs";
import { MONTHS_PER_YEAR } from "../data/regime.mjs";
import { POWER_STEPS } from "../data/rules.mjs";

/* O catalogo raciocina em ANO, porque orcamento e uma peca anual; o turno e um mes.
   LASTRO toma com a regra fiscal. */
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

/* O RITO DE CADA PAREDE, e a ordem e a da exigencia. */
const RITES = ["budget", "law", "amendment"];

/* QUE RITO CADA GUARDA COBRA quando o piso e atravessado. */
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
 * O RITO DEPOIS DO PODER DO EXECUTIVO — a janela de Overton, em uma funcao.
 *
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
 * A FAIXA VIGENTE DE UMA ALAVANCA — a lei que a governa hoje.
 *
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
 * O RITO DE MEXER NA PROPRIA FAIXA — de LEGISLAR, e nao de gastar.
 *
 * @param {string} guard
 * @returns {string}
 */
export function riteForBand(guard) {
  return harder("law", FLOOR_RITE[/** @type {keyof typeof FLOOR_RITE} */ (guard)] ?? "law");
}

/**
 * O RITO QUE UMA ALAVANCA SOZINHA EXIGE naquele nivel.
 *
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
 * COMPOE A PAUTA a partir do que o jogador moveu.
 *
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

  /* AS DUAS FAMILIAS ENTRAM NA MESMA VARREDURA, e essa e a decisao de desenho que faz o resto
     funcionar. */
  for (const lever of [...programs, ...rules]) {
    const program = /** @type {Program & Partial<Rule>} */ (lever);
    const size = program.cost ?? program.reach ?? 0;
    const from = clamp100(levels[program.id] ?? program.initial);
    const to = clamp100(requested[program.id] ?? from);
    const delta = to - from;

    /* ── A LEI DESTA ALAVANCA, ANTES E DEPOIS ───────────────────────────────── `band` e o
       que vale hoje; `asked` e o que o texto propoe. */
    const band = bandOf(program, bands);
    const asked = requestedBands?.[program.id] ?? band;

    const floorDelta = asked.floor - band.floor;
    const ceilingDelta = asked.ceiling - band.ceiling;

    /* ⚠ O NIVEL E JULGADO CONTRA A FAIXA PEDIDA, E NAO CONTRA A VIGENTE. */
    for (const [side, moved] of /** @type {const} */ ([
      ["floor", floorDelta],
      ["ceiling", ceilingDelta],
    ])) {
      if (moved === 0) continue;

      const weightOfBand = Math.abs(moved) * size;
      const towardsBand = moved > 0;

      /* A FAIXA CARREGA A POSICAO DO PROGRAMA, com o mesmo espelho do nivel: ampliar o que a
         lei obriga e um ato do lado do programa; soltar a obrigacao e o ato oposto. */
      economic += weightOfBand * (towardsBand ? program.economic : 100 - program.economic);
      liberty += weightOfBand * (towardsBand ? program.liberty : 100 - program.liberty);
      threat += weightOfBand * program.threat;
      weightTotal += weightOfBand;
      byArea[program.area] = (byArea[program.area] ?? 0) + weightOfBand;

      const own = underPower(riteForBand(program.guard), power);
      rite = harder(rite, own);

      /* ELE NAO GASTA NO MES, e a omissao e a verdade do modelo: mover um piso nao empenha um
         real hoje. */
      moves.push({
        program,
        delta: moved,
        weight: weightOfBand,
        spend: 0,
        rite: own,
        kind: side,
      });
    }

    /* PARADO NAO E MOVIMENTO. */
    if (delta === 0) continue;

    const weight = Math.abs(delta) * size;
    /* REGRA NAO CUSTA DISCRICIONARIO. */
    const contribution = program.cost === undefined ? 0 : (delta / 100) * program.cost;

    const towards = delta > 0;
    economic += weight * (towards ? program.economic : 100 - program.economic);
    liberty += weight * (towards ? program.liberty : 100 - program.liberty);

    /* A AMEACA NAO ESPELHA, e a assimetria e deliberada. */
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

    /* FURAR O TETO E LEI NO MINIMO, e a guarda pode cobrar mais. */
    if (to > asked.ceiling) {
      const required = riteForBand(program.guard);
      breaches.push({ programId: program.id, side: "ceiling", rite: required });
      own = harder(own, required);
    }

    /* O RITO DE CADA MOVIMENTO FICA GUARDADO NELE, e nao so o do pacote. */
    /* ⚠ O PODER QUE VALE E O VIGENTE, e nunca o pedido. */
    own = underPower(own, power);
    rite = harder(rite, own);
    moves.push({ program, delta, weight, spend: contribution, rite: own, kind: "level" });
  }

  /* NENHUM MOVIMENTO NAO VIRA PROPOSTA.
     (50, 50) — uma proposta centrista fantasma, que o ECLUSA votaria com prazer e
     que ninguem escreveu. Ausencia de pauta e ausencia, e a unica forma honesta
     de mostra-la e nao mostrar. */
  if (weightTotal === 0) {
    return { moves, breaches, proposal: null, quorum: 0, spend: 0 };
  }

  /* O ASSUNTO E A AREA DE MAIOR PESO. */
  const area = Object.entries(byArea).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

  const centreEconomic = economic / weightTotal;
  const centreLiberty = liberty / weightTotal;

  /* ── O RAIO DO TEXTO ──────────────────────────────────────────────────────── ⚠ SEM ELE O
     PRECO NAO ESCALA COM O TAMANHO DO PACOTE, e isso foi MEDIDO : um movimento de piso
     constitucional saia por 358 votos e oitenta e cinco movimentos saiam por 334 — os dois
     passavam, no mesmo mes, com a mesma verba.
     e a informacao que a media apagava, devolvida ao motor. Quem a usa e ECLUSA,
     e a identidade que a torna exata esta na prosa de `whipCount`. */
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
    /* O SINAL SEGUE A CONVENCAO DO CATALOGO: positivo POUPA. */
    fiscalImpact: -spend,
  };

  return {
    moves,
    breaches,
    proposal,
    /* O QUORUM SAI DA MESMA FUNCAO QUE O CATALOGO USAVA. */
    quorum: rite === "budget" ? 0 : quorumOf(proposal),
    spend,
  };
}

/**
 * QUANTO UMA CONFIGURACAO CUSTA NO MES, em bilhoes, e SO A PARTE DISCRICIONARIA.
 *
 * da despesa obrigatoria que o LASTRO recebe. O que este calculo devolve e so o
 * que esta ACIMA do piso — o dinheiro que o presidente decide, e o mesmo de onde
 * sai emenda para o Congresso.
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
    /* Abaixo do piso o discricionario e ZERO, e nao negativo: cortar abaixo do que a lei
       obriga nao devolve dinheiro para o caixa discricionario, devolve para a despesa
       obrigatoria — que e outra conta, e quem a move e a reforma. */
    const above = Math.max(0, level - bandOf(program, bands).floor);
    const monthly = (above / 100) * program.cost * MONTHLY;

    byProgram[program.id] = monthly;
    byArea[program.area] = (byArea[program.area] ?? 0) + monthly;
    total += monthly;

    /* ── O GASTO CHEIO, E POR QUE ELE PRECISOU EXISTIR ──────────────────────── ⚠ ELE
       CONSERTA O EXPLOIT QUE A POLITICA `explorador` MEDIU. */
    fullByArea[program.area] =
      (fullByArea[program.area] ?? 0) + (level / 100) * program.cost * MONTHLY;
  }

  return { byArea, byProgram, total, fullByArea };
}

/**
 * O NIVEL QUE O CAIXA REALMENTE HONRA, depois do rateio.
 *
 * @param {object} input
 * @param {ReadonlyArray<Program>} input.programs
 * @param {Record<string, number>} input.levels - o pedido
 * @param {number} input.ratio - de 0 a 1
 * @param {Record<string, Band>} [input.bands] - as faixas VIGENTES
 * @returns {Record<string, number>}
 */
export function honour({ programs, levels, ratio, bands }) {
  /** @type {Record<string, number>} */
  const next = {};
  for (const program of programs) {
    const level = clamp100(levels[program.id] ?? program.initial);
    const above = Math.max(0, level - bandOf(program, bands).floor);
    next[program.id] = level - above * (1 - ratio);
  }
  return next;
}

/**
 * O NOME DA PAUTA, montado do que ela faz.
 *
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
