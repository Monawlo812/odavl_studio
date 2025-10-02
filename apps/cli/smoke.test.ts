import { execSync } from 'child_process';
import { describe, it, expect } from 'vitest';

describe('CLI smoke test', () => {
  it('odavl --help exits 0', () => {
    const result = execSync('node ./bin/odavl.js --help', { encoding: 'utf-8' });
    expect(result).toMatch(/odavl/i);
  });
});