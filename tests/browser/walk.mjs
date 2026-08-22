/* O PASSEIO — a tela usada como se joga, num navegador de verdade.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELE EXISTE, e a resposta e uma lista de defeitos que nada mais pegou.
   `npm run screen` abre a pagina e mede o custo do material; ele nunca CLICA em
   nada, entao so ve a tela de abertura. Numa sessao a Mesa e as areas nasceram
   inteiras, com tipo verde, guarda verde e 99 provas verdes — e tres defeitos
   que so aparecem quando alguem usa:

     · o controle de alocacao abria no MEIO de uma faixa de 0 a 100. `max="25,04"`
       com virgula e valor invalido, e o navegador descarta o atributo calado.
       Node nao lê atributo, entao nenhuma prova de unidade podia ver;
     · a legenda das colunas se sobrepunha, porque cabecalho e linha mediam suas
       colunas em `ch` com fontes de tamanhos diferentes;
     · a Mesa previa o placar com a verba PROMETIDA enquanto o turno vota com a
       PAGA — e a divergencia so aparece no mes em que o caixa nao cobre.

   O QUE ELE NAO E: uma suite de unidade. Ele nao entra em `npm run validate`,
   pela mesma razao de `screen-cost.mjs` — sobe servidor, abre navegador e demora.
   E ele nao substitui prova nenhuma: o que ele acha vira prova em
   `tests/suites/screens.mjs`, que e onde o defeito fica preso.

   Rode com: npm run walk */

import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { ROOT } from "../lib/project.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";

const PORT = 5201;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(ROOT, "captures");

const server = spawn(process.execPath, [join(ROOT, "tools", "serve-static.mjs")], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: "ignore",
});

async function waitForServer(tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const response = await fetch(`${BASE}/index.html`);
      if (response.ok) return;
    } catch {
      /* ainda subindo */
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error("o servidor nao subiu");
}

let failures = 0;
/** @type {string[]} */
const report = [];

/** @param {boolean} condition @param {string} complaint */
function expect(condition, complaint) {
  if (condition) return;
  failures++;
  report.push(complaint);
}

try {
  await waitForServer();
  mkdirSync(OUT, { recursive: true });

  /* Sem cabeca aqui, e COM cabeca no `screen-cost`. A diferenca e o que cada um
     mede: aquele precisa de GPU de verdade para o fps significar alguma coisa;
     este so precisa de layout e de eventos, e os dois sao iguais nos dois modos. */
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  const page = await context.newPage();

  /** @type {string[]} */
  const noise = [];
  page.on("console", message => {
    if (message.type() === "error" || message.type() === "warning") noise.push(message.text());
  });
  page.on("pageerror", error => noise.push(String(error)));
  page.on("requestfailed", request => noise.push(`404/erro: ${request.url()}`));

  /** @param {string} where */
  async function checkOverflow(where) {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(!overflow, `[${where}] a tela rola na horizontal`);
  }

  /**
   * PECA DESENHADA POR CIMA DE PECA — e este e um defeito que so a geometria pega.
   *
   * ⚠ ELE EXISTE POR UM DEFEITO MEDIDO, e o que mais custa nele e o que NAO o
   * pegou. Os quatro cartoes do Gabinete se sobrepunham em todo aparelho de 720px
   * para baixo: a grade encolhia para uma coluna e a colocacao explicita dos tres
   * resumos continuava pedindo a coluna 2, o navegador criava uma coluna implicita
   * com a largura toda, e a Caixa de Entrada fechava em 0px por baixo dos outros.
   *
   * `checkOverflow` nao via nada, e nao via com razao: nada rolava de lado, porque
   * a sobreposicao acontece DENTRO do container. Tipo, guarda e 190 provas tambem
   * nao viam — nenhum deles lê layout. O que viu foi a captura, e o que a captura
   * ve uma vez, isto passa a ver toda vez.
   *
   * A TOLERANCIA E DE UM PIXEL de cada lado, e nao zero: cartoes vizinhos
   * compartilham a fronteira com larguras fracionarias, e exigir separacao exata
   * acusaria arredondamento de sub-pixel como defeito.
   *
   * @param {string} where
   * @param {string} selector as pecas que nao podem se cruzar
   */
  async function checkNoOverlap(where, selector) {
    const crossings = await page.$$eval(selector, nodes => {
      const boxes = nodes.map(node => {
        const box = node.getBoundingClientRect();
        return {
          name: (node.querySelector(".card__title")?.textContent ?? node.className)
            .trim()
            .slice(0, 24),
          left: box.left,
          top: box.top,
          right: box.right,
          bottom: box.bottom,
        };
      });

      const found = [];
      for (let a = 0; a < boxes.length; a++) {
        for (let b = a + 1; b < boxes.length; b++) {
          const one = boxes[a];
          const other = boxes[b];
          if (!one || !other) continue;
          const across = Math.min(one.right, other.right) - Math.max(one.left, other.left);
          const down = Math.min(one.bottom, other.bottom) - Math.max(one.top, other.top);
          if (across > 1 && down > 1) {
            found.push(`${one.name} × ${other.name} (${Math.round(across)}×${Math.round(down)}px)`);
          }
        }
      }
      return found;
    });

    expect(
      crossings.length === 0,
      `[${where}] pecas desenhadas uma por cima da outra: ${crossings.join(" | ")}`,
    );
  }

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await checkOverflow("gabinete");
  await checkNoOverlap("gabinete", ".cards > .card");

  /* 1 — O GABINETE E A TELA INICIAL, e ele nao decide nada. Quatro cartoes, e
     nenhum controle: a barra de cima carrega o unico gesto irreversivel. */
  /* CINCO desde 16/08, quando a CALDEIRA entrou. O numero e cobrado em vez de "maior
     que zero" de proposito: um cartao que some por erro de composicao nao quebra nada
     — a tela apenas fica com um assunto a menos, e o defeito atravessa tudo calado. */
  expect((await page.locator(".card").count()) === 5, "[gabinete] os cinco cartoes nao vieram");
  expect(
    (await page.locator("#main input, #main select").count()) === 0,
    "[gabinete] a tela inicial ofereceu um controle",
  );
  expect(
    (await page.locator(".vital").count()) === 4,
    "[barra] os quatro sinais vitais nao vieram",
  );
  await page.screenshot({ path: join(OUT, "walk-gabinete.png"), fullPage: true });

  /* 1b — E O CARTAO LEVA AO LUGAR DE DECIDIR. */
  await page.click('.card__action[data-section="congress"]');
  await page.waitForTimeout(600);
  await checkOverflow("congresso");
  expect(
    (await page.locator(".tally__forecast").count()) === 0,
    "[congresso] a mesa sem pauta mostrou placar",
  );

  /* 2 — UMA AREA, pelo rail. */
  await page.click('[data-section="health"]');
  await page.waitForTimeout(600);
  await checkOverflow("area");
  expect((await page.locator(".dial").count()) > 0, "[area] o orcamento veio sem programas");

  /* 3 — O ORCAMENTO GRANULAR. O controle de cada programa vai de 0 a 100 e
     ATRAVESSA o piso legal: o passeio arrasta um deles ate o fundo e confere que
     a linha muda de rito em vez de travar. Travar seria a interface inventando um
     limite que a Constituicao nao poe — ela poe PRECO. */
  const dial = page.locator(".dial__slider").first();
  await dial.focus();
  for (let step = 0; step < 100; step++) await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(200);

  expect(
    (await page.locator('.dial[data-rite="law"], .dial[data-rite="amendment"]').count()) > 0,
    "[area] furar o piso nao mudou o rito de nenhuma linha",
  );
  await page.screenshot({ path: join(OUT, "walk-area.png"), fullPage: true });

  /* 4 — E O ORCAMENTO VIRA PAUTA SOZINHO. Nao ha botao de "pautar": o que o
     jogador escreveu aqui ja e a proposta, e a Mesa mostra o placar dela. */
  await page.click('[data-section="congress"]');
  await page.waitForTimeout(600);
  expect(
    (await page.locator(".mesa__title").count()) === 1,
    "[mesa] o orcamento movido nao produziu pauta",
  );
  expect(
    (await page.locator(".tally__forecast").count()) === 1,
    "[mesa] a pauta nao trouxe placar",
  );

  /* 5 — A VERBA MOVE O PLACAR.
     A VERBA VAI PARA AS QUATRO BANCADAS, e nao para a primeira: a adesao e
     limitada em 1, entao uma bancada que ja entrega tudo o que tem nao entrega
     mais por dinheiro nenhum. Comprando so da primeira, a prova acusava a tela
     de nao reagir quando quem nao reagia era o modelo — e com razao, porque uma
     lei de piso de enfermagem ja tem a esquerda inteira. */
  const before = Number((await page.locator(".tally__forecast").innerText()).match(/\d+/)?.[0]);
  const sliders = page.locator(".bench__slider");
  const benches = await sliders.count();
  for (let index = 0; index < benches; index++) {
    await sliders.nth(index).focus();
    for (let step = 0; step < 4; step++) await page.keyboard.press("ArrowRight");
  }
  await page.waitForTimeout(150);
  const after = Number((await page.locator(".tally__forecast").innerText()).match(/\d+/)?.[0]);
  expect(after > before, `[mesa] comprar verba nao moveu o placar: ${before} → ${after}`);
  await page.screenshot({ path: join(OUT, "walk-mesa.png"), fullPage: true });

  /* 6 — ESTOURAR O CAIXA acende a linha de dinheiro. */
  for (let index = 0; index < 4; index++) {
    await sliders.nth(index).focus();
    for (let step = 0; step < 20; step++) await page.keyboard.press("ArrowRight");
  }
  await page.waitForTimeout(150);
  expect(
    (await page.locator('.tally__cash[data-fits="false"]').count()) === 1,
    "[mesa] a promessa estourou o caixa e a linha de dinheiro nao acusou",
  );
  await page.screenshot({ path: join(OUT, "walk-mesa-estourada.png"), fullPage: true });

  /* 7 — O MES ANDA, E ELE PRESTA CONTAS SEM INTERROMPER. O relatorio e painel da
     Mesa: ele aparece na tela junto do que o produziu, e nada precisa ser
     fechado para continuar. A prova de que ele NAO e modal e direta — o fundo
     segue clicavel, e o passeio confere isso avancando de novo em seguida. */

  /* ANTES DO PRIMEIRO MES o painel diz que esta esperando, e nao fica em branco:
     bloco vazio ao lado de controles que funcionam lê como defeito.

     ⚠ O SELETOR MUDOU EM 18/08/2026, e o passeio pegou a troca no mesmo dia. A
     espera tinha forma propria — `.report--waiting`, a terceira das quatro maneiras
     que o jogo tinha de dizer "nao ha nada aqui" — e passou a usar a peca de
     ausencia do resto do jogo, no peso discreto. O que se confere continua sendo o
     mesmo: que o painel ANUNCIA a espera em vez de ficar em branco. */
  expect(
    (await page.locator(".report.empty--quiet").count()) === 1,
    "[relatorio] antes do primeiro mes o painel nao anunciou a espera",
  );

  await page.click("#advance");
  await page.waitForTimeout(700);

  expect(
    (await page.locator("#noticeDialog[open]").count()) === 0,
    "[relatorio] o mes resolvido abriu um modal — ele tem de ser painel",
  );
  const verdict = await page.locator(".report__verdict").innerText();
  expect(
    /aprovada|rejeitada|decretada/i.test(verdict),
    `[relatorio] o veredito veio como "${verdict}"`,
  );
  /* ⚠ O NUMERO E COBRADO CONTRA O CATALOGO, e nao digitado. Ate 20/08/2026 esta linha
     dizia `=== 4`, escrita quando a Camara tinha quatro blocos abstratos — e ela ficou
     vermelha no dia em que eles viraram nove legendas. O que a prova quer garantir nunca
     foi "quatro": e que a tabela traga TODAS as bancadas, porque uma que sumisse por
     erro de composicao nao quebra nada — a tela apenas mostra um voto a menos, e o
     defeito atravessa tudo calado. Lido do catalogo, este numero nao envelhece de novo. */
  expect(
    (await page.locator(".report__table tbody tr").count()) === CATALOG.parties.length,
    `[relatorio] a tabela trouxe ${await page.locator(".report__table tbody tr").count()} bancadas e o catalogo tem ${CATALOG.parties.length}`,
  );
  await page.screenshot({ path: join(OUT, "walk-relatorio.png"), fullPage: true });

  /* 7b — O MES E REPETIVEL. Tres cliques seguidos sem nada entre eles: nenhum
     "entendi", nenhum dialogo. E o mes tem de andar TRES vezes — se o
     travamento de reentrada estivesse errado, ou ele engoliria cliques ou
     resolveria dois meses sobre o mesmo estado. */
  const beforeRun = await page.locator("#turn").innerText();
  for (let month = 0; month < 3; month++) {
    await page.click("#advance");
    await page.waitForTimeout(700);
  }
  const afterRun = await page.locator("#turn").innerText();
  expect(
    beforeRun !== afterRun,
    `[turno] tres cliques em "avancar" e o mes nao andou: ${beforeRun} → ${afterRun}`,
  );
  /* 7b-bis — A CARTA QUE PERGUNTA, e ela e a razao de este trecho existir.
     ⚠ ATE 16/08/2026 O PASSEIO NUNCA VIA UMA. Ele visitava o Gabinete no mes 1, onde
     a caixa so tem a carta de posse, e a peca central do ciclo 9 — o prazo, a tarja
     e as duas saidas — nao aparecia em captura nenhuma. Tela que nenhuma imagem pega
     e tela que so quebra depois, e este projeto ja pagou isso quatro vezes.

     A relatoria e o terceiro estagio de um texto, entao chegar ate ela custa meses:
     avancamos ate a pergunta existir, com teto para o passeio nao virar simulador. */
  for (let month = 0; month < 8; month++) {
    if ((await page.locator(".letter__choices").count()) > 0) break;

    /* ⚠ SEM PAGAR A BANCADA A MESA NUNCA PAUTA, e por isso este trecho compra antes
       de avancar. Nao e conveniencia de teste: e a mecanica. O texto que ninguem
       pauta morre na gaveta em seis meses sem nunca chegar ao relator, e um passeio
       que so aperta "avancar" jamais veria a relatoria acontecer. */
    /* ⚠ E O TEXTO PRECISA SER LEI, e nao remanejamento. Movimento DENTRO da faixa e
       execucao orcamentaria — a lei ja autorizou —, e ele nao tramita: nao vai a
       gaveta, nao vai ao relator, e nao produz pergunta nenhuma. O passeio tem de
       FURAR O PISO para que exista um texto no sentido do ciclo 4. */
    await page.click('[data-section="health"]');
    await page.waitForTimeout(400);
    const dials = page.locator(".dial__slider");
    const count = await dials.count();
    for (let index = 0; index < Math.min(count, 3); index++) {
      await dials.nth(index).focus();
      for (let step = 0; step < 30; step++) await page.keyboard.press("ArrowLeft");
    }

    await page.click('[data-section="congress"]');
    await page.waitForTimeout(400);
    const buy = page.locator(".bench__slider");
    const seats = await buy.count();
    for (let index = 0; index < seats; index++) {
      await buy.nth(index).focus();
      for (let step = 0; step < 10; step++) await page.keyboard.press("ArrowRight");
    }
    await page.click('[data-section="cabinet"]');
    await page.waitForTimeout(300);
    await page.click("#advance");
    await page.waitForTimeout(700);
  }

  const asking = await page.locator(".letter__choices").count();
  if (asking > 0) {
    /* A TARJA SO EXISTE ONDE HA PRAZO, e a prova disso e geometrica: a carta que
       pergunta tem `data-urgency`, e as outras nao tem nenhum. */
    expect(
      (await page.locator(".letter[data-urgency]").count()) > 0,
      "[caixa] a carta que pergunta saiu sem tarja de gravidade",
    );
    expect(
      (await page.locator(".letter__due").count()) > 0,
      "[caixa] a carta que pergunta saiu sem prazo legivel",
    );
    await checkOverflow("caixa com pergunta");
    await checkNoOverlap("caixa com pergunta", ".letter");
    await page.screenshot({ path: join(OUT, "walk-carta-pergunta.png"), fullPage: true });
  }

  await page.click('[data-section="health"]');
  await page.waitForTimeout(600);
  await checkOverflow("area depois do mes");

  /* O QUE FOI DECIDIDO ESTA NO PROPRIO CONTROLE, e nao numa lista de leis em
     vigor: a lista morreu junto com o catalogo de pautas, e a pergunta que ela
     respondia — o que ja esta valendo? — passou a ser o numero do slider. */
  expect((await page.locator(".dial").count()) > 0, "[area] o orcamento sumiu depois do mes");
  await page.screenshot({ path: join(OUT, "walk-area-depois.png"), fullPage: true });

  /* 7c — O PLACAR, e ele so tem sentido AQUI, depois de quatro meses terem
     acontecido: numa partida recem-aberta a serie esta vazia e o painel nao teria
     tendencia nenhuma para desenhar — que e o estado em que uma escada quebrada
     passa despercebida. */
  await page.click('[data-section="finance"]');
  await page.waitForTimeout(600);
  await checkOverflow("financas");

  expect(
    (await page.locator(".ledger__row").count()) > 12,
    "[financas] o painel abriu sem as linhas do placar",
  );

  /* A AUSENCIA DE CONTROLE E A INFORMACAO PRINCIPAL DA TELA, e ela e verificavel:
     nenhum controle e nenhum botao dentro do palco. Se um entrasse por reuso de
     componente, o jogador arrastaria algo que nao muda nada — e so descobriria
     depois. */
  expect(
    (await page.locator("#main input, #main button").count()) === 0,
    "[financas] o placar ofereceu algo para mexer",
  );

  /* E A LINHA SUBIU DE VERDADE. Com a regua errada — a do indice de area, de 0 a
     100 —, inflacao, juro e divida sobre PIB ficam colados no chao em toda partida, e a
     coluna inteira desenha o mesmo traco dizendo que nada nunca acontece. Basta UMA das
     series ter duas alturas diferentes para provar o contrario.

     ⚠ ELA PASSOU A LER GEOMETRIA em 21/08/2026, e nao texto. A escada de blocos morreu e
     virou polilinha de SVG — ver `sparkline` —, entao `allInnerTexts` devolve string
     vazia para todas: a prova ficaria PERMANENTEMENTE verde por vacuidade se o `.some`
     tivesse sido escrito ao contrario, e ficou permanentemente vermelha porque nao foi.
     Ler o `points` e a mesma pergunta feita ao desenho de verdade. */
  const lines = await page.locator(".ledger__spark polyline").evaluateAll(nodes =>
    nodes.map(node => {
      const points = node.getAttribute("points") ?? "";
      return new Set(points.split(" ").map(pair => pair.split(",")[1])).size;
    }),
  );
  expect(
    lines.some(heights => heights > 1),
    `[financas] nenhuma serie variou na linha: ${lines.join(" ")}`,
  );

  /* A CAPTURA ESPERA A TRANSICAO ACABAR. A troca de tela passa por View
     Transition, e uma foto tirada no meio dela pega as DUAS telas sobrepostas —
     a imagem sai com aparencia de defeito de renderizacao sem que haja defeito
     nenhum, e quem for olhar a captura amanha vai perseguir um fantasma. */
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, "walk-financas.png"), fullPage: true });

  /* 8 — A PARTIDA ATRAVESSA O NAVEGADOR. Recarregar a pagina tem de devolver o
     mesmo mes: o save existia e nao era chamado por ninguem, e o sintoma era o
     mandato inteiro desaparecendo ao fechar a aba. */
  const monthBefore = await page.locator("#turn").innerText();
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const monthAfter = await page.locator("#turn").innerText();
  expect(
    monthBefore === monthAfter,
    `[save] o mes era ${monthBefore} e voltou ${monthAfter} depois de recarregar`,
  );
  /* ⚠ E O INDICE DA BANDEJA NAO ROLA — nem para o lado, nem para baixo. As duas
     rolagens sairam em 21/08/2026 por caminhos diferentes, e as duas voltam por descuido:

       · a LATERAL era uma reticencia que nunca funcionava — `text-overflow: ellipsis`
         sem `min-width: 0` empurra em vez de cortar, e 11px de estouro bastavam;
       · a VERTICAL saiu quando a bandeja virou PILHA COM TETO, a pedido do responsavel.
         O teto e `TRAY_CAPACITY`, um numero medido contra a altura da linha — e numero
         medido a mao envelhece no dia em que alguem mexer no recuo da linha.

     Esta prova e o que impede o numero de envelhecer calado: mude a altura da linha e ela
     fica vermelha aqui, num navegador de verdade, com a bandeja cheia de verdade. */
  /* ⚠ ELA MORA DEPOIS DA RECARGA DE PROPOSITO, e nao na visita ao Gabinete la em cima:
     a retomada abre no Gabinete com o mandato ja andado, que e a bandeja mais CHEIA que o
     passeio produz — e pilha so estoura cheia. Medida no comeco, com uma carta na mesa,
     esta prova ficaria verde para sempre sem defender nada.

     ⚠ E ELA NAO NAVEGA. A primeira versao clicava no Gabinete aqui e a captura mostrou o
     preco: o clique acontecia ANTES da checagem de Financas, e a coluna de tendencia
     ficava sendo medida numa tela que nao a tem. O passeio inteiro ficou vermelho por uma
     linha de navegacao no lugar errado. */
  const tray = await page.evaluate(() => {
    const list = document.querySelector(".tray__list");
    if (!list) return null;
    return {
      x: list.scrollWidth - list.clientWidth,
      y: list.scrollHeight - list.clientHeight,
      rows: list.querySelectorAll(".tray__row").length,
    };
  });
  if (tray) {
    expect(tray.x <= 1, `[gabinete] o indice da bandeja rola ${tray.x}px para o lado`);
    expect(
      tray.y <= 1,
      `[gabinete] o indice rola ${tray.y}px para baixo com ${tray.rows} linhas — a pilha estourou`,
    );
  }

  /* A TELA RETOMADA ABRE NO GABINETE, e nao na area em que se estava: `screen` e
     memoria de sessao e nao entra no save. Entao o que se confere aqui sao os
     cartoes, que so existem quando a partida carregou de verdade. */
  expect((await page.locator(".card").count()) === 5, "[save] a tela retomada nao renderizou");

  /* E RECOMECAR PEDE DOIS CLIQUES. O primeiro so arma o botao — um clique
     distraido nao pode custar um mandato. */
  await page.click("#restart");
  await page.waitForTimeout(150);
  expect(
    (await page.locator("#turn").innerText()) === monthAfter,
    "[recomecar] o primeiro clique ja apagou a partida",
  );
  await page.click("#restart");
  await page.waitForTimeout(600);
  expect(
    (await page.locator("#turn").innerText()) !== monthAfter,
    "[recomecar] o segundo clique nao recomecou a partida",
  );

  /* ⚠ A PERNA DO CELULAR SAIU EM 20/08/2026, e ela NAO saiu para destravar nada.
     Este projeto tem uma regra dura sobre isso — "nao remova uma guarda ou uma prova
     para destravar; elas existem por defeito medido" —, e ela continua valendo. O que
     mudou aqui foi o ESCOPO, e a mudanca e do responsavel, com estas palavras: "pare de
     se importar se o jogo funciona no mobile, simplesmente nao importa, nunca vou jogar
     no mobile, so no desktop; eu quero a perfeicao no desktop, perfeicao mesmo".

     ⚠ E O DEFEITO QUE ELA PEGOU CONTINUA REGISTRADO, porque a licao dele nao e sobre
     telefone: os quatro cartoes do Gabinete se desenhavam uns por cima dos outros em
     todo aparelho de 720px para baixo, e a razao de ninguem ter visto era que a perna
     do celular estava organizada pelo que PARECIA arriscado — o placar denso, a mesa
     larga — e nao pelo que o jogador de fato ve primeiro. **A tela mais provavel de
     quebrar nao e a mais complexa; e a que ninguem conferiu.** Isso vale igual no
     desktop, e e por isso que `checkNoOverlap` ficou.

     O que saiu junto: as folhas de 640px e 720px, e os dois aparelhos de
     `screen-cost.mjs`. O bloco de 1180px FICA — aquilo e um notebook, e notebook e
     desktop. */

  expect(noise.length === 0, `console sujo: ${noise.join(" | ")}`);

  await browser.close();
} finally {
  server.kill();
}

for (const line of report) process.stdout.write(`  ${line}\n`);
process.stdout.write(failures > 0 ? `\n${failures} achado(s)\n` : "\npasseio verde\n");
process.exit(failures > 0 ? 1 : 0);
