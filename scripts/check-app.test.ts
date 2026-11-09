import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// scripts/check-app.ts: an app repo checks its app.json against these rules
// before it tags a release (npm run --silent check-app -- <app.json> <zip> <owner/repo>).
function run(appJson: object, zip: string, repo: string): { code: number; out: string } {
  const dir = mkdtempSync(join(tmpdir(), "check-app-"));
  const path = join(dir, "app.json");
  writeFileSync(path, JSON.stringify(appJson));
  try {
    const out = execFileSync("npm", ["run", "--silent", "check-app", "--", path, zip, repo], { encoding: "utf8" });
    return { code: 0, out: out.trim() };
  } catch (e) {
    const err = e as { status: number; stdout: string };
    return { code: err.status, out: String(err.stdout).trim() };
  }
}

describe("check-app", () => {
  it("passes a valid manifest and says what the store would install", () => {
    const r = run({ id: "net.picodeck.burnin", name: "Burn-In Fixer", version: "1.0.0", dirname: "burnin_fixer", min_firmware: "0.7.0" },
                  "picodeck-burnin-fixer-v1.0.0.zip", "PicoDeck/burnin-fixer");
    expect(r).toEqual({ code: 0, out: "ok net.picodeck.burnin 1.0.0 dirname=burnin_fixer" });
  });

  it("rejects what the store would reject, with its reason", () => {
    const r = run({ id: "net.picodeck.x", name: "X", version: "1.0.0", dirname: "store" }, "x.zip", "PicoDeck/x");
    expect(r).toEqual({ code: 1, out: "rejected dirname-reserved" });
  });
}, 60_000);
