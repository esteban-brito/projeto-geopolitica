# Ciclo 2 — tudo é uma alavanca, e toda alavanca tem preço

> Combinado na sexta sessão, em 13/08/2026, depois que o responsável usou a tela
> e recusou o desenho da ação: _"pauta pronta é uma bosta, onde tem criatividade
> nisso e liberdade?"_. O estado verificado está em
> [`../handoff.md`](../handoff.md); este arquivo é o que ficou **acordado fazer**,
> e por quê.
>
> **Este ciclo é grande.** Ele não cabe numa sessão e não finge caber: são oito
> partes com ordem declarada, e cada uma fecha sozinha e verde. O ciclo 1 tinha
> sete itens pequenos; este tem quatro motores.

## O pedido, e o que cada pedido realmente ataca

| pedido                                                                        | o que está por baixo                                           |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| tirar o bloco de "entendi" do avançar o mês                                   | o relatório interrompe em vez de informar                      |
| poder apertar avançar quantas vezes quiser                                    | o ritmo é do jogador                                           |
| dividir Fazenda em **Finanças** e **Economia**                                | _como o país está_ e _quanto se cobra_ são duas perguntas      |
| **slider por item**, em todo ministério                                       | criatividade não cabe num menu                                 |
| **reforma** com um mínimo, ou só mexer nos sliders                            | o rito tem de ser consequência do conteúdo                     |
| taxar fortunas para erguer um palácio imperial; privatizar até o Estado sumir | o motor tem de **aceitar a loucura e devolver a consequência** |

## As três leis deste ciclo

**1. Nada é recusado por regra. Tudo é cobrado por preço.**
Não existe "ação inválida". Existe conta que não fecha, votação que não passa,
rua que não aceita e general que não obedece.

**2. A posição ideológica não é controle. É sombra.**
O jogador nunca arrasta um cursor no plano `econômico × liberdades`. Ele mexe em
leitos, alíquota, propriedade da estatal, poder do Executivo — e a posição é
**calculada** do que ele moveu. Não há atalho para o cursor porque o cursor não
está na tela.

**3. O que é impossível no mês 1 tem de ser possível no mês 40.**
O preço de uma jogada radical **cai** quando o jogador constrói as condições. É a
janela de Overton, e ela é a diferença entre "tudo tem preço" no papel e no jogo.

---

## A mecânica central: a alavanca

Some o catálogo de pautas. Entra **uma** primitiva, e o jogo inteiro é feita dela.

Uma **alavanca** é um controle contínuo de 0 a 100 com posição própria no plano
ideológico. Elas vêm em duas famílias, e a diferença é só a moeda que gastam:

| família               | exemplo                       | o que custa mexer                               |
| --------------------- | ----------------------------- | ----------------------------------------------- |
| **alavanca de verba** | leitos de UTI, atenção básica | bilhões, do mesmo caixa                         |
| **alavanca de regra** | quanto da Petro é do Estado   | nada em dinheiro; muda como os motores calculam |

### A derivação — uma fórmula só, para as duas famílias

```
Δ_a       = nível_pedido − nível_vigente
peso_a    = |Δ_a| × alcance_a
posição_a = Δ_a > 0 ? pos_a : (100 − pos_a)        ← O CORTE É O ESPELHO
econômico = Σ peso_a × econômico_a / Σ peso_a
liberdade = Σ peso_a × liberdade_a / Σ peso_a
ameaça    = Σ peso_a × ameaça_a   / Σ peso_a
```

`alcance` é **quanto do país aquilo toca, em bilhões**, e é o que torna as duas
famílias comparáveis: numa alavanca de verba ele é o custo anual; numa de regra é
o tamanho do setor ou o peso institucional do que se mexe. Isso obriga quem
escreve o catálogo a declarar o tamanho de cada coisa — e é o que impede
"privatizar a padaria da esquina" de pesar tanto quanto "privatizar a Petro".

**A linha do espelho é o coração.** Gastar mais num programa põe a proposta onde o
programa está; cortá-lo põe no lado oposto. Cortar atenção básica é uma proposta
de direita, e ninguém escreveu isso em lugar nenhum — cai da fórmula.

**Quando `Σ peso = 0`, não há proposta.** A tela diz isso e não fabrica um vetor
em (50, 50), que seria uma proposta centrista fantasma.

### Por que isto não é o "cursor no mapa" que o projeto recusou

`bills.mjs` declara, em prosa, a razão da pauta pronta:

> Controle vetorial livre viraria um problema de otimização — bastaria arrastar o
> projeto para o meio da maior bancada.

**A objeção está certa e não alcança isto.** Ela vale contra dois sliders chamados
"econômico" e "liberdades". Aqui, para empurrar a proposta até o Centrão, o
jogador tem de **financiar de fato o que o Centrão quer**, com dinheiro do mesmo
caixa, mudando o país de verdade. O vetor é a fatura, não o volante.

---

## Parte 1 — a Mesa para de interromper

**Tamanho:** pequeno. **Depende de:** nada.

### 1.1 O relatório sai do `<dialog>` e vira painel

O modal foi a forma certa de provar que o relatório existia, e virou pedágio: um
clique obrigatório por mês, 48 por mandato, para ler o que já estaria na tela. Ele
vira **faixa fixa na Mesa**, com o último mês resolvido — placar contra previsão,
deriva por bancada, prometido contra pago, rateio, e o que a alocação moveu.
Histórico numa lista de meses.

**Feito.** O painel é a terceira superfície da Mesa, e a mais leve das três
(`glass-support`, o mesmo nível da faixa de índices): a peça central é a
negociação, e o mês passado é contexto. Não nasceu folha nova — o enquadramento
do painel é da tela da Mesa e mora em `50-screen-mesa.css`; o bloco `.report`
continua em componentes porque serve também ao aviso. O `<dialog>` ficou, e
encolheu de papel: carrega só o **aviso**, que é interrupção legítima porque algo
deu errado. O botão "O mês passado" saiu — botão que abre o que já está aberto é
ruído com cara de funcionalidade.

### 1.2 Avançar o mês vira repetível

**Feito.** Sem confirmação, clicável em sequência. O que segura o jogador não é um
diálogo — é a lealdade decaindo 1,5 ao mês, e quem avança dez meses sem pagar
ninguém chega na obstrução.

O travamento de reentrada entrou, e a razão dele é mais estreita do que parecia:
`playMonth` é síncrono, mas a pintura passa por View Transition e a promessa dela
demora alguns quadros. Dois cliques dentro dessa janela resolveriam **dois meses
sobre o mesmo estado**, e o segundo relatório descreveria um mundo que ninguém
viu. O botão desliga enquanto a transição corre e volta quando ela termina.

> **Verificado:** `npm run walk` verde, com prova nova de três cliques seguidos em
> "avançar" sem nada entre eles. `npm run screen` mediu 240,3 × 240,4 fps — a
> terceira superfície não custou material.

---

## Parte 2 — a alavanca de verba, e o orçamento como mixer

**Tamanho:** grande. **Depende de:** nada — o preço já existe, porque o dinheiro é
escasso e o LASTRO raciona.

### 2.1 Dois níveis de controle, como orçamento de verdade

O erro de um slider absoluto por programa é que "aumentar tudo" vira sempre a
jogada ingênua, limitada só pelo caixa. O erro de um mixer normalizado em 100% é
que ele não sabe dizer "cortei a saúde pela metade". **Os dois níveis existem:**

- **envelope da área** — quantos bilhões vão para a Saúde neste mês (absoluto);
- **composição** — como esses bilhões se repartem entre os programas dela, em
  percentuais que somam 100.

```
verba_p = envelope_área × composição_p / Σ composição_área
```

A composição é onde nasce a decisão que a pauta pronta nunca teve: **mesmo sem um
centavo a mais, alguém dentro do ministério perde.** Tirar 20 pontos das
universidades para o ensino fundamental é uma jogada completa — de esquerda numa
metade e de direita na outra —, e o vetor derivado sabe disso.

### 2.2 O catálogo novo: `src/data/programs.mjs`

```js
{
  id: "atencao-basica",
  area: "health",
  label: "Atenção básica",
  unit: "equipes de saúde da família",   // o que o número significa
  economic: 22, liberty: 58, threat: 0,  // onde ESTE gasto fica no plano
  cost: 92,          // bilhões/ano com o programa em 100
  initial: 68,       // a intensidade herdada na posse
  floor: 40,         // o piso que a lei vigente garante
  ceiling: 100,
  entrenched: true,  // o piso é constitucional? decide lei × emenda
  weight: 0.9,       // o peso dele no índice da área
  lag: 3,            // quando o efeito chega
}
```

Cinco a seis por área, ~40 no total. É o grosso do trabalho de catálogo do ciclo,
e é trabalho de prosa tanto quanto de número: cada `economic`/`liberty` é uma
afirmação sobre o mundo do jogo, e vai declarada como tal, no molde que
`areas.mjs` e `parties.mjs` já seguem.

O `lag` por programa é o que faz **prevenção × UTI** ser uma escolha de verdade:
posto de saúde agrada devagar e reduz gasto futuro; leito de alta complexidade
apaga incêndio agora e engole dinheiro rápido.

### 2.3 A despesa obrigatória deixa de ser um número solto

Esta é a peça que amarra o ciclo, e conserta uma dívida do modelo atual. Hoje
`initialMandatory` cresce vegetativamente e **nenhuma decisão do jogador o
alcança**: reforma da previdência é um `fiscalImpact: +48` digitado a mão. Passa a
ser derivada:

```
obrigatória = Σ custo_p(t) × piso_p / 100
```

O que a reforma faz é **mexer no piso** — e a economia fiscal dela não é um número
escolhido, é a conta do piso que caiu. O envelope de uma área não desce abaixo da
soma dos pisos dela sem reforma, que é exatamente a vinculação constitucional
existindo como mecânica em vez de como texto.

> **Prova nova, e a mais importante do ciclo:**
> `O PAIS HERDADO CABE NO ORCAMENTO HERDADO` — a soma dos programas em `initial`
> bate com `initialMandatory + initialDiscretionary`. Sem ela existem duas
> verdades sobre quanto o Estado gasta, e elas divergem no primeiro mês.

---

## Parte 3 — a alavanca de regra, e a segunda moeda

**Tamanho:** grande. **Depende de:** Parte 2 (mesma derivação) e Parte 4 para o
efeito econômico de metade delas.

Sem esta parte, a "jogada Ancap" seria arrastar tudo para zero — o que não é
privatizar, é deixar de pagar. E a "jogada monarquista" não teria como ser
expressa de forma nenhuma. **Política que não se mede em reais precisa de moeda
própria**, e é isso que `src/data/rules.mjs` traz.

### 3.1 As quatro famílias

| alavanca                       | 0                     | 100                     | onde ela morde                  |
| ------------------------------ | --------------------- | ----------------------- | ------------------------------- |
| **propriedade** (por setor)    | tudo privado          | tudo estatal            | PIB, receita, folha, dividendos |
| **regulação** (por setor)      | desregulado           | rédea curta             | produtividade e risco           |
| **poder do Executivo**         | Congresso decide tudo | o Executivo decide tudo | o que a caneta alcança; tensão  |
| **autonomia do Banco Central** | o governo fixa o juro | o BC fixa o juro        | a regra monetária da CORRENTE   |

Privatizar é arrastar propriedade para 0. Estatizar, para 100. Não existe verbo
nenhum em menu nenhum: **é o mesmo slider, no mesmo painel, com o mesmo rito
derivado.**

### 3.2 A privatização paga adiantado, e cobra depois

Mexer em propriedade tem três efeitos, e o realismo está no terceiro:

1. **receita extraordinária** no mês da venda — `alcance × preço`;
2. **folha e dividendos somem** da conta permanente, nos dois sentidos;
3. **a receita extraordinária levanta a âncora do arcabouço do ano seguinte** — e
   quando ela não se repete, o teto encolhe contra uma obrigatória que cresceu.

Ninguém escreve "armadilha da privatização". Ela é aritmética do arcabouço que já
está no LASTRO, e é o mesmo mecanismo que faz o contingenciamento existir hoje.

### 3.3 A alavanca de poder move as outras alavancas

`poder do Executivo` é a alavanca que mexe nas **faixas** `[piso, teto]` das
demais: quanto mais alto, mais coisa a caneta alcança sem passar pelo Congresso.
É a janela de Overton com endereço no código.

E ela é a única que **não se compra com verba**: seu preço é tensão institucional
(Parte 6). Um presidente com 400 cadeiras e o país satisfeito a sobe sem susto; um
com a base rompida a sobe e cai.

### 3.4 O Banco Central: independente, e a independência é uma alavanca

Decisão tomada, e ela concilia realismo com liberdade total: **o BC nasce
independente**, e o juro é a primeira coisa que o jogador **sofre e não controla**
— não se compra, não se decreta, e é o que impede gastar sem consequência.

Mas a independência é lei, e lei é alavanca. Quem quiser o juro na mão do governo
arrasta `autonomia do BC` para baixo — cruza um limite pétreo, exige 308 votos,
sobe a ameaça e, se passar, entrega o dial do juro ao jogador junto com a inflação
que vier depois. **Nada bloqueado, tudo cobrado.**

---

## Parte 4 — CORRENTE, a economia que dá preço à alíquota

**Tamanho:** médio-grande. **Depende de:** nada.

O critério do projeto é _um botão entra quando o preço dele já existe no modelo_.
As alavancas de verba já nascem com preço. **A alíquota, não**: hoje
`receita = PIB × taxLoad` com `taxLoad` constante, e subir imposto seria receita
de graça — o botão mais quebrado que este jogo poderia ter.

Nasce `src/domain/economy/` na versão mínima honesta:

- **PIB** responde a capacidade da Produção (já existe, via MALHA), carga
  tributária (elasticidade declarada), estatização e regulação (Parte 3) e juro
  real;
- **inflação** por Phillips com hiato do produto;
- **juro** por Taylor simplificada — e é aqui que a autonomia do BC decide quem
  escreve o número;
- **desemprego** por Okun;
- **juros incidem sobre a dívida**, encerrando a premissa declarada como pendente
  desde o ciclo 1.

Entra **população com crescimento** no catálogo — sem ela não existe PIB per
capita, que foi pedido explicitamente.

> **Declarado fora:** câmbio, setor externo, expectativas e perfil da dívida.

---

## Parte 5 — o Congresso deixa de ter muro

**Tamanho:** pequeno-médio. **Depende de:** nada.

O projeto promete que tudo tem preço, e o ECLUSA hoje tem um teto que desmente
isso:

```js
const paid = clamp01(funding[party.id] ?? 0);
resistance = distance * (1 - venality * paid) + bill.threat * venality * THREAT_WEIGHT;
```

Com `paid` travado em 1, a Direita liberal (venalidade 0,08) mantém **92% da
resistência por qualquer preço**. Isso não é um preço, é um muro com aparência de
preço — e é o achado 3 que o ciclo 1 deixou registrado como tensão viva.

**A verba passa de fração a múltiplo.** `funding` deixa de ser 0–1 e passa a 0–N:
pagar três vezes o normal a uma bancada é possível. O custo é **convexo** acima de
1 — a verba normal se distribui pela liderança, e o excedente é varejo, comprado
deputado a deputado. Para zerar a resistência da Direita liberal seria preciso um
múltiplo astronômico: **possível, e caríssimo**, que é exatamente o que a doutrina
do projeto manda.

Ajustes que isso obriga: a resistência satura em zero em vez de virar negativa, e
o `settle` da traição passa a medir o buraco em **fração do prometido**, não em
diferença absoluta — senão prometer 3 e pagar 1 seria contado como duas traições.

---

## Parte 6 — a tensão institucional, e como você cai

**Tamanho:** médio. **Depende de:** Partes 3 e 5.

Hoje **não existe como perder**. Não há impeachment, não há golpe, não há derrota
— e um jogo em que a jogada radical não pode te derrubar não é liberdade, é
sandbox. Esta parte é o que transforma a Parte 3 em aposta.

A forma já estava decidida no handoff: **variável de estado, não motor novo.**

```
tensão   += Σ (ameaça × peso) do que entrou em vigor por decreto ou por poder
tensão   −= decaimento lento          (o país esquece devagar)
escudo    = base no Congresso          ← o que existe HOJE
risco     = f(tensão − escudo)
```

O risco saca do fluxo de eventos e abre dois caminhos, e nenhum é instantâneo:
**pedido de impeachment** (que vira uma votação de 342 e portanto joga no tabuleiro
que já existe) e **ruptura militar**, que só é possível com a tensão no teto.

> **O escudo está pela metade, e fica declarado.** A frase do próprio projeto é
> _"o jogador pode ser tão autoritário quanto for popular"_ — e popularidade é
> SONDA, que este ciclo não escreve. O escudo que existe hoje é a base no
> Congresso, que é real e é metade da verdade. **A SONDA é o primeiro item do
> ciclo 3**, e é ela que fecha a janela de Overton: sem aprovação, o caminho para
> a jogada extrema passa só por comprar deputado.

---

## Parte 7 — Finanças e Economia

**Tamanho:** médio. **Depende de:** Partes 2, 3 e 4.

**Finanças** (`finance`) — o painel do país, onde o jogador **lê**: PIB, PIB per
capita, crescimento, inflação, juro, desemprego, dívida bruta, dívida/PIB,
receita, obrigatória, discricionário, resultado primário, o teto do arcabouço e o
quanto falta para ele morder — com série dos 48 meses. Mantém o índice de
**arrecadação** que a Fazenda tinha, e os programas dela são a máquina de cobrar:
fiscalização, Receita, dívida ativa, tecnologia.

**Economia** (`economy`) — onde se cobra. Não tem envelope: tem **alíquotas**, uma
por tributo (consumo, renda física, renda jurídica, patrimônio, folha). Cada uma
com posição própria — taxar patrimônio e taxar consumo são atos ideologicamente
opostos, e a média ponderada já sabe. A carga total emerge da soma e entra em
`taxLoad`. Alíquota quase sempre cruza limite legal: **imposto se muda por lei**, e
por isso a Economia é a área que mais gasta capital político.

`AREAS` vai de seis para sete, e a prosa da cadeia fechada em `areas.mjs` se
reescreve: _"Economia arrecada, Finanças cobra o que é devido, e as duas financiam
as outras cinco"_. O rail ganha a sétima linha; `npm run screen` refaz a medição
de material com sete telas.

---

## Parte 8 — o rito, o mínimo, e o que prova que nada mente

**Tamanho:** médio. **Depende de:** tudo.

### 8.1 O rito é consequência, e não escolha

O jogador **nunca** escolhe "lei" ou "emenda":

| o que o movimento faz                            | rito        | quórum                            |
| ------------------------------------------------ | ----------- | --------------------------------- |
| tudo dentro das faixas e o dinheiro cabe         | **caneta**  | nenhum                            |
| cruza piso ou teto legal                         | **lei**     | 257                               |
| cruza limite `entrenched`                        | **emenda**  | 308                               |
| cruza limite e o jogador não quer esperar o voto | **decreto** | nenhum, e a conta chega em tensão |

O slider **não trava** no limite: ele atravessa, e ao atravessar o painel muda de
"isto se resolve na caneta" para "isto precisa de 257 votos", com o placar
previsto ali do lado. **A trava nunca é da interface — é da lei, e a lei é
alavanca.**

### 8.2 Os dois mínimos da reforma

**De conteúdo:** reforma que move menos que um limiar é recusada com a razão na
tela — _"isto cabe na caneta"_. Gastar 257 votos para mudar 0,3 bilhão é queimar a
pauta do mês, e a pauta do mês é uma só.

**De coerência:** a reforma é **um texto só**. Tudo que ela move vai junto ao
plenário, e daí nasce a decisão que a pauta pronta não tinha — juntar o corte
impopular com a bondade popular **aproxima a proposta do centro e barateia o
voto**, ao custo de a bondade sair mais cara. É logrolling, e cai da média
ponderada sem regra nova.

### 8.3 O que acontece com `bills.mjs`

**Não morre; muda de papel.** A prosa dele defende algo que continua valendo — os
títulos evocam debates reconhecíveis, e reconhecimento é o que dá intuição antes
da matemática. As seis pautas viram **modelos**: "Reforma administrativa" passa a
ser um botão que **posiciona as alavancas**, e o jogador edita a partir dali. O
nome sobrevive, o número vira dele. `fiscalImpact` e `impact` saem do arquivo —
passam a ser derivados.

### 8.4 As provas

- `O PAIS HERDADO CABE NO ORCAMENTO HERDADO` — a soma bate a posição inicial;
- `NENHUM MOVIMENTO NULO VIRA PROPOSTA` — `Σ peso = 0` não produz vetor;
- `CORTAR ESPELHA` — o mesmo dial para cima e para baixo dá posições simétricas;
- `O RITO SAI DO CONTEUDO` — o instrumento derivado nunca é menos exigente que o
  limite cruzado;
- `NENHUMA PROPOSTA E INVOTAVEL` — a prova do ciclo 1, agora contra propostas
  **geradas** e não contra seis linhas de tabela. Ela fica muito mais forte: passa
  a varrer o espaço em vez de conferir uma lista;
- `A OBRIGATORIA SO CAI POR REFORMA` — nenhum caminho de caneta reduz piso;
- `O MURO NAO EXISTE` — para toda bancada há múltiplo de verba que zera a
  resistência, e o custo dele é finito;
- `A TENSAO NAO CAI SOZINHA ABAIXO DO QUE FOI FEITO` — decreto some da tela,
  não da conta.

### 8.5 A varredura, que virou pré-requisito

Com proposta gerada, o espaço de jogadas deixa de ser 6 e vira contínuo —
calibrar "no olho" para de ser possível. A varredura sai do ciclo 1 e vira
**instrumento obrigatório**: roda o mandato sob N políticas e imprime aprovadas,
meses de contingenciamento, dívida final, mês da ruptura e mês da queda.

O alvo se declara antes de girar qualquer número, e o alvo é o defeito medido no
ciclo 1: **26 votações, 26 aprovações**, com fazer tudo sendo fiscalmente melhor
que não fazer nada.

### 8.6 O passeio

`npm run walk` cresce: arrastar dentro da faixa e ver "caneta"; atravessar o piso
e ver o rito virar lei com o placar aparecendo; remanejar composição sem mexer no
envelope; avançar três meses seguidos sem clicar em nada entre eles; e uma jogada
radical no mês 1 terminando em queda.

---

## A ordem, e por que ela é essa

| parte | entrega                             | depende de      | tamanho       |
| ----- | ----------------------------------- | --------------- | ------------- |
| 1     | Mesa sem modal, mês repetível       | —               | pequeno       |
| 2     | alavanca de verba, envelope + mixer | —               | grande        |
| 3     | alavanca de regra                   | 2, e 4 em parte | grande        |
| 4     | CORRENTE mínima                     | —               | médio-grande  |
| 5     | o Congresso sem muro                | —               | pequeno-médio |
| 6     | tensão institucional e a queda      | 3, 5            | médio         |
| 7     | Finanças e Economia                 | 2, 3, 4         | médio         |
| 8     | rito, mínimos, provas, varredura    | tudo            | médio         |

A 1 sai primeiro por ser barata e por já ter incomodado duas vezes. A 2 não espera
ninguém porque o preço dela já existe. A 5 pode entrar a qualquer momento e é a
mais barata das que mudam o jogo. A 7 é a única que espera por princípio: **a
Economia sem CORRENTE seria um botão de receita de graça**, que é o tipo de botão
que o critério do projeto existe para barrar.

## O que este ciclo NÃO faz, declarado

- **SONDA** — a aprovação continua fora da tela, e com ela metade do escudo da
  Parte 6. É o **primeiro item do ciclo 3**, e o argumento a favor dela agora é
  mais forte do que nunca: sem aprovação, a janela de Overton abre só com
  dinheiro;
- **quem perde tem nome** — cortar universidade custa voto no Congresso e **zero**
  na rua. Escrever `constituency` nos programas agora seria escrever um campo que
  nenhum motor lê, que é o defeito que este projeto foi desenhado para não ter.
  Fica declarado como ausente e entra junto da SONDA;
- **realinhamento de bancada** — posição de partido segue constante. É a outra
  metade da janela de Overton, e vem no ciclo 3 com a SONDA;
- **regime jogável** — a alavanca de poder chega perto, mas trocar o regime (o
  Congresso sumir do jogo, a monarquia se instalar) segue "alpha da alpha". O que
  este ciclo entrega é o **caminho** até lá com preço em cada passo;
- **CASCATA, TEMPORAL, DELTA** — seguem contratos.

## O que foi recusado do plano externo avaliado

**"Intensidade: Leve (Decreto), Moderado (PL), Radical (PEC)."** Intensidade e
rito não são o mesmo eixo — mudar uma vírgula de cláusula pétrea exige PEC, e
remanejar 40 bilhões pode ser caneta pura. Deixar o jogador **escolher** o rito num
dial reabre o menu que este ciclo existe para fechar.

**"Alvo × Ação × Intensidade", com Ação sendo um dropdown de verbos.** É a pauta
pronta com um passo a mais: um menu de verbos em vez de um menu de leis. A mesma
expressividade sai da alavanca de regra, e sai sem menu nenhum.

**"A aba do Congresso some do jogo."** Apagar o motor que carrega quase toda a
tensão da partida é mudança de regime, e é justamente o que está parado como
"alpha da alpha".
