# ODAVL Studio Channels Architecture

## Overview

ODAVL Studio provides **three unified access channels** that all leverage the same CLI core while offering different user experiences:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ODAVL CLI Core                               │
│             (apps/cli - Single Source of Truth)                 │
└─────────────────┬───────────────┬───────────────┬───────────────┘
                  │               │               │
         ┌────────▼────────┐ ┌────▼────┐ ┌───────▼────────┐
         │  Web Launcher   │ │ VS Code │ │ GitHub App/CI  │
         │   (Channel 1)   │ │(Channel2)│ │  (Channel 3)   │
         └─────────────────┘ └─────────┘ └────────────────┘
```

## Channel 1: Standalone Web Launcher

### Purpose
Zero-terminal web interface for local development and experimentation.

### Architecture
- **Frontend**: Clean HTML/CSS/JS with real-time updates
- **Backend**: Express server with SSE for live logs
- **API Endpoints**: REST + Server-Sent Events
- **Reports**: Saved to `reports/launcher/`

### API Design
```
POST /api/scan     → CLI: scan --json
POST /api/heal     → CLI: heal --recipe esm-hygiene --dry-run
POST /api/shadow   → CLI: shadow run --wait  
POST /api/pr       → CLI: pr open --explain --dry-run
POST /api/magic    → Sequential: scan→heal→shadow→pr
GET  /api/status   → CLI: status --json
GET  /api/logs/stream → SSE real-time log streaming
```

### User Flow
1. `pnpm launcher start` → Opens http://localhost:7777
2. Professional dashboard with status cards and control buttons
3. Click any button → API call → CLI execution → Real-time logs
4. Results auto-saved with timestamps for traceability

### Benefits
- **No terminal knowledge required**
- **Visual feedback** with professional UI
- **Instant status** dashboard
- **Full audit trail** in reports

## Channel 2: VS Code Extension (Control Center)

### Purpose
Integrated development experience within VS Code editor.

### Architecture
- **Extension Host**: TypeScript extension with webview
- **Control Center**: HTML interface with VS Code theming
- **Magic Workflow**: Progress notifications with step tracking
- **Reports**: Saved to `reports/vscode/`

### Features
```
Command Palette:
├── ODAVL: Open Control Center
├── ODAVL: Run Magic Workflow
├── ODAVL: Scan Codebase
└── ODAVL: Generate Reports

Status Bar:
└── "ODAVL ▷ Control" (click to open Control Center)

Walkthrough:
├── Get Started with ODAVL
├── Understanding the Control Center
└── Running Your First Magic Workflow
```

### User Flow
1. Install extension → Status bar shows "ODAVL ▷ Control"
2. Click status bar OR use Command Palette
3. Control Center opens with grid layout buttons
4. Magic workflow shows progress notifications
5. Confetti animation celebrates success

### Benefits
- **Native VS Code integration**
- **Zero context switching**
- **Progress transparency**
- **Celebration UX** (confetti effects)

## Channel 3: GitHub App + CI Integration

### Purpose
Enterprise automation with governance guardrails for team workflows.

### Architecture
- **GitHub App**: Webhook-driven automation
- **CI Workflow**: `app-integration.yml` triggered on PR events
- **Governor Integration**: Policy enforcement with transparent reporting
- **Reports**: Saved to `reports/channels/`

### Governance Flow
```
PR Event → CI Trigger → Governor Check → Health Scan → Comment Report
                    ↓
                 if allowed → Healing Plan → Shadow CI → Status Updates
                 if blocked → Policy explanation + retry guidance
```

### Report Format
```markdown
## 🎛️ ODAVL Studio Governance Report

### 📊 Governor Status
- PR Budget: 2/5 PRs used today
- Automation: ✅ Allowed

### 🔍 Health Scan  
- Health Score: 8.5/10
- Issues Found: 3

### 🔧 Healing Plan
- Files to heal: 2
- Estimated changes: 15 lines

### 🚀 Next Steps
- ✅ Governor allows automation
- 🔄 Shadow CI will run automatically
```

### Benefits
- **Automated governance** at scale
- **Policy enforcement** with transparency
- **Team collaboration** through PR comments
- **Audit trail** for compliance

## Unified CLI Core

All channels execute the same CLI commands ensuring consistency:

```bash
# Core commands used by all channels:
node apps/cli/dist/index.js scan --json
node apps/cli/dist/index.js heal --recipe esm-hygiene --apply --max-files 5
node apps/cli/dist/index.js shadow run --wait
node apps/cli/dist/index.js pr open --explain --dry-run
node apps/cli/dist/index.js governor explain --json
node apps/cli/dist/index.js report health --since 1h
```

### Benefits of Unified Core
- **No code duplication** across channels
- **Consistent behavior** regardless of access method  
- **Single point of truth** for business logic
- **Easier maintenance** and testing
- **Feature parity** across all channels

## Report Namespacing

Each channel maintains separate report directories:

```
reports/
├── channels/          # Cross-channel documentation
├── launcher/          # Web launcher API results
├── vscode/           # VS Code extension outputs
└── CI/               # GitHub App CI artifacts
```

## Configuration

All channels respect the same `.odavl.policy.yml` configuration:

```yaml
governor:
  prsPerDay: 5
  ciMinutesPerHour: 60
  maxConcurrentShadows: 3
  waves:
    - window: "22:00-06:00"
      maxPrs: 3

studio:
  telemetry: anonymized
  
healing:
  maxLinesPerPatch: 120
  maxFilesTouched: 6
```

## Channel Selection Guide

| Use Case | Recommended Channel | Why |
|----------|-------------------|-----|
| Local development | Web Launcher | Zero-terminal, visual feedback |
| Active coding | VS Code Extension | Native integration, no context switch |
| Team automation | GitHub App/CI | Governance at scale, policy enforcement |
| Experimentation | Web Launcher | Safe sandbox environment |
| Code review | GitHub App/CI | Automated governance reports |
| Learning ODAVL | VS Code Extension | Interactive walkthrough |

## Security Considerations

- **Launcher**: Localhost only, no external access
- **VS Code**: Extension sandbox, workspace-scoped  
- **GitHub App**: Minimum required permissions, webhook validation
- **All channels**: Respect protected paths and Governor constraints

The three-channel architecture provides flexibility while maintaining consistency, allowing users to choose the best access method for their workflow while ensuring enterprise-grade governance and safety.