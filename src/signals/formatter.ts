import type { SpikeSignal } from "../lib/types.js";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const YELLOW = "\x1b[93m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";

function directionIcon(direction: string): string {
  return direction === "bullish" ? `${GREEN}▲${RESET}` : direction === "bearish" ? `${RED}▼${RESET}` : "→";
}

export function printSignal(signal: SpikeSignal): void {
  const icon = directionIcon(signal.direction);
  const volume = `$${(signal.volumeUsd / 1_000).toFixed(0)}K`;
  const ratio = `${signal.spikeRatio.toFixed(1)}x`;
  const liquidity = `${signal.liquidityDeltaPct >= 0 ? "+" : ""}${signal.liquidityDeltaPct.toFixed(0)}%`;

  console.log(`\n  ${icon} ${BOLD}${signal.symbol}${RESET}  ${YELLOW}${ratio} surge${RESET}  score=${signal.breakoutScore.toFixed(2)}  vol=${volume}  conf=${signal.confidence.toFixed(2)}`);
  console.log(`     breadth=${signal.buyerBreadthPct.toFixed(0)}%  refill=${signal.refillRatio.toFixed(2)}  liq=${liquidity}`);
  console.log(`     type: ${signal.assessment.replace(/_/g, " ")}`);
  console.log(`     ${signal.reasoning}`);
  console.log(`     ${DIM}→ ${signal.entryNote}${RESET}`);
}

export function printSurgeBoard(signals: SpikeSignal[]): void {
  const bar = "─".repeat(76);
  console.log(`\n${bar}`);
  console.log(`  ${BOLD}SURGE -- BREAKOUT PRESSURE BOARD${RESET}  (${signals.length} this cycle)`);
  console.log(bar);
  if (signals.length === 0) {
    console.log(`  ${DIM}no continuation-grade surges detected${RESET}`);
  } else {
    for (const signal of signals) printSignal(signal);
  }
  console.log(`\n${bar}\n`);
}
