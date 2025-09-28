<<<<<<< HEAD
/* eslint-env node */
/* global process, console */
// CLI: odavl demo
/* global process, console */
import { execSync } from 'child_process';
<<<<<<< HEAD
import { enforceRbac } from '@odavl/policy/src/rbac.js';
import type { RbacRole } from '../../../../packages/policy/src/rbac.schema.js';
const USER_ROLE = (process.env.ODAVL_ROLE || 'admin') as RbacRole;
=======
import { enforceRbac } from '@odavl/policy';
const USER_ROLE = process.env.ODAVL_ROLE || 'admin';
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
=======
// CLI: odavl demo
import { execSync } from 'child_process';
import { enforceRbac, type RbacRole } from '@odavl/policy';
const USER_ROLE = (process.env.ODAVL_ROLE || 'admin') as RbacRole;
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)

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
