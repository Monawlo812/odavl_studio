import { describe, it, expect } from 'vitest';
import { redactLine } from '../src/redacting-writer.js';

describe('redacting-writer', () => {
  it('redacts secrets in a line', () => {
    const input = 'token=abcd1234';
    const out = redactLine(input);
    expect(out).not.toMatch(/abcd1234/);
  });
});
