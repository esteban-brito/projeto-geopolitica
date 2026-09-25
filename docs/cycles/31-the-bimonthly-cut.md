# Ciclo 31 — O corte do bimestre (E0 v1)

> **Situação em 25/09/2026:** implementado sem commit e **pausado** depois do playtest: a
> reunião em papel foi reprovada, e a decisão do corte não pesa no modelo (achado 77). Ver o
> [jogo em uma página](../spec/game-in-one-page.md). Este arquivo registra a autorização inteira, com as correções do Claude marcadas como
> _Correção_. Era o lote E0 do [mapa de migração](../spec/migration-map.md#61-os-lotes); o plano em vigor agora é o E1, a estatal (mapa §6.4).
> Medições que o sustentam: achados 76, 77 e 80 do [handoff](../handoff.md) e o journal, entradas
> 44 a 47.

## 1. Cenário-base do playtest

A trajetória limpa medida: plano definido em janeiro, emendas de manutenção refeitas todo mês,
relatório do mês 21, contingenciamento de cerca de 15,6%. O contexto fica explícito no cenário.
Ele é uma situação possível sob esse perfil de condução fiscal, não um destino de qualquer jogador.
Sem stress artificial e sem segundo mecanismo fiscal: `settlement`, LASTRO e as regras reais.

_Correção:_ o 18,4% que apareceu antes vinha de uma variante de medição com dois artefatos (emenda
de compra de voto sem reforma proposta, e plano de janeiro reimposto por cima de lei aprovada). O
número válido é o da variante limpa: 15,6%. Sem emendas refeitas, esse perfil não tem corte até o
fim do mandato.

## 2. Elenco

Quatro ministros focais: Infraestrutura, Previdência, Segurança e Defesa, os que têm dinheiro em
jogo no mês 21. A Fazenda participa como guardiã e parecerista da restrição fiscal. O parecer
dela informa o buraco, o espaço, o corte projetado, o corte das oito áreas, o efeito do rascunho e
o alerta de proteção acima do espaço. Ela não é uma quinta competidora simétrica: dentro do
espaço, a distribuição não mexe no primário. Saúde e Educação ficam fora da primeira versão.

_Correção:_ ver o bloqueio. Os quatro pedidos cabem juntos no espaço.

## 3. O que o E0 v1 deve provar

A camada humana da decisão presidencial. Deve provar que:

- as posições saem do VONTADE;
- os interesses de cada ministro são coerentes com o cargo;
- a semente varia a pessoa, e não a lógica do cargo;
- o rascunho muda a situação dos ministros, e uma mudança relevante provoca reconsideração;
- ministros diferentes reagem de modo diferente à mesma situação;
- **o Presidente arbitra interesses incompatíveis**;
- a interação é legível e interessante de jogar.

O E0 v1 não precisa provar que proteger uma pasta em vez de outra produz grande consequência
material: o modelo atual não a produz (achado 77), e isso não se esconde nem se compensa com
efeito inventado.

_Correção:_ a arbitragem entre interesses incompatíveis não acontece no mês 21 com esses quatro.
Ver o bloqueio.

## 4. Não alterar a simulação para o E0 parecer importante

Nesta versão não entra:

- recalibrar a MALHA ou os pesos dos grupos;
- inventar `impacts`, programas não executados, contratos adiados ou entregas;
- penalidade especial para Defesa ou Previdência;
- mexer no `allowance` (só o comentário obsoleto, se for estritamente documental);
- resolver o achado 80;
- A2b, mídia, vazamento, promessa ao ministro, confiança, ameaça de demissão;
- Congresso dentro do contingenciamento, corte parcial por área;
- tela nova;
- memória entre bimestres.

Se algo disso virar necessário, para e reporta antes.

## 5. Os ministros

Pessoas fictícias, determinísticas pela semente. O cargo define o esqueleto, e a semente modula a
pessoa dentro dele: tolerância ao corte, aversão a risco, persistência, peso do objetivo fiscal
secundário, prior de dano, disposição para ceder e tendência a insistir depois de uma recusa.
Variação de personalidade, nunca de lógica institucional.

_Direção de implementação:_ o mesmo padrão por hash do ELENCO; faixas por cargo em catálogo, com a
marca de parâmetro de design sem fonte, a calibrar no playtest.

## 6. Informação

O jogador vê o que a Presidência sabe.

- **Fazenda:** parecer oficial com q=1, com buraco, espaço, demanda, corte projetado, corte das
  oito áreas e resultado do rascunho. São contas do próprio governo (mapa, §5.6).
- **Ministro:** conhece a situação fiscal oficial; o dano futuro à própria pasta é crença, passa
  pelo A2a e pode ter q<1. Dois ministros podem estimar de modo diferente.
- **Fica escondido do Presidente:** prior, confiança, utilidade, pesos, trace e os valores
  internos do motor. Servem só a testes e depuração.

## 7. Fluxo do Momento Presidencial

1. Chega o parecer da Fazenda: buraco e corte projetado das oito áreas.
2. Os ministros focais avaliam, e cada um abre posição pelo `decide()`.
3. O Presidente altera o rascunho de `orders.protect`, e o `settlement` refaz a distribuição.
4. Quando a mudança é material para um ministro, ele reavalia.
5. O Presidente pode pedir alternativa, e o ministro cede, insiste ou escolhe outra posição, pela
   própria decisão.
6. O Presidente fecha o contingenciamento, e a decisão fica definitiva para aquele relatório.
7. Cada ministro aceita ou registra discordância.
8. O mês fecha pelos sistemas normais.

Não há reconsideração depois do fechamento.

## 8. Pedir alternativa e recusa presidencial

A recusa é um ato real, que o ministro observa, e pode reabrir a deliberação dele. A intervenção
não garante obediência: um ministro persistente pode insistir, e isso é desejável. Não se amplia o
A2a para fatos categóricos. Se só funcionar com semântica nova, categoria fingida de número,
exceção do E0 ou mudança no contrato do A2a, para e reporta. Nada de A3 disfarçado.

_Correção, com a representação escolhida:_ o sujeito é a **probabilidade que o ministro atribui a
o Presidente aceitar aquela posição** (um sujeito por posição). Probabilidade é valor numérico que
o A2a já aceita, e não é categoria: é o mesmo caso de "confiança alta em 30% de falha". A recusa
entra como evidência q=1 (estimativa 0). A avaliação da posição usa o `risk` do A1.1, que é "a
fração do ganho que pode não vir": `risk = 1 − P(aceitar)`. Sem recusa observada, a avaliação
conta com a aceitação. A reabertura vem pelo gatilho `basis`, que já existe.

- aversão a risco 1: a posição recusada perde o valor, e o ministro cede;
- aversão a risco abaixo de 1: ela ainda pode ser a melhor, e ele insiste.

Não muda motor, não muda contrato.

## 9. Reavaliação durante o rascunho

Proteger uma pasta aumenta o corte das outras. Se isso passar do que é material para outro
ministro, ele muda de posição pelo próprio mecanismo, e não por uma regra `if corte > X`.

_Direção:_ cada mudança do rascunho gera um novo parecer da Fazenda (q=1, fonte `fazenda`,
supersessão `latest-per-source`). A crença de cada ministro sobre a verba da própria pasta se
revê, e o gatilho `basis` decide, com a mudança material por família e a persistência do ministro.

## 10. Posições e repertório

Repertório pequeno e legível. A posição exibida é consequência da decisão do ator, e não texto
sorteado.

_Correção:_ com proteção binária e sem corte parcial, "aceitar um corte limitado" não existe como
ação. O repertório honesto é:

- pedir proteção da própria pasta;
- contestar a proteção de outra pasta, uma posição por pasta protegida no rascunho;
- esperar, que é aceitar: o VONTADE já trata "nenhum plano vale a pena" como intenção de esperar.

## 11. Argumentos

Uma posição curta e um argumento curto, derivados dos fatos e crenças que de fato participaram da
decisão (as crenças decisivas e os termos que mais pesaram no trace), sem gerador decorativo e sem
matemática interna à mostra.

## 12. Interface

Tudo no Gabinete, sem tela nova.

- **Parecer da Fazenda:** buraco, espaço, percentual geral, as oito áreas com o corte projetado de
  cada uma, e as áreas protegidas.
- **Ministros:** uma ficha por ministro focal, com nome, pasta, posição, argumento e "pedir
  alternativa". A ficha se atualiza quando o ministro reconsidera.
- **Nunca aparecem:** objetivos, pesos, prior, confiança, utilidade, trace.

## 13. Decreto bimestral

Entra a mudança já preparada (sem commit): `orders.protect` → `state.decree` até o próximo
relatório. Persiste a lista; o percentual é refeito pelo `settlement` a cada mês. A mesma lista dá
um percentual num mês e outro no seguinte (medido: 25,9% e 29,2%). O jogador não desfaz de graça,
no mês do meio, o que decidiu no relatório.

## 14. Memória dos ministros

Sem memória entre bimestres no primeiro playtest. Os ministros continuam sendo as mesmas pessoas
pela semente. A decisão sobre memória vem logo depois do playtest; é corte de escopo, não rejeição.

## 15. Fazenda

Não é competidora simétrica. Serve como fonte das contas oficiais, guardiã do limite, avaliadora
do rascunho e alerta de proteção acima do espaço. Uma decisão dela pelo VONTADE só entra se surgir
sem conflito forçado.

## 16. Consequências

Só pelos sistemas reais: LASTRO, MALHA, SONDA, CALDEIRA, ECLUSA quando houver efeito e o pagamento
das emendas. Nenhum efeito extra. A consequência pequena continua pequena se é o que a simulação
produz.

## 17. Emendas

O cenário pressupõe emendas de manutenção refeitas todo mês, e o setup do playtest diz isso. Se for
simples, o parecer mostra quanto da pressão vem desse compromisso mensal, sem virar tutorial.

_Correção de fidelidade, **VERIFICAR**:_ pelo que o Claude lembra do art. 166 da CF (emendas
impositivas), elas só podem ser limitadas "em até a mesma proporção da limitação incidente sobre o
conjunto das demais despesas discricionárias". O rateio do jogo corta as emendas pela razão das
áreas **não protegidas**, e por isso protegê-las despeja o corte no Congresso. Protegendo as oito
áreas no mês 21, o corte das emendas chega a 56,5%. As três fontes oficiais falharam nesta sessão:
o Planalto recusou conexão, o STF deu erro de certificado e o normas.leg.br só entrega JavaScript.
Nada disso vira regra antes da conferência (pesquisa R1).

## 18. Critérios automáticos

As posições saem do `decide()`; os quatro atores são determinísticos pela semente; sementes
diferentes modulam os atores sem quebrar a coerência do cargo; uma mudança material do rascunho
provoca nova decisão, e uma imaterial não gera reconsideração em série; pedir alternativa pode dar
nova posição e também insistência; nada privado vaza para a tela; o parecer mostra as oito áreas;
a lista persiste até o próximo relatório e o percentual é refeito todo mês; fechar impede nova
reconsideração no Momento; o E0 usa o `settlement` existente, sem matemática fiscal paralela. Prova
antiga que mudar tem de ser explicada.

## 19. Playtest

Com pelo menos três sementes. As perguntas:

- Entendi o que cada ministro queria, e por quê?
- Precisei pensar antes de escolher quem proteger?
- Alguém mudou de posição, ou insistiu, de um jeito convincente?
- Minha intervenção afetou pessoas?
- As sementes pareceram pessoas diferentes, e não comportamento aleatório?
- Arbitrei um governo, e não sliders?
- Quero tentar outra decisão?

"A escolha produziu grande consequência no Brasil" não é critério desta versão.

## 20. Fora de escopo

A2b, A3 completo, mídia, vazamentos, ameaças de saída, promessas, confiança pessoal, relações
persistentes, Congresso negociando o contingenciamento, corte parcial por área, semana, tela nova,
memória entre bimestres, recalibragem da MALHA e dos grupos, achado 80, e regra de
contingenciamento por frustração de receita.

## 21. Regra de implementação

O menor conjunto de mudanças de produção que torne o cenário jogável, sem demo descartável. O
código deve ser reutilizável para os próximos Momentos. Entre uma solução pequena e genérica e uma
específica do mês 21, fica a genérica, se não aumentar muito o escopo.

## 22. O inesperado

Blocker estrutural, necessidade de mudar o A2a ou de A3, recusa impossível de representar, bug
fiscal que muda o cenário ou regressão séria: para e reporta. Problema menor se resolve e se
documenta.

## 23. Validação

Portão completo, todas as provas, passeio, macaco, links e guardas, as sondas relevantes (as que
não devem mudar, imóveis), o cenário do mês 21 e ao menos três sementes do E0.

## 24. Commit

Sem commit antes da revisão.

## 25. Relatório esperado

- implementado: sim ou não;
- arquivos alterados;
- arquitetura usada;
- ministros e o que a semente varia;
- como o `decide()` entra na abertura, na reconsideração e no pedir alternativa;
- quais percepts entram, as fontes e quais usam o A2a;
- como a recusa foi representada;
- o que mudou no Gabinete;
- o decreto;
- as provas;
- `validate` e sondas;
- três sementes contadas como aconteceram, sem história forçada;
- limitações e dívidas;
- a avaliação: parece jogo ou laboratório? atores ou funções? há gambiarra? qual o maior problema
  que o playtest vai revelar?

## Bloqueio encontrado antes do código (25/09)

**Os quatro ministros focais cabem juntos no espaço.** No mês 21 da trajetória limpa:

- os pedidos de Infra, Previdência, Segurança e Defesa somam 6,20 bi/mês;
- o espaço é de 9,81 bi/mês;
- o Presidente protege os quatro, todos ficam satisfeitos, e o corte das outras quatro áreas e das
  emendas vai a 33,4%.

| proteção no mês 21 | corte nas não protegidas | emendas pagas de 3,21 | lealdade média 12 meses depois | aprovação | votações do mandato |
| ------------------ | ------------------------ | --------------------- | ------------------------------ | --------- | ------------------- |
| nenhuma            | 15,6%                    | 2,71                  | 58,4                           | 13        | 13 de 23            |
| os 4 focais        | 33,4%                    | 2,13                  | 56,9                           | 13        | 13 de 23            |
| as 8 áreas         | 56,5% (só emendas)       | 1,40                  | 54,8                           | 13        | 13 de 23            |

Na trajetória limpa, os quatro só deixam de caber no mês 35, com o espaço quase zerado. Ou seja: a
estratégia "proteja os quatro da sala e despeje o resto" domina, e sai quase de graça. O requisito
"o Presidente arbitra interesses incompatíveis" (item 3) não se cumpre, e a pergunta do playtest
"precisei pensar?" tende a responder não.

**Causa:** proteger não é escasso. O único limite é o espaço, e as áreas sem ministro e as emendas
absorvem o corte sem custo relevante no modelo (achados 76 e 77).

**Caminhos:**

| caminho                              | o que faz                                                                   | resolve a arbitragem?                                                                                                                                                                               | custo                                                                                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A — como autorizado                  | 4 ministros; aceita a dominância                                            | não; testa só a legibilidade dos ministros                                                                                                                                                          | o playtest provavelmente mostra "protegi os quatro e acabou"                                                                                                   |
| B — 8 ministros                      | todos na sala                                                               | não; proteger os oito despeja tudo nas emendas (56,5%)                                                                                                                                              | gerador genérico por cargo; 8 fichas                                                                                                                           |
| C — 8 ministros + limite das emendas | as emendas cortadas no máximo na mesma proporção das demais discricionárias | **sim**: no mês 21 as áreas têm de absorver 1,31 bi (espaço 9,81 − emendas pagas na proporção 2,71 = 7,10, contra 8,41 pedidos), então não dá para proteger todos, e o Presidente escolhe quem paga | conferir o texto constitucional antes (R1); corrigir o rateio existente, sem mecanismo novo; as sondas não protegem, então a série deve ficar imóvel (a medir) |
| D — dar preço às áreas sem ministro  | calibrar MALHA e grupos                                                     | talvez                                                                                                                                                                                              | vetado nesta versão; mexe na decisão de 21/08                                                                                                                  |

**Recomendação do Claude: C**, depois de conferir o texto constitucional. É o caminho que cria
escassez de verdade sem inventar consequência, e é o conflito real do Brasil: todas as pastas
disputam, e as emendas têm proteção constitucional contra virar lixeira. Se o Esteban quiser jogar
algo já, o **A** serve como teste de legibilidade, sabendo que a decisão vai ser fácil.

**Decisão pendente do Esteban.**
