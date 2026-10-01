import test from "node:test";
import assert from "node:assert/strict";
import { openingPilotGovernment } from "../../prototypes/government/pilot-cases.mjs";
import { openingPilotOperations } from "../../prototypes/government/operations-cases.mjs";
import {
  receiveWork,
  receiveFunding,
  runOperations,
} from "../../prototypes/government/operations.mjs";
import { demandScenarios, simulateDemand } from "../../prototypes/government/demand.mjs";

test("nova obrigação conserva histórico, marca chegada e não reaproveita ID", () => {
  const government = openingPilotGovernment();
  const state = openingPilotOperations();
  const template = state.jobs[0];
  assert.ok(template);
  const saved = JSON.stringify(state);
  const next = receiveWork(government, state, [{ ...template, id: "new-case" }]);
  assert.equal(JSON.stringify(state), saved);
  assert.equal(next.jobs.length, state.jobs.length + 1);
  assert.equal(next.jobs.at(-1)?.receivedPeriod, 0);
  assert.throws(() => receiveWork(government, next, [{ ...template, id: "new-case" }]), /repetid/);
  assert.throws(
    () => receiveWork(government, state, [{ ...template, id: "partial", preparationLeft: 0 }]),
    /inicial/,
  );
});

test("recebimento identificado reconcilia caixa sem alterar abertura nem duplicar crédito", () => {
  const government = openingPilotGovernment();
  const state = openingPilotOperations();
  const saved = JSON.stringify(state);
  const receipt = {
    id: "appropriation-1",
    fund: "rights-fund",
    amount: 3,
    source: "dotação sintética",
  };
  const funded = receiveFunding(government, state, receipt);
  assert.equal(JSON.stringify(state), saved);
  assert.equal(funded.funds.find(fund => fund.id === receipt.fund)?.initial, 4);
  assert.equal(funded.funds.find(fund => fund.id === receipt.fund)?.balance, 7);
  assert.throws(() => receiveFunding(government, funded, receipt), /repetid/);
  assert.throws(
    () => receiveFunding(government, state, { ...receipt, source: " " }),
    /recebimento/,
  );
  assert.throws(
    () => receiveFunding(government, state, { ...receipt, fund: "missing" }),
    /recebimento/,
  );
  assert.throws(
    () => receiveFunding(government, state, { ...receipt, amount: Number.MAX_SAFE_INTEGER }),
    /fundo/,
  );
  const priority = funded.jobs.map(job => job.id);
  const result = runOperations(government, funded, priority);
  assert.deepEqual(runOperations(government, JSON.parse(JSON.stringify(funded)), priority), result);
});

test("fluxo compatível com capacidade não acumula fila", () => {
  const result = simulateDemand(demandScenarios().steady);
  assert.equal(result.state.jobs.length, 12);
  assert.ok(result.periods.every(period => period.pending === 0));
});

test("sobrecarga cresce apesar de caixa suficiente, sem duplicar equipe", () => {
  const scenario = demandScenarios().overload;
  const result = simulateDemand(scenario);
  assert.equal(result.state.jobs.length, 24);
  assert.equal(result.periods.at(-1)?.pending, 12);
  assert.equal(result.state.teams.length, scenario.state.teams.length);
  const fund = result.state.funds.find(fund => fund.id === "rights-fund");
  const first = result.periods[0],
    last = result.periods.at(-1);
  assert.ok(fund && first && last);
  assert.ok(fund.balance > 0);
  assert.ok(last.oldestWaiting > first.oldestWaiting);
});

test("falta de caixa conserva casos; financiamento recupera fila quando há capacidade", () => {
  const { cashShortage, cashRecovery } = demandScenarios();
  const blocked = simulateDemand(cashShortage);
  const recovered = simulateDemand(cashRecovery);
  assert.equal(blocked.periods.at(-1)?.pending, 8);
  assert.equal(recovered.periods[7]?.pending, 4);
  assert.equal(recovered.periods.at(-1)?.pending, 0);
  assert.equal(recovered.state.jobs.length, 12);
  const fund = recovered.state.funds.find(item => item.id === "rights-fund");
  assert.ok(fund);
  assert.equal(fund.initial, 4);
  assert.equal(fund.spent, 12);
  assert.equal(
    recovered.state.receipts?.reduce((n, receipt) => n + receipt.amount, 0),
    8,
  );
});

test("redução declarada de entradas drena sobrecarga sem apagar obrigações", () => {
  const result = simulateDemand(demandScenarios().drain);
  assert.equal(result.periods[3]?.pending, 4);
  assert.equal(result.periods.at(-1)?.pending, 0);
  assert.equal(result.state.jobs.length, 8);
  assert.equal(result.state.jobs.filter(job => job.executionLeft === 0).length, 8);
});

test("simulação é imutável e o horizonte não oculta entradas agendadas", () => {
  const scenario = demandScenarios().steady;
  const saved = JSON.stringify(scenario);
  const result = simulateDemand(scenario);
  assert.equal(JSON.stringify(scenario), saved);
  assert.deepEqual(simulateDemand(JSON.parse(saved)), result);
  assert.throws(() => simulateDemand({ ...scenario, horizon: 11 }), new RegExp("calendário"));
});

test("retomar no período seis preserva calendário, recebimentos e a sequência inteira", () => {
  const scenario = demandScenarios().steady;
  const complete = simulateDemand(scenario);
  const first = simulateDemand({
    ...scenario,
    horizon: 6,
    arrivals: scenario.arrivals.filter(item => item.period <= 6),
    receipts: scenario.receipts.filter(item => item.period <= 6),
  });
  const resumed = simulateDemand({ ...scenario, state: JSON.parse(JSON.stringify(first.state)) });
  assert.deepEqual(resumed.state, complete.state);
  assert.deepEqual([...first.periods, ...resumed.periods], complete.periods);
  const missing = { ...first.state, jobs: first.state.jobs.slice(1) };
  assert.throws(() => simulateDemand({ ...scenario, state: missing }), new RegExp("calendário"));
});
