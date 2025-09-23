#!/usr/bin/env node
const { readdirSync, mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { spawnSync } = require("node:child_process");

const DIR = "reports/w5/contracts";
let files = [];
try {
  files = readdirSync(DIR).filter((f) => f.endsWith(".preview.test.js"));
} catch {}
const results = [];
for (const f of files) {
  const p = join(DIR, f);
  const r = spawnSync(process.execPath, [p], { encoding: "utf-8" });
  results.push({ file: p, status: r.status === 0 ? "pass" : "fail" });
}
const report = {
  total: results.length,
  passed: results.filter((x) => x.status === "pass").length,
  failed: results.filter((x) => x.status === "fail").length,
  files: results,
};
mkdirSync("reports/w5", { recursive: true });
writeFileSync(
  "reports/w5/contracts-report.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report));
process.exit(0); // preview mode never fails the pipeline
