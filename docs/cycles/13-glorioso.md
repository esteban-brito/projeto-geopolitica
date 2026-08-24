# Ciclo 13 — GLORIOSO · ⚠ PLANO, NÃO COMEÇADO

> Nomeado por ele em 24/08/2026, e o norte foi dito com estas palavras:
>
> > _"O que eu realmente quero no fim do dia é um jogo extremamente realista. Se na vida
> > real um presidente e seu governo pode fazer tal coisa, no meu jogo o jogador de alguma
> > forma também vai conseguir fazer. Liberdade, realismo, fidelidade. Brasil real."_
>
> **Este ciclo é a lista do que um presidente brasileiro faz e este jogo ainda não deixa
> fazer**, com a peça que falta para cada um. Ele nasceu de dois dossiês externos do Gemini
> lidos contra o código — mas **quatro dos dez itens não estão em nenhum dos dois**, e são os
> que mais mudam a fidelidade.

## ⚠ O NORTE DELE E A REGRA DE FUNDAÇÃO SÃO A MESMA COISA

_"Tudo tem preço, nada tem muro"_ não é preciosismo de desenho — **é a descrição do cargo**.
Um presidente pode mandar uma PEC para destruir o piso da saúde amanhã de manhã. Nada o
impede. O que o para é o **Congresso**, e não um botão cinza.

> **Sempre que a escolha for entre BLOQUEAR e COBRAR, cobrar é o mais fiel.** Um controle
> travado transfere para a interface um limite que na vida real é político — e com isso o jogo
> fica menos realista, não mais.

É por isso que a "parede constitucional com hachura" do dossiê é recusada: **não por doutrina,
por fidelidade**. A zona constitucional ganha COR própria e o ponteiro atravessa.

## ⚠ TRÊS CANAIS MORTOS, e eles são a prova de que metade disto já está construída

Achados verificando os dossiês contra o código em 24/08/2026. Nenhum falha, nenhum acusa, e
os três são a mesma família: **o motor sabe e nada consome**.

| canal         | quem escreve                            | quem lê           |
| ------------- | --------------------------------------- | ----------------- |
| `data-guard`  | `area.mjs` em toda linha de lei         | **ninguém**       |
| `taxDelta`    | `economy.mjs`, com `taxDrag: 0,35`      | **nunca dispara** |
| `desoneracao` | `programs.mjs`, classificada como gasto | **está errada**   |

- **`data-guard`** carrega `constitution`, `law` ou `none` em cada linha, e nenhuma folha
  pinta. O jogo **sabe** quais pisos são constitucionais e mostra todos com a mesma cor;
- **`taxDelta`** é `taxLoad − baseTaxLoad`, e `turn.mjs` passa **a mesma constante nas duas
  pontas**. O arrasto tributário — parâmetro calibrado, com fonte — **jamais roda**. A
  economia já sabe reagir a imposto; nada no jogo pode mexer em imposto;
- **a desoneração** consome discricionário como se fosse obra. Ela é **renúncia de receita**:
  ninguém gasta, a Fazenda deixa de arrecadar.

## A PARTE 0 — a fundação, e ela é pré-requisito e não item

⚠ **O [ciclo 12](12-o-jogo-olha-para-frente.md) NÃO COMPETE COM ESTE PLANO: ele é a lente
dele.** Fidelidade que o jogador não percebe não é fidelidade — e hoje toda leitura do jogo
tem horizonte de **um mês** enquanto toda decisão paga em **12 a 48**. Acrescentar dez poderes
novos a uma tela que não mostra consequência é somar profundidade invisível, que é o defeito
que o ciclo 5 nomeou.

| #   | o quê                                                                            | tamanho |
| --- | -------------------------------------------------------------------------------- | ------- |
| 0.1 | **a desoneração vira renúncia** — e a série fiscal é remedida no mesmo movimento | pequeno |
| 0.2 | **o piso constitucional ganha cor própria** — mata `data-guard`, sem travar nada | pequeno |
| 0.3 | **a projeção** — o ciclo 12 inteiro, com a suposição declarada                   | médio   |

---

# OS DEZ PODERES

## ONDA I — a obrigatória deixa de crescer sozinha

> Hoje `mandatoryGrowth: 2,16%` é **uma constante que ninguém escolheu** e que governa
> **R$ 2.157 bi**. O achado 32 já registrou o conserto certo: _"separar a obrigatória em
> parcelas com crescimentos próprios, e aí a folha volta a só subir quando o presidente
> decidir — **que é uma jogada, e não um parâmetro**."_

### 1 · O salário mínimo

**Na vida real:** uma decisão por ano, e a mais consequente do cargo. Ela indexa aposentadoria
urbana e rural, BPC, abono e seguro-desemprego — **R$ 1.325 bi, 61% de toda a obrigatória**.

**No jogo hoje:** não existe. Há uma entrada morta, `reajuste-do-salario-minimo`, no catálogo
aposentado de `bills.mjs` — o achado 8, _"catálogo morto que ainda respira"_.

**A peça:** uma alavanca anual. O reajuste real escolhido escala o custo dos cinco programas
indexados, e `mandatoryGrowth` deixa de ser constante e passa a ser **derivado**.

⚠ **O QUE FAZ A DECISÃO DOER É A PERMANÊNCIA, e ela já tem precedente no código**: subir 6%
real neste ano sobe a base **para sempre**, exatamente como furar um piso já é permanente nos
dois sentidos. É o trade-off mais brasileiro que existe — popular, chega em quem mais precisa,
e a conta fica.

⚠ **RISCO:** ela pode virar a alavanca dominante — subir, colher aprovação, morrer no ano 3.
**Isso é o dilema real e não um defeito**, mas precisa ser medido antes de fechar.

### 2 · O reajuste da folha

**Na vida real:** R$ 398 bi de pessoal e inativos, e cada categoria negocia. Um presidente
concede, parcela ou segura — e greve de servidor é a resposta.

**No jogo hoje:** cresce ~0% real dentro da média ponderada, sem ninguém decidir.

**A peça:** a segunda parcela da decomposição do item 1. Conceder compra paz e engorda a
obrigatória para sempre; segurar economiza e cobra em serviço entregue — que a MALHA já sabe
ler.

### 3 · O contingenciamento escolhido

**Na vida real:** decreto de contingenciamento, rubrica a rubrica, e ele é como um governo
brasileiro atravessa o ano.

**No jogo hoje:** existe só **automático**, quando a obrigatória fura o teto.

⚠ **E O ACHADO 36 PRECISA CAIR JUNTO:** hoje o rateio grava o corte no estado e **nada nunca o
devolve** — um mês de aperto encolhe o orçamento para sempre, e a permanência não está escrita
em lugar nenhum. No mundo o contingenciamento é anual e se libera.

---

## ONDA II — os instrumentos do Executivo

### 4 · Medida Provisória, com caducidade

**Na vida real:** força de lei **na hora**, e caduca se o Congresso não converter. É o
instrumento que define o Executivo brasileiro desde 88.

**No jogo hoje:** não existe. Todo texto espera três meses.

⚠ **A MÁQUINA JÁ ESTÁ PRONTA, e é o achado mais barato deste ciclo.** `ESTRATO` tem
**vigência** (`months`) e tem prova de que **revogar a nova faz a velha voltar**. Uma MP é uma
norma com `months: 4`: ela vale já, e se ninguém converter ela expira e a lei anterior
ressurge sozinha. Nada precisa ser inventado.

⚠ **E ISSO NÃO INVERTE O RITO DERIVADO** — eu recusei a proposta do dossiê por esta razão e
**estava errado**. O rito do conteúdo define o **mínimo exigido**; MP e PL são dois caminhos
para o mesmo mínimo, com preços diferentes: **velocidade contra segurança**. As duas regras
convivem.

### 5 · O decreto tributário

**Na vida real:** IOF, IPI, imposto de importação e de exportação mudam **por decreto** — são
a exceção constitucional à legalidade tributária. O resto vai por lei.

**No jogo hoje:** `taxLoad` é constante, e o canal morto do `taxDelta` prova que a economia
já está construída para responder.

**A peça:** a carga vira alavanca, e o rito sai da natureza do tributo — os quatro de decreto
são caneta, o resto é lei. **A regra do ciclo 2 se aplica sem uma linha nova.**

⚠ **E ISSO RESSUSCITA A PARTE 3 DO CICLO 3**, suspensa desde 14/08/2026 porque a cláusula de
tributo do ciclo 4 a absorveria. Ela nunca chegou.

### 6 · Nomear e demitir — e é a segunda moeda

**Na vida real:** **~22 mil cargos de livre nomeação.** Ministério, presidência de estatal,
diretoria de agência, banco público. É a moeda real da política brasileira: não se compra
deputado só com emenda, compra-se com **cargo**.

**No jogo hoje:** existem cinco pessoas com cargo — presidente da Câmara, do Senado, relator,
líderes e Casa Civil — e **nenhum ministro**. Só há uma moeda: emenda, em dinheiro.

**A peça:** um posto por pasta e por estatal, com um ocupante que é **técnico** ou **indicado
por bancada**. Técnico levanta a eficiência da máquina; indicado levanta a lealdade daquela
bancada e derruba a eficiência.

⚠ **E A FORMA TEMPORAL É O QUE A TORNA INTERESSANTE: cargo é ESTOQUE, emenda é FLUXO.** A
emenda se paga todo mês e o calote é imediato; o cargo se entrega **uma vez** e segue comprando
lealdade até você tomá-lo de volta — e tomar de volta é uma traição de outra natureza.

⚠ **TENSÃO REGISTRADA:** o ciclo 10 **recusou uma segunda moeda** uma vez. A recusa de lá era
sobre a chantagem cobrar em bilhões quando a alavanca já era a moeda. Aqui é outro **bem**, e
o projeto declarou essa falta com todas as letras: _"o preço de um voto não é uma escala, é um
tipo. Dinheiro, cargo e pauta são moedas diferentes, e hoje o Planalto só tem uma."_

⚠ **RISCO:** cargo não custa caixa, então ele pode dominar a emenda inteira. **O custo em
eficiência tem de morder de verdade**, e isso se mede antes de fechar.

---

## ONDA III — os outros poderes

### 7 · O Congresso propõe, e você veta

**Na vida real:** a maior parte da legislação nasce no Congresso. O presidente **reage** —
negocia, sanciona, veta total ou parcialmente, e o Congresso derruba o veto ou não.

**No jogo hoje:** verificado no código — **100% dos textos que tramitam nascem do jogador**.
`draft()` é a única fonte de `state.bills`. O Congresso nunca manda nada, e por isso **o veto
não pode existir**.

> ⚠ **ESTA É A MAIOR INFIDELIDADE ESTRUTURAL DO JOGO, e ela é também a causa de um defeito
> que já estava medido:** a Caixa de Entrada quase não pergunta. Ela não pergunta porque o
> mundo **não propõe** — ele só responde. O achado 37 e esta lacuna são o mesmo buraco visto
> de dois lados.

**A peça:** uma bancada protocola um texto perto da **própria posição** — a mesma distância
euclidiana que `whipCount` já usa. O jogador negocia, deixa passar, ou veta; o veto volta ao
plenário e cai por maioria.

⚠ **E O JOGADOR PRECISA PODER NÃO SE IMPORTAR.** Um texto que passa contra o presidente é um
resultado legítimo, e não uma derrota de fluxo.

⚠ **RISCO — e é o de ruído:** o Congresso propondo todo mês afoga a bandeja. A taxa é a
decisão inteira, e ela se mede.

### 8 · O STF derruba

**Na vida real:** o tribunal barra decreto, suspende lei, e o presidente indica quem vai
julgá-lo depois. Sabatina no Senado.

**No jogo hoje:** não existe. O ciclo 4 lista o STF entre os atores e nada foi construído.

⚠ **E A MÁQUINA JÁ ESTÁ PRONTA:** `ESTRATO` tem `repeals`. Uma decisão do tribunal é
literalmente **uma norma com `repeals` escrita por outro autor**, e a precedência declarada já
resolve quem vence.

⭐ **E ELE TEM UM PAPEL QUE FECHA UM BURACO EXISTENTE: o STF é o preço da janela de Overton.**
Hoje `POWER_STEPS` deixa o poder do Executivo alto **derrubar o rito de graça** — emenda vira
lei, lei vira caneta, e ninguém cobra. O tribunal é quem cobra: quanto mais o rito for
atropelado, maior a chance de a norma cair.

---

## ONDA IV — o mundo ganha voz própria

### 9 · A imprensa e o escândalo

**Na vida real:** o enquadramento decide metade da política, e escândalo é o que derruba
presidente com mais frequência que economia.

**No jogo hoje:** **TEMPORAL não roda** — `src/domain/events/` é `export {}`. A SONDA lê
indicadores e nada mais; não há enquadramento e não há choque.

**A peça:** TEMPORAL sai do contrato. O escândalo tem matéria-prima pronta: `venality` por
bloco e por pessoa, e `memory` de quem recebeu o quê.

⚠ **É O MAIOR ITEM DESTE CICLO**, e ele acorda um motor inteiro.

### 10 · Os governadores e o pacto federativo

**Na vida real:** 27 governadores, e um presidente governa com eles ou contra eles. Dívida de
estado, transferência, obra que só anda com o governo local.

**No jogo hoje:** não existe. O ciclo 4 os lista; nada foi construído.

⚠ **E ELE TEM UM GANCHO QUE JÁ EXISTE E ESTÁ DECLARADO COMO AUSENTE:** o achado 26 registra
que a vinculação incide sobre a receita **bruta** e no mundo real é sobre a **corrente
líquida** — o que sai para estados e municípios **antes**. O pacto federativo é a peça que
falta para essa conta ficar honesta.

---

# O QUE FICA DE FORA, E POR QUÊ

- ⛔ **hachura e ponteiro travado** — menos fiel, não mais. Ver o topo;
- ⛔ **mono em valor financeiro** — não é defeito, é **troca de regra**. Três famílias é teto
  declarado, e metade do que o dossiê quer já existe em `[data-numeric]`. Se ele quiser, é
  decisão dele e custa reescrever a legenda tipográfica;
- ⛔ **jogador escolhendo entre MP, PL e PEC como menu** — o **veículo** entra (item 4); a
  **escolha do rito mínimo** continua saindo do conteúdo, com prova travando;
- ⛔ **geopolítica, BRICS, sanções, balança comercial** — exige setor externo em CORRENTE, que
  não existe. _"Fase 1 só o Brasil"_ segue de pé. ⚠ **Mas há uma versão barata registrada:**
  um quinto grupo de pressão com `reads: "external"`, lendo um índice ambiental. É uma entrada
  de catálogo, não um subsistema;
- ⛔ **reforma ministerial — criar e extinguir ministério.** Foi considerada e ficou fora: as
  oito áreas são a espinha do catálogo, e mexer nelas atinge MALHA, rail, orçamento e save de
  uma vez. **É candidata natural ao ciclo 14**;
- ⛔ **greve por categoria profissional** — `research/03` já a avaliou e recusou o desenho por
  três razões medidas: a SONDA segmenta por **renda** e não por profissão, o efeito viria por
  CASCATA e TEMPORAL que não rodam, e _"vermelho é crise, e uma greve legítima não é um defeito
  do país"_. O buraco é real (achado 20); o desenho não pluga;
- ⚠ **o layout de três colunas da tela de Indústria** é **gosto, e é dele**. Minha recusa foi
  reflexo: o ciclo 11 matou o cartão como unidade de dashboard e deixou exceção escrita para
  assuntos sem relação entre si, que é exatamente o caso.

# A ORDEM, E O QUE CADA ONDA DESTRAVA

| onda    | itens                                | o que muda                                                                 |
| ------- | ------------------------------------ | -------------------------------------------------------------------------- |
| **0**   | desoneração · cor do piso · projeção | o jogo passa a **mostrar consequência**, e um defeito fiscal cai           |
| **I**   | mínimo · folha · contingenciamento   | **a obrigatória deixa de crescer sozinha** — 61% do orçamento vira decisão |
| **II**  | MP · tributo · nomeações             | o Executivo ganha **seus instrumentos**, e o voto ganha **segunda moeda**  |
| **III** | Congresso propõe · STF               | o jogador para de ser o único autor, e o **atropelo passa a custar**       |
| **IV**  | imprensa · governadores              | o mundo ganha **iniciativa própria**                                       |

⚠ **AS ONDAS 0, I e II NÃO PRECISAM DE MOTOR NOVO.** Elas usam `ESTRATO`, `MALHA`, `ECLUSA`,
`CORRENTE` e `LASTRO` como estão — e três delas apenas **ligam canais que já existem e estão
mortos**. A onda IV acorda TEMPORAL, e é a única que abre motor.

⚠ **E O ACHADO 53 CONTINUA DE PÉ DENTRO DESTE PLANO:** nada aqui gira `decay` nem `yield` de
área. A velocidade do país continua sendo a pergunta de desenho aberta — e o item 0.3 é o
instrumento que finalmente a torna visível.
