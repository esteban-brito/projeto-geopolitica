# Planalto — instruções para o agente

Simulador de presidência do Brasil. Site estático: zero build, zero dependência de
runtime, ESM puro servido como arquivo.

## Leia nesta ordem

1. [`docs/handoff.md`](docs/handoff.md) — o ponto de retomada. Primeira leitura de
   toda sessão, última escrita de toda sessão que muda algo;
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
npm run validate   # guardas + tipos + lint + formato + testes — tem de ficar verde
npm run walk       # a tela num navegador de verdade; rode ao mexer em UI
npm run simulate   # 48 meses no terminal; rode ao mexer em calibragem
npm run serve      # http://127.0.0.1:5173/
```

- `validate` verde é obrigatório antes de dizer que algo está pronto;
- mexeu em tela? rode `walk` **e olhe a captura** em `captures/`. Três defeitos já
  atravessaram tipo, guarda e cem provas para morrer na imagem;
- mexeu em catálogo ou motor? rode `simulate` e compare a série;
- `npm run screen` oscila ~20 fps entre rodadas. Meça os dois braços na mesma rodada;
  um número solto dele não decide nada.

## Não faça sem pedido

- **commitar ou dar push** — o responsável decide quando;
- **começar um motor novo** ou uma parte de ciclo não acordada;
- **mudar calibragem** (`src/data/`) para fazer teste passar. Número errado é achado —
  registre no handoff;
- **remover guarda ou prova** para destravar. Elas existem por defeito medido.

## Como responder

Curto e direto. Entregue o resultado e o número que o sustenta; corte o resto.
