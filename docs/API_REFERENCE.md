# ODAVL Studio API Reference

pnpm run doctor
pnpm run bundle:log
pnpm run metrics:log

This reference documents CLI commands, VS Code extension features, and exit codes for ODAVL Studio.

## CLI Commands

### odavl scan

- Description: Scan codebase health
- Usage: `odavl scan`
- Exit codes: 0 (success), 1 (error)

### odavl heal

- Description: Apply automated fixes
- Usage: `odavl heal --recipe esm-hygiene --dry-run`
- Args: `--apply`, `--max-files`, `--max-lines`
- Exit codes: 0 (success), 1 (error)

### odavl status

- Description: Check governance status
- Usage: `odavl status`

### odavl pr open

- Description: Create evidence-backed PRs
- Usage: `odavl pr open --title "..." --body "..."`

### odavl shadow run

- Description: Trigger CI workflows
- Usage: `odavl shadow run --workflow ci.yml`

### odavl undo last

- Description: Undo recent changes
- Usage: `odavl undo last`

## VS Code Extension

- Activation: On workspace open with `.odavl.policy.yml`
- Commands:
  - `ODAVL Studio: Open Panel`
  - Status bar: Governor status, Telemetry mode

## Examples

```bash
pnpm run doctor
pnpm run bundle:log
pnpm run metrics:log
```

## Exit Codes

- 0: Success
- 1: Error
- 126: Unknown flag
