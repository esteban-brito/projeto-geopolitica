/* SUITE · SONDA — a rua, e o que ela sente. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { OPINION, SEGMENTS } from "../../src/data/opinion.mjs";
import { opening, pollFrom, step } from "../../src/domain/opinion/index.mjs";

/** Um mês qualquer, com o país em qualquer estado. */
const anyMonth = fc.record({
  released: fc.record({
    inflation: fc.double({ min: -0.05, max: 0.6, noNaN: true }),
    unemployment: fc.double({ min: 0.01, max: 0.4, noNaN: true }),
    growth: fc.double({ min: -0.15, max: 0.2, noNaN: true }),
  }),
  services: fc.double({ min: 0, max: 100, noNaN: true }),
  safety: fc.double({ min: 0, max: 100, noNaN: true }),
  betrayal: fc.double({ min: 0, max: 1, noNaN: true }),
});

const anyMood = fc
  .array(fc.double({ min: 0, max: 100, noNaN: true }), {
    minLength: SEGMENTS.length,
    maxLength: SEGMENTS.length,
  })
  .map(values => Object.fromEntries(SEGMENTS.map((s, i) => [s.id, values[i] ?? 0])));

/**
 * @param {{ released: { inflation: number, unemployment: number, growth: number },
 * services: number, safety: number, betrayal?: number }} month
 * @param {Record<string, number>} mood
 */
function run(month, mood) {
  return step({ ...month, mood, segments: SEGMENTS, parameters: OPINION });
}

/* Um mês bom e um mês ruim, para as provas de direção. */
const GOOD = {
  released: { inflation: 0.02, unemployment: 0.05, growth: 0.05 },
  services: 90,
  safety: 90,
  betrayal: 0,
};
const BAD = {
  released: { inflation: 0.25, unemployment: 0.2, growth: -0.06 },
  services: 10,
  safety: 10,
  betrayal: 1,
};

test("A PESQUISA SEMPRE FECHA EM 100, em qualquer estado do país", () => {
  /* O invariante que a tela inteira presume: o medidor de três partes desenha as fatias como
     frações de uma barra, e uma soma de 99 aparece como um vão branco que ninguém consegue
     explicar. */
  fc.assert(
    fc.property(anyMonth, anyMood, (month, mood) => {
      const out = run(month, mood);
      const { good, fair, poor } = out.approval;

      assert.equal(good + fair + poor, 100, `a nacional somou ${good + fair + poor}`);
      assert.ok(good >= 0 && fair >= 0 && poor >= 0, "fatia negativa na nacional");

      for (const segment of SEGMENTS) {
        const poll = out.bySegment[segment.id];
        assert.ok(poll, `${segment.id} ficou sem pesquisa`);
        const total = (poll?.good ?? 0) + (poll?.fair ?? 0) + (poll?.poor ?? 0);
        assert.equal(total, 100, `${segment.id} somou ${total}`);
      }
    }),
  );
});

test("A SATISFAÇÃO NUNCA SAI DA FAIXA, nem com o país no chao ou no ceu", () => {
  fc.assert(
    fc.property(anyMonth, anyMood, (month, mood) => {
      for (const value of Object.values(run(month, mood).mood)) {
        assert.ok(value >= 0 && value <= 100, `satisfacao fora da faixa: ${value}`);
      }
    }),
  );
});

test("A OPINIÃO NÃO PULA: um mês nunca leva a satisfação ao alvo", () => {
  /* Sem ela, um mês de inflação ruim derrubaria o governo e o mês seguinte o devolveria — e a
     série de 48 meses deixaria de contar qualquer coisa. */
  const flat = Object.fromEntries(SEGMENTS.map(s => [s.id, 50]));
  const after = run(GOOD, flat).mood;

  for (const segment of SEGMENTS) {
    const moved = (after[segment.id] ?? 0) - 50;
    assert.ok(moved > 0, `${segment.id} nao reagiu a um mes bom`);
    assert.ok(moved < 30, `${segment.id} pulou ${moved.toFixed(1)} pontos num mes so`);
  }
});

test("ELA CAI MAIS RAPIDO DO QUE SOBE, e a assimetria e do mesmo tamanho declarado", () => {
  /* O achado empírico mais consistente da literatura de opinião pública, e a razão de
     governos gastarem tanto para evitar crise pequena. */
  const flat = Object.fromEntries(SEGMENTS.map(s => [s.id, 50]));

  const up = (run(GOOD, flat).mood["media"] ?? 50) - 50;
  const down = 50 - (run(BAD, flat).mood["media"] ?? 50);

  assert.ok(down > up, `subiu ${up.toFixed(2)} e caiu ${down.toFixed(2)}`);
  assert.ok(
    down / up > 2,
    `a queda deveria ser varias vezes mais rapida; foi ${(down / up).toFixed(2)}x`,
  );
});

test("AS CLASSES NÃO SENTEM A MESMA COISA: cortar servico público separa o país", () => {
  /* A razão de existir dos segmentos. */
  const flat = Object.fromEntries(SEGMENTS.map(s => [s.id, 50]));
  const base = { ...GOOD, services: 80 };
  const cut = { ...GOOD, services: 10 };

  const poorLoss = (run(base, flat).mood["baixa"] ?? 0) - (run(cut, flat).mood["baixa"] ?? 0);
  const richLoss = (run(base, flat).mood["alta"] ?? 0) - (run(cut, flat).mood["alta"] ?? 0);

  assert.ok(poorLoss > 0, "a classe D/E nao sentiu o corte de servico publico");
  assert.ok(
    poorLoss > richLoss * 2,
    `o corte custou ${poorLoss.toFixed(2)} na base e ${richLoss.toFixed(2)} no topo — perto demais`,
  );
});

test("A INFLAÇÃO DÓI MAIS EMBAIXO, e o PIB só e sentido em cima", () => {
  const flat = Object.fromEntries(SEGMENTS.map(s => [s.id, 50]));

  const calm = { ...GOOD, released: { ...GOOD.released, inflation: 0.03 } };
  const carestia = { ...GOOD, released: { ...GOOD.released, inflation: 0.18 } };
  const lowHit = (run(calm, flat).mood["baixa"] ?? 0) - (run(carestia, flat).mood["baixa"] ?? 0);
  const highHit = (run(calm, flat).mood["alta"] ?? 0) - (run(carestia, flat).mood["alta"] ?? 0);
  assert.ok(lowHit > highHit, "a carestia deveria doer mais na base da piramide");

  const bust = { ...GOOD, released: { ...GOOD.released, growth: -0.08 } };
  const lowGdp = (run(GOOD, flat).mood["baixa"] ?? 0) - (run(bust, flat).mood["baixa"] ?? 0);
  const highGdp = (run(GOOD, flat).mood["alta"] ?? 0) - (run(bust, flat).mood["alta"] ?? 0);
  assert.equal(lowGdp, 0, "o PIB nao deveria ser sentido por quem nao tem aplicacao nem emprego");
  assert.ok(highGdp > 0, "a classe A/B deveria sentir a recessao");
});

test("PROMESSA QUEBRADA CUSTA RUA, e não só base no Congresso", () => {
  /* O outro lado de uma conta que já existia. */
  const flat = Object.fromEntries(SEGMENTS.map(s => [s.id, 50]));
  const kept = run({ ...GOOD, betrayal: 0 }, flat).approval.good;
  const broke = run({ ...GOOD, betrayal: 1 }, flat).approval.good;

  assert.ok(broke < kept, `quebrar promessa nao custou nada: ${kept} contra ${broke}`);
});

test("A NACIONAL E A MEDIA PONDERADA, e não a media simples", () => {
  /* Um governo adorado pela classe A/B e odiado pela D/E não tem 50% — ele tem o que a
     população pesa. */
  const skewed = { baixa: 0, media: 0, alta: 100 };
  const poll = pollFrom(skewed, SEGMENTS, OPINION);
  assert.ok(poll.good < 30, `o topo sozinho nao pode dar ${poll.good}% de otimo/bom`);

  const inverted = { baixa: 100, media: 100, alta: 0 };
  assert.ok(
    pollFrom(inverted, SEGMENTS, OPINION).good > poll.good * 2,
    "agradar 80% do pais tem de valer muito mais que agradar 20%",
  );
});

test("a abertura sai do catálogo, e o país começa dividido", () => {
  const start = opening(SEGMENTS);
  assert.equal(Object.keys(start).length, SEGMENTS.length);

  /* A afirmação do catálogo: quem acabou de eleger o governo começa mais satisfeito, e quem
     paga a conta começa menos. */
  assert.ok(
    (start["baixa"] ?? 0) > (start["alta"] ?? 0),
    "a base da piramide deveria abrir mais satisfeita que o topo",
  );
});
