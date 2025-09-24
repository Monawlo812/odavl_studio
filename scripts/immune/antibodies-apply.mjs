#!/usr/bin/env node
import fs from'node:fs';import path from'node:path';
const argId=(process.argv.find(a=>a.startsWith('--id='))||'').split('=')[1]||null;
const dry=process.argv.includes('--dry');const dir=path.join(process.cwd(),'antibodies');
const f=argId?path.join(dir,argId+'.json'):null; if(!f||!fs.existsSync(f)){console.error('antibody-not-found');process.exit(2)}
const ab=JSON.parse(fs.readFileSync(f,'utf8'));
const plan={kind:'antibodies-apply',time:new Date().toISOString(),id:ab.id,rule:ab.context?.rule,filePattern:ab.context?.filePattern,dry};
const out=path.join(process.cwd(),'reports','immune');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'antibodies-apply.json'),JSON.stringify(plan,null,2));console.log('planned apply for',ab.id,'(dry)');
