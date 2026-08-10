# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa,
> leia este arquivo e depois `docs/standards.md`. O nome deste arquivo é estável
> de propósito: ponteiro com data envelhece e obriga a mover arquivo.

## Estado em 10/08/2026

Segunda sessão. A base visual está de pé e medida, e `npm run validate` fecha
verde de ponta a ponta.

| verificação        | estado                                                          |
| ------------------ | --------------------------------------------------------------- |
| `npm run validate` | **verde de ponta a ponta**                                      |
| `npm run check`    | 7 guardas · 30 provas sintéticas · verde                        |
| `npm run types`    | verde (`tsc` sobre JSDoc, sem build)                            |
| `npm run lint`     | verde                                                           |
| `npm run format`   | verde (Prettier em `--check`)                                   |
| `npm test`         | 9 propriedades do reducer · verde                               |
| `npm run screen`   | verde · console limpo, sem rolagem horizontal                   |
| fps do material    | **240,0 × 238,3** do controle, 3 rodadas alternadas, GPU ligada |

O `validate` estava **vermelho** ao fim da primeira sessão e ninguém tinha
rodado: `npm test` apontava para `node --test tests/suites`, e o Node 26 trata o
argumento posicional como arquivo/glob, não como diretório recursivo. Mesmo com
o caminho certo, `screen-cost.mjs` não é arquivo de `node:test` — é script que
abre Chromium com janela. Ele mudou para `tests/browser/` e ganhou script
próprio (`npm run screen`); `tests/suites/` passou a significar uma coisa só.

O fps foi medido com o navegador **headed e GPU**, porque em rasterização por
software os dois braços caem juntos e o número engana. A primeira versão da
medição rodou material e depois controle, e o material saiu 8 fps _mais rápido_ —
fisicamente impossível, e por isso a suíte passou a alternar e tomar a mediana.
O monitor é de 240 Hz e a tela sustenta a taxa dele.

## O que existe

- **tela-referência** (`index.html` + `styles/40-screen-dashboard.css`): o grafo
  como substrato, a faixa de contexto, a peça central com a aprovação, o veredito
  e as duas ações. `<dialog>` nativo para o padrão de diálogo, View Transitions
  na troca de turno;
- **sistema de vidro em três níveis** — `stage` · `action` · `support` —, um
  material só, com a pilha de três camadas na peça central;
- **estado imutável + reducer puro**, com render por identidade de referência;
- **sete contratos de motor** declarados em `src/domain/*/index.mjs`, sem
  implementação: a fronteira antes do conteúdo;
- **sete guardas** com provas sintéticas;
- **a primeira suíte de propriedades** (`tests/suites/state-reducer.mjs`), sobre
  o reducer: imutabilidade, congelamento em profundidade, identidade de
  referência em ação desconhecida — que é o contrato do qual o render depende —,
  o invariante das três fatias e a totalidade de `monthLabel`. Ela carrega a
  própria prova sintética: um reducer quebrado de propósito que a asserção
  central tem de acusar.

## Achados abertos — o que EU veria primeiro na próxima sessão

1. **O botão primário está terracota, não âmbar.** Ele é
   `rgba(--brand, .46)` sobre o vidro escuro, e tinta translúcida sobre fundo
   escuro só pode ESCURECER. O projeto anterior gastou quatro rodadas nisto e a
   conclusão foi que a operação está errada, não o número: vidro âmbar real
   amostra a luz de trás e a devolve tingida. A saída de lá foi tingir a base do
   vidro, não empilhar cor sobre ela — e **`brightness` no `backdrop-filter` está
   proibido**, porque criaria um segundo material e a guarda recusa;
2. **o gel de situação quase não aparece.** A máscara radial tira a cor do miolo
   (correto) mas a periferia está fraca demais para identificar o estado do país.
   Precisa de medição — croma na banda periférica, com os três estados — antes de
   mexer no número;
3. **o grafo é escuro e de baixo contraste**, então o vidro tem pouco o que
   refratar. Vale medir o delta com e sem o substrato, como o protocolo de arte
   de fundo do projeto anterior faz, e decidir por medição se ele precisa de mais
   luz ou de uma camada de profundidade;
4. **a fonte é `system-ui`**, provisória. Escolher a fonte muda pixel e é decisão
   sua; ela entra auto-hospedada, sem CDN.

## O que ainda não existe, e por quê

- **motores** — só os contratos. A implementação começa por CORRENTE e LASTRO,
  que são os mais objetivos de calibrar;
- **catálogo de dados** — e com ele nascem as guardas `identity` e `schema`;
- **`orphans` e `contrast`** — precisam de DOM real e de mais de uma tela para
  valerem a pena;
- **`d3-force`** — o layout do grafo é determinístico e estático por enquanto. A
  simulação de força entra quando DELTA existir, rodando em Worker e convergindo
  **antes** de desenhar, porque fundo em movimento sob `backdrop-filter` é a
  condição dos 31 fps;
- **CI e Pages** — o workflow não foi escrito nesta sessão.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · turno mensal (48 por mandato) · tudo fictício com inspiração
na realidade · aba de edição de nome e logo mais adiante · inglês no código e
português na prosa · seis camadas de estilo · codinomes de motor · zero build e
zero dependência de runtime (exceção: `d3-force` vendorizado).

Referências de interface: **Geopolitical Simulator** e **Football Manager 2020**.
Liquid glass é a base do design inteiro, não um efeito de algumas telas.
