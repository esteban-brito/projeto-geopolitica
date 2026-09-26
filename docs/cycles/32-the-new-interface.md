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

Cada fase fecha com `validate` verde, capturas revisadas por mim e o sim dele. A posse vem
primeiro e é o padrão das outras telas (ordem dele, §6).

0. **Backup, inventário e pesquisa.** O backup já existe (26/09): a marca `antes-da-interface-nova`
   no git e duas cópias fora do projeto, `Desktop/cld-backup-2026-09-26.bundle` (todo o histórico,
   conferido com `git bundle verify`) e `Desktop/cld-posse-2026-09-26.tgz` (o protótipo e as
   ferramentas de `tmp/posse/`, que o git não guarda). Antes da fase 3 mexer em qualquer coisa, um
   backup novo com a mesma receita. Nesta fase: a lista de tudo o que a interface de hoje faz, tela
   por tela, para nada se perder; e a pesquisa com fonte de como a base do governo se forma no
   Brasil, feita e conferida em 26/09 ([pesquisa 17](../research/17-how-the-base-forms.md)), que
   calibra a fase 2;
1. **A posse no estilo novo, no canvas.** Primeira versão publicada em 26/09 (versão 26 do canvas, prancheta "A posse · estilo novo"), esperando a aprovação dele. O protótipo aprovado (versão 25) fixou a estrutura, mas
   é anterior ao estilo. Ele é refeito em Apple + Football Manager + Civilization + Valorant, com a
   criação do Presidente na frente. Da versão aprovada saem os tokens (cor, tipo, espaço, canto,
   sombra, tempo), os componentes e uma página de catálogo com todos os estados; a fonte condensada
   é escolhida aqui;
2. **O motor da posse.** A base passa a se formar com ministérios e negociação, calibrada pela
   pesquisa, pelo [modelo da base](../spec/the-base-model.md); a prévia da base vira consulta da aplicação, com prova; os dados pessoais do Presidente
   entram no estado, com versão nova do save. Segue o laço do motor: prova antes, `npm test`,
   `npm run simulate` e a série reescrita no handoff;
3. **A casca.** A pintura por diferença com provas, a barra de cima, o menu, a entrada separada e
   os testes de navegador da nova (passeio, desempenho, teclado, quatro tamanhos de tela);
4. **A posse no jogo** (lote E1.0e e a criação do Presidente), construída a partir do protótipo da
   fase 1;
5. **As outras telas**, no padrão da posse e na ordem do mapa das telas: Governo, Congresso,
   Gabinete, País, Correspondência. Cada uma: protótipos no canvas, escolha dele, construção,
   passeio novo;
6. **A troca.** Quando a nova cobre o inventário inteiro, a antiga e os testes dela saem, com o sim
   dele.

## 5. Os testes que a nova carrega desde o primeiro dia

- passeio por tela, a 1280×800, 1440×900, 1920×1080 e com zoom de 125% e 150%;
- desempenho com CPU 4 vezes mais lenta e trace de pintura, raster e quadros descartados (as
  ferramentas de `tmp/posse/` viram teste);
- hover e etiqueta quadro a quadro: nasce no cursor, fica acima, não pula ao sair;
- passeio só com teclado;
- macaco na nova, com semente.

## 6. Decididas por ele em 26/09

- **a posse vem primeiro e é a base de tudo:** o sistema de design nasce da tela da posse, e as
  outras telas seguem o padrão dela, para nada destoar. O Gabinete fica em aberto até lá;
- **a base do começo segue o protótipo, aprimorado e fiel à realidade:** o Presidente começa com o
  próprio partido, e a base se monta com ministérios e negociação. O desenho do modelo pede
  pesquisa com fonte (como a coalizão se forma no Brasil e quanto cada grupo vota com o governo)
  antes de mexer no motor, que hoje dá 440 deputados na largada;
- **o começo do jogo cria o Presidente:** nome, partido, se é homem ou mulher, data de
  nascimento e mais dados pessoais, com as regras reais da candidatura (idade mínima de 35 anos,
  brasileiro nato, filiação partidária; Constituição, arts. 12 e 14). Hoje o formulário só tem
  nome, tratamento e partido.

## 6b. A trajetória do Presidente pesa no jogo (ordem dele, 26/09)

A criação oferece seis trajetórias: político experiente, militar, jurista, empresário, ativista e celebridade.
Ele quer que elas importem de verdade. Entram na fase 2, no motor, com prova; os números são [DESENHO] até
calibrar, e cada efeito tem de ter preço, nunca muro:

- **político experiente:** começa com mais lealdade dos líderes da Câmara (ECLUSA) e negociação mais barata;
- **militar:** apoio e estabilidade nas Forças Armadas (VONTADE); menos rede no Congresso na largada;
- **jurista:** imagem de rigor com parte do eleitorado (SONDA); menos rede política;
- **empresário:** confiança do mercado na largada (CORRENTE); negociação com o centrão mais cara;
- **ativista:** capacidade de mobilizar a rua (CALDEIRA); os partidos pragmáticos começam mais desconfiados;
- **celebridade:** fama e aprovação inicial maiores (SONDA); pior desempenho de gestão no começo (MALHA).

## 7. Decisões que seguem abertas

Todas num lugar só; o estudo da posse aponta para cá.

1. a ordem da posse no jogo: as 38 cadeiras fixas primeiro, ou junto com juntar, extinguir e
   dividir (E1.0d) e os notáveis (E1.0f);
2. a posse só no começo, ou também na reforma ministerial do meio do mandato;
3. a sigla do partido de 18 cadeiras: PLV (o jogo) ou LIVRE (o protótipo);
4. a fonte condensada, escolhida na fase 1 entre duas ou três;
5. o canto: squircle nas superfícies e corte em ângulo só nos acentos, ou outra mistura;
6. o papel do vidro: só barra, menu e diálogo, ou mais;
7. que dados pessoais além de nome, partido, sexo e nascimento entram na criação do Presidente;
8. o que da mesa de papéis ele quer guardar no Gabinete novo, decidido depois da posse.
