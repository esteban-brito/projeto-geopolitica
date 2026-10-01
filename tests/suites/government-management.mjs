import test from "node:test";
import assert from "node:assert/strict";
import {
  openingPilotGovernment,
  PILOT_WORK,
  PILOT_PEOPLE,
} from "../../prototypes/government/pilot-cases.mjs";
import { openingPilotOperations } from "../../prototypes/government/operations-cases.mjs";
import { reformGovernment } from "../../prototypes/government/index.mjs";
import { forecastOperations, queueHandover } from "../../prototypes/government/operations.mjs";
import { queueAdvice, runManagement } from "../../prototypes/government/management.mjs";

const goals = ["rights-intake", "rights-followup", "rights-education"];
/** @returns {import("../../prototypes/government/management.mjs").ManagementState} */
const opening = () => ({ operations: openingPilotOperations(), advice: [], history: [] });
/** @param {import("../../prototypes/government/management.mjs").ManagementState} state */
const delivered = state =>
  state.operations.jobs.filter(job => job.executionLeft === 0).map(job => job.work);

test("mesma agenda delegada muda prioridade pela experiência, sem fabricar capacidade", () => {
  const government = openingPilotGovernment(),
    state = opening();
  // Controle sintético com o mesmo executor e fundo nas duas alternativas.
  state.operations.jobs = state.operations.jobs.map(job =>
    job.work === "rights-education"
      ? { ...job, executor: "rights-ombudsman", fund: "rights-fund" }
      : job,
  );
  state.operations.teams = state.operations.teams.map(team =>
    team.id === "rights-execution" ? { ...team, works: [...team.works, "rights-education"] } : team,
  );
  state.operations.records = state.operations.records.map(record =>
    record.id === "rights-education-record"
      ? { ...record, holders: [...record.holders, "institution:rights-ombudsman"] }
      : record,
  );
  const intake = runManagement(
    government,
    state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsOmbudsman,
    "human-rights",
    goals,
    "familiar-first",
  );
  const education = runManagement(
    government,
    state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "familiar-first",
  );
  assert.ok(delivered(intake.state).includes("rights-intake"));
  assert.ok(!delivered(education.state).includes("rights-intake"));
  assert.ok(delivered(education.state).includes("rights-education"));
  assert.deepEqual(intake.state.operations.teams, education.state.operations.teams);
  assert.deepEqual(intake.state.operations.funds, education.state.operations.funds);
});

test("consultas concorrentes e repasse dividem capacidade; previsão usa a mesma reserva", () => {
  const government = openingPilotGovernment();
  let state = opening();
  state.operations = queueHandover(government, state.operations, {
    id: "share-rights",
    team: "rights-coordination",
    from: "human-rights",
    to: "education",
    mode: "share",
    effort: 1,
    records: [],
  });
  for (const id of ["first-memo", "second-memo"])
    state = queueAdvice(government, state, PILOT_WORK, PILOT_PEOPLE.rightsOmbudsman, {
      id,
      team: "rights-coordination",
      work: "rights-intake",
      effort: 1,
    });
  const first = runManagement(
    government,
    state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "familiar-first",
  );
  assert.deepEqual(
    first.state.advice.map(item => item.left),
    [0, 1],
  );
  assert.equal(first.state.operations.handovers[0]?.left, 1);
  assert.equal(
    first.execution.trace
      .filter(item => item.team === "rights-coordination")
      .reduce((sum, item) => sum + item.units, 0),
    1,
  );
  const forecast = forecastOperations(
    government,
    { snapshot: state.operations, complete: true, source: "fixture" },
    first.plan.priority,
    state.advice.map(item => ({ id: item.id, team: item.team, effort: item.left })),
  );
  assert.equal(forecast.status, "estimated");
  assert.deepEqual(forecast.result, first.execution);
  const second = runManagement(
    government,
    first.state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "familiar-first",
  );
  assert.deepEqual(
    second.state.advice.map(item => item.left),
    [0, 0],
  );
  assert.equal(second.state.operations.handovers[0]?.left, 1);
  const third = runManagement(
    government,
    second.state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "familiar-first",
  );
  assert.equal(third.state.operations.handovers[0]?.left, 0);
  assert.ok(!delivered(third.state).some(work => goals.includes(work)));
});

test("ordem presidencial permite ao ministro sem evidência priorizar atendimento", () => {
  const government = openingPilotGovernment(),
    state = opening();
  const result = runManagement(
    government,
    state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "goals-first",
  );
  assert.ok(delivered(result.state).includes("rights-intake"));
  assert.equal(
    result.plan.work.find(item => item.id === "rights-intake")?.personal.fit,
    "unproven",
  );
});

test("parecer ocupa a equipe; só altera a próxima agenda e não reescreve currículo", () => {
  const government = openingPilotGovernment();
  const state = queueAdvice(government, opening(), PILOT_WORK, PILOT_PEOPLE.rightsOmbudsman, {
    id: "advice-intake",
    team: "rights-coordination",
    work: "rights-intake",
    effort: 1,
  });
  const first = runManagement(
    government,
    state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "familiar-first",
  );
  assert.ok(!delivered(first.state).some(work => goals.includes(work)));
  assert.deepEqual(first.plan.usedAdvice, []);
  assert.equal(first.state.advice[0]?.left, 0);
  const second = runManagement(
    government,
    first.state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "familiar-first",
  );
  assert.ok(delivered(second.state).includes("rights-intake"));
  assert.deepEqual(second.plan.usedAdvice, ["advice-intake"]);
  assert.equal(
    second.plan.work.find(item => item.id === "rights-intake")?.personal.fit,
    "unproven",
  );
  assert.equal(second.plan.work.find(item => item.id === "rights-intake")?.effectiveFit, "direct");
  assert.ok(!second.execution.trace.some(item => item.stage === "consultation"));
});

test("consulta longa preserva esforço restante, fonte e recarga", () => {
  const government = openingPilotGovernment();
  let state = queueAdvice(government, opening(), PILOT_WORK, PILOT_PEOPLE.rightsOmbudsman, {
    id: "long",
    team: "rights-coordination",
    work: "rights-intake",
    effort: 2,
  });
  for (let i = 0; i < 3; i++) {
    const saved = JSON.stringify(state);
    const result = runManagement(
      government,
      state,
      PILOT_WORK,
      PILOT_PEOPLE.rightsEducator,
      "human-rights",
      goals,
      "familiar-first",
    );
    assert.equal(JSON.stringify(state), saved);
    assert.deepEqual(
      runManagement(
        government,
        JSON.parse(saved),
        PILOT_WORK,
        PILOT_PEOPLE.rightsEducator,
        "human-rights",
        goals,
        "familiar-first",
      ),
      result,
    );
    if (i === 0) assert.equal(result.state.advice[0]?.left, 1);
    if (i === 1) assert.deepEqual(result.plan.usedAdvice, []);
    state = result.state;
  }
  assert.equal(state.advice[0]?.assessment.evidenceId, "intake");
  assert.ok(delivered(state).includes("rights-intake"));
});

test("consulta sem evidência compatível consome esforço e não inventa apoio", () => {
  const government = openingPilotGovernment();
  const state = queueAdvice(government, opening(), PILOT_WORK, PILOT_PEOPLE.rightsEducator, {
    id: "irrelevant",
    team: "rights-coordination",
    work: "rights-intake",
    effort: 1,
  });
  const first = runManagement(
    government,
    state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "familiar-first",
  );
  const second = runManagement(
    government,
    first.state,
    PILOT_WORK,
    PILOT_PEOPLE.rightsEducator,
    "human-rights",
    goals,
    "familiar-first",
  );
  assert.deepEqual(second.plan.usedAdvice, []);
  assert.ok(delivered(second.state).includes("rights-education"));
});

test("parecer e agenda não mudam por título, nome da pasta ou episódios ocultos", () => {
  const government = openingPilotGovernment();
  const renamed = reformGovernment(government, {
    type: "rename",
    office: "human-rights",
    label: "Saúde e Defesa",
  });
  assert.ok(renamed.ok);
  const person = PILOT_PEOPLE.rightsEducator;
  const episode = PILOT_PEOPLE.rightsOmbudsman.episodes[0];
  assert.ok(episode);
  const hidden = { ...person, episodes: [...person.episodes, { ...episode, known: false }] };
  const baseline = runManagement(
    government,
    opening(),
    PILOT_WORK,
    person,
    "human-rights",
    goals,
    "familiar-first",
  );
  assert.deepEqual(
    runManagement(
      renamed.state,
      opening(),
      PILOT_WORK,
      hidden,
      "human-rights",
      goals,
      "familiar-first",
    ),
    baseline,
  );
});

test("consulta não se duplica e prioridade deve cobrir o trabalho real da pasta", () => {
  const government = openingPilotGovernment();
  const request = { id: "memo", team: "rights-coordination", work: "rights-intake", effort: 1 };
  const state = queueAdvice(
    government,
    opening(),
    PILOT_WORK,
    PILOT_PEOPLE.rightsOmbudsman,
    request,
  );
  assert.throws(
    () => queueAdvice(government, state, PILOT_WORK, PILOT_PEOPLE.rightsOmbudsman, request),
    /repetid/,
  );
  assert.throws(
    () =>
      runManagement(
        government,
        opening(),
        PILOT_WORK,
        PILOT_PEOPLE.rightsEducator,
        "human-rights",
        goals.slice(1),
        "familiar-first",
      ),
    /prioridade/,
  );
  assert.throws(
    () =>
      queueAdvice(government, opening(), PILOT_WORK, PILOT_PEOPLE.rightsOmbudsman, {
        ...request,
        team: "missing",
      }),
    /equipe/,
  );
});
