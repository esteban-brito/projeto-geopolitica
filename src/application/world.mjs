/* O MUNDO — quem age sem o Presidente pedir.
   recebe   o estado do mês, o elenco, o que o mês produziu e as cartas respondidas
   devolve  o que cada pessoa passou a saber e querer, os gestos dela e o que eles mudam
   Os ministros das pastas das áreas e os porta-vozes de partido percebem o mês, decidem pela
   VONTADE e agem. Todo gesto vira carta com autor; nenhum nasce de sorteio. */

import { decide } from "../domain/actors/index.mjs";
import { ministers, trait } from "../domain/cast/index.mjs";
import { STANDING_NEUTRAL } from "../domain/congress/index.mjs";
import { CATALOG } from "../data/catalog.mjs";
import { SEATS } from "../data/regime.mjs";

/**
 * @typedef {import("../state/state.mjs").GameState} GameState
 * @typedef {import("../state/state.mjs").Letter} Letter
 * @typedef {import("../state/state.mjs").Appointee} Appointee
 * @typedef {import("../state/state.mjs").Agent} AgentState
 * @typedef {import("../domain/cast/index.mjs").Person} Person
 * @typedef {import("../domain/actors/index.mjs").Actor} Actor
 * @typedef {import("../domain/actors/index.mjs").Plan} Plan
 * @typedef {import("../domain/actors/index.mjs").Percept} Percept
 * @typedef {import("../domain/actors/index.mjs").Appraise} Appraise
 * @typedef {import("../domain/actors/index.mjs").SubjectOf} SubjectOf
 *
 * @typedef {object} Agent quem age neste mês, montado do elenco e do gabinete
 * @property {string} id
 * @property {"minister" | "leader"} kind
 * @property {string} name
 * @property {string} role - o cargo em uma linha, como a carta o assina
 * @property {string | null} party
 * @property {string | null} area - a área do ministro
 * @property {string | null} seat - a cadeira do ministro
 * @property {boolean} appointed - o ministro foi nomeado; o interino não se demite
 * @property {string} ambition - a do porta-voz; o ministro quer a verba da pasta
 * @property {string} portfolio - a pasta que o porta-voz cobiça
 * @property {number} hope
 * @property {number} pride
 * @property {number} hold
 * @property {number} riskAversion
 * @property {number} persistence
 * @property {number} economic - a posição econômica, de 0 a 100
 * @property {number} liberty - a posição nas liberdades, de 0 a 100
 *
 * @typedef {object} Facts o que o mês deixou, na régua de quem percebe
 * @property {Record<string, number>} funding - financiado contra pedido, por área
 * @property {Record<string, number>} served - o quanto as pastas servem cada partido
 * @property {Record<string, number>} paid - a verba das emendas paga a cada partido, de 0 a 1
 * @property {number} standing - a aprovação publicada
 * @property {ReadonlyArray<Letter>} resolved - as cartas que o mês fechou
 * @property {ReadonlyArray<Letter>} open - as perguntas ainda abertas
 *
 * @typedef {object} World
 * @property {Record<string, AgentState>} agents
 * @property {Letter[]} letters
 * @property {string[]} vacate - cadeiras que ficam vagas no fim do mês
 * @property {string[]} left - partidos que deixaram a base neste mês
 */

/* A escala de cada sujeito: a mudança que conta para reabrir uma escolha. */
const MATERIAL = /** @type {const} */ ({
  verba: 0.05,
  dignidade: 0.1,
  cargo: 0.5,
  servida: 0.1,
  desgaste: 0.1,
  emendas: 0.05,
  palanque: 0.1,
});

/* O valor sem notícia de cada sujeito, com peso mínimo: a evidência do mês decide. */
const NEUTRAL = {
  verba: 1,
  dignidade: 1,
  cargo: 1,
  servida: 0,
  desgaste: 0,
  emendas: 0,
  palanque: 0,
};

/** @type {SubjectOf} */
const subjectOf = subject => {
  if (subject === "aceita") return { family: "aceita", material: 0.25, supersede: "none" };
  const material = MATERIAL[/** @type {keyof typeof MATERIAL} */ (subject)];
  if (material === undefined) throw new Error(`sujeito sem escala: ${subject}`);
  return { family: subject, material, supersede: "latest-per-source" };
};

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * QUEM AGE: um porta-voz por partido, e o ministro de cada pasta das áreas.
 * @param {object} input
 * @param {GameState} input.state
 * @param {ReadonlyArray<Person>} input.people
 * @param {ReadonlyArray<string>} input.taken - nomes já usados na partida
 * @param {typeof CATALOG} [input.catalog]
 * @returns {Agent[]}
 */
export function rosterOf({ state, people, taken, catalog = CATALOG }) {
  const { agency } = catalog;
  /** @param {string} id @param {string} name @param {number} min @param {number} max */
  const draw = (id, name, min, max) => trait(state.seed, id, name, min, max);
  const labelOf = (/** @type {string} */ id) =>
    catalog.parties.find(party => party.id === id)?.label ?? id;

  /* O LÍDER FALA PELA BANCADA; sem líder, fala o cacique dela. O chefe da Casa Civil é do
     governo, e não porta-voz de partido. */
  const rank = (/** @type {Person} */ person) => (person.office === "leader" ? 0 : 1);
  const voices = [...people]
    .filter(person => person.office !== "chief")
    .sort((a, b) => rank(a) - rank(b) || (a.id < b.id ? -1 : 1));
  /** @type {Map<string, Person>} */
  const byBloc = new Map();
  for (const person of voices) if (!byBloc.has(person.bloc)) byBloc.set(person.bloc, person);

  /** @type {Agent[]} */
  const leaders = [...byBloc.values()].map(person => ({
    id: person.id,
    kind: "leader",
    name: person.name,
    role: `${person.label}, ${labelOf(person.bloc)}`,
    party: person.bloc,
    area: null,
    seat: null,
    appointed: false,
    ambition: person.ambition,
    portfolio: person.portfolio,
    hope: draw(person.id, "hope", agency.hopeMin, agency.hopeMax),
    pride: draw(person.id, "pride", agency.prideMin, agency.prideMax),
    hold: 1,
    riskAversion: draw(person.id, "risk", agency.riskMin, agency.riskMax),
    persistence: 1,
    economic: person.economic,
    liberty: person.liberty,
  }));

  const sitting = state.cabinet ?? {};
  const cabinet = ministers({
    seed: state.seed,
    roles: catalog.ministers,
    taken,
    firstNames: catalog.firstNames,
    surnames: catalog.surnames,
    genderOf: catalog.genderOf,
    sitting,
  });
  /** @type {Agent[]} */
  const cabinetAgents = cabinet.map((minister, index) => {
    const role = catalog.ministers[index];
    const seat = catalog.cabinet.find(item => item.id === role?.seat);
    const post = (seat?.label ?? "").split(" ").slice(1).join(" ");
    return {
      id: minister.person,
      kind: "minister",
      name: minister.name,
      role: `${minister.gender === "f" ? "ministra" : "ministro"} ${post}`.trim(),
      party: minister.party,
      area: minister.area,
      seat: role?.seat ?? null,
      appointed: Boolean(role && sitting[role.seat]),
      ambition: "cabinet",
      portfolio: minister.area,
      hope: minister.hope,
      pride: draw(minister.person, "pride", agency.prideMin, agency.prideMax),
      hold: draw(minister.person, "hold", agency.holdMin, agency.holdMax),
      riskAversion: minister.riskAversion,
      persistence: minister.persistence,
      economic: 50,
      liberty: 50,
    };
  });

  return [...leaders, ...cabinetAgents];
}

/**
 * O PROGRAMA MAIS CORTADO DA ÁREA, e o nível da posse que o ministro pede de volta.
 * @param {GameState} state
 * @param {string} area
 * @param {typeof CATALOG} catalog
 * @returns {{ id: string, label: string, now: number, level: number } | null}
 */
function leverOf(state, area, catalog) {
  let best = null;
  for (const program of catalog.programs) {
    if (program.area !== area) continue;
    const now = state.levels[program.id] ?? program.initial;
    const gap = program.initial - now;
    if (gap > 0 && (!best || gap > best.initial - best.now)) {
      best = { id: program.id, label: program.label, now, initial: program.initial };
    }
  }
  return best ? { id: best.id, label: best.label, now: best.now, level: best.initial } : null;
}

/**
 * A CADEIRA QUE O PARTIDO PEDE: a da pasta que o porta-voz cobiça, senão a primeira que o
 * partido não tem, começando pelas vagas. Cadeira que outro partido já pediu não se pede.
 * @param {Agent} agent
 * @param {Record<string, Appointee>} cabinet
 * @param {ReadonlySet<string>} claimed
 * @param {typeof CATALOG} catalog
 */
function seatWanted(agent, cabinet, claimed, catalog) {
  const free = (/** @type {string} */ id) => cabinet[id]?.party !== agent.party && !claimed.has(id);
  const coveted = catalog.cabinet.find(seat => seat.area === agent.portfolio);
  if (coveted && free(coveted.id)) return coveted;
  return (
    catalog.cabinet.find(seat => !cabinet[seat.id] && free(seat.id)) ??
    catalog.cabinet.find(seat => free(seat.id)) ??
    null
  );
}

/**
 * QUEM O PARTIDO INDICA: gente da bancada, com nome que a partida ainda não usou.
 * @param {number} seed
 * @param {Agent} agent
 * @param {string} seat
 * @param {ReadonlyArray<string>} taken
 * @param {typeof CATALOG} catalog
 * @returns {Appointee}
 */
function nomineeOf(seed, agent, seat, taken, catalog) {
  const used = new Set(taken.flatMap(name => name.split(" ")));
  const { firstNames, surnames } = catalog;
  for (let attempt = 0; attempt < firstNames.length * surnames.length; attempt++) {
    const first =
      firstNames[
        Math.floor(
          trait(seed, `${agent.party}:${seat}`, `first:${attempt}`, 0, 1) * firstNames.length,
        )
      ] ?? "";
    const last =
      surnames[
        Math.floor(trait(seed, `${agent.party}:${seat}`, `last:${attempt}`, 0, 1) * surnames.length)
      ] ?? "";
    if (first && last && !used.has(first) && !used.has(last)) {
      return { id: `${agent.party}:${seat}`, name: `${first} ${last}`, party: agent.party };
    }
  }
  return { id: `${agent.party}:${seat}`, name: agent.name, party: agent.party };
}

/** @param {Agent} agent @param {typeof CATALOG} catalog @returns {Actor["goals"]} */
function goalsOf(agent, catalog) {
  const { agency } = catalog;
  const dignity = {
    id: "dignidade",
    subject: "dignidade",
    op: /** @type {const} */ ("atLeast"),
    target: agency.dignityTarget,
    span: agency.dignityTarget,
    weight: agent.pride,
  };
  if (agent.kind === "minister") {
    return [
      {
        id: "verba",
        subject: "verba",
        op: "atLeast",
        target: agency.content,
        span: agency.fundingSpan,
        weight: 1,
      },
      dignity,
      { id: "cargo", subject: "cargo", op: "atLeast", target: 1, span: 1, weight: agent.hold },
    ];
  }
  const weights = catalog.drives.find(drive => drive.id === agent.ambition) ?? {
    served: 1,
    wear: 1,
    money: 1,
    stage: 1,
  };
  return [
    {
      id: "palanque",
      subject: "palanque",
      op: "atLeast",
      target: 0.3,
      span: 0.3,
      weight: weights.stage,
    },
    {
      id: "emendas",
      subject: "emendas",
      op: "atLeast",
      target: agency.moneyFloor,
      span: agency.moneyFloor,
      weight: weights.money,
    },
    { id: "pastas", subject: "servida", op: "atLeast", target: 1, span: 1, weight: weights.served },
    {
      id: "desgaste",
      subject: "desgaste",
      op: "atMost",
      target: agency.wearFloor,
      span: 0.5,
      weight: weights.wear,
    },
    dignity,
  ];
}

/**
 * A DIGNIDADE DO MÊS: recusa e silêncio ferem, atendimento cura, e o tempo cura devagar.
 * @param {number} was
 * @param {ReadonlyArray<Letter>} answered - as perguntas desta pessoa fechadas neste mês
 * @param {typeof CATALOG} catalog
 */
function dignityAfter(was, answered, catalog) {
  const { agency } = catalog;
  let dignity = was + (1 - was) * agency.drift;
  for (const letter of answered) {
    dignity =
      letter.answer === "accept"
        ? dignity + (1 - dignity) * agency.heal
        : dignity * (1 - agency.hurt);
  }
  return clamp(dignity, 0, 1);
}

/**
 * UM MÊS DE MUNDO.
 * @param {object} input
 * @param {GameState} input.state
 * @param {ReadonlyArray<Agent>} input.roster
 * @param {Facts} input.facts
 * @param {Record<string, Appointee>} input.cabinet - o gabinete depois das nomeações do mês
 * @param {ReadonlyArray<string>} input.taken
 * @param {typeof CATALOG} [input.catalog]
 * @returns {World}
 */
export function worldOf({ state, roster, facts, cabinet, taken, catalog = CATALOG }) {
  const { agency } = catalog;
  const month = state.month;
  const previous = state.agents ?? {};
  const ruling = state.party ?? null;
  const labelOf = (/** @type {string | null} */ id) =>
    catalog.parties.find(party => party.id === id)?.label ?? null;
  /* O governo mora onde mora o partido do Presidente; sem partido, no centro. */
  const home = catalog.parties.find(party => party.id === ruling) ?? { economic: 50, liberty: 50 };
  /* A oposição fala e quem ficou ouve: cada crítica do mês anterior pesa sobre a base. */
  const chorus = state.mail.filter(
    letter => letter.month === month - 1 && (letter.voice ?? "").startsWith("leader.criticize"),
  ).length;
  const weakness = Math.max(0, (STANDING_NEUTRAL - facts.standing) / STANDING_NEUTRAL);

  /** @type {Record<string, AgentState>} */
  const agents = {};
  /** @type {Letter[]} */
  const letters = [];
  /** @type {Set<string>} */
  const vacate = new Set();
  /** @type {string[]} */
  const left = [];

  const claimed = new Set(
    facts.open.flatMap(letter =>
      letter.kind === "ask" && letter.nominee && letter.lever ? [letter.lever] : [],
    ),
  );

  for (const agent of roster) {
    const was = previous[agent.id] ?? { beliefs: {}, intention: null, dignity: 1, spoke: null };
    const answered = facts.resolved.filter(
      letter => letter.kind === "ask" && letter.from === agent.id,
    );
    const accepted = answered.some(letter => letter.answer === "accept" && letter.nominee);
    const out = accepted ? false : Boolean(was.out);
    const dignity = dignityAfter(was.dignity, answered, catalog);
    const asking = facts.open.some(letter => letter.kind === "ask" && letter.from === agent.id);
    const quiet = was.spoke === null || month - was.spoke >= agency.quiet;
    /* Quem acabou de pedir espera antes de pedir de novo, atendido ou não. */
    const patient = was.asked === undefined || month - was.asked >= agency.quiet;
    /* Quem acabou de ganhar o que pediu não ameaça nem sai: agradece por um tempo. */
    const granted = accepted ? month : was.granted;
    const grateful = granted !== undefined && month - granted < agency.quiet;
    const lineage = `${agent.id}:${month}`;

    /** @type {Percept[]} */
    const percepts = [
      {
        subject: "dignidade",
        value: dignity,
        quality: 1,
        source: "self",
        lineage: `dignidade:${lineage}`,
        asOf: month,
      },
      ...answered.map(letter => ({
        subject: "aceita",
        value: letter.answer === "accept" ? 1 : 0,
        quality: agency.answerQuality,
        source: "presidente",
        lineage: letter.id,
        asOf: month,
      })),
    ];

    /** @type {Plan[]} */
    const plans = [];
    const lever =
      agent.kind === "minister" && agent.area ? leverOf(state, agent.area, catalog) : null;
    const target = agent.kind === "leader" ? seatWanted(agent, cabinet, claimed, catalog) : null;
    const bench = catalog.parties.find(party => party.id === agent.party);
    const held = Object.values(cabinet).filter(item => item.party === agent.party).length;
    const fair = bench ? (bench.seats / SEATS) * catalog.cabinet.length : 0;
    const served = agent.party ? (facts.served[agent.party] ?? 0) : 0;
    /* A distância ideológica do governo, de 0 a 1: quanto mais longe, mais pesa ficar ao lado dele. */
    const distance =
      Math.hypot((agent.economic - home.economic) / 100, (agent.liberty - home.liberty) / 100) /
      Math.SQRT2;
    const wear = out
      ? 0
      : Math.min(1, weakness * (1 + agency.distance * distance) + chorus * agency.chorus);
    const funding = agent.area ? (facts.funding[agent.area] ?? 1) : 1;
    const money = agent.party ? (facts.paid[agent.party] ?? 0) : 0;
    const threats = accepted ? 0 : (was.threats ?? 0);

    if (agent.kind === "minister") {
      percepts.push(
        {
          subject: "verba",
          value: funding,
          quality: 1,
          source: "fazenda",
          lineage: `verba:${lineage}`,
          asOf: month,
        },
        {
          subject: "cargo",
          value: 1,
          quality: 1,
          source: "self",
          lineage: `cargo:${lineage}`,
          asOf: month,
        },
      );
      if (lever && !asking && patient && funding < agency.content)
        plans.push({ id: "pedir", actions: [{ kind: "ask", target: lever.id }] });
      if (quiet && dignity < 0.9)
        plans.push({ id: "reclamar", actions: [{ kind: "complain", target: null }] });
      if (agent.appointed && dignity < agency.dignityFloor)
        plans.push({ id: "sair", actions: [{ kind: "resign", target: agent.seat }] });
    } else {
      percepts.push(
        {
          subject: "servida",
          value: served,
          quality: 1,
          source: "gabinete",
          lineage: `servida:${lineage}`,
          asOf: month,
        },
        {
          subject: "desgaste",
          value: wear,
          quality: 0.9,
          source: "pesquisa",
          lineage: `desgaste:${lineage}`,
          asOf: month,
        },
        {
          subject: "palanque",
          value: 0,
          quality: 1,
          source: "self",
          lineage: `palanque:${lineage}`,
          asOf: month,
        },
        {
          subject: "emendas",
          value: money,
          quality: 1,
          source: "gabinete",
          lineage: `emendas:${lineage}`,
          asOf: month,
        },
      );
      /* Quem saiu espera ser chamado; só bate na porta de um governo popular. */
      const courting = !out || facts.standing >= STANDING_NEUTRAL + agency.bandwagon;
      if (target && !asking && patient && served < 1 && courting)
        plans.push({ id: "pedir", actions: [{ kind: "ask", target: target.id }] });
      if (!out && agent.party !== ruling && quiet && !grateful && (dignity < 0.9 || served < 0.5)) {
        plans.push({ id: "ameacar", actions: [{ kind: "threaten", target: null }] });
      }
      if (
        !out &&
        !grateful &&
        agent.party !== ruling &&
        (wear > agency.wearFloor || dignity < agency.dignityFloor)
      ) {
        plans.push({ id: "desembarcar", actions: [{ kind: "leave", target: agent.party }] });
      }
      /* Quem saiu faz oposição quando o governo está fraco, no ritmo de quem fala em público. */
      if (out && quiet && weakness > 0) {
        plans.push({ id: "criticar", actions: [{ kind: "criticize", target: null }] });
      }
    }

    /* Um ministro a mais pesa a fração de uma cadeira contra a bancada: 145 deputados querem
       onze pastas, e a segunda vale menos que a primeira quando a conta passa de um. */
    const marginal = fair > 0 ? Math.min(1, (held + 1) / fair) - Math.min(1, held / fair) : 0;

    /** @type {Appraise} */
    const appraise = (plan, view) => {
      const estimate = (/** @type {string} */ subject, /** @type {number} */ fallback) =>
        view.beliefs[subject]?.estimate ?? fallback;
      const accept = clamp(estimate("aceita", agent.hope), 0, 1);
      const honour = clamp(estimate("dignidade", dignity), 0, 1);
      const grace = 1 - honour;
      const snub = -(1 - accept) * agency.hurt * honour;
      if (agent.kind === "minister") {
        const gap = Math.max(0, agency.content - estimate("verba", funding));
        if (plan.id === "pedir")
          return { effects: { verba: gap * accept, dignidade: snub }, risk: 0 };
        if (plan.id === "reclamar") {
          return {
            effects: {
              verba: gap * agency.pull * accept,
              dignidade: grace * agency.face,
              cargo: -agency.exposure,
            },
            risk: 0,
          };
        }
        return { effects: { dignidade: grace, cargo: -1 }, risk: 0 };
      }
      const nowServed = estimate("servida", served);
      const nowWear = estimate("desgaste", wear);
      if (plan.id === "pedir") {
        return { effects: { servida: marginal * accept, dignidade: snub }, risk: 0 };
      }
      if (plan.id === "criticar") return { effects: { palanque: weakness }, risk: 0 };
      if (plan.id === "ameacar") {
        return {
          effects: {
            servida: marginal * agency.pull * accept,
            desgaste: -nowWear * agency.pull,
            dignidade: grace * agency.face * agency.repeat ** threats,
          },
          risk: agency.threatRisk,
        };
      }
      return {
        effects: {
          servida: -nowServed,
          desgaste: -nowWear,
          dignidade: grace,
          emendas: -estimate("emendas", money),
        },
        risk: 0,
      };
    };

    const actor = /** @type {Actor} */ ({
      id: agent.id,
      core: { riskAversion: agent.riskAversion, persistence: agent.persistence },
      beliefs: was.beliefs,
      goals: goalsOf(agent, catalog),
      intention: was.intention,
      /* Só a chance de ser atendido parte de uma expectativa; o resto vem inteiro da evidência. */
      priors: {
        aceita: { value: agent.hope, weight: 1 },
        ...Object.fromEntries(
          Object.entries(NEUTRAL).map(([family, value]) => [family, { value, weight: 0.01 }]),
        ),
      },
    });
    const decision = decide({
      actor,
      percepts,
      plans,
      appraise,
      thresholds: { conflict: 0.05, risk: 0.5 },
      subjectOf,
      tick: month,
    });
    const action = decision.action;
    const tone = agent.pride >= 1 ? "firm" : agent.hope >= 0.7 ? "polite" : "plain";
    const by = { name: agent.name, role: agent.role, party: labelOf(agent.party) };
    /** @param {"ask" | "said"} kind @param {string} voice @param {Partial<Letter>} extra @returns {Letter} */
    const letter = (kind, voice, extra) => ({
      id: `${kind}:${agent.id}:${voice}:${month}`,
      kind,
      month,
      due: kind === "ask" ? month + 2 : null,
      subject: null,
      bill: null,
      except: [],
      saved: null,
      from: agent.id,
      lever: null,
      level: null,
      was: null,
      now: null,
      answer: null,
      closedAt: null,
      by,
      voice: `${voice}.${tone}`,
      nominee: null,
      ...extra,
    });

    let spoke = was.spoke;
    let nowOut = out;
    let nowDignity = dignity;
    let nowThreats = threats;
    let asked = was.asked;
    if (action?.plan === "pedir") asked = month;
    if (action?.plan === "pedir" && agent.kind === "minister" && lever) {
      letters.push(
        letter("ask", "minister.ask", {
          subject: lever.label,
          lever: lever.id,
          level: lever.level,
          was: lever.now,
          now: lever.level,
        }),
      );
    } else if (action?.plan === "pedir" && target) {
      claimed.add(target.id);
      letters.push(
        letter("ask", "leader.post", {
          subject: target.label,
          lever: target.id,
          nominee: nomineeOf(state.seed, agent, target.id, taken, catalog),
          was: held,
          now: Math.round(fair),
        }),
      );
    } else if (action?.plan === "reclamar") {
      spoke = month;
      nowDignity = dignity + (1 - dignity) * agency.face;
      letters.push(
        letter("said", "minister.complain", {
          subject: agent.area
            ? (catalog.areas.find(area => area.id === agent.area)?.label ?? null)
            : null,
        }),
      );
    } else if (action?.plan === "sair" && agent.seat) {
      vacate.add(agent.seat);
      nowDignity = 1;
      letters.push(letter("said", "minister.resign", { subject: agent.seat }));
    } else if (action?.plan === "ameacar") {
      spoke = month;
      nowThreats = threats + 1;
      nowDignity = dignity + (1 - dignity) * agency.face;
      letters.push(letter("said", "leader.threaten", { was: held, now: Math.round(fair) }));
    } else if (action?.plan === "criticar") {
      spoke = month;
      letters.push(letter("said", "leader.criticize", {}));
    } else if (action?.plan === "desembarcar" && agent.party) {
      spoke = month;
      nowOut = true;
      nowDignity = 1;
      left.push(agent.party);
      for (const [seat, item] of Object.entries(cabinet))
        if (item.party === agent.party) vacate.add(seat);
      letters.push(letter("said", "leader.leave", { was: held }));
    }

    agents[agent.id] = {
      beliefs: decision.actor.beliefs,
      intention: decision.actor.intention,
      dignity: nowDignity,
      spoke,
      ...(nowOut ? { out: true } : {}),
      ...(nowThreats > 0 ? { threats: nowThreats } : {}),
      ...(asked !== undefined ? { asked } : {}),
      ...(granted !== undefined ? { granted } : {}),
    };
  }

  return { agents, letters, vacate: [...vacate].sort(), left };
}
