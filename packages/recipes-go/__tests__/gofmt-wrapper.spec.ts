<<<<<<< HEAD
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
=======
import { describe, it, expect } from 'vitest';
import { fixGofmt } from '../index.js';

describe('gofmt', () => {
  it('trims whitespace', () => {
    expect(fixGofmt('package main  \n')).toBe('package main');
  });
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
});
