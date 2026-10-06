import { acquireGpu } from "../gpu/device.ts";
import { DEFAULT_MATERIAL, type GlassMaterial } from "../glass/material.ts";
import { buildRadialTable, deviceGeometry, tableLookup } from "../glass/optics.ts";
import type { Shape } from "../glass/shape.ts";
import { LiquidGlassRenderer, type GlassSurface } from "../renderer/renderer.ts";
import { NativeSource } from "../sources/native.ts";
import { PAINTERS, paintCoordinates, type SceneId } from "../sources/scenes.ts";

/**
 * Test harness driven by Playwright (tests/*.test.mjs). Everything renders at dpr 1 into a canvas
 * of the requested CSS size, and pixels come back through GPU readback, not a screenshot.
 */
const canvas = document.querySelector<HTMLCanvasElement>("#probe")!;
let renderer: LiquidGlassRenderer | null = null;
let source: NativeSource | null = null;

interface RenderRequest {
  surfaces: { shape: Shape; material?: Partial<GlassMaterial> }[];
  debugView?: number;
  guard?: boolean;
}

async function init(width: number, height: number, scene: SceneId | "coordinates"): Promise<{ adapter: string; fallback: boolean }> {
  const gpu = await acquireGpu();
  renderer = new LiquidGlassRenderer(canvas, gpu, { readback: true, offscreen: { width, height } });
  renderer.quality = "low";
  const painter = scene === "coordinates" ? paintCoordinates : PAINTERS[scene];
  source = new NativeSource(scene, painter, () => renderer?.devicePixelRatio ?? 1);
  renderer.setSource(source);
  const error = await renderer.init();
  if (error) throw new Error(error);
  return { adapter: `${gpu.info.vendor} ${gpu.info.architecture}`, fallback: gpu.info.isFallback };
}

async function render(req: RenderRequest): Promise<{ width: number; height: number; rgba: string }> {
  if (!renderer) throw new Error("probe.init primeiro");
  const surfaces: GlassSurface[] = req.surfaces.map((s) => ({ shape: s.shape, material: { ...DEFAULT_MATERIAL, ...s.material } }));
  renderer.debugView = req.debugView ?? 0;
  renderer.guardEnabled = req.guard ?? true;
  renderer.setSurfaces(surfaces);
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
  const [offset, transmission] = tableLookup(table, bevel, s);
  return { offset, transmission };
}

declare global {
  interface Window {
    probe?: {
      init: typeof init;
      render: typeof render;
      guard: typeof guard;
      predictOffset: typeof predictOffset;
    };
  }
}

window.probe = { init, render, guard, predictOffset };
