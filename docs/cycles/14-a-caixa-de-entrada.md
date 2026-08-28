# Ciclo 14 — a Caixa de Entrada

> ⚠ **O PASSO 1 ESTÁ FEITO; DO 2 AO 5, NÃO.** Escrito em 28/08/2026 a pedido dele — _"eu estou
> vendo diversos bugs, brechas, visual feio e tudo mais, na caixa de entrada. Eu quero testar
> sua capacidade investigativa"_ —, e executado a partir do passo 1 na mesma data.
>
> ⚠ **E ELE CONTINUA INCOMPLETO POR DECLARAÇÃO.** A investigação abriu quatro frentes. **Duas
> fecharam** — o motor da correspondência e a view — e são a origem de tudo o que está aqui.
> **Duas morreram no limite de sessão** e foram relançadas: o _wiring_ do entrypoint
> (`openDispatch`, o não-lido, a ordem dos gestos, o F5) e a **geometria medida no navegador**
> (truncamento por recorte, contraste no par renderizado, ritmo vertical, terceira janela).
>
> **O que elas acharem entra aqui antes do passo 3.** Este plano não é uma lista fechada.

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

## PASSO 2 — O PORTÃO APRENDE A VER

> ### ⚖ Nenhum item entra sem que o portão SAIBA VER o defeito que ele conserta.
>
> É a regra dura da Restrição 2 do ciclo 13, e ela vale aqui com força: **três dos defeitos
> acima atravessaram doze guardas, 253 provas e o passeio.**

| #       | a checagem                                     | por que hoje ela é cega                                                             |
| ------- | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| **2.1** | `checkClamped` — o **quarto irmão** do passeio | recorte por linhas **não rola e não põe reticência**: os três irmãos não veem       |
| **2.2** | toda carta que o motor produz chega à bandeja  | nada compara o que a tela recebe com o que ela renderiza                            |
| **2.3** | o índice não volta no calendário               | nada lê a sequência de divisores                                                    |
| **2.4** | a poda guarda as novas                         | ⚠ **a retenção não tem prova nenhuma, e nem é exportada** — nenhuma prova a alcança |
| **2.5** | duas linhas do índice nunca leem igual         | o achado 24 foi dado como fechado **sem prova nenhuma**                             |

⚠ **2.1 É A QUARTA VEZ QUE ESTA FAMÍLIA COBRA O MESMO PREÇO.** A lição já está escrita em
`docs/standards.md` §6 — _"toda checagem nasce sem alcance"_ — e a pergunta que falta é sempre
a mesma: **qual metade do problema ela ainda não vê.**

---

## PASSO 3 — A BANDEJA PARA DE MENTIR · save: zero

### 3.1 · O fechamento do mês volta, e hoje ele é inalcançável

A carta assinada pela Casa Civil — o que o handoff chama de _"a única coisa que o mundo
escreveu"_ — entra na bandeja **por último**, fora da ordenação, e o corte por capacidade come
pelo fim. Ela some do mês 3 em diante e **não pode ser recuperada**: sem linha no índice, não
há o que clicar.

⚠ **E o achado 46 mede a coisa errada.** Ele registra a perda dessa carta **no F5**; a perda
real acontece **todo mês, sem recarga nenhuma**.

⭐ **O conserto é a causa, e não o sintoma:** ela tem mês e não tem prazo — ela **é** um aviso.
Entrando na ordenação como qualquer outro, ela cai no bloco do mês corrente, que é a frente da
fila, e o corte para de alcançá-la. **Uma linha movida.**

### 3.2 · A lista estoura a própria capacidade, por duas vias

- o corte **acrescenta o ofício aberto sem despejar ninguém**: com ele fora da janela, a lista
  devolve **oito linhas para uma capacidade de sete**. A prova que existe abre com o padrão,
  que cai sempre dentro da janela — **o ramo nunca é exercitado**;
- ⚠ **a capacidade conta cartas e ignora os divisores.** No mês 22 são **sete linhas mais
  cinco divisores** numa lista dimensionada para sete. `.tray__list` rola por dentro, e a
  rolagem dela é a **exceção declarada** do passeio — então **nada acusa**.

### 3.3 · O divisor de mês vira seção

Ele afirma **data** numa lista ordenada por **urgência**, e data numa lista que não é
cronológica mente. Medido, ele anda para trás e repete:

```
abr · 2028  →  mar · 2028  →  abr · 2028  →  out · 2027
```

⭐ Ele passa a ser **seção**: um cabeçalho para o bloco que pede resposta, e mês só dentro dos
avisos — que são cronológicos de verdade. Junto: **entre perguntas, a mais urgente primeiro**,
porque hoje a ordem entre elas é indefinida.

**Altura: uma linha, na única peça do Gabinete que tem folga declarada.**

### 3.4 · Duas perguntas param de ler igual

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
