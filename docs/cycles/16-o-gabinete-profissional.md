# Ciclo 16 — o Gabinete profissional

> **Escrito em 30/08/2026, a pedido dele**, com um print do Football Manager na mesa e a
> instrução de usá-lo como referência. As palavras são dele:
>
> > _"quero que você distribua melhor ainda as coisas dentro da tela, para sobrar menos
> > espaço. Tire esse título Gabinete. O texto caixa de entrada tem que se diferenciar da data
> > que fica logo abaixo dele. E você diminuiu o tamanho da página ao invés de só esticar ou
> > aumentar os elementos. Aumente o tamanho dos textos dentro dos blocos, de todos, mas só de
> > dentro dos blocos. Profissionalize tudo."_
>
> E a licença que ele deu junto, e que muda o cálculo inteiro:
>
> > _"Se ficar espaço dentro da caixa de entrada não importa, pq futuramente vai ter tanto
> > conteúdo dentro do jogo que mal vai sobrar espaço."_

---

## 🔢 O QUE FOI MEDIDO — 30/08/2026, mês 12, janela de 1920×980

| medição                              | resultado                                       |
| ------------------------------------ | ----------------------------------------------- |
| palco · janela                       | **1640×863** de 1920×980                        |
| colunas: índice · carta · leituras   | **208 · 727 · 623px**                           |
| corpo do texto **dentro dos blocos** | **10px**, os três níveis                        |
| corpo do texto **na carta**          | 15,2px · assunto 16,8px                         |
| linhas na coluna direita             | **20**, em 5 blocos                             |
| altura dos blocos                    | 125 · 200 · 125 · 197 · 125px                   |
| raio: palco · bandeja · bloco        | **24 · 16 · 3px**                               |
| `CAIXA DE ENTRADA` × `AGO · 2027`    | **idênticos** — Inter 10px 700 1,8px caixa alta |

⭐ **O ACHADO É UM SÓ, E ELE EXPLICA AS TRÊS QUEIXAS:** a tela tem **duas escalas de tipo que
não conversam**. A carta lê em 15,2px e a coluna que carrega vinte números lê em **10px** — o
menor degrau da escala, o mesmo tamanho do rótulo de um eixo de gráfico. O que ele chamou de
"falta de profissionalismo" é isso: **a metade da tela que mais se lê é a que está menor.**

⛔ **E EU ERREI A ALAVANCA NA SESSÃO PASSADA, com as palavras dele:** _"você diminuiu o tamanho
da página ao invés de só esticar ou aumentar os elementos"_. Para matar o vazio eu encolhi o
palco (`flex: 0 1 auto`) — 863px numa janela de 980. **A alavanca certa é a inversa:** o palco
ocupa a janela, e quem cresce é o conteúdo.

---

## 📐 O QUE O FOOTBALL MANAGER FAZ, e o que disso serve

| #   | o que ele faz                                                                                                       | vale aqui?                                           |
| --- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | **O título do painel é 2× o divisor.** "Messages" em ~26px na cor de marca; "Sat 3rd Jan" em ~13px numa faixa cinza | ⭐ é a queixa literal dele                           |
| 2   | **Todo card tem legenda própria**, ~15px em peso alto — nunca 10px                                                  | ⭐ sim                                               |
| 3   | **A linha da lista tem três níveis**: remetente pequeno e apagado, assunto grande e branco, hora à direita          | ⭐ já temos dois; falta o terceiro                   |
| 4   | **Ícone em toda linha** — escudo, avatar, glifo de assunto                                                          | ⭐ temos `sigilHtml` e ícone por ministério          |
| 5   | **Tabela com cabeçalho de coluna** (Pos · Team · Pld · Pts)                                                         | ⛔ tabela na caixa é reprovada por guarda            |
| 6   | **Raio de card ~8px**, borda sutil, fundo um degrau acima do fundo                                                  | ⚠ nosso bloco tem 3px — decisão dele                 |
| 7   | **Zebra e destaque da linha própria** (o Brighton em laranja na tabela)                                             | ⚠ temos `data-tone`; zebra não                       |
| 8   | **Densidade alta, mas nada abaixo de ~12px**                                                                        | ⭐ é o item 1 deste plano                            |
| 9   | **Acento de cor em título e link**, com parcimônia                                                                  | ⛔ latão é a cor do que se PRESSIONA (regra travada) |
| 10  | **Três colunas de larguras diferentes**, a do meio dominante                                                        | ✔ já é o nosso arranjo                               |

⚠ **E O QUE ELE FAZ QUE NÓS NÃO PODEMOS COPIAR:** o FM enche a tela porque tem vinte anos de
conteúdo. Copiar a densidade sem ter o conteúdo produz **caixa vazia com moldura**, que é pior
que espaço em branco. Por isso o item 8 é sobre TAMANHO, e não sobre quantidade.

---

## A REGRA — uma escala só, e ela vale dentro dos blocos

**Hoje há um degrau para tudo o que é dado: 10px.** O plano abre três, todos da escala que já
existe em `00-tokens.css` — nenhum número novo é digitado.

| peça                        | hoje | proposto                       | token          |
| --------------------------- | ---- | ------------------------------ | -------------- |
| legenda do bloco            | 10px | **12,5px** 700 caixa alta      | `--text-note`  |
| nome da linha               | 10px | **13,6px** 400                 | `--text-body`  |
| valor da linha              | 10px | **13,6px** 700                 | `--text-body`  |
| qualificador (nome e valor) | 10px | **12,5px** 400                 | `--text-note`  |
| legenda da bandeja          | 10px | **12,5px** 700 caixa alta      | `--text-note`  |
| divisor de mês              | 10px | **10px** 400, sem traqueamento | `--text-label` |

⭐ **É O ITEM 1 DO FM, E ELE RESOLVE A QUEIXA DA DATA DE UMA VEZ:** hoje a legenda da caixa e o
divisor de mês são a **mesma** combinação — 10px, 700, 1,8px de traqueamento, caixa alta. Depois
são duas: **12,5/700/caixa alta** contra **10/400/normal**. Diferença de tamanho, de peso e de
traqueamento ao mesmo tempo — três canais, e não um.

⛔ **A COR NÃO ENTRA NESSA CONTA.** O FM usa magenta no título do painel; aqui o latão é a cor
do que se **pressiona**, e gastá-la num rótulo a dilui. A hierarquia sai de tamanho e peso.

---

## 🧮 A CONTA DE ALTURA, e ela é o item que decide o ciclo

Subir a linha de 10 para 13,6px leva a altura da linha de **20px para ~26px**.

| item                  | hoje  | com o tipo novo | delta    |
| --------------------- | ----- | --------------- | -------- |
| 20 linhas             | 400px | 520px           | **+120** |
| 5 legendas            | 70px  | 90px            | **+20**  |
| recuos e vãos         | 335px | 335px           | 0        |
| **total da coluna**   | 805px | **945px**       | **+140** |
| **altura disponível** | 805px | ~880px¹         | +75      |
| **falta**             | —     | **~65px**       | ⛔       |

¹ com o palco voltando a ocupar a janela (o erro da sessão passada, revertido).

⭐ **FALTAM ~65px, E ELES SAEM DE QUATRO LINHAS QUE JÁ SÃO REDUNDANTES:**

| linha que sai                              | para onde vai a informação                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `Da receita de R$ 2,38 tri`                | volta a ser o qualificador do `95%` — é a base dele, não uma leitura                         |
| `Abandonam acima de 68`                    | vira o qualificador do nome nas quatro linhas do bloco, como o limiar do risco já é          |
| `Inativos e pensionistas` (3º gasto preso) | a porta `DINHEIRO DO MÊS ›` abre Finanças, que lista todos                                   |
| `Faltam 0`                                 | só imprime quando é maior que zero — zero é "a maioria está feita", e isso a barra já mostra |

⚠ **E A REGRA DE OURO CONTINUA:** se depois da poda ainda não couber, **corta-se conteúdo, não
se cresce a coluna.** A tela do Gabinete não rola — é a restrição mais dura do ciclo 15 e ela
não se reabre.

---

## A ORDEM, E O RISCO DE CADA PASSO

| passo | o quê                                                                      | risco                                   |
| ----- | -------------------------------------------------------------------------- | --------------------------------------- |
| **1** | o palco volta a ocupar a janela (desfaz `flex: 0 1 auto`)                  | zero — é reverter uma linha             |
| **2** | a poda das quatro linhas redundantes, com a conta acima                    | baixo — nenhuma some da vida do jogador |
| **3** | a escala nova dentro dos blocos, e a checagem de altura **antes** dela     | ⚠ é aqui que a coluna pode estourar     |
| **4** | a legenda da bandeja e o divisor de mês se separam em três canais          | baixo                                   |
| **5** | o terceiro nível da linha do índice — o prazo à direita, como a hora do FM | ⚠ só a carta com prazo tem              |
| **6** | ícone por bloco na coluna, do mesmo conjunto do rail                       | ⚠ pede desenho, não código              |

⚠ **O PASSO 3 NASCE COM CHECAGEM, e ela é a Restrição 2 do projeto:** o passeio ganha uma
medição de **altura da coluna contra a altura disponível** que reprova antes do conserto, em
duas janelas. Sem ela, um degrau de tipo a mais engole um bloco sem nada falhar — foi assim
que a coluna já engoliu um cartão inteiro em 24/08.

---

## AS DECISÕES QUE EU TOMO, e recomendo

1. ⭐ **A escala nova vale só DENTRO dos blocos**, como ele pediu. A carta, o índice e a barra
   de vitais não mudam — elas já leem em 13,6 e 15,2px;
2. ⭐ **O divisor de mês DESCE em vez de a legenda subir sozinha.** Diferenciar por um canal só
   deixa os dois no mesmo peso visual; mexendo nos dois, a distância dobra sem custar pixel;
3. ⭐ **O raio do bloco fica em 3px**, e não vai para os 8px do FM: 3px é o token do papel, e o
   bloco da coluna e o anexo da carta são a MESMA peça desde o ciclo 15. Mudar um muda os dois,
   e o anexo dentro do papel com 8px lê como cartão dentro de carta;
4. ⛔ **Nenhuma cor nova, e nenhuma cor de acento em rótulo** — o latão é do que se pressiona;
5. ⛔ **A tela continua sem decisão e sem rolagem**, por decisão dele e do ciclo 15.

---

## ⛔ O QUE ESTE CICLO RECUSA

| pedido                                           | por quê                                                                |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| **copiar a densidade do FM**                     | ele tem vinte anos de conteúdo; densidade sem conteúdo é moldura vazia |
| **tabela com cabeçalho de coluna**               | a guarda `annexes` reprova tabela nas duas telas                       |
| **encolher o palco para matar vazio**            | foi o erro da sessão passada, dito por ele com todas as letras         |
| **cor de marca em título de painel**             | latão é o que se pressiona; um rótulo latão dilui o botão              |
| **encher o branco da carta com bloco inventado** | _"não importa, futuramente vai ter tanto conteúdo"_ — ele mesmo        |

---

# 📁 O DOSSIÊ EXTERNO, DIVIDIDO — 30/08/2026

> Ele pediu um dossiê só do Gabinete e recebeu uma reforma do jogo inteiro. Aqui ele está
> partido em quatro, e **cada item tem veredito com o número que o sustenta**. O padrão dessas
> auditorias, medido em seis: elas leem bem a IMAGEM e erram o MECANISMO.

## ⭐ PARTE A — entra no ciclo 16, agora

| #      | item do dossiê                              | por que entra                                                                                                                                                                                                                                                               |
| ------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A1** | **estado de alerta por ministério no rail** | ⭐ **o achado do dossiê.** Medido: `railNavHtml` recebe só a tela e `CATALOG.areas` — `state.capacity.index` **nunca chega lá**. Os oito ministérios são desenhados idênticos enquanto o motor sabe o índice de cada um todo mês. É dado que já existe e não tem consumidor |
| **A2** | **a zona de perigo pintada na pista**       | a marca do limiar já está na régua desde ontem; pintar o trecho ALÉM dela não custa instrumento novo e responde "quanto falta" no olho, não na leitura                                                                                                                      |
| **A3** | tipo maior dentro dos blocos                | já era o item 1 deste ciclo, e o dossiê confirma pelo mesmo motivo                                                                                                                                                                                                          |

## ⚠ PARTE B — é do Gabinete, mas depois

| #      | item                                  | o que falta antes                                                                                                                                                                                                   |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **B1** | retrato do emissor em moldura oficial | pede desenho, não código. O avatar já existe (`sigilHtml`)                                                                                                                                                          |
| **B2** | ícone por bloco na coluna             | já é o passo 6 deste ciclo                                                                                                                                                                                          |
| **B3** | **glossário do termo**                | ⚠ ele tem razão na FALTA: "Obrigatória do ano" não é explicado em lugar nenhum. Mas a entrega **não** é hover — o C11 recusou esconder leitura atrás do mouse, e o ciclo 15 recusou de novo. A forma fica em aberto |
| **B4** | brilho no não lido                    | o ponto de não lido já existe; brilho é polimento                                                                                                                                                                   |

## ▶ PARTE C — é boa ideia, e NÃO é do Gabinete

| #      | item                          | tela certa, e por quê                                                                                                                                                                                                        |
| ------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C1** | ⭐ **hemiciclo parlamentar**  | **Congresso.** A ideia é forte e a doutrina já estava escrita: _"quem lista bancada por bancada, com nome e humor, é a tela do Congresso"_. No Gabinete ele seria o **segundo** instrumento no dia seguinte a unificar em um |
| **C2** | barra empilhada da receita    | **Finanças** — a única tela densa do projeto, e ela pode ser densa porque ninguém decide nada nela. No Gabinete é o `meter` que acabou de morrer                                                                             |
| **C3** | feedback preditivo (ghosting) | **áreas e Congresso** — o Gabinete não decide. E metade já existe: o trilho do orçamento e `outlook`                                                                                                                         |

## ⛔ PARTE D — recusado, e a razão é medida

| item                                                          | por que não                                                                                                                                                                                    |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **fonte monospace para números**                              | ⛔ regra escrita: _"uma medição de carimbo não é um carimbo"_. E o payload real dele — números que não dançam — **já está entregue**: `font-variant-numeric: tabular-nums` em `10-base.css:49` |
| **`M ês`, `O brigatória` (kerning)**                          | ⛔ **medido e falso.** `::first-letter` só aplica caixa alta; a largura do texto com e sem a pseudo é **100,98 × 100,98px** e **88,16 × 88,14px**. Artefato da imagem que ele leu              |
| **dourado em bordas e títulos**                               | ⛔ o latão é a cor do que se **pressiona** — uma cor, um lugar. Gastá-la num rótulo dilui o botão de avançar                                                                                   |
| **âmbar como quarta cor de estado**                           | ⛔ o ciclo 15 recusou cor nova para significar estado. O limiar já tem a marca de latão na pista                                                                                               |
| **textura de papel no documento**                             | ⛔ decidido duas vezes: _"o pergaminho morreu; uma substância só"_                                                                                                                             |
| **número de protocolo gerado ao acaso**                       | ⛔ viola a regra mais dura do projeto: nada de número inventado                                                                                                                                |
| **carimbo de URGENTE**                                        | ✔ **já existe** — tarja de gravidade e prazo, desde o ciclo 9                                                                                                                                  |
| **setas de tendência no topo**                                | ✔ **já existe**, e o achado 56 desta sessão consertou as da coluna                                                                                                                             |
| **padronizar paddings (Fase 1)**                              | ✔ **feito em 30/08**, com censo de estilo: zero divergências                                                                                                                                   |
| **apagar as listas da direita e trocar por dataviz (Fase 3)** | ⛔ é o inverso do ciclo 15, aprovado por ele no mesmo dia: _"blocos dentro de blocos, tudo idêntico"_                                                                                          |

---

## ✔ PASSOS 1 A 4 ENTRARAM — 30/08/2026

| medição, 1920×980, mês 12      | antes     | depois        |
| ------------------------------ | --------- | ------------- |
| nome e valor dentro dos blocos | 10px      | **13,6px**    |
| legenda do bloco e da bandeja  | 10px      | **12,5px**    |
| qualificador                   | 10px      | **12,5px**    |
| linhas na coluna               | 20        | **17**        |
| altura da coluna · disponível  | 805 · 805 | **805 · 805** |

⭐ **`CAIXA DE ENTRADA` × `ago · 2027` ESTAVAM IDÊNTICOS e agora distam QUATRO canais:**
12,5px/700/2,2px/caixa alta contra 10px/400/normal/caixa baixa.

⚠ **E O PASSEIO COBROU DUAS VEZES o que o olho não veria:** com o tipo maior, a coluna a
1440px **cortava** o nome de sete linhas (177px pedidos contra 121 disponíveis) e o bloco do
dinheiro **estourava a própria largura** (547 contra 492). Os consertos foram de largura, e
medidos: as colunas passaram de `3fr 2fr` para `5fr 4fr`, a pista ganhou teto de 96px e a base
do percentual saiu da coluna do valor para o lado do nome.

⚠ **A PODA FOI DE TRÊS LINHAS, e não de quatro:** `Da receita de` virou qualificador do nome
em vez de sumir, o terceiro gasto preso saiu (a porta abre Finanças) e `Faltam 0` só imprime
quando falta.

---

## ✔ O CICLO FECHOU — 30/08/2026

| item        | estado                                                                   |
| ----------- | ------------------------------------------------------------------------ |
| **A1**      | ✔ o índice de capacidade chega ao rail, com dois graus                   |
| **A2**      | ✔ a zona de perigo pintada, e o LADO é declarado pelo chamador           |
| **passo 5** | ⛔ **medido e recusado** — a coluna não tem largura                      |
| **passo 6** | ✔ glifo em cada um dos cinco blocos, do conjunto do rail                 |
| extra       | ✔ a moldura do palco saiu, por ordem dele, e as bordas caíram de 44 a 16 |

### ⭐ A1 — o dado que existia e não tinha consumidor

`railNavHtml` recebia só a tela e `CATALOG.areas`. Agora recebe `alertsOf(areas, index)`, que
mora na MALHA e passa pela fachada — a mesma forma de `pollFrom`, e pelo mesmo motivo: a escala
é regra do motor, e a faixa de áreas do passo 2 vai lê-la também.

⚠ **A REGRA É A DISTÂNCIA DE `initial`, E NÃO O NÍVEL** — é a doutrina que o B1 já tinha
escrito. Um limiar absoluto acusaria o jogador de uma Segurança 38 que ele **herdou**.

**Os dois limiares saíram de 72 células medidas** — nove políticas-sonda a 48 meses, oito áreas
cada. A distribuição tem um **vão real entre −9 e −12**, e o agrupamento denso do colapso começa
em **−20**: 49 células acima de −10, 9 na faixa do meio, 14 além de −20. Duas provas nasceram
com ele, e as duas foram verificadas mordendo.

### ⭐ A2 — e o dossiê estava pela metade

Ele pedia "pintar o trecho ALÉM da marca". **Medido: as duas réguas com marca apontam para
lados OPOSTOS** — no cerco, passar de `boil` é perder o grupo; na Câmara, passar da maioria é
poder aprovar. Pintar "além" como perigo nas duas **pintaria de vermelho a zona em que o jogador
ganhou**. O lado passou a ser declarado pelo chamador (`danger: "above" | "below"`).

### ⛔ PASSO 5 — o prazo à direita não cabe, e a medição é a mesma de antes

Entrou, foi visto na captura e **saiu no mesmo dia**. A coluna do índice tem **179px de linha**;
`vence neste mês` pede ~103. Na linha do assunto ele espremeu o texto a quatro fileiras cortadas
— pior que o defeito que ele vinha corrigir. **A folha já carregava essa aritmética**, escrita
quando o prazo desceu para a linha própria; o passo 5 do plano assumiu a largura do Football
Manager, que tem o índice três vezes mais largo.

⚠ **E ELE ACHOU UMA COLISÃO DE NOME DE GRAÇA:** `.tray__head` já era a legenda `CAIXA DE
ENTRADA`, e a peça nova reusou a classe — a mesma família da sessão 21.

### ⭐ PASSO 6 — e o conjunto de glifos virou peça

Os ícones moravam em `rail.mjs`. Saíram para `src/ui/shared/icons.mjs`, porque **dois arquivos
com o mesmo desenho é como uma paleta começa a divergir**. Três dos cinco blocos já tinham
glifo no conjunto (`congress`, `finance`, `opinion`); **dois nasceram aqui** — `risk`, o
triângulo de aviso, e `pressure`, três silhuetas, porque quem derruba um governo é gente e não
um indicador.

### ✔ E AS BORDAS CAÍRAM DE 44px PARA 16px

Queixa dele, olhando o print: _"muitos espaços em branco sem nada… espaços nas bordas"_.
**Medido a 1920×980: `#main` dava 16px e `.cabinet` mais 28.** O recuo do palco existia para
manter o conteúdo longe da **aresta do vidro** — e o vidro saiu na mesma sessão. Sem lâmina não
há aresta, e os 28px eram margem morta. Zerado, as três colunas ganharam **56px de largura e
56px de altura**, e a coluna direita passou de 776/807 para **831/863**.
