/* ENTRYPOINT — composicao e wiring, e nada mais.
   ══════════════════════════════════════════════════════════════════════════════
   Este arquivo nao calcula nada e nao formata nada. Ele liga o estado as views e
   as views ao documento. `tests/guards/boundaries.mjs` prova que ele so importa
   de `src/state/`, `src/public/` e `src/ui/` — e a razao e concreta: no projeto
   anterior o entrypoint nasceu como wiring, foi acumulando regra, e virou 1.715
   linhas que uma etapa inteira de refatoracao nao conseguiu desmontar.

   ── AS TRES COISAS QUE ELE GUARDA ────────────────────────────────────────────
     `state`   o jogo, imutavel, so trocado pelo turno resolvido;
     `screen`  onde o jogador esta — a mesa ou uma area;
     `orders`  o que ele montou para ESTE mes e ainda nao executou.

   `orders` e a unica coisa mutavel aqui, e ela e mutavel de proposito: e rascunho
   de interface, e nao estado de jogo. Ela vira estado no instante em que o mes e
   executado, e nao antes — e por isso arrastar um controle nao muda nada no
   modelo, so na intencao.

   ── POR QUE HA DUAS PINTURAS ─────────────────────────────────────────────────
   `paint` redesenha; `refresh` so atualiza os numeros derivados. A segunda existe
   por uma razao de GESTO: trocar o HTML de um `<input type=range>` no meio de um
   arrasto arranca o elemento que o ponteiro esta segurando, e o arrasto morre no
   primeiro pixel. Entao enquanto o controle e movido, so as leituras trocam. */

import { createState } from "./src/state/state.mjs";
import { deserialize, serialize } from "./src/state/save.mjs";
import {
  CATALOG,
  NEUTRAL,
  pollFrom,
  THRESHOLDS,
  SEATS,
  SIMPLE_MAJORITY,
  dispersion,
  ledger,
  playMonth,
  settlement,
  situationOf,
  whipCount,
  compose,
} from "./src/public/index.mjs";
import { railNavHtml } from "./src/ui/shared/rail.mjs";
import {
  areaHtml,
  estadoHtml,
  lawReadHtml,
  outlookHtml,
  poolHtml,
  programReadHtml,
  riteOf,
} from "./src/ui/screens/area.mjs";
import { benchReadHtml, capacityStripHtml, mesaHtml, tallyHtml } from "./src/ui/screens/mesa.mjs";
import { financeHtml } from "./src/ui/screens/finance.mjs";
/* A APROVACAO VOLTOU. Ela esteve fora da tela por tres sessoes com esta razao
   escrita aqui: "quem a produz e SONDA, que nao existe". Em 14/08/2026 o motor
   nasceu, e o numero passou a se mover quando o mes e resolvido de verdade —
   que era a unica condicao. */
import { turnHtml, verdictHtml, vitalsHtml } from "./src/ui/screens/dashboard.mjs";
import { cabinetHtml } from "./src/ui/screens/cabinet.mjs";
import { noticeHtml, reportPanelHtml } from "./src/ui/screens/report.mjs";
import { UI } from "./src/ui/strings.mjs";

/** @typedef {import("./src/state/state.mjs").GameState} GameState */
/** @typedef {import("./src/public/index.mjs").Orders} Orders */
/** @typedef {import("./src/public/index.mjs").Report} Report */

const el = {
  railNav: must("railNav"),
  turn: must("turn"),
  vitals: must("vitals"),
  main: must("main"),
  advance: /** @type {HTMLButtonElement} */ (must("advance")),
  restart: must("restart"),
  /* O `<dialog>` FICOU, E ENCOLHEU DE PAPEL: ele carregava o relatorio do mes e
     agora carrega so o AVISO. A distincao e de natureza — informacao que se
     consulta e painel, interrupcao porque algo deu errado e modal. */
  dialog: /** @type {HTMLDialogElement} */ (must("noticeDialog")),
  noticeSlot: must("noticeSlot"),
  noticeClose: must("noticeClose"),
};

/** @param {string} id */
function must(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`elemento #${id} nao existe no documento`);
  return node;
}

/* ── A PARTIDA ATRAVESSA O NAVEGADOR FECHADO ────────────────────────────────
   `serialize` e `deserialize` existem e sao provados desde a terceira sessao, e
   nenhuma linha os chamava: fechar a aba perdia o mandato inteiro.

   O ACESSO AO ARMAZENAMENTO MORA AQUI, no entrypoint, e nao em `src/state/`.
   A serializacao e pura e testavel em Node; o armazenamento e efeito de
   navegador, e a guarda de fronteiras existe para manter os dois separados.

   TUDO ENVOLVIDO EM `try`: aba anonima, cota estourada e armazenamento
   desligado por politica sao rotina, e nenhuma delas pode derrubar o jogo. Quem
   nao consegue guardar joga assim mesmo — o que nao pode e travar na abertura. */
const SAVE_KEY = "planalto:partida";
const REFUSED_KEY = "planalto:partida-recusada";

function persist() {
  try {
    window.localStorage.setItem(SAVE_KEY, serialize(state));
  } catch {
    /* Sem lugar para guardar. A partida continua na memoria. */
  }
}

/**
 * A partida guardada, ou nada — e o motivo fica guardado junto quando ela e
 * recusada, para o jogador nao ver o mandato sumir sem explicacao.
 *
 * @returns {{ state: GameState, refused: boolean }}
 */
function resume() {
  let text = null;
  try {
    text = window.localStorage.getItem(SAVE_KEY);
  } catch {
    return { state: createState(), refused: false };
  }
  if (!text) return { state: createState(), refused: false };

  const read = deserialize(text);
  if (read.ok) return { state: read.state, refused: false };

  /* O SAVE RECUSADO NAO E APAGADO. Ele muda de chave e fica: uma versao futura
     pode saber converte-lo, e apagar o mandato de alguem para limpar uma chave
     de armazenamento e a decisao mais barata de tomar e a mais cara de sofrer. */
  try {
    window.localStorage.setItem(REFUSED_KEY, text);
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    /* Se nem isso for possivel, comecar de novo ainda e o certo. */
  }
  return { state: createState(), refused: true };
}

const opening = resume();

let state = opening.state;
let screen = "cabinet";
let orders = blankOrders();

/* O ULTIMO MES RESOLVIDO, com o que ele precisa para se comparar com o mes
   anterior. Ele NAO e estado de jogo e nao entra no save: e a memoria de uma
   tela, e uma partida retomada comeca sem relatorio anterior porque de fato nao
   houve um nesta sessao. */
/** @type {{ report: Report, quorum: number, loyaltyBefore: Record<string, number>,
 *           indexBefore: Record<string, number> } | null} */
let last = null;

/* AS ORDENS DE UM MES QUE AINDA NAO COMECOU.
   ⚠ OS NIVEIS NASCEM NOS VIGENTES, e nao em zero — e a diferenca entre as duas
   leituras e o jogo inteiro. Zerados, "nao mexi em nada" significaria "quero o
   Estado desligado", e o primeiro `avancar` sem tocar em nada desmontaria o pais.
   Nos vigentes, nao mexer significa manter — que e o que nao mexer quer dizer. */
function blankOrders() {
  return {
    /** @type {Record<string, number>} */
    funding: Object.fromEntries(CATALOG.parties.map(party => [party.id, 0])),
    /** @type {Record<string, number>} */
    levels: { ...state.levels },
    /* AS LEIS TAMBEM NASCEM NAS VIGENTES, e pelo mesmo motivo dos niveis: o
       rascunho comeca no pais como ele e. Nascer vazio faria "nao mexi em nada"
       significar "revogo tudo", e o primeiro `avancar` sem tocar em nada seria a
       maior desregulamentacao da historia do jogo. */
    /** @type {Record<string, import("./src/state/state.mjs").Band>} */
    bands: Object.fromEntries(Object.entries(state.bands).map(([id, band]) => [id, { ...band }])),
  };
}

/* ── O QUE A TELA PRECISA SABER, derivado e nunca guardado ────────────────── */

/* A PAUTA NAO E MAIS ESCOLHIDA — ELA E COMPOSTA. O que esta em pauta e o que o
   jogador escreveu no orcamento neste mes, e nada mais: se ele nao moveu nenhum
   controle, nao ha pauta, e a Mesa diz isso em vez de inventar uma. */
function agendaNow() {
  return compose({
    programs: CATALOG.programs,
    rules: CATALOG.rules,
    levels: state.levels,
    requested: orders.levels,
    power: state.levels["poder-do-executivo"] ?? 0,
    bands: state.bands,
    requestedBands: orders.bands,
  });
}

/**
 * A PREVISAO AO VIVO, e ela vota com a verba que o caixa HONRA.
 *
 * Nao com a prometida, e a diferenca so aparece no caso que importa: enquanto a
 * promessa cabe no mes, as duas sao a mesma coisa; quando ela estoura, o rateio
 * corta — e prever com o prometido faria a Mesa anunciar "acima do quorum" numa
 * votacao que o corte derruba. Quem faz a conta e a camada de aplicacao, a mesma
 * que o turno vai chamar.
 *
 * @param {Record<string, number>} paid
 * @param {import("./src/application/agenda.mjs").Agenda} agenda
 */
function forecastNow(paid, agenda) {
  if (!agenda.proposal || agenda.quorum === 0) return null;
  return whipCount({
    bill: agenda.proposal,
    parties: CATALOG.parties,
    funding: paid,
    loyalty: state.loyalty,
  });
}

function mesaInput() {
  const share = settlement(state, orders, CATALOG);
  const agenda = agendaNow();
  const bill = agenda.proposal;

  return {
    bill,
    areaLabel: CATALOG.areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: agenda.quorum,
    parties: CATALOG.parties,
    loyalty: state.loyalty,
    /* A LINHA DA BANCADA MOSTRA A PROMESSA — a fracao e o custo do que o jogador
       ofereceu, que e o que ele controla. Os VOTOS ao lado saem do que sera
       pago. Sob corte, os dois divergem na mesma linha, e essa divergencia e a
       licao central do jogo: promessa nao move voto. A linha de caixa embaixo
       diz por que, com o numero. */
    funding: orders.funding,
    forecast: forecastNow(share.paid, agenda),
    band: dispersion({ parties: CATALOG.parties, loyalty: state.loyalty }),
    seatPrice: CATALOG.fiscal.seatPrice,
    room: share.room,
    demand: share.demand,
    thresholds: THRESHOLDS,
  };
}

/**
 * O PLACAR, e ele nao decide nada — por isso e o unico input que nao olha para
 * `orders.funding` nem para nivel nenhum por conta propria: tudo o que o mes
 * corrente ja comprometeu chega dentro do `ledger`, que faz a conta do turno.
 */
function financeInput() {
  const { budget, interest, debt, debtRatio } = ledger(state, orders, CATALOG);

  return {
    macro: state.macro,
    budget,
    interest,
    debt,
    debtRatio,
    series: state.series,
    target: CATALOG.macro.inflationTarget,
    areas: CATALOG.areas,
    index: state.capacity.index,
    history: state.capacity.history,
  };
}

/**
 * O GABINETE — quatro resumos, e nenhum controle. Tudo o que ele mostra ja existe
 * em outra tela; o que ele faz e reunir e apontar para onde a decisao mora.
 *
 * @param {{ level: string, reason: string, base: number }} current
 */
function cabinetInput(current) {
  const { budget } = ledger(state, orders, CATALOG);
  const share = settlement(state, orders, CATALOG);

  return {
    situation: current.level,
    verdict: verdictHtml(current.reason),
    base: current.base,
    seats: SEATS,
    majority: SIMPLE_MAJORITY,
    room: share.room,
    committed: share.demand,
    mandatory: budget.mandatory,
    revenue: budget.revenue,
    segments: CATALOG.segments,
    street: pollBySegment(),
  };
}

/** A pesquisa de cada segmento, que e o que o termometro da rua desenha. */
function pollBySegment() {
  /** @type {Record<string, import("./src/public/index.mjs").Approval>} */
  const byId = {};
  for (const segment of CATALOG.segments) {
    /* UM SEGMENTO DE CADA VEZ, com a fatia dele valendo o pais inteiro: e assim
       que `pollFrom` devolve a leitura daquele grupo isolado, sem a media. */
    byId[segment.id] = pollFrom(
      { [segment.id]: state.mood[segment.id] ?? segment.initial },
      [{ ...segment, share: 1 }],
      CATALOG.opinion,
    );
  }
  return byId;
}

/**
 * @param {import("./src/public/index.mjs").Area} area
 */
function areaInput(area) {
  const value = state.capacity.index[area.id] ?? area.initial;
  const share = settlement(state, orders, CATALOG);
  const spent = share.asked[area.id] ?? 0;

  /* A PROJECAO E A MESMA CONTA DO MOTOR, e nao uma aproximacao escrita aqui. Ela
     e curta o bastante para caber numa linha e importante o bastante para nao
     divergir: se a tela prometer +2 e o turno entregar +1,4, o jogador para de
     acreditar no controle. */
  const project = (/** @type {number} */ spent) =>
    Math.min(100, Math.max(0, value - area.decay + area.yield * spent));

  return {
    area,
    value,
    history: state.capacity.history[area.id] ?? [],
    programs: CATALOG.programs.filter(program => program.area === area.id),
    levels: orders.levels,
    spent,
    room: share.room,
    /* O QUE JA FOI COMPROMETIDO FORA DAQUI: a demanda do mes inteira menos o que
       esta area esta consumindo. Ela inclui a emenda para o Congresso, e tinha de
       incluir — a bolsa e uma so, e e isso que faz mover um controle aqui
       significar nao mover outro em outra area. */
    committed: share.demand - spent,
    projected: project(spent),
    idle: project(0),
    bands: state.bands,
    requestedBands: orders.bands,
  };
}

/* ── PINTURA ──────────────────────────────────────────────────────────────── */

/** @type {GameState | null} */
let painted = null;

/** A posicao do governo na ultima pintura, para saber o que repintar.
 * @type {{ level: string, reason: string, base: number } | null} */
let standing = null;

function paint() {
  const current = situationOf(state, CATALOG);

  el.railNav.innerHTML = railNavHtml(screen, CATALOG.areas);

  /* CADA VIEW TRAZ O PROPRIO ELEMENTO DE FORA, e o entrypoint so concatena. A
     versao anterior montava aqui a `<div class="mesa">` que embrulha a tela — e
     isso e decisao de forma escrita no arquivo que nao pode ter nenhuma: quem
     desenha a Mesa passaria a ter de lembrar que a lamina dela mora no
     entrypoint. */
  const area = CATALOG.areas.find(item => item.id === screen);
  if (screen === "estado") {
    el.main.innerHTML = estadoHtml({ rules: CATALOG.rules, levels: orders.levels });
    el.main.dataset["screen"] = "estado";
  } else if (screen === "finance") {
    /* FINANCAS NAO ENTRA EM `refresh`, e e a unica tela assim junto do Gabinete.
       Nenhuma das duas tem controle para o arrasto proteger — quando um numero
       delas muda, e porque o mes virou ou porque o jogador mexeu em OUTRA tela, e
       nos dois casos a pintura inteira ja aconteceu. */
    el.main.innerHTML = financeHtml(financeInput());
    el.main.dataset["screen"] = "finance";
  } else if (area) {
    el.main.innerHTML = areaHtml(areaInput(area));
    el.main.dataset["screen"] = "area";
  } else if (screen === "congress") {
    /* O CONGRESSO E A ANTIGA MESA, e a peca de dentro continua se chamando mesa
       porque ela E uma mesa de negociacao. O que mudou foi o endereco: ela deixou
       de ser a tela inicial e passou a ser o lugar onde se negocia — e o resumo
       do mes, que dividia a tela com ela, virou o Gabinete. */
    el.main.innerHTML =
      capacityStripHtml({
        areas: CATALOG.areas,
        index: state.capacity.index,
        history: state.capacity.history,
      }) +
      mesaHtml(mesaInput()) +
      reportPanelHtml(
        last && {
          report: last.report,
          quorum: last.quorum,
          parties: CATALOG.parties,
          areas: CATALOG.areas,
          loyaltyBefore: last.loyaltyBefore,
          indexBefore: last.indexBefore,
        },
      );
    el.main.dataset["screen"] = "congress";
  } else {
    el.main.innerHTML = cabinetHtml(cabinetInput(current));
    el.main.dataset["screen"] = "cabinet";
  }

  /* RENDER POR IDENTIDADE DE REFERENCIA na barra superior. Como o estado e
     imutavel, `anterior.month !== atual.month` responde "esta parte mudou?" com
     uma comparacao direta — sem diff de arvore e sem framework.

     ⚠ A BARRA SUBSTITUIU O RAIL DA DIREITA, e com ele foram embora a faixa de
     contexto e o veredito: os tres campos daquela faixa viraram dois vitais
     (base e aprovacao) e o Gabinete. O que sobrou aqui e a data e os quatro
     numeros, e a regra e a mesma de antes — repinta so o que mudou. */
  const previous = painted;
  const before = standing;

  if (!previous || previous.month !== state.month) {
    el.turn.innerHTML = turnHtml(state);
  }

  if (!previous || previous !== state) {
    const poll = pollFrom(state.mood, CATALOG.segments, CATALOG.opinion);
    const past = previous ? previous : state;
    el.vitals.innerHTML = vitalsHtml({
      macro: state.macro,
      approval: poll.good,
      base: current.base,
      majority: SIMPLE_MAJORITY,
      before: {
        gdp: past.macro.gdp,
        inflation: past.macro.inflation,
        approval: pollFrom(past.mood, CATALOG.segments, CATALOG.opinion).good,
        base: standing?.base ?? current.base,
      },
    });
  }

  if (before?.reason !== current.reason) {
    document.documentElement.style.setProperty("--situation-tint", `var(--${current.level})`);
  }

  painted = state;
  standing = current;
}

/** So os numeros derivados, para o arrasto sobreviver. */
function refresh() {
  if (el.main.dataset["screen"] === "congress") {
    const input = mesaInput();
    const tally = document.getElementById("tally");
    if (tally) tally.innerHTML = tallyHtml(input);

    for (const party of CATALOG.parties) {
      const slot = el.main.querySelector(`[data-read="${party.id}"]`);
      if (!slot) continue;
      slot.innerHTML = benchReadHtml({
        party,
        funding: orders.funding[party.id] ?? 0,
        votes: input.forecast?.parties.find(item => item.partyId === party.id)?.votes ?? 0,
        seatPrice: input.seatPrice,
        voting: input.quorum > 0 && input.forecast !== null,
      });
    }
    return;
  }

  /* A TELA DO ESTADO REPINTA SO AS LINHAS, como a area — e pelo mesmo motivo de
     gesto. Ela nao tem bolsa nem projecao: alavanca de regra nao consome caixa. */
  if (el.main.dataset["screen"] === "estado") {
    for (const rule of CATALOG.rules) {
      const level = orders.levels[rule.id] ?? rule.initial;
      const slot = el.main.querySelector(`[data-read="${rule.id}"]`);
      if (slot) slot.innerHTML = programReadHtml({ program: rule, level });
      const dial = el.main.querySelector(`.dial:has([data-program="${rule.id}"])`);
      if (dial instanceof HTMLElement) dial.dataset["rite"] = riteOf(rule, level);
    }
    return;
  }

  const area = CATALOG.areas.find(item => item.id === screen);
  if (!area) return;
  const input = areaInput(area);

  /* TRES LEITURAS SE REPINTAM, e nenhuma delas contem o controle: a linha de cada
     programa, a bolsa do mes e a projecao do indice. O `<input type=range>` fica
     de fora das tres — trocar o HTML dele no meio de um arrasto arranca o
     elemento que o ponteiro esta segurando, e o arrasto morre no primeiro pixel. */
  for (const program of input.programs) {
    const band = orders.bands[program.id];
    const slot = el.main.querySelector(`[data-read="${program.id}"]`);
    if (slot) {
      slot.innerHTML = programReadHtml({
        program,
        level: orders.levels[program.id] ?? program.initial,
        band,
      });
    }

    /* A LEITURA DA LEI SE REPINTA JUNTO, e ela e a outra metade da mesma decisao:
       mover o piso muda o que a linha do orcamento acima cobra. As duas leituras
       trocam no mesmo quadro, e nenhum dos dois controles e reconstruido. */
    const law = el.main.querySelector(`[data-law="${program.id}"]`);
    if (law && band) {
      law.innerHTML = lawReadHtml({ program, band: state.bands[program.id] ?? band, asked: band });
    }

    const row = el.main.querySelector(`.law:has([data-band="${program.id}"])`);
    if (row instanceof HTMLElement && band) {
      const now = state.bands[program.id];
      row.dataset["moved"] = String(
        now !== undefined && (band.floor !== now.floor || band.ceiling !== now.ceiling),
      );
    }
  }

  /* O RITO DA LINHA MORA NO PAI DO CONTROLE, e nao na leitura: e ele que tinge a
     faixa inteira quando o jogador atravessa o piso. Repintar o pai destruiria o
     controle, entao o que se troca e o atributo. */
  for (const program of input.programs) {
    const dial = el.main.querySelector(`.dial:has([data-program="${program.id}"])`);
    if (dial instanceof HTMLElement) {
      dial.dataset["rite"] = riteOf(
        { ...program, ...(orders.bands[program.id] ?? {}) },
        orders.levels[program.id] ?? program.initial,
      );
    }
  }

  const pool = document.getElementById("areaPool");
  if (pool) pool.innerHTML = poolHtml(input);

  const outlook = document.getElementById("areaOutlook");
  if (outlook) outlook.innerHTML = outlookHtml(input);
}

/* ── OS GESTOS ────────────────────────────────────────────────────────────── */

/**
 * A troca de tela passa pela View Transition quando ela existe, e degrada para
 * uma pintura direta quando nao — o `?.` e a degradacao inteira.
 *
 * O `depois` existe por causa do relatorio: abrir um modal no meio da transicao
 * poe um cartao na camada superior enquanto o que esta atras dele ainda esta
 * sendo trocado, e o resultado lê como duas telas discutindo. Ele espera a
 * transicao terminar — e no navegador sem transicao, roda em seguida.
 *
 * @param {() => void} [depois]
 */
function transition(depois) {
  const start = document.startViewTransition?.bind(document);
  if (!start) {
    paint();
    depois?.();
    return;
  }
  start(paint).finished.then(() => depois?.());
}

document.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const section = target.closest("[data-section]");
  if (section instanceof HTMLElement && section.dataset["section"]) {
    screen = section.dataset["section"];
    transition();
    return;
  }

  /* O BOTAO "PAUTAR" SUMIU, e com ele o gesto que levava a Mesa. Nao ha mais o
     que escolher: a pauta e o que o orcamento ficou, e ela existe no instante em
     que um controle sai do lugar. Quem quiser ver o placar vai a Mesa pelo rail,
     como vai a qualquer outra tela. */
});

document.addEventListener("input", event => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const party = target.dataset["party"];
  if (party) {
    orders.funding[party] = Number(target.value) / 100;
    refresh();
    return;
  }

  /* O CONTROLE DE PROGRAMA E O UNICO GESTO DA AREA. Ele nao pede confirmacao e
     nao trava em piso nenhum: arrastar abaixo da lei e permitido, e o que muda e
     o rito que a linha passa a anunciar. */
  const program = target.dataset["program"];
  if (program) {
    orders.levels[program] = Number(target.value);
    refresh();
    return;
  }

  /* ── MOVER UMA LEI ──────────────────────────────────────────────────────────
     O mesmo gesto do controle de verba, e de propósito: mudar quanto se gasta e
     mudar quanto a lei obriga a gastar são o mesmo movimento com preços
     diferentes. O que muda é onde o número cai — em `levels` ou em `bands` — e o
     preço aparece sozinho na Mesa, porque `compose` lê os dois.

     ⚠ O PISO NÃO É TRAVADO PELO TETO, e a ausência de trava é a doutrina do
     projeto: uma faixa invertida é um texto absurdo, e texto absurdo se derrota no
     plenário — não se impede no controle. */
  const band = target.dataset["band"];
  const side = target.dataset["side"];
  if (band && (side === "floor" || side === "ceiling")) {
    const current = orders.bands[band] ?? state.bands[band];
    if (current) orders.bands[band] = { ...current, [side]: Number(target.value) };
    refresh();
  }
});

/* ── O MES E REPETIVEL, E O QUE O SEGURA E O JOGO ───────────────────────────
   Nao ha mais confirmacao entre um mes e o seguinte: quem quiser atravessar dez
   meses sem decidir nada atravessa, e chega do outro lado com a base obstruindo
   — a lealdade decai 1,5 ao mes e nao perdoa desatencao. Cobrar um clique de
   "entendi" para proteger o jogador dele mesmo e regra artificial, que e
   exatamente o que este jogo recusa.

   O TRAVAMENTO NAO E RITMO, E CORRECAO. `playMonth` e sincrono, mas a pintura
   passa por View Transition e a promessa dela demora alguns quadros; dois
   cliques dentro dessa janela resolveriam DOIS meses sobre o MESMO estado, e o
   segundo relatorio descreveria um mundo que ninguem viu. O botao desliga
   enquanto a transicao corre e volta quando ela termina. */
let resolving = false;

el.advance.addEventListener("click", () => {
  if (resolving) return;
  resolving = true;
  el.advance.disabled = true;

  /* O ESTADO DE ANTES FICA GUARDADO porque o relatorio compara: lealdade e
     indice sao valores de agora, e "de 70 para 72" e uma informacao que nenhum
     dos dois carrega sozinho. O turno devolve o depois; o antes so existe aqui,
     no instante anterior a troca. */
  const before = state;
  const played = playMonth(state, orders, { catalog: CATALOG });
  state = played.state;

  last = {
    report: played.report,
    /* O QUORUM VEM DA PAUTA COMPOSTA, e ele nao precisa mais ser recalculado: o
       turno ja o decidiu quando compos a proposta, e refazer a conta aqui seria a
       tela produzindo um segundo numero para a mesma pergunta. */
    quorum: played.report.agenda.quorum,
    loyaltyBefore: before.loyalty,
    indexBefore: before.capacity.index,
  };

  /* O RASCUNHO MORRE COM O MES. Carregar a verba do mes passado para o proximo
     faria o jogador pagar de novo sem ter decidido — e o motor cobraria, porque
     ele nao sabe distinguir promessa nova de promessa esquecida na tela. */
  orders = blankOrders();
  persist();
  transition(() => {
    resolving = false;
    el.advance.disabled = false;
  });
});

el.noticeClose.addEventListener("click", () => el.dialog.close());

/**
 * O AVISO — a unica coisa que ainda interrompe.
 *
 * `showModal()` entrega foco, inercia do fundo, Escape e camada superior. Nada
 * disso e escrito aqui — e essa e a diferenca entre o padrao nativo e a versao
 * manual, que no projeto anterior custou uma sessao inteira de correcao de
 * acessibilidade e tres regras permanentes de documentacao.
 *
 * O relatorio do mes saiu daqui de proposito: ele e informacao que se consulta,
 * e informacao consultavel nao trava o fundo. Um aviso trava porque algo deu
 * errado e continuar sem ler seria continuar no escuro.
 *
 * @param {string} title
 * @param {string} body
 */
function openNotice(title, body) {
  el.noticeSlot.innerHTML = noticeHtml({ title, body });
  el.dialog.showModal();
}

/* ── RECOMECAR, EM DOIS PASSOS ──────────────────────────────────────────────
   O botao apaga um mandato e mora ao lado de um que se aperta toda hora. O
   primeiro clique so troca o proprio rotulo; o segundo executa. E a confirmacao
   expira sozinha, porque um botao que fica armado indefinidamente e uma
   armadilha esperando o proximo clique distraido. */
let arming = 0;

function disarm() {
  arming = 0;
  label(el.restart, UI.actions.restart, UI.actions.restartHint);
}

el.restart.addEventListener("click", () => {
  if (arming === 0) {
    arming = window.setTimeout(disarm, 5000);
    label(el.restart, UI.actions.restartConfirm, UI.actions.restartConfirmHint);
    return;
  }

  window.clearTimeout(arming);
  arming = 0;
  state = createState();
  last = null;
  orders = blankOrders();
  screen = "cabinet";
  painted = null;
  standing = null;
  disarm();
  persist();
  transition();
});

/* O ponto neutro e do catalogo e nao da tela; ele chega aqui so para a faixa de
   indices saber onde fica a linha d'agua. */
document.documentElement.style.setProperty("--neutral", String(NEUTRAL));

/**
 * O TEXTO DOS BOTOES SAI DO ARQUIVO DE TEXTOS, e nao do documento. O `<button>`
 * no HTML e a caixa; a frase e dado de interface, e frase escrita em dois
 * lugares e frase que diverge no primeiro ajuste.
 *
 * `textContent` e nao `innerHTML`: nao ha marcacao nenhuma nestes textos, e
 * montar o filho pelo DOM dispensa escapar qualquer coisa.
 *
 * @param {HTMLElement} node
 * @param {string} text
 * @param {string} hint
 */
function label(node, text, hint) {
  node.textContent = text;
  const small = document.createElement("span");
  small.className = "action__hint";
  small.textContent = hint;
  node.append(small);
}

label(el.advance, UI.actions.advance, UI.actions.advanceHint);
label(el.restart, UI.actions.restart, UI.actions.restartHint);
el.noticeClose.textContent = UI.actions.close;

paint();

/* O AVISO VEM DEPOIS DA PRIMEIRA PINTURA, e nao antes: um dialogo modal sobre
   uma tela em branco nao diz de onde ele veio. */
if (opening.refused) openNotice(UI.save.refusedTitle, UI.save.refusedBody);
