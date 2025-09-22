#!/usr/bin/env node
const { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync } = require("node:fs");
const { extname, join } = require("node:path");

const isJS = f => [".js",".ts"].includes(extname(f));
const protectedRx = /(\/security\/|\.spec\.[jt]s$|\/public-api\/)/;
const allowlistPath = "reports/w5/mutation-allowlist.txt";
const list = readdirSync(".").filter(isJS).filter(f => !protectedRx.test(f));

const allow = new Set((existsSync(allowlistPath)?readFileSync(allowlistPath,"utf-8").split(/\r?\n/):[]).filter(Boolean));
const selected = [];
for (const f of list) {
try {
 const s = readFileSync(f,"utf-8");
 const marker = s.slice(0, 2000).includes("/** @mutation */");
 if (marker || allow.has(f)) selected.push({ file:f, src:s });
} catch {}
}

const ops = /(===|!==|==|!=|>=|<=|&&|\|\||>|<|\+|-)/g;
let totalSites = 0;
const files = selected.map(({file,src}) => {
const m = src.match(ops);
const sites = m ? m.length : 0;
totalSites += sites;
return { file, sites };
});
const out = { files, totalSites, coveredFiles: files.length, score: files.length ? Math.floor(totalSites/files.length) : 0, note:"preview-only (no test execution)" };
mkdirSync("reports/w5", { recursive:true });
writeFileSync("reports/w5/mutation-preview.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
process.exit(0);
