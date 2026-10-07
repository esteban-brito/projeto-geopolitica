# Liquid Glass Lab — Engenharia reversa e estudo comparativo

> Estado em 06/10/2026. Código lido em clones rasos de cada repositório (commit indicado em cada
> nota de `projetos/`). Medições de desempenho: **nenhuma** foi feita aqui — o contêiner só tem
> WebGPU por SwiftShader (CPU). Todo número de custo abaixo é modelo ou dado do autor, e está
> marcado como tal.

Critério de decisão, pedido pelo responsável: **equilíbrio entre qualidade e desempenho**. Uma
técnica entra se a diferença aparece numa captura lado a lado e o custo cabe no orçamento medido.

---

## 0. Resumo em dez linhas

1. **Ninguém publica medição de GPU.** Nenhum dos 12 projetos traz tempo de GPU com resolução,
   dispositivo e número de superfícies. O único "benchmark" (liquid-dom) é modelo estático, e o
   autor diz isso. "60 FPS" não aparece com contexto em lugar nenhum.
2. **Só três fazem óptica com Snell de verdade** (glass-effect-webgpu, Canvas UI, refractive/Kube);
   o resto desloca UV com constantes mágicas.
3. **O melhor material** (Canvas UI) e **a melhor arquitetura** (liquid-dom) estão em projetos
   diferentes. Nenhum junta os dois.
4. **Metade do campo refrata via SVG `backdrop-filter: url()`** (refractive, Glass-HQ, Liquefy) — e
   isso **só funciona no Chromium**. WebKit e Gecko aceitam a sintaxe e descartam o efeito.
5. **HTML-in-Canvas mudou de assinatura três vezes em seis meses**; está em origin trial, só Chromium.
   Serve para o nível Ultra, **atrás de um adaptador**, nunca como fundação.
6. **vgpu atrapalha** como base do nosso engine (pré-1.0, quebra a cada minor, resolve um problema
   que não temos). Copiamos as ideias dele em ~200 linhas.
7. **A borda do vidro dobra a imagem** se o mapeamento de refração deixar de ser injetivo —
   Liquefy mediu e limitou a compressão em 0,88. Vira invariante do nosso shader.
8. **Smooth union** tem um tratamento sério só no liquid-dom (união conservadora + porta de ângulo +
   submersão). Nós usamos smin **cúbica (C²)**: a refração depende da curvatura, e C¹ deixa vinco.
9. **Morph** circle→capsule→squircle→panel não está resolvido em lugar nenhum de forma contínua:
   definimos um descritor único de forma em que tudo é interpolação de números.
10. **V0 começa** por: renderer único, fonte de fundo nativa, uma superfície no storage buffer,
    SDF superelíptico, Snell de duas interfaces, painel com tempo de GPU por passe, hot reload de
    WGSL e testes de shader por readback (que rodam aqui, em SwiftShader).

---

## 1. Arquitetura de cada projeto

Detalhes, trechos e números em `projetos/NN-*.md`. Aqui, o essencial.

| projeto | arquitetura em uma frase |
| --- | --- |
| **glass-effect-webgpu** (jeantimex) | Um fragment shader **de tela cheia** desenha fundo + vidro em todo pixel; uniform monolítico de ~110 floats **com campos de preset** (switch, slider, split menu…); storage `array<…, 8>`; pirâmide de blur em 5 camadas full-res. |
| **WICG HTML-in-Canvas** | `<canvas content="drawable">` + filhos `drawable`; evento `paint` com `changedElements`; `drawElementImage` (2D), `texElementSubImage2D` (WebGL), `drawElementImageToTexture` (WebGPU); `updateElementGeometry` para hit-test e acessibilidade em 3D. |
| **Canvas UI** | 35 efeitos, cada um com engine WebGL2 e WebGPU (via vgpu); **device compartilhado mas 1 canvas por componente**; captura HIC pela API **2D** + `copyExternalImageToTexture` (escolha deliberada: estável entre mudanças da API). |
| **liquidGL** | 8.982 linhas num arquivo; **um canvas compartilhado** para todas as lentes; cadeia WebGPU → WebGL2 → WebGL1 → CSS; **rasterizador CSS próprio** que pinta a página inteira num canvas 2D, com repintura incremental por retângulo sujo. |
| **Kube** (artigo) / **@hashintel/refractive** | Mapa de deslocamento pré-calculado na CPU por Snell sobre um perfil de bisel; 8 bits por canal; aplicado com `feDisplacementMap` dentro de `backdrop-filter`; refractive faz 9-slice do mapa. |
| **hic-liquid-glass** (jeantimex) | Canvas 2D como compositor principal; WebGPU num canvas à parte só para o vidro, copiado de volta para o 2D todo quadro; posição reconstruída parseando CSS. |
| **Glass-HQ/liquid-glass** | WebGPU **como forno**: gera atlas de mapas por geometria, lê de volta, vira PNG data URL; quem refrata é um filtro SVG único da cena. Tem um **app SwiftUI nativo** para comparar com o vidro real da Apple. |
| **vgpu** (Vercel Labs) | Monorepo de ~133 mil linhas: imports tipados de WGSL, reflexão de bindings, `frame()` com um encoder/submit, runtime Node (Dawn) e mock para testes. Pré-1.0. |
| **Liquefy UI** | Refração por SVG `backdrop-filter`; mapas e "ornamentos" desenhados num **WebGL2 compartilhado** e copiados para um canvas 2D por componente (para fugir do teto de ~16 contextos WebGL). |
| **liquid-dom** ⊕ *(fora da lista)* | **Um** renderer WebGPU com scene graph; shapes num storage buffer com transform inverso; blur adaptativo por nível; métricas de fundo em luz linear com percentis; smooth union cuidadosa. |
| **liquid-glass-studio** ⊕ *(fora da lista)* | Demo WebGL2/WebGPU com duas shapes, Snell "por ângulo", Fresnel colorido em LCH, realce em lados opostos. |

⊕ = encontrado durante o estudo; o liquid-dom é o mais próximo do que queremos.

---

## 2. Técnicas que valem estudar ou adaptar

**Óptica**
- **Perfil de bisel de Kube + Snell 1D na direção da normal do SDF** (Kube, refractive,
  glass-effect-webgpu). É o núcleo físico certo.
- **Refração 3D com "depth"** = altura em que o vidro flutua sobre o conteúdo (Canvas UI). Parâmetro
  físico legível; junto com o de Kube, dá o modelo de duas interfaces que adotamos (§6.3).
- **F0 derivado do IOR** — `((n−1)/(n+1))²` (Canvas UI). Um slider a menos.
- **Dispersão espectral em 6 comprimentos de onda** com pesos RGB (Canvas UI) — modo Ultra.
- **LOD pela pegada da amostra** (`log2(|fwidth(px)|)`) — borra exatamente o necessário onde a
  refração comprime a imagem, e mata o cintilado (Canvas UI).
- **Normal derivada da altura** h(d), não da borda 2D (hic-liquid-glass, liquid-dom).
- **Perfis com derivada analítica**, regra do produto na mistura do "lip" (liquid-dom).
- **Realce em lados opostos** — luz e contraluz com intensidades diferentes (liquid-glass-studio,
  Glass-HQ). Tem explicação física: reflexão interna na face oposta.
- **Highlight só no topo e na base; contorno lateral escuro** (Glass-HQ, regra tirada da Apple) — é
  a "double edge" do pedido.
- **Clarear o tint em espaço perceptual** (LCH) em vez de somar branco (liquid-glass-studio).
- **Sombra em dois termos**: gaussiana larga + contato exponencial (hic-liquid-glass).
- **Dither na saída** contra banding em gradiente suave (liquidGL).

**Arquitetura**
- **Um canvas, um device, um loop** (liquidGL, liquid-dom); storage buffer de shapes com transform
  inverso por shape (liquid-dom).
- **Quad por superfície** (bounding box + margem) em vez de tela cheia (hic-liquid-glass).
- **Bounds acumulados** para limitar blur e métricas à área com vidro (liquid-dom).
- **Loop sob demanda**: o rAF para quando tudo assentou; IntersectionObserver pausa fora da tela;
  `prefers-reduced-motion` e `prefers-reduced-transparency` respeitados (Canvas UI, Liquefy).
- **Orçamento de pixels**: `min(dpr, 2) × zoom`, limitado por `maxTextureDimension2D`, 8192 px por
  lado e 16,7 MP total (Canvas UI).
- **Um encoder e um submit por quadro; cache de pipeline por chave com compilação assíncrona; bind
  groups em cache por identidade; uniforms num write por quadro; timer com ring de query sets**
  (vgpu).
- **Métricas de fundo em luz linear** (média, P10, P50, P90) com readback assíncrono; política de
  tint **fora** do renderer, com debounce de 300 ms e suavização de 500 ms (liquid-dom).
- **Molas semi-implícitas com subpasso fixo ≤ 1/120 s** — dois projetos independentes convergiram
  nisso (glass-effect-webgpu, Liquefy); parada quando |v| e |x−alvo| < ε.
- **"Press" anima o material inteiro**: refração↑, sombra mais curta e mais baixa, especular↑
  (glass-effect-webgpu).
- **Elastic pull medido da borda**, não do centro — itens de tamanhos diferentes reagem como uma
  linha (Liquefy).

**Processo**
- **Testes de invariante numérica por readback de GPU** (Glass-HQ): centro opaco, canto vazio, sinal
  do deslocamento, cápsula sem highlight lateral. Dá para fazer aqui, com SwiftShader.
- **Referência nativa lado a lado** (Glass-HQ): o vidro real da Apple como gabarito.
- **"Refine material definitions rather than adding a user-facing tuning dashboard"** (Glass-HQ) —
  combina com o "não exagere nos parâmetros" do pedido.

---

## 3. Técnicas ruins — o que evitar

| técnica | onde | por quê |
| --- | --- | --- |
| Fragment de **tela cheia** por superfície ou por camada | glass-effect-webgpu (stack: N passes + mipmap completo por instância por quadro) | O(N × tela). Não escala para 10, quanto mais 100. |
| **Uniform monolítico com campos de preset** e lógica de UI no shader | glass-effect-webgpu | Cada componente novo mexe no shader; 110 floats por quadro. |
| **Pirâmide em resolução cheia** e gaussiano de 25 taps em raio 64 | glass-effect-webgpu | 10 texturas full-res (~330 MB em 4K); taps a 5–10 px de distância → bandas. |
| **Regenerar a pirâmide todo quadro** sem saber se o fundo mudou | glass-effect-webgpu (modo DOM) | Desperdício; o evento `paint` já diz o que mudou. |
| **Silhueta sem antialias** (`if d < 0 return bg`) | glass-effect-webgpu | Serrilhado na peça mais visível do material. |
| **Tint como mix ou soma** (`color*1.03 + 0.2`) | glass-effect-webgpu, liquidGL, studio | É o "background-color transparente" que o pedido recusa. |
| **Especular que não nasce da geometria** — faixas de largura fixa, manchas que passeiam no tempo, sparkle, iridescência animada | glass-effect-webgpu, liquidGL, Liquefy | "Efeito para mostrar tecnologia". |
| **Frost por ruído aleatório** de 16 taps com `sin`-hash | liquidGL, hic | Grão instável, sem pirâmide. |
| **Mapa de 8 bits** de deslocamento | Kube, refractive | Degrau de ~0,8 px com 100 px de máximo: escada visível em refração forte. |
| **SVG `backdrop-filter: url()`** como caminho principal | refractive, Glass-HQ, Liquefy | Só Chromium; `CSS.supports` mente (checa sintaxe); exige UA sniff. |
| **1 canvas (ou contexto) por componente** | Canvas UI (canvas), Liquefy (2D por componente) | Teto de contextos, composição pelo navegador, memória por canvas. |
| **Ida e volta GPU ↔ 2D** todo quadro | hic-liquid-glass | Três cópias por quadro. |
| **Posição por parsing de CSS** (regex em `transform`) | hic-liquid-glass | Hack da API antiga; `updateElementGeometry` resolve. |
| **Rasterizador CSS próprio** | liquidGL | 8 mil linhas e ainda incompleto. Para o laboratório não paga. |
| Abstração **pré-1.0 como fundação** | vgpu em Canvas UI e Glass-HQ | Canvas UI ficou preso em ^0.3.1; o 0.6 reescreve partes inteiras. |

---

## 4. Problemas reais encontrados (issues, PRs, comentários de código)

| fonte | problema | lição para nós |
| --- | --- | --- |
| liquidGL #8 | refração **deriva** em páginas longas com várias lentes: o snapshot escondia as lentes (`display:none`) e ficava mais curto que o DOM vivo; as coordenadas vinham do DOM vivo | o layout capturado e o layout vivo têm de ser **o mesmo**; nunca esconder elementos para capturar |
| liquidGL #11 | o FAQ dizia que o SnapDOM cortava páginas longas e falhava no Safari; o mantenedor do SnapDOM testou 11.600 px nos três motores e **não reproduziu** | marketing × engenharia, nos dois sentidos: afirmação sobre concorrente também precisa de versão e teste |
| Canvas UI #42 | filas de entrada **sem limite** enquanto o componente estava fora da tela: 10.000 entradas, **~13 s num único quadro** | filas limitadas, coalescer pointermove, descartar entrada quando pausado |
| Canvas UI #28 / PR #30 | efeitos **quebravam o scroll no celular**: listeners de pointer não-passivos | todo listener `{ passive: true }` salvo quando há `preventDefault` real |
| Canvas UI #47 | Particle Scroll não funcionava no Safari 26.5 (M4) | Safari tem WebGPU, mas os caminhos divergem: testar lá |
| WICG #174 / #179 | quebras: `copyElementImageToTexture` → `drawElementImageToTexture`, `layoutsubtree` → `content="drawable"`, `drawable` obrigatório, `drawElementImage` deixou de devolver DOMMatrix | adaptador com detecção por recurso, nunca por versão |
| WICG #173 | `box-shadow` fora da caixa não é desenhado | usar source rect com margem (outset) |
| WICG #170 (aberta) | ancestrais de elementos desenhados não contam como "na tela": afeta lazy-load, `content-visibility`, IntersectionObserver | não confiar nessas APIs dentro do canvas |
| WICG #148 (aberta) | hit-test é por caixa transformada; não existe "hit-test preciso" | o clique cai onde o elemento **está**, não onde aparece refratado. Aceitável para vidro de UI; é limite real |
| WICG #180, #172 | crash com transição de `clip-path` em webgl2; canvas WebGL parando de atualizar quando movido para dentro | API experimental tem bug de motor; o fallback tem de ser automático |
| liquid-dom #3 (aberta) | fundo preto opaco do canvas: o usuário queria transparente | o renderer que refrata precisa **possuir** o fundo; transparência exige fonte de fundo explícita |
| Liquefy (comentário medido) | calota esférica tem inclinação infinita na borda: o fundo **dobra sobre si mesmo** nas pontas arredondadas; limitaram a compressão em 0,88 | invariante de injetividade (§6.3) |
| refractive / Liquefy (comentário) | `CSS.supports('backdrop-filter','url(#x)')` devolve `true` no WebKit/Gecko e o efeito some | detecção por capacidade real, ou não depender disso |
| hic-liquid-glass (comentário) | `getBoundingClientRect()` devolvia 0 dentro de `layoutsubtree` | resolvido na API nova com `updateElementGeometry`; motivo para o adaptador |

Os repositórios são jovens (de maio a outubro de 2026). glass-effect-webgpu, Glass-HQ e Liquefy
têm 0 ou 1 issue; as limitações reais deles estão no código e foram registradas nas notas.

---

## 5. Matriz comparativa

| sistema | tecnologia | refração | DOM real | WebGPU | física | multi-superfície | desempenho (o que existe de fato) | compatibilidade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| glass-effect-webgpu | TS + WebGPU cru | Snell 1D (Kube) + normal do SDF | HIC (API antiga) + html2canvas | sim | molas 1/120 s, squash por eixo | ≤ 8, loop por pixel na tela inteira | nenhum número; custo estrutural alto (§3) | Chromium (HIC); WebGPU |
| WICG HTML-in-Canvas | API de plataforma | — | **sim, vivo e interativo** | `drawElementImageToTexture` | — | — | evento `paint` só quando muda | Chromium, origin trial |
| Canvas UI | TS + WebGL2 e WebGPU (vgpu) | **Snell 3D com depth; espectral** | HIC via 2D + upload | sim | suavização exponencial | não (1 por componente) | nenhum número; loop sob demanda | HIC só Chrome; resto com fallback |
| liquidGL | JS + WebGPU/WebGL2/WebGL1/CSS | deslocamento paramétrico | rasterizador próprio (estático + regiões) | sim | deformação local | **N lentes, 1 canvas, dynamic offsets** | nenhum número; snapshot da página inteira | todos (cadeia de 4 níveis) |
| Kube | CSS + SVG | **Snell 1D sobre perfil (referência)** | backdrop nativo | não | — | — | — | só Chromium |
| @hashintel/refractive | React + SVG | Kube, 9-slice | backdrop nativo | não | — | 1 filtro por elemento | mapa independente do tamanho | Chromium; blur nos demais |
| hic-liquid-glass | TS + WebGPU + 2D | paramétrica (×30) | HIC (antiga) | sim | — | quad por elemento | 3 cópias por quadro | Chromium flag |
| Glass-HQ/liquid-glass | React + vgpu + SVG | deslocamento de bisel circular | backdrop nativo (nunca captura) | só para gerar mapas | press/motion | até 64 num filtro | mapas em cache por geometria | só Chromium |
| vgpu | biblioteca WebGPU | — | — | sim | — | instancing, bundles | orçamento de bundle no CI | browser + Node (Dawn) + mock |
| Liquefy UI | React + WebGL2 + SVG | potência t² sobre normal do SDF | backdrop nativo | não | **molas com massa, elastic pull, wobble** | N com 1 contexto | nenhum número | só Chromium (refração) |
| liquid-dom | TS + WebGPU | Snell + perfis analíticos | HIC (antiga) | sim | animação de layout | **storage buffer, bounds, união cuidadosa** | **modelo de custo estático** do blur | Chromium flag p/ DOM |
| liquid-glass-studio | React + WebGL2/WebGPU | Snell por ângulo | não | sim | molas no mouse | 2 fixas | nenhum número | WebGL2 em todos |

---

## 6. Comparação por subsistema — e a decisão

Formato: **melhor / segunda / fallback / motivo.** Custos marcados *(modelo)* não foram medidos.

### 6.1 DOM → GPU

| abordagem | qualidade | custo | vivo/interativo | onde roda |
| --- | --- | --- | --- | --- |
| HTML-in-Canvas direto (`drawElementImageToTexture`) | pintura real do navegador (texto em AA cinza) | 1 cópia GPU, só quando `paint` dispara | **sim**, com hit-test e a11y | Chromium OT |
| HTML-in-Canvas via 2D + `copyExternalImageToTexture` | idem | 2 cópias GPU | sim | Chromium OT; API 2D mais estável |
| foreignObject (SnapDOM) | pintura real, assíncrona | 33 ms numa vista de 1200×800 *(dado do autor)* | não (foto) | todos |
| html2canvas | reimplementação JS, incompleta | 303 ms na mesma vista *(dado do autor)* | não | todos |
| rasterizador próprio (liquidGL) | parcial, 8 mil linhas | idle-time, incremental | regiões registradas | todos |
| duplicação de cena | depende de reconstruir o DOM na GPU | — | não | — |
| **cena nativa na GPU** (imagens, vídeo, procedural, texto via Canvas 2D) | total controle | 0 por quadro se estático | n/a | WebGPU |

**Decisão**

| nível | fonte de fundo | motivo |
| --- | --- | --- |
| **Ultra** | HTML-in-Canvas — tenta `drawElementImageToTexture`; se faltar, ponte 2D | único caminho para DOM vivo; invalidação por `changedElements`; `updateElementGeometry` mantém clique e leitor de tela |
| **High** (padrão do laboratório) | cena nativa na GPU | as cenas de teste são nossas; custo zero quando estático; roda em qualquer WebGPU |
| **Fallback de DOM estático** | foreignObject (estilo SnapDOM), sob demanda | ~10× mais rápido que html2canvas e com pintura do próprio navegador |
| **Fallback final** | CSS `backdrop-filter` com SDF desenhado em CSS | sem WebGPU, sem refração; honesto |

**HTML-in-Canvas pode ser o Ultra? Sim, mas não ainda como fundação.** Ele entra atrás de uma
interface `BackgroundSource` (§7.2). Remover ou trocar o HIC é trocar uma implementação dessa
interface; o renderer não sabe de onde vem a textura.

**Fica de fora:** html2canvas (lento e incompleto), rasterizador próprio (custo de manutenção) e
camada WebGL2 (todos os motores já têm WebGPU: Chrome, Safari 26, Firefox 141+ no Windows e 145+ no
macOS).

### 6.2 Forma e geometria

| abordagem | antialias | morph | normal | custo |
| --- | --- | --- | --- | --- |
| CSS `border-radius` | sim | só por CSS | não existe | 0 |
| malha | MSAA | retesselar | por vértice | médio |
| máscara em textura | limitada pela resolução | regerar | diferença finita | memória |
| campo de distância em textura | bom | regerar | gradiente | memória |
| **SDF analítico** | `fwidth`, perfeito | **interpolar números** | **gradiente analítico** | ~20 ALU |
| squircle analítico | idem | idem | idem | +pow |

**Decisão:** SDF analítico de **retângulo com cantos superelípticos**. O expoente do canto é
contínuo: 2 = circular, ~4 = squircle à la iOS (liquid-dom). Segunda opção: o **canto contínuo
ajustado do Glass-HQ** (constante 1,5287 + polinômio), avaliado lado a lado no V1 sobre a cena de
grid. Fallback: CSS radius. Motivo: um descritor só cobre as quatro formas pedidas, e o gradiente
analítico é a normal que a refração precisa.

### 6.3 Refração

| abordagem | qualidade | custo por pixel *(modelo)* | problemas |
| --- | --- | --- | --- |
| deslocamento de UV arbitrário | baixa | 1 amostra | não segue a forma |
| mapa gerado (Kube/SVG) | boa | 1 amostra + mapa | 8 bits, regerar a cada morph |
| **normal + Snell, duas interfaces + gap** | **alta** | ~30 ALU + 1 (ou 3) amostras | dobra na borda se não houver guarda |
| ray marching num height field | alta, auto-oclusão | 16–64 passos + TAA | caro; ganho invisível num slab |
| ray tracing | física completa | proibitivo | — |
| refração screen-space (SSR) | é o que todos fazem | — | só enxerga o que está na textura |

**Decisão:** **normal + Snell analítico com duas interfaces e gap**, amostrando o fundo em espaço
de tela.

```
V = (0,0,−1)                                  observador ortográfico
N = normalize(−h′(x)·∇d, 1)                    normal da altura do bisel, x = d/bevel
t = refract(V, N, 1/n)                        entra no vidro
o₁ = t.xy · (h(x)·bevel + T) / |t.z|          atravessa até a base plana
a = refract(t, (0,0,1), n)                    sai pela base
o₂ = a.xy · G / |a.z|                         atravessa o gap até o conteúdo
uv = p + o₁ + o₂
```

- Com a base plana o modelo é **exato** para um slab: ray marching não acrescenta nada visível.
- `G` (altura de flutuação) também comanda a sombra e o blur da rugosidade: um parâmetro físico, três
  efeitos coerentes.
- **Reflexão interna total na base** (k < 0) não vira "deslocamento 0", como em todos os projetos:
  amostra a reflexão. É a **faixa escura interna** da double edge, com causa física.
- **Invariante de injetividade** — ⚠ **corrigido na implementação do V0.** A proposta acima
  (fator de escala uniforme por superfície) foi **refutada pela medição**: com o material padrão
  (T = 14, G = 8, bisel 22, n = 1,5), a física dobra a imagem só nos ~9 px externos, mas a
  escala uniforme precisava cair para **2,5%** da refração para eliminar a dobra — o vidro deixava
  de refratar. **Decisão em vigor:** tabela radial por superfície (64 amostras, densas na borda),
  calculada na CPU, com **envelope monótono** de dentro para fora. Ele mantém a física onde ela já
  é injetiva e transforma a dobra na compressão máxima permitida (0,88). A GPU lê a tabela
  (`storage buffer`). Testado por readback: sem o envelope a amostra anda ≥ 3 px para trás; com
  ele, nunca.
- Pior caso: ~30 ALU + 3 amostras com dispersão. O custo real está na amostra de textura, não na
  conta.

### 6.4 Blur e rugosidade

| abordagem | qualidade | custo *(modelo)* | rugosidade variável por pixel |
| --- | --- | --- | --- |
| CSS blur | ok | do navegador | não |
| gaussiano multipasso full-res | ótima | 2·S leituras/px por raio | não (um raio por passe) |
| Kawase | boa | barata | não |
| **dual filter** (Bjørge, ARM 2015) | boa, feita para mobile | ~2,7 A *(modelo liquid-dom)* | via níveis |
| mipmap box | blocos, cintila | barato | sim |
| **pirâmide com downsample de 13 taps + amostra bicúbica** | **boa e contínua** | 4/3 da textura, **só quando o fundo muda** | **sim** |

**Decisão:** **pirâmide de downsample na própria cadeia de mips da textura de fundo**:

- filtro de 13 taps (Jimenez, 2014) para gerar cada nível;
- leitura com `textureSampleLevel(lod)` e filtragem bicúbica B-spline (4 leituras bilineares) no
  Ultra e no High, bilinear no Low.

O LOD de cada pixel é `max(f(rugosidade, G), log2(pegada))`: a mesma pirâmide atende todas as
superfícies, vidro limpo, regular e fosco, rugosidade progressiva até a borda e o antialias da
compressão.

- **Segunda opção:** blur por nível com upsample (liquid-dom), se a descontinuidade entre níveis
  aparecer na captura.
- **Fallback:** mip box + bilinear.
- **Regenerar só quando o fundo muda**, e só dentro dos bounds do vidro expandidos pelo raio máximo.

### 6.5 Especular e Fresnel

**Decisão:**

- **Fresnel:** Schlick com F0 derivado do IOR.
- **Reflexão:** um **ambiente analítico de estúdio** (céu em gradiente + 2 luzes de área suaves,
  função do vetor refletido), sem cubemap.
- **Luz principal:** lobo **GGX** cuja largura vem da mesma rugosidade do blur.
- **Contraluz:** um **segundo lobo** do lado oposto, atenuado por (1−F)·R_interna — a reflexão
  interna na face oposta, que explica o realce diagonal oposto da Apple.

O resto da decisão:

- **Segunda opção:** Blinn-Phong com expoente da rugosidade (diferença visual mínima; GGX custa ~10
  ALU a mais, irrelevante).
- ⚠ **Corrigido na implementação do V1, por medição:**
  - **GGX com lobo estreito** dava um realce de **1 px** sobre o bisel squircle: a linha branca de
    CSS que o pedido recusa.
  - **GGX alargado** até a largura certa vazava a cauda para o topo plano: no fundo escuro, o
    interior subia de 0,12 para 0,34.
  - **Decisão em vigor:** a luz principal é uma **luz de área em disco** (raio angular 0,22 rad, borda
    suave, alargada pela rugosidade), vezes Fresnel(v·h), com radiância HDR 18× a do conteúdo. O
    realce vira uma faixa que segue o bisel e fica em zero no plano.
  - ⚠ **Corrigido no V4.1 (§15.6):** a luz principal desceu para 6° acima do plano (era 20°), o
    disco estreitou de 0,22 para 0,14 rad e a contraluz caiu de 0,38 para 0,15: o realce virou uma
    linha de 5 px colada na borda, e a base, 33% do topo.
  - **O ambiente refletido é o próprio conteúdo:** o mip mais alto da pirâmide, que escurece para o
    horizonte. Assim o reflexo pega a cor do que está atrás, como a HIG descreve.
  - **Contraste de borda** (pedido no documento original como "edge intensity" e reforçado pelo
    Liquid Glass 27): a luz transmitida escurece com 0,7·edge·√(1 − N·V). É derivado da inclinação,
    então não tem largura fixa e some no plano.
- **Fica de fora:** reflexão da própria página (SSR plano, Canvas UI) como fonte principal, porque o
  vidro vira espelho do que está atrás. Fica como termo fraco opcional.
- **Fallback:** borda de 1 px por CSS.

### 6.6 Física

| técnica | necessária? | motivo |
| --- | --- | --- |
| mola de posição | **sim** | segue o ponteiro com inércia; overshoot sutil |
| mola de escala e de forma (morph) | **sim** | press, hover, transição entre formas |
| deformação pela velocidade | **sim** | estica **ao longo do vetor velocidade** (não por eixo, como glass-effect-webgpu), preservando a área, com teto |
| elastic pull (Liquefy) | sim, opcional | dock e tabs reagindo como uma linha |
| pressão do ponteiro em height field | V5 | amplitude mínima; risco de "geleca" |
| equação de onda (height field) | V5 | modo "gel" experimental, compute a ¼ da resolução |
| Navier-Stokes simplificado | **não** | é para fumaça e tinta (Canvas UI Liquid: ~10 passes por quadro); vidro não escoa |
| Verlet | não | equivale a Euler semi-implícito para molas, sem ganho |

**Integrador:** Euler semi-implícito com subpasso ≤ 1/240 s (o monitor de referência é de 240 Hz) e
dt limitado a [1/240, 1/15].

**Parametrização da mola:**

- A interface expõe **tempo de resposta + razão de amortecimento**, estilo SwiftUI, e converte
  internamente para k e c com m = 1.
- **Sobre "mass":** numa mola isolada só k/m e c/m importam, então são 3 sliders para 2 graus de
  liberdade.
- A massa volta a ter efeito quando há **forças** em vez de alvos: arrasto por "corda" elástica,
  colisão e fusão. Ela entra como "peso" no modelo de interação, não na mola.

### 6.7 Muitas superfícies (10 / 20 / 50 / 100)

| abordagem | 10 | 50 | 100 | problema |
| --- | --- | --- | --- | --- |
| um draw por superfície | ok | CPU sobe | setBindGroup/draw ×100 | overhead de API |
| uniform por superfície (dynamic offset) | ok | ok | ok | limite de 64 KB, 1 draw cada (liquidGL) |
| **storage buffer + instancing** | ok | ok | ok | — |
| atlas de textura | — | — | — | não temos textura por superfície |
| pré-processamento em compute (tile binning) | desnecessário | talvez | sim, se houver muita sobreposição | complexidade |

**Decisão:** **storage buffer `array<Surface>`** (≤ 128 B por superfície) + **um draw instanciado**.

- O vertex shader expande o AABB de cada instância (forma + deformação + sombra), e o fragment só
  roda onde há vidro.
- **Grupos de fusão** viram uma instância com faixa de índices; o fragment percorre só o grupo.
- 100 superfícies = 12,8 KB por quadro num `writeBuffer`.
- Tile binning em compute fica para o V5, e só se um grupo de fusão passar de ~32 membros.

**Camadas:** vidro sobre vidro exige recompor o fundo da camada de baixo e regerar a pirâmide da
região. Até o V3, uma camada só (a Apple também desaconselha vidro sobre vidro); no V4, camadas com
pirâmide regional.

### 6.8 Smooth union

| smin | continuidade | suporte | ordem (N>2) | problema |
| --- | --- | --- | --- | --- |
| `min` | C⁰ | — | independe | sem fusão |
| quadrática (iq) | **C¹** | finito (\|a−b\|<k) | quase | curvatura salta → **vinco na refração** |
| **cúbica (iq)** | **C²** | finito | quase | — |
| exponencial / log-sum-exp | C^∞ | infinito | independe | afeta formas distantes, encolhe |
| conservadora (liquid-dom) | C¹ remapeada | finito, profundidade ≤ 0,25k | — | a mais protegida contra inchaço |

**Decisão:**

- **smin cúbica (C²)**, com o **gradiente da união = mistura dos gradientes pelos pesos derivados**
  (analítico, sem diferença finita da união).
- Motivo: a magnificação da refração é proporcional à curvatura, então com C¹ o vinco aparece na
  imagem refratada.
- **Contra artefatos**, se aparecerem na captura: (1) a porta de ângulo entre normais do liquid-dom
  e (2) a redução de k por área submersa.
- **Fallback:** quadrática.

### 6.9 Morph

Nenhum projeto faz circle → capsule → squircle → panel de forma contínua (glass-effect-webgpu
mistura dois SDFs no split menu; liquid-dom tem só a suavização de canto). **Definição nossa:**

```
Shape { center, halfSize, radius, cornerExponent, rotation }
circle  = halfSize iguais, radius = halfSize, expoente 2
capsule = radius = min(halfSize)
squircle= expoente ~4
panel   = halfSize grande, radius pequeno, expoente 2..4
radius ≤ min(halfSize) sempre (garantido pela CPU)
```

Morph = mola em cada número. Uma só superfície muda de forma sem trocar de elemento, e a guarda de
injetividade (§6.3) é recalculada quando a forma assenta.

### 6.10 Memória de GPU (1920×1080, DPR 1 · 2560×1440)

| recurso | formato | tamanho | quando |
| --- | --- | --- | --- |
| fundo + pirâmide (mips) | rgba8unorm-srgb (High) / rgba16float (HDR) | 11 MB · 19,7 MB (×2 em 16f) | recriado só em resize |
| captura HIC | escreve direto no mip 0 do fundo | 0 extra | — |
| saída | swapchain | do navegador | — |
| height field (V5) | 2× r16float a ¼ | 0,5 MB · 0,9 MB | ping-pong |
| histórico TAA (V5) | 2× rgba16float | 33 MB · 59 MB | só se entrar |
| debug | — | 0 (é ramo de shader) | — |

**Pool:** texturas por chave (tamanho, formato, uso, mips), recriadas só em resize, com debounce.
Bind groups em cache, invalidados quando a textura troca. **Nada é criado ou destruído por quadro**;
o painel mostra o total alocado.

### 6.11 Orçamento de quadro

- O monitor de referência é de **240 Hz**: o fps satura em 240 e não informa nada. O painel mostra
  **ms de CPU e de GPU por passe**.
- Metas, a validar no RX 6600 com o bench (§9), a 1440p:
  - **High**: vidro + pirâmide ≤ 2 ms de GPU com 10 superfícies cobrindo ~20% da tela (cabe nos
    8,33 ms de 120 fps com folga);
  - **Ultra** ≤ 4 ms.
- O `timestamp-query` é quantizado em 100 µs fora do flag `enable-webgpu-developer-features`: medir
  com o flag ligado e reportar médias de muitos quadros.

### 6.12 Mobile e GPUs integradas

Não há dispositivo móvel aqui, então isto é projeto, não medição:

- **GPUs de tiles** cobram por passe e por banda:
  - poucos passes;
  - `loadOp: 'clear'` ou `'load'` só quando necessário;
  - pirâmide só nos bounds;
  - nenhum alvo intermediário de tela cheia no caminho Low.
- **Calor:** a qualidade adaptativa olha a média móvel do tempo de GPU com histerese e período de
  resfriamento, e não reage a um quadro isolado.
- **DPR alto** (iPhone = 3): teto por nível (§6.13).

### 6.13 DPI

```
effectivePixelRatio = min(devicePixelRatio, tetoDoNível) × pinchZoom
                      limitado por maxTextureDimension2D, 8192 px/lado e 16,7 MP
tetoDoNível: Ultra 2 · High 2 · Medium 1,5 · Low 1
```

- A **renderScale adaptativa não reduz o canvas inteiro**, porque isso borraria o texto do fundo.
- Ela age primeiro na **base da pirâmide** (começar no mip 1), nas amostras (dispersão 6→3→1,
  bicúbico→bilinear) e só por último no DPR.

### 6.14 Frame graph

**Vale a pena, pequeno** (~100 linhas). É uma lista ordenada de passes, cada um com:

- `enabled(frame)`;
- recursos lidos e escritos, pegos do pool;
- um span de timestamp.

Um encoder e um submit por quadro. Sem aliasing automático nem barreiras (o WebGPU sincroniza). O
que ganhamos: tempo por passe de graça, ligar e desligar passes por nível de qualidade, e modos de
debug.

```
Capture → Pyramid → (Physics compute) → Glass → (Temporal) → Present
 só se mudou   só se mudou       V5                   V5
```

### 6.15 Debug

Visualizações pedidas: SDF, normal, espessura, UV refratado, Fresnel, LOD de rugosidade, especular,
dispersão, height field, nível de blur, mais **injetividade** (pinta onde |∂o/∂d| passa de 0,88).

- Selecionadas por uniform (`debugView`, fluxo uniforme, troca instantânea).
- Compiladas para fora em produção com `override ENABLE_DEBUG = false`.

### 6.16 Hot reload de WGSL

**Viável:** Vite importa `.wgsl?raw` e o `import.meta.hot.accept` recria módulo e pipelines.

- `getCompilationInfo()` antes de trocar; erro mantém o pipeline antigo e mostra linha e coluna num
  overlay.
- Nada recarrega a página, e o estado físico continua onde estava.

---

## 7. Arquitetura proposta

### 7.1 Camadas

```
lab/ (página)  →  controles agrupados: Optics · Surface · Lighting · Physics · Performance
     │
     ├─ input/        ponteiro (passivo, coalescido, fila limitada), arrasto, hit-test pelo SDF na CPU
     ├─ physics/      molas, deformação pela velocidade, morph — estado único, lido pelo shader e pelo DOM
     ├─ renderer/     device, pool, frame graph, timers, qualidade adaptativa
     │    ├─ sources/   BackgroundSource: native · html-in-canvas · raster
     │    └─ passes/    pyramid · glass · (heightfield) · (temporal)
     └─ shaders/      sdf.wgsl · profile.wgsl · optics.wgsl · lighting.wgsl · glass.wgsl · pyramid.wgsl
```

### 7.2 Interface de fonte de fundo

```ts
interface BackgroundSource {
  readonly kind: "native" | "html-in-canvas" | "raster";
  attach(ctx: SourceContext): Promise<void>;      // pode lançar → próximo da cadeia
  /** escreve no mip 0 se mudou; devolve o retângulo sujo para a pirâmide */
  update(frame: FrameInfo, target: GPUTexture): { changed: boolean; dirty?: Rect };
  detach(): void;
}
```

O renderer não conhece HTML-in-Canvas. A cadeia `[html-in-canvas, native]` é escolhida em runtime
por **capacidade** (`typeof queue.drawElementImageToTexture`, `"content" in canvas`), nunca por
versão.

### 7.3 Material

```
GlassMaterial
  optics:   ior (1,0–2,0) · abbe (dispersão; 20–90) · thickness T (px) · gap G (px)
  surface:  profile (convexo · squircle · lip) · bevel (px) · roughness (0–1)
  medium:   tint (cor linear) · density σ (Beer–Lambert)
  lighting: keyLight (direção, intensidade) · environment (intensidade)
  shadow:   strength           — suavidade e deslocamento DERIVADOS de G
interaction (fora do material): response · dampingRatio · deformation · pressScale
```

**Derivados, sem slider:**

- F0, de IOR;
- dispersão, de Abbe;
- raio do blur, de rugosidade × G;
- sombra, de G;
- escurecimento e saturação da borda, de σ × caminho óptico.

**Presets:** Clear, Regular, Frost, Crystal, Liquid. Ficam ~13 parâmetros, todos com significado
físico; o pedido aceita isso e recusa 80.

### 7.4 Pilha

- **TypeScript** com `strict` e `erasableSyntaxOnly`: os tipos são só anotação e o código continua
  convertível em JS puro.
- **Vite** só como servidor de desenvolvimento (WGSL + HMR).
- **Zero dependência de runtime.** Three.js, vgpu, WASM e Rust ficam de fora até alguma justificativa
  aparecer.

---

## 8. Decisões técnicas — o quadro

| subsistema | melhor | segunda | fallback | motivo |
| --- | --- | --- | --- | --- |
| Renderer | **WebGPU cru, compartilhado** (1 device, 1 canvas, 1 loop) | vgpu | CSS | controle fino; vgpu pré-1.0 |
| DOM → GPU | **HTML-in-Canvas** (direto → ponte 2D) | foreignObject sob demanda | cena nativa | único DOM vivo; API instável atrás de interface |
| Fundo padrão | **cena nativa** | — | — | custo 0 estático |
| Forma | **SDF analítico, canto superelíptico** | canto contínuo do Glass-HQ | CSS radius | morph = números; normal analítica |
| Refração | **Snell, 2 interfaces + gap, screen-space** | mapa 1D por material | deslocamento simples | exata para slab; TIR vira double edge |
| Injetividade | **guarda na CPU por superfície (0,88)** | clamp no shader | — | sem dobra por construção |
| Dispersão | **Abbe, 3 amostras** (Ultra: 6 espectrais) | aberração fixa | nenhuma | sutil por física, só onde desvia |
| Blur/rugosidade | **pirâmide de mips 13-tap + bicúbica** | blur por nível (liquid-dom) | mip bilinear | rugosidade por pixel; custo só quando muda |
| Fresnel/especular | **Schlick(F0 do IOR) + ambiente analítico + GGX + contraluz** | Blinn-Phong | borda CSS | nasce da geometria |
| Tint | **Beer–Lambert pelo caminho óptico** | mix | — | não é background-color |
| Sombra | **SDF analítico: gaussiana + contato, de G** | — | box-shadow | 0 textura |
| Física | **molas (resposta + amortecimento), subpasso ≤ 1/240** | analítica | CSS transition | estável a 30 e a 240 Hz |
| Deformação | **pela velocidade, área preservada, com teto** | por eixo | nenhuma | arrasto diagonal correto |
| Multi-superfície | **storage buffer + instancing + AABB** | dynamic offsets | — | 100 superfícies, 1 draw |
| Smooth union | **smin cúbica C² + gradiente misturado** | conservadora (liquid-dom) | quadrática | refração enxerga curvatura |
| Morph | **descritor único + molas** | — | troca instantânea | contínuo por definição |
| Memória | **pool por chave, cria só em resize** | — | — | nada por quadro |
| Qualidade | **tempo de GPU com histerese → níveis** | fps | fixo | 240 Hz satura o fps |
| DPI | **teto por nível × pinch, orçamento de MP** | — | dpr 1 | iPhone dpr 3 |
| Frame graph | **lista de passes com enabled/spans** | passes fixos | — | timing e debug de graça |
| Debug | **uniform debugView + override para remover** | pipelines separados | — | troca instantânea |
| Hot reload | **Vite HMR + getCompilationInfo** | recarregar a página | — | iterar no shader sem perder estado |
| Testes | **readback com invariantes (Playwright + SwiftShader)** | só captura | — | roda aqui |

---

## 9. Riscos

| risco | probabilidade | efeito | mitigação |
| --- | --- | --- | --- |
| HTML-in-Canvas muda de novo ou o OT acaba | alta | Ultra quebra | adaptador por capacidade; ponte 2D; cena nativa sempre disponível |
| Não dá para medir desempenho aqui (SwiftShader) | certa | decisões sem número | **página de bench** gera JSON; você roda no RX 6600 e cola; aqui só correção |
| Timestamp quantizado (100 µs) | certa sem flag | GPU ms grosseiro | flag de desenvolvedor no bench; médias de 120+ quadros |
| Descontinuidade visível entre níveis da pirâmide | média | rugosidade "pula" | bicúbica; teste de rampa de rugosidade na cena de grid |
| Dobra na borda (não injetivo) | alta sem guarda | espelho na quina | guarda na CPU + visualização de debug |
| Vinco na união | média | refração quebrada no "pescoço" | smin C²; porta de ângulo se precisar |
| Safari/Firefox divergem | média | aparência diferente | testes de readback são agnósticos; revisão visual por motor antes de fechar cada V |
| Mobile não testado | certa por ora | térmico, banda | caminho Low sem intermediários; pedir um aparelho para o V4 |
| Artigo da Kube inacessível daqui (rede bloqueia kube.io e arquivos) | certa | matemática lida pelo código do refractive | conferir o texto quando a rede permitir |
| TypeScript + Vite = passo de build | baixa | dependência de dev | `erasableSyntaxOnly`; nada em runtime |

---

## 10. O que implementar primeiro

### V0 — fundação (código funcionando, não só plano)

1. Vite + TS estrito; página do laboratório com o layout final (área central grande, painéis
   recolhíveis, rodapé de métricas), ainda com poucos controles.
2. `gpu/`: adapter e device, `timestamp-query` opcional, `device.lost` → recriar tudo, info do
   adapter no painel.
3. `renderer/`: pool de texturas, frame graph mínimo, um encoder/submit, timers por passe, laço sob
   demanda.
4. `sources/native`: cenas Color, Text (Canvas 2D → textura), Image e Grid.
5. Storage buffer de superfícies (uma, já no formato final) + draw instanciado com AABB.
6. `glass.wgsl`: SDF superelíptico com AA, perfil squircle com derivada analítica, Snell de duas
   interfaces + gap, guarda de injetividade.
7. Painel: fps, ms de CPU, ms de GPU por passe, DPR efetivo, backend, adapter, superfícies,
   qualidade, memória alocada.
8. Debug views: SDF, normal, UV refratado, injetividade.
9. Hot reload de WGSL com overlay de erro.
10. `npm test`: Playwright + SwiftShader, readback com invariantes (centro sem deslocamento, sinal
    do deslocamento na borda, cobertura AA, injetividade) + capturas em `captures/`.
11. `bench.html`: cenários fixos (1/10/20/50/100 superfícies × 4 cenas × níveis), saída JSON.

### V1 — vidro óptico

- pirâmide 13-tap + rugosidade bicúbica + LOD por pegada;
- Fresnel (Schlick), ambiente analítico, GGX, contraluz;
- Beer–Lambert;
- dispersão por Abbe (3 amostras; 6 no Ultra);
- sombra analítica;
- presets Clear, Regular, Frost e Crystal;
- comparação de cantos (superelipse × Glass-HQ) na cena de grid;
- primeira rodada de bench no RX 6600.

### Depois

- **V2:** física.
- **V3:** muitas superfícies, smooth union e morph.
- **V4:** HTML-in-Canvas, métricas de fundo, qualidade adaptativa e camadas.
- **V5:** height field, compute, caustics (densidade 1/|det J| do mesmo deslocamento), HDR e técnicas
  temporais.

---

## 11. Revisão após a pesquisa externa (ChatGPT, 06/10/2026)

Cada afirmação foi conferida antes de entrar. Entrou o que foi confirmado ou o que custa pouco e
melhora o projeto.

| afirmação | conferência | decisão |
| --- | --- | --- |
| Kube usa **uma** refração, sem gap; derivada numérica | bate com o código do refractive (§ notas 05); o relatório já tratava o modelo de duas interfaces como extensão nossa (§2, §6.3) | registrado: **Kube = referência matemática; duas interfaces + gap = extensão nossa** |
| iOS/macOS 27: mais difusão de conteúdo complexo, **borda escurecida**, **especular mais forte**, slider global de intensidade | **confirmado** (MacRumors, 10/06/2026). Também confirmado: o especular giroscópico dos ícones saiu e o realce fica em cima e embaixo | **alvo visual passa a ser o Liquid Glass 27**; reforça luz fixa e vertical e a recusa do especular animado (§3) |
| Chrome em ciclo de 2 semanas (153 em 08/09, 154 em 22/09) | **confirmado** | API do HIC muda mais rápido: o adaptador é obrigatório |
| OT do HTML-in-Canvas vai até o Chrome 160 | **não confirmado**: a página do OT no Edge indica expiração em 20/10/2026 | sem efeito no laboratório (usamos o flag local); só importa para publicar |
| Vidro maior simula material mais espesso: sombra mais funda, lente mais forte, espalhamento mais suave (WWDC25) | plausível (sessão "Meet Liquid Glass"); é regra de design, não física | **entra**: resposta ao tamanho calculada na CPU (§11.1) |
| HIG: por padrão o vidro **não tem cor própria** | plausível, coerente com a HIG; não confirmado palavra por palavra | **entra**: tint intrínseco neutro por padrão |
| `environmentColorPickup` como conceito separado | a cor do ambiente **já é** a luz refratada e borrada; um botão para isso seria um parâmetro falso | **recusado**. O que a Apple faz além disso é vibração (saturação da luz transmitida): vira política do Regular, derivada, sem slider |
| Regular × Clear como **políticas**, não presets | confirmado: Clear não tem comportamento adaptativo e pede camada de escurecimento sobre conteúdo claro (o "35%" não foi confirmado no texto) | **entra**: `variant` no material (§11.1) |
| slider de "clareza" coordenando 7 propriedades | útil se não inventar física | **entra como interpolação** entre dois materiais completos (Clear ↔ Tinted): um número, nenhum caso especial no shader |
| bounce curto ao clicar, sem wobble contínuo | coerente com §6.6 e com a recusa do wobble do Liquefy | regra de interação |
| iluminação de referência vertical, de cima | coerente com o Glass-HQ (`abs(n.y)`) e com o iOS 27 (realce em cima e embaixo) | preset `APPLE_REFERENCE` de luz |

### 11.1 Mudanças no material (§7.3)

```
GlassMaterial
  variant:  regular | clear            — política: regular adapta luminância, difusão e
                                         vibração ao fundo (V4); clear não adapta e aceita
                                         escurecimento local
  medium:   intrinsicTint = neutro por padrão · density σ
  …resto como em §7.3
sizeResponse (CPU, padrão ligado, sobrescrevível):
  menor lado da forma → T, bevel, G e rugosidade por uma curva monotônica;
  recalcula a guarda de injetividade quando a forma assenta
appearance (0..1): interpolação entre o material Clear e o Tinted da variante
```

### 11.2 Critério de aceite do V1, medido por readback (não por opinião)

- borda escurecida **legível sobre fundo claro e sobre fundo escuro**: contraste da faixa interna
  medido nas duas cenas, acima de um limiar fixado na primeira rodada;
- realce especular com intensidade que **varia com N·L**: o pico fica no lado da luz e cai ao girar
  a luz;
- **nenhuma linha branca de largura constante**: a largura do realce varia ao longo do contorno;
- sem dobra: o debug de injetividade fica vazio em todas as cenas.

---

## 12. Pedidos para o pesquisador (ChatGPT)

O que faltou e vale buscar, pela ordem:

1. o **texto** do artigo da Kube (bloqueado daqui), para conferir com o código do refractive;
2. o blog do Chrome **"HTML-in-Canvas updates"**: versões exatas do OT, data de fim, o que mudou no
   Chrome 155;
3. qualquer **medição publicada** de `backdrop-filter` × WebGPU para vidro (resolução, GPU, ms);
4. **Apple HIG / WWDC 2025** sobre Liquid Glass: regras de luz, contraluz, vidro sobre vidro,
   adaptação ao fundo — para virar critério de revisão visual;
5. **capturas do vidro real** (iOS 26 / macOS Tahoe) sobre fundos de grid e texto, como gabarito.

---

## 13. V3: o que foi medido e decidido (07/10/2026)

### 13.1 Bench do V2 na RX 6600 ([`docs/bench/v2-rx6600.json`](../bench/v2-rx6600.json))

- O vidro custa **~0,84 ms por tela cheia coberta** (1500×1080, DPR 1), linear na área. Não há
  custo fixo por superfície: 1 cápsula a 0,7% da tela dá a mesma taxa por pixel que 100 a 36%.
- Fundo 0,022 ms; pirâmide refeita todo quadro 0,064 ms; CPU < 0,1 ms. Pior caso 0,39 ms contra
  4,17 ms do quadro a 240 Hz.
- `high` = `low` porque os níveis só mudavam o teto de DPR e o monitor é DPR 1. Corrigido em §13.4.

### 13.2 Grupos de fusão (§6.7 e §6.8 implementados)

- **Um grupo = uma instância** do draw, com faixa de índices; o fragment percorre só os membros do
  grupo. Superfícies soltas são grupos de um membro, com o mesmo custo de antes (testado: grupo com
  espaçamento 0 é idêntico, pixel a pixel, a superfícies soltas).
- **smin cúbica (C²)** na normalização em que `k` é o quanto a união afunda em a = b: dois vidros
  se tocam quando o vão fica abaixo de 2k, e a interface expõe esse vão ("distância de fusão").
- **Gradiente exato**, sem diferença finita: d smin/db = t, e o gradiente da união é a mistura
  corrente dos gradientes por t. Os mesmos pesos misturam o material (um vidro tingido que se
  funde com um claro tinge o pescoço) e as **tabelas radiais de cada membro**, lidas na
  profundidade da união — a física continua na CPU, por superfície.
- **O comprimento do gradiente não é renormalizado** na óptica. A superfície do vidro fundido é
  h(−união), cuja inclinação é h′·|∇união|; o deslocamento da tabela escala por |∇|, exato em
  primeira ordem. No cume de um pescoço |∇| → 0 e o deslocamento some de forma contínua. Com o
  gradiente normalizado, o deslocamento troca de sinal no cume: o teste "sem vinco" mede 9 níveis
  de salto entre pixels vizinhos com ele e ≤ 4 sem ele. Só a cobertura (antialias) usa d/|∇|.
- Espelho TS em `src/glass/union.ts`; paridade GPU × CPU por readback dentro do pescoço e na
  zona de mistura (tolerância de 2,5 px, a largura de um byte da vista de amostra).
- Até 4 membros por pixel misturam óptica (`MAX_BLEND`); acima disso o mais fraco sai e os pesos
  são renormalizados. Na prática 4 vidros a menos de 6k uns dos outros num mesmo pixel é raro.
- Limite conhecido: a guarda de injetividade é radial, por superfície. Na concavidade de um
  pescoço fino não há guarda geométrica; as capturas e o teste de saltos não mostraram dobra.

### 13.3 Morph

Cada campo do descritor de forma (meia-largura, meia-altura, raio, expoente, rotação) é uma mola
(resposta 0,42 s, ζ = 0,74). Trocar a forma no dock anima; os sliders de forma seguem na hora
(`snap`). Durante o morph a tabela radial da superfície é refeita a cada quadro (microssegundos).

### 13.4 Níveis de qualidade

| nível | DPR máx. | dispersão | leitura do borrado |
| --- | --- | --- | --- |
| Ultra | 3 | 3 amostras (R, G, B) | bicúbica |
| Alta | 2 | 3 amostras | bicúbica |
| Média | 1,5 | 3 amostras | bicúbica |
| Baixa | 1 | 1 amostra | bilinear |

Medido lado a lado (Cristal, 560×300): **Alta × Baixa** muda 10–20 de 255 níveis em centenas de
pixels, só na borda (teste). **Dispersão espectral** (6 comprimentos de onda, cada um com sua
própria refração e guarda na CPU, pesos do observador CIE 1931 levados a sRGB linear) foi
implementada para o Ultra e **rejeitada**: contra R, G, B mudou no máximo 2–5 níveis no Cristal e
10 níveis num vidro exagerado (n = 1,9, V = 20). Não aparece na captura; não vale 3 amostras a
mais. Com isso Ultra só difere de Alta em telas de DPR > 2.

### 13.5 Interface

Pedido: mais minimalista e mais fácil de entender. O palco ocupa a tela inteira; o vidro é a
interface.

- **Dock** embaixo com quatro perguntas rotuladas: Fundo (miniaturas pintadas pelas próprias
  cenas), Forma (ícones), Material (cinco nomes), Vidros (adicionar, remover).
- **Ajustes** numa gaveta, em linguagem comum ("Refração", "Borda curva", "Fosco", "Cor nas
  bordas"), com o termo técnico no valor (n 1,50, V 55) e a explicação no tooltip.
- **Métricas** recolhidas numa pílula (fps · GPU ms) que abre o detalhe.
- Uma dica de uma linha ("arraste… solte perto do outro para fundir") que some no primeiro arrasto.
- Começa com dois vidros afastados, para que a primeira coisa a fazer seja juntá-los.
- `tests/ui-shot.mjs` fotografa a interface sobre o vidro renderizado fora da tela (o canvas do
  laboratório não apresenta neste contêiner).

### 13.6 Polimento e bugs (auditoria depois do V3)

| defeito | correção | teste |
| --- | --- | --- |
| vidro arrastado para fora da tela (ou para baixo do dock) se perdia | o centro fica dentro do palco e acima do dock; volta na mola | `lab-ui`, `physics` |
| janela menor deixava vidros fora | `ResizeObserver` do laboratório reaplica o limite | `lab-ui` |
| canvas não acompanhava troca de monitor (DPR) nem zoom de pinça | `matchMedia(resolution)` re-armado e `visualViewport` | — (precisa de dois monitores) |
| a física desenhava um quadro atrasada (dois laços de `requestAnimationFrame`) | o passo da física roda dentro do quadro do renderer (`onBeforeFrame`) | — |
| alt-tab no meio do arrasto deixava o vidro "apertado" | `lostpointercapture` encerra o arrasto | — |
| métricas abriam por cima da gaveta | ficam ao lado dela | `lab-ui` |
| "Altura" significava duas coisas (forma e flutuação) | a flutuação virou "Elevação" | `lab-ui` (nomes únicos) |
| slider acima do limite da geometria não fazia nada, calado | o valor mostra o efetivo e o porquê ("30 px · limite do canto") | `lab-ui` |
| forma do dock continuava marcada depois de ajustar a forma à mão | ajuste manual desmarca | `lab-ui` |
| foto num formato que o navegador não lê (HEIC) quebrava calada | aviso de 4 s, cena atual mantida | — |
| realce terminava seco onde a borda se afasta da luz (pescoço da fusão) | borda do disco de luz 0,06 → 0,14 rad; o topo plano continua apagado (testes de aceite) | `material` |

O teste da interface roda sem WebGPU. Duas lições do próprio teste: o aviso "WebGPU indisponível"
cobria o vidro e engolia o arrasto (o teste passava sem testar), e um elemento oculto tem retângulo
zero e "não sobrepõe" nada. Cada teste foi conferido contra o código antigo: falha nele e passa no
novo.

### 13.7 Bench do V3 na RX 6600 e o conserto ([`docs/bench/v3-rx6600.json`](../bench/v3-rx6600.json))

| caso (1500×945, DPR 1) | V2 | V3 |
| --- | --- | --- |
| vidro solto, por pixel coberto | 0,52 ns | **0,88 ns** (+70%) |
| 100 soltos, 38% da tela | — | 0,47 ms |
| 20 em grupos de 4 / os mesmos soltos | — | **1,52 ms** / 0,16 ms |
| 100 em grupos de 4 / os mesmos soltos | — | **2,61 ms** / 0,47 ms |
| Baixa × Alta (100 soltos) | — | 0,44 × 0,47 ms |
| em movimento, 50 vidros: CPU | — | 0,12 ms |
| pirâmide refeita por quadro | 0,064 ms | 0,061 ms |

Duas regressões, e as duas eram do shader, não da física:

1. **O vidro solto pagava pela fusão.** Um só ponto de entrada servia os dois casos, e o orçamento
   de registradores de um shader é o do seu caminho mais pesado (a mistura de até 4 membros, com
   vetores indexados em tempo de execução, que podem ir para memória de rascunho). Conserto: **dois
   pipelines** do mesmo módulo — `fs_single` (o caminho enxuto do V2) e `fs_union`. Um grupo que
   não pode fundir (um membro ou espaçamento 0) é desenhado pelo enxuto; os registros soltos vêm
   primeiro, os grupos depois (`firstInstance`).
2. **O grupo desenhava área demais.** A margem do retângulo era k·(n−1) em volta do grupo inteiro,
   e cada pixel avaliava 4 membros × 3 vezes (forma, sombra fora, sombra vista através) antes de
   ser descartado. No bench os retângulos cobriam ~2× a tela. Conserto: **margem k·min(n−1, 2)**
   (a união afunda até k onde dois membros se encontram, 2k onde três; só entre membros) e
   **descarte antecipado**: a distância à caixa de cada membro é um limite inferior da distância;
   longe de todas, o pixel sai antes da união. Os laços da mistura passaram a ter tamanho fixo,
   escritos por máscara de faixa (sem índice dinâmico).

As capturas de fusão e de vidro solto ficaram **idênticas pixel a pixel** às de antes do conserto.
O bench também mudou: os grupos de 4 quebravam de uma linha para a outra (um retângulo de duas
linhas, caso irreal); agora são barras dentro da linha. A confirmação do ganho é o próximo bench.

**Confirmado no bench completo** ([`docs/bench/v3.1-rx6600-completo.json`](../bench/v3.1-rx6600-completo.json),
1500×1080): o vidro solto voltou a **0,51 ns por pixel coberto** (100 vidros a 36% da tela =
0,298 ms; o V2 media 0,302 ms). Baixa sai 9% mais barato (0,271 ms). Ultra, Alta e Média
empatam em DPR 1, como esperado. As quatro cenas dão o mesmo tempo (diferença < 0,2%): o custo
não depende do conteúdo atrás do vidro. A suíte completa não tinha os cenários de fusão e de
movimento; agora tem, por nível, e deixou de variar a cena.

### 13.8 A fusão ainda cara, e três lições ([`docs/bench/v3.1-rx6600-rapido.json`](../bench/v3.1-rx6600-rapido.json))

Depois do conserto do §13.7, grupos de 4: 20 vidros 1,52 → **0,75 ms**, 100 vidros 2,61 →
**1,49 ms** (soltos: 0,096 e 0,28 ms). Melhor, ainda 5–8× o vidro solto.

1. **`discard` em WGSL não encerra o pixel.** É *demote to helper*, e o Tint o implementa com uma
   flag enquanto o shader segue até o fim. O descarte antecipado do §13.7 não economizava nada:
   todo pixel do retângulo do grupo rodava a união e o sombreamento. Os caminhos vazios agora
   devolvem `vec4(0)`, que sob a mistura pré-multiplicada não muda o alvo — e o `return` encerra.
2. **A ordem fixa da cadeia anula o pulo de membros.** Um pixel dentro do quarto membro avaliava
   os três anteriores, porque a cadeia começa no primeiro. Agora há um **caminho solo** exato:
   se a cadeia das caixas dos membros antes do mais próximo fica ≥ d + 6k (ele zera a cadeia,
   t = 1) e os de depois também (t = 0), a união *é* o membro mais próximo, com pesos e tudo; o
   pixel é sombreado como vidro solto. Só pescoços e arredores pagam a união.
3. **O SwiftShader não serve de proxy para desvios.** Com o `fs_union` devolvendo cor fixa na
   primeira linha ele ainda custa o mesmo: executa o shader inteiro com as faixas mascaradas. Mede
   tamanho de código, não saídas antecipadas. A razão 5,3× que bateu com a RX 6600 foi
   coincidência; só a GPU de verdade julga estas otimizações.

Também: sombra fora calculada só onde a cobertura é parcial; sombra vista através do vidro pulada
onde é provadamente a constante do interior (a união e o SDF variam no máximo 1 por pixel);
membro pulado quando a caixa prova contribuição zero; canto circular (expoente 2) sem `pow`; o
rabo da sombra desce a zero em 3σ em vez de ser cortado (era um degrau de ~1,3%). Capturas: no
máximo 2 níveis de diferença, só nesse rabo. O bench ganhou um cenário realista (18 barras de 4
botões, 10 px entre eles, espaçamento 24) ao lado do de estresse.

### 13.9 Fechamento do desempenho do V3 ([`docs/bench/v3.2-rx6600-rapido.json`](../bench/v3.2-rx6600-rapido.json))

| caso (1500×945, DPR 1) | V2 | V3 primeiro | V3 final |
| --- | --- | --- | --- |
| vidro solto, por pixel coberto | 0,52 ns | 0,88 ns | **0,34 ns** |
| 100 em grupos de 4 (estresse: todo vizinho funde) | — | 2,61 ms | **0,92 ms** |
| 72 botões em 18 barras fundidas (realista) | — | — | **0,64 ms** (soltos: 0,13 ms) |

O vidro solto ficou 35% mais barato que no V2 (sombra só onde aparece, canto circular sem `pow`,
saída antecipada de verdade). A fusão custa ~5× o vidro solto **onde ela age**, e isso é da smin
cúbica, não do código: a influência de um membro alcança 6k (72 px com espaçamento 24), então num
botão de 110 px quase todo pixel sente o vizinho e paga a união. Pior caso realista medido: 0,64 ms
de 4,17 ms a 240 Hz. **Decisão: encerrado.** Se um dia o celular pedir, os caminhos são uma
normalização de alcance menor (muda o visual, pede captura lado a lado) ou ladrilhos em compute
(V5).

---

## 14. V4: o vidro lê o fundo (07/10/2026)

### 14.1 Métricas do fundo

Um compute (`cs_metrics`) roda na mesma passada do quadro, entre a pirâmide e o vidro, só quando o
conteúdo ou as superfícies mudam. Um grupo de trabalho por vidro: 8×8 amostras no retângulo da
forma, cada uma lida no nível da pirâmide cujo texel ≈ uma célula (a amostra é a média da célula),
as de fora da forma descartadas. Sai L* média, p10 e p90 (histograma de 16 baldes, interpolado no
balde) e a cobertura. O shader do vidro lê o resultado **no mesmo quadro**; a CPU recebe por
leitura assíncrona em anel (sem travar o quadro). Espelho em TS (`backdropStats`, `lightness`) e
teste de paridade em fundos lisos e divididos.

### 14.2 Regular × Claro

- **Regular** escolhe um **modo**: claro sobre conteúdo claro (o que fica em cima é escuro),
  escuro sobre conteúdo escuro. Histerese em L*: vira escuro abaixo de 42, volta a claro acima de
  58; a troca anima numa mola (0,4 s, sem overshoot). Os símbolos do laboratório seguem o modo.
- O que o Regular faz com a luz que passa (`adapt_light`): remapeia o intervalo para o lado legível
  — modo claro leva o preto a 0,3 (luz linear), modo escuro leva o branco a 0,2 — na proporção
  `adapt` (padrão 0,5), e satura um pouco (vibração, +35% × `adapt`). É política de legibilidade,
  não física, e está declarada assim; a física do vidro continua a mesma.
- **Claro** não adapta.
- Sem aparência dada (testes, bench), o shader decide pela medida do mesmo quadro, sem memória.
- Recusado de novo, como na §11: `environmentColorPickup` separado. A cor do ambiente já é a luz
  refratada e borrada.

### 14.3 Qualidade automática

`AdaptiveQuality` olha o tempo de GPU (média da janela de quadros) contra o intervalo de
atualização do monitor, medido: desce um nível acima de 75% por 0,5 s; sobe abaixo de 35% por 3 s;
espera 2 s depois de cada troca e recomeça as médias. Um pico isolado não muda nada. É o padrão do
laboratório. Sem `timestamp-query` não adapta (fica em Alta).

### 14.4 HTML-in-Canvas

O adaptador sonda nomes, nunca versões: `layoutsubtree` e `content="drawable"` no canvas,
`drawable` no filho; `drawElementImage`, `drawElement` ou `drawHTMLElement` no 2D;
`drawElementImageToTexture` ou as duas assinaturas de `copyElementImageToTexture` no WebGPU. A
página fica dentro de um canvas sob o palco, então mantém foco, rolagem, digitação e a árvore de
acessibilidade. O palco deixa o ponteiro passar e o arrasto do vidro mudou para o contêiner, na
fase de captura: o que cai num vidro é do vidro (nem clique nem foco vazam para a página).

**Medido aqui:** o Chromium 141 do contêiner, com `CanvasDrawElement`, expõe `layoutSubtree` e
`drawElement` — e o `drawElement` dessa versão **marca o canvas como de outra origem**: a imagem
não pode ir para a GPU. A API atual pinta só o que é seguro ler e deixa o canvas limpo. O adaptador
detecta o `SecurityError`, não lança, diz o motivo e o laboratório volta à cena de texto. O caminho
de sucesso está implementado e coberto pelo mesmo teste (que aceita os dois desfechos), mas **só o
Chrome 154 do usuário diz se funciona**.

### 14.5 O que ficou para depois

- **Camadas (vidro sobre vidro)**: exigem recompor o fundo da camada de baixo e regerar a pirâmide
  da região. A Apple desaconselha; fica para o próximo passo.
- **sizeResponse** (§11.1: vidro maior = material mais espesso) e o controle único de "clareza"
  (Claro ↔ Tingido) continuam no plano.

## 15. V4.1: vidro sobre vidro (07/10/2026)

### 15.1 Camadas

Um `GlassGroup` ganhou `layer: 0 | 1`. O quadro passa a ter, só quando existe vidro na camada 1
sobre vidro na camada 0:

1. **camada de baixo**: cópia do fundo + vidros da camada 0 + símbolos deles, numa textura no
   formato do canvas (os mesmos pipelines desenham nela);
2. **pirâmide da camada**: a mesma descida de 13 taps sobre essa composição;
3. **métricas da camada**: os vidros da camada 1 medem a composição (um vidro sobre um fumê escuro
   vai para o modo escuro), os da camada 0 continuam medindo o fundo;
4. o quadro final copia a composição e desenha a camada 1 por cima.

**Reaproveitamento.** A composição só é refeita quando algo nela muda: o fundo, a resolução, o
nível de qualidade, a vista de inspeção, ou o que a camada 0 envia à GPU (registros das
superfícies, dos grupos e dos símbolos, comparados com o envio anterior). Mover só o vidro de cima
custa o mesmo que sem camadas. O teste compara o quadro reaproveitado com um quadro feito do zero:
diferença 0.

**Uma camada de cima sozinha** (nada embaixo para refratar) é desenhada como camada 0: mesmos
pixels, nenhuma composição.

**Pirâmide regional: recusada pela análise.** O termo de ambiente lê o topo da pirâmide, e o topo
depende do quadro inteiro; refazer só a região sob o vidro de cima deixaria os níveis fundos
velhos, e o teste de cache acusaria. Copiar a pirâmide do fundo e corrigir só perto dos vidros de
baixo move mais bytes do que recalcular, e os formatos nem coincidem. Fica a pirâmide inteira,
paga só quando a camada de baixo muda (a do fundo custa 0,064 ms na RX 6600 a 1500×1080).

**Fora daqui:** vidros de camadas diferentes não se fundem (como na Apple); dois vidros da mesma
camada que se sobrepõem sem fundir continuam sem ordem entre si.

### 15.2 Conteúdo sobre o vidro

Os símbolos dos vidros eram elementos DOM sobre o canvas. Com camadas, o símbolo do vidro de baixo
apareceria **por cima** do vidro de cima, em vez de refratado por ele. Agora o renderer desenha o
conteúdo logo depois dos vidros da camada (`content.wgsl`): o vidro de cima refrata o símbolo de
baixo e a sombra dele cai sobre o símbolo. O símbolo acompanha centro, rotação e press do vidro,
não o estiramento. Some nas vistas de inspeção.

O atlas tem uma célula de 128 px por símbolo, e **cada mip é rasterizado do SVG naquele tamanho**
(128, 64, 32, 16), não filtrado do nível de cima: um traço de 2 px filtrado até 28 px fica cinza e
mole. Criado uma vez; nada por quadro. Efeito colateral bom: o laboratório deixou de escrever
estilo no DOM a cada quadro do arrasto.

### 15.3 Testes, e a prova de que não são vazios

`tests/layers.test.mjs` (6): camada de cima sozinha = camada 0; longe da camada de baixo, o vidro
de cima é o mesmo vidro (≤ 1/255 no quadro inteiro); através dele aparecem a cor do vidro tingido e
o símbolo de baixo; o cache (reaproveitado = do zero, e mover o de baixo refaz); as métricas por
camada; o símbolo centrado, girando com o vidro e ausente na inspeção. Mais um teste de interface:
o vidro posto por cima não entra no grupo de fusão e pega o toque na sobreposição.

Cada um foi conferido contra um defeito plantado, e cada defeito derrubou o teste certo: o de
cima lendo a pirâmide do fundo (falha "vê o de baixo"); a composição refeita sempre (falha o
cache); nunca refeita (falham cache e "vê o de baixo"); métricas da camada 1 lendo o fundo (falham
as métricas); símbolo sem rotação (falha o conteúdo); o toque testando a camada de baixo primeiro
(falha o teste de interface). As 25 capturas padrão saíram idênticas, pixel a pixel, às do commit
anterior: o caminho sem camadas não mudou.

### 15.4 O print do V4 na RX 6600

- Regular funcionando: L* 41 sob o vidro → modo escuro (o limiar é 42). GPU total 0,13 ms.
- "Alta (auto)" não é defeito: em DPR 1, Alta e Ultra são o mesmo quadro (mesmo DPR, mesmos
  recursos); o Auto sobe depois de 3 s de amostras leves, e a simulação com amostras esparsas do
  modo sob demanda confirma que sobe.
- CPU 1,00 ms era a **média** de uma janela com poucos quadros, onde um quadro que repinta a cena
  (5–150 ms medidos aqui, Canvas 2D) pesa muito. O painel passou a mostrar a **mediana**; o bench,
  que mede em regime, continua com a média.

### 15.5 Bench

Dois cenários novos (rápido e completo): as 72 barras fundidas com símbolo em cada botão na camada
0 e um popover de 520×340 na camada 1. "A de cima move" mede o caso reaproveitado; "a de baixo
move" mede o pior caso, com composição e pirâmide refeitas todo quadro.

### 15.6 A borda branca: coerência com o Liquid Glass 27

O usuário estranhou a "borda branca". Conferido (MacRumors, 10 e 16/06/2026; issue #118 do
AndroidLiquidGlass): o iOS 27 escureceu a borda dos elementos de vidro (uma linha escura sutil no
contorno, que separa o vidro do fundo claro), reforçou o especular, e nos ícones o realce fica em
cima e embaixo, fixo (sem giroscópio). A **posição** do nosso já batia (topo e base acesos,
laterais apagadas, linha escura de 2 px no contorno); a **forma**, não.

Perfil medido atravessando a borda da cápsula Regular da tela inicial (fundo escuro):

| | antes | depois |
| --- | --- | --- |
| realce do topo | +139, meia-altura **8 px**, faixa embutida no bisel | +128, **5 px**, colado na borda |
| base / topo | **60%** (lia como anel) | **33%** |
| linha escura do contorno | 2 px | 2 px |

O que mudou e por quê:

- **Luz principal rasante, 6° acima do plano** (era 20°): o meio-vetor inclina ~42°, e o realce cai
  na parte íngreme do bisel, onde a normal gira rápido — uma linha fina. Abaixo do plano (testado
  de −0,6 a −0,1) o realce fica ainda mais colado, mas **come a linha escura** sobre fundo claro (2 →
  1 px): o teste de aceite da borda escura acusou, e a decisão foi não afrouxá-lo.
- **Disco de 0,14 rad** (era 0,22); a borda suave de 0,14 continua, então o realce não para seco no
  pescoço da fusão (captura conferida). Radiância 18 → 21, para o pico não perder brilho ao
  estreitar.
- **Contraluz 0,15** (era 0,38). 0,12 dava 28%, mas o realce de baixo quase some, e o iOS 27 mantém
  os dois.

Os 63 testes passam sem mudança de critério. Lado a lado em `captures/borda-antes-depois.png` e
`captures/borda-zoom.png`. Falta o gabarito definitivo: uma captura de um vidro real do iOS 27
sobre fundo parecido.

