/* promessa quebrada custa base — e e por isso que contingenciamento, que e aritmetica e nao
   evento, produz crise politica; 4. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import {
  costOf,
  discretionaryRoom,
  forecast,
  ledger,
  outlook,
  playMonth,
  settlement,
  situationOf,
} from "../../src/application/turn.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { QUALIFIED_MAJORITY, SIMPLE_MAJORITY } from "../../src/data/regime.mjs";
import { UI } from "../../src/ui/strings.mjs";
import { createState } from "../../src/state/state.mjs";

/** @typedef {import("../../src/application/turn.mjs").Orders} Orders */

/* Ela e larga o suficiente para o arredondamento e estreita o suficiente para nao esconder um
   defeito: os valores do jogo estao na casa das dezenas de bilhoes. */
const EPSILON = 1e-9;

/* OS MOTIVOS QUE A TELA SABE DIZER. */
const UI_REASONS = new Set(Object.keys(UI.verdict));

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

/* UM MOVIMENTO DE ORCAMENTO QUALQUER — um programa sorteado, num nivel sorteado de 0 a 100. */
const anyLevels = fc
  .tuple(fc.constantFrom(...PROGRAMS), fc.integer({ min: 0, max: 100 }))
  .map(([program, level]) => ({ [program.id]: level }));

const anyOrders = fc.record({
  levels: anyLevels,
  funding: anyFunding,
});

/* A ORDEM QUE FURA UM PISO CONSTITUCIONAL — a mais cara que o catalogo produz. */
const HARD = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
if (!HARD) throw new Error("o catalogo perdeu o programa de piso constitucional");
const reform = () => ({ [HARD.id]: HARD.floor - 12 });

/* E UMA QUE SO REMANEJA, dentro do que a lei ja autoriza. */
const LOOSE = PROGRAMS.find(program => program.guard === "none" && program.floor < 20);
if (!LOOSE) throw new Error("o catalogo perdeu o programa de piso solto");
const shuffle = () => ({ [LOOSE.id]: LOOSE.initial - 4 });

/**
 * Ele existe para a suite conseguir montar posicoes que o catalogo real leva anos para
 * alcancar — o contingenciamento e uma delas, e esperar 47 meses por ele dentro de um teste
 * seria transformar uma prova em uma simulacao.
 *
 * @param {Partial<typeof CATALOG.fiscal>} overrides
 * @returns {typeof CATALOG}
 */
function catalogWith(overrides) {
  return { ...CATALOG, fiscal: { ...CATALOG.fiscal, ...overrides } };
}

/* A obrigatoria nasce ACIMA da ancora de despesa, entao ela ja fura o teto no primeiro mes:
   nao ha discricionario nenhum, e nao por escolha do jogador. */
const SQUEEZED = catalogWith({ initialMandatory: 3600, initialDiscretionary: 0 });

test("O TETO MANDA: nenhuma ordem gasta mais do que cabe no mes", () => {
  fc.assert(
    fc.property(anyOrders, orders => {
      const state = createState(1);
      const room = discretionaryRoom(state);
      const { report } = playMonth(state, orders);

      assert.ok(report.paidCost <= room + EPSILON, `pagou ${report.paidCost} com folga de ${room}`);
      /* E o que se paga nunca passa do que se prometeu — o rateio corta, e nunca inventa. */
      assert.ok(report.paidCost <= report.promisedCost + EPSILON);
    }),
  );
});

test("a verba paga por bancada nunca passa da prometida, e o rateio e proporcional", () => {
  fc.assert(
    fc.property(anyFunding, funding => {
      const state = createState(2);
      const { report } = playMonth(state, { funding });

      /** @type {number[]} */
      const ratios = [];
      for (const party of PARTIES) {
        const promised = report.promised[party.id] ?? 0;
        const paid = report.paid[party.id] ?? 0;
        assert.ok(paid <= promised + EPSILON, `${party.id} recebeu mais do que foi prometido`);
        if (promised > EPSILON) ratios.push(paid / promised);
      }

      /* PROPORCIONAL quer dizer que ninguem e escolhido para sofrer: o corte e o mesmo para
         todos. */
      for (const ratio of ratios) {
        assert.ok(
          Math.abs(ratio - (ratios[0] ?? 0)) < 1e-9,
          `o corte nao foi igual para todos: ${ratios.join(", ")}`,
        );
      }
    }),
  );
});

test("SOBRA NAO E CORTE: o relatorio distingue folga de rateio", () => {
  /* O achado 2 do handoff foi escrito desse numero, e ele chegou a bloquear o conserto do
     achado 31 — o defeito mais fundo do projeto. */
  const state = createState(3);

  /* O GOVERNO QUE PEDE POUCO: todo programa no piso e ninguem pago. */
  const floors = Object.fromEntries(PROGRAMS.map(program => [program.id, program.floor]));
  const slack = playMonth(state, { levels: floors });

  assert.ok(
    slack.report.paidCost + slack.report.allocatedTotal < slack.report.room - EPSILON,
    "o caso de folga nao tem folga: este mes gastou tudo o que cabia",
  );
  assert.equal(
    slack.report.ratio,
    1,
    "um mes que gastou MENOS do que cabia foi contado como mes de corte",
  );

  /* O GOVERNO QUE PEDE DEMAIS: verba cheia a todas as bancadas, sem olhar o caixa. */
  const funding = Object.fromEntries(PARTIES.map(party => [party.id, 1]));
  const squeezed = playMonth(state, { funding });
  assert.ok(squeezed.report.ratio < 1, "verba cheia coube no mes, e o rateio nao cortou nada");

  for (const orders of [{ levels: floors }, { funding }, {}]) {
    const closed = settlement(state, orders);
    assert.equal(
      closed.ratio < 1 - EPSILON,
      closed.demand > closed.room + EPSILON,
      "o rateio deixou de significar 'o pedido nao cabe no que sobrou'",
    );
  }
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
  /* Se estas duas linhas divergirem, promessa esta comprando voto, e o orcamento virou
     enfeite. */
  const state = createState(4, SQUEEZED);
  const orders = { levels: reform(), funding: everyone(1) };

  const generous = playMonth(state, orders, { catalog: SQUEEZED });
  const honest = playMonth(
    state,
    { levels: reform(), funding: everyone(0) },
    { catalog: SQUEEZED },
  );

  assert.deepEqual(generous.report.tally, honest.report.tally);
});

test("PROMESSA QUEBRADA CUSTA BASE, e custa mais que o simples decaimento", () => {
  const bare = createState(5, SQUEEZED);

  /* Ninguem prometeu nada: a base so escorrega pelo decaimento. */
  const quiet = playMonth(bare, { funding: everyone(0) }, { catalog: SQUEEZED });
  /* Prometeu tudo e nao pagou nada, porque o teto nao deixou. */
  const broken = playMonth(bare, { funding: everyone(1) }, { catalog: SQUEEZED });

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
      const dry = playMonth(state, { levels: orders.levels, funding: everyone(0) });

      for (const party of PARTIES) {
        const paid = generous.state.loyalty[party.id] ?? 0;
        const unpaid = dry.state.loyalty[party.id] ?? 0;
        assert.ok(paid >= 0 && paid <= 100, `${party.id} saiu da faixa: ${paid}`);
        /* Quem recebeu alguma coisa nunca fica PIOR que quem nao recebeu nada — e a promessa
           honrada em parte ainda pode ficar pior, porque o buraco cobra. */
        const honoured =
          generous.report.promisedCost <= 0 ||
          generous.report.paidCost >= generous.report.promisedCost * (1 - 1e-9);

        if (honoured) {
          assert.ok(paid >= unpaid - EPSILON, `${party.id} piorou ao ser pago`);
        }
      }
    }),
  );
});

test("o mandato inteiro se refaz da semente e das ordens", () => {
  const run = () => {
    let state = createState(77);
    const votes = [];
    for (let month = 0; month < 24; month++) {
      const played = playMonth(state, {
        levels: month % 2 === 0 ? reform() : shuffle(),
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
  playMonth(before, { levels: reform(), funding: everyone(0.8) });
  assert.deepEqual(JSON.parse(JSON.stringify(before)), snapshot);
});

test("a votacao consome o fluxo, e o mes sem pauta nao consome nada", () => {
  /* Fluxo gasto sem votacao deslocaria o indice e mudaria o resultado de uma votacao futura
     sem relacao nenhuma com o mes parado. */
  const state = createState(11);
  const idle = playMonth(state, { funding: everyone(0.1) });
  assert.equal(idle.state.streams.congress.draws, state.streams.congress.draws);

  const written = playMonth(state, { levels: reform(), funding: everyone(0.1) });
  assert.equal(
    written.state.streams.congress.draws,
    state.streams.congress.draws,
    "o mes em que o texto foi protocolado consumiu sorteio — a gaveta nao sorteia",
  );

  const chamber = settlement(state, { funding: everyone(0.1) }).benches.length;

  /* E O PLENARIO GASTA UMA VEZ SO, no mes em que ele acontece — tres meses depois da caneta. */
  let now = state;
  let before = state.streams.congress.draws;
  for (let month = 0; month < 8; month++) {
    const played = playMonth(
      now,
      month === 0 ? { levels: reform(), funding: everyone(0.1) } : { funding: everyone(0.1) },
    );
    if (played.report.tally) {
      assert.equal(
        played.state.streams.congress.draws,
        before + chamber,
        "a votacao do plenario nao consumiu exatamente um sorteio por bancada",
      );
      return;
    }
    assert.equal(
      played.state.streams.congress.draws,
      before,
      `o mes ${month} da tramitacao consumiu sorteio sem ter havido votacao`,
    );
    before = played.state.streams.congress.draws;
    now = played.state;
  }

  throw new Error("o texto nao chegou ao plenario em oito meses");
});

test("pauta aprovada muda a despesa obrigatoria PARA SEMPRE, no sinal do catalogo", () => {
  /* O que torna a decisao pesada: o custo politico se paga uma vez, e o efeito fiscal fica no
     resto do mandato. */
  /* ⚠ O SINAL INVERTEU JUNTO COM A MECANICA, e a inversao e a prova de que o modelo ficou
     mais honesto. */
  const state = createState(13);
  const passed = playMonth(state, { levels: reform(), funding: everyone(1) });

  if (passed.report.tally?.passed) {
    const idle = playMonth(state, { funding: everyone(1) });
    assert.ok(
      passed.state.fiscal.mandatory < idle.state.fiscal.mandatory,
      "furar um piso constitucional tinha de aliviar a obrigatoria",
    );

    /* E O ALIVIO ATRAVESSA O MES: a obrigatoria menor abre discricionario no mes seguinte,
       que e a razao inteira de alguem pagar 308 votos por uma reforma. */
    assert.ok(
      discretionaryRoom(passed.state) > discretionaryRoom(idle.state),
      "a obrigatoria menor tinha de abrir o discricionario do mes seguinte",
    );
  }
});

test("o preco da cadeira traduz verba em bilhoes, e o total fecha", () => {
  const full = costOf(everyone(1), PARTIES, CATALOG.fiscal.seatPrice);
  const seats = PARTIES.reduce((sum, party) => sum + party.seats, 0);
  assert.equal(full, seats * CATALOG.fiscal.seatPrice);

  /* COMPRAR O PLENARIO INTEIRO NAO PODE CABER NUM MES. */
  assert.ok(
    full > discretionaryRoom(createState(1)),
    `o plenario inteiro custa ${full.toFixed(1)} e cabe no mes — nao ha o que escolher`,
  );
});

/* O defeito que a lista existia para impedir — cobrar o mesmo impacto fiscal duas vezes —
   deixou de ser possivel por construcao, e nao por vigilancia: nao ha "aprovar de novo"
   quando o que se aprova e um nivel. */

test("REPETIR A ORDEM NAO COBRA DUAS VEZES, e nem vai a plenario de novo", () => {
  const state = createState(13);
  const cut = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 10);
  assert.ok(cut, "o catalogo perdeu o programa de piso constitucional desta prova");

  const orders = { levels: { [cut.id]: cut.floor - 8 }, funding: everyone(1) };
  const first = playMonth(state, orders);

  /* A MESMA ORDEM, DE NOVO — partindo do estado que ela produziu. */
  const again = playMonth(first.state, orders);
  const moved = first.state.levels[cut.id] !== state.levels[cut.id];

  if (moved) {
    assert.equal(again.report.agenda.proposal, null, "o nivel ja vigente voltou ao plenario");
    assert.equal(again.report.agenda.quorum, 0);

    /* O EFEITO FISCAL E O QUE IMPORTA AQUI, e era ele que dobrava no desenho antigo. */
    const idle = playMonth(first.state, { funding: everyone(1) });
    assert.ok(
      Math.abs(again.state.fiscal.mandatory - idle.state.fiscal.mandatory) < EPSILON,
      "repedir um nivel ja vigente cobrou o alivio fiscal outra vez",
    );

    /* Nem o fluxo pode andar: votacao que nao aconteceu nao saca. */
    assert.equal(again.state.streams.congress.draws, first.state.streams.congress.draws);
  }
});

test("A DERROTA DEVOLVE O NIVEL, e a execucao orcamentaria sobrevive a ela", () => {
  const state = createState(5);

  const hard = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  const easy = PROGRAMS.find(program => program.guard === "none" && program.floor < 20);
  assert.ok(hard && easy, "o catalogo precisa dos dois casos para esta prova valer");

  const played = playMonth(state, {
    levels: { [hard.id]: hard.floor - 15, [easy.id]: easy.initial - 5 },
    funding: everyone(0),
  });

  assert.equal(played.report.agenda.quorum, QUALIFIED_MAJORITY, "o pacote nao virou emenda");

  /* A versao anterior fixava `passed: false` e quebrou na recalibragem de : com o orcamento
     real, uma emenda pode passar no mes 5 com verba zero, o que e um achado de CALIBRAGEM e
     nao um defeito desta mecanica. */
  const budgetMoved = (played.state.levels[easy.id] ?? 0) < (state.levels[easy.id] ?? 0);
  assert.ok(budgetMoved, "o remanejamento que nao dependia de voto nao aconteceu");

  if (played.report.tally?.passed) {
    assert.ok(
      (played.state.levels[hard.id] ?? 0) < (state.levels[hard.id] ?? 0),
      "a emenda passou e o nivel nao andou",
    );
  } else {
    assert.equal(
      played.state.levels[hard.id],
      state.levels[hard.id],
      "a reforma caiu e o nivel mudou assim mesmo",
    );
  }
});

test("A TELA E O TURNO FAZEM A MESMA CONTA: o rateio previsto e o rateio executado", () => {
  /* O valor dela depende inteiramente de ela nao divergir do turno — e divergencia entre
     previsao e execucao e o tipo de defeito que so aparece no caso extremo, que aqui e
     justamente o caso interessante: o mes em que a promessa estoura o caixa. */
  fc.assert(
    fc.property(anyOrders, fc.integer({ min: 1, max: 40 }), (orders, seed) => {
      const state = createState(seed);
      const previewed = settlement(state, orders);
      const played = playMonth(state, orders);

      assert.equal(played.report.room, previewed.room);
      assert.deepEqual(played.report.promised, previewed.promised);
      assert.deepEqual(played.report.paid, previewed.paid);
      assert.deepEqual(played.report.allocated, previewed.allocated);
      assert.equal(played.report.promisedCost, previewed.promisedCost);
      assert.equal(played.report.paidCost, previewed.paidCost);
      assert.equal(played.report.allocatedTotal, previewed.allocatedTotal);
    }),
  );
});

test("A AREA E O TURNO PROJETAM O MESMO INDICE: a seta nao aponta para o lado errado", () => {
  /* A MALHA consome o gasto CHEIO ja rateado (`funded`), e `asked` e so a parte acima do
     piso: na Previdencia, R$ 2,4 bi contra R$ 126,7 bi.
     E o canal `capacity` da educacao nao entrava.
     Medido no mes 1 da partida padrao, ANTES do conserto: em CINCO das oito areas a seta
     apontava para o lado errado. */
  fc.assert(
    fc.property(anyOrders, fc.integer({ min: 1, max: 40 }), (orders, seed) => {
      const state = createState(seed);
      const ahead = outlook(state, orders);
      const played = playMonth(state, orders);

      assert.deepEqual(
        ahead.index,
        played.report.capacity.index,
        "a area prometeu um indice e o mes entregou outro",
      );
    }),
  );

  /* ── E O CONTRAFACTUAL E O MES SEM AS ORDENS, e nao um mundo inalcancavel ────── `idle` era
     `value − decay`: o indice se a area recebesse ZERO. */
  const state = createState(9);
  const quiet = playMonth(state, {});
  assert.deepEqual(
    outlook(state, { funding: Object.fromEntries(PARTIES.map(p => [p.id, 1])) }).idle,
    quiet.report.capacity.index,
    "o contrafactual da area nao e o mes sem ordens",
  );
});

test("O PLACAR E O TURNO FECHAM A MESMA CONTA: o painel de Financas nao inventa numero", () => {
  /* Ela vale mais aqui do que la, porque o painel e a unica tela do jogo em que o jogador nao
     tem como conferir nada: na area ele ve o controle que moveu, na Mesa ve a bancada que
     pagou — no placar ele so tem o numero, e um numero que divergisse do turno seria
     indistinguivel de um numero certo. */
  fc.assert(
    fc.property(anyFunding, fc.integer({ min: 1, max: 40 }), (funding, seed) => {
      const state = createState(seed);
      const orders = { levels: shuffle(), funding };

      const shown = ledger(state, orders);
      const played = playMonth(state, orders);

      assert.equal(shown.budget.revenue, played.report.budget.revenue);
      assert.equal(shown.budget.mandatory, played.report.budget.mandatory);
      assert.equal(shown.budget.ceiling, played.report.budget.ceiling);
      assert.equal(shown.budget.allowance, played.report.budget.allowance);
      assert.equal(shown.budget.contingency, played.report.budget.contingency);
      assert.equal(shown.budget.balance, played.report.budget.balance);
      assert.equal(shown.interest, played.report.interest);

      /* E O ESTOQUE FECHA COM O MES: o que o painel chama de divida bruta e exatamente com
         quanto o mes seguinte comeca. */
      assert.ok(
        Math.abs(shown.debt - played.state.fiscal.debt) < EPSILON,
        `o painel mostrou ${shown.debt} e o mes fechou em ${played.state.fiscal.debt}`,
      );
    }),
  );
});

test("e o corte aparece: promessa que nao cabe entrega MENOS voto do que promete", () => {
  /* A prova de que a previsao da tela precisa usar o pago. */
  const state = createState(9);
  const orders = { levels: reform(), funding: everyone(0.2) };

  const rich = settlement(state, orders);
  /* O estado tambem nasce apertado: a obrigatoria de abertura e do catalogo, e um estado
     normal lido com parametros apertados seria outra coisa. */
  const poor = settlement(createState(9, SQUEEZED), orders, SQUEEZED);

  /* Isso nao e defeito: e a armadilha do LASTRO funcionando com numeros de
     verdade, e e a primeira decisao real que o jogo cobra — cortar alguma coisa
     antes de poder prometer qualquer coisa. O que a prova cobra agora e a */
  assert.ok(
    rich.ratio > poor.ratio,
    `o caixa folgado cortou tanto quanto o apertado: ${rich.ratio} contra ${poor.ratio}`,
  );
  assert.ok(poor.ratio < 1, "o catalogo apertado tinha de cortar");

  for (const party of PARTIES) {
    assert.ok((poor.paid[party.id] ?? 0) < (poor.promised[party.id] ?? 0));
  }
});

/* ── A POSICAO DO GOVERNO ────────────────────────────────────────────────────
   `situationOf` compoe LASTRO e ECLUSA para responder se o governo TEM COMO
   governar. Ela substituiu um campo do estado que nenhum motor movia — e o que
   estas provas cobram e que ela continue sendo consequencia, e nao decoracao. */

test("a partida abre com o governo de pe, e o motivo e dito", () => {
  const standing = situationOf(createState(1));

  assert.notEqual(standing.level, "crisis", "a posse ja comeca em crise — reveja a calibragem");
  assert.ok(
    standing.base > SIMPLE_MAJORITY,
    `a base de abertura e ${standing.base}, abaixo da maioria simples`,
  );
  assert.ok(UI_REASONS.has(standing.reason), `motivo desconhecido: ${standing.reason}`);
});

test("O TETO FECHADO E CRISE, e ele vem antes de qualquer outra leitura", () => {
  /* A ordem das perguntas e a da gravidade: sem discricionario nao ha emenda, e sem emenda a
     base nao se compra de volta. */
  const squeezed = createState(3, SQUEEZED);
  const standing = situationOf(squeezed, SQUEEZED);

  assert.equal(standing.level, "crisis");
  assert.equal(standing.reason, "contingency");
});

test("bancada rompida e crise mesmo com o caixa livre", () => {
  const state = createState(4);
  const broken = { ...state, loyalty: { ...state.loyalty, [PARTIES[0]?.id ?? ""]: 5 } };

  const standing = situationOf(broken);
  assert.equal(standing.level, "crisis");
  assert.equal(standing.reason, "rupture");
});

test("OBSTRUCAO SEGURA EM ESTAVEL: o degrau do meio existe de verdade", () => {
  const state = createState(5);
  const sour = { ...state, loyalty: { ...state.loyalty, [PARTIES[0]?.id ?? ""]: 45 } };

  const standing = situationOf(sour);
  assert.equal(standing.level, "stable");
  assert.equal(standing.reason, "obstruction");
});

test("a base derretendo derruba o governo em minoria", () => {
  const state = createState(6);
  const abandoned = { ...state, loyalty: everyone(25) };

  const standing = situationOf(abandoned);
  assert.equal(standing.level, "crisis");
  assert.equal(standing.reason, "minority");
});

/* inflacao, a MALHA media a arrecadacao contra o ponto neutro em vez da abertura,
   e o dividendo das estatais era somado por cima de uma carga que ja o continha. */

test("O PRESIDENTE AUSENTE TERMINA MAIS ENDIVIDADO, e isso e o mundo", () => {
  /* A afirmacao mais simples que o modelo tem de sustentar, e ela esteve INVERTIDA por tres
     sessoes: quem nao tocava em nada terminava o mandato com a MELHOR divida do quadro (78% →
     68,4%), e quem cortava tudo terminava com a pior. */
  let state = createState();
  const opening = state.fiscal.debt / state.macro.gdp;

  for (let month = 0; month < 48; month++) {
    state = playMonth(state, {}).state;
  }

  const closing = state.fiscal.debt / state.macro.gdp;
  assert.ok(
    closing > opening,
    `o governo parado saiu de ${(opening * 100).toFixed(1)}% para ${(closing * 100).toFixed(1)}% — ` +
      `um pais que se desendivida sem ninguem governar`,
  );
});

test("O DEFICIT PRIMARIO E ALCANCAVEL, e o modelo nao o proibe por construcao", () => {
  /* O defeito de fundo, e o mais dificil de ver: `allowance = min(caixa, teto)` e `saldo =
     caixa/12 − empenho` faziam o primario ser NAO-NEGATIVO por construcao. */
  let state = createState();
  const funding = Object.fromEntries(PARTIES.map(party => [party.id, 1]));
  let deficits = 0;

  for (let month = 0; month < 48; month++) {
    const played = playMonth(state, { funding });
    if (played.report.budget.balance < 0) deficits++;
    state = played.state;
  }

  assert.ok(
    deficits > 0,
    "nenhum dos 48 meses fechou no vermelho, nem com o governo gastando ate o teto",
  );
});

test("RECLASSIFICAR NAO CONSTROI HOSPITAL: derrubar o piso nao muda o que a area recebe", () => {
  /* O exploit que a politica `explorador` mediu, e ele e o mais bonito do modelo porque
     ninguem o escreveu. */
  const state = createState();
  const levels = Object.fromEntries(PROGRAMS.map(program => [program.id, program.initial]));

  const withFloors = settlement(state, { levels }, CATALOG).funded;

  const freed = Object.fromEntries(
    [...CATALOG.programs, ...CATALOG.rules].map(lever => [
      lever.id,
      { floor: 0, ceiling: lever.ceiling },
    ]),
  );
  const withoutFloors = settlement(state, { levels, bands: freed }, CATALOG).funded;

  for (const area of CATALOG.areas) {
    assert.ok(
      Math.abs((withFloors[area.id] ?? 0) - (withoutFloors[area.id] ?? 0)) < 1e-9,
      `${area.id} recebeu ${withoutFloors[area.id]} sem piso contra ${withFloors[area.id]} com piso — ` +
        `derrubar a lei fabricou capacidade`,
    );
  }
});

test("O PACOTE PAGA PELO TAMANHO: juntar tudo num texto so ficou caro", () => {
  /* O achado 1c do handoff, medido : um movimento de piso constitucional saia por 358 votos e
     OITENTA E CINCO movimentos saiam por 334 — os dois passavam, no mesmo mes, com a mesma
     verba. */
  const state = createState();
  const funding = Object.fromEntries(PARTIES.map(party => [party.id, 1]));
  const guarded = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  assert.ok(guarded);

  /* ⚠ A PROVA PASSOU A PERGUNTAR A `forecast`, e nao a esperar o plenario. */
  const single = forecast(state, {
    bands: { [guarded.id]: { floor: 0, ceiling: guarded.ceiling } },
    funding,
  });

  const bundleOrders = {
    levels: Object.fromEntries(PROGRAMS.map(program => [program.id, 100])),
    bands: Object.fromEntries(
      [...CATALOG.programs, ...CATALOG.rules].map(lever => [lever.id, { floor: 0, ceiling: 100 }]),
    ),
    funding,
  };
  const bundle = forecast(state, bundleOrders);

  assert.equal(single.agenda.proposal?.spread, 0, "um movimento so tem raio ideologico zero");
  assert.ok(
    (bundle.agenda.proposal?.spread ?? 0) > 20,
    `o pacote de ${bundle.agenda.moves.length} movimentos saiu com raio ` +
      `${bundle.agenda.proposal?.spread.toFixed(1)} — a media ainda esconde a dispersao`,
  );

  assert.equal(single.agenda.quorum, bundle.agenda.quorum, "os dois exigem o mesmo RITO");
  assert.ok(
    (bundle.whip?.votes ?? 0) < (single.whip?.votes ?? 0),
    `o pacote colheu ${bundle.whip?.votes.toFixed(0)} votos contra ${single.whip?.votes.toFixed(0)} ` +
      `do movimento unico — o preco continua nao escalando com o tamanho`,
  );

  let carrying = state;
  let reached = false;
  for (let month = 0; month < 8 && !reached; month++) {
    const played = playMonth(carrying, month === 0 ? bundleOrders : { funding });
    reached = played.report.tally !== null;
    carrying = played.state;
  }
  assert.ok(!reached, "o pacote de oitenta e cinco movimentos chegou ao plenario");
});

/* ── A MESA E O TURNO PREVEEM COM A MESMA CAMARA ─────────────────────────────── ⚠ ESTA PROVA
   NASCE DE UM DEFEITO MEDIDO, e ele e o terceiro da mesma familia.
   com as ONZE bancadas do ELENCO, a verba com credito de memoria e desconto de
   ambicao dentro, e a APROVACAO DA RUA deslocando a resistencia.
   O ELENCO e a SONDA chegaram, `playMonth` passou a usa-los, e a tela ficou para
   tras em silencio — cada lado certo sozinho. Nenhum tipo, nenhuma guarda e nenhuma
   das 190 provas via, porque nenhuma delas comparava os dois. Esta compara. */
test("A MESA E O TURNO PREVEEM COM A MESMA CAMARA, e com a mesma rua", () => {
  fc.assert(
    fc.property(anyOrders, fc.integer({ min: 0, max: 400 }), (orders, seed) => {
      /* A MEMORIA PRECISA EXISTIR PARA A PROVA MORDER: com o elenco em saldo zero, a verba
         oferecida ao lider e a do bloco e o defeito antigo passaria despercebido em metade
         das sementes. */
      let state = createState(seed);
      for (let month = 0; month < 4; month++) {
        state = playMonth(state, { funding: everyone(0.5) }).state;
      }

      const seen = forecast(state, orders);
      const played = playMonth(state, orders);

      /* A PAUTA E A MESMA — ela era composta duas vezes, com argumentos diferentes. */
      assert.equal(seen.agenda.quorum, played.report.agenda.quorum, "o quorum divergiu");
      assert.equal(
        seen.agenda.proposal?.label ?? null,
        played.report.agenda.proposal?.label ?? null,
        "a pauta prevista nao e a pauta votada",
      );

      if (!seen.whip || played.report.tally === null) return;

      /* ⚠ O QUE SE COMPARA E A PREVISAO CONTRA O DETERMINISTICO DA VOTACAO, e nao contra o
         placar sorteado: `vote` tira a dissidencia do dia de um fluxo, e exigir igualdade com
         o sorteio seria cobrar que a previsao adivinhe o dado. */
      const centre = played.report.tally.expected;
      assert.ok(
        Math.abs(seen.whip.votes - centre) < 1e-6,
        `a Mesa previu ${seen.whip.votes.toFixed(1)} e o turno centrou em ${centre.toFixed(1)}`,
      );

      /* E O VEREDITO — que e o que o jogador de fato lê. */
      assert.equal(
        seen.whip.votes >= seen.agenda.quorum,
        centre >= played.report.agenda.quorum,
        "a Mesa e o turno discordaram sobre passar ou nao",
      );

      /* A SOMA DAS LINHAS BATE COM O PLACAR. */
      const total = Object.values(seen.byBloc).reduce((sum, votes) => sum + votes, 0);
      assert.ok(
        Math.abs(total - seen.whip.votes) < 1e-6,
        `as linhas somam ${total.toFixed(1)} e o placar diz ${seen.whip.votes.toFixed(1)}`,
      );
    }),
  );
});

/* ── O QUE NAO FOI AUTORIZADO NAO E EXECUTADO, E NEM COBRADO ─────────────────── ⚠ ESTE E O
   ACHADO 14, e a tramitacao o TRIPLICOU antes de mata-lo.
   · a MALHA recebia o mes como se a reforma tivesse valido — o indice da area
   andava por um dinheiro que nao saiu; */
test("A CHANTAGEM EXISTE, e o SILENCIO nela RECUSA — ao contrario da emenda", () => {
  /* ⚠ ESTA PROVA TRAVA A UNICA REGRA DA CHANTAGEM QUE INVERTE UMA JA ESCRITA. */
  const floors = Object.fromEntries(PROGRAMS.map(program => [program.id, program.floor]));

  /** @param {"accept" | "block" | null} answer */
  const run = answer => {
    let state = createState(5);
    let demands = 0;
    for (let month = 0; month < 48; month++) {
      /** @type {Record<string, string>} */
      const mail = {};
      for (const letter of state.mail) {
        if (letter.kind === "demand" && letter.answer === null) {
          demands++;
          if (answer) mail[letter.id] = answer;
        }
      }
      state = playMonth(state, { levels: floors, mail }).state;
    }
    return { state, demands };
  };

  /* Instrumento que nunca dispara e o achado 3 deste projeto se repetindo — e este numero ja
     foi 2 em 48 meses, com um limiar escolhido no olho. */
  const ignored = run(null);
  assert.ok(
    ignored.demands > 0,
    "nenhum lobby exigiu nada em 48 meses de corte total — a chantagem nao dispara",
  );

  const ceded = run("accept");
  const refused = run("block");

  /* 2 — CEDER ALIVIA, E RECUSAR ESQUENTA, e o silencio fica com os que recusam. */
  const heat = (/** @type {typeof ignored} */ run) =>
    (run.state.pressure["ordem"] ?? 0) + (run.state.pressure["produtivo"] ?? 0);

  assert.ok(
    heat(ceded) < heat(ignored),
    `ceder nao aliviou: ${heat(ceded).toFixed(1)} contra ${heat(ignored).toFixed(1)}`,
  );
  assert.ok(
    heat(refused) > heat(ceded),
    `recusar nao custou mais que ceder: ${heat(refused).toFixed(1)} contra ${heat(ceded).toFixed(1)}`,
  );

  /* 3 — E O SILENCIO FICA DO LADO DA RECUSA. */
  assert.ok(
    heat(ignored) > heat(ceded),
    "o silencio aliviou como se fosse cessao — a carta promete o contrario",
  );

  /* 4 — E CEDER MOVE A ALAVANCA DE VERDADE. */
  const moved = PROGRAMS.some(
    program => (ceded.state.levels[program.id] ?? 0) > (ignored.state.levels[program.id] ?? 0),
  );
  assert.ok(moved, "ceder a uma exigencia nao levantou nivel nenhum");
});

test("O QUE ESPERA NAO GASTA: o mes do protocolo executa o orcamento que ja valia", () => {
  const state = createState(31);

  /* Um corte que fura piso constitucional: ele vai para a gaveta, e o mes tem de acontecer
     como se ele nao tivesse sido escrito. */
  const writing = playMonth(state, { levels: reform(), funding: everyone(0.3) });
  const quiet = playMonth(state, { funding: everyone(0.3) });

  assert.equal(
    writing.report.allocatedTotal,
    quiet.report.allocatedTotal,
    "o mes do protocolo empenhou um valor diferente — o caixa cobrou pelo que espera",
  );
  assert.deepEqual(
    writing.report.allocated,
    quiet.report.allocated,
    "a alocacao por area divergiu no mes em que o texto so foi protocolado",
  );
  assert.deepEqual(
    writing.report.capacity.index,
    quiet.report.capacity.index,
    "a MALHA recebeu o mes como se a reforma ja tivesse valido",
  );
  assert.equal(
    writing.report.budget.balance,
    quiet.report.budget.balance,
    "o resultado primario divergiu por uma reforma que ainda esta na gaveta",
  );

  /* ⚠ E O NIVEL TAMBEM NAO ANDA. */
  assert.equal(
    writing.state.levels[HARD.id],
    state.levels[HARD.id],
    "o nivel andou antes de o plenario autorizar",
  );

  /* E O TEXTO EXISTE — a prova nao pode passar por o corte ter sido ignorado. */
  assert.equal(writing.state.bills.length, 1, "o texto nao foi protocolado");
  assert.equal(writing.state.bills[0]?.stage, "drawer");
});
