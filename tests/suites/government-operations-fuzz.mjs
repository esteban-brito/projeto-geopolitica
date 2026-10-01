import test from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import {
  operationPlans,
  OPERATION_PRIORITY,
} from "../../prototypes/government/operations-cases.mjs";
import {
  runOperations,
  receiveWork,
  receiveFunding,
} from "../../prototypes/government/operations.mjs";
import { openingPilotGovernment } from "../../prototypes/government/pilot-cases.mjs";
import { openingPilotOperations } from "../../prototypes/government/operations-cases.mjs";

test("200 cenários conservam esforço, caixa e obrigações com recursos e prioridades variados", () => {
  fc.assert(
    fc.property(
      fc.constantFrom("keep", "merge", "abolish", "digital"),
      fc.array(fc.integer({ min: 0, max: 3 }), { minLength: 8, maxLength: 8 }),
      fc.array(fc.integer({ min: 0, max: 8 }), { minLength: 4, maxLength: 4 }),
      fc.integer({ min: 0, max: 4 }),
      fc.shuffledSubarray([...OPERATION_PRIORITY], { minLength: 7, maxLength: 7 }),
      (choice, capacities, balances, unitCost, priority) => {
        const plans = operationPlans();
        const plan = plans[/** @type {keyof typeof plans} */ (choice)];
        let state = plan.operations;
        state.teams = state.teams.map((team, i) => ({ ...team, capacity: capacities[i] ?? 0 }));
        state.funds = state.funds.map((fund, i) => ({
          ...fund,
          initial: balances[i] ?? 0,
          balance: balances[i] ?? 0,
          spent: 0,
        }));
        state.jobs = state.jobs.map(job => ({ ...job, unitCost }));
        for (let period = 0; period < 6; period++) {
          const saved = JSON.stringify(state);
          const result = runOperations(plan.government, state, priority);
          assert.equal(JSON.stringify(state), saved);
          assert.deepEqual(runOperations(plan.government, JSON.parse(saved), priority), result);
          assert.deepEqual(
            result.state.jobs.map(job => job.id),
            state.jobs.map(job => job.id),
          );
          const newSpend =
            result.state.funds.reduce((n, fund) => n + fund.spent, 0) -
            state.funds.reduce((n, fund) => n + fund.spent, 0);
          assert.equal(
            newSpend,
            result.trace.reduce((n, item) => n + item.cost, 0),
          );
          for (const team of state.teams)
            assert.ok(
              result.trace
                .filter(item => item.team === team.id)
                .reduce((n, item) => n + item.units, 0) <= team.capacity,
            );
          for (const fund of result.state.funds) {
            assert.equal(fund.balance + fund.spent, fund.initial);
            assert.ok(fund.balance >= 0);
          }
          for (const job of state.jobs) {
            const next = result.state.jobs.find(item => item.id === job.id);
            assert.ok(next);
            assert.ok(
              next.preparationLeft <= job.preparationLeft &&
                next.executionLeft <= job.executionLeft,
            );
            assert.equal(
              (job.executionLeft - next.executionLeft) * job.unitCost,
              result.trace
                .filter(item => item.job === job.id)
                .reduce((n, item) => n + item.cost, 0),
            );
          }
          state = result.state;
        }
      },
    ),
    { seed: 20270930, numRuns: 200 },
  );
});

test("100 fluxos conservam entradas, recebimentos e gasto durante oito períodos", () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          arrivals: fc.integer({ min: 0, max: 3 }),
          credit: fc.integer({ min: 0, max: 3 }),
        }),
        { minLength: 8, maxLength: 8 },
      ),
      fc.integer({ min: 0, max: 3 }),
      fc.integer({ min: 0, max: 2 }),
      (schedule, capacity, unitCost) => {
        const government = openingPilotGovernment();
        let state = openingPilotOperations();
        const template = state.jobs.find(job => job.work === "rights-intake");
        assert.ok(template);
        state.jobs = [];
        state.teams = state.teams.map(team =>
          team.works.includes("rights-intake") ? { ...team, capacity } : team,
        );
        let arrived = 0,
          credited = 0;
        for (const [period, incoming] of schedule.entries()) {
          const saved = JSON.stringify(state);
          let next = state;
          if (incoming.credit > 0)
            next = receiveFunding(government, next, {
              id: `receipt-${period}`,
              fund: "rights-fund",
              amount: incoming.credit,
              source: "fluxo sintético",
            });
          credited += incoming.credit;
          next = receiveWork(
            government,
            next,
            Array.from({ length: incoming.arrivals }, (_, i) => ({
              ...template,
              unitCost,
              id: `case-${period}-${i}`,
            })),
          );
          arrived += incoming.arrivals;
          const priority = next.jobs.map(job => job.id);
          const result = runOperations(government, next, priority);
          assert.equal(JSON.stringify(state), saved);
          assert.deepEqual(
            runOperations(government, JSON.parse(JSON.stringify(next)), priority),
            result,
          );
          assert.equal(result.state.jobs.length, arrived);
          assert.equal(new Set(result.state.jobs.map(job => job.id)).size, arrived);
          const fund = result.state.funds.find(item => item.id === "rights-fund");
          assert.ok(fund);
          assert.equal(fund.balance + fund.spent, 4 + credited);
          assert.equal(
            fund.spent,
            result.state.jobs.filter(job => job.executionLeft === 0).length * unitCost,
          );
          for (const team of next.teams)
            assert.ok(
              result.trace
                .filter(item => item.team === team.id)
                .reduce((sum, item) => sum + item.units, 0) <= team.capacity,
            );
          state = result.state;
        }
      },
    ),
    { seed: 20270932, numRuns: 100 },
  );
});
