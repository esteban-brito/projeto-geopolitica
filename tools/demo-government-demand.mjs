import { writeFile } from "node:fs/promises";
import { demandScenarios, simulateDemand } from "../prototypes/government/demand.mjs";

const evidence = {
  date: "2026-09-30",
  scope: "Demanda sintética do protótipo; períodos abstratos, sem valores fiscais brasileiros.",
  assumptions: [
    "Doze períodos; lotes de trabalho em direitos humanos, sem decisão de ministro por denúncia individual.",
    "A fila usa ordem de chegada e ID; casos concluídos e recebimentos permanecem no histórico.",
    "Cada lote requer uma unidade de coordenação, uma de execução e uma de caixa do fundo do executor.",
    "O fundo de direitos abre com quatro unidades; verbas de outros fundos não são fungíveis neste recorte.",
    "Sobrecarga recebe dois lotes e duas unidades de caixa por período, com capacidade de uma entrega.",
    "Escassez e recuperação têm capacidade de duas entregas; recuperação recebe duas unidades por período a partir do nove.",
    "O cenário de drenagem recebe dois lotes até o período quatro e depois não tem novas entradas; nenhum caso é apagado.",
    "Recebimentos vêm de cenário externo identificado; não implementam tributação, dotação real ou crédito grátis no jogo.",
    "Recarga retoma no período seguinte e confronta entradas passadas com o histórico, sem reaplicar créditos.",
  ],
  scenarios: Object.fromEntries(
    Object.entries(demandScenarios()).map(([name, scenario]) => [
      name,
      { input: scenario, result: simulateDemand(scenario) },
    ]),
  ),
};
const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
const target = process.argv[2];
if (target) await writeFile(target, serialized, "utf8");
else process.stdout.write(serialized);
