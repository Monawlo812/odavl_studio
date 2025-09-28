#!/usr/bin/env node
import {execSync} from'node:child_process';import fs from'node:fs';import path from'node:path';
const dir=path.join('reports','immune');fs.mkdirSync(dir,{recursive:true});
const sh=(c)=>{try{return String(execSync(c,{stdio:['ignore','pipe','pipe']}))}catch{return''}};
let map={};
const es=sh('pnpm -w exec eslint . -f json');
try {
	const arr = JSON.parse(es);
	arr.forEach(f => {
		if (!map[f.filePath]) map[f.filePath] = { eslint: 0, ts: 0 };
		map[f.filePath].eslint += f.errorCount || 0;
	});
} catch {}

const ts = sh('pnpm -w exec tsc --noEmit');
if (ts) {
	ts.split('\n').forEach(l => {
		const m = l.match(/(.*\.ts\w*):\d+:\d+ - error/);
		if (m) {
			const f = m[1];
			if (!map[f]) map[f] = { eslint: 0, ts: 0 };
			map[f].ts++;
		}
	});
}
const arr=Object.entries(map).map(([f,v])=>({file:f,eslint:v.eslint,ts:v.ts,total:v.eslint+v.ts})).sort((a,b)=>b.total-a.total);
fs.writeFileSync(path.join(dir,'heatmap.json'),JSON.stringify(arr,null,2));console.log('wrote heatmap.json with',arr.length,'entries');
