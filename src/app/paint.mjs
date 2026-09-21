/* A PINTURA — `paint` redesenha, `refresh` so troca numero derivado, `transition` troca de tela. */

import {
  CATALOG,
  MONTHS_PER_TERM,
  SEATS,
  SIMPLE_MAJORITY,
  STAGES,
  alertsOf,
  calendarOf,
  governmentOf,
  passageOf,
  pollFrom,
  silences,
  situationOf,
  termOf,
} from "../public/index.mjs";
import { LEVELS, glaze } from "../ui/shared/glass.mjs";
import { dressRail, paintRail, railGovHtml, railNavHtml } from "../ui/shared/rail.mjs";
import { closingHtml } from "../ui/screens/closing.mjs";
import {
  areaHtml,
  chainHtml,
  estadoHtml,
  lawReadHtml,
  outlookHtml,
  poolHtml,
  programReadHtml,
  riteOf,
} from "../ui/screens/area.mjs";
import {
  benchReadHtml,
  capacityStripHtml,
  congressHtml,
  mesaHtml,
  passageHtml,
  tallyHtml,
} from "../ui/screens/mesa.mjs";
import { financeHtml } from "../ui/screens/finance.mjs";
import { vitalsHtml, whenHtml } from "../ui/screens/dashboard.mjs";
import { bindAdvance, dressTopbar } from "../ui/shared/topbar.mjs";
import { cabinetHtml, dressDesk, emailHtml } from "../ui/screens/cabinet.mjs";
import { reportPanelHtml } from "../ui/screens/report.mjs";
import { UI } from "../ui/strings.mjs";
import { INFLATION_CEILING, lawNow, persistSeen, session } from "./session.mjs";
import { areaInput, cabinetInput, emailInput, financeInput, mesaInput } from "./inputs.mjs";

/** @typedef {import("../state/state.mjs").GameState} GameState */

export const el = {
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

/* ── PINTURA ──────────────────────────────────────────────────────────────── */

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
export function focusMark() {
  const node = document.activeElement;
  if (!(node instanceof HTMLElement) || node === document.body) return null;
  if (node.id) return `#${node.id}`;

  const parts = IDENTITY.filter(key => node.dataset[key] !== undefined).map(
    key => `[data-${key}=${CSS.escape(String(node.dataset[key]))}]`,
  );
  return parts.length > 0 ? node.tagName.toLowerCase() + parts.join("") : null;
}

export function paint() {
  /* ⚠ AQUI, E NAO NO FIM DA PINTURA: `cabinetInput` le `framed` mais abaixo nesta mesma
     funcao, e fixa-lo depois faria o parecer comparar o mes com o RETRASADO. */
  if (session.painted !== null && session.painted.month !== session.state.month)
    session.framed = session.painted;

  const focused = focusMark();
  const current = situationOf(session.state, CATALOG);
  /* ⚠ O BOTAO SE REPINTA JUNTO COM A TELA, e antes ele so se
     repintava ao FIM de um mes. Enquanto ele so dizia "Avancar o mes" isso bastava;
     agora ele carrega o preco do clique, e o preco cai no instante em que o jogador
     marca uma resposta na bandeja. Repintado so no fechamento, ele anunciaria uma
      pergunta sem resposta que o jogador acabou de responder. */
  /* ⚠ QUEM SABE SE O MANDATO ACABOU E O MOTOR. Antes esta pergunta era
     `state.fallen !== null` escrita aqui, e ela estava PELA METADE: pegava a queda e
     nao pegava o PRAZO — nada terminava o mandato aos 48 meses, e quem atravessasse
     os quatro anos entrava num "2o mandato" que nunca teve eleicao. */
  const term = termOf(session.state, CATALOG);
  endLabel(term);

  /* ⚠ O RAIL PERGUNTA A MALHA, e antes ele nao perguntava nada: os oito ministerios saiam
     identicos com Saude a 62 ou a 12, com o indice de cada um calculado todo mes ao lado. */
  el.railNav.innerHTML = railNavHtml(
    session.screen,
    CATALOG.areas,
    alertsOf(CATALOG.areas, session.state.capacity.index),
  );

  /* ⚠ DE QUEM E ESTE GOVERNO. Ele se repinta a cada pintura e nao so na abertura,
     porque a POSICAO muda: ela e derivada do que o jogador moveu no orcamento, e
     portanto anda junto com o mandato. O nome nao muda; a frase abaixo dele, sim. */
  const gov = governmentOf(session.state, CATALOG);
  el.railGov.innerHTML = railGovHtml({
    president: gov.president,
    stance: gov.stance,
    treatment: gov.treatment,
  });
  paintBoard(term);
  paintTopbar(term, current);
  restoreFocus(focused);
  dressAll();
  session.painted = session.state;
  session.standing = current;
}

/** O tabuleiro inteiro, pela tela corrente. @param {ReturnType<typeof termOf>} term */
function paintBoard(term) {
  /* CADA VIEW TRAZ O PROPRIO ELEMENTO DE FORA, e o entrypoint so concatena. A
     versao anterior montava aqui a `<div class="mesa">` que embrulha a tela — e
     isso e decisao de forma escrita no arquivo que nao pode ter nenhuma: quem
     desenha a Mesa passaria a ter de lembrar que a lamina dela mora no
     entrypoint. */
  const area = CATALOG.areas.find(item => item.id === session.screen);
  if (session.screen === "estado") {
    el.main.innerHTML = estadoHtml({
      rules: CATALOG.rules,
      levels: session.orders.levels,
      /* A LEI VIGENTE ATRAVESSA, como na tela de area. Sem ela a tela lia a faixa
         do catalogo — a do dia da posse — e anunciava o rito contra uma lei que
         pode nao ser mais a que vale. */
      bands: lawNow(),
      requestedBands: session.orders.bands,
    });
    el.main.dataset["screen"] = "estado";
  } else if (session.screen === "finance") {
    /* FINANCAS NAO ENTRA EM `refresh`, e e a unica tela assim junto do Gabinete.
       Nenhuma das duas tem controle para o arrasto proteger — quando um numero
       delas muda, e porque o mes virou ou porque o jogador mexeu em OUTRA tela, e
       nos dois casos a pintura inteira ja aconteceu. */
    el.main.innerHTML = financeHtml(financeInput());
    el.main.dataset["screen"] = "finance";
  } else if (area) {
    el.main.innerHTML = areaHtml(areaInput(area));
    el.main.dataset["screen"] = "area";
  } else if (session.screen === "congress") {
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
        index: session.state.capacity.index,
        /* A SERIE LONGA, e nao o buffer do atraso — ver a prosa em `financeInput`. */
        history: session.state.series.areas,
        /* O MESMO MOTOR QUE O RAIL LE: a faixa e o menu falam da mesma queda. */
        alerts: alertsOf(CATALOG.areas, session.state.capacity.index),
      }),
      mesa: mesaHtml(mesaInput()),
      /* A GAVETA. Quem a conta e o motor: o quorum de cada texto e recomposto
         contra o pais de hoje, e nao contra o do dia em que ele foi assinado. */
      /* O caminho vem do motor, e a tela so diz onde o texto esta dentro dele. */
      passage: passageHtml(passageOf(session.state, CATALOG), STAGES),
      report: reportPanelHtml(
        session.last && {
          report: session.last.report,
          quorum: session.last.quorum,
          parties: CATALOG.parties,
          areas: CATALOG.areas,
          loyaltyBefore: session.last.loyaltyBefore,
          indexBefore: session.last.indexBefore,
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
    el.main.innerHTML = closingHtml(term, governmentOf(session.state, CATALOG).treatment);
    el.main.dataset["screen"] = "closing";
  } else if (session.screen === "email") {
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
}

/** A barra superior repinta so o que mudou, por identidade de referencia.
 * @param {ReturnType<typeof termOf>} term @param {ReturnType<typeof situationOf>} current */
function paintTopbar(term, current) {
  /* RENDER POR IDENTIDADE DE REFERENCIA na barra superior. Como o estado e
     imutavel, `anterior.month !== atual.month` responde "esta parte mudou?" com
     uma comparacao direta — sem diff de arvore e sem framework.

     ⚠ A BARRA SUBSTITUIU O RAIL DA DIREITA, e com ele foram embora a faixa de
     contexto e o veredito: os tres campos daquela faixa viraram dois vitais
     (base e aprovacao) e o Gabinete. O que sobrou aqui e a data e os quatro
     numeros, e a regra e a mesma de antes — repinta so o que mudou. */
  const previous = session.painted;
  const before = session.standing;

  if (!previous || previous.month !== session.state.month) {
    /* ⚠ O PRAZO VEM DO CALENDARIO e nao de uma segunda conta aqui: `calendarOf` e funcao
       pura do mes, e refazer a distancia na tela daria a barra uma data de fim propria. */
    const ahead = calendarOf(session.state.month);
    const due = ahead.now[0] ?? ahead.soon[0] ?? null;
    el.turn.innerHTML = whenHtml({
      month: session.state.month,
      deadline: due ? { label: due.label, due: Number("due" in due ? due.due : 0) } : null,
      left: Math.max(0, MONTHS_PER_TERM - session.state.month),
      over: term.over,
    });
  }

  if (!previous || previous !== session.state) {
    const poll = pollFrom(session.state.mood, CATALOG.segments, CATALOG.opinion);
    /* ⚠ SEM MES ANTERIOR NAO HA TENDENCIA, e antes isto caia em `state` — o
       proprio mes servindo de passado, o que faz as quatro setas sairem em "nao moveu".
       Numa RECARGA `painted` volta nulo, entao a barra afirmava que nada tinha andado no
       mes 30 de um mandato em que tudo andou. Ausencia nao e resultado: agora a barra
       recebe `null` e nao desenha seta nenhuma. */
    /* ⭐ AS QUATRO SERIES EXISTEM SEM MOTOR NOVO. PIB e inflacao vem de `series`; aprovacao
       vem dos cartoes do mes, que guardam a rua de cada fechamento. Nenhuma linha desenhada
       aqui e inventada, e a que nao tem historia nao desenha. */
    const past = [...session.state.months].reverse();
    el.vitals.innerHTML = vitalsHtml({
      macro: session.state.macro,
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
      approvalFrom: Math.max(0, session.state.month - past.length),
      series: {
        gdp: session.state.series.gdp,
        inflation: session.state.series.inflation,
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
  const siege = session.state.impeachment !== null && session.state.fallen === null ? "true" : "";
  if (el.shell.dataset["siege"] !== siege) el.shell.dataset["siege"] = siege;
}

/** @param {string | null} focused */
function restoreFocus(focused) {
  /* ⚠ E O FOCO VOLTA POR ULTIMO, depois de toda peca estar no lugar. `preventScroll` porque
     devolver o foco nao e pedir para rolar: sem ele, a linha do indice puxava a pagina. */
  if (focused) {
    const back = document.querySelector(focused);
    if (back instanceof HTMLElement && back !== document.activeElement) {
      back.focus({ preventScroll: true });
    }
  }
}

/** O vidro se veste depois da pintura, na mesma volta. */
function dressAll() {
  /* ⚠ O VIDRO SE VESTE NA MESMA VOLTA, e nao no quadro seguinte: entre a escrita e o
     proximo quadro cabe uma pintura, e nela o bloco aparecia sem a justificacao — largo, e
     so depois encolhendo. A barra e menu fixo, e menu fixo nao se refaz na tela. */
  dressTopbar(document);
  /* O menu se veste na mesma volta que a barra, e depois da lista: a pilula mede o item. */
  paintRail(session.screen);
  /* ⚠ OS PALCOS SE VESTEM DEPOIS DA PINTURA, e nao antes: a lente e a pele saem do tamanho da
     caixa, e antes do conteudo a caixa ainda nao tem o dela. */
  for (const stage of document.querySelectorAll(".glass-stage")) {
    if (stage instanceof HTMLElement) glaze(stage, LEVELS.regular);
  }
  dressActions();
  bindAdvance(el.advance);
}

/**
 * O QUE ESTA NA TELA AGORA VIRA LIDO, e o que sumiu do jogo sai da memoria.
 *
 * ⚠ ELA LE O DOM DE PROPOSITO. Este e um dos poucos lugares do projeto em que isso e o
 * certo: a pergunta nao e "qual carta deveria estar aberta" — que a bandeja ja respondeu
 * — e sim "qual esta". Recalcular aqui daria dois lugares decidindo a mesma coisa, e o
 * segundo divergiria do primeiro no mes em que a ordem de urgencia mudasse.
 */
export function rememberRead() {
  const rows = /** @type {HTMLElement[]} */ ([...el.main.querySelectorAll(".tray__row")]);
  if (rows.length === 0) return;

  /* ⚠ POR CONTEUDO, E NAO POR TAMANHO. `readMail.size !== before` pulava a gravacao quando a
     poda tirava um id morto e a leitura acrescentava um novo NA MESMA PINTURA: medido, o disco
     ficava com carta morta e sem a marca nova por quatro meses, e 6 de 7 cartas voltavam
     nao-lidas depois do F5. */
  const before = [...session.readMail].sort().join("|");

  /* A PODA PRIMEIRO: so sobrevive quem ainda esta na bandeja. */
  const alive = new Set(rows.map(row => row.dataset["dispatch"] ?? ""));
  for (const id of session.readMail) if (!alive.has(id)) session.readMail.delete(id);

  const current = /** @type {HTMLElement | null} */ (
    el.main.querySelector('.tray__row[aria-current="true"]')
  );
  const id = current?.dataset["dispatch"];
  if (id) session.readMail.add(id);

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
  if ([...session.readMail].sort().join("|") !== before) persistSeen();
}

/** So os numeros derivados, para o arrasto sobreviver. */
export function refresh() {
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
        funding: session.orders.funding[party.id] ?? 0,
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
      const level = session.orders.levels[rule.id] ?? rule.initial;
      const band = session.orders.bands[rule.id] ?? law[rule.id];
      const slot = el.main.querySelector(`[data-read="${rule.id}"]`);
      if (slot) slot.innerHTML = programReadHtml({ program: rule, level, ...(band && { band }) });
      const dial = el.main.querySelector(`.dial:has([data-program="${rule.id}"])`);
      if (dial instanceof HTMLElement) {
        dial.dataset["rite"] = riteOf({ ...rule, ...(band ?? {}) }, level);
      }
    }
    return;
  }

  const area = CATALOG.areas.find(item => item.id === session.screen);
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
    const band = session.orders.bands[program.id];
    const slot = el.main.querySelector(`[data-read="${program.id}"]`);
    if (slot) {
      slot.innerHTML = programReadHtml({
        program,
        level: session.orders.levels[program.id] ?? program.initial,
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
        { ...program, ...(session.orders.bands[program.id] ?? {}) },
        session.orders.levels[program.id] ?? program.initial,
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
export function transition(depois) {
  const start = document.startViewTransition?.bind(document);
  if (!start) {
    paint();
    depois?.();
    return;
  }

  const view = start(paint);

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
  view.finished
    .catch(() => {})
    .then(() => {
      dressRail();
      depois?.();
    });
}

/* ⛔ A PECA DO DIALOGO SO TEM CAIXA DEPOIS DE ABRIR: `<dialog>` fechado mede zero, e `glaze`
   recusa peca menor que 9px — a carta e os dois botoes nunca se vestiam na pintura. */
export function dressActions() {
  for (const card of document.querySelectorAll("dialog .glass-stage")) {
    if (card instanceof HTMLElement) glaze(card, LEVELS.regular);
  }
  for (const action of document.querySelectorAll(".glass-action")) {
    if (action instanceof HTMLElement) glaze(action, LEVELS.thick);
  }
}

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
export function label(node, text, hint) {
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
export function endLabel(/** @type {ReturnType<typeof termOf> | null} */ term_ = null) {
  const term = term_ ?? termOf(session.state, CATALOG);
  /* ⚠ `|| resolving` — E ELE VALE UM MES INTEIRO DE CLIQUE. `paint` chama esta funcao, e
     `paint` roda no PRIMEIRO quadro da View Transition: sem a trava aqui, o botao voltava a
     ficar clicavel enquanto o mes ainda estava resolvendo. A janela e a transicao inteira, e
     o clique dela cai no `if (resolving) return` — sem erro, sem aviso, sem nada.

     Medido num navegador de verdade, clicando a cada 200 ms: TRES cliques produziam UM mes.
     O defeito nasceu quando o botao passou a se repintar junto com a tela. */
  el.advance.disabled = term.over || session.resolving;

  const quiet = term.over
    ? []
    : silences({
        mail: session.state.mail,
        orders: session.orders.mail,
        month: session.state.month,
      });
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
        ? `${Math.max(0, MONTHS_PER_TERM - session.state.month)} ${UI.closing.monthsLeft}`
        : /* ⛔ ELE CONTA E NAO NOMEIA, e a medida decidiu: nomeando a carta a legenda pedia
             366px numa coluna de 185, e o pedaco que sobrava era metade de um assunto. O
             numero cabe, e quem nomeia e a Caixa — que e onde se responde. */
          `${quiet.length} ${quiet.length === 1 ? UI.actions.silenceOne : UI.actions.silenceMany}`,
  );
}
