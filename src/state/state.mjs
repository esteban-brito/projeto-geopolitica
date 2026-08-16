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
import { inherited } from "../domain/norms/index.mjs";
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
 * ⚠ OS INDICES DE AREA ENTRARAM EM 16/08/2026, e a razao e um achado que ficou
 * aberto por duas sessoes. O historico da capacidade NAO SERVE para desenhar
 * tendencia: ele guarda `lag + 1` valores porque e o mecanismo do ATRASO, e nao um
 * buffer de tela. Onde o atraso e zero — Fazenda, Previdencia — ele guarda UM
 * valor, e as telas ficavam mudas: elas passaram a calar em vez de imprimir um
 * zero inventado, que e a postura certa e nao e a resposta.
 *
 * A resposta e esta serie: os oito indices por mes, como o PIB e a inflacao ja
 * eram. E ela NAO duplica o historico da capacidade — os dois guardam o mesmo
 * numero por razoes diferentes, e a diferenca e a janela: o historico e curto e
 * ALIMENTA O MOTOR; a serie e longa e alimenta os olhos. Unifica-los faria o
 * atraso de uma area depender de quanto tempo a tela quer desenhar.
 *
 * @typedef {object} Series
 * @property {number[]} gdp
 * @property {number[]} inflation
 * @property {number[]} rate
 * @property {number[]} unemployment
 * @property {number[]} debtRatio
 * @property {number[]} primary - o resultado primario do mes, em bilhoes
 * @property {Record<string, number[]>} areas - o indice de cada area, mes a mes
 *
 * A CORRESPONDENCIA — e ela e o unico lugar do estado que ESPERA UMA RESPOSTA.
 *
 * ⚠ ATE 16/08/2026 A CAIXA DE ENTRADA ERA UM MURAL: ela lia os eventos do ultimo
 * turno e desenhava; no mes seguinte eles sumiam sozinhos, sem resposta e sem
 * consequencia. Uma bandeja com uma carta e um cartao com sombra — e desde que a
 * bandeja escavada entrou, o objeto anunciava um acumulo que nao existia.
 *
 * O QUE SE GUARDA E O FATO, E NUNCA A PROSA. A carta no estado nao tem texto:
 * quem escreve continua sendo `src/ui/screens/inbox.mjs`, e guardar o texto
 * renderizado colocaria dois lugares produzindo a mesma carta — o defeito que este
 * projeto ja encontrou QUATRO VEZES, o ultimo custando 27,2% dos vereditos.
 *
 * ⚠ NEM TODA CARTA TEM PRAZO, e essa divisao e a mecanica. `due` e nulo no AVISO
 * — a Mesa pautou, o texto morreu na gaveta — e so existe na PERGUNTA. Prazo em
 * aviso e relogio sem decisao, e e o prazo que separa uma bandeja de uma lista de
 * tarefas.
 *
 * E A LEITURA DO MES NAO E CARTA. Ela e o fechamento do turno, e se refaz inteira
 * a cada mes a partir do relatorio; guarda-la aqui obrigaria o save a carregar 48
 * relatorios para reescrever um texto que o turno ja sabe produzir. O que mora
 * neste campo e o que ESPERA.
 *
 * @typedef {object} Letter
 * @property {string} id - deterministico, e por isso a mesma carta nao chega duas vezes
 * @property {"posse" | "tabled" | "reported" | "forgotten" | "passed" | "rejected"} kind
 * @property {number} month - o mes em que ela chegou
 * @property {number | null} due - o mes em que ela vence; nulo no aviso
 * @property {string | null} subject - o assunto, guardado porque o texto pode morrer antes
 * @property {string | null} bill - o id do texto de que ela fala
 * @property {string[]} except - o que a emenda retira do texto; vazio fora da pergunta
 * @property {string | null} saved - o rotulo do que o relator salvou
 * @property {"accept" | "block" | "silence" | null} answer - nulo enquanto ela espera
 * @property {number | null} closedAt - o mes em que ela deixou de esperar
 *
 * ⚠ `closedAt` E UM CAMPO E NAO UMA CONTA, e a alternativa foi tentada e estava
 * errada: envelhecer a carta pelo mes de CHEGADA descartaria uma pergunta feita em
 * maio e respondida em julho antes de o jogador ver o desfecho dela. O que
 * envelhece e o fim, e nao o comeco. No AVISO ele nasce igual a `month`, porque um
 * aviso ja chega fechado.
 *
 * @typedef {object} Capacity
 * @property {Record<string, number>} index - o indice corrente de cada area
 * @property {Record<string, number[]>} history - o passado que o atraso consome
 *
 * AS NORMAS — e elas sao AS LEIS DO PAIS, guardadas como TEXTO.
 *
 * ⚠ AS FAIXAS SAIRAM DO CATALOGO EM 14/08/2026 e viraram NORMAS no mesmo dia, em
 * duas paradas que sao um movimento so. O piso da atencao basica em 59 pontos
 * nunca foi um detalhe de interface: e a vinculacao constitucional da saude
 * existindo como mecanica. Enquanto ele morava no catalogo, ele era imutavel — e
 * um jogo sobre governar em que as leis sao imutaveis e um jogo sobre
 * administrar. Enquanto ele foi um par de numeros no estado, ele era mutavel e
 * mudo: dava para mover o piso e nao dava para dizer POR QUANTO TEMPO, SOB QUE
 * CONDICAO, nem SALVO QUEM.
 *
 * O que se guarda agora e a pilha de normas escritas, na ordem em que foram
 * escritas, e a faixa vigente e o que o motor de normas LÊ dessa pilha a cada mes.
 * Guardar a faixa ao lado seria o mesmo defeito que tirou a situacao daqui: valor
 * derivado guardado e um segundo lugar para a mesma verdade divergir — e este
 * divergiria no mes em que um gatilho ligasse sozinho.
 *
 * Os tres verbos continuam caindo sozinhos, e agora com prazo e condicao: ALTERAR
 * e escrever uma norma nova por cima; CRIAR e por uma faixa onde nao havia;
 * EXCLUIR e revogar. E a norma antiga NAO SOME quando a nova passa — e por isso
 * que revogar a de 2029 faz a de 2027 voltar a valer.
 *
 * O QUE NAO ENTRA AQUI E A GUARDA. Ela vem da alavanca e e imutavel, porque ela e
 * a NATUREZA da norma e nao o conteudo dela: o jogador muda o que a lei manda, e
 * nao de que tipo ela e. Uma vinculacao constitucional que virasse ordinaria por
 * decisao do proprio governo seria o Executivo escolhendo quanto custa mudar de
 * ideia.
 *
 * A FAIXA CONTINUA SENDO O TIPO QUE TODO MUNDO IMPORTA daqui, e de proposito: ela
 * e a saida do motor de normas, e quem consome — orcamento, tela, pauta — nunca
 * precisou saber de onde ela veio. Foi isso que fez a migracao nao reescrever o
 * jogo que ja existia.
 *
 * @typedef {import("../domain/norms/index.mjs").Band} Band
 * @typedef {import("../domain/norms/index.mjs").Norm} Norm
 *
 * OS TEXTOS EM TRAMITACAO — e eles sao TEXTO, e nao efeito.
 *
 * ⚠ ATE 15/08/2026 UMA LEI ERA INSTANTANEA: o jogador movia o controle, o plenario
 * votava no mesmo mes, e o efeito valia na hora. Isso fazia o mes 40 ser igual ao
 * mes 4 — nao havia nada que o calendario cobrasse. Agora um texto atravessa tres
 * estagios, um por mes: gaveta, relatoria, plenario.
 *
 * O QUE SE GUARDA E O PEDIDO, e nao a proposta. Posicao, ameaca e quorum sao
 * derivados do que o texto pede CONTRA O PAIS DE HOJE, e o pais anda enquanto o
 * texto espera: guardar a proposta junto congelaria a ameaca no dia da assinatura, e
 * o Congresso votaria um mundo que nao existe mais. E a mesma razao que tirou a
 * faixa vigente do estado.
 *
 * @typedef {import("../application/passage.mjs").Bill} Bill
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
 * @property {Norm[]} norms - as leis escritas, na ordem em que foram escritas
 * @property {Bill[]} bills - os textos em tramitacao, do mais antigo ao mais novo
 * @property {Letter[]} mail - a correspondencia que espera, da mais antiga a mais nova
 * @property {Record<string, number>} pressure - a CALDEIRA: quanto cada grupo de
 *   pressao aguentou ate agora, de 0 a 100
 * @property {number | null} impeachment - o mes em que o processo foi aberto, ou nulo
 * @property {number | null} fallen - o mes em que o plenario afastou o presidente
 *
 * ⚠ `fallen` E O FIM DA PARTIDA, e o Planalto nao tem tela de derrota: a partida JA
 * E um mandato de 48 meses, sem vitoria e sem placar, entao "fim de jogo" nao e o
 * oposto de nada. Cair e o mandato terminar antes, e o que muda e a data.
 *
 * ⚠ A PRESSAO E ESTOQUE, E NAO LEITURA, e essa e a razao de ela morar aqui em vez de
 * ser derivada como a situacao. Descontentamento se mede no mes; PRESSAO se acumula —
 * um governo que irrita o mercado num mes e o agrada no seguinte nao volta ao ponto de
 * partida, porque a desconfianca fica. Derivada, ela sumiria no mes em que o jogador
 * consertasse o numero, e nada teria consequencia.
 *
 * ⚠ E `impeachment` E UM FATO, e nao um calculo: o mes em que as tres rupturas se
 * abriram JUNTAS. Recalcula-lo todo turno faria o processo fechar sozinho no mes em
 * que uma das tres melhorasse — e processo aberto nao se fecha porque a rua voltou. O
 * que decide o fim dele e o plenario.
 * @property {Record<string, number>} memory - o saldo de cada PESSOA com o governo
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
   polarizacao, que e justamente a informacao que o motor existe para dar.
   SUBIU PARA 12 quando as faixas viraram NORMAS. Um save da 11 guarda `bands` — o
   par de numeros vigente — e o que o jogo passa a precisar e a PILHA que produziu
   aquele par. A conversao parece obvia: bastaria virar cada faixa numa norma
   herdada. Ela seria mentira pela mesma razao de sempre, e agora com um custo a
   mais: o par nao diz se aquele piso e o da posse ou o que uma emenda de marco
   deixou, e nao diz o que foi revogado para chegar ali. Converter apagaria o
   arquivo legislativo daquele mandato e devolveria um pais sem historia, em que
   revogar a ultima reforma nao faz nada voltar.
   SUBIU PARA 13 quando a republica ganhou gente. Um save da 12 nao guarda memoria
   nenhuma, e converter parece trivial — bastaria abrir todo mundo em zero. Seria
   mentira do tipo mais caro: zero nao e "nao sei", zero e "voce nunca fez nada por
   ele", e um mandato de dois anos de favores reabriria com o Congresso inteiro
   tratando o presidente como estranho. As PESSOAS nao entram no save porque elas
   se refazem da semente; o que voce fez com elas nao se refaz de lugar nenhum.
   SUBIU PARA 14 quando o texto deixou de ser instantaneo e passou a TRAMITAR. Um
   save da 13 nao tem `bills`, e converter e impossivel na direcao que importa: o
   jogo antigo resolvia a votacao no mes em que ela era escrita, entao nao existe
   "texto a caminho" para reconstruir. Abrir com a gaveta vazia daria um mandato em
   que tudo o que ja foi assinado ja valeu — que e exatamente o jogo que a Parte 3
   veio acabar. (Esta nota foi escrita em 16/08, quando o bump seguinte mostrou que
   ela tinha ficado de fora.)
   SUBIU PARA 15 com a CORRESPONDENCIA e a serie dos indices de area — duas
   mudancas num bump so, de proposito: o save RECUSA versao diferente em vez de
   converter, entao cada numero novo aqui custa uma partida ao jogador, e duas
   migracoes na mesma semana custariam duas.

   Um save da 14 nao tem carta nenhuma, e converter seria pior que recusar: as
   cartas que aquele mandato deveria ter recebido — a emenda do relator esperando
   resposta, o prazo correndo — nao existem em lugar nenhum de onde reconstrui-las,
   e abrir com a caixa vazia entregaria ao jogador um governo que ja perdeu, por
   silencio, todas as perguntas que lhe fizeram. Silencio ACEITA neste jogo, e
   silencio forjado por uma migracao seria o motor cobrando por uma decisao que o
   jogador nunca teve chance de tomar.

   ⚠ A serie de indices tambem nao se reconstroi, e por um motivo mais fundo do que
   "nao foi guardada": o historico da capacidade tem `lag + 1` valores, e onde o
   atraso e zero ele tem UM. O passado daquele mandato nao esta em lugar nenhum
   porque nunca esteve — e preenche-la com o indice de hoje repetido desenharia uma
   linha reta que afirma que nada nunca aconteceu naquele governo.
   SUBIU PARA 16 quando o presidente passou a poder CAIR. Um save da 15 nao tem
   caldeira, processo nem queda, e converter seria pior que recusar nos dois sentidos: abrir
   com pressao ZERO entregaria um mandato de tres anos de descaso a um Congresso que
   esqueceu tudo — e abrir com pressao ALTA condenaria um governo que talvez tivesse
   entregue. O que os quatro grupos aguentaram naquele mandato nao esta em lugar
   nenhum, porque nunca esteve. */
export const SCHEMA_VERSION = 16;

/* O HUMOR DE ABERTURA da base. Uniforme de proposito nesta fase: uma coalizao
   recem-formada por rateio de ministerio nao tem historia com o governo, e
   diferenciar as bancadas aqui seria contar uma que ninguem escreveu. Elas
   divergem a partir do primeiro mes, e divergem pelo que o jogador fizer. */
export const INITIAL_LOYALTY = 70;

/* O MES EM QUE A PARTIDA ABRE, contado desde a posse. Dois, e ele estava escrito
   como literal solto ate 16/08/2026 — o que nao doeu enquanto so `createState` o
   usava, e passou a doer quando a carta de posse precisou nascer no MESMO mes: dois
   literais iguais em dois lugares e um lugar que vai divergir.

   Nao e zero porque a posse e em janeiro e o primeiro orcamento que o presidente
   assina e o de marco: janeiro e fevereiro sao do antecessor, e o jogo comeca onde
   a caneta comeca a valer. */
const OPENING_MONTH = 2;

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
    month: OPENING_MONTH,
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
       uma historia de um mes so.

       ⚠ E OS INDICES DE AREA NASCEM COM AS CHAVES E SEM VALOR, que nao e a mesma
       coisa que nascer vazio: a chave existir e o que permite a tela perguntar
       "quanto tempo desta area eu tenho?" e receber ZERO MESES em vez de
       `undefined`. Ausencia declarada, e nao ausencia disfarcada — a mesma regra
       que fez Fazenda e Previdencia calarem em vez de imprimir zero. */
    series: {
      gdp: [],
      inflation: [],
      rate: [],
      unemployment: [],
      debtRatio: [],
      primary: [],
      areas: Object.fromEntries(areas.map(area => [area.id, []])),
    },
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
    /* AS NORMAS NASCEM DO CATALOGO, e e por isso que o catalogo continua
       declarando piso e teto: o que ele diz agora e a faixa DE ABERTURA — as leis
       que o presidente encontra em vigor no dia da posse — e nao mais a regra
       eterna. A partir daqui elas sao texto, e mudam por voto.

       UMA NORMA POR ALAVANCA, e nao uma norma so cobrindo tudo: e assim que o
       pais herdado se parece com o real, em que cada vinculacao tem historia
       propria e se derruba sozinha. Uma norma unica de alcance `all` daria o mesmo
       resultado no mes 1 e um pais impossivel de reformar no mes 2 — revogar a
       saude revogaria a educacao junto. */
    norms: [...programs, ...rules].map(inherited),
    /* A GAVETA NASCE VAZIA, e vazia aqui quer dizer o que parece: o presidente
       toma posse sem nada protocolado em nome dele. O que o antecessor deixou em
       tramitacao nao entra — seria heranca de texto alheio, e o ciclo 4 reserva
       isso para a Parte 4, quando o Congresso passar a escrever. */
    bills: [],
    /* ⚠ A CAIXA DE ENTRADA NAO NASCE VAZIA, e essa e a unica excecao a regra de
       cima — e ela e um conserto, e nao um capricho.

       Ate 16/08/2026 o Gabinete abria com a peca central VAZIA: a tela e 3fr de
       Caixa de Entrada contra 2fr de cartoes, e no minuto zero a coluna maior nao
       tinha nada. O estado vazio declarava a ausencia, o que esta certo — e nao
       muda o fato de que o pior momento do jogo era o PRIMEIRO. Uma auditoria
       externa abriu a partida, leu esse vazio e concluiu que a Caixa de Entrada
       ainda nao tinha mecanica nenhuma.

       O conserto nao e carta falsa: e que um mandato COMECA com correspondencia. A
       Casa Civil entrega a heranca, e tudo o que essa carta diz ja existe nos
       motores — quanto da despesa e obrigatoria, o que o orcamento herdado
       consome, quem trava cada rubrica. Nenhum numero novo nasce aqui; o que nasce
       e o ENVELOPE.

       E ELA E AVISO, e portanto nao tem prazo: nao ha o que responder a uma
       heranca. `due` nulo, e a tarja de gravidade nao a alcanca. */
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
        answer: null,
        closedAt: OPENING_MONTH,
      },
    ],
    /* A MEMORIA NASCE VAZIA, e vazia quer dizer NEUTRA e nao hostil: `remember`
       trata a ausencia como saldo zero, que e o sujeito que ainda nao deve nem
       cobra nada. Um presidente recem-empossado nao tem historia com ninguem — e
       preencher isso com qualquer outro numero seria contar uma que ninguem
       escreveu, do mesmo jeito que a lealdade de abertura e uniforme. */
    /* ⚠ A CALDEIRA NASCE FRIA, e fria quer dizer o que parece: um presidente
       recem-empossado nao deve nada a ninguem e ninguem se cansou dele ainda. Ela
       esquenta a partir do primeiro mes, e esquenta pelo que ele NAO entregar. */
    pressure: Object.fromEntries(catalog.lobbies.map(lobby => [lobby.id, 0])),
    impeachment: null,
    fallen: null,
    memory: {},
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
 *       norms: Norm[],
 *       bills: Bill[],
 *       mail: Letter[],
 *       pressure: Record<string, number>,
 *       impeachment: number | null,
 *       fallen: number | null,
 *       memory: Record<string, number>,
 *       stream: Stream }} Action
 *
 * ⚠ A CORRESPONDENCIA CHEGA PRONTA, COMO TUDO — e nao ha uma segunda acao para
 * responder carta. Havia a alternativa: uma acao `mailAnswered` que mutasse o
 * estado na hora do clique, fora do turno. Foi recusada, e a razao e a de sempre
 * neste projeto: O VENCIMENTO ACONTECE DENTRO DO TURNO, e uma resposta que
 * acontecesse fora dele criaria dois caminhos mutando a mesma carta — com o
 * resultado dependendo de qual chegasse primeiro no mes em que o prazo fecha.
 *
 * A resposta e uma ORDEM, como o orcamento: o jogador marca, e o mes resolve.
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
