import { acquireGpu, type GpuContext } from "../gpu/device.ts";
import { DEFAULT_MATERIAL } from "../glass/material.ts";
import type { Shape } from "../glass/shape.ts";
import type { QualityTier } from "../renderer/quality.ts";
import { SYMBOLS } from "../lab/icons.ts";
import { LiquidGlassRenderer, type GlassGroup, type GlassSurface } from "../renderer/renderer.ts";
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
}

interface Result extends Scenario {
  resolution: string;
  dpr: number;
  coverage: number;
  /** Frame intervals in the averaging window (capped at 120), not a frame count. */
  samples: number;
  fps: number;
  cpuMs: number;
  gpuMs: Record<string, { mean: number; p95: number }>;
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
  ];
}

const SUITES: Record<string, { label: string; scenarios: () => Scenario[] }> = {
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
    ],
  },
  // The scene does not change the cost (four scenes within 0.2% on the RX 6600, v3.1 JSON), so the
  // full suite spends its time on tiers, motion and merge groups instead.
  full: {
    label: "Completo (~3 min)",
    scenarios: () => (["ultra", "high", "medium", "low"] as const).flatMap(tierScenarios),
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
    renderer.setGroups(bars.groups);
  } else {
    const grid = layout(s.surfaces, canvas.clientWidth, canvas.clientHeight);
    surfaces = grid.surfaces;
    renderer.setGroups(grouped(surfaces, s.group ?? 1, grid.gap, grid.cols));
  }
  renderer.forcePyramid = s.dynamic;
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
  renderer.cpu.clear();
  renderer.interval.clear();
  renderer.timer?.reset();
  await wait(MEASURE_MS);
  renderer.continuous = false;
  renderer.forcePyramid = false;
  renderer.onFrame = null;
  const gpuMs: Result["gpuMs"] = {};
  for (const [name, series] of renderer.timer?.series ?? []) {
    if (series.count > 0) gpuMs[name] = { mean: series.mean, p95: series.percentile(0.95) };
  }
  const { width, height } = renderer.resolution;
  return {
    ...s,
    resolution: `${width}×${height}`,
    dpr: renderer.devicePixelRatio,
    coverage: coverage(surfaces, canvas.clientWidth, canvas.clientHeight),
    samples: renderer.interval.count,
    fps: renderer.interval.count ? 1000 / renderer.interval.mean : 0,
    cpuMs: renderer.cpu.mean,
    gpuMs,
  };
}

function render(results: Result[], gpu: GpuContext): void {
  const passes = [...new Set(results.flatMap((r) => Object.keys(r.gpuMs)))];
  const head = ["cena", "N", "nível", "caso", "cobert.", "fps", "CPU", ...passes.map((p) => `GPU ${p}`)];
  const kind = (r: Result) =>
    r.layers
      ? `camadas: ${r.layers === "upper" ? "a de cima" : "a de baixo"} move`
      : r.layout === "toolbars"
      ? r.group && r.group > 1
        ? "barras fundidas"
        : "barras soltas"
      : r.motion
        ? "mover"
        : r.group && r.group > 1
          ? `fusão ×${r.group}`
          : r.dynamic
            ? "vivo"
            : "fixo";
  table.innerHTML =
    `<tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>` +
    results
      .map(
        (r) =>
          `<tr><td>${r.scene}</td><td>${r.surfaces}</td><td>${r.tier}</td><td>${kind(r)}</td><td>${(r.coverage * 100).toFixed(0)}%</td><td>${r.fps.toFixed(0)}</td><td>${r.cpuMs.toFixed(2)}</td>${passes
            .map((p) => `<td>${r.gpuMs[p]?.mean.toFixed(3) ?? "—"}</td>`)
            .join("")}</tr>`,
      )
      .join("");
  json.value = JSON.stringify(
    {
      lab: "liquid-glass-lab V4.1",
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
  if (canvas.clientWidth < 320 || canvas.clientHeight < 240) {
    status.textContent = `A área de desenho tem ${canvas.clientWidth}×${canvas.clientHeight} px: maximize a janela e rode de novo.`;
    return;
  }
  const gpu = await acquireGpu();
  if (!gpu.info.timestamps) status.textContent = "Este adaptador não expõe timestamp-query: só fps e CPU.";
  const renderer = new LiquidGlassRenderer(canvas, gpu);
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
