import { srgbViewOf, type GpuContext } from "../gpu/device.ts";
import { REFERENCE_PATH, type GlassMaterial } from "../glass/material.ts";
import {
  buildRadialTable,
  deviceGeometry,
  EDGE_START_PX,
  shadowGeometry,
  TABLE_SAMPLES,
  TABLE_STRIDE,
  type GuardStats,
} from "../glass/optics.ts";
import { clampedRadius, invert, shapeExtent, shapeMatrix, type Shape } from "../glass/shape.ts";
import { onShaderChange, shaderSources, type ShaderSources } from "../shaders/index.ts";
import type { BackgroundSource } from "../sources/source.ts";
import { FrameGraph, type FrameContext, type Pass } from "./frame-graph.ts";
import { TexturePool } from "./pool.ts";
import { effectivePixelRatio, TIER_FEATURES, type QualityTier } from "./quality.ts";
import { GpuTimer, Series } from "./timer.ts";

export interface GlassSurface {
  shape: Shape;
  material: GlassMaterial;
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

const SURFACE_FLOATS = 28;
const GROUP_FLOATS = 8;
const TABLE_FLOATS = TABLE_SAMPLES * TABLE_STRIDE;
const GLOBALS_BYTES = 48;
/** Antialiasing band around the bounds of a group, device px. */
const BOUNDS_MARGIN = 2;

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
  private bgPipeline: GPURenderPipeline | null = null;
  private pyramidPipeline: GPURenderPipeline | null = null;
  private readonly pyramidLayout: GPUBindGroupLayout;
  private pyramidBindGroups: GPUBindGroup[] = [];
  private pyramidDirty = true;
  private glassPipeline: GPURenderPipeline | null = null;
  private unionPipeline: GPURenderPipeline | null = null;
  /** Records in the group buffer: lone surfaces first (fs_single), then merge groups (fs_union). */
  private singleRecords = 0;
  private unionRecords = 0;
  private bgBindGroup: GPUBindGroup | null = null;
  private glassBindGroup: GPUBindGroup | null = null;
  private surfaceBuffer: GPUBuffer | null = null;
  private surfaceCapacity = 0;
  private groupBuffer: GPUBuffer | null = null;
  private groupCapacity = 0;
  private background: GPUTexture | null = null;

  private source: BackgroundSource | null = null;
  private groups: GlassGroup[] = [];
  private tables: { key: string; data: Float32Array<ArrayBuffer>; stats: GuardStats }[] = [];
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
      ],
    });

    this.graph.add(this.pyramidPass()).add(this.backgroundPass()).add(this.glassPass());

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

  get guardStats(): readonly GuardStats[] {
    return this.tables.map((t) => t.stats);
  }

  get gpuBytes(): number {
    return (
      this.pool.bytes + this.surfaceCapacity * (SURFACE_FLOATS + TABLE_FLOATS) * 4 + this.groupCapacity * GROUP_FLOATS * 4 + GLOBALS_BYTES
    );
  }

  setSource(source: BackgroundSource): void {
    this.source?.dispose();
    this.source = source;
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
    this.onFrame?.();
    if (this.continuous) this.requestFrame();
  };

  private renderFrame(now: number): Promise<void> | null {
    if (!this.bgPipeline || !this.glassPipeline || !this.source) return null;
    if (this.sizeDirty) this.resize();
    if (!this.background) return null;

    const sizeChanged = this.sourceChanged;
    this.sourceChanged = false;
    if (this.source.update(this.device, this.background, sizeChanged)) this.pyramidDirty = true;
    if (this.surfacesDirty) this.uploadSurfaces();

    const g = new ArrayBuffer(GLOBALS_BYTES);
    const f = new Float32Array(g);
    const u = new Uint32Array(g);
    f[0] = this.width;
    f[1] = this.height;
    f[2] = 1 / this.width;
    f[3] = 1 / this.height;
    f[4] = this.dpr;
    f[5] = now / 1000;
    u[6] = this.debugView;
    f[7] = EDGE_START_PX;
    u[8] = TIER_FEATURES[this.quality];
    this.device.queue.writeBuffer(this.globals, 0, g);

    const texture = this.context ? this.context.getCurrentTexture() : this.frameTexture;
    if (!texture) return null;
    this.graph.run(this.device, texture.createView({ format: this.viewFormat }), this.timer);

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
      this.sourceChanged = true;
      this.pyramidDirty = true;
      this.bgBindGroup = null;
      this.glassBindGroup = null;
      this.pyramidBindGroups = [];
    }
    this.surfacesDirty = true;
  }

  private uploadSurfaces(): void {
    this.surfacesDirty = false;
    const flat = this.groups.flatMap((g) => g.surfaces);
    const count = flat.length;
    if (count > this.surfaceCapacity || !this.surfaceBuffer || !this.tableBuffer) {
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
      this.glassBindGroup = null;
      this.tables = [];
    }
    const data = new Float32Array(Math.max(count, 1) * SURFACE_FLOATS);
    const dpr = this.dpr;
    this.tables.length = count;
    flat.forEach(({ shape, material }, i) => {
      const key = tableKey(shape, material, dpr, this.guardEnabled);
      if (this.tables[i]?.key !== key) {
        const table = buildRadialTable(material, shape, dpr, this.guardEnabled);
        this.tables[i] = { key, ...table };
        this.device.queue.writeBuffer(this.tableBuffer!, i * TABLE_FLOATS * 4, table.data);
      }
      data.set(packSurface(shape, material, dpr), i * SURFACE_FLOATS);
    });
    this.device.queue.writeBuffer(this.surfaceBuffer, 0, data);

    // A group that cannot merge (one member, or spacing 0) is drawn as lone surfaces by the lean
    // pipeline. Records keep the flat surface order inside each group.
    interface DrawRecord {
      start: number;
      members: GlassSurface[];
      k: number;
    }
    const singles: DrawRecord[] = [];
    const unions: DrawRecord[] = [];
    let start = 0;
    for (const group of this.groups) {
      const n = group.surfaces.length;
      if (n > 1 && group.spacing > 0) unions.push({ start, members: group.surfaces, k: (group.spacing / 2) * dpr });
      else group.surfaces.forEach((surface, j) => singles.push({ start: start + j, members: [surface], k: 0 }));
      start += n;
    }
    const records = [...singles, ...unions];
    this.singleRecords = singles.length;
    this.unionRecords = unions.length;
    if (records.length > this.groupCapacity || !this.groupBuffer) {
      this.groupBuffer?.destroy();
      this.groupCapacity = Math.max(4, 2 ** Math.ceil(Math.log2(Math.max(records.length, 1))));
      this.groupBuffer = this.device.createBuffer({
        size: this.groupCapacity * GROUP_FLOATS * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        label: "lab.groups",
      });
      this.glassBindGroup = null;
    }
    const groupData = new ArrayBuffer(Math.max(records.length, 1) * GROUP_FLOATS * 4);
    const gf = new Float32Array(groupData);
    const gu = new Uint32Array(groupData);
    records.forEach(({ start, members, k }, i) => {
      // The union sinks up to k below the nearest member where two meet, 2k where three do — and
      // only between members, so the margin is per merge, not per member.
      let shadowReach = 0;
      for (const { material } of members) {
        const shadow = shadowGeometry(material.gap * dpr, dpr);
        if (material.shadow > 0) shadowReach = Math.max(shadowReach, shadow.offsetY + shadow.sigma * 3);
      }
      // `reach` is tested against a lower bound of the union, which already includes the sink;
      // the rectangle is drawn around the boxes, so it needs the sink as margin too.
      const reach = BOUNDS_MARGIN + shadowReach;
      const margin = reach + k * Math.min(members.length - 1, 2);
      const bounds = [Infinity, Infinity, -Infinity, -Infinity];
      for (const { shape } of members) {
        const [ex, ey] = shapeExtent(shape);
        bounds[0] = Math.min(bounds[0]!, (shape.cx - ex) * dpr - margin);
        bounds[1] = Math.min(bounds[1]!, (shape.cy - ey) * dpr - margin);
        bounds[2] = Math.max(bounds[2]!, (shape.cx + ex) * dpr + margin);
        bounds[3] = Math.max(bounds[3]!, (shape.cy + ey) * dpr + margin);
      }
      const o = i * GROUP_FLOATS;
      gf.set(bounds, o);
      gu[o + 4] = start;
      gu[o + 5] = members.length;
      gf[o + 6] = k;
      gf[o + 7] = reach;
    });
    this.device.queue.writeBuffer(this.groupBuffer, 0, groupData);
  }

  /** Rebuilds the mip chain of the content, only when the content changed. */
  private pyramidPass(): Pass {
    return {
      name: "pirâmide",
      enabled: () => (this.pyramidDirty || this.forcePyramid) && this.background !== null && this.background.mipLevelCount > 1,
      encode: (ctx: FrameContext, timestampWrites) => {
        const texture = this.background;
        if (!this.pyramidPipeline || !texture) return;
        this.pyramidDirty = false;
        const levels = texture.mipLevelCount;
        if (this.pyramidBindGroups.length !== levels - 1) {
          this.pyramidBindGroups = Array.from({ length: levels - 1 }, (_, i) =>
            this.device.createBindGroup({
              layout: this.pyramidLayout,
              entries: [
                { binding: 0, resource: texture.createView({ baseMipLevel: i, mipLevelCount: 1 }) },
                { binding: 1, resource: this.sampler },
              ],
              label: `lab.pyramid.${i + 1}`,
            }),
          );
        }
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
            colorAttachments: [
              {
                view: texture.createView({ baseMipLevel: level, mipLevelCount: 1 }),
                loadOp: "clear",
                storeOp: "store",
                clearValue: [0, 0, 0, 1],
              },
            ],
            ...(writes && (first || last) ? { timestampWrites: writes } : {}),
          });
          pass.setPipeline(this.pyramidPipeline);
          pass.setBindGroup(0, this.pyramidBindGroups[level - 1]!);
          pass.draw(3);
          pass.end();
        }
      },
    };
  }

  private backgroundPass(): Pass {
    return {
      name: "fundo",
      enabled: () => true,
      encode: (ctx: FrameContext, timestampWrites) => {
        if (!this.bgPipeline || !this.background) return;
        this.bgBindGroup ??= this.device.createBindGroup({
          layout: this.bgLayout,
          entries: [{ binding: 0, resource: this.background.createView({ baseMipLevel: 0, mipLevelCount: 1 }) }],
          label: "lab.background.bind",
        });
        const pass = ctx.encoder.beginRenderPass({
          label: "fundo",
          colorAttachments: [{ view: ctx.target, loadOp: "clear", storeOp: "store", clearValue: [0, 0, 0, 1] }],
          ...(timestampWrites ? { timestampWrites } : {}),
        });
        pass.setPipeline(this.bgPipeline);
        pass.setBindGroup(0, this.bgBindGroup);
        pass.draw(3);
        pass.end();
      },
    };
  }

  private glassPass(): Pass {
    return {
      name: "vidro",
      enabled: () => this.groups.length > 0,
      encode: (ctx: FrameContext, timestampWrites) => {
        if (!this.glassPipeline || !this.background || !this.surfaceBuffer || !this.tableBuffer || !this.groupBuffer) return;
        this.glassBindGroup ??= this.device.createBindGroup({
          layout: this.glassLayout,
          entries: [
            { binding: 0, resource: { buffer: this.globals } },
            { binding: 1, resource: { buffer: this.surfaceBuffer } },
            { binding: 2, resource: this.background.createView() },
            { binding: 3, resource: this.sampler },
            { binding: 4, resource: { buffer: this.tableBuffer } },
            { binding: 5, resource: { buffer: this.groupBuffer } },
          ],
          label: "lab.glass.bind",
        });
        const pass = ctx.encoder.beginRenderPass({
          label: "vidro",
          colorAttachments: [{ view: ctx.target, loadOp: "load", storeOp: "store" }],
          ...(timestampWrites ? { timestampWrites } : {}),
        });
        pass.setBindGroup(0, this.glassBindGroup);
        if (this.singleRecords > 0) {
          pass.setPipeline(this.glassPipeline);
          pass.draw(6, this.singleRecords);
        }
        if (this.unionRecords > 0 && this.unionPipeline) {
          pass.setPipeline(this.unionPipeline);
          pass.draw(6, this.unionRecords, 0, this.singleRecords);
        }
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
    const messages: string[] = [];
    for (const [name, module] of [
      ["background.wgsl", bgModule],
      ["glass.wgsl", glassModule],
      ["pyramid.wgsl", pyramidModule],
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
    const glassLayout = device.createPipelineLayout({ bindGroupLayouts: [this.glassLayout] });
    const glassPipeline = (entryPoint: string) =>
      device.createRenderPipeline({
        label: `glass.${entryPoint}`,
        layout: glassLayout,
        vertex: { module: glassModule, entryPoint: "vs_main" },
        fragment: {
          module: glassModule,
          entryPoint,
          targets: [
            {
              format: this.viewFormat,
              blend: {
                color: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
                alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
              },
            },
          ],
        },
        primitive: { topology: "triangle-list" },
      });
    const glass = glassPipeline("fs_single");
    const union = glassPipeline("fs_union");
    const pyramid = device.createRenderPipeline({
      label: "pyramid",
      layout: device.createPipelineLayout({ bindGroupLayouts: [this.pyramidLayout] }),
      vertex: { module: pyramidModule, entryPoint: "vs_main" },
      fragment: { module: pyramidModule, entryPoint: "fs_main", targets: [{ format: "rgba8unorm-srgb" }] },
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
    this.pyramidPipeline = pyramid;
    this.pyramidDirty = true;
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

function tableKey(shape: Shape, m: GlassMaterial, dpr: number, guard: boolean): string {
  const radius = clampedRadius(shape);
  const minHalf = Math.min(shape.halfWidth, shape.halfHeight);
  return [radius, minHalf, m.ior, m.abbe, m.thickness, m.gap, m.bevel, m.profile, dpr, guard].join("|");
}

/**
 * Device-pixel record of one surface (7 × vec4, see `Surface` in glass.wgsl). Derived values are
 * computed here once: absorption from tint and density, blur radius from roughness and the glass's
 * height, the key light direction, F0 from the ior, the shadow's offset and softness from the gap.
 */
function packSurface(shape: Shape, m: GlassMaterial, dpr: number): number[] {
  const { bevel } = deviceGeometry(m, shape, dpr);
  const absorb = m.tint.map((c) => (m.density * -Math.log(Math.max(c, 1e-3))) / (REFERENCE_PATH * dpr));
  const blur = 1.6 * (m.thickness + m.gap + m.bevel * 0.5) * m.roughness ** 1.5 * dpr;
  const angle = (m.lightAngle * Math.PI) / 180;
  const f0 = ((m.ior - 1) / (m.ior + 1)) ** 2;
  const inv = invert(shapeMatrix(shape));
  const shadow = shadowGeometry(m.gap * dpr, dpr);
  return [
    shape.cx * dpr, shape.cy * dpr, shape.halfWidth * dpr, shape.halfHeight * dpr,
    clampedRadius(shape) * dpr, shape.exponent, shadow.offsetY, shadow.sigma,
    bevel, m.thickness * dpr, m.gap * dpr, m.ior,
    m.roughness, m.edge, m.shadow, m.environment,
    absorb[0]!, absorb[1]!, absorb[2]!, m.light,
    Math.cos(angle), -Math.sin(angle), blur, f0,
    inv[0], inv[1], inv[2], inv[3],
  ];
}
