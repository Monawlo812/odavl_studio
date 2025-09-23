# ODAVL Studio Overview

## What is ODAVL Studio?

ODAVL Studio is an **automated development governance platform** that enables safe, policy-driven code maintenance at enterprise scale. It combines intelligent code healing, rate limiting, and safety guardrails to automate routine maintenance tasks without compromising quality or stability.

## Why ODAVL Studio?

- **Reduce Manual Overhead**: Automate ESM imports, dependency updates, and code cleanup
- **Prevent Resource Exhaustion**: Governor system limits PR creation and CI usage
- **Maintain Safety**: Risk budgets, chunked execution, and automatic undo snapshots
- **Enable Overnight Automation**: Wave windows for scheduled, unattended operations

## How It Works

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   VS Code       │───▶│     CLI      │───▶│   Governor      │
│   Extension     │    │   Commands   │    │  Rate Limits    │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│    WebView      │    │   Codemods   │    │   Policy        │
│    Panel        │    │  (Healers)   │    │  Configuration  │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

## Architecture

**CLI Core**: `@odavl/cli` - Main command interface  
**VS Code**: `@odavl/vscode-ext` - Developer UI integration  
**Codemods**: `@odavl/codemods` - Code transformation engine  
**Policy**: `@odavl/policy` - Governor rate limiting system  
**Reports**: `reports/` - Telemetry, logs, and undo snapshots
