/* E o que torna um defeito relatado investigavel, e sem isso balancear o jogo vira
   adivinhacao; QUALIDADE — o misturador precisa MISTURAR. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
/* A SEMENTE PADRAO VEM DO ESTADO, e nao repetida a mao: ela e a mesma que abre uma partida
   sem semente escolhida, e dois lugares com o mesmo numero e um lugar que vai divergir na
   primeira vez que alguem trocar o padrao. */
import { DEFAULT_SEED } from "../../src/state/state.mjs";
import { hash, integer, mix, streamFrom, take, unit } from "../../src/state/random.mjs";

const anySeed = fc.integer({ min: 0, max: 4294967295 });

test("mesma semente e mesmo indice dao sempre o mesmo numero", () => {
  fc.assert(
    fc.property(anySeed, fc.nat({ max: 100000 }), (seed, index) => {
      assert.equal(mix(seed, index), mix(seed, index));
    }),
  );
});

test("o fluxo e funcao pura de (semente, saques): reconstruir da o mesmo futuro", () => {
  /* A propriedade que justifica o gerador CONTADO. */
  fc.assert(
    fc.property(anySeed, fc.nat({ max: 500 }), (seed, steps) => {
      let live = streamFrom(seed, "congress");
      for (let i = 0; i < steps; i++) live = unit(live).stream;

      /* Reconstruido a partir so dos dois numeros que o save guarda. */
      const restored = { seed: live.seed, draws: live.draws };
      assert.equal(unit(live).value, unit(restored).value);
    }),
  );
});

test("sacar NAO muta o fluxo recebido", () => {
  fc.assert(
    fc.property(anySeed, seed => {
      const before = streamFrom(seed, "events");
      const snapshot = JSON.stringify(before);
      unit(before);
      take(before, 12);
      integer(before, 0, 500);
      assert.equal(JSON.stringify(before), snapshot);
    }),
  );
});

test("cada saque avanca o contador em exatamente um", () => {
  fc.assert(
    fc.property(anySeed, seed => {
      const start = streamFrom(seed, "events");
      assert.equal(unit(start).stream.draws, start.draws + 1);
      assert.equal(integer(start, 0, 9).stream.draws, start.draws + 1);
      assert.equal(take(start, 7).stream.draws, start.draws + 7);
    }),
  );
});

test("os fluxos dos dois motores sao INDEPENDENTES", () => {
  /* A razao de existirem dois. */
  fc.assert(
    fc.property(anySeed, fc.integer({ min: 1, max: 50 }), (seed, extra) => {
      const congress = streamFrom(seed, "congress");
      const events = streamFrom(seed, "events");
      assert.notEqual(congress.seed, events.seed, "os dois fluxos nasceram iguais");

      /* Sacar do fluxo de eventos nao pode mexer no de votacao. */
      let drained = events;
      for (let i = 0; i < extra; i++) drained = unit(drained).stream;
      assert.equal(unit(congress).value, unit(streamFrom(seed, "congress")).value);
    }),
  );
});

test("sementes diferentes dao partidas diferentes", () => {
  fc.assert(
    fc.property(anySeed, anySeed, (a, b) => {
      fc.pre(a !== b);
      const first = take(streamFrom(a, "congress"), 8).values;
      const second = take(streamFrom(b, "congress"), 8).values;
      assert.notDeepEqual(first, second);
    }),
  );
});

test("take equivale a encadear a mao, e existe para nao errar o encadeamento", () => {
  fc.assert(
    fc.property(anySeed, fc.integer({ min: 0, max: 30 }), (seed, count) => {
      const start = streamFrom(seed, "congress");
      const batch = take(start, count);

      /** @type {number[]} */
      const manual = [];
      let current = start;
      for (let i = 0; i < count; i++) {
        const drawn = unit(current);
        manual.push(drawn.value);
        current = drawn.stream;
      }
      assert.deepEqual(batch.values, manual);
      assert.deepEqual(batch.stream, current);
    }),
  );
});

test("o valor fica em [0, 1) e NUNCA chega a 1", () => {
  /* O 1,0 estoura toda faixa escrita como `[min, max)`, e o defeito aparece uma vez em quatro
     bilhoes — ou seja, nunca em teste e sempre em producao. */
  fc.assert(
    fc.property(anySeed, fc.nat({ max: 2000 }), (seed, steps) => {
      const values = take({ seed, draws: steps }, 40).values;
      for (const value of values) {
        assert.ok(value >= 0 && value < 1, `saiu ${value}`);
      }
    }),
  );
});

test("o inteiro respeita a faixa, com os dois extremos incluidos", () => {
  fc.assert(
    fc.property(
      anySeed,
      fc.integer({ min: -50, max: 50 }),
      fc.nat({ max: 200 }),
      (seed, min, span) => {
        const max = min + span;
        let stream = streamFrom(seed, "congress");
        for (let i = 0; i < 30; i++) {
          const drawn = integer(stream, min, max);
          assert.ok(
            drawn.value >= min && drawn.value <= max,
            `${drawn.value} fora de [${min}, ${max}]`,
          );
          stream = drawn.stream;
        }
      },
    ),
  );
});

test("faixa invertida nao produz numero fora dela", () => {
  const drawn = integer(streamFrom(7, "congress"), 10, 3);
  assert.equal(drawn.value, 10);
});

/* ── QUALIDADE DO MISTURADOR ──────────────────────────────────────────────── Determinismo
   sozinho nao prova nada sobre a mistura: um gerador que devolvesse 0,5 sempre passaria em
   todas as provas acima. */

test("a distribuicao e plana: a media de dez mil saques fica perto de 0,5", () => {
  const { values } = take(streamFrom(DEFAULT_SEED, "congress"), 10000);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  assert.ok(Math.abs(mean - 0.5) < 0.02, `media ${mean.toFixed(4)}`);

  /* Dez baldes, e nenhum pode ficar muito acima ou abaixo do esperado. */
  const buckets = new Array(10).fill(0);
  for (const value of values) buckets[Math.floor(value * 10)]++;
  for (const [index, count] of buckets.entries()) {
    assert.ok(count > 800 && count < 1200, `o balde ${index} recebeu ${count} de 10000`);
  }
});

test("indices VIZINHOS nao produzem numeros vizinhos", () => {
  /* Sem ela, o saque da bancada 1 e o da bancada 2 andariam juntos e a dissidencia inteira
     ficaria correlacionada — todas as bancadas traindo no mesmo turno, o que parece evento e
     e defeito. */
  const seed = 987654321;
  let jumps = 0;
  const total = 2000;
  for (let i = 0; i < total; i++) {
    const a = mix(seed, i) / 4294967296;
    const b = mix(seed, i + 1) / 4294967296;
    if (Math.abs(a - b) > 0.25) jumps++;
  }
  assert.ok(jumps > total * 0.5, `so ${jumps} de ${total} saltaram — a saida esta correlacionada`);
});

test("nomes de fluxo diferentes nunca colidem em semente", () => {
  const names = ["events", "congress", "economy", "budget", "opinion", "graph", "propagation"];
  const seeds = new Set(names.map(name => streamFrom(4242, name).seed));
  assert.equal(seeds.size, names.length, "dois fluxos nomeados cairam na mesma semente");
});

test("o hash de texto muda quando qualquer letra muda", () => {
  assert.notEqual(hash("congress"), hash("congres"));
  assert.notEqual(hash("congress"), hash("Congress"));
  assert.equal(hash("congress"), hash("congress"));
});
