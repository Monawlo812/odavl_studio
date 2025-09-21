# GitHub App Setup Guide

This guide walks through creating and configuring a GitHub App for ODAVL Studio with least-privilege permissions.

## Prerequisites

- GitHub organization or personal account with admin access
- ODAVL Studio deployed and accessible via HTTPS
- Webhook endpoint ready to receive GitHub events

## Step 1: Create GitHub App

1. Navigate to GitHub Settings → Developer settings → GitHub Apps
2. Click "New GitHub App"
3. Use the manifest file: `infra/github-app/manifest.json`

![GitHub App Creation](../media/github-app-create.png)

## Step 2: Configure App Details

### Basic Information
- **App name**: `ODAVL Studio`
- **Description**: `Automated development governance with code healing and CI management`
- **Homepage URL**: `https://github.com/Monawlo812/odavl_studio`

### Webhook Configuration
- **Webhook URL**: Your deployed ODAVL Studio webhook endpoint
- **Webhook secret**: Generate a secure secret for webhook validation

![Webhook Configuration](../media/github-app-webhook.png)

## Step 3: Set Permissions (Least-Privilege)

The app requires minimal permissions for governance operations:

### Repository Permissions
- **Contents**: `Read` - Access repository files for scanning
- **Pull requests**: `Write` - Create and update PRs with healing results
- **Checks**: `Write` - Report code health status via check runs
- **Statuses**: `Write` - Update commit status for CI integration

### Subscribe to Events
- `pull_request` - Monitor PR creation and updates
- `check_suite` - Respond to CI check completions
- `workflow_run` - Track GitHub Actions workflow results

![Permissions Configuration](../media/github-app-permissions.png)

## Step 4: Installation Scope

### Recommended: Selected Repositories
For security and control, install only on specific repositories:

1. Choose "Selected repositories"
2. Add repositories where ODAVL governance is needed
3. Review and confirm installation scope

![Repository Selection](../media/github-app-repos.png)

### Organization-wide (Advanced)
Only for mature deployments with established governance policies.

## Step 5: Generate Credentials

1. Generate a private key for API authentication
2. Note the App ID for configuration
3. Save the webhook secret securely

![Credentials Generation](../media/github-app-credentials.png)

## Step 6: Configure ODAVL Studio

Update your ODAVL configuration with GitHub App credentials:

```yaml
# .odavl.policy.yml
github:
  app:
    id: "123456"
    privateKeyPath: "/path/to/private-key.pem"
    webhookSecret: "your-webhook-secret"
  installation:
    selectedRepos: true
    maxRepos: 10
```

## Step 7: Verify Installation

Test the integration:

```bash
# Check GitHub App authentication
odavl github verify

# Test webhook delivery
odavl github webhook test
```

## Security Best Practices

- **Rotate credentials** regularly (quarterly recommended)
- **Monitor webhook logs** for unauthorized access attempts
- **Review permissions** when updating ODAVL Studio
- **Limit repository scope** to only necessary repositories

## Troubleshooting

### Permission Denied Errors
- Verify app installation on target repositories
- Check permission levels match requirements
- Confirm private key is valid and accessible

### Webhook Delivery Failures
- Validate webhook URL is accessible via HTTPS
- Check webhook secret matches configuration
- Review firewall rules for GitHub webhook IPs

## Support

For additional help:
- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
- [ODAVL Studio Issues](https://github.com/Monawlo812/odavl_studio/issues)