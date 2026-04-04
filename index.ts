import { fetchJupiterVolumes } from "./src/dex/jupiter.js";
import { updateBaseline, computeSpikeRatios, detectSpikes } from "./src/detection/spike.js";
import { runSurgeAgent } from "./src/agent/loop.js";
import { printSurgeBoard } from "./src/signals/formatter.js";
import { config } from "./src/lib/config.js";
import { log } from "./src/lib/logger.js";

async function scan(): Promise<void> {
  log.info("Fetching volumes from Jupiter...");
  const raw = await fetchJupiterVolumes();

  updateBaseline(raw);
  const withRatios = computeSpikeRatios(raw);
  const spikes = detectSpikes(withRatios);

  log.info(`${raw.length} tokens · ${spikes.length} spikes above ${config.SPIKE_THRESHOLD}x threshold`);

  if (spikes.length === 0) {
    log.info("No spikes this cycle");
    return;
  }

  const signals = await runSurgeAgent(spikes);
  printSurgeBoard(signals);
}

async function main(): Promise<void> {
  log.info("Surge v0.1.0 — volume spike detector starting");
  log.info(`Spike threshold: ${config.SPIKE_THRESHOLD}x · Min volume: $${config.MIN_VOLUME_USD.toLocaleString()}`);

  await scan();
  setInterval(() => scan().catch((e) => log.error("Scan error:", e)), config.SCAN_INTERVAL_MS);
}

main().catch((e) => { log.error("Fatal:", e); process.exit(1); });
