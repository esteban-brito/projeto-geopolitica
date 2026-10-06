import type { GpuTimer } from "./timer.ts";

export interface FrameContext {
  encoder: GPUCommandEncoder;
  target: GPUTextureView;
  timer: GpuTimer | null;
}

export interface Pass {
  readonly name: string;
  enabled(): boolean;
  encode(ctx: FrameContext, timestampWrites: GPURenderPassTimestampWrites | undefined): void;
}

/**
 * Ordered passes, one encoder, one submit. No aliasing or barrier logic: WebGPU orders the work,
 * and the lab has a handful of passes. What the graph buys is timing and per-pass toggles.
 */
export class FrameGraph {
  private readonly passes: Pass[] = [];

  add(pass: Pass): this {
    this.passes.push(pass);
    return this;
  }

  run(device: GPUDevice, target: GPUTextureView, timer: GpuTimer | null): void {
    const encoder = device.createCommandEncoder({ label: "lab.frame" });
    timer?.beginFrame();
    const ctx: FrameContext = { encoder, target, timer };
    for (const pass of this.passes) {
      if (!pass.enabled()) continue;
      pass.encode(ctx, timer?.span(pass.name));
    }
    timer?.encodeResolve(encoder);
    device.queue.submit([encoder.finish()]);
    timer?.collect();
  }
}
