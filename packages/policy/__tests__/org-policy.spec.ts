<<<<<<< HEAD
<<<<<<< HEAD
import { describe, it, expect } from 'vitest';
import { validateOrgPolicy } from '../src/org-policy.js';

describe('Org Policy', () => {
  it('detects conflicting org policy', () => {
    const a = { governor: { prsPerDay: 5, ciMinutesPerHour: 60 } };
    const b = { governor: { prsPerDay: 3, ciMinutesPerHour: 60 } };
    const res = validateOrgPolicy([a, b]);
    expect(res.ok).toBe(false);
    expect(res.errors).toContain('Conflicting prsPerDay across repos');
  });
=======
import { validateOrgPolicy } from '../src/org-policy.js';
test('detects conflicting org policy', () => {
  const a = { governor: { prsPerDay: 5, ciMinutesPerHour: 60 } };
  const b = { governor: { prsPerDay: 3, ciMinutesPerHour: 60 } };
  const res = validateOrgPolicy([a, b]);
  expect(res.ok).toBe(false);
  expect(res.errors).toContain('Conflicting prsPerDay across repos');
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
import { describe, it, expect } from 'vitest';
import { validateOrgPolicy } from '../src/org-policy.js';

describe('Org Policy', () => {
  it('detects conflicting org policy', () => {
    const a = { governor: { prsPerDay: 5, ciMinutesPerHour: 60 } };
    const b = { governor: { prsPerDay: 3, ciMinutesPerHour: 60 } };
    const res = validateOrgPolicy([a, b]);
    expect(res.ok).toBe(false);
    expect(res.errors).toContain('Conflicting prsPerDay across repos');
  });
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
});
