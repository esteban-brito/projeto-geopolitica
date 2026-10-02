/* CALDEIRA — a pressão que se acumula e, passado o limite, estoura.
   ⚠ É a mesma forma que SONDA usa para satisfação, e pela mesma razão: reputação se
   perde mais rápido do que se recupera. Simétrica, a caldeira seria um pêndulo, e
   bastaria alternar quem se agrada para nunca esquentar nada.
   Não sorteia. Não sabe de onde vem o descontentamento — quem lê LASTRO, ECLUSA e
   MALHA é a camada de aplicação, porque motor nenhum chama outro motor. E não decide
   a queda: ele diz que as três rupturas estão abertas, e QUEM DERRUBA é o plenário,
   com `vote`, como tudo o mais neste jogo. */

/**
 * @typedef {object} PressureParameters
 * @property {number} rise - fração do caminho até o alvo, subindo
 * @property {number} cool - a mesma fração, descendo. Menor que `rise`, sempre
 * @property {number} boil - a pressão a partir da qual um grupo ABANDONA o governo
 * @property {number} streetFloor - a aprovação abaixo da qual a rua rompe
 * @property {number} brokerBoil - a pressão do fisiologismo que abre a ruptura política
 * @typedef {object} Rupture
 * @property {boolean} social - a rua abandonou
 * @property {boolean} economic - o capital abandonou
 * @property {boolean} political - quem sustenta concluiu que sustentar custa caro
 * @property {boolean} open - as TRÊS ao mesmo tempo
 */

/** @param {number} value */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/**
 * A PRESSÃO DO MÊS SEGUINTE, grupo a grupo.
 *
 * @param {object} input
 * @param {Record<string, number>} input.pressure - o estoque de cada grupo, 0 a 100
 * @param {Record<string, number>} input.grievance - o descontentamento DESTE mês, 0 a 1
 * @param {PressureParameters} input.parameters
 * @returns {Record<string, number>}
 */
export function heat({ pressure, grievance, parameters }) {
  /** @type {Record<string, number>} */
  const next = {};

  for (const [id, want] of Object.entries(grievance)) {
    const now = pressure[id] ?? 0;
    const target = clamp100(want * 100);
    /* ⚠ A INÉRCIA É ASSIMÉTRICA — ver a prosa do topo. */
    const speed = target > now ? parameters.rise : parameters.cool;
    next[id] = clamp100(now + (target - now) * speed);
  }

  return next;
}

/**
 * QUANTO CADA GRUPO PESA NA RUPTURA ECONÔMICA, já normalizado, de 0 a 1.
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
 * AS TRÊS RUPTURAS — e o processo só abre com as três ao mesmo tempo.
 *
 * @param {object} input
 * @param {Record<string, number>} input.pressure
 * @param {ReadonlyArray<{ id: string, weight: number }>} input.lobbies
 * @param {number} input.standing - a aprovação da rua, 0 a 100
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

  /* ⚠ A RUPTURA POLÍTICA TEM LIMIAR PRÓPRIO, e ele é MAIS ALTO que o dos outros: o
     fisiologismo é o último a virar, porque ele ganha dinheiro sustentando. */
  const political = (pressure[broker] ?? 0) >= parameters.brokerBoil;

  return { social, economic, political, open: social && economic && political };
}
