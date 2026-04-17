import { fetchJupiterVolumes } from "./src/dex/jupiter.js";
import { updateBaseline, computeSpikeRatios, detectSpikes, scoreBreakoutPressure } from "./src/detection/spike.js";
import { runSurgeAgent } from "./src/agent/loop.js";
import { printSurgeBoard } from "./src/signals/formatter.js";
import { config } from "./src/lib/config.js";
import { log } from "./src/lib/logger.js";

async function scan(): Promise<void> {
  const startedAt = Date.now();

  try {
    log.info("Fetching Solana flow stats from Jupiter...");
    const raw = await fetchJupiterVolumes();
    if (raw.length === 0) {
      log.warn("No Jupiter flow data returned for this cycle");
      return;
    }

    updateBaseline(raw);
    const candidates = computeSpikeRatios(raw);
    const surges = detectSpikes(candidates);

    log.info(
      `${raw.length} tokens scanned | ${surges.length} continuation-grade surges above ${config.SPIKE_THRESHOLD}x`,
    );

    if (surges.length === 0) {
      log.info("No breakout-pressure setups this cycle");
      return;
    }

    const leader = surges[0];
    log.info(
      `Lead board candidate ${leader.symbol} score=${scoreBreakoutPressure(leader).score.toFixed(2)} breadth=${leader.buyerBreadthPct.toFixed(0)}% refill=${leader.refillRatio.toFixed(2)}`,
    );

    const signals = await runSurgeAgent(surges);
    if (signals.length === 0) {
      log.info("Agent returned no continuation signals for the current surge set");
      return;
    }

    printSurgeBoard(signals);
  } finally {
    const durationMs = Date.now() - startedAt;
    log.info("Surge scan complete", { durationMs });

    if (durationMs > config.SCAN_INTERVAL_MS) {
      log.warn("Surge scan exceeded configured interval", {
        durationMs,
        intervalMs: config.SCAN_INTERVAL_MS,
      });
    }
  }
}

async function main(): Promise<void> {
  log.info("Surge v0.2.0 -- Solana breakout-pressure engine starting");
  log.info(`Threshold=${config.SPIKE_THRESHOLD}x | breadth>=${config.MIN_BUYER_BREADTH_PCT}% | refill>=${config.MIN_REFILL_RATIO}`);

  const runLoop = async (): Promise<void> => {
    try {
      await scan();
    } catch (error) {
      log.error("Scan error:", error);
    } finally {
      setTimeout(() => {
        void runLoop();
      }, config.SCAN_INTERVAL_MS);
    }
  };

  await runLoop();
}

main().catch((error) => {
  log.error("Fatal:", error);
  process.exit(1);
});
