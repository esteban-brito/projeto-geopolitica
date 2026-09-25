# PESQUISA 16 — o GPT-6 da OpenAI: onde o Astra vale o que custa

> Consulta em 25/09/2026, feita pelo Claude, a pedido dele: "quero usar o Astra com precisão no que
> ele realmente é bom e útil, porque ele é bastante caro". Fontes oficiais da OpenAI lidas no
> texto; números de imprensa marcados como tal. Preço e limite mudam rápido: remeça antes de citar.

## A família GPT-6

| modelo    | lançamento | o que a OpenAI diz                                                                   | API, por 1 milhão de tokens (entrada / saída) |
| --------- | ---------- | ------------------------------------------------------------------------------------ | --------------------------------------------- |
| **Astra** | 03/09/2026 | o mais capaz: uso do computador, navegação, código, pesquisa e trabalho profissional | US$ 10 / US$ 50                               |
| **Sol**   | 22/09/2026 | "alternativa muito capaz e mais barata"; erra fatos quase tão pouco quanto o Astra   | US$ 2 / US$ 10                                |
| **Luna**  | 22/09/2026 | o mais rápido e mais econômico; tarefas curtas e repetitivas                         | US$ 0,10 / US$ 0,50                           |

- Leitura de contexto em cache tem 90% de desconto no GPT-6 ([Sol e Luna][solluna]).
- No Astra, pedidos com mais de 272 mil tokens de entrada custam mais (imprensa, não conferido).
- Num teste de fluxos de trabalho entre aplicativos (AutomationBench), o Sol em esforço máximo fez
  33,2% a US$ 0,27 por tarefa, e o Astra em esforço baixo fez 30,3% a 3,9 vezes esse custo
  ([Sol e Luna][solluna]).

## O que o plano do ChatGPT dá

Da [central de ajuda oficial][help]:

- **No Plus, o Astra só existe no Work e no Codex.** Work é o ChatGPT operando aplicativos e o
  navegador; Codex é o de programação. A cota é uma só para os dois.
- **Estimativa por 5 horas, no Work e no Codex:** Astra 5 a 45 mensagens no Plus, 25 a 225 no Pro 5x,
  100 a 900 no Pro 20x. Há também limite semanal. Os números não são fixos: variam com a tarefa.
- **No chat comum, o Astra aparece como "GPT-6 Pro",** só nos planos Pro, Business e Enterprise.
- **Sol e Luna do GPT-6** estão no Work e no Codex desde 22/09, e ainda não no chat
  ([Sol e Luna][solluna]).

## O que o Astra faz melhor

Pela OpenAI e por clientes citados no [anúncio de trabalho][work]:

- **uso do computador:** "o melhor modelo do mundo", segundo a própria OpenAI;
- **revisão de código:** a CodeRabbit relata 20% mais erros achados, e mais que o dobro nos erros
  espalhados por vários arquivos;
- **julgamento:** a Box relata mais de 10% menos afirmações erradas feitas com confiança;
- **documentos de trabalho:** apresentações, planilhas e texto no padrão da empresa.

## Como gastar menos

Da [central de ajuda oficial][help]:

- o Astra em esforço baixo pode superar o Sol em esforço alto: comece baixo;
- esforço alto gasta mais cota e nem sempre melhora o resultado;
- o modo rápido (Fast) gasta mais cota;
- esforço não supre informação que falta: mande os arquivos e o contexto de uma vez;
- trocar de modelo não devolve cota gasta; veja o saldo em Configurações → Uso.

## Onde usar no República Simulator

| tarefa                                                         | modelo                        | frequência            |
| -------------------------------------------------------------- | ----------------------------- | --------------------- |
| revisão adversarial do diff de um lote inteiro                 | Astra, esforço baixo ou médio | uma vez por lote      |
| jogar o jogo pelo navegador como leigo e contar onde se perdeu | Astra, no Work                | uma vez por tela nova |
| segundo pesquisador de uma lista de lacunas, com link e data   | Sol                           | quando houver lista   |
| crítica de desenho, revisão de texto, perguntas rápidas        | Sol, ou o chat comum          | à vontade             |

Tudo o que o GPT trouxer é hipótese até o Claude reproduzir ou conferir na fonte, como manda o
`AGENTS.md`.

**O plano dele (25/09):** R$ 100 por mês, o Plus pelo preço cobrado no Brasil (imprensa: cerca de
R$ 99,99; oficial: US$ 20). Ele tem o Astra no Codex e no Work, com a mesma cota de 5 a 45 mensagens
a cada cinco horas, e não no chat comum. O jeito de usar:

1. ao fechar um lote, o Claude escreve o pedido de revisão, com o intervalo de commits e o que
   procurar;
2. ele cola no Codex, com o Astra em esforço baixo ou médio, e pede que o Astra só leia e relate,
   sem alterar arquivo, porque o código é do Claude;
3. ele traz os achados, e o Claude reproduz cada um antes de aceitar.
