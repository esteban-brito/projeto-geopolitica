# CICLO 23 — O CORPO POLÍTICO

> **Escrito em 04/09/2026.** Ele nasce de uma pergunta dele que nenhum plano tinha respondido:
>
> _"O que falta HOJE no meu jogo, que um presidente, como o Lula por exemplo, tem a capacidade
> de fazer, mexer, criar, contactar, etc etc… além de tudo que está registrado, planejado, etc."_
>
> **São 17 itens, e nenhum deles está em plano nenhum.** Somando os ciclos 13, 17, 18, 19, 20,
> 21 e 22, o presidente do jogo vai ter as **quatro moedas** — dinheiro, cargo, tempo de
> tramitação e caneta. Vai legislar, nomear, vetar, privatizar, escrever lei nova e ser desfeito
> pelo Supremo.
>
> ⛔ **O que ele continua não tendo é CORPO POLÍTICO PRÓPRIO.** Sem partido, sem vice, sem
> entorno, sem tempo finito e sem voz, ele é uma função que assina papel muito bem — mas ninguém
> depende dele, ninguém o sucede, ninguém o trai por conta própria, e **ele nunca precisa
> escolher entre duas coisas boas**.

---

## 0 · Os graus de confiança

📗 norma citável · 📙 literatura · 📰 apurado na web em 04/09/2026 · 📐 medido neste repositório

---

# PARTE A — O TEMPO

## A1 · ⭐⭐⭐ O presidente não tem tempo, e é a ausência mais cara do jogo

📐 **Medido:** não existe orçamento de atenção em lugar nenhum do repositório. O jogador move os
**38 programas**, as faixas de **44 normas**, a emenda das **9 bancadas** e o contingenciamento
das **8 áreas** — tudo no mesmo mês, e tudo de graça.

📙 **E é o contrário do cargo.** Um presidente empurra **duas ou três coisas grandes por ano**. O
resto morre de falta de atenção, não de derrota. A agenda dele é o recurso escasso — mais escasso
que o dinheiro, porque dinheiro se pega emprestado e mês não.

⛔ **A consequência de jogo é grave e está escondida:** hoje **escolher não custa nada, porque
não escolher também não**. O jogo pede "escolha uma prioridade" na posse e depois deixa você
atender a todas. Toda a tensão que os ciclos 18 e 22 vão construir — a MP, o decreto, a lei nova,
a privatização — chega numa mesa onde cabe tudo.

⭐ **É o único item deste documento que dá peso às jogadas que JÁ EXISTEM.** Os outros dezesseis
acrescentam peça. Este faz cada peça já construída pesar contra as outras.

**Como ele entra, e é barato:**

| a peça                 | o que é                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| **o mês tem foco**     | o jogador marca **uma** frente por mês, e ela é o que anda de verdade    |
| **o resto anda menos** | não trava — anda mais devagar, ou custa mais caro. **Preço, nunca muro** |
| **e o foco se gasta**  | trocar de foco todo mês zera o acúmulo. 📐 e isso o motor já mede        |

📐 **E o motor já provou que a mecânica funciona:** o achado 52 mediu que concentrar 48 meses na
Saúde dá **+10,5 pontos**, e rodar o foco a cada 12 meses dá **+4**. **O país já premia
compromisso sustentado e pune rotação — e nenhuma tela diz isso ao jogador.** O tempo é a peça
que torna essa regra visível e escolhida.

⚖ **Custo:** médio. **Não abre motor** — a MALHA já tem rendimento por área e o `ELENCO` já tem
memória. O que entra é uma ordem por mês e um multiplicador.

---

# PARTE B — O CORPO

## B1 · ⭐⭐ O vice-presidente — ▶ **EXECUTADO PELO [CICLO 24](24-the-president.md), item 2**

> **Ele saiu daqui em 04/09/2026.** O ciclo 24 o junta com a coligação, porque as duas coisas são
> a mesma escolha: a chapa. 📗 E a pesquisa datou o que este item só supunha — **oito dos 39
> presidentes foram vices que assumiram, e três desde 1985** (Sarney, Itamar, Temer).

📐 **Medido: a palavra não aparece uma vez no `src/`.** Não existe vice.

⛔ **E isso esvazia o impeachment que o jogo já tem.** Hoje as três rupturas abrem processo, o
quórum é 342, e o jogo te derrota — **sem dizer quem ganha**. Metade da tensão real do
impeachment é que existe alguém do outro lado, com nome, com partido, e com motivo. Sarney,
Itamar, Temer.

📗 **E ele não é decorativo na Constituição:** art. 79 — substitui nos impedimentos e sucede na
vacância. Art. 80 — a linha segue para o presidente da Câmara, do Senado e do STF.

⭐ **O desenho que isto abre, e ele é caro em política e barato em código:**

- o vice vem de **outro bloco** — é o preço da coligação que te elegeu;
- ele tem **ambição própria** (o `ELENCO` já sorteia cinco), e a mais perigosa é `succession`;
- quanto pior você está, **mais barato fica para ele te trair** — e o motor já sabe medir isso,
  porque `successionDrag` já existe;
- e o cerco do impeachment passa a ter **destinatário**.

⚖ **Custo:** pequeno. Uma pessoa a mais no `ELENCO`, com um papel novo, e uma leitura na
CALDEIRA.

## B2 · ⭐⭐ O partido do presidente — ▶ **EXECUTADO PELO [CICLO 24](24-the-president.md), item 1**

> **Ele saiu daqui em 04/09/2026**, e a pesquisa fechou uma pergunta que este item deixava
> aberta: 📗 **não existe presidente sem partido** — filiação é condição de elegibilidade (CF
> art. 14, §3º, V) e o STF afastou a candidatura avulsa. **A escolha é obrigatória.**

📐 **Medido: nenhuma das nove bancadas é a sua.** Todas se relacionam com o governo pela mesma
porta — verba, lealdade, venalidade.

📙 **E um presidente brasileiro tem partido, e o partido cobra mais que a oposição:** cargo,
candidatura, direção partidária, e a sucessão. É a bancada que você **não pode comprar**, porque
ela acha que já é dona.

⭐ **O que muda no jogo:** existe um bloco em que a lealdade **começa alta e a venalidade não
funciona** — ele não quer dinheiro, quer participação. Trair ele custa o dobro. E ele te cobra
antes de todo mundo.

⚖ **Custo:** pequeno. Um campo no catálogo de partidos e um caminho a mais em `whipCount`.

## B3 · O entorno — a corrupção que não é sua

📐 O ciclo 13 tem o **A9, "a imprensa e o escândalo"**, e ele é genérico. **O entorno não aparece
em lugar nenhum.**

📙 E é assim que presidente brasileiro cai: ministro, tesoureiro, filho, operador. Não é o
presidente que aparece na foto — é quem ele nomeou.

⭐ **Ele só existe depois da nomeação (A6), e é a razão mais forte para a nomeação ter preço:**
cada pessoa que você põe num cargo é uma pessoa que pode te queimar. **Nomear deixa de ser só
comprar apoio e passa a ser assumir risco.**

⚖ **Custo:** médio. Depende do A6 e do ciclo 19 (a imprensa).

## B4 · A voz — o pronunciamento em rede nacional

📐 O [ciclo 19](19-the-voice.md) dá voz à **imprensa**, e não dá voz **a você**. Hoje o presidente do
jogo nunca fala com o país.

⭐ **E o instrumento tem contra-jogo real, o que o torna jogo e não botão:** o pronunciamento
move a rua na direção que você escolher **e** convoca quem discorda. O panelaço é literalmente a
resposta a um pronunciamento.

- ele é **caneta pura** — não pede licença a ninguém;
- ele **se gasta**: o quinto pronunciamento do ano vale menos que o primeiro;
- e ele **escolhe um assunto**, o que o liga direto ao A1: falar de uma coisa é não falar de
  outra.

⚖ **Custo:** pequeno depois do ciclo 19. Ele reusa o avaliador inteiro — quem gosta, quem odeia.

## B5 · A reeleição

📗 CF art. 14, §5º — o presidente pode se reeleger uma vez.

📐 O jogo acaba em **48 meses** e o fecho conta o que você prometeu contra o que entregou. **Não
existe eleição.**

⭐ **E o ano 4 de um mandato brasileiro não se parece com nenhum outro:** tudo fica mais caro,
todo aliado quer palanque, e o adversário não precisa mais negociar. **É o único período do jogo
em que o tempo corre contra você de verdade.**

📗 **E isso está documentado, apurado em 04/09/2026:** a Esplanada tem **39 ministérios**, e
**14 trocaram de comando** para os ocupantes disputarem a eleição de 2026. **O êxodo do ano 4 não
é literatura — é um terço do ministério saindo pela porta.** ⭐ E a cláusula de barreira (EC
97/2017) põe um segundo relógio no mesmo ano: **o partido que te elegeu pode não sobreviver à
eleição.** Ver o [ciclo 24 §2](24-the-president.md).

⚖ **Custo:** médio, e ele fecha o mandato como pergunta em vez de placar.

---

# PARTE C — OS DONOS SEM DONO

> **Três coisas que o jogo já simula e que não têm ninguém decidindo.** São os itens de melhor
> relação entre custo e realismo do documento inteiro, porque o número já existe — falta o dono.

## C1 · ⭐⭐⭐ O Banco Central autônomo — e o calendário dele é um presente

📐 **Medido em `src/domain/economy/index.mjs`: a Selic sai de uma REGRA DE TAYLOR.** É uma
equação com suavização. **Ninguém decide o juro.**

📗 **E no Brasil de hoje é o contrário disso.** A [LC 179/2021](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm):

- presidente e diretores do BC têm **mandato de 4 anos**, com uma recondução;
- ⭐ **o mandato do presidente do BC começa em 1º de janeiro do TERCEIRO ANO do mandato
  presidencial** — descasado de propósito;
- **exonerar exige o Senado.** Não é impossível: é caro. Desempenho insuficiente, proposta do
  presidente da República, **maioria absoluta do Senado**;
- e ele presta contas ao Senado em **arguição pública semestral**.

⭐⭐ **E a aritmética disso dentro do seu jogo é perfeita, e não foi ninguém que a desenhou:**

| quando              | mês do jogo | quem manda no juro                                                         |
| ------------------- | ----------- | -------------------------------------------------------------------------- |
| jan/2027 a dez/2028 | **1 a 24**  | **o BC do seu antecessor.** Você não escolheu, e não pode demitir de graça |
| jan/2029 a dez/2030 | **25 a 48** | o seu, que você indicou e o Senado aprovou                                 |
| jan/2031 a dez/2032 | depois      | ⭐ **ainda o seu — dois anos além do seu mandato**                         |

> **Você passa metade do mandato com o banqueiro central do seu adversário, e escolhe um que te
> sobrevive.**

⛔ **E o muro não existe, que é a doutrina do projeto:** você **pode** demitir. O preço é uma
votação no Senado, e o preço político de ter pedido. É "tudo tem preço, nada tem muro" na forma
mais limpa que este projeto já encontrou.

⚖ **Custo:** médio. A CORRENTE ganha um desvio sobre a Taylor — o BC aperta mais ou menos que a
regra, conforme quem o preside e o que ele pensa de você. **O número já existe; o que entra é uma
pessoa em cima dele.**

## C2 · As Forças Armadas, a GLO e a intervenção federal

📐 **Medido:** os militares existem como **grupo de pressão que pesa ZERO** — a tela até imprime
"não pesa". Não há instrumento.

⚠ **O ciclo 18 recusou** por não haver proxy público de alinhamento, e o ciclo 17 registrou o
mesmo. **Este ciclo reabre, e a razão é que o instrumento não precisa do alinhamento — precisa do
preço:**

| 📗 instrumento                                 | o que é                                                      |
| ---------------------------------------------- | ------------------------------------------------------------ |
| **GLO** — art. 142                             | tropa na rua, por prazo e área definidos. Usada o tempo todo |
| **intervenção federal** — art. 34 e 84, X      | a União assume um ente. Houve no Rio, em 2018                |
| **estado de defesa e de sítio** — art. 136-141 | o degrau acima, com prazo e controle do Congresso            |

⭐ **E os três têm a mesma forma de jogo:** resultado rápido e visível na área de Segurança,
preço caro e crescente na rua, no Congresso e na sua própria coalizão. **É a jogada do
desesperado, e todo jogo de presidente precisa de uma.**

⚖ **Custo:** médio. Depende dos entes (ciclo 22, verbo 3) para a intervenção; a GLO não depende
de nada.

## C3 · A Justiça sobre VOCÊ

📐 O jogo tem impeachment por ruptura, com quórum de 342. **Não tem processo criminal.**

📗 CF art. 86: admitida a acusação por **dois terços da Câmara** — os mesmos 342 —, o presidente
é julgado pelo **STF** nos crimes comuns e pelo **Senado** nos de responsabilidade. ⭐ **E ele
fica SUSPENSO das funções por até 180 dias**; passados os 180 sem julgamento, a suspensão cessa e
o processo continua.

⭐⭐ **Seis meses suspenso é um estado de jogo que não existe em lugar nenhum:** você continua
presidente, não governa, o vice assume, e você volta. **Isso liga o B1, o B3 e o C3 num nó só** —
o entorno te queima, a Câmara admite, você sai por seis meses, e o vice governa com a sua base.

⚖ **Custo:** médio. Depende do vice (B1). A CALDEIRA já tem o quórum e o cerco.

---

# PARTE D — O MUNDO

## D1 · ⭐ A política externa — e eu reabro a recusa

⚠ **Recusada duas vezes, com a mesma frase: _"Fase 1 só o Brasil"_.** O ciclo 18 traz o **choque
externo com destino** (item 11) — mas isso é o mundo **acontecendo com você**, e não você agindo
nele.

📙 **E é um terço do cargo.** Viagem, tratado, Mercosul, BRICS, ONU, guerra comercial, missão
comercial, credenciamento de embaixador. Um presidente brasileiro passa semanas fora do país por
ano, e essa é **a metade do trabalho em que ele não precisa do Congresso**.

⭐ **A forma mínima e honesta, e ela cabe no que já existe:**

| a peça            | o que ela faz                                                                          |
| ----------------- | -------------------------------------------------------------------------------------- |
| **o destino**     | o choque externo do ciclo 18 já vai ter origem. A viagem escolhe para onde ir          |
| **o preço**       | ⭐ **tempo** (A1) e nada mais — você está fora, e o Congresso está aqui                |
| **o retorno**     | abre mercado, desvia exportação, atrai investimento. Sempre com atraso                 |
| **o contra-jogo** | 📰 a tarifa americana é o caso completo: −6,6% num destino e +3,5% no total por desvio |

⚖ **Custo:** médio, e ele **depende do A1** — sem tempo escasso, viajar é grátis, e viajar grátis
é um botão.

---

# PARTE E — AS ALAVANCAS SOLTAS

> **Sete canetas reais que nenhum plano cita.** Nenhuma abre motor sozinha.

## E1 · O salário mínimo como política

📐 Ele está em `src/data/calendar.mjs` como **marco de janeiro**, com fonte (Lei 14.663/2023). Ele
é uma **data**, e não uma decisão.

⛔ **E ele indexa metade da despesa obrigatória do país** — aposentadoria, abono, seguro-desemprego,
amparo assistencial. 📐 Quatro dos 38 programas do catálogo.

⭐ **É a maior decisão fiscal de um mandato brasileiro**, e ela é anual: quanto acima da inflação.
Sobe a rua e a despesa juntas. **Está a um campo de distância de virar jogada.**

## E2 · Criar e extinguir ministério

📗 CF art. 84, VI — o presidente dispõe sobre a organização da administração federal por decreto,
desde que não aumente despesa nem crie órgão.

📐 O ciclo 18 trata a **pasta como moeda** (item 7, a coalescência). **Ninguém trata a pasta como
coisa que se cria.** As oito áreas do rail são fixas.

⭐ E fundir dois ministérios para dar um a um aliado é jogada real, barata e brasileira.

## E3 · A dívida dos estados

📗 Regime de Recuperação Fiscal (LC 159/2017) e as renegociações sucessivas.

📐 O **A10** traz o pacto federativo, e **não cita a dívida**. É a maior alavanca que um
presidente tem sobre um governador: você segura ou solta a dívida dele, e ele te apoia ou não.

## E4 · O indulto

📗 CF art. 84, XII.

⚠ **O ciclo 18 recusou:** _"real, e sem superfície — não move índice, receita nem bancada"_.
**Discordo, e o motivo é medível:** ele não move dinheiro **nenhum** e move a rua **inteira**. É a
jogada mais barata do cargo e uma das mais caras politicamente. **Um instrumento de custo fiscal
zero e custo político alto é exatamente o que falta na mesa de um jogo de orçamento.**

## E5 · O concurso e o tamanho da máquina

📐 A MALHA modela **capacidade de entrega** sem modelar **gente**. Não há servidor, não há
concurso, não há aposentadoria da máquina.

⭐ E é o que liga a reforma administrativa (que os ciclos 20 e 22 tocam) ao índice que o jogador
vê cair: contratar hoje entrega daqui a dois anos. **É atraso puro, e o motor já sabe fazer
atraso.**

## E6 · O prazo de sanção

📗 CF art. 66 — **15 dias úteis** para sancionar ou vetar; o silêncio sanciona.

📐 O **veto** é o A7 e o item 8 do ciclo 18. **O relógio dele não está em plano nenhum**, e é o
relógio que faz o veto ser decisão: você tem quinze dias, e nesses quinze dias se negocia.

## E7 · O Conselho da República e o de Defesa Nacional

📗 CF art. 89 a 91. Os dois órgãos que a Constituição **obriga** o presidente a ouvir antes de
intervenção federal, estado de defesa, estado de sítio e declaração de guerra.

⭐ São o rito das jogadas do C2 — e rito, neste jogo, é preço.

---

# A ORDEM DE EXECUÇÃO

| #      | item                      | parte | custo   | depende de       | por que aqui                                                |
| ------ | ------------------------- | ----- | ------- | ---------------- | ----------------------------------------------------------- |
| **1**  | ⭐⭐⭐ **o tempo**        | A1    | médio   | —                | **dá peso a tudo que já existe.** Nenhum outro faz isso     |
| **2**  | ⭐⭐ **o Banco Central**  | C1    | médio   | —                | o número já existe; falta o dono. E o calendário é de graça |
| ▶ 3    | ⭐⭐ **o vice**           | B1    | pequeno | —                | **foi para o [ciclo 24](24-the-president.md), item 2**      |
| ▶ 4    | ⭐⭐ **o seu partido**    | B2    | pequeno | —                | **foi para o [ciclo 24](24-the-president.md), item 1**      |
| **5**  | **o salário mínimo**      | E1    | pequeno | —                | está a um campo de virar a maior decisão fiscal do ano      |
| **6**  | **o indulto**             | E4    | mínimo  | ciclo 19         | custo fiscal zero, custo político alto                      |
| **7**  | **a voz**                 | B4    | pequeno | ciclo 19         | reusa o avaliador inteiro                                   |
| **8**  | **a Justiça sobre você**  | C3    | médio   | 3                | os 180 dias suspenso, e o vice governando                   |
| **9**  | **o entorno**             | B3    | médio   | A6, ciclo 19     | faz nomear ser risco, e não só compra                       |
| **10** | **a GLO e a intervenção** | C2    | médio   | entes (ciclo 22) | a jogada do desesperado                                     |
| **11** | **a política externa**    | D1    | médio   | 1                | sem tempo escasso, viajar é um botão                        |
| **12** | **a reeleição**           | B5    | médio   | 1, 4             | o ano 4 não se parece com nenhum outro                      |
| **13** | **o ministério**          | E2    | pequeno | ciclo 18 item 7  | fundir pastas para dar uma a um aliado                      |
| **14** | **a dívida dos estados**  | E3    | médio   | A10              | a alavanca sobre governador                                 |
| **15** | **o prazo de sanção**     | E6    | mínimo  | A7               | o relógio que faz o veto ser decisão                        |
| **16** | **o concurso**            | E5    | médio   | —                | contratar hoje entrega em dois anos                         |
| **17** | **os conselhos**          | E7    | mínimo  | 10               | o rito das jogadas de exceção                               |

⭐ **Os quatro primeiros cabem em duas sessões e mudam o jogo mais que os treze restantes
juntos** — porque um dá peso a tudo, e três dão ao presidente as pessoas de que ele depende.

▶ **E os itens 3 e 4 saíram daqui em 04/09/2026:** eles viraram o [ciclo 24](24-the-president.md),
que os junta com a origem e a coligação. **A razão é o save** — o partido sobe o
`SCHEMA_VERSION` para 21 e mata a partida em andamento, e esse preço se paga UMA vez. Fazer os
dois soltos, em sessões diferentes, o cobraria duas.

---

# ⛔ O QUE ESTE CICLO RECUSA

| pedido                                                      | por quê                                                                           |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **simular o COPOM**                                         | o BC entra como pessoa com viés sobre a Taylor, não como comitê de nove diretores |
| **eleição presidencial jogável**                            | a reeleição entra como pressão sobre o ano 4, não como um segundo jogo            |
| **guerra**                                                  | 📗 real (art. 84, XIX) e sem superfície neste modelo. Ausência declarada          |
| **nomes reais de vice, de ministro ou de presidente do BC** | ADR 0003. **A forma é real; a pessoa é inventada, sempre**                        |
| **modelar o servidor um a um**                              | o E5 entra como atraso e custo de folha, não como cadastro                        |

---

# ⚖ AS RESTRIÇÕES

1. `npm run validate` verde, e **a captura aberta**;
2. **quase tudo aqui mexe em motor** — `simulate` roda e a série se reescreve no mesmo commit;
3. ⚠ **o A1, o B1, o B2 e o C1 custam bump de esquema.** Foco do mês, vice, partido do governo e
   presidente do BC são fatos do mandato e vão para o save. **Meça antes de bumpar, e junte-os
   num bump só** — cada subida custa a partida em andamento;
4. ⛔ **e nenhum item inventa número.** Todo valor tem norma citada acima ou motor atrás.

---

# Fontes

📗 Constituição Federal: art. 14 §5º (reeleição) · art. 34 e 84 X (intervenção) · art. 66 (sanção
em 15 dias úteis) · art. 79 e 80 (o vice e a linha sucessória) · art. 84 VI (organização da
administração) · art. 84 XII (indulto) · art. 84 XIII (comando supremo) · art. 86 (denúncia,
dois terços, e os 180 dias) · art. 89 a 91 (os conselhos) · art. 136 a 141 (defesa e sítio) ·
art. 142 (GLO).

📗 [LC 179/2021 — autonomia do Banco Central](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm)
· LC 159/2017 (Regime de Recuperação Fiscal) · Lei 14.663/2023 (salário mínimo).

📰 Apurado em 04/09/2026:
[Dizer o Direito — o que a LC 179 mudou](https://www.dizerodireito.com.br/2021/02/lei-complementar-1792021-confere.html)
· [STF — a constitucionalidade da autonomia](https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=471872&ori=1)
· [Câmara dos Deputados — art. 86 e o rito](https://bd-rest.camara.leg.br/server/api/core/bitstreams/652988a5-ab8a-4327-8fe7-63e1df34f9ee/content)
