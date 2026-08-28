# `captures/` — a evidência que o portão não sabe olhar

> `npm run validate` mede geometria, recorte e contraste. **Ele não vê que a peça ficou feia**,
> e três defeitos já atravessaram tipo, guarda e cem provas para morrer na imagem. Esta pasta é
> o único passo que continua sendo humano.

A pasta é ignorada pelo git (`.gitignore`) — **só este mapa é versionado.** Imagem é evidência
de uma medição, não fonte: ela se refaz rodando o comando de novo.

## As seis pastas, e a regra de cada uma

| pasta                    | quem escreve                | pode apagar?                                    |
| ------------------------ | --------------------------- | ----------------------------------------------- |
| `passeio/`               | `npm run walk`              | **sim** — reescrita inteira a cada rodada        |
| `custo/`                 | `npm run screen`            | **sim** — reescrita a cada rodada                |
| `decisoes/`              | à mão, para ele escolher    | **não** enquanto a decisão estiver aberta        |
| `defeitos/`              | à mão, ao achar um defeito  | **não** — é o "antes" que justifica o conserto   |
| `referencia/`            | à mão, quando a peça muda   | **não** — é o "como está hoje" de cada peça      |
| `sondas/`                | à mão, durante uma sessão   | **sim** — medição de sessão passada              |

### `passeio/` — 9 imagens, do portão

O que `tests/browser/walk.mjs` fotografa em cada rodada de `npm run validate`. **É aqui que se
olha depois de mexer em tela.** Não edite nome de arquivo sem mexer no script: os dois nomes
são o mesmo.

### `custo/` — 1 imagem, do medidor de fps

`tests/browser/screen-cost.mjs`, que abre janela e mede o material contra a taxa do monitor.
Ele está **fora** do portão.

### `decisoes/` — as opções lado a lado

Uma subpasta por decisão. Cada uma tem as variantes com nome que diz o que ela é, e uma
`comparacao.png` com todas juntas — que é a imagem que ele abre.

- `mes-no-indice/` — ciclo 14, passo 3.4: onde entra o mês do texto para duas perguntas gêmeas
  pararem de ler igual. **Aberta**, esperando decisão;
- `escala-de-tipo/` — cinco escalas e a escolhida (`final-escolhida.png`). Fechada.

### `defeitos/` — o "antes"

Só entra imagem cujo nome declara o defeito medido (`-rachado`, `-estourado`, `-cortado`).
Ela vive enquanto o conserto valer, porque é o que prova que o defeito existiu.

### `referencia/` — como a peça é hoje

O estado corrente de uma peça ou janela: o Gabinete, a carta em suas três espécies, o sinete,
a Câmara, e os três tamanhos de tela. **Uma imagem por peça** — quando a peça muda, a imagem é
substituída, não acumulada.

### `sondas/` — o rascunho de uma sessão

- `medidas/` — geometria de uma peça num mês específico;
- `probes/` — tentativas descartadas de um ajuste visual;
- `varredura/` — as oito cartas e o índice, fotografados de uma vez;
- `passeio-antigo/` — sobras de passos que o passeio não tem mais. **Não se refazem.**

## Como nomear uma captura nova

1. **A pasta já diz o contexto** — não repita `walk-`, `probe-`, `medida-` no nome;
2. **O nome diz a peça, não a sessão** — `carta-pergunta.png`, nunca `final2.png`;
3. **Variante de decisão leva letra e verbo:** `a-fim-do-assunto.png`;
4. **Português, sem acento, kebab-case.**

⚠ `sondas/probes/gabinete-24.png` tem 6KB para 1440×980 — é captura em branco, e ficou como
está para não apagar evidência de sessão anterior sem ele pedir.
