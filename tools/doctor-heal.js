#!/usr/bin/env node
// tools/doctor-heal.js
// Fallback heal script for CI Doctor
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../reports/doctor');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'heal.log');
fs.writeFileSync(outFile, '# fallback heal run\n', { flag: 'a' });
console.log('Fallback heal complete.');
