/* CALDEIRA — a pressao que se acumula e, passado o limite, estoura.
   ⚠ E a mesma forma que SONDA usa para satisfacao, e pela mesma razao: reputacao se
   perde mais rapido do que se recupera. Simetrica, a caldeira seria um pendulo, e
   bastaria alternar quem se agrada para nunca esquentar nada.
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
    /* ⚠ A INERCIA E ASSIMETRICA — ver a prosa do topo. */
    const speed = target > now ? parameters.rise : parameters.cool;
    next[id] = clamp100(now + (target - now) * speed);
  }

  return next;
}

/**
 * QUANTO CADA GRUPO PESA NA RUPTURA ECONOMICA, ja normalizado, de 0 a 1.
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

  const shares = capitalShares(lobbies);
  let abandoned = 0;
  for (const lobby of lobbies) {
    if ((pressure[lobby.id] ?? 0) >= parameters.boil) abandoned += shares[lobby.id] ?? 0;
  }
  const economic = abandoned >= 0.5;

  /* ⚠ A RUPTURA POLITICA TEM LIMIAR PROPRIO, e ele e MAIS ALTO que o dos outros: o
     fisiologismo e o ultimo a virar, porque ele ganha dinheiro sustentando. */
  const political = (pressure[broker] ?? 0) >= parameters.brokerBoil;

  return { social, economic, political, open: social && economic && political };
}
