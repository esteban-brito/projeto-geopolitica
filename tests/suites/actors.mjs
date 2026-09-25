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

const THRESHOLDS = { salience: 0.2, conflict: 0.05, risk: 0.5 };

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

/**
 * @param {Partial<Actor>} [over]
 * @returns {Actor}
 */
function minister(over = {}) {
  return {
    id: "ministra",
    core: { riskAversion: 1, persistence: 1 },
    beliefs: {},
    goals: [
      { id: "mais-verba", subject: "verba", op: "atLeast", target: 100, span: 50, weight: 1 },
    ],
    intention: null,
    ...over,
  };
}

/**
 * @param {number} goodwill
 * @param {number} [money]
 * @returns {Percept[]}
 */
function news(goodwill, money = 60) {
  return [
    { subject: "boa-vontade-do-lider", value: goodwill, quality: 1, source: "reuniao" },
    { subject: "verba", value: money, quality: 1, source: "orcamento" },
  ];
}

/**
 * @param {Actor} actor
 * @param {Percept[]} percepts
 * @param {number} [tick]
 * @param {{ plans?: Plan[], appraise?: Appraise, thresholds?: typeof THRESHOLDS }} [over]
 */
function run(actor, percepts, tick = 0, over = {}) {
  return decide({
    actor,
    percepts,
    plans: over.plans ?? PLANS,
    appraise: over.appraise ?? appraise,
    thresholds: over.thresholds ?? THRESHOLDS,
    tick,
  });
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
  assert.deepEqual(actor.beliefs["verba"]?.sources, ["orcamento"]);
  assert.equal(actor.beliefs["verba"]?.updatedAt, 3);
  assert.ok(seen.length > 0);
  for (const keys of seen) assert.deepEqual(keys, ["beliefs", "core", "goals", "intention"]);
});

test("OBJETIVO SEM CRENCA NAO VIRA PRIORIDADE — a ausencia fica declarada", () => {
  const { action, trace } = run(minister(), []);
  assert.equal(action, null);
  assert.deepEqual(trace.goals, [{ id: "mais-verba", priority: 0, known: false }]);
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
  const base = run(
    minister({
      goals: [
        { id: "base-fiel", subject: "apoio", op: "atLeast", target: 80, span: 40, weight: 1 },
      ],
    }),
    [...news(0.8), { subject: "apoio", value: 50, quality: 1, source: "conversa" }],
  );
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

  const torn = run(
    minister({
      goals: [
        { id: "mais-verba", subject: "verba", op: "atLeast", target: 100, span: 50, weight: 1 },
        { id: "base-fiel", subject: "apoio", op: "atLeast", target: 80, span: 40, weight: 1.07 },
      ],
      intention: start.actor.intention,
    }),
    [...news(0.8), { subject: "apoio", value: 50, quality: 1, source: "conversa" }],
    1,
  );
  assert.ok(torn.trace.triggers.some(t => t.kind === "conflict"));
});

test("ESPERAR E UMA INTENCAO: sem plano que valha a pena, o ator espera e nao reotimiza", () => {
  /** @type {Appraise} */
  const bleak = () => ({ effects: { verba: 1 }, risk: 0.9, cost: 1 });
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
    minister({
      id: "lider",
      goals: [
        { id: "base-fiel", subject: "apoio", op: "atLeast", target: 80, span: 40, weight: 1 },
      ],
    }),
    minister({
      id: "relator",
      core: { riskAversion: 0, persistence: 1 },
      goals: [
        { id: "mais-verba", subject: "verba", op: "atLeast", target: 90, span: 30, weight: 2 },
      ],
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
