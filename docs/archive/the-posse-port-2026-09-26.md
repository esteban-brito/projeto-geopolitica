# A posse no jogo — estudo antes de implementar

Estudo de 26/09. Compara o protótipo aprovado (versão 25 do
[canvas](https://claude.ai/artifact/CHQmb6ksyKpYxdR8BBEnuM), fonte em `tmp/posse/`) com o código
do jogo. Na data do estudo, nada deste porte havia sido implementado. O objetivo é saber o que
quebra, o que conflita e o que falta antes da primeira linha.

**Atualização de 28/09:** a comparação das seções 1 e 2 é o retrato anterior ao modelo da base.
O motor agora tem 16 partidos, `openingLoyalty`, `partyChance` e `chanceTargets` pela
[especificação da base](../spec/the-base-model.md). A divergência da largada que bloqueava o porte foi
resolvida no motor; a posse ainda precisa consultar esse motor, integrar pessoas e gestos e passar
pelas provas da seção 4. O achado 86 permanece aberto para a duração da coalizão.

**Escopo de teste em 30/09:** a ponte experimental (hoje gerada em `tmp/build/posse.html`) já consulta a base
estrutural do motor na abertura sem reforma. O Diretor quer transformar e testar esse protótipo,
sem esperar o porte para o jogo completo. F5 reinicia a sessão do protótipo; a persistência prevista
para a partida abaixo não se aplica a esse ensaio. A sequência atual está no
[plano de transformação](../spec/dynamic-government.md).

## 1. Como o jogo funcionava no estudo

- **A posse é um formulário.** Nome, tratamento e partido (`src/app/dialogs.mjs`, `openSwear`). Ao
  enviar, `createState` cria a partida e a tela vai direto para o Gabinete
  (`src/app/handlers.mjs`, o `submit` do `swearForm`). A tela da posse entra entre os dois;
- **a tela se redesenha inteira.** `paint()` troca o `innerHTML` de `#main` a cada mudança de estado;
  `refresh()` só troca os números marcados com `data-read`; `transition()` usa View Transitions
  (`src/app/paint.mjs`). Depois de cada pintura, `glaze()` veste o vidro em JS;
- **o gabinete já está no estado.** `state.cabinet` guarda quem senta em cada cadeira
  (`{ id, name, party }`). As ações `appoint` e `dismiss` existem (`src/state/state.mjs`), mas
  nenhuma tela as chama. O redutor só confere se a cadeira existe; não impede a mesma pessoa em
  duas cadeiras;
- **a pasta mexe na lealdade devagar.** Por mês, a lealdade do partido sobe
  `0,1 × fração servida × (80 − lealdade)` (`src/domain/congress/index.mjs`, `CABINET_PULL` e
  `CABINET_CEILING`), aplicada na resolução do mês (`src/application/turn.mjs`, `settle`). A base é
  `baseCount` sobre a lealdade; `baseSplit` reparte por partido;
- **quem o partido indica já existe.** `nomineeOf` (`src/application/world.mjs`) sorteia pela
  semente um nome da bancada, com id `partido:cadeira`. É a mesma pessoa que aparece na carta em
  que o partido pede pasta;
- **partidos e cadeiras batem em número.** Desde a noite de 26/09 o motor tem os mesmos 16 partidos
  do protótipo ([os partidos](../spec/the-parties.md)), com as mesmas bancadas e coordenadas de Nolan
  (`economic`, `liberty`); os ids do motor são as siglas em minúsculas (`pcn`, `pcs`). As 38 cadeiras
  do catálogo usam os ids da Lei 14.600;
- **o visual é outro sistema.** Fonte Inter servida do próprio site; escala de tipo 10, 12, 13, 15,
  17, 22, 26, 35 e 72 px; tempos de 90, 180, 280 e 520 ms; vidro por `glaze()`;
- **as guardas vão cobrar a tela nova.** `tokens` (cor solta), `material` (filtro fora do arquivo de
  material), `motion` (animação inline, rede de movimento reduzido), `cascade`, `orphans`,
  `vocabulary` (frase só em `src/ui/strings.mjs`, sem repetir), `schema` (catálogo novo com
  esquema), `identity`, `boundaries` e `prose`;
- **o passeio roda a 1440×980 e 1440×900**, e o macaco anda 60 ações.

## 2. Onde protótipo e jogo divergiam no estudo

| Tema                       | Protótipo                                                                    | Jogo                                                                              | Peso      |
| -------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------- |
| base no começo             | votos firmes e prováveis pelo [modelo da base](../spec/the-base-model.md): 149 e 374 | 440 sem nenhuma pasta: todo partido nasce com lealdade 70, o do Presidente com 90 | **grave** |
| efeito da pasta            | a chance do partido sobe na hora, até 95%                                    | menos de 1 deputado no primeiro mês; teto de 80 de lealdade                       | **grave** |
| pessoas                    | escritas à mão                                                               | indicado por semente; especialistas e notáveis não existem                        | grande    |
| Fama, Preparo, Afinidade   | números de desenho                                                           | não existem (lote E1.0f)                                                          | grande    |
| juntar, extinguir, dividir | funcionam na tela                                                            | a lista de cadeiras é fixa no catálogo e em várias contas (lote E1.0d)            | grande    |
| ids das cadeiras           | 26 ids curtos diferentes (`justica`, `gsi`, `agu`) e 3 criáveis              | ids da lei (`justica-e-seguranca-publica`)                                        | médio     |
| tamanho da tela            | fixo em 1280×800                                                             | janela livre                                                                      | médio     |
| fonte e tokens             | Hanken Grotesk e tokens próprios                                             | Inter e tokens do jogo                                                            | médio     |
| cores dos partidos         | 9 tons do Nolan, em HSL no código                                            | não existem; a guarda `tokens` barra cor solta                                    | médio     |

O conflito da base é o mais sério. **Decidido por ele em 26/09: vale o modelo do protótipo,
aprimorado e fiel à realidade;** a pesquisa que o calibra está em curso e o motor muda na fase 2 do
[ciclo 32](../cycles/32-the-new-interface.md). No jogo de hoje, quem não recebe pasta vota com o governo em 85%
das vezes; no protótipo, só vota quem recebe. Os dois não convivem. Resolver isso é mexer na
calibragem do motor da Câmara, e o achado 86 já aponta para o mesmo lugar. A tela da posse não
pode sair antes dessa decisão, porque todo número dela sairia errado ou inventado.

## 3. Onde podem nascer bugs ou feiura

Cada risco com a defesa. Os quatro primeiros já custaram caro no protótipo.

1. **Repintura inteira.** Trocar o `innerHTML` a cada clique reinicia animações, perde a rolagem da
   lista de pessoas e o foco. Defesa: a tela da posse pinta por partes, com o hemiciclo montado uma
   vez e só os blocos que mudam trocados; passar o mouse nunca muda estado (medido no protótipo:
   233 ms de pior quadro com CPU 4 vezes mais lenta, contra 17 ms sem estado);
2. **513 pontos animados.** Transição por ponto derruba quadros. Defesa: bancada como bloco,
   camada fixa, onda só quando deputados mudam de lado;
3. **vidro sob animação.** Desfoque de fundo sob o hemiciclo descartou 32 quadros em 6 saídas.
   Defesa: nada de `glaze()` nem filtro na área que anima;
4. **etiqueta e ficha.** Pulo para o canto, nascer longe do cursor, cair abaixo dele. Defesa:
   etiqueta sempre montada, posição escrita no evento, só opacidade no fade; os testes quadro a
   quadro de `tmp/posse/` viram passeio;
5. **tamanho de janela.** O hemiciclo foi desenhado em pixels fixos. Defesa: desenho em escala
   única, medido a 1280×800, 1440×900, 1920×1080 e zoom de 125% e 150%;
6. **duas verdades.** Ids, nomes, partidos e siglas do protótipo não podem entrar no jogo. Defesa:
   só o catálogo; tabela de-para das 38 cadeiras antes de portar;
7. **estado inválido.** A mesma pessoa em duas cadeiras, exonerar vaga, recarregar a página no meio
   da posse, voltar ao formulário. Defesa: provas no redutor antes da tela; a posse grava a cada
   gesto, como o resto do jogo;
8. **texto.** Toda frase vai para `src/ui/strings.mjs`, sem repetição, e todo número sai do motor;
9. **teclado e leitor de tela.** O protótipo quase não foi testado assim. Defesa: passeio só com
   teclado.

## 4. Provas que nascem antes do código

**Estado em 30/09:** `tests/suites/posse-flow.mjs` reproduziu a mesma pessoa mantida em duas
pastas após remanejamento e a exoneração de vaga criando outro estado. O redutor agora tira a
pessoa da cadeira anterior por ID, conserva homônimos distintos e devolve o estado original
quando a pasta já está vaga. A prova de recarga e primeiro mês verifica que a pasta anterior
não reaparece nem duplica a coalizão. Essas provas são do motor existente; o porte da tela e
as reformas variáveis continuam pendentes.

- no redutor: uma pessoa por cadeira; nomear quem já está em outra cadeira a tira de lá;
  exonerar vaga não muda nada;
- na aplicação: a prévia de votos da tela é igual à base que o mês seguinte abre com aquele
  gabinete (a mesma função, nunca uma conta da tela);
- no passeio: os pontos acesos de cada bancada batem com `baseSplit`; passar o mouse não redesenha
  a tela; a etiqueta nasce no cursor e fica acima dele; o hemiciclo não se move quando o texto muda;
  nenhum quadro acima de 20 ms com CPU 4 vezes mais lenta;
- o fuzz do protótipo (400 sessões de 120 passos) vira prova com semente.

## 5. Decisões

Decidido por ele em 26/09: a base do começo segue o protótipo, aprimorado e fiel à realidade; a
posse vem primeiro e é o padrão das outras telas; o começo do jogo cria o Presidente (nome,
partido, sexo, data de nascimento e mais). Ver o [ciclo 32](../cycles/32-the-new-interface.md), §6.

**Partidos (26/09):** o protótipo passou a 16 partidos com as bancadas da posse de 2023 agrupadas
pelas fusões de 2023. O catálogo do jogo também passou a 16 partidos em 26/09; a referência a nove
na comparação acima é histórica.

As decisões que seguem abertas estão todas no [ciclo 32](../cycles/32-the-new-interface.md), §7.
