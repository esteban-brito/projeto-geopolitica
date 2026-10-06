# DavidHDev/canvas-ui (a04a99b, 2026-10-03) — MIT + Commons Clause

35 componentes; cada um tem engine WebGL2/GLSL (`*Vanilla.ts`) e WebGPU/WGSL via vgpu (`*WebGPU.ts`)
+ wrappers React/Solid/Preact/Vue/Svelte. Componentes NÃO compartilham nada entre si.

## Arquitetura (Glass)
- 1 GPUDevice por página (singleton `acquireGpu`), MAS 1 canvas de saída + 1 canvas 2D fonte POR
  componente (cada um com `surface()` próprio). Device compartilhado, canvas não.
- Captura: canvas 2D `content="drawable"` (ou layoutsubtree) → `ctx.drawElementImage(content,0,0)` no
  `onpaint` → marca `contentDirty` → `queue.copyExternalImageToTexture({source: canvas2D})`.
  DECISÃO DELIBERADA: usar a API 2D (estável) e upload padrão, não `copyElementImageToTexture`/
  `drawElementImageToTexture` (que mudou 3 vezes). Custo: 1 cópia extra. Ganho: sobreviveu às
  mudanças do Chrome 150 e 154 sem migração.
- Compat: `"content" in canvas` → content=drawable + drawable; senão layoutsubtree. Se
  drawElementImage devolve DOMMatrix e existe updateElementGeometry → chama (fase Chrome 154).
- Loop SOB DEMANDA: rAF só roda enquanto algo anima; para quando assentou e conteúdo não mudou.
  IntersectionObserver pausa fora da tela. prefers-reduced-motion respeitado. Custo ocioso = 0.
- Rect do canvas em cache (ResizeObserver + scroll/resize capturados) — evita
  getBoundingClientRect por pointermove (layout thrash).
- DPR: min(dpr,2)·pinchZoom, limitado por MAX_TEXTURE_SIZE, 8192 px por lado e 16,7 MP total.
  É o `effectivePixelRatio` que o pedido descreve — já resolvido aqui.
- Fallback sem WebGPU: 2D drawImage do canvas fonte (conteúdo sem efeito).
- Posição: suavização exponencial independente de frame rate `1−exp(−dt·k)`, não mola.

## Óptica (GlassWebGPU SHADER)
- Cor em espaço LINEAR (pow 2.2 manual na amostra, 1/2.2 na saída). Aproximação, mas consciente.
- SDF rounded-rect; AA da silhueta com smoothstep de 1,5 px.
- Perfil: `rim = pow(linearStep(−edgeW, 0, sd), bevel)`; normal = mix(normal plana, normal 2D
  horizontal do SDF (z=0), rim). Paramétrico, não derivado de h(d): na borda a normal fica DEITADA.
- Refração 3D: `refract(INCIDENT(0,0,1), N, 1.0003/ior)`, deslocamento = rv.xy · depth/|rv.z|,
  depth = "quanto o vidro flutua sobre a página" em px. Fisicamente legível.
- Dispersão ESPECTRAL: 6 comprimentos de onda (611, 570, 549, 491, 464, 374 nm) com IOR por λ e
  pesos RGB que somam 3 por canal (÷3). Bem mais bonito que 3 amostras RGB, mas 6× o custo.
- Blur SEM mip: 9 taps com raio 2^lod−1 → em raio grande vira fantasma/grade. LOD = max(blur, log2
  (|fwidth(px)|)) → antialias da amostra refratada pela PEGADA (footprint) — ótima ideia: onde a
  refração comprime a imagem, borra o necessário para não cintilar.
- Fosco: normal plana com jitter de ruído IGN (interleaved gradient noise) × scatter — rugosidade
  como microfaceta com dithering. Barato, granulado.
- Fresnel Schlick com F0 = ((ior−1)/(ior+1))² DERIVADO do IOR. Reflexão = a própria página amostrada
  no vetor refletido (SSR plano) × GGX(0.5). Sem ambiente.
- "Shine": banda × arcos com luz fixa (−0.6, 0.8): artístico, mantém o vidro visível sobre fundo liso.
- Custo por pixel com aberração: 6 refrações × 9 taps + 9 de reflexão ≈ 63 amostras.

## Liquid (fluido)
- Stable Fluids (Dobryakov-style) em passes de fragmento: splat, advect, curl/vorticity,
  divergence, pressure (Jacobi N iterações), gradient subtract. Double targets ping-pong;
  velocity rg16float, dye rgba16float, pressure/div/curl r16float; sim em resolução baixa.
  Referência para "Navier-Stokes simplificado" — e prova de custo: ~10 passes/quadro.

## Reaproveitar
- Adaptador HIC via 2D + upload padrão como caminho ESTÁVEL; direto WebGPU como caminho rápido.
- Loop sob demanda + IntersectionObserver + reduced-motion.
- Orçamento de pixels (DPR cap + MP cap + limite de textura).
- Refração 3D com "depth"; F0 do IOR; LOD por footprint (fwidth).
- Dispersão espectral (como modo ULTRA).
- Linear-space.

## Evitar
- 1 canvas por componente (não escala; limite de contextos; composição pelo navegador).
- Blur de 9 taps sem pirâmide.
- Normal paramétrica deitada na borda.
- Reflexão sem ambiente (só a página).
