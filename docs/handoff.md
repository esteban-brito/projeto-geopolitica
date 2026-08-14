# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa,
> leia este arquivo e depois `docs/standards.md`. O nome deste arquivo é estável
> de propósito: ponteiro com data envelhece e obriga a mover arquivo.

## Estado em 14/08/2026

Sétima sessão. **O orçamento é o jogo, a economia tem preço, o país tem placar, e
a lei virou alavanca.** O [ciclo 2](cycles/02-tudo-e-uma-alavanca.md) aposentou o
catálogo de pautas prontas — o presidente escreve o orçamento programa a programa
e a pauta é **derivada** do que ele moveu. O
[ciclo 3](cycles/03-a-lei-vira-alavanca.md) fechou quase inteiro: a CORRENTE
existe, Finanças mostra o que ela faz, a Produção virou duas áreas e as faixas
saíram do catálogo para o estado.

> ## ⚠ O NORTE MUDOU no fim desta sessão — leia o ciclo 4 antes de retomar
>
> [`cycles/04-a-republica-responde.md`](cycles/04-a-republica-responde.md) é o
> plano acordado, e ele **reformula o jogo**. Três coisas chegaram na mesma
> sessão e viraram uma só:
>
> - **a lei vira texto** — gramática formal executável, com autor, tramitação,
>   vigência e revogação, no lugar de faixas que só se movem;
> - **a república ganha gente** — Congresso com pessoas, imprensa, STF,
>   governadores e mercado. Todas **fictícias**, com arquétipo reconhecível e
>   inspiração real: o mundo é real, as pessoas são inventadas;
> - **o presidente pode cair** — impeachment, renúncia negociada e ruptura
>   institucional. Sem derrota possível, "tudo tem preço" era só aritmética.
>
> A interface entra junto: sai o rail duplo com a Mesa, entra o **Gabinete** —
> barra superior fixa, sidebar por poderes, e um dashboard cuja peça central é a
> **Caixa de Entrada**, que é por onde o mundo passa a falar com o presidente.
>
> **As nove decisões abertas foram respondidas.** Os motores ficam; o que se refaz
> é a camada de cima. O resto do ciclo 3 segue suspenso.
>
> **As Partes 6 (SONDA) e 10a (a casca do Gabinete) estão feitas** — ver abaixo.
> A próxima é a gramática, depois o elenco, e só então a Caixa de Entrada.

| verificação        | estado                                                 |
| ------------------ | ------------------------------------------------------ |
| `npm run validate` | **verde de ponta a ponta**                             |
| `npm run check`    | 9 guardas · 36 provas sintéticas · 97 arquivos · verde |
| `npm test`         | **152 propriedades** · verde (eram 105)                |
| `npm run simulate` | mandato de 48 meses, **cinco** políticas-sonda         |
| `npm run walk`     | verde — a tela usada como se joga, desktop e celular   |
| `npm run screen`   | **não rodado desde a quinta sessão** — ver achado 4    |
| CI                 | GitHub Actions rodando `npm run validate` a cada push  |

⚠ **Nada disto está commitado.** São 32 arquivos modificados e 13 novos na árvore
de trabalho, no branch `acoplamento-e-simulador`, acumulados em duas sessões.

## O que a sexta sessão fez — o ciclo 2, e ele mudou a natureza do jogo

**Some o catálogo de pautas. Entra a alavanca.** O responsável usou a tela e
recusou o desenho com uma frase que é o diagnóstico inteiro — _"pauta pronta é uma
bosta, onde tem criatividade nisso e liberdade?"_. Um menu de seis pautas responde
"qual dessas você quer?", e a pergunta do cargo é "quanto de cada coisa o país vai
ter?".

**`src/data/programs.mjs` — programas com números reais e
datados: RGPS R$ 982,5 bi, pessoal R$ 398,1 bi, piso da saúde R$ 231 bi, piso da
educação R$ 114,8 bi (PLOA 2025, CF art. 198 e 212). O catálogo deixou de ser
"ficção com inspiração na realidade": o que segue ficção é o que o **modelo faz**
com as rubricas.

**`src/data/rules.mjs` — a segunda família de alavancas.** Propriedade de estatal
e poder do Executivo: elas não custam dinheiro, mudam **como os motores
calculam**. Privatizar paga adiantado (receita de venda), apaga o dividendo para
sempre e tira folha da União — e a armadilha é aritmética do LASTRO, não um evento
escrito.

**`src/application/agenda.mjs` — o rito vira consequência.** `compose` lê o
orçamento escrito contra o vigente e devolve a proposta: movimento dentro da faixa
é caneta e não vai a plenário; furar um piso de `law` é lei; furar um de
`constitution` é emenda. **O rito mais exigente manda no pacote inteiro** — é o
logrolling existindo sem ninguém escrever "logrolling".

**A posição ideológica é sombra, e não controle.** O jogador nunca arrasta um
cursor no plano `econômico × liberdades`: ele mexe em leitos e alíquotas, e a
posição é calculada do que ele moveu. **Cortar espelha** — reduzir um programa de
esquerda é ato de direita, e nenhuma linha diz isso.

**A tela "O Estado"** nasceu para as alavancas de regra, e a área ganhou o
orçamento granular: um controle por programa, com a unidade do mundo ao lado
("66 · leitos, UTIs e cirurgias contratadas") e a linha tingida pelo rito quando o
controle atravessa o piso.

## O que a sétima sessão fez — o ciclo 3, Partes 5 e 4

**CORRENTE (`src/domain/economy/`) — a economia que dá preço à alíquota.** Quatro
equações, e são as que qualquer banco central usa para conversar consigo mesmo:
hiato, Phillips, Taylor, Okun. Mais população com crescimento, sem a qual não
existe PIB per capita.

Duas correções que a própria simulação cobrou, e as duas estão na prosa do motor:

- **o hiato tem de ser medido em termos reais.** Comparar PIB nominal com
  potencial real fazia o hiato medir inflação acumulada em vez de aquecimento, e a
  economia fugia sozinha: 1% no mês 6 virava 7,6% no mês 24, com o juro
  perseguindo em 20% ao ano e ninguém tendo feito nada;
- **o estoque inteiro paga juro, e não só a parte pós-fixada.** A âncora pública
  (R$ 40 bi por ponto de Selic) mede a **sensibilidade**, não o custo total. Sem
  `legacyRate`, a dívida crescia menos que o PIB nominal e o mandato terminava com
  a razão caindo de 78% para 55% sem o jogador fazer nada.

**Finanças (`src/ui/screens/finance.mjs`) — o placar, e a única tela sem um
controle.** Dezenove linhas em quatro blocos, e a ausência de controle é a
informação principal: por isso ela tem forma de razão contábil e não de pastilha —
sem raio, sem hover, sem transição. É também a única tela densa do projeto, porque
densidade só é ruído onde há decisão.

**`ledger` (`src/application/turn.mjs`)** é o que impede o painel de inventar
número: ele faz a conta do turno — empenho honrado, venda de estatal abatida, juro
sobre o estoque —, e `tests/suites/turn.mjs` prova que a dívida bruta que o painel
mostra é exatamente com quanto o mês seguinte começa. Mesma doutrina de
`settlement`: **a tela pergunta ao motor, não refaz a conta**.

**Três defeitos que só a tela real mostrou** (a captura do passeio pegou os três):

- a escada desenhava inflação (0,042) e juro (0,105) na régua do índice de área, 0
  a 100 — as duas ficavam no degrau do chão **para sempre**, e a coluna afirmava
  que nada nunca acontece. `sparkline` passou a receber a régua por parâmetro;
- `R$ 12227,1 bi` ao lado de `R$ 33,5 bi`: `money` virou para trilhão, com uma casa
  a mais para a troca de unidade não custar precisão;
- linhas em vermelho dizendo `· 0` — o tom lia o valor cheio (−0,4) e o texto lia o
  arredondado. Onde a tela mostra zero, ela mostra zero nas duas linguagens.

**`tests/suites/state-reducer.mjs` estava com 18 erros de `tsc`** desde que a série
entrou no estado: o gerador de estados e a ação sintética não acompanharam. `npm
run types` estava vermelho antes de qualquer mudança desta sessão.

## SONDA — a rua existe, e ela decide votação

Primeira parte do ciclo 4, feita em 14/08/2026. A aprovação esteve **fora da tela
por três sessões** com a razão escrita no entrypoint — "quem a produz é SONDA, que
não existe" —, e voltou porque a condição foi cumprida.

- `src/data/opinion.mjs` — três segmentos por renda com fatias reais (42/38/20) e
  pesos declarados como julgamento. O que muda entre eles é **para onde vai a
  atenção**: carestia domina embaixo, emprego no meio, economia em cima;
- `src/domain/opinion/index.mjs` — satisfação como estoque com inércia, queda três
  vezes mais rápida que a subida, desgaste do cargo por mês, defasagem de dois
  meses lida da série que já existia;
- **o acoplamento com ECLUSA**: `whipCount` recebe a aprovação e desloca a
  resistência. Governo popular compra voto mais barato. Sem isso a pesquisa seria
  enfeite.

Duas calibragens que a medição cobrou: as âncoras foram apertadas (com carestia
neutra em 6% ao ano o país de abertura ficava satisfeito por herança), e a escala
de pesquisa passou de 1,35 para 1,8 — a primeira captura mostrou 23/19/58, e um
"regular" de 19% denuncia o número, porque pesquisa nenhuma tem tão pouca gente em
cima do muro.

O que a série mostra hoje: um governo parado fica em ~21/42/37 o mandato inteiro;
um que corta tudo ao mínimo legal termina em **7/31/62**.

## O Gabinete — a casca nova

Segunda parte do ciclo 4, feita em 14/08/2026. Saiu o rail duplo; entraram:

- **a barra superior** — data, quatro sinais vitais com tendência (PIB, inflação,
  aprovação, base) e o botão de avançar. Ela absorveu o rail da direita inteiro, e
  só pôde nascer agora: com a aprovação sem motor, um quarto do conteúdo dela
  seria inventado;
- **a sidebar por poderes** — Gabinete, Congresso & Leis, Finanças, Ministérios
  (as oito áreas um nível abaixo), O Estado, e A Rua e Bastidor **desligados**
  dizendo que estão;
- **o Gabinete** — quatro cartões: a Caixa de Entrada com a espera declarada, o
  arco do plenário, o cofre da União e o termômetro da rua por classe;
- **a Mesa morreu.** A negociação virou a tela Congresso & Leis; o resumo do mês
  virou o Gabinete. Era essa mistura que fazia quem abria o jogo cair no meio de
  uma decisão sem antes saber como o país estava.

⚠ **A tela de cartões é a exceção declarada** à regra de uma lâmina por tela: aqui
os quatro assuntos não têm relação entre si, e nas outras telas as linhas disputam
a mesma bolsa. Os cartões não são vidro — a lâmina é da tela.

Duas correções que a captura cobrou: o cofre mostrava **"R$ 0,0 bi livre no mês"**
na abertura (o número estava certo — o orçamento herdado consome tudo —, e a
leitura, errada), e a partida abria com **14% de aprovação**, que é número de fim
de mandato ruim e não de governo recém-eleito. A lua de mel entrou no catálogo: a
abertura dá 44%, e um governo parado termina o primeiro ano em 24%.

## O ciclo 3, e o que ainda falta dele

Feito na sétima sessão: **Parte 5 (CORRENTE)** · **Parte 4 (Finanças)** ·
**Produção virou duas áreas** · **Parte 1 (as faixas viraram estado)** ·
**Parte 2 (a aba de legislação)**. Ficaram de fora a **Parte 3 — Fazenda vira
impostos** e a **Parte 6 — o rename**, e as duas estão **suspensas de propósito**:
a cláusula de tributo do ciclo 4 absorve a primeira por inteiro, e fazer as duas
agora seria escrever a mesma coisa duas vezes.

**Produção virou Agricultura e Indústria e Infraestrutura**, e o corte não é
técnico: a bancada ruralista é um bloco real no Congresso, e enquanto agro e
indústria dividiam a mesma tela, o modelo não conseguia representar um governo que
agrada um e aperta o outro. Os cinco programas viraram doze, a soma das forças foi
mantida em 0,20 — dividir uma área em duas não pode aumentar o efeito dela sobre a
receita —, e `CAPACITY_TARGET` passou a apontar para a indústria.

**A lei virou alavanca.** `state.bands` guarda a faixa `[piso, teto]` de cada
alavanca; o catálogo passou a declarar a faixa **de abertura**, e a guarda continua
imutável, porque ela é a natureza da norma e não o conteúdo dela. `compose` compara
contra o estado e aceita movimento de faixa e de nível **no mesmo texto** — e aí
aparece a jogada que não existia: derrubar o piso da saúde e baixar o gasto na
mesma emenda, com a lei contendo a própria autorização.

Os três verbos do pedido não viraram três botões: **alterar** é mover o controle,
**criar** é tirá-lo do zero, **excluir** é levá-lo de volta ao zero. Mexer numa
faixa custa, no mínimo, uma lei — inclusive onde não havia lei nenhuma, porque
plantar uma vinculação onde não existia é criar uma.

`schemaVersion` foi de 8 a **10** em duas paradas, e nenhuma delas converte: um
save antigo não sabe repartir a capacidade da Produção entre lavoura e fábrica, e
não sabe qual reforma aquele mandato já tinha aprovado.

## Achados abertos — o que EU veria primeiro na próxima sessão

**1. O país se desendivida sozinho, e cortar tudo é o que faz a dívida subir.**
Medido nesta sessão, com a CORRENTE já ligada:

| política   | o que ela faz                | dívida/PIB em 48 meses |
| ---------- | ---------------------------- | ---------------------- |
| `herdado`  | não toca em nada             | 78,0% → **68,4%**      |
| `agenda`   | reforma o que cabe           | 78,0% → 70,4%          |
| `base`     | só mantém a máquina          | 78,0% → 70,7%          |
| `promessa` | promete verba cheia todo mês | 78,0% → 72,2%          |
| `piso`     | tudo no mínimo legal         | 78,0% → **82,3%**      |

O presidente ausente termina com a melhor dívida do quadro, e o governo que corta
tudo termina com a pior. Isso é o inverso do mundo, e a causa está medida: a
receita chega a **R$ 2.653 bi** contra os R$ 2.400 bi que `taxLoad × PIB` declara,
porque o fator de arrecadação da MALHA e o dividendo das estatais a inflam ~10%.
Contra uma obrigatória de R$ 2.188 bi, sobra um **superávit primário estrutural de
~2,5% do PIB** que o Brasil não tem. O arcabouço segura o gasto em R$ 314 bi/ano,
mas o caixa livre é R$ 465 bi — quase o triplo dos R$ 176 bi que `fiscal.mjs`
declara como discricionário. **É recalibragem, e ela precisa ser decidida e não
descoberta.**

**2. O rateio corta desde o mês 3, em todas as cinco políticas.** "48 meses com
corte — a partir de mar · 2027" aparece igual em todas, inclusive na que não
promete nada a ninguém. A configuração herdada custa mais do que o teto abre, e
isso já foi declarado como a armadilha funcionando — mas um corte que nunca some,
em nenhuma política, deixa de ser armadilha e vira constante.

**3. O contingenciamento nunca dispara** (0 meses em 48, nas cinco políticas). O
gatilho existe e é provado em teste com catálogo apertado; com o catálogo real ele
não é alcançável. Ou o desenho aceita isso, ou a calibragem precisa aproximar o
teto da obrigatória.

**4. `npm run screen` não roda desde a quinta sessão.** Sete telas viraram onze
desde então — O Estado, Finanças, Agricultura e Indústria nasceram sem o custo de
material medido.

**5. `orphans` e `contrast` seguem por escrever.** Herdado.

**7. A calibragem de ECLUSA continua sendo um primeiro chute** — `PIVOT 58`,
`SPREAD 16`, `THREAT_WEIGHT 85`. Agora há três instrumentos para conferir contra
comportamento: o simulador, a tela e o passeio.

**8. `src/data/bills.mjs` é catálogo morto que ainda respira.** As 36 pautas
prontas foram aposentadas pelo orçamento granular, e o arquivo continua no
catálogo porque as suítes do Congresso e das telas montam casos com ele. Ele
precisa virar fixture de teste ou morrer.

**9. A fonte é `system-ui`**, provisória — herdado.

**10. O benchmark de fps continua não medindo nada** — os dois braços batem no teto
de 240 Hz do monitor. Herdado.

## O que existe

### A tela

Casca com dois rails na estrutura do Football Manager 2020, vidro em três níveis
(`stage` · `action` · `support`), substrato de aurora em CSS puro. **Onze telas**:
a Mesa, Finanças, as oito áreas e O Estado. Dois itens do rail seguem desligados
de propósito — Opinião e Rede têm contrato de motor e nenhuma tela.

Regras que valem para toda tela nova: **uma lâmina por tela**, a tela **pergunta**
ao motor em vez de refazer a conta, número que vai para atributo passa por `attr`,
toda view traz o próprio elemento de fora, e **ausência não é resultado**.

### Os dados (`src/data/`)

Quatro blocos partidários no plano de Nolan com venalidade por eixo; **38
programas** em oito áreas com custo, faixa de abertura, guarda e posição; **6
regras** de propriedade e poder; parâmetros fiscais, macroeconômicos e do regime; e um
validador de esquema que não conserta nada.

A âncora que amarra tudo: `tests/suites/agenda.mjs` prova que a soma dos programas
bate com a posição fiscal de abertura, e que **a obrigatória é a soma dos pisos**.
Sem isso haveria duas verdades sobre quanto o Estado gasta.

### Os motores

- **LASTRO** (`src/domain/budget/`) — receita do PIB, obrigatória em valor
  absoluto, teto do arcabouço, gatilho de contingenciamento;
- **ECLUSA** (`src/domain/congress/`) — `whipCount` determinístico, `vote` com
  dissidência no dia, `settle` com decaimento, afago e traição, `dispersion`;
- **MALHA** (`src/domain/capacity/`) — índices por área, decaimento, rendimento da
  alocação e a pressão que volta para receita e despesa;
- **SONDA** (`src/domain/opinion/`) — a satisfação de cada segmento, a pesquisa que
  ela vira, e o peso que a rua tem na votação;
- **CORRENTE** (`src/domain/economy/`) — hiato, Phillips, Taylor, Okun, população,
  e `carry`, que é o que faz gasto virar dívida e dívida virar juro.

### A composição

- **`src/application/agenda.mjs`** — `compose` (o orçamento vira proposta),
  `honour` (o rateio empurra o nível de volta ao piso), `spendOf`;
- **`src/application/turn.mjs`** — `settlement`, `ledger`, `situationOf` e
  `playMonth`, nesta ordem de escopo: as três primeiras respondem "o que
  aconteceria", a última executa;
- **`src/public/index.mjs`** — a fachada, e a guarda `boundaries` prova que o
  entrypoint não alcança domínio nem aplicação por fora dela;
- **`tools/simulate.mjs`** — o mandato no terminal, cinco políticas-sonda.

### A verificação

Nove guardas com provas sintéticas, **152 propriedades**, e o **passeio**
(`npm run walk`), que usa a tela como se joga e confere console, rolagem, o
controle de alocação, o placar reagindo à verba, a linha de caixa acusando o
estouro, o rito mudando ao furar o piso e a escada de Finanças subindo — em
desktop e em celular.

## O que ainda não existe

- **TEMPORAL, CASCATA, DELTA** — só os contratos;
- **tensão institucional** — decidido que será variável de estado e não motor
  novo: `risco = f(tensão − escudo)`;
- **`orphans` e `contrast`** — as duas guardas seguem por escrever;
- **`d3-force`** — entra quando DELTA existir, em Worker;
- **GitHub Pages** — decidido ficar só com o CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · turno mensal (48 por mandato) · inglês no código e português
na prosa · seis camadas de estilo · codinomes de motor · zero build e zero
dependência de runtime (exceção: `d3-force` vendorizado) · lealdade é estado
serializado · motor nenhum chama outro motor · o Congresso responde ao que foi
PAGO · o rateio da falta é proporcional · a âncora do arcabouço é o TETO que
vigorou · a tela pergunta ao motor e não refaz a conta · a previsão usa o que
será pago, nunca o prometido · o rail lista áreas de governo · o rascunho morre
com o mês.

**Fechadas nos ciclos 2 e 3:**

- **tudo é uma alavanca, e toda alavanca tem preço.** Some o catálogo de pautas;
- **a posição ideológica é calculada, nunca arrastada.** Não há cursor na tela;
- **o rito é consequência do conteúdo**, e o mais exigente manda no pacote;
- **o jogador não inventa substantivos** — ele compõe restrições sobre
  substantivos que existem. É o que faz "liberdade quase infinita" ser computável,
  e é onde a IA entra quando entrar: traduzir intenção em combinação de faixas;
- **o catálogo cita fonte.** Número real e datado nos dados; a ficção é o que o
  modelo faz com eles;
- **o painel de Finanças não tem controle**, e mostra o mês como ele vai fechar.

**Princípio de design:** _tudo tem um jeito de ser feito._ Nenhuma jogada é
bloqueada por regra artificial — o que separa o possível do impossível é o
**preço**.

Referências de interface: **Geopolitical Simulator** e **Football Manager 2020**.
Liquid glass é a base do design inteiro, não um efeito de algumas telas.

## Fontes de modelagem

O modelo político-econômico nasceu de um dossiê externo, revisado e corrigido. As
correções estão registradas na prosa de cada arquivo: `src/data/parties.mjs`
(venalidade), `src/data/fiscal.mjs` (despesa obrigatória absoluta),
`src/data/macro.mjs` (o juro do estoque inteiro),
`src/domain/congress/index.mjs` (as duas parcelas da resistência),
`src/domain/economy/index.mjs` (o hiato em termos reais) e
`src/application/turn.mjs` (a ordem entre orçamento e votação).

A pesquisa de campo que sustenta o catálogo real está em `docs/research/`.
