import test from "node:test";
import assert from "node:assert/strict";
import { reformGovernment } from "../../prototypes/government/index.mjs";
import { openingPilotGovernment } from "../../prototypes/government/pilot-cases.mjs";
import {
  openingPilotOperations,
  OPERATION_PRIORITY,
  MANAGEMENT_PRIORITY,
  operationPlans,
} from "../../prototypes/government/operations-cases.mjs";
import {
  runOperations,
  queueHandover,
  forecastOperations,
} from "../../prototypes/government/operations.mjs";

/** @param {Parameters<typeof reformGovernment>[1]} command */
const reform = command => {
  const result = reformGovernment(openingPilotGovernment(), command);
  assert.ok(result.ok);
  return result.state;
};

/** @param {Parameters<typeof runOperations>[1]} state */
const completed = state => state.jobs.filter(job => job.executionLeft === 0).map(job => job.id);

test("trabalho executado consome caixa e capacidade, preservando IDs e a entrada", () => {
  const government = openingPilotGovernment();
  const state = openingPilotOperations();
  const saved = JSON.stringify(state);
  const result = runOperations(government, state, OPERATION_PRIORITY);
  assert.equal(JSON.stringify(state), saved);
  assert.deepEqual(
    result.state.jobs.map(job => job.id),
    state.jobs.map(job => job.id),
  );
  for (const fund of result.state.funds) assert.equal(fund.balance + fund.spent, fund.initial);
  for (const team of state.teams) {
    const used = result.trace
      .filter(item => item.team === team.id)
      .reduce((n, item) => n + item.units, 0);
    assert.ok(used <= team.capacity);
  }
  assert.ok(result.trace.some(item => item.stage === "execution" && item.cost > 0));
  assert.ok(result.state.jobs.some(job => job.executionLeft > 0));
});

test("o mesmo retrato conhecido produz previsão igual à execução; retrato incompleto não prevê", () => {
  const government = openingPilotGovernment();
  const snapshot = openingPilotOperations();
  const estimate = forecastOperations(
    government,
    { snapshot, complete: true, source: "ensaio" },
    OPERATION_PRIORITY,
  );
  assert.equal(estimate.status, "estimated");
  if (estimate.status === "estimated")
    assert.deepEqual(estimate.result, runOperations(government, snapshot, OPERATION_PRIORITY));
  assert.deepEqual(
    forecastOperations(
      government,
      { snapshot, complete: false, source: "registro parcial" },
      OPERATION_PRIORITY,
    ),
    { status: "unknown", source: "registro parcial" },
  );
  assert.deepEqual(
    forecastOperations(
      government,
      { snapshot: null, complete: false, source: "sem registro" },
      OPERATION_PRIORITY,
    ),
    { status: "unknown", source: "sem registro" },
  );
});

test("nome de pasta e currículo não fabricam execução", () => {
  const state = openingPilotOperations();
  const renamed = reform({ type: "rename", office: "health", label: "Saúde Digital Avançada" });
  assert.deepEqual(
    runOperations(renamed, state, OPERATION_PRIORITY),
    runOperations(openingPilotGovernment(), state, OPERATION_PRIORITY),
  );
  const plans = operationPlans();
  assert.deepEqual(plans.keep.operations, openingPilotOperations());
});

test("trocar condução não transfere acesso nem equipe; caso já coordenado continua", () => {
  const government = reform({ type: "merge", into: "education", from: "human-rights" });
  const state = openingPilotOperations();
  const intake = state.jobs.find(job => job.work === "rights-intake");
  assert.ok(intake);
  intake.preparationLeft = 0;
  const result = runOperations(government, state, OPERATION_PRIORITY);
  assert.ok(completed(result.state).includes(intake.id));
  assert.ok(
    result.pending.find(item => item.work === "rights-followup")?.reasons.includes("information"),
  );
  assert.deepEqual(result.state.teams, state.teams);
});

test("repasse usa capacidade e concede somente os registros explicitamente incluídos", () => {
  const government = reform({ type: "merge", into: "education", from: "human-rights" });
  const state = queueHandover(government, openingPilotOperations(), {
    id: "transfer",
    team: "rights-coordination",
    from: "human-rights",
    to: "education",
    mode: "move",
    effort: 2,
    records: ["rights-cases-record"],
  });
  const first = runOperations(government, state, OPERATION_PRIORITY);
  assert.equal(first.state.handovers[0]?.left, 1);
  assert.ok(
    !first.state.records
      .find(item => item.id === "rights-cases-record")
      ?.holders.includes("office:education"),
  );
  const second = runOperations(government, first.state, OPERATION_PRIORITY);
  assert.equal(second.state.handovers[0]?.left, 0);
  assert.deepEqual(second.state.teams.find(item => item.id === "rights-coordination")?.offices, [
    "education",
  ]);
  assert.ok(
    second.state.records
      .find(item => item.id === "rights-cases-record")
      ?.holders.includes("office:education"),
  );
  assert.ok(
    !second.trace.some(item => item.team === "rights-coordination" && item.stage === "preparation"),
  );
  assert.deepEqual(
    second.state.funds.map(item => item.id),
    state.funds.map(item => item.id),
  );
});

test("compartilhar equipe entre pastas conserva uma capacidade e disputa de prioridade", () => {
  const government = reform({ type: "transfer", competency: "rights-education", to: "education" });
  const state = queueHandover(government, openingPilotOperations(), {
    id: "share",
    team: "rights-coordination",
    from: "human-rights",
    to: "education",
    mode: "share",
    effort: 1,
    records: ["rights-education-record"],
  });
  state.teams = state.teams.filter(team => team.id !== "education-coordination");
  const shared = runOperations(government, state, OPERATION_PRIORITY).state;
  assert.deepEqual(shared.teams.find(team => team.id === "rights-coordination")?.offices, [
    "human-rights",
    "education",
  ]);
  const result = runOperations(government, shared, OPERATION_PRIORITY);
  assert.equal(
    result.trace
      .filter(item => item.team === "rights-coordination")
      .reduce((n, item) => n + item.units, 0),
    1,
  );
  assert.equal(result.pending.find(item => item.work === "rights-education")?.stage, "preparation");
});

test("caixa insuficiente limita entrega sem apagar obrigação nem gastar abaixo de zero", () => {
  const state = openingPilotOperations();
  const fund = state.funds.find(item => item.id === "rights-fund");
  assert.ok(fund);
  fund.balance = 0;
  fund.spent = fund.initial;
  const result = runOperations(openingPilotGovernment(), state, OPERATION_PRIORITY);
  const job = result.state.jobs.find(item => item.work === "rights-intake");
  assert.equal(job?.executionLeft, 1);
  assert.ok(result.pending.find(item => item.work === "rights-intake")?.reasons.includes("funds"));
  assert.equal(result.state.jobs.length, state.jobs.length);
});

test("trabalho parcial preserva saldo de esforço e espera caixa para terminar", () => {
  const state = openingPilotOperations();
  const job = state.jobs.find(item => item.work === "rights-intake");
  const team = state.teams.find(item => item.id === "rights-execution");
  const fund = state.funds.find(item => item.id === "rights-fund");
  assert.ok(job && team && fund);
  Object.assign(job, {
    preparationTotal: 2,
    preparationLeft: 2,
    executionTotal: 3,
    executionLeft: 3,
    unitCost: 2,
  });
  team.capacity = 2;
  fund.initial = 3;
  fund.balance = 3;
  const government = openingPilotGovernment();
  const first = runOperations(government, state, OPERATION_PRIORITY);
  assert.equal(first.state.jobs.find(item => item.id === job.id)?.preparationLeft, 1);
  assert.equal(first.state.jobs.find(item => item.id === job.id)?.executionLeft, 3);
  const second = runOperations(government, first.state, OPERATION_PRIORITY);
  assert.equal(second.state.jobs.find(item => item.id === job.id)?.executionLeft, 2);
  const third = runOperations(government, second.state, OPERATION_PRIORITY);
  assert.equal(third.state.jobs.find(item => item.id === job.id)?.executionLeft, 2);
  assert.ok(third.pending.find(item => item.id === job.id)?.reasons.includes("funds"));
  assert.equal(
    second.trace.filter(item => item.job === job.id).reduce((n, item) => n + item.cost, 0),
    2,
  );
});

test("acesso do ministro não substitui acesso do executor", () => {
  const state = openingPilotOperations();
  const record = state.records.find(item => item.id === "rights-cases-record");
  assert.ok(record);
  record.holders = ["office:human-rights"];
  const result = runOperations(openingPilotGovernment(), state, OPERATION_PRIORITY);
  assert.ok(
    result.pending.find(item => item.work === "rights-intake")?.reasons.includes("information"),
  );
  assert.equal(result.state.jobs.find(item => item.work === "rights-intake")?.preparationLeft, 0);
  assert.equal(result.state.jobs.find(item => item.work === "rights-intake")?.executionLeft, 1);
});

test("fusão tem ganho educativo e atraso de casos no mesmo período, sem soma esconder a troca", () => {
  const { keep, merge } = operationPlans();
  const baseline = runOperations(keep.government, keep.operations, OPERATION_PRIORITY);
  const changed = runOperations(merge.government, merge.operations, OPERATION_PRIORITY);
  assert.ok(completed(baseline.state).includes("job-rights-intake"));
  assert.ok(!completed(changed.state).includes("job-rights-intake"));
  assert.ok(!completed(baseline.state).includes("job-rights-education"));
  assert.ok(completed(changed.state).includes("job-rights-education"));
});

test("pasta digital ganha foco remanejando equipe e deixa outros trabalhos da Saúde na fila", () => {
  const { keep, digital } = operationPlans();
  const twice = (/** @type {typeof keep} */ plan) => {
    const first = runOperations(plan.government, plan.operations, OPERATION_PRIORITY);
    return runOperations(plan.government, first.state, OPERATION_PRIORITY);
  };
  const baseline = twice(keep),
    changed = twice(digital);
  assert.ok(completed(changed.state).includes("job-health-information"));
  assert.ok(!completed(baseline.state).includes("job-health-information"));
  assert.ok(!completed(changed.state).includes("job-health-federation"));
  assert.ok(completed(baseline.state).includes("job-health-federation"));
  assert.deepEqual(
    changed.state.teams.map(item => item.id),
    baseline.state.teams.map(item => item.id),
  );
  assert.deepEqual(
    changed.state.funds.map(item => item.initial),
    baseline.state.funds.map(item => item.initial),
  );
});

test("gestão pode antecipar informação sem criar pasta, equipe ou gasto de transição", () => {
  const { keep, digital } = operationPlans();
  const baseline = runOperations(keep.government, keep.operations, MANAGEMENT_PRIORITY);
  const reform = runOperations(digital.government, digital.operations, OPERATION_PRIORITY);
  assert.ok(completed(baseline.state).includes("job-health-information"));
  assert.ok(!completed(reform.state).includes("job-health-information"));
  assert.ok(!baseline.trace.some(item => item.stage === "handover"));
  assert.deepEqual(
    baseline.state.teams.map(item => item.id),
    keep.operations.teams.map(item => item.id),
  );
});

test("redistribuição conserva casos e mantém executores; recarga refaz a mesma sequência", () => {
  const { abolish } = operationPlans();
  let state = abolish.operations;
  for (let i = 0; i < 5; i++) {
    const result = runOperations(abolish.government, state, OPERATION_PRIORITY);
    assert.deepEqual(
      runOperations(abolish.government, JSON.parse(JSON.stringify(state)), OPERATION_PRIORITY),
      result,
    );
    state = result.state;
  }
  assert.equal(completed(state).length, state.jobs.length);
  assert.deepEqual(
    state.jobs.map(job => job.executor),
    abolish.operations.jobs.map(job => job.executor),
  );
  assert.deepEqual(
    state.jobs.map(job => job.id),
    abolish.operations.jobs.map(job => job.id),
  );
});

test("corrigir a fusão não restaura caixa ou entregas de um snapshot antigo", () => {
  const { merge } = operationPlans();
  let state = runOperations(merge.government, merge.operations, OPERATION_PRIORITY).state;
  const inverse = reformGovernment(merge.government, {
    type: "splitMerge",
    into: "education",
    from: "human-rights",
  });
  assert.ok(inverse.ok);
  const spent = state.funds.reduce((n, fund) => n + fund.spent, 0);
  state = runOperations(inverse.state, state, OPERATION_PRIORITY).state;
  assert.ok(state.funds.reduce((n, fund) => n + fund.spent, 0) >= spent);
  assert.ok(completed(state).includes("job-rights-education"));
});

test("inventário inválido, ordem ambígua e repasse sem fonte não viram capacidade", () => {
  const government = openingPilotGovernment();
  const state = openingPilotOperations();
  const firstTeam = state.teams[0];
  assert.ok(firstTeam);
  assert.throws(
    () =>
      runOperations(
        government,
        { ...state, teams: [...state.teams, firstTeam] },
        OPERATION_PRIORITY,
      ),
    /repetid/,
  );
  assert.throws(
    () => runOperations(government, state, [...OPERATION_PRIORITY, OPERATION_PRIORITY[0]]),
    /prioridade/,
  );
  assert.throws(
    () =>
      runOperations(
        government,
        { ...state, funds: state.funds.map(item => ({ ...item, balance: item.balance + 1 })) },
        OPERATION_PRIORITY,
      ),
    /fundo/,
  );
  assert.throws(
    () =>
      queueHandover(government, state, {
        id: "bad",
        team: "rights-coordination",
        from: "human-rights",
        to: "health",
        mode: "share",
        effort: 1,
        records: ["health-record"],
      }),
    /acesso/,
  );
});

test("corrigir a pasta digital compartilha a equipe existente e recupera a fila sem reembolso", () => {
  const { digital } = operationPlans();
  let state = digital.operations;
  for (let i = 0; i < 2; i++)
    state = runOperations(digital.government, state, OPERATION_PRIORITY).state;
  const spent = state.funds.reduce((n, fund) => n + fund.spent, 0);
  state = queueHandover(digital.government, state, {
    id: "digital-recovery",
    team: "health-coordination",
    from: "ministry-1",
    to: "health",
    mode: "share",
    effort: 1,
    records: ["health-record"],
  });
  for (let i = 0; i < 3; i++)
    state = runOperations(digital.government, state, OPERATION_PRIORITY).state;
  assert.equal(completed(state).length, 7);
  assert.ok(state.funds.reduce((n, fund) => n + fund.spent, 0) > spent);
  assert.equal(state.teams.filter(team => team.id === "health-coordination").length, 1);
});

test("repasse pendente não pode ser duplicado nem alcançar informação sem acesso de origem", () => {
  const government = openingPilotGovernment();
  const order = {
    id: "handover",
    team: "rights-coordination",
    from: "human-rights",
    to: "education",
    mode: /** @type {const} */ ("share"),
    effort: 1,
    records: ["rights-cases-record"],
  };
  const before = openingPilotOperations();
  const saved = JSON.stringify(before);
  const state = queueHandover(government, before, order);
  assert.equal(JSON.stringify(before), saved);
  assert.throws(() => queueHandover(government, state, order), /repetid/);
  assert.throws(() => queueHandover(government, state, { ...order, id: "second" }), /conflitante/);
});
