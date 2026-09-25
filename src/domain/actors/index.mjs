/* VONTADE — o que um ator faz com o que lhe chega.
   recebe   o estado do ator, as percepções do tick, o repertório de planos, a avaliação e os
            limiares — os três últimos vêm de quem compõe
   devolve  crenças, objetivos priorizados, intenção e ação, e o trace que explica a escolha

   Objetivo, intenção e ação são três coisas: o objetivo é o resultado buscado, a intenção é o
   plano escolhido para buscá-lo, a ação é o passo concreto do plano. O ator nunca lê o mundo:
   só percepções. Nenhum coeficiente de jogo mora aqui; pesos e limiares entram por parâmetro. */

/**
 * @typedef {object} Percept o que chegou ao ator neste tick
 * @property {string} subject
 * @property {number} value
 * @property {number} quality - de 0 a 1: o quanto esta percepção move a crença
 * @property {string} source
 * @typedef {object} Belief
 * @property {number} estimate
 * @property {number} confidence - de 0 a 1
 * @property {string[]} sources
 * @property {number} updatedAt - o tick da última percepção
 * @typedef {object} Goal o resultado que o ator busca: um sujeito acima ou abaixo de um alvo
 * @property {string} id
 * @property {string} subject
 * @property {"atLeast" | "atMost"} op
 * @property {number} target
 * @property {number} span - a distância do alvo que leva a prioridade ao máximo
 * @property {number} weight
 * @typedef {object} Intention o plano adotado para um objetivo; plano nulo é esperar
 * @property {string | null} goal
 * @property {string | null} plan
 * @property {number} step - o próximo passo do plano
 * @property {boolean} done
 * @property {number} since
 * @property {Record<string, number | null>} basis - as crenças em que a escolha se apoiou
 * @typedef {object} Core traços que mudam pouco; ausente vale neutro
 * @property {number} [riskAversion] - multiplica o risco avaliado
 * @property {number} [persistence] - multiplica a mudança necessária para reconsiderar
 * @typedef {object} Actor
 * @property {string} id
 * @property {Core} core
 * @property {Record<string, Belief>} beliefs
 * @property {Goal[]} goals
 * @property {Intention | null} intention
 * @typedef {object} Step
 * @property {string} kind
 * @property {string | null} target
 * @typedef {object} Plan um caminho válido para este ator agora, montado por quem compõe
 * @property {string} id
 * @property {Step[]} actions
 * @typedef {object} Appraisal
 * @property {Record<string, number>} effects - a mudança esperada em cada sujeito
 * @property {number} [risk]
 * @property {number} [cost]
 * @property {number} [uncertainty]
 * @property {number} [coherence]
 * @typedef {object} View o que a avaliação pode ler: o próprio ator, e nada do mundo
 * @property {Readonly<Record<string, Belief>>} beliefs
 * @property {Core} core
 * @property {ReadonlyArray<Goal>} goals
 * @property {Intention | null} intention
 * @typedef {(plan: Plan, view: View) => Appraisal} Appraise
 * @typedef {object} Thresholds
 * @property {number} salience - mudança relativa de uma crença de apoio que reabre a intenção
 * @property {number} conflict - distância máxima entre as duas maiores prioridades que obriga deliberar
 * @property {number} risk - risco do plano corrente que obriga deliberar
 * @typedef {object} Action
 * @property {string} actor
 * @property {string} kind
 * @property {string | null} target
 * @property {string} plan
 * @property {string | null} goal
 * @typedef {object} Priority
 * @property {string} id
 * @property {number} priority
 * @property {boolean} known - falso quando o ator não tem crença sobre o sujeito do objetivo
 * @typedef {"unplanned" | "satisfied" | "failure" | "basis" | "conflict" | "risk"} TriggerKind
 * @typedef {{ kind: TriggerKind, subject?: string }} Trigger
 * @typedef {object} Candidate
 * @property {string} plan
 * @property {number} utility
 * @property {Record<string, number>} parts - cada termo já com sinal; `goal:<id>` por objetivo
 * @typedef {object} Reason
 * @property {string} term
 * @property {number} weight
 * @typedef {object} Trace
 * @property {string} actor
 * @property {number} tick
 * @property {"heuristic" | "deliberative"} mode
 * @property {Trigger[]} triggers
 * @property {{ subject: string, was: number | null, now: number, confidence: number, sources: string[] }[]} beliefs
 * @property {Priority[]} goals
 * @property {string[]} decisive - as crenças que a avaliação leu
 * @property {Candidate[]} candidates - vazio no modo heurístico
 * @property {{ was: string | null, now: string | null, outcome: "adopted" | "kept" | "waiting" | "none" }} intention
 * @property {Action | null} action
 * @property {Reason[]} reasons - os termos que mais pesaram no plano escolhido
 * @typedef {object} Decision
 * @property {Actor} actor
 * @property {Action | null} action
 * @property {Trace} trace
 */

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** @param {string} a @param {string} b */
function byId(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * @param {Record<string, Belief>} beliefs
 * @param {ReadonlyArray<Percept>} percepts
 * @param {number} tick
 */
function perceive(beliefs, percepts, tick) {
  /** @type {Record<string, Belief>} */
  const next = { ...beliefs };
  /** @type {Trace["beliefs"]} */
  const changed = [];
  for (const percept of percepts) {
    const quality = clamp(percept.quality, 0, 1);
    const prior = next[percept.subject];
    const estimate = prior
      ? prior.estimate + (percept.value - prior.estimate) * quality
      : percept.value;
    const confidence = prior ? prior.confidence + (1 - prior.confidence) * quality : quality;
    const sources = prior?.sources.includes(percept.source)
      ? prior.sources
      : [...(prior?.sources ?? []), percept.source];
    next[percept.subject] = { estimate, confidence, sources, updatedAt: tick };
    changed.push({
      subject: percept.subject,
      was: prior?.estimate ?? null,
      now: estimate,
      confidence,
      sources,
    });
  }
  changed.sort((a, b) => byId(a.subject, b.subject));
  return { beliefs: next, changed };
}

/**
 * @param {ReadonlyArray<Goal>} goals
 * @param {Record<string, Belief>} beliefs
 * @returns {Priority[]}
 */
function prioritize(goals, beliefs) {
  return [...goals]
    .sort((a, b) => byId(a.id, b.id))
    .map(goal => {
      const belief = beliefs[goal.subject];
      if (!belief) return { id: goal.id, priority: 0, known: false };
      const gap =
        goal.op === "atLeast" ? goal.target - belief.estimate : belief.estimate - goal.target;
      const reach = goal.span > 0 ? gap / goal.span : gap > 0 ? 1 : 0;
      return { id: goal.id, priority: goal.weight * clamp(reach, 0, 1), known: true };
    });
}

/**
 * @param {number | null | undefined} was
 * @param {number | undefined} now
 */
function shift(was, now) {
  if (now === undefined) return 0;
  if (was === null || was === undefined) return Infinity;
  const scale = Math.max(Math.abs(was), Math.abs(now));
  return scale === 0 ? 0 : Math.abs(now - was) / scale;
}

/**
 * @param {object} input
 * @param {Actor} input.actor
 * @param {ReadonlyArray<Percept>} input.percepts
 * @param {ReadonlyArray<Plan>} input.plans
 * @param {Appraise} input.appraise
 * @param {Thresholds} input.thresholds
 * @param {number} input.tick
 * @returns {Decision}
 */
export function decide({ actor, percepts, plans, appraise, thresholds, tick }) {
  const { beliefs, changed } = perceive(actor.beliefs, percepts, tick);
  const goals = prioritize(actor.goals, beliefs);
  const priorityOf = new Map(goals.map(goal => [goal.id, goal.priority]));
  const riskAversion = actor.core.riskAversion ?? 1;
  const persistence = actor.core.persistence ?? 1;
  const current = actor.intention;

  /* A avaliação declara o que leu por acesso, e não por lista: uma lista escrita à mão que
     esquecesse um sujeito desligaria a reconsideração em silêncio. */
  /** @type {Set<string>} */
  const reads = new Set();
  const frozen = Object.freeze({ ...beliefs });
  /** @type {View} */
  const view = {
    beliefs: new Proxy(frozen, {
      get(target, key) {
        if (typeof key === "string") reads.add(key);
        return Reflect.get(target, key);
      },
    }),
    core: actor.core,
    goals: actor.goals,
    intention: current,
  };

  /** @param {Plan} plan @returns {Candidate} */
  const score = plan => {
    const appraisal = appraise(plan, view);
    /** @type {Record<string, number>} */
    const parts = {};
    for (const goal of [...actor.goals].sort((a, b) => byId(a.id, b.id))) {
      const priority = priorityOf.get(goal.id) ?? 0;
      const effect = appraisal.effects[goal.subject] ?? 0;
      if (priority === 0 || effect === 0) continue;
      const direction = goal.op === "atLeast" ? 1 : -1;
      parts[`goal:${goal.id}`] = (priority * direction * effect) / (goal.span > 0 ? goal.span : 1);
    }
    if (appraisal.coherence) parts["coherence"] = appraisal.coherence;
    if (appraisal.risk) parts["risk"] = -riskAversion * appraisal.risk;
    if (appraisal.cost) parts["cost"] = -appraisal.cost;
    if (appraisal.uncertainty) parts["uncertainty"] = -appraisal.uncertainty;
    const utility = Object.values(parts).reduce((sum, part) => sum + part, 0);
    return { plan: plan.id, utility, parts };
  };

  const ranked = [...goals].sort((a, b) => b.priority - a.priority || byId(a.id, b.id));
  const [first, second] = ranked;
  const sought = (first?.priority ?? 0) > 0;
  const planOf = new Map(plans.map(plan => [plan.id, plan]));
  const active = current?.plan ? planOf.get(current.plan) : undefined;

  /** @type {Trigger[]} */
  const triggers = [];
  if (!current && sought) triggers.push({ kind: "unplanned" });
  if (current) {
    if (current.goal !== null && (priorityOf.get(current.goal) ?? 0) === 0)
      triggers.push({ kind: "satisfied" });
    if (current.plan !== null && !current.done && (!active || !active.actions[current.step])) {
      triggers.push({ kind: "failure" });
    }
    for (const subject of [
      ...new Set([...Object.keys(current.basis), ...actor.goals.map(g => g.subject)]),
    ].sort(byId)) {
      if (
        shift(current.basis[subject], beliefs[subject]?.estimate) >=
        thresholds.salience * persistence
      ) {
        triggers.push({ kind: "basis", subject });
      }
    }
    if (
      first &&
      second &&
      second.priority > 0 &&
      first.priority - second.priority <= thresholds.conflict
    ) {
      triggers.push({ kind: "conflict" });
    }
    if (active && !current.done && (appraise(active, view).risk ?? 0) >= thresholds.risk) {
      triggers.push({ kind: "risk" });
    }
  }

  const deliberative = triggers.length > 0 && sought;
  /** @type {Candidate[]} */
  let candidates = [];
  /** @type {Intention | null} */
  let intention = sought ? current : null;
  /** @type {Trace["intention"]["outcome"]} */
  let outcome = intention ? (intention.plan ? "kept" : "waiting") : "none";

  if (deliberative) {
    candidates = [...plans].sort((a, b) => byId(a.id, b.id)).map(score);
    const best = candidates.reduce(
      (top, candidate) => (!top || candidate.utility > top.utility ? candidate : top),
      /** @type {Candidate | null} */ (null),
    );
    const basis = /** @type {Record<string, number | null>} */ ({});
    for (const subject of [...new Set([...reads, ...actor.goals.map(g => g.subject)])].sort(byId)) {
      basis[subject] = beliefs[subject]?.estimate ?? null;
    }
    if (best && best.utility > 0) {
      const served = Object.entries(best.parts)
        .filter(([term, value]) => term.startsWith("goal:") && value > 0)
        .sort((a, b) => b[1] - a[1] || byId(a[0], b[0]))[0];
      const goal = served ? served[0].slice("goal:".length) : null;
      const same = current?.plan === best.plan && !current.done;
      intention = {
        goal,
        plan: best.plan,
        step: same ? current.step : 0,
        done: false,
        since: same ? current.since : tick,
        basis,
      };
      outcome = same ? "kept" : "adopted";
    } else {
      intention = { goal: first?.id ?? null, plan: null, step: 0, done: false, since: tick, basis };
      outcome = "waiting";
    }
  }

  /** @type {Action | null} */
  let action = null;
  const plan = intention?.plan ? planOf.get(intention.plan) : undefined;
  const next = intention && plan && !intention.done ? plan.actions[intention.step] : undefined;
  if (intention && plan && next) {
    action = {
      actor: actor.id,
      kind: next.kind,
      target: next.target,
      plan: plan.id,
      goal: intention.goal,
    };
    const step = intention.step + 1;
    intention = { ...intention, step, done: step >= plan.actions.length };
  }

  const chosen = candidates.find(candidate => candidate.plan === intention?.plan);
  const reasons = chosen
    ? Object.entries(chosen.parts)
        .map(([term, weight]) => ({ term, weight }))
        .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight) || byId(a.term, b.term))
        .slice(0, 3)
    : [];

  return {
    actor: { ...actor, beliefs, intention },
    action,
    trace: {
      actor: actor.id,
      tick,
      mode: deliberative ? "deliberative" : "heuristic",
      triggers,
      beliefs: changed,
      goals,
      decisive: [...reads].sort(byId),
      candidates,
      intention: { was: current?.plan ?? null, now: intention?.plan ?? null, outcome },
      action,
      reasons,
    },
  };
}
