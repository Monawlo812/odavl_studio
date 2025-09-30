#!/usr/bin/env node
(async () => {
  try {
    await import('../../../packages/cli/dist/index.js');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
