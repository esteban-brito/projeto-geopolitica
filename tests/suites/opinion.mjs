/* SUITE · SONDA — a rua, e o que ela sente.
   ══════════════════════════════════════════════════════════════════════════════

   O que estas provas cobram nao e "a conta bate": e que as PROPRIEDADES do
   desenho sobrevivam a qualquer recalibragem. Um numero que mude em
   `src/data/opinion.mjs` nao pode fazer a pesquisa somar 99, nem fazer a
   popularidade subir tao rapido quanto cai, nem apagar a diferenca entre as
   classes — que e a razao de o motor ter segmentos. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { OPINION, SEGMENTS } from "../../src/data/opinion.mjs";
import { opening, pollFrom, step } from "../../src/domain/opinion/index.mjs";

/** Um mes qualquer, com o pais em qualquer estado. */
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
 *           services: number, safety: number, betrayal?: number }} month
 * @param {Record<string, number>} mood
 */
function run(month, mood) {
  return step({ ...month, mood, segments: SEGMENTS, parameters: OPINION });
}

/* Um mes bom e um mes ruim, para as provas de direcao. */
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

test("A PESQUISA SEMPRE FECHA EM 100, em qualquer estado do pais", () => {
  /* O invariante que a tela inteira presume: o medidor de tres partes desenha as
     fatias como fracoes de uma barra, e uma soma de 99 aparece como um vao branco
     que ninguem consegue explicar. */
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

test("A SATISFACAO NUNCA SAI DA FAIXA, nem com o pais no chao ou no ceu", () => {
  fc.assert(
    fc.property(anyMonth, anyMood, (month, mood) => {
      for (const value of Object.values(run(month, mood).mood)) {
        assert.ok(value >= 0 && value <= 100, `satisfacao fora da faixa: ${value}`);
      }
    }),
  );
});

test("A OPINIAO NAO PULA: um mes nunca leva a satisfacao ao alvo", () => {
  /* A inercia e o que separa historia de ruido. Sem ela, um mes de inflacao ruim
     derrubaria o governo e o mes seguinte o devolveria — e a serie de 48 meses
     deixaria de contar qualquer coisa. */
  const flat = Object.fromEntries(SEGMENTS.map(s => [s.id, 50]));
  const after = run(GOOD, flat).mood;

  for (const segment of SEGMENTS) {
    const moved = (after[segment.id] ?? 0) - 50;
    assert.ok(moved > 0, `${segment.id} nao reagiu a um mes bom`);
    assert.ok(moved < 30, `${segment.id} pulou ${moved.toFixed(1)} pontos num mes so`);
  }
});

test("ELA CAI MAIS RAPIDO DO QUE SOBE, e a assimetria e do mesmo tamanho declarado", () => {
  /* O achado empirico mais consistente da literatura de opiniao publica, e a
     razao de governos gastarem tanto para evitar crise pequena. Sem ele, o jogo
     ensinaria que da para deixar a popularidade desabar e recuperar depois. */
  const flat = Object.fromEntries(SEGMENTS.map(s => [s.id, 50]));

  const up = (run(GOOD, flat).mood["media"] ?? 50) - 50;
  const down = 50 - (run(BAD, flat).mood["media"] ?? 50);

  assert.ok(down > up, `subiu ${up.toFixed(2)} e caiu ${down.toFixed(2)}`);
  assert.ok(
    down / up > 2,
    `a queda deveria ser varias vezes mais rapida; foi ${(down / up).toFixed(2)}x`,
  );
});

test("AS CLASSES NAO SENTEM A MESMA COISA: cortar servico publico separa o pais", () => {
  /* A razao de existir dos segmentos. Quem tem plano de saude nao sente a fila, e
     quem nao tem sente antes de qualquer estatistica sair — entao o mesmo corte
     produz duas reacoes de tamanhos diferentes. Se as duas fossem iguais, o motor
     poderia ser um numero so, e a polarizacao que ele existe para mostrar nao
     existiria. */
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

test("A INFLACAO DOI MAIS EMBAIXO, e o PIB so e sentido em cima", () => {
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

test("PROMESSA QUEBRADA CUSTA RUA, e nao so base no Congresso", () => {
  /* O outro lado de uma conta que ja existia. O rateio que corta emenda corta
     obra inaugurada, e ate 14/08/2026 isso so aparecia na lealdade das bancadas. */
  const flat = Object.fromEntries(SEGMENTS.map(s => [s.id, 50]));
  const kept = run({ ...GOOD, betrayal: 0 }, flat).approval.good;
  const broke = run({ ...GOOD, betrayal: 1 }, flat).approval.good;

  assert.ok(broke < kept, `quebrar promessa nao custou nada: ${kept} contra ${broke}`);
});

test("A NACIONAL E A MEDIA PONDERADA, e nao a media simples", () => {
  /* Um governo adorado pela classe A/B e odiado pela D/E nao tem 50% — ele tem o
     que a populacao pesa. Sem a ponderacao, agradar 20% do pais valeria tanto
     quanto agradar 42%, e a estrategia do jogo inverteria. */
  const skewed = { baixa: 0, media: 0, alta: 100 };
  const poll = pollFrom(skewed, SEGMENTS, OPINION);
  assert.ok(poll.good < 30, `o topo sozinho nao pode dar ${poll.good}% de otimo/bom`);

  const inverted = { baixa: 100, media: 100, alta: 0 };
  assert.ok(
    pollFrom(inverted, SEGMENTS, OPINION).good > poll.good * 2,
    "agradar 80% do pais tem de valer muito mais que agradar 20%",
  );
});

test("a abertura sai do catalogo, e o pais comeca dividido", () => {
  const start = opening(SEGMENTS);
  assert.equal(Object.keys(start).length, SEGMENTS.length);

  /* A afirmacao do catalogo: quem acabou de eleger o governo comeca mais
     satisfeito, e quem paga a conta comeca menos. Se um dia isso deixar de valer,
     e decisao de calibragem — e esta prova obriga a decisao a ser consciente. */
  assert.ok(
    (start["baixa"] ?? 0) > (start["alta"] ?? 0),
    "a base da piramide deveria abrir mais satisfeita que o topo",
  );
});
