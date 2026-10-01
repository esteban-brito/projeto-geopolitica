/**
 * @typedef {import("./index.mjs").GovernmentState} Government
 * @typedef {{id: string, institution: string, kind: "coordination" | "execution", offices: string[], works: string[], capacity: number}} OperationTeam
 * @typedef {{id: string, institution: string, initial: number, balance: number, spent: number}} OperationFund
 * @typedef {{id: string, holders: string[]}} OperationRecord
 * @typedef {{id: string, work: string, executor: string, fund: string, record: string, preparationTotal: number, preparationLeft: number, executionTotal: number, executionLeft: number, unitCost: number, receivedPeriod?: number}} OperationJob
 * @typedef {{id: string, fund: string, amount: number, source: string}} OperationReceipt
 * @typedef {{id: string, team: string, from: string, to: string, mode: "move" | "share", effort: number, records: string[]}} HandoverOrder
 * @typedef {HandoverOrder & {left: number}} Handover
 * @typedef {{period: number, institutions: string[], teams: OperationTeam[], funds: OperationFund[], records: OperationRecord[], jobs: OperationJob[], handovers: Handover[], receipts?: OperationReceipt[]}} OperationState
 * @typedef {{id: string, team: string, effort: number}} CapacityReservation
 * @typedef {{job: string, team: string, stage: "consultation" | "handover" | "preparation" | "execution", units: number, cost: number}} OperationTrace
 * @typedef {{snapshot: OperationState | null, complete: boolean, source: string}} OperationKnowledge
 */

/** @param {number} n */
const natural = n => Number.isSafeInteger(n) && n >= 0;

/** @param {ReadonlyArray<string>} ids @param {string} label */
const unique = (ids, label) => {
  if (ids.some(id => !id) || new Set(ids).size !== ids.length)
    throw new Error(`${label}: identidade vazia ou repetida`);
};

/** @param {Government} government @param {OperationState} state */
function assertOperations(government, state) {
  if (!natural(state.period)) throw new Error("período inválido");
  unique(state.institutions, "instituições");
  unique(
    state.teams.map(item => item.id),
    "equipes",
  );
  unique(
    state.funds.map(item => item.id),
    "fundos",
  );
  unique(
    state.records.map(item => item.id),
    "registros",
  );
  unique(
    state.jobs.map(item => item.id),
    "trabalhos",
  );
  unique(
    state.handovers.map(item => item.id),
    "repasses",
  );
  const institutions = new Set(state.institutions);
  const works = new Set(government.inventory);
  const actors = new Set([
    ...Object.keys(government.offices).map(id => `office:${id}`),
    ...state.institutions.map(id => `institution:${id}`),
  ]);
  const receipts = state.receipts ?? [];
  unique(
    receipts.map(item => item.id),
    "recebimentos",
  );
  for (const receipt of receipts) {
    if (
      !state.funds.some(fund => fund.id === receipt.fund) ||
      !natural(receipt.amount) ||
      receipt.amount === 0 ||
      !receipt.source.trim()
    )
      throw new Error(`recebimento inválido: ${receipt.id}`);
  }
  for (const team of state.teams) {
    unique(team.offices, "pastas da equipe");
    unique(team.works, "trabalhos da equipe");
    if (
      !institutions.has(team.institution) ||
      !natural(team.capacity) ||
      team.works.some(id => !works.has(id)) ||
      team.offices.some(id => !government.offices[id]) ||
      (team.kind === "execution" && team.offices.length > 0) ||
      (team.kind !== "coordination" && team.kind !== "execution")
    )
      throw new Error(`equipe inválida: ${team.id}`);
  }
  for (const fund of state.funds) {
    const available =
      fund.initial +
      receipts
        .filter(item => item.fund === fund.id)
        .reduce((sum, receipt) => sum + receipt.amount, 0);
    if (
      !institutions.has(fund.institution) ||
      ![fund.initial, fund.balance, fund.spent].every(natural) ||
      !natural(available) ||
      fund.balance + fund.spent !== available
    )
      throw new Error(`fundo não reconciliado: ${fund.id}`);
  }
  for (const record of state.records) {
    unique(record.holders, "acessos");
    if (record.holders.some(id => !actors.has(id)))
      throw new Error(`acesso desconhecido: ${record.id}`);
  }
  for (const job of state.jobs) {
    const fund = state.funds.find(item => item.id === job.fund);
    if (
      !works.has(job.work) ||
      !government.offices[government.owner[job.work] ?? ""]?.active ||
      !institutions.has(job.executor) ||
      fund?.institution !== job.executor ||
      !state.records.some(item => item.id === job.record) ||
      ![
        job.preparationTotal,
        job.preparationLeft,
        job.executionTotal,
        job.executionLeft,
        job.unitCost,
      ].every(natural) ||
      job.executionTotal === 0 ||
      job.preparationLeft > job.preparationTotal ||
      job.executionLeft > job.executionTotal ||
      (job.receivedPeriod !== undefined &&
        (!natural(job.receivedPeriod) || job.receivedPeriod > state.period)) ||
      (job.preparationLeft > 0 && job.executionLeft < job.executionTotal)
    )
      throw new Error(`trabalho inválido: ${job.id}`);
  }
  const busy = new Set();
  for (const handover of state.handovers) {
    const team = state.teams.find(item => item.id === handover.team);
    unique(handover.records, "registros do repasse");
    if (
      !team ||
      team.kind !== "coordination" ||
      !government.offices[handover.from] ||
      !government.offices[handover.to] ||
      handover.from === handover.to ||
      !natural(handover.effort) ||
      handover.effort === 0 ||
      !natural(handover.left) ||
      handover.left > handover.effort ||
      (handover.mode !== "move" && handover.mode !== "share") ||
      handover.records.some(id => !state.records.some(item => item.id === id))
    )
      throw new Error(`repasse inválido: ${handover.id}`);
    if (handover.left > 0) {
      if (busy.has(team.id) || !team.offices.includes(handover.from))
        throw new Error(`equipe com repasse conflitante: ${team.id}`);
      busy.add(team.id);
      if (
        handover.records.some(
          id =>
            !state.records
              .find(item => item.id === id)
              ?.holders.includes(`office:${handover.from}`),
        )
      )
        throw new Error(`repasse sem acesso de origem: ${handover.id}`);
    }
  }
}

/** @param {Government} government @param {OperationState} state @param {ReadonlyArray<OperationJob>} arrivals @returns {OperationState} */
export function receiveWork(government, state, arrivals) {
  assertOperations(government, state);
  if (
    arrivals.some(
      job =>
        job.preparationLeft !== job.preparationTotal || job.executionLeft !== job.executionTotal,
    )
  )
    throw new Error("nova obrigação exige esforço inicial íntegro");
  const next = {
    ...state,
    jobs: [...state.jobs, ...arrivals.map(job => ({ ...job, receivedPeriod: state.period }))],
  };
  assertOperations(government, next);
  return next;
}

/** @param {Government} government @param {OperationState} state @param {OperationReceipt} receipt @returns {OperationState} */
export function receiveFunding(government, state, receipt) {
  assertOperations(government, state);
  const next = {
    ...state,
    funds: state.funds.map(fund =>
      fund.id === receipt.fund ? { ...fund, balance: fund.balance + receipt.amount } : fund,
    ),
    receipts: [...(state.receipts ?? []), { ...receipt }],
  };
  assertOperations(government, next);
  return next;
}

/** @param {Government} government @param {OperationState} state @param {HandoverOrder} order @returns {OperationState} */
export function queueHandover(government, state, order) {
  assertOperations(government, state);
  const next = {
    ...state,
    handovers: [...state.handovers, { ...order, records: [...order.records], left: order.effort }],
  };
  assertOperations(government, next);
  return next;
}

/** @param {OperationState} state @returns {OperationState} */
function copyOperations(state) {
  return {
    ...state,
    teams: state.teams.map(team => ({
      ...team,
      offices: [...team.offices],
      works: [...team.works],
    })),
    funds: state.funds.map(fund => ({ ...fund })),
    records: state.records.map(record => ({ ...record, holders: [...record.holders] })),
    jobs: state.jobs.map(job => ({ ...job })),
    handovers: state.handovers.map(item => ({ ...item, records: [...item.records] })),
  };
}

/** @param {Government} government @param {OperationState} state @param {ReadonlyArray<string>} priority @param {ReadonlyArray<CapacityReservation>} reservations */
export function runOperations(government, state, priority, reservations = []) {
  assertOperations(government, state);
  if (
    priority.length !== state.jobs.length ||
    new Set(priority).size !== priority.length ||
    priority.some(id => !state.jobs.some(job => job.id === id))
  )
    throw new Error("prioridade precisa listar cada trabalho uma vez");
  if (!natural(state.period + 1)) throw new Error("período fora da faixa");
  unique(
    reservations.map(item => item.id),
    "consultas",
  );
  for (const item of reservations) {
    if (
      !state.teams.some(team => team.id === item.team && team.kind === "coordination") ||
      !natural(item.effort) ||
      item.effort === 0 ||
      state.jobs.some(job => job.id === item.id) ||
      state.handovers.some(handover => handover.id === item.id)
    )
      throw new Error(`reserva de equipe inválida: ${item.id}`);
  }
  const next = copyOperations(state);
  const available = new Map(next.teams.map(team => [team.id, team.capacity]));
  /** @type {OperationTrace[]} */
  const trace = [];
  const remainingReservations = reservations.map(item => {
    const units = Math.min(item.effort, available.get(item.team) ?? 0);
    available.set(item.team, (available.get(item.team) ?? 0) - units);
    if (units > 0)
      trace.push({ job: item.id, team: item.team, stage: "consultation", units, cost: 0 });
    return { ...item, effort: item.effort - units };
  });
  for (const handover of next.handovers) {
    if (handover.left === 0) continue;
    const team = next.teams.find(item => item.id === handover.team);
    if (!team) throw new Error("equipe do repasse ausente");
    const units = Math.min(handover.left, available.get(team.id) ?? 0);
    handover.left -= units;
    available.set(team.id, (available.get(team.id) ?? 0) - units);
    if (units > 0)
      trace.push({ job: handover.id, team: team.id, stage: "handover", units, cost: 0 });
    if (handover.left === 0) {
      const offices =
        handover.mode === "move" ? team.offices.filter(id => id !== handover.from) : team.offices;
      team.offices = [...new Set([...offices, handover.to])];
      for (const id of handover.records) {
        const record = next.records.find(item => item.id === id);
        if (!record) throw new Error("registro do repasse ausente");
        record.holders = [...new Set([...record.holders, `office:${handover.to}`])];
      }
    }
  }
  /** @param {OperationJob} job @param {"preparation" | "execution"} stage */
  const eligibleTeams = (job, stage) =>
    next.teams
      .filter(
        team =>
          team.works.includes(job.work) &&
          (stage === "preparation"
            ? team.kind === "coordination" &&
              team.offices.includes(government.owner[job.work] ?? "")
            : team.kind === "execution" && team.institution === job.executor),
      )
      .toSorted((a, b) => a.id.localeCompare(b.id));
  /** @param {OperationJob} job @param {"preparation" | "execution"} stage */
  const hasInformation = (job, stage) =>
    next.records
      .find(item => item.id === job.record)
      ?.holders.includes(
        stage === "preparation"
          ? `office:${government.owner[job.work]}`
          : `institution:${job.executor}`,
      ) === true;
  for (const stage of /** @type {const} */ (["preparation", "execution"])) {
    for (const id of priority) {
      const job = next.jobs.find(item => item.id === id);
      if (!job) throw new Error("trabalho da prioridade ausente");
      if (
        (stage === "preparation" ? job.preparationLeft : job.executionLeft) === 0 ||
        (stage === "execution" && job.preparationLeft > 0) ||
        !hasInformation(job, stage)
      )
        continue;
      const fund = next.funds.find(item => item.id === job.fund);
      if (!fund) throw new Error("fundo do trabalho ausente");
      for (const team of eligibleTeams(job, stage)) {
        const left = stage === "preparation" ? job.preparationLeft : job.executionLeft;
        const affordable =
          stage === "execution" && job.unitCost > 0
            ? Math.floor(fund.balance / job.unitCost)
            : left;
        const units = Math.min(left, available.get(team.id) ?? 0, affordable);
        if (units === 0) continue;
        const cost = stage === "execution" ? units * job.unitCost : 0;
        if (stage === "preparation") job.preparationLeft -= units;
        else job.executionLeft -= units;
        fund.balance -= cost;
        fund.spent += cost;
        available.set(team.id, (available.get(team.id) ?? 0) - units);
        trace.push({ job: job.id, team: team.id, stage, units, cost });
      }
    }
  }
  const pending = next.jobs
    .filter(job => job.executionLeft > 0)
    .map(job => {
      const stage = job.preparationLeft > 0 ? "preparation" : "execution";
      const teams = eligibleTeams(job, stage);
      const fund = next.funds.find(item => item.id === job.fund);
      const reasons = [];
      if (!hasInformation(job, stage)) reasons.push("information");
      if (teams.length === 0) reasons.push("team");
      else if (teams.every(team => (available.get(team.id) ?? 0) === 0)) reasons.push("capacity");
      if (stage === "execution" && (fund?.balance ?? 0) < job.unitCost) reasons.push("funds");
      return { id: job.id, work: job.work, stage, reasons };
    });
  next.period++;
  assertOperations(government, next);
  return { state: next, trace, pending, remainingReservations };
}

/** @param {Government} government @param {OperationKnowledge} knowledge @param {ReadonlyArray<string>} priority @param {ReadonlyArray<CapacityReservation>} reservations */
export function forecastOperations(government, knowledge, priority, reservations = []) {
  if (!knowledge.complete || knowledge.snapshot === null)
    return { status: /** @type {const} */ ("unknown"), source: knowledge.source };
  return {
    status: /** @type {const} */ ("estimated"),
    source: knowledge.source,
    result: runOperations(government, knowledge.snapshot, priority, reservations),
  };
}
