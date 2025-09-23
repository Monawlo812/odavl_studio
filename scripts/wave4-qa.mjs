import fs from "fs";
import path from "path";
const cwd = process.cwd(),
  now = new Date().toISOString();
const rptDir = path.join(cwd, "reports");
fs.mkdirSync(rptDir, { recursive: true });
const want = [
  "w4-status.json",
  "e2e-js-scan.json",
  "e2e-js-heal-dry.json",
  "e2e-py-scan.json",
  "e2e-py-heal-dry.json",
  "e2e-shadow.json",
  "e2e-pr-dry.json",
];
const present = {};
for (const f of want) {
  const p = path.join(rptDir, f);
  present[f] = fs.existsSync(p);
}
const verifyFiles = fs
  .readdirSync(rptDir)
  .filter((x) => /^verify-.*\.json$/.test(x))
  .sort()
  .reverse();
const verify = verifyFiles[0] || null;
const md = [
  "# Wave 4 — QA Summary",
  `- Timestamp: ${now}`,
  "## Status",
  `- w4-status.json: ${present["w4-status.json"] ? "present" : "missing"}`,
  "## E2E (JS)",
  `- e2e-js-scan.json: ${present["e2e-js-scan.json"] ? "present" : "missing"}`,
  `- e2e-js-heal-dry.json: ${present["e2e-js-heal-dry.json"] ? "present" : "missing"}`,
  "## E2E (Python)",
  `- e2e-py-scan.json: ${present["e2e-py-scan.json"] ? "present" : "missing"}`,
  `- e2e-py-heal-dry.json: ${present["e2e-py-heal-dry.json"] ? "present" : "missing"}`,
  "## Shadow & PR (dry)",
  `- e2e-shadow.json: ${present["e2e-shadow.json"] ? "present" : "missing"}`,
  `- e2e-pr-dry.json: ${present["e2e-pr-dry.json"] ? "present" : "missing"}`,
  "## Verify (merged)",
  `- latest verify-*.json: ${verify ? verify : "missing"}`,
  "",
  "Next:",
  "- If any artifact is missing, re-run the corresponding step (status/e2e/verify-unify).",
].join("\n");
fs.writeFileSync(path.join(rptDir, "Wave4-QA-Report.md"), md);
fs.writeFileSync(
  path.join(rptDir, "w4-qa-summary.json"),
  JSON.stringify({ ok: true, present, verify, ts: now }, null, 2),
);
console.log("Wave 4 QA report written.");
