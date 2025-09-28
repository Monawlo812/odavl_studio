#!/usr/bin/env node
<<<<<<< HEAD
(async () => {
  try {
    await import('../../../packages/cli/dist/index.js');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
=======
try {
  require('../dist/index.js');
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
}
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
