# Ciclo 14 — a Caixa de Entrada

> ⚠ **O PASSO 1 ESTÁ FEITO; DO 2 AO 5, NÃO.** Escrito em 28/08/2026 a pedido dele — _"eu estou
> vendo diversos bugs, brechas, visual feio e tudo mais, na caixa de entrada. Eu quero testar
> sua capacidade investigativa"_ —, e executado a partir do passo 1 na mesma data.
>
> ⚠ **E ELE CONTINUA INCOMPLETO POR DECLARAÇÃO.** A investigação abriu quatro frentes. **Duas
> fecharam** — o motor da correspondência e a view — e são a origem de tudo o que está aqui.
> **Duas morreram no limite de sessão** e foram relançadas. ✔ **O _wiring_ do entrypoint
> fechou** — 15 cenários, ~120 meses dirigidos no navegador — e trouxe o **passo 1½** abaixo.
> ✔ **A geometria fechou** — três janelas, 24 meses, 14 espécies — e trouxe o **passo 3½**.
>
> **As quatro frentes fecharam. O plano está completo.**

## Por que ela pesa

O ciclo 4 declarou: **_"o inbox é o jogo"_**. Ela é a coluna maior da primeira tela, a única
superfície por onde o mundo fala com o presidente, e a única que **pergunta**. A nota dele
para a Caixa foi 7 antes da revisão e 8 depois — a mais alta que uma peça deste jogo já
recebeu. **Este ciclo existe porque a medição não sustenta a nota.**

---

## 🔢 O QUE FOI MEDIDO

Cinco políticas × 48 meses no motor, mais o jogo dirigido num navegador de verdade a
1440×980. Todo número abaixo foi medido em 28/08/2026 — **e número com data envelhece:
remeça antes de repetir.**

| medição                                                     | resultado                        |
| ----------------------------------------------------------- | -------------------------------- |
| cartas destruídas pela poda com 1 a 3 meses de idade        | **101** na política `base`       |
| cartas que viveram **um mês só** contra as que viveram 25   | **78** contra **21**             |
| meses-lobby em que a exigência foi calada pelo alarme       | **26 a 30**, por política        |
| meses em que o teto fechou · cartas de teto emitidas        | **12 de 48** · **zero**          |
| meses em que o fechamento do mês foi cortado da bandeja     | **14 de 16**, do mês 3 em diante |
| itens na lista contra a capacidade declarada, no mês 22     | **12** contra **7**              |
| papel em branco no pé da folha, na carta que a Mesa pautou  | **468px de 620** — 75%           |
| buraco entre o corpo e os botões, na carta que **pergunta** | **~366px**                       |

---

## PASSO 1 — ✔ FEITO em 28/08/2026 · O MOTOR ESTAVA ERRADO

> **Os três entraram, e as três provas nasceram antes e foram verificadas mordendo.** 256
> provas, 12 guardas, passeio verde. ⭐ **E a série não mudou um caractere** — `npm run
simulate` antes e depois dá saída idêntica, o que é o resultado desenhado: os três consertos
> devolvem **correspondência**, e nenhum deles mexe em calibragem.
>
> **Que estão vivos, e não inertes, foi medido à parte:** o aviso de teto saiu de **zero em
> cinco políticas** para um por mandato, e a política `herdado` foi de **6 para 8** exigências
> em 48 meses.

### 1.1 · ✔ A poda jogava fora a carta que acabou de chegar

`src/application/mail.mjs` — a poda corta com um `slice` negativo, que pega o **fim** do
array. Mas o turno monta a caixa com as **novas na frente**. A poda preserva um bloco
congelado de vinte meses atrás e apaga o que chegou neste mês.

A caixa fica com buraco, e o buraco é o meio do mandato:

```
mês 30 → meses presentes: 29,28,27,26,25 · 12,11,10,9,8,7,6,5   (falta 13 a 24)
```

⭐ **E a prova de que a direção é o erro está no próprio projeto:** `app.mjs` e
`src/ui/screens/inbox.mjs` cortam pelo **começo**. A view guarda as novas e o motor guarda as
velhas, no mesmo array.

⚠ **A CAUSA-RAIZ É DOCUMENTAL, e são três frases que se contradizem:**
`src/state/state.mjs` diz que a caixa vai _"da mais antiga a mais nova"_;
`src/application/turn.mjs` diz que a ordem é _"a da urgência, e não a cronológica"_;
`app.mjs` diz que ela _"é cronológica"_. **A poda acreditou na terceira.**

**Save: zero.** ✔ **E a série foi comparada antes e depois, como o item 0.1 do Glorioso exigiu:
saída idêntica ao caractere.** A poda devolve correspondência e não toca em calibragem.

### 1.2 · ✔ O alarme de fervura calava o grupo que acabou de ferver

`src/application/turn.mjs` filtra por remetente e resposta nula para garantir _"uma exigência
aberta por vez, por grupo"_. O alarme de fervura nasce com o mesmo remetente **e** resposta
nula — ele fecha por data de fechamento, e não por resposta. Ele satisfaz o filtro e
**bloqueia toda exigência daquele grupo enquanto estiver na bandeja**.

⚠ **É estrutural, e não acidente de calibragem:** o ponto de fervura é 68 e o de exigir é 30,
então quem ferve está **sempre** acima do limiar de exigir. O grupo que acabou de romper com o
governo é exatamente o que perde a voz.

**Conserto: o filtro passa a exigir a espécie da exigência. Save: zero.**

### 1.3 · ✔ O alarme do teto era matematicamente impossível

`src/application/turn.mjs` pergunta se o teto **não** estava fechado antes e está agora. Os
dois lados saem da **mesma** chamada de posição, e o contingenciamento é `teto − obrigatória`,
que **não depende do que foi empenhado**. A condição é `!X && X`.

É o **quinto canal morto** do projeto, e o mais completo deles: a tela dele existe inteira em
`src/ui/screens/inbox.mjs`, com assunto, corpo e a linha do que sobrava.

⚠ **Ligá-lo não é de graça:** é um alarme que nunca disparou entrando numa bandeja que já
lota. **Mede-se o ruído antes de fechar** — o mesmo risco que o A7 do Glorioso declara para o
Congresso propondo.

---

## PASSO 1½ — ◐ TRÊS DE SEIS · O GESTO ESTAVA QUEBRADO

> Achado pela frente de _wiring_, em 15 cenários e ~120 meses dirigidos num navegador de
> verdade. **Nenhum destes é de desenho: são de comportamento.**
>
> ⚠ **ELE ESTEVE MARCADO "✔ FEITO" COM METADE ABERTA** — de 28 a 28/08/2026 —, e a auditoria de
> código o corrigiu: **1½.1 a 1½.3 entraram; 1½.4, 1½.5 e 1½.6 continuam abertos**, e os três
> foram reconferidos no código. O handoff repetiu a marca errada, que é a família do §7 dos
> padrões: prosa que continua gramatical e para de ser verdade.

### 1½.1 · ✔ Um clique prendia o jogador numa carta para sempre

`app.mjs` — `openDispatch` é escrito **só** no clique e **nunca** é limpo: nem na virada do
mês, nem na posse. E `fitted` força a carta aberta para dentro da bandeja mesmo estourando a
capacidade. **Quem clica uma vez em qualquer ofício fica preso nele.**

**Medido:** um clique num aviso velho, depois só "Avançar" — em **20 meses** a carta aberta
continuou a mesma. Nos **3 de 3 meses em que havia pergunta com prazo** — uma delas _"vence
neste mês"_ — o painel mostrava o aviso velho, e o rótulo do botão nomeava uma carta que o
jogador nunca viu aberta.

⚠ **E O CONSERTO ENTROU PELA METADE, medido em 28/08/2026:** `openDispatch = null` foi escrito
só na virada do mês. **A posse não o limpava** — o botão "recomeçar" chega em `swearForm`, que
zera `orders`, `last`, `painted` e `standing` e não ele —, e o id do alarme **não carrega o
mês** (`alarm()` monta `kind:id`), então um `ceiling:ceiling` clicado na partida anterior
atravessava o recomeço e a bandeja abria ele em vez da mais urgente. ✔ **Fechado**, e sem prova:
o entrypoint não tem nenhuma, como os outros dois itens deste passo.

⚠ **E há um segundo defeito colado nele:** a linha marcada com `aria-current` fica **68px
abaixo da área visível** de `.tray__list`, com `scrollTop: 0` e nenhum `scrollIntoView`. O
jogador vê um documento à direita **sem nenhuma linha marcada à esquerda** — e a linha de tarja
vermelha lê como selecionada, e não é.

### 1½.2 · ✔ A bandeja abria a pergunta MENOS urgente

`newestFirst` não ordena `asking` entre si, e `state.mail` chega com a mais **nova** na frente
— que é a de prazo mais **longo**. **Medido:**

```
* reported:texto-m3:5 | vence em 1 mês    ← ABERTA
  reported:texto-m2:4 | vence neste mês   ← é a que expira
botão: "fecha sem resposta: Cortar aposentadoria urbana · e mais 17"   (= a outra)
```

**O botão avisa que a carta X fecha sem resposta, e a bandeja abre a carta Y.** É o item 3.3
visto pelo lado do gesto, e ele sobe de prioridade por causa disto.

### 1½.3 · ✔ A marca de lida não chegava ao disco

`app.mjs` grava só quando o **tamanho** do conjunto muda: `readMail.size !== before`. Quando a
poda remove um id morto e a leitura acrescenta um novo **na mesma pintura**, o tamanho não muda
e a escrita é pulada.

**Medido no jogo normal**, 8 meses só avançando: a tela tinha três lidas e o disco tinha outras
três, com uma carta **morta** entre elas — e a divergência durou quatro meses. Num caso limpo,
**6 das 7 cartas voltam como não-lidas** depois do F5.

### 1½.4 · ⚠ A poda do não-lido mede a TELA, e não a caixa

`alive` é montado das `.tray__row` renderizadas, e a bandeja corta em 7. Carta que ainda está
em `state.mail` — que guarda até 24 — mas caiu fora das sete **perde a marca de lida**. Medido:
o conjunto nunca passou de 7 em 10 meses; ele é limitado pela tela.

⚠ **Honestidade da medição:** a regressão visível — a carta voltar marcada como não-lida — não
foi reproduzida, porque correspondência nova chega todo mês e as escondidas não voltaram ao
topo. **O que está medido é a divergência entre disco e caixa.**

### 1½.5 · ⚠ Todo gesto destrói o foco do teclado

`paint()` reescreve `innerHTML` inteiro, e os três gestos da bandeja chamam `paint`. Medido: o
foco vai para `BODY` nos três casos, e voltar ao botão "Aceitar" que acabou de ser apertado
custou **oito Tabs**.

### 1½.6 · ⚠ O F5 no meio do mês apaga as respostas marcadas

`orders` é variável de módulo e só é persistido no avanço. Medido: duas respostas marcadas
somem no F5, e **o único sinal é o rótulo do botão voltar a cobrar o silêncio**.

---

## PASSO 2 — O PORTÃO APRENDE A VER

> ### ⚖ Nenhum item entra sem que o portão SAIBA VER o defeito que ele conserta.
>
> É a regra dura da Restrição 2 do ciclo 13, e ela vale aqui com força: **três dos defeitos
> acima atravessaram doze guardas, 253 provas e o passeio.**

| #       | a checagem                                    | por que hoje ela é cega                                                                     |
| ------- | --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **2.1** | ✔ **`checkClamped` entrou** — o quarto irmão  | recorte por linhas **não rola e não move `scrollHeight`**: a caixa só diagrama o que sobrou |
| **2.2** | toda carta que o motor produz chega à bandeja | nada compara o que a tela recebe com o que ela renderiza                                    |
| **2.3** | o índice não volta no calendário              | nada lê a sequência de divisores                                                            |
| **2.4** | a poda guarda as novas                        | ⚠ **a retenção não tem prova nenhuma, e nem é exportada** — nenhuma prova a alcança         |
| **2.5** | duas linhas do índice nunca leem igual        | o achado 24 foi dado como fechado **sem prova nenhuma**                                     |

⭐ **E ELA JÁ PAGOU UM ACHADO DE ORDEM, sem acusar nada:** o recorte de `.tray__subject` está em
**duas** linhas, e a prosa da folha ao lado dele diz _"três linhas e para"_. ⚠ **E o que as duas
linhas comem é exatamente a cauda que distingue duas cartas** — `"…Cortar atenção básica · e
mais 2"_ perde o fim, que é o único pedaço diferente entre as duas perguntas gêmeas do 3.4. **O
recorte trabalha contra o conserto do 3.4**, e os dois têm de ser decididos juntos.

⚠ **Verificada mordendo:** com um recorte de uma linha forçado, ela acusa `18>37`.

⛔ **MAS A EXCEÇÃO QUE EU DECLAREI ESTÁ ERRADA, e a geometria provou depois.** Eu excetuei
`.tray__subject` lendo a prosa da folha — _"o corte é decisão e não descuido"_ — e a medição
mostra que o corte come **66% das linhas** e faz 21 dos 24 meses terem duas linhas idênticas.
**Excetuei exatamente a peça quebrada**, que é a definição de checagem que mente.

⚖ **Ela sai quando o 3½.2 entrar, e não antes** — enquanto o índice cortar, remover a exceção
só deixa o portão vermelho sem consertar nada. **Fica declarado aqui como dívida do passo 3.**

⚠ **2.1 É A QUARTA VEZ QUE ESTA FAMÍLIA COBRA O MESMO PREÇO.** A lição já está escrita em
`docs/standards.md` §6 — _"toda checagem nasce sem alcance"_ — e a pergunta que falta é sempre
a mesma: **qual metade do problema ela ainda não vê.**

---

## PASSO 3 — ✔ FEITO · A BANDEJA PAROU DE MENTIR

### 3.1 · ✔ O fechamento do mês voltou

A carta assinada pela Casa Civil — o que o handoff chama de _"a única coisa que o mundo
escreveu"_ — entra na bandeja **por último**, fora da ordenação, e o corte por capacidade come
pelo fim. Ela some do mês 3 em diante e **não pode ser recuperada**: sem linha no índice, não
há o que clicar.

⚠ **E o achado 46 mede a coisa errada.** Ele registra a perda dessa carta **no F5**; a perda
real acontece **todo mês, sem recarga nenhuma**.

⭐ **O conserto é a causa, e não o sintoma:** ela tem mês e não tem prazo — ela **é** um aviso.
Entrando na ordenação como qualquer outro, ela cai no bloco do mês corrente, que é a frente da
fila, e o corte para de alcançá-la. **Uma linha movida.**

### 3.2 · ✔ A lista estourava a própria capacidade

- o corte **acrescenta o ofício aberto sem despejar ninguém**: com ele fora da janela, a lista
  devolve **oito linhas para uma capacidade de sete**. A prova que existe abre com o padrão,
  que cai sempre dentro da janela — **o ramo nunca é exercitado**;
  ⚠ **E O CONSERTO ATENDEU SÓ METADE DO RAMO, medido em 28/08/2026:** `room` é
  `capacity − perguntas`, e o guarda `kept.length > 0` impedia o despejo quando ele dava
  **zero** — o aberto entrava de graça. Medido: **6 linhas para uma capacidade de 5**, com cinco
  perguntas e um aviso aberto. ✔ **Fechado com a prova que nasceu antes e mordeu**
  (`6 !== 5`): sem vaga quem cede é a **preferência**, e o índice abre a de cima — a pergunta
  não se corta, e o documento nunca fica sem a linha ao lado;
- ⚠ **a capacidade conta cartas e ignora os divisores.** No mês 22 são **sete linhas mais
  cinco divisores** numa lista dimensionada para sete.
  ⭐ **E AS DUAS FRENTES DISCORDARAM AQUI — a medição direta ganha.** A frente da view concluiu
  que a lista _"rola em silêncio"_; a de geometria mediu a calha nas três janelas e achou
  **`overflowY: 0` com 13 `<li>` dentro de 627px**. **A lista não rola hoje.** O que sobra do
  achado é a margem: a constante não conta os divisores, então ela não sabe quanto ainda cabe.

⭐ **E O ITEM INTEIRO MORREU COM O TETO, por decisão dele:** com blocos de mês, cortar em sete
mostrava _"MAR"_ com 2 das 5 cartas do mês, e **um bloco pela metade mente sobre o mês**. O
teto, `fitted()` e a pilha saíram; quem absorve é a rolagem que `.tray__list` já declara no
portão. Medido depois: **29 cartas, 8 blocos, `overflowY` 1949px, zero rolagem lateral.** A
guarda do passeio que defendia o teto foi trocada por duas que mordem mais — **nenhuma carta
escondida** (linhas do índice = cartas do save) e **nenhum mês repetido**.

### 3.3 · ✔ O divisor de mês virou seção

Ele afirma **data** numa lista ordenada por **urgência**, e data numa lista que não é
cronológica mente. Medido, ele anda para trás e repete:

```
abr · 2028  →  mar · 2028  →  abr · 2028  →  out · 2027
```

### ⭐ A REPRODUÇÃO CANÔNICA É DELE, e ela é de três cartas

Eu achei este defeito com catorze meses de jogo ativo. **Ele achou no mês 2, apertando
"avançar" duas vezes numa partida nova** — e a reprodução curta é a que vale, porque ela cabe
num parágrafo e qualquer sessão futura consegue repetir:

```
JOGO NOVO      ── MAR · 2027 ──  O país que o senhor recebe

APÓS 1 MÊS     ── MAR · 2027 ──  Aprovação cai a 36%
                                 O país que o senhor recebe
                                 Mês sem pauta          ← a nova foi para o FIM

APÓS 2 MESES   ── ABR · 2027 ──  Aprovação cai a 31%
               ── MAR · 2027 ──  Aprovação cai a 36%
                                 O país que o senhor recebe
               ── ABR · 2027 ──  Mês sem pauta          ← abril outra vez
```

**Palavras dele: _"toda vez quando eu pulo os meses fica tudo desorganizado, tudo uma
bagunça"_.** E a leitura é literal — o calendário vai a abril, volta a março e avança de novo.

⭐ Ele passa a ser **seção**: um cabeçalho para o bloco que pede resposta, e mês só dentro dos
avisos — que são cronológicos de verdade. Junto: **entre perguntas, a mais urgente primeiro**,
porque hoje a ordem entre elas é indefinida.

**Altura: uma linha, na única peça do Gabinete que tem folga declarada.**

### ⚠ E ESTA DECISÃO FOI REVERTIDA POR ELE — a seção própria era metade do defeito

A seção consertava o calendário arrancando a pergunta dele, e o preço era o mês da pergunta
**não existir**: era exatamente isso que fazia duas gêmeas de JAN e FEV lerem a mesma frase
byte a byte, que é o item 3.4. **Palavras dele: _"mensagem do mês de março fica no bloco mês de
março… quero idêntico ao Football Manager"_.**

⭐ **O que vale agora é o calendário puro:** toda carta no bloco do mês em que chegou, meses do
mais novo para o mais velho, e dentro do bloco a ordem que o motor já monta — alarme, pergunta,
exigência, aviso, relatório. A pergunta se distingue pela **tarja** e pelo **prazo**, e não
pela posição. `sort` é estável, então a ordem do motor sobrevive sem a tela refazê-la.

### 3.4 · ✔ Duas perguntas ainda leem igual — resolvido pelo bloco do mês

⭐ **A saída não foi nenhuma das três medidas.** As três punham o mês do texto na linha — no fim
do assunto (+18px, e na carta não-lida a pastilha empurra o mês para a 4ª linha), em linha
própria (+70px) ou no lugar do remetente (0px). **O calendário puro do 3.3 as tornou
desnecessárias:** o cabeçalho do bloco já diz o mês.

**Medido depois da mudança, 8 blocos e 29 cartas:** 12 pares de linhas idênticas no índice
inteiro, e **zero dentro do mesmo bloco** — o mês separa todas. Capturas em
`captures/decisoes/mes-no-indice/`.

⚠ **O que reabre o item:** duas cartas gêmeas no MESMO mês, que esta partida não produziu. Aí o
bloco não separa, e a medida C (o mês no lugar do remetente, custo zero) é a que estava pronta.

#### O achado original, que continua descrevendo o defeito

O achado 24 previu o dia: _"deixa de ser cosmético quando o jogador tiver duas perguntas
abertas e precisar escolher entre elas"_. **O dia chegou, e é reproduzível em catorze meses de
jogo ativo** — assunto idêntico, remetente idêntico, e só a linha de prazo, que é a menor e
mais apagada, separando as duas.

⛔ **Estender a tag de espécie não serve:** as duas são da **mesma** espécie, então a tag seria
idêntica também.
⭐ **O que serve é de graça:** a carta do relator nomeia **o texto de que ela fala** — a gaveta
já está no entrypoint, e o mês em que o texto foi assinado distingue os dois.

⚠ **E a raiz fica registrada, fora deste ciclo:** quem dá o mesmo nome a dois textos é
`labelOf`, em `src/application/agenda.mjs`. Mexer ali atinge cinco telas — é decisão dele, e é
maior que a Caixa.

---

## PASSO 3½ — A GEOMETRIA · save: zero

> Medido em três janelas (1440×980, 1440×900, **1280×800**) e 24 meses. ⚠ **A terceira janela
> não é capricho: o passeio não roda nela, e é lá que três defeitos aparecem inteiros.**

### 3½.1 · ⛔ A carta que PERGUNTA sangra 7px por cima do índice

`styles/45-screen-cabinet.css` — `.letter[data-urgency]` declara `padding-left` de **13px** com
a **mesma especificidade** de `.tray__open .letter { padding: 24px }`, e vem **depois** na
folha. As margens negativas do cabeçalho e do rodapé passam a valer sobre o recuo errado.

Sobreposições medidas, iguais nas três janelas: cabeçalho × divisor de mês **7×27,5px**;
cabeçalho × linha **7×32,7px**; rodapé × linha **7×54,69px**.

⚠ **E o efeito visível é pior que a sobreposição: a tarja de gravidade SOME** nos trechos do
cabeçalho e do rodapé — **146px dos 629 da folha, 23%** —, e fica um degrau na costura. **É a
única carta do jogo que pede resposta**, e a tarja é o canal que diz que ela tem prazo.

### 3½.2 · ✔ O recorte faz duas linhas virarem a MESMA frase

⭐ **Fechado com `-webkit-line-clamp: 4`.** Medido depois, na mesma partida de 28 cartas:
**20 assuntos cortados → 0**, e o custo é 403px de rolagem numa lista que já rola por decisão
do 3.2. ⚠ **E a exceção declarada do portão morreu junto:** `checkClamped` isentava
`.tray__subject` porque o corte em duas linhas era desenho; em quatro não há corte, e o índice
passa a ser guardado como o resto da tela.

24 meses medidos: **111 de 168 linhas (66%) perdem texto**, e em **21 dos 24 meses** duas linhas
diferentes renderizam string idêntica.

```
"O seu texto morreu na gaveta: Ampliar…"  ← Ampliar universidades federais · e mais 3
"O seu texto morreu na gaveta: Ampliar…"  ← Ampliar aposentadoria urbana · e mais 5
```

⚠ **O sufixo `· e mais N` NUNCA aparece** — a caixa dá 2 linhas de 18,36px e o conteúdo pede 3
ou 4. **É a causa raiz do item 3.4**, e ela é maior do que eu tinha medido: não são duas
perguntas gêmeas, são dois terços do índice inteiro perdendo o fim.

### 3½.3 · ⛔ A 1280×800 o anexo corta a coluna da SOMA

| anexo                        | visível | pede | escondido                                      |
| ---------------------------- | ------- | ---- | ---------------------------------------------- |
| "o que pesou em cada classe" | 307     | 390  | **83px** — a soma inteira mais 69% de economia |
| "bancada por bancada"        | 281     | 338  | **57px** — o mês inteiro mais 7px de humor     |

**A 1440 as quatro tabelas cabem com 0px de folga.** O portão pegaria — `checkClipped` vê
`overflow-x` — mas **não roda a 1280 e não abre relatório**.

### 3½.4 · ⛔ A 1280×800 as duas saídas ficam inteiras abaixo da dobra

| janela                      | rodapé abaixo da dobra |
| --------------------------- | ---------------------- |
| 1440×980                    | 0                      |
| 1440×900                    | 41,7px — parcial       |
| **1280×800**, bandeja cheia | **150,4px — inteiro**  |

A página rola, mas **nada anuncia que "Aceitar a emenda" e "Travar o texto" existem.**

### 3½.5 · ⚠ E mais cinco, de desenho

- **a data do ofício quebra em duas linhas** a 1280 — sem `nowrap`, lê "MAR ·" / "2027" na
  primeira tela do jogo;
- **a mesma data, duas vezes, na mesma linha** — o divisor e o cabeçalho são sempre a mesma
  string, tipograficamente idênticos, e as caixas se sobrepõem **72% na vertical**;
- **o cabeçalho sem remetente tem 15,8% de tinta** — 354px de faixa vazia. Quatro espécies
  saem com `from: null` e o `<span>` vazio ainda consome o vão;
- **o documento pula até 48px** ao trocar de linha, porque o cabeçalho varia 40px de altura;
- **três níveis estruturais com o mesmo vão de 12px** — assunto→corpo, parágrafo→parágrafo,
  corpo→anexos.

### ⚠ E um buraco no próprio passeio

`checkEllipsized` **não é chamado no bloco "caixa com pergunta"** — que é justamente o estado
em que `.tray__from` corta o nome do relator (6px a 1440, 10px a 1280). A checagem existe, vê o
defeito, e não é chamada onde ele mora.

---

## PASSO 4 — A FOLHA PARA DE SER 75% BRANCA

**Quatro espécies são estruturalmente vazias** — a Mesa pautou, o texto morreu na gaveta, o
plenário derrubou, e o teto fechou: nenhuma tem anexo nem rodapé.

⚠ **E DUAS ESVAZIAM DEPOIS DE RESPONDIDAS.** Na emenda e na chantagem, o rodapé de escolhas é
o **único** rodapé, e ele some quando a resposta é gravada. **A carta que pergunta fica vazia
exatamente depois de o jogador decidir** — no instante em que ela deveria confirmar o que ele
acabou de fazer.

⚠ **E ISTO JÁ FOI DADO COMO CONSERTADO UMA VEZ.** A prosa de `src/ui/screens/inbox.mjs`
registra _"cabeçalho, assunto e 430px de papel em branco"_, e o conserto foi dar **uma linha
de corpo** a cada carta. **Uma linha não preenche 620px** — elas saíram de 430 para 468. O
conserto atacou o corpo vazio; o defeito é a **folha esticada**.

⭐ **O conserto é anexo, e o motor tem o número das três que importam:** a fração da bancada
com que a Mesa pautou, o placar do plenário com a deriva do dia, e o que sai do texto se a
emenda for aceita. **Nada inventado, e a altura já está lá — vazia.**

### ⚠ A única decisão de save deste ciclo

As cartas antigas não guardam o placar: o aviso grava espécie, id, assunto e mês, e nada mais.

1. **anexo só na carta do mês corrente** — save **zero**, e declarável. Mas a mesma carta fica
   rica hoje e pobre no mês que vem, e isso é pior que a pobreza uniforme;
2. ⭐ **a carta guarda o placar** — **um bump**, e ele viaja com os dois que já esperam decisão
   dele: o `last` do achado 46 e o stream de eventos morto. **Três mudanças num bump custam o
   mesmo que uma.**

**Eu faria a 2**, e a razão é a fila: os bumps já estão pendurados, e adiar não os torna mais
baratos.

---

## PASSO 5 — OS CANAIS MORTOS E AS UNIDADES TROCADAS

| #       | o quê                                                                                                                                                                                                              | gravidade        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| **5.1** | ⛔ **a traição e o desgaste chegam no anexo e são descartados.** `src/ui/strings.mjs` promete em prosa um **pé de tabela que não existe**, e **a coluna da soma não reconcilia com a manchete**. Sexto canal morto | perde informação |
| **5.2** | ⛔ **a carta de cadeiras diz "11 pontos" onde são 11 cadeiras** — a família do `2166%`: o formatador carrega a unidade, e **nenhuma prova de igualdade alcança**                                                   | perde informação |
| **5.3** | **o tamanho da Câmara está digitado à mão** em duas frases de `src/ui/strings.mjs`, com o motor tendo o número — e a carta do cerco lendo do motor, ao lado                                                        | perde informação |
| **5.4** | exigência de um grupo desconhecido imprime assunto começando por `": "` — a irmã dela tem defesa, esta não                                                                                                         | perde informação |
| **5.5** | o peso da carta é gravado **no save** e não tem leitor nenhum — candidato ao mesmo bump                                                                                                                            | código morto     |
| **5.6** | o alarme de fervura grava quem fala, e a view **sobrescreve** com a Casa Civil                                                                                                                                     | código morto     |
| **5.7** | o prazo nunca devolve dois, então a faixa larga da tarja e o plural de "meses" são **inalcançáveis**                                                                                                               | código morto     |
| **5.8** | **escape duplo** na exigência e na fervura — não dispara com o catálogo de hoje, e dispara **no dia em que um rótulo tiver `&`**. O catálogo vai ser editável                                                      | latente          |

---

## ✔ O QUE FOI VERIFICADO E ESTÁ CERTO

Registrado para a próxima sessão **não reinvestigar**:

- **nenhuma colisão de id** em cinco políticas × 48 meses. Os formatos não se cruzam, e o
  aviso de relatoria não existe — só a emenda usa aquele prefixo;
- **o prazo é de dois meses de verdade**, e a resposta é lida **antes** da checagem de
  vencimento: o jogador tem duas chances, e nenhuma carta vence antes de ser mostrada;
- **a pergunta aberta nunca é podada**, nem no caso de estouro;
- **o silêncio cobrado no botão está certo** — ele reusa a mesma função do turno e lê o que foi
  resolvido **antes** da poda, então o corte da bandeja não apaga um silêncio;
- **os três anexos do relatório sempre existem**, e a view protege contra a ausência mesmo
  assim;
- **a cobertura de espécies é completa** — as quinze do tipo têm caso na view, e o caso padrão
  é inalcançável hoje;
- **o escape está correto em todo o resto** — nome, cargo, assunto, rótulo de catálogo,
  atributo. Os dois furos são os do 5.8;
- **a carta de posse some no mês 28**, coerente com a retenção declarada.

---

## ⛔ O QUE ESTE CICLO RECUSA

| pedido                                       | por quê                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **travar o avanço com pergunta aberta**      | recusado no ciclo 9 e de novo no 10. Ignorar **custa**; não é impossível                      |
| **esconder informação atrás de hover**       | recusado no C11 — atrás de hover é ausente para quem não passa o mouse                        |
| **a folha encolher para o tamanho do corpo** | o vazio migra para **fora** da folha, numa coluna de altura fixa. Fica pior                   |
| **segundo significado na tarja de cor**      | ela mede **tempo**. Um canal dizendo duas coisas é o defeito que a coluna da direita já pagou |
| **pauta sugerida dentro da carta**           | é a pauta pronta que o ciclo 2 matou                                                          |

---

## 🔢 A ORDEM, E POR QUE ELA É ESSA

| passo | o quê                        | save                    | por que nesta posição                                           |
| ----- | ---------------------------- | ----------------------- | --------------------------------------------------------------- |
| **1** | o motor: poda, fervura, teto | zero                    | a poda decide **quais** cartas a bandeja recebe                 |
| **2** | as cinco checagens           | zero                    | Restrição 2 — três defeitos atravessaram o portão inteiro       |
| **3** | a bandeja: 3.1 a 3.4         | zero                    | não adianta encher uma folha que o índice não deixa abrir       |
| **4** | os anexos                    | zero **ou** um bump     | decisão dele                                                    |
| **5** | canais mortos e unidades     | zero; o 5.5 vai no bump | independentes entre si, e entram a qualquer momento depois do 2 |

⚠ **Calibrar a capacidade da lista antes de consertar a poda é calibrar contra uma caixa que
vai mudar.** É a mesma razão pela qual o passo 0 do ciclo 13 não era escolha.

## As três decisões que são dele

1. **o bump do passo 4** — junto com o `last` e o stream morto, ou anexo só no mês corrente;
2. **se `labelOf` entra no escopo** — ele é a raiz do 3.4 e atinge cinco telas;
3. **a dívida do ciclo 9 §7**: a carta de posse prometeu **três** leituras e entrega **uma**.
   ⚠ Ela colide de frente com o **C5/C6 do Glorioso**, que transforma essa mesma carta na
   primeira pergunta do mandato. **Recomendo que não entre aqui** — reformar a posse duas vezes
   é o desperdício que o plano mestre existe para evitar.
