#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path'; import { execSync } from 'node:child_process';
const sh = (cmd) => { try { return String(execSync(cmd, { stdio: ['ignore','pipe','pipe'] })); } catch { return null; } };
const hasScript = (name) => { try { const pkg = JSON.parse(fs.readFileSync('package.json','utf8')); return pkg.scripts && pkg.scripts[name]; } catch { return false; } };
const parseJSON = (txt) => { try { return JSON.parse(txt); } catch { return null; } };

let eslintErrors = null;
const eslintRaw = sh('pnpm -w exec eslint . -f json');
if (eslintRaw) { const arr = parseJSON(eslintRaw); if (Array.isArray(arr)) eslintErrors = arr.reduce((a,f)=>a+(f.errorCount||0),0); }

let tsErrors = null;
const tsRaw = sh('pnpm -w exec tsc --noEmit');
if (tsRaw !== null) { const m = tsRaw.match(/^error/mg); tsErrors = m ? m.length : 0; }

let buildTimeSec = null;
if (hasScript('build')) { const t0 = Date.now(); const ok = sh('pnpm -w run build'); if (ok !== null) buildTimeSec = Math.round((Date.now()-t0)/100)/10; }

let deps = { outdatedPatch: null, outdatedMinor: null };
const out = sh('pnpm -w outdated --json');
if (out) {
  const j = parseJSON(out); let p=0,m=0;
  Object.values(j||{}).forEach(x => {
    const cur = x.current||'', tar = x.latest||x.wanted||'';
    const [cM,cm,cp]=String(cur).split('.').map(Number); const [tM,tm,tp]=String(tar).split('.').map(Number);
    if (tM===cM && tm===cm && tp>cp) p++;
    else if (tM===cM && tm>cm) m++;
  });
  deps = { outdatedPatch: p, outdatedMinor: m };
}

const snapshot = { tsErrors, eslintErrors, buildTimeSec, deps, time: new Date().toISOString() };
const outDir = path.join('reports','immune'); fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'health-snapshot.json'), JSON.stringify(snapshot,null,2), 'utf8');
console.log('wrote reports/immune/health-snapshot.json');
