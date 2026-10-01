import { CATALOG } from "../../src/public/index.mjs";
import { COMPETENCIES } from "../government/competencies.mjs";
import { openingGovernment, reformGovernment } from "../government/index.mjs";
import { OFFICE_IDS } from "./bridge.mjs";

/**
 * @typedef {import("../government/index.mjs").GovernmentState} GovernmentState
 * @typedef {{ into: Record<string, string>, names: Record<string, string>, gone: Record<string, unknown>, created: unknown[], government?: GovernmentState | null }} StructureState
 * @typedef {{id: string, from: string, text: string, w: number, dest: string}} GonePart
 * @typedef {{id: string, label: string, from: string, profile: string, previousOwners: Record<string, string>, revision: number}} CreatedOffice
 * @typedef {{ government: GovernmentState, into: Record<string, string>, names: Record<string, string>, gone: Record<string, GonePart[]> }} StructureChange
 */

/** @type {Readonly<Record<string, string>>} */
const LEGACY_OFFICES = Object.fromEntries(
  Object.entries(OFFICE_IDS).map(([legacy, canonical]) => [canonical, legacy]),
);
const WORK_COUNTS = Object.fromEntries(
  Object.values(OFFICE_IDS).map(office => [
    office,
    COMPETENCIES.filter(work => work.office === office).length,
  ]),
);
const WORKS = new Map(COMPETENCIES.map(work => [work.id, work]));

/** @param {string} canonical @returns {string} */
function legacyOffice(canonical) {
  const id = LEGACY_OFFICES[canonical];
  if (!id && /^ministry-[1-9][0-9]*$/.test(canonical)) return canonical;
  if (!id) throw new Error(`órgão sem identidade na posse: ${canonical}`);
  return id;
}

/** @param {GovernmentState} government @param {string} office */
function canonicalOffice(government, office) {
  const id = OFFICE_IDS[office] ?? office;
  return Object.hasOwn(government.offices, id) ? id : null;
}

/** @param {unknown} value @returns {CreatedOffice | null} */
function createdOffice(value) {
  if (!value || typeof value !== "object") return null;
  const item = /** @type {Partial<CreatedOffice>} */ (value);
  if (
    typeof item.id !== "string" ||
    typeof item.label !== "string" ||
    typeof item.from !== "string" ||
    typeof item.profile !== "string" ||
    !Number.isInteger(item.revision) ||
    !item.previousOwners ||
    typeof item.previousOwners !== "object" ||
    Object.values(item.previousOwners).some(owner => typeof owner !== "string")
  )
    return null;
  return /** @type {CreatedOffice} */ (item);
}

/** @param {GovernmentState} government @param {Readonly<Record<string, string>>} labels @returns {StructureChange} */
function project(government, labels) {
  const into = Object.fromEntries(
    Object.values(government.offices)
      .filter(office => office.mergedInto)
      .map(office => [legacyOffice(office.id), legacyOffice(office.mergedInto ?? "")]),
  );
  const names = Object.fromEntries(
    Object.values(government.offices)
      .filter(office => office.label !== labels[legacyOffice(office.id)])
      .map(office => [legacyOffice(office.id), office.label]),
  );
  /** @type {Record<string, GonePart[]>} */
  const gone = {};
  for (const event of government.events) {
    const office = government.offices[event.office];
    if (event.type !== "abolish" || event.undone || !office || office.active || office.mergedInto)
      continue;
    gone[legacyOffice(event.office)] = Object.keys(event.moved).map(id => {
      const work = WORKS.get(id);
      if (!work) throw new Error(`atribuição sem identidade na posse: ${id}`);
      return {
        id,
        from: legacyOffice(work.office),
        text: work.label,
        w: 1 / (WORK_COUNTS[work.office] ?? 1),
        dest: legacyOffice(government.owner[id] ?? ""),
      };
    });
  }
  return { government, into, names, gone };
}

/** @param {Record<string, string>} first @param {Record<string, string>} second */
const same = (first, second) =>
  Object.keys(first).length === Object.keys(second).length &&
  Object.entries(first).every(
    ([key, value]) => Object.hasOwn(second, key) && second[key] === value,
  );

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @returns {GovernmentState | null} */
export function structureOf(state, labels) {
  if (state.government) {
    const created = state.created.map(createdOffice);
    const extra = Object.keys(state.government.offices).filter(id => !LEGACY_OFFICES[id]);
    if (
      created.some(item => !item) ||
      new Set(created.map(item => item?.id)).size !== extra.length ||
      created.length !== extra.length ||
      extra.some(id => !created.some(item => item?.id === id))
    )
      return null;
    const projection = project(state.government, labels);
    if (
      same(state.into, projection.into) &&
      same(state.names, projection.names) &&
      JSON.stringify(state.gone) === JSON.stringify(projection.gone)
    )
      return state.government;
  }
  if (state.created.length) return null;
  if (
    Object.keys(state.into).length ||
    Object.keys(state.names).length ||
    Object.keys(state.gone).length
  )
    return null;
  const offices = Object.entries(OFFICE_IDS).map(([id, canonical]) => {
    const seat = CATALOG.cabinet.find(item => item.id === canonical);
    const label = labels[id];
    if (!seat || typeof label !== "string" || !label.trim())
      throw new Error(`pasta sem identidade conhecida: ${id}`);
    return { id: canonical, label, kind: seat.kind };
  });
  return openingGovernment(offices, COMPETENCIES);
}

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @param {string} into @param {string} from @param {string} label @returns {StructureChange | null} */
export function mergeStructure(state, labels, into, from, label) {
  const government = structureOf(state, labels);
  if (!government) return null;
  const target = canonicalOffice(government, into),
    source = canonicalOffice(government, from);
  if (!target || !source) return null;
  const result = reformGovernment(government, { type: "merge", into: target, from: source, label });
  return result.ok ? project(result.state, labels) : null;
}

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @param {string} into @returns {StructureChange | null} */
export function splitStructure(state, labels, into) {
  let government = structureOf(state, labels);
  if (!government) return null;
  const target = canonicalOffice(government, into);
  if (!target) return null;
  const events = [...government.events]
    .reverse()
    .filter(
      event =>
        event.type === "merge" &&
        !event.undone &&
        event.into === target &&
        government?.offices[event.office]?.mergedInto === target,
    );
  if (!events.length) return null;
  for (const event of events) {
    const result = reformGovernment(government, {
      type: "splitMerge",
      into: target,
      from: event.office,
    });
    if (!result.ok) return null;
    government = result.state;
  }
  return project(government, labels);
}

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @param {string} office @param {Record<string, string>} destinations @returns {StructureChange | null} */
export function abolishStructure(state, labels, office, destinations) {
  const government = structureOf(state, labels);
  if (!government) return null;
  const canonical = canonicalOffice(government, office);
  if (!canonical) return null;
  const mapped = Object.fromEntries(
    Object.entries(destinations).map(([id, target]) => [
      id,
      canonicalOffice(government, target) ?? "",
    ]),
  );
  const result = reformGovernment(government, {
    type: "abolish",
    office: canonical,
    destinations: mapped,
  });
  return result.ok ? project(result.state, labels) : null;
}

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @param {string} office @returns {StructureChange | null} */
export function restoreStructure(state, labels, office) {
  const government = structureOf(state, labels);
  if (!government) return null;
  const canonical = canonicalOffice(government, office);
  if (!canonical) return null;
  const result = reformGovernment(government, { type: "restore", office: canonical });
  return result.ok ? project(result.state, labels) : null;
}

/** @param {GovernmentState} government */
export function openingStructure(government) {
  return (
    Object.values(government.offices).filter(office => office.active).length ===
      Object.keys(OFFICE_IDS).length &&
    government.inventory.length === COMPETENCIES.length &&
    COMPETENCIES.every(work => government.owner[work.id] === work.office)
  );
}

/** @param {GovernmentState} government @param {string} office @returns {{id: string, from: string, text: string, w: number}[]} */
export function structureParts(government, office) {
  const canonical = canonicalOffice(government, office);
  if (!canonical) return [];
  return COMPETENCIES.filter(work => government.owner[work.id] === canonical).map(work => {
    const count = WORK_COUNTS[work.office];
    if (!count) throw new Error(`órgão sem inventário na posse: ${work.office}`);
    return { id: work.id, from: legacyOffice(work.office), text: work.label, w: 1 / count };
  });
}

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @param {string} label @param {string[]} works @param {string} from @param {string} [profile] @returns {(StructureChange & {created: CreatedOffice[], id: string}) | null} */
export function createStructure(state, labels, label, works, from, profile) {
  const government = structureOf(state, labels);
  if (!government || !canonicalOffice(government, from)) return null;
  const result = reformGovernment(government, { type: "create", label, competencies: works });
  if (!result.ok) return null;
  const id = Object.keys(result.state.offices).find(
    office => !Object.hasOwn(government.offices, office),
  );
  const office = id ? result.state.offices[id] : null;
  if (!id || !office) return null;
  const created = state.created.map(createdOffice).filter(item => item !== null);
  const parent = created.find(item => item.id === from);
  created.push({
    id,
    label: office.label,
    from,
    profile: profile ?? parent?.profile ?? from,
    previousOwners: Object.fromEntries(works.map(work => [work, government.owner[work] ?? ""])),
    revision: government.nextRevision,
  });
  return { ...project(result.state, labels), created, id };
}

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @param {string} office @param {string[]} works @param {string} to @returns {StructureChange | null} */
export function transferStructure(state, labels, office, works, to) {
  let government = structureOf(state, labels);
  if (!government) return null;
  const source = canonicalOffice(government, office),
    target = canonicalOffice(government, to);
  if (
    !source ||
    !target ||
    !works.length ||
    new Set(works).size !== works.length ||
    works.some(work => government?.owner[work] !== source)
  )
    return null;
  for (const work of works) {
    const result = reformGovernment(government, { type: "transfer", competency: work, to: target });
    if (!result.ok) return null;
    government = result.state;
  }
  return project(government, labels);
}

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @param {string} office @param {string} label @returns {StructureChange | null} */
export function renameStructure(state, labels, office, label) {
  const government = structureOf(state, labels);
  if (!government) return null;
  const canonical = canonicalOffice(government, office);
  if (!canonical) return null;
  const result = reformGovernment(government, { type: "rename", office: canonical, label });
  return result.ok ? project(result.state, labels) : null;
}

/** @param {StructureState} state @param {Readonly<Record<string, string>>} labels @param {string} office @returns {StructureChange | null} */
export function cancelCreation(state, labels, office) {
  const government = structureOf(state, labels),
    created = state.created.map(createdOffice).find(item => item?.id === office);
  if (!government || !created || !government.offices[office]?.active) return null;
  const works = Object.keys(government.owner).filter(work => government.owner[work] === office);
  if (works.some(work => !government.offices[created.previousOwners[work] ?? ""]?.active))
    return null;
  const destinations = Object.fromEntries(
    works.map(work => [work, created.previousOwners[work] ?? ""]),
  );
  const result = reformGovernment(government, { type: "abolish", office, destinations });
  return result.ok ? project(result.state, labels) : null;
}

/** @param {GovernmentState} government @param {string} office */
export function structureWeight(government, office) {
  return Number(
    structureParts(government, office)
      .reduce((total, work) => total + work.w, 0)
      .toFixed(12),
  );
}
