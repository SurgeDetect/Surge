import Anthropic from "@anthropic-ai/sdk";
import type { TokenVolume, SpikeSignal } from "../lib/types.js";
import { SURGE_SYSTEM } from "./prompts.js";
import { config } from "../lib/config.js";
import { log } from "../lib/logger.js";
import { scoreBreakoutPressure } from "../detection/spike.js";
import crypto from "crypto";

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: "get_spike_list",
    description: "Get all breakout-pressure candidates this cycle, sorted by breakout score",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "get_token_spike_detail",
    description: "Get detailed diagnostics for a specific token symbol",
    input_schema: {
      type: "object" as const,
      properties: { symbol: { type: "string" } },
      required: ["symbol"],
    },
  },
  {
    name: "emit_signal",
    description: "Emit a breakout-pressure signal for a token",
    input_schema: {
      type: "object" as const,
      properties: {
        symbol: { type: "string" },
        assessment: { type: "string", enum: ["organic_breakout", "rotational_bid", "spoofed_surge", "exhaustion_risk"] },
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
  const ranked = [...spikes].sort((left, right) => scoreBreakoutPressure(right).score - scoreBreakoutPressure(left).score);
  const bySymbol = new Map(ranked.map((candidate) => [candidate.symbol.toUpperCase(), candidate]));

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `${ranked.length} breakout-pressure candidates detected this cycle. Focus on sustainable continuation, not generic volume spikes.`,
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
          ranked.map((candidate) => {
            const diagnostics = scoreBreakoutPressure(candidate);
            return {
              symbol: candidate.symbol,
              breakoutScore: diagnostics.score.toFixed(2),
              spikeRatio: candidate.spikeRatio.toFixed(1) + "x",
              volumeUsd: `$${(candidate.currentVolume / 1_000).toFixed(0)}K`,
              breadth: candidate.buyerBreadthPct.toFixed(0) + "%",
              liquidityDelta: `${candidate.liquidityDeltaPct >= 0 ? "+" : ""}${candidate.liquidityDeltaPct.toFixed(0)}%`,
              refill: candidate.refillRatio.toFixed(2),
              dexDominance: candidate.dexDominancePct.toFixed(0) + "%",
            };
          })
        );
      } else if (block.name === "get_token_spike_detail") {
        const candidate = bySymbol.get((input.symbol as string).toUpperCase());
        result = candidate
          ? JSON.stringify({ ...candidate, diagnostics: scoreBreakoutPressure(candidate) })
          : "not found in candidate list";
      } else if (block.name === "emit_signal") {
        const candidate = bySymbol.get((input.symbol as string).toUpperCase());
        if (!candidate) {
          result = "token not found";
          continue;
        }
        if ((input.confidence as number) < config.MIN_CONFIDENCE) {
          result = JSON.stringify({ accepted: false, reason: "below min confidence" });
          continue;
        }
        if (signals.length >= config.MAX_SIGNALS_PER_CYCLE) {
          result = JSON.stringify({ accepted: false, reason: "max signals reached" });
          continue;
        }
        const breakoutScore = scoreBreakoutPressure(candidate).score;
        const signal: SpikeSignal = {
          id: crypto.randomUUID(),
          mint: candidate.mint,
          symbol: candidate.symbol,
          chain: candidate.chain,
          spikeRatio: candidate.spikeRatio,
          volumeUsd: candidate.currentVolume,
          priceChange1h: candidate.priceChange1h,
          buyerBreadthPct: candidate.buyerBreadthPct,
          refillRatio: candidate.refillRatio,
          liquidityDeltaPct: candidate.liquidityDeltaPct,
          breakoutScore,
          assessment: input.assessment as SpikeSignal["assessment"],
          direction: input.direction as SpikeSignal["direction"],
          confidence: input.confidence as number,
          reasoning: input.reasoning as string,
          entryNote: input.entry_note as string,
          generatedAt: Date.now(),
        };
        signals.push(signal);
        log.info(`Signal: ${signal.symbol} breakout=${signal.breakoutScore.toFixed(2)} conf=${signal.confidence.toFixed(2)}`);
        result = JSON.stringify({ accepted: true, id: signal.id });
      }

      results.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }

    messages.push({ role: "user", content: results });
  }

  return signals;
}
