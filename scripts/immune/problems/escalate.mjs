#!/usr/bin/env node
import fs from'node:fs';import path from'node:path';
const d=path.join('reports','immune');fs.mkdirSync(path.join(d,'escalate'),{recursive:true});
const p=JSON.parse(fs.readFileSync(path.join(d,'problems.json'),'utf8'));const top=p.items.slice(0,20).map(i=>`- ${i.source} ${i.file}:${i.line}:${i.col} ${i.code}`);
fs.writeFileSync(path.join(d,'problems-escalate.md'),['# Problems Escalation','Triggered by Problems-Pro','## Top findings',...top].join('\n'));
console.log('escalation summary ready at reports/immune/problems-escalate.md');