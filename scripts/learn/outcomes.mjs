#!/usr/bin/env node
// Compute outcome stats for codemod recipes
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
const day = new Date().toISOString().slice(0,10);
const reports = ['osv.json', 'gitleaks.json', 'bundle.log'];
const out = { date: day, recipes: {} };
for (const file of reports) {
  try {
    const data = readFileSync('reports/' + file, 'utf8');
    if (file.endsWith('.json')) {
      const j = JSON.parse(data); out.recipes[file] = j;
    } else {
      out.recipes[file] = data;
    }
  } catch {}
}
mkdirSync('reports/learn', { recursive: true });
writeFileSync(`reports/learn/outcomes-${day}.json`, JSON.stringify(out, null, 2));
console.log('Learned outcomes:', out);
