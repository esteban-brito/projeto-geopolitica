# República Simulator

Simulador de presidência do Brasil. Site estático: sem build, sem framework e sem
dependência de runtime — ESM puro servido como arquivo.

```bash
npm ci
npm run serve      # http://127.0.0.1:5173/
npm run simulate   # um mandato inteiro no terminal; --policy <sonda>, --party <bancada>, --seed <n>
npm run validate   # o portão: guardas, tipos, lint, formato, provas, passeio e macaco
npm run check      # só as guardas; `npm test` roda só as suítes
```

## Onde ler

- [`docs/handoff.md`](docs/handoff.md) — **comece aqui**: estado verificável hoje, fila,
  decisões vivas e achados abertos. Todo número de estado mora nele;
- [`docs/spec/master-spec.md`](docs/spec/master-spec.md) — a especificação mestra, autoridade
  de design;
- [`docs/spec/migration-map.md`](docs/spec/migration-map.md) — o código atual confrontado com a
  especificação, e o plano em vigor, em lotes;
- [`docs/standards.md`](docs/standards.md) — as convenções, a tabela de motores e qual guarda
  cobra cada regra;
- [`docs/adr/`](docs/adr/) — decisões que não se reabrem sem pedido;
- [`docs/journal.md`](docs/journal.md) — o histórico, sessão a sessão. Leia pelo fim, e para
  saber por que algo foi decidido, nunca para saber o estado;
- [`docs/cycles/`](docs/cycles/) e [`docs/research/`](docs/research/) — os planos antigos e as
  pesquisas. São registro.

Para agentes: [`AGENTS.md`](AGENTS.md) é o contrato comum; [`CLAUDE.md`](CLAUDE.md) e
[`GEMINI.md`](GEMINI.md) apontam para ele.

## Os motores

Um turno é um mês. Cada motor é puro, e quem os compõe é
[`src/application/turn.mjs`](src/application/turn.mjs); motor nenhum chama outro. Só ECLUSA
consome aleatoriedade hoje, de um fluxo próprio derivado da semente.

```
ECLUSA    ── o que estava na pauta é votado, e a que preço
MALHA     ── a capacidade do Estado de entregar
CORRENTE  ── PIB, inflação, juro, desemprego e o custo da dívida
LASTRO    ── receita, despesa, teto, saldo e dívida
SONDA     ── o que foi divulgado vira aprovação por segmento
ESTRATO   ── a pilha de normas lida como faixa vigente
ELENCO    ── as pessoas do mandato, e a memória de cada uma
CALDEIRA  ── a pressão de cada grupo, e as três rupturas
DELTA     ── a rede causal legível do que aconteceu
VONTADE   ── o que um ator faz com o que lhe chega (ainda sem consumidor no jogo)
```

Os codinomes são provisórios. A tabela completa está em
[`docs/standards.md`](docs/standards.md) §3.

## Simulação

`npm run simulate` roda um mandato em milissegundos e imprime a série: pauta, placar, verba
prometida contra paga, folga do discricionário, dívida sobre o PIB e o humor da base. As
políticas são **sondas**, e não adversários: cada uma exagera um comportamento para isolar um
efeito. Prova verde diz que a regra vale; a série diz se o número é bom.

## Validação

- `npm run check` — as guardas estruturais. Cada uma carrega provas sintéticas que reintroduzem
  o defeito e exigem acusação;
- `npm test` — as suítes de `tests/suites/`, escritas como propriedades;
- `npm run walk` — usa a tela em 1440×980 e 1440×900 e mede rolagem, recorte, sobreposição e
  contraste no pixel. Está dentro do `validate`;
- `node tools/check-links.mjs` — todo caminho citado num arquivo versionado vivo existe;
- `npm run screen` — mede o custo do material com GPU. Fica fora do `validate`: sem GPU, os dois
  braços caem juntos e o número mente.

O portão mede geometria e contraste; **não vê que a peça ficou feia**. As capturas em
`captures/` existem para isso, e abri-las é o passo que continua sendo humano.
