#!/usr/bin/env bash
# Bootstrap script to create ODAVL Studio GitHub App

set -e

echo "🚀 Creating ODAVL Studio GitHub App..."

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is required but not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

# Create the app using the manifest
echo "📝 Creating GitHub App from manifest..."
gh app create --manifest ./infra/github-app/manifest.yml

echo "✅ GitHub App created successfully!"
echo ""
echo "Next steps:"
echo "1. Install the app on your repositories"
echo "2. Configure webhook URL if needed"
echo "3. Test with a pull request"
echo ""
echo "For more information, see: https://docs.github.com/en/developers/apps/building-github-apps"