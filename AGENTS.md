# República Simulator — Contrato Universal dos Agentes

Contrato canônico entre os modelos de IA (Claude, GPT e Gemini) e o repositório.
Evita desvio de contexto (_context drift_) e fixa a autoridade das regras.

## 1. Identidade e Runtime

- **Simulador de presidência do Brasil.** Mandato de 48 meses;
- **Site estático puro:** zero build, zero dependência de runtime, ESM puro de navegador servido como arquivo;
- **Domínio puro (`src/domain/`):** sem DOM, sem relógio, sem `Math.random`. Aleatoriedade entra apenas por fluxo injetado com semente; todo saque grava a posição gasta;
- **A tela pergunta ao motor, nunca refaz conta:** toda informação exibida sai da mesma função que o turno executa;
- **Sem paredes artificiais:** nada de `if (proibido) return`. A pergunta é sempre quanto custa;
- **Português na interface e na prosa; inglês em código, caminhos e identificadores.**

## 2. As Duas Verdades

Neste projeto existem duas camadas distintas de validação:

| Camada                    | Pergunta Central                                                                                                    | Como se Prova                                                                                        | Ferramentas                                                                            |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **Verdade de Engenharia** | "O código cumpre rigorosamente a especificação técnica sem quebrar contratos?"                                      | Guardas de arquitetura, testes unitários, checagens de tipos, linter e testes de navegador.          | `npm run check`<br>`npm run types`<br>`npm test`<br>`npm run walk`<br>`npm run monkey` |
| **Verdade de Design**     | "A regra produz um jogo equilibrado, politicamente verossímil e sem estratégias dominantes que destruam o desafio?" | Simulação de 48 meses com sondas, distribuições estatísticas, caça a exploits e análise adversarial. | `npm run simulate`<br>`tools/simulate.mjs`<br>Ultrareviews externos                    |

Passar nos 334 testes unitários prova a verdade de engenharia; não garante que a regra seja bom game design. Um exploit econômico dominante destrói o jogo mesmo com portão 100% verde.

## 3. Papéis da Tríade de Desenvolvimento

Os papéis são permanentes na arquitetura do projeto; os modelos e ambientes são os executores padrão atuais:

| Papel                               | Responsabilidade Central                                                                                                                     | Foco de Atuação                      | Executor Padrão Atual         |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------- | :---------------------------- |
| **Arquiteto de Domínio**            | Modela motores (`src/domain/`), escreve testes de especificação antes do código, conduz novos ciclos e refatorações conceituais.             | Integridade de domínio e contratos   | Claude (Claude Code / CLI)    |
| **Auditor Adversarial / Red Team**  | Caça a exploits sistêmicos, análise de incentivos, desequilíbrios em simulações de 48 meses e Ultrareviews de diffs (`/code-review ultra`).  | Game design e resistência a exploits | GPT (ChatGPT / Codex / Astra) |
| **Centro Operacional & Engenharia** | Execução de lotes com prova sintática (`so-prosa.mjs`), validação pesada (`validate`), automação local, inventários e tarefas em background. | Execução determinística e portão     | Gemini (Antigravity)          |

## 4. Regra de Independência entre Autor e Revisor

- **Quem implementa uma mudança importante nunca é o único modelo que a aprova.**
- Revisões externas cruzadas (especialmente via Ultrareview em modelo desacoplado) são obrigatórias antes de fechar grandes sistemas.
- **O Diretor do Jogo (Usuário) é a autoridade máxima.** Nenhuma IA e nenhum teste substitui a decisão humana sobre o que torna o jogo interessante.

## 5. Proibições Rígidas

1. **Nunca** adicionar bibliotecas externas ou dependências de runtime via npm;
2. **Nunca** usar `Math.random` ou relógio do sistema no domínio;
3. **Nunca** alterar testes ou guardas para fazer prova passar (o defeito está no código sob teste);
4. **Nunca** alterar calibragem em `src/data/` para destravar validação (número divergente é achado e vai para o handoff);
5. **Nunca** remover linhas de contrato JSDoc (`@typedef`, `@param`, `@property`, `@returns`, `@type`).

## 6. Fluxo de Validação Canônico

```bash
npm run check      # 13 guardas de arquitetura (2s)
npm run types      # tsc -p jsconfig.json (tipagem JSDoc estrita)
npm test           # 334 provas unitárias puras (2s)
npm run walk       # passeio Playwright em 1440x980 e 1440x900 (72s)
npm run monkey     # macaco de estabilidade com semente (24s)
npm run validate   # validação completa de ponta a ponta (~130s)
npm run simulate   # 48 meses de mandato com as sondas fiscais e políticas
npm run serve      # servidor de desenvolvimento em http://127.0.0.1:5173/
```

## 7. Leitura Obrigatória e Documentação Canônica

### Retomada econômica de contexto

Por pedido do usuário em 23/09/2026, **não repetir o estudo integral do repositório a cada sessão**.
Comece por [`docs/agent-brief.md`](docs/agent-brief.md), confira `git status --short` e leia
as seções **Estado**, **Fila** e **Decisões vivas** do handoff. Depois consulte apenas os
contratos, achados, arquivos e trechos pertinentes à tarefa. A lista abaixo é o mapa das
fontes canônicas; não exige reler todos os ciclos e pesquisas na abertura.

O guia resume o estudo, não substitui as fontes. Código e handoff atuais prevalecem sobre
seu retrato datado. Para uma retomada sem tarefa nova, essa leitura curta basta; não rode
validações nem simulações só para recuperar contexto. Amplie a leitura quando a tarefa exigir.

1. [`docs/handoff.md`](docs/handoff.md) — Estado verificável hoje, fila, decisões vivas e série histórica;
2. [`CLAUDE.md`](CLAUDE.md) — As 12 leis do projeto, comentário medido e delegação;
3. [`.agents/rules/co-development.md`](.agents/rules/co-development.md) — Regras operacionais de co-desenvolvimento;
4. [`docs/standards.md`](docs/standards.md) — Padrões técnicos e mapeamento de guardas;
5. [`docs/cycles/`](docs/cycles/) — Ciclo ativo e histórico de planejamento.
