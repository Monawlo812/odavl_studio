# ODAVL Studio – AI Coding Agent Instructions

## Project Overview
ODAVL Studio is an **automated development governance platform** for code healing, CI governance, and risk-budgeted automation. It uses pnpm workspaces, Turborepo, and a "Governor" policy system to ensure safe, chunked automation.

## Architecture & Key Components
- **Monorepo**: pnpm + Turborepo. See `apps/`, `packages/`, `examples/`, `reports/`.
- **CLI (`apps/cli`)**: Main entrypoint. Supports `scan`, `heal`, `shadow`, `pr`, `governor`, `undo` commands. All output is structured JSON.
- **VS Code Extension (`apps/vscode-ext`)**: Webview panel, calls CLI via `child_process.spawn`, shows telemetry, scan/heal/reports, and respects workspace CLI path.
- **Governor (`packages/policy`)**: Enforces PR/CI rate limits, wave windows, and risk budgets. Configured in `.odavl.policy.yml`.
- **Codemods (`packages/codemods`)**: Automated code transforms (e.g., `esmHygiene`, `depsPatchMinor`). All healing is chunked by risk budget.
- **Undo System**: Snapshots before changes, stored in `reports/undo/`.

## Critical Workflows
- **Install/build**: `pnpm install` → `pnpm turbo build` (or `pnpm --filter @odavl/cli run build`)
- **Scan**: `node apps/cli/dist/index.js scan` (health, lint, type errors)
- **Heal**: `node apps/cli/dist/index.js heal --recipe esm-hygiene --dry-run --max-lines 40 --max-files 10` (see `.odavl.policy.yml` for limits)
- **Apply healing**: Use `--apply` and restrict with `--max-files`/`--max-lines` for safety
- **Undo**: `node apps/cli/dist/index.js undo last` (restores from `reports/undo/`)
- **PR/CI**: `pr open` and `shadow run` require GitHub CLI (`gh`) and a GitHub remote
- **VS Code**: Use the extension for a webview dashboard and one-click operations

## Project Conventions & Patterns
- **All CLI output is JSON** for easy parsing/integration
- **Risk budgets**: Healing is always chunked by `max-lines`/`max-files` (see `.odavl.policy.yml`)
- **Protected paths**: `security/`, `*.spec.*`, `public-api/` are skipped by healers
- **Telemetry**: Controlled by `studio.telemetry` in `.odavl.policy.yml` (default: off). Logs in `reports/telemetry.log.jsonl`
- **TypeScript**: All packages use ES modules (`"type": "module"`)
- **Reports**: All logs, undo, and evidence in `reports/`

## Integration Points
- **GitHub CLI**: Needed for PR/CI commands
- **VS Code Extension**: Calls CLI, shows status, and provides a control panel
- **Web Launcher**: `pnpm launcher start` for a local web UI (see README)

## Debugging & Troubleshooting
- **Heal fails**: Check `.odavl.policy.yml` for limits, use `--dry-run`, and check `reports/undo/stack.json`
- **Governor blocks**: Run `governor explain`, check wave windows, and verify `gh auth status`
- **VS Code issues**: Ensure CLI is built, check extension activation, and CLI path

## Example Commands
```bash
pnpm install
pnpm --filter @odavl/cli run build
node apps/cli/dist/index.js scan
node apps/cli/dist/index.js heal --recipe esm-hygiene --dry-run
```

## References
- [README.md](../README.md) – Big picture, quickstart, and features
- [docs/](../docs/) – Guides, onboarding, and media
- [odavl.policy.yml.sample](../odavl.policy.yml.sample) – Policy config reference
- [apps/cli/README.md](../apps/cli/README.md) – CLI usage
- [apps/vscode-ext/README.md](../apps/vscode-ext/README.md) – Extension usage

---
*Update this file as workflows or conventions change. Focus on actionable, project-specific guidance for AI agents.*