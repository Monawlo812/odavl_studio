import fs from "fs";
import path from "path";

const GUARDS = { maxFiles: 10, maxLines: 40 };
const RE_AXIOS = /\baxios\.(get|post|put|delete)\s*\(/g;

function walk(dir: string, exts = [".js", ".ts"], out: string[] = []) {
  for (const f of fs.readdirSync(dir)) {
    if (f === "node_modules" || f.startsWith(".")) continue;
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, exts, out);
    else if (stat.isFile() && exts.some((e) => f.endsWith(e))) out.push(p);
  }
  return out;
}

export function axiosToFetchDryRun({
  root = process.cwd(),
  dryRun = true,
  maxFiles = GUARDS.maxFiles,
  maxLines = GUARDS.maxLines,
} = {}) {
  const files = walk(root);
  let candidates: { file: string; line: number; call: string }[] = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    let m;
    let lines = src.split(/\r?\n/);
    let seen = new Set();
    while ((m = RE_AXIOS.exec(src))) {
      // Approximate line number
      const idx = src.slice(0, m.index).split(/\r?\n/).length;
      const call = `axios.${m[1]}`;
      const key = `${file}:${idx}:${call}`;
      if (!seen.has(key)) {
        candidates.push({ file, line: idx, call });
        seen.add(key);
      }
    }
  }
  const filesTouched = new Set(candidates.map((c) => c.file)).size;
  const linesTouched = candidates.length;
  const guardHit = filesTouched > maxFiles || linesTouched > maxLines;
  return {
    recipe: "axios-to-fetch",
    dryRun: true,
    candidates,
    changes: { files: filesTouched, lines: linesTouched },
    guards: { maxFiles, maxLines, guardHit },
    note: "dry-run only, no modifications applied",
  };
}
