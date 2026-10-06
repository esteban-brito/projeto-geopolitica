/**
 * Renders the lab's scenes offscreen and writes PNGs to captures/ for visual review. The gate
 * (`npm test`) checks numbers; only looking at these images checks the material.
 *   node tests/capture.mjs            all scenes × shapes
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { image, openLab } from "./harness.mjs";

const OUT = new URL("../captures/", import.meta.url);
const W = 960;
const H = 600;

const SHAPES = {
  capsule: { cx: 480, cy: 300, halfWidth: 190, halfHeight: 56, radius: 56, exponent: 2, rotation: 0 },
  panel: { cx: 480, cy: 300, halfWidth: 260, halfHeight: 170, radius: 44, exponent: 3.2, rotation: 0 },
  circle: { cx: 480, cy: 300, halfWidth: 110, halfHeight: 110, radius: 110, exponent: 2, rotation: 0 },
  squircle: { cx: 480, cy: 300, halfWidth: 120, halfHeight: 120, radius: 90, exponent: 4, rotation: 0.3 },
};

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(OUT, { recursive: true });
const lab = await openLab("/probe.html");
await lab.page.waitForFunction(() => window.probe !== undefined);

const PRESETS = process.argv.includes("--presets");
const jobs = [];
if (PRESETS) {
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
  const out = await lab.page.evaluate((r) => window.probe.render(r), {
    surfaces: [{ shape: SHAPES[job.shape], material }],
    debugView: job.debugView,
  });
  const img = image(out);
  const name = `${job.preset ? `${job.preset}-` : ""}${job.scene}-${job.shape}${job.debugView ? `-debug${job.debugView}` : ""}.png`;
  writeFileSync(new URL(name, OUT), png(img.width, img.height, Buffer.from(out.rgba, "base64")));
  console.log(name);
}
if (lab.errors.length) console.error(lab.errors);
await lab.close();
