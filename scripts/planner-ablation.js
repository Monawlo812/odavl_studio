#!/usr/bin/env node
const { mkdirSync, writeFileSync } = require("node:fs");
function sortBaseline(arr){ return [...arr].sort((a,b)=>(b.score-b.risk+(b.recipeTrust||0))-(a.score-a.risk+(a.recipeTrust||0))); }
function compute(i){ const base=Math.min(15,Math.max(5,i.base??10)); const k1=5,k2=8,k3=1,k4=3; const raw=base+k1*(i.coveragePct||0)-k2*(i.flakeRate||0)-k3*(i.rollbacks30d||0)-k4*(i.repoSizeFactor||0); return Math.min(25,Math.max(5,Math.round(raw))); }
function sortV2(arr,ctx){ const t=compute(ctx); return [...arr].sort((a,b)=>((b.score-b.risk+(b.recipeTrust||0))+0.1*t)-((a.score-a.risk+(a.recipeTrust||0))+0.1*t)); }
const items=[ {id:"a",score:8,risk:2,recipeTrust:1}, {id:"b",score:7,risk:1,recipeTrust:0}, {id:"c",score:6,risk:3,recipeTrust:2} ];
const ctx={ coveragePct:0.75, flakeRate:0.05, rollbacks30d:0, repoSizeFactor:0.3, base:10 };
const before=sortBaseline(items).map(x=>x.id); const after=sortV2(items,ctx).map(x=>x.id);
mkdirSync("reports/w5",{recursive:true});
writeFileSync("reports/w5/planner-ablation.json", JSON.stringify({ input:{items,ctx}, beforeOrder:before, afterOrder:after, tokens: compute(ctx) }, null, 2));
console.log("reports/w5/planner-ablation.json written");
