import { chromium } from "playwright";
import { createServer } from "vite";

/**
 * Vite dev server + headless Chromium with WebGPU. Where no GPU exists (CI, cloud containers) the
 * adapter is SwiftShader: correct pixels, meaningless timings. LAB_CHROMIUM points at a specific
 * browser binary when Playwright's own is not installed.
 */
export async function openLab(path) {
  const server = await createServer({
    logLevel: "error",
    server: { host: "127.0.0.1", port: 0, strictPort: false, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  await server.listen();
  const address = server.httpServer?.address();
  const port = typeof address === "object" && address ? address.port : 5180;
  const browser = await chromium.launch({
    executablePath: process.env.LAB_CHROMIUM || undefined,
    args: ["--enable-unsafe-webgpu"],
  });
  const page = await browser.newPage({ deviceScaleFactor: 1, viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(`http://127.0.0.1:${port}${path}`);
  return {
    page,
    errors,
    async close() {
      await browser.close();
      await server.close();
    },
  };
}

/** Decode the probe's base64 RGBA into an accessor. */
export function image({ width, height, rgba }) {
  const data = Buffer.from(rgba, "base64");
  return {
    width,
    height,
    at(x, y) {
      const i = (y * width + x) * 4;
      return [data[i], data[i + 1], data[i + 2], data[i + 3]];
    },
  };
}
