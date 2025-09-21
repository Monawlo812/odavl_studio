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
- **Protected paths**: Critical files (security/, *.spec.*, public-api/) are excluded from automated changes
- **Risk budgets**: Automated operations are limited by configurable safety limits
- **Audit trails**: All automated changes are logged for review

## Acknowledgments

We will publicly acknowledge security researchers who responsibly disclose vulnerabilities (with their permission).