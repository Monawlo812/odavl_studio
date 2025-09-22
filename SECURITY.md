## Governance & Operations

ODAVL Studio enforces strict development governance and risk budgets to ensure safety, privacy, and compliance.

### Governance Rules
- **Risk Budgets:**
	- Max 40 lines per patch
	- Max 10 files per commit
	- Max 3 patches per run
	- Max 8 tokens per day
- **Protected Paths:**
	- `**/security/**`, `**/*.spec.*`, `**/public-api/**`
- **LLM Safe Mode:**
	- Bans public API changes and contract breaks
	- Redacts AWS, GitHub, and Slack secrets
- **CI Gates:**
	- All type errors, lint errors, and policy violations block merges
	- Bundle size and build time are capped

### RBAC Roles
- **Viewer:** Read-only access to reports and dashboards
- **Runner:** Can trigger scans, heals, and CI jobs
- **Reviewer:** Can approve/merge PRs, review governance status
- **Admin:** Full access, can update policy, manage kill-switch

### Kill-Switch Procedure
1. Admin sets `studio.autonomy: 0` in `.odavl.policy.yml`
2. Push change to main branch
3. All automation halts until autonomy is restored

### Privacy Settings
- **Telemetry:**
	- `off`: No data sent
	- `on`: Full usage analytics
	- `anonymized`: Only aggregate, non-identifiable data (default)
- **Redaction:**
	- All secrets and tokens are redacted in logs and reports

For more, see `docs/governance.md` and `.odavl.policy.yml`.
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.3.x   | ✅ Current release |
| < 0.3.0 | ❌ Not supported   |

## Reporting a Vulnerability

We take security seriously and appreciate responsible disclosure of security vulnerabilities.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns to: [Create a private issue](https://github.com/Monawlo812/odavl_studio/security/advisories/new)
3. Include detailed reproduction steps and impact assessment
4. Allow up to 72 hours for initial response

### Disclosure Timeline

- **Initial Response**: 72 hours
- **Status Update**: 7 days
- **Fix Development**: 30 days (critical), 90 days (moderate)
- **Public Disclosure**: After fix is released and users have time to update

### Security Considerations

#### Sensitive Data Protection

- **No secrets in logs**: CLI avoids logging tokens, keys, or credentials
- **Redacted telemetry**: Personal/repository data is anonymized or excluded
- **Local storage**: Configuration files should not contain sensitive data

#### GitHub Integration Security

- **Least privilege**: GitHub App requests minimal required permissions
- **Token scoping**: Access tokens are scoped to specific operations
- **Webhook validation**: All webhook payloads must be cryptographically verified

#### Automation Safety

- **Protected paths**: Critical files (security/, _.spec._, public-api/) are excluded from automated changes
- **Risk budgets**: Automated operations are limited by configurable safety limits
- **Audit trails**: All automated changes are logged for review

## Acknowledgments

We will publicly acknowledge security researchers who responsibly disclose vulnerabilities (with their permission).
