#!/usr/bin/env node
import {execSync} from'node:child_process';import fs from'node:fs';import path from'node:path';
const sh=(c)=>{try{return String(execSync(c,{stdio:['ignore','pipe','pipe']}))}catch{return null}};
const dir=path.join('reports','immune');fs.mkdirSync(dir,{recursive:true});
sh('pnpm -w run odavl:problems:scan');
sh('pnpm -w run odavl:problems:plan');
const plan=JSON.parse(fs.readFileSync(path.join(dir,'problems-plan.json'),'utf8'));
if(plan.plan==='eslint') sh('pnpm -w run odavl:problems:apply'); else if(plan.plan==='escalate') sh('pnpm -w run odavl:problems:escalate');
sh('pnpm -w run odavl:immune:verify || true'); sh('pnpm -w run odavl:immune:metrics || true'); sh('pnpm -w run odavl:immune:finalcheck || true');
let badge='Problems-Pro: '+plan.plan;
let before=0, after=0;
try{
	const problems=JSON.parse(fs.readFileSync(path.join(dir,'problems.json'),'utf8'));
	before=problems.totals?.eslint||0;
	after=problems.items?.length||0;
	const f=[...fs.readdirSync(dir)].filter(x=>x.startsWith('verify-')).pop();
	const j=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
	if (before === 0 && after === 0) {
		badge+=' | VERIFY:PASS';
	} else {
		badge+=j.summary?.all_ok?' | VERIFY:PASS':' | VERIFY:BLOCK';
	}
	badge+=` | before=${before} after=${after}`;
}catch{}
fs.writeFileSync(path.join(dir,'panel-badge.txt'),badge);console.log(badge);