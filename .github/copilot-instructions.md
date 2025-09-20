````instructions
# ODAVL Studio - AI Coding Agent Instructions

## Project Overview
ODAVL Studio is an **automated development governance platform** using pnpm workspaces and Turborepo. It provides CLI-driven code healing, CI governance, and risk-budgeted automation workflows.

**Core Purpose**: Automated code maintenance with safety guardrails via the "Governor" policy system and chunked healing to prevent large-scale breakage.

## Architecture & Components

### Workspace Structure
```
odavl_studio/
├── apps/
│   ├── cli/                 # Main ODAVL CLI tool (@odavl/cli)
│   └── vscode-ext/          # VS Code extension integration
├── packages/
│   ├── codemods/           # Automated code transformations
│   ├── policy/             # Governor system for rate limiting
│   ├── core/               # Shared utilities
│   └── reporters/          # Output formatters
├── examples/golden-repo/   # Test target for healing
├── reports/                # Telemetry, logs, and undo snapshots
└── .odavl.policy.yml       # Configuration file
```

### Key Systems

**CLI Tool (`apps/cli`)**: Main entry point with commands:
- `scan` - Analyze codebase health (ESLint, TypeScript errors)
- `heal` - Apply automated fixes with risk budgets and chunking
- `shadow run/status` - Trigger and monitor CI workflows  
- `pr open` - Create PRs with evidence sections
- `governor explain` - Check rate limiting status
- `undo last` - Revert recent changes with snapshot system

**Governor (`packages/policy`)**: Rate limiting system that prevents resource exhaustion:
- PR creation limits (daily quotas)
- CI runtime budgets (minutes per hour)
- Wave windows for time-based scheduling (e.g., `"22:00-06:00"` for overnight automation)
- Configuration via `.odavl.policy.yml`

**Codemods (`packages/codemods`)**: Automated code transformations:
- `esmHygiene` - Add `.js` extensions to ESM imports
- `depsPatchMinor` - Upgrade dependencies with OSV security awareness
- Risk-budgeted chunking to limit blast radius

## Critical Workflows

### Healing System Architecture
The heal command implements **chunked execution** with risk budgets:

```bash
# Dry-run to see planned changes
node apps/cli/dist/index.js heal --recipe esm-hygiene --dry-run --max-lines 40 --max-files 10

# Apply only first chunk (safety-first approach)
node apps/cli/dist/index.js heal --recipe esm-hygiene --apply --max-files 5
```

**Risk Budget Parameters**:
- `--max-lines N` - Maximum total diff lines per chunk
- `--max-files N` - Maximum files touched per chunk
- Configurable via `.odavl.policy.yml` under `maxLinesPerPatch`/`maxFilesTouched`

**Undo System**: Automatic snapshots before applying changes:
- Backups stored in `reports/undo/<timestamp>/`
- Stack tracking in `reports/undo/stack.json`
- Protected paths (security/, *.spec.*, public-api/) automatically skipped

### Governor Policy System
Configuration in `.odavl.policy.yml` (see `odavl.policy.yml.sample`):

```yaml
governor:
  prsPerDay: 5                    # Daily PR creation limit
  ciMinutesPerHour: 60           # CI runtime budget
  maxConcurrentShadows: 3        # Parallel CI runs
  waves:
    - window: "22:00-06:00"      # Overnight window for automation
      maxPrs: 3
studio:
  telemetry: off                 # on|anonymized|off
```

## Development Patterns

### CLI Command Structure
All CLI commands return **structured JSON output** for integration:
```javascript
{
  "tool": "odavl",
  "action": "heal", 
  "recipe": "esm-hygiene",
  "mode": "dry-run",
  "pass": true,
  "chunks": [...],           // Planned work chunks
  "stats": { "files": 5, "lines": 120 },
  "validators": { ... }      // Optional validation results
}
```

### VS Code Extension Integration
The extension (`apps/vscode-ext`) provides a webview panel that:
- Calls CLI commands via `child_process.spawn`
- Displays telemetry mode from policy configuration
- Provides scan/heal/reports buttons
- Respects workspace-relative CLI path: `apps/cli/dist/index.js`

### Build & Package Management
```bash
# Install dependencies (from root)
pnpm install

# Build all packages
pnpm turbo build

# Build specific package
pnpm --filter @odavl/cli run build

# Run CLI from development build
node apps/cli/dist/index.js <command>
```

### Telemetry & Reporting
- **Optional telemetry** via policy configuration (`studio.telemetry`)
- Local logging to `reports/telemetry.log.jsonl`
- Usage analytics via `report telemetry summary --since 24h`
- No source code captured - only metrics and durations

## Integration Points

### GitHub CLI Dependencies
Many commands require `gh` CLI for GitHub API integration:
- `pr open` - Creates PRs with evidence sections
- `shadow run` - Triggers workflow_dispatch events
- `governor explain` - Queries current PR/CI usage

### File System Conventions
- **Configuration**: `.odavl.policy.yml` in workspace root
- **Reports**: All output logs and snapshots in `reports/`
- **Protected paths**: Automatic skipping of `security/`, `*.spec.*`, `public-api/`
- **TypeScript**: All packages use ES modules (`"type": "module"`)

## Common Debugging Patterns

**Heal Command Issues**:
1. Check `.odavl.policy.yml` for budget limits
2. Verify protected path exclusions aren't over-broad
3. Use `--dry-run` to preview before `--apply`
4. Check `reports/undo/stack.json` for recent changes

**Governor Blocks**:
1. Run `governor explain` to see current limits/usage
2. Check wave window configuration for time restrictions
3. Verify GitHub CLI authentication: `gh auth status`

**VS Code Extension**:
1. Ensure CLI is built: `pnpm --filter @odavl/cli run build`
2. Check workspace root detection in extension activation
3. Verify CLI path resolution: `apps/cli/dist/index.js`
````