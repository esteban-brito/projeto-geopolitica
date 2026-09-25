/* SUITE · A CRENÇA — a mesma evidência não confirma a si mesma, e a crença é função do conjunto.
   As evidências e os priors daqui são sintéticos: nenhum número é calibragem do jogo. */

import assert from "node:assert/strict";
import test from "node:test";
import { revise } from "../../src/domain/actors/belief.mjs";

/** @typedef {import("../../src/domain/actors/belief.mjs").Evidence} Evidence */
/** @typedef {import("../../src/domain/actors/belief.mjs").SubjectSpec} SubjectSpec */
/** @typedef {import("../../src/domain/actors/belief.mjs").Belief} Belief */

/** @type {SubjectSpec} */
const NOW = { family: "aprovacao", material: 5, supersede: "latest-per-source" };
/** @type {SubjectSpec} */
const FACTS = { family: "aprovacao", material: 5, supersede: "none" };
const PRIOR = { value: 50, weight: 1 };

/**
 * @param {string} lineage
 * @param {string} source
 * @param {number} value
 * @param {number} [quality]
 * @param {number} [asOf]
 * @returns {Evidence}
 */
function said(lineage, source, value, quality = 0.5, asOf = 0) {
  return { subject: "aprovacao", value, quality, source, lineage, asOf };
}

/**
 * @param {Evidence[]} evidence
 * @param {SubjectSpec} [spec]
 * @returns {Belief}
 */
function once(evidence, spec = NOW) {
  const belief = revise(undefined, evidence, spec, PRIOR, 0);
  assert.ok(belief, "havia evidencia valida");
  return belief;
}

test("A MESMA LINHAGEM N VEZES E UMA EVIDENCIA SO, junta ou em ticks separados", () => {
  const one = once([said("x:0:0", "x", 40)]);
  assert.deepEqual(once([1, 2, 3, 4, 5].map(() => said("x:0:0", "x", 40))), one);
  const again = revise(one, [said("x:0:0", "x", 40)], NOW, PRIOR, 1);
  assert.equal(again?.entries.length, 1);
  assert.equal(again?.confidence, one.confidence);
});

test("A MESMA FONTE COM DUAS AMOSTRAS NO MESMO INSTANTE conta as duas", () => {
  const single = once([said("x:0:0", "x", 40)]);
  const pair = once([said("x:0:0", "x", 40), said("x:0:1", "x", 40)]);
  assert.equal(pair.entries.length, 2);
  assert.ok(pair.confidence > single.confidence);
});

test("ESTADO ATUAL: a mais nova da mesma fonte supera a antiga, e mudanca nao e contradicao", () => {
  const january = said("x:1:0", "x", 40, 0.5, 1);
  const february = said("x:2:0", "x", 50, 0.5, 2);
  const now = once([january, february]);
  assert.deepEqual(
    now.entries.map(entry => entry.lineage),
    ["x:2:0"],
  );
  assert.deepEqual(now, once([february]));
});

test("FATOS INDEPENDENTES: sem supersessao, as linhagens da mesma fonte coexistem", () => {
  const january = said("x:1:0", "x", 40, 0.5, 1);
  const february = said("x:2:0", "x", 50, 0.5, 2);
  const facts = once([january, february], FACTS);
  assert.equal(facts.entries.length, 2);
  assert.ok(facts.confidence < once([january, february]).confidence);
});

test("ORDEM E AGRUPAMENTO EM TICKS NAO MUDAM A CRENCA", () => {
  const all = [
    said("a:0:0", "a", 40, 0.3),
    said("b:0:0", "b", 55, 0.7),
    said("c:1:0", "c", 48, 0.5, 1),
    said("c:0:0", "c", 60, 0.5, 0),
    said("a:0:0", "a", 40, 0.6),
  ];
  const together = once(all);
  assert.deepEqual(once([...all].reverse()), together);
  /** @type {Belief | undefined} */
  let stepwise;
  for (const [tick, item] of all.entries()) stepwise = revise(stepwise, [item], NOW, PRIOR, tick);
  assert.deepEqual({ ...stepwise, updatedAt: 0 }, together);
});

test("FONTES INDEPENDENTES QUE DISCORDAM BAIXAM A CONFIANCA", () => {
  const agree = once([said("a:0:0", "a", 45), said("b:0:0", "b", 46)]);
  const clash = once([said("a:0:0", "a", 30), said("b:0:0", "b", 70)]);
  assert.ok(clash.confidence < agree.confidence);
});

test("EVIDENCIA FRACA PESA POUCO: a estimativa fica perto do prior", () => {
  const weak = once([said("a:0:0", "a", 10, 0.05)]);
  const strong = once([said("a:0:0", "a", 10, 0.95)]);
  assert.ok(weak.estimate > 45);
  assert.ok(strong.estimate < 15);
});

test("QUALITY 0 E NULA: sozinha nao cria crenca, junto de outra nao muda nada", () => {
  assert.equal(revise(undefined, [said("a:0:0", "a", 999, 0)], NOW, PRIOR, 0), undefined);
  assert.deepEqual(
    once([said("a:0:0", "a", 999, 0), said("b:0:0", "b", 40)]),
    once([said("b:0:0", "b", 40)]),
  );
});

test("QUALITY 1 E CERTEZA: uma, concordantes e contraditorias, sem infinito", () => {
  const single = once([said("a:0:0", "a", 40, 1)]);
  assert.equal(single.estimate, 40);
  assert.equal(single.confidence, 1);

  const agree = once([
    said("a:0:0", "a", 40, 1),
    said("b:0:0", "b", 40, 1),
    said("c:0:0", "c", 10, 0.9),
  ]);
  assert.equal(agree.estimate, 40, "a incerta nao pesa contra a certeza");
  assert.equal(agree.confidence, 1);

  const clash = once([said("a:0:0", "a", 30, 1), said("b:0:0", "b", 50, 1)]);
  assert.equal(clash.estimate, 40);
  assert.ok(Number.isFinite(clash.confidence) && clash.confidence > 0 && clash.confidence < 1);
});

test("CRENCA ERRADA COM CONFIANCA ALTA: o motor nao sabe a verdade", () => {
  /* No mundo do cenario a aprovacao e 50; tres fontes independentes dizem 20. */
  const wrong = once([
    said("a:0:0", "a", 20, 0.9),
    said("b:0:0", "b", 20, 0.9),
    said("c:0:0", "c", 20, 0.9),
  ]);
  assert.ok(wrong.estimate < 25);
  assert.ok(wrong.confidence > 0.9);
});

test("EVIDENCIA VELHA NAO SUPERA A NOVA: quem decide e o asOf, nao o tick da recepcao", () => {
  const fresh = revise(undefined, [said("x:2:0", "x", 50, 0.5, 2)], NOW, PRIOR, 1);
  const late = revise(fresh, [said("x:1:0", "x", 40, 0.5, 1)], NOW, PRIOR, 5);
  assert.deepEqual(late?.entries, fresh?.entries);
  assert.equal(late?.estimate, fresh?.estimate);
});

test("PRIORS DIFERENTES, A MESMA EVIDENCIA FRACA, CRENCAS DIFERENTES", () => {
  const weak = [said("a:0:0", "a", 40, 0.2)];
  const hopeful = revise(undefined, weak, NOW, { value: 70, weight: 1 }, 0);
  const wary = revise(undefined, weak, NOW, { value: 30, weight: 1 }, 0);
  assert.ok((hopeful?.estimate ?? 0) > (wary?.estimate ?? 0));
});

test("A MESMA LINHAGEM COM CONTEUDOS DIFERENTES E ERRO; copia repetida fica com a melhor", () => {
  assert.throws(() => once([said("a:0:0", "a", 40), said("a:0:0", "a", 41)]), /a:0:0/);
  const better = once([said("a:0:0", "a", 40, 0.3), said("a:0:0", "a", 40, 0.8)]);
  assert.equal(better.entries[0]?.quality, 0.8);
});

test("A MESMA LINHAGEM COM ASOF DIFERENTE E ERRO, mesmo onde a supersessao a esconderia", () => {
  const january = said("L", "x", 10, 0.5, 1);
  const february = said("L", "x", 10, 0.5, 2);
  assert.throws(() => once([january, february]), /"L"/);
  assert.throws(() => revise(once([january]), [february], NOW, PRIOR, 1), /"L"/);
});

test("DESCRICAO, PRIOR E EVIDENCIA INVALIDOS SAO RECUSADOS, sem valor padrao", () => {
  const valid = [said("a:0:0", "a", 40)];
  const policy = /** @type {SubjectSpec} */ (
    /** @type {unknown} */ ({ ...NOW, supersede: "latest" })
  );
  assert.throws(() => revise(undefined, valid, policy, PRIOR, 0), /aprovacao/);
  assert.throws(() => revise(undefined, valid, { ...NOW, material: 0 }, PRIOR, 0), /aprovacao/);
  assert.throws(() => revise(undefined, valid, NOW, { value: 50, weight: 0 }, 0), /prior/);
  assert.throws(() => once([said("a:0:0", "a", 40, 1.5)]), /aprovacao/);
});
