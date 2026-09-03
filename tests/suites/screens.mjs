/* SUITE · AS TELAS — views puras, provadas sem navegador.
   POR QUE ELA EXISTE, e o motivo tem data.
   As views devolvem TEXTO, e texto que o navegador vai interpretar. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { CATALOG } from "../../src/data/catalog.mjs";
import { quorumOf } from "../../src/data/bills.mjs";
import {
  THRESHOLDS,
  baseCount,
  baseSplit,
  dispersion,
  whipCount,
} from "../../src/domain/congress/index.mjs";
import { alarm, left } from "../../src/application/mail.mjs";
import { describeMail, describeMonth, letterHtml, trayHtml } from "../../src/ui/screens/inbox.mjs";
import { vitalsHtml } from "../../src/ui/screens/dashboard.mjs";
import { addressed } from "../../src/ui/strings.mjs";
import {
  boilerOf,
  governmentOf,
  discretionaryRoom,
  ledger,
  lockedBy,
  outlook,
  playMonth,
  settlement,
  situationOf,
  termOf,
} from "../../src/application/turn.mjs";
import { OPENING_MONTH, createState, monthLabel } from "../../src/state/state.mjs";
import { MONTHS_PER_TERM } from "../../src/data/regime.mjs";
import { enact } from "../../src/domain/norms/index.mjs";
import { closingHtml } from "../../src/ui/screens/closing.mjs";
import { UI } from "../../src/ui/strings.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { areaHtml, decreeHtml } from "../../src/ui/screens/area.mjs";
import { financeHtml } from "../../src/ui/screens/finance.mjs";
import { money, num, percent, signed } from "../../src/ui/shared/format.mjs";
import { trendOf, windowLabel } from "../../src/ui/shared/trend.mjs";
import { capacityStripHtml, mesaHtml } from "../../src/ui/screens/mesa.mjs";
import { cabinetHtml, emailHtml } from "../../src/ui/screens/cabinet.mjs";

const { areas, bills, parties, fiscal } = CATALOG;

/** @param {number} level */
function everyone(level) {
  return Object.fromEntries(parties.map(party => [party.id, level]));
}

/**
 * A Mesa como o entrypoint a monta.
 *
 * @param {import("../../src/data/bills.mjs").Bill | null} bill
 * @param {Record<string, number>} funding
 */
function mesaOf(bill, funding = everyone(0.4)) {
  const state = createState(7);
  const voting = bill !== null && bill.instrument !== "decree";

  return mesaHtml({
    /* ⚠ O `spread` ENTRA COM ZERO PORQUE UMA PAUTA DE CATALOGO NAO TEM NUVEM: ela e um texto
       so, com uma posicao so, e o raio ideologico de um ponto e zero. */
    bill: bill === null ? null : { ...bill, spread: 0 },
    areaLabel: areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: bill ? quorumOf(bill) : 0,
    parties,
    loyalty: state.loyalty,
    funding,
    forecast: voting ? whipCount({ bill, parties, funding, loyalty: state.loyalty }) : null,
    /* O CASO SINTETICO USA OS QUATRO BLOCOS, e por isso a soma por bloco e direta: aqui nao
       ha elenco. */
    byBloc: Object.fromEntries(
      parties.map(party => [
        party.id,
        voting
          ? (whipCount({ bill, parties, funding, loyalty: state.loyalty }).parties.find(
              item => item.partyId === party.id,
            )?.votes ?? 0)
          : 0,
      ]),
    ),
    /* O CASO SINTETICO NAO TEM ELENCO — ele monta a Mesa com os blocos crus do catalogo,
       para provar a estrutura da tela. */
    blocs: parties.map(party => ({ id: party.id, people: [] })),
    band: dispersion({ parties, loyalty: state.loyalty }),
    seatPrice: fiscal.seatPrice,
    room: discretionaryRoom(state),
    demand: 15.75,
    thresholds: THRESHOLDS,
  });
}

/**
 * Uma area como o entrypoint a monta.
 *
 * @param {import("../../src/data/areas.mjs").Area} area
 * @param {number} spent bilhoes que esta area consome no mes
 * @param {Record<string, number>} [levels] niveis fora do vigente, quando a prova quiser
 */
function areaOf(area, spent, levels = {}) {
  const state = createState(7);
  const value = state.capacity.index[area.id] ?? area.initial;
  /* Ate estas duas linhas eram `value − decay + yield × spent` e `value − decay` — a copia da
     copia, e a prova reproduzia fielmente um defeito que fazia a seta apontar para o lado
     errado em cinco das oito areas. */
  const ahead = outlook(state, { levels: { ...state.levels, ...levels } });

  return areaHtml({
    area,
    value,
    history: state.capacity.history[area.id] ?? [],
    programs: PROGRAMS.filter(program => program.area === area.id),
    levels: { ...state.levels, ...levels },
    spent,
    room: discretionaryRoom(state),
    committed: 3.25,
    projected: ahead.index[area.id] ?? value,
    idle: ahead.idle[area.id] ?? value,
  });
}

/**
 * O painel de Financas como o entrypoint o monta.
 *
 * @param {number} months quantos meses correram antes de olhar o placar
 * @param {Partial<import("../../src/state/state.mjs").Series>} [series] serie forjada
 */
function financeOf(months, series = {}) {
  let state = createState(7);
  for (let i = 0; i < months; i++) state = playMonth(state).state;

  const { budget, interest, debt, debtRatio, premium } = ledger(state);

  return financeHtml({
    macro: state.macro,
    budget,
    interest,
    debt,
    debtRatio,
    premium,
    series: { ...state.series, ...series },
    target: CATALOG.macro.inflationTarget,
    ceiling: CATALOG.macro.inflationTarget + CATALOG.macro.inflationTolerance,
    areas,
    index: state.capacity.index,
    history: state.capacity.history,
  });
}

/* `min`, `max`, `step` e `value` sao os quatro atributos que o navegador lê como NUMERO. */
const NUMERIC_ATTRIBUTE = /\s(?:min|max|step|value)="([^"]*)"/g;

/* A COLUNA DE TENDENCIA do placar, com o conteudo — que pode ser vazio, e o vazio e
   informacao: serie curta demais nao vira desenho. */
const SPARK = /class="ledger__spark"[^>]*>(.*?)<\/span>/g;

/** @param {string} spark @returns {number} quantas alturas distintas a linha tem */
function heightsOf(spark) {
  const points = /points="(.*?)"/.exec(spark)?.[1] ?? "";
  if (points === "") return 0;
  return new Set(points.split(" ").map(pair => pair.split(",")[1])).size;
}

/** @param {string} html @param {string} where */
function assertNumericAttributes(html, where) {
  let found = 0;
  for (const hit of html.matchAll(NUMERIC_ATTRIBUTE)) {
    const raw = hit[1] ?? "";
    found++;
    assert.ok(
      raw.length > 0 && Number.isFinite(Number(raw)),
      `${where}: o atributo numerico recebeu "${raw}", que o navegador descarta em silencio`,
    );
  }
  return found;
}

test("TODO ATRIBUTO NUMERICO E LEGIVEL PELO NAVEGADOR, em qualquer posicao de jogo", () => {
  let checked = 0;

  /* A Mesa, com e sem pauta, e com verba em fracao quebrada — que e o caso que produz decimal
     no atributo. */
  for (const bill of [null, ...bills.slice(0, 8)]) {
    checked += assertNumericAttributes(mesaOf(bill, everyone(0.37)), `mesa ${bill?.id ?? "vazia"}`);
  }

  /* As seis areas, com alocacoes que nao sao redondas. */
  for (const area of areas) {
    for (const allocation of [0, 1.05, 7.3333, 24.99]) {
      checked += assertNumericAttributes(areaOf(area, allocation), `area ${area.id}`);
    }
  }

  checked += assertNumericAttributes(
    capacityStripHtml({
      areas,
      index: Object.fromEntries(areas.map(area => [area.id, 61.4])),
      history: {},
    }),
    "faixa de indices",
  );

  /* A prova so vale se ela tiver achado atributos para conferir: uma view que parasse de
     emitir controles passaria vazia, e passar vazia e a forma mais comum de uma suite morrer
     sem ninguem ver. */
  assert.ok(checked > 100, `so ${checked} atributos numericos conferidos — a suite ficou cega`);
});

test("o indice escrito em estilo inline tambem e numero, e nao texto localizado", () => {
  const html = capacityStripHtml({
    areas,
    index: Object.fromEntries(areas.map(area => [area.id, 48.6])),
    history: {},
  });

  const values = [...html.matchAll(/--index:\s*([^"';]+)/g)].map(hit => hit[1] ?? "");
  assert.equal(values.length, areas.length);
  for (const value of values) {
    assert.ok(
      Number.isFinite(Number(value)),
      `--index recebeu "${value}", e `.concat("`calc(1% * var(--index))` so aceita numero"),
    );
  }
});

test("o PLACAR so aparece quando existe votacao", () => {
  const decree = bills.find(bill => bill.instrument === "decree");
  const law = bills.find(bill => bill.instrument === "law");
  assert.ok(decree && law, "o catalogo perdeu um dos instrumentos");

  assert.ok(!mesaOf(null).includes("tally__forecast"), "a mesa vazia mostrou placar");
  assert.ok(!mesaOf(decree).includes("tally__forecast"), "a caneta mostrou placar");
  assert.ok(mesaOf(law).includes("tally__forecast"), "a lei nao mostrou placar");

  /* E o veredito so se veste de aprovado ou reprovado quando ha o que aprovar. */
  assert.ok(!mesaOf(null).includes("data-passes"), "a mesa vazia deu veredito de votacao");
});

test("O PLACAR NAO OFERECE NADA PARA MEXER, e essa e a informacao principal dele", () => {
  /* A unica tela do jogo sem um controle, e a ausencia precisa ser verdadeira no HTML e nao
     so na intencao: um `<input>` que entrasse aqui por reuso de componente daria ao jogador
     um controle que nao muda nada — pior do que nao ter, porque ele so descobre depois de
     arrastar. */
  for (const months of [0, 1, 7]) {
    const html = financeOf(months);
    assert.ok(!html.includes("<input"), `o placar do mes ${months} emitiu um controle`);
    assert.ok(!html.includes("<button"), `o placar do mes ${months} emitiu um botao`);
    assert.equal(assertNumericAttributes(html, `financas mes ${months}`), 0);
  }
});

test("NENHUM NUMERO DO PLACAR SAI QUEBRADO, em partida nova ou em andamento", () => {
  /* `NaN`, `undefined` e `Infinity` atravessam template literal sem lancar e chegam a tela
     como texto. */
  for (const months of [0, 1, 12]) {
    const html = financeOf(months);
    for (const rot of ["NaN", "undefined", "Infinity"]) {
      assert.ok(!html.includes(rot), `o placar do mes ${months} mostrou "${rot}"`);
    }
  }

  /* A partida recem-aberta tem serie VAZIA, e o painel nao pode desenhar escada nenhuma nela:
     um degrau solitario lê como sujeira de renderizacao, e seis iguais afirmam uma
     estabilidade que ninguem observou ainda. */
  const sparks = [...financeOf(0).matchAll(SPARK)].map(hit => hit[1] ?? "");
  assert.ok(sparks.length > 0, "o painel parou de emitir a coluna de tendencia");
  assert.ok(
    sparks.every(spark => spark === ""),
    "o painel desenhou tendencia sem passado",
  );
});

test("A ESCADA LE CADA INDICADOR NA REGUA DELE, e nao na do indice de area", () => {
  /* ⚠ ESTA PROVA PRENDE UM DEFEITO QUE JA ESTEVE NA TELA. */
  const html = financeOf(0, {
    inflation: [0.02, 0.035, 0.05, 0.07, 0.09, 0.12],
    rate: [0.09, 0.1, 0.11, 0.13, 0.16, 0.19],
    debtRatio: [0.7, 0.74, 0.78, 0.83, 0.89, 0.96],
  });

  const varied = [...html.matchAll(SPARK)]
    .map(hit => heightsOf(hit[1] ?? ""))
    .filter(alturas => alturas > 1);

  assert.equal(
    varied.length,
    3,
    `${varied.length} das tres series macro subiram na linha — o resto saiu plano na regua errada`,
  );
});

test("o rotulo do catalogo e ESCAPADO, e o catalogo e dado editavel", () => {
  /* Um `<` que atravesse a view nao e so um defeito de desenho: e injecao de marcacao a
     partir de um arquivo que qualquer sessao futura vai mexer. */
  const bill = bills[0];
  assert.ok(bill);

  const html = mesaOf({ ...bill, label: '<img src=x onerror="alert(1)">' });

  assert.ok(!html.includes("<img"), "o rotulo da pauta entrou como marcacao");
  assert.ok(html.includes("&lt;img"), "o rotulo nao foi escapado");
});

/**
 * O Gabinete montado a partir de um estado, com o que a prova quiser por cima.
 *
 * @param {import("../../src/state/state.mjs").GameState} state
 * @param {Record<string, unknown>} [extra]
 */
function cabinetInputOf(state, extra = {}) {
  const situation = situationOf(state, CATALOG);
  const share = settlement(state, {}, CATALOG);
  const { budget } = ledger(state, {}, CATALOG);

  return {
    base: situation.base,
    seats: CATALOG.parties.reduce((sum, party) => sum + party.seats, 0),
    majority: 257,
    /* ⚠ AQUI E A CAMARA DIVIDIDA DE VERDADE, e nao os blocos crus: o hemiciclo desenha 513
       cadeiras a partir desta lista, e uma prova que o alimentasse com um punhado de caixas
       nao exercitaria a soma que ele precisa fechar. */
    inbox: "",
    resolved: state.month > OPENING_MONTH,
    room: share.room,
    committed: share.demand,
    mandatory: budget.mandatory,
    revenue: budget.revenue,
    locked: lockedBy(state, CATALOG),
    segments: CATALOG.segments,
    street: {},
    /* A CALDEIRA FRIA e as tres rupturas fechadas: este caso mede o VAZIO do Gabinete, e um
       governo em vespera de queda nao e vazio. */
    boiler: {
      lobbies: [],
      rupture: { social: false, economic: false, political: false, open: false },
      ruptures: [
        { id: "social", value: 44, threshold: 20, breaks: "below", open: false },
        { id: "economic", value: 0, threshold: 50, breaks: "above", open: false },
        { id: "political", value: 0, threshold: 80, breaks: "above", open: false },
      ],
      impeachment: null,
      fallen: null,
    },
    ...extra,
  };
}

/** A MESMA MONTAGEM, nas duas telas que nasceram de uma. */
const cabinetOf = (/** @type {any} */ state, /** @type {any} */ extra = {}) =>
  cabinetHtml(cabinetInputOf(state, extra));
const emailOf = (/** @type {any} */ state, /** @type {any} */ extra = {}) =>
  emailHtml(cabinetInputOf(state, extra));

test("A BASE REPARTIDA SOMA A BASE INTEIRA, e nao o plenario", () => {
  /* A prova que impede as duas verdades. */
  let state = createState();

  for (let month = 0; month < 24; month++) {
    const split = baseSplit({ parties: CATALOG.parties, loyalty: state.loyalty });
    const total = split.loyal + split.obstructing + split.ruptured;

    assert.equal(
      Math.round(total),
      baseCount({ parties: CATALOG.parties, loyalty: state.loyalty }),
      `no mes ${month} as fatias somaram ${total.toFixed(2)} e a base e outra`,
    );
    state = playMonth(state, {}).state;
  }
});

/* E exatamente o defeito que o ⚠ E ELE TEM DE FECHAR COM O MOTOR, e nao com um numero
   digitado aqui: as cadeiras cheias sao a base efetiva que `baseCount` devolve.
   ELENCO ja produziu uma vez, quando os alcances nao normalizados fecharam a Camara
   em 730 assentos, e o mesmo que `chamberMismatch` pega no catalogo. */
test("A REGUA DA CAMARA MEDE A BASE CONTRA A MAIORIA, e as duas na mesma escala", () => {
  let state = createState();
  const total = CATALOG.parties.reduce((sum, party) => sum + party.seats, 0);

  for (let month = 0; month < 18; month++) {
    const html = cabinetOf(state);
    const base = baseCount({ parties: CATALOG.parties, loyalty: state.loyalty });

    /* ⚠ ANCORADA NO ROTULO, e nao na primeira ocorrencia: o bloco do risco desenha tres
       reguas ACIMA desta na mesma tela, e sem a ancora a prova media outra.
       ⚠ E ELA VOLTOU A LER UMA REGUA CHEIA no ciclo 15: o medidor composto saiu junto com o
       instrumento `meter`, por decisao dele — a Camara passou a dizer apoiam · maioria ·
       faltam. O que a prova cobra nao mudou uma virgula: o desenho nao inventa a base, e ele
       a compara com a maioria na MESMA escala. */
    const gauge = html.match(
      new RegExp(`--index:([0-9.-]+);--mark:([0-9.-]+)" aria-label="${UI.cabinet.baseLine}`),
    );
    assert.ok(gauge, `no mes ${month} a base saiu sem regua`);

    assert.ok(
      Math.abs(Number(gauge?.[1]) - (base / total) * 100) < 0.5,
      `no mes ${month} a regua encheu ate ${gauge?.[1]}% e a base do motor e ${base} de ${total}`,
    );
    assert.ok(
      Math.abs(Number(gauge?.[2]) - (257 / total) * 100) < 0.1,
      `a marca da maioria caiu em ${gauge?.[2]}% e a maioria e 257 de ${total}`,
    );

    /* ⚠ E O NUMERO ESCRITO E O MESMO QUE A REGUA DESENHA. */
    assert.ok(
      html.includes(`>${Math.round(base)}<small>${UI.inbox.of} ${total}</small>`),
      `no mes ${month} a leitura escrita nao diz ${Math.round(base)} de ${total}`,
    );

    state = playMonth(state, {}).state;
  }
});

const ASPA = String.fromCharCode(34);
const UNREAD = "data-unread=";

/** @param {string} html @returns {string[]} um pedaco por linha do indice, id na frente */
function rowsOf(html) {
  return html.split("data-dispatch=").slice(1);
}

/* ⚠ O TETO DE 7 LINHAS CAIU, e esta prova era a dele: ela cobrava que a pilha ESCONDESSE
   aviso para nao rolar. Com blocos de mes, esconder e mentir sobre o mes — "MAR" com 2 das 5
   cartas dele —, e quem absorve e a rolagem que `.tray__list` ja declara no portao. */
test("A BANDEJA NAO ESCONDE CARTA NENHUMA, e o indice rola em vez de cortar", () => {
  /** @param {number} n @param {number | null} due */
  const carta = (n, due) => ({
    id: `carta-${n}`,
    month: n,
    from: null,
    subject: `assunto ${n}`,
    body: "<p>corpo</p>",
    due,
  });

  const perguntas = [0, 1, 2].map(n => carta(n, 3));
  const avisos = [10, 11, 12, 13, 14, 15].map(n => carta(n, null));
  const html = trayHtml({ dispatches: [...perguntas, ...avisos], open: null });

  const linhas = rowsOf(html).length;
  assert.equal(linhas, 9, `a bandeja mostrou ${linhas} das 9 cartas`);

  /* ⚠ E O MAIS VELHO CONTINUA LA: era ele que a pilha descartava primeiro. */
  const ficaram = rowsOf(html).map(linha => linha.slice(1, linha.indexOf(ASPA, 1)));
  assert.ok(ficaram.includes("carta-0"), "a bandeja perdeu a carta mais velha");
  assert.ok(ficaram.includes("carta-15"), "a bandeja perdeu a carta mais nova");
});

/* ── O NAO LIDO, E CADA CARTA DIZENDO POR QUE CHEGOU ───────────────────────── As duas peças
   vieram do inbox do Football Manager, e a segunda e a que mais casa com a doutrina daqui:
   neste projeto todo numero mostrado tem motor atras, e a CARTA era a unica peca da tela que
   nao explicava a propria existencia. */
test("A BANDEJA MARCA O NAO LIDO, e a carta aberta deixa de ser um", () => {
  /** @param {number} n */
  const carta = n => ({
    id: `carta-${n}`,
    month: n,
    from: null,
    subject: `assunto ${n}`,
    body: "<p>corpo</p>",
    due: null,
  });

  /* ⚠ `carta-2` ESTA ABERTA E NAO ESTA EM `seen`, de proposito: e o caso que a captura pegou. */
  const html = trayHtml({
    dispatches: [carta(1), carta(2), carta(3)],
    open: "carta-2",
    seen: ["carta-1"],
  });

  const naoLidas = rowsOf(html)
    .filter(linha => linha.includes(UNREAD))
    .map(linha => linha.slice(1, linha.indexOf(ASPA, 1)));
  assert.deepEqual(naoLidas, ["carta-3"], "a marca de nao lido caiu na carta errada");
});

test("A BANDEJA VAZIA DIZ A VERDADE SOBRE O MANDATO, e ela tem duas frases", () => {
  const abertura = createState();
  assert.equal(abertura.month, OPENING_MONTH, "a partida nao abre no mes de abertura");

  const primeiro = emailOf(abertura);
  assert.ok(
    primeiro.includes(UI.inbox.firstLead),
    "no mes 1 a bandeja vazia parou de dizer que nenhum mes foi resolvido",
  );
  assert.ok(
    primeiro.includes(UI.cabinet.inboxSigned),
    "no mes 1 a bandeja vazia parou de dizer o que vai chegar nela",
  );

  /* O MESMO ESTADO, TRES MESES ADIANTE — que e exatamente o caso da captura. */
  let depois = abertura;
  for (let i = 0; i < 3; i += 1) depois = playMonth(depois, {}).state;

  const tarde = emailOf(depois);
  assert.ok(
    !tarde.includes(UI.inbox.firstLead),
    "com meses resolvidos, a bandeja vazia continuou dizendo que o primeiro nao foi",
  );
  assert.ok(
    tarde.includes(UI.inbox.quietLead),
    "com meses resolvidos, a bandeja vazia nao disse o que de fato acontece",
  );
  /* ⚠ E A PROMESSA NAO PODE SOBRAR. */
  assert.ok(
    !tarde.includes(UI.cabinet.inboxSigned),
    "a promessa de que o mes resolvido chega na bandeja sobreviveu a bandeja vazia",
  );
});

test("O ESTOURO DO COFRE TEM COR, e so quando a LEITURA e maior que zero", () => {
  /* O cartao dizia "cabe R$ 14,2 bi" e, uma linha abaixo, "ja consome R$ 14,5 bi" — no mesmo
     cinza das outras leituras. */
  const state = createState();

  /* ⚠ O MARCADOR MUDOU DE `data-over` PARA `data-tone="crisis"` quando a coluna virou uma
     gramatica so: quem tinge agora e a LINHA, e nao um campo dentro de um paragrafo. */
  const over = cabinetOf(state, { room: 10, committed: 10.3 });
  assert.ok(over.includes('data-tone="crisis"'), "o estouro nao acendeu");
  assert.ok(over.includes(UI.cabinet.vaultOver), "o estouro nao foi dito");
  /* ⚠ ELA PERGUNTA AO TERMO, E NAO AO LITERAL, — e a mudanca veio de esta prova quebrar por
     uma razao errada. */
  assert.ok(!over.includes(UI.cabinet.vaultTaken), "o estouro repetiu o total em vez do excesso");

  /* ⚠ E SO A LINHA DO ESTOURO ACENDE: a linha da obrigatoria vem ANTES dela e fica fora. */
  const lit = over.slice(over.indexOf('data-tone="crisis"'));
  assert.ok(!lit.includes(UI.cabinet.vaultLocked), "o vermelho do estouro engoliu o contexto");

  const tight = cabinetOf(state, { room: 10, committed: 10.01 });
  assert.ok(
    !tight.includes('data-tone="crisis"'),
    "um excesso que imprime R$ 0,0 bi acendeu o vermelho mesmo assim",
  );

  const room = cabinetOf(state, { room: 10, committed: 4 });
  assert.ok(!room.includes('data-tone="crisis"'));
  assert.ok(
    room.includes(UI.cabinet.vaultTaken),
    "sem estouro, o cartao parou de dizer o que foi gasto",
  );
});

/* ── O ZERO ARREDONDADO NAO CARREGA SINAL ────────────────────────────────────── ⚠ DEFEITO
   PEGO NA CAPTURA, e o painel o mostrava havia sessoes: o hiato do produto saia "-0,0%" com
   um valor de -0,0002. */
test("O ZERO ARREDONDADO E ZERO, e nao um zero com sinal de menos", () => {
  assert.equal(num(-0.0002, 1), "0,0", "uma magnitude que arredonda para zero manteve o sinal");
  assert.equal(num(-0, 1), "0,0");
  assert.equal(num(-0.04, 1), "0,0");
  assert.equal(percent(-0.0002, 1), "0,0%", "o hiato do produto ainda sai negativo");

  /* Sem esta metade, a correcao viraria a pior versao do defeito que ela conserta — uma tela
     que esconde o sinal de um numero que tem sinal. */
  assert.equal(num(-0.06, 1), "-0,1");
  assert.equal(num(-1.2, 1), "-1,2");
  assert.equal(signed(-0.0002, 1), "0,0", "o sinal explicito discordou do arredondamento");
  assert.equal(signed(-0.6, 0), "−1");
});

/* ── A VARIACAO DE INDICE DECLARA A JANELA QUE MEDIU ─────────────────────────── ⚠ TRES
   DEFEITOS NUMA LINHA SO, e todos os tres eram numero inventado na tela. */
test("A VARIACAO DE UM INDICE DIZ EM QUANTOS MESES, e cala onde nao ha passado", () => {
  /* Sem passado nao ha tendencia, e `null` e a resposta — nunca zero. */
  assert.equal(trendOf(70, []), null, "uma area sem historico inventou uma tendencia");
  assert.equal(trendOf(70, [70]), null, "um historico de um valor virou variacao de zero");

  /* A janela e o que o historico suporta, e nunca mais que doze. */
  assert.deepEqual(trendOf(64, [60, 61, 62, 64]), { delta: 4, months: 3 });

  const long = Array.from({ length: 25 }, (_, month) => 40 + month);
  const seen = trendOf(64, long);
  assert.equal(seen?.months, 12, "a janela passou de doze meses");
  assert.equal(seen?.delta, 64 - 52);

  assert.equal(windowLabel(1), "em 1 mês", "o singular saiu no plural");
  assert.equal(windowLabel(3), "em 3 meses");

  /* ── E AS DUAS TELAS LEEM A MESMA COISA ─────────────────────────────────── Era este o
     defeito de fundo: Financas e a tela de area mostravam variacoes DIFERENTES para a mesma
     area, porque cada uma refazia a conta do seu jeito. */
  const state = createState();
  const health = areas.find(area => area.id === "health");
  assert.ok(health);
  const history = [58, 59, 61, 62];

  const panel = financeHtml({
    macro: state.macro,
    budget: ledger(state).budget,
    series: state.series,
    interest: 0,
    debt: state.fiscal.debt,
    debtRatio: 0.78,
    /* Zero de proposito: a divida de 0,78 e exatamente a herdada, e o mercado nao cobra pelo
       pais que o presidente recebeu. */
    premium: 0,
    target: CATALOG.macro.inflationTarget,
    ceiling: CATALOG.macro.inflationTarget + CATALOG.macro.inflationTolerance,
    areas: [health],
    index: { health: 62 },
    history: { health: history },
  });

  const screen = areaHtml({
    area: health,
    value: 62,
    history,
    programs: [],
    levels: {},
    spent: 0,
    room: 10,
    committed: 0,
    projected: 62,
    idle: 61,
  });

  assert.ok(panel.includes("em 3 meses"), "o placar nao declarou a janela");
  assert.ok(screen.includes("em 3 meses"), "a tela de area nao declarou a janela");
  assert.ok(panel.includes("+4") && screen.includes("+4"), "as duas telas discordaram da variacao");

  /* E onde nao ha passado, nenhuma das duas afirma nada. */
  const mute = areaHtml({
    area: health,
    value: 62,
    history: [],
    programs: [],
    levels: {},
    spent: 0,
    room: 10,
    committed: 0,
    projected: 62,
    idle: 61,
  });
  assert.ok(!mute.includes("area__delta"), "a area sem historico desenhou uma variacao");
});

test("O ZERO DA AREA E NEUTRO: a cor da variacao le o numero que a tela imprime", () => {
  /* ⚠ ACHADO NA CAPTURA DO PASSEIO e ele e a MESMA familia que Financas ja tinha consertado —
     sobreviveu aqui porque as duas telas escreviam a regra cada uma por sua conta. */
  const health = areas.find(area => area.id === "health");
  assert.ok(health);

  /** @param {ReadonlyArray<number>} history @param {number} value */
  const deltaOf = (history, value) =>
    areaHtml({
      area: health,
      value,
      history,
      programs: [],
      levels: {},
      spent: 0,
      room: 10,
      committed: 0,
      projected: value,
      idle: value,
    });

  /* +0,4 sobre a janela: a leitura arredonda para "0", e o tom tem de acompanhar. */
  const quiet = deltaOf([61.6, 61.8, 62, 62], 62);
  assert.ok(quiet.includes(">0 "), "a variacao arredondada deixou de imprimir zero");
  assert.ok(
    quiet.includes('data-direction="flat"'),
    "um zero impresso saiu tingido: a cor negou o numero ao lado dela",
  );

  /* E o que a leitura de fato mostra continua tingido — a correcao nao pode apagar o sinal de
     quem tem sinal. */
  const moved = deltaOf([58, 59, 61, 62], 62);
  assert.ok(moved.includes('data-direction="up"'), "uma alta de 4 pontos saiu neutra");
});

/* ── O FECHO DO MANDATO ──────────────────────────────────────────────────────── POR QUE
   ESTAS PROVAS EXISTEM, e o defeito foi achado JOGANDO. */

test("O MANDATO ACABA PELAS DUAS PORTAS: a queda e o PRAZO", () => {
  const opening = createState(7);
  assert.equal(termOf(opening).over, false, "o mandato acabou no mes da posse");
  assert.equal(termOf(opening).ending, null, "um mandato que corre ja tinha um desfecho");

  const removed = { ...opening, month: 47, fallen: 46 };
  assert.equal(termOf(removed).over, true, "o presidente caiu e o mandato continuou");
  assert.equal(termOf(removed).ending, "removed");
  assert.equal(termOf(removed).months, 46, "o fecho datou o repaint, e nao o afastamento");

  /* O PRAZO, e ele e a metade que faltava. */
  const served = { ...opening, month: MONTHS_PER_TERM };
  assert.equal(termOf(served).over, true, "o mandato passou dos 48 meses e nao acabou");
  assert.equal(termOf(served).ending, "served");

  /* E O ULTIMO MES AINDA E MANDATO. */
  const last = { ...opening, month: MONTHS_PER_TERM - 1 };
  assert.equal(termOf(last).over, false, "o ultimo mes do mandato foi dado como acabado");
});

test("O FECHO NAO INVENTA UM NUMERO: tudo que ele mostra vem do estado ou da fonte", () => {
  const state = createState(7);
  const term = termOf(state);

  /* No mes da posse os dois lados da linha tem de ser o MESMO valor — se divergirem aqui, o
     fecho esta lendo de dois lugares. */
  for (const area of term.areas) {
    const source = CATALOG.areas.find(item => item.id === area.id);
    assert.ok(source);
    assert.equal(area.from, source.initial, `${area.id}: o fecho inventou o indice da posse`);
    assert.equal(area.to, area.from, "o mes da posse ja mostrava movimento");
  }

  /* A DIVIDA HERDADA E A DO CATALOGO, com fonte. */
  assert.equal(term.debt.from, CATALOG.fiscal.initialDebtRatio);

  /* ⚠ A APROVACAO DA POSSE E A QUE A SONDA LE DO CATALOGO, e nao um numero escrito a mao: um
     valor digitado seria a segunda verdade sobre com quanta popularidade o presidente entrou,
     e divergiria no dia em que um segmento mudasse. */
  assert.equal(term.approval.from, term.approval.to, "a aprovacao da posse nao e a da SONDA");
});

test("O FECHO SO CREDITA A LEI QUE O JOGADOR ESCREVEU", () => {
  const state = createState(7);
  /* ⚠ A PILHA DE ABERTURA NAO E VAZIA — a posse herda as vinculacoes do pais. */
  assert.ok(state.norms.length > 0, "a partida abriu sem lei nenhuma no pais");
  assert.equal(termOf(state).laws.length, 0, "o fecho creditou a lei herdada ao jogador");

  /* E a norma escrita DEPOIS da posse conta, com o mes em que passou e o nome da alavanca que
     ela move — o jogador escreveu sobre um nome, e nao sobre um id. */
  const health = CATALOG.programs[0];
  assert.ok(health);
  const written = {
    ...state,
    norms: [...state.norms, enact({ lever: health, month: 9, floor: 40 })],
  };
  const laws = termOf(written).laws;
  assert.equal(laws.length, 1);
  assert.equal(laws[0]?.month, 9);
  assert.equal(laws[0]?.label, health.label, "a lei saiu rotulada com um id, e nao com o nome");
});

test("AS DUAS SAIDAS LEEM A MESMA TELA, e o que muda e o carimbo e a data", () => {
  /* ⚠ ESTA PROVA GUARDA UMA DECISAO, e nao um comportamento. */
  const opening = createState(7);
  const removed = closingHtml(termOf({ ...opening, month: 47, fallen: 46 }));
  const served = closingHtml(termOf({ ...opening, month: MONTHS_PER_TERM }));

  assert.ok(removed.includes(UI.closing.removed), "o fecho da queda nao carimbou a queda");
  assert.ok(served.includes(UI.closing.served), "o fecho do prazo nao carimbou o prazo");
  assert.ok(!served.includes(UI.closing.removed), "quem cumpriu o mandato foi dado como afastado");

  /* A MESMA FORMA NOS DOIS: mesmas seccoes, mesmo numero de linhas de rubrica. */
  const rows = (/** @type {string} */ html) => html.split('class="closing__row"').length;
  assert.equal(rows(removed), rows(served), "as duas saidas desenharam tabelas diferentes");
  /* ⚠ A FRASE PASSA PELO TRATAMENTO, e por isso a prova compara o texto JA TRADUZIDO: o
     bruto carrega o marcador `{v}`, e compara-lo com o renderizado acusaria sempre. */
  assert.ok(
    served.includes(addressed(UI.closing.country)),
    "o fecho do prazo perdeu o pais que ele entrega",
  );
});

test("AUSENCIA DECLARADA NO FECHO: um mandato sem lei DIZ que nao teve lei", () => {
  /* Um espaco vazio no lugar da lista pareceria defeito — e o passivo, que e uma partida
     inteira valida, e exatamente quem cai nesse caso. */
  const empty = closingHtml(termOf({ ...createState(7), month: MONTHS_PER_TERM }));
  assert.ok(
    empty.includes(addressed(UI.closing.noLaws)),
    "o mandato sem lei nenhuma nao disse isso",
  );
  assert.ok(!empty.includes("closing__laws"), "a lista de leis nasceu vazia em vez de ausente");
});

/* ── O CERCO FALANDO ────────────────────────────────────────────────────────── POR QUE ESTAS
   PROVAS EXISTEM, e o achado foi MEDIDO e nao visto. */

test("O REMETENTE EXISTE: a carta da Casa Civil e assinada", () => {
  /* ⚠ ESTE DEFEITO ATRAVESSOU CINCO SESSOES SEM SER VISTO, e ele estava na PRIMEIRA carta do
     jogo. */
  const state = createState(7);
  const government = governmentOf(state, CATALOG);
  const chief = government.people.find(person => person.office === "chief");
  assert.ok(chief, "o elenco nao tem chefe da Casa Civil no cargo que a view procura");

  const posse = describeMail({
    mail: state.mail,
    people: government.people,
    left: () => null,
    inherited: { mandatory: 2166, room: 14.5 },
    answered: {},
    lobbies: CATALOG.lobbies,
  })
    .map(letterHtml)
    .join("");
  assert.ok(posse.includes(chief.name), "a carta de posse chegou sem quem a assinou");
});

test("O CERCO ESCREVE, e ele nao inventa nenhum dos dois numeros", () => {
  const state = createState(7);
  const government = governmentOf(state, CATALOG);
  const boiler = boilerOf(state, CATALOG);

  /** @param {import("../../src/state/state.mjs").Letter[]} mail */
  const render = mail =>
    describeMail({
      mail,
      people: government.people,
      left: () => null,
      inherited: { mandatory: 2166, room: 14.5 },
      answered: {},
      lobbies: CATALOG.lobbies,
      siege: boiler,
    })
      .map(letterHtml)
      .join("");

  const siege = render([alarm({ kind: "siege", id: "siege", subject: "siege", month: 40 })]);
  assert.ok(siege.includes(UI.inbox.siegeSubject), "o processo abriu e a carta nao dizia isso");

  /* 86 e `3×` e o preco do cerco: escritos a mao na view, mentiriam no dia em que qualquer um
     mudasse, e essa e a familia de defeito mais cara deste projeto. */
  assert.ok(siege.includes(String(boiler.removal)), "a carta nao citou o quorum do afastamento");
  assert.ok(siege.includes(String(boiler.seats)), "a carta nao citou o tamanho da Camara");
  assert.ok(siege.includes(`${boiler.price}×`), "a carta nao citou o preco da cadeira no cerco");

  /* E ELA APONTA PARA ONDE A JOGADA ACONTECE. */
  assert.ok(siege.includes('data-section="congress"'), "a carta do cerco nao leva ao Congresso");

  /* AS TRES RUPTURAS TEM CADA UMA A SUA FRASE, e nenhuma cai no texto de reserva. */
  for (const id of ["social", "economic", "political"]) {
    const html = render([alarm({ kind: "rupture", id, subject: id, month: 12 })]);
    assert.ok(html.includes(chiefName(government)), `a ruptura ${id} chegou sem remetente`);
    assert.ok(
      !html.includes(UI.inbox.ruptureFallback),
      `a ruptura ${id} caiu no texto de reserva: falta a frase dela`,
    );
  }
});

/** @param {ReturnType<typeof governmentOf>} government */
function chiefName(government) {
  return government.people.find(person => person.office === "chief")?.name ?? "";
}

test("O ALARME NAO VIRA MURAL: so a TRANSICAO escreve, e o cerco escreve uma vez", () => {
  /* Medido num mandato passivo inteiro: tres rupturas e um cerco, e nem uma a mais. */
  let state = createState(7);
  const written = new Map();
  for (let month = 0; month < 46; month++) {
    const before = new Set(state.mail.map(letter => letter.id));
    state = playMonth(state, { funding: {} }, { catalog: CATALOG }).state;
    for (const letter of state.mail) {
      if (before.has(letter.id)) continue;
      if (letter.kind !== "rupture" && letter.kind !== "siege") continue;
      written.set(letter.id, (written.get(letter.id) ?? 0) + 1);
    }
    if (state.fallen !== null) break;
  }

  assert.ok(written.size >= 2, "o mandato inteiro desmoronou e o cerco nao escreveu nada");
  for (const [id, times] of written) {
    assert.equal(times, 1, `${id} escreveu ${times} vezes: o alarme virou mural`);
  }
  assert.equal(written.get("siege:siege"), 1, "o processo abriu e ninguem avisou");
});

test("A LINHA DO CAIXA NAO DIZ O CONTRARIO DO MOTOR", () => {
  /* ⚠ ACHADO NA CAPTURA e ele e da familia mais cara deste projeto — a tela afirmando o
     oposto do que o turno faz. */
  /* `mesaOf` ja monta a Mesa como o entrypoint monta, com `demand` de 15,75 contra um espaco
     menor — ou seja, exatamente o caso em que a frase aparece. */
  const html = mesaOf(null);
  const room = discretionaryRoom(createState(7));

  assert.ok(html.includes(UI.mesa.over), "a linha nao acusou que a promessa nao cabe");
  assert.ok(
    html.includes(money(room)),
    "o numero ao lado do veredito deixou de ser o espaco que o motor da",
  );
  assert.ok(
    !UI.mesa.over.includes("cortar"),
    "o verbo voltou a ser CORTAR ao lado do numero que e o que CABE",
  );
});

test("NENHUM ROTULO DE INSTRUMENTO CAI NO ID CRU — e id cru aqui e INGLES", () => {
  /* ⚠ ACHADO NA CAPTURA . */
  const instruments = new Set(CATALOG.bills.map(bill => bill.instrument));
  /* `budget` nao mora em `bills.mjs`: ele e a execucao do orcamento, que nao vai a plenario e
     por isso nao e catalogo de pauta. */
  instruments.add("budget");

  for (const instrument of instruments) {
    assert.ok(
      Object.hasOwn(UI.instrument, instrument),
      `o instrumento "${instrument}" nao tem nome em portugues: a tela imprime o id`,
    );
    assert.ok(
      Object.hasOwn(UI.instrumentHint, instrument),
      `o instrumento "${instrument}" nao tem rito em portugues: a tela imprime o id`,
    );
  }
});

/* ⚠ AUSENCIA NAO E RESULTADO, E A BARRA A DESENHAVA COMO "NAO MOVEU". A regra sobreviveu a
   troca de desenho: onde antes uma seta afirmava "nao moveu" sobre um passado que nao existe,
   hoje uma linha reta afirmaria a mesma coisa. Serie curta demais nao desenha. */
test("O DESENHO SO EXISTE QUANDO HA HISTORIA: sem serie, a barra nao opina", () => {
  const agora = {
    macro: { gdp: 12500, inflation: 0.04 },
    approval: 40,
    base: 400,
    majority: 257,
    seatsTotal: 513,
    streetFloor: CATALOG.pressure.streetFloor,
    ceiling: CATALOG.macro.inflationTarget + CATALOG.macro.inflationTolerance,
    horizon: 48,
    approvalFrom: 0,
  };

  const mudo = vitalsHtml({ ...agora, series: { gdp: [], inflation: [], approval: [] } });
  assert.equal(
    (mudo.match(/<polyline/g) ?? []).length,
    0,
    "sem serie a barra desenhou LINHA, e reta e veredito sobre um passado que nao existe",
  );
  /* ⚠ MAS O PONTO EXISTE, e cinza: a leitura nasce na tela no primeiro mes, e a ausencia de
     direcao se declara pela cor em vez de sumir com o desenho inteiro. */
  assert.equal(
    (mudo.match(/data-sign="flat"/g) ?? []).length,
    3,
    "sem serie os tres pontos tem de existir e ficar cinzas",
  );
  /* A BASE DESENHA MESMO ASSIM, e a diferenca e de natureza: ela nao tem historia, tem
     LIMIAR — o medidor compara com a maioria, e a maioria existe desde o primeiro mes. */
  assert.match(
    mudo,
    /vit__meter/,
    "a base tem limiar e nao historia: o medidor nao depende de serie",
  );

  const falado = vitalsHtml({
    ...agora,
    series: {
      gdp: [12000, 12200, 12500],
      inflation: [0.05, 0.045, 0.04],
      approval: [44, 42, 40],
    },
  });
  assert.equal(
    (falado.match(/vit__spark/g) ?? []).length,
    3,
    "com serie as tres leituras de historia tem de desenhar",
  );
  /* A INFLACAO CAIU, E CAIR E BOM: o sinal dela se inverte, e o ponto final sobe. */
  assert.match(falado, /class="vit__end" data-sign="up"/);
  assert.match(falado, /class="vit__end" data-sign="down"/);
});

/* ⛔ OS DOIS LIMIARES DA BARRA ERAM COPIA, e as duas copias tinham envelhecido: a rua acendia
   em 20 quando o catalogo ja rompia em 16, e a inflacao acendia em 7,5% quando Financas ja
   acusava desde 4,5%. A prova compara com o CATALOGO e nao com um numero escrito aqui — um
   literal seria a terceira copia da mesma regua. */
test("O ALARME DA BARRA E O LIMIAR DO CATALOGO, e nao uma copia envelhecida", () => {
  const floor = CATALOG.pressure.streetFloor;
  const ceiling = CATALOG.macro.inflationTarget + CATALOG.macro.inflationTolerance;

  /** @param {number} approval @param {number} inflation @returns {number} */
  const acesos = (approval, inflation) => {
    const html = vitalsHtml({
      macro: { gdp: 12500, inflation },
      approval,
      /* A base fica larga de proposito: quem acende nesta prova sao as outras duas. */
      base: 400,
      majority: 257,
      seatsTotal: 513,
      streetFloor: floor,
      ceiling,
      horizon: 48,
      approvalFrom: 0,
      series: { gdp: [], inflation: [], approval: [] },
    });
    return (html.match(/vit--low/g) ?? []).length;
  };

  assert.equal(
    acesos(floor - 1, CATALOG.macro.inflationTarget),
    1,
    "abaixo do piso do catalogo a rua tem de acender",
  );
  assert.equal(
    acesos(floor + 3, CATALOG.macro.inflationTarget),
    0,
    "acima do piso a rua nao acende: tres pontos acima de 16 e onde a copia do 20 antigo acendia",
  );
  assert.equal(
    acesos(50, ceiling + 0.005),
    1,
    "passou da banda, a inflacao acende: meio ponto acima do teto e onde a copia do 7,5% ficava muda",
  );
  assert.equal(acesos(50, CATALOG.macro.inflationTarget), 0, "na meta a inflacao nao acende");
});

/* ── A LINHA DE ANEXO SUBSTITUIU AS QUATRO TABELAS ─────────────────────────── ⚠ AS DUAS
   PROVAS QUE MORAVAM AQUI COBRAVAM A TABELA: que as celulas impressas somassem o total
   impresso, e que a reparticao nao andasse mais de um ponto. As duas morreram com a peca que
   elas cobriam — `apportion` saiu junto, sem consumidor —, e o que elas garantiam continua
   cobrado abaixo: o numero da linha e a conta do motor, e a barra nunca mente sobre ele. */

/** @param {Record<string, number>} attach
 * @param {"street" | "seats" | "vault"} [kind]
 * @returns {string} */
function anexoHtml(attach, kind = "street") {
  const [dispatch] = describeMail({
    mail: [
      {
        id: `${kind}-3`,
        kind,
        month: 3,
        due: null,
        subject: null,
        bill: null,
        except: [],
        saved: null,
        was: 40,
        now: 44,
        attach,
        from: null,
        lever: null,
        level: null,
        answer: null,
        closedAt: null,
      },
    ],
    people: [],
    left: () => null,
    inherited: { mandatory: 0, room: 0 },
    answered: {},
    segments: [
      { id: "de", label: "Classe D/E" },
      { id: "c", label: "Classe C" },
      { id: "ab", label: "Classe A/B" },
    ],
    parties: [{ id: "pt", label: "Partido dos Trabalhadores" }],
  });
  assert.ok(dispatch, "a carta nao chegou a bandeja");
  return dispatch.annex ?? "";
}

test("A CAIXA NAO TEM MAIS TABELA NENHUMA, e a peca de dado e uma so", () => {
  /* ⚠ MEDIDO ANTES: 19 de 23 cartas abertas num mandato de 14 meses traziam tabela, com 306
     celulas por mes e CINCO formatos de anexo para quinze especies. */
  const rua = anexoHtml({ "c.prices": 15.4, "c.jobs": 11.6, betrayal: 4, wear: 2 });
  const caixa = anexoHtml({ revenue: 100, mandatory: 90, ceiling: 95, allowance: 5 }, "vault");
  const base = anexoHtml({ "pt.seats": 71, "pt.was": 60, "pt.now": 54 }, "seats");

  for (const caso of [
    { nome: "rua", html: rua },
    { nome: "caixa", html: caixa },
    { nome: "cadeiras", html: base },
  ]) {
    assert.ok(!caso.html.includes("<table"), `o anexo da ${caso.nome} voltou a ser tabela`);
    assert.ok(caso.html.includes("annex__line"), `o anexo da ${caso.nome} nao usa a linha`);
  }
});

test("O NUMERO DA LINHA E A CONTA DO MOTOR, e a barra nunca passa de 100", () => {
  /* ⚠ ELA SUBSTITUI A PROVA DA SOMA DAS CELULAS: nao ha mais celula para fechar, e o que
     precisa fechar e o numero impresso contra a soma que o motor mandou. */
  fc.assert(
    fc.property(
      fc.array(fc.double({ min: -14, max: 26, noNaN: true, noDefaultInfinity: true }), {
        minLength: 5,
        maxLength: 5,
      }),
      valores => {
        const notes = ["prices", "jobs", "services", "safety", "economy"];
        /** @type {Record<string, number>} */
        const attach = {};
        notes.forEach((note, i) => (attach[`c.${note}`] = valores[i] ?? 0));

        const html = anexoHtml(attach);
        const soma = Math.round(valores.reduce((total, v) => total + v, 0));

        /* A LINHA DA Classe C: o valor impresso e a soma cheia arredondada, e nao cinco
           arredondamentos independentes. */
        const linha = [...html.matchAll(/Classe C<\/span>(.*?)<\/b>/g)][0]?.[1] ?? "";
        assert.ok(
          linha.includes(`>${String(soma)}<`),
          `a linha imprimiu ${linha.replace(/<[^>]*>/g, " ").trim()} e a soma e ${soma}`,
        );

        /* ⚠ A BARRA NUNCA MENTE: um humor negativo ou acima de cem sairia como uma pista
           estourada, e `--index` fora de 0..100 pinta fora da caixa. */
        for (const hit of html.matchAll(/--index:(-?[\d.]+)/g)) {
          const index = Number(hit[1]);
          assert.ok(index >= 0 && index <= 100, `a barra saiu com --index:${index}`);
        }
      },
    ),
  );
});

test("A CARTA DAS CADEIRAS CORTA A LISTA E DIZ QUE CORTOU", () => {
  /* ⚠ ONZE LINHAS NUM OFICIO E O DIARIO OFICIAL DENTRO DE UMA CARTA — quem lista bancada por
     bancada e a tela do Congresso, e o Gabinete ja recusa a mesma lista com essas palavras. */
  const parties = Array.from({ length: 9 }, (_, i) => ({ id: `p${i}`, label: `Bancada ${i}` }));
  /** @type {Record<string, number>} */
  const attach = {};
  parties.forEach((party, i) => {
    attach[`${party.id}.seats`] = 70 - i * 5;
    attach[`${party.id}.was`] = 60;
    attach[`${party.id}.now`] = 60 - (9 - i);
  });

  const [dispatch] = describeMail({
    mail: [
      {
        id: "seats-9",
        kind: "seats",
        month: 9,
        due: null,
        subject: null,
        bill: null,
        except: [],
        saved: null,
        was: 260,
        now: 249,
        attach,
        from: null,
        lever: null,
        level: null,
        answer: null,
        closedAt: null,
      },
    ],
    people: [],
    left: () => null,
    inherited: { mandatory: 0, room: 0 },
    answered: {},
    chamber: { base: 249, majority: 257, seats: 513 },
    parties,
  });

  const html = dispatch?.annex ?? "";
  const linhas = [...html.matchAll(/annex__line/g)].length;
  assert.equal(linhas, 5, `nove bancadas se moveram e a carta imprimiu ${linhas} linhas`);
  assert.ok(
    html.includes(UI.inbox.annexSeatsRest),
    "a carta cortou a lista e nao disse que cortou",
  );
  assert.ok(
    html.includes(`${UI.inbox.annexSeatsRest} 5`),
    "a linha do resto nao diz quantas bancadas ficaram de fora",
  );
});

/**
 * A SEQUENCIA DO INDICE — cabecalho de mes e linha, na ordem em que saem.
 *
 * @param {string} html
 * @returns {{ month: string | null, row: string | null }[]}
 */
function sequenceOf(html) {
  return [...html.matchAll(/<li class="tray__month">([^<]*)<|data-dispatch="([^"]*)"/g)].map(
    hit => ({ month: hit[1] ?? null, row: hit[2] ?? null }),
  );
}

test("TODA CARTA MORA NO BLOCO DO MES DELA, e o calendario so anda para tras", () => {
  /** @param {string} id @param {number} month @param {number | null} due */
  const carta = (id, month, due) => ({
    id,
    month,
    from: null,
    subject: id,
    body: "<p>corpo</p>",
    due,
  });

  /* A ENTRADA CHEGA FORA DE ORDEM, como o entrypoint a monta. */
  const html = trayHtml({
    dispatches: [
      carta("aviso-abr", 3, null),
      carta("aviso-mar", 2, null),
      carta("fechamento-abr", 3, null),
      carta("pergunta-mai", 4, 2),
      carta("pergunta-abr", 3, 0),
    ],
    open: null,
  });

  const sequencia = sequenceOf(html);
  const secoes = sequencia.filter(item => item.month !== null).map(item => item.month);

  /* ⚠ NENHUMA SECAO QUE NAO SEJA MES, e nenhum mes duas vezes. */
  assert.deepEqual(
    secoes,
    [monthLabel(4), monthLabel(3), monthLabel(2)],
    `o indice leu ${secoes.join(" → ")}`,
  );

  /* ⚠ E A PERGUNTA MORA NO MES DELA, que e a metade que a secao propria quebrava. */
  /** @param {string} id */
  const blocoDe = id => {
    let atual = "";
    for (const item of sequencia) {
      if (item.month !== null) atual = item.month;
      if (item.row === id) return atual;
    }
    return "";
  };
  assert.equal(blocoDe("pergunta-mai"), monthLabel(4), "a pergunta de maio caiu noutro bloco");
  assert.equal(blocoDe("pergunta-abr"), monthLabel(3), "a pergunta de abril caiu noutro bloco");
  assert.equal(blocoDe("aviso-mar"), monthLabel(2), "o aviso de marco caiu noutro bloco");
});

/* ⚠ QUEM DECIDE A ORDEM DENTRO DO MES E O MOTOR, e nao a tela: `turn.mjs` monta a caixa em
   alarme → pergunta → exigencia → aviso → relatorio, com a regra escrita la — "o que exige
   leitura antes da proxima decisao fica no alto". Reordenar aqui refaria essa decisao. */
test("DENTRO DO MES A ORDEM DO MOTOR SOBREVIVE, e a mais nova fica em cima", () => {
  /** @param {string} id @param {number} month */
  const carta = (id, month) => ({
    id,
    month,
    from: null,
    subject: id,
    body: "<p>corpo</p>",
    due: null,
  });

  const html = trayHtml({
    dispatches: [
      carta("nov-alarme", 10),
      carta("nov-aviso", 10),
      carta("nov-relatorio", 10),
      carta("out-aviso", 9),
    ],
    open: null,
  });

  const ids = rowsOf(html).map(linha => linha.slice(1, linha.indexOf(ASPA, 1)));
  assert.deepEqual(
    ids,
    ["nov-alarme", "nov-aviso", "nov-relatorio", "out-aviso"],
    `o indice embaralhou o mes: ${ids.join(" → ")}`,
  );
});

/* ⚠ O DOCUMENTO SO ABRE O QUE O INDICE MOSTRA: documento a direita e nenhuma linha marcada a
   esquerda foi o defeito medido no 1½.1. */
test("A BANDEJA ABRE A PRIMEIRA DO MES MAIS NOVO, e o aberto sempre tem linha", () => {
  /** @param {string} id @param {number} month @param {number | null} due */
  const carta = (id, month, due) => ({
    id,
    month,
    from: null,
    subject: id,
    body: "<p>corpo</p>",
    due,
  });

  const cartas = [carta("pergunta-velha", 2, 0), carta("aviso-novo", 5, null)];

  /* SEM PREFERENCIA: abre a de cima, e a de cima e a do mes mais novo — e nao a mais urgente,
     que e o criterio que caiu junto com a secao propria. */
  assert.match(
    trayHtml({ dispatches: cartas, open: null }),
    /data-dispatch="aviso-novo"[^>]*aria-current="true"/,
    "a bandeja nao abriu a primeira do mes mais novo",
  );

  /* COM PREFERENCIA: ela e sempre atendida, porque nada mais e escondido. */
  assert.match(
    trayHtml({ dispatches: cartas, open: "pergunta-velha" }),
    /data-dispatch="pergunta-velha"[^>]*aria-current="true"/,
    "o documento aberto ficou sem linha marcada no indice",
  );
});

/* ⚠ O FECHAMENTO DO MES ERA MONTADO NA TELA a partir de `last`, variavel de modulo: o resumo do
   mes anterior sumia da caixa a cada avanco, e sumia inteiro no F5. Palavras dele: "num email
   ele ficaria la". Ele virou registro guardado, e esta prova cobra a leitura desse registro. */
test("O FECHAMENTO DO MES SE LE DO REGISTRO GUARDADO, e nao do relatorio vivo", () => {
  /** @param {number} month @param {number | null} votes */
  const fechado = (month, votes) => ({
    month,
    bill: null,
    judged: /** @type {{ kind: string, label: string } | null} */ (null),
    votes,
    quorum: 257,
    promisedCost: 0,
    paidCost: 0,
    balance: {
      streetWas: 30,
      streetNow: 28,
      seatsWas: 300,
      seatsNow: 290,
      roomWas: 10,
      roomNow: 9,
    },
  });

  /* SEM PAUTA E SEM VOTACAO: o assunto e o do mes que nao decidiu nada, e o placar cala. */
  const quieto = describeMonth({ report: fechado(3, null), adviser: null });
  assert.equal(quieto.id, "month-3", `o id do fechamento saiu como ${quieto.id}`);
  assert.equal(quieto.subject, UI.report.noBill, `o assunto saiu como "${quieto.subject}"`);
  assert.ok(!quieto.body.includes(UI.inbox.voted), "o mes sem votacao imprimiu placar");

  /* COM VOTACAO: o placar sai do registro, e o quorum ao lado dele. */
  const votado = describeMonth({ report: fechado(4, 312), adviser: null });
  assert.ok(votado.body.includes("312"), "o placar guardado nao chegou a carta");
  assert.ok(votado.body.includes("257"), "o quorum guardado nao chegou a carta");

  /* ⚠ E DOIS MESES SAO DUAS CARTAS, com ids diferentes: era isso que nao existia. */
  assert.notEqual(quieto.id, votado.id, "dois meses fechados devolveram o mesmo id");
});

/* ── O PASSO 5 DO CICLO 14 ──────────────────────────────────────────────────── ⚠ AS QUATRO
   PROVAS ABAIXO MORDEM: cada uma falha na versao anterior do arquivo que ela cobre. */

/** @param {Record<string, number>} attach @returns {string} */
function pesquisaHtml(attach) {
  return describeMail({
    mail: [
      {
        id: "pesquisa-9",
        kind: "street",
        month: 9,
        due: null,
        subject: null,
        bill: null,
        except: [],
        saved: null,
        was: 40,
        now: 44,
        attach,
        from: null,
        lever: null,
        level: null,
        answer: null,
        closedAt: null,
      },
    ],
    people: [],
    left: () => null,
    inherited: { mandatory: 0, room: 0 },
    answered: {},
    segments: [{ id: "c", label: "Classe C" }],
  })
    .map(letterHtml)
    .join("");
}

test("O ANEXO DA RUA NAO JOGA FORA OS DOIS DESCONTOS", () => {
  /* ⚠ ELES CHEGAVAM EM `attach` E MORRIAM NA VIEW: `broken` vale 12 pontos e o desgaste chega
     a 12 no fim do mandato, e a coluna da soma imprimia o humor da classe sem nenhum dos
     dois. */
  const com = pesquisaHtml({ "c.prices": 30, "c.jobs": 20, betrayal: 4.2, wear: 3 });
  assert.ok(com.includes(UI.inbox.annexDiscount.betrayal), "a credibilidade nao chegou ao pe");
  assert.ok(com.includes(UI.inbox.annexDiscount.wear), "o desgaste nao chegou ao pe");
  assert.ok(com.includes(signed(-4.2)), "o bloco nao imprimiu o desconto da credibilidade");
  assert.ok(com.includes(UI.inbox.annexDiscounts), "os descontos sairam sem bloco proprio");

  /* ⚠ E UM BLOCO DE ZEROS E RUIDO: o mes 1 nao tem promessa quebrada nem desgaste. */
  const sem = pesquisaHtml({ "c.prices": 30, "c.jobs": 20, betrayal: 0, wear: 0 });
  assert.ok(!sem.includes(UI.inbox.annexDiscounts), "a carta abriu um bloco para dois zeros");
});

test("A CARTA DAS CADEIRAS CONTA CADEIRA, e o tamanho da Camara vem do motor", () => {
  /* ⚠ ELA DIZIA "11 pontos" ONDE SAO 11 CADEIRAS — o corpo reusava o rotulo da PESQUISA —, e
     o 513 estava teclado nas frases, com o motor tendo o numero ao lado. */
  const html = describeMail({
    mail: [
      {
        id: "seats-9",
        kind: "seats",
        month: 9,
        due: null,
        subject: null,
        bill: null,
        except: [],
        saved: null,
        was: 260,
        now: 249,
        from: null,
        lever: null,
        level: null,
        answer: null,
        closedAt: null,
      },
    ],
    people: [],
    left: () => null,
    inherited: { mandatory: 0, room: 0 },
    answered: {},
    /* UM TAMANHO QUE NAO E O DO CATALOGO: se a frase estivesse teclada, ela imprimiria 513. */
    chamber: { base: 249, majority: 257, seats: 999 },
  })
    .map(letterHtml)
    .join("");

  assert.ok(html.includes(`>11</b> ${UI.inbox.seats}`), "as 11 cadeiras sairam em pontos");
  assert.ok(!html.includes(UI.inbox.pollPoints), "a carta das cadeiras ainda fala em pontos");
  assert.ok(html.includes(">999<"), "o tamanho da Camara nao veio do motor");
  assert.ok(!html.includes("513"), "o 513 continua teclado na frase");
});

test("A CARTA DA MINORIA LE O DENOMINADOR DO MOTOR", () => {
  const html = describeMail({
    mail: [alarm({ kind: "minority", id: "minority", subject: "minority", month: 14, now: 227 })],
    people: [],
    left: () => null,
    inherited: { mandatory: 0, room: 0 },
    answered: {},
    chamber: { base: 227, majority: 257, seats: 999 },
  })
    .map(letterHtml)
    .join("");

  assert.ok(html.includes(">999<") || html.includes("999"), "o denominador nao veio do motor");
  assert.ok(!html.includes("513"), "o 513 continua teclado na carta da minoria");
});

test("O ALARME DE FERVURA NAO GRAVA UM REMETENTE QUE NINGUEM LE", () => {
  /* ⚠ ELE GRAVAVA O ID DO GRUPO EM `from`, e a view sempre o sobrescreveu com a Casa Civil —
     o grupo ja viaja em `subject`, e e de la que o nome sai. */
  let state = createState(7);
  const vistos = [];
  for (let month = 0; month < 24; month++) {
    state = playMonth(state, { funding: {} }, { catalog: CATALOG }).state;
    for (const letter of state.mail) if (letter.kind === "boiling") vistos.push(letter);
    if (state.fallen !== null) break;
  }

  assert.ok(vistos.length > 0, "nenhum grupo ferveu em 24 meses: a prova nao mediu nada");
  for (const letter of vistos) {
    assert.equal(letter.from, null, `o alarme de ${letter.subject} gravou um remetente morto`);
    assert.ok(letter.subject, "o alarme perdeu o grupo junto com o remetente");
  }
});

test("O PRAZO SO TEM DUAS FAIXAS, e a medicao e que decide isso", () => {
  /* ⚠ A TERCEIRA FAIXA E O PLURAL DE "meses" ERAM INALCANCAVEIS: `ANSWER_TIME` e 2 e a carta
     so aparece no mes seguinte ao que a escreveu, entao `left` devolve 0 ou 1 e mais nada. */
  let state = createState(7);
  const valores = new Set();
  for (let month = 0; month < MONTHS_PER_TERM; month++) {
    state = playMonth(state, { funding: {} }, { catalog: CATALOG }).state;
    for (const letter of state.mail) {
      const falta = left(letter, state.month);
      if (falta !== null) valores.add(falta);
    }
    if (state.fallen !== null) break;
  }

  assert.ok(valores.size > 0, "nenhuma pergunta abriu no mandato: a prova nao mediu nada");
  for (const valor of valores) {
    assert.ok(valor === 0 || valor === 1, `left devolveu ${valor}: a terceira faixa voltou`);
  }
});

test("A CARTA DO PLENARIO LE O PLACAR DO CARTAO DO MESMO MES", () => {
  /* ⚠ O NUMERO JA ESTAVA NO SAVE e a carta ao lado chegava vazia: "derrubou por 3" e
     "derrubou por 90" pedem jogadas opostas, e as duas liam igual. */
  /** @param {number} month */
  const carta = month => ({
    id: `rejected:lei:${month}`,
    kind: /** @type {"rejected"} */ ("rejected"),
    month,
    due: null,
    subject: "Reforma do teto",
    bill: "lei",
    except: [],
    saved: null,
    from: null,
    lever: null,
    level: null,
    was: null,
    now: null,
    answer: null,
    closedAt: month,
  });

  /** @param {number} month @param {number | null} votes */
  const mes = (month, votes) => ({
    month,
    bill: "Reforma do teto",
    judged: null,
    votes,
    quorum: 257,
    promisedCost: 0,
    paidCost: 0,
    balance: { streetWas: 0, streetNow: 0, seatsWas: 0, seatsNow: 0, roomWas: 0, roomNow: 0 },
  });

  /** @param {ReadonlyArray<import("../../src/state/state.mjs").MonthCard>} months */
  const render = months =>
    describeMail({
      mail: [carta(9)],
      people: [],
      left: () => null,
      inherited: { mandatory: 0, room: 0 },
      answered: {},
      months,
    })
      .map(letterHtml)
      .join("");

  const perto = render([mes(9, 254)]);
  assert.ok(perto.includes(UI.inbox.blockPlenary), "a carta do plenario nao trouxe o placar");
  assert.ok(perto.includes(">254<"), "o placar guardado nao chegou a carta");
  assert.ok(perto.includes(UI.inbox.blockMissed), "faltando tres votos, a carta nao disse isso");
  assert.ok(perto.includes(">3<"), "a distancia para o quorum nao foi impressa");

  /* ⚠ O MES ERRADO NAO SERVE: a carta do mes 9 nao pode mostrar o placar do mes 8. */
  assert.ok(!render([mes(8, 254)]).includes(UI.inbox.blockPlenary), "a carta leu outro mes");

  /* AUSENTE E DECLARADO: sem votacao, e sem cartao, nao ha bloco. */
  assert.ok(!render([mes(9, null)]).includes(UI.inbox.blockPlenary), "mes sem votacao deu placar");
  assert.ok(!render([]).includes(UI.inbox.blockPlenary), "sem cartao a carta inventou um placar");
});

test("O DECRETO E UM BOTAO COM ESTADO, e a area diz se ela esta poupada", () => {
  const area = CATALOG.areas[0];
  assert.ok(area);

  const solta = decreeHtml({ area, protectedNow: false, ratio: 0.4 });
  const poupada = decreeHtml({ area, protectedNow: true, ratio: 0.4 });

  /* ⚠ O GESTO E `data-protect`, e nao `data-section`: os dois moram na mesma tela, e um
     seletor emprestado faria clicar em "proteger" trocar de tela. */
  assert.ok(solta.includes(`data-protect="${area.id}"`));
  assert.ok(solta.includes('aria-pressed="false"'));
  assert.ok(poupada.includes('aria-pressed="true"'));

  /* O PRECO TROCA DE LADO, e nenhum dos dois estados fica mudo. */
  assert.ok(solta.includes("40%"));
  assert.ok(poupada.includes(UI.area.decreeCost));
  assert.ok(!poupada.includes("40%"));
});

test("SEM CORTE O DECRETO NAO INVENTA UM, e diz que o mes honra tudo", () => {
  const area = CATALOG.areas[0];
  assert.ok(area);

  const html = decreeHtml({ area, protectedNow: false, ratio: 1 });
  assert.ok(html.includes(UI.area.decreeWhole));
  assert.ok(!html.includes("100%"));
});
