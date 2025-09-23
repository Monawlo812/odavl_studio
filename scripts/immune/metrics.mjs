#!/usr/bin/env node
import fs from'node:fs';import path from'node:path';
const dir=path.join(process.cwd(),'reports','immune');fs.mkdirSync(dir,{recursive:true});
const safeRead=(p)=>{try{return JSON.parse(fs.readFileSync(p,'utf8'))}catch{return null}};
const list=(pre)=>fs.readdirSync(dir).filter(f=>f.startsWith(pre));
const snap=safeRead(path.join(dir,'health-snapshot.json'));
const tri =safeRead(path.join(dir,'triage-report.json'));
const verFiles=list('verify-');const lastVer=verFiles.sort().at(-1);const ver= lastVer? safeRead(path.join(dir,lastVer)):null;
const heal=safeRead(path.join(dir,'heal-report.json'));
const abApply=safeRead(path.join(dir,'antibodies-apply.json'));
const escSum= fs.existsSync(path.join(dir,'escalate','SUMMARY.md'));
const metrics={
  time:new Date().toISOString(),
  tsErrors:snap?.tsErrors,eslintErrors:snap?.eslintErrors,
  deps:snap?.deps,classification:tri?.classification,
  verify_ok:ver?.summary?.all_ok,
  heal_lines:heal?.linesChanged||0,
  antibody_applied:!!abApply,
  escalation:escSum
};
const histPath=path.join(dir,'metrics-history.json');let hist=[];try{hist=JSON.parse(fs.readFileSync(histPath,'utf8'))}catch{}
hist.push(metrics);fs.writeFileSync(histPath,JSON.stringify(hist,null,2));
const total=hist.length,escCount=hist.filter(m=>m.escalation).length,healCount=hist.filter(m=>m.heal_lines>0).length,verOk=hist.filter(m=>m.verify_ok).length;
const rates={self_heal_rate:healCount/(healCount+escCount||1), escalation_rate:escCount/total, regression_free:verOk/total};
const out={latest:metrics,rates,count:total};
fs.writeFileSync(path.join(dir,'metrics.json'),JSON.stringify(out,null,2));
const md=[`# Immune Metrics`,`- total runs: ${total}`,`- self_heal_rate: ${rates.self_heal_rate.toFixed(2)}`,`- escalation_rate: ${rates.escalation_rate.toFixed(2)}`,`- regression_free: ${(rates.regression_free*100).toFixed(1)}%`,``, '## Latest Snapshot', '```json', JSON.stringify(metrics,null,2),'```'].join('\n');
fs.writeFileSync(path.join(dir,'metrics.md'),md);
console.log('wrote metrics.json + metrics.md');
