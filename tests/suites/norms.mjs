/* SUITE · AS NORMAS — a lei virou texto, e o texto tem ordem.
   ══════════════════════════════════════════════════════════════════════════════

   O que esta suite cobra nao e "a faixa saiu certa": e que a PRECEDENCIA entre
   normas contraditorias seja a declarada, e que ela nao dependa de nada que o
   jogador nao consiga prever antes de escrever a segunda lei.

   Sem ordem declarada, duas leis que se cruzam produzem um pais que depende da
   ordem do array — e o jogador nao teria como prever nada. Com ela, cada prova
   abaixo e uma frase que o jogo passa a poder dizer em voz alta:

     · emenda so se derruba com emenda;
     · a mais nova vence, EXCETO quando a velha e mais forte;
     · o que fala de um vence o que fala de todos;
     · o `salvo` salva;
     · o gatilho liga e desliga sem ninguem votar;
     · revogar a nova faz a velha voltar.

   A ultima e a que justifica o motor existir. Enquanto a lei era um par de
   numeros sobrescrito, nao havia "a velha" para voltar. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { enact, inherited, resolve } from "../../src/domain/norms/index.mjs";
import { bandsOf, discretionaryRoom, playMonth, settlement } from "../../src/application/turn.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { RULES } from "../../src/data/rules.mjs";
import { FISCAL } from "../../src/data/fiscal.mjs";
import { createState } from "../../src/state/state.mjs";

/** As alavancas como o motor as vê: id e grupo, e nada mais. */
const LEVERS = [
  /* ⚠ O CUSTO ENTRA AQUI porque a VINCULACAO precisa dele: e o divisor que converte
     fracao da receita em pontos da alavanca. Sem ele, as tres normas vinculadas do
     catalogo ficariam DORMENTES e a suite estaria medindo um pais sem piso de saude. */
  ...PROGRAMS.map(program => ({ id: program.id, group: program.area, cost: program.cost })),
  ...RULES.map(rule => ({ id: rule.id, group: rule.family })),
];

/* A RECEITA DE ABERTURA, e ela e a mesma conta do LASTRO: PIB x carga. Ela existe
   nesta suite porque a vinculacao incide sobre ela — e o valor e o do catalogo, e nao
   um numero escolhido aqui, senao a prova de que a abertura reproduz o catalogo
   estaria comparando o catalogo com uma receita inventada. */
const OPENING_REVENUE = FISCAL.initialGdp * FISCAL.taxLoad;

/** A pilha herdada — o pais no dia da posse. */
const OPENING = [...PROGRAMS, ...RULES].map(inherited);

/**
 * @param {ReadonlyArray<import("../../src/domain/norms/index.mjs").Norm>} norms
 * @param {number} [month]
 * @param {Record<string, number>} [indicators]
 */
const read = (norms, month = 6, indicators = {}) =>
  resolve({ norms, levers: LEVERS, month, indicators, revenue: OPENING_REVENUE });

/** Um programa de piso constitucional — a lei mais cara do catalogo. */
const GUARDED = PROGRAMS.find(program => program.guard === "constitution" && program.floor > 20);

/* ═══ A MIGRACAO NAO PERDEU NADA ═════════════════════════════════════════════ */

test("A ABERTURA REPRODUZ O CATALOGO, alavanca por alavanca", () => {
  /* A prova da migracao de 14/08/2026, e a mais barata de todas: se a pilha
     herdada nao devolve exatamente as faixas que o catalogo declara, o pais que o
     jogador recebe deixou de ser o pais que o catalogo descreve — e nenhuma outra
     prova desta suite acusaria isso, porque todas elas comparam normas com
     normas. */
  const { bands } = read(OPENING);

  for (const lever of [...PROGRAMS, ...RULES]) {
    const band = bands[lever.id];
    assert.ok(band, `${lever.id} nao tem faixa nenhuma na abertura`);
    assert.equal(band.ceiling, lever.ceiling, `o teto de abertura de ${lever.id} mudou`);

    /* ⚠ O PISO E COMPARADO COM TOLERANCIA, e o afrouxamento nao e desleixo — e a
       consequencia direta da VINCULACAO, e ele vale um paragrafo.

       Tres programas deixaram de obrigar por PONTOS e passaram a obrigar por FRACAO
       DA RECEITA, e uma fracao nunca converte em pontos redondos: 5,2224% da receita
       de abertura da 63,0004 pontos de media e alta complexidade, e nao 63. Exigir
       igualdade EXATA aqui seria exigir que a lei continuasse escrita em pontos —
       que e precisamente o que ela deixou de ser.

       ⚠ E A TOLERANCIA E APERTADA DE PROPOSITO: um centesimo de ponto. Ela absorve o
       arredondamento da fracao declarada no catalogo e NAO absorve erro de conta. Se
       alguem trocar a base da vinculacao — receita bruta por corrente liquida, por
       exemplo —, o piso da saude anda vários pontos e esta prova acusa na hora. */
    assert.ok(
      Math.abs(band.floor - lever.floor) < 0.01,
      `a faixa de abertura de ${lever.id} nao bate com o catalogo: ${band.floor} contra ${lever.floor}`,
    );
  }
});

test("O ESTADO DE ABERTURA CONCORDA COM O MOTOR", () => {
  /* A mesma prova, agora atravessando a montagem da partida e a camada de
     aplicacao. Elas sao duas porque o defeito e diferente: acima seria o motor
     lendo errado; aqui seria `createState` escrevendo a pilha errada, ou
     `bandsOf` montando as alavancas errado — e o sintoma disso e um pais que abre
     sem lei nenhuma, que e um pais valido e portanto indistinguivel de um defeito. */
  const state = createState();
  const bands = bandsOf(state);

  for (const program of PROGRAMS) {
    const band = bands[program.id];
    assert.ok(band, `${program.id} abriu sem faixa nenhuma`);
    assert.equal(band.ceiling, program.ceiling, `o teto de abertura de ${program.id} mudou`);
    /* Mesma tolerancia da prova acima, e pela mesma razao: fracao da receita nao
       converte em pontos redondos. Ver a nota la. */
    assert.ok(
      Math.abs(band.floor - program.floor) < 0.01,
      `${program.id} abriu com piso ${band.floor} e o catalogo diz ${program.floor}`,
    );
  }
});

/* ═══ A VINCULACAO ═══════════════════════════════════════════════════════════ */

test("O PISO VINCULADO ANDA COM A RECEITA — e o piso em pontos NAO", () => {
  /* ⚠ ESTA E A PROVA QUE DEFINE A VINCULACAO. Um piso em pontos e um numero: o pais
     cresce, a receita cresce, e a obrigacao com a saude continua exatamente onde
     estava. E o inverso do que o artigo 198 faz — ele prende uma FRACAO, e por isso a
     conta da saude cresce sozinha quando o pais arrecada mais e aperta sozinha quando
     ele arrecada menos.

     Sem esta prova, `bound` poderia ser convertido uma vez e guardado, e ninguem
     notaria: a abertura ficaria identica e o piso viraria um numero fixo com nome
     bonito. */
  const bound = PROGRAMS.filter(program => program.bound !== undefined);
  assert.ok(bound.length > 0, "o catalogo perdeu as vinculacoes");

  const magro = resolve({
    norms: OPENING,
    levers: LEVERS,
    month: 6,
    revenue: OPENING_REVENUE * 0.8,
  });
  const gordo = resolve({
    norms: OPENING,
    levers: LEVERS,
    month: 6,
    revenue: OPENING_REVENUE * 1.2,
  });

  for (const program of bound) {
    const pobre = magro.bands[program.id]?.floor ?? 0;
    const rico = gordo.bands[program.id]?.floor ?? 0;
    assert.ok(
      rico > pobre,
      `${program.id} e vinculado e o piso nao andou com a receita: ${pobre} -> ${rico}`,
    );
  }

  /* E O CONTRARIO PARA QUEM NAO E VINCULADO: o piso em pontos e surdo a receita, e
     tem de continuar sendo. Se ele andasse, TODO piso do catalogo teria virado
     vinculacao sem ninguem decidir isso. */
  for (const program of PROGRAMS) {
    if (program.bound !== undefined) continue;
    assert.equal(
      magro.bands[program.id]?.floor,
      gordo.bands[program.id]?.floor,
      `${program.id} nao e vinculado e mesmo assim o piso andou com a receita`,
    );
  }
});

test("VINCULACAO SEM RECEITA FICA DORMENTE, e NAO vira piso zero", () => {
  /* ⚠ A DISTINCAO FOI PAGA POR UM DEFEITO. A primeira versao devolvia piso ZERO
     quando nao dava para calcular a fracao — e piso zero significa NAO HA LEI SOBRE
     ISSO, quando o que aconteceu foi outra coisa inteiramente: nao havia como
     CALCULAR a lei. A vinculacao da saude sumia em silencio e o pais abria sem piso
     constitucional nenhum, sem nada acusar.

     Ausencia declarada, e nao ausencia disfarcada — a regra da tela, aplicada ao
     motor. */
  const bound = PROGRAMS.find(program => program.bound !== undefined);
  assert.ok(bound, "o catalogo perdeu as vinculacoes");

  const cego = resolve({ norms: OPENING, levers: LEVERS, month: 6 });

  assert.equal(cego.bands[bound.id]?.floor, 0, "sem receita o piso vinculado nao caiu");
  assert.ok(
    cego.dormant.some(item => item.norm.target.id === bound.id && item.reason === "unknown"),
    "a vinculacao sumiu sem se declarar dormente",
  );
});

/* ═══ A PRECEDENCIA ══════════════════════════════════════════════════════════ */

test("EMENDA SO SE DERRUBA COM EMENDA: hierarquia vence recencia", () => {
  /* A prova mais importante da suite. Se a recencia viesse primeiro, uma lei
     ordinaria aprovada em marco passaria por cima de uma clausula constitucional
     de janeiro — e os 308 votos deixariam de comprar qualquer coisa que durasse.
     O jogo inteiro se apoia em o preco alto comprar permanencia. */
  assert.ok(GUARDED, "o catalogo perdeu o programa de piso constitucional");

  const ordinary = {
    ...enact({ lever: { id: GUARDED.id, guard: "law" }, month: 20, floor: 0 }),
  };

  const { bands } = read([...OPENING, ordinary], 24);
  assert.equal(
    bands[GUARDED.id]?.floor,
    GUARDED.floor,
    "uma lei ordinaria de 2028 derrubou uma clausula constitucional",
  );
});

test("A MAIS NOVA VENCE dentro da mesma hierarquia", () => {
  assert.ok(GUARDED);
  const amendment = enact({ lever: GUARDED, month: 20, floor: 12 });

  const { bands } = read([...OPENING, amendment], 24);
  assert.equal(bands[GUARDED.id]?.floor, 12);
});

/** Uma norma de area, do tamanho que a prova pedir. */
const areaNorm = (
  /** @type {string} */ area,
  /** @type {string} */ guard,
  /** @type {string[]} */ repeals = [],
) =>
  /** @type {import("../../src/domain/norms/index.mjs").Norm} */ ({
    id: "piso-geral-da-area",
    kind: "band",
    target: { scope: "group", id: area },
    floor: 5,
    guard,
    enactedAt: 30,
    ...(repeals.length > 0 ? { repeals } : {}),
  });

test("LEI GERAL POSTERIOR NAO REVOGA LEI ESPECIAL ANTERIOR", () => {
  /* ⚠ ESTA PROVA NASCEU DE UMA EXPECTATIVA ERRADA, e o motor estava certo. A
     primeira versao dela afirmava que uma norma de area escrita depois alcancaria
     a area inteira, e o motor devolveu a alavanca com o piso herdado intacto.

     O motor tem razao, e a razao tem nome: a especificidade vem antes da
     recencia, e isso e o brocardo. Uma regra geral nova NAO apaga a regra especial
     velha — e e por isso que uma PEC de verdade traz a lista do que ela revoga.
     Sem esta ordem, uma unica norma de alcance `all` escrita no mes 40 apagaria a
     legislacao inteira do pais de uma vez, e reformar viraria um botao. */
  assert.ok(GUARDED);

  const { bands } = read([...OPENING, areaNorm(GUARDED.area, "constitution")], 32);
  assert.equal(
    bands[GUARDED.id]?.floor,
    GUARDED.floor,
    "a norma de area passou por cima da norma da propria alavanca",
  );
});

test("A NORMA DE AREA ALCANCA QUEM ELA PODE VENCER", () => {
  /* O outro lado: alcance de area nao e decorativo. Contra alavancas cuja norma
     herdada e mais fraca — contrato ou lei ordinaria —, a emenda de area passa por
     cima de todas de uma vez, sem citar nenhuma. */
  const area = PROGRAMS.find(program => program.guard !== "constitution")?.area;
  assert.ok(area, "o catalogo precisa de uma area com programa de guarda fraca");

  const { bands } = read([...OPENING, areaNorm(area, "constitution")], 32);

  for (const program of PROGRAMS.filter(item => item.area === area)) {
    const expected = program.guard === "constitution" ? program.floor : 5;
    assert.equal(
      bands[program.id]?.floor,
      expected,
      `${program.id} (guarda ${program.guard}) nao respondeu a emenda de area`,
    );
  }
});

test("PARA VALER SOBRE A ESPECIAL, A GERAL PRECISA REVOGAR", () => {
  /* E a consequencia util da prova acima: o caminho para uma regra geral alcancar
     o que a especial protege existe, e ele e o que uma PEC faz de verdade — nomear
     o que cai. O preco nao muda; o texto e que fica mais longo, e por isso mais
     visivel para quem vota. */
  assert.ok(GUARDED);

  const { bands } = read(
    [...OPENING, areaNorm(GUARDED.area, "constitution", [`heranca-${GUARDED.id}`])],
    32,
  );
  assert.equal(bands[GUARDED.id]?.floor, 5, "a geral nomeou a especial e mesmo assim perdeu");
});

test("O SALVO SALVA — e e o jabuti existindo como mecanica", () => {
  /* "Piso de 5 em toda a area, SALVO esta alavanca." A excecao nao e um desconto
     de preco: ela e o setor que se safa no fim da tramitacao, e o motor precisa
     executa-la sem saber o que e um setor. */
  assert.ok(GUARDED);
  const sibling = PROGRAMS.find(
    program => program.area === GUARDED.area && program.id !== GUARDED.id,
  );
  assert.ok(sibling);

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const wide = {
    id: "piso-geral-com-jabuti",
    kind: "band",
    target: { scope: "group", id: GUARDED.area, except: [sibling.id] },
    floor: 5,
    guard: "constitution",
    enactedAt: 30,
  };

  const { bands } = read([...OPENING, wide], 32);
  assert.equal(bands[sibling.id]?.floor, sibling.floor, "o salvo nao salvou ninguem");
});

test("A ORDEM E TOTAL: normas empatadas em tudo desempatam pela escrita", () => {
  /* Duas normas identicas em hierarquia, alcance e mes. Sem o ultimo criterio o
     resultado dependeria de ordenacao instavel, e o mesmo save abriria com pisos
     diferentes em execucoes diferentes. Ele nao e regra jogavel — e a garantia de
     que nunca ha empate. */
  assert.ok(GUARDED);
  const first = { ...enact({ lever: GUARDED, month: 10, floor: 40 }), id: "a" };
  const second = { ...enact({ lever: GUARDED, month: 10, floor: 41 }), id: "b" };

  assert.equal(read([...OPENING, first, second], 12).bands[GUARDED.id]?.floor, 41);
  assert.equal(read([...OPENING, second, first], 12).bands[GUARDED.id]?.floor, 40);
});

/* ═══ OS MODIFICADORES ═══════════════════════════════════════════════════════ */

test("O GATILHO LIGA E DESLIGA SOZINHO, sem ninguem votar de novo", () => {
  /* A clausula de calamidade sendo jogavel em vez de decorativa. A MESMA pilha e
     o MESMO mes com indicadores diferentes tem de dar paises diferentes — e e por
     isso que o gatilho e reavaliado a cada turno em vez de resolvido na
     aprovacao. */
  assert.ok(GUARDED);

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const emergency = {
    id: "clausula-de-calamidade",
    kind: "band",
    target: { scope: "lever", id: GUARDED.id },
    floor: 30,
    guard: "constitution",
    enactedAt: 10,
    trigger: { indicator: "debtRatio", op: "above", value: 0.8 },
  };

  const pile = [...OPENING, emergency];

  assert.equal(read(pile, 20, { debtRatio: 0.85 }).bands[GUARDED.id]?.floor, 30);
  assert.equal(read(pile, 20, { debtRatio: 0.75 }).bands[GUARDED.id]?.floor, GUARDED.floor);

  const off = read(pile, 20, { debtRatio: 0.75 }).dormant.find(
    item => item.norm.id === "clausula-de-calamidade",
  );
  assert.equal(off?.reason, "trigger", "a norma desligada precisa dizer POR QUE esta desligada");
});

test("INDICADOR QUE NINGUEM PASSOU NAO VIRA ZERO", () => {
  /* Lido como zero, um gatilho de "enquanto a divida passar de 80%" ficaria
     desligado para sempre e ninguem nunca saberia — a lei existiria no arquivo e
     nao existiria no pais. A norma dorme com o motivo dito, que e a mesma postura
     do validador de catalogo: recusar em vez de consertar. */
  assert.ok(GUARDED);

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const orphan = {
    id: "gatilho-orfao",
    kind: "band",
    target: { scope: "lever", id: GUARDED.id },
    floor: 30,
    guard: "law",
    enactedAt: 10,
    trigger: { indicator: "chuva", op: "above", value: 1 },
  };

  const { dormant } = read([...OPENING, orphan], 20, { debtRatio: 0.9 });
  assert.equal(dormant.find(item => item.norm.id === "gatilho-orfao")?.reason, "unknown");
});

test("A VIGENCIA EXPIRA, e a VACATIO adia", () => {
  /* Os dois lados do mesmo campo. O "temporario que fica" so e uma jogada porque
     o temporario de verdade sai — e o que sai tem de sair sozinho, no mes exato,
     sem ninguem revogar. */
  assert.ok(GUARDED);

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const temporary = {
    ...enact({ lever: GUARDED, month: 10, floor: 3 }),
    from: 12,
    months: 24,
  };

  const pile = [...OPENING, temporary];

  assert.equal(read(pile, 11).bands[GUARDED.id]?.floor, GUARDED.floor, "valeu antes da vacatio");
  assert.equal(read(pile, 12).bands[GUARDED.id]?.floor, 3, "nao valeu no primeiro mes de vigencia");
  assert.equal(read(pile, 35).bands[GUARDED.id]?.floor, 3, "saiu antes da hora");
  assert.equal(read(pile, 36).bands[GUARDED.id]?.floor, GUARDED.floor, "nao saiu na hora");

  assert.equal(
    read(pile, 11).dormant.find(item => item.norm.id === temporary.id)?.reason,
    "future",
  );
  assert.equal(
    read(pile, 36).dormant.find(item => item.norm.id === temporary.id)?.reason,
    "expired",
  );
});

/* ═══ A REVOGACAO — e por que ela justifica o motor ══════════════════════════ */

test("REVOGAR A NOVA FAZ A VELHA VOLTAR", () => {
  /* A frase que resume por que a lei deixou de ser um par de numeros. Com o campo
     sobrescrito, revogar a reforma de 2029 nao teria a que voltar: o piso de 2027
     tinha sido apagado no instante em que a reforma passou. Com a pilha, ele
     nunca saiu do arquivo. */
  assert.ok(GUARDED);

  const reform = { ...enact({ lever: GUARDED, month: 20, floor: 8 }), id: "reforma-de-2028" };

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const undo = {
    id: "revogacao-da-reforma",
    kind: "band",
    target: { scope: "lever", id: GUARDED.id },
    guard: "constitution",
    enactedAt: 40,
    repeals: ["reforma-de-2028"],
  };

  assert.equal(read([...OPENING, reform], 24).bands[GUARDED.id]?.floor, 8);
  assert.equal(
    read([...OPENING, reform, undo], 42).bands[GUARDED.id]?.floor,
    GUARDED.floor,
    "a norma herdada nao voltou quando a reforma foi revogada",
  );
});

test("AUSENCIA DE NORMA E AUSENCIA DE RESTRICAO", () => {
  /* Revogar a norma herdada nao devolve a faixa do catalogo — devolve a faixa
     inteira. Se o catalogo fosse o padrao, a lei que o jogador acabou de derrubar
     voltaria sozinha no mes seguinte, sem aviso e sem voto. */
  assert.ok(GUARDED);

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const undo = {
    id: "revogacao-da-heranca",
    kind: "band",
    target: { scope: "lever", id: GUARDED.id },
    guard: "constitution",
    enactedAt: 20,
    repeals: [`heranca-${GUARDED.id}`],
  };

  const { bands } = read([...OPENING, undo], 24);
  assert.deepEqual(bands[GUARDED.id], { floor: 0, ceiling: 100 });
});

test("NAO SE REVOGA O QUE AINDA NAO FOI ESCRITO", () => {
  /* A regra que mata o ciclo por construcao: "A revoga B e B revoga A" deixa de
     ser um estado possivel, e nao existe pilha que faca a resolucao nao terminar.
     Ela nao e cautela — e a verdade do mundo. */
  assert.ok(GUARDED);

  const reform = { ...enact({ lever: GUARDED, month: 30, floor: 8 }), id: "reforma-tardia" };

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const premature = {
    id: "revogacao-prematura",
    kind: "band",
    target: { scope: "lever", id: GUARDED.id },
    guard: "constitution",
    enactedAt: 10,
    repeals: ["reforma-tardia"],
  };

  const { bands } = read([...OPENING, premature, reform], 35);
  assert.equal(bands[GUARDED.id]?.floor, 8, "uma norma de 2027 revogou uma de 2029");
});

test("QUEM NAO ALCANCA NINGUEM NAO FAZ NADA — inclusive nao revoga", () => {
  /* Uma norma cujo alvo sumiu do catalogo — save antigo, catalogo remendado —
     derrubando outra que ainda existe deixaria o pais sem as duas, por causa de um
     id que envelheceu. O sintoma seria uma lei desaparecendo tres sessoes depois
     da causa. */
  assert.ok(GUARDED);
  const reform = { ...enact({ lever: GUARDED, month: 10, floor: 8 }), id: "reforma-viva" };

  /** @type {import("../../src/domain/norms/index.mjs").Norm} */
  const stale = {
    id: "norma-orfa",
    kind: "band",
    target: { scope: "lever", id: "programa-que-nao-existe" },
    floor: 90,
    guard: "constitution",
    enactedAt: 20,
    repeals: ["reforma-viva"],
  };

  const { bands, dormant } = read([...OPENING, reform, stale], 24);
  assert.equal(bands[GUARDED.id]?.floor, 8, "a norma orfa revogou uma norma viva");
  assert.equal(dormant.find(item => item.norm.id === "norma-orfa")?.reason, "unreachable");
});

/* ═══ AS PROPRIEDADES ════════════════════════════════════════════════════════ */

/* UMA PILHA ADVERSARIAL: normas em qualquer hierarquia, alcance, mes, gatilho,
   prazo e revogacao — inclusive revogando umas as outras em cadeia. E o material
   com que o `explorador` do simulador trabalha, e o que a auditoria externa
   apontou como risco numero um do ciclo: quanto mais expressiva a gramatica, mais
   combinacoes que ninguem previu. */
const anyNorm = fc.record({
  lever: fc.constantFrom(...LEVERS.map(lever => lever.id)),
  group: fc.constantFrom(...new Set(LEVERS.map(lever => lever.group))),
  scope: fc.constantFrom(/** @type {const} */ ("lever"), "group", "all"),
  guard: fc.constantFrom("none", "law", "constitution"),
  floor: fc.integer({ min: 0, max: 100 }),
  ceiling: fc.integer({ min: 0, max: 100 }),
  enactedAt: fc.integer({ min: 0, max: 47 }),
  months: fc.option(fc.integer({ min: 1, max: 60 }), { nil: undefined }),
  triggered: fc.boolean(),
  threshold: fc.double({ min: 0, max: 2, noNaN: true }),
  spare: fc.boolean(),
});

/**
 * @param {ReadonlyArray<{ lever: string, group: string | undefined, scope: "lever" | "group" | "all",
 *   guard: string, floor: number, ceiling: number, enactedAt: number, months: number | undefined,
 *   triggered: boolean, threshold: number, spare: boolean }>} written
 * @returns {import("../../src/domain/norms/index.mjs").Norm[]}
 */
function pileOf(written) {
  /** @type {import("../../src/domain/norms/index.mjs").Norm[]} */
  const pile = [...OPENING];

  written.forEach((item, index) => {
    /** @type {import("../../src/domain/norms/index.mjs").Norm} */
    const norm = {
      id: `sorteada-${index}`,
      kind: "band",
      target: {
        scope: item.scope,
        ...(item.scope === "lever" ? { id: item.lever } : {}),
        ...(item.scope === "group" ? { id: item.group ?? "" } : {}),
        ...(item.spare ? { except: [item.lever] } : {}),
      },
      floor: item.floor,
      ceiling: item.ceiling,
      guard: item.guard,
      enactedAt: item.enactedAt,
      /* CADA NORMA PODE REVOGAR A ANTERIOR, e a cadeia inteira e o pior caso: 60
         normas em fila, cada uma derrubando a de tras. */
      repeals: index > 0 ? [`sorteada-${index - 1}`] : [`heranca-${item.lever}`],
    };
    if (item.months !== undefined) norm.months = item.months;
    if (item.triggered) {
      norm.trigger = { indicator: "debtRatio", op: "above", value: item.threshold };
    }
    pile.push(norm);
  });

  return pile;
}

const anyPile = fc.array(anyNorm, { maxLength: 60 }).map(pileOf);

test("A RESOLUCAO E PURA: mesma pilha, mesmo mes, mesma lei", () => {
  fc.assert(
    fc.property(anyPile, fc.integer({ min: 0, max: 47 }), (norms, month) => {
      const first = read(norms, month, { debtRatio: 0.8 });
      const second = read(norms, month, { debtRatio: 0.8 });
      assert.deepEqual(first.bands, second.bands);
      assert.deepEqual(
        first.dormant.map(item => [item.norm.id, item.reason]),
        second.dormant.map(item => [item.norm.id, item.reason]),
      );
    }),
    { numRuns: 200 },
  );
});

test("TODA ALAVANCA TEM FAIXA, e ela cabe na escala", () => {
  /* Nao ha alavanca sem resposta, e nao ha resposta fora de 0 a 100. A ausencia
     de resposta seria pior que um valor errado: `bandOf` cairia no catalogo e a
     lei revogada voltaria a valer sem ninguem ter votado. */
  fc.assert(
    fc.property(anyPile, fc.integer({ min: 0, max: 47 }), (norms, month) => {
      const { bands } = read(norms, month, { debtRatio: 1.2 });
      for (const lever of LEVERS) {
        const band = bands[lever.id];
        assert.ok(band, `${lever.id} ficou sem faixa`);
        for (const side of [band.floor, band.ceiling]) {
          assert.ok(
            Number.isFinite(side) && side >= 0 && side <= 100,
            `${lever.id} saiu da escala`,
          );
        }
      }
    }),
    { numRuns: 200 },
  );
});

/* ═══ O RISCO 1 DO CICLO — o exploit da excecao empilhada ════════════════════ */

test("R1: NENHUMA PILHA DE NORMAS PRODUZ EMPENHO MAIOR QUE O CAIXA", () => {
  /* O risco numero um do ciclo 4, apontado pela auditoria externa de 14/08/2026:
     "o jogador nao pode conseguir criar dinheiro infinito empilhando uma excecao
     sobre um teto de gastos". Ele e inerente a gramatica — quanto mais expressiva
     ela for, mais combinacoes existem que ninguem previu.

     ⚠ O QUE O EXPLOIT NAO E: derrubar pisos AUMENTA o discricionario, e isso esta
     certo. Um governo que desvincula tudo passa a decidir sobre um orcamento
     maior — e paga por isso em votos, e depois em divida. O que nao pode acontecer
     e o EMPENHO DO MES passar do que o teto e o caixa abrem, porque ai o dinheiro
     nasceu da lei em vez de sair de algum lugar.

     A prova roda contra o estado real, com a pilha adversarial no lugar da
     herdada, e cobra a mesma desigualdade que `budget.allowance` declara. */
  const opening = createState();

  fc.assert(
    fc.property(anyPile, fc.double({ min: 0, max: 1, noNaN: true }), (norms, funding) => {
      const state = /** @type {import("../../src/state/state.mjs").GameState} */ ({
        ...opening,
        norms,
      });

      const orders = {
        funding: Object.fromEntries(Object.keys(state.loyalty).map(id => [id, funding])),
        levels: Object.fromEntries(PROGRAMS.map(program => [program.id, 100])),
      };

      const share = settlement(state, orders);
      const spent = share.paidCost + share.allocatedTotal;
      const room = discretionaryRoom(state);

      assert.ok(
        spent <= room + 1e-6,
        `a pilha abriu ${spent.toFixed(3)} de empenho contra ${room.toFixed(3)} de caixa`,
      );
    }),
    { numRuns: 200 },
  );
});

/* ═══ O ACOPLAMENTO — a norma nasce da votacao ═══════════════════════════════ */

test("APROVAR UMA FAIXA ESCREVE UMA NORMA, e so o lado que se moveu", () => {
  /* A tela manda a faixa inteira todo mes, porque o rascunho nasce copiado do
     vigente. Gravar os dois lados faria toda emenda sobre o piso da saude tambem
     RE-AFIRMAR o teto dela, com a mesma data e a mesma forca — e o efeito so
     apareceria meses depois, quando uma norma de area perdesse para uma clausula
     que ninguem escreveu. */
  assert.ok(GUARDED);
  const state = createState();
  const bands = bandsOf(state);

  const orders = {
    bands: { ...bands, [GUARDED.id]: { floor: 4, ceiling: GUARDED.ceiling } },
    funding: Object.fromEntries(Object.keys(state.loyalty).map(id => [id, 1])),
  };

  const { state: next, report } = playMonth(state, orders);

  if (!report.enacted) {
    assert.equal(next.norms.length, state.norms.length, "a pauta caiu e a lei mudou mesmo assim");
    return;
  }

  const written = next.norms.slice(state.norms.length);
  assert.equal(written.length, 1, "um movimento de faixa escreveu mais de um texto");
  assert.equal(written[0]?.target.id, GUARDED.id);
  assert.equal(written[0]?.floor, 4);
  assert.equal(written[0]?.ceiling, undefined, "o teto parado entrou na norma assim mesmo");
  assert.equal(written[0]?.guard, GUARDED.guard, "a norma nova mudou de hierarquia");
});

test("O MES PARADO NAO ESCREVE NADA", () => {
  /* A pilha so cresce quando alguem legisla. Um mandato de 48 meses sem reforma
     tem de terminar com o mesmo arquivo com que comecou — senao o save engorda
     para sempre e a resolucao fica mais cara a cada turno, que e o risco 8 do
     ciclo. */
  let state = createState();
  const before = state.norms.length;

  for (let month = 0; month < 12; month++) {
    state = playMonth(state, {}).state;
  }

  assert.equal(state.norms.length, before);
});
