# O GLORIOSO — o plano mestre

> **Nomeado por ele.** O norte foi dito com estas palavras:
>
> > _"O que eu realmente quero no fim do dia é um jogo extremamente realista. Se na vida
> > real um presidente e seu governo pode fazer tal coisa, no meu jogo o jogador de alguma
> > forma também vai conseguir fazer. Liberdade, realismo, fidelidade. Brasil real."_
>
> ⚠ **PLANO. NADA COMEÇADO, NADA APROVADO.** Nenhuma linha de código se escreve a partir
> daqui sem a aprovação dele.

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

| origem                         | o que ela produziu                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| **medição minha**              | a velocidade das áreas, a altura das telas, o custo da projeção, os três canais mortos |
| **dois dossiês do Gemini**     | a segunda moeda, a MP, a linha do tempo, e a auditoria da tela do Congresso            |
| **achados do próprio projeto** | 8, 16, 20, 26, 32, 36, 37, 47 — abertos há sessões e fechados aqui                     |

⚠ **E os dossiês foram lidos CONTRA o código, não aceitos.** O padrão registrado em cinco
auditorias externas se repetiu: **elas leem bem a tela e inferem mal o mecanismo.** Cada item
abaixo diz o que o código de fato faz hoje.

### Os dois eixos

Este plano tem duas metades, e elas atacam problemas diferentes:

- **PARTE A — O CARGO:** o que um presidente **faz** e o jogo não deixa fazer. É fidelidade;
- **PARTE B — A TELA:** o que o motor **já sabe** e a tela não mostra. É legibilidade.

E uma **PARTE 0**, que não é nem uma nem outra: ela é o que precisa existir antes, porque
**fidelidade que o jogador não percebe não é fidelidade.**

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

---

## ⚠ TRÊS CANAIS MORTOS — e são a prova de que metade disto já está construída

Achados verificando os dossiês contra o código. Nenhum falha, nenhum acusa, e os três são a
mesma família: **o motor sabe e nada consome.**

| canal                  | quem escreve                            | quem lê           |
| ---------------------- | --------------------------------------- | ----------------- |
| `data-guard`           | `area.mjs`, em toda linha de lei        | **ninguém**       |
| `taxDelta`             | `economy.mjs`, com `taxDrag: 0,35`      | **nunca dispara** |
| `desoneracao-setorial` | `programs.mjs`, classificada como gasto | **está errada**   |

- **`data-guard`** carrega `constitution`, `law` ou `none` em cada linha, e nenhuma folha
  pinta. O jogo **sabe** quais pisos são constitucionais e mostra todos com a mesma cor;
- **`taxDelta`** é `taxLoad − baseTaxLoad`, e `turn.mjs` passa **a mesma constante nas duas
  pontas**. O arrasto tributário — calibrado, com fonte — **jamais roda**. A economia já sabe
  reagir a imposto; nada no jogo pode mexer em imposto;
- **a desoneração** consome discricionário como se fosse obra. É **renúncia de receita**:
  ninguém gasta, a Fazenda deixa de arrecadar.

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

### Decisões que são DELE, e não minhas

1. **mono em dinheiro** — troca de regra tipográfica, não conserto;
2. **a identidade visual do Congresso** — hoje a única marca da tela onde o jogo se decide é
   um **fio bordô de 2px**. É pouco. Mas _qual_ forma é decisão de olho;
3. **a densidade do relatório** — quanto apertar;
4. **a taxa de A7** — de quanto em quanto tempo o Congresso propõe.

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

# 🔢 A ORDEM QUE EU EXECUTARIA

| passo  | o quê                          | por quê                                                   |
| ------ | ------------------------------ | --------------------------------------------------------- |
| **1**  | **0.1 · 0.2**                  | consertos pequenos e independentes, e um deles é defeito  |
| **2**  | **Grupo 1 da Parte B** (B1–B5) | cinco achados num bloco de 108px, numa tacada             |
| **3**  | **0.3 · B10**                  | a projeção e a linha do tempo — as duas lentes            |
| **4**  | **A1 · A2 · A3**               | 61% do orçamento vira decisão                             |
| **5**  | **A4 · A5**                    | os instrumentos baratos, e A4 já tem máquina              |
| **6**  | **Grupos 2–5 da Parte B**      | a tela de decisão fica legível antes de ganhar poder novo |
| **7**  | **A6**                         | a segunda moeda — e ela acende quatro ambições            |
| **8**  | **A8**                         | o preço da janela de Overton                              |
| **9**  | **A7**                         | o Congresso ganha iniciativa                              |
| **10** | **A9 · A10**                   | o mundo inteiro ganha voz                                 |

⚠ **Os passos 1 a 6 não abrem motor nenhum.** Eles usam `ESTRATO`, `MALHA`, `ECLUSA`,
`CORRENTE` e `LASTRO` como estão — e boa parte apenas **liga canais já construídos e mortos**.
