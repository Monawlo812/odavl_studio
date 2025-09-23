#!/usr/bin/env node
import fs from 'node:fs'; import { execSync } from 'node:child_process'; import path from 'node:path';
const root=process.cwd(), outDir=path.join(root,'reports','immune'); fs.mkdirSync(outDir,{recursive:true});
const globs = ["src/**/*.ts","src/**/*.tsx","packages/*/src/**/*.ts","packages/*/src/**/*.tsx"];
const args = ['grep','-n','-E','legacyX\\.|fs\\.promises\\.readdirSync','--',...globs];
let out = ''; try { out = execSync(['git',...args].join(' '), {stdio:['ignore','pipe','pipe']}).toString(); } catch { out=''; }
const rows = out.trim()? out.trim().split('\n'): [];
const findings = rows.map(line=>{
  const m=line.match(/^(.*?):(\d+):(.*)$/); if(!m) return null;
  const [_,file,ln,txt]=m; const rules=[];
  if(/legacyX\./.test(txt)) rules.push('replace-legacyX');
  if(/fs\.promises\.readdirSync/.test(txt)) rules.push('ban-api');
  return {file, line:Number(ln), rules};
}).filter(Boolean);
const summary = {
  kind:'vaccinate-dryrun', time:new Date().toISOString(),
  totals:{ files:new Set(findings.map(f=>f.file)).size, hits:findings.length },
  rules:['replace-legacyX','ban-api'],
};
fs.writeFileSync(path.join(outDir,'vaccinate-dryrun.json'), JSON.stringify({summary, findings},null,2));
console.log('wrote reports/immune/vaccinate-dryrun.json');
if(findings.length){
  const top = findings.slice(0,20).map(f=>`${f.file}:${f.line}  [${f.rules.join(',')}]`).join('\n');
  fs.writeFileSync(path.join(outDir,'vaccinate-dryrun.top20.txt'), top+'\n'); 
  console.log('top20:\n'+top);
} else { console.log('no risky patterns found'); }
