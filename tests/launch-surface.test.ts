import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const avatar = readFileSync(new URL("../assets/surge-avatar.png", import.meta.url));
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("public launch surface", () => {
  it("positions Surge as a current Robinhood breakout filter launching on Pons", () => {
    expect(readme).toContain("Robinhood crypto breakout-quality filter");
    expect(readme).toContain('<img src="assets/surge-avatar.png"');
    expect(avatar.byteLength).toBeGreaterThan(1_024);
    expect(readme).toContain("[Website](https://surgedetect.com/)");
    expect(readme).toContain("[Launch venue](https://pons.family/)");
    expect(readme).toContain("Snapshot: September 4, 2026 · 12:27 UTC");
    expect(readme).not.toMatch(/\bSolana\b|Pump\.fun|Polymarket|Jupiter|\bDEX\b|wallet/i);
    expect(packageJson.description).toContain("Robinhood crypto breakout");
    expect(packageJson.homepage).toBe("https://surgedetect.com/");
    expect(packageJson.keywords).toContain("robinhood");
    expect(packageJson.keywords).toContain("pons");
    expect(packageJson.keywords).not.toContain("solana");
  });
});
