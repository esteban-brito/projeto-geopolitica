# CICLO 29 — SIMPLIFICAR: menos texto, menos estado, mais prova

> **Escrito em 21/09/2026, por ordem dele:** _"quero que você foque em simplificar o código,
> deixar tudo mais barato e eficiente, para você ter mais precisão também na hora de programar,
> toda hora você cria bugs."_ Ele aprovou o uso do Gemini para o que o Gemini faz bem.
>
> Os números são de 21/09 (`tmp/inventario-simplificar.mjs`, `tmp/inventario-3.mjs`,
> `tmp/custo-pintura.mjs`).

---

## 1 · O diagnóstico, em número

**Rodar é barato.** Abertura até a mesa pintada: 600ms. Uma pintura inteira (`paint`): 3 a 5ms.
Um arrasto de verba (`refresh`): 0,3ms. Heap: 5 MB. DOM: 616 nós. Não há o que otimizar em
tempo de execução; o custo do projeto é de **leitura e raciocínio**.

| o quê                                 | número                                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| código do jogo (sem testes)           | 14.300 linhas                                                                           |
| prosa do jogo (sem `@tipos`)          | **6.200 linhas — 30%**; motor 38%, tela 35%, folhas 20%                                 |
| testes                                | 9.000 linhas de código — mais que a tela                                                |
| chaves `data-*` distintas na tela     | **58**                                                                                  |
| `querySelector` / `innerHTML =`       | 56 / 24                                                                                 |
| escritas de estilo inline             | 50                                                                                      |
| funções de 100+ linhas                | 12 (`playMonth` 440 · `paint` 230 · `settlement` 217 · `armFlight` 203 · `armRail` 166) |
| provas de motor / provas de interação | ~300 / ~10                                                                              |

**Os bugs moram na tela, e são de três famílias:** estado espalhado em `data-*` com o `<ul>`
recriado a cada pintura; JS medindo o DOM e escrevendo outro pedaço do DOM; e nenhuma prova de
comportamento — os quatro defeitos de 21/09 (pílula 53px fora, rótulo por baixo do vidro,
pílula ausente nas oito áreas, medida com o hover dentro) não tinham prova, e a primeira prova
escrita achou três deles.

## 2 · A regra do ciclo

- **Um dono por arquivo.** O Gemini recebe 2 arquivos por lote e não toca em mais nada. Claude
  não toca nos arquivos do lote enquanto ele está aberto;
- **Prosa só muda prosa.** A devolução de um lote de comentários vem com a prova mecânica: o
  arquivo sem comentários é **idêntico** antes e depois (`tools/prose-only.mjs`);
- **Nada de motor, calibragem ou prova existente.** `src/domain/`, `src/data/` e `tests/` só
  mudam pela mão do Claude, e só com prova nova antes;
- cada lote fecha com `npm run check` e `npm test` verdes; cada item do Claude fecha com
  `npm run validate`, captura aberta e handoff reescrito;
- **commitar antes de começar** é decisão dele — e é a recomendação: são 3 dias em 18 arquivos.

## 3 · Os itens

| #   | o quê                                                                                                                                                                          | meta                                                | dono   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------ |
| 1   | **Prosa do jogo a ≤ 20%.** Fica só a lição medida — a alternativa testada e reprovada, com o número; sai data, citação, histórico e o que o código já diz (regra do CLAUDE.md) | 6.200 → ≤ 3.600 linhas; nenhum arquivo acima de 25% | Gemini |
| 2   | **`app.mjs` dividido:** persistência · entradas por tela · pintura · diálogos · manipuladores, em `src/ui/app/`. O entrypoint fica só com o wiring                             | 870 → ≤ 200 linhas de código; nenhuma função > 80   | Claude |
| 3   | **O menu é um objeto com um estado** (`rail.mjs`): das 8 chaves `data-*` ficam as 2 que o CSS lê (`flow`, `drawer`)                                                            | 8 → 2 chaves; `armRail` ≤ 80 linhas                 | Claude |
| 4   | **Provas de interação** em `tests/browser/`: gaveta, pílula, carta, diálogo, verba, troca de tela. Cada bug que ele vir vira uma prova antes do conserto                       | ≥ 30 provas de interação                            | Claude |
| 5   | **Exports sem consumidor** e **`tmp/`** (460 scripts, 28 citados): inventário por script, e a lista do que sai                                                                 | lista com prova; nada apagado sem o "sim" dele      | Gemini |

Ordem: 1 e 5 correm no Gemini enquanto Claude faz 2 → 3 → 4.

## 4 · O que não entra

- reescrever motor ou trocar arquitetura de estado — o motor é a metade que funciona;
- afrouxar guarda ou prova para destravar;
- "otimizar" tempo de execução: não há o que otimizar (§1).
