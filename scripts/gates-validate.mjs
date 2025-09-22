import fs from 'fs'; import path from 'path';
const ts = new Date().toISOString().replace(/[:.]/g,'-');
const outDir = path.join(process.cwd(), 'reports'); fs.mkdirSync(outDir, { recursive:true });
const out = { ok:true, note:'', packs:{} };
try {
  const p = path.join(process.cwd(), '.odavl', 'gates.polyglot.json');
  const raw = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  if (!raw) { out.ok = true; out.note = 'polyglot JSON not found; using legacy gates only'; }
  else {
    const j = JSON.parse(raw);
    const norm = o => o && typeof o==='object' ? o : undefined;
    out.packs.js = norm(j.js);
    out.packs.python = norm(j.python);
    out.note = 'polyglot gates loaded';
  }
} catch (e) { out.ok = false; out.note = 'parse error: '+String(e.message||e); }
fs.writeFileSync(path.join(outDir, `gates-validate-${ts}.json`), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
