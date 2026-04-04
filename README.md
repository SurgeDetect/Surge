<div align="center">

# Surge

**Volume spike detector for Solana tokens.**
Finds tokens with 3x+ abnormal DEX volume. Uses Claude to tell you if it's real buying pressure or just noise.

[![Build](https://img.shields.io/github/actions/workflow/status/SurgeDetect/Surge/ci.yml?branch=main&style=flat-square&label=Build)](https://github.com/SurgeDetect/Surge/actions)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
[![Built with Claude Agent SDK](https://img.shields.io/badge/Built%20with-Claude%20Agent%20SDK-cc7800?style=flat-square)](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square)](https://www.typescriptlang.org/)

</div>

---

Before every significant price move, there's a volume spike. The problem is that 90% of volume spikes are noise — wash trading, bots, one-off large orders with no follow-through.

`Surge` builds a 24-hour baseline for every token it tracks. When current volume exceeds that baseline by 3x or more, it fires. Claude then classifies the spike: organic buying, wash trading, coordinated pump, or unknown. Only organic spikes with price confirmation generate trade signals.

```
FETCH → BASELINE → DETECT → CLASSIFY → SIGNAL
```

---

## Volume Chart

![Surge Volume Chart](assets/preview-chart.svg)

---

## Spike Signal

![Surge Signal](assets/preview-signal.svg)

---

## Architecture

```
┌──────────────────────────────────────────┐
│         Jupiter Volume Feed               │
│   Real-time DEX volume per token pair    │
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│       Spike Detection Engine              │
│   Rolling 24h baseline per token        │
│   Flag tokens > SPIKE_THRESHOLD × avg   │
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│        Claude Surge Agent                 │
│  get_spike_list → get_token_spike_detail │
│  → emit_signal (organic/wash/pump)       │
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│          Signal Formatter                 │
│   Terminal output · ratio · entry note   │
└──────────────────────────────────────────┘
```

---

## Signal Types

| Type | Description | Action |
|------|-------------|--------|
| **organic** | Real buying, price confirms | Buy with stop |
| **coordinated_pump** | Sudden coordinated buy | Catch early or skip |
| **bot_wash** | High volume, price flat | Skip entirely |
| **unknown** | Insufficient data | Wait for more data |

---

## Quick Start

```bash
git clone https://github.com/SurgeDetect/Surge
cd Surge && bun install
cp .env.example .env
bun run dev
```

---

## Configuration

```bash
ANTHROPIC_API_KEY=sk-ant-...
SPIKE_THRESHOLD=3.0       # flag at 3x baseline volume
MIN_VOLUME_USD=50000      # minimum volume to track
BASELINE_WINDOW_HOURS=24  # rolling baseline window
MAX_SIGNALS_PER_CYCLE=5
SCAN_INTERVAL_MS=60000
```

---

## License

MIT

---

*find the spike. read the move.*
