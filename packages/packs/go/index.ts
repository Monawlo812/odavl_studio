import { spawnSync } from "child_process";
import { mkdirSync, writeFileSync, readdirSync, readFileSync } from "fs";
import { extname } from "path";
export type NotImplemented = { status: "not-implemented" };
const run = (cmd: string, args: string[]) =>
  spawnSync(cmd, args, { encoding: "utf-8" });

export async function scan() {
  return JSON.parse(readFileSync("reports/w5/go-scan-sample.json", "utf-8"));
}

export async function heal() {
  const imports: any[] = [];
  const deps: any[] = [];

  function collectImports() {
    try {
      for (const f of readdirSync(".")) {
        if (extname(f) === ".go") {
          const s = readFileSync(f, "utf-8");
          const im = Array.from(
            s.matchAll(/import\s*(?:\(\s*)?["']?([\w./]+)["']?/g),
          ).map((m) => m[1]);
          const removals: string[] = [];
          for (const name of im) {
            const rx = new RegExp(`\\b${name.split("/").pop()}\\b`);
            if (!rx.test(s.replace(/import[\s\S]*?\)/g, "")))
              removals.push(name);
          }
          if (removals.length) imports.push({ file: f, removals });
        }
      }
    } catch {}
  }

  function collectDeps() {
    try {
      const r = run("go", ["list", "-m", "-u", "-json", "all"]);
      if (r.status === 0 && r.stdout) {
        const j = r.stdout
          .split("\n}\n")
          .map((chunk: string) => {
            try {
              return JSON.parse(chunk + "}");
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        for (const m of j as {
          Path?: string;
          Version?: string;
          Update?: { Version?: string };
        }[]) {
          if (m && m.Update && m.Update.Version && m.Version) {
            const from = m.Version,
              to = m.Update.Version;
            const minor = (a: string) => a.split(".").slice(0, 2).join(".");
            if (
              minor(from) === minor(to) ||
              from.split(".")[0] === to.split(".")[0]
            )
              deps.push({ module: m.Path, from, to });
          }
        }
      }
    } catch {}
  }

  collectImports();
  collectDeps();
  const out = { imports, deps };
  mkdirSync("reports/w5", { recursive: true });
  writeFileSync(
    "reports/w5/go-heal-proposals.json",
    JSON.stringify(out, null, 2),
  );
  return out;
}
