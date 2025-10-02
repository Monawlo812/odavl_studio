#!/usr/bin/env node
try {
  require('../dist/index.js');
} catch (e) {
  console.error(e);
  console.error(e);
  process.exit(1);
}
