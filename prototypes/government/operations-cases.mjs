import { reformGovernment } from "./index.mjs";
import { PILOT_WORK, openingPilotGovernment } from "./pilot-cases.mjs";
import { queueHandover } from "./operations.mjs";

/** @type {Readonly<[string, string, string, string, string, string, string]>} */
export const OPERATION_PRIORITY = [
  "job-rights-intake",
  "job-rights-followup",
  "job-rights-education",
  "job-health-federation",
  "job-sanitary-policy",
  "job-health-information",
  "job-defense-policy",
];

export const MANAGEMENT_PRIORITY = [
  "job-health-information",
  ...OPERATION_PRIORITY.filter(id => id !== "job-health-information"),
];

/** @returns {import("./operations.mjs").OperationState} */
export function openingPilotOperations() {
  const rights = ["rights-intake", "rights-followup", "rights-education"];
  const health = ["health-federation", "sanitary-policy", "health-information"];
  /** @type {Record<string, {institution: string, fund: string, record: string}>} */
  const executors = {
    "rights-intake": {
      institution: "rights-ombudsman",
      fund: "rights-fund",
      record: "rights-cases-record",
    },
    "rights-followup": {
      institution: "rights-ombudsman",
      fund: "rights-fund",
      record: "rights-cases-record",
    },
    "rights-education": {
      institution: "rights-education-network",
      fund: "education-fund",
      record: "rights-education-record",
    },
    "health-federation": {
      institution: "health-administration",
      fund: "health-fund",
      record: "health-record",
    },
    "sanitary-policy": {
      institution: "health-administration",
      fund: "health-fund",
      record: "health-record",
    },
    "health-information": {
      institution: "health-administration",
      fund: "health-fund",
      record: "health-record",
    },
    "defense-policy": {
      institution: "defense-administration",
      fund: "defense-fund",
      record: "defense-record",
    },
  };
  const institutions = [
    "rights-administration",
    "rights-ombudsman",
    "rights-education-network",
    "health-administration",
    "defense-administration",
    "education-administration",
  ];
  return {
    period: 0,
    institutions,
    teams: [
      {
        id: "rights-coordination",
        institution: "rights-administration",
        kind: "coordination",
        offices: ["human-rights"],
        works: rights,
        capacity: 1,
      },
      {
        id: "education-coordination",
        institution: "education-administration",
        kind: "coordination",
        offices: ["education"],
        works: ["rights-education"],
        capacity: 1,
      },
      {
        id: "health-coordination",
        institution: "health-administration",
        kind: "coordination",
        offices: ["health"],
        works: health,
        capacity: 1,
      },
      {
        id: "defense-coordination",
        institution: "defense-administration",
        kind: "coordination",
        offices: ["defense"],
        works: ["defense-policy"],
        capacity: 1,
      },
      {
        id: "rights-execution",
        institution: "rights-ombudsman",
        kind: "execution",
        offices: [],
        works: ["rights-intake", "rights-followup"],
        capacity: 1,
      },
      {
        id: "education-execution",
        institution: "rights-education-network",
        kind: "execution",
        offices: [],
        works: ["rights-education"],
        capacity: 1,
      },
      {
        id: "health-execution",
        institution: "health-administration",
        kind: "execution",
        offices: [],
        works: health,
        capacity: 1,
      },
      {
        id: "defense-execution",
        institution: "defense-administration",
        kind: "execution",
        offices: [],
        works: ["defense-policy"],
        capacity: 1,
      },
    ],
    funds: [
      { id: "rights-fund", institution: "rights-ombudsman", initial: 4, balance: 4, spent: 0 },
      {
        id: "education-fund",
        institution: "rights-education-network",
        initial: 2,
        balance: 2,
        spent: 0,
      },
      { id: "health-fund", institution: "health-administration", initial: 6, balance: 6, spent: 0 },
      {
        id: "defense-fund",
        institution: "defense-administration",
        initial: 2,
        balance: 2,
        spent: 0,
      },
    ],
    records: [
      {
        id: "rights-cases-record",
        holders: ["office:human-rights", "institution:rights-ombudsman"],
      },
      {
        id: "rights-education-record",
        holders: [
          "office:human-rights",
          "office:education",
          "institution:rights-education-network",
        ],
      },
      { id: "health-record", holders: ["office:health", "institution:health-administration"] },
      { id: "defense-record", holders: ["office:defense", "institution:defense-administration"] },
    ],
    jobs: PILOT_WORK.map(work => {
      const executor = executors[work.id];
      if (!executor) throw new Error(`executor do ensaio ausente: ${work.id}`);
      return {
        id: `job-${work.id}`,
        work: work.id,
        executor: executor.institution,
        fund: executor.fund,
        record: executor.record,
        preparationTotal: 1,
        preparationLeft: 1,
        executionTotal: 1,
        executionLeft: 1,
        unitCost: 1,
      };
    }),
    handovers: [],
  };
}

export function operationPlans() {
  const government = openingPilotGovernment();
  /** @param {Parameters<typeof reformGovernment>[1]} command */
  const change = command => {
    const result = reformGovernment(government, command);
    if (!result.ok) throw new Error(result.reason);
    return result.state;
  };
  /** @param {typeof government} changed @param {import("./operations.mjs").HandoverOrder} handover */
  const plan = (changed, handover) => ({
    government: changed,
    operations: queueHandover(changed, openingPilotOperations(), handover),
  });
  return {
    keep: { government, operations: openingPilotOperations() },
    merge: plan(change({ type: "merge", into: "education", from: "human-rights" }), {
      id: "merge-handover",
      team: "rights-coordination",
      from: "human-rights",
      to: "education",
      mode: "move",
      effort: 2,
      records: ["rights-cases-record", "rights-education-record"],
    }),
    abolish: plan(
      change({
        type: "abolish",
        office: "human-rights",
        destinations: {
          "rights-intake": "health",
          "rights-followup": "health",
          "rights-education": "education",
        },
      }),
      {
        id: "abolish-handover",
        team: "rights-coordination",
        from: "human-rights",
        to: "health",
        mode: "move",
        effort: 1,
        records: ["rights-cases-record"],
      },
    ),
    digital: plan(
      change({ type: "create", label: "Saúde Digital", competencies: ["health-information"] }),
      {
        id: "digital-handover",
        team: "health-coordination",
        from: "health",
        to: "ministry-1",
        mode: "move",
        effort: 1,
        records: ["health-record"],
      },
    ),
  };
}
