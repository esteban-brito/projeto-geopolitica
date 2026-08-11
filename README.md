# Planalto

Simulador de presidência do Brasil: política, economia e opinião pública ligadas
por um grafo de causas e efeitos. Site estático — sem build, sem framework e sem
dependência de runtime.

```bash
npm ci
npm run serve      # http://127.0.0.1:5173/
npm run simulate   # roda um mandato inteiro no terminal, sem tela
npm run validate   # guardas + tipos + lint + formato + testes
```

## Onde ler

- [`docs/handoff.md`](docs/handoff.md) — **comece aqui**: estado verificado,
  achados abertos e o que ainda não existe;
- [`docs/standards.md`](docs/standards.md) — as convenções travadas, a estrutura,
  o sistema visual e a tabela de motores.

## Os motores

Um turno é um mês. Apenas TEMPORAL e ECLUSA consomem aleatoriedade, cada um do
seu próprio fluxo — fluxo único faria um evento a mais deslocar o índice e mudar
o resultado de uma votação sem relação com ele.

```
TEMPORAL  ── o mês traz um choque?                          contrato
ECLUSA    ── o que estava na pauta é votado, e a que preço  IMPLEMENTADO
CASCATA   ── efeitos vigentes viram deltas, com defasagem   contrato
CORRENTE  ── o passo macroeconômico do mês                  contrato
LASTRO    ── receita, despesa, saldo, dívida                IMPLEMENTADO
SONDA     ── o que foi divulgado vira aprovação por segmento contrato
DELTA     ── deriva a rede legível do que acabou de acontecer contrato
```

O espaço discricionário de LASTRO é a moeda com que ECLUSA paga: os dois se
acoplam pelo orçamento, e não por uma regra escrita para isso. Quem os compõe é
[`src/application/turn.mjs`](src/application/turn.mjs), na ordem que **é** a
mecânica: primeiro o teto diz quanto cabe, depois a promessa é confrontada com o
que cabe, e só então o Congresso vota — **com a verba que foi paga, não com a que
foi falada**. Promessa não honrada derruba a lealdade, e como o teto pode fechar
sozinho por aritmética, existe um caminho em que o governo promete de boa fé, não
entrega e perde a base sem que nenhum evento roteirizado exista.

## Simulação

`npm run simulate` roda um mandato inteiro em milissegundos e imprime a série
temporal — mês, pauta, previsão, placar, verba prometida contra verba paga, folga
do discricionário, dívida sobre o PIB e o humor da base.

```bash
npm run simulate -- --policy promessa --months 48
npm run simulate -- --seed 7 --gdp-growth -0.02 --quiet
```

Ele existe porque a calibragem foi girada contra os testes, e **prova verde diz
que a regra vale, não que o número é bom**. A pergunta que faltava instrumento —
"como esta partida se comporta ao longo de 48 meses?" — não se responde apertando
um botão quarenta e oito vezes no navegador.

As quatro políticas são **sondas, e não adversários**: cada uma exagera um
comportamento para isolar um efeito. `parado` mede a queda natural, `base` mede o
custo de apenas continuar governando, `agenda` joga com prudência fiscal e
`promessa` oferece verba cheia sem olhar o caixa — a distância entre as duas
últimas é o preço da imprudência, medido em meses de base.

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
