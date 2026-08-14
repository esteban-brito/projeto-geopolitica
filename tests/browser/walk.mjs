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

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await checkOverflow("mesa vazia");

  /* 1 — A MESA VAZIA nao anuncia placar nenhum. */
  expect(
    (await page.locator(".tally__forecast").count()) === 0,
    "[mesa vazia] a mesa sem pauta mostrou placar",
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
  await page.click('[data-section="mesa"]');
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
     bloco vazio ao lado de controles que funcionam lê como defeito. */
  expect(
    (await page.locator(".report--waiting").count()) === 1,
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
  expect(
    (await page.locator(".report__table tbody tr").count()) === 4,
    "[relatorio] a tabela nao trouxe as quatro bancadas",
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

  /* E A ESCADA SUBIU DE VERDADE. Com a regua errada — a do indice de area, de 0 a
     100 —, inflacao, juro e divida sobre PIB ficam no degrau do chao em toda
     partida, e a coluna inteira desenha a mesma barra dizendo que nada nunca
     acontece. Aqui basta um degrau diferente do outro para provar o contrario. */
  const steps = await page.locator(".ledger__spark").allInnerTexts();
  expect(
    steps.some(spark => new Set(spark.trim()).size > 1),
    `[financas] nenhuma serie variou na escada: ${steps.filter(Boolean).join(" ")}`,
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
  /* A TELA RETOMADA ABRE NA MESA, e nao na area em que se estava: `screen` e
     memoria de sessao e nao entra no save. Entao o que se confere aqui e a faixa
     de indices, que so existe quando a partida carregou de verdade. */
  expect((await page.locator(".gauge").count()) > 0, "[save] a tela retomada nao renderizou");

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

  /* 9 — O CELULAR, com a mesma sequencia ja no estado avancado. */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await checkOverflow("celular · area");
  /* O PLACAR E A TELA MAIS LARGA DO JOGO — quatro colunas de numero —, e por isso
     ele e o candidato mais provavel a empurrar a pagina de lado num aparelho de
     390px. */
  await page.click('[data-section="finance"]');
  await page.waitForTimeout(600);
  await checkOverflow("celular · financas");
  await page.click('[data-section="mesa"]');
  await page.waitForTimeout(600);
  await checkOverflow("celular · mesa");
  await page.screenshot({ path: join(OUT, "walk-celular.png"), fullPage: true });

  expect(noise.length === 0, `console sujo: ${noise.join(" | ")}`);

  await browser.close();
} finally {
  server.kill();
}

for (const line of report) process.stdout.write(`  ${line}\n`);
process.stdout.write(failures > 0 ? `\n${failures} achado(s)\n` : "\npasseio verde\n");
process.exit(failures > 0 ? 1 : 0);
