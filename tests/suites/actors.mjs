/* SUITE · VONTADE — objetivo, intenção e ação são três coisas, e o ator só sabe o que lhe chega.
   Os atores daqui são sintéticos: nenhum número deles é calibragem do jogo. */

import assert from "node:assert/strict";
import test from "node:test";
import { decide } from "../../src/domain/actors/index.mjs";
import { deepFreeze } from "../../src/state/state.mjs";

/** @typedef {import("../../src/domain/actors/index.mjs").Actor} Actor */
/** @typedef {import("../../src/domain/actors/index.mjs").Plan} Plan */
/** @typedef {import("../../src/domain/actors/index.mjs").Appraise} Appraise */
/** @typedef {import("../../src/domain/actors/index.mjs").Percept} Percept */
/** @typedef {import("../../src/domain/actors/index.mjs").Thresholds} Thresholds */
/** @typedef {import("../../src/domain/actors/index.mjs").Decision} Decision */
/** @typedef {import("../../src/domain/actors/index.mjs").Goal} Goal */
/** @typedef {import("../../src/domain/actors/index.mjs").SubjectOf} SubjectOf */
/** @typedef {Omit<Percept, "lineage" | "asOf"> & Partial<Pick<Percept, "lineage" | "asOf">>} Heard */
/** @typedef {{ plans?: Plan[], appraise?: Appraise, thresholds?: Thresholds, subjectOf?: SubjectOf }} Over */

/** @type {Thresholds} */
const THRESHOLDS = { conflict: 0.05, risk: 0.5 };

/** @type {Record<string, number>} */
const MATERIAL = { "boa-vontade-do-lider": 0.15, verba: 10, apoio: 10 };

/* O que a ministra espera antes de ouvir qualquer coisa. Com quality 1 o prior não pesa. */
const PRIORS = {
  "boa-vontade-do-lider": { value: 0.5, weight: 1 },
  verba: { value: 50, weight: 1 },
  apoio: { value: 50, weight: 1 },
  "chance-de-veto": { value: 0, weight: 1 },
  votos: { value: 100, weight: 1 },
  reais: { value: 5000, weight: 1 },
  inflacao: { value: 4, weight: 1 },
  reserva: { value: 100, weight: 1 },
};

/** @type {Plan[]} */
const PLANS = [
  {
    id: "negociar",
    actions: [
      { kind: "pedir-reuniao", target: "lider" },
      { kind: "propor-acordo", target: "lider" },
    ],
  },
  { id: "pressionar", actions: [{ kind: "declarar-em-publico", target: null }] },
  { id: "mobilizar-base", actions: [{ kind: "convocar-bancada", target: null }] },
];

/* Negociar rende com a boa vontade do líder; pressionar rende quando ela falta, e arrisca. */
/** @type {Appraise} */
const appraise = (plan, view) => {
  const goodwill = view.beliefs["boa-vontade-do-lider"]?.estimate ?? 0.5;
  if (plan.id === "negociar") return { effects: { verba: 40 * goodwill }, risk: 0.1 };
  if (plan.id === "pressionar") return { effects: { verba: 30 * (1 - goodwill) }, risk: 0.4 };
  return { effects: { apoio: 20 }, risk: 0.1 };
};

/** @type {Goal} */
const MORE_MONEY = {
  id: "mais-verba",
  subject: "verba",
  op: "atLeast",
  target: 100,
  span: 50,
  weight: 1,
};
/** @type {Goal} */
const LOYAL_BASE = {
  id: "base-fiel",
  subject: "apoio",
  op: "atLeast",
  target: 80,
  span: 40,
  weight: 1,
};

/**
 * @param {Partial<Actor>} [over]
 * @returns {Actor}
 */
function minister(over = {}) {
  return {
    id: "ministra",
    core: { riskAversion: 1, persistence: 1 },
    beliefs: {},
    goals: [MORE_MONEY],
    intention: null,
    priors: PRIORS,
    ...over,
  };
}

/** @returns {Actor} */
function torn() {
  return minister({ goals: [MORE_MONEY, LOYAL_BASE] });
}

/**
 * @param {number} goodwill
 * @param {number} [money]
 * @returns {Heard[]}
 */
function news(goodwill, money = 60) {
  return [
    { subject: "boa-vontade-do-lider", value: goodwill, quality: 1, source: "reuniao" },
    { subject: "verba", value: money, quality: 1, source: "orcamento" },
  ];
}

/**
 * @param {string} subject
 * @param {number} value
 * @returns {Heard}
 */
function heard(subject, value) {
  return { subject, value, quality: 1, source: "conversa" };
}

/* Cada percepção sem linhagem é uma medição nova do tick: a fonte, o sujeito e o tick a nomeiam. */
/**
 * @param {Actor} actor
 * @param {Heard[]} percepts
 * @param {number} [tick]
 * @param {Over} [over]
 */
function run(actor, percepts, tick = 0, over = {}) {
  return decide({
    actor,
    percepts: percepts.map(p => ({
      lineage: `${p.source}:${p.subject}:${tick}`,
      asOf: tick,
      ...p,
    })),
    plans: over.plans ?? PLANS,
    appraise: over.appraise ?? appraise,
    thresholds: over.thresholds ?? THRESHOLDS,
    subjectOf: over.subjectOf ?? scaled({}),
    tick,
  });
}

/**
 * @param {Record<string, number>} material
 * @returns {SubjectOf}
 */
function scaled(material) {
  /** @type {Record<string, number>} */
  const table = { ...MATERIAL, ...material };
  return subject => ({
    family: subject,
    material: /** @type {number} */ (table[subject]),
    supersede: "latest-per-source",
  });
}

/**
 * @param {Actor} start
 * @param {Heard[]} percepts
 * @param {number} ticks
 * @param {Over} [over]
 */
function modes(start, percepts, ticks, over) {
  let actor = start;
  /** @type {string[]} */
  const seen = [];
  for (let tick = 0; tick < ticks; tick++) {
    const result = run(actor, percepts, tick, over);
    actor = result.actor;
    seen.push(result.trace.mode);
  }
  return seen;
}

test("MESMA ENTRADA, MESMA DECISAO E MESMO TRACE — e a entrada nao muda", () => {
  const actor = deepFreeze(minister());
  const percepts = deepFreeze(news(0.8));
  const first = run(actor, percepts);
  const second = run(actor, percepts);
  assert.deepEqual(first, second);
  assert.ok(first.action, "a ministra com verba abaixo da meta devia agir");
});

test("A CRENCA SAI DA PERCEPCAO, e o ator nunca le o mundo", () => {
  /** @type {string[][]} */
  const seen = [];
  /** @type {Appraise} */
  const spy = (plan, view) => {
    seen.push(Object.keys(view).sort());
    return appraise(plan, view);
  };
  const { actor } = run(minister(), news(0.8), 3, { appraise: spy });

  assert.equal(actor.beliefs["verba"]?.estimate, 60);
  assert.deepEqual(
    actor.beliefs["verba"]?.entries.map(entry => entry.source),
    ["orcamento"],
  );
  assert.equal(actor.beliefs["verba"]?.updatedAt, 3);
  assert.ok(seen.length > 0);
  for (const keys of seen) assert.deepEqual(keys, ["beliefs", "core", "goals", "intention"]);
});

test("ENTRADA ESTRAGADA E RECUSADA, e a avaliacao nao altera o ator", () => {
  assert.throws(() => run(minister(), [{ ...heard("verba", 70), quality: NaN }]), /verba/);
  assert.throws(() => run(minister(), [heard("verba", Infinity)]), /verba/);

  const actor = minister();
  /** @type {Appraise} */
  const meddle = (plan, view) => {
    /** @type {{ target: number }} */ (view.goals[0]).target = 0;
    return appraise(plan, view);
  };
  assert.throws(() => run(actor, news(0.8), 0, { appraise: meddle }), TypeError);
  assert.equal(actor.goals[0]?.target, 100);
});

test("OBJETIVO SEM CRENCA NAO VIRA PRIORIDADE — a ausencia fica declarada", () => {
  const { action, trace } = run(minister(), []);
  assert.equal(action, null);
  assert.deepEqual(trace.goals, [{ id: "mais-verba", priority: 0, known: false }]);
});

test("PRIORIDADE SEM NUMERO CONGELADO: mais longe pesa mais, e crenca nova reordena", () => {
  /** @param {Decision} decision */
  const order = decision =>
    [...decision.trace.goals].sort((a, b) => b.priority - a.priority).map(goal => goal.id);
  const first = run(torn(), [...news(0.8, 90), heard("apoio", 50)]);
  assert.deepEqual(order(first), ["base-fiel", "mais-verba"]);
  const moved = run(first.actor, [heard("verba", 20), heard("apoio", 75)], 1);
  assert.deepEqual(order(moved), ["mais-verba", "base-fiel"]);
});

test("A AVALIACAO DESCREVE O MUNDO, NUNCA O VALOR: termo sem unidade e recusado", () => {
  /** @param {unknown} bad */
  const tries = bad => () =>
    run(minister(), news(0.8), 0, { appraise: () => /** @type {any} */ (bad) });
  assert.throws(tries({ effects: { verba: 40 }, cost: 1e9 }), /cost/);
  assert.throws(tries({ effects: { verba: 40 }, utility: 3 }), /utility/);
  assert.throws(tries({ effects: { verba: 40 }, risk: 3 }), /risco/);
  assert.throws(tries({ effects: { verba: NaN } }), /verba/);

  const flat = minister({ goals: [{ ...MORE_MONEY, span: 0 }] });
  assert.throws(() => run(flat, news(0.8)), /mais-verba/);
});

test("O EFEITO SO VIRA VALOR PELO OBJETIVO DO ATOR: trocar a unidade de um sujeito nao muda nada", () => {
  const thousand = 1000;
  /** @param {number} unit */
  const play = unit => {
    const actor = minister({
      goals: [{ ...MORE_MONEY, target: 100 * unit, span: 50 * unit }, LOYAL_BASE],
    });
    /** @type {Appraise} */
    const inUnit = (plan, view) => {
      const appraisal = appraise(plan, view);
      const effects = { ...appraisal.effects };
      if (effects["verba"] !== undefined) effects["verba"] *= unit;
      return { ...appraisal, effects };
    };
    return run(actor, [...news(0.8, 60 * unit), heard("apoio", 60)], 0, {
      appraise: inUnit,
      subjectOf: scaled({ verba: 10 * unit }),
    });
  };

  const one = play(1);
  const other = play(thousand);
  assert.equal(one.actor.intention?.plan, "negociar");
  assert.equal(other.actor.intention?.plan, "negociar");
  for (const [index, candidate] of one.trace.candidates.entries()) {
    const twin = other.trace.candidates[index];
    assert.ok(twin);
    const money = candidate.appraisal.effects["verba"] ?? 0;
    assert.equal(
      twin.appraisal.effects["verba"] ?? 0,
      money * thousand,
      "o efeito muda de unidade",
    );
    assert.ok(Math.abs(twin.utility - candidate.utility) < 1e-9, "o valor percebido nao");
  }
});

test("O PLANO PERSISTE diante de variacao pequena", () => {
  const start = run(minister(), news(0.8, 60), 0);
  assert.equal(start.actor.intention?.plan, "negociar");

  const next = run(start.actor, news(0.78, 62), 1);
  assert.equal(next.trace.mode, "heuristic");
  assert.equal(next.trace.intention.outcome, "kept");
  assert.equal(next.action?.kind, "propor-acordo", "o segundo passo do mesmo plano");
});

test("O CHOQUE FORCA RECONSIDERACAO, e a intencao muda", () => {
  const start = run(minister(), news(0.8), 0);
  const shock = run(start.actor, news(0.1), 1);
  assert.equal(shock.trace.mode, "deliberative");
  assert.ok(shock.trace.triggers.some(t => t.kind === "basis"));
  assert.equal(shock.actor.intention?.plan, "pressionar");
});

test("PERTO DE ZERO, POUCO CONTINUA POUCO: a mudanca se mede na escala do sujeito", () => {
  /** @type {Appraise} */
  const odds = (plan, view) => ({
    ...appraise(plan, view),
    risk: 0.5 * (view.beliefs["chance-de-veto"]?.estimate ?? 0),
  });
  const over = { appraise: odds, subjectOf: scaled({ "chance-de-veto": 0.1 }) };
  const start = run(minister(), [...news(0.8), heard("chance-de-veto", 0)], 0, over);

  const tiny = run(start.actor, [heard("chance-de-veto", 0.01)], 1, over);
  assert.equal(tiny.trace.mode, "heuristic", "0 -> 0,01 nao e 100% de mudanca");
  const real = run(start.actor, [heard("chance-de-veto", 0.5)], 1, over);
  assert.ok(real.trace.triggers.some(t => t.kind === "basis" && t.subject === "chance-de-veto"));
});

test("O MESMO DELTA PESA DIFERENTE EM ESCALAS DIFERENTES, e sujeito sem escala e recusado", () => {
  /** @type {Appraise} */
  const reads = (plan, view) => {
    const votes = view.beliefs["votos"]?.estimate ?? 0;
    const money = view.beliefs["reais"]?.estimate ?? 0;
    return { effects: { verba: plan.id === "negociar" ? votes / 10 : money / 1e4 } };
  };
  const over = { appraise: reads, subjectOf: scaled({ votos: 3, reais: 1000 }) };
  const start = run(minister(), [...news(0.8), heard("votos", 100), heard("reais", 5000)], 0, over);
  const both = run(start.actor, [heard("votos", 105), heard("reais", 5005)], 1, over);
  assert.deepEqual(
    both.trace.triggers.filter(t => t.kind === "basis").map(t => t.subject),
    ["votos"],
  );

  /** @type {Appraise} */
  const blind = (plan, view) => {
    void view.beliefs["sem-escala"];
    return appraise(plan, view);
  };
  assert.throws(() => run(minister(), news(0.8), 0, { appraise: blind }), /sem-escala/);
});

test("INFORMACAO DIFERENTE, DECISAO DIFERENTE", () => {
  const confiante = run(minister(), news(0.9));
  const desconfiada = run(minister(), news(0.1));
  assert.equal(confiante.action?.kind, "pedir-reuniao");
  assert.equal(desconfiada.action?.kind, "declarar-em-publico");
});

test("A PERSONALIDADE MUDA A DECISAO, e nao so o texto", () => {
  /* Boa vontade baixa: pressionar rende um pouco mais e arrisca mais. */
  const ousada = run(minister({ core: { riskAversion: 0, persistence: 1 } }), news(0.4));
  const cautelosa = run(minister({ core: { riskAversion: 2, persistence: 1 } }), news(0.4));
  assert.equal(ousada.actor.intention?.plan, "pressionar");
  assert.equal(cautelosa.actor.intention?.plan, "negociar");

  const start = run(minister(), news(0.8), 0);
  const teimosa = run({ ...start.actor, core: { riskAversion: 1, persistence: 3 } }, news(0.4), 1);
  const voluvel = run(start.actor, news(0.4), 1);
  assert.equal(teimosa.trace.mode, "heuristic");
  assert.equal(voluvel.trace.mode, "deliberative");
});

test("OBJETIVO NAO E INTENCAO: mesmo objetivo e crenca alterada dao outro plano", () => {
  const a = run(minister(), news(0.9));
  const b = run(minister(), news(0.1));
  assert.equal(a.actor.intention?.goal, "mais-verba");
  assert.equal(b.actor.intention?.goal, "mais-verba");
  assert.notEqual(a.actor.intention?.plan, b.actor.intention?.plan);
});

test("OBJETIVO NAO E INTENCAO: mesma percepcao e objetivo diferente dao outra decisao", () => {
  const verba = run(minister(), news(0.8));
  const base = run(minister({ goals: [LOYAL_BASE] }), [...news(0.8), heard("apoio", 50)]);
  assert.equal(verba.action?.kind, "pedir-reuniao");
  assert.equal(base.action?.kind, "convocar-bancada");
  assert.equal(base.actor.intention?.goal, "base-fiel");
});

test("O MODO SAI DAS ENTRADAS, e cada gatilho fica no trace", () => {
  const start = run(minister(), news(0.8), 0);
  assert.deepEqual(
    start.trace.triggers.map(t => t.kind),
    ["unplanned"],
  );

  const gone = run(start.actor, news(0.8), 1, { plans: PLANS.filter(p => p.id !== "negociar") });
  assert.ok(gone.trace.triggers.some(t => t.kind === "failure"));

  /** @type {Appraise} */
  const risky = (plan, view) => ({ ...appraise(plan, view), risk: 0.9 });
  const scared = run(start.actor, news(0.8), 1, { appraise: risky });
  assert.ok(scared.trace.triggers.some(t => t.kind === "risk"));

  const split = run({ ...torn(), intention: start.actor.intention }, [
    ...news(0.8),
    heard("apoio", 48),
  ]);
  assert.ok(split.trace.triggers.some(t => t.kind === "conflict"));
});

test("CONFLITO PARADO NAO REABRE A ESCOLHA; conflito que surge reabre uma vez", () => {
  const same = [...news(0.8), heard("apoio", 48)];
  assert.deepEqual(modes(torn(), same, 4), ["deliberative", "heuristic", "heuristic", "heuristic"]);

  const over = { subjectOf: scaled({ apoio: 15 }) };
  const calm = run(torn(), [...news(0.8), heard("apoio", 60)], 0, over);
  const tight = run(calm.actor, [heard("apoio", 48)], 1, over);
  assert.deepEqual(
    tight.trace.triggers.map(t => t.kind),
    ["conflict"],
    "12 de apoio fica abaixo da escala 15, mas empata os dois objetivos",
  );
  assert.equal(run(tight.actor, [heard("apoio", 48)], 2, over).trace.mode, "heuristic");
});

test("RISCO JA PESADO NA ESCOLHA NAO REABRE A CADA PASSO", () => {
  /** @type {Plan[]} */
  const plans = [
    { id: "longo", actions: ["a", "b", "c", "d"].map(kind => ({ kind, target: null })) },
  ];
  /** @type {Appraise} */
  const risky = () => ({ effects: { verba: 30 }, risk: 0.6 });
  const bold = minister({ core: { riskAversion: 0, persistence: 1 } });
  assert.deepEqual(modes(bold, news(0.8), 4, { plans, appraise: risky }), [
    "deliberative",
    "heuristic",
    "heuristic",
    "heuristic",
  ]);
});

test("ESPERAR E UMA INTENCAO: sem plano que valha a pena, o ator espera e nao reotimiza", () => {
  /** @type {Appraise} */
  const bleak = () => ({ effects: { verba: 1 }, risk: 1 });
  const first = run(minister(), news(0.5), 0, { appraise: bleak });
  assert.equal(first.action, null);
  assert.equal(first.actor.intention?.plan, null);
  const next = run(first.actor, news(0.5), 1, { appraise: bleak });
  assert.equal(next.trace.mode, "heuristic");
});

test("O PLANO CONCLUIDO AGUARDA EFEITO, e nao se repete sem informacao nova", () => {
  const plans = [{ id: "pressionar", actions: [{ kind: "declarar-em-publico", target: null }] }];
  const first = run(minister(), news(0.1), 0, { plans });
  assert.equal(first.action?.kind, "declarar-em-publico");
  const after = run(first.actor, news(0.1), 1, { plans });
  assert.equal(after.action, null);
  assert.equal(after.trace.mode, "heuristic");
});

test("O EMPATE NAO DEPENDE DA ORDEM do repertorio", () => {
  /** @type {Appraise} */
  const flat = () => ({ effects: { verba: 10 } });
  const forward = run(minister(), news(0.5), 0, { appraise: flat });
  const backward = run(minister(), news(0.5), 0, { appraise: flat, plans: [...PLANS].reverse() });
  assert.equal(forward.actor.intention?.plan, "mobilizar-base");
  assert.equal(backward.actor.intention?.plan, "mobilizar-base");
});

test("TRES ATORES, QUATRO RODADAS: o cenario se refaz igual e cada um decide pelo que busca", () => {
  const cast = [
    minister(),
    minister({ id: "lider", goals: [LOYAL_BASE] }),
    minister({
      id: "relator",
      core: { riskAversion: 0, persistence: 1 },
      goals: [{ ...MORE_MONEY, target: 90, span: 30, weight: 2 }],
    }),
  ];
  const rounds = [news(0.7), news(0.65), news(0.2), news(0.2)].map(round => [
    ...round,
    { subject: "apoio", value: 45, quality: 0.8, source: "conversa" },
  ]);

  const play = () => {
    let actors = cast;
    const log = [];
    for (const [tick, percepts] of rounds.entries()) {
      const results = actors.map(actor => run(actor, percepts, tick));
      actors = results.map(result => result.actor);
      log.push(results.map(result => result.action?.kind ?? null));
    }
    return log;
  };

  assert.deepEqual(play(), play());
  const [first] = play();
  assert.deepEqual(first, ["pedir-reuniao", "convocar-bancada", "pedir-reuniao"]);
});

/** @type {Goal} */
const CEILING = {
  id: "teto-da-inflacao",
  subject: "inflacao",
  op: "atMost",
  target: 5,
  span: 5,
  weight: 1,
};
/** @type {Goal} */
const RESERVE = {
  id: "reserva-minima",
  subject: "reserva",
  op: "atLeast",
  target: 100,
  span: 50,
  weight: 1,
};
const KNOWN = [...news(0.8), heard("inflacao", 3), heard("reserva", 120)];

/**
 * @param {Record<string, number>} effects
 * @returns {Record<string, number>}
 */
function partsOf(effects) {
  const [candidate] = run(minister({ goals: [MORE_MONEY, CEILING, RESERVE] }), KNOWN, 0, {
    plans: [{ id: "plano", actions: [{ kind: "agir", target: null }] }],
    appraise: () => ({ effects }),
    subjectOf: scaled({ inflacao: 1, reserva: 10 }),
  }).trace.candidates;
  return candidate?.parts ?? {};
}

test("OBJETIVO CUMPRIDO NAO COBRA O QUE FICA DENTRO DO ALVO, e cobra o que sai dele", () => {
  assert.equal(partsOf({ inflacao: 1 })["goal:teto-da-inflacao"], undefined, "3 -> 4, teto 5");
  assert.ok((partsOf({ inflacao: 5 })["goal:teto-da-inflacao"] ?? 0) < 0, "3 -> 8, teto 5");
  assert.equal(partsOf({ reserva: -5 })["goal:reserva-minima"], undefined, "120 -> 115, piso 100");
  assert.ok((partsOf({ reserva: -40 })["goal:reserva-minima"] ?? 0) < 0, "120 -> 80, piso 100");
  assert.ok((partsOf({ verba: 20 })["goal:mais-verba"] ?? 0) > 0, "o que ainda falta vale");
});

test("UM PLANO QUE MELHORA UM OBJETIVO E QUEBRA OUTRO paga pelos dois", () => {
  /** @type {Plan[]} */
  const plans = [
    { id: "so-verba", actions: [{ kind: "cortar-gasto", target: null }] },
    { id: "verba-com-inflacao", actions: [{ kind: "emitir-moeda", target: null }] },
  ];
  /** @type {Appraise} */
  const both = plan =>
    plan.id === "so-verba" ? { effects: { verba: 30 } } : { effects: { verba: 30, inflacao: 6 } };
  const decision = run(minister({ goals: [MORE_MONEY, CEILING] }), KNOWN, 0, {
    plans,
    appraise: both,
    subjectOf: scaled({ inflacao: 1, reserva: 10 }),
  });
  const mixed = decision.trace.candidates.find(c => c.plan === "verba-com-inflacao");
  assert.ok((mixed?.parts["goal:mais-verba"] ?? 0) > 0);
  assert.ok((mixed?.parts["goal:teto-da-inflacao"] ?? 0) < 0);
  assert.equal(decision.actor.intention?.plan, "so-verba");
});

/* A ministra espera verba no alvo (prior 100). Um corte para 20 muda o plano só se a notícia for
   forte: pedir pouco basta se ela acha que quase nada falta; pedir muito arrisca metade do ganho. */
/** @type {Plan[]} */
const ASKS = [
  { id: "pedir-pouco", actions: [{ kind: "pedir-reforco", target: null }] },
  { id: "pedir-muito", actions: [{ kind: "brigar-pelo-orcamento", target: null }] },
];
/** @type {Appraise} */
const asks = plan =>
  plan.id === "pedir-pouco" ? { effects: { verba: 10 } } : { effects: { verba: 60 }, risk: 0.5 };

/**
 * @param {number} quality
 * @param {number} [expects]
 */
function cut(quality, expects = 100) {
  const actor = minister({ priors: { ...PRIORS, verba: { value: expects, weight: 1 } } });
  return run(actor, [{ subject: "verba", value: 20, quality, source: "boato" }], 0, {
    plans: ASKS,
    appraise: asks,
  });
}

test("EVIDENCIA FRACA NAO E FORTE: o mesmo valor com quality 0,05 e 0,95 muda o plano", () => {
  const weak = cut(0.05);
  const strong = cut(0.95);
  assert.ok((weak.actor.beliefs["verba"]?.estimate ?? 0) > 90, "o boato quase nao move o prior");
  assert.ok((strong.actor.beliefs["verba"]?.estimate ?? 100) < 30);
  assert.equal(weak.actor.intention?.plan, "pedir-pouco");
  assert.equal(strong.actor.intention?.plan, "pedir-muito");
});

test("PRIORS DIFERENTES, A MESMA EVIDENCIA FRACA, DECISOES DIFERENTES", () => {
  const calm = cut(0.2, 100);
  const alarmed = cut(0.2, 20);
  const estimate = (/** @type {Decision} */ decision) =>
    decision.actor.beliefs["verba"]?.estimate ?? 0;
  assert.ok(estimate(calm) > estimate(alarmed));
  assert.notEqual(calm.actor.intention?.plan, alarmed.actor.intention?.plan);
});

test("O PRIOR NAO CRIA CONHECIMENTO: sem evidencia valida, o objetivo continua desconhecido", () => {
  const empty = run(minister(), [{ subject: "verba", value: 999, quality: 0, source: "ruido" }]);
  assert.equal(empty.actor.beliefs["verba"], undefined);
  assert.deepEqual(empty.trace.goals, [{ id: "mais-verba", priority: 0, known: false }]);
  assert.throws(
    () => run(minister({ priors: {} }), news(0.8)),
    /prior/,
    "familia sem prior e erro, nunca base inventada",
  );
});

/* ── A OPORTUNIDADE ACORDA ──────────────────────────────────────────────────────
   Achado pelo mundo vivo: o porta-voz que saiu da base esperava sem planos, a crítica virava
   possível três meses depois, e ele nunca a considerava, porque nada tinha mudado nas crenças.
   A especificação lista a oportunidade detectável como causa de despertar (§9.14). */
test("um caminho novo acorda quem esperava, e o mesmo caminho não acorda duas vezes", () => {
  const waiting = run(minister(), news(0.5), 0, { plans: [] });
  assert.equal(waiting.action, null);
  assert.equal(waiting.actor.intention?.plan ?? null, null);

  const opened = run(waiting.actor, news(0.5), 1);
  assert.ok(
    opened.trace.triggers.some(trigger => trigger.kind === "opportunity"),
    "o caminho que apareceu não foi visto",
  );
  assert.ok(opened.action, "havia um caminho que valia a pena, e a ministra seguiu esperando");

  const again = run(opened.actor, news(0.5), 2);
  assert.ok(
    !again.trace.triggers.some(trigger => trigger.kind === "opportunity"),
    "o mesmo caminho acordou duas vezes",
  );
});

test("o caminho que some e volta acorda de novo", () => {
  const first = run(minister(), news(0.5), 0);
  assert.ok(first.action);
  const closed = run(first.actor, news(0.5), 1, { plans: [] });
  const reopened = run(closed.actor, news(0.5), 2);
  assert.ok(
    reopened.trace.triggers.some(trigger => trigger.kind === "opportunity"),
    "o caminho voltou e ninguém viu",
  );
});
