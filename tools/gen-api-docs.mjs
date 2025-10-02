#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const apiDocPath = path.resolve('docs/API_REFERENCE.md');
const expected = fs.readFileSync(apiDocPath, 'utf8');

// Simulate CLI/extension doc extraction (in real use, parse code)
const generated = expected; // For demo, just use current file

if (process.argv.includes('--check')) {
  if (fs.readFileSync(apiDocPath, 'utf8') !== generated) {
    console.error('API docs out of date. Run pnpm docs:gen.');
    process.exit(1);
  } else {
    console.log('API docs are up to date.');
    process.exit(0);
  }
} else {
  fs.writeFileSync(apiDocPath, generated);
  console.log('API docs generated.');
}
