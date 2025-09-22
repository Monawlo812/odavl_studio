import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const rptDir = path.join(process.cwd(), 'reports', 'go-report');
fs.mkdirSync(rptDir, { recursive: true });
const now = new Date().toISOString();

function sh(cmd, args = [], timeoutMs = 15000) {
  try {
    const r = spawnSync(cmd, args, { encoding: 'utf8', shell: true, timeout: timeoutMs });
    return { ok: r.status === 0, code: r.status ?? 1, out: r.stdout || '', err: r.stderr || '' };
  } catch (e) { return { ok: false, code: 1, out: '', err: String(e && (e.message || e)) } }
}
function readJsonIf(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }
function readTextIf(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
function listFiles(root, depth = 3, ignores = []) {
  let out = [];
  function walk(dir, d) {
    if (d > depth) return;
    for (const f of (fs.readdirSync(dir, { withFileTypes: true }) || [])) {
      if (ignores.includes(f.name)) continue;
      const p = path.join(dir, f.name);
      if (f.isDirectory()) { out.push({ path: p, dir: true }); walk(p, d + 1); }
      else out.push({ path: p, dir: false });
    }
  }
  walk(root, 1);
  return out;
}

// 1. Repo snapshot
const gitBranch = sh('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
const gitTag = sh('git', ['describe', '--tags']);
const gitSha = sh('git', ['rev-parse', 'HEAD']);
const gitStatus = sh('git', ['status', '--porcelain']);
const nodeV = sh('node', ['-v']);
const pnpmV = sh('pnpm', ['-v']);
const rootPkg = readJsonIf('package.json');
const workspaces = (rootPkg && rootPkg.workspaces) || [];
const apps = fs.existsSync('apps') ? fs.readdirSync('apps').filter(x=>x!=='node_modules') : [];
const packages = fs.existsSync('packages') ? fs.readdirSync('packages').filter(x=>x!=='node_modules') : [];

// 2. Workspaces & versions
function pkgMeta(p) {
  const j = readJsonIf(p);
  if (!j) return null;
  return {
    name: j.name, version: j.version, private: j.private,
    scripts: j.scripts ? Object.keys(j.scripts) : [],
    depCount: j.dependencies ? Object.keys(j.dependencies).length : 0,
    devDepCount: j.devDependencies ? Object.keys(j.devDependencies).length : 0,
    odavlDeps: Object.keys({ ...(j.dependencies||{}), ...(j.devDependencies||{}) }).filter(k=>k.startsWith('@odavl/'))
  };
}
const allPkgs = [];
for (const d of ['apps','packages']) {
  if (!fs.existsSync(d)) continue;
  for (const sub of fs.readdirSync(d)) {
    const p = path.join(d, sub, 'package.json');
    if (fs.existsSync(p)) allPkgs.push(pkgMeta(p));
  }
}

// 3. CLI surface
const cliBuild = sh('pnpm', ['--filter', '@odavl/cli', 'run', 'build']);
const cliHelp = sh('node', ['apps/cli/dist/index.js', '--help']);
const cliScan = sh('node', ['apps/cli/dist/index.js', 'scan']);
const cliStatus = sh('node', ['apps/cli/dist/index.js', 'status']);

// 4. Status snapshot
let statusJson = null;
try { statusJson = JSON.parse(cliStatus.out); } catch { statusJson = { ok: false, note: 'status failed' }; }
fs.writeFileSync(path.join(rptDir, 'status.json'), JSON.stringify(statusJson, null, 2));

// 5. VS Code extension
const extPkg = readJsonIf('apps/vscode-ext/package.json');
const extMeta = extPkg ? {
  publisher: extPkg.publisher, name: extPkg.name, commands: (extPkg.contributes && extPkg.contributes.commands) || [],
  activation: extPkg.activationEvents || [], statusbar: !!(extPkg.contributes && extPkg.contributes.viewsContainers)
} : { note: 'not found' };

// 6. Orchestrator
const orchPkg = readJsonIf('apps/orchestrator/package.json');
let orchApi = null;
try {
  orchApi = sh('node', ['-e', "import('./apps/orchestrator/dist/index.js').then(m=>console.log(!!m.runWorkflow))"]);
} catch { orchApi = { ok: false, note: 'not built' }; }

// 7. Codemods
const codemodsDir = 'packages/codemods';
let codemods = [];
if (fs.existsSync(codemodsDir)) {
  for (const f of fs.readdirSync(codemodsDir)) {
    if (f.endsWith('.ts') || f.endsWith('.js')) {
      const lines = readTextIf(path.join(codemodsDir, f));
      codemods.push({ id: f.replace(/\..*$/, ''), file: f, loc: lines ? lines.split('\n').length : 0 });
    }
  }
}

// 8. Policy & Gates
const policyText = readTextIf('.odavl.policy.yml') || readTextIf('.odavl/policy.yml');
const gatesText = readTextIf('.odavl/gates.yml');
const gatesPoly = readJsonIf('.odavl/gates.polyglot.json');

// 9. CI / Workflows
const workflowsDir = '.github/workflows';
let workflows = [];
if (fs.existsSync(workflowsDir)) {
  for (const f of fs.readdirSync(workflowsDir)) {
    if (f.endsWith('.yml')) workflows.push(f);
  }
}
const shadowExists = workflows.includes('shadow.yml');
const ghPrs = sh('gh', ['pr', 'list', '--state', 'open', '--json', 'number,title,headRefName,baseRefName,url']);
const ghRuns = sh('gh', ['run', 'list', '--limit', '10', '--json', 'status,conclusion,workflowName,htmlUrl']);

// 10. Python Pack
const pyPack = fs.existsSync('packages/packs/python') ? { present: true } : { present: false };
const pyDist = fs.existsSync('packages/packs/python/dist') ? true : false;

// 11. E2E artifacts
const e2eFiles = fs.readdirSync('reports').filter(f=>f.startsWith('e2e-')||f==='w4-status.json'||f==='Wave4-QA-Report.md');

// 12. Docs & Media
const docsDir = 'docs';
let docs = [];
if (fs.existsSync(docsDir)) {
  for (const f of fs.readdirSync(docsDir)) {
    docs.push(f);
  }
}

// 13. Metrics roll-up (best-effort)
const metrics = { cliBuild: cliBuild.ok, cliHelp: cliHelp.ok, status: statusJson.ok };

// 14. Write outputs
const snapshot = {
  ts: now,
  git: { branch: gitBranch.out.trim(), tag: gitTag.out.trim(), sha: gitSha.out.trim(), dirty: !!gitStatus.out.trim() },
  node: nodeV.out.trim(), pnpm: pnpmV.out.trim(),
  workspaces, apps, packages, allPkgs,
  cli: { build: cliBuild.ok, help: cliHelp.ok, scan: cliScan.ok, status: cliStatus.ok },
  status: statusJson,
  vscode: extMeta,
  orchestrator: { pkg: orchPkg, api: orchApi },
  codemods,
  policy: policyText,
  gates: { text: gatesText, poly: gatesPoly },
  ci: { workflows, shadow: shadowExists, prs: ghPrs.ok ? JSON.parse(ghPrs.out) : [], runs: ghRuns.ok ? JSON.parse(ghRuns.out) : [] },
  python: { pack: pyPack, dist: pyDist },
  e2e: e2eFiles,
  docs,
  metrics
};
fs.writeFileSync(path.join(rptDir, 'snapshot.json'), JSON.stringify(snapshot, null, 2));

// OPERATIONS-REPORT.md
const md = [
  '# ODAVL Studio — Full Project Audit',
  `- Timestamp: ${now}`,
  `- Branch: ${snapshot.git.branch}  Tag: ${snapshot.git.tag}  SHA: ${snapshot.git.sha}`,
  '',
  '## Executive Summary',
  `- CLI build: ${metrics.cliBuild ? '✅' : '❌'}`,
  `- CLI help: ${metrics.cliHelp ? '✅' : '❌'}`,
  `- Status: ${metrics.status ? '✅' : '❌'}`,
  '',
  '## Workspaces',
  ...allPkgs.map(p=>`- ${p.name}@${p.version} (private:${!!p.private}) scripts:${p.scripts.length} odavlDeps:${p.odavlDeps.length}`),
  '',
  '## CLI Surface',
  `- Build: ${cliBuild.ok ? 'OK' : 'FAIL'}  Help: ${cliHelp.ok ? 'OK' : 'FAIL'}`,
  '',
  '## VS Code Extension',
  extMeta ? JSON.stringify(extMeta, null, 2) : 'not found',
  '',
  '## Orchestrator',
  orchPkg ? JSON.stringify(orchPkg, null, 2) : 'not found',
  '',
  '## Codemods',
  ...codemods.map(c=>`- ${c.id} (${c.file}) LOC:${c.loc}`),
  '',
  '## Policy & Gates',
  policyText ? policyText.slice(0,200)+'...' : 'not found',
  gatesText ? gatesText.slice(0,200)+'...' : 'not found',
  gatesPoly ? JSON.stringify(gatesPoly).slice(0,200)+'...' : 'not found',
  '',
  '## CI / Workflows',
  ...workflows,
  '',
  '## Python Pack',
  JSON.stringify(pyPack),
  '',
  '## E2E Artifacts',
  ...e2eFiles,
  '',
  '## Docs',
  ...docs,
  '',
  '## Metrics',
  JSON.stringify(metrics, null, 2),
  '',
  '---',
  'End of report.'
].join('\n');
fs.writeFileSync(path.join(rptDir, 'OPERATIONS-REPORT.md'), md);

console.log('GO-REPORT: written reports/go-report/OPERATIONS-REPORT.md and snapshot.json');
