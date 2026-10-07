import { resolve } from "node:path";
import { defineConfig } from "vite";

/**
 * Cross-origin isolation: without it Chrome rounds performance.now() to 100 µs, and the CPU time of
 * a frame (~0.05 ms) read as 0 or 0.1. Isolated, the resolution is 5 µs. The lab loads nothing
 * from other origins, so nothing breaks.
 */
const isolation = { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" };

export default defineConfig({
  server: { host: "127.0.0.1", port: 5180, headers: isolation },
  preview: { headers: isolation },
  build: {
    target: "es2023",
    rollupOptions: {
      input: {
        lab: resolve(import.meta.dirname, "index.html"),
        bench: resolve(import.meta.dirname, "bench.html"),
        probe: resolve(import.meta.dirname, "probe.html"),
      },
    },
  },
});
