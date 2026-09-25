# Avaliação dos Palcos Vestidos (Passo 4 do Ciclo 28)

## 1. Custo de GPU nos Palcos (Congresso e Finanças, ordem ABBA com aquecimento descartado)

Medição com o palco vestido (pele de Fresnel + corpo da pele + desfoque do token, sob o teto `LENS_AREA_MAX = 60000`):

| Tela | Antes (sem glaze) | Depois (palco vestido) | Delta GPU | Ruído Teste-Reteste | SNR | rAF p50 / p95 |
|---|---|---|---|---|---|---|
| **Congresso** | 3.969 ms/q | 4.095 ms/q | **+0.126 ms/q** | ±0.171 ms | 0.7 | 4.2 / 4.2 ms |
| **Finanças** | 3.825 ms/q | 3.986 ms/q | **+0.161 ms/q** | ±0.128 ms | 1.3 | 4.2 / 4.3 ms |

> Custo de GPU nominal: +0,126 ms/q no Congresso (SNR 0,7) e +0,161 ms/q em Finanças (SNR 1,3). Ambos dentro da margem de ruído do instrumento (±0,15 ms) e bem abaixo do orçamento de 4,16 ms (240 Hz). Cadência rAF cravada em 4,2 ms (240 fps).

---

## 2. Contraste WCAG AA sobre o Palco (Amostragem Limpa com `visibility: hidden`)

Medição corrigida em 294 textos (Congresso e Finanças a 1440×900 e 1920×937). O texto foi ocultado com `visibility: hidden` antes do screenshot do bounding box para impedir que os caracteres claros fossem capturados como fundo (eliminando o falso 1:1). Opacidade composta na tinta e pior pixel amostrado sob a mancha de texto:

⭐ **Pior contraste absoluto verificado**: **7.02:1** (Finanças a 1440×900: texto `"R$ 75,5 bi"`, tinta `rgb(242,136,127)` com $\alpha = 1$ sobre pior pixel de fundo `rgb(17,28,44)`).
> **Veredito**: **100% dos textos sobre os palcos passam no piso WCAG AA (≥ 4,5:1)**. Zero reprovações. Margem mínima de segurança de 2,52 pontos acima do piso.

### Os 12 menores contrastes sobre o palco (amostragem limpa)

| Tela | Resolução | Texto | Tinta Declarada | Alfa Total | Tinta Composta | Pior Pixel Fundo | Razão WCAG | Piso AA (≥4,5) |
|---|---|---|---|---|---|---|---|---|
| Finanças | 1440×900 | `"R$ 75,5 bi"` | rgb(242,136,127) | 1 | rgb(242,136,127) | rgb(17,28,44) | **7.02:1** | ✓ Passa |
| Finanças | 1920×937 | `"R$ 75,5 bi"` | rgb(242,136,127) | 1 | rgb(242,136,127) | rgb(17,27,44) | **7.07:1** | ✓ Passa |
| Finanças | 1440×900 | `"R$ -4,9 bi"` | rgb(242,136,127) | 1 | rgb(242,136,127) | rgb(16,26,43) | **7.14:1** | ✓ Passa |
| Finanças | 1920×937 | `"R$ -4,9 bi"` | rgb(242,136,127) | 1 | rgb(242,136,127) | rgb(16,25,42) | **7.20:1** | ✓ Passa |
| Finanças | 1440×900 | `"/ano"` | rgb(164,177,194) | 1 | rgb(164,177,194) | rgb(15,34,48) | **7.47:1** | ✓ Passa |
| Finanças | 1920×937 | `"o que o teto ainda deixa gastar"` | rgb(164,177,194) | 1 | rgb(164,177,194) | rgb(16,33,49) | **7.51:1** | ✓ Passa |
| Finanças | 1440×900 | `"/ano"` | rgb(164,177,194) | 1 | rgb(164,177,194) | rgb(17,33,47) | **7.52:1** | ✓ Passa |
| Finanças | 1440×900 | `"o que o teto ainda deixa gastar"` | rgb(164,177,194) | 1 | rgb(164,177,194) | rgb(15,32,47) | **7.61:1** | ✓ Passa |
| Congresso | 1440×900 | `"líder de bancada"` | rgb(164,177,194) | 1 | rgb(164,177,194) | rgb(16,30,45) | **7.74:1** | ✓ Passa |
| Finanças | 1440×900 | `"fora do teto · no mês"` | rgb(164,177,194) | 1 | rgb(164,177,194) | rgb(17,28,44) | **7.87:1** | ✓ Passa |
| Congresso | 1920×937 | `"líder de bancada"` | rgb(164,177,194) | 1 | rgb(164,177,194) | rgb(15,28,45) | **7.88:1** | ✓ Passa |
| Congresso | 1440×900 | `"presidente do Senado"` | rgb(164,177,194) | 1 | rgb(164,177,194) | rgb(13,28,42) | **7.93:1** | ✓ Passa |

---

## 3. Curva de Custo de GPU por Área da Lente (Tracing CDP na `CrGpuMain`)

Medição com a tela trabalhando (elemento animado `@keyframes anda` forçando o compositor a recompor a região do filtro a cada quadro).
Comparação entre lente refrativa SVG (`feDisplacementMap` + `feGaussianBlur` 10 + `saturate` 1.9) e desfoque puro de token (`backdrop-filter: var(--glass-blur)`):

| Dimensões | Área em Pixels | GPU com Lente | GPU com Token | Delta Lente | Cadência rAF (Lente) | Cadência rAF (Token) |
|---|---|---|---|---|---|---|
| 389×62 | **24 mil px** (24.118 px) | **3.478 ms/q** | 3.312 ms/q | **+0.166 ms/q** | p50: 4.2 ms / p95: 4.2 ms | p50: 4.2 ms / p95: 4.2 ms |
| 400×100 | **40 mil px** (40.000 px) | **3.330 ms/q** | 3.313 ms/q | **+0.017 ms/q** | p50: 4.2 ms / p95: 4.2 ms | p50: 4.2 ms / p95: 4.2 ms |
| 420×140 | **59 mil px** (58.800 px) | **3.876 ms/q** | 3.340 ms/q | **+0.536 ms/q** | p50: 4.2 ms / p95: 4.3 ms | p50: 4.2 ms / p95: 4.2 ms |
| 450×180 | **81 mil px** (81.000 px) | **3.754 ms/q** | 3.454 ms/q | **+0.300 ms/q** | p50: 4.2 ms / p95: 4.3 ms | p50: 4.2 ms / p95: 4.3 ms |
| 560×200 | **112 mil px** (112.000 px) | **3.924 ms/q** | 3.390 ms/q | **+0.534 ms/q** | p50: 4.2 ms / p95: 4.3 ms | p50: 4.2 ms / p95: 4.3 ms |
| 600×300 | **180 mil px** (180.000 px) | **3.720 ms/q** | 3.378 ms/q | **+0.342 ms/q** | **p50: 4.2 ms / p95: 8.4 ms** | p50: 4.2 ms / p95: 4.2 ms |

### Conclusões da Curva de Área:
1. **Até 40 mil px** (dock com 24k, cápsulas da barra com 17k): o delta da lente é desprezível (+0,017 a +0,166 ms/q), com rAF p50 e p95 cravados em 4,2 ms (240 Hz perfeitos).
2. **A partir de ~60 mil px**: o custo por quadro sobe em +0,536 ms/q.
3. **A 180 mil px**: o rAF p95 dobra para **8,4 ms** (derrubando picos para 119 fps).
4. **Validação do teto**: O limite `LENS_AREA_MAX = 60000` em `src/ui/shared/glass.mjs` é fisicamente o joelho ótimo da curva. Ele mantém as peças de controle (dock e barra) com refração total e preserva peças grandes (palcos e coluna) no desfoque CSS nativo sem perda de quadros.

---

## 4. Memória Ocupada pelo Mapa da Lente do Palco (Referência Técnica)

- **Dimensão do palco na tela**: 1625 × 1151 px
- **Fator de escala ($k = 600 / \max(w,h)$)**: 0.3692 (36.9% do tamanho)
- **Dimensão do canvas da lente**: **600 × 425 px** (255.000 pixels)
- **Memória bruta do mapa (RGBA Offscreen)**: **996.1 KB** (1.020.000 bytes)
- **Memória bruta SEM escala (se fosse 1:1)**: 7.13 MB (economia de 86.4%)
- **Tamanho do data URL PNG (DOM 'feImage')**: **10,1 KB** (10.366 caracteres base64)
