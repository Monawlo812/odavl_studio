# Release Playbook

Comprehensive release process for ODAVL Studio with validation, execution, and rollback procedures.

## Pre-Release Validation

### 1. Build Verification

```bash
# Clean build all components
pnpm clean && pnpm install
pnpm turbo build

# Verify CLI functionality
node apps/cli/dist/index.js --help
node apps/cli/dist/index.js status
```

### 2. End-to-End Testing

```bash
# Run full E2E pipeline
pnpm e2e

# Verify all artifacts generated
ls -la reports/e2e-*
cat reports/e2e-summary.json
```

### 3. Documentation Health Check

```bash
# Check internal links
find docs/ -name "*.md" -exec grep -l "\[\[" {} \;

# Verify external links (manual spot check)
# - GitHub repo links in package.json files
# - Documentation links in README.md
# - Support channels in SUPPORT.md
```

### 4. System Status Validation

```bash
# Current branch status
git status --porcelain
git log --oneline -5

# Governor and telemetry health
node apps/cli/dist/index.js governor explain
node apps/cli/dist/index.js telemetry summary --since 7d
```

## Release Execution

### 5. Version Tagging (Following L-1 Workflow)

```bash
# Create version tag (triggers release.yml)
git tag v0.3.0
git push origin v0.3.0

# Monitor GitHub Actions
# Visit: https://github.com/Monawlo812/odavl_studio/actions
```

### 6. Release Validation

- [ ] GitHub Release created automatically
- [ ] Changelog section extracted correctly
- [ ] QA report attached (if available)
- [ ] Release assets uploaded

## Post-Release Activities

### 7. CLI Publishing (Optional)

```bash
# Remove private flag from CLI package.json
# Update apps/cli/package.json: "private": false

# Publish to npm (when ready)
cd apps/cli
npm publish --access public
```

### 8. VS Code Extension Submission

```bash
# Package extension
cd apps/vscode-ext
npx vsce package

# Submit to marketplace (manual process)
# Visit: https://marketplace.visualstudio.com/manage
```

### 9. Announcement & Communication

- [ ] Update project README with latest version
- [ ] Post release notes to GitHub Discussions
- [ ] Notify design partners of new features
- [ ] Update documentation site (GitHub Pages)

### 10. Design Partner Playbook KPIs Update

```bash
# Generate updated metrics
npm run weekly

# Review reports/weekly-summary.md
# Update design partner success metrics
# Document new automation capabilities
```

## Rollback Procedures

### Emergency Rollback

If critical issues are discovered post-release:

```bash
# 1. Delete problematic tag
git tag -d v0.3.0
git push origin :refs/tags/v0.3.0

# 2. Delete GitHub Release
gh release delete v0.3.0 --yes

# 3. Revert to previous stable state
git reset --hard v0.2.0
git push origin --force-with-lease
```

### Partial Rollback Options

- **CLI only**: Unpublish from npm if published
- **VS Code extension**: Contact marketplace support
- **Documentation**: Revert docs changes and redeploy

### Communication During Rollback

- [ ] Immediate GitHub issue with status update
- [ ] Notify affected design partners
- [ ] Update release status in announcements
- [ ] Document lessons learned for next release

## Release Checklist Summary

**Pre-Release** (Required):

- [ ] Clean build successful
- [ ] E2E tests passing
- [ ] Documentation links verified
- [ ] System status healthy

**Release** (Automated via L-1):

- [ ] Tag pushed
- [ ] GitHub Release created
- [ ] Assets attached

**Post-Release** (Manual):

- [ ] CLI published (optional)
- [ ] VS Code extension submitted
- [ ] Announcements made
- [ ] KPIs updated

**Rollback Ready**:

- [ ] Rollback procedures documented
- [ ] Emergency contacts identified
- [ ] Communication plan prepared

---

_Release playbook version 1.0 - September 2025_
