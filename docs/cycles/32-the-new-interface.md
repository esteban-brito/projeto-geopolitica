# Ciclo 32 — A interface nova

> **Situação em 26/09/2026:** planejado, nada implementado. Ordem dele: o motor fica, a interface
> recomeça do zero sobre a fundação, e o estilo fica fixado em **Apple + Football Manager +
> Civilization + Valorant**. Ele quer reaproveitar o que prestar, talvez do Liquid Glass e dos
> menus. Base: [a posse no jogo](../spec/the-posse-port.md) e o [mapa das telas](../spec/interface-map.md).

## 1. O que fica, o que se reaproveita, o que sai

**Fica, sem reescrever (a fundação):** `src/domain`, `src/application`, `src/state`, `src/data` e
`src/public`, com as suítes e as guardas. São cerca de 11 mil linhas provadas por 14,7 mil de teste.
A interface nova só fala com o motor pela fachada `src/public`. O motor ainda precisa de ajustes,
como a base inicial (achado 86), mas isso é calibragem, não recomeço.

**Recomeça:** `src/app`, `src/ui` e `styles`, cerca de 13,7 mil linhas. A antiga continua jogável
até a nova cobrir tudo.

**Reaproveitar, peça por peça:**

| peça                                                                                        | o que faz                                                           | veredito                                                                                                                                                          |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format.mjs`                                                                                | número vira texto num lugar só                                      | fica como está                                                                                                                                                    |
| `html.mjs`                                                                                  | escape central                                                      | fica                                                                                                                                                              |
| `spring.mjs`                                                                                | mola no modelo da Apple, guarda posição e velocidade na interrupção | fica; é o motor de movimento da nova                                                                                                                              |
| `squircle.mjs`                                                                              | canto de curvatura contínua                                         | fica; é o canto das superfícies                                                                                                                                   |
| `icons.mjs`                                                                                 | glifos de 16 px em `currentColor`                                   | fica e cresce com os 38 ícones dos ministérios do protótipo                                                                                                       |
| `trend.mjs`                                                                                 | quanto um índice andou e em quanto tempo                            | fica a lógica                                                                                                                                                     |
| `annex.mjs`                                                                                 | a peça de dado: nome, pista, valor, nota                            | vira a base da linha de atributo, no jeito do Football Manager                                                                                                    |
| `glass.mjs` e o material                                                                    | o Liquid Glass                                                      | fica só em superfície pequena sobre fundo parado: barra de cima, menu, diálogo. Nunca sobre o que anima (medido: 32 quadros descartados em 6 saídas no protótipo) |
| `rail.mjs`, `topbar.mjs`, `vitals.mjs`                                                      | menu lateral e barra de cima                                        | fica o comportamento (atalhos, sinais sempre à vista, botão de avançar com preço); o desenho é refeito no sistema novo                                            |
| a mesa de papéis (`brief`, `decree`, `mail-pile`, `moment`, `phone`, `protocol`, `texture`) | o Gabinete como mesa                                                | sai quando o Gabinete novo, em cena com pessoas, chegar; o que ele quiser guardar, guarda                                                                         |
| tokens de tempo (`--dur-*`, `--ease-*`)                                                     | curvas medidas                                                      | entram no sistema novo como ponto de partida                                                                                                                      |

## 2. O estilo, em regras

Cada referência entra com o que ela faz melhor. Nada entra como enfeite.

- **Apple, por cima de tudo:** uma ação principal por tela; hierarquia por tamanho e peso, não por
  caixa; movimento com mola (`spring.mjs`); canto squircle; vidro só onde nada anima por baixo;
  silêncio visual entre os blocos;
- **Football Manager, nos dados:** atributo é número colorido por faixa, alinhado em coluna; tabela
  ordenável; ficha da pessoa com forças, riscos e comparação lado a lado; muita informação
  legível na mesma tela, sem parágrafo;
- **Civilization, na cerimônia e no mapa:** o mapa como herói da tela (o hemiciclo, o Brasil);
  retrato antes de nome; momentos de cerimônia (a posse, a virada do ano, a votação grande);
  conselheiros que falam na voz deles;
- **Valorant, no gesto e no tipo:** corte em ângulo nos acentos (botão principal, etiqueta de
  estado), não em toda superfície; tipo condensado em caixa alta para números e títulos; escolha de
  pessoa como escolha de agente, com botão que trava a decisão; contraste alto.

**Paleta:** fundo azul-noite do protótipo; dourado para a Presidência e a ação principal; vermelho
só para crise; cores dos partidos só como dado, uma por partido, do diagrama de Nolan.

**Tipo:** Inter no texto (já servida pelo site); Source Serif 4 em nomes e cerimônia (já servida);
uma condensada para números e títulos, com licença aberta e arquivo servido pelo próprio site.

**Movimento:** hover nunca muda o estado da tela; só `transform` e `opacity`; nada de transição em
centenas de elementos ao mesmo tempo; tudo respeita "movimento reduzido".

**Orçamento de desempenho:** nenhum quadro acima de 20 ms nos gestos comuns, medido com CPU 4
vezes mais lenta, como no protótipo.

## 3. Como a interface nova é construída

- **Entrada própria durante a troca:** a nova abre por um endereço separado, com folhas e módulos
  próprios; a antiga não muda. Os nomes das pastas saem na fase 2;
- **pintura por diferença, não por troca inteira:** cada tela é uma função pura da entrada que
  devolve o HTML; um utilitário pequeno e nosso compara com o que está na tela e troca só o que
  mudou, pela chave de cada elemento. Animação, rolagem e foco sobrevivem ao clique. É o que o
  protótipo tinha e o jogo de hoje não tem;
- **estado da interface guarda id, nunca índice;** ouvinte em `document` arma uma vez, por
  delegação;
- **a tela pergunta ao motor:** toda leitura sai de função da aplicação; as consultas que faltam
  (a prévia da base com um gabinete, por exemplo) nascem em `src/application`, com prova;
- **texto em `src/ui/strings.mjs`** ou no equivalente da nova, sem frase repetida.

## 4. As fases

Cada fase fecha com `validate` verde, capturas revisadas por mim e o sim dele.

0. **Backup, inventário e decisões.** O backup já existe (26/09): a marca `antes-da-interface-nova`
   no git e duas cópias fora do projeto, `Desktop/cld-backup-2026-09-26.bundle` (todo o histórico,
   conferido com `git bundle verify`) e `Desktop/cld-posse-2026-09-26.tgz` (o protótipo e as
   ferramentas de `tmp/posse/`, que o git não guarda). Antes da fase 2 mexer em qualquer coisa, um
   backup novo com a mesma receita. Lista de tudo o que a interface de hoje faz, tela por tela, para
   nada se perder; a decisão da base inicial (achado 86); a fonte condensada;
1. **O sistema de design.** Tokens (cor, tipo, espaço, canto, sombra, tempo), componentes (botão,
   painel, etiqueta, lista, tabela, ficha, medidor, retrato, hemiciclo) e uma página de catálogo com
   todos eles e todos os estados. Nasce como protótipo no canvas para ele aprovar;
2. **A casca.** A pintura por diferença com provas, a barra de cima, o menu, a entrada separada e
   os testes de navegador da nova (passeio, desempenho, teclado, quatro tamanhos de tela);
3. **A posse** (lote E1.0e), portada do protótipo para o sistema, depois da decisão da base;
4. **As outras telas**, na ordem do mapa das telas: Governo, Congresso, Gabinete, País,
   Correspondência. Cada uma: protótipos no canvas, escolha dele, construção, passeio novo;
5. **A troca.** Quando a nova cobre o inventário inteiro, a antiga e os testes dela saem, com o sim
   dele.

## 5. Os testes que a nova carrega desde o primeiro dia

- passeio por tela, a 1280×800, 1440×900, 1920×1080 e com zoom de 125% e 150%;
- desempenho com CPU 4 vezes mais lenta e trace de pintura, raster e quadros descartados (as
  ferramentas de `tmp/posse/` viram teste);
- hover e etiqueta quadro a quadro: nasce no cursor, fica acima, não pula ao sair;
- passeio só com teclado;
- macaco na nova, com semente.

## 6. Decisões que são dele

1. a base inicial: todo partido meio leal (o jogo hoje) ou só quem recebe pasta (o protótipo);
2. a fonte condensada, escolhida na página de catálogo entre duas ou três;
3. o canto: squircle nas superfícies e corte em ângulo só nos acentos, ou outra mistura;
4. o papel do vidro: só barra, menu e diálogo, ou mais;
5. o que da mesa de papéis ele quer guardar no Gabinete novo.
