# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa,
> leia este arquivo e depois `docs/standards.md`. O nome deste arquivo é estável
> de propósito: ponteiro com data envelhece e obriga a mover arquivo.

## Estado em 10/08/2026

Terceira sessão. A base visual está de pé e medida, **três motores de dado e
dois motores de jogo existem**, e tudo está commitado e publicado em
`https://github.com/esteban-brito/projeto-geopolitica` (branch `main`).

| verificação        | estado                                                          |
| ------------------ | --------------------------------------------------------------- |
| `npm run validate` | **verde de ponta a ponta**                                      |
| `npm run check`    | 9 guardas · 36 provas sintéticas · verde                        |
| `npm test`         | **68 propriedades** · verde                                     |
| `npm run screen`   | verde · console limpo, sem rolagem horizontal em 1440/760/390   |
| fps do material    | **240,3 × 240,3** do controle, 3 rodadas alternadas, GPU ligada |
| CI                 | GitHub Actions rodando `npm run validate` a cada push           |

## O PRÓXIMO FOCO, decidido no fim desta sessão

**Nada de programar motor por enquanto.** O trabalho combinado para a próxima
sessão é **fidelidade e realismo do modelo** e **jogabilidade, interface, design
e HUD**. Os motores existentes ficam onde estão até que essa camada tenha
direção.

## O que existe

### A tela

- **casca com dois rails** (`index.html` + `styles/40-screen-dashboard.css`), na
  estrutura do Football Manager 2020: navegação à esquerda, indicadores e o botão
  de turno à direita, ambos a **mesma peça** — a simetria sai de haver uma
  largura só, `--rail`;
- **sistema de vidro em três níveis** — `stage` · `action` · `support` —, um
  material só, com a pilha de três camadas na peça central;
- **substrato de aurora em CSS puro**, campo de luz mais grão ladrilhado. Ele é
  requisito do material e não acabamento: sobre gradiente liso o
  `backdrop-filter` não tem o que distorcer;
- cinco itens do rail estão **desligados de propósito** — têm motor e não têm
  tela, e menu que oferece o que não abre ensina a desconfiar do menu.

### Os dados (`src/data/`)

- **quatro blocos partidários** no plano de Nolan: `economic` (0 intervenção →
  100 mercado) e `liberty` (0 controle sobre a pessoa → 100 liberdade pessoal);
- **venalidade por eixo** — `venalityEconomic` e `venalityLiberty`. O preço
  depende do assunto: o Centrão cede em economia, a direita liberal em costumes;
- **seis pautas prontas**, cada uma com posição, `threat` e impacto fiscal;
- **validador de esquema** que não conserta nada, e um catálogo que reúne e
  confere.

### Os motores

- **LASTRO** (`src/domain/budget/`) — receita do PIB, obrigatória crescendo em
  valor absoluto, discricionário como resto, teto do arcabouço e gatilho de
  contingenciamento. Duas restrições independentes (caixa e regra) e o menor
  manda;
- **ECLUSA** (`src/domain/congress/`) — `whipCount` determinístico para a
  negociação, `vote` com dissidência no dia. Resistência com termo negociável e
  termo de ameaça inegociável.

### A infraestrutura

- **fluxo de aleatoriedade contado** (`src/state/random.mjs`): o valor é função
  pura de (semente, índice), então o fluxo inteiro é um par de inteiros. Um fluxo
  por motor que sorteia, derivado do nome;
- **save** (`src/state/save.mjs`), versão 2, que recusa em vez de lançar;
- **nove guardas** com provas sintéticas.

## Achados abertos — o que EU veria primeiro na próxima sessão

1. **A calibragem de ECLUSA é um primeiro chute, e está declarada como tal.**
   `PIVOT 58`, `SPREAD 16`, `THREAT_WEIGHT 85` e os seis `threat` do catálogo
   foram girados contra os testes, não validados contra nada. O que está
   **provado** é estrutural: previsão determinística, dia aleatório, verba nunca
   reduz adesão, o fisiológico sofre mais com a ameaça, nenhuma pauta é muro;
2. **com lealdade 70, três das seis pautas passam sem um centavo.** A tensão hoje
   vem quase toda da lealdade — que **ainda não decai**. O decaimento por turno,
   a Obstrução (<50) e a Ruptura (<20) são a metade que falta de ECLUSA;
3. **o acoplamento LASTRO ↔ ECLUSA não está ligado.** Emenda paga deveria sair do
   caixa discricionário e o contingenciamento deveria zerar emenda, derrubando a
   lealdade. É onde aperto fiscal vira crise política sem evento roteirizado;
4. **o benchmark de fps não mede nada hoje.** Os dois braços ficam presos no teto
   de 240 Hz do monitor, e uma rodada chegou a dar o material 9,7 fps _mais
   rápido_ que o controle. Ele prova "não custa caro" e não mede o custo real;
5. **a fonte é `system-ui`**, provisória. Escolher a fonte muda pixel e é decisão
   do responsável; ela entra auto-hospedada, sem CDN;
6. **o gel de situação** melhorou com a aurora (que dá luminância variável para
   ele modular), mas nunca foi medido depois da troca.

## O que ainda não existe

- **TEMPORAL, CASCATA, CORRENTE, SONDA, DELTA** — só os contratos;
- **tensão institucional** — decidido que será variável de estado e não motor
  novo: a pauta carrega efeito de tensão, CASCATA propaga com defasagem, TEMPORAL
  sorteia o impeachment contra ela, SONDA produz o escudo popular. A mecânica é
  uma corrida — `risco = f(tensão − escudo)`, o jogador pode ser tão autoritário
  quanto for popular;
- **`orphans` e `contrast`** — precisam de DOM real e de mais de uma tela;
- **`d3-force`** — entra quando DELTA existir, em Worker, convergindo antes de
  desenhar;
- **GitHub Pages** — decidido ficar só com o CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · turno mensal (48 por mandato) · tudo fictício com inspiração
na realidade · aba de edição de nome e logo mais adiante · inglês no código e
português na prosa · seis camadas de estilo · codinomes de motor · zero build e
zero dependência de runtime (exceção: `d3-force` vendorizado) · pautas prontas e
não vetores livres · lealdade é estado serializado, não recálculo.

**Princípio de design, dito nesta sessão:** _tudo tem um jeito de ser feito._
Nenhuma jogada é bloqueada por regra artificial — o que separa o possível do
impossível é o **preço**. Os únicos limites legítimos são os institucionais, e
mesmo esses são atrito caro, não muro. A prova
`NENHUMA PAUTA E INVOTAVEL` em `tests/suites/congress.mjs` existe para cobrar
isso, e já pegou um muro que tinha passado despercebido.

Referências de interface: **Geopolitical Simulator** e **Football Manager 2020** —
do primeiro vem a profundidade sistêmica, do segundo a estrutura de interface.
Liquid glass é a base do design inteiro, não um efeito de algumas telas.

## Fontes de modelagem

O modelo político-econômico nasceu de um dossiê externo, revisado e corrigido
nesta sessão. As correções estão registradas na prosa de cada arquivo:
`src/data/parties.mjs` (venalidade), `src/data/fiscal.mjs` (despesa obrigatória
absoluta) e `src/domain/congress/index.mjs` (as duas parcelas da resistência).
