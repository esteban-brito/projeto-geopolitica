/**
 * @typedef {{ action: string, object: string, instrument: string, scope: string }} EvidenceProfile
 * @typedef {EvidenceProfile & { id: string, known: boolean }} CareerEpisode
 * @typedef {{ id: string, episodes: CareerEpisode[], knownHistoryComplete?: boolean }} PilotPerson
 * @typedef {{ role: "executor" | "funder" | "regulator" | "supervisor" | "partner", institution: string }} InstitutionLink
 * @typedef {{ id: string, kind: "unit" | "agency" | "federated" | "force", legalHome: string | null, source: string }} PilotInstitution
 * @typedef {{ id: string, kind: "case" | "team" | "resource", institution: string }} PilotAsset
 * @typedef {{ id: string, office: string, direct: EvidenceProfile, transferable: EvidenceProfile[], links: InstitutionLink[], source: string }} PilotWork
 * @typedef {"direct" | "transferable" | "unproven" | "unknown"} Fit
 * @typedef {{ id: string, fit: Fit, evidenceId?: string }} WorkAssessment
 */

/** @param {EvidenceProfile} profile @param {CareerEpisode} episode */
const matches = (profile, episode) =>
  profile.action === episode.action &&
  profile.object === episode.object &&
  profile.instrument === episode.instrument &&
  profile.scope === episode.scope;

/** @param {PilotWork} work @param {PilotPerson} person @returns {WorkAssessment} */
export function assessWork(work, person) {
  const known = person.episodes
    .filter(episode => episode.known)
    .toSorted((a, b) => a.id.localeCompare(b.id));
  if (new Set(known.map(episode => episode.id)).size !== known.length) {
    throw new Error(`episódios repetidos: ${person.id}`);
  }
  const direct = known.find(episode => matches(work.direct, episode));
  if (direct) return { id: work.id, fit: "direct", evidenceId: direct.id };
  const adjacent = known.find(episode =>
    work.transferable.some(profile => matches(profile, episode)),
  );
  if (adjacent) return { id: work.id, fit: "transferable", evidenceId: adjacent.id };
  return { id: work.id, fit: person.knownHistoryComplete === true ? "unproven" : "unknown" };
}

/** @param {import("./index.mjs").GovernmentState} government @param {ReadonlyArray<PilotWork>} works */
const assertWorkCatalog = (government, works) => {
  const catalog = new Set(works.map(work => work.id));
  const inventory = new Set(government.inventory);
  const assigned = new Set(Object.keys(government.owner));
  if (
    catalog.size !== works.length ||
    inventory.size !== government.inventory.length ||
    catalog.size !== inventory.size ||
    assigned.size !== inventory.size ||
    [...catalog].some(id => !inventory.has(id) || !assigned.has(id))
  )
    throw new Error("catálogo de trabalhos diverge do governo");
};

/**
 * @param {import("./index.mjs").GovernmentState} government
 * @param {ReadonlyArray<PilotWork>} works
 * @param {ReadonlyArray<PilotInstitution>} institutions
 */
export function institutionalView(government, works, institutions) {
  assertWorkCatalog(government, works);
  const byId = new Map(institutions.map(institution => [institution.id, institution]));
  if (byId.size !== institutions.length) throw new Error("instituições repetidas no piloto");
  return works
    .map(work => {
      const policyLead = government.owner[work.id];
      if (!policyLead || !government.offices[policyLead]?.active) {
        throw new Error(`trabalho sem condução ativa: ${work.id}`);
      }
      const links = work.links.map(link => {
        const institution = byId.get(link.institution);
        if (!institution) throw new Error(`instituição desconhecida: ${link.institution}`);
        if (institution.legalHome !== null && !government.offices[institution.legalHome]) {
          throw new Error(`pasta legal desconhecida: ${institution.legalHome}`);
        }
        return {
          ...link,
          legalHome: institution.legalHome,
          needsLegalReassignment:
            institution.legalHome !== null && !government.offices[institution.legalHome]?.active,
        };
      });
      return { id: work.id, policyLead, links };
    })
    .toSorted((a, b) => a.id.localeCompare(b.id));
}

/**
 * @param {import("./index.mjs").GovernmentState} government
 * @param {ReadonlyArray<PilotWork>} works
 * @param {PilotPerson} person
 * @param {string} office
 */
export function assessOffice(government, works, person, office) {
  assertWorkCatalog(government, works);
  if (!government.offices[office]?.active) throw new Error(`órgão inativo: ${office}`);
  const work = works
    .filter(item => government.owner[item.id] === office)
    .map(item => assessWork(item, person))
    .toSorted((a, b) => a.id.localeCompare(b.id));
  return { office, person: person.id, work };
}

/**
 * @param {import("./index.mjs").GovernmentState} before
 * @param {import("./index.mjs").GovernmentState} after
 * @param {ReadonlyArray<PilotWork>} works
 * @param {ReadonlyArray<PilotInstitution>} institutions
 * @param {PilotPerson} person
 * @param {string} office
 */
export function compareOffice(before, after, works, institutions, person, office) {
  const baseline = assessOffice(before, works, person, office);
  const reform = assessOffice(after, works, person, office);
  const oldIds = new Set(baseline.work.map(item => item.id));
  const newIds = new Set(reform.work.map(item => item.id));
  const unresolved = institutionalView(after, works, institutions)
    .filter(item => newIds.has(item.id))
    .flatMap(item =>
      item.links
        .filter(link => link.needsLegalReassignment)
        .map(link => ({ work: item.id, institution: link.institution, legalHome: link.legalHome })),
    );
  return {
    before: baseline,
    after: reform,
    added: [...newIds].filter(id => !oldIds.has(id)),
    removed: [...oldIds].filter(id => !newIds.has(id)),
    unresolved,
  };
}

/**
 * @param {import("./index.mjs").GovernmentState} government
 * @param {ReadonlyArray<PilotInstitution>} institutions
 * @param {ReadonlyArray<PilotAsset>} assets
 */
export function continuityView(government, institutions, assets) {
  const byInstitution = new Map(institutions.map(item => [item.id, item]));
  if (byInstitution.size !== institutions.length)
    throw new Error("instituições repetidas no piloto");
  const ids = new Set();
  return assets
    .map(asset => {
      if (ids.has(asset.id)) throw new Error(`recurso repetido: ${asset.id}`);
      ids.add(asset.id);
      const institution = byInstitution.get(asset.institution);
      if (!institution) throw new Error(`instituição desconhecida: ${asset.institution}`);
      if (institution.legalHome !== null && !government.offices[institution.legalHome]) {
        throw new Error(`pasta legal desconhecida: ${institution.legalHome}`);
      }
      return {
        ...asset,
        needsLegalReassignment:
          institution.legalHome !== null && !government.offices[institution.legalHome]?.active,
      };
    })
    .toSorted((a, b) => a.id.localeCompare(b.id));
}

/**
 * @param {import("./index.mjs").GovernmentState} before
 * @param {import("./index.mjs").GovernmentState} after
 * @param {ReadonlyArray<PilotInstitution>} institutions
 * @param {ReadonlyArray<PilotAsset>} beforeAssets
 * @param {ReadonlyArray<PilotAsset>} afterAssets
 */
export function compareContinuity(before, after, institutions, beforeAssets, afterAssets) {
  const baseline = continuityView(before, institutions, beforeAssets);
  const reform = continuityView(after, institutions, afterAssets);
  const oldById = new Map(baseline.map(item => [item.id, item]));
  const newById = new Map(reform.map(item => [item.id, item]));
  return {
    lost: baseline.filter(item => !newById.has(item.id)).map(item => item.id),
    created: reform.filter(item => !oldById.has(item.id)).map(item => item.id),
    moved: reform
      .filter(
        item => oldById.has(item.id) && oldById.get(item.id)?.institution !== item.institution,
      )
      .map(item => item.id),
    changedKind: reform
      .filter(item => oldById.has(item.id) && oldById.get(item.id)?.kind !== item.kind)
      .map(item => item.id),
    newlyUnresolved: reform.filter(
      item => item.needsLegalReassignment && !oldById.get(item.id)?.needsLegalReassignment,
    ),
  };
}

/**
 * @param {import("./index.mjs").GovernmentState} before
 * @param {import("./index.mjs").GovernmentState} after
 * @param {ReadonlyArray<PilotWork>} works
 * @param {ReadonlyArray<PilotInstitution>} institutions
 * @param {ReadonlyArray<PilotAsset>} beforeAssets
 * @param {ReadonlyArray<PilotAsset>} afterAssets
 * @param {Record<string, PilotPerson>} beforeAppointments
 * @param {Record<string, PilotPerson>} afterAppointments
 */
export function compareGovernment(
  before,
  after,
  works,
  institutions,
  beforeAssets,
  afterAssets,
  beforeAppointments,
  afterAppointments,
) {
  const baseline = institutionalView(before, works, institutions);
  const reform = institutionalView(after, works, institutions);
  const oldById = new Map(baseline.map(item => [item.id, item]));
  const activeBefore = new Set(
    Object.values(before.offices)
      .filter(item => item.active)
      .map(item => item.id),
  );
  const activeAfter = new Set(
    Object.values(after.offices)
      .filter(item => item.active)
      .map(item => item.id),
  );
  /** @param {import("./index.mjs").GovernmentState} government @param {Record<string, PilotPerson>} appointments */
  const assess = (government, appointments) =>
    Object.entries(appointments)
      .filter(([office]) => government.offices[office]?.active)
      .map(([office, person]) => assessOffice(government, works, person, office))
      .toSorted((a, b) => a.office.localeCompare(b.office));
  /** @param {import("./index.mjs").GovernmentState} government @param {Record<string, PilotPerson>} appointments */
  const appointmentsWithoutActiveOffice = (government, appointments) =>
    Object.keys(appointments)
      .filter(office => !government.offices[office]?.active)
      .toSorted();
  /** @param {Record<string, PilotPerson>} appointments */
  const appointmentConflicts = appointments => {
    /** @type {Map<string, string[]>} */
    const officesByPerson = new Map();
    for (const [office, person] of Object.entries(appointments)) {
      const offices = officesByPerson.get(person.id) ?? [];
      offices.push(office);
      officesByPerson.set(person.id, offices);
    }
    return [...officesByPerson]
      .filter(([, offices]) => offices.length > 1)
      .map(([person, offices]) => ({ person, offices: offices.toSorted() }))
      .toSorted((a, b) => a.person.localeCompare(b.person));
  };
  const workMoves = reform
    .filter(item => oldById.get(item.id)?.policyLead !== item.policyLead)
    .map(item => ({ id: item.id, from: oldById.get(item.id)?.policyLead, to: item.policyLead }));
  const newOffices = [...activeAfter].filter(id => !activeBefore.has(id)).toSorted();
  const affectedOffices = new Set([
    ...newOffices,
    ...workMoves.map(item => item.to),
    ...Object.keys(beforeAppointments).filter(id => !afterAppointments[id]),
  ]);
  return {
    workMoves,
    newOffices,
    closedOffices: [...activeBefore].filter(id => !activeAfter.has(id)).toSorted(),
    vacanciesAfter: [...affectedOffices]
      .filter(
        id =>
          after.offices[id]?.active &&
          after.offices[id]?.kind === "ministry" &&
          !afterAppointments[id],
      )
      .toSorted(),
    appointmentConflictsBefore: appointmentConflicts(beforeAppointments),
    appointmentConflictsAfter: appointmentConflicts(afterAppointments),
    appointmentsWithoutActiveOfficeBefore: appointmentsWithoutActiveOffice(
      before,
      beforeAppointments,
    ),
    appointmentsWithoutActiveOfficeAfter: appointmentsWithoutActiveOffice(after, afterAppointments),
    unresolved: reform.flatMap(item =>
      item.links
        .filter(link => link.needsLegalReassignment)
        .map(link => ({ work: item.id, institution: link.institution, legalHome: link.legalHome })),
    ),
    continuity: compareContinuity(before, after, institutions, beforeAssets, afterAssets),
    preparationBefore: assess(before, beforeAppointments),
    preparationAfter: assess(after, afterAppointments),
  };
}
