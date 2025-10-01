#!/usr/bin/env node
// doctor.js - ODAVL Studio Health Check
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function checkConfigDrift() {
  try {
    execSync('git diff --exit-code', { stdio: 'ignore' });
    return { configDrift: false };
  } catch {
    return { configDrift: true };
  }
}

function checkDependencies() {
  try {
    execSync('pnpm install --lockfile-only', { stdio: 'ignore' });
    return { missingDependencies: false };
  } catch {
    return { missingDependencies: true };
  }
}

function checkScripts() {
  const scripts = ['build', 'lint', 'test'];
  const results = {};
  for (const script of scripts) {
    try {
      execSync(`pnpm run ${script}`, { stdio: 'ignore' });
      results[script] = 'ok';
    } catch {
      results[script] = 'fail';
    }
  }
  return { scripts: results };
}

function checkSecurityEvidence() {
  const required = [
    'reports/phase3/security/sbom.cdx.json',
    'reports/phase3/security/osv.log',
    'reports/phase3/security/gitleaks.log'
  ];
  const missing = required.filter(f => !fs.existsSync(f));
  return { securityEvidence: missing.length === 0, missing };
}

function main() {
  const report = {
    date: new Date().toISOString(),
    ...checkConfigDrift(),
    ...checkDependencies(),
    ...checkScripts(),
    ...checkSecurityEvidence()
  };
  const outDir = path.join('reports', 'evaluations', new Date().toISOString().slice(0,10), 'doctor');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'doctor.log'), JSON.stringify(report, null, 2));
  console.log('Doctor report written:', path.join(outDir, 'doctor.log'));
}

if (require.main === module) main();
