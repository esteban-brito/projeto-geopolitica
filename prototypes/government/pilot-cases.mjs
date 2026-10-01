import { openingGovernment } from "./index.mjs";

/**
 * @typedef {import("./pilot.mjs").PilotAsset} PilotAsset
 * @typedef {import("./pilot.mjs").PilotWork} PilotWork
 * @typedef {import("./pilot.mjs").PilotPerson} PilotPerson
 * @typedef {import("./pilot.mjs").CareerEpisode} CareerEpisode
 */

/** @type {ReadonlyArray<import("./pilot.mjs").PilotInstitution>} */
export const PILOT_INSTITUTIONS = [
  {
    id: "rights-ombudsman",
    kind: "unit",
    legalHome: "human-rights",
    source: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11341.htm",
  },
  {
    id: "anvisa",
    kind: "agency",
    legalHome: "health",
    source: "https://www.planalto.gov.br/ccivil_03/leis/l9782.htm",
  },
  {
    id: "state-health-secretariats",
    kind: "federated",
    legalHome: null,
    source: "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm",
  },
  {
    id: "municipal-health-secretariats",
    kind: "federated",
    legalHome: null,
    source: "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm",
  },
  {
    id: "armed-forces",
    kind: "force",
    legalHome: "defense",
    source: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp97.htm",
  },
];

/** @type {Readonly<[PilotAsset, PilotAsset, PilotAsset, PilotAsset]>} */
export const PILOT_ASSETS = [
  { id: "rights-cases", kind: "case", institution: "rights-ombudsman" },
  { id: "rights-team", kind: "team", institution: "rights-ombudsman" },
  { id: "anvisa-team", kind: "team", institution: "anvisa" },
  { id: "defense-team", kind: "team", institution: "armed-forces" },
];

/** @type {Readonly<[PilotWork, PilotWork, PilotWork, PilotWork, PilotWork, PilotWork, PilotWork]>} */
export const PILOT_WORK = [
  {
    id: "rights-intake",
    office: "human-rights",
    direct: {
      action: "receive",
      object: "rights-complaints",
      instrument: "case-system",
      scope: "national",
    },
    transferable: [],
    links: [{ role: "executor", institution: "rights-ombudsman" }],
    source: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14600.htm#art28",
  },
  {
    id: "rights-followup",
    office: "human-rights",
    direct: {
      action: "coordinate",
      object: "rights-cases",
      instrument: "referral-network",
      scope: "national",
    },
    transferable: [
      {
        action: "coordinate",
        object: "service-cases",
        instrument: "referral-network",
        scope: "national",
      },
    ],
    links: [{ role: "executor", institution: "rights-ombudsman" }],
    source: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11341.htm",
  },
  {
    id: "rights-education",
    office: "human-rights",
    direct: {
      action: "coordinate",
      object: "rights-education",
      instrument: "education-program",
      scope: "national",
    },
    transferable: [],
    links: [],
    source: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14600.htm#art28",
  },
  {
    id: "health-federation",
    office: "health",
    direct: {
      action: "negotiate",
      object: "sus-network",
      instrument: "intergovernmental-commission",
      scope: "national",
    },
    transferable: [],
    links: [
      { role: "partner", institution: "state-health-secretariats" },
      { role: "partner", institution: "municipal-health-secretariats" },
    ],
    source: "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm#art14a",
  },
  {
    id: "sanitary-policy",
    office: "health",
    direct: {
      action: "formulate",
      object: "sanitary-policy",
      instrument: "regulatory-agenda",
      scope: "national",
    },
    transferable: [],
    links: [{ role: "regulator", institution: "anvisa" }],
    source: "https://www.planalto.gov.br/ccivil_03/leis/l9782.htm#art3",
  },
  {
    id: "health-information",
    office: "health",
    direct: {
      action: "coordinate",
      object: "health-information",
      instrument: "information-system",
      scope: "national",
    },
    transferable: [],
    links: [{ role: "partner", institution: "state-health-secretariats" }],
    source: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14600.htm",
  },
  {
    id: "defense-policy",
    office: "defense",
    direct: {
      action: "formulate",
      object: "national-defense",
      instrument: "defense-strategy",
      scope: "national",
    },
    transferable: [],
    links: [{ role: "partner", institution: "armed-forces" }],
    source: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp97.htm#art3",
  },
];

/** @type {{
 * rightsOmbudsman: PilotPerson & { episodes: [CareerEpisode, CareerEpisode] },
 * healthNegotiator: PilotPerson & { episodes: [CareerEpisode, CareerEpisode] },
 * rightsEducator: PilotPerson & { episodes: [CareerEpisode] },
 * digitalManager: PilotPerson & { episodes: [CareerEpisode] }
 * }} */
export const PILOT_PEOPLE = {
  rightsOmbudsman: {
    id: "rights-ombudsman-candidate",
    knownHistoryComplete: true,
    episodes: [
      {
        id: "intake",
        action: "receive",
        object: "rights-complaints",
        instrument: "case-system",
        scope: "national",
        known: true,
      },
      {
        id: "followup",
        action: "coordinate",
        object: "rights-cases",
        instrument: "referral-network",
        scope: "national",
        known: true,
      },
    ],
  },
  healthNegotiator: {
    id: "health-negotiator-candidate",
    knownHistoryComplete: true,
    episodes: [
      {
        id: "pact",
        action: "negotiate",
        object: "sus-network",
        instrument: "intergovernmental-commission",
        scope: "national",
        known: true,
      },
      {
        id: "referrals",
        action: "coordinate",
        object: "service-cases",
        instrument: "referral-network",
        scope: "national",
        known: true,
      },
    ],
  },
  rightsEducator: {
    id: "rights-educator-candidate",
    knownHistoryComplete: true,
    episodes: [
      {
        id: "rights-education",
        action: "coordinate",
        object: "rights-education",
        instrument: "education-program",
        scope: "national",
        known: true,
      },
    ],
  },
  digitalManager: {
    id: "digital-manager-candidate",
    knownHistoryComplete: true,
    episodes: [
      {
        id: "health-data",
        action: "coordinate",
        object: "health-information",
        instrument: "information-system",
        scope: "national",
        known: true,
      },
    ],
  },
};

export function openingPilotGovernment() {
  return openingGovernment(
    [
      { id: "human-rights", label: "Direitos Humanos", kind: "ministry" },
      { id: "health", label: "Saúde", kind: "ministry" },
      { id: "defense", label: "Defesa", kind: "ministry" },
      { id: "education", label: "Educação", kind: "ministry" },
    ],
    PILOT_WORK.map(work => ({ id: work.id, office: work.office })),
  );
}
