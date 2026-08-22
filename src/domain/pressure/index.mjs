/* CALDEIRA — a pressao que se acumula e, passado o limite, estoura.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   a pressao de cada grupo, o descontentamento do mes e os parametros
   devolve  a pressao nova, e se as tres rupturas estao abertas ao mesmo tempo

   O codinome e o mecanismo. Um grupo de pressao nao fica "descontente" de forma
   continua e inofensiva: ele suporta, suporta, e entao age de uma vez.

   ── POR QUE ELA E ESTOQUE, E NAO LEITURA ────────────────────────────────────
   Descontentamento se mede no mes; PRESSAO se acumula. Um governo que irrita o
   mercado por um mes e o agrada no seguinte nao volta ao ponto de partida — a
   desconfianca fica. Sem estoque, este motor seria um termômetro caro: a pressao
   sumiria no mes em que o jogador consertasse o numero, e nada teria consequencia.

   ── ELA SOBE RAPIDO E DESCE DEVAGAR, e a assimetria e a mecanica ─────────────
   ⚠ E a mesma forma que SONDA usa para satisfacao, e pela mesma razao: reputacao se
   perde mais rapido do que se recupera. Simetrica, a caldeira seria um pendulo, e
   bastaria alternar quem se agrada para nunca esquentar nada.

   ── O QUE ESTE MOTOR NAO FAZ ────────────────────────────────────────────────
   Nao sorteia. Nao sabe de onde vem o descontentamento — quem lê LASTRO, ECLUSA e
   MALHA e a camada de aplicacao, porque motor nenhum chama outro motor. E nao decide
   a queda: ele diz que as tres rupturas estao abertas, e QUEM DERRUBA e o plenario,
   com `vote`, como tudo o mais neste jogo. */

/**
 * @typedef {object} PressureParameters
 * @property {number} rise - fracao do caminho ate o alvo, subindo
 * @property {number} cool - a mesma fracao, descendo. Menor que `rise`, sempre
 * @property {number} boil - a pressao a partir da qual um grupo ABANDONA o governo
 * @property {number} streetFloor - a aprovacao abaixo da qual a rua rompe
 * @property {number} brokerBoil - a pressao do fisiologismo que abre a ruptura politica
 *
 * @typedef {object} Rupture
 * @property {boolean} social - a rua abandonou
 * @property {boolean} economic - o capital abandonou
 * @property {boolean} political - quem sustenta concluiu que sustentar custa caro
 * @property {boolean} open - as TRES ao mesmo tempo
 */

/** @param {number} value */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/**
 * A PRESSAO DO MES SEGUINTE, grupo a grupo.
 *
 * @param {object} input
 * @param {Record<string, number>} input.pressure - o estoque de cada grupo, 0 a 100
 * @param {Record<string, number>} input.grievance - o descontentamento DESTE mes, 0 a 1
 * @param {PressureParameters} input.parameters
 * @returns {Record<string, number>}
 */
export function heat({ pressure, grievance, parameters }) {
  /** @type {Record<string, number>} */
  const next = {};

  for (const [id, want] of Object.entries(grievance)) {
    const now = pressure[id] ?? 0;
    const target = clamp100(want * 100);
    /* ⚠ A INERCIA E ASSIMETRICA — ver a prosa do topo. Subir e ceder ao alvo mais
       rapido do que descer, e por isso um mes ruim custa mais meses bons. */
    const speed = target > now ? parameters.rise : parameters.cool;
    next[id] = clamp100(now + (target - now) * speed);
  }

  return next;
}

/**
 * QUANTO CADA GRUPO PESA NA RUPTURA ECONOMICA, ja normalizado, de 0 a 1.
 *
 * ⚠ ELA NASCEU EM 21/08/2026 PARA A TELA, e o motivo de ser uma FUNCAO e nao uma
 * conta na tela e a regra dura deste projeto: quem mostra nao refaz conta de quem
 * executa. A caldeira do Gabinete desenha quatro reguas identicas, e uma delas — as
 * forcas de ordem — tem peso ZERO: ela pode ferver o mandato inteiro sem mover a
 * ruptura economica um milimetro. A tela nao tinha como dizer isso, e por isso dizia
 * o contrario por omissao.
 *
 * ⚠ E ELA TIRA UMA DUPLICATA, e nao acrescenta uma. `rupture`, logo abaixo, somava o
 * total dos pesos no proprio laco; com a tela precisando do mesmo total, seriam duas
 * somas para uma verdade. Agora ha uma, e o dia em que um quinto grupo entrar no
 * catalogo ela se refaz sozinha nos dois lugares.
 *
 * O PESO ZERO SAI COMO ZERO, e nao como ausente: quem pergunta a fatia de um grupo
 * que nao pesa recebe a resposta certa, que e "nenhuma".
 *
 * @param {ReadonlyArray<{ id: string, weight: number }>} lobbies
 * @returns {Record<string, number>}
 */
export function capitalShares(lobbies) {
  let total = 0;
  for (const lobby of lobbies) {
    if (lobby.weight > 0) total += lobby.weight;
  }

  /** @type {Record<string, number>} */
  const shares = {};
  for (const lobby of lobbies) {
    shares[lobby.id] = total > 0 && lobby.weight > 0 ? lobby.weight / total : 0;
  }
  return shares;
}

/**
 * AS TRES RUPTURAS — e o processo so abre com as tres ao mesmo tempo.
 *
 * ⚠ PRESIDENTES NAO CAEM POR UM FATOR SO, e este e o achado que o nono dossie
 * externo trouxe para dentro do projeto. Um limiar unico de pressao daria um jogo em
 * que irritar muito um grupo derruba o governo — e nao e assim que funciona:
 *
 *   SOCIAL     a rua abandona. Sem ela, derrubar um presidente e golpe, e o custo
 *              politico de tentar e maior que o de aguentar;
 *   ECONOMICA  o capital abandona. Sem ele, nao ha quem banque a operacao;
 *   POLITICA   quem sustenta conclui que sustentar custa mais que derrubar. E a
 *              ultima a virar, e e ela que efetivamente abre a gaveta.
 *
 * ⚠ E A ORDEM NAO IMPORTA — o que importa e a SIMULTANEIDADE. As tres ja
 * aconteceram separadas muitas vezes na Republica sem derrubar ninguem.
 *
 * @param {object} input
 * @param {Record<string, number>} input.pressure
 * @param {ReadonlyArray<{ id: string, weight: number }>} input.lobbies
 * @param {number} input.standing - a aprovacao da rua, 0 a 100
 * @param {string} input.broker - o id do grupo que sustenta o governo no Congresso
 * @param {PressureParameters} input.parameters
 * @returns {Rupture}
 */
export function rupture({ pressure, lobbies, standing, broker, parameters }) {
  const social = standing < parameters.streetFloor;

  /* A RUPTURA ECONOMICA E PONDERADA, e nao "qualquer um deles". Um grupo com peso
     zero pode ferver sem que o capital tenha abandonado nada — as forcas de ordem
     nao financiam campanha nem precificam divida, e o peso delas diz isso.

     ⚠ O TOTAL SAIU DAQUI em 21/08/2026 e virou `capitalShares`, logo acima: a tela
     passou a mostrar a fatia de cada grupo, e duas somas para a mesma verdade e a
     divergencia esperando o quinto lobby entrar no catalogo. Com a fatia ja
     normalizada, o que sobra aqui e a soma de quem ABANDONOU — que e a pergunta
     desta funcao, e a unica. */
  const shares = capitalShares(lobbies);
  let abandoned = 0;
  for (const lobby of lobbies) {
    if ((pressure[lobby.id] ?? 0) >= parameters.boil) abandoned += shares[lobby.id] ?? 0;
  }
  const economic = abandoned >= 0.5;

  /* ⚠ A RUPTURA POLITICA TEM LIMIAR PROPRIO, e ele e MAIS ALTO que o dos outros: o
     fisiologismo e o ultimo a virar, porque ele ganha dinheiro sustentando. Enquanto
     houver torneira, ele fica — e e por isso que ele e o unico dos quatro que se
     compra ate o fim. */
  const political = (pressure[broker] ?? 0) >= parameters.brokerBoil;

  return { social, economic, political, open: social && economic && political };
}
