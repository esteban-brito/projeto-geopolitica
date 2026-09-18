# Créditos das imagens

## `phone.webp` — o telefone da mesa

Imagem gerada por IA (ChatGPT/DALL-E, OpenAI) a pedido do responsável do projeto em 15/09/2026,
a partir do prompt escrito pelo Claude: telefone de teclas vermelho ao estilo Western Electric
2500, visto de cima, teclas e cartão em branco, sem sombra no chão. Tratamento (`tmp/assar-fone.mjs`):
alfa normalizado, corte pela caixa da tinta, redução para 720×639, luz da sala (exposição 0,95;
1 → 0,88 de cima para baixo). Sem licença de terceiros.

## `folder-open.webp` e `folder-closed.webp` — a pasta de despacho

Imagens geradas por IA a pedido do responsável do projeto: pasta de despacho presidencial em
couro verde-garrafa, vista de cima, cantoneiras de latão e costura no perímetro — uma aberta e
vazia, outra fechada com o brasão. A referência foi uma foto de pasta presidencial real e o
brasão oficial, enviados por ele. **Ele mesmo removeu o fundo** (Adobe Firefly) e entregou as
duas em PNG com alfa. Sem licença de terceiros.

⛔ **E o recorte por luminância foi trocado pelo dele, medido:** o meu (`tmp/assar-pasta.mjs`,
enchente a partir da beira) deixava **9 a 14 colunas de alfa parcial** na beira da abertura, com
luminância 197 contra 26 do couro — a folha creme da borda tem 210–219 e caía no limiar de 215
da enchente, então ela era comida. O dele tem **1 a 2 colunas** e nenhuma sobra clara na base.
Tratamento que ficou (`tmp/limpar-beira.mjs`): corte pela caixa do alfa, descontaminação da
franja branca do estúdio e nenhuma redução — os dois arquivos saem na largura nativa da tinta,
**2196×1588** e **1434×1991**, em WebP de qualidade 0,90.

⛔ **E a redução para 1600 e 1000 saiu porque embaçava, medido.** A pasta na mão pede 2250px a
1920×1080 com dpr 2, e o arquivo de 1600 entregava 1,41× de ampliação. Na tela, no couro da
lombada: **41,1 de energia de gradiente contra 51,6** do nativo, 25,4% a mais. A qualidade parou
em 0,90 porque 0,94 custa +20% de byte para menos de 0,8% de gradiente.

⛔ **E a descontaminação comia a peça pelo topo.** A regra andava para dentro enquanto o pixel
fosse claro (L > 70) e dessaturado, e o realce do couro é as duas coisas: 93 colunas de 1600
comidas até 7px na aberta, as piores na lombada, e até 26px na curvatura da quina da fechada. O
piso de claro virou por eixo — **70 nos lados, 160 no topo e no pé**. Com 160 nos lados a franja
cinza volta, em 1.295 das 1.386 linhas da fechada.

📐 **A razão da aberta não mudou:** 1,3817 contra 1,3805 da anterior, 0,09% — os números de vão,
moldura e `--rest` do CSS continuam valendo. **A fechada ficou 13% mais larga** (0,7213 contra
0,637 do meu recorte), e era isso que fazia a pasta ler pequena na mesa.

## `pen.webp` — a caneta

Imagem gerada por IA (ChatGPT) a pedido dele em 18/09/2026, com o prompt escrito pelo Claude:
caneta-tinteiro preta de resina com guarnição dourada, tampada, vista de cima, fundo transparente
(2172×724). Sem licença de terceiros. Cortada pela tinta (2023×201) e assada a 420px
(`tmp/assar-caneta.mjs`): 210px de layout na mesa, dpr 2. Nitidez raio 1 ganho 1,0, q 0,90.

## `brasao.webp` — o timbre dos papéis

O Brasão da República, a cores, no alto do parecer e do decreto — como nos ofícios reais da
Presidência que ele mandou em 18/09/2026. Imagem gerada por IA (ChatGPT) a pedido dele, com
fundo transparente (1254×1254); as Armas Nacionais são símbolo oficial (Lei 5.700/1971), sem
licença de terceiros. Cortado pela tinta e assado a 192px (`tmp/assar-brasao.mjs`): 65px de
layout na folha de 720, 42px na tela a dpr 1 e 125 a dpr 3. Nitidez raio 1 ganho 0,8, q 0,92.

## `envelope.webp` e `envelope-urgent.webp` — a carta na mesa

Imagens geradas por IA (ChatGPT) a pedido do responsável do projeto, com o prompt escrito pelo
Gemini: envelope C6 fechado, vista de cima, lacre de cera, sem sombra de chão — a sombra é do CSS,
na luz da sala. Uma em papel creme e outra em papel rubro, que é a carta que vence. Ele entregou as
duas em PNG. Sem licença de terceiros.

📐 **A escolha do creme foi por número:** o papel dele mede rgb(227, 220, 208) — 85% de luz, a mesma
da folha do decreto e da beira de papel da pasta. O rubro põe uma segunda massa vermelha ao lado do
telefone e o lacre some no papel, porque os dois estão na mesma matiz. Ele ficou como a carta que
vence, que é justamente onde a cor tem de gritar.

📐 **Largura de 356px, e o número é de tela:** o envelope mede 178 CSS px em qualquer janela, então
o arquivo é o de dpr 2, assado numa reamostragem só a partir da origem limpa de 1297px
(`tmp/assar-envelopes-tela.mjs`), com máscara de nitidez de raio 1 e ganho 1,4, qualidade 0,90.
Ele disse "embaçado" com o arquivo de 720px, e o número deu razão: Sobel dentro do envelope na mesa
**32,2 → 35,4 a dpr 1 e 22,8 → 29,6 a dpr 2**. A origem não era o problema — a fibra do papel some
em qualquer arquivo a 178px; o que volta é a aresta. Tratamento antes disso: a mesma receita da
pasta (`tmp/limpar-beira.mjs`), corte pela caixa do alfa. O halo esfarrapado do creme estava fora
da caixa e saiu no corte — sobraram 62 pixels sujos, e o rubro já veio limpo. **A caixa tem a razão
da foto**, 1,529: forçar o C6 de 1,42 esticaria o papel 7,5% na altura.

## `jacaranda.webp` — o tampo

Foto enviada pelo responsável do projeto.
