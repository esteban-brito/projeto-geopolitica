# Pesquisa 05 — O MATERIAL E O GESTO: o que a Apple faz, medido contra o que o projeto fazia

> **Estudo, e ele nasceu de uma recusa dele.** Escrito em 31/08/2026, depois de **sete**
> tentativas de gesto recusadas — _"não parece uma animação realmente bem feita"_, _"quero algo
> smooth, clean, flutuante, lento"_, _"ESTUDE, APRENDA COMO UM DESIGNER DA APPLE FARIA"_.
>
> ⚠ **Cada tentativa recusada foi um ajuste de PARÂMETRO.** Este arquivo existe porque o
> problema nunca esteve nos parâmetros — estava em **quatro decisões de modelo**, e nenhuma
> delas se alcança girando um número.

---

## 0 · O ERRO DE MÉTODO, e ele é o achado mais caro

| tentativa | o que eu mexi                                         | resultado                |
| --------- | ----------------------------------------------------- | ------------------------ |
| 1         | dois movimentos, `--dur-piece`                        | recusado                 |
| 2         | uma curva só, `--dur-screen`                          | recusado                 |
| 3         | quatro durações (180 · 220 · 320 · 320 macio)         | recusado                 |
| 4         | `--ease-float`, a curva de folha do iOS               | recusado                 |
| 5         | quatro durações da mesma mola (360 · 460 · 580 · 700) | _"todos parecem iguais"_ |
| 6         | amplitude — 18px, desfoque, dois planos               | recusado                 |
| 7         | mola integrada por quadro, preservando velocidade     | recusado                 |

⭐ **Da 1 à 6 eu girei um número. Só a 7 trocou de modelo — e ainda assim faltavam três.**
A lição é a mesma que o projeto já registra em outra família: _antes de chamar de defeito, faça
a pergunta que o instrumento nunca fez._ Aqui: **antes de girar o parâmetro, pergunte se o
modelo é o certo.**

---

## 1 · ⭐ A MOLA NÃO SE PARAMETRIZA POR RIGIDEZ — e o quique padrão é ZERO

**O que eu fazia:** `stiffness: 120, damping: 20`, e uma ultrapassagem de 3,8% a 5,4% porque eu
supunha que ultrapassar era o que fazia "flutuar".

**O que a Apple faz:** ela **abandonou** rigidez/amortecimento de propósito — designer não
raciocina em `stiffness: 170`. O SwiftUI expõe `Spring(duration:bounce:)`, e a tradução é:

```
ω = 2π / duração        ζ = 1 − quique        k = ω²        c = 2ζω
```

⭐ **E o padrão de quase toda a interface do iOS — `.smooth` — tem quique ZERO**, ou seja é
**criticamente amortecida e não ultrapassa nunca.** Ultrapassagem é reservada a gesto **físico**:
folha arremessada, item arrastado. **Num botão ela lê como brinquedo — o oposto de refinado.**

⚠ **`duração` é a duração PERCEBIDA, e não o tempo até parar.** Foi por isso que "700ms" leu como
rápido: a tira de seis instantes mostrou o gesto assentado em **240ms** com o token dizendo 700.

---

## 2 · ⭐ TRANSIÇÃO CSS NÃO PRESERVA VELOCIDADE — e é limitação de modelo

Tirando o dedo no meio do gesto, o navegador começa uma curva **nova** a partir do valor
corrente, **com velocidade zero**. A peça trava e recomeça.

⛔ **Nenhum `cubic-bezier`, `linear()` ou duração conserta isso.** É por isso que toda reprodução
sai idêntica e toda reversão dá solavanco — e é a diferença que o olho chama de "enlatado".

**O conserto é integrar a mola por quadro**, com posição **e velocidade** como estado:

```js
const a = -k * (x - alvo) - c * v; // semi-implícito: estável em dt grande
v += a * dt;
x += v * dt;
```

**A prova, medida** (`tmp/prova-mola.mjs` — `y` da pilha a cada 40ms, 7,5 = repouso · 0 = aberto):

```
7.23 6.80 5.74 4.67 3.71 2.92 2.58 2.00 │ 1.63 1.90 2.68 3.54 3.95 4.68 5.29 5.78
                                 saída ─┘
```

⭐ **No quadro seguinte à saída ela CONTINUOU descendo** (2,00 → 1,63) antes de virar. O momento
foi absorvido, e não descartado.

### E disso sai uma segunda regra: pressionar e soltar são molas DIFERENTES

| gesto      | mola                    | por quê                                                              |
| ---------- | ----------------------- | -------------------------------------------------------------------- |
| **descer** | 0,22s · quique **0**    | é **informação** — imediato, senão o botão parece não ter registrado |
| **subir**  | 0,42s · quique **0,22** | é **devolução** — o quique é o que dá massa à peça                   |

**Uma mola para os dois lados lê como mecanismo; duas leem como objeto.**

---

## 3 · ⭐ A QUINA NÃO É UM ARCO DE CÍRCULO — e é a razão nº 1 de "quase Apple"

`border-radius` desenha um **arco**: a curvatura salta de zero (na reta) para 1/r (no arco) num
único ponto. O olho lê esse salto como **emenda**. A quina da Apple é uma **superelipse**: a
curvatura **cresce** ao longo da transição, e a reta derrete na curva em vez de encontrá-la.

**Medido** (`tmp/prova-squircle.mjs`, botão de 164×54, raio 16, suavização 0,6):

|                                       | valor         |
| ------------------------------------- | ------------- |
| desvio máximo entre as duas silhuetas | **0,27px**    |
| perímetro                             | 407,9 → 408,3 |

⭐ **0,27px — e é por isso que ninguém consegue nomear o problema.** O olho não lê a POSIÇÃO da
borda; lê a **taxa de curvatura**. Um desvio invisível distribuído ao longo de toda a quina muda
a leitura inteira da peça.

⚠ **E ele obriga a refazer a sombra.** `clip-path` recorta o elemento **inteiro**, `box-shadow`
incluída — a sombra some. Quem faz sombra numa forma recortada é `drop-shadow`, que segue o alfa.
E ele **empilha**, que é como a Apple monta penumbra: **três camadas**, cada uma mais larga e mais
fraca, porque sombra real tem umbra curta e escura e penumbra longa e fraca. **Uma camada só é o
que faz sombra de CSS parecer adesivo recortado.**

⚠ **A aresta também precisa da forma:** `border` desenha o retângulo do CSS, e viraria um contorno
de arco em volta de uma peça que não é arco. Ela virou traço de SVG sobre o mesmo caminho, **meio
pixel para dentro** — senão o `clip-path` come metade dele.

---

## 4 · ⭐ DESFOQUE EM TEXTO NÃO É IDIOMA DA APPLE

Eu tinha posto `blur(7px) → 0` na leitura, achando que era o que fazia "materializar".

⛔ **O iOS materializa com ESCALA e OPACIDADE**, e reserva desfoque para **material de fundo** —
não para tipo. **Texto borrado num toque lê como efeito de web**, e era parte do que soava errado.

---

## 5 · O DOSSIÊ EXTERNO — o que procede, e o que não

Ele chegou em 31/08 (`liquid glass novo.txt`) e **não é pesquisa: é um prompt** para outra IA
construir um componente. Lido contra o código, como manda o padrão da casa.

### ✔ O que procede

| item                        | o que foi feito                                                                                                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **§1.3 squircle**           | ✔ já construído, e por curvatura contínua — a seção 3 acima                                                                                                                                     |
| **§1.4 Fresnel**            | ✔ **a aresta deixou de ser uniforme.** `--glass-edge` é um cinza único em todo o perímetro; vidro real reflete mais no ângulo raso. Virou gradiente: quina de cima 0,42 · meio 0,05 · base 0,19 |
| **§1.4 especular dinâmico** | ✔ segue o ponteiro, em coordenada da peça. **Sem mola aqui de propósito** — reflexo com atraso lê como arrasto                                                                                  |
| **§1.5 saturação 180–200%** | ⚠ o projeto está em **150%**. **Não medido ainda** — fica como pergunta aberta                                                                                                                  |

### ⛔ O que foi recusado, com a razão

| pedido                                       | por quê                                                                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **shader GLSL / WebGL / Three.js**           | zero build e zero dependência de runtime é **decisão fechada** do projeto, não preferência                                                    |
| **refração por Snell + aberração cromática** | **não há o que refratar**: o topo da tela é `#02040a` desde hoje. É o mesmo achado que matou a casca sólida                                   |
| **`feTurbulence` + `feDisplacementMap`**     | filtro SVG **não amostra o backdrop** — só distorce o conteúdo do próprio elemento. E o vidro já custou **17,9** e **28,3 fps** neste projeto |
| **"60 fps estáveis" como critério**          | o próprio projeto registra que o medidor não mede — os dois braços batem no teto do monitor (achado 10)                                       |

---

## 5.5 · ⭐ O VIDRO REFRATIVO — e ele exigiu TRÊS achados de arquitetura

> Ele suspendeu as travas: _"esqueça todas as travas e decisões, isso que nós estamos fazendo é
> um experimento"_. Com isso a refração real virou possível — e ela **funciona sem shader**.

**`backdrop-filter: blur()` não é vidro: é leite.** Vidro tem VOLUME, e volume desvia o que está
atrás — a borda de um painel funciona como lente e encolhe o fundo no perímetro. A técnica:
`backdrop-filter: url(#filtro)` com `feDisplacementMap`, comandado por um mapa gerado da SDF do
squircle (R = deslocamento em X · G = em Y · 128 = zero), com **rampa quadrática** — numa lente
a curvatura cresce para a borda, e rampa linear lê como chanfro.

### ⛔ E três coisas mataram o vidro antes de ele funcionar

| achado                                                         | o que acontece                                                   |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| **`clip-path` em QUALQUER ancestral mata o `backdrop-filter`** | o painel simplesmente desaparece. Testado em três formas         |
| **um `filter` num ancestral também mata**                      | ele cria uma raiz de backdrop, e o filho amostra o vazio         |
| **um irmão OPACO atrás entra no backdrop**                     | o vidro passa a refratar a chapa da sombra, e o painel sai preto |

⭐ **E as três se encadearam num nó que eu mesmo dei:** o squircle pediu `clip-path` → o
`clip-path` recortava a `box-shadow` → mudei a sombra para `drop-shadow` no envoltório → **o
filter do envoltório matou o vidro.** Uma correção criou a seguinte, três vezes.

### ⭐ A saída: a forma sai do FILTRO, e a sombra não tem corpo

- **a forma** deixa de ser recorte de caixa: depois de refratar e borrar, `feComposite
operator="in"` contra a silhueta do squircle. A forma passa a ser **saída** do filtro;
- **a sombra** vira `box-shadow` num irmão **sem fundo nenhum** — `box-shadow` não depende de
  conteúdo, então o elemento não pinta nada e ainda projeta;
- ⚠ **e a sombra pode ser arco:** 20px de desfoque não mostram continuidade de curvatura. **O
  squircle é para a ARESTA, não para a sombra.**

---

## 5.6 · ⛔ O QUADRO SÓ PODE TOCAR `transform` E `opacity` — e isso é medido

Ele relatou _"quando eu tiro o mouse parece que dá uma mini travada"_. A causa não era a mola:
a cada quadro eu reescrevia `box-shadow` **e regerava a imagem SVG da aresta como data-URI** —
obrigando o navegador a reparsar e redecodificar um SVG **sessenta vezes por segundo**. As duas
coisas **repintam**; nenhuma é composta.

**O conserto:** duas camadas de sombra estáticas com opacidade cruzada, e duas arestas estáticas
(a fria do Fresnel e a quente do ouro) com opacidade cruzada.

|                       | antes   | depois      |
| --------------------- | ------- | ----------- |
| quadro médio          | 24,4ms  | **16,67ms** |
| p95                   | 33,4ms  | **16,7ms**  |
| pior quadro           | —       | **16,8ms**  |
| quadros acima de 32ms | **172** | **0**       |

⭐ **16,67ms é 60fps exato.** A regra que sai daqui vale para qualquer peça: **se o quadro toca
qualquer coisa além de `transform` e `opacity`, ele repinta — e repintar por quadro trava.**

---

## 5.7 · ⭐ A PEÇA NÃO PODE SE MOVER DEBAIXO DO CURSOR

Ele descreveu assim: _"não é um travamento de verdade, não consigo explicar, é tipo assim quando
eu tiro o mouse de cima, pra voltar a estaca zero"_. **E não era travamento mesmo** — o medidor
dava 16,67ms travado, zero quadros longos.

⛔ **O botão subia 3px no hover, e subia DEBAIXO DO CURSOR.** Perto da aresta de baixo a peça
saía de sob o ponteiro → `pointerleave` → começava a voltar → reencontrava o ponteiro no caminho
→ `pointerenter` de novo. **Um pingue-pongue na saída.**

**A prova** (`tmp/prova-pingue.mjs`) — o cursor **parado** a 1,5px da aresta de baixo, sem se
mexer nenhuma vez:

| quem escuta o mouse     | entradas disparadas |
| ----------------------- | ------------------- |
| a caixa **parada**      | **1** — correto     |
| o botão que **se move** | **2**               |

⭐ **O ponteiro ficou imóvel e o evento disparou de novo.** Com um mouse real, que treme um pixel,
isso dispara muitas vezes — e produz exatamente uma sensação que não é travamento e não tem nome.

**A regra que sai daqui, e ela vale para qualquer peça que se mova no toque:**

> ### ⚖ A área que RECEBE o ponteiro nunca é a área que SE MOVE.
>
> Uma caixa parada escuta; um filho dela anda.

⚠ **E um segundo artefato saiu junto:** a rampa da leitura era reta e zerava a 33% do caminho,
então **na volta ela sumia de uma vez** enquanto todo o resto continuava suavizando. Virou
`smoothstep`, que tira a quina dos dois lados.

---

## 5.8 · A PASSADA DE PADRONIZAÇÃO — e "padronizado" é palavra que se mede

O censo (`tmp/censo-barra.mjs`) mede três coisas no pixel renderizado: combinações de tipo,
raios visíveis e contraste par a par.

|                              | antes | depois                |
| ---------------------------- | ----- | --------------------- |
| combinações de tipo          | **6** | **5**                 |
| tratamentos no corpo de 10px | **2** | **1**                 |
| raios de arco visíveis       | 3     | **0**                 |
| pares abaixo de 4,5:1        | 0     | **0** — o pior é 8,79 |

⚠ **A dica do botão estava fora da escala:** `10px/600/0,03em` contra `10px/400/0,18em` dos
sete rótulos. **Dois tratamentos no mesmo corpo não se enxergam, se contam** — e o censo contou.
Ela voltou ao tratamento de rótulo, e **o texto é que encurtou**: `46 MESES RESTANTES` media
148px num botão de 164; `RESTAM 46 MESES` cabe com 44px de folga.

⚠ **E a etiqueta era o arco no meio do squircle.** Se a curvatura contínua está certa no botão,
está certa nela: um raio de arco ao lado de uma quina contínua é a mesma emenda que o squircle
existe para apagar. ⭐ **E a quina dela é vestida depois de montada**, porque o squircle depende
do tamanho e o tamanho sai do texto — folha de estilo não alcança isso.

### ⛔ E daqui sai um acoplamento que vale para o projeto inteiro

> ### ⚖ Superfície de vidro e quina contínua estão ACOPLADAS.
>
> `clip-path` mata o `backdrop-filter`, então **toda peça de vidro que queira squircle tem de
> tirar a forma do próprio filtro.** Peça sem vidro pode usar `clip-path` à vontade.

⚠ **A barra ainda tem quina de arco** (`border-radius: 0 0 16px 16px`) e é vidro — logo ela só
ganha squircle pelo mesmo caminho do botão. **Divergência conhecida e declarada.**

### E a leitura saiu de trás do mouse

`restam 46 meses` só existia no hover, e o projeto já recusou esconder leitura atrás do ponteiro
duas vezes (C11 e ciclo 15). Ela voltou fixa à zona do "quando" — e **`1º mandato` saiu no
lugar dela**, porque num jogo de um mandato só ele é constante, e constante não é informação.

---

## 5.9 · ⭐ O LIMIAR DEIXOU DE SER UM RISCO MUDO — e o conserto foi FORMA, não texto

O medidor da Base trazia uma marca âmbar na posição da maioria, e **ela não dizia o que era**.
Um traço no meio de uma barra é ruído até alguém explicá-lo, e o projeto não deixa número sem
explicação na tela.

⭐ **O conserto não acrescentou uma palavra:** o preenchimento **troca de cor no limiar** — azul
de leitura acima da maioria, vermelho de sinal abaixo, e o valor acompanha. A marca passa a ser
lida como _"é aqui que a cor muda"_, e o estado ruim se anuncia sem ser lido.

⚠ **E a barra de estado ruim ficou na página**, ao lado da boa. **Uma leitura que só é vista no
estado bom nunca prova que o estado ruim se lê** — é a mesma lição da guarda que nasce vermelha.

---

## 5.10 · ⚠ MEDIR NA DEMONSTRAÇÃO É MEDIR A DEMONSTRAÇÃO

Depois de acrescentar a segunda barra, o medidor caiu para **19,7ms de média e 104 quadros
longos** — e a conclusão fácil seria que o vidro ficou caro.

**Medido de novo com a barra SOZINHA, que é o que o jogo terá:**

|                       | página do clone | uma barra só |
| --------------------- | --------------- | ------------ |
| lentes vivas          | 3 (+4 foscos)   | **1**        |
| quadro médio          | 19,69ms         | **16,67ms**  |
| quadros acima de 32ms | 104             | **0**        |

⭐ **O custo era da PÁGINA, e não do desenho.** A demonstração tem provador, bancada e duas
barras vivas ao mesmo tempo; o jogo tem uma. **Um número tirado da demonstração é um número
sobre a demonstração** — e é a mesma família do achado que já custou caro aqui: a sonda que
espalha mede o espalhamento.

---

## 5.11 · A PASSADA DE POLIMENTO — quatro defeitos, e o último era invisível

### ⛔ `encodeURIComponent` NÃO ESCAPA ASPA SIMPLES — e isso apagou o Fresnel em silêncio

Ela está na lista de caracteres que a função deixa passar (`- _ . ! ~ * ' ( )`), e **todo SVG
embutido aqui usa `xmlns='...'`**. O `'` fechava o `url('…')` no meio, e a imagem inteira virava
`none`: **sem erro de console, sem aviso.**

⚠ **Estavam todas quebradas** — a aresta Fresnel, a quente, o anel de foco e a silhueta da
etiqueta. **A aresta Fresnel simplesmente não existiu desde a reescrita da peça**, e a captura
não acusou porque o vidro já tem contorno próprio vindo do filtro.

> ### ⚖ Imagem embutida como data-URI falha CALADA.
>
> Ela não some com erro: ela some com `background-image: none`. Toda vez que uma existir,
> confira o valor COMPUTADO — não o atributo.

### ⚠ A faísca mentia sobre a amplitude

Normalizada pelo próprio mínimo e máximo, **toda série preenchia os mesmos 9px** — a que mal se
moveu ficava tão dramática quanto a que disparou. Medido: **9,0 · 9,0 · 9,0**.

Agora a altura é proporcional ao movimento **relativo** (variação ÷ nível médio, contra uma
referência comum). Medido depois: **1,8 · 9,0 · 5,4** — o PIB, que se moveu 5% do próprio nível,
desenha quase reto; a inflação, que se moveu 30%, desenha cheio.

⚠ **A referência é de PRÉVIA, e não do jogo:** a régua de verdade sai das constantes de escala
de Finanças, e trazê-las para o clone seria uma segunda verdade sobre volatilidade.

### ⚠ E as três faíscas tinham a MESMA COR para significados opostos

`rgb(111,140,176)` nas três: **PIB subindo é bom, inflação subindo é ruim**, e as duas eram
desenhadas no mesmo azul calmo.

⭐ **O sinal foi para o PONTO FINAL, e não para a linha.** Quatro linhas coloridas viram quatro
alarmes; um ponto colorido no fim de uma linha calma diz a mesma coisa e deixa a leitura quieta.
E `--signal-*` é **tinta e nunca preenchimento** no projeto — o traço de um SVG é `color:`, então
ele vale ali.

### ⚠ O anel de foco era um retângulo em volta de uma peça de curvatura contínua

`outline` não sabe fazer squircle. Ele virou uma terceira camada estática com a mesma silhueta, e
o do navegador foi suprimido. ⚠ **E ele precisou ser desenhado POR DENTRO:** um traço de 2px
centrado no mesmo caminho da aresta tem metade fora do elemento, e `overflow: hidden` come essa
metade — sobrava um fio de 1px que mal se via.

---

## 5.12 · ⭐ O QUIQUE PRECISA DE VIAGEM — e eu ofereci um invisível

Pergunta dele sobre a quarta mola da bancada: _"não vi diferença nesse do quique pros outros, o
que era pra ser diferente?"_ **Nada — e a culpa é minha.**

A ultrapassagem de uma mola é `e^(−πζ/√(1−ζ²))`, e ela é uma FRAÇÃO do que a peça anda:

| quique   | ζ    | ultrapassa | no gesto (7,5px) |
| -------- | ---- | ---------- | ---------------- |
| 0,00     | 1,00 | 0%         | 0px              |
| **0,15** | 0,85 | 0,63%      | **0,047px**      |
| 0,30     | 0,70 | 4,6%       | 0,345px          |
| 0,50     | 0,50 | 16,3%      | **1,223px**      |
| 0,70     | 0,30 | 37,2%      | 2,792px          |

⚠ **Uma tela resolve ~0,3px.** O quique de 0,15 ultrapassava 0,047px — **quinze vezes abaixo do
visível**. Não havia diferença para ver.

⛔ **E o mesmo valia para a assimetria do toque que eu descrevi com tanta confiança:** o soltar
com quique 0,22 age sobre a escala, que move 4,9px de aresta — **0,03px de ultrapassagem**. A
assimetria existia no papel e não existia na tela. Em **0,35** ela passa do limiar.

**Medido no botão depois do conserto:** a pilha ultrapassa **1,081px** o destino antes de voltar
(previsto 1,223 — a diferença é o passo discreto da integração).

> ### ⚖ Antes de oferecer um parâmetro, calcule o que ele produz em PIXEL.
>
> É a terceira vez nesta sessão que um número foi girado abaixo do limiar do olho: as quatro
> durações que "pareceram iguais" (7,5px de viagem), o quique de 0,15, e a assimetria do toque.
> **Quique precisa de viagem** — os valores da Apple são calibrados para folhas e cartões que
> andam centenas de pixels, e num gesto de 7,5px ele não é um botão que se gire.

---

## 5.13 · ✔ A MOLA ESTÁ ESCOLHIDA — 0,40 s, sem quique

Palavras dele: _"gostei mais da 1. foco total nela"_. **Depois de sete gestos recusados, este é
o aceito**, e ele é o mais rápido e o mais contido dos quatro.

```
duração 0,40 s      quique 0      ω = 15,71 rad/s      ζ = 1      (criticamente amortecida)
```

⭐ **E ele confirma o achado da seção 1 pelo lado da preferência:** o padrão da Apple é quique
ZERO, e foi exatamente o que ele escolheu entre quatro opções — inclusive contra uma que quica
1,08px de verdade. **Ultrapassagem não era o que faltava; era o que sobrava.**

**As três durações são uma família, e as do toque acompanharam:**

|            | duração | quique | por quê                                               |
| ---------- | ------- | ------ | ----------------------------------------------------- |
| **abrir**  | 0,40 s  | 0      | a escolha dele                                        |
| **cravar** | 0,16 s  | 0      | descer é informação — imediato, e sem quique          |
| **soltar** | 0,31 s  | 0,35   | devolução; e 0,35 é onde ela passa dos 0,3px visíveis |

⚠ **Com a abertura em 0,40 s, um soltar de 0,42 seria mais lento que o gesto inteiro** — por
isso as três caíram na mesma proporção em vez de ficarem como estavam.

**O que isso vira quando o gesto for para o jogo:** `--dur-open`, `--dur-press` e `--dur-release`
no `00-tokens.css`, com a mola integrada por quadro como peça compartilhada — válida para
qualquer superfície que revele leitura no toque.

---

## 5.14 · A LIMPEZA FINAL — e a maior economia era uma fonte que ninguém pedia

**A página autônoma caiu de 455 KB para 221 KB — 51%** —, e a economia inteira veio de uma
medição de dez segundos: `document.fonts` diz quais faces o navegador de fato **carregou**.

| face embutida          | pedida pela página?                                              |
| ---------------------- | ---------------------------------------------------------------- |
| Inter latin            | ✔                                                                |
| Inter latin-ext        | ⛔ nunca — é alfabeto do leste europeu                           |
| Source Serif latin     | ⛔ nunca — `--font-record` não é usada por peça nenhuma da barra |
| Source Serif latin-ext | ⛔ nunca                                                         |

⚠ **O texto é português, e `ç ã ó ê` vivem todos em U+0-FF.** Conferido depois do corte: zero
glifos fora do latim na barra inteira, e uma face carregada.

⚠ **E as faces cortadas são REMOVIDAS, e não deixadas apontando para o vazio:** um `src` que não
resolve faz o navegador tentar buscar e falhar.

**O restante da limpeza:** o modo fosco do botão morreu junto com a bancada de molas, e as
sondas de uma pergunta só saíram de `tmp/` — o que ficou está inventariado em `tmp/LEIA.md`, com
a pergunta que cada instrumento responde.

### O estado final, medido

|                                  |                                   |
| -------------------------------- | --------------------------------- |
| custo de quadro de **uma barra** | **16,67ms · zero quadros longos** |
| combinações de tipo              | **5**                             |
| raios de arco visíveis           | **0**                             |
| pior contraste                   | **8,79:1**                        |
| erros de console                 | **nenhum**                        |
| página autônoma                  | **221 KB**                        |

---

## 5.15 · ⛔ REFRAÇÃO PRECISA DE MUNDO — e a intuição foi dele

Palavras dele: _"talvez a cor da barra, a textura, tudo isso tenha que ser mudado para o botão
realmente ser o liquid glass que queremos"_.

⭐ **Ele estava certo, e a minha própria medição já dizia isso — eu não tinha tirado a
conclusão.** Refração **desloca a amostragem do fundo**. Se o pixel vizinho é idêntico, deslocar
não muda nada. **A lente pode estar perfeita e não ter o que mostrar.**

**Medido atrás do botão, dentro da barra, em luminância de 0 a 255:**

| superfície da barra           | amplitude | gradiente local | muda em 17px |
| ----------------------------- | --------- | --------------- | ------------ |
| **A · como está**             | 3,8       | 0,041           | 0,29         |
| **B · brilho rasante**        | 3,8       | **0,033**       | 0,16         |
| **C · o substrato atravessa** | **14,0**  | **0,984**       | 0,83         |
| _(o provador, com listras)_   | ~200      | ~40             | ~90          |

⛔ **O brilho rasante PIOROU**, e ele ensina a regra: **rampa não é estrutura.** Um gradiente
liso muda pouquíssimo ao longo dos 17px que a lente desloca — refração precisa de **aresta**, e
gradiente não tem nenhuma.

⚠ **E o C, que multiplica o gradiente por 24, ainda fica abaixo do que o olho resolve:** a
lente desloca 17px e a luminância muda 0,83 em 255.

> ### ⚖ Liquid glass é uma técnica que precisa de MUNDO atrás.
>
> É por isso que a Apple a usa sobre foto, papel de parede e conteúdo colorido. Sobre a casca
> escura de um painel, **nem a dela mostraria refração** — o que resta ali é a lógica de
> material: Fresnel, quina contínua, desfoque, penumbra e o gesto. Isso o botão já tem inteiro.

**O que fazer com isso, e as três saídas são de desenho e não de código:**

1. **aceitar** — o botão é vidro na lógica de material, e a refração fica como capacidade que
   aparece quando passar conteúdo atrás;
2. **mudar o mundo** — clarear e povoar o topo da tela. ⚠ Desfaz o fundo meia-noite que ele
   pediu na mesma sessão;
3. ⭐ **levar o vidro para onde o conteúdo ESTÁ** — a Caixa de Entrada e as cartas ficam sobre o
   substrato e sobre texto e blocos. **Lá a lente tem aresta para dobrar**, e é onde ela pagaria.

---

## 5.16 · ⭐ O LÍQUIDO SE LÊ NA SILHUETA, e não na refração

Palavras dele: _"só tem glass no botão, falta o liquid, muito liquid"_. **E ele tem razão: até
aqui eu tinha construído o vidro e não o líquido.**

⚠ **E havia uma razão pela qual o caminho anterior não chegava lá:** eu perseguia a REFRAÇÃO, e
ela morre contra um fundo liso — medido, gradiente 0,041 em 255. **Líquido não depende do que
está atrás.** Um contorno que deforma é visível sobre preto, sobre foto, sobre qualquer coisa.

> ### ⚖ O sinal de líquido é deformação que CONSERVA VOLUME.
>
> O que a largura ganha, a altura perde — que é o que uma gota faz sob pressão. **Escala
> uniforme lê como zoom; escala não uniforme lê como matéria.**

**Medido no botão, em pixels:**

|                       | largura    | altura    |
| --------------------- | ---------- | --------- |
| repouso               | 164,00     | 54,00     |
| **esmagado**          | **170,59** | **49,90** |
| **o mínimo na volta** | **162,70** | —         |

⭐ **A gota ultrapassa o repouso em 1,30px NO SENTIDO CONTRÁRIO antes de assentar** — ela fica
mais estreita e mais alta do que era, e só então volta. É o que separa uma gota de um botão.

⛔ **E a escala uniforme do toque teve de SAIR.** Ela e o esmagamento faziam o mesmo trabalho e
se cancelavam no eixo X: `0,97 × 1,045 = 1,0137`, e a peça ganhava **2px onde devia ganhar
7,4**. **O esmagamento é o toque** — não precisa de um segundo encolhimento por cima.

**E o líquido tem três molas, não uma:**

| mola          | duração · quique | o que ela move                                   |
| ------------- | ---------------- | ------------------------------------------------ |
| **esmagar**   | 0,14 · 0         | a compressão, na descida — imediata              |
| **derramar**  | 0,46 · **0,55**  | a volta, e é o quique dela que faz a gota tremer |
| **suspender** | 0,62 · 0,40      | o rótulo, que **resiste** à deformação           |

⚠ **O quique do derramar é maior que o do toque de propósito:** a viagem é de 6,6px na largura,
e a 0,55 ela ultrapassa 1,4px — acima do limiar. Com o quique do toque (0,35) daria 0,45px, e a
gota voltaria por decreto.

⭐ **E o rótulo tem mola própria e mais lenta**, aplicando a deformação INVERSA: dentro de um
fluido, o que está suspenso não acompanha a parede do copo. É o atraso que faz a matéria parecer
ter viscosidade.

---

## 6 · O CUSTO, medido durante o gesto

`tmp/custo-gesto.mjs` — e ele existe porque o `npm run screen` mede a tela **parada**.

|                     | fps médio | p95    |
| ------------------- | --------- | ------ |
| parado (base)       | 41,8      | 33,4ms |
| **durante o gesto** | **41,0**  | 33,4ms |

⚠ **O número absoluto não vale nada** — navegador sem tela tem teto próprio. **O que vale é a
diferença: 0,8 fps.** O gesto é praticamente de graça, e a razão é que ele só toca `transform`,
`opacity` e `filter`, que o compositor resolve sozinho.

---

## 7 · ⛔ O QUE ESTE ARQUIVO NÃO É

- **não é plano** — nada aqui foi levado ao jogo; tudo vive no clone `tmp/barra.html`;
- **não fecha o gesto** — ele ainda não foi aprovado, e a escolha é dele;
- **não substitui a folha do projeto** — quando o gesto for escolhido, a mola vira token e o
  squircle vira peça com guarda, e aí sim isto vira convenção.
