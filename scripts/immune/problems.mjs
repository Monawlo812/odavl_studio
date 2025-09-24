#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
const dir = path.join('reports', 'immune');
fs.mkdirSync(dir, { recursive: true });
const sh = (c) => { try { return String(execSync(c, { stdio: 'pipe' })); } catch (e) { return e.stdout ? String(e.stdout) : ''; } };
const es = sh('pnpm -w exec eslint . -f json');
const ts = sh('pnpm -w exec tsc --noEmit');
let problems = { eslint: [], tsc: [], summary: {} };
try { problems.eslint = JSON.parse(es); } catch { problems.eslint = []; }
problems.tsc = ts.split('\n').filter(l => /error TS\d+/.test(l));
problems.summary = {
  eslintCount: problems.eslint.reduce((a, f) => a + (f.errorCount || 0), 0),
  tscCount: problems.tsc.length
};
fs.writeFileSync(path.join(dir, 'problems.json'), JSON.stringify(problems, null, 2));
const protectedPattern = /security\/|\.spec\.|public-api\//;
if (problems.summary.tscCount === 0 && problems.summary.eslintCount > 0) {
  // Only ESLint errors: try auto-fix (guarded)
  const files = problems.eslint.filter(f => f.errorCount && !protectedPattern.test(f.filePath)).slice(0, 10).map(f => f.filePath);
  if (files.length) {
    const before = files.map(f => fs.readFileSync(f, 'utf8'));
  sh('pnpm -w exec eslint --fix ' + files.map(f => `'${f}'`).join(' '));
    const after = files.map(f => fs.readFileSync(f, 'utf8'));
    const linesChanged = after.reduce((n, txt, i) => n + txt.split('\n').filter((l, j) => l !== before[i].split('\n')[j]).length, 0);
    if (linesChanged > 40) {
      // Rollback
      files.forEach((f, i) => fs.writeFileSync(f, before[i]));
      fs.writeFileSync(path.join(dir, 'problems-escalate.md'), '# Escalation: Too many lines changed by ESLint --fix');
      console.log('Escalation: Too many lines changed, rolled back.');
    } else {
      console.log(`ESLint auto-fix applied to ${files.length} files, ${linesChanged} lines changed.`);
    }
  } else {
    console.log('No eligible files for ESLint auto-fix.');
  }
} else if (problems.summary.tscCount > 0) {
  // TypeScript errors: escalate
  fs.writeFileSync(path.join(dir, 'problems-escalate.md'), `# Escalation: TypeScript errors\n\n${problems.tsc.slice(0, 30).join('\n')}`);
  console.log('Escalation: TypeScript errors found.');
} else {
  console.log('No problems found.');
}
