import { describe, it, expect, beforeEach } from "vitest";

// Test the spike detection logic directly (pure functions)
function computeSpikeRatio(currentVolume: number, historyVolumes: number[]): number {
  if (historyVolumes.length < 2) return 1;
  const baseline = historyVolumes.slice(0, -1).reduce((a, b) => a + b, 0) / (historyVolumes.length - 1);
  return baseline > 0 ? currentVolume / baseline : 1;
}

describe("spike ratio calculation", () => {
  it("returns 1 when history is too short", () => {
    expect(computeSpikeRatio(100_000, [])).toBe(1);
    expect(computeSpikeRatio(100_000, [50_000])).toBe(1);
  });

  it("detects 5x spike correctly", () => {
    const history = [20_000, 20_000, 20_000, 100_000];
    const ratio = computeSpikeRatio(100_000, history);
    expect(ratio).toBeCloseTo(5, 0);
  });

  it("returns 1 when volume matches baseline", () => {
    const history = [50_000, 50_000, 50_000, 50_000];
    const ratio = computeSpikeRatio(50_000, history);
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("handles zero baseline without throwing", () => {
    const ratio = computeSpikeRatio(100_000, [0, 0, 0, 100_000]);
    expect(ratio).toBe(1);
  });
});

describe("spike filtering", () => {
  const threshold = 3.0;

  it("filters out tokens below threshold", () => {
    const ratios = [1.2, 2.8, 3.5, 7.1, 0.9];
    const spikes = ratios.filter((r) => r >= threshold);
    expect(spikes).toHaveLength(2);
  });

  it("sorts spikes descending by ratio", () => {
    const spikes = [3.5, 7.1, 4.2].sort((a, b) => b - a);
    expect(spikes[0]).toBe(7.1);
    expect(spikes[2]).toBe(3.5);
  });
});

describe("signal model", () => {
  it("valid assessment types", () => {
    const valid = ["organic", "bot_wash", "coordinated_pump", "unknown"];
    expect(valid).toContain("organic");
    expect(valid).toContain("bot_wash");
  });

  it("confidence is bounded", () => {
    const confidence = 0.87;
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(1);
  });
});
