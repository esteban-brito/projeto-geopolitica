/**
 * Screenshot of the lab's interface over its glass. Here the lab's own canvas cannot present
 * (headless SwiftShader loses the GPU process on a swapchain, and with it every accelerated 2D
 * canvas), so the interface is shot with WebGPU off, the same glasses are rendered offscreen by the
 * probe, and the two are layered. Writes captures/ui-*.png.
 *   node tests/ui-shot.mjs            closed, drawer open, stats open, mobile
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { openLab } from "./harness.mjs";
import { png } from "./png.mjs";

const OUT = new URL("../captures/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const probe = await openLab("/probe.html");
await probe.page.waitForFunction(() => window.probe !== undefined);
const origin = new URL(probe.page.url()).origin;
const plain = await chromium.launch({ executablePath: process.env.LAB_CHROMIUM || undefined });

/** Centre of glass `i` in CSS px, read from the lab. */
const centre = (page, i) => page.evaluate((k) => {
  const s = window.lab.state.glasses[k].surface.shape;
  return [s.cx, s.cy];
}, i);

/** Drag glass `i` by (dx, dy) with a real pointer, then let the springs settle. */
async function drag(page, i, dx, dy) {
  const [x, y] = await centre(page, i);
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let s = 1; s <= 20; s++) await page.mouse.move(x + (dx * s) / 20, y + (dy * s) / 20);
  await page.mouse.up();
  await page.waitForTimeout(1200);
}

const VIEWS = [
  { name: "ui", width: 1440, height: 900 },
  { name: "ui-merged", width: 1440, height: 900, act: (page) => drag(page, 1, -105, 10) },
  {
    name: "ui-morph",
    width: 1440,
    height: 900,
    act: async (page) => {
      await drag(page, 1, -100, 0);
      await page.click('button[aria-label^="Forma: Squircle"]');
      await page.click('button[aria-label^="Cristal"]');
      await page.waitForTimeout(1200);
    },
  },
  {
    // The circle goes over the capsule: it refracts the capsule, its symbol and its shadow.
    name: "ui-layers",
    width: 1440,
    height: 900,
    act: async (page) => {
      await page.evaluate(() => window.lab.select(1));
      await page.click('button[aria-label^="Pôr o vidro selecionado por cima"]');
      await drag(page, 1, -190, 26);
    },
  },
  { name: "ui-drawer", width: 1440, height: 900, click: ['button[aria-label="Ajustes finos"]'] },
  { name: "ui-stats", width: 1440, height: 900, click: ["#stats"] },
  { name: "ui-drawer-stats", width: 1440, height: 900, click: ['button[aria-label="Ajustes finos"]', "#stats"] },
  { name: "ui-mobile", width: 390, height: 844, scale: 2 },
  { name: "ui-mobile-drawer", width: 390, height: 844, scale: 2, click: ['button[aria-label="Ajustes finos"]'] },
];

for (const view of VIEWS) {
  const page = await plain.newPage({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: view.scale ?? 1 });
  await page.goto(`${origin}/index.html`);
  await page.waitForFunction(() => window.lab !== undefined);
  for (const selector of view.click ?? []) await page.click(selector);
  if (view.act) await view.act(page);
  await page.waitForTimeout(400);
  const w = view.width * (view.scale ?? 1);
  const h = view.height * (view.scale ?? 1);
  // The probe renders at dpr 1: scale the CSS-pixel scene to the screenshot's device pixels.
  const k = view.scale ?? 1;
  const toProbe = (groups) =>
    groups
      .filter((g) => g.surfaces.length > 0)
      .map((g) => ({
        spacing: g.spacing * k,
        layer: g.layer ?? 0,
        surfaces: g.surfaces.map(({ shape, material, appearance, content }) => ({
          shape: { ...shape, cx: shape.cx * k, cy: shape.cy * k, halfWidth: shape.halfWidth * k, halfHeight: shape.halfHeight * k, radius: shape.radius * k },
          material: { ...material, thickness: material.thickness * k, gap: material.gap * k, bevel: material.bevel * k },
          ...(appearance !== undefined ? { appearance } : {}),
          ...(content ? { content: { ...content, size: content.size * k } } : {}),
        })),
      }));
  await probe.page.evaluate(([pw, ph, s]) => window.probe.init(pw, ph, s), [w, h, await page.evaluate(() => window.lab.state.scene)]);
  // A first frame measures what lies under each glass; the lab's policies take the measurement,
  // and the appearances and symbol colours they settle on are what the second frame draws.
  await probe.page.evaluate((r) => window.probe.render(r), { groups: toProbe(await page.evaluate(() => window.lab.groups())) });
  const stats = (await probe.page.evaluate(() => window.probe.backdrop())).flat();
  await page.evaluate((st) => window.lab.backdrop(st), stats);
  await page.waitForTimeout(100);
  const out = await probe.page.evaluate((r) => window.probe.render(r), { groups: toProbe(await page.evaluate(() => window.lab.groups())) });
  const glass = png(out.width, out.height, Buffer.from(out.rgba, "base64"));

  await page.addStyleTag({ content: "html, body, .lab, #stage { background: transparent !important } #stage, #notice { visibility: hidden }" });
  const ui = await page.screenshot({ omitBackground: true });
  await page.close();

  const compose = await plain.newPage({ viewport: { width: w, height: h } });
  await compose.setContent(
    `<body style="margin:0"><img src="data:image/png;base64,${glass.toString("base64")}" style="position:absolute;inset:0">` +
      `<img src="data:image/png;base64,${ui.toString("base64")}" style="position:absolute;inset:0;width:${w}px;height:${h}px"></body>`,
  );
  await compose.waitForTimeout(100);
  writeFileSync(new URL(`${view.name}.png`, OUT), await compose.screenshot());
  await compose.close();
  console.log(`${view.name}.png`);
}
await plain.close();
if (probe.errors.length) console.error(probe.errors);
await probe.close();
