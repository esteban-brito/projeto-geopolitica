/* SUITE · O MUNDO — as pessoas agem sem o Presidente pedir, e cada gesto tem autor e motivo. */

import assert from "node:assert/strict";
import test from "node:test";
import { playMonth } from "../../src/application/turn.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";
import { THRESHOLDS } from "../../src/domain/congress/index.mjs";
import { deserialize, serialize } from "../../src/state/save.mjs";
import { createState, reduce } from "../../src/state/state.mjs";

/** @typedef {import("../../src/state/state.mjs").GameState} GameState */
/** @typedef {import("../../src/state/state.mjs").Letter} Letter */

/**
 * @param {GameState} start
 * @param {number} months
 * @param {(state: GameState) => Record<string, string>} [answer] - as respostas do mês
 */
function run(start, months, answer = () => ({})) {
  let state = start;
  /** @type {Map<string, Letter>} */
  const seen = new Map();
  for (let month = 0; month < months; month++) {
    state = playMonth(state, { mail: answer(state) }, {}).state;
    for (const letter of state.mail) {
      if (letter.kind === "ask" || letter.kind === "said") seen.set(letter.id, letter);
    }
  }
  return { state, letters: [...seen.values()].sort((a, b) => a.month - b.month) };
}

/** @param {GameState} state @returns {Record<string, string>} */
const acceptAll = state =>
  Object.fromEntries(
    state.mail
      .filter(letter => letter.kind === "ask" && letter.answer === null)
      .map(letter => [letter.id, "accept"]),
  );

test("toda carta do mundo tem autor, e a mesma semente refaz o mesmo mundo", () => {
  const a = run(createState(7), 12);
  const b = run(createState(7), 12);
  assert.ok(a.letters.length > 0, "doze meses sem ninguém agir");
  for (const letter of a.letters) {
    assert.ok(letter.from && letter.by?.name && letter.by.role, `${letter.id} sem autor`);
    assert.match(letter.voice ?? "", /^(minister|leader)\.[a-z]+\.(firm|polite|plain)$/);
  }
  assert.deepEqual(
    a.letters.map(letter => letter.id),
    b.letters.map(letter => letter.id),
  );
  const other = run(createState(8), 12);
  assert.notDeepEqual(
    a.letters.map(letter => `${letter.month}:${letter.voice}`),
    other.letters.map(letter => `${letter.month}:${letter.voice}`),
    "sementes diferentes deram o mesmo mundo",
  );
});

test("o partido ignorado pede antes de sair, e só sai depois de ser recusado", () => {
  const { letters } = run(createState(7), 24);
  const exits = letters.filter(letter => letter.voice?.startsWith("leader.leave"));
  assert.ok(exits.length > 0, "ninguém saiu de um governo que não deu nada a ninguém");
  for (const exit of exits) {
    const asked = letters.filter(
      letter => letter.from === exit.from && letter.kind === "ask" && letter.month < exit.month,
    );
    assert.ok(asked.length > 0, `${exit.from} saiu sem nunca ter pedido`);
  }
});

test("o partido atendido fica na base, e o seu indicado senta na cadeira pedida", () => {
  const ignored = run(createState(7), 24);
  const served = run(createState(7), 24, acceptAll);
  const leftIgnored = ignored.letters.filter(l => l.voice?.startsWith("leader.leave")).length;
  const leftServed = served.letters.filter(l => l.voice?.startsWith("leader.leave")).length;
  assert.ok(leftServed < leftIgnored, `atendidos saíram ${leftServed}, ignorados ${leftIgnored}`);

  const asked = served.letters.find(letter => letter.voice?.startsWith("leader.post"));
  assert.ok(asked?.nominee && asked.lever, "nenhum partido pediu pasta");
  const seated = Object.values(served.state.cabinet ?? {}).filter(
    item => item.party === asked.nominee?.party,
  );
  assert.ok(seated.length > 0, "o partido atendido não tem ninguém no gabinete");
});

test("aceitar o pedido tira quem estava na cadeira e senta o indicado no mês da resposta", () => {
  /* Com as 38 cadeiras ocupadas por técnicos, todo pedido de pasta obriga a tirar alguém. */
  let state = createState(7);
  for (const [n, seat] of CATALOG.cabinet.entries()) {
    state = reduce(state, {
      type: "appoint",
      seat: seat.id,
      appointee: { id: `tecnico-${n}`, name: `Técnico ${n}`, party: null },
    });
  }
  const first = playMonth(state, {}, {}).state;
  const ask = first.mail.find(letter => letter.voice?.startsWith("leader.post"));
  assert.ok(ask?.lever && ask.nominee, "ninguém pediu pasta a um gabinete só de técnicos");
  const was = first.cabinet?.[ask.lever];
  assert.equal(was?.party, null);
  const next = playMonth(first, { mail: { [ask.id]: "accept" } }, {}).state;
  assert.deepEqual(next.cabinet?.[ask.lever], ask.nominee);
});

test("desembarcar entrega os cargos e leva a bancada à obstrução", () => {
  const { state, letters } = run(createState(7), 24);
  const exit = letters.find(letter => letter.voice?.startsWith("leader.leave"));
  assert.ok(exit?.from);
  const bloc = CATALOG.archetypes.find(item => item.id === exit.from)?.bloc ?? "";
  assert.ok(Object.values(state.cabinet ?? {}).every(item => item.party !== bloc));
  const after = run(createState(7), exit.month + 1).state;
  assert.ok((after.loyalty[bloc] ?? 100) < THRESHOLDS.obstruction, "a bancada que saiu segue leal");
});

test("o ministro da área cortada pede o programa de volta, e atender devolve o nível da posse", () => {
  /* Um corte de 40% na pasta inteira, numa área sem piso constitucional: um programa só mexe 2%
     na pasta, e nenhum ministro reclama disso. */
  const start = createState(7);
  const levels = { ...start.levels };
  for (const program of CATALOG.programs) {
    if (program.area === "industry") levels[program.id] = program.initial * 0.6;
  }
  let state = { ...start, levels };
  /** @type {Letter | undefined} */
  let ask;
  for (let month = 0; month < 12 && !ask; month++) {
    state = playMonth(state, { levels }, {}).state;
    ask = state.mail.find(
      letter => letter.voice?.startsWith("minister.ask") && letter.answer === null,
    );
  }
  assert.ok(ask?.lever, "o ministro de uma área cortada em 40% nunca pediu nada");
  const program = CATALOG.programs.find(item => item.id === ask?.lever);
  assert.equal(program?.area, "industry");
  assert.equal(ask.level, program?.initial);
  const next = playMonth(state, { levels, mail: { [ask.id]: "accept" } }, {}).state;
  assert.equal(next.levels[ask.lever], ask.level);
});

test("a recusa ensina: depois de ignorado, o porta-voz espera menos do Presidente", () => {
  const { state, letters } = run(createState(7), 4);
  const refused = letters.find(letter => letter.kind === "ask" && letter.answer === "silence");
  assert.ok(refused?.from);
  const belief = state.agents?.[refused.from]?.beliefs["aceita"];
  assert.ok(belief, "a resposta não virou crença");
  const agent = state.agents?.[refused.from];
  assert.ok((agent?.dignity ?? 1) < 1, "o silêncio não feriu ninguém");
});

test("as pessoas do mundo atravessam o save", () => {
  const { state } = run(createState(7), 6);
  const back = deserialize(serialize(state));
  assert.ok(back.ok);
  assert.deepEqual(back.ok && back.state.agents, state.agents);
  const legacy = JSON.parse(serialize(createState(7)));
  delete legacy.agents;
  assert.ok(deserialize(JSON.stringify(legacy)).ok, "save sem as pessoas foi recusado");
});
