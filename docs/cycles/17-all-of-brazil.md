# CICLO 17 — O BRASIL INTEIRO

> **Estado:** ▶ direção declarada em 31/08/2026, sem passos acordados. Este arquivo é
> **registro**, e não plano: nenhuma linha dele foi orçada, medida ou posta em ordem de
> execução. O plano em vigor continua sendo o [ciclo 13](13-the-glorious.md), em 26 de 49.
>
> **Palavras dele, em três mensagens:**
>
> - _"nós vamos criar o brasil todo com dados reais, tudo mesmo, estados, capitais, empresas, e
>   mais muita coisa além disso. Nosso jogo vai ser muito mais complexo, livre, e completo do
>   que é hoje"_;
> - _"terão empresas reais com nome, na verdade serão empresas reais com nomes alterados"_;
> - _"quero tudo o que um presidente faz na vida real, dentro do meu jogo"_.

---

## 1 · A TESE

O jogo de hoje modela **a União como um painel**: oito áreas, um Congresso, quatro grupos de
pressão, uma rua repartida por renda. O país aparece como **um número por área** — a capacidade
da Indústria, o atendimento da Saúde — e não tem nem geografia nem empresa dentro dele.

A direção é o contrário: **o Brasil com o Brasil dentro**, e um presidente com **os poderes que
o cargo tem de verdade** — não uma lista curada de botões seguros.

---

## 2 · ⚖ A REGRA DO NOME — e ela já tem precedente no jogo

> **A empresa é real; o nome é alterado.** Porte, setor, papel no país e ordem de grandeza saem
> de fonte pública, citada e datada. O nome é o de sempre **com uma letra trocada**.

⚠ **E ISSO NÃO É NOVIDADE NEM EXCEÇÃO: é o que o jogo já faz com os partidos.** O catálogo
traz `Partido dos Trabalhadores Unidos`, `Movimento Democrático Nacional`, `União Progressista
Brasileira`, `Partido Liberal Brasileiro` — nove bancadas que **qualquer brasileiro reconhece
em um segundo** e nenhuma que exista com aquele nome. O peso em cadeiras, o eixo econômico e a
venalidade de cada uma são modelagem sobre o real; a etiqueta é alterada.

**A regra passa a valer para empresa, e o [ADR 0003](../adr/0003-real-world-invented-people.md)
continua de pé sem uma vírgula de mudança:**

| o quê                                      | como entra                                              |
| ------------------------------------------ | ------------------------------------------------------- |
| **o dado** — receita, folha, dividendo     | **real**, com fonte e ano-base                          |
| **o nome da empresa**                      | **alterado**, e reconhecível — a regra dos partidos     |
| **o nome do estado e da capital**          | **real**. Minas Gerais é Minas Gerais                   |
| **a pessoa** — presidente, governador, CEO | **fictícia**, sempre. É o ADR 0003, e ele não se reabre |

⚠ **A distinção que sustenta isso:** estado e capital são **fatos geográficos** — alterá-los
seria inventar um país. Empresa e partido são **agentes** que o jogo faz agir, opinar, quebrar e
ser vendidos; e um agente que age com o nome de quem existe é uma afirmação sobre alguém.

---

## 3 · O QUE UM PRESIDENTE FAZ — o inventário inteiro, contra o que o jogo tem

> A pergunta dele: _"sobre criar MP, decreto, leis, programas, reformas, e todo esse tipo de
> coisas que um presidente do Brasil realmente faz, realismo, isso tem escrito?"_
>
> **Tem, e este é o mapa completo.** ✔ roda hoje · ▶ escrito e planejado, com item · ⛔ não
> existe em lugar nenhum.

### 3.1 · A caneta — o que ele faz sozinho

| poder                                                    | estado | onde                                                                                    |
| -------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| **dotação orçamentária** — quanto vai para cada programa | ✔      | 38 programas com piso, teto e guarda jurídica. O rito sai do conteúdo                   |
| **contingenciamento** — segurar empenho no ano           | ✔ / ▶  | o motor já fecha o teto sozinho; **escolher onde cortar** é o **A3**                    |
| **decreto tributário** — IOF, IPI, II, IE                | ▶      | **A5.** A exceção constitucional à legalidade tributária. `taxDelta` é canal morto hoje |
| **medida provisória** — força de lei na hora, e caduca   | ▶      | **A4.** ESTRATO já tem vigência e prova de que revogar a nova faz a velha voltar        |
| **nomear e demitir** — ~22 mil cargos                    | ▶      | **A6.** Ministro, estatal, **Banco Central** e **PGR**, cada um com canal próprio       |
| **veto total e parcial**                                 | ▶      | **A7.** Hoje 100% dos textos nascem do jogador — o Congresso não propõe nada            |
| **indulto e comutação** (art. 84 XII)                    | ⛔     | não existe                                                                              |
| **estado de defesa e estado de sítio** (art. 136–141)    | ⛔     | não existe                                                                              |
| **relações exteriores, tratados**                        | ⛔     | recusado por ora — _"Fase 1 só o Brasil"_ (ciclo 13)                                    |
| **comandante supremo das Forças Armadas**                | ⛔     | existe como grupo de pressão (`militares e polícia`), não como instrumento              |

### 3.2 · O Congresso — o que ele negocia

| poder                                   | estado | onde                                                                        |
| --------------------------------------- | ------ | --------------------------------------------------------------------------- |
| **lei ordinária e complementar**        | ✔      | ECLUSA: gaveta → relatoria → plenário, um estágio por mês                   |
| **emenda constitucional**               | ✔      | 308 votos, e o rito sai da guarda da faixa                                  |
| **emenda parlamentar como moeda**       | ✔      | promessa, rateio, calote e memória — 25 pontos de lealdade por traição      |
| **o relator muda seu texto** (o jabuti) | ✔      | `reports` escreve a exceção, e a carta diz qual alavanca ele salvou         |
| **o Senado**                            | ⛔     | o jogo tem só a Câmara. Declarado, não esquecido — briefing 01, pergunta 26 |
| **derrubada de veto**                   | ⛔     | depende do A7                                                               |
| **impeachment**                         | ✔      | três rupturas, quórum de 342, e o cerco encarece a cadeira                  |

### 3.3 · O Estado como propriedade — e esta parte **já roda**

| poder                                  | estado | o que o motor faz                                                          |
| -------------------------------------- | ------ | -------------------------------------------------------------------------- |
| **privatizar e estatizar**             | ✔      | 5 setores, cada um com alcance, dividendo, folha e valor de venda          |
| **a armadilha da privatização**        | ✔      | ninguém a escreveu: é aritmética do LASTRO                                 |
| **subsídio e renúncia de receita**     | ✔ (1)  | a desoneração setorial abate a receita, e não o caixa do mês               |
| **concentrar poder no Executivo**      | ✔      | alavanca contínua: a 60 emenda vira lei, a 85 lei vira caneta. Guarda: PEC |
| **criar empresa, construir, encampar** | ⛔     | **não existe**, e é o coração deste ciclo                                  |

**A medição que mostra que a mecânica é real** (catálogo de hoje, posição de abertura):

| setor                | vender tudo rende | dividendo perdido/ano | folha aliviada/ano | **saldo anual** |
| -------------------- | ----------------- | --------------------- | ------------------ | --------------- |
| Petróleo e gás       | **R$ 326,7 bi**   | −21,1                 | +8,5               | **−12,7**       |
| Bancos públicos      | 235,2             | −15,1                 | +10,1              | −5,0            |
| Energia elétrica     | 71,4              | −2,9                  | +1,9               | −1,0            |
| Correios e logística | 34,0              | −0,6                  | +4,2               | **+3,6**        |
| Saneamento e água    | 59,4              | −1,2                  | +3,0               | +1,8            |

⭐ **A mesma alavanca com sinais opostos, e nenhum script:** vender a estatal do petróleo põe
R$ 326,7 bi no caixa e apaga R$ 12,7 bi de resultado **para sempre** — 26 anos para se pagar,
num mandato de 4. Os Correios são o inverso: dividendo quase zero e folha alta, então
privatizar **melhora** a conta. **É este o modelo que o ciclo 17 herda e amplia.**

### 3.4 · O que o país devolve

| canal                        | estado | onde                                                                |
| ---------------------------- | ------ | ------------------------------------------------------------------- |
| **a economia responde**      | ✔      | CORRENTE: hiato, Phillips, Taylor, Okun, e o juro que vira dívida   |
| **a rua responde**           | ✔      | SONDA, por faixa de renda — e ela **só precifica voto** (achado 20) |
| **a máquina entrega ou não** | ✔      | MALHA: decaimento, rendimento da verba, atraso por área             |
| **a corrente é visível**     | ✔      | DELTA, desde 30/08                                                  |
| **os governadores**          | ⛔     | **A10** — o pacto federativo. É a ponte natural para os 27 estados  |
| **a imprensa e o escândalo** | ⛔     | **A9**                                                              |
| **o STF derruba**            | ⛔     | **A8**                                                              |
| **greve e paralisação**      | ⛔     | buraco medido (achado 20): a rua não toca no país físico            |

---

## 4 · O QUE ESTE CICLO ACRESCENTA — as quatro frentes

> Nenhuma delas está acordada. Elas existem aqui para **não se perderem** e para que a
> primeira sessão que as pegar saiba o que já foi decidido.

### 4.1 · As empresas

Cada estatal deixa de ser um **setor agregado** e passa a ser uma **empresa com nome alterado**,
com receita, folha, lucro, dividendo pago à União, empregados e valor de mercado — todos de
fonte pública. O briefing [`research/01`](../research/01-brazil-2026-briefing.md), bloco 7,
**já pergunta exatamente isso** (perguntas 35 a 40), e a resposta ainda não voltou.

⚠ **E a pergunta jurídica é a que decide a mecânica:** _o que é preciso, juridicamente, para
privatizar cada tipo?_ Autorização legislativa específica, lei geral, ou decisão do Executivo —
é ela que diz se vender custa **caneta, lei ou emenda**, e o jogo já sabe cobrar os três.

### 4.2 · Os estados e as capitais

Vinte e sete unidades com nome real, capital real, população e PIB de fonte. A ponte já existe
no plano: **A10, o pacto federativo** — transferências, dívida estadual, e o governador que
apoia ou hostiliza.

⚠ **E aqui mora o risco maior deste ciclo:** um mapa colorido por estado exige **dado por
estado**. Sem a tabela, o mapa não entra — um Brasil pintado com número chutado é a violação
mais cara que este projeto pode cometer, **porque ela é bonita e ninguém a percebe**.

### 4.3 · Criar, construir, encampar

O que hoje não existe em forma nenhuma: fundar uma estatal, construir uma refinaria, encampar
uma concessão. É a única frente que **abre motor do zero** — as outras três ampliam o que roda.

### 4.4 · Os poderes que faltam

Do inventário da seção 3, em ordem de fidelidade perdida: **MP (A4)**, **decreto tributário
(A5)**, **nomear e demitir (A6)**, **veto (A7)**. Os quatro já estão escritos no ciclo 13, com
tamanho e dependência — **este ciclo não os reescreve, ele os cobra.**

---

## 5 · ⚠ AS TRÊS COISAS QUE VÃO DOER, e é melhor sabê-las antes

### 5.1 · O save quebra, e não é uma vez

`deserialize` **recusa versão diferente em vez de converter**, e a razão está escrita e é boa:
converter preenchendo campo faltante produz **um país plausível e errado**. Hoje o save está na
**versão 20**. Um Brasil com 27 estados e um cadastro de empresas não cabe em um bump.

> **A saída já está escrita, e é a opção 2 da Restrição 3 do [ciclo 13](13-the-glorious.md):
> o save vira `semente + ordens` e o mandato inteiro se refaz.** Medido: 48 meses custam
> **10,3ms**. Um save de repetição **tolera mudança de estado por construção** — ele só quebra
> se as ORDENS mudarem de forma. **A decisão é dele, e ficou urgente.**

### 5.2 · A calibragem inteira se refaz — e ele já sabia

O achado 53 do handoff é **decisão dele, de 21/08/2026**: _"o jogo ainda terá uma boa
reformulação, nós vamos adicionar empresas reais, coisas reais, estatização, privatização,
criação, construção"_ — e por causa dela uma recalibragem da MALHA foi **suspensa**, porque
cada número girado hoje seria girado duas vezes.

**O que sobrevive à reformulação, e é onde vale investir enquanto ela não vem:** o Congresso
inteiro, a tramitação, e a Caixa de Entrada.

### 5.3 · O aviso de forma, e ele vem de fora

A crítica registrada contra o último dossiê externo vale palavra por palavra para este ciclo:

> **as ideias ACRESCENTAM; nenhuma remove, e nenhuma termina o que está pela metade.**

Empresa, estado e construção empilhados sobre um presidente que **ainda não tem MP, decreto,
veto nem nomeação** deixariam o jogo mais fundo no arquivo e menos jogável na tela. **A ordem
importa mais que a lista.**

---

## 6 · ⛔ O QUE ESTE ARQUIVO NÃO É

- **não é um plano** — não há passo, ordem, orçamento de tela nem critério de aceitação;
- **não abre trabalho** — o plano em vigor é o ciclo 13, em 26 de 49;
- **não reabre o ADR 0003** — pessoa é fictícia, e ponto.
