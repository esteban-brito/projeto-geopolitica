import { acquireGpu, type GpuContext } from "../gpu/device.ts";
import { DEFAULT_MATERIAL } from "../glass/material.ts";
import type { Shape } from "../glass/shape.ts";
import type { QualityTier } from "../renderer/quality.ts";
import { LiquidGlassRenderer, type GlassSurface } from "../renderer/renderer.ts";
import { NativeSource } from "../sources/native.ts";
import { PAINTERS, type SceneId } from "../sources/scenes.ts";

interface Scenario {
  scene: SceneId;
  surfaces: number;
  tier: QualityTier;
}

interface Result extends Scenario {
  resolution: string;
  dpr: number;
  coverage: number;
  frames: number;
  fps: number;
  cpuMs: number;
  gpuMs: Record<string, { mean: number; p95: number }>;
}

const SUITES: Record<string, { label: string; scenarios: () => Scenario[] }> = {
  quick: {
    label: "Rápido (~30 s)",
    scenarios: () =>
      (["high", "low"] as const).flatMap((tier) => [1, 10, 20, 50, 100].map((n) => ({ scene: "image" as const, surfaces: n, tier }))),
  },
  full: {
    label: "Completo (~4 min)",
    scenarios: () =>
      (["ultra", "high", "medium", "low"] as const).flatMap((tier) =>
        (["image", "text", "grid", "color"] as const).flatMap((scene) => [1, 10, 20, 50, 100].map((n) => ({ scene, surfaces: n, tier }))),
      ),
  },
};

const WARMUP_MS = 800;
const MEASURE_MS = 2000;

const canvas = document.querySelector<HTMLCanvasElement>("#stage")!;
const status = document.querySelector<HTMLElement>("#status")!;
const table = document.querySelector<HTMLTableElement>("#table")!;
const json = document.querySelector<HTMLTextAreaElement>("#json")!;
let suite = "quick";

/** N capsules on a grid inside the stage; all the same size so cost scales with N. */
function layout(n: number, width: number, height: number): GlassSurface[] {
  const cols = Math.ceil(Math.sqrt(n * (width / height)));
  const rows = Math.ceil(n / cols);
  const cellW = width / cols;
  const cellH = height / rows;
  const halfWidth = Math.min(90, cellW * 0.42);
  const halfHeight = Math.min(32, cellH * 0.4);
  return Array.from({ length: n }, (_, i) => {
    const shape: Shape = {
      cx: (i % cols) * cellW + cellW / 2,
      cy: Math.floor(i / cols) * cellH + cellH / 2,
      halfWidth,
      halfHeight,
      radius: halfHeight,
      exponent: 2,
      rotation: 0,
    };
    return { shape, material: { ...DEFAULT_MATERIAL, bevel: Math.min(DEFAULT_MATERIAL.bevel, halfHeight) } };
  });
}

function coverage(surfaces: GlassSurface[], width: number, height: number): number {
  let area = 0;
  for (const { shape } of surfaces) {
    const r = Math.min(shape.radius, shape.halfWidth, shape.halfHeight);
    area += 4 * shape.halfWidth * shape.halfHeight - (4 - Math.PI) * r * r;
  }
  return area / (width * height);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function measure(renderer: LiquidGlassRenderer, source: NativeSource, s: Scenario): Promise<Result> {
  renderer.setQuality(s.tier);
  source.setPainter(PAINTERS[s.scene]);
  renderer.invalidateSource();
  const surfaces = layout(s.surfaces, canvas.clientWidth, canvas.clientHeight);
  renderer.setSurfaces(surfaces);
  renderer.continuous = true;
  renderer.requestFrame();
  await wait(WARMUP_MS);
  renderer.cpu.clear();
  renderer.interval.clear();
  renderer.timer?.reset();
  await wait(MEASURE_MS);
  renderer.continuous = false;
  const gpuMs: Result["gpuMs"] = {};
  for (const [name, series] of renderer.timer?.series ?? []) gpuMs[name] = { mean: series.mean, p95: series.percentile(0.95) };
  const { width, height } = renderer.resolution;
  return {
    ...s,
    resolution: `${width}×${height}`,
    dpr: renderer.devicePixelRatio,
    coverage: coverage(surfaces, canvas.clientWidth, canvas.clientHeight),
    frames: renderer.interval.count,
    fps: renderer.interval.count ? 1000 / renderer.interval.mean : 0,
    cpuMs: renderer.cpu.mean,
    gpuMs,
  };
}

function render(results: Result[], gpu: GpuContext): void {
  const passes = [...new Set(results.flatMap((r) => Object.keys(r.gpuMs)))];
  const head = ["cena", "N", "nível", "cobert.", "fps", "CPU", ...passes.map((p) => `GPU ${p}`)];
  table.innerHTML =
    `<tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>` +
    results
      .map(
        (r) =>
          `<tr><td>${r.scene}</td><td>${r.surfaces}</td><td>${r.tier}</td><td>${(r.coverage * 100).toFixed(0)}%</td><td>${r.fps.toFixed(0)}</td><td>${r.cpuMs.toFixed(2)}</td>${passes
            .map((p) => `<td>${r.gpuMs[p]?.mean.toFixed(3) ?? "—"}</td>`)
            .join("")}</tr>`,
      )
      .join("");
  json.value = JSON.stringify(
    {
      lab: "liquid-glass-lab V0",
      date: new Date().toISOString(),
      userAgent: navigator.userAgent,
      adapter: gpu.info,
      devicePixelRatio: window.devicePixelRatio,
      note: "GPU ms são médias de janela; sem o flag de desenvolvedor do Chrome, cada medida é arredondada a 0,1 ms.",
      results,
    },
    null,
    2,
  );
}

async function run(): Promise<void> {
  const gpu = await acquireGpu();
  if (!gpu.info.timestamps) status.textContent = "Este adaptador não expõe timestamp-query: só fps e CPU.";
  const renderer = new LiquidGlassRenderer(canvas, gpu);
  const source = new NativeSource("bench", PAINTERS.image, () => renderer.devicePixelRatio);
  renderer.setSource(source);
  const error = await renderer.init();
  if (error) {
    status.textContent = error;
    return;
  }
  const scenarios = SUITES[suite]!.scenarios();
  const results: Result[] = [];
  for (const [i, s] of scenarios.entries()) {
    status.textContent = `${i + 1}/${scenarios.length}: ${s.scene}, ${s.surfaces} superfícies, ${s.tier}`;
    results.push(await measure(renderer, source, s));
    render(results, gpu);
  }
  status.textContent = `Concluído: ${results.length} cenários.`;
  renderer.destroy();
}

const suiteBar = document.querySelector<HTMLElement>("#suite")!;
for (const [id, { label }] of Object.entries(SUITES)) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  b.setAttribute("aria-pressed", String(id === suite));
  b.addEventListener("click", () => {
    suite = id;
    for (const other of suiteBar.querySelectorAll("button")) other.setAttribute("aria-pressed", String(other === b));
  });
  suiteBar.append(b);
}
document.querySelector("#run")!.addEventListener("click", () => {
  void run().catch((e: unknown) => (status.textContent = String(e)));
});
document.querySelector("#copy")!.addEventListener("click", () => {
  void navigator.clipboard.writeText(json.value);
});
