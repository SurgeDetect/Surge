# Suggested Commit Sequence

1. `feat(config): add breakout pressure thresholds for breadth refill and dex concentration`
2. `feat(detection): score continuation quality instead of raw spike ratio alone`
3. `feat(feed): enrich Jupiter samples with breadth liquidity and refill diagnostics`
4. `feat(agent): classify surges as breakout rotation spoof or exhaustion`
5. `feat(console): print breakout score and refill quality in the signal board`
6. `test: cover continuation scoring and fragile-spike rejection`
7. `docs(readme): add technical spec for breakout pressure math`
8. `design(svg): add breakout board hero with flow components`
9. `design(svg): add terminal ticket preview for surge entries`
10. `chore(audit): add issue drafts and legitimacy notes`

Operational note: keep future commits tied to one scan surface at a time so the repo history reads naturally.
