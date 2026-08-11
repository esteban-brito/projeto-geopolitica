/* O SIMULADOR DE MANDATO — o jogo rodando sem tela nenhuma.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELE EXISTE ANTES DA INTERFACE. A calibragem de hoje foi girada contra
   os testes: os limiares da votacao e os `threat` do catalogo foram escolhidos
   ate as provas ficarem verdes, e prova verde diz que a regra vale, nao que o
   numero e bom. A pergunta que faltava instrumento e outra — "como esta partida
   se comporta ao longo de 48 meses?" —, e ela nao se responde apertando um botao
   quarenta e oito vezes no navegador.

   Entao aqui o mandato inteiro roda em milissegundos, sob uma politica declarada,
   e devolve a serie temporal. O que se enxerga com isso e o que teste de
   propriedade nao pega: em que mes a armadilha fiscal fecha, quantos meses de
   verba a base aguenta, se existe uma politica dominante que ganha tudo sem
   escolher nada.

   ── AS POLITICAS SAO INSTRUMENTO, e nao adversario ───────────────────────────
   Nenhuma delas quer ser um jogador competente: elas sao SONDAS, cada uma
   exagerando um comportamento para isolar um efeito. `parado` mede a queda
   natural; `promessa` mede a traicao; a distancia entre `agenda` e `promessa` e o
   preco da imprudencia fiscal, em meses de base.

   ── USO ──────────────────────────────────────────────────────────────────────
     node tools/simulate.mjs
     node tools/simulate.mjs --policy promessa --months 48
     node tools/simulate.mjs --seed 7 --gdp-growth -0.02
     node tools/simulate.mjs --policy agenda --quiet          (so o resumo) */

import { parseArgs } from "node:util";
import { costOf, discretionaryRoom, playMonth } from "../src/application/turn.mjs";
import { whipCount } from "../src/domain/congress/index.mjs";
import { CATALOG } from "../src/data/catalog.mjs";
import { SIMPLE_MAJORITY } from "../src/data/parties.mjs";
import { createState, monthLabel } from "../src/state/state.mjs";

/**
 * @typedef {import("../src/state/state.mjs").GameState} GameState
 * @typedef {import("../src/application/turn.mjs").Orders} Orders
 * @typedef {import("../src/application/turn.mjs").Report} Report
 */

/* ── AS POLITICAS ─────────────────────────────────────────────────────────── */

/* Quanto de verba, por mes, apenas EMPATA o decaimento da lealdade. Ele nao e
   digitado aqui: sai da razao entre as duas constantes do congresso, e por isso
   continua certo quando alguem as recalibrar. Se fosse um numero solto, a
   politica `base` viraria mentira silenciosa no dia seguinte a calibragem. */
const UPKEEP = 1.5 / 12;

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
 * Ele existe para separar duas coisas que a primeira simulacao misturava: uma
 * politica que promete 5,8 e paga 0,3 esta medindo a propria imprudencia, e nao
 * o aperto. Governo prudente promete o que cabe; medir a traicao e trabalho da
 * politica que existe para isso.
 *
 * @param {GameState} state
 */
function affordableLevel(state) {
  const full = costOf(everyone(1), CATALOG.parties, CATALOG.fiscal.seatPrice);
  if (full <= 0) return 0;
  return Math.max(0, Math.min(1, discretionaryRoom(state) / full));
}

/**
 * O menor nivel de verba UNIFORME que a previsao diz ser suficiente.
 *
 * ⚠ UNIFORME E BURRO DE PROPOSITO: ele paga tambem a bancada que jamais votaria
 * a favor, e um jogador humano nao faz isso. A politica nao existe para jogar
 * bem — existe para produzir uma serie comparavel entre execucoes. Uma politica
 * que negociasse bancada a bancada mediria a esperteza dela, e nao o modelo.
 *
 * @param {import("../src/data/bills.mjs").Bill} bill
 * @param {Record<string, number>} loyalty
 * @returns {number | null} nulo quando nem verba cheia aprova
 */
function priceOfPassage(bill, loyalty) {
  for (let level = 0; level <= 1.0001; level += 0.05) {
    const forecast = whipCount({
      bill,
      parties: CATALOG.parties,
      funding: everyone(Math.min(1, level)),
      loyalty,
    });
    if (forecast.votes >= SIMPLE_MAJORITY) return Math.min(1, level);
  }
  return null;
}

/**
 * A proxima pauta que ainda nao passou, na ordem do catalogo.
 *
 * @param {Memory} memory
 */
function nextBill(memory) {
  return CATALOG.bills.find(bill => !memory.passed.has(bill.id));
}

/** @type {Record<string, Policy>} */
const POLICIES = {
  /* O CONTROLE. Ninguem pauta nada, ninguem paga nada — e a serie mostra a
     queda livre: quantos meses a base leva para obstruir sozinha, e em que mes
     a obrigatoria fura o teto sem ajuda de ninguem. */
  parado: () => ({ billId: null, funding: everyone(0) }),

  /* SO A MANUTENCAO. Paga o suficiente para a lealdade nao cair e nao pauta
     nada. Mede o custo de simplesmente CONTINUAR governando — e o mes em que
     esse custo deixa de caber e a resposta que este simulador foi feito para
     dar. */
  base: state => ({ billId: null, funding: everyone(Math.min(UPKEEP, affordableLevel(state))) }),

  /* O GOVERNO PRUDENTE. Varre a fila inteira todo mes e leva a voto a PRIMEIRA
     pauta que a previsao aprova e que cabe no caixa; se nenhuma couber, recua
     para a manutencao.

     VARRER A FILA INTEIRA, e nao parar na primeira, foi correcao que a propria
     simulacao cobrou. Parando na primeira, o governo travava no fim do foro
     privilegiado — que a ameaca torna caro de proposito — e ficava vinte e tres
     meses sem pautar NADA, com o caixa sobrando. Uma politica que trava mede a
     si mesma, e nao o modelo. */
  agenda: (state, memory) => {
    const room = discretionaryRoom(state);

    for (const bill of CATALOG.bills) {
      if (memory.passed.has(bill.id)) continue;
      const level = priceOfPassage(bill, state.loyalty);
      if (level === null) continue;
      const funding = everyone(level);
      if (costOf(funding, CATALOG.parties, CATALOG.fiscal.seatPrice) > room) continue;
      return { billId: bill.id, funding };
    }

    return { billId: null, funding: everyone(Math.min(UPKEEP, affordableLevel(state))) };
  },

  /* O GOVERNO QUE PROMETE. Pauta e oferece verba cheia todo mes, sem olhar o
     caixa. E a sonda da traicao: o rateio corta a promessa no que o teto deixa,
     e o buraco entre o falado e o pago desaba sobre a lealdade mes a mes. */
  promessa: (state, memory) => {
    const bill = nextBill(memory);
    return { billId: bill?.id ?? null, funding: everyone(1) };
  },
};

/* ── OS ARGUMENTOS ────────────────────────────────────────────────────────── */

const { values } = parseArgs({
  options: {
    seed: { type: "string", default: "20270101" },
    months: { type: "string", default: "48" },
    policy: { type: "string", default: "agenda" },
    "gdp-growth": { type: "string", default: "0" },
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
const gdpGrowth = Number(values["gdp-growth"]);

for (const [label, value] of [
  ["seed", seed],
  ["months", months],
  ["gdp-growth", gdpGrowth],
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
 * O que o mes tem de anormal, dito em uma coluna. Sem isto a tabela vira um
 * campo de numeros em que o mes decisivo passa despercebido.
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
  const played = playMonth(state, orders, { gdpGrowth });

  if (played.report.bill && played.report.tally?.passed) {
    memory.passed.add(played.report.bill.id);
  }

  history.push(played.report);
  state = played.state;
}

/* ── A SAIDA ──────────────────────────────────────────────────────────────── */

const out = process.stdout;

out.write(
  `\nMANDATO SIMULADO · politica "${policyName}" · semente ${seed} · ` +
    `${months} meses · PIB ${gdpGrowth >= 0 ? "+" : ""}${num(gdpGrowth * 100)}% ao ano\n` +
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
      "  nota\n",
  );
  out.write("-".repeat(112) + "\n");

  for (const report of history) {
    const tally = report.tally;
    out.write(
      pad(monthLabel(report.month).replace(" · ", "/"), 9) +
        pad(report.bill?.label ?? "—", 26) +
        padLeft(tally ? String(tally.expected) : "—", 5) +
        padLeft(tally ? `${tally.votes} ${tally.passed ? "ok" : "x"}` : "—", 8) +
        padLeft(num(report.promisedCost), 9) +
        padLeft(num(report.paidCost), 7) +
        padLeft(num(report.room), 8) +
        padLeft(`${num(report.budget.debtRatio * 100)}%`, 9) +
        padLeft(num(averageLoyalty(report.loyalty), 0), 6) +
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

out.write("RESUMO\n");
out.write(`  votacoes            ${won.length} aprovadas de ${voted.length} levadas a voto\n`);
out.write(
  `  pautas aprovadas    ${memory.passed.size} de ${CATALOG.bills.length}` +
    (memory.passed.size > 0 ? ` — ${[...memory.passed].join(", ")}` : "") +
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
  `  divida sobre o PIB  ${num((opening.fiscal.debt / opening.fiscal.gdp) * 100)}%` +
    ` → ${num((last?.budget.debtRatio ?? 0) * 100)}%\n`,
);
out.write(`  base ao fim\n`);
for (const party of CATALOG.parties) {
  const value = state.loyalty[party.id] ?? 0;
  const mood = value < 20 ? "ruptura" : value < 50 ? "obstrucao" : "com o governo";
  out.write(`    ${pad(party.label, 18)}${padLeft(num(value, 0), 4)}   ${mood}\n`);
}
out.write("\n");
