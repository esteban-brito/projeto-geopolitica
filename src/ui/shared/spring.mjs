/* A MOLA — o modelo da Apple, integrada por quadro.

   ⭐ ELA NAO SE PARAMETRIZA POR RIGIDEZ. A Apple abandonou rigidez/amortecimento de
   proposito: o SwiftUI expoe `Spring(duration:bounce:)`, e a traducao e
   `w = 2pi/duracao`, `k = w^2`, `c = 2(1-quique)w`. O padrao de quase toda a interface
   do iOS tem quique ZERO — ultrapassar e reservado a gesto FISICO, e num botao le como
   brinquedo.

   ⛔ E TRANSICAO CSS NAO PRESERVA VELOCIDADE: interrompida, ela recomeca do zero. Nenhum
   `cubic-bezier` conserta isso, e e a diferenca que o olho chama de enlatado. */

/** O maior deslocamento que uma unidade da mola produz, em pixel — o que traduz o
    limiar de parada de abstrato para visivel. */
const VISUAL_SCALE = 7.5;

/** O MAIOR PEDACO DE TEMPO QUE UM QUADRO INTEGRA. Acima disto o gesto perde compasso de
    proposito: uma aba que volta do segundo plano nao deve rodar o movimento inteiro num
    quadro so. */
const SKIP = 1 / 6;

/**
 * ⛔ O TEMPO DECORRIDO E DIVIDIDO EM SUBPASSOS DE `dt`, e nao integrado de uma vez: com passo
 * fixo por quadro a mola anda por QUADRO, e a 12 fps o gesto leva cinco vezes mais — medido na
 * mesa, largar a pasta levou 3s em vez de 0,26. ⛔ E o passo grande TAMBEM nao serve: a 1/20 a
 * descida de 0,26s tem `c·dt = 2,4`, e acima de 2 o amortecimento inverte de sinal e amplifica
 * — a pasta explodiu para 12.878px de altura na primeira medicao.
 * ⚠ O TETO DE TEMPO fica por outra razao: uma aba que volta do segundo plano entrega um quadro
 * de segundos, e a mola nao deve correr o gesto inteiro nele.
 *
 * @param {(value: number) => void} onStep
 * @param {{ duration?: number, bounce?: number, from?: number, dt?: number }} [options]
 * @returns {(target: number, config?: { duration: number, bounce: number }) => void}
 */
export function spring(onStep, { duration = 0.4, bounce = 0, from = 0, dt = 1 / 120 } = {}) {
  let x = from;
  let v = 0;
  let target = from;
  let k = 0;
  let c = 0;
  let running = false;
  let last = 0;

  /** @param {number} d @param {number} q */
  const tune = (d, q) => {
    const w = (2 * Math.PI) / d;
    k = w * w;
    c = 2 * (1 - q) * w;
  };
  tune(duration, bounce);

  /** @param {number} now o relogio do quadro, que `requestAnimationFrame` entrega */
  function step(now) {
    const elapsed = Math.min(SKIP, last === 0 ? dt : (now - last) / 1000);
    last = now;
    /* Semi-implicito: estavel em `dt` pequeno, ao contrario do Euler explicito. */
    for (let corrido = 0; corrido < elapsed; corrido += dt) {
      const passo = Math.min(dt, elapsed - corrido);
      const a = -k * (x - target) - c * v;
      v += a * passo;
      x += v * passo;
    }
    /* ⚠ O LIMIAR DE PARADA E VISUAL, e nao abstrato. Com 0,0004 em `x` a mola continuava
       rodando ~0,3s DEPOIS de o movimento ficar invisivel: o maior deslocamento do gesto
       mede 7,5px, entao 0,0004 valem 0,003px — trezentos milissegundos de composicao para
       nada, e um salto no fim deles. Agora ela para quando o que RESTA de movimento e
       menor que um cinquenta avos de pixel. */
    const leftInPx = Math.abs(x - target) * VISUAL_SCALE;
    const settled = leftInPx < 0.02 && Math.abs(v) * VISUAL_SCALE < 0.6;
    if (settled) {
      x = target;
      v = 0;
      running = false;
      last = 0;
    }
    onStep(x);
    if (!settled) requestAnimationFrame(step);
  }

  return (to, config) => {
    if (config) tune(config.duration, config.bounce);
    target = to;
    if (!running) {
      running = true;
      /* ⚠ O RELOGIO RECOMECA A CADA GESTO: o intervalo entre a ULTIMA parada e este clique nao
         e um quadro, e usa-lo como passo faria a mola comecar com um salto. */
      last = 0;
      requestAnimationFrame(step);
    }
  };
}

/** @param {number} from @param {number} to @param {number} t */
export const between = (from, to, t) => from + (to - from) * t;
