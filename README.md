[![CI](https://github.com/Monawlo812/odavl_studio/actions/workflows/ci.yml/badge.svg)](https://github.com/Monawlo812/odavl_studio/actions/workflows/ci.yml)

# ODAVL Studio

**Automated Development Governance Platform** - Enterprise-grade code healing with policy-driven safety guardrails.

> Start here: **[docs/landing.md](docs/landing.md)** — value, screenshots, and a 60-second Quickstart.

## Features

🔧 **Automated Code Healing** - ESM hygiene, dependency updates, unused code removal  
📊 **Risk-Budgeted Execution** - Chunked operations with configurable limits  
🛡️ **Governor System** - Rate limiting for PRs and CI resource usage  
🔄 **Shadow CI** - Triggered workflows with live status monitoring  
💾 **Safety Systems** - Automatic undo snapshots and protected paths  
🎯 **VS Code Integration** - WebView panel with one-click operations  

## Quickstart (60s)

```bash
# 1. Install dependencies
pnpm install

# 2. Build CLI
pnpm --filter @odavl/cli run build

# 3. Run health scan
node apps/cli/dist/index.js scan

# 4. Try healing (dry-run)
node apps/cli/dist/index.js heal --recipe esm-hygiene --dry-run
```

**VS Code**: Install extension and use `ODAVL Studio: Open Panel` command.

📖 **Documentation**: [Overview](docs/overview.md) | [Quickstart](docs/quickstart.md) | [FAQ](docs/faq.md)  
📊 **Reports**: Check `reports/` for analysis artifacts and logs

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

## Media

Recording guide: `docs/media/README.md`

Placeholders (replace with real screenshots/GIFs):
- [`docs/media/scan.png`](docs/media/scan.png)
- [`docs/media/heal.png`](docs/media/heal.png)  
- [`docs/media/shadow.png`](docs/media/shadow.png)
- [`docs/media/pr.png`](docs/media/pr.png)