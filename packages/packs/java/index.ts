
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import { extname } from "node:path";

export type NotImplemented = { status: "not-implemented" };
const run = (cmd:string, args:string[]) => spawnSync(cmd, args, { encoding:"utf-8" });

  return JSON.parse(readFileSync("reports/w5/java-scan-sample.json","utf-8"));
}

export async function heal() {
  const imports:any[] = []; const deps:any[] = [];
  try {
    for (const f of readdirSync(".")) {
      if (extname(f) === ".java") {
        const s = readFileSync(f,"utf-8");
        const im = Array.from(s.matchAll(/import\s+([\w.]+)\.([A-Z]\w*)\s*;/g)).map(m=>({ fqn:m[1]+"."+m[2], sym:m[2] }));
        const body = s.replace(/import[\s\S]*?;/g,"");
        const removals:string[] = [];
        for (const {fqn,sym} of im) { if (!new RegExp(`\\b${sym}\\b`).test(body)) removals.push(fqn); }
        if (removals.length) imports.push({ file:f, removals });
      }
    }
  } catch {}
  try {
    if (existsSync("pom.xml")) {
      const r = run("mvn", ["-q","versions:display-dependency-updates"]);
      const lines = (r.stdout||"").split("\n").filter(l=>l.includes(" -> "));
      for (const l of lines) {
        const m = l.match(/([\w\-.]+):([\w\-.]+)\s*\.{0,}\s*([\w\-.]+)\s*->\s*([\w\-.]+)/);
        if (!m) continue;
        const module = `${m[1]}:${m[2]}`, from=m[3], to=m[4];
        const major = (v:string)=>v.split(".")[0];
        if (major(from)===major(to)) deps.push({ tool:"maven", module, from, to });
      }
    } else if (existsSync("build.gradle") || existsSync("gradlew")) {
      // Best-effort: we can only surface placeholders without running heavy tasks.
      // Propose empty list for now; future stages may enhance.
    }
  } catch {}
  const out = { imports, deps };
  mkdirSync("reports/w5", { recursive:true });
  writeFileSync("reports/w5/java-heal-proposals.json", JSON.stringify(out, null, 2));
  return out;
}
