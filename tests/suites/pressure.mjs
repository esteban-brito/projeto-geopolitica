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
import { createState } from "../../src/state/state.mjs";
import { bandsOf, playMonth } from "../../src/application/turn.mjs";

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

  /* Promete verba cheia a todo mundo e o caixa nao honra: a base derrete, a rua
     desaba, e o processo se abre. */
  const caiu = anos(1);
  assert.ok(caiu !== null, "um governo que promete tudo e nao paga atravessou o mandato");

  /* ⚠ E O PASSIVO SOBREVIVE, e isso e um RESULTADO e nao uma falha: nao gastar
     agrada o mercado, e o capital o abriga. Ele perde o baixo clero e perde a rua, e
     ainda assim as tres rupturas nao se abrem juntas. Ver o achado 29. */
  assert.equal(anos(0), null, "o governo passivo caiu — a calibragem mudou de sentido");
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
