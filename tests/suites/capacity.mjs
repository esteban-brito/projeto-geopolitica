/* SUITE · A CAPACIDADE — o estoque que vaza.
   ══════════════════════════════════════════════════════════════════════════════

   Quatro coisas precisam ser provadas, e a terceira e a que da sentido ao motor:

     1. o indice CAI sozinho e nunca sai da faixa;
     2. verba levanta, e reforma da salto;
     3. o ATRASO e um atraso de verdade — o que o modelo consome hoje e o indice
        de `lag` meses atras, e nao uma media nem um valor agendado;
     4. a pressao tem o SINAL do catalogo, e duas areas do mesmo canal podem
        empurrar para lados opostos. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { opening, pressureOf, step } from "../../src/domain/capacity/index.mjs";
import { AREAS, CAPACITY_TARGET, NEUTRAL } from "../../src/data/areas.mjs";

/** @typedef {import("../../src/data/areas.mjs").Area} Area */

const NOTHING = Object.fromEntries(AREAS.map(area => [area.id, 0]));

/**
 * @param {Partial<Parameters<typeof step>[0]>} input
 * @returns {Parameters<typeof step>[0]}
 */
function run(input) {
  const base = opening(AREAS);
  return {
    areas: AREAS,
    index: base.index,
    history: base.history,
    allocation: NOTHING,
    neutral: NEUTRAL,
    capacityTarget: CAPACITY_TARGET,
    ...input,
  };
}

const anyAllocation = fc
  .array(fc.double({ min: 0, max: 40, noNaN: true }), {
    minLength: AREAS.length,
    maxLength: AREAS.length,
  })
  .map(values => Object.fromEntries(AREAS.map((area, i) => [area.id, values[i] ?? 0])));

/**
 * Um historico JA CHEIO, com o mesmo valor em todos os meses de cada area.
 *
 * Ele precisa estar cheio: com o buffer pela metade o motor devolve o indice de
 * abertura de proposito — a capacidade herdada ainda esta valendo —, e um teste
 * que montasse um historico de um mes so estaria medindo o `fallback` em vez do
 * valor que quis testar.
 *
 * @param {(area: Area) => number} pick
 * @returns {Record<string, number[]>}
 */
function settled(pick) {
  return Object.fromEntries(AREAS.map(area => [area.id, Array(area.lag + 1).fill(pick(area))]));
}

test("SEM VERBA O PAIS PIORA, na taxa que o catalogo declara", () => {
  /* O decaimento e o que impede o jogo de ter um estado final em que tudo esta
     em 100 e nao ha mais o que decidir. */
  const first = step(run({}));

  for (const area of AREAS) {
    /* A area alvo do canal de capacidade recebe um empurrao extra, entao a
       igualdade exata so vale para as outras. */
    if (area.id === CAPACITY_TARGET) continue;
    assert.equal(
      first.index[area.id],
      area.initial - area.decay,
      `${area.id} nao caiu o que devia`,
    );
  }
});

test("o indice NUNCA sai de 0 a 100, por mais verba ou abandono que haja", () => {
  fc.assert(
    fc.property(anyAllocation, fc.integer({ min: 1, max: 60 }), (allocation, months) => {
      let carried = opening(AREAS);
      for (let month = 0; month < months; month++) {
        const outcome = step(run({ ...carried, allocation }));
        carried = { index: outcome.index, history: outcome.history };
        for (const area of AREAS) {
          const value = outcome.index[area.id] ?? -1;
          assert.ok(value >= 0 && value <= 100, `${area.id} saiu da faixa: ${value}`);
        }
      }
    }),
  );
});

test("verba levanta, e mais verba nunca levanta menos", () => {
  fc.assert(
    fc.property(anyAllocation, allocation => {
      const dry = step(run({ allocation: NOTHING }));
      const paid = step(run({ allocation }));
      for (const area of AREAS) {
        assert.ok(
          (paid.index[area.id] ?? 0) >= (dry.index[area.id] ?? 0) - 1e-9,
          `${area.id} piorou ao receber verba`,
        );
      }
    }),
  );
});

test("reforma da um SALTO, e o salto nao depende de verba nenhuma", () => {
  const reform = step(run({ impacts: { health: 12 } }));
  const quiet = step(run({}));
  const health = AREAS.find(area => area.id === "health");
  assert.ok(health);

  assert.ok(
    Math.abs((reform.index["health"] ?? 0) - (quiet.index["health"] ?? 0) - 12) < 1e-9,
    "o salto nao chegou inteiro ao indice",
  );
});

test("O ATRASO E ATRASO: o modelo consome o indice de `lag` meses atras", () => {
  /* A prova central. Uma area de atraso longo tem de continuar entregando o
     valor ANTIGO ao modelo mesmo depois de o indice corrente ter mudado — senao
     o `lag` da educacao vira enfeite e o dilema politico dela desaparece. */
  const slow = AREAS.find(area => area.lag > 0 && area.id !== CAPACITY_TARGET);
  assert.ok(slow, "o catalogo perdeu toda area com atraso");

  let carried = opening(AREAS);
  /** @type {number[]} */
  const seen = [];

  /* Um salto enorme no primeiro mes, e nada depois. */
  for (let month = 0; month < slow.lag + 3; month++) {
    const outcome = step(run({ ...carried, impacts: month === 0 ? { [slow.id]: 30 } : {} }));
    carried = { index: outcome.index, history: outcome.history };
    seen.push(outcome.effective[slow.id] ?? 0);
  }

  /* Nos primeiros `lag` meses o efetivo ainda e o de abertura — o salto nao
     chegou. Depois disso ele aparece. */
  assert.equal(seen[0], slow.initial, "o salto chegou ao modelo no mesmo mes");
  assert.ok((seen[slow.lag] ?? 0) > slow.initial, `o salto nao chegou depois de ${slow.lag} meses`);
});

test("sem atraso, o efetivo E o corrente", () => {
  const instant = AREAS.filter(area => area.lag === 0);
  assert.ok(instant.length > 0, "o catalogo perdeu toda area sem atraso");

  const outcome = step(run({ allocation: { ...NOTHING, treasury: 5 } }));
  for (const area of instant) {
    assert.equal(outcome.effective[area.id], outcome.index[area.id], `${area.id} atrasou sem lag`);
  }
});

test("A PRESSAO TEM O SINAL DO CATALOGO, e o mesmo canal aceita os dois", () => {
  /* Duas areas em `mandatory` empurram para lados opostos de proposito: servico
     de saude bom REDUZ a obrigatoria, cobertura previdenciaria boa a AUMENTA.
     Se esta prova ficar vermelha, alguem "consertou" a inconsistencia aparente e
     quebrou o modelo. */
  const health = AREAS.find(area => area.id === "health");
  const welfare = AREAS.find(area => area.id === "welfare");
  assert.ok(health && welfare);
  assert.equal(health.feeds, welfare.feeds, "as duas deviam estar no mesmo canal");
  assert.ok(health.force < 0 && welfare.force > 0, "os sinais deviam ser opostos");

  /** @param {string} id @param {number} value */
  const only = (id, value) =>
    pressureOf({
      areas: AREAS,
      history: settled(area => (area.id === id ? value : NEUTRAL)),
      neutral: NEUTRAL,
    });

  assert.ok(only("health", 90).mandatory < only("health", 10).mandatory, "saude boa devia aliviar");
  assert.ok(
    only("welfare", 90).mandatory > only("welfare", 10).mandatory,
    "cobertura maior devia custar mais",
  );
});

test("a pressao nunca vira multiplicador absurdo", () => {
  fc.assert(
    fc.property(
      fc
        .array(fc.double({ min: 0, max: 100, noNaN: true }), {
          minLength: AREAS.length,
          maxLength: AREAS.length,
        })
        .map(values => Object.fromEntries(AREAS.map((a, i) => [a.id, [values[i] ?? 0]]))),
      history => {
        const pressure = pressureOf({ areas: AREAS, history, neutral: NEUTRAL });
        assert.ok(pressure.revenue >= 0.25 && Number.isFinite(pressure.revenue));
        assert.ok(pressure.mandatory >= 0.25 && Number.isFinite(pressure.mandatory));
      },
    ),
  );
});

test("o canal `capacity` alimenta UMA area, e so ela", () => {
  const source = AREAS.find(area => area.feeds === "capacity");
  assert.ok(source, "o catalogo perdeu o canal de capacidade");

  /* Duas partidas identicas, mudando so o indice da area fonte. So o alvo pode
     divergir. */
  const base = opening(AREAS);
  const low = step(run({ ...base, history: settled(a => (a.id === source.id ? 0 : a.initial)) }));
  const high = step(
    run({ ...base, history: settled(a => (a.id === source.id ? 100 : a.initial)) }),
  );

  for (const area of AREAS) {
    if (area.id === CAPACITY_TARGET) {
      assert.ok(
        (high.index[area.id] ?? 0) > (low.index[area.id] ?? 0),
        "a fonte de capacidade nao moveu o alvo",
      );
    } else {
      assert.equal(high.index[area.id], low.index[area.id], `${area.id} nao devia ter mudado`);
    }
  }
});

test("um mes de capacidade e deterministico", () => {
  fc.assert(
    fc.property(anyAllocation, allocation => {
      assert.deepEqual(step(run({ allocation })), step(run({ allocation })));
    }),
  );
});

test("o historico nao cresce sem fim", () => {
  /* Ele vive no save. Um buffer que cresce um item por mes seria um save que
     cresce para sempre, e o defeito so apareceria numa partida longa. */
  let carried = opening(AREAS);
  for (let month = 0; month < 200; month++) {
    const outcome = step(run({ ...carried }));
    carried = { index: outcome.index, history: outcome.history };
  }
  for (const area of AREAS) {
    assert.equal(
      carried.history[area.id]?.length,
      area.lag + 1,
      `o historico de ${area.id} escapou do tamanho`,
    );
  }
});
