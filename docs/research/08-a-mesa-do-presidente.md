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

## 3 · 📗 O GABINETE REAL, apurado na web em 05/09/2026

⚠ **Cada linha tem fonte. Nenhuma é dedução.** Ele pediu _"realista e fiel ao gabinete do
presidente do Brasil"_, e a apuração mudou o desenho em três pontos.

### 3.1 · Onde ele fica e do que é feito

📗 O Gabinete Presidencial ocupa o **3º andar do Palácio do Planalto** e é o local de trabalho
do presidente desde 1960. Ele **não é uma sala** — são **três ambientes**: escritório, sala de
reunião e quarto de convidado.

📗 **O que há dentro, nomeado:** a **mesa de despacho do presidente**, uma **mesa circular de 14
lugares**, um conjunto de sofá e poltronas, e um guarda-volumes. O mobiliário é dos anos **1940 a
1960**, em estilo colonial misto brasileiro que remonta ao **DASP da era Vargas**.

📗 **O sofá Navona é de Sergio Rodrigues.** 📗 Na parede, duas telas de **Djanira da Motta e
Silva** — _Colhendo Bananas_ e _Praia do Nordeste_. 📗 **No piso, tapeçaria de Norberto Nicola.**

📗 **E a mesa muda de governo para governo:** a de Oscar e Anna Maria Niemeyer serviu até Médici e
foi aposentada como peça histórica; em 2011 Dilma trocou os sofás por um modelo preto; em 2017
Temer trouxe móveis de JK.

⭐ **O que isso decide no jogo:** a mesa **não é um monólito** — ela é um conjunto de peças
datadas, de autores conhecidos, que cada presidente reorganiza. **É exatamente a estrutura de uma
tela composta**, e ela justifica a mesa ter zonas com dono em vez de uma grade uniforme.

### 3.2 · O palácio inteiro é modernista, e a paleta sai dele

📗 **Fachada de mármore branco**, rampa longa e espelho d'água. 📗 No térreo, poltronas de **Jorge
Zalszupin** e a escultura _Espaço Circular em Cubo_, de Franz Weissmann. 📗 No 2º andar, _Orixás_
de Djanira, mesa de mármore de **Anna Maria Niemeyer** e poltronas **"Beto" de Sergio Rodrigues**.
📗 No 3º, a **"Marquesa" de Oscar Niemeyer** e uma galeria concretista.

📗 **O acervo é Burle Marx, Bruno Giorgi, Di Cavalcanti e Athos Bulcão.**

⭐ **A referência vitoriana está descartada por evidência, e não por gosto:** o gabinete do
presidente do Brasil **não tem mogno escuro, abajur verde nem estante de livros.** Ele é claro,
liso, modernista e cheio de arte concreta.

### 3.3 · ⭐⭐ A MADEIRA É JACARANDÁ-DA-BAHIA, e a textura que ele mandou é exatamente ela

📗 **Sergio Rodrigues usou `jacarandá-da-bahia` (Dalbergia nigra) dos anos 1950 aos 1970** — e o
**couro** é o outro material recorrente dele. 📗 A **Poltrona Mole**, que venceu o concurso de
Cantù em 1961, é **estrutura de jacarandá com tiras de couro**.

📗 **E Jorge Zalszupin dominava o compensado moldado e reaproveitava SOBRAS de jacarandá para
fazer mosaicos geométricos.**

⭐⭐ **A textura que ele escolheu em 05/09/2026 é jacarandá** — veio horizontal ondulado,
avermelhado, de faixa larga. **Ela não é uma escolha estética arbitrária: é a madeira do
mobiliário que está naquela sala.**

⚠ **E ela não entra como fotografia.** Foto de banco de imagens tem dono, peso e não escala. **O
veio é gerado**: turbulência assimétrica em SVG — frequência baixa no eixo X e alta no Y produz a
listra horizontal ondulada —, deslocada sobre um padrão de faixas. 📐 **Quatro tentativas foram
provadas em `tmp/madeira.html`**, e a que passou tem `baseFrequency 0,0022 × 0,045`, 5 oitavas e
deslocamento 52.

📐 **Duas coisas medidas na hora de aplicar:**

1. ⛔ **a borda sai serrilhada** se o retângulo tiver o tamanho do `viewBox` — o deslocamento
   empurra a pintura para fora. **Desenhe o retângulo maior que o quadro**;
2. ⛔ **a madeira crua é clara demais para ser fundo de interface.** O texto branco não lê sobre
   ela. **O véu escuro por cima é a decisão inteira:** pouco véu e a tela fica ilegível; muito véu
   e a matéria vira uma mancha marrom. Ficou em 0,60 no topo e 0,78 no pé, e o painel o gira.

### 3.4 · ⭐⭐ ATHOS BULCÃO — o padrão que o Brasil já inventou

📗 Os grafismos de Athos Bulcão estão **no próprio Palácio do Planalto**, no Congresso e na
Catedral. 📗 **O painel do Planalto é verde e azul.**

📗 **E a gramática dele é combinatória:** azulejos com **três padrões geométricos e uma cor além
do branco**, recombinados. O desenho ia para a fábrica com **números de cor de uma paleta que ele
mesmo criou**.

⭐⭐⭐ **Isto é o achado visual desta pesquisa, e ele cai exatamente no vocabulário deste
projeto:** um padrão de **três módulos recombinados** é gerado, e não desenhado — **determinístico
da semente**, como todo o resto do jogo. **Nenhum jogo de política se parece com isso**, e é o
brasileiro mais reconhecível que existe sem ser clichê de país tropical.

⚠ **Onde ele entra é decisão dele**, e a candidata natural é a **parede atrás da mesa** — o lugar
onde o padrão vive na sala real.

---

## 4 · 📗 O PAPEL DO GOVERNO, e ele tem NORMA ESCRITA — apurado em 05/09/2026

⭐ **Melhor que fotografia: o governo publica as regras.** O **Manual de Redação da Presidência da
República**, 3ª edição, define fonte, corpo, margem, espaçamento e estrutura de todo documento
oficial. **Nada abaixo é invenção — é a norma, com o artigo ao lado.**

### 4.1 · A folha

| o quê                       | a norma                                                                 |
| --------------------------- | ----------------------------------------------------------------------- |
| papel                       | **A4 — 29,7 × 21 cm**, e a proporção 1 : 1,414 também é norma           |
| ⭐ margem esquerda          | **no mínimo 3 cm**                                                      |
| ⭐ margem direita           | **1,5 cm**                                                              |
| margens superior e inferior | 2 cm                                                                    |
| área de cabeçalho           | **5 cm** do topo, só na primeira página                                 |
| cor                         | **texto preto em papel branco**                                         |
| destaque                    | só **negrito**. ⛔ Sem itálico, sublinhado, maiúsculas, sombra ou borda |
| estrangeirismo              | em itálico                                                              |

⭐⭐ **A ASSIMETRIA DAS MARGENS É O DETALHE QUE MAIS DENUNCIA UM DOCUMENTO FALSO.** 3 cm de um
lado e 1,5 do outro — ninguém repara até ver os dois lado a lado, e todo documento fabricado
por instinto sai simétrico.

### 4.2 · O tipo

| o quê                    | a norma                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| fonte                    | **Calibri ou Carlito**                                            |
| corpo do texto           | **12 pontos**                                                     |
| citação recuada          | 11 pontos                                                         |
| nota de rodapé           | 10 pontos                                                         |
| espaçamento entre linhas | **simples**                                                       |
| entre parágrafos         | **6 pontos** depois de cada um                                    |
| recuo de parágrafo       | **2,5 cm** da margem esquerda                                     |
| numeração de parágrafos  | só quando há **três ou mais**, e **nunca** o vocativo nem o fecho |

### 4.3 · ⭐⭐⭐ O TIMBRE DO PRESIDENTE É EM RELEVO SECO, E ISSO É LEI

📗 **Manual §5.1.1, nota 3:** _"no caso de documento a ser impresso, **exclusivamente quando o
signatário for o Presidente da República**, Ministro de Estado ou a autoridade máxima de
autarquia, será utilizado **timbre em relevo branco**"_ — nos termos do **Decreto nº 80.739, de 14
de novembro de 1977**.

⭐⭐⭐ **O papel do presidente não tem brasão impresso: tem relevo.** Sem tinta, sem cor —
aparece pela luz rasante, sombra de um lado e realce do outro. **É a distinção física que separa
o documento dele de todos os outros do governo**, e ela é a mesma ideia que a §5 desta pesquisa
já tinha proposto por estética. **Aqui ela vira fidelidade.**

### 4.4 · As partes, na ordem

📗 **Cabeçalho** — brasão no topo, nome do órgão principal, depois os secundários **da maior para
a menor hierarquia**, entrelinhas simples, centralizado.

📗 **Epígrafe** — tipo do expediente **por extenso e em maiúsculas**, `Nº` abreviado, alinhada à
margem esquerda: `OFÍCIO Nº 652/2018/SAA/SE/MT`.

📗 **Local e data** — alinhados à **margem direita**, mês em **minúscula**, **sem a sigla da UF**,
**sem zero à esquerda** no dia, e com **ponto-final**: `Brasília, 2 de fevereiro de 2018.`

📗 **Fechos — e há só dois no governo inteiro:** **`Respeitosamente,`** para autoridade de
hierarquia superior à do remetente, **inclusive o Presidente da República**; **`Atenciosamente,`**
para os demais. ⭐ **Toda carta que chega à mesa do presidente termina em "Respeitosamente"** — ele
é o topo da hierarquia, e essa palavra sozinha diz isso.

📗 **Signatário** — nome em **maiúsculas, sem negrito e sem linha acima**; cargo com iniciais
maiúsculas; tudo centralizado. ⭐ **E há uma exceção, que é a mais bonita:** _"excluídas as
comunicações assinadas pelo Presidente da República, todas as demais devem informar o
signatário"_. **O ato dele é o único que dispensa nome e cargo — a rubrica basta.**

### 4.5 · E o decreto tem uma forma própria, verificada num ato real

📗 Conferido no **Decreto nº 664, de 1º de outubro de 1992**:

```
DECRETO Nº 664, DE 1º DE OUTUBRO DE 1992.

                          Revoga o Decreto nº 323, de 1º de novembro de 1991.

O PRESIDENTE DA REPÚBLICA, no uso das atribuições que lhe confere o art. 84,
inciso IV, da Constituição, DECRETA:

Art. 1º  Fica revogado o Decreto nº 323, de 1º de novembro de 1991.
Art. 2º  Este Decreto entra em vigor na data de sua publicação.

Brasília, 1º de outubro de 1992; 171º da Independência e 104º da República.

FERNANDO COLLOR
Marcílio Marques Moreira
```

⭐ **A ementa fica recuada à direita**, ocupando a metade da largura — é o que faz o olho
reconhecer um ato normativo à distância.

⭐⭐ **E o fecho conta os anos da Independência e da República**, em ordinal: 1992 saiu como
`171º da Independência e 104º da República`. 📐 **A conta é `ano − 1822 + 1` e `ano − 1889 + 1`**,
conferida contra o ato real. **Para janeiro de 2027 o decreto do jogo fecha em `206º da
Independência e 139º da República`** — e é o tipo de detalhe que ninguém sabe e todo brasileiro
reconhece.

📗 **E o rodapé traz sempre:** _"Este texto não substitui o publicado no D.O.U. de …"_

### 4.6 · ⭐⭐⭐ A REGRA QUE ELE DECIDIU: a forma é do governo, a escrita é do jogo

**Ordem dele em 05/09/2026, depois de ver o decreto pronto:** _"gostei… porém só achei meio difícil
de entender o que está escrito. **A única coisa que vamos fugir do realismo é isso, simplificar um
pouco a escrita, até porque é um jogo.**"_

⭐ **É a única concessão, e ela tem uma fronteira nítida:**

| fica **fiel** ao governo                               | vira **português normal** |
| ------------------------------------------------------ | ------------------------- |
| a folha A4 e as margens 3 cm / 1,5 cm                  | a ementa                  |
| o timbre em relevo seco                                | o preâmbulo               |
| a hierarquia dos órgãos no cabeçalho                   | o texto dos artigos       |
| a epígrafe em maiúsculas, e a ementa recuada à direita | —                         |
| `Art. 1º`, `Art. 2º` e a cláusula de vigência          | —                         |
| o fecho com os anos da Independência e da República    | —                         |
| a nota do D.O.U.                                       | —                         |

📐 **O mesmo artigo, nas duas escritas:**

> **Como o governo escreve:** _"Ficam estabelecidos os limites de movimentação e empenho constantes
> do Anexo I, honrado o percentual de 100% do empenho solicitado, sobre a margem de R$ 14,1 bi."_
>
> ⭐ **Como o jogo escreve:** _"O mês tem R$ 14,1 bi para gastar. Os ministérios recebem 100% do que
> pediram."_

⭐ **E isso não é uma exceção ao projeto — é a regra dele aplicada ao papel.** O `CLAUDE.md` já
manda escrever como gente: frase curta, sujeito e verbo na ordem normal, número no lugar do
adjetivo. **O decreto obedecia ao manual do governo e desobedecia ao manual do jogo.**

⚠ **O que NÃO se simplifica, e é o teste:** se a frase é a que todo brasileiro reconhece, ela
fica. _"Este Decreto entra em vigor na data de sua publicação"_ é reconhecimento, e não juridiquês
— trocá-la por "vale a partir de hoje" perderia mais do que ganharia.

⭐ **O texto corrido venceu o recuo**, também por escolha dele: os 2,5 cm do manual empurram cada
parágrafo para dentro e a folha fica difícil de varrer. **A norma manda; o jogo lê.**

### 4.7 · ⛔ SEM MARCAS DE USO — decisão dele, e o papel fica limpo

**Ordem dele em 05/09/2026:** _"eu disse que não queria marcas de uso nem aquele URGENTE"_.
**Saíram o carimbo, a orelha dobrada e o clipe**, com os controles que os giravam.

⭐ **E a decisão tem lógica além do gosto:** carimbo e orelha contam uma história de manuseio que
o jogo não tem — nenhum papel do Gabinete passou por escaninho nenhum, e a marca de uso num
documento que acabou de ser impresso é ficção sem lastro. **O realismo aqui é o papel limpo.**

### 4.8 · 📐 O QUE A OTIMIZAÇÃO ACHOU, e são duas coisas medidas

⛔ **Havia TRÊS cópias do gerador de madeira** — uma em cada bancada (`mesa`, `perspectiva`,
`papel`). É o defeito mais caro deste projeto, e ele apareceu pela sexta vez. As três viraram
`tmp/materia.mjs`, com `jacaranda()`, `fibra()` e o ajuste padrão do veio num lugar só.

📐 **E `encodeURIComponent` codifica o que não precisa:** espaço vira `%20`, aspas viram `%22`, e
um SVG de 968 bytes sai com **1562**. Trocando aspas dupla por simples e escapando só o que o
data URI exige, ele sai com **1068**. **31,6% a menos**, e a economia vale para toda superfície
gerada do projeto.

| superfície         | tamanho     |
| ------------------ | ----------- |
| a madeira do tampo | **1,1 KB**  |
| a fibra do papel   | **0,33 KB** |
| total              | **1,4 KB**  |

⭐ **E as duas são rasterizadas uma vez** — nenhuma anima, nenhuma depende de `--light-angle`.
**Este é o ponto que separa a matéria nova do risco de fps**: o que custou 28,3 fps no
`.tray__month` foi um fundo que interpolava a cada quadro.

📐 **E a folha foi conferida contra o A4:** `665 / 470 = 1,4149` contra `29,7 / 21 = 1,4143` — **0,04%
de erro**. ⚠ **A medição de fora dá 1,4006 e isso NÃO é defeito:** `getBoundingClientRect` devolve
a caixa envolvente do elemento já girado, e a previsão matemática do giro de 0,8° bate em 0,3px.

### 4.9 · ⭐⭐ O JACARANDÁ REFEITO — cinco camadas, e nenhuma repete

⛔ **A primeira tábua usava um `<pattern>` de passo fixo, e era o defeito inteiro:** as faixas
repetiam a cada **64px exatos**, e o olho pega a repetição antes de reconhecer a madeira.
**Ordem dele:** _"falta realismo, aleatoriedade, falta parecer madeira de verdade"_.

⭐ **A tábua agora tem cinco camadas, e cada uma conserta uma coisa:**

| camada                                     | o que ela conserta                                            |
| ------------------------------------------ | ------------------------------------------------------------- |
| **as faixas** de alturas sorteadas         | a persiana. Uma tábua de faixas iguais não é madeira          |
| **a linha de anel**, de espessura variável | linha de espessura constante é a assinatura de textura gerada |
| **os poros** — traços curtos e finos       | é o que separa madeira nobre de MDF pintado                   |
| **o arco central** — o _cathedral_         | é o que a serra faz ao passar perto do miolo da tora          |
| **o grão fino**                            | a aspereza da superfície                                      |

⚠ **O SORTEIO É DETERMINÍSTICO**, e isso é a regra do projeto aplicada à textura: nada de
`Math.random`. Mesma semente, mesma tábua — uma tábua que se refizesse a cada repintura piscaria
quando o painel girasse qualquer outro valor.

⚠ **E o grão fica FORA do deslocamento.** Passado pelo mesmo filtro do veio, o ruído fino vira
borrão: ele é aspereza, e não desenho.

⛔ **O BUG QUE ISSO CUSTOU, e a lição vale para todo SVG gerado do projeto:** eu pré-escapei `#`
como `%23` dentro do gerador, e `svgUrl` escapa `%` **antes** de `#` — então `%23` virou `%2523` e
voltou como `%23`, que não é cor. **Todo `fill` caiu para o preto inicial do SVG e a tábua saiu
chapada de preto.** A regra ficou escrita na função: **quem chama não pré-escapa nada.**

### 4.10 · ⚠ A tensão que sobra, e ela é decisão dele

📗 **A norma manda texto preto em papel branco.** ⚠ **E o `standards.md` do projeto diz que papel
branco em ambiente escuro é um buraco de luz.** As duas estão certas no terreno delas. **O
provador `tmp/papel.html` deixa a claridade da folha num controle** — 97% é quase branco, e dá
para descer sem perder a fidelidade.

---

## 5 · ⭐⭐⭐ A TESE VISUAL — o modernismo brasileiro, e ele TEM matéria

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

⭐⭐ **E O TETO DE MATÉRIA NÃO EXISTE — palavras dele em 05/09/2026:** _"se eu quiser construir uma
literal MESA, linda, no gabinete, eu posso, sem qualquer resquício de liquid glass nela… a base é
liquid glass, mas se eu quiser ousar, eu posso"_. **O liquid glass é o ponto de partida do
projeto, e não o teto desta tela.** Uma mesa que não tenha uma única superfície de vidro é uma
saída legítima, e ela nem precisa de justificativa técnica: precisa passar na captura e no fps.

---

## 6 · ⭐⭐ AS IDEIAS — O QUE FICA SOBRE A MESA

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

## 7 · ⭐ AS IDEIAS — O GESTO

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

## 8 · AS IDEIAS — O REALISMO BRASILEIRO

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

## 9 · ⭐⭐⭐ O EMAIL E O GABINETE — a resposta

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

## 10 · ⚖ O QUE EU RECOMENDO, e por que nesta ordem

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

## 11 · ⚖ A TRAVA QUE CAIU, e a lição

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

## 12 · ⛔ O QUE ESTA PESQUISA RECUSA

| pedido                           | por quê                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| **fotografia realista**          | uma foto ao lado de um `<input type=range>` briga                                    |
| **isométrico de jogo mobile**    | ele pediu presidência, e não SimCity                                                 |
| **rosto de pessoa**              | ADR 0003 — um rosto inventado é a cara de alguém                                     |
| **número novo para encher tela** | treze sistemas prontos não aparecem. **Encher com invenção é proibido**              |
| **voltar às 20 leituras**        | o filtro do ciclo 21 estava certo. Falta lugar, e não leitura                        |
| **marrom dessaturado**           | 📐 medido em 22/08: a 0,66 de translucidez ele **vira cinza frio**, e custou 9,7 fps |

---

## 13 · ⚖ A RESTRIÇÃO

1. **Nada aqui inventa número.** Cada peça lê um motor que já roda e já tem prova;
2. **a captura é obrigatória** — é a tela que abre o jogo, e o portão não sabe olhar;
3. ⚠ **a sombra longa e a madeira custam quadro, e há número.** `glass-support` no `.tray__list` custou 17,9 fps
   e `--glass-support-bg` no `.tray__month` custou 28,3 fps **sem filtro nenhum**, porque
   `--light-angle` interpola. **Meça os dois braços na mesma rodada**;
4. ⚠ **cor nova entra como token no par `--x` + `--x-rgb`**, ou a guarda `tokens` reprova. E
   **nenhuma peça nova pode ser vidro dentro de vidro.**

---

## Fontes — apuradas em 05/09/2026

- [Gabinete Presidencial (Brasil)](<https://pt.wikipedia.org/wiki/Gabinete_Presidencial_(Brasil)>)
- [Palácio do Planalto](https://pt.m.wikipedia.org/wiki/Pal%C3%A1cio_do_Planalto)
- [Como é o Palácio do Planalto por dentro](https://www.correio24horas.com.br/brasil/como-e-o-palacio-do-planalto-por-dentro-conheca-a-sede-da-presidencia-da-republica-0626)
- [Mesa de JK no Planalto deve passar por restauração](https://www.cnnbrasil.com.br/politica/mesa-de-jk-no-planalto-deve-passar-por-restauracao-e-ser-aposentada/)
- [Brasília de Athos Bulcão: azulejos gráficos moldam a identidade da capital](https://www.cnnbrasil.com.br/viagemegastronomia/cultura/brasilia-de-athos-bulcao-azulejos-graficos-moldam-a-identidade-da-capital/)
- [Fundação Athos Bulcão](https://www.fundathos.org.br/noticia/304)
- [Athos Bulcão: aproximação entre arte e arquitetura](https://www.archdaily.com/pt//877687/athos-bulcao-aproximacao-entre-arte-e-arquitetura)
- [Sergio Rodrigues — Arquivo Contemporâneo](https://arquivocontemporaneo.com.br/designer/88/Sergio-Rodrigues/)
- [Manual de Redação da Presidência da República, 3ª ed.](https://www4.planalto.gov.br/centrodeestudos/assuntos/manual-de-redacao-da-presidencia-da-republica/manual-de-redacao.pdf)
- [Decreto nº 664, de 1º de outubro de 1992 — a forma de um decreto real](http://brasil.justia.com/nacionales/decretos/664-de-1o-10-92/gdoc/)
- [Designers do mobiliário moderno brasileiro](https://www.loraronco.com.br/post/modernariato-lora-ronco-designers-do-mobili%C3%A1rio-moderno-brasileiro-introdu%C3%A7%C3%A3o)
