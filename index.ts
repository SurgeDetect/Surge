import { fetchJupiterVolumes } from "./src/dex/jupiter.js";
import { updateBaseline, computeSpikeRatios, detectSpikes, scoreBreakoutPressure } from "./src/detection/spike.js";
import { runSurgeAgent } from "./src/agent/loop.js";
import { printSurgeBoard } from "./src/signals/formatter.js";
import { config } from "./src/lib/config.js";
import { log } from "./src/lib/logger.js";

async function scan(): Promise<void> {
  log.info("Fetching Solana flow stats from Jupiter...");
  const raw = await fetchJupiterVolumes();

  updateBaseline(raw);
  const candidates = computeSpikeRatios(raw);
  const surges = detectSpikes(candidates);

  log.info(`${raw.length} tokens scanned | ${surges.length} continuation-grade surges above ${config.SPIKE_THRESHOLD}x`);

  if (surges.length === 0) {
    log.info("No breakout-pressure setups this cycle");
    return;
  }

  const leader = surges[0];
  log.info(`Lead candidate ${leader.symbol} score=${scoreBreakoutPressure(leader).score.toFixed(2)} breadth=${leader.buyerBreadthPct.toFixed(0)}% refill=${leader.refillRatio.toFixed(2)}`);

  const signals = await runSurgeAgent(surges);
  printSurgeBoard(signals);
}

async function main(): Promise<void> {
  log.info("Surge v0.2.0 -- Solana breakout-pressure engine starting");
  log.info(`Threshold=${config.SPIKE_THRESHOLD}x | breadth>=${config.MIN_BUYER_BREADTH_PCT}% | refill>=${config.MIN_REFILL_RATIO}`);

  await scan();
  setInterval(() => scan().catch((error) => log.error("Scan error:", error)), config.SCAN_INTERVAL_MS);
}

main().catch((error) => {
  log.error("Fatal:", error);
  process.exit(1);
});
