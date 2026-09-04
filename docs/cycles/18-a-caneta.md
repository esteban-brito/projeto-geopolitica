# CICLO 18 — A CANETA

> **Estado:** ▶ plano, escrito em 03/09/2026. **Escopo aberto por ele**, com estas palavras:
>
> - _"esqueça travas, eu mando em tudo. Quero apenas planejar o meu jogo"_;
> - _"quero que voce se atualize referente a Brasil, politica, STF, congresso, senado, e tudo
>   mais, tem muita coisa acontecendo"_;
> - _"quero realismo, quero que o meu jogo seja um verdadeiro simulador de presidente do
>   brasil"_.
>
> Ele executa a [pesquisa 04](../research/04-o-cargo-de-presidente.md), que diagnosticou sem
> orçar. O ciclo [13](13-o-glorioso.md) continua aberto em **26 de 49** e **não** é substituído:
> os itens da Parte A dele reaparecem aqui com o preço refeito.

---

## 0 · ⚖ OS QUATRO GRAUS DE CONFIANÇA, marcados linha a linha

| marca | o que significa                                                       |
| ----- | --------------------------------------------------------------------- |
| 📗    | **norma** — artigo de lei ou da Constituição, citável                 |
| 📙    | **literatura** — consenso acadêmico com autor                         |
| 📰    | **notícia datada** — apurado na web em 03/09/2026, com a data do fato |
| 📐    | **medição** — número tirado deste repositório, reproduzível           |

---

## 1 · ⭐ A TESE: o jogo tem SEIS gestos, e o cargo tem QUATRO canetas

📐 **Medido no `app.mjs` de hoje** — todo gesto que o jogador pode fazer, o mandato inteiro:

| gesto           | o que é                                       |
| --------------- | --------------------------------------------- |
| `data-section`  | **trocar de tela** — não é jogada             |
| `data-band`     | mover a faixa de uma lei                      |
| `data-protect`  | proteger uma área do corte                    |
| `data-pledge`   | marcar um compromisso — **uma vez, na posse** |
| `data-dispatch` | abrir uma carta                               |
| `data-open`     | abrir um bloco                                |

**Tirando navegação e leitura, o presidente deste jogo faz TRÊS coisas:** mexe em verba, mexe em
faixa de lei, e escolhe quem o corte poupa. Ele escreve um texto e **espera**.

📙 **E a presidência brasileira é o contrário disso.** A tese da pesquisa 04, que este ciclo
executa: _o jogo modela o VOTO, e o cargo é feito de AGENDA_ (Figueiredo & Limongi, 1999). O
Executivo domina o Legislativo porque **controla a pauta**, não porque compra voto.

⚠ **E o jogo acerta o RESULTADO e erra o MECANISMO.** 📐 A série mede **26 de 43** textos
aprovados na política `agenda`; 📙 a literatura põe a taxa de sucesso do Executivo brasileiro
na mesma vizinhança. **O número está certo — ele só está sendo produzido por dinheiro, e no
Brasil é produzido por pauta, pasta e prazo.**

---

## 2 · 📰 O QUE MUDOU NO BRASIL, e por que isso reordena o plano

Apurado em 03/09/2026. **Isto não é enfeite: cada linha aqui vira ou mata um item abaixo.**

### 2.1 · ⭐⭐ Três vagas do STF caem DENTRO do mandato que o jogo simula

O jogo abre em **janeiro de 2027** — a posse do mandato que a eleição de outubro de 2026
decide. E 📗 a aposentadoria no STF é compulsória aos 75 anos:

| ministro          | 75 anos em | mês do jogo |
| ----------------- | ---------- | ----------- |
| **Luiz Fux**      | 26/04/2028 | mês **16**  |
| **Cármen Lúcia**  | 19/04/2029 | mês **28**  |
| **Gilmar Mendes** | 30/12/2030 | mês **48**  |

📰 Barroso se aposentou **antecipadamente**, e a vaga dele cabe ao mandato atual.

⭐ **Isto é um marco de calendário, e o motor do calendário já existe (C7).** Três vezes em 48
meses o jogador indica um ministro da Suprema Corte — e 📗 a indicação **passa pelo Senado**
(CF art. 101, parágrafo único), o que a torna a única nomeação do cargo que se negocia.

### 2.2 · ⭐⭐ O Congresso derruba veto como nunca, e o STF virou a última trincheira

📰 Em três anos o Congresso analisou **87 vetos presidenciais e derrubou 43** — taxa de rejeição
de **49%**, recorde acima de Bolsonaro, Temer e Dilma. 📰 E a sequência que se repete é:
**veto derrubado → AGU aciona o STF → liminar suspende o efeito.**

⛔ **O jogo de hoje não tem nenhuma das três peças.** 📐 Nada no repositório desfaz uma jogada
do jogador exceto o Congresso votando contra ela.

### 2.3 · ⭐ O STF condiciona a execução de emenda — e emenda é a moeda do jogo

📰 ADPF 854 (o "orçamento secreto") e ADI 7697: o STF exige **transparência e rastreabilidade**
das emendas; em 23/10/2025 estendeu a exigência a estados e municípios, e condicionou a execução
do exercício de 2026 à comprovação perante os Tribunais de Contas. 📰 Em 21/12/2025 uma liminar
suspendeu o art. 10 do PL 128/2025, que tentava revalidar modalidades já declaradas
inconstitucionais.

📐 **E emenda é a ÚNICA moeda deste jogo:** `funding` é a coalizão inteira. Um contrapoder que
segura a liberação de emenda ataca exatamente o eixo em que o jogador é forte.

### 2.4 · O comando do Congresso troca no meio do mandato

📰 Hugo Motta (Republicanos-PB) preside a Câmara e Davi Alcolumbre (União-AP) o Senado, eleitos
em 01/02/2025 para o biênio 2025-2026. 📗 A Mesa se renova a cada dois anos — ou seja, **uma
eleição de Mesa cai em fevereiro de 2027 e outra em fevereiro de 2029**, dentro do jogo.

📐 O jogo tem `Mesa` como conceito (`mesa.mjs`, a tela do Congresso), mas **quem a preside não
existe** — e é a pessoa que decide o que vai a voto.

### 2.5 · O choque externo tem nome, e o país rotea em volta dele

📰 Cronologia da tarifa americana: 10% em 02/04/2025 → **50%** anunciada em julho e em vigor em
06/08/2025 → **25%** em 15/07/2026 e **+12,5%** em 23/07/2026, vigentes desde 24/07/2026, com
isenção de aeronaves civis, energia, suco de laranja, ferro-gusa, metais preciosos, celulose e
fertilizantes.

⭐ **E o resultado é o que interessa para o jogo:** 📰 as exportações para os EUA caíram **6,6%**
em 2025 (US$ 37,7 bi contra 40,4), e **o total exportado SUBIU 3,5%** (US$ 348,7 bi) — o país
desviou. 📐 O motor `CORRENTE` tem choque externo como um número escalar sem origem; isto lhe dá
**destino e desvio**.

### 2.6 · O que o próximo presidente herda, em número

📰 A meta de 2026 é **superávit primário de 0,25% do PIB**, com banda de ±0,25 p.p. (📗 LC
200/2023). 📰 Com precatórios, a previsão de **déficit** primário foi de R$ 60,3 bi em maio e
R$ 52 bi em julho de 2026 — e, excluindo o que a lei tira da meta, o governo projeta superávit
de R$ 4,1 bi. 📰 A Lei 15.270/2025 isentou o IRPF até R$ 5 mil a partir de janeiro de 2026,
beneficiando mais de 15 milhões de contribuintes.

⚠ **Isso é calibragem, e não item:** `src/data/` precisa reler estes números antes do próximo
`simulate`. **Fica registrado, não executado — mexer em calibragem é decisão dele.**

### 2.7 · A eleição de 2026, para o elenco

📰 Lula é candidato à reeleição. 📰 Bolsonaro está preso — pena de 27 anos e 3 meses por
tentativa de golpe — e inelegível; o nome que ele apoia é **Flávio Bolsonaro (PL)**.

⚠ **E isto NÃO entra no jogo como está** — ADR 0003: o mundo é real, **as pessoas são
inventadas**. O que entra é a **forma**: um mandato que abre depois de uma eleição polarizada,
com o derrotado fora do jogo eleitoral e a base dele intacta no Congresso.

---

## 3 · AS CINCO PEÇAS DO CARGO, e todo item abaixo declara de qual ele vem

| peça                | o que é                                                              | o jogo tem?   |
| ------------------- | -------------------------------------------------------------------- | ------------- |
| **① A CANETA**      | o que ele assina sozinho: MP, decreto, contingenciamento, nomeação   | ⅓             |
| **② A PAUTA**       | trancamento, urgência, iniciativa privativa — o **tempo dos outros** | ⛔ nada       |
| **③ A COALIZÃO**    | pasta, líder do governo, emenda — como se compra maioria             | ⅓ (só emenda) |
| **④ O CONTRAPODER** | STF, TCU, Congresso derrubando veto — o que **desfaz**               | ⛔ nada       |
| **⑤ O CALENDÁRIO**  | posse, Mesa, vagas do STF, LDO/LOA, eleição                          | ½ (C7)        |

---

## 4 · ⭐ A ORDEM, POR CUSTO — e é esta tabela que ele escolhe

**Custo é trabalho, não importância.** A coluna `abre motor` é o divisor real: item que não abre
motor entra numa sessão; item que abre custa um ciclo.

| #      | peça | o quê                                             | motor      | custo   | depende |
| ------ | ---- | ------------------------------------------------- | ---------- | ------- | ------- |
| **1**  | ①    | o contingenciamento **muda de tela** — vai à mesa | não        | mínimo  | —       |
| **2**  | ⑤    | as **três vagas do STF** no calendário            | não        | pequeno | C7      |
| **3**  | ①    | o **decreto tributário** — canal morto acordado   | liga canal | pequeno | —       |
| **4**  | ④    | a **presença** — 129 em vez de 257 no vazio       | liga canal | pequeno | —       |
| **5**  | ⑤    | a **Mesa tem dono**, e ele troca em fev/2027      | abre motor | médio   | —       |
| **6**  | ①②   | ⭐⭐ a **medida provisória**, com trancamento     | abre motor | grande  | —       |
| **7**  | ③    | a **coalescência** — pasta × cadeira              | abre motor | grande  | A6      |
| **8**  | ④    | o **veto**, e a derrubada                         | abre motor | grande  | A7      |
| **9**  | ④    | a **liminar** — o STF desfaz decreto              | abre motor | grande  | 2, 3    |
| **10** | ⑤    | a **indicação ao STF passa pelo Senado**          | abre motor | médio   | 2, 7    |
| **11** | ⑤    | o **choque externo com destino**                  | liga canal | médio   | —       |

---

## 5 · OS ITENS

### 1 · ① O contingenciamento muda de tela — custo mínimo

**Ele já está construído e está no lugar errado.** O decreto (`data-protect`) mora nas **oito
telas de área**, e 📗 contingenciamento é ato do Executivo, rubrica a rubrica, num decreto só.

- o gesto continua o mesmo, e o motor não muda uma linha;
- ⭐ **e ele é o primeiro morador da mesa** — o Gabinete deixa de ser só painel sem virar a
  segunda porta de nada, porque esta jogada não existe em outra tela;
- ⚠ **a regra do C4 que proibia controle no Gabinete está morta**, e por duas razões medidas
  nesta sessão: a barra superior carrega os quatro vitais em **toda** tela (o jogador nunca mais
  decide sem saber como o país está), e a Restrição 1 caiu com a separação — 📐 **45% do
  tabuleiro está vazio**.

### 2 · ⑤ As três vagas do STF entram no calendário — custo pequeno

📗 Aposentadoria compulsória aos 75. 📰 Fux em abril de 2028, Cármen Lúcia em abril de 2029,
Gilmar Mendes em dezembro de 2030 — **meses 16, 28 e 48 do jogo**.

- entra como três marcos em `src/data/calendar.mjs`, ao lado do bimestral e da LDO;
- ⭐ **e é o único marco do jogo com data absoluta e não anual** — o esquema do calendário hoje
  só sabe "mês do ano" e "de quantos em quantos meses". **Isto exige um terceiro campo**, e é a
  única parte que não é catálogo puro;
- ⛔ **sem o item 10 ele é só um aviso.** É de propósito: o aviso sozinho já vale, e é barato.

### 3 · ① O decreto tributário — custo pequeno, e o canal já existe

📐 `taxDelta` é lido pela `CORRENTE` com `taxDrag: 0,35` e **ninguém o escreve**. É um dos quatro
canais mortos do ciclo 13.

📗 **E a norma dá o desenho de graça:** o presidente **não** mexe em imposto de renda por
decreto — a Lei 15.270/2025 nasceu de projeto do Executivo e foi votada. Mas **IOF, IPI,
imposto de importação e de exportação** são exceção à anterioridade (CF art. 153, §1º): o
presidente altera a alíquota **por decreto, e ela vale já**.

- ⭐ **é a caneta mais honesta do jogo:** efeito imediato, sem pedir licença, e com preço — 📙
  aumento de IOF é o instrumento clássico de arrecadação de emergência, e ele **cobra do setor
  privado na hora**, que é um grupo de pressão que já existe;
- o item A5 do ciclo 13 já o previa. **Aqui ele ganha norma e recorte.**

### 4 · ④ A presença — 129 em vez de 257, e a obstrução vira arma

📗 CF art. 47: delibera-se por **maioria dos presentes**, presente a maioria absoluta. 📗 CF art.
69: só lei complementar exige 257.

📐 **O jogo exige 257 para tudo que não é emenda** (`SIMPLE_MAJORITY` em `regime.mjs`). Uma lei
ordinária que passaria com **129** num plenário esvaziado custa 257 aqui.

⭐ **E o que se ganha não é desconto — é a arma da oposição.** Abaixo de 257 **presentes** a
sessão não abre: a pauta não morre, ela **não acontece**. Derrota sem ninguém votar contra.
📐 O `moodFactor` do `ECLUSA` já descreve isso em prosa — _"aparece menos, atrasa, esvazia
sessão"_ — e depois aplica só como voto a menos.

### 5 · ⑤ A Mesa tem dono — custo médio

📰 Motta e Alcolumbre, biênio 2025-2026; 📗 a Mesa se renova a cada dois anos, então **fevereiro
de 2027 e fevereiro de 2029 caem dentro do jogo**.

- 📐 o jogo tem a Mesa como tela (`mesa.mjs`) e **não tem quem a preside** — e é essa pessoa que
  decide o que vai a voto;
- ⭐ **é o item que dá sentido ao trancamento de pauta (6):** trancar a pauta contra um
  presidente de Câmara aliado é uma coisa; contra um adversário é outra;
- ⚠ **e ele abre motor** porque a eleição de Mesa é uma votação com regra própria.

### 6 · ⭐⭐ ①② A medida provisória — o item que reenquadra o jogo

📗 CF art. 62: a MP **tem força de lei na publicação**; vale 60 dias prorrogáveis por mais 60; e
o §6º — **passados 45 dias sem votação, ela sobresta todas as demais deliberações da casa**.

**As três metades do item, e nenhuma sozinha é a MP:**

1. **o poder** — assinou, é lei. O efeito entra no mês, sem votação;
2. **o preço** — 120 dias. Não convertida, ela **caduca**, e 📗 o Congresso tem de disciplinar as
   relações jurídicas do período (art. 62, §3º) — no jogo, o efeito se desfaz e a memória fica;
3. ⭐ **o trancamento** — e é aqui que ele deixa de ser "decreto com prazo". Enquanto tranca, **o
   texto de mais ninguém anda**. É a única jogada do cargo que mexe no **tempo dos outros**.

⚠ **O A4 do ciclo 13 está pela metade e é por isso:** ele diz _"força de lei na hora, e
caduca"_ — tem o poder e o preço, e **não tem o trancamento**. Sem o §6º a MP é só um decreto com
validade.

⛔ **E ela não é grátis:** trancar a pauta custa **irritação** — a Casa perde o próprio poder de
decidir enquanto durar. É `loyalty` caindo em quem já estava na base.

### 7 · ③ A coalescência — pasta × cadeira

📙 _Presidencialismo de coalizão_ é de **Sérgio Abranches (1988)**: o presidente brasileiro é
eleito por um sistema que **garante** que ele não terá maioria própria. 📙 E **Octavio Amorim
Neto** deu ao mecanismo uma medida publicada — a **taxa de coalescência**: o quanto a divisão
dos ministérios espelha o peso das bancadas. Alta coalescência prediz apoio legislativo; baixa
prediz **governo por decreto**.

📐 **O jogo já tem quatro quintos disto:** as oito áreas do rail são as oito pastas, `office` no
`ELENCO`, `reach` como a fração de bancada que a pessoa arrasta, e `remember()` como o rancor.
**Falta a razão entre pasta que o partido tem e cadeira que ele tem.**

⭐ **E ela fecha o círculo com o item 6:** coalescência baixa → menos voto → mais MP → mais
irritação. **O A4 e o D1 são o mesmo eixo**, e é literalmente o que a literatura descreve.

### 8 · ④ O veto, e a derrubada — custo grande

📗 CF art. 66: veto total ou parcial em 15 dias úteis; o parcial só alcança **texto integral** de
artigo, parágrafo, inciso ou alínea; a derrubada é em sessão conjunta, por maioria absoluta de
cada casa.

📰 **E o número atual é o que torna isto jogo e não enfeite:** 43 de 87 vetos derrubados em três
anos — **49%**.

⛔ **Ele continua dependendo do A7**, e a razão é a mesma da pesquisa 04: 📐 **100% dos textos
deste jogo nascem do jogador. Não há o que vetar.** O veto é consequência do Congresso propor.

### 9 · ④ A liminar — o STF desfaz — custo grande

📗 O cargo brasileiro é **cercado**: o STF suspende decreto por liminar, o TCU susta ato e julga
conta, o Congresso susta ato normativo que exorbite do poder regulamentar (CF art. 49, V).

📰 E a cerca está **ativa hoje**: o STF condiciona a execução de emendas (2.3), e a AGU usa o
Supremo para segurar veto derrubado (2.2).

📐 **Hoje nada desfaz uma jogada do jogador exceto o Congresso votando.** Um presidente que baixa
decreto neste jogo **nunca é surpreendido por uma liminar de quarta-feira** — e isso é uma
afirmação sobre o Brasil que o jogo faz sem querer.

⚠ **Depende dos itens 2 e 3**: sem decreto e sem STF no calendário, não há o que suspender nem
quem suspenda.

### 10 · ⑤ A indicação ao STF passa pelo Senado — custo médio

📗 CF art. 101, parágrafo único: nomeação pelo presidente **após aprovação por maioria absoluta
do Senado**.

⭐ **É a única nomeação do cargo que se negocia**, e ela cai três vezes no mandato (item 2). O
motor de votação já existe; o que muda é a casa — 📐 o jogo hoje só vota na Câmara com 513, e
o Senado tem **81**.

### 11 · ⑤ O choque externo com destino — custo médio

📐 A `CORRENTE` tem choque externo como escalar sem origem. 📰 A tarifa americana deu ao mundo
real um caso completo: **tarifa em um destino, queda de 6,6% naquele destino, e alta de 3,5% no
total por desvio.**

- o choque passa a ter **destino** e o país passa a ter **desvio**;
- ⭐ **e o preço é tempo:** desviar mercado não é instantâneo, e é isso que faz o choque doer no
  ano em que ele acontece e não depois.

---

## 6 · ⛔ O QUE ESTE CICLO RECUSA, e a razão de cada um

| pedido                              | por quê                                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **nomes reais no elenco**           | ADR 0003. Lula, Motta, Fux e Flávio Bolsonaro entram como **forma**, nunca como pessoa                     |
| **indulto e comutação** 📗 art. 84  | real, e **sem superfície**: não move índice, receita nem bancada                                           |
| **relações exteriores como tela**   | já recusado — _"Fase 1 só o Brasil"_. O item 11 entra como **choque**, não como diplomacia                 |
| **Forças Armadas como instrumento** | o briefing 01 procurou proxy público de alinhamento e **não há**. Modelar sem ele é inventar número        |
| **estado de defesa e de sítio** 📗  | ⚠ não é recusa: pertence ao eixo de concentração de poder (`POWER_STEPS`), e entra por lá ou não entra     |
| **recalibrar `src/data/` com 2.6**  | ⚠ não é recusa: **é decisão dele**. Número de calibragem não se mexe sem pedido, e a série se remede junto |

---

## 7 · ⚖ A RESTRIÇÃO, e ela vale para os onze

1. `npm run validate` verde — 📐 hoje **13 guardas · 63 provas sintéticas · 152 arquivos · 314
   provas · passeio verde**;
2. ⚠ **abrir a captura.** Três defeitos já atravessaram tipo, guarda e trezentas provas para
   morrer na imagem;
3. **item que mexe em `src/data/`, `src/domain/` ou `src/application/` roda `simulate` e reescreve
   a série no mesmo commit;**
4. ⛔ **e nenhum dos onze inventa número.** Todo valor mostrado tem motor atrás ou catálogo com
   fonte — e as fontes deste ciclo estão na seção 2, com data.

---

## 8 · POR ONDE COMEÇAR — a recomendação, e ela não é a decisão

**Os itens 1 a 4 cabem numa sessão só, e os quatro juntos mudam o jogo mais do que qualquer um
dos grandes sozinho:**

- **1** dá ao Gabinete a primeira caneta e resolve os 45% vazios com **agência**, não com
  leitura;
- **2** põe no calendário a coisa mais concreta que este mandato tem — três cadeiras da Suprema
  Corte;
- **3** liga um canal que já está construído e morto, e dá ao presidente um efeito que não pede
  licença a ninguém;
- **4** corrige um número errado contra a Constituição e, de quebra, entrega a obstrução à
  oposição.

⭐ **Depois deles, o 6 — a MP — sozinho.** Ele é o item que reenquadra o jogo, e é grande demais
para dividir sessão com outro.
