/* SUITE · O TURNO — o acoplamento entre o caixa e o Congresso.

   As suites dos dois motores provam cada um por dentro. Esta prova o que só existe quando
   eles se encostam, e que nenhuma das duas consegue ver:
     1. o teto MANDA. Não existe ordem do jogador que gaste mais do que cabe;
     2. o Congresso responde ao que FOI PAGO, e não ao que foi prometido;
     3. promessa quebrada custa base — e e por isso que contingenciamento, que e aritmética
        e não evento, produz crise politica;
     4. o mandato inteiro e reproduzível a partir da semente e das ordens. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import {
  costOf,
  discretionaryRoom,
  forecast,
  ledger,
  outlook,
  trajectory,
  HORIZON,
  playMonth,
  settlement,
  situationOf,
} from "../../src/application/turn.mjs";
import { calendarOf } from "../../src/application/calendar.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { QUALIFIED_MAJORITY, SIMPLE_MAJORITY } from "../../src/data/regime.mjs";
import { UI } from "../../src/ui/strings.mjs";
import { alarm } from "../../src/application/mail.mjs";
import { createState } from "../../src/state/state.mjs";

/** @typedef {import("../../src/application/turn.mjs").Orders} Orders */

/* Ela é larga o suficiente para o arredondamento e estreita o suficiente para não esconder um
   defeito: os valores do jogo estão na casa das dezenas de bilhões. */
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

/* UM MOVIMENTO DE ORÇAMENTO QUALQUER — um programa sorteado, num nível sorteado de 0 a 100. */
const anyLevels = fc
  .tuple(fc.constantFrom(...PROGRAMS), fc.integer({ min: 0, max: 100 }))
  .map(([program, level]) => ({ [program.id]: level }));

const anyOrders = fc.record({
  levels: anyLevels,
  funding: anyFunding,
});

/* A ORDEM QUE FURA UM PISO CONSTITUCIONAL — a mais cara que o catálogo produz. */
const HARD = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
if (!HARD) throw new Error("o catalogo perdeu o programa de piso constitucional");
const reform = () => ({ [HARD.id]: HARD.floor - 12 });

/* E UMA QUE SÓ REMANEJA, dentro do que a lei já autoriza. */
const LOOSE = PROGRAMS.find(program => program.guard === "none" && program.floor < 20);
if (!LOOSE) throw new Error("o catalogo perdeu o programa de piso solto");
const shuffle = () => ({ [LOOSE.id]: LOOSE.initial - 4 });

/**
 * Ele existe para a suíte conseguir montar posições que o catálogo real leva anos para
 * alcançar — o contingenciamento é uma delas, e esperar 47 meses por ele dentro de um teste
 * seria transformar uma prova em uma simulação.
 *
 * @param {Partial<typeof CATALOG.fiscal>} overrides
 * @returns {typeof CATALOG}
 */
function catalogWith(overrides) {
  return { ...CATALOG, fiscal: { ...CATALOG.fiscal, ...overrides } };
}

/* A obrigatória nasce ACIMA da âncora de despesa, então ela já fura o teto no primeiro mês:
   não há discricionário nenhum, e não por escolha do jogador. */
const SQUEEZED = catalogWith({ initialMandatory: 3600, initialDiscretionary: 0 });

test("O TETO MANDA: nenhuma ordem gasta mais do que cabe no mês", () => {
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

      /* PROPORCIONAL quer dizer que ninguém e escolhido para sofrer: o corte e o mesmo para
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

test("SOBRA NÃO E CORTE: o relatório distingue folga de rateio", () => {
  /* O achado 2 do handoff foi escrito desse número, e ele chegou a bloquear o conserto do
     achado 31 — o defeito mais fundo do projeto. */
  const state = createState(3);

  /* O GOVERNO QUE PEDE POUCO: todo programa no piso e ninguém pago. */
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

      assert.ok(report.budget.blocked, "a posicao montada para apertar nao apertou");
      assert.equal(report.paidCost, 0);
      for (const party of PARTIES) {
        assert.equal(report.paid[party.id], 0, `${party.id} recebeu verba sob contingenciamento`);
      }
    }),
  );
});

test("O CONGRESSO RESPONDE AO PAGO, e não ao prometido", () => {
  /* Se estas duas linhas divergirem, promessa está comprando voto, e o orçamento virou
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

  /* Ninguém prometeu nada: a bancada fica na chance estrutural, onde a posse a pôs. */
  const quiet = playMonth(bare, { funding: everyone(0) }, { catalog: SQUEEZED });
  /* Prometeu tudo e não pagou nada, porque o teto não deixou. */
  const broken = playMonth(bare, { funding: everyone(1) }, { catalog: SQUEEZED });

  for (const party of PARTIES) {
    const before = bare.loyalty[party.id] ?? 0;
    const afterQuiet = quiet.state.loyalty[party.id] ?? 0;
    const afterBroken = broken.state.loyalty[party.id] ?? 0;

    assert.ok(Math.abs(afterQuiet - before) < 1e-9, `${party.id} se mexeu num mes sem nada`);
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
        /* Quem recebeu alguma coisa nunca fica PIOR que quem não recebeu nada — e a promessa
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

test("o turno não muta o estado que recebeu", () => {
  const before = createState(9);
  const snapshot = JSON.parse(JSON.stringify(before));
  playMonth(before, { levels: reform(), funding: everyone(0.8) });
  assert.deepEqual(JSON.parse(JSON.stringify(before)), snapshot);
});

test("a votação consome o fluxo, e o mês sem pauta não consome nada", () => {
  /* Fluxo gasto sem votação deslocaria o índice e mudaria o resultado de uma votação futura
     sem relação nenhuma com o mês parado. */
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

  /* E O PLENÁRIO GASTA UMA VEZ SÓ, no mês em que ele acontece — três meses depois da caneta. */
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

test("pauta aprovada muda a despesa obrigatória PARA SEMPRE, no sinal do catálogo", () => {
  /* O que torna a decisão pesada: o custo político se paga uma vez, e o efeito fiscal fica no
     resto do mandato. */
  /* ⚠ O SINAL INVERTEU JUNTO COM A MECÂNICA, e a inversão é a prova de que o modelo ficou
     mais honesto. */
  const state = createState(13);
  const passed = playMonth(state, { levels: reform(), funding: everyone(1) });

  if (passed.report.tally?.passed) {
    const idle = playMonth(state, { funding: everyone(1) });
    assert.ok(
      passed.state.fiscal.mandatory < idle.state.fiscal.mandatory,
      "furar um piso constitucional tinha de aliviar a obrigatoria",
    );

    /* E O ALÍVIO ATRAVESSA O MÊS: a obrigatória menor abre discricionário no mês seguinte,
       que é a razão inteira de alguém pagar 308 votos por uma reforma. */
    assert.ok(
      discretionaryRoom(passed.state) > discretionaryRoom(idle.state),
      "a obrigatoria menor tinha de abrir o discricionario do mes seguinte",
    );
  }
});

test("o preço da cadeira traduz verba em bilhoes, e o total fecha", () => {
  const full = costOf(everyone(1), PARTIES, CATALOG.fiscal.seatPrice);
  const seats = PARTIES.reduce((sum, party) => sum + party.seats, 0);
  assert.ok(Math.abs(full - seats * CATALOG.fiscal.seatPrice) < 1e-9);

  /* COMPRAR O PLENÁRIO INTEIRO NÃO PODE CABER NUM MÊS. */
  assert.ok(
    full > discretionaryRoom(createState(1)),
    `o plenario inteiro custa ${full.toFixed(1)} e cabe no mes — nao ha o que escolher`,
  );
});

/* O defeito que a lista existia para impedir — cobrar o mesmo impacto fiscal duas vezes —
   deixou de ser possível por construção, e não por vigilância: não há "aprovar de novo"
   quando o que se aprova é um nível. */

test("REPETIR A ORDEM NÃO COBRA DUAS VEZES, e nem vai a plenario de novo", () => {
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

    /* O EFEITO FISCAL É O QUE IMPORTA AQUI, e era ele que dobrava no desenho antigo. */
    const idle = playMonth(first.state, { funding: everyone(1) });
    assert.ok(
      Math.abs(again.state.fiscal.mandatory - idle.state.fiscal.mandatory) < EPSILON,
      "repedir um nivel ja vigente cobrou o alivio fiscal outra vez",
    );

    /* Nem o fluxo pode andar: votação que não aconteceu não saca. */
    assert.equal(again.state.streams.congress.draws, first.state.streams.congress.draws);
  }
});

test("A DERROTA DEVOLVE O NÍVEL, e a execução orçamentária sobrevive a ela", () => {
  const state = createState(5);

  const hard = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  const easy = PROGRAMS.find(program => program.guard === "none" && program.floor < 20);
  assert.ok(hard && easy, "o catalogo precisa dos dois casos para esta prova valer");

  const played = playMonth(state, {
    levels: { [hard.id]: hard.floor - 15, [easy.id]: easy.initial - 5 },
    funding: everyone(0),
  });

  assert.equal(played.report.agenda.quorum, QUALIFIED_MAJORITY, "o pacote nao virou emenda");

  /* A versão anterior fixava `passed: false` e quebrou na recalibragem de : com o orçamento
     real, uma emenda pode passar no mês 5 com verba zero, o que é um achado de CALIBRAGEM e
     não um defeito desta mecânica. */
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
  /* O valor dela depende inteiramente de ela não divergir do turno — e divergência entre
     previsão e execução é o tipo de defeito que só aparece no caso extremo, que aqui é
     justamente o caso interessante: o mês em que a promessa estoura o caixa. */
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

test("A ÁREA E O TURNO PROJETAM O MESMO ÍNDICE: a seta não aponta para o lado errado", () => {
  /* A MALHA consome o gasto CHEIO já rateado (`funded`), e `asked` é só a parte acima do
     piso: na Previdência, R$ 2,4 bi contra R$ 126,7 bi.
     E o canal `capacity` da educação não entrava.
     Medido no mês 1 da partida padrão, ANTES do conserto: em CINCO das oito áreas a seta
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

  /* ── E O CONTRAFACTUAL É O MÊS SEM AS ORDENS, e não um mundo inalcançável ────── `idle` era
     `value − decay`: o índice se a área recebesse ZERO. */
  const state = createState(9);
  const quiet = playMonth(state, {});
  assert.deepEqual(
    outlook(state, { funding: Object.fromEntries(PARTIES.map(p => [p.id, 1])) }).idle,
    quiet.report.capacity.index,
    "o contrafactual da area nao e o mes sem ordens",
  );
});

test("O PLACAR E O TURNO FECHAM A MESMA CONTA: o painel de Finanças não inventa número", () => {
  /* Ela vale mais aqui do que lá, porque o painel é a única tela do jogo em que o jogador não
     tem como conferir nada: na área ele vê o controle que moveu, na Mesa vê a bancada que
     pagou — no placar ele só tem o número, e um número que divergisse do turno seria
     indistinguível de um número certo. */
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
      assert.equal(shown.budget.blocked, played.report.budget.blocked);
      assert.equal(shown.budget.balance, played.report.budget.balance);
      assert.equal(shown.interest, played.report.interest);

      /* E O ESTOQUE FECHA COM O MÊS: o que o painel chama de dívida bruta e exatamente com
         quanto o mês seguinte começa. */
      assert.ok(
        Math.abs(shown.debt - played.state.fiscal.debt) < EPSILON,
        `o painel mostrou ${shown.debt} e o mes fechou em ${played.state.fiscal.debt}`,
      );
    }),
  );
});

test("e o corte aparece: promessa que não cabe entrega MENOS voto do que promete", () => {
  /* A prova de que a previsão da tela precisa usar o pago. */
  const state = createState(9);
  const orders = { levels: reform(), funding: everyone(0.2) };

  const rich = settlement(state, orders);
  /* O estado também nasce apertado: a obrigatória de abertura é do catálogo, e um estado
     normal lido com parâmetros apertados seria outra coisa. */
  const poor = settlement(createState(9, SQUEEZED), orders, SQUEEZED);

  /* Isso não é defeito: é a armadilha do LASTRO funcionando com números de
     verdade, e é a primeira decisão real que o jogo cobra — cortar alguma coisa
     antes de poder prometer qualquer coisa. O que a prova cobra agora é a */
  assert.ok(
    rich.ratio > poor.ratio,
    `o caixa folgado cortou tanto quanto o apertado: ${rich.ratio} contra ${poor.ratio}`,
  );
  assert.ok(poor.ratio < 1, "o catalogo apertado tinha de cortar");

  for (const party of PARTIES) {
    assert.ok((poor.paid[party.id] ?? 0) < (poor.promised[party.id] ?? 0));
  }
});

/* ── A POSIÇÃO DO GOVERNO ────────────────────────────────────────────────────
   `situationOf` compõe LASTRO e ECLUSA para responder se o governo TEM COMO
   governar. Ela substituiu um campo do estado que nenhum motor movia — e o que
   estas provas cobram é que ela continue sendo consequência, e não decoração. */

test("a partida abre com o governo de pé, e o motivo e dito", () => {
  const standing = situationOf(createState(1));

  assert.notEqual(standing.level, "crisis", "a posse ja comeca em crise — reveja a calibragem");
  assert.ok(
    standing.base > SIMPLE_MAJORITY,
    `a base de abertura e ${standing.base}, abaixo da maioria simples`,
  );
  assert.ok(UI_REASONS.has(standing.reason), `motivo desconhecido: ${standing.reason}`);
});

test("O TETO FECHADO E CRISE, e ele vem antes de qualquer outra leitura", () => {
  /* A ordem das perguntas é a da gravidade: sem discricionário não há emenda, e sem emenda a
     base não se compra de volta. */
  const squeezed = createState(3, SQUEEZED);
  const standing = situationOf(squeezed, SQUEEZED);

  assert.equal(standing.level, "crisis");
  assert.equal(standing.reason, "blocked");
});

test("bancada rompida e crise mesmo com o caixa livre", () => {
  /* A ruptura conta a coalizão: o partido do Presidente em 5, o resto da Câmara leal. */
  const state = createState(4, CATALOG, null, "pcs");
  const broken = { ...state, loyalty: { ...everyone(90), pcs: 5 } };

  const standing = situationOf(broken);
  assert.equal(standing.level, "crisis");
  assert.equal(standing.reason, "rupture");
});

test("OBSTRUÇÃO SEGURA EM ESTÁVEL: o degrau do meio existe de verdade", () => {
  const state = createState(5, CATALOG, null, "pcs");
  const sour = { ...state, loyalty: { ...everyone(90), pcs: 45 } };

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

/* ═══ O PAÍS NÃO SE DESENDIVIDA SOZINHO ══════════════════════════════════════
   As duas provas abaixo travam o achado número um do handoff. Ele não era calibragem
   frouxa: era um modelo que NÃO CONSEGUIA rodar déficit primário, por três motivos
   somados — a obrigatória crescia sem inflação, a MALHA media a arrecadação contra o
   ponto neutro em vez da abertura, e o dividendo das estatais era somado por cima de uma
   carga que já o continha. Sem estas provas, a próxima recalibragem reabre tudo em
   silêncio. */

test("O PRESIDENTE AUSENTE TERMINA MAIS ENDIVIDADO, e isso e o mundo", () => {
  /* A afirmação mais simples que o modelo tem de sustentar, e ela esteve INVERTIDA por três
     sessões: quem não tocava em nada terminava o mandato com a MELHOR dívida do quadro (78% →
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

test("O DÉFICIT PRIMÁRIO E ALCANÇÁVEL, e o modelo não o proíbe por construção", () => {
  /* O defeito de fundo, e o mais difícil de ver: `allowance = min(caixa, teto)` e `saldo =
     caixa/12 − empenho` faziam o primário ser NÃO-NEGATIVO por construção. */
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

test("RECLASSIFICAR NÃO CONSTRÓI HOSPITAL: derrubar o piso não muda o que a área recebe", () => {
  /* O exploit que a política `explorador` mediu, e ele é o mais bonito do modelo porque
     ninguém o escreveu. */
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

test("O PACOTE PAGA PELO TAMANHO: juntar tudo num texto só ficou caro", () => {
  /* O achado 1c do handoff, medido : um movimento de piso constitucional saía por 358 votos e
     OITENTA E CINCO movimentos saíam por 334 — os dois passavam, no mesmo mês, com a mesma
     verba. */
  const state = createState();
  const funding = Object.fromEntries(PARTIES.map(party => [party.id, 1]));
  const guarded = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  assert.ok(guarded);

  /* ⚠ A PROVA PASSOU A PERGUNTAR A `forecast`, e não a esperar o plenário. */
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
  let passed = false;
  for (let month = 0; month < 8 && !reached; month++) {
    const played = playMonth(carrying, month === 0 ? bundleOrders : { funding });
    reached = played.report.tally !== null;
    passed = played.report.tally?.passed ?? false;
    carrying = played.state;
  }
  /* Com o modelo da base, o presidente da Câmara pauta o pacote com a verba oferecida, e ele
     cai no plenário; a gaveta segurava por 0,375 contra 0,38. */
  assert.ok(!passed, "o pacote de oitenta e cinco movimentos passou");
});

/* ── A MESA E O TURNO PREVEEM COM A MESMA CAMARA ─────────────────────────────── ⚠ ESTA PROVA
   NASCE DE UM DEFEITO MEDIDO, e ele e o terceiro da mesma família: a Mesa previa com os
   blocos crus do catálogo enquanto o turno votava com as bancadas do ELENCO, a verba com
   crédito de memória e desconto de ambição dentro, e a APROVAÇÃO DA RUA deslocando a
   resistência.
   O ELENCO e a SONDA chegaram, `playMonth` passou a usa-los, e a tela ficou para
   trás em silêncio — cada lado certo sozinho. Nenhum tipo, nenhuma guarda e nenhuma
   das 190 provas via, porque nenhuma delas comparava os dois. Esta compara. */
test("A MESA E O TURNO PREVEEM COM A MESMA CAMARA, e com a mesma rua", () => {
  fc.assert(
    fc.property(anyOrders, fc.integer({ min: 0, max: 400 }), (orders, seed) => {
      /* A MEMÓRIA PRECISA EXISTIR PARA A PROVA MORDER: com o elenco em saldo zero, a verba
         oferecida ao líder e a do bloco e o defeito antigo passaria despercebido em metade
         das sementes. */
      let state = createState(seed);
      for (let month = 0; month < 4; month++) {
        state = playMonth(state, { funding: everyone(0.5) }).state;
      }

      const seen = forecast(state, orders);
      const played = playMonth(state, orders);

      /* A PAUTA É A MESMA — ela era composta duas vezes, com argumentos diferentes. */
      assert.equal(seen.agenda.quorum, played.report.agenda.quorum, "o quorum divergiu");
      assert.equal(
        seen.agenda.proposal?.label ?? null,
        played.report.agenda.proposal?.label ?? null,
        "a pauta prevista nao e a pauta votada",
      );

      if (!seen.whip || played.report.tally === null) return;

      /* ⚠ O QUE SE COMPARA E A PREVISÃO CONTRA O DETERMINÍSTICO DA VOTAÇÃO, e não contra o
         placar sorteado: `vote` tira a dissidência do dia de um fluxo, e exigir igualdade com
         o sorteio seria cobrar que a previsão adivinhe o dado. */
      const centre = played.report.tally.expected;
      assert.ok(
        Math.abs(seen.whip.votes - centre) < 1e-6,
        `a Mesa previu ${seen.whip.votes.toFixed(1)} e o turno centrou em ${centre.toFixed(1)}`,
      );

      /* E O VEREDITO — que é o que o jogador de fato lê. */
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

/* ── O QUE NÃO FOI AUTORIZADO NÃO É EXECUTADO, E NEM COBRADO ─────────────────── ⚠ ESTE É O
   ACHADO 14, e a tramitação o TRIPLICOU antes de matá-lo.
   · a MALHA recebia o mês como se a reforma tivesse valido — o índice da área
   andava por um dinheiro que não saiu; */
test("A CHANTAGEM EXISTE, e o SILÊNCIO nela RECUSA — ao contrário da emenda", () => {
  /* ⚠ ESTA PROVA TRAVA A ÚNICA REGRA DA CHANTAGEM QUE INVERTE UMA JÁ ESCRITA. */
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

  /* Instrumento que nunca dispara é o achado 3 deste projeto se repetindo — e este número já
     foi 2 em 48 meses, com um limiar escolhido no olho. */
  const ignored = run(null);
  assert.ok(
    ignored.demands > 0,
    "nenhum lobby exigiu nada em 48 meses de corte total — a chantagem nao dispara",
  );

  const ceded = run("accept");
  const refused = run("block");

  /* 2 — CEDER ALIVIA, E RECUSAR ESQUENTA, e o silêncio fica com os que recusam. */
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

  /* 3 — E O SILÊNCIO FICA DO LADO DA RECUSA. */
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

test("O QUE ESPERA NÃO GASTA: o mês do protocolo executa o orcamento que já valia", () => {
  const state = createState(31);

  /* Um corte que fura piso constitucional: ele vai para a gaveta, e o mês tem de acontecer
     como se ele não tivesse sido escrito. */
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

  /* ⚠ E O NÍVEL TAMBÉM NÃO ANDA. */
  assert.equal(
    writing.state.levels[HARD.id],
    state.levels[HARD.id],
    "o nivel andou antes de o plenario autorizar",
  );

  /* E O TEXTO EXISTE — a prova não pode passar por o corte ter sido ignorado. */
  assert.equal(writing.state.bills.length, 1, "o texto nao foi protocolado");
  assert.equal(writing.state.bills[0]?.stage, "drawer");
});

/* ── O ALARME NÃO CALA QUEM ACABOU DE FERVER ────────────────────────────────── ⚠ ELA NASCE DE
   UM DEFEITO MEDIDO, e ele e estrutural e não de calibragem: `demandsOf` garante "uma exigência
   aberta por vez, por grupo" filtrando por REMETENTE e resposta nula — e o alarme de fervura
   nasce com o mesmo remetente e resposta nula, porque ele fecha por `closedAt`.
   Com `boil` em 68 e `demandAt` em 30, quem ferve esta SEMPRE acima do limiar de exigir: o
   grupo que acabou de romper com o governo era exatamente o que perdia a voz, por até 24 meses.
   Medido em 48 meses: 26 a 30 meses-lobby calados. */
test("O ALARME DE FERVURA NÃO CALA A EXIGÊNCIA DO MESMO GRUPO", () => {
  const lobby = "produtivo";
  const base = createState(undefined, CATALOG);

  /* O grupo tem do que reclamar — o jogador cortou uma alavanca da área dele — e pressão acima
     do ponto de exigir. Sem as duas coisas não há exigência para o alarme bloquear. */
  const state = {
    ...base,
    levels: { ...base.levels, "plano-safra": 0 },
    pressure: { ...base.pressure, [lobby]: 90 },
  };

  /** @param {import("../../src/state/state.mjs").GameState} from */
  const demands = from =>
    playMonth(from, {}, { catalog: CATALOG }).state.mail.filter(
      letter => letter.kind === "demand" && letter.from === lobby,
    );

  assert.equal(demands(state).length, 1, "o grupo tinha do que reclamar e nao reclamou");

  /* ⚠ O MESMO MÊS, COM O ALARME NA BANDEJA: é a única coisa que muda entre os dois casos. */
  const comAlarme = {
    ...state,
    mail: [
      ...state.mail,
      alarm({ kind: "boiling", id: lobby, subject: lobby, month: 1, from: lobby }),
    ],
  };

  assert.equal(
    demands(comAlarme).length,
    1,
    "o alarme de fervura calou a exigencia do grupo que acabou de ferver",
  );
});

/* ── O TETO QUE VAI FECHAR AVISA ANTES ──────────────────────────────────────── ⚠ ELA NASCE DE
   UM CANAL MORTO, e ele era morto por ARITMÉTICA: o alarme perguntava se o teto não estava
   fechado antes e estava depois, com os dois lados saindo da MESMA posição — e
   contingenciamento é `teto − obrigatória`, que não depende do que foi empenhado. A condição
   era `!X && X`. Medido em 48 meses: o teto fecha em 12 deles na política `piso`, e a carta
   nunca foi emitida uma vez.
   ⚠ E O AVISO PASSOU A CHEGAR ANTES, e não depois: o mês que está fechando já sabe a posição
   com que o mês seguinte abre. "Informação que chega depois da decisão é recibo." */
test("O TETO QUE VAI FECHAR AVISA ANTES, e o aviso chega uma vez só", () => {
  /* Um discricionário magro faz a obrigatória alcançar o teto por crescimento vegetativo, sem
     o jogador tocar em nada — e ela abre com o teto ABERTO, que é a condição da travessia. */
  const catalog = catalogWith({ initialDiscretionary: 40 });
  let state = createState(7, catalog);
  let avisos = 0;

  for (let month = 0; month < 24; month++) {
    const played = playMonth(state, {}, { catalog });
    avisos += played.state.mail.filter(letter => letter.kind === "ceiling").length - avisos;

    if (played.report.budget.blocked) {
      assert.ok(avisos > 0, "o teto fechou e nenhum aviso chegou antes");
      return;
    }
    state = played.state;
  }

  assert.fail("o catalogo montado para fechar o teto nunca fechou");
});

/* ── O PRAZO QUE DECIDE O CORTE AVISA ANTES ───────────────────────────────────
   ⚠ ELA É O QUE FALTAVA DO A3: o decreto já escolhia quem o corte poupa, e o jogador descobria
   o corte pela BOLSA que encolheu — nunca pela data que o decide. E o bimestral é o único marco
   que se repete dentro do ano, então um id fixo faria o de março e o de maio virarem a mesma
   carta e só a primeira chegaria. */
test("O AVISO DO BIMESTRAL CHEGA SEIS VEZES NO ANO, e o de marco não e o de maio", () => {
  let state = createState(7);
  /* CONTA O QUE CHEGOU, mês a mês, e não o que sobrou na bandeja: com as pessoas do mundo
     escrevendo, a bandeja de 24 cartas fechadas empurra o aviso de janeiro para fora antes de
     dezembro, e a prova passaria a medir a capacidade da bandeja. */
  /** @type {Map<string, import("../../src/state/state.mjs").Letter>} */
  const chegaram = new Map();
  for (let month = 0; month < 12; month++) {
    state = playMonth(state, {}, {}).state;
    for (const letter of state.mail)
      if (letter.kind === "contingency") chegaram.set(letter.id, letter);
  }

  const avisos = [...chegaram.values()];
  /* SEIS, e o número é o mesmo que a suíte do calendário já cobra do marco bimestral. */
  assert.equal(avisos.length, 6, `o bimestral avisou ${avisos.length} vezes em doze meses`);
  assert.equal(new Set(avisos.map(letter => letter.id)).size, 6, "duas cartas dividiram um id");

  /* ⚠ E ELE É DE DOIS EM DOIS, e não "seis em qualquer lugar": um marco anual que disparasse
     seis vezes em janeiro passaria na contagem acima. */
  const meses = avisos.map(letter => letter.month).sort((a, b) => a - b);
  const vaos = meses.slice(1).map((mes, i) => mes - (meses[i] ?? 0));
  assert.deepEqual(vaos, [2, 2, 2, 2, 2], `os vaos entre os avisos foram ${vaos.join(", ")}`);
});

/* ⚠ CARTA QUE MUDA DEPOIS DE CHEGAR NÃO É CARTA — a mesma regra que os alarmes de fervura e de
   minoria já cobram, e pela mesma razão medida: lida do estado corrente, a fração de janeiro
   mostrava o rateio de março. */
test("O AVISO CARREGA O RATEIO DO MÊS QUE O ESCREVEU, e ele não se move depois", () => {
  const state = createState(7);
  const played = playMonth(state, {}, {});
  const carta = played.state.mail.find(letter => letter.kind === "contingency");
  assert.ok(carta, "o mes 0 fecha com o bimestral vencendo no mes 1, e nenhuma carta saiu");

  /* O NÚMERO SAI DO MESMO `settlement` QUE O MÊS EXECUTOU, e não de uma conta paralela. */
  assert.equal(carta.now, Math.round(settlement(state, {}).ratio * 100));

  /* E DOIS MESES DEPOIS ELE CONTINUA O MESMO, com o rateio do mundo já outro. */
  let depois = played.state;
  for (let month = 0; month < 2; month++) depois = playMonth(depois, {}, {}).state;
  const guardada = depois.mail.find(letter => letter.id === carta.id);
  assert.equal(guardada?.now, carta.now, "a carta guardada trocou de numero depois de chegar");
});

test("A PROJEÇÃO E `outlook` COM HORIZONTE — a UM mês as duas dão o mesmo número", () => {
  /* ⚠ ELA EXISTE PORQUE SÃO DUAS CONTAS PARA A MESMA PERGUNTA, e esse é o defeito nº 1 deste
     projeto: cinco ocorrências registradas. No dia em que divergirem, uma das duas telas passa
     a prever um país que a outra não vê. */
  let state = createState(7);
  for (let month = 0; month < 12; month++) state = playMonth(state, {}, {}).state;

  const orders = { funding: Object.fromEntries(PARTIES.map(party => [party.id, 0.5])) };
  const ahead = outlook(state, orders);
  const curve = trajectory(state, orders, CATALOG, 1);

  for (const area of CATALOG.areas) {
    assert.equal(
      curve.index[area.id]?.[0],
      ahead.index[area.id],
      `${area.id} diverge entre a projecao e o proximo mes`,
    );
    assert.equal(curve.idle[area.id]?.[0], ahead.idle[area.id], `${area.id} diverge no ocioso`);
  }
});

test("A PROJEÇÃO NÃO SORTEIA — duas rodadas dão a MESMA curva, e o plenario fica parado", () => {
  let state = createState(7);
  for (let month = 0; month < 6; month++) state = playMonth(state, {}, {}).state;

  const first = trajectory(state, {}, CATALOG, HORIZON);
  const second = trajectory(state, {}, CATALOG, HORIZON);
  assert.deepEqual(first, second, "a projecao consumiu aleatoriedade");

  for (const area of CATALOG.areas) {
    assert.equal(first.index[area.id]?.length, HORIZON, `${area.id} nao devolveu o horizonte`);
  }
});

test("A PROJEÇÃO MOSTRA A DECISÃO — a área que recebe verba separa da que não recebe", () => {
  /* O diagnóstico que originou o item: a tela imprimia `61 → 61` porque um mês não move uma
     área que anda 0,40. Se as duas curvas fecharem iguais a 24 meses, a peça não serve. */
  let state = createState(7);
  for (let month = 0; month < 6; month++) state = playMonth(state, {}, {}).state;

  const target = CATALOG.areas[0];
  assert.ok(target, "o catalogo tem area");
  const curve = trajectory(state, { levels: {} }, CATALOG, HORIZON);

  const moved = CATALOG.areas.some(area => {
    const series = curve.index[area.id] ?? [];
    const first = series[0] ?? 0;
    const last = series[series.length - 1] ?? 0;
    return Math.abs(last - first) >= 1;
  });
  assert.ok(moved, "nenhuma area andou um ponto em 24 meses — a curva nao mostra decisao");
});

/* ═══ O QUE O MÊS GRAVA NO ESTADO ════════════════════════════════════════════
   As duas provas abaixo travam defeitos que nenhuma suite via, porque as duas moram no que o
   turno ESCREVE — e o que ele escreve só aparece no mês seguinte. */

/* ⛔ ACHADO 36: o rateio gravava o nível CORTADO no estado, e nada nunca o devolvia. Medido
   antes do conserto: um pedido de 92 repetido seis meses parava em 89,70 e nunca mais subia —
   um mês apertado virava lei orçamentária nova sem ninguém decidir. No mundo o
   contingenciamento aperta EMPENHO e se desfaz quando a receita volta. */
test("O RATEIO E DO MÊS E NÃO DA LEI — o nível pedido sobrevive ao aperto", () => {
  const alvo = PROGRAMS[0];
  if (!alvo) throw new Error("o catalogo nao tem programa");
  const pedido = Math.min(100, alvo.ceiling);
  let state = createState(1);

  for (let month = 0; month < 6; month++) {
    const played = playMonth(state, { levels: { [alvo.id]: pedido } }, { catalog: CATALOG });
    state = played.state;
  }

  assert.equal(
    state.levels[alvo.id],
    pedido,
    "o nivel que o jogador manteve seis meses tem de continuar sendo o dele",
  );
});

/* ⛔ E O ESTADO PERDIA AS SEIS REGRAS TODO MÊS: `honour` só devolve PROGRAMA, e o retorno dele
   era gravado por cima do mapa inteiro. Medido: 44 chaves viravam 38 no primeiro mês, e
   `poder-do-executivo` caía de 30 para o `?? 0` de quatro leitores — o decreto perdia força
   sozinho no mês 1. */
test("AS REGRAS NÃO SOMEM DO ESTADO — o mapa de níveis atravessa o mês inteiro", () => {
  const before = createState(1);
  const after = playMonth(before, {}, { catalog: CATALOG }).state;

  assert.equal(
    Object.keys(after.levels).length,
    Object.keys(before.levels).length,
    "o mes nao pode apagar alavanca nenhuma do estado",
  );
  for (const rule of CATALOG.rules) {
    assert.equal(
      after.levels[rule.id],
      before.levels[rule.id],
      `a regra ${rule.id} sumiu ou mudou sem ninguem decidir`,
    );
  }
});

/* O PEDIDO QUE NÃO CABE — duas áreas no TETO da faixa, que é caneta e não espera voto: acima
   do teto o rito vira lei, e `held` segura o nível até o plenário decidir. */
const OVER_ASK = Object.fromEntries(
  PROGRAMS.filter(program => program.area === "health" || program.area === "security").map(
    program => [program.id, program.ceiling],
  ),
);

test("PROTEGER UMA ÁREA APROFUNDA O CORTE NAS OUTRAS, e a bolsa não cresce", () => {
  const state = createState();
  const sem = settlement(state, { levels: OVER_ASK });
  assert.ok(sem.ratio < 1, `o mes precisa ter corte para a prova valer: a razao veio ${sem.ratio}`);

  const com = settlement(state, { levels: OVER_ASK, protect: ["health"] });

  assert.ok((com.allocated["health"] ?? 0) > (sem.allocated["health"] ?? 0));
  assert.ok((com.allocated["security"] ?? 0) < (sem.allocated["security"] ?? 0));
  /* O MESMO BURACO CABE EM MENOS GENTE, então a razão cai. */
  assert.ok(com.ratio < sem.ratio);
});

test("PROTEGER TUDO ESTOURA A BOLSA — o preço e a meta, e não um muro", () => {
  const state = createState();
  const orders = { levels: OVER_ASK, protect: CATALOG.areas.map(area => area.id) };

  const share = settlement(state, orders);
  assert.equal(share.ratio, 0);
  assert.ok(share.allocatedTotal > share.room);

  /* E QUEM PAGA É O PRIMÁRIO, que é o número que o contingenciamento existe para defender. */
  const com = ledger(state, orders).budget.balance;
  const sem = ledger(state, { levels: OVER_ASK }).budget.balance;
  assert.ok(com < sem, `o primario com decreto deu ${com} e sem decreto ${sem}`);
});

test("A EMENDA NÃO PERDE MAIS QUE A PROPORÇÃO DAS DEMAIS DISCRICIONÁRIAS (CF art. 166, par. 18)", () => {
  const state = createState();
  const funding = Object.fromEntries(CATALOG.parties.map(party => [party.id, 1]));
  const sem = settlement(state, { levels: OVER_ASK, funding });
  assert.ok(sem.ratio < 1 && sem.promisedCost > 0, "o mes precisa ter corte e emenda");
  const even = sem.paidCost / sem.promisedCost;

  for (const protect of [["health"], CATALOG.areas.map(area => area.id)]) {
    const com = settlement(state, { levels: OVER_ASK, funding, protect });
    assert.ok(
      Math.abs(com.paidCost / com.promisedCost - even) < EPSILON,
      `com ${protect.length} pasta(s) protegida(s) a emenda recebeu ${com.paidCost / com.promisedCost}, e a proporcao geral e ${even}`,
    );
    assert.ok(com.ratio <= sem.ratio + EPSILON, "quem nao foi protegido absorve o resto do corte");
  }
});

test("SEM DECRETO O RATEIO CONTINUA PROPORCIONAL — a razão e caixa sobre demanda", () => {
  const share = settlement(createState(), { levels: OVER_ASK });
  assert.ok(Math.abs(share.ratio - share.room / share.demand) < EPSILON);

  /* ⚠ E O EMPENHO É O PEDIDO RATEADO: as duas contas dão o MESMO número enquanto ninguém é
     poupado, e é essa igualdade que prova que trocar a fonte de `allocatedTotal` não moveu o
     caixa de nenhum mês que já existia. */
  const pedido = share.demand - share.promisedCost;
  assert.ok(Math.abs(share.allocatedTotal - pedido * share.ratio) < EPSILON);
});

test("O DECRETO DE PROTEÇÃO VALE ATÉ O PRÓXIMO RELATÓRIO BIMESTRAL, que o renova", () => {
  /** @param {number} month */
  const report = month => calendarOf(month).now.some(landmark => landmark.id === "bimestral");
  let state = createState();
  const seen = [];
  for (let step = 0; step < 4; step++) {
    state = playMonth(state, { protect: ["health", "nao-existe"] }).state;
    assert.deepEqual(state.decree, report(state.month) ? [] : ["health"]);
    seen.push(report(state.month));
  }
  assert.ok(seen.includes(true) && seen.includes(false), "os dois casos precisam aparecer");
});
