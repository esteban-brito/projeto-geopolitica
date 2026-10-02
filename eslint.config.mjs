/* Flat config do ESLint 9.
   O conjunto e pequeno de propósito: o que da para provar por TIPO já e provado
   por `tsc`, e o que e estilo e resolvido por Prettier. Sobra para o lint o que
   nenhum dos dois pega — uso de variável, comparação frouxa e global inexistente.
   Regra que duplica outra ferramenta só produz ruído em três lugares. */

const BROWSER = {
  document: "readonly",
  window: "readonly",
  navigator: "readonly",
  localStorage: "readonly",
  requestAnimationFrame: "readonly",
  performance: "readonly",
  Image: "readonly",
  /* O medidor de contraste do passeio lê a cor COMPUTADA e desenha a captura num canvas. */
  getComputedStyle: "readonly",
  HTMLDialogElement: "readonly",
  HTMLElement: "readonly",
  /* Os gestos da tela chegam por DELEGACAO — um listener no documento, e não um
     por controle —, e delegacao obriga a perguntar o que foi tocado. `instanceof
     HTMLInputElement` e essa pergunta para os controles deslizantes. */
  HTMLInputElement: "readonly",
  /* A mesa tem o tamanho da foto do tampo e só encolhe, e quem mede a janela e ele. */
  ResizeObserver: "readonly",
  /* O clique na mesa e DELEGADO na sala, e delegacao obriga a perguntar o que foi tocado: a
     pasta na mesa se ERGUE, e só a pasta na mão marca e assina. */
  Element: "readonly",
  /* O passeio clica no que `elementFromPoint` acha no centro da pasta, e não no seletor dela:
     em árvore 3D o ponto que o navegador de teste calcula para a peça cai no tampo. */
  MouseEvent: "readonly",
  Event: "readonly",
  /* A rubrica do decreto só corre com o comprimento MEDIDO do traço, e quem o mede e
     `getTotalLength` — a pergunta que autoriza a chamada e `instanceof SVGPathElement`. */
  SVGPathElement: "readonly",
  /* `CSS.escape` monta o seletor que devolve o foco depois de `paint()` reescrever a tela. */
  CSS: "readonly",
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
    /* O QUE NÃO E FONTE. A lista e a mesma do `.prettierignore`, e ela tinha de
       ser: sem isto as duas ferramentas discordam sobre o que e código do
       projeto, e a discordancia aparece como erro de lint num arquivo que o
       `.gitignore` já declarou como artefato de medição. Aconteceu com um script
       de captura em `tmp/`, e a correção e igualar as duas listas, não silenciar
       o arquivo. */
    ignores: [".claude/**", "vendor/**", "tmp/**", "captures/**", "**/evidence/**"],
  },
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
    /* O runner e o servidor escrevem no terminal por ofício. */
    files: ["tests/run.mjs", "tools/*.mjs"],
    rules: { "no-console": "off" },
  },
];
