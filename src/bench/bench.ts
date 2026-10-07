import { acquireGpu, type GpuContext } from "../gpu/device.ts";
import { DEFAULT_MATERIAL } from "../glass/material.ts";
import type { Shape } from "../glass/shape.ts";
import type { QualityTier } from "../renderer/quality.ts";
import { SYMBOLS } from "../lab/icons.ts";
import type { TouchLight } from "../glass/glow.ts";
import { LiquidGlassRenderer, type GlassGroup, type GlassSurface } from "../renderer/renderer.ts";
import { WINDOW } from "../renderer/timer.ts";
import { NativeSource } from "../sources/native.ts";
import { PAINTERS, type SceneId } from "../sources/scenes.ts";

interface Scenario {
  scene: SceneId;
  surfaces: number;
  tier: QualityTier;
  /** Rebuild the pyramid every frame, as a live background would. */
  dynamic: boolean;
  /** Move every surface every frame (physics + upload on the CPU). */
  motion?: boolean;
  /** Members per merge group, neighbours touching; 1 or absent = no merging. */
  group?: number;
  /**
   * "toolbars": 18 bars of 4 buttons with 10 px gaps, `surfaces` ignored — a realistic merge
   * (spacing 24 when group > 1). Default: the stress grid, where every neighbour merges.
   */
  layout?: "toolbars";
  /**
   * Glass over glass: the merged toolbars, each button with its symbol, on layer 0 and a popover
   * (520×340) over them on layer 1. "upper": the popover moves (the composite below is reused);
   * "lower": every toolbar button moves under it (composite and its pyramid redone every frame).
   */
  layers?: "upper" | "lower";
  /** V5, on the merged toolbars: a symbol on every button (content pass). */
  content?: boolean;
  /** V5: that many touch lights lit over the toolbars, spread (the glow term on every glass pixel). */
  touches?: number;
}

interface Stats {
  mean: number;
  median: number;
  p95: number;
}

interface Result extends Scenario {
  resolution: string;
  dpr: number;
  coverage: number;
  /** Frames drawn during the measurement (all of them: the windows are widened for the bench). */
  frames: number;
  /** Frames whose GPU time came back (the readback ring skips a frame when it is full). */
  timedFrames: number;
  refreshHz: number;
  cpuMs: Stats;
  /** Every pass of a frame summed, per frame. */
  gpuTotalMs: Stats;
  gpuMs: Record<string, Stats>;
  /** The glass pass per covered device pixel, ns: the cost normalised by what is on screen. */
  glassNsPerPx: number | null;
  memoryMB: number;
  /** GPU times rounded to 0.1 ms (Chrome without the developer flag): only the means are usable. */
  quantized: boolean;
  /** False when the tab was hidden or lost focus while measuring (repeated once). */
  valid: boolean;
}

/** Static, live background, moving, and merge groups of 2 and 4, at one tier. */
function tierScenarios(tier: QualityTier): Scenario[] {
  const scene = "image" as const;
  return [
    ...[1, 10, 20, 50, 100].map((n) => ({ scene, surfaces: n, tier, dynamic: false })),
    ...[1, 10, 50, 100].map((n) => ({ scene, surfaces: n, tier, dynamic: true })),
    ...[10, 50].map((n) => ({ scene, surfaces: n, tier, dynamic: false, motion: true })),
    ...[2, 4].flatMap((group) => [20, 100].map((n) => ({ scene, surfaces: n, tier, dynamic: false, group }))),
    ...[1, 4].map((group) => ({ scene, surfaces: 72, tier, dynamic: false, group, layout: "toolbars" as const })),
    ...(["upper", "lower"] as const).map((layers) => ({ scene, surfaces: 73, tier, dynamic: false, motion: true, layers })),
    ...v5Scenarios(tier),
  ];
}

/** V5 over the merged toolbars: symbols alone, then symbols and four touch lights. */
function v5Scenarios(tier: QualityTier): Scenario[] {
  const base = { scene: "image" as const, surfaces: 72, tier, dynamic: false, group: 4, layout: "toolbars" as const };
  return [
    { ...base, content: true },
    { ...base, content: true, touches: 4 },
  ];
}

const SUITES: Record<string, { label: string; hidden?: boolean; scenarios: () => Scenario[] }> = {
  quick: {
    label: "Rápido (~1 min)",
    scenarios: () => [
      ...(["high", "low"] as const).flatMap((tier) =>
        [1, 10, 20, 50, 100].map((n) => ({ scene: "image" as const, surfaces: n, tier, dynamic: false })),
      ),
      ...[1, 10, 50, 100].map((n) => ({ scene: "image" as const, surfaces: n, tier: "high" as const, dynamic: true })),
      ...[10, 50].map((n) => ({ scene: "image" as const, surfaces: n, tier: "high" as const, dynamic: false, motion: true })),
      ...[20, 100].map((n) => ({ scene: "image" as const, surfaces: n, tier: "high" as const, dynamic: false, group: 4 })),
      ...[1, 4].map((group) => ({ scene: "image" as const, surfaces: 72, tier: "high" as const, dynamic: false, group, layout: "toolbars" as const })),
      ...(["upper", "lower"] as const).map((layers) => ({ scene: "image" as const, surfaces: 73, tier: "high" as const, dynamic: false, motion: true, layers })),
      ...v5Scenarios("high"),
    ],
  },
  // The scene does not change the cost (four scenes within 0.2% on the RX 6600, v3.1 JSON), so the
  // full suite spends its time on tiers, motion and merge groups instead.
  /** Three scenarios, offscreen: the test that the bench itself works (tests/bench.test.mjs). */
  smoke: {
    label: "Fumaça",
    hidden: true,
    scenarios: () => [
      { scene: "image" as const, surfaces: 10, tier: "high" as const, dynamic: false },
      { scene: "image" as const, surfaces: 73, tier: "high" as const, dynamic: false, motion: true, layers: "lower" as const },
      ...v5Scenarios("high").slice(1),
    ],
  },
  full: {
    label: "Completo (~3 min)",
    scenarios: () => (["ultra", "high", "medium", "low"] as const).flatMap(tierScenarios),
  },
};

/**
 * ?suite=<id> picks a suite, ?run starts at once, ?offscreen renders off the canvas — the way the
 * tests run here, where a canvas swapchain loses the GPU (the timings are then meaningless) —
 * and ?measure=<ms> changes how long each scenario is measured.
 */
const params = new URLSearchParams(location.search);
const WARMUP_MS = 800;
const MEASURE_MS = Number(params.get("measure")) || 2000;
/** Samples kept per series while measuring: every frame of MEASURE_MS, even at 500 Hz. */
const CAPACITY = 4096;

const canvas = document.querySelector<HTMLCanvasElement>("#stage")!;
const status = document.querySelector<HTMLElement>("#status")!;
const table = document.querySelector<HTMLTableElement>("#table")!;
const json = document.querySelector<HTMLTextAreaElement>("#json")!;
const warning = document.querySelector<HTMLElement>("#warning")!;
let suite = params.get("suite") ?? "quick";

/** N capsules on a grid inside the stage; all the same size so cost scales with N. */
function layout(n: number, width: number, height: number): { surfaces: GlassSurface[]; gap: number; cols: number } {
  const cols = Math.ceil(Math.sqrt(n * (width / height)));
  const rows = Math.ceil(n / cols);
  const cellW = width / cols;
  const cellH = height / rows;
  const halfWidth = Math.min(90, cellW * 0.42);
  const halfHeight = Math.min(32, cellH * 0.4);
  const surfaces = Array.from({ length: n }, (_, i) => {
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
  return { surfaces, gap: cellW - 2 * halfWidth, cols };
}

/** 6 rows × 3 bars of 4 capsules (110×44, 10 px apart), scaled to the stage. Each bar is a group. */
function toolbars(width: number, height: number, merge: boolean): { surfaces: GlassSurface[]; groups: GlassGroup[] } {
  const k = Math.min(width / 1500, height / 945);
  const groups: GlassGroup[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 3; col++) {
      const x0 = (40 + col * 490) * k;
      const y = (80 + row * 150) * k;
      const members = Array.from({ length: 4 }, (_, i) => {
        const shape: Shape = { cx: x0 + (55 + i * 120) * k, cy: y, halfWidth: 55 * k, halfHeight: 22 * k, radius: 22 * k, exponent: 2, rotation: 0 };
        return { shape, material: { ...DEFAULT_MATERIAL, bevel: Math.min(DEFAULT_MATERIAL.bevel, 22 * k) } };
      });
      if (merge) groups.push({ spacing: 24, surfaces: members });
      else for (const m of members) groups.push({ spacing: 0, surfaces: [m] });
    }
  }
  return { surfaces: groups.flatMap((g) => g.surfaces), groups };
}

/** The merged toolbars with a symbol on every button (layer 0) and a popover over them (layer 1). */
function popover(width: number, height: number): { lower: GlassSurface[]; upper: GlassSurface; groups: GlassGroup[] } {
  const bars = toolbars(width, height, true);
  bars.surfaces.forEach((surface, i) => {
    surface.content = { symbol: i % SYMBOLS.length, size: 22, color: [0.1, 0.1, 0.12, 0.9] };
  });
  const k = Math.min(width / 1500, height / 945);
  const shape: Shape = { cx: width / 2, cy: height / 2, halfWidth: 260 * k, halfHeight: 170 * k, radius: 28 * k, exponent: 2, rotation: 0 };
  const upper: GlassSurface = { shape, material: { ...DEFAULT_MATERIAL, bevel: Math.min(DEFAULT_MATERIAL.bevel, 28 * k) } };
  return { lower: bars.surfaces, upper, groups: [...bars.groups, { spacing: 0, surfaces: [upper], layer: 1 }] };
}

/**
 * Row neighbours in groups of `size`, like toolbars; a group never wraps to the next row. The
 * spacing makes neighbours merge.
 */
function grouped(surfaces: GlassSurface[], size: number, gap: number, cols: number): GlassGroup[] {
  const groups: GlassGroup[] = [];
  for (let row = 0; row < surfaces.length; row += cols) {
    const line = surfaces.slice(row, row + cols);
    for (let i = 0; i < line.length; i += size) groups.push({ spacing: size > 1 ? gap + 8 : 0, surfaces: line.slice(i, i + size) });
  }
  return groups;
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
  let surfaces: GlassSurface[];
  let moving: GlassSurface[] | null = null;
  if (s.layers) {
    const scene = popover(canvas.clientWidth, canvas.clientHeight);
    surfaces = [...scene.lower, scene.upper];
    moving = s.layers === "upper" ? [scene.upper] : scene.lower;
    renderer.setGroups(scene.groups);
  } else if (s.layout === "toolbars") {
    const bars = toolbars(canvas.clientWidth, canvas.clientHeight, (s.group ?? 1) > 1);
    surfaces = bars.surfaces;
    if (s.content) {
      surfaces.forEach((surface, i) => {
        surface.content = { symbol: i % SYMBOLS.length, size: 22, color: [0.1, 0.1, 0.12, 0.9] };
      });
    }
    renderer.setGroups(bars.groups);
  } else {
    const grid = layout(s.surfaces, canvas.clientWidth, canvas.clientHeight);
    surfaces = grid.surfaces;
    renderer.setGroups(grouped(surfaces, s.group ?? 1, grid.gap, grid.cols));
  }
  renderer.forcePyramid = s.dynamic;
  renderer.touchLights = touchLights(s.touches ?? 0, canvas.clientWidth, canvas.clientHeight);
  renderer.continuous = true;
  // Motion: every surface orbits its cell a little each frame, so the CPU re-packs and uploads
  // every record (the radial tables stay cached: moving does not change the optics).
  const movers = moving ?? surfaces;
  const home = movers.map((x) => [x.shape.cx, x.shape.cy] as const);
  renderer.onFrame = s.motion
    ? () => {
        const t = performance.now() / 1000;
        movers.forEach((x, i) => {
          x.shape.cx = home[i]![0] + Math.cos(t * 2 + i) * 6;
          x.shape.cy = home[i]![1] + Math.sin(t * 2 + i) * 6;
        });
        renderer.surfacesChanged();
      }
    : null;
  renderer.requestFrame();
  await wait(WARMUP_MS);
  const series = [renderer.cpu, renderer.interval];
  for (const x of series) {
    x.capacity = CAPACITY;
    x.clear();
  }
  if (renderer.timer) {
    renderer.timer.capacity = CAPACITY;
    renderer.timer.reset();
  }
  // A hidden tab or a window in the background throttles the loop: that run measures nothing.
  let interrupted = false;
  const interrupt = () => (interrupted = true);
  document.addEventListener("visibilitychange", interrupt);
  window.addEventListener("blur", interrupt);
  await wait(MEASURE_MS);
  document.removeEventListener("visibilitychange", interrupt);
  window.removeEventListener("blur", interrupt);
  if (document.hidden || !document.hasFocus()) interrupted = true;
  renderer.continuous = false;
  renderer.forcePyramid = false;
  renderer.touchLights = [];
  renderer.onFrame = null;
  // Let the last readbacks land before reading the series.
  await wait(50);

  const gpuMs: Result["gpuMs"] = {};
  const all: number[] = [];
  for (const [name, x] of renderer.timer?.series ?? []) {
    const values = x.samples();
    if (values.length === 0) continue;
    gpuMs[name] = stats(values);
    all.push(...values);
  }
  const totals = renderer.timer?.frameTotal.samples() ?? [];
  const intervals = renderer.interval.samples();
  const cpu = renderer.cpu.samples();
  // Back to the panel's window only after every series was read: shrinking it drops samples.
  for (const x of series) x.capacity = WINDOW;
  if (renderer.timer) renderer.timer.capacity = WINDOW;
  const { width, height } = renderer.resolution;
  const cover = coverage(surfaces, canvas.clientWidth, canvas.clientHeight);
  const glass = gpuMs["vidro"];
  return {
    ...s,
    resolution: `${width}×${height}`,
    dpr: renderer.devicePixelRatio,
    coverage: cover,
    frames: cpu.length,
    timedFrames: totals.length,
    refreshHz: intervals.length ? 1000 / stats(intervals).median : 0,
    cpuMs: stats(cpu),
    gpuTotalMs: stats(totals),
    gpuMs,
    glassNsPerPx: glass && cover > 0 ? (glass.median * 1e6) / (cover * width * height) : null,
    memoryMB: renderer.gpuBytes / 1048576,
    quantized: isQuantized(all),
    valid: !interrupted,
  };
}

function stats(values: number[]): Stats {
  if (values.length === 0) return { mean: 0, median: 0, p95: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const at = (p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))]!;
  return { mean: values.reduce((a, b) => a + b, 0) / values.length, median: at(0.5), p95: at(0.95) };
}

/** Chrome rounds timestamps to 100 µs unless the developer flag is on. */
function isQuantized(values: number[]): boolean {
  if (values.length < 20) return false;
  const onGrid = values.filter((v) => Math.abs(v * 10 - Math.round(v * 10)) < 1e-6).length;
  return onGrid / values.length > 0.95;
}

/**
 * `n` (≤ 4) lights on the centres of four toolbars (rows 2 and 5, first and last column), spread as
 * a second into a touch: a radius that covers the bar and reaches the rows around it.
 */
function touchLights(n: number, width: number, height: number): TouchLight[] {
  const k = Math.min(width / 1500, height / 945);
  const spots = [
    [275, 230],
    [1255, 230],
    [275, 680],
    [1255, 680],
  ] as const;
  return spots.slice(0, n).map(([x, y]) => ({ x: x * k, y: y * k, radius: 260 * k, intensity: 0.2 }));
}

/** What a scenario is, in words. */
function kind(r: Scenario): string {
  if (r.layers) return `camadas: ${r.layers === "upper" ? "a de cima" : "a de baixo"} move`;
  if (r.touches) return `barras + símbolos + ${r.touches} toques`;
  if (r.content) return "barras + símbolos";
  if (r.layout === "toolbars") return r.group && r.group > 1 ? "barras fundidas" : "barras soltas";
  if (r.motion) return "mover";
  if (r.group && r.group > 1) return `fusão ×${r.group}`;
  return r.dynamic ? "vivo" : "fixo";
}

const ms = (v: number) => v.toFixed(3);

function render(results: Result[], gpu: GpuContext): void {
  const passes = [...new Set(results.flatMap((r) => Object.keys(r.gpuMs)))];
  // What decides comes first (the panel is narrow and scrolls sideways): totals, then the detail.
  const head = ["caso", "GPU total", "p95", "do quadro", "CPU", "N", "nível", "cobert.", ...passes, "ns/px", "MB"];
  table.innerHTML =
    `<tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>` +
    results
      .map((r) => {
        const frame = r.refreshHz > 0 ? (r.gpuTotalMs.p95 * r.refreshHz) / 10 : 0;
        const cells = [
          kind(r),
          // No frame timed (no timestamp-query, or every readback still in flight): say so, not 0.
          r.timedFrames ? ms(r.gpuTotalMs.median) : "—",
          r.timedFrames ? ms(r.gpuTotalMs.p95) : "—",
          r.timedFrames ? `${frame.toFixed(1)}%` : "—",
          ms(r.cpuMs.median),
          String(r.surfaces),
          r.tier,
          `${(r.coverage * 100).toFixed(0)}%`,
          ...passes.map((p) => (r.gpuMs[p] ? ms(r.gpuMs[p].median) : "—")),
          r.glassNsPerPx === null ? "—" : r.glassNsPerPx.toFixed(2),
          r.memoryMB.toFixed(1),
        ];
        return `<tr${r.valid ? "" : ' class="invalid" title="a aba saiu de foco durante a medida"'}>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
      })
      .join("");
  const quantized = results.some((r) => r.quantized);
  warning.hidden = !quantized;
  // Four decimals (0.1 µs) is below what any GPU timer resolves; it halves the JSON to paste.
  const round = (_: string, v: unknown) => (typeof v === "number" && !Number.isInteger(v) ? Math.round(v * 1e4) / 1e4 : v);
  json.value = JSON.stringify(
    {
      lab: "liquid-glass-lab V5",
      date: new Date().toISOString(),
      userAgent: navigator.userAgent,
      adapter: gpu.info,
      devicePixelRatio: window.devicePixelRatio,
      note:
        "Estatísticas sobre todos os quadros da medida (2 s). gpuTotalMs: soma dos passes de cada quadro. glassNsPerPx: passe do vidro por pixel coberto. " +
        (quantized ? "ATENÇÃO: tempos de GPU arredondados a 0,1 ms (flag de desenvolvedor desligado)." : "Tempos de GPU sem arredondamento."),
      results,
    },
    round,
    1,
  );
}

async function run(): Promise<void> {
  if (canvas.clientWidth < 320 || canvas.clientHeight < 240) {
    status.textContent = `A área de desenho tem ${canvas.clientWidth}×${canvas.clientHeight} px: maximize a janela e rode de novo.`;
    return;
  }
  const gpu = await acquireGpu();
  if (!gpu.info.timestamps) status.textContent = "Este adaptador não expõe timestamp-query: só fps e CPU.";
  const renderer = new LiquidGlassRenderer(
    canvas,
    gpu,
    params.has("offscreen") ? { offscreen: { width: canvas.clientWidth, height: canvas.clientHeight } } : {},
  );
  const source = new NativeSource("bench", PAINTERS.image, () => renderer.devicePixelRatio);
  renderer.setSource(source);
  await renderer.setSymbols(SYMBOLS);
  const error = await renderer.init();
  if (error) {
    status.textContent = error;
    return;
  }
  const scenarios = SUITES[suite]!.scenarios();
  const results: Result[] = [];
  const each = (WARMUP_MS + MEASURE_MS + 50) / 1000;
  let repeated = 0;
  for (const [i, s] of scenarios.entries()) {
    const left = Math.ceil((scenarios.length - i) * each);
    status.textContent = `${i + 1}/${scenarios.length}: ${kind(s)}, ${s.surfaces} vidros, ${s.tier} · faltam ~${left} s. Não troque de janela.`;
    let result = await measure(renderer, source, s);
    if (!result.valid) {
      // Measured while hidden or in the background: once more, in front.
      repeated++;
      result = await measure(renderer, source, s);
    }
    results.push(result);
    render(results, gpu);
  }
  const invalid = results.filter((r) => !r.valid).length;
  done = true;
  status.textContent =
    `Concluído: ${results.length} cenários` +
    (repeated ? `, ${repeated} repetido${repeated > 1 ? "s" : ""} por perda de foco` : "") +
    (invalid ? `; ${invalid} ainda inválido${invalid > 1 ? "s" : ""} (em vermelho): rode de novo sem trocar de janela.` : ".");
  renderer.destroy();
}

const suiteBar = document.querySelector<HTMLElement>("#suite")!;
for (const [id, { label, hidden }] of Object.entries(SUITES)) {
  if (hidden) continue;
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
let done = false;
const start = () => void run().catch((e: unknown) => (status.textContent = String(e)));
document.querySelector("#run")!.addEventListener("click", start);
if (params.has("run")) start();

declare global {
  interface Window {
    /** For tests/bench.test.mjs: whether the run finished, and its JSON. */
    bench?: { done: () => boolean; json: () => string };
  }
}
window.bench = { done: () => done, json: () => json.value };
document.querySelector("#copy")!.addEventListener("click", () => {
  void navigator.clipboard.writeText(json.value);
});
