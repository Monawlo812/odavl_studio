#!/usr/bin/env bash
set -euo pipefail
cd examples/go-golden
go mod tidy >/dev/null 2>&1 || true
golangci-lint run --out-format json > lint.json 2>/dev/null || echo '{}' > lint.json
go test -count=1 -json ./... > tests.json || true
go install golang.org/x/vuln/cmd/govulncheck@latest >/dev/null 2>&1 || true
govulncheck -json ./... > vuln.json 2>/dev/null || echo '{}' > vuln.json
cd - >/dev/null
mkdir -p reports/w5
L=$(jq '.Issues|length' examples/go-golden/lint.json 2>/dev/null || echo 0)
T=$(jq -r '.[].Action?=="fail"' examples/go-golden/tests.json 2>/dev/null | grep -c true || echo 0)
V=$(grep -i -c "vuln" examples/go-golden/vuln.json 2>/dev/null || echo 0)
printf '{"lintWarnings":%s,"testFailures":%s,"vulns":%s}\n' "$L" "$T" "$V" > reports/w5/go-e2e.json
