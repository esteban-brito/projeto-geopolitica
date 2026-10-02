/* O MODELO DA BASE (docs/spec/base-model.md §6): as provas nasceram antes do código. */

import assert from "node:assert/strict";
import test from "node:test";
import { situationOf } from "../../src/application/turn.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { SEATS, SIMPLE_MAJORITY } from "../../src/data/regime.mjs";
import * as eclusa from "../../src/domain/congress/index.mjs";
import { createState } from "../../src/state/state.mjs";

const SEED = 20270101;
const CENTER = { economic: 50, liberty: 50 };

/** @param {string} id */
function partyOf(id) {
  const party = PARTIES.find(item => item.id === id);
  assert.ok(party, `partido ${id} fora do catálogo`);
  return party;
}

/** @param {{ economic: number, liberty: number }} a @param {{ economic: number, liberty: number }} b */
function distance(a, b) {
  return Math.hypot(a.economic - b.economic, a.liberty - b.liberty);
}

test("nenhum Presidente começa com maioria firme, de nenhum partido", () => {
  for (const ruling of [null, ...PARTIES.map(party => party.id)]) {
    const loyalty = eclusa.openingLoyalty({ parties: PARTIES, ruling });
    const firm = eclusa.firmCount({ parties: PARTIES, loyalty, seed: SEED });
    assert.ok(firm < SIMPLE_MAJORITY, `com ${ruling ?? "ninguém"} no governo, ${firm} firmes`);
  }
});

test("os prováveis de um Presidente de centro ficam entre 60% e 82% da Câmara", () => {
  /* Âncora: apoio médio de 63,6% a 81,3% nos oito primeiros meses (pesquisa 17). */
  for (const ruling of ["mdn", "pdst"]) {
    const loyalty = eclusa.openingLoyalty({ parties: PARTIES, ruling });
    const probable = eclusa.baseCount({ parties: PARTIES, loyalty });
    assert.ok(
      probable >= 0.6 * SEATS && probable <= 0.82 * SEATS,
      `com ${ruling}, ${probable} prováveis de ${SEATS}`,
    );
  }
});

test("oposição declarada nunca passa de 35%", () => {
  for (const home of [CENTER, ...PARTIES]) {
    for (const party of PARTIES) {
      const chance = eclusa.partyChance({ party, home, stance: "opposition" });
      assert.ok(chance <= 0.35, `${party.sigla} na oposição com ${chance}`);
    }
  }
});

test("perto do governo, sem pasta e fora da oposição: entre 65% e 93%", () => {
  for (const home of PARTIES) {
    for (const party of PARTIES) {
      if (party === home || party.neverBase || distance(party, home) > 20) continue;
      const chance = eclusa.partyChance({ party, home });
      assert.ok(
        chance >= 0.65 && chance <= 0.93,
        `${party.sigla} perto de ${home.sigla}: ${chance}`,
      );
    }
  }
});

test("a pasta sobe a chance e nunca a leva a 100%", () => {
  for (const home of PARTIES) {
    for (const party of PARTIES) {
      if (party === home || party.neverBase) continue;
      const without = eclusa.partyChance({ party, home });
      const served = eclusa.partyChance({ party, home, share: 1 });
      assert.ok(served > without, `${party.sigla} com ${home.sigla}: ${without} → ${served}`);
      assert.ok(served <= 0.95, `${party.sigla} com pasta chegou a ${served}`);
    }
  }
});

test("PML e PLI não entram na base, nem com pasta", () => {
  for (const id of ["pml", "pli"]) {
    const party = partyOf(id);
    assert.ok(party.neverBase, `${party.sigla} devia recusar ministério`);
    for (const home of PARTIES.filter(item => item !== party)) {
      assert.ok(eclusa.partyChance({ party, home, share: 1 }) <= 0.35);
    }
  }
});

test("a soma das chances por deputado bate com a soma por partido", () => {
  const loyalty = eclusa.openingLoyalty({ parties: PARTIES, ruling: "pcs" });
  const byParty =
    PARTIES.reduce((sum, party) => sum + party.seats * (loyalty[party.id] ?? 0), 0) / 100;
  const byDeputy = eclusa
    .deputyChances({ parties: PARTIES, loyalty, seed: SEED })
    .reduce((sum, chance) => sum + chance, 0);
  assert.ok(Math.abs(byDeputy - byParty) <= 5, `${byDeputy} por deputado contra ${byParty}`);
});

test("a oposição vota a pauta que ela mesma defende", () => {
  /* Multiplicar a adesão pela chance de oposição recusava a própria pauta do partido. */
  const party = partyOf("pcn");
  const bill = { economic: party.economic, liberty: party.liberty, threat: 0 };
  const forecast = eclusa.whipCount({
    bill,
    parties: [party],
    funding: { [party.id]: 0 },
    loyalty: { [party.id]: 20 },
  });
  const adherence = forecast.parties[0]?.adherence ?? 0;
  assert.ok(adherence >= 0.5, `o PCN na oposição deu ${adherence} à própria pauta`);
});

test("sem emenda e sem promessa, a lealdade vai para a chance estrutural", () => {
  /** @type {Record<string, number>} */
  const targets = { pcs: 92, mdn: 60, pcn: 20 };
  const parties = ["pcs", "mdn", "pcn"].map(partyOf);
  /** @type {Record<string, number>} */
  let loyalty = { pcs: 50, mdn: 90, pcn: 70 };
  for (let month = 0; month < 24; month++) {
    loyalty = eclusa.settle({ parties, loyalty, promised: {}, paid: {}, targets });
  }
  for (const [id, target] of Object.entries(targets)) {
    assert.ok(Math.abs((loyalty[id] ?? 0) - target) < 1, `${id} em ${loyalty[id]}, alvo ${target}`);
  }
});

test("o PML na oposição não põe o governo em crise", () => {
  const state = createState(SEED, CATALOG, null, "pcs");
  const reading = situationOf(
    { ...state, loyalty: { ...state.loyalty, pml: 12, pli: 12 } },
    CATALOG,
  );
  assert.notEqual(reading.reason, "rupture");
});
