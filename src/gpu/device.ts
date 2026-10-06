/** What the lab learned about the adapter, shown in the debug panel. */
export interface GpuInfo {
  vendor: string;
  architecture: string;
  description: string;
  isFallback: boolean;
  timestamps: boolean;
  maxTexture: number;
}

export interface GpuContext {
  device: GPUDevice;
  info: GpuInfo;
  canvasFormat: GPUTextureFormat;
}

export class GpuUnavailableError extends Error {}

/**
 * One device for the whole page. Timestamp queries are requested when present and never required:
 * without them the panel reports CPU time only.
 */
export async function acquireGpu(options: { timestamps?: boolean } = {}): Promise<GpuContext> {
  if (!("gpu" in navigator)) throw new GpuUnavailableError("navigator.gpu ausente");
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
  if (!adapter) throw new GpuUnavailableError("nenhum adaptador WebGPU");

  const timestamps = (options.timestamps ?? true) && adapter.features.has("timestamp-query");
  const device = await adapter.requestDevice({
    requiredFeatures: timestamps ? ["timestamp-query"] : [],
    label: "lab.device",
  });

  const ai = adapter.info;
  return {
    device,
    canvasFormat: navigator.gpu.getPreferredCanvasFormat(),
    info: {
      vendor: ai.vendor || "?",
      architecture: ai.architecture || "?",
      description: ai.description || "",
      isFallback: Boolean((ai as GPUAdapterInfo & { isFallbackAdapter?: boolean }).isFallbackAdapter),
      timestamps,
      maxTexture: device.limits.maxTextureDimension2D,
    },
  };
}

/** sRGB view of the swapchain format, so shaders write linear light and the hardware encodes. */
export function srgbViewOf(format: GPUTextureFormat): GPUTextureFormat {
  if (format === "bgra8unorm") return "bgra8unorm-srgb";
  if (format === "rgba8unorm") return "rgba8unorm-srgb";
  return format;
}
