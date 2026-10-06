import type { BackgroundSource } from "./source.ts";

/** Paints a scene at device resolution. `dpr` lets text and lines stay crisp. */
export type ScenePainter = (ctx: CanvasRenderingContext2D, width: number, height: number, dpr: number) => void;

/**
 * Scene drawn by the lab itself with Canvas 2D and uploaded once. Static by construction: it
 * costs nothing per frame until it is invalidated or the canvas is resized.
 */
export class NativeSource implements BackgroundSource {
  readonly kind = "native";
  private readonly canvas = document.createElement("canvas");
  private dirty = true;

  readonly label: string;
  private painter: ScenePainter;
  private readonly dprOf: () => number;

  constructor(label: string, painter: ScenePainter, dprOf: () => number) {
    this.label = label;
    this.painter = painter;
    this.dprOf = dprOf;
  }

  setPainter(painter: ScenePainter): void {
    this.painter = painter;
    this.dirty = true;
  }

  invalidate(): void {
    this.dirty = true;
  }

  update(device: GPUDevice, target: GPUTexture, sizeChanged: boolean): boolean {
    if (!this.dirty && !sizeChanged) return false;
    this.dirty = false;
    const { width, height } = target;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    const ctx = this.canvas.getContext("2d", { alpha: false });
    if (!ctx) return false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    this.painter(ctx, width, height, this.dprOf());
    device.queue.copyExternalImageToTexture({ source: this.canvas }, { texture: target }, [width, height]);
    return true;
  }

  dispose(): void {
    this.canvas.width = 0;
    this.canvas.height = 0;
  }
}
