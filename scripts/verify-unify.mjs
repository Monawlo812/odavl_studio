import fs from 'fs'; import path from 'path';
const args = process.argv.slice(2);
let jsFile = '', pyFile = '';
for (let i = 0; i < args.length; ++i) {
  if (args[i] === '--js' && args[i+1]) jsFile = args[++i];
  else if (args[i] === '--py' && args[i+1]) pyFile = args[++i];
}
function safeReadJson(f) {
  try { return f && fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : undefined; } catch { return undefined; }
}
const js = safeReadJson(jsFile), py = safeReadJson(pyFile);
const packs = {};
if (js) packs.js = js;
if (py) packs.python = py;
const ts = new Date().toISOString();
let note = '';
if (js && py) note = 'merged 2/2 packs';
else if (js) note = 'merged 1/2 packs (python missing)';
else if (py) note = 'merged 1/2 packs (js missing)';
else note = 'no packs found';
const out = { ok: !!(js||py), note, packs, ts };
const outDir = path.join(process.cwd(), 'reports');
fs.mkdirSync(outDir, { recursive:true });
fs.writeFileSync(path.join(outDir, `verify-${ts.replace(/[:.]/g,'-')}.json`), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
