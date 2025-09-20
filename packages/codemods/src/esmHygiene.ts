import { readFileSync } from 'fs';
import { PatchSet, Patch } from './types.js';

/**
 * ESM Hygiene codemod: Ensures explicit ".js" extensions in ESM imports
 * - Transforms relative imports (./x -> ./x.js, ../x -> ../x.js)  
 * - Skips require() statements and protected paths
 * - Idempotent and safe textual transformations only
 * - Guards: maxLinesPerPatch=40, maxFilesTouched=10
 */
export async function esmHygiene(files: string[]): Promise<PatchSet> {
  const patches: Patch[] = [];
  const maxFilesTouched = 10;
  const maxLinesPerPatch = 40;
  
  // Guard: limit files processed
  const filesToProcess = files.slice(0, maxFilesTouched);
  
  for (const file of filesToProcess) {
    // Skip protected paths
    if (file.includes('/security/') || file.includes('.spec.') || file.includes('/public-api/')) {
      continue;
    }
    
    try {
      const content = readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      // Guard: limit lines per file
      if (lines.length > maxLinesPerPatch) {
        continue;
      }
      
      let hasChanges = false;
      const newLines = lines.map(line => {
        // Skip require() statements
        if (line.includes('require(')) {
          return line;
        }
        
        // Transform ESM imports: add .js extension to relative paths
        const importMatch = line.match(/^(\s*import\s+.*?\s+from\s+['"])(\.\.?\/[^'"]*?)(['"])/);
        if (importMatch && !importMatch[2].endsWith('.js')) {
          hasChanges = true;
          return `${importMatch[1]}${importMatch[2]}.js${importMatch[3]}`;
        }
        
        return line;
      });
      
      if (hasChanges) {
        const newContent = newLines.join('\n');
        const diff = `--- ${file}\n+++ ${file}\n${generateDiff(content, newContent)}`;
        
        patches.push({
          file,
          diff,
          added: newLines.length - lines.length,
          removed: 0
        });
      }
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }
  
  return {
    patches,
    totalChanges: patches.length
  };
}

function generateDiff(oldContent: string, newContent: string): string {
  // Simple diff generation (placeholder)
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  
  let diff = '';
  for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
    if (oldLines[i] !== newLines[i]) {
      if (oldLines[i]) diff += `-${oldLines[i]}\n`;
      if (newLines[i]) diff += `+${newLines[i]}\n`;
    }
  }
  
  return diff;
}