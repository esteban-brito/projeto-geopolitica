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

/**
 * @param {(value: number) => void} onStep
 * @param {{ duration?: number, bounce?: number, from?: number, dt?: number }} [options]
 * @returns {(target: number, config?: { duration: number, bounce: number }) => void}
 */
export function spring(onStep, { duration = 0.4, bounce = 0, from = 0, dt = 1 / 60 } = {}) {
  let x = from;
  let v = 0;
  let target = from;
  let k = 0;
  let c = 0;
  let running = false;

  /** @param {number} d @param {number} q */
  const tune = (d, q) => {
    const w = (2 * Math.PI) / d;
    k = w * w;
    c = 2 * (1 - q) * w;
  };
  tune(duration, bounce);

  function step() {
    /* Semi-implicito: estavel em `dt` grande, ao contrario do Euler explicito. */
    const a = -k * (x - target) - c * v;
    v += a * dt;
    x += v * dt;
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
    }
    onStep(x);
    if (!settled) requestAnimationFrame(step);
  }

  return (to, config) => {
    if (config) tune(config.duration, config.bounce);
    target = to;
    if (!running) {
      running = true;
      requestAnimationFrame(step);
    }
  };
}

/** @param {number} from @param {number} to @param {number} t */
export const between = (from, to, t) => from + (to - from) * t;
