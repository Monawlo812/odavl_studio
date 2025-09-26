// tools/doctor-heal.js
// Always create reports/doctor/patch.diff; if no changes, write "# no-op".
const fs = require('fs');
const path = require('path');
const outDir = path.resolve(__dirname, '../reports/doctor');
const patchFile = path.join(outDir, 'patch.diff');
fs.mkdirSync(outDir, { recursive: true });
let patch = '';
// Simulate patch generation logic (stub: always no-op)
patch = '# no-op\n';
fs.writeFileSync(patchFile, patch);
console.log('Wrote patch:', patchFile);
