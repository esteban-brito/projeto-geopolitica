import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { image, openLab } from "./harness.mjs";

/**
 * HTML-in-Canvas, end to end, as this Chromium names it (layoutsubtree + drawElement, behind the
 * CanvasDrawElement flag): a real DOM page becomes the texture the glass refracts. Newer names
 * (drawElementImage, drawElementImageToTexture) are probed by the same adapter at runtime.
 */
const W = 320;
const H = 200;
let lab;
let supported = true;

before(async () => {
  lab = await openLab("/probe.html");
  await lab.page.waitForFunction(() => window.probe !== undefined);
  try {
    await lab.page.evaluate(([w, h]) => window.probe.init(w, h, "html"), [W, H]);
  } catch {
    supported = false;
  }
});

after(async () => {
  const errors = [...lab.errors];
  await lab.close();
  assert.deepEqual(errors, [], "a página não pode registrar erro");
});

const render = (req) => lab.page.evaluate((r) => window.probe.render(r), req).then(image);

/**
 * Two honest outcomes. Where the API paints into a clean canvas (the current one), the DOM is the
 * texture: the red square shows where the CSS put it, and the glass refracts it. Where it taints
 * the canvas (early builds such as this container's Chromium 141), the adapter must not throw:
 * it reports why and the lab falls back to a native scene.
 */
test("o DOM vira o fundo, ou o adaptador diz por que não, sem lançar", { skip: !supported && "sem HTML-in-Canvas neste Chromium" }, async () => {
  const img = await render({ surfaces: [] });
  const path = await lab.page.evaluate(() => window.probe.htmlPath());
  const failure = await lab.page.evaluate(() => window.probe.htmlFailure());
  if (failure) {
    console.log(`HTML-in-Canvas aqui: ${failure}`);
    assert.equal(path, "indisponível");
    return;
  }
  const [r, g, b] = img.at(70, 70);
  assert.ok(r > 230 && g < 30 && b < 30, `centro do quadrado: ${[r, g, b]}`);
  const [wr, wg, wb] = img.at(250, 170);
  assert.ok(wr > 240 && wg > 240 && wb > 240, `fundo da página: ${[wr, wg, wb]}`);
  assert.match(path, /^(ponte 2D|direto): /);
  const glass = { cx: 110, cy: 70, halfWidth: 60, halfHeight: 40, radius: 40, exponent: 2, rotation: 0 };
  const refracted = await render({ surfaces: [{ shape: glass, material: { shadow: 0, roughness: 0, adapt: 0 } }] });
  let changed = 0;
  for (let y = 30; y < 110; y++) for (let x = 50; x < 170; x++) if (Math.abs(img.at(x, y)[0] - refracted.at(x, y)[0]) > 40) changed++;
  assert.ok(changed > 100, `${changed} pixels mudaram sob o vidro`);
});
