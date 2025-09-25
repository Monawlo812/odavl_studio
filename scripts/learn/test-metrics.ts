import fs from 'fs';
import path from 'path';

const learnDir = path.resolve(__dirname, '../../..', 'reports', 'learn');
const metricsPath = path.join(learnDir, 'metrics.json');
const suggestionPath = path.join(learnDir, 'suggestion.json');
const goldenPath = path.join(learnDir, 'suggestion.golden.json');

// Replay: re-run metrics and suggestion scripts, compare to golden
function readJSON(p: string) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

const metrics = readJSON(metricsPath);
const suggestion = readJSON(suggestionPath);
const golden = readJSON(goldenPath);

function deepEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

if (golden) {
  if (deepEqual(suggestion, golden)) {
    console.log('PASS: suggestion.json matches golden');
  } else {
    console.log('FAIL: suggestion.json does not match golden');
    process.exit(1);
  }
} else {
  fs.writeFileSync(goldenPath, JSON.stringify(suggestion, null, 2));
  console.log('Wrote golden suggestion.golden.json');
}
