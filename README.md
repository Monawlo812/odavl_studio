[![CI](https://github.com/Monawlo812/odavl_studio/actions/workflows/ci.yml/badge.svg)](https://github.com/Monawlo812/odavl_studio/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://monawlo812.github.io/odavl_studio/)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue)](https://github.com/Monawlo812/odavl_studio/pkgs/container/odavl-studio)
[![Version](https://img.shields.io/badge/version-0.3.0-green)](https://github.com/Monawlo812/odavl_studio/releases)
[![npm](https://img.shields.io/npm/v/odavl-cli)](https://www.npmjs.com/package/odavl-cli)

# ODAVL Studio

**Automated Development Governance Platform** - Enterprise-grade code healing with policy-driven safety guardrails.

> Start here: **[docs/landing.md](docs/landing.md)** — value, screenshots, and a 60-second Quickstart.  
> **[📖 Documentation Site](https://monawlo812.github.io/odavl_studio/)** — Complete guides and API reference

## Features

🔧 **Automated Code Healing** - ESM hygiene, dependency updates, unused code removal  
📊 **Risk-Budgeted Execution** - Chunked operations with configurable limits  
🛡️ **Governor System** - Rate limiting for PRs and CI resource usage  
🔄 **Shadow CI** - Triggered workflows with live status monitoring  
💾 **Safety Systems** - Automatic undo snapshots and protected paths  
🎯 **Activity Bar icon** - Click ODAVL icon in left sidebar for instant access  
🎯 **VS Code Integration** - WebView panel with one-click operations  

## 🎛️ 3 Channels to Run ODAVL

ODAVL Studio provides **three professional access methods** for different workflows:

### 1️⃣ **Standalone Web Launcher** (Zero-Terminal)
Perfect for local development and experimentation:

```bash
pnpm launcher start
# Opens http://localhost:7777 with clean UI
```

**Features**:
- 🌐 **Professional web interface** with real-time logs
- 🔘 **One-click buttons** for Scan, Heal, Shadow, PR, Magic
- 📊 **Live status dashboard** with governor state and telemetry
- 📝 **SSE log streaming** for immediate feedback
- 💾 **Auto-saved reports** to `reports/launcher/`

### 2️⃣ **VS Code Extension** (Control Center)
Integrated development experience within your editor:

```bash
# Install extension, then use Command Palette:
# "ODAVL: Open Control Center"
```

**Features**:
- 🎛️ **Control Center webview** with grid layout and confetti
- ⚡ **Magic workflow** with progress notifications
- 📋 **Command palette** integration
- 🎯 **Status bar control** ("ODAVL ▷ Control" button)
- 🎯 **Activity Bar icon** - Click ODAVL icon in left sidebar for instant access
- 📖 **Interactive walkthrough** for new users
- 💾 **Reports saved** to `reports/vscode/`

### 3️⃣ **GitHub App + CI Integration** (Automated Governance)
Enterprise automation with safety guardrails:

```bash
# Install GitHub App on repositories
./infra/github-app/bootstrap.sh
```

**Features**:
- 🤖 **Automated PR comments** with governance reports
- 🛡️ **Governor constraints** enforced (daily PR limits, CI budgets)
- 🔄 **Shadow CI triggers** on pull request events
- 📊 **Health scores** and healing recommendations
- 🚨 **Policy enforcement** with transparent reporting
- 💾 **CI artifacts** saved to `reports/channels/`

---

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

**VS Code**: Install extension ([Marketplace](https://marketplace.visualstudio.com/items?itemName=odavl.odavl-studio)) and use `ODAVL Studio: Open Panel` command.

📖 **Documentation**: [Overview](docs/overview.md) | [Quickstart](docs/quickstart.md) | [FAQ](docs/faq.md) | [📖 Docs Site](https://monawlo812.github.io/odavl_studio/)  
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

## Support & Onboarding

- **[Support Channels](SUPPORT.md)** - Get help and report issues
- **[Partner Onboarding](.github/ISSUE_TEMPLATE/onboarding.md)** - Design partner setup checklist
- **[Design Partner Playbook](docs/design-partner-playbook.md)** - Early adopter guide