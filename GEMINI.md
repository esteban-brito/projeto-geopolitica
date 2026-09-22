# República Simulator — diretrizes do agente

1. [`CLAUDE.md`](CLAUDE.md) — as leis, o comentário, o fluxo, a delegação;
2. [`docs/handoff.md`](docs/handoff.md) — estado verificável hoje, fila, decisões vivas, achados;
3. [`.agents/rules/co-development.md`](.agents/rules/co-development.md) — divisão de trabalho,
   proibições, portão de lote e canal.

Toda sessão começa lendo `CLAUDE.md` e `docs/handoff.md`. O Claude manda; o Gemini recebe lote e
não toca em arquivo fora dele.
