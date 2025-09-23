#!/usr/bin/env node
import fs from'node:fs';import {execSync} from'node:child_process';import path from'node:path';
const sh=(c)=>{try{return String(execSync(c,{stdio:['ignore','pipe','pipe']}))}catch{return null}};
const dir=path.join('reports','immune');const plan=JSON.parse(fs.readFileSync(path.join(dir,'problems-plan.json'),'utf8'));
if(plan.plan!=='eslint'){console.log('no-op (plan!=eslint)');process.exit(0)}
if(!plan.targets?.length){console.log('no targets');process.exit(0)}
sh('pnpm -w exec eslint --fix '+plan.targets.map(f=>`"${f}"`).join(' '));
const raw=sh('git diff --numstat')||'';const rows=raw.trim()?raw.trim().split('\n'):[];const files=[],PROT=[/\/security\//, /\.spec\./, /\/public-api\//];let lines=0;
for(const r of rows){
	const m=r.match(/^(\d+|-)\s+(\d+|-)\s+(.*)$/);
	if(!m) continue;
	const add=m[1]==='-'?0:+m[1],del=m[2]==='-'?0:+m[2],f=m[3];
	files.push(f);
	lines+=add+del;
}
if(files.some(f=>PROT.some(rx=>rx.test(f)))||files.length>10||lines>40){execSync('git restore --staged -W .');execSync('git checkout -- .');console.error('guard-violation',{files:files.length,lines});process.exit(2)}
fs.writeFileSync(path.join(dir,'heal-report.json'),JSON.stringify({kind:'immune-heal',time:new Date().toISOString(),mode:'eslint',changedFiles:files,linesChanged:lines},null,2));
console.log('healed',files.length,'files, lines=',lines);