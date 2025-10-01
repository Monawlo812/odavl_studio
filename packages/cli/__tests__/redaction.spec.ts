<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
describe('baseline', () => {
	it('always passes', () => {
		expect(true).toBe(true);
	});
=======
import { describe, it, expect } from 'vitest';
import { redact } from '../src/lib/redaction.js';

=======
import { redact } from '../src/lib/redaction.js';
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
import { describe, it, expect } from 'vitest';
import { redact } from '../src/lib/redaction.js';

>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
describe('redact', () => {
  it('redacts AWS, Slack, GitHub, and generic secrets', () => {
    const input = 'AKIA1234567890ABCD xoxb-1234567890-ghp_abcdefghijklmnopqrstuvwxyz123456 secret=foo';
    const out = redact(input);
<<<<<<< HEAD
<<<<<<< HEAD
  expect(out).not.toMatch(/secret=foo/);
  expect(out).toMatch(/\*\*\*REDACTED\*\*\*/);
  });
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
=======
    expect(out).not.toMatch(/AKIA|xoxb|ghp_|secret=foo/);
    expect(out).toMatch(/\*\*\*REDACTED\*\*\*/);
=======
  expect(out).not.toMatch(/secret=foo/);
  expect(out).toMatch(/\*\*\*REDACTED\*\*\*/);
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
  });
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
});
