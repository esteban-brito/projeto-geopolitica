/* SUITE · AS TELAS — views puras, provadas sem navegador.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELA EXISTE, e o motivo tem data. As views devolvem TEXTO, e texto que
   o navegador vai interpretar. Um numero escrito no formato errado dentro de um
   atributo nao quebra nada em Node, nao aparece em nenhum tipo, nao derruba
   guarda nenhuma e nao suja o console: ele muda o comportamento do controle na
   tela, em silencio.

   Foi exatamente o que aconteceu com o controle de alocacao. `num` escreve
   virgula decimal — `max="25,04"` —, e virgula num atributo numerico e valor
   invalido. O navegador descartou os dois atributos e usou o padrao dele: teto
   100 e valor no MEIO da faixa. O controle abria em 50 enquanto o modelo o dava
   como zero, e a unica pista era um controle que "comeca no meio".

   As tres provas aqui cobrem a classe inteira desse defeito, e nao so o caso:
   todo atributo numerico de toda tela, em varias posicoes de jogo. */

import assert from "node:assert/strict";
import test from "node:test";
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
import { mailHtml } from "../../src/ui/screens/inbox.mjs";
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
import { createState } from "../../src/state/state.mjs";
import { MONTHS_PER_TERM } from "../../src/data/regime.mjs";
import { enact } from "../../src/domain/norms/index.mjs";
import { closingHtml } from "../../src/ui/screens/closing.mjs";
import { UI } from "../../src/ui/strings.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { areaHtml } from "../../src/ui/screens/area.mjs";
import { financeHtml } from "../../src/ui/screens/finance.mjs";
import { money, num, percent, signed } from "../../src/ui/shared/format.mjs";
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
    /* ⚠ O `spread` ENTRA COM ZERO PORQUE UMA PAUTA DE CATALOGO NAO TEM NUVEM: ela
       e um texto so, com uma posicao so, e o raio ideologico de um ponto e zero.
       Quem tem raio e a pauta COMPOSTA do orcamento, que reune varios movimentos —
       ver a prosa em `compose`. Este arquivo ainda monta casos com `bills.mjs`, que
       e catalogo morto de proposito (achado 8 do handoff). */
    bill: bill === null ? null : { ...bill, spread: 0 },
    areaLabel: areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: bill ? quorumOf(bill) : 0,
    parties,
    loyalty: state.loyalty,
    funding,
    forecast: voting ? whipCount({ bill, parties, funding, loyalty: state.loyalty }) : null,
    /* O CASO SINTETICO USA OS QUATRO BLOCOS, e por isso a soma por bloco e direta:
       aqui nao ha elenco. No jogo quem soma e `forecast`, na camada de aplicacao —
       ver a prova "A MESA E O TURNO PREVEEM COM A MESMA CAMARA". */
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
    /* O CASO SINTETICO NAO TEM ELENCO — ele monta a Mesa com os quatro blocos crus
       para provar a estrutura da tela. Quem casa gente com bancada e `forecast`, e
       a prova disso vive em `turn.mjs`. */
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
  /* ⚠ A PROVA PERGUNTA, COMO O ENTRYPOINT PERGUNTA. Ate 16/08/2026 estas duas linhas
     eram `value − decay + yield × spent` e `value − decay` — a copia da copia, e a
     prova reproduzia fielmente um defeito que fazia a seta apontar para o lado errado
     em cinco das oito areas. Uma prova que remonta a conta do entrypoint nao prova a
     tela: prova que dois erros iguais sao iguais. */
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

/* `min`, `max`, `step` e `value` sao os quatro atributos que o navegador lê como
   NUMERO. Nenhum outro atributo do projeto entra aqui — `data-*` e `aria-*` sao
   texto por definicao. */
const NUMERIC_ATTRIBUTE = /\s(?:min|max|step|value)="([^"]*)"/g;

/* A COLUNA DE TENDENCIA do placar, com o conteudo — que pode ser vazio, e o vazio
   e informacao: serie curta demais nao vira escada. */
const SPARK = /class="ledger__spark"[^>]*>([^<]*)</g;

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

  /* A Mesa, com e sem pauta, e com verba em fracao quebrada — que e o caso que
     produz decimal no atributo. */
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

  /* A prova so vale se ela tiver achado atributos para conferir: uma view que
     parasse de emitir controles passaria vazia, e passar vazia e a forma mais
     comum de uma suite morrer sem ninguem ver. */
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
  /* Sem pauta nao ha previsao, e uma previsao vazia no maior degrau da escala
     ocupa a tela inteira para dizer "nada". Com caneta tambem nao ha: decreto
     nao vai a plenario, e mostrar um placar de zero seria afirmar uma derrota
     que nao existe. */
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
  /* A unica tela do jogo sem um controle, e a ausencia precisa ser verdadeira no
     HTML e nao so na intencao: um `<input>` que entrasse aqui por reuso de
     componente daria ao jogador um controle que nao muda nada — pior do que nao
     ter, porque ele so descobre depois de arrastar. */
  for (const months of [0, 1, 7]) {
    const html = financeOf(months);
    assert.ok(!html.includes("<input"), `o placar do mes ${months} emitiu um controle`);
    assert.ok(!html.includes("<button"), `o placar do mes ${months} emitiu um botao`);
    assert.equal(assertNumericAttributes(html, `financas mes ${months}`), 0);
  }
});

test("NENHUM NUMERO DO PLACAR SAI QUEBRADO, em partida nova ou em andamento", () => {
  /* `NaN`, `undefined` e `Infinity` atravessam template literal sem lancar e
     chegam a tela como texto. Numa tela densa de dezenove linhas, um deles se
     esconde entre os outros dezoito — e o painel e justamente a tela em que o
     jogador nao tem como conferir nada por fora. */
  for (const months of [0, 1, 12]) {
    const html = financeOf(months);
    for (const rot of ["NaN", "undefined", "Infinity"]) {
      assert.ok(!html.includes(rot), `o placar do mes ${months} mostrou "${rot}"`);
    }
  }

  /* A partida recem-aberta tem serie VAZIA, e o painel nao pode desenhar escada
     nenhuma nela: um degrau solitario lê como sujeira de renderizacao, e seis
     iguais afirmam uma estabilidade que ninguem observou ainda. */
  const sparks = [...financeOf(0).matchAll(SPARK)].map(hit => hit[1] ?? "");
  assert.ok(sparks.length > 0, "o painel parou de emitir a coluna de tendencia");
  assert.ok(
    sparks.every(spark => spark === ""),
    "o painel desenhou tendencia sem passado",
  );
});

test("A ESCADA LE CADA INDICADOR NA REGUA DELE, e nao na do indice de area", () => {
  /* ⚠ ESTA PROVA PRENDE UM DEFEITO QUE JA ESTEVE NA TELA. `sparkline` nasceu para
     indice de 0 a 100 e o painel passou a desenhar com ela inflacao (0,042), juro
     (0,105) e divida sobre PIB (0,78): contra aquela regua, os tres viravam o
     degrau do chao em toda partida, para sempre. A serie existia, o motor estava
     certo, e a escada afirmava que nada nunca acontece — que e a mentira mais
     cara possivel numa tela que so serve para mostrar o que aconteceu. */
  const html = financeOf(0, {
    inflation: [0.02, 0.035, 0.05, 0.07, 0.09, 0.12],
    rate: [0.09, 0.1, 0.11, 0.13, 0.16, 0.19],
    debtRatio: [0.7, 0.74, 0.78, 0.83, 0.89, 0.96],
  });

  const varied = [...html.matchAll(SPARK)]
    .map(hit => hit[1] ?? "")
    .filter(spark => new Set(spark).size > 1);

  assert.equal(
    varied.length,
    3,
    `${varied.length} das tres series macro subiram na escada — o resto ficou plano na regua errada`,
  );
});

test("o rotulo do catalogo e ESCAPADO, e o catalogo e dado editavel", () => {
  /* Nomes de pauta e de bancada sao dado, e dado vai ser editado por gente. Um
     `<` que atravesse a view nao e so um defeito de desenho: e injecao de marcacao
     a partir de um arquivo que qualquer sessao futura vai mexer. */
  const bill = bills[0];
  assert.ok(bill);

  const html = mesaOf({ ...bill, label: '<img src=x onerror="alert(1)">' });

  assert.ok(!html.includes("<img"), "o rotulo da pauta entrou como marcacao");
  assert.ok(html.includes("&lt;img"), "o rotulo nao foi escapado");
});

/* ═══ O GABINETE ═════════════════════════════════════════════════════════════
   As tres provas abaixo nasceram de uma revisao externa da tela, em 14/08/2026.
   Duas delas cobrem defeitos que a revisao NAO viu — o buraco na grade e o
   estouro sem cor —, e a terceira cobre o que ela viu e o motor ja sabia dizer.
   ═══════════════════════════════════════════════════════════════════════════ */

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
    /* ⚠ AQUI SAO AS ONZE BANCADAS DE VERDADE, e nao os quatro blocos: o hemiciclo
       desenha 513 cadeiras a partir desta lista, e uma prova que o alimentasse com
       quatro caixas nao exercitaria a soma que ele precisa fechar. */
    chamber: chamberOf(state, CATALOG),
    inbox: [],
    room: share.room,
    committed: share.demand,
    mandatory: budget.mandatory,
    revenue: budget.revenue,
    locked: lockedBy(state, CATALOG),
    segments: CATALOG.segments,
    street: {},
    /* A CALDEIRA FRIA e as tres rupturas fechadas: este caso mede o VAZIO do
       Gabinete, e um governo em vespera de queda nao e vazio. */
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
  /* A prova que impede as duas verdades. O arco pinta a base por estado da
     bancada, e a tentacao obvia seria repartir as 513 cadeiras — o que poria no
     cartao um segundo tamanho de base, discordando do numero embaixo dele. O que
     se reparte e a base EFETIVA, e as tres fatias tem de fechar com ela. */
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

/* ── O HEMICICLO DESENHA A CAMARA, E A CAMARA INTEIRA ─────────────────────────
   ⚠ ESTA PROVA SUBSTITUIU A DO ARCO em 15/08/2026, e a afirmacao ficou mais forte.
   A antiga cobrava que o arco nao pintasse uma fatia de bancada inexistente — com
   `stroke-linecap: round`, um comprimento zero ainda desenha as duas pontas
   arredondadas, e uma bolinha de cor afirmava uma ruptura que nao existia.

   O hemiciclo tem um invariante maior: ele desenha CADEIRAS, e cadeira desenhada e
   afirmacao sobre o tamanho do plenario. Se o desenho fechar em 511 ou 515, toda
   maioria do jogo passa a ser lida contra uma Camara que nao existe — e ninguem
   percebe, porque cada cunha esta certa sozinha. E exatamente o defeito que o
   ELENCO ja produziu uma vez, quando os alcances nao normalizados fecharam a Camara
   em 730 assentos, e o mesmo que `chamberMismatch` pega no catalogo.

   ⚠ E ELE TEM DE FECHAR COM O MOTOR, e nao com um numero digitado aqui: as cadeiras
   cheias sao a base efetiva que `baseCount` devolve. Duas verdades sobre quantas
   cadeiras respondem ao governo, no mesmo cartao, e o defeito que a regra das tres
   fatias existiu para impedir. */
test("O HEMICICLO FECHA O PLENARIO, e as cadeiras cheias sao a base do motor", () => {
  let state = createState();

  for (let month = 0; month < 18; month++) {
    const html = cabinetOf(state);
    const seatsDrawn = [...html.matchAll(/class="seat" data-mood="(\w+)" data-held="(\w+)"/g)];

    /* ⚠ AS CADEIRAS DESENHADAS SAO 513 MENOS OS VAOS. O vao entre bancadas e uma
       cadeira PULADA — o mesmo recurso do arco segmentado —, entao o desenho perde
       uma por fronteira. O que a prova cobra e que a perda seja EXATAMENTE essa: o
       plenario menos os vaos, e nem uma a mais. */
    const benches = chamberOf(state, CATALOG).filter(bench => Math.round(bench.seats) > 0);
    const total = CATALOG.parties.reduce((sum, party) => sum + party.seats, 0);

    assert.ok(
      seatsDrawn.length <= total && seatsDrawn.length >= total - benches.length,
      `no mes ${month} o hemiciclo desenhou ${seatsDrawn.length} cadeiras num plenario de ${total}`,
    );

    /* AS CHEIAS SAO A BASE, e a base e do motor. */
    const held = seatsDrawn.filter(hit => hit[2] === "true").length;
    const base = baseCount({ parties: CATALOG.parties, loyalty: state.loyalty });
    assert.ok(
      Math.abs(held - base) <= benches.length,
      `no mes ${month} o desenho mostra ${held} cadeiras com o governo e o motor diz ${base}`,
    );

    /* ⚠ NENHUMA CADEIRA SAI SEM HUMOR. Um `data-mood` vazio pintaria a cadeira com
       a cor padrao — cinza — e ela leria como uma quarta categoria que o modelo nao
       tem, ao lado de leal, obstruindo e rompida. */
    for (const hit of seatsDrawn) {
      assert.ok(
        ["loyal", "obstructing", "ruptured"].includes(hit[1] ?? ""),
        `uma cadeira saiu com humor "${hit[1]}", que nao e estado de bancada`,
      );
    }

    state = playMonth(state, {}).state;
  }
});

test("O ESTOURO DO COFRE TEM COR, e so quando a LEITURA e maior que zero", () => {
  /* O cartao dizia "cabe R$ 14,2 bi" e, uma linha abaixo, "ja consome R$ 14,5 bi"
     — no mesmo cinza das outras leituras. Cor e texto contam a mesma historia, e
     aqui o texto contava um estouro e a cor, calmaria.

     ⚠ E O LIMIAR E A LEITURA, e nao o valor cheio: um excesso de 0,04 imprime
     "R$ 0,0 bi", e acender o vermelho ali faz a cor negar o numero ao lado. */
  const state = createState();

  const over = cabinetOf(state, { room: 10, committed: 10.3 });
  assert.ok(over.includes('data-over="true"'), "o estouro nao acendeu");
  assert.ok(over.includes("passa do que cabe"), "o estouro nao foi dito");
  assert.ok(!over.includes("já consome"), "o estouro repetiu o total em vez do excesso");

  /* ⚠ E SO O ESTOURO ACENDE. Com o paragrafo inteiro em vermelho, "obrigatoria
     95%" sai no mesmo tom do deficit e os dois viram contexto — vermelho que cobre
     tudo nao destaca nada. A prova cobra que o trecho aceso NAO carregue a
     obrigatoria junto. */
  const lit = over.slice(over.indexOf('data-over="true"'));
  assert.ok(!lit.includes("obrigatória"), "o vermelho do estouro engoliu o contexto");

  const tight = cabinetOf(state, { room: 10, committed: 10.01 });
  assert.ok(
    !tight.includes('data-over="true"'),
    "um excesso que imprime R$ 0,0 bi acendeu o vermelho mesmo assim",
  );

  const room = cabinetOf(state, { room: 10, committed: 4 });
  assert.ok(!room.includes('data-over="true"'));
  assert.ok(room.includes("já consome"), "sem estouro, o cartao parou de dizer o que foi gasto");
});

/* ── O ZERO ARREDONDADO NAO CARREGA SINAL ──────────────────────────────────────
   ⚠ DEFEITO PEGO NA CAPTURA, e o painel o mostrava havia sessoes: o hiato do
   produto saia "-0,0%" com um valor de -0,0002. `num` so tratava o `-0` EXATO,
   entao qualquer magnitude que arredondasse para zero mantinha o sinal — um numero
   que afirma "negativo" e imprime "zero", lado a lado, na mesma tinta.

   A regra ja existia no projeto e valia so para a COR: "onde a tela mostra zero,
   ela mostra zero nas duas linguagens". Ela passou a valer para o texto tambem. */
test("O ZERO ARREDONDADO E ZERO, e nao um zero com sinal de menos", () => {
  assert.equal(num(-0.0002, 1), "0,0", "uma magnitude que arredonda para zero manteve o sinal");
  assert.equal(num(-0, 1), "0,0");
  assert.equal(num(-0.04, 1), "0,0");
  assert.equal(percent(-0.0002, 1), "0,0%", "o hiato do produto ainda sai negativo");

  /* ⚠ E O QUE NAO ARREDONDA PARA ZERO CONTINUA NEGATIVO. Sem esta metade, a
     correcao viraria a pior versao do defeito que ela conserta — uma tela que
     esconde o sinal de um numero que tem sinal. */
  assert.equal(num(-0.06, 1), "-0,1");
  assert.equal(num(-1.2, 1), "-1,2");
  assert.equal(signed(-0.0002, 1), "0,0", "o sinal explicito discordou do arredondamento");
  assert.equal(signed(-0.6, 0), "−1");
});

/* ── A VARIACAO DE INDICE DECLARA A JANELA QUE MEDIU ───────────────────────────
   ⚠ TRES DEFEITOS NUMA LINHA SO, e todos os tres eram numero inventado na tela.
   O historico da capacidade guarda `lag + 1` valores, e o atraso muda por area:

     · FINANCAS subtraia o valor mais antigo guardado e nao dizia qual janela era.
       A coluna punha 24 meses de Educacao ao lado de 3 de Saude, lidos como
       comparaveis;
     · A TELA DE AREA rotulava tudo como "em 12 meses" e caia no indice de
       ABERTURA quando nao havia doze meses guardados — o que e o caso em SEIS das
       oito areas, sempre;
     · ONDE O ATRASO E ZERO — Fazenda e Previdencia — o historico tem um valor so,
       a subtracao dava zero, e as duas linhas imprimiam `· 0` em toda partida.
       Zero e uma afirmacao, e ela era falsa: o indice andava e ninguem anotava. */
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

  /* ── E AS DUAS TELAS LEEM A MESMA COISA ───────────────────────────────────
     Era este o defeito de fundo: Financas e a tela de area mostravam variacoes
     DIFERENTES para a mesma area, porque cada uma refazia a conta do seu jeito. */
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
    /* Zero de proposito: a divida de 0,78 e exatamente a herdada, e o mercado nao
       cobra pelo pais que o presidente recebeu. */
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
  /* ⚠ ACHADO NA CAPTURA DO PASSEIO em 16/08/2026, e ele e a MESMA familia que
     Financas ja tinha consertado — sobreviveu aqui porque as duas telas escreviam a
     regra cada uma por sua conta.

     `signed` imprime com ZERO casas, e a direcao lia o valor CHEIO: uma variacao de
     +0,4 saía como o texto "0" com `data-direction="up"`, que e verde. A cor
     afirmava uma melhora que o numero ao lado dela negava — e o projeto ja escreveu
     a regra: onde a tela mostra zero, ela mostra zero nas duas linguagens. */
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

  /* E o que a leitura de fato mostra continua tingido — a correcao nao pode apagar
     o sinal de quem tem sinal. */
  const moved = deltaOf([58, 59, 61, 62], 62);
  assert.ok(moved.includes('data-direction="up"'), "uma alta de 4 pontos saiu neutra");
});

/* ── O FECHO DO MANDATO ────────────────────────────────────────────────────────
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ESTAS PROVAS EXISTEM, e o defeito foi achado JOGANDO. O mandato passivo
   cai no mes 46, e a unica noticia disso na tela era um selo de dez pixels no canto
   de um cartao da coluna da direita. O botao AVANCAR O MES continuava aceso, do
   mesmo tamanho e da mesma cor de sempre — clicar nele nao fazia nada e nao
   explicava por que.

   ⚠ E A METADE QUE FALTAVA ERA PIOR QUE A QUE EXISTIA: nada no jogo terminava o
   mandato no PRAZO. Quem atravessasse os quatro anos entrava num "2o mandato" que
   nunca teve eleicao — a barra superior chegava a imprimir isso. As duas saidas sao
   provadas aqui, e a do prazo e a que nenhuma partida jogada teria achado, porque
   nenhum governo mediano atravessa. */

test("O MANDATO ACABA PELAS DUAS PORTAS: a queda e o PRAZO", () => {
  const opening = createState(7);
  assert.equal(termOf(opening).over, false, "o mandato acabou no mes da posse");
  assert.equal(termOf(opening).ending, null, "um mandato que corre ja tinha um desfecho");

  /* A QUEDA. `fallen` e o mes em que o plenario afastou, e ele manda na data do
     fecho — nao o mes corrente. */
  const removed = { ...opening, month: 47, fallen: 46 };
  assert.equal(termOf(removed).over, true, "o presidente caiu e o mandato continuou");
  assert.equal(termOf(removed).ending, "removed");
  assert.equal(termOf(removed).months, 46, "o fecho datou o repaint, e nao o afastamento");

  /* O PRAZO, e ele e a metade que faltava. Ate 18/08/2026 esta linha passaria com
     `over: false`, e o jogo seguiria para um quinto ano. */
  const served = { ...opening, month: MONTHS_PER_TERM };
  assert.equal(termOf(served).over, true, "o mandato passou dos 48 meses e nao acabou");
  assert.equal(termOf(served).ending, "served");

  /* E O ULTIMO MES AINDA E MANDATO. Um limiar escrito com `>` em vez de `>=`
     erraria por um mes para o lado que ninguem ve. */
  const last = { ...opening, month: MONTHS_PER_TERM - 1 };
  assert.equal(termOf(last).over, false, "o ultimo mes do mandato foi dado como acabado");
});

test("O FECHO NAO INVENTA UM NUMERO: tudo que ele mostra vem do estado ou da fonte", () => {
  const state = createState(7);
  const term = termOf(state);

  /* O INDICE DE ABERTURA E O `initial` DO CATALOGO, e nao um numero digitado na
     view. No mes da posse os dois lados da linha tem de ser o MESMO valor — se
     divergirem aqui, o fecho esta lendo de dois lugares. */
  for (const area of term.areas) {
    const source = CATALOG.areas.find(item => item.id === area.id);
    assert.ok(source);
    assert.equal(area.from, source.initial, `${area.id}: o fecho inventou o indice da posse`);
    assert.equal(area.to, area.from, "o mes da posse ja mostrava movimento");
  }

  /* A DIVIDA HERDADA E A DO CATALOGO, com fonte. */
  assert.equal(term.debt.from, CATALOG.fiscal.initialDebtRatio);

  /* ⚠ A APROVACAO DA POSSE E A QUE A SONDA LE DO CATALOGO, e nao um numero escrito
     a mao: um valor digitado seria a segunda verdade sobre com quanta popularidade
     o presidente entrou, e divergiria no dia em que um segmento mudasse. */
  assert.equal(term.approval.from, term.approval.to, "a aprovacao da posse nao e a da SONDA");
});

test("O FECHO SO CREDITA A LEI QUE O JOGADOR ESCREVEU", () => {
  const state = createState(7);
  /* ⚠ A PILHA DE ABERTURA NAO E VAZIA — a posse herda as vinculacoes do pais. Contar
     a pilha inteira daria ao presidente o credito pela Constituicao. */
  assert.ok(state.norms.length > 0, "a partida abriu sem lei nenhuma no pais");
  assert.equal(termOf(state).laws.length, 0, "o fecho creditou a lei herdada ao jogador");

  /* E a norma escrita DEPOIS da posse conta, com o mes em que passou e o nome da
     alavanca que ela move — o jogador escreveu sobre um nome, e nao sobre um id. */
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
  /* ⚠ ESTA PROVA GUARDA UMA DECISAO, e nao um comportamento. `state.mjs` escreveu
     antes de o fecho existir: "a partida JA E um mandato de 48 meses, sem vitoria e
     sem placar, entao fim de jogo nao e o oposto de nada". Um fecho que dramatizasse
     a queda inventaria um objetivo que o jogo nunca teve — e a diferenca entre as
     duas telas tem de caber no carimbo. */
  const opening = createState(7);
  const removed = closingHtml(termOf({ ...opening, month: 47, fallen: 46 }));
  const served = closingHtml(termOf({ ...opening, month: MONTHS_PER_TERM }));

  assert.ok(removed.includes(UI.closing.removed), "o fecho da queda nao carimbou a queda");
  assert.ok(served.includes(UI.closing.served), "o fecho do prazo nao carimbou o prazo");
  assert.ok(!served.includes(UI.closing.removed), "quem cumpriu o mandato foi dado como afastado");

  /* A MESMA FORMA NOS DOIS: mesmas seccoes, mesmo numero de linhas de rubrica. */
  const rows = (/** @type {string} */ html) => html.split('class="closing__row"').length;
  assert.equal(rows(removed), rows(served), "as duas saidas desenharam tabelas diferentes");
  assert.ok(served.includes(UI.closing.country), "o fecho do prazo perdeu o pais que ele entrega");
});

test("AUSENCIA DECLARADA NO FECHO: um mandato sem lei DIZ que nao teve lei", () => {
  /* Regra do projeto, e ela tem lugar aqui: um mandato sem uma lei escrita e um
     FATO sobre o governo, e nao uma falha da tela. Um espaco vazio no lugar da
     lista pareceria defeito — e o passivo, que e uma partida inteira valida, e
     exatamente quem cai nesse caso. */
  const empty = closingHtml(termOf({ ...createState(7), month: MONTHS_PER_TERM }));
  assert.ok(empty.includes(UI.closing.noLaws), "o mandato sem lei nenhuma nao disse isso");
  assert.ok(!empty.includes("closing__laws"), "a lista de leis nasceu vazia em vez de ausente");
});

/* ── O CERCO FALANDO ──────────────────────────────────────────────────────────
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ESTAS PROVAS EXISTEM, e o achado foi MEDIDO e nao visto. Contadas as
   cartas que chegam em 46 meses, por politica:

     passivo        media 0,0 por mes   ← e o processo de impeachment abre no 43
     paga a base    media 0,3
     corta tudo     media 3,5

   A caixa nunca esteve quebrada: ela responde ao que o jogador FAZ, e quem nao
   legisla nao recebe correspondencia de tramitacao. O que faltava era o mundo
   escrever quando o mundo se mexe SOZINHO — o pais desmoronava com a aprovacao em
   13%, dois grupos fora do governo e a Camara reunida, e a unica noticia disso era
   uma barra num cartao da coluna da direita. */

test("O REMETENTE EXISTE: a carta da Casa Civil e assinada", () => {
  /* ⚠ ESTE DEFEITO ATRAVESSOU CINCO SESSOES SEM SER VISTO, e ele estava na PRIMEIRA
     carta do jogo. A view procurava `office === "chief-of-staff"` e o elenco produz
     `office === "chief"` — `chief-of-staff` e o ARQUETIPO, e nao o cargo. A busca
     devolvia `undefined`, `letterHtml` aceita remetente nulo de proposito (a gaveta
     nao tem remetente), e a carta de posse saía sem sigilo, sem nome e sem cargo.

     Nada podia ver: o tipo permite nulo, a guarda nao lê elenco, e a captura mostra
     uma carta que PARECE inteira — o que falta nela e um bloco que voce so procura
     se souber que ele deveria estar la. */
  const state = createState(7);
  const government = governmentOf(state, CATALOG);
  const chief = government.people.find(person => person.office === "chief");
  assert.ok(chief, "o elenco nao tem chefe da Casa Civil no cargo que a view procura");

  const posse = mailHtml({
    mail: state.mail,
    people: government.people,
    left: () => null,
    inherited: { mandatory: 2166, room: 14.5 },
    answered: {},
    lobbies: CATALOG.lobbies,
  }).join("");
  assert.ok(posse.includes(chief.name), "a carta de posse chegou sem quem a assinou");
});

test("O CERCO ESCREVE, e ele nao inventa nenhum dos dois numeros", () => {
  const state = createState(7);
  const government = governmentOf(state, CATALOG);
  const boiler = boilerOf(state, CATALOG);

  /** @param {import("../../src/state/state.mjs").Letter[]} mail */
  const render = mail =>
    mailHtml({
      mail,
      people: government.people,
      left: () => null,
      inherited: { mandatory: 2166, room: 14.5 },
      answered: {},
      lobbies: CATALOG.lobbies,
      siege: boiler,
    }).join("");

  const siege = render([alarm({ kind: "siege", id: "siege", subject: "siege", month: 40 })]);
  assert.ok(siege.includes(UI.inbox.siegeSubject), "o processo abriu e a carta nao dizia isso");

  /* ⚠ OS DOIS NUMEROS SAO DO MOTOR. `342 de 513` e a CF art. 86 e `3×` e o preco do
     cerco: escritos a mao na view, mentiriam no dia em que qualquer um mudasse, e
     essa e a familia de defeito mais cara deste projeto. A prova le o motor e cobra
     o que a tela imprimiu. */
  assert.ok(siege.includes(String(boiler.removal)), "a carta nao citou o quorum do afastamento");
  assert.ok(siege.includes(String(boiler.seats)), "a carta nao citou o tamanho da Camara");
  assert.ok(siege.includes(`${boiler.price}×`), "a carta nao citou o preco da cadeira no cerco");

  /* E ELA APONTA PARA ONDE A JOGADA ACONTECE. O cerco e aviso e nao pergunta — a
     resposta se da comprando cadeira, e nao clicando na carta. */
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
  /* ⚠ O RISCO AQUI E A INFLACAO, e nao a ausencia. Um aviso por MES de ruptura
     aberta empilharia trinta cartas identicas ate o plenario votar — que e
     exatamente o mural que a caixa deixou de ser em 16/08/2026. Medido num mandato
     passivo inteiro: tres rupturas e um cerco, e nem uma a mais. */
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
  /* ⚠ ACHADO NA CAPTURA em 18/08/2026, e ele e da familia mais cara deste projeto —
     a tela afirmando o oposto do que o turno faz. A frase era "promete R$ 13,8 bi ·
     nao cabe — o rateio vai cortar R$ 13,7 bi", e o numero ao lado do verbo CORTAR e
     `room`: o que CABE. Lida ao pe da letra, ela anunciava um corte de quase tudo num
     mes em que o corte era de um decimo de bilhao.

     A prova nao cobra o texto: ela cobra que o valor impresso seja o que o motor
     chama de espaco, e que o verbo diga isso. */
  /* `mesaOf` ja monta a Mesa como o entrypoint monta, com `demand` de 15,75 contra
     um espaco menor — ou seja, exatamente o caso em que a frase aparece. */
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
  /* ⚠ ACHADO NA CAPTURA em 18/08/2026. `labelOf` devolve a chave quando nao acha a
     entrada, e isso e DELIBERADO: um instrumento digitado errado no catalogo tem de
     aparecer na tela em vez de sumir calado. O efeito colateral e que uma entrada
     ESQUECIDA imprime o id, e os ids deste projeto sao em ingles — a linha da pauta
     saía "CANETA · Saúde · budget · resultado −26,5/ano".

     A prova varre os dois mapas contra todos os instrumentos que o jogo produz, e
     nao contra uma lista escrita aqui: uma lista propria envelheceria junto com o
     esquecimento que ela existe para pegar. */
  const instruments = new Set(CATALOG.bills.map(bill => bill.instrument));
  /* `budget` nao mora em `bills.mjs`: ele e a execucao do orcamento, que nao vai a
     plenario e por isso nao e catalogo de pauta. Ele entra aqui porque a TELA o
     mostra, que e o que este arquivo prova. */
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
