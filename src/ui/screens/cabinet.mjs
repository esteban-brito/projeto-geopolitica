/* GABINETE — a tela inicial, e a unica que so resume. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════

   ── ELA SUBSTITUI A MESA, E NAO E A MESA COM OUTRO NOME ─────────────────────
   A Mesa misturava duas coisas: o resumo do mes e a mesa de negociacao. Quem
   abria o jogo caia no meio de uma decisao — placar, bancadas e controles de
   verba — sem antes saber como o pais estava. Agora sao duas telas: aqui se
   ENTENDE, e no Congresso se DECIDE.

   ── O GABINETE NAO DECIDE NADA ──────────────────────────────────────────────
   Ele e a segunda tela sem controle, depois de Financas, e a diferenca entre as
   duas e o proposito: Financas e o placar que se consulta, o Gabinete e o
   despacho que se resolve. Cada cartao aqui LEVA ao lugar onde a decisao mora —
   e essa e a mesma razao que separou a area da Mesa: decidir onde nao se ve a
   consequencia e decidir no escuro.

   ── A REFERENCIA E O INBOX DO FOOTBALL MANAGER ──────────────────────────────
   E ela nao e estetica: um dashboard de cartoes e a forma que resolve o problema
   de "o mundo tem coisas a me dizer e eu preciso escolher a quais responder".
   Enquanto o mundo nao fala — Congresso, relator e tribunal ainda nao escrevem —,
   a caixa de entrada declara a espera em vez de fingir conteudo. */

import { escapeHtml } from "../shared/html.mjs";
import { headHtml } from "../shared/head.mjs";
import { ribbonHtml } from "../shared/ribbon.mjs";
import { attr, money, percent, seats } from "../shared/format.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../domain/opinion/index.mjs").Approval} Approval
 * @typedef {import("../../data/opinion.mjs").Segment} Segment
 */

/**
 * ⚠ ELE PERDEU A CABECA EM 20/08/2026 — ver `leadHtml`, logo abaixo. O que sobrou e o
 * envelope: uma secao e um corpo. Um cartao sem titulo e sem caixa e, no fim, so um
 * BLOCO — e e por isso que a peca ficou de tres linhas.
 *
 * @param {object} input
 * @param {string} input.body
 * @param {string} [input.span] `lead` ocupa a coluna da esquerda
 * @returns {string}
 */
function cardHtml({ body, span }) {
  return (
    `<section class="card"${span ? ` data-span="${span}"` : ""}>` +
    `<div class="card__body">${body}</div>` +
    `</section>`
  );
}

/**
 * A LINHA DO NUMERO, com a porta que leva ao lugar de decidir.
 *
 * ⚠ ELA SUBSTITUIU A CABECA DO CARTAO em 20/08/2026, e o pedido foi nominal: "retira as
 * escritas caixa de entrada e o congresso, e as barras pretas que ficam embaixo das
 * escritas; padronize e simetria em tudo".
 *
 * ⚠ E AS CINCO LEGENDAS SAIRAM, e nao so as duas nomeadas — porque tirar duas de cinco
 * seria o oposto de padronizar. A regra que sobra e uma so e ela vale para o Gabinete
 * inteiro: **um bloco que abre com um numero nao precisa dizer o proprio nome**. "436 de
 * 513" nao fica mais claro embaixo de "O CONGRESSO", e "R$ 14,5 bi cabe no mes" nao fica
 * mais claro embaixo de "O COFRE DA UNIAO" — a legenda estava repetindo, em caixa alta e
 * ocupando uma linha, o que o numero ja dizia em corpo de titulo.
 *
 * ⚠ E A ACAO DESCEU PARA CA JUNTO. Ela morava na cabeca, e sem cabeca ela precisava de
 * lugar. Este e melhor do que o antigo: o botao que leva ao Congresso passa a ficar ao
 * lado do placar do Congresso, e nao acima de um rotulo. Porta colada na coisa que ela
 * abre — e as duas alinham na mesma base, que e a simetria pedida.
 *
 * @param {object} input
 * @param {string} input.value o numero, ja em HTML
 * @param {string} [input.action] o rotulo do botao
 * @param {string} [input.target] a secao para onde ele leva
 * @returns {string}
 */
function leadHtml({ value, action, target }) {
  return (
    `<div class="card__lead">${value}` +
    /* ⚠ ELA VIROU VIDRO EM 21/08/2026, e o `glass-action` e o NIVEL 2 do material —
       aquele que `20-material.css` descreve como "o que se pressiona". Ate hoje ele
       era usado UMA vez no app inteiro, no botao de avancar o mes: o sistema de tres
       niveis existia com o do meio vazio, e todas as outras pecas pressionaveis eram
       retangulos tintados imitando o que o material ja sabia fazer.
       ⚠ E O VIDRO SO DESCE ONDE A LAMINA ESTA ATRAS. Estas duas ficam sobre o palco;
       as da carta NAO, e por isso elas continuam de papel. Ver `inbox.mjs`. */
    (action && target
      ? `<button class="card__action glass-action" type="button" ` +
        `data-section="${escapeHtml(target)}">${escapeHtml(action)}</button>`
      : "") +
    `</div>`
  );
}

/* ── O ARCO MORREU AQUI EM 15/08/2026, e o hemiciclo o substituiu ───────────
   `archHtml` desenhava a base efetiva repartida em tres fatias — leal, obstruindo,
   rompida — e a prosa dele trazia a razao de NAO desenhar 513 cadeiras: "o modelo
   nao tem deputado individual, ele tem quatro blocos". Aquilo era verdade e deixou
   de ser quando o ELENCO nasceu: a Camara passou a ter ONZE bancadas com contagem
   de cadeiras propria.

   ⚠ E A SUBSTITUICAO E A DECISAO, e nao a convivencia. Os dois pareciam responder
   perguntas diferentes — o arco, "quao saudavel e minha base?"; o hemiciclo, "de que
   a Camara e feita?" —, mas o hemiciclo responde as DUAS: a cor de cada cadeira e a
   saude da bancada dela, e a cadeira cheia contra a vazada e a base efetiva. O arco
   virou um subconjunto, e manter os dois seria a mesma verdade em dois desenhos no
   mesmo cartao.

   O que sobreviveu inteiro dele foi a LEGENDA, e a licao que a criou: tres cores sem
   chave e um grafico que so o autor lê. Ver `src/ui/shared/hemicycle.mjs`. */

/* ⚠ `legendHtml` MORREU EM 20/08/2026, e o registro dela fica porque a lição não
   morreu junto. Ela decifrava as três cores de humor do arco — "com o governo /
   obstruindo / em ruptura" — e nasceu de um defeito caro: três cores sem chave, e um
   gráfico que só o autor lê. A regra que ela deixou continua valendo e a fita a herdou
   inteira: **desenho de várias cores precisa de chave**. O que mudou foi de quem é a
   chave, e quantas peças ela tem — uma rampa se decifra pelos POLOS, e não item a item.

   A regra irmã dela também sobreviveu, aplicada na própria fita: só entra no desenho
   quem tem cadeira. Ver `src/ui/shared/ribbon.mjs`. */

/**
 * A tela inteira.
 *
 * @param {object} input
 * @param {string} input.situation o nivel do governo — crisis, stable, growth
 * @param {string} input.verdict a frase que diz o que esta em jogo
 * @param {{ name: string, label: string } | null} input.adviser quem assina a leitura
 * @param {{ name: string, label: string } | null} [input.adviser] quem assina a leitura
 * @param {number} input.base cadeiras que respondem ao governo
 * @param {number} input.seats o plenario inteiro
 * @param {number} input.majority
 * @param {{ loyal: number, obstructing: number, ruptured: number }} input.split a base por estado
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 *   delivered: number, mood: string }>} input.chamber as bancadas, ja contadas pelo motor
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 *   delivered: number, mood: string }>} input.chamber as onze bancadas, do motor
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 *   delivered: number, mood: string }>} input.chamber as onze bancadas, ja contadas pelo motor
 * @param {boolean} input.resolved se ALGUM mes ja foi resolvido. ⚠ Ele existe para o
 *   estado vazio escolher a frase verdadeira, e sai do MES do estado e nao do relatorio
 *   em memoria: o relatorio nao vai para o save, e o mes vai
 * @param {string} input.inbox a BANDEJA ja montada — lista e oficio aberto —, e vazia
 *   enquanto o mundo nao escreve. ⚠ Ela chega pronta de `trayHtml` em vez de as cartas
 *   chegarem soltas: quem decide qual oficio esta aberto e a bandeja, e o Gabinete nao
 *   tem por que saber que existe um aberto
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.committed o que as ordens do mes ja comprometeram
 * @param {number} input.mandatory a despesa obrigatoria anualizada
 * @param {number} input.revenue a receita anualizada
 * @param {ReadonlyArray<{ id: string, label: string, spend: number, guard: string }>} input.locked
 *   o que mais prende a obrigatoria, e a natureza da norma que prende
 * @param {ReadonlyArray<Segment>} input.segments
 * @param {Record<string, Approval>} input.street a pesquisa de cada segmento
 * @param {{ lobbies: ReadonlyArray<{ id: string, label: string, wants: string,
 *   share: number, pressure: number, boiling: boolean, boil: number }>,
 *   rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 *   ruptures: ReadonlyArray<{ id: string, value: number, threshold: number,
 *     breaks: string, open: boolean }>,
 *   impeachment: number | null, fallen: number | null }} input.boiler a CALDEIRA, perguntada a `boilerOf`
 * @returns {string}
 */
export function cabinetHtml(input) {
  /* O VEREDITO SOBE PARA CA. Ele morava no rail da direita, que deixou de
     existir — e este e o lugar certo: ele e a leitura do governo inteiro, e o
     Gabinete e a tela do governo inteiro.

     ⚠ ELE GANHOU UM ROTULO, e a razao veio de uma revisao de fora: a frase estava
     SOLTA no canto superior direito, sem nada que justificasse a existencia dela, e
     lia como texto esquecido na tela. O rotulo nao e enfeite — ele responde a
     pergunta que o leitor faz antes de qualquer outra: quem esta falando isto, e
     sobre o que. Sem ele, uma frase em prosa no meio de uma tela de numeros parece
     sobra de outro layout.

     ⚠ E O ROTULO DEIXOU DE SER DESTA TELA, em 15/08/2026. Ele era `cabinet__*`, e
     era o mesmo desenho que a area precisava para o indice dela — duas classes para
     um lugar so, que e como uma paleta comeca a divergir. Agora as cinco telas
     montam a cabeca com a mesma peca, e a leitura da direita e um slot. */
  /* ⚠ A LEITURA GANHOU AUTOR em 15/08/2026, e a razao e a mais funda da auditoria:
     nenhuma tela do Planalto se DIRIGIA ao presidente. Tudo era descrito em terceira
     pessoa, e esta frase — a unica escrita PARA ele — chegava sem ninguem atras
     dela. Assinada, ela deixa de ser um rotulo do sistema e vira o que ela sempre
     quis ser: o conselho de quem trabalha para voce.
     O CONSELHEIRO PODE NAO EXISTIR, e a assinatura some junto em vez de imprimir um
     vazio: um "leitura de —" seria pior que nenhuma assinatura. */
  /* ⚠ A LEITURA DO MÊS SAIU INTEIRA EM 20/08/2026 — rótulo, veredito e assinatura.
     O pedido foi nominal: "aquela leitura do mês toda você já remove". Ela custava
     **101px do topo da lâmina** — a cabeça inteira era dimensionada por ela, e não pelo
     título — para dizer em prosa o que a tela já diz em três instrumentos: a Trindade
     do risco logo abaixo, o gel de situação que tinge a tela inteira, e a barra de cima.

     ⚠ E O QUE ELA TINHA DE PRÓPRIO CONTINUA EXISTINDO NO MOTOR: `situationOf` segue
     governando o tom da tela, e a Casa Civil segue assinando a carta do mês na Caixa de
     Entrada — que é onde uma voz que se dirige ao presidente pertence. O que morreu foi
     a repetição dela num cabeçalho, e não a voz. */
  const head = headHtml({ title: UI.cabinet.title });

  /* ── A CAIXA DE ENTRADA E A COLUNA DA ESQUERDA, CHEIA OU VAZIA ─────────────
     ⚠ ELA JA FOI UMA FAIXA NO TOPO, e a razao escrita era boa: meia tela em branco
     ao lado de tres cartoes cheios leria como defeito de carregamento. A razao era
     boa e estava errada, e foram tres sinais para admitir — duas revisoes externas
     e o responsavel usando a tela.

     O que eu subestimei e que O LAYOUT E UMA PROMESSA. Uma tela que muda de
     esqueleto quando o conteudo chega nao ensina onde as coisas moram: o jogador
     aprende um mapa no mes 1 e recebe outro no mes em que a primeira carta cair —
     justamente o mes em que ele mais precisa saber para onde olhar. E o custo da
     forma definitiva desde o inicio e uma coluna com pouco texto dentro; o custo do
     contrario e o mapa se refazendo debaixo do pe.

     A LISTA CRESCE PARA BAIXO, e e por isso que ela precisa de ALTURA e nao de
     largura: quatro cartas num mes empurrariam o Congresso e o Cofre para fora da
     tela se ela fosse uma faixa no topo. */
  const inbox = cardHtml({
    span: "lead",
    body:
      input.inbox === ""
        ? /* ── O VAZIO OCUPA A COLUNA, e nao um paragrafo no alto dela ──────────
             ⚠ ELE VIROU COMPOSICAO NO DIA EM QUE A CAIXA VIROU COLUNA. Como faixa
             no topo, um paragrafo bastava; numa coluna de 700px de altura, o mesmo
             paragrafo encostado no teto deixa um vao enorme embaixo e a tela lê
             como carregamento que travou. O vazio centrado lê como o que e — um
             lugar reservado, com a razao dita.

             A CHAMADA VEM ANTES DA EXPLICACAO porque ela responde a pergunta que o
             olho faz primeiro ("isto esta quebrado?") em cinco palavras, e a prosa
             abaixo responde a segunda ("por que?") para quem quiser. Invertido, o
             jogador lê tres linhas antes de saber se precisa se preocupar. */
          /* ⚠ A CHAMADA MUDOU em 15/08/2026, e o motivo e que a antiga deixou de ser
             verdade. Ela dizia "a mesa ainda nao recebe correspondencia", e a mesa
             passou a receber: o mes que fecha cai aqui como carta. O que sobrou de
             verdadeiro e mais estreito — nenhum mes foi resolvido ainda —, e a NOTA
             continua declarando o que de fato falta, porque o Congresso, o relator e
             o tribunal seguem sem escrever. Sao dois estados vazios diferentes, e
             este e o primeiro dos dois. */
          /* ⚠ E EM 21/08/2026 ELE PASSOU A TER DUAS FRASES, porque a unica que havia
             MENTIA num caso real — fotografado pelo responsavel. Recarregar a pagina
             com partida salva zera a bandeja: `last`, o relatorio do mes, e variavel de
             modulo e nao vai para o save, entao na volta `describeMonth` nao produz
             carta nenhuma e `state.mail` pode estar vazia. A tela dizia "o primeiro mes
             ainda nao foi resolvido" em junho de 2027, com tres meses resolvidos atras,
             e prometia na linha seguinte que "todo mes que voce resolve chega aqui".

             ⚠ E A DECISAO E QUAL FRASE, E NAO SE HA FRASE. Ausencia se declara neste
             projeto; o que a captura pegou foi ausencia declarada com o texto ERRADO.
             `resolved` responde a unica pergunta que separa os dois casos, e ele vem do
             MES do estado — que sobrevive a recarga —, e nao de `last`, que nao. */
          `<div class="empty">` +
          `<p class="empty__lead">` +
          `${escapeHtml(input.resolved ? UI.inbox.quietLead : UI.inbox.firstLead)}</p>` +
          `<p class="empty__note">` +
          (input.resolved ? "" : `${escapeHtml(UI.cabinet.inboxSigned)} `) +
          `${escapeHtml(UI.cabinet.inboxWaiting)}</p>` +
          `</div>`
        : input.inbox,
  });

  /* ⚠ O ARCO DEU LUGAR AO HEMICICLO em 15/08/2026, e a substituicao — e nao a
     convivencia — e a decisao. Os dois respondiam perguntas diferentes: o arco
     repartia a base efetiva por saude, o hemiciclo desenha a Camara inteira. Mas o
     hemiciclo responde AS DUAS: a cor de cada cadeira e a saude da bancada dela, e
     a cadeira cheia contra a vazada e a base efetiva. O arco virou um subconjunto,
     e manter os dois seria a mesma verdade em dois desenhos no mesmo cartao — que
     e exatamente o que a regra das tres fatias evitou quando ela nasceu.
     A LEGENDA FICA, e ela e o que impede o desenho de ser um grafico que so o autor
     lê: tres cores sem chave ja custaram um dia inteiro a este cartao. */
  const congress = cardHtml({
    body:
      leadHtml({
        value:
          `<p class="card__hero" data-numeric>${seats(input.base)}` +
          `<small>${escapeHtml(UI.cabinet.seats)}</small></p>`,
        action: UI.cabinet.congressAction,
        target: "congress",
      }) +
      /* ⚠ A CHAVE MUDOU DE DONO EM 20/08/2026, e a legenda de humor MORREU junto.
         Enquanto a fita pintava por humor, esta linha era a chave dela. Agora a fita
         pinta pelo EIXO e o humor virou o comprimento preenchido de cada bloco — e uma
         legenda que decifra uma cor que não existe mais é pior que nenhuma: ela ensina
         a ler o desenho errado.

         A chave nova mora dentro da própria fita, porque é dela: dois polos e a
         maioria, numa linha só. Ver `ribbon.mjs`. */
      ribbonHtml({ benches: input.chamber, total: input.seats, majority: input.majority }),
  });

  /* O COFRE MOSTRA O QUE SOBRA E O QUE ESTA PRESO, e os dois na mesma barra: a
     obrigatoria nao e contexto, e a razao de o discricionario ser pequeno. Ver os
     dois separados faria o jogador ler "R$ 25 bi" como o orcamento do pais. */
  const locked = input.revenue > 0 ? Math.min(1, input.mandatory / input.revenue) : 0;

  /* QUANTO O MES JA PASSOU DO QUE CABE. Zero quando cabe — e a comparacao e entre
     os dois numeros que o cartao ja tem, sem nenhuma conta nova: `room` e o que o
     LASTRO abre, `committed` e o que as ordens deste mes pediram. */
  const excess = Math.max(0, input.committed - input.room);

  /* ⚠ O ESTOURO E MEDIDO NA LEITURA, E NAO NO VALOR CHEIO. Um excesso de 0,04
     imprime "R$ 0,0 bi", e acender o vermelho ali faz a cor negar o numero ao lado
     dela — foi o defeito que Financas levou uma sessao para achar. Comparar as
     duas FORMATACOES resolve sem digitar limiar nenhum, e continua certo no dia em
     que `money` mudar de casas decimais. */
  const over = money(excess) === money(0) ? 0 : excess;

  /* ⚠ O HERO E O QUE CABE, E NAO O QUE SOBRA. A primeira versao mostrava
     `room − committed` sob o rotulo "livre no mes", e a partida abria com
     "R$ 0,0 bi" — porque o orcamento HERDADO ja consome o discricionario inteiro.
     O numero estava certo e a leitura, errada: zero ao lado de "livre" parece
     defeito de carregamento, quando na verdade e a descoberta mais dura do
     modelo. Ela merece uma frase, e nao um zero. */
  const vault = cardHtml({
    body:
      leadHtml({
        value:
          `<p class="card__hero" data-numeric>${money(input.room)}` +
          `<small>${escapeHtml(UI.cabinet.vaultFree)}</small></p>`,
        action: UI.nav.finance,
        target: "finance",
      }) +
      `<div class="meter meter--vault" role="img" ` +
      `aria-label="${escapeHtml(`${percent(locked)} ${UI.cabinet.vaultLocked}`)}">` +
      `<span class="meter__part" data-part="poor" style="flex-grow:${(locked * 100).toFixed(1)}"></span>` +
      `<span class="meter__part" data-part="good" style="flex-grow:${((1 - locked) * 100).toFixed(1)}"></span>` +
      `</div>` +
      /* ── O ESTOURO PASSA A TER SINAL ────────────────────────────────────────
         ⚠ A TELA MOSTRAVA "cabe R$ 14,2 bi" E "ja consome R$ 14,5 bi" LADO A
         LADO, sem uma cor, sem uma palavra. O orcamento escrito passava do que
         cabia — que e o rateio funcionando, e a coisa mais importante que este
         cartao tem a dizer — e o jogador via dois numeros parecidos e uma
         aparente contradicao. O padrao do projeto e explicito: cor e texto contam
         a mesma historia, e aqui o texto contava um estouro e a cor, calmaria.

         E O QUE SE MOSTRA NO ESTOURO E O EXCESSO, e nao o total outra vez. Dois
         valores em "R$ 14,x bi" a dois centimetros um do outro obrigam a subtrair
         de cabeca para descobrir a unica coisa que importa — quanto falta. A
         subtracao e da tela, e nao do jogador.

         ⚠ O TOM SEGUE O NUMERO ARREDONDADO, e nao o cheio. E a mesma correcao que
         Financas ja levou: um excesso de 0,04 imprime "R$ 0,0 bi" e pintar isso de
         vermelho faz a cor negar o numero ao lado dela. */
      /* ⚠ SO O EXCESSO ACENDE, E NAO A LINHA INTEIRA. A primeira versao pintava o
         paragrafo todo de vermelho, e uma revisao externa acusou na hora: com
         "obrigatoria 95%" no mesmo tom do estouro, os dois viram contexto e o
         perigo deixa de ter destaque. Vermelho que cobre tudo nao destaca nada —
         e a correcao da manha tinha criado exatamente o defeito que ela veio
         corrigir, so que com mais tinta. */
      /* ⚠ E O RAMO CALMO ENCOLHEU EM 21/08/2026, e SO ELE. O pedido do responsável era
         cortar esta metade inteira — "o orçamento escrito já consome R$ 14,5 bi" —, e a
         medição recusou o corte: o hero é `room`, o que CABE, e esta linha é
         `committed`, o que as ordens PEDIRAM. Os dois imprimem o mesmo valor no mês 1
         por coincidência do orçamento herdado, e divergem no mês 2. Apagar teria tirado
         da tela a leitura "quanto do que cabe já está gasto", que é a pergunta que o
         cartão inteiro existe para responder.

         O que sobrou foi encurtar as PALAVRAS: seis viraram uma, e os dois números
         continuam onde estavam. ⚠ O ramo do ESTOURO não encolhe — ele é o estado
         acionável do bloco, e é o único momento em que esta linha precisa de frase. */
      `<p class="card__note">${escapeHtml(UI.cabinet.vaultLocked)} ` +
      `<b data-numeric>${percent(locked)}</b> · ` +
      (over > 0
        ? `<b data-over="true">${escapeHtml(UI.cabinet.vaultOver)} ` +
          `<b data-numeric>${money(over)}</b></b>`
        : `${escapeHtml(UI.cabinet.vaultTaken)} <b data-numeric>${money(input.committed)}</b>`) +
      `</p>` +
      /* ── DO REAL TRAVADO ATE O TEXTO QUE O TRAVOU ────────────────────────────
         ⚠ ELA E A METADE DO RISCO R2 QUE FALTAVA, e uma revisao externa a cobrou
         com todas as letras: "a barra diz que 95% e obrigatorio, mas nao ha como
         investigar quais leis herdadas estao sugando esse dinheiro".

         Ela so ficou construivel quando a lei virou texto. Enquanto a faixa era um
         par de numeros, "quem trava" nao tinha resposta — havia um piso e ninguem
         para responder por ele. Agora `resolve` devolve QUAL norma decidiu cada
         piso, e a tela pergunta em vez de deduzir.

         ⚠ TRES LINHAS, E NAO A LISTA INTEIRA. Trinta e oito programas com o valor
         de cada um seria o Diario Oficial dentro de um cartao de resumo — que e
         exatamente o risco R2 pelo outro lado, o da heranca que aliena o jogador
         antes do terceiro mes. Tres respondem "por que eu nao tenho dinheiro" numa
         passada de olho, e o resto mora na area de cada programa.

         ⚠ E TRES VIRARAM UM EM 21/08/2026, a pedido do responsavel — e ELA E UMA PERDA
         DE RESPOSTA, nao um conserto. Ele pediu o corte inteiro do bloco; a verificacao
         recusou o corte porque a leitura NAO existe em outro lugar: Financas mostra a
         obrigatoria como TOTAL, e quem trava so aparece programa a programa, espalhado
         por oito telas de ministerio. Apagar aqui apagaria do jogo a unica resposta ao
         item de auditoria que criou este bloco — "nao ha como investigar quais leis
         herdadas estao sugando esse dinheiro".

         O QUE SOBROU E O MAIOR, e ele responde a pergunta em uma frase em vez de em
         cinco linhas. ⚠ O ROTULO MORREU JUNTO — "e quem trava" acima de uma lista de um
         item so e um titulo para um paragrafo, e a regra do Gabinete desde 20/08 e que
         um bloco nao diz o proprio nome. O VERBO carrega o que o rotulo carregava: "X
         trava R$ Y" e uma sentenca, e sentenca nao precisa de cabeca.

         ⚠ E `lockedBy` CONTINUA DEVOLVENDO TRES. O corte e de TELA, e o segundo e o
         terceiro estao a um parametro de distancia no dia em que a coluna couber. */
      (input.locked[0]
        ? `<p class="locked">` +
          `<span class="locked__item" data-guard="${escapeHtml(input.locked[0].guard)}">` +
          `${escapeHtml(input.locked[0].label)} ${escapeHtml(UI.cabinet.vaultWho)} ` +
          `<b data-numeric>${money(input.locked[0].spend)}</b></span></p>`
        : ""),
  });

  /* A RUA POR SEGMENTO, e nao a media. A media esconde exatamente o que decide o
     risco de queda: um governo com apoio morno de todo mundo aguenta uma crise, e
     um adorado por metade do pais e odiado pela outra nao aguenta nenhuma. */
  const street = cabinetStreetHtml(input);
  const boiler = boilerCardHtml(input);

  return (
    `<section class="area glass-stage cabinet">` +
    head +
    trinityHtml(input) +
    /* ⚠ A COLUNA DA DIREITA E UM ELEMENTO, e nao quatro irmaos soltos na grade. Ate
       16/08/2026 os cinco cartoes eram filhos diretos de `.cards`, e a Caixa de
       Entrada dizia `grid-row: 1 / span 3` para acompanhar a altura deles.

       O `span 3` foi escrito quando havia TRES resumos. O ciclo 10 acrescentou a
       CALDEIRA, ninguem voltou aqui, e a coluna da esquerda passou a terminar uma
       linha antes da direita — um degrau que so a captura mostra, porque nada falha:
       o `span` continua sendo um span valido.

       ⚠ E `1 / -1` NAO CONSERTA, o que me custou uma tentativa: `-1` conta a ultima
       linha da grade EXPLICITA, e aqui todas as linhas sao implicitas. A bandeja
       voltou a ocupar uma linha so.

       Com a coluna dentro de um elemento, a grade tem duas celulas e ponto. Nao ha
       contagem para manter em dia, e um sexto resumo nao reabre isto. */
    `<div class="cards">${inbox}` +
    `<div class="cards__side">${congress}${vault}${boiler}${street}</div>` +
    `</div>` +
    `</section>`
  );
}

/**
 * A TRINDADE — as tres rupturas que precisam acontecer JUNTAS para o processo abrir.
 *
 * ⚠ ELA E A MELHOR IDEIA DO DECIMO DOSSIE, e ficou parada meio dia por uma razao que
 * caducou no mesmo dia: dois dos quatro lobbies nunca se moviam (achado 30), e
 * desenhar um medidor que promete derrubar presidente sobre um motor que nao se mexe e
 * a decoracao que o ciclo 10 se acusa de ter feito. Consertado o achado 31, o pais
 * passou a se degradar e os dois passaram a andar — medido: o setor produtivo vai a 33
 * e as forcas de ordem a 35 em 48 meses, contra ZERO antes.
 *
 * ⚠ E A TRINDADE DO DOSSIE NAO E A DO MODELO, e a correcao decide o desenho. Ele
 * propunha Ruas / Maquina (burocracia + forcas de ordem) / Blindagem. A burocracia nao
 * existe, e as forcas de ordem tem `weight: 0` — elas NAO entram na ruptura economica,
 * por decisao registrada em `lobbies.mjs`. Quem a carrega e o mercado e o setor
 * produtivo, que a trindade dele omite. O que se desenha e a trindade do MOTOR.
 *
 * ⚠ NENHUM NUMERO E CALCULADO AQUI. Valor, limiar e o lado em que cada uma rompe vem
 * de `boilerOf` — a social se lê ao contrario das outras duas, e saber disso e regra de
 * motor. A tela pergunta.
 *
 * @param {object} input
 * @param {{ ruptures: ReadonlyArray<{ id: string, value: number, threshold: number,
 *   breaks: string, open: boolean }> }} input.boiler
 * @returns {string}
 */
function trinityHtml({ boiler }) {
  const rows = boiler.ruptures
    .map(item => {
      const label = UI.cabinet.trinity[/** @type {"social"} */ (item.id)];

      /* ⚠ A BARRA MOSTRA O VALOR NA ESCALA DELE, COM O LIMIAR MARCADO — e a primeira
         versao normalizava "quanto do caminho ate a ruptura ja andou". Ela MENTIA, e a
         captura pegou: com a rua em 44 e o piso em 20, a conta dava 70% e a barra
         aparecia quase cheia e vermelha num governo confortavel.

         O erro e de familia conhecida: normalizar por uma regua inventada desenha
         drama onde nao ha. A regua honesta e a que o motor usa — zero a cem — e o que
         o jogador precisa saber e de que LADO da linha ele esta. E o mesmo desenho da
         regua legal do controle de verba, com a marca do piso no proprio trilho. */
      const safe =
        item.breaks === "below" ? item.value > item.threshold : item.value < item.threshold;

      return (
        `<div class="trinity__item"${item.open ? ' data-open="true"' : ""}>` +
        `<span class="trinity__who">${escapeHtml(label)}</span>` +
        `<span class="trinity__value" data-numeric>${seats(item.value)}` +
        `<small>${escapeHtml(item.breaks === "below" ? UI.cabinet.trinityBelow : UI.cabinet.trinityAbove)} ` +
        `${seats(item.threshold)}</small></span>` +
        /* O VALOR E A MARCA SAO DADO, e por isso vao em estilo inline — a mesma
           excecao declarada do `--floor` no trilho do orcamento. */
        `<div class="gauge" role="img"${safe ? "" : ' data-past="true"'} ` +
        `style="--index:${attr(Math.round(item.value))};--mark:${attr(item.threshold)}" ` +
        `aria-label="${escapeHtml(`${label}: ${seats(item.value)}`)}"></div>` +
        `</div>`
      );
    })
    .join("");

  /* ⚠ O RODAPE DIZ O QUE AINDA SEGURA O GOVERNO DE PE, e nao quantas romperam. Um
     contador — "2 de 3" — mede o tamanho do perigo e esconde a unica coisa acionavel:
     QUAL delas ainda nao rompeu. */
  const holding = boiler.ruptures.filter(item => !item.open).length;

  return (
    `<section class="trinity"${boiler.ruptures.every(i => i.open) ? ' data-open="true"' : ""}>` +
    `<h3 class="block__legend">${escapeHtml(UI.cabinet.trinityTitle)}` +
    `<span>${escapeHtml(holding === 0 ? UI.cabinet.trinityNone : UI.cabinet.trinityHold)}</span></h3>` +
    `<div class="trinity__row">${rows}</div>` +
    `</section>`
  );
}

/**
 * O TERMOMETRO DA RUA.
 *
 * ⚠ ELE E UMA FUNCAO SEPARADA e nao esta inline no corpo acima porque a Caixa de
 * Entrada vai precisar dele: quando o inbox existir, uma carta de pesquisa vai
 * mostrar exatamente este bloco dentro dela. Extrair depois seria mexer nas duas.
 *
 * @param {object} input
 * @param {ReadonlyArray<{ id: string, label: string, spend: number, guard: string }>} input.locked
 *   o que mais prende a obrigatoria, e a natureza da norma que prende
 * @param {ReadonlyArray<Segment>} input.segments
 * @param {Record<string, Approval>} input.street
 * @returns {string}
 */
function cabinetStreetHtml({ segments, street }) {
  const rows = segments
    .map(segment => {
      const poll = street[segment.id];
      if (!poll) return "";

      /* ⚠ A LINHA E A MESMA DA CALDEIRA, e a peca comum e `.reading`. Ate 16/08/2026
         cada uma tinha a propria grade — 7,5rem aqui, 9rem la —, e as duas moram uma
         embaixo da outra na mesma coluna do Gabinete: as barras comecavam em pontos
         diferentes e o olho lia desalinho sem conseguir nomear a causa. */
      /* ⚠ A DESCRICAO NOMEIA AS TRES FATIAS, e nao so a verde. Ate 21/08/2026 ela era
         uma frase digitada nesta view — "X% otimo ou bom" —, e ela tinha dois defeitos
         de uma vez: prosa de interface fora do vocabulario, e uma barra de tres fatias
         descrita por uma. Quem nao ve a tela recebia um terco dela.
         ⚠ E E AQUI QUE `approvalParts.fair` GANHA CONSUMIDOR. A chave desenhada abaixo
         nomeia so os POLOS, por regra — o meio de uma rampa se ordena sozinho —, e a
         palavra do meio continua sendo necessaria para quem le por audio. */
      const described = /** @type {const} */ (["good", "fair", "poor"])
        .map(part => `${poll[part]}% ${UI.approvalParts[part]}`)
        .join(", ");

      return (
        `<div class="street__row reading">` +
        `<span class="street__who">${escapeHtml(segment.label)}</span>` +
        `<div class="meter" role="img" ` +
        `aria-label="${escapeHtml(`${segment.label}: ${described}`)}">` +
        /** @type {const} */ (["good", "fair", "poor"])
          .map(
            part =>
              `<span class="meter__part" data-part="${part}" style="flex-grow:${poll[part]}"></span>`,
          )
          .join("") +
        `</div>` +
        `<span class="reading__value" data-numeric>${poll.good}%</span>` +
        `</div>`
      );
    })
    .join("");

  /* ── A CHAVE DAS TRES CORES, e ela FALTAVA ────────────────────────────────
     ⚠ ESTE BLOCO DESENHAVA TRES CORES SEM CHAVE, que e o defeito exato que este
     projeto ja pagou uma vez: foi ele que criou `legendHtml` no arco da base, e
     quando o arco morreu a licao ficou escrita — "desenho de varias cores precisa
     de chave" — e a fita a herdou. O termometro da rua nunca a recebeu, e as duas
     pecas moram na MESMA coluna: uma decifrada, a outra nao.

     ⚠ E O CASO QUE CONDENA E O NUMERO AO LADO. A linha imprime UM valor — a fatia
     otimo/bom — ao lado de uma barra de TRES fatias. Sem chave, o jogador nao tem
     como saber se `27%` e a verde, a vermelha ou a soma; com chave, a posicao
     responde sozinha.

     ⚠ E O VOCABULARIO JA EXISTIA, SEM CONSUMIDOR NENHUM. `approvalParts` esta em
     `strings.mjs` com as tres palavras certas e nunca foi lido por lugar algum —
     `tokens` acusa token orfao e `orphans` acusa folha orfa, mas FRASE orfa nao tem
     guarda, e foi assim que a chave de um grafico ficou escrita e invisivel.

     ⚠ E A GRAMATICA E A DA FITA, e nao uma nova: DOIS POLOS, e nada no meio. A regra
     esta escrita em `ribbon.mjs` com estas palavras — "a chave de uma rampa nao e uma
     lista de itens: e o nome dos dois POLOS, e quem sabe onde ficam as pontas ordena o
     meio sozinho" —, e aqui as pontas sao literais: a barra vai de otimo a pessimo, da
     esquerda para a direita.

     ⚠ E A PRIMEIRA VERSAO TINHA TRES, E A MEDICAO A REPROVOU. Com "Regular" no meio a
     chave media 235px numa barra de 192 e VAZAVA 44px para dentro da coluna do numero —
     a ponta direita da regua caia embaixo do "24%" em vez de embaixo do fim da barra.
     Nao foi o desenho que decidiu: foi a regua nao caber, e a regra que ja existia
     apontar para o mesmo lado. A palavra do meio continua viva na descricao da barra,
     que e onde ela faz falta de verdade. */
  const key =
    `<div class="street__key reading">` +
    `<p class="street__poles">` +
    `<span>${escapeHtml(UI.approvalParts.good)}</span>` +
    `<span>${escapeHtml(UI.approvalParts.poor)}</span>` +
    `</p>` +
    `</div>`;

  return cardHtml({ body: `<div class="street">${rows}${key}</div>` });
}

/**
 * A CALDEIRA — os quatro grupos que conseguem derrubar um presidente.
 *
 * ⚠ ELA E UM CARTAO SEPARADO DA RUA, e a separacao e a modelagem: a Rua mede quem
 * APROVA o governo; esta mede quem consegue DERRUBA-LO. Sao perguntas diferentes, e
 * junta-las faria a segunda parecer um detalhe da primeira.
 *
 * ⚠ E NENHUM NUMERO E CALCULADO AQUI. A pressao, o ponto de fervura e as tres
 * rupturas vem de `boilerOf` prontos — a tela nao tem limiar proprio, senao ela
 * chamaria de fervendo o que o motor ainda trata como paciencia.
 *
 * @param {object} input
 * @param {{ lobbies: ReadonlyArray<{ id: string, label: string, wants: string,
 *   share: number, pressure: number, boiling: boolean, boil: number }>,
 *   rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 *   impeachment: number | null, fallen: number | null }} input.boiler
 * @returns {string}
 */
function boilerCardHtml({ boiler }) {
  const rows = boiler.lobbies
    .map(
      lobby =>
        `<div class="boiler__row reading"${lobby.boiling ? ' data-boiling="true"' : ""}>` +
        /* ── O NOME CARREGA A FATIA, e as duas cabem numa linha só ────────────────
           ⚠ A FRASE DE DESEJO OCUPAVA ESTA LINHA E NUNCA MUDAVA. "que a dívida pare de
           crescer" saía nos 48 meses do mandato, idêntica, embaixo de um nome que já
           dizia quem era — quatro linhas de cinza pequeno que ensinam uma vez e viram
           ruído em todos os meses seguintes. Pedido do responsável: "menos textos".

           ⚠ E O QUE ENTRA NO LUGAR NÃO É NADA — é o número que faltava. Uma auditoria
           externa leu a tela e disse a coisa certa: "a barra mostra se eles gostam de
           você; falta o número que mostra o estrago que podem fazer". Ele existia no
           catálogo desde o ciclo 10 e nunca tinha chegado aqui, e o caso extremo é o
           que condena o silêncio — **as forças de ordem têm peso ZERO**: elas podem
           ferver o mandato inteiro sem mover a ruptura econômica um milímetro, e a
           tela desenhava para elas a mesma régua que desenha para o mercado.

           A FATIA É DO CAPITAL, e a palavra é a mesma que a Trindade usa duas peças
           acima — é literalmente a barra dela que estes quatro repartem. Dois nomes
           para o mesmo limiar seriam o defeito que a guarda `vocabulary` existe para
           pegar. */
        `<span class="boiler__who">${escapeHtml(lobby.label)}` +
        `<small class="boiler__share">` +
        (lobby.share > 0
          ? `${percent(lobby.share)} ${escapeHtml(UI.cabinet.boilerShare)}`
          : escapeHtml(UI.cabinet.boilerNoShare)) +
        `</small></span>` +
        /* ⚠ O DESEJO VOLTA QUANDO ELE FERVE, e aí ele deixa de ser legenda e vira
           aviso. Enquanto o grupo está calmo, o que ele quer é curiosidade; no mês em
           que ele passa do ponto de fervura, é a única frase da tela que diz o que
           fazer a respeito. A mesma peça em dois papéis, e o motor decide qual. */
        (lobby.boiling ? `<span class="boiler__wants">${escapeHtml(lobby.wants)}</span>` : "") +
        /* ⚠ A BARRA VIROU REGUA em 16/08/2026, com a marca do PONTO DE FERVURA. Ela
           mostrava pressao de 0 a 100 e nao dizia onde e a linha — e "55" e "20" liam
           como duas barras curtas, quando o primeiro esta a cinco pontos de abandonar
           o governo. O limiar vem de `boilerOf`: a tela nao tem o proprio. */
        `<div class="gauge" role="img"${lobby.boiling ? ' data-past="true"' : ""} ` +
        `style="--index:${attr(Math.round(lobby.pressure))};--mark:${attr(lobby.boil)}" ` +
        `aria-label="${escapeHtml(`${lobby.label}: ${Math.round(lobby.pressure)} ${UI.cabinet.boilerMeter}`)}"></div>` +
        `<span class="boiler__value reading__value" data-numeric>${Math.round(lobby.pressure)}</span>` +
        `</div>`,
    )
    .join("");

  /* AS RUPTURAS ABERTAS, NOMEADAS. Um contador — "2 de 3" — diria o tamanho do perigo
     e esconderia a unica coisa acionavel: QUAL delas ainda segura o governo de pe. */
  const open = [
    boiler.rupture.social ? UI.cabinet.ruptureSocial : "",
    boiler.rupture.economic ? UI.cabinet.ruptureEconomic : "",
    boiler.rupture.political ? UI.cabinet.rupturePolitical : "",
  ].filter(Boolean);

  const foot =
    boiler.fallen !== null
      ? `<p class="boiler__siege"><b class="stamp">${escapeHtml(UI.cabinet.fallen)}</b> ` +
        `${escapeHtml(UI.cabinet.fallenNote)}</p>`
      : boiler.impeachment !== null
        ? `<p class="boiler__siege"><b class="stamp">${escapeHtml(UI.cabinet.siege)}</b> ` +
          `${escapeHtml(UI.cabinet.siegeNote)}</p>`
        : /* ⚠ E O SILÊNCIO É O ESTADO NORMAL, ENTÃO ELE NÃO IMPRIME LINHA. Até
             20/08/2026 esta frase dizia "nenhuma ruptura aberta" todo mês em que nada
             acontecia — que é a maioria dos meses de um governo que funciona. A regra
             contrária já estava escrita duas vezes neste projeto, e nos dois casos com
             a mesma razão: "uma legenda que lista 'em ruptura: 0' todo mês ensina o
             olho a ignorar a linha inteira — e aí, no mês em que a ruptura acontecer,
             ela aparece num lugar que o jogador já parou de ler".

             Pedido do responsável, na mesma sessão: "tire o máximo de texto inútil da
             tela". Uma linha que só diz que nada aconteceu é a definição disso. */
          open.length > 0
          ? `<p class="boiler__ruptures">${escapeHtml(UI.cabinet.rompeu)} ` +
            `<b>${open.map(escapeHtml).join(" · ")}</b></p>`
          : "";

  return cardHtml({ body: `<div class="boiler">${rows}</div>${foot}` });
}
