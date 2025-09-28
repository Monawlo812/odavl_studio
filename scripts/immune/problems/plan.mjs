#!/usr/bin/env node
import fs from'node:fs';import path from'node:path';
const dir=path.join('reports','immune'),P=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const prob=P(path.join(dir,'problems.json'));let plan='noop',targets=[],reasons=[];
const es=prob.items.filter(i=>i.source==='eslint');const ts=prob.items.filter(i=>i.source==='tsc');
if(es.length>0){plan='eslint';const byFile={};es.forEach(i=>byFile[i.file]=(byFile[i.file]||0)+1);targets=Object.entries(byFile).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([f])=>f);reasons.push('eslint errors>0');}
else if(ts.length>0){plan='escalate';reasons.push('tsc errors>0');}
else {try{const snap=P(path.join(dir,'health-snapshot.json'));const d=(snap.deps||{});if((d.outdatedPatch||0)+(d.outdatedMinor||0)>0){plan='deps-dry';reasons.push('deps outdated>0');}}catch{}}
const out={time:new Date().toISOString(),plan,targets,reasons};fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'problems-plan.json'),JSON.stringify(out,null,2));console.log('plan:',plan,'targets:',targets.length);