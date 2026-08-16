# Ciclo 7 — o Congresso tem cara · ⚠ PARTE A FEITA; B e C não começadas

> Escrito em 16/08/2026 a partir do **quinto dossiê externo** ("Operação Sala de
> Guerra: aba Congresso & Leis + motor ELENCO") e da verificação dele contra o código.
>
> ✔ **A Parte A SAIU em 16/08/2026**, como passo 0 do ciclo 9 — o vocabulário perdeu o
> andar social único, e a troca revelou que o desempate de homônimos media a coisa
> errada. Ver _O que a execução ensinou_ no
> [ciclo 9](09-a-carta-pede-resposta.md).
>
> **As Partes B e C seguem não começadas.**

## O que o dossiê viu, e por que este é o melhor achado dos cinco

Todos os dossiês anteriores foram sobre **interface genérica** — sombra, textura,
serifa, hierarquia. Este é o primeiro que olha para o **conteúdo** e faz uma
observação que só faz sentido no Brasil:

> _"Pare de gerar exclusivamente nomes triplos imperiais. O jogo precisa de **nomes de
> urna**. A silhueta do nome deve contar a origem política do parlamentar."_

**Ele está certo, e é pior do que ele diz.** Verificado em `src/data/cast.mjs`:

| lista         | o que ela contém                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| `GIVEN_NAMES` | 25 nomes, **todos arcaicos** — Belarmino, Custódio, Godofredo, Marcolino, Prudêncio, Teodolino, Ubirajara |
| `SURNAMES`    | 22 sobrenomes, **a maioria composta** — Caldeira Nunes, Guimarães Passos, Hollanda Cavalcanti             |

> **Não existe combinação possível que não soe a coronel de 1890.** É viés de
> **matéria-prima**, e não de sorteio: nenhuma semente conserta isso, porque não há o
> que sortear. O gerador tem entropia; o vocabulário é que tem um andar social só.

E o efeito não fica no cadastro: **todo texto gerado carrega o nome** — a assinatura
da leitura do mês, o remetente de cada carta da tramitação, o dossiê da bancada. Um
viés de vocabulário é um viés de **voz do jogo inteiro**.

## ⚠ Mas o conserto que ele propõe não encaixa — e a razão importa

Ele quer _"chance de gerar patente (Pastor, Delegado, Professora, Coronel) somada a um
sobrenome simples"_. Duas objeções, e a segunda é estrutural:

**1. Sorteado, o título é enfeite.** A regra do projeto é que nada mostrado é
infundado. Um título tirado de uma tabela paralela não diz nada sobre a pessoa — é
sabor, e sabor é o que este projeto recusa desde o ciclo 2.

**2. ⚠ E o mais importante: as oito pessoas do jogo são TODAS de liderança.**

| arquétipo                | cargo                |
| ------------------------ | -------------------- |
| `speaker-centrao`        | cacique da Mesa      |
| `senate-centrao`         | chefe do Senado      |
| `rapporteur-centrao`     | relator de orçamento |
| `leader-esquerda`        | líder da esquerda    |
| `leader-centro-esquerda` | líder do centro      |
| `leader-centrao`         | líder do Centrão     |
| `leader-direita-liberal` | líder liberal        |
| `chief-of-staff`         | chefe da Casa Civil  |

**Pastor, Delegado e Professora não são líderes de bloco — são bancada temática.** Um
líder do Centrão que negocia relatoria de orçamento _é_, de fato, um Valdomiro
Caldeira Nunes: o nome oligárquico está **certo** para quem existe hoje.

> **O dossiê achou o sintoma e eu quase implementei o sintoma.** O nome não é clone
> porque o gerador é fraco: **o elenco tem um tipo social só porque tem uma função
> política só.** Oito pessoas, oito cadeiras de comando, nenhuma base.

## O plano, em três partes, e elas são independentes

### Parte A — o vocabulário deixa de ter um andar social só · ✔ **FEITA em 16/08**

Não é o nome de urna. É corrigir o viés que **já existe** e que já contamina todo
texto gerado.

- **`GIVEN_NAMES` ganha faixa de geração.** O Congresso real de hoje tem Arthur,
  Rodrigo, Davi, Elmar, Camila, Tabata ao lado dos Genésios. Hoje a lista tem só o
  segundo grupo, e um líder de 45 anos sai chamado Teodolino;
- **`SURNAMES` ganha sobrenomes simples e regionais**, para o composto voltar a ser o
  que ele deveria significar — **linhagem**, e não o padrão da casa;
- ⚠ **e o ADR 0003 continua mandando**: nenhum sobrenome que carregue identidade
  política brasileira, e a colisão acidental segue declarada no cabeçalho do catálogo.

**Custo:** duas listas. **Nenhum motor muda, nenhuma prova muda, nenhum estado muda.**

⚠ **O que verificar depois, e não é opcional:** rode o simulador em várias sementes e
**leia os nomes**. O defeito desta parte é ela criar um segundo viés no lugar do
primeiro — uma lista só de nomes modernos erra igual, na direção oposta. O alvo é
**faixa**, não substituição.

### Parte B — o nome de urna, e ele nasce com a bancada temática · **é ciclo, não item**

> ⚠ **ELA GANHOU CASA em 16/08:** a bancada temática é o outro lado do LOBBY, e as
> duas nascem juntas no [ciclo 10](10-quem-derruba-um-presidente.md). A bancada
> evangélica no Congresso e o lobby evangélico na rua são **a mesma força medida em
> dois lugares** — modelá-las separadas criaria duas verdades sobre o mesmo poder.

O nome de urna só é informação quando existe alguém para quem ele _seja_ informação:
um deputado cuja base é a igreja, a polícia, a sala de aula, a fazenda. Isso é
**onda 2 do elenco**, e não existe.

Quando ela vier, o desenho é este, e ele já resolve a objeção 1:

> **O título sai do ARQUÉTIPO, nunca de um sorteio à parte.** A silhueta do nome
> passa a dizer de onde vêm os votos daquele sujeito antes de o jogador ler uma
> palavra do dossiê — que é exatamente o que o dossiê pede, feito de um jeito que tem
> motor atrás.

⚠ **E ele passa no ADR 0003 sem esforço, com um limite:** patente é **categoria**, não
identidade — "Pastor Rebouças" não é ninguém. Patente **mais instituição real** (nome
de igreja, de corporação, de sindicato) seria, e está fora.

⚠ **A bancada temática é mecânica, e não elenco maior.** Ela só vale a pena se
atravessar o bloco: uma bancada evangélica que vota junto **contra** o líder do
próprio partido em pauta de costumes é a coisa que o modelo hoje não sabe
representar — a venalidade é por eixo, mas a lealdade é por bloco. **Isto é um ciclo
inteiro**, com decisão de modelo, e fica registrado como tal.

### Parte C — a bancada em duas linhas · **CSS e HTML, sem motor**

Verificado em `src/ui/screens/mesa.mjs`, `benchHtml`: a bancada é **uma linha
achatada** — nome · humor · controle · fatia · custo · votos. O `de 76` que qualifica
o nome está no extremo oposto da tela em relação a ele, e é daí que sai o zigue-zague
que o dossiê descreve.

**O conserto é o que ele mesmo propõe para o cabeçalho — e só ele:**

```
┌──────────────────────────────────────────────┐
│ Centrão                          128 cadeiras │   ← linha 1: quem é, e quanto pesa
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░  38% · R$ 12,4 bi · 76 │   ← linha 2: o controle, largura cheia
│   └ as pessoas, aninhadas                     │
└──────────────────────────────────────────────┘
```

O controle ocupar a largura do bloco não é estética: **é o que diz que o dinheiro
financia o grupo inteiro**, e não a linha em que ele está desenhado.

### ⚠ O que se RECUSA da Parte C, e é a recusa mais importante deste documento

**"Cartões de parlamentares", um por pessoa.** Colide frontalmente com uma decisão
escrita do ciclo 5:

> _"A gente mora DENTRO do bloco, e a aninhagem é a mecânica: você paga o bloco, o
> bloco é feito de gente, a gente entrega diferente. Uma lista de onze bancadas irmãs
> diria que o líder e o bloco são a mesma coisa."_

Cards irmãos dizem que pessoa e bloco são a mesma natureza de coisa. **O zigue-zague
se conserta na linha, não promovendo a pessoa a cartão.**

## ⚠ As outras três recomendações do dossiê, e por que elas não entram

### 1. "Slot tracejado: arraste/selecione uma pauta governamental" — **é o ciclo 2 revertido**

**A coisa mais perigosa do dossiê**, e ela se disfarça de detalhe de estado vazio.

**Não existe pauta para arrastar.** A pauta é **derivada** do orçamento que o
presidente escreveu, programa a programa. Um slot pedindo para "selecionar uma pauta"
ressuscitaria o menu de pautas prontas que foi aposentado com a frase que é o
diagnóstico inteiro:

> _"Pauta pronta é uma bosta, onde tem criatividade nisso e liberdade?"_

O estado vazio certo já existe e já foi padronizado: ele diz **onde** a pauta nasce —
_"escolha uma ação numa das áreas"_ —, e não oferece um receptáculo para largar
alguma coisa que o jogo não tem.

### 2. "Esconda 'sem histórico com o seu governo'" — **regra escrita ao contrário**

> **Ausência declarada não é ausência disfarçada.**

Sumindo a linha, o jogador não distingue _"não tenho relação com esse cara"_ de _"a
tela não renderizou nada aqui"_. E a faixa morta abaixo de 0,08 é **decisão de motor
declarada** em `mesa.mjs`, não dado lixo.

⚠ **Mas ele viu um problema real com o remédio errado:** na abertura, **os sete dizem
a mesma frase**. Sete repetições da mesma ausência é a família de duplicação que este
projeto já pegou três vezes no mesmo dia. **O conserto é o bloco dizer isso uma vez** —
quem nomeia uma ausência é o lugar onde ela acontece, e uma vez só.

### 3. "Aumente a pool de desejos" — **ordem errada, e é o achado 16**

Ele observou que a maioria quer governo de estado. Já está medido: a distribuição é
**uniforme em 600 sementes** (20,2/20,2/20,3/20,3/19,0 em 4.200 pessoas). O que ele
viu foi amostra pequena — sete pessoas para cinco ambições —, e não viés de hash.

⚠ **E o defeito real é outro: quatro das cinco ambições são INERTES.** Só `succession`
tem preço (`successionDrag`). Ampliar a pool antes de dar preço **multiplicaria o
conjunto inerte** — mais vocabulário para menos mecânica, que é o inverso do que este
projeto faz.

### 4. A seção 4 do dossiê é o dossiê anterior, palavra por palavra

Scouting político, tramitação contaminada e promessa condicional já estão lidas contra
o código em
[`../research/03-mecanicas-de-referencia.md`](../research/03-mecanicas-de-referencia.md).
Nada novo, e as conclusões de lá seguem valendo.

## A fila, e por que este ciclo NÃO fura a dela

**A ordem não muda:** `state.mail` (schema 15) → a emenda vira pergunta → recalibrar a
tramitação → Parte 2 do ciclo 4 (vinculação).

**A Parte A deste ciclo virou o PASSO 0 do ciclo 9**, e o argumento é concreto: **o
nome entra em todo texto gerado**. Trocar o vocabulário depois do inbox significa reler
todas as cartas de novo, e reler carta é o trabalho que este projeto já fez três vezes
por não ter feito na ordem.

**A Parte C anda quando alguém estiver mexendo na tela do Congresso de qualquer jeito**
— ela não tem urgência própria.

**A Parte B não começa sem decisão explícita.** Ela é modelo novo, e `CLAUDE.md` diz
que motor novo não nasce por conta própria.

## Resumo de custo

| parte | o quê                              | toca em             | custo    | depende de       |
| ----- | ---------------------------------- | ------------------- | -------- | ---------------- |
| **A** | vocabulário sem andar social único | `src/data/cast.mjs` | mínimo   | nada             |
| **C** | a bancada em duas linhas           | `mesa.mjs` + CSS    | pequeno  | nada             |
| **B** | nome de urna + bancada temática    | motor ELENCO        | **alto** | onda 2 do elenco |
