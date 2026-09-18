# CICLO 26 — LIMPEZA E POLIMENTO DO GABINETE

> **Escrito em 18/09/2026, por ordem dele:** _"antes da etapa 3, uma boa otimizada, limpeza e um
> bom polimento em todo o gabinete, mesa, elementos, css, tudo. Você e Gemini trabalhando
> juntos, bolem um plano antes para eu aprovar."_ Ele aprovou o plano no mesmo dia.
>
> O inventário que sustenta os números é do Gemini (`tmp/inventario-gabinete.md`, 18/09).

---

## 1 · A regra

Três blocos, nesta ordem: **limpeza → otimização → polimento**. Cada bloco fecha com `npm run
validate` verde, captura aberta e handoff reescrito. **Um dono por arquivo.** O Gemini recebe
2 ou 3 tarefas por lote e só edita o que o lote nomeia.

## 2 · Limpeza — sem mudar um pixel

**Portão do bloco:** a captura do passeio sai idêntica antes e depois (diff de pixel = 0).

| #   | o quê                                                                                                                                                  | número hoje                                                                                   | dono                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 2.1 | Prosa nos comentários. Fica só a alternativa reprovada com o número; sai data, citação, histórico (regra do CLAUDE.md). Meta: ≤ 20% de linhas de prosa | `46-desk.css` 43% (462 linhas) · `cabinet.mjs` 44% · `00-tokens.css` 40% · `40-shell.css` 24% | Claude: `46-desk`, `cabinet.mjs` · Gemini: `00-tokens`, `40-shell` |
| 2.2 | Tokens mortos                                                                                                                                          | 3: `--bg`, `--paper-edge`, `--letter-ink`                                                     | Gemini                                                             |
| 2.3 | CSS morto                                                                                                                                              | **0** seletores órfãos — medido, nada a fazer                                                 | —                                                                  |
| 2.4 | `tmp/`: os scripts sem citação no handoff ou nos créditos vão para `tmp/arquivo/`. Não se apaga; ele decide depois                                     | 460 scripts, 28 citados                                                                       | Gemini                                                             |

## 3 · Otimização — peso e pintura

| #   | o quê                                                                                                                | número hoje                                                            | dono        |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------- |
| 3.1 | Peso: `preload` do tampo e da pasta, ordem de carregamento. Medir tempo até a mesa pintada, cache frio, antes/depois | `assets/` 9,5 MB; o tampo é 75% (7,2 MB lossless, ordem dele)          | Claude      |
| 3.2 | Camadas: tirar `will-change` de quem não anima, só se o fps não cair. Medir na janela dele (1920×937)                | 28 declarações caras; `npm run screen` 238,7 material × 237,7 controle | Claude      |
| 3.3 | Repintura no resize (`fitDesk`): contar quadros por resize                                                           | —                                                                      | Gemini mede |

## 4 · Polimento — o que se vê, cada item com captura para ele olhar

| #   | o quê                                                                                                                                             | dono                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 4.1 | Luz coerente nas 5 peças: a medição da caneta (lado da luz × lado da sombra) em envelope, pasta e telefone; penumbra nunca mais larga que a queda | Claude                        |
| 4.2 | Bordas das peças giradas (envelope, caneta, telefone): medir serrilhado na aresta                                                                 | Claude                        |
| 4.3 | Hover/foco/cursor nas 3 peças clicáveis, iguais entre si, foco visível no teclado                                                                 | Gemini levanta, Claude aplica |
| 4.4 | Prancha lado a lado: o tampo dele × as 3 texturas reais do Poly Haven (CC0, 4096²) em `tmp/madeira-candidatas/`                                   | Claude                        |

## 5 · O que ele já decidiu em 18/09, e entrou antes do ciclo

- **A cena não encolhe mais na janela dele:** `fitDesk` só encolhe quando uma peça sairia da
  janela (faixa medida das peças) e desloca a cena para centrar a faixa, não a foto. A 1920×937
  a cena está a 1:1 e o corte come 21px de madeira por beira. É a opção que serve à Etapa 3: o
  menu inferior vai cobrir madeira, não peça.
- **O telefone fica como está; os algarismos e o número estão assados na foto** — em DOM eles
  saíam tortos a 9,5px girados 6° e não vibravam com o toque.

## 6 · Fechamento — 18/09/2026

Tudo medido, e o que mudou no código foi pouco de propósito: a prosa dos quatro arquivos (43/38/40/24%
→ 30/31/6/4%), o anel de foco único com a pasta no teclado, e nada mais. Preload reprovado (pasta
visível 1262 → 2008 ms a 10 Mbps), `will-change` todos animam, resize em 2 quadros, luz coerente
(1:3 a 1:28), arestas com 1,7–1,9 px de transição. Portão verde e passeio pixel-igual em todo bloco.
