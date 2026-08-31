# Planalto — instruções para o agente

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

**Estado verde:** 13 guardas · 60 provas sintéticas · 145 arquivos · 299 provas · passeio
verde em duas janelas. **Save na versão 20** — partida salva antes de 30/08 não abre. Branch de trabalho: `caixa-de-entrada`.

**Há QUATRO planos na mesa**, e o 13 é o único aberto:

- [`cycles/16-o-gabinete-profissional.md`](docs/cycles/16-o-gabinete-profissional.md) —
  **fechado em 30/08/2026.** O tipo dentro dos blocos subiu para 13,6px, o rail passou a
  mostrar a queda por ministério (`alertsOf`, na MALHA), a pista ganhou zona de perigo com o
  LADO declarado, cada bloco ganhou glifo e a moldura do palco saiu. **O passo 5 foi medido e
  recusado**: a coluna do índice tem 179px e o prazo pede 103;

- [`cycles/15-o-gabinete.md`](docs/cycles/15-o-gabinete.md) — **fechado em 30/08/2026.** A
  coluna direita foi de **18 classes e três instrumentos** para **9 e um**, e o Gabinete passou
  a montar com a peça da Caixa (`src/ui/shared/annex.mjs`). A guarda `annexes` cobre as duas
  telas e a peça;
- [`cycles/14-a-caixa-de-entrada.md`](docs/cycles/14-a-caixa-de-entrada.md) — **fechado em
  29/08/2026** — os sete passos entraram. A caixa não tem mais tabela nenhuma, e
  o vocabulário dela é de três peças com guarda. **Sobra um item**: as duas cartas sem número
  (a Mesa pautou, a gaveta), e ele pede motor;
- [`cycles/13-o-glorioso.md`](docs/cycles/13-o-glorioso.md) — **em execução**, e o plano mestre:
  **25 de 49 itens**. Os passos 4 e 5 fecharam em 30/08: o **D4** (a corrente causal, no DELTA)
  e o **C5/C6** (a plataforma de posse). Retomar no **passo 6**: A1, A2 e A3.

**Nenhum item espera decisão hoje.** A fila que pedia "o mesmo bump de esquema" tinha quatro
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

## Como responder

Curto e direto. Entregue o resultado e o número que o sustenta; corte o resto.
