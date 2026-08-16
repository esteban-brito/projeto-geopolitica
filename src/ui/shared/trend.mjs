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
   A serie de indices por area nao existe no estado (`state.series` guarda o macro,
   e nada mais), e enquanto ela nao existir a Fazenda e a Previdencia nao tem
   tendencia para mostrar. Ausencia declarada, e nao ausencia disfarcada. */

/* ATE ONDE VALE A PENA OLHAR PARA TRAS. Doze meses e um ano de politica: um passo
   de meio ponto e ruido, e doze passos na mesma direcao sao uma decisao. Onde o
   historico guarda mais do que isso — a Educacao guarda 25 —, o excedente nao
   entra: "em 24 meses" mediria dois governos de orcamento num numero so. */
const WINDOW = 12;

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
