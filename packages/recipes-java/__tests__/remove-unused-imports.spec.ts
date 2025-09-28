import { fixUnusedImports } from '../index.js';
test('removes unused import lines', () => {
  expect(fixUnusedImports('import java.util.*;\nclass X {}')).not.toMatch(/import/);
});
