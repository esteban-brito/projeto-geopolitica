import { assessOffice, assessWork } from "./pilot.mjs";
import { receiveWork, runOperations } from "./operations.mjs";

/**
 * @typedef {import("./index.mjs").GovernmentState} Government
 * @typedef {import("./pilot.mjs").PilotWork} Work
 * @typedef {import("./pilot.mjs").PilotPerson} Person
 * @typedef {import("./pilot.mjs").WorkAssessment} Assessment
 * @typedef {import("./pilot.mjs").Fit} Fit
 * @typedef {{id: string, team: string, work: string, effort: number}} AdviceRequest
 * @typedef {AdviceRequest & {office: string, left: number, adviser: string, assessment: Assessment}} Advice
 * @typedef {"goals-first" | "familiar-first"} ManagementMode
 * @typedef {{period: number, minister: string, mode: ManagementMode, priority: string[], usedAdvice: string[], trace: import("./operations.mjs").OperationTrace[]}} ManagementEntry
 * @typedef {{operations: import("./operations.mjs").OperationState, advice: Advice[], history: ManagementEntry[]}} ManagementState
 */

/** @param {Fit} fit */
const rank = fit => (fit === "direct" ? 0 : fit === "transferable" ? 1 : 2);

/** @param {Government} government @param {ManagementState} state @param {ReadonlyArray<Work>} works */
function assertManagement(government, state, works) {
  receiveWork(government, state.operations, []);
  const ids = new Set();
  for (const advice of state.advice) {
    if (!advice.id || ids.has(advice.id)) throw new Error("consulta vazia ou repetida");
    ids.add(advice.id);
    const team = state.operations.teams.find(item => item.id === advice.team);
    if (!team || team.kind !== "coordination" || !team.works.includes(advice.work))
      throw new Error("equipe da consulta incompatível");
    if (
      !works.some(work => work.id === advice.work) ||
      !government.offices[advice.office] ||
      !advice.adviser ||
      !Number.isSafeInteger(advice.effort) ||
      advice.effort <= 0 ||
      !Number.isSafeInteger(advice.left) ||
      advice.left < 0 ||
      advice.left > advice.effort ||
      advice.assessment.id !== advice.work ||
      !["direct", "transferable", "unproven", "unknown"].includes(advice.assessment.fit) ||
      (rank(advice.assessment.fit) < 2 && !advice.assessment.evidenceId) ||
      state.operations.jobs.some(job => job.id === advice.id) ||
      state.operations.handovers.some(handover => handover.id === advice.id)
    )
      throw new Error(`consulta inválida: ${advice.id}`);
  }
}

/** @param {Government} government @param {ManagementState} state @param {ReadonlyArray<Work>} works @param {Person} adviser @param {AdviceRequest} request @returns {ManagementState} */
export function queueAdvice(government, state, works, adviser, request) {
  assertManagement(government, state, works);
  const work = works.find(item => item.id === request.work);
  const office = government.owner[request.work];
  const team = state.operations.teams.find(item => item.id === request.team);
  if (!work || !office || !government.offices[office]?.active)
    throw new Error("trabalho da consulta ausente");
  if (!team?.offices.includes(office)) throw new Error("equipe sem vínculo com a pasta consultada");
  const next = {
    ...state,
    advice: [
      ...state.advice,
      {
        ...request,
        office,
        left: request.effort,
        adviser: adviser.id,
        assessment: assessWork(work, adviser),
      },
    ],
  };
  assertManagement(government, next, works);
  return next;
}

/** @param {Government} government @param {ManagementState} state @param {ReadonlyArray<Work>} works @param {Person} person @param {string} office @param {ReadonlyArray<string>} goals @param {ManagementMode} mode */
export function planManagement(government, state, works, person, office, goals, mode) {
  assertManagement(government, state, works);
  const personal = assessOffice(government, works, person, office).work;
  if (
    !["goals-first", "familiar-first"].includes(mode) ||
    goals.length !== personal.length ||
    new Set(goals).size !== goals.length ||
    goals.some(id => !personal.some(item => item.id === id))
  )
    throw new Error("prioridade precisa cobrir o trabalho real da pasta");
  const usedAdvice = new Set();
  const work = personal.map(assessment => {
    let effectiveFit = assessment.fit;
    for (const advice of state.advice) {
      if (
        advice.left !== 0 ||
        advice.office !== office ||
        advice.work !== assessment.id ||
        rank(advice.assessment.fit) >= 2
      )
        continue;
      usedAdvice.add(advice.id);
      if (rank(advice.assessment.fit) < rank(effectiveFit)) effectiveFit = advice.assessment.fit;
    }
    return { id: assessment.id, personal: assessment, effectiveFit };
  });
  const orderedWork = work.toSorted(
    (a, b) =>
      (mode === "familiar-first" ? rank(a.effectiveFit) - rank(b.effectiveFit) : 0) ||
      goals.indexOf(a.id) - goals.indexOf(b.id),
  );
  const priority = [
    ...orderedWork.flatMap(item =>
      state.operations.jobs.filter(job => job.work === item.id).map(job => job.id),
    ),
    ...state.operations.jobs.filter(job => !goals.includes(job.work)).map(job => job.id),
  ];
  return { work, priority, usedAdvice: [...usedAdvice].sort() };
}

/** @param {Government} government @param {ManagementState} state @param {ReadonlyArray<Work>} works @param {Person} person @param {string} office @param {ReadonlyArray<string>} goals @param {ManagementMode} mode */
export function runManagement(government, state, works, person, office, goals, mode) {
  const plan = planManagement(government, state, works, person, office, goals, mode);
  const reservations = state.advice
    .filter(item => item.left > 0)
    .map(item => ({ id: item.id, team: item.team, effort: item.left }));
  const execution = runOperations(government, state.operations, plan.priority, reservations);
  const advice = state.advice.map(item => {
    const remaining = execution.remainingReservations.find(
      reservation => reservation.id === item.id,
    );
    return remaining ? { ...item, left: remaining.effort } : item;
  });
  const entry = {
    period: execution.state.period,
    minister: person.id,
    mode,
    priority: [...plan.priority],
    usedAdvice: [...plan.usedAdvice],
    trace: execution.trace,
  };
  const next = { operations: execution.state, advice, history: [...state.history, entry] };
  assertManagement(government, next, works);
  return { state: next, plan, execution };
}
