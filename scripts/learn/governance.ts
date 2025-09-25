// Governance: ensure suggestion.json has all required fields for audit trail
import fs from 'fs';
import path from 'path';

const learnDir = path.resolve(__dirname, '../../..', 'reports', 'learn');
const suggestionPath = path.join(learnDir, 'suggestion.json');

let suggestions: any[] = [];
try {
  suggestions = JSON.parse(fs.readFileSync(suggestionPath, 'utf8'));
} catch {}
const now = new Date().toISOString();

let changed = false;
for (const s of suggestions) {
  if (!s.rationale) { s.rationale = 'No rationale'; changed = true; }
  if (!s.phase) { s.phase = 'unknown'; changed = true; }
  if (!s.timestamp) { s.timestamp = now; changed = true; }
  if (!s.oldBudget) { s.oldBudget = {}; changed = true; }
  if (!s.newBudget) { s.newBudget = {}; changed = true; }
  if (!s.recipe) { s.recipe = 'unknown'; changed = true; }
}
if (changed) {
  fs.writeFileSync(suggestionPath, JSON.stringify(suggestions, null, 2));
  console.log('Updated suggestion.json with governance fields');
} else {
  console.log('suggestion.json already has governance fields');
}
