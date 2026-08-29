import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("keeps Surge's approved Solana launch copy", () => {
  assert.match(app, /Most spikes/);
  assert.match(app, /die before the candle prints\./);
  assert.match(app, /Surge filters every breakout on Solana/);
  assert.match(app, /Surge launches on Pump\.fun\./);
  assert.match(app, /every minute, every supported token/);
});

test("exposes the Surge launch controls without dead links", () => {
  assert.match(html, /<title>Surge<\/title>/);
  assert.match(app, /const GITHUB_URL = "https:\/\/github\.com\/SurgeDetect\/Surge"/);
  assert.match(app, /const X_URL = "https:\/\/x\.com\/SurgeOnSOLL"/);
  assert.doesNotMatch(app, /https:\/\/x\.com\/SurgeDetect/);
  assert.match(app, /const PUMPFUN_URL = "https:\/\/pump\.fun\/"/);
  assert.match(app, /const GitHubMark/);
  assert.match(app, /const XMark/);
  assert.match(app, /data-testid="contract-status"/);
  assert.match(app, /CA:PENDING/);
  assert.match(app, /aria-label="Open Surge on X"/);
  assert.match(app, />\s*Launch App\s*<\/a>/);
  assert.match(app, /target="_blank"/);
  assert.match(app, /rel="noopener noreferrer"/);
  assert.doesNotMatch(app, /aria-label="GitHub"[\s\S]{0,300}href="#"/);
  assert.doesNotMatch(app, /\["GitHub", "Twitter", "Pump\.fun", "Whitepaper"\]/);
});

test("uses Surge's approved stair-step identity and extracted palette", () => {
  assert.match(html, /<link rel="icon" type="image\/png" href="\/favicon\.png"/);
  assert.match(app, /src="\/surge-mark\.webp"/);
  assert.doesNotMatch(app, /src="\/surge-pfp\.png"/);
  assert.match(app, /canvas: "#060b16"/);
  assert.match(app, /primary: "#69b4ca"/);
  assert.match(css, /background:\s*#060b16/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("contains compact navigation rules for a 390px viewport", () => {
  assert.match(app, /className="nav-section-links"/);
  assert.match(app, /className="launch-controls"/);
  assert.match(css, /@media \(max-width: 1023px\)/);
  assert.match(css, /\.nav-section-links\s*\{\s*display:\s*none/);
  assert.match(css, /@media \(max-width: 430px\)/);
});
