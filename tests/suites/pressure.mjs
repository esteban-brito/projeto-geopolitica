/* SUITE · A CALDEIRA — o que ela cobra e que a INACAO esquente.
   ══════════════════════════════════════════════════════════════════════════════
   ⚠ A PROVA MAIS IMPORTANTE E A PRIMEIRA, e ela existe por um risco de desenho, e
   nao por um defeito medido. Se a pressao subisse so por ACAO CONTRARIA, este motor
   trabalharia contra o proprio proposito: o jogador aprenderia que mexer e perigoso e
   parar e seguro, e o projeto teria trocado "nao fazer nada e fiscalmente otimo" por
   "nao fazer nada e politicamente seguro" — a mesma doenca com um motor novo
   sustentando ela.

   A CALDEIRA nasceu de um numero: a politica que nao toca em nada terminava o mandato
   com a melhor divida do quadro. Uma versao dela que premiasse a passividade seria
   pior que nao te-la. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { heat, rupture } from "../../src/domain/pressure/index.mjs";
import { LOBBIES, PRESSURE } from "../../src/data/lobbies.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";
import { OPENING_MONTH, createState } from "../../src/state/state.mjs";
import { MONTHS_PER_TERM } from "../../src/data/regime.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { bandsOf, costOf, discretionaryRoom, playMonth } from "../../src/application/turn.mjs";
import { spendOf } from "../../src/application/agenda.mjs";

const cold = Object.fromEntries(LOBBIES.map(l => [l.id, 0]));
const idle = Object.fromEntries(LOBBIES.map(l => [l.id, 0.6]));

test("A INACAO ESQUENTA — e esta e a razao de este motor existir", () => {
  /* Descontentamento constante e o que um governo parado produz: ninguem recebeu
     nada, e ninguem esquece. Se a pressao nao subisse aqui, parar seria de graca. */
  let pressure = cold;
  for (let month = 0; month < 12; month++) {
    pressure = heat({ pressure, grievance: idle, parameters: PRESSURE });
  }

  for (const lobby of LOBBIES) {
    assert.ok(
      (pressure[lobby.id] ?? 0) > 50,
      `${lobby.id} passou um ano sem receber nada e ficou em ${pressure[lobby.id]}`,
    );
  }
});

test("ELA SOBE MAIS RAPIDO DO QUE DESCE, e a assimetria e a mecanica", () => {
  /* ⚠ Simetrica, a caldeira seria um pendulo: bastaria alternar quem se agrada para
     nunca esquentar nada. Reputacao se perde mais rapido do que se recupera — e a
     mesma forma que SONDA usa para satisfacao. */
  const um = LOBBIES[0];
  assert.ok(um);

  const subiu = heat({
    pressure: { [um.id]: 50 },
    grievance: { [um.id]: 1 },
    parameters: PRESSURE,
  });
  const desceu = heat({
    pressure: { [um.id]: 50 },
    grievance: { [um.id]: 0 },
    parameters: PRESSURE,
  });

  const ganho = (subiu[um.id] ?? 0) - 50;
  const perda = 50 - (desceu[um.id] ?? 0);
  assert.ok(ganho > perda, `subiu ${ganho.toFixed(2)} e desceu ${perda.toFixed(2)}`);
});

test("O PROCESSO SO ABRE COM AS TRES RUPTURAS JUNTAS", () => {
  /* ⚠ PRESIDENTES NAO CAEM POR UM FATOR SO. As tres ja aconteceram separadas muitas
     vezes na Republica sem derrubar ninguem, e um limiar unico daria um jogo em que
     irritar muito um grupo derruba o governo. */
  const fervendo = Object.fromEntries(LOBBIES.map(l => [l.id, 100]));

  /* As tres juntas: abre. */
  const tudo = rupture({
    pressure: fervendo,
    lobbies: LOBBIES,
    standing: PRESSURE.streetFloor - 1,
    broker: "fisiologismo",
    parameters: PRESSURE,
  });
  assert.ok(tudo.open, "as tres rupturas abertas e o processo nao abriu");

  /* A rua de pe segura tudo, por pior que esteja o resto. */
  const comRua = rupture({
    pressure: fervendo,
    lobbies: LOBBIES,
    standing: 60,
    broker: "fisiologismo",
    parameters: PRESSURE,
  });
  assert.ok(!comRua.open, "o processo abriu com a rua sustentando o governo");
  assert.ok(comRua.economic, "o capital fervia e a ruptura economica nao acusou");

  /* E quem sustenta segura tudo tambem: enquanto houver torneira, ele fica. */
  const comBroker = rupture({
    pressure: { ...fervendo, fisiologismo: 0 },
    lobbies: LOBBIES,
    standing: 0,
    broker: "fisiologismo",
    parameters: PRESSURE,
  });
  assert.ok(!comBroker.open, "o processo abriu sem quem sustenta ter virado");
});

test("QUEM NAO PESA NAO ABANDONA O CAPITAL, por mais que ferva", () => {
  /* A ruptura economica e PONDERADA, e nao "qualquer um deles": as forcas de ordem
     nao financiam campanha nem precificam divida, e o peso zero diz isso. Sem a
     ponderacao, um lobby sem dinheiro derrubaria um governo por conta propria. */
  const soOrdem = Object.fromEntries(LOBBIES.map(l => [l.id, l.weight > 0 ? 0 : 100]));
  const nada = rupture({
    pressure: soOrdem,
    lobbies: LOBBIES,
    standing: 0,
    broker: "fisiologismo",
    parameters: PRESSURE,
  });
  assert.ok(!nada.economic, "um grupo sem peso abriu a ruptura economica sozinho");
});

test("A PRESSAO FICA ENTRE 0 E 100, com qualquer descontentamento", () => {
  fc.assert(
    fc.property(
      fc.double({ min: 0, max: 100, noNaN: true }),
      fc.double({ min: -2, max: 3, noNaN: true }),
      (now, want) => {
        const um = LOBBIES[0];
        assert.ok(um);
        const next = heat({
          pressure: { [um.id]: now },
          grievance: { [um.id]: want },
          parameters: PRESSURE,
        });
        const value = next[um.id] ?? 0;
        assert.ok(value >= 0 && value <= 100, `pressao saiu da escala: ${value}`);
      },
    ),
    { numRuns: 300 },
  );
});

test("A QUEDA ACONTECE, e ela NAO acontece com um governo que entrega", () => {
  /* ⚠ A PROVA QUE FECHA A MECANICA. Um motor de derrota que nunca derruba e um
     instrumento morto — foi o achado 3 deste projeto, com o contingenciamento que
     nao disparava —, e um que derruba sempre e uma cutscene.

     O criterio foi declarado ANTES de medir: a queda tem de ser alcancavel por um
     governo ruim e inalcancavel por um mediano. */
  const anos = (/** @type {number} */ pay) => {
    let state = createState();
    for (let month = 0; month < 60; month++) {
      state = playMonth(
        state,
        {
          funding: Object.fromEntries(CATALOG.parties.map(p => [p.id, pay])),
          levels: { ...state.levels },
          bands: bandsOf(state, CATALOG),
          mail: {},
        },
        { catalog: CATALOG },
      ).state;
      if (state.fallen !== null) return state.fallen;
    }
    return null;
  };

  /* ── O GOVERNO MEDIANO, e ele e a outra ponta do criterio ───────────────────
     Ele nao e bom: aperta o orcamento ate caber no teto e paga so a manutencao da
     base — o minimo para continuar governando. E o contrafactual que separa "a queda
     e alcancavel" de "a queda e inevitavel". */
  const UPKEEP = 1.5 / 12;
  const manutencao = () => {
    let state = createState();
    for (let month = 0; month < 60; month++) {
      const reserve = costOf(
        Object.fromEntries(CATALOG.parties.map(p => [p.id, UPKEEP])),
        CATALOG.parties,
        CATALOG.fiscal.seatPrice,
      );
      /* O MAIOR APERTO QUE CABE, deixando a reserva da base de fora. Busca binaria,
         como no simulador: a relacao entre o fator e o custo e linear, o teto nao e. */
      const room = Math.max(0, discretionaryRoom(state) - reserve);
      let low = 0;
      let high = 1;
      for (let step = 0; step < 20; step++) {
        const mid = (low + high) / 2;
        const levels = Object.fromEntries(
          PROGRAMS.map(p => [
            p.id,
            p.floor + Math.max(0, (state.levels[p.id] ?? p.initial) - p.floor) * mid,
          ]),
        );
        if (spendOf({ programs: PROGRAMS, levels }).total > room) high = mid;
        else low = mid;
      }
      const levels = Object.fromEntries(
        PROGRAMS.map(p => [
          p.id,
          p.floor + Math.max(0, (state.levels[p.id] ?? p.initial) - p.floor) * low,
        ]),
      );

      state = playMonth(
        state,
        {
          levels,
          funding: Object.fromEntries(CATALOG.parties.map(p => [p.id, UPKEEP])),
          bands: bandsOf(state, CATALOG),
          mail: {},
        },
        { catalog: CATALOG },
      ).state;
      if (state.fallen !== null) return state.fallen;
    }
    return null;
  };

  /* Promete verba cheia a todo mundo e o caixa nao honra: a base derrete, a rua
     desaba, e o processo se abre. */
  const caiu = anos(1);
  assert.ok(caiu !== null, "um governo que promete tudo e nao paga atravessou o mandato");

  /* ⚠ E O PASSIVO CAI TAMBEM, DESDE 16/08/2026 — e esta linha era o INVERSO ate o
     achado 31 ser consertado. Ela dizia "o passivo sobrevive, e isso e um resultado":
     nao gastar agradava o mercado, e o capital o abrigava.

     O que mudou nao foi a CALDEIRA, foi o pais deixar de se consertar sozinho. Com o
     decaimento por identidade, quem nao alimenta as areas ve os indices cairem, a rua
     cansar e o mercado ver a divida subir — e as tres rupturas passam a se abrir
     juntas. O achado 29 morreu por consequencia, e nao por calibragem: era exatamente
     o que a retomada previa ao mandar consertar o 31 antes dele.

     ⚠ E A PROVA NAO FOI APAGADA — ela virou a outra metade do criterio, que e a que
     de fato importa e nunca esteve escrita: a queda tem de ser alcancavel por um
     governo RUIM e inalcancavel por um MEDIANO. Sem esta segunda linha, "todo mundo
     cai" passaria verde, e um motor de derrota que derruba sempre e uma cutscene. */
  const passivo = anos(0);
  assert.ok(passivo !== null, "o governo passivo atravessou 60 meses sem consequencia");

  /* ⚠ E O MEDIANO ATRAVESSA O MANDATO. Ele mantem a maquina no que o teto permite e
     paga a manutencao da base — nao e um bom governo, e um governo comum. Medido: ele
     cai no mes 52, tres meses DEPOIS de o mandato acabar.

     Este assert e o que impede a calibragem de escorregar para o corredor: com
     `mandatoryGrowth` em 2,5% — a media aplicada a obrigatoria inteira, que era o
     valor ate 16/08 — TODO governo caía entre os meses 39 e 45, inclusive o que
     reforma, e o jogo deixava de ter jogada. */
  const mediano = manutencao();
  assert.ok(
    mediano === null || mediano > MONTHS_PER_TERM + OPENING_MONTH,
    `um governo mediano caiu no mes ${mediano}, dentro do mandato — a queda virou corredor`,
  );
});

test("O PROCESSO DA UM TURNO DE LEILAO antes de o plenario votar", () => {
  /* ⚠ SEM O INTERVALO, A DERROTA NAO E JOGAVEL. Medido na primeira versao: aberto no
     mes 47, caido no mes 47 — o que abriu o processo foi a base ja destruida, entao
     os votos para sustentar nao existiam, e o leilao nunca acontecia.

     Um mes e o mesmo desenho da tramitacao: um estagio por mes. E e ele que da ao
     jogador o turno em que a cadeira vale o triplo e sobreviver ainda e possivel. */
  let state = createState();
  let opened = null;

  for (let month = 0; month < 60; month++) {
    state = playMonth(
      state,
      {
        funding: Object.fromEntries(CATALOG.parties.map(p => [p.id, 1])),
        levels: { ...state.levels },
        bands: bandsOf(state, CATALOG),
        mail: {},
      },
      { catalog: CATALOG },
    ).state;
    if (opened === null && state.impeachment !== null) opened = state.impeachment;
    if (state.fallen !== null) break;
  }

  assert.ok(opened !== null && state.fallen !== null, "o processo nao chegou ao plenario");
  assert.ok(
    state.fallen > opened,
    `o plenario votou no mesmo mes da abertura (${opened}) — nao houve leilao`,
  );
});

test("O MERCADO PEDE CORTE, e os de capacidade pedem verba — a exigencia tem SENTIDO", () => {
  /* ⚠ ESTA PROVA PRENDE O DILEMA CENTRAL DO JOGO, e ele so passou a existir em
     20/08/2026. Ate aqui todas as exigencias empurravam para o mesmo lado — gaste mais
     —, e um jogo em que todo mundo quer a mesma coisa nao tem escolha dentro dele: bastava
     ter dinheiro. Com o mercado escrevendo, a bandeja pode receber duas cartas que se
     contradizem, e ceder as duas e impossivel.

     ⚠ E O QUE ELA COBRA E O SENTIDO, e nao a existencia da carta. Uma exigencia com o
     sentido invertido e pior que exigencia nenhuma: o jogador cede achando que gasta e
     na verdade corta, aprende a regra ao contrario, e joga contra ela por meses. E o
     defeito nao falha em lugar nenhum — a carta sai inteira, com numero e botao. */

  /** UM GOVERNO GASTADOR: sobe tudo o que a lei permite, todo mes. */
  const gastador = () => {
    let state = createState();
    for (let month = 0; month < 40; month++) {
      const levels = Object.fromEntries(
        PROGRAMS.map(p => [p.id, Math.min(p.ceiling, (state.levels[p.id] ?? p.initial) + 3)]),
      );
      state = playMonth(
        state,
        { levels, funding: {}, bands: bandsOf(state, CATALOG), mail: {} },
        { catalog: CATALOG },
      ).state;
      const carta = state.mail.find(l => l.kind === "demand" && l.from === "mercado");
      if (carta) return { state, carta };
    }
    return null;
  };

  const achado = gastador();
  assert.ok(
    achado,
    "o mercado nao escreveu em 40 meses de governo gastador — ele voltou a ser mudo",
  );

  const { state, carta } = achado;
  const programa = PROGRAMS.find(p => p.id === carta.lever);
  assert.ok(programa, `o mercado exigiu a alavanca ${carta.lever}, que nao e um programa`);

  /* ⚠ O NIVEL EXIGIDO E O DA POSSE, e ele tem de ser MENOR que o de hoje: e isso que
     faz a exigencia ser um CORTE. Maior, e ela seria um pedido de gasto assinado pelo
     grupo que existe para cobrar o contrario. */
  assert.equal(carta.level, programa.initial, "o mercado nao pediu o nivel da posse");
  assert.ok(
    (carta.level ?? 0) < (state.levels[programa.id] ?? programa.initial),
    `o mercado pediu ${carta.level} e o programa esta em ${state.levels[programa.id]} — isso e gasto, e nao corte`,
  );

  /* ⚠ E O SENTIDO DO OUTRO LADO CONTINUA VALENDO. Um governo que CORTA recebe a
     exigencia inversa, do grupo de capacidade — e o nivel pedido fica ACIMA do de hoje.
     Sem esta metade, a prova passaria com os dois grupos pedindo corte. */
  let cortador = createState();
  let devolver = null;
  for (let month = 0; month < 40; month++) {
    const levels = Object.fromEntries(PROGRAMS.map(p => [p.id, p.floor]));
    cortador = playMonth(
      cortador,
      { levels, funding: {}, bands: bandsOf(cortador, CATALOG), mail: {} },
      { catalog: CATALOG },
    ).state;
    const carta = cortador.mail.find(
      l => l.kind === "demand" && l.from !== "mercado" && l.answer === null,
    );
    if (carta) {
      devolver = carta;
      break;
    }
  }

  assert.ok(devolver, "nenhum grupo de capacidade exigiu verba de volta em 40 meses de corte");
  assert.ok(
    (devolver.level ?? 0) > (cortador.levels[devolver.lever ?? ""] ?? 0),
    `um grupo de capacidade pediu ${devolver.level} com o programa em ${cortador.levels[devolver.lever ?? ""]} — isso e corte, e nao verba`,
  );
});
