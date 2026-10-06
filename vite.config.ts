import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  server: { host: "127.0.0.1", port: 5180 },
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
