/**
 * Renders the lab's scenes offscreen and writes PNGs to captures/ for visual review. The gate
 * (`npm test`) checks numbers; only looking at these images checks the material.
 *   node tests/capture.mjs            all scenes × shapes
 *   node tests/capture.mjs --presets  materials on four backgrounds
 *   node tests/capture.mjs --union    merge groups: approach, neck, overlap, debug views
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { image, openLab } from "./harness.mjs";
import { png } from "./png.mjs";

const OUT = new URL("../captures/", import.meta.url);
const W = 960;
const H = 600;

const SHAPES = {
  capsule: { cx: 480, cy: 300, halfWidth: 190, halfHeight: 56, radius: 56, exponent: 2, rotation: 0 },
  panel: { cx: 480, cy: 300, halfWidth: 260, halfHeight: 170, radius: 44, exponent: 3.2, rotation: 0 },
  circle: { cx: 480, cy: 300, halfWidth: 110, halfHeight: 110, radius: 110, exponent: 2, rotation: 0 },
  squircle: { cx: 480, cy: 300, halfWidth: 120, halfHeight: 120, radius: 90, exponent: 4, rotation: 0.3 },
};

mkdirSync(OUT, { recursive: true });
const lab = await openLab("/probe.html");
await lab.page.waitForFunction(() => window.probe !== undefined);

const PRESETS = process.argv.includes("--presets");
const UNION = process.argv.includes("--union");
const circle = (cx, cy, r) => ({ cx, cy, halfWidth: r, halfHeight: r, radius: r, exponent: 2, rotation: 0 });
/** Two circles of radius 90 whose gap is `gap` px (negative overlaps), merging below `spacing`. */
const pair = (gap, spacing = 48) => ({
  spacing,
  surfaces: [{ shape: circle(480 - 90 - gap / 2, 300, 90) }, { shape: circle(480 + 90 + gap / 2, 300, 90) }],
});
const UNIONS = {
  "apart": pair(70),
  "bridge": pair(36),
  "touch": pair(0),
  "overlap": pair(-60),
  "toolbar": {
    spacing: 40,
    surfaces: [
      { shape: { cx: 330, cy: 300, halfWidth: 120, halfHeight: 40, radius: 40, exponent: 2, rotation: 0 } },
      { shape: circle(500, 300, 40) },
      { shape: circle(590, 300, 40), material: { tint: [0.35, 0.55, 1], density: 0.8 } },
      { shape: { cx: 520, cy: 400, halfWidth: 150, halfHeight: 34, radius: 30, exponent: 3.2, rotation: 0.12 } },
    ],
  },
};
const jobs = [];
if (UNION) {
  for (const scene of ["grid", "image", "text"]) {
    for (const union of Object.keys(UNIONS)) jobs.push({ scene, union, debugView: 0 });
  }
  for (const union of ["bridge", "touch", "toolbar"]) {
    for (const debugView of [2, 3, 4, 12]) jobs.push({ scene: "grid", union, debugView });
  }
} else if (PRESETS) {
  for (const preset of ["clear", "regular", "frost", "crystal", "smoke"]) {
    for (const scene of ["image", "text", "solid-light", "solid-dark"]) jobs.push({ scene, shape: "capsule", preset, debugView: 0 });
  }
} else {
  for (const scene of ["grid", "text", "image", "color"]) {
    for (const shape of Object.keys(SHAPES)) jobs.push({ scene, shape, debugView: 0 });
  }
  for (const debugView of [1, 2, 3, 4, 5, 8, 9, 10, 11]) jobs.push({ scene: "grid", shape: "panel", debugView });
}

let current = "";
for (const job of jobs) {
  if (job.scene !== current) {
    await lab.page.evaluate(([w, h, s]) => window.probe.init(w, h, s), [W, H, job.scene]);
    current = job.scene;
  }
  const material = job.preset ? await lab.page.evaluate((p) => window.probe.preset(p), job.preset) : undefined;
  const request = job.union
    ? { groups: [UNIONS[job.union]], debugView: job.debugView }
    : { surfaces: [{ shape: SHAPES[job.shape], material }], debugView: job.debugView };
  const out = await lab.page.evaluate((r) => window.probe.render(r), request);
  const img = image(out);
  const subject = job.union ? `union-${job.union}` : job.shape;
  const name = `${job.preset ? `${job.preset}-` : ""}${job.scene}-${subject}${job.debugView ? `-debug${job.debugView}` : ""}.png`;
  writeFileSync(new URL(name, OUT), png(img.width, img.height, Buffer.from(out.rgba, "base64")));
  console.log(name);
}
if (lab.errors.length) console.error(lab.errors);
await lab.close();
