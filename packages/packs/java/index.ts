
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
export type NotImplemented = { status: "not-implemented" };
const run = (cmd:string, args:string[]) => spawnSync(cmd, args, { encoding:"utf-8" });

export async function scan() {
  let tool:"maven"|"gradle"|"none" = "none";
  let lint=0, tests=0, vulns=0, out="";
  if (existsSync("pom.xml")) tool="maven";
  else if (existsSync("gradlew") || existsSync("build.gradle")) tool="gradle";
  try {
    if (tool==="maven") {
      const t = run("mvn", ["-q","-DskipTests=false","test"]);
      out += (t.stdout||"")+(t.stderr||""); tests = t.status===0?0:1;
      // try checkstyle if configured
      const c = run("mvn", ["-q","-DskipTests=true","checkstyle:checkstyle"]); out += (c.stdout||"")+(c.stderr||"");
      const s = (c.stdout||"").match(/violation/gi); lint = s? s.length : 0;
    } else if (tool==="gradle") {
      const t = existsSync("./gradlew") ? run("./gradlew", ["test"]) : run("gradle", ["test"]);
      out += (t.stdout||"")+(t.stderr||""); tests = t.status===0?0:1;
      const ch = existsSync("./gradlew") ? run("./gradlew", ["checkstyleMain","-q"]) : run("gradle", ["checkstyleMain","-q"]);
      out += (ch.stdout||"")+(ch.stderr||"");
      const s = (ch.stdout||"").match(/violation/gi); lint = s? s.length : 0;
      const sb = existsSync("./gradlew") ? run("./gradlew", ["spotbugsMain","-q"]) : run("gradle", ["spotbugsMain","-q"]);
      out += (sb.stdout||"")+(sb.stderr||"");
    }
  } catch {}
  try { const m = out.toLowerCase().match(/vuln/gi); vulns = m? m.length:0; } catch {}
  const res = { lintWarnings: lint, testFailures: tests, vulns, tool };
  mkdirSync("reports/w5", { recursive:true });
  writeFileSync("reports/w5/java-scan-sample.json", JSON.stringify(res, null, 2));
  return res;
}

export async function heal(): Promise<NotImplemented> { return { status: "not-implemented" }; }
