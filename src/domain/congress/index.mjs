/* ECLUSA — congresso.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   bancadas, proposta, moeda oferecida, historico de barganha
   devolve  votos por bancada, resultado, custo pago, ressentimento

   ── A SEPARACAO QUE FAZ A MECANICA ───────────────────────────────────────────
   Duas funcoes, e a divisao entre elas E o jogo:

     `whipCount`  — a PREVISAO. Deterministica, sem sorteio nenhum. E o que a
                    tela mostra enquanto o jogador negocia: quanto cada bancada
                    tende a entregar com a verba oferecida ate agora;
     `vote`       — o DIA. Aplica a dissidencia individual sobre a previsao e
                    devolve o placar.

   O jogador sabe a TENDENCIA e nunca sabe o PLACAR. Comprar mais verba estreita
   a margem de erro sem nunca zera-la. Sem essa separacao o motor viraria
   planilha: bastaria descobrir que 32,4% da verba garante a lei, e a votacao
   deixaria de ter risco — que e a unica coisa que ela existe para ter.

   ── A RESISTENCIA, E OS DOIS TERMOS ──────────────────────────────────────────
     R_ef = R × (1 − venalidade × verba)  +  ameaca × venalidade × PESO_AMEACA
            └── negociavel ──────────────┘    └── inegociavel ──────────────┘

   PRIMEIRO TERMO. `R` e a distancia euclidiana no plano de posicoes, e a
   venalidade e o quanto ela CEDE a dinheiro — nao o tamanho dela. O dossie de
   origem multiplicava a resistencia pela venalidade, o que deixava a bancada
   mais ideologica com um decimo da resistencia, comprada de graca. E o oposto
   do comportamento pretendido.

   A venalidade usada e a do EIXO QUE DOMINA a distancia, ponderada pelo quadrado
   de cada componente. Uma pauta que se afasta so na economia cobra o preco
   economico; uma que se afasta so em liberdades cobra o outro. E o que faz "o
   preco depende do assunto" sair da tabela e chegar na conta.

   SEGUNDO TERMO, e ele inverte a relacao. Numa pauta que ataca a maquina, ser
   fisiologico AUMENTA a resistencia, porque o que esta sob ataque e a propria
   moeda da barganha — e por isso verba nenhuma reduz este termo. Sem ele, a
   medicao mostrou o centrao como o bloco mais proximo e mais barato de uma lei
   anticorrupcao: ele votaria pela propria extincao por preco modico.

   Isto NAO e um muro. A pauta segue votavel; ela exige a coalizao de quem nao
   vive da maquina, e essa coalizao existe. Fica cara, nao proibida.

   ── ONDE ENTRA A LEALDADE ────────────────────────────────────────────────────
   Ideologia diz para onde a bancada tende; lealdade diz se ela aparece. Abaixo
   do limiar de ruptura ela passa a jogar contra — que e o estado em que o
   governo perde votacao que a matematica ideologica dizia ganha.

   E ELA NAO E CONSTANTE. Enquanto a lealdade so entrava como numero fixo, a
   medicao mostrava tres das seis pautas passando sem um centavo: a tensao do
   jogo vinha inteira de um parametro que nunca se movia. `settle` e a metade que
   faltava — a lealdade decai sozinha, sobe com verba PAGA, e desaba quando o
   governo prometeu e nao entregou. */

import { unit } from "../../state/random.mjs";

/**
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../data/bills.mjs").Bill} Bill
 * @typedef {import("../../state/random.mjs").Stream} Stream
 */

/* Quanto a ameaca pesa, em unidades de resistencia. Calibrado contra a maior
   distancia possivel no plano, que e `hypot(100, 100)` ≈ 141: uma pauta de
   ameaca total contra um bloco totalmente fisiologico tem de produzir
   resistencia acima disso — ou seja, inegociavel para ELE, e nao para o
   plenario. */
const THREAT_WEIGHT = 85;

/* A curva que traduz resistencia em adesao. Logistica e nao linear: perto do
   pivo pequenas concessoes mudam muito, e nos extremos quase nada — que e como
   negociacao real se comporta. `PIVOT` e a resistencia de cara ou coroa.

   O PIVO SAIU DE MEDICAO, e nao de gosto. Com 42 a curva era severa demais para
   as distancias que este catalogo realmente produz — as bancadas ficam de 6 a 78
   de distancia entre si, e um pivo de 42 punha a pauta MEDIANA em cara ou coroa.
   O sintoma: quatro das seis pautas nao passavam nem comprando todas as bancadas
   com lealdade cheia, ou seja, o jogo virava um muro com aparencia de preco. */
const PIVOT = 58;
const SPREAD = 16;

/* Dissidencia maxima, em fracao da bancada, quando a lealdade esta cheia. Ela
   DOBRA com a lealdade no chao: bancada insatisfeita nao so entrega menos, ela
   entrega de forma menos previsivel. */
const DISSIDENCE = 0.07;

/* OS DOIS ESTADOS DE DESCONTENTAMENTO, e eles sao degraus e nao uma rampa.
   A curva de `faith` ja cobra a insatisfacao de forma continua; estes limiares
   existem para o comportamento QUALITATIVO mudar de nome num ponto que o jogador
   consegue enxergar no painel — "a base obstrui" e "a base rompeu" sao duas
   situacoes politicas distintas, e nao dois pontos de uma reta.

   OBSTRUCAO — a bancada ainda e base, mas para de trabalhar pelo governo:
               aparece menos, atrasa, esvazia sessao;
   RUPTURA   — ela passa a votar contra de proposito. E aqui que o governo perde
               votacao que a matematica ideologica dizia ganha.

   Os dois se compoem abaixo de 20, e isso e proposital: quem rompeu passou pela
   obstrucao antes. */
const OBSTRUCTION = 50;
const OBSTRUCTION_TOLL = 0.6;
const RUPTURE = 20;
const RUPTURE_TOLL = 0.15;

/* OS LIMIARES SAO EXPORTADOS porque a tela precisa dizer em que estado a bancada
   esta, e ela nao pode redigitar os numeros: dois lugares com o mesmo limiar e
   um lugar que vai divergir na primeira recalibragem, e o sintoma seria a
   interface chamando de "obstruindo" uma bancada que o motor ja trata como
   rompida. O motor e a fonte; a tela pergunta. */
export const THRESHOLDS = { obstruction: OBSTRUCTION, rupture: RUPTURE };

/* ── O ASSENTAMENTO DA LEALDADE, mes a mes ──────────────────────────────────
   Tres forcas, e a terceira e a que liga este motor ao orcamento.

   DECAIMENTO  — atencao politica e perecivel. Base a que nao se paga nada
                 escorrega sozinha, e e isso que impede o jogador de comprar o
                 Congresso uma vez e viver de renda;
   AFAGO       — verba PAGA levanta. Paga, e nao prometida: a distincao e o
                 acoplamento inteiro;
   TRAICAO     — o buraco entre o que foi prometido e o que chegou. Ele pesa MUITO
                 mais que o afago, e a assimetria e o ponto: prometer 1,0 e
                 entregar 0 custa mais do que dois meses de afago cheio
                 devolvem. E assim que contingenciamento — que nao e escolha do
                 jogador, e aritmetica do teto — vira crise politica sem que
                 exista um evento roteirizado dizendo "sua base se revoltou". */
const DECAY = 1.5;
const PATRONAGE = 12;
const BETRAYAL = 25;

/**
 * @typedef {object} PartyForecast
 * @property {string} partyId
 * @property {number} distance - a distancia ideologica crua
 * @property {number} venality - a venalidade do eixo que domina a distancia
 * @property {number} resistance - ja com verba e ameaca
 * @property {number} adherence - fracao da bancada que tende a votar sim
 * @property {number} votes - a previsao em cadeiras
 *
 * @typedef {object} Forecast
 * @property {PartyForecast[]} parties
 * @property {number} votes - a soma prevista
 *
 * @typedef {object} PartyTally
 * @property {string} partyId
 * @property {number} votes
 * @property {number} drift - quantas cadeiras fugiram da previsao
 *
 * @typedef {object} Tally
 * @property {PartyTally[]} parties
 * @property {number} votes
 * @property {number} expected
 * @property {boolean} passed
 * @property {Stream} stream
 */

/** @param {number} value */
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

/**
 * A venalidade que vale para ESTA pauta: a do eixo que domina a distancia.
 *
 * O peso e o quadrado de cada componente porque e o quadrado que compoe a
 * distancia euclidiana — usar o valor absoluto daria peso demais ao eixo curto.
 *
 * @param {Party} party
 * @param {number} dx
 * @param {number} dy
 */
function venalityFor(party, dx, dy) {
  const total = dx * dx + dy * dy;
  if (total === 0) return (party.venalityEconomic + party.venalityLiberty) / 2;
  return (dx * dx * party.venalityEconomic + dy * dy * party.venalityLiberty) / total;
}

/**
 * O QUANTO O HUMOR SOZINHO DEIXA A BANCADA ENTREGAR, de 0 a 1.
 *
 * Ele existe extraido porque DUAS coisas precisam dele e elas nao podem
 * divergir: a previsao de uma votacao e a leitura da base. Se a segunda
 * repetisse a formula, bastaria uma recalibragem em um dos dois lugares para a
 * tela anunciar uma base que o plenario nao entrega — e o sintoma apareceria
 * como "o Congresso nao bate com o painel", tres telas longe da causa.
 *
 * LEALDADE CHEIA NAO COBRA PEDAGIO: o fator vai a 1. A primeira versao parava em
 * 0,4 + 0,6, e entao mesmo uma bancada perfeitamente alinhada e perfeitamente
 * satisfeita perdia 18% do voto sem razao nenhuma. O efeito so aparecia somado
 * ao resto, e o sintoma era o plenario inteiro entregar menos do que qualquer
 * leitura da tabela sugeria.
 *
 * @param {number} mood a lealdade da bancada, de 0 a 100
 * @returns {number}
 */
function moodFactor(mood) {
  let factor = 0.5 + 0.5 * clamp01(mood / 100);

  /* Os dois degraus, na ordem em que a base os desce. */
  if (mood < OBSTRUCTION) factor *= OBSTRUCTION_TOLL;
  if (mood < RUPTURE) factor *= RUPTURE_TOLL;

  return factor;
}

/**
 * A BASE, EM CADEIRAS — quantas o governo tem sem nada em pauta.
 *
 * ⚠ ELA NAO E A SOMA DAS BANCADAS QUE APOIAM. Uma coalizao de 300 cadeiras com a
 * base em 40 nao entrega 300 votos, e anunciar 300 seria a tela prometendo o que
 * o plenario nao faz. O que esta conta responde e outra pergunta: quantas
 * cadeiras respondem ao governo HOJE, numa pauta sem atrito ideologico e sem um
 * centavo de emenda — ou seja, o tamanho real da coalizao que a lealdade
 * sustenta.
 *
 * Ela e o mesmo `moodFactor` que a votacao usa. Nao ha formula nova aqui, e e
 * de proposito: a base mostrada e a base que vota.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @returns {number} cadeiras, arredondado
 */
export function baseCount({ parties, loyalty }) {
  let seats = 0;
  for (const party of parties) {
    seats += party.seats * clamp01(moodFactor(loyalty[party.id] ?? 0));
  }
  return Math.round(seats);
}

/**
 * A PREVISAO. Deterministica: nenhuma chamada a fluxo de aleatoriedade.
 *
 * @param {object} input
 * @param {Bill} input.bill
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.funding - verba por bancada, de 0 a 1
 * @param {Record<string, number>} input.loyalty - lealdade por bancada, de 0 a 100
 * @returns {Forecast}
 */
export function whipCount({ bill, parties, funding, loyalty }) {
  const forecasts = parties.map(party => {
    const dx = party.economic - bill.economic;
    const dy = party.liberty - bill.liberty;
    const distance = Math.hypot(dx, dy);
    const venality = venalityFor(party, dx, dy);
    const paid = clamp01(funding[party.id] ?? 0);

    const resistance = distance * (1 - venality * paid) + bill.threat * venality * THREAT_WEIGHT;

    /* A logistica devolve adesao alta para resistencia baixa e vice-versa. */
    let adherence = 1 / (1 + Math.exp((resistance - PIVOT) / SPREAD));

    /* LEALDADE nao muda a direcao, muda o comparecimento. Bancada satisfeita
       entrega o que a ideologia manda; insatisfeita entrega menos. O fator e o
       MESMO que a leitura da base usa — ver `moodFactor`. */
    adherence *= moodFactor(loyalty[party.id] ?? 0);

    return {
      partyId: party.id,
      distance,
      venality,
      resistance,
      adherence: clamp01(adherence),
      votes: Math.round(party.seats * clamp01(adherence)),
    };
  });

  return {
    parties: forecasts,
    votes: forecasts.reduce((sum, forecast) => sum + forecast.votes, 0),
  };
}

/**
 * O DIA DA VOTACAO. Aplica dissidencia individual sobre a previsao.
 *
 * Um saque POR BANCADA, do fluxo do congresso. Um saque unico para todas faria
 * as quatro traírem juntas, o que parece evento e e defeito de modelagem.
 *
 * @param {object} input
 * @param {Bill} input.bill
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.funding
 * @param {Record<string, number>} input.loyalty
 * @param {Stream} input.stream
 * @param {number} input.majority - votos necessarios
 * @returns {Tally}
 */
export function vote({ bill, parties, funding, loyalty, stream, majority }) {
  const forecast = whipCount({ bill, parties, funding, loyalty });
  let current = stream;

  const tallies = forecast.parties.map((prediction, index) => {
    const party = parties[index];
    const seats = party?.seats ?? 0;
    const drawn = unit(current);
    current = drawn.stream;

    /* A margem de erro cresce quando a lealdade cai: bancada insatisfeita
       entrega menos E de forma menos previsivel. */
    const faith = clamp01((loyalty[prediction.partyId] ?? 0) / 100);
    const spread = DISSIDENCE * (2 - faith);

    const drift = (drawn.value - 0.5) * 2 * spread;
    const actual = clamp01(prediction.adherence + drift);
    const votes = Math.round(seats * actual);

    return { partyId: prediction.partyId, votes, drift: votes - prediction.votes };
  });

  const votes = tallies.reduce((sum, tally) => sum + tally.votes, 0);

  return {
    parties: tallies,
    votes,
    expected: forecast.votes,
    passed: votes >= majority,
    stream: current,
  };
}

/**
 * A LARGURA DA INCERTEZA, em cadeiras. Deterministica: ela descreve o sorteio
 * sem sacar dele.
 *
 * Ela existe para a tela poder dizer `241 ± 14` em vez de `241`. A diferenca nao
 * e cosmetica — `241` afirma um placar que o motor nao promete, e o jogador que
 * confia nele aprende a desconfiar da tela na primeira vez que perder por tres
 * votos. Com a banda, a tela diz a verdade: a tendencia e conhecida, o dia nao.
 *
 * ⚠ NAO E O PIOR CASO. Somar o desvio maximo de cada bancada daria a banda de
 * "as quatro traem juntas, todas no limite", que num catalogo de 513 cadeiras
 * passa de 45 e faz a previsao parecer inutil. O que se compoe aqui e o DESVIO
 * PADRAO: cada bancada saca do proprio fluxo, entao os erros sao independentes e
 * se somam em quadratura. Para um sorteio uniforme em [-s, s], o desvio e
 * s/raiz(3).
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @returns {number} cadeiras, arredondado
 */
export function dispersion({ parties, loyalty }) {
  let variance = 0;

  for (const party of parties) {
    const faith = clamp01((loyalty[party.id] ?? 0) / 100);
    const reach = party.seats * DISSIDENCE * (2 - faith);
    variance += (reach * reach) / 3;
  }

  return Math.round(Math.sqrt(variance));
}

/**
 * O QUE O MES DEIXOU NA BASE. Deterministico e sem sorteio: o humor da bancada e
 * consequencia do que o governo fez, e nao do dado. O que e aleatorio na
 * negociacao ja foi sorteado em `vote`.
 *
 * ⚠ A DERROTA NAO CUSTA LEALDADE AQUI, e isto e omissao declarada e nao
 * esquecimento. Perder votacao desgasta o governo, mas o desgaste e de opiniao
 * publica antes de ser de bancada — e opiniao publica e outro motor, que ainda
 * nao existe. Escrever a penalidade agora seria fixar em numero uma relacao que
 * o motor certo vai ter de refazer.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty - o humor de entrada, de 0 a 100
 * @param {Record<string, number>} input.promised - verba prometida, de 0 a 1
 * @param {Record<string, number>} input.paid - verba que o caixa realmente honrou
 * @returns {Record<string, number>} o humor de saida
 */
export function settle({ parties, loyalty, promised, paid }) {
  /** @type {Record<string, number>} */
  const next = {};

  for (const party of parties) {
    const before = loyalty[party.id] ?? 0;
    const honoured = clamp01(paid[party.id] ?? 0);
    /* O buraco nunca e negativo: pagar MAIS do que se prometeu e generosidade, e
       generosidade ja esta paga pelo afago. Sem este `max` uma sobra de caixa
       viraria credito de traicao, e o jogador poderia estocar boa vontade
       prometendo pouco de proposito. */
    const broken = Math.max(0, clamp01(promised[party.id] ?? 0) - honoured);

    next[party.id] = clamp(before - DECAY + PATRONAGE * honoured - BETRAYAL * broken, 0, 100);
  }

  return next;
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
