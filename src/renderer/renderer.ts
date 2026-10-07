import { srgbViewOf, type GpuContext } from "../gpu/device.ts";
import { CLEAR_DIM, PROFILE_INDEX, REFERENCE_PATH, type GlassMaterial } from "../glass/material.ts";
import {
  buildRadialTable,
  deviceGeometry,
  EDGE_START_PX,
  shadowGeometry,
  TABLE_SAMPLES,
  TABLE_STRIDE,
  type GuardStats,
} from "../glass/optics.ts";
import { MAX_TOUCH_LIGHTS, type TouchLight } from "../glass/glow.ts";
import { clampedRadius, invert, shapeExtent, shapeMatrix, type Shape } from "../glass/shape.ts";
import { onShaderChange, shaderSources, type ShaderSources } from "../shaders/index.ts";
import type { BackgroundSource } from "../sources/source.ts";
import { FrameGraph, type FrameContext, type Pass } from "./frame-graph.ts";
import { TexturePool } from "./pool.ts";
import type { AdaptiveQuality } from "./adaptive.ts";
import { effectivePixelRatio, TIER_FEATURES, type QualityTier } from "./quality.ts";
import { CONTENT_FLOATS, GROUP_FLOATS, SURFACE_FLOATS, UploadStage } from "./stage.ts";
import { buildSymbolAtlas, SYMBOL_CELL, SYMBOL_LEVELS, type SymbolAtlas } from "./symbols.ts";
import { GpuTimer, Series } from "./timer.ts";

export interface GlassSurface {
  shape: Shape;
  material: GlassMaterial;
  /**
   * Regular's appearance, 0 light .. 1 dark, as the app animates it (AppearancePolicy). Absent:
   * the shader derives it from this frame's backdrop metrics, without memory.
   */
  appearance?: number;
  /** A symbol sitting on the glass, drawn in the glass's layer (see GlassContent). */
  content?: GlassContent;
}

/**
 * What sits on a glass — a toolbar's symbol. It follows the glass's centre, rotation and press,
 * not its stretch, and it is drawn right after the glasses of its layer, so a glass of the layer
 * above refracts it like anything else below.
 */
export interface GlassContent {
  /** Index in the symbol set given to setSymbols(). */
  symbol: number;
  /** Side of the symbol's square, CSS px, before the press. */
  size: number;
  /** sRGB colour 0..1 and opacity. */
  color: readonly [number, number, number, number];
}

/**
 * Surfaces that may merge, like a SwiftUI GlassEffectContainer: members whose gap drops below
 * `spacing` flow into one piece of glass (smooth union); surfaces in different groups never do.
 * A group is one instance of the draw, and its fragments walk only its own members, so keep groups
 * small and local — a toolbar, not the whole screen.
 */
export interface GlassGroup {
  /** Gap, CSS px, at which two members touch. 0 keeps them apart. */
  spacing: number;
  surfaces: GlassSurface[];
  /**
   * 0 (default) sits on the content; 1 floats above layer 0 and refracts it — its glasses, their
   * symbols and their shadows — the way a popover refracts the toolbar under it. Groups of
   * different layers never merge. Layer 1 costs a composite of what lies below and its pyramid,
   * redone only when something below changes; with nothing on layer 1 it costs nothing.
   */
  layer?: 0 | 1;
}

export const DEBUG_VIEWS = [
  { id: 0, label: "Final" },
  { id: 1, label: "SDF" },
  { id: 2, label: "Normal" },
  { id: 3, label: "Deslocamento" },
  { id: 4, label: "Injetividade" },
  { id: 5, label: "Transmissão" },
  { id: 6, label: "Espessura" },
  { id: 7, label: "Posição da amostra" },
  { id: 8, label: "Fresnel" },
  { id: 9, label: "Nível de blur (LOD)" },
  { id: 10, label: "Especular" },
  { id: 11, label: "Dispersão" },
  { id: 12, label: "Fusão (peso de cada vidro)" },
] as const;

/** Mip levels of the background pyramid; beyond 2^8 px of blur the material has no use. */
const PYRAMID_LEVELS = 9;

export interface RendererOptions {
  /** Allow `capture()` to read frames back. */
  readback?: boolean;
  /**
   * Render into an offscreen texture of `size` instead of the canvas. Headless Chromium on
   * SwiftShader loses the GPU process when a canvas swapchain is drawn; offscreen targets work, so
   * tests and captures use this. The lab itself always draws to the canvas.
   */
  offscreen?: { width: number; height: number };
}

export interface Pixels {
  width: number;
  height: number;
  /** RGBA8, row-major, top row first. */
  data: Uint8Array;
}


/** Backdrop metrics read back to the CPU: a ring, so mapping never stalls a frame. */
const METRICS_RING = 3;
const TABLE_FLOATS = TABLE_SAMPLES * TABLE_STRIDE;
/** Globals (see glass.wgsl): 48 bytes, then up to MAX_TOUCH_LIGHTS vec4 touch lights. */
const GLOBALS_BYTES = 48 + MAX_TOUCH_LIGHTS * 16;
/** The words of the globals the composite under layer 1 depends on: debug view, features, touch count and lights. */
const LOWER_GLOBALS = [6, 8, 9, ...Array.from({ length: MAX_TOUCH_LIGHTS * 4 }, (_, i) => 12 + i)];
/** Antialiasing band around the bounds of a group, device px. */
const BOUNDS_MARGIN = 2;

/** A mip chain with what it takes to rebuild it, made once per texture (never per frame). */
interface Pyramid {
  texture: GPUTexture;
  /** One view per level, to render into. */
  levels: GPUTextureView[];
  /** Level i − 1 bound as the source of level i, at index i − 1. */
  sources: GPUBindGroup[];
  /** Every level, to sample. */
  view: GPUTextureView;
}

/** Where a layer's records sit in the group buffer: lone surfaces (fs_single), then merge groups (fs_union). */
interface LayerRecords {
  singleStart: number;
  singles: number;
  unionStart: number;
  unions: number;
}


/**
 * The one renderer of the lab: one device, one canvas, one loop, every glass surface in one
 * instanced draw. It owns the content behind the glass through a BackgroundSource.
 */
export class LiquidGlassRenderer {
  quality: QualityTier = "high";
  debugView = 0;
  /** Render every frame (for measuring) instead of only when something changed. */
  continuous = false;
  /** Rebuild the pyramid every frame, as a live background (video, HTML-in-Canvas) would. Bench only. */
  forcePyramid = false;
  /** Tests switch the injectivity guard off to prove it is what keeps the mapping one-to-one. */
  guardEnabled = true;
  /**
   * Lights from touches inside the glass, CSS px (src/glass/glow.ts); the first MAX_TOUCH_LIGHTS
   * are drawn. Read every frame: set it, then request a frame.
   */
  touchLights: readonly TouchLight[] = [];
  /** When set, picks `quality` from the measured GPU time after every frame. */
  adaptive: AdaptiveQuality | null = null;

  readonly cpu = new Series();
  readonly interval = new Series();
  readonly timer: GpuTimer | null;
  onShaderError: ((message: string | null) => void) | null = null;
  onLost: ((info: GPUDeviceLostInfo) => void) | null = null;
  /**
   * Called at the start of a frame, before anything is encoded: the place to step physics, so what
   * is drawn is this frame's state and not the previous one's. Call requestFrame() from it to keep
   * animating.
   */
  onBeforeFrame: ((now: number) => void) | null = null;
  onFrame: (() => void) | null = null;

  private readonly device: GPUDevice;
  private readonly context: GPUCanvasContext | null;
  private readonly offscreen: { width: number; height: number } | null;
  private frameTexture: GPUTexture | null = null;
  private readonly viewFormat: GPUTextureFormat;
  private readonly pool: TexturePool;
  private readonly graph = new FrameGraph();
  private readonly globals: GPUBuffer;
  private readonly sampler: GPUSampler;
  private readonly bgLayout: GPUBindGroupLayout;
  private readonly glassLayout: GPUBindGroupLayout;
  private readonly metricsLayout: GPUBindGroupLayout;
  private metricsPipeline: GPUComputePipeline | null = null;
  /** Per layer: the layer's pyramid and which layer the dispatch measures. */
  private metricsBindGroups: (GPUBindGroup | null)[] = [null, null];
  private readonly layerUniforms: GPUBuffer[];
  private metricsBuffer: GPUBuffer | null = null;
  private metricsSlots: { buffer: GPUBuffer; busy: boolean; count: number }[] = [];
  private metricsSlot: { buffer: GPUBuffer; busy: boolean; count: number } | null = null;
  private metricsDirty = true;
  private metricsWaiters: ((stats: Float32Array) => void)[] = [];
  /**
   * Latest backdrop statistics per surface (flat order): mean L*, p10, p90, coverage. They arrive a
   * frame or two after the frame that measured them.
   */
  backdrop = new Float32Array(0);
  onBackdrop: ((stats: Float32Array) => void) | null = null;
  private bgPipeline: GPURenderPipeline | null = null;
  private pyramidPipeline: GPURenderPipeline | null = null;
  /** The same downsample writing the canvas's format, for the composite under layer 1. */
  private lowerPyramidPipeline: GPURenderPipeline | null = null;
  private readonly pyramidLayout: GPUBindGroupLayout;
  private bgPyramid: Pyramid | null = null;
  private pyramidDirty = true;
  private glassPipeline: GPURenderPipeline | null = null;
  private unionPipeline: GPURenderPipeline | null = null;
  private contentPipeline: GPURenderPipeline | null = null;
  private readonly contentLayout: GPUBindGroupLayout;
  private contentBindGroup: GPUBindGroup | null = null;
  private contentBuffer: GPUBuffer | null = null;
  private contentCapacity = 0;
  /** Content records per layer, [start, count]: layer 0's first. */
  private contentRanges: [number, number][] = [
    [0, 0],
    [0, 0],
  ];
  private atlas: SymbolAtlas | null = null;
  private atlasRequest = 0;
  /** Group-buffer ranges per layer. */
  // Two objects, mutated in place by every upload (never one shared constant).
  private readonly layerRecords: LayerRecords[] = [
    { singleStart: 0, singles: 0, unionStart: 0, unions: 0 },
    { singleStart: 0, singles: 0, unionStart: 0, unions: 0 },
  ];
  private readonly stage = new UploadStage();
  /** Something floats on layer 1 over something on layer 0 (a lone upper layer is drawn as layer 0). */
  private layered = false;
  /**
   * The frame under layer 1: content, layer-0 glasses and their symbols, with its own pyramid. It
   * is redone only when something in it changes, so an upper glass moving alone costs its own pass.
   */
  private lower: Pyramid | null = null;
  private lowerStale = true;
  private lowerDirty = true;
  private lowerPyramidDirty = true;
  /** The globals this frame, reused (written in place every frame). */
  private readonly globalsData = new ArrayBuffer(GLOBALS_BYTES);
  private readonly globalsF32 = new Float32Array(this.globalsData);
  private readonly globalsU32 = new Uint32Array(this.globalsData);
  /** LOWER_GLOBALS as they were when the composite under layer 1 was last checked. */
  private readonly lowerGlobals = new Uint32Array(GLOBALS_BYTES / 4).fill(0xffffffff);
  /** How many times the composite under layer 1 was rendered (tests: moving the upper glass alone reuses it). */
  lowerRenders = 0;
  /** Per source of the full-screen copy: the content, or the composite under layer 1. */
  private bgBindGroups: (GPUBindGroup | null)[] = [null, null];
  /** Per layer: the glass pass sampling that layer's backdrop pyramid. */
  private glassBindGroups: (GPUBindGroup | null)[] = [null, null];
  private surfaceBuffer: GPUBuffer | null = null;
  private surfaceCapacity = 0;
  private groupBuffer: GPUBuffer | null = null;
  private groupCapacity = 0;
  private background: GPUTexture | null = null;

  private source: BackgroundSource | null = null;
  private groups: GlassGroup[] = [];
  private tables: { inputs: Float64Array; data: Float32Array<ArrayBuffer>; stats: GuardStats }[] = [];
  private tableBuffer: GPUBuffer | null = null;
  private surfacesDirty = true;
  private sizeDirty = true;
  private sourceChanged = true;
  private dpr = 1;
  private width = 1;
  private height = 1;
  private raf = 0;
  private lastTick = 0;
  private destroyed = false;
  private readonly unsubscribe: () => void;
  private readonly resizeObserver: ResizeObserver;
  private dprQuery: MediaQueryList | null = null;
  private readonly onDprChange = (): void => {
    this.watchDpr();
    this.markResized();
  };
  private readonly markResized = (): void => {
    this.sizeDirty = true;
    this.requestFrame();
  };
  private pendingReadback: ((pixels: Pixels) => void) | null = null;

  readonly canvas: HTMLCanvasElement;
  readonly gpu: GpuContext;
  private readonly readback: boolean;

  constructor(canvas: HTMLCanvasElement, gpu: GpuContext, options: RendererOptions = {}) {
    this.canvas = canvas;
    this.gpu = gpu;
    this.readback = options.readback ?? false;
    this.offscreen = options.offscreen ?? null;
    this.device = gpu.device;
    this.timer = gpu.info.timestamps ? new GpuTimer(this.device) : null;
    this.pool = new TexturePool(this.device);
    if (this.offscreen) {
      this.context = null;
      this.viewFormat = "rgba8unorm-srgb";
    } else {
      const context = canvas.getContext("webgpu");
      if (!context) throw new Error("canvas sem contexto webgpu");
      this.context = context;
      this.viewFormat = srgbViewOf(gpu.canvasFormat);
    }

    this.globals = this.device.createBuffer({
      size: GLOBALS_BYTES,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      label: "lab.globals",
    });
    this.sampler = this.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge",
      label: "lab.linear",
    });
    this.bgLayout = this.device.createBindGroupLayout({
      label: "lab.background.layout",
      entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } }],
    });
    this.pyramidLayout = this.device.createBindGroupLayout({
      label: "lab.pyramid.layout",
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: "filtering" } },
      ],
    });
    this.glassLayout = this.device.createBindGroupLayout({
      label: "lab.glass.layout",
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } },
        { binding: 1, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: "filtering" } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "read-only-storage" } },
        { binding: 5, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "read-only-storage" } },
        { binding: 6, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "read-only-storage" } },
      ],
    });
    this.metricsLayout = this.device.createBindGroupLayout({
      label: "lab.metrics.layout",
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, texture: { sampleType: "float" } },
        { binding: 3, visibility: GPUShaderStage.COMPUTE, sampler: { type: "filtering" } },
        { binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
        { binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
      ],
    });
    this.contentLayout = this.device.createBindGroupLayout({
      label: "lab.content.layout",
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: "uniform" } },
        { binding: 1, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: "filtering" } },
      ],
    });
    this.layerUniforms = [0, 1].map((layer) => {
      const buffer = this.device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM, mappedAtCreation: true, label: `lab.layer${layer}` });
      new Uint32Array(buffer.getMappedRange()).set([layer, 0, 0, 0]);
      buffer.unmap();
      return buffer;
    });

    this.graph
      .add(this.pyramidPass())
      .add(this.metricsPass(0))
      .add(this.lowerPass())
      .add(this.lowerPyramidPass())
      .add(this.metricsPass(1))
      .add(this.backgroundPass())
      .add(this.glassPass());

    this.device.lost.then((info) => {
      if (this.destroyed) return;
      this.destroyed = true;
      cancelAnimationFrame(this.raf);
      this.onLost?.(info);
    });
    this.unsubscribe = onShaderChange((sources) => void this.reloadShaders(sources));
    this.resizeObserver = new ResizeObserver(this.markResized);
    this.resizeObserver.observe(canvas);
    // The CSS size does not change when the window moves to a screen of another pixel ratio, nor
    // on pinch zoom: watch both, or the canvas stays at the old resolution (blurry or oversized).
    this.watchDpr();
    window.visualViewport?.addEventListener("resize", this.markResized);
  }

  /** A media query matches one ratio; re-arm it for the new one after each change. */
  private watchDpr(): void {
    this.dprQuery?.removeEventListener("change", this.onDprChange);
    this.dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    this.dprQuery.addEventListener("change", this.onDprChange);
  }

  /** Compiles the shaders; resolves to an error message or null. */
  async init(): Promise<string | null> {
    return this.reloadShaders(shaderSources());
  }

  get devicePixelRatio(): number {
    return this.dpr;
  }

  get resolution(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  get surfaceCount(): number {
    return this.groups.reduce((n, g) => n + g.surfaces.length, 0);
  }

  get groupCount(): number {
    return this.groups.length;
  }

  /** Layers drawn: 2 when something floats over something else. */
  get layerCount(): number {
    return this.layered ? 2 : 1;
  }

  get guardStats(): readonly GuardStats[] {
    return this.tables.map((t) => t.stats);
  }

  get gpuBytes(): number {
    return (
      this.pool.bytes +
      this.surfaceCapacity * (SURFACE_FLOATS + TABLE_FLOATS) * 4 +
      this.groupCapacity * GROUP_FLOATS * 4 +
      this.contentCapacity * CONTENT_FLOATS * 4 +
      (this.atlas ? (this.atlas.texture.width * this.atlas.texture.height * 4 * 4) / 3 : 0) +
      GLOBALS_BYTES
    );
  }

  setSource(source: BackgroundSource): void {
    if (this.source !== source) this.source?.dispose();
    this.source = source;
    source.onInvalidate = () => this.invalidateSource();
    this.sourceChanged = true;
    this.requestFrame();
  }

  /** The source repainted itself (new image, new scene parameters). */
  invalidateSource(): void {
    this.sourceChanged = true;
    this.requestFrame();
  }

  /** Each surface on its own: nothing merges. */
  setSurfaces(surfaces: GlassSurface[]): void {
    this.setGroups(surfaces.map((surface) => ({ spacing: 0, surfaces: [surface] })));
  }

  setGroups(groups: GlassGroup[]): void {
    this.groups = groups;
    this.surfacesDirty = true;
    this.requestFrame();
  }

  /**
   * The symbols surfaces may carry (GlassContent.symbol indexes this list), as SVG markup drawn in
   * currentColor. Rasterized once into an atlas; content shows up when it is ready.
   */
  setSymbols(svgs: readonly string[]): Promise<void> {
    const request = ++this.atlasRequest;
    return buildSymbolAtlas(this.device, svgs).then((atlas) => {
      if (this.destroyed || request !== this.atlasRequest) {
        atlas.texture.destroy();
        return;
      }
      this.atlas?.texture.destroy();
      this.atlas = atlas;
      this.contentBindGroup = null;
      this.surfacesChanged();
    });
  }

  /** Call after mutating a surface or a group in place (drag, slider, a member added). */
  surfacesChanged(): void {
    this.surfacesDirty = true;
    this.requestFrame();
  }

  setQuality(tier: QualityTier): void {
    this.quality = tier;
    this.sizeDirty = true;
    this.requestFrame();
  }

  requestFrame(): void {
    if (this.destroyed || this.raf) return;
    this.raf = requestAnimationFrame(this.tick);
  }

  /** Render the next frame and read it back (tests). Requires `readback` at construction. */
  capture(): Promise<Pixels> {
    if (!this.readback) return Promise.reject(new Error("renderer criado sem readback"));
    return new Promise((resolve) => {
      this.pendingReadback = resolve;
      this.requestFrame();
    });
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.unsubscribe();
    this.resizeObserver.disconnect();
    this.dprQuery?.removeEventListener("change", this.onDprChange);
    window.visualViewport?.removeEventListener("resize", this.markResized);
    this.source?.dispose();
    this.pool.destroy();
    this.timer?.destroy();
    this.globals.destroy();
    this.surfaceBuffer?.destroy();
    this.tableBuffer?.destroy();
    this.groupBuffer?.destroy();
    this.contentBuffer?.destroy();
    this.atlas?.texture.destroy();
    for (const u of this.layerUniforms) u.destroy();
    this.metricsBuffer?.destroy();
    for (const slot of this.metricsSlots) slot.buffer.destroy();
    this.context?.unconfigure();
  }

  private readonly tick = (now: number): void => {
    this.raf = 0;
    if (this.destroyed) return;
    this.onBeforeFrame?.(now);
    if (this.continuous && this.lastTick > 0) this.interval.push(now - this.lastTick);
    this.lastTick = this.continuous ? now : 0;
    const start = performance.now();
    void this.renderFrame(now);
    this.cpu.push(performance.now() - start);
    if (this.adaptive && this.timer) {
      const tier = this.adaptive.sample(this.timer.total, now);
      if (tier !== this.quality) {
        this.setQuality(tier);
        // The window still holds the old tier's frames: start the averages over.
        this.timer.reset();
      }
    }
    this.onFrame?.();
    if (this.continuous) this.requestFrame();
  };

  private renderFrame(now: number): Promise<void> | null {
    if (!this.bgPipeline || !this.glassPipeline || !this.source) return null;
    if (this.sizeDirty) this.resize();
    if (!this.background) return null;

    const sizeChanged = this.sourceChanged;
    this.sourceChanged = false;
    if (this.source.update(this.device, this.background, sizeChanged)) {
      this.pyramidDirty = true;
      this.metricsDirty = true;
      this.lowerDirty = true;
    }
    if (this.forcePyramid) this.metricsDirty = this.lowerDirty = true;
    if (this.surfacesDirty) this.uploadSurfaces();
    if (this.lowerStale) this.ensureLower();

    const f = this.globalsF32;
    const u = this.globalsU32;
    f[0] = this.width;
    f[1] = this.height;
    f[2] = 1 / this.width;
    f[3] = 1 / this.height;
    f[4] = this.dpr;
    f[5] = now / 1000;
    u[6] = this.debugView;
    f[7] = EDGE_START_PX;
    u[8] = TIER_FEATURES[this.quality];
    const touches = Math.min(this.touchLights.length, MAX_TOUCH_LIGHTS);
    u[9] = touches;
    for (let i = 0; i < MAX_TOUCH_LIGHTS; i++) {
      const t = this.touchLights[i];
      const o = 12 + i * 4;
      // Unused slots are zeroed, so comparing the words below is comparing what is drawn.
      f[o] = i < touches && t ? t.x * this.dpr : 0;
      f[o + 1] = i < touches && t ? t.y * this.dpr : 0;
      f[o + 2] = i < touches && t ? Math.max(t.radius * this.dpr, 1e-3) : 0;
      f[o + 3] = i < touches && t ? t.intensity : 0;
    }
    this.device.queue.writeBuffer(this.globals, 0, this.globalsData);
    // What the shaders draw differently also redraws the composite under layer 1: the inspector
    // view, the tier's features, the touch lights (a glow lights the glasses there too). Not the
    // time, which changes every frame and draws nothing different.
    for (const k of LOWER_GLOBALS) {
      if (u[k] !== this.lowerGlobals[k]) {
        this.lowerGlobals[k] = u[k]!;
        this.lowerDirty = true;
      }
    }

    const texture = this.context ? this.context.getCurrentTexture() : this.frameTexture;
    if (!texture) return null;
    this.graph.run(this.device, texture.createView({ format: this.viewFormat }), this.timer);
    this.collectMetrics();

    const resolve = this.pendingReadback;
    if (!resolve) return null;
    this.pendingReadback = null;
    return this.readPixels(texture).then(resolve);
  }

  private resize(): void {
    this.sizeDirty = false;
    const cssWidth = this.offscreen?.width ?? this.canvas.clientWidth;
    const cssHeight = this.offscreen?.height ?? this.canvas.clientHeight;
    this.dpr = this.offscreen ? 1 : effectivePixelRatio(cssWidth, cssHeight, this.quality, this.gpu.info.maxTexture);
    const width = Math.max(1, Math.round(cssWidth * this.dpr));
    const height = Math.max(1, Math.round(cssHeight * this.dpr));
    this.width = width;
    this.height = height;
    if (this.context) {
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      this.context.configure({
        device: this.device,
        format: this.gpu.canvasFormat,
        viewFormats: [this.viewFormat],
        alphaMode: "opaque",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | (this.readback ? GPUTextureUsage.COPY_SRC : 0),
      });
    } else {
      this.frameTexture = this.pool.get("frame", {
        width,
        height,
        format: "rgba8unorm-srgb",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        label: "lab.frame",
      }).texture;
    }
    const mipLevelCount = Math.min(PYRAMID_LEVELS, Math.floor(Math.log2(Math.max(width, height))) + 1);
    const { texture, created } = this.pool.get("background", {
      width,
      height,
      format: "rgba8unorm-srgb",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
      mipLevelCount,
      label: "lab.background",
    });
    if (created) {
      this.background = texture;
      this.bgPyramid = this.makePyramid(texture, "background");
      this.sourceChanged = true;
      this.pyramidDirty = true;
      this.bgBindGroups[0] = null;
      this.glassBindGroups[0] = null;
      this.metricsBindGroups[0] = null;
    }
    this.surfacesDirty = true;
    this.lowerStale = true;
  }

  /** Views of every level and the bind groups that downsample each from the one above. */
  private makePyramid(texture: GPUTexture, label: string): Pyramid {
    const levels = Array.from({ length: texture.mipLevelCount }, (_, i) => texture.createView({ baseMipLevel: i, mipLevelCount: 1, label: `lab.${label}.${i}` }));
    return {
      texture,
      levels,
      sources: levels.slice(0, -1).map((view, i) =>
        this.device.createBindGroup({
          layout: this.pyramidLayout,
          entries: [
            { binding: 0, resource: view },
            { binding: 1, resource: this.sampler },
          ],
          label: `lab.${label}.pyramid.${i + 1}`,
        }),
      ),
      view: texture.createView({ label: `lab.${label}` }),
    };
  }

  /** The composite under layer 1 exists exactly while something floats over something else. */
  private ensureLower(): void {
    this.lowerStale = false;
    const drop = () => {
      this.bgBindGroups[1] = this.glassBindGroups[1] = this.metricsBindGroups[1] = null;
      this.lowerDirty = true;
    };
    if (!this.layered || !this.background) {
      if (this.lower) {
        this.pool.release("lower");
        this.lower = null;
        drop();
      }
      return;
    }
    const { texture, created } = this.pool.get("lower", {
      width: this.width,
      height: this.height,
      // The canvas's own format, so the background and glass pipelines draw into it unchanged.
      format: this.viewFormat,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
      mipLevelCount: this.background.mipLevelCount,
      label: "lab.lower",
    });
    if (created || !this.lower) {
      this.lower = this.makePyramid(texture, "lower");
      drop();
    }
  }

  /**
   * Packs surfaces, draw records and symbols and uploads them. Runs every frame something moves,
   * so in steady state it allocates nothing: the CPU-side copies are reused, in two alternating
   * sides so this frame's layer 0 can be compared with the last one's in place (the composite
   * under layer 1 is reused while they match).
   */
  private uploadSurfaces(): void {
    this.surfacesDirty = false;
    const dpr = this.dpr;
    // A lone upper layer has nothing under it to refract: it is drawn as layer 0, for free.
    let has0 = false;
    let has1 = false;
    let count = 0;
    for (const g of this.groups) {
      if (g.surfaces.length === 0) continue;
      if ((g.layer ?? 0) === 1) has1 = true;
      else has0 = true;
      count += g.surfaces.length;
    }
    const layered = has0 && has1;
    const layerOf = (g: GlassGroup): 0 | 1 => (layered ? (g.layer ?? 0) : 0);
    if (count > this.surfaceCapacity || !this.surfaceBuffer || !this.tableBuffer) this.growSurfaces(count);
    const stage = this.stage.flip();
    const data = stage.surfaces;
    const layers = stage.layers;

    let lowerTables = false;
    this.tables.length = count;
    let i = 0;
    for (const g of this.groups) {
      const layer = layerOf(g);
      for (const { shape, material, appearance, content } of g.surfaces) {
        const cached = this.tables[i];
        if (!cached || tableInputsChanged(cached.inputs, shape, material, dpr, this.guardEnabled)) {
          const table = buildRadialTable(material, shape, dpr, this.guardEnabled);
          const inputs = cached?.inputs ?? new Float64Array(TABLE_INPUTS);
          if (!cached) tableInputsChanged(inputs, shape, material, dpr, this.guardEnabled);
          this.tables[i] = { inputs, ...table };
          this.device.queue.writeBuffer(this.tableBuffer!, i * TABLE_FLOATS * 4, table.data);
          if (layer === 0) lowerTables = true;
        }
        // Clear under a symbol gets its dimming layer (CLEAR_DIM); nothing else is dimmed.
        const dim = material.variant === "clear" && content && content.color[3] > 0 ? CLEAR_DIM : 0;
        packSurface(data, i * SURFACE_FLOATS, shape, material, dpr, appearance, layer, dim);
        layers[i] = layer;
        i++;
      }
    }
    this.metricsDirty = true;
    this.device.queue.writeBuffer(this.surfaceBuffer!, 0, data, 0, Math.max(count, 1) * SURFACE_FLOATS);

    // Records per layer, layer 0's first; within a layer, groups that cannot merge (one member, or
    // spacing 0) are drawn as lone surfaces by the lean pipeline, then the merge groups.
    const merges = (g: GlassGroup) => g.surfaces.length > 1 && g.spacing > 0;
    let records = 0;
    for (const g of this.groups) records += merges(g) ? 1 : g.surfaces.length;
    if (records > this.groupCapacity || !this.groupBuffer) this.growGroups(records);
    const groupStage = this.stage.groups(records);
    let r = 0;
    for (const layer of [0, 1] as const) {
      const ranges = this.layerRecords[layer]!;
      ranges.singleStart = r;
      let start = 0;
      for (const g of this.groups) {
        if (layerOf(g) === layer && g.surfaces.length > 0 && !merges(g)) {
          for (let j = 0; j < g.surfaces.length; j++) this.packRecord(groupStage, r++, start + j, g.surfaces, j, 1, 0);
        }
        start += g.surfaces.length;
      }
      ranges.singles = r - ranges.singleStart;
      ranges.unionStart = r;
      start = 0;
      for (const g of this.groups) {
        if (layerOf(g) === layer && merges(g)) this.packRecord(groupStage, r++, start, g.surfaces, 0, g.surfaces.length, (g.spacing / 2) * dpr);
        start += g.surfaces.length;
      }
      ranges.unions = r - ranges.unionStart;
    }
    this.device.queue.writeBuffer(this.groupBuffer!, 0, groupStage.f32, 0, Math.max(records, 1) * GROUP_FLOATS);

    this.uploadContent(layerOf);

    // The composite under layer 1 is reused until something in layer 0 changes: what layer 0
    // uploaded now against what it uploaded last frame, compared in place.
    if (layered !== this.layered) {
      this.layered = layered;
      this.lowerStale = true;
      this.lowerDirty = true;
    }
    if (layered) {
      // Always compared, never short-circuited: the comparison also records this frame for the next.
      const changed = this.stage.lowerChanged(count, this.layerRecords[0]!, this.contentRanges[0]![1]);
      if (changed || lowerTables) this.lowerDirty = true;
    }
  }

  private growSurfaces(count: number): void {
    this.surfaceBuffer?.destroy();
    this.tableBuffer?.destroy();
    this.surfaceCapacity = Math.max(4, 2 ** Math.ceil(Math.log2(Math.max(count, 1))));
    this.surfaceBuffer = this.device.createBuffer({
      size: this.surfaceCapacity * SURFACE_FLOATS * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: "lab.surfaces",
    });
    this.tableBuffer = this.device.createBuffer({
      size: this.surfaceCapacity * TABLE_FLOATS * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: "lab.radial-tables",
    });
    this.metricsBuffer?.destroy();
    for (const slot of this.metricsSlots) slot.buffer.destroy();
    this.metricsBuffer = this.device.createBuffer({
      size: this.surfaceCapacity * 16,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      label: "lab.backdrop",
    });
    this.metricsSlots = Array.from({ length: METRICS_RING }, (_, i) => ({
      buffer: this.device.createBuffer({
        size: this.surfaceCapacity * 16,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        label: `lab.backdrop.read${i}`,
      }),
      busy: false,
      count: 0,
    }));
    this.metricsBindGroups = [null, null];
    this.glassBindGroups = [null, null];
    this.tables = [];
    this.stage.reserveSurfaces(this.surfaceCapacity);
  }

  private growGroups(records: number): void {
    this.groupBuffer?.destroy();
    this.groupCapacity = Math.max(4, 2 ** Math.ceil(Math.log2(Math.max(records, 1))));
    this.groupBuffer = this.device.createBuffer({
      size: this.groupCapacity * GROUP_FLOATS * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      label: "lab.groups",
    });
    this.glassBindGroups = [null, null];
  }

  /** Draw record `index`: members [from, from + n) of `surfaces`, the first at flat index `start`. */
  private packRecord(stage: { f32: Float32Array; u32: Uint32Array }, index: number, start: number, surfaces: GlassSurface[], from: number, n: number, k: number): void {
    const dpr = this.dpr;
    // The union sinks up to k below the nearest member where two meet, 2k where three do — and
    // only between members, so the margin is per merge, not per member.
    let shadowReach = 0;
    for (let m = from; m < from + n; m++) {
      const { material } = surfaces[m]!;
      if (material.shadow > 0) {
        const shadow = shadowGeometry(material.gap * dpr, dpr);
        shadowReach = Math.max(shadowReach, shadow.offsetY + shadow.sigma * 3);
      }
    }
    // `reach` is tested against a lower bound of the union, which already includes the sink;
    // the rectangle is drawn around the boxes, so it needs the sink as margin too.
    const reach = BOUNDS_MARGIN + shadowReach;
    const margin = reach + k * Math.min(n - 1, 2);
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (let m = from; m < from + n; m++) {
      const { shape } = surfaces[m]!;
      const [ex, ey] = shapeExtent(shape);
      x0 = Math.min(x0, (shape.cx - ex) * dpr - margin);
      y0 = Math.min(y0, (shape.cy - ey) * dpr - margin);
      x1 = Math.max(x1, (shape.cx + ex) * dpr + margin);
      y1 = Math.max(y1, (shape.cy + ey) * dpr + margin);
    }
    const o = index * GROUP_FLOATS;
    const { f32, u32 } = stage;
    f32[o] = x0;
    f32[o + 1] = y0;
    f32[o + 2] = x1;
    f32[o + 3] = y1;
    u32[o + 4] = start;
    u32[o + 5] = n;
    f32[o + 6] = k;
    f32[o + 7] = reach;
  }

  /**
   * Symbols on the glasses, layer 0's first. Placed from the shape: centre, rotation and press
   * scale (not the stretch: what sits on a glass does not smear with it).
   */
  private uploadContent(layerOf: (g: GlassGroup) => 0 | 1): void {
    const atlas = this.atlas;
    const dpr = this.dpr;
    let total = 0;
    if (atlas) for (const g of this.groups) for (const s of g.surfaces) if (drawable(s.content, atlas)) total++;
    const out = this.stage.content(total);
    let n = 0;
    const counts = [0, 0];
    if (atlas) {
      for (const layer of [0, 1] as const) {
        for (const g of this.groups) {
          if (layerOf(g) !== layer) continue;
          for (const { shape, content } of g.surfaces) {
            if (!content || !drawable(content, atlas)) continue;
            const half = (content.size * (shape.scale ?? 1) * dpr) / 2;
            const o = n * CONTENT_FLOATS;
            out[o] = shape.cx * dpr;
            out[o + 1] = shape.cy * dpr;
            out[o + 2] = half;
            // A slight bias toward the larger raster keeps strokes crisp between two levels.
            out[o + 3] = Math.min(Math.max(Math.log2(SYMBOL_CELL / (2 * half)) - 0.25, 0), SYMBOL_LEVELS - 1);
            out[o + 4] = Math.cos(shape.rotation);
            out[o + 5] = Math.sin(shape.rotation);
            out[o + 6] = content.symbol;
            out[o + 7] = atlas.cells;
            out[o + 8] = srgbToLinear(content.color[0]);
            out[o + 9] = srgbToLinear(content.color[1]);
            out[o + 10] = srgbToLinear(content.color[2]);
            out[o + 11] = content.color[3];
            n++;
            counts[layer]!++;
          }
        }
      }
    }
    const r0 = this.contentRanges[0]!;
    const r1 = this.contentRanges[1]!;
    r0[0] = 0;
    r0[1] = counts[0]!;
    r1[0] = counts[0]!;
    r1[1] = counts[1]!;
    if (n === 0) return;
    if (n > this.contentCapacity || !this.contentBuffer) {
      this.contentBuffer?.destroy();
      this.contentCapacity = Math.max(4, 2 ** Math.ceil(Math.log2(n)));
      this.contentBuffer = this.device.createBuffer({
        size: this.contentCapacity * CONTENT_FLOATS * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        label: "lab.content",
      });
      this.contentBindGroup = null;
    }
    this.device.queue.writeBuffer(this.contentBuffer, 0, out, 0, n * CONTENT_FLOATS);
  }

  /** Rebuilds the mip chain of the content, only when the content changed. */
  private pyramidPass(): Pass {
    return {
      name: "pirâmide",
      enabled: () => (this.pyramidDirty || this.forcePyramid) && this.bgPyramid !== null && this.bgPyramid.levels.length > 1,
      encode: (ctx: FrameContext, timestampWrites) => {
        if (!this.pyramidPipeline || !this.bgPyramid) return;
        this.pyramidDirty = false;
        this.encodePyramid(ctx, this.bgPyramid, this.pyramidPipeline, timestampWrites);
      },
    };
  }

  /** Each level from the one above; the span covers the whole chain. */
  private encodePyramid(ctx: FrameContext, pyramid: Pyramid, pipeline: GPURenderPipeline, timestampWrites: GPURenderPassTimestampWrites | undefined): void {
    const levels = pyramid.levels.length;
    for (let level = 1; level < levels; level++) {
      const first = level === 1;
      const last = level === levels - 1;
      const writes: GPURenderPassTimestampWrites | undefined = timestampWrites && {
        querySet: timestampWrites.querySet,
        ...(first ? { beginningOfPassWriteIndex: timestampWrites.beginningOfPassWriteIndex } : {}),
        ...(last ? { endOfPassWriteIndex: timestampWrites.endOfPassWriteIndex } : {}),
      };
      const pass = ctx.encoder.beginRenderPass({
        label: `pirâmide ${level}`,
        colorAttachments: [{ view: pyramid.levels[level]!, loadOp: "clear", storeOp: "store", clearValue: [0, 0, 0, 1] }],
        ...(writes && (first || last) ? { timestampWrites: writes } : {}),
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, pyramid.sources[level - 1]!);
      pass.draw(3);
      pass.end();
    }
  }

  /**
   * Backdrop statistics under every surface of `layer`, from that layer's fresh pyramid (the
   * content for layer 0, the composite below for layer 1); only when something changed. The last
   * layer's dispatch copies the results out for the CPU.
   */
  private metricsPass(layer: 0 | 1): Pass {
    return {
      name: layer === 0 ? "métricas" : "métricas da camada",
      enabled: () => this.metricsDirty && (layer === 0 || this.lower !== null) && this.surfaceCount > 0 && this.metricsPipeline !== null && this.background !== null,
      encode: (ctx: FrameContext, timestampWrites) => {
        const backdrop = layer === 0 ? this.bgPyramid : this.lower;
        if (!this.metricsPipeline || !backdrop || !this.surfaceBuffer || !this.metricsBuffer) return;
        const bind = (this.metricsBindGroups[layer] ??= this.device.createBindGroup({
          layout: this.metricsLayout,
          entries: [
            { binding: 0, resource: { buffer: this.globals } },
            { binding: 1, resource: { buffer: this.surfaceBuffer } },
            { binding: 2, resource: backdrop.view },
            { binding: 3, resource: this.sampler },
            { binding: 7, resource: { buffer: this.metricsBuffer } },
            { binding: 8, resource: { buffer: this.layerUniforms[layer]! } },
          ],
          label: `lab.metrics.bind${layer}`,
        }));
        const count = this.surfaceCount;
        const pass = ctx.encoder.beginComputePass({ label: "métricas", ...(timestampWrites ? { timestampWrites } : {}) });
        pass.setPipeline(this.metricsPipeline);
        pass.setBindGroup(0, bind);
        pass.dispatchWorkgroups(count);
        pass.end();
        if (layer === 0 && this.lower) return;
        this.metricsDirty = false;
        const slot = this.metricsSlots.find((x) => !x.busy) ?? null;
        if (slot) {
          ctx.encoder.copyBufferToBuffer(this.metricsBuffer, 0, slot.buffer, 0, count * 16);
          slot.busy = true;
          slot.count = count;
          this.metricsSlot = slot;
        } else {
          // Every readback buffer is in flight: measure again next frame.
          this.metricsDirty = true;
        }
      },
    };
  }

  /** The frame under layer 1: content, layer-0 glasses, their symbols. Only when one of them changed. */
  private lowerPass(): Pass {
    return {
      name: "camada de baixo",
      enabled: () => this.lower !== null && this.lowerDirty,
      encode: (ctx: FrameContext, timestampWrites) => {
        const lower = this.lower;
        if (!lower) return;
        this.lowerDirty = false;
        this.lowerPyramidDirty = true;
        this.lowerRenders++;
        const pass = ctx.encoder.beginRenderPass({
          label: "camada de baixo",
          colorAttachments: [{ view: lower.levels[0]!, loadOp: "clear", storeOp: "store", clearValue: [0, 0, 0, 1] }],
          ...(timestampWrites ? { timestampWrites } : {}),
        });
        this.drawCopy(pass, 0);
        this.drawLayer(pass, 0);
        pass.end();
      },
    };
  }

  private lowerPyramidPass(): Pass {
    return {
      name: "pirâmide da camada",
      enabled: () => this.lower !== null && this.lowerPyramidDirty && this.lower.levels.length > 1,
      encode: (ctx: FrameContext, timestampWrites) => {
        if (!this.lower || !this.lowerPyramidPipeline) return;
        this.lowerPyramidDirty = false;
        this.encodePyramid(ctx, this.lower, this.lowerPyramidPipeline, timestampWrites);
      },
    };
  }

  /** Full-screen copy of the content (source 0) or of the composite under layer 1 (source 1). */
  private drawCopy(pass: GPURenderPassEncoder, from: 0 | 1): void {
    const pyramid = from === 0 ? this.bgPyramid : this.lower;
    if (!this.bgPipeline || !pyramid) return;
    const bind = (this.bgBindGroups[from] ??= this.device.createBindGroup({
      layout: this.bgLayout,
      entries: [{ binding: 0, resource: pyramid.levels[0]! }],
      label: `lab.background.bind${from}`,
    }));
    pass.setPipeline(this.bgPipeline);
    pass.setBindGroup(0, bind);
    pass.draw(3);
  }

  /** The glasses of one layer, sampling that layer's backdrop, then the symbols on them. */
  private drawLayer(pass: GPURenderPassEncoder, layer: 0 | 1): void {
    const backdrop = layer === 0 ? this.bgPyramid : this.lower;
    if (!this.glassPipeline || !backdrop || !this.surfaceBuffer || !this.tableBuffer || !this.groupBuffer || !this.metricsBuffer) return;
    const records = this.layerRecords[layer]!;
    const bind = (this.glassBindGroups[layer] ??= this.device.createBindGroup({
      layout: this.glassLayout,
      entries: [
        { binding: 0, resource: { buffer: this.globals } },
        { binding: 1, resource: { buffer: this.surfaceBuffer } },
        { binding: 2, resource: backdrop.view },
        { binding: 3, resource: this.sampler },
        { binding: 4, resource: { buffer: this.tableBuffer } },
        { binding: 5, resource: { buffer: this.groupBuffer } },
        { binding: 6, resource: { buffer: this.metricsBuffer } },
      ],
      label: `lab.glass.bind${layer}`,
    }));
    pass.setBindGroup(0, bind);
    if (records.singles > 0) {
      pass.setPipeline(this.glassPipeline);
      pass.draw(6, records.singles, 0, records.singleStart);
    }
    if (records.unions > 0 && this.unionPipeline) {
      pass.setPipeline(this.unionPipeline);
      pass.draw(6, records.unions, 0, records.unionStart);
    }
    // An inspector view shows a quantity of the glass; a symbol over it would hide it.
    const [start, count] = this.contentRanges[layer]!;
    if (count === 0 || this.debugView !== 0 || !this.contentPipeline || !this.contentBuffer || !this.atlas) return;
    const content = (this.contentBindGroup ??= this.device.createBindGroup({
      layout: this.contentLayout,
      entries: [
        { binding: 0, resource: { buffer: this.globals } },
        { binding: 1, resource: { buffer: this.contentBuffer } },
        { binding: 2, resource: this.atlas.texture.createView() },
        { binding: 3, resource: this.sampler },
      ],
      label: "lab.content.bind",
    }));
    pass.setPipeline(this.contentPipeline);
    pass.setBindGroup(0, content);
    pass.draw(6, count, 0, start);
  }

  /** After submit: map the metrics copied this frame, if any. */
  private collectMetrics(): void {
    const slot = this.metricsSlot;
    this.metricsSlot = null;
    if (!slot) return;
    slot.buffer
      .mapAsync(GPUMapMode.READ, 0, slot.count * 16)
      .then(() => {
        const stats = new Float32Array(slot.buffer.getMappedRange(0, slot.count * 16).slice(0));
        slot.buffer.unmap();
        slot.busy = false;
        this.backdrop = stats;
        this.onBackdrop?.(stats);
        const waiters = this.metricsWaiters;
        this.metricsWaiters = [];
        for (const w of waiters) w(stats);
      })
      .catch(() => {
        slot.busy = false;
      });
  }

  /** Measure the backdrop of the current surfaces and resolve with the statistics (tests). */
  readBackdrop(): Promise<Float32Array> {
    return new Promise((resolve) => {
      this.metricsWaiters.push(resolve);
      this.metricsDirty = true;
      this.requestFrame();
    });
  }

  private backgroundPass(): Pass {
    return {
      name: "fundo",
      enabled: () => true,
      encode: (ctx: FrameContext, timestampWrites) => {
        const pass = ctx.encoder.beginRenderPass({
          label: "fundo",
          colorAttachments: [{ view: ctx.target, loadOp: "clear", storeOp: "store", clearValue: [0, 0, 0, 1] }],
          ...(timestampWrites ? { timestampWrites } : {}),
        });
        this.drawCopy(pass, this.lower ? 1 : 0);
        pass.end();
      },
    };
  }

  /** The top layer's glasses and symbols (the only layer, unless something floats). */
  private glassPass(): Pass {
    return {
      name: "vidro",
      enabled: () => this.groups.length > 0,
      encode: (ctx: FrameContext, timestampWrites) => {
        const pass = ctx.encoder.beginRenderPass({
          label: "vidro",
          colorAttachments: [{ view: ctx.target, loadOp: "load", storeOp: "store" }],
          ...(timestampWrites ? { timestampWrites } : {}),
        });
        this.drawLayer(pass, this.lower ? 1 : 0);
        pass.end();
      },
    };
  }

  private async reloadShaders(sources: ShaderSources): Promise<string | null> {
    const device = this.device;
    device.pushErrorScope("validation");
    const bgModule = device.createShaderModule({ code: sources.background, label: "background.wgsl" });
    const glassModule = device.createShaderModule({ code: sources.glass, label: "glass.wgsl" });
    const pyramidModule = device.createShaderModule({ code: sources.pyramid, label: "pyramid.wgsl" });
    const contentModule = device.createShaderModule({ code: sources.content, label: "content.wgsl" });
    const messages: string[] = [];
    for (const [name, module] of [
      ["background.wgsl", bgModule],
      ["glass.wgsl", glassModule],
      ["pyramid.wgsl", pyramidModule],
      ["content.wgsl", contentModule],
    ] as const) {
      const info = await module.getCompilationInfo();
      for (const m of info.messages) {
        if (m.type === "error") messages.push(`${name}:${m.lineNum}:${m.linePos} ${m.message}`);
      }
    }
    if (messages.length > 0) {
      await device.popErrorScope();
      const text = messages.join("\n");
      this.onShaderError?.(text);
      return text;
    }
    const target: GPUColorTargetState = { format: this.viewFormat };
    const bg = device.createRenderPipeline({
      label: "background",
      layout: device.createPipelineLayout({ bindGroupLayouts: [this.bgLayout] }),
      vertex: { module: bgModule, entryPoint: "vs_main" },
      fragment: { module: bgModule, entryPoint: "fs_main", targets: [target] },
      primitive: { topology: "triangle-list" },
    });
    const premultiplied: GPUColorTargetState = {
      format: this.viewFormat,
      blend: {
        color: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
        alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
      },
    };
    const glassLayout = device.createPipelineLayout({ bindGroupLayouts: [this.glassLayout] });
    const glassPipeline = (entryPoint: string) =>
      device.createRenderPipeline({
        label: `glass.${entryPoint}`,
        layout: glassLayout,
        vertex: { module: glassModule, entryPoint: "vs_main" },
        fragment: { module: glassModule, entryPoint, targets: [premultiplied] },
        primitive: { topology: "triangle-list" },
      });
    const glass = glassPipeline("fs_single");
    const union = glassPipeline("fs_union");
    const metrics = device.createComputePipeline({
      label: "glass.cs_metrics",
      layout: device.createPipelineLayout({ bindGroupLayouts: [this.metricsLayout] }),
      compute: { module: glassModule, entryPoint: "cs_metrics" },
    });
    const pyramidLayout = device.createPipelineLayout({ bindGroupLayouts: [this.pyramidLayout] });
    const pyramidFor = (format: GPUTextureFormat) =>
      device.createRenderPipeline({
        label: `pyramid.${format}`,
        layout: pyramidLayout,
        vertex: { module: pyramidModule, entryPoint: "vs_main" },
        fragment: { module: pyramidModule, entryPoint: "fs_main", targets: [{ format }] },
        primitive: { topology: "triangle-list" },
      });
    const pyramid = pyramidFor("rgba8unorm-srgb");
    const lowerPyramid = this.viewFormat === "rgba8unorm-srgb" ? pyramid : pyramidFor(this.viewFormat);
    const content = device.createRenderPipeline({
      label: "content",
      layout: device.createPipelineLayout({ bindGroupLayouts: [this.contentLayout] }),
      vertex: { module: contentModule, entryPoint: "vs_main" },
      fragment: { module: contentModule, entryPoint: "fs_main", targets: [premultiplied] },
      primitive: { topology: "triangle-list" },
    });
    const error = await device.popErrorScope();
    if (error) {
      this.onShaderError?.(error.message);
      return error.message;
    }
    this.bgPipeline = bg;
    this.glassPipeline = glass;
    this.unionPipeline = union;
    this.metricsPipeline = metrics;
    this.metricsDirty = true;
    this.pyramidPipeline = pyramid;
    this.lowerPyramidPipeline = lowerPyramid;
    this.contentPipeline = content;
    this.pyramidDirty = true;
    this.lowerDirty = true;
    this.onShaderError?.(null);
    this.requestFrame();
    return null;
  }

  private async readPixels(texture: GPUTexture): Promise<Pixels> {
    const { width, height } = texture;
    const bytesPerRow = Math.ceil((width * 4) / 256) * 256;
    const buffer = this.device.createBuffer({
      size: bytesPerRow * height,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      label: "lab.readback",
    });
    const encoder = this.device.createCommandEncoder({ label: "lab.readback" });
    encoder.copyTextureToBuffer({ texture }, { buffer, bytesPerRow }, [width, height]);
    this.device.queue.submit([encoder.finish()]);
    await buffer.mapAsync(GPUMapMode.READ);
    const raw = new Uint8Array(buffer.getMappedRange());
    const data = new Uint8Array(width * height * 4);
    const bgra = texture.format.startsWith("bgra");
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const s = y * bytesPerRow + x * 4;
        const d = (y * width + x) * 4;
        data[d] = raw[s + (bgra ? 2 : 0)]!;
        data[d + 1] = raw[s + 1]!;
        data[d + 2] = raw[s + (bgra ? 0 : 2)]!;
        data[d + 3] = raw[s + 3]!;
      }
    }
    buffer.unmap();
    buffer.destroy();
    return { width, height, data };
  }
}

/** What a radial table depends on; compared as numbers every upload (a string key cost 20× more). */
const TABLE_INPUTS = 10;

/** Whether the table stored for `inputs` is stale; refreshes `inputs` when it is. */
function tableInputsChanged(inputs: Float64Array, shape: Shape, m: GlassMaterial, dpr: number, guard: boolean): boolean {
  const radius = clampedRadius(shape);
  const minHalf = Math.min(shape.halfWidth, shape.halfHeight);
  const profile = PROFILE_INDEX[m.profile];
  const g = guard ? 1 : 0;
  if (
    inputs[0] === radius &&
    inputs[1] === minHalf &&
    inputs[2] === m.ior &&
    inputs[3] === m.abbe &&
    inputs[4] === m.thickness &&
    inputs[5] === m.gap &&
    inputs[6] === m.bevel &&
    inputs[7] === profile &&
    inputs[8] === dpr &&
    inputs[9] === g
  ) {
    return false;
  }
  inputs.set([radius, minHalf, m.ior, m.abbe, m.thickness, m.gap, m.bevel, profile, dpr, g]);
  return true;
}

/**
 * Device-pixel record of one surface (8 × vec4, see `Surface` in glass.wgsl). Derived values are
 * computed here once: absorption from tint and density, blur radius from roughness and the glass's
 * height, the key light direction, F0 from the ior, the shadow's offset and softness from the gap.
 */
function packSurface(
  out: Float32Array,
  o: number,
  shape: Shape,
  m: GlassMaterial,
  dpr: number,
  appearance: number | undefined,
  layer: 0 | 1,
  dim: number,
): void {
  // Written in place: building a 32-number array per surface per frame cost 3× as much.
  const { bevel } = deviceGeometry(m, shape, dpr);
  const angle = (m.lightAngle * Math.PI) / 180;
  const inv = invert(shapeMatrix(shape));
  const shadow = shadowGeometry(m.gap * dpr, dpr);
  out[o] = shape.cx * dpr;
  out[o + 1] = shape.cy * dpr;
  out[o + 2] = shape.halfWidth * dpr;
  out[o + 3] = shape.halfHeight * dpr;
  out[o + 4] = clampedRadius(shape) * dpr;
  out[o + 5] = shape.exponent;
  out[o + 6] = shadow.offsetY;
  out[o + 7] = shadow.sigma;
  out[o + 8] = bevel;
  out[o + 9] = m.thickness * dpr;
  out[o + 10] = m.gap * dpr;
  out[o + 11] = m.ior;
  out[o + 12] = m.roughness;
  out[o + 13] = m.edge;
  out[o + 14] = m.shadow;
  out[o + 15] = m.environment;
  for (let c = 0; c < 3; c++) out[o + 16 + c] = (m.density * -Math.log(Math.max(m.tint[c]!, 1e-3))) / (REFERENCE_PATH * dpr);
  out[o + 19] = m.light;
  out[o + 20] = Math.cos(angle);
  out[o + 21] = -Math.sin(angle);
  out[o + 22] = 1.6 * (m.thickness + m.gap + m.bevel * 0.5) * m.roughness ** 1.5 * dpr;
  out[o + 23] = ((m.ior - 1) / (m.ior + 1)) ** 2;
  out[o + 24] = inv[0];
  out[o + 25] = inv[1];
  out[o + 26] = inv[2];
  out[o + 27] = inv[3];
  out[o + 28] = m.variant === "regular" ? m.adapt : 0;
  out[o + 29] = appearance ?? -1;
  out[o + 30] = layer;
  out[o + 31] = dim;
}

/** A symbol the atlas can draw. */
function drawable(content: GlassContent | undefined, atlas: SymbolAtlas): boolean {
  return !!content && content.symbol >= 0 && content.symbol < atlas.cells && content.size > 0 && content.color[3] > 0;
}

/** sRGB transfer, decoded: the frame is lit and blended in linear light. */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

