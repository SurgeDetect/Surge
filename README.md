<div align="center">

# Surge

<img src="assets/surge-avatar.png" alt="Surge avatar" width="128" />

**Robinhood crypto breakout-quality filter.**
Surge ranks breakouts by participation, quoted-depth growth, refill quality, and order dispersion so optical spikes die before they reach the board.

[Website](https://surgedetect.com/) · [Launch venue](https://pons.family/)

[![Build](https://img.shields.io/github/actions/workflow/status/SurgeDetect/Surge/ci.yml?branch=master&style=flat-square&label=Build)](https://github.com/SurgeDetect/Surge/actions)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square)

</div>

---

Most spikes disappear before the candle closes. Surge filters Robinhood crypto breakouts through four quality checks and ranks only the moves that still have room to continue.

`INGEST -> DETECT -> DECOMPOSE -> SCORE -> FILTER -> RANK`

## September 4 Market Board

Snapshot: September 4, 2026 · 12:27 UTC

| Asset | Price | 24h move | Surge score | Participation | Decision |
|-------|------:|---------:|------------:|---------------|----------|
| LINK | $12.02 | +6.56% | 86 | broad | PROMOTE |
| XRP | $1.45 | +5.84% | 78 | broad | WATCH |
| DOGE | $0.08768 | +5.46% | 73 | steady | WATCH |
| ETH | $2,521.04 | +4.75% | 62 | mixed | SCAN |
| BTC | $81,172 | +4.16% | 55 | mixed | WATCH |

The snapshot is fixed to the timestamp above. Surge does not label stored market data as live.

## At A Glance

- `Use case` — separate durable Robinhood crypto breakouts from short-lived spikes
- `Primary inputs` — participation acceleration, quoted-depth growth, refill quality, and order dispersion
- `Primary failure mode` — promoting a dramatic candle with weak participation underneath it
- `Output` — PROMOTE, WATCH, SCAN, or REJECT with a component score

## Four Rules

### Real Participation

A price spike without broad participation fails early. Surge rewards moves supported by expanding activity across the tracked interval.

### Depth Awareness

Volume does not matter when the available book disappears. The score discounts moves whose quoted depth weakens into the breakout.

### Independent Confirmation

A strong move needs more than one supportive component. Surge checks price response, participation, refill behavior, and dispersion together.

### Quiet Output

Most detected spikes never reach PROMOTE. The filter exists to remove noise, not to fill the board.

## Scoring Model

Surge weights four positive components and one concentration penalty:

```text
score = participation + depth growth + refill quality + order dispersion - concentration penalty
```

No single component decides the result. A large move with poor depth or narrow participation remains a weak setup.

## Decision Gates

A candidate survives only when:

1. participation clears the minimum quality floor
2. quoted depth grows with the move instead of shrinking
3. refill quality holds after the first burst
4. order flow stays sufficiently dispersed

The board records the failed gate for every rejected candidate.

## Example Output

```text
SURGE // BREAKOUT QUALITY TICKET

asset             LINK
price             $12.02
24h move          +6.56%
surge score       86
participation     broad
depth growth      strong
refill quality    strong
decision          PROMOTE

reason: participation and quoted depth expanded together while refill stayed healthy
```

## Operating Loop

1. pull the supported Robinhood crypto snapshot
2. compare the latest interval with the rolling baseline
3. decompose the move into the four score components
4. apply the rejection gates
5. rank the survivors by composite quality
6. alert only when the decision changes materially

## Risk Controls

- `participation floor` — removes narrow spikes
- `depth gate` — blocks moves that consume available liquidity
- `refill gate` — rejects breakouts whose book does not recover
- `dispersion check` — penalizes concentrated activity
- `alert discipline` — suppresses repeated updates that add no new information

## Quick Start

```bash
git clone https://github.com/SurgeDetect/Surge
cd Surge
npm install
cp .env.example .env
npm run dev
```

## Support Docs

- [Runbook](docs/runbook.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## License

MIT

---

*a spike that fails the quality gates never becomes a breakout.*
