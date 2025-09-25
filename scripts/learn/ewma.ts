import fs from 'fs';
import path from 'path';

const learnDir = path.resolve(__dirname, '../../..', 'reports', 'learn');
const metricsPath = path.join(learnDir, 'metrics.json');
const suggestionPath = path.join(learnDir, 'suggestion.json');

function ewma(arr: number[], alpha = 0.3) {
  if (!arr.length) return 0;
  let s = arr[0];
  for (let i = 1; i < arr.length; i++) {
    s = alpha * arr[i] + (1 - alpha) * s;
  }
  return s;
}

const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
const suggestions: any[] = [];
const now = new Date().toISOString();

for (const [recipe, m] of Object.entries(metrics)) {
  const n = (m as any).success + (m as any).fail;
  if (n < 10) continue;
  const successArr = Array((m as any).success).fill(1).concat(Array((m as any).fail).fill(0));
  const revertArr = Array((m as any).revert).fill(1).concat(Array(n - (m as any).revert).fill(0));
  const successEWMA = ewma(successArr);
  const revertEWMA = ewma(revertArr);
  // Clamp budgets ±10%
  const oldMaxLines = (m as any).avgLines || 40;
  const oldMaxFiles = (m as any).avgFiles || 10;
  let newMaxLines = Math.round(oldMaxLines * (1 + (successEWMA - revertEWMA - 0.5) * 0.2));
  let newMaxFiles = Math.round(oldMaxFiles * (1 + (successEWMA - revertEWMA - 0.5) * 0.2));
  newMaxLines = Math.max(Math.round(oldMaxLines * 0.9), Math.min(newMaxLines, Math.round(oldMaxLines * 1.1)));
  newMaxFiles = Math.max(Math.round(oldMaxFiles * 0.9), Math.min(newMaxFiles, Math.round(oldMaxFiles * 1.1)));
  suggestions.push({
    recipe,
    oldBudget: {maxLines: oldMaxLines, maxFiles: oldMaxFiles},
    newBudget: {maxLines: newMaxLines, maxFiles: newMaxFiles},
    rationale: `EWMA: success=${successEWMA.toFixed(2)}, revert=${revertEWMA.toFixed(2)}`,
    phase: 'ewma',
    timestamp: now
  });
}

fs.writeFileSync(suggestionPath, JSON.stringify(suggestions, null, 2));
console.log('Wrote EWMA suggestions to reports/learn/suggestion.json');
