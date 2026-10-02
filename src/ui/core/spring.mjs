/* A MOLA — o modelo da Apple, integrada por quadro.

   ⭐ ELA NÃO SE PARAMETRIZA POR RIGIDEZ. A Apple abandonou rigidez/amortecimento de
   propósito: o SwiftUI expõe `Spring(duration:bounce:)`, e a tradução é
   `w = 2pi/duracao`, `k = w^2`, `c = 2(1-quique)w`. O padrão de quase toda a interface
   do iOS tem quique ZERO — ultrapassar é reservado a gesto FÍSICO, e num botão lê como
   brinquedo.

   ⛔ E TRANSIÇÃO CSS NÃO PRESERVA VELOCIDADE: interrompida, ela recomeça do zero. Nenhum
   `cubic-bezier` conserta isso, e é a diferença que o olho chama de enlatado. */

/** O maior deslocamento que uma unidade da mola produz, em pixel — o que traduz o
    limiar de parada de abstrato para visível. */
const VISUAL_SCALE = 7.5;

/** O MAIOR PEDAÇO DE TEMPO QUE UM QUADRO INTEGRA. Acima disto o gesto perde compasso de
    propósito: uma aba que volta do segundo plano não deve rodar o movimento inteiro num
    quadro só. */
const SKIP = 1 / 6;

/**
 * ⛔ O TEMPO DECORRIDO É DIVIDIDO EM SUBPASSOS DE `dt`, e não integrado de uma vez: com passo
 * fixo por quadro a mola anda por QUADRO, e a 12 fps o gesto leva cinco vezes mais — medido na
 * mesa, largar a pasta levou 3s em vez de 0,26. ⛔ E o passo grande TAMBÉM não serve: a 1/20 a
 * descida de 0,26s tem `c·dt = 2,4`, e acima de 2 o amortecimento inverte de sinal e amplifica
 * — a pasta explodiu para 12.878px de altura na primeira medição.
 * ⚠ O TETO DE TEMPO fica por outra razão: uma aba que volta do segundo plano entrega um quadro
 * de segundos, e a mola não deve correr o gesto inteiro nele.
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

  /** @param {number} now o relógio do quadro, que `requestAnimationFrame` entrega */
  function step(now) {
    const elapsed = Math.min(SKIP, last === 0 ? dt : (now - last) / 1000);
    last = now;
    /* Semi-implícito: estável em `dt` pequeno, ao contrário do Euler explícito. */
    for (let corrido = 0; corrido < elapsed; corrido += dt) {
      const passo = Math.min(dt, elapsed - corrido);
      const a = -k * (x - target) - c * v;
      v += a * passo;
      x += v * passo;
    }
    /* ⚠ O LIMIAR DE PARADA É VISUAL, e não abstrato. Com 0,0004 em `x` a mola continuava
       rodando ~0,3s DEPOIS de o movimento ficar invisível: o maior deslocamento do gesto
       mede 7,5px, então 0,0004 valem 0,003px — trezentos milissegundos de composição para
       nada, e um salto no fim deles. Agora ela para quando o que RESTA de movimento é
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
      /* ⚠ O RELÓGIO RECOMEÇA A CADA GESTO: o intervalo entre a ÚLTIMA parada e este clique não
         é um quadro, e usá-lo como passo faria a mola começar com um salto. */
      last = 0;
      requestAnimationFrame(step);
    }
  };
}

/** @param {number} from @param {number} to @param {number} t */
export const between = (from, to, t) => from + (to - from) * t;

/* ══ A MOLA ANALÍTICA ═════════════════════════════════════════════════════════
   ⭐ A MESMA FÍSICA, RESOLVIDA EM VEZ DE INTEGRADA. A mola de cima anda por quadro na thread
   principal; esta resolve a EDO uma vez e entrega a curva pronta, que o compositor executa
   sozinho. O jogo pode engasgar que o voo continua no compasso.

   ⭐ E É ELA QUE PERMITE INTERROMPER SEM RECOMEÇAR: quem conhece `x(t)` conhece `x'(t)`, então
   no instante do novo clique a posição e a velocidade saem da CONTA, e não de uma medição entre
   dois quadros. É o que a transição CSS não faz, e é a diferença que o olho chama de enlatado. */

/** ⛔ O RESÍDUO EM QUE O MOVIMENTO ACABOU PARA O OLHO, e não para a matemática: a mola
    analítica leva tempo infinito para fechar em 1. Meio pixel num curso de 700px é 0,0007 —
    0,002 fica com folga abaixo do que uma tela mostra. */
const REST = 0.002;

/** Quantos pontos a curva leva ao CSS. Abaixo de 24 a fase de arranque sai poligonal; acima
    de 40 a string cresce sem a tela mudar. */
const POINTS = 32;

/**
 * A SOLUÇÃO EXATA, e os três regimes são três fórmulas — não uma aproximada.
 *
 * ⚠ `bounce` É A PARAMETRIZAÇÃO DA APPLE, a mesma da mola de cima: `zeta = 1 - bounce`,
 * `w = 2pi/duracao`. Quique zero é amortecimento crítico, que é o padrão de ato de Estado.
 *
 * @param {number} zeta
 * @param {number} w
 * @param {number} v0 a velocidade de partida, em cursos por segundo
 * @returns {(t: number) => { at: number, rate: number }} posição e velocidade no instante
 */
function solve(zeta, w, v0) {
  if (Math.abs(zeta - 1) < 0.005) {
    /* Crítico: raiz dupla em -w, e o termo linear carrega a velocidade. */
    const b = v0 - w;
    return t => {
      const decay = Math.exp(-w * t);
      return { at: 1 - decay * (1 - b * t), rate: decay * (b + w * (1 - b * t)) };
    };
  }
  if (zeta < 1) {
    const wd = w * Math.sqrt(1 - zeta * zeta);
    const a = -1;
    const b = (v0 - zeta * w) / wd;
    return t => {
      const decay = Math.exp(-zeta * w * t);
      const cos = Math.cos(wd * t);
      const sin = Math.sin(wd * t);
      const y = decay * (a * cos + b * sin);
      const dy = decay * ((b * wd - zeta * w * a) * cos - (a * wd + zeta * w * b) * sin);
      return { at: 1 + y, rate: dy };
    };
  }
  /* Superamortecido: duas raízes reais, e nenhuma oscilação. */
  const gap = Math.sqrt(zeta * zeta - 1);
  const r1 = -w * (zeta - gap);
  const r2 = -w * (zeta + gap);
  /* De `y(0) = -1` e `y'(0) = v0`: a1 + a2 = -1 e a1*r1 + a2*r2 = v0. */
  const a1 = (v0 + r2) / (r1 - r2);
  const a2 = -1 - a1;
  return t => {
    const e1 = Math.exp(r1 * t);
    const e2 = Math.exp(r2 * t);
    return { at: 1 + a1 * e1 + a2 * e2, rate: a1 * r1 * e1 + a2 * r2 * e2 };
  };
}

/**
 * QUANDO O MOVIMENTO ACABA PARA O OLHO — e ela é PROCURADA, e não uma constante.
 *
 * ⛔ A CONSTANTE ERRA NOS TRÊS REGIMES DE UMA VEZ. Com `1,22 x duracao` o resíduo do crítico
 * fica em 0,41%, o dobro do limiar — e como a curva crava o último ponto em 1, sobra um salto
 * de 2,8px num curso de 700px. A conta correta para o crítico dá 1,347; para um quique de 0,3
 * ela passa de 2,0. Procurar custa 200 avaliações uma vez por gesto.
 *
 * @param {(t: number) => { at: number, rate: number }} at
 * @param {number} duration
 * @returns {number}
 */
function settleOf(at, duration) {
  const ceiling = duration * 4;
  const step = ceiling / 200;
  let last = step;
  for (let t = step; t <= ceiling; t += step) {
    last = t;
    if (Math.abs(at(t).at - 1) < REST && Math.abs(at(t).rate) * duration < REST * 4) break;
  }
  return last;
}

/**
 * UM VOO — a curva para o CSS, e a conta para quem interromper.
 *
 * ⚠ A AMOSTRAGEM É DENSA NO ARRANQUE: `(i/n)^1.2` põe mais pontos onde a curvatura está, que
 * é o primeiro quinto do tempo. Com passos iguais sobram 7 pontos para 70% da variação, e a
 * 120 fps a poligonal aparece.
 *
 * @param {object} input
 * @param {number} input.duration em segundos
 * @param {number} [input.bounce] 0 é amortecimento crítico, que é o padrão
 * @param {number} [input.velocity] a velocidade de partida, em cursos por segundo
 * @returns {{ css: string, duration: number, at: (t: number) => number,
 *   rate: (t: number) => number }}
 */
export function curveOf({ duration, bounce = 0, velocity = 0 }) {
  const d = Math.max(0.05, duration);
  const zeta = Math.max(0.05, 1 - bounce);
  const w = (2 * Math.PI) / d;
  const at = solve(zeta, w, velocity);
  const settle = settleOf(at, d);

  /* ⛔ O `linear()` ESPAÇA OS PONTOS SOZINHO, e por isso cada um leva a POSIÇÃO escrita: sem
     ela o CSS assume passos iguais no tempo, e uma amostragem densa no arranque — que é o que
     põe pontos onde a curvatura está — sai DEFORMADA. Medido: a pasta chegava a 489px aos
     120ms onde a conta pede 635, porque os 29ms iniciais estavam esticados sobre 120. */
  const points = [];
  for (let i = 0; i <= POINTS; i++) {
    const share = Math.pow(i / POINTS, 1.2);
    points.push(`${Number(at(share * settle).at.toFixed(4))} ${(share * 100).toFixed(2)}%`);
  }
  /* ⚠ O ÚLTIMO PONTO É 1 EXATO: o CSS interpola ATÉ ele, e 0,9998 deixaria a peça parada fora
     do lugar para sempre. Ele só pode ser cravado porque `settleOf` garantiu que o salto já é
     menor que o limiar visual. */
  points[points.length - 1] = "1 100%";

  return {
    css: `linear(${points.join(",")})`,
    duration: settle,
    at: t => at(t).at,
    rate: t => at(t).rate,
  };
}
