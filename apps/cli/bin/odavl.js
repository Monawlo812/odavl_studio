#!/usr/bin/env node
try {
  require('../dist/index.js');
} catch (e) {
  console.log('ODAVL CLI: build missing. Run `pnpm build` or see README.');
  process.exit(0);
}
