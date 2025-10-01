// CLI: odavl demo
/* global process, console */
import { execSync } from 'child_process';
import { enforceRbac } from '@odavl/policy';
const USER_ROLE = process.env.ODAVL_ROLE || 'admin';

export function runDemo() {
  if (!enforceRbac('scan.run', USER_ROLE)) {
    console.error('RBAC: You are not authorized to run scan.');
    process.exit(1);
  }
  try {
    console.log('Running demo smoke on examples/demo...');
    execSync('node ../../dist/index.js scan examples/demo', { stdio: 'inherit' });
    execSync('node ../../dist/index.js heal --dry-run examples/demo', { stdio: 'inherit' });
    execSync('node ../../dist/index.js branch examples/demo', { stdio: 'inherit' });
    execSync('node ../../dist/index.js shadow verify examples/demo', { stdio: 'inherit' });
    execSync('node ../../dist/index.js pr --explain examples/demo', { stdio: 'inherit' });
    console.log('Demo completed.');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Demo failed or not fully configured:', err.message);
    } else {
      console.error('Demo failed or not fully configured:', err);
    }
    process.exit(1);
  }
}
