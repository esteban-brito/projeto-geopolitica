# Ciclo 6 — a sala de guerra · ✔ FEITO em 15/08/2026

> Escrito em 15/08/2026 a partir de um **dossiê externo do Gemini** ("Operação Sala
> de Guerra: SaaS ➔ Grand Strategy") e da minha análise dele contra o código.
>
> Dois dossiês externos, e o segundo — **"Reforma Ministérios"** — é o melhor dos
> quatro que o projeto já recebeu: ele descreve a tela **atual**, e não uma captura
> velha. Ele produziu o achado mais importante desta sessão.
>
> As duas perguntas abertas foram **delegadas a mim, respondidas e executadas**.

## A tese do dossiê

_"A estética respira Painel de Vendas. Jogos de simulação densa funcionam porque a
interface tem materialidade e peso histórico. O jogador não está clicando numa
`<div>`; ele está carimbando um decreto."_

**A tese está certa e já foi aceita** — foi ela que produziu o ciclo 5 (papel,
serifa, carimbo, bordô, sinete, hemiciclo). O que este documento faz é separar, no
dossiê novo, o que já existe do que falta.

## O que o dossiê erra de fato — e é o mesmo padrão das três auditorias anteriores

**Elas leem bem a IMAGEM e inferem mal o MECANISMO.** Verificado contra o código:

| o dossiê diz                             | o código diz                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| _"a UI atual é plana (flat)"_            | **9 declarações de `backdrop-filter`**, vidro em três níveis, especular a 24° do campo, substrato de aurora                    |
| _"adicione texturas granulares (noise)"_ | **`feTurbulence` já está em `40-shell.css`** desde a quinta sessão                                                             |
| _"usa Sans-Serif para tudo"_             | **8 consumidores de `--font-record`** — nome de norma, de pessoa, do presidente, assunto de carta, assinatura                  |
| _"botões precisam de hover que afunde"_  | **4 `:active`** já existem, e a prosa diz por quê: afundar é `:active`, não `:hover` — passar o mouse não é apertar            |
| _"verde neon"_                           | `--brand` é `#e8a33d`, âmbar. O verde é semântico (alta/leal). **Terceira vez que isso é dito e terceira vez que está errado** |

Boa parte do dossiê descreve o Planalto **antes do ciclo 5** e pede o que foi feito
no dia anterior.

## O que se recusa, e por quê

- **Google Fonts** (`Playfair Display`, `Courier Prime`). Viola zero-build e
  zero-dependência de runtime, que é decisão fechada: uma requisição que pode falhar
  e um bloco de texto invisível enquanto ela não chega. **Serifa já existe**, por
  pilha de sistema;
- **O `:root` inteiro proposto.** Substituiria o sistema de tokens, que tem guarda
  executável e prosa por trás de cada valor — e `--bg-desk: #15181a` **apagaria a
  aurora**. O Pilar 3 dele destruiria o Pilar 3 dele;
- **`transition: all 0.1s`.** Há guarda de movimento e escala de duração declarada;
  `all` é exatamente o que um sistema de movimento existe para proibir;
- **O selo tracejado no lugar do sinete.** ⚠ **Este é o mais grave.** O anel do
  sinete **é o alcance da pessoa** — quanto da bancada ela arrasta. Trocá-lo por uma
  borda `dashed` decorativa **apagaria informação de motor para pôr enfeite no
  lugar**, que é o inverso exato do que este projeto faz;
- **Hachura de "zona de perigo" na barra de rejeição.** "Ruim" numa pesquisa não é
  perigo — é uma fatia legítima de opinião. Hachurar editorializa o dado.

## O que é genuinamente bom, e novo

1. **A bandeja escavada** (`box-shadow: inset` profundo na Caixa de Entrada). A
   melhor ideia do dossiê: transforma o inbox de "cartão com lista" em **lugar onde
   papel cai**;
2. **A carta flutuando na bandeja** (sombra projetada). Papel + sombra = objeto
   solto, e não `<div>`;
3. **Serifa nos títulos de tela.** Aqui ele tem razão e eu não tinha feito:
   "Gabinete" e "Congresso & Leis" usam `--font-display` (sans). São **nomes de
   instituição** — pela minha própria regra do ciclo 5, deveriam ser registro;
4. **Réguas no medidor do cofre.** Marcações verticais fazem a barra ler como
   instrumento em vez de barra de download;
5. **Monoespaçada para carimbo.** O selo de rito (EMENDA, LEI ORDINÁRIA) em máquina
   de escrever é tematicamente forte. É a **terceira família**, e exige justificativa
   — que existe: as duas atuais dizem _registro_ e _medição_; a terceira diria
   **máquina do Estado**.

## ⚠ O que o dossiê não vê, e é maior que tudo isso

> **A bandeja só significa alguma coisa se as coisas se acumularem nela.**

Hoje a Caixa de Entrada mostra **só as cartas do último mês** — as anteriores somem
sozinhas. Uma bandeja com uma carta não é uma bandeja; é um cartão com sombra.

E o ciclo 4 já desenhou o que falta:

> _"A carta tem prazo, e é isso que a torna mecânica. Um inbox onde tudo espera para
> sempre é uma lista de tarefas. Um inbox onde **o líder do Centrão espera dois meses
> pela resposta e depois retira o apoio** é o cargo."_

**A materialidade que o dossiê pede depende de uma mecânica que não existe.** Fazer a
bandeja antes do acúmulo é construir a moldura do quadro errado — o mesmo raciocínio
que fez as cartas virem antes de recalibrar a tramitação.

## O plano proposto

| #   | o quê                                                                                                                                      | custo   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| 1   | **A carta acumula e tem prazo** — `state.mail`, schema 15. Ela fica até ser respondida ou vencer, e **vencida resolve contra você**        | médio   |
| 2   | **A bandeja e o papel solto** — inset na caixa, sombra na carta, e a tarja lateral pela **urgência do prazo** (motor atrás, não decoração) | pequeno |
| 3   | **Serifa nos títulos de tela** + **mono nos carimbos**                                                                                     | pequeno |
| 4   | **Réguas no cofre**                                                                                                                        | mínimo  |
| 5   | **O tom do latão** — decisão do responsável; medir contraste antes                                                                         | mínimo  |

**A ordem final está na decisão A**, abaixo: o barato e independente primeiro, o
prazo depois, e a tarja de gravidade só quando ela tiver motor atrás.

## As duas decisões — delegadas a mim em 15/08/2026, e respondidas

### A. A ordem: o barato e independente PRIMEIRO, e o prazo depois

Eu vinha defendendo o contrário — a mecânica antes da forma —, e mudei de ideia por
uma razão que só apareceu quando fui escrever: **três auditorias externas seguidas
avaliaram uma tela desatualizada.** É o custo recorrente mais caro deste projeto em
revisão externa, e ele se paga sozinho quando a tela em disco está à frente do último
print que alguém tirou.

E o item 2 **se divide**, o que desfaz o impasse:

| pedaço                             | depende do prazo?                                 |
| ---------------------------------- | ------------------------------------------------- |
| bandeja escavada · sombra do papel | **não**                                           |
| tarja lateral por urgência         | **sim** — sem prazo ela seria decoração sem motor |

Então a ordem fica:

1. **3 + 4 + a metade independente do 2** — serifa nos títulos, mono no carimbo,
   réguas no cofre, bandeja e papel solto. Tudo CSS, tudo autônomo;
2. **1 — a carta acumula e tem prazo** (`state.mail`, schema 15);
3. **a tarja lateral por urgência**, que só então tem motor atrás.

⚠ **E a doutrina não foi abandonada, foi aplicada com precisão:** o que vai primeiro
é exatamente o que **não** finge mecânica. A tarja de gravidade continua esperando o
prazo, porque uma tarja que não mede nada é o enfeite que este projeto recusa.

### B. O tom: vai para o ouro velho

**`--brand: #e8a33d` → `#c2a675`.** O critério dado foi "o que tiver mais cara de
jogo da Paradox", e a resposta é direta: o ouro da Paradox é **dessaturado e
envelhecido** — latão sob verniz, não âmbar sob luz. `#e8a33d` tem a saturação de uma
cor de marca moderna; `#c2a675` tem a de um objeto que existe há tempo.

⚠ **Três coisas que a implementação tem de respeitar, e a terceira é a que pode
derrubar a decisão:**

1. **o âmbar é a cor do que se PRESSIONA** — uma cor, um lugar. Ele veste o botão de
   avançar, o selo de emenda, o anel do presidente da Câmara e a ação da carta.
   Trocar o token troca os quatro de uma vez, e é isso que se quer;
2. **`--brand-rgb` anda junto** (`194, 166, 117`), senão as translucidezes ficam com
   a cor velha e a paleta racha ao meio;
3. ⚠ **o contraste é medido ANTES de fechar.** Ouro mais apagado significa menos
   contraste no único ponto onde a cor precisa funcionar sem concorrência. **Se a
   medição reprovar, o conserto é clarear a TINTA sobre o ouro — não abandonar o
   tom.** Abandonar seria deixar a aritmética decidir a estética.

**Uma observação que o dossiê não faz e vale mais que o hex:** o que faz uma tela
parecer Paradox não é só o ouro — é o **fio metálico fino** separando regiões, e a
repetição dele. O projeto já tem o vocabulário (`box-shadow` de duas paradas, clara
em cima e escura embaixo, usado na faixa de índices). Levá-lo às fronteiras das
lâminas custa pouco e entrega mais "peso institucional" do que qualquer troca de
matiz. **Entra como item 6.**

## O que estava em curso quando isto foi escrito

A etapa que eu tinha recomendado antes do dossiê, e que segue de pé:

1. **um verbo para a tramitação — retirar de pauta.** O jogador lê a gaveta e não age
   sobre ela; é o menor passo que falta para a gaveta ser _"uma jogada do jogador"_;
2. **recalibrar a tramitação** — e só depois do verbo, porque **não se calibra uma
   mecânica que o jogador não consegue jogar**;
3. **Parte 2 do ciclo 4 (vinculação)** — o que trava o orçamento de verdade e
   conserta a calibragem fiscal (achados 1d e 2).

---

## ANEXO — o segundo dossiê: "a aba Saúde parece uma mesa de som"

**Este é o primeiro dossiê externo que descreve a tela ATUAL**, e não uma captura de
duas sessões atrás. Por isso ele acerta onde os outros erraram.

### ⚠ O achado: o controle não é um equalizador por estética

Ele diz que os sliders "tiram todo o peso do ato de governar" e que cortar verba de
hospital tem a mesma gestualidade de baixar o brilho da tela. **Está certo, e a causa
não é o componente.**

`area.mjs` escrevia, com prosa explicando:

> _"A MARCA DO PISO É POSIÇÃO NO PRÓPRIO CONTROLE, escrita em estilo inline porque
> ela é DADO — onde a lei para, naquele programa."_

E `grep --floor styles/` devolvia **nada**. **Canal de dado morto** — a família
inversa da folha órfã: dado sem consumidor, em vez de estilo sem seletor. O controle
mais importante do jogo não carregava a única informação que o distingue de um
controle de volume, e **uma auditoria externa leu a tela inteira como "mesa de som"
sem saber por quê**.

### A resposta: o trilho virou RÉGUA LEGAL

Melhor do que o "pino de latão" que o dossiê pede, porque entrega **informação** em
vez de textura. A faixa vigente divide o trilho em três zonas:

| trecho          | o que custa                                     |
| --------------- | ----------------------------------------------- |
| até o piso      | lei, ou emenda quando a guarda é constitucional |
| do piso ao teto | **caneta** — a lei já autorizou                 |
| acima do teto   | custa de novo                                   |

Com marcas de latão no piso e no teto. Até aqui a tela só dizia isso **depois**: a
linha se tingia quando o controle já tinha atravessado. **Informação que chega depois
da decisão não é informação — é recibo.**

⚠ **E a zona cara não é zona proibida.** Nada de hachura de perigo: a doutrina é
_"tudo tem preço, nada tem muro"_, e um trilho que parecesse bloqueado ensinaria que
a lei é um limite da **interface**.

⚠ **Um defeito que só a imagem pegou:** a primeira versão pintou as três zonas e o
trilho continuou liso, **sem erro em lugar nenhum**. Causa: `.dial__slider` tem
especificidade (0,1,0) e **perde** para `input[type="range"]` (0,1,1) — atributo mais
tipo. Uma classe não vence um seletor de atributo, e essa é a derrota que não aparece
em tipo, em guarda nem em prova.

### O que mais entrou

- **serifa no título de tela** — "Saúde", "Gabinete", "Congresso & Leis" são **nomes
  de instituição**, e saíram em sans por seis telas. Foi o furo da minha própria
  regra do ciclo 5;
- **a terceira família: mono no carimbo.** Serifa é o que se **assina**, sans é o que
  se **mede**, mono é o que a máquina do Estado **carimba**. Três é o teto — uma
  quarta não teria papel sobrando;
- **a bolsa subiu** para antes dos controles e virou **fita** com fio de latão. Posta
  embaixo, ela era a conclusão de uma decisão já tomada; **o cobertor curto precisa
  ser lido antes de se puxar a ponta dele**;
- **o papel clareou** (`#221d18` → `#2b241c`). A escolha original estava certa na
  intenção e errada na medida: diferia da lâmina quase só em **matiz**. O revisor leu
  o bloco de leis como "caixas de contorno fininho" — **substância que só o autor
  enxerga não é substância**;
- **o pino virou metal escovado retangular**, e deixou de ser âmbar: a marca é a cor
  do que se **pressiona**, e um pino que se **arrasta** não se pressiona. Gastá-la em
  38 controles por tela era a diluição que a regra existe para impedir;
- **a bandeja escavada**, **a carta com sombra projetada**, **as réguas no cofre** e
  **o fio metálico sob cada legenda de bloco** — e o que este último entrega não é a
  linha, é a **repetição** dela.

### O que se recusou do segundo dossiê

- **"A Constituição é um muro: tarja vermelha sólida."** O projeto já decidiu o
  contrário, com a razão escrita: _"constituição é a MARCA, e não o vermelho de
  crise — vermelho aqui ensinaria que o piso da saúde é um defeito."_ E já existe
  convenção no cofre: constituição = marca, lei ordinária = azul-aço;
- **mono no índice ("ATENDIMENTO 62").** Mono ficou reservada ao **carimbo**. `62` é
  uma **medição**, e vestir medição de carimbo inverte a regra recém-escrita.

### A medição do ouro velho

`#e8a33d` → `#c2a675`, e o contraste foi medido antes de fechar:

| par                                 | contraste       |
| ----------------------------------- | --------------- |
| ouro velho sobre lâmina             | **7,03:1** · AA |
| ouro velho sobre papel              | **6,56:1** · AA |
| **o botão de avançar, renderizado** | **5,55:1** · AA |

O botão usa tinta escura sobre ouro composto — o pareamento certo. Tinta **clara**
sobre ouro sólido reprovaria (1,98:1), e por isso ela não existe em lugar nenhum.

### O que fica para depois

**A carta acumular e ter prazo** (`state.mail`, schema 15) — o item 1 do plano
original, e o único que não é CSS. A bandeja agora existe; falta o que se acumula
dentro dela. E com o prazo vem a **tarja lateral de gravidade**, que hoje seria
decoração sem motor.
