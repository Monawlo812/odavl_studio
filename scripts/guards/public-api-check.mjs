#!/usr/bin/env node
// API surface guard: fail if exported signatures change
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
const tmp = 'reports/.api-tmp';
const baseline = 'reports/api.d.ts';
mkdirSync('reports', { recursive: true });
execSync('tsc --emitDeclarationOnly --declaration --outDir ' + tmp, { stdio: 'inherit' });
const out = readFileSync(tmp + '/index.d.ts', 'utf8');
let base = existsSync(baseline) ? readFileSync(baseline, 'utf8') : '';
if (out.trim() !== base.trim()) {
  if (base) {
    console.error('API surface changed!');
    process.exit(1);
  } else {
    writeFileSync(baseline, out);
    console.log('API baseline created.');
  }
} else {
  console.log('API stable.');
  writeFileSync(baseline, out);
}
