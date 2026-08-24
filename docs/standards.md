# Padrões do projeto

Este documento é a fonte das convenções. Ele não descreve intenção: quase tudo o
que está aqui tem uma guarda executável ao lado, e o que **não** tem está marcado
como tal — documentação que promete cobertura inexistente é pior que documentação
nenhuma, porque a próxima sessão confia nela.

## 1. As convenções travadas

Para cada eixo existe **uma** forma, e a segunda é recusada por guarda.

| eixo                | a forma única                                        | proibido                               | cobrado por                 |
| ------------------- | ---------------------------------------------------- | -------------------------------------- | --------------------------- |
| módulos             | ESM, `.mjs`, exports nomeados                        | CommonJS, `export default`             | `naming`                    |
| nome de arquivo     | `kebab-case` minúsculo, sem acento                   | `camelCase`, `PascalCase`              | `naming`                    |
| idioma              | inglês em código e caminhos; português em prosa e UI | identificador acentuado                | `naming` (parcial — ver §6) |
| cor                 | token no arquivo de tokens, no par `--x` + `--x-rgb` | literal fora dos tokens; `color-mix()` | `tokens`                    |
| superfície          | uma das três lâminas                                 | `backdrop-filter` fora do material     | `material`                  |
| raio, espaço, corpo | valor da escala, derivado de um número raiz          | número cru numa regra                  | revisão                     |
| comentário          | lição medida, até 10 linhas por bloco                | diário: data, citação, histórico       | `prose`                     |
| cascata             | camadas declaradas por `@layer`                      | regra fora de camada; `!important`     | `cascade`                   |
| movimento           | tokens de duração e curva + rede global              | `animation: none`; animação inline     | `motion`                    |
| aleatoriedade       | fluxo injetado, próprio de cada motor que sorteia    | `Math.random` no domínio               | `boundaries`                |
| identidade          | separada dos atributos; motor compara por `id`       | comparação por nome                    | `identity`                  |
| dado editável       | esquema ao lado da coleção, validado por `catalog`   | esquema fora de `src/data/`            | `schema` + suite            |

## 2. Estrutura

```
index.html · app.mjs        entrypoint: composição e wiring, nunca cálculo
styles/                     seis camadas, na ordem que o nome declara
vendor/fonts/               Inter e Source Serif 4, sob SIL OFL — 226KB, sem rede
src/data/                   catálogo; `catalog.mjs` indexa todo dado do projeto
src/domain/                 os motores, funções puras
src/state/                  estado imutável e o reducer
src/application/            turno, persistência, efeitos
src/public/                 a composição que todo consumidor usa
src/ui/                     views puras: recebem dado, devolvem string
tests/                      run.mjs · lib/ · guards/ · suites/ · browser/
tools/                      geradores, servidor, simulador de mandato
docs/                       handoff.md (a retomada, curta) · journal.md (o histórico)
                            adr/ · cycles/ · research/
CLAUDE.md                   as regras que o agente lê antes de tudo
```

## 3. Os motores

Ordem de resolução de um turno (mês). Apenas **TEMPORAL** e **ECLUSA** consomem
aleatoriedade, cada um com fluxo próprio derivado da seed da partida.

| codinome     | módulo                    | o que recebe                                                | o que devolve                                               |
| ------------ | ------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| **TEMPORAL** | `src/domain/events/`      | estado do turno, catálogo, fluxo de RNG                     | evento disparado, com efeitos e duração                     |
| **ECLUSA**   | `src/domain/congress/`    | bancadas, proposta, moeda oferecida, histórico de barganha  | votos por bancada, resultado, custo pago, ressentimento     |
| **MALHA**    | `src/domain/capacity/`    | índices por área, alocação do mês, impacto das aprovações   | índices novos, histórico, pressão em receita e despesa      |
| **CASCATA**  | `src/domain/propagation/` | efeitos vigentes com defasagem, estado atual                | delta do mês por indicador                                  |
| **CORRENTE** | `src/domain/economy/`     | estado macro, carga tributária, capacidade, impulso fiscal  | PIB, potencial, inflação, juro, desemprego, população       |
| **LASTRO**   | `src/domain/budget/`      | receita e despesa, obrigatório × discricionário             | saldo, dívida/PIB, espaço discricionário                    |
| **SONDA**    | `src/domain/opinion/`     | indicadores divulgados, eventos, histórico                  | aprovação por segmento                                      |
| **ESTRATO**  | `src/domain/norms/`       | as normas escritas, as alavancas, o mês, os indicadores     | a faixa vigente de cada alavanca; o que dorme, e por quê    |
| **ELENCO**   | `src/domain/cast/`        | os blocos, os arquétipos, o vocabulário de nomes, a semente | as pessoas do mandato, a memória de cada uma e o preço dela |
| **CALDEIRA** | `src/domain/pressure/`    | a pressão de cada grupo, o descontentamento do mês e a rua  | a pressão nova, e se as três rupturas estão abertas juntas  |
| **DELTA**    | `src/domain/graph/`       | catálogo de ligações, estado, deltas                        | nós e arestas com peso e sinal                              |

O codinome é como o responsável cita o motor. Ele vive no cabeçalho do módulo e
nesta tabela, e **não** aparece em código executável — no código existe um nome
só, o funcional. `codenames` prova a correspondência 1:1 nas duas direções.

**Motor nenhum chama outro motor.** Quem os compõe é `src/application/turn.mjs`,
e a ordem em que ele os chama é a mecânica do jogo, não detalhe de organização:
o orçamento resolve antes da votação porque a votação usa a verba **paga**, e uma
ordem invertida faria promessa comprar voto — o que transforma o orçamento num
placar que o jogador só lê depois de já ter decidido. A camada de aplicação
compõe e devolve o resultado pronto; o reducer apenas o dobra no estado.

## 4. O sistema visual

**Um material, três densidades.** Desfoque, saturação e borda são os mesmos em
toda a tela; o que distingue os níveis é a densidade do fundo, porque o que eles
expressam é **papel**:

| classe           | papel                                            |
| ---------------- | ------------------------------------------------ |
| `.glass-stage`   | a peça central da tela — a que carrega o assunto |
| `.glass-action`  | o que se pressiona                               |
| `.glass-support` | informação que não se toca                       |

Nível **não** pode significar raio de desfoque: três desfoques são três
materiais. A peça central usa a pilha de três camadas — campo (`::before`),
lâmina (`::after`, onde vive o filtro), conteúdo acima — porque com o filtro no
próprio contêiner qualquer cor pintada pelos filhos fica **sobre** o material.

**`backdrop-filter` custa, e o custo é por tela.** A condição que o torna
aceitável é superfície pequena sobre fundo **estático**. Antes de levar o
material a uma tela nova, meça o fps dela com braço de controle sem filtro — e
com GPU e vsync ligados, porque em rasterização por software os dois braços caem
juntos e o número não diz nada.

**Um fio claro por aresta, e ele é a `border`.** Toda superfície de vidro declarava
`border` **e** um bisel com realce de cima, e os dois caem em pixels vizinhos: medido
no ofício da Caixa de Entrada, `77,72,66` da borda encostado em `78,77,75` do realce —
um fio de 2px para dizer uma fronteira. `--bevel-under` é o bisel de quem já tem borda:
só a sombra de baixo, que não duplica nada. Quatro tokens de sombra viraram um.

**Uma lâmina por tela.** As peças de dentro são linhas e seções, não cartões: um
contorno por informação é peso repetido, e peso repetido é ruído. Vidro dentro de
vidro são dois materiais empilhados para dizer uma coisa só.

**Duas substâncias, e a fronteira é a regra inteira:**

> **vidro** = a máquina do Estado · **papel** = o texto de registro

Uma lei e uma carta não são superfícies da máquina: são o que ela **produz**. No dia
em que o papel aparecer num cartão de resumo ou num botão, ele deixa de ser legenda e
vira a segunda paleta que o sistema visual existe para impedir. Ele não é branco —
pergaminho à meia luz, quente onde tudo é frio; papel branco em ambiente escuro é um
buraco de luz.

**Três famílias tipográficas, e três é o teto:**

| token            | o que ela diz                           | exemplo                     |
| ---------------- | --------------------------------------- | --------------------------- |
| `--font-record`  | o que se **assina** — texto de registro | nome de norma, de pessoa    |
| `--font-display` | o que se **mede** — valor               | placar, índice, sinal vital |
| `--font-machine` | o que a máquina do Estado **carimba**   | selo de rito, etiqueta      |

A serifa é **opt-in**, nunca padrão de corpo: implementada como herança, ela vaza
para unidade de controle, nota de cartão e prosa de estado vazio, e metade da
interface sai serifada sem ninguém pedir. `[data-numeric]` força `--font-display` em
`10-base.css`, então um número é sans mesmo dentro de prosa serifada — convenção
tipográfica que depende de alguém lembrar diverge no terceiro componente.

**Uma medição de carimbo não é um carimbo.** Vestir um índice de mono porque a mono é
bonita inverte a regra no dia em que ela nasce.

**Todo tamanho de texto passa pela escala.** Um degrau novo digitado direto no
componente parece inofensivo — são 0,02rem — e é assim que uma escala vira uma lista
de exceções que ninguém consegue mais revisar. Exceção existe, e é **declarada na
prosa do arquivo**: hoje há uma, a escada de Finanças, que é geometria e não texto.

**A cor da marca é a cor do que se PRESSIONA** — uma cor, um lugar. Ela veste o botão
de avançar, o selo de emenda, o anel de quem preside e a ação da carta. Gastá-la num
controle que se **arrasta** a dilui, e diluída ela deixa de apontar. E **contraste se
mede antes de fechar o tom**, no par renderizado e não no par teórico: se a medição
reprovar, o conserto é clarear a **tinta** sobre a cor, não abandonar o tom —
abandonar seria deixar a aritmética decidir a estética.

**Dado que a tela escreve, a folha consome.** Uma custom property escrita inline por
uma view é um **canal**: se nenhum seletor a lê, ela é dado morto, e o defeito é
invisível — nada falha, a informação apenas não chega. É a família inversa da folha
órfã, e custou o achado da régua legal.

⚠ **E uma classe não vence um seletor de atributo.** `.dial__slider` é (0,1,0) e
`input[type="range"]` é (0,1,1): a regra da classe perde, e perde **em silêncio**, sem
erro em tipo, guarda ou prova. Ao estilizar um elemento que já tem regra por
atributo, escreva `input[type="range"].minha-classe`.

## 5. A tela

**A tela não refaz conta do motor — ela pergunta.** Toda leitura que a interface
mostra enquanto o jogador decide sai da mesma função que o turno vai executar
(`forecast`, `settlement`, `ledger`). Conta refeita por fora é conta que
diverge, e a divergência aparece justamente no caso extremo, que é o caso em que
o jogador precisava do número.

⚠ **E oferecer a porta certa não basta: é preciso FECHAR a errada.** O defeito
recorrente deste projeto — encontrado quatro vezes — é **dois lugares montando a
mesma pergunta**, e enquanto a porta errada estiver na fachada, alguém entra por ela.
Foi por isso que `whipCount` e `dispersion` saíram de `src/public/index.mjs`: a tela
remontava uma câmara de quatro blocos enquanto o turno votava com onze bancadas, e
**27,2% dos vereditos anunciados eram o inverso do que o mês produzia**.

**A previsão usa o que será PAGO, nunca o prometido.** É a mesma regra do
acoplamento, do outro lado: se a Mesa prevê com a promessa, ela anuncia um placar
que o turno não produz no mês em que o caixa não cobre.

**Informação que chega depois da decisão não é informação — é recibo.** O que muda o
preço de uma jogada tem de estar legível **antes** de o jogador fazê-la: o trilho diz
onde a lei para enquanto ele arrasta, e não depois de ele ter atravessado.

**O que ESPERA é estado; o que FECHA é leitura.** A carta que pede resposta mora em
`state.mail`, porque ela atravessa meses; o fechamento do mês não mora em lugar nenhum,
porque ele se refaz do relatório. Guardar o segundo obrigaria o save a carregar 48
relatórios para reescrever um texto que o turno já sabe produzir.

**Guarda-se o FATO, nunca a prosa.** A carta no estado não tem texto — quem escreve é
a view. Guardar o texto renderizado seria a quinta ocorrência de "dois lugares
montando a mesma pergunta".

**Decisão do jogador entre turnos é ORDEM, e não mutação à parte.** Responder uma carta
não mexe no estado na hora do clique: ela entra em `orders` e o mês resolve. ⚠ A razão
é concreta — **o vencimento acontece dentro do turno**, e uma resposta fora dele criaria
dois caminhos mutando a mesma carta, com o resultado dependendo de qual chegasse
primeiro no mês em que o prazo fecha.

**O silêncio é uma resposta, e ela é anunciada antes.** Ignorar é uma jogada com preço,
e nunca uma impossibilidade: **o turno não se bloqueia por nada**. Bloquear o avanço
não torna a carta importante — torna-a obstáculo de fluxo, e mata a jogada de deixar
uma vencer para cuidar de outra.

**Custo se mostra, muro não se desenha.** _"Tudo tem preço, nada tem muro"_ vale
também na tela: nada de hachura de perigo nem de zona bloqueada, porque um controle
que **parece** travado ensina que a lei é um limite da interface.

⚠ **E o muro também se escreve em ARITMÉTICA.** `spent <= cash` não parecia um `if
(proibido) return`, e era: o empenho preso ao caixa fazia o saldo primário dar ZERO em
toda jogada, e um governo que punha os 38 programas no máximo fechava o mês igual a um
que não fazia nada. **Uma desigualdade sem lei atrás é um muro disfarçado de conta.**
O teto do arcabouço ficou, e a distinção é a regra: ele é norma, com rito para mudar;
o caixa não tinha nada atrás.

**Número que vai para dentro de atributo não passa pela função de leitura.**
`num` escreve vírgula decimal; vírgula em `max`, `min`, `value` ou `step` é valor
inválido, e o navegador descarta o atributo **em silêncio** e usa o padrão dele.
Para atributo existe `attr`, e `tests/suites/screens.mjs` cobra isso em toda tela.

**Toda view traz o próprio elemento de fora.** O entrypoint concatena e aplica;
ele não decide forma. Quem desenha uma tela não precisa saber que a lâmina dela
mora em outro arquivo.

**Ausência não é resultado.** Sem pauta não há placar, e não há veredito verde ou
vermelho: mostrar `—` no maior degrau da escala ocupa a tela inteira para dizer
"nada", e vestir uma instrução de aprovada ensina o sinal errado.

**Densidade é ruído onde há decisão, e serviço onde não há.** Toda tela que pede
uma escolha é enxuta: cada número a mais disputa com a decisão. Finanças é a
única densa do projeto, e pode ser porque ninguém decide nada nela — a ausência de
controle é a informação principal dela, e a forma diz isso antes do texto (fio de
separação em vez de pastilha, sem raio, sem hover, sem transição).

**Toda escala de desenho é declarada, nunca derivada da série.** A escada de
tendência recebe a régua por parâmetro: normalizar pelos próprios pontos desenha
drama quando nada acontece, e usar a régua errada desenha calmaria quando tudo
acontece — inflação e juro passaram semanas no degrau do chão porque eram lidos
numa régua de 0 a 100.

**Número que muda de ordem de grandeza muda de unidade.** `R$ 12227,1 bi` ao lado
de `R$ 33,5 bi` obriga a contar dígitos; `money` vira para trilhão sozinha, com
uma casa a mais para a troca não custar precisão.

**Cor e texto contam a mesma história.** Onde a leitura arredondada mostra zero, o
tom é neutro — um `−0,4` que imprime "0" e pinta de vermelho faz a cor negar o
número ao lado dela.

## 6. As guardas

| guarda       | impede                                                                                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material`   | segundo material; filtro fora do arquivo de material; falta do par `-webkit-`; sumiço do aviso de fps                                                                                                     |
| `tokens`     | literal de cor solto; `color-mix`; par hex/rgb divergente; `var()` órfão; token sem consumidor                                                                                                            |
| `cascade`    | regra fora de camada; `!important`; ordem de carregamento errada; `motion` deixar de ser a última                                                                                                         |
| `motion`     | rede incompleta; `animation: none`; falta de alcance a pseudo-elementos e View Transitions; animação inline                                                                                               |
| `boundaries` | entrypoint alcançando o domínio; domínio com DOM, relógio ou RNG ambiente; dependência de teste vazando                                                                                                   |
| `naming`     | `.js`; nome fora do padrão; CommonJS; `export default`; identificador acentuado                                                                                                                           |
| `codenames`  | motor sem codinome, codinome sem motor, codinome no código                                                                                                                                                |
| `identity`   | coleção com rótulo e sem `id`; `id` repetido; motor comparando por nome                                                                                                                                   |
| `schema`     | módulo de dado sem esquema; esquema que o catálogo nunca valida; esquema fora de `src/data/`                                                                                                              |
| `orphans`    | regra de estilo que nenhum HTML pinta — folha órfã, e o bloco morto cujo elemento sobrou                                                                                                                  |
| `prose`      | bloco acima do teto (10 no corpo, 14 no cabeçalho); **data** em comentário; bloco que **para no meio de uma frase**; e o `--token`, `.classe` ou `arquivo.mjs` citado em prosa que o projeto não tem mais |
| `vocabulary` | a mesma frase da interface teclada duas vezes; e a frase declarada que **nenhum arquivo alcança** — 49 delas em 21/08/2026                                                                                |

Cada guarda carrega **provas sintéticas** que reintroduzem o defeito e exigem
acusação. O runner as executa junto da auditoria real.

⚠ **E o portão tem uma SEGUNDA PERNA desde 23/08/2026, que não mora em
`tests/guards/`:** o passeio (`tests/browser/walk.mjs`) entrou no `validate`. As doze
guardas leem TEXTO — arquivo, seletor, literal —, e nenhuma delas abre um navegador;
o passeio mede **geometria e pixel**: rolagem da página, conteúdo cortado dentro do
próprio recorte, peça desenhada por cima de peça, e contraste no par renderizado. A
razão de ele ter entrado é uma assimetria medida — motor e tela têm 8.007 e 9.601
linhas, e as provas eram **207 contra 29**. Custo: o portão foi de 9s para 42s.

## 7. O que ainda NÃO tem guarda

Declarado para não ser confundido com cobertura:

- **idioma dos identificadores.** `naming` cobre acento, extensão e forma; a
  regra inglês/português depende de revisão. Um casador honesto não existe — ele
  acusaria `selic` e `ipca`, que são nomes próprios e ficam no original por
  decisão;
- ⚠ **`orphans` PASSOU A EXISTIR em 16/08/2026**, e ela achou **quatro regras órfãs no
  primeiro minuto** — inclusive uma criada naquela mesma sessão. O achado 5 ficou aberto
  por seis sessões e custou **500 linhas** medidas, em duas varreduras feitas à mão.
  ⚠ **Ela mede uma direção só**: classe na folha sem produtor em `src/`, `app.mjs` ou
  `index.html`. Classe no HTML sem regra **não** é acusada — ela é gancho legítimo para
  o passeio e para a suíte de telas. E `data-*` fica de fora porque é ESTADO: um
  `[data-boiling="true"]` pode passar meses sem acontecer e continuar correto;
- ⚠ **o CONTRASTE de texto que não é folha.** O medidor existe e está no portão —
  `checkContrast`, dentro do passeio —, e ele mede o par RENDERIZADO e não o teórico,
  porque `--ink-dim` sobre `--bg` passa e sobre a lâmina reprova. **Mas ele só alcança
  FOLHA**: elemento sem filho elemento. Num `<p>` com `<b>` dentro, o `<b>` é medido
  sozinho e o texto próprio do pai **não é medido por ninguém**. É a omissão declarada,
  e ela é do medidor e não do desenho;
- **o VALOR de um dado do catálogo.** `identity` prova que todo registro tem
  identidade própria e que nenhuma se repete; `schema` prova que todo esquema
  existe e é validado; a suite prova que os registros obedecem ao esquema.
  Nenhuma das três sabe dizer se `0,95` é a venalidade certa do Centrão — isso é
  calibração, é revisão humana, e não existe casador honesto para intenção;
- ⚠ **PROSA QUE AFIRMA COMPORTAMENTO FALSO, e ela é a metade que a guarda `prose` NÃO
  alcança.** Ela acusa o **nome** morto — `--token`, `.classe`, `arquivo.mjs` citados entre
  crases e que o projeto não tem mais. Ela **não** acusa a frase que descreve um estado que
  o código deixou de ter: `trend.mjs` afirmou por sessões que _"a série de índices por área
  não existe no estado"_ enquanto ela existia e era preenchida todo turno, e duas telas
  liam a fonte errada por causa disso. **Aquela frase passaria verde pela guarda de hoje.**
  Não há casador honesto para isto — o que dá para mecanizar é o nome, e é o que ela faz;
  o resto é revisão, e a pergunta que a acha é sempre a mesma: _o código ainda faz o que
  este parágrafo diz?_;
- **escala de raio, espaço e corpo** — a derivação está no arquivo de tokens e é
  cobrada por revisão, não por máquina;
- **nome real de pessoa no catálogo** (ADR 0003). Toda pessoa do jogo é fictícia,
  e não existe casador honesto para isso: uma lista de nomes proibidos seria
  incompleta por definição e acusaria sobrenomes comuns. Fica como regra declarada
  em `CLAUDE.md` e cobrada em revisão — o que **tem** guarda é a identidade
  (`identity`), que impede personagem sem `id` e `id` repetido.

## 8. O que se aprendeu a não fazer

Cada linha aqui é um defeito que aconteceu, e a data em que ele custou.

**Dois lugares montando a mesma pergunta — CINCO ocorrências.** A tela remontou a
câmara (27,2% dos vereditos invertidos); a Mesa previu com verba prometida enquanto o
turno pagava a rateada; a tela remontou a legislação antes de `bandsOf`; havia dois
`compose` em `turn.mjs`; e o **simulador** negociava contra os quatro blocos do
catálogo sem a rua — este último o mais caro, porque quem errava era o instrumento de
calibragem.

> **Oferecer a porta certa não basta: é preciso FECHAR a errada.** `whipCount` e
> `dispersion` saíram da fachada por isso. E `export` sem consumidor é uma porta
> aberta — se só o próprio arquivo usa, ele não se exporta.

**Ler o estado ANTES do passo que o turno acabou de dar — duas ocorrências.** A MALHA
leu o nível pedido depois de a tramitação separar pedido de aplicado (achado 14); e
`pending` leu a caixa de correio de antes do fechamento, o que **travou a tramitação
inteira** com tudo verde.

> ⚠ **Este defeito não produz resultado errado — produz AUSÊNCIA de resultado.** Nada
> fica vermelho quando um sistema simplesmente para de acontecer, e nenhuma prova de
> igualdade o alcança. Só medir o comportamento ao longo de meses o encontra.

**Valor derivado guardado no estado.** A situação saiu; a faixa virou norma; a posição
do governo nunca entrou. ⚠ **Mas o ARQUIVO é legítimo:** guardar a posição atual é
duplicação, guardar o rastro dela é história — e história não se recalcula.

**Número repetido à mão.** A semente padrão estava em seis lugares e o humor de
abertura em três, com a constante exportada e ninguém a importando. Trocar o padrão
faria o jogo e as provas divergirem em silêncio.

**Lista declarada e não cobrada.** `CHANNELS` e `FAMILIES` existiam com a prosa
dizendo "um de …" e nada verificava: um `feeds: "capacidde"` passaria por tipo, guarda
e validação e sumiria dentro de um `switch` que não casa com nada.

**Formatador errado.** `seats` no lugar de `money` imprimiu **"2166% da despesa é
obrigatória"**. O formatador carrega a UNIDADE, e escolher o errado troca a unidade
sem trocar o valor — o único erro de exibição que nenhuma prova de igualdade alcança.

**Prova que codifica o defeito.** `allowance <= cash` era cobrado por uma propriedade,
e a desigualdade era o último muro do jogo. Quando o muro caiu, a prova tinha de cair
junto — e ela **não foi apagada**: passou a cobrar a restrição que sobrou, a única com
lei atrás.

**Desempate na granularidade errada.** O gerador recusava nome COMPLETO repetido, e com
vocabulário largo produziu "Cláudio Espindola" ao lado de "Cláudio Itaparica". Numa
Câmara de 513 dois Cláudios são verossímeis; entre as oito pessoas que o jogador
precisa distinguir, não são.
