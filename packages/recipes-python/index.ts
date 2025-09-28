// Python recipe pack scaffold
export function detectUnusedImports(py: string): boolean {
  return /import\s+\w+/.test(py);
}
export function fixUnusedImports(py: string): string {
  return py.replace(/^import\s+\w+.*$/gm, '');
}
