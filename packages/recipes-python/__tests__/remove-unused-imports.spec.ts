<<<<<<< HEAD
<<<<<<< HEAD
import { describe, it, expect } from 'vitest';
import { fixUnusedImports } from '../index.js';

describe('remove-unused-imports', () => {
  it('removes unused import lines', () => {
    expect(fixUnusedImports('import os\nprint(1)')).not.toMatch(/import/);
  });
=======
import { fixUnusedImports } from '../index.js';
test('removes unused import lines', () => {
  expect(fixUnusedImports('import os\nprint(1)')).not.toMatch(/import/);
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
import { describe, it, expect } from 'vitest';
import { fixUnusedImports } from '../index.js';

describe('remove-unused-imports', () => {
  it('removes unused import lines', () => {
    expect(fixUnusedImports('import os\nprint(1)')).not.toMatch(/import/);
  });
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
});
