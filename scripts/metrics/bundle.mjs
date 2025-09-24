/* Simple bundle metric with growth gate (≤3%) */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

const reportsDir = 'reports';
const logFile = `${reportsDir}/bundle.log`;
mkdirSync(reportsDir, { recursive: true });

function kbOf(path) {
  try {
    // Prefer dist/build size if exists; else fallback to repo tracked files size
    const cmd = existsSync('dist') ? "du -sk dist | cut -f1"
      : existsSync('build') ? "du -sk build | cut -f1"
      : "git ls-files | xargs -I{} du -k {} 2>/dev/null | awk '{s+=$1} END {print s}'";
    return parseInt(execSync(cmd, { stdio: ['ignore','pipe','ignore'], shell: true }).toString().trim(), 10) || 0;
  } catch { return 0; }
}

const now = new Date().toISOString();
const sizeKb = kbOf('.');
const line = `${now},${sizeKb}\n`;

let prevKb = null;
if (existsSync(logFile)) {
  const last = readFileSync(logFile, 'utf8').trim().split('\n').pop();
  if (last) prevKb = parseInt(last.split(',')[1], 10);
}

writeFileSync(logFile, (existsSync(logFile) ? readFileSync(logFile) : '') + line);

if (prevKb != null && prevKb > 0) {
  const growth = ((sizeKb - prevKb) / prevKb) * 100;
  console.log(`Bundle size: prev=${prevKb}KB, now=${sizeKb}KB, growth=${growth.toFixed(2)}%`);
  if (growth > 3) {
    console.error('Bundle growth gate failed (>3%)');
    process.exit(3);
  }
} else {
  console.log(`Bundle baseline created: now=${sizeKb}KB`);
}
