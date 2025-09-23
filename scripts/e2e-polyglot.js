#!/usr/bin/env node
const {
  existsSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
} = require("node:fs");
const { spawnSync } = require("node:child_process");

function run(cmd) {
  try {
    return spawnSync(cmd, { shell: true, stdio: "inherit" });
  } catch {
    return { status: 1 };
  }
}
function readJSON(p) {
  try {
    return JSON.parse(readFileSync(p, "utf-8"));
  } catch {
    return undefined;
  }
}

if (existsSync("scripts/e2e-go.sh")) run("scripts/e2e-go.sh || true");
if (existsSync("scripts/e2e-java.sh")) run("scripts/e2e-java.sh || true");

const out = { timestamp: new Date().toISOString() };
out.go = readJSON("reports/w5/go-e2e.json");
out.java = readJSON("reports/w5/java-e2e.json");

// JS/TS (best-effort): prefer prior e2e artifact if exists
out.js =
  readJSON("reports/w5/js-e2e.json") ||
  readJSON("reports/w4/js-e2e.json") ||
  readJSON("reports/js-e2e.json");

// Python (best-effort)
out.py = readJSON("reports/w5/py-e2e.json") || readJSON("reports/py-e2e.json");

mkdirSync("reports/w5", { recursive: true });
writeFileSync("reports/w5/polyglot-e2e.json", JSON.stringify(out, null, 2));
console.log("reports/w5/polyglot-e2e.json written");
