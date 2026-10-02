/* AS PROVAS DA MOLA ANALÍTICA — e elas cobram a FÍSICA, e não o formato da string.

   ⚠ CADA REGIME TEM UMA FÓRMULA, e um erro de sinal num deles produz curva plausível: a peça
   vai do lugar certo ao lugar certo e passa pelo caminho errado no meio. Foi o que aconteceu
   no superamortecido — `(r2 - r1)` no lugar de `(r1 - r2)` — e só a condição inicial pega. */

import assert from "node:assert/strict";
import test from "node:test";
import { curveOf } from "../../src/ui/core/spring.mjs";

/**
 * A derivada por diferença central, para conferir a analítica contra a numérica.
 *
 * @param {ReturnType<typeof curveOf>} curve
 * @param {number} t
 * @param {number} [h]
 * @returns {number}
 */
const slope = (curve, t, h = 1e-6) => (curve.at(t + h) - curve.at(t - h)) / (2 * h);

const REGIMES = [
  { nome: "critico", bounce: 0 },
  { nome: "subamortecido", bounce: 0.3 },
  { nome: "superamortecido", bounce: -0.6 },
];

test("A MOLA PARTE DO ZERO E CHEGA AO UM, nos três regimes", () => {
  for (const regime of REGIMES) {
    const curve = curveOf({ duration: 0.3, bounce: regime.bounce });
    assert.ok(Math.abs(curve.at(0)) < 1e-9, `${regime.nome} nao partiu de zero: ${curve.at(0)}`);
    assert.ok(
      Math.abs(curve.at(curve.duration) - 1) < 0.002,
      `${regime.nome} nao assentou: ${curve.at(curve.duration)}`,
    );
  }
});

test("A VELOCIDADE ANALÍTICA E A DERIVADA DA POSIÇÃO — e e ela que o retargeting lê", () => {
  /* ⛔ ESTA É A PROVA QUE PEGA O ERRO DE SINAL. Posição certa nas duas pontas e velocidade
     errada no meio é exatamente o defeito que passa despercebido: a peça chega no lugar. */
  for (const regime of REGIMES) {
    for (const velocity of [0, 2.5, -1.5]) {
      const curve = curveOf({ duration: 0.3, bounce: regime.bounce, velocity });
      for (const t of [0.02, 0.08, 0.15, 0.26]) {
        assert.ok(
          Math.abs(curve.rate(t) - slope(curve, t)) < 0.01,
          `${regime.nome} v0=${velocity} em t=${t}: analitica ${curve.rate(t).toFixed(4)} ` +
            `contra numerica ${slope(curve, t).toFixed(4)}`,
        );
      }
    }
  }
});

test("A VELOCIDADE DE PARTIDA E HONRADA, e e ela que faz o gesto continuar", () => {
  for (const regime of REGIMES) {
    for (const velocity of [0, 3, -2]) {
      const curve = curveOf({ duration: 0.3, bounce: regime.bounce, velocity });
      assert.ok(
        Math.abs(curve.rate(0) - velocity) < 1e-6,
        `${regime.nome} nasceu a ${curve.rate(0)} e devia nascer a ${velocity}`,
      );
    }
  }
});

test("O QUIQUE ZERO NÃO ULTRAPASSA, e o quique alto ultrapassa — a sobriedade e medida", () => {
  const maior = (/** @type {number} */ bounce) => {
    const curve = curveOf({ duration: 0.3, bounce });
    let top = 0;
    for (let t = 0; t <= curve.duration; t += curve.duration / 400)
      top = Math.max(top, curve.at(t));
    return top;
  };
  assert.ok(maior(0) <= 1.0005, `o amortecimento critico ultrapassou: ${maior(0)}`);
  assert.ok(maior(0.4) > 1.02, `o quique de 0,4 nao ultrapassou: ${maior(0.4)}`);
});

test("A CURVA CHEGA AO CSS FECHANDO EM 1, e o salto final e menor que o limiar visual", () => {
  /* ⛔ `1,22 x duracao` deixava 0,41% de resíduo, que num curso de 700px é um salto de 2,8px
     no último quadro. O assentamento é PROCURADO, e não uma constante. */
  for (const regime of REGIMES) {
    const curve = curveOf({ duration: 0.3, bounce: regime.bounce });
    assert.ok(curve.css.startsWith("linear(0 0.00%"), `${regime.nome} nao comeca em zero`);
    assert.ok(
      curve.css.endsWith(",1 100%)"),
      `${regime.nome} nao fecha em 1: ${curve.css.slice(-20)}`,
    );
    /* ⛔ E CADA PONTO LEVA A POSIÇÃO: sem ela o CSS espaça sozinho e a amostragem densa no
       arranque sai deformada — medido, 489px onde a conta pede 635. */
    const pontos = curve.css.slice(7, -1).split(",");
    for (const ponto of pontos) {
      assert.match(ponto.trim(), /^-?[\d.]+ [\d.]+%$/, `${regime.nome} tem ponto sem posicao`);
    }
    const salto = Math.abs(1 - Number((pontos[pontos.length - 2] ?? "0").trim().split(" ")[0]));
    assert.ok(salto < 0.01, `${regime.nome} salta ${(salto * 100).toFixed(2)}% no fim`);
  }
});

test("O ASSENTAMENTO ACOMPANHA O QUIQUE, e não e a mesma constante para todos", () => {
  const critico = curveOf({ duration: 0.3, bounce: 0 }).duration;
  const quicando = curveOf({ duration: 0.3, bounce: 0.4 }).duration;
  assert.ok(critico > 0.3, `o critico assentou antes da duracao nominal: ${critico}`);
  assert.ok(quicando > critico, `quique nao demorou mais: ${quicando} contra ${critico}`);
});
