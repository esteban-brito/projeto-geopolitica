/* SUITE · O SAVE — e a promessa de replay, executada.
   ══════════════════════════════════════════════════════════════════════════════

   O cabecalho de `state.mjs` promete replay determinstico desde o primeiro dia.
   Ate agora isso era prosa. Aqui vira prova. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { SCHEMA_VERSION, createState } from "../../src/state/state.mjs";
import { deserialize, serialize } from "../../src/state/save.mjs";
import { playMonth } from "../../src/application/turn.mjs";

/* O TURNO DE VERDADE, e nao mais a acao de andaime. Estas provas rodavam sobre
   `advanceMonth`, que empurrava o mes e oscilava um numero — e provar replay
   sobre um andaime prova o replay do andaime. Agora elas rodam sobre
   `playMonth`: mes sem pauta e sem verba, mas com orcamento fechando, lealdade
   decaindo e capacidade andando. A promessa de replay passa a valer sobre o que
   o jogador de fato executa. */

/** @param {import("../../src/state/state.mjs").GameState} state */
const idle = state => playMonth(state).state;

const anySeed = fc.integer({ min: 0, max: 4294967295 });

test("MESMA SEMENTE E MESMAS ACOES DAO O MESMO ESTADO, byte a byte", () => {
  /* A propriedade que justifica a Fatia inteira. Ela e escrita sobre o TEXTO do
     save e nao sobre o objeto: igualdade profunda perdoaria uma diferenca de
     ordem de chave que quebraria a comparacao de dois saves no disco. */
  fc.assert(
    fc.property(anySeed, fc.integer({ min: 0, max: 60 }), (seed, turns) => {
      const play = () => {
        let state = createState(seed);
        for (let i = 0; i < turns; i++) state = idle(state);
        return serialize(state);
      };
      assert.equal(play(), play());
    }),
  );
});

test("sementes diferentes produzem partidas com fluxos diferentes", () => {
  fc.assert(
    fc.property(anySeed, anySeed, (a, b) => {
      fc.pre(a !== b);
      const first = createState(a);
      const second = createState(b);
      assert.notDeepEqual(first.streams, second.streams);
      /* Mas o resto do estado de abertura e o MESMO: a semente escolhe o
         futuro, e nao o ponto de partida. */
      assert.deepEqual(first.approval, second.approval);
      assert.equal(first.month, second.month);
    }),
  );
});

test("salvar e carregar devolve o estado identico", () => {
  fc.assert(
    fc.property(anySeed, fc.integer({ min: 0, max: 60 }), (seed, turns) => {
      let state = createState(seed);
      for (let i = 0; i < turns; i++) state = idle(state);

      const loaded = deserialize(serialize(state));
      assert.ok(loaded.ok, loaded.ok ? "" : loaded.reason);
      assert.deepEqual(loaded.state, state);
    }),
  );
});

test("a partida CONTINUA do save exatamente como continuaria sem ele", () => {
  /* Round-trip nao basta: o que importa e que o save nao perca o que decide o
     FUTURO. Se os contadores de fluxo nao sobrevivessem, esta prova quebraria e
     a de igualdade acima passaria. */
  fc.assert(
    fc.property(anySeed, fc.integer({ min: 1, max: 24 }), (seed, turns) => {
      let direct = createState(seed);
      for (let i = 0; i < turns; i++) direct = idle(direct);

      let interrupted = createState(seed);
      const half = Math.floor(turns / 2);
      for (let i = 0; i < half; i++) interrupted = idle(interrupted);

      const loaded = deserialize(serialize(interrupted));
      assert.ok(loaded.ok, loaded.ok ? "" : loaded.reason);
      let resumed = loaded.state;
      for (let i = half; i < turns; i++) resumed = idle(resumed);

      assert.equal(serialize(resumed), serialize(direct));
    }),
  );
});

test("nenhum campo do estado fica de fora do save", () => {
  /* A promessa literal do cabecalho de `state.mjs`. */
  const state = createState(7);
  const written = JSON.parse(serialize(state));
  assert.deepEqual(Object.keys(written).sort(), Object.keys(state).sort());
  assert.deepEqual(Object.keys(written.streams).sort(), Object.keys(state.streams).sort());
});

/* ── AS RECUSAS ─────────────────────────────────────────────────────────────
   Carregar arquivo escolhido por outra pessoa falha por rotina. O que nao pode
   acontecer e o save invalido ser ACEITO — um formato antigo carregado na marra
   produz um jogo que parece funcionar ate o primeiro sorteio. */

test("PROVA SINTETICA: save de outra versao e recusado", () => {
  const state = JSON.parse(serialize(createState(1)));
  state.schemaVersion = SCHEMA_VERSION - 1;
  const loaded = deserialize(JSON.stringify(state));
  assert.equal(loaded.ok, false);
  assert.match(loaded.ok ? "" : loaded.reason, /versao/);
});

test("PROVA SINTETICA: save sem os fluxos e recusado", () => {
  const state = JSON.parse(serialize(createState(1)));
  delete state.streams;
  const loaded = deserialize(JSON.stringify(state));
  assert.equal(loaded.ok, false);
  assert.match(loaded.ok ? "" : loaded.reason, /streams/);
});

test("texto que nao e save nao derruba o carregamento", () => {
  for (const junk of ["", "{", "null", "42", '"texto"', "[]"]) {
    const loaded = deserialize(junk);
    assert.equal(loaded.ok, false, `"${junk}" foi aceito`);
    assert.ok((loaded.ok ? "" : loaded.reason).length > 0);
  }
});

test("qualquer texto e recusado sem lancar", () => {
  fc.assert(
    fc.property(fc.string(), text => {
      const loaded = deserialize(text);
      /* Um texto aleatorio nunca deveria virar partida valida. */
      assert.equal(loaded.ok, false);
    }),
  );
});
