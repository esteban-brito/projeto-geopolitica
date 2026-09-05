# PESQUISA 08 — A MESA DO PRESIDENTE

> **Escrita em 05/09/2026, a pedido dele:** _"eu quero que esse Gabinete seja totalmente
> reformulado, pq hoje ele está terrível… eu falei que quero que ele pareça a mesa de um
> presidente… quero algo totalmente diferente, exótico, bonito. Realismo."_
>
> **E com um adendo dele, no mesmo dia:** _"o Email será reformulado, terá mais conteúdo como
> mídia, notícias, imprensa"_ — e a pergunta que ele fez junto: **o Email e o Gabinete precisam
> estar em harmonia?**
>
> ⚠ **Isto não é plano.** É a auditoria medida das duas telas e o catálogo de ideias. **A escolha
> do que entra é dele.**

---

## 1 · 📐 A AUDITORIA, medida no navegador em 1920×1000

### 1.1 · As duas telas, lado a lado

| medida                | Gabinete       | Email          |
| --------------------- | -------------- | -------------- |
| o tabuleiro           | 1648 × 842 px  | 1648 × 842 px  |
| classe da raiz        | `area cabinet` | `area cabinet` |
| átomos de texto       | **29**         | **26**         |
| ⛔ densidade de tinta | **18,4%**      | **14,9%**      |
| ⛔ vazio no rodapé    | **368px**      | **274px**      |
| altura usada de 842   | 463px — 55%    | 568px — 67%    |

⛔ **O Email é MAIS vazio que o Gabinete**, e as duas telas usam **a mesma classe de raiz, a
mesma peça de cartão e o mesmo tabuleiro.** Elas não são duas telas: são a mesma tela vazia duas
vezes.

### 1.2 · O Gabinete, em números

| medida                            | valor                                        |
| --------------------------------- | -------------------------------------------- |
| a mesa (`.desk`)                  | 1648 × 842 px = **1.387.616 px²**            |
| ocupado pelas quatro zonas        | 564.634 px²                                  |
| ⛔ **vazio**                      | **822.982 px² — 59,3%**                      |
| ⛔ **faixa morta contígua no pé** | **368 × 1648 = 606.464 px² — 43,7% sozinha** |
| dos 29 átomos, valores numéricos  | **8**                                        |

**A tela inteira cabe em 29 pedaços de texto**, e oito deles são números.

### 1.3 · O que a auditoria acha além do vazio

1. ⛔ **O melhor endereço da tela é um estado vazio.** A faixa de cima gasta 58px na primeira
   linha do olho para dizer _"Você assumiu sem dizer a que veio"_. **A ausência ganhou o lugar
   nobre.**

2. ⛔ **A caneta ocupa 1083px — 66% da largura — para caber oito botões e três linhas.** E os
   oito botões parecem **abas de navegação**, não um ato do Executivo. Nada ali diz que aquilo
   vai ao Diário Oficial.

3. ⛔ **Nada nessa tela diz que o sujeito é presidente da República.** O rail diz _"sabo · ainda
   governa o orçamento que herdou"_ — sem partido (que existe desde 04/09), sem tratamento, sem
   data, sem número de ato.

4. ⛔ **Quatro caixas com legenda em versalete, empilhadas.** É a forma de um formulário, e as
   quatro zonas são **o mesmo objeto** repetido: retângulo, título pequeno, linhas dentro.

5. ⛔ **A carta do Email tem 1440px de largura para um texto de 502px.** A medida da linha está
   certa — 66 caracteres —, e sobram **938px de vazio lateral** dentro da própria carta.

6. ⚠ **O rail tem 14 itens e a tela tem 29 átomos.** O menu quase empata com o assunto.

### 1.4 · Treze sistemas prontos que o Gabinete não mostra

⚠ **Cada linha já tem motor e já tem prova. Nenhuma pede número novo.**

| existe hoje                            | onde           | no Gabinete? |
| -------------------------------------- | -------------- | ------------ |
| as **8 pessoas** do mandato            | ELENCO         | ⛔ não       |
| a **memória** de cada uma              | `state.memory` | ⛔ não       |
| a **ambição** de cada uma e o preço    | `offered`      | ⛔ não       |
| os **9 grupos de pressão**             | CALDEIRA       | ⚠ só o pior  |
| a **série de 48 meses**, seis curvas   | `state.series` | ⛔ não       |
| o **índice das 8 áreas** e o histórico | MALHA          | ⛔ não       |
| a **gaveta** da tramitação             | `passageOf`    | ⛔ não       |
| as **44 normas** em arquivo            | ESTRATO        | ⛔ não       |
| os **24 meses fechados** no save       | `state.months` | ⛔ não       |
| a **corrente causal**                  | `chainOf`      | ⛔ não       |
| **quem é você**                        | `governmentOf` | ⛔ não       |
| o **mandato** e o que sobra dele       | `termOf`       | ⛔ não       |
| o **partido**, desde 04/09             | `state.party`  | ⛔ não       |

**A fachada tem 19 portas. O Gabinete usa 7.**

---

## 2 · ⚖ O DIAGNÓSTICO — a tese do ciclo 21 foi testada, e ele reprovou o resultado

O ciclo 21 escreveu a hipótese com todas as letras:

> _"O que faz parecer uma mesa é **hierarquia, lugar fixo e ter o que assinar**."_

**Isso foi executado inteiro em 04/09**, e a resposta dele em 05/09 é _"está terrível"_.

⚠ **E a frase que vinha grudada nela — _"madeira, couro e papel não entram"_ — era minha, e caiu
hoje.** Ver a §9.

⚖ **A conclusão que eu tiro, e ela é a peça central desta pesquisa:** hierarquia, lugar fixo e um
ato para assinar são **necessários e não são suficientes.** Sem matéria, eles produzem um
formulário muito bem organizado — que é exatamente o que a auditoria mediu: quatro caixas iguais,
59,3% de vazio, 29 átomos.

⚠ **E o filtro do ciclo 21 continua certo no que ele mede.** _"Cada linha tem de mudar uma decisão
que o jogador está prestes a tomar"_ é a régua correta para **densidade de decisão**, e ele não
tem nada a dizer sobre **presença**. Um lugar tem coisas que não decidem nada e sem as quais ele
deixa de ser aquele lugar.

> **A regra que eu proponho, e ela acrescenta sem negar:**
> **o centro decide, a margem informa, e o resto do lugar EXISTE.**

⚠ **E há um erro de premissa no arranjo:** a tela foi desenhada em torno de **uma caneta só**. O
presidente não assina uma coisa por mês — ele recebe uma **pasta**. Enquanto o centro couber um
ato, ele vai gastar 66% da largura para dizer uma frase.

---

## 3 · ⭐⭐⭐ A TESE VISUAL — o modernismo brasileiro, e ele TEM matéria

⛔ **ANTES DE TUDO, UMA TRAVA MINHA QUE CAIU HOJE.** O ciclo 21 dizia _"madeira, couro e papel não
entram"_ e _"o projeto já matou skeumorfismo"_. **Ele nunca disse isso — eu escrevi.** O que
existe no registro é o contrário: em 22/08 **ele pediu o marrom** (_"dá pra ser marrom liquid
glass o bloco da direita?"_) e depois recusou **aquela cor** (_"esse marrom cor de bosta"_).
Recusar um tom não é banir três materiais. **A matéria está aberta.**

---

⛔ **E a segunda coisa a tirar do caminho é a referência errada.** "Mesa de presidente" puxa a
sala vitoriana — mogno escuro, abajur verde, estante de livros. **Isso não é o Brasil.** É a Casa
Branca, e é o que todo jogo do gênero já faz.

⭐⭐ **O gabinete presidencial brasileiro é modernista, e o modernismo brasileiro TEM matéria — só
não é a matéria inglesa:**

| a sala vitoriana          | ⭐ o Planalto                                                  |
| ------------------------- | -------------------------------------------------------------- |
| mogno escuro, quase preto | **jacarandá** — quente, avermelhado, veio largo                |
| couro verde-garrafa       | **couro caramelo** — a Mole do Sergio Rodrigues                |
| carpete, cortina pesada   | **mármore branco**, pé-direito alto, vão livre                 |
| abajur de cúpula verde    | **luz rasante de Brasília**, entrando por vidro de chão a teto |
| entulhado                 | **vazio deliberado** — em Niemeyer o vazio é a obra            |

⭐ **É isso que é "exótico": nenhum jogo de política se parece com Brasília.** E é isso que é
"realismo": é o lugar real onde a coisa acontece.

### 3.1 · As sete peças da tese

**1. ⭐ O TAMPO É DE JACARANDÁ, e o veio é grande.** Não um padrão de textura repetido de 64px —
**duas ou três linhas de veio atravessando 1648px**, como uma prancha maciça de verdade. Prancha
grande lê como móvel; padrão pequeno lê como papel de parede, e foi isso que o marrom antigo
errou.

**2. ⭐ O COURO É O MATA-BORRÃO, e ele é uma peça e não um fundo.** Um retângulo de couro caramelo
no centro da mesa, com a costura na borda. **É onde o documento pousa.** O resto do tampo fica
madeira nua.

**3. O brasão em relevo seco no couro.** Gravado, não impresso: aparece só na luz rasante. Diz
"República" sem escrever a palavra.

**4. ⭐ A LUZ É A COISA MAIS IMPORTANTE, e ela já existe.** `--light-angle` interpola por quadro.
Luz fria de janela vindo de um lado, sombra projetada **longa e macia** debaixo de cada objeto.
⚠ **É a sombra que faz o objeto pousar** — sem ela, madeira vira papel de parede.

**5. O pé-direito.** As peças ficam assentadas **embaixo**, com ar em cima. Ar em cima lê como
altura de sala; ar embaixo lê como esquecimento. **Hoje o ar está todo embaixo.**

**6. Uma peça grande, e só uma.** A regra que quebra o formulário: **um objeto tem de ser três
vezes maior que os outros.** Hoje as quatro zonas variam entre 95k e 168k px² — todas do mesmo
tamanho, e é por isso que a tela lê como formulário mesmo com o lugar fixo certo.

**7. A janela ao fundo.** Vidro de chão a teto com a Esplanada, e a luz muda com o mês do mandato.
É o único elemento decorativo, e ele carrega a informação mais difícil de dar: **o tempo
passando.**

### 3.2 · ⚠ Por que o marrom falhou da primeira vez, e como não repetir

📐 **O registro tem a medição:** o ofício marrom foi medido em 22/08 e, na translucidez de 0,66, o
azul da lâmina ultrapassava o verde e **o pergaminho virava cinza frio** — a substância sumia. E
o ofício translúcido custou **9,7 fps**, porque `--light-angle` recompõe a superfície a cada
quadro.

⭐ **As três regras que saem disso, e elas são a diferença entre bonito e "cor de bosta":**

1. ⛔ **madeira NUNCA translúcida.** Tinta chapada, e o passeio da luz fica numa camada de cima —
   é a mesma decisão que já vale para `--sheet`;
2. ⛔ **nunca marrom-lama.** Jacarandá é **avermelhado e saturado**, e o erro anterior foi um marrom
   dessaturado que virou cinza no primeiro empilhamento;
3. ⭐ **a madeira é FUNDO, e nunca peça.** Ela é o tampo em que as coisas pousam. Madeira num
   cartão, num botão ou numa borda é o skeumorfismo ruim de verdade.

⚠ **E uma alternativa fica declarada, para o caso de a madeira reprovar na captura:** o mesmo
arranjo sem madeira — mármore claro no lugar do jacarandá, e a matéria vindo só do couro e da luz.
**O arranjo não depende do material; o material decide o tom.**

---

## 4 · ⭐⭐ AS IDEIAS — O QUE FICA SOBRE A MESA

**7. ⭐⭐ A PASTA DE DESPACHOS, e ela é o centro.** No Brasil o presidente recebe a pasta com atos
para assinar. Ela nasce dizendo **quantos esperam e quantos vencem** — "7 atos · 2 vencem hoje" —
e você folheia. ⚠ **O desenho de hoje cabe um; este cabe N**, e é o que abre lugar para a MP
(ciclo 21, passo 5), o veto, o decreto tributário (pesquisa 04) e a nomeação.

**8. ⭐⭐ A ANTESSALA — quem está esperando para falar com você.** As 8 pessoas do ELENCO existem
desde sempre, com nome, cargo, alcance, ambição e memória, **e nenhuma aparece aqui.** Uma fileira
no pé da mesa com o nome e o que a pessoa quer. **Motor pronto, zero número novo.**

**9. ⭐⭐⭐ O CALENDÁRIO DE 48 FOLHAS.** Você arrancou uma. É o item ⭐⭐⭐ do ciclo 23 (o TEMPO),
e ele resolve **43,7% do vazio** de uma vez: a faixa morta do rodapé vira a linha do mandato, com
uma marca por mês fechado. `state.months` já guarda 24 deles.

**10. A pilha de processos.** O que está tramitando, e a **altura da pilha é o número**.
`passageOf` já devolve o estágio e há quanto tempo cada texto espera.

**11. O Diário Oficial do dia.** Tudo que se assina sai publicado. Uma faixa estreita com o que
foi para o DOU — **é o registro do mandato**, e dá peso ao gesto.

**12. O telefone.** Ele toca quando um grupo passa do ponto de fervura. A CALDEIRA já sabe quem
está fervendo e a quantos pontos do limiar; hoje isso é uma linha de texto na margem.

**13. Objetos que não fazem nada.** O copo d'água, os óculos, o cinzeiro vazio. ⚠ **São eles que
separam uma mesa de um painel de controle** — e é exatamente o que o filtro do ciclo 21 não sabe
medir. ⛔ **Sem textura:** silhueta e sombra, e não madeira.

---

## 5 · ⭐ AS IDEIAS — O GESTO

**14. ⭐⭐ ASSINAR É ARRASTAR A CANETA.** Você passa a caneta sobre a linha e a assinatura aparece
manuscrita, no seu nome. `spring.mjs` existe, e a pesquisa 05 já mediu duração e quique. **É o
gesto mais memorável que este jogo pode ter, e ele custa uma tela.**

**15. O carimbo por rito.** `MEDIDA PROVISÓRIA`, `DECRETO`, `VETO`, `SANÇÃO`. ⚠ O projeto tem
`--font-machine` declarada como _"o que a máquina do Estado carimba"_ e **hoje ela não carimba
nada.**

**16. Rasgar em vez de recusar.** Recusar um ato é rasgar. É o gesto oposto do assinar, e ele
ensina que recusar também é um ato.

**17. O papel timbrado.** `PRESIDÊNCIA DA REPÚBLICA · GABINETE PESSOAL`, e embaixo
`Brasília, 5 de janeiro de 2027`. **Data por extenso, como documento oficial.**

**18. A numeração dos atos.** `Decreto nº 12.345, de 5 de janeiro de 2027`, sequencial pelo
mandato. No mês 40 você olha para trás e vê trezentos números com o seu nome. ⚠ **Sequencial, e
nunca sorteado** — número inventado é proibido.

---

## 6 · AS IDEIAS — O REALISMO BRASILEIRO

**19. A agenda do dia.** A agenda oficial do presidente é pública no Brasil. _"10h — despacho com
a Fazenda · 15h — audiência com a bancada ruralista."_ Cada compromisso é uma decisão de onde
gastar o dia.

**20. ⭐ AS NOMEAÇÕES.** É a caneta mais direta do cargo e **ela não existe no jogo**. O ciclo 18
já apurou que **três vagas do STF caem nos meses 16, 28 e 48**; o ciclo 24 apurou que a Esplanada
tem **39 ministérios** e que **14 trocaram de comando** em ano eleitoral.

**21. O vice ao lado.** Ciclo 24, item 2. **Três dos últimos presidentes foram vices que
assumiram** — a chance de ele te trair é histórica, não invenção.

**22. O tratamento correto.** _"Excelentíssimo Senhor Presidente"_ no papel. `TREATMENTS` já
existe e a Caixa já o respeita; o Gabinete não.

**23. O partido no crachá.** Desde 04/09 o presidente tem bancada, e **o Gabinete não diz qual.**

**24. As pastas ministeriais empilhadas**, uma por área, altura pela verba do mês.

---

## 7 · ⭐⭐⭐ O EMAIL E O GABINETE — a resposta

**Ele perguntou se as duas precisam estar em harmonia. A resposta tem três partes, e elas não
são a mesma.**

### 7.1 · Vocabulário: SIM, e já existe. Não mexer

A guarda `annexes` fecha as duas telas no mesmo vocabulário — `cardHtml`, `lineHtml`, `linesHtml`,
`noteHtml` — e proíbe tabela e régua desenhada à mão. **Isso está certo e é o que impede a terceira
gramática de nascer.**

### 7.2 · Forma: ⛔ NÃO, e hoje elas são iguais DEMAIS

📐 **Medido:** as duas usam a classe `area cabinet`, a mesma peça de cartão, o mesmo tabuleiro de
1648×842. **O Email é o Gabinete com um cartão dentro.**

| tela     | átomos | densidade | vazio no pé |
| -------- | ------ | --------- | ----------- |
| Gabinete | 29     | 18,4%     | 368px       |
| Email    | 26     | **14,9%** | 274px       |

⛔ **A guarda `annexes` fez o trabalho dela bem demais:** garantiu que as duas falem a mesma
língua, e não impediu que virassem o mesmo lugar. **Vocabulário comum não é forma comum.**

⭐ **Elas têm de ser OPOSTAS, e o sistema visual já tem as duas palavras:**

| tela         | quem fala        | substância               | forma                                   |
| ------------ | ---------------- | ------------------------ | --------------------------------------- |
| **Gabinete** | **você age**     | a máquina do Estado      | objetos, gesto, luz, uma peça grande    |
| **Email**    | **o mundo fala** | o registro — o documento | tipografia, coluna de leitura, silêncio |

### 7.3 · Estado: ⛔ SIM, E ESTÁ QUEBRADO — e este é o defeito, não a forma

⛔ **O Gabinete não diz quantas cartas esperam nem quantas vencem.** Você pode avançar o mês com
três cartas vencendo e **a mesa não avisa nada** — o único lugar que sabe é a outra tela, e o
`standards.md` já escreve a regra que isso viola:

> _"Informação que chega depois da decisão não é informação — é recibo."_

⭐ **O conserto é uma peça e ela resolve os dois vazios:** **a bandeja de entrada é um objeto SOBRE
a mesa.** Um presidente não vai a outra sala ler correspondência — a pasta está na mesa dele. Ela
mostra quantas e quais vencem; clicar leva ao Email.

### 7.4 · ⚠ E o adendo dele muda o desenho: o Email vai CRESCER

_"O Email terá mais conteúdo como mídia, notícias, imprensa."_ Isso decide a rota:

| rota                                     | o que acontece                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| ⛔ absorver o Email na mesa              | **morre com o adendo** — jornal e imprensa não cabem num canto da mesa |
| ⭐ **a bandeja na mesa, o Email cresce** | a mesa ganha o contador e o prazo; o Email vira **o mundo falando**    |

⭐⭐ **A recomendação:** a mesa fica com a **bandeja** (quantas, quais vencem, quem assina) e o
Email vira **três colunas** — a correspondência, a imprensa, e o que o Congresso protocolou.
⚠ **E com o jornal dentro, o Email deixa de ser uma caixa de e-mail e passa a ser a sala de
imprensa** — o que provavelmente troca o nome dele no rail.

⚠ **O jornal depende do item 4 do ciclo 19, que depende do item 3** — o mundo protocolando texto.
Hoje **100% dos textos nascem do jogador**, então um jornal noticiaria só você. **Mas o lugar já
pode nascer reservado.**

---

## 8 · ⚖ O QUE EU RECOMENDO, e por que nesta ordem

| #   | o quê                                                                                          | custo | por que aqui                                                |
| --- | ---------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------- |
| 1   | ⭐⭐⭐ **a matéria e a luz** (§3: jacarandá, couro, sombra longa, pé-direito, uma peça grande) | baixo | muda a percepção numa sessão e **não toca em motor nenhum** |
| 2   | ⭐⭐⭐ **o calendário de 48 folhas** (9)                                                       | médio | mata **43,7% do vazio** e entrega o item ⭐⭐⭐ do ciclo 23 |
| 3   | ⭐⭐ **a bandeja na mesa** (§7.3)                                                              | baixo | conserta um defeito de estado, não só de forma              |
| 4   | ⭐⭐ **a antessala** (8)                                                                       | baixo | 8 pessoas com motor pronto, **zero número novo**            |
| 5   | ⭐⭐ **a pasta de despachos** (7)                                                              | médio | reabre o centro para MP, veto e nomeação                    |
| 6   | ⭐ **a assinatura como gesto** (14, 15)                                                        | médio | é o que o jogador vai lembrar                               |
| 7   | as nomeações (20)                                                                              | alto  | ⚠ **abre motor.** É plano próprio                           |

⚠ **E o que sai da mesa:** a faixa de cima com o estado vazio. A promessa vira uma linha no papel
timbrado, e não 58px na primeira linha do olho.

---

## 9 · ⚖ A TRAVA QUE CAIU, e a lição

⛔ **O ciclo 21 dizia _"madeira, couro e papel não entram"_, e essa frase era MINHA.** Ele nunca a
disse. Eu peguei a recusa de **uma cor** — _"esse marrom cor de bosta"_ — e a transformei numa
proibição de três materiais e de uma linguagem visual inteira. Depois citei a proibição de volta
como se fosse decisão dele. **Palavras dele em 05/09:** _"uma coisa que me irrita muito nesse meu
jogo são as travas e limites que você colocou sem eu pedir"_.

⚠ **E o `CLAUDE.md` já tem a regra, com data:** _"limite escrito por mim não é limite… tem coisa
que eu propus, e eu que mando"_. **A frase saiu do ciclo 21 e a matéria está aberta.**

> ⚖ **A pergunta a fazer antes de escrever uma proibição num plano:** _isto é uma medição, uma
> ordem dele, ou uma generalização minha de uma coisa específica?_ **Só as duas primeiras entram.**

---

## 10 · ⛔ O QUE ESTA PESQUISA RECUSA

| pedido                           | por quê                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| **fotografia realista**          | uma foto ao lado de um `<input type=range>` briga                                    |
| **isométrico de jogo mobile**    | ele pediu presidência, e não SimCity                                                 |
| **rosto de pessoa**              | ADR 0003 — um rosto inventado é a cara de alguém                                     |
| **número novo para encher tela** | treze sistemas prontos não aparecem. **Encher com invenção é proibido**              |
| **voltar às 20 leituras**        | o filtro do ciclo 21 estava certo. Falta lugar, e não leitura                        |
| **marrom dessaturado**           | 📐 medido em 22/08: a 0,66 de translucidez ele **vira cinza frio**, e custou 9,7 fps |

---

## 11 · ⚖ A RESTRIÇÃO

1. **Nada aqui inventa número.** Cada peça lê um motor que já roda e já tem prova;
2. **a captura é obrigatória** — é a tela que abre o jogo, e o portão não sabe olhar;
3. ⚠ **a sombra longa e a madeira custam quadro, e há número.** `glass-support` no `.tray__list` custou 17,9 fps
   e `--glass-support-bg` no `.tray__month` custou 28,3 fps **sem filtro nenhum**, porque
   `--light-angle` interpola. **Meça os dois braços na mesma rodada**;
4. ⚠ **cor nova entra como token no par `--x` + `--x-rgb`**, ou a guarda `tokens` reprova. E
   **nenhuma peça nova pode ser vidro dentro de vidro.**
