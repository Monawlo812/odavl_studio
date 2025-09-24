#!/usr/bin/env node
// Lightweight smoke test: build & test all packages, fail on error or slow build
import { execSync } from 'child_process';
const pkgs = ['cli', 'codemods', 'core', 'policy'];
let failed = false;
for (const pkg of pkgs) {
  try {
    const t0 = Date.now();
    execSync(`pnpm --filter @odavl/${pkg} run build`, { stdio: 'inherit' });
    execSync(`pnpm --filter @odavl/${pkg} run test`, { stdio: 'inherit' });
    const dt = (Date.now() - t0) / 1000;
    if (dt > 60) throw new Error('Build/test too slow');
  } catch (e) {
    console.error(`Smoke failed in ${pkg}:`, e.message);
    failed = true;
  }
}
if (failed) {
  process.exit(1);
} else {
  console.log('Smoke OK');
}
