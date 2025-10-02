# ODAVL Studio Release Process

## Automated Release (Recommended)

The automated release workflow triggers on git tag push with pattern `v*`:

```bash
# Create and push a version tag
git tag v0.3.0
git push origin v0.3.0
```

The GitHub Actions workflow will automatically:

1. Extract the latest changelog section from `CHANGELOG.md`
2. Create a GitHub Release with the tag
3. Attach `reports/Wave3-QA-Report.md` if available
4. Set release title as "ODAVL Studio vX.Y.Z"

## Manual Release Fallback

If the automated workflow fails or manual intervention is needed:

### Prerequisites

- GitHub CLI installed and authenticated: `gh auth login`
- Latest changes documented in `CHANGELOG.md`
- All tests passing and CI green

### Steps

1. **Create version tag:**

   ```bash
   git tag v0.3.0
   git push origin v0.3.0
   ```

2. **Extract changelog section:**

   ```bash
   # Extract latest version section from CHANGELOG.md
   awk '/^## \[/ { if (count++ > 0) exit } count > 0' CHANGELOG.md > latest_changes.md
   ```

3. **Create GitHub Release:**

   ```bash
   # Basic release
   gh release create v0.3.0 \
     --title "ODAVL Studio v0.3.0" \
     --notes-file latest_changes.md

   # With QA report attachment
   gh release create v0.3.0 \
     --title "ODAVL Studio v0.3.0" \
     --notes-file latest_changes.md \
     reports/Wave3-QA-Report.md
   ```

4. **Verify release:**

```bash
   gh release view v0.3.0
   ```

## Troubleshooting

### Workflow Permission Issues

Ensure the repository has `Actions` -> `General` -> `Workflow permissions` set to "Read and write permissions"

### Missing Changelog

If `CHANGELOG.md` doesn't exist, the workflow will create a minimal release note. Create the changelog before tagging:

```bash
echo "## [0.3.0] - $(date +%Y-%m-%d)" >> CHANGELOG.md
echo "### Added" >> CHANGELOG.md
echo "- Initial ODAVL Studio release" >> CHANGELOG.md
```

### QA Report Missing

The workflow gracefully handles missing QA reports. To generate one:

```bash
node apps/cli/dist/index.js scan > reports/Wave3-QA-Report.md
```

## Version Strategy

- **Major** (1.0.0): Breaking changes, major feature releases
- **Minor** (0.1.0): New features, backwards compatible
- **Patch** (0.0.1): Bug fixes, security updates

Current release: Public Beta phase (0.x.x series)
