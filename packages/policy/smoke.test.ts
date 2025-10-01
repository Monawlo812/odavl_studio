import { describe, it, expect } from 'vitest';
import { readGovernorConfig } from './src/governor.js';

describe('Policy/Core smoke test', () => {
  it('loads a basic policy file', () => {
    const cfg = readGovernorConfig('./../../odavl.policy.yml.sample');
    expect(cfg).toHaveProperty('prsPerDay');
  });
});