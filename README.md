# Liquid Glass Lab

Laboratório independente para descobrir o melhor Liquid Glass possível no navegador com WebGPU.
Não é o jogo e não depende dele: vive numa branch órfã (`liquid-glass-lab`).

A pesquisa que fundamenta cada decisão está em
[`docs/research/01-engenharia-reversa.md`](docs/research/01-engenharia-reversa.md), com as notas de
leitura de código de 12 projetos em [`docs/research/projetos/`](docs/research/projetos/).

## Rodar

```bash
npm install
npm run dev        # http://127.0.0.1:5180/        laboratório
                   # http://127.0.0.1:5180/bench.html   benchmark (JSON para colar de volta)
npm run check      # tipos
npm test           # óptica, material, fusão e física (readback de GPU + Node)
node tests/capture.mjs            # PNGs das cenas em captures/, para revisão visual
node tests/capture.mjs --union    # fusão: aproximação, pescoço, sobreposição, vistas de debug
node tests/capture.mjs --touch    # a luz do toque ao longo do tempo, chegando ao vidro vizinho
node tests/ui-shot.mjs            # a interface sobre o vidro (desktop, camadas, gaveta, celular)
```

## Usar o laboratório

- **Arraste** um vidro. Solte perto do outro e eles se fundem.
- **Toque** num vidro para selecioná-lo: o dock e a gaveta passam a valer para ele. **Duplo clique**
  abre os ajustes. Um vidro nunca sai do palco: arrastado para fora ou com a janela menor, ele
  desliza de volta.
- **Dock:** Fundo (ou uma foto sua), Forma (anima de uma para outra), Material, Vidros (+ / − /
  **por cima**), Ajustes.
- **Toque:** o vidro se ilumina por dentro a partir do dedo, e o brilho se espalha pelo vidro e
  pelos vizinhos (mais visível sobre fundo escuro). Vidro maior parece mais espesso (Ajustes →
  Avançado → Resposta ao tamanho). O Claro com símbolo ganha a camada de escurecimento da Apple.
- **Vidro sobre vidro:** selecione um vidro e aperte o botão de camadas (último em Vidros). Ele
  passa a flutuar por cima dos outros e refrata o que está embaixo: os vidros, os símbolos e as
  sombras deles. Vidros de camadas diferentes não se fundem; o de cima recebe o toque primeiro.
- **Ajustes** (gaveta): Vidro, Forma, Luz e cor, Fusão e movimento, Avançado (perfil, qualidade,
  medir desempenho, inspecionar o shader).
- A pílula no canto superior direito mostra fps e tempo de GPU; um clique abre o detalhe (inclui
  o brilho medido sob o vidro selecionado e o modo que ele escolheu).
- **Regular** se adapta: arraste um vidro entre o céu e a cidade e veja o modo claro/escuro trocar,
  com o símbolo em cima mudando de cor. **Claro** não se adapta.
- **Página HTML** (último fundo antes do upload): DOM vivo sob o vidro via HTML-in-Canvas. No
  Chrome, ligue `chrome://flags/#canvas-draw-element` (e, se preciso,
  `#enable-experimental-web-platform-features`) e recarregue; sem a API, o laboratório avisa e
  mostra a cena de texto.

Requisitos: um navegador com WebGPU (Chrome/Edge 113+, Safari 26+, Firefox 141+ no Windows /
145+ no macOS). Para medir tempo de GPU sem o arredondamento de 100 µs do Chrome, ligue
`chrome://flags/#enable-webgpu-developer-features`.

Os testes usam o Chromium do Playwright (`npx playwright install chromium`) ou o binário em
`LAB_CHROMIUM`. Sem GPU, o adaptador é SwiftShader: os pixels são corretos, os tempos não valem
nada. **O SwiftShader headless perde o processo de GPU ao desenhar no swapchain de um canvas**;
por isso testes e capturas renderizam fora da tela (`offscreen` no renderer). O laboratório e o
bench sempre desenham no canvas, então só rodam numa máquina com GPU de verdade.

## Estado: V5 — o vidro responde: luz do toque, resposta ao tamanho, escurecimento do Claro (sobre o V4.1)

| peça | onde | situação |
| --- | --- | --- |
| device único, perda de device com recriação limitada | `src/gpu/device.ts`, `src/lab/main.ts` | pronto |
| renderer único, frame graph, um submit por quadro, laço sob demanda | `src/renderer/` | pronto |
| tempo de GPU por passe (timestamp-query em anel) | `src/renderer/timer.ts` | pronto |
| pool de texturas (nada criado por quadro), DPR efetivo com teto | `src/renderer/pool.ts`, `quality.ts` | pronto |
| fonte de fundo abstrata + cenas nativas (cor, texto, imagem, grade, foto do usuário) | `src/sources/` | pronto |
| superfícies num storage buffer, um draw instanciado com AABB (inclui a sombra) | `renderer.ts`, `glass.wgsl` | pronto |
| SDF de cantos superelípticos | `glass.wgsl`, `shape.ts` | pronto |
| Snell em duas interfaces + gap, **por canal** (dispersão por Abbe/Cauchy), Fresnel, caminho óptico | `src/glass/optics.ts` | pronto |
| guarda de injetividade (envelope monótono por canal + canto) | `buildRadialTable` | pronto |
| **pirâmide de mips** (downsample de 13 taps, só quando o conteúdo muda) | `pyramid.wgsl` | pronto |
| **rugosidade**: LOD por rugosidade e pela pegada da amostra, leitura bicúbica | `glass.wgsl` | pronto |
| **luz**: luz de área em disco (cima) + contraluz (baixo) × Fresnel; ambiente = o próprio conteúdo | `glass.wgsl` | pronto |
| **contraste de borda** derivado da inclinação (borda escurecida do Liquid Glass 27) | `glass.wgsl` | pronto |
| **tint** como absorção de Beer–Lambert, neutro por padrão | `material.ts`, `glass.wgsl` | pronto |
| **sombra** analítica pelo SDF, deslocamento e suavidade derivados da altura de flutuação | `glass.wgsl` | pronto |
| presets Clear, Regular, Frost, Crystal, Smoke; variante Regular/Clear guardada (política no V4) | `material.ts` | pronto |
| debug: SDF, normal, deslocamento, injetividade, transmissão, espessura, amostra, Fresnel, LOD, especular, dispersão | `glass.wgsl` | pronto |
| hot reload de WGSL com overlay de erro | `src/shaders/index.ts` | pronto |
| testes: 8 de óptica + 9 de aceite do material (borda escura, realce por N·L, largura variável, sombra, fosco, tint, nível Baixa) | `tests/` | pronto |
| bench com JSON (+ vidro em movimento e grupos de fusão no V3; camadas, símbolos e toque no V5) | `bench.html`, `src/bench/` | pronto; medido na RX 6600: [V2](docs/bench/v2-rx6600.json), [V3](docs/bench/v3-rx6600.json) (§13.7). Desde o V5: estatísticas sobre todos os quadros (antes, só os últimos 120), total de GPU por quadro com p95 e fração do quadro, ns por pixel coberto, memória, aviso de tempo arredondado e repetição de medida feita fora de foco; teste de fumaça em `tests/bench.test.mjs` |
| dois pipelines (`fs_single`, `fs_union`), saída antecipada real, caminho solo exato na fusão | `glass.wgsl`, `renderer.ts` | medido na RX 6600: solto 0,34 ns/px, barras fundidas 0,64 ms ([JSON](docs/bench/v3.2-rx6600-rapido.json), §13.9) |
| **molas** (resposta + amortecimento, subpasso ≤ 1/240 s, param sozinhas) | `src/physics/spring.ts` | pronto |
| **corpo do vidro**: segue o ponteiro com inércia, estica ao longo da velocidade preservando a área (teto 12%), press anima o material, bounce contido ao soltar | `src/physics/body.ts` | pronto |
| SDF sob transformação afim (rotação · press · estiramento), distância corrigida por \|M⁻ᵀ∇\| | `glass.wgsl`, `shape.ts` | pronto |
| testes de física (9): overshoot teórico, 30 Hz = 240 Hz, ângulo do estiramento, área, assentamento, bounce, morph | `tests/physics.test.mjs` | pronto |
| **grupos de fusão**: um grupo = uma instância; smin cúbica C², gradiente exato, material e tabelas misturados pelos mesmos pesos | `glass.wgsl`, `src/glass/union.ts` | pronto |
| **morph**: uma mola por campo da forma (círculo → cápsula → squircle → painel) | `src/physics/body.ts` | pronto |
| **níveis de qualidade** com diferença real: Baixa = 1 amostra e leitura bilinear; Ultra = DPR até 3 | `src/renderer/quality.ts` | pronto |
| testes de fusão (8): smin (valor, derivada, C²), pesos, limiar de toque, paridade GPU × CPU no pescoço, sem vinco, espaçamento 0 = soltos | `tests/union.test.mjs` | pronto |
| interface minimalista: palco inteiro, dock rotulado, gaveta em linguagem comum, métricas recolhidas | `src/lab/` | pronto |
| teste da interface (9), sem WebGPU, com ponteiro de verdade: vidro não sai do palco (arrasto, janela menor, novos vidros), seleção, gaveta × métricas, nomes únicos, limites ditos, forma do dock, duplo clique | `tests/lab-ui.test.mjs` | pronto |

**Medido (RX 6600, Chrome 154, 1500×1080, DPR 1):** o vidro custa ~0,84 ms por tela cheia coberta
(linear na área, sem custo fixo por superfície): 100 cápsulas cobrindo 36% = 0,30 ms. Fundo 0,022 ms,
pirâmide refeita por quadro 0,064 ms, CPU < 0,1 ms. Pior caso 0,39 ms de 4,17 ms (240 Hz). Os níveis
de qualidade ainda só mudam o teto de DPR, então em DPR 1 `high` = `low`.

Decisões do V3, com o que foi medido e rejeitado (dispersão espectral), em
[`docs/research/01-engenharia-reversa.md` §13](docs/research/01-engenharia-reversa.md).

| peça | onde | situação |
| --- | --- | --- |
| **métricas do fundo** por vidro (compute: L* média, p10, p90 de 8×8 amostras da pirâmide), leitura assíncrona | `glass.wgsl` (`cs_metrics`), `renderer.ts` | pronto |
| **Regular adaptativo**: modo claro/escuro com histerese (L* 42–58) e animação; remapeia e satura a luz que passa; Claro não adapta | `src/glass/policy.ts`, `glass.wgsl` | pronto |
| **qualidade automática** pelo tempo de GPU (desce >75% do quadro por 0,5 s, sobe <35% por 3 s, espera 2 s) | `src/renderer/adaptive.ts` | pronto |
| **HTML-in-Canvas** atrás de `BackgroundSource`: nomes sondados em tempo de execução, ponte 2D e caminho direto, cliques no vidro não vazam para a página | `src/sources/html-in-canvas.ts` | pronto; **sucesso só verificável no seu Chrome** (o Chromium 141 daqui marca o canvas como de outra origem — o adaptador detecta e recua) |
| testes do V4: política (7), qualidade automática (4), HTML-in-Canvas (1, os dois desfechos) | `tests/` | pronto |

Decisões do V4 em [§14 do relatório](docs/research/01-engenharia-reversa.md).

| peça | onde | situação |
| --- | --- | --- |
| **camadas**: um grupo na camada 1 refrata a camada 0 já composta (vidros, símbolos, sombras); a composição e a pirâmide dela são reaproveitadas enquanto nada embaixo muda; uma camada de cima sozinha custa zero | `renderer.ts` | pronto; custo na RX 6600 pelos cenários de camadas do bench |
| **conteúdo sobre o vidro**: os símbolos saíram do DOM e são desenhados pelo renderer na camada do vidro, de um atlas com cada mip rasterizado do SVG naquele tamanho | `content.wgsl`, `src/renderer/symbols.ts` | pronto |
| testes de camadas (6) e da interface com camadas (1), cada um conferido contra um defeito plantado | `tests/layers.test.mjs`, `tests/lab-ui.test.mjs` | pronto |

Decisões do V4.1 em [§15 do relatório](docs/research/01-engenharia-reversa.md).

| peça | onde | situação |
| --- | --- | --- |
| **luz do toque**: nasce no dedo, se espalha pelo vidro e pelos vizinhos, assenta e apaga (molas); até 4 luzes no shader, com espelho e paridade | `src/physics/touch.ts`, `src/glass/glow.ts`, `glass.wgsl` | pronto |
| **resposta ao tamanho**: vidro maior = mais espesso, lente mais larga, sombra mais funda | `sizeResponse` em `material.ts` | pronto |
| **escurecimento do Claro** sob símbolos (35%, derivado de 3:1) | `CLEAR_DIM`, `glass.wgsl` | pronto |
| testes do V5: toque (4), tamanho (3), Claro (2) | `tests/` | pronto |

Plano e decisões do V5 (o que entrou, o que foi recusado e por quê) em
[§16 do relatório](docs/research/01-engenharia-reversa.md).

**Próximo:** o bench rápido na RX 6600 (traz os cenários de camadas) e o teste do HTML-in-Canvas
no Chrome 154. Adiados com motivo: HDR (precisa de tela HDR para comparar) e ladrilhos em compute
(nenhum grupo passa de 32 membros).

## Decisões que valem lembrar

- **Unidades:** px de dispositivo no shader; px CSS na interface e no material.
- **Cor:** textura de fundo `rgba8unorm-srgb` + view sRGB do alvo → toda a conta em luz linear.
- **Óptica na CPU, por superfície:** a tabela radial (`buildRadialTable`) é a única fonte da
  física; a GPU interpola. CPU e GPU concordam pixel a pixel (teste de paridade).
- **Bisel ≤ raio do canto:** com o campo de p-norma, isso garante normal sem vinco na diagonal.
