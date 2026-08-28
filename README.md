# Planalto

Simulador de presidência do Brasil: política, economia e opinião pública ligadas
por um grafo de causas e efeitos. Site estático — sem build, sem framework e sem
dependência de runtime.

```bash
npm ci
npm run serve      # http://127.0.0.1:5173/ — doze telas, jogaveis
npm run simulate   # roda um mandato inteiro no terminal, sem tela
npm run validate   # guardas + tipos + lint + formato + testes + passeio — o portao
npm run check      # so as guardas, 2s; `npm test` roda so as suites
```

## Onde ler

- [`docs/handoff.md`](docs/handoff.md) — **comece aqui**: estado verificado, achados
  abertos, e para onde o projeto vai. Ele é curto de propósito — só entra o que é
  verificável hoje;
- [`docs/journal.md`](docs/journal.md) — o histórico, sessão a sessão. ⚠ **Todo número
  dele tem a data em que foi medido**, e envelhece calado: leia para saber por que uma
  decisão foi tomada, nunca para saber o estado do projeto;
- [`docs/standards.md`](docs/standards.md) — as convenções travadas, a estrutura,
  o sistema visual e a tabela de motores;
- [`docs/cycles/`](docs/cycles/) — o que foi acordado fazer, e por quê. O que muda a
  natureza do jogo é o [ciclo 4](docs/cycles/04-a-republica-responde.md), em que a lei
  deixa de ser um número e vira um texto;
- [`docs/adr/`](docs/adr/) — as decisões que não se reabrem sem pedido;
- [`docs/research/`](docs/research/) — os briefings de pesquisa e o que voltou
  deles. É de lá que vêm as rubricas reais do catálogo.

## Os motores

Um turno é um mês. Apenas TEMPORAL e ECLUSA consomem aleatoriedade, cada um do
seu próprio fluxo — fluxo único faria um evento a mais deslocar o índice e mudar
o resultado de uma votação sem relação com ele.

```
TEMPORAL  ── o mês traz um choque?                           contrato
ECLUSA    ── o que estava na pauta é votado, e a que preço   IMPLEMENTADO
MALHA     ── a capacidade do Estado de entregar              IMPLEMENTADO
CASCATA   ── efeitos vigentes viram deltas, com defasagem    contrato
CORRENTE  ── PIB, inflação, juro, desemprego e o custo da dívida  IMPLEMENTADO
LASTRO    ── receita, despesa, saldo, dívida                 IMPLEMENTADO
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
npm run simulate -- --seed 7 --shock 0.02 --quiet
```

Ele existe porque a calibragem foi girada contra os testes, e **prova verde diz
que a regra vale, não que o número é bom**. A pergunta que faltava instrumento —
"como esta partida se comporta ao longo de 48 meses?" — não se responde apertando
um botão quarenta e oito vezes no navegador.

As cinco políticas são **sondas, e não adversários**: cada uma exagera um
comportamento para isolar um efeito. `herdado` não toca em nada e mede o que o
orçamento do antecessor faz sozinho, `piso` põe tudo no mínimo legal e mede a
margem de manobra real, `base` mede o custo de apenas continuar governando,
`agenda` joga com prudência fiscal e `promessa` oferece verba cheia sem olhar o
caixa — a distância entre as duas últimas é o preço da imprudência, medido em
meses de base.

## Validação

`npm run check` roda as guardas estruturais. Cada uma carrega **provas
sintéticas** que reintroduzem o defeito que ela existe para pegar e exigem que
ela acuse — guarda que nunca falhou é cobertura presumida, não cobertura.

`npm test` roda as suítes de `tests/suites/`, escritas como **propriedades** e
não como exemplos: elas afirmam o que vale para todo estado válido, e não o que
vale para um. A mesma exigência das guardas se aplica — a suíte do reducer prova
que sua asserção central consegue falhar.

`npm run walk` faz o que nenhum dos dois faz: **usa** a tela, a 1440×980. Ele entra
numa área, arrasta o orçamento até furar um piso, compra bancada, estoura o caixa,
avança o mês, confere o relatório e abre o placar de Finanças — medindo rolagem,
recorte, sobreposição e contraste no pixel renderizado a cada parada. Ele nasceu
porque três defeitos atravessaram tipo verde, guarda verde e 99 provas verdes: um
`max="25,04"` que o navegador descartava calado, duas grades que mediam colunas em
`ch` com fontes diferentes, e uma previsão que usava a verba prometida enquanto o
turno votava com a paga.

⚠ **E ele está DENTRO do `validate` desde 23/08/2026**, o que antes não era verdade.
A razão é uma assimetria medida: motor e tela têm o mesmo tamanho — 8.007 contra
9.601 linhas — e o motor tinha **207 provas** contra **29** da tela, todas lendo
string. As 38 checagens que de fato veem a tela viviam fora do portão, então mexer
em folha de estilo deixava o portão verde sem ele ter olhado nada. O passeio custa
33s e o portão foi de 9s para 42s.

⚠ **O que o portão continua NÃO sabendo fazer é olhar.** Ele mede geometria e
contraste; ele não vê que a peça ficou feia. As capturas em `captures/` existem para
isso, e abri-las é o único passo do fluxo que segue sendo humano.

⚠ **E toda checagem dele nasce sem alcance — três vezes, medidas.** `checkClipped`
nasceu cego no eixo Y e um cartão inteiro sumia; `checkSwallowed` nasceu com uma
janela só, que era exatamente a única em que a tela cabia; e os dois eram cegos para
`text-overflow: ellipsis`, que **não rola** — a frase só perde o fim. `checkEllipsized`
nasceu em 24/08/2026 e achou três truncamentos já publicados na primeira rodada. **A
pergunta em toda checagem nova é qual metade do problema ela ainda não vê.**

`npm run screen` abre a tela com GPU e mede o custo do material contra um braço
de controle sem filtro. Ele vive em `tests/browser/` e continua **fora** do
`validate`: abre navegador com janela e mede fps contra a taxa do monitor, e num
runner sem GPU os dois braços caem juntos e o número mente.
