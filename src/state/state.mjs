/* ESTADO — imutavel, e um reducer puro como unica forma de muda-lo.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE IMUTAVEL. Num jogo de turnos, quatro coisas caem de graca quando o
   estado nunca e mutado no lugar:

     · SAVE e serializar o estado. Nao existe "campo que ficou de fora";
     · REPLAY determinstico: mesma seed, mesmas acoes, mesmo resultado;
     · RENDER POR IDENTIDADE: `anterior.approval === atual.approval` significa
       "esta parte da tela nao mudou". E reatividade correta sem framework e sem
       biblioteca de sinais — mas so funciona porque o objeto e novo quando, e
       somente quando, o conteudo mudou;
     · TESTE de um turno sem UI nenhuma.

   O congelamento e permanente, e nao so em desenvolvimento: o estado e pequeno,
   o custo e desprezivel, e uma mutacao acidental que so falha em producao e
   exatamente o defeito que isto existe para impedir. */

import { CATALOG } from "../data/catalog.mjs";
import { opening } from "../domain/capacity/index.mjs";
import { opening as economyOpening } from "../domain/economy/index.mjs";
import { opening as opinionOpening } from "../domain/opinion/index.mjs";
import { streamFrom } from "./random.mjs";

/**
 * A SITUACAO NAO MORA MAIS AQUI. Ela e funcao pura do teto do orcamento e do
 * humor das bancadas — dois valores que o estado ja guarda —, e por isso vive em
 * `src/application/turn.mjs`, que e a camada que enxerga os dois motores. O tipo
 * fica declarado neste arquivo porque ele descreve uma forma do jogo, e nao um
 * detalhe daquela funcao.
 *
 * @typedef {"crisis" | "stable" | "growth"} Situation
 *
 * A APROVACAO E DERIVADA, E O QUE ATRAVESSA OS MESES E O HUMOR.
 *
 * ⚠ ELA VOLTOU AO ESTADO EM 14/08/2026, e por tres sessoes esteve fora da tela
 * com a razao escrita: "quem a produz e SONDA, que nao existe". Agora existe — e
 * o que se guarda nao e a pesquisa, e a SATISFACAO de cada segmento. A pesquisa
 * e a conversao dela, e valor derivado guardado e um segundo lugar para a mesma
 * verdade divergir.
 *
 * @typedef {import("../domain/opinion/index.mjs").Approval} Approval
 *
 * @typedef {import("./random.mjs").Stream} Stream
 *
 * @typedef {object} Streams
 * @property {Stream} events - o fluxo de TEMPORAL
 * @property {Stream} congress - o fluxo de ECLUSA
 *
 * @typedef {import("../domain/economy/index.mjs").MacroState} MacroState
 *
 * ⚠ O PIB SAIU DA POSICAO FISCAL em 13/08/2026. Ele era um campo do orcamento
 * que so andava por premissa passada de fora, porque nao existia motor
 * macroeconomico nenhum. Agora existe, e o PIB e estado DELE: quem o move e a
 * CORRENTE, e
 * o orcamento passa a ler em vez de guardar. Duas verdades sobre quanto o pais
 * produz seria a divergencia mais cara que este modelo poderia ter, porque tudo
 * — receita, divida sobre PIB, hiato — se pendura nela.
 *
 * @typedef {object} Fiscal
 * @property {number} mandatory - despesa obrigatoria anualizada, ja crescida
 * @property {number} anchorRevenue - receita do exercicio anterior; a ancora da regra
 * @property {number} anchorExpense - despesa total do exercicio anterior
 * @property {number} debt - divida bruta
 *
 * A SERIE — a memoria do painel, e nao entrada de motor nenhum.
 *
 * ⚠ ELA E ESTADO DE VERDADE, e nao valor derivado. O passado nao se recalcula a
 * partir do presente: saber que a inflacao esteve em 9% no mes 14 e informacao
 * que so existe se alguem a guardou. E a mesma razao do historico da capacidade
 * existir — com uma diferenca declarada: aquele alimenta a CASCATA, este so
 * alimenta os olhos.
 *
 * QUEM A MANTEM E O TURNO, e nao a CORRENTE. O motor faz equacao; guardar
 * historico para desenhar linha e trabalho de quem compoe, e po-lo dentro do
 * motor faria a economia carregar uma responsabilidade de interface.
 *
 * @typedef {object} Series
 * @property {number[]} gdp
 * @property {number[]} inflation
 * @property {number[]} rate
 * @property {number[]} unemployment
 * @property {number[]} debtRatio
 * @property {number[]} primary - o resultado primario do mes, em bilhoes
 *
 * @typedef {object} Capacity
 * @property {Record<string, number>} index - o indice corrente de cada area
 * @property {Record<string, number[]>} history - o passado que o atraso consome
 *
 * AS FAIXAS — e elas sao AS LEIS DO PAIS, guardadas como numero.
 *
 * ⚠ ELAS SAIRAM DO CATALOGO EM 14/08/2026, e a mudanca e a maior deste ciclo. O
 * piso da atencao basica em 59 pontos nunca foi um detalhe de interface: e a
 * vinculacao constitucional da saude existindo como mecanica. Enquanto ele morava
 * no catalogo, ele era imutavel — e um jogo sobre governar em que as leis sao
 * imutaveis e um jogo sobre administrar.
 *
 * Com a faixa no estado, os tres verbos caem sozinhos e sem objeto novo nenhum:
 * ALTERAR uma lei e mover o piso ou o teto; CRIAR uma lei e por uma faixa onde
 * nao havia; EXCLUIR e solta-la. Sao alavancas que movem as faixas de OUTRAS
 * alavancas, e o preco ja existia — mexer numa faixa protegida pela Constituicao
 * custa os mesmos 308 votos que atravessa-la custa.
 *
 * O QUE NAO ENTRA AQUI E A GUARDA. Ela fica no catalogo e e imutavel, porque ela
 * e a NATUREZA da norma e nao o conteudo dela: o jogador muda o que a lei manda,
 * e nao de que tipo ela e. Uma vinculacao constitucional que virasse ordinaria por
 * decisao do proprio governo seria o Executivo escolhendo quanto custa mudar de
 * ideia.
 *
 * @typedef {object} Band
 * @property {number} floor - o que a lei OBRIGA
 * @property {number} ceiling - o que a lei AUTORIZA
 *
 * @typedef {object} GameState
 * @property {number} schemaVersion - versao do formato do save
 * @property {number} seed - a semente da partida; com ela e as acoes, tudo se refaz
 * @property {number} month - meses decorridos desde a posse (0 = janeiro do ano 1)
 * @property {Record<string, number>} mood - a satisfacao de cada segmento, de 0 a 100
 * @property {Record<string, number>} loyalty - o humor de cada bancada, de 0 a 100
 * @property {Fiscal} fiscal - a posicao orcamentaria que atravessa os meses
 * @property {MacroState} macro - PIB, potencial, inflacao, juro, desemprego, populacao
 * @property {Capacity} capacity - a capacidade do Estado de entregar, por area
 * @property {Series} series - o que ja aconteceu, para o painel desenhar
 * @property {Record<string, number>} levels - a intensidade VIGENTE de cada programa
 * @property {Record<string, Band>} bands - a faixa VIGENTE de cada alavanca; a lei
 * @property {Streams} streams
 */

/* Versao do save. Toda mudanca de forma exige uma migracao explicita.
   SUBIU PARA 2 quando a semente e os fluxos entraram no estado: um save da
   versao 1 nao tem como sortear nada, e carrega-lo produziria um jogo que
   parece funcionar ate o primeiro evento.
   SUBIU PARA 3 quando lealdade e posicao orcamentaria entraram. Um save da
   versao 2 nao sabe quanto o governo deve nem quem ainda esta com ele — e o
   sintoma seria pior que um erro: a partida abriria com a base zerada e o
   Congresso inteiro em ruptura, que e um estado de jogo valido e portanto
   indistinguivel de um defeito.
   SUBIU PARA 4 quando a capacidade do Estado entrou. Um save da 3 nao tem
   indice de area nenhum, e o mesmo argumento vale com mais forca: abri-lo com
   zeros daria um pais com saude, educacao e seguranca no chao, que e uma
   partida dificil e valida — e portanto impossivel de distinguir de um save
   corrompido.
   SUBIU PARA 5 quando a lista do que ja esta em vigor entrou. Sem ela o jogo nao
   sabe que uma lei ja passou, e o sintoma seria o jogador aprovando a mesma
   reforma seis vezes e colhendo o efeito fiscal seis vezes — um exploit que a
   tela nem precisaria esconder, porque ela nao teria como saber.
   SUBIU PARA 6 quando a SITUACAO saiu do estado. Ela e funcao pura do que ja
   esta guardado — o teto do orcamento e o humor das bancadas —, e valor derivado
   guardado e um segundo lugar para a mesma verdade divergir. E a mesma razao
   que impediu a capacidade de nascer preenchida a mao. Um save da versao 5 e
   recusado em vez de convertido: converter exigiria decidir se o campo antigo
   vale mais que o calculo, e ele nao vale.
   SUBIU PARA 7 quando o ORCAMENTO virou o estado e a lista `enacted` saiu.

   As duas mudancas sao a mesma: o jogo deixou de escolher acoes numa lista e
   passou a escrever o orcamento programa a programa. `levels` guarda a
   intensidade vigente de cada um, e ELE E "o que ja esta em vigor" — a lista de
   ids aprovados existia para responder essa pergunta, e agora a resposta e o
   proprio numero. Guardar as duas seria manter um registro do que foi decidido ao
   lado do resultado do que foi decidido, e os dois divergem no primeiro remendo.

   Um save da versao 6 e recusado, e nao convertido. Converter exigiria adivinhar
   em que nivel cada programa estava a partir de uma lista de leis aprovadas — e
   nao ha como: a mesma lei aprovada podia ter sido executada com verba cheia ou
   contingenciada a metade. O save antigo fica guardado, como sempre.
   SUBIU PARA 8 quando a CORRENTE nasceu e o PIB mudou de dono. Um save da 7 nao
   tem inflacao, juro, desemprego nem PIB potencial — e o potencial e o que nao
   da para inventar: ele carrega a historia inteira de quanto o pais investiu em
   capacidade, e chuta-lo em qualquer valor conta uma historia que aquele mandato
   nao viveu.
   SUBIU PARA 9 quando a Producao virou DUAS areas. Um save da versao 8 guarda um
   indice de capacidade para `production` e niveis para cinco programas que nao
   existem mais — e nao ha conversao honesta: repartir o indice de uma area em
   duas exigiria decidir quanto daquela capacidade era lavoura e quanto era
   fabrica, e o save nao guarda essa informacao porque ela nunca existiu
   separada.
   SUBIU PARA 10 quando as FAIXAS viraram estado. Um save da versao 9 nao guarda
   lei nenhuma, e converter parece trivial — bastaria copiar as faixas do catalogo
   — mas seria mentira: aquele mandato pode ter aprovado uma emenda que derrubou um
   piso, e o save nao tem como dizer. Restaurar do catalogo devolveria a
   Constituicao original a um pais que a mudou, e o jogador veria a propria reforma
   desaparecer sem aviso.
   SUBIU PARA 11 quando SONDA nasceu e a aprovacao voltou ao estado. Um save da 10
   guarda `approval` — as tres fatias da pesquisa — e o que o jogo passa a precisar
   e a SATISFACAO por segmento, que e outra coisa: a pesquisa e a conversao dela, e
   a conversao nao tem inversa util. Converter chutaria uma satisfacao que produz
   aquelas fatias e distribuiria igual entre as tres classes — apagando a
   polarizacao, que e justamente a informacao que o motor existe para dar. */
export const SCHEMA_VERSION = 11;

/* O HUMOR DE ABERTURA da base. Uniforme de proposito nesta fase: uma coalizao
   recem-formada por rateio de ministerio nao tem historia com o governo, e
   diferenciar as bancadas aqui seria contar uma que ninguem escreveu. Elas
   divergem a partir do primeiro mes, e divergem pelo que o jogador fizer. */
export const INITIAL_LOYALTY = 70;

/* A semente de uma partida sem semente escolhida. Ela e CONSTANTE de proposito:
   um padrao tirado do relogio faria duas partidas "iguais" divergirem, e a
   primeira coisa que se perde num jogo assim e a capacidade de reproduzir um
   defeito relatado. Quem quiser variedade passa a semente. */
export const DEFAULT_SEED = 20270101;

/**
 * Congela em profundidade. O estado e uma arvore rasa de objetos simples.
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
function deepFreeze(value) {
  if (value === null || typeof value !== "object") return value;
  for (const key of Object.keys(value)) {
    deepFreeze(/** @type {Record<string, unknown>} */ (value)[key]);
  }
  return Object.freeze(value);
}

/**
 * O estado de abertura.
 *
 * ⚠ OS NUMEROS SAO ANDAIME, nao calibracao. Eles existem para a tela de
 * referencia ter o que mostrar e serao substituidos pelo catalogo real quando
 * SONDA e CORRENTE nascerem. Nenhum deles cita fonte porque nenhum deles e
 * afirmacao sobre o Brasil — e essa e a diferenca entre um numero provisorio
 * declarado e um numero inventado que vira dividia silenciosa.
 *
 * A POSICAO ORCAMENTARIA, ao contrario, NAO e andaime: ela sai do catalogo, que
 * declara a ficcao dele em `src/data/fiscal.mjs`. O catalogo entra por parametro
 * com o real por padrao — e assim a calibragem consegue abrir uma partida com
 * outra tabela sem editar arquivo nenhum.
 *
 * @param {number} [seed] a semente da partida
 * @param {typeof CATALOG} [catalog] o catalogo de onde sai a posicao inicial
 * @returns {GameState}
 */
export function createState(seed = DEFAULT_SEED, catalog = CATALOG) {
  const { areas, fiscal, macro, parties, programs, rules, segments } = catalog;
  return deepFreeze({
    schemaVersion: SCHEMA_VERSION,
    seed,
    month: 2,
    /* A SATISFACAO DE ABERTURA sai do catalogo, como tudo. Os tres segmentos
       nascem em pontos diferentes de proposito: quem acabou de eleger o governo
       comeca mais satisfeito, e quem paga a conta comeca menos. */
    mood: opinionOpening(segments),
    loyalty: Object.fromEntries(parties.map(party => [party.id, INITIAL_LOYALTY])),
    macro: economyOpening(fiscal.initialGdp, macro),
    fiscal: {
      mandatory: fiscal.initialMandatory,
      /* A ANCORA E O EXERCICIO ANTERIOR, e por isso ela nasce com a receita e a
         despesa de quem entregou o governo — nao com as deste mes. No primeiro
         mes as duas coincidem, e o teto do arcabouco fica exatamente onde a
         despesa herdada esta: crescimento zero de receita, crescimento zero de
         teto. O aperto que vem depois e a obrigatoria subindo contra um teto
         parado, que e a armadilha inteira. */
      anchorRevenue: fiscal.initialGdp * fiscal.taxLoad,
      anchorExpense: fiscal.initialMandatory + fiscal.initialDiscretionary,
      debt: fiscal.initialGdp * fiscal.initialDebtRatio,
    },
    /* O HISTORICO NASCE VAZIO, e nao preenchido com o indice inicial repetido.
       A diferenca aparece no primeiro mes de uma area com atraso: com o
       historico vazio, o motor devolve o indice de abertura como valor efetivo,
       que e a leitura certa — a capacidade herdada ja estava em vigor antes da
       posse. Preenchido a mao, seria a mesma coisa com mais bytes no save e uma
       chance a mais de divergir do motor. */
    capacity: opening(areas),
    /* A SERIE NASCE VAZIA, e nao com o mes zero dentro: nada aconteceu ainda, e
       um ponto na abertura seria a tela desenhando uma linha reta que descreve
       uma historia de um mes so. */
    series: { gdp: [], inflation: [], rate: [], unemployment: [], debtRatio: [], primary: [] },
    /* O ORCAMENTO HERDADO. Cada programa comeca onde o antecessor o deixou, e a
       soma disso e o pais que o jogador recebe — `tests/suites/agenda.mjs` prova
       que ela bate com a posicao fiscal de abertura, para nao existirem duas
       verdades sobre quanto o Estado gasta.

       ELE SAI DO CATALOGO E NAO E DIGITADO AQUI, pela mesma razao que a capacidade
       nao nasce preenchida a mao: dois lugares com o mesmo numero e um lugar que
       vai divergir na primeira recalibragem. */
    /* PROGRAMAS E REGRAS NO MESMO MAPA, e de proposito: as duas familias sao a
       mesma primitiva, e separa-las aqui obrigaria todo consumidor a saber de
       qual delas um id veio — que e informacao do catalogo, e nao do estado. */
    levels: Object.fromEntries([...programs, ...rules].map(lever => [lever.id, lever.initial])),
    /* AS FAIXAS NASCEM DO CATALOGO, e e por isso que o catalogo continua
       declarando piso e teto: o que ele diz agora e a faixa DE ABERTURA — as leis
       que o presidente encontra em vigor no dia da posse — e nao mais a regra
       eterna. A partir daqui elas sao estado, e mudam por voto. */
    bands: Object.fromEntries(
      [...programs, ...rules].map(lever => [
        lever.id,
        { floor: lever.floor, ceiling: lever.ceiling },
      ]),
    ),
    /* UM FLUXO POR MOTOR QUE SORTEIA, e os dois derivados do NOME. Fluxo unico
       compartilhado faria um evento a mais deslocar o indice e mudar o
       resultado de uma votacao sem relacao nenhuma com ele — e ai calibrar a
       frequencia de eventos mexeria em todas as votacoes do jogo de uma vez. */
    streams: {
      events: streamFrom(seed, "events"),
      congress: streamFrom(seed, "congress"),
    },
  });
}

/**
 * ⚠ A ACAO `monthResolved` CHEGA COM A CONTA JA FEITA, e essa e a divisao de
 * trabalho que mantem este arquivo pequeno. Quem compoe os motores e resolve o
 * mes e `src/application/turn.mjs`; o que chega aqui e o RESULTADO, e o reducer
 * so o dobra no estado. Sem isso, a composicao dos sete motores acabaria dentro
 * deste `switch` — que e exatamente como o entrypoint do projeto anterior chegou
 * a 1.715 linhas.
 *
 * ── A ACAO DE ANDAIME SAIU ──────────────────────────────────────────────────
 * Existia aqui um `advanceMonth` que empurrava o mes e oscilava a aprovacao numa
 * senoide deterministica — "sobe tres meses, desce dois" —, escrito para a tela
 * mudar quando o botao fosse apertado, antes de existir turno de verdade. Ele
 * saiu por ter cumprido o prazo: o botao chama `playMonth` desde que a Mesa
 * nasceu, e a unica coisa que ele ainda fazia era mover um numero que nenhum
 * motor sustenta. Andaime que sobrevive ao predio vira parte do predio.
 *
 * @typedef {{ type: "monthResolved",
 *       loyalty: Record<string, number>,
 *       fiscal: Fiscal,
 *       capacity: Capacity,
 *       macro: MacroState,
 *       series: Series,
 *       mood: Record<string, number>,
 *       levels: Record<string, number>,
 *       bands: Record<string, Band>,
 *       stream: Stream }} Action
 */

/**
 * A UNICA forma de produzir um estado novo.
 *
 * @param {GameState} state
 * @param {Action} action
 * @returns {GameState}
 */
export function reduce(state, action) {
  switch (action.type) {
    case "monthResolved": {
      /* O HUMOR CHEGA PRONTO, como tudo o mais. Ate 14/08/2026 havia aqui uma
         omissao declarada — "quem produz aprovacao e SONDA, que ainda nao
         existe" —, e ela vigorou por tres sessoes. O motor nasceu; o reducer
         continua so dobrando o resultado no estado. */
      return deepFreeze({
        ...state,
        month: state.month + 1,
        loyalty: action.loyalty,
        fiscal: action.fiscal,
        capacity: action.capacity,
        macro: action.macro,
        series: action.series,
        mood: action.mood,
        levels: action.levels,
        bands: action.bands,
        streams: { ...state.streams, congress: action.stream },
      });
    }

    default:
      return state;
  }
}

/**
 * Rotulo do mes de calendario a partir do numero de meses desde a posse.
 * @param {number} month
 */
export function monthLabel(month) {
  const names = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  const name = names[month % 12] ?? "jan";
  const year = 2027 + Math.floor(month / 12);
  return `${name} · ${year}`;
}
