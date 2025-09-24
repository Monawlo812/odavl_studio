# Quickstart Guide

## Prerequisites

- Node.js 18+
- pnpm 9+
- Git

## Installation

```bash
# Clone and setup
git clone https://github.com/Monawlo812/odavl_studio.git
cd odavl_studio
pnpm install
```

## Build CLI

```bash
pnpm --filter @odavl/cli run build
```

## Basic Operations

### Health Scan

```bash
node apps/cli/dist/index.js scan
```

### Code Healing (Dry-Run)

```bash
# ESM import fixes
node apps/cli/dist/index.js heal --recipe esm-hygiene --dry-run

# Dependency updates
node apps/cli/dist/index.js heal --recipe deps-patch --dry-run

# Remove unused code
node apps/cli/dist/index.js heal --recipe remove-unused --dry-run
```

### CI Operations

```bash
# Trigger workflow
node apps/cli/dist/index.js shadow run --dry-run

# Check status
node apps/cli/dist/index.js shadow status
```

### PR Management

```bash
# Create PR with evidence
node apps/cli/dist/index.js pr open --explain --dry-run
```

## VS Code Extension

1. Install extension from `apps/vscode-ext/`
2. Use command: `ODAVL Studio: Open Panel`
3. Click buttons for scan/heal operations

## Configuration

Copy `odavl.policy.yml.sample` to `.odavl.policy.yml` and customize:

```yaml
governor:
  prsPerDay: 5
  ciMinutesPerHour: 60
studio:
  telemetry: off
```
