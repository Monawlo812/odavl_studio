<<<<<<< HEAD
import { describe, it, expect } from 'vitest';
import { fixUnusedImports } from '../index.js';

describe('remove-unused-imports', () => {
  it('removes unused import lines', () => {
    expect(fixUnusedImports('import java.util.*;\nclass X {}')).not.toMatch(/import/);
  });
=======
import { fixUnusedImports } from '../index.js';
test('removes unused import lines', () => {
  expect(fixUnusedImports('import java.util.*;\nclass X {}')).not.toMatch(/import/);
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
});
