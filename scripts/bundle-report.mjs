// scripts/bundle-report.mjs
import { execSync } from "child_process";
import { writeFileSync } from "fs";

const start = Date.now();
try {
  execSync("pnpm run build", { stdio: "inherit" });
} catch (e) {
  console.error("Build failed", e);
}
const end = Date.now();
const buildMs = end - start;

// crude bundle size: sum of dist folder (if exists)
import { execSync as exec } from "child_process";
let bundleKB = 0;
try {
  const out = exec("du -sk dist || true").toString().split("\t")[0];
  bundleKB = parseInt(out, 10);
} catch {}

const json = { buildMs, bundleKB, timestamp: new Date().toISOString() };
writeFileSync("reports/evidence/bundle.json", JSON.stringify(json, null, 2));
writeFileSync("reports/evidence/bundle.log", `Build: ${buildMs}ms\nBundle: ${bundleKB}KB\n`);
console.log("Bundle report written:", json);
