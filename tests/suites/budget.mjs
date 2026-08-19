/* SUITE · O ORCAMENTO — propriedades do primeiro motor de verdade.
   ══════════════════════════════════════════════════════════════════════════════

   O que precisa ser provado aqui NAO e que um mes especifico fecha certo. E que
   a ARMADILHA existe: que ha entradas validas nas quais o caixa discricionario
   e espremido contra o zero sem nenhum evento roteirizado. Se nenhuma entrada
   produzir aperto, o motor esta bonito e nao serve para o jogo. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { ceilingOf, growMandatory, revenueOf, step } from "../../src/domain/budget/index.mjs";
import { FISCAL } from "../../src/data/fiscal.mjs";

/** @typedef {import("../../src/domain/budget/index.mjs").BudgetInput} BudgetInput */

/* Entradas VALIDAS: um exercicio plausivel, com o PIB variando numa faixa larga
   o bastante para conter recessao e expansao. A faixa e larga de proposito —
   gerador estreito prova que o motor funciona onde ele ja funcionava. */
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
  /* Se ela pudesse encolher, o jogador resolveria o aperto esperando. Salario e
     aposentadoria nao consultam a arrecadacao para subir, e e essa assimetria
     que faz o cobertor ser curto. */
  fc.assert(
    fc.property(anyInput, input => {
      assert.ok(step(input).mandatory > input.mandatory);
    }),
  );
});

test("doze meses de crescimento vegetativo dao exatamente a taxa anual", () => {
  /* A raiz de indice doze e nao a taxa dividida por doze. A diferenca parece
     arredondamento num mes e vira desvio visivel ao longo de 48 turnos. */
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
  /* ⚠ ESTA PROVA MUDOU DE LADO EM 16/08/2026, e a versao antiga estava CODIFICANDO
     UM DEFEITO. Ela cobrava `allowance <= cash`, e essa desigualdade era o ultimo
     muro do jogo: com o empenho preso ao caixa, o saldo primario dava ZERO em toda
     jogada — medido em 48 meses, um governo que poe os 38 programas no maximo e paga
     verba cheia fecha o mes igual a um que nao faz nada.

     `spent <= cash` e `if (proibido) return` escrito em aritmetica, e a regra central
     deste projeto e "tudo tem preco, nada tem muro". A prova cobrava a existencia do
     muro, entao ela tinha de cair junto — e ela nao foi APAGADA: ela passou a cobrar
     a restricao que sobrou, que e a unica com lei atras.

     O TETO CONTINUA SENDO PROVADO, e a distincao e a razao de tudo: o arcabouco e
     norma, e o jogador pode muda-la pelo rito; o caixa nao tinha nada atras. */
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      assert.ok(out.allowance >= 0, `permitido negativo: ${out.allowance}`);
      assert.ok(out.allowance <= Math.max(0, out.ceiling - out.mandatory) + 1e-9);
    }),
  );
});

test("GASTAR ACIMA DO CAIXA E POSSIVEL, e produz deficit — o muro caiu", () => {
  /* A prova que o conserto exigia, e ela e o inverso exato da que existia aqui.
     Enquanto o empenho estava preso ao caixa, esta afirmacao era falsa por
     construcao: nao havia jogada que produzisse deficit primario.

     ⚠ ELA COBRA A EXISTENCIA DO CAMINHO, e nao a frequencia dele. Um pais em que o
     teto e mais generoso que a arrecadacao e o caso comum no Brasil — o arcabouco
     autoriza deficit —, e o que se prova aqui e que o modelo sabe representa-lo. */
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      if (out.contingency) return;

      /* Empenhando tudo o que o teto autoriza, o saldo do mes e o caixa menos isso —
         e ele e NEGATIVO sempre que o teto abre mais espaco do que o caixa tem. */
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
  /* Esta e a propriedade mais importante do arquivo, e ela e o oposto das
     outras: em vez de exigir que algo nunca aconteca, exige que algo POSSA
     acontecer. Um motor em que o aperto e impossivel passaria em todas as
     provas acima e nao serviria para o jogo — foi exatamente esse o defeito da
     formula original, que definia a obrigatoria como fracao da receita. */
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
  /* O caso do dossie, montado a mao: o PIB decepciona, a receita cai abaixo da
     ancora, o teto do arcabouco ENCOLHE, e a obrigatoria — que cresceu no mesmo
     mes — passa por cima dele. Nenhum evento escrito; aritmetica. */
  /* ⚠ ESTE CENARIO FOI REESCRITO em 13/08/2026, e a razao vale registrada porque
     ela e o proprio aviso do comentario abaixo cumprindo o prazo. Os valores
     antigos (PIB 11.000, obrigatoria 3.270, ancora 3.630) foram calibrados quando
     `taxLoad` era 0,33 — a carga tributaria dos TRES niveis de governo, cobrada
     inteira para a Uniao. Corrigido para 0,20, a receita deste mesmo cenario caia
     de 3.630 para 2.200 contra uma ancora de 3.630, e o caso "calmo" nascia em
     contingenciamento permanente: a prova falhava na PRIMEIRA linha, que e o
     lugar certo para uma escala errada aparecer. */
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

  /* Mesma partida, PIB 15% menor. Nada mais muda.
     O LIMIAR E CALIBRACAO E VALE ESTAR ESCRITO: com estes parametros o gatilho
     so dispara com queda de receita acima de 9,66%, porque e onde
     `2300 × (1 + 0,7g)` cruza a obrigatoria ja crescida de 2144,4.

     E REPARE QUE ELE FICOU MAIS SENSIVEL: antes eram 12,83%, agora sao 9,66%. Nao
     foi ajuste de dificuldade — foi a escala real chegando. Um orcamento em que a
     obrigatoria e 93% do gasto quebra com uma recessao menor do que um em que ela
     e 91%, e o Brasil e o primeiro. Se a calibracao mudar, este numero muda junto. */
  /* ⚠ E A BANDA REAL REESCREVEU ESTA PROVA EM 16/08/2026, sem apaga-la — como o muro
     do caixa reescreveu `allowance <= cash`. A afirmacao antiga era "receita caindo
     ENCOLHE o teto", e ela era verdadeira sobre a regra sem banda. Com o piso de 0,6%
     ao ano da LC 200/2023 ela deixa de ser: o piso existe justamente para o teto ser
     corrigido num exercicio de receita ruim, e sem ele dois anos fracos seguidos
     derrubam o Estado em termos reais sem ninguem decidir nada.

     O que a prova cobra agora sao as DUAS metades da regra nova. */
  const recessao = step({ ...base, gdp: base.gdp * 0.85 });
  assert.ok(recessao.revenue < calmo.revenue, "a receita tinha de cair");

  /* 1 — O PISO SEGURA. A recessao nao encolhe o teto abaixo do que a lei garante. */
  assert.ok(
    recessao.ceiling >= base.anchorExpense,
    `o teto caiu para ${recessao.ceiling} numa recessao — o piso da banda nao segurou`,
  );
  assert.equal(recessao.contingency, false, "com o piso valendo, esta recessao nao aperta");

  /* 2 — E O GATILHO CONTINUA ALCANCAVEL, que e a outra metade e a mais importante:
     um contingenciamento que nunca dispara e um instrumento morto, e este projeto ja
     pagou por isso uma vez (achado 3). O que aperta agora nao e a receita caindo — e a
     OBRIGATORIA passando o teto, que e a armadilha que o arquivo do motor promete.

     O limiar e calibracao e vale escrito: com estes parametros e sem inflacao, a
     obrigatoria fura quando passa de `2300 × 1,006 = 2313,8` ja crescida de um mes. */
  const pesada = step({ ...base, gdp: base.gdp * 0.85, mandatory: 2320 });
  assert.equal(pesada.contingency, true, "a obrigatoria acima do teto tinha de apertar");
  assert.equal(pesada.allowance, 0);
});

test("a divida sobe quando o saldo do mes e negativo, e so por isso", () => {
  fc.assert(
    fc.property(anyInput, input => {
      const out = step(input);
      /* Sem juros: a divida se move pelo saldo primario e por nada mais. Quando
         CORRENTE existir, esta propriedade muda junto — e e para isso que ela
         esta escrita assim, apertada. */
      assert.ok(Math.abs(out.debt - (input.debt - out.balance)) < 1e-9);
      if (out.balance < 0) assert.ok(out.debt > input.debt);
      if (out.balance > 0) assert.ok(out.debt < input.debt);
    }),
  );
});

test("nenhuma entrada valida produz NaN ou infinito", () => {
  /* Numero invalido nao lanca: ele atravessa o motor e aparece como uma tela
     escrita "NaN%" tres camadas adiante. */
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
