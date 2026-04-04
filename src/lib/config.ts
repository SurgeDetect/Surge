import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const schema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1),
  JUPITER_API_KEY: z.string().optional(),
  CLAUDE_MODEL: z.string().default("claude-sonnet-4-6"),
  SCAN_INTERVAL_MS: z.coerce.number().default(60_000),
  SPIKE_THRESHOLD: z.coerce.number().default(3.0),
  MIN_VOLUME_USD: z.coerce.number().default(50_000),
  BASELINE_WINDOW_HOURS: z.coerce.number().default(24),
  MAX_SIGNALS_PER_CYCLE: z.coerce.number().default(5),
  MIN_CONFIDENCE: z.coerce.number().default(0.65),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Config error:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
export const JUPITER_PRICE_API = "https://api.jup.ag/price/v2";
export const JUPITER_STATS_API = "https://stats.jup.ag/coingecko/pairs";
