import fs from 'fs';
import path from 'path';

const learnDir = path.resolve(__dirname, '../../..', 'reports', 'learn');
const metricsPath = path.join(learnDir, 'metrics.json');
const contextualPath = path.join(learnDir, 'suggestion-contextual.json');

const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
const now = new Date().toISOString();

// Stub: logistic regression-like scoring (offline, not applied)
function logistic(x: number) {
  return 1 / (1 + Math.exp(-x));
}

const contextual: any[] = [];
for (const [recipe, m] of Object.entries(metrics)) {
  // Example: use avgLines, avgFiles, success/fail as features
  const features = [
    (m as any).avgLines || 0,
    (m as any).avgFiles || 0,
    (m as any).success || 0,
    (m as any).fail || 0
  ];
  // Random weights for stub
  const weights = [0.01, -0.02, 0.1, -0.1];
  const score = logistic(features.reduce((s, v, i) => s + v * weights[i], 0));
  contextual.push({
    recipe,
    features,
    score,
    rationale: `Contextual stub: logistic([${features.join(',')}]) → ${score.toFixed(2)}`,
    phase: 'contextual',
    timestamp: now,
    humanApprovalRequired: true
  });
}

fs.writeFileSync(contextualPath, JSON.stringify(contextual, null, 2));
console.log('Wrote contextual stub suggestions to reports/learn/suggestion-contextual.json');
