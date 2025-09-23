#!/usr/bin/env node
import fs from'node:fs';import path from'node:path';import {execSync} from'node:child_process';
const root=process.cwd(), rep=path.join(root,'reports','immune'); fs.mkdirSync(rep,{recursive:true});
const files=fs.readdirSync(rep).filter(f=>f.startsWith('verify-')).sort(); const last=files.at(-1)||null;
const tri=fs.existsSync(path.join(rep,'triage-report.json'))? JSON.parse(fs.readFileSync(path.join(rep,'triage-report.json'),'utf8')):null;
const ver= last? JSON.parse(fs.readFileSync(path.join(rep,last),'utf8')):null;
const failed = ver? ver.steps.filter(s=>!s.ok).map(s=>s.name):[];
const classification = tri?.classification||'unknown';
const risk = 1;
const md = [
  '# ODAVL Escalation',
  `- classification: ${classification}`,
  `- failed_steps: ${failed.join(',')||'none'}`,
  `- risk_tokens: ${risk}`,
  '',
  '## Evidence',
  `- ${last||'no-verify'}`,
  '- triage-report.json',
  '- health-snapshot.json'
].join('\n');
const outDir=path.join(rep,'escalate'); fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'SUMMARY.md'),md);
try{
  execSync('gh pr create --title "ODAVL: Escalation — verify failed" --body-file reports/immune/escalate/SUMMARY.md --draft', {stdio:'inherit'});
  console.log('draft PR opened via gh');
}catch{ console.log('gh not available; draft not opened. Summary ready at reports/immune/escalate/SUMMARY.md'); }
