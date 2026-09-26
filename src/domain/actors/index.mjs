/* VONTADE — o que um ator faz com o que lhe chega.
   recebe   o estado do ator, as percepções do tick, o repertório de planos, a avaliação, o
            resolver de sujeitos e os limiares — os quatro últimos vêm de quem compõe
   devolve  crenças, objetivos priorizados, intenção e ação, e o trace que explica a escolha

   Objetivo, intenção e ação são três coisas: o objetivo é o resultado buscado, a intenção é o
   plano escolhido para buscá-lo, a ação é o passo concreto do plano. O ator nunca lê o mundo:
   só percepções. Nenhum coeficiente de jogo mora aqui; pesos e limiares entram por parâmetro.

   A avaliação diz o que o plano faria ao mundo, na unidade de cada sujeito, e nunca quanto isso
   vale: quem converte é o ator, pelos próprios objetivos. A crença sai de `belief.mjs`, a única
   escritora dela. A prioridade (peso × distância percebida) é provisória. */

import { revise, specified } from "./belief.mjs";

/**
 * @typedef {import("./belief.mjs").Evidence} Percept o que chegou ao ator neste tick
 * @typedef {import("./belief.mjs").Belief} Belief
 * @typedef {import("./belief.mjs").Entry} Entry
 * @typedef {import("./belief.mjs").Prior} Prior
 * @typedef {import("./belief.mjs").SubjectSpec} SubjectSpec
 * @typedef {(subject: string) => SubjectSpec} SubjectOf a descrição de cada sujeito, dada por quem compõe
 * @typedef {object} Goal o resultado que o ator busca: um sujeito acima ou abaixo de um alvo
 * @property {string} id
 * @property {string} subject
 * @property {"atLeast" | "atMost"} op
 * @property {number} target - na unidade do sujeito
 * @property {number} span - maior que zero, na unidade do sujeito: a distância do alvo que leva a prioridade ao máximo e o efeito que vale a prioridade inteira
 * @property {number} weight
 * @typedef {object} Intention o plano adotado para um objetivo; plano nulo é esperar
 * @property {string | null} goal
 * @property {string | null} plan
 * @property {number} step - o próximo passo do plano
 * @property {boolean} done
 * @property {number} since
 * @property {Record<string, number | null>} basis - as crenças em que a escolha se apoiou
 * @property {string[]} front - os objetivos na frente quando a escolha foi feita
 * @property {number} risk - o risco do plano quando foi escolhido; zero ao esperar
 * @property {string[]} [options] - os caminhos que existiam no tick anterior; ausente é nenhum
 * @typedef {object} Core traços que mudam pouco; ausente vale neutro
 * @property {number} [riskAversion] - multiplica o risco avaliado; 1 é o valor esperado
 * @property {number} [persistence] - multiplica a mudança necessária para reconsiderar
 * @typedef {object} Actor
 * @property {string} id
 * @property {Core} core
 * @property {Record<string, Belief>} beliefs
 * @property {Goal[]} goals
 * @property {Intention | null} intention
 * @property {Record<string, Prior>} priors - a expectativa do ator por família de sujeito, antes de qualquer evidência
 * @typedef {object} Step
 * @property {string} kind
 * @property {string | null} target
 * @typedef {object} Plan um caminho válido para este ator agora, montado por quem compõe
 * @property {string} id
 * @property {Step[]} actions
 * @typedef {object} Appraisal o que o plano faria ao mundo; nenhum campo é valor para o ator
 * @property {Record<string, number>} effects - a mudança esperada em cada sujeito, na unidade da crença sobre ele
 * @property {number} [risk] - de 0 a 1: a fração do ganho do plano que pode não vir; provisório, não cobre a perda além do ganho
 * @typedef {object} View o que a avaliação pode ler: o próprio ator, congelado, e nada do mundo
 * @property {Readonly<Record<string, Readonly<Belief>>>} beliefs
 * @property {Readonly<Core>} core
 * @property {ReadonlyArray<Readonly<Goal>>} goals
 * @property {Readonly<Intention> | null} intention
 * @typedef {(plan: Plan, view: View) => Appraisal} Appraise
 * @typedef {object} Thresholds
 * @property {number} conflict - distância máxima de prioridade para um objetivo contar como rival do primeiro
 * @property {number} risk - risco do plano corrente, de 0 a 1, que reabre a intenção ao ser cruzado
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
 * @typedef {"unplanned" | "satisfied" | "failure" | "basis" | "conflict" | "risk" | "opportunity"} TriggerKind
 * @typedef {{ kind: TriggerKind, subject?: string }} Trigger
 * @typedef {object} Candidate
 * @property {string} plan
 * @property {Required<Appraisal>} appraisal - o efeito esperado no mundo, como a avaliação o deu
 * @property {number} utility
 * @property {Record<string, number>} parts - o valor percebido de cada termo, com sinal; `goal:<id>` por objetivo
 * @typedef {object} Reason
 * @property {string} term
 * @property {number} weight
 * @typedef {object} Trace
 * @property {string} actor
 * @property {number} tick
 * @property {"heuristic" | "deliberative"} mode
 * @property {Trigger[]} triggers
 * @property {{ subject: string, was: number | null, now: number, confidence: number, lineages: string[] }[]} beliefs
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

const TERMS = new Set(["effects", "risk"]);

/** @param {string} a @param {string} b */
function byId(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {ReadonlyArray<string>} a @param {ReadonlyArray<string>} b */
function sameIds(a, b) {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

/**
 * @param {Actor} actor
 * @param {ReadonlyArray<Percept>} percepts
 * @param {SubjectOf} subjectOf
 * @param {number} tick
 */
function perceive(actor, percepts, subjectOf, tick) {
  /** @type {Record<string, Belief>} */
  const next = { ...actor.beliefs };
  /** @type {Trace["beliefs"]} */
  const changed = [];
  /** @type {Map<string, Percept[]>} */
  const bySubject = new Map();
  for (const percept of percepts) {
    bySubject.set(percept.subject, [...(bySubject.get(percept.subject) ?? []), percept]);
  }
  for (const subject of [...bySubject.keys()].sort(byId)) {
    const spec = specified(subjectOf(subject), subject);
    const prior = Object.hasOwn(actor.priors ?? {}, spec.family)
      ? actor.priors[spec.family]
      : undefined;
    if (!prior) throw new Error(`ator "${actor.id}" sem prior para a familia "${spec.family}"`);
    const was = next[subject];
    const now = revise(was, bySubject.get(subject) ?? [], spec, prior, tick);
    if (!now || now === was) continue;
    next[subject] = now;
    changed.push({
      subject,
      was: was?.estimate ?? null,
      now: now.estimate,
      confidence: now.confidence,
      lineages: now.entries.map(entry => entry.lineage),
    });
  }
  return { beliefs: next, changed };
}

/** @param {Goal} goal @param {number} value - quantos spans o valor está além do alvo */
function shortfall(goal, value) {
  const gap = goal.op === "atLeast" ? goal.target - value : value - goal.target;
  return Math.max(gap / goal.span, 0);
}

/* Prioridade × efeito reprovada: com a meta cumprida a prioridade é zero, e levar a inflação de
   3 a 8 com teto 5 valia 0. O valor de um objetivo é o custo de estar fora dele: peso × H, com
   H quadrática até um span além do alvo e reta depois. A inclinação de H no ponto de hoje é a
   prioridade, então efeito pequeno vale o que valia; efeito grande soma a urgência pelo caminho,
   e sair de um objetivo cumprido custa. */
/** @param {Goal} goal @param {number} value */
function strain(goal, value) {
  const beyond = shortfall(goal, value);
  return beyond <= 1 ? (beyond * beyond) / 2 : beyond - 0.5;
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
      if (!(goal.span > 0 && Number.isFinite(goal.span + goal.target) && goal.weight >= 0)) {
        throw new Error(
          `objetivo "${goal.id}" sem escala: span maior que zero, alvo e peso finitos`,
        );
      }
      const belief = beliefs[goal.subject];
      if (!belief) return { id: goal.id, priority: 0, known: false };
      return {
        id: goal.id,
        priority: goal.weight * Math.min(shortfall(goal, belief.estimate), 1),
        known: true,
      };
    });
}

/* Custo solto reprovado: 1e9 em reais somava -1e9 de utilidade. Custo material é efeito
   negativo no sujeito que paga; tempo, atenção e oportunidade entram quando o mecanismo que os
   produz existir. O risco pesa contra o ganho do próprio plano, e não contra um câmbio fixo. */
/**
 * @param {Appraisal} appraisal
 * @param {string} plan
 * @returns {Required<Appraisal>}
 */
function checked(appraisal, plan) {
  for (const key of Object.keys(appraisal)) {
    if (!TERMS.has(key)) {
      throw new Error(`"${key}" em ${plan} nao e termo da avaliacao, que so da efeito e risco`);
    }
  }
  /** @type {Record<string, number>} */
  const effects = {};
  for (const [subject, value] of Object.entries(appraisal.effects ?? {})) {
    if (!Number.isFinite(value)) throw new Error(`efeito de ${plan} em "${subject}" nao e finito`);
    effects[subject] = value;
  }
  const risk = appraisal.risk ?? 0;
  if (!(risk >= 0 && risk <= 1)) throw new Error(`risco de ${plan} fora de 0 a 1: ${risk}`);
  return { effects, risk };
}

/**
 * @param {Actor} actor
 * @param {Record<string, Belief>} beliefs
 * @param {Set<string>} reads
 * @returns {View}
 */
function viewOf(actor, beliefs, reads) {
  const frozen = Object.freeze(
    Object.fromEntries(
      Object.entries(beliefs).map(([subject, belief]) => [
        subject,
        Object.freeze({
          ...belief,
          entries: /** @type {Entry[]} */ (
            Object.freeze(belief.entries.map(entry => Object.freeze({ ...entry })))
          ),
        }),
      ]),
    ),
  );
  const current = actor.intention;
  return {
    beliefs: new Proxy(frozen, {
      get(target, key) {
        if (typeof key === "string") reads.add(key);
        return Reflect.get(target, key);
      },
    }),
    core: Object.freeze({ ...actor.core }),
    goals: Object.freeze(actor.goals.map(goal => Object.freeze({ ...goal }))),
    intention: current
      ? Object.freeze({
          ...current,
          basis: Object.freeze({ ...current.basis }),
          front: /** @type {string[]} */ (Object.freeze([...current.front])),
          options: /** @type {string[]} */ (Object.freeze([...(current.options ?? [])])),
        })
      : null,
  };
}

/**
 * @param {object} input
 * @param {Actor} input.actor
 * @param {ReadonlyArray<Percept>} input.percepts
 * @param {ReadonlyArray<Plan>} input.plans
 * @param {Appraise} input.appraise
 * @param {Thresholds} input.thresholds
 * @param {SubjectOf} input.subjectOf
 * @param {number} input.tick
 * @returns {Decision}
 */
export function decide({ actor, percepts, plans, appraise, thresholds, subjectOf, tick }) {
  const { beliefs, changed } = perceive(actor, percepts, subjectOf, tick);
  const goals = prioritize(actor.goals, beliefs);
  const priorityOf = new Map(goals.map(goal => [goal.id, goal.priority]));
  const riskAversion = actor.core.riskAversion ?? 1;
  const persistence = actor.core.persistence ?? 1;
  const current = actor.intention;
  const byGoal = [...actor.goals].sort((a, b) => byId(a.id, b.id));

  /* A avaliação declara o que leu por acesso, e não por lista: uma lista escrita à mão que
     esquecesse um sujeito desligaria a reconsideração em silêncio. */
  /** @type {Set<string>} */
  const reads = new Set();
  const view = viewOf(actor, beliefs, reads);
  /* Mudança relativa reprovada: 0 → 0,01 contava 100% e reabria a intenção. A escala de um
     sujeito vem do resolver de quem compõe; sujeito sem escala é erro, nunca zero nem infinito. */
  /** @param {string} subject */
  const materialOf = subject => specified(subjectOf(subject), subject).material;
  /** @param {Plan} plan */
  const appraised = plan => checked(appraise(plan, view), plan.id);

  /** @param {Plan} plan @returns {Candidate} */
  const score = plan => {
    const appraisal = appraised(plan);
    /** @type {Record<string, number>} */
    const parts = {};
    let gain = 0;
    for (const goal of byGoal) {
      const belief = beliefs[goal.subject];
      const effect = appraisal.effects[goal.subject] ?? 0;
      if (!belief || effect === 0) continue;
      const before = belief.estimate;
      const part = goal.weight * (strain(goal, before) - strain(goal, before + effect));
      if (part === 0) continue;
      parts[`goal:${goal.id}`] = part;
      gain += part;
    }
    const doubt = riskAversion * appraisal.risk * Math.max(gain, 0);
    if (doubt) parts["risk"] = -doubt;
    return { plan: plan.id, appraisal, utility: gain - doubt, parts };
  };

  const ranked = [...goals].sort((a, b) => b.priority - a.priority || byId(a.id, b.id));
  const [first] = ranked;
  const top = first?.priority ?? 0;
  const sought = top > 0;
  const front = sought
    ? ranked
        .filter(goal => goal.priority > 0 && top - goal.priority <= thresholds.conflict)
        .map(goal => goal.id)
        .sort(byId)
    : [];
  const planOf = new Map(plans.map(plan => [plan.id, plan]));
  const options = plans.map(plan => plan.id).sort(byId);
  const active = current?.plan ? planOf.get(current.plan) : undefined;

  /* Conflito e risco presentes reprovados como gatilho: com o estado parado, dois objetivos
     empatados reabriram a escolha em 3 de 3 ticks, e um plano de risco já pesado em 4 de 4
     passos. A intenção guarda o que a escolha viu, e só o que mudou desde então a reabre. */
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
      const unit = materialOf(subject);
      const now = beliefs[subject]?.estimate;
      if (now === undefined) continue;
      const was = current.basis[subject];
      const moved = was === null || was === undefined ? Infinity : Math.abs(now - was);
      if (moved >= unit * persistence) triggers.push({ kind: "basis", subject });
    }
    if (sought && !sameIds(current.front, front)) triggers.push({ kind: "conflict" });
    /* Um caminho que não existia quando a escolha foi feita é oportunidade (especificação §9.14);
       o mesmo caminho não acorda duas vezes, porque a escolha seguinte o registra. */
    const known = new Set(current.options ?? []);
    if (sought && plans.some(plan => !known.has(plan.id))) triggers.push({ kind: "opportunity" });
    if (active && !current.done) {
      const risk = appraised(active).risk;
      if (risk >= thresholds.risk && current.risk < thresholds.risk) {
        triggers.push({ kind: "risk" });
      }
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
      materialOf(subject);
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
        front,
        risk: best.appraisal.risk,
        options,
      };
      outcome = same ? "kept" : "adopted";
    } else {
      intention = {
        goal: first?.id ?? null,
        plan: null,
        step: 0,
        done: false,
        since: tick,
        basis,
        front,
        risk: 0,
        options,
      };
      outcome = "waiting";
    }
  }

  /* Os caminhos de agora ficam registrados a cada tick: o que some e volta é oportunidade de novo. */
  if (intention) intention = { ...intention, options };

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
