# H1: File Inventory & Classification

## Classification Buckets
- **CORE:** Main application, packages, and source code
- **USEFUL:** Docs, examples, onboarding, config, workflows
- **LEGACY:** Tests, fixtures, coverage, golden, sample, old configs
- **NOISE:** Build artifacts, cache, logs, binaries, node_modules, .turbo, .git, .exe, .log, .tar.gz, .cookie, etc.

## Methodology
- Used path and filename patterns to classify files (see script commands in evidence)
- Classification is not destructive; no files are deleted or moved in H1
- Each file is assigned to one or more buckets based on path, extension, and usage signals

## Inventory Files
- `FILES_INVENTORY.csv`: Full file list with size and last modified
- `FILES_CORE.txt`: Likely core code/packages
- `FILES_USEFUL.txt`: Docs, onboarding, config, workflows
- `FILES_LEGACY.txt`: Tests, fixtures, coverage, golden, sample
- `FILES_NOISE.txt`: Build/cache/log/binary/noise

## Reasoning & Last-Used Signals
- **CORE:** Includes all `apps/`, `packages/`, and main source files; cross-referenced with import graphs and CI scripts
- **USEFUL:** Includes all documentation, onboarding, and workflow files; referenced in CI and docs
- **LEGACY:** Includes all test, fixture, and coverage files; last-used signals from test runs and coverage reports
- **NOISE:** Includes all cache, build, binary, and log files; not referenced in CI, docs, or import graphs

## Next Steps
- H2: Quarantine (dry-run delete) of LEGACY and NOISE candidates, with full end-to-end verification

---

*See inventory and classification files in this run directory for full details.*
