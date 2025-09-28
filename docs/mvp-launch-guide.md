# ODAVL Studio – MVP Launch Guide

This guide walks you through using ODAVL Studio end-to-end for automated, policy-driven code healing and governance.

## Prerequisites
- Node.js 18+
- pnpm
- GitHub CLI (for PR automation)
- VS Code (for extension)

## 1. Install & Build
```bash
pnpm install
pnpm --filter @odavl/cli run build
```

## 2. Run End-to-End Flow (Golden Repo)
```bash
# Scan codebase health
pnpm odavl scan

# Apply automated fixes (dry-run)
pnpm odavl heal --recipe esm-hygiene --dry-run

# Create a new branch for changes
pnpm odavl branch create --name auto-e2e

git push -u origin auto-e2e

# Shadow verify (CI dry-run)
pnpm odavl shadow verify

# Open a PR with evidence
pnpm odavl pr open
```

## 3. PR Template
- **What changed:** Automated code hygiene, dependency updates, etc.
- **Why:** Improve code health, enforce policy, reduce risk.
- **Risk/Verify/Metrics:** Lint, type, build, test results attached.
- **Attestation:** See `attestation.json` in PR artifacts.

## 4. VS Code Extension
- Open Control Center: `ODAVL Studio: Open Panel`
- Use buttons for Scan, Heal, Undo, Explain, PR, Shadow
- Undo: Roll back last CLI action
- Explain: Show rationale/metrics before apply

## 5. n8n Workflow
- See `infra/n8n/workflow.json` for E2E automation
- Trigger via webhook or from VS Code

## 6. Governance & CI
- All merges gated by `.odavl.policy.yml` and `.odavl/gates.yml`
- CI runs `pnpm odavl policy validate` after tests
- Failing gates block merges

## Resources
- [docs/governance.md](../docs/governance.md)
- [SECURITY.md](../SECURITY.md)
- [README.md](../README.md)
