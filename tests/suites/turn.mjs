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
import {
  costOf,
  discretionaryRoom,
  forecast,
  ledger,
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

/* Uma folga de centavos para comparacao de ponto flutuante. Ela e larga o
   suficiente para o arredondamento e estreita o suficiente para nao esconder um
   defeito: os valores do jogo estao na casa das dezenas de bilhoes. */
const EPSILON = 1e-9;

/* OS MOTIVOS QUE A TELA SABE DIZER. A prova le a tabela de textos em vez de
   redigitar a lista: motivo novo sem frase e um veredito em branco no rail, e o
   sintoma seria uma linha vazia que ninguem associa a esta funcao. */
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

/* UM MOVIMENTO DE ORCAMENTO QUALQUER — um programa sorteado, num nivel sorteado
   de 0 a 100. Ele atravessa piso e teto de proposito: e justamente nos extremos
   que o rito muda, e uma amostra que so passeasse dentro da faixa nunca provaria
   a parte cara. */
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
      const { report } = playMonth(state, { funding });

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
        /* Quem recebeu alguma coisa nunca fica PIOR que quem nao recebeu nada —
           e a promessa honrada em parte ainda pode ficar pior, porque o buraco
           cobra. Entao a comparacao so vale quando o pagamento foi integral.

           ⚠ E "INTEGRAL" E UMA RAZAO, E NAO UMA DIFERENCA. Esta pre-condicao era
           `paidCost >= promisedCost - EPSILON`, com EPSILON absoluto, e por isso a
           prova era INTERMITENTE: ela falhava em cerca de uma rodada em vinte, o
           que num `validate` obrigatorio e pior do que falhar sempre — ensina a
           rodar de novo ate passar.

           O contraexemplo, caçado em 20 mil rodadas: uma promessa de `6,7e-11` a
           esquerda, com o caixa honrando `ratio = 0,274`. O calote foi de 73%, e
           mesmo assim `paidCost − promisedCost` valia `2,6e-10` — trezentas vezes
           MENOR que o epsilon —, entao a diferenca absoluta dizia "pagou tudo"
           sobre um mes em que o governo pagou um quarto. A prova entao cobrava
           `paid >= unpaid` de uma bancada que tinha acabado de ser traida, e a
           lealdade caia o 1e-9 que a traicao cobra. O motor estava certo nas duas
           pontas; quem estava errado era a pergunta.

           Diferenca absoluta nao responde "honrou tudo?" quando o proprio valor e
           menor que a tolerancia. Razao responde, em qualquer escala. */
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
  /* REPLAY. Ele e a razao de o fluxo de aleatoriedade ser contado e de o estado
     ser imutavel: sem esta propriedade, "o Congresso derrubou minha lei" nunca e
     reproduzivel, e portanto nunca e investigavel. */
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
  /* Fluxo gasto sem votacao deslocaria o indice e mudaria o resultado de uma
     votacao futura sem relacao nenhuma com o mes parado. */
  const state = createState(11);
  const idle = playMonth(state, { funding: everyone(0.1) });
  assert.equal(idle.state.streams.congress.draws, state.streams.congress.draws);

  /* ⚠ E O MES EM QUE O TEXTO E ESCRITO TAMBEM NAO CONSOME NADA, desde 15/08/2026.
     Ele entra na gaveta, e gaveta nao sorteia: a Mesa decide com `whipCount`, que e
     deterministico. Isto e mais forte do que a prova pedia antes — agora ha DOIS
     tipos de mes que nao gastam sorteio, e o segundo e novo. */
  const written = playMonth(state, { levels: reform(), funding: everyone(0.1) });
  assert.equal(
    written.state.streams.congress.draws,
    state.streams.congress.draws,
    "o mes em que o texto foi protocolado consumiu sorteio — a gaveta nao sorteia",
  );

  /* ⚠ O SORTEIO E UM POR BANCADA QUE VOTA, e a camara deixou de ter quatro delas
     em 14/08/2026: com o elenco, cada lider leva a fracao da bancada que arrasta e
     o resto do bloco continua sendo uma bancada. A prova PERGUNTA quantas sao em
     vez de redigitar o numero — redigitado, ela ficaria vermelha a cada arquetipo
     novo, e a tentacao seria corrigir o numero em vez de olhar o que mudou. */
  const chamber = settlement(state, { funding: everyone(0.1) }).benches.length;

  /* E O PLENARIO GASTA UMA VEZ SO, no mes em que ele acontece — tres meses depois
     da caneta. Os dois meses de espera no meio nao consomem nada. */
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
  /* O que torna a decisao pesada: o custo politico se paga uma vez, e o efeito
     fiscal fica no resto do mandato. */
  /* ⚠ O SINAL INVERTEU JUNTO COM A MECANICA, e a inversao e a prova de que o
     modelo ficou mais honesto. Antes, uma pauta "que custa" carregava um
     `fiscalImpact` negativo digitado a mao, e aprova-la AUMENTAVA a obrigatoria.
     Agora a obrigatoria e a soma dos PISOS, e a unica coisa que a move e furar
     um piso — o que so acontece para baixo. Gastar mais num programa nao aumenta
     a despesa obrigatoria: aumenta o discricionario empenhado, que e outra conta
     e nao atravessa o mes.

     Entao a prova passou a cobrar o caso que existe: uma reforma que fura piso
     constitucional ALIVIA a obrigatoria para sempre. */
  const state = createState(13);
  const passed = playMonth(state, { levels: reform(), funding: everyone(1) });

  if (passed.report.tally?.passed) {
    const idle = playMonth(state, { funding: everyone(1) });
    assert.ok(
      passed.state.fiscal.mandatory < idle.state.fiscal.mandatory,
      "furar um piso constitucional tinha de aliviar a obrigatoria",
    );

    /* E O ALIVIO ATRAVESSA O MES: a obrigatoria menor abre discricionario no mes
       seguinte, que e a razao inteira de alguem pagar 308 votos por uma reforma.
       Sem esta linha, a reforma seria um numero bonito sem consequencia. */
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

/* ── O QUE JA VIROU REALIDADE ────────────────────────────────────────────────
   A lista `state.enacted` MORREU em 13/08/2026, e as duas provas que a cercavam
   foram movidas para o que a substituiu: `state.levels`.

   A troca nao foi de nome. A lista guardava ids de leis aprovadas para responder
   "o que ja esta em vigor?"; os niveis respondem a mesma pergunta com o proprio
   numero — em que intensidade cada programa esta rodando AGORA. Guardar as duas
   seria manter o registro do que foi decidido ao lado do resultado do que foi
   decidido, e os dois divergem no primeiro remendo.

   O defeito que a lista existia para impedir — cobrar o mesmo impacto fiscal
   duas vezes — deixou de ser possivel por construcao, e nao por vigilancia: nao
   ha "aprovar de novo" quando o que se aprova e um nivel. Repetir a ordem pede o
   mesmo nivel que ja esta em vigor, e pedir o que ja existe nao e movimento
   nenhum. A primeira prova abaixo cobra exatamente isso. */

test("REPETIR A ORDEM NAO COBRA DUAS VEZES, e nem vai a plenario de novo", () => {
  const state = createState(13);
  const cut = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 10);
  assert.ok(cut, "o catalogo perdeu o programa de piso constitucional desta prova");

  const orders = { levels: { [cut.id]: cut.floor - 8 }, funding: everyone(1) };
  const first = playMonth(state, orders);

  /* A MESMA ORDEM, DE NOVO — partindo do estado que ela produziu. Se a reforma
     passou, o nivel ja esta la e nao ha o que mover; se caiu, o pedido volta a
     ser um movimento novo. As duas leituras sao corretas, e a prova cobra a que
     valer. */
  const again = playMonth(first.state, orders);
  const moved = first.state.levels[cut.id] !== state.levels[cut.id];

  if (moved) {
    assert.equal(again.report.agenda.proposal, null, "o nivel ja vigente voltou ao plenario");
    assert.equal(again.report.agenda.quorum, 0);

    /* O EFEITO FISCAL E O QUE IMPORTA AQUI, e era ele que dobrava no desenho
       antigo. A comparacao e contra um mes PARADO partindo do mesmo estado — a
       obrigatoria cresce sozinha todo mes, e sem esse controle a prova mediria o
       crescimento vegetativo em vez do alivio da reforma. */
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
  /* A prova que substituiu "a lista guarda o que PASSOU". Um pacote com duas
     naturezas: um corte que fura piso constitucional — que precisa de 308 — e um
     remanejamento dentro da faixa, que nao precisa de ninguem. Quando o plenario
     derruba, so o primeiro volta. */
  const state = createState(5);

  const hard = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  const easy = PROGRAMS.find(program => program.guard === "none" && program.floor < 20);
  assert.ok(hard && easy, "o catalogo precisa dos dois casos para esta prova valer");

  const played = playMonth(state, {
    levels: { [hard.id]: hard.floor - 15, [easy.id]: easy.initial - 5 },
    funding: everyone(0),
  });

  assert.equal(played.report.agenda.quorum, QUALIFIED_MAJORITY, "o pacote nao virou emenda");

  /* ⚠ A PROVA NAO EXIGE QUE O PACOTE CAIA, e a mudanca tem razao. A versao
     anterior fixava `passed: false` e quebrou na recalibragem de 13/08/2026: com
     o orcamento real, uma emenda pode passar no mes 5 com verba zero, o que e um
     achado de CALIBRAGEM e nao um defeito desta mecanica.

     O que se prova aqui e a separacao das duas naturezas, e ela vale nos dois
     desfechos: aprovado, tudo anda; derrotado, so o que dependia de voto volta.
     Prender a prova a um resultado de sorteio seria medir a calibragem no lugar
     onde se quer medir o mecanismo. */
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
  /* `settlement` existe para a Mesa poder mostrar, enquanto o jogador arrasta, o
     que o mes vai fazer. O valor dela depende inteiramente de ela nao divergir
     do turno — e divergencia entre previsao e execucao e o tipo de defeito que
     so aparece no caso extremo, que aqui e justamente o caso interessante: o mes
     em que a promessa estoura o caixa. */
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

test("O PLACAR E O TURNO FECHAM A MESMA CONTA: o painel de Financas nao inventa numero", () => {
  /* A mesma exigencia que `settlement` cumpre para a Mesa, agora para Financas.
     Ela vale mais aqui do que la, porque o painel e a unica tela do jogo em que o
     jogador nao tem como conferir nada: na area ele ve o controle que moveu, na
     Mesa ve a bancada que pagou — no placar ele so tem o numero, e um numero que
     divergisse do turno seria indistinguivel de um numero certo.

     A AMOSTRA E DE REMANEJAMENTO, e a razao esta no que acontece depois da
     votacao: quando uma pauta CAI, o turno devolve os niveis que furaram parede e
     fecha o orcamento com outra configuracao — que e a conta certa, e nao a que o
     painel mostrava antes de o voto acontecer. O painel prevê o mes com a decisao
     em pe, e a previsao dele e exata enquanto o plenario nao derruba nada. */
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

      /* E O ESTOQUE FECHA COM O MES: o que o painel chama de divida bruta e
         exatamente com quanto o mes seguinte comeca. Sem esta linha, o juro
         poderia entrar duas vezes ou nenhuma, e as duas falhas apareceriam
         devagar — como uma razao divida/PIB que anda sozinha. */
      assert.ok(
        Math.abs(shown.debt - played.state.fiscal.debt) < EPSILON,
        `o painel mostrou ${shown.debt} e o mes fechou em ${played.state.fiscal.debt}`,
      );
    }),
  );
});

test("e o corte aparece: promessa que nao cabe entrega MENOS voto do que promete", () => {
  /* A prova de que a previsao da tela precisa usar o pago. Com o caixa apertado,
     a mesma promessa vale menos — e uma Mesa que previsse com o prometido
     anunciaria o placar de cima enquanto o turno produz o de baixo. */
  const state = createState(9);
  const orders = { levels: reform(), funding: everyone(0.2) };

  const rich = settlement(state, orders);
  /* O estado tambem nasce apertado: a obrigatoria de abertura e do catalogo, e
     um estado normal lido com parametros apertados seria outra coisa. */
  const poor = settlement(createState(9, SQUEEZED), orders, SQUEEZED);

  /* ⚠ A PROVA DEIXOU DE EXIGIR `rich.ratio === 1`, e a razao e um achado da
     recalibragem de 13/08/2026 que vale registrado: com o orcamento real, o
     rateio corta DESDE O PRIMEIRO MES, sem o jogador ter feito nada.

     A configuracao herdada custa cerca de 14,6 bilhoes por mes de discricionario
     e o teto do arcabouco so abre 12,7 — porque os indices de abertura de saude e
     seguranca estao abaixo do ponto neutro, e servico publico ruim ENCARECE a
     despesa obrigatoria. O presidente recebe um pais cujo nivel de servico atual
     nao cabe na regra fiscal que ele herdou junto.

     Isso nao e defeito: e a armadilha do LASTRO funcionando com numeros de
     verdade, e e a primeira decisao real que o jogo cobra — cortar alguma coisa
     antes de poder prometer qualquer coisa. O que a prova cobra agora e a
     RELACAO, que e o que ela sempre quis dizer: quanto mais apertado o caixa,
     mais fundo o corte. */
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
  /* A ordem das perguntas e a da gravidade: sem discricionario nao ha emenda, e
     sem emenda a base nao se compra de volta. Mesmo com o Congresso inteiro
     satisfeito, o governo sem caixa esta em crise. */
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
  /* Se obstrucao caisse em crise, a tela iria de "alta" a "crise" num mes e o
     nivel do meio nunca apareceria — indicador de tres nomes com dois estados
     uteis e um indicador de dois nomes mal escrito. */
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

/* ═══ O PAIS NAO SE DESENDIVIDA SOZINHO ══════════════════════════════════════
   As duas provas abaixo travam o achado numero um do handoff, corrigido em
   14/08/2026. Ele nao era uma calibragem frouxa: era um modelo que NAO CONSEGUIA
   rodar deficit primario, por tres motivos somados — a obrigatoria crescia sem
   inflacao, a MALHA media a arrecadacao contra o ponto neutro em vez da abertura,
   e o dividendo das estatais era somado por cima de uma carga que ja o continha.
   Sem estas provas, a proxima recalibragem reabre tudo em silencio.
   ═══════════════════════════════════════════════════════════════════════════ */

test("O PRESIDENTE AUSENTE TERMINA MAIS ENDIVIDADO, e isso e o mundo", () => {
  /* A afirmacao mais simples que o modelo tem de sustentar, e ela esteve INVERTIDA
     por tres sessoes: quem nao tocava em nada terminava o mandato com a MELHOR
     divida do quadro (78% → 68,4%), e quem cortava tudo terminava com a pior.

     A causa era mecanica, e a mais grave das tres esta em `growMandatory`: a
     despesa obrigatoria crescia 2,5% ao ano contra um PIB nominal de ~6%, ou seja,
     ela ENCOLHIA contra o PIB todo mes. Aposentadoria e salario sao indexados; sem
     a inflacao dentro da conta, o pais se desendividava por aritmetica. */
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
  /* O defeito de fundo, e o mais dificil de ver: `allowance = min(caixa, teto)` e
     `saldo = caixa/12 − empenho` faziam o primario ser NAO-NEGATIVO por
     construcao. Nenhuma jogada produzia deficit — o Brasil roda um ha uma decada e
     este modelo nao conseguia nem tentando.

     A prova nao pede que o deficit seja frequente: pede que ele EXISTA. Um modelo
     em que o saldo primario nunca cruza o zero nao esta calibrado errado, esta
     descrevendo outro pais.

     ⚠ E QUEM O ALCANCA E QUEM USA O TETO, e nao quem fica parado — a primeira
     versao desta prova pedia deficit de um governo que nao gasta nada, e falhou
     com razao. A desigualdade e exata:

         saldo ≥ (receita − teto) / 12

     entao o deficit so existe quando o arcabouco AUTORIZA gastar mais do que se
     arrecada, que e a situacao fiscal brasileira e nao um acidente. O governo que
     promete verba cheia gasta ate o limite legal, e e la que o vermelho aparece. */
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
  /* O exploit que a politica `explorador` mediu, e ele e o mais bonito do modelo
     porque ninguem o escreveu. Ate 14/08/2026 so o gasto ACIMA DO PISO alimentava
     o indice da area — entao derrubar o piso da saude a zero nao mudava um real do
     que o pais gasta em saude, mas movia o gasto inteiro para o balde
     discricionario, e aquele mesmo dinheiro passava a COMPRAR indice.
     Desregulamentar era a jogada dominante: o mandato terminava com os oito
     indices em 100 e a divida caindo vinte pontos.

     O que a prova fixa e a invariancia: com os MESMOS niveis, a area recebe o
     mesmo, tenha piso ou nao. O rotulo juridico do real nao constroi nada. */
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
  /* O achado 1c do handoff, medido em 14/08/2026: um movimento de piso
     constitucional saia por 358 votos e OITENTA E CINCO movimentos saiam por 334 —
     os dois passavam, no mesmo mes, com a mesma verba. Nao havia razao para o
     jogador nao juntar tudo, e o logrolling deixava de ser escolha para virar
     padrao.

     A causa era a media ponderada: um texto que corta a saude E amplia a defesa
     tem posicao MEDIA no centro do plano, e o centro nao incomoda ninguem. A
     correcao devolveu ao motor a informacao que a media apagava — o RAIO da nuvem
     de movimentos —, e ela entra na resistencia como um terceiro eixo. Nenhuma
     constante nova: e a identidade da distancia quadratica media.

     A prova compara os dois extremos no MESMO mes e com a MESMA verba cheia. */
  const state = createState();
  const funding = Object.fromEntries(PARTIES.map(party => [party.id, 1]));
  const guarded = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  assert.ok(guarded);

  /* ⚠ A PROVA PASSOU A PERGUNTAR A `forecast`, e nao a esperar o plenario. A
     tramitacao entrou em 15/08/2026 e o pacote de oitenta e cinco movimentos NUNCA
     CHEGA AO PLENARIO: a Mesa o engaveta, e ele morre na gaveta em seis meses. Isso
     e a mecanica funcionando — e uma resposta mais dura ao achado 1c do que o raio
     sozinho —, mas torna impossivel comparar dois placares que so um dos textos
     produz.
     O que se compara agora e a PREVISAO dos dois, que e a mesma conta que o plenario
     faria: `forecast` monta a camara identica a de `playMonth`, e ha uma prova
     cobrando essa identidade. A afirmacao nao mudou; o instrumento sim. */
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

  /* ⚠ E A GAVETA COBRA O SEGUNDO PRECO, que e novo em 15/08/2026: o pacote nao chega
     nem a ser votado. Escrever tudo num texto so deixou de ser uma aposta ruim para
     virar uma que nem acontece — a Mesa nao pauta, e em seis meses o texto morre sem
     nunca ter perdido nada, que e o destino que o ciclo 4 descreve para a esmagadora
     maioria dos projetos de uma casa legislativa de verdade. */
  let carrying = state;
  let reached = false;
  for (let month = 0; month < 8 && !reached; month++) {
    const played = playMonth(carrying, month === 0 ? bundleOrders : { funding });
    reached = played.report.tally !== null;
    carrying = played.state;
  }
  assert.ok(!reached, "o pacote de oitenta e cinco movimentos chegou ao plenario");
});

/* ── A MESA E O TURNO PREVEEM COM A MESMA CAMARA ───────────────────────────────
   ⚠ ESTA PROVA NASCE DE UM DEFEITO MEDIDO, e ele e o terceiro da mesma familia.
   O entrypoint montava a previsao a mao: `whipCount` com os QUATRO blocos do
   catalogo, a verba crua e a lealdade crua. O turno vota, desde a oitava sessao,
   com as ONZE bancadas do ELENCO, a verba com credito de memoria e desconto de
   ambicao dentro, e a APROVACAO DA RUA deslocando a resistencia.

   Medido antes do conserto, em 1.012 votacoes reais: divergencia de ate 35 votos e
   o veredito INVERTIDO em 275 delas — 27,2%. A Mesa anunciava "acima do quorum" e
   o mes derrubava a pauta em mais de um quarto dos casos.

   O que a torna necessaria e o modo como o defeito nasceu: NINGUEM QUEBROU NADA.
   O ELENCO e a SONDA chegaram, `playMonth` passou a usa-los, e a tela ficou para
   tras em silencio — cada lado certo sozinho. Nenhum tipo, nenhuma guarda e nenhuma
   das 190 provas via, porque nenhuma delas comparava os dois. Esta compara. */
test("A MESA E O TURNO PREVEEM COM A MESMA CAMARA, e com a mesma rua", () => {
  fc.assert(
    fc.property(anyOrders, fc.integer({ min: 0, max: 400 }), (orders, seed) => {
      /* A MEMORIA PRECISA EXISTIR PARA A PROVA MORDER: com o elenco em saldo zero,
         a verba oferecida ao lider e a do bloco e o defeito antigo passaria
         despercebido em metade das sementes. Alguns meses pagos criam credito. */
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

      /* ⚠ O QUE SE COMPARA E A PREVISAO CONTRA O DETERMINISTICO DA VOTACAO, e nao
         contra o placar sorteado: `vote` tira a dissidencia do dia de um fluxo, e
         exigir igualdade com o sorteio seria cobrar que a previsao adivinhe o dado.
         O que ela TEM de acertar e o centro — e o centro e `whipCount`. */
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

      /* A SOMA DAS LINHAS BATE COM O PLACAR. Cada linha da Mesa mostra um BLOCO, e
         um bloco e o resto da bancada mais os lideres que sairam dela. */
      const total = Object.values(seen.byBloc).reduce((sum, votes) => sum + votes, 0);
      assert.ok(
        Math.abs(total - seen.whip.votes) < 1e-6,
        `as linhas somam ${total.toFixed(1)} e o placar diz ${seen.whip.votes.toFixed(1)}`,
      );
    }),
  );
});

/* ── O QUE NAO FOI AUTORIZADO NAO E EXECUTADO, E NEM COBRADO ───────────────────
   ⚠ ESTE E O ACHADO 14, e a tramitacao o TRIPLICOU antes de mata-lo. O ciclo previa
   que ele sumisse quando o pedido e o aplicado se separassem; eles se separaram em
   15/08/2026, e o resto do turno continuou lendo o PEDIDO.

   O sintoma tinha duas metades, e as duas mentiam para o mesmo lado:

     · a MALHA recebia o mes como se a reforma tivesse valido — o indice da area
       andava por um dinheiro que nao saiu;
     · o CAIXA cobrava o empenho que nao aconteceu.

   Antes da tramitacao a divergencia durava um mes, ate a votacao. Depois dela dura
   TRES — ou para sempre, se o texto morrer na gaveta.

   A prova compara o mes de um corte que PRECISA DE LEI contra o mes em que nada foi
   pedido: enquanto o texto tramita, os dois tem de ser identicos em dinheiro e em
   capacidade, porque nos dois o pais executou exatamente a mesma coisa. */
test("O QUE ESPERA NAO GASTA: o mes do protocolo executa o orcamento que ja valia", () => {
  const state = createState(31);

  /* Um corte que fura piso constitucional: ele vai para a gaveta, e o mes tem de
     acontecer como se ele nao tivesse sido escrito. */
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

  /* ⚠ E O NIVEL TAMBEM NAO ANDA. Sem isto o pais executaria o orcamento antigo e
     guardaria o novo, e o mes seguinte comecaria de um estado que ninguem autorizou. */
  assert.equal(
    writing.state.levels[HARD.id],
    state.levels[HARD.id],
    "o nivel andou antes de o plenario autorizar",
  );

  /* E O TEXTO EXISTE — a prova nao pode passar por o corte ter sido ignorado. */
  assert.equal(writing.state.bills.length, 1, "o texto nao foi protocolado");
  assert.equal(writing.state.bills[0]?.stage, "drawer");
});
