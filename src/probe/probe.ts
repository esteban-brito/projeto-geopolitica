import { acquireGpu } from "../gpu/device.ts";
import { cloneMaterial, DEFAULT_MATERIAL, PRESETS, type GlassMaterial, type PresetId } from "../glass/material.ts";
import { buildRadialTable, deviceGeometry, tableLookup } from "../glass/optics.ts";
import type { Shape } from "../glass/shape.ts";
import { unionField } from "../glass/union.ts";
import type { QualityTier } from "../renderer/quality.ts";
import { LiquidGlassRenderer, type GlassGroup, type GlassSurface } from "../renderer/renderer.ts";
import { NativeSource } from "../sources/native.ts";
import { PAINTERS, paintCoordinates, paintSolid, type SceneId } from "../sources/scenes.ts";

/**
 * Test harness driven by Playwright (tests/*.test.mjs). Everything renders at dpr 1 into a canvas
 * of the requested CSS size, and pixels come back through GPU readback, not a screenshot.
 */
const canvas = document.querySelector<HTMLCanvasElement>("#probe")!;
let renderer: LiquidGlassRenderer | null = null;
let source: NativeSource | null = null;

interface SurfaceRequest {
  shape: Shape;
  material?: Partial<GlassMaterial>;
}

interface RenderRequest {
  /** Each on its own (nothing merges). */
  surfaces?: SurfaceRequest[];
  /** Merge groups; drawn after `surfaces`. */
  groups?: { spacing: number; surfaces: SurfaceRequest[] }[];
  debugView?: number;
  guard?: boolean;
  quality?: QualityTier;
}

type ProbeScene = SceneId | "coordinates" | "solid-light" | "solid-dark";

async function init(width: number, height: number, scene: ProbeScene): Promise<{ adapter: string; fallback: boolean }> {
  renderer?.destroy();
  const gpu = await acquireGpu();
  renderer = new LiquidGlassRenderer(canvas, gpu, { readback: true, offscreen: { width, height } });
  // Offscreen targets are always dpr 1; the tier only selects shader features here.
  renderer.quality = "high";
  const painter =
    scene === "coordinates"
      ? paintCoordinates
      : scene === "solid-light"
        ? paintSolid("#e9e9e6")
        : scene === "solid-dark"
          ? paintSolid("#1d1e22")
          : PAINTERS[scene];
  source = new NativeSource(scene, painter, () => renderer?.devicePixelRatio ?? 1);
  renderer.setSource(source);
  const error = await renderer.init();
  if (error) throw new Error(error);
  return { adapter: `${gpu.info.vendor} ${gpu.info.architecture}`, fallback: gpu.info.isFallback };
}

async function render(req: RenderRequest): Promise<{ width: number; height: number; rgba: string }> {
  if (!renderer) throw new Error("probe.init primeiro");
  const surface = (s: SurfaceRequest): GlassSurface => ({ shape: s.shape, material: { ...cloneMaterial(DEFAULT_MATERIAL), ...s.material } });
  const groups: GlassGroup[] = [
    ...(req.surfaces ?? []).map((s) => ({ spacing: 0, surfaces: [surface(s)] })),
    ...(req.groups ?? []).map((g) => ({ spacing: g.spacing, surfaces: g.surfaces.map(surface) })),
  ];
  renderer.debugView = req.debugView ?? 0;
  renderer.guardEnabled = req.guard ?? true;
  renderer.quality = req.quality ?? "high";
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

declare global {
  interface Window {
    probe?: {
      init: typeof init;
      render: typeof render;
      guard: typeof guard;
      predictOffset: typeof predictOffset;
      preset: typeof preset;
      predictUnion: typeof predictUnion;
    };
  }
}

function preset(id: PresetId): GlassMaterial {
  return cloneMaterial(PRESETS[id].material);
}

window.probe = { init, render, guard, predictOffset, preset, predictUnion };
