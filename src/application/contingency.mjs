/* O CORTE DO BIMESTRE — o contingenciamento com gente do outro lado da mesa (ciclo 31, E0).
   recebe   o estado, as ordens do mês e o que aconteceu na reunião: rascunhos e recusas
   devolve  o parecer da Fazenda e a posição de cada ministro

   Não é motor e não tem codinome, pela mesma razão de `mail.mjs`: a conta é do `settlement`, as
   pessoas são do ELENCO e cada decisão é da VONTADE. O ministro sabe as contas do governo pelo
   parecer (q=1) e só sabe da recusa do Presidente se ela foi dirigida a ele. Ele não lembra de
   um bimestre para o outro (ciclo 31, item 14). */

import { decide } from "../domain/actors/index.mjs";
import { ministers } from "../domain/cast/index.mjs";
import { CATALOG } from "../data/catalog.mjs";
import { governmentOf, settlement } from "./turn.mjs";

/**
 * @typedef {import("../state/state.mjs").GameState} GameState
 * @typedef {import("./turn.mjs").Orders} Orders
 * @typedef {import("../domain/actors/index.mjs").Actor} Actor
 * @typedef {import("../domain/actors/index.mjs").Plan} Plan
 * @typedef {import("../domain/actors/index.mjs").Percept} Percept
 * @typedef {import("../domain/actors/index.mjs").Appraise} Appraise
 * @typedef {import("../domain/actors/index.mjs").SubjectOf} SubjectOf
 * @typedef {import("../domain/actors/index.mjs").Decision} Decision
 * @typedef {import("../domain/cast/index.mjs").Minister} Minister
 * @typedef {{ kind: "draft", protect: string[] } | { kind: "refuse", minister: string, plan: string }} Step
 * @typedef {object} AreaCut
 * @property {string} id
 * @property {number} asked - o pedido discricionário do mês
 * @property {number} paid - o que o rascunho paga
 * @property {number} cut - a fração cortada, de 0 a 1
 * @property {boolean} spared
 * @typedef {object} Briefing o parecer da Fazenda: só contas que o governo conhece
 * @property {number} room
 * @property {number} demand
 * @property {number} hole - o que falta para caber no espaço
 * @property {number} overflow - o que o rascunho gasta acima do espaço
 * @property {number} promised - as emendas prometidas do mês
 * @property {number} amendments - as emendas que o rascunho paga
 * @property {AreaCut[]} areas
 * @typedef {"none" | "satisfied" | "accepts" | "protect" | "contest"} StanceKind
 * @typedef {object} Stance o que o ministro diz e faz; nunca o que ele pesa por dentro
 * @property {string} minister
 * @property {string} name
 * @property {"f" | "m"} gender
 * @property {string} area
 * @property {StanceKind} kind
 * @property {string | null} target - a pasta cuja proteção ele contesta
 * @property {string | null} plan - a posição que "pedir alternativa" recusa
 * @property {number} cut - o corte da própria pasta no rascunho, de 0 a 1
 * @property {number | null} relief - o corte da própria pasta se o pedido for atendido
 * @property {boolean} refused - o Presidente recusou algo dele nesta reunião
 * @property {boolean} insists - a posição é uma que o Presidente já recusou
 */

/**
 * O parecer da Fazenda: a mesma conta do turno, lida por área.
 * @param {GameState} state
 * @param {Orders} orders
 * @param {typeof CATALOG} [catalog]
 * @returns {Briefing}
 */
export function briefingOf(state, orders, catalog = CATALOG) {
  const share = settlement(state, orders, catalog);
  const areas = catalog.areas.map(area => {
    const asked = share.asked[area.id] ?? 0;
    const paid = share.allocated[area.id] ?? 0;
    return {
      id: area.id,
      asked,
      paid,
      cut: asked > 0 ? Math.max(0, 1 - paid / asked) : 0,
      spared: share.protect.has(area.id),
    };
  });
  const excess = share.allocatedTotal + share.paidCost - share.room;
  return {
    room: share.room,
    demand: share.demand,
    hole: Math.max(0, share.demand - share.room),
    /* Tolerância relativa: sem ela, o ponto flutuante acusava estouro de 1,8e-15 onde não há. */
    overflow: excess > share.room * 1e-9 ? excess : 0,
    promised: share.promisedCost,
    amendments: share.paidCost,
    areas,
  };
}

/**
 * Os ministros da partida: quem o Presidente nomeou; na cadeira vaga, o interino da semente.
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {Minister[]}
 */
export function cabinetOf(state, catalog = CATALOG) {
  const government = governmentOf(state, catalog);
  return ministers({
    seed: state.seed,
    roles: catalog.ministers,
    taken: [...government.people.map(person => person.name), government.president.name],
    firstNames: catalog.firstNames,
    surnames: catalog.surnames,
    genderOf: catalog.genderOf,
    sitting: state.cabinet ?? {},
  });
}

/** @param {Minister} minister @param {ReadonlyArray<string>} draft @returns {Plan[]} */
function plansOf(minister, draft) {
  /** @type {Plan[]} */
  const plans = draft.includes(minister.area)
    ? []
    : [{ id: "protect", actions: [{ kind: "protect", target: minister.area }] }];
  for (const other of [...draft].sort()) {
    if (other !== minister.area) {
      plans.push({ id: `contest:${other}`, actions: [{ kind: "contest", target: other }] });
    }
  }
  return plans;
}

/** @param {string} plan @param {ReadonlyArray<string>} draft @param {string} own */
function hypothesis(plan, draft, own) {
  if (plan === "protect") return [...draft, own];
  const target = plan.slice("contest:".length);
  return draft.filter(id => id !== target);
}

/** @param {Briefing} briefing @param {string} area */
function cutOf(briefing, area) {
  return (
    briefing.areas.find(item => item.id === area) ?? {
      id: area,
      asked: 0,
      paid: 0,
      cut: 0,
      spared: false,
    }
  );
}

/**
 * @param {Minister} minister
 * @param {number} asked
 * @returns {Actor}
 */
function actorOf(minister, asked) {
  const own = `verba:${minister.area}`;
  return {
    id: minister.id,
    core: { riskAversion: minister.riskAversion, persistence: minister.persistence },
    beliefs: {},
    goals:
      asked > 0
        ? [
            { id: "verba", subject: own, op: "atLeast", target: asked, span: asked, weight: 1 },
            ...(minister.fiscal > 0
              ? [
                  /** @type {const} */ ({
                    id: "espaco",
                    subject: "estouro",
                    op: "atMost",
                    target: 0,
                    span: asked,
                    weight: minister.fiscal,
                  }),
                ]
              : []),
          ]
        : [],
    intention: null,
    priors: {
      [own]: { value: asked, weight: 1 },
      estouro: { value: 0, weight: 1 },
      aceita: { value: minister.hope, weight: 1 },
    },
  };
}

/**
 * A REUNIÃO: refaz, do rascunho de abertura ao último passo, o que cada ministro percebeu e
 * decidiu. Os passos são a história da reunião; a posição de hoje depende do caminho.
 * @param {GameState} state
 * @param {Orders} orders - o `protect` delas é o rascunho com que a reunião abriu
 * @param {ReadonlyArray<Step>} steps
 * @param {{ catalog?: typeof CATALOG, cabinet?: ReadonlyArray<Minister> }} [options]
 * @returns {{ briefing: Briefing, stances: Stance[], cabinet: ReadonlyArray<Minister>, decisions: Map<string, Decision> }}
 */
export function momentOf(state, orders, steps, options = {}) {
  const catalog = options.catalog ?? CATALOG;
  const cabinet = options.cabinet ?? cabinetOf(state, catalog);
  const { contingency } = catalog;
  const valid = new Set(catalog.areas.map(area => area.id));

  /** @type {Map<string, Briefing>} */
  const cache = new Map();
  /** @param {ReadonlyArray<string>} protect */
  const brief = protect => {
    const list = [...new Set(protect.filter(id => valid.has(id)))].sort();
    const key = list.join(",");
    let found = cache.get(key);
    if (!found) {
      found = briefingOf(state, { ...orders, protect: list }, catalog);
      cache.set(key, found);
    }
    return found;
  };

  /** @type {string[]} */
  let draft = [...(orders.protect ?? [])].filter(id => valid.has(id));
  const opening = brief(draft);
  let actors = cabinet.map(minister => actorOf(minister, cutOf(opening, minister.area).asked));
  /** @type {Map<string, Set<string>>} */
  const refused = new Map();
  /** @type {Map<string, Decision>} */
  const decisions = new Map();

  /** @type {SubjectOf} */
  const subjectOf = subject => {
    if (subject.startsWith("verba:")) {
      const asked = cutOf(opening, subject.slice("verba:".length)).asked;
      return {
        family: subject,
        material: Math.max(asked * contingency.material, Number.EPSILON),
        supersede: "latest-per-source",
      };
    }
    if (subject === "estouro") {
      return {
        family: "estouro",
        material: Math.max(opening.room * contingency.material, Number.EPSILON),
        supersede: "latest-per-source",
      };
    }
    return { family: "aceita", material: contingency.hopeMaterial, supersede: "latest-per-source" };
  };

  /** @type {Step[]} */
  const events = [{ kind: "draft", protect: draft }, ...steps];
  for (const [tick, step] of events.entries()) {
    if (step.kind === "draft") draft = step.protect.filter(id => valid.has(id));
    else if (!cabinet.some(minister => minister.id === step.minister)) continue;
    const now = brief(draft);
    actors = actors.map((actor, index) => {
      const minister = /** @type {Minister} */ (cabinet[index]);
      /** @type {Percept[]} */
      const percepts = [];
      if (step.kind === "draft") {
        const lineage = `fazenda:${state.month}:${tick}`;
        percepts.push(
          {
            subject: `verba:${minister.area}`,
            value: cutOf(now, minister.area).paid,
            quality: 1,
            source: "fazenda",
            lineage,
            asOf: tick,
          },
          {
            subject: "estouro",
            value: now.overflow,
            quality: 1,
            source: "fazenda",
            lineage,
            asOf: tick,
          },
        );
      } else if (step.minister === minister.id) {
        const seen = refused.get(minister.id) ?? new Set();
        seen.add(step.plan);
        refused.set(minister.id, seen);
        percepts.push({
          subject: `aceita:${step.plan}`,
          value: 0,
          quality: 1,
          source: "presidente",
          lineage: `recusa:${state.month}:${tick}`,
          asOf: tick,
        });
      }
      /** @type {Appraise} */
      const appraise = (plan, view) => {
        const own = `verba:${minister.area}`;
        const after = brief(hypothesis(plan.id, draft, minister.area));
        const accept = view.beliefs[`aceita:${plan.id}`]?.estimate ?? minister.hope;
        return {
          effects: {
            [own]: cutOf(after, minister.area).paid - cutOf(now, minister.area).paid,
            estouro: after.overflow - now.overflow,
          },
          risk: Math.min(1, Math.max(0, 1 - accept)),
        };
      };
      const decision = decide({
        actor,
        percepts,
        plans: plansOf(minister, draft),
        appraise,
        thresholds: { conflict: contingency.conflict, risk: contingency.risk },
        subjectOf,
        tick,
      });
      decisions.set(minister.id, decision);
      return decision.actor;
    });
  }

  const final = brief(draft);
  const stances = cabinet.map((minister, index) => {
    const own = cutOf(final, minister.area);
    const intention = /** @type {Actor} */ (actors[index]).intention;
    const valid = plansOf(minister, draft).some(plan => plan.id === intention?.plan);
    /** @type {StanceKind} */
    const kind =
      own.asked <= 0
        ? "none"
        : own.cut <= 1e-9
          ? "satisfied"
          : !intention?.plan || !valid
            ? "accepts"
            : intention.plan === "protect"
              ? "protect"
              : "contest";
    const plan = kind === "protect" || kind === "contest" ? (intention?.plan ?? null) : null;
    return {
      minister: minister.id,
      name: minister.name,
      gender: minister.gender,
      area: minister.area,
      kind,
      target: kind === "contest" && plan ? plan.slice("contest:".length) : null,
      plan,
      cut: own.cut,
      relief: plan ? cutOf(brief(hypothesis(plan, draft, minister.area)), minister.area).cut : null,
      refused: (refused.get(minister.id)?.size ?? 0) > 0,
      insists: plan !== null && (refused.get(minister.id)?.has(plan) ?? false),
    };
  });
  return { briefing: final, stances, cabinet, decisions };
}
