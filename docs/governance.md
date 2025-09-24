# Governance & Policy Guide

ODAVL Studio enforces automated governance using two key files:

## .odavl.policy.yml
- **riskBudget:**
  - `maxLinesPerPatch`: Maximum lines changed per patch (default: 40)
  - `maxFilesTouched`: Maximum files per commit (default: 10)
  - `maxPatchesPerRun`: Maximum patches per run (default: 3)
  - `tokensPerDay`: Maximum automation tokens per day (default: 8)
- **protected:**
  - Paths that are never auto-modified (e.g., `**/security/**`, `**/*.spec.*`, `**/public-api/**`)
- **llmSafeMode:**
  - `banOps`: Disallowed operations (e.g., public-api-change, contract-break)
  - `redact`: Regex patterns for secret redaction (AWS, GitHub, Slack)
- **studio.telemetry:**
  - `off`, `on`, or `anonymized` (default: anonymized)
- **governor:**
  - PR/CI rate limits, concurrency, and wave windows

## .odavl/gates.yml
- **typeErrors.deltaMax:** 0 (no type errors allowed)
- **eslint.deltaMax:** 0 (no lint errors allowed)
- **bundleKB.deltaMax:** 10 (max bundle size increase)
- **buildMs.deltaPctMax:** 5 (max build time increase %)
- **policy.violationsMax:** 0 (no policy violations allowed)
- **shadow.mustPass:** true (shadow CI must pass)

## CI Enforcement
- `.github/workflows/shadow.yml` runs `pnpm odavl policy validate` after tests.
- If any gate or policy fails, CI fails and merge is blocked.

See also: `SECURITY.md` for RBAC, kill-switch, and privacy details.
