export interface TextureSpec {
  width: number;
  height: number;
  format: GPUTextureFormat;
  usage: GPUTextureUsageFlags;
  mipLevelCount?: number;
  label: string;
}

const BYTES_PER_TEXEL: Partial<Record<GPUTextureFormat, number>> = {
  "rgba8unorm": 4,
  "rgba8unorm-srgb": 4,
  "bgra8unorm": 4,
  "bgra8unorm-srgb": 4,
  "rgba16float": 8,
  "r16float": 2,
  "rg16float": 4,
  "r32float": 4,
};

/**
 * Textures keyed by role. A role is reallocated only when its spec changes (resize, format), never
 * per frame; the panel reads `bytes` to show what the lab holds on the GPU.
 */
export class TexturePool {
  private readonly entries = new Map<string, { spec: TextureSpec; texture: GPUTexture; bytes: number }>();

  private readonly device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;
  }

  get(role: string, spec: TextureSpec): { texture: GPUTexture; created: boolean } {
    const current = this.entries.get(role);
    if (current && sameSpec(current.spec, spec)) return { texture: current.texture, created: false };
    current?.texture.destroy();
    const mips = spec.mipLevelCount ?? 1;
    const texture = this.device.createTexture({
      size: [spec.width, spec.height],
      format: spec.format,
      usage: spec.usage,
      mipLevelCount: mips,
      label: spec.label,
    });
    const texel = BYTES_PER_TEXEL[spec.format] ?? 4;
    const bytes = spec.width * spec.height * texel * (mips > 1 ? 4 / 3 : 1);
    this.entries.set(role, { spec, texture, bytes });
    return { texture, created: true };
  }

  /** Frees a role nobody uses any more (the composite of a lower layer when the upper one goes). */
  release(role: string): void {
    this.entries.get(role)?.texture.destroy();
    this.entries.delete(role);
  }

  get bytes(): number {
    let total = 0;
    for (const entry of this.entries.values()) total += entry.bytes;
    return total;
  }

  destroy(): void {
    for (const entry of this.entries.values()) entry.texture.destroy();
    this.entries.clear();
  }
}

function sameSpec(a: TextureSpec, b: TextureSpec): boolean {
  return (
    a.width === b.width &&
    a.height === b.height &&
    a.format === b.format &&
    a.usage === b.usage &&
    (a.mipLevelCount ?? 1) === (b.mipLevelCount ?? 1)
  );
}
