# República Simulator

Simulador de presidência do Brasil. Site estático: sem build, sem framework e sem
dependência de runtime — ESM puro servido como arquivo.

```bash
npm ci
npm run serve      # http://127.0.0.1:5173/
npm run simulate   # um mandato inteiro no terminal; --policy <sonda>, --party <bancada>, --seed <n>
npm run validate   # o portão: guardas, tipos, lint, formato, provas, passeio e macaco
npm run check      # só as guardas; `npm test` roda só as suítes
npm run posse      # as provas de navegador da posse, fora do validate
```

## Onde ler

| documento                                   | o quê                                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [`docs/vision.md`](docs/vision.md)          | o que o jogo é e para que; a autoridade mais alta                                               |
| [`docs/handoff.md`](docs/handoff.md)        | **comece aqui**: estado verificável, fila, decisões vivas, achados                              |
| [`docs/standards.md`](docs/standards.md)    | as convenções, os motores e a guarda que cobra cada regra                                       |
| [`docs/spec/`](docs/spec/README.md)         | como o jogo funciona, sistema por sistema, com a situação de cada documento                     |
| [`docs/cycles/`](docs/cycles/README.md)     | os planos de trabalho ativos; o [ciclo 33](docs/cycles/33-the-whole-game.md) é o plano em vigor |
| [`docs/research/`](docs/research/README.md) | pesquisas e fontes, com a situação de cada uma                                                  |
| [`docs/adr/`](docs/adr/)                    | decisões que não se reabrem sem pedido                                                          |
| [`docs/journal.md`](docs/journal.md)        | o que cada sessão fez e por quê                                                                 |
| [`docs/archive/`](docs/archive/)            | o que foi superado, inclusive o journal até 30/09 e os ciclos 01 a 31                           |
| [`docs/evidence/`](docs/evidence/README.md) | medições congeladas que o código e os documentos citam                                          |

Para agentes: [`AGENTS.md`](AGENTS.md) é o contrato único; [`CLAUDE.md`](CLAUDE.md) e
[`GEMINI.md`](GEMINI.md) o importam.

## Protótipo da posse

A posse com ministérios variáveis está em [`prototypes/posse/`](prototypes/posse/README.md):
`npm run serve` e abrir <http://127.0.0.1:5173/tmp/build/posse.html>. É um ensaio isolado, que o
[ciclo 34](docs/cycles/34-the-posse-rebuilt.md) vai refazer dentro do jogo.

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
VONTADE   ── o que um ator faz com o que lhe chega (o mundo vivo decide por ela todo mês)
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
- `npm run links` — todo caminho citado num arquivo versionado vivo existe. Está dentro do
  `validate`;
- `npm run screen` — mede o custo do material com GPU. Fica fora do `validate`: sem GPU, os dois
  braços caem juntos e o número mente.

O portão mede geometria e contraste; **não vê que a peça ficou feia**. As capturas em
`captures/` existem para isso, e abri-las é o passo que continua sendo humano.
