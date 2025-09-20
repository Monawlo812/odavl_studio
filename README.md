[![CI](https://github.com/Monawlo812/odavl_studio/actions/workflows/ci.yml/badge.svg)](https://github.com/Monawlo812/odavl_studio/actions/workflows/ci.yml)

# ODAVL Studio

Bootstrap monorepo with pnpm workspaces and Turborepo.
This repo will host the VS Code extension, CLI, core packages, and infra.

## Healers 1.5

The CLI includes automated code healing with chunked execution and risk budgets.

### Usage
```bash
# ESM hygiene (add .js extensions to relative imports)
node apps/cli/dist/index.js heal --recipe esm-hygiene --dry-run --max-lines 40 --max-files 10

# Dependencies patch/minor upgrades (OSV-aware)
node apps/cli/dist/index.js heal --recipe deps-patch --dry-run --validate

# Apply changes (only first chunk)
node apps/cli/dist/index.js heal --recipe esm-hygiene --apply --max-files 5
```

### Flags
- `--recipe esm-hygiene|deps-patch|remove-unused` - Healing strategy
- `--dry-run|--apply` - Preview or execute changes
- `--validate` - Include type-checking and linting in output
- `--max-lines <n>` - Risk budget: max lines per chunk (default: 40)
- `--max-files <n>` - Risk budget: max files per chunk (default: 10)

## Governor

Rate limiting system to prevent CI resource exhaustion. Supports wave windows for time-based PR scheduling.

Wave windows like `"22:00-06:00"` allow overnight PR creation while blocking during business hours, enabling automated workflows during low-activity periods.

## Telemetry (opt-in)

ODAVL collects usage analytics to improve the tool. Configure via `.odavl.policy.yml`:

- **Modes**: `off` (default) | `on` | `anonymized`
- **Local logs**: `reports/telemetry.log.jsonl`
- **Remote endpoint**: Set `ODAVL_TELEMETRY_ENDPOINT` to POST aggregates (best-effort)
- **Privacy**: Numbers only - no source code or secrets captured

```yaml
studio:
  telemetry: off  # Change to 'on' or 'anonymized' to enable
```