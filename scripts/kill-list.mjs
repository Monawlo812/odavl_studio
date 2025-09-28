import { writeFileSync } from "fs";
import { execSync } from "child_process";

let paths = [];
try {
  const out = execSync("git ls-files").toString().split("\n");
  for (const f of out) {
    if (f.endsWith(".tmp") || f.endsWith(".log")) {
      paths.push({ path: f, reason: "temp/log file", confidence: "high", safe: true });
    }
    if (f.includes("node_modules")) {
      paths.push({ path: f, reason: "node_modules should be ignored", confidence: "high", safe: true });
    }
  }
} catch {}

const report = {
  generated: new Date().toISOString(),
  items: paths
};

writeFileSync("reports/cleanup/kill-list.json", JSON.stringify(report, null, 2));
console.log("Kill-list written with", report.items.length, "items");