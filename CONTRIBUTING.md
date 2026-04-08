# Contributing

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Before Opening Changes

- keep commits scoped to one surface at a time: scoring, prompts, board copy, or tests
- include `npm test` or explain why it could not run
- keep SVG edits GitHub-safe: no style blocks, no animate tags, and no text overflow

## Pull Request Notes

- describe what changed in the ranking logic
- include a sample cycle output when behavior changes
- update the README or runbook if the operator workflow changed
