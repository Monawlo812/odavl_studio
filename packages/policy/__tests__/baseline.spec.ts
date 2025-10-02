import { describe, it, expect } from 'vitest';
import * as governor from '../src/governor';
import * as orgPolicy from '../src/org-policy';
import * as rbac from '../src/rbac';

describe('governor', () => {
  it('should have a default export', () => {
    expect(governor).toBeDefined();
  });
});

describe('orgPolicy', () => {
  it('should have a default export', () => {
    expect(orgPolicy).toBeDefined();
  });
});

describe('rbac', () => {
  it('should have a default export', () => {
    expect(rbac).toBeDefined();
  });
});
