# Surge

Breakout-pressure engine for Solana tokens.

Surge does not treat every volume spike as alpha. It scores whether a move can keep traveling by checking buyer breadth, liquidity migration, refill quality, and venue concentration before handing the setup to the agent loop.
It is deliberately biased toward setups that still have exitable depth after the first sweep.

[![Build](https://img.shields.io/github/actions/workflow/status/SurgeDetect/Surge/ci.yml?branch=master&style=flat-square&label=Build)](https://github.com/SurgeDetect/Surge/actions)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square)

## Breakout Board

![Surge breakout board](assets/preview-chart.svg)

## Terminal Ticket

![Surge terminal](assets/preview-signal.svg)

## Why Surge Exists

Most meme scanners fire on raw volume. That is the easy part. The useful distinction is whether the spike is broad enough and liquid enough to keep moving after the first burst.

Surge ranks each candidate with a continuation model:

`breakoutScore = 0.34 * spike + 0.24 * breadth + 0.22 * liquidity + 0.20 * refill - 0.18 * concentrationPenalty`

Signals are rejected when any of these fail:
- `buyerBreadthPct < MIN_BUYER_BREADTH_PCT`
- `liquidityDeltaPct < MIN_LIQUIDITY_DELTA_PCT`
- `refillRatio < MIN_REFILL_RATIO`
- `dexDominancePct > MAX_DEX_DOMINANCE_PCT`

## Technical Spec

### Inputs

- `spikeRatio`: current routed volume divided by the rolling baseline
- `buyerBreadthPct`: share of buying flow coming from many small and medium takers instead of one pocket
- `liquidityDeltaPct`: change in exitable top-of-book depth during the move
- `refillRatio`: how much of the consumed book refills after each sweep
- `dexDominancePct`: how concentrated the move is on a single venue

### Design Rationale

- High `spikeRatio` without breadth is usually a one-pocket move.
- Positive `liquidityDeltaPct` means the market is still willing to make the pair.
- Strong `refillRatio` reduces late-entry fragility.
- High `dexDominancePct` increases manipulation risk and lowers continuation odds.

### Signal Types

- `organic_breakout`: broad demand with healthy refill and growing depth
- `rotational_bid`: real inflow, but more sector rotation than full breakout participation
- `spoofed_surge`: concentrated or thin move that looks optically large
- `exhaustion_risk`: strong move, but refill quality is fading into the push

## Quick Start

```bash
git clone https://github.com/SurgeDetect/Surge
cd Surge
npm install
cp .env.example .env
npm run dev
```

## Configuration

```bash
ANTHROPIC_API_KEY=sk-ant-...
SPIKE_THRESHOLD=2.8
MIN_VOLUME_USD=80000
MIN_BUYER_BREADTH_PCT=24
MIN_LIQUIDITY_DELTA_PCT=6
MIN_REFILL_RATIO=0.55
MAX_DEX_DOMINANCE_PCT=82
SCAN_INTERVAL_MS=60000
```

## Local Audit Docs

- [Commit sequence](docs/commit-sequence.md)
- [Issue drafts](docs/issue-drafts.md)

## License

MIT
