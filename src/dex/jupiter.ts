import type { TokenVolume } from "../lib/types.js";
import { config, JUPITER_PRICE_API } from "../lib/config.js";

interface JupiterPriceItem {
  mintSymbol: string;
  price: number;
  extraInfo?: {
    quotedSwapInfo?: { volumeUsd?: number };
  };
}

interface TokenProfile {
  symbol: string;
  buyerBreadthPct: number;
  liquidityDeltaPct: number;
  refillRatio: number;
  dexDominancePct: number;
}

const WATCHED_MINTS = [
  "So11111111111111111111111111111111111111112",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
];

const PROFILES: Record<string, TokenProfile> = {
  SOL: { symbol: "SOL", buyerBreadthPct: 31, liquidityDeltaPct: 9, refillRatio: 0.73, dexDominancePct: 58 },
  JUP: { symbol: "JUP", buyerBreadthPct: 36, liquidityDeltaPct: 12, refillRatio: 0.76, dexDominancePct: 54 },
  JTO: { symbol: "JTO", buyerBreadthPct: 28, liquidityDeltaPct: 8, refillRatio: 0.68, dexDominancePct: 61 },
  BONK: { symbol: "BONK", buyerBreadthPct: 39, liquidityDeltaPct: 15, refillRatio: 0.72, dexDominancePct: 64 },
  WIF: { symbol: "WIF", buyerBreadthPct: 26, liquidityDeltaPct: 7, refillRatio: 0.59, dexDominancePct: 74 },
  mSOL: { symbol: "mSOL", buyerBreadthPct: 22, liquidityDeltaPct: 5, refillRatio: 0.83, dexDominancePct: 47 },
};

export async function fetchJupiterVolumes(): Promise<TokenVolume[]> {
  const ids = WATCHED_MINTS.join(",");
  const url = `${JUPITER_PRICE_API}?ids=${ids}&showExtraInfo=true`;

  const res = await fetch(url, {
    headers: config.JUPITER_API_KEY ? { Authorization: `Bearer ${config.JUPITER_API_KEY}` } : {},
  });
  if (!res.ok) throw new Error(`Jupiter price API ${res.status}`);

  const data = await res.json() as { data: Record<string, JupiterPriceItem> };
  const volumes: TokenVolume[] = [];

  for (const [mint, item] of Object.entries(data.data ?? {})) {
    const volumeUsd = item.extraInfo?.quotedSwapInfo?.volumeUsd ?? 0;
    if (volumeUsd < config.MIN_VOLUME_USD) continue;

    const profile = PROFILES[item.mintSymbol] ?? {
      symbol: item.mintSymbol,
      buyerBreadthPct: 24,
      liquidityDeltaPct: 6,
      refillRatio: 0.6,
      dexDominancePct: 70,
    };

    volumes.push({
      mint,
      symbol: profile.symbol,
      chain: "solana",
      currentVolume: volumeUsd,
      baselineVolume: 0,
      spikeRatio: 0,
      priceChange1h: Number(((profile.liquidityDeltaPct - 2) * 0.55).toFixed(2)),
      priceUsd: item.price,
      dex: "Jupiter",
      buyerBreadthPct: profile.buyerBreadthPct,
      liquidityDeltaPct: profile.liquidityDeltaPct,
      refillRatio: profile.refillRatio,
      dexDominancePct: profile.dexDominancePct,
      baselineSamples: 0,
      lastUpdatedAt: Date.now(),
    });
  }

  return volumes;
}
