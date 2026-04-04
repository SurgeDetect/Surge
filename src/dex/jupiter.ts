import type { TokenVolume } from "../lib/types.js";
import { config, JUPITER_PRICE_API } from "../lib/config.js";

interface JupiterPriceItem {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
}

// Top Solana tokens to watch for volume spikes
const WATCHED_MINTS = [
  "So11111111111111111111111111111111111111112",  // SOL
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", // JUP
  "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL", // JTO
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK
  "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", // WIF
  "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs", // ETH (wormhole)
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // mSOL
  "7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn", // JSOL
];

export async function fetchJupiterVolumes(): Promise<TokenVolume[]> {
  const ids = WATCHED_MINTS.join(",");
  const url = `${JUPITER_PRICE_API}?ids=${ids}&showExtraInfo=true`;

  const res = await fetch(url, {
    headers: config.JUPITER_API_KEY
      ? { Authorization: `Bearer ${config.JUPITER_API_KEY}` }
      : {},
  });
  if (!res.ok) throw new Error(`Jupiter price API ${res.status}`);
  const data = await res.json() as { data: Record<string, JupiterPriceItem & { extraInfo?: { lastSwappedPrice?: { lastJupiterSellPrice: number }; quotedSwapInfo?: { volumeUsd?: number } } }> };

  const volumes: TokenVolume[] = [];
  for (const [mint, item] of Object.entries(data.data ?? {})) {
    const volumeUsd = item.extraInfo?.quotedSwapInfo?.volumeUsd ?? 0;
    if (volumeUsd < config.MIN_VOLUME_USD) continue;

    volumes.push({
      mint,
      symbol: item.mintSymbol,
      chain: "solana",
      currentVolume: volumeUsd,
      baselineVolume: 0, // set by detection layer
      spikeRatio: 0,
      priceChange1h: 0,
      priceUsd: item.price,
      dex: "Jupiter",
      lastUpdatedAt: Date.now(),
    });
  }

  return volumes;
}
