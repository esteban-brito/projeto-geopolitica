# Pesquisa 11 — FOTORREALISMO DA MESA: microestrutura, iluminação física e óptica de materiais na web

> **Manual de renderização física para o Gabinete.**  
> Escrito em 13/09/2026. Define as regras de microestrutura, resposta especular e oclusão de contato para eliminar o aspecto vetorial da cena, mantendo runtime estático em ESM puro e portão verde.

---

## 1. O que faz uma cena 2.5D ler como foto

Um render é denunciado como desenho por quatro ausências físicas:

1. **Ausência de microestrutura (aspereza de relevo):** Superfícies perfeitamente lisas não existem na indústria. Couro tem células dérmicas, papel tem fibras de celulose e plástico injetado tem textura de molde (_orange peel_). Sem ruído de normal, a luz rebate chapada e o cérebro detecta vetor.
2. **Ausência de oclusão de contato (ambient occlusion):** Onde dois corpos se tocam (papel na pasta, telefone no tampo, lacre no papel), a luz ambiente difusa não penetra. Sem uma linha de sombra de contato de 1 a 3px de raio curto, o objeto parece flutuar sobre a mesa.
3. **Faixa tonal artificial (preto ou branco absolutos):** Matéria real não reflete 0% nem 100% da luz visível. O papel sulfite reflete entre 82% e 92% (alvura de escritório), e couro preto reflete cerca de 3% a 5% de luz difusa. Pretos `#000` e brancos `#fff` são assinaturas digitais.
4. **Reflexo especular sem Fresnel:** Plásticos e vernizes exibem refletividade variável conforme o ângulo de visão (equações de Fresnel). No topo (visão perpendicular), a reflexão difusa domina; nas bordas tangenciais, a reflexão especular atinge o pico.

---

## 2. Três técnicas concretas sob as restrições do projeto

Restrições: zero build, ESM puro, CSS tokens restritos (apenas preto e branco literais fora de tokens), delta de tela $\ge -5$ fps.

### Técnica A: Couro preto por `feTurbulence` + `feDiffuseLighting` (Data URI)

- **Problema:** Ruído fino de alta frequência gera aspecto de lixa ou asfalto, não de couro trabalhado.
- **Solução:** Duas escalas acopladas num único filtro SVG servido via `data:image/svg+xml` em `background-image`:
  - Frequência base: `baseFrequency="0.045 0.045"` com `numOctaves="3"` para esculpir as dobras e células poligonais da pele (dimensão de 15 a 25px).
  - Iluminação de altura: `feDiffuseLighting` com `surfaceScale="2.0"` e `diffuseConstant="0.85"`, usando `feDistantLight` alinhada à sala (azimute 250°, elevação 52°).
  - Aplicação: camada em `mix-blend-mode: soft-light` ou `background-blend-mode: screen` com opacidade 0.08 sobre a base preta `#111317`.
- **Custo computacional:** Rasterizado uma única vez na carga pelo navegador. Zero chamadas de layout, zero escritas de estilo em runtime, 0 fps de penalidade.

### Técnica B: Papel timbrado (calor, lombada e microfibra)

- **Problema:** Páginas brancas `#ffffff` com borda preta fina leem como janelas de aplicativo ou PDF colado na mesa.
- **Solução:**
  1. **Faixa tonal e calor:** Base em marfim sutil (`#fbfaf7`), simulando celulose 90g/m² iluminada por lâmpada de teto quente.
  2. **Oclusão de lombada:** Gradiente linear na junção central da pasta:
     $$\text{Sombra}(x) = I_0 \cdot \exp(-k \cdot x)$$
     Implementado em CSS como `linear-gradient(to right, rgba(0, 0, 0, 0.16) 0%, rgba(0, 0, 0, 0.04) 14px, transparent 28px)` na margem interna da folha esquerda e invertido na folha direita.
  3. **Microfibra:** `feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2"` em opacidade 0.025 com blend `multiply`.
- **Custo computacional:** Gradiente resolvido na GPU pelo compositor. Impacto de 0.0 fps no `npm run screen`.

### Técnica C: Reflexo difuso de janela em superfície semibrilho (plástico ABS e verniz)

- **Problema:** Gradientes radiais circulares leem como esferas ou bolhas 3D de computação gráfica dos anos 90.
- **Solução:** Projeção de fonte de área estendida (uma janela de escritório):
  - Geometria elíptica rotacionada a 20° (alinhada à fonte de luz da sala), com razão de aspecto 3:1.
  - Perfil de queda: decaimento quadrático suave com núcleo especular (_hot spot_) de raio 6px a 85% de brilho e penumbra difusa larga de 40px em `soft-light` com opacidade 0.14.
  - Realce de arestas (_edge glints_): traço de 1px no topo/esquerda com opacidade modulada pelo vetor normal da aresta.
- **Custo computacional:** Executado no SVG via `<path>` com gradiente linear em `mix-blend-mode: screen`, sem recalcular filtros por quadro.

---

## 3. Fontes e referências

- **Pharr, M., Jakob, W., & Humphreys, G. (2023).** _Physically Based Rendering: From Theory to Implementation_ (4ª ed.). MIT Press. (Capítulo 9: _Reflection Models and Microfacet Theory_).
- **Blinn, J. F. (1977).** _Models of light reflection for computer synthesized pictures_. ACM SIGGRAPH Computer Graphics, 11(2), 192–198.
- **Schlick, C. (1994).** _An Inexpensive BRDF Model for Physically-based Rendering_. Computer Graphics Forum, 13(3), 233–246.
- **W3C Scalable Vector Graphics (SVG) 2.** _Filter Effects Module Level 1 — Lighting Filters (`feDiffuseLighting`, `feSpecularLighting`)_.

---

## 4. O telefone virou foto — 15/09

A modelagem por filtros SVG (`feDiffuseLighting` e `feSpecularLighting`) foi testada e descartada. O mapa de altura borrado dava chanfro uniforme a toda aresta e reflexo leitoso ao fone, lendo como desenho.

Para peças com curvatura composta (disco, berço e conchas), o vetor não atinge fotorrealismo sem centenas de nós. A solução adotada foi fotografia real («Dialog röd», 720×599, 63 KB em WebP, CC BY-SA 3.0), recortada por conectividade cromática, desfranjada e com a luz da sala assada no arquivo (exposição 0,9; 1 → 0,78 de cima para baixo). A imagem mantém o relevo e o acabamento do plástico real. A integração com a mesa vem de duas sombras `drop-shadow` que seguem a silhueta, inclinadas por `--light-dx` (contato 0,85; penumbra 0,7).
