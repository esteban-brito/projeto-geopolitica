# Ciclo 8 — o mapa e o rastro · ⚠ PROPOSTA, NÃO COMEÇADA

> Escrito em 16/08/2026 a partir do **sexto dossiê externo** ("O Mapa de Nolan e a
> Fisiologia Brasileira") e da verificação dele contra o código.
>
> ⚠ **NADA AQUI FOI IMPLEMENTADO, e ele vem DEPOIS do
> [ciclo 9](09-a-carta-pede-resposta.md)**, que é o acordado.
>
> ⚠ **A primeira versão deste documento mandava a série pegar carona no schema 15 do
> `state.mail`. Isso foi REVISTO** — ver _A migração_. Se você leu essa instrução em
> algum lugar, ela está velha.

## ⚠ O erro de fato que atravessa o dossiê inteiro

> _"Transformar o Mapa de Nolan de um **cosmético estático** em um motor de física
> política."_

**Não existe mapa de Nolan no jogo.** Verificado: nada em `src/ui/` desenha o plano.
Os dois únicos consumidores de `economic` e `liberty` na tela são

- **`cabinet.mjs`**, que escreve _"governa mais perto do Centrão"_ em prosa;
- **`hemicycle.mjs`**, que usa o eixo econômico para **sentar as 513 cadeiras da
  esquerda para a direita**, como um plenário real se organiza.

Ele não está refatorando um cosmético: **está criticando um componente que nunca foi
construído.** Isso muda a natureza da seção 3 do dossiê — não é "abandone os
quadrantes coloridos", é **"construa um gráfico do zero"**, que é decisão diferente e
bem mais cara.

> É o quinto dossiê seguido que descreve o Planalto que ele imagina. Os quatro
> primeiros descreviam uma captura velha; este descreve uma tela que não existe.

## O que ele propõe e já roda — e roda mais fino

**A. "Atrito cartesiano: distância = preço."** Já é o motor. `whipCount` resolve por
distância euclidiana no plano desde o ciclo 1, e o relator escolhe a emenda com **a
mesma** distância. Não é proposta: é descrição.

**B. "Multiplicador massivo de 3x se a lei contraria o bloco."** ⚠ A versão
implementada é **mais fina que a proposta**, e o catálogo diz por quê:

> _"Ela é uma por eixo, e não uma só. Um escalar único não consegue expressar o
> comportamento mais característico do Congresso brasileiro: **o preço depende do
> assunto**. A bancada de fé vende barato em pauta econômica e não vende a preço nenhum
> em pauta moral; a bancada liberal faz o inverso."_

Um multiplicador plano é exatamente o escalar único que foi recusado. **E tem
precedente:** o dossiê de origem trazia a fórmula invertida — resistência
_multiplicada_ pela venalidade deixava a direita liberal (0,10) com um décimo da
resistência, comprada de graça. Foi pego e corrigido. **É a segunda vez que um dossiê
externo propõe a versão crua de algo que já foi refinado.**

## ⚠ Os eixos: a troca proposta já foi recusada, com a razão escrita

Ele quer renomear o eixo Y para **"Costumes & Ordem Pública"**. Está em `parties.mjs`,
e a prosa diz que a distinção **já se pagou duas vezes**:

> _"O SEGUNDO EIXO É LIBERDADE, E NÃO 'COSTUMES'. Chamado de costumes, ele só acomoda
> pauta moral, e então não existe onde pôr um governo economicamente liberal e
> politicamente autoritário — **censura à imprensa e proibição de droga cairiam em
> eixos diferentes**. Chamado de liberdade pessoal, os dois casos caem no MESMO lugar:
> restringir o que a pessoa pode fazer. A bancada de fé e o governo autoritário
> discordam do MOTIVO e concordam da POSIÇÃO — e posição é a única coisa que a votação
> precisa saber."_

⚠ **O diagnóstico dele está certo e a conclusão, errada.** O Nolan clássico de fato
não representa o Brasil — e **a resposta do projeto foi outra, e é melhor**: não
renomear o eixo, e sim **desdobrar a venalidade por eixo**. O que representa o Centrão
e as bancadas temáticas não é a posição: é **o preço por assunto**.

## ⚠ A instrução mais perigosa do dossiê

> _"1. State (Schema): adicione as propriedades de coordenadas (x, y) aos atores e
> blocos no estado do jogo."_

**É o erro que o projeto já cometeu e já consertou.** `state.bands` virou `state.norms`
por esta razão exata, e ela está escrita:

> _"Valor derivado guardado é um segundo lugar para a mesma verdade divergir — e este
> divergiria no mês em que um gatilho ligasse sozinho."_

A posição do governo **é derivada**: `stanceOf` a calcula do que o presidente moveu,
comparando o vigente contra o orçamento herdado. Guardá-la abriria a divergência no
primeiro mês em que uma norma entrasse em vigor sozinha. A posição dos blocos já mora
no **catálogo**, que é onde dado fixo mora.

## O Centrão gelatinoso — bonito, e não é motor novo

> _"Eles são alugados, não comprados."_

Frase ótima, e o modelo **já faz isso**: verba compra voto, a venalidade define quão
barato, a memória decai — aluguel que vence. O que não existe é **mostrar isso como
movimento**.

⚠ **E se o ponto se mover, ele tem de ser derivado de verba + memória, nunca
guardado** — mesma regra acima. É **visualização de uma mecânica que existe**, e uma
boa. Tratá-la como motor novo faria o projeto construir duas vezes a mesma coisa, que
é o defeito recorrente número um daqui.

## A Janela de Overton — travada por fato, e não por opinião

Duas dependências que não existem:

1. **a SONDA não tem coordenadas.** Ela segmenta por **renda** — baixa 42%, média 38%,
   alta 20% —, com a atenção dividida entre carestia, emprego e economia. **Não há nada
   nela capaz de desenhar um polígono no plano ideológico.** Para desenhar, os segmentos
   precisariam de posição, e isso é modelagem nova;
2. **o `Risco Institucional` não existe.** Impeachment, renúncia negociada e ruptura
   são a parte do ciclo 4 que diz _"o presidente pode cair"_, e ela não foi feita.

A ideia é boa e fica registrada. **Hoje ela só é implementável inventando as duas**, e
número inventado é o que este projeto recusa antes de qualquer outra coisa.

## ⭐ O RASTRO — a única ideia genuinamente nova, e ela é ótima

> _"Em vez de apenas o ponto atual, o mapa traça uma **linha de rastro** mostrando as
> posições passadas do seu governo, contando a história visual de como você **vendeu
> sua alma** para passar leis ao longo dos anos."_

É a coisa mais Paradox do documento, e ela salva a proposta 1 dele em outra forma —
com uma distinção que decide o desenho inteiro:

> **Guardar a posição ATUAL é duplicação. Guardar o RASTRO é arquivo.**

São naturezas diferentes. A posição de hoje se recalcula de `stanceOf` a qualquer
momento, então guardá-la abre uma segunda verdade. O rastro é **fato histórico**: onde
o governo esteve em março de 2028 **não se recalcula**, porque os níveis daquele mês
não existem mais. Arquivo é legítimo, e o projeto já tem um — `state.norms` guarda a
norma velha justamente para que revogar devolva a lei anterior.

### ⚠ Três coisas que a implementação tem de respeitar

1. **quem escreve o ponto é `stanceOf`, e mais ninguém.** Se o reducer recalcular a
   posição por fora na hora de dobrar o mês, são dois lugares montando a mesma
   pergunta — o defeito que este projeto encontrou **quatro vezes**, o último custando
   27,2% dos vereditos anunciados;
2. **o rastro tem buracos, e buraco é informação.** `stanceOf` devolve `null` quando o
   presidente não moveu nada — _"ainda governa o orçamento que herdou"_. O rastro tem
   de **poder ser interrompido**, e não preenchido com zero: zero no plano é um lugar
   (máxima intervenção, máximo controle), e um governo parado não está lá. É a regra de
   ausência declarada aplicada a uma série;
3. **o marco é o bloco mais próximo**, como já é na prosa do Gabinete. O plano não tem
   regiões com nome, e inventar rótulo de quadrante seria número inventado com outra
   roupa.

## ⚠ A migração — e aqui eu mudei de ideia, com a razão registrada

`state.series` guarda **seis** séries — PIB, inflação, juro, desemprego, dívida,
primário — e **nenhuma é posição**. O rastro precisa de uma sétima, e isso é **bump de
esquema, reducer e save**.

**A primeira versão deste documento mandava a série pegar carona no schema 15 do
`state.mail`**, com um argumento bom: o save **recusa** versão diferente em vez de
converter, então cada bump custa uma partida ao responsável, e duas migrações em duas
semanas é retrabalho garantido.

**Ele perde para uma regra mais antiga e mais forte:**

> **Este projeto não guarda o que ninguém consome.** Série sem leitor é a mesma família
> do módulo que ninguém chama — o andaime que já foi arrancado uma vez, com a prosa
> explicando por quê.

⚠ **E a consequência desfaz a divisão deste ciclo:** as Partes A e B só estavam
separadas **para a carona existir**. Sem carona, separá-las não tem propósito — a série
nasce no mesmo ciclo que a desenha. **A e B viram uma parte só.**

**O que continua indo de carona no schema 15 é outra coisa:** a série dos **oito índices
de área**, que tem consumidor no primeiro dia — hoje Fazenda e Previdência **calam** a
tendência por não ter passado guardado — e que **mata o achado 15**. Ela está no
[ciclo 9](09-a-carta-pede-resposta.md), e não aqui.

## Um detalhe que colide com a regra escrita no dia anterior

> _"Tipografia analítica: monoespaçada nos rótulos dos eixos, como telemetria —
> `[Y_AXIS: ORTODOXIA_0.8]`."_

**Mono é carimbo; sans é medição.** Uma coordenada é medição, e vai em
`--font-display`. Vestir medição de carimbo inverteria a regra no dia seguinte ao dia
em que ela nasceu. E `[Y_AXIS: ...]` é voz de código em inglês, não a voz do jogo.

## O plano, em duas partes

### Parte A — a série E o mapa, na mesma obra · **um schema próprio, depois do 15**

A série e o desenho **nascem juntos**, pela razão da seção anterior: série sem leitor é
andaime. São, na ordem:

1. uma sétima entrada em `state.series`, escrita por `stanceOf` no fecho do mês, **com
   buraco permitido**;
2. o mapa que a lê, em SVG leve ou grade CSS com `position: absolute` em porcentagem.
   Sem `chart.js`, sem nada externo — o que o dossiê pede aqui já é a doutrina do
   projeto.

- o governo é um ponto, e o **rastro** é a série;
- os quatro blocos são pontos fixos, lidos do catálogo;
- ⚠ **sem quadrante colorido**: a paleta é semântica (verde é alta, vermelho é crise), e
  pintar quadrantes diria que um canto do plano é bom e outro é perigo;
- ⚠ **e ele não pode virar controle.** _"A posição ideológica é sombra, e nunca
  controle"_ é decisão do ciclo 2. Um mapa que se pode arrastar é o cursor de ideologia
  que o projeto recusou — o jogador mexe em leitos e alíquotas, e a posição é o que
  aparece **por causa** disso.

**Onde ele mora:** a tela **O Estado** é a candidata natural, que é onde as alavancas
de regime já vivem.

### Parte B — a Janela de Overton · **BLOQUEADA, registrada, não começar**

> ⚠ **O BLOQUEIO GANHOU DATA em 16/08.** As duas dependências que faltavam — dar
> posição ideológica à opinião organizada **e** o risco institucional existir — são
> exatamente o que o [ciclo 10](10-quem-derruba-um-presidente.md) constrói. Ela deixa
> de ser "boa ideia sem chão" e passa a ser "espera o ciclo 10".

Depende de dar posição ideológica aos segmentos da SONDA **e** de o risco institucional
existir. As duas são modelagem nova. Fica escrita porque a ideia é boa e porque, no dia
em que a queda do presidente for feita, ela é o desenho certo para mostrar o risco.

## Resumo de custo

| parte | o quê                           | toca em                               | custo | quando                                           |
| ----- | ------------------------------- | ------------------------------------- | ----- | ------------------------------------------------ |
| **A** | a série da posição **e** o mapa | `state.mjs`, reducer, save, view, CSS | médio | depois do [ciclo 9](09-a-carta-pede-resposta.md) |
| **B** | a Janela de Overton             | SONDA + risco institucional           | alto  | **bloqueada**                                    |

⚠ **Este ciclo custa um bump de esquema só para ele**, e isso é consequência aceita da
decisão acima. Quem começá-lo deve saber que ele apaga os saves da versão anterior,
como toda migração deste projeto.

## O que este ciclo NÃO faz

- **não renomeia os eixos** — a razão está no catálogo e já se pagou duas vezes;
- **não guarda a posição atual no estado** — é o erro que virou `state.norms`;
- **não cria multiplicador de custo por distância** — já existe, e por eixo;
- **não move o ponto do Centrão como motor** — o movimento é leitura de verba e
  memória, e ele é derivado ou não é.
