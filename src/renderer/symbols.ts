/**
 * The symbols that sit on glasses, as one texture: a row of square cells, white strokes, coverage
 * in alpha. Every mip level is rasterized from the SVG at that size instead of filtered from the
 * level above: a 2 px stroke filtered down to 28 px turns grey and soft, rasterized at 32 it stays
 * a stroke. Built once per symbol set; nothing here runs per frame.
 */

/** Side of a cell at mip 0, device px. Symbols up to ~3× this are sharp; the lab's are ≤ 102. */
export const SYMBOL_CELL = 128;
/** 128 → 16 px: past that a symbol is too small to read anyway. */
export const SYMBOL_LEVELS = 4;

export interface SymbolAtlas {
  texture: GPUTexture;
  cells: number;
}

/**
 * White strokes at a given pixel size; the SVG is sized in its own attributes so it rasterizes
 * there. Markup written for inline HTML may lack the namespace a standalone image needs.
 */
function sized(svg: string, size: number): string {
  const ns = svg.includes("xmlns=") ? svg : svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  return ns
    .replace(/\bwidth="[^"]*"/, `width="${size}"`)
    .replace(/\bheight="[^"]*"/, `height="${size}"`)
    .replaceAll("currentColor", "#fff");
}

function load(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("símbolo SVG não carregou"));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export async function buildSymbolAtlas(device: GPUDevice, svgs: readonly string[]): Promise<SymbolAtlas> {
  const cells = Math.max(1, svgs.length);
  const texture = device.createTexture({
    size: [SYMBOL_CELL * cells, SYMBOL_CELL],
    format: "rgba8unorm",
    mipLevelCount: SYMBOL_LEVELS,
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    label: "lab.symbols",
  });
  const canvas = document.createElement("canvas");
  for (let level = 0; level < SYMBOL_LEVELS; level++) {
    const cell = SYMBOL_CELL >> level;
    const images = await Promise.all(svgs.map((svg) => load(sized(svg, cell))));
    canvas.width = cell * cells;
    canvas.height = cell;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    images.forEach((img, i) => ctx.drawImage(img, i * cell, 0, cell, cell));
    device.queue.copyExternalImageToTexture({ source: canvas }, { texture, mipLevel: level }, [canvas.width, canvas.height]);
  }
  canvas.width = canvas.height = 0;
  return { texture, cells };
}
