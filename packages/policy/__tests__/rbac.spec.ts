<<<<<<< HEAD
<<<<<<< HEAD
import { describe, it, expect } from 'vitest';
import { enforceRbac } from '../src/rbac.js';

=======
import { enforceRbac } from '../src/rbac.js';
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
import { describe, it, expect } from 'vitest';
import { enforceRbac } from '../src/rbac.js';

>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
describe('RBAC enforcement', () => {
  it('allows admin for any action', () => {
    expect(enforceRbac('scan.run', 'admin')).toBe(true);
  });
  it('denies non-admin by default', () => {
    expect(enforceRbac('scan.run', 'runner')).toBe(false);
  });
});
