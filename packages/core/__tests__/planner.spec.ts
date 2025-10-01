import { describe, it, expect } from 'vitest';
import * as tokens from '../planner/tokens';
import * as sort from '../planner/sort';

describe('tokens', () => {
  it('should tokenize a simple string', () => {
    const result = tokens.tokenize('foo bar');
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('sort', () => {
  it('should sort an array of numbers', () => {
    const arr = [3, 1, 2];
    const sorted = sort.sort(arr);
    expect(sorted).toEqual([1, 2, 3]);
  });
});
