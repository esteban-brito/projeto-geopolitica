/* A SESSAO — o que o navegador guarda entre pinturas, e a persistencia dele. */

import { createState } from "../state/state.mjs";
import { deserialize, serialize } from "../state/save.mjs";
import { CATALOG, bandsOf } from "../public/index.mjs";

/** @typedef {import("../state/state.mjs").GameState} GameState */
/** @typedef {import("../public/index.mjs").Report} Report */

/* ⛔ A SOMA E FEITA UMA VEZ SO, e nao em cada tela: as duas que perguntam se a inflacao
   esta ruim tem de dar a MESMA resposta, e a soma repetida e como a barra acusava desde
   7,5% enquanto Financas acusava desde 4,5%. */
export const INFLATION_CEILING = CATALOG.macro.inflationTarget + CATALOG.macro.inflationTolerance;

/* ── A PARTIDA ATRAVESSA O NAVEGADOR FECHADO ────────────────────────────────
   O ACESSO AO ARMAZENAMENTO MORA AQUI, e nao em `src/state/`: a serializacao e pura e
   testavel em Node, o armazenamento e efeito de navegador, e a guarda de fronteiras
   existe para manter os dois separados.

   TUDO ENVOLVIDO EM `try`: aba anonima, cota estourada e armazenamento desligado por
   politica sao rotina, e nenhuma delas pode derrubar o jogo. Quem nao consegue guardar
   joga assim mesmo — o que nao pode e travar na abertura. */
const SAVE_KEY = "republica-simulator:partida";
const REFUSED_KEY = "republica-simulator:partida-recusada";

/* ── A INTERFACE TEM CHAVE PROPRIA, e ela NAO entra no estado do jogo ───────────
   ⚠ QUAL CARTA FOI LIDA NAO E ESTADO DE JOGO: nao move numero, nao decide mes e nao
   muda veredito. Po-la em `GameState` custaria um BUMP DE ESQUEMA, e este save recusa
   versao diferente em vez de converter — o jogador perderia a partida em andamento
   para pagar por uma marca de leitura.

   ⚠ E SO A LEITURA ENTRA: `openDispatch` fica de fora porque um F5 sem ele nao perde
   nada, e sem a leitura a bandeja inteira volta ao estado de nunca-vista e a marca
   deixa de significar qualquer coisa. */
const UI_KEY = "republica-simulator:interface";

/* ⚠ O RASCUNHO DO MES ATRAVESSA O F5, E ANTES ELE MORRIA INTEIRO. Medido: a resposta marcada
   numa carta some no recarregamento — `aria-pressed="accept"` antes, nenhuma marcada depois —
   e com ela vao os niveis, as faixas e a verba que o jogador montou no mes.
   ⚠ E ELE NAO ENTRA NO SAVE, pela mesma razao da marca de leitura: rascunho nao e mandato, e
   po-lo em `GameState` custaria um bump de esquema num save que RECUSA versao diferente. */
const DRAFT_KEY = "republica-simulator:rascunho";

/**
 * O que a interface lembra entre uma sessao e outra.
 *
 * @returns {{ seen: string[], open: string | null }}
 */
function resumeSeen() {
  try {
    const text = window.localStorage.getItem(UI_KEY);
    if (text === null) return { seen: [], open: null };
    const saved = JSON.parse(text);
    /* ⚠ NADA AQUI CONFIA NO QUE LEU. O conteudo veio de uma versao antiga, de outra
       maquina ou de um dedo no console — e a resposta certa a qualquer surpresa e a
       mesma: comeca do zero. Uma marca de leitura errada nao vale um travamento. */
    return {
      seen: Array.isArray(saved?.seen)
        ? saved.seen.filter((/** @type {unknown} */ id) => typeof id === "string")
        : [],
      open: typeof saved?.open === "string" ? saved.open : null,
    };
  } catch {
    return { seen: [], open: null };
  }
}

export function persistSeen() {
  try {
    window.localStorage.setItem(
      UI_KEY,
      JSON.stringify({ seen: [...session.readMail], open: session.openDispatch }),
    );
  } catch {
    /* Sem lugar para guardar. A leitura vale so esta sessao. */
  }
}

export function persist() {
  try {
    window.localStorage.setItem(SAVE_KEY, serialize(session.state));
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

/* O QUE A INTERFACE LEMBRAVA: o que ja foi lido, e onde o jogador estava. */
export const opening = resume();
const lembrado = resumeSeen();

/**
 * O RASCUNHO GUARDADO, e so o do mes que esta aberto.
 *
 * ⚠ ELE VEM DE FORA, entao cada campo e peneirado pelo tipo: um rascunho corrompido a mao
 * chegaria em `playMonth` como numero que nao e numero. Mes diferente e rascunho de outro mes,
 * e esse morre — que e a regra que ja valia quando o mes vira.
 *
 * @param {number} month
 * @returns {ReturnType<typeof blankOrders> | null}
 */
export function resumeDraft(month) {
  try {
    const text = window.localStorage.getItem(DRAFT_KEY);
    if (!text) return null;
    const read = JSON.parse(text);
    if (!read || typeof read !== "object" || read.month !== month) return null;

    const draft = blankOrders();
    const numbers = (/** @type {unknown} */ from, /** @type {Record<string, number>} */ into) => {
      if (!from || typeof from !== "object") return;
      for (const [key, value] of Object.entries(from)) {
        if (typeof value === "number" && Number.isFinite(value) && key in into) into[key] = value;
      }
    };
    numbers(read.orders?.funding, draft.funding);
    numbers(read.orders?.levels, draft.levels);
    for (const [key, value] of Object.entries(read.orders?.mail ?? {})) {
      if (typeof value === "string") draft.mail[key] = value;
    }
    /* ⚠ O DISCURSO ATRAVESSA O F5 como as respostas de carta: ele e a decisao mais cara do
       mes 1, e perde-la num refresh seria perder a unica que nao se pode tomar de novo. */
    for (const [key, value] of Object.entries(read.orders?.platform ?? {})) {
      if (typeof value === "string") draft.platform[key] = value;
    }
    /* ⚠ SO TEXTO ENTRA, e quem confere se a area existe e o TURNO: peneirar aqui daria dois
       lugares dizendo o que e uma area valida, e o de fora e o que decide. */
    if (Array.isArray(read.orders?.protect)) {
      draft.protect = read.orders.protect.filter(
        (/** @type {unknown} */ id) => typeof id === "string",
      );
    }
    for (const [key, value] of Object.entries(read.orders?.bands ?? {})) {
      const band = draft.bands[key];
      if (!band || !value || typeof value !== "object") continue;
      for (const side of ["floor", "ceiling"]) {
        const edge = /** @type {Record<string, unknown>} */ (value)[side];
        if (typeof edge === "number" && Number.isFinite(edge)) {
          /** @type {Record<string, number>} */ (band)[side] = edge;
        }
      }
    }
    return draft;
  } catch {
    return null;
  }
}

export function persistDraft() {
  try {
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ month: session.state.month, orders: session.orders }),
    );
  } catch {
    /* Sem lugar para guardar. O rascunho vale so ate o F5. */
  }
}

/* ── QUAL OFÍCIO ESTÁ ABERTO NA BANDEJA ──────────────────────────────────────
   ⚠ ELE NÃO É ESTADO DE JOGO e não entra no save: um save carregado num mês em que
   aquela carta já venceu abriria num id que não existe mais. Ele mora na memória de
   interface, ao lado da marca de leitura, e por isso atravessa o F5.

   ⚠ E ELE NASCE NA PRIMEIRA CARTA DO MANDATO, e não nulo. Nulo quer dizer "a de cima",
   e a de cima TROCA todo mês: numa partida nova em que o jogador só aperta "avançar", a
   bandeja ia pulando sozinha para o "Mês sem pauta" mais recente. Palavras dele — "deveria
   ficar clicado na primeira mensagem do jogo pra sempre até eu mudar". */

/* ── O QUE JA FOI LIDO ───────────────────────────────────────────────────────
   ⚠ ELE PODA SOZINHO. Sem poda, o conjunto cresceria por 48 meses guardando id de
   carta que nao existe mais — vazamento lento num armazenamento que tem cota. A poda
   acontece na pintura, contra os ids que a bandeja de fato mostrou.

   ⚠ E "LIDA" SIGNIFICA "ESTEVE ABERTA NA TELA", e nao "foi clicada": a bandeja abre a
   mais urgente sozinha, entao exigir clique marcaria como nao-lida justamente a carta
   que o jogador esta lendo agora. */

/* AS ORDENS DE UM MES QUE AINDA NAO COMECOU.
   ⚠ OS NIVEIS NASCEM NOS VIGENTES, e nao em zero — e a diferenca entre as duas
   leituras e o jogo inteiro. Zerados, "nao mexi em nada" significaria "quero o
   Estado desligado", e o primeiro `avancar` sem tocar em nada desmontaria o pais.
   Nos vigentes, nao mexer significa manter — que e o que nao mexer quer dizer. */
export function blankOrders() {
  return {
    /** @type {Record<string, number>} */
    funding: Object.fromEntries(CATALOG.parties.map(party => [party.id, 0])),
    /* AS RESPOSTAS AS CARTAS NASCEM VAZIAS, e vazio aqui quer dizer SILENCIO — que
       e uma resposta, e nao a ausencia de uma. A carta que ninguem marcar vence
       aceitando, e a propria carta diz isso antes. */
    /** @type {Record<string, string>} */
    mail: {},
    /* ⚠ A PLATAFORMA NASCE VAZIA E SO VALE UMA VEZ: depois da posse o turno ignora o que
       vier daqui — ver `spoken` em `application/platform.mjs`. Vazia quer dizer "ele ainda
       nao disse a que veio", e avancar calado e uma resposta: governar sem plataforma. */
    /** @type {Record<string, string>} */
    platform: {},
    /* ⚠ O DECRETO NASCE VAZIO E MORRE COM O MES, como a verba: contingenciamento e execucao
       do mes, e no mundo ele se desfaz quando a receita volta. Guardar a escolha entre meses
       seria a catraca do achado 36 outra vez — um aperto que nunca se libera. */
    /** @type {string[]} */
    protect: [],
    /** @type {Record<string, number>} */
    levels: { ...session.state.levels },
    /* AS LEIS TAMBEM NASCEM NAS VIGENTES, e pelo mesmo motivo dos niveis: o
       rascunho comeca no pais como ele e. Nascer vazio faria "nao mexi em nada"
       significar "revogo tudo", e o primeiro `avancar` sem tocar em nada seria a
       maior desregulamentacao da historia do jogo.

       ⚠ E "AS VIGENTES" DEIXOU DE SER UM CAMPO. Desde que a lei virou texto, o que
       vale hoje e o que o motor de normas lê da pilha — com gatilho e prazo
       dentro —, e o rascunho copia essa LEITURA. Copiar do estado bruto seria o
       entrypoint remontando a legislacao do pais por fora. */
    /** @type {Record<string, import("../state/state.mjs").Band>} */
    bands: Object.fromEntries(
      Object.entries(bandsOf(session.state, CATALOG)).map(([id, band]) => [id, { ...band }]),
    ),
  };
}

/* A LEI DE HOJE, perguntada ao motor. Ela e chamada onde antes se lia
   `state.bands`, e nao guardada numa variavel de modulo: o resultado depende do
   MES e dos indicadores, e uma copia guardada envelheceria exatamente no turno em
   que uma clausula de gatilho ligasse — que e o turno em que ela importa. */
export function lawNow() {
  return bandsOf(session.state, CATALOG);
}

/** O que o entrypoint guarda entre uma pintura e outra — UM objeto, e ele e mutavel de proposito:
 * rascunho de interface vira estado no instante em que o mes executa, e nao antes.
 * @type {{ state: GameState, screen: string, orders: ReturnType<typeof blankOrders>,
 *   openDispatch: string | null, readMail: Set<string>,
 *   last: { report: Report, quorum: number, loyaltyBefore: Record<string, number>,
 *           indexBefore: Record<string, number>,
 *           adviser: { name: string, office: string, label: string, reach: number,
 *                      gender?: "f" | "m" } | null } | null,
 *   painted: GameState | null, framed: GameState | null,
 *   standing: { level: string, reason: string, base: number } | null, resolving: boolean }} */
export const session = {
  state: opening.state,
  screen: "cabinet",
  orders: /** @type {ReturnType<typeof blankOrders>} */ ({}),
  openDispatch: null,
  readMail: new Set(lembrado.seen),
  last: null,
  painted: null,
  framed: null,
  standing: null,
  resolving: false,
};
session.orders = resumeDraft(session.state.month) ?? blankOrders();
session.openDispatch = lembrado.open ?? session.state.mail[0]?.id ?? null;
