/* SUITE · A VOTACAO — a previsao, o dia, e o termo que salva o Congresso de si.
   ══════════════════════════════════════════════════════════════════════════════

   Tres coisas precisam ser provadas aqui, e a terceira e a que quase se perde:

     1. a PREVISAO e deterministica, e o DIA nao — e a separacao entre as duas e
        o que impede a votacao de virar planilha;
     2. verba compra voto, e compra mais de quem se vende mais;
     3. NENHUMA pauta e invotavel. O termo de ameaca encarece; ele nao proibe. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { vote, whipCount } from "../../src/domain/congress/index.mjs";
import { BILLS } from "../../src/data/bills.mjs";
import { PARTIES, SIMPLE_MAJORITY } from "../../src/data/parties.mjs";
import { streamFrom } from "../../src/state/random.mjs";

/** @param {number} level */
function everyone(level) {
  return Object.fromEntries(PARTIES.map(party => [party.id, level]));
}

const LOYAL = everyone(75);
const NO_MONEY = everyone(0);

/** @param {string} id */
function billOf(id) {
  const bill = BILLS.find(item => item.id === id);
  assert.ok(bill, `a pauta ${id} sumiu do catalogo`);
  return bill;
}

const anyFunding = fc
  .array(fc.double({ min: 0, max: 1, noNaN: true }), {
    minLength: PARTIES.length,
    maxLength: PARTIES.length,
  })
  .map(values => Object.fromEntries(PARTIES.map((party, i) => [party.id, values[i] ?? 0])));

const anyLoyalty = fc
  .array(fc.double({ min: 0, max: 100, noNaN: true }), {
    minLength: PARTIES.length,
    maxLength: PARTIES.length,
  })
  .map(values => Object.fromEntries(PARTIES.map((party, i) => [party.id, values[i] ?? 0])));

const anyBill = fc.constantFrom(...BILLS);

test("a PREVISAO e deterministica: nenhum sorteio entra nela", () => {
  fc.assert(
    fc.property(anyBill, anyFunding, anyLoyalty, (bill, funding, loyalty) => {
      const first = whipCount({ bill, parties: PARTIES, funding, loyalty });
      const second = whipCount({ bill, parties: PARTIES, funding, loyalty });
      assert.deepEqual(first, second);
    }),
  );
});

test("o DIA muda com a semente, e a previsao nao", () => {
  /* A separacao inteira em uma prova: mesma entrada, mesma tendencia, placares
     diferentes. Se a previsao mudasse junto, o jogador nao teria o que negociar;
     se o placar nao mudasse, nao haveria risco. */
  const bill = billOf("reforma-administrativa");
  const base = { bill, parties: PARTIES, funding: everyone(0.5), loyalty: LOYAL };
  const forecast = whipCount(base);

  const tallies = new Set();
  for (let seed = 0; seed < 40; seed++) {
    const result = vote({
      ...base,
      stream: streamFrom(seed, "congress"),
      majority: SIMPLE_MAJORITY,
    });
    assert.equal(result.expected, forecast.votes, "a previsao nao pode depender da semente");
    tallies.add(result.votes);
  }
  assert.ok(tallies.size > 1, "quarenta sementes deram o mesmo placar — nao ha dissidencia");
});

test("mesma semente e mesma entrada dao o mesmo placar", () => {
  fc.assert(
    fc.property(anyBill, anyFunding, fc.integer({ min: 0, max: 100000 }), (bill, funding, seed) => {
      const run = () =>
        vote({
          bill,
          parties: PARTIES,
          funding,
          loyalty: LOYAL,
          stream: streamFrom(seed, "congress"),
          majority: SIMPLE_MAJORITY,
        });
      assert.deepEqual(run(), run());
    }),
  );
});

test("a votacao consome um saque POR BANCADA", () => {
  /* Um saque unico faria as quatro traírem juntas, o que parece evento e e
     defeito de modelagem. */
  const start = streamFrom(1, "congress");
  const result = vote({
    bill: billOf("abertura-comercial"),
    parties: PARTIES,
    funding: NO_MONEY,
    loyalty: LOYAL,
    stream: start,
    majority: SIMPLE_MAJORITY,
  });
  assert.equal(result.stream.draws, start.draws + PARTIES.length);
});

test("verba NUNCA reduz a adesao, e em geral aumenta", () => {
  fc.assert(
    fc.property(anyBill, anyFunding, (bill, funding) => {
      const dry = whipCount({ bill, parties: PARTIES, funding: NO_MONEY, loyalty: LOYAL });
      const paid = whipCount({ bill, parties: PARTIES, funding, loyalty: LOYAL });
      for (const [index, prediction] of paid.parties.entries()) {
        const before = dry.parties[index];
        assert.ok(before);
        assert.ok(
          prediction.adherence >= before.adherence - 1e-9,
          `${prediction.partyId} perdeu adesao ao receber verba`,
        );
      }
    }),
  );
});

test("O PRECO DEPENDE DO ASSUNTO: a mesma verba compra bancadas diferentes", () => {
  /* A razao de a venalidade ser uma por eixo. Numa pauta economica o centrao
     cede muito mais que a direita liberal; se as duas reagissem igual, um eixo
     so bastaria. */
  const bill = billOf("abertura-comercial");
  const dry = whipCount({ bill, parties: PARTIES, funding: NO_MONEY, loyalty: LOYAL });
  const paid = whipCount({ bill, parties: PARTIES, funding: everyone(1), loyalty: LOYAL });

  /** @param {string} id */
  const gain = id => {
    const before = dry.parties.find(item => item.partyId === id);
    const after = paid.parties.find(item => item.partyId === id);
    assert.ok(before && after);
    return after.adherence - before.adherence;
  };

  assert.ok(
    gain("centrao") > gain("direita-liberal"),
    "a mesma verba tinha de mover mais o centrao numa pauta economica",
  );
});

test("lealdade no chao derruba a entrega, e a ruptura joga contra", () => {
  const bill = billOf("reforma-administrativa");
  const base = { bill, parties: PARTIES, funding: everyone(0.6) };

  const happy = whipCount({ ...base, loyalty: everyone(90) });
  const sour = whipCount({ ...base, loyalty: everyone(45) });
  const broken = whipCount({ ...base, loyalty: everyone(10) });

  assert.ok(happy.votes > sour.votes, "lealdade menor tinha de entregar menos");
  assert.ok(sour.votes > broken.votes, "a ruptura tinha de ser pior que o descontentamento");
});

/* ── O TERMO DE AMEACA ──────────────────────────────────────────────────────
   O centro desta fatia. Sem ele a medicao mostrava o centrao como o bloco mais
   proximo E mais barato de uma lei anticorrupcao. */

test("A MAQUINA SE DEFENDE: a pauta que a ataca fica cara justamente para quem vive dela", () => {
  const threatening = billOf("fim-do-foro-privilegiado");
  const harmless = billOf("pec-seguranca-publica");
  const funding = everyone(1);

  const onThreat = whipCount({ bill: threatening, parties: PARTIES, funding, loyalty: LOYAL });
  const onHarmless = whipCount({ bill: harmless, parties: PARTIES, funding, loyalty: LOYAL });

  /** @param {Awaited<ReturnType<typeof whipCount>>} forecast @param {string} id */
  const of = (forecast, id) => {
    const found = forecast.parties.find(item => item.partyId === id);
    assert.ok(found);
    return found;
  };

  /* O bloco mais fisiologico tem de sofrer MAIS com a ameaca que o menos
     fisiologico — e a inversao da relacao habitual entre venalidade e
     resistencia. */
  const centraoPenalty = of(onThreat, "centrao").resistance - of(onHarmless, "centrao").resistance;
  const liberalPenalty =
    of(onThreat, "direita-liberal").resistance - of(onHarmless, "direita-liberal").resistance;

  assert.ok(
    centraoPenalty > liberalPenalty,
    `o centrao devia sofrer mais com a ameaca (${centraoPenalty.toFixed(1)} contra ` +
      `${liberalPenalty.toFixed(1)})`,
  );

  /* E verba cheia NAO compra esse termo. */
  const bought = of(
    whipCount({ bill: threatening, parties: PARTIES, funding: everyone(1), loyalty: LOYAL }),
    "centrao",
  );
  assert.ok(bought.adherence < 0.5, `o centrao entregou ${(bought.adherence * 100).toFixed(0)}%`);
});

test("NENHUMA PAUTA E INVOTAVEL: toda pauta do catalogo PASSA em alguma configuracao", () => {
  /* A prova mais importante do arquivo, e a primeira versao dela era fraca
     demais: exigia apenas `votos > 0`, e passou verde enquanto o fim do foro
     privilegiado estava travado em 56 de 257 — ou seja, um muro com aparencia
     de preco. Prova que nao consegue distinguir "caro" de "impossivel" nao
     cobra o principio que existe para cobrar.
     Agora ela exige o que o projeto promete: tudo tem um jeito de ser feito.
     Se ficar vermelha, alguma pauta virou parede e a calibragem quebrou. */
  const generous = everyone(1);
  const devoted = everyone(100);

  for (const bill of BILLS) {
    const forecast = whipCount({
      bill,
      parties: PARTIES,
      funding: generous,
      loyalty: devoted,
    });
    assert.ok(
      forecast.votes >= SIMPLE_MAJORITY,
      `${bill.id} nao passa nem com verba cheia e lealdade cheia: ` +
        `${forecast.votes} de ${SIMPLE_MAJORITY} — isso e muro, e nao preco`,
    );
  }
});

test("mas o caminho facil NAO existe: nenhuma pauta passa de graca e sem base", () => {
  /* O contrapeso da prova acima. Se tudo passasse sem verba e sem lealdade, o
     jogo nao teria negociacao — e as duas provas juntas e que definem a faixa
     onde ele acontece. */
  const broke = everyone(0);
  const cold = everyone(30);

  const easy = BILLS.filter(
    bill =>
      whipCount({ bill, parties: PARTIES, funding: broke, loyalty: cold }).votes >= SIMPLE_MAJORITY,
  );
  assert.equal(easy.length, 0, `passaram de graca: ${easy.map(bill => bill.id).join(", ")}`);
});

test("a adesao fica sempre entre 0 e 1, e os votos dentro da bancada", () => {
  fc.assert(
    fc.property(anyBill, anyFunding, anyLoyalty, (bill, funding, loyalty) => {
      const forecast = whipCount({ bill, parties: PARTIES, funding, loyalty });
      for (const [index, prediction] of forecast.parties.entries()) {
        const party = PARTIES[index];
        assert.ok(party);
        assert.ok(prediction.adherence >= 0 && prediction.adherence <= 1);
        assert.ok(prediction.votes >= 0 && prediction.votes <= party.seats);
        assert.ok(Number.isFinite(prediction.resistance));
      }
      assert.ok(forecast.votes >= 0 && forecast.votes <= 513);
    }),
  );
});

test("o placar do dia tambem respeita o tamanho das bancadas", () => {
  fc.assert(
    fc.property(
      anyBill,
      anyFunding,
      anyLoyalty,
      fc.integer({ min: 0, max: 9999 }),
      (bill, funding, loyalty, seed) => {
        const result = vote({
          bill,
          parties: PARTIES,
          funding,
          loyalty,
          stream: streamFrom(seed, "congress"),
          majority: SIMPLE_MAJORITY,
        });
        for (const [index, tally] of result.parties.entries()) {
          const party = PARTIES[index];
          assert.ok(party);
          assert.ok(
            tally.votes >= 0 && tally.votes <= party.seats,
            `${tally.partyId}: ${tally.votes}`,
          );
        }
        assert.equal(result.passed, result.votes >= SIMPLE_MAJORITY);
      },
    ),
  );
});
