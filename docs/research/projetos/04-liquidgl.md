# naughtyduk/liquidGL (88f681a, 2026-10-01) — liquidGL.js, 8.982 linhas num arquivo, zero deps

## Arquitetura
- Cadeia automática: WebGPU → WebGL2 → WebGL1 → CSS backdrop-filter. `engine` option e `?liquidGL-engine=`.
- UM canvas compartilhado por todas as lentes (position:absolute, pointer-events:none). Lentes
  ordenadas por z efetivo; stacking de lentes via textura de composição (u_stack).
- WebGPU: uniform buffer com DYNAMIC OFFSETS (`_dynamicUniformLayout`, `_ensureUniformCapacity
  (lensCount)`) — N lentes num buffer, 1 bind group, offset por draw. Device singleton; trata
  `device.lost` (warn se razão ≠ destroyed). Vídeo via importExternalTexture (frame-cache por
  WeakMap), fallback via canvas 2D.
- Só funciona em elementos FIXED/STICKY (o snapshot exclui as lentes; a lente "flutua" sobre a
  página que rola).

## Rasterizador próprio ("NaughtyDOM") — o fallback mais sério que existe aqui
- Reimplementa a pintura CSS no canvas 2D: árvore de nós, contextos de empilhamento na ordem CSS
  (z negativo → floats → in-flow → z positivo), clips com border-radius por canto, backgrounds
  (linear/radial/CONIC gradient parseados à mão, background-size/position/repeat, url() mesma
  origem), bordas (incl. cunhas por lado), box-shadow, texto por "runs" medidos com
  Range.getClientRects (respeita quebra de linha real do navegador), letter/word-spacing,
  text-shadow, decorações, IMG com object-fit, SVG inline → imagem (estilos computados inlinados),
  INPUT/TEXTAREA, transformações (matrix/matrix3d parse), backdrop-filter dos elementos capturados
  emulado em GPU (`LiquidBackdropFilter`, blur 31 taps).
- Snapshot da PÁGINA INTEIRA (scrollWidth×scrollHeight × resolution, padrão 2.0) — com teto em
  maxTextureSize² (reduz escala com warning). Rolar NÃO recaptura: só muda o mapeamento UV.
  Custo: memória (página longa → textura gigante ou escala reduzida = borrado).
- Pintura em CHUNKS com orçamento (8 ms) e `requestIdleCallback` entre fatias; geração/versão
  descarta capturas obsoletas; 3 tentativas com 500 ms.
- Repaint INCREMENTAL: guarda "records" (bounds, clips, runs, props de pintura serializadas em
  JSON) por op; diff com o anterior → retângulo sujo → repinta só a região (se nada tem box-shadow
  não-limitado). `uploadRegion` = writeTexture parcial.
- Elementos dinâmicos: registro MANUAL (`registerDynamic(selector)`); MutationObserver + recaptura
  por elemento em idle, composição na região. Não recaptura durante scroll.
- Vídeo: upload por quadro só da região do vídeo (requestVideoFrameCallback quando há).
- Limites: cross-origin não pinta; fontes/emoji/ligaduras dependem do canvas 2D; CSS que ele não
  conhece some (filters complexos, mask, mix-blend, pseudo-elementos? — conferir), custo de layout
  (getComputedStyle por nó + Range rects) proporcional ao DOM.

## Óptica (WGSL lens) — fraca
- offset = edge·refraction + edge^10·bevelDepth na direção da normal de canto; nada de Snell/IOR.
- "specular" = DUAS manchas que passeiam com o tempo (sin/cos). Não nasce da geometria.
- Fosco: 16 taps aleatórios (hash sin) por pixel → ruído; sem pirâmide.
- Aberração: R/B deslocados por offset·aberration.
- Tint: multiply mix. Sombra: textura cacheada com blur 31 taps, dither IGN na saída (bom detalhe).
- Deformação por interação: desloca o ponto amostrado perto do ponteiro e recalcula gradiente do SDF.

## Reaproveitar
- Estratégia do rasterizador: snapshot de página inteira + scroll por UV; diff de records → dirty
  rect → upload parcial; pintura fatiada com orçamento; versão/geração para descartar obsoletos.
- Dynamic offsets para N lentes num buffer.
- importExternalTexture para vídeo; tratamento de device.lost.
- Dither na saída para evitar banding em gradientes suaves (sombra).

## Evitar
- Óptica sem física; especular animado por tempo; frost por ruído aleatório.
- Escrever um rasterizador CSS próprio (8 k linhas e mesmo assim incompleto) — para o laboratório
  o custo não paga: nossas cenas de teste são nossas.
