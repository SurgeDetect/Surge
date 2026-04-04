import Anthropic from "@anthropic-ai/sdk";
import type { TokenVolume, SpikeSignal } from "../lib/types.js";
import { SURGE_SYSTEM } from "./prompts.js";
import { config } from "../lib/config.js";
import { log } from "../lib/logger.js";
import crypto from "crypto";

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: "get_spike_list",
    description: "Get all tokens with volume spikes this cycle, sorted by spike ratio",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "get_token_spike_detail",
    description: "Get detailed spike data for a specific token symbol",
    input_schema: {
      type: "object" as const,
      properties: { symbol: { type: "string" } },
      required: ["symbol"],
    },
  },
  {
    name: "emit_signal",
    description: "Emit a volume spike signal for a token",
    input_schema: {
      type: "object" as const,
      properties: {
        symbol: { type: "string" },
        assessment: { type: "string", enum: ["organic", "bot_wash", "coordinated_pump", "unknown"] },
        direction: { type: "string", enum: ["bullish", "bearish", "neutral"] },
        confidence: { type: "number" },
        reasoning: { type: "string" },
        entry_note: { type: "string" },
      },
      required: ["symbol", "assessment", "direction", "confidence", "reasoning", "entry_note"],
    },
  },
];

export async function runSurgeAgent(spikes: TokenVolume[]): Promise<SpikeSignal[]> {
  const signals: SpikeSignal[] = [];
  const bySymbol = new Map(spikes.map((s) => [s.symbol.toUpperCase(), s]));

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `${spikes.length} volume spikes detected this cycle. Analyze and emit signals for actionable opportunities.`,
    },
  ];

  for (let turn = 0; turn < 10; turn++) {
    const response = await client.messages.create({
      model: config.CLAUDE_MODEL,
      max_tokens: 3000,
      system: SURGE_SYSTEM,
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });
    if (response.stop_reason !== "tool_use") break;

    const results: Anthropic.ToolResultBlockParam[] = [];

    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      const input = block.input as Record<string, unknown>;
      let result = "";

      if (block.name === "get_spike_list") {
        result = JSON.stringify(
          spikes.map((s) => ({
            symbol: s.symbol,
            chain: s.chain,
            spikeRatio: s.spikeRatio.toFixed(1) + "x",
            volumeUsd: `$${(s.currentVolume / 1_000).toFixed(0)}K`,
            baseline: `$${(s.baselineVolume / 1_000).toFixed(0)}K`,
            priceChange1h: s.priceChange1h.toFixed(2) + "%",
          }))
        );
      } else if (block.name === "get_token_spike_detail") {
        const token = bySymbol.get((input.symbol as string).toUpperCase());
        result = token ? JSON.stringify(token) : "not found in spike list";
      } else if (block.name === "emit_signal") {
        const token = bySymbol.get((input.symbol as string).toUpperCase());
        if (!token) { result = "token not found"; continue; }
        if ((input.confidence as number) < config.MIN_CONFIDENCE) {
          result = JSON.stringify({ accepted: false, reason: "below min confidence" });
          continue;
        }
        if (signals.length >= config.MAX_SIGNALS_PER_CYCLE) {
          result = JSON.stringify({ accepted: false, reason: "max signals reached" });
          continue;
        }
        const signal: SpikeSignal = {
          id: crypto.randomUUID(),
          mint: token.mint,
          symbol: token.symbol,
          chain: token.chain,
          spikeRatio: token.spikeRatio,
          volumeUsd: token.currentVolume,
          priceChange1h: token.priceChange1h,
          assessment: input.assessment as SpikeSignal["assessment"],
          direction: input.direction as SpikeSignal["direction"],
          confidence: input.confidence as number,
          reasoning: input.reasoning as string,
          entryNote: input.entry_note as string,
          generatedAt: Date.now(),
        };
        signals.push(signal);
        log.info(`Signal: ${signal.symbol} ${signal.spikeRatio.toFixed(1)}x ${signal.assessment} conf=${signal.confidence}`);
        result = JSON.stringify({ accepted: true, id: signal.id });
      }

      results.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }

    messages.push({ role: "user", content: results });
  }

  return signals;
}
