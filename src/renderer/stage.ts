/**
 * CPU-side copies of what the renderer uploads every frame something moves: surface records, draw
 * records and symbols. Two sides that alternate, so this frame's layer 0 can be compared with the
 * last frame's without copying, and nothing is allocated in steady state (the previous version
 * allocated ~10 arrays a frame; the garbage collector took ~40% of the upload's time).
 */
export const SURFACE_FLOATS = 32;
export const GROUP_FLOATS = 8;
export const CONTENT_FLOATS = 12;

type F32 = Float32Array<ArrayBuffer>;
type U32 = Uint32Array<ArrayBuffer>;

interface Side {
  surfaces: F32;
  surfaceBits: U32;
  layers: Uint8Array<ArrayBuffer>;
  groups: ArrayBuffer;
  groupF32: F32;
  groupU32: U32;
  content: F32;
  contentBits: U32;
}

/** Where layer 0 ends in the draw records: its singles, then its unions, from record 0. */
export interface LowerRecords {
  unionStart: number;
  unions: number;
}

function surfaceArrays(capacity: number) {
  const surfaces = new Float32Array(Math.max(capacity, 1) * SURFACE_FLOATS);
  return { surfaces, surfaceBits: new Uint32Array(surfaces.buffer), layers: new Uint8Array(Math.max(capacity, 1)) };
}

function groupArrays(capacity: number) {
  const groups = new ArrayBuffer(Math.max(capacity, 1) * GROUP_FLOATS * 4);
  return { groups, groupF32: new Float32Array(groups), groupU32: new Uint32Array(groups) };
}

function contentArrays(capacity: number) {
  const content = new Float32Array(Math.max(capacity, 1) * CONTENT_FLOATS);
  return { content, contentBits: new Uint32Array(content.buffer) };
}

function side(surfaces: number, groups: number, content: number): Side {
  return { ...surfaceArrays(surfaces), ...groupArrays(groups), ...contentArrays(content) };
}

const pow2 = (n: number) => Math.max(4, 2 ** Math.ceil(Math.log2(Math.max(n, 1))));

export class UploadStage {
  private sides: [Side, Side] = [side(4, 4, 4), side(4, 4, 4)];
  private current = 0;
  /** A side was reallocated: the last frame's copy is gone, so layer 0 counts as changed. */
  private fresh = true;
  private last = { count: -1, recordFloats: -1, content: -1 };

  private get cur(): Side {
    return this.sides[this.current]!;
  }

  private get prev(): Side {
    return this.sides[1 - this.current]!;
  }

  /** Starts a frame on the other side; the side just used becomes "last frame". */
  flip(): { surfaces: F32; layers: Uint8Array<ArrayBuffer> } {
    this.current = 1 - this.current;
    return { surfaces: this.cur.surfaces, layers: this.cur.layers };
  }

  reserveSurfaces(capacity: number): void {
    if (this.cur.layers.length >= capacity && this.prev.layers.length >= capacity) return;
    for (const [i, s] of this.sides.entries()) this.sides[i] = { ...s, ...surfaceArrays(capacity) };
    this.fresh = true;
  }

  /** This frame's draw records, room for `records`. */
  groups(records: number): { f32: F32; u32: U32 } {
    if (this.cur.groupU32.length < records * GROUP_FLOATS) {
      const n = pow2(records);
      for (const [i, s] of this.sides.entries()) this.sides[i] = { ...s, ...groupArrays(n) };
      this.fresh = true;
    }
    return { f32: this.cur.groupF32, u32: this.cur.groupU32 };
  }

  /** This frame's symbols, room for `count`. */
  content(count: number): F32 {
    if (this.cur.content.length < count * CONTENT_FLOATS) {
      const n = pow2(count);
      for (const [i, s] of this.sides.entries()) this.sides[i] = { ...s, ...contentArrays(n) };
      this.fresh = true;
    }
    return this.cur.content;
  }

  /**
   * Whether layer 0 differs from last frame: its surface records (bit for bit), which surfaces are
   * on it, its draw records, its symbols. Records this frame for the next comparison.
   */
  lowerChanged(count: number, lower: LowerRecords, lowerContent: number): boolean {
    const recordFloats = (lower.unionStart + lower.unions) * GROUP_FLOATS;
    const contentFloats = lowerContent * CONTENT_FLOATS;
    const last = this.last;
    let changed = this.fresh || last.count !== count || last.recordFloats !== recordFloats || last.content !== contentFloats;
    this.fresh = false;
    last.count = count;
    last.recordFloats = recordFloats;
    last.content = contentFloats;
    if (changed) return true;
    const a = this.cur;
    const b = this.prev;
    for (let i = 0; i < count && !changed; i++) {
      if (a.layers[i] !== b.layers[i]) changed = true;
      else if (a.layers[i] === 0) {
        for (let k = i * SURFACE_FLOATS, end = k + SURFACE_FLOATS; k < end; k++) {
          if (a.surfaceBits[k] !== b.surfaceBits[k]) {
            changed = true;
            break;
          }
        }
      }
    }
    for (let k = 0; k < recordFloats && !changed; k++) if (a.groupU32[k] !== b.groupU32[k]) changed = true;
    for (let k = 0; k < contentFloats && !changed; k++) if (a.contentBits[k] !== b.contentBits[k]) changed = true;
    return changed;
  }
}
