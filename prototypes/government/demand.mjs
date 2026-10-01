import { openingPilotGovernment } from "./pilot-cases.mjs";
import { openingPilotOperations } from "./operations-cases.mjs";
import { receiveWork, receiveFunding, runOperations } from "./operations.mjs";

/**
 * @typedef {import("./operations.mjs").OperationState} OperationState
 * @typedef {import("./operations.mjs").OperationJob} OperationJob
 * @typedef {import("./operations.mjs").OperationReceipt} OperationReceipt
 * @typedef {{government: import("./index.mjs").GovernmentState, state: OperationState, horizon: number, arrivals: {period: number, jobs: OperationJob[]}[], receipts: {period: number, receipt: OperationReceipt}[]}} DemandScenario
 */

/** @param {DemandScenario} scenario */
export function simulateDemand(scenario) {
  const { government, horizon } = scenario;
  if (
    !Number.isSafeInteger(horizon) ||
    horizon <= 0 ||
    horizon < scenario.state.period ||
    [...scenario.arrivals, ...scenario.receipts].some(
      item => !Number.isSafeInteger(item.period) || item.period < 1 || item.period > horizon,
    )
  )
    throw new Error("calendário de demanda inválido");
  let state = receiveWork(government, scenario.state, []);
  for (const entry of scenario.arrivals.filter(item => item.period <= state.period)) {
    for (const job of entry.jobs) {
      const recorded = state.jobs.find(item => item.id === job.id);
      if (
        !recorded ||
        recorded.receivedPeriod !== entry.period - 1 ||
        recorded.work !== job.work ||
        recorded.executor !== job.executor ||
        recorded.fund !== job.fund ||
        recorded.record !== job.record ||
        recorded.preparationTotal !== job.preparationTotal ||
        recorded.executionTotal !== job.executionTotal ||
        recorded.unitCost !== job.unitCost
      )
        throw new Error("calendário de demanda diverge do histórico");
    }
  }
  for (const entry of scenario.receipts.filter(item => item.period <= state.period)) {
    const recorded = state.receipts?.find(item => item.id === entry.receipt.id);
    if (
      !recorded ||
      recorded.fund !== entry.receipt.fund ||
      recorded.amount !== entry.receipt.amount ||
      recorded.source !== entry.receipt.source
    )
      throw new Error("calendário de recebimentos diverge do histórico");
  }
  const periods = [];
  for (let period = state.period + 1; period <= horizon; period++) {
    for (const item of scenario.receipts.filter(item => item.period === period))
      state = receiveFunding(government, state, item.receipt);
    const arrivals = scenario.arrivals
      .filter(item => item.period === period)
      .flatMap(item => item.jobs);
    state = receiveWork(government, state, arrivals);
    const priority = state.jobs
      .toSorted(
        (a, b) =>
          (a.receivedPeriod ?? 0) - (b.receivedPeriod ?? 0) ||
          (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
      )
      .map(job => job.id);
    const result = runOperations(government, state, priority);
    state = result.state;
    const pending = state.jobs.filter(job => job.executionLeft > 0);
    periods.push({
      period: state.period,
      arrived: arrivals.length,
      delivered: state.jobs.filter(job => job.executionLeft === 0).length,
      pending: pending.length,
      oldestWaiting: pending.reduce(
        (age, job) => Math.max(age, state.period - (job.receivedPeriod ?? 0)),
        0,
      ),
      waitingByWork: Object.fromEntries(
        government.inventory.map(work => [work, pending.filter(job => job.work === work).length]),
      ),
      spent: state.funds.reduce((sum, fund) => sum + fund.spent, 0),
      received: (state.receipts ?? []).reduce((sum, receipt) => sum + receipt.amount, 0),
      bottlenecks: result.pending,
    });
  }
  return { state, periods };
}

export function demandScenarios() {
  /** @param {number} rate @param {number} arrivalPeriods @param {number} capacity @param {number} credit @param {number} creditStart @returns {DemandScenario} */
  const scenario = (rate, arrivalPeriods, capacity, credit, creditStart) => {
    const state = openingPilotOperations();
    const template = state.jobs.find(job => job.work === "rights-intake");
    if (!template) throw new Error("trabalho sintético ausente");
    state.jobs = [];
    state.teams = state.teams.map(team =>
      team.id === "rights-coordination" || team.id === "rights-execution"
        ? { ...team, capacity }
        : team,
    );
    const horizon = 12;
    return {
      government: openingPilotGovernment(),
      state,
      horizon,
      arrivals: Array.from({ length: arrivalPeriods }, (_, i) => ({
        period: i + 1,
        jobs: Array.from({ length: rate }, (_, j) => ({
          ...template,
          id: `rights-${String(i + 1).padStart(2, "0")}-${j}`,
        })),
      })),
      receipts:
        credit > 0
          ? Array.from({ length: horizon - creditStart + 1 }, (_, i) => ({
              period: creditStart + i,
              receipt: {
                id: `credit-${creditStart + i}`,
                fund: "rights-fund",
                amount: credit,
                source: "financiamento externo sintético",
              },
            }))
          : [],
    };
  };
  return {
    steady: scenario(1, 12, 1, 1, 1),
    overload: scenario(2, 12, 1, 2, 1),
    cashShortage: scenario(1, 12, 2, 0, 1),
    cashRecovery: scenario(1, 12, 2, 2, 9),
    drain: scenario(2, 4, 1, 1, 1),
  };
}
