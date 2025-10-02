import { describe, it, expect } from 'vitest';
import { enforceRbac } from '../src/rbac.js';

describe('RBAC enforcement', () => {
  it('allows admin for any action', () => {
    expect(enforceRbac('scan.run', 'admin')).toBe(true);
  });
  it('denies non-admin by default', () => {
    expect(enforceRbac('scan.run', 'runner')).toBe(false);
  });
});
