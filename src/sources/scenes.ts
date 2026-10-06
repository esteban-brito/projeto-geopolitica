import type { ScenePainter } from "./native.ts";

export type SceneId = "color" | "text" | "image" | "grid";

export const SCENES: readonly { id: SceneId; label: string }[] = [
  { id: "color", label: "Cor" },
  { id: "text", label: "Texto" },
  { id: "image", label: "Imagem" },
  { id: "grid", label: "Grade" },
];

/** Deterministic, so captures and tests see the same pixels every run. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const paintColor: ScenePainter = (ctx, w, h) => {
  ctx.fillStyle = "#14121f";
  ctx.fillRect(0, 0, w, h);
  const blobs: [number, number, number, string][] = [
    [0.18, 0.22, 0.55, "#ff5e3a"],
    [0.78, 0.18, 0.5, "#ffb100"],
    [0.62, 0.78, 0.6, "#2f6bff"],
    [0.15, 0.85, 0.45, "#00c2a8"],
    [0.48, 0.45, 0.35, "#e83ea8"],
  ];
  const span = Math.max(w, h);
  ctx.globalCompositeOperation = "lighter";
  for (const [x, y, r, color] of blobs) {
    const g = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, r * span);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalCompositeOperation = "source-over";
};

const TEXT_BODY = [
  "A luz muda de direção quando atravessa a fronteira entre dois meios. O ângulo de entrada e o",
  "de saída obedecem à lei de Snell: n₁ sen θ₁ = n₂ sen θ₂. No vidro comum, n vale perto de 1,5;",
  "no ar, quase exatamente 1. Por isso a borda curva de uma lente desloca a imagem do que está",
  "atrás dela, e o centro plano quase não desloca nada. A espessura decide quanto o raio anda",
  "dentro do material antes de sair, e o ângulo da saída decide quanto ele ainda anda no ar.",
  "Perto da borda, quase toda a luz é refletida: é o que escurece a aresta de uma peça grossa.",
];

export const paintText: ScenePainter = (ctx, w, h, dpr) => {
  ctx.fillStyle = "#f4f1ea";
  ctx.fillRect(0, 0, w, h);
  const margin = 56 * dpr;
  ctx.fillStyle = "#16130f";
  ctx.textBaseline = "alphabetic";

  ctx.font = `600 ${120 * dpr}px Georgia, "Times New Roman", serif`;
  ctx.fillText("Refração", margin, margin + 104 * dpr);

  let y = margin + 160 * dpr;
  for (const size of [22, 16, 13, 11, 9]) {
    ctx.font = `${size * dpr}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.fillStyle = size >= 16 ? "#16130f" : "#3d372e";
    for (const line of TEXT_BODY) {
      ctx.fillText(line, margin, y);
      y += size * 1.5 * dpr;
      if (y > h - margin) return;
    }
    y += size * dpr;
  }
  ctx.font = `${12 * dpr}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
  ctx.fillStyle = "#7a1f12";
  ctx.fillText("n = 1,52 · V = 58,9 · λd = 587,6 nm", margin, Math.min(y, h - margin / 2));
};

export const paintGrid: ScenePainter = (ctx, w, h, dpr) => {
  ctx.fillStyle = "#fbfbfa";
  ctx.fillRect(0, 0, w, h);
  const minor = 16 * dpr;
  ctx.lineWidth = Math.max(1, dpr);
  ctx.strokeStyle = "#d9dbe0";
  ctx.beginPath();
  for (let x = 0; x <= w; x += minor) {
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, h);
  }
  for (let y = 0; y <= h; y += minor) {
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(w, Math.round(y) + 0.5);
  }
  ctx.stroke();
  ctx.strokeStyle = "#1b1d22";
  ctx.lineWidth = Math.max(1, 1.5 * dpr);
  ctx.beginPath();
  for (let x = 0; x <= w; x += minor * 5) {
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, h);
  }
  for (let y = 0; y <= h; y += minor * 5) {
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(w, Math.round(y) + 0.5);
  }
  ctx.stroke();
  ctx.strokeStyle = "#d4362c";
  ctx.lineWidth = 2 * dpr;
  ctx.beginPath();
  for (let r = minor * 5; r < Math.max(w, h); r += minor * 10) {
    ctx.moveTo(w / 2 + r, h / 2);
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
  }
  ctx.stroke();
  ctx.fillStyle = "#1b1d22";
  ctx.font = `${10 * dpr}px ui-monospace, Menlo, Consolas, monospace`;
  for (let x = 0; x < w; x += minor * 5) {
    for (let y = 0; y < h; y += minor * 5) {
      ctx.fillText(`${Math.round(x / dpr)},${Math.round(y / dpr)}`, x + 3 * dpr, y + 11 * dpr);
    }
  }
};

/** Procedural photograph stand-in: dusk sky, out-of-focus lights, a skyline with lit windows. */
export const paintImage: ScenePainter = (ctx, w, h, dpr) => {
  const rnd = random(7);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#1c2440");
  sky.addColorStop(0.55, "#b24a5c");
  sky.addColorStop(0.8, "#f1a35b");
  sky.addColorStop(1, "#2a1a24");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "lighter";
  const hues = ["#ffcf7a", "#ff7a59", "#7ac8ff", "#ffe9b0", "#ff9ad5"];
  for (let i = 0; i < 70; i++) {
    const x = rnd() * w;
    const y = rnd() * h * 0.75;
    const r = (8 + rnd() * 46) * dpr;
    const g = ctx.createRadialGradient(x, y, r * 0.7, x, y, r);
    const color = hues[Math.floor(rnd() * hues.length)] ?? "#ffffff";
    g.addColorStop(0, `${color}55`);
    g.addColorStop(1, `${color}00`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  let x = 0;
  while (x < w) {
    const bw = (30 + rnd() * 90) * dpr;
    const bh = h * (0.18 + rnd() * 0.42);
    const top = h - bh;
    ctx.fillStyle = `rgb(${12 + rnd() * 14}, ${12 + rnd() * 10}, ${22 + rnd() * 16})`;
    ctx.fillRect(x, top, bw, bh);
    const cell = 7 * dpr;
    for (let wy = top + cell; wy < h - cell; wy += cell * 1.8) {
      for (let wx = x + cell * 0.6; wx < x + bw - cell; wx += cell * 1.5) {
        if (rnd() < 0.42) {
          ctx.fillStyle = rnd() < 0.8 ? "#ffd27a" : "#9fd8ff";
          ctx.fillRect(wx, wy, cell * 0.7, cell * 0.9);
        }
      }
    }
    x += bw + 2 * dpr;
  }
};

/** Draw a user-supplied image with object-fit: cover. */
export function paintBitmap(bitmap: ImageBitmap): ScenePainter {
  return (ctx, w, h) => {
    const scale = Math.max(w / bitmap.width, h / bitmap.height);
    const dw = bitmap.width * scale;
    const dh = bitmap.height * scale;
    ctx.drawImage(bitmap, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };
}

/** Uniform colour, for measuring what the glass alone does to a pixel. */
export function paintSolid(color: string): ScenePainter {
  return (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
  };
}

/** Test pattern: R encodes x, G encodes y. Readback tests invert it to find where light came from. */
export const paintCoordinates: ScenePainter = (ctx, w, h) => {
  const image = ctx.createImageData(w, h);
  const data = image.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      data[i] = Math.round((x / Math.max(w - 1, 1)) * 255);
      data[i + 1] = Math.round((y / Math.max(h - 1, 1)) * 255);
      data[i + 2] = 0;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
};

export const PAINTERS: Record<SceneId, ScenePainter> = {
  color: paintColor,
  text: paintText,
  image: paintImage,
  grid: paintGrid,
};
