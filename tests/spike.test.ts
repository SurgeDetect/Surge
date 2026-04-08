import { describe, expect, it } from "vitest";
import { computeSpikeRatios, scoreBreakoutPressure, detectSpikes, updateBaseline } from "../src/detection/spike.js";
import type { TokenVolume } from "../src/lib/types.js";

function makeVolume(overrides: Partial<TokenVolume> = {}): TokenVolume {
  return {
    mint: "mint-1",
    symbol: "BONK",
    chain: "solana",
    currentVolume: 100_000,
    baselineVolume: 0,
    spikeRatio: 1,
    priceChange1h: 6,
    priceUsd: 0.00002,
    dex: "Jupiter",
    buyerBreadthPct: 34,
    liquidityDeltaPct: 10,
    refillRatio: 0.71,
    dexDominancePct: 60,
    baselineSamples: 0,
    lastUpdatedAt: Date.now(),
    ...overrides,
  };
}

describe("computeSpikeRatios", () => {
  it("returns baseline sample count and computes ratio after enough history", () => {
    const volume = makeVolume();
    updateBaseline([{ ...volume, currentVolume: 20_000 }]);
    updateBaseline([{ ...volume, currentVolume: 25_000 }]);
    updateBaseline([{ ...volume, currentVolume: 90_000 }]);

    const [scored] = computeSpikeRatios([makeVolume({ currentVolume: 90_000 })]);
    expect(scored.baselineSamples).toBe(3);
    expect(scored.spikeRatio).toBeGreaterThan(3);
  });
});

describe("scoreBreakoutPressure", () => {
  it("rewards broad participation and refill quality", () => {
    const strong = scoreBreakoutPressure(makeVolume({ spikeRatio: 4.5, buyerBreadthPct: 38, refillRatio: 0.82, liquidityDeltaPct: 14 }));
    const weak = scoreBreakoutPressure(makeVolume({ spikeRatio: 4.5, buyerBreadthPct: 18, refillRatio: 0.33, liquidityDeltaPct: 2, dexDominancePct: 90 }));
    expect(strong.score).toBeGreaterThan(weak.score);
  });
});

describe("detectSpikes", () => {
  it("filters out concentrated or fragile surges", () => {
    const valid = makeVolume({ symbol: "JUP", spikeRatio: 3.4 });
    const concentrated = makeVolume({ symbol: "WIF", mint: "mint-2", spikeRatio: 4.2, dexDominancePct: 91 });
    const thin = makeVolume({ symbol: "JTO", mint: "mint-3", spikeRatio: 4.4, refillRatio: 0.41 });
    const results = detectSpikes([valid, concentrated, thin]);
    expect(results).toHaveLength(1);
    expect(results[0]?.symbol).toBe("JUP");
  });
});
