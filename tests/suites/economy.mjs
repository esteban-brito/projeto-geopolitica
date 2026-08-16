/* SUITE · A CORRENTE — e ela nasceu em 16/08/2026, tarde demais.
   ══════════════════════════════════════════════════════════════════════════════
   ⚠ ESTE MOTOR RODOU DUAS SESSOES SEM PROVA PROPRIA. Todos os outros tem suite;
   a economia tinha as quatro equacoes, o carrego da divida e nada cobrando
   nenhum dos dois. O que a segurava era prova de TURNO — que cobre a composicao
   e nao o motor, e por isso nao acusa uma equacao errada que produza um numero
   plausivel.

   E o custo disso ja apareceu duas vezes, as duas achadas pela SIMULACAO e nao
   por prova: o hiato medido em termos nominais (a economia fugia sozinha, 1% no
   mes 6 virando 7,6% no mes 24) e o juro incidindo so sobre a parte pos-fixada
   (a divida caia de 78% para 55% sem o jogador fazer nada). Duas correcoes
   estruturais, nenhuma prova. Esta suite comeca pelo que entrou hoje. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { carry, premiumOf } from "../../src/domain/economy/index.mjs";
import { MACRO } from "../../src/data/macro.mjs";
import { FISCAL } from "../../src/data/fiscal.mjs";

const TOLERANCE = FISCAL.initialDebtRatio;
const SLOPE = MACRO.riskPremium;

/* Razoes de divida que um mandato de verdade alcanca, e as duas pontas entram: um
   pais que se desendivida e um em beira de crise. */
const anyRatio = fc.double({ min: 0.2, max: 2, noNaN: true });

test("O MERCADO NAO COBRA PELA DIVIDA HERDADA, e cobra por tudo acima dela", () => {
  /* ⚠ A TOLERANCIA E A DIVIDA DE ABERTURA, e nao um numero escolhido: o mercado JA
     precificou o pais que o presidente recebeu, e o que ele cobra e a DETERIORACAO.

     E e isso que mantem a serie de abertura identica ao que era antes de o premio
     existir — o mesmo padrao que provou inerte a migracao das faixas para normas. */
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

test("O PREMIO E CONVEXO: o vigesimo ponto de divida custa mais que o primeiro", () => {
  /* ⚠ A FORMA E A MECANICA, e nao enfeite. Um premio LINEAR ensinaria que endividar-se
     custa sempre o mesmo por ponto, e a decisao de "mais um pouco" seria identica no
     comeco e na beira do abismo — que e o oposto do que um credor faz. O mercado
     tolera, tolera, e entao foge.

     A prova compara DOIS INCREMENTOS IGUAIS em alturas diferentes: se o segundo nao
     custar mais que o primeiro, a curva virou reta e a mecanica sumiu. */
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

test("O PREMIO ENCARECE A DIVIDA, e incide sobre o ESTOQUE INTEIRO", () => {
  /* ⚠ E NAO SO SOBRE A PARTE POS-FIXADA. E a mesma correcao que `legacyRate` ja
     carrega, pela mesma razao: quem rola divida rola o estoque todo, e quem desconfia
     do pais cobra mais para rolar qualquer pedaco dele. Aplicar o premio so na fatia
     flutuante diria que o credor do prefixado nao repara que o devedor piorou. */
  fc.assert(
    fc.property(
      fc.double({ min: 1000, max: 30000, noNaN: true }),
      fc.double({ min: 0, max: 0.4, noNaN: true }),
      fc.double({ min: 0.001, max: 0.15, noNaN: true }),
      (debt, rate, premium) => {
        const limpo = carry({ debt, rate, parameters: MACRO });
        const caro = carry({ debt, rate, premium, parameters: MACRO });

        assert.ok(caro > limpo, "o premio nao encareceu a divida");

        /* A diferenca e o premio sobre o estoque INTEIRO, mensalizada. Se ele
           incidisse so sobre a fatia flutuante, ela seria 45% disto. */
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

test("SEM PREMIO, O CARREGO E EXATAMENTE O QUE ERA — a migracao e inerte", () => {
  /* A prova que permite mudar a assinatura de `carry` sem medo: o argumento novo tem
     padrao ZERO, e com ele a conta e a de antes, digito por digito. Sem isto, um
     chamador esquecido mudaria de comportamento em silencio. */
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
