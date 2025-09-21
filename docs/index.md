# ODAVL Studio Documentation

Welcome to the ODAVL Studio documentation site. ODAVL Studio is an automated development governance platform that provides CLI-driven code healing, CI governance, and risk-budgeted automation workflows.

## 🚀 Getting Started

- **[Landing Page](landing.md)** - Project overview and key features
- **[Quick Start Guide](quickstart.md)** - Get up and running in minutes
- **[Frequently Asked Questions](faq.md)** - Common questions and troubleshooting

## 📚 Documentation

- **[System Overview](overview.md)** - Architecture and core concepts
- **[GitHub App Setup](github-app-setup.md)** - Configure GitHub integration
- **[Docker Usage](docker.md)** - Containerized deployment guide
- **[Design Partner Playbook](design-partner-playbook.md)** - Early adopter guide

## 🛠 Components

- **[CLI Reference](../apps/cli/README.md)** - Command-line interface documentation
- **[VS Code Extension](../apps/vscode-ext/README.md)** - Editor integration guide
- **[Policy Configuration](../odavl.policy.yml.sample)** - Governor system settings

## 📦 Installation

### npm (CLI)
```bash
npm install -g @odavl/cli
odavl scan
```

### VS Code Extension
Install from the VS Code Marketplace or build from source.

### Docker
```bash
docker build -t odavl-studio .
docker run --rm -v "$(pwd):/workspace:ro" odavl-studio
```

## 🔧 Configuration

Create `.odavl.policy.yml` in your project root:

```yaml
governor:
  prsPerDay: 5
  ciMinutesPerHour: 60
studio:
  telemetry: off
```

## 🤝 Community

- **[GitHub Repository](https://github.com/Monawlo812/odavl_studio)** - Source code and contributions
- **[Issues & Support](https://github.com/Monawlo812/odavl_studio/issues)** - Bug reports and feature requests
- **[Release Notes](../RELEASE.md)** - Version history and upgrade guides

## 📄 License

ODAVL Studio is open source. See the repository for licensing details.

---

*Built with ❤️ for automated development governance*