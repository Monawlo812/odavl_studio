<<<<<<< HEAD
import { describe, it, expect } from 'vitest';
import { fixGofmt } from '../index.js';

describe('gofmt', () => {
  it('trims whitespace', () => {
    expect(fixGofmt('package main  \n')).toBe('package main');
  });
=======
import { fixGofmt } from '../index.js';
test('gofmt trims whitespace', () => {
  expect(fixGofmt('package main  \n')).toBe('package main');
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
});
