# jeantimex/glass-effect-webgpu (b237df1, 2026-06-04)

TS + Vite + raw WebGPU, html2canvas dependency. ~5k lines. Demo app, not library.

## Arquitetura
- 1 device, 1 canvas, 1 pipeline principal. Fragment shader FULL-SCREEN (quad 4 vértices) que desenha
  fundo + vidro em todo pixel. Fundo procedural (grid) ou textura (imagem/vídeo/DOM).
- Uniform struct monolítico de ~110 floats com campos POR PRESET (switch_mode, slider_mode,
  split_menu_mode, player_controls_mode, left/center/right_shadow_*...). Lógica de UI dentro do shader.
- Storage buffer `array<CircleInstanceData, 8>` (64 floats = 256 B/instância) — teto fixo 8.
- Bind group recriado em toda troca de fundo/pyramid; blur cria bind group + view POR PASSE.
- Cada passe de blur/mip = 1 commandEncoder + 1 submit. Dezenas de submits por quadro em modo DOM.

## Óptica (glass.wgsl)
- Perfis de Kube: convex_circle sqrt(1-(1-x)^2), convex_squircle (1-(1-x)^4)^(1/4), concave 1-circle, lip
  (mistura com smootherstep). x=0 na borda, 1 no fim do bisel.
- Derivada NUMÉRICA (dx=0.001) do perfil — analítica seria trivial.
- Snell 2D: normal=(−h', −1)/|.|, raio incidente (0,1), refract, deslocamento = r.x * (h*bezel + thickness)/r.y.
  Magnitude escalar; direção = normal 2D do SDF (diferença finita, eps=1px). CONCEITO CERTO (Kube).
- Números mágicos: bezel normalizado por /110, raio base 0.35*min(w,h), split 320px, k smin 40*dpr / 80*dpr.
- `max_displacement_scale` faz clamp do deslocamento → admite que o modelo explode em alguns casos.
- Borda SEM antialias: `if distance_from_edge < 0 return bg` → serrilhado na silhueta.
- Dispersão: 3 amostras com deslocamento ± displacement*strength*base — aberração arbitrária, não IOR/Abbe.
- Especular: faixa de aro de largura fixa (specular_thickness px) modulada por |dot(normal2D, dirLuz)|;
  NÃO usa normal 3D do perfil, nem view, nem Fresnel. É "rim light" 2D.
- Tint: `apply_glass_theme` = se tint escuro: color*0.9−0.3; claro: color*1.03+0.2; depois mix com tint.
  É exatamente o "background-color transparente" que queremos evitar.
- Sombra: SDF deslocado + smoothstep (barata, boa ideia; analítica sem blur).
- Saturação: boost de saturação dentro do aro especular (copiado do feColorMatrix do Kube).
- Sem espaço linear, sem sRGB view; rgba8unorm em tudo.
- Smooth union: smin polinomial quadrático de iq `mix(b,a,h) - k*h*(1-h)`; k fixo por preset.
  Merge = loop sobre 8 instâncias POR PIXEL da tela inteira; normal por diferença finita do SDF unido
  (3 avaliações × 8 instâncias).
- Stack = N passes full-screen, cada um para textura full-res + REGERA MIPMAP COMPLETO por instância
  por quadro. O(N × tela). Não escala.

## Blur
- Mip chain do fundo (box 2x2, ~12 níveis, 1 submit/nível) + "BlurPyramid": texture_2d_array de 5
  camadas FULL-RES com raios 0/8/16/32/64 css px × DPR, gaussiano separável 25 taps (passo = r/12 →
  com r=64·dpr os taps ficam 5–10 px apartados: subamostrado → bandas).
- 5 camadas + 4 temporárias + 1 temp = 10 texturas full-res. 4K: ~33 MB cada → ~330 MB.
- Interpolação entre níveis com smoothstep do raio.
- Em modo DOM vivo: `blurPyramidNeedsUpdate = true` TODO quadro, sem checar se o DOM mudou →
  copyElementImageToTexture + mips + 8 passes gaussianos full-res por quadro.

## HTML-in-Canvas
- Detecta `GPUQueue.prototype.copyElementImageToTexture` (e drawElementImage 2D como indicador).
- Elemento vira filho direto do canvas com `layoutsubtree`; espera 100 ms "para o layout assentar".
- `copyElementImageToTexture(el, w, h, {texture})` (assinatura com w,h) no `paint` E em todo render().
- Fallback: html2canvas estático (sem seleção de texto, sem vídeo, sem animação).
- Hit-test de texto feito à mão (TreeWalker + Range.getClientRects por pointermove) para o cursor.

## Física
- Molas semi-implícitas com SUBPASSO FIXO de 1/120 s (bom), stiffness/damping sem massa.
- 11 molas: scale, refraction, magnification, deformationX/Y, shadow*, specular, bgOpacity, liquid.
  BOA IDEIA: "press" anima o MATERIAL (refração↑, sombra mais curta e mais baixa, especular↑),
  não só a geometria.
- Posição NÃO é mola: segue o ponteiro direto (clamp na tela).
- Deformação: scaleX/scaleY por eixo a partir de |vx|,|vy| com acoplamento −0.45 (preserva área
  aproximadamente). Não alinha ao vetor velocidade → arrasto diagonal deforma errado.
- Velocidade suavizada por decaimento exp(−dt·5.5/12).

## Reaproveitar (conceito)
- Perfil de altura de Kube + Snell 1D na direção da normal do SDF.
- Sombra analítica pelo SDF deslocado.
- Press anima material inteiro via molas.
- Subpasso fixo de 1/120.
- Interpolação entre níveis de blur.

## Evitar
- Uniform monolítico com campos de preset; lógica de UI no shader.
- Full-screen fragment para cada superfície/stack.
- Pirâmide full-res; gaussiano 25 taps em raio 64; regenerar todo quadro.
- Submit por passe; bind group por passe; view por passe.
- Silhueta sem AA; tint por mix; dispersão arbitrária; especular 2D.
- Teto fixo de 8 instâncias.
