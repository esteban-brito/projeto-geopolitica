import test from "node:test";
import assert from "node:assert/strict";
import { reformGovernment } from "../../prototypes/government/index.mjs";
import {
  assessOffice,
  compareContinuity,
  compareGovernment,
  compareOffice,
  institutionalView,
} from "../../prototypes/government/pilot.mjs";
import {
  PILOT_ASSETS,
  PILOT_INSTITUTIONS,
  PILOT_PEOPLE,
  PILOT_WORK,
  openingPilotGovernment,
} from "../../prototypes/government/pilot-cases.mjs";

/** @param {Parameters<typeof reformGovernment>[0]} state @param {Parameters<typeof reformGovernment>[1]} command */
const changed = (state, command) => {
  const result = reformGovernment(state, command);
  if (result.ok === false) assert.fail(result.reason);
  return result.state;
};

test("transferir a condução sanitária preserva a agência reguladora", () => {
  const opening = openingPilotGovernment();
  const moved = changed(opening, {
    type: "transfer",
    competency: "sanitary-policy",
    to: "human-rights",
  });
  const before = institutionalView(opening, PILOT_WORK, PILOT_INSTITUTIONS).find(
    item => item.id === "sanitary-policy",
  );
  const after = institutionalView(moved, PILOT_WORK, PILOT_INSTITUTIONS).find(
    item => item.id === "sanitary-policy",
  );
  assert.equal(before?.policyLead, "health");
  assert.equal(after?.policyLead, "human-rights");
  assert.deepEqual(after?.links, before?.links);
  assert.deepEqual(after?.links, [
    {
      role: "regulator",
      institution: "anvisa",
      legalHome: "health",
      needsLegalReassignment: false,
    },
  ]);
});

test("juntar Direitos Humanos com Saúde mostra carga nova ante manter a estrutura", () => {
  const opening = openingPilotGovernment();
  const merged = changed(opening, { type: "merge", into: "health", from: "human-rights" });
  const comparison = compareOffice(
    opening,
    merged,
    PILOT_WORK,
    PILOT_INSTITUTIONS,
    PILOT_PEOPLE.healthNegotiator,
    "health",
  );
  assert.deepEqual(comparison.added, ["rights-education", "rights-followup", "rights-intake"]);
  assert.deepEqual(comparison.removed, []);
  assert.deepEqual(
    comparison.before.work.map(item => item.fit),
    ["direct", "unproven", "unproven"],
  );
  assert.equal(comparison.after.work.filter(item => item.fit === "unproven").length, 4);
  assert.equal(comparison.after.work.filter(item => item.fit === "transferable").length, 1);
  const intake = institutionalView(merged, PILOT_WORK, PILOT_INSTITUTIONS).find(
    item => item.id === "rights-intake",
  );
  assert.equal(intake?.policyLead, "health");
  assert.deepEqual(intake?.links, [
    {
      role: "executor",
      institution: "rights-ombudsman",
      legalHome: "human-rights",
      needsLegalReassignment: true,
    },
  ]);
  assert.ok(
    comparison.unresolved.some(
      item => item.institution === "rights-ombudsman" && item.work === "rights-intake",
    ),
  );
});

test("uma junção com Defesa não incorpora a estrutura das Forças Armadas", () => {
  const opening = openingPilotGovernment();
  const merged = changed(opening, { type: "merge", into: "health", from: "defense" });
  const comparison = compareOffice(
    opening,
    merged,
    PILOT_WORK,
    PILOT_INSTITUTIONS,
    PILOT_PEOPLE.healthNegotiator,
    "health",
  );
  assert.deepEqual(comparison.added, ["defense-policy"]);
  assert.equal(comparison.after.work.find(item => item.id === "defense-policy")?.fit, "unproven");
  const defense = institutionalView(merged, PILOT_WORK, PILOT_INSTITUTIONS).find(
    item => item.id === "defense-policy",
  );
  assert.deepEqual(defense?.links, [
    {
      role: "partner",
      institution: "armed-forces",
      legalHome: "defense",
      needsLegalReassignment: true,
    },
  ]);
  assert.ok(comparison.unresolved.some(item => item.institution === "armed-forces"));
});

test("a reforma conserva casos, equipes e recursos, mas expõe continuidade pendente", () => {
  const opening = openingPilotGovernment();
  const merged = changed(opening, { type: "merge", into: "health", from: "human-rights" });
  const comparison = compareContinuity(
    opening,
    merged,
    PILOT_INSTITUTIONS,
    PILOT_ASSETS,
    PILOT_ASSETS,
  );
  assert.deepEqual(comparison.lost, []);
  assert.deepEqual(comparison.created, []);
  assert.deepEqual(comparison.moved, []);
  assert.deepEqual(
    comparison.newlyUnresolved.map(item => item.id),
    ["rights-cases", "rights-team"],
  );
  assert.ok(comparison.newlyUnresolved.every(item => item.institution === "rights-ombudsman"));
});

test("um recurso não pode aparecer duas vezes nem pertencer a instituição desconhecida", () => {
  const opening = openingPilotGovernment();
  assert.throws(
    () =>
      compareContinuity(
        opening,
        opening,
        PILOT_INSTITUTIONS,
        [PILOT_ASSETS[0], PILOT_ASSETS[0]],
        PILOT_ASSETS,
      ),
    /recurso repetido/,
  );
  assert.throws(
    () =>
      compareContinuity(
        opening,
        opening,
        PILOT_INSTITUTIONS,
        [{ id: "lost-team", kind: "team", institution: "unknown" }],
        PILOT_ASSETS,
      ),
    /desconhecida/,
  );
  assert.deepEqual(
    compareContinuity(opening, opening, PILOT_INSTITUTIONS, PILOT_ASSETS, PILOT_ASSETS.slice(1))
      .lost,
    ["rights-cases"],
  );
  assert.deepEqual(
    compareContinuity(opening, opening, PILOT_INSTITUTIONS, PILOT_ASSETS, [
      { ...PILOT_ASSETS[0], institution: "anvisa" },
      ...PILOT_ASSETS.slice(1),
    ]).moved,
    ["rights-cases"],
  );
});

test("o mesmo ID de caso não pode trocar de tipo sem aparecer na comparação", () => {
  const opening = openingPilotGovernment();
  /** @type {Array<import("../../prototypes/government/pilot.mjs").PilotAsset>} */
  const after = [{ ...PILOT_ASSETS[0], kind: "team" }, ...PILOT_ASSETS.slice(1)];
  assert.deepEqual(
    compareContinuity(opening, opening, PILOT_INSTITUTIONS, PILOT_ASSETS, after).changedKind,
    ["rights-cases"],
  );
});

test("catálogo repetido ou incompleto não pode produzir parecer presidencial", () => {
  const opening = openingPilotGovernment();
  assert.throws(
    () => institutionalView(opening, [...PILOT_WORK, PILOT_WORK[0]], PILOT_INSTITUTIONS),
    /de trabalhos/,
  );
  assert.throws(
    () => institutionalView(opening, PILOT_WORK.slice(1), PILOT_INSTITUTIONS),
    /de trabalhos/,
  );
  assert.throws(
    () =>
      assessOffice(
        opening,
        [...PILOT_WORK, PILOT_WORK[0]],
        PILOT_PEOPLE.rightsOmbudsman,
        "human-rights",
      ),
    /de trabalhos/,
  );
});

test("episódios com o mesmo ID não podem fundamentar duas histórias diferentes", () => {
  const opening = openingPilotGovernment();
  const person = {
    ...PILOT_PEOPLE.rightsOmbudsman,
    episodes: [
      PILOT_PEOPLE.rightsOmbudsman.episodes[0],
      {
        ...PILOT_PEOPLE.rightsOmbudsman.episodes[1],
        id: PILOT_PEOPLE.rightsOmbudsman.episodes[0].id,
      },
    ],
  };
  assert.throws(() => assessOffice(opening, PILOT_WORK, person, "human-rights"), /repetidos/);
});

test("currículo conhece ouvidoria e transfere apenas a experiência explicitada", () => {
  const opening = openingPilotGovernment();
  const direct = assessOffice(opening, PILOT_WORK, PILOT_PEOPLE.rightsOmbudsman, "human-rights");
  assert.deepEqual(
    direct.work.map(item => [item.id, item.fit]),
    [
      ["rights-education", "unproven"],
      ["rights-followup", "direct"],
      ["rights-intake", "direct"],
    ],
  );
  const adjacent = assessOffice(opening, PILOT_WORK, PILOT_PEOPLE.healthNegotiator, "human-rights");
  assert.equal(adjacent.work.find(item => item.id === "rights-followup")?.fit, "transferable");
  assert.equal(adjacent.work.find(item => item.id === "rights-intake")?.fit, "unproven");
});

test("episódios separados não formam uma falsa experiência direta", () => {
  const opening = openingPilotGovernment();
  const person = {
    id: "partial",
    knownHistoryComplete: true,
    episodes: [
      {
        id: "a",
        action: "receive",
        object: "service-requests",
        instrument: "case-system",
        scope: "national",
        known: true,
      },
      {
        id: "b",
        action: "coordinate",
        object: "rights-complaints",
        instrument: "case-system",
        scope: "national",
        known: true,
      },
    ],
  };
  const result = assessOffice(opening, PILOT_WORK, person, "human-rights");
  assert.equal(result.work.find(item => item.id === "rights-intake")?.fit, "unproven");
});

test("renomear a pasta não altera a avaliação; informação oculta gera incerteza", () => {
  const opening = openingPilotGovernment();
  const renamed = changed(opening, {
    type: "rename",
    office: "health",
    label: "Saúde e Tecnologia",
  });
  const person = PILOT_PEOPLE.healthNegotiator;
  assert.deepEqual(
    assessOffice(opening, PILOT_WORK, person, "health"),
    assessOffice(renamed, PILOT_WORK, person, "health"),
  );
  const hidden = {
    id: person.id,
    episodes: person.episodes.map(episode => ({ ...episode, known: false })),
  };
  const result = assessOffice(opening, PILOT_WORK, hidden, "health");
  assert.ok(result.work.every(item => item.fit === "unknown"));
});

test("episódio oculto mantém incerteza mesmo com outra experiência conhecida", () => {
  const opening = openingPilotGovernment();
  const person = {
    id: "partial-record",
    episodes: [
      { ...PILOT_PEOPLE.healthNegotiator.episodes[0], known: false },
      PILOT_PEOPLE.healthNegotiator.episodes[1],
    ],
  };
  const result = assessOffice(opening, PILOT_WORK, person, "health");
  assert.equal(result.work.find(item => item.id === "health-federation")?.fit, "unknown");
  assert.equal(result.work.find(item => item.id === "sanitary-policy")?.fit, "unknown");
});

test("a mesma informação presidencial produz o mesmo parecer com qualquer histórico oculto", () => {
  const government = openingPilotGovernment();
  const visible = {
    id: "partial-visible-record",
    knownHistoryComplete: false,
    episodes: [PILOT_PEOPLE.healthNegotiator.episodes[1]],
  };
  const withHidden = {
    ...visible,
    episodes: [...visible.episodes, { ...PILOT_PEOPLE.healthNegotiator.episodes[0], known: false }],
  };
  assert.deepEqual(
    assessOffice(government, PILOT_WORK, visible, "health"),
    assessOffice(government, PILOT_WORK, withHidden, "health"),
  );
});

test("um ID oculto não contamina a identidade das evidências conhecidas", () => {
  const government = openingPilotGovernment();
  const visible = PILOT_PEOPLE.healthNegotiator;
  const withHidden = {
    ...visible,
    episodes: [...visible.episodes, { ...visible.episodes[0], known: false }],
  };
  assert.deepEqual(
    assessOffice(government, PILOT_WORK, visible, "health"),
    assessOffice(government, PILOT_WORK, withHidden, "health"),
  );
});

test("a completude conhecida do registro distingue lacuna de incerteza", () => {
  const government = openingPilotGovernment();
  const person = {
    id: "record-with-gap",
    episodes: [PILOT_PEOPLE.healthNegotiator.episodes[1]],
  };
  const incomplete = assessOffice(
    government,
    PILOT_WORK,
    { ...person, knownHistoryComplete: false },
    "health",
  );
  const complete = assessOffice(
    government,
    PILOT_WORK,
    { ...person, knownHistoryComplete: true },
    "health",
  );
  assert.equal(incomplete.work.find(item => item.id === "health-federation")?.fit, "unknown");
  assert.equal(complete.work.find(item => item.id === "health-federation")?.fit, "unproven");
});

/**
 * @param {Parameters<typeof compareGovernment>[0]} before
 * @param {Parameters<typeof compareGovernment>[1]} after
 * @param {Parameters<typeof compareGovernment>[6]} beforeAppointments
 * @param {Parameters<typeof compareGovernment>[7]} afterAppointments
 */
const comparePlan = (before, after, beforeAppointments, afterAppointments) =>
  compareGovernment(
    before,
    after,
    PILOT_WORK,
    PILOT_INSTITUTIONS,
    PILOT_ASSETS,
    PILOT_ASSETS,
    beforeAppointments,
    afterAppointments,
  );

test("manter a estrutura e trocar o titular muda evidência, sem mover trabalho", () => {
  const state = openingPilotGovernment();
  const result = comparePlan(
    state,
    state,
    { "human-rights": PILOT_PEOPLE.rightsOmbudsman },
    { "human-rights": PILOT_PEOPLE.rightsEducator },
  );
  assert.deepEqual(result.workMoves, []);
  assert.equal(result.preparationBefore[0]?.work.filter(item => item.fit === "direct").length, 2);
  assert.equal(result.preparationAfter[0]?.work.filter(item => item.fit === "direct").length, 1);
  assert.deepEqual(result.continuity.newlyUnresolved, []);
});

test("fundir mostra trabalho, currículo e casos pendentes frente a manter", () => {
  const before = openingPilotGovernment();
  const after = changed(before, { type: "merge", into: "education", from: "human-rights" });
  const result = comparePlan(
    before,
    after,
    { education: PILOT_PEOPLE.rightsEducator, "human-rights": PILOT_PEOPLE.rightsOmbudsman },
    { education: PILOT_PEOPLE.rightsEducator },
  );
  assert.equal(result.workMoves.length, 3);
  assert.deepEqual(result.closedOffices, ["human-rights"]);
  assert.deepEqual(result.continuity.lost, []);
  assert.deepEqual(
    result.continuity.newlyUnresolved.map(item => item.id),
    ["rights-cases", "rights-team"],
  );
});

test("extinguir distribui cada trabalho e deixa vínculo da Ouvidoria a resolver", () => {
  const before = openingPilotGovernment();
  const after = changed(before, {
    type: "abolish",
    office: "human-rights",
    destinations: {
      "rights-intake": "health",
      "rights-followup": "health",
      "rights-education": "education",
    },
  });
  const result = comparePlan(
    before,
    after,
    { "human-rights": PILOT_PEOPLE.rightsOmbudsman },
    { health: PILOT_PEOPLE.healthNegotiator, education: PILOT_PEOPLE.rightsEducator },
  );
  assert.deepEqual(
    result.workMoves.map(item => [item.id, item.to]),
    [
      ["rights-education", "education"],
      ["rights-followup", "health"],
      ["rights-intake", "health"],
    ],
  );
  assert.ok(result.unresolved.some(item => item.institution === "rights-ombudsman"));
  assert.deepEqual(result.continuity.lost, []);
});

test("criar Saúde Digital move informação, sem fabricar equipe ou preparo", () => {
  const before = openingPilotGovernment();
  const after = changed(before, {
    type: "create",
    label: "Saúde Digital",
    competencies: ["health-information"],
  });
  const result = comparePlan(
    before,
    after,
    { health: PILOT_PEOPLE.healthNegotiator },
    { health: PILOT_PEOPLE.healthNegotiator, "ministry-1": PILOT_PEOPLE.digitalManager },
  );
  assert.deepEqual(result.newOffices, ["ministry-1"]);
  assert.deepEqual(result.workMoves, [
    { id: "health-information", from: "health", to: "ministry-1" },
  ]);
  assert.equal(
    result.preparationAfter.find(item => item.office === "ministry-1")?.work[0]?.fit,
    "direct",
  );
  assert.deepEqual(result.continuity.created, []);
});

test("o parecer acusa a mesma pessoa em duas pastas", () => {
  const state = openingPilotGovernment();
  const result = comparePlan(
    state,
    state,
    {},
    {
      health: PILOT_PEOPLE.healthNegotiator,
      "human-rights": PILOT_PEOPLE.healthNegotiator,
    },
  );
  assert.deepEqual(result.appointmentConflictsAfter, [
    { person: PILOT_PEOPLE.healthNegotiator.id, offices: ["health", "human-rights"] },
  ]);
});

test("pasta criada sem titular aparece como vaga, sem impedir a reforma", () => {
  const before = openingPilotGovernment();
  const after = changed(before, {
    type: "create",
    label: "Saúde Digital",
    competencies: ["health-information"],
  });
  const result = comparePlan(
    before,
    after,
    { health: PILOT_PEOPLE.healthNegotiator },
    { health: PILOT_PEOPLE.healthNegotiator },
  );
  assert.deepEqual(result.vacanciesAfter, ["ministry-1"]);
  assert.deepEqual(result.newOffices, ["ministry-1"]);
});

test("exonerar titular sem reformar a pasta também aparece como vaga", () => {
  const state = openingPilotGovernment();
  const result = comparePlan(state, state, { health: PILOT_PEOPLE.healthNegotiator }, {});
  assert.deepEqual(result.vacanciesAfter, ["health"]);
  assert.deepEqual(result.workMoves, []);
});

test("nomeação remanescente em pasta extinta aparece no parecer", () => {
  const before = openingPilotGovernment();
  const after = changed(before, { type: "merge", into: "health", from: "human-rights" });
  const appointments = {
    health: PILOT_PEOPLE.healthNegotiator,
    "human-rights": PILOT_PEOPLE.rightsOmbudsman,
  };
  const result = comparePlan(before, after, appointments, appointments);
  assert.deepEqual(result.appointmentsWithoutActiveOfficeBefore, []);
  assert.deepEqual(result.appointmentsWithoutActiveOfficeAfter, ["human-rights"]);
  assert.deepEqual(
    result.preparationAfter.map(item => item.office),
    ["health"],
  );
});
