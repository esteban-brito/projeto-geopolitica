/* ENTRYPOINT — composicao e wiring, e nada mais.

   Ele nao calcula e nao formata: liga o estado as views e as views ao documento, e
   `boundaries` prova que ele so alcanca `src/state/`, `src/public/` e `src/ui/`. No
   projeto anterior o entrypoint nasceu wiring, acumulou regra e virou 1.715 linhas que
   uma refatoracao inteira nao desmontou.

   ELE GUARDA TRES COISAS: `state`, o jogo; `screen`, onde o jogador esta; `orders`, o
   que ele montou para ESTE mes. So `orders` e mutavel, e de proposito — rascunho de
   interface vira estado no instante em que o mes executa, e nao antes.

   E HA DUAS PINTURAS: `paint` redesenha, `refresh` so troca numero derivado. Trocar o
   HTML de um `<input type=range>` no meio de um arrasto arranca o elemento que o
   ponteiro esta segurando, e o arrasto morre no primeiro pixel. */

import { OPENING_MONTH, createState } from "./src/state/state.mjs";
import { deserialize, serialize } from "./src/state/save.mjs";
import {
  alertsOf,
  CATALOG,
  NEUTRAL,
  pollFrom,
  THRESHOLDS,
  MONTHS_PER_TERM,
  SEATS,
  SIMPLE_MAJORITY,
  bandsOf,
  boilerOf,
  chainOf,
  pledgesOf,
  forecast,
  passageOf,
  governmentOf,
  ledger,
  left,
  outlook,
  trajectory,
  HORIZON,
  STAGES,
  calendarOf,
  playMonth,
  settlement,
  silences,
  situationOf,
  termOf,
} from "./src/public/index.mjs";
import { armRail, railGovHtml, railNavHtml } from "./src/ui/shared/rail.mjs";
import { closingHtml } from "./src/ui/screens/closing.mjs";
import {
  areaHtml,
  chainHtml,
  estadoHtml,
  lawReadHtml,
  outlookHtml,
  poolHtml,
  programReadHtml,
  riteOf,
} from "./src/ui/screens/area.mjs";
import {
  benchReadHtml,
  capacityStripHtml,
  congressHtml,
  mesaHtml,
  passageHtml,
  tallyHtml,
} from "./src/ui/screens/mesa.mjs";
import { financeHtml } from "./src/ui/screens/finance.mjs";
/* A APROVACAO VOLTOU. Ela esteve fora da tela por tres sessoes com esta razao
   escrita aqui: "quem a produz e SONDA, que nao existe". O motor
   nasceu, e o numero passou a se mover quando o mes e resolvido de verdade —
   que era a unica condicao. */
import { vitalsHtml, whenHtml } from "./src/ui/screens/dashboard.mjs";
import { bindAdvance, dressTopbar } from "./src/ui/shared/topbar.mjs";
import { iconHtml } from "./src/ui/shared/icons.mjs";
import { cabinetHtml, dressDesk, emailHtml, forgetDesk } from "./src/ui/screens/cabinet.mjs";
import { noticeHtml, reportPanelHtml } from "./src/ui/screens/report.mjs";
import { describeMail, describeMonth, trayHtml } from "./src/ui/screens/inbox.mjs";
import { DEFAULT_TREATMENT, UI } from "./src/ui/strings.mjs";

/** @typedef {import("./src/state/state.mjs").GameState} GameState */
/** @typedef {import("./src/public/index.mjs").Orders} Orders */
/** @typedef {import("./src/public/index.mjs").Report} Report */

/* ⛔ A SOMA E FEITA UMA VEZ SO, e nao em cada tela: as duas que perguntam se a inflacao
   esta ruim tem de dar a MESMA resposta, e a soma repetida e como a barra acusava desde
   7,5% enquanto Financas acusava desde 4,5%. */
const INFLATION_CEILING = CATALOG.macro.inflationTarget + CATALOG.macro.inflationTolerance;

const el = {
  /* A CASCA INTEIRA, e ela so ganhou id: ate entao nada precisava
     enderecar a moldura do jogo, e agora o CERCO precisa — ver `paint`. */
  shell: must("shell"),
  railNav: must("railNav"),
  railGov: must("railGov"),
  turn: must("turn"),
  vitals: must("vitals"),
  main: must("main"),
  seal: must("seal"),
  advance: /** @type {HTMLButtonElement} */ (must("advance")),
  advanceArrow: must("advanceArrow"),
  restart: must("restart"),
  swearDialog: /** @type {HTMLDialogElement} */ (must("swearDialog")),
  swearForm: /** @type {HTMLFormElement} */ (must("swearForm")),
  swearName: /** @type {HTMLInputElement} */ (must("swearName")),
  swearParty: /** @type {HTMLSelectElement} */ (must("swearParty")),
  swearTitle: must("swearTitle"),
  swearNameLabel: must("swearNameLabel"),
  swearPartyLabel: must("swearPartyLabel"),
  swearPartyHint: must("swearPartyHint"),
  swearHowLabel: must("swearHowLabel"),
  swearSir: must("swearSir"),
  swearMadam: must("swearMadam"),
  swearOk: must("swearOk"),
  swearCancel: must("swearCancel"),
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

function persistSeen() {
  try {
    window.localStorage.setItem(
      UI_KEY,
      JSON.stringify({ seen: [...readMail], open: openDispatch }),
    );
  } catch {
    /* Sem lugar para guardar. A leitura vale so esta sessao. */
  }
}

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

/* O QUE A INTERFACE LEMBRAVA: o que ja foi lido, e onde o jogador estava. */
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
function resumeDraft(month) {
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

function persistDraft() {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ month: state.month, orders }));
  } catch {
    /* Sem lugar para guardar. O rascunho vale so ate o F5. */
  }
}

let orders = resumeDraft(state.month) ?? blankOrders();

/* ── QUAL OFÍCIO ESTÁ ABERTO NA BANDEJA ──────────────────────────────────────
   ⚠ ELE NÃO É ESTADO DE JOGO e não entra no save: um save carregado num mês em que
   aquela carta já venceu abriria num id que não existe mais. Ele mora na memória de
   interface, ao lado da marca de leitura, e por isso atravessa o F5.

   ⚠ E ELE NASCE NA PRIMEIRA CARTA DO MANDATO, e não nulo. Nulo quer dizer "a de cima",
   e a de cima TROCA todo mês: numa partida nova em que o jogador só aperta "avançar", a
   bandeja ia pulando sozinha para o "Mês sem pauta" mais recente. Palavras dele — "deveria
   ficar clicado na primeira mensagem do jogo pra sempre até eu mudar". */
/** @type {string | null} */
let openDispatch = lembrado.open ?? state.mail[0]?.id ?? null;

/* ── O QUE JA FOI LIDO ───────────────────────────────────────────────────────
   ⚠ ELE PODA SOZINHO. Sem poda, o conjunto cresceria por 48 meses guardando id de
   carta que nao existe mais — vazamento lento num armazenamento que tem cota. A poda
   acontece na pintura, contra os ids que a bandeja de fato mostrou.

   ⚠ E "LIDA" SIGNIFICA "ESTEVE ABERTA NA TELA", e nao "foi clicada": a bandeja abre a
   mais urgente sozinha, entao exigir clique marcaria como nao-lida justamente a carta
   que o jogador esta lendo agora. */
/** @type {Set<string>} */
/* ⚠ `readMail` E NAO `seen`, e o nome e defensivo: `seen` ja e uma variavel local em
   `mesaInput` — a previsao do turno —, e um modulo com duas coisas chamadas igual e a
   armadilha esperando a proxima sessao editar a errada. */
const readMail = new Set(lembrado.seen);

/* O ULTIMO MES RESOLVIDO, com o que ele precisa para se comparar com o mes
   anterior. Ele NAO e estado de jogo e nao entra no save: e a memoria de uma
   tela, e uma partida retomada comeca sem relatorio anterior porque de fato nao
   houve um nesta sessao. */
/** @type {{ report: Report, quorum: number, loyaltyBefore: Record<string, number>,
 *           indexBefore: Record<string, number>,
 *           adviser: { name: string, office: string, label: string, reach: number,
 *                      gender?: "f" | "m" } | null } | null} */
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
    levels: { ...state.levels },
    /* AS LEIS TAMBEM NASCEM NAS VIGENTES, e pelo mesmo motivo dos niveis: o
       rascunho comeca no pais como ele e. Nascer vazio faria "nao mexi em nada"
       significar "revogo tudo", e o primeiro `avancar` sem tocar em nada seria a
       maior desregulamentacao da historia do jogo.

       ⚠ E "AS VIGENTES" DEIXOU DE SER UM CAMPO. Desde que a lei virou texto, o que
       vale hoje e o que o motor de normas lê da pilha — com gatilho e prazo
       dentro —, e o rascunho copia essa LEITURA. Copiar do estado bruto seria o
       entrypoint remontando a legislacao do pais por fora. */
    /** @type {Record<string, import("./src/state/state.mjs").Band>} */
    bands: Object.fromEntries(
      Object.entries(bandsOf(state, CATALOG)).map(([id, band]) => [id, { ...band }]),
    ),
  };
}

/* A LEI DE HOJE, perguntada ao motor. Ela e chamada onde antes se lia
   `state.bands`, e nao guardada numa variavel de modulo: o resultado depende do
   MES e dos indicadores, e uma copia guardada envelheceria exatamente no turno em
   que uma clausula de gatilho ligasse — que e o turno em que ela importa. */
function lawNow() {
  return bandsOf(state, CATALOG);
}

/* ── O QUE A TELA PRECISA SABER, derivado e nunca guardado ────────────────── */

/**
 * A PREVISAO AO VIVO — e ela NAO e montada aqui.
 *
 * ⚠ ESTE ARQUIVO JA MONTOU A CAMARA A MAO, com os blocos crus do catalogo e a lealdade
 * crua, enquanto o turno votava com as bancadas do ELENCO — que sao outras, em outro
 * numero. Medido: em 1.012 votacoes o veredito da Mesa saia INVERTIDO em 275 — 27,2%,
 * com divergencia de ate 35 votos. Ha uma porta so: `forecast` devolve a pauta, o placar,
 * a banda e o que cada bloco entrega, tudo da mesma camara que `playMonth` vai usar.
 */
function mesaInput() {
  const seen = forecast(state, orders, CATALOG);
  const bill = seen.agenda.proposal;

  return {
    bill,
    areaLabel: CATALOG.areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: seen.agenda.quorum,
    parties: CATALOG.parties,
    /* A SUA BANCADA VAI MARCADA, e ela e a unica coisa da tela do Congresso que nao muda de
       mes para mes: o partido do presidente e escolhido na posse e nao se troca. */
    ruling: state.party ?? null,
    loyalty: state.loyalty,
    /* A LINHA DA BANCADA MOSTRA A PROMESSA — a fracao e o custo do que o jogador
       ofereceu, que e o que ele controla. Os VOTOS ao lado saem do que sera
       pago. Sob corte, os dois divergem na mesma linha, e essa divergencia e a
       licao central do jogo: promessa nao move voto. A linha de caixa embaixo
       diz por que, com o numero. */
    funding: orders.funding,
    forecast: seen.whip,
    /* O QUE CADA BLOCO ENTREGA ja vem somado do motor: um bloco e o resto da
       bancada MAIS os lideres que sairam dela, e somar isso na tela seria esquecer
       um lider no dia em que o elenco crescer. */
    byBloc: seen.byBloc,
    /* ⚠ A GENTE VEM MONTADA DO MOTOR. Casar pessoa com bancada, bancada com voto e
       pessoa com memoria sao quatro junções — feitas aqui, elas errariam calado no
       dia em que o elenco crescer, que e o defeito que este arquivo acabou de
       pagar caro com a camara montada a mao. */
    blocs: seen.blocs,
    band: seen.band,
    seatPrice: CATALOG.fiscal.seatPrice,
    room: seen.share.room,
    demand: seen.share.demand,
    thresholds: THRESHOLDS,
  };
}

/**
 * O PLACAR, e ele nao decide nada — por isso e o unico input que nao olha para
 * `orders.funding` nem para nivel nenhum por conta propria: tudo o que o mes
 * corrente ja comprometeu chega dentro do `ledger`, que faz a conta do turno.
 */
function financeInput() {
  const { budget, interest, debt, debtRatio, premium } = ledger(state, orders, CATALOG);

  return {
    macro: state.macro,
    budget,
    interest,
    debt,
    debtRatio,
    premium,
    series: state.series,
    target: CATALOG.macro.inflationTarget,
    ceiling: INFLATION_CEILING,
    areas: CATALOG.areas,
    index: state.capacity.index,
    /* ⚠ A FONTE MUDOU, e ela era a ERRADA desde que a coluna nasceu. Isto
       era `state.capacity.history` — o buffer do ATRASO, que a MALHA mantem com `lag + 1`
       valores porque e assim que o mecanismo funciona. O estado guarda uma SEGUNDA serie,
       longa e feita para isto, e a prosa dela em `state.mjs` diz a diferenca com todas as
       letras: "o historico e curto e ALIMENTA O MOTOR; a serie e longa e alimenta os
       OLHOS". Ninguem tinha vindo trocar. Ver o achado 42 na retomada. */
    history: state.series.areas,
  };
}

/* O QUE A CAIXA CONSOME — e ela e a UNICA que sobrou deste montador.
   ⚠ ELE ERA COMPARTILHADO COM O GABINETE, e a razao registrada era boa: "as duas leituras
   saem do MESMO `settlement` do mes". Ela caiu quando o Gabinete virou mesa — ele nao le mais
   leitura nenhuma, so o ato do mes. */
/* AS CARTAS COM CONTEUDO, para a Caixa e para a mesa: a MESMA montagem, com a mesma gente, o
   mesmo tratamento e as mesmas opcoes. Duas chamadas divergiriam no primeiro parametro novo. */
/** @param {ReadonlyArray<import("./src/state/state.mjs").Letter>} mail */
function dispatchesOf(mail) {
  const current = situationOf(state, CATALOG);
  const { budget } = ledger(state, orders, CATALOG);
  const share = settlement(state, orders, CATALOG);
  const gov = governmentOf(state, CATALOG);
  return describeMail({
    mail,
    people: gov.people,
    treatment: gov.treatment,
    left: letter => left(letter, state.month),
    /* ⚠ OS DOIS NUMEROS CRUS, E NAO A RAZAO ENTRE ELES. A frase com mais
     impacto seria "95% da despesa e obrigatoria" — e a divisao que a produz
     ja mora no cartao do Cofre, entao escreve-la aqui daria dois lugares
     fazendo a mesma conta, que e o defeito recorrente numero um deste
     projeto. Dois valores em reais dizem a mesma coisa sem abrir a segunda
     porta. */
    inherited: { mandatory: budget.mandatory, room: share.room },
    answered: orders.mail,
    /* ⚠ AS OPCOES VEM DA FACHADA, e o que esta marcado tem DUAS fontes: antes de a posse
       fechar, o rascunho do mes; depois dela, o estado — a carta continua na caixa e
       continua mostrando o que foi prometido. */
    pledges: pledgesOf(CATALOG),
    platform: { ...state.platform, ...orders.platform },
    /* QUEM PODE EXIGIR — a carta da chantagem precisa do NOME do grupo, e o nome
     mora no catalogo. Uma tabela de nomes nesta view seria a segunda verdade
     sobre quem sao os quatro. */
    lobbies: CATALOG.lobbies,
    /* ⚠ O CERCO SAI DO MOTOR, e a carta dele nao escreve numero proprio: o
     triplo da cadeira e `SIEGE_PRICE`, e os 342 de 513 sao a CF art. 86 no
     regime. Copiados na view, os dois mentiriam no dia em que mudassem. */
    siege: boilerOf(state, CATALOG),
    /* AS CADEIRAS E O QUORUM, para a carta da MINORIA. Os dois ja estao calculados
       nesta funcao — a tela nao soma bancada de novo. */
    chamber: { base: current.base, majority: SIMPLE_MAJORITY, seats: SEATS },
    /* ⚠ OS MESES FECHADOS, e nao para a carta do mes: a carta do PLENARIO nao guarda o
       proprio placar, e ele ja mora aqui desde a versao 19. */
    months: state.months,
    /* AS CLASSES, so pelo ROTULO: o anexo da carta da rua nomeia as linhas, e os
         numeros dele ja vem pesados dentro da propria carta. */
    segments: CATALOG.segments,
    /* AS BANCADAS, so pelo ROTULO: a lealdade e as cadeiras chegam na propria
         carta, gravadas no mes em que ela foi escrita. */
    parties: CATALOG.parties,
  });
}

function emailInput() {
  const gov = governmentOf(state, CATALOG);

  return {
    resolved: state.month > OPENING_MONTH,
    inbox: trayHtml({
      open: openDispatch,
      seen: [...readMail],
      dispatches: [
        /* ⚠ O FECHAMENTO DO MES ABRE O BLOCO DELE, e concatenado no FIM ele fechava: a ordem
           e por mes e o desempate e a posicao na lista, entao a carta mais nova do mes caia
           embaixo das que ja estavam la. Palavras dele: "a mensagem Mes sem pauta vai pra
           ultimo na ordem, sendo que ela e mais recente". */
        /* ⚠ UM CARTAO POR MES FECHADO, e nao so o ultimo: eles agora moram no save, entao o
           resumo de marco continua na caixa em dezembro — e atravessa o F5. */
        ...state.months.map((/** @type {import("./src/state/state.mjs").MonthCard} */ fechado) =>
          describeMonth({ report: fechado, adviser: gov.adviser }),
        ),
        /* ⚠ A ORDEM NAO MORA MAIS AQUI, e a mudanca e de endereco e nao de regra: quem
           ordena e `trayHtml`, onde ela e funcao pura e tem prova. No entrypoint ela so era
           alcancavel pelo passeio, e passou meses com as perguntas nao ordenadas entre si. */
        ...dispatchesOf(state.mail),
        /* ⚠ O FECHAMENTO DO MES ENTRA NA MESMA LISTA, e nao concatenado depois dela. Ele era
           anexado FORA da ordenacao, entao caia sempre no fim mesmo sendo a carta mais nova —
           o calendario lia "abr → mar → abr" numa partida de dois meses, e do mes 3 em diante o
           corte por capacidade o comia primeiro e ele ficava INALCANCAVEL: sem linha no indice,
           nao ha o que clicar. Quem ordena agora e a bandeja. */
      ],
    }),
  };
}

/**
 * O GRUPO MAIS PERTO DE ROMPER — e o mais perto do PROPRIO limiar, e nao o de maior pressao.
 *
 * ⚠ COMPARAR PRESSAO CRUA POE NA FRENTE O GRUPO ERRADO: quem esta em 40 de um limiar de 90
 * esta longe; quem esta em 38 de um limiar de 40 esta na porta. O parecer tem UMA linha de
 * grupo, entao escolher errado e mostrar o grupo que nao vai romper.
 *
 * @param {ReadonlyArray<{ label: string, pressure: number, boil: number }>} lobbies
 */
function closestToBreak(lobbies) {
  let worst = null;
  for (const lobby of lobbies) {
    if (lobby.boil <= 0) continue;
    if (worst === null || lobby.pressure / lobby.boil > worst.pressure / worst.boil) worst = lobby;
  }
  return worst === null ? null : { label: worst.label, pressure: worst.pressure, boil: worst.boil };
}

/* O QUE ESTA NA MESA, com o texto de cada carta: a bandeja mostra o que chegou no fechamento e o
   que vence, e a carta abre ali mesmo. `dispatchesOf` e a mesma montagem da Caixa. */
/** @param {number} closed @param {Set<string>} dying */
function onDesk(closed, dying) {
  const here = state.mail
    .filter(letter => letter.month === closed || dying.has(letter.id))
    /* O QUE VENCE CAI POR CIMA: e o que uma pessoa faz com a correspondencia urgente. */
    .sort((a, b) => Number(dying.has(a.id)) - Number(dying.has(b.id)));
  const dispatches = dispatchesOf(here);
  return here.map(letter => ({
    urgent: dying.has(letter.id),
    dispatch: dispatches.find(dispatch => dispatch.id === letter.id) ?? null,
  }));
}

function cabinetInput() {
  const share = settlement(state, orders, CATALOG);
  const { budget } = ledger(state, orders, CATALOG);
  const current = situationOf(state, CATALOG);
  const boiler = boilerOf(state, CATALOG);
  const standing = pollFrom(state.mood, CATALOG.segments, CATALOG.opinion);
  /* ⚠ UMA VEZ POR MONTAGEM, e nao tres: `governmentOf` refaz o elenco da semente a cada
     chamada, e o presidente, o nome do chefe e o genero dele saem do MESMO governo. */
  const gov = governmentOf(state, CATALOG);

  /* ⚠ QUEM CONTA O QUE VENCE E O MOTOR. `silences` e `settle` filtrada: a tela nao pergunta se
     o prazo passou — escrever `left(carta) <= 0` por fora e a familia de defeito mais cara
     deste projeto, com sete ocorrencias. */
  const quiet = silences({ mail: state.mail, orders: orders.mail, month: state.month });
  const dying = new Set(quiet.map(letter => letter.id));

  /* ⛔ O MES DA CARTA E O MES EM QUE ELA CHEGOU, E A TELA PINTA COM O MES JA VIRADO: o turno
     grava a carta com o mes que fechou e devolve o estado no seguinte. Comparar com
     `state.month` dava zero em 47 dos 48 meses, e a mesa existia sem correspondencia nenhuma
     — nada falhava. Quem diz qual mes fechou e o motor, e nao uma subtracao aqui. */
  const closed = state.months[0]?.month ?? state.month;

  return {
    room: share.room,
    ratio: share.ratio,
    /* ⭐ QUEM ASSINA SAI DA SEMENTE, e nao de um nome escrito na tela: o elenco inteiro se
       refaz dela, e o presidente e a primeira pessoa dele. */
    president: gov.president.name,
    month: state.month,
    areas: CATALOG.areas,
    protect: orders.protect ?? [],
    /* ⭐ O PARECER — as seis leituras do filtro do ciclo 21, cada uma da funcao que o turno
       executa. A tela nao escolhe o grupo nem soma bancada: ela recebe. */
    brief: {
      month: state.month,
      /* ⚠ QUEM ASSINA O PARECER E O CHEFE DA CASA CIVIL, e o elenco pode nao te-lo: sem ele
         o documento sai sem signatario, e ausencia declarada e melhor que nome inventado. */
      chief: gov.adviser?.name ?? "",
      she: gov.adviser?.gender === "f",
      room: share.room,
      mandatory: budget.mandatory,
      revenue: budget.revenue,
      base: current.base,
      majority: SIMPLE_MAJORITY,
      worst: closestToBreak(boiler.lobbies),
      standing: standing.good,
      /* ⚠ O MES PASSADO NAO E `painted`: aquele e a ULTIMA PINTURA, e do segundo repinte do
         mes em diante ela ja e o mes corrente. Medido: um clique na caixa levava as setas a
         `flat`, e `flat` afirma que nao andou.
         ⛔ E O PARECER RECEBE O NUMERO, e nao a direcao: quem escreve "caiu 2 pontos" e uma
         pessoa; seta e desenho de tela, e no papel ela nao entra. */
      was: framed === null ? null : pollFrom(framed.mood, CATALOG.segments, CATALOG.opinion).good,
      impeachment: boiler.impeachment,
    },
    /* A BANDEJA MOSTRA O QUE CHEGOU, e nao a caixa inteira: medido em 48 meses, `state.mail`
       fecha com 25 cartas, e 25 envelopes viram um monte. O fechamento traz 0 ou 1, e em 36
       dos 48 meses ele traz alguma.
       ⚠ E O QUE VENCE ENTRA MESMO SEM TER CHEGADO AGORA: ela e a carta que o mes fecha sem
       resposta, e uma mesa que a esconde e a mesa deixando de avisar. */
    letters: onDesk(closed, dying),
    /* ⚠ A ESPESSURA DA PASTA E O QUE ESPERA DESPACHO, e nao um numero escolhido: sao as cartas
       que fizeram uma pergunta e ainda nao foram respondidas. Hoje o jogo tem UMA caneta
       construida — o contingenciamento —, entao sem elas a pasta teria sempre uma folha so. */
    sheets: state.mail.filter(letter => letter.due !== null && letter.answer === null).length,
    /* O TELEFONE TOCA SE ALGUEM FERVEU, e quem diz e o motor — o mesmo `boiling` que a ruptura
       economica le. O primeiro basta: o telefone toca uma vez, e a Caixa lista todos. */
    boiling: boiler.lobbies.find(lobby => lobby.boiling)?.label ?? null,
  };
}

/**
 * @param {import("./src/public/index.mjs").Area} area
 */
function areaInput(area) {
  const value = state.capacity.index[area.id] ?? area.initial;
  const share = settlement(state, orders, CATALOG);
  const spent = share.asked[area.id] ?? 0;

  /* ⚠ A PROJECAO E PERGUNTADA, e ela ja foi REFEITA AQUI — com a prosa deste mesmo
     bloco afirmando o contrario, em maiusculas. A MALHA consome o gasto CHEIO da area,
     ja rateado (`funded`), e a linha antiga projetava com `asked`, so a parte acima do
     piso: na Previdencia sao R$ 2,4 bi contra R$ 126,7 bi. Medido no mes 1, em CINCO
     das oito areas a seta apontava para o lado errado.

     E o entrypoint nao pode calcular — `boundaries` existe por isso, e a regra foi
     furada justamente por uma linha que se anunciava como fiel. */
  const ahead = outlook(state, orders, CATALOG);
  const curve = trajectory(state, orders, CATALOG);

  return {
    area,
    value,
    /* A SERIE LONGA, e nao o buffer do atraso — ver a prosa em `financeInput`. */
    history: state.series.areas[area.id] ?? [],
    programs: CATALOG.programs.filter(program => program.area === area.id),
    levels: orders.levels,
    spent,
    room: share.room,
    /* O QUE JA FOI COMPROMETIDO FORA DAQUI: a demanda do mes inteira menos o que
       esta area esta consumindo. Ela inclui a emenda para o Congresso, e tinha de
       incluir — a bolsa e uma so, e e isso que faz mover um controle aqui
       significar nao mover outro em outra area. */
    committed: share.demand - spent,
    projected: ahead.index[area.id] ?? value,
    idle: ahead.idle[area.id] ?? value,
    /* ⚠ O MES QUE VEM NAO MOSTRA DECISAO NENHUMA: a area anda 0,40 por mes, e a leitura saia
       `61 → 61` justamente na tela onde o jogador acabou de mexer. A projecao e a MESMA conta
       com horizonte — ha prova cobrando que a 1 mes as duas deem o mesmo numero. */
    horizon: HORIZON,
    ahead: curve.index[area.id]?.at(-1) ?? value,
    aheadIdle: curve.idle[area.id]?.at(-1) ?? value,
    bands: lawNow(),
    requestedBands: orders.bands,
    /* ⚠ A CORRENTE COME `funded`, E NAO `spent` — e este e o MESMO defeito que a projecao ja
       pagou uma vez: `spent` e a parte acima do piso, e a MALHA consome o gasto CHEIO da area.
       Na Previdencia sao R$ 2,4 bi contra R$ 126,7, e a linha do orcamento anunciaria +0,02
       onde o motor poe +1,22. Duas leituras da mesma alavanca, na mesma tela. */
    chain: chainOf(state, area.id, share.funded[area.id] ?? 0),
    /* ⚠ A RAZAO DO CORTE VEM DO RATEIO DO TURNO, e nao de `room / demand` refeito aqui: o
       decreto muda a conta — o que esta protegido sai dos DOIS lados dela —, e uma divisao
       feita na tela anunciaria um corte que o mes nao vai executar. */
    ratio: share.ratio,
    areas: CATALOG.areas,
  };
}

/* ── PINTURA ──────────────────────────────────────────────────────────────── */

/** @type {GameState | null} */
let painted = null;

/** O QUADRO DO MES PASSADO, e ele nao e `painted`: aquele e a ULTIMA PINTURA, e do segundo
 * repinte do mes em diante ela ja e o mes corrente. Este so anda quando o mes anda.
 * @type {GameState | null} */
let framed = null;

/** A posicao do governo na ultima pintura, para saber o que repintar.
 * @type {{ level: string, reason: string, base: number } | null} */
let standing = null;

/* O QUE DIZ *QUAL* CONTROLE E, e nao em que estado ele esta. A lista e a mesma que os
   manipuladores leem para decidir o que foi apertado; `unread`, `urgency`, `moved` e `price`
   ficam de fora porque mudam na propria pintura que o foco tem de atravessar. */
const IDENTITY = /** @type {const} */ ([
  "dispatch",
  "section",
  "answer",
  "letter",
  "party",
  "program",
  "protect",
  "rite",
  "band",
  "side",
]);

/**
 * ONDE O TECLADO ESTAVA, escrito como seletor.
 *
 * ⚠ SO OS `data-` DE IDENTIDADE, e essa e a metade que faltava: a marca usava o dataset
 * INTEIRO, e metade dele e ESTADO. Clicar numa carta nao lida vira `data-unread` na mesma
 * pintura em que `paint()` reescreve tudo, e o seletor gravado antes deixava de casar —
 * medido, o mes 2 passava (a carta ja estava lida) e do mes 6 o foco caia em `BODY`, que
 * custa OITO tabs para voltar ao botao recem-apertado.
 *
 * @returns {string | null}
 */
function focusMark() {
  const node = document.activeElement;
  if (!(node instanceof HTMLElement) || node === document.body) return null;
  if (node.id) return `#${node.id}`;

  const parts = IDENTITY.filter(key => node.dataset[key] !== undefined).map(
    key => `[data-${key}=${CSS.escape(String(node.dataset[key]))}]`,
  );
  return parts.length > 0 ? node.tagName.toLowerCase() + parts.join("") : null;
}

function paint() {
  /* ⚠ AQUI, E NAO NO FIM DA PINTURA: `cabinetInput` le `framed` mais abaixo nesta mesma
     funcao, e fixa-lo depois faria o parecer comparar o mes com o RETRASADO. */
  if (painted !== null && painted.month !== state.month) framed = painted;

  const focused = focusMark();
  const current = situationOf(state, CATALOG);
  /* ⚠ O BOTAO SE REPINTA JUNTO COM A TELA, e antes ele so se
     repintava ao FIM de um mes. Enquanto ele so dizia "Avancar o mes" isso bastava;
     agora ele carrega o preco do clique, e o preco cai no instante em que o jogador
     marca uma resposta na bandeja. Repintado so no fechamento, ele anunciaria uma
      pergunta sem resposta que o jogador acabou de responder. */
  /* ⚠ QUEM SABE SE O MANDATO ACABOU E O MOTOR. Antes esta pergunta era
     `state.fallen !== null` escrita aqui, e ela estava PELA METADE: pegava a queda e
     nao pegava o PRAZO — nada terminava o mandato aos 48 meses, e quem atravessasse
     os quatro anos entrava num "2o mandato" que nunca teve eleicao. */
  const term = termOf(state, CATALOG);
  endLabel(term);

  /* ⚠ O RAIL PERGUNTA A MALHA, e antes ele nao perguntava nada: os oito ministerios saiam
     identicos com Saude a 62 ou a 12, com o indice de cada um calculado todo mes ao lado. */
  el.railNav.innerHTML = railNavHtml(
    screen,
    CATALOG.areas,
    alertsOf(CATALOG.areas, state.capacity.index),
  );

  /* ⚠ DE QUEM E ESTE GOVERNO. Ele se repinta a cada pintura e nao so na abertura,
     porque a POSICAO muda: ela e derivada do que o jogador moveu no orcamento, e
     portanto anda junto com o mandato. O nome nao muda; a frase abaixo dele, sim. */
  const gov = governmentOf(state, CATALOG);
  el.railGov.innerHTML = railGovHtml({
    president: gov.president,
    stance: gov.stance,
    treatment: gov.treatment,
  });

  /* CADA VIEW TRAZ O PROPRIO ELEMENTO DE FORA, e o entrypoint so concatena. A
     versao anterior montava aqui a `<div class="mesa">` que embrulha a tela — e
     isso e decisao de forma escrita no arquivo que nao pode ter nenhuma: quem
     desenha a Mesa passaria a ter de lembrar que a lamina dela mora no
     entrypoint. */
  const area = CATALOG.areas.find(item => item.id === screen);
  if (screen === "estado") {
    el.main.innerHTML = estadoHtml({
      rules: CATALOG.rules,
      levels: orders.levels,
      /* A LEI VIGENTE ATRAVESSA, como na tela de area. Sem ela a tela lia a faixa
         do catalogo — a do dia da posse — e anunciava o rito contra uma lei que
         pode nao ser mais a que vale. */
      bands: lawNow(),
      requestedBands: orders.bands,
    });
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
    /* ⚠ O EMBRULHO SAIU DAQUI, e ele nunca devia ter estado. Este
       trecho concatenava TRES pecas de vidro soltas, o que fazia do Congresso a
       unica tela do jogo montada no entrypoint — e portanto a unica cuja forma
       morava no arquivo que nao pode ter forma nenhuma. Agora `congressHtml` traz a
       lamina, a cabeca e os blocos, como toda outra view traz a dela. */
    el.main.innerHTML = congressHtml({
      gauges: capacityStripHtml({
        areas: CATALOG.areas,
        index: state.capacity.index,
        /* A SERIE LONGA, e nao o buffer do atraso — ver a prosa em `financeInput`. */
        history: state.series.areas,
        /* O MESMO MOTOR QUE O RAIL LE: a faixa e o menu falam da mesma queda. */
        alerts: alertsOf(CATALOG.areas, state.capacity.index),
      }),
      mesa: mesaHtml(mesaInput()),
      /* A GAVETA. Quem a conta e o motor: o quorum de cada texto e recomposto
         contra o pais de hoje, e nao contra o do dia em que ele foi assinado. */
      /* O caminho vem do motor, e a tela so diz onde o texto esta dentro dele. */
      passage: passageHtml(passageOf(state, CATALOG), STAGES),
      report: reportPanelHtml(
        last && {
          report: last.report,
          quorum: last.quorum,
          parties: CATALOG.parties,
          areas: CATALOG.areas,
          loyaltyBefore: last.loyaltyBefore,
          indexBefore: last.indexBefore,
        },
      ),
    });
    el.main.dataset["screen"] = "congress";
  } else if (term.over) {
    /* ⚠ O FECHO OCUPA O ENDERECO DO GABINETE, e nao um item novo no rail. O
       Gabinete e a tela do que se DECIDE neste mes, e depois do ultimo mes nao ha
       mes para decidir: manter os dois lado a lado daria ao jogador uma tela de
       decisao que nao decide nada, ao lado de uma que diz que acabou. As outras
       continuam no rail de proposito — o pais que ele deixou e consultavel. */
    el.main.innerHTML = closingHtml(term, governmentOf(state, CATALOG).treatment);
    el.main.dataset["screen"] = "closing";
  } else if (screen === "email") {
    el.main.innerHTML = emailHtml(emailInput());
    el.main.dataset["screen"] = "email";
    /* ⚠ MARCA DEPOIS DE PINTAR, E LENDO O QUE FOI PINTADO. A alternativa era marcar
       antes, calculando qual carta a bandeja VAI abrir — e isso seria o entrypoint
       refazendo a decisao dela, que e o defeito recorrente numero um deste projeto. O
       DOM ja tem a resposta: `aria-current` esta exatamente na linha que a bandeja
       escolheu, e perguntar a ela nao pode divergir dela.

       ⚠ E A PODA ACONTECE AQUI, contra as linhas que a bandeja de fato mostrou. Sem ela
       o conjunto guardaria id de carta morta pelos 48 meses do mandato. */
    rememberRead();
  } else {
    el.main.innerHTML = cabinetHtml(cabinetInput());
    el.main.dataset["screen"] = "cabinet";
    /* ⚠ A MESA SE VESTE DEPOIS DE PINTAR, e nao no HTML dela: a rubrica so se mede com o
       traco na pagina, e as materias sao data URI que a folha nao tem como escrever. */
    dressDesk(el.main);
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
    /* ⚠ O PRAZO VEM DO CALENDARIO e nao de uma segunda conta aqui: `calendarOf` e funcao
       pura do mes, e refazer a distancia na tela daria a barra uma data de fim propria. */
    const ahead = calendarOf(state.month);
    const due = ahead.now[0] ?? ahead.soon[0] ?? null;
    el.turn.innerHTML = whenHtml({
      month: state.month,
      deadline: due ? { label: due.label, due: Number("due" in due ? due.due : 0) } : null,
      left: Math.max(0, MONTHS_PER_TERM - state.month),
      over: term.over,
    });
  }

  if (!previous || previous !== state) {
    const poll = pollFrom(state.mood, CATALOG.segments, CATALOG.opinion);
    /* ⚠ SEM MES ANTERIOR NAO HA TENDENCIA, e antes isto caia em `state` — o
       proprio mes servindo de passado, o que faz as quatro setas sairem em "nao moveu".
       Numa RECARGA `painted` volta nulo, entao a barra afirmava que nada tinha andado no
       mes 30 de um mandato em que tudo andou. Ausencia nao e resultado: agora a barra
       recebe `null` e nao desenha seta nenhuma. */
    /* ⭐ AS QUATRO SERIES EXISTEM SEM MOTOR NOVO. PIB e inflacao vem de `series`; aprovacao
       vem dos cartoes do mes, que guardam a rua de cada fechamento. Nenhuma linha desenhada
       aqui e inventada, e a que nao tem historia nao desenha. */
    const past = [...state.months].reverse();
    el.vitals.innerHTML = vitalsHtml({
      macro: state.macro,
      approval: poll.good,
      base: current.base,
      majority: SIMPLE_MAJORITY,
      seatsTotal: SEATS,
      /* ⚠ OS DOIS LIMIARES SAO DO CATALOGO: o da rua e o mesmo com que a CALDEIRA rompe. */
      streetFloor: CATALOG.pressure.streetFloor,
      ceiling: INFLATION_CEILING,
      horizon: MONTHS_PER_TERM,
      /* ⚠ A SERIE DA APROVACAO E CURTA: o motor guarda os ultimos `CARRY` cartoes, entao
         ela comeca no mes em que a janela comeca — e nao no mes 1. */
      approvalFrom: Math.max(0, state.month - past.length),
      series: {
        gdp: state.series.gdp,
        inflation: state.series.inflation,
        approval: past.map(card => card.balance.streetNow),
      },
    });
  }

  if (before?.reason !== current.reason) {
    document.documentElement.style.setProperty("--situation-tint", `var(--${current.level})`);
  }

  /* ⚠ O CERCO NAO E UMA QUARTA SITUACAO. O gel ja tinge a tela por
     crise/estavel/crescimento, e um quarto tom ali faria o cerco competir com a leitura
     que o gel existe para dar. Ele entra por ARESTA, que e um canal livre — o estado
     dele nao e "quao bem o pais vai": e "ha uma gaveta aberta".

     ⚠ E A COR E O BORDO DO CARIMBO, e nao o vermelho de crise: `--crisis` e a cor do
     que JA deu errado, e bordo e a do despacho pendente. O processo aberto e exatamente
      isso — a Camara carimbou, e o mandato ainda nao caiu. */
  const siege = state.impeachment !== null && state.fallen === null ? "true" : "";
  if (el.shell.dataset["siege"] !== siege) el.shell.dataset["siege"] = siege;

  /* ⚠ E O FOCO VOLTA POR ULTIMO, depois de toda peca estar no lugar. `preventScroll` porque
     devolver o foco nao e pedir para rolar: sem ele, a linha do indice puxava a pagina. */
  if (focused) {
    const back = document.querySelector(focused);
    if (back instanceof HTMLElement && back !== document.activeElement) {
      back.focus({ preventScroll: true });
    }
  }

  /* ⚠ O VIDRO SE VESTE NA MESMA VOLTA, e nao no quadro seguinte: entre a escrita e o
     proximo quadro cabe uma pintura, e nela o bloco aparecia sem a justificacao — largo, e
     so depois encolhendo. A barra e menu fixo, e menu fixo nao se refaz na tela. */
  dressTopbar(document);
  bindAdvance(el.advance);

  painted = state;
  standing = current;
}

/**
 * O QUE ESTA NA TELA AGORA VIRA LIDO, e o que sumiu do jogo sai da memoria.
 *
 * ⚠ ELA LE O DOM DE PROPOSITO. Este e um dos poucos lugares do projeto em que isso e o
 * certo: a pergunta nao e "qual carta deveria estar aberta" — que a bandeja ja respondeu
 * — e sim "qual esta". Recalcular aqui daria dois lugares decidindo a mesma coisa, e o
 * segundo divergiria do primeiro no mes em que a ordem de urgencia mudasse.
 */
function rememberRead() {
  const rows = /** @type {HTMLElement[]} */ ([...el.main.querySelectorAll(".tray__row")]);
  if (rows.length === 0) return;

  /* ⚠ POR CONTEUDO, E NAO POR TAMANHO. `readMail.size !== before` pulava a gravacao quando a
     poda tirava um id morto e a leitura acrescentava um novo NA MESMA PINTURA: medido, o disco
     ficava com carta morta e sem a marca nova por quatro meses, e 6 de 7 cartas voltavam
     nao-lidas depois do F5. */
  const before = [...readMail].sort().join("|");

  /* A PODA PRIMEIRO: so sobrevive quem ainda esta na bandeja. */
  const alive = new Set(rows.map(row => row.dataset["dispatch"] ?? ""));
  for (const id of readMail) if (!alive.has(id)) readMail.delete(id);

  const current = /** @type {HTMLElement | null} */ (
    el.main.querySelector('.tray__row[aria-current="true"]')
  );
  const id = current?.dataset["dispatch"];
  if (id) readMail.add(id);

  /* ⚠ E ELA PRECISA ESTAR VISIVEL. Medido: a linha marcada ficava 68px ABAIXO da area visivel
     da lista, com `scrollTop` em zero — o jogador via um documento a direita e nenhuma linha
     marcada a esquerda. So rola quando ela de fato esta fora, para a lista nao pular sozinha a
     cada pintura. */
  const list = el.main.querySelector(".tray__list");
  if (current && list instanceof HTMLElement) {
    const acima = current.offsetTop < list.scrollTop;
    const abaixo = current.offsetTop + current.offsetHeight > list.scrollTop + list.clientHeight;
    if (acima || abaixo) current.scrollIntoView({ block: "nearest" });
  }

  /* ⚠ SO ESCREVE QUANDO MUDOU. `paint` roda a cada clique da tela, e gravar em disco
     sessenta vezes seguidas para guardar o mesmo conjunto e desperdicio que um dia vira
     travamento numa maquina lenta. */
  if ([...readMail].sort().join("|") !== before) persistSeen();
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
      /* ⚠ OS VOTOS DA LINHA SAO OS DO BLOCO INTEIRO, e vem somados do motor. Esta
         linha lia `forecast.parties.find(partyId === party.id)`, que depois do
         ELENCO encontra so a bancada RESTANTE do bloco — o que sobrou dele depois
         de os lideres saírem. As quatro linhas somavam menos que o placar logo
         abaixo delas, e nada acusava. */
      slot.innerHTML = benchReadHtml({
        party,
        funding: orders.funding[party.id] ?? 0,
        votes: input.byBloc[party.id] ?? 0,
        seatPrice: input.seatPrice,
        voting: input.quorum > 0 && input.forecast !== null,
      });
    }
    return;
  }

  /* A TELA DO ESTADO REPINTA SO AS LINHAS, como a area — e pelo mesmo motivo de
     gesto. Ela nao tem bolsa nem projecao: alavanca de regra nao consome caixa. */
  if (el.main.dataset["screen"] === "estado") {
    /* A LEI SE PERGUNTA UMA VEZ SO, e fora do laco — a mesma disciplina da tela de
       area: resolver a pilha de normas por alavanca pagaria a mesma leitura seis
       vezes a cada quadro de um arrasto. */
    const law = lawNow();

    for (const rule of CATALOG.rules) {
      const level = orders.levels[rule.id] ?? rule.initial;
      const band = orders.bands[rule.id] ?? law[rule.id];
      const slot = el.main.querySelector(`[data-read="${rule.id}"]`);
      if (slot) slot.innerHTML = programReadHtml({ program: rule, level, ...(band && { band }) });
      const dial = el.main.querySelector(`.dial:has([data-program="${rule.id}"])`);
      if (dial instanceof HTMLElement) {
        dial.dataset["rite"] = riteOf({ ...rule, ...(band ?? {}) }, level);
      }
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
  /* A LEI SE PERGUNTA UMA VEZ, e nao uma por programa: ela e a mesma para os
     trinta e oito, e resolver a pilha de normas dentro do laco pagaria a mesma
     leitura a cada quadro de um arrasto. */
  const law = lawNow();

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
    const lawSlot = el.main.querySelector(`[data-law="${program.id}"]`);
    if (lawSlot && band) {
      lawSlot.innerHTML = lawReadHtml({ program, band: law[program.id] ?? band, asked: band });
    }

    const row = el.main.querySelector(`.law:has([data-band="${program.id}"])`);
    if (row instanceof HTMLElement && band) {
      const now = law[program.id];
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

  /* ⚠ A CORRENTE E A QUARTA LEITURA QUE ACOMPANHA O ARRASTO, e ela precisa: mover a verba
     muda o que a linha do orcamento poe no indice, e a corrente parada ao lado de uma
     projecao que anda seria a decisao chegando em uma tela e nao na outra. */
  const chain = document.getElementById("areaChain");
  if (chain && input.chain) chain.innerHTML = chainHtml({ chain: input.chain, areas: input.areas });
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

  /* ⚠ A TRANSICAO DIZ SE O RAIL MUDA DE LUGAR: entrando ou saindo do Gabinete ele vira dock ou
     volta a coluna, e so entao a capsula escorre (`10-base.css`, tipo `dock`). Entre duas telas
     que nao sao o Gabinete ele fica onde esta, e o tipo e `stay`. */
  const moves = (el.main.dataset["screen"] === "cabinet") !== (screen === "cabinet");
  const view = start({ update: paint, types: [moves ? "dock" : "stay"] });

  /* ⚠ PULAR A TRANSICAO NAO E ERRO, e antes virava um. `ready` REJEITA quando
     uma transicao comeca antes de a anterior terminar — o que acontece a cada navegacao
     rapida —, e ninguem a escutava: medido num navegador de verdade, 48 trocas de tela
     seguidas produziram 46 rejeicoes nao tratadas. Elas nao quebravam nada, e esse era o
     problema: enchiam o unico lugar onde um erro de verdade apareceria. */
  view.ready?.catch(() => {});

  /* ⚠ E O `depois` RODA ACONTECA O QUE ACONTECER, porque ele destrava o botao de avancar
     (`resolving = false`). Preso a um `then` sozinho, bastaria `paint` lancar uma vez para
     `finished` rejeitar e o mes nunca mais poder ser avancado — sem erro na tela, sem
     nada: o jogo simplesmente pararia de responder. */
  view.finished.catch(() => {}).then(() => depois?.());
}

document.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  /* ⚠ A RESPOSTA A UMA CARTA E ORDEM, e nao mutacao do estado — a razao esta em
     `state.mjs`, e ela e concreta: o VENCIMENTO acontece dentro do turno, e uma
     resposta que mudasse o estado aqui criaria dois caminhos para a mesma carta,
     com o resultado dependendo de qual chegasse primeiro no mes em que o prazo
     fecha. Marcar aqui e decidir; o mes e que resolve.

     E ELA VEM ANTES DA NAVEGACAO de proposito: o botao de escolha vive dentro de
     uma carta que tambem leva a uma tela, e a ordem inversa faria escolher navegar. */
  /* ── O DISCURSO DE POSSE ────────────────────────────────────────────────────
     ⚠ ELE VEM ANTES DA RESPOSTA DE CARTA e pela mesma razao que ela vem antes da navegacao:
     os tres grupos moram DENTRO da carta da posse, que tambem leva a uma tela.
     ⚠ E ELE NAO ESCREVE NO ESTADO — escreve no rascunho do mes, como toda decisao: quem
     grava a plataforma e o turno, uma vez so. */
  const pledge = target.closest("[data-pledge]");
  if (pledge instanceof HTMLElement && pledge.dataset["pledge"] && pledge.dataset["choice"]) {
    const axis = pledge.dataset["pledge"];
    /* CLICAR DE NOVO NO MESMO COMPROMISSO DESMARCA, como nas duas saidas da emenda: nao
       prometer nada naquele eixo e uma escolha, e ela tem de ter caminho de volta. */
    orders.platform[axis] =
      orders.platform[axis] === pledge.dataset["choice"] ? "" : pledge.dataset["choice"];
    persistDraft();
    paint();
    return;
  }

  const choice = target.closest("[data-letter]");
  if (choice instanceof HTMLElement && choice.dataset["letter"] && choice.dataset["answer"]) {
    const id = choice.dataset["letter"];
    /* CLICAR DE NOVO NA MESMA SAIDA DESMARCA. Sem isso, uma carta respondida por
       engano so se desfaria escolhendo a outra — e escolher o contrario do que se
       quer para voltar atras nao e desfazer, e uma segunda decisao errada. */
    orders.mail[id] = orders.mail[id] === choice.dataset["answer"] ? "" : choice.dataset["answer"];
    persistDraft();
    paint();
    return;
  }

  /* ── ABRIR UM OFÍCIO NA BANDEJA ─────────────────────────────────────────────
     ⚠ ELE VEM DEPOIS DA ESCOLHA E ANTES DA NAVEGAÇÃO: os botões de resposta moram
     DENTRO do ofício aberto, que mora numa tela que também navega. Abrir antes de
     escolher faria responder virar "abrir de novo o que já está aberto"; navegar antes
     de abrir faria um clique na lista trocar de tela.

     ⚠ E O ATRIBUTO É `data-dispatch` E NÃO `data-open`: a trindade já marca ruptura
     aberta com `data-open="true"`, e um seletor `[data-open]` aqui leria um clique na
     barra de risco como pedido para abrir a carta de id "true". */
  const dispatch = target.closest("[data-dispatch]");
  if (dispatch instanceof HTMLElement && dispatch.dataset["dispatch"]) {
    openDispatch = dispatch.dataset["dispatch"];
    persistSeen();
    paint();
    return;
  }

  /* ── O DECRETO DE CONTINGENCIAMENTO ─────────────────────────────────────────
     ⚠ ELE VEM ANTES DA NAVEGACAO pela mesma razao das duas escolhas acima, e clicar de novo
     SOLTA a area: proteger e uma decisao do mes, e toda decisao do mes tem caminho de volta.
     Ele repinta a tela inteira e nao so a leitura, porque proteger uma area muda a razao do
     corte — e portanto a bolsa e a projecao de TODAS as outras. */
  const decree = target.closest("[data-protect]");
  if (decree instanceof HTMLElement && decree.dataset["protect"]) {
    const id = decree.dataset["protect"];
    orders.protect = orders.protect.includes(id)
      ? orders.protect.filter(other => other !== id)
      : [...orders.protect, id];
    persistDraft();
    paint();
    return;
  }

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
    persistDraft();
    refresh();
    return;
  }

  /* O CONTROLE DE PROGRAMA E O UNICO GESTO DA AREA. Ele nao pede confirmacao e
     nao trava em piso nenhum: arrastar abaixo da lei e permitido, e o que muda e
     o rito que a linha passa a anunciar. */
  const program = target.dataset["program"];
  if (program) {
    orders.levels[program] = Number(target.value);
    persistDraft();
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
    const current = orders.bands[band] ?? lawNow()[band];
    if (current) orders.bands[band] = { ...current, [side]: Number(target.value) };
    persistDraft();
    refresh();
  }
});

/* ── O MES E REPETIVEL, E O QUE O SEGURA E O JOGO ───────────────────────────
   Nao ha confirmacao entre um mes e o seguinte: quem quiser atravessar dez meses sem
   decidir nada atravessa, e chega do outro lado com a base obstruindo. Cobrar um clique
   de "entendi" para proteger o jogador dele mesmo e a regra artificial que este jogo
   recusa.

   O TRAVAMENTO NAO E RITMO, E CORRECAO. `playMonth` e sincrono, mas a pintura passa por
   View Transition e a promessa dela demora alguns quadros; dois cliques dentro dessa
   janela resolveriam DOIS meses sobre o MESMO estado. */
let resolving = false;

el.advance.addEventListener("click", () => {
  if (resolving) return;
  /* ⚠ MANDATO ACABADO NAO E BLOQUEIO DE FLUXO, e a distincao importa porque o
     ciclo 9 proibiu o oposto: bloquear o turno para FORCAR uma resposta. Aqui nao ha
     turno para dar — o mandato acabou, e o botao para pela queda ou pelo PRAZO, que
     e a metade que faltava antes. Quem quiser jogar de novo aperta "nova
     partida". */
  if (termOf(state, CATALOG).over) return;
  resolving = true;
  el.advance.disabled = true;

  /* O ESTADO DE ANTES FICA GUARDADO porque o relatorio compara: lealdade e
     indice sao valores de agora, e "de 70 para 72" e uma informacao que nenhum
     dos dois carrega sozinho. O turno devolve o depois; o antes so existe aqui,
     no instante anterior a troca. */
  const before = state;

  /* ⚠ O TRY/CATCH EVITA TRAVAMENTO PERMANENTE. Se `playMonth` lancar por estado
     corrompido ou violacao de contrato, `resolving` ficaria true e o botao trancado
     para sempre — sem caminho de recuperacao. */
  try {
    const played = playMonth(state, orders, { catalog: CATALOG });
    state = played.state;

    last = {
      report: played.report,
      quorum: played.report.agenda.quorum,
      loyaltyBefore: before.loyalty,
      indexBefore: before.capacity.index,
      adviser: governmentOf(before, CATALOG).adviser,
    };

    /* ⚠ A CARTA ABERTA ATRAVESSA O MES, POR DECISAO DELE: "quando eu avanco um mes, nao pode
       mudar a mensagem que esta clicada, tem que ficar naquela ate que eu mesmo mude".
       ⚠ E ISSO REVERTE O CONSERTO DE 28/08, que zerava `openDispatch` aqui. O defeito que
       aquele conserto atacava — o painel mostrando um aviso velho enquanto o botao cobrava o
       silencio de outra carta — nao volta: quem escreve o rotulo do botao e `silences`, do
       motor, e nao a carta aberta. Quem perde o id (poda) cai na de cima, em `trayHtml`. */

    /* O RASCUNHO MORRE COM O MES. Carregar a verba do mes passado para o proximo
       faria o jogador pagar de novo sem ter decidido — e o motor cobraria, porque
       ele nao sabe distinguir promessa nova de promessa esquecida na tela. */
    orders = blankOrders();
    persistDraft();
    persist();
    /* ⚠ O FECHO PUXA A TELA PARA SI no mes em que o mandato acaba, e so nesse mes. */
    if (termOf(state, CATALOG).over) screen = "cabinet";

    /* ⛔ AVANCAR O MES NAO E TROCAR DE TELA, e tratar os dois igual era o defeito. Numa View
       Transition o navegador congela a pagina numa IMAGEM, e `backdrop-filter` nao sobrevive
       a um instantaneo: a barra piscava de vidro para chapado e de volta, uma vez por mes. O
       rail nao piscava so porque o conteudo dele nao muda — o olho nao tinha onde notar.
       ⭐ A troca de TELA continua com transicao; a virada do MES pinta direto. */
    paint();
    resolving = false;
    endLabel();
  } catch {
    resolving = false;
    el.advance.disabled = false;
    state = before;
  }
});

el.noticeClose.addEventListener("click", () => el.dialog.close());

/**
 * O AVISO — a unica coisa que ainda interrompe.
 *
 * `showModal()` entrega foco, inercia do fundo, Escape e camada superior; a versao
 * manual disso custou, no projeto anterior, uma sessao inteira de correcao de
 * acessibilidade e tres regras permanentes de documentacao. O relatorio saiu daqui de
 * proposito: informacao que se consulta nao trava o fundo, e um aviso trava porque
 * algo deu errado.
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
  el.restart.dataset["arming"] = "false";
  label(el.restart, UI.actions.restart, "");
}

/* A gaveta do dock arma uma vez: o `<ul>` sobrevive as pinturas, e o estado mora nele. */
armRail(el.railNav);

/* O BOTAO DE RECOMECAR TEM GLIFO E ROTULO PROPRIOS, como o de avancar: no dock so o glifo
   aparece e o rotulo vira a dica; no rail vertical e o contrario. `label` escreve no rotulo. */
el.restart.innerHTML = iconHtml("restart", "rail__icon") + '<span class="action__label"></span>';

el.restart.addEventListener("click", () => {
  if (arming === 0) {
    arming = window.setTimeout(disarm, 5000);
    el.restart.dataset["arming"] = "true";
    label(el.restart, UI.actions.restartConfirm, UI.actions.restartConfirmHint);
    return;
  }

  window.clearTimeout(arming);
  arming = 0;
  disarm();
  /* ⚠ A PARTIDA NAO COMECA NO CLIQUE, e sim na POSSE: o jogador escreve o nome antes de o
     estado existir. O `createState` so roda quando o formulario fecha. */
  openSwear();
});

/* ── A POSSE ───────────────────────────────────────────────────────────────── */

function openSwear() {
  el.swearName.value = state.president?.name ?? "";
  /* AS OPCOES SAO MONTADAS AQUI, e nao no HTML: a lista de bancadas mora no catalogo, e
     escrever nove `<option>` a mao seria uma segunda verdade sobre quantas o jogo tem. */
  /* ⚠ NENHUMA VEM MARCADA, e a vaga na frente e o item: com a lista crua, quem so clica em
     "tomar posse" leva a PRIMEIRA do catalogo — a menor bancada da Camara, escolhida por
     ordem de arquivo e nao por ele. A escolha e obrigatoria na lei e passa a ser na tela. */
  const vazia = document.createElement("option");
  vazia.value = "";
  vazia.textContent = UI.actions.swearPartyEmpty;
  vazia.disabled = true;
  vazia.selected = state.party === null || state.party === undefined;

  el.swearParty.replaceChildren(
    vazia,
    ...CATALOG.parties.map(party => {
      const option = document.createElement("option");
      option.value = party.id;
      option.textContent = `${party.sigla} — ${party.label} · ${party.seats} cadeiras`;
      option.selected = party.id === state.party;
      return option;
    }),
  );
  const marcado = /** @type {HTMLInputElement | null} */ (
    el.swearForm.querySelector(
      `input[name="treatment"][value="${state.president?.treatment ?? DEFAULT_TREATMENT}"]`,
    )
  );
  if (marcado) marcado.checked = true;
  el.swearDialog.showModal();
  el.swearName.focus();
  el.swearName.select();
}

el.swearCancel.addEventListener("click", () => el.swearDialog.close());

el.swearForm.addEventListener("submit", () => {
  const nome = el.swearName.value.trim();
  const escolha = /** @type {HTMLInputElement | null} */ (
    el.swearForm.querySelector('input[name="treatment"]:checked')
  );
  const treatment = escolha?.value === "senhora" ? "senhora" : DEFAULT_TREATMENT;

  /* ⚠ NOME VAZIO VOLTA AO SORTEADO, e nao a uma string em branco: a tela cita o presidente
     em quatro lugares, e um vazio ali leria como defeito de carregamento. */
  /* ⚠ SEM PARTIDO NAO E UMA OPCAO DA TELA, mas continua sendo um estado valido do motor: e
     assim que um save da versao 20 abre, e e assim que o simulador roda. */
  const partido = CATALOG.parties.some(party => party.id === el.swearParty.value)
    ? el.swearParty.value
    : null;

  state = createState(undefined, CATALOG, nome === "" ? null : { name: nome, treatment }, partido);
  last = null;
  /* ⚠ E A CARTA ABERTA MORRE NA POSSE, que e o unico lugar onde ela morre: o id do alarme nao
     carrega o mes — `alarm()` monta `kind:id` —, entao um `ceiling:ceiling` clicado na
     partida anterior atravessa o recomeco e a bandeja abre ele em vez da mais urgente. */
  openDispatch = state.mail[0]?.id ?? null;
  /* ⚠ E O GESTO DA MESA MORRE AQUI PELA MESMA RAZAO: a pasta erguida e a rubrica vivem em
     variavel de modulo, e sem isto a partida nova abria com o ato ja assinado. */
  forgetDesk();
  persistSeen();
  orders = blankOrders();
  persistDraft();
  screen = "cabinet";
  painted = null;
  framed = null;
  standing = null;
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
  /* ⚠ O BOTAO DE AVANCAR TEM DUAS LINHAS PROPRIAS, e escrever nele apagaria a aresta, o
     realce e a seta — todos filhos dele. O resto da tela continua recebendo texto direto. */
  const own = node.querySelector(".go__label, .action__label");
  if (own) {
    own.textContent = text;
    const note = node.querySelector(".go__hint, .action__hint");
    if (note) note.textContent = hint;
    else if (hint) {
      const small = document.createElement("span");
      small.className = "action__hint";
      small.textContent = hint;
      node.append(small);
    }
    return;
  }
  node.textContent = text;
  /* ⚠ A LEGENDA E OPCIONAL, e o teste dela e um so: ela se paga
     quando diz algo que o rotulo nao diz. "Avancar o mes" nao precisa de "resolve o
     turno"; a CONFIRMACAO de apagar o mandato precisa, porque ela chega no momento em
     que a informacao muda a decisao. */
  if (!hint) return;
  const small = document.createElement("span");
  small.className = "action__hint";
  small.textContent = hint;
  node.append(small);
}

/* ⚠ O BOTAO TEM DE DIZER QUE ACABOU, e nao so parar de responder. Ele ficava
   aceso, do mesmo tamanho e da mesma cor de sempre, e clicar nele nao fazia nada e
   nao explicava por que — a unica pista do fim do mandato era um selo de dez pixels
   no canto de um cartao da coluna da direita. */
/* ── E O PRECO DE AVANCAR VAI NO BOTAO, e ele NAO trava ────────────────────
   ⚠ A RECUSA ESTA REGISTRADA EM `mail.mjs` e vale repetida aqui, porque e aqui
   que a tentacao mora: o dossie pedia `disabled` enquanto houvesse pergunta
   urgente. Um botao cinza e um muro, e este projeto nao tem muro — ele tem preco.
   O jogador PODE atravessar o mes sem responder nada; o que ele nao pode e nao
   saber o que isso custa antes de clicar.

   ⚠ E QUEM CONTA E O MOTOR. `silences` e `settle` filtrada: a tela nao pergunta
   se o prazo venceu, ela pergunta o que este fechamento decide sozinho. */
function endLabel(/** @type {ReturnType<typeof termOf> | null} */ term_ = null) {
  const term = term_ ?? termOf(state, CATALOG);
  /* ⚠ `|| resolving` — E ELE VALE UM MES INTEIRO DE CLIQUE. `paint` chama esta funcao, e
     `paint` roda no PRIMEIRO quadro da View Transition: sem a trava aqui, o botao voltava a
     ficar clicavel enquanto o mes ainda estava resolvendo. A janela e a transicao inteira, e
     o clique dela cai no `if (resolving) return` — sem erro, sem aviso, sem nada.

     Medido num navegador de verdade, clicando a cada 200 ms: TRES cliques produziam UM mes.
     O defeito nasceu quando o botao passou a se repintar junto com a tela. */
  el.advance.disabled = term.over || resolving;

  const quiet = term.over
    ? []
    : silences({ mail: state.mail, orders: orders.mail, month: state.month });
  /* O ATRIBUTO E O QUE ACENDE A LEGENDA, e ele fica no botao e nao numa classe: o
     que ele descreve e um ESTADO do mes, e nao uma variante do componente. */
  el.advance.dataset["price"] = quiet.length > 0 ? "true" : "";

  label(
    el.advance,
    term.over ? UI.actions.ended : UI.actions.advance,
    /* ⛔ O FIM NAO TEM LEGENDA: o botao esta desabilitado, e desabilitado nao ergue nem
       recebe foco — a frase era texto que ninguem podia ler, e so ocupava a coluna. Com o
       rotulo do fim em 166px sobram 95, e ela pedia 194. Quem chama a nova partida e o
       botao ao pe da coluna, que continua la. */
    term.over
      ? ""
      : quiet.length === 0
        ? `${Math.max(0, MONTHS_PER_TERM - state.month)} ${UI.closing.monthsLeft}`
        : /* ⛔ ELE CONTA E NAO NOMEIA, e a medida decidiu: nomeando a carta a legenda pedia
             366px numa coluna de 185, e o pedaco que sobrava era metade de um assunto. O
             numero cabe, e quem nomeia e a Caixa — que e onde se responde. */
          `${quiet.length} ${quiet.length === 1 ? UI.actions.silenceOne : UI.actions.silenceMany}`,
  );
}

/* OS DOIS GLIFOS FIXOS DA BARRA — o brasao da marca e a seta do botao. Eles nao mudam com o
   estado, entao nascem na abertura e nao a cada pintura. */
el.seal.innerHTML = iconHtml("estado", "icon");
el.advanceArrow.innerHTML = iconHtml("chevron", "icon");

endLabel();
label(el.restart, UI.actions.restart, "");

/* OS ROTULOS DA POSSE, como todo texto: do arquivo de frases, e nao do documento. */
el.swearTitle.textContent = UI.actions.swearTitle;
el.swearNameLabel.textContent = UI.actions.swearName;
el.swearPartyLabel.textContent = UI.actions.swearParty;
el.swearPartyHint.textContent = UI.actions.swearPartyHint;
el.swearHowLabel.textContent = UI.actions.swearHow;
el.swearSir.textContent = UI.actions.swearSir;
el.swearMadam.textContent = UI.actions.swearMadam;
el.swearOk.textContent = UI.actions.swearOk;
el.swearCancel.textContent = UI.actions.swearCancel;
el.noticeClose.textContent = UI.actions.close;

paint();

/* O AVISO VEM DEPOIS DA PRIMEIRA PINTURA, e nao antes: um dialogo modal sobre
   uma tela em branco nao diz de onde ele veio. */
if (opening.refused) openNotice(UI.save.refusedTitle, UI.save.refusedBody);
