ARCHIVED — Superseded by reports/final/AUDIT_BOOK.md
# Explain-B.md — Stage B: Shadow CI (GitHub Actions)

## What changed
- Added `.github/workflows/shadow.yml` (32 lines):
  - Triggers on PRs to main/master and manual dispatch
  - Runs on ubuntu-latest, matrix node 18/20
  - Steps: checkout, setup pnpm/node, install, build, test, typecheck (all tolerant)
  - Uploads `reports/` as artifact if present

## Why
- Implements Stage B of ODAVL/ODAVL Studio MVP as per provided specs
- Ensures all PRs are shadow-verified in CI on both Node 18 and 20
- Uploads evidence for further governance and attestation

## Risk
- Lines: 32 (all infra/config, no code logic)
- Files: 1
- Protected paths touched: 0
- No user-facing or runtime risk; all changes are additive

## Verify
- PRs to main/master will trigger this workflow
- Matrix covers both Node 18 and 20
- Reports are uploaded for later review

## Next step
- Commit as "chore(odavl): stage B — shadow CI bootstrap"
- Push branch and prepare for Stage C (CLI skeleton)
