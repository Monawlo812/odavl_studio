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
});
