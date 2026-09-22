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
  /* O medidor de contraste do passeio le a cor COMPUTADA e desenha a captura num canvas. */
  getComputedStyle: "readonly",
  HTMLDialogElement: "readonly",
  HTMLElement: "readonly",
  /* Os gestos da tela chegam por DELEGACAO — um listener no documento, e nao um
     por controle —, e delegacao obriga a perguntar o que foi tocado. `instanceof
     HTMLInputElement` e essa pergunta para os controles deslizantes. */
  HTMLInputElement: "readonly",
  /* A mesa tem o tamanho da foto do tampo e so encolhe, e quem mede a janela e ele. */
  ResizeObserver: "readonly",
  /* O clique na mesa e DELEGADO na sala, e delegacao obriga a perguntar o que foi tocado: a
     pasta na mesa se ERGUE, e so a pasta na mao marca e assina. */
  Element: "readonly",
  /* O passeio clica no que `elementFromPoint` acha no centro da pasta, e nao no seletor dela:
     em arvore 3D o ponto que o navegador de teste calcula para a peca cai no tampo. */
  MouseEvent: "readonly",
  Event: "readonly",
  /* A rubrica do decreto so corre com o comprimento MEDIDO do traco, e quem o mede e
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
    /* O QUE NAO E FONTE. A lista e a mesma do `.prettierignore`, e ela tinha de
       ser: sem isto as duas ferramentas discordam sobre o que e codigo do
       projeto, e a discordancia aparece como erro de lint num arquivo que o
       `.gitignore` ja declarou como artefato de medicao. Aconteceu com um script
       de captura em `tmp/`, e a correcao e igualar as duas listas, nao silenciar
       o arquivo. */
    ignores: [".claude/**", "vendor/**", "tmp/**", "captures/**"],
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
    /* O runner e o servidor escrevem no terminal por oficio. */
    files: ["tests/run.mjs", "tools/*.mjs"],
    rules: { "no-console": "off" },
  },
];
