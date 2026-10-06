# vercel-labs/vgpu (b2eef0a, 2026-10-06) — npm 0.5.0, canary 0.6.0-rc.0, MIT

Monorepo de ~133 mil linhas: vgpu-api (público), core (wrappers), wgsl (loader Vite/webpack, imports
entre .wgsl, reflexão), wgsl-std (hash/noise/color/sampling), adapter-node (Dawn), adapter-mock,
render (inspect/perf), native (Metal/publicação), cli (docs, check, doctor, MCP, skills de agente).

## Análise de engenharia
- Pipeline: `PipelineStore` com cache por assinatura de alvo, compilação SÍNCRONA ou ASSÍNCRONA
  (createRenderPipelineAsync), registro de falha; caches de shader module e pipeline layout.
  Override constants refletidos (`OverrideInfo`). Bom.
- Shader modules: `.wgsl` importado como módulo TS via plugin Vite/webpack; imports WGSL→WGSL
  resolvidos em build; poda de declarações não usadas. Exige o plugin (build step).
- Binding: REFLEXÃO do WGSL → bind group layouts automáticos; `set({nome: valor})` por nome da
  variável; uniforms empacotados em páginas por frame e enviados num writeBuffer por página;
  bind groups em cache LRU por identidade de recursos (16 variações de captura, 64 de recurso).
- Texturas: `target()` (render target com read()), `texture()`, `sampler()`, `surface()` (canvas,
  dpr clamp [1,2], auto-resize, MSAA/depth opcionais). ping-pong helper.
- Compute: `compute()` + `frame.computePass()` (0.6 unificou com render). Indirect. Storage buffers.
- Render passes: `frame(gpu, f => f.pass(target, effect|draw))` — UM encoder e UM submit por frame.
  Bundles (render bundles) suportados.
- Tipos: tipagem das importações WGSL e de `set()` gerada da reflexão. Bom para quem escreve muito
  binding; pouco ganho para um engine com ~5 pipelines.
- Overhead: camadas de validação próprias (claim-validation, native-validation) em cada operação,
  caches com identidade, retenção de recursos por frame — CPU extra por chamada (não medido aqui;
  docs não publicam números). Bundle ≥ 25 KB gz para um efeito fullscreen (orçamento do CI).
- Debug: erros com código (VGPU-*), `vgpu check` valida WGSL, `doctor` diagnostica adapter, `timer()`
  com query ring para timestamps. Mas um erro de pipeline passa por 2 camadas antes do WebGPU.
- Escape hatch: `gpu.device` / `gpu.gpu`, `texture.gpu`, `initFromDevice(device)` (adota device
  externo sem destruí-lo). Existe e é bem feito.
- Estabilidade: PRÉ-1.0 com quebras a cada minor: 0.2 → 0.3 → 0.4 → 0.5 → 0.6-rc em meses; 0.6
  reescreve `vgpu/scene` inteiro, muda semântica de frame/loss/entries; há pasta de migrações e
  scripts para gerá-las. Canvas UI está preso em ^0.3.1.
- Escopo crescente: scene graph, Blender skill, MCP, agent evals. Não é uma camada fina.

## Glass-HQ usa vgpu para quê?
Só para o FORNO de mapas (1 effect fullscreen → target → read()). Usa 4 funções: init, effect,
frame, target. E para rodar o mesmo WGSL em Node (testes de readback). Ou seja: o ganho real ali é
o runtime de teste headless, não a abstração de renderização.

## Veredito para o nosso engine
ATRAPALHA como base. Motivos técnicos:
1. Nosso renderer tem poucos pipelines e precisa de controle fino de: storage buffer de N
   superfícies escrito em bloco, pirâmide com views por mip, pool de texturas, ordem de passes,
   timestamps por passe, override constants por nível de qualidade, HIC → textura. Isso é ~600–900
   linhas de WebGPU cru; vgpu economizaria talvez 30% e acrescentaria uma dependência que quebra a
   cada mês.
2. A reflexão/`set()` por nome resolve um problema que não temos (muitos shaders com muitos
   bindings mutáveis).
3. Toda depuração de desempenho atravessaria a camada de validação/caches.
4. Pré-1.0 com migrações frequentes = "rewrite" periódico que o pedido quer evitar.
O que copiar: (a) UM encoder/submit por frame; (b) cache de pipeline por chave + compilação
assíncrona; (c) bind groups em cache por identidade; (d) uniforms empacotados num write por frame;
(e) timer com ring de query sets; (f) testes por readback. Tudo isso cabe em ~200 linhas nossas.
Reavaliar se o laboratório crescer para dezenas de efeitos independentes.
