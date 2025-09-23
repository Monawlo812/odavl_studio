#!/usr/bin/env node
try {
  require('../dist/index.js');
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
}
