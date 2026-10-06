import { acquireGpu, GpuUnavailableError, type GpuContext } from "../gpu/device.ts";
import { DEFAULT_MATERIAL, type GlassMaterial, type Profile } from "../glass/material.ts";
import { shapeDistance, shapeOf, type Shape, type ShapeKind } from "../glass/shape.ts";
import { QUALITY_TIERS, type QualityTier } from "../renderer/quality.ts";
import { DEBUG_VIEWS, LiquidGlassRenderer } from "../renderer/renderer.ts";
import { NativeSource } from "../sources/native.ts";
import { PAINTERS, paintBitmap, SCENES, type SceneId } from "../sources/scenes.ts";
import { button, group, hint, segmented, select, slider, toggle, type Control } from "./controls.ts";

const SHAPES: readonly { id: ShapeKind; label: string }[] = [
  { id: "circle", label: "Círculo" },
  { id: "capsule", label: "Cápsula" },
  { id: "rounded", label: "Retângulo" },
  { id: "squircle", label: "Squircle" },
  { id: "panel", label: "Painel" },
];

const PROFILES: readonly { id: Profile; label: string }[] = [
  { id: "squircle", label: "Squircle convexo (Kube)" },
  { id: "circle", label: "Círculo convexo" },
  { id: "lip", label: "Lip (borda elevada)" },
];

const TIER_LABEL: Record<QualityTier, string> = { ultra: "Ultra", high: "High", medium: "Medium", low: "Low" };

const canvas = document.querySelector<HTMLCanvasElement>("#stage")!;
const panel = document.querySelector<HTMLElement>("#panel")!;
const metrics = document.querySelector<HTMLElement>("#metrics")!;
const notice = document.querySelector<HTMLElement>("#notice")!;
const shaderError = document.querySelector<HTMLElement>("#shader-error")!;

const state = {
  scene: "image" as SceneId,
  shapeKind: "capsule" as ShapeKind,
  shape: shapeOf("capsule", 0, 0),
  material: { ...DEFAULT_MATERIAL } as GlassMaterial,
  quality: "high" as QualityTier,
  debugView: 0,
  continuous: false,
  bitmap: null as ImageBitmap | null,
};

/** A device that keeps dying (driver bug, headless SwiftShader presenting) must not loop forever. */
const MAX_RESTARTS = 2;
let restarts = 0;
let renderer: LiquidGlassRenderer | null = null;
let currentGpu: GpuContext | null = null;
let source: NativeSource | null = null;
const controls: Control[] = [];
const guardHint = hint(guardText);

function centerShape(): void {
  state.shape.cx = canvas.clientWidth / 2;
  state.shape.cy = canvas.clientHeight / 2;
}

function surfacesChanged(): void {
  renderer?.surfacesChanged();
}

function setShapeKind(kind: ShapeKind): void {
  const { cx, cy, rotation } = state.shape;
  state.shapeKind = kind;
  state.shape = { ...shapeOf(kind, cx, cy), rotation };
  renderer?.setSurfaces([{ shape: state.shape, material: state.material }]);
  refreshControls();
}

function setScene(scene: SceneId): void {
  state.scene = scene;
  state.bitmap = null;
  source?.setPainter(PAINTERS[scene]);
  renderer?.invalidateSource();
}

async function loadImage(): Promise<void> {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    state.bitmap = await createImageBitmap(file);
    state.scene = "image";
    source?.setPainter(paintBitmap(state.bitmap));
    renderer?.invalidateSource();
    refreshControls();
  });
  input.click();
}

function refreshControls(): void {
  for (const c of controls) c.refresh();
}

function buildPanel(): void {
  const s = () => state.shape;
  const m = () => state.material;
  controls.push(
    group("Cena", true, [
      segmented({ options: SCENES, get: () => state.scene, set: setScene }),
      button("Carregar imagem…", () => void loadImage()),
    ]),
    group("Forma", true, [
      segmented({ options: SHAPES, get: () => state.shapeKind, set: setShapeKind }),
      slider({ label: "Largura", min: 20, max: 420, step: 1, get: () => s().halfWidth * 2, set: (v) => ((s().halfWidth = v / 2), surfacesChanged()), format: (v) => `${v} px` }),
      slider({ label: "Altura", min: 20, max: 420, step: 1, get: () => s().halfHeight * 2, set: (v) => ((s().halfHeight = v / 2), surfacesChanged()), format: (v) => `${v} px` }),
      slider({ label: "Raio do canto", min: 0, max: 210, step: 1, get: () => s().radius, set: (v) => ((s().radius = v), surfacesChanged()), format: (v) => `${v} px` }),
      slider({ label: "Suavização do canto", min: 2, max: 6, step: 0.05, get: () => s().exponent, set: (v) => ((s().exponent = v), surfacesChanged()), format: (v) => `n = ${v.toFixed(2)}` }),
      slider({ label: "Rotação", min: -90, max: 90, step: 1, get: () => (s().rotation * 180) / Math.PI, set: (v) => ((s().rotation = (v * Math.PI) / 180), surfacesChanged()), format: (v) => `${v}°` }),
    ]),
    group("Óptica", true, [
      slider({ label: "Índice de refração", min: 1, max: 2, step: 0.01, get: () => m().ior, set: (v) => ((m().ior = v), surfacesChanged()), format: (v) => v.toFixed(2) }),
      slider({ label: "Espessura", min: 0, max: 60, step: 1, get: () => m().thickness, set: (v) => ((m().thickness = v), surfacesChanged()), format: (v) => `${v} px` }),
      slider({ label: "Altura de flutuação", min: 0, max: 60, step: 1, get: () => m().gap, set: (v) => ((m().gap = v), surfacesChanged()), format: (v) => `${v} px` }),
      slider({ label: "Bisel", min: 0, max: 80, step: 1, get: () => m().bevel, set: (v) => ((m().bevel = v), surfacesChanged()), format: (v) => `${v} px` }),
      select({ label: "Perfil", options: PROFILES, get: () => m().profile, set: (v) => ((m().profile = v), surfacesChanged()) }),
      guardHint,
    ]),
    group("Desempenho", false, [
      segmented({ label: "Qualidade", options: QUALITY_TIERS.map((t) => ({ id: t, label: TIER_LABEL[t] })), get: () => state.quality, set: (v) => ((state.quality = v), renderer?.setQuality(v)) }),
      toggle({ label: "Renderizar todo quadro (medir)", get: () => state.continuous, set: (v) => setContinuous(v) }),
      hint(() => "Sem medir, o laboratório só desenha quando algo muda. Para tempo de GPU sem arredondamento: <strong>chrome://flags/#enable-webgpu-developer-features</strong>."),
    ]),
    group("Debug", false, [
      select({ label: "Visualização", options: DEBUG_VIEWS.map((d) => ({ id: d.id, label: d.label })), get: () => state.debugView, set: (v) => setDebug(v) }),
      hint(() => "<strong>Injetividade</strong>: verde é folga, vermelho passa do limite de compressão 0,88."),
    ]),
  );
  for (const c of controls) panel.append(c.element);
}

function guardText(): string {
  const g = renderer?.guardStats[0];
  if (!g) return "Guarda de injetividade: —";
  const dpr = renderer?.devicePixelRatio ?? 1;
  if (g.compressedBand <= 0 && !g.cornerBound) return "Guarda de injetividade: a física já é injetiva, nada foi alterado.";
  const band = (g.compressedBand / dpr).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const corner = g.cornerBound ? " e limitada no canto" : "";
  return `Guarda de injetividade: a dobra dos <strong>${band} px</strong> mais externos virou compressão${corner}.`;
}

function setContinuous(v: boolean): void {
  state.continuous = v;
  if (!renderer) return;
  renderer.continuous = v;
  renderer.interval.clear();
  renderer.timer?.reset();
  renderer.requestFrame();
}

function setDebug(v: number): void {
  state.debugView = v;
  if (!renderer) return;
  renderer.debugView = v;
  renderer.requestFrame();
}

function metric(label: string, value: string, warn = false): string {
  return `<span class="metric${warn ? " metric--warn" : ""}">${label} <b>${value}</b></span>`;
}

function renderMetrics(): void {
  const r = renderer;
  const gpu = currentGpu;
  if (!r || !gpu) return;
  const parts: string[] = [];
  const fps = r.interval.count > 0 ? 1000 / r.interval.mean : 0;
  parts.push(metric("FPS", state.continuous ? fps.toFixed(0) : "sob demanda"));
  parts.push(metric("CPU", `${r.cpu.mean.toFixed(2)} ms`));
  if (r.timer) {
    const passes = [...r.timer.series.entries()].map(([name, s]) => `${name} ${s.mean.toFixed(2)}`).join(" · ");
    parts.push(metric("GPU", passes ? `${r.timer.total.toFixed(2)} ms (${passes})` : "—"));
  } else {
    parts.push(metric("GPU", "sem timestamp-query"));
  }
  parts.push(metric("DPR", `${r.devicePixelRatio.toFixed(2)} de ${(window.devicePixelRatio || 1).toFixed(2)}`));
  parts.push(metric("Resolução", `${r.resolution.width}×${r.resolution.height}`));
  parts.push(metric("Fundo", "WebGPU · cena nativa"));
  parts.push(metric("Adaptador", `${gpu.info.vendor} ${gpu.info.architecture}`.trim(), gpu.info.isFallback));
  parts.push(metric("Superfícies", String(r.surfaceCount)));
  parts.push(metric("Qualidade", TIER_LABEL[state.quality]));
  parts.push(metric("Memória", `${(r.gpuBytes / 1048576).toFixed(1)} MB`));
  metrics.innerHTML = parts.join("");
}

function installDrag(): void {
  let dragging = false;
  let grabX = 0;
  let grabY = 0;
  const local = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top] as const;
  };
  canvas.addEventListener(
    "pointerdown",
    (e) => {
      const [x, y] = local(e);
      if (shapeDistance(state.shape, x, y) > 0) return;
      dragging = true;
      grabX = x - state.shape.cx;
      grabY = y - state.shape.cy;
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("is-grabbing");
    },
    { passive: true },
  );
  canvas.addEventListener(
    "pointermove",
    (e) => {
      const [x, y] = local(e);
      if (!dragging) {
        canvas.classList.toggle("is-grab", shapeDistance(state.shape, x, y) <= 0);
        return;
      }
      state.shape.cx = x - grabX;
      state.shape.cy = y - grabY;
      surfacesChanged();
    },
    { passive: true },
  );
  const end = () => {
    dragging = false;
    canvas.classList.remove("is-grabbing");
  };
  canvas.addEventListener("pointerup", end, { passive: true });
  canvas.addEventListener("pointercancel", end, { passive: true });
}

function showNotice(html: string | null): void {
  notice.hidden = html === null;
  if (html !== null) notice.innerHTML = html;
}

async function start(): Promise<void> {
  let gpu: GpuContext;
  try {
    gpu = await acquireGpu();
  } catch (error) {
    const reason = error instanceof GpuUnavailableError ? error.message : String(error);
    showNotice(
      `<strong>WebGPU indisponível</strong> (${reason}).<br/>O laboratório precisa de WebGPU: Chrome/Edge 113+, Safari 26+ ou Firefox 141+ (Windows) / 145+ (macOS).`,
    );
    return;
  }
  renderer?.destroy();
  currentGpu = gpu;
  const r = new LiquidGlassRenderer(canvas, gpu);
  renderer = r;
  r.quality = state.quality;
  r.debugView = state.debugView;
  r.continuous = state.continuous;
  r.onShaderError = (message) => {
    shaderError.hidden = message === null;
    shaderError.textContent = message ?? "";
  };
  r.onLost = (info) => {
    restarts++;
    if (restarts > MAX_RESTARTS) {
      showNotice(
        `<strong>A GPU foi perdida ${restarts} vezes</strong> (${info.reason || "sem motivo informado"}: ${info.message}).<br/>O laboratório parou de tentar. Recarregue a página para tentar de novo.`,
      );
      return;
    }
    showNotice(`GPU perdida (${info.reason || "sem motivo informado"}): recriando o renderer…`);
    void start().then(() => showNotice(null));
  };
  r.onFrame = () => guardHint.refresh();
  source = new NativeSource("cena", state.bitmap ? paintBitmap(state.bitmap) : PAINTERS[state.scene], () => r.devicePixelRatio);
  r.setSource(source);
  r.setSurfaces([{ shape: state.shape, material: state.material }]);
  const error = await r.init();
  if (error) console.warn(error);
  refreshControls();
  renderMetrics();
}

centerShape();
buildPanel();
installDrag();
setInterval(renderMetrics, 500);
void start();

declare global {
  interface Window {
    lab?: { state: typeof state; renderer: () => LiquidGlassRenderer | null; setShape: (s: Partial<Shape>) => void };
  }
}
window.lab = {
  state,
  renderer: () => renderer,
  setShape: (patch) => {
    Object.assign(state.shape, patch);
    surfacesChanged();
  },
};
