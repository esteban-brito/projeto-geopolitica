import { curveOf } from "../src/ui/shared/spring.mjs";
for (const [name, cfg] of [["lift", { duration: 0.32, bounce: 0.15 }], ["press", { duration: 0.16, bounce: 0.05 }], ["release", { duration: 0.42, bounce: 0.5 }]]) {
  const c = curveOf(cfg);
  const peak = Math.max(...c.css.match(/[\d.]+(?= \d)/g).map(Number));
  console.log(name, "settle", Math.round(c.duration * 1000) + "ms", "pico", peak, "\n ", c.css, "\n");
}
