import { execJson } from './shell';
export type PyScan = { ruff?: number; tests?: { failures?: number }; vulns?: number; note: string };
export async function scan(): Promise<PyScan> {
  let ruff: number | undefined = undefined;
  let ruffNote = '';
  // Try ruff
  const ruffRes = execJson(['ruff', '--output-format=json', '.']);
  if (ruffRes.ok) {
    try {
      const parsed = JSON.parse(ruffRes.stdout);
      ruff = Array.isArray(parsed) ? parsed.length : undefined;
    } catch { ruff = undefined; ruffNote = 'ruff output parse error'; }
  } else {
    // Try flake8 as fallback
    const flake = execJson(['flake8', '.']);
    if (flake.ok) {
      ruff = flake.stdout.split('\n').filter(Boolean).length;
      ruffNote = 'ruff missing, used flake8';
    } else {
      ruff = undefined;
      ruffNote = 'ruff/flake8 missing';
    }
  }
  // Pytest
  let failures: number | undefined = undefined;
  let testNote = '';
  const pyRes = execJson(['pytest', '-q', '--maxfail=1']);
  if (pyRes.ok) {
    failures = 0;
  } else if (pyRes.code !== 1 && pyRes.stderr.includes('not found')) {
    failures = undefined;
    testNote = 'pytest missing';
  } else {
    failures = 1;
    if (pyRes.stdout.includes('no tests ran')) failures = 0;
  }
  // pip-audit
  let vulns: number | undefined = undefined;
  let vulnNote = '';
  const paRes = execJson(['pip-audit', '-f', 'json']);
  if (paRes.ok) {
    try {
      const parsed = JSON.parse(paRes.stdout);
      vulns = Array.isArray(parsed) ? parsed.length : undefined;
    } catch { vulns = undefined; vulnNote = 'pip-audit output parse error'; }
  } else {
    vulns = undefined;
    vulnNote = 'pip-audit missing';
  }
  let notes = [ruffNote, testNote, vulnNote].filter(Boolean).join('; ');
  return { ruff, tests: { failures }, vulns, note: 'python.scan ok' + (notes ? ' | ' + notes : '') };
}
export type PyHealResult = {
  dryRun: boolean;
  changes?: { files: number; lines: number };
  actions?: {
    unusedImports?: { files: number; lines: number; note?: string };
    format?: { files: number; lines: number; note?: string };
    deps?: { candidates: number; note?: string };
  };
  guards?: { maxFiles: number; maxLines: number; guardHit: boolean };
  note: string;
};
export async function heal(opts: { dryRun?: boolean; maxFiles?: number; maxLines?: number } = {}): Promise<PyHealResult> {
  const dryRun = opts.dryRun !== false;
  const maxFiles = typeof opts.maxFiles === 'number' ? opts.maxFiles : 10;
  const maxLines = typeof opts.maxLines === 'number' ? opts.maxLines : 40;
  let notes: string[] = [];
  // A) Ruff unused imports
  let unusedFiles = 0, unusedLines = 0, unusedNote = '';
  const ruff = execJson(['ruff', '--fix-dry-run', '--exit-zero-even-if-changed', '.']);
  if (ruff.ok) {
    const lines = ruff.stdout.split('\n');
    unusedFiles = lines.filter(l => /would fix|Fixed/.test(l)).length;
    unusedLines = unusedFiles; // Approximate: 1 line per file
    if (unusedFiles === 0 && ruff.stdout && ruff.stdout.includes('No changes')) unusedNote = 'no unused imports';
  } else {
    unusedNote = 'ruff missing';
    notes.push('ruff missing');
  }
  // B) Black format check
  let fmtFiles = 0, fmtLines = 0, fmtNote = '';
  const black = execJson(['black', '--check', '.']);
  if (!black.ok) {
    // Try to estimate files needing format
    const match = black.stdout.match(/would reformat (.+)/g);
    fmtFiles = match ? match.length : 1;
    fmtNote = 'format needed';
  }
  // C) pip list outdated
  let depCandidates = 0, depNote = '';
  const pip = execJson(['pip', 'list', '--outdated', '--format=json']);
  if (pip.ok) {
    try {
      const parsed = JSON.parse(pip.stdout);
      depCandidates = Array.isArray(parsed) ? parsed.length : 0;
    } catch { depNote = 'pip list parse error'; }
  } else {
    depNote = 'pip missing';
    notes.push('pip missing');
  }
  // Guard logic
  const totalFiles = unusedFiles + fmtFiles + depCandidates;
  const totalLines = unusedLines + fmtLines;
  const guardHit = totalFiles > maxFiles || totalLines > maxLines;
  let guardNote = '';
  if (guardHit) guardNote = 'guard hit: would split into waves';
  // Compose result
  return {
    dryRun: true,
    changes: { files: totalFiles, lines: totalLines },
    actions: {
      unusedImports: { files: unusedFiles, lines: unusedLines, note: unusedNote },
      format: { files: fmtFiles, lines: fmtLines, note: fmtNote },
      deps: { candidates: depCandidates, note: depNote }
    },
    guards: { maxFiles, maxLines, guardHit },
    note: [notes.join('; '), guardNote].filter(Boolean).join(' | ') || 'python.heal dry-run ok'
  };
}
