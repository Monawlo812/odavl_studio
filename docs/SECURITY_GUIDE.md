
# ODAVL Studio Security Guide

This guide explains security scanning, interpreting results, CI gates, and evidence for ODAVL Studio.

## 1. Security Scanning

- **SBOM**: `pnpm run sbom:generate` (outputs CycloneDX to `reports/phase3/security/sbom.cdx.json`).
- **OSV**: `pnpm run scan:osv` (outputs to `reports/phase3/security/osv.log`).
- **Gitleaks**: `pnpm run scan:gitleaks` (outputs to `reports/phase3/security/gitleaks.log`).
- All run in CI via `.github/workflows/secure-ci.yml`.

## 2. Interpreting Results

- Review logs for `HIGH`/`CRITICAL` findings.
- Escalate via PR comment and assign security lead.
- Remediation SLA: 24h for critical, 72h for high.

## 3. CI Security Gates

- Auto-rollback, freeze, and canary workflows protect main.
- Protected paths: `security/`, `public-api/` are never auto-modified.

## 4. Sample Commands

```bash
pnpm run sbom:generate
pnpm run scan:osv
pnpm run scan:gitleaks
```

## 5. Example Log Snippet

```text
Finding: aws_secret="AKIA..."
RuleID: aws-access-token
File: checks_test.go
...
```

## 6. Evidence

- All security logs archived in `reports/phase3/security/` and `reports/evaluations/<date>/`.
