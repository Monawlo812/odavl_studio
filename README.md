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