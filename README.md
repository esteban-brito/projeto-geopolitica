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
npm test           # testes de óptica por readback de GPU (Playwright + Chromium headless)
node tests/capture.mjs   # PNGs das cenas em captures/, para revisão visual
```

Requisitos: um navegador com WebGPU (Chrome/Edge 113+, Safari 26+, Firefox 141+ no Windows /
145+ no macOS). Para medir tempo de GPU sem o arredondamento de 100 µs do Chrome, ligue
`chrome://flags/#enable-webgpu-developer-features`.

Os testes usam o Chromium do Playwright (`npx playwright install chromium`) ou o binário em
`LAB_CHROMIUM`. Sem GPU, o adaptador é SwiftShader: os pixels são corretos, os tempos não valem
nada. **O SwiftShader headless perde o processo de GPU ao desenhar no swapchain de um canvas**;
por isso testes e capturas renderizam fora da tela (`offscreen` no renderer). O laboratório e o
bench sempre desenham no canvas, então só rodam numa máquina com GPU de verdade.

## Estado: V2 — física (sobre o vidro óptico do V1 e a fundação do V0)

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
| testes: 8 de óptica + 8 de aceite do material (borda escura, realce por N·L, largura variável, sombra, fosco, tint) | `tests/` | pronto |
| bench com JSON | `bench.html`, `src/bench/` | pronto, **não medido** (sem GPU aqui) |
| **molas** (resposta + amortecimento, subpasso ≤ 1/240 s, param sozinhas) | `src/physics/spring.ts` | pronto |
| **corpo do vidro**: segue o ponteiro com inércia, estica ao longo da velocidade preservando a área (teto 12%), press anima o material, bounce contido ao soltar | `src/physics/body.ts` | pronto |
| SDF sob transformação afim (rotação · press · estiramento), distância corrigida por \|M⁻ᵀ∇\| | `glass.wgsl`, `shape.ts` | pronto |
| testes de física (7): overshoot teórico, 30 Hz = 240 Hz, ângulo do estiramento, área, assentamento, bounce | `tests/physics.test.mjs` | pronto |

**Próximo:** rodar o laboratório e o bench numa GPU real (RX 6600) e trazer o JSON e as impressões;
depois V3 (várias superfícies, smooth union C², morph).

## Decisões que valem lembrar

- **Unidades:** px de dispositivo no shader; px CSS na interface e no material.
- **Cor:** textura de fundo `rgba8unorm-srgb` + view sRGB do alvo → toda a conta em luz linear.
- **Óptica na CPU, por superfície:** a tabela radial (`buildRadialTable`) é a única fonte da
  física; a GPU interpola. CPU e GPU concordam pixel a pixel (teste de paridade).
- **Bisel ≤ raio do canto:** com o campo de p-norma, isso garante normal sem vinco na diagonal.
