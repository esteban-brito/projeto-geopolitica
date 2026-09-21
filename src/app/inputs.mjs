/* AS ENTRADAS — o que cada tela precisa saber, derivado do motor e nunca guardado. */

import { OPENING_MONTH } from "../state/state.mjs";
import {
  CATALOG,
  HORIZON,
  SEATS,
  SIMPLE_MAJORITY,
  THRESHOLDS,
  boilerOf,
  chainOf,
  forecast,
  governmentOf,
  ledger,
  left,
  outlook,
  pledgesOf,
  pollFrom,
  settlement,
  silences,
  situationOf,
  trajectory,
} from "../public/index.mjs";
import { describeMail, describeMonth, trayHtml } from "../ui/screens/inbox.mjs";
import { INFLATION_CEILING, lawNow, session } from "./session.mjs";

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
export function mesaInput() {
  const seen = forecast(session.state, session.orders, CATALOG);
  const bill = seen.agenda.proposal;

  return {
    bill,
    areaLabel: CATALOG.areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: seen.agenda.quorum,
    parties: CATALOG.parties,
    /* A SUA BANCADA VAI MARCADA, e ela e a unica coisa da tela do Congresso que nao muda de
       mes para mes: o partido do presidente e escolhido na posse e nao se troca. */
    ruling: session.state.party ?? null,
    loyalty: session.state.loyalty,
    /* A LINHA DA BANCADA MOSTRA A PROMESSA — a fracao e o custo do que o jogador
       ofereceu, que e o que ele controla. Os VOTOS ao lado saem do que sera
       pago. Sob corte, os dois divergem na mesma linha, e essa divergencia e a
       licao central do jogo: promessa nao move voto. A linha de caixa embaixo
       diz por que, com o numero. */
    funding: session.orders.funding,
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
export function financeInput() {
  const { budget, interest, debt, debtRatio, premium } = ledger(
    session.state,
    session.orders,
    CATALOG,
  );

  return {
    macro: session.state.macro,
    budget,
    interest,
    debt,
    debtRatio,
    premium,
    series: session.state.series,
    target: CATALOG.macro.inflationTarget,
    ceiling: INFLATION_CEILING,
    areas: CATALOG.areas,
    index: session.state.capacity.index,
    /* ⚠ A FONTE MUDOU, e ela era a ERRADA desde que a coluna nasceu. Isto
       era `state.capacity.history` — o buffer do ATRASO, que a MALHA mantem com `lag + 1`
       valores porque e assim que o mecanismo funciona. O estado guarda uma SEGUNDA serie,
       longa e feita para isto, e a prosa dela em `state.mjs` diz a diferenca com todas as
       letras: "o historico e curto e ALIMENTA O MOTOR; a serie e longa e alimenta os
       OLHOS". Ninguem tinha vindo trocar. Ver o achado 42 na retomada. */
    history: session.state.series.areas,
  };
}

/* O QUE A CAIXA CONSOME — e ela e a UNICA que sobrou deste montador.
   ⚠ ELE ERA COMPARTILHADO COM O GABINETE, e a razao registrada era boa: "as duas leituras
   saem do MESMO `settlement` do mes". Ela caiu quando o Gabinete virou mesa — ele nao le mais
   leitura nenhuma, so o ato do mes. */
/* AS CARTAS COM CONTEUDO, para a Caixa e para a mesa: a MESMA montagem, com a mesma gente, o
   mesmo tratamento e as mesmas opcoes. Duas chamadas divergiriam no primeiro parametro novo. */
/** @param {ReadonlyArray<import("../state/state.mjs").Letter>} mail */
export function dispatchesOf(mail) {
  const current = situationOf(session.state, CATALOG);
  const { budget } = ledger(session.state, session.orders, CATALOG);
  const share = settlement(session.state, session.orders, CATALOG);
  const gov = governmentOf(session.state, CATALOG);
  return describeMail({
    mail,
    people: gov.people,
    treatment: gov.treatment,
    left: letter => left(letter, session.state.month),
    /* ⚠ OS DOIS NUMEROS CRUS, E NAO A RAZAO ENTRE ELES. A frase com mais
     impacto seria "95% da despesa e obrigatoria" — e a divisao que a produz
     ja mora no cartao do Cofre, entao escreve-la aqui daria dois lugares
     fazendo a mesma conta, que e o defeito recorrente numero um deste
     projeto. Dois valores em reais dizem a mesma coisa sem abrir a segunda
     porta. */
    inherited: { mandatory: budget.mandatory, room: share.room },
    answered: session.orders.mail,
    /* ⚠ AS OPCOES VEM DA FACHADA, e o que esta marcado tem DUAS fontes: antes de a posse
       fechar, o rascunho do mes; depois dela, o estado — a carta continua na caixa e
       continua mostrando o que foi prometido. */
    pledges: pledgesOf(CATALOG),
    platform: { ...session.state.platform, ...session.orders.platform },
    /* QUEM PODE EXIGIR — a carta da chantagem precisa do NOME do grupo, e o nome
     mora no catalogo. Uma tabela de nomes nesta view seria a segunda verdade
     sobre quem sao os quatro. */
    lobbies: CATALOG.lobbies,
    /* ⚠ O CERCO SAI DO MOTOR, e a carta dele nao escreve numero proprio: o
     triplo da cadeira e `SIEGE_PRICE`, e os 342 de 513 sao a CF art. 86 no
     regime. Copiados na view, os dois mentiriam no dia em que mudassem. */
    siege: boilerOf(session.state, CATALOG),
    /* AS CADEIRAS E O QUORUM, para a carta da MINORIA. Os dois ja estao calculados
       nesta funcao — a tela nao soma bancada de novo. */
    chamber: { base: current.base, majority: SIMPLE_MAJORITY, seats: SEATS },
    /* ⚠ OS MESES FECHADOS, e nao para a carta do mes: a carta do PLENARIO nao guarda o
       proprio placar, e ele ja mora aqui desde a versao 19. */
    months: session.state.months,
    /* AS CLASSES, so pelo ROTULO: o anexo da carta da rua nomeia as linhas, e os
         numeros dele ja vem pesados dentro da propria carta. */
    segments: CATALOG.segments,
    /* AS BANCADAS, so pelo ROTULO: a lealdade e as cadeiras chegam na propria
         carta, gravadas no mes em que ela foi escrita. */
    parties: CATALOG.parties,
  });
}

export function emailInput() {
  const gov = governmentOf(session.state, CATALOG);

  return {
    resolved: session.state.month > OPENING_MONTH,
    inbox: trayHtml({
      open: session.openDispatch,
      seen: [...session.readMail],
      dispatches: [
        /* ⚠ O FECHAMENTO DO MES ABRE O BLOCO DELE, e concatenado no FIM ele fechava: a ordem
           e por mes e o desempate e a posicao na lista, entao a carta mais nova do mes caia
           embaixo das que ja estavam la. Palavras dele: "a mensagem Mes sem pauta vai pra
           ultimo na ordem, sendo que ela e mais recente". */
        /* ⚠ UM CARTAO POR MES FECHADO, e nao so o ultimo: eles agora moram no save, entao o
           resumo de marco continua na caixa em dezembro — e atravessa o F5. */
        ...session.state.months.map(
          (/** @type {import("../state/state.mjs").MonthCard} */ fechado) =>
            describeMonth({ report: fechado, adviser: gov.adviser }),
        ),
        /* ⚠ A ORDEM NAO MORA MAIS AQUI, e a mudanca e de endereco e nao de regra: quem
           ordena e `trayHtml`, onde ela e funcao pura e tem prova. No entrypoint ela so era
           alcancavel pelo passeio, e passou meses com as perguntas nao ordenadas entre si. */
        ...dispatchesOf(session.state.mail),
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
export function closestToBreak(lobbies) {
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
export function onDesk(closed, dying) {
  const here = session.state.mail
    .filter(letter => letter.month === closed || dying.has(letter.id))
    /* O QUE VENCE CAI POR CIMA: e o que uma pessoa faz com a correspondencia urgente. */
    .sort((a, b) => Number(dying.has(a.id)) - Number(dying.has(b.id)));
  const dispatches = dispatchesOf(here);
  return here.map(letter => ({
    urgent: dying.has(letter.id),
    dispatch: dispatches.find(dispatch => dispatch.id === letter.id) ?? null,
  }));
}

export function cabinetInput() {
  const share = settlement(session.state, session.orders, CATALOG);
  const { budget } = ledger(session.state, session.orders, CATALOG);
  const current = situationOf(session.state, CATALOG);
  const boiler = boilerOf(session.state, CATALOG);
  const street = pollFrom(session.state.mood, CATALOG.segments, CATALOG.opinion);
  /* ⚠ UMA VEZ POR MONTAGEM, e nao tres: `governmentOf` refaz o elenco da semente a cada
     chamada, e o presidente, o nome do chefe e o genero dele saem do MESMO governo. */
  const gov = governmentOf(session.state, CATALOG);

  /* ⚠ QUEM CONTA O QUE VENCE E O MOTOR. `silences` e `settle` filtrada: a tela nao pergunta se
     o prazo passou — escrever `left(carta) <= 0` por fora e a familia de defeito mais cara
     deste projeto, com sete ocorrencias. */
  const quiet = silences({
    mail: session.state.mail,
    orders: session.orders.mail,
    month: session.state.month,
  });
  const dying = new Set(quiet.map(letter => letter.id));

  /* ⛔ O MES DA CARTA E O MES EM QUE ELA CHEGOU, E A TELA PINTA COM O MES JA VIRADO: o turno
     grava a carta com o mes que fechou e devolve o estado no seguinte. Comparar com
     `state.month` dava zero em 47 dos 48 meses, e a mesa existia sem correspondencia nenhuma
     — nada falhava. Quem diz qual mes fechou e o motor, e nao uma subtracao aqui. */
  const closed = session.state.months[0]?.month ?? session.state.month;

  return {
    room: share.room,
    ratio: share.ratio,
    /* ⭐ QUEM ASSINA SAI DA SEMENTE, e nao de um nome escrito na tela: o elenco inteiro se
       refaz dela, e o presidente e a primeira pessoa dele. */
    president: gov.president.name,
    month: session.state.month,
    areas: CATALOG.areas,
    protect: session.orders.protect ?? [],
    /* ⭐ O PARECER — as seis leituras do filtro do ciclo 21, cada uma da funcao que o turno
       executa. A tela nao escolhe o grupo nem soma bancada: ela recebe. */
    brief: {
      month: session.state.month,
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
      standing: street.good,
      /* ⚠ O MES PASSADO NAO E `painted`: aquele e a ULTIMA PINTURA, e do segundo repinte do
         mes em diante ela ja e o mes corrente. Medido: um clique na caixa levava as setas a
         `flat`, e `flat` afirma que nao andou.
         ⛔ E O PARECER RECEBE O NUMERO, e nao a direcao: quem escreve "caiu 2 pontos" e uma
         pessoa; seta e desenho de tela, e no papel ela nao entra. */
      was:
        session.framed === null
          ? null
          : pollFrom(session.framed.mood, CATALOG.segments, CATALOG.opinion).good,
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
    sheets: session.state.mail.filter(letter => letter.due !== null && letter.answer === null)
      .length,
    /* O TELEFONE TOCA SE ALGUEM FERVEU, e quem diz e o motor — o mesmo `boiling` que a ruptura
       economica le. O primeiro basta: o telefone toca uma vez, e a Caixa lista todos. */
    boiling: boiler.lobbies.find(lobby => lobby.boiling)?.label ?? null,
  };
}

/**
 * @param {import("../public/index.mjs").Area} area
 */
export function areaInput(area) {
  const value = session.state.capacity.index[area.id] ?? area.initial;
  const share = settlement(session.state, session.orders, CATALOG);
  const spent = share.asked[area.id] ?? 0;

  /* ⚠ A PROJECAO E PERGUNTADA, e ela ja foi REFEITA AQUI — com a prosa deste mesmo
     bloco afirmando o contrario, em maiusculas. A MALHA consome o gasto CHEIO da area,
     ja rateado (`funded`), e a linha antiga projetava com `asked`, so a parte acima do
     piso: na Previdencia sao R$ 2,4 bi contra R$ 126,7 bi. Medido no mes 1, em CINCO
     das oito areas a seta apontava para o lado errado.

     E o entrypoint nao pode calcular — `boundaries` existe por isso, e a regra foi
     furada justamente por uma linha que se anunciava como fiel. */
  const ahead = outlook(session.state, session.orders, CATALOG);
  const curve = trajectory(session.state, session.orders, CATALOG);

  return {
    area,
    value,
    /* A SERIE LONGA, e nao o buffer do atraso — ver a prosa em `financeInput`. */
    history: session.state.series.areas[area.id] ?? [],
    programs: CATALOG.programs.filter(program => program.area === area.id),
    levels: session.orders.levels,
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
    requestedBands: session.orders.bands,
    /* ⚠ A CORRENTE COME `funded`, E NAO `spent` — e este e o MESMO defeito que a projecao ja
       pagou uma vez: `spent` e a parte acima do piso, e a MALHA consome o gasto CHEIO da area.
       Na Previdencia sao R$ 2,4 bi contra R$ 126,7, e a linha do orcamento anunciaria +0,02
       onde o motor poe +1,22. Duas leituras da mesma alavanca, na mesma tela. */
    chain: chainOf(session.state, area.id, share.funded[area.id] ?? 0),
    /* ⚠ A RAZAO DO CORTE VEM DO RATEIO DO TURNO, e nao de `room / demand` refeito aqui: o
       decreto muda a conta — o que esta protegido sai dos DOIS lados dela —, e uma divisao
       feita na tela anunciaria um corte que o mes nao vai executar. */
    ratio: share.ratio,
    areas: CATALOG.areas,
  };
}
