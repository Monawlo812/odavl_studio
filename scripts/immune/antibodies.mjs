#!/usr/bin/env node
import fs from'node:fs';import path from'node:path';
const cmd=process.argv[2]||'suggest';const argRule=(process.argv.find(a=>a.startsWith('--rule='))||'').split('=')[1]||null;
const root=process.cwd(),dir=path.join(root,'antibodies');const outDir=path.join(root,'reports','immune');fs.mkdirSync(outDir,{recursive:true});
const list=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')):[];
const items=list.map(f=>{try{return JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'))}catch{return null}}).filter(Boolean);
const pick=(a)=>{const s=(a.successCount||0),f=(a.failureCount||0),rate=s/((s+f)||1);return{ id:a.id,rule:a.context?.rule||null,filePattern:a.context?.filePattern||null,successCount:s,failureCount:f,score:+(rate.toFixed(3)) }};
if(cmd==='suggest'){
  let arr=items.map(pick); if(argRule) arr=arr.filter(x=>x.rule===argRule);
  arr.sort((x,y)=>y.score-x.score||y.successCount-x.successCount);
  const report={kind:'antibodies-suggest',time:new Date().toISOString(),count:arr.length,items:arr.slice(0,20)};
  fs.writeFileSync(path.join(outDir,'antibodies-suggest.json'),JSON.stringify(report,null,2)); 
  console.log('wrote reports/immune/antibodies-suggest.json'); process.exit(0);
}
console.error('unknown subcommand');process.exit(1);
