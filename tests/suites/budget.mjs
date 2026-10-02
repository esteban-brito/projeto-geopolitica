/* SUITE · O ORÇAMENTO — propriedades do primeiro motor de verdade. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { ceilingOf, growMandatory, revenueOf, step } from "../../src/domain/budget/index.mjs";
import { FISCAL } from "../../src/data/fiscal.mjs";

/** @typedef {import("../../src/domain/budget/index.mjs").BudgetInput} BudgetInput */

/* Entradas VÁLIDAS: um exercício plausível, com o PIB variando numa faixa larga o bastante
   para conter recessão e expansão. */
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

test("a obrigatória NUNCA encolhe", () => {
  /* Se ela pudesse encolher, o jogador resolveria o aperto esperando. */
  fc.assert(
    fc.property(anyInput, input => {
      assert.ok(step(input).mandatory > input.mandatory);
    }),
  );
});

test("doze meses de crescimento vegetativo dão exatamente a taxa anual", () => {
  /* A raiz de índice doze e não a taxa dividida por doze. */
  fc.assert(
    fc.property(fc.double({ min: 0.001, max: 0.15, noNaN: true }), rate => {
      let value = 1000;
      for (let month = 0; month < 12; month++) value = growMandatory(value, rate);
      assert.ok(Math.abs(value - 1000 * (1 + rate)) < 1e-9, `deu ${value}`);
    }),
  );
});

test("caixa e sempre receita menos obrigatória, e a conta fecha", () => {
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      assert.ok(Math.abs(out.cash - (out.revenue - out.mandatory)) < 1e-9);
      assert.equal(out.revenue, revenueOf(input.gdp, FISCAL.taxLoad));
    }),
  );
});

test("o que se pode empenhar nunca passa do TETO — e o caixa NÃO manda", () => {
  /* ⚠ ESTA PROVA MUDOU DE LADO EM, e a versão antiga estava CODIFICANDO UM DEFEITO. */
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      assert.ok(out.allowance >= 0, `permitido negativo: ${out.allowance}`);
      assert.ok(out.allowance <= Math.max(0, out.ceiling - out.mandatory) + 1e-9);
    }),
  );
});

test("GASTAR ACIMA DO CAIXA E POSSÍVEL, e produz déficit — o muro caiu", () => {
  /* A prova que o conserto exigia, e ela é o inverso exato da que existia aqui. */
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      if (out.blocked) return;

      /* Empenhando tudo o que o teto autoriza, o saldo do mês e o caixa menos isso — e ele e
         NEGATIVO sempre que o teto abre mais espaço do que o caixa tem. */
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

test("contingenciamento zera o discricionário, sempre", () => {
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      if (out.blocked) assert.equal(out.allowance, 0);
    }),
  );
});

test("A ARMADILHA EXISTE: há entradas válidas que disparam o contingenciamento", () => {
  /* Um motor em que o aperto é impossível passaria em todas as provas acima e não serviria
     para o jogo — foi exatamente esse o defeito da fórmula original, que definia a
     obrigatória como fração da receita. */
  let squeezed = 0;
  fc.assert(
    fc.property(anyInput, input => {
      if (step(input).blocked) squeezed++;
    }),
    { numRuns: 400 },
  );
  assert.ok(squeezed > 0, "nenhuma entrada apertou — a armadilha nao existe");
});

test("PROVA SINTÉTICA: o PISO segura o teto na recessão, e a OBRIGATÓRIA ainda o fura", () => {
  /* O caso do dossiê, montado à mão: o PIB decepciona, a receita cai abaixo da âncora, o teto
     do arcabouço ENCOLHE, e a obrigatória — que cresceu no mesmo mês — passa por cima dele. */
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
  assert.equal(calmo.blocked, false, "o cenario base ja devia estar folgado");
  assert.ok(calmo.allowance > 0);

  /* Mesma partida, PIB 15% menor. */
  /* Com o piso de 0,6% ao ano da LC 200/2023 ela deixa de ser: o piso existe justamente para
     o teto ser corrigido num exercício de receita ruim, e sem ele dois anos fracos seguidos
     derrubam o Estado em termos reais sem ninguém decidir nada. */
  const recessao = step({ ...base, gdp: base.gdp * 0.85 });
  assert.ok(recessao.revenue < calmo.revenue, "a receita tinha de cair");

  /* 1 — O PISO SEGURA. A recessão não encolhe o teto abaixo do que a lei garante. */
  assert.ok(
    recessao.ceiling >= base.anchorExpense,
    `o teto caiu para ${recessao.ceiling} numa recessao — o piso da banda nao segurou`,
  );
  assert.equal(recessao.blocked, false, "com o piso valendo, esta recessao nao aperta");

  /* 2 — E O GATILHO CONTINUA ALCANÇÁVEL, que é a outra metade e a mais importante: um
     contingenciamento que nunca dispara é um instrumento morto, e este projeto já pagou por
     isso uma vez (achado 3). */
  const pesada = step({ ...base, gdp: base.gdp * 0.85, mandatory: 2320 });
  assert.equal(pesada.blocked, true, "a obrigatoria acima do teto tinha de apertar");
  assert.equal(pesada.allowance, 0);
});

test("a dívida sobe quando o saldo do mês e negativo, e só por isso", () => {
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      /* Sem juros: a dívida se move pelo saldo primário e por nada mais.
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

test("ancora de receita zerada não vira divisão por zero", () => {
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

test("GDP zero não produz NaN ou infinito", () => {
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

/* ⛔ ELA REINTRODUZ A MENTIRA QUE A TELA CONTAVA: um primário POSITIVO abaixo da banda da meta
   é uma meta PERDIDA, e a linha de Finanças o pintava de verde por ser maior que zero. Medido
   na partida padrão: o mês 35 fecha em +0,17% do PIB contra um piso de banda de 0,25%. */
test("O PRIMÁRIO E JULGADO PELA META, e não pelo sinal", () => {
  /* Um mês que fecha POSITIVO, e ainda assim abaixo da banda. */
  const base = {
    gdp: 12000,
    mandatory: 2139,
    anchorRevenue: 2280,
    anchorExpense: 2310,
    debt: 9360,
    parameters: FISCAL,
  };

  const alvo = FISCAL.primaryTarget - FISCAL.primaryBand;
  assert.ok(alvo > 0, "a banda da LDO tem piso positivo, e e isso que torna a prova possivel");

  /* O EMPENHO É DERIVADO E NÃO CHUTADO: parte-se do mês sem gasto nenhum e desconta-se o
     saldo que se quer. Um número escrito à mão aqui viraria falso negativo na primeira
     recalibragem da carga tributária. */
  const seco = step({ ...base, spent: 0 });
  /** @param {number} share o primario desejado, em fracao do PIB */
  const gastando = share => step({ ...base, spent: seco.balance - (share * base.gdp) / 12 });

  const magro = gastando(alvo * 0.5);
  assert.ok(magro.balance > 0, "o mes desta prova tem de fechar POSITIVO");
  assert.ok(magro.primary < alvo, "e ainda assim abaixo da banda");
  assert.ok(magro.atRisk, "primario positivo abaixo da banda tem de acusar contingenciamento");

  /* E acima da banda ele para de acusar. */
  const gordo = gastando(FISCAL.primaryTarget * 1.5);
  assert.ok(gordo.primary > alvo, "o mes de controle tem de ficar acima da banda");
  assert.equal(gordo.atRisk, false, "acima da banda nao ha contingenciamento");
});

/* ⚠ OS DOIS INSTRUMENTOS SÃO INDEPENDENTES, e confundi-los era o defeito: o BLOQUEIO nasce do
   teto do arcabouço e o CONTINGENCIAMENTO da meta. Um mês pode ter um sem o outro. */
test("BLOQUEIO E CONTINGENCIAMENTO NÃO SÃO A MESMA COISA", () => {
  const folgado = step({
    gdp: 12000,
    mandatory: 2139,
    anchorRevenue: 2280,
    anchorExpense: 2310,
    debt: 9360,
    spent: 20,
    parameters: FISCAL,
  });
  assert.equal(folgado.blocked, false, "o teto cabe neste mes");
  assert.ok(folgado.atRisk, "e a meta continua perdida — os dois nao andam juntos");
});
