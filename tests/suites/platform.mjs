/* SUITE · A PLATAFORMA — o que foi prometido na posse, e como ela e cobrada. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import {
  breachOf,
  chosenOf,
  pledgesOf,
  platformOf,
  spoken,
} from "../../src/application/platform.mjs";
import { PRIORITY_COUNT } from "../../src/data/platform.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";
import { MONTHS_PER_YEAR } from "../../src/data/regime.mjs";
import { createState } from "../../src/state/state.mjs";
import { deserialize, serialize } from "../../src/state/save.mjs";
import { playMonth } from "../../src/application/turn.mjs";

/**
 * @param {Partial<import("../../src/state/state.mjs").Platform>} platform
 * @param {Partial<import("../../src/state/state.mjs").GameState>} [extra]
 */
function withPlatform(platform, extra = {}) {
  const base = createState();
  return {
    ...base,
    ...extra,
    platform: { priority: null, fiscal: null, reform: null, ...platform },
  };
}

test("AS PRIORIDADES SAO AS AREAS QUE O PAIS ENTREGA PIORES — e a lista e derivada", () => {
  /* ⚠ TRES IDS DIGITADOS SERIAM UMA SEGUNDA VERDADE sobre onde o pais esta pior, e ela
     mentiria no dia em que uma abertura do catalogo mudasse. */
  const { priority } = pledgesOf();
  assert.equal(priority.length, PRIORITY_COUNT);

  const piores = [...CATALOG.areas]
    .sort((a, b) => a.initial - b.initial || a.id.localeCompare(b.id))
    .slice(0, PRIORITY_COUNT)
    .map(area => area.id);
  assert.deepEqual(
    priority.map(pledge => pledge.id),
    piores,
    "a lista da posse nao e a das areas mais fracas",
  );
});

test("A PROMESSA DE INDICE E MEDIDA CONTRA A POSSE, e nao contra um numero escolhido", () => {
  const area = CATALOG.areas.find(one => one.id === "security");
  assert.ok(area !== undefined);

  const caiu = withPlatform(
    { priority: "security" },
    { capacity: { index: { security: area.initial - 1 }, history: {} } },
  );
  const subiu = withPlatform(
    { priority: "security" },
    { capacity: { index: { security: area.initial + 1 }, history: {} } },
  );

  const [quebrada] = platformOf(caiu);
  const [cumprida] = platformOf(subiu);
  assert.equal(quebrada?.kept, false);
  assert.equal(quebrada?.from, area.initial, "o alvo deixou de ser o indice da posse");
  assert.equal(cumprida?.kept, true);
});

test("A META DA DIVIDA E A DIVIDA HERDADA, e o sinal nao esta invertido", () => {
  const base = createState();
  const herdada = CATALOG.fiscal.initialDebtRatio;

  const pior = withPlatform(
    { fiscal: "debt" },
    { fiscal: { ...base.fiscal, debt: base.macro.gdp * (herdada + 0.05) } },
  );
  const melhor = withPlatform(
    { fiscal: "debt" },
    { fiscal: { ...base.fiscal, debt: base.macro.gdp * (herdada - 0.05) } },
  );

  assert.equal(platformOf(pior)[0]?.kept, false, "endividar-se mais nao contou como quebra");
  assert.equal(platformOf(melhor)[0]?.kept, true, "desendividar-se nao contou como entrega");
});

test("O PRIMARIO E O DO ULTIMO ANO, e sem mes fechado ele NAO julga", () => {
  const base = createState();
  const vazio = withPlatform({ fiscal: "primary" });
  assert.equal(platformOf(vazio)[0]?.kept, null, "um governo de um dia nao quebrou nada ainda");

  /* ⚠ SO OS ULTIMOS DOZE ENTRAM: um ano inteiro no vermelho seguido de doze meses no azul e uma
     promessa CUMPRIDA — e a soma da serie inteira diria o contrario. */
  const serie = [...Array(MONTHS_PER_YEAR).fill(-30), ...Array(MONTHS_PER_YEAR).fill(10)];
  const azul = withPlatform({ fiscal: "primary" }, { series: { ...base.series, primary: serie } });
  assert.equal(platformOf(azul)[0]?.kept, true);
  assert.equal(platformOf(azul)[0]?.to, 10 * MONTHS_PER_YEAR);
});

test("A REFORMA SO QUEBRA NO FIM, e a promessa de NAO mexer quebra por ACAO", () => {
  const base = createState();
  /* Enquanto nada passou, prometer aprovar uma lei fica em aberto — cobrar no mes 3 seria
     acusar o presidente de nao ter feito o que ele tem 45 meses para fazer. */
  assert.equal(platformOf(withPlatform({ reform: "law" }))[0]?.kept, null);
  /* E a promessa de nao mexer na Constituicao nasce CUMPRIDA, e e a unica assim. */
  assert.equal(platformOf(withPlatform({ reform: "keep" }))[0]?.kept, true);

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const emenda = {
    id: "nova",
    kind: "band",
    target: { scope: "lever", id: "poder-do-executivo" },
    guard: "constitution",
    enactedAt: 5,
  };
  const mexeu = withPlatform({ reform: "keep" }, { norms: [...base.norms, emenda] });
  assert.equal(platformOf(mexeu)[0]?.kept, false, "a emenda passou e a promessa continuou de pe");
  assert.equal(
    platformOf(withPlatform({ reform: "amendment" }, { norms: [...base.norms, emenda] }))[0]?.kept,
    true,
  );

  /* ⚠ A HERDADA NAO CONTA, e o criterio nao e desta suite: `enactedAt = 0` e a lei que o
     presidente encontrou em vigor. Sem isso, toda promessa de reforma nasceria cumprida. */
  const herdadas = base.norms.filter(norm => norm.guard === "constitution");
  assert.ok(herdadas.length > 0, "o catalogo devia trazer normas constitucionais herdadas");
  assert.equal(platformOf(withPlatform({ reform: "amendment" }))[0]?.kept, null);
});

test("TODO NUMERO DO VEREDITO DIZ A PROPRIA GRANDEZA — a divida nao e ponto de indice", () => {
  /* ⚠ A CAPTURA PEGOU `1 → 1` NO FECHO: a divida foi de 78% a 90% e saiu arredondada como se
     fosse ponto de indice, porque o veredito nao dizia a unidade. */
  const base = createState();
  const cheia = {
    priority: "security",
    fiscal: "primary",
    reform: "law",
  };
  const state = { ...base, platform: cheia, series: { ...base.series, primary: [1, 2, 3] } };

  for (const verdict of platformOf(state)) {
    const temNumero = verdict.from !== undefined || verdict.to !== undefined;
    assert.equal(
      temNumero,
      verdict.unit !== undefined,
      `${verdict.id}: numero sem grandeza, ou grandeza sem numero`,
    );
  }

  const divida = platformOf({ ...base, platform: { ...cheia, fiscal: "debt" } })[1];
  assert.equal(divida?.unit, "ratio", "a divida deixou de ser fracao");
});

test("QUEM NAO PROMETEU NADA NAO DEVE NADA — e a fracao quebrada e do que foi dito", () => {
  assert.equal(breachOf(createState()), 0, "a rua cobrou uma promessa que ninguem fez");

  const area = CATALOG.areas.find(one => one.id === "security");
  assert.ok(area !== undefined);
  const meio = withPlatform(
    { priority: "security", reform: "keep" },
    { capacity: { index: { security: area.initial - 10 }, history: {} } },
  );
  /* Duas promessas, uma quebrada. */
  assert.equal(breachOf(meio), 0.5);
});

test("A PLATAFORMA SE ESCREVE UMA VEZ SO — o mes 30 nao reescreve a posse", () => {
  const posse = playMonth(createState(), { platform: { priority: "security", fiscal: "debt" } });
  assert.equal(posse.state.platform.priority, "security");
  assert.equal(posse.state.platform.fiscal, "debt");
  assert.equal(posse.state.platform.reform, null, "o eixo nao marcado devia ficar vazio");
  assert.equal(spoken(posse.state.platform), true);

  const depois = playMonth(posse.state, { platform: { priority: "education", reform: "law" } });
  assert.equal(depois.state.platform.priority, "security", "a posse foi reescrita depois dela");
  assert.equal(depois.state.platform.reform, null, "um eixo novo entrou fora da posse");
});

test("ID QUE NAO EXISTE NAO ENTRA NO ESTADO — nem pela tela, nem por um save editado", () => {
  assert.deepEqual(chosenOf({ priority: "atlantida", fiscal: "debt", reform: "" }), {
    priority: null,
    fiscal: "debt",
    reform: null,
  });
  /* ⚠ E A AREA TEM DE ESTAR NA LISTA DA POSSE: a Fazenda existe no catalogo e NAO e oferecida,
     porque a lista sao as tres mais fracas. Aceita-la poria no estado uma promessa que a carta
     nunca ofereceu. */
  assert.equal(chosenOf({ priority: "treasury" }).priority, null);
});

test("A PLATAFORMA ATRAVESSA O SAVE, e a versao 19 nao abre mais", () => {
  const state = playMonth(createState(), {
    platform: { priority: "education", fiscal: "primary", reform: "keep" },
  }).state;

  const volta = deserialize(serialize(state));
  assert.equal(volta.ok, true);
  if (volta.ok) assert.deepEqual(volta.state.platform, state.platform);

  const semCampo = JSON.parse(serialize(state));
  delete semCampo.platform;
  const recusado = deserialize(JSON.stringify(semCampo));
  assert.equal(recusado.ok, false, "um save sem plataforma foi aceito");
});

test("A TRAICAO DA RUA PASSA A OLHAR A PLATAFORMA, e ela nao empilha", () => {
  /* ⚠ O MAIOR DOS DOIS, e nao a soma — ver a prosa em `turn.mjs`. A prova cobra o efeito: um
     governo que quebrou a plataforma tem a rua mais insatisfeita que um que nao prometeu. */
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 6 }), months => {
      let mudo = createState();
      let promissor = playMonth(createState(), { platform: { priority: "security" } }).state;

      for (let month = 0; month < months; month++) {
        mudo = playMonth(mudo, {}).state;
        promissor = playMonth(promissor, {}).state;
      }

      const area = CATALOG.areas.find(one => one.id === "security");
      assert.ok(area !== undefined);
      /* Sem verba nenhuma a Seguranca cai, entao a promessa esta quebrada nos dois mundos — e
         so um deles a fez. */
      assert.ok((promissor.capacity.index["security"] ?? 0) < area.initial);
      assert.equal(breachOf(promissor), 1);
      assert.equal(breachOf(mudo), 0);

      const somaMuda = Object.values(mudo.mood).reduce((a, b) => a + b, 0);
      const somaPromissor = Object.values(promissor.mood).reduce((a, b) => a + b, 0);
      assert.ok(
        somaPromissor < somaMuda,
        `quebrar a plataforma nao custou humor: ${somaPromissor} contra ${somaMuda}`,
      );
    }),
  );
});
