/* SUITE · O ORCAMENTO — propriedades do primeiro motor de verdade. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { ceilingOf, growMandatory, revenueOf, step } from "../../src/domain/budget/index.mjs";
import { FISCAL } from "../../src/data/fiscal.mjs";

/** @typedef {import("../../src/domain/budget/index.mjs").BudgetInput} BudgetInput */

/* Entradas VALIDAS: um exercicio plausivel, com o PIB variando numa faixa larga o bastante
   para conter recessao e expansao. */
const anyInput = fc
  .record({
    gdp: fc.double({ min: 6000, max: 16000, noNaN: true }),
    mandatory: fc.double({ min: 2000, max: 5200, noNaN: true }),
    anchorRevenue: fc.double({ min: 2800, max: 4200, noNaN: true }),
    anchorExpense: fc.double({ min: 2800, max: 4400, noNaN: true }),
    debt: fc.double({ min: 4000, max: 14000, noNaN: true }),
    spent: fc.double({ min: 0, max: 60, noNaN: true }),
  })
  .map(base => /** @type {BudgetInput} */ ({ ...base, parameters: FISCAL }));

test("a obrigatoria NUNCA encolhe", () => {
  /* Se ela pudesse encolher, o jogador resolveria o aperto esperando. */
  fc.assert(
    fc.property(anyInput, input => {
      assert.ok(step(input).mandatory > input.mandatory);
    }),
  );
});

test("doze meses de crescimento vegetativo dao exatamente a taxa anual", () => {
  /* A raiz de indice doze e nao a taxa dividida por doze. */
  fc.assert(
    fc.property(fc.double({ min: 0.001, max: 0.15, noNaN: true }), rate => {
      let value = 1000;
      for (let month = 0; month < 12; month++) value = growMandatory(value, rate);
      assert.ok(Math.abs(value - 1000 * (1 + rate)) < 1e-9, `deu ${value}`);
    }),
  );
});

test("caixa e sempre receita menos obrigatoria, e a conta fecha", () => {
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      assert.ok(Math.abs(out.cash - (out.revenue - out.mandatory)) < 1e-9);
      assert.equal(out.revenue, revenueOf(input.gdp, FISCAL.taxLoad));
    }),
  );
});

test("o que se pode empenhar nunca passa do TETO — e o caixa NAO manda", () => {
  /* ⚠ ESTA PROVA MUDOU DE LADO EM, e a versao antiga estava CODIFICANDO UM DEFEITO. */
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      assert.ok(out.allowance >= 0, `permitido negativo: ${out.allowance}`);
      assert.ok(out.allowance <= Math.max(0, out.ceiling - out.mandatory) + 1e-9);
    }),
  );
});

test("GASTAR ACIMA DO CAIXA E POSSIVEL, e produz deficit — o muro caiu", () => {
  /* A prova que o conserto exigia, e ela e o inverso exato da que existia aqui. */
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      if (out.contingency) return;

      /* Empenhando tudo o que o teto autoriza, o saldo do mes e o caixa menos isso — e ele e
         NEGATIVO sempre que o teto abre mais espaco do que o caixa tem. */
      const full = step({ ...input, spent: out.allowance / 12 });
      if (out.allowance > Math.max(0, out.cash)) {
        assert.ok(
          full.balance < 0,
          `o teto abriu ${out.allowance.toFixed(1)} sobre um caixa de ${out.cash.toFixed(1)} e o saldo nao ficou negativo`,
        );
        assert.ok(full.debt > input.debt, "houve deficit e a divida nao subiu");
      }
    }),
  );
});

test("contingenciamento zera o discricionario, sempre", () => {
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      if (out.contingency) assert.equal(out.allowance, 0);
    }),
  );
});

test("A ARMADILHA EXISTE: ha entradas validas que disparam o contingenciamento", () => {
  /* Um motor em que o aperto e impossivel passaria em todas as provas acima e nao serviria
     para o jogo — foi exatamente esse o defeito da formula original, que definia a
     obrigatoria como fracao da receita. */
  let squeezed = 0;
  fc.assert(
    fc.property(anyInput, input => {
      if (step(input).contingency) squeezed++;
    }),
    { numRuns: 400 },
  );
  assert.ok(squeezed > 0, "nenhuma entrada apertou — a armadilha nao existe");
});

test("PROVA SINTETICA: o PISO segura o teto na recessao, e a OBRIGATORIA ainda o fura", () => {
  /* O caso do dossie, montado a mao: o PIB decepciona, a receita cai abaixo da ancora, o teto
     do arcabouco ENCOLHE, e a obrigatoria — que cresceu no mesmo mes — passa por cima dele. */
  const base = {
    gdp: 12000,
    mandatory: 2140,
    anchorRevenue: 2400,
    anchorExpense: 2300,
    debt: 9360,
    spent: 0,
    parameters: FISCAL,
  };

  const calmo = step(base);
  assert.equal(calmo.contingency, false, "o cenario base ja devia estar folgado");
  assert.ok(calmo.allowance > 0);

  /* Mesma partida, PIB 15% menor. */
  /* Com o piso de 0,6% ao ano da LC 200/2023 ela deixa de ser: o piso existe justamente para
     o teto ser corrigido num exercicio de receita ruim, e sem ele dois anos fracos seguidos
     derrubam o Estado em termos reais sem ninguem decidir nada. */
  const recessao = step({ ...base, gdp: base.gdp * 0.85 });
  assert.ok(recessao.revenue < calmo.revenue, "a receita tinha de cair");

  /* 1 — O PISO SEGURA. A recessao nao encolhe o teto abaixo do que a lei garante. */
  assert.ok(
    recessao.ceiling >= base.anchorExpense,
    `o teto caiu para ${recessao.ceiling} numa recessao — o piso da banda nao segurou`,
  );
  assert.equal(recessao.contingency, false, "com o piso valendo, esta recessao nao aperta");

  /* 2 — E O GATILHO CONTINUA ALCANCAVEL, que e a outra metade e a mais importante: um
     contingenciamento que nunca dispara e um instrumento morto, e este projeto ja pagou por
     isso uma vez (achado 3). */
  const pesada = step({ ...base, gdp: base.gdp * 0.85, mandatory: 2320 });
  assert.equal(pesada.contingency, true, "a obrigatoria acima do teto tinha de apertar");
  assert.equal(pesada.allowance, 0);
});

test("a divida sobe quando o saldo do mes e negativo, e so por isso", () => {
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      /* Sem juros: a divida se move pelo saldo primario e por nada mais.
         CORRENTE existir, esta propriedade muda junto — e e para isso que ela
         esta escrita assim, apertada. */
      assert.ok(Math.abs(out.debt - (input.debt - out.balance)) < 1e-9);
      if (out.balance < 0) assert.ok(out.debt > input.debt);
      if (out.balance > 0) assert.ok(out.debt < input.debt);
    }),
  );
});

test("nenhuma entrada valida produz NaN ou infinito", () => {
  fc.assert(
    fc.property(anyInput, input => {
      for (const [field, value] of Object.entries(step(input))) {
        if (typeof value !== "number") continue;
        assert.ok(Number.isFinite(value), `${field} saiu ${value}`);
      }
    }),
  );
});

test("ancora de receita zerada nao vira divisao por zero", () => {
  const out = step({
    gdp: 11000,
    mandatory: 3270,
    anchorRevenue: 0,
    anchorExpense: 3600,
    debt: 8580,
    spent: 0,
    parameters: FISCAL,
  });
  assert.ok(Number.isFinite(out.ceiling));
  assert.equal(out.ceiling, 3600);
});

test("o teto acompanha o sinal do crescimento da receita", () => {
  const anchor = 3600;
  assert.ok(ceilingOf(anchor, 3000, 3300, 0.7) > anchor, "receita subindo abre teto");
  assert.ok(ceilingOf(anchor, 3000, 2700, 0.7) < anchor, "receita caindo encolhe teto");
  assert.equal(ceilingOf(anchor, 3000, 3000, 0.7), anchor, "receita parada nao mexe");
});

test("GDP zero nao produz NaN ou infinito", () => {
  const zero = step({
    gdp: 0,
    mandatory: 3270,
    anchorRevenue: 3500,
    anchorExpense: 3600,
    debt: 8580,
    spent: 0,
    parameters: FISCAL,
  });
  assert.ok(Number.isFinite(zero.revenue), "receita com PIB=0 deve ser finita");
  assert.ok(Number.isFinite(zero.mandatory), "obrigatoria com PIB=0 deve ser finita");
  assert.ok(Number.isFinite(zero.ceiling), "teto com PIB=0 deve ser finito");
});
