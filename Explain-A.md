# Explain-A.md — Stage A: Policies, Gates, Scripts, PR Template

## What changed

- Added `.odavl.policy.yml` (22 lines): ODAVL MVP policy (autonomy, riskBudget, protected, bans, shadow, governor)
- Added `.odavl/gates.yml` (13 lines): Gates config (typeErrors, eslint, bundleKB, buildMs, shadow, policy)
- Overwrote `.github/pull_request_template.md` (13 lines): Minimal PR template with What/Why/Risk/Verify/Metrics/Gates/Attestation
- Edited `package.json`: Added "status" and "verify" scripts (2 lines)
- Created `reports/.gitkeep` (empty)

## Why

- Implements Stage A of ODAVL/ODAVL Studio MVP as per provided specs
- Establishes governance, risk, and safety guardrails for all future automation
- Ensures all PRs and CI runs are policy- and gate-aware from the start

## Risk

- Lines: 50 (all infra/config, no code logic)
- Files: 5
- Protected paths touched: 0
- No user-facing or runtime risk; all changes are additive or overwrite-only

## Verify

- Shadow CI will validate policy/gates on all PRs
- `pnpm run status` and `pnpm run verify` now stub to reports/
- PRs will use the new template and reference attestation

## Next step

- Commit as "chore(odavl): stage A — policy & gates bootstrap"
- Push branch and prepare for Stage B (shadow CI)
