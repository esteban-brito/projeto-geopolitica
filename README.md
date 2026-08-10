# Planalto

Simulador de presidência do Brasil: política, economia e opinião pública ligadas
por um grafo de causas e efeitos. Site estático — sem build, sem framework e sem
dependência de runtime.

```bash
npm ci
npm run serve      # http://127.0.0.1:5173/
npm run validate   # guardas + tipos + lint + formato + testes
```

## Onde ler

- [`docs/handoff.md`](docs/handoff.md) — **comece aqui**: estado verificado,
  achados abertos e o que ainda não existe;
- [`docs/standards.md`](docs/standards.md) — as convenções travadas, a estrutura,
  o sistema visual e a tabela de motores.

## Os motores

Um turno é um mês. Apenas TEMPORAL e ECLUSA consomem aleatoriedade.

```
TEMPORAL  ── o mês traz um choque?
ECLUSA    ── o que estava na pauta é votado, e a que preço
CASCATA   ── efeitos vigentes viram deltas, com defasagem
CORRENTE  ── o passo macroeconômico do mês
LASTRO    ── receita, despesa, saldo, dívida
SONDA     ── o que foi divulgado vira aprovação por segmento
DELTA     ── deriva a rede legível do que acabou de acontecer
```

## Validação

`npm run check` roda as guardas estruturais. Cada uma carrega **provas
sintéticas** que reintroduzem o defeito que ela existe para pegar e exigem que
ela acuse — guarda que nunca falhou é cobertura presumida, não cobertura.

`npm test` roda as suítes de `tests/suites/`, escritas como **propriedades** e
não como exemplos: elas afirmam o que vale para todo estado válido, e não o que
vale para um. A mesma exigência das guardas se aplica — a suíte do reducer prova
que sua asserção central consegue falhar.

`npm run screen` abre a tela com GPU e mede o custo do material contra um braço
de controle sem filtro. Ele vive em `tests/browser/` e **fora** do `validate`:
abre navegador com janela, e `validate` precisa rodar rápido e sem tela.
