/* Servidor estatico de desenvolvimento.
   Existe porque modulos ES nao carregam por `file://` — o jogo publicado continua sendo
   arquivos estaticos servidos por qualquer coisa. */

import { networkInterfaces } from "node:os";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const PORT = Number(process.env["PORT"] ?? 5173);

const TYPES = /** @type {Record<string, string>} */ ({
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const relative = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
  const path = join(ROOT, relative === "" ? "index.html" : relative);

  /* Nenhuma requisicao sai da raiz do projeto, mesmo com `..` no caminho. */
  if (!path.startsWith(ROOT)) {
    res.writeHead(403).end("fora da raiz");
    return;
  }

  try {
    const body = await readFile(path);
    res.writeHead(200, {
      "content-type": TYPES[extname(path)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("nao encontrado");
  }
});

/* ⚠ SO A MAQUINA ALCANCA, por padrao. `HOST=0.0.0.0` abre para a rede local — e o unico jeito de
   o telefone dele abrir o jogo —, e nesse caso a saida imprime o endereco de cada placa. */
const HOST = process.env["HOST"] ?? "127.0.0.1";

server.listen(PORT, HOST, () => {
  process.stdout.write(`republica simulator em http://127.0.0.1:${PORT}/\n`);
  if (HOST !== "0.0.0.0") return;
  for (const [nome, placas] of Object.entries(networkInterfaces())) {
    for (const placa of placas ?? []) {
      if (placa.family === "IPv4" && !placa.internal) {
        process.stdout.write(`  na rede (${nome}): http://${placa.address}:${PORT}/\n`);
      }
    }
  }
});
