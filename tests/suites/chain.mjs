/* SUITE · A CORRENTE — o que a tela mostra e o que o turno executa sao a MESMA conta. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { chainOf } from "../../src/application/chain.mjs";
import { halfLifeOf, linksOf } from "../../src/domain/graph/index.mjs";
import { opening, pressureOf, step } from "../../src/domain/capacity/index.mjs";
import { AREAS, CAPACITY_TARGET, NEUTRAL } from "../../src/data/areas.mjs";
import { createState } from "../../src/state/state.mjs";

/**
 * Um estado com os indices ja andados, para a corrente ter o que medir: com o historico vazio
 * toda aresta de canal vale zero, e uma prova sobre zeros nao prova nada.
 *
 * @param {Record<string, number>} allocation
 * @param {number} months
 */
function played(allocation, months = 30) {
  const state = createState();
  let { index, history } = opening(AREAS);

  for (let month = 0; month < months; month++) {
    const outcome = step({
      areas: AREAS,
      index,
      history,
      allocation,
      neutral: NEUTRAL,
      capacityTarget: CAPACITY_TARGET,
    });
    index = outcome.index;
    history = outcome.history;
  }

  return { ...state, capacity: { index, history } };
}

const NOTHING = Object.fromEntries(AREAS.map(area => [area.id, 0]));

test("A CORRENTE E A PRESSAO SAO A MESMA CONTA — a soma das arestas fecha o multiplicador", () => {
  /* ⚠ E ESTA E A PROVA QUE MORDE, e a familia de defeito que ela fecha e a numero 1 do
     projeto: uma tela que refizesse `((valor - abertura) / 100) * force` por fora divergiria
     do turno no primeiro ajuste de calibragem, e explicaria um jogo que nao roda. */
  fc.assert(
    fc.property(
      fc
        .array(fc.double({ min: 0, max: 30, noNaN: true }), {
          minLength: AREAS.length,
          maxLength: AREAS.length,
        })
        .map(values => Object.fromEntries(AREAS.map((area, i) => [area.id, values[i] ?? 0]))),
      allocation => {
        const state = played(allocation);
        const esperado = pressureOf({ areas: AREAS, history: state.capacity.history });

        let revenue = 1;
        let mandatory = 1;
        for (const area of AREAS) {
          const [saida] = chainOf(state, area.id, allocation[area.id] ?? 0).out;
          if (saida === undefined) throw new Error(`${area.id} nao tem saida`);
          if (saida.to === "revenue") revenue += saida.now;
          if (saida.to === "mandatory") mandatory += saida.now;
        }

        /* O piso de 0,25 e da MALHA e nao da corrente: comparar abaixo dele seria cobrar da
           soma um limite que ela nao aplica. */
        assert.ok(
          Math.abs(Math.max(0.25, revenue) - esperado.revenue) < 1e-9,
          `receita: ${revenue} contra ${esperado.revenue}`,
        );
        assert.ok(
          Math.abs(Math.max(0.25, mandatory) - esperado.mandatory) < 1e-9,
          `despesa: ${mandatory} contra ${esperado.mandatory}`,
        );
      },
    ),
  );
});

test("O QUE A EDUCACAO ENTREGA E O QUE A INDUSTRIA RECEBE — e o atraso e o do catalogo", () => {
  const state = played({ ...NOTHING, education: 25 });
  const { into } = chainOf(state, CAPACITY_TARGET, 0);
  const vinda = into.find(strand => strand.from === "education");

  assert.ok(vinda !== undefined, "a industria nao mostra de onde vem a capacidade");
  assert.equal(vinda.lag, 24, "o atraso da educacao saiu diferente do catalogo");
  assert.equal(vinda.unit, "points");

  /* ⚠ O NUMERO E CONFERIDO CONTRA A MALHA RODANDO, e nao contra a formula redigitada aqui: a
     prova tem de reprovar se o motor mudar de conta, e nao acompanha-lo. */
  const semAjuda = step({
    areas: AREAS.map(area => (area.feeds === "capacity" ? { ...area, force: 0 } : area)),
    index: state.capacity.index,
    history: state.capacity.history,
    allocation: NOTHING,
    neutral: NEUTRAL,
    capacityTarget: CAPACITY_TARGET,
  });
  const comAjuda = step({
    areas: AREAS,
    index: state.capacity.index,
    history: state.capacity.history,
    allocation: NOTHING,
    neutral: NEUTRAL,
    capacityTarget: CAPACITY_TARGET,
  });

  const diferenca = (comAjuda.index[CAPACITY_TARGET] ?? 0) - (semAjuda.index[CAPACITY_TARGET] ?? 0);
  assert.ok(
    Math.abs(diferenca - vinda.now) < 1e-9,
    `a tela anuncia ${vinda.now} e o motor entrega ${diferenca}`,
  );
});

test("A VERBA MOSTRA O QUE ELA POE NO MES, e nao o que poria por bilhao", () => {
  const state = played(NOTHING);
  const { into } = chainOf(state, "security", 10);
  const verba = into.find(strand => strand.kind === "spend");
  const area = AREAS.find(one => one.id === "security");

  assert.ok(verba !== undefined && area !== undefined);
  assert.equal(verba.weight, area.yield, "a pista deixou de ser o rendimento do catalogo");
  assert.ok(
    Math.abs(verba.now - area.yield * 10) < 1e-9,
    "o valor do mes nao e o gasto vezes o rendimento",
  );
});

test("O SINAL DIZ O LADO — subir a Saude ALIVIA a despesa obrigatoria", () => {
  /* Saude alimenta `mandatory` com `force` negativo: quanto melhor o atendimento, menos a
     despesa obrigatoria cobra. Um sinal trocado aqui pintaria de vermelho um acerto. */
  const alta = played({ ...NOTHING, health: 30 });
  const parada = played(NOTHING);

  const [saidaAlta] = chainOf(alta, "health", 30).out;
  const [saidaParada] = chainOf(parada, "health", 0).out;

  assert.ok(saidaAlta !== undefined && saidaParada !== undefined);
  assert.equal(saidaAlta.to, "mandatory");
  assert.equal(saidaAlta.unit, "factor");
  assert.ok(
    saidaAlta.now < saidaParada.now,
    `financiar a Saude devia aliviar: ${saidaAlta.now} contra ${saidaParada.now}`,
  );
});

test("A MEIA-VIDA E A LEITURA DE `decay`, e ela fecha a identidade", () => {
  fc.assert(
    fc.property(fc.double({ min: 0.001, max: 0.5, noNaN: true }), decay => {
      const meses = halfLifeOf(decay);
      /* Depois de uma meia-vida, o estoque que so vaza tem de valer metade. */
      assert.ok(Math.abs((1 - decay) ** meses - 0.5) < 1e-9, `${decay} deu ${meses} meses`);
    }),
  );

  assert.equal(halfLifeOf(0), Infinity, "o que nao vaza nao tem meia-vida");
});

test("TODA AREA TEM UMA SAIDA SO, e o catalogo e quem diz qual", () => {
  /* ⚠ O CATALOGO GARANTE "nenhuma area usa dois canais", e a corrente depende disso: com dois,
     o efeito de uma alocacao ficaria impossivel de atribuir — que e o defeito que o motor de
     propagacao existe para nao ter. */
  for (const area of AREAS) {
    const { out } = linksOf({ areas: AREAS, id: area.id, target: CAPACITY_TARGET });
    assert.equal(out.length, 1, `${area.id} tem ${out.length} saidas`);
    assert.equal(
      out[0]?.to,
      area.feeds === "capacity" ? CAPACITY_TARGET : area.feeds,
      `${area.id} desemboca no lugar errado`,
    );
  }
});

test("AREA QUE NAO EXISTE NAO TEM CORRENTE — e a ausencia e vazia, e nao inventada", () => {
  const { into, out } = linksOf({ areas: AREAS, id: "sem-tal-area", target: CAPACITY_TARGET });
  assert.deepEqual(into, []);
  assert.deepEqual(out, []);
});
