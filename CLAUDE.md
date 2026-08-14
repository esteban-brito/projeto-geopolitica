# Planalto — instruções para o agente

Simulador de presidência do Brasil. Site estático: **zero build, zero dependência
de runtime**, ESM puro servido como arquivo.

## Antes de qualquer coisa, leia nesta ordem

1. [`docs/handoff.md`](docs/handoff.md) — o ponto de retomada. Estado verificado,
   achados abertos e para onde o projeto vai. **Ele é a primeira leitura de toda
   sessão**, e a última escrita de toda sessão que muda algo relevante;
2. [`docs/standards.md`](docs/standards.md) — as convenções, e quais têm guarda
   executável;
3. [`docs/cycles/`](docs/cycles/) — o ciclo mais recente é o plano em vigor;
4. [`docs/adr/`](docs/adr/) — decisões que não se reabrem sem pedido.

## As regras que não se quebram

- **Português na prosa e na interface; inglês em código e em caminhos.** Sem
  acento em identificador. Comentário e documento são em português;
- **A tela não refaz conta do motor — ela pergunta.** Toda leitura mostrada
  enquanto o jogador decide sai da mesma função que o turno vai executar. Conta
  refeita por fora diverge, e diverge no caso extremo, que é o caso em que o
  jogador precisava do número;
- **Motor nenhum chama outro motor.** Quem compõe é `src/application/`;
- **O domínio é puro**: sem DOM, sem relógio, sem `Math.random`. Aleatoriedade
  entra por fluxo injetado, e o mandato inteiro se refaz da semente;
- **Tudo tem preço, nada tem muro.** Nunca escreva `if (proibido) return`. A
  pergunta certa é _quanto custa_, e não _pode_;
- **Nada de número inventado.** Todo valor mostrado tem motor atrás ou catálogo
  com fonte. Se não tem, a informação fica **ausente e declarada** — foi por isso
  que a aprovação saiu da tela até SONDA existir;
- **O mundo é real, as pessoas são inventadas** (ADR 0003). Rubrica, quórum e
  indicador vêm da realidade com fonte; **todo personagem é fictício**, com
  arquétipo reconhecível e nenhum nome real. Não há guarda para isso — é revisão;
- **A IA não entra no turno** (ADR 0001) e **gera vocabulário, nunca efeito**
  (ADR 0002).

## O fluxo de trabalho

```bash
npm run validate   # guardas + tipos + lint + formato + testes — tem de ficar verde
npm run walk       # usa a tela num navegador de verdade; roda quando mexer em UI
npm run simulate   # 48 meses no terminal; roda quando mexer em calibragem
npm run serve      # http://127.0.0.1:5173/
```

- `npm run validate` **verde é obrigatório** antes de dizer que algo está pronto;
- mexeu em tela? rode `npm run walk` **e olhe a captura** em `captures/`. Três
  defeitos já atravessaram tipo, guarda e cem provas para morrer na imagem;
- mexeu em catálogo ou em motor? rode `npm run simulate` e compare a série;
- prosa é parte do trabalho: cada arquivo explica **por que** é assim, e o que já
  foi tentado e deu errado. Comentário que só repete o código não entra.

## O que NÃO fazer sem pedido explícito

- **commitar ou dar push.** O responsável decide quando;
- **começar um motor novo** ou uma parte de ciclo que não foi acordada;
- **mudar calibragem** (números de `src/data/`) para fazer um teste passar. Se um
  número está errado, isso é um achado — registre no handoff;
- **remover uma guarda ou uma prova** para destravar. Elas existem por defeito
  medido, e a prosa de cada uma diz qual.
