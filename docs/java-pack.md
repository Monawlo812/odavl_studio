# Java Pack (Wave 5)

Minimal Java support (dry-run first):
- **scan()**: Maven/Gradle tests, best-effort lint (checkstyle/spotbugs).
- **heal()**: proposals only (unused imports + patch/minor deps) — no file writes.

**CI Matrix:** JDK `17`, `21` (see `.github/workflows/java-ci.yml`).

**Gates (in `.odavl/gates.yml`):**
- `java.lint.deltaMax = 0`
- `java.tests.failuresMax = 0`

**Artifacts (under `reports/w5/`):**
- `java-scan-sample.json` — aggregated metrics
- `java-heal-proposals.json` — dry-run suggestions
- `java-e2e.json` — golden summary

**Local E2E:**
```bash
scripts/e2e-java.sh
```