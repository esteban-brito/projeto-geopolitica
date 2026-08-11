/* SUITE · O TURNO — o acoplamento entre o caixa e o Congresso.
   ══════════════════════════════════════════════════════════════════════════════

   As suites dos dois motores provam cada um por dentro. Esta prova o que so
   existe quando eles se encostam, e que nenhuma das duas consegue ver:

     1. o teto MANDA. Nao existe ordem do jogador que gaste mais do que cabe;
     2. o Congresso responde ao que FOI PAGO, e nao ao que foi prometido;
     3. promessa quebrada custa base — e e por isso que contingenciamento,
        que e aritmetica e nao evento, produz crise politica;
     4. o mandato inteiro e reproduzivel a partir da semente e das ordens. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { costOf, discretionaryRoom, playMonth } from "../../src/application/turn.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";
import { BILLS } from "../../src/data/bills.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { createState } from "../../src/state/state.mjs";

/** @typedef {import("../../src/application/turn.mjs").Orders} Orders */

/* Uma folga de centavos para comparacao de ponto flutuante. Ela e larga o
   suficiente para o arredondamento e estreita o suficiente para nao esconder um
   defeito: os valores do jogo estao na casa das dezenas de bilhoes. */
const EPSILON = 1e-9;

/** @param {number} level */
function everyone(level) {
  return Object.fromEntries(PARTIES.map(party => [party.id, level]));
}

const anyFunding = fc
  .array(fc.double({ min: 0, max: 1, noNaN: true }), {
    minLength: PARTIES.length,
    maxLength: PARTIES.length,
  })
  .map(values => Object.fromEntries(PARTIES.map((party, i) => [party.id, values[i] ?? 0])));

const anyOrders = fc.record({
  billId: fc.constantFrom(...BILLS.map(bill => bill.id), null),
  funding: anyFunding,
});

/**
 * Um catalogo com outros parametros fiscais. Ele existe para a suite conseguir
 * montar posicoes que o catalogo real leva anos para alcancar — o
 * contingenciamento e uma delas, e esperar 47 meses por ele dentro de um teste
 * seria transformar uma prova em uma simulacao.
 *
 * @param {Partial<typeof CATALOG.fiscal>} overrides
 * @returns {typeof CATALOG}
 */
function catalogWith(overrides) {
  return { ...CATALOG, fiscal: { ...CATALOG.fiscal, ...overrides } };
}

/* A obrigatoria nasce ACIMA da ancora de despesa, entao ela ja fura o teto no
   primeiro mes: nao ha discricionario nenhum, e nao por escolha do jogador. */
const SQUEEZED = catalogWith({ initialMandatory: 3600, initialDiscretionary: 0 });

test("O TETO MANDA: nenhuma ordem gasta mais do que cabe no mes", () => {
  fc.assert(
    fc.property(anyOrders, orders => {
      const state = createState(1);
      const room = discretionaryRoom(state);
      const { report } = playMonth(state, orders);

      assert.ok(report.paidCost <= room + EPSILON, `pagou ${report.paidCost} com folga de ${room}`);
      /* E o que se paga nunca passa do que se prometeu — o rateio corta, e
         nunca inventa. */
      assert.ok(report.paidCost <= report.promisedCost + EPSILON);
    }),
  );
});

test("a verba paga por bancada nunca passa da prometida, e o rateio e proporcional", () => {
  fc.assert(
    fc.property(anyFunding, funding => {
      const state = createState(2);
      const { report } = playMonth(state, { billId: null, funding });

      /** @type {number[]} */
      const ratios = [];
      for (const party of PARTIES) {
        const promised = report.promised[party.id] ?? 0;
        const paid = report.paid[party.id] ?? 0;
        assert.ok(paid <= promised + EPSILON, `${party.id} recebeu mais do que foi prometido`);
        if (promised > EPSILON) ratios.push(paid / promised);
      }

      /* PROPORCIONAL quer dizer que ninguem e escolhido para sofrer: o corte e o
         mesmo para todos. Se um dia alguem escrever prioridade aqui, esta linha
         fica vermelha e a decisao tera de ser declarada. */
      for (const ratio of ratios) {
        assert.ok(
          Math.abs(ratio - (ratios[0] ?? 0)) < 1e-9,
          `o corte nao foi igual para todos: ${ratios.join(", ")}`,
        );
      }
    }),
  );
});

test("CONTINGENCIAMENTO ENTREGA ZERO, por mais que se prometa", () => {
  fc.assert(
    fc.property(anyOrders, orders => {
      const state = createState(3, SQUEEZED);
      const { report } = playMonth(state, orders, { catalog: SQUEEZED });

      assert.ok(report.budget.contingency, "a posicao montada para apertar nao apertou");
      assert.equal(report.paidCost, 0);
      for (const party of PARTIES) {
        assert.equal(report.paid[party.id], 0, `${party.id} recebeu verba sob contingenciamento`);
      }
    }),
  );
});

test("O CONGRESSO RESPONDE AO PAGO, e nao ao prometido", () => {
  /* A prova do acoplamento. Sob contingenciamento, prometer verba cheia tem de
     produzir EXATAMENTE o mesmo placar que nao prometer nada — porque nos dois
     casos o que chegou na conta foi zero. Se estas duas linhas divergirem,
     promessa esta comprando voto, e o orcamento virou enfeite. */
  const state = createState(4, SQUEEZED);
  const orders = { billId: "reforma-administrativa", funding: everyone(1) };

  const generous = playMonth(state, orders, { catalog: SQUEEZED });
  const honest = playMonth(
    state,
    { billId: "reforma-administrativa", funding: everyone(0) },
    { catalog: SQUEEZED },
  );

  assert.deepEqual(generous.report.tally, honest.report.tally);
});

test("PROMESSA QUEBRADA CUSTA BASE, e custa mais que o simples decaimento", () => {
  const bare = createState(5, SQUEEZED);

  /* Ninguem prometeu nada: a base so escorrega pelo decaimento. */
  const quiet = playMonth(bare, { billId: null, funding: everyone(0) }, { catalog: SQUEEZED });
  /* Prometeu tudo e nao pagou nada, porque o teto nao deixou. */
  const broken = playMonth(bare, { billId: null, funding: everyone(1) }, { catalog: SQUEEZED });

  for (const party of PARTIES) {
    const before = bare.loyalty[party.id] ?? 0;
    const afterQuiet = quiet.state.loyalty[party.id] ?? 0;
    const afterBroken = broken.state.loyalty[party.id] ?? 0;

    assert.ok(afterQuiet < before, `${party.id} nao decaiu num mes sem nada`);
    assert.ok(
      afterBroken < afterQuiet,
      `${party.id} pagou o mesmo por prometer e falhar do que por nao prometer`,
    );
  }
});

test("verba PAGA levanta a base, e a lealdade nunca sai da faixa", () => {
  fc.assert(
    fc.property(anyOrders, fc.integer({ min: 0, max: 5000 }), (orders, seed) => {
      const state = createState(seed);
      const generous = playMonth(state, orders);
      const dry = playMonth(state, { billId: orders.billId, funding: everyone(0) });

      for (const party of PARTIES) {
        const paid = generous.state.loyalty[party.id] ?? 0;
        const unpaid = dry.state.loyalty[party.id] ?? 0;
        assert.ok(paid >= 0 && paid <= 100, `${party.id} saiu da faixa: ${paid}`);
        /* Quem recebeu alguma coisa nunca fica PIOR que quem nao recebeu nada —
           e a promessa honrada em parte ainda pode ficar pior, porque o buraco
           cobra. Entao a comparacao so vale quando o pagamento foi integral. */
        if (generous.report.paidCost >= generous.report.promisedCost - EPSILON) {
          assert.ok(paid >= unpaid - EPSILON, `${party.id} piorou ao ser pago`);
        }
      }
    }),
  );
});

test("o mandato inteiro se refaz da semente e das ordens", () => {
  /* REPLAY. Ele e a razao de o fluxo de aleatoriedade ser contado e de o estado
     ser imutavel: sem esta propriedade, "o Congresso derrubou minha lei" nunca e
     reproduzivel, e portanto nunca e investigavel. */
  const run = () => {
    let state = createState(77);
    const votes = [];
    for (let month = 0; month < 24; month++) {
      const played = playMonth(state, {
        billId: BILLS[month % BILLS.length]?.id ?? null,
        funding: everyone(0.2),
      });
      votes.push(played.report.tally?.votes ?? null);
      state = played.state;
    }
    return { state, votes };
  };

  const first = run();
  const second = run();

  assert.deepEqual(first.state, second.state);
  assert.deepEqual(first.votes, second.votes);
  assert.ok(
    new Set(first.votes).size > 1,
    "vinte e quatro votacoes deram o mesmo placar — o dia parou de sortear",
  );
});

test("o turno nao muta o estado que recebeu", () => {
  const before = createState(9);
  const snapshot = JSON.parse(JSON.stringify(before));
  playMonth(before, { billId: "abertura-comercial", funding: everyone(0.8) });
  assert.deepEqual(JSON.parse(JSON.stringify(before)), snapshot);
});

test("a votacao consome o fluxo, e o mes sem pauta nao consome nada", () => {
  /* Fluxo gasto sem votacao deslocaria o indice e mudaria o resultado de uma
     votacao futura sem relacao nenhuma com o mes parado. */
  const state = createState(11);
  const idle = playMonth(state, { billId: null, funding: everyone(0.1) });
  assert.equal(idle.state.streams.congress.draws, state.streams.congress.draws);

  const voted = playMonth(state, { billId: "abertura-comercial", funding: everyone(0.1) });
  assert.equal(voted.state.streams.congress.draws, state.streams.congress.draws + PARTIES.length);
});

test("pauta aprovada muda a despesa obrigatoria PARA SEMPRE, no sinal do catalogo", () => {
  /* O que torna a decisao pesada: o custo politico se paga uma vez, e o efeito
     fiscal fica no resto do mandato. */
  const housing = BILLS.find(bill => bill.id === "programa-habitacional");
  assert.ok(housing && housing.fiscalImpact < 0, "o catalogo perdeu a pauta que CUSTA");

  const state = createState(13);
  const passed = playMonth(state, { billId: housing.id, funding: everyone(1) });
  assert.ok(passed.report.tally?.passed, "a pauta escolhida para esta prova nao passou");

  const idle = playMonth(state, { billId: null, funding: everyone(1) });

  assert.ok(
    passed.state.fiscal.mandatory > idle.state.fiscal.mandatory,
    "aprovar um programa que custa tinha de aumentar a obrigatoria",
  );
  assert.ok(
    discretionaryRoom(passed.state) < discretionaryRoom(idle.state),
    "a obrigatoria maior tinha de apertar o discricionario do mes seguinte",
  );
});

test("o preco da cadeira traduz verba em bilhoes, e o total fecha", () => {
  const full = costOf(everyone(1), PARTIES, CATALOG.fiscal.seatPrice);
  const seats = PARTIES.reduce((sum, party) => sum + party.seats, 0);
  assert.equal(full, seats * CATALOG.fiscal.seatPrice);

  /* COMPRAR O PLENARIO INTEIRO NAO PODE CABER NUM MES. Se couber, existe uma
     jogada dominante — pagar todo mundo sempre — e a escolha de a quem pagar
     deixa de ser escolha. Esta e a unica prova do arquivo que cobra
     CALIBRAGEM, e ela esta aqui de proposito: o dia em que alguem mexer no
     preco da cadeira ou no discricionario inicial, ela cobra a conversa. */
  assert.ok(
    full > discretionaryRoom(createState(1)),
    `o plenario inteiro custa ${full.toFixed(1)} e cabe no mes — nao ha o que escolher`,
  );
});
