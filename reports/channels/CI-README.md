# ODAVL Studio CI Integration

## GitHub App Integration Flow

This document explains how ODAVL Studio integrates with GitHub through the GitHub App and CI workflows.

### 🤖 GitHub App Capabilities

The ODAVL Studio GitHub App provides automated governance with the following permissions:

- **Contents**: Read repository contents for analysis
- **Pull Requests**: Write comments with governance reports
- **Checks**: Create status checks for CI results
- **Issues**: Read issue context for broader analysis

### 🔄 Workflow Triggers

The app integration workflow (`app-integration.yml`) triggers on:

- **Pull Request Events**: opened, synchronize, reopened
- **Pull Request Reviews**: submitted

### 📊 Governance Process

1. **Governor Check**: Verify daily PR limits and CI budget constraints
2. **Health Scan**: Analyze codebase for issues and technical debt
3. **Healing Plan**: Generate fix recommendations with risk assessment
4. **Shadow CI**: Trigger validation runs (if governor allows)
5. **Report Generation**: Create comprehensive governance report as PR comment

### 🛡️ Governor Constraints

The Governor system enforces safe automation limits:

- **Daily PR Limit**: Default 5 PRs per day (configurable via `.odavl.policy.yml`)
- **CI Minutes Budget**: Track and limit CI resource usage
- **Risk Budgets**: Maximum files/lines changed per operation

### 📝 PR Comment Format

Each PR gets a governance report comment with:

```markdown
## 🎛️ ODAVL Studio Governance Report

### 📊 Governor Status

- PR Budget: 2/5 PRs used today
- Automation: ✅ Allowed

### 🔍 Health Scan

- Health Score: 8.5/10
- Issues Found: 3

### 🔧 Healing Plan

- Files to heal: 2
- Estimated changes: 15 lines

### 🚀 Next Steps

- ✅ Governor allows automation
- 🔄 Shadow CI will run automatically
```

### 🚀 Installation Steps

1. **Create the GitHub App**:

   ```bash
   ./infra/github-app/bootstrap.sh
   ```

2. **Install on repositories**: Use GitHub's app installation flow

3. **Configure webhooks**: Point to your webhook endpoint (optional)

4. **Test integration**: Open a PR and verify governance comment appears

### 📁 Report Artifacts

All CI integration reports are saved to `reports/channels/` with timestamps:

- `ci-governor-YYYYMMDD-HHMMSS.json`: Governor state and constraints
- `ci-scan-YYYYMMDD-HHMMSS.json`: Health scan results
- `ci-heal-YYYYMMDD-HHMMSS.json`: Healing plan and recommendations

### 🔧 Configuration

Governance behavior is controlled via `.odavl.policy.yml`:

```yaml
governor:
  prsPerDay: 5
  ciMinutesPerHour: 60
  maxConcurrentShadows: 3
  waves:
    - window: "22:00-06:00"
      maxPrs: 3
```

### 🚨 Error Handling

- **Governor blocks**: PR comment explains limit reached, retry timing
- **Scan failures**: Graceful degradation with manual intervention guidance
- **Webhook failures**: Retry logic and notification systems
- **Rate limiting**: Respect GitHub API limits with exponential backoff

The GitHub App integration provides enterprise-grade automated governance while maintaining safety guardrails and transparency through detailed reporting.
