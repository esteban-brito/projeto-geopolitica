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

  /* Cada indicado aceito senta no mês da resposta: dois partidos nunca levam a mesma cadeira. */
  let state = createState(7);
  let checked = 0;
  for (let month = 0; month < 24; month++) {
    const answers = acceptAll(state);
    const posts = state.mail.filter(letter => answers[letter.id] && letter.nominee);
    state = playMonth(state, { mail: answers }, {}).state;
    for (const ask of posts) {
      checked++;
      assert.deepEqual(
        state.cabinet?.[ask.lever ?? ""],
        ask.nominee,
        `${ask.nominee?.name} não sentou em ${ask.subject}`,
      );
    }
  }
  assert.ok(checked > 0, "nenhum partido pediu pasta");
});

test("quem acabou de ser atendido não ameaça no mês da resposta", () => {
  const { letters } = run(createState(7), 24, acceptAll);
  for (const ask of letters.filter(letter => letter.voice?.startsWith("leader.post"))) {
    const threat = letters.find(
      letter =>
        letter.from === ask.from &&
        letter.month === ask.month + 1 &&
        letter.voice?.startsWith("leader.threaten"),
    );
    assert.equal(threat, undefined, `${ask.from} ganhou a pasta e ameaçou no mês seguinte`);
  }
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
  /* O prazo do pedido do mês 0 vence no mês 2; a medida é desse mês, antes de qualquer saída. */
  const { state, letters } = run(createState(7), 3);
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

/* ── LOTE 2: IDEOLOGIA, OPOSIÇÃO E CORO ─────────────────────────────────────── */

/**
 * Um governo impopular e bem servido: todos os partidos com pastas pela bancada, os pedidos
 * atendidos, e a aprovação presa baixo. O que muda entre os partidos é só a ideologia.
 * @param {string} ruling
 * @param {number} months
 * @param {typeof CATALOG} [catalog]
 */
function unpopular(ruling, months, catalog = CATALOG) {
  let state = createState(7, catalog, null, ruling);
  const seats = catalog.cabinet;
  const quota = catalog.parties.map(party => ({ id: party.id, n: (party.seats / 513) * 38 }));
  let next = 0;
  for (const { id, n } of quota) {
    for (let k = 0; k < Math.round(n) && next < seats.length; k++, next++) {
      const seat = seats[next];
      if (!seat) continue;
      state = reduce(state, {
        type: "appoint",
        seat: seat.id,
        appointee: { id: `p${next}`, name: `P ${next}`, party: id },
      });
    }
  }
  const low = Object.fromEntries(Object.keys(state.mood).map(id => [id, 45]));
  /** @type {Letter[]} */
  const letters = [];
  for (let month = 0; month < months; month++) {
    state = { ...state, mood: low };
    state = playMonth(state, { mail: acceptAll(state) }, { catalog }).state;
    for (const letter of state.mail) {
      if (letter.month === month && (letter.kind === "ask" || letter.kind === "said"))
        letters.push(letter);
    }
  }
  return { state, letters };
}

test("com o governo impopular, o partido mais distante dele sai antes do mais próximo", () => {
  const ruling = "democratas-nacionais";
  const home = CATALOG.parties.find(party => party.id === ruling);
  assert.ok(home);
  const { letters } = unpopular(ruling, 36);
  const exits = new Map(
    letters
      .filter(letter => letter.voice?.startsWith("leader.leave"))
      .map(letter => [
        CATALOG.archetypes.find(item => item.id === letter.from)?.bloc ?? "",
        letter.month,
      ]),
  );
  const far = (/** @type {{ economic: number, liberty: number }} */ party) =>
    Math.hypot(party.economic - home.economic, party.liberty - home.liberty);
  const spoken = CATALOG.parties
    .filter(party => party.id !== ruling && CATALOG.archetypes.some(item => item.bloc === party.id))
    .sort((a, b) => far(a) - far(b));
  const closest = spoken[0];
  const farthest = spoken[spoken.length - 1];
  assert.ok(closest && farthest);
  const farExit = exits.get(farthest.id) ?? Infinity;
  const closeExit = exits.get(closest.id) ?? Infinity;
  assert.ok(farExit < Infinity, `${farthest.label} não saiu de um governo impopular e distante`);
  assert.ok(
    farExit <= closeExit,
    `${farthest.label} saiu no mês ${farExit}, ${closest.label} no ${closeExit}`,
  );
});

test("quem saiu faz oposição a um governo fraco", () => {
  const { letters } = unpopular("democratas-nacionais", 36);
  const left = new Set(letters.filter(l => l.voice?.startsWith("leader.leave")).map(l => l.from));
  const critics = letters.filter(letter => letter.voice?.startsWith("leader.criticize"));
  assert.ok(
    critics.length > 0,
    "a oposição ficou calada diante de um governo com 24% de aprovação",
  );
  for (const critic of critics)
    assert.ok(left.has(critic.from), `${critic.from} criticou sem ter saído`);
});

test("o coro da oposição pesa sobre quem ficou na base", () => {
  /* As duas partidas são iguais até a primeira crítica; no mês seguinte, só o coro as separa. */
  const ruling = "democratas-nacionais";
  const first = unpopular(ruling, 36).letters.find(letter =>
    letter.voice?.startsWith("leader.criticize"),
  );
  assert.ok(first, "ninguém criticou o governo");
  const mute = { ...CATALOG, agency: { ...CATALOG.agency, chorus: 0 } };
  const loud = unpopular(ruling, first.month + 2).state.agents ?? {};
  const quiet = unpopular(ruling, first.month + 2, mute).state.agents ?? {};
  const base = Object.keys(loud).filter(id => loud[id]?.beliefs["desgaste"] && !loud[id]?.out);
  assert.ok(base.length > 0, "ninguém ficou na base para ouvir");
  for (const id of base) {
    const heard = loud[id]?.beliefs["desgaste"]?.estimate ?? 0;
    const deaf = quiet[id]?.beliefs["desgaste"]?.estimate ?? 0;
    assert.ok(heard > deaf, `${id} ouviu a crítica e não sentiu: ${heard} contra ${deaf}`);
  }
});
