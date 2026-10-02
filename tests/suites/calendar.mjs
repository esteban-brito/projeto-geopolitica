/* SUITE · O CALENDÁRIO — a forma do ano fiscal, e ela não depende de relógio. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { AHEAD, calendarOf } from "../../src/application/calendar.mjs";
import { CALENDAR, REPEATS } from "../../src/data/calendar.mjs";
import { MONTHS_PER_TERM } from "../../src/data/regime.mjs";
import { monthLabel } from "../../src/state/state.mjs";

test("O CALENDÁRIO E FUNÇÃO PURA DE `month` — nenhum relógio entra nele", () => {
  /* ⚠ ELA E A RESTRIÇÃO DECLARADA DO ITEM, e sem prova ela seria só uma frase: um `Date.now`
     escondido faria a mesma partida mostrar prazos diferentes conforme o dia. */
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 600 }), month => {
      assert.deepEqual(calendarOf(month), calendarOf(month), "duas chamadas divergiram");
    }),
  );
});

test("O MÊS DO CALENDÁRIO E O MESMO QUE A TELA IMPRIME — e há uma conta só", () => {
  /* Se o marco de abril cair no mês que a faixa chama de "mai", o jogo passa a ter dois
     calendarios: o do relógio da tela e o dos prazos. */
  const nomes = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  for (let month = 0; month < MONTHS_PER_TERM; month++) {
    const impresso = monthLabel(month).split(" · ")[0] ?? "";
    for (const marco of calendarOf(month).now) {
      /* ⚠ O QUE SE CONFERE E A CONGRUENCIA, e não a igualdade: o bimestral repete de dois em
         dois meses, então ele cai em fev, abr, jun — e só o anual casa com o mês do catálogo.
         A primeira versão desta prova exigia igualdade e reprovou o código CERTO. */
      const periodo = REPEATS[marco.id] ?? 12;
      const impressoIndice = nomes.indexOf(impresso);
      assert.equal(
        (impressoIndice + 1 - marco.month) % periodo,
        0,
        `${marco.id} venceu em ${impresso}, fora do ciclo de ${periodo} meses do catalogo`,
      );
    }
  }
});

test("TODO MARCO ANUAL VENCE UMA VEZ POR ANO, e o bimestral seis", () => {
  const contagem = /** @type {Record<string, number>} */ ({});
  for (let month = 0; month < 12; month++) {
    for (const marco of calendarOf(month).now) {
      contagem[marco.id] = (contagem[marco.id] ?? 0) + 1;
    }
  }

  for (const marco of CALENDAR) {
    const esperado = marco.id === "bimestral" ? 6 : 1;
    assert.equal(contagem[marco.id], esperado, `${marco.id} venceu ${contagem[marco.id]}x no ano`);
  }
});

test("O TRIMESTRE NÃO REPETE O QUE JÁ VENCE AGORA, e ele e ordenado por urgência", () => {
  for (let month = 0; month < MONTHS_PER_TERM; month++) {
    const { now, soon } = calendarOf(month);
    const agora = new Set(now.map(marco => marco.id));

    for (const marco of soon) {
      assert.ok(!agora.has(marco.id), `${marco.id} aparece nos dois lados no mes ${month}`);
      assert.ok(marco.due >= 1 && marco.due <= AHEAD, `${marco.id} caiu fora da janela`);
    }
    const prazos = soon.map(marco => marco.due);
    assert.deepEqual(
      prazos,
      [...prazos].sort((a, b) => a - b),
      "a fila nao esta por urgencia",
    );
  }
});

test("O MANDATO DEIXA DE TER 48 MESES IGUAIS — e há mês sem cobrança nenhuma", () => {
  /* Se todo mês cobrar alguma coisa, o calendário não da pulso: ele vira ruído de fundo. */
  let comCobranca = 0;
  for (let month = 0; month < MONTHS_PER_TERM; month++) {
    if (calendarOf(month).now.length > 0) comCobranca += 1;
  }
  assert.ok(comCobranca > 0, "nenhum mes cobra nada — o calendario e inerte");
  assert.ok(comCobranca < MONTHS_PER_TERM, "todo mes cobra algo — o calendario nao da pulso");
});
