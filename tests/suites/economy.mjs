/* SUITE · A CORRENTE — e ela nasceu tarde demais.
   ⚠ ESTE MOTOR RODOU DUAS SESSÕES SEM PROVA PRÓPRIA.
   Todos os outros tem suite; a economia tinha as quatro equações, o carrego da dívida e nada
   cobrando nenhum dos dois. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { carry, premiumOf } from "../../src/domain/economy/index.mjs";
import { MACRO } from "../../src/data/macro.mjs";
import { FISCAL } from "../../src/data/fiscal.mjs";

const TOLERANCE = FISCAL.initialDebtRatio;
const SLOPE = MACRO.riskPremium;

/* Razões de dívida que um mandato de verdade alcanca, e as duas pontas entram: um país que se
   desendivida e um em beira de crise. */
const anyRatio = fc.double({ min: 0.2, max: 2, noNaN: true });

test("O MERCADO NÃO COBRA PELA DÍVIDA HERDADA, e cobra por tudo acima dela", () => {
  /* ⚠ A TOLERÂNCIA E A DÍVIDA DE ABERTURA, e não um número escolhido: o mercado JÁ precificou
     o país que o presidente recebeu, e o que ele cobra e a DETERIORAÇÃO. */
  assert.equal(premiumOf({ debtRatio: TOLERANCE, tolerance: TOLERANCE, slope: SLOPE }), 0);

  fc.assert(
    fc.property(anyRatio, ratio => {
      const premium = premiumOf({ debtRatio: ratio, tolerance: TOLERANCE, slope: SLOPE });
      if (ratio <= TOLERANCE) {
        assert.equal(premium, 0, `o mercado cobrou ${premium} de um pais que melhorou`);
      } else {
        assert.ok(premium > 0, "o pais piorou e o mercado nao cobrou nada");
      }
    }),
    { numRuns: 300 },
  );
});

test("O PRÊMIO E CONVEXO: o vigesimo ponto de dívida custa mais que o primeiro", () => {
  /* ⚠ A FORMA E A MECÂNICA, e não enfeite. */
  const at = (/** @type {number} */ ratio) =>
    premiumOf({ debtRatio: ratio, tolerance: TOLERANCE, slope: SLOPE });

  fc.assert(
    fc.property(fc.double({ min: 0.01, max: 0.2, noNaN: true }), step => {
      const primeiro = at(TOLERANCE + step) - at(TOLERANCE);
      const decimo = at(TOLERANCE + 10 * step) - at(TOLERANCE + 9 * step);
      assert.ok(
        decimo > primeiro,
        `o mesmo passo de ${(step * 100).toFixed(1)} p.p. custou ${primeiro.toFixed(4)} embaixo ` +
          `e ${decimo.toFixed(4)} em cima — a curva virou reta`,
      );
    }),
    { numRuns: 200 },
  );
});

test("O PRÊMIO ENCARECE A DÍVIDA, e incide sobre o ESTOQUE INTEIRO", () => {
  /* ⚠ E NÃO SÓ SOBRE A PARTE POS-FIXADA. */
  fc.assert(
    fc.property(
      fc.double({ min: 1000, max: 30000, noNaN: true }),
      fc.double({ min: 0, max: 0.4, noNaN: true }),
      fc.double({ min: 0.001, max: 0.15, noNaN: true }),
      (debt, rate, premium) => {
        const limpo = carry({ debt, rate, parameters: MACRO });
        const caro = carry({ debt, rate, premium, parameters: MACRO });

        assert.ok(caro > limpo, "o premio nao encareceu a divida");

        /* Se ele incidisse só sobre a fatia flutuante, ela seria 45% disto. */
        const esperado = (debt * premium) / 12;
        assert.ok(
          Math.abs(caro - limpo - esperado) < 1e-9,
          `o premio rendeu ${(caro - limpo).toFixed(4)} e devia render ${esperado.toFixed(4)}`,
        );
      },
    ),
    { numRuns: 300 },
  );
});

test("SEM PRÊMIO, O CARREGO E EXATAMENTE O QUE ERA — a migração e inerte", () => {
  /* A prova que permite mudar a assinatura de `carry` sem medo: o argumento novo tem padrão
     ZERO, e com ele a conta e a de antes, dígito por dígito. */
  fc.assert(
    fc.property(
      fc.double({ min: 1000, max: 30000, noNaN: true }),
      fc.double({ min: 0, max: 0.4, noNaN: true }),
      (debt, rate) => {
        const efetiva = MACRO.floatingDebt * rate + (1 - MACRO.floatingDebt) * MACRO.legacyRate;
        assert.equal(carry({ debt, rate, parameters: MACRO }), (debt * efetiva) / 12);
      },
    ),
    { numRuns: 200 },
  );
});
