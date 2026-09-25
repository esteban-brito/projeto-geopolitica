# O jogo em uma página

> Versão 3, 25/09/2026. Decisão dele depois do playtest do E0. Detalha a
> [especificação mestra](master-spec.md) (§1, §12, §13.7, §17, §24) com o que o jogador persegue,
> faz e vê. A [gramática das regras](rules-grammar.md) diz como cada regra real vira peça de jogo, e
> o [corte vertical](vertical-slice-energy.md) é a primeira aplicação. **Realismo acima de tudo:**
> toda regra executável tem fonte; o que não tem fica declarado.

## A promessa

Você governa o Brasil real e tenta transformá-lo na direção que quiser. O país resiste pelas regras
e pelos interesses reais. No fim, você vê o que mudou, o que ficou e o que custou.

Quem joga como um presidente comum muda pouco, e isso também é resultado.

## O loop

**Mandato a mandato:**

```text
ESCOLHO UMA TRANSFORMAÇÃO
→ DESCUBRO O QUE PRECISA MUDAR (norma, orçamento, empresa, instituição)
→ ESCOLHO O CAMINHO
→ MONTO APOIO E ENFRENTO QUEM PERDE
→ TENTO APROVAR → PROMULGAR → EXECUTAR
→ LIDO COM A REAÇÃO E AS CONSEQUÊNCIAS
→ TENTO CONSOLIDAR
→ O BRASIL MUDA
→ ESCOLHO A PRÓXIMA
```

**Semana a semana:** o mundo não espera. Chegam crise, escândalo, pedido, prazo, resultado do que
você fez antes. O que falta é a sua atenção: a agenda da semana só cabe algumas coisas, e cada uma
cobra o seu preço. Não existe ponto de ação. Você escolhe entre empurrar o seu projeto e apagar o
incêndio de hoje. A semana é a direção da especificação (§4); hoje o jogo avança por mês, e a
semana chega com a trilha B do [mapa de migração](migration-map.md).

**O mandato tem janelas reais:** a lua de mel do primeiro ano; as eleições municipais de outubro
de 2028 e as gerais de 2030, que mudam o comportamento do Congresso; as crises, que tornam possível
o que antes não era.

## O que o jogador vê: fatos concretos

Durante o jogo, o estado do país aparece em coisas que se reconhecem:

- participação do Estado na economia e empresas sob controle público;
- carga e estrutura dos tributos, e transferências;
- autonomia dos estados e dos municípios;
- poderes de emergência e independência das instituições;
- restrições legais a direitos;
- abertura comercial e controle de capital.

Os eixos (mercado ou Estado, liberdades, concentração de poder, e os demais) **saem desses fatos**.
Servem ao motor e ao balanço final; não viram um medidor na tela. Só se move o que vale e é
executado; discurso não conta. Medir cada fato e o ponto de partida em 2027 precisa de pesquisa com
fonte.

## A resistência nasce de quem perde

Não existe um atributo de "radicalidade". Para cada mudança, o motor pergunta:

- quem ganha, quem perde, e quanto?
- que recursos e que instituições quem perde pode acionar?
- quão legítima a mudança parece, e para quem?
- quão consolidada ela já está?

Uma mudança enorme que favorece quem tem poder pode passar fácil. Uma pequena que fere um interesse
organizado pode virar guerra. Cada ator decide pela VONTADE, pelo que sabe e pelo que quer.

## Os caminhos

O mesmo objetivo tem caminhos diferentes, e escolher entre eles é a estratégia:

| caminho              | dificuldade                          | alcance    | velocidade | risco                         | durabilidade            |
| -------------------- | ------------------------------------ | ---------- | ---------- | ----------------------------- | ----------------------- |
| lei ordinária        | média                                | limitado   | média      | baixo                         | desfaz-se com outra lei |
| PEC                  | alta: 3/5, dois turnos, duas Casas   | estrutural | lenta      | baixo                         | alta                    |
| medida provisória    | vale na hora, depois cai ou vira lei | médio      | imediata   | trava a pauta                 | depende da conversão    |
| decreto ou regulação | só dentro da competência             | específico | rápida     | jurídico, conforme o conteúdo | baixa                   |
| mobilização política | pressiona o Congresso                | —          | variável   | custo de aliança e de rua     | —                       |

Fora das regras normais também se pode tentar. Isso não é um botão: muda o próprio regime e a
relação com cada ator, com a reação que vier. Essa rota fica fora do primeiro corte (decidido em
25/09).

Os votos, o relógio e quem desfaz cada rota estão conferidos na Constituição, na
[gramática](rules-grammar.md), §2.

## A cadeia (lei do jogo)

```text
QUERER ≠ PROPOR ≠ APROVAR ≠ PROMULGAR ≠ EXECUTAR ≠ CONSOLIDAR
CONSOLIDADO ≠ IRREVERSÍVEL
```

Um jogador pode terminar dizendo "aprovei 70% do que queria, mas só 30% mudou o país". Outro aprova
menos e deixa mudanças mais duráveis.

## O fim

O jogo mostra, e não julga:

- o que você mudou e o que ficou igual;
- métricas observáveis contra 2027: economia, desigualdade, liberdades;
- instituições mais fortes ou mais fracas;
- quanto de cada mudança ficou frágil ou consolidado;
- a configuração política e econômica que resultou;
- como você saiu: fim do mandato, reeleição, afastamento, golpe, exílio.

O jogador julga a própria obra.

## O primeiro corte jogável: a estatal de energia

Uma empresa fictícia inspirada na Petrobras (ADR 0003). O jogador compõe o que quer fazer com ela,
sem classe ideológica. Três exemplos, entre infinitos:

- "vender 51% agora, manter golden share, abrir o setor e proibir nova expansão estatal";
- "manter o controle, vender subsidiárias e abrir concorrência em outra ponta";
- "comprar participação nas distribuidoras e proibir privatização futura".

Privatizar, por exemplo, não é um passo: é decidir o modelo, ver se precisa de lei, construir
apoio, enfrentar trabalhadores e contestação judicial, estruturar e executar a venda, lidar com o
mercado, sobreviver às consequências e consolidar. O caminho oposto tem outros obstáculos, e não é a
mesma barra andando para o outro lado.

O foco é o Brasil por dentro. O que é internacional (geopolítica, guerras, crises lá fora) entra
numa atualização futura, listada no próprio jogo, e até lá o mundo lá fora fica parado (ordem
dele, 25/09). O jogo abre com o jogador montando o governo: ministros, aliados e a eleição da Mesa da Câmara
(decisão dele, 25/09; corte vertical, §2).

A consequência fiscal já existe no motor: venda, dividendo e folha das estatais (mapa, §9).

O corte passa pelo critério da especificação (§21.4), e mais:

- ao menos três estratégias plausíveis, com resistência vinda de quem perde;
- resultados materialmente diferentes e legíveis;
- o jogador sentir que escolheu uma estratégia, e não que apertou um botão.

## Como se joga na tela (lições do playtest de 25/09)

- **Com pessoas, o encontro vira uma cena:** rostos que reagem e fala curta, na voz da pessoa.
- **Aprende-se jogando:** nada de pop-up, tutorial ou parágrafo. Quem explica é um personagem, e a
  imagem ensina.
- **Toda decisão mostra três linhas:** quanto custa, quem reage e quanto tempo leva, em termos que
  o jogador reconhece.

## O que já existe vira ferramenta do mundo

VONTADE (as pessoas decidem), A2a (ninguém sabe a verdade por mágica), LASTRO e `settlement` (o
dinheiro), Congresso (a rota legislativa), ESTRATO (as regras) e MALHA (a execução) são peças do
mundo. O erro foi tratá-las como o jogo. Elas são a resistência e as ferramentas para o que o
jogador quer: transformar o país.

## O que isso muda no plano

- **O E0 fica pausado.** O motor está pronto e sem commit, e volta como rotina de governo.
- **A consequência material vem antes de qualquer cena** (achado 77). É o lote E1.4.
- **A pesquisa da estatal está feita** ([pesquisa 14](../research/14-the-state-energy-company.md)).
  Seguem abertos: como medir cada fato concreto do país e o ponto de partida em 2027, e o
  calendário eleitoral (pesquisa R2 do mapa).
- **O plano são os lotes E1** do [mapa de migração](migration-map.md), §6.4. Cada um começa com
  ordem dele.
