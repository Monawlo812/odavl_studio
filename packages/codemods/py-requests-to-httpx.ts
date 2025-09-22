import fs from 'fs';
import path from 'path';

const GUARDS = { maxFiles: 10, maxLines: 40 };
const RE_IMPORT = /^\s*import\s+requests\b/m;
const RE_FROM_IMPORT = /^\s*from\s+requests\s+import\s+([\w,\s*]+)/m;
const RE_REQ_CALL = /\brequests\.(get|post|put|delete)\s*\(/g;
const RE_DIRECT_CALL = /\b(get|post|put|delete)\s*\(/g;
const SKIP_DIRS = new Set(['node_modules', '.git', 'venv', '.venv', '__pycache__']);

function walk(dir: string, out: string[] = []) {
  for (const f of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(f) || f.startsWith('.')) continue;
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, out);
    else if (stat.isFile() && f.endsWith('.py')) out.push(p);
  }
  return out;
}

export function pyRequestsToHttpxDryRun({ root = process.cwd(), dryRun = true, maxFiles = GUARDS.maxFiles, maxLines = GUARDS.maxLines } = {}) {
  const files = walk(root);
  let candidates: { file: string; line: number; call: string }[] = [];
  let importCount = 0;
  let notes: string[] = ['no mutations performed'];
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    let hasImport = RE_IMPORT.test(src);
    let fromImport = RE_FROM_IMPORT.exec(src);
    if (hasImport) importCount++;
    // requests.<method>
    let m;
    while ((m = RE_REQ_CALL.exec(src))) {
      const idx = src.slice(0, m.index).split(/\r?\n/).length;
      candidates.push({ file, line: idx, call: `requests.${m[1]}` });
    }
    // direct method calls if from-import
    if (fromImport) {
      const methods = fromImport[1].split(',').map(s => s.trim());
      let direct = src.matchAll(RE_DIRECT_CALL);
      for (const d of direct) {
        if (methods.includes(d[1])) {
          const idx = src.slice(0, d.index!).split(/\r?\n/).length;
          candidates.push({ file, line: idx, call: d[1] });
        }
      }
    }
  }
  const filesTouched = new Set(candidates.map(c => c.file)).size;
  const linesTouched = candidates.length + (filesTouched > 0 ? 2 * filesTouched : 0);
  const guardHit = filesTouched > maxFiles || linesTouched > maxLines;
  notes.push(`detected 'import requests' in ${importCount} files`);
  notes.push('use httpx.Client() for session-based equivalents (not auto-applied in dry-run)');
  return {
    recipe: 'py-requests-to-httpx',
    dryRun: true,
    candidates,
    changes: { files: filesTouched, lines: linesTouched },
    guards: { maxFiles, maxLines, guardHit },
    notes
  };
}
