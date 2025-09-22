import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
export type NotImplemented = { status: "not-implemented" };
const run = (cmd:string, args:string[]) => spawnSync(cmd, args, { encoding:"utf-8" });

export async function scan() {
  let lint=0, tests=0, vulns=0;
  try {
    const r = run("golangci-lint", ["run","--out-format","json"]);
    if (r.status===0 && r.stdout) { const j = JSON.parse(r.stdout); lint = Array.isArray(j.Issues)? j.Issues.length : 0; }
  } catch {}
  try {
    const t = run("go", ["test","-json","./..."]);
    tests = t.status===0 ? 0 : 1;
  } catch { tests = 0; }
  try {
    const v = run("govulncheck", ["-json","./..."]);
    if (v.stdout) { const m = v.stdout.toLowerCase().match(/vuln/g); vulns = m? m.length : 0; }
  } catch { vulns = 0; }
  const out = { lintWarnings: lint, testFailures: tests, vulns };
  mkdirSync("reports/w5", { recursive:true });
  writeFileSync("reports/w5/go-scan-sample.json", JSON.stringify(out, null, 2));
  return out;
}

export async function heal(): Promise<NotImplemented> { return { status:"not-implemented" }; }
