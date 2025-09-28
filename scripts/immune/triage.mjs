#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
import { classify } from './triage-lib.mjs';

const root = process.cwd();
const inPath = path.join(root, 'reports','immune','health-snapshot.json');
const outDir = path.join(root, 'reports','immune');
const outPath = path.join(outDir, 'triage-report.json');

const snap = JSON.parse(fs.readFileSync(inPath,'utf8'));
const decision = classify(snap);
const report = {
  kind: 'immune-triage',
  time: new Date().toISOString(),
  input: { tsErrors: snap.tsErrors, eslintErrors: snap.eslintErrors, deps: snap.deps },
  ...decision,
  risk_tokens: 1
};
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(outPath, JSON.stringify(report,null,2),'utf8');
console.log('wrote', path.relative(root,outPath));
