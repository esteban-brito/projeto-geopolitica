# `captures/` — a evidência que o portão não sabe olhar

> `npm run validate` mede geometria, recorte e contraste. **Ele não vê que a peça ficou feia**,
> e três defeitos já atravessaram tipo, guarda e cem provas para morrer na imagem. Esta pasta é
> o único passo que continua sendo humano.

A pasta é ignorada pelo git (`.gitignore`) — **só este mapa é versionado.** Imagem é evidência
de uma medição, não fonte: ela se refaz rodando o comando de novo.

## As seis pastas, e a regra de cada uma

| pasta        | quem escreve               | pode apagar?                                   |
| ------------ | -------------------------- | ---------------------------------------------- |
| `walk/`      | `npm run walk`             | **sim** — reescrita inteira a cada rodada      |
| `cost/`      | `npm run screen`           | **sim** — reescrita a cada rodada              |
| `decisions/` | à mão, para ele escolher   | **não** enquanto a decisão estiver aberta      |
| `defects/`   | à mão, ao achar um defeito | **não** — é o "antes" que justifica o conserto |
| `reference/` | à mão, quando a peça muda  | **não** — é o "como está hoje" de cada peça    |
| `probes/`    | à mão, durante uma sessão  | **sim** — medição de sessão passada            |

Nada fica solto na raiz, e pasta fora das seis não existe. A arrumação de 24/09/2026 mandou
para a quarentena, fora do repositório, três pastas de decisões já fechadas (`barra`,
`caixa-em-blocos`, `dock`) e treze imagens soltas.

### `walk/` — do portão

O que `tests/browser/walk.mjs` fotografa em cada rodada de `npm run validate`. **É aqui que se
olha depois de mexer em tela.** O nome de cada arquivo está escrito no script: mudar um é mudar
o outro.

### `cost/` — do medidor de fps

`tests/browser/screen-cost.mjs`, que abre janela e mede o material contra a taxa do monitor.
Ele está **fora** do portão.

### `decisions/` — as opções lado a lado

Uma subpasta por decisão. Cada uma tem as variantes com nome que diz o que ela é, e uma
`comparison.png` com todas juntas — que é a imagem que ele abre.

- `month-in-index/` — ciclo 14, passo 3.4: onde entra o mês do texto para duas perguntas gêmeas
  pararem de ler igual. **Aberta**, esperando decisão;
- `type-scale/` — cinco escalas e a escolhida (`final-chosen.png`). Fechada.

### `defects/` — o "antes"

Só entra imagem cujo nome declara o defeito medido (`-cracked`, `-overflow`, `-clipped`). Ela
vive enquanto o conserto valer, porque é o que prova que o defeito existiu.

### `reference/` — como a peça é hoje

O estado corrente de uma peça ou janela: o Gabinete, a carta em suas espécies, o sinete, a
Câmara e os tamanhos de tela. **Uma imagem por peça** — quando a peça muda, a imagem é
substituída, não acumulada.

### `probes/` — o rascunho de uma sessão

- `measurements/` — geometria de uma peça num mês específico;
- `discarded/` — tentativas descartadas de um ajuste visual;
- `sweep/` — as oito cartas e o índice, fotografados de uma vez;
- `old-walk/` — sobras de passos que o passeio não tem mais. **Não se refazem.**

## Como nomear uma captura nova

1. **A pasta já diz o contexto** — não repita `walk-`, `probe-` ou `measure-` no nome;
2. **O nome diz a peça, não a sessão** — `letter-question.png`, nunca `final2.png`;
3. **Variante de decisão leva letra e descrição:** `a-end-of-subject.png`;
4. **Inglês, sem acento, kebab-case**, como todo caminho do projeto.

⚠ `probes/discarded/cabinet-24.png` tem 6 KB para 1440×980 — é captura em branco, e ficou para
não apagar evidência de sessão anterior sem ele pedir.
