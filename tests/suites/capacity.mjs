/* SUITE · A CAPACIDADE — o estoque que vaza. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { alertsOf, opening, pressureOf, step } from "../../src/domain/capacity/index.mjs";
import { AREAS, CAPACITY_TARGET, NEUTRAL } from "../../src/data/areas.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { spendOf } from "../../src/application/agenda.mjs";
import { createState } from "../../src/state/state.mjs";

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
 * Um histórico JÁ CHEIO, com o mesmo valor em todos os meses de cada área.
 *
 * @param {(area: Area) => number} pick
 * @returns {Record<string, number[]>}
 */
function settled(pick) {
  return Object.fromEntries(AREAS.map(area => [area.id, Array(area.lag + 1).fill(pick(area))]));
}

test("SEM VERBA O PAÍS PIORA, na taxa que o catálogo declara", () => {
  /* O decaimento é o que impede o jogo de ter um estado final em que tudo está em 100 e não
     há mais o que decidir. */
  const first = step(run({}));

  for (const area of AREAS) {
    /* A área alvo do canal de capacidade recebe um empurrão extra, então a igualdade exata só
       vale para as outras. */
    if (area.id === CAPACITY_TARGET) continue;
    assert.equal(
      first.index[area.id],
      area.initial * (1 - area.decay),
      `${area.id} nao caiu o que devia`,
    );
  }
});

test("O ORCAMENTO HERDADO E O PONTO DE EQUILÍBRIO — a identidade do achado 31", () => {
  /* Sem ela, os oito números de `decay` viram oito literais que ninguém sabe de onde vieram —
     e a próxima sessão que mexer num `cost` de programa quebra a identidade em silêncio,
     porque nada liga o catálogo de programas ao de áreas. */
  const state = createState();
  const inherited = spendOf({ programs: PROGRAMS, levels: state.levels }).fullByArea;

  for (const area of AREAS) {
    const spend = inherited[area.id] ?? 0;

    /* A IDENTIDADE, escrita como ela é: o empurrão do gasto herdado empata com o vazamento do
       índice herdado. */
    assert.ok(
      Math.abs(area.yield * spend - area.decay * area.initial) < 1e-3,
      `${area.id}: o gasto herdado empurra ${(area.yield * spend).toFixed(4)} contra um ` +
        `vazamento de ${(area.decay * area.initial).toFixed(4)} — a posse deixou de ser o equilibrio`,
    );
  }

  /* E O EQUILÍBRIO É DE FATO ESTÁVEL: um mês com o gasto herdado devolve o índice herdado. */
  const held = step(run({ allocation: inherited }));
  for (const area of AREAS) {
    if (area.id === CAPACITY_TARGET) continue;
    assert.ok(
      Math.abs((held.index[area.id] ?? 0) - area.initial) < 1e-3,
      `${area.id} saiu de ${area.initial} para ${held.index[area.id]} com o orcamento da posse`,
    );
  }
});

test("o índice NUNCA sai de 0 a 100, por mais verba ou abandono que haja", () => {
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

test("reforma da um SALTO, e o salto não depende de verba nenhuma", () => {
  const reform = step(run({ impacts: { health: 12 } }));
  const quiet = step(run({}));
  const health = AREAS.find(area => area.id === "health");
  assert.ok(health);

  assert.ok(
    Math.abs((reform.index["health"] ?? 0) - (quiet.index["health"] ?? 0) - 12) < 1e-9,
    "o salto nao chegou inteiro ao indice",
  );
});

test("O ATRASO E ATRASO: o modelo consome o índice de `lag` meses atrás", () => {
  /* A prova central. */
  const slow = AREAS.find(area => area.lag > 0 && area.id !== CAPACITY_TARGET);
  assert.ok(slow, "o catalogo perdeu toda area com atraso");

  let carried = opening(AREAS);
  /** @type {number[]} */
  const seen = [];

  /* Um salto enorme no primeiro mês, e nada depois. */
  for (let month = 0; month < slow.lag + 3; month++) {
    const outcome = step(run({ ...carried, impacts: month === 0 ? { [slow.id]: 30 } : {} }));
    carried = { index: outcome.index, history: outcome.history };
    seen.push(outcome.effective[slow.id] ?? 0);
  }

  /* Nos primeiros `lag` meses o efetivo ainda é o de abertura — o salto não chegou. */
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

test("A PRESSÃO TEM O SINAL DO CATÁLOGO, e o mesmo canal aceita os dois", () => {
  /* Duas áreas em `mandatory` empurram para lados opostos de propósito: serviço de saúde bom
     REDUZ a obrigatória, cobertura previdenciária boa a AUMENTA. */
  const health = AREAS.find(area => area.id === "health");
  const welfare = AREAS.find(area => area.id === "welfare");
  assert.ok(health && welfare);
  assert.equal(health.feeds, welfare.feeds, "as duas deviam estar no mesmo canal");
  assert.ok(health.force < 0 && welfare.force > 0, "os sinais deviam ser opostos");

  /** @param {string} id @param {number} value */
  const only = (id, value) =>
    pressureOf({
      areas: AREAS,
      /* AS OUTRAS ÁREAS FICAM NA ABERTURA, e não no ponto neutro: desde que a régua da
         pressão passou a ser o índice DE ABERTURA de cada área, deixa-las em 50 não as
         neutraliza — põe todas elas fora do lugar de uma vez, e a prova mediria o catálogo
         inteiro em vez da área sob teste. */
      history: settled(area => (area.id === id ? value : area.initial)),
    });

  assert.ok(only("health", 90).mandatory < only("health", 10).mandatory, "saude boa devia aliviar");
  assert.ok(
    only("welfare", 90).mandatory > only("welfare", 10).mandatory,
    "cobertura maior devia custar mais",
  );
});

test("a pressão nunca vira multiplicador absurdo", () => {
  fc.assert(
    fc.property(
      fc
        .array(fc.double({ min: 0, max: 100, noNaN: true }), {
          minLength: AREAS.length,
          maxLength: AREAS.length,
        })
        .map(values => Object.fromEntries(AREAS.map((a, i) => [a.id, [values[i] ?? 0]]))),
      history => {
        const pressure = pressureOf({ areas: AREAS, history });
        assert.ok(pressure.revenue >= 0.25 && Number.isFinite(pressure.revenue));
        assert.ok(pressure.mandatory >= 0.25 && Number.isFinite(pressure.mandatory));
      },
    ),
  );
});

test("o canal `capacity` alimenta UMA área, e só ela", () => {
  const source = AREAS.find(area => area.feeds === "capacity");
  assert.ok(source, "o catalogo perdeu o canal de capacidade");

  /* Só o alvo pode divergir. */
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

test("um mês de capacidade e determinístico", () => {
  fc.assert(
    fc.property(anyAllocation, allocation => {
      assert.deepEqual(step(run({ allocation })), step(run({ allocation })));
    }),
  );
});

test("o histórico não cresce sem fim", () => {
  /* Um buffer que cresce um item por mês seria um save que cresce para sempre, e o defeito só
     apareceria numa partida longa. */
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

test("O ALERTA MEDE A QUEDA, e não o nível — a Segurança herdada não acusa ninguém", () => {
  /* Segurança abre em 38, o menor índice do catálogo. Um limiar absoluto a acusaria no mês 1,
     antes de o jogador tocar em nada. */
  const quiet = alertsOf(AREAS, Object.fromEntries(AREAS.map(area => [area.id, area.initial])));
  assert.deepEqual(quiet, {}, "a abertura nao tem alerta nenhum");

  const security = AREAS.find(area => area.id === "security");
  assert.ok(security, "o catalogo tem Seguranca");

  for (const [fall, expected] of [
    [9, undefined],
    [10, "watch"],
    [19, "watch"],
    [20, "alert"],
    [33, "alert"],
  ]) {
    const alerts = alertsOf([security], { security: security.initial - Number(fall) });
    assert.equal(
      alerts[security.id],
      expected,
      `uma queda de ${fall} pontos devia dar ${String(expected)}`,
    );
  }
});

test("O ALERTA E UMA LEITURA DA MALHA, e nenhuma área sobe para dentro dele", () => {
  fc.assert(
    fc.property(
      fc.dictionary(
        fc.constantFrom(...AREAS.map(area => area.id)),
        fc.integer({ min: 0, max: 100 }),
      ),
      dictionary => {
        const alerts = alertsOf(AREAS, dictionary);
        for (const [id, state] of Object.entries(alerts)) {
          const area = AREAS.find(candidate => candidate.id === id);
          assert.ok(area, `${id} existe no catalogo`);
          const fall = area.initial - (dictionary[id] ?? area.initial);
          assert.ok(fall >= 10, `${id} entrou no alerta com queda de ${fall}`);
          assert.equal(state === "alert", fall >= 20, `${id} recebeu o grau errado`);
        }
      },
    ),
  );
});
