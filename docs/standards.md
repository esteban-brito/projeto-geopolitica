# Padrões do projeto

Este documento é a fonte das convenções. Ele não descreve intenção: quase tudo o
que está aqui tem uma guarda executável ao lado, e o que **não** tem está marcado
como tal — documentação que promete cobertura inexistente é pior que documentação
nenhuma, porque a próxima sessão confia nela.

## 1. As convenções travadas

Para cada eixo existe **uma** forma, e a segunda é recusada por guarda.

| eixo                | a forma única                                        | proibido                               | cobrado por                 |
| ------------------- | ---------------------------------------------------- | -------------------------------------- | --------------------------- |
| módulos             | ESM, `.mjs`, exports nomeados                        | CommonJS, `export default`             | `naming`                    |
| nome de arquivo     | `kebab-case` minúsculo, sem acento                   | `camelCase`, `PascalCase`              | `naming`                    |
| idioma              | inglês em código e caminhos; português em prosa e UI | identificador acentuado                | `naming` (parcial — ver §6) |
| cor                 | token no arquivo de tokens, no par `--x` + `--x-rgb` | literal fora dos tokens; `color-mix()` | `tokens`                    |
| superfície          | uma das três lâminas                                 | `backdrop-filter` fora do material     | `material`                  |
| raio, espaço, corpo | valor da escala, derivado de um número raiz          | número cru numa regra                  | revisão                     |
| cascata             | camadas declaradas por `@layer`                      | regra fora de camada; `!important`     | `cascade`                   |
| movimento           | tokens de duração e curva + rede global              | `animation: none`; animação inline     | `motion`                    |
| aleatoriedade       | fluxo injetado, próprio de cada motor que sorteia    | `Math.random` no domínio               | `boundaries`                |
| identidade          | separada dos atributos; motor compara por `id`       | comparação por nome                    | `identity`                  |
| dado editável       | esquema ao lado da coleção, validado por `catalog`   | esquema fora de `src/data/`            | `schema` + suite            |

## 2. Estrutura

```
index.html · app.mjs        entrypoint: composição e wiring, nunca cálculo
styles/                     seis camadas, na ordem que o nome declara
vendor/                     dependência de runtime vendorizada (só d3-force)
src/data/                   catálogo; `catalog.mjs` indexa todo dado do projeto
src/domain/                 os motores, funções puras
src/state/                  estado imutável e o reducer
src/application/            turno, persistência, efeitos
src/public/                 a composição que todo consumidor usa
src/ui/                     views puras: recebem dado, devolvem string
tests/                      run.mjs · lib/ · guards/ · suites/ · golden/
tools/                      geradores, servidor, simulador de mandato
docs/                       handoff.md (um ponto de retomada) · adr/ · cycles/
```

## 3. Os motores

Ordem de resolução de um turno (mês). Apenas **TEMPORAL** e **ECLUSA** consomem
aleatoriedade, cada um com fluxo próprio derivado da seed da partida.

| codinome     | módulo                    | o que recebe                                               | o que devolve                                           |
| ------------ | ------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| **TEMPORAL** | `src/domain/events/`      | estado do turno, catálogo, fluxo de RNG                    | evento disparado, com efeitos e duração                 |
| **ECLUSA**   | `src/domain/congress/`    | bancadas, proposta, moeda oferecida, histórico de barganha | votos por bancada, resultado, custo pago, ressentimento |
| **MALHA**    | `src/domain/capacity/`    | índices por área, alocação do mês, impacto das aprovações  | índices novos, histórico, pressão em receita e despesa  |
| **CASCATA**  | `src/domain/propagation/` | efeitos vigentes com defasagem, estado atual               | delta do mês por indicador                              |
| **CORRENTE** | `src/domain/economy/`     | estado macro, deltas, política monetária                   | PIB, inflação, juros, câmbio, desemprego                |
| **LASTRO**   | `src/domain/budget/`      | receita e despesa, obrigatório × discricionário            | saldo, dívida/PIB, espaço discricionário                |
| **SONDA**    | `src/domain/opinion/`     | indicadores divulgados, eventos, histórico                 | aprovação por segmento                                  |
| **DELTA**    | `src/domain/graph/`       | catálogo de ligações, estado, deltas                       | nós e arestas com peso e sinal                          |

O codinome é como o responsável cita o motor. Ele vive no cabeçalho do módulo e
nesta tabela, e **não** aparece em código executável — no código existe um nome
só, o funcional. `codenames` prova a correspondência 1:1 nas duas direções.

**Motor nenhum chama outro motor.** Quem os compõe é `src/application/turn.mjs`,
e a ordem em que ele os chama é a mecânica do jogo, não detalhe de organização:
o orçamento resolve antes da votação porque a votação usa a verba **paga**, e uma
ordem invertida faria promessa comprar voto — o que transforma o orçamento num
placar que o jogador só lê depois de já ter decidido. A camada de aplicação
compõe e devolve o resultado pronto; o reducer apenas o dobra no estado.

## 4. O sistema visual

**Um material, três densidades.** Desfoque, saturação e borda são os mesmos em
toda a tela; o que distingue os níveis é a densidade do fundo, porque o que eles
expressam é **papel**:

| classe           | papel                                            |
| ---------------- | ------------------------------------------------ |
| `.glass-stage`   | a peça central da tela — a que carrega o assunto |
| `.glass-action`  | o que se pressiona                               |
| `.glass-support` | informação que não se toca                       |

Nível **não** pode significar raio de desfoque: três desfoques são três
materiais. A peça central usa a pilha de três camadas — campo (`::before`),
lâmina (`::after`, onde vive o filtro), conteúdo acima — porque com o filtro no
próprio contêiner qualquer cor pintada pelos filhos fica **sobre** o material.

**`backdrop-filter` custa, e o custo é por tela.** A condição que o torna
aceitável é superfície pequena sobre fundo **estático**. Antes de levar o
material a uma tela nova, meça o fps dela com braço de controle sem filtro — e
com GPU e vsync ligados, porque em rasterização por software os dois braços caem
juntos e o número não diz nada.

## 5. As guardas

| guarda       | impede                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| `material`   | segundo material; filtro fora do arquivo de material; falta do par `-webkit-`; sumiço do aviso de fps       |
| `tokens`     | literal de cor solto; `color-mix`; par hex/rgb divergente; `var()` órfão; token sem consumidor              |
| `cascade`    | regra fora de camada; `!important`; ordem de carregamento errada; `motion` deixar de ser a última           |
| `motion`     | rede incompleta; `animation: none`; falta de alcance a pseudo-elementos e View Transitions; animação inline |
| `boundaries` | entrypoint alcançando o domínio; domínio com DOM, relógio ou RNG ambiente; dependência de teste vazando     |
| `naming`     | `.js`; nome fora do padrão; CommonJS; `export default`; identificador acentuado                             |
| `codenames`  | motor sem codinome, codinome sem motor, codinome no código                                                  |
| `identity`   | coleção com rótulo e sem `id`; `id` repetido; motor comparando por nome                                     |
| `schema`     | módulo de dado sem esquema; esquema que o catálogo nunca valida; esquema fora de `src/data/`                |

Cada guarda carrega **provas sintéticas** que reintroduzem o defeito e exigem
acusação. O runner as executa junto da auditoria real.

## 6. O que ainda NÃO tem guarda

Declarado para não ser confundido com cobertura:

- **idioma dos identificadores.** `naming` cobre acento, extensão e forma; a
  regra inglês/português depende de revisão. Um casador honesto não existe — ele
  acusaria `selic` e `ipca`, que são nomes próprios e ficam no original por
  decisão;
- **`orphans` e `contrast`** — precisam do DOM real, e portanto de mais de uma
  tela para valerem a pena. Entram no ciclo da segunda tela;
- **o VALOR de um dado do catálogo.** `identity` prova que todo registro tem
  identidade própria e que nenhuma se repete; `schema` prova que todo esquema
  existe e é validado; a suite prova que os registros obedecem ao esquema.
  Nenhuma das três sabe dizer se `0,95` é a venalidade certa do Centrão — isso é
  calibração, é revisão humana, e não existe casador honesto para intenção;
- **escala de raio, espaço e corpo** — a derivação está no arquivo de tokens e é
  cobrada por revisão, não por máquina.
