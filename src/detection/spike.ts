import type { BreakoutDiagnostics, TokenVolume } from "../lib/types.js";
import { config } from "../lib/config.js";

const volumeHistory = new Map<string, number[]>();
const WINDOW_SIZE = config.BASELINE_WINDOW_HOURS;

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function updateBaseline(volumes: TokenVolume[]): void {
  for (const volume of volumes) {
    const history = volumeHistory.get(volume.mint) ?? [];
    history.push(volume.currentVolume);
    if (history.length > WINDOW_SIZE) history.shift();
    volumeHistory.set(volume.mint, history);
  }
}

export function computeSpikeRatios(volumes: TokenVolume[]): TokenVolume[] {
  return volumes.map((volume) => {
    const history = volumeHistory.get(volume.mint) ?? [];
    if (history.length < 3) {
      return { ...volume, baselineVolume: 0, spikeRatio: 1, baselineSamples: history.length };
    }

    const baseline = average(history.slice(0, -1));
    const ratio = baseline > 0 ? volume.currentVolume / baseline : 1;

    return {
      ...volume,
      baselineVolume: baseline,
      spikeRatio: ratio,
      baselineSamples: history.length,
    };
  });
}

export function scoreBreakoutPressure(volume: TokenVolume): BreakoutDiagnostics {
  const spike = clamp((volume.spikeRatio - 1.8) / 3.6);
  const breadth = clamp(volume.buyerBreadthPct / 40);
  const liquidity = clamp((volume.liquidityDeltaPct + 5) / 20);
  const refill = clamp(volume.refillRatio);
  const concentrationPenalty = clamp((volume.dexDominancePct - 58) / 35);

  const score = clamp(
    0.34 * spike +
    0.24 * breadth +
    0.22 * liquidity +
    0.20 * refill -
    0.18 * concentrationPenalty
  );

  return {
    score,
    components: {
      spike,
      breadth,
      liquidity,
      refill,
      concentrationPenalty,
    },
  };
}

export function detectSpikes(volumes: TokenVolume[]): TokenVolume[] {
  return volumes
    .filter((volume) => volume.spikeRatio >= config.SPIKE_THRESHOLD)
    .filter((volume) => volume.buyerBreadthPct >= config.MIN_BUYER_BREADTH_PCT)
    .filter((volume) => volume.liquidityDeltaPct >= config.MIN_LIQUIDITY_DELTA_PCT)
    .filter((volume) => volume.refillRatio >= config.MIN_REFILL_RATIO)
    .filter((volume) => volume.dexDominancePct <= config.MAX_DEX_DOMINANCE_PCT)
    .sort((left, right) => scoreBreakoutPressure(right).score - scoreBreakoutPressure(left).score);
}

export function getBaselineAge(mint: string): number {
  return volumeHistory.get(mint)?.length ?? 0;
}
