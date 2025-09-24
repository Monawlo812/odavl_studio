# 🚀 ODAVL Studio Launch Run Guide

## Quick Launch Commands

### 1. CLI Publishing (npm)

```bash
cd apps/cli
npm publish --access public
```

### 2. VS Code Extension Publishing

```bash
cd apps/vscode-ext
vsce package
vsce publish
```

### 3. GitHub Pages Activation

```bash
# Push to trigger pages workflow
git push origin main
# Verify at: https://monawlo812.github.io/odavl_studio
```

### 4. Docker Deployment

```bash
docker build -t odavl/studio .
docker push odavl/studio:latest
```

### 5. Release Creation

```bash
git tag v1.0.0
git push origin v1.0.0
# Triggers automatic GitHub release
```

## Verification Commands

### CLI Functionality

```bash
npx @odavl/cli --help
npx @odavl/cli status
npx @odavl/cli scan --dry-run
```

### Weekly Reports

```bash
pnpm run weekly
cat reports/weekly-summary.md
```

### System Status

```bash
node apps/cli/dist/index.js status
```

## Post-Launch Monitoring

- 📊 Weekly telemetry: `pnpm run weekly`
- 🔍 CI status: Check GitHub Actions
- 📦 npm downloads: npmjs.com/@odavl/cli
- 🎯 VS Code installs: marketplace.visualstudio.com

---

_ODAVL Studio Launch Guide - All systems verified ✅_
