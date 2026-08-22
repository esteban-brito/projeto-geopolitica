/* GUARDA · MOVIMENTO — a rede de `prefers-reduced-motion` continua sendo rede. */

import { collect, stripCssComments } from "../lib/project.mjs";

export const name = "motion";

const MOTION_FILE = "styles/90-motion.css";
const REQUIRED = ["animation-duration", "animation-iteration-count", "transition-duration"];

/**
 * @param {Map<string, string>} files
 * @returns {import("../lib/project.mjs").Finding[]}
 */
export function audit(files) {
  const { list, add } = collect(name);

  const raw = files.get(MOTION_FILE);
  if (raw === undefined) {
    add(`${MOTION_FILE} nao existe — a rede e a unica coisa que cobre as animacoes de uma vez`);
    return list;
  }
  const css = stripCssComments(raw);

  if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css)) {
    add("a rede nao tem a media query de movimento reduzido");
  }

  for (const property of REQUIRED) {
    if (!new RegExp(`${property}\\s*:`).test(css)) {
      add(
        `a rede nao declara ${property} — sem ela a preferencia fica pela metade ` +
          `(animation-duration sozinha nao para animacao infinita, so a acelera)`,
      );
    }
  }

  if (/animation\s*:\s*none/.test(css)) {
    add(
      "a rede usa `animation: none` — isso descarta o quadro FINAL de animacoes com " +
        "fill-mode, e quem pediu menos movimento receberia a tela incompleta em vez de parada",
    );
  }

  if (!/\*::before/.test(css) || !/\*::after/.test(css)) {
    add("a rede nao alcanca pseudo-elementos");
  }

  if (!/::view-transition-group/.test(css)) {
    add(
      "a rede nao alcanca os pseudo-elementos de View Transition — eles vivem no :root e " +
        "NAO sao atingidos por `*`, `*::before` ou `*::after`",
    );
  }

  /* Animacao injetada por estilo INLINE vence qualquer camada: e a unica forma de furar a
     rede sem escrever CSS. */
  for (const [path, source] of files) {
    if (!/\.mjs$/.test(path) || path.startsWith("tests/")) continue;
    if (/style\.animation\s*=|setProperty\(\s*["']animation/.test(source)) {
      add(
        `${path} injeta animacao por estilo inline — estilo inline vence toda camada, ` +
          `entao a rede de movimento reduzido nao o alcanca`,
      );
    }
  }

  return list;
}

export const synthetic = [
  {
    label: "a rede perdeu animation-iteration-count",
    files: new Map([
      [
        MOTION_FILE,
        "@layer motion{@media (prefers-reduced-motion:reduce){*,*::before,*::after{" +
          "animation-duration:.001ms;transition-duration:.001ms}" +
          "::view-transition-group(*){animation-duration:.001ms}}}",
      ],
    ]),
  },
  {
    label: "a rede voltou a usar animation:none",
    files: new Map([
      [
        MOTION_FILE,
        "@layer motion{@media (prefers-reduced-motion:reduce){*,*::before,*::after{" +
          "animation:none;animation-duration:.001ms;animation-iteration-count:1;" +
          "transition-duration:.001ms}::view-transition-group(*){animation-duration:.001ms}}}",
      ],
    ]),
  },
  {
    label: "a rede nao alcanca View Transitions",
    files: new Map([
      [
        MOTION_FILE,
        "@layer motion{@media (prefers-reduced-motion:reduce){*,*::before,*::after{" +
          "animation-duration:.001ms;animation-iteration-count:1;transition-duration:.001ms}}}",
      ],
    ]),
  },
  {
    label: "animacao injetada por estilo inline",
    files: new Map([
      [
        MOTION_FILE,
        "@layer motion{@media (prefers-reduced-motion:reduce){*,*::before,*::after{" +
          "animation-duration:.001ms;animation-iteration-count:1;transition-duration:.001ms}" +
          "::view-transition-group(*){animation-duration:.001ms}}}",
      ],
      ["app.mjs", 'node.style.animation = "pulse 1s infinite";'],
    ]),
  },
];
