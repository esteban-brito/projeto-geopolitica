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
import { alarm } from "../../src/application/mail.mjs";
import { describeMail, letterHtml, trayHtml } from "../../src/ui/screens/inbox.mjs";
import { vitalsHtml } from "../../src/ui/screens/dashboard.mjs";
import { addressed } from "../../src/ui/strings.mjs";
import {
  boilerOf,
  chamberOf,
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
import { OPENING_MONTH, createState } from "../../src/state/state.mjs";
import { MONTHS_PER_TERM } from "../../src/data/regime.mjs";
import { enact } from "../../src/domain/norms/index.mjs";
import { closingHtml } from "../../src/ui/screens/closing.mjs";
import { UI } from "../../src/ui/strings.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { areaHtml } from "../../src/ui/screens/area.mjs";
import { financeHtml } from "../../src/ui/screens/finance.mjs";
import { apportion, money, num, percent, signed } from "../../src/ui/shared/format.mjs";
import { trendOf, windowLabel } from "../../src/ui/shared/trend.mjs";
import { capacityStripHtml, mesaHtml } from "../../src/ui/screens/mesa.mjs";
import { cabinetHtml } from "../../src/ui/screens/cabinet.mjs";

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
    /* O CASO SINTETICO NAO TEM ELENCO — ele monta a Mesa com os quatro blocos crus para
       provar a estrutura da tela. */
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
function cabinetOf(state, extra = {}) {
  const situation = situationOf(state, CATALOG);
  const share = settlement(state, {}, CATALOG);
  const { budget } = ledger(state, {}, CATALOG);

  return cabinetHtml({
    situation: situation.level,
    verdict: "",
    base: situation.base,
    seats: CATALOG.parties.reduce((sum, party) => sum + party.seats, 0),
    majority: 257,
    split: baseSplit({ parties: CATALOG.parties, loyalty: state.loyalty }),
    /* ⚠ AQUI SAO AS ONZE BANCADAS DE VERDADE, e nao os quatro blocos: o hemiciclo desenha 513
       cadeiras a partir desta lista, e uma prova que o alimentasse com quatro caixas nao
       exercitaria a soma que ele precisa fechar. */
    chamber: chamberOf(state, CATALOG),
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
  });
}

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

    /* ⚠ ANCORADA NO ROTULO, e nao na primeira ocorrencia: a Trindade desenha tres reguas com
       `--mark` ACIMA desta na mesma tela, e sem a ancora a prova media o limiar da ruptura
       social — 20 — e acusava a maioria de estar no lugar errado.
       ⚠ E ELA LE UM MEDIDOR COMPOSTO desde que a Camara deixou de ser uma regua cheia: o que
       ela cobra nao mudou uma virgula — a soma das fatias da base contra as 513, e a marca da
       maioria na MESMA escala. O que mudou e de onde o numero sai. A prova pegou o defeito de
       estreia da peca: sem a fatia do que NAO responde, as tres somavam 100% e a barra ficava
       cheia em qualquer base. */
    const mark = html.match(new RegExp(`--mark:([0-9.-]+)" aria-label="${UI.cabinet.baseLine}`));
    assert.ok(mark, `no mes ${month} a base saiu sem regua`);

    const meter = html.slice(html.indexOf(`aria-label="${UI.cabinet.baseLine}`));
    const parts = [...meter.slice(0, meter.indexOf("</div>")).matchAll(/flex-grow:([0-9.-]+)/g)];
    assert.equal(
      parts.length,
      4,
      `no mes ${month} o medidor da base veio com ${parts.length} fatias`,
    );

    const cheio = parts.reduce((sum, part) => sum + Number(part[1]), 0);
    const naBase = parts.slice(0, 3).reduce((sum, part) => sum + Number(part[1]), 0);
    const gauge = [null, String((naBase / cheio) * 100), mark[1]];

    /* ⚠ ESTA PROVA SUBSTITUI "A FITA FECHA O PLENARIO", e ela nao foi apagada: a fita saiu do
       Gabinete em 22/08/2026 porque onze bancadas em 184px so seriam legiveis com uma legenda
       nomeando cada cor, e essa legenda nao cabe. O que ela cobrava e que continua importando
       — o desenho nao inventa a base, e ele a compara com a maioria na MESMA escala. */
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
      html.includes(`${Math.round(base)} ${UI.cabinet.of} ${total}`),
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

test("A PILHA DA BANDEJA CORTA AVISO, e NUNCA corta pergunta", () => {
  /** @param {number} n @param {number | null} due */
  const carta = (n, due) => ({
    id: `carta-${n}`,
    month: n,
    from: null,
    subject: `assunto ${n}`,
    body: "<p>corpo</p>",
    due,
  });

  /* A ORDEM E A DA BANDEJA DE VERDADE: pergunta primeiro, aviso depois. */
  const perguntas = [0, 1, 2].map(n => carta(n, 3));
  const avisos = [10, 11, 12, 13, 14, 15].map(n => carta(n, null));

  const apertado = trayHtml({ dispatches: [...perguntas, ...avisos], open: null, capacity: 5 });

  for (const pergunta of perguntas) {
    assert.ok(
      rowsOf(apertado).some(linha => linha.startsWith(ASPA + pergunta.id + ASPA)),
      `${pergunta.id} tinha prazo e a pilha a descartou — isso e um muro`,
    );
  }

  const linhas = rowsOf(apertado).length;
  assert.equal(linhas, 5, `a pilha mostrou ${linhas} linhas com capacidade 5`);

  /* ⚠ O MAIS NOVO SOBREVIVE AO MAIS VELHO entre os avisos: a bandeja chega ordenada, e cortar
     pelo fim e cortar o que o mundo disse ha mais tempo. */
  const ficaram = rowsOf(apertado).map(linha => linha.slice(1, linha.indexOf(ASPA, 1)));
  assert.ok(ficaram.includes("carta-10"), "a pilha cortou o aviso errado");
  assert.ok(!ficaram.includes("carta-15"), "a pilha nao cortou nada");

  /* SO PERGUNTA, E MAIS QUE CABE: a pilha estoura de proposito. */
  const so = trayHtml({ dispatches: perguntas, open: null, capacity: 1 });
  const todas = rowsOf(so).length;
  assert.equal(todas, 3, "a pilha escondeu uma pergunta para nao rolar");
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

  const primeiro = cabinetOf(abertura);
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

  const tarde = cabinetOf(depois);
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

/* ⚠ AUSENCIA NAO E RESULTADO, E A BARRA A DESENHAVA COMO "NAO MOVEU". `painted` e variavel
   de modulo do entrypoint: numa recarga nao ha mes anterior, e a barra caia no proprio mes
   como passado — as quatro setas saiam em `—` no mes 30 de um mandato em que tudo andou. */
test("A SETA SO EXISTE QUANDO HA PASSADO: sem mes anterior, a barra nao opina", () => {
  const agora = {
    macro: { gdp: 12500, inflation: 0.04 },
    approval: 40,
    base: 400,
    majority: 257,
  };

  const mudo = vitalsHtml({ ...agora, before: null });
  assert.equal(
    mudo.includes("data-direction"),
    false,
    "sem mes anterior a barra desenhou seta, e seta e veredito sobre um passado que nao existe",
  );

  const falado = vitalsHtml({
    ...agora,
    before: { gdp: 12000, inflation: 0.05, approval: 44, base: 436 },
  });
  assert.equal(
    (falado.match(/data-direction/g) ?? []).length,
    4,
    "com mes anterior os quatro vitais tem de opinar",
  );
  /* A INFLACAO CAIU, E CAIR E BOM: o sinal dela se inverte, e a seta sobe. */
  assert.match(falado, /data-direction="up"[^>]*>▲<\/i><\/span><\/div><div class="vital/);
});

/* ⚠ A TABELA IMPRIMIA DUAS CONTAS CERTAS E INCOMPATIVEIS, e as duas de boa fe: cada celula
   se arredondava sozinha e o total era o arredondamento da soma CHEIA. Medido na Classe C —
   `15,4 + 11,6 + 7,6 + 5,6 + 2,8` — as celulas davam 44 e o total imprimia 43.
   ⚠ E A PROPRIEDADE E DA TABELA INTEIRA, e nao daquela linha: a prova sorteia as notas,
   inclui NEGATIVO (o desgaste tira pontos) e cobra o fecho em toda linha impressa. */
test("O ANEXO FECHA A CONTA: a soma das celulas impressas e o total impresso", () => {
  const segments = [
    { id: "de", label: "Classe D/E" },
    { id: "c", label: "Classe C" },
    { id: "ab", label: "Classe A/B" },
  ];
  const notes = ["prices", "jobs", "services", "safety", "economy"];

  /** @param {Record<string, number>} attach */
  function tabelaOf(attach) {
    const [dispatch] = describeMail({
      mail: [
        {
          id: "pesquisa-1",
          kind: "street",
          month: 3,
          due: null,
          subject: null,
          bill: null,
          except: [],
          saved: null,
          was: 40,
          now: 44,
          weight: null,
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
      segments,
    });
    assert.ok(dispatch, "a carta da pesquisa nao chegou a bandeja");

    /* ⚠ O ANEXO SAIU DO CORPO em 22/08/2026: ele virou uma secao propria da carta, com card e
       legenda, e o corpo ficou so com a manchete. A prova foi atras dele. */
    const corpo = dispatch.annex ?? "";
    const anexo = corpo.slice(corpo.indexOf("annex__table"));
    return [...anexo.matchAll(/<tr>(.*?)<\/tr>/g)]
      .map(linha => [...(linha[1] ?? "").matchAll(/<td[^>]*>(−?-?\d+)<\/td>/g)])
      .filter(celulas => celulas.length === notes.length + 1)
      .map(celulas => celulas.map(celula => Number((celula[1] ?? "0").replace("−", "-"))));
  }

  /* O CASO MEDIDO, ANTES DO SORTEIO: ele e o que a captura pegou, e sem ele um gerador que
     nunca produzisse residuo grande deixaria a prova verde por sorte. */
  const medido = tabelaOf({
    "c.prices": 15.4,
    "c.jobs": 11.6,
    "c.services": 7.6,
    "c.safety": 5.6,
    "c.economy": 2.8,
  });
  const linhaC = medido.find(linha => linha[linha.length - 1] === 43);
  assert.ok(linhaC, "a linha medida nao imprimiu o total de 43");
  assert.equal(
    linhaC.slice(0, -1).reduce((soma, valor) => soma + valor, 0),
    43,
    "as celulas da Classe C nao fecham no total impresso",
  );

  fc.assert(
    fc.property(
      fc.array(fc.double({ min: -14, max: 26, noNaN: true, noDefaultInfinity: true }), {
        minLength: segments.length * notes.length,
        maxLength: segments.length * notes.length,
      }),
      valores => {
        /** @type {Record<string, number>} */
        const attach = {};
        let posicao = 0;
        for (const segment of segments) {
          for (const note of notes) attach[`${segment.id}.${note}`] = valores[posicao++] ?? 0;
        }

        const linhas = tabelaOf(attach);
        assert.equal(linhas.length, segments.length, "o anexo nao imprimiu uma linha por classe");
        for (const linha of linhas) {
          const total = linha[linha.length - 1];
          const soma = linha.slice(0, -1).reduce((acc, valor) => acc + valor, 0);
          assert.equal(soma, total, `as celulas somam ${soma} e a linha imprime ${total}`);
        }
      },
    ),
  );
});

/* ⚠ E A REPARTICAO NAO INVENTA CELULA: cada uma fica a um passo do proprio valor, senao o
   fecho seria comprado com um numero que a classe nunca teve. */
test("A REPARTICAO FICA COLADA NO VALOR: nenhuma celula anda mais de um ponto", () => {
  fc.assert(
    fc.property(
      fc.array(fc.double({ min: -50, max: 50, noNaN: true, noDefaultInfinity: true }), {
        minLength: 1,
        maxLength: 12,
      }),
      valores => {
        const celulas = apportion(valores);
        /* ⚠ `+ 0` FECHA O ZERO NEGATIVO: `Math.round(-0,2)` e `-0`, e `assert.equal` separa os
           dois zeros. E a mesma armadilha que `attr` existe para fechar. */
        const total = Math.round(valores.reduce((soma, valor) => soma + valor, 0)) + 0;
        assert.equal(
          celulas.reduce((soma, valor) => soma + valor, 0),
          total,
          "as celulas repartidas nao somam o total arredondado",
        );
        for (const [indice, valor] of valores.entries()) {
          const celula = celulas[indice] ?? 0;
          assert.ok(Number.isInteger(celula), `a celula ${indice} saiu fracionaria`);
          assert.ok(
            Math.abs(celula - valor) < 1,
            `a celula ${indice} andou ${Math.abs(celula - valor)} para fechar a conta`,
          );
        }
      },
    ),
  );
});
