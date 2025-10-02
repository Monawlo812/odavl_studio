# ODAVL Studio — Full Recovery & Zero-Issues MASTER PLAN

## Intro Summary

**Current State:**
- Build and typecheck pass for main packages, but some scripts fail due to missing files or misconfigurations.
- Lint passes for main packages, but fails for `lint:pkgs` due to no matching files.
- No real tests are run; test script is a stub.
- Security checks (SBOM, osv-scanner, gitleaks) fail due to missing binaries.
- CI/CD does not enforce or run real tests or security checks.
- Some governance/immune scripts fail due to missing files or code errors.
- No bundle log generated; observability scripts missing or broken.
- Docs/examples not validated or updated.
- Future risks: no test baseline, security checks not enforced, config drift.

**Why Critical:**
- Without real tests, security, and CI/CD enforcement, regressions and vulnerabilities can slip through.
- Broken scripts/configs erode trust and auditability.
- Repo is not ready for enterprise or compliance audits.

---

## Phased Recovery Plan

### Phase 1: Build, Type, Lint Baseline
- **Goal:** Ensure all packages build, typecheck, and lint with zero errors.
- **Scope:** All apps/packages except protected paths.
- **Actions:**
  - Fix `lint:pkgs` and `build:pkgs` patterns to match real files.
  - Remove or repair broken scripts referencing missing files.
  - Evidence: `build.log`, `typecheck.log`, `lint.log`, `lint-pkgs.log`, `build-pkgs.log`
- **Risks:** Hidden config drift, missing files.
- **Acceptance:** All logs show 0 errors, all scripts run without failure.

### Phase 2: Test Baseline
- **Goal:** Establish a real test baseline (even minimal smoke tests).
- **Scope:** All apps/packages with testable code.
- **Actions:**
  - Add at least one real test per package (skip protected paths).
  - Update `test` script to run real tests (e.g., `turbo run test` or `pnpm -r test`).
  - Evidence: `test.log`, new test files, passing CI.
- **Risks:** No test infra, test flakiness.
- **Acceptance:** `test.log` shows real tests run and pass.

### Phase 3: Security & SBOM
- **Goal:** Enforce security scanning and SBOM generation in CI/CD.
- **Scope:** Root and all packages.
- **Actions:**
  - Install and configure `osv-scanner`, `gitleaks`, and CycloneDX tools.
  - Add working scripts and CI steps for each.
  - Evidence: `osv.log`, `gitleaks.log`, `sbom.log`, CI artifacts.
- **Risks:** Tool install issues, false positives.
- **Acceptance:** Security logs show scans run and pass, SBOM generated.

### Phase 4: CI/CD & Governance
- **Goal:** CI/CD enforces build, lint, typecheck, test, and security as required checks.
- **Scope:** `.github/workflows/ci.yml`, CODEOWNERS, policy configs.
- **Actions:**
  - Update CI to run all required checks and fail on error.
  - Fix or remove broken immune/governance scripts.
  - Evidence: `ci-status.log`, workflow runs, CODEOWNERS, policy logs.
- **Risks:** CI config drift, missing permissions.
- **Acceptance:** CI passes only if all checks pass; CODEOWNERS and policy validated.

### Phase 5: Observability & Docs
- **Goal:** Bundle log, metrics, and docs are up-to-date and validated.
- **Scope:** Root, docs, examples, metrics scripts.
- **Actions:**
  - Add/fix `bundle:log` script; ensure bundle log is generated.
  - Validate and update README, docs, and examples.
  - Evidence: `bundle.log`, updated docs, metrics logs.
- **Risks:** Outdated docs, missing scripts.
- **Acceptance:** All evidence present, docs accurate, bundle log stable.

### Phase 6: Future-Proofing
- **Goal:** Multi-platform CI, Node/TS compatibility, dependency automation.
- **Scope:** CI config, Renovate/Dependabot, chaos/canary jobs.
- **Actions:**
  - Enable Linux+Windows CI, Node 22, latest TS.
  - Re-enable Renovate/Dependabot with safe policies.
  - Add chaos/canary job for resilience.
  - Evidence: CI matrix, config files, canary logs.
- **Risks:** Platform-specific bugs, dependency noise.
- **Acceptance:** CI matrix green, canary job runs, dependency PRs flow.

---

## Definition of Done: “Repo Green”
- Build = PASS
- Typecheck = 0 errors
- Lint = 0 errors
- Tests = baseline running and passing
- CI/CD = all workflows green, required checks enforced
- SBOM = present and up-to-date
- Security scans = clean
- Bundle log = stable
- Docs = updated and validated
- All evidence stored under `reports/`

---

## Future-Proofing Recommendations
- Schedule regular evidence sweeps and audits.
- Keep all scripts and CI configs in sync with reality.
- Automate dependency and security updates.
- Maintain a real test baseline and expand coverage.
- Document all changes and store evidence for every wave.
