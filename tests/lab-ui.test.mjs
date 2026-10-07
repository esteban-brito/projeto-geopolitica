import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { openLab } from "./harness.mjs";

/**
 * The lab's interface, driven like a user drives it: real pointer, real clicks. WebGPU is off (the
 * glass is not drawn here), but the state the renderer would draw is read from window.lab.
 */
let lab;
let page;

before(async () => {
  lab = await openLab("/index.html", { webgpu: false, viewport: { width: 1280, height: 800 } });
  page = lab.page;
  await page.waitForFunction(() => window.lab !== undefined);
  // The "WebGPU indisponível" notice sits mid-stage and would swallow the pointer.
  await page.addStyleTag({ content: "#notice { display: none !important }" });
});

after(async () => {
  // WebGPU is off on purpose; everything else must be silent.
  const errors = lab.errors.filter((e) => !/webgpu|adapter/i.test(e));
  await lab.close();
  assert.deepEqual(errors, [], "a página não pode registrar erro");
});

const settle = (ms = 1500) => page.waitForTimeout(ms);
const centres = () => page.evaluate(() => window.lab.state.glasses.map((g) => [g.surface.shape.cx, g.surface.shape.cy]));

/** Every centre inside the visible stage and above the dock. */
async function assertInStage(label) {
  const { width, height, dockTop } = await page.evaluate(() => ({
    width: innerWidth,
    height: innerHeight,
    dockTop: document.querySelector("#dock").getBoundingClientRect().top,
  }));
  for (const [x, y] of await centres()) {
    assert.ok(x >= 0 && x <= width && y >= 0 && y <= Math.min(height, dockTop), `${label}: centro (${x.toFixed(0)}, ${y.toFixed(0)}) fora do palco`);
  }
}

/** Drag glass `index` by its centre to (toX, toY). The pointer cannot leave the viewport here. */
async function dragTo(index, toX, toY) {
  const [[x, y]] = (await centres()).slice(index, index + 1);
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let s = 1; s <= 12; s++) await page.mouse.move(x + ((toX - x) * s) / 12, y + ((toY - y) * s) / 12);
  await page.mouse.up();
}

test("arrastar um vidro até o canto, para baixo do dock, não o perde", async () => {
  const [[x0, y0]] = await centres();
  await dragTo(0, 1, 799);
  await settle();
  const [[x1, y1]] = await centres();
  assert.ok(Math.hypot(x1 - x0, y1 - y0) > 200, "o arrasto precisa ter movido o vidro");
  await assertInStage("depois do arrasto");
});

test("a janela encolhe e os vidros continuam no palco", async () => {
  await page.setViewportSize({ width: 560, height: 520 });
  await settle();
  await assertInStage("janela 560×520");
  await page.setViewportSize({ width: 1280, height: 800 });
  await settle(300);
});

test("clicar num vidro o seleciona, e a gaveta diz qual é", async () => {
  const [, [x, y]] = await centres();
  await page.mouse.click(x, y);
  await page.click('button[aria-label="Ajustes finos"]');
  const subject = await page.textContent("#drawer-subject");
  assert.match(subject, /^Vidro 2 de 2/);
});

test("gaveta e métricas abertas ao mesmo tempo não se cobrem", async () => {
  await page.click("#stats");
  assert.equal(await page.isVisible("#drawer"), true, "a gaveta continua aberta");
  assert.equal(await page.isVisible("#stats-card"), true, "as métricas abriram");
  const [a, b] = await page.evaluate(() => ["#drawer", "#stats-card"].map((s) => document.querySelector(s).getBoundingClientRect().toJSON()));
  const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  assert.ok(!overlap, `gaveta ${JSON.stringify(a)} × métricas ${JSON.stringify(b)}`);
  await page.click("#stats");
});

test("nenhum ajuste da gaveta repete o nome de outro", async () => {
  const labels = await page.$$eval("#drawer .field__head > span:first-child, #drawer .toggle > span", (els) => els.map((e) => e.textContent));
  const repeated = labels.filter((l, i) => labels.indexOf(l) !== i);
  assert.deepEqual(repeated, []);
});

test("um valor que a geometria limita diz o limite em vez de não fazer nada", async () => {
  // The selected glass is the circle (radius 88): a bevel of 80 fits; shrink the corner first.
  const bevel = page.locator(".field", { hasText: "Borda curva" }).locator("input");
  const corners = page.locator(".field", { hasText: "Cantos" }).locator("input");
  await page.click("#drawer summary >> text=Forma");
  await corners.fill("30");
  await bevel.fill("80");
  const text = await page.locator(".field", { hasText: "Borda curva" }).locator(".field__value").textContent();
  assert.match(text, /^30 px · limite do canto$/);
});

test("forma: o ajuste manual desmarca a forma do dock; escolher outra anima até ela", async () => {
  const pressed = () => page.$$eval('#dock button[aria-label^="Forma:"][aria-pressed="true"]', (b) => b.map((x) => x.getAttribute("aria-label")));
  assert.deepEqual(await pressed(), [], "depois de mexer nos cantos, nenhuma forma do dock vale");
  await page.click('button[aria-label="Forma: Cápsula"]');
  assert.deepEqual(await pressed(), ["Forma: Cápsula"]);
  await settle();
  const s = await page.evaluate(() => window.lab.state.glasses[window.lab.state.selected].surface.shape);
  assert.deepEqual([s.halfWidth, s.halfHeight, s.radius], [150, 44, 44]);
});

test("adicionar até o máximo desliga o +, remover religa; os novos nascem no palco", async () => {
  await page.click('button[aria-label="Fechar ajustes"]');
  const add = page.locator('button[aria-label="Adicionar um vidro"]');
  for (let i = 0; i < 4; i++) await add.click();
  assert.equal(await add.isDisabled(), true);
  assert.equal((await centres()).length, 6);
  await assertInStage("seis vidros");
  await page.click('button[aria-label="Remover o vidro selecionado"]');
  assert.equal(await add.isDisabled(), false);
  assert.equal((await centres()).length, 5);
});

test("duplo clique num vidro abre os ajustes", async () => {
  const [[x, y]] = await centres();
  await page.mouse.dblclick(x, y);
  assert.equal(await page.isVisible("#drawer"), true);
});

test("camadas: o vidro posto por cima não se funde com os de baixo e pega o toque primeiro", async () => {
  await page.keyboard.press("Escape");
  const layerChip = page.locator('button[aria-label^="Pôr o vidro selecionado por cima"]');
  const [[x0, y0], [x1, y1]] = await centres();
  await page.mouse.click(x0, y0);
  await layerChip.click();
  assert.equal(await layerChip.getAttribute("aria-pressed"), "true");
  // Glass 0 onto glass 1: on one layer they would merge; across layers the upper one floats over.
  await dragTo(0, x1, y1);
  await settle();
  const groups = await page.evaluate(() => {
    const surfaces = window.lab.state.glasses.map((g) => g.surface);
    return window.lab.groups().map((g) => ({ layer: g.layer ?? 0, members: g.surfaces.map((s) => surfaces.indexOf(s)) }));
  });
  const upper = groups.find((g) => g.layer === 1);
  const base = groups.find((g) => g.layer === 0);
  assert.deepEqual(upper.members, [0], "só o vidro 0 está por cima");
  assert.ok(!base.members.includes(0) && base.members.includes(1), "e não entra no grupo de fusão dos outros");
  // Where both overlap, the press is the upper glass's.
  await page.mouse.click(x0 + 300, y0 + 200);
  await page.mouse.click(x1, y1);
  assert.equal(await page.evaluate(() => window.lab.state.selected), 0, "o toque na sobreposição seleciona o de cima");
  await page.mouse.dblclick(x1, y1);
  assert.match(await page.textContent("#drawer-subject"), /por cima/);
});
