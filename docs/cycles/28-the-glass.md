# CICLO 28 — O VIDRO: o Liquid Glass do jogo inteiro, refeito

> **Escrito em 18/09/2026, por ordem dele:** _"a etapa 3 já tá fechada. E eu quero que você
> esqueça todas as travas e guardas. Comece a estudar tudo e escreva o ciclo 28 com o Gemini."_
> Antes, no mesmo dia: _"quero basicamente refazer todo o liquid glass do meu jogo, para ser
> praticamente idêntico ao liquid glass da Apple, o último mais atualizado."_
>
> O estudo: a [pesquisa 12](../research/12-advanced-apple-liquid-glass.md) do Gemini (a ótica
> do visionOS e o que a Web faz), o inventário dele (`tmp/vidro-inventario.md`), e o que o
> projeto já mediu sobre vidro (abaixo, §2). Este ciclo é escrito por Claude e Gemini.

---

## 1 · A tese: o jogo tem UM vidro, e ele já existe — na barra

O vidro da barra superior (`topbar.mjs` + `glass.mjs`) já é o vidro da Apple em quatro das
cinco partes: **lente de borda** por campo de distância (`feDisplacementMap`, só a faixa do
bisel refrata, rampa quadrática), **desfoque com saturação** (1,9), **aresta de Fresnel** (sete
paradas: acesa no zênite, apagada no meio, rim no nadir) e **squircle** (a forma sai de dentro do
filtro, por `feComposite`). O resto do jogo — rail/dock, palcos, botões, diálogos — usa o vidro
antigo de `20-material.css`: desfoque chapado, borda de 1px uniforme, dois biséis de 1px e
`border-radius`. **São dois vidros hoje. O ciclo faz um.**

O que muda não é a receita: é quem a aplica. Hoje só a barra "se veste" (`dress`). O ciclo tira
`dress` da barra e o põe em `glass.mjs` como **`glaze(node, level)`**, que veste qualquer peça:
mede a caixa, instala a lente do tamanho dela, pinta a pele, e escreve o `backdrop-filter`. Os
três níveis (palco, ação, apoio) passam a ser só densidade do corpo e força da aresta — nunca
outro filtro.

## 2 · O que já foi medido, e vale (medição não expira)

| o quê                                                            | número                                                              | onde                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| um segundo filtro numa peça que já tem gradiente animado         | −17,9 fps (`glass-support` no `.tray__month`), −28,3 noutra peça    | `45-screen-cabinet.css`                   |
| fundo em movimento sob `backdrop-filter`                         | tela a 31 fps                                                       | `40-shell.css`                            |
| luz animada em `:root` (`--light-angle`)                         | 627 elementos recalculados por quadro, 7,9ms; GPU 82% → 12% sem ela | `20-material.css`                         |
| `clip-path` ou `filter` num ancestral de vidro                   | mata o `backdrop-filter` — a forma tem de sair de dentro do filtro  | `glass.mjs`                               |
| lente maior que 2200×400                                         | estoura a memória do canvas do mapa                                 | `glass.mjs` (`installLens`)               |
| `backdrop-filter` em elemento que muda de lugar na troca de tela | superfície com a caixa velha por 6 quadros — o pisca laranja        | `20-material.css` (18/09)                 |
| desfoque animado em tela inteira na troca                        | +40ms de GPU por troca                                              | `docs/evidence/styles/transition-cost.md` |
| saturação do vidro sobre o jacarandá                             | o croma do tampo é o que ele mandou não mudar — mede-se no pixel    | `40-shell.css`                            |
| vidro hoje: `npm run screen`                                     | 240 fps material × 240 controle a 1440×900                          | 18/09                                     |

## 3 · A receita — o que a Apple faz, e o que entra

| parte          | hoje (fora da barra)                     | o ciclo                                                                                          |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| corpo          | gradiente translúcido por nível          | o mesmo, com o croma do fundo medido: o jacarandá sob o dock não perde saturação                 |
| vibrância      | `blur(18px) saturate(1.5)`               | `blur` e `saturate` por token, calibrados no pixel sobre madeira E sobre aurora (os dois fundos) |
| lente de borda | nenhuma                                  | a da barra, em toda peça: só o bisel refrata, o centro é plano                                   |
| aresta         | 1px uniforme + 2 biséis de 1px           | Fresnel (a rampa da barra): zênite aceso, meio apagado, rim no nadir; sem borda uniforme         |
| forma          | `border-radius`                          | squircle, de dentro do filtro                                                                    |
| aberração      | nenhuma                                  | **candidata**: separação de canais de 0,6–1,2px só na aresta; entra se custar < 1 fps            |
| luz            | 20° à esquerda, parada                   | a mesma, parada — a animada custou 82% de GPU                                                    |
| sombra         | contato + penumbra pela luz da sala      | a mesma família da mesa (`--cast-*`)                                                             |
| troca de tela  | vidro sem desfoque enquanto a troca dura | a mesma regra, agora para toda peça vestida (a lente é `backdrop-filter` também)                 |

**Os números propostos pelo Gemini** (`tmp/vidro-inventario.md` §3, com as fontes dele — HIG
Materials e WWDC23 10076): `blur(24px) saturate(1.85) brightness(1.05)`; corpo `rgba(255,255,255,
0.05)` no topo e `rgba(18,22,28, 0.42)` no dock; aresta em gradiente de Fresnel 0,32 → 0,06 em vez
da borda uniforme de 0,14; bisel topo 0,40 / meio 0,08 / base 0,18; squircle n = 4,4 (s 0,6);
lente de 14px com escala 18 (hoje 13/17 na barra); aberração de 1,2px nos canais R/B na aresta;
sombra dupla, contato `2px 4px 0,25` + ambiente `12px 32px −8px 0,5`. Cada um só entra **medido
nas duas mesas**: fps nos dois braços e croma no pixel (o jacarandá sob o dock com ΔE < 3 é o
critério dele). Número sem medição é chute, e chute não entra.

**Inventário (Gemini):** 3 cápsulas na barra (392×44, 136×44, 240×44, sobre a aurora); o rail
(dock 376×62 sobre o jacarandá; coluna 216×~750 sobre a aurora); os palcos de Congresso,
Finanças e Ministérios (~1320×760, sobre a aurora); os diálogos da posse (560×480) e do fecho
(480×320) com os botões (180×44). **Pior caso: 6 superfícies com `backdrop-filter` ao mesmo
tempo.** Só a barra tem lente hoje.

## 4 · A ordem — do mais barato ao mais caro, uma peça por sessão

| #   | o quê                                                                                                                                                                                  | mede                                                                             | dono                               |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | **Base.** `npm run screen` passa a medir TODAS as telas (hoje mede uma), dois braços; croma do jacarandá sob cada vidro no pixel; contraste AA do texto sobre vidro. Nada muda na tela | os números de partida, por tela                                                  | Gemini (scripts) · Claude (portão) |
| 1b  | **Os tokens visionOS** (`--glass-blur`, corpo, aresta): muda o jogo inteiro de uma vez, é barato e volta com um `git revert`. Ele olha antes de seguir                                 | fps ≤ 0,2ms de diferença por tela; ΔE < 3 no jacarandá sob o dock; AA no texto   | Claude · Gemini mede               |
| 2   | **`glaze()`.** `dress` sai da barra para `glass.mjs`, genérico: mede, instala a lente, pinta a pele, escreve o filtro. A barra passa a usá-lo e fica idêntica (captura pixel-igual)    | diff de pixel = 0 na barra                                                       | Claude                             |
| 3   | **O dock e a coluna** — a peça-piloto, sobre a madeira. Lente, Fresnel, squircle. O pisca já tem regra                                                                                 | fps dois braços no Gabinete; croma da madeira sob o dock; captura para ele olhar | Claude · Gemini mede               |
| 4   | **Os palcos** (`glass-stage`: Email, Congresso, Finanças, Estado, Área, Fecho, Posse). Lente em peça alta: o mapa nasce em resolução menor e o filtro o estica — medir memória         | fps por tela; memória do mapa; contraste AA                                      | Claude · Gemini mede               |
| 5   | **As ações** (`glass-action`, `.action`): o botão de avançar já é a referência; os outros seguem                                                                                       | fps; captura                                                                     | Claude                             |
| 6   | **Aberração cromática** na aresta, só se couber: um filtro a mais por peça                                                                                                             | fps < 1 de diferença, senão não entra                                            | Gemini (filtro) · Claude           |
| 7   | **Limpeza.** `20-material.css` fica só com o que `glaze` não faz; tokens e biséis velhos saem; a guarda `material` é reescrita (§5)                                                    | prosa ≤ 20%, captura pixel-igual                                                 | Claude · Gemini                    |

Cada sessão fecha com `npm run validate` verde, captura aberta, `npm run screen` nos dois braços
na tela mexida, e handoff reescrito. Uma peça por sessão; o Gemini recebe 2 ou 3 tarefas por
lote e só o Claude roda o passeio.

## 5 · As guardas — o que ele mandou esquecer, e o que isso quer dizer aqui

Ordem dele: _"esqueça todas as travas e guardas"_. O que trava o desenho sai; o que mede fica,
porque medição não expira e é ela que vai dizer se o vidro novo custou fps.

- **`material` ("um `backdrop-filter` no projeto")** — trava o ciclo: a lente é `url(#lente)` por
  tamanho de peça. Ela é **reescrita**: um vidro continua sendo um, mas "um" passa a ser _uma
  receita_ — todo `backdrop-filter` do jogo é o token de desfoque ou uma lente instalada por
  `glass.mjs`. O que ela continua recusando é o desfoque avulso teclado num CSS de tela.
- **`tokens`** — ganha os tokens novos da receita e perde os biséis de 1px. Fica.
- **`prose`, `annexes`, `cascade`** — não tocam no vidro. Ficam.
- **O portão de fps (`npm run screen`)** — deixa de ser "fora do portão" para este ciclo: cada
  sessão publica os dois braços da tela mexida no handoff. O número que reprova é o de sempre:
  a tela cai abaixo do controle.
- **As recusas de gosto nos docs** (o marrom, o veludo, o que "não entra") — não valem para o
  desenho deste ciclo; se um material novo couber na tese, oferece-se.

## 6 · O que não entra

- WebGL e bibliotecas de "liquid glass" prontas: refratar o DOM por textura pede foto do DOM
  a cada quadro (25–45ms na thread principal com o tampo de 7,2 MB) — pesquisa 12 §4;
- luz animada (medida: 82% de GPU);
- desfoque animado na troca de tela (medido: +40ms de GPU por troca);
- um segundo filtro numa peça que já anima (medido: −17,9 e −28,3 fps).
