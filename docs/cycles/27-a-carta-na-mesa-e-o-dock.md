# CICLO 27 — ETAPA 3: A CARTA NA MESA E O DOCK

> **Escrito em 18/09/2026, por ordem dele.** Planejado por Claude e Gemini
> (`tmp/plano-etapa3-gemini.md`), e as três decisões são dele, do mesmo dia:
>
> 1. **A abertura do envelope é em 2D** — a aba sobe, a carta desliza. Sem `rotateX`: a mesa é
>    ortográfica, vista de cima, e nenhuma peça ganha ponto de fuga.
> 2. **A barra fica.** A pasta erguida não cobre a barra nem hoje — ela lê 0,9 da ÁREA e centra
>    na JANELA, o que deixa 116px livres no pé a 1440×900 e 118 a 1920×937 —, então a barra
>    entra nessa margem como camada sobre a mesa e **nada encolhe**.
> 3. **Seis ícones, os 8 ministérios numa gaveta só,** "do estilo mais Apple possível".

---

## 1 · A ordem

**A · o dock → B · a carta → C · a bandeirinha.** O dock vem primeiro porque é ele que fixa a
geometria do pé da tela. Cada parte é uma ou mais sessões pequenas; cada sessão fecha com
`npm run validate` verde, captura aberta, `npm run screen` nos dois braços, e handoff reescrito.
Um dono por arquivo; o Gemini recebe 2 ou 3 tarefas por lote; só o Claude roda o passeio.

## 2 · A · O dock

| o quê                                                                                                                                                             | número                                                 | dono   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------ |
| No Gabinete o rail some e uma barra horizontal de vidro entra no pé, **sobre** a mesa (não reduz `.area`, logo não mexe em `fitDesk` nem na pasta erguida)        | 64px de altura na margem de 116/118px                  | Claude |
| Seis ícones: Gabinete · Mensagens · Congresso · Finanças · **Ministérios** · Estado. Sem rótulo; o nome aparece ao pousar (tooltip) e no `aria-label`             | 13 → 6                                                 | Claude |
| A gaveta dos ministérios abre para cima com os 8, e fecha ao escolher ou com Esc                                                                                  | 8                                                      | Claude |
| Defesa ganha ícone próprio (hoje usa o quadrado de fallback)                                                                                                      | 1 ícone                                                | Gemini |
| Apple: cápsula de vidro, item ativo com ponto embaixo, pouso com escala leve na mola de `spring.mjs`, e a troca rail ↔ dock pela view transition da troca de tela | medir `npm run screen` nos dois braços, antes e depois | Claude |
| Teclado: Tab percorre os 6, setas dentro da gaveta, Esc fecha; foco visível com o anel da base                                                                    | prova no passeio                                       | Gemini |
| Nas outras telas o rail volta à esquerda, igual a hoje                                                                                                            | captura pixel-igual nas telas que não são o Gabinete   | Claude |

## 3 · B · A carta na mesa

| o quê                                                                                                                                                                                 | número                                        | dono   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------ |
| **Duas fotos dele:** envelope creme aberto e rubro aberto, aba levantada, vista de cima, sem sombra, ≥ 2000px (prompts em `tmp/plano-etapa3-gemini.md` §3). Sem elas B não começa     | 2 imagens                                     | ele    |
| Clicar no envelope: a foto troca para a aberta e a carta desliza para fora (2D), depois sobe ao centro na mola da pasta (`curveOf`, `LIFT`/`DROP`), na escala de leitura de `fitDesk` | 0,30s subida, 0,26s descida — os mesmos       | Claude |
| Uma por vez: clicar em outro envelope troca; clicar fora ou Esc larga, e o envelope volta a fechado                                                                                   | 0 a 3 cartas por mês                          | Claude |
| O papel é a `.sheet` (A4, tipografia, textura); o conteúdo é `letterHtml` de `inbox.mjs`: remetente, assunto, corpo, anexos, o botão de decidir e as duas saídas                      | mesmo vocabulário da Caixa — guarda `annexes` | Claude |
| A Caixa continua como arquivo; o botão da carta leva ao mesmo lugar que leva hoje                                                                                                     | prova: mesmo `target`                         | Gemini |
| A pilha: a carta que vence abre primeiro se o clique for na pilha e não num envelope                                                                                                  | `silences` decide, a tela pergunta            | Claude |

## 4 · C · A bandeirinha

A foto dele entra na mesa pela receita dos envelopes (`tmp/assar-envelopes-tela.mjs`): origem
limpa, largura de tela × 2 numa reamostragem só, sem perda se ele mandar.

## 5 · O que não entra

- `rotateX` ou qualquer perspectiva (decisão 1);
- encolher a pasta erguida ou a cena por causa da barra (decisão 2);
- rótulo de texto nos ícones do dock (decisão 3);
- IA por API (04/09) — a carta é a que o motor escreveu.
