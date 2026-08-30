# O GLORIOSO — o plano mestre

> **Nomeado por ele.** O norte foi dito com estas palavras:
>
> > _"O que eu realmente quero no fim do dia é um jogo extremamente realista. Se na vida
> > real um presidente e seu governo pode fazer tal coisa, no meu jogo o jogador de alguma
> > forma também vai conseguir fazer. Liberdade, realismo, fidelidade. Brasil real."_
>
> ⚠ **EM EXECUÇÃO DESDE 24/08/2026, e a ordem é a do rodapé deste arquivo.**
>
> | passo | itens                     | estado                  |
> | ----- | ------------------------- | ----------------------- |
> | **0** | C12 · D7                  | ✔ os dois               |
> | **1** | 0.1 · 0.2 · C1 · C2 · C3  | ✔ os cinco              |
> | **2** | B1 a B5                   | ✔ os cinco — 30/08/2026 |
> | **3** | C8 · C9 · C10 · C11 · C13 | ✔ os cinco — 30/08/2026 |
>
> **22 de 49.** O **B10** e o **C7** entraram em 30/08/2026. Falta o **D4**, e ele **abre motor**.
>
> **20 de 49.** O **0.3 entrou em 30/08/2026** e saiu 15× mais barato que o previsto: com o
> plenário congelado ela não roda `playMonth`, e 24 meses custam **0,34ms** contra os 5,3 que o
> plano orçava. A leitura de um mês separava duas decisões opostas por **0,20 ponto** — as duas
> imprimiam `61`; a de 24 meses separa por **4,26**.
>
> **19 de 49.** O passo 3 fechou junto: o C10 pôs a divisão **na barra que já existia** (custo
> de altura zero, e uma linha própria estourou a coluna em 557 contra 518), e o C11 fez o gasto
> preso mostrar o que MUDOU, na nota do valor.
>
> **17 de 49.** O passo 2 fechou em 30/08/2026: a faixa de áreas do Congresso ganhou ícone
> (B5), o que cada área MEDE (B3, e ele já estava no catálogo), a faísca com direção (B4) e a
> pista colorida pela distância de `initial` (B1) — `alertsOf`, o mesmo motor que o rail lê.
> O B2 já existia: o bloco sempre foi `<button data-section>`.
> | **4** | 0.3 · B10 · C7 · D4 | ⛔ |
>
> ⚠ **O PASSO 3 FOI FEITO ANTES DO 2, e foi erro meu** — anunciado como inversão deliberada e
> cobrado por ele: _"não acha melhor voltar desde o início, passo 1, passo 2, passo 3?"_. A
> ordem do rodapé volta a valer, e o passo 2 é o próximo.
>
> ⚠ **E A LIÇÃO DO PASSO 1 É DELE, em quatro palavras: _"mudou bosta nenhuma"_.** Os cinco
> itens do passo 1 e três dos cinco do passo 3 **consertam** — número errado, palavra
> repetida, informação escondida. Consertar é invisível por construção: o melhor resultado
> possível de arrumar uma contradição é ninguém notar. **O que muda o jogo é a Parte A**, e
> ela começa no passo 6.

---

## COMO LER ESTE PLANO

### A regra que governa todas as decisões daqui

_"Tudo tem preço, nada tem muro"_ não é preciosismo de desenho — **é a descrição do cargo**.
Um presidente pode mandar uma PEC destruir o piso da saúde amanhã de manhã. Nada o impede.
O que o para é o **Congresso**, e não um botão cinza.

> ### ⚖ Sempre que a escolha for entre **BLOQUEAR** e **COBRAR**, cobrar é o mais fiel.
>
> Um controle travado transfere para a interface um limite que na vida real é **político** —
> e com isso o jogo fica **menos** realista, não mais.

É por isso que a "parede constitucional com hachura" dos dossiês é recusada: **por fidelidade,
não por doutrina**. A zona constitucional ganha cor própria e o ponteiro atravessa.

### As três origens de tudo o que está aqui

| origem                         | o que ela produziu                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| **medição minha**              | a velocidade das áreas, a altura das telas, o custo da projeção, os quatro canais mortos |
| **três dossiês do Gemini**     | a segunda moeda, a MP, a linha do tempo, e as auditorias do Congresso e do Gabinete      |
| **as quatro referências dele** | Victoria 3, Crusader Kings, Democracy e Football Manager — a Parte D inteira             |
| **achados do próprio projeto** | 8, 16, 20, 26, 32, 36, 37, 47 — abertos há sessões e fechados aqui                       |

⚠ **E os dossiês foram lidos CONTRA o código, não aceitos.** O padrão registrado em cinco
auditorias externas se repetiu: **elas leem bem a tela e inferem mal o mecanismo.** Cada item
abaixo diz o que o código de fato faz hoje.

### Os quatro eixos

Este plano tem quatro metades, e elas atacam problemas diferentes:

- **PARTE A — O CARGO:** o que um presidente **faz** e o jogo não deixa fazer. É fidelidade;
- **PARTE B — A TELA:** o que o motor **já sabe** e a tela não mostra. É legibilidade;
- **PARTE C — O GABINETE:** onde a tela que abre o jogo **se contradiz**. É confiança;
- **PARTE D — AS REFERÊNCIAS:** o que Victoria 3, Crusader Kings, Democracy e Football Manager
  fazem e este jogo ainda não faz. É **por que se joga de novo**.

E uma **PARTE 0**, que não é nenhuma das quatro: ela é o que precisa existir antes, porque
**fidelidade que o jogador não percebe não é fidelidade.**

⚠ **A ORDEM ENTRE ELAS NÃO É A ORDEM DE EXECUÇÃO.** A Parte C vem por último no papel e quase
primeiro na prática — enquanto a tela inicial se contradiz, todo número novo herda a
desconfiança dela.

---

## 🗺 O MAPA

`motor` diz o que cada item exige do modelo: **não** · **liga canal** (usa o que já existe e
está morto) · **abre motor** (constrói mecânica nova).

### PARTE 0 — a fundação

| #       | o quê                                   | motor      | tamanho |
| ------- | --------------------------------------- | ---------- | ------- |
| **0.1** | a desoneração vira renúncia de receita  | liga canal | pequeno |
| **0.2** | o piso constitucional ganha cor própria | não        | pequeno |
| **0.3** | a projeção — o jogo olha para frente    | não        | médio   |

### PARTE A — o cargo · dez poderes em quatro ondas

| #       | o quê                                | motor      | tamanho | depende de |
| ------- | ------------------------------------ | ---------- | ------- | ---------- |
| **A1**  | o salário mínimo                     | liga canal | médio   | 0.3        |
| **A2**  | o reajuste da folha                  | liga canal | pequeno | A1         |
| **A3**  | o contingenciamento escolhido        | não        | pequeno | —          |
| **A4**  | Medida Provisória, com caducidade    | não        | médio   | B10        |
| **A5**  | o decreto tributário                 | liga canal | médio   | 0.3        |
| **A6**  | nomear e demitir — a segunda moeda   | abre motor | grande  | 0.3        |
| **A7**  | o Congresso propõe, e você veta      | abre motor | grande  | A4         |
| **A8**  | o STF derruba                        | não        | médio   | A6         |
| **A9**  | a imprensa e o escândalo             | abre motor | grande  | A6         |
| **A10** | os governadores e o pacto federativo | abre motor | grande  | —          |

### PARTE B — a tela · dezesseis achados em seis grupos

| #       | grupo        | o quê                              | tamanho |
| ------- | ------------ | ---------------------------------- | ------- |
| **B1**  | a faixa      | colorir o **mandato**, não o nível | pequeno |
| **B2**  | a faixa      | ela **é** navegação e não diz      | pequeno |
| **B3**  | a faixa      | não diz **o que** mede             | pequeno |
| **B4**  | a faixa      | a faísca é sem cor                 | pequeno |
| **B5**  | a faixa      | ícone por área                     | pequeno |
| **B6**  | a mesa       | o que cada pessoa **vende**        | médio   |
| **B7**  | a mesa       | a **memória** puxa o olho          | pequeno |
| **B8**  | a mesa       | não há cabeçalho de coluna         | pequeno |
| **B9**  | a mesa       | `arrasta 57` sem denominador       | pequeno |
| **B10** | a tramitação | a **linha do tempo**               | médio   |
| **B11** | a tramitação | o documento ganha autor            | pequeno |
| **B12** | a tramitação | o estágio é **carimbo**            | pequeno |
| **B13** | o vazio      | mostrar o que **morreu**           | médio   |
| **B14** | o relatório  | 599px de consulta arejada          | médio   |
| **B15** | o relatório  | dois heróis na mesma tela          | pequeno |
| **B16** | a ponte      | as quatro ambições ganham preço    | —       |

### PARTE C — o Gabinete · treze itens em cinco grupos

| #       | grupo       | o quê                                    | motor      | tamanho |
| ------- | ----------- | ---------------------------------------- | ---------- | ------- |
| **C1**  | contradição | duas rupturas, **o mesmo verbo**         | não        | pequeno |
| **C2**  | contradição | o cofre é dito **duas vezes**            | não        | pequeno |
| **C3**  | contradição | **4º canal morto** — o peso só no leitor | liga canal | pequeno |
| **C4**  | agência     | a superfície existe e está vazia         | —          | —       |
| **C5**  | agência     | a **plataforma de posse**                | liga canal | médio   |
| **C6**  | agência     | a carta de posse passa a **perguntar**   | não        | pequeno |
| **C7**  | tempo       | o **calendário** do mandato              | abre motor | médio   |
| **C8**  | tempo       | quantos meses restam                     | não        | pequeno |
| **C9**  | tempo       | a rua ganha **seta**                     | não        | pequeno |
| **C10** | leitura     | a base **que se compra** — 364 de 513    | não        | médio   |
| **C11** | leitura     | o maior gasto preso para de ser legenda  | não        | pequeno |

### PARTE D — as quatro referências · sete itens

| #      | o quê                                         | referência       | motor      | tamanho |
| ------ | --------------------------------------------- | ---------------- | ---------- | ------- |
| **D1** | ⭐⭐ o **presidencialismo de coalizão**       | Victoria 3       | abre motor | grande  |
| **D2** | ⭐ a **eleição** — a terceira saída           | Democracy        | abre motor | grande  |
| **D3** | ⭐ as pessoas **agem sem você**               | Crusader Kings   | abre motor | grande  |
| **D4** | ⭐ a **corrente causal** visível              | Democracy        | abre motor | médio   |
| **D5** | a **entrevista coletiva**                     | Football Manager | não        | médio   |
| **D6** | o relatório **conta uma história**            | Football Manager | não        | médio   |
| **D7** | o rail promete **duas telas que não existem** | —                | —          | —       |

---

## ⚠ QUATRO CANAIS MORTOS — e são a prova de que metade disto já está construída

Achados verificando os dossiês contra o código. Nenhum falha, nenhum acusa, e os quatro são a
mesma família: **o motor sabe e nada consome.**

| canal                  | quem escreve                            | quem lê               |
| ---------------------- | --------------------------------------- | --------------------- |
| `data-guard`           | `area.mjs`, em toda linha de lei        | **ninguém**           |
| `taxDelta`             | `economy.mjs`, com `taxDrag: 0,35`      | **nunca dispara**     |
| `desoneracao-setorial` | `programs.mjs`, classificada como gasto | **está errada**       |
| `lobby.share`          | `cabinet.mjs:413`, em porcentagem       | **só o `aria-label`** |

- **`data-guard`** carrega `constitution`, `law` ou `none` em cada linha, e nenhuma folha
  pinta. O jogo **sabe** quais pisos são constitucionais e mostra todos com a mesma cor;
- **`taxDelta`** é `taxLoad − baseTaxLoad`, e `turn.mjs` passa **a mesma constante nas duas
  pontas**. O arrasto tributário — calibrado, com fonte — **jamais roda**. A economia já sabe
  reagir a imposto; nada no jogo pode mexer em imposto;
- **a desoneração** consome discricionário como se fosse obra. É **renúncia de receita**:
  ninguém gasta, a Fazenda deixa de arrecadar;
- **`lobby.share`** entrega o peso de cada grupo na ruptura econômica só a quem usa leitor de
  tela. Um dos quatro pesa **zero**, e o jogador vidente não tem como saber (C3).

---

# PARTE 0 — A FUNDAÇÃO

⚠ **O [ciclo 12](12-o-jogo-olha-para-frente.md) não compete com este plano: ele É a Parte
0.3.** Hoje toda leitura do jogo tem horizonte de **um mês** e toda decisão paga em **12 a
48**. Acrescentar dez poderes a uma tela que não mostra consequência é somar profundidade
invisível — o defeito que o ciclo 5 nomeou: _"motor que o jogador não vê não é profundidade,
é custo."_

### 0.1 · A desoneração vira renúncia de receita

**O defeito:** `desoneracao-setorial` tem `cost: 31` e `spendOf` a trata como qualquer rubrica
— ela consome o discricionário do mês.

**Por que está errado:** desoneração não é dinheiro que o ministério gasta; é dinheiro que a
Fazenda **deixa de arrecadar**. Hoje o jogo cobra um caixa que o jogador nunca teve e não
cobra a arrecadação que ele de fato perdeu.

**O que se ganha:** a jogada que hoje não existe — **comprar o setor produtivo com dinheiro do
futuro**. Buff imediato no lobby, nenhum aperto no caixa de hoje, e o déficit primário maior
para sempre.

⚠ **Custo escondido:** consertar muda a série fiscal, e toda tabela de calibragem do
`journal.md` foi medida com o comportamento errado. **Remedir a série entra no mesmo commit.**

### 0.2 · O piso constitucional ganha cor própria

**O defeito:** o trilho pinta piso constitucional e piso de lei ordinária com a **mesma**
`--rail-costly`. A severidade não aparece, e `data-guard` — o dado que distingue — está morto.

**O que NÃO se faz:** hachura, zona bloqueada, ponteiro travado. Ver a regra ⚖ no topo.

**Como se mede que ficou pronto:** `data-guard` deixa de ser canal morto, e o passeio continua
verde no contraste.

### 0.3 · A projeção — o jogo olha para frente

**O diagnóstico, medido:** a tela de área imprime `61 → 61` numa área que anda **0,40 por
mês**. É matematicamente incapaz de mostrar a decisão que o jogador acabou de tomar.

| horizonte | custo medido |
| --------- | ------------ |
| 1 mês     | 0,8ms        |
| 12 meses  | 3,0ms        |
| 24 meses  | 5,3ms        |
| 48 meses  | 10,3ms       |

**A peça:** `trajectory` na camada de aplicação — `playMonth` para frente com as ordens
congeladas, sobre uma cópia do estado. **Duas curvas sempre:** _mantendo isto_ e _sem tocar em
nada_. É `outlook` com horizonte, e não peça nova.

⚠ **A DECISÃO DE DESENHO QUE PRECISA SER TOMADA ANTES DE ESCREVER:** projetar 24 meses roda o
turno inteiro, **incluindo votações que sorteiam**. A curva mostraria textos passando e caindo
— uma **previsão sobre um voto que não aconteceu**, e o projeto tem cicatriz exata disso: a
Mesa anunciava veredito invertido em **27,2%** das votações. A projeção precisa **congelar o
plenário e declarar isso na tela**.

⚠ **Segundo risco:** uma curva boa demais vira **solucionador** — o jogador otimiza contra o
gráfico em vez de governar contra o país.

---

# PARTE A — O CARGO

## ONDA I — a obrigatória deixa de crescer sozinha

> Hoje `mandatoryGrowth: 2,16%` é **uma constante que ninguém escolheu** governando
> **R$ 2.157 bi**. O achado 32 já escreveu o conserto: _"separar a obrigatória em parcelas com
> crescimentos próprios, e aí a folha volta a só subir quando o presidente decidir — **que é
> uma jogada, e não um parâmetro**."_

### A1 · O salário mínimo

**Na vida real:** uma decisão por ano, e a mais consequente do cargo. Indexa aposentadoria
urbana e rural, BPC, abono e seguro-desemprego — **R$ 1.325 bi, 61% de toda a obrigatória**.

**No jogo hoje:** não existe. Há uma entrada morta, `reajuste-do-salario-minimo`, no catálogo
aposentado de `bills.mjs` — o **achado 8**, _"catálogo morto que ainda respira"_.

**A peça:** uma alavanca **anual**. O reajuste real escolhido escala o custo dos cinco
programas indexados, e `mandatoryGrowth` deixa de ser constante e passa a ser **derivado**.

⚠ **O que faz a decisão doer é a PERMANÊNCIA**, e ela já tem precedente: subir 6% real neste
ano sobe a base **para sempre**, exatamente como furar um piso já é permanente nos dois
sentidos. É o trade-off mais brasileiro que existe — popular, chega em quem mais precisa, e a
conta fica.

⚠ **Risco:** pode virar a alavanca dominante — subir, colher aprovação, morrer no ano 3.
**Isso é o dilema real e não um defeito**, mas mede-se antes de fechar.

### A2 · O reajuste da folha

**Na vida real:** R$ 398 bi de pessoal e inativos, e cada categoria negocia. Um presidente
concede, parcela ou segura — e greve de servidor é a resposta.

**No jogo hoje:** cresce ~0% real dentro da média ponderada, sem ninguém decidir.

**A peça:** a segunda parcela da decomposição de A1. Conceder compra paz e engorda a
obrigatória para sempre; segurar economiza e cobra em **serviço entregue**, que a MALHA já
sabe ler.

### A3 · O contingenciamento escolhido

**Na vida real:** decreto de contingenciamento, rubrica a rubrica. É como um governo
brasileiro atravessa o ano.

**No jogo hoje:** existe só **automático**, quando a obrigatória fura o teto.

⚠ **E o achado 36 cai junto:** hoje o rateio grava o corte no estado e **nada nunca o
devolve** — um mês de aperto encolhe o orçamento para sempre, e a permanência não está escrita
em lugar nenhum. No mundo o contingenciamento é anual e se libera.

---

## ONDA II — os instrumentos do Executivo

### A4 · Medida Provisória, com caducidade

**Na vida real:** força de lei **na hora**, e caduca se o Congresso não converter. É o
instrumento que define o Executivo brasileiro desde 88.

**No jogo hoje:** não existe. Todo texto espera três meses.

⚠ **A MÁQUINA JÁ ESTÁ PRONTA, e é o item mais barato da Parte A.** `ESTRATO` tem **vigência**
(`months`) e tem prova de que **revogar a nova faz a velha voltar**. Uma MP é uma norma com
`months: 4`: vale já, e se ninguém converter ela expira e a lei anterior ressurge sozinha.

⚠ **E ISSO NÃO INVERTE O RITO DERIVADO.** Eu recusei a proposta do dossiê por esta razão e
**estava errado**: o rito do conteúdo define o **mínimo exigido**; MP e PL são dois caminhos
para o mesmo mínimo, com preços diferentes — **velocidade contra segurança**. As duas regras
convivem, e a prova `O RITO SAI DO CONTEUDO` continua valendo sem uma linha nova.

**Depende de B10:** sem a linha do tempo, "vale já" e "caduca em 4 meses" são dois números
soltos; com ela, é um caminho diferente com um relógio em cima.

### A5 · O decreto tributário

**Na vida real:** IOF, IPI, imposto de importação e de exportação mudam **por decreto** — são
a exceção constitucional à legalidade tributária. O resto vai por lei.

**No jogo hoje:** `taxLoad` é constante, e o canal morto do `taxDelta` prova que a economia já
está construída para responder e nunca é chamada.

**A peça:** a carga vira alavanca, e **o rito sai da natureza do tributo** — os quatro de
decreto são caneta, o resto é lei. A regra do ciclo 2 se aplica sem uma linha nova.

⚠ **Ressuscita a Parte 3 do ciclo 3**, suspensa desde 14/08/2026 porque a cláusula de tributo
do ciclo 4 a absorveria. Ela nunca chegou.

### A6 · Nomear e demitir — e é a segunda moeda

**Na vida real:** **~22 mil cargos de livre nomeação.** É a moeda real da política brasileira:
não se compra deputado só com emenda, compra-se com **cargo**.

**No jogo hoje:** existem cinco pessoas com cargo — presidente da Câmara, do Senado, relator,
líderes e Casa Civil — e **nenhum ministro**. Há uma moeda só: emenda, em dinheiro.

**A peça:** um posto por pasta e por estatal, com ocupante **técnico** ou **indicado por
bancada**. Técnico levanta a eficiência da máquina; indicado levanta a lealdade daquela
bancada e derruba a eficiência.

> ⚠ **E A FORMA TEMPORAL É O QUE TORNA A MOEDA INTERESSANTE: cargo é ESTOQUE, emenda é
> FLUXO.** A emenda se paga todo mês e o calote é imediato; o cargo se entrega **uma vez** e
> segue comprando lealdade até você tomá-lo de volta — e tomar de volta é uma traição de outra
> natureza.

**Três nomeações têm canal próprio, e não são intercambiáveis:**

| nomeação                 | o que ela move                                                                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ministro / diretoria** | eficiência da pasta (MALHA) e lealdade da bancada (ECLUSA)                                                                                                       |
| **Banco Central**        | ⭐ o juro. A autoridade monetária é autônoma (LC 179/2021), e a CORRENTE já tem Taylor, suavização e prêmio de risco. Um BC duro briga com a sua expansão fiscal |
| **Procurador-Geral**     | ⭐ se você é investigado. É o gatilho de A9                                                                                                                      |

⚠ **Tensão registrada:** o ciclo 10 **recusou uma segunda moeda** uma vez. A recusa de lá era
sobre a chantagem cobrar em bilhões quando a alavanca já era a moeda. Aqui é outro **bem**, e
o projeto declarou a falta com todas as letras: _"o preço de um voto não é uma escala, é um
tipo. Dinheiro, cargo e pauta são moedas diferentes, e hoje o Planalto só tem uma."_

⚠ **Risco:** cargo não custa caixa, então pode dominar a emenda inteira. **O custo em
eficiência tem de morder de verdade**, e isso se mede antes de fechar.

---

## ONDA III — os outros poderes

### A7 · O Congresso propõe, e você veta

**Na vida real:** a maior parte da legislação nasce no Congresso. O presidente **reage** —
negocia, sanciona, veta total ou parcialmente, e o Congresso derruba o veto ou não.

**No jogo hoje:** verificado no código — **100% dos textos que tramitam nascem do jogador.**
`draft()` é a única fonte de `state.bills`. O Congresso nunca manda nada, e por isso **o veto
não pode existir**.

> ⚠ **É A MAIOR INFIDELIDADE ESTRUTURAL DO JOGO — e é a mesma coisa que o achado 37.** A Caixa
> de Entrada quase não pergunta porque o mundo **não propõe**: ele só responde. As duas coisas
> são o mesmo buraco visto de dois lados.

**A peça:** uma bancada protocola um texto perto da **própria posição** — a mesma distância
euclidiana que `whipCount` já usa. O jogador negocia, deixa passar, ou **veta**; o veto volta
ao plenário e cai por maioria absoluta.

⚠ **E o jogador precisa poder NÃO se importar.** Um texto que passa contra o presidente é um
resultado legítimo, e não uma derrota de fluxo.

⚠ **Risco — e é o de ruído:** o Congresso propondo todo mês afoga a bandeja. **A taxa é a
decisão inteira**, e ela se mede.

### A8 · O STF derruba

**Na vida real:** o tribunal barra decreto, suspende lei — e você indicou quem vai julgá-lo.

**No jogo hoje:** não existe. O ciclo 4 lista o STF entre os atores e nada foi construído.

⚠ **A máquina já está pronta:** `ESTRATO` tem `repeals`. Uma decisão do tribunal é
literalmente **uma norma com `repeals` escrita por outro autor**, e a precedência declarada já
resolve quem vence.

> ⭐ **E ELE FECHA UM BURACO QUE JÁ EXISTE: o STF é o preço da janela de Overton.** Hoje
> `POWER_STEPS` deixa o poder do Executivo alto **derrubar o rito de graça** — emenda vira lei,
> lei vira caneta, e ninguém cobra. O tribunal é quem cobra: quanto mais o rito for
> atropelado, maior a chance de a norma cair.

---

## ONDA IV — o mundo ganha voz própria

### A9 · A imprensa e o escândalo

**Na vida real:** o enquadramento decide metade da política, e escândalo derruba presidente
com mais frequência que economia.

**No jogo hoje:** **TEMPORAL não roda** — `src/domain/events/` é `export {}`. A SONDA lê
indicadores e nada mais; não há enquadramento e não há choque.

**A peça:** TEMPORAL sai do contrato. A matéria-prima do escândalo está pronta: `venality` por
bloco e por pessoa, e `memory` de quem recebeu o quê. E o **PGR de A6** é o gatilho.

⚠ **É o maior item do plano**, e acorda um motor inteiro.

### A10 · Os governadores e o pacto federativo

**Na vida real:** 27 governadores, e um presidente governa com eles ou contra eles.

**No jogo hoje:** não existe. O ciclo 4 os lista; nada foi construído.

⚠ **E ele tem um gancho já declarado como ausente:** o **achado 26** registra que a vinculação
incide sobre a receita **bruta** e no mundo real é sobre a **corrente líquida** — o que sai
para estados e municípios **antes**. O pacto federativo é a peça que falta para essa conta
ficar honesta.

---

# PARTE B — A TELA

> Dezesseis achados na tela do Congresso, de três origens: a auditoria do Gemini, a minha
> medição, e achados abertos do próprio projeto. **Catorze não precisam de motor; oito são
> canais que já existem e a tela não lê.**

## Grupo 1 — a faixa de áreas · cinco defeitos num bloco de 108px

### B1 · Colorir o MANDATO, não o nível

O dossiê pede vermelho abaixo de 40, amarelo abaixo de 60, verde acima.

⛔ **Não serve**, e a razão é do catálogo: as áreas **começam** em valores diferentes — Fazenda
72, Educação 44, Segurança 38. Pintar Segurança de vermelho no mês 1 acusa o jogador de algo
que ele **herdou**.

⭐ **A versão que serve** — e é melhor que a proposta dele e que a minha: colorir a distância
do **valor de posse**, que já está no catálogo (`initial`). Segurança em 38 no mês 1 é neutra;
em 25 no mês 20 é vermelha, porque **você** perdeu 13 pontos.

> A faixa deixa de dizer _"quão bom é o Brasil"_ — que o jogador não escolheu — e passa a dizer
> _"o que você fez com ele"_, que é o jogo inteiro. É o mesmo enquadramento que o **fecho do
> mandato** já usa: de → para → delta.

### B2 · Ela É navegação e não diz

O dossiê: _"parecem abas de navegação, mas não são"_. **São.** Cada bloco é
`<button data-section="…">` e leva ao ministério. Ele viu a ambiguidade e **errou a direção**:
o defeito é que são navegação e **nada anuncia isso**. Oito portas que ninguém sabe que abrem.

### B3 · Ela não diz O QUE mede

A faixa imprime `Fazenda 72`. Mas cada área tem um **nome de índice** no catálogo —
_arrecadação, safra, capacidade, cobertura, atendimento, formação, ordem, prontidão_ — e a
faixa mostra só o rótulo do ministério. O jogador vê 72 e não sabe 72 **de quê**.

### B4 · A faísca é sem cor

Ela existe e sai em `--ink-dim`. Colorir pela tendência é o _"verde subindo, vermelho
caindo"_ que o dossiê pede, e o vocabulário já existe (`.trend[data-direction]`).

### B5 · Ícone por área

O rail já tem um por ministério. Reusar é de graça e ajuda a varrer.

## Grupo 2 — a mesa · a superfície onde se decide

### B6 · ⭐ O que cada pessoa vende, e o que ela não vende

Cada pessoa tem **duas venalidades** — uma para pauta econômica, outra para costumes — e
`venalityFor` cobra pelo eixo que domina a distância. O líder da esquerda é _menos_ venal que
o próprio bloco; o do Centrão é mais.

O projeto já escreveu o veredito: _"o motor sabe e o jogador não tem como saber. **Isso é
legibilidade, não espionagem — e é barato.**"_ Um card que diz **"vende economia, não vende
costume"** é o CK3 que o dossiê pede, com o motor que já existe.

### B7 · A memória puxa o olho — não a ambição

O dossiê quer a ambição como alerta vermelho pulsante.

⛔ **Erra duas vezes:** vermelho é crise nesta paleta e o pulso está **reservado à moldura do
cerco** — o estado que decide a partida. E o traço é **inerte**: das cinco ambições, só
`succession` tem preço (**achado 16**).

⭐ **O que serve já está calculado:** a **memória**. _"Cobra a promessa que você não pagou"_ é
uma pessoa que ficou mais cara **por culpa sua**, e isso muda o preço do voto agora.

### B8 · ⚠ A tela de decisão não tem cabeçalho; a de consulta tem

A mesa mostra quatro números por linha — `70 · 0% · R$ 0,0 bi · —` — com **zero** rótulos de
coluna. O relatório do mês passado, que é **consulta**, tem **cinco**. Está de cabeça para
baixo.

### B9 · `arrasta 57` de quantos?

Sem denominador, num mês sem pauta.

## Grupo 3 — a tramitação

### B10 · ⭐ A linha do tempo

`[Gaveta] → [Relatoria] → [Plenário]`, com o relógio da gaveta em cima. Hoje o estágio é uma
**palavra** e o jogador não vê que existe um caminho de três passos nem onde o texto dele está
nele. Todo o dado já está pronto. **Zero motor — e é pré-requisito de A4.**

### B11 · O documento ganha autor

O jogo conhece o relator e sabe o que ele salvou; a linha não nomeia ninguém. Pôr a pessoa no
documento transforma uma linha de tabela num papel assinado.

### B12 · O estágio é carimbo

A regra do projeto diz que mono é _"o que a máquina do Estado carimba"_. O estágio sai hoje na
fonte de leitura. Pô-lo em `--font-machine` é **mais** correto pela regra que já existe.

## Grupo 4 — o vazio

### B13 · ⭐ Mostrar o que MORREU

O dossiê acertou um achado aberto: _"o espaço mais nobre da tela está ocupado por 'Nada em
pauta'"_ — registrado como **~400px, e a decisão de peso nunca foi tomada de propósito**.

⭐ **A versão que serve:** quando não há pauta, o bloco mostra **o cemitério do jogador** — os
textos engavetados e derrubados neste mandato. O dado já está em `state.mail`.

⛔ **E "pautas sugeridas pela Casa Civil" é recusado com as palavras dele:** _"pauta pronta é
uma bosta, onde tem criatividade nisso e liberdade?"_ — foi essa frase que matou o catálogo de
pautas e criou o orçamento granular. Mostrar o **seu** cemitério é história; sugerir pauta é o
menu voltando.

## Grupo 5 — o relatório

### B14 · ⚠ 599px de consulta, e é o bloco mais arejado da tela

Medido, com o jogo no mês 8:

| bloco                | altura      | fatia   |
| -------------------- | ----------- | ------- |
| Em pauta (a mesa)    | **1.112px** | 55%     |
| **O mês passado**    | **599px**   | **30%** |
| Em tramitação        | 190px       | 9%      |
| O que o país entrega | 108px       | 5%      |

A tela rola **1.355px** numa janela de 980, e **85% da altura são dois blocos**. O segundo é
**pura consulta**: ninguém decide nada nele.

⚠ **A regra que resolve já está escrita:** _"densidade é ruído onde há decisão, e serviço onde
não há"_ — é a razão de Finanças ser densa. **A densidade do Victoria 3 que o dossiê pede cabe
exatamente ali**, e devolve rolagem.

### B15 · Dois heróis na mesma tela

A previsão (na mesa) e o placar (no relatório) usam os dois `--text-hero`. Dois heróis não
formam hierarquia. Escapou da peneira de tipografia porque o relatório só aparece depois de um
mês.

## Grupo 6 — a ponte para a Parte A

### B16 · ⭐ As quatro ambições ganham preço

O dossiê chama o campo de _"A Ambição/Chantagem"_ — ele **assume** que é uma alavanca. Não é:
**achado 16**, quatro das cinco não movem nada.

| ambição                   | quem a torna viva      |
| ------------------------- | ---------------------- |
| quer um ministério        | **A6** — nomear        |
| quer uma vaga no tribunal | **A8** — o STF         |
| quer o governo do estado  | **A10** — governadores |
| quer o Planalto em 2030   | já tem preço           |

> Quatro ambições escritas há dez dias esperando exatamente os itens que este plano propõe.
> **É a prova de que A6, A8 e A10 não são invenção — o catálogo já os antecipou.**

E aí, sim, a ambição vira crachá — mas de **oportunidade**, na cor da marca, que é a do que se
pressiona. Nunca de crise.

---

# PARTE C — O GABINETE

> A terceira origem deste plano é um dossiê focado só nesta tela. **Ele acerta as três
> acusações que faz** — e uma delas é pior do que ele descreveu.
>
> ⚠ **E ELE ATACA UMA DECISÃO QUE O PROJETO JÁ TINHA TOMADO E DECLARADO CERTA.** O handoff
> registra o conflito 86/68 como _"estruturalmente correto, e agora está legível"_. Está
> correto. **Não está legível.** A Parte C começa desfazendo esse veredito.

## Por que esta tela pesa mais que as outras dez

É a primeira que abre, a única sem rolagem, e a única cujo trabalho é **responder antes de
perguntar**: o jogador chega nela para saber como o país está, e sai dela para decidir em outro
lugar. Um erro aqui não custa uma jogada — custa a confiança em todos os números do jogo.

---

## Grupo 7 — a tela se contradiz três vezes

### C1 · ⭐ Duas rupturas, o mesmo verbo, a MESMA PALAVRA

A acusação mais séria do dossiê, e ela procede na letra:

| bloco    | o que a tela imprime                     | de onde vem                           |
| -------- | ---------------------------------------- | ------------------------------------- |
| Trindade | **Parlamentares** · _rompe acima de_ 86  | `brokerBoil: 86` — a ruptura política |
| Caldeira | **Parlamentares** · _rompem acima de_ 68 | `boil: 68` — a fervura do lobby       |

`TERMOS.political === "Parlamentares"` e `LOBBIES[1].label === "Parlamentares"`. `trinityAbove`
é `"rompe acima de"`; `boilerBreaks` é `"rompem acima de"`. **A mesma palavra, o mesmo verbo,
dois números, a um palmo de distância na mesma tela sem rolagem.**

⚠ **A DEFESA DO PROJETO ESTÁ CERTA E É IRRELEVANTE.** São dois eventos diferentes: em 68 o grupo
**abandona o governo**; em 86 a **ruptura política abre** e vira uma das três condições do
processo. Correto — e invisível, porque a tela usa o mesmo verbo para os dois. O jogador não tem
como descobrir que são perguntas diferentes.

**O conserto NÃO é unificar os números** — eles medem coisas distintas. É parar de dizer
"rompe" duas vezes:

- ⭐ **uma barra, dois limiares.** A linha de Parlamentares na caldeira ganha as duas marcas —
  `abandona em 68 · derruba em 86` — e a terceira régua da Trindade passa a dizer de onde sai:
  ela **é** a pressão do fisiologismo, não um número paralelo;
- é a unificação que o dossiê tentava fazer com avatares, **sem perder a distinção entre
  condição e causa** que separa os dois blocos.

### C2 · ⚠ O cofre é dito duas vezes — e a guarda de vocabulário PROVOU isso

`UI.cabinet.vaultFree = TERMOS.roomLine` e `UI.inbox.inheritedRoom = TERMOS.roomLine`. **A mesma
constante.** No mês 1, `Sobra para o mês R$ 14,5 bi` aparece no bloco DINHEIRO DO MÊS e de novo
no anexo da carta de posse — a metros um do outro, numa tela que não rola.

⚠ **E O MECANISMO QUE DEVERIA TER PEGO ISSO É QUEM CRIOU.** A guarda de vocabulário forçou as
duas a compartilharem o literal — o que **prova** que são a mesma leitura — e ninguém perguntou
se ela devia ser mostrada duas vezes. É a família dos canais mortos vista pelo avesso: um canal
**duplicado** que passou por guarda porque a guarda mede consistência, não redundância.

**Conserto:** o anexo da posse mostra só o que o cofre **não** mostra. Ver C6.

### C3 · ⭐ O QUARTO CANAL MORTO — o peso do grupo só existe no leitor de tela

Em `src/ui/screens/cabinet.mjs:413`, a fatia de cada grupo na ruptura econômica é calculada,
formatada em porcentagem — e escrita **dentro de um `aria-label`**. Ela é entregue
exclusivamente a quem usa leitor de tela.

| grupo               | peso     | o que o jogador vidente vê |
| ------------------- | -------- | -------------------------- |
| Mercado financeiro  | 0,35     | nada                       |
| Indústria e agro    | 0,35     | nada                       |
| Parlamentares       | 0,30     | nada                       |
| Militares e polícia | **0,00** | nada                       |

⚠ **A LINHA DE BAIXO É A QUE DÓI.** Um dos quatro grupos da caldeira **não pesa na ruptura
econômica** — e o jogo tem uma nota em prosa explicando por quê (o que eles cobram não é
dinheiro). O jogador vidente enxerga quatro barras idênticas e gasta capital acalmando uma que
não conta para a conta que ele está tentando não perder.

**É o quarto canal morto do plano**, e o mais barato de ligar: o valor já está pronto na linha 413. Falta sair do `aria-label`.

### C12 · ✔ FEITO — a coluna lateral engolia um cartão inteiro, e o portão ficava verde

**⭐ ÚNICO ITEM DESTE PLANO JÁ EXECUTADO** — porque era defeito na tela publicada, não melhoria.
O canvas ganhou `@media (min-height: 940px)` nas duas folhas, e o passeio ganhou
`checkSwallowed` mais uma segunda janela (1440×900). A checagem foi escrita **antes** do
conserto e verificada contra a folha antiga: acusou `cards__side 594>559`, e só isso.

`.cards__side` tem `overflow-y: auto` (`styles/45-screen-cabinet.css:46`). A coluna dos quatro
cartões rola **por dentro** — e a página nunca cresce um pixel, então nada acusa:

| janela       | coluna visível | conteúdo | resultado                                     |
| ------------ | -------------- | -------- | --------------------------------------------- |
| 1440×**980** | 639px          | 639px    | ✔ cabe — e é a única janela do passeio        |
| 1440×**900** | 559px          | 594px    | ⛔ esconde 35px · **3 de 4 cartões inteiros** |
| 1440×**820** | 479px          | 594px    | ⛔ esconde 115px · 3 de 4                     |
| 1440×**760** | 419px          | 594px    | ⛔ esconde 175px · **2 de 4**                 |

A 900px de altura — a resolução de um MacBook Air — **a Aprovação por renda some**, e o
Gabinete deixa de ser a tela que ele foi desenhado para ser: a única sem rolagem.

⚠ **E A RAZÃO DE NINGUÉM TER VISTO É A MESMA DE SEMPRE, PELA QUARTA VEZ:**

- `checkOverflow` mede `scrollWidth > innerWidth`: **só a horizontal, e só a página**;
- `checkClipped` filtra por `style.overflowX`. **O gêmeo vertical não existe.** O cabeçalho
  dela em `walk.mjs:78` conta que o passeio já foi cego para o recorte próprio no eixo X e foi
  consertado — e o eixo Y nunca entrou;
- o passeio roda em **uma janela só**, `1440×980` (`walk.mjs:52`) — que é **exatamente a única
  altura em que a coluna cabe**. O portão está medindo o único caso que passa.

**O conserto tem duas metades, e a segunda vale mais que a primeira:**

1. a coluna para de engolir — os quatro cartões cabem, ou a tela assume que rola;
2. ⭐ **`checkClipped` ganha o eixo Y**, e o passeio ganha uma segunda janela. Sem isso, o item
   seguinte que crescer 24px repete este defeito com o portão verde ao lado.

> ⚠ **E É POR ISSO QUE C10 NÃO É DE GRAÇA.** Ele acrescenta ~24px dentro de "A Câmara". A 980px
> a coluna está em 639 de 639: **não há 24px.** O que aconteceria hoje é o item entrar, a
> página não crescer, o passeio passar, e um cartão descer para baixo da dobra em silêncio.

---

## Grupo 8 — a tela não pergunta

### C4 · O que o dossiê pede, e por que a resposta não é botão

Ele quer três botões de decisão dentro da carta — `Cortar verba`, `Emitir dívida`, `Ignorar`.
**O diagnóstico é certo e a solução está errada por duas razões medidas:**

- ⛔ **dois dos três levam para outra tela.** Cortar verba é a mesa; emitir dívida não existe
  como alavanca. Um par de botões ali seria **segunda porta para a mesma jogada** — o jogador
  escolheria sem ver o preço que só a outra tela mostra;
- ⛔ **o passeio afirma o contrário há seis ciclos:** `#main input, #main select` no Gabinete
  tem de dar **zero**. A tela inicial não decide — porque quem abria o jogo no desenho antigo
  _"caía no meio de uma decisão sem antes saber como o país estava"_.

⭐ **MAS A SUPERFÍCIE QUE ELE PEDE JÁ EXISTE, E ESTÁ VAZIA.** `mail.mjs` tem **duas** espécies
de carta que perguntam: `amendment` (a emenda do relator) e `demand` (a chantagem do lobby). A
segunda é **exatamente** o que o dossiê descreve: um grupo cobra, o preço está na carta, e a
resposta se dá ali. O problema nunca foi a falta de botão — é que **o jogo tem duas perguntas e
treze espécies de aviso** (achado 37).

> **A Parte C não constrói agência no Gabinete. A Parte A a entrega:** A6 põe ministro para
> pedir, A7 põe o Congresso para propor, A9 põe a imprensa para cobrar, A10 põe governador para
> negociar. **Quatro fontes novas de carta que pergunta, todas na espécie que já roda.**

### C5 · ⭐ A plataforma de posse — o jogo ganha um critério

**Isto não veio de dossiê nenhum.** O jogo gera um presidente com nome, tratamento e partido — e
**nenhuma promessa**. Na vida real é o inverso: um presidente chega ao cargo devendo o que disse
na campanha, e é contra isso que ele é medido por quatro anos.

- na posse, o jogador escolhe **três compromissos** de uma lista tirada do catálogo que já
  existe (uma área para priorizar, uma norma para mover, uma meta fiscal);
- ⚠ **a máquina de punição JÁ ESTÁ CONSTRUÍDA.** `SONDA` tem `betrayal` — _"a fração da promessa
  que o caixa NÃO honrou"_ — e ela já derruba humor de todo mundo. Hoje ela só olha o orçamento.
  Passa a olhar também o que foi prometido na posse;
- **o fecho ganha o que nunca teve: um critério.** Hoje ele mostra de-onde-para-onde. Passa a
  mostrar **prometido × entregue** — que é como um mandato é julgado fora do jogo;
- ⛔ **nem promessa cumprida nem quebrada é muro.** Quebrar é caro, não é proibido. É a doutrina
  inteira num lugar novo.

### C6 · A carta de posse deixa de repetir e passa a perguntar

Consequência de C2 e C5: o anexo para de imprimir `Sobra para o mês` (o cofre já diz, dois
centímetros acima) e a carta passa a ser **a primeira pergunta do mandato** — a escolha dos três
compromissos.

⚠ **E ISSO RESOLVE O MÊS 1 TER ZERO DECISÕES.** Hoje o botão da carta de posse é `ver o mês` —
navegação. Passa a ser a única carta que o jogador **tem** de responder antes de avançar.

---

## Grupo 9 — a tela não tem tempo

### C7 · ⭐ O calendário do mandato

O Gabinete mostra `MAR · 2027` e **nada mais sobre quando**. Um mandato presidencial tem forma: a
LDO em abril, a LOA em agosto, o mínimo em 1º de janeiro, o relatório bimestral de receitas e
despesas. **O jogo tem 48 meses e nenhum deles é diferente dos outros.**

- um bloco de prazos: **o que vence este mês, o que vence no trimestre**;
- ⚠ **A1 NÃO EXISTE SEM ISTO.** O salário mínimo é decisão **anual** com data. Sem calendário ela
  vira mais um controle de mesa e perde exatamente o que a torna a maior decisão fiscal do
  Executivo: ela acontece **uma vez**, e vale doze meses;
- ⭐ e é o que dá **pulso** ao jogo: hoje todo mês tem a mesma forma, e é por isso que avançar
  parece apertar um botão em vez de governar.

### C8 · O relógio: quantos meses restam

A faixa diz `1º MANDATO · ANO 1`. Não diz que faltam 41 meses. **Num jogo com fim duro, esse é o
número mais importante da tela** — é ele que decide se uma reforma de 24 meses ainda cabe. Uma
linha.

### C9 · A rua ganha seta

O dossiê pede `31% ▼ (-4%)` na aprovação por faixa de renda, e ele está certo:
`cabinetStreetHtml` imprime `${poll.good}%` **sem variação**, enquanto a faixa de vitais logo
acima tem seta nos quatro indicadores.

⭐ **E O MECANISMO É O MESMO, A CUSTO ZERO DE SAVE.** A seta dos vitais não vem de série
histórica — vem de `painted`, o estado do quadro anterior guardado em `app.mjs:537`. As linhas da
rua podem ler a mesma variável.

⚠ **Com a mesma limitação declarada que os vitais já carregam:** numa recarga `painted` volta
nulo, e **ausência não é resultado** — sem base de comparação a seta não existe, não vira zero.

---

## Grupo 10 — a leitura fica mais funda

### C10 · ⭐ A base tem duas metades: a que se compra e a que se convence

O dossiê pede um donut _"fisiológico × ideológico"_ sobre a base. ⛔ **O donut não** — o projeto
já matou o arco (513 círculos custavam 170px) e a fita, e o `meter` segmentado já existe e já
soma 100%. ⭐ **Mas a pergunta é excelente, e o jogo tem o dado desde sempre:**

`venalityEconomic` por partido, cruzado com `seats`:

| metade                               | cadeiras | fatia   |
| ------------------------------------ | -------- | ------- |
| **se compra** (venalidade ≥ 0,7)     | **364**  | **71%** |
| **não se compra** (venalidade < 0,7) | **149**  | **29%** |

Ponderada pela venalidade de cada bancada, **68% da Câmara está à venda.**

⚠ **ESSE NÚMERO RESPONDE A PERGUNTA QUE O JOGADOR MAIS FAZ E NUNCA TEVE COMO RESPONDER:**
_quantos desses me abandonam no dia em que eu parar de pagar?_ Hoje a tela mostra 436 apoios sem
dizer quantos são convicção e quantos são aluguel.

**É o B6 no atacado** — o que cada pessoa vende, somado. E os dois se sustentam: o agregado
explica por que a mesa importa; a mesa mostra quem, dentro do agregado.

### C11 · O maior gasto preso para de ser legenda estática

O dossiê quer `Maior gasto preso: Aposentadoria urbana R$ 66,7 bi` escondido atrás de hover.

⛔ **Recusado, e por precedente:** essa linha nasceu de auditoria externa que cobrou _"não há como
investigar quais leis herdadas estão sugando esse dinheiro"_, e o achado 40 já registra que
cortá-la de três para uma foi **perda de resposta, não conserto**. Além disso, informação atrás
de hover é informação ausente para quem não passa o mouse.

⚠ **MAS A QUEIXA POR TRÁS PROCEDE, e o achado 40 já a nomeia:** _"um governo que não corta
previdência vê a mesma linha por 48 meses, e aí ela vira legenda estática"_. **O conserto não é
esconder — é a linha mostrar o que MUDOU**, pela mesma regra que o cofre já usa (o comprometido
só aparece quando difere do que sobra).

---

---

## Grupo 11 — a coluna da direita, e ela levou 6

### C13 · ⭐ A NOTA É DELE, E É A MAIS BAIXA QUE UMA PEÇA DESTE JOGO JÁ RECEBEU

A Caixa de Entrada foi **7 antes da revisão e 8 depois**. A coluna da direita nunca tinha sido
avaliada, e a nota veio: **6**.

⚠ **A nota é o dado; o diagnóstico abaixo é meu, e ele sai da captura contra as quatro
referências.** Seis defeitos, e nenhum deles é "está feio" — todos são estruturais.

**1 · Quatro blocos com a mesma forma, e nenhuma hierarquia.**
Rótulo à esquerda, barra no meio, número à direita — quatro vezes seguidas. **"Quem pode
derrubar" é o bloco que decide se a partida acaba, e ele ocupa o mesmo peso visual que a nota de
rodapé do cofre.** Em Vic3 o que pode te derrubar não divide espaço igual com contabilidade.

**2 · Sete barras idênticas medindo sete coisas diferentes.**

| barra            | o que ela é de verdade        |
| ---------------- | ----------------------------- |
| A Câmara         | uma **contagem** (436 de 513) |
| Preso por lei    | uma **fração** (95%)          |
| os quatro grupos | **pressão** numa escala 0–100 |
| as três rendas   | **composição** em três cores  |

Mesma espessura, mesma cor, mesma posição. **Tipo de número diferente pede forma diferente** —
é o que separa um painel de uma planilha.

**3 · Nada é porta.**
Em Vic3, CK3 e FM **tudo na tela é clicável e leva ao detalhe**. Aqui os quatro blocos são
leitura morta: não dá para clicar num lobby, numa classe de renda, nem na Câmara. O rail é a
única navegação, e ele leva a telas, não a **coisas**.

**4 · Zero rostos, numa coluna que mede gente.**
CK3 e FM são feitos de retratos. Esta coluna mede parlamentares, quatro grupos de pressão e três
classes sociais — **três blocos de gente, nenhum rosto.** O jogo tem `sigil.mjs` e o elenco tem
sinete; a coluna não usa.

**5 · Nada se move.**
Quatro blocos, nenhuma seta, nenhuma tendência, nenhuma história. **Não há como saber o que mudou
desde o mês passado** em nenhum dos quatro. É o C9 e o C11, e é por isso que eles estão no plano.

**6 · Tudo tem a mesma voz.**
Rótulos no mesmo tamanho e cor; números no mesmo peso. **Nada grita, então nada é lido primeiro.**

### O que eu faria, na ordem

| passo | mudança                                                                         | vem de     |
| ----- | ------------------------------------------------------------------------------- | ---------- |
| 1     | **"Quem pode derrubar" domina a coluna** — os outros três encolhem              | Vic3       |
| 2     | **forma por tipo de número**: contagem, fração, pressão e composição diferentes | Vic3       |
| 3     | **movimento em tudo** — seta e variação nos quatro blocos                       | C9 · C11   |
| 4     | **tudo vira porta** — clicar num grupo abre quem ele é e o que quer             | Vic3 · CK3 |
| 5     | **rostos**, quando A6 e D1 derem cargo e nome aos quatro grupos                 | CK3 · FM   |

⚠ **E O ORÇAMENTO DE PIXEL VALE AQUI COMO PARA TODO O RESTO** (Restrição 1): a coluna é 639 de 639. Os passos 1 e 2 **redistribuem**, não acrescentam. Os passos 3 e 4 são inline. **O passo 5
só existe depois de D1.**

## ⛔ O que a PARTE C recusa do dossiê do Gabinete

| pedido                                     | por quê                                                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **unificar 86 e 68 num número só**         | medem eventos diferentes. O defeito é o verbo repetido, não o número                                            |
| **três botões de decisão na carta**        | segunda porta para jogada cujo preço só a outra tela mostra                                                     |
| **avatares nos quatro grupos da caldeira** | lobby não está no elenco: sem sinete, sem cargo, sem rosto. Com A6, quatro ministros ganham rosto — e aí sim    |
| **donut chart**                            | o `meter` já existe e já soma 100%. Seria o terceiro gráfico circular do projeto, e os dois anteriores morreram |
| **hover escondendo o maior gasto preso**   | desfaz correção pedida por auditoria (achado 40)                                                                |

---

# PARTE D — O QUE SEPARA DE VICTORIA 3, CRUSADER KINGS, DEMOCRACY E FOOTBALL MANAGER

> **A quarta parte veio de uma frase dele:** _"siga com o que pensar ser melhor pro jogo, sempre
> no sentido de se aproximar de jogos como Victoria 3, Crusader Kings, Democracy, Football
> Manager"_.
>
> As Partes A, B e C perguntam _o que o presidente faz_ e _o que a tela mostra_. **Esta pergunta
> outra coisa: por que aqueles jogos prendem, e o que aqui não prende ainda.**

## A leitura, e ela cabe numa linha por jogo

| jogo                 | o que ele faz que este ainda não faz                                     |
| -------------------- | ------------------------------------------------------------------------ |
| **Victoria 3**       | quem está NO governo determina o que dá para aprovar                     |
| **Crusader Kings**   | as pessoas agem sozinhas, e têm futuro próprio                           |
| **Democracy**        | você VÊ a corrente causal, e é por isso que aprende a jogar              |
| **Football Manager** | o mundo te interpela, e o relatório conta uma história em vez de tabular |

---

## D1 · ⭐⭐ O PRESIDENCIALISMO DE COALIZÃO — e é o maior buraco do jogo inteiro

**Hoje o jogo tem partidos com cadeiras, venalidade e memória, e o jogador compra voto a voto.**
Está certo e é insuficiente: **não é assim que o Brasil governa.** No Brasil o presidente
distribui ministérios a partidos, e o partido que tem a pasta entrega a bancada. Tirar a pasta
não deixa o partido chateado — **tira a bancada inteira**.

⚠ **E ISSO NÃO É MECÂNICA NOVA COLADA POR CIMA: É A ESTRUTURA QUE FALTA DEBAIXO DE A6.** O plano
descreve nomear e demitir como _"a segunda moeda"_. **Está pequeno.** O gabinete não é uma moeda
paralela ao dinheiro — no presidencialismo brasileiro ele é **a moeda principal**, e o dinheiro é
o troco.

**E o custo conceitual é quase zero, porque as peças já existem:**

| peça necessária       | onde ela já está                                           |
| --------------------- | ---------------------------------------------------------- |
| as pastas             | ⭐ **as oito áreas do rail JÁ SÃO os oito ministérios**    |
| quem ocupa cada pasta | `ELENCO` tem `office`, e `OFFICES` é catálogo              |
| o que o partido rende | `reach` — a fração da bancada que a pessoa de fato arrasta |
| o que ele cobra       | `venalityEconomic` e `venalityLiberty`, por partido        |
| o rancor              | `remember()` — o saldo de cada pessoa, com decaimento      |

**O que muda no jogo:**

- a base de 436 deixa de ser um número dado e passa a ser **consequência de quem está no
  governo**. Hoje ela vem do catálogo e o jogador a empurra na margem;
- ⭐ **demitir um ministro vira a decisão mais cara do jogo**, e é exatamente o que é na vida
  real. O jogador ganha o instrumento e paga o preço em bancada, na hora, visível;
- **e a Trindade ganha causa.** Hoje a ruptura política é um número que sobe. Passa a ser _"o
  partido X saiu do governo no mês 19 e levou 71 cadeiras"_ — um fato com nome, data e culpado;
- ⛔ **e continua sem muro:** governar em minoria é permitido, caríssimo, e historicamente real.

> ⚖ **Se um item só desta parte entrar, é este.** Ele é o que faz o jogo ser sobre o **Brasil** e
> não sobre um parlamento genérico — e é a diferença entre "comprar votos" e "governar".

---

## D2 · ⭐ A ELEIÇÃO — a terceira saída, e ela não é tela de vitória

**Hoje o mandato tem duas saídas**, e `turn.mjs:1994` declara o tom com todas as letras:

> _"ELE NÃO É UMA TELA DE DERROTA. A partida JÁ É um mandato de 48 meses, sem vitória e sem
> placar — cair é o mandato terminar antes, e o que muda é a DATA."_

⭐ **A decisão está certa, e a eleição não a contradiz — ela a completa.** Servir 48 meses e cair
no 41 são duas saídas; **no Brasil existe uma terceira, e é a mais comum: você se submete ao
país e ele responde.** Perder eleição não é derrota nem placar — é a mesma regra do fecho, com um
motivo a mais e outra data.

- **os dados já estão todos calculados.** `termOf` devolve aprovação de-onde-para-onde, dívida
  sobre o PIB, as oito áreas da posse ao fim, as leis escritas e os grupos que abandonaram.
  **É exatamente o material com que um país decide voto** — e hoje ele vira um relatório que
  ninguém contesta;
- **e a faixa já promete:** ela imprime `1º MANDATO · ANO 1`. O jogo anuncia um segundo mandato
  que não existe;
- ⭐ **e é isto que dá peso a tudo o mais.** Num jogo que acaba em 48 meses faça o que fizer, o
  mês 40 não decide nada. Com eleição, **cada mês do quarto ano é campanha** — e a Parte A
  inteira ganha um destinatário.

⚠ **O risco é real e tem de estar escrito:** uma eleição vira placar se ela imprimir um número
grande no fim. **Ela não pode.** O fecho continua sendo um só, no mesmo tom — o que muda é que
ele passa a ter três motivos em vez de dois, e que um deles abre um segundo mandato.

---

## D3 · ⭐ AS PESSOAS AGEM SEM VOCÊ — o que Crusader Kings faz e aqui não acontece

**O elenco deste jogo é mais rico do que parece:** cada pessoa tem posição econômica, posição em
liberdades, dois preços de venda distintos, uma **ambição**, um alcance real sobre a bancada, e
uma **memória com decaimento** do que foi prometido e do que foi pago.

⚠ **E TUDO ISSO SÓ ACONTECE QUANDO O JOGADOR ENCOSTA.** Ninguém faz nada por conta própria.
Numa partida em que o jogador não abre a mesa, o elenco inteiro fica parado por 48 meses.

**O que falta, na ordem de valor:**

1. ⭐ **a ambição vira ação.** `AMBITIONS` já diz o que cada pessoa quer. Hoje é rótulo. Uma
   pessoa cuja ambição é a pasta de Saúde deveria **cobrar** a pasta de Saúde — e ficar contra
   quando outro a receber. É carta da espécie `demand`, que já roda;
2. **relação entre elas.** Hoje cada pessoa se relaciona só com o jogador. Sem rival, sem dívida,
   sem padrinho, não existe política — existe atendimento ao balcão;
3. **futuro próprio.** Um ministro que quer ser presidente é um adversário sendo criado dentro do
   próprio governo. **É a melhor história que este jogo pode contar**, e o ADR 0003 já libera:
   toda pessoa é inventada.

---

## D4 · ⭐ A CORRENTE CAUSAL VISÍVEL — o que Democracy resolveu e ninguém copiou

**A razão de _Democracy_ ensinar a jogar sem tutorial é uma só: você vê as setas.** Aponta uma
política e o jogo mostra o que a alimenta e o que ela alimenta, com sinal e peso.

**Este jogo tem a corrente e não a mostra.** Gastar em Segurança move a capacidade, que move a
arrecadação, que move o caixa, que move o que dá para gastar no mês seguinte — e **a única
pista disso na interface é um número mudando em outra tela**.

⚠ **E OS DOIS CODINOMES PARA ISSO JÁ ESTÃO RESERVADOS E VAZIOS:** `CASCATA` (`src/domain/
propagation/`) e `DELTA` (`src/domain/graph/`) são `export {}` — nome declarado, contrato
declarado, zero implementação. **O projeto já sabia que precisava disto e parou no nome.**

- ⭐ **e a Parte 0.3 é metade do caminho.** A projeção mostra _para onde vai_; a corrente mostra
  _por quê_. Juntas são o tutorial que o ciclo 12 diz que dispensa tutorial;
- ⚠ **mas a ordem importa:** a corrente sem a projeção é um diagrama bonito. **0.3 primeiro.**

> ⚠ **E `src/domain/graph/index.mjs` tem um comentário sobre `backdrop-filter` e 31 fps que não
> tem nada a ver com DELTA** — fragmento de cemitério que sobreviveu a uma limpeza. Anotado.

---

## D5 · A ENTREVISTA COLETIVA — o que Football Manager cobra e aqui ninguém cobra

Em FM o mundo **te interpela**: antes e depois de cada jogo alguém pergunta, a resposta é
escolhida entre opções, e ela custa moral com o elenco.

**Aqui ninguém nunca pergunta nada ao presidente.** O jogo tem treze espécies de aviso e duas de
pergunta (achado 37), e nenhuma das duas vem da imprensa.

- é **carta com `choices`**, que a máquina já roda. Custo estrutural: zero;
- ⭐ **e resolve o mês 1 e o mês vazio de uma vez.** Uma coletiva não precisa de crise para
  existir — ela acontece porque o mês aconteceu;
- ⛔ **e ela não é segunda porta**, que é a recusa do C4: a resposta não move alavanca nenhuma.
  Ela move **o que as pessoas acham de você**, que é `remember()` e `SONDA` — coisa que nenhuma
  outra tela oferece.

---

## D6 · O RELATÓRIO CONTA UMA HISTÓRIA — e hoje ele tabula

O relatório de partida de FM não lista estatística: ele diz **o que virou o jogo**. O bloco "O
mês passado" tem 599px e é o mais arejado da tela do Congresso (B14) — e o que ele faz com esse
espaço é uma tabela.

- **o mês tem um fato principal**, e o motor sabe qual: o maior delta, a fervura que começou, a
  lei que passou, o grupo que abandonou. **Nada disso é escolhido e dito;**
- ⭐ **e é o mesmo material do fecho.** `termOf` já sabe destacar de-onde-para-onde num mandato.
  O mês merece o mesmo tratamento.

---

## D7 · O RAIL PROMETE DUAS TELAS QUE NÃO EXISTEM

`rail.mjs:120` declara **A Rua** e **Bastidor** como `ready: false` — desenhadas, cinzas,
desabilitadas, com um `title` explicando que estão por vir.

⚠ **É a mesma família do C12, num nível acima: a interface promete o que não existe.** Duas das
treze entradas do rail são promessa. E as duas são exatamente onde as Partes A e D moram —
**A Rua** é a opinião pública com rosto (D3, A9) e **Bastidor** é a coalizão (D1).

**Decisão a tomar, e não é de gosto:** ou elas entram no plano com dono, ou saem do rail. Uma
promessa cinza por mais um ciclo é pior que a ausência.

### ✔ DECIDIDO EM 24/08/2026 — ELAS SAÍRAM DO MENU

Palavras dele: _"tira do menu por enquanto"_. E saiu junto tudo o que só existia para elas: os
dois rótulos, a frase `ainda não existe`, os dois ícones, o parâmetro `ready` de `itemHtml` — um
parâmetro que só recebe `true` é porta aberta — e a regra `.rail__item[disabled]`, que a guarda
`orphans` **não alcança** por ser atributo e não classe.

⚠ **ELAS VOLTAM COM DONO, e o dono está escrito:** A Rua é a opinião pública com rosto (D3 e
A9); Bastidor é a coalizão (D1). Quando existirem, cada uma entra com **uma linha**.

---

## ⛔ O que a PARTE D recusa

| tentação                                | por quê                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| **árvore de tecnologia / progressão**   | Vic3 tem porque simula um século. Um mandato de 48 meses não tem o que destravar     |
| **mapa**                                | o jogo é sobre a mesa e o gabinete, não sobre território. Um mapa seria enfeite caro |
| **placar ou pontuação no fecho**        | contradiz decisão declarada em `turn.mjs:1994`, e ela está certa                     |
| **combate, guerra, exército como jogo** | o Brasil não é Vic3. "Militares e polícia" é um lobby com pressão, e isso basta      |
| **dinastia / herdeiro**                 | CK3 tem porque atravessa gerações. Aqui o horizonte é o mandato, e o sucessor é o D2 |

---

# ⛔ O QUE FICA DE FORA, E POR QUÊ

| o quê                                                | por quê                                                                                                                                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **hachura, zona bloqueada, ponteiro travado**        | menos fiel, não mais. Ver a regra ⚖                                                                                                                                                                                            |
| **três colunas no Congresso**                        | **medido: não cabe.** A lâmina tem 1.189px; a 30/40/30 as colunas teriam 325 · 444 · 325, e a bancada precisa de **1.127px**, a pessoa de 1.074, o relatório de 1.099. **Só o slider cabe**                                    |
| **`blur(24px) saturate(200%)`**                      | segundo material, com guarda. E medido: `glass-support` num painel de 630px custou **−17,9 fps**. O caminho registrado é **forma, não filtro** — aresta e tinta chapada custaram **+5,5 fps**                                  |
| **cor semântica por setor** (azul ordem, verde agro) | cor de identidade com paleta semântica. Verde é alta, vermelho é crise. Recusado três vezes                                                                                                                                    |
| **néon e pastel**                                    | _"verde neon de startup"_ foi a crítica que gerou três ciclos de conserto                                                                                                                                                      |
| **mono em valor financeiro**                         | não é defeito, é **troca de regra** — e metade já existe em `[data-numeric]`. **Decisão dele**                                                                                                                                 |
| **pautas sugeridas pela Casa Civil**                 | é a pauta pronta que o ciclo 2 matou                                                                                                                                                                                           |
| **ambição como alarme pulsante**                     | o pulso é do cerco; o traço é inerte                                                                                                                                                                                           |
| **geopolítica, BRICS, balança comercial**            | exige setor externo em CORRENTE. _"Fase 1 só o Brasil"_ segue de pé. ⚠ **Versão barata registrada:** um quinto lobby com `reads: "external"` lendo um índice ambiental — é entrada de catálogo, não subsistema                 |
| **greve por categoria profissional**                 | `research/03` já recusou o desenho: SONDA segmenta por **renda**, o efeito viria por CASCATA e TEMPORAL que não rodam, e _"uma greve legítima não é um defeito do país"_. O buraco é real (**achado 20**); o desenho não pluga |
| **reforma ministerial**                              | as oito áreas são a espinha do catálogo — mexer nelas atinge MALHA, rail, orçamento e save de uma vez. **Candidata ao ciclo 14**                                                                                               |
| **gerar HTML e CSS com dados de exemplo**            | as telas são **funções puras** que recebem dado e devolvem string; não existe HTML com conteúdo. E "dados de exemplo" é o **número inventado** que o projeto recusa                                                            |

---

# ✔ OS ACHADOS DO PROJETO QUE ESTE PLANO FECHA

| achado | o quê                                          | fechado por                    |
| ------ | ---------------------------------------------- | ------------------------------ |
| **8**  | `bills.mjs` é catálogo morto que ainda respira | A1                             |
| **16** | quatro das cinco ambições são inertes          | A6 · A8 · A10 · B16            |
| **20** | a rua precifica voto e mais nada               | A9 (metade)                    |
| **26** | a vinculação incide sobre receita bruta        | A10                            |
| **32** | `mandatoryGrowth` é média aplicada a tudo      | A1 · A2                        |
| **36** | a catraca do rateio nunca devolve              | A3                             |
| **37** | a única carta que pergunta exige texto grande  | A7                             |
| **47** | quatro de cinco indicadores não se movem       | 0.3 torna visível; não resolve |

---

# ⚠ RISCOS E DECISÕES ABERTAS

### ✔ AS DECISÕES DE OLHO FORAM DELEGADAS, e as minhas ficam registradas aqui

> _"De resto você deve seguir com o que pensar ser melhor pro jogo, sempre no sentido de se
> aproximar de jogos como Victoria 3, Crusader Kings, Democracy, Football Manager."_

**Delegar não é apagar a decisão — é mudar quem assina.** As quatro ficam escritas com a
resposta, para que ele possa reverter qualquer uma vendo o motivo:

1. **dinheiro em mono → NÃO, e sim `font-variant-numeric: tabular-nums`.** O problema real é
   dígito que não alinha em coluna, e a fonte tabular resolve **sem** abrir um segundo tipo de
   letra na tela. Trocar de família custaria a escala inteira já medida (20 → 14 combinações);
2. **a identidade do Congresso → adiada de propósito, e o B8 vem antes.** A tela onde o jogo se
   decide **não tem cabeçalho** e a de consulta tem. Dar personalidade a uma tela sem cabeça é
   decorar antes de estruturar. Julgar de novo depois do B8, com captura;
3. **a densidade do relatório → apertar, e o espaço vai para "Em pauta".** É a mesma regra do
   C13: **o que decide domina; o que consulta encolhe.** Hoje é o contrário — 599px de consulta
   contra 190px de tramitação;
4. **a taxa do A7 → não é constante, é função do governo.** Um Congresso propõe quando o
   Executivo está fraco. Amarrar a taxa à base de apoio é mais fiel **e** dispensa calibrar um
   número inventado — que é a regra da casa.

### ⭐ E AS DUAS DECISÕES TÉCNICAS TAMBÉM FORAM DELEGADAS

- **o save → opção 3 agora, opção 2 antes da Parte A.** Enquanto ninguém termina um mandato,
  recusar não custa nada; quando a Parte A começar, o save vira `(semente, ordens)` e o mandato
  se refaz em 10,3ms. ⚠ **Reversível**: é a leitura de hoje, e o custo de trocar antes da Parte A
  é zero;
- **a altura do C10 → a barra que já existe vira a divisão.** O cartão "A Câmara" já tem uma
  barra em `Apoiam o governo 436 de 513`; ela passa a mostrar **duas cores** — quem se compra e
  quem se convence. **Custo de altura: zero**, e é melhor do que uma linha nova, porque põe a
  divisão exatamente em cima do número que ela explica.

### Riscos que precisam de medição antes de fechar

| risco                                         | item |
| --------------------------------------------- | ---- |
| o salário mínimo vira a alavanca dominante    | A1   |
| o cargo domina a emenda, por não custar caixa | A6   |
| o Congresso propondo afoga a bandeja          | A7   |
| a projeção vira solucionador                  | 0.3  |
| a projeção prevê votação que não aconteceu    | 0.3  |

### ⚠ O que este plano NÃO resolve, declarado

- **a dívida continua terminando em ~90% faça o que fizer** (achado 49);
- **a velocidade do país continua sendo consequência aritmética**, e ninguém a escolheu. O
  achado 53 segue de pé: **nada aqui gira `decay` nem `yield` de área.** A Parte 0.3 é o
  instrumento que finalmente torna essa escolha visível — com a curva na tela.

---

# 🚧 AS TRÊS RESTRIÇÕES — elas valem para os 49 itens

> Um plano de 49 itens sem restrição declarada é uma lista de desejos. Estas três não são
> preferências: **duas foram medidas hoje e a terceira está escrita no código.**

---

## RESTRIÇÃO 1 · O Gabinete não tem um pixel livre

Medido em `tmp/cabe-no-gabinete.mjs`, a 1440×980, em regime normal (mês 9):

```
página 980px · janela 980px · folga 0px

lead (Caixa de Entrada)   659×639px   conteúdo 639px   folga  0px
A Câmara                  432×107px   conteúdo  83px   folga 24px  ← padding, não espaço
Dinheiro do mês           432×179px   conteúdo 155px   folga 24px  ← padding, não espaço
Quem pode derrubar        432×179px   conteúdo 155px   folga 24px  ← padding, não espaço
Aprovação por renda       432×131px   conteúdo 131px   folga  0px
```

A coluna lateral soma **596px de cartão + 43px de vão = 639px exatos**. O cartão da bandeja
fecha em 639 de 639. **Não há folga em lugar nenhum.**

⚠ **E ELA JÁ CRESCEU ATÉ O TETO SOZINHA:** no mês 1 a coluna mede 615px; no mês 9, 639. Os
24px foram consumidos quando o cofre ganhou uma linha. **O próximo item que crescer não tem
para onde ir** — ele cai no C12: a coluna engole em silêncio.

### O orçamento, item por item

| item        | o que acrescenta                      | altura            | de onde sai                                       |
| ----------- | ------------------------------------- | ----------------- | ------------------------------------------------- |
| **C2**      | **remove** a linha duplicada da posse | **−1 linha**      | ⭐ **devolve espaço** — é o único que dá          |
| **C1**      | segunda marca na barra que já existe  | 0px               | inline                                            |
| **C3**      | a porcentagem ao lado de 4 rótulos    | 0px               | inline, no rótulo                                 |
| **C9**      | seta ao lado de 3 números             | 0px               | inline                                            |
| **C11**     | a linha muda de texto, não de tamanho | 0px               | —                                                 |
| **C7 · C8** | prazo do mês e meses restantes        | 0px no tabuleiro  | ⭐ **vão para a faixa do topo**, que já tem o mês |
| **C5 · C6** | a posse vira pergunta                 | dentro da bandeja | o documento já ocupa 637 de 639 — ver abaixo      |
| **C10**     | um `meter` dentro de "A Câmara"       | **~24px**         | ⛔ **não existem 24px.** Depende de C12           |

⚠ **C5/C6 têm uma folga que os outros não têm:** `.tray__list` também rola por dentro
(`45-screen-cabinet.css:239`), e ali a rolagem é **desenho declarado** — o índice de cartas
cresce a cada mês e sempre foi para rolar. Um documento mais longo cabe. **A bandeja é a única
peça do Gabinete com espaço, e é onde a agência mora.** Não é coincidência.

### A regra que sai daí

> ### ⚖ Nenhum item do Gabinete entra sem dizer de onde vem a altura que ele ocupa.
>
> E "a coluna rola" **não é resposta** — é o C12.

---

## RESTRIÇÃO 2 · O que significa "pronto"

**Esta é a restrição que fecha o buraco que originou toda a limpeza.** O diagnóstico foi:
motor e tela têm o mesmo tamanho (8.007 contra 9.601 linhas) e tinham **207 provas contra 29**.
Seis sessões de desenho caíram na metade sem portão.

**Um plano de 49 itens sem critério de aceitação repete isso em escala maior.**

### O mínimo, e ele vale para os 49

1. `npm run validate` verde — 12 guardas · 54 provas sintéticas · 253 provas · o passeio;
2. ⚠ **abrir a captura em `captures/passeio/`.** O portão não sabe olhar, e três defeitos já
   atravessaram tipo, guarda e cem provas para morrer na imagem.

### ⭐ E a regra dura, que é a lição inteira do projeto

> ### ⚖ Nenhum item entra sem que o portão SAIBA VER o defeito que ele conserta.
>
> Se a checagem que pegaria a regressão não existe, **ela nasce primeiro** — no mesmo passo, e
> antes da mudança. É o C12 em forma de regra: uma peça nova protegida por uma checagem cega é
> uma peça sem portão, e este projeto já sabe quanto isso custa.

### Onde o mínimo NÃO basta

| item(ns)         | por quê                                                            | o que nasce junto                                                                      |
| ---------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **C12**          | o passeio é cego no eixo Y e roda numa janela só                   | ⭐ `checkClipped` ganha `overflowY`; o passeio ganha **uma segunda janela** (1440×900) |
| **C6**           | **quebra asserção existente** — `#main input, #main select === 0`  | a asserção vira "só a carta da posse pergunta", com a razão em prosa                   |
| **C3**           | o valor sai do `aria-label`, e ele está lá por acessibilidade      | o `aria-label` **continua**. Prova: os dois textos existem, não um no lugar do outro   |
| **C10**          | número novo perto da tela = risco de a tela refazer conta do motor | a divisão sai da camada de aplicação, não do `.mjs` de tela. `boundaries` cobre        |
| **C7**           | primeiro item que cria **data** no jogo                            | prova de que o calendário é função pura de `month` — sem relógio, sem `Date.now`       |
| **C5**           | primeiro campo novo no estado desde a v18                          | suíte `save.mjs` (ida e volta idêntica) + `schema.mjs` + ver Restrição 3               |
| **0.1**          | muda classificação de catálogo, e catálogo move a série            | `npm run simulate` antes e depois, **com as duas séries comparadas no handoff**        |
| **A1 · A2 · A3** | mexem em calibragem fiscal — a família do achado do primário       | idem, e a verificação explícita de que o primário ainda pode ser negativo              |
| **B1–B5**        | geometria num bloco de 108px que já estourou antes                 | `checkOverflow` + `checkClipped` + captura aberta, sem exceção                         |
| **0.3**          | 5,3ms por repintura, e o arrasto repinta a cada movimento          | medição de quadro. **Verde não basta — o número tem de sair**                          |

### O que NÃO é critério de aceitação

- ⛔ **"o teste passou depois que eu mudei o número do catálogo".** Calibragem não se mexe para
  destravar prova. Número errado é achado, e vai para o handoff;
- ⛔ **"removi a guarda que reclamava".** Elas existem por defeito medido;
- ⛔ **"o `npm run screen` deu bem".** Ele oscila ~20 fps entre rodadas e está fora do portão.
  Um número solto dele não decide nada.

---

## RESTRIÇÃO 3 · O save recusa, e o plano tem dez motivos para quebrá-lo

`SCHEMA_VERSION = 18` (`src/state/state.mjs:109`), e `deserialize` **recusa** versão diferente
em vez de converter (`src/state/save.mjs:44`).

⚠ **E A RECUSA ESTÁ CERTA — a razão já está escrita no arquivo**, e é boa demais para se
reabrir: _"ausência de norma é ausência de restrição: o save abriria com a Constituição inteira
revogada, que é um país válido e portanto indistinguível de um save quebrado."_ Um conversor
que preenche campo faltante com padrão produz **um país plausível e errado** — o pior defeito
possível num jogo cujo valor inteiro é o número ter motor atrás.

### O que este plano custa em versões de save

| parte       | itens que mexem no estado                        | bumps      |
| ----------- | ------------------------------------------------ | ---------- |
| **PARTE 0** | nenhum — 0.1 é catálogo, 0.3 é descartado        | **0**      |
| **PARTE B** | nenhum — os dezesseis são leitura                | **0**      |
| **PARTE C** | só **C5** (os três compromissos)                 | **1**      |
| **PARTE A** | A1 · A2 · A3 · A4 · A5 · A6 · A7 · A8 · A9 · A10 | **até 10** |

⭐ **O achado é esse: 32 dos 49 itens custam ZERO no save.** Toda a legibilidade — a Parte B
inteira e onze doze avos da Parte C — não toca no estado. **Todo o custo está na Parte A**, e
está concentrado.

### A decisão, e ela é dele

- **Opção 1 — bumpar por onda.** As quatro ondas da Parte A viram **quatro** versões em vez de
  dez. Uma partida em curso sobrevive dentro de uma onda e morre entre ondas. Barato, e é o que
  eu faria hoje;
- **Opção 2 — ⭐ o save vira semente + ordens, e o mandato se refaz.** A doutrina da casa já
  diz que _"o mandato inteiro se refaz da semente"_, e a projeção mediu o custo: **48 meses
  custam 10,3ms.** Um save que guarda `(seed, ordens de cada mês)` **tolera mudança de estado
  por construção** — só quebra se as ORDENS mudarem de forma.
  - ⚠ **e a troca é honesta, não gratuita:** o save de estado quebra quando o **esquema** muda;
    o save de repetição quebra quando a **calibragem** muda. Este plano tem dez mudanças de
    esquema e **recusa explicitamente mexer em calibragem** (achado 53). Para este plano, a
    repetição é o lado certo da troca — e para um jogo já lançado, seria o errado;
- **Opção 3 — não decidir agora.** Enquanto ninguém joga um mandato inteiro, recusar não custa
  nada. ⚠ **Mas o custo aparece exatamente quando o jogo ficar bom o bastante para alguém
  querer terminar uma partida** — que é o objetivo deste plano.

> ⚖ **Isto não é escolha de arquitetura, é escolha de produto:** _uma partida em curso pode
> morrer quando o jogo melhora?_ Enquanto a resposta for sim, a Opção 3 basta.

---

# 🔢 A ORDEM QUE EU EXECUTARIA

| passo  | o quê                          | por quê                                                             |
| ------ | ------------------------------ | ------------------------------------------------------------------- |
| **0**  | ✔ **C12 · D7**                 | ✔ C12 FEITO. **D7 é decisão, não obra:** as duas telas cinzas       |
| **1**  | **0.1 · 0.2 · C1 · C2 · C3**   | consertos pequenos e independentes, e três são defeito              |
| **2**  | **Grupo 1 da Parte B** (B1–B5) | cinco achados num bloco de 108px — e o passo 0 é quem os protege    |
| **3**  | **C8 · C9 · C10 · C11 · C13**  | a tela que abre o jogo para de mentir — e a coluna que levou 6      |
| **4**  | **0.3 · B10 · C7 · D4**        | as quatro lentes: projeção, linha do tempo, calendário e a corrente |
| **5**  | **C5 · C6**                    | a posse vira pergunta, e o fecho ganha critério                     |
| **6**  | **A1 · A2 · A3**               | 61% do orçamento vira decisão — e A1 precisa de C7                  |
| **7**  | **A4 · A5**                    | os instrumentos baratos, e A4 já tem máquina                        |
| **8**  | **Grupos 2–5 da Parte B**      | a tela de decisão fica legível antes de ganhar poder novo           |
| **9**  | ⭐ **D1 + A6**                 | **a coalizão, e A6 é a metade de cima dela.** O maior item do plano |
| **10** | **D3 · A8**                    | as pessoas agem sozinhas; e o preço da janela de Overton            |
| **11** | **A7 · D6**                    | o Congresso ganha iniciativa; o relatório passa a contar história   |
| **12** | **A9 · A10 · D5**              | o mundo inteiro ganha voz — imprensa, governadores e a coletiva     |
| **13** | ⭐ **D2**                      | **a eleição.** Ela é o fecho de tudo, e por isso é a última         |

⚠ **Os passos 1 a 8 quase não abrem motor** (C7 e D4 são as exceções, e são médias). Eles usam
`ESTRATO`, `MALHA`, `ECLUSA`, `CORRENTE` e `LASTRO` como estão — e boa parte apenas **liga
canais já construídos e mortos**.

⭐ **E a Parte C entra CEDO de propósito.** Ela é a tela que abre o jogo: enquanto ela se
contradiz em quatro lugares, todo número que o resto do plano acrescentar herda a desconfiança.

⛔ **O passo 0 não é escolha.** Ele é o único item deste plano que conserta algo que está
quebrado na tela publicada — e a metade dele que dá o eixo Y ao passeio é **pré-requisito de
C10 e do Grupo 1 inteiro**. Sem ela, os itens de geometria entram protegidos por uma checagem
que não enxerga o defeito que eles podem causar.
