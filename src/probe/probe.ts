import { acquireGpu } from "../gpu/device.ts";
import { cloneMaterial, DEFAULT_MATERIAL, PRESETS, type GlassMaterial, type PresetId } from "../glass/material.ts";
import type { TouchLight } from "../glass/glow.ts";
import { buildRadialTable, deviceGeometry, tableLookup } from "../glass/optics.ts";
import type { Shape } from "../glass/shape.ts";
import { unionField } from "../glass/union.ts";
import type { QualityTier } from "../renderer/quality.ts";
import { SYMBOLS } from "../lab/icons.ts";
import { LiquidGlassRenderer, type GlassContent, type GlassGroup, type GlassSurface } from "../renderer/renderer.ts";
import { HtmlInCanvasSource, htmlInCanvasAvailable, htmlInCanvasSupport } from "../sources/html-in-canvas.ts";
import { NativeSource, type ScenePainter } from "../sources/native.ts";
import { PAINTERS, paintCoordinates, paintSolid, type SceneId } from "../sources/scenes.ts";

/**
 * Test harness driven by Playwright (tests/*.test.mjs). Everything renders at dpr 1 into a canvas
 * of the requested CSS size, and pixels come back through GPU readback, not a screenshot.
 */
const canvas = document.querySelector<HTMLCanvasElement>("#probe")!;
let renderer: LiquidGlassRenderer | null = null;
let source: NativeSource | HtmlInCanvasSource | null = null;
let symbolsReady: Promise<void> = Promise.resolve();

interface SurfaceRequest {
  shape: Shape;
  material?: Partial<GlassMaterial>;
  appearance?: number;
  /** A symbol from the lab's set (src/lab/icons.ts SYMBOLS). */
  content?: GlassContent;
}

interface RenderRequest {
  /** Each on its own (nothing merges). */
  surfaces?: SurfaceRequest[];
  /** Merge groups; drawn after `surfaces`. Layer 1 floats over layer 0 and refracts it. */
  groups?: { spacing: number; surfaces: SurfaceRequest[]; layer?: 0 | 1 }[];
  debugView?: number;
  guard?: boolean;
  quality?: QualityTier;
  /** Lights from touches, CSS px (= device px here). */
  touches?: TouchLight[];
}

type ProbeScene = SceneId | "coordinates" | "solid-light" | "solid-dark" | "split" | "html";

async function init(width: number, height: number, scene: ProbeScene): Promise<{ adapter: string; fallback: boolean; path?: string }> {
  renderer?.destroy();
  const gpu = await acquireGpu();
  renderer = new LiquidGlassRenderer(canvas, gpu, { readback: true, offscreen: { width, height } });
  symbolsReady = renderer.setSymbols(SYMBOLS);
  if (scene === "html") {
    // A known page: white, a red square at (40, 40) of 60 px, a line of black text.
    const support = htmlInCanvasSupport(gpu.device);
    if (!htmlInCanvasAvailable(support)) throw new Error("HTML-in-Canvas indisponível");
    const page = document.createElement("div");
    page.style.cssText = `width:${width}px;height:${height}px;background:#fff;position:relative;font:16px sans-serif;color:#000`;
    page.innerHTML = '<div style="position:absolute;left:40px;top:40px;width:60px;height:60px;background:#f00"></div><p style="position:absolute;left:140px;top:30px;margin:0">texto do DOM</p>';
    const html = new HtmlInCanvasSource("html", document.body, page, support, () => 1);
    html.host.style.cssText = `position:absolute;left:0;top:0;width:${width}px;height:${height}px`;
    source = html;
    renderer.setSource(html);
    const error = await renderer.init();
    if (error) throw new Error(error);
    return { adapter: `${gpu.info.vendor} ${gpu.info.architecture}`, fallback: gpu.info.isFallback };
  }
  // Offscreen targets are always dpr 1; the tier only selects shader features here.
  renderer.quality = "high";
  const painter =
    scene === "coordinates"
      ? paintCoordinates
      : scene === "solid-light"
        ? paintSolid("#e9e9e6")
        : scene === "solid-dark"
          ? paintSolid("#1d1e22")
          : scene === "split"
            ? paintSplit
            : PAINTERS[scene];
  source = new NativeSource(scene, painter, () => renderer?.devicePixelRatio ?? 1);
  renderer.setSource(source);
  const error = await renderer.init();
  if (error) throw new Error(error);
  return { adapter: `${gpu.info.vendor} ${gpu.info.architecture}`, fallback: gpu.info.isFallback };
}

async function render(req: RenderRequest): Promise<{ width: number; height: number; rgba: string }> {
  if (!renderer) throw new Error("probe.init primeiro");
  const surface = (s: SurfaceRequest): GlassSurface => ({
    shape: s.shape,
    material: { ...cloneMaterial(DEFAULT_MATERIAL), ...s.material },
    ...(s.appearance !== undefined ? { appearance: s.appearance } : {}),
    ...(s.content ? { content: s.content } : {}),
  });
  const groups: GlassGroup[] = [
    ...(req.surfaces ?? []).map((s) => ({ spacing: 0, surfaces: [surface(s)] })),
    ...(req.groups ?? []).map((g) => ({ spacing: g.spacing, surfaces: g.surfaces.map(surface), ...(g.layer ? { layer: g.layer } : {}) })),
  ];
  if (groups.some((g) => g.surfaces.some((s) => s.content))) await symbolsReady;
  renderer.debugView = req.debugView ?? 0;
  renderer.guardEnabled = req.guard ?? true;
  renderer.quality = req.quality ?? "high";
  renderer.touchLights = req.touches ?? [];
  renderer.setGroups(groups);
  const pixels = await renderer.capture();
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < pixels.data.length; i += chunk) {
    binary += String.fromCharCode(...pixels.data.subarray(i, i + chunk));
  }
  return { width: pixels.width, height: pixels.height, rgba: btoa(binary) };
}

function guard(shape: Shape, material: Partial<GlassMaterial>, enabled = true) {
  return buildRadialTable({ ...DEFAULT_MATERIAL, ...material }, shape, 1, enabled).stats;
}

/** CPU prediction (the same table the GPU reads) at inward depth `s`, device px, dpr 1. */
function predictOffset(shape: Shape, material: Partial<GlassMaterial>, s: number, enabled = true): { offset: number; transmission: number } {
  const m = { ...DEFAULT_MATERIAL, ...material };
  const { bevel } = deviceGeometry(m, shape, 1);
  const table = buildRadialTable(m, shape, 1, enabled).data;
  const v = tableLookup(table, bevel, s);
  return { offset: v[0]!, transmission: v[1]! };
}

/**
 * CPU prediction of where the green sample of pixel (x, y) comes from inside a merge group, from
 * the TS mirror of the union and the same radial tables the GPU reads. dpr 1.
 */
function predictUnion(group: { spacing: number; surfaces: SurfaceRequest[] }, x: number, y: number) {
  const members = group.surfaces.map((s) => ({ shape: s.shape, material: { ...DEFAULT_MATERIAL, ...s.material } }));
  const px = x + 0.5;
  const py = y + 0.5;
  const u = unionField(
    members.map((m) => m.shape),
    group.surfaces.length > 1 ? group.spacing / 2 : 0,
    px,
    py,
  );
  const depth = Math.max(-u.d, 0);
  let offset = 0;
  let transmission = 0;
  for (const { index, weight } of u.blend) {
    const { shape, material } = members[index]!;
    const { bevel } = deviceGeometry(material, shape, 1);
    const v = tableLookup(buildRadialTable(material, shape, 1).data, bevel, depth);
    offset += weight * v[0]!;
    transmission += weight * v[1]!;
  }
  return { d: u.d, gradLength: Math.hypot(u.gx, u.gy), x: px + offset * u.gx, y: py + offset * u.gy, transmission, blend: u.blend };
}

/** Left half black, right half white: a backdrop with known extremes. */
const paintSplit: ScenePainter = (ctx, w, h) => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w / 2, h);
  ctx.fillStyle = "#fff";
  ctx.fillRect(w / 2, 0, w - w / 2, h);
};

/** Which path the HTML-in-Canvas source took on its last draw, and why none did. */
function htmlPath(): string {
  return source instanceof HtmlInCanvasSource ? source.path : "";
}

function htmlFailure(): string | null {
  return source instanceof HtmlInCanvasSource ? source.failure : null;
}

/** How many times the composite under layer 1 has been drawn (it should be reused when only layer 1 moves). */
function lowerRenders(): number {
  return renderer?.lowerRenders ?? 0;
}

/** Backdrop statistics of the surfaces of the last render: [mean L*, p10, p90, coverage] each. */
async function backdrop(): Promise<number[][]> {
  if (!renderer) throw new Error("probe.init primeiro");
  const stats = await renderer.readBackdrop();
  return Array.from({ length: stats.length / 4 }, (_, i) => Array.from(stats.subarray(i * 4, i * 4 + 4)));
}

declare global {
  interface Window {
    probe?: {
      init: typeof init;
      render: typeof render;
      guard: typeof guard;
      predictOffset: typeof predictOffset;
      preset: typeof preset;
      predictUnion: typeof predictUnion;
      backdrop: typeof backdrop;
      htmlPath: typeof htmlPath;
      htmlFailure: typeof htmlFailure;
      lowerRenders: typeof lowerRenders;
    };
  }
}

function preset(id: PresetId): GlassMaterial {
  return cloneMaterial(PRESETS[id].material);
}

window.probe = { init, render, guard, predictOffset, preset, predictUnion, backdrop, htmlPath, htmlFailure, lowerRenders };
