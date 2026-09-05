# CICLO 24 — O PRESIDENTE

> **Escrito em 04/09/2026, a pedido dele:** _"criar o seu personagem, da forma que você quiser,
> criar o seu presidente, escolher um partido, e tudo mais… eu quero REALISMO e fidelidade ao
> Brasil atual e real"_.
>
> ⭐ **A tese, e ela sai de um fato jurídico:** a criação de personagem deste jogo **não é uma
> ficha, é a eleição que você acabou de vencer.** A partida abre em janeiro de 2027 — o
> presidente foi eleito em outubro de 2026, por um partido, numa chapa, com uma coligação. **Hoje
> nada disso existe, e o jogador chega ao mês 1 sem dever nada a ninguém.**
>
> **Ele executa o B1 e o B2 do [ciclo 23](23-o-corpo-politico.md)** e acrescenta os dois itens
> que nenhum plano tinha.

---

## 1 · 📐 O QUE JÁ EXISTE, medido

| peça                  | onde                                 | o que ela muda no jogo             |
| --------------------- | ------------------------------------ | ---------------------------------- |
| o nome e o tratamento | `state.president`, `state.mjs`       | **nada** — é o rótulo da interface |
| as três promessas     | `state.platform`, `platform.mjs`     | a rua cobra a traição (`betrayal`) |
| as nove bancadas      | `src/data/parties.mjs`, 513 cadeiras | a votação inteira                  |
| as cinco ambições     | `src/data/cast.mjs`                  | o preço de cada pessoa (04/09)     |

📐 **E o buraco, medido:** `president` é **o único campo do save que o jogador digita**, e ele é
uma string. **Nenhuma bancada é a sua**, não há vice, não há coligação, e a única coisa que o
mandato herda da eleição é o orçamento do antecessor.

⛔ **A consequência é a mesma do achado 59, vista de outro ângulo:** o jogador começa com zero
cadeiras próprias num jogo em que **comprar o Congresso inteiro move 13 de 513**. Ele não tem
base, e não tem como comprar uma.

---

## 2 · 📗 O BRASIL REAL, apurado na web em 04/09/2026

⚠ **Cada linha abaixo tem fonte e data. Nenhuma é dedução.**

### 2.1 · Não existe presidente sem partido

📗 **A filiação partidária é condição de elegibilidade** — CF art. 14, §3º, V —, e o **STF
afastou a candidatura avulsa**: só disputa quem é filiado e foi escolhido em convenção.

⭐ **O que isso decide no jogo:** "sem partido" **não é uma opção de criação.** O jogador escolhe
uma das nove bancadas, e a escolha é obrigatória. O cenário duro não é ficar sem partido — é
escolher um partido pequeno.

### 2.2 · O vice vem na mesma chapa, e ele assume mais do que se imagina

📗 CF art. 77, §1º: o vice é eleito na mesma chapa, e a chapa conjunta existe **desde 1964,
justamente para evitar um vice da oposição**.

📗 **Oito dos 39 presidentes da República foram vices que assumiram.** Desde a redemocratização,
**três**: Sarney (1985), Itamar (1992) e Temer (2016) — e os dois últimos entraram por
impeachment, que é o mecanismo que este jogo já tem.

⭐ **O que isso decide no jogo:** o impeachment do jogo derruba e **não diz quem ganha**. Com
vice, o cerco passa a ter destinatário — e a chance de ele te trair é histórica, não invenção.

### 2.3 · A federação partidária é uma coligação que não se desfaz de graça

📗 Regra vigente para 2026: a federação tem **duração mínima de quatro anos**, precisa estar
registrada no TSE **seis meses antes do pleito**, e vale para as eleições majoritária e
proporcional. **Sair antes do prazo** proíbe o partido de entrar em nova federação, **de coligar
nas duas eleições seguintes** e **corta o Fundo Partidário**.

⭐⭐ **Isto é "tudo tem preço, nada tem muro" escrito na lei brasileira**, e é o melhor achado
desta pesquisa: a federação é exatamente a mecânica que o jogo precisa — um compromisso que dura
o mandato inteiro, que se pode romper, e cujo rompimento tem preço tabelado.

### 2.4 · A cláusula de barreira põe a sobrevivência do seu partido em jogo

📗 EC 97/2017. Para 2026 o partido precisa de **2,5% dos votos válidos para a Câmara,
distribuídos em pelo menos 1/3 das UFs com no mínimo 1,5% em cada**, **ou** eleger **13 deputados
federais** em pelo menos 1/3 das UFs. Quem não alcança perde o Fundo Partidário e a propaganda.

📗 **Ao menos 11 partidos estão em risco em 2026.**

⭐ **O que isso decide no jogo:** o partido do presidente não é só uma base — **é uma
organização que pode morrer no ano 4.** Isso dá ao B5 (a reeleição) um segundo relógio.

### 2.5 · O Congresso real é pulverizado, e governa-se por BLOCO

📗 **22 partidos** com representação no Congresso que chega a 2026. E o maior agrupamento da
Câmara é um **bloco de 271 deputados**, formado por oito partidos e uma federação.

📐 **O jogo tem nove bancadas e nenhum bloco.** A maior é o PLB, com 145 de 513 (28%) — e a real,
somada em bloco, passa de **53%**.

### 2.6 · A pasta é moeda, e o ano 4 a esvazia

📗 A Esplanada tem **39 ministérios** em 2026, e **14 deles trocaram de comando** para os
ocupantes disputarem a eleição.

📗 E **seis ministérios concentraram 75% do orçamento da União em 2025** — o que confirma o
desenho de oito áreas com pesos muito desiguais que o jogo já tem.

⭐ **O que isso decide no jogo:** a ambição `cabinet` (que ganhou preço em 04/09) tem lastro
real, e o ano 4 tem um êxodo documentado. **Ministro vira candidato.**

---

## 3 · ⭐ ITEM 1 — O PARTIDO (executa o B2 do ciclo 23)

**O jogador escolhe uma das nove bancadas antes do mês 1.** O que muda:

| regra                         | o quê                                                               |
| ----------------------------- | ------------------------------------------------------------------- |
| a lealdade nasce alta         | ela já nasce em 70 para todos; a sua nasce acima                    |
| **a venalidade não funciona** | o seu partido não quer dinheiro, quer participação                  |
| **trair custa o dobro**       | a memória do `ELENCO` já tem `betrayalWeight`; ele dobra para a sua |
| e ele cobra primeiro          | a chantagem do lobby tem um irmão: a cobrança de dentro             |

⭐ **E o jogador passa a ter cadeiras que não precisam ser compradas.** Com o PLB são 145 de 513;
com o PNR, 6.

⚠ **A JUSTIFICATIVA ORIGINAL DESTE ITEM CAIU EM 05/09/2026, e o item continua de pé.** Ela dizia
que o partido era _"a resposta ao achado 59 sem mexer em ECLUSA"_; a remedição mostrou que a
emenda paga (7 a 71 cadeiras) e que o gargalo é outro — o achado 60. 📐 **E o que o partido vale
foi medido em 48 meses, em três sementes: o PLB entrega +5 aprovações de 43 e o PSU entrega
−0,7.** O tamanho não explica; a posição explica. **Escolher partido é escolher com quem você
concorda pelo mandato inteiro** — e isso é um desenho melhor do que o que estava escrito aqui.

⚖ **Custo:** pequeno no motor (um campo no estado, um caminho em `whipCount`), **médio no
conjunto** — é ele que obriga o `SCHEMA_VERSION` a subir.

---

## 4 · ⭐⭐ ITEM 2 — A CHAPA E A COLIGAÇÃO (executa o B1, e vai além dele)

**Duas escolhas na mesma tela, e as duas são dívida:**

1. **o vice**, de outro bloco — CF art. 77, §1º. Ele tem ambição própria (o `ELENCO` já sorteia
   cinco, e `succession` já desconta verba). **Quanto pior você está, mais barato fica para ele.**
   O impeachment passa a ter destinatário;
2. **a coligação que te elegeu** — de duas a quatro bancadas que entram no governo **já
   credoras**. `state.memory` já guarda saldo por pessoa: elas nascem com saldo negativo do seu
   lado, e é isso que faz o mês 1 ter dívida.

⭐ **E aqui entra a federação (§2.3), que é a versão cara da coligação:** ela dura o mandato
inteiro, e romper tem preço tabelado. **Coligação é barata e frágil; federação é cara e
estável.** Escolher entre as duas na criação é a primeira decisão política do jogo.

⚖ **Custo:** médio. O vice é uma pessoa a mais no `ELENCO` com papel novo; a coligação é um saldo
inicial em `memory`, que já existe.

---

## 5 · ITEM 3 — A ORIGEM, e ela move os eixos

**De onde você veio antes do Planalto.** Nenhum plano tinha isto, e é o que faz duas partidas com
o mesmo partido serem diferentes.

| origem           | o que ela move                                               |
| ---------------- | ------------------------------------------------------------ |
| sindicalista     | a rua de baixa renda começa acima; o mercado, abaixo         |
| ex-governador    | ⭐ os repasses a entes valem mais, e a ambição `state` te lê |
| juiz ou promotor | o eixo de liberdades desloca, e o `court` te conhece         |
| militar          | Defesa e Segurança abrem acima; o eixo de liberdades cai     |
| empresário       | o mercado abre acima; a rua de baixa renda, abaixo           |

⚠ **E ela não é um bônus:** cada origem sobe uma coisa e desce outra, medidas na mesma escala.
**Nenhuma origem é a melhor** — é a regra do projeto aplicada à ficha.

⚖ **Custo:** pequeno. É um deslocamento de abertura em `mood` e nos eixos, e o catálogo já tem
todos os campos.

---

## 6 · ITEM 4 — A TELA DA ELEIÇÃO

**Uma tela só, antes do mês 1, com quatro perguntas em ordem:** quem você é (o que já existe),
por qual partido, com quem na chapa, e de onde você veio.

⚠ **E ela substitui a carta da posse? Não.** A plataforma (as três promessas) continua chegando
pela Caixa no mês 2 — **é a diferença entre o que você é e o que você promete.** A base definida
em 31/08 diz que a posse leva a uma tela de abertura; **esta é essa tela.**

⚖ **Custo:** médio. É tela nova, e a única do jogo que roda antes do estado existir.

---

## 7 · A ORDEM, POR CUSTO

| passo | o quê                 | custo   | depende |
| ----- | --------------------- | ------- | ------- |
| ✔ 1   | o partido             | pequeno | feito   |
| **2** | a origem              | pequeno | —       |
| **3** | a chapa e a coligação | médio   | 1       |
| **4** | a tela da eleição     | médio   | 1, 2, 3 |

⚠ **FAÇA OS QUATRO NO MESMO CICLO.** O item 1 sobe o `SCHEMA_VERSION` para 21 e mata a partida em
andamento — **e esse preço se paga uma vez.** Espalhar os quatro por quatro sessões cobra quatro
vezes.

---

## 8 · ⛔ O QUE ESTE CICLO RECUSA

| pedido                            | por quê                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------- |
| **nomes reais de partido**        | ADR 0003. Partido real traz posição real sobre pauta real, e o motor vai divergir |
| **"sem partido" como opção**      | 📗 CF art. 14, §3º, V — não existe. O duro é escolher um partido pequeno          |
| **simular a campanha eleitoral**  | é outro jogo. Aqui a eleição é a **ficha**, e o mandato é a partida               |
| **origem que só dá bônus**        | cada uma sobe uma coisa e desce outra                                             |
| **o vice do seu próprio partido** | 📗 a chapa conjunta existe desde 1964 para juntar blocos diferentes               |

---

## 9 · ⚖ A RESTRIÇÃO

1. `npm run validate` verde, e **a captura da tela nova aberta** — ela é a primeira coisa que o
   jogador vê;
2. **o item 1 e o item 3 mexem em motor**, então `simulate` roda e **a série se reescreve no
   mesmo commit**. ⚠ Ela vai mover de propósito: um governo com 145 cadeiras próprias não é o
   governo de hoje;
3. ⛔ **e nenhum número aqui é inventado**: as nove bancadas, os cinco eixos de ambição, a memória
   e a satisfação por segmento já estão no catálogo. **O que entra é de onde o jogador começa.**

---

## Fontes

- [STF nega candidaturas sem filiação partidária](https://noticias.stf.jus.br/postsnoticias/stf-nega-possibilidade-de-candidaturas-sem-filiacao-partidaria/)
- [TSE — candidatura avulsa](https://temasselecionados.tse.jus.br/temas-selecionados/registro-de-candidato/candidatura-avulsa)
- [Lista de vice-presidentes do Brasil](https://pt.wikipedia.org/wiki/Lista_de_vice-presidentes_do_Brasil)
- [Federações partidárias e o prazo de registro em 2026](https://conjur.com.br/2025-ago-06/prazo-de-registro-das-federacoes-partidarias-e-o-mesmo-dos-partidos-decide-stf/)
- [TSE — cláusula de desempenho nas Eleições 2026](https://www.tre-sc.jus.br/comunicacao/noticias/2026/Junho/clausula-de-desempenho-deve-influenciar-cenario-partidario-nas-eleicoes-2026)
- [Partidos em risco com a cláusula de barreira](https://www.gazetadopovo.com.br/republica/saiba-quais-partidos-podem-ser-afetados-pela-clausula-de-barreira-em-2026/)
- [Congresso pulverizado entre 22 partidos](https://www.forte.jor.br/2026/07/30/congresso-nacional-chega-as-eleicoes-de-2026-com-poder-pulverizado-entre-22-partidos/)
- [Mapa dos blocos partidários da Câmara](https://jornalgrandebahia.com.br/2026/05/mapa-da-camara-dos-deputados-mostra-forca-dos-blocos-partidarios-e-peso-do-centro-nas-eleicoes-2026-confira-os-dados/)
- [Trocas ministeriais para as eleições de 2026](https://www.gazetadopovo.com.br/eleicoes/2026/governo-divulga-lista-de-novos-ministros-apos-baixas-para-eleicoes/)
- [Seis ministérios concentraram 75% do orçamento da União em 2025](https://www.conjur.com.br/2026-abr-08/seis-ministerios-concentraram-75-do-orcamento-da-uniao-em-2025/)
