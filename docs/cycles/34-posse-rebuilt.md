# Ciclo 34 — A posse refeita dentro do jogo

> Ordem dele em 01/10/2026: o foco é a versão nova da posse, que pode ser refeita do zero; sem
> pressa, com planejamento fundo e sem gastar à toa. É a etapa 1 do [ciclo 33](33-whole-game.md)
> e o lote E1.0e: a posse no jogo, no estilo do [ciclo 32](32-new-interface.md) §2.
> **Situação:** reescrito em 01/10 para a posse dentro do jogo; nada implementado.

## 1. Por que refazer

A posse de hoje é a tela do canvas do claude.ai rodando no runtime do canvas, alterada por
substituição de texto (`prototypes/posse/tools/prepare-posse.mjs`). Medido em 01/10, na recarga:

| defeito                                            | medida                                       | causa                                          |
| -------------------------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| frase da criação aparece sozinha antes da animação | inteira aos 130 ms                           | elemento fora da sequência `rise`              |
| brilho de fundo para numa borda                    | y = 800 em 1440×900                          | palco fixo de 1280×800                         |
| texto pode pular depois de aparecer                | fontes do Google Fonts, `display=swap`       | fonte remota                                   |
| travadas na entrada, CPU 4×                        | 158 ms na montagem, 55 ms na animação        | runtime monta tudo de uma vez                  |
| console sujo                                       | 49 erros                                     | o navegador lê o template cru antes do runtime |
| código impossível de revisar                       | 42 KB de lógica de tela em texto substituído | o gerador por patch                            |

Há também um defeito de arquitetura: os 656 políticos da posse nascem de um gerador dentro da
própria tela. É um segundo cérebro de pessoas, proibido pela [especificação](../spec/master-spec.md)
(§25.3): pessoa nasce no ELENCO, pela semente.

## 2. O que fica igual

A estrutura aprovada na versão 25 e as fichas da revisão v2o: criação do Presidente, cerimônia,
hemiciclo com os 513 deputados e os ministérios em anéis, painel de dois passos (o que fazer
com a pasta, depois quem comanda), listas Sugeridos, Partidos e Outros, ficha de pessoa e de
partido no hover, foto final. As reformas do governo variável: juntar, desfazer junção,
extinguir com destino por atribuição, recriar, criar com nome livre, transferir, renomear,
desistir de criar, busca com `e`, `ou`, `não`. O estilo é o do ciclo 32 §2. O inventário
completo de gestos e estados vira a lista de conferência da fase 5, tirada de
[o ministério](../spec/cabinet.md) §4 e do [contrato](../spec/dynamic-government.md).

## 3. A arquitetura

**Dentro do jogo, no sistema de desenho que existe** (ordem de 01/10). A posse é uma tela do jogo:
`src/ui/screens/posse.mjs`, uma folha `styles/` nova na ordem numerada, textos em
`src/ui/strings.mjs`, os tokens, as fontes (Inter e Source Serif 4), o Liquid Glass (`glaze`), a
mola (`spring.mjs`) e os ícones que já existem. Ela substitui o formulário de nova partida e
termina no Gabinete. As guardas atuais cobrem tudo; nenhuma segunda interface. O vidro vai só no
cartão do Presidente, no painel do ministério e na barra; nunca sobre o hemiciclo animado.

**A tela pergunta ao motor.** Sem gerador, sem segunda conta:

- **estrutura de ministérios:** `prototypes/government/` sobe para `src/domain/structure/`
  (codinome provisório QUADRO), com as 152 atribuições em `src/data/competencies.mjs` e esquema;
  a busca vai junto. A estrutura entra no estado e no save, que sobe para a versão 22 (autorizada
  em 01/10);
- **pessoas:** os candidatos de cada pasta saem do ELENCO pela semente, sem fluxo de RNG e sem
  depender da ordem de visita; notáveis (33) e técnicos (123) entram como catálogo com esquema,
  marcados como transição até o gerador por episódios ([contrato](../spec/dynamic-government.md) §4);
- **base:** `posseOf` para a abertura; depois de uma reforma, a estimativa segue pendente até o
  valor político da estrutura (contrato §3);
- **retratos:** o desenho procedural vira peça de `src/ui/components/`; os 12 retratos da Presidência
  viram recortes WebP pequenos, no lugar de duas folhas PNG de 1,5 MB.

**Pintura em partes.** O hemiciclo e a lista de pessoas se montam uma vez; hover e seleção mudam
atributos, sem repintar a tela. A entrada é uma sequência só, com as fontes já carregadas, só
`transform` e `opacity`; o trabalho pesado não roda na tela de criação.

## 4. A régua

Cada número vira prova automática; captura não basta.

| critério                   | meta                                                                      | onde se prova                                              |
| -------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| entrada no F5              | nenhuma peça visível antes da sua vez; zero quadro de template            | quadro a quadro, como a gravação de 01/10                  |
| travada na entrada, CPU 4× | nenhuma tarefa acima de 50 ms                                             | `PerformanceObserver` de `longtask`                        |
| gesto comum, CPU 4×        | nenhum quadro acima de 20 ms (ciclo 32 §2)                                | trace do hover, seleção e nomeação                         |
| tamanhos                   | 1280×800, 1440×900, 1920×1080, zoom de 125% e 150%                        | passeio do jogo                                            |
| layout                     | sem rolagem da página, sem recorte, sem peça sobre peça, contraste medido | as checagens do passeio atual, extraídas para `tests/lib/` |
| teclado                    | o percurso inteiro sem mouse; foco visível                                | prova de teclado                                           |
| console                    | zero erro                                                                 | todas as provas                                            |
| fontes                     | nenhuma requisição externa                                                | lista de requisições da prova                              |

## 5. As fases

Cada fase fecha com `validate` verde, as provas dela caindo antes contra o código anterior,
journal, handoff e commit. As fases 1 a 3 mexem em motor: `npm run simulate` e a série no handoff
no mesmo commit.

1. **Estrutura no motor.** QUADRO em `src/domain/structure/`, atribuições com esquema, busca,
   fachada; as 24 provas mudam de casa sem perder asserção; sai `prototypes/government/`.
2. **Estado e save.** A estrutura no estado, o save na versão 22, a posse nomeando pela ação que já
   existe; provas de recarga e de save antigo recusado.
3. **Pessoas no motor.** Candidatos por pasta no ELENCO, por semente; notáveis e técnicos com
   esquema; retratos procedurais e recortes da Presidência. Provas: mesma semente, mesmas pessoas;
   navegar não sorteia; ID não depende da pasta; uma pessoa por cadeira.
4. **A tela.** Criação, cerimônia, hemiciclo, painel, reformas, listas, fichas e foto, dentro do
   jogo. O passeio cobre a posse; a prova dos defeitos de 01/10 é reescrita para ela.
5. **Polimento e troca.** A régua do §4 inteira; inventário do §2 conferido gesto a gesto;
   capturas inspecionadas. Saem `prototypes/posse/` inteira (canvas, ponte e ferramentas), as provas de
   `tests/browser/posse/` e as suítes `posse-*`.
6. **O teste dele.** O que ele achar vira prova e conserto antes de qualquer ampliação.

## 6. Fora deste ciclo

O valor político da estrutura variável (contrato §3), currículos por episódio (§4), o rito da
MP (§2) e as outras telas. Cada um tem
lugar no [contrato](../spec/dynamic-government.md) §7 ou no ciclo 32.

## 7. Riscos

| risco                           | sinal                       | contenção                                                   |
| ------------------------------- | --------------------------- | ----------------------------------------------------------- |
| pintura em partes com bug sutil | foco ou animação perdidos   | prova de navegador antes da tela; id do dado em cada peça   |
| ELENCO muda a série             | `simulate` diferente        | gerar candidatos não toca o elenco que vota; série remedida |
| escopo crescer                  | lote que não fecha na régua | o §6 fica fora; achado novo vai para o handoff              |
| retrato mais lento que hoje     | decodificação no trace      | recortes WebP medidos na fase 3                             |
