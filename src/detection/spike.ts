import type { TokenVolume } from "../lib/types.js";
import { config } from "../lib/config.js";

// Rolling baseline store: mint → last N volume samples
const volumeHistory = new Map<string, number[]>();
const WINDOW_SIZE = config.BASELINE_WINDOW_HOURS;

export function updateBaseline(volumes: TokenVolume[]): void {
  for (const v of volumes) {
    const history = volumeHistory.get(v.mint) ?? [];
    history.push(v.currentVolume);
    if (history.length > WINDOW_SIZE) history.shift();
    volumeHistory.set(v.mint, history);
  }
}

export function computeSpikeRatios(volumes: TokenVolume[]): TokenVolume[] {
  return volumes.map((v) => {
    const history = volumeHistory.get(v.mint) ?? [];
    if (history.length < 3) return { ...v, baselineVolume: 0, spikeRatio: 1 };

    const baseline = history.slice(0, -1).reduce((a, b) => a + b, 0) / (history.length - 1);
    const ratio = baseline > 0 ? v.currentVolume / baseline : 1;

    return { ...v, baselineVolume: baseline, spikeRatio: ratio };
  });
}

export function detectSpikes(volumes: TokenVolume[]): TokenVolume[] {
  return volumes
    .filter((v) => v.spikeRatio >= config.SPIKE_THRESHOLD)
    .sort((a, b) => b.spikeRatio - a.spikeRatio);
}

export function getBaselineAge(mint: string): number {
  return volumeHistory.get(mint)?.length ?? 0;
}
