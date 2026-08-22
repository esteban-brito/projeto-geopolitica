/* O SIMULADOR DE MANDATO — o jogo rodando sem tela nenhuma.
   Nenhuma delas quer ser um jogador competente: elas sao SONDAS, cada uma
   exagerando um comportamento para isolar um efeito. `parado` mede a queda
   natural; `promessa` mede a traicao; a distancia entre `agenda` e `promessa` e o
   preco da imprudencia fiscal, em meses de base. */

import { parseArgs } from "node:util";
import { costOf, discretionaryRoom, forecast, playMonth } from "../src/application/turn.mjs";
import { compose, spendOf } from "../src/application/agenda.mjs";
import { CATALOG } from "../src/data/catalog.mjs";
import { DEFAULT_SEED, createState, monthLabel } from "../src/state/state.mjs";

/**
 * @typedef {import("../src/state/state.mjs").GameState} GameState
 * @typedef {import("../src/application/turn.mjs").Orders} Orders
 * @typedef {import("../src/application/turn.mjs").Report} Report
 */

/* ── AS POLITICAS ─────────────────────────────────────────────────────────── */

/* Quanto de verba, por mes, apenas EMPATA o decaimento da lealdade. */
const UPKEEP = 1.5 / 12;

/** Todo programa no piso: o minimo que a lei permite sem pedir voto a ninguem. */
function atFloor() {
  return Object.fromEntries(CATALOG.programs.map(program => [program.id, program.floor]));
}

/**
 * A configuracao vigente com a parte DISCRICIONARIA encolhida por um fator.
 *
 * @param {GameState} state
 * @param {number} share de 0 (tudo no piso) a 1 (mantem como esta)
 */
function squeeze(state, share) {
  return Object.fromEntries(
    CATALOG.programs.map(program => {
      const level = state.levels[program.id] ?? program.initial;
      return [program.id, program.floor + Math.max(0, level - program.floor) * share];
    }),
  );
}

/**
 * O MAIOR `share` QUE CABE, deixando `reserve` bilhoes livres para o Congresso.
 *
 * @param {GameState} state
 * @param {number} reserve
 */
function affordableShare(state, reserve) {
  const room = Math.max(0, discretionaryRoom(state) - reserve);
  let low = 0;
  let high = 1;
  for (let step = 0; step < 20; step++) {
    const mid = (low + high) / 2;
    const cost = spendOf({ programs: CATALOG.programs, levels: squeeze(state, mid) }).total;
    if (cost > room) high = mid;
    else low = mid;
  }
  return low;
}

/**
 * @typedef {object} Memory o que a politica lembra entre os meses
 * @property {Set<string>} passed pautas ja aprovadas
 */

/**
 * @callback Policy
 * @param {GameState} state
 * @param {Memory} memory
 * @returns {Orders}
 */

/**
 * @param {number} level
 * @returns {Record<string, number>}
 */
function everyone(level) {
  return Object.fromEntries(CATALOG.parties.map(party => [party.id, level]));
}

/**
 * O maior nivel UNIFORME que o mes consegue pagar de verdade.
 *
 * @param {GameState} state
 */
function affordableLevel(state) {
  const full = costOf(everyone(1), CATALOG.parties, CATALOG.fiscal.seatPrice);
  if (full <= 0) return 0;
  return Math.max(0, Math.min(1, discretionaryRoom(state) / full));
}

/**
 * E exatamente a camara fantasma que foi arrancada da fachada em 15/08 por inverter 27,2% dos
 * vereditos anunciados: o turno vota com as ONZE ⚠ E AQUI O PRECO FOI MAIOR QUE NA TELA,
 * porque quem errava era o INSTRUMENTO DE CALIBRAGEM.
 *
 * bancadas do ELENCO, com a verba ja creditada de memoria e com `standing` dentro.
 * @param {GameState} state
 * @param {Record<string, number>} requested o orcamento que este texto pede
 * @returns {number | null} nulo quando nem verba cheia aprova
 */
function priceOfPassage(state, requested) {
  for (let level = 0; level <= 1.0001; level += 0.05) {
    const funding = everyone(Math.min(1, level));
    const seen = forecast(state, { levels: requested, funding }, CATALOG);

    /* SEM PAUTA NAO HA PRECO, e zero e a resposta certa: um orcamento que nao move nada nao
       precisa de voto nenhum. */
    if (!seen.agenda.proposal || seen.agenda.quorum <= 0) return 0;
    if (seen.whip && seen.whip.votes >= seen.agenda.quorum) return Math.min(1, level);
  }
  return null;
}

/**
 * A PROXIMA REFORMA DA FILA — o programa cujo piso ainda nao foi furado.
 *
 * @param {Memory} memory
 */
function nextReform(memory) {
  return CATALOG.programs.find(program => program.floor > 0 && !memory.passed.has(program.id));
}

/**
 * O corte que uma reforma propoe: o piso derrubado em `depth` pontos.
 *
 * @param {import("../src/data/programs.mjs").Program} program
 * @param {number} [depth]
 */
function reformOf(program, depth = 12) {
  return { [program.id]: Math.max(0, program.floor - depth) };
}

/** @type {Record<string, Policy>} */
const POLICIES = {
  /* O PRESIDENTE AUSENTE. */
  herdado: () => ({ funding: everyone(0) }),

  /* O CORTE TOTAL. */
  piso: () => ({ levels: atFloor(), funding: everyone(0) }),

  /* SO A MANUTENCAO. */
  base: state => {
    const reserve = costOf(everyone(UPKEEP), CATALOG.parties, CATALOG.fiscal.seatPrice);
    return {
      levels: squeeze(state, affordableShare(state, reserve)),
      funding: everyone(Math.min(UPKEEP, affordableLevel(state))),
    };
  },

  /* O GOVERNO PRUDENTE. */
  agenda: (state, memory) => {
    /* A MANUTENCAO VEM PRIMEIRO, e o que sobra e que compra voto. */
    const reserve = costOf(everyone(UPKEEP), CATALOG.parties, CATALOG.fiscal.seatPrice);
    const share = affordableShare(state, reserve);
    const levels = squeeze(state, share);
    const left = Math.max(
      0,
      discretionaryRoom(state) - spendOf({ programs: CATALOG.programs, levels }).total,
    );

    for (const program of CATALOG.programs) {
      if (program.floor <= 0 || memory.passed.has(program.id)) continue;

      const requested = { ...levels, ...reformOf(program) };
      const agenda = compose({ programs: CATALOG.programs, levels: state.levels, requested });
      if (!agenda.proposal) continue;

      const level = priceOfPassage(state, requested);
      if (level === null) continue;
      const funding = everyone(level);
      if (costOf(funding, CATALOG.parties, CATALOG.fiscal.seatPrice) > left) continue;
      return { levels: requested, funding };
    }

    return { levels, funding: everyone(Math.min(UPKEEP, affordableLevel(state))) };
  },

  /* O EXPLORADOR. */
  explorador: () => ({
    levels: Object.fromEntries(CATALOG.programs.map(program => [program.id, 100])),
    bands: Object.fromEntries(
      [...CATALOG.programs, ...CATALOG.rules].map(lever => [lever.id, { floor: 0, ceiling: 100 }]),
    ),
    funding: everyone(1),
  }),

  /* ── AS DUAS SONDAS DA ESCOLHA ─────────────────────────────────────────────── ⚠ ELAS
     NASCERAM DO ACHADO MAIS CONSTRANGEDOR DE, e ele e sobre o INSTRUMENTO e nao sobre o jogo:
     as seis politicas que existiam **espalham tudo por igual**, nos dois eixos — verba
     dividida entre as oito areas e emenda oferecida as onze bancadas na mesma medida. */

  /* O CONCENTRADOR. */
  concentra: state => {
    const alvos = ["health", "education", "industry", "security"];
    const alvo = alvos[Math.floor((state.month - 2) / 12) % alvos.length];
    return {
      levels: Object.fromEntries(
        CATALOG.programs.map(p => [p.id, p.area === alvo ? 100 : p.floor]),
      ),
      funding: everyone(Math.min(UPKEEP, affordableLevel(state))),
    };
  },

  /* OS FAVORITOS. */
  favoritos: state => {
    const escolhidas = [...CATALOG.parties].sort((a, b) => b.seats - a.seats).slice(0, 3);
    const level = affordableLevel(state);
    return {
      levels: { ...state.levels },
      funding: Object.fromEntries(escolhidas.map(p => [p.id, level])),
    };
  },

  /* Medido a mao, fora do simulador: uma lei MODESTA — baixar um piso em cinco pontos —
     atravessa a tramitacao inteira em quatro meses, gaveta → Mesa → relator → plenario →
     norma. */
  legislador: (state, memory) => {
    const program = CATALOG.programs.find(
      item => item.floor > 0 && !memory.passed.has(item.id) && (state.norms ?? []).length >= 0,
    );
    if (!program) return { levels: { ...state.levels }, funding: everyone(UPKEEP) };

    /* CINCO PONTOS DE PISO, e o numero e pequeno de proposito: o que se mede aqui e se o
       CAMINHO existe, e nao qual o maior texto que passa. */
    return {
      levels: { ...state.levels },
      bands: { [program.id]: { floor: Math.max(0, program.floor - 5), ceiling: 100 } },
      funding: everyone(Math.min(UPKEEP, affordableLevel(state))),
    };
  },

  /* O GOVERNO QUE PROMETE. */
  promessa: (state, memory) => {
    const program = nextReform(memory);
    return {
      levels: program ? { ...state.levels, ...reformOf(program) } : { ...state.levels },
      funding: everyone(1),
    };
  },
};

/* ── OS ARGUMENTOS ────────────────────────────────────────────────────────── */

const { values } = parseArgs({
  options: {
    seed: { type: "string", default: String(DEFAULT_SEED) },
    months: { type: "string", default: "48" },
    policy: { type: "string", default: "agenda" },
    shock: { type: "string", default: "0" },
    quiet: { type: "boolean", default: false },
  },
});

const policyName = values.policy ?? "agenda";
const policy = POLICIES[policyName];

if (!policy) {
  process.stderr.write(
    `politica desconhecida: ${policyName}\n` +
      `as que existem: ${Object.keys(POLICIES).join(", ")}\n`,
  );
  process.exit(1);
}

const seed = Number(values.seed);
const months = Number(values.months);
/* ⚠ O CRESCIMENTO DO PIB DEIXOU DE SER PREMISSA.
   Ele era um argumento porque nao havia motor macro: quem simulava declarava "suponha 2% ao
   ano" e o turno obedecia. */
const shock = Number(values.shock);

for (const [label, value] of [
  ["seed", seed],
  ["months", months],
  ["shock", shock],
]) {
  if (!Number.isFinite(value)) {
    process.stderr.write(`--${String(label)} precisa ser um numero\n`);
    process.exit(1);
  }
}

/* ── FORMATACAO ───────────────────────────────────────────────────────────── */

/**
 * @param {number} value
 * @param {number} [digits]
 */
function num(value, digits = 1) {
  return value.toFixed(digits).replace(".", ",");
}

/**
 * @param {string} text
 * @param {number} width
 */
function pad(text, width) {
  return text.length >= width ? text.slice(0, width) : text + " ".repeat(width - text.length);
}

/**
 * @param {string} text
 * @param {number} width
 */
function padLeft(text, width) {
  return text.length >= width ? text : " ".repeat(width - text.length) + text;
}

/** @param {Record<string, number>} loyalty */
function averageLoyalty(loyalty) {
  const values = Object.values(loyalty);
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * O que o mes tem de anormal, dito em uma coluna.
 *
 * @param {Report} report
 */
function flagsOf(report) {
  const flags = [];
  if (report.budget.contingency) flags.push("contingenciado");
  const shortfall = report.promisedCost - report.paidCost;
  if (shortfall > 0.05) flags.push(`prometeu ${num(shortfall)} a mais`);

  const humours = Object.values(report.loyalty);
  const broken = humours.filter(value => value < 20).length;
  const sour = humours.filter(value => value >= 20 && value < 50).length;
  if (broken > 0) flags.push(`${broken} em ruptura`);
  if (sour > 0) flags.push(`${sour} obstruindo`);

  return flags.join(" · ");
}

/* ── A CORRIDA ────────────────────────────────────────────────────────────── */

let state = createState(seed);
/** @type {Memory} */
const memory = { passed: new Set() };
/** @type {Report[]} */
const history = [];

const opening = state;

for (let i = 0; i < months; i++) {
  const orders = policy(state, memory);
  const played = playMonth(state, orders, { shock });

  /* Nao era — o instrumento e que estava cego, que e o defeito mais caro que uma ferramenta
     de calibragem pode ter, porque ele parece resultado. */
  if (played.report.enacted) {
    for (const move of played.report.agenda.moves) memory.passed.add(move.program.id);
  }

  history.push(played.report);
  state = played.state;
}

/* ── A SAIDA ──────────────────────────────────────────────────────────────── */

const out = process.stdout;

out.write(
  `\nMANDATO SIMULADO · politica "${policyName}" · semente ${seed} · ` +
    `${months} meses · choque ${shock >= 0 ? "+" : ""}${num(shock * 100)} p.p.\n` +
    `valores em R$ bilhoes; "verba" e o mes, "folga" e o discricionario que cabia nele\n\n`,
);

if (!values.quiet) {
  out.write(
    pad("mes", 9) +
      pad("pauta", 26) +
      padLeft("prev", 5) +
      padLeft("placar", 8) +
      padLeft("promet.", 9) +
      padLeft("pago", 7) +
      padLeft("folga", 8) +
      padLeft("div/PIB", 9) +
      padLeft("base", 6) +
      padLeft("pais", 6) +
      "  nota\n",
  );
  out.write("-".repeat(118) + "\n");

  for (const report of history) {
    const tally = report.tally;
    out.write(
      pad(monthLabel(report.month).replace(" · ", "/"), 9) +
        pad(report.agenda.proposal?.label ?? "—", 26) +
        padLeft(tally ? String(tally.expected) : "—", 5) +
        padLeft(tally ? `${tally.votes} ${tally.passed ? "ok" : "x"}` : "—", 8) +
        padLeft(num(report.promisedCost), 9) +
        padLeft(num(report.paidCost), 7) +
        padLeft(num(report.room), 8) +
        padLeft(`${num(report.budget.debtRatio * 100)}%`, 9) +
        padLeft(num(averageLoyalty(report.loyalty), 0), 6) +
        padLeft(num(averageLoyalty(report.capacity.index), 0), 6) +
        "  " +
        flagsOf(report) +
        "\n",
    );
  }
  out.write("\n");
}

/* ── O RESUMO ─────────────────────────────────────────────────────────────── */

const voted = history.filter(report => report.tally);
const won = voted.filter(report => report.tally?.passed);
const contingent = history.filter(report => report.budget.contingency);
const promisedTotal = history.reduce((sum, report) => sum + report.promisedCost, 0);
const paidTotal = history.reduce((sum, report) => sum + report.paidCost, 0);
const last = history.at(-1);

/* E o resultado nao foi um numero um pouco errado — foi o COMPLEMENTO EXATO da verdade:
   politica  o filtro dizia  a verdade (`ratio < 1`) herdado      41         7 piso       44
   0   (44 = os 48 meses menos os 4 contingenciados) agenda      48         0 base       48
   1 promessa     48        48   (esta acertou por coincidencia) No `herdado`, nos sete meses
   em que o corte de fato acontece, `pago + alocado` da EXATAMENTE `room` — entao nenhuma das
   duas clausulas dispara, e o filtro contava os 41 meses em que nada foi cortado. */
const rationed = history.filter(report => report.ratio < 1 - 1e-9);

out.write("RESUMO\n");
out.write(`  votacoes            ${won.length} aprovadas de ${voted.length} levadas a voto\n`);
out.write(
  `  reformas            ${memory.passed.size} programas movidos de ${CATALOG.programs.length}\n`,
);
out.write(
  `  rateio              ${rationed.length} meses com corte` +
    (rationed[0] ? ` — a partir de ${monthLabel(rationed[0].month)}` : "") +
    "\n",
);
out.write(
  `  emenda              ${num(paidTotal)} pagos de ${num(promisedTotal)} prometidos` +
    (promisedTotal - paidTotal > 0.05 ? `  (${num(promisedTotal - paidTotal)} nao honrados)` : "") +
    "\n",
);
out.write(
  `  contingenciamento   ${contingent.length} meses` +
    (contingent[0] ? ` — a partir de ${monthLabel(contingent[0].month)}` : "") +
    "\n",
);
out.write(
  `  divida sobre o PIB  ${num((opening.fiscal.debt / opening.macro.gdp) * 100)}%` +
    ` → ${num((last?.budget.debtRatio ?? 0) * 100)}%\n`,
);
out.write(
  `  alocacao            ${num(history.reduce((sum, report) => sum + report.allocatedTotal, 0))} nas areas\n`,
);
out.write(
  `  normas              ${state.norms.length} em arquivo` +
    ` — ${state.norms.length - opening.norms.length} escritas neste mandato\n`,
);
out.write(`  base ao fim\n`);
for (const party of CATALOG.parties) {
  const value = state.loyalty[party.id] ?? 0;
  const mood = value < 20 ? "ruptura" : value < 50 ? "obstrucao" : "com o governo";
  out.write(`    ${pad(party.label, 18)}${padLeft(num(value, 0), 4)}   ${mood}\n`);
}

out.write(`  o pais ao fim\n`);
/* A COLUNA SE MEDE PELO NOME MAIS LONGO DO CATALOGO, e nao por uma largura digitada. */
const AREA_COLUMN = Math.max(...CATALOG.areas.map(area => area.label.length)) + 2;
for (const area of CATALOG.areas) {
  const before = area.initial;
  const after = state.capacity.index[area.id] ?? 0;
  const delta = after - before;
  out.write(
    `    ${pad(area.label, AREA_COLUMN)}${pad(area.index, 14)}` +
      `${padLeft(num(before, 0), 4)} → ${padLeft(num(after, 0), 3)}` +
      `   ${delta >= 0 ? "+" : ""}${num(delta, 0)}\n`,
  );
}
out.write("\n");
