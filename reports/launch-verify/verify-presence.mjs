#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const checks = [
  // L-1: Release workflow
  { step: 'L-1', file: '.github/workflows/release.yml', type: 'exists' },
  { step: 'L-1', file: 'RELEASE.md', type: 'exists' },
  
  // L-2: CLI publish prep
  { step: 'L-2', file: 'apps/cli/package.json', type: 'json', keys: ['bin.odavl', 'files', 'engines.node', 'scripts.prepublishOnly'] },
  { step: 'L-2', file: 'apps/cli/README.md', type: 'exists' },
  
  // L-3: VS Code marketplace prep
  { step: 'L-3', file: 'apps/vscode-ext/package.json', type: 'json', keys: ['displayName', 'categories', 'galleryBanner', 'icon'] },
  { step: 'L-3', file: 'apps/vscode-ext/assets/icon.png', type: 'exists' },
  { step: 'L-3', file: 'apps/vscode-ext/README.md', type: 'exists' },
  
  // L-4: GitHub App manifest & guide
  { step: 'L-4', file: 'infra/github-app/manifest.json', type: 'json', keys: ['default_permissions'] },
  { step: 'L-4', file: 'docs/github-app-setup.md', type: 'exists' },
  
  // L-5: Docker runner
  { step: 'L-5', file: 'Dockerfile', type: 'exists' },
  { step: 'L-5', file: 'docs/docker.md', type: 'exists' },
  
  // L-6: Docs site via GitHub Pages
  { step: 'L-6', file: 'docs/index.md', type: 'exists' },
  { step: 'L-6', file: '.github/workflows/pages.yml', type: 'exists' },
  { step: 'L-6', file: 'docs/.nojekyll', type: 'exists' },
  
  // L-7: Weekly telemetry summary
  { step: 'L-7', file: 'scripts/weekly-report.mjs', type: 'exists' },
  { step: 'L-7', file: 'package.json', type: 'json', keys: ['scripts.weekly'] },
  
  // L-8: Partner onboarding templates
  { step: 'L-8', file: '.github/ISSUE_TEMPLATE/onboarding.md', type: 'exists' },
  { step: 'L-8', file: 'SUPPORT.md', type: 'exists' },
  { step: 'L-8', file: 'README.md', type: 'content', pattern: 'Support.*Onboarding' },
  
  // L-9: Security & community docs
  { step: 'L-9', file: 'SECURITY.md', type: 'exists' },
  { step: 'L-9', file: 'CONTRIBUTING.md', type: 'exists' },
  { step: 'L-9', file: 'CODE_OF_CONDUCT.md', type: 'exists' },
  
  // L-10: Release playbook
  { step: 'L-10', file: 'docs/release-playbook.md', type: 'exists' }
];

function checkFile(check) {
  try {
    const filePath = check.file;
    
    if (!existsSync(filePath)) {
      return { ...check, exists: false, notes: 'File does not exist' };
    }
    
    if (check.type === 'exists') {
      return { ...check, exists: true, notes: 'File exists' };
    }
    
    const content = readFileSync(filePath, 'utf8');
    
    if (check.type === 'json') {
      try {
        const data = JSON.parse(content);
        const missingKeys = [];
        
        for (const keyPath of check.keys) {
          const keys = keyPath.split('.');
          let current = data;
          let found = true;
          
          for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
              current = current[key];
            } else {
              found = false;
              break;
            }
          }
          
          if (!found) {
            missingKeys.push(keyPath);
          }
        }
        
        if (missingKeys.length > 0) {
          return { ...check, exists: true, notes: `Missing keys: ${missingKeys.join(', ')}` };
        }
        
        return { ...check, exists: true, notes: 'All required keys present' };
      } catch (err) {
        return { ...check, exists: true, notes: `Invalid JSON: ${err.message}` };
      }
    }
    
    if (check.type === 'content') {
      const regex = new RegExp(check.pattern, 'i');
      const found = regex.test(content);
      return { 
        ...check, 
        exists: true, 
        notes: found ? `Pattern '${check.pattern}' found` : `Pattern '${check.pattern}' not found` 
      };
    }
    
    return { ...check, exists: true, notes: 'File exists and readable' };
    
  } catch (err) {
    return { ...check, exists: false, notes: `Error: ${err.message}` };
  }
}

// Run all checks
const results = checks.map(checkFile);

// Write JSON results
writeFileSync(
  'reports/launch-verify/presence.json',
  JSON.stringify(results, null, 2)
);

// Generate markdown table
const mdLines = [
  '# Launch Verification - File Presence Check',
  '',
  '| Step | File | Status | Notes |',
  '|------|------|--------|-------|'
];

for (const result of results) {
  const status = result.exists && !result.notes.includes('Missing') && !result.notes.includes('not found') ? '✅' : '❌';
  mdLines.push(`| ${result.step} | ${result.file} | ${status} | ${result.notes} |`);
}

writeFileSync(
  'reports/launch-verify/presence.md',
  mdLines.join('\n')
);

console.log(`Verification complete. Checked ${results.length} items.`);
console.log(`Results: ${results.filter(r => r.exists).length} exist, ${results.filter(r => !r.exists).length} missing`);