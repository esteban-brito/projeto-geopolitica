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
  bandsOf,
  baseSplit,
  boilerOf,
  lockedBy,
  chamberOf,
  forecast,
  passageOf,
  governmentOf,
  ledger,
  left,
  outlook,
  playMonth,
  settlement,
  situationOf,
  termOf,
} from "./src/public/index.mjs";
import { railGovHtml, railNavHtml } from "./src/ui/shared/rail.mjs";
import { closingHtml } from "./src/ui/screens/closing.mjs";
import {
  areaHtml,
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
   escrita aqui: "quem a produz e SONDA, que nao existe". Em 14/08/2026 o motor
   nasceu, e o numero passou a se mover quando o mes e resolvido de verdade —
   que era a unica condicao. */
import { turnHtml, verdictHtml, vitalsHtml } from "./src/ui/screens/dashboard.mjs";
import { cabinetHtml } from "./src/ui/screens/cabinet.mjs";
import { noticeHtml, reportPanelHtml } from "./src/ui/screens/report.mjs";
import { mailHtml, monthLetterHtml } from "./src/ui/screens/inbox.mjs";
import { UI } from "./src/ui/strings.mjs";

/** @typedef {import("./src/state/state.mjs").GameState} GameState */
/** @typedef {import("./src/public/index.mjs").Orders} Orders */
/** @typedef {import("./src/public/index.mjs").Report} Report */

const el = {
  railNav: must("railNav"),
  railGov: must("railGov"),
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
    /* AS RESPOSTAS AS CARTAS NASCEM VAZIAS, e vazio aqui quer dizer SILENCIO — que
       e uma resposta, e nao a ausencia de uma. A carta que ninguem marcar vence
       aceitando, e a propria carta diz isso antes. */
    /** @type {Record<string, string>} */
    mail: {},
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
 * ⚠ ATE 15/08/2026 ESTE ARQUIVO MONTAVA A CAMARA A MAO, e por isso a Mesa mentia.
 * Havia aqui um `forecastNow` que chamava `whipCount` com os QUATRO blocos do
 * catalogo, a verba crua e a lealdade crua — e o turno vota, desde a oitava sessao,
 * com as ONZE bancadas do ELENCO, a verba com o credito de memoria dentro e a
 * aprovacao da rua deslocando a resistencia. Nenhum dos dois motores quebrou nada
 * ao chegar; eles so chegaram, e esta funcao ficou para tras em silencio.
 *
 * Medido: em 1.012 votacoes, o veredito da Mesa saia INVERTIDO em 275 — 27,2% —, e
 * a divergencia chegava a 35 votos. "Acima do quorum" numa pauta que o mes derruba.
 *
 * A pauta tambem era composta duas vezes, com argumentos diferentes. Agora ha uma
 * porta so: `forecast` devolve a pauta, o placar, a banda e o que cada bloco
 * entrega — tudo da mesma camara que `playMonth` vai usar.
 */
function mesaInput() {
  const seen = forecast(state, orders, CATALOG);
  const bill = seen.agenda.proposal;

  return {
    bill,
    areaLabel: CATALOG.areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: seen.agenda.quorum,
    parties: CATALOG.parties,
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
    /* QUEM ASSINA A LEITURA DO MES. Ele nao vota e nao tem cadeira — a funcao dele
       e ser a unica voz do jogo que se dirige ao presidente. */
    adviser: governmentOf(state, CATALOG).adviser,
    base: current.base,
    seats: SEATS,
    majority: SIMPLE_MAJORITY,
    /* A BASE REPARTIDA PELO ESTADO DE QUEM A ENTREGA, e quem reparte e o motor:
       os limiares que separam obstrucao de ruptura sao calibragem de ECLUSA. */
    split: baseSplit({ parties: CATALOG.parties, loyalty: state.loyalty }),
    /* AS ONZE BANCADAS, com o que cada uma entrega — e o hemiciclo desenha 513
       cadeiras a partir disso. Quem conta e o motor. */
    chamber: chamberOf(state, CATALOG),
    /* ⚠ A PRIMEIRA CARTA DE VERDADE, e ela existia o tempo todo: o mes que fechou.
       O relatorio do turno e produzido desde a quinta sessao e vivia enterrado num
       bloco no rodape do Congresso — uma tela que o jogador pode nao visitar. O
       resultado de uma decisao chegando onde talvez ninguem olhe e consequencia
       invisivel, e o Gabinete e onde o mes COMECA.
       As outras cartas — Congresso propondo, relator devolvendo, tribunal
       derrubando — seguem sendo as Partes 3, 4 e 8, e a caixa continua dizendo o
       que falta na nota do estado vazio. */
    /* ⚠ A ORDEM E A DA URGENCIA, e nao a cronologica: as cartas da TRAMITACAO vem
       primeiro porque elas pedem uma decisao — a Mesa pautou, o relator emendou, o
       texto morreu na gaveta —, e o fechamento do mes so informa. Um inbox ordenado
       por hora poe o aviso na frente do pedido, e ai o jogador aprende a rolar. */
    /* ⚠ A CAIXA SAI DO ESTADO, e nao do ultimo relatorio. Ate 16/08/2026 ela lia
       `last.report.events` — e por isso era um mural: o que chegava sumia no mes
       seguinte. O que espera mora em `state.mail`, e e ele que tem prazo.

       E A LEITURA DO MES CONTINUA VINDO DO RELATORIO, de proposito: ela nao e
       correspondencia, e o fechamento do turno. Guarda-la faria o save carregar 48
       relatorios para reescrever um texto que o turno ja sabe produzir. */
    inbox: [
      ...mailHtml({
        mail: state.mail,
        people: governmentOf(state, CATALOG).people,
        left: letter => left(letter, state.month),
        /* ⚠ OS DOIS NUMEROS CRUS, E NAO A RAZAO ENTRE ELES. A frase com mais
           impacto seria "95% da despesa e obrigatoria" — e a divisao que a produz
           ja mora no cartao do Cofre, entao escreve-la aqui daria dois lugares
           fazendo a mesma conta, que e o defeito recorrente numero um deste
           projeto. Dois valores em reais dizem a mesma coisa sem abrir a segunda
           porta. */
        inherited: { mandatory: budget.mandatory, room: share.room },
        answered: orders.mail,
        /* QUEM PODE EXIGIR — a carta da chantagem precisa do NOME do grupo, e o nome
           mora no catalogo. Uma tabela de nomes nesta view seria a segunda verdade
           sobre quem sao os quatro. */
        lobbies: CATALOG.lobbies,
        /* ⚠ O CERCO SAI DO MOTOR, e a carta dele nao escreve numero proprio: o
           triplo da cadeira e `SIEGE_PRICE`, e os 342 de 513 sao a CF art. 86 no
           regime. Copiados na view, os dois mentiriam no dia em que mudassem. */
        siege: boilerOf(state, CATALOG),
      }),
      ...(last
        ? [
            monthLetterHtml({
              report: last.report,
              adviser: governmentOf(state, CATALOG).adviser,
              approval: pollFrom(state.mood, CATALOG.segments, CATALOG.opinion).good,
            }),
          ]
        : []),
    ],
    room: share.room,
    committed: share.demand,
    mandatory: budget.mandatory,
    revenue: budget.revenue,
    /* QUEM TRAVA O ORCAMENTO, perguntado ao motor de normas: a tela nao redescobre
       qual lei venceu a disputa de precedencia — ela pergunta a quem julgou. */
    locked: lockedBy(state, CATALOG),
    segments: CATALOG.segments,
    street: pollBySegment(),
    /* A CALDEIRA, perguntada ao motor: a tela nao remonta pressao nem redecide
       ruptura. */
    boiler: boilerOf(state, CATALOG),
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

  /* ⚠ A PROJECAO PASSOU A SER PERGUNTADA em 16/08/2026, e antes disso ela era
     REFEITA AQUI — com a prosa deste mesmo bloco afirmando o contrario, em
     maiusculas: "a projecao e a mesma conta do motor, e nao uma aproximacao escrita
     aqui". Ela era uma aproximacao escrita aqui, e estava errada.

     A MALHA consome o gasto CHEIO da area, ja rateado (`funded`), e esta linha
     projetava com `asked` — so a parte acima do piso. Na Previdencia sao R$ 2,4 bi
     contra R$ 126,7 bi. Medido no mes 1: em CINCO das oito areas a seta apontava
     para o lado errado.

     E o entrypoint nao pode calcular — `boundaries` existe por isso, e aqui a regra
     foi furada por uma linha que se anunciava como fiel. */
  const ahead = outlook(state, orders, CATALOG);

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
    projected: ahead.index[area.id] ?? value,
    idle: ahead.idle[area.id] ?? value,
    bands: lawNow(),
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
  /* ⚠ QUEM SABE SE O MANDATO ACABOU E O MOTOR. Ate 18/08/2026 esta pergunta era
     `state.fallen !== null` escrita aqui, e ela estava PELA METADE: pegava a queda e
     nao pegava o PRAZO — nada terminava o mandato aos 48 meses, e quem atravessasse
     os quatro anos entrava num "2o mandato" que nunca teve eleicao. */
  const term = termOf(state, CATALOG);

  el.railNav.innerHTML = railNavHtml(screen, CATALOG.areas);

  /* ⚠ DE QUEM E ESTE GOVERNO. Ele se repinta a cada pintura e nao so na abertura,
     porque a POSICAO muda: ela e derivada do que o jogador moveu no orcamento, e
     portanto anda junto com o mandato. O nome nao muda; a frase abaixo dele, sim. */
  const gov = governmentOf(state, CATALOG);
  el.railGov.innerHTML = railGovHtml({ president: gov.president, stance: gov.stance });

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
    /* ⚠ O EMBRULHO SAIU DAQUI em 15/08/2026, e ele nunca devia ter estado. Este
       trecho concatenava TRES pecas de vidro soltas, o que fazia do Congresso a
       unica tela do jogo montada no entrypoint — e portanto a unica cuja forma
       morava no arquivo que nao pode ter forma nenhuma. Agora `congressHtml` traz a
       lamina, a cabeca e os blocos, como toda outra view traz a dela. */
    el.main.innerHTML = congressHtml({
      gauges: capacityStripHtml({
        areas: CATALOG.areas,
        index: state.capacity.index,
        history: state.capacity.history,
      }),
      mesa: mesaHtml(mesaInput()),
      /* A GAVETA. Quem a conta e o motor: o quorum de cada texto e recomposto
         contra o pais de hoje, e nao contra o do dia em que ele foi assinado. */
      passage: passageHtml(passageOf(state, CATALOG)),
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
    el.main.innerHTML = closingHtml(term);
    el.main.dataset["screen"] = "closing";
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
    el.turn.innerHTML = turnHtml(state, term);
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

  /* ⚠ A RESPOSTA A UMA CARTA E ORDEM, e nao mutacao do estado — a razao esta em
     `state.mjs`, e ela e concreta: o VENCIMENTO acontece dentro do turno, e uma
     resposta que mudasse o estado aqui criaria dois caminhos para a mesma carta,
     com o resultado dependendo de qual chegasse primeiro no mes em que o prazo
     fecha. Marcar aqui e decidir; o mes e que resolve.

     E ELA VEM ANTES DA NAVEGACAO de proposito: o botao de escolha vive dentro de
     uma carta que tambem leva a uma tela, e a ordem inversa faria escolher navegar. */
  const choice = target.closest("[data-letter]");
  if (choice instanceof HTMLElement && choice.dataset["letter"] && choice.dataset["answer"]) {
    const id = choice.dataset["letter"];
    /* CLICAR DE NOVO NA MESMA SAIDA DESMARCA. Sem isso, uma carta respondida por
       engano so se desfaria escolhendo a outra — e escolher o contrario do que se
       quer para voltar atras nao e desfazer, e uma segunda decisao errada. */
    orders.mail[id] = orders.mail[id] === choice.dataset["answer"] ? "" : choice.dataset["answer"];
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
    const current = orders.bands[band] ?? lawNow()[band];
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
  /* ⚠ MANDATO ACABADO NAO E BLOQUEIO DE FLUXO, e a distincao importa porque o
     ciclo 9 proibiu o oposto: bloquear o turno para FORCAR uma resposta. Aqui nao ha
     turno para dar — o mandato acabou, e o botao para pela queda ou pelo PRAZO, que
     e a metade que faltava ate 18/08/2026. Quem quiser jogar de novo aperta "nova
     partida". */
  if (termOf(state, CATALOG).over) return;
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
  /* ⚠ O FECHO PUXA A TELA PARA SI no mes em que o mandato acaba, e so nesse mes.
     Sem isto o jogador que caisse estando em Financas continuaria em Financas, e a
     unica noticia do fim seria um botao que parou de responder — que e exatamente o
     defeito que este bloco existe para matar. */
  if (termOf(state, CATALOG).over) screen = "cabinet";

  transition(() => {
    resolving = false;
    endLabel();
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
  label(el.restart, UI.actions.restart, "");
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
  /* ⚠ A LEGENDA E OPCIONAL desde 16/08/2026, e o teste dela e um so: ela se paga
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
function endLabel() {
  const term = termOf(state, CATALOG);
  el.advance.disabled = term.over;
  label(
    el.advance,
    term.over ? UI.actions.ended : UI.actions.advance,
    term.over ? UI.actions.endedHint : "",
  );
}

endLabel();
label(el.restart, UI.actions.restart, "");
el.noticeClose.textContent = UI.actions.close;

paint();

/* O AVISO VEM DEPOIS DA PRIMEIRA PINTURA, e nao antes: um dialogo modal sobre
   uma tela em branco nao diz de onde ele veio. */
if (opening.refused) openNotice(UI.save.refusedTitle, UI.save.refusedBody);
