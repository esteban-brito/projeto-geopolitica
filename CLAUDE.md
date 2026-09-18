# República Simulator — instruções para o agente

Simulador de presidência do Brasil. Site estático: zero build, zero dependência de
runtime, ESM puro servido como arquivo.

## Leia nesta ordem

1. [`docs/handoff.md`](docs/handoff.md) — o ponto de retomada, e ele é CURTO de
   propósito: só entra o que é verificável hoje. Primeira leitura de toda sessão, última
   escrita de toda sessão que muda algo. A narrativa de sessão mora em
   [`docs/journal.md`](docs/journal.md), e não volta para cá;
2. [`docs/standards.md`](docs/standards.md) — as convenções, e quais têm guarda;
3. [`docs/cycles/`](docs/cycles/) — o ciclo mais recente é o plano em vigor;
4. [`docs/adr/`](docs/adr/) — decisões que não se reabrem sem pedido.

## Regras que não se quebram

- **Português na prosa e na interface; inglês em código e caminhos.** Sem acento em
  identificador;
- ⛔ **ESCREVA COMO GENTE, e vale para tudo** — o texto do jogo, os docs e a resposta no
  terminal. Ordem dele em 03/09/2026: _"tu não ta escrevendo um livro não, nem uma poesia
  porra, escreve igual uma pessoa normal, não uma IA imbecil"_. **Frase curta, sujeito e verbo
  na ordem normal, número no lugar do adjetivo.** O que sai:
  - a **reviravolta final** — _"X é A, e é isso que faz dele B"_. Diga só o que acontece;
  - a **inversão poética** — _"o que ela deixa de ceder o resto paga"_ vira _"se você proteger
    uma área, o corte cai mais fundo nas outras"_;
  - o **paralelismo de efeito** — _"a pauta não morre, ela não acontece"_;
  - a **metáfora sem necessidade** — _"a caneta mais honesta do jogo"_ vira _"o poder mais
    direto"_;
- **A tela não refaz conta do motor — ela pergunta.** Toda leitura mostrada enquanto o
  jogador decide sai da mesma função que o turno vai executar;
- **Motor nenhum chama outro motor.** Quem compõe é `src/application/`;
- **O domínio é puro**: sem DOM, sem relógio, sem `Math.random`. Aleatoriedade entra
  por fluxo injetado, e o mandato inteiro se refaz da semente;
- **Tudo tem preço, nada tem muro.** Nunca `if (proibido) return`. A pergunta é
  _quanto custa_, não _pode_;
- **Nada de número inventado.** Todo valor mostrado tem motor atrás ou catálogo com
  fonte. Sem isso, a informação fica ausente e declarada;
- **O mundo é real, as pessoas são inventadas** (ADR 0003). Todo personagem é
  fictício. Não há guarda — é revisão;
- **A IA não entra no turno** (ADR 0001) e **gera vocabulário, nunca efeito** (ADR 0002).

## Comentário: o teto é rígido

**Um comentário registra o que o código não consegue dizer: a alternativa testada e
reprovada, com o número que a reprovou.** Nada mais entra.

- **Teto de 10 linhas por bloco, e um bloco por decisão.** Cabeçalho de arquivo: 14.
  A guarda `prose` mede e reprova em `npm run check`;
- ⛔ **não escreva** data, citação do responsável, histórico de quem pediu o quê,
  narrativa de reversão, nem o que o código já diz. Isso é diário, e diário mora no
  handoff e no `git log`;
- **Bom:** `/* Sem filtro: glass-support custou 17,9 fps aqui. */`
- **Ruim:** três parágrafos contando que ele pediu, que houve duas propostas, que a
  medição recusou uma, e em que data.

**Linha de tipo não conta** — `@typedef`, `@param` e `@property` são contrato.

## Fluxo

```bash
npm run validate   # guardas + tipos + lint + formato + testes + passeio — 42s, tem de ficar verde
npm run check      # só as guardas, 2s — o laço curto de quem mexe em folha
npm test           # só as suítes, 2s — o laço curto de quem mexe em motor
npm run simulate   # 48 meses no terminal; rode ao mexer em calibragem
npm run simulate -- --party liberais-conservadores   # o mesmo, com bancada do presidente
npm run serve      # http://127.0.0.1:5173/
```

- `validate` verde é obrigatório antes de dizer que algo está pronto, e **o passeio
  está dentro dele**: o portão agora vê geometria, recorte e contraste no navegador;
- ⚠ **mas o portão não sabe OLHAR.** Mexeu em tela? **abra a captura** em `captures/passeio/`.
  Três defeitos já atravessaram tipo, guarda e cem provas para morrer na imagem, e
  nenhum deles falhava — é o único passo que continua sendo humano;
- mexeu em `src/data/`, `src/domain/` ou `src/application/`? rode `simulate` e **reescreva a
  série** em `docs/handoff.md` no mesmo commit — comparar não basta: ela ficou seis dias vencida
  porque o item 0.1 mudou o motor e ninguém a remediu;
- `npm run screen` oscila ~20 fps entre rodadas, e continua **fora** do portão: ele
  abre janela e mede contra a taxa do monitor. Meça os dois braços na mesma rodada;
  um número solto dele não decide nada.
- **Três laços, cada um com ordem fixa — não replaneje o óbvio:**
  - folha (`src/ui/`, `styles/`) → `npm run check` → abrir a captura em `captures/passeio/`;
  - motor (`src/domain/`, `src/application/`, `src/data/`) → `npm test` → `npm run simulate` → reescrever a série no handoff no mesmo commit;
  - fechar item → `npm run validate` → journal + handoff.
- **Journal se lê pelo fim** (últimas ~150 linhas), nunca inteiro: ele tem 7.000+ e só cresce.

## Não faça sem pedido

- **commitar ou dar push** — o responsável decide quando;
- **começar um motor novo** ou uma parte de ciclo não acordada;
- **mudar calibragem** (`src/data/`) para fazer teste passar. Número errado é achado —
  registre no handoff;
- **remover guarda ou prova** para destravar. Elas existem por defeito medido.

## Onde o projeto está

**O estado mora em [`docs/handoff.md`](docs/handoff.md) — e só lá.** Esta seção repetia o
handoff e vencia junto: em 10/09/2026 ela dizia "323 provas" num parágrafo e "325" no
seguinte, e "DOZE planos" para 25 arquivos em `cycles/`. Número de estado se lê no handoff,
nunca aqui. O que fica valendo: o plano em vigor é o ciclo mais recente, a fila é a do
handoff, e a pesquisa 09 é o checklist do cargo.

✔ **Base de 31/08, nenhuma executada:** o email leva até a tela · o save fica para
depois · o piso da saúde e da educação anda com a receita (remede a série) · a votação olha
quem compareceu (4 regras de equilíbrio). Sobram: por onde começar o "menos texto, mais
visual", e as duas cartas sem número. ✔ **A rolagem abaixo de 940px saiu em 16/09** — o
limiar virou largura (1181px) e o que sobra dela é o layout estreito, no handoff.
⛔ **IA por API: NÃO (04/09).** Nem em partida nem fora dela; a "IA" é o avaliador (§4 da 07).
⚠ **Caixa e Gabinete têm um vocabulário só** (`annex.mjs`, guarda `annexes`); tabela nas duas
telas reprova. **Número de catálogo envelhece na prosa** — meça antes de repetir.
⚖ **Documento mais recente vale, e vence ADR. Ordem dele substitui regra escrita** — o
documento antigo se emenda, não se invoca.

## ⚖ TODA RECUSA DESTE REPOSITÓRIO PERTENCE A UMA DE TRÊS FAMÍLIAS — 05/09/2026

⛔ **E SÓ UMA DELAS TRAVA ALGUMA COISA.** Ordem dele, e ela vale para cada ⛔ escrito em qualquer
doc deste projeto: _"não importa o que eu achava antes, entende? o jogo está em pleno
desenvolvimento, **eu posso mudar de ideia a qualquer momento**, isso a IA não entende"_.

| família                    | exemplo                               | trava?                                                 |
| -------------------------- | ------------------------------------- | ------------------------------------------------------ |
| 📐 **medição**             | `glass-support` custou 17,9 fps       | ⭐ **sim — até alguém remedir e mostrar outro número** |
| 🗣 **gosto dele, com data** | _"esse marrom cor de bosta"_          | ⛔ **não.** É a preferência daquele dia, e ela expira  |
| ✍ **generalização minha** | _"madeira, couro e papel não entram"_ | ⛔ **não vale nada. APAGUE ao encontrar**              |

⭐ **MEDIÇÃO NÃO EXPIRA. GOSTO EXPIRA.** Uma recusa de gosto se cita como _"ele recusou X em
tal data"_, e nunca como _"X não entra"_ — e ao propor desenho, **ofereça o exótico**: ele quer,
e cabe.

⛔ **E ISSO JÁ CUSTOU DUAS VEZES.** O ciclo 21 dizia _"madeira, couro e papel não entram"_ apoiado
em "o projeto já matou skeumorfismo". **Ele nunca disse isso.** O registro tem o contrário: em
22/08 ele PEDIU o marrom, e depois recusou **aquela cor**. Eu virei a recusa de um tom numa
proibição de três materiais, e citei a proibição de volta como decisão dele. Palavras dele:
_"uma coisa que me irrita muito nesse meu jogo são as travas e limites que você colocou sem eu
pedir"_.

> ⚖ **A pergunta antes de escrever qualquer proibição:** _isto é uma medição, uma ordem dele, ou
> uma generalização minha de uma coisa específica?_ **Na dúvida, pergunte a ele — nunca invoque o
> documento.**

⭐ **A BASE VISUAL É O LIQUID GLASS DE HOJE — ordem dele de 05/09/2026.** ⚠ **E ela também não é
trava, e ele disse isso com todas as letras:** _"se eu quiser construir uma literal MESA, linda,
no gabinete, eu posso, sem qualquer resquício de liquid glass nela… a base é liquid glass, mas se
eu quiser ousar, eu posso"_. **Base quer dizer o ponto de partida, e não o teto.** Arranjo, escala,
matéria, luz e gesto estão todos abertos — e o material também, se ele pedir.

## Como responder

Curto e direto. Entregue o resultado e o número que o sustenta; corte o resto.
