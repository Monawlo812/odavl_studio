import { fixUnusedImports } from '../index.js';
test('removes unused import lines', () => {
  expect(fixUnusedImports('import os\nprint(1)')).not.toMatch(/import/);
});
