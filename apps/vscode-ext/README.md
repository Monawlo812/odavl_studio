# ODAVL Studio Extension

Automated development governance extension for VS Code with code healing and CI management.

## Features

- **Code Health Monitoring**: Real-time codebase health scanning with ESLint and TypeScript error detection
- **Automated Code Healing**: Apply fixes with risk budgets and safety chunking
- **Governor System**: Rate limiting and policy enforcement for automated changes
- **CI/CD Integration**: Shadow workflow management and status monitoring
- **Evidence-backed PRs**: Create pull requests with comprehensive change documentation
- **Telemetry Dashboard**: Track automation usage and success metrics

## Commands

Access via Command Palette (`Ctrl+Shift+P`):

- `ODAVL Studio: Open Panel` - Launch the main control panel

## Status Bar Integration

The extension adds status indicators to VS Code's status bar:

- **Governor Status**: Shows current policy state (allowed/blocked)
- **Telemetry Mode**: Displays current telemetry setting (on/off/anonymized)

## Quick Start

1. Install the extension
2. Open a project with `.odavl.policy.yml` configuration
3. Use `Ctrl+Shift+P` → "ODAVL Studio: Open Panel"
4. Run scan to analyze codebase health
5. Apply automated fixes with built-in safety limits

## Configuration

Create `.odavl.policy.yml` in your workspace root:

```yaml
governor:
  prsPerDay: 5
  ciMinutesPerHour: 60
studio:
  telemetry: off
```

## Requirements

- VS Code 1.85.0 or higher
- Node.js 18+ (for CLI operations)
- Git repository with GitHub remote

## Documentation

- [Getting Started Guide](https://github.com/Monawlo812/odavl_studio/blob/main/docs/getting-started.md)
- [Policy Configuration](https://github.com/Monawlo812/odavl_studio/blob/main/odavl.policy.yml.sample)
- [CLI Reference](https://github.com/Monawlo812/odavl_studio/tree/main/apps/cli)

## Screenshots

![ODAVL Studio Panel](https://github.com/Monawlo812/odavl_studio/raw/main/docs/media/vscode-panel.png)
![Status Bar Integration](https://github.com/Monawlo812/odavl_studio/raw/main/docs/media/status-bar.png)

## Installation

### From VS Code Marketplace

Search for "ODAVL Studio" in the Extensions view (`Ctrl+Shift+X`) or install via:

```
ext install odavl.odavl-studio
```

### From Package

Download the latest `.vsix` from [Releases](https://github.com/Monawlo812/odavl_studio/releases) and install:

```bash
code --install-extension odavl-studio-0.3.0.vsix
```

## Issues & Support

Report issues at [GitHub Issues](https://github.com/Monawlo812/odavl_studio/issues)
