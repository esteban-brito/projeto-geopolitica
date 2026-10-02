# Ciclo 15 — o Gabinete

> **Escrito em 29/08/2026, a pedido dele**, logo depois de a Caixa de Entrada perder todas as
> tabelas. As palavras são dele:
>
> > _"todo esse bloco direito inteiro será feito em blocos, igual como acontece dentro da caixa
> > de entrada, quero tudo idêntico, padronizado. Tudo deve ser simplificado, o que parece ser
> > igual deve ser fundido, aprimorado. Padronize todas as linguagens, cores, fontes, tamanhos,
> > tudo padronizado mesmo, é como se estivéssemos fazendo o gabinete todo do zero."_
>
> E as três restrições que ele deu junto:
>
> 1. **o Gabinete não decide.** _"Ela serve pra você se guiar e te levar a outras telas"_;
> 2. **o título é pequeno.** Ele ocupa uma faixa inteira hoje;
> 3. **tudo redistribuído.** Minimalismo, **Football Manager**, **Victoria 3**.

---

## 🔢 O QUE FOI MEDIDO — 29/08/2026, mês 12, a 1440×980

| medição                                                     | resultado                            |
| ----------------------------------------------------------- | ------------------------------------ |
| classes de estilo distintas **só na coluna direita**        | **18**                               |
| instrumentos diferentes para "um número numa régua"         | **três** — `gauge`, `meter`, `poles` |
| peças que a Caixa de Entrada inteira usa, depois da reforma | **três**                             |
| blocos na coluna direita · números na tela                  | 4 · 16                               |
| a tela rola?                                                | **não**, e isso não pode mudar       |

⭐ **O ACHADO NÃO É O DESENHO, É O VOCABULÁRIO.** Três instrumentos para a mesma pergunta —
_"onde este número está na régua dele?"_ — significam que cada bloco foi desenhado sozinho, e
cada um resolveu o mesmo problema de um jeito. **A caixa acabou de provar que três peças bastam
para quinze espécies de carta.** A coluna direita tem quatro blocos e dezoito classes.

---

## A REGRA — o Gabinete passa a falar a língua da Caixa

**Uma peça de dado, e ela é a mesma das cartas.** Ela sai de `inbox.mjs` para
`src/ui/shared/`, e as duas telas passam a montar a partir dela.

| peça      | forma                        | quando                     |
| --------- | ---------------------------- | -------------------------- |
| **bloco** | moldura · legenda · conteúdo | toda leitura, sem exceção  |
| **linha** | nome · pista · valor · nota  | um número que tem régua    |
| **nota**  | legenda · prosa              | uma regra, e não um número |

⚠ **A PISTA GANHA A MARCA DE LIMIAR, e é isso que salva a fusão.** `gauge` já tem `data-mark`.
É o que o `poles` fazia sozinho — e é a informação que não pode sumir: sem a marca, "83" não diz
que rompe em 86.

⚠ **E A GUARDA `annexes` PASSA A COBRIR `cabinet.mjs`.** Ela nasceu para impedir a sexta tabela
na caixa; o mesmo argumento vale aqui, e mais forte — foi assim que os três instrumentos
apareceram, um de cada vez, cada um razoável sozinho.

---

## A TELA, REDISTRIBUÍDA

### O que sai do topo

⭐ **A faixa "Risco de queda" desce para a coluna direita.** Ela ocupa a largura inteira da tela
para dizer três números, e diz **a mesma coisa** que o bloco "Quem pode derrubar", 300px abaixo.

⚠ **E É PIOR QUE REDUNDÂNCIA: "Parlamentares" aparece nos dois com o MESMO 83 e limiares
DIFERENTES** — _"rompe acima de 86"_ em cima, _"abandonam acima de 68"_ embaixo. Os dois números
estão certos e medem coisas diferentes (o grupo abandona em 68; a ruptura política abre em 86),
e nada na tela diz isso. **Um jogador que compare os dois conclui que a tela erra.**

### O título

**Pequeno, na mesma linha do resto.** O rail já marca onde você está, e a faixa de título é a
única peça da tela que não responde nenhuma pergunta.

### A coluna direita — cinco blocos, na ordem do que te derruba primeiro

| #   | bloco                | linhas | o que responde                              |
| --- | -------------------- | ------ | ------------------------------------------- |
| 1   | **Risco de queda**   | 3      | quanto falta para cada ruptura abrir        |
| 2   | **Quem te abandona** | 4      | qual grupo está fervendo, e quanto ele pesa |
| 3   | **A Câmara**         | 3      | apoiam · maioria · **faltam**               |
| 4   | **Dinheiro do mês**  | 3      | sobra · preso por lei · já comprometido     |
| 5   | **A rua**            | 3      | qual faixa de renda está pior               |

⭐ **Os blocos 1 e 3 já existem prontos** — são `rupturesBlock` e `chamberBlock`, escritos para
as cartas em 29/08. **A mesma leitura, na mesma peça, nas duas telas.**

---

## AS FUSÕES, E A RAZÃO DE CADA UMA

| o que funde                                         | por quê                                             |
| --------------------------------------------------- | --------------------------------------------------- |
| faixa do topo **+** "Quem pode derrubar"            | dizem a mesma coisa, e discordam em "Parlamentares" |
| `gauge` **+** `meter` **+** `poles`                 | três desenhos para uma pergunta só                  |
| "Gastos presos" (3 números corridos em letra miúda) | é uma lista escrita como frase — vira três linhas   |
| os dois limiares soltos no pé do bloco              | viram a **marca** na pista da linha a que pertencem |

⛔ **E DUAS COISAS NÃO FUNDEM, apesar de parecerem:**

- **a barra superior e a coluna.** `Base 401` e `Aprovação 23%` reaparecem na direita — mas a
  barra vive em **todas** as telas e é o resumo permanente; a coluna é o detalhe do Gabinete.
  **O que muda é a direita parar de repetir o número cru e passar a dar o que a barra não dá:**
  a distância até o limiar, e quem está pior;
- **"Opinião pública" (ruptura) e "A rua" (por renda).** A primeira é o veredito nacional e a
  segunda diz **qual classe** está pior. Fundi-las apagaria a pergunta que só a segunda responde.

---

## AS DECISÕES QUE EU TOMO, e recomendo

1. ⭐ **A aprovação por renda perde as três fatias e vira uma pista por classe.** Hoje cada
   faixa desenha ótimo/bom · ruim/péssimo em três cores — e a pergunta que o bloco responde é
   _"qual classe está pior"_, que uma pista responde. **É a mesma decisão que a carta da rua já
   tomou**, e ela tirou 15 células de lá;
2. ⭐ **Os quatro grupos ficam todos, e não só os que fervem.** Cortar pelo limiar seria o
   critério do `seatsAnnex` — mas ali há a tela do Congresso atrás; aqui **não há tela que liste
   os quatro**, e cortar viraria informação ausente;
3. ⭐ **As setas `>` passam a estar em todos os blocos que têm tela atrás, ou em nenhum.** Hoje
   dois têm e dois não, sem regra visível;
4. ⛔ **A tela continua sem decisão**, por ordem dele — e isso já era verdade: `#main` tem 17
   elementos interativos, e **todos** são navegação ou a caixa;
5. ⛔ **A tela continua sem rolar.** É a restrição mais dura do ciclo: cinco blocos, uma folha
   de 630px e nenhuma barra de rolagem. **Se não couber, corta-se conteúdo — não se cresce.**

---

## A ORDEM, E POR QUE ELA É ESSA

| passo | o quê                                                         | risco                          |
| ----- | ------------------------------------------------------------- | ------------------------------ |
| **1** | ✔ a peça saiu para `src/ui/shared/annex.mjs`, sem mudar nada  | zero — foi mudança de endereço |
| **2** | ✔ a guarda `annexes` cobre `cabinet.mjs`, e **está vermelha** | ela precisava falhar antes     |
| **3** | ✔ os cinco blocos, um a um, contra a guarda vermelha          | altura: medida a cada bloco    |
| **4** | ✔ a faixa do topo saiu, e o título encolheu                   | a altura sobrou                |
| **5** | ✔ os três instrumentos viraram um; `meter` e `poles` morreram | **zero outros consumidores**   |

### ⭐ O CICLO FECHOU — 30/08/2026

| medição                                       | antes | depois                       |
| --------------------------------------------- | ----- | ---------------------------- |
| classes de estilo distintas na coluna direita | 18    | **9**                        |
| instrumentos para "um número numa régua"      | 3     | **1** (`gauge`)              |
| blocos · linhas na coluna                     | 4 · — | **5 · 20**                   |
| achados da guarda `annexes` em `cabinet.mjs`  | 11    | **0**                        |
| a coluna rola?                                | não   | **não** — 732 de 732px       |
| CSS podado                                    | —     | **14,1 KB** em dois arquivos |

⚠ **O PASSO 5 NÃO TINHA RISCO NENHUM, e isso foi MEDIDO e não suposto:** `reading`, `meter`,
`poles`, `block__door` e `card__body` eram produzidos por **um arquivo só** — `cabinet.mjs`.
O plano avisava "eles têm outros consumidores"; não tinham.

⚠ **E DUAS DECISÕES SÃO DELE, contra o plano:** o limiar continua **escrito** ao lado da marca
("a marca diz ONDE, e não QUANTO"), e a lista de gastos presos virou **três linhas** de verdade.
A repartição da Câmara — quem obstrui, quem rompeu — foi apagada, como o plano pedia.

### ✔ OS PASSOS 1 E 2 ENTRARAM — 30/08/2026

**Passo 1.** `cardHtml`, `lineHtml`, `linesHtml` e `noteHtml` saíram de `inbox.mjs` para
`src/ui/shared/annex.mjs` **sem uma linha alterada**. Conferido na captura: a caixa desenha o
mesmo pixel. Tipos, lint, formato, 269 provas e o passeio, todos verdes.

**Passo 2.** A guarda passou a medir **duas** coisas, e a segunda é nova: _tabela_ nas duas
telas **e** na peça; e _régua desenhada pela tela_ — `class="gauge"`, `"meter"` ou `"poles"`
escrita fora da peça. As provas sintéticas foram de **3 para 6**.

⛔ **E ELA ESTÁ VERMELHA, COM 11 ACHADOS, TODOS EM `cabinet.mjs`** — 3 `gauge`, 2 `meter`,
6 `poles`. `inbox.mjs` saiu limpo no passo 1. **`npm run check` reprova de propósito até o
passo 5**, e é assim que o número mede o progresso: 11 → 0.

⚠ **O PASSO 2 VEM ANTES DO 3 DE PROPÓSITO** — é a Restrição 2 do ciclo 14, que nasceu de três
defeitos atravessando o portão inteiro: **a checagem nasce antes do conserto, e tem de reprovar
o estado de hoje.**

⚠ **E O PASSO 5 É O ÚNICO COM RISCO REAL:** `meter` e `poles` podem ser usados por Finanças, a
Mesa e o Congresso. **Medir os consumidores antes de apagar** — se houver, eles migram junto ou
as classes ficam, e o Gabinete apenas deixa de usá-las.

---

## 🗣 O QUE ESTE CICLO RECUSOU NA ÉPOCA — e nada aqui trava hoje

⚠ **Reclassificado em 05/09/2026.** Linha com 📐 tem número atrás e vale até ser remedida; linha
com 🗣 é gosto dele naquele dia, e **gosto expira**; linha com ✍ era generalização minha, e
**não vale nada**. Ver as três famílias no `CLAUDE.md`.

| pedido                                   | por quê, e de que família                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| **o Gabinete ganhar um controle**        | 🗣 ordem dele na época. ⭐ **CAIU:** o contingenciamento entrou na mesa em 04/09 |
| **a coluna rolar para caber mais bloco** | ✍ minha. O layout é uma promessa, e promessa se renegocia                      |
| **esconder leitura atrás de hover**      | 📐 vale: informação atrás de hover não existe para quem não passa o mouse       |
| **cor nova para significar estado**      | ✍ minha. A paleta pode crescer se ele quiser                                   |
| **repetir na direita o número da barra** | 📐 vale: dois lugares montando a mesma leitura é o defeito mais caro do projeto |
