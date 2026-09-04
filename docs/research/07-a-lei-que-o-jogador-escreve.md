# PESQUISA 07 — a lei que o jogador escreve, e o mundo que tem opinião sobre ela

> **Escrita em 04/09/2026**, a pedido dele, e ela nasce de duas frases:
>
> - _"não quero gastar mais nenhum centavo com o jogo, então não pretendo integrar uma IA, o
>   que eu quero é de alguma forma criar uma IA, ou algo parecido, no meu jogo"_;
> - _"se ela Lei por exemplo funcionasse plenamente dentro do meu jogo, acredito que muitas
>   outras leis funcionariam também"_.
>
> ⚠ **Ele está certo, e este documento é a prova disso.** Apurei **33 propostas** de um plano de
> governo real e passei todas pela gramática do motor. Elas se repartem em **sete verbos**, e
> **dois deles já rodam**. A intuição da pergunta é o achado: uma lei não é um texto, é uma
> frase com encaixes — e o jogo já tem quase todos os encaixes.

---

## 0 · Os graus de confiança

📗 norma · 📰 apurado na web em 04/09/2026 · 📐 medição deste repositório

---

## 1 · ⭐ A GRAMÁTICA JÁ EXISTE, e ela é mais completa do que o handoff dizia

📐 **Medido em `src/domain/norms/index.mjs`.** O motor ESTRATO lê hoje, em produção, esta forma:

| encaixe           | o campo             | o que ele diz                                                      | existe? |
| ----------------- | ------------------- | ------------------------------------------------------------------ | ------- |
| **o verbo**       | `kind`              | o que a lei FAZ                                                    | ⚠ um só |
| **quem**          | `target.scope`      | uma alavanca · um grupo · tudo                                     | ✔       |
| **o salvo**       | `target.except`     | quem escapa da regra                                               | ✔       |
| **o quanto**      | `floor` · `ceiling` | o mínimo que obriga, o máximo que autoriza                         | ✔       |
| **o vinculado**   | `share`             | fração da receita, e não valor                                     | ✔       |
| **o enquanto**    | `trigger`           | indicador · acima/abaixo · valor                                   | ✔       |
| **a partir de**   | `from`              | a vacatio                                                          | ✔       |
| **por quanto**    | `months`            | a vigência, e o que caduca                                         | ✔       |
| **no lugar de**   | `repeals`           | o que ela derruba                                                  | ✔       |
| **a que preço**   | `guard`             | caneta · lei · Constituição                                        | ✔       |
| **por que dorme** | `Sleep`             | revogada · futura · vencida · gatilho desligado · não alcança nada | ✔       |

⛔ **E o buraco é UM, e está na linha 26 do arquivo:**

```
@property {"band"} kind - o unico tipo de clausula que existe hoje
```

**Toda lei deste jogo diz a mesma frase:** _"o programa X gasta no mínimo A e no máximo B"_.
Piso e teto. Dez encaixes prontos, e **um verbo só**.

⚠ **E o canal é ainda mais estreito que a gramática** — achado 11: o jogador só manda `bands`.
Gatilho, exceção, vacatio, vigência e revogação **são executados e não são escritos por ninguém**.

---

## 2 · AS 33 PROPOSTAS, e o verbo que cada uma pede

📰 Apuradas no plano de governo de Renan Santos (Missão) para 2026 — o "Livro Amarelo", 500+
páginas — e nas coberturas de Gazeta do Povo, CNN Brasil, Band, Congresso em Foco, Metrópoles,
A Pública e Ponta Negra News, todas de agosto e setembro de 2026.

⚠ **Elas entram aqui como FORMA, nunca como pessoa** — [ADR 0003](../adr/0003-o-mundo-e-real-as-pessoas-sao-inventadas.md).
O que interessa é o **formato jurídico** de cada uma, e ele é real e público. O nome do
proponente não entra no jogo.

### 2.1 · ✔ VERBO 1 — `band`: fixar piso e teto · **RODA HOJE**

| proposta                                       | como ela entra                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| **desvincular os pisos de saúde e educação**   | muda o `share` de duas regras herdadas. `guard: constitution`          |
| **desindexar a previdência do salário mínimo** | troca `share` por `floor` fixo                                         |
| **PEC do Equilíbrio Fiscal**                   | mexe no teto do arcabouço, e o rito é emenda                           |
| **infraestrutura de 2% para 4% do PIB**        | `share` em Transportes e Energia                                       |
| **reduzir benefícios tributários**             | 📐 `waiver` já existe — "Desoneração setorial" é programa com renúncia |
| **fim dos supersalários**                      | teto em "Pessoal do Executivo"                                         |

⭐ **Seis propostas de um plano de governo real rodam no jogo de hoje, sem uma linha nova.**

### 2.2 · ▶ VERBO 2 — `spend`: criar um programa · **QUASE RODA**

📐 O jogo tem **38 programas**, cada um com piso, teto, guarda jurídica, área e custo por ponto
de índice. A máquina inteira existe. **O que não existe é o jogador escrever o 39º.**

| proposta                                         | o que ela é                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **Frentes Cidadãs**                              | ⭐ revoga "Transferência de renda" e cria outro no lugar — **e `repeals` já existe** |
| **Marco Nacional da Desfavelização**             | programa de R$ 900 bi em 10 anos, e o mandato tem 4                                  |
| **superpresídios**                               | programa em Segurança, com atraso de entrega                                         |
| **escolas cívico-militares**                     | programa em Educação                                                                 |
| **SUS digital** — prontuário, fila, telemedicina | programa em Saúde                                                                    |
| **AgroBrasil 2030**                              | programa em Agricultura                                                              |
| **bolsas de mérito no lugar das cotas**          | revoga um, cria outro — o mesmo par das Frentes                                      |

⭐ **Sete propostas por UM item**, e é o mais barato da lista inteira: o esquema, a validação, a
MALHA e a tela de área já tratam programa. Falta a ordem que cria um.

### 2.3 · ⛔ VERBO 3 — `condition`: condicionar dinheiro a resultado · **É A LRG**

📰 **A Lei de Responsabilidade Gerencial**, e ela é o caso que este documento existe para
resolver. A LRF cobrou **a conta** dos prefeitos; a LRG cobraria **o resultado**.

- indicadores objetivos por município — IDEB, cobertura vacinal, água tratada, integridade;
- abaixo do mínimo, o município entra em **tutela gerencial**: gastar exige duas assinaturas, a
  do prefeito e a de um interventor federal;
- reincidente perde o mandato e fica inelegível por 8 anos, por "improbidade gerencial";
- quem entrega **ganha mais emenda**;
- e o fundo partidário passa a olhar a qualidade dos prefeitos do partido.

| proposta                                    | o que ela condiciona                       |
| ------------------------------------------- | ------------------------------------------ |
| **Lei de Responsabilidade Gerencial**       | repasse ↔ indicador                        |
| **prefeito que não entrega não se reelege** | elegibilidade ↔ indicador                  |
| **fundo partidário por desempenho**         | dinheiro do partido ↔ indicador            |
| **cláusula antimáfia**                      | existência do mandato ↔ captação criminosa |

⭐ **A METADE DIFÍCIL JÁ ESTÁ PRONTA.** `trigger` é exatamente _"enquanto o indicador estiver
abaixo de N"_ — e ele roda, com prova, e o motor até sabe dizer que uma norma está dormindo
**porque o gatilho está desligado**.

⛔ **O que falta são duas coisas, e só duas:**

1. **um segundo verbo** — hoje o gatilho só liga e desliga uma faixa. Ele precisa poder ligar
   e desligar **uma consequência**: cortar repasse, dar emenda, tirar mandato;
2. **um alvo que não é alavanca.** `scope` é `lever | group | all`. A LRG mira **entes** —
   municípios. Isso é o pacto federativo, item **A10** do ciclo 13, que o ciclo 17 já apontava
   como a ponte para os 27 estados.

### 2.4 · ⛔ VERBO 4 — `body`: criar um órgão com poder próprio

📰 **Comissariado Federal de Gestão Pública** — autarquia nova, vinculada à Fazenda, com
autonomia técnica e **mandato fixo**.

⭐ **E o mandato fixo é o desenho de jogo inteiro numa palavra:** você cria o órgão, nomeia
quem o dirige, e **não pode demiti-lo depois**. Um poder que você mesmo criou e que passa a te
constranger. É o contrapoder mais barato de construir, porque nasce de uma jogada sua.

Mesma família: a **tutela gerencial** (dupla assinatura), o **tribunal especializado** da Lei
Antifacção, e o **tribunal do foro privilegiado**.

### 2.5 · ⛔ VERBO 5 — `status`: mudar o estatuto de um ente

| proposta                                                    | o que ela muda                  |
| ----------------------------------------------------------- | ------------------------------- |
| **Grande Consolidação Municipal** — 5.570 para 1.656        | quantos entes existem           |
| **Rio com autonomia de distrito**                           | o estatuto de um ente           |
| **STF restrito a Corte Constitucional**, fim da monocrática | o poder de um contrapoder       |
| **extinguir a Justiça do Trabalho**                         | apaga um ente inteiro           |
| **Zonas Econômicas Especiais no Nordeste**                  | regra tributária por território |

⚠ **Nenhuma delas entra sem o mapa.** Este verbo é o mais caro do documento, e é o único que
não tem meio-termo: ou existem entes no jogo, ou nenhuma das cinco existe.

### 2.6 · ▶ VERBO 6 — `power`: concentrar ou devolver poder · **MEIO EXISTE**

📐 `POWER_STEPS` roda hoje: **a 60 a emenda vira lei, a 85 a lei vira caneta**. É uma alavanca
contínua que barateia o rito de tudo, e ela tem guarda de PEC.

| proposta                                                                | onde ela cai                               |
| ----------------------------------------------------------------------- | ------------------------------------------ |
| **Estado de Defesa sucessivo**                                          | degrau de `POWER_STEPS`, com prazo e preço |
| **Direito Penal do Inimigo**                                            | suspende direito — degrau alto             |
| **Lei Antifacção** — banimento, dissolução, perda de direitos políticos | degrau + verbo 4                           |
| **expulsar ONGs internacionais**                                        | degrau, e cobra do lado externo            |
| **Código de Imprensa**                                                  | ⭐ degrau que mexe em **quem pode falar**  |

⭐ **O Código de Imprensa liga direto no que ele quer construir:** se a mídia é um agente do
jogo, uma lei que a regula é uma lei que muda **como o jogo te avalia**. É a jogada mais
perigosa e mais interessante da lista inteira.

### 2.7 · ▶ VERBO 7 — `tax`: mexer em alíquota · **CANAL MORTO, e é barato**

📐 `taxDelta` é lido pela CORRENTE com `taxDrag: 0,35`, e **ninguém o escreve**. É um dos canais
mortos do ciclo 13, e o item 3 do ciclo 18.

| proposta                                                      | como ela entra                                     |
| ------------------------------------------------------------- | -------------------------------------------------- |
| **R$ 23 bi/ano para desonerar a folha** (no lugar da CLT)     | `taxDelta` negativo com custo fiscal               |
| **Marco Brasileiro da IA** — redução tributária, data centers | `taxDelta` setorial                                |
| **terras raras como segurança nacional**                      | 📗 PEC + regra setorial                            |
| **reserva nacional de Bitcoin**                               | ⚠ ativo novo no balanço — não cabe em nenhum verbo |

---

## 3 · ⭐ A TABELA DE COMPRA — qual verbo abre quantas propostas

| verbo          | propostas que ele abre | custo   | precisa de                        |
| -------------- | ---------------------- | ------- | --------------------------------- |
| ✔ `band`       | **6**                  | zero    | —                                 |
| ▶ `spend`      | **7**                  | pequeno | uma ordem que cria programa       |
| ▶ `tax`        | **3**                  | pequeno | ligar `taxDelta`, que já é lido   |
| ▶ `power`      | **5**                  | médio   | degraus escritos em `POWER_STEPS` |
| ⛔ `condition` | **4**                  | médio   | verbo novo + entes                |
| ⛔ `body`      | **4**                  | médio   | agente com mandato fixo           |
| ⛔ `status`    | **5**                  | grande  | o mapa federativo inteiro         |

⭐ **A ordem que este documento recomenda sai sozinha da tabela:**

> **`spend` → `tax` → `condition` → `body` → `power` → `status`**

**`spend` e `tax` juntos entregam 10 das 33 e não abrem motor nenhum.** Eles pagam a estrada
para o `condition`, que é a LRG — e o `condition` é o que muda a natureza do jogo, porque é a
primeira lei que **continua valendo depois que você sai**.

---

## 4 · ⭐⭐ A "IA" QUE ELE QUER É O AVALIADOR, e não o gerador

⚠ **Este é o achado mais importante do documento, e ele inverte a pergunta.**

Um modelo de linguagem serve para **gerar** — escrever a lei, escrever a manchete. É a metade
cara, e é a metade que menos importa. **O que faz um mundo parecer vivo é a outra metade: ele
ter opinião sobre o que você acabou de inventar.**

📐 **Hoje o preço de uma lei sai de `threat`** — um número que alguém escreveu à mão no
catálogo, texto por texto. Isso não escala: uma lei que o jogador inventa **não tem `threat`**,
porque ninguém a previu.

⭐ **O avaliador troca o número escrito pelo número calculado:**

| quem              | o que ele já tem hoje                        | como ele lê a sua lei                    |
| ----------------- | -------------------------------------------- | ---------------------------------------- |
| **cada bancada**  | eixo econômico, venalidade, cadeiras         | ganha ou perde com o que a lei move      |
| **cada lobby**    | lê a MALHA, tem ponto de fervura             | a lei mexe na área dele, ou não          |
| **cada segmento** | aprovação por faixa de renda                 | a lei tira ou dá dinheiro para ele       |
| **cada pessoa**   | ambição, alcance, memória de favor e traição | a lei serve à ambição dela, ou atrapalha |

**As quatro peças existem e rodam.** Nenhuma delas foi escrita para avaliar lei — mas todas
sabem responder _"isto é bom para mim?"_ sobre um delta de indicador.

⛔ **E a consequência é exatamente o que ele pediu:** você escreve uma lei que **ninguém
previu**, e o mundo tem opinião sobre ela **sem que ninguém tenha escrito essa opinião**. O
preço não é autoral: ele é a soma de quem a lei machuca.

> **Isso é o que um modelo de linguagem FINGE, e uma função de utilidade FAZ — de graça,
> determinística, e o jogador consegue aprender.**

### 4.1 · O segundo pilar: o mundo tem que AGIR, não só reagir

📐 **100% dos textos deste jogo nascem do jogador.** É por isso que não há veto — não há o que
vetar. Uma oposição que só vota "não" não é personalidade; é um número.

⭐ **A ambição já sorteada é o motor disso, e ela está de graça na mesa:** 📐 das cinco ambições
do ELENCO — quer o Planalto, quer um ministério, quer o governo do estado, quer uma vaga no
tribunal, quer só se reeleger — **só a primeira faz alguma coisa**. As outras quatro são
geradas, aparecem na tela do Congresso e **não movem uma linha do motor**.

**Ligar as quatro é o item mais barato do projeto inteiro**, e é literalmente "personalidade":
mesma oferta sua, resposta diferente, porque a pessoa quer coisa diferente. É o item 10 do
ciclo 18 e o achado 16 do handoff.

### 4.2 · E a mídia sai da mesma máquina

Quem escolhe a manchete não precisa ser um modelo — precisa ser **uma regra que olha o que mais
se moveu no mês**. O texto sai de moldes, e a variedade vem da **combinação**, não da
criatividade: quem falou, sobre o quê, com que ângulo, e a favor de quem.

⚠ **E o veículo tem linha editorial**, que é a mesma função de utilidade das bancadas. O jornal
do mercado e o jornal da rua **noticiam o mesmo fato com sinais opostos** — e isso é uma
subtração, não um prompt.

---

## 5 · ⛔ O QUE ESTE DOCUMENTO RECUSA

| pedido                                    | por quê                                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| **texto livre digitado pelo jogador**     | o nome da lei pode ser livre — ele não faz nada. A estrutura é encaixe                    |
| **chamar modelo de linguagem em partida** | decisão dele, 04/09/2026: zero centavo. E o avaliador não precisa                         |
| **nomes reais no elenco**                 | ADR 0003. As 33 propostas entram como **forma jurídica**, nunca como pessoa               |
| **simular município a município**         | 5.570 entes é um segundo jogo. O que a LRG precisa é da faixa, não de cada um             |
| **reserva de Bitcoin**                    | ⚠ não é recusa, é ausência: ela pede ativo no balanço, e nenhum dos sete verbos a alcança |

---

## 6 · O QUE ESTE DOCUMENTO DECIDE, e o que ele deixa para ele

**Decidido pela medição:**

- a gramática de norma **não precisa nascer** — ela existe, com dez encaixes e uma prova;
- o buraco é **o verbo**, e são seis verbos novos, não infinitos;
- **`spend` e `tax` entregam 10 das 33 propostas sem abrir motor**, e pagam a estrada;
- a "IA" é **o avaliador**, e as quatro peças dele já rodam.

**Fica para ele:**

- ⚠ **a ordem dos seis verbos.** A tabela da seção 3 recomenda; ela não decide;
- ⚠ **se o mapa federativo entra.** É o que trava `condition` e `status` — nove das 33 —, e é o
  item mais caro do projeto;
- ⚠ **e o que acontece com o [ciclo 19](../cycles/19-a-voz.md)**, que foi escrito inteiro em
  cima de chave de API. Ele não sobrevive como está.

---

## Fontes

📰 Apuradas em 04/09/2026:

- [Gazeta do Povo — o plano de governo](https://www.gazetadopovo.com.br/eleicoes/2026/como-renan-santos-pretende-restaurar-o-brasil-plano-de-governo-candidato-missao/)
- [Gazeta do Povo — a parte econômica](https://www.gazetadopovo.com.br/eleicoes/2026/plano-de-governo-renan-santos-missao/)
- [Itatiaia — a Lei de Responsabilidade Gerencial](https://www.itatiaia.com.br/politica/eleicoes/reforma-politica-de-renan-santos-preve-cassacao-de-mandatos-e-fiscalizacao-de-prefeitos/)
- [Ponta Negra News — o Comissariado Federal de Gestão Pública](https://pontanegranews.com.br/2026/09/01/renan-santos-propoe-medidas-contra-corrupcao/)
- [Congresso em Foco — desfavelização, superpresídios, cotas](https://www.congressoemfoco.com.br/noticia/121275/plano-de-renan-tem-desfavelizacao--superpresidios-e-fim-de-cotas)
- [Metrópoles — o resumo do plano](https://www.metropoles.com/brasil/superpresidio-bolsa-familia-e-mais-o-que-diz-o-plano-de-renan-santos)
- [A Pública — a análise constitucional da parte de segurança](https://apublica.org/2026/08/renan-santos-propostas-para-seguranca-vao-contra-constituicao/)
- [CNN Brasil](https://www.cnnbrasil.com.br/eleicoes/renan-santos-propoe-foco-em-seguranca-e-reformas-em-plano-de-governo/)
- [Band — as propostas de educação](https://www.band.com.br/politica/eleicoes/2026/renan-santos-ataca-ensino-no-brasil-e-apresenta-propostas-para-a-educao-202608232043)
- [renansantospropostas.com.br](https://renansantospropostas.com.br/)
