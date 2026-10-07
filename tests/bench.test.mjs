import assert from "node:assert/strict";
import { test } from "node:test";
import { Series, WINDOW } from "../src/renderer/timer.ts";
import { openLab } from "./harness.mjs";

/**
 * The bench itself works: a three-scenario suite run offscreen (the timings mean nothing here on
 * SwiftShader; the structure, the counts and the JSON are what is checked). It is what the user
 * runs on the RX 6600, so it must not break silently.
 */
test("a janela das médias se alarga para o bench e volta ao tamanho do painel", () => {
  const series = new Series();
  for (let i = 0; i < 500; i++) series.push(i);
  assert.equal(series.count, WINDOW, "o painel guarda os últimos 120 (era o que cortava o bench)");
  series.capacity = 4096;
  series.clear();
  for (let i = 0; i < 500; i++) series.push(i);
  assert.equal(series.count, 500, "o bench guarda todos");
  series.capacity = WINDOW;
  assert.deepEqual(series.samples(), Array.from({ length: WINDOW }, (_, i) => 380 + i), "e volta a guardar os mais recentes");
});

test("o bench roda, mede todos os quadros e produz JSON completo", { timeout: 120_000 }, async () => {
  const lab = await openLab("/bench.html?suite=smoke&offscreen&run&measure=3000", { viewport: { width: 1280, height: 720 } });
  try {
    await lab.page.waitForFunction(() => window.bench?.done(), null, { timeout: 100_000 });
    const report = JSON.parse(await lab.page.evaluate(() => window.bench.json()));
    assert.equal(report.lab, "liquid-glass-lab V5");
    assert.equal(report.results.length, 3);
    for (const r of report.results) {
      // Every frame of the 3 s at the display's rate (60 Hz headless here): well past the 120 the
      // panel's window used to cut every measurement to.
      assert.ok(r.frames >= 0.9 * r.refreshHz * 3 && r.frames > 150, `${r.frames} quadros a ${r.refreshHz.toFixed(0)} Hz`);
      assert.ok(r.cpuMs.median > 0 && r.cpuMs.p95 >= r.cpuMs.median);
      assert.ok(r.memoryMB > 0);
      for (const key of ["gpuTotalMs", "gpuMs", "glassNsPerPx", "quantized", "valid", "refreshHz", "timedFrames"]) assert.ok(key in r, `campo ${key}`);
    }
    const [plain, layered, touched] = report.results;
    assert.ok(layered.memoryMB > plain.memoryMB, "a camada de baixo aparece na memória");
    assert.equal(touched.touches, 4);
    const errors = lab.errors.filter((e) => !/timestamp/i.test(e));
    assert.deepEqual(errors, [], "a página não pode registrar erro");
  } finally {
    await lab.close();
  }
});
