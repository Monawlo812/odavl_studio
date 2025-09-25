import fs from 'fs';
import path from 'path';

const learnDir = path.resolve(__dirname, '../../..', 'reports', 'learn');
const metricsPath = path.join(learnDir, 'metrics.json');
const suggestionPath = path.join(learnDir, 'suggestion.json');

const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
let suggestions: any[] = [];
try {
  suggestions = JSON.parse(fs.readFileSync(suggestionPath, 'utf8'));
} catch {}
const now = new Date().toISOString();

function thompson(success: number, fail: number) {
  // Beta(1+success, 1+fail)
  const alpha = 1 + success;
  const beta = 1 + fail;
  // mean of Beta(alpha, beta)
  return alpha / (alpha + beta);
}

for (const [recipe, m] of Object.entries(metrics)) {
  const n = (m as any).success + (m as any).fail;
  if (n < 5) continue;
  const banditScore = thompson((m as any).success, (m as any).fail);
  const oldMaxLines = (m as any).avgLines || 40;
  const oldMaxFiles = (m as any).avgFiles || 10;
  let newMaxLines = Math.round(oldMaxLines * (0.9 + 0.2 * banditScore));
  let newMaxFiles = Math.round(oldMaxFiles * (0.9 + 0.2 * banditScore));
  newMaxLines = Math.max(Math.round(oldMaxLines * 0.9), Math.min(newMaxLines, Math.round(oldMaxLines * 1.1)));
  newMaxFiles = Math.max(Math.round(oldMaxFiles * 0.9), Math.min(newMaxFiles, Math.round(oldMaxFiles * 1.1)));
  suggestions.push({
    recipe,
    oldBudget: {maxLines: oldMaxLines, maxFiles: oldMaxFiles},
    newBudget: {maxLines: newMaxLines, maxFiles: newMaxFiles},
    bandit_risk_score: banditScore,
    rationale: `Bandit: Beta(${(m as any).success+1}, ${(m as any).fail+1}) → ${banditScore.toFixed(2)}`,
    phase: 'bandit',
    timestamp: now
  });
}

fs.writeFileSync(suggestionPath, JSON.stringify(suggestions, null, 2));
console.log('Wrote bandit suggestions to reports/learn/suggestion.json');
