import test from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import {
  activeOffices,
  governmentViolations,
  openingGovernment,
  reformGovernment,
} from "../../prototypes/government/index.mjs";
import { assessWork, compareGovernment } from "../../prototypes/government/pilot.mjs";
import {
  PILOT_ASSETS,
  PILOT_INSTITUTIONS,
  PILOT_WORK,
  openingPilotGovernment,
} from "../../prototypes/government/pilot-cases.mjs";

const opening = () =>
  openingGovernment(
    [
      { id: "a", label: "A", kind: "ministry" },
      { id: "b", label: "B", kind: "ministry" },
      { id: "c", label: "C", kind: "ministry" },
      { id: "civil", label: "Casa Civil", kind: "presidency" },
    ],
    Array.from({ length: 12 }, (_, i) => ({
      id: `work-${i}`,
      office: ["a", "b", "c"][i % 3] ?? "a",
    })),
  );

/** @template T @param {ReadonlyArray<T>} list @param {number} n @returns {T} */
const pick = (list, n) => {
  const value = list[n % list.length];
  if (value === undefined) throw new Error("Lista vazia na sonda de reformas");
  return value;
};

/** @param {ReturnType<typeof opening>} state @param {number} number @returns {Parameters<typeof reformGovernment>[1] | null} */
const commandFor = (state, number) => {
  const ministries = activeOffices(state, "ministry");
  const offices = activeOffices(state);
  const ids = Object.keys(state.owner);
  const step = Math.floor(number / 7);
  switch (number % 7) {
    case 0:
      return { type: "transfer", competency: pick(ids, step), to: pick(offices, step >> 3).id };
    case 1:
      return { type: "rename", office: pick(offices, step).id, label: `Pasta ${number}` };
    case 2:
      if (ministries.length < 2) return null;
      return {
        type: "merge",
        into: pick(ministries, step).id,
        from: pick(ministries, step + 1).id,
      };
    case 3: {
      const possible = state.events.filter(
        event =>
          event.type === "merge" &&
          !event.undone &&
          typeof event.into === "string" &&
          state.offices[event.into]?.active &&
          !state.offices[event.office]?.active &&
          state.offices[event.office]?.mergedInto === event.into,
      );
      if (!possible.length) return null;
      const event = pick(possible, step);
      return { type: "splitMerge", into: event.into ?? "", from: event.office };
    }
    case 4: {
      if (!ministries.length || offices.length < 2) return null;
      const office = pick(ministries, step);
      const destinations = offices.filter(item => item.id !== office.id);
      return {
        type: "abolish",
        office: office.id,
        destinations: Object.fromEntries(
          ids
            .filter(id => state.owner[id] === office.id)
            .map((id, i) => [id, pick(destinations, step + i).id]),
        ),
      };
    }
    case 5: {
      const possible = state.events.filter(
        event =>
          event.type === "abolish" &&
          !event.undone &&
          !state.offices[event.office]?.active &&
          !state.offices[event.office]?.mergedInto,
      );
      if (!possible.length) return null;
      return { type: "restore", office: pick(possible, step).office };
    }
    default:
      return { type: "create", label: `Nova ${number}`, competencies: [pick(ids, step)] };
  }
};

test("reformas encadeadas conservam trabalho, identidade e estado anterior", () => {
  const counts = new Map();
  fc.assert(
    fc.property(fc.array(fc.nat(1_000_000), { minLength: 20, maxLength: 80 }), numbers => {
      let state = opening();
      const inventory = [...state.inventory].sort();
      for (const number of numbers) {
        const command = commandFor(state, number);
        if (!command) continue;
        counts.set(command.type, (counts.get(command.type) ?? 0) + 1);
        const snapshot = JSON.parse(JSON.stringify(state));
        const result = reformGovernment(state, command);
        assert.equal(
          result.ok,
          true,
          result.ok ? "" : `${result.reason}: ${JSON.stringify(command)}`,
        );
        assert.deepEqual(state, snapshot);
        state = JSON.parse(JSON.stringify(result.state));
        assert.deepEqual(governmentViolations(state), []);
        assert.deepEqual([...state.inventory].sort(), inventory);
        assert.deepEqual(Object.keys(state.owner).sort(), inventory);
      }
    }),
    { seed: 20270929, numRuns: 200 },
  );
  for (const type of [
    "transfer",
    "rename",
    "merge",
    "splitMerge",
    "abolish",
    "restore",
    "create",
  ]) {
    assert.ok(counts.get(type) > 0, `operação não exercitada: ${type}`);
  }
});

test("parecer do piloto acompanha reformas encadeadas sem inventar recursos", () => {
  fc.assert(
    fc.property(fc.array(fc.nat(1_000_000), { minLength: 20, maxLength: 80 }), numbers => {
      let state = openingPilotGovernment();
      for (const number of numbers) {
        const command = commandFor(state, number);
        if (!command) continue;
        const result = reformGovernment(state, command);
        assert.equal(
          result.ok,
          true,
          result.ok ? "" : `${result.reason}: ${JSON.stringify(command)}`,
        );
        const report = compareGovernment(
          state,
          result.state,
          PILOT_WORK,
          PILOT_INSTITUTIONS,
          PILOT_ASSETS,
          PILOT_ASSETS,
          {},
          {},
        );
        assert.deepEqual(report.continuity.lost, []);
        assert.deepEqual(report.continuity.created, []);
        assert.deepEqual(report.continuity.moved, []);
        assert.deepEqual(report.continuity.changedKind, []);
        assert.equal(new Set(report.workMoves.map(item => item.id)).size, report.workMoves.length);
        state = JSON.parse(JSON.stringify(result.state));
      }
    }),
    { seed: 20270930, numRuns: 200 },
  );
});

test("históricos ocultos não alteram a avaliação da mesma evidência presidencial", () => {
  fc.assert(
    fc.property(
      fc.boolean(),
      fc.nat(100),
      fc.array(fc.nat(100), { maxLength: 15 }),
      fc.array(fc.nat(100), { maxLength: 15 }),
      (knownHistoryComplete, workNumber, visibleNumbers, hiddenNumbers) => {
        const work = pick(PILOT_WORK, workNumber);
        const profiles = [
          work.direct,
          ...work.transferable,
          {
            action: "unrelated",
            object: "unrelated",
            instrument: "unrelated",
            scope: "unrelated",
          },
        ];
        const visible = {
          id: "witness",
          knownHistoryComplete,
          episodes: visibleNumbers.map((n, i) => ({
            ...pick(profiles, n),
            id: `episode-${i}`,
            known: true,
          })),
        };
        const withHidden = {
          ...visible,
          episodes: [
            ...visible.episodes,
            ...hiddenNumbers.map((n, i) => ({
              ...pick(profiles, n),
              id: `episode-${i}`,
              known: false,
            })),
          ],
        };
        assert.deepEqual(assessWork(work, withHidden), assessWork(work, visible));
      },
    ),
    { seed: 20270931, numRuns: 200 },
  );
});
