const MAX_SPANS = 8;
const RING = 4;
const WINDOW = 120;

/** Rolling window of samples (ms). */
export class Series {
  private readonly values: number[] = [];

  push(value: number): void {
    this.values.push(value);
    if (this.values.length > WINDOW) this.values.shift();
  }

  get count(): number {
    return this.values.length;
  }

  get mean(): number {
    if (this.values.length === 0) return 0;
    let sum = 0;
    for (const v of this.values) sum += v;
    return sum / this.values.length;
  }

  percentile(p: number): number {
    if (this.values.length === 0) return 0;
    const sorted = [...this.values].sort((a, b) => a - b);
    return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0;
  }

  clear(): void {
    this.values.length = 0;
  }
}

interface Slot {
  buffer: GPUBuffer;
  busy: boolean;
  names: string[];
}

/**
 * GPU time per pass through a ring of readback buffers. A frame is timed only when a buffer is
 * free, so mapping never stalls the loop. Chrome quantizes to 100 µs unless
 * chrome://flags/#enable-webgpu-developer-features is on; the window average absorbs that.
 */
export class GpuTimer {
  readonly series = new Map<string, Series>();
  private readonly querySet: GPUQuerySet;
  private readonly resolve: GPUBuffer;
  private readonly slots: Slot[] = [];
  private frameNames: string[] = [];
  private frameSlot: Slot | null = null;

  constructor(device: GPUDevice) {
    this.querySet = device.createQuerySet({ type: "timestamp", count: MAX_SPANS * 2, label: "lab.timer" });
    this.resolve = device.createBuffer({
      size: MAX_SPANS * 2 * 8,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
      label: "lab.timer.resolve",
    });
    for (let i = 0; i < RING; i++) {
      this.slots.push({
        buffer: device.createBuffer({
          size: MAX_SPANS * 2 * 8,
          usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          label: `lab.timer.read${i}`,
        }),
        busy: false,
        names: [],
      });
    }
  }

  beginFrame(): void {
    this.frameNames = [];
    this.frameSlot = this.slots.find((s) => !s.busy) ?? null;
  }

  /** Timestamp writes for one pass, or undefined when this frame is not being timed. */
  span(name: string): GPURenderPassTimestampWrites | undefined {
    if (!this.frameSlot || this.frameNames.length >= MAX_SPANS) return undefined;
    const index = this.frameNames.length;
    this.frameNames.push(name);
    return {
      querySet: this.querySet,
      beginningOfPassWriteIndex: index * 2,
      endOfPassWriteIndex: index * 2 + 1,
    };
  }

  encodeResolve(encoder: GPUCommandEncoder): void {
    const slot = this.frameSlot;
    if (!slot || this.frameNames.length === 0) return;
    const count = this.frameNames.length * 2;
    encoder.resolveQuerySet(this.querySet, 0, count, this.resolve, 0);
    encoder.copyBufferToBuffer(this.resolve, 0, slot.buffer, 0, count * 8);
    slot.names = this.frameNames;
    slot.busy = true;
  }

  /** Call after queue.submit. */
  collect(): void {
    const slot = this.frameSlot;
    this.frameSlot = null;
    if (!slot || !slot.busy) return;
    slot.buffer
      .mapAsync(GPUMapMode.READ)
      .then(() => {
        const ticks = new BigInt64Array(slot.buffer.getMappedRange().slice(0));
        slot.buffer.unmap();
        slot.names.forEach((name, i) => {
          const begin = ticks[i * 2] ?? 0n;
          const end = ticks[i * 2 + 1] ?? 0n;
          if (end <= begin) return;
          let series = this.series.get(name);
          if (!series) this.series.set(name, (series = new Series()));
          series.push(Number(end - begin) / 1e6);
        });
        slot.busy = false;
      })
      .catch(() => {
        slot.busy = false;
      });
  }

  get total(): number {
    let sum = 0;
    for (const s of this.series.values()) sum += s.mean;
    return sum;
  }

  reset(): void {
    for (const s of this.series.values()) s.clear();
  }

  destroy(): void {
    this.querySet.destroy();
    this.resolve.destroy();
    for (const slot of this.slots) slot.buffer.destroy();
  }
}
