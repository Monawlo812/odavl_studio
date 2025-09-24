// scripts/vscode-smoke.mjs
import { execSync } from "child_process";
import { existsSync, writeFileSync } from "fs";

let log = "VS Code Smoke Test\n";

try {
  execSync("pnpm run build", { stdio: "inherit" });
  log += "Build: OK\n";
} catch {
  log += "Build: FAIL\n";
}

const extPkg = "apps/vscode-ext/package.json";
log += `Extension manifest: ${existsSync(extPkg) ? "FOUND" : "MISSING"}\n`;

log += `Timestamp: ${new Date().toISOString()}\n`;

writeFileSync("reports/evidence/vscode-smoke.log", log);
console.log(log);
