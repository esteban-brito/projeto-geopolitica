# República Simulator — instruções para o agente

Simulador de presidência do Brasil. Site estático: zero build, zero dependência de
runtime, ESM puro servido como arquivo.

## Leia nesta ordem

1. [`docs/handoff.md`](docs/handoff.md) — o ponto de retomada, e ele é CURTO de
   propósito: só entra o que é verificável hoje. Primeira leitura de toda sessão, última
   escrita de toda sessão que muda algo. A narrativa de sessão mora em
   [`docs/journal.md`](docs/journal.md), e não volta para cá;
2. [`docs/standards.md`](docs/standards.md) — as convenções, e quais têm guarda;
3. [`docs/cycles/`](docs/cycles/) — o ciclo mais recente é o plano em vigor;
4. [`docs/adr/`](docs/adr/) — decisões que não se reabrem sem pedido.

## Regras que não se quebram

- **Português na prosa e na interface; inglês em código e caminhos.** Sem acento em
  identificador;
- ⛔ **ESCREVA COMO GENTE, e vale para tudo** — o texto do jogo, os docs e a resposta no
  terminal. Ordem dele em 03/09/2026: _"tu não ta escrevendo um livro não, nem uma poesia
  porra, escreve igual uma pessoa normal, não uma IA imbecil"_. **Frase curta, sujeito e verbo
  na ordem normal, número no lugar do adjetivo.** O que sai:
  - a **reviravolta final** — _"X é A, e é isso que faz dele B"_. Diga só o que acontece;
  - a **inversão poética** — _"o que ela deixa de ceder o resto paga"_ vira _"se você proteger
    uma área, o corte cai mais fundo nas outras"_;
  - o **paralelismo de efeito** — _"a pauta não morre, ela não acontece"_;
  - a **metáfora sem necessidade** — _"a caneta mais honesta do jogo"_ vira _"o poder mais
    direto"_;
- **A tela não refaz conta do motor — ela pergunta.** Toda leitura mostrada enquanto o
  jogador decide sai da mesma função que o turno vai executar;
- **Motor nenhum chama outro motor.** Quem compõe é `src/application/`;
- **O domínio é puro**: sem DOM, sem relógio, sem `Math.random`. Aleatoriedade entra
  por fluxo injetado, e o mandato inteiro se refaz da semente;
- **Tudo tem preço, nada tem muro.** Nunca `if (proibido) return`. A pergunta é
  _quanto custa_, não _pode_;
- **Nada de número inventado.** Todo valor mostrado tem motor atrás ou catálogo com
  fonte. Sem isso, a informação fica ausente e declarada;
- **O mundo é real, as pessoas são inventadas** (ADR 0003). Todo personagem é
  fictício. Não há guarda — é revisão;
- **A IA não entra no turno** (ADR 0001) e **gera vocabulário, nunca efeito** (ADR 0002).

## Comentário: o teto é rígido

**Um comentário registra o que o código não consegue dizer: a alternativa testada e
reprovada, com o número que a reprovou.** Nada mais entra.

- **Teto de 10 linhas por bloco, e um bloco por decisão.** Cabeçalho de arquivo: 14.
  A guarda `prose` mede e reprova em `npm run check`;
- ⛔ **não escreva** data, citação do responsável, histórico de quem pediu o quê,
  narrativa de reversão, nem o que o código já diz. Isso é diário, e diário mora no
  handoff e no `git log`;
- **Bom:** `/* Sem filtro: glass-support custou 17,9 fps aqui. */`
- **Ruim:** três parágrafos contando que ele pediu, que houve duas propostas, que a
  medição recusou uma, e em que data.

**Linha de tipo não conta** — `@typedef`, `@param` e `@property` são contrato.

## Fluxo

```bash
npm run validate   # guardas + tipos + lint + formato + testes + passeio — 42s, tem de ficar verde
npm run check      # só as guardas, 2s — o laço curto de quem mexe em folha
npm test           # só as suítes, 2s — o laço curto de quem mexe em motor
npm run simulate   # 48 meses no terminal; rode ao mexer em calibragem
npm run serve      # http://127.0.0.1:5173/
```

- `validate` verde é obrigatório antes de dizer que algo está pronto, e **o passeio
  está dentro dele**: o portão agora vê geometria, recorte e contraste no navegador;
- ⚠ **mas o portão não sabe OLHAR.** Mexeu em tela? **abra a captura** em `captures/passeio/`.
  Três defeitos já atravessaram tipo, guarda e cem provas para morrer na imagem, e
  nenhum deles falhava — é o único passo que continua sendo humano;
- mexeu em `src/data/`, `src/domain/` ou `src/application/`? rode `simulate` e **reescreva a
  série** em `docs/handoff.md` no mesmo commit — comparar não basta: ela ficou seis dias vencida
  porque o item 0.1 mudou o motor e ninguém a remediu;
- `npm run screen` oscila ~20 fps entre rodadas, e continua **fora** do portão: ele
  abre janela e mede contra a taxa do monitor. Meça os dois braços na mesma rodada;
  um número solto dele não decide nada.

## Não faça sem pedido

- **commitar ou dar push** — o responsável decide quando;
- **começar um motor novo** ou uma parte de ciclo não acordada;
- **mudar calibragem** (`src/data/`) para fazer teste passar. Número errado é achado —
  registre no handoff;
- **remover guarda ou prova** para destravar. Elas existem por defeito medido.

## Onde o projeto está

**Estado verde:** 13 guardas · 63 provas sintéticas · 315 provas · passeio verde.
⭐ **O GABINETE É A MESA** desde 04/09/2026 — quatro zonas com lugar fixo, seis leituras, e ele
**decide**: o contingenciamento mora nele, com as oito pastas. **A barra superior** está no jogo
desde 01/09/2026. **Save na versão 20** — partida salva antes de 30/08 não abre. Branch de
trabalho: `caixa-de-entrada`.

▶ **O PASSO 6 DO CICLO 13 COMEÇOU PELO A3, E O A3 FECHOU INTEIRO em 03/09/2026** — a
[pesquisa 06](docs/research/06-a-obrigatoria-e-quem-a-decide.md) mediu que A1, A2 e A3 dão ao
presidente uma caneta que ele não tem, e que o **A3 era o único que não pedia motor novo**. Ele
aprovou, e entrou tudo: os dois instrumentos ganharam nomes diferentes (`blocked` para o teto do
arcabouço, `atRisk` para a meta primária), o rateio deixou de gravar o corte na lei, o
contingenciamento passou a ser **escolhido por área**, e o relatório bimestral avisa antes.
**Sobram o A1 e o A2, e os dois mexem em calibragem fiscal — logo, os dois são decisão dele.**

**Há ONZE planos na mesa**, e o 13, o 18, o 19, o 20, o 21, o 22 e o 23 são os abertos. ⭐ **Os
três de 04/09/2026 são a espinha do que o jogo vai ser:**

- [`cycles/23-o-corpo-politico.md`](docs/cycles/23-o-corpo-politico.md) — **os 17 itens que
  faltam DEPOIS de todos os outros planos**, escrito a pedido dele: _"o que falta além de tudo
  que está registrado"_. A tese: somando tudo, o presidente tem as quatro moedas e **não tem
  corpo político** — sem partido, sem vice, sem entorno, sem tempo finito e sem voz. ⭐⭐⭐ **O
  item 1 é O TEMPO**, e é o único do projeto inteiro que dá peso às jogadas que já existem. ⭐⭐
  **O item 2 é o Banco Central**: a Selic sai de uma regra de Taylor e ninguém decide o juro —
  e o calendário da LC 179/2021 dá de graça o melhor desenho já achado aqui (**meses 1 a 24 com
  o BC do adversário; o seu entra no 25 e te sobrevive dois anos**);
- [`cycles/22-a-lei-que-voce-escreve.md`](docs/cycles/22-a-lei-que-voce-escreve.md) — **os seis
  verbos**, executando a pesquisa 07. A gramática de norma tem **dez encaixes e um verbo só**
  (`kind: "band"`). ⚠ **A regra dura dele:** a coordenada de uma lei sai do que ela FAZ, nunca
  do que o jogador digita — escolher a própria ameaça é escolher o próprio preço;
- [`cycles/19-a-voz.md`](docs/cycles/19-a-voz.md) — **reescrito em 04/09**: o avaliador, as
  quatro ambições inertes, o mundo protocolando texto e o jornal. **Alicerce do 22.**

E os demais:

- [`cycles/21-a-mesa.md`](docs/cycles/21-a-mesa.md) — ✔ **OS PASSOS 1 A 4 FECHARAM em
  04/09/2026.** O Gabinete virou mesa: quatro zonas com lugar fixo, **20 leituras viraram 6**, a
  promessa da posse passou a ser lida na tela (`breachOf` rodava cego) e o contingenciamento
  saiu das oito telas de área para virar um decreto com as oito pastas. ⭐ **A série não mudou.**
  ⚠ **A captura reprovou DUAS vezes o que o portão aprovou** — 600px pretos no centro e a peça
  principal sem superfície. **Sobra o passo 5, a MP, que é o item 6 do ciclo 18.**

- [`cycles/20-as-empresas.md`](docs/cycles/20-as-empresas.md) — **as empresas, de 03/09/2026.**
  A lei trata criar e vender de formas OPOSTAS, e isso vira jogo: fundar estatal pede **lei
  específica** (CF art. 37, XIX) e vender **subsidiária** é decreto, porque a autorização
  genérica da Lei 9.491/1997 basta. Vender o controle da **matriz** volta a pedir o Congresso.
  Nove itens, e o primeiro é o catálogo;
- [`cycles/19-a-voz.md`](docs/cycles/19-a-voz.md) — **a IA, de 03/09/2026.** Hoje ela é **zero**:
  `dependencies: {}`. Os três lugares que os ADR 0001 e 0002 abriram estão vazios. O plano os
  enche **sem quebrar o determinismo**, por cache do texto com a chave da ficha do mês — e propõe
  o meio-termo: **a IA escolhe entre opções que o motor precificou**;

- [`cycles/18-a-caneta.md`](docs/cycles/18-a-caneta.md) — **o plano de 03/09/2026, e ele executa a
  pesquisa 04**: o jogo tem **seis gestos** e o cargo tem **quatro canetas**. Onze itens em ordem
  de custo, cada um declarando de que peça do cargo vem — a caneta, a pauta, a coalizão, o
  contrapoder, o calendário. ⚠ **A seção 2 é a atualização do Brasil, apurada na web e datada:**
  três vagas do STF caem nos meses 16, 28 e 48 do jogo; o Congresso derrubou **43 de 87 vetos**
  em três anos; o STF condiciona a execução de emenda, que é a única moeda do jogo;

- [`cycles/17-o-brasil-inteiro.md`](docs/cycles/17-o-brasil-inteiro.md) — **direção declarada em
  31/08/2026, e NÃO é plano**: estados, capitais e **empresas reais com nomes alterados** — a
  mesma regra que os partidos já seguem. Ele traz o **inventário inteiro do cargo**: o que roda,
  o que está escrito no ciclo 13 e o que não existe em lugar nenhum;

- [`cycles/16-o-gabinete-profissional.md`](docs/cycles/16-o-gabinete-profissional.md) —
  **fechado em 30/08/2026.** O tipo dentro dos blocos subiu para 13,6px, o rail passou a
  mostrar a queda por ministério (`alertsOf`, na MALHA), a pista ganhou zona de perigo com o
  LADO declarado, cada bloco ganhou glifo e a moldura do palco saiu. **O passo 5 foi medido e
  recusado**: a coluna do índice tem 179px e o prazo pede 103;

- [`cycles/15-o-gabinete.md`](docs/cycles/15-o-gabinete.md) — **fechado em 30/08/2026.** O
  vocabulário do Gabinete foi de **18 classes e três instrumentos** para **9 e um**, e ele passou
  a montar com a peça da Caixa (`src/ui/shared/annex.mjs`). ⭐ **É o que fez o ciclo 21 ser
  barato:** a mesa de hoje reusa a mesma peça, sem uma classe nova de leitura. A guarda `annexes`
  cobre as duas telas e a peça;
- [`cycles/14-a-caixa-de-entrada.md`](docs/cycles/14-a-caixa-de-entrada.md) — **fechado em
  29/08/2026** — os oito passos entraram. A caixa não tem mais tabela nenhuma, e
  o vocabulário dela é de três peças com guarda. **Sobra um item**: as duas cartas sem número
  (a Mesa pautou, a gaveta), e ele pede motor;
- [`cycles/13-o-glorioso.md`](docs/cycles/13-o-glorioso.md) — **em execução**, e o plano mestre:
  **26 de 49 itens**. Os passos 4 e 5 fecharam em 30/08 — o **D4** (a corrente causal, no DELTA)
  e o **C5/C6** (a plataforma de posse) —, e o passo 6 abriu pelo **A3**, que fechou em 03/09.
  Sobram o **A1** e o **A2**.

✔ **A BASE FOI DEFINIDA EM 31/08/2026** — as quatro decisões que travavam trabalho fecharam, e o
critério de cada uma mora em `handoff.md`. **Nenhuma foi executada:**

1. **o email leva até a tela** — a carta mostra a pergunta e o prazo, e o único gesto é um link
   para onde se responde. A emenda vai ao Congresso, o lobby à tela da área, a posse a uma tela
   de abertura. ⛔ Os botões da carta da posse saem;
2. **o save fica como está** — decidido "depois", com o custo declarado;
3. **o piso da saúde e da educação passa a andar com a receita** — mexe em `src/data/`, logo a
   série se remede no mesmo commit;
4. **a votação passa a olhar quem compareceu** — com as quatro regras do equilíbrio, que são o
   critério de aceitação: nada novo para gerenciar · nunca surpresa · o texto não morre · um
   número e não uma tela.

⚠ **SOBRAM TRÊS, e nenhuma trava nada:** a rolagem abaixo de 940px, **por onde começar o "menos
texto, mais visual"**, e as duas cartas sem número com o glossário do termo.

📗 **A PESQUISA MAIS NOVA É A 07 — [`research/07-a-lei-que-o-jogador-escreve.md`](docs/research/07-a-lei-que-o-jogador-escreve.md),
de 04/09/2026.** Ela pegou **33 propostas de um plano de governo real** e passou todas pela
gramática do motor. O achado: **a gramática de norma já tem DEZ encaixes** — quem, o salvo, o
enquanto, a vacatio, a vigência, o que ela revoga, o rito — e **um verbo só** (`kind: "band"`).
As 33 se repartem em **sete verbos**, e dois já rodam. ⭐ **`spend` (criar programa) e `tax`
(ligar `taxDelta`) entregam 10 das 33 sem abrir motor nenhum**, e pagam a estrada para o
`condition` — a lei que condiciona dinheiro a resultado, que é a primeira que **continua valendo
depois que o jogador sai**. ⚠ **A ordem dos seis verbos e a entrada do mapa federativo são
decisão dele.** A 06 é citada no passo 6 acima. As duas de 31/08:

- [`research/04-o-cargo-de-presidente.md`](docs/research/04-o-cargo-de-presidente.md) — a tese:
  **o jogo modela o VOTO, e a presidência brasileira é feita de AGENDA.** O A4 está pela metade
  no plano (a caducidade da MP é o preço; o trancamento de pauta é o poder), e o canal mais
  barato do jogo é o **decreto tributário**: `taxDelta` já é lido pela CORRENTE e ninguém o escreve;
- [`research/05-o-material-e-o-gesto.md`](docs/research/05-o-material-e-o-gesto.md) — **o estudo
  do material**, nascido de sete gestos recusados. Mola no modelo da Apple (duração e quique, e
  **o quique padrão dela é zero**), quina de curvatura contínua, refração real por
  `feDisplacementMap`, e o líquido por deformação que conserva volume.

✔ **A BARRA SUPERIOR ENTROU NO JOGO em 01/09/2026** — três peças de vidro encostadas (os
vitais, o quando e o botão), com lente refrativa, quina de curvatura contínua e o gesto da
mola. **A geometria dela mora em 41 tokens** em `00-tokens.css`, e cada um foi girado por ele
num painel de 51 campos no clone: mexer na barra é mexer em token, não em regra. O clone
continua em `tmp/barra.html`, com o painel, e serve de bancada.

⛔ **A DECISÃO DA CHAVE DA IA FOI TOMADA em 04/09/2026, e ela é NÃO:** _"não quero gastar mais
nenhum centavo com o jogo, então não pretendo integrar uma IA, o que eu quero é de alguma forma
criar uma IA, ou algo parecido, no meu jogo"_. **Nenhuma chamada a modelo, em partida ou fora
dela.** O ciclo 19 fica registrado e será reescrito; a resposta ao que ele quer está na
[pesquisa 07](docs/research/07-a-lei-que-o-jogador-escreve.md) §4 — **a "IA" é o AVALIADOR, e
não o gerador.** O ciclo 21 não espera nada. A fila que pedia "o mesmo bump de esquema" tinha quatro
itens e **não existe mais**: o `last` fechou na versão 19, e o `events`, o `weight` e os anexos
saíram **sem bump nenhum** — o validador do save não olha dentro de uma carta. ⚠ **Meça antes
de bumpar:** cada subida de versão custa a partida em andamento.

⚠ **A CAIXA E O GABINETE TÊM UM VOCABULÁRIO SÓ, em `src/ui/shared/annex.mjs`, e a guarda
`annexes` o fecha** — `cardHtml` (uma leitura), `lineHtml` (nome · pista · valor · nota),
`linesHtml` (o bloco) e `noteHtml` (prosa). **Carta ou bloco novo escolhe entre elas; tabela
nas duas telas, ou régua desenhada pela própria tela, é reprovada no portão.**

⚠ **Número de catálogo envelhece na prosa, e é a família sem guarda** (`standards.md` §7): a
prosa afirmou por sessões um Congresso de "onze bancadas" e "sete pessoas" enquanto o catálogo
tinha outros. Antes de repetir um número, meça-o. **E achado só fecha com prova que morde** —
`standards.md` §8.

⚖ **QUANDO DOIS DOCUMENTOS DISCORDAM, O MAIS RECENTE VALE.** Ordem dele em 04/09/2026: _"leve
sempre em conta o que nós fizemos e escrevemos hoje, ontem, etc… quanto mais recente mais
correto"_. Não discuta o empate — **corrija o mais velho**, e diga o que mudou. A auditoria de
04/09 achou **21 afirmações erradas** nos docs por essa regra, e a mais cara delas era a tese de
um plano aberto. **E ela vence ADR também:** o ADR 0001 foi emendado por um ciclo mais novo.

⛔ **E limite escrito por mim não é limite.** Ordem dele: _"não quero que você leve os limites e
travas em conta, pq tem coisa que eu propus, e eu que mando"_. Regra que ele propôs ou aprovou
depois **substitui** a que está escrita — o documento antigo se emenda, não se invoca.

## Como responder

Curto e direto. Entregue o resultado e o número que o sustenta; corte o resto.
