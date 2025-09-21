# ODAVL CLI

Automated development governance CLI for code healing and CI management.

## Installation

```bash
npm install -g @odavl/cli
```

## Quick Start

```bash
# Scan codebase health
odavl scan

# Apply automated fixes with safety limits
odavl heal --recipe esm-hygiene --dry-run
odavl heal --recipe esm-hygiene --apply --max-files 5

# Check governance status
odavl status
odavl governor explain

# Create evidence-backed PRs
odavl pr open --title "ESM hygiene fixes" --body "Automated import fixes"

# Trigger CI workflows
odavl shadow run --workflow ci.yml
odavl shadow status

# Undo recent changes
odavl undo last
```

## Configuration

Create `.odavl.policy.yml` in your project root:

```yaml
governor:
  prsPerDay: 5
  ciMinutesPerHour: 60
studio:
  telemetry: off
```

## Documentation

- [Full Documentation](https://github.com/Monawlo812/odavl_studio)
- [Policy Configuration](https://github.com/Monawlo812/odavl_studio/blob/main/odavl.policy.yml.sample)