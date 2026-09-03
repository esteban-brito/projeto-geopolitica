# Pesquisa 04 — O CARGO: o que um presidente do Brasil faz, e o que este jogo faz dele

> **Estudo, e não plano.** Escrito em 31/08/2026 a pedido dele: _"estude principalmente sobre
> realismo presidente do Brasil, quero criar esse realismo no meu jogo"_.
>
> Ele complementa o [ciclo 17](../cycles/17-o-brasil-inteiro.md), que **inventaria os poderes**.
> Este arquivo pergunta outra coisa: **o que faz a presidência brasileira ser ELA**, e não uma
> presidência genérica — e o que disso o motor de hoje já diz, diz errado, ou não diz.

---

## 0 · ⚖ OS TRÊS GRAUS DE CONFIANÇA, e eles estão marcados linha a linha

O briefing [01](01-briefing-brasil-2026.md) fez uma exigência que este arquivo herda: _"número
sem procedência num catálogo que se declara real é pior do que número declaradamente fictício —
ele parece verificável e não é"_.

| grau | o que é                                        | o que fazer com ele                            |
| ---- | ---------------------------------------------- | ---------------------------------------------- |
| 📗   | **texto de norma** — artigo citado, de memória | conferir na fonte antes de virar prosa de tela |
| 📙   | **literatura** — autor e obra nomeados         | conferir antes de citar como fato              |
| 📕   | **número** — receita, alíquota, valor          | ⛔ **não está aqui.** Vai ao briefing          |

⛔ **Nenhum número novo entra neste arquivo.** O que ele traz é **forma de mecanismo** — e forma
se confere lendo a norma, não medindo.

---

## 1 · ⭐ A TESE: o jogo modela o VOTO, e o cargo é feito de AGENDA

**É o achado mais fundo do estudo, e ele reenquadra três itens do plano.**

Hoje o jogador escreve um texto e **espera**: gaveta → relatoria → plenário, um estágio por mês.
Ele pode pagar bancada, e é só isso. **Ele é um requerente.**

📙 **A literatura brasileira diz o contrário, e é o consenso dominante desde 1999:** o Executivo
domina o Legislativo **porque controla a pauta**, e não porque compra votos. A referência é
Figueiredo & Limongi, _Executivo e Legislativo na Nova Ordem Constitucional_ — e o mecanismo
dela são três instrumentos, todos 📗:

| instrumento                 | norma                 | o que ele faz de verdade                                                     |
| --------------------------- | --------------------- | ---------------------------------------------------------------------------- |
| **medida provisória**       | CF art. 62            | vira lei **na assinatura**; após 45 dias **tranca a pauta** (§6º)            |
| **urgência constitucional** | CF art. 64, §1º e §2º | 45 dias por casa, e vencido o prazo **sobresta as demais deliberações**      |
| **iniciativa privativa**    | CF art. 61, §1º       | orçamento, servidor e organização administrativa: **o Congresso não propõe** |

⭐ **A consequência de jogo não é "mais um poder":** trancar a pauta é a única jogada do cargo
que muda **o tempo dos outros**. Comprar bancada é linear, e o jogador a entende no mês 2.
Trancar é um jogo de calendário — e custa irritação, porque a Casa perde o próprio poder de
decidir enquanto durar.

⚠ **E o jogo hoje acerta o RESULTADO e erra o MECANISMO.** Medido no repositório (série do
handoff, 48 meses): a `agenda` aprova **30 de 42** e a `base`, **36 de 41** — 71% e 88%. 📙 A
literatura põe a taxa de sucesso do Executivo brasileiro na mesma vizinhança. **O número está
certo; ele só está sendo produzido por dinheiro, e no Brasil é produzido por pauta.**

> ⚖ **Isto não pede motor novo — pede que o A4 seja lido de novo.** A MP está no plano como
> _"força de lei na hora, e caduca"_. **Está pela metade:** a caducidade é o preço, e o
> trancamento é o poder. Sem o §6º, a MP vira só um decreto com prazo de validade.

---

## 2 · O QUE O JOGO JÁ ACERTA — e isto é medição, não elogio

O projeto tem padrão registrado com auditoria externa: _"elas leem bem a tela e inferem mal o
mecanismo"_. Um estudo que só acrescenta comete o mesmo erro. **Seis coisas que este jogo já diz
certo sobre o Brasil:**

| o quê                                                                                      | onde               |
| ------------------------------------------------------------------------------------------ | ------------------ |
| **a verba é promessa, e a traição custa** — `promised` × `paid`, com memória               | ECLUSA, `settle`   |
| **a armadilha do arcabouço** — o teto ancorado no que vigorou                              | LASTRO             |
| **a aritmética da privatização** — vender o petróleo se paga em 26 anos, e o mandato tem 4 | catálogo de regras |
| **o impeachment é quórum e cerco**, e não roteiro — 342 📗                                 | `turn.mjs`         |
| **a PEC é outro jogo** — 308 📗 (CF art. 60, §2º)                                          | `regime.mjs`       |
| **a taxa de aprovação bate com a literatura** — 71% e 88%                                  | série do handoff   |

⭐ **E um acerto de doutrina que vale mais que os seis:** _"tudo tem preço, nada tem muro"_ é **a
descrição literal do cargo**. Um presidente pode mandar uma PEC destruir o piso da saúde amanhã.
Nada o impede — o que o para é o Congresso.

---

## 3 · OS SETE BURACOS, em ordem de realismo ganho por unidade de trabalho

### 3.1 · ⭐⭐ O decreto tributário — e o canal já está construído e MORTO

📗 **CF art. 153, §1º:** o Executivo altera as alíquotas de **II, IE, IPI e IOF** por ato
próprio, nos limites da lei. 📗 **E o art. 150, §1º** os excepciona da anterioridade — o IOF, o
II e o IE valem **na hora**; o IPI guarda os noventa dias.

⭐ **É a exceção constitucional à legalidade tributária, e o instrumento fiscal mais rápido do
cargo.** Não passa por Congresso, não espera exercício, e o mercado responde no dia.

⚠ **E o motor já lê o número.** `src/domain/economy/index.mjs:62` calcula
`taxDelta = input.taxLoad - input.baseTaxLoad` e o consome em `p.taxDrag * taxDelta` — **e nada
no jogo escreve `taxLoad`.** É o A5, e é o canal morto mais barato do plano.

### 3.2 · ⭐⭐ O piso que se move sozinho — documentado desde 13/08 e não construído

📗 **Saúde: 15% da Receita Corrente Líquida** (CF art. 198, §2º, redação da EC 86/2015).
📗 **Educação: 18% da receita de impostos** (CF art. 212).

⚠ **O código não tem essa forma.** `src/data/programs.mjs` declara `floor: { kind: "number" }` —
o piso é uma **fração do nível do programa**, um número parado. O [achado 2 da pesquisa
02](02-respostas-brasil-2026.md) já escreveu o conserto e ele nunca entrou:

```js
floor: { kind: "absolute", value: … }                      // previdência, folha
floor: { kind: "revenue-share", base: "rcl", share: 0.15 }  // saúde
floor: { kind: "revenue-share", base: "rli", share: 0.18 }  // educação
```

⭐ **A consequência é a coisa mais brasileira que este modelo pode dizer, e sai de graça:** numa
recessão a previdência e a folha **não cedem** — são valor absoluto — e a saúde e a educação
**encolhem sozinhas**, porque o piso delas é fração de uma receita que caiu. **Ninguém decidiu,
ninguém roteirizou, e o jogador é culpado assim mesmo.**

⚠ **O que ela custa:** o LASTRO calcula uma receita só, e passa a precisar separar **RCL** e
**receita líquida de impostos**. É o achado 26 do handoff pela outra ponta.

### 3.3 · ⭐ O calendário POLÍTICO — e o C7 já provou o padrão

O C7 entregou o calendário **fiscal**: quatro marcos, função pura de `month`, sem relógio.
**O político é a mesma peça, e muda mais o jogo.**

`REGIME.firstYear` é **2027**, logo o mandato é 2027–2030 e contém duas eleições:

| quando          | mês da partida | o quê                                      |
| --------------- | -------------- | ------------------------------------------ |
| outubro de 2028 | **21**         | eleição **municipal** — ano 2 do mandato   |
| outubro de 2030 | **45**         | eleição **geral** — o sucessor é escolhido |

📙 **A regularidade é a mais citada da política legislativa brasileira:** em ano eleitoral o
Congresso esvazia, e no segundo semestre quase não delibera. 📗 **E há trava legal junto:** a Lei
9.504/1997, art. 73, restringe transferência voluntária e conduta de agente público em ano de
pleito, e a LRF (LC 101/2000, arts. 21 e 42) proíbe despesa de pessoal e restos a pagar sem
lastro no fim do mandato.

⭐ **Hoje o jogo tem 48 meses e nenhum é diferente do outro para legislar** — a mesma queixa que
o C7 consertou para o orçamento, na metade que sobrou. E o custo é o mesmo: **função pura de
`month`**, sem estado novo e sem bump.

### 3.4 · ⭐ A presença — o jogo cobra o dobro do que a Constituição cobra

📗 **CF art. 47:** delibera-se por **maioria dos presentes**, presente a maioria absoluta.
📗 **CF art. 69:** lei complementar exige maioria absoluta — 257.

⚠ **O jogo exige 257 para tudo que não é emenda.** `SIMPLE_MAJORITY = floor(513/2)+1` em
`regime.mjs:40`, e `quorumOf` devolve isso para todo texto que não seja `amendment`. **Uma lei
ordinária pode passar com 129 votos num plenário esvaziado, e aqui ela custa 257.**

⭐ **E o que se perde não é desconto: é a arma da oposição.** Abaixo de 257 presentes a sessão
**não abre** — a pauta não morre, ela não acontece. Derrota sem ninguém votar contra, que é como
obstrução funciona. O [achado 4 da pesquisa 02](02-respostas-brasil-2026.md) já escreveu a
fórmula, e o `moodFactor` do ECLUSA já descreve a obstrução **em prosa** — _"aparece menos,
atrasa, esvazia sessão"_ — e depois a aplica só como voto a menos.

### 3.5 · ⭐⭐ A coalizão — e a literatura dá a ela uma FORMA, não só um nome

O D1 já é declarado o maior buraco do jogo. Este estudo acrescenta **duas coisas**:

📙 **1 · O termo tem autor e data:** _presidencialismo de coalizão_ é de Sérgio Abranches
(1988), e a tese é institucional — o presidente brasileiro é eleito por um sistema que
**garante** que ele não terá maioria própria, e governar é montar e manter coalizão.

📙 **2 · E o mecanismo tem uma medida publicada: a taxa de coalescência**, de Octavio Amorim
Neto — o quanto a divisão dos ministérios **espelha** o peso das bancadas na coalizão. Alta
coalescência prediz apoio legislativo; baixa prediz governo por decreto.

⭐ **É exatamente o que falta debaixo do A6, e transforma "demitir um ministro" de invenção em
conta:** o jogo já tem as oito áreas do rail como as oito pastas, `office` no ELENCO, `reach`
como a fração da bancada que a pessoa arrasta e `remember()` como o rancor. **A peça que falta é
a razão entre o que o partido tem de pasta e o que ele tem de cadeira** — e é ela que diz quanto
a base vale hoje.

⚠ **E o preço fica certo pelo lado feio também:** um governo com coalescência baixa governa por
MP, e é literalmente o que a literatura descreve. **O A4 e o D1 são o mesmo eixo.**

### 3.6 · O veto — e por que ele não pode entrar antes do A7

📗 **CF art. 66:** o presidente veta em **15 dias úteis**, total ou parcialmente; §2º — o veto
parcial só alcança **texto integral de artigo, parágrafo, inciso ou alínea**, nunca palavra
solta; §4º — a derrubada é em **sessão conjunta**, por maioria absoluta de cada casa.

⛔ **E ele é inútil hoje, por razão medida:** 100% dos textos deste jogo nascem do jogador. **Não
há o que vetar.** O veto é consequência do A7, e não item próprio — como o plano já diz.

### 3.7 · O contrapoder — nada desfaz o que o presidente faz

📗 **O cargo brasileiro é cercado, e o jogo não tem a cerca:** o STF suspende decreto por liminar
(A8), o TCU susta ato e julga conta, a PGR denuncia, e o Congresso susta ato normativo que
exorbite do poder regulamentar (CF art. 49, V).

⚠ **Hoje a única coisa que pode derrubar uma jogada do jogador é o Congresso, votando.** Um
presidente que baixa decreto neste jogo **nunca é surpreendido por uma liminar de quarta-feira**
— e isso é uma afirmação sobre o Brasil que o jogo faz sem querer.

---

## 4 · ⛔ O QUE EU RECUSARIA, e a razão de cada um

| pedido                                       | por quê                                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **indulto e comutação** 📗 (art. 84, XII)    | real, e **sem superfície neste modelo**: não move índice, receita nem bancada. Entraria como texto sem motor                          |
| **tratados e relações exteriores**           | já recusado: _"Fase 1 só o Brasil"_. Não reabrir sem pedido                                                                           |
| **Forças Armadas como instrumento**          | o briefing 01, pergunta 39, procurou proxy público de alinhamento e **não há**. Modelar sem ele é inventar número                     |
| **estado de defesa e de sítio** 📗 (136–141) | ⚠ **não é recusa, é ORDEM:** ele pertence ao eixo de concentração de poder, que já existe (`POWER_STEPS`). Entra por lá, ou não entra |

---

## 5 · O QUE PRECISA VOLTAR DA PESQUISA — adendo ao briefing 01

Nenhuma destas está nos blocos 0 a 8, e as três primeiras travam mecânica descrita acima.

44. **MP em números** — quantas MPs por ano um governo edita, quantas caducam, quantas viram
    lei, e **quantos dias a pauta fica trancada** num ano típico. É a calibragem do A4;
45. **Urgência constitucional** — com que frequência é pedida, e o que acontece quando o prazo
    vence: a pauta trava mesmo, ou a Casa contorna?
46. **A taxa de coalescência**, ano a ano, dos governos desde 1995, com o apoio legislativo de
    cada um ao lado. É a régua do D1;
47. **A produtividade legislativa por ano do ciclo** — quantas proposições o Congresso aprova em
    ano de eleição municipal e em ano de eleição geral, contra ano ímpar. É a régua do 3.3;
48. **RCL e receita líquida de impostos** — os dois valores, separados, com ano-base. É o que o
    LASTRO precisa devolver para o piso proporcional existir;
49. **Liminares** — com que frequência o STF suspende ato do Executivo, e quanto tempo leva entre
    o ato e a decisão. É o relógio do A8.

---

## 6 · ⛔ O QUE ESTE ARQUIVO NÃO É

- **não é plano** — nenhuma linha foi orçada, medida ou posta em ordem de execução;
- **não abre trabalho** — o plano em vigor é o [ciclo 13](../cycles/13-o-glorioso.md), em 25 de 49;
- **não traz número** — traz forma de mecanismo e endereço de norma. Número vem do briefing, com
  fonte e ano-base, ou não vem;
- **não reabre o [ADR 0003](../adr/0003-o-mundo-e-real-as-pessoas-sao-inventadas.md)** — o mundo é
  real, as pessoas são inventadas.
