import type { SpikeSignal } from "../lib/types.js";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const YELLOW = "\x1b[93m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";

function directionIcon(d: string): string {
  return d === "bullish" ? `${GREEN}▲${RESET}` : d === "bearish" ? `${RED}▼${RESET}` : "→";
}

export function printSignal(signal: SpikeSignal): void {
  const icon = directionIcon(signal.direction);
  const vol = `$${(signal.volumeUsd / 1_000).toFixed(0)}K`;
  const ratio = `${signal.spikeRatio.toFixed(1)}x`;
  const price = signal.priceChange1h > 0
    ? `${GREEN}+${signal.priceChange1h.toFixed(1)}%${RESET}`
    : `${RED}${signal.priceChange1h.toFixed(1)}%${RESET}`;

  console.log(`\n  ${icon} ${BOLD}${signal.symbol}${RESET}  ${YELLOW}${ratio} spike${RESET}  vol=${vol}  1h=${price}  conf=${signal.confidence.toFixed(2)}`);
  console.log(`     type: ${signal.assessment.replace(/_/g, " ")}`);
  console.log(`     ${signal.reasoning}`);
  console.log(`     ${DIM}→ ${signal.entryNote}${RESET}`);
}

export function printSurgeBoard(signals: SpikeSignal[]): void {
  const bar = "─".repeat(68);
  console.log(`\n${bar}`);
  console.log(`  ${BOLD}SURGE — VOLUME SPIKE SIGNALS${RESET}  (${signals.length} this cycle)`);
  console.log(bar);
  if (signals.length === 0) {
    console.log(`  ${DIM}no significant spikes detected${RESET}`);
  } else {
    for (const s of signals) printSignal(s);
  }
  console.log(`\n${bar}\n`);
}
