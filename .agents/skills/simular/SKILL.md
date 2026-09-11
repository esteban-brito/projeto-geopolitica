---
name: simular
description: Executa a simulação de 48 meses de mandato com as sondas de política pública.
---

# /simular — Simulação de Mandato

Executa os 48 turnos mensais no terminal para validar calibragem e impactos orçamentários/políticos.

## Procedimento

1. Execute no terminal:
   `npm run simulate`
   (Ou para testar com partido da base: `npm run simulate -- --party liberais-conservadores`)
2. Compare os resultados com a tabela de calibragem em `docs/handoff.md`.
3. Se mexeu em motor (`src/domain/`, `src/application/`) ou dados (`src/data/`), reescreva a série no `docs/handoff.md` no mesmo commit.
