# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa, leia este
> arquivo e depois [`standards.md`](standards.md).
>
> ⚠ **AQUI SÓ ENTRA O QUE É VERIFICÁVEL HOJE** — o estado que um comando confirma, a fila,
> a decisão viva e o achado ainda aberto. **Narrativa de sessão vai para
> [`journal.md`](journal.md)**, e não volta.
>
> **A regra tem preço medido atrás dela.** Este arquivo chegou a **5.704 linhas**, e nesse
> tamanho ele passou a causar defeito em vez de evitar: o achado 37 foi citado como verdade
> uma sessão inteira depois de o conserto que o invalidou ter entrado, e uma tabela de
> calibragem errada por um fator de 3 fez escolher um limiar que produziu exatamente o
> defeito que a mudança existia para consertar. **Um ponto de retomada que ninguém consegue
> reler inteiro é um ponto de retomada que mente.**

---

## ▶ COMECE POR AQUI

**Estado: verde.** `npm run validate` fecha com **13 guardas · 60 provas sintéticas · 140
arquivos · 281 provas · passeio verde em DUAS janelas**. Branch `caixa-de-entrada`, **14
commits à frente de `main`** mais o trabalho desta sessão na árvore.

### O que está em execução

| plano                                                                      | estado                                                |
| -------------------------------------------------------------------------- | ----------------------------------------------------- |
| [ciclo 16 — o Gabinete profissional](cycles/16-o-gabinete-profissional.md) | ✔ fechado em 30/08/2026 — o passo 5 foi recusado      |
| [ciclo 15 — o Gabinete](cycles/15-o-gabinete.md)                           | ✔ fechado em 30/08/2026                               |
| [ciclo 14 — a Caixa de Entrada](cycles/14-a-caixa-de-entrada.md)           | ✔ fechado em 29/08/2026 — sobra um item de motor      |
| [ciclo 13 — O GLORIOSO](cycles/13-o-glorioso.md)                           | ▶ o plano mestre, **22 de 49**; falta o D4 no passo 4 |

### ✔ A SUPERFÍCIE FOI PADRONIZADA — 30/08/2026

Pedido dele: _"refine e padronize todo o liquid glass, bordas, blocos, e tudo mais, do
gabinete. Refinado e padronizado, absoluto."_ **A regra está em [`standards.md`](standards.md)
§4** — o nível diz a substância, e a substância diz o raio.

| o que estava divergente              | medido                                   | agora                            |
| ------------------------------------ | ---------------------------------------- | -------------------------------- |
| literais de branco em aresta e fundo | **40 literais, 13 valores** (0,02 a 0,5) | escala de três, 15 viraram token |
| raio da barra do topo                | 24px — o **único** 24 da tela            | `--radius-piece` (16px)          |
| raio do bloco na coluna              | 3px, contra um painel de 16 ao lado      | 16px na coluna, 3px na carta     |

⚠ **E DUAS "DIVERGÊNCIAS" NÃO ERAM** — o censo as inventou lendo `borderTopColor` em peça que
só tem aresta de baixo. A aresta é **0,14 em toda parte**. Antes de consertar um censo, confira
que ele mede o que diz medir.

⛔ **E A LÂMINA NÃO VOLTOU PARA A BANDEJA:** `glass-support` no `.tray__list` custou **17,9
fps** e `--glass-support-bg` no `.tray__month` custou **28,3 sem filtro nenhum**. A tinta
chapada ali é decisão medida, e a folha já a explicava.

### O próximo trabalho — o D4, e ele abre motor

**A corrente causal visível.** Gastar em Segurança move a capacidade, que move a arrecadação,
que move o caixa — e a única pista disso na interface é um número mudando em outra tela.

⚠ **É O ÚNICO ITEM ABERTO QUE ABRE MOTOR:** `CASCATA` (`src/domain/propagation/`) e `DELTA`
(`src/domain/graph/`) são `export {}` até hoje — nome declarado, contrato declarado, zero
implementação. **O projeto já sabia que precisava disto e parou no nome.**

⭐ **E metade do caminho já está andada:** a projeção (0.3) mostra _para onde vai_; a corrente
mostra _por quê_. O plano manda nessa ordem, e ela foi cumprida.

### ✔ O C7 ENTROU — o calendário, 30/08/2026

**O jogo tinha 48 meses e nenhum era diferente do outro**, e é por isso que avançar parecia
apertar um botão. Agora o ano fiscal tem forma: quatro marcos reais com fonte —
`src/data/calendar.mjs` (mínimo em janeiro, LDO em abril, LOA em agosto, relatório bimestral),
e o seletor em `src/application/calendar.mjs`.

⚠ **ELE É FUNÇÃO PURA DE `month`, com prova**, e essa é a Restrição 2 do item: um `Date.now`
escondido faria a mesma partida mostrar prazos diferentes conforme o dia em que fosse aberta.
**Cinco provas**, e uma delas cobra que o mês do marco bata com o que a faixa imprime — se o
marco de abril caísse no mês que a tela chama de "mai", o jogo teria dois calendários.

⚠ **E A PRIMEIRA VERSÃO DE UMA PROVA REPROVOU O CÓDIGO CERTO:** ela exigia igualdade entre o mês
impresso e o do catálogo, e o relatório bimestral REPETE — cai em fev, abr, jun. O que se
confere é a congruência.

**⚠ O SEXTO BLOCO CUSTOU 40px, e a coluna não rola.** Ele veio com a conta, como manda a
Restrição 2, e os 40px saíram de duas linhas que já eram redundantes:

| linha que saiu          | por que ela era redundante                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Abandonam acima de 68` | um número para os QUATRO grupos, e a marca de latão já o aponta em cada pista — foi para a legenda do bloco           |
| `Maioria simples 257`   | a terceira forma de dizer o mesmo: a marca aponta o quórum e `Faltam` dá a distância — virou qualificador de `Faltam` |

⚠ **E UMA TENTATIVA INTERMEDIÁRIA FOI MEDIDA E DESFEITA:** pôr o limiar no qualificador das
quatro linhas pedia **313px num campo de 271** e cortava as quatro; encurtado, ele cabia mas
repetia o mesmo número quatro vezes — a legenda estática que a própria folha proíbe por escrito.

### ✔ O B10 ENTROU — a linha do tempo, 30/08/2026

O estágio era uma **palavra**, e palavra não diz que existe um caminho. Agora são três degraus
acima dela — andado, atual, e o que falta —, e **a ordem vem do motor**: `STAGES` mora em
`src/application/passage.mjs` e passa pela fachada. Escrever a fila na tela seria um segundo
lugar para ela, e um quarto estágio não apareceria lá. **Custo de altura: zero** — os degraus
moram na coluna que a palavra já ocupava.

### ✔ O 0.3 ENTROU — a projeção, 30/08/2026

`trajectory` mora em `src/application/turn.mjs` e passa pela fachada. **Ela é `outlook` com
horizonte, e há prova cobrando isso:** a 1 mês as duas dão o mesmo número, área por área. Sem
essa prova seriam duas contas para a mesma pergunta — a família de defeito nº 1 do projeto,
cinco ocorrências registradas.

| medição                           | plano orçava | medido                   |
| --------------------------------- | ------------ | ------------------------ |
| 24 meses                          | 5,3ms        | **0,34ms**               |
| 48 meses                          | 10,3ms       | **0,42ms**               |
| Saúde no máximo × parada, a 1 mês | —            | 61,19 × 60,99 — **0,20** |
| Saúde no máximo × parada, a 24    | —            | 65,23 × 60,96 — **4,26** |

⭐ **ELA SAIU 15× MAIS BARATA PORQUE NÃO RODA `playMonth`.** O plano orçava o turno inteiro; o
próprio plano exigia **congelar o plenário**, e congelado o turno vira a MALHA iterada — sem
votação, sem sorteio. Uma prova cobra que duas rodadas dêem a curva idêntica.

⚠ **E A CURVA DECLARA O QUE NÃO SIMULA:** _"sem votação no período"_ está na tela. Uma projeção
que esconde a própria premissa é número inventado com aparência de motor.

⚠ **A LEITURA DE UM MÊS ERA INCAPAZ, e agora tem número:** 0,20 ponto separava "financiar Saúde
no máximo" de "não tocar em nada" — as duas imprimiam `61`. A 24 meses são 4,26.

### ✔ O PASSO 3 FECHOU — C10 e C11, 30/08/2026

**C10 · a base tem duas metades.** `baseVenality` mora em ECLUSA, ao lado de `baseSplit` — e
**não é ela**: aquela reparte por HUMOR (quem está leal hoje), esta reparte por PREÇO, que não
muda com o mês. Medido no catálogo: com o corte em 0,7 a Câmara parte em **364 contra 149**, e a
média ponderada dá **67,9%** — o número do plano bate. Duas provas, uma delas cobrando que as
metades fechem a base antes do arredondamento.

⚠ **E A LINHA NOVA ESTOUROU A COLUNA — 557 contra 518**, exatamente os ~24px que o plano previa.
O próprio plano já dava a saída: **a barra que já existe vira a divisão**, com a convicção em
tinta cheia e o aluguel na mesma cor a 45%. Custo de altura **zero**, e a divisão fica em cima do
número que ela explica. O aluguel virou qualificador do nome.

**C11 · o gasto preso mostra o que MUDOU.** `before` passou a carregar `lockedBy` do mês
passado, e a variação vai na **nota do valor**, que já existia — zero de altura. O zero não
imprime, pela mesma regra que o comprometido já usava duas linhas acima.

### ✔ A TELA GANHOU UMA LINHA DE BASE — 30/08/2026

Ordem dele, em duas mensagens: _"suba um pouco o limite inferior do menu da esquerda"_ e depois
_"usa a borda como limite pra tudo, sobe todos os elementos usando aquela borda inferior como
margem imaginária"_.

| eixo               | antes                  | agora                         |
| ------------------ | ---------------------- | ----------------------------- |
| pé do rail · palco | 16 · 16                | **48 · 48** (`--shell-floor`) |
| vão entre colunas  | **32** e **24** — dois | **24** nos dois (`--gutter`)  |
| margens            | 16 · 16 · 16           | 16 · 16 · 16                  |

⚠ **O VÃO ERA DOIS, e a causa é a soma:** a margem do rail (16) mais o recuo do tabuleiro (16)
davam 32 de um lado, contra os 24 do `gap` do outro. O rail passou a 8, e os dois fecham em 24.
**Numa tela de três colunas, dois vãos leem como uma coluna fora do lugar.**

### ✔ O PASSO 2 FECHOU — a faixa de áreas, 30/08/2026

Oito retângulos cinzas idênticos viraram oito leituras. **B2 já existia**; os outros quatro
entraram, e **dois deles já estavam meio prontos do ciclo 16**: `alertsOf` é o B1 e
`icons.mjs` é o B5.

| item   | o que mudou                                                                         |
| ------ | ----------------------------------------------------------------------------------- |
| **B1** | a pista colora pela distância de `initial`, não pelo nível — o mesmo motor do rail  |
| **B3** | cada bloco diz o que MEDE (arrecadação, safra, cobertura…) — já estava no catálogo  |
| **B4** | a faísca ganhou direção; a rede `.trend[data-direction]` existia e ninguém a ligara |
| **B5** | ícone por área, do conjunto que saiu para `icons.mjs`                               |

**Medido: a faixa fecha em 94px de 108, e nada reticencia.** ⚠ **E o passeio cobrou o preço:**
`--ink-dim` a 10px deu **3,63 a 4,46** contra o piso AA de 4,5, em oito blocos — a linha subiu
para `--ink-soft`. Quem separa ela do rótulo acima é a caixa e o traqueamento, não a tinta.

⚠ **E `directionOf` SAIU DE `cabinet.mjs` PARA `shared/trend.mjs`:** a faixa precisava da
mesma conta, e refazê-la aqui faria a faísca discordar da seta do Gabinete no primeiro empate.

### As decisões que esperam ele

1. **as duas cartas sem número** — a Mesa pautou e a gaveta continuam sem bloco, e o número
   delas não está gravado em lugar nenhum. Puxá-lo é motor;
2. **o dossiê externo está dividido em quatro partes** no fim do [ciclo
   16](cycles/16-o-gabinete-profissional.md) — o que entra agora (A), o que é do Gabinete mas
   depois (B), o que é de outra tela (C: hemiciclo → Congresso, barra empilhada → Finanças,
   ghosting → áreas) e o que foi recusado com a razão medida (D).

⚠ **A FILA DE "ESPERA O BUMP" É DE UM.** `src/state/save.mjs` confere a **presença** de 18
campos de topo e a **forma** de 8 deles — e **não olha dentro de uma carta**. Três dos quatro
itens que a justificavam saíram sem custo nenhum; sobra o placar na carta, e **meça antes de
bumpar**: cada subida de versão custa a partida em andamento, e o save recusa versão diferente
em vez de converter.

### Como validar

```bash
npm run validate   # guardas + tipos + lint + formato + testes + passeio — ~42s, tem de ficar verde
npm run check      # só as guardas, ~2s — o laço curto
npm test           # só as suítes, ~2s
npm run simulate   # 48 meses no terminal
npm run serve      # http://127.0.0.1:5173/
```

⚠ **O portão não sabe OLHAR.** Mexeu em tela? abra a captura em `captures/passeio/`. Três
defeitos já atravessaram tipo, guarda e cem provas para morrer na imagem.

⚠ **AS FERRAMENTAS DE MEDIÇÃO MORAM EM `tmp/`, que o git ignora** — e foram o que achou quase
tudo na revisão da Caixa de Entrada: `auditar-caixa.mjs` (abre toda carta em 24 meses e mede
transbordo, recorte e tipografia), `prints-caixa.mjs`, `fontes.mjs`, `medir-coluna.mjs`,
`auditar-faixa.mjs`, `vaos.mjs`, `censo-tipo.mjs`, `quem-foge.mjs`, `cabe-no-gabinete.mjs` e
`tipos.mjs`.

### ⛔ NÃO REABRIR

A fita de cinco cores no Gabinete, os botões `NEGOCIAR`/`FINANÇAS`, as três classes da Rua,
o `letter__why`, o `annex__foot`, o vocativo, a pastilha com fundo, as setas verde e
vermelha, e **o mobile** — _"a perfeição que eu almejo é no desktop sempre"_.

---

## Achados abertos

**53. ⛔ NÃO RECALIBRAR A CAPACIDADE ANTES DA REFORMULAÇÃO — decisão dele, registrada em
21/08/2026.** Com o achado 52 na mão eu ia recomendar girar `decay` e `yield`, e ele avisou
a tempo: _"o jogo ainda terá uma boa reformulação, nós vamos adicionar empresas reais,
coisas reais, estatização, privatização, criação, construção — MAS ISSO É A LONGO PRAZO,
não é pra hoje"_.

⚠ **A reformulação substitui exatamente o modelo que eu ajustaria.** Cada número girado
hoje é um número girado duas vezes, e o segundo giro apaga o primeiro.

**O QUE SOBREVIVE À REFORMULAÇÃO, e é onde vale investir:**

- **o Congresso inteiro** — bancadas, lealdade, emenda, quórum. Nada disso é trocado por
  empresa, e a sonda `favoritos` acabou de mostrar que o eixo funciona: três a 73 e oito em
  ruptura, com o teto fechando em 12 meses;
- **a tramitação** — estatizar e privatizar vão passar por ela. É o canal, e ele já leva
  uma lei modesta da caneta à norma em quatro meses;
- **a Caixa de Entrada** — ela é a superfície por onde o mundo fala, e um mundo com empresas
  fala mais, não menos;
- **a lição de método do achado 52**, que vale para qualquer modelo que venha.

**O QUE NÃO SOBREVIVE, e por isso não deve receber trabalho agora:**

- os oito `decay` e `yield` de `areas.mjs`, e a identidade que os produz;
- qualquer conclusão sobre "o país responde na velocidade certa" — a pergunta volta inteira
  quando uma estatal construída no mês 6 começar a produzir.

⚠ **E A PERGUNTA FICA ESCRITA, mesmo sem a resposta:** _quanto tempo uma decisão do
presidente leva para mudar o país?_ Hoje são "mais que um mandato, em seis das oito áreas",
e isso é herdado de uma identidade aritmética — **ninguém escolheu**. No modelo novo ela
merece ser escolhida.

**52. ⚠ O ACHADO 49 ESTÁ ERRADO, E EU O ESCREVI HOJE — a correção é de MÉTODO e é a terceira
da mesma família em uma sessão, 21/08/2026.** Ele dizia: _"o país é quase inerte; hoje o
Planalto é um jogo de sobrevivência no Congresso com um país decorativo"_.

**O país não é inerte. As SONDAS é que espalham tudo por igual.**

**Medido depois, com duas sondas novas:**

| jogada                            | Saúde         | preço                                        |
| --------------------------------- | ------------- | -------------------------------------------- |
| concentrar tudo nela, 48 meses    | **61 → 71,5** | Indústria 48→15, Segurança 38→15, dívida 93% |
| rodar o foco a cada 12 meses      | 61 → 65       | Indústria 48→21, Segurança 38→19             |
| espalhar (as seis sondas antigas) | 61 → 60       | —                                            |

E no Congresso, com a sonda `favoritos` — emenda cheia às três maiores bancadas e nada às
outras oito: **três a 73 e oito em ruptura**, contingenciamento em **12 meses**, alocação
caindo de 254 para 115.

⚠ **AS SEIS POLÍTICAS ANTIGAS ESPALHAM NOS DOIS EIXOS** — verba dividida entre as oito
áreas, emenda oferecida a cada bloco do catálogo na mesma medida. **Nenhuma delas ESCOLHE.** E
escolher é o jogo: é o que Victoria 3, Democracy 4 e o Geo-Political Simulator pedem do
jogador do primeiro turno ao último.

**Uma sonda que espalha mede o espalhamento, e conclui que o mundo é plano.**

### ⚠ E o que sobrevive do 49 é a METADE que a velocidade explica

| área              | decay/mês | meia-vida  | % do caminho em 48 meses |
| ----------------- | --------- | ---------- | ------------------------ |
| Educação          | 0,0088    | **79 mês** | 35%                      |
| Defesa            | 0,0088    | **78**     | 35%                      |
| Saúde             | 0,0110    | **63**     | 41%                      |
| Agricultura       | 0,0114    | **61**     | 42%                      |
| Fazenda           | 0,0124    | **55**     | 45%                      |
| Previdência       | 0,0171    | 40         | 56%                      |
| Segurança         | 0,0419    | 16         | 87%                      |
| Indústria e Infra | 0,0569    | 12         | 94%                      |

⚠ **SEIS DAS OITO TÊM MEIA-VIDA MAIOR QUE O MANDATO.** Educação leva 79 meses para
percorrer metade do caminho até onde o dinheiro a levaria, e o mandato tem 48. **E as duas
que se movem são exatamente as duas que desabam em toda partida** — Indústria e Segurança
percorrem 87–94% do caminho, então elas obedecem; as outras seis não têm tempo.

**Isso é uma decisão de design, e ela nunca foi tomada de propósito:** um jogo em que
Educação não responde a um mandato inteiro é uma tese sobre o Brasil — defensável — mas
hoje ela é só a consequência aritmética de uma identidade calibrada área por área.

⚠ **E A CONSEQUÊNCIA DE JOGO É NÍTIDA: o país premia COMPROMISSO SUSTENTADO, e pune
rotação.** Concentrar 48 meses na Saúde dá +10,5; rodar o foco a cada 12 dá +4. Nenhuma
tela do jogo diz isso ao jogador, e é a regra mais importante que ele precisaria saber.

### A lição de método, e ela é a mais cara desta sessão

**Três vezes hoje eu quase registrei como defeito do MOTOR o que era uniformidade do
INSTRUMENTO:**

1. _"as bancadas não diferenciam"_ — diferenciam: amplitude 66 pagando uma só;
2. _"o país é inerte"_ — responde: +10,5 concentrando;
3. _"a lei nunca é escrita"_ — é: quatro meses da caneta à norma.

**As três vezes o teste que separou as duas frases levou menos de um minuto**, e as duas
frases pedem trabalhos opostos — recalibrar um motor, ou escrever uma sonda. **Antes de
chamar de defeito, faça a pergunta que o instrumento nunca fez.**

**48. ⚠ O ACHADO 37 ESTÁ PELA METADE VENCIDO, e eu repeti a metade morta dele numa resposta
antes de medir — 21/08/2026.** Ele dizia, medido em 20/08: _"num governo que joga ATIVO
cortando UMA alavanca por pauta, passaram-se 30 MESES sem uma única carta que pergunte"_, e
a consequência escrita era que **a Caixa de Entrada nunca pergunta nada em quatro anos**.

**Medido hoje, num mandato PASSIVO de 48 meses — o caso mais calmo que existe:**

| espécie de carta                 | carta-meses em 48 |
| -------------------------------- | ----------------- |
| `demand` (a chantagem do lobby)  | **29**            |
| `rupture`                        | 6                 |
| `posse`                          | 3                 |
| `siege`                          | 2                 |
| `reported` (a emenda do relator) | **0**             |

**Há pergunta de verdade na mesa em 22 dos 48 meses.** A caixa não é muda: ela pergunta em
quase metade do mandato, e pergunta a um presidente que não fez **nada**.

⚠ **O QUE MUDOU FOI O MERCADO GANHAR VERBO em 20/08**, na mesma sessão em que o achado foi
escrito — e o achado foi escrito antes. Um governo passivo endivida, o mercado esquenta, e
ele cobra. **O laço fecha.**

⚠ **E A METADE QUE CONTINUA DE PÉ É A CAUSA, e não a consequência:** `reported` deu **ZERO**
em 48 meses. A regra de `reports` em `passage.mjs` — só texto que machuca **duas alavancas
ou mais** passa por relatoria com emenda — continua exatamente como estava, e a pergunta do
RELATOR continua atrás de um comportamento que ninguém ensina. O que mudou é que ela deixou
de ser a única porta.

**A lição desta correção é de método, e é cara:** o achado 37 foi escrito na mesma sessão em
que o conserto que o desatualizou entrou, e passou uma sessão inteira sendo citado como
verdade — inclusive por mim, em voz alta, antes de eu medir. **Achado com número tem data, e
número com data envelhece.** Antes de repetir um, remeça-o.

**47. ⚠ A COLUNA DE TENDÊNCIA DE FINANÇAS NUNCA MOSTROU NADA, e a causa não é o desenho —
é que as réguas descrevem um país 20 vezes mais volátil do que o modelo produz. ACHADO
NOVO em 21/08/2026, e ele é o mais fundo desta sessão.**

Medido num mandato passivo de 20 meses, em **unidades de traço, de 20 possíveis**:

| indicador  | 6 meses | 12 meses | 24 meses |
| ---------- | ------- | -------- | -------- |
| PIB        | 2,8     | **6,0**  | 10,1     |
| Inflação   | 0,2     | 0,4      | **0,6**  |
| Juro       | 0,3     | 0,6      | 1,2      |
| Desemprego | **0,0** | 0,1      | 0,3      |
| Dívida/PIB | 0,2     | 0,5      | 1,0      |

**Quatro dos cinco movem menos de UMA unidade de vinte em dois anos.** A inflação vive
entre 3,1% e 4,2% contra uma régua de 0 a 15%; o desemprego não sai de 7,7%.

⚠ **E O DESENHO JÁ FOI TROCADO, então ele está descartado como causa.** A escada de blocos
morreu nesta sessão e virou linha de SVG, e a janela dobrou de 6 para 12 — o PIB passou a
mostrar movimento de verdade, e os outros quatro **não mudaram nada**, porque não há o que
mostrar.

**São duas hipóteses, e elas pedem coisas opostas:**

1. **as réguas estão largas demais.** Apertar `SCALE.inflation` para [0,02; 0,06] faria a
   linha viver. ⚠ **Mas ela perderia o drama exatamente quando ele importar:** uma
   inflação de 12% viraria uma linha reta encostada no teto, e é justamente esse o mês em
   que o jogador precisa ver a curva subir;
2. **o modelo macro é estável demais.** Um mandato inteiro sem o jogador tocar em nada
   move a inflação em 1,1 ponto. Se o ATIVO também não move, o problema não é de tela.

⚠ **A MEDIÇÃO QUE FALTA É A DO GOVERNO ATIVO**, e ela decide qual das duas: `npm run
simulate` com um governo que corta e escreve. **Não meça no passivo** — foi o passivo que
produziu a tabela acima, e ele é o caso mais calmo possível por construção.

**E a decisão é do responsável nos dois ramos**, porque calibragem não se muda para fazer
um desenho ficar bonito: se a régua estiver errada, é conserto de leitura; se o modelo
estiver parado, é conserto de jogo, e os dois têm donos diferentes.

**45. ⚠ AS ESCADAS DE FINANÇAS TÊM O MESMO DEFEITO QUE REPROVOU A DA BARRA, e elas estão
na tela há sessões — ACHADO NOVO em 21/08/2026, pego na captura do passeio.**
`.ledger__spark` declara `font-size: 0.5rem`, e é a mesma conta do achado 44: o bloco `▁`
tem **um oitavo do corpo da fonte**, então a 8px ele é **um pixel**. Na captura de
`walk-financas.png`, `PIB R$ 12,42 tri ______` e `Inflação 3,1% _______` leem como
sublinhado do número, e não como desenho.

⚠ **E ELE É MENOS GRAVE LÁ, o que é a razão de ele ter sobrevivido:** cada linha do painel
traz a variação ESCRITA ao lado — _"−6 em 6 meses"_ —, então a escada é o segundo sinal e
não o único. Na barra superior não havia texto de apoio, e por isso o mesmo tamanho
reprovou.

⚠ **E O CONSERTO NÃO É ÓBVIO, por isso ele é achado e não conserto.** Finanças é a tela
**densa por decisão registrada** — _"em tela que só informa, densidade é o serviço"_ —, e
subir a escada de 0,5 para 0,7rem engorda **dezoito linhas** de um painel que já foi
calibrado para caber. É uma troca entre legibilidade de uma peça e a altura da tela
inteira, e ela é decisão do responsável.

**40. ⚠ "QUEM TRAVA A OBRIGATÓRIA" CAIU DE TRÊS PARA UM, e isso é PERDA DE RESPOSTA e não
conserto — 21/08/2026.** O responsável pediu o corte do bloco inteiro; a verificação
recusou o corte porque **a leitura não existe em outro lugar**: Finanças mostra a
obrigatória como TOTAL, e quem trava só aparece programa a programa, espalhado por oito
telas de ministério. Apagar aqui apagaria do jogo a única resposta ao item de auditoria
externa que criou o bloco — _"não há como investigar quais leis herdadas estão sugando esse
dinheiro"_.

O meio-termo entregue foi **o maior travador, nomeado, numa frase**: `Aposentadoria urbana
trava R$ 66,7 bi`. Custou ~80px e quatro linhas. ⚠ **O segundo e o terceiro estão a um
parâmetro de distância** — `lockedBy(state, catalog, top)` continua devolvendo três, e é a
tela que imprime um. **A pergunta que fica aberta não é de layout: é se um só basta.** Um
governo que corta previdência vê o número mudar; um que não corta vê a mesma linha por 48
meses, e aí ela vira legenda estática — que é exatamente o defeito que as frases de desejo
da CALDEIRA acabaram de pagar.

**37. ⚠ A ÚNICA CARTA QUE PERGUNTA EXIGE UM TEXTO QUE MACHUCA DUAS ALAVANCAS, e ninguém
diz isso ao jogador — ACHADO NOVO em 20/08/2026, e é o mais fundo desta sessão.**

Medido num navegador de verdade, com o jogo jogado de fato:

| como se joga                             | perguntas em 30 meses |
| ---------------------------------------- | --------------------- |
| passivo (só avança o mês)                | **0**                 |
| ativo, cortando UMA alavanca por pauta   | **0**                 |
| ativo, cortando TRÊS alavancas por pauta | a primeira no mês 5   |

A causa **não é defeito**: é a regra de `reports`, em `passage.mjs`, escrita e justificada
com um defeito medido atrás dela — _"o relator que apaga a única cláusula do texto não
escreveu um jabuti: ele REJEITOU o projeto, e rejeitar é trabalho do plenário"_. `hurt < 2`
devolve `saved: undefined`, e **sem emenda não há pergunta**.

⚠ **O que não estava escrito em lugar nenhum é a consequência de jogo:** a Caixa de
Entrada é a superfície central do desenho inteiro — o ciclo 4 diz que _"o inbox é o
jogo"_ —, e um presidente cauteloso, que mexe numa coisa de cada vez, **atravessa quatro
anos sem que ela pergunte nada**. Toda a tensão que o dossiê externo sentiu faltando na
tela tem aqui uma das causas, e ela não é de CSS.

⚠ **E o conserto NÃO é baixar o limiar para 1.** Isso reabriria o defeito que a regra veio
consertar — zero votações em 24 meses. As saídas honestas são outras, e as três são
mecânica e não pintura:

- **os DOIS LOBBIES MUDOS** (item 2 da ordem antiga) — o mercado e o baixo clero. Eles
  perguntam por conta própria, sem depender de o jogador escrever texto grande;
- **o relator emendar por OUTRA razão** que não "sobrou alavanca" — hoje a única porta
  para uma pergunta é o tamanho do texto;
- **a tela dizer o que ninguém diz**: que um texto de uma cláusula não passa por
  relatoria com emenda. Isso é informação de regra, e ela não existe na interface.

**35. A IDENTIDADE DO ACHADO 31 COLIDE COM UMA AFIRMAÇÃO DE DESENHO, e a colisão é da
SAÚDE.** `areas.mjs` diz em prosa que a saúde _"decai rápido porque fila e
desabastecimento aparecem em semanas"_. A identidade a põe entre as **mais lentas**
(meia-vida de 63 meses), porque no catálogo ela custa R$ 0,33 bi por ponto de índice —
cinco vezes o preço de um ponto de segurança.

Sete das oito ordens sobreviveram; esta não. **Uma das duas afirmações está errada**, e
decidir qual é recalibragem de `yield` ou de `cost`, e não conserto de decaimento. ⚠ É
achado, e o registro está na prosa do catálogo também.

**36. A CATRACA DO RATEIO — `honour` grava o corte no estado e nada nunca o devolve.**
Um mês de aperto encolhe o orçamento **para sempre**: medido antes desta sessão, o
`herdado` perdia 11,5% da indústria em sete meses e terminava o mandato com R$ 70,7 bi
de folga e o Estado ainda encolhido. A prosa de `settlement` declara a intenção — _"o
Estado inteiro escorregando para o mínimo legal"_ —, mas **a permanência não está
escrita em lugar nenhum**, e no mundo o contingenciamento é anual e se libera. ⚠ Hoje
ela é visível e reversível pelo jogador (basta arrastar o controle de volta); deixa de
ser no dia em que alguém automatizar a decisão.

**7. A calibragem de ECLUSA continua sendo um primeiro chute** — `PIVOT 58`,
`SPREAD 16`, `THREAT_WEIGHT 85`. Agora há três instrumentos para conferir contra
comportamento: o simulador, a tela e o passeio.

**8. `src/data/bills.mjs` é catálogo morto que ainda respira.** As 36 pautas
prontas foram aposentadas pelo orçamento granular, e o arquivo continua no
catálogo porque as suítes do Congresso e das telas montam casos com ele. Ele
precisa virar fixture de teste ou morrer.

**10. O benchmark de fps continua não medindo nada** — os dois braços batem no teto
de 240 Hz do monitor. Herdado.

**11. O jogador não tem como escrever gatilho, exceção nem revogação.** A gramática
existe e é executada; o canal de ordens só carrega faixa. É a Parte 3 (tramitação)
que abre esse canal, e ela precisa decidir uma coisa que a Parte 1 não decidiu:
**como se cobra por um texto que não muda nada hoje.** Uma cláusula de gatilho
desligada tem efeito zero no mês em que passa — cobrada pelo efeito, ela sairia de
graça e explodiria depois. O caminho provável é o rito sair do **alcance** do
texto e não do delta dele.

**12. `state.norms` cresce e nada o poda.** Um mandato de reformas termina com
dezenas de textos por cima dos 44 herdados (o `explorador` fecha com 82). Hoje isso
é barato — a resolução é O(normas × alcance) e roda uma vez por turno —, mas é o
risco 8 do ciclo, e o simulador passou a imprimir o tamanho do arquivo justamente
para essa linha ser vigiada. Junto vem o risco 2: **a tela ainda não tem onde
mostrar a pilha.** Ela mostra a faixa vigente e não diz quantas normas a
produziram, nem qual delas trava cada parcela.

**26. A VINCULAÇÃO INCIDE SOBRE A RECEITA BRUTA, e no mundo real é sobre a CORRENTE
LÍQUIDA.** O art. 198 prende 15% da RCL — depois do que sai para estados e municípios
—, e o modelo ainda tem uma receita só. A consequência está escrita no catálogo e é
conhecida: **as frações deste jogo são menores que as constitucionais porque a base
delas é maior** (a saúde fecha em 8,0% da bruta, e não 15% da líquida). É a metade
"transferência" da Parte 2 do ciclo 4, que **não foi feita**. Consertar exige uma
terceira fatia de receita, e a prova de âncora (`agenda.mjs`) precisa acompanhar.

**28. O PRÊMIO DE RISCO SÓ FICA PERCEPTÍVEL DEPOIS DE ~8 p.p. DE DETERIORAÇÃO.** Com
`riskPremium: 0,5`, a dívida a 80% paga **0,01%** e a 89% paga **0,6%**. A progressão é
o desenho — o mercado tolera antes de fugir —, mas a faixa que um mandato de fato
visita é 78%–89%, e nela o prêmio passa quase todo o tempo perto de zero. ⚠ **É
calibragem, e vai junto com o achado 22**: um preço que só morde fora da faixa jogada
é um preço que o jogador nunca sente.

**22. ⚠ O DIAGNÓSTICO DE "TRAMITAÇÃO ESTRANGULADA" NÃO SE SUSTENTA NO NÚMERO MEDIDO —
remedido em 24/08/2026, ver o achado 54.** Este item já mudou de número duas vezes: "3 de
24", depois "4 de 11", e as duas leituras vinham de instrumento quebrado ou de horizonte
misturado.

**Medido a 48 meses, semente padrão:** a `agenda` aprova **29 de 43 (67%)** e a `base`
**35 de 42 (83%)**. Um Congresso que aprova dois terços do que o governo protocola não está
estrangulado — isso é "legislar custa, e o preço se paga", que é o efeito pretendido.

⚠ **O QUE SOBREVIVE DO ITEM É OUTRA PERGUNTA, e ela não é sobre a taxa de aprovação:** é
sobre o que morre **antes** do plenário. As 43 votações da `agenda` são o que CHEGOU lá; a
gaveta e a relatoria continuam sem medição própria, e o achado 50 mostra o outro extremo —
a sonda `legislador` fecha o mandato com **2 normas e 2 de 39 aprovadas**. ⚠ **E entrou um número novo
na mesma família: `ANSWER_TIME = 2`**, o prazo da pergunta, declarado como primeiro
chute na prosa de `mail.mjs`. O que NÃO é chute está escrito lá: ele tem de ser maior
que um, senão "responder" vira "responder agora" e o prazo não compete com nada.

**23. O PREÇO DE TRAVAR É SÓ O RELÓGIO.** Recusar o relatório devolve o texto à gaveta
com o `writtenAt` intacto — preço real, e talvez barato. Cobrar também na **memória do
relator**, pelo trabalho recusado, seria o preço mais expressivo e exige um canal novo
em ELENCO: `remember` credita por verba prometida e paga, e **uma ofensa não é um
calote**. Se a calibragem do achado 22 mostrar que travar sai de graça, o canal da
ofensa é o lugar certo de mexer.

**18. O `explorador` deixou de medir o orçamento.** Com a tramitação ele destrói a
própria base em três meses — promete 100% a todos, o rateio corta, e a memória do
presidente da Câmara vai a −0,44 —, então nada dele chega a votar. Ele continua
sendo uma sonda válida, e agora de outra coisa: **prometer demais mata o governo**.
Para voltar a medir "quebrar o orçamento", que foi o que encontrou o achado 1, ele
precisa **parar de prometer verba**. É mudança de INSTRUMENTO e não de modelo, e por
isso está aqui e não foi feita sozinha.

**20. A RUA PRECIFICA VOTO E MAIS NADA — e METADE dele caiu em 16/08/2026.** A
chantagem deu mão ao lobby: os dois grupos que leem a MALHA agora exigem, e ceder ou
recusar move dinheiro e pressão. ⚠ **O que continua de pé é a outra metade**, e ela é a
que o achado nomeia: a SONDA — a rua propriamente dita — segue sem tocar em índice, em
receita ou em despesa. Um governo detestado ainda governa um país que funciona igual. O
texto original: A aprovação da SONDA desloca a resistência
da ECLUSA — e para no voto. Ela não toca em índice de área, em receita, em despesa
nem em nada físico: **um governo detestado governa um país que funciona igual.** O
buraco foi apontado de fora e procede; o desenho que veio junto (greve por categoria
profissional, entregue por CASCATA) **não pluga** — a SONDA segmenta por renda, não
por profissão, e CASCATA é só contrato. É um ciclo, e não um conserto. Ver
[`research/03-mecanicas-de-referencia.md`](research/03-mecanicas-de-referencia.md).

**16. Quatro das cinco ambições do elenco são INERTES.** Só `succession` tem preço
— `successionDrag` em `offered`. `cabinet`, `state`, `court` e `seat` estão
declaradas no catálogo com prosa e não movem nada. A tela passou a mostrá-las como
caracterização (quem a pessoa é), e **só a sucessão leva a consequência escrita ao
lado**, porque é a única que o motor cobra. Elas ganham preço na tramitação e na
queda. Remedido em 28/08/2026: a distribuição é uniforme em 600 sementes
(20,4/19,7/19,9/20,3/19,6 em 4.800 pessoas) — mas com oito pessoas e cinco
ambições, uma partida pode dar quatro iguais, e a de abertura dá (quatro querem o
governo do estado). Não é defeito de hash; é amostra pequena. Sortear estratificado
é decisão de desenho, não conserto.

## ▶ A SÉRIE QUE CALIBRA — e ela é a ÚNICA que serve para calibrar

⚠ **ESTA É A ÚNICA SÉRIE DO PROJETO, e é de propósito.** O arquivo guarda outras quatro,
e as quatro são HISTÓRICAS: cada uma mediu o efeito de uma mudança no dia em que ela
entrou, e cada uma foi superada pela seguinte. **Calibrar contra qualquer uma delas seria
ajustar o parafuso contra um jogo que não existe mais** — por isso elas ficaram em
[`journal.md`](journal.md), e esta ficou aqui.

⚠ **E O HORIZONTE É DECLARADO NA TABELA porque a coluna de votações já misturou dois.**
Todas as células abaixo são de **48 meses**, semente padrão, remedidas em **30/08/2026**.

| política     | dívida/PIB | votações     | indústria   | segurança   |
| ------------ | ---------- | ------------ | ----------- | ----------- |
| `herdado`    | **90,0%**  | 0 de 0       | 48 → **26** | 38 → **24** |
| `agenda`     | 90,1%      | **30 de 42** | 48 → 19     | 38 → 19     |
| `base`       | 90,7%      | **36 de 41** | 48 → 19     | 38 → 20     |
| `piso`       | 90,9%      | 5 de 17      | 48 → **15** | 38 → **15** |
| `explorador` | 91,7%      | 0 de 0       | 48 → **25** | 38 → 17     |
| `promessa`   | **93,3%**  | 0 de 3       | 48 → **17** | 38 → 15     |

⭐ **CINCO DAS SEIS LINHAS ESTAVAM VENCIDAS, e a causa é legítima: o item 0.1.** A tabela
anterior foi medida em 24/08/2026 e a renúncia de receita entrou em `fc1c6b4` no mesmo dia,
**depois dela** — `waivedOf` passou a abater a receita e a desoneração deixou de consumir a
bolsa do mês. Bissetado com `simulate` a cada commit: `968811d` dá `29 de 43 · ind 20`,
`fc1c6b4` dá `30 de 42 · ind 19`, e nada mais moveu até hoje. **Só `piso` sobreviveu
inteira**; a dívida errou em duas linhas e as colunas de área, em cinco.

⚠ **A LIÇÃO É DE PROCESSO, e ela é a razão de esta seção existir:** o commit que mudou o
motor não remediu a série ao lado dele, e **seis dias e cinco commits de raciocínio correram
em cima da tabela velha** — inclusive o achado 22, que argumenta sobre a taxa de aprovação da
`agenda`. Com 29 de 43 ela aprova 67,4%; com 30 de 42, **71,4%**. A conclusão do 22 não muda,
mas ela foi tirada de um número que já não era o do jogo. **Mexeu em `src/data/`, `src/domain/`
ou `src/application/`? remeça esta tabela no mesmo commit.**

⚠ **A dívida sobe ~12 pontos em TODAS as políticas, e isso é consequência e não
regressão:** enquanto o país se consertava sozinho, a capacidade subia, a arrecadação
subia atrás dela e a dívida era segurada por um ganho que ninguém pagou. Tirada a
gratuidade, sobrou a conta.

⚠ **E A TABELA DE QUEDA SAIU DAQUI, porque ela não é reproduzível hoje.** Ela dizia em que
mês cada governo abre processo e cai, medida em 60 meses em 24/08/2026 — e **nenhum
instrumento do repositório a produz**: `simulate` não imprime `state.impeachment` nem
`state.fallen` em coluna nenhuma, e o script que a mediu morava em `tmp/`, que o git ignora.
O texto dela está em [`journal.md`](journal.md) como medição datada. **Ausência declarada não
é ausência disfarçada** — refazê-la pede uma coluna nova no `simulate`, e isso é trabalho, não
limpeza.

⚠ **E o achado 1d sobrevive nos DOIS eixos** — o passivo termina com a melhor dívida
**e** a melhor capacidade, porque manter o orçamento herdado é, por identidade, o ponto
de equilíbrio. **Isso deixou de ser um defeito**: ele paga no único lugar que importa,
que é a cadeira. É a tese do ciclo 10 cumprida — _"não se conserta com número, se
conserta com risco"_.

## O que existe

### A tela

**A casca é o Gabinete**, na estrutura do Football Manager 2020: barra superior
fixa com data, quatro sinais vitais e o botão de avançar; sidebar por **poderes e
lugares**, com as oito áreas um nível abaixo em Ministérios. Vidro em três níveis
(`stage` · `action` · `support`) e substrato de aurora em CSS puro. O rail duplo e a
Mesa morreram na sétima sessão.

**Doze telas**: o Gabinete, Congresso & Leis, Finanças, as oito áreas e O Estado.
A Rua e Bastidor saíram do rail no D7, e voltam com dono: a primeira depende da
imprensa e das pessoas agindo sozinhas, a segunda da coalizão.

O **Gabinete** é duas colunas, com a Trindade do risco atravessando as duas por
cima: a Caixa de Entrada à esquerda (5fr) e **cinco** blocos empilhados à direita
(4fr) — Risco de queda, a Câmara neste mês, Quem pode derrubar, Dinheiro do mês e
Aprovação por renda. ⚠ **Eles são a MESMA peça do anexo da carta** desde o ciclo 15
(`src/ui/shared/annex.mjs`), e a guarda `annexes` fecha o vocabulário das duas telas.

Regras que valem para toda tela nova: **uma lâmina por tela** (os cartões do
Gabinete são a exceção declarada), a tela **pergunta** ao motor em vez de refazer a
conta, número que vai para atributo passa por `attr`, toda view traz o próprio
elemento de fora, e **ausência não é resultado** — com o corolário que a oitava
sessão acrescentou: **ausência declarada não é ausência disfarçada**, e são dois
estados vazios diferentes.

### Os dados (`src/data/`)

Blocos partidários no plano de Nolan com venalidade por eixo; programas com custo,
faixa de abertura, guarda e posição; regras de propriedade e poder; grupos de pressão
e faixas de renda; arquétipos de gente com o vocabulário de nomes que os gera
(`cast.mjs`, e o ADR 0003 na frente dele); parâmetros fiscais, macroeconômicos, de
opinião, de elenco e do regime; e um validador de esquema que não conserta nada.

⚠ **A TABELA ABAIXO É COBRADA POR PROVA, e ela existe por defeito medido.** A prosa
deste projeto afirmou por sessões um Congresso de "onze bancadas" e um elenco de "sete
pessoas" enquanto o catálogo tinha outros números — a família que `standards.md` §7
declara sem guarda. Agora toda linha de duas colunas deste arquivo cujo rótulo esteja
na lista é conferida contra `CATALOG` por `tests/suites/catalog.mjs`.

| coleção            | quantos |
| ------------------ | ------- |
| blocos partidários | 9       |
| cadeiras           | 513     |
| áreas              | 8       |
| programas          | 38      |
| regras             | 6       |
| grupos de pressão  | 4       |
| faixas de renda    | 3       |
| arquétipos         | 8       |

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
- **ELENCO** (`src/domain/cast/`) — as pessoas do mandato, geradas da semente sem
  consumir fluxo de aleatoriedade; a memória de cada uma, e a tradução dela em
  verba. `benches` divide a Câmara entre líderes e blocos;
- **CORRENTE** (`src/domain/economy/`) — hiato, Phillips, Taylor, Okun, população,
  e `carry`, que é o que faz gasto virar dívida e dívida virar juro;
- **ESTRATO** (`src/domain/norms/`) — a pilha de normas lida como faixa vigente,
  com precedência declarada, gatilho reavaliado por turno, vigência, exceção e
  revogação. `inherited` faz a norma de abertura de uma alavanca; `enact`, a que
  uma aprovação escreve.

### A composição

- **`src/application/agenda.mjs`** — `compose` (o orçamento vira proposta),
  `honour` (o rateio empurra o nível de volta ao piso), `spendOf`;
- **`src/application/turn.mjs`** — `bandsOf`, `settlement`, `ledger`,
  `situationOf` e `playMonth`, nesta ordem de escopo: as quatro primeiras
  respondem "o que aconteceria", a última executa. `bandsOf` é a porta da lei
  vigente: ela monta as alavancas e os indicadores e pergunta ao motor de normas,
  para a tela nunca remontar a legislação por fora;
- **`src/public/index.mjs`** — a fachada, e a guarda `boundaries` prova que o
  entrypoint não alcança domínio nem aplicação por fora dela;
- **`tools/simulate.mjs`** — o mandato no terminal, **nove** políticas-sonda:
  `herdado`, `piso`, `base`, `agenda`, `explorador`, `promessa`, e as três que
  nasceram de achados — `concentra` e `favoritos` (52), e `legislador` (50).
  `explorador` não governa: derruba todo piso, levanta todo teto, gasta o máximo e
  promete verba cheia, tentando quebrar o orçamento. Foi ela que mediu o achado 1.
  O resumo imprime o **tamanho do arquivo legislativo**, que é o instrumento dos
  riscos 2 e 8 do ciclo.

### A verificação

**Treze guardas** com **60 provas sintéticas** e **269 provas**, e o **passeio**
(`npm run walk`), que usa a tela como se joga a 1440×980 e mede rolagem, recorte,
sobreposição e contraste no pixel renderizado. ⚠ **O passeio está DENTRO do
`validate`** — o portão vê a tela desde 23/08/2026, e o custo é 42s contra 9s.

## O que ainda não existe

- **TEMPORAL, CASCATA, DELTA** — só os contratos;
- **tensão institucional** — decidido que será variável de estado e não motor
  novo: `risco = f(tensão − escudo)`;
- **contraste de texto que NÃO é folha** — o medidor existe e está no portão, mas só
  alcança elemento sem filho elemento: num `<p>` com `<b>` dentro, o texto próprio do
  pai não é medido por ninguém. Ver `standards.md` §7;
- **`d3-force`** — entra quando DELTA existir, em Worker;
- **GitHub Pages** — decidido ficar só com o CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · turno mensal (48 por mandato) · inglês no código e português
na prosa · seis camadas de estilo · codinomes de motor · zero build e zero
dependência de runtime (exceção: `d3-force` vendorizado) · lealdade é estado
serializado · motor nenhum chama outro motor · o Congresso responde ao que foi
PAGO · o rateio da falta é proporcional · a âncora do arcabouço é o TETO que
vigorou · a tela pergunta ao motor e não refaz a conta · a previsão usa o que
será pago, nunca o prometido · o rascunho morre com o mês.

⚠ **UMA DECISÃO SAIU DESTA LISTA e o registro fica:** _"o rail lista áreas de
governo"_ valeu enquanto o jogo era só orçamento. O ciclo 4 a reabriu de propósito
— com legislar virando atividade própria, o Congresso deixou de ser um instrumento
e virou um **lugar** —, e a sidebar passou a listar poderes e lugares, com as áreas
um nível abaixo em Ministérios. A regra antiga sobreviveu ali: quem quer mexer na
saúde entra em Ministérios.

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

**Fechadas no ciclo 4, Parte 1:**

- **a ordem entre normas contraditórias** — hierarquia, depois especificidade,
  depois recência, depois ordem de escrita. Ela é total, e o último critério existe
  para nunca haver empate;
- **lei geral posterior não revoga lei especial anterior.** Para a geral vencer a
  especial, ela tem de **nomear** o que revoga;
- **ausência de norma é ausência de restrição** — nunca a faixa do catálogo;
- **não se revoga o que ainda não foi escrito**;
- **a faixa vigente é derivada, e nunca guardada.** O estado guarda o texto.

**Fechadas no ciclo 4, Parte 5:**

- **toda pessoa é gerada da semente, e nenhuma entra no save.** O que se guarda é a
  **memória** — as pessoas se refazem, o que você fez com elas não se refaz de lugar
  nenhum;
- **o elenco não consome fluxo de aleatoriedade.** Só TEMPORAL e ECLUSA sorteiam, e
  cada um com o fluxo dele; um elenco puxando do mesmo fluxo faria acrescentar um
  personagem mudar todas as votações do mandato;
- **uma pessoa é uma bancada de um só**, e por isso ECLUSA não mudou uma linha para
  atendê-la. O líder leva a fração que arrasta; o resto do bloco continua sendo o
  bloco, e o bloco nunca desaparece da Câmara;
- **ambição é preço, e não personalidade.** Quem quer o Planalto em 2030 reconhece
  menos da verba que recebe — é o único termo do elenco que dinheiro não compra;
- **a traição pesa mais que o favor**, como em SONDA e pela mesma razão.

**Fechadas fora de ciclo, na oitava sessão:**

- **o modelo tem de conseguir rodar déficit primário.** Um país que não consegue
  perder dinheiro não é este país, e há três provas cobrando isso;
- **o preço de um texto escala com a dispersão dele**, e não só com o rito. Juntar
  tudo num pacote deixou de ser grátis;
- **"instantâneo" é propriedade do que RESPONDE ao jogador**, não do que acontece
  ao redor dele. Por isso o toque encolheu para 90 ms e o gel da aurora não encolheu;
- **o layout é uma promessa**: a tela não muda de esqueleto quando o conteúdo chega.

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
