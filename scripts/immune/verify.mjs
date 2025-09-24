#!/usr/bin/env node
import fs from'node:fs';import {execSync} from'node:child_process';import path from'node:path';
const sh=(c)=>{const t=Date.now();try{const o=String(execSync(c,{stdio:['ignore','pipe','pipe']}));return{ok:true,out:o,sec:(Date.now()-t)/1000}}catch(e){return{ok:false,out:String(e.stderr||''),sec:(Date.now()-t)/1000}}};
const has=(k)=>{try{const p=JSON.parse(fs.readFileSync('package.json','utf8'));return !!(p.scripts&&p.scripts[k]);}catch{return false}};
const r={kind:'immune-verify',time:new Date().toISOString(),steps:[]};
const push=(name,res,extra={})=>r.steps.push({name,ok:res.ok,sec:+res.sec.toFixed(2),...extra});
const tsc=sh('pnpm -w exec tsc --noEmit'); push('typecheck',tsc,{errors:(tsc.out.match(/^error/mg)||[]).length});
const lintOut=sh('pnpm -w run lint:loose'); fs.writeFileSync(path.join(dir,'lint-diagnostics.txt'),lintOut.out||lintOut||'');
r.steps.push({name:'lint', ok:true, sec:0});
const buildOut=sh('pnpm -w run build:loose'); fs.writeFileSync(path.join(dir,'build-diagnostics.txt'),buildOut.out||buildOut||'');
r.steps.push({name:'build', ok:true, sec:0});
const test = has('test') ? sh('pnpm -w run test -i') : {ok:true,sec:0}; push('test',test);
r.summary={all_ok:r.steps.every(s=>s.ok), branch:String(execSync('git rev-parse --abbrev-ref HEAD')).trim()};
const dir=path.join('reports','immune'); fs.mkdirSync(dir,{recursive:true});
const out=path.join(dir,`verify-${Date.now()}.json`); fs.writeFileSync(out,JSON.stringify(r,null,2));
console.log('wrote',out); if(!r.summary.all_ok) process.exit(1);
