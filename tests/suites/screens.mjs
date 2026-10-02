/* SUITE · AS TELAS — views puras, provadas sem navegador.
   POR QUE ELA EXISTE, e o motivo tem data.
   As views devolvem TEXTO, e texto que o navegador vai interpretar. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { CATALOG } from "../../src/data/catalog.mjs";
import { quorumOf } from "../../src/data/bills.mjs";
import { SIMPLE_MAJORITY } from "../../src/data/regime.mjs";
import {
  THRESHOLDS,
  baseCount,
  baseSplit,
  dispersion,
  whipCount,
} from "../../src/domain/congress/index.mjs";
import { alarm, left } from "../../src/application/mail.mjs";
import { describeMail, describeMonth, letterHtml, trayHtml } from "../../src/ui/screens/inbox.mjs";
import { vitalsHtml } from "../../src/ui/components/vitals.mjs";
import { addressed } from "../../src/ui/strings.mjs";
import { nupCheck, protocolOf } from "../../src/ui/components/protocol.mjs";
import {
  boilerOf,
  governmentOf,
  discretionaryRoom,
  ledger,
  outlook,
  playMonth,
  settlement,
  situationOf,
  termOf,
} from "../../src/application/turn.mjs";
import { OPENING_MONTH, createState, monthLabel } from "../../src/state/state.mjs";
import { MONTHS_PER_TERM } from "../../src/data/regime.mjs";
import { enact } from "../../src/domain/norms/index.mjs";
import { pollFrom } from "../../src/domain/opinion/index.mjs";
import { closingHtml } from "../../src/ui/screens/closing.mjs";
import { UI } from "../../src/ui/strings.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { areaHtml } from "../../src/ui/screens/area.mjs";
import { financeHtml } from "../../src/ui/screens/finance.mjs";
import { money, num, percent, signed } from "../../src/ui/core/format.mjs";
import { trendOf, windowLabel } from "../../src/ui/components/trend.mjs";
import { capacityStripHtml, mesaHtml } from "../../src/ui/screens/congress.mjs";
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
    /* ⚠ O `spread` ENTRA COM ZERO PORQUE UMA PAUTA DE CATÁLOGO NÃO TEM NUVEM: ela é um texto
       só, com uma posição só, e o raio ideológico de um ponto é zero. */
    bill: bill === null ? null : { ...bill, spread: 0 },
    areaLabel: areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: bill ? quorumOf(bill) : 0,
    parties,
    loyalty: state.loyalty,
    funding,
    forecast: voting ? whipCount({ bill, parties, funding, loyalty: state.loyalty }) : null,
    /* O CASO SINTÉTICO USA OS QUATRO BLOCOS, e por isso a soma por bloco é direta: aqui não
       há elenco. */
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
    /* O CASO SINTÉTICO NÃO TEM ELENCO — ele monta a Mesa com os blocos crus do catálogo,
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
 * Uma área como o entrypoint a monta.
 *
 * @param {import("../../src/data/areas.mjs").Area} area
 * @param {number} spent bilhões que esta área consome no mês
 * @param {Record<string, number>} [levels] níveis fora do vigente, quando a prova quiser
 */
function areaOf(area, spent, levels = {}) {
  const state = createState(7);
  const value = state.capacity.index[area.id] ?? area.initial;
  /* Até estas duas linhas eram `value − decay + yield × spent` e `value − decay` — a cópia da
     cópia, e a prova reproduzia fielmente um defeito que fazia a seta apontar para o lado
     errado em cinco das oito áreas. */
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
 * O painel de Finanças como o entrypoint o monta.
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

/* `min`, `max`, `step` e `value` são os quatro atributos que o navegador lê como NÚMERO. */
const NUMERIC_ATTRIBUTE = /\s(?:min|max|step|value)="([^"]*)"/g;

/* A COLUNA DE TENDÊNCIA do placar, com o conteúdo — que pode ser vazio, e o vazio é
   informação: série curta demais não vira desenho. */
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

test("TODO ATRIBUTO NUMÉRICO E LEGÍVEL PELO NAVEGADOR, em qualquer posição de jogo", () => {
  let checked = 0;

  /* A Mesa, com e sem pauta, e com verba em fração quebrada — que é o caso que produz decimal
     no atributo. */
  for (const bill of [null, ...bills.slice(0, 8)]) {
    checked += assertNumericAttributes(mesaOf(bill, everyone(0.37)), `mesa ${bill?.id ?? "vazia"}`);
  }

  /* As seis áreas, com alocacoes que não são redondas. */
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

  /* A prova só vale se ela tiver achado atributos para conferir: uma view que parasse de
     emitir controles passaria vazia, e passar vazia é a forma mais comum de uma suíte morrer
     sem ninguém ver. */
  assert.ok(checked > 100, `so ${checked} atributos numericos conferidos — a suite ficou cega`);
});

test("o índice escrito em estilo inline também e número, e não texto localizado", () => {
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

test("o PLACAR só aparece quando existe votação", () => {
  const decree = bills.find(bill => bill.instrument === "decree");
  const law = bills.find(bill => bill.instrument === "law");
  assert.ok(decree && law, "o catalogo perdeu um dos instrumentos");

  assert.ok(!mesaOf(null).includes("tally__forecast"), "a mesa vazia mostrou placar");
  assert.ok(!mesaOf(decree).includes("tally__forecast"), "a caneta mostrou placar");
  assert.ok(mesaOf(law).includes("tally__forecast"), "a lei nao mostrou placar");

  /* E o veredito só se veste de aprovado ou reprovado quando há o que aprovar. */
  assert.ok(!mesaOf(null).includes("data-passes"), "a mesa vazia deu veredito de votacao");
});

test("O PLACAR NÃO OFERECE NADA PARA MEXER, e essa e a informacao principal dele", () => {
  /* A única tela do jogo sem um controle, e a ausência precisa ser verdadeira no HTML e não
     só na intenção: um `<input>` que entrasse aqui por reuso de componente daria ao jogador
     um controle que não muda nada — pior do que não ter, porque ele só descobre depois de
     arrastar. */
  for (const months of [0, 1, 7]) {
    const html = financeOf(months);
    assert.ok(!html.includes("<input"), `o placar do mes ${months} emitiu um controle`);
    assert.ok(!html.includes("<button"), `o placar do mes ${months} emitiu um botao`);
    assert.equal(assertNumericAttributes(html, `financas mes ${months}`), 0);
  }
});

test("NENHUM NÚMERO DO PLACAR SAI QUEBRADO, em partida nova ou em andamento", () => {
  /* `NaN`, `undefined` e `Infinity` atravessam template literal sem lançar e chegam à tela
     como texto. */
  for (const months of [0, 1, 12]) {
    const html = financeOf(months);
    for (const rot of ["NaN", "undefined", "Infinity"]) {
      assert.ok(!html.includes(rot), `o placar do mes ${months} mostrou "${rot}"`);
    }
  }

  /* A partida recém-aberta tem série VAZIA, e o painel não pode desenhar escada nenhuma nela:
     um degrau solitário lê como sujeira de renderização, e seis iguais afirmam uma
     estabilidade que ninguém observou ainda. */
  const sparks = [...financeOf(0).matchAll(SPARK)].map(hit => hit[1] ?? "");
  assert.ok(sparks.length > 0, "o painel parou de emitir a coluna de tendencia");
  assert.ok(
    sparks.every(spark => spark === ""),
    "o painel desenhou tendencia sem passado",
  );
});

test("A ESCADA LÊ CADA INDICADOR NA RÉGUA DELE, e não na do índice de área", () => {
  /* ⚠ ESTA PROVA PRENDE UM DEFEITO QUE JÁ ESTEVE NA TELA. */
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

test("o rótulo do catálogo e ESCAPADO, e o catálogo e dado editável", () => {
  /* Um `<` que atravesse a view não é só um defeito de desenho: é injeção de marcação a
     partir de um arquivo que qualquer sessão futura vai mexer. */
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
    /* ⚠ AQUI É A CÂMARA DIVIDIDA DE VERDADE, e não os blocos crus: o hemiciclo desenha 513
       cadeiras a partir desta lista, e uma prova que o alimentasse com um punhado de caixas
       não exercitaria a soma que ele precisa fechar. */
    inbox: "",
    resolved: state.month > OPENING_MONTH,
    room: share.room,
    mandatory: budget.mandatory,
    revenue: budget.revenue,
    ratio: 1,
    standing: pollFrom(state.mood, CATALOG.segments, CATALOG.opinion),
    areas: CATALOG.areas,
    protect: [],
    /* A POSSE MUDA NA PROVA QUE PRECISA DELA, e o padrão é o presidente que não prometeu:
       um mandato sem plataforma é estado válido e é o que a maioria das provas quer medir. */
    platform: [],
    betrayal: 0,
    /* A CALDEIRA FRIA e as três rupturas fechadas: este caso mede o VAZIO do Gabinete, e um
       governo em véspera de queda não é vazio. */
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

/* ⚠ AS DUAS TELAS DEIXARAM DE DIVIDIR O INPUT, e a razão é que o Gabinete virou mesa: ele
   não lê leitura nenhuma, só o ato do mês e o correio. O da caixa continua sendo o antigo. */
const emailOf = (/** @type {any} */ state, /** @type {any} */ extra = {}) =>
  emailHtml(cabinetInputOf(state, extra));

/** O QUE A MESA CONSOME — o ato, as oito pastas e o punhado de cartas. */
const deskOf = (/** @type {any} */ state, /** @type {any} */ extra = {}) =>
  cabinetHtml({
    room: 14,
    ratio: 1,
    president: "Dalva Zamith",
    month: state.month,
    areas: CATALOG.areas,
    protect: [],
    letters: [],
    sheets: 0,
    brief: { ...BRIEF, month: state.month, ...(extra.brief ?? {}) },
    boiling: null,
    ...extra,
  });

/** O PARECER EM REPOUSO — um governo de pé, para a prova mexer só no que ela mede. */
const BRIEF = {
  month: 0,
  chief: "Nadir Quessada",
  room: 14,
  mandatory: 900,
  revenue: 1000,
  base: 300,
  majority: SIMPLE_MAJORITY,
  worst: null,
  standing: 44,
  was: null,
  she: true,
  impeachment: null,
};

/** @param {number} many @param {number} urgent as ULTIMAS `urgent` sao as que vencem */
const mailOf = (many, urgent = 0) =>
  Array.from({ length: many }, (_, i) => ({ urgent: i >= many - urgent }));

test("A BASE REPARTIDA SOMA A BASE INTEIRA, e não o plenario", () => {
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

const ASPA = String.fromCharCode(34);
const UNREAD = "data-unread=";

/** @param {string} html @returns {string[]} um pedaco por linha do indice, id na frente */
function rowsOf(html) {
  return html.split("data-dispatch=").slice(1);
}

/* ⚠ O TETO DE 7 LINHAS CAIU, e esta prova era a dele: ela cobrava que a pilha ESCONDESSE
   aviso para não rolar. Com blocos de mês, esconder é mentir sobre o mês — "MAR" com 2 das 5
   cartas dele —, e quem absorve é a rolagem que `.tray__list` já declara no portão. */
test("A BANDEJA NÃO ESCONDE CARTA NENHUMA, e o índice rola em vez de cortar", () => {
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

  /* ⚠ E O MAIS VELHO CONTINUA LÁ: era ele que a pilha descartava primeiro. */
  const ficaram = rowsOf(html).map(linha => linha.slice(1, linha.indexOf(ASPA, 1)));
  assert.ok(ficaram.includes("carta-0"), "a bandeja perdeu a carta mais velha");
  assert.ok(ficaram.includes("carta-15"), "a bandeja perdeu a carta mais nova");
});

/* ── O NÃO LIDO, E CADA CARTA DIZENDO POR QUE CHEGOU ───────────────────────── As duas peças
   vieram do inbox do Football Manager, e a segunda é a que mais casa com a doutrina daqui:
   neste projeto todo número mostrado tem motor atrás, e a CARTA era a única peça da tela que
   não explicava a própria existência. */
test("A BANDEJA MARCA O NÃO LIDO, e a carta aberta deixa de ser um", () => {
  /** @param {number} n */
  const carta = n => ({
    id: `carta-${n}`,
    month: n,
    from: null,
    subject: `assunto ${n}`,
    body: "<p>corpo</p>",
    due: null,
  });

  /* ⚠ `carta-2` ESTÁ ABERTA E NÃO ESTÁ EM `seen`, de propósito: é o caso que a captura pegou. */
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

  /* O MESMO ESTADO, TRÊS MESES ADIANTE — que é exatamente o caso da captura. */
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
  /* ⚠ E A PROMESSA NÃO PODE SOBRAR. */
  assert.ok(
    !tarde.includes(UI.cabinet.inboxSigned),
    "a promessa de que o mes resolvido chega na bandeja sobreviveu a bandeja vazia",
  );
});

test("O CONTINGENCIAMENTO MORA NA MESA, e ele oferece as oito pastas", () => {
  /* ⚠ ELE MORAVA NAS OITO TELAS DE ÁREA, uma porta por tela — e o decreto é UM ato, rubrica a
     rubrica. Duas portas para o mesmo gesto é o defeito recorrente número um deste projeto. */
  const state = createState();

  const html = deskOf(state);
  for (const area of CATALOG.areas) {
    assert.ok(html.includes(`data-protect="${area.id}"`), `a pasta ${area.id} nao chegou a mesa`);
  }

  const poupada = deskOf(state, { protect: ["health"] });
  const apertado = deskOf(state, { ratio: 0.6 });
  /* ⭐ O PREÇO MORA NO ART. 2, e não numa nota ao lado: "o que elas deixarem de ceder, as
     outras pagam" é a mesma frase para os dois estados, e é o próprio ato que a diz. */
  assert.ok(apertado.includes("60%"), "o mes apertado nao disse a fracao no Art. 1");
  assert.ok(html.includes("100%"), "o mes inteiro nao disse que honra o pedido todo");

  /* ⚠ O BOTÃO TEM ESTADO, e o gesto é `data-protect` e não `data-section`: os dois moram na
     mesma tela agora, e um seletor emprestado faria proteger trocar de tela. */
  assert.ok(html.includes('aria-pressed="false"'), "a pasta solta nao disse que esta solta");
  assert.ok(poupada.includes('aria-pressed="true"'), "a pasta poupada nao disse que esta poupada");
});

test("A MESA MOSTRA O QUE CHEGOU, e quem decide o que vence e o motor", () => {
  /* ⛔ A TELA NÃO CONTA PRAZO. Escrever `left(carta) <= 0` na view é a família de defeito mais
     cara deste projeto, com sete ocorrências: quem diz o que este mês fecha sem resposta é
     `silences`, e cada carta já chega dizendo se vence. */
  const state = createState();
  const conta = (/** @type {string} */ html, /** @type {string} */ marca) =>
    html.split(marca).length - 1;

  const vazia = deskOf(state);
  assert.equal(conta(vazia, 'class="envelope"'), 0, "a mesa vazia desenhou carta");

  const tres = deskOf(state, { letters: mailOf(3) });
  assert.equal(conta(tres, 'class="envelope"'), 3, "tres cartas nao viraram tres envelopes");
  assert.equal(conta(tres, "data-urgent"), 0, "nenhuma vencia e alguma saiu marcada");

  /* ⚠ O QUE VENCE CAI POR CIMA: é o que uma pessoa faz com a correspondência urgente. */
  const urgente = deskOf(state, { letters: mailOf(3, 2) });
  assert.equal(conta(urgente, "data-urgent"), 2, "as duas que vencem nao ficaram marcadas");
  assert.ok(
    urgente.lastIndexOf('class="envelope"') > urgente.indexOf("data-urgent"),
    "a que vence nao caiu por cima",
  );

  /* ⛔ E A MARCA É DE CADA CARTA, e não da POSIÇÃO dela: quem vence sai de `silences`, que
     olha a caixa inteira, e o punhado desenha o que chegou. Marcando as últimas N, uma caixa
     com mais vencendo do que chegando pintava de vermelho carta que não vence. */
  const so_a_do_meio = deskOf(state, {
    letters: [{ urgent: false }, { urgent: true }, { urgent: false }],
  });
  assert.equal(conta(so_a_do_meio, "data-urgent"), 1, "a marca nao seguiu a carta");

  /* ⚠ O TETO É A TABELA DE QUEDA, e ele é declarado: acima dele o punhado repetiria posição, e
     duas cartas no mesmo lugar leem como uma. */
  const cheia = deskOf(state, { letters: mailOf(40) });
  assert.equal(conta(cheia, 'class="envelope"'), 8, "o punhado passou do teto da tabela");

  /* ⛔ E ACIMA DO TETO QUEM FICA É A QUE VENCE. Ela chega no FIM da lista, para cair por cima,
     e um corte pela frente jogava fora justamente as vermelhas: 12 cartas com 3 vencendo
     desenhavam oito envelopes e nenhum vermelho — a mesa calada sobre o que ela existe para
     avisar. */
  const lotada = deskOf(state, { letters: mailOf(12, 3) });
  assert.equal(conta(lotada, 'class="envelope"'), 8, "o punhado passou do teto da tabela");
  assert.equal(conta(lotada, "data-urgent"), 3, "a caixa cheia engoliu as cartas que vencem");
});

test("O TELEFONE SÓ TOCA QUANDO ALGUÉM FERVEU, e ele aponta para a Caixa", () => {
  /* ⚠ A TELA NÃO TEM LIMIAR PRÓPRIO: quem diz que um grupo ferveu é `boilerOf`, e aqui chega
     só o NOME — ou nulo. Um telefone que tocasse por pressão alta sem ruptura seria a view
     inventando um limiar a mais, e o jogo já pagou por dois limiares para a mesma coisa. */
  const state = createState();

  const quieto = deskOf(state);
  assert.ok(quieto.includes('data-ringing="false"'), "sem fervura o telefone tocou");
  assert.ok(quieto.includes(UI.phone.quiet), "quem le por som nao soube que ele esta mudo");

  const tocando = deskOf(state, { boiling: "Mercado financeiro" });
  assert.ok(tocando.includes('data-ringing="true"'), "com fervura o telefone ficou mudo");
  assert.ok(tocando.includes("Mercado financeiro"), "o telefone nao disse quem ligou");
  /* O GESTO É O DO RAIL: `data-section` leva à Caixa, onde a carta já está. */
  assert.ok(tocando.includes('data-section="email"'), "o telefone nao aponta para a Caixa");
});

test("CADA CARTA E UM BOTÃO QUE ABRE A PRÓPRIA CARTA NA MESA, e diz por som se vence", () => {
  /* Ciclo 27: o envelope i ergue a folha i de `.post`; só o telefone leva a Caixa. Quem vence
     chega dito por `silences`, nunca contado aqui. */
  const state = createState();
  const mesa = deskOf(state, {
    letters: [
      { urgent: false, dispatch: null },
      { urgent: true, dispatch: null },
    ],
  });
  const conta = (/** @type {string} */ needle) => mesa.split(needle).length - 1;

  assert.equal(conta('<button class="envelope"'), 2, "a carta deixou de ser botao");
  assert.equal(conta('data-letter="0"'), 1, "o primeiro envelope nao aponta para a carta 0");
  assert.equal(conta('data-letter="1"'), 1, "o segundo envelope nao aponta para a carta 1");
  assert.equal(conta('data-section="email"'), 1, "o telefone perdeu o caminho para a Caixa");
  assert.equal(conta(UI.envelope.waiting), 1, "a carta que espera nao se apresentou");
  assert.equal(conta(UI.envelope.due), 1, "a carta que vence nao avisou por som");
});

test("A ESPESSURA DA PASTA E O QUE ESPERA DESPACHO, e não um número escolhido", () => {
  const state = createState();
  const conta = (/** @type {string} */ html) => html.split('class="stack__under"').length - 1;

  assert.equal(conta(deskOf(state)), 0, "sem despacho a pasta ganhou folha de enfeite");
  assert.equal(
    conta(deskOf(state, { sheets: 4 })),
    4,
    "quatro despachos nao viraram quatro folhas",
  );
});

/* ── O ZERO ARREDONDADO NÃO CARREGA SINAL ────────────────────────────────────── ⚠ DEFEITO
   PEGO NA CAPTURA, e o painel o mostrava havia sessões: o hiato do produto saía "-0,0%" com
   um valor de -0,0002. */
test("O ZERO ARREDONDADO E ZERO, e não um zero com sinal de menos", () => {
  assert.equal(num(-0.0002, 1), "0,0", "uma magnitude que arredonda para zero manteve o sinal");
  assert.equal(num(-0, 1), "0,0");
  assert.equal(num(-0.04, 1), "0,0");
  assert.equal(percent(-0.0002, 1), "0,0%", "o hiato do produto ainda sai negativo");

  /* Sem esta metade, a correção viraria a pior versão do defeito que ela conserta — uma tela
     que esconde o sinal de um número que tem sinal. */
  assert.equal(num(-0.06, 1), "-0,1");
  assert.equal(num(-1.2, 1), "-1,2");
  assert.equal(signed(-0.0002, 1), "0,0", "o sinal explicito discordou do arredondamento");
  assert.equal(signed(-0.6, 0), "−1");
});

/* ── A VARIAÇÃO DE ÍNDICE DECLARA A JANELA QUE MEDIU ─────────────────────────── ⚠ TRÊS
   DEFEITOS NUMA LINHA SÓ, e todos os três eram número inventado na tela. */
test("A VARIAÇÃO DE UM ÍNDICE DIZ EM QUANTOS MESES, e cala onde não há passado", () => {
  /* Sem passado não há tendência, e `null` é a resposta — nunca zero. */
  assert.equal(trendOf(70, []), null, "uma area sem historico inventou uma tendencia");
  assert.equal(trendOf(70, [70]), null, "um historico de um valor virou variacao de zero");

  /* A janela é o que o histórico suporta, e nunca mais que doze. */
  assert.deepEqual(trendOf(64, [60, 61, 62, 64]), { delta: 4, months: 3 });

  const long = Array.from({ length: 25 }, (_, month) => 40 + month);
  const seen = trendOf(64, long);
  assert.equal(seen?.months, 12, "a janela passou de doze meses");
  assert.equal(seen?.delta, 64 - 52);

  assert.equal(windowLabel(1), "em 1 mês", "o singular saiu no plural");
  assert.equal(windowLabel(3), "em 3 meses");

  /* ── E AS DUAS TELAS LEEM A MESMA COISA ─────────────────────────────────── Era este o
     defeito de fundo: Finanças e a tela de área mostravam variações DIFERENTES para a mesma
     área, porque cada uma refazia a conta do seu jeito. */
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
    /* Zero de propósito: a dívida de 0,78 é exatamente a herdada, e o mercado não cobra pelo
       país que o presidente recebeu. */
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

  /* E onde não há passado, nenhuma das duas afirma nada. */
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

test("O ZERO DA ÁREA E NEUTRO: a cor da variação lê o número que a tela imprime", () => {
  /* ⚠ ACHADO NA CAPTURA DO PASSEIO e ele é a MESMA família que Finanças já tinha consertado —
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

  /* E o que a leitura de fato mostra continua tingido — a correção não pode apagar o sinal de
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

  /* O PRAZO, e ele é a metade que faltava. */
  const served = { ...opening, month: MONTHS_PER_TERM };
  assert.equal(termOf(served).over, true, "o mandato passou dos 48 meses e nao acabou");
  assert.equal(termOf(served).ending, "served");

  /* E O ÚLTIMO MÊS AINDA É MANDATO. */
  const last = { ...opening, month: MONTHS_PER_TERM - 1 };
  assert.equal(termOf(last).over, false, "o ultimo mes do mandato foi dado como acabado");
});

test("O FECHO NÃO INVENTA UM NÚMERO: tudo que ele mostra vem do estado ou da fonte", () => {
  const state = createState(7);
  const term = termOf(state);

  /* No mês da posse os dois lados da linha têm de ser o MESMO valor — se divergirem aqui, o
     fecho está lendo de dois lugares. */
  for (const area of term.areas) {
    const source = CATALOG.areas.find(item => item.id === area.id);
    assert.ok(source);
    assert.equal(area.from, source.initial, `${area.id}: o fecho inventou o indice da posse`);
    assert.equal(area.to, area.from, "o mes da posse ja mostrava movimento");
  }

  /* A DÍVIDA HERDADA É A DO CATÁLOGO, com fonte. */
  assert.equal(term.debt.from, CATALOG.fiscal.initialDebtRatio);

  /* ⚠ A APROVAÇÃO DA POSSE É A QUE A SONDA LÊ DO CATÁLOGO, e não um número escrito à mão: um
     valor digitado seria a segunda verdade sobre com quanta popularidade o presidente entrou,
     e divergiria no dia em que um segmento mudasse. */
  assert.equal(term.approval.from, term.approval.to, "a aprovacao da posse nao e a da SONDA");
});

test("O FECHO SÓ CREDITA A LEI QUE O JOGADOR ESCREVEU", () => {
  const state = createState(7);
  /* ⚠ A PILHA DE ABERTURA NÃO É VAZIA — a posse herda as vinculações do país. */
  assert.ok(state.norms.length > 0, "a partida abriu sem lei nenhuma no pais");
  assert.equal(termOf(state).laws.length, 0, "o fecho creditou a lei herdada ao jogador");

  /* E a norma escrita DEPOIS da posse conta, com o mês em que passou e o nome da alavanca que
     ela move — o jogador escreveu sobre um nome, e não sobre um id. */
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

test("AS DUAS SAÍDAS LEEM A MESMA TELA, e o que muda e o carimbo e a data", () => {
  /* ⚠ ESTA PROVA GUARDA UMA DECISÃO, e não um comportamento. */
  const opening = createState(7);
  const removed = closingHtml(termOf({ ...opening, month: 47, fallen: 46 }));
  const served = closingHtml(termOf({ ...opening, month: MONTHS_PER_TERM }));

  assert.ok(removed.includes(UI.closing.removed), "o fecho da queda nao carimbou a queda");
  assert.ok(served.includes(UI.closing.served), "o fecho do prazo nao carimbou o prazo");
  assert.ok(!served.includes(UI.closing.removed), "quem cumpriu o mandato foi dado como afastado");

  /* A MESMA FORMA NOS DOIS: mesmas seccoes, mesmo número de linhas de rubrica. */
  const rows = (/** @type {string} */ html) => html.split('class="closing__row"').length;
  assert.equal(rows(removed), rows(served), "as duas saidas desenharam tabelas diferentes");
  /* ⚠ A FRASE PASSA PELO TRATAMENTO, e por isso a prova compara o texto JÁ TRADUZIDO: o
     bruto carrega o marcador `{v}`, e compará-lo com o renderizado acusaria sempre. */
  assert.ok(
    served.includes(addressed(UI.closing.country)),
    "o fecho do prazo perdeu o pais que ele entrega",
  );
});

test("AUSÊNCIA DECLARADA NO FECHO: um mandato sem lei DIZ que não teve lei", () => {
  /* Um espaço vazio no lugar da lista pareceria defeito — e o passivo, que é uma partida
     inteira válida, é exatamente quem cai nesse caso. */
  const empty = closingHtml(termOf({ ...createState(7), month: MONTHS_PER_TERM }));
  assert.ok(
    empty.includes(addressed(UI.closing.noLaws)),
    "o mandato sem lei nenhuma nao disse isso",
  );
  assert.ok(!empty.includes("closing__laws"), "a lista de leis nasceu vazia em vez de ausente");
});

/* ── O CERCO FALANDO ────────────────────────────────────────────────────────── POR QUE ESTAS
   PROVAS EXISTEM, e o achado foi MEDIDO e não visto. */

test("O REMETENTE EXISTE: a carta da Casa Civil e assinada", () => {
  /* ⚠ ESTE DEFEITO ATRAVESSOU CINCO SESSÕES SEM SER VISTO, e ele estava na PRIMEIRA carta do
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

test("O CERCO ESCREVE, e ele não inventa nenhum dos dois números", () => {
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

  /* 86 e `3×` é o preço do cerco: escritos à mão na view, mentiriam no dia em que qualquer um
     mudasse, e essa é a família de defeito mais cara deste projeto. */
  assert.ok(siege.includes(String(boiler.removal)), "a carta nao citou o quorum do afastamento");
  assert.ok(siege.includes(String(boiler.seats)), "a carta nao citou o tamanho da Camara");
  assert.ok(siege.includes(`${boiler.price}×`), "a carta nao citou o preco da cadeira no cerco");

  /* E ELA APONTA PARA ONDE A JOGADA ACONTECE. */
  assert.ok(siege.includes('data-section="congress"'), "a carta do cerco nao leva ao Congresso");

  /* AS TRÊS RUPTURAS TÊM CADA UMA A SUA FRASE, e nenhuma cai no texto de reserva. */
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

test("O ALARME NÃO VIRA MURAL: só a TRANSICAO escreve, e o cerco escreve uma vez", () => {
  /* Medido num mandato passivo inteiro: três rupturas e um cerco, e nem uma a mais. */
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

test("A LINHA DO CAIXA NÃO DIZ O CONTRÁRIO DO MOTOR", () => {
  /* ⚠ ACHADO NA CAPTURA e ele é da família mais cara deste projeto — a tela afirmando o
     oposto do que o turno faz. */
  /* `mesaOf` já monta a Mesa como o entrypoint monta, com `demand` de 15,75 contra um espaço
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

test("NENHUM RÓTULO DE INSTRUMENTO CAI NO ID CRU — e id cru aqui e INGLÊS", () => {
  /* ⚠ ACHADO NA CAPTURA . */
  const instruments = new Set(CATALOG.bills.map(bill => bill.instrument));
  /* `budget` não mora em `bills.mjs`: ele é a execução do orçamento, que não vai a plenário e
     por isso não é catálogo de pauta. */
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

/* ⚠ AUSÊNCIA NÃO É RESULTADO, E A BARRA A DESENHAVA COMO "NÃO MOVEU". A regra sobreviveu à
   troca de desenho: onde antes uma seta afirmava "não moveu" sobre um passado que não existe,
   hoje uma linha reta afirmaria a mesma coisa. Série curta demais não desenha. */
test("O DESENHO SÓ EXISTE QUANDO HÁ HISTÓRIA: sem série, a barra não opina", () => {
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
  /* ⚠ MAS O PONTO EXISTE, e cinza: a leitura nasce na tela no primeiro mês, e a ausência de
     direção se declara pela cor em vez de sumir com o desenho inteiro. */
  assert.equal(
    (mudo.match(/data-sign="flat"/g) ?? []).length,
    3,
    "sem serie os tres pontos tem de existir e ficar cinzas",
  );
  /* A BASE DESENHA MESMO ASSIM, e a diferença é de natureza: ela não tem história, tem
     LIMIAR — o medidor compara com a maioria, e a maioria existe desde o primeiro mês. */
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
  /* A INFLAÇÃO CAIU, E CAIR É BOM: o sinal dela se inverte, e o ponto final sobe. */
  assert.match(falado, /class="vit__end" data-sign="up"/);
  assert.match(falado, /class="vit__end" data-sign="down"/);
});

/* ⛔ OS DOIS LIMIARES DA BARRA ERAM CÓPIA, e as duas cópias tinham envelhecido: a rua acendia
   em 20 quando o catálogo já rompia em 16, e a inflação acendia em 7,5% quando Finanças já
   acusava desde 4,5%. A prova compara com o CATÁLOGO e não com um número escrito aqui — um
   literal seria a terceira cópia da mesma régua. */
test("O ALARME DA BARRA E O LIMIAR DO CATÁLOGO, e não uma copia envelhecida", () => {
  const floor = CATALOG.pressure.streetFloor;
  const ceiling = CATALOG.macro.inflationTarget + CATALOG.macro.inflationTolerance;

  /** @param {number} approval @param {number} inflation @returns {number} */
  const acesos = (approval, inflation) => {
    const html = vitalsHtml({
      macro: { gdp: 12500, inflation },
      approval,
      /* A base fica larga de propósito: quem acende nesta prova são as outras duas. */
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
   PROVAS QUE MORAVAM AQUI COBRAVAM A TABELA: que as células impressas somassem o total
   impresso, e que a repartição não andasse mais de um ponto. As duas morreram com a peça que
   elas cobriam — `apportion` saiu junto, sem consumidor —, e o que elas garantiam continua
   cobrado abaixo: o número da linha é a conta do motor, e a barra nunca mente sobre ele. */

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

/* ⚠ ELE É O ÚNICO AVISO QUE NÃO É TRAVESSIA: nada piorou, venceu um PRAZO. E o número que
   ele mostra é o da CARTA e não o de hoje — a mesma regra dos alarmes de fervura e de minoria,
   e pela mesma razão medida. */
test("A CARTA DO BIMESTRAL DIZ O PRAZO E A FRAÇÃO, e a fração e a da carta", () => {
  /** @param {number} pontos */
  const carta = pontos =>
    describeMail({
      mail: [
        {
          id: `contingency:4`,
          kind: "contingency",
          month: 4,
          due: null,
          subject: "contingency",
          bill: null,
          except: [],
          saved: null,
          was: null,
          now: pontos,
          from: null,
          lever: null,
          level: null,
          answer: null,
          closedAt: 4,
        },
      ],
      people: [],
      left: () => null,
      inherited: { mandatory: 0, room: 0 },
      answered: {},
      segments: [],
      parties: [],
    })[0];

  const noventa = carta(94);
  assert.ok(noventa, "a carta do bimestral nao chegou a bandeja");
  assert.ok(noventa.subject.includes(UI.inbox.contingencySubject), "ela nao anuncia o prazo");
  assert.ok(noventa.annex?.includes("94%"), "ela nao traz a fracao que o mes honrou");
  assert.ok(noventa.annex?.includes(UI.inbox.contingencyLegend));

  /* ⛔ E ELA NÃO INVENTA UM CORTE ONDE NÃO HOUVE: cem por cento é um mês sem aperto. */
  assert.ok(carta(100)?.annex?.includes("100%"), "o mes sem corte perdeu o numero");
  assert.ok(!noventa.annex?.includes("100%"), "a carta de 94 imprimiu 100");
});

test("A CAIXA NÃO TEM MAIS TABELA NENHUMA, e a peça de dado e uma só", () => {
  /* ⚠ MEDIDO ANTES: 19 de 23 cartas abertas num mandato de 14 meses traziam tabela, com 306
     células por mês e CINCO formatos de anexo para quinze espécies. */
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

test("O NÚMERO DA LINHA E A CONTA DO MOTOR, e a barra nunca passa de 100", () => {
  /* ⚠ ELA SUBSTITUI A PROVA DA SOMA DAS CÉLULAS: não há mais célula para fechar, e o que
     precisa fechar é o número impresso contra a soma que o motor mandou. */
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

        /* A LINHA DA Classe C: o valor impresso e a soma cheia arredondada, e não cinco
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
  /* ⚠ ONZE LINHAS NUM OFÍCIO É O DIÁRIO OFICIAL DENTRO DE UMA CARTA — quem lista bancada por
     bancada é a tela do Congresso, e o Gabinete já recusa a mesma lista com essas palavras. */
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
 * A SEQUÊNCIA DO ÍNDICE — cabeçalho de mês e linha, na ordem em que saem.
 *
 * @param {string} html
 * @returns {{ month: string | null, row: string | null }[]}
 */
function sequenceOf(html) {
  return [...html.matchAll(/<li class="tray__month">([^<]*)<|data-dispatch="([^"]*)"/g)].map(
    hit => ({ month: hit[1] ?? null, row: hit[2] ?? null }),
  );
}

test("TODA CARTA MORA NO BLOCO DO MÊS DELA, e o calendário só anda para trás", () => {
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

  /* ⚠ NENHUMA SEÇÃO QUE NÃO SEJA MÊS, e nenhum mês duas vezes. */
  assert.deepEqual(
    secoes,
    [monthLabel(4), monthLabel(3), monthLabel(2)],
    `o indice leu ${secoes.join(" → ")}`,
  );

  /* ⚠ E A PERGUNTA MORA NO MÊS DELA, que é a metade que a seção própria quebrava. */
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

/* ⚠ QUEM DECIDE A ORDEM DENTRO DO MÊS É O MOTOR, e não a tela: `turn.mjs` monta a caixa em
   alarme → pergunta → exigência → aviso → relatório, com a regra escrita lá — "o que exige
   leitura antes da próxima decisão fica no alto". Reordenar aqui refaria essa decisão. */
test("DENTRO DO MÊS A ORDEM DO MOTOR SOBREVIVE, e a mais nova fica em cima", () => {
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

/* ⚠ O DOCUMENTO SÓ ABRE O QUE O ÍNDICE MOSTRA: documento à direita e nenhuma linha marcada à
   esquerda foi o defeito medido no 1½.1. */
test("A BANDEJA ABRE A PRIMEIRA DO MÊS MAIS NOVO, e o aberto sempre tem linha", () => {
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

  /* SEM PREFERÊNCIA: abre a de cima, e a de cima é a do mês mais novo — e não a mais urgente,
     que é o critério que caiu junto com a seção própria. */
  assert.match(
    trayHtml({ dispatches: cartas, open: null }),
    /data-dispatch="aviso-novo"[^>]*aria-current="true"/,
    "a bandeja nao abriu a primeira do mes mais novo",
  );

  /* COM PREFERÊNCIA: ela é sempre atendida, porque nada mais é escondido. */
  assert.match(
    trayHtml({ dispatches: cartas, open: "pergunta-velha" }),
    /data-dispatch="pergunta-velha"[^>]*aria-current="true"/,
    "o documento aberto ficou sem linha marcada no indice",
  );
});

/* ⚠ O FECHAMENTO DO MÊS ERA MONTADO NA TELA a partir de `last`, variável de módulo: o resumo do
   mês anterior sumia da caixa a cada avanço, e sumia inteiro no F5. Palavras dele: "num email
   ele ficaria lá". Ele virou registro guardado, e esta prova cobra a leitura desse registro. */
test("O FECHAMENTO DO MÊS SE LÊ DO REGISTRO GUARDADO, e não do relatório vivo", () => {
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

  /* SEM PAUTA E SEM VOTAÇÃO: o assunto é o do mês que não decidiu nada, e o placar cala. */
  const quieto = describeMonth({ report: fechado(3, null), adviser: null });
  assert.equal(quieto.id, "month-3", `o id do fechamento saiu como ${quieto.id}`);
  assert.equal(quieto.subject, UI.report.noBill, `o assunto saiu como "${quieto.subject}"`);
  assert.ok(!quieto.body.includes(UI.inbox.voted), "o mes sem votacao imprimiu placar");

  /* COM VOTAÇÃO: o placar sai do registro, e o quórum ao lado dele. */
  const votado = describeMonth({ report: fechado(4, 312), adviser: null });
  assert.ok(votado.body.includes("312"), "o placar guardado nao chegou a carta");
  assert.ok(votado.body.includes("257"), "o quorum guardado nao chegou a carta");

  /* ⚠ E DOIS MESES SÃO DUAS CARTAS, com ids diferentes: era isso que não existia. */
  assert.notEqual(quieto.id, votado.id, "dois meses fechados devolveram o mesmo id");
});

/* ── O PASSO 5 DO CICLO 14 ──────────────────────────────────────────────────── ⚠ AS QUATRO
   PROVAS ABAIXO MORDEM: cada uma falha na versão anterior do arquivo que ela cobre. */

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

test("O ANEXO DA RUA NÃO JOGA FORA OS DOIS DESCONTOS", () => {
  /* ⚠ ELES CHEGAVAM EM `attach` E MORRIAM NA VIEW: `broken` vale 12 pontos e o desgaste chega
     a 12 no fim do mandato, e a coluna da soma imprimia o humor da classe sem nenhum dos
     dois. */
  const com = pesquisaHtml({ "c.prices": 30, "c.jobs": 20, betrayal: 4.2, wear: 3 });
  assert.ok(com.includes(UI.inbox.annexDiscount.betrayal), "a credibilidade nao chegou ao pe");
  assert.ok(com.includes(UI.inbox.annexDiscount.wear), "o desgaste nao chegou ao pe");
  assert.ok(com.includes(signed(-4.2)), "o bloco nao imprimiu o desconto da credibilidade");
  assert.ok(com.includes(UI.inbox.annexDiscounts), "os descontos sairam sem bloco proprio");

  /* ⚠ E UM BLOCO DE ZEROS E RUÍDO: o mês 1 não tem promessa quebrada nem desgaste. */
  const sem = pesquisaHtml({ "c.prices": 30, "c.jobs": 20, betrayal: 0, wear: 0 });
  assert.ok(!sem.includes(UI.inbox.annexDiscounts), "a carta abriu um bloco para dois zeros");
});

test("A CARTA DAS CADEIRAS CONTA CADEIRA, e o tamanho da Camara vem do motor", () => {
  /* ⚠ ELA DIZIA "11 pontos" ONDE SÃO 11 CADEIRAS — o corpo reusava o rótulo da PESQUISA —, e
     o 513 estava teclado nas frases, com o motor tendo o número ao lado. */
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
    /* UM TAMANHO QUE NÃO É O DO CATÁLOGO: se a frase estivesse teclada, ela imprimiria 513. */
    chamber: { base: 249, majority: 257, seats: 999 },
  })
    .map(letterHtml)
    .join("");

  assert.ok(html.includes(`>11</b> ${UI.inbox.seats}`), "as 11 cadeiras sairam em pontos");
  assert.ok(!html.includes(UI.inbox.pollPoints), "a carta das cadeiras ainda fala em pontos");
  assert.ok(html.includes(">999<"), "o tamanho da Camara nao veio do motor");
  assert.ok(!html.includes("513"), "o 513 continua teclado na frase");
});

test("A CARTA DA MINORIA LÊ O DENOMINADOR DO MOTOR", () => {
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

test("O ALARME DE FERVURA NÃO GRAVA UM REMETENTE QUE NINGUÉM LÊ", () => {
  /* ⚠ ELE GRAVAVA O ID DO GRUPO EM `from`, e a view sempre o sobrescreveu com a Casa Civil —
     o grupo já viaja em `subject`, e é de lá que o nome sai. */
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

test("O PRAZO SÓ TEM DUAS FAIXAS, e a medição e que decide isso", () => {
  /* ⚠ A TERCEIRA FAIXA E O PLURAL DE "meses" ERAM INALCANÇÁVEIS: `ANSWER_TIME` é 2 e a carta
     só aparece no mês seguinte ao que a escreveu, então `left` devolve 0 ou 1 e mais nada. */
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

test("A CARTA DO PLENARIO LÊ O PLACAR DO CARTÃO DO MESMO MÊS", () => {
  /* ⚠ O NÚMERO JÁ ESTAVA NO SAVE e a carta ao lado chegava vazia: "derrubou por 3" e
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

  /* ⚠ O MÊS ERRADO NÃO SERVE: a carta do mês 9 não pode mostrar o placar do mês 8. */
  assert.ok(!render([mes(8, 254)]).includes(UI.inbox.blockPlenary), "a carta leu outro mes");

  /* AUSENTE E DECLARADO: sem votação, e sem cartão, não há bloco. */
  assert.ok(!render([mes(9, null)]).includes(UI.inbox.blockPlenary), "mes sem votacao deu placar");
  assert.ok(!render([]).includes(UI.inbox.blockPlenary), "sem cartao a carta inventou um placar");
});

/* 📗 OS DOIS OFÍCIOS REAIS QUE ELE MANDOU são a prova da conta do dígito: 736/2022/GPPR leva o NUP
   00037.002019/2022-97 e 986/2021/GPPR leva 00001.008493/2021-59. A regra (Portaria MJ/MP 11/2019)
   reproduz os dois; uma conta inventada não reproduz nenhum. */
test("O DÍGITO DO NUP REPRODUZ OS DOIS OFÍCIOS REAIS DA PRESIDENCIA", () => {
  assert.equal(nupCheck("000370020192022"), "97");
  assert.equal(nupCheck("000010084932021"), "59");
  const first = protocolOf(0);
  assert.equal(first.number, 1);
  assert.match(first.nup, /^00001\.000001\/\d{4}-\d{2}$/);
  /* O treze é o segundo mês do segundo ano: EM número 2, e o ano anda. */
  assert.equal(protocolOf(13).number, 2);
  assert.equal(protocolOf(13).year, first.year + 1);
});
