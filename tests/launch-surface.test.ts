import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("public launch surface", () => {
  it("links the live Surge website from the repository", () => {
    expect(readme).toContain("[Website](https://surge-launch.vercel.app)");
    expect(packageJson.homepage).toBe("https://surge-launch.vercel.app");
  });
});
