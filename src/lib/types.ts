export type Chain = "solana";

export interface TokenVolume {
  mint: string;
  symbol: string;
  chain: Chain;
  currentVolume: number;
  baselineVolume: number;
  spikeRatio: number;
  priceChange1h: number;
  priceUsd: number;
  dex: string;
  buyerBreadthPct: number;
  liquidityDeltaPct: number;
  refillRatio: number;
  dexDominancePct: number;
  baselineSamples: number;
  heuristicConfidence: number;
  heuristicSource: {
    baseline: "rolling_volume_history";
    breadth: "volume_share_proxy";
    liquidity: "price_response_proxy";
    refill: "rolling_volume_retention_proxy";
    concentration: "tracked_universe_volume_share";
  };
  lastUpdatedAt: number;
}

export interface BreakoutDiagnostics {
  score: number;
  components: {
    spike: number;
    breadth: number;
    liquidity: number;
    refill: number;
    concentrationPenalty: number;
    confidencePenalty: number;
  };
}

export interface SpikeSignal {
  id: string;
  mint: string;
  symbol: string;
  chain: Chain;
  spikeRatio: number;
  volumeUsd: number;
  priceChange1h: number;
  buyerBreadthPct: number;
  refillRatio: number;
  liquidityDeltaPct: number;
  breakoutScore: number;
  assessment: "organic_breakout" | "rotational_bid" | "spoofed_surge" | "exhaustion_risk";
  direction: "bullish" | "bearish" | "neutral";
  confidence: number;
  reasoning: string;
  entryNote: string;
  generatedAt: number;
}
