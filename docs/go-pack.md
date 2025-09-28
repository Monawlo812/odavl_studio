# Go Pack (Wave 5)

Minimal Go support (dry-run first):

- **scan()**: golangci-lint, `go test -json`, govulncheck (best-effort).
- **heal()**: proposals only (imports/deps) → no file writes.

**CI Matrix:** Go `1.22.x`, `1.23.x` (see `.github/workflows/go-ci.yml`).

**Gates (in `.odavl/gates.yml`):**

- `go.lint.deltaMax = 0`
- `go.tests.failuresMax = 0`

**Artifacts (under `reports/w5/`):**

- `go-scan-sample.json` — aggregated metrics
- `go-heal-proposals.json` — dry-run suggestions
- `go-e2e.json` — golden summary

**Local E2E:**

```bash
scripts/e2e-go.sh
```
