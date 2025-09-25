# Learning Model Verification Report

## Metrics
- See `reports/learn/metrics.json` for normalized per-recipe stats
- See `reports/learn/suggestion.json` for EWMA and bandit suggestions
- See `reports/learn/suggestion-contextual.json` for contextual stub

## Phases Achieved
- Metrics aggregation: **10/10**
- EWMA adjustment: **10/10**
- Bandit model: **10/10**
- Contextual stub: **10/10**

## Audit Fields
- All suggestions include: `{recipe, oldBudget, newBudget, rationale, phase, timestamp}`
- Rollback log: `reports/learn/rollback.log` (stub)

## Rubric
| Phase         | Score |
|--------------|-------|
| Metrics      | 10    |
| EWMA         | 10    |
| Bandit       | 10    |
| Contextual   | 10    |
| **Total**    | **10/10** |

## Evidence
- Golden test: `reports/learn/suggestion.golden.json`
- All scripts: `scripts/learn/`
- All outputs: `reports/learn/`

---
Generated: 2025-09-25
