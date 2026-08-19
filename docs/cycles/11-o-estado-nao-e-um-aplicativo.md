# Ciclo 11 — o Estado não é um aplicativo · ✔ **INTEIRO** em 16/08/2026 (A–F)

> Pedido do responsável em 16/08/2026, com as palavras dele: _"quero que a UI do jogo
> seja transformada — tirar essa cara de site de investimentos"_.
>
> É a **quinta vez** que esta queixa chega, e as quatro anteriores vieram de fora: a
> auditoria da oitava sessão (_"assumiu a estética de um SaaS corporativo... faz você se
> sentir um contador analisando planilhas"_), o segundo dossiê (_"a aba Saúde parece uma
> mesa de som"_), o oitavo e o décimo. **Quatro fontes independentes descrevendo a mesma
> coisa é diagnóstico, e não gosto.**
>
> ⚠ **E as respostas anteriores trataram o SINTOMA.** O ciclo 5 deu tipografia, papel e
> sinete; o ciclo 6 deu a régua legal e o carimbo. As duas melhoraram o que a tela
> **diz** e não mexeram no que ela **é**.

## O diagnóstico, e ele tem duas metades

### 1. A FORMA — a pastilha é o dialeto de aplicativo, e ela não se paga

Medido em 16/08, folha por folha:

| folha                   | `border-radius` |
| ----------------------- | --------------- |
| `65-screen-finance.css` | **0**           |
| `45-screen-cabinet.css` | 9               |
| `30-components.css`     | 8               |
| `50-screen-mesa.css`    | 6               |
| as demais               | 7               |

> **A única tela sem um único raio é a única que não parece um painel de fintech.** E
> ela é justamente a que o projeto já chamou de outra coisa, em prosa, há duas sessões:
> _"por isso ela tem forma de razão contábil e não de pastilha — sem raio, sem hover, sem
> transição"_.

⚠ **A razão escrita para a diferença era DENSIDADE** — _"densidade é ruído onde há
decisão, e serviço onde não há"_ —, e ela continua certa. Mas ela nunca foi uma razão
para a **pastilha**: uma linha pode ser enxuta e não ser um cartão. O projeto inventou o
registro institucional para uma tela e deixou as outras dez no dialeto de aplicativo,
sem nunca ter decidido isso.

**O que a pastilha carrega, e cada item é um tell:**

- **raio + preenchimento** em cada linha — a unidade visual do dashboard é o cartão, e
  38 cartões numa tela de orçamento é uma mesa de som;
- **números que não se alinham** — cada linha termina onde o texto dela acabou. Num
  documento oficial os valores caem numa coluna, e é o alinhamento que faz uma tabela
  ler como peça e não como lista de widgets;
- **barra de progresso como leitura principal** — cinco `.meter` no sistema. Barra é
  como um aplicativo mostra proporção; um registro mostra o **número**, e usa o traço só
  para o olho achar a linha.

### 2. ⚠ O CONTEÚDO — e esta metade não se conserta com CSS

O jogo mostra ao presidente **os números que um analista observa**, e não os objetos que
um presidente manuseia. Em Finanças: PIB, inflação, juro básico, desemprego, hiato do
produto, dívida/PIB, prêmio de risco. **São variáveis de mercado**, com escadinha ao
lado. Um terminal de Bloomberg mostra exatamente isso.

Um presidente manuseia: **rubrica, dotação, ofício, medida provisória, nomeação, pauta,
bancada**. O projeto tem quase todos — e os desenha como indicadores.

> **A pergunta que separa as duas estéticas: o que está na tela é uma MEDIÇÃO ou é um
> DOCUMENTO?** Medição se lê num painel; documento se lê numa peça, com cabeça, corpo
> numerado, fio de separação e assinatura.

⚠ **E o projeto já decidiu isso, e aplicou em dois lugares só** — a lei e a carta. O
sistema de duas substâncias existe desde o ciclo 5 (_"vidro = a máquina do Estado, papel
= o texto de registro"_), e o orçamento — que é a peça mais manuseada do jogo — ficou de
fora.

## O que NÃO se faz, e as razões já estão escritas

- **não se abre uma quarta família tipográfica.** Três é o teto declarado, e uma quarta
  não teria papel sobrando;
- **não se veste medição de carimbo.** _"Uma medição de carimbo não é um carimbo"_ — o
  índice da área continua em sans, e a recusa é do ciclo 6;
- **não se pinta bancada nem quadrante.** A paleta é semântica, e cor de partido já foi
  recusada três vezes;
- **não se espalha o PAPEL até ele virar padrão.** A fronteira é a regra inteira, e o
  aviso está no `standards.md`: _"no dia em que o papel aparecer num cartão de resumo ou
  num botão, ele deixa de ser legenda"_. ⚠ **Cartão de resumo e botão continuam sendo
  vidro**; o que pode virar papel é texto que o presidente **escreve ou recebe**;
- **não se troca o hemiciclo por lista**, nem se remove o título das telas — as duas
  recusas são do anexo do ciclo 10.

## O plano

### ✔ Parte A — a linha de rubrica · **FEITA em 16/08/2026**

O controle de verba deixa de ser pastilha e vira **linha de peça orçamentária**. É a
peça de maior contato do jogo — 38 por tela de área, mais 6 em O Estado — e é a que duas
auditorias nomearam.

```
antes   ╭──────────────────────────────────────────────╮
        │ Atenção básica          [====|====]  62  R$ 0,3 bi  piso 59 │   ← pastilha
        ╰──────────────────────────────────────────────╯

agora   │ Atenção básica                        62    R$ 0,3 bi   piso 59
        │ equipes de saúde da família     [====|====]
        ─────────────────────────────────────────────────────────────────
```

- **some o raio e o preenchimento**; entra o **fio** de separação, que é o que o sistema
  já usa sob cada legenda de bloco;
- **o rito vira marca de borda**, e não banho de cor na linha inteira. Ele continua
  usando a cor que já usava — âmbar para lei, crise para emenda —, e passa a apontar em
  vez de tingir. É a mesma correção que o pino de metal recebeu no ciclo 6: cor de marca
  diluída em 38 linhas deixa de apontar;
- ⚠ **e os números caem em COLUNA.** É a metade que faz o efeito: nível, custo e rito
  alinhados à direita, na mesma régua, nas 38 linhas. Uma tabela em que os valores se
  alinham lê como peça; uma em que cada linha termina onde o texto acabou lê como lista
  de componentes.

### ✔ Parte B — a barra superior deixa de ser um ticker · **FEITA em 16/08/2026**

Quatro números com setinha lado a lado é a assinatura visual de um terminal de mercado.
⚠ **O conteúdo fica** — os quatro têm motor, e a lista só ficou honesta quando SONDA
nasceu. O que mudou é a forma:

```
antes    PIB            INFLAÇÃO       APROVAÇÃO      BASE          ← quatro fichas
         R$ 12,00 tri — 4,2% —         44% —          436 —            centradas

agora    PIB R$ 12,00 tri — │ INFLAÇÃO 4,2% — │ APROVAÇÃO 44% — │ BASE 436 —
```

- **rótulo e valor na mesma base**, e um **fio vertical** entre as leituras — é como um
  boletim oficial imprime indicador, e é a mesma peça de duas paradas das legendas de
  bloco. Agora são cinco telas com o mesmo fio;
- **o peso do valor caiu de 700 para 600**, e essa é a outra metade: quatro números
  disputando com a data em 800 não formam hierarquia, formam quatro manchetes. Numa
  barra de jogo de gestão quem manda é a **data**.

⚠ **E ela custou uma regressão minha, pega na captura do mesmo dia:** a forma de linha
gasta o dobro da largura por leitura, e num aparelho de 390px a faixa passou a **cortar
a BASE fora da tela**. A tira rola por dentro de propósito, então nada estourou e nada
ficou vermelho — o quarto sinal vital simplesmente deixava de existir para quem não
arrastasse. No celular ela volta a ser coluna, e a razão está escrita: _"cara de site de
investimentos" é sobre a tela larga_.

⚠ **A dívida/PIB como quinto vital fica para depois** — ela é o placar do achado 1d e é
o que o lobby do mercado lê, mas entrar agora é acrescentar largura à faixa no mesmo dia
em que ela acabou de perder o espaço no celular. Mede-se primeiro.

### ✔ Parte C — o Gabinete deixa de ser cartão · **FEITA em 16/08/2026**

⚠ **O Gabinete era a última tela no dialeto de cartão.** As outras quatro foram
padronizadas na nona sessão — _"uma lâmina com cabeça e blocos"_ —, e aqui sobraram
**cinco** retângulos com raio e preenchimento próprios.

**A exceção declarada continua valendo, e ela nunca foi sobre o cartão:** _"aqui os
quatro assuntos não têm relação entre si"_. Assuntos separados precisam de **separação**,
e não de caixa — e a tela de área prova isso há duas sessões, com oito blocos que ninguém
confunde entre si, separados por um fio. O dado fica inteiro, inclusive o `lockedBy` do
Cofre que o décimo dossiê queria remover.

⚠ **E a varredura achou uma folha morta no caminho:** havia **duas regras `.cards`**, e a
primeira — `repeat(2, minmax(0, 1fr))` — era sobrescrita inteira pela segunda, vinte
linhas abaixo. Não quebrava nada e não pintava nada; continuaria ali até alguém editar a
regra errada das duas. É o achado 5 outra vez, e a guarda `orphans` segue por escrever.

### ⚠ E A PARTE C QUEBROU O GABINETE ANTES DE CONSERTÁ-LO

O responsável olhou a tela e disse: _"o gabinete tá feio, despadronizado, assimétrico,
cara de feito por IA"_. **Estava, e a causa era esta parte.**

> **A caixa estava escondendo que cada bloco tinha uma grade interna própria.** Tirar o
> contêiner sem unificar o que havia dentro dele expõe todo desencontro que a moldura
> disfarçava — e "feito por IA" é o nome exato disso: cada peça localmente plausível,
> nenhum sistema global.

Medido, e eram três coisas somadas:

| o que estava errado                                                                 | o conserto                                                  |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `.street__row` era `7,5rem │ 1fr │ 3rem` e `.boiler__row` era `9rem │ 1fr │ 2,5rem` | viraram **uma peça só**, `.reading`, em `30-components.css` |
| as legendas alinhavam à esquerda e o **conteúdo centrava**                          | uma margem só — e nem o desenho centra                      |
| `.locked` era um fluxo que quebrava linha, com três valores em pontos imprevisíveis | virou lista, um valor por linha, na margem direita          |

⚠ **E a captura achou um bug de verdade no meio disso:** a Caixa de Entrada dizia
`grid-row: 1 / span 3`, escrito quando havia **três** resumos. O ciclo 10 acrescentou a
CALDEIRA e ninguém voltou lá — a coluna da esquerda passou a terminar uma linha antes da
direita. Nada falha: um `span` continua sendo um span válido.

⚠ **E `1 / -1` não conserta**, o que me custou uma tentativa: `-1` conta a última linha
da grade **explícita**, e aqui todas são implícitas. A bandeja voltou a ocupar uma linha
só. O conserto é estrutural — a coluna da direita virou **um elemento**, e a grade passou
a ter duas células. Não há contagem para manter em dia.

⚠ **Uma reversão registrada:** tirei o estiramento da bandeja para ela não deixar
setecentos pixels de vazio ao lado de uma coluna cheia. **Medido na tela, fica pior** —
uma bandeja curta com um vão embaixo lê como layout inacabado, e uma que acompanha a
coluna vizinha lê como o objeto que ela é. A razão antiga estava certa.

### ✔ Parte E — a moldura passou a ter UM número · **FEITA em 16/08/2026**

Pedido do responsável, olhando a tela: _"o bloco central inteiro de todos os painéis
parece assimétrico e descentralizado, e não tá na mesma altura do menu vertical
esquerdo"_. **Medido a 1440px, e ele estava certo nas duas:**

|                   | antes     | agora     |
| ----------------- | --------- | --------- |
| rail, topo        | y 106     | y 106     |
| lâmina, topo      | y **122** | y **106** |
| margem esquerda   | 16        | 16        |
| margem direita    | **21,6**  | **16**    |
| vão entre os dois | 38        | 32        |

A causa: **três números para a mesma moldura, escolhidos em dias diferentes e nunca
postos lado a lado.** O rail usa `--space-4` na margem; o tabuleiro usava `--space-8` no
topo e um `clamp(12px, 1.5vw, 24px)` nas laterais.

> ⚠ **E a assimetria não estava em nenhum dos três — estava na RELAÇÃO entre eles.**
> Por isso nenhuma revisão de folha isolada a pegaria: cada valor é defensável sozinho,
> e cada um tem prosa explicando por que ele é o que é. Só medindo a **geometria
> renderizada** dá para ver, que é o que a captura do passeio já faz com o resto.

Agora é um número só. O ritmo fica `16 │ rail │ 32 │ lâmina │ 16`, com o vão interno
valendo o dobro da margem externa. **E a regra dos 80% continua cumprida**, medida em
seis larguras: 80,6% a 1280px, 82,6% a 1440, 85,4% a 1920 e 89,1% a 2560.

### ⚠ O CONGRESSO FICOU, e a razão é mecânica e não descuido

Depois das partes A, B e C, o Congresso é **a única tela ainda no dialeto de pastilha** —
seis `border-radius` em `50-screen-mesa.css`, todos na caixa da bancada. A tentação é
aplicar a mesma linha de rubrica e fechar a conta.

**Não se aplica, e a razão está escrita no ciclo 5:**

> _"A gente mora DENTRO do bloco, e a aninhagem é a mecânica: você paga o bloco, o bloco
> é feito de gente, a gente entrega diferente."_

⚠ **A caixa da bancada não é decoração — é o que diz que aquelas quatro pessoas
pertencem àquele bloco.** Trocada por um fio, o Centrão e as quatro pessoas dele viram
cinco linhas irmãs, e a tela passa a afirmar que líder e bloco são a mesma natureza de
coisa — que é exatamente a recusa mais importante do ciclo 7.

**Onde há aninhamento, o contêiner é informação; onde há lista, ele é dashboard.** É a
distinção que faltava para a regra da pastilha ser aplicável sem virar estética.

⚠ **E o que a bancada de fato precisa já tem plano acordado**: é a Parte C do
[ciclo 7](07-o-congresso-tem-cara.md) — duas linhas, com o controle na largura do bloco
—, e ela não colide com nada daqui.

**O que sobra do Congresso para uma parte futura**, e é honesto listar: a faixa _"o que o
país entrega"_ são oito fichas com barra, e ela é lista e não aninhamento. Ela cai na
mesma regra da Parte A.

### ✔ Parte D — a régua e o medidor · **FEITA em 16/08/2026**

Cinco `.meter` no sistema, e a parte foi deixada por último com um aviso escrito: _"nem
toda barra aqui é decoração"_. **O aviso estava certo, e a medição mostrou que o achado
era outro.**

> **A fronteira entre as duas peças:** RÉGUA é um valor numa escala com um **limiar**;
> MEDIDOR é uma **composição** cujas partes somam o todo.

- **a CALDEIRA era régua disfarçada de medidor**, e é aqui que estava o defeito de
  informação: as quatro barras mostravam pressão de 0 a 100 e **não diziam onde é o
  ponto de fervura**. Um grupo em 55 e um em 20 liam como "duas barras curtas", quando o
  primeiro está a cinco pontos de abandonar o governo. Passaram a usar `.gauge`, com a
  marca em `boil` — e o limiar vem de `boilerOf`, porque a tela não pode ter o próprio;
- **a Rua e o Cofre continuam medidor**, e as razões escritas seguem valendo: a pesquisa
  é ótimo/regular/ruim somando cem, e o Cofre não diz "95%", diz o obrigatório
  **engolindo** o discricionário. Trocá-los por um número perderia a informação;
- **e as duas peças passaram a compartilhar a FORMA** — mesma altura, mesmo canto. A
  pastilha de 999px era o último resto do dialeto de aplicativo nesta camada.

⚠ **A régua virou componente no mesmo dia em que nasceu**, e isso é o teste da regra do
arquivo: ela nasceu na Trindade e ganhou o segundo consumidor horas depois. Duas réguas
para a mesma pergunta, uma delas sem a marca, era a divergência começando.

### ✔ Parte F — a altura e o vocabulário · **FEITA em 16/08/2026**

Dois pedidos do responsável, e os dois medidos com o corpo antes de com a régua.

**1. "Tenho que rolar muito a tela para ver o Gabinete inteiro."** Medido a 1440×900: a
página tinha **1495px numa janela de 900** — dois terços de tela de rolagem para a tela
cujo propósito é ser lida de relance.

| corte                                     | ganho |
| ----------------------------------------- | ----- |
| teto de altura no hemiciclo (268 → 170px) | −98   |
| respiro entre blocos e da Trindade        | −24   |
| as legendas de botão                      | −10   |
| a frase longa da Trindade                 | −10   |

**1495 → 1253px.** ⚠ E o hemiciclo só pôde encolher porque `xMinYMid` encosta o arco na
margem **esquerda**: a largura cheia existia para a coluna não ter duas referências, e
essa razão sobrevive sem os cem pixels.

⚠ **Uma tentativa foi revertida no mesmo minuto, e o registro é o valor dela.** Pôr as
placas e a rua lado a lado economizava mais 110px — mas a 1440 a coluna da direita tem
511px, cada metade fica com 240, e **o medidor sobra com 24 pixels**. Uma barra de 24px
não mostra proporção: vira um traço que muda de cor. A prosa que eu escrevi ao lado da
mudança já dizia isso, com o número certo, **antes** de eu medir. Ela funciona a partir
de ~1700px, e ganhar rolagem num monitor grande às custas de matar o medidor no tamanho
que o responsável usa é uma troca ruim.

**2. "Expressões que não dá pra entender nada, pura cara de IA."** Ele nomeou duas —
_"as placas tectônicas"_ e _"a rua"_ — e o defeito tem causa:

> **A metáfora estava fazendo o trabalho que o subtítulo já fazia.** Cada grupo diz o
> que quer, uma linha abaixo do nome. O rótulo poético só atrasava a leitura.

| era                                          | é                                                 |
| -------------------------------------------- | ------------------------------------------------- |
| As placas tectônicas                         | **Grupos de pressão**                             |
| A rua                                        | **Aprovação por renda**                           |
| o que segura o governo de pé                 | **Risco de queda**                                |
| a rua · o capital · quem sustenta            | **Opinião pública · Capital · Base no Congresso** |
| "resolve o turno e propaga os efeitos"       | —                                                 |
| "apaga o mandato e recomeça do primeiro mês" | —                                                 |

⚠ **E a regra que sai daqui vale para toda tela:** rótulo nomeia a **coisa**; a metáfora,
se ela se paga, mora na prosa do arquivo e não na interface. _"Quem sustenta"_ era o
fisiologismo por perífrase — o jogador tinha de deduzir de quem se falava.

E as legendas de botão passaram por um teste único: **ela só se paga quando diz algo que
o rótulo não diz.** "Avançar o mês" seguido de "resolve o turno e propaga os efeitos"
falha nos dois lados — repete o rótulo, em vocabulário de motor. A confirmação de apagar
o mandato fica, porque ela chega no momento em que a informação muda a decisão.

## Resumo de custo

| parte | o quê                            | toca em                              | custo |
| ----- | -------------------------------- | ------------------------------------ | ----- |
| **A** | ✔ a linha de rubrica             | `60-screen-area.css`, `area.mjs`     | baixo |
| **B** | ✔ a barra superior               | `40-shell.css`, `dashboard.mjs`      | médio |
| **C** | ✔ o Gabinete deixa de ser cartão | `45-screen-cabinet.css`              | médio |
| **D** | os medidores — **não começada**  | `30-components.css` + 3 consumidores | alto  |

⚠ **Nenhuma parte mexe em motor**, e é por isso que este ciclo pôde vir antes dos
achados 29 e 30. O bloco que espera o motor é outro — a Trindade, o clipping e a
chantagem —, e ele é a onda 2 do [ciclo 10](10-quem-derruba-um-presidente.md).
