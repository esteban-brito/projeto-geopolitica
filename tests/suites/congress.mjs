/* SUITE · A VOTACAO — a previsao, o dia, e o termo que salva o Congresso de si. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
/* O HUMOR DE ABERTURA VEM DO ESTADO. */
import { INITIAL_LOYALTY } from "../../src/state/state.mjs";
import {
  THRESHOLDS,
  baseCount,
  dispersion,
  vote,
  whipCount,
} from "../../src/domain/congress/index.mjs";
import { BILLS, quorumOf } from "../../src/data/bills.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { QUALIFIED_MAJORITY, SEATS, SIMPLE_MAJORITY } from "../../src/data/regime.mjs";
import { streamFrom } from "../../src/state/random.mjs";

/* O QUE VAI A PLENARIO. */
const VOTABLE = BILLS.filter(bill => bill.instrument !== "decree");

/** @param {number} level */
function everyone(level) {
  return Object.fromEntries(PARTIES.map(party => [party.id, level]));
}

/* O limiar vem do motor: redigita-lo aqui seria a prova passar a testar o numero que ela
   mesma escreveu. */
const RUPTURE_EDGE = THRESHOLDS.rupture;

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
  /* A separacao inteira em uma prova: mesma entrada, mesma tendencia, placares diferentes. */
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
  /* Um saque unico faria as quatro traírem juntas, o que parece evento e e defeito de
     modelagem. */
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
  /* A razao de a venalidade ser uma por eixo. */
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
    gain("uniao-progressista") > gain("liberais"),
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

/* ── O TERMO DE AMEACA ────────────────────────────────────────────────────── O centro desta
   fatia. */

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

  /* O bloco mais fisiologico tem de sofrer MAIS com a ameaca que o menos fisiologico — e a
     inversao da relacao habitual entre venalidade e resistencia. */
  const centraoPenalty =
    of(onThreat, "uniao-progressista").resistance - of(onHarmless, "uniao-progressista").resistance;
  const liberalPenalty =
    of(onThreat, "liberais").resistance - of(onHarmless, "liberais").resistance;

  assert.ok(
    centraoPenalty > liberalPenalty,
    `o centrao devia sofrer mais com a ameaca (${centraoPenalty.toFixed(1)} contra ` +
      `${liberalPenalty.toFixed(1)})`,
  );

  /* E verba cheia NAO compra esse termo. */
  const bought = of(
    whipCount({ bill: threatening, parties: PARTIES, funding: everyone(1), loyalty: LOYAL }),
    "uniao-progressista",
  );
  assert.ok(bought.adherence < 0.5, `o centrao entregou ${(bought.adherence * 100).toFixed(0)}%`);
});

test("NENHUMA PAUTA E INVOTAVEL: toda acao PASSA no PROPRIO quorum", () => {
  /* A prova mais importante do arquivo, e ela ja foi fraca duas vezes. */
  const generous = everyone(1);
  const devoted = everyone(100);

  for (const bill of VOTABLE) {
    const quorum = quorumOf(bill);
    const forecast = whipCount({
      bill,
      parties: PARTIES,
      funding: generous,
      loyalty: devoted,
    });
    assert.ok(
      forecast.votes >= quorum,
      `${bill.id} (${bill.instrument}) nao passa nem com verba cheia e lealdade cheia: ` +
        `${forecast.votes} de ${quorum} — isso e muro, e nao preco`,
    );
  }
});

test("mas o caminho facil NAO existe: nenhuma acao passa de graca e sem base", () => {
  /* O contrapeso da prova acima. */
  const broke = everyone(0);
  const cold = everyone(30);

  const easy = VOTABLE.filter(
    bill =>
      whipCount({ bill, parties: PARTIES, funding: broke, loyalty: cold }).votes >= quorumOf(bill),
  );
  assert.equal(easy.length, 0, `passaram de graca: ${easy.map(bill => bill.id).join(", ")}`);
});

test("A EMENDA E OUTRO JOGO: duas bancadas nao ENTREGAM tres quintos", () => {
  /* A afirmacao verdadeira e sobre ENTREGA, e nao sobre assento: adesao nunca e 100%, entao a
     dupla que soma 313 no papel entrega bem menos no plenario. */
  const generous = everyone(1);
  const devoted = everyone(100);
  const amendments = BILLS.filter(bill => bill.instrument === "amendment");
  assert.ok(amendments.length > 0, "o catalogo perdeu as emendas");

  /** @type {string[]} */
  const enough = [];

  for (const bill of amendments) {
    const forecast = whipCount({ bill, parties: PARTIES, funding: generous, loyalty: devoted });
    for (const [i, first] of forecast.parties.entries()) {
      for (const second of forecast.parties.slice(i + 1)) {
        const delivered = first.votes + second.votes;
        if (delivered >= QUALIFIED_MAJORITY) {
          enough.push(`${bill.id}: ${first.partyId} + ${second.partyId} = ${delivered}`);
        }
      }
    }
  }

  assert.equal(enough.length, 0, `duplas que fecham 308 sozinhas:\n  ${enough.join("\n  ")}`);
});

test("o quorum sai do instrumento, e nao de um numero digitado por acao", () => {
  for (const bill of BILLS) {
    const expected =
      bill.instrument === "amendment"
        ? QUALIFIED_MAJORITY
        : bill.instrument === "decree"
          ? 0
          : SIMPLE_MAJORITY;
    assert.equal(quorumOf(bill), expected, `${bill.id} tem quorum fora do seu instrumento`);
  }
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

/* ── A BANDA ───────────────────────────────────────────────────────────────── `dispersion` e
   a unica funcao deste motor que descreve o sorteio SEM sacar dele, e e por isso que ela
   precisa de prova propria: ela e uma afirmacao sobre o comportamento de `vote`, escrita em
   outro lugar. */

test("A BANDA MEDE O SORTEIO: o desvio observado bate com o previsto", () => {
  /* Seiscentas votacoes com semente declarada. */
  const bill = billOf("abertura-comercial");

  for (const level of [20, 50, 70, 95]) {
    const loyalty = everyone(level);
    const band = dispersion({ parties: PARTIES, loyalty });

    const drifts = [];
    for (let seed = 1; seed <= 1000; seed++) {
      const tally = vote({
        bill,
        parties: PARTIES,
        funding: NO_MONEY,
        loyalty,
        stream: streamFrom(seed, "congress"),
        majority: quorumOf(bill),
      });
      drifts.push(tally.votes - tally.expected);
    }

    const mean = drifts.reduce((sum, value) => sum + value, 0) / drifts.length;
    const sigma = Math.sqrt(
      drifts.reduce((sum, value) => sum + (value - mean) ** 2, 0) / drifts.length,
    );

    /* 25% de folga cobre o arredondamento em cadeiras (a banda e inteira, o desvio nao) e o
       corte da adesao em 0 e 1. */
    assert.ok(
      Math.abs(sigma - band) <= band * 0.25,
      `lealdade ${level}: a banda anuncia ${band} e o dia entrega ${sigma.toFixed(2)}`,
    );
  }
});

test("A BANDA NAO E O PIOR CASO: erros independentes somam em QUADRATURA", () => {
  /* Quatro bancadas iguais, cada uma sacando do proprio fluxo. */
  const one = PARTIES[0];
  assert.ok(one);

  const clones = [0, 1, 2, 3].map(index => ({ ...one, id: `bancada-${index}` }));
  const loyalty = Object.fromEntries(clones.map(party => [party.id, 60]));

  const single = dispersion({ parties: [clones[0] ?? one], loyalty });
  const four = dispersion({ parties: clones, loyalty });

  assert.ok(single > 0, "uma bancada com dissidencia tinha de ter banda");
  assert.ok(
    Math.abs(four - 2 * single) <= 1,
    `quatro bancadas iguais deram ${four} contra ${single} de uma — o esperado e o dobro`,
  );
  assert.ok(four < 4 * single, "a banda virou o pior caso: soma linear em vez de quadratura");
});

test("base insatisfeita e base IMPREVISIVEL: menos lealdade nunca estreita a banda", () => {
  fc.assert(
    fc.property(anyLoyalty, fc.double({ min: 0, max: 100, noNaN: true }), (loyalty, lift) => {
      const raised = Object.fromEntries(
        Object.entries(loyalty).map(([id, level]) => [id, Math.min(100, level + lift)]),
      );

      assert.ok(
        dispersion({ parties: PARTIES, loyalty: raised }) <=
          dispersion({ parties: PARTIES, loyalty }),
        "levantar a base alargou a banda",
      );
    }),
  );
});

/* Ela existe para a tela nao ter de inventar essa conta — e o valor dela depende inteiramente
   de nao divergir da votacao. */

test("NENHUMA VOTACAO ENTREGA MAIS QUE A BASE, em pauta nenhuma", () => {
  /* A propriedade que torna a base honesta. */
  fc.assert(
    fc.property(anyBill, anyFunding, anyLoyalty, (bill, funding, loyalty) => {
      const base = baseCount({ parties: PARTIES, loyalty });
      const forecast = whipCount({ bill, parties: PARTIES, funding, loyalty });
      assert.ok(
        forecast.votes <= base + 3,
        `${bill.id}: a votacao entregou ${forecast.votes} e a base era ${base}`,
      );
    }),
  );
});

test("a base cabe no plenario, e levantar a lealdade nunca a diminui", () => {
  fc.assert(
    fc.property(anyLoyalty, fc.double({ min: 0, max: 100, noNaN: true }), (loyalty, lift) => {
      const base = baseCount({ parties: PARTIES, loyalty });
      assert.ok(base >= 0 && base <= SEATS, `a base saiu em ${base} cadeiras`);

      const raised = Object.fromEntries(
        Object.entries(loyalty).map(([id, level]) => [id, Math.min(100, level + lift)]),
      );
      assert.ok(baseCount({ parties: PARTIES, loyalty: raised }) >= base);
    }),
  );
});

test("A RUPTURA E UM DEGRAU, e nao mais um passo da ladeira", () => {
  const at = (/** @type {number} */ level) =>
    baseCount({ parties: PARTIES, loyalty: everyone(level) });

  const overRupture = at(RUPTURE_EDGE + 1) - at(RUPTURE_EDGE - 1);
  const midSlope = at(71) - at(69);

  assert.ok(
    overRupture > midSlope * 3,
    `cruzar a ruptura custou ${overRupture} cadeiras e um passo qualquer custa ${midSlope}`,
  );
});

test("A RUA PESA NA VOTACAO: governo popular compra voto mais barato", () => {
  /* ⚠ E ESTA E A RAZAO DE SONDA EXISTIR PARA O MODELO, e nao so para a tela. */
  const bill = BILLS.find(item => item.instrument === "law" && item.threat < 0.3);
  assert.ok(bill, "o catalogo perdeu a lei mansa que esta prova usa");

  const loyalty = everyone(INITIAL_LOYALTY);
  const funding = everyone(0.3);
  const count = (/** @type {number | undefined} */ standing) =>
    whipCount({ bill, parties: PARTIES, funding, loyalty, standing }).votes;

  const hated = count(8);
  const neutral = count(undefined);
  const loved = count(70);

  assert.ok(loved > neutral, `governo amado nao ganhou nada: ${neutral} → ${loved}`);
  assert.ok(hated < neutral, `governo odiado nao perdeu nada: ${neutral} → ${hated}`);

  /* O TAMANHO: a diferenca entre o extremo amado e o extremo odiado nao pode ser maior que o
     plenario inteiro nem tao pequena que nunca mude uma votacao. */
  const swing = loved - hated;
  assert.ok(swing > 20, `a rua mudou so ${swing} votos entre os extremos — ela nao importa`);
  assert.ok(swing < 250, `a rua mudou ${swing} votos — ela virou o botao de aprovar tudo`);
});

test("SEM A RUA, O MOTOR CONTINUA O MESMO: o padrao e neutro e nao zero", () => {
  /* O contrato que mantem a suite antiga descrevendo a verdade. */
  const bill = BILLS[0];
  assert.ok(bill);
  const input = { bill, parties: PARTIES, funding: everyone(0.4), loyalty: everyone(60) };

  assert.equal(whipCount(input).votes, whipCount({ ...input, standing: 35 }).votes);
});
