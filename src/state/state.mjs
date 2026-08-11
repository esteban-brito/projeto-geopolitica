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
import { streamFrom } from "./random.mjs";

/**
 * @typedef {"crisis" | "stable" | "growth"} Situation
 *
 * @typedef {object} Approval
 * @property {number} good - "otimo/bom", em pontos percentuais
 * @property {number} fair - "regular"
 * @property {number} poor - "ruim/pessimo"
 *
 * @typedef {import("./random.mjs").Stream} Stream
 *
 * @typedef {object} Streams
 * @property {Stream} events - o fluxo de TEMPORAL
 * @property {Stream} congress - o fluxo de ECLUSA
 *
 * @typedef {object} Fiscal
 * @property {number} gdp - PIB anualizado corrente, em bilhoes
 * @property {number} mandatory - despesa obrigatoria anualizada, ja crescida
 * @property {number} anchorRevenue - receita do exercicio anterior; a ancora da regra
 * @property {number} anchorExpense - despesa total do exercicio anterior
 * @property {number} debt - divida bruta
 *
 * @typedef {object} Capacity
 * @property {Record<string, number>} index - o indice corrente de cada area
 * @property {Record<string, number[]>} history - o passado que o atraso consome
 *
 * @typedef {object} GameState
 * @property {number} schemaVersion - versao do formato do save
 * @property {number} seed - a semente da partida; com ela e as acoes, tudo se refaz
 * @property {number} month - meses decorridos desde a posse (0 = janeiro do ano 1)
 * @property {Approval} approval
 * @property {Situation} situation
 * @property {Record<string, number>} loyalty - o humor de cada bancada, de 0 a 100
 * @property {Fiscal} fiscal - a posicao orcamentaria que atravessa os meses
 * @property {Capacity} capacity - a capacidade do Estado de entregar, por area
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
   corrompido. */
export const SCHEMA_VERSION = 4;

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
  const { areas, fiscal, parties } = catalog;
  return deepFreeze({
    schemaVersion: SCHEMA_VERSION,
    seed,
    month: 2,
    approval: { good: 31, fair: 34, poor: 35 },
    situation: /** @type {Situation} */ ("stable"),
    loyalty: Object.fromEntries(parties.map(party => [party.id, INITIAL_LOYALTY])),
    fiscal: {
      gdp: fiscal.initialGdp,
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
 * @typedef {{ type: "advanceMonth" }
 *   | { type: "monthResolved",
 *       loyalty: Record<string, number>,
 *       fiscal: Fiscal,
 *       capacity: Capacity,
 *       stream: Stream }} Action
 */

/**
 * A UNICA forma de produzir um estado novo.
 *
 * ⚠ A transicao aqui e ANDAIME e nao pertence a nenhum motor: ela e uma funcao
 * deterministica sem RNG, escrita para a tela mudar quando o botao e apertado.
 * Quando CASCATA, CORRENTE e SONDA existirem, este corpo sai inteiro e a
 * assinatura permanece — que e o ponto de fixar a fronteira antes do conteudo.
 *
 * @param {GameState} state
 * @param {Action} action
 * @returns {GameState}
 */
export function reduce(state, action) {
  switch (action.type) {
    case "advanceMonth": {
      const month = state.month + 1;
      /* Oscilacao deterministica: sobe tres meses, desce dois. Serve para a
         tela exercitar as tres situacoes sem inventar um modelo. */
      const swing = month % 5 < 3 ? 2 : -3;
      const good = clamp(state.approval.good + swing, 5, 80);
      const poor = clamp(state.approval.poor - swing, 5, 80);
      const fair = 100 - good - poor;
      return deepFreeze({
        ...state,
        month,
        approval: { good, fair, poor },
        situation: situationFor(good, poor),
      });
    }

    case "monthResolved": {
      /* A APROVACAO NAO SE MEXE AQUI, e isto e omissao declarada. Quem produz
         aprovacao e SONDA, que ainda nao existe; escrever uma reacao qualquer
         neste ponto criaria um numero que a tela mostraria com toda a confianca
         e que nenhum motor sustenta. O turno resolvido move o que TEM motor:
         orcamento, base e o fluxo que a votacao consumiu. */
      return deepFreeze({
        ...state,
        month: state.month + 1,
        loyalty: action.loyalty,
        fiscal: action.fiscal,
        capacity: action.capacity,
        streams: { ...state.streams, congress: action.stream },
      });
    }

    default:
      return state;
  }
}

/**
 * @param {number} good
 * @param {number} poor
 * @returns {Situation}
 */
function situationFor(good, poor) {
  if (good - poor >= 8) return "growth";
  if (poor - good >= 8) return "crisis";
  return "stable";
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
