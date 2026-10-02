/* CONFERE UMA FOLHA DE RETRATOS contra o padrão aprovado (vendor/posse/avatar-standard.json):
   recorta os seis rostos nos tamanhos reais e aponta detecção, centro e altura fora do padrão.
   uso: node tests/browser/review-portraits.mjs <folha.png> [mais.png]; saída em tmp/reports/avatar-reviews/. */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { chromium } from "playwright";

/**
 * @typedef {{ xPercent: number, yPercent: number }} Position
 * @typedef {{ sheet: { width: number, height: number, columns: number, rows: number }, crop: { zoom: number, positions: Position[] }, reviewSizesPx: number[], reference: { sha256: string } }} Standard
 * @typedef {{ centerX: number, centerY: number, sampledPixels: number }} Face
 * @typedef {{ width: number, height: number, faces: (Face | null)[] }} Metrics
 */

/** @type {Standard} */
const standard = JSON.parse(
  fs.readFileSync(new URL("../../vendor/posse/avatar-standard.json", import.meta.url), "utf8"),
);

const inputs = process.argv.slice(2);
if (!inputs.length) {
  process.stderr.write("uso: node tests/browser/review-portraits.mjs <folha.png> [mais.png]\n");
  process.exit(2);
}

/** @param {number} value */
const round = value => Math.round(value * 10) / 10;
/** @param {number} value @param {number} min @param {number} max */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** @param {import("playwright").Page} page @param {string} dataUrl @returns {Promise<Metrics>} */
async function measure(page, dataUrl) {
  return page.evaluate(async source => {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("canvas sem contexto 2d");
    context.drawImage(image, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const faces = [];
    const cellWidth = canvas.width / 3;
    const cellHeight = canvas.height / 2;
    for (let index = 0; index < 6; index++) {
      const cellX = (index % 3) * cellWidth;
      const cellY = Math.floor(index / 3) * cellHeight;
      let count = 0,
        sumX = 0,
        sumY = 0;
      for (let y = cellY + 115; y < cellY + 355; y++) {
        for (let x = cellX + 70; x < cellX + 442; x++) {
          const offset = (y * canvas.width + x) * 4;
          const red = data[offset] ?? 0,
            green = data[offset + 1] ?? 0,
            blue = data[offset + 2] ?? 0;
          if ((data[offset + 3] ?? 0) > 220 && red > 75 && red > green + 14 && green > blue + 4) {
            count++;
            sumX += x;
            sumY += y;
          }
        }
      }
      faces.push(
        count ? { centerX: sumX / count, centerY: sumY / count, sampledPixels: count } : null,
      );
    }
    return { width: canvas.width, height: canvas.height, faces };
  }, dataUrl);
}

/** @param {Metrics} metrics @param {boolean} reference */
function buildPortraits(metrics, reference) {
  const { sheet, crop } = standard;
  const backgroundWidth = sheet.columns * crop.zoom;
  const backgroundHeight = sheet.rows * crop.zoom;
  return metrics.faces.map((face, index) => {
    const flags = [];
    const faceReliable = face && face.sampledPixels >= 10000 && face.sampledPixels <= 80000;
    if (!faceReliable) flags.push("face-detection-uncertain");
    const x = face
      ? (((face.centerX * backgroundWidth) / sheet.width - 0.5) / (backgroundWidth - 1)) * 100
      : NaN;
    const row = Math.floor(index / sheet.columns);
    const base = crop.positions[index];
    if (!base) throw new Error(`posição ${index + 1} ausente no padrão`);
    const baseY = base.yPercent;
    const position =
      reference || !faceReliable ? base : { xPercent: round(clamp(x, 0, 100)), yPercent: baseY };
    if (face && (x < 0 || x > 100)) flags.push("face-outside-crop-range");
    if (face && Math.abs(x - base.xPercent) > 9) flags.push("unusual-horizontal-shift");
    const renderedY = face
      ? (face.centerY * backgroundHeight) / sheet.height -
        ((backgroundHeight - 1) * position.yPercent) / 100
      : null;
    const renderedX = face
      ? (face.centerX * backgroundWidth) / sheet.width -
        ((backgroundWidth - 1) * position.xPercent) / 100
      : null;
    if (renderedX !== null && Math.abs(renderedX - 0.5) > 0.04) flags.push("face-off-center");
    if (renderedY !== null && (renderedY < 0.43 || renderedY > 0.53))
      flags.push("unusual-vertical-position");
    return {
      index: index + 1,
      row: row + 1,
      column: (index % sheet.columns) + 1,
      faceCenterPx: face ? { x: round(face.centerX), y: round(face.centerY) } : null,
      faceSampledPixels: face ? face.sampledPixels : 0,
      position,
      renderedFaceXFraction: renderedX === null ? null : Math.round(renderedX * 1000) / 1000,
      renderedFaceYFraction: renderedY === null ? null : Math.round(renderedY * 1000) / 1000,
      flags,
    };
  });
}

/** @param {string} dataUrl @param {ReturnType<typeof buildPortraits>} portraits @param {string} title */
function contactHtml(dataUrl, portraits, title) {
  const { sheet, crop, reviewSizesPx } = standard;
  const size = `${Math.round(sheet.columns * crop.zoom * 100)}% ${Math.round(sheet.rows * crop.zoom * 100)}%`;
  const rows = reviewSizesPx
    .map(
      px =>
        `<section><b>${px} px</b>${portraits
          .map(
            portrait =>
              `<div class="cell"><div class="avatar" style="width:${px}px;height:${px}px;background-position:${portrait.position.xPercent}% ${portrait.position.yPercent}%"></div>${px === 148 ? `<small>${portrait.index}${portrait.flags.length ? " ⚠" : ""}</small>` : ""}</div>`,
          )
          .join("")}</section>`,
    )
    .join("");
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Revisão de avatares</title><style>
    *{box-sizing:border-box}body{margin:28px;background:#0b101b;color:#e6e9ee;font:15px system-ui}
    h1{font-size:22px;margin:0 0 6px}p{margin:0 0 20px;color:#a8b2c2}
    section{display:grid;grid-template-columns:80px repeat(6,160px);align-items:center;margin:16px 0}
    .cell{height:160px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:3px}
    .avatar{border-radius:50%;background-image:url('${dataUrl}');background-size:${size};background-repeat:no-repeat;background-color:#202735;flex:none}
    small{font-size:12px;color:#a8b2c2}
  </style><h1>Revisão de avatares</h1><p>${title}</p>${rows}</html>`;
}

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1140, height: 970 },
      deviceScaleFactor: 1,
    });
    let rejected = 0;
    for (const input of inputs) {
      try {
        const file = path.resolve(input);
        if (path.extname(file).toLowerCase() !== ".png") throw new Error(`PNG required: ${file}`);
        const bytes = fs.readFileSync(file);
        const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
        const reference = sha256 === standard.reference.sha256;
        const dataUrl = `data:image/png;base64,${bytes.toString("base64")}`;
        const metrics = await measure(page, dataUrl);
        const expected = standard.sheet;
        if (metrics.width !== expected.width || metrics.height !== expected.height) {
          throw new Error(
            `${path.basename(file)}: expected ${expected.width}x${expected.height}, got ${metrics.width}x${metrics.height}`,
          );
        }
        const portraits = buildPortraits(metrics, reference);
        const directory = path.join(
          import.meta.dirname,
          "..",
          "..",
          "tmp",
          "reports",
          "avatar-reviews",
          sha256.slice(0, 12),
        );
        fs.mkdirSync(directory, { recursive: true });
        const report = {
          input: file,
          sha256,
          reference,
          sheet: expected,
          backgroundSizePercent: [
            Math.round(expected.columns * standard.crop.zoom * 100),
            Math.round(expected.rows * standard.crop.zoom * 100),
          ],
          portraits,
          flags: portraits.flatMap(portrait =>
            portrait.flags.map(flag => `${portrait.index}:${flag}`),
          ),
          note: "Geometry is an estimate for new sheets. Review the contact image for style, silhouette and visual quality.",
        };
        fs.writeFileSync(
          path.join(directory, "report.json"),
          `${JSON.stringify(report, null, 2)}\n`,
        );
        await page.setContent(contactHtml(dataUrl, portraits, path.basename(file)));
        await page.screenshot({ path: path.join(directory, "contact.png"), fullPage: true });
        process.stdout.write(
          JSON.stringify({
            file,
            reference,
            flags: report.flags,
            contact: path.join(directory, "contact.png"),
            report: path.join(directory, "report.json"),
          }) + "\n",
        );
      } catch (error) {
        rejected++;
        process.stderr.write(
          JSON.stringify({
            file: path.resolve(input),
            error: String(error instanceof Error ? error.message : error),
          }) + "\n",
        );
      }
    }
    if (rejected) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => {
  process.stderr.write(String(error) + "\n");
  process.exitCode = 1;
});
