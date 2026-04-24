import type { BreakoutDiagnostics, TokenVolume } from "../lib/types.js";
import { config } from "../lib/config.js";

const volumeHistory = new Map<string, number[]>();
const priceHistory = new Map<string, number[]>();
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

    const prices = priceHistory.get(volume.mint) ?? [];
    prices.push(volume.priceUsd);
    if (prices.length > WINDOW_SIZE) prices.shift();
    priceHistory.set(volume.mint, prices);
  }
}

export function computeSpikeRatios(volumes: TokenVolume[]): TokenVolume[] {
  const totalCurrentVolume = volumes.reduce((sum, volume) => sum + volume.currentVolume, 0);

  return volumes.map((volume) => {
    const history = volumeHistory.get(volume.mint) ?? [];
    const prices = priceHistory.get(volume.mint) ?? [];

    if (history.length < 3) {
      return {
        ...volume,
        baselineVolume: 0,
        spikeRatio: 1,
        priceChange1h: 0,
        buyerBreadthPct: 0,
        liquidityDeltaPct: 0,
        refillRatio: 0,
        dexDominancePct: 0,
        baselineSamples: history.length,
        heuristicConfidence: 0.2,
      };
    }

    const baseline = average(history.slice(0, -1));
    const ratio = baseline > 0 ? volume.currentVolume / baseline : 1;
    const anchorPrice = average(prices.slice(0, -1));
    const priceChange1h = anchorPrice > 0 ? ((volume.priceUsd / anchorPrice) - 1) * 100 : 0;
    const volumeShare = totalCurrentVolume > 0 ? volume.currentVolume / totalCurrentVolume : 0;
    const breadthProxy = 0.55 * clamp((ratio - 1) / 4) + 0.45 * clamp(volumeShare / 0.3);
    const refillBase = history.length > 3 ? average(history.slice(-4, -1)) : baseline;
    const refillRatio = clamp(refillBase > 0 ? refillBase / Math.max(volume.currentVolume, 1) : 0, 0.2, 1);
    const liquidityProxy =
      0.6 * clamp((priceChange1h + 6) / 18) +
      0.4 * clamp((ratio - config.SPIKE_THRESHOLD + 1) / 3);
    const concentrationProxy = clamp(volumeShare / 0.35);
    const heuristicConfidence = clamp((history.length - 2) / Math.max(6, WINDOW_SIZE / 3), 0.2, 1);

    return {
      ...volume,
      baselineVolume: baseline,
      spikeRatio: ratio,
      priceChange1h: Number(priceChange1h.toFixed(2)),
      buyerBreadthPct: Math.round(16 + breadthProxy * 28),
      liquidityDeltaPct: Number((-4 + liquidityProxy * 20).toFixed(2)),
      refillRatio: Number(refillRatio.toFixed(2)),
      dexDominancePct: Math.round(46 + concentrationProxy * 36),
      baselineSamples: history.length,
      heuristicConfidence: Number(heuristicConfidence.toFixed(2)),
    };
  });
}

export function scoreBreakoutPressure(volume: TokenVolume): BreakoutDiagnostics {
  const spike = clamp((volume.spikeRatio - 1.8) / 3.6);
  const breadth = clamp(volume.buyerBreadthPct / 40);
  const liquidity = clamp((volume.liquidityDeltaPct + 5) / 20);
  const refill = clamp(volume.refillRatio);
  const concentrationPenalty = clamp((volume.dexDominancePct - 58) / 35);
  const confidencePenalty = clamp((0.7 - volume.heuristicConfidence) / 0.7);

  const score = clamp(
    0.34 * spike +
    0.24 * breadth +
    0.22 * liquidity +
    0.20 * refill -
    0.18 * concentrationPenalty -
    0.12 * confidencePenalty
  );

  return {
    score,
    components: {
      spike,
      breadth,
      liquidity,
      refill,
      concentrationPenalty,
      confidencePenalty,
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
    .sort((left, right) => scoreBreakoutPressure(right).score - scoreBreakoutPressure(left).score)
    .slice(0, config.MAX_SIGNALS_PER_CYCLE);
}

export function getBaselineAge(mint: string): number {
  return volumeHistory.get(mint)?.length ?? 0;
}
