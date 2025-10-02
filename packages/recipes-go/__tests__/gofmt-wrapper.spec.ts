import { describe, it, expect } from 'vitest';
import { fixGofmt } from '../index.js';

describe('gofmt', () => {
  it('trims whitespace', () => {
    expect(fixGofmt('package main  \n')).toBe('package main');
  });
});
