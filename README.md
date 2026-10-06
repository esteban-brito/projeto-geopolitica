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

## Estado: V0 — fundação

| peça | onde | situação |
| --- | --- | --- |
| device único, perda de device com recriação limitada | `src/gpu/device.ts`, `src/lab/main.ts` | pronto |
| renderer único, frame graph, um submit por quadro, laço sob demanda | `src/renderer/` | pronto |
| tempo de GPU por passe (timestamp-query em anel, sem travar o laço) | `src/renderer/timer.ts` | pronto |
| pool de texturas (nada criado por quadro) e DPR efetivo com teto | `src/renderer/pool.ts`, `quality.ts` | pronto |
| fonte de fundo abstrata + cenas nativas (cor, texto, imagem, grade, foto do usuário) | `src/sources/` | pronto |
| superfícies num storage buffer, um draw instanciado com AABB | `renderer.ts`, `glass.wgsl` | pronto |
| SDF de retângulo com cantos superelípticos, distância euclidiana de 1ª ordem | `glass.wgsl`, `shape.ts` | pronto |
| refração de Snell em duas interfaces + gap, transmissão de Fresnel | `src/glass/optics.ts` | pronto |
| guarda de injetividade (envelope monótono + canto) | `optics.ts`, `buildRadialTable` | pronto |
| debug: SDF, normal, deslocamento, injetividade, transmissão, espessura, amostra | `glass.wgsl` | pronto |
| hot reload de WGSL com overlay de erro | `src/shaders/index.ts` | pronto |
| testes por readback (8) e capturas | `tests/` | pronto |
| bench com JSON | `bench.html`, `src/bench/` | pronto, **não medido** (sem GPU aqui) |

O vidro do V0 só **transmite**: sem a reflexão do ambiente (V1), ele fica um pouco mais escuro
que o fundo (92% de transmissão no centro). É física, não defeito.

## Decisões que valem lembrar

- **Unidades:** px de dispositivo no shader; px CSS na interface e no material.
- **Cor:** textura de fundo `rgba8unorm-srgb` + view sRGB do alvo → toda a conta em luz linear.
- **Óptica na CPU, por superfície:** a tabela radial (`buildRadialTable`) é a única fonte da
  física; a GPU interpola. CPU e GPU concordam pixel a pixel (teste de paridade).
- **Bisel ≤ raio do canto:** com o campo de p-norma, isso garante normal sem vinco na diagonal.
