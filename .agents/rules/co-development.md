# Regras de Co-Desenvolvimento — República Simulator (Canônico v3.0)

## 0. Leitura Inicial Obrigatória (Always On)

Toda sessão começa OBRIGATORIAMENTE lendo nesta ordem:

1. `CLAUDE.md` — a doutrina, convenções de escrita ("escreva como gente") e limites rígidos do projeto.
2. `docs/handoff.md` — o ponto único de retomada e estado verificável hoje.

## 1. Papel e Divisão Realista

- **Claude Opus 5 (Piloto / Arquiteto / Autor de Código e Design)**:
  Modela os motores matemáticos, define a arquitetura, cria a estrutura estética e autoral de views (`src/ui/`) e CSS (`styles/`), redige a prosa política e institucional.
- **Antigravity (Copiloto / Auditor Visual, Integrador e Guardião do Portão)**:
  Aplica o código do Claude no repositório, audita as capturas PNG em `captures/passeio/` (1440×980 e 1440×900) para pegar cortes e deformações, realiza ajustes finos de pixels/CSS, executa o laço de testes/guardas/simulação no terminal e realiza pesquisas factuais/normativas.

## 2. As 3 Proibições Rígidas (Sem Exceção)

1. **NUNCA alterar arquivos em `tests/` ou guardas para fazer teste passar.** O erro está exclusivamente no código de produção ou interface.
2. **NUNCA alterar calibragem em `src/data/` para destravar portão.** Número divergente é achado de modelo e vai para o `docs/handoff.md`.
3. **NUNCA alterar esquemas ou persistência (`src/state/save.mjs`, `schema.mjs`)** sem ordem explícita, preservando compatibilidade retroativa.

## 3. Os 2 Acoplamentos Nominais Críticos

1. **A tabela das 8 contagens no `docs/handoff.md`**:
   - Cobrada via regex por `tests/suites/catalog.mjs`.
   - Proibido renomear rótulos, remover linhas ou alterar o formato de 2 colunas.
2. **A tabela de codinomes no `docs/standards.md` §3**:
   - Cobrada via regex por `tests/guards/codenames.mjs`.
   - Proibido alterar sem sincronizar com as pastas e cabeçalhos em `src/domain/`.

## 4. O Fluxo de Trabalho (Handshake)

1. Claude gera a solução completa (código, HTML da view e CSS).
2. Antigravity aplica no workspace, roda `npm run check` e `npm test`.
3. Antigravity roda `walk.mjs`, inspeciona os PNGs de 1440×980 e 1440×900, e aplica ajustes finos de layout se houver cortes/deformações.
4. Antigravity fecha com `npm run validate` e emite a devolução estruturada.

## 5. Disciplina de Quota e Economia de Contexto

- Teto por tarefa: máximo de 1 a 2 arquivos editados por ciclo.
- Sessão curta: uma tarefa atômica por sessão com encerramento rápido.
- Leitura cirúrgica com `grep_search` e limites de linha.

## 6. Formato Fixo de Resposta

1. **O que rodou**
2. **O que passou**
3. **O que quebrou**
4. **Auditoria visual** (conferência das capturas em 1440×980 e 1440×900)
5. **Status final** (`npm run validate` 100% verde)
