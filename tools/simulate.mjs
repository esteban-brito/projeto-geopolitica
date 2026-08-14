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
     node tools/simulate.mjs --seed 7 --shock 0.02
     node tools/simulate.mjs --policy agenda --quiet          (so o resumo) */

import { parseArgs } from "node:util";
import { costOf, discretionaryRoom, playMonth } from "../src/application/turn.mjs";
import { compose, spendOf } from "../src/application/agenda.mjs";
import { whipCount } from "../src/domain/congress/index.mjs";
import { CATALOG } from "../src/data/catalog.mjs";
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

/* ── O QUE "NAO FAZER NADA" PASSOU A SIGNIFICAR ─────────────────────────────
   A distincao nasceu com o orcamento granular, e ela e a razao de este arquivo
   ter sido reescrito em 13/08/2026. Antes, `allocation: {}` queria dizer "gastei
   zero" — o governo nao alocava e o pais apodrecia de graca.

   Agora nao existe "gastar zero" sem decidir. A configuracao HERDADA e um gasto,
   e um gasto grande: o antecessor deixou trinta e um programas rodando, e mante-
   los custa mais do que o teto do arcabouco abre. Entao ha DOIS controles, e nao
   um, porque sao duas perguntas diferentes:

     `herdado` — o presidente nao toca em nada. Mede o que o pais faz sozinho, e
                 mede tambem o rateio mordendo por aritmetica pura;
     `piso`    — o presidente corta tudo ate o minimo legal. E o contrafactual
                 mais barato que existe sem pedir voto a ninguem, e a diferenca
                 entre os dois e o tamanho real da margem de manobra.

   Confundir os dois era o que a versao anterior fazia sem saber. */

/** Todo programa no piso: o minimo que a lei permite sem pedir voto a ninguem. */
function atFloor() {
  return Object.fromEntries(CATALOG.programs.map(program => [program.id, program.floor]));
}

/**
 * A configuracao vigente com a parte DISCRICIONARIA encolhida por um fator.
 *
 * Ela encolhe so o que esta acima do piso, porque so isso e escolha: o resto e a
 * lei, e a lei nao se aperta com regua — se aperta com voto.
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
 * Busca binaria porque a relacao entre o fator e o custo e linear mas o teto nao
 * e: `discretionaryRoom` depende da posicao fiscal, que nao muda com o fator.
 * Vinte passos dao precisao de um milesimo, e sao baratos.
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
 * @param {import("../src/domain/congress/index.mjs").Motion} motion
 * @param {number} quorum
 * @param {Record<string, number>} loyalty
 * @returns {number | null} nulo quando nem verba cheia aprova
 */
function priceOfPassage(motion, quorum, loyalty) {
  /* CONTRA O QUORUM DA PROPOSTA, e nao contra 257 sempre. A primeira versao usava
     a maioria simples para tudo, e por isso mandava emenda a plenario achando que
     bastavam 257 — a politica levava a voto o que nao tinha como passar, e a
     serie media a ingenuidade dela em vez do modelo. */
  if (quorum <= 0) return 0;

  for (let level = 0; level <= 1.0001; level += 0.05) {
    const forecast = whipCount({
      bill: motion,
      parties: CATALOG.parties,
      funding: everyone(Math.min(1, level)),
      loyalty,
    });
    if (forecast.votes >= quorum) return Math.min(1, level);
  }
  return null;
}

/**
 * A PROXIMA REFORMA DA FILA — o programa cujo piso ainda nao foi furado.
 *
 * ⚠ ELA SUBSTITUIU `nextBill`, e a diferenca e o ciclo inteiro: nao ha mais fila
 * de pautas prontas. Uma "reforma" aqui e uma proposta COMPOSTA de um movimento
 * so — furar o piso de um programa —, montada pela politica na hora. A fila e a
 * ordem do catalogo apenas porque a politica precisa de alguma ordem estavel para
 * a serie ser comparavel entre execucoes.
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
  /* O PRESIDENTE AUSENTE. Nao toca em controle nenhum e nao paga ninguem: o
     orcamento do antecessor segue rodando, mes apos mes, ate o rateio decidir
     sozinho o que cortar.

     ⚠ ESTA E A POLITICA QUE MEDE O ACHADO DE 13/08/2026. Com o catalogo real, a
     configuracao herdada custa MAIS do que o teto abre — entao esta politica nao
     e passiva coisa nenhuma: ela e um governo prometendo um pais que nao cabe, e
     a serie mostra o contingenciamento comendo por conta propria. */
  herdado: () => ({ funding: everyone(0) }),

  /* O CORTE TOTAL. Todo programa no minimo legal, ninguem pago. E o contrafactual
     mais barato que existe sem pedir voto, e a distancia entre ele e `herdado` e
     a margem de manobra real de um presidente brasileiro — em bilhoes e em
     pontos de indice. */
  piso: () => ({ levels: atFloor(), funding: everyone(0) }),

  /* SO A MANUTENCAO. Corta o orcamento ate ele caber, e usa a folga para segurar
     a lealdade onde ela esta. Mede o custo de simplesmente CONTINUAR governando —
     e o mes em que esse custo deixa de caber e a resposta que este simulador foi
     feito para dar. */
  base: state => {
    const reserve = costOf(everyone(UPKEEP), CATALOG.parties, CATALOG.fiscal.seatPrice);
    return {
      levels: squeeze(state, affordableShare(state, reserve)),
      funding: everyone(Math.min(UPKEEP, affordableLevel(state))),
    };
  },

  /* O GOVERNO PRUDENTE. Aperta o orcamento ate sobrar caixa, e usa o que sobrou
     para comprar a PRIMEIRA reforma da fila que a previsao aprova e que cabe. Se
     nenhuma couber, recua para a manutencao.

     VARRER A FILA INTEIRA, e nao parar na primeira, foi correcao que a propria
     simulacao cobrou numa sessao anterior: parando na primeira, o governo travava
     na pauta cara e ficava vinte e tres meses sem pautar NADA com o caixa
     sobrando. Uma politica que trava mede a si mesma, e nao o modelo. */
  agenda: (state, memory) => {
    /* A MANUTENCAO VEM PRIMEIRO, e o que sobra e que compra voto. E a ordem que
       um governo prudente segue: hospital aberto antes de emenda paga. */
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

      const level = priceOfPassage(agenda.proposal, agenda.quorum, state.loyalty);
      if (level === null) continue;
      const funding = everyone(level);
      if (costOf(funding, CATALOG.parties, CATALOG.fiscal.seatPrice) > left) continue;
      return { levels: requested, funding };
    }

    return { levels, funding: everyone(Math.min(UPKEEP, affordableLevel(state))) };
  },

  /* O GOVERNO QUE PROMETE. Pauta uma reforma e oferece verba cheia todo mes, sem
     olhar o caixa. E a sonda da traicao: o rateio corta a promessa no que o teto
     deixa, e o buraco entre o falado e o pago desaba sobre a lealdade mes a mes. */
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
    seed: { type: "string", default: "20270101" },
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
/* ⚠ O CRESCIMENTO DO PIB DEIXOU DE SER PREMISSA. Ele era um argumento porque nao
   havia motor macro: quem simulava declarava "suponha 2% ao ano" e o turno
   obedecia. Com a CORRENTE, o PIB e consequencia — do juro, da carga e da
   capacidade do Estado —, e o que sobrou de premissa e o CHOQUE de oferta, que e
   a unica coisa que vem de fora da economia. */
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
  const played = playMonth(state, orders, { shock });

  /* `enacted` E NAO `tally.passed`. Execucao orcamentaria nao produz placar — ela
     nao vai a plenario —, entao registrar so o que o Congresso aprovou faria a
     politica repropor o mesmo movimento todos os meses e nunca sair do lugar.

     ⚠ E O QUE SE GUARDA E O ID DO PROGRAMA, e nao o rotulo da proposta. A
     primeira versao guardava `proposal.label` e a fila consultava `program.id`:
     nada nunca batia, a politica reproponha a mesma reforma nos 48 meses, e o
     resumo dizia "1 aprovada" como se o modelo fosse duro. Nao era — o
     instrumento e que estava cego, que e o defeito mais caro que uma ferramenta
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

/* ── O RATEIO E A LINHA QUE FALTAVA NO RESUMO ───────────────────────────────
   Ele nasceu em 13/08/2026 junto do achado que so a simulacao mostrou: com o
   orcamento real, o rateio corta TODO MES sem o contingenciamento nunca
   disparar. Sao duas coisas diferentes e o resumo mostrava so uma:

     CONTINGENCIAMENTO  a obrigatoria SOZINHA ja fura o teto. Nao ha o que
                        escolher, e o discricionario e zero;
     RATEIO             o que o governo pediu nao cabe no que sobrou, e todos
                        recebem menos na proporcao.

   Um governo pode passar o mandato inteiro rateando sem nunca contingenciar — e
   era exatamente o que `herdado` fazia enquanto o resumo dizia "0 meses" e
   parecia folga. */
const rationed = history.filter(
  report =>
    report.paidCost + report.allocatedTotal < report.room - 1e-6 ||
    report.promisedCost + report.allocatedTotal > report.room + 1e-6,
);

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
out.write(`  base ao fim\n`);
for (const party of CATALOG.parties) {
  const value = state.loyalty[party.id] ?? 0;
  const mood = value < 20 ? "ruptura" : value < 50 ? "obstrucao" : "com o governo";
  out.write(`    ${pad(party.label, 18)}${padLeft(num(value, 0), 4)}   ${mood}\n`);
}

out.write(`  o pais ao fim\n`);
/* A COLUNA SE MEDE PELO NOME MAIS LONGO DO CATALOGO, e nao por uma largura
   digitada. Com 14 fixos, "Indústria e Infraestrutura" era cortado no meio e
   colava no indice ao lado — o resumo imprimia "Indústria e Incapacidade", que e
   uma area que nao existe. Largura fixa e aposta em nome curto, e o catalogo
   cresce. */
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
