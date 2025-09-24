# ODAVL Auto-Ops Runbook

## Level 5: Full Autonomy

- **Maintenance Windows:** Automated changes only during scheduled windows (e.g., 3am daily)
- **Canary Promotion:** Risky PRs labeled `odavl:canary` are merged to a `canary` branch, run full Freeze, and only fast-forward main if green
- **Learning Hooks:** Freeze runs a learning script to adapt risk budgets and codemod costs based on outcomes
- **Evidence:** All learning outcomes are saved to `reports/learn/` for audit
