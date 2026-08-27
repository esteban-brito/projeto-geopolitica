/* ESTADO — imutavel, e um reducer puro como unica forma de muda-lo.
   POR QUE IMUTAVEL.
   Num jogo de turnos, quatro coisas caem de graca quando o estado nunca e mutado no lugar: ·
   SAVE e serializar o estado. */

import { CATALOG } from "../data/catalog.mjs";
import { waivedOf } from "../data/programs.mjs";
import { opening } from "../domain/capacity/index.mjs";
import { opening as economyOpening } from "../domain/economy/index.mjs";
import { inherited } from "../domain/norms/index.mjs";
import { opening as opinionOpening } from "../domain/opinion/index.mjs";
import { streamFrom } from "./random.mjs";

/**
 * O passado nao se recalcula a partir do presente: saber que a inflacao esteve em 9% no mes
 * 14 e informacao que so existe se alguem a guardou.
 *
 * @typedef {"crisis" | "stable" | "growth"} Situation
 * com a razao escrita: "quem a produz e SONDA, que nao existe". Agora existe — e
 * o que se guarda nao e a pesquisa, e a SATISFACAO de cada segmento. A pesquisa
 * e a conversao dela, e valor derivado guardado e um segundo lugar para a mesma
 * verdade divergir.
 * @typedef {import("../domain/opinion/index.mjs").Approval} Approval
 * @typedef {import("./random.mjs").Stream} Stream
 * @typedef {object} Streams
 * @property {Stream} events - o fluxo de TEMPORAL
 * @property {Stream} congress - o fluxo de ECLUSA
 * @typedef {import("../domain/economy/index.mjs").MacroState} MacroState
 * o orcamento passa a ler em vez de guardar. Duas verdades sobre quanto o pais
 * produz seria a divergencia mais cara que este modelo poderia ter, porque tudo
 * @typedef {object} Fiscal
 * @property {number} mandatory - despesa obrigatoria anualizada, ja crescida
 * @property {number} anchorRevenue - receita do exercicio anterior; a ancora da regra
 * @property {number} anchorExpense - despesa total do exercicio anterior
 * @property {number} debt - divida bruta
 * existir — com uma diferenca declarada: aquele alimenta a CASCATA, este so
 * alimenta os olhos.
 * historico para desenhar linha e trabalho de quem compoe, e po-lo dentro do
 * motor faria a economia carregar uma responsabilidade de interface.
 * @typedef {object} Series
 * @property {number[]} gdp
 * @property {number[]} inflation
 * @property {number[]} rate
 * @property {number[]} unemployment
 * @property {number[]} debtRatio
 * @property {number[]} primary - o resultado primario do mes, em bilhoes
 * @property {Record<string, number[]>} areas - o indice de cada area, mes a mes
 * @typedef {object} Letter
 * @property {string} id - deterministico, e por isso a mesma carta nao chega duas vezes
 * @property {"posse" | "tabled" | "reported" | "forgotten" | "passed" | "rejected" | "demand"
 * | "rupture" | "siege" | "ceiling" | "minority" | "boiling"
 * | "street" | "seats" | "vault"} kind
 * @property {number} month - o mes em que ela chegou
 * @property {number | null} due - o mes em que ela vence; nulo no aviso
 * @property {string | null} subject - o assunto, guardado porque o texto pode morrer antes
 * @property {string | null} bill - o id do texto de que ela fala
 * @property {string[]} except - o que a emenda retira do texto; vazio fora da pergunta
 * @property {string | null} saved - o rotulo do que o relator salvou
 * @property {number | null} was - o valor com que o mes comecou; so no relatorio
 * @property {number | null} now - o valor com que ele fechou; so no relatorio
 * @property {"high" | null} weight - se o movimento foi grande o bastante para gritar
 * @property {Record<string, number> | null} [attach] o dado do anexo, ja pesado pelo motor
 * @property {string | null} from - o id do lobby que exigiu; nulo em toda outra carta
 * @property {string | null} lever - a alavanca que ele quer movida
 * @property {number | null} level - o nivel que ele exige, e ele NAO e inventado:
 * e o nivel que aquele programa tinha na POSSE. Um lobby nao pede um numero novo,
 * ele pede DE VOLTA o que foi cortado — e por isso a exigencia so nasce quando o
 * jogador de fato cortou, o que a torna consequencia da jogada dele e nao um
 * evento que caiu do ceu
 * @property {"accept" | "block" | "silence" | null} answer - nulo enquanto ela espera
 * @property {number | null} closedAt - o mes em que ela deixou de esperar
 * @typedef {object} Capacity
 * @property {Record<string, number>} index - o indice corrente de cada area
 * @property {Record<string, number[]>} history - o passado que o atraso consome
 * @typedef {import("../domain/norms/index.mjs").Band} Band
 * @typedef {import("../domain/norms/index.mjs").Norm} Norm
 * @typedef {import("../application/passage.mjs").Bill} Bill
 * @typedef {object} GameState
 * @property {number} schemaVersion - versao do formato do save
 * @property {number} seed - a semente da partida; com ela e as acoes, tudo se refaz
 * @property {{ name: string, treatment: "senhor" | "senhora" } | null} president
 *   o nome que o jogador digitou e como ele quer ser tratado; `null` usa o sorteado
 * @property {number} month - meses decorridos desde a posse (0 = janeiro do ano 1)
 * @property {Record<string, number>} mood - a satisfacao de cada segmento, de 0 a 100
 * @property {Record<string, number>} loyalty - o humor de cada bancada, de 0 a 100
 * @property {Fiscal} fiscal - a posicao orcamentaria que atravessa os meses
 * @property {MacroState} macro - PIB, potencial, inflacao, juro, desemprego, populacao
 * @property {Capacity} capacity - a capacidade do Estado de entregar, por area
 * @property {Series} series - o que ja aconteceu, para o painel desenhar
 * @property {Record<string, number>} levels - a intensidade VIGENTE de cada programa
 * @property {Norm[]} norms - as leis escritas, na ordem em que foram escritas
 * @property {Bill[]} bills - os textos em tramitacao, do mais antigo ao mais novo
 * @property {Letter[]} mail - a correspondencia que espera, da mais antiga a mais nova
 * @property {Record<string, number>} pressure - a CALDEIRA: quanto cada grupo de
 * pressao aguentou ate agora, de 0 a 100
 * @property {number | null} impeachment - o mes em que o processo foi aberto, ou nulo
 * @property {number | null} fallen - o mes em que o plenario afastou o presidente
 * @property {Record<string, number>} memory - o saldo de cada PESSOA com o governo
 * @property {Streams} streams
 */

/* ⚠ ESTE SAVE RECUSA VERSAO DIFERENTE EM VEZ DE CONVERTER, e cada subida custa ao jogador
   a partida em andamento — por isso campo novo sem consumidor nao entra.

   Converter tambem nao seria honesto nos saltos que importam: um save da 7 nao tem PIB
   potencial, que carrega a historia inteira de quanto o pais investiu em capacidade; e um
   da 10 guarda a PESQUISA, quando o que o jogo passou a precisar e a SATISFACAO por
   segmento — e a conversao nao tem inversa util. Chuta-la distribuiria igual entre as tres
   classes, apagando a polarizacao, que e a informacao que SONDA existe para dar. */
export const SCHEMA_VERSION = 18;

/* ⚠ O TRATAMENTO E ESCOLHA DO JOGADOR, e nao deducao do nome. Antes a interface
   tinha SETE frases com "o senhor" digitadas fixas, e o gerador sorteia nomes femininos e
   masculinos na mesma proporcao: metade das partidas chamava a presidenta de "o senhor" por
   48 meses. Com o nome DIGITADO pelo jogador, deduzir e impossivel — entao se pergunta. */
export const TREATMENTS = /** @type {const} */ (["senhor", "senhora"]);

/* O HUMOR DE ABERTURA da base. */
export const INITIAL_LOYALTY = 70;

/* Dois, e ele estava escrito como literal solto ate — o que nao doeu enquanto so
   `createState` o usava, e passou a doer quando a carta de posse precisou nascer no MESMO
   mes: dois literais iguais em dois lugares e um lugar que vai divergir. */
export const OPENING_MONTH = 2;

/* A semente de uma partida sem semente escolhida. */
export const DEFAULT_SEED = 20270101;

/**
 * Congela em profundidade.
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function deepFreeze(value) {
  if (value === null || typeof value !== "object") return value;
  for (const key of Object.keys(value)) {
    deepFreeze(/** @type {Record<string, unknown>} */ (value)[key]);
  }
  return Object.freeze(value);
}

/**
 * O estado de abertura.
 *
 * SONDA e CORRENTE nascerem. Nenhum deles cita fonte porque nenhum deles e
 * afirmacao sobre o Brasil — e essa e a diferenca entre um numero provisorio
 * declarado e um numero inventado que vira dividia silenciosa.
 * @param {number} [seed] a semente da partida
 * @param {typeof CATALOG} [catalog] o catalogo de onde sai a posicao inicial
 * @param {{ name: string, treatment: "senhor" | "senhora" } | null} [president] o nome
 *   digitado pelo jogador, e como ele quer ser tratado
 * @returns {GameState}
 */
export function createState(seed = DEFAULT_SEED, catalog = CATALOG, president = null) {
  const { areas, fiscal, macro, parties, programs, rules, segments } = catalog;
  return deepFreeze({
    schemaVersion: SCHEMA_VERSION,
    seed,
    /* ⚠ O PRESIDENTE E O UNICO PERSONAGEM QUE ENTRA NO SAVE, e a excecao tem razao: todo o
       resto do elenco se refaz da semente, mas um nome DIGITADO nao se refaz de lugar
       nenhum. `null` quer dizer "use o que a semente sorteia", que e como a partida abre
       antes de o jogador escolher. */
    president,
    month: OPENING_MONTH,
    /* A SATISFACAO DE ABERTURA sai do catalogo, como tudo. */
    mood: opinionOpening(segments),
    loyalty: Object.fromEntries(parties.map(party => [party.id, INITIAL_LOYALTY])),
    macro: economyOpening(fiscal.initialGdp, macro),
    fiscal: {
      mandatory: fiscal.initialMandatory,
      /* A ANCORA E O EXERCICIO ANTERIOR, e por isso ela nasce com a receita e a despesa de
         quem entregou o governo — nao com as deste mes. */
      /* ⚠ E ELA NASCE JA LIQUIDA DA RENUNCIA, pela mesma razao que o turno a abate: a ancora
         e a receita QUE ENTROU no ano anterior, e o antecessor tambem nao arrecadou o que
         desonerou. Bruta aqui, o primeiro exercicio abriria com crescimento negativo de
         receita e o piso da banda do arcabouco dispararia sem ninguem ter feito nada. */
      anchorRevenue:
        fiscal.initialGdp * fiscal.taxLoad -
        waivedOf(
          programs,
          Object.fromEntries(programs.map(program => [program.id, program.initial])),
        ),
      anchorExpense: fiscal.initialMandatory + fiscal.initialDiscretionary,
      debt: fiscal.initialGdp * fiscal.initialDebtRatio,
    },
    /* Preenchido a mao, seria a mesma coisa com mais bytes no save e uma chance a mais de
       divergir do motor. */
    capacity: opening(areas),
    /* A SERIE NASCE VAZIA, e nao com o mes zero dentro: nada aconteceu ainda, e um ponto na
       abertura seria a tela desenhando uma linha reta que descreve uma historia de um mes so. */
    series: {
      gdp: [],
      inflation: [],
      rate: [],
      unemployment: [],
      debtRatio: [],
      primary: [],
      areas: Object.fromEntries(areas.map(area => [area.id, []])),
    },
    /* ELE SAI DO CATALOGO E NAO E DIGITADO AQUI, pela mesma razao que a capacidade nao nasce
       preenchida a mao: dois lugares com o mesmo numero e um lugar que vai divergir na
       primeira recalibragem. */
    /* PROGRAMAS E REGRAS NO MESMO MAPA, e de proposito: as duas familias sao a mesma
       primitiva, e separa-las aqui obrigaria todo consumidor a saber de qual delas um id veio
       — que e informacao do catalogo, e nao do estado. */
    levels: Object.fromEntries([...programs, ...rules].map(lever => [lever.id, lever.initial])),
    /* AS NORMAS NASCEM DO CATALOGO, e e por isso que o catalogo continua declarando piso e
       teto: o que ele diz agora e a faixa DE ABERTURA — as leis que o presidente encontra em
       vigor no dia da posse — e nao mais a regra eterna. */
    norms: [...programs, ...rules].map(inherited),
    /* A GAVETA NASCE VAZIA, e vazia aqui quer dizer o que parece: o presidente toma posse sem
       nada protocolado em nome dele. */
    bills: [],
    /* ⚠ A CAIXA DE ENTRADA NAO NASCE VAZIA, e essa e a unica excecao a regra de cima — e ela
       e um conserto, e nao um capricho. */
    mail: [
      {
        id: "posse",
        kind: /** @type {const} */ ("posse"),
        month: OPENING_MONTH,
        due: null,
        subject: null,
        bill: null,
        except: [],
        saved: null,
        from: null,
        lever: null,
        level: null,
        was: null,
        now: null,
        weight: null,
        answer: null,
        closedAt: OPENING_MONTH,
      },
    ],
    /* A MEMORIA NASCE VAZIA, e vazia quer dizer NEUTRA e nao hostil: `remember` trata a
       ausencia como saldo zero, que e o sujeito que ainda nao deve nem cobra nada. */
    /* ⚠ A CALDEIRA NASCE FRIA, e fria quer dizer o que parece: um presidente recem-empossado
       nao deve nada a ninguem e ninguem se cansou dele ainda. */
    pressure: Object.fromEntries(catalog.lobbies.map(lobby => [lobby.id, 0])),
    impeachment: null,
    fallen: null,
    memory: {},
    /* UM FLUXO POR MOTOR QUE SORTEIA, e os dois derivados do NOME. */
    streams: {
      events: streamFrom(seed, "events"),
      congress: streamFrom(seed, "congress"),
    },
  });
}

/**
 * ⚠ A ACAO `monthResolved` CHEGA COM A CONTA JA FEITA, e essa e a divisao de trabalho que
 * mantem este arquivo pequeno.
 *
 * @typedef {{ type: "monthResolved",
 * loyalty: Record<string, number>,
 * fiscal: Fiscal,
 * capacity: Capacity,
 * macro: MacroState,
 * series: Series,
 * mood: Record<string, number>,
 * levels: Record<string, number>,
 * norms: Norm[],
 * bills: Bill[],
 * mail: Letter[],
 * pressure: Record<string, number>,
 * impeachment: number | null,
 * fallen: number | null,
 * memory: Record<string, number>,
 * stream: Stream }} Action
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
      /* O HUMOR CHEGA PRONTO, como tudo o mais. */
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
        norms: action.norms,
        bills: action.bills,
        mail: action.mail,
        pressure: action.pressure,
        impeachment: action.impeachment,
        fallen: action.fallen,
        memory: action.memory,
        streams: { ...state.streams, congress: action.stream },
      });
    }

    default:
      return state;
  }
}

/**
 * Rotulo do mes de calendario a partir do numero de meses desde a posse.
 *
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
