// Java recipe pack scaffold
export function detectUnusedImports(java: string): boolean {
  return /import\s+\w+/.test(java);
}
export function fixUnusedImports(java: string): string {
  return java.replace(/^import\s+\w+.*$/gm, '');
}
