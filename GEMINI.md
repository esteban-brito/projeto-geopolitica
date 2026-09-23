# República Simulator — diretrizes do agente

1. [`AGENTS.md`](AGENTS.md) — contrato universal, as duas verdades e governança dos agentes;
2. [`docs/agent-brief.md`](docs/agent-brief.md) — guia compacto de arquitetura e retomada econômica;
3. [`CLAUDE.md`](CLAUDE.md) — as leis, o comentário, o fluxo, a delegação;
4. [`docs/handoff.md`](docs/handoff.md) — estado verificável hoje, fila, decisões vivas, achados;
5. [`.agents/rules/co-development.md`](.agents/rules/co-development.md) — divisão de trabalho,
   proibições, portão de lote e canal.

Toda sessão começa lendo `AGENTS.md`, `docs/agent-brief.md` e `docs/handoff.md` (Estado/Fila). O Claude manda no domínio; o Gemini recebe lote delimitado e não toca em arquivo fora dele.
