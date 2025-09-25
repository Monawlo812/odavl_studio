/* Simple bundle metric with growth gate (≤3%) */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

const reportsDir = 'reports';
const logFile = `${reportsDir}/bundle.log`;
mkdirSync(reportsDir, { recursive: true });

function kbOf(path) {
  try {
    let cmd;
    if (existsSync('dist')) {
      cmd = "du -sk dist | cut -f1";
    } else if (existsSync('build')) {
      cmd = "du -sk build | cut -f1";
    } else {
      cmd = "git ls-files | xargs -I{} du -k {} 2>/dev/null | awk '{s+=$1} END {print s}'";
    }
    const result = execSync(cmd, { stdio: ['ignore','pipe','ignore'], shell: true }).toString().trim();
    return parseInt(result, 10) || 0;
  } catch { return 0; }
}

const now = new Date().toISOString();
const sizeBytes = kbOf('.') * 1024; // bytes
const line = `${now},${sizeBytes}\n`;
let prev = null;
if (existsSync(logFile)) {
  const last = readFileSync(logFile, 'utf8').trim().split('\n').pop();
  if (last) prev = parseInt(last.split(',')[1], 10);
}
writeFileSync(logFile, (existsSync(logFile) ? readFileSync(logFile) : '') + line);
if (sizeBytes > 5000000) {
  console.error('Bundle size exceeds 5MB threshold!');
  process.exit(2);
} else if (prev != null && prev > 0) {
  const growth = ((sizeBytes - prev) / prev) * 100;
  console.log(`Bundle size: prev=${prev}B, now=${sizeBytes}B, growth=${growth.toFixed(2)}%`);
  if (growth > 3) {
    console.error('Bundle growth gate failed (>3%)');
    process.exit(3);
  }
} else {
  console.log(`Bundle baseline created: now=${sizeBytes}B`);
}
