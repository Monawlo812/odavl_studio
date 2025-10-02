# Support

ODAVL Studio provides multiple support channels for users and design partners.

## Support Channels

### GitHub Issues (Primary)

- **Bug Reports**: [Create Bug Report](https://github.com/Monawlo812/odavl_studio/issues/new?template=bug_report.md)
- **Feature Requests**: [Request Feature](https://github.com/Monawlo812/odavl_studio/issues/new?template=feature_request.md)
- **Partner Onboarding**: [Start Onboarding](https://github.com/Monawlo812/odavl_studio/issues/new?template=onboarding.md)

### Documentation

- **Getting Started**: [Quick Start Guide](docs/quickstart.md)
- **Design Partner Playbook**: [Partner Guide](docs/design-partner-playbook.md)
- **FAQ**: [Frequently Asked Questions](docs/faq.md)

## Service Level Agreements

### Design Partners

- **Initial Response**: 24 hours (business days)
- **Resolution Target**: 5 business days for critical issues
- **Onboarding Support**: Dedicated assistance during setup
- **Escalation Path**: Direct contact with development team

### Community Users

- **Response Time**: Best effort, typically 3-5 business days
- **Resolution**: Dependent on issue complexity and community contributions

## Required Artifacts

When reporting issues, please attach:

### For Bug Reports

- **CLI Output**: Copy of error messages and stack traces
- **Policy File**: Your `.odavl.policy.yml` configuration
- **Environment**: Node.js version, OS, repository details
- **Logs**: Relevant entries from `reports/telemetry.log.jsonl`

### For Performance Issues

- **Scan Results**: Output from `odavl scan` command
- **Timing Data**: CI run durations and resource usage
- **Repository Stats**: Size, file count, technology stack

### For Integration Problems

- **GitHub Actions Logs**: Failed workflow runs
- **Permission Audit**: GitHub App installation details
- **Network Diagnostics**: Webhook delivery status

## Self-Service Resources

### CLI Diagnostics

```bash
# System health check
odavl status

# Governor policy status
odavl governor explain

# Recent activity summary
odavl telemetry summary --since 7d
```

### Common Solutions

- **Permission Denied**: Verify GitHub App installation and repository access
- **Rate Limiting**: Check governor policy settings and current usage
- **CI Failures**: Review workflow permissions and branch protection rules

## Emergency Contacts

For critical production issues affecting design partners:

- Create high-priority GitHub issue with `[URGENT]` prefix
- Include all required artifacts and impact assessment
- Tag `@Monawlo812` for escalation

---

### Support documentation updated as of September 2025
