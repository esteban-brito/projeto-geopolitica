/* SUITE · O CORTE DO BIMESTRE (E0) — ministros de verdade em volta da conta de sempre. */

import assert from "node:assert/strict";
import test from "node:test";
import { briefingOf, cabinetOf, momentOf } from "../../src/application/contingency.mjs";
import { rehearsal, upkeepOf } from "../../src/application/scenario.mjs";
import { settlement } from "../../src/application/turn.mjs";
import { calendarOf } from "../../src/application/calendar.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";

/** @typedef {import("../../src/application/contingency.mjs").Step} Step */

const STATE = rehearsal(7);
const ORDERS = { levels: STATE.levels, funding: upkeepOf(STATE), protect: [] };
const BIG = ["industry", "welfare", "security", "defense"];

test("O ENSAIO CHEGA AO RELATORIO DO MES 21 COM CORTE, pelas regras do jogo", () => {
  assert.equal(STATE.month, 21);
  assert.ok(calendarOf(STATE.month).now.some(landmark => landmark.id === "bimestral"));
  const brief = briefingOf(STATE, ORDERS);
  assert.ok(brief.hole > 0, "o perfil do ensaio abre um buraco");
  assert.deepEqual(rehearsal(7), STATE, "mesma semente, mesma partida");
});

test("O PARECER E O SETTLEMENT, lido por area: oito areas e nenhuma conta paralela", () => {
  const orders = { ...ORDERS, protect: ["industry"] };
  const brief = briefingOf(STATE, orders);
  const share = settlement(STATE, orders);
  assert.equal(brief.areas.length, CATALOG.areas.length);
  assert.equal(brief.room, share.room);
  assert.equal(brief.amendments, share.paidCost);
  for (const area of brief.areas) assert.equal(area.paid, share.allocated[area.id] ?? 0);
  assert.ok(brief.areas.find(area => area.id === "industry")?.spared);
});

test("NAO DA PARA PROTEGER TODO MUNDO sem estourar o espaco: a emenda nao vira lixeira", () => {
  const all = briefingOf(STATE, { ...ORDERS, protect: CATALOG.areas.map(area => area.id) });
  assert.ok(all.overflow > 0, "protegidas as oito, o corte nao tem onde cair");
  const four = briefingOf(STATE, { ...ORDERS, protect: BIG });
  assert.equal(four.overflow, 0);
  const rest = four.areas.filter(area => !BIG.includes(area.id) && area.asked > 0);
  const even = briefingOf(STATE, ORDERS).areas.find(area => area.asked > 0)?.cut ?? 0;
  assert.ok(rest.every(area => area.cut > even));
});

test("OS MINISTROS SAO PESSOAS DA SEMENTE, e o cargo manda no que defendem", () => {
  assert.deepEqual(cabinetOf(STATE), cabinetOf(STATE));
  const other = cabinetOf(rehearsal(8, 1));
  assert.notDeepEqual(
    cabinetOf(STATE).map(m => m.name),
    other.map(m => m.name),
  );
  for (const seed of [1, 2, 3, 4, 5]) {
    const { decisions, cabinet } = momentOf(rehearsal(seed, 1), ORDERS, []);
    for (const minister of cabinet) {
      const goals = decisions.get(minister.id)?.actor.goals ?? [];
      for (const goal of goals)
        assert.ok(goal.subject === `verba:${minister.area}` || goal.subject === "estouro");
    }
  }
});

test("A POSICAO SAI DO DECIDE: quem ainda perde pede, e quem foi protegido se da por satisfeito", () => {
  const open = momentOf(STATE, ORDERS, []);
  for (const stance of open.stances) {
    const decision = open.decisions.get(stance.minister);
    if (stance.kind === "protect" || stance.kind === "contest") {
      assert.equal(stance.plan, decision?.actor.intention?.plan);
    }
  }
  const spared = momentOf(STATE, ORDERS, [{ kind: "draft", protect: ["industry"] }]);
  assert.equal(spared.stances.find(s => s.area === "industry")?.kind, "satisfied");
});

test("O RASCUNHO MUDA A SITUACAO: mudanca material reabre, mudanca miuda nao", () => {
  /** @type {Step[]} */
  const tiny = [{ kind: "draft", protect: ["health"] }];
  const calm = momentOf(STATE, ORDERS, tiny);
  const big = momentOf(STATE, ORDERS, [{ kind: "draft", protect: BIG }]);
  const reopened = [...big.decisions.values()].filter(d => d.trace.mode === "deliberative").length;
  const health = cabinetOf(STATE).find(m => m.area === "health")?.id;
  const still = [...calm.decisions].filter(
    ([id, d]) => id !== health && d.trace.triggers.some(t => t.kind === "basis"),
  ).length;
  assert.ok(reopened > 0, "proteger as quatro grandes mexe no corte das outras");
  assert.equal(still, 0, "proteger a Saude, que pede pouco, nao move os outros");
});

test("PEDIR ALTERNATIVA: o cauteloso cede, o ousado insiste, e ninguem obedece por regra", () => {
  const base = cabinetOf(STATE).map(m => ({ ...m, hope: 0.9 }));
  const bold = base.map(m => ({ ...m, riskAversion: 0.4 }));
  const shy = base.map(m => ({ ...m, riskAversion: 1.6 }));
  const area = "security";
  const minister = base.find(m => m.area === area)?.id ?? "";
  /** @type {Step[]} */
  const steps = [{ kind: "refuse", minister, plan: "protect" }];
  const insists = momentOf(STATE, ORDERS, steps, { cabinet: bold }).stances.find(
    s => s.area === area,
  );
  const yields = momentOf(STATE, ORDERS, steps, { cabinet: shy }).stances.find(
    s => s.area === area,
  );
  assert.equal(insists?.kind, "protect");
  assert.ok(insists?.insists);
  assert.notEqual(yields?.plan, "protect");
});

test("A RECUSA SO CHEGA A QUEM FOI RECUSADO", () => {
  const minister = cabinetOf(STATE).find(m => m.area === "defense")?.id ?? "";
  const after = momentOf(STATE, ORDERS, [{ kind: "refuse", minister, plan: "protect" }]);
  for (const [id, decision] of after.decisions) {
    const heard = Object.keys(decision.actor.beliefs).some(subject =>
      subject.startsWith("aceita:"),
    );
    assert.equal(heard, id === minister);
  }
});
