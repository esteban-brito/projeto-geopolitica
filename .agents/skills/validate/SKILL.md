---
name: validate
description: Executa a validação completa do repositório (guardas, tipos, lint, formatação, testes unitários e passeio visual).
---

# /validate — Validação Completa do Repositório

Executa o portão completo do República Simulator:

- 13 guardas (`tests/run.mjs`)
- Links dos documentos (`tools/check-links.mjs`)
- Checagem de tipos TypeScript (`tsc -p jsconfig.json`)
- ESLint (`eslint .`)
- Prettier (`prettier --check .`)
- As suítes de testes unitários (`tests/suites/*.mjs`)
- Passeio visual com Playwright nas duas resoluções (`tests/browser/walk.mjs`)
- Macaco: ações aleatórias com semente (`tests/browser/monkey.mjs`)

## Procedimento

1. Execute no terminal:
   `npm run validate`
2. Reporte a saída estritamente no formato fixo de resposta:
   - **O que rodou**
   - **O que passou**
   - **O que quebrou**
   - **Status final**
