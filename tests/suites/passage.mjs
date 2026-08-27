/* SUITE · A TRAMITACAO — a gaveta, o relator, e o tempo que apaga. */

import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG } from "../../src/data/catalog.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { createState } from "../../src/state/state.mjs";
import {
  DRAWER_LIFE,
  forgotten,
  proposalOf,
  reports,
  tables,
} from "../../src/application/passage.mjs";

const PROGRAMS = CATALOG.programs;
assert.ok(PROGRAMS.length >= 2, "catalogo precisa de ao menos 2 programas");
const p0 = /** @type {import("../../src/data/programs.mjs").Program} */ (PROGRAMS[0]);
const p1 = /** @type {import("../../src/data/programs.mjs").Program} */ (PROGRAMS[1]);

/* ── forgotten ───────────────────────────────────────────────────────────── */

test("DRAWER_LIFE e 6", () => {
  assert.equal(DRAWER_LIFE, 6);
});

test("forgotten so dispara quando stage e drawer", () => {
  const bill = /** @type {import("../../src/application/passage.mjs").Bill} */ ({
    id: "x",
    writtenAt: 0,
    stage: "rapporteur",
    since: 0,
    label: "x",
    bands: {},
    levels: {},
    except: [],
  });
  assert.equal(forgotten(bill, 10), false);
});

test("forgotten dispara quando drawer ha 6+ meses", () => {
  const bill = /** @type {import("../../src/application/passage.mjs").Bill} */ ({
    id: "x",
    writtenAt: 0,
    stage: "drawer",
    since: 0,
    label: "x",
    bands: {},
    levels: {},
    except: [],
  });
  assert.equal(forgotten(bill, 6), true);
  assert.equal(forgotten(bill, 5), false);
  assert.equal(forgotten(bill, 100), true);
});

test("forgotten conta a partir de writtenAt, nao since", () => {
  const bill = /** @type {import("../../src/application/passage.mjs").Bill} */ ({
    id: "x",
    writtenAt: 10,
    stage: "drawer",
    since: 15,
    label: "x",
    bands: {},
    levels: {},
    except: [],
  });
  assert.equal(forgotten(bill, 15), false);
  assert.equal(forgotten(bill, 16), true);
});

/* ── tables ──────────────────────────────────────────────────────────────── */

test("tables sem presidente da Camara retorna tabled=true e share=1", () => {
  const result = tables({
    proposal: /** @type {any} */ ({ id: "x", moves: [] }),
    speaker: null,
    benches: PARTIES,
    funding: {},
    loyalty: {},
    standing: 50,
  });
  assert.equal(result.tabled, true);
  assert.equal(result.share, 1);
});

test("tables com cadeira sem assentos retorna share=0", () => {
  const seat = /** @type {any} */ ({ id: "empty", seats: 0 });
  const result = tables({
    proposal: /** @type {any} */ ({
      id: "x",
      moves: PROGRAMS.slice(0, 1).map(p => ({
        program: p,
        delta: -5,
        weight: 1,
        spend: 0,
        rite: "simple",
      })),
    }),
    speaker: /** @type {any} */ ({ id: "empty" }),
    benches: [seat],
    funding: { empty: 0 },
    loyalty: { empty: 0 },
    standing: 50,
  });
  assert.equal(result.share, 0);
});

/* ── reports ─────────────────────────────────────────────────────────────── */

test("reports sem relator retorna except vazio", () => {
  const result = reports({
    rapporteur: null,
    agenda: /** @type {any} */ ({
      moves: [{ program: PROGRAMS[0], delta: -5, weight: 1, spend: 0, rite: "simple" }],
    }),
    catalog: CATALOG,
  });
  assert.deepEqual(result.except, []);
  assert.equal(result.saved, undefined);
});

test("reports sem movimentos retorna except vazio", () => {
  const person = /** @type {import("../../src/domain/cast/index.mjs").Person} */ ({
    id: "r",
    name: "R",
    office: "rapporteur",
    label: "R",
    bloc: "gov",
    economic: 50,
    liberty: 50,
    venalityEconomic: 0.5,
    venalityLiberty: 0.5,
    ambition: "seat",
    reach: 0.5,
    gender: "m",
    archetype: "r",
  });
  const result = reports({
    rapporteur: person,
    agenda: /** @type {any} */ ({ moves: [] }),
    catalog: CATALOG,
  });
  assert.deepEqual(result.except, []);
  assert.equal(result.saved, undefined);
});

test("reports com uma alavanca machucada nao salva (hurt < 2)", () => {
  const person = /** @type {import("../../src/domain/cast/index.mjs").Person} */ ({
    id: "r",
    name: "R",
    office: "rapporteur",
    label: "R",
    bloc: "gov",
    economic: 50,
    liberty: 50,
    venalityEconomic: 0.5,
    venalityLiberty: 0.5,
    ambition: "seat",
    reach: 0.5,
    gender: "m",
    archetype: "r",
  });
  const result = reports({
    rapporteur: person,
    agenda: /** @type {any} */ ({
      moves: [{ program: PROGRAMS[0], delta: -5, weight: 1, spend: 0, rite: "simple" }],
    }),
    catalog: CATALOG,
  });
  assert.deepEqual(result.except, []);
  assert.equal(result.saved, undefined);
});

test("reports com duas alavancas machucadas salva a mais proxima", () => {
  const person = /** @type {import("../../src/domain/cast/index.mjs").Person} */ ({
    id: "r",
    name: "R",
    office: "rapporteur",
    label: "R",
    bloc: "gov",
    economic: 20,
    liberty: 80,
    venalityEconomic: 0.5,
    venalityLiberty: 0.5,
    ambition: "seat",
    reach: 0.5,
    gender: "m",
    archetype: "r",
  });
  const lever1 = PROGRAMS[0];
  const lever2 = PROGRAMS[1];
  const result = reports({
    rapporteur: person,
    agenda: /** @type {any} */ ({
      moves: [
        { program: lever1, delta: -5, weight: 1, spend: 0, rite: "simple" },
        { program: lever2, delta: -3, weight: 1, spend: 0, rite: "simple" },
      ],
    }),
    catalog: CATALOG,
  });
  assert.ok(result.except.length === 1);
  assert.ok(typeof result.saved === "string");
  assert.ok(/** @type {string} */ (result.saved).length > 0);
});

test("reports so seleciona alavancas com delta negativo", () => {
  const person = /** @type {import("../../src/domain/cast/index.mjs").Person} */ ({
    id: "r",
    name: "R",
    office: "rapporteur",
    label: "R",
    bloc: "gov",
    economic: 50,
    liberty: 50,
    venalityEconomic: 0.5,
    venalityLiberty: 0.5,
    ambition: "seat",
    reach: 0.5,
    gender: "m",
    archetype: "r",
  });
  const result = reports({
    rapporteur: person,
    agenda: /** @type {any} */ ({
      moves: [
        { program: PROGRAMS[0], delta: 5, weight: 1, spend: 0, rite: "simple" },
        { program: PROGRAMS[1], delta: -5, weight: 1, spend: 0, rite: "simple" },
      ],
    }),
    catalog: CATALOG,
  });
  if (result.except.length > 0) {
    assert.equal(result.except[0], p1.id);
  }
});

/* ── proposalOf ──────────────────────────────────────────────────────────── */

test("proposalOf exclui alavancas salvas pelo relator", () => {
  const state = createState(1);
  const bill = /** @type {import("../../src/application/passage.mjs").Bill} */ ({
    id: "x",
    writtenAt: 2,
    stage: "floor",
    since: 3,
    label: "teste",
    bands: Object.fromEntries(PROGRAMS.slice(0, 2).map(p => [p.id, { floor: 0, ceiling: 100 }])),
    levels: Object.fromEntries(PROGRAMS.slice(0, 2).map(p => [p.id, 50])),
    except: [p0.id],
  });
  const result = proposalOf(bill, {
    levels: state.levels,
    bands: {},
    power: 0,
    catalog: CATALOG,
  });
  assert.ok(!result.moves.some(m => m.program.id === p0.id));
});

test("proposalOf retorna proposta valida sem relator", () => {
  const state = createState(1);
  const bill = /** @type {import("../../src/application/passage.mjs").Bill} */ ({
    id: "x",
    writtenAt: 2,
    stage: "floor",
    since: 3,
    label: "teste",
    bands: Object.fromEntries(PROGRAMS.slice(0, 1).map(p => [p.id, { floor: 0, ceiling: 100 }])),
    levels: Object.fromEntries(PROGRAMS.slice(0, 1).map(p => [p.id, 50])),
    except: [],
  });
  const result = proposalOf(bill, {
    levels: state.levels,
    bands: {},
    power: 0,
    catalog: CATALOG,
  });
  assert.ok(result);
  assert.ok(Array.isArray(result.moves));
});
