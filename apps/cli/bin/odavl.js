#!/usr/bin/env node
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 79b66b0 (fix: remove broken submodule reference for CI security jobs)
(async () => {
  try {
    await import('../../../packages/cli/dist/index.js');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
<<<<<<< HEAD
=======
try {
  require('../dist/index.js');
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
}
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
>>>>>>> 79b66b0 (fix: remove broken submodule reference for CI security jobs)
