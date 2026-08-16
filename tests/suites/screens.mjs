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
import {
  chamberOf,
  discretionaryRoom,
  ledger,
  lockedBy,
  playMonth,
  settlement,
  situationOf,
} from "../../src/application/turn.mjs";
import { createState } from "../../src/state/state.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { areaHtml } from "../../src/ui/screens/area.mjs";
import { financeHtml } from "../../src/ui/screens/finance.mjs";
import { num, percent, signed } from "../../src/ui/shared/format.mjs";
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

  return areaHtml({
    area,
    value,
    history: state.capacity.history[area.id] ?? [],
    programs: PROGRAMS.filter(program => program.area === area.id),
    levels: { ...state.levels, ...levels },
    spent,
    room: discretionaryRoom(state),
    committed: 3.25,
    projected: value - area.decay + area.yield * spent,
    idle: value - area.decay,
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
