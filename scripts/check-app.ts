// Check an app's app.json against the store's rules before its release is tagged:
//
//   npm run --silent check-app -- <path/to/app.json> <release zip name> <owner/repo>
//
// prints "ok <id> <version> dirname=<dirname>", or "rejected <reason>" with exit 1.
// It runs validateRepo, the refresh's own check, on a release holding that zip.
// esbuild (which wrangler brings) bundles it for Node, so the repo needs no TS
// runner; scripts/ is Node tooling, outside the Worker's tsconfig. Claims are
// not checked: they live in the store's KV.
import { readFileSync } from "node:fs";
import { validateRepo } from "../src/validate";
import type { RepoSummary } from "../src/github";

const [path, zip, fullName] = process.argv.slice(2);
if (!path || !zip || !fullName || !fullName.includes("/")) {
  console.error("usage: npm run --silent check-app -- <app.json> <release zip name> <owner/repo>");
  process.exit(2);
}
const [owner, name] = fullName.split("/");
const repo: RepoSummary = {
  fullName, owner, name, description: "", stars: 0, pushedAt: new Date().toISOString(),
  htmlUrl: `https://github.com/${fullName}`,
};
const release = { ok: true as const, value: { tagName: "v0", assets: [
  { id: "check", name: zip, size: 1, downloadUrl: `https://github.com/${fullName}/releases/download/v0/${zip}` },
] } };
// hasIcon only picks the store's icon URL, which this check does not print.
const r = validateRepo(repo, release, { ok: true, value: { appJson: readFileSync(path, "utf8"), hasIcon: false } });
if (r.ok) {
  console.log(`ok ${r.app.manifest.id} ${r.app.manifest.version} dirname=${r.app.manifest.dirname}`);
} else {
  console.log(`rejected ${r.reason}`);
  process.exit(1);
}
