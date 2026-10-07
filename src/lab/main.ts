import { acquireGpu, GpuUnavailableError, type GpuContext } from "../gpu/device.ts";
import { ABBE_OFF, cloneMaterial, PRESETS, type GlassMaterial, type PresetId, type Profile } from "../glass/material.ts";
import { deviceGeometry } from "../glass/optics.ts";
import { clampedRadius, shapeOf, type Shape, type ShapeKind } from "../glass/shape.ts";
import { AppearancePolicy } from "../glass/policy.ts";
import { unionField } from "../glass/union.ts";
import { DEFAULT_TUNING, GlassBody, type BodyTuning } from "../physics/body.ts";
import { QUALITY_TIERS, type QualityTier } from "../renderer/quality.ts";
import { DEBUG_VIEWS, LiquidGlassRenderer, type GlassGroup, type GlassSurface } from "../renderer/renderer.ts";
import { NativeSource } from "../sources/native.ts";
import { PAINTERS, paintBitmap, SCENES, type SceneId } from "../sources/scenes.ts";
import { color, hint, section, segmented, select, slider, toggle, type Control } from "./controls.ts";
import { ICONS, SYMBOLS } from "./icons.ts";

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

const PRESET_HINT: Record<PresetId, string> = {
  clear: "Claro: transparente, sem fosco (o Clear da Apple)",
  regular: "Regular: um pouco fosco, legível sobre qualquer fundo",
  frost: "Fosco: difunde bem o que está atrás",
  crystal: "Cristal: denso e polido, com cor nas bordas",
  smoke: "Fumê: absorve luz, escurece o fundo",
};

const TIER_LABEL: Record<QualityTier, string> = { ultra: "Ultra", high: "Alta", medium: "Média", low: "Baixa" };
const MAX_GLASSES = 6;
const DEFAULT_SPACING = 28;
/** A glass's centre stays this far inside the visible stage, so there is always some to grab. */
const STAGE_MARGIN = 28;

const canvas = document.querySelector<HTMLCanvasElement>("#stage")!;
const lab = document.querySelector<HTMLElement>(".lab")!;
const dock = document.querySelector<HTMLElement>("#dock")!;
const drawer = document.querySelector<HTMLElement>("#drawer")!;
const drawerBody = document.querySelector<HTMLElement>("#drawer-body")!;
const drawerSubject = document.querySelector<HTMLElement>("#drawer-subject")!;
const statsButton = document.querySelector<HTMLButtonElement>("#stats")!;
const statsCard = document.querySelector<HTMLElement>("#stats-card")!;
const coach = document.querySelector<HTMLElement>("#coach")!;
const selectionRing = document.querySelector<HTMLElement>("#selection")!;
const labels = document.querySelector<HTMLElement>("#labels")!;
const notice = document.querySelector<HTMLElement>("#notice")!;
const shaderError = document.querySelector<HTMLElement>("#shader-error")!;

/** One glass on the stage: its physics, its material, and the record the renderer draws. */
interface Glass {
  /** The dock shape it was given; null once the Forma sliders moved it away. */
  kind: ShapeKind | null;
  body: GlassBody;
  material: GlassMaterial;
  /** The preset it came from; `edited` once a slider moved it away. */
  preset: PresetId;
  edited: boolean;
  surface: GlassSurface;
  /** Regular's light/dark appearance over what is behind this glass. */
  policy: AppearancePolicy;
  /** The symbol sitting on the glass, coloured by the appearance. */
  label: HTMLElement;
}

const tuning: BodyTuning = { follow: { ...DEFAULT_TUNING.follow }, deform: { ...DEFAULT_TUNING.deform }, deformation: DEFAULT_TUNING.deformation };

const state = {
  scene: "image" as SceneId,
  bitmap: null as ImageBitmap | null,
  quality: "high" as QualityTier,
  debugView: 0,
  continuous: false,
  glasses: [] as Glass[],
  selected: 0,
  labels: true,
};

/** All glasses share one merge group: they flow together when they come within `spacing`. */
const group: GlassGroup = { spacing: DEFAULT_SPACING, surfaces: [] };

const MAX_RESTARTS = 2;
let restarts = 0;
let renderer: LiquidGlassRenderer | null = null;
let currentGpu: GpuContext | null = null;
let source: NativeSource | null = null;
const controls: Control[] = [];
const guardHint = hint(guardText);

const selected = (): Glass => state.glasses[state.selected]!;

let symbolCounter = 0;

function createGlass(kind: ShapeKind, cx: number, cy: number, preset: PresetId): Glass {
  const body = new GlassBody(shapeOf(kind, cx, cy), tuning);
  const material = cloneMaterial(PRESETS[preset].material);
  const label = document.createElement("div");
  label.className = "glass-label";
  label.innerHTML = SYMBOLS[symbolCounter++ % SYMBOLS.length]!;
  labels.append(label);
  return { kind, body, material, preset, edited: false, surface: { shape: body.shape(), material }, policy: new AppearancePolicy(), label };
}

/** The symbol follows its glass (position, rotation, press) and takes the appearance's colour. */
function placeLabel(g: Glass): void {
  const s = g.surface.shape;
  const size = Math.min(Math.max(Math.min(s.halfWidth, s.halfHeight) * 0.8, 14), 34) * (s.scale ?? 1);
  const a = g.policy.value;
  const mix = (x: number, y: number) => Math.round(x + (y - x) * a);
  g.label.style.width = g.label.style.height = `${size}px`;
  g.label.style.transform = `translate(${s.cx - size / 2}px, ${s.cy - size / 2}px) rotate(${s.rotation}rad)`;
  g.label.style.color = `rgb(${mix(28, 255)} ${mix(28, 255)} ${mix(32, 255)} / ${0.86 + 0.1 * a})`;
}

function rebuildGroup(): void {
  group.surfaces = state.glasses.map((g) => g.surface);
  renderer?.setGroups([group]);
}

function surfacesChanged(): void {
  for (const g of state.glasses) {
    g.surface.shape = g.body.shape();
    g.surface.material = g.body.material(g.material);
    // Until the first measurement arrives the shader decides by itself (stateless).
    if (g.policy.ready) g.surface.appearance = g.policy.value;
    if (state.labels) placeLabel(g);
  }
  renderer?.surfacesChanged();
}

/** Backdrop measurements arrived (a frame or two late): feed each glass's policy. */
function onBackdrop(stats: Float32Array): void {
  let animating = false;
  state.glasses.forEach((g, i) => {
    if (i * 4 + 3 >= stats.length) return;
    const first = !g.policy.ready;
    g.policy.update({ mean: stats[i * 4]!, p10: stats[i * 4 + 1]!, p90: stats[i * 4 + 2]!, coverage: stats[i * 4 + 3]! });
    // A flip animates; the very first measurement only needs one frame to reach the surface.
    animating ||= g.policy.moving || (first && g.policy.ready);
  });
  if (animating) animate();
}

let stepping = false;
let lastStep = 0;
let fallbackFrame = 0;

/**
 * Steps the bodies while any moves; stops by itself, so an idle lab costs nothing. The step runs
 * inside the renderer's frame (onBeforeFrame), so the frame shows this frame's physics — a
 * separate requestAnimationFrame drew one frame late. Without a renderer (no WebGPU) it keeps its
 * own loop, so the interface still works.
 */
function animate(): void {
  if (!stepping) {
    stepping = true;
    lastStep = performance.now();
  }
  if (renderer) renderer.requestFrame();
  else if (!fallbackFrame) fallbackFrame = requestAnimationFrame(fallbackTick);
}

function stepBodies(now: number): void {
  if (!stepping) return;
  const dt = Math.max(0, now - lastStep) / 1000;
  lastStep = now;
  let moving = false;
  for (const g of state.glasses) {
    moving = g.body.step(dt) || moving;
    moving = g.policy.step(dt) || moving;
  }
  surfacesChanged();
  stepping = moving;
}

function fallbackTick(now: number): void {
  fallbackFrame = 0;
  stepBodies(now);
  if (stepping && !renderer) fallbackFrame = requestAnimationFrame(fallbackTick);
}

/** The part of the canvas a glass centre may occupy: inside the stage, above the dock. */
function stageBounds(): [number, number, number, number] {
  const rect = canvas.getBoundingClientRect();
  const dockTop = dock.getBoundingClientRect().top - rect.top;
  const bottom = Math.min(rect.height, dockTop > 0 ? dockTop : rect.height) - STAGE_MARGIN;
  return [STAGE_MARGIN, STAGE_MARGIN + 24, rect.width - STAGE_MARGIN, bottom];
}

function keepInStage(): void {
  const [minX, minY, maxX, maxY] = stageBounds();
  for (const g of state.glasses) g.body.keepInside(minX, minY, maxX, maxY);
  animate();
}

// ---- Actions ------------------------------------------------------------------------------

function selectGlass(index: number, flash = true): void {
  state.selected = Math.max(0, Math.min(index, state.glasses.length - 1));
  refreshAll();
  if (flash) flashSelection();
}

function setShapeKind(kind: ShapeKind): void {
  if (selected().kind === kind) return;
  const g = selected();
  const { rotation } = g.body.rest;
  g.kind = kind;
  g.body.morph({ ...shapeOf(kind, 0, 0), rotation });
  animate();
  refreshAll();
}

function applyPreset(id: PresetId): void {
  const g = selected();
  g.preset = id;
  g.edited = false;
  g.material = cloneMaterial(PRESETS[id].material);
  surfacesChanged();
  refreshAll();
}

/** Any manual change leaves the preset: the drawer says so instead of pretending. */
function editMaterial(change: (m: GlassMaterial) => void): void {
  const g = selected();
  change(g.material);
  g.edited = true;
  surfacesChanged();
  refreshSubject();
}

function editShape(change: (s: Shape) => void): void {
  const g = selected();
  change(g.body.rest);
  g.body.snap();
  g.kind = null;
  surfacesChanged();
  refreshSubject();
}

function addGlass(): void {
  if (state.glasses.length >= MAX_GLASSES) return;
  const from = selected();
  const s = from.body.shape();
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  // Beside the selected glass, past its merge reach, wrapping inside the stage.
  let cx = s.cx + s.halfWidth + 140;
  let cy = s.cy;
  if (cx > w - 100) {
    cx = Math.max(100, s.cx - s.halfWidth - 140);
    cy = s.cy + (s.cy < h / 2 ? 150 : -150);
  }
  const [minX, minY, maxX, maxY] = stageBounds();
  cx = Math.min(Math.max(cx, minX), maxX);
  cy = Math.min(Math.max(cy, minY), maxY);
  const glass = createGlass("circle", cx, cy, from.preset);
  glass.material = cloneMaterial(from.material);
  glass.edited = from.edited;
  state.glasses.push(glass);
  rebuildGroup();
  surfacesChanged();
  selectGlass(state.glasses.length - 1);
}

function removeGlass(): void {
  if (state.glasses.length <= 1) return;
  const [gone] = state.glasses.splice(state.selected, 1);
  gone?.label.remove();
  rebuildGroup();
  surfacesChanged();
  selectGlass(Math.min(state.selected, state.glasses.length - 1), false);
}

function setScene(scene: SceneId): void {
  state.scene = scene;
  state.bitmap = null;
  source?.setPainter(PAINTERS[scene]);
  renderer?.invalidateSource();
  refreshAll();
}

function loadImage(): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      state.bitmap = await createImageBitmap(file);
    } catch {
      // HEIC and other formats the browser cannot decode: say so and keep the current scene.
      const message = `Não consegui abrir <strong>${file.name.replace(/[<>&]/g, "")}</strong>: o navegador não decodifica esse formato. Tente JPEG, PNG ou WebP.`;
      showNotice(message);
      setTimeout(() => notice.innerHTML === message && showNotice(null), 4000);
      return;
    }
    source?.setPainter(paintBitmap(state.bitmap));
    renderer?.invalidateSource();
    refreshAll();
  });
  input.click();
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

function openDrawer(open: boolean): void {
  drawer.hidden = !open;
  lab.classList.toggle("has-drawer", open);
  refreshAll();
}

// ---- Dock ---------------------------------------------------------------------------------

interface DockButton {
  element: HTMLButtonElement;
  pressed?: () => boolean;
  disabled?: () => boolean;
}
const dockButtons: DockButton[] = [];

function chip(opts: { html: string; label: string; onClick: () => void; pressed?: () => boolean; disabled?: () => boolean; className?: string }): HTMLButtonElement {
  const b = document.createElement("button");
  b.type = "button";
  b.className = `chip ${opts.className ?? ""}`.trim();
  b.innerHTML = opts.html;
  b.title = opts.label;
  b.setAttribute("aria-label", opts.label);
  b.addEventListener("click", opts.onClick);
  dockButtons.push({ element: b, ...(opts.pressed ? { pressed: opts.pressed } : {}), ...(opts.disabled ? { disabled: opts.disabled } : {}) });
  return b;
}

function dockGroup(caption: string, buttons: HTMLElement[]): HTMLElement {
  const g = document.createElement("div");
  g.className = "dock__group";
  const c = document.createElement("span");
  c.className = "dock__caption";
  c.textContent = caption;
  const row = document.createElement("div");
  row.className = "dock__row";
  row.setAttribute("role", "group");
  row.setAttribute("aria-label", caption);
  row.append(...buttons);
  g.append(c, row);
  return g;
}

const divider = () => Object.assign(document.createElement("span"), { className: "dock__divider" });

/** A small live picture of the scene, painted by the same painter the stage uses. */
function thumbnail(scene: SceneId): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 76;
  c.height = 60;
  const ctx = c.getContext("2d");
  if (ctx) PAINTERS[scene](ctx, c.width, c.height, 0.22);
  return c;
}

function buildDock(): void {
  const scenes = SCENES.map((s) => {
    const b = chip({ html: "", label: `Fundo: ${s.label}`, className: "swatch", onClick: () => setScene(s.id), pressed: () => !state.bitmap && state.scene === s.id });
    b.append(thumbnail(s.id));
    return b;
  });
  const upload = chip({ html: ICONS.upload, label: "Usar uma foto sua como fundo", className: "chip--icon", onClick: loadImage, pressed: () => state.bitmap !== null });
  const shapes = SHAPES.map((s) =>
    chip({ html: ICONS[s.id], label: `Forma: ${s.label}`, className: "chip--icon", onClick: () => setShapeKind(s.id), pressed: () => selected().kind === s.id }),
  );
  const materials = (Object.keys(PRESETS) as PresetId[]).map((id) =>
    chip({
      html: PRESETS[id].label,
      label: PRESET_HINT[id],
      className: "material-chip",
      onClick: () => applyPreset(id),
      pressed: () => !selected().edited && selected().preset === id,
    }),
  );
  const glasses = [
    chip({ html: ICONS.add, label: "Adicionar um vidro", className: "chip--icon", onClick: addGlass, disabled: () => state.glasses.length >= MAX_GLASSES }),
    chip({ html: ICONS.remove, label: "Remover o vidro selecionado", className: "chip--icon", onClick: removeGlass, disabled: () => state.glasses.length <= 1 }),
  ];
  const tune = chip({ html: ICONS.tune, label: "Ajustes finos", className: "chip--icon", onClick: () => openDrawer(drawer.hidden), pressed: () => !drawer.hidden });
  dock.append(
    dockGroup("Fundo", [...scenes, upload]),
    divider(),
    dockGroup("Forma", shapes),
    divider(),
    dockGroup("Material", materials),
    divider(),
    dockGroup("Vidros", glasses),
    dockGroup("Ajustes", [tune]),
  );
}

// ---- Drawer -------------------------------------------------------------------------------

const px = (v: number) => `${Math.round(v)} px`;
/** A value the geometry caps: say so, instead of a slider that silently stops doing anything. */
const capped = (v: number, effective: number, why: string) => (effective < v - 0.5 ? `${Math.round(effective)} px · ${why}` : px(v));
const dispersionAmount = (abbe: number) => (abbe >= ABBE_OFF ? 0 : (ABBE_OFF - abbe) / (ABBE_OFF - 20));

function buildDrawer(): void {
  const m = () => selected().material;
  const s = () => selected().body.rest;
  controls.push(
    section("Vidro", "O vidro selecionado. A física é real: Snell nas duas faces, Fresnel e absorção.", true, [
      slider({ label: "Refração", hint: "Índice de refração: quanto a borda curva desvia a imagem. Vidro comum ≈ 1,5.", min: 1, max: 2, step: 0.01, get: () => m().ior, set: (v) => editMaterial((x) => (x.ior = v)), format: (v) => `n ${v.toFixed(2)}` }),
      slider({ label: "Espessura", hint: "Quanto o raio anda dentro do vidro: mais espesso, mais deslocamento na borda.", min: 0, max: 60, step: 1, get: () => m().thickness, set: (v) => editMaterial((x) => (x.thickness = v)), format: px }),
      slider({
        label: "Borda curva",
        hint: "Largura da faixa curva junto à borda (bisel). Não passa do raio do canto.",
        min: 0,
        max: 80,
        step: 1,
        get: () => m().bevel,
        set: (v) => editMaterial((x) => (x.bevel = v)),
        format: (v) => capped(v, deviceGeometry({ ...m(), bevel: v }, s(), 1).bevel, "limite do canto"),
      }),
      slider({ label: "Fosco", hint: "Rugosidade da superfície: borra o que está atrás.", min: 0, max: 1, step: 0.01, get: () => m().roughness, set: (v) => editMaterial((x) => (x.roughness = v)), format: (v) => `${Math.round(v * 100)}%` }),
      slider({
        label: "Cor nas bordas",
        hint: "Dispersão: cada cor refrata um pouco diferente (número de Abbe). Zero desliga.",
        min: 0,
        max: 1,
        step: 0.01,
        get: () => dispersionAmount(m().abbe),
        set: (v) => editMaterial((x) => (x.abbe = v <= 0 ? ABBE_OFF : Math.round(ABBE_OFF - v * (ABBE_OFF - 20)))),
        format: (v) => (v <= 0 ? "desligada" : `V ${Math.round(ABBE_OFF - v * (ABBE_OFF - 20))}`),
      }),
      slider({ label: "Elevação", hint: "Quanto o vidro flutua acima do conteúdo: desloca a imagem e afasta a sombra.", min: 0, max: 60, step: 1, get: () => m().gap, set: (v) => editMaterial((x) => (x.gap = v)), format: px }),
    ]),
    section("Forma", "Os botões de forma no dock animam; aqui o ajuste é direto.", false, [
      slider({ label: "Largura", min: 20, max: 520, step: 1, get: () => s().halfWidth * 2, set: (v) => editShape((x) => (x.halfWidth = v / 2)), format: px }),
      slider({ label: "Altura", min: 20, max: 420, step: 1, get: () => s().halfHeight * 2, set: (v) => editShape((x) => (x.halfHeight = v / 2)), format: px }),
      slider({
        label: "Cantos",
        hint: "Raio do canto. No máximo, metade do lado menor (vira cápsula).",
        min: 0,
        max: 210,
        step: 1,
        get: () => s().radius,
        set: (v) => editShape((x) => (x.radius = v)),
        format: (v) => capped(v, clampedRadius({ ...s(), radius: v }), "máximo"),
      }),
      slider({ label: "Suavidade do canto", hint: "2 é arco de círculo; perto de 4 é o squircle dos ícones da Apple.", min: 2, max: 6, step: 0.05, get: () => s().exponent, set: (v) => editShape((x) => (x.exponent = v)), format: (v) => `n ${v.toFixed(2)}` }),
      slider({ label: "Rotação", min: -90, max: 90, step: 1, get: () => (s().rotation * 180) / Math.PI, set: (v) => editShape((x) => (x.rotation = (v * Math.PI) / 180)), format: (v) => `${Math.round(v)}°` }),
    ]),
    section("Luz e cor", "O vidro não tem cor própria: reflete o ambiente e tinge só se você pedir.", false, [
      slider({ label: "Brilho", hint: "Luz principal, que vem de cima, mais uma contraluz fraca por baixo.", min: 0, max: 2, step: 0.01, get: () => m().light, set: (v) => editMaterial((x) => (x.light = v)), format: (v) => `${Math.round(v * 100)}%` }),
      slider({ label: "Direção da luz", hint: "90° = de cima.", min: 0, max: 180, step: 1, get: () => m().lightAngle, set: (v) => editMaterial((x) => (x.lightAngle = v)), format: (v) => `${Math.round(v)}°` }),
      slider({ label: "Reflexo", hint: "Quanto do ambiente (a cor média do fundo) o vidro reflete, pelo Fresnel.", min: 0, max: 2, step: 0.01, get: () => m().environment, set: (v) => editMaterial((x) => (x.environment = v)), format: (v) => `${Math.round(v * 100)}%` }),
      slider({
        label: "Adaptação ao fundo",
        hint: "Só no Regular: sobre fundo claro clareia o que está atrás, sobre fundo escuro escurece, para o que fica em cima do vidro continuar legível. Troca de lado com animação.",
        min: 0,
        max: 1,
        step: 0.01,
        get: () => m().adapt,
        set: (v) => editMaterial((x) => (x.adapt = v)),
        format: (v) => (m().variant === "clear" ? "o Claro não se adapta" : `${Math.round(v * 100)}%`),
      }),
      slider({ label: "Borda escura", hint: "Escurece a borda conforme a inclinação, para o vidro se destacar em fundo claro.", min: 0, max: 1, step: 0.01, get: () => m().edge, set: (v) => editMaterial((x) => (x.edge = v)), format: (v) => `${Math.round(v * 100)}%` }),
      slider({ label: "Sombra", min: 0, max: 1, step: 0.01, get: () => m().shadow, set: (v) => editMaterial((x) => (x.shadow = v)), format: (v) => `${Math.round(v * 100)}%` }),
      color({ label: "Cor do vidro", hint: "Tinge por absorção (Beer–Lambert): mais forte onde o vidro é mais grosso.", get: () => m().tint, set: (v) => editMaterial((x) => (x.tint = v)) }),
      slider({ label: "Intensidade da cor", min: 0, max: 1, step: 0.01, get: () => m().density, set: (v) => editMaterial((x) => (x.density = v)), format: (v) => `${Math.round(v * 100)}%` }),
    ]),
    section("Fusão e movimento", "Vale para todos os vidros.", false, [
      slider({
        label: "Distância de fusão",
        hint: "Dois vidros começam a se unir quando o vão entre eles fica abaixo deste valor. Zero desliga.",
        min: 0,
        max: 80,
        step: 1,
        get: () => group.spacing,
        set: (v) => ((group.spacing = v), surfacesChanged()),
        format: (v) => (v <= 0 ? "desligada" : px(v)),
      }),
      slider({ label: "Resposta", hint: "Tempo que o vidro leva para alcançar o dedo.", min: 0.04, max: 0.5, step: 0.01, get: () => tuning.follow.response, set: (v) => (tuning.follow.response = v), format: (v) => `${Math.round(v * 1000)} ms` }),
      slider({ label: "Amortecimento", hint: "1 chega sem passar do ponto; abaixo de 1 balança um pouco.", min: 0.3, max: 1.2, step: 0.01, get: () => tuning.follow.dampingRatio, set: (v) => (tuning.follow.dampingRatio = v), format: (v) => `ζ ${v.toFixed(2)}` }),
      slider({ label: "Esticar", hint: "Quanto o vidro estica na direção do movimento (preserva a área, teto de 12%).", min: 0, max: 0.00015, step: 0.000001, get: () => tuning.deformation, set: (v) => (tuning.deformation = v), format: (v) => `${(v * 100000).toFixed(1)}% a 1000 px/s` }),
    ]),
    section("Avançado", "", false, [
      select({ label: "Perfil da borda", options: PROFILES, get: () => m().profile, set: (v) => editMaterial((x) => (x.profile = v)) }),
      segmented({
        label: "Qualidade",
        options: QUALITY_TIERS.map((t) => ({ id: t, label: TIER_LABEL[t] })),
        get: () => state.quality,
        set: (v) => {
          state.quality = v;
          renderer?.setQuality(v);
        },
      }),
      toggle({
        label: "Ícones sobre o vidro",
        hint: "Um símbolo em cada vidro, escuro quando o vidro está no modo claro e claro no modo escuro.",
        get: () => state.labels,
        set: (v) => {
          state.labels = v;
          labels.hidden = !v;
          surfacesChanged();
        },
      }),
      toggle({ label: "Medir desempenho", hint: "Desenha todo quadro para medir fps e tempo de GPU. Desligado, só desenha quando algo muda.", get: () => state.continuous, set: setContinuous }),
      select({ label: "Inspecionar", hint: "Mostra uma grandeza do shader no lugar da imagem final.", options: DEBUG_VIEWS.map((d) => ({ id: d.id, label: d.label })), get: () => state.debugView, set: setDebug }),
      guardHint,
    ]),
  );
  for (const c of controls) drawerBody.append(c.element);
}

function guardText(): string {
  const stats = renderer?.guardStats[state.selected];
  if (!stats) return "";
  const dpr = renderer?.devicePixelRatio ?? 1;
  if (stats.compressedBand <= 0 && !stats.cornerBound) return "Guarda de injetividade: a física já é injetiva, nada foi alterado.";
  const band = (stats.compressedBand / dpr).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const corner = stats.cornerBound ? " e limitada no canto" : "";
  return `Guarda de injetividade: nos <strong>${band} px</strong> da borda a dobra da imagem virou compressão${corner}.`;
}

function refreshSubject(): void {
  const g = selected();
  const n = state.glasses.length;
  const name = n > 1 ? `Vidro ${state.selected + 1} de ${n}` : "Vidro";
  drawerSubject.textContent = `${name} · ${PRESETS[g.preset].label}${g.edited ? " (ajustado)" : ""}`;
  if (g.edited) {
    const reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "restaurar";
    reset.addEventListener("click", () => applyPreset(g.preset));
    drawerSubject.append(reset);
  }
  for (const b of dockButtons) {
    if (b.pressed) b.element.setAttribute("aria-pressed", String(b.pressed()));
    if (b.disabled) b.element.disabled = b.disabled();
  }
}

function refreshAll(): void {
  for (const c of controls) c.refresh();
  refreshSubject();
}

// ---- Selection, drag, coach ---------------------------------------------------------------

let flashTimer = 0;

function flashSelection(): void {
  if (state.glasses.length < 2) return;
  const g = selected();
  const s = g.body.shape();
  const pad = 7;
  const r = clampedRadius(s);
  Object.assign(selectionRing.style, {
    width: `${s.halfWidth * 2 + pad * 2}px`,
    height: `${s.halfHeight * 2 + pad * 2}px`,
    borderRadius: `${r + pad}px`,
    transform: `translate(${s.cx - s.halfWidth - pad}px, ${s.cy - s.halfHeight - pad}px) rotate(${s.rotation}rad)`,
  });
  selectionRing.classList.add("is-visible");
  clearTimeout(flashTimer);
  flashTimer = window.setTimeout(() => selectionRing.classList.remove("is-visible"), 700);
}

/** The glass under the pointer, including the neck between two merged glasses (its main member). */
function hit(x: number, y: number): number {
  const shapes = state.glasses.map((g) => g.surface.shape);
  const u = unionField(shapes, state.glasses.length > 1 ? group.spacing / 2 : 0, x, y);
  if (u.d > 0) return -1;
  return u.blend.reduce((best, e) => (e.weight > best.weight ? e : best)).index;
}

function installDrag(): void {
  let dragging: Glass | null = null;
  const local = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top] as const;
  };
  canvas.addEventListener(
    "pointerdown",
    (e) => {
      const [x, y] = local(e);
      const index = hit(x, y);
      if (index < 0) return;
      if (index !== state.selected) selectGlass(index);
      dragging = state.glasses[index]!;
      dragging.body.grab(x, y);
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("is-grabbing");
      coach.classList.add("is-done");
      animate();
    },
    { passive: true },
  );
  canvas.addEventListener(
    "pointermove",
    (e) => {
      const [x, y] = local(e);
      if (!dragging) {
        canvas.classList.toggle("is-grab", hit(x, y) >= 0);
        return;
      }
      dragging.body.drag(x, y);
      const [minX, minY, maxX, maxY] = stageBounds();
      dragging.body.keepInside(minX, minY, maxX, maxY);
      animate();
    },
    { passive: true },
  );
  const end = () => {
    if (!dragging) return;
    dragging.body.release();
    dragging = null;
    canvas.classList.remove("is-grabbing");
    animate();
  };
  canvas.addEventListener("pointerup", end, { passive: true });
  canvas.addEventListener("pointercancel", end, { passive: true });
  // Alt-tab, a system gesture or a dialog can take the pointer without a pointerup.
  canvas.addEventListener("lostpointercapture", end, { passive: true });
  canvas.addEventListener("dblclick", (e) => {
    const [x, y] = local(e);
    if (hit(x, y) >= 0) openDrawer(true);
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawer.hidden) openDrawer(false);
  });
}

// ---- Metrics ------------------------------------------------------------------------------

function toggleStats(open = statsCard.hidden): void {
  statsCard.hidden = !open;
  statsButton.setAttribute("aria-expanded", String(open));
  renderMetrics();
}

const ms = (v: number) => `${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ms`;

function renderMetrics(): void {
  const r = renderer;
  const gpu = currentGpu;
  if (!r || !gpu) return;
  const fps = state.continuous && r.interval.count > 0 ? `${Math.round(1000 / r.interval.mean)} fps` : "sob demanda";
  const gpuTotal = r.timer && r.timer.total > 0 ? `GPU ${ms(r.timer.total)}` : "GPU —";
  statsButton.textContent = `${fps} · ${gpuTotal}`;
  if (statsCard.hidden) return;
  const rows: [string, string, boolean?][] = [
    ["quadros", fps],
    ["CPU", ms(r.cpu.mean)],
  ];
  if (r.timer) for (const [name, s] of r.timer.series) rows.push([`GPU ${name}`, ms(s.mean)]);
  else rows.push(["GPU", "sem timestamp-query"]);
  rows.push(
    ["resolução", `${r.resolution.width}×${r.resolution.height}`],
    ["DPR", `${r.devicePixelRatio.toFixed(2)} de ${(window.devicePixelRatio || 1).toFixed(2)}`],
    ["qualidade", TIER_LABEL[state.quality]],
    ["vidros", `${r.surfaceCount} em ${r.groupCount} grupo${r.groupCount === 1 ? "" : "s"}`],
    ["fundo sob o vidro", backdropText()],
    ["memória", `${(r.gpuBytes / 1048576).toFixed(1)} MB`],
    ["adaptador", `${gpu.info.vendor} ${gpu.info.architecture}`.trim(), gpu.info.isFallback],
  );
  statsCard.innerHTML =
    `<dl>${rows.map(([k, v, warn]) => `<dt>${k}</dt><dd${warn ? ' class="warn"' : ""}>${v}</dd>`).join("")}</dl>` +
    `<p class="hint" style="margin-top:8px">Liga “Medir desempenho” em Ajustes → Avançado para fps. Tempo de GPU sem arredondamento: <strong>chrome://flags/#enable-webgpu-developer-features</strong>.</p>`;
}

/** Lightness under the selected glass and the side its appearance took. */
function backdropText(): string {
  const stats = renderer?.backdrop;
  const i = state.selected;
  if (!stats || stats.length < (i + 1) * 4) return "—";
  const side = selected().material.variant === "clear" ? "Claro, não adapta" : selected().policy.dark ? "modo escuro" : "modo claro";
  return `L* ${Math.round(stats[i * 4]!)} (${Math.round(stats[i * 4 + 1]!)}–${Math.round(stats[i * 4 + 2]!)}) · ${side}`;
}

// ---- Start --------------------------------------------------------------------------------

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
  r.onBeforeFrame = stepBodies;
  r.onBackdrop = onBackdrop;
  // The guard's numbers exist only after the frame built the tables.
  r.onFrame = () => {
    if (!drawer.hidden) guardHint.refresh();
  };
  source = new NativeSource("cena", state.bitmap ? paintBitmap(state.bitmap) : PAINTERS[state.scene], () => r.devicePixelRatio);
  r.setSource(source);
  surfacesChanged();
  r.setGroups([group]);
  const error = await r.init();
  if (error) console.warn(error);
  refreshAll();
  renderMetrics();
}

/** A capsule and a circle well apart: the first thing to try is pushing one into the other. */
function initialGlasses(): void {
  const w = canvas.clientWidth || 960;
  const h = canvas.clientHeight || 600;
  const capsule = shapeOf("capsule", 0, 0);
  const circle = shapeOf("circle", 0, 0);
  const gap = 110;
  const span = capsule.halfWidth * 2 + gap + circle.halfWidth * 2;
  if (span + 32 <= w) {
    const left = w / 2 - span / 2;
    const cy = h * 0.44;
    state.glasses = [
      createGlass("capsule", left + capsule.halfWidth, cy, "regular"),
      createGlass("circle", left + capsule.halfWidth * 2 + gap + circle.halfWidth, cy, "regular"),
    ];
  } else {
    // A phone: one above the other.
    const top = h * 0.36 - (capsule.halfHeight * 2 + gap + circle.halfHeight * 2) / 2;
    state.glasses = [
      createGlass("capsule", w / 2, top + capsule.halfHeight, "regular"),
      createGlass("circle", w / 2, top + capsule.halfHeight * 2 + gap + circle.halfHeight, "regular"),
    ];
  }
  rebuildGroup();
}

initialGlasses();
buildDock();
buildDrawer();
document.querySelector("#drawer-close")!.innerHTML = ICONS.close;
document.querySelector("#drawer-close")!.addEventListener("click", () => openDrawer(false));
statsButton.addEventListener("click", () => toggleStats());
installDrag();
new ResizeObserver(keepInStage).observe(canvas);
refreshAll();
setInterval(renderMetrics, 500);
void start();

declare global {
  interface Window {
    lab?: {
      state: typeof state;
      group: GlassGroup;
      renderer: () => LiquidGlassRenderer | null;
      select: (i: number) => void;
      /** Feed backdrop statistics measured elsewhere (ui-shot renders the glass in the probe). */
      backdrop: (stats: number[]) => void;
    };
  }
}
window.lab = { state, group, renderer: () => renderer, select: (i) => selectGlass(i), backdrop: (stats) => onBackdrop(new Float32Array(stats)) };
