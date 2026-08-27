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
- ⚠ **mas o portão não sabe OLHAR.** Mexeu em tela? **abra a captura** em `captures/`.
  Três defeitos já atravessaram tipo, guarda e cem provas para morrer na imagem, e
  nenhum deles falhava — é o único passo que continua sendo humano;
- mexeu em catálogo ou motor? rode `simulate` e compare a série;
- `npm run screen` oscila ~20 fps entre rodadas, e continua **fora** do portão: ele
  abre janela e mede contra a taxa do monitor. Meça os dois braços na mesma rodada;
  um número solto dele não decide nada.

## Não faça sem pedido

- **commitar ou dar push** — o responsável decide quando;
- **começar um motor novo** ou uma parte de ciclo não acordada;
- **mudar calibragem** (`src/data/`) para fazer teste passar. Número errado é achado —
  registre no handoff;
- **remover guarda ou prova** para destravar. Elas existem por defeito medido.

## Sessão 21 (auditoria, 25/08/2026)

Duas rodadas de auditoria com agentes paralelos. **25 arquivos tocados, nenhum motor
alterado.** Tudo é proteção (try/catch, escapeHtml, validação) ou limpeza (exports
mortos, JSDoc duplicado). 13 provas novas em `passage.mjs`. Os dois itens pendentes
são de schema bump (persistir `last` no save e remover `events` stream morto) —
decisão do responsável. Próximo passo: O Glorioso, passo 2 (B1-B5). Detalhes
completos no [`handoff.md`](docs/handoff.md).

## Como responder

Curto e direto. Entregue o resultado e o número que o sustenta; corte o resto.
