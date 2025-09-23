#!/usr/bin/env node
import fs from 'node:fs'; import { execSync } from 'node:child_process'; import path from 'node:path';
const mode = process.argv[2]||'plan', outDir=path.join('reports','immune'); fs.mkdirSync(outDir,{recursive:true});
const sh=(c)=>{ try{ return String(execSync(c,{stdio:['ignore','pipe','pipe']})); }catch{ return null; } };
const triagePath=path.join('reports','immune','triage-report.json');
const triage=fs.existsSync(triagePath)? JSON.parse(fs.readFileSync(triagePath,'utf8')) : null;
if(mode==='plan'){ console.log('plan:', triage?.playbook||'none'); process.exit(0); }

const PROTECTED=[/\/security\//, /\.spec\./, /\/public-api\//];
const listChanged=()=>{
  const raw=sh('git diff --numstat')||''; 
  const rows=raw.trim()? raw.trim().split('\n'): [];
  const files=[]; let lines=0;
  for(const r of rows){
    const m=r.match(/^(\d+|-)	(\d+|-)	(.*)$/); if(!m) continue;
    const add=m[1]==='-'?0:+m[1], del=m[2]==='-'?0:+m[2], f=m[3];
    files.push(f); lines+=add+del;
  }
  return {files, lines};
};
const rollback=()=>{ sh('git restore --staged -W .'); sh('git checkout -- .'); };

if(mode==='eslint'){
  const json=sh('pnpm -w exec eslint . -f json'); 
  if(!json){ console.error('eslint run failed'); process.exit(1); }
  let arr=[]; try{ arr=JSON.parse(json);}catch{}
  const targets = arr.filter(f=> (f.errorCount||0)>0 ).slice(0,10).map(f=>f.filePath);
  if(targets.length===0){ console.log('no eslint errors to fix'); process.exit(0); }
  sh('pnpm -w exec eslint --fix '+targets.map(x=>`"${x}"`).join(' '));
  const {files, lines}=listChanged();
  const touchesProtected = files.some(f=> PROTECTED.some(rx=> rx.test(f)));
  if(touchesProtected || files.length>10 || lines>40){
    console.error('guard-violation',{files:files.length,lines,touchesProtected});
    rollback(); process.exit(2);
  }
  fs.writeFileSync(path.join(outDir,'heal-report.json'), JSON.stringify({
    kind:'immune-heal', time:new Date().toISOString(), mode:'eslint', changedFiles:files, linesChanged:lines
  },null,2));
  console.log('healed with eslint --fix on', targets.length, 'file(s).');
  process.exit(0);
}

console.log('unknown mode:', mode); process.exit(1);
