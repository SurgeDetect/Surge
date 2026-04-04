export type Chain = "solana" | "base" | "arbitrum";

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
  lastUpdatedAt: number;
}

export interface SpikeSignal {
  id: string;
  mint: string;
  symbol: string;
  chain: Chain;
  spikeRatio: number;
  volumeUsd: number;
  priceChange1h: number;
  assessment: "organic" | "bot_wash" | "coordinated_pump" | "unknown";
  direction: "bullish" | "bearish" | "neutral";
  confidence: number;
  reasoning: string;
  entryNote: string;
  generatedAt: number;
}
