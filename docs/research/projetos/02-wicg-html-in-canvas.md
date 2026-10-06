# WICG/html-in-canvas (20d5f08, 2026-09-30) — explainer vivo

## API atual (pós-setembro/2026)
- `<canvas content="drawable">` (era `layoutsubtree`, renomeado 17/09/2026, issue #179).
- descendentes desenháveis precisam do atributo `drawable` (implica isolation:isolate + containing block).
  Podem ser aninhados (drawable dentro de drawable). Sem `drawable` → drawElementImage lança erro.
- `paint` event: dispara após o Paint do update-the-rendering, UMA vez por frame, só quando algum
  snapshot mudou; traz `changedElements`. Desenho feito no paint aparece no MESMO frame; mudança de
  DOM feita no paint só no frame seguinte. Ordem reversa (filhos antes).
- `canvas.requestPaint()` força paint no próximo frame (análogo a rAF).
- 2D: `ctx.drawElementImage(el|ElementImage, dx, dy[, dw, dh])` + variantes com src rect. Retorna
  undefined (antes DOMMatrix). Atualiza geometria (hit-test/a11y) sozinho.
- WebGL: `texElementSubImage2D(target, level, xoff, yoff, el, {sx,sy,swidth,sheight,width,height})`
  — exige pré-alocar storage (texImage2D com null). Era texElementImage2D.
- WebGPU: `queue.drawElementImageToTexture({source, sourceX..}, {texture, size:{width,height}})`.
  Era `copyElementImageToTexture(src, {destination:{texture}, width, height})` e antes ainda
  `copyElementImageToTexture(el, w, h, {texture})`. TRÊS assinaturas em ~6 meses.
- `captureElementImage(el)` → `ElementImage` transferível (worker + OffscreenCanvas).
- `updateElementGeometry(el, {canvasTransform: DOMMatrix, clip, preserveHitTestOrder})` — OBRIGATÓRIO
  em WebGL/WebGPU para hit-test e a11y terem geometria. Não causa repaint.
- Chrome: origin trial; Chrome 154 tem versão intermediária; API final ~155+ (three.js PR #34732,
  remotion PR #11829 migrando). Flags: canvas-draw-element + experimental-web-platform-features.
  Edge tem OT. Nenhum sinal de Gecko/WebKit.

## Segurança / o que NÃO pinta (read-back-allowed)
- conteúdo cross-origin (img, iframe, url() de CSS, canvas tainted, SVG use/pattern/feImage);
- cores/temas de sistema; marcadores de ortografia; :visited; autofill; **subpixel AA do texto**
  (texto sai em AA de escala de cinza); legendas e controles de vídeo; IME.
- Pinta: scrollbars, form controls, caret, find-in-page.

## Limitações estruturais
- Sem efeitos threaded: scroll e animações compostas no compositor não chegam ao canvas sem JS
  no main thread (o "auto-updating canvas" é consideração futura). → scroll suave dentro do vidro
  depende do main thread a cada frame.
- Box-shadow fora da caixa não renderiza sem source-rect com outset (#173).
- Ancestrais de elementos desenhados não são marcados on-screen (#170, aberto): afeta lazy-load,
  content-visibility, IntersectionObserver, throttling de animação.
- Hit-test é por caixa transformada (DOMMatrix) + clip retangular; "precise hit testing" (#148)
  aberto → hit-test não segue a refração (o clique cai onde o elemento ESTÁ, não onde ele APARECE
  refratado). Para vidro isso é aceitável (refração pequena), mas é limite real.
- Bugs fechados recentes: crash com clip-path transition em webgl2 (#180), WebGL canvas parando
  de atualizar quando movido para dentro (#172), mouse events (#182).

## Exemplo oficial WebGPU (jelly slider, TypeGPU)
- SDF 3D raymarched + TAA (compute, clamp de vizinhança 3×3, blend 0.9). Ray marching cobra TAA.
- Tenta drawElementImageToTexture → copyElementImageToTexture (2 assinaturas antigas) em try/catch.
- `updateElementGeometry` com transform HARD-CODED (TODO do autor): sincronizar hit-test com a
  projeção é trabalho manual.

## Veredito preliminar para nós
- Ultra: SIM como fonte de fundo, atrás de um adaptador de 3 assinaturas + 2 nomes de atributo,
  com detecção em runtime e fallback automático; invalidação por `paint.changedElements` (só
  regerar pirâmide quando muda). NÃO pode ser requisito: só Chromium, OT, API muda a cada ~2 meses.
