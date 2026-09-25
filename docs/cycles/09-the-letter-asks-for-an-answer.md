# Ciclo 9 — a carta pede resposta · ✔ FEITO em 16/08/2026

> Escrito e executado em 16/08/2026. **O jogador ganhou um verbo dentro da
> tramitação**: a emenda do relator passou a ser uma pergunta com prazo.
>
> Ele nasce de três lugares que convergiram: o item que ficou de fora do ciclo 6
> (`state.mail`), a melhor ideia do sexto dossiê externo (a emenda vira pergunta) e o
> sétimo, que mostrou que **a primeira tela do jogo tem a peça central vazia**.
>
> **A Parte A do [ciclo 7](07-congress-gets-faces.md) saiu junto**, como passo 0. O
> [ciclo 8](08-the-map-and-the-trail.md) segue proposta e não começada.

## O problema, medido

O jogador tem **um verbo**: escrever o orçamento e pagar bancada. Todo o resto ele
assiste.

A tramitação é a peça mais sofisticada do projeto — Mesa, relatoria, plenário — e do
lado do jogador ela é **inteiramente passiva**. Medido em 16/08: a política `agenda`
aprova **3 de 24** textos em 48 meses. O presidente escreve 24 leis, 21 morrem, e ele
não pode fazer **nada** sobre nenhuma delas: vê a Mesa engavetar, vê o relator emendar,
avança o mês.

> **Um sistema profundo que o jogador não pode tocar não é profundidade — é uma
> cutscene de 48 meses.**

E a Caixa de Entrada não conserta isso hoje, porque ela é um mural: mostra só as cartas
do mês corrente, e as anteriores somem sozinhas.

## A decisão central: as duas metades são UMA obra

Eu vinha propondo `state.mail` primeiro e o verbo depois, **e revi**. Sozinho,
`state.mail` acumula **avisos** — "a Mesa pautou", "o texto morreu na gaveta". Pela
regra escrita no ciclo 6, **só carta que pergunta merece prazo**; aviso com contagem
regressiva é ansiedade decorativa.

> Fazer o encanamento sem a pergunta seria construir a bandeja e enchê-la de papel que
> não pede nada — a moldura antes do quadro, que é o erro que este projeto já registrou
> duas vezes.

## As decisões de desenho

### 1. ⚠ O que se guarda é o FATO, nunca a prosa

A carta no estado é `{ id, kind, month, due, bill, terms, answer }`. **O texto dela
continua saindo de `src/ui/screens/inbox.mjs`**, que segue sendo a única porta que
transforma fato em prosa.

Guardar o texto renderizado colocaria dois lugares produzindo a mesma carta — o defeito
que este projeto encontrou **quatro vezes**, o último custando 27,2% dos vereditos
anunciados.

### 2. ⚠ A resposta é uma ORDEM, e não uma mutação à parte

`orders.mail = { [id]: "accept" | "block" }`, resolvida no turno como o orçamento.

Havia a alternativa de uma segunda ação no reducer — responder agora, fora do turno. Foi
recusada: **o vencimento acontece dentro do turno**, e se a resposta acontecesse fora
dele haveria dois caminhos mutando a mesma carta, com o pior dos dois vencendo na
ordem errada. Um caminho é o turno.

### 3. ⚠ Nem toda carta tem prazo, e essa divisão é a mecânica

| natureza     | tem prazo? | exemplo                                  |
| ------------ | ---------- | ---------------------------------------- |
| **pergunta** | **sim**    | o relator emendou: aceitar ou travar?    |
| aviso        | não        | a Mesa pautou · o texto morreu na gaveta |

Prazo em aviso é relógio sem decisão. **É o prazo que separa uma bandeja de uma lista
de tarefas**, e ele só existe onde há o que responder.

### 4. ⚠ A carta DIZ o que acontece se ela vencer

O sétimo dossiê pede o contrário — _"se o prazo estourar, a sua base despenca
automaticamente, **sem aviso prévio**"_ —, e isso é o inverso da doutrina: informação
que chega depois da decisão é recibo.

> **É saber o preço do silêncio que transforma ignorar em ESCOLHA.** Vencimento
> surpresa ensina o jogador a desconfiar da tela; vencimento anunciado ensina a
> priorizar.

### 5. O silêncio ACEITA — e isso não é castigo inventado

Prazo vencido sem resposta: **a emenda do relator vale**. É como uma tramitação real
anda, e é o que faz o prazo doer sem o motor fabricar uma punição.

### 6. O preço dos dois lados, e nenhum é de graça

| escolha           | custa                                                                |
| ----------------- | -------------------------------------------------------------------- |
| **aceitar**       | a alavanca salva sai do texto **para sempre** — a reforma vale menos |
| **travar**        | o texto volta à gaveta, e **o relógio dela não reinicia**            |
| **não responder** | vence, e o silêncio vale como aceite                                 |

⚠ **O preço de travar é TEMPO, e ele é real sem inventar número:** o texto volta para a
gaveta com o `writtenAt` intacto, então os seis meses de `DRAWER_LIFE` continuam
correndo, e ele precisa ser pautado **de novo** por uma Mesa que pode não querer mais.
Travar pode matar o texto pelo relógio, e essa é a aposta.

⚠ **O que foi CONSIDERADO E ADIADO:** cobrar também na memória do relator, pelo
trabalho recusado. Seria o preço mais expressivo, e exigiria um canal novo em ELENCO —
`remember` credita por verba prometida e paga, e uma ofensa não é um calote. Fica
registrado: **o preço de travar hoje é só o relógio**, e se a calibragem mostrar que é
barato demais, o canal da ofensa é o lugar certo de mexer.

### 7. O mandato COMEÇA com correspondência

O sétimo dossiê abriu o jogo e descreveu a Caixa de Entrada como _"um bloco de texto
estático aguardando a mecânica"_. Ele estava vendo o **estado vazio do mês 1** — e o
diagnóstico continua valendo mesmo assim:

> **A primeira tela do jogo tem a peça central vazia.** O Gabinete é 3fr de Caixa de
> Entrada contra 2fr de cartões, e no minuto zero a coluna maior não tem nada. É o pior
> momento do jogo, e é o primeiro.

O conserto não é carta falsa: é a **carta de posse**, em que a Casa Civil entrega a
herança — quanto da despesa é obrigatória, o que o orçamento herdado já consome, quem
trava cada rubrica. **Tudo isso é dado real que já existe nos motores.** É aviso, e
portanto não tem prazo.

### 8. A tarja de gravidade sai VERMELHA, e a pergunta do ciclo 6 fecha

O ciclo 6 adiou a cor. Ela é o vermelho semântico que já existe, e aqui ele é coerente:
**uma carta prestes a vencer é crise**. Não editorializa nada — é o que a cor já
significa no resto do jogo.

⚠ **E ela mede TEMPO, não importância.** A tarja é a gravidade do relógio; um assunto
grave com prazo largo não é urgente, e é exatamente essa distinção que o jogador precisa
para escolher o que responder primeiro.

## O que entra no schema 15

O save **recusa** versão diferente em vez de converter — cada bump custa uma partida ao
responsável. Então o que couber entra junto.

| entra                                        | por quê                                                                    |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| **`state.mail`**                             | o ciclo                                                                    |
| **a série dos oito índices de área**         | tem consumidor no primeiro dia, e **mata o achado 15**                     |
| ⚠ **NÃO entra: a série da posição (rastro)** | não tem consumidor até o mapa existir — série que ninguém lê é **andaime** |

O rastro é a Parte A do [ciclo 8](08-the-map-and-the-trail.md), e o argumento de "não pagar
dois bumps" é bom. Perde para uma regra mais antiga: **este projeto não guarda o que
ninguém consome.** Ele entra com o mapa.

## O que este ciclo NÃO faz

- **não recalibra a tramitação.** Ela vem depois, e a razão é a de sempre: não se
  calibra uma mecânica que o jogador não consegue jogar. Este ciclo é o que a torna
  jogável;
- **não cria mecânica de sigilo** (tarja preta) — não há mecânica atrás;
- **não hachura a Rua abaixo de 15%** — recusado duas vezes, e prometeria uma convulsão
  social que **não existe** (achado 20). Interface prometendo mecânica ausente é a pior
  classe de defeito deste projeto;
- **não faz o hemiciclo pulsar em crise** — o preenchimento já significa "entregue ao
  governo × não entregue", e somar crise ao mesmo canal faz um canal dizer duas coisas;
- **não torna a leitura da Casa Civil dinâmica** — ⚠ **ela já é**: as três frases saem
  do relatório do turno, e nenhuma é escrita para um caso. O dossiê pediu o que existe.

## O plano de execução

**0. ⚠ Antes de escrever a primeira carta nova: a Parte A do
[ciclo 7](07-congress-gets-faces.md)** — o vocabulário de nomes. Ele hoje só produz
nome de coronel de 1890, e **o nome entra em todo texto gerado**: assinatura da leitura,
remetente de cada carta, dossiê da bancada. Este ciclo escreve **duas cartas novas** —
a de posse e a do relator. Trocar o vocabulário depois obriga a reler as duas de novo, e
reler carta é o trabalho que este projeto já fez três vezes por não ter feito na ordem.
É a única coisa dos ciclos 7 e 8 que se mistura com este, custa duas listas, e não toca
em motor, prova nem estado.

1. **`state.mail` e o schema 15** — o tipo, o estado inicial com a carta de posse, o
   reducer, o save recusando a 14, e a série de índices de área junto;
2. **`src/application/mail.mjs`** — sem codinome, como `passage.mjs`: nada ali inventa
   preço. Chegada, vencimento e resposta;
3. **o texto espera a resposta** — `advanceBills` deixa de mandar o emendado direto ao
   plenário;
4. **a Caixa de Entrada** — carta com prazo, tarja de gravidade e as duas ações;
5. **as provas**, e cada uma verificada mordendo;
6. **`walk` e a captura**, porque é tela; **`simulate`**, porque muda a série.

---

## O que a execução ensinou

### ⚠ O defeito que só a simulação pegou — e ele TRAVAVA, não derrubava

`pending` consultava `state.mail`, a caixa de **antes** do fechamento do mês. A carta
que o jogador acabava de responder ainda constava como aberta, então o texto esperava
por ela **para sempre**.

Medido em oito meses de mandato, nas três saídas — aceitar, travar e silenciar —,
**nenhum texto saiu da relatoria em nenhuma delas**, e a tramitação inteira deixou de
existir. Tipo verde, nove guardas verdes, 194 provas verdes, passeio verde.

> **A classe é conhecida: ler o estado ANTES do passo que o próprio turno acabou de
> dar.** É a mesma família do achado 14, em que a MALHA lia o nível **pedido** depois
> de a tramitação ter separado pedido de aplicado.

E ele é de um tipo que a bateria de provas não alcançava por construção: **ele não
produz resultado errado, produz ausência de resultado.** Nada fica vermelho quando um
sistema simplesmente para de acontecer. A prova que o acusa foi escrita depois e
verificada mordendo — revertida, ela diz _"a pergunta respondida continuou segurando o
texto"_.

### ⚠ O defeito que só a imagem pegou — a unidade trocada

A carta de posse imprimiu **"2166% da despesa é obrigatória"**. A obrigatória é
R$ 2.166 bi, e ela saiu vestida de porcentagem: `seats` no lugar de `money`.

> **É de forma, e não de descuido: o formatador carrega a UNIDADE**, e escolher o
> errado troca a unidade sem trocar o valor — o único erro de exibição que nenhuma
> prova de igualdade alcança. Quarta vez que a captura pega o que o resto não pega.

### A série NÃO mudou, e isso é o resultado desenhado

| política     | dívida/PIB antes do ciclo | **depois** | votações |
| ------------ | ------------------------- | ---------- | -------- |
| `herdado`    | 83,6%                     | **83,6%**  | 0 de 0   |
| `agenda`     | 84,8%                     | **84,8%**  | 3 de 24  |
| `base`       | 85,5%                     | **85,5%**  | 0 de 0   |
| `promessa`   | 87,7%                     | **87,7%**  | 0 de 2   |
| `piso`       | 86,3%                     | **86,3%**  | 0 de 0   |
| `explorador` | 86,9%                     | **86,9%**  | 0 de 0   |

**Idêntica, casa por casa.** E ela é o inverso de "não mudou nada": uma sonda que
força emenda produziu **17 perguntas em 48 meses, todas vencidas por silêncio** — e
vencer por silêncio dá exatamente o que o jogo dava antes, porque antes a emenda valia
sozinha.

> **A migração está provada inerte, e o que o ciclo acrescenta é AGÊNCIA.** Quem não
> decide nada joga o jogo de ontem; quem decide joga outro. É o mesmo padrão de prova
> que validou a migração do motor de normas.

### O passo 0 saiu junto — e ele achou um defeito próprio

O vocabulário de nomes perdeu o andar social único: 42 primeiros nomes atravessando
três gerações, 31 sobrenomes com o composto virando minoria — porque composto só
significa **linhagem** enquanto não for o padrão da casa.

⚠ **E a troca revelou que o desempate de homônimos media a coisa errada.** Ele
comparava o nome **inteiro**, e com vocabulário largo saíram _"Cláudio Espíndola"_ e
_"Cláudio Itaparica"_ na mesma partida, e _"Adriano Espíndola"_ ao lado de _"Eurico
Espíndola"_. Nomes completos distintos, prova verde, e o jogador lendo dois Cláudios.

Numa Câmara de 513 dois Cláudios são verossímeis. **Estas são oito pessoas com nome —
as únicas que o jogador precisa distinguir —, e a tela as cita lado a lado.**
Verossimilhança estatística não paga confusão de leitura. A prova passou a cobrar por
pedaço, e foi verificada mordendo.

### O passeio nunca tinha visto uma carta que pergunta

Ele visitava o Gabinete no mês 1, onde a caixa só tem a carta de posse. Para chegar à
relatoria ele precisou aprender duas coisas que são **mecânica, e não conveniência de
teste**:

- **furar o piso**, porque movimento dentro da faixa é execução orçamentária e não
  tramita — não vai à gaveta, não vai ao relator, e não produz pergunta nenhuma;
- **pagar a bancada**, porque sem isso a Mesa nunca pauta e o texto morre na gaveta em
  seis meses sem nunca chegar ao relator.

Um passeio que só aperta "avançar" jamais veria a relatoria acontecer — e a peça
central deste ciclo não apareceria em captura nenhuma.

### O que ficou registrado para depois

- **o preço de travar é só o relógio.** Cobrar também na memória do relator, pelo
  trabalho recusado, exigiria um canal novo em ELENCO — `remember` credita por verba
  prometida e paga, e uma ofensa não é um calote. Se a calibragem mostrar que travar é
  barato demais, o canal da ofensa é o lugar certo de mexer;
- **rótulo de texto não distingue texto.** Dois projetos escritos em meses diferentes
  com o mesmo movimento têm o mesmo rótulo, e a bandeja mostra duas cartas
  aparentemente idênticas. Hoje é cosmético; deixa de ser quando o jogador tiver de
  escolher entre dois.

---

## ⚠ Uma tentativa de reverter isto já chegou, e está recusada

O oitavo dossê externo pede, no dia seguinte a este ciclo:

> _"O botão de Avançar fica bloqueado até que todas as cartas com tarja vermelha sejam
> resolvidas. O jogo não avança se você ignorar a bomba relógio."_

**É o inverso exato do que este ciclo entregou**, e a recusa está registrada no
[ciclo 10](10-who-brings-down-a-president.md). O resumo: bloquear o turno não torna a
carta importante — torna-a **obstáculo de fluxo**. O jogador para de decidir e passa a
limpar fila, e some a jogada mais interessante que existe aqui: **deixar essa vencer
para poder cuidar daquela**.

O medo por trás da proposta é legítimo, e a resposta já está no código: **fazer ignorar
custar, e não fazer ignorar ser impossível.**
