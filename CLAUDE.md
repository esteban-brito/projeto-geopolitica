# República Simulator — regras para o agente

Simulador de presidência do Brasil. Site estático: zero build, zero dependência de runtime, ESM
puro servido como arquivo.

## Leia nesta ordem

1. [`AGENTS.md`](AGENTS.md) — contrato universal entre agentes, as duas verdades e governança tripartite;
2. [`docs/handoff.md`](docs/handoff.md) — estado verificável hoje, fila, decisões vivas, achados
   abertos, a série. Primeira leitura de toda sessão; última escrita de toda sessão que muda algo;
3. [`docs/standards.md`](docs/standards.md) — as convenções, e qual guarda cobra cada uma;
4. [`docs/cycles/`](docs/cycles/) — o ciclo mais recente é o plano em vigor; índice em
   [`docs/cycles/README.md`](docs/cycles/README.md);
5. [`docs/adr/`](docs/adr/) — decisões que não se reabrem sem pedido.

A narrativa mora em [`docs/journal.md`](docs/journal.md) e se lê pelo fim (últimas ~150 linhas),
nunca inteira. Número de estado se lê no handoff, nunca aqui.

## As leis

- **Português na prosa e na interface; inglês em código e caminhos.** Sem acento em identificador;
- **Escreva como gente.** Frase curta, sujeito e verbo na ordem normal, número no lugar do
  adjetivo. Vale para o texto do jogo, os docs e a resposta no terminal. Não entra: reviravolta
  final, inversão poética, paralelismo de efeito, metáfora sem necessidade;
- **A tela não refaz conta do motor — ela pergunta.** Toda leitura mostrada enquanto o jogador
  decide sai da mesma função que o turno vai executar. Dentro do motor vale o mesmo: uma
  previsão pergunta à posição com que o mês seguinte abre, nunca a uma cópia parcial da de hoje;
- **Motor nenhum chama outro motor.** Quem compõe é `src/application/`;
- **O domínio é puro:** sem DOM, sem relógio, sem `Math.random`. Aleatoriedade entra por fluxo
  injetado, todo saque grava a posição que gastou, e o mandato inteiro se refaz da semente;
- **Tudo tem preço, nada tem muro.** Nunca `if (proibido) return`. A pergunta é quanto custa;
- **Nada de número inventado.** Todo valor mostrado tem motor atrás ou catálogo com fonte. Sem
  isso, a informação fica ausente e declarada;
- **Estado que sobrevive a uma repintura guarda id, nunca índice.** Ouvinte em `document` ou
  `window` arma uma vez;
- **O mundo é real, as pessoas são inventadas** (ADR 0003);
- **A IA não entra no turno** (ADR 0001) e **gera vocabulário, nunca efeito** (ADR 0002). IA por
  API não entra, nem em partida nem fora dela.

## Comentário

Um comentário registra o que o código não consegue dizer: a alternativa testada e reprovada, com
o número que a reprovou. Nada mais entra.

- Teto de 10 linhas por bloco, um bloco por decisão; cabeçalho de arquivo, 14. A guarda `prose`
  mede e reprova em `npm run check`;
- não entra: data, nome, histórico de quem pediu, narrativa de reversão, o que o código já diz;
- meta do projeto: prosa em até 20% das linhas do jogo, nenhum arquivo acima de 25%;
- linha de tipo (`@typedef`, `@param`, `@property`, `@returns`) é contrato: não conta no teto e não
  sai, nem em bloco nem inline;
- bom: `/* Sem filtro: glass-support custou 17,9 fps aqui. */`

## Fluxo

```bash
npm run validate   # guardas + tipos + lint + formato + provas + passeio — 42s, tem de ficar verde
npm run check      # só as guardas, 2s — o laço de quem mexe em folha
npm test           # só as suítes, 2s — o laço de quem mexe em motor
npm run simulate   # 48 meses no terminal; --policy <sonda>, --party <bancada>, --seed <n>
npm run serve      # http://127.0.0.1:5173/
```

Três laços, cada um com ordem fixa:

- **folha** (`src/ui/`, `styles/`) → `npm run check` → abrir a captura em `captures/passeio/`. O
  portão vê geometria, recorte e contraste, mas não sabe olhar: três defeitos já passaram por tipo,
  guarda e prova e morreram na imagem;
- **motor** (`src/domain/`, `src/application/`, `src/data/`, `src/state/`) → `npm test` →
  `npm run simulate` → reescrever a série no handoff no mesmo commit, mesmo que ela não mude;
- **fechar item** → `npm run validate` → journal + handoff.

`validate` verde é obrigatório antes de dizer que algo está pronto. `npm run screen` fica fora do
portão (abre janela, mede contra o monitor): meça os dois braços na mesma rodada.

## Bug e prova

- **Todo achado se reproduz antes de mexer** — script em `tmp/` ou prova nova. O que não
  reproduz não se corrige: registra-se no handoff com o que foi tentado;
- **a prova nasce antes do conserto e tem de cair contra o código de hoje.** Bug de tela vira
  prova no passeio (`tests/browser/`); bug de motor vira prova na suíte;
- **revisão externa** (`/code-review ultra <base>`): lê o diff da branch contra a base, teto de
  8.000 linhas. Para ler uma pasta inteira, a base é uma branch sem a pasta e a revisada é a base
  com a pasta de volta — o ancestral comum tem de ser a base, senão o diff por três pontos sai
  vazio. Achado dela é hipótese até reproduzir; os 9 primeiros eram todos verdade.

## Delegação

A governança dos agentes (Claude, GPT e Gemini) e o contrato canônico estão em [`AGENTS.md`](AGENTS.md). Regras operacionais em
[`.agents/rules/co-development.md`](.agents/rules/co-development.md).

- Lote com fronteira de arquivos e portão explícito (`check` + `types` + `test`); ele não toca
  em mais nada. `src/app/`, `app.mjs`, `rail.mjs`, `src/domain/`, `tests/` e `docs/` são do Claude;
- toda entrega dele se confere contra o código antes de aceitar (`tmp/so-prosa.mjs` para prosa,
  `tsc`, `grep`). Errada, volta com a regra concreta;
- bug relatado por ele só entra com reprodução: tela, passo, o que apareceu. Lista tirada de doc
  se apaga;
- canal: `node tmp/gemini.mjs enviar|ler|fila|limpar`. Mensagem enviada com ele trabalhando vai
  para a fila e não chega — cheque `fila` antes.

## Não faça sem pedido

- commitar ou dar push — ele decide quando;
- começar um motor novo ou uma parte de ciclo não acordada;
- mudar calibragem (`src/data/`) para fazer teste passar. Número errado é achado: registre;
- remover guarda ou prova para destravar. Elas existem por defeito medido;
- apagar arquivo dele (`tmp/`, `docs/`). A lista vai para o handoff e ele diz sim.

## Recusa e decisão

Toda recusa registrada neste repositório é de uma de três famílias, e só uma trava:

| família              | exemplo                             | trava?                                   |
| -------------------- | ----------------------------------- | ---------------------------------------- |
| medição              | `glass-support` custou 17,9 fps     | sim — até alguém remedir e mostrar outro |
| gosto dele, com data | recusou um tom de marrom em 22/08   | não; expira. Cita-se com a data, e só    |
| generalização minha  | "madeira, couro e papel não entram" | não vale nada. Apague ao encontrar       |

Antes de escrever qualquer proibição: isto é medição, ordem dele ou generalização minha? Na
dúvida, pergunte a ele — nunca invoque o documento. Documento mais recente vale e vence ADR; ordem
dele substitui regra escrita, e o documento antigo se emenda.

A base visual é o Liquid Glass. Base é ponto de partida, não teto: arranjo, escala, matéria, luz
e gesto estão abertos, e ao propor desenho ofereça o exótico.

## Como responder

Curto e direto, em português. O resultado e o número que o sustenta; corte o resto.
