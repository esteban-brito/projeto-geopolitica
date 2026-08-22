/* A TENDENCIA DE UM INDICE — quanto ele andou, e EM QUANTO TEMPO.
   ══════════════════════════════════════════════════════════════════════════════

   ── POR QUE UM ARQUIVO, PARA UMA SUBTRACAO ───────────────────────────────────
   Porque duas telas mostram a variacao da MESMA area, e elas mostravam numeros
   diferentes. Financas subtraia o valor mais antigo do historico; a tela de area
   subtraia o de doze meses atras, com o valor de abertura como reserva. Nenhuma
   das duas dizia contra o que estava comparando, e as duas erravam — a mesma
   Saude aparecia com uma variacao no placar e outra na propria tela.

   E a regra do projeto aplicada a leitura: conta refeita por fora e conta que
   diverge. Uma fonte so, e ela devolve a JANELA junto do numero.

   ── O DEFEITO QUE ELA CONSERTA, E ELE ERA UM NUMERO INVENTADO ────────────────
   O historico da capacidade NAO e um buffer de tela: ele e o mecanismo do atraso,
   e a MALHA guarda exatamente `lag + 1` valores de cada area — o de hoje e os
   `lag` anteriores. Como o atraso e diferente em cada area (0 na Fazenda e na
   Previdencia, 3 na Saude, 24 na Educacao), o historico tem comprimentos
   diferentes, e quem o lê sem reparar nisso produz duas mentiras:

     · FINANCAS punha na mesma coluna variacoes medidas em janelas diferentes,
       sem dizer nenhuma delas. A linha da Educacao contava 24 meses e a da Saude
       contava 3, uma embaixo da outra, lidas como comparaveis;
     · A TELA DE AREA escrevia "em 12 meses" para as oito, e o valor de doze meses
       atras so existe onde o atraso passa de onze. Em SEIS das oito areas ela
       mostrava a variacao DESDE A POSSE com rotulo de doze meses — no mes 40, uma
       frase simplesmente falsa.

   E o pior dos dois: onde o atraso e ZERO o historico guarda um valor so, entao a
   subtracao dava zero e o painel imprimia `· 0` na Fazenda e na Previdencia todo
   mes de toda partida. Um indicador morto ao lado de indicadores vivos e o defeito
   que este projeto ja pagou para aprender uma vez — foi o que tirou a aprovacao da
   tela por tres sessoes.

   ⚠ E O QUE FALTA CONTINUA FALTANDO, DECLARADO. Onde nao ha passado guardado nao
   ha tendencia, e esta funcao devolve `null` em vez de zero. Zero e uma afirmacao
   — "nao mudou" —, e ela seria falsa: o indice pode ter andado, e ninguem anotou.

   ⚠ MAS A RAZAO QUE ESTAVA ESCRITA AQUI ENVELHECEU, E ISSO CUSTOU DOIS INDICADORES
   MUDOS POR SESSOES A FIO. A frase era: "a serie de indices por area nao existe no
   estado (`state.series` guarda o macro, e nada mais), e enquanto ela nao existir a
   Fazenda e a Previdencia nao tem tendencia para mostrar". **Ela existe** —
   `state.series.areas`, preenchida todo turno por `extend` em `turn.mjs`, com ate 48
   meses de cada uma das oito. O texto continuou valido e parou de ser verdade, que e a
   familia de defeito mais cara deste projeto, e nesta ele conseguiu uma coisa nova:
   **justificar em prosa uma ausencia que o estado ja tinha resolvido**.

   O QUE MUDOU NAO FOI ESTA FUNCAO — foi quem a alimenta. As tres telas liam
   `state.capacity.history`, que e o buffer do ATRASO e guarda `lag + 1` valores. Medido
   no mes 20, antes da troca:

     · FAZENDA e PREVIDENCIA (atraso 0) guardavam UM valor e ficavam CALADAS, com a
       serie tendo dezesseis meses das duas ao lado;
     · INDUSTRIA anunciava −1,8 "em 6 meses" quando a queda de doze era −3,6. **A
       janela curta escondia metade do movimento**, e o numero menor saia com a
       autoridade de um numero medido;
     · SEGURANCA dizia −0,4 "em 3 meses" contra −1,0 em doze.

   A JANELA CONTINUA SENDO A QUE O DADO SUPORTA, e e por isso que o conserto nao mexeu
   em `WINDOW`: com a serie longa, as oito passam a suportar doze, e a funcao devolve
   doze porque ele existe — e nao porque alguem digitou. Ausencia declarada continua
   sendo a regra, so que agora ela vale para o primeiro ano de partida, que e quando o
   passado de fato nao existe. */

/* ATE ONDE VALE A PENA OLHAR PARA TRAS. Doze meses e um ano de politica: um passo
   de meio ponto e ruido, e doze passos na mesma direcao sao uma decisao. Onde o
   historico guarda mais do que isso — a Educacao guarda 25 —, o excedente nao
   entra: "em 24 meses" mediria dois governos de orcamento num numero so.

   ⚠ ELA VIROU EXPORTADA EM 21/08/2026, quando a barra superior passou a desenhar a
   escada dos quatro vitais. A largura da escada e a MESMA pergunta que a janela da
   tendencia — "ate onde vale a pena olhar para tras" —, e responde-la com um numero
   digitado ao lado do desenho daria duas respostas para uma pergunta so na mesma
   leitura: a seta contaria doze meses e a escada mostraria seis.

   MEDIDO ANTES DA TROCA, num mandato passivo de 30 meses: com SEIS degraus, tres das
   quatro escadas saem com UM degrau so — planas do primeiro ao ultimo mes. Com doze, o
   PIB e a base passam a mostrar o caminho. Ver o achado 44. */
export const WINDOW = 12;

/* AS REGUAS DA ESCADA, uma por indicador, e todas DECLARADAS.
   ══════════════════════════════════════════════════════════════════════════════
   ⚠ ELAS MUDARAM DE CASA EM 21/08/2026, e a mudanca e o oposto de uma faxina: a
   barra superior passou a desenhar a mesma escada que o painel de Financas ja
   desenhava, e copiar quatro pares de numeros para o segundo consumidor seria dois
   lugares afirmando em que regua a inflacao vive. O primeiro a ser recalibrado
   divergiria do outro, e o sintoma seria a mesma inflacao com dois desenhos na mesma
   janela do jogo. Este arquivo ja era o dono de "como se lê um indice ao longo do
   tempo" — a JANELA mora aqui —, e a regua e a outra metade da mesma pergunta.

   Elas nao saem da serie: uma escada normalizada pelo proprio historico desenha
   drama quando nao ha nada acontecendo — dois meses de inflacao entre 4,1% e 4,3%
   virariam um degrau cheio de subida. Elas tambem nao sao a regua do indice de
   area: contra 0 a 100, uma inflacao de 0,042 e um juro de 0,105 ficam no degrau
   do chao para sempre, e a escada passa a afirmar que nada nunca muda.

   Cada faixa e uma afirmacao sobre o mundo do jogo — "juro basico vive entre 0 e
   25% ao ano" — e por isso mora do lado de quem desenha, e nao no catalogo: o
   catalogo diz onde os numeros COMECAM, e isto diz em que regua eles sao lidos.

   ⚠ O PIB NAO ESTA AQUI, e a ausencia e a regra funcionando. PIB nominal nao tem teto
   natural: a regua dele e a PROPRIA largada da partida — do primeiro mes guardado ate
   metade a mais —, e uma faixa fixa envelheceria no primeiro ano de inflacao. Quem o
   desenha ancora na serie, e e o unico que faz isso.

   ⚠ E A BASE VAI DE ZERO A 513 PORQUE A CAMARA TEM 513, e nao por escolha de leitura.
   Cortar a regua em 200 faria a escada dramatizar a faixa em que a base costuma viver —
   que e exatamente o defeito que a normalizacao pela serie causa, so que digitado a
   mao. */
export const SCALE = /** @type {const} */ ({
  inflation: [0, 0.15],
  rate: [0, 0.25],
  unemployment: [0, 0.2],
  debtRatio: [0.4, 1.2],
});

/* ⚠ `approval: [0, 60]` E `base: [0, 513]` FORAM ESCRITAS E RETIRADAS EM 21/08/2026,
   junto com a escada dos vitais que as consumia — a captura reprovou a peca por largura,
   e regua sem desenho e um numero esperando envelhecer. A MEDICAO fica, porque ela vale
   no dia em que houver onde desenhar: contra [0, 100] a aprovacao usa TRES dos oito
   degraus num mandato inteiro, porque ela vive entre 12 e 36 em 48 meses de governo
   passivo. Sessenta nao seria arredondamento: seria a afirmacao de que "otimo ou bom"
   acima disso nao acontece na Republica que este jogo simula. */

/* QUANTO O PIB NOMINAL ANDA NUM MANDATO, e e o fator da regua dele.
   ⚠ ERA 1,5 — meia vez a mais que a largada — e o numero era um chute que nunca tinha
   sido medido. Medido em 21/08/2026, num mandato passivo de 48 meses: o PIB vai de
   12,06 para 15,18 tri, e contra uma regua que termina em 18,09 isso usa CINCO dos oito
   degraus. A escada gastava metade da altura dela numa faixa que a partida nunca visita.

   1,2 e o teto que a medicao suporta, e ele deixa a escada usar os oito degraus. Se um
   mandato inflacionario passar disso, `sparkline` prende no degrau de cima — que e a
   leitura certa: "estourou o alto da regua" e informacao, e nao erro. */
const GDP_SPAN = 1.2;

/**
 * A REGUA DO PIB, e ela nao e fixa: ancora na PROPRIA largada da partida.
 *
 * ⚠ ELA VIROU FUNCAO EM 21/08/2026 porque passou a ter DOIS consumidores — o painel de
 * Financas e a barra superior —, e ate aqui os dois digitavam a mesma expressao com o
 * mesmo fator. Duas copias de uma regua e a divergencia esperando a primeira
 * recalibragem, e foi exatamente numa recalibragem que ela foi descoberta.
 *
 * PIB nominal nao tem teto natural: uma faixa fixa em reais envelheceria no primeiro
 * ano de inflacao, e o que se quer ver dele e a distancia percorrida DESDE A POSSE.
 *
 * @param {ReadonlyArray<number>} gdp a serie, o mais antigo na frente
 * @param {number} fallback o PIB de hoje, para a partida que ainda nao guardou mes nenhum
 * @returns {readonly [number, number]}
 */
export function gdpRange(gdp, fallback) {
  const opening = gdp[0] ?? fallback;
  return [opening, opening * GDP_SPAN];
}

import { UI } from "../strings.mjs";

/**
 * @typedef {object} Trend
 * @property {number} delta - quanto o indice andou na janela, com sinal
 * @property {number} months - a janela que o historico de fato suportou
 */

/**
 * A JANELA EM PORTUGUES — "em 12 meses", "em 1 mês".
 *
 * O singular mora aqui e nao no template porque ele e a mesma frase: espalhar a
 * escolha por duas telas e como as duas variacoes divergiram em primeiro lugar.
 *
 * @param {number} months
 * @returns {string}
 */
export function windowLabel(months) {
  return `${UI.window.over} ${months} ${months === 1 ? UI.window.month : UI.window.months}`;
}

/**
 * QUANTO ANDOU, E EM QUANTOS MESES — ou `null` quando nao ha passado guardado.
 *
 * @param {number} value o indice de hoje
 * @param {ReadonlyArray<number>} history o passado guardado, o mais antigo na frente
 * @returns {Trend | null}
 */
export function trendOf(value, history) {
  /* O ULTIMO VALOR DO HISTORICO E O DE HOJE — a MALHA o empurra ao fechar o mes —,
     entao a janela disponivel e o comprimento MENOS UM. Contar o comprimento cheio
     faria a janela ser sempre um mes maior do que ela e. */
  const months = Math.min(WINDOW, history.length - 1);
  if (months < 1) return null;

  const then = history[history.length - 1 - months];
  if (then === undefined) return null;

  return { delta: value - then, months };
}
