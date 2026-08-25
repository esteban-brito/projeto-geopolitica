/* SUITE · A PAUTA DERIVADA — o orcamento vira proposta, e o rito vira consequencia. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
/* O HUMOR DE ABERTURA VEM DO ESTADO. */
import { INITIAL_LOYALTY } from "../../src/state/state.mjs";
import { compose } from "../../src/application/agenda.mjs";
import { FISCAL } from "../../src/data/fiscal.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { RULES } from "../../src/data/rules.mjs";
import { QUALIFIED_MAJORITY, SEATS, SIMPLE_MAJORITY } from "../../src/data/regime.mjs";

/** O nivel de abertura de cada programa, que e o estado do primeiro mes. */
const OPENING = Object.fromEntries(PROGRAMS.map(program => [program.id, program.initial]));

/** @param {Record<string, number>} requested */
const composeWith = requested => compose({ programs: PROGRAMS, levels: OPENING, requested });

/** Um programa do catalogo, sorteado pelo id — a prova vale para todos. */
const anyProgram = fc.constantFrom(...PROGRAMS);

test("O PAIS HERDADO CABE NO ORCAMENTO HERDADO", () => {
  /* Duas verdades divergem, e esta divergiria
     no primeiro mes — o jogador alocaria a partir de um total e o LASTRO cobraria
     a partir de outro. */
  /* ⚠ A RENUNCIA NAO ENTRA NA SOMA, e a exclusao E a prova: ela nao e despesa, e conta-la
     aqui faria a ancora afirmar que o pais gasta um dinheiro que ninguem empenha. */
  const total = PROGRAMS.filter(program => program.waiver !== true).reduce(
    (sum, program) => sum + (program.cost * program.initial) / 100,
    0,
  );
  const declared = FISCAL.initialMandatory + FISCAL.initialDiscretionary;

  assert.ok(
    Math.abs(total - declared) / declared < 0.01,
    `os programas somam ${total.toFixed(1)} e o catalogo fiscal declara ${declared}`,
  );
});

test("A OBRIGATORIA E A SOMA DOS PISOS", () => {
  /* A outra metade da prova acima, e ela e o que faz a reforma significar alguma coisa. */
  const locked = PROGRAMS.filter(program => program.waiver !== true).reduce(
    (sum, program) => sum + (program.cost * program.floor) / 100,
    0,
  );

  assert.ok(
    Math.abs(locked - FISCAL.initialMandatory) / FISCAL.initialMandatory < 0.02,
    `os pisos somam ${locked.toFixed(1)} e o catalogo fiscal declara ${FISCAL.initialMandatory}`,
  );
});

test("COMPRAR UMA MAIORIA NAO CABE NUM MES, e nenhuma bancada sozinha decide", () => {
  /* Sem esta prova, a proxima recalibragem quebraria o desenho em silencio — comprar o
     Congresso viraria jogada dominante, e a escolha central do jogo (a quem pagar) deixaria
     de existir. */
  const room = FISCAL.initialDiscretionary / 12;
  const chamber = SEATS * FISCAL.seatPrice;

  assert.ok(chamber > room * 1.5, `o plenario custa ${chamber} e cabem ${room} no mes`);

  /* A MAIORIA MAIS BARATA E A DAS MAIORES BANCADAS, porque o preco e por CADEIRA: a mesma
     maioria custa o mesmo montada de qualquer jeito, e o que muda e quantas portas o
     presidente precisa bater. */
  const ordenadas = [...PARTIES].sort((a, b) => b.seats - a.seats);
  let cadeiras = 0;
  let custo = 0;
  for (const party of ordenadas) {
    if (cadeiras >= SIMPLE_MAJORITY) break;
    cadeiras += party.seats;
    custo += party.seats * FISCAL.seatPrice;
  }

  assert.ok(
    cadeiras >= SIMPLE_MAJORITY,
    `as bancadas somam ${cadeiras} e a maioria simples e ${SIMPLE_MAJORITY}`,
  );
  assert.ok(
    custo > room,
    `a maioria mais barata custa ${custo.toFixed(1)} e cabe nos ${room.toFixed(1)} do mes`,
  );

  /* ⚠ E NENHUMA BANCADA SOZINHA E MAIORIA. */
  const maior = Math.max(...PARTIES.map(party => party.seats));
  assert.ok(
    maior < SIMPLE_MAJORITY,
    `a maior bancada tem ${maior} cadeiras e fecha a maioria simples sozinha`,
  );
});

test("O PISO NUNCA PASSA DO NIVEL HERDADO", () => {
  /* Um piso acima do gasto de hoje significaria que o pais ja esta ilegal na posse — e o
     jogador comecaria devendo uma reforma que ninguem pediu. */
  for (const program of PROGRAMS) {
    assert.ok(
      program.floor <= program.initial,
      `${program.id}: piso ${program.floor} acima do nivel herdado ${program.initial}`,
    );
    assert.ok(
      program.initial <= program.ceiling,
      `${program.id}: nivel herdado ${program.initial} acima do teto ${program.ceiling}`,
    );
  }
});

test("NENHUM MOVIMENTO NULO VIRA PROPOSTA", () => {
  /* Sem esta recusa, o peso zero produziria uma divisao por zero ou — pior — um vetor em (50,
     50), que e uma proposta centrista fantasma que o Congresso votaria com prazer e que
     ninguem escreveu. */
  assert.equal(composeWith({}).proposal, null);
  assert.equal(composeWith(OPENING).proposal, null);
  assert.equal(composeWith({}).quorum, 0);
  assert.deepEqual(composeWith({}).moves, []);
});

test("CORTAR ESPELHA: o mesmo programa para os dois lados da posicao oposta", () => {
  fc.assert(
    fc.property(anyProgram, fc.integer({ min: 1, max: 20 }), (program, step) => {
      const up = composeWith({ [program.id]: program.initial + step }).proposal;
      const down = composeWith({ [program.id]: program.initial - step }).proposal;
      if (!up || !down) return true;

      /* AS DUAS POSICOES SAO SIMETRICAS EM RELACAO AO CENTRO. */
      return (
        Math.abs(up.economic + down.economic - 100) < 1e-9 &&
        Math.abs(up.liberty + down.liberty - 100) < 1e-9
      );
    }),
    { numRuns: 300 },
  );
});

test("A AMEACA NAO ESPELHA: cortar a maquina nao desameaca ninguem", () => {
  fc.assert(
    fc.property(anyProgram, fc.integer({ min: 1, max: 20 }), (program, step) => {
      const up = composeWith({ [program.id]: program.initial + step }).proposal;
      const down = composeWith({ [program.id]: program.initial - step }).proposal;
      if (!up || !down) return true;

      /* O termo mede o quanto o ASSUNTO toca a barganha, e tocar nao tem sinal. */
      return Math.abs(up.threat - down.threat) < 1e-9;
    }),
    { numRuns: 300 },
  );
});

test("O SINAL DO DINHEIRO SEGUE O CATALOGO: gastar mais custa", () => {
  fc.assert(
    fc.property(anyProgram, fc.integer({ min: 1, max: 20 }), (program, step) => {
      const up = composeWith({ [program.id]: program.initial + step });
      const down = composeWith({ [program.id]: program.initial - step });
      if (!up.proposal || !down.proposal) return true;

      /* `fiscalImpact` positivo POUPA, como toda a convencao do catalogo. */
      return up.proposal.fiscalImpact < 0 && down.proposal.fiscalImpact > 0;
    }),
    { numRuns: 300 },
  );
});

test("O RITO SAI DO CONTEUDO, e nunca e mais barato que a parede derrubada", () => {
  fc.assert(
    fc.property(anyProgram, program => {
      /* Furar o piso ate o chao. */
      const agenda = composeWith({ [program.id]: 0 });
      if (!agenda.proposal) return true;

      if (program.floor === 0) return agenda.proposal.instrument === "budget";

      const expected =
        program.guard === "constitution" ? "amendment" : program.guard === "law" ? "law" : "budget";

      return agenda.proposal.instrument === expected;
    }),
    { numRuns: 300 },
  );
});

test("O QUORUM ACOMPANHA O RITO, e a execucao orcamentaria nao vai a plenario", () => {
  for (const program of PROGRAMS) {
    const agenda = composeWith({ [program.id]: 0 });
    const instrument = agenda.proposal?.instrument;

    if (instrument === "amendment") assert.equal(agenda.quorum, QUALIFIED_MAJORITY);
    else if (instrument === "law") assert.equal(agenda.quorum, SIMPLE_MAJORITY);
    else assert.equal(agenda.quorum, 0);
  }
});

test("O RITO MAIS EXIGENTE MANDA no pacote inteiro", () => {
  /* A reforma e UM TEXTO SO: tudo que ela move vai junto ao plenario. */
  const constitutional = PROGRAMS.find(program => program.guard === "constitution");
  const loose = PROGRAMS.find(program => program.guard === "none" && program.floor > 0);
  assert.ok(constitutional && loose, "o catalogo precisa dos dois casos para esta prova valer");

  const together = composeWith({ [constitutional.id]: 0, [loose.id]: 0 });
  assert.equal(together.proposal?.instrument, "amendment");
  assert.equal(together.quorum, QUALIFIED_MAJORITY);
});

test("DENTRO DAS FAIXAS NAO PRECISA DE NINGUEM", () => {
  fc.assert(
    fc.property(anyProgram, fc.double({ min: 0, max: 1, noNaN: true }), (program, where) => {
      /* Qualquer nivel entre o piso e o teto e execucao orcamentaria: nao ha voto a pedir,
         porque a lei ja autorizou. */
      const level = program.floor + (program.ceiling - program.floor) * where;
      const agenda = composeWith({ [program.id]: level });

      return agenda.quorum === 0 && agenda.breaches.length === 0;
    }),
    { numRuns: 400 },
  );
});

/** A faixa de abertura de cada alavanca — o que o catalogo declara. */
const OPENING_BANDS = Object.fromEntries(
  PROGRAMS.map(program => [program.id, { floor: program.floor, ceiling: program.ceiling }]),
);

test("MOVER A LEI E UMA PROPOSTA, e ela custa no minimo uma lei", () => {
  for (const program of PROGRAMS) {
    const raised = { floor: program.floor + 5, ceiling: program.ceiling };
    const agenda = compose({
      programs: PROGRAMS,
      levels: OPENING,
      requested: OPENING,
      bands: OPENING_BANDS,
      requestedBands: { [program.id]: raised },
    });

    assert.ok(agenda.proposal, `mover o piso de ${program.id} nao virou proposta`);
    const expected = program.guard === "constitution" ? "amendment" : "law";
    assert.equal(
      agenda.proposal?.instrument,
      expected,
      `mover o piso de ${program.id} (guarda ${program.guard}) cobrou ${agenda.proposal?.instrument}`,
    );
  }
});

test("A LEI E O GASTO CABEM NO MESMO TEXTO, e o texto nao cobra duas vezes", () => {
  /* A jogada que o ciclo 3 descreveu e que nao existia: derrubar o piso da saude E baixar o
     gasto para dentro do piso novo, na mesma lei. */
  const guarded = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  assert.ok(guarded, "o catalogo perdeu o programa de piso constitucional");

  const target = guarded.floor - 15;
  const together = compose({
    programs: PROGRAMS,
    levels: OPENING,
    requested: { [guarded.id]: target },
    bands: OPENING_BANDS,
    requestedBands: { [guarded.id]: { floor: target, ceiling: guarded.ceiling } },
  });

  /* O movimento de nivel deixou de furar parede: quem furou foi a lei. */
  assert.equal(
    together.breaches.length,
    0,
    "o gasto dentro do piso novo continuou contando como violacao",
  );
  assert.equal(together.proposal?.instrument, "amendment");
  assert.equal(together.quorum, QUALIFIED_MAJORITY);
});

test("SOLTAR A FAIXA E EXCLUIR A LEI, e nao ha botao para isso", () => {
  const guarded = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  assert.ok(guarded);

  const before = compose({
    programs: PROGRAMS,
    levels: OPENING,
    requested: { [guarded.id]: 0 },
    bands: OPENING_BANDS,
  });
  assert.equal(before.proposal?.instrument, "amendment");

  const freed = { ...OPENING_BANDS, [guarded.id]: { floor: 0, ceiling: guarded.ceiling } };
  const after = compose({
    programs: PROGRAMS,
    levels: OPENING,
    requested: { [guarded.id]: 0 },
    bands: freed,
  });

  assert.equal(after.proposal?.instrument, "budget", "sem piso, o corte ainda pediu voto");
  assert.equal(after.quorum, 0);
});

test("A FAIXA ESPELHA COMO O NIVEL: vincular e desvincular sao opostos", () => {
  /* O mesmo espelho que faz cortar a saude ser um ato de direita vale para a lei: ampliar o
     que ela obriga e um ato do lado do programa, e soltar a obrigacao e o ato contrario. */
  const program = PROGRAMS.find(p => p.floor > 10 && p.floor < 80 && p.economic < 40);
  assert.ok(program, "o catalogo precisa de um programa de esquerda com piso movel");

  const raise = compose({
    programs: PROGRAMS,
    levels: OPENING,
    requested: OPENING,
    bands: OPENING_BANDS,
    requestedBands: { [program.id]: { floor: program.floor + 8, ceiling: program.ceiling } },
  });
  const lower = compose({
    programs: PROGRAMS,
    levels: OPENING,
    requested: OPENING,
    bands: OPENING_BANDS,
    requestedBands: { [program.id]: { floor: program.floor - 8, ceiling: program.ceiling } },
  });

  assert.ok(raise.proposal && lower.proposal);
  assert.equal(
    (raise.proposal?.economic ?? 0) + (lower.proposal?.economic ?? 0),
    100,
    "as duas posicoes deveriam somar 100 — uma e o espelho da outra",
  );
});

test("O PESO E EM DINHEIRO: o programa caro domina a posicao", () => {
  /* Sem isto, mover a vacinacao dominaria uma proposta que no mundo e sobre previdencia — os
     dois movimentos tem tamanho parecido no controle e tamanhos incomparaveis no pais. */
  const big = [...PROGRAMS].sort((a, b) => b.cost - a.cost)[0];
  const small = [...PROGRAMS].sort((a, b) => a.cost - b.cost)[0];
  assert.ok(big && small && big.cost > small.cost * 2);

  const agenda = composeWith({ [big.id]: big.initial - 10, [small.id]: small.initial + 10 });
  assert.equal(agenda.proposal?.area, big.area);

  /* A posicao fica do lado ESPELHADO do programa grande, que foi o cortado. */
  const mirrored = 100 - big.economic;
  const distanceToBig = Math.abs((agenda.proposal?.economic ?? 0) - mirrored);
  const distanceToSmall = Math.abs((agenda.proposal?.economic ?? 0) - small.economic);
  assert.ok(
    distanceToBig < distanceToSmall,
    `a posicao ${agenda.proposal?.economic} ficou mais perto do programa barato`,
  );
});

/* ── AS ALAVANCAS DE REGRA ────────────────────────────────────────────────── Politica que
   nao se mede em reais: privatizar, estatizar, concentrar poder. */

const POWER = RULES.find(rule => rule.family === "power");
const PROPERTY = RULES.find(rule => rule.family === "property");

/** @param {Record<string, number>} requested @param {number} [power] */
const withRules = (requested, power = 0) =>
  compose({
    programs: PROGRAMS,
    rules: RULES,
    levels: { ...OPENING, ...Object.fromEntries(RULES.map(rule => [rule.id, rule.initial])) },
    requested,
    power,
  });

test("PRIVATIZAR E UMA PROPOSTA, e ela pesa pelo ALCANCE e nao pelo custo", () => {
  assert.ok(PROPERTY);
  const agenda = withRules({ [PROPERTY.id]: 0 });

  assert.ok(agenda.proposal, "vender uma estatal inteira nao produziu pauta");
  /* REGRA NAO CONSOME DISCRICIONARIO: o efeito fiscal dela e dividendo, folha e venda, e
     nenhum dos tres e gasto do mes. */
  assert.equal(agenda.spend, 0);
  /* `-0 === 0` e verdade em JavaScript e `assert.equal` discorda — o zero negativo sai da
     negacao do zero em `fiscalImpact: -spend`. */
  assert.equal(Math.abs(agenda.proposal.fiscalImpact), 0);
});

test("O ESPELHO VALE PARA REGRA TAMBEM: estatizar e privatizar sao opostos", () => {
  assert.ok(PROPERTY);
  const up = withRules({ [PROPERTY.id]: PROPERTY.initial + 10 }).proposal;
  const down = withRules({ [PROPERTY.id]: PROPERTY.initial - 10 }).proposal;
  assert.ok(up && down);

  assert.ok(Math.abs(up.economic + down.economic - 100) < 1e-9);
});

test("A JANELA DE OVERTON: o poder do Executivo derruba o rito", () => {
  /* A prova central da Parte 3. */
  assert.ok(POWER);
  const hard = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);
  assert.ok(hard);

  const move = { [hard.id]: hard.floor - 10 };

  assert.equal(withRules(move, 0).proposal?.instrument, "amendment");
  assert.equal(withRules(move, 70).proposal?.instrument, "law");
  assert.equal(withRules(move, 95).proposal?.instrument, "budget");

  /* E O QUORUM ACOMPANHA, senao a tela mostraria "lei" pedindo 308 votos. */
  assert.equal(withRules(move, 0).quorum, QUALIFIED_MAJORITY);
  assert.equal(withRules(move, 70).quorum, SIMPLE_MAJORITY);
  assert.equal(withRules(move, 95).quorum, 0);
});

test("O PODER NAO SE AUTOCONCEDE", () => {
  /* Se a proposta pudesse usar o poder que ela mesma cria, uma emenda que leva o Executivo ao
     teto se autorizaria a passar por caneta — e existiria uma jogada que se aprova sozinha,
     que e o oposto de tudo o que este modelo faz. */
  assert.ok(POWER);
  const agenda = withRules({ [POWER.id]: 100 }, POWER.initial);

  assert.equal(agenda.proposal?.instrument, "amendment");
  assert.equal(agenda.quorum, QUALIFIED_MAJORITY);
});

test("CONCENTRAR PODER E A PAUTA MAIS CARA QUE O CATALOGO PRODUZ", () => {
  /* Ela nao e proibida — e cara. */
  assert.ok(POWER);
  const authoritarian = withRules({ [POWER.id]: 100 }).proposal;
  assert.ok(authoritarian);

  for (const program of PROGRAMS) {
    const other = withRules({ [program.id]: 0 }).proposal;
    if (!other) continue;
    assert.ok(
      authoritarian.threat >= other.threat,
      `${program.id} ameaca mais (${other.threat}) que concentrar poder (${authoritarian.threat})`,
    );
  }

  /* E ela e o extremo do eixo de liberdades, e nao do economico: concentrar poder nao e de
     esquerda nem de direita, e vertical. */
  assert.ok(authoritarian.liberty < 10, `poder no maximo deu liberdade ${authoritarian.liberty}`);
});

test("VERBA E REGRA CABEM NO MESMO TEXTO", () => {
  /* O logrolling existindo por construcao: privatizar uma estatal e cortar um programa vao
     juntos ao plenario, e o Congresso ve UMA proposta — cuja posicao e a media ponderada das
     duas. */
  assert.ok(PROPERTY);
  const program = PROGRAMS[0];
  assert.ok(program);

  const agenda = withRules({ [PROPERTY.id]: 0, [program.id]: 0 });
  assert.equal(agenda.moves.length, 2);
  assert.ok(agenda.proposal);
});

test("A PROPOSTA COMPOSTA CABE NO MOTOR DE VOTACAO sem conversao nenhuma", async () => {
  /* A afirmacao central do desenho: o ECLUSA nao mudou uma linha. */
  const { whipCount } = await import("../../src/domain/congress/index.mjs");
  const { PARTIES } = await import("../../src/data/parties.mjs");

  const program = PROGRAMS[0];
  assert.ok(program);
  const agenda = composeWith({ [program.id]: 0 });
  assert.ok(agenda.proposal);

  const forecast = whipCount({
    bill: agenda.proposal,
    parties: PARTIES,
    funding: {},
    loyalty: Object.fromEntries(PARTIES.map(party => [party.id, INITIAL_LOYALTY])),
  });

  assert.ok(Number.isFinite(forecast.votes));
  assert.ok(forecast.votes >= 0 && forecast.votes <= 513);
});
