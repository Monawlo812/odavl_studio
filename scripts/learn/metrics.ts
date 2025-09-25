import fs from 'fs';
import path from 'path';

// Find all relevant report files
const repoRoot = path.resolve(__dirname, '../../..');
const reportDir = path.join(repoRoot, 'reports');
const learnDir = path.join(reportDir, 'learn');
const files = fs.readdirSync(reportDir).filter(f =>
  /attestation-|bundle\.log|osv\.json|gitleaks\.json/.test(f)
);

const metrics: Record<string, any> = {};

for (const file of files) {
  const filePath = path.join(reportDir, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    continue;
  }
  const recipe = data.recipe || data.codemod || 'unknown';
  if (!metrics[recipe]) metrics[recipe] = {success: 0, fail: 0, revert: 0, gateFail: 0, lines: [], files: []};
  if (data.success) metrics[recipe].success++;
  if (data.revert) metrics[recipe].revert++;
  if (data.gateFail) metrics[recipe].gateFail++;
  if (data.changedLines) metrics[recipe].lines.push(data.changedLines);
  if (data.changedFiles) metrics[recipe].files.push(data.changedFiles);
  if (data.success === false) metrics[recipe].fail++;
}

// Aggregate
const out: Record<string, any> = {};
for (const [recipe, m] of Object.entries(metrics)) {
  out[recipe] = {
    success: m.success,
    fail: m.fail,
    revert: m.revert,
    gateFail: m.gateFail,
    avgLines: m.lines.length ? m.lines.reduce((a: number, b: number) => a + b, 0) / m.lines.length : 0,
    avgFiles: m.files.length ? m.files.reduce((a: number, b: number) => a + b, 0) / m.files.length : 0
  };
}

fs.writeFileSync(path.join(learnDir, 'metrics.json'), JSON.stringify(out, null, 2));
console.log('Wrote metrics to reports/learn/metrics.json');
