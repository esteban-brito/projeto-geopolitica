/* GOVERNO VARIÁVEL — a estrutura de órgãos e a titularidade de cada trabalho.
   Nomes são atributos; IDs e competências sobrevivem às reformas. Este motor não decide a rota
   jurídica nem o efeito fiscal de um ato: a aplicação o compõe com normas e programas. */

/**
 * @typedef {object} Office
 * @property {string} id
 * @property {string} label
 * @property {"ministry" | "presidency" | "agu"} kind
 * @property {boolean} active
 * @property {number} labelRevision
 * @property {string} [mergedInto]
 */

/**
 * @typedef {object} ReformEvent
 * @property {number} id
 * @property {"merge" | "abolish"} type
 * @property {string} office
 * @property {string} [into]
 * @property {string} [oldLabel]
 * @property {string} [newLabel]
 * @property {number} [previousLabelRevision]
 * @property {Record<string, string>} moved - competência para destino no momento do ato
 * @property {number} revision
 * @property {Record<string, number>} previousRevision
 * @property {boolean} undone
 */

/**
 * @typedef {object} GovernmentState
 * @property {Record<string, Office>} offices
 * @property {Record<string, string>} owner - competência para responsável principal
 * @property {ReadonlyArray<string>} inventory
 * @property {Record<string, number>} ownerRevision
 * @property {number} nextRevision
 * @property {ReformEvent[]} events
 * @property {number} nextOffice
 */

/**
 * @typedef {{ id: string, label: string, kind: "ministry" | "presidency" | "agu" }} OpeningOffice
 * @typedef {{ id: string, office: string }} OpeningCompetency
 * @typedef {{ type: "create", label: string, competencies: string[] } |
 *   { type: "merge", into: string, from: string, label?: string } |
 *   { type: "splitMerge", into: string, from: string } |
 *   { type: "abolish", office: string, destinations: Record<string, string> } |
 *   { type: "restore", office: string } |
 *   { type: "transfer", competency: string, to: string } |
 *   { type: "rename", office: string, label: string }} ReformCommand
 * @typedef {{ ok: true, state: GovernmentState } | { ok: false, reason: string }} ReformResult
 */

/**
 * @param {ReadonlyArray<OpeningOffice>} offices
 * @param {ReadonlyArray<OpeningCompetency>} competencies
 * @returns {GovernmentState}
 */
export function openingGovernment(offices, competencies) {
  /** @type {Record<string, Office>} */
  const byId = {};
  for (const office of offices) {
    if (!office.id || !office.label.trim() || byId[office.id]) {
      throw new Error(`órgão inicial inválido ou repetido: ${office.id}`);
    }
    byId[office.id] = { ...office, active: true, labelRevision: 0 };
  }
  /** @type {Record<string, string>} */
  const owner = {};
  for (const competency of competencies) {
    if (!competency.id || !byId[competency.office] || owner[competency.id]) {
      throw new Error(`competência inicial inválida ou repetida: ${competency.id}`);
    }
    owner[competency.id] = competency.office;
  }
  return {
    offices: byId,
    owner,
    events: [],
    nextOffice: 1,
    inventory: Object.keys(owner),
    ownerRevision: Object.fromEntries(Object.keys(owner).map(id => [id, 0])),
    nextRevision: 1,
  };
}

/** @param {GovernmentState} state @param {Office["kind"]} [kind] @returns {Office[]} */
export function activeOffices(state, kind) {
  return Object.values(state.offices).filter(
    office => office.active && (!kind || office.kind === kind),
  );
}

/** @param {GovernmentState} state @returns {string[]} */
export function governmentViolations(state) {
  const errors = [];
  const ids = new Set();
  for (const [id, office] of Object.entries(state.offices)) {
    if (id !== office.id || ids.has(id) || !office.label.trim())
      errors.push(`órgão inválido: ${id}`);
    ids.add(id);
    if (office.active && office.mergedInto) errors.push(`órgão ativo marcado como fundido: ${id}`);
  }
  const inventory = new Set();
  for (const id of state.inventory) {
    if (inventory.has(id)) errors.push(`competência repetida no inventário: ${id}`);
    inventory.add(id);
  }
  for (const id of inventory) {
    if (!Object.hasOwn(state.owner, id)) errors.push(`competência ausente: ${id}`);
  }
  for (const [id, office] of Object.entries(state.owner)) {
    if (!inventory.has(id)) errors.push(`competência fora do inventário: ${id}`);
    if (!state.offices[office]?.active) errors.push(`competência sem responsável ativo: ${id}`);
  }
  return errors;
}

/** @param {string} label @returns {string | null} */
const checkedLabel = label => {
  const text = label.trim();
  return text && text.length <= 120 ? text : null;
};

/** @param {string} reason @returns {ReformResult} */
const refused = reason => ({ ok: false, reason });

/** @param {GovernmentState} state @param {ReformCommand} command @returns {ReformResult} */
export function reformGovernment(state, command) {
  const offices = state.offices;
  const owner = state.owner;
  if (command.type === "create") {
    const label = checkedLabel(command.label);
    if (!label) return refused("nome de ministério inválido");
    const selected = new Set(command.competencies);
    if (selected.size !== command.competencies.length || [...selected].some(id => !owner[id])) {
      return refused("competências repetidas ou desconhecidas");
    }
    let ordinal = state.nextOffice;
    while (Object.hasOwn(offices, `ministry-${ordinal}`)) ordinal++;
    const id = `ministry-${ordinal}`;
    return {
      ok: true,
      state: {
        ...state,
        offices: {
          ...offices,
          [id]: { id, label, kind: "ministry", active: true, labelRevision: state.nextRevision },
        },
        owner: Object.fromEntries(
          Object.entries(owner).map(([competency, office]) => [
            competency,
            selected.has(competency) ? id : office,
          ]),
        ),
        nextOffice: ordinal + 1,
        ownerRevision: {
          ...state.ownerRevision,
          ...Object.fromEntries([...selected].map(id => [id, state.nextRevision])),
        },
        nextRevision: state.nextRevision + 1,
      },
    };
  }

  if (command.type === "transfer") {
    if (!owner[command.competency] || !offices[command.to]?.active) {
      return refused("competência ou destino desconhecido");
    }
    return {
      ok: true,
      state: {
        ...state,
        owner: { ...owner, [command.competency]: command.to },
        ownerRevision: { ...state.ownerRevision, [command.competency]: state.nextRevision },
        nextRevision: state.nextRevision + 1,
      },
    };
  }

  if (command.type === "rename") {
    const label = checkedLabel(command.label);
    const office = offices[command.office];
    if (!label || !office?.active) return refused("órgão ou nome inválido");
    return {
      ok: true,
      state: {
        ...state,
        offices: {
          ...offices,
          [office.id]: { ...office, label, labelRevision: state.nextRevision },
        },
        nextRevision: state.nextRevision + 1,
      },
    };
  }

  if (command.type === "merge") {
    const target = offices[command.into],
      absorbed = offices[command.from];
    const label = checkedLabel(command.label ?? target?.label ?? "");
    if (
      !target?.active ||
      !absorbed?.active ||
      target.id === absorbed.id ||
      !label ||
      target.kind !== "ministry" ||
      absorbed.kind !== "ministry"
    ) {
      return refused("a junção exige dois ministérios ativos distintos");
    }
    /** @type {Record<string, string>} */
    const moved = {};
    for (const [id, office] of Object.entries(owner))
      if (office === absorbed.id) moved[id] = target.id;
    const changed = Object.fromEntries(
      Object.entries(owner).map(([id, office]) => [
        id,
        office === absorbed.id ? target.id : office,
      ]),
    );
    return {
      ok: true,
      state: {
        ...state,
        offices: {
          ...offices,
          [target.id]: { ...target, label, labelRevision: state.nextRevision },
          [absorbed.id]: { ...absorbed, active: false, mergedInto: target.id },
        },
        owner: changed,
        ownerRevision: {
          ...state.ownerRevision,
          ...Object.fromEntries(Object.keys(moved).map(id => [id, state.nextRevision])),
        },
        nextRevision: state.nextRevision + 1,
        events: [
          ...state.events,
          {
            id: state.events.length + 1,
            type: "merge",
            office: absorbed.id,
            into: target.id,
            oldLabel: target.label,
            newLabel: label,
            previousLabelRevision: target.labelRevision,
            moved,
            revision: state.nextRevision,
            previousRevision: { ...state.ownerRevision },
            undone: false,
          },
        ],
      },
    };
  }

  if (command.type === "splitMerge") {
    const target = offices[command.into],
      absorbed = offices[command.from];
    const event = [...state.events]
      .reverse()
      .find(
        item =>
          item.type === "merge" &&
          !item.undone &&
          item.office === command.from &&
          item.into === command.into,
      );
    if (
      !target?.active ||
      !absorbed ||
      absorbed.active ||
      absorbed.mergedInto !== target.id ||
      !event
    ) {
      return refused("não há junção ativa para dividir");
    }
    const changed = { ...owner };
    const revisions = { ...state.ownerRevision };
    for (const [id, destination] of Object.entries(event.moved)) {
      if (changed[id] === destination && revisions[id] === event.revision) {
        changed[id] = absorbed.id;
        revisions[id] = event.previousRevision[id] ?? 0;
      }
    }
    const restored = {
      id: absorbed.id,
      label: absorbed.label,
      kind: absorbed.kind,
      active: true,
      labelRevision: absorbed.labelRevision,
    };
    const restoreLabel = target.labelRevision === event.revision;
    return {
      ok: true,
      state: {
        ...state,
        offices: {
          ...offices,
          [target.id]: {
            ...target,
            label: restoreLabel ? (event.oldLabel ?? target.label) : target.label,
            labelRevision: restoreLabel ? (event.previousLabelRevision ?? 0) : target.labelRevision,
          },
          [absorbed.id]: { ...restored, active: true },
        },
        owner: changed,
        ownerRevision: revisions,
        events: state.events.map(item => (item.id === event.id ? { ...item, undone: true } : item)),
      },
    };
  }

  if (command.type === "abolish") {
    const office = offices[command.office];
    if (!office?.active || office.kind !== "ministry")
      return refused("a extinção exige ministério ativo");
    const competencies = Object.keys(owner).filter(id => owner[id] === office.id);
    const destinations = command.destinations;
    if (
      Object.keys(destinations).length !== competencies.length ||
      competencies.some(
        id =>
          !destinations[id] ||
          !offices[destinations[id] ?? ""]?.active ||
          destinations[id] === office.id,
      )
    ) {
      return refused("cada competência precisa de um destino ativo distinto da pasta extinta");
    }
    const changed = { ...owner };
    for (const id of competencies) changed[id] = destinations[id] ?? owner[id] ?? "";
    return {
      ok: true,
      state: {
        ...state,
        offices: { ...offices, [office.id]: { ...office, active: false } },
        owner: changed,
        ownerRevision: {
          ...state.ownerRevision,
          ...Object.fromEntries(competencies.map(id => [id, state.nextRevision])),
        },
        nextRevision: state.nextRevision + 1,
        events: [
          ...state.events,
          {
            id: state.events.length + 1,
            type: "abolish",
            office: office.id,
            moved: { ...destinations },
            revision: state.nextRevision,
            previousRevision: { ...state.ownerRevision },
            undone: false,
          },
        ],
      },
    };
  }

  if (command.type === "restore") {
    const office = offices[command.office];
    const event = [...state.events]
      .reverse()
      .find(item => item.type === "abolish" && !item.undone && item.office === command.office);
    if (!office || office.active || !event) return refused("não há extinção ativa para desfazer");
    const changed = { ...owner };
    const revisions = { ...state.ownerRevision };
    for (const [id, destination] of Object.entries(event.moved)) {
      if (changed[id] === destination && revisions[id] === event.revision) {
        changed[id] = office.id;
        revisions[id] = event.previousRevision[id] ?? 0;
      }
    }
    return {
      ok: true,
      state: {
        ...state,
        offices: { ...offices, [office.id]: { ...office, active: true } },
        owner: changed,
        ownerRevision: revisions,
        events: state.events.map(item => (item.id === event.id ? { ...item, undone: true } : item)),
      },
    };
  }

  return refused("operação desconhecida");
}
