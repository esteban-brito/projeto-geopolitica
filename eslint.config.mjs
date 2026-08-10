/* Flat config do ESLint 9.
   O conjunto e pequeno de proposito: o que da para provar por TIPO ja e provado
   por `tsc`, e o que e estilo e resolvido por Prettier. Sobra para o lint o que
   nenhum dos dois pega — uso de variavel, comparacao frouxa e global inexistente.
   Regra que duplica outra ferramenta so produz ruido em tres lugares. */

const BROWSER = {
  document: "readonly",
  window: "readonly",
  navigator: "readonly",
  localStorage: "readonly",
  requestAnimationFrame: "readonly",
  performance: "readonly",
  Image: "readonly",
  HTMLDialogElement: "readonly",
  HTMLElement: "readonly",
};

const NODE = {
  process: "readonly",
  console: "readonly",
  URL: "readonly",
  Buffer: "readonly",
  fetch: "readonly",
  setTimeout: "readonly",
};

export default [
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...BROWSER, ...NODE },
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "no-console": "error",
      "no-implicit-coercion": "error",
    },
  },
  {
    /* O runner e o servidor escrevem no terminal por oficio. */
    files: ["tests/run.mjs", "tools/*.mjs"],
    rules: { "no-console": "off" },
  },
];
