/**
 * A real page to put under the glass with HTML-in-Canvas: text the browser lays out, controls you
 * can use, a clock that ticks and a scroll position — the things a native scene cannot be.
 * Everything is local (cross-origin images and fonts are not painted by HTML-in-Canvas).
 */
export function buildHtmlPage(): HTMLElement {
  const page = document.createElement("article");
  page.className = "hic-page";
  page.innerHTML = `
    <header class="hic-hero">
      <p class="hic-kicker">HTML de verdade, sob vidro de verdade</p>
      <h1>Esta página é DOM vivo</h1>
      <p>O navegador pinta o texto, os botões e o campo abaixo; o laboratório recebe a imagem pela
      API HTML-in-Canvas e o vidro refrata o que está aqui. Role, clique, digite: o vidro vê.</p>
      <p class="hic-clock">agora: <time></time></p>
    </header>
    <section class="hic-card">
      <h2>Controles</h2>
      <div class="hic-row">
        <button type="button" data-count="0">Cliques: 0</button>
        <button type="button" class="hic-accent">Trocar de cor</button>
      </div>
      <label class="hic-field">Escreva algo<input type="text" placeholder="o vidro vai refratar o que você digitar" /></label>
      <label class="hic-check"><input type="checkbox" checked /> Caixa de seleção</label>
    </section>
    <section class="hic-card">
      <h2>Por que isso importa</h2>
      <p>Uma cena nativa é uma imagem que o laboratório desenha sozinho. Uma interface de verdade
      muda o tempo todo: texto que rola, botões que mudam de estado, campos que recebem foco. Com
      HTML-in-Canvas o fundo do vidro é a própria interface, e a pirâmide de borrado só é refeita
      quando o navegador avisa que algo mudou.</p>
      <ul>
        <li>o clique em cima de um vidro é do vidro; fora dele, é da página;</li>
        <li>a rolagem e a digitação chegam à página normalmente;</li>
        <li>o texto sai em antialias de escala de cinza (a API não pinta subpixel).</li>
      </ul>
    </section>
    ${Array.from(
      { length: 6 },
      (_, i) => `<section class="hic-card hic-band hic-band-${i % 3}"><h2>Seção ${i + 1}</h2>
      <p>A luz muda de direção quando atravessa a fronteira entre dois meios. O ângulo de entrada e o
      de saída obedecem à lei de Snell. Perto da borda, quase toda a luz é refletida: é o que
      escurece a aresta de uma peça grossa.</p></section>`,
    ).join("")}
  `;
  const time = page.querySelector("time")!;
  const tick = () => (time.textContent = new Date().toLocaleTimeString("pt-BR"));
  tick();
  const timer = window.setInterval(tick, 1000);
  page.addEventListener("hic:dispose", () => clearInterval(timer));
  const counter = page.querySelector<HTMLButtonElement>("[data-count]")!;
  counter.addEventListener("click", () => {
    const n = Number(counter.dataset.count) + 1;
    counter.dataset.count = String(n);
    counter.textContent = `Cliques: ${n}`;
  });
  page.querySelector(".hic-accent")!.addEventListener("click", () => page.classList.toggle("hic-alt"));
  return page;
}
