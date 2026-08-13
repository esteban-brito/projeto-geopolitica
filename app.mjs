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
import {
  CATALOG,
  NEUTRAL,
  THRESHOLDS,
  dispersion,
  playMonth,
  quorumOf,
  settlement,
  whipCount,
} from "./src/public/index.mjs";
import { railNavHtml } from "./src/ui/shared/rail.mjs";
import { allotReadHtml, areaHtml } from "./src/ui/screens/area.mjs";
import { benchReadHtml, capacityStripHtml, mesaHtml, tallyHtml } from "./src/ui/screens/mesa.mjs";
/* A APROVACAO SAIU DA TELA, e a omissao e deliberada. Quem a produz e SONDA, que
   nao existe: o numero nao se move quando o mes e resolvido de verdade. Um
   indicador congelado em 31% ao lado de controles que funcionam ensina o jogador
   a desconfiar de todos os numeros da tela — que e mais caro do que a ausencia.
   Ela volta com o motor. */
import { contextHtml, turnHtml, verdictHtml } from "./src/ui/screens/dashboard.mjs";

/** @typedef {import("./src/state/state.mjs").GameState} GameState */
/** @typedef {import("./src/public/index.mjs").Orders} Orders */

const el = {
  railNav: must("railNav"),
  turn: must("turn"),
  context: must("context"),
  main: must("main"),
  verdict: must("verdict"),
  advance: must("advance"),
  dialog: /** @type {HTMLDialogElement} */ (must("eventDialog")),
  inspect: must("inspect"),
  dialogClose: must("eventDialogClose"),
};

/** @param {string} id */
function must(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`elemento #${id} nao existe no documento`);
  return node;
}

let state = createState();
let screen = "mesa";
let orders = blankOrders();

/** As ordens de um mes que ainda nao comecou. */
function blankOrders() {
  return {
    /** @type {string | null} */
    billId: null,
    /** @type {Record<string, number>} */
    funding: Object.fromEntries(CATALOG.parties.map(party => [party.id, 0])),
    /** @type {Record<string, number>} */
    allocation: Object.fromEntries(CATALOG.areas.map(area => [area.id, 0])),
  };
}

/* ── O QUE A TELA PRECISA SABER, derivado e nunca guardado ────────────────── */

function billOnTable() {
  return CATALOG.bills.find(bill => bill.id === orders.billId) ?? null;
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
 */
function forecastNow(paid) {
  const bill = billOnTable();
  if (!bill || bill.instrument === "decree") return null;
  return whipCount({
    bill,
    parties: CATALOG.parties,
    funding: paid,
    loyalty: state.loyalty,
  });
}

function mesaInput() {
  const bill = billOnTable();
  const share = settlement(state, orders, CATALOG);

  return {
    bill,
    areaLabel: CATALOG.areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: bill ? quorumOf(bill) : 0,
    parties: CATALOG.parties,
    loyalty: state.loyalty,
    /* A LINHA DA BANCADA MOSTRA A PROMESSA — a fracao e o custo do que o jogador
       ofereceu, que e o que ele controla. Os VOTOS ao lado saem do que sera
       pago. Sob corte, os dois divergem na mesma linha, e essa divergencia e a
       licao central do jogo: promessa nao move voto. A linha de caixa embaixo
       diz por que, com o numero. */
    funding: orders.funding,
    forecast: forecastNow(share.paid),
    band: dispersion({ parties: CATALOG.parties, loyalty: state.loyalty }),
    seatPrice: CATALOG.fiscal.seatPrice,
    room: share.room,
    demand: share.demand,
    thresholds: THRESHOLDS,
  };
}

/**
 * @param {import("./src/public/index.mjs").Area} area
 */
function areaInput(area) {
  const allocation = orders.allocation[area.id] ?? 0;
  const value = state.capacity.index[area.id] ?? area.initial;
  const share = settlement(state, orders, CATALOG);

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
    available: CATALOG.bills.filter(
      bill => bill.area === area.id && !state.enacted.includes(bill.id),
    ),
    standing: CATALOG.bills.filter(
      bill => bill.area === area.id && state.enacted.includes(bill.id),
    ),
    quorumOf,
    onTable: orders.billId,
    allocation,
    room: share.room,
    /* O QUE JA FOI PROMETIDO FORA DAQUI: a demanda do mes inteira menos o que
       esta area esta pedindo. Ela inclui a emenda para o Congresso, e tinha de
       incluir — a bolsa e uma so, e e isso que faz mover este controle
       significar nao mover outro. */
    committed: share.demand - allocation,
    projected: project(allocation),
    idle: project(0),
  };
}

/* ── PINTURA ──────────────────────────────────────────────────────────────── */

/** @type {GameState | null} */
let painted = null;

function paint() {
  el.railNav.innerHTML = railNavHtml(screen, CATALOG.areas);

  /* CADA VIEW TRAZ O PROPRIO ELEMENTO DE FORA, e o entrypoint so concatena. A
     versao anterior montava aqui a `<div class="mesa">` que embrulha a tela — e
     isso e decisao de forma escrita no arquivo que nao pode ter nenhuma: quem
     desenha a Mesa passaria a ter de lembrar que a lamina dela mora no
     entrypoint. */
  const area = CATALOG.areas.find(item => item.id === screen);
  if (area) {
    el.main.innerHTML = areaHtml(areaInput(area));
    el.main.dataset["screen"] = "area";
  } else {
    el.main.innerHTML =
      capacityStripHtml({
        areas: CATALOG.areas,
        index: state.capacity.index,
        history: state.capacity.history,
      }) + mesaHtml(mesaInput());
    el.main.dataset["screen"] = "mesa";
  }

  /* RENDER POR IDENTIDADE DE REFERENCIA no rail da direita. Como o estado e
     imutavel, `anterior.approval === atual.approval` responde "esta parte mudou?"
     com uma comparacao de ponteiro — sem diff de arvore e sem framework. */
  const previous = painted;

  if (!previous || previous.month !== state.month) {
    el.turn.textContent = turnHtml(state);
  }
  if (!previous || previous.month !== state.month || previous.situation !== state.situation) {
    el.context.innerHTML = contextHtml(state);
  }
  if (!previous || previous.situation !== state.situation) {
    el.verdict.textContent = verdictHtml(state.situation);
    document.documentElement.style.setProperty("--situation-tint", `var(--${state.situation})`);
  }

  painted = state;
}

/** So os numeros derivados, para o arrasto sobreviver. */
function refresh() {
  if (el.main.dataset["screen"] === "mesa") {
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

  const area = CATALOG.areas.find(item => item.id === screen);
  const read = document.getElementById("allotRead");
  if (!area || !read) return;
  const input = areaInput(area);
  read.innerHTML = allotReadHtml({
    value: input.value,
    allocation: input.allocation,
    projected: input.projected,
    idle: input.idle,
  });
}

/* ── OS GESTOS ────────────────────────────────────────────────────────────── */

/* A troca de tela passa pela View Transition quando ela existe, e degrada para
   uma pintura direta quando nao — o `?.` e a degradacao inteira. */
function transition() {
  const start = document.startViewTransition?.bind(document);
  if (start) start(paint);
  else paint();
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

  const pick = target.closest("[data-bill]");
  if (pick instanceof HTMLElement && pick.dataset["bill"]) {
    /* Escolher uma acao LEVA A MESA. A area e onde se escolhe; a mesa e onde se
       negocia — e emendar sem ver o placar seria negociar no escuro. */
    orders.billId = pick.dataset["bill"];
    screen = "mesa";
    transition();
  }
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

  const area = target.dataset["area"];
  if (area) {
    orders.allocation[area] = Number(target.value);
    refresh();
  }
});

el.advance.addEventListener("click", () => {
  const played = playMonth(state, orders, { catalog: CATALOG });
  state = played.state;
  /* O RASCUNHO MORRE COM O MES. Carregar a verba do mes passado para o proximo
     faria o jogador pagar de novo sem ter decidido — e o motor cobraria, porque
     ele nao sabe distinguir promessa nova de promessa esquecida na tela. */
  orders = blankOrders();
  transition();
});

/* `showModal()` entrega foco, inercia do fundo, Escape e camada superior. Nada
   disso e escrito aqui — e essa e a diferenca entre o padrao nativo e a versao
   manual, que no projeto anterior custou uma sessao inteira de correcao de
   acessibilidade e tres regras permanentes de documentacao. */
el.inspect.addEventListener("click", () => el.dialog.showModal());
el.dialogClose.addEventListener("click", () => el.dialog.close());

/* O ponto neutro e do catalogo e nao da tela; ele chega aqui so para a faixa de
   indices saber onde fica a linha d'agua. */
document.documentElement.style.setProperty("--neutral", String(NEUTRAL));

paint();
