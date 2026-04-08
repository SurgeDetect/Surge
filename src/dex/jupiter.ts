import type { TokenVolume } from "../lib/types.js";
import { config, JUPITER_PRICE_API } from "../lib/config.js";

interface JupiterPriceItem {
  mintSymbol: string;
  price: number;
  extraInfo?: {
    quotedSwapInfo?: { volumeUsd?: number };
  };
}

const WATCHED_MINTS = [
  "So11111111111111111111111111111111111111112",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
];

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

    volumes.push({
      mint,
      symbol: item.mintSymbol || mint.slice(0, 6),
      chain: "solana",
      currentVolume: volumeUsd,
      baselineVolume: 0,
      spikeRatio: 0,
      priceChange1h: 0,
      priceUsd: item.price,
      dex: "Jupiter",
      buyerBreadthPct: 0,
      liquidityDeltaPct: 0,
      refillRatio: 0,
      dexDominancePct: 0,
      baselineSamples: 0,
      heuristicConfidence: 0.2,
      heuristicSource: {
        baseline: "rolling_volume_history",
        breadth: "volume_share_proxy",
        liquidity: "price_response_proxy",
        refill: "rolling_volume_retention_proxy",
        concentration: "tracked_universe_volume_share",
      },
      lastUpdatedAt: Date.now(),
    });
  }

  return volumes;
}
