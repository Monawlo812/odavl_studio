#!/usr/bin/env node
import fs from'node:fs';import {execSync} from'node:child_process';import path from'node:path';
const dir=path.join('reports','immune');fs.mkdirSync(dir,{recursive:true});
const sh=(c)=>{try{return String(execSync(c,{stdio:['ignore','pipe','pipe']}))}catch{return null}};
const items=[];
const esRaw=sh('pnpm -w exec eslint . -f json');if(esRaw){try{JSON.parse(esRaw).forEach(f=>f.messages.forEach(m=>items.push({source:'eslint',file:f.filePath,line:m.line||0,col:m.column||0,code:m.ruleId||'eslint',severity:m.severity||1})))}catch{}}
const tsRaw=sh('pnpm -w exec tsc --noEmit');if(tsRaw){tsRaw.split('\n').forEach(l=>{const m=l.match(/(.*\.ts\w*):(\d+):(\d+)\s*-\s*error\s+(\w+)/);if(m)items.push({source:'tsc',file:m[1],line:+m[2],col:+m[3],code:m[4],severity:2})});}
const out={time:new Date().toISOString(),totals:{eslint:items.filter(i=>i.source==='eslint').length,tsc:items.filter(i=>i.source==='tsc').length},items};
fs.writeFileSync(path.join(dir,'problems.json'),JSON.stringify(out,null,2));console.log('wrote reports/immune/problems.json');