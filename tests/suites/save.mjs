/* SUITE · O SAVE — e a promessa de replay, executada. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { SCHEMA_VERSION, createState } from "../../src/state/state.mjs";
import { deserialize, serialize } from "../../src/state/save.mjs";
import { playMonth } from "../../src/application/turn.mjs";

/* O TURNO DE VERDADE, e nao mais a acao de andaime. */

/** @param {import("../../src/state/state.mjs").GameState} state */
const idle = state => playMonth(state).state;

const anySeed = fc.integer({ min: 0, max: 4294967295 });

test("MESMA SEMENTE E MESMAS ACOES DAO O MESMO ESTADO, byte a byte", () => {
  /* Ela e escrita sobre o TEXTO do save e nao sobre o objeto: igualdade profunda perdoaria
     uma diferenca de ordem de chave que quebraria a comparacao de dois saves no disco. */
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
      /* Mas o resto do estado de abertura e o MESMO: a semente escolhe o futuro, e nao o
         ponto de partida. */
      assert.deepEqual(first.mood, second.mood);
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
  /* Se os contadores de fluxo nao sobrevivessem, esta prova quebraria e a de igualdade acima
     passaria. */
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

/* ── AS RECUSAS ───────────────────────────────────────────────────────────── Carregar
   arquivo escolhido por outra pessoa falha por rotina. */

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

test("save com impeachment e round-trip identico", () => {
  let state = createState(42);
  for (let i = 0; i < 20; i++) state = idle(state);
  /* Forca um impeachment — o campo e number | null. */
  state = /** @type {import("../../src/state/state.mjs").GameState} */ ({
    ...state,
    impeachment: state.month,
  });
  const text = serialize(state);
  const loaded = deserialize(text);
  assert.equal(loaded.ok, true);
  if (loaded.ok) {
    assert.equal(loaded.state.impeachment, state.impeachment);
    assert.equal(loaded.state.fallen, state.fallen);
  }
});

test("save com campo corrupto e recusado", () => {
  const state = createState(1);
  const obj = JSON.parse(serialize(state));
  obj.fiscal = 42;
  const loaded = deserialize(JSON.stringify(obj));
  assert.equal(loaded.ok, false);
  if (!loaded.ok) {
    assert.ok(loaded.reason.includes("fiscal"));
  }
});

/* ── O CODIGO MORTO SAIU SEM BUMP, e a razao e medida ──────────────────────── ⚠ A PREMISSA
   REGISTRADA ERA QUE `weight` E `streams.events` PEDIAM UM BUMP DE ESQUEMA, e ela nao se
   sustenta: `deserialize` confere a PRESENCA de 18 campos de topo e a FORMA de 8 deles, e nao
   olha dentro de uma carta. Campo a mais num save antigo e campo ignorado — e foi so por isso
   que os dois puderam sair sem custar a partida em andamento. */

test("O SAVE DA VERSAO CORRENTE COM OS DOIS CAMPOS MORTOS CONTINUA CARREGANDO", () => {
  const state = idle(idle(createState(7)));
  const salvo = JSON.parse(serialize(state));

  /* O SAVE COMO ELE FOI GRAVADO ANTES DA LIMPEZA: peso em toda carta, e o fluxo a mais. */
  salvo.mail = salvo.mail.map((/** @type {object} */ letter) => ({ ...letter, weight: "high" }));
  salvo.streams = { ...salvo.streams, events: { seed: 1, count: 0 } };

  const lido = deserialize(JSON.stringify(salvo));
  assert.ok(lido.ok, `o save de antes da limpeza foi recusado: ${lido.ok ? "" : lido.reason}`);
});

test("NENHUMA CARTA GRAVA UM PESO QUE NINGUEM LE, e nenhum fluxo fica sem consumidor", () => {
  let state = createState(7);
  for (let month = 0; month < 12; month++) state = idle(state);

  assert.ok(state.mail.length > 0, "o mandato nao escreveu carta nenhuma: a prova nao mediu nada");
  for (const letter of state.mail) {
    assert.ok(!("weight" in letter), `a carta ${letter.id} voltou a gravar um peso sem leitor`);
  }

  const fluxos = Object.keys(JSON.parse(serialize(state)).streams);
  assert.deepEqual(fluxos, ["congress"], `o save carrega fluxos sem consumidor: ${fluxos}`);
});

test("O SAVE DA VERSAO ANTERIOR ABRE SEM PARTIDO, e a versao nao subiu", () => {
  /* ⚠ ESTA E A PROVA QUE POUPOU A PARTIDA EM ANDAMENTO. O campo `party` entrou sem bump de
     esquema porque ele nao esta na lista de obrigatorios do validador — e um save gravado
     antes dele abre com o campo ausente, que todo consumidor lê como `null`. Se alguem o
     puser entre os obrigatorios, esta prova quebra e a decisao volta a ser tomada. */
  const antigo = JSON.parse(serialize(createState(7)));
  delete antigo["party"];

  const lido = deserialize(JSON.stringify(antigo));
  assert.ok(lido.ok, lido.ok ? "" : lido.reason);
  assert.equal(lido.ok ? lido.state.party : "nao abriu", undefined);
  assert.equal(antigo["schemaVersion"], SCHEMA_VERSION);

  /* E ele JOGA: um mes inteiro roda com o campo ausente. */
  if (lido.ok) assert.equal(playMonth(lido.state).state.month, lido.state.month + 1);
});

test("O PARTIDO ATRAVESSA O SAVE, e o mandato inteiro se refaz com ele", () => {
  fc.assert(
    fc.property(anySeed, fc.integer({ min: 0, max: 12 }), (seed, turns) => {
      const play = () => {
        let state = createState(seed, undefined, null, "trabalhistas-unidos");
        for (let i = 0; i < turns; i++) state = idle(state);
        return serialize(state);
      };
      assert.equal(play(), play());

      const lido = deserialize(play());
      assert.ok(lido.ok);
      if (lido.ok) assert.equal(lido.state.party, "trabalhistas-unidos");
    }),
  );
});
