# O mapa das telas

> Versão 0, 25/09/2026, em laboratório. Detalha a [especificação mestra](master-spec.md) §6 com as
> lições do playtest de 25/09 e a [gramática das regras](rules-grammar.md). A interface será quase
> toda reformulada; o motor, a regra de que a tela só mostra o que a Presidência sabe e as provas
> ficam. Nenhuma tela nova entra no jogo sem ele escolher entre protótipos.

## As regras de toda tela

- **As telas são formas de governar,** e não a lista de órgãos do Estado (especificação §6.1).
- **Rosto antes de texto:** as pessoas aparecem como pessoas, com uma fala curta na voz delas.
- **Três linhas por escolha:** quanto custa, quem reage e quanto tempo leva.
- **A imagem ensina:** o placar da base contra os 257 votos de uma lei e os 308 de uma emenda
  explica o Congresso sem parágrafo.
- **Quem explica é um personagem.** Nada de pop-up, tutorial ou linha de instrução.
- **Detalhe sob demanda:** o artigo da lei e a conta abrem para quem pedir.
- **A estimativa aparece como estimativa:** o placar é a conta da assessoria, que pode errar.

## As telas propostas

Nomes e quantidade seguem abertos (especificação §6.4).

| tela                          | o que o jogador faz                                                      | substitui hoje                               | quando                    |
| ----------------------------- | ------------------------------------------------------------------------ | -------------------------------------------- | ------------------------- |
| **Posse**, depois **Governo** | escolhe os 38 ministros; depois acompanha as pastas, com as áreas dentro | as oito telas de área e a parte de ministros | lote E1.0e                |
| **Congresso**                 | vê as bancadas e as pessoas, a base, a pauta e a Mesa                    | Congresso & Leis                             | lotes E1.0b e E1.0c       |
| **Gabinete**                  | resolve o que chegou na semana, uma decisão por vez, em cena com pessoas | a mesa de papéis, e parte do Email           | depois da abertura        |
| **País**                      | vê os fatos concretos: economia, serviços, opinião                       | Finanças e Estado                            | depois                    |
| **Correspondência**           | lê e responde pedidos, convites e relatórios (especificação §6.6)        | Email                                        | depois                    |
| **barra de cima**             | vê a data, avança o tempo e poucos sinais globais (especificação §6.3)   | a barra de hoje                              | junto com a primeira tela |

## Como a troca acontece

1. Cada tela nova nasce em dois ou três protótipos, lado a lado, no
   [canvas dos protótipos](https://claude.ai/artifact/CHQmb6ksyKpYxdR8BBEnuM).
2. Ele escolhe um, ou pede uma mistura.
3. O lote do plano constrói a tela escolhida, com passeio novo no `validate`.
4. A tela antiga sai quando a nova cobre tudo o que ela fazia. O jogo nunca fica quebrado no meio.

Em 26/09 ele fixou o estilo Apple + Football Manager + Civilization + Valorant para a interface nova, que recomeça do zero sobre o motor ([ciclo 32](../cycles/32-the-new-interface.md)). O vidro (Liquid Glass, decisão de 05/09) fica só em superfície pequena sobre fundo parado: barra, menu, diálogo.

## O estilo fixado em 26/09

Primeiro registrado como direção futura; no mesmo dia ele fixou o estilo para a interface nova. As regras estão no [ciclo 32](../cycles/32-the-new-interface.md), §2. A proposta original, por referência:

- **Valorant, na escolha do ministro:** tela de escolha de agente. Grade de retratos com partido e
  linha política, retrato grande de quem está sob o mouse, botão NOMEAR que trava a escolha;
  cantos cortados em ângulo e fonte condensada em caixa alta nos números e títulos;
- **Football Manager, nos atributos:** Fama, Preparo e Afinidade em números coloridos por faixa; a
  ficha vira relatório de olheiro, com forças, riscos e comparação com o ministro atual;
- **Civilization, na cerimônia:** o hemiciclo como mapa e centro da tela; ministérios com moldura
  de ficha e anel dourado quando têm ministro; uma entrada curta da posse (data, faixa, retrato);
- **Apple, por cima de tudo:** uma cor de destaque, movimento com física, nada de enfeite sem
  função.

Começo sugerido: a escolha do ministro, onde o jogador passa mais tempo.

## Os protótipos da posse, 25/09

**Escolha dele em 26/09: a fusão de B e C. Os protótipos A, B e C foram apagados do canvas no mesmo dia; fica só a fusão.** A primeira versão punha os dois em abas separadas, e
ele recusou. A segunda é um hemiciclo só, sem abas, com dois passos por ministério no mesmo painel, desenhado como D no
mesmo canvas e descrito em
[o ministério](the-cabinet.md), §4.

Três estruturas com o mesmo visual, para comparar a estrutura e não a cor:

- **A · Lista e ficha:** as cadeiras à esquerda, três candidatos no centro, os partidos à direita.
- **B · O plenário:** os 513 deputados em semicírculo; a pasta vai a um partido, que indica o nome,
  e a bancada acende.
- **C · A conversa:** uma cadeira por vez, três pessoas na frente do jogador.

O que eles simplificam, e o jogo não vai simplificar:

- o placar soma as cadeiras de quem recebeu pasta; o motor puxa a lealdade até 80 e não garante
  voto;
- os candidatos saem de uma regra fixa; no jogo sairão do elenco da semente;
- as pessoas são silhuetas, e não retratos.
