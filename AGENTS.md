# República Simulator — o contrato dos agentes

Simulador da Presidência do Brasil. Site estático: zero build, zero dependência de runtime, ESM
puro servido como arquivo. Este é o único contrato entre os agentes (Claude e Gemini) e o
repositório; `CLAUDE.md` e `GEMINI.md` só o importam. Em conflito, a ordem atual do Diretor (o
dono do jogo) vence qualquer texto, e o texto antigo se emenda.

## 1. Ler antes de mexer

1. [`docs/vision.md`](docs/vision.md): o que o jogo é e para que;
2. [`docs/handoff.md`](docs/handoff.md): estado verificável, fila, decisões vivas, achados. Primeira
   leitura de toda sessão; última escrita de toda sessão que muda algo;
3. [`docs/standards.md`](docs/standards.md): as convenções e a guarda que cobra cada uma;
4. o assunto da tarefa: a especificação em [`docs/spec/`](docs/spec/), o ciclo ativo em
   [`docs/cycles/`](docs/cycles/), as decisões em [`docs/adr/`](docs/adr/).

O journal (`docs/journal.md`) começa em 01/10/2026; o registro anterior está congelado em
`docs/archive/` e se consulta por busca, nunca inteiro. Sem varredura de pastas para se ambientar:
leia o necessário para a tarefa, e não rode portão nem simulação só para se ambientar. Número de
estado se lê no handoff.

## 2. As leis

- **Português na prosa e na interface; inglês em código e caminhos.** Sem acento em identificador;
  com acento correto em comentário, texto e documento.
- **Escreva como gente.** Frase curta, sujeito e verbo na ordem normal, número no lugar do adjetivo.
  Vale para o jogo, os documentos e a resposta ao Diretor. Sem reviravolta final, inversão poética,
  paralelismo de efeito nem metáfora sem necessidade.
- **A tela não refaz conta do motor: ela pergunta.** Toda leitura mostrada enquanto o jogador decide
  sai da mesma função que o motor usa. Uma previsão pergunta à posição com que o mês seguinte abre,
  nunca a uma cópia parcial da de hoje.
- **A tela mostra o que a Presidência sabe**, nunca o estado oculto, salvo o fato que a Presidência
  conhece (especificação §6.1, invariante 21). As consultas que ainda leem o oculto estão no
  [mapa de migração](docs/spec/migration-map.md) §5.6, cada uma com o lote que a corrige.
- **Motor nenhum chama outro motor.** Quem compõe é `src/application/`.
- **O domínio é puro:** sem DOM, sem relógio, sem `Math.random`. Aleatoriedade entra por fluxo
  injetado, todo saque grava a posição que gastou, e o mandato inteiro se refaz da semente.
- **Tudo tem preço, nada tem muro.** Nunca `if (proibido) return`; a pergunta é quanto custa.
- **Nada de número inventado.** Todo valor mostrado tem motor atrás ou catálogo com fonte; sem isso,
  a informação fica ausente e declarada.
- **Estado que sobrevive a uma repintura guarda id, nunca índice.** Ouvinte em `document` ou
  `window` arma uma vez.
- **O mundo é real; os nomes das pessoas são inventados** ([ADR 0003](docs/adr/0003-real-world-invented-people.md)).
  Os papéis que pesam no 1º ano se inspiram em quem ocupa o cargo de verdade (papel, ideologia,
  temperamento), nunca no nome nem na história; o nome real só aparece em `docs/research/`.
- **A IA não entra no turno** ([ADR 0001](docs/adr/0001-ai-stays-out-of-the-turn.md)) e **gera
  vocabulário, nunca efeito** ([ADR 0002](docs/adr/0002-ai-generates-vocabulary-not-effect.md)).
  IA por API não entra, nem em partida nem fora dela.
- **Sem dependência de runtime.** Ferramenta de desenvolvimento entra em `devDependencies`.

## 3. Comentário

Um comentário registra o que o código não consegue dizer: a alternativa testada e reprovada, com
o número que a reprovou. Nada mais.

- teto de 10 linhas por bloco, um bloco por decisão; cabeçalho de arquivo, 14. A guarda `prose`
  mede e reprova;
- não entra: data, nome, histórico de quem pediu, narrativa de reversão, o que o código já diz;
- meta: prosa em até 20% das linhas do jogo, nenhum arquivo acima de 25%;
- linha de tipo (`@typedef`, `@param`, `@property`, `@returns`, `@type`) é contrato: não conta no
  teto e nunca sai;
- bom: `/* Sem filtro: glass-support custou 17,9 fps aqui. */`

## 4. Fluxo

```bash
npm run validate   # guardas, links, tipos, lint, formato, provas, passeio e macaco (~150 s); tem de ficar verde
npm run check      # só as guardas (2 s)
npm test           # só as suítes (12 s)
npm run simulate   # 48 meses no terminal; --policy, --party, --seed, --cabinet none
npm run posse      # as provas de navegador da posse (~2 min), fora do validate
npm run serve      # http://127.0.0.1:5173/
npm run screen     # mede o material contra a taxa do monitor; fora do portão, abre janela
```

Três laços, cada um com ordem fixa:

- **folha** (`src/ui/`, `styles/`): `npm run check`, depois abrir a captura em `captures/walk/`. O
  portão vê geometria, recorte e contraste, mas não sabe olhar: três defeitos já passaram por tipo,
  guarda e prova e só apareceram na imagem;
- **motor** (`src/domain/`, `src/application/`, `src/data/`, `src/state/`): `npm test`,
  `npm run simulate` e a série reescrita no handoff no mesmo commit, mesmo que não mude;
- **fechar item:** `npm run validate`, journal e handoff.

`validate` verde é obrigatório antes de dizer que algo está pronto. No `screen`, meça os dois
braços (com e sem filtro) na mesma rodada.

## 5. Bug, prova e revisão

- **Todo achado se reproduz antes de mexer**, com script em `tmp/` ou prova nova. O que não
  reproduz não se corrige: vai para o handoff com o que foi tentado.
- **A prova nasce antes do conserto e cai contra o código de hoje.** Bug de tela vira prova de
  navegador (`tests/browser/`); bug de motor, prova na suíte.
- **Teste verde prova engenharia, não design.** Equilíbrio e diversão se medem nas sondas de
  `simulate` e no teste do Diretor.
- **Mudança importante tem revisor diferente do autor:** `/code-review ultra <base>` (lê o diff da
  branch contra a base, teto de 8.000 linhas; para ler uma pasta inteira, a base é uma branch sem a
  pasta) ou o Gemini num lote de revisão. Achado de revisão é hipótese até reproduzir.

## 6. Os agentes

- **Claude** é o autor principal: motor, aplicação, estado, dados, tela, folhas, provas, guardas,
  documentos e pesquisa com fonte. Pesquisa jurídica se confere no Planalto (`curl`, porque o
  WebFetch leva ECONNRESET lá).
- **Gemini** recebe lotes fechados: fronteira de arquivos, portão explícito (`check`, `types`,
  `test`) e nada fora dela. Não altera prova, guarda, calibragem, esquema ou save.
- **Toda entrega se confere contra o código** antes de aceitar (`tools/prose-only.mjs` para lote de
  prosa, `tsc`, `grep`). Errada, volta com a regra concreta. Bug relatado só entra com reprodução:
  tela, passo e o que apareceu.
- **Lote de prosa:** o código sem comentário sai idêntico (`node tools/prose-only.mjs <arquivo>`);
  `check`, `types` e `test` verdes; a devolução diz o que rodou, o que passou, o que quebrou e a
  prosa antes e depois por arquivo; e para.
- **Lote mecânico (acento, nome, formato):** mude só o que o lote pede, letra por letra; nunca
  apague, junte ou acrescente linha ou palavra; rode a conferência antes de passar ao próximo
  arquivo; na dúvida (crase, sobretudo), não mexa e liste o caso na devolução; texto estranho,
  erro de digitação ou coisa fora do lote se lista na devolução, nunca se corrige por conta própria.
- **Canal:** `node tmp/agents/gemini.mjs enviar|ler|fila|limpar`. Mensagem enviada com o Gemini
  trabalhando fica na fila: cheque `fila` antes. Com ele trabalhando, nenhuma mudança do Claude
  fica sem commit na árvore: o lote manda desfazer o que não passa na conferência, e ele desfaz. Commit sempre com `git add` por nome.
- **Duas tabelas que provas leem:** a de contagens do handoff (`tests/suites/catalog.mjs`) e a de
  codinomes de `docs/standards.md` §3 (`tests/guards/codenames.mjs`). Formato e rótulos não mudam.

## 7. Não faça sem pedido

- começar um motor novo ou parte de ciclo não acordada;
- mudar calibragem (`src/data/`) para fazer prova passar: número errado é achado, vai ao handoff;
- mudar prova ou guarda para destravar: elas existem por defeito medido;
- mudar esquema ou save sem ordem;
- apagar arquivo do Diretor (`tmp/`, `docs/`): a lista vai ao handoff e ele diz sim;
- merge. Commit ao fim de cada etapa validada; push quando o plano aprovado incluir.

## 8. Recusa e decisão

Toda recusa registrada aqui é de uma de três famílias, e só uma trava:

| família                 | exemplo                             | trava?                                  |
| ----------------------- | ----------------------------------- | --------------------------------------- |
| medição                 | `glass-support` custou 17,9 fps     | sim, até alguém remedir e mostrar outro |
| gosto dele, com data    | recusou um tom de marrom em 22/08   | não; expira, e se cita com a data       |
| generalização de agente | "madeira, couro e papel não entram" | não vale nada; apague ao encontrar      |

Antes de escrever uma proibição: é medição, ordem dele ou generalização? Na dúvida, pergunte a ele.

**A interface** evolui a partir da atual (ordem de 01/10): mesmos tokens, fontes, Liquid Glass,
mola, ícones e textos, com o estilo Apple + Football Manager + Civilization + Valorant entrando
como evolução do jogo inteiro. O vidro fica só em superfície pequena sobre fundo parado. Estilo é
ponto de partida, não teto; ao propor desenho, ofereça também o exótico.

## 9. O código

O mapa do repositório, pasta por pasta, está no [README](README.md#o-mapa). As camadas e o que
cada uma alcança, cobrados pela guarda `boundaries`:

- `src/main.mjs`, a entrada, só compõe: alcança `shell/`, `ui/`, `public/` e `state/`;
- `src/shell/`, a casca do navegador, alcança `ui/`, `public/`, `state/` e os irmãos;
- `src/ui/` são views puras: recebem dado e devolvem string;
- `src/public/` é a única porta da tela para o jogo;
- `src/application/` compõe os motores, e motor nenhum chama outro;
- `src/domain/` é puro: sem DOM, relógio nem `Math.random`;
- `prototypes/` não tem consumidor no jogo nem campo no save.

O mês: `settlement(state, orders)` resolve normas, separa execução de lei, calcula espaço e
pagamentos e monta o Congresso; `playMonth` resolve respostas e tramitação, aplica decisões, roda
capacidade, orçamento, economia e opinião, pressão e afastamento, e grava cartas, séries e o
estado seguinte. A ordem é a mecânica: leia a função antes de mexer. O save guarda o estado e a
posição do RNG; save de esquema diferente é recusado, sem migração automática.

## 10. Como responder

Curto, direto e em português: o resultado e o número que o sustenta. Relate o que foi feito, o que
falhou e o que ficou para depois, sem enfeite.
