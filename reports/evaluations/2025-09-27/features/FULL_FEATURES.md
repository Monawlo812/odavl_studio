# ODAVL Studio – Unified Feature & Service Catalog

**Date:** 2025-09-27
**Evidence Root:** `reports/evaluations/2025-09-27/features/logs/`

---

## Feature Catalog

### 1. Code Scanning & Diagnostics
- **Description:** Automated linting and typechecking across all packages using ESLint and TypeScript.
- **Paths:** `apps/`, `packages/`, `pnpm-workspace.yaml`, `eslint.config.mjs`, `tsconfig.json`
- **Commands:**
  - `pnpm -w run lint` ([evidence](logs/scan/eslint.log))
  - `pnpm -w run typecheck` ([evidence](logs/scan/tsc.log))
- **Business Value:** Early detection of code issues, improved code quality, and reduced technical debt.
- **Maturity Score:** 8/10
- **Why Not 10/10:** Some lint/type errors remain; not all packages have 100% coverage.
- **Risks:** Lint/typecheck failures can block CI; inconsistent config across packages.
- **30/60/90 Roadmap:**
  - 30: Address top lint/type errors, unify configs.
  - 60: Enforce zero-tolerance in CI, add custom rules.
  - 90: Integrate with PR gating and reporting dashboards.

### 2. Build System (Monorepo)
- **Description:** Turborepo + pnpm orchestrate builds across all apps/packages.
- **Paths:** `turbo.json`, `pnpm-workspace.yaml`, `apps/`, `packages/`
- **Commands:**
  - `pnpm -w run build` ([evidence](logs/build/build.log))
- **Business Value:** Fast, cacheable builds; scalable for large teams.
- **Maturity Score:** 7/10
- **Why Not 10/10:** Some build failures; not all packages build cleanly.
- **Risks:** Build breaks block all downstream tasks; cache invalidation issues.
- **30/60/90 Roadmap:**
  - 30: Fix failing builds, document build matrix.
  - 60: Add build health dashboards, improve cache usage.
  - 90: Enable distributed builds, integrate with CI/CD.

### 3. Automated Testing & Coverage
- **Description:** Vitest/Jest test suites with coverage reporting.
- **Paths:** `apps/`, `packages/`, `vitest.config.ts`, `jest.config.js`
- **Commands:**
  - `pnpm -w run test -- --coverage` ([evidence](logs/build/test.log))
  - `pnpm -w exec vitest run --coverage` ([evidence](logs/build/vitest.log))
  - `pnpm -w exec jest --coverage` ([evidence](logs/build/jest.log))
- **Business Value:** Prevents regressions, ensures code reliability.
- **Maturity Score:** 6/10
- **Why Not 10/10:** Test failures, ESM/Jest config gaps, low coverage in some areas.
- **Risks:** False sense of security if tests are weak; config drift.
- **30/60/90 Roadmap:**
  - 30: Fix test runner configs, address top failures.
  - 60: Increase coverage, enforce in CI.
  - 90: Add mutation testing, dashboard reporting.

### 4. Security & Vulnerability Scanning
- **Description:** Dependency audit via pnpm audit; security logs and reporting.
- **Paths:** `pnpm-lock.yaml`, `package.json`, `reports/security*`
- **Commands:**
  - `pnpm -w audit` ([evidence](logs/security/audit.log))
- **Business Value:** Reduces risk of known vulnerabilities in dependencies.
- **Maturity Score:** 7/10
- **Why Not 10/10:** Some audit warnings remain; no automated patching.
- **Risks:** Missed CVEs, audit tool gaps, manual remediation required.
- **30/60/90 Roadmap:**
  - 30: Address critical audit warnings.
  - 60: Integrate with PR checks, add osv-scanner.
  - 90: Automate patch PRs, add SAST/DAST.

### 5. CI/CD Automation
- **Description:** GitHub Actions for build, test, and deploy; evidence in workflow logs.
- **Paths:** `.github/workflows/ci.yml`, `reports/ci*`
- **Commands:**
  - See workflow ([evidence](logs/ci/ci-yml.log))
- **Business Value:** Enables continuous integration, fast feedback, and safe deploys.
- **Maturity Score:** 8/10
- **Why Not 10/10:** Some manual steps; not all jobs are fully automated.
- **Risks:** CI flakiness, secrets leakage, incomplete coverage.
- **30/60/90 Roadmap:**
  - 30: Add missing jobs, improve error reporting.
  - 60: Add deployment gates, secret scanning.
  - 90: Full CD, rollback automation.

### 6. Policy-Driven Governance (Governor)
- **Description:** Rate limits, risk budgets, and protected paths enforced via `.odavl.policy.yml`.
- **Paths:** `.odavl.policy.yml`, `packages/policy/`, `reports/ci-runs-governor.json`
- **Commands:**
  - Policy enforcement ([evidence](logs/governor/policy-yml.log))
- **Business Value:** Prevents resource exhaustion, enforces org policies.
- **Maturity Score:** 9/10
- **Why Not 10/10:** Manual override possible; policy drift risk.
- **Risks:** Overly strict policies block work; under-enforcement.
- **30/60/90 Roadmap:**
  - 30: Review and tune risk budgets.
  - 60: Add policy change audit logs.
  - 90: Integrate with external policy engines.

### 7. Undo & Rollback System
- **Description:** Snapshots and undo logs for all automated changes.
- **Paths:** `reports/undo/`, `reports/undo*`
- **Commands:**
  - `odavl undo last` ([evidence](logs/undo/undo-dir.log))
- **Business Value:** Enables safe experimentation and rapid recovery.
- **Maturity Score:** 8/10
- **Why Not 10/10:** Manual restore required; not all actions are atomic.
- **Risks:** Incomplete snapshots, restore failures.
- **30/60/90 Roadmap:**
  - 30: Add snapshot validation.
  - 60: Automate multi-step undo.
  - 90: Add UI for undo/redo.

### 8. Telemetry & Observability
- **Description:** Local telemetry logs, opt-in analytics, and runtime version evidence.
- **Paths:** `reports/telemetry.log.jsonl`, `.odavl.policy.yml`, `reports/telemetry*`
- **Commands:**
  - Telemetry log ([evidence](logs/telemetry/telemetry-dir.log))
  - Node version ([evidence](logs/observability/node-version.log))
- **Business Value:** Enables usage analytics, debugging, and performance monitoring.
- **Maturity Score:** 7/10
- **Why Not 10/10:** Telemetry is opt-in/off by default; limited remote reporting.
- **Risks:** Privacy concerns, incomplete data.
- **30/60/90 Roadmap:**
  - 30: Add anonymized mode, improve docs.
  - 60: Add remote endpoint, dashboards.
  - 90: Integrate with external observability tools.

### 9. Protected Paths & Safety Gates
- **Description:** Critical paths (e.g., `security/`, `*.spec.*`, `public-api/`) are protected from automation.
- **Paths:** `.odavl.policy.yml`, `packages/policy/`
- **Commands:**
  - Policy check ([evidence](logs/protected-paths/protected-paths.log))
- **Business Value:** Prevents accidental or risky changes to sensitive code.
- **Maturity Score:** 9/10
- **Why Not 10/10:** Manual bypass possible; config drift risk.
- **Risks:** Over-protection blocks needed changes.
- **30/60/90 Roadmap:**
  - 30: Review protected paths.
  - 60: Add dynamic path detection.
  - 90: Integrate with PR review bots.

### 10. Documentation & Onboarding
- **Description:** Extensive markdown docs, onboarding guides, and design partner playbooks.
- **Paths:** `docs/`, `docs/*.md`, `README.md`, `SUPPORT.md`
- **Commands:**
  - Docs listing ([evidence](logs/docs/docs-md-dir.log))
- **Business Value:** Reduces onboarding time, improves support and adoption.
- **Maturity Score:** 8/10
- **Why Not 10/10:** Docs can lag behind code; some areas lack diagrams.
- **Risks:** Outdated docs, fragmented knowledge.
- **30/60/90 Roadmap:**
  - 30: Update for latest features.
  - 60: Add more diagrams, video guides.
  - 90: Integrate docs with codebase (e.g., docgen).

### 11. RBAC & Access Control
- **Description:** Role-based access via `odavl.rbac.yml` and policy enforcement.
- **Paths:** `odavl.rbac.yml`, `packages/policy/`
- **Commands:**
  - RBAC config ([evidence](logs/rbac/rbac-yml.log))
- **Business Value:** Ensures only authorized users can perform sensitive actions.
- **Maturity Score:** 7/10
- **Why Not 10/10:** Manual config; no UI for role management.
- **Risks:** Misconfigurations, privilege escalation.
- **30/60/90 Roadmap:**
  - 30: Audit current roles.
  - 60: Add role change logs.
  - 90: Integrate with SSO/IdP.

### 12. API & Extensibility
- **Description:** Public API surface for automation and integration (planned, not yet present).
- **Paths:** (No public-api/ found)
- **Commands:** N/A
- **Business Value:** Enables ecosystem integrations and custom workflows.
- **Maturity Score:** 3/10
- **Why Not 10/10:** No public API yet; only internal modules.
- **Risks:** Integration blockers for partners.
- **30/60/90 Roadmap:**
  - 30: Design API surface.
  - 60: Implement read-only endpoints.
  - 90: Add mutation endpoints, publish docs.

### 13. Monorepo Management
- **Description:** pnpm + Turborepo for scalable, multi-package development.
- **Paths:** `pnpm-workspace.yaml`, `turbo.json`, `apps/`, `packages/`
- **Commands:**
  - Workspace config ([evidence](logs/monorepo/pnpm-workspace-yaml.log))
  - Turbo config ([evidence](logs/monorepo/turbo-json.log))
- **Business Value:** Simplifies dependency management, enables code sharing.
- **Maturity Score:** 9/10
- **Why Not 10/10:** Some build/test config drift; onboarding for new devs can be complex.
- **Risks:** Tooling upgrades, workspace bloat.
- **30/60/90 Roadmap:**
  - 30: Document workspace structure.
  - 60: Add monorepo health checks.
  - 90: Automate dependency upgrades.

### 14. Examples & Onboarding
- **Description:** Example projects and codemod fixtures for onboarding and testing.
- **Paths:** `examples/`, `examples/codemod-fixture.ts`, `examples/golden-repo/`
- **Commands:**
  - Examples listing ([evidence](logs/examples/examples-dir.log))
- **Business Value:** Accelerates onboarding, provides reference implementations.
- **Maturity Score:** 8/10
- **Why Not 10/10:** Some examples are minimal; not all features covered.
- **Risks:** Outdated examples, lack of real-world complexity.
- **30/60/90 Roadmap:**
  - 30: Add more real-world examples.
  - 60: Integrate with docs and tests.
  - 90: Add guided onboarding flows.

### 15. Reporting & Auditability
- **Description:** All automation, undo, and evidence logs are stored in `reports/` for traceability.
- **Paths:** `reports/`, `reports/undo/`, `reports/ci*`, `reports/security*`, etc.
- **Commands:**
  - Reports listing ([evidence](logs/reports/reports-dir.log))
- **Business Value:** Enables compliance, audit trails, and debugging.
- **Maturity Score:** 9/10
- **Why Not 10/10:** Manual log review; no centralized dashboard.
- **Risks:** Log bloat, missed evidence.
- **30/60/90 Roadmap:**
  - 30: Add log rotation.
  - 60: Build reporting dashboard.
  - 90: Integrate with SIEM/compliance tools.

---

## Service Catalog for Companies

| Service                | Description                                      | Value Proposition                | Maturity | Evidence Log(s)                  |
|------------------------|--------------------------------------------------|----------------------------------|----------|-----------------------------------|
| Code Health Scan       | Automated lint/typecheck, health scoring         | Reduce tech debt, fast feedback  | 8/10     | scan/eslint.log, scan/tsc.log     |
| Automated Healing      | Risk-budgeted code fixes, undo/rollback          | Safe automation, fast recovery   | 8/10     | undo/undo-dir.log                 |
| CI/CD Automation       | GitHub Actions, build/test/deploy                | Fast, safe releases              | 8/10     | ci/ci-yml.log                     |
| Security Audit         | Dependency audit, protected paths                | Reduce risk, compliance          | 7/10     | security/audit.log                |
| Policy Governance      | Rate limits, risk budgets, RBAC                  | Prevent resource exhaustion      | 9/10     | governor/policy-yml.log, rbac/rbac-yml.log |
| Observability/Telemetry| Usage analytics, logs, opt-in telemetry          | Debugging, usage insights        | 7/10     | telemetry/telemetry-dir.log        |
| Documentation          | Markdown docs, onboarding guides                 | Faster onboarding, support       | 8/10     | docs/docs-md-dir.log              |
| Reporting & Audit      | Evidence logs, undo, compliance                  | Traceability, audit trails       | 9/10     | reports/reports-dir.log           |

---

*All evidence logs are available in `reports/evaluations/2025-09-27/features/logs/` for audit and traceability.*
