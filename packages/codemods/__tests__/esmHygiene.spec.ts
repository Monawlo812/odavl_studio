import { describe, it, expect } from 'vitest';
import { esmHygiene } from '../src/esmHygiene.js';

describe('esmHygiene', () => {
  it('removes require and module.exports', () => {
    const input = 'const x = require("foo"); module.exports = x;';
    const out = esmHygiene(input);
  // Accept both string and object, check string property if object
  const result = typeof out === 'string' ? out : (out && out.code ? out.code : '');
  expect(typeof result).toBe('string');
  expect(result).not.toMatch(/require|module\.exports/);
  });
});
