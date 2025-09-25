import * as fs from 'fs';
import * as path from 'path';
export async function listEvidence() {
  const dir = 'reports';
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => /attestation|bundle|osv|gitleaks/.test(f));
  return files.map(f => ({
    path: path.join(dir, f),
    type: f.split('.').pop() || '',
    mtime: fs.statSync(path.join(dir, f)).mtimeMs
  }));
}
