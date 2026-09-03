/* O SQUIRCLE — a quina de CURVATURA CONTINUA.

   `border-radius` desenha um ARCO DE CIRCULO: a curvatura salta de zero, na reta, para 1/r
   no arco, num unico ponto. O olho le esse salto como uma emenda. A quina da Apple e uma
   superelipse — a curvatura CRESCE ao longo da transicao, e por isso a reta derrete na curva
   em vez de encontra-la. Medido no clone: 0,27px de desvio maximo entre as duas, e quase
   tudo dele e de TAXA e nao de posicao.

   O algoritmo e o de suavizacao por fator `s`: 0 e arco puro, 1 e superelipse cheia, e o
   preset do iOS equivale a 0,6. */

/** @param {number} degrees @returns {number} */
const rad = degrees => (degrees * Math.PI) / 180;

/**
 * O caminho SVG da quina continua.
 *
 * @param {object} input
 * @param {number} input.w
 * @param {number} input.h
 * @param {number} input.r
 * @param {number} [input.s] a suavizacao, de 0 a 1
 * @param {string} [input.corners] quatro digitos, na ordem SD · ID · IE · SE. `1` arredonda,
 *   `0` deixa reto. ⚠ A BARRA DO TOPO PRECISA DISTO: so os dois cantos de baixo dela
 *   existem — os de cima encostam na moldura da janela, e arredonda-los abre uma fresta.
 * @returns {string}
 */
export function squircle({ w, h, r, s = 0.6, corners = "1111" }) {
  const maxR = Math.min(w, h) / 2;
  const radius = Math.min(r, maxR);
  const p = Math.min((1 + s) * radius, maxR);

  let alpha;
  let beta;
  if (radius <= maxR / 2) {
    beta = 90 * (1 - s);
    alpha = 45 * s;
  } else {
    const ratio = (radius - maxR / 2) / (maxR / 2);
    beta = 90 * (1 - s * (1 - ratio));
    alpha = 45 * s * (1 - ratio);
  }

  const theta = (90 - beta) / 2;
  const dist = radius * Math.tan(rad(theta / 2));
  const arc = Math.sin(rad(beta / 2)) * radius * Math.SQRT2;
  const c = dist * Math.cos(rad(alpha));
  const d = c * Math.tan(rad(alpha));
  const b = (p - arc - c - d) / 3;
  const a = 2 * b;

  /** @param {number} value @returns {number} */
  const n = value => Math.round(value * 1000) / 1000;
  /** @param {number[]} v @returns {string} */
  const corner = (...v) =>
    `c ${v.slice(0, 6).map(n).join(" ")} a ${n(radius)} ${n(radius)} 0 0 1 ` +
    `${n(v[6] ?? 0)} ${n(v[7] ?? 0)} c ${v.slice(8).map(n).join(" ")}`;

  /* Canto reto: a linha vai ate o vertice e vira, e `p` deixa de ser recuado nesse lado. */
  /** @param {number} i @returns {boolean} */
  const on = i => corners[i] === "1";
  /** @param {number} side @param {number} value @returns {number} */
  const inset = (side, value) => (on(side) ? value : 0);

  return (
    `M ${n(inset(3, p))} 0` +
    ` L ${n(w - inset(0, p))} 0 ` +
    (on(0) ? corner(a, 0, a + b, 0, a + b + c, d, arc, arc, d, c, d, b + c, d, a + b + c) : "") +
    ` L ${n(w)} ${n(h - inset(1, p))} ` +
    (on(1)
      ? corner(0, a, 0, a + b, -d, a + b + c, -arc, arc, -c, d, -(b + c), d, -(a + b + c), d)
      : "") +
    ` L ${n(inset(2, p))} ${n(h)} ` +
    (on(2)
      ? corner(
          -a,
          0,
          -(a + b),
          0,
          -(a + b + c),
          -d,
          -arc,
          -arc,
          -d,
          -c,
          -d,
          -(b + c),
          -d,
          -(a + b + c),
        )
      : "") +
    ` L 0 ${n(inset(3, p))} ` +
    (on(3)
      ? corner(0, -a, 0, -(a + b), d, -(a + b + c), arc, -arc, c, -d, b + c, -d, a + b + c, -d)
      : "") +
    ` Z`
  );
}
