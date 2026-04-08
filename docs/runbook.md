# Surge Runbook

## What Surge Is For

Surge is used to separate real breakout continuation from optical volume. The scan is only useful when the move still looks broad and exitable after the first sweep.

## Daily Operator Loop

1. Run `npm run dev`.
2. Read the breakout board for the top candidate.
3. Confirm breadth, liquidity delta, and refill quality are all aligned.
4. Escalate only the names that still look liquid after the initial impulse.

## What Gets Promoted

- broad buyer participation
- positive depth migration
- refill quality that stays above the floor

## What Gets Demoted

- one-wallet spikes
- one-venue squeezes
- moves that consume depth faster than it refills
