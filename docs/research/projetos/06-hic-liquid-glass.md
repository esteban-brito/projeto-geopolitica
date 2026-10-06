# jeantimex/liquid-glass-html-in-canvas ("hic-liquid-glass") (51adb13, 2026-05-22)

TS + Vite + raw WebGPU; three.js só para uma cena 3D de MacBook de demonstração; lil-gui.
~1.100 linhas úteis. API da época: `layoutsubtree` + 2D `drawElementImage` (ou `drawElement`).

## Arquitetura
- Canvas 2D (layoutsubtree) é o COMPOSITOR PRINCIPAL. Fluxo por quadro:
  1. drawElementImage de cada filho de fundo no 2D;
  2. copyExternalImageToTexture(2D → bgTexture) (recria a textura se mudar de tamanho);
  3. blit downsample → blurA; N iterações de gaussiano 9 taps ping-pong A↔B em resolução reduzida;
  4. por elemento `.liquid-glass`: quad do tamanho do elemento + pad (só sombreia onde há vidro);
  5. o canvas WebGPU (offscreen) é desenhado de volta no 2D com `ctx.drawImage(gpuCanvas, …)`;
  6. o conteúdo do elemento de vidro (texto) é desenhado por cima com drawElementImage, depois
     de forçar background/border/box-shadow transparentes via style inline.
- Configuração por CSS custom properties (`--lg-blur`, `--lg-refraction`, `--lg-corner-radius`…)
  lidas com getComputedStyle a cada render.
- Posição: na API antiga getBoundingClientRect devolvia 0 dentro do layoutsubtree → reconstrói
  posição à mão de left/right/top/bottom/margins e REGEX em `transform` (translate/translateX/
  translate3d). Hack que a API nova (updateElementGeometry) torna desnecessário.

## Óptica (glass.wgsl)
- SDF rounded-rect; AA da máscara smoothstep(−1.5, 0.5).
- Height field de bisel circular h(d) = sqrt(d(2R−d)) até R=zRadius; normal 3D por diferenças
  centrais da ALTURA (5 avaliações de SDF) → N = normalize(−∇h, 1). CONCEITO CERTO (normal da altura).
- Refração NÃO usa Snell: "biconvex" = ∇h·(1−1/ior)·(2+espessura·0,5)·refract·30 + empurrão
  radial para o centro; modo "dome" = −p·k. Constantes mágicas.
- Micro-distorção por hash(sin) — ruído não temporalmente estável.
- Aberração: R/B deslocados ao longo de N.xy, intensidade maior na borda.
- Mistura nítido/borrado ponderada pela borda (15%).
- Brilho, saturação, tint "frio" fixo (0.92, 0.95, 1.05).
- Fresnel pow(1−|N.z|,4) artístico. ESPECULAR: 4 luzes Blinn-Phong (expoentes 90/50/120 + difusa)
  — iluminação de "estúdio" que nasce da normal. Visualmente rico, barato.
- Traço interno de 1,5 px com viés para o topo + glow interno + rim: a borda branca desenhada.
- Sombra em 2 termos: gaussiana externa + sombra de contato exponencial. Boa ideia, barata.

## Custo / problemas
- Uma submit + writeBuffer + bind group por elemento; bind group de blur criado por passe.
- Texturas recriadas por mudança de tamanho; targetCache por tamanho.
- O vidro passa por 3 cópias por quadro (2D→GPU, GPU→2D, conteúdo por cima).
- Sem invalidação: tudo por quadro.

## Reaproveitar
- Quad por superfície (bounding box + pad) em vez de tela cheia.
- Normal derivada da altura h(d).
- Blur em resolução reduzida com ping-pong.
- Sombra gaussiana + contato.
- Iluminação multi-luz barata como "ambiente".
- Conteúdo do vidro (texto) desenhado POR CIMA, nítido (não refratado).

## Evitar
- 2D como compositor principal com ida-e-volta GPU↔2D.
- Posição por parsing de CSS.
- Refração por constantes mágicas.
