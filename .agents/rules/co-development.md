# Regras de co-desenvolvimento — República Simulator

## 0. Leitura obrigatória, nesta ordem

1. `CLAUDE.md` — as leis, o comentário, o fluxo, a delegação;
2. `docs/handoff.md` — estado verificável hoje, fila, decisões vivas, achados abertos.

## 1. Divisão de trabalho

- **Claude** manda: modela o motor (`src/domain/`, `src/application/`, `src/state/`), escreve
  tela e folha (`src/ui/`, `styles/`, `src/app/`, `app.mjs`), escreve provas e guardas (`tests/`),
  calibra (`src/data/`), escreve os docs e os ciclos, e decide o que o Gemini faz.
- **Gemini (Antigravity)** recebe lotes fechados: corte de prosa em arquivos nomeados, inventário
  (exports sem consumidor, `tmp/`), pesquisa factual e normativa, monitoramento do terminal do
  Claude. Não toca em arquivo fora do lote.

## 2. Proibições

1. **Nunca** alterar `tests/` ou guarda para fazer prova passar. O erro está no código.
2. **Nunca** alterar calibragem em `src/data/` para destravar portão. Número divergente é achado
   e vai para o handoff.
3. **Nunca** alterar esquema ou persistência (`src/state/save.mjs`, `schema.mjs`) sem ordem.
4. **Nunca** apagar linha de tipo (`@param`, `@returns`, `@typedef`, `@property`, `@type`),
   nem inline: é contrato, e o `tsc` reprova.
5. **Nunca** relatar bug sem reprodução: tela, o que fez, o que apareceu. Lista tirada de doc
   é apagada.

## 3. Acoplamentos que uma prova lê

1. **A tabela de contagens em `docs/handoff.md`** (`| coleção | quantos |`): cobrada por
   `tests/suites/catalog.mjs`. Rótulos e formato de 2 colunas não mudam.
2. **A tabela de codinomes em `docs/standards.md` §3**: cobrada por `tests/guards/codenames.mjs`.
   Não muda sem sincronizar pastas e cabeçalhos em `src/domain/`.

## 4. Portão de um lote de prosa

1. O código sem comentário sai **idêntico** antes e depois (`node tmp/so-prosa.mjs <arquivo>`);
2. `npm run check`, `npm run types` e `npm test` verdes;
3. o resultado vai para `tmp/para-claude.md` com os números (prosa antes → depois por arquivo);
4. parar. O Claude confere e aceita, ou devolve com a regra.

## 5. Canal

O Claude fala pelo `tmp/gemini.mjs` (enviar / ler / fila / limpar). Mensagem enviada com o
Gemini trabalhando fica na fila e não é lida — o Gemini termina o que está fazendo e só então
lê a próxima ordem.

## 6. Formato da devolução

1. o que rodou · 2. o que passou · 3. o que quebrou · 4. números (prosa por arquivo) · 5. parado.
