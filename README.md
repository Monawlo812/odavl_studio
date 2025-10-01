
<<<<<<< HEAD
<<<<<<< HEAD
# ODAVL Studio

<<<<<<< HEAD
=======
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
[![CI](https://github.com/Monawlo812/odavl_studio/actions/workflows/ci.yml/badge.svg)](https://github.com/Monawlo812/odavl_studio/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://monawlo812.github.io/odavl_studio/)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue)](https://github.com/Monawlo812/odavl_studio/pkgs/container/odavl-studio)
[![Version](https://img.shields.io/badge/version-0.1.0-green)](https://github.com/Monawlo812/odavl_studio/releases)
[![npm](https://img.shields.io/npm/v/@odavl/cli)](https://www.npmjs.com/package/@odavl/cli)
[![License](https://img.shields.io/github/license/Monawlo812/odavl_studio)](LICENSE)

<<<<<<< HEAD
**Automated Development Governance Platform** - Enterprise-grade code healing with policy-driven safety guardrails.
=======
![Readiness](https://img.shields.io/badge/readiness-passing-brightgreen)
ODAVL Studio is an automated development governance platform for code healing,
CI management, and compliance.
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)

- **Automated code health scanning and healing**
- **Governance and risk policy enforcement**
- **Security and compliance automation**
- **Evidence-backed PRs and CI/CD integration**
[...]
[![Github Test](https://github.com/zricethezav/gitleaks/actions/workflows/test.yml/badge.svg)](https://github.com/zricethezav/gitleaks/actions/workflows/test.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/zricethezav/gitleaks.svg)](https://hub.docker.com/r/zricethezav/gitleaks)
[![Gitleaks Badge](https://img.shields.io/badge/protected%20by-gitleaks-blue)](https://github.com/zricethezav/gitleaks-action)
[![Twitter Follow](https://img.shields.io/twitter/follow/zricethezav?label=Follow%20zricethezav&style=social&color=blue)](https://twitter.com/intent/follow?screen_name=zricethezav)

Gitleaks is a SAST tool for **detecting** and **preventing** hardcoded secrets like
passwords, api keys, and tokens in git repos. Gitleaks is an **easy-to-use, all-in-one
solution** for detecting secrets, past or present, in your code.

Gitleaks can be installed using Homebrew, Docker, or Go. Gitleaks is also available in
binary form for many popular platforms and OS types on the
[releases page](https://github.com/zricethezav/gitleaks/releases). In addition, Gitleaks
can be implemented as a pre-commit hook directly in your repo or as a GitHub action using
[Gitleaks-Action](https://github.com/gitleaks/gitleaks-action).

for a [native execution of GitLeaks](https://github.com/zricethezav/gitleaks/releases)
or use the [`gitleaks-docker` pre-commit ID](https://github.com/zricethezav/gitleaks/blob/master/.pre-commit-hooks.yaml)
for executing GitLeaks using the [official Docker images](https://docs.docker.com/)

```shell
➜ git commit -m "this commit contains a secret"
Detect hardcoded secrets.................................................Failed

 

ODAVL Studio is an automated development governance platform for code healing,
CI management, and compliance.

- **Automated code health scanning and healing**
- **Governance and risk policy enforcement**
- **Security and compliance automation**
- **Evidence-backed PRs and CI/CD integration**
- **Comprehensive documentation and readiness gates**
Usage:
  gitleaks [command]

Available Commands:
  completion  generate the autocompletion script for the specified shell
  detect      detect secrets in code
  help        Help about any command
  protect     protect secrets in code
  version     display gitleaks version

Flags:
  -b, --baseline-path string       path to baseline with issues that can be ignored
  -c, --config string              config file path
                   order of precedence:
                   1. --config/-c
                   2. env var GITLEAKS_CONFIG
                   3. (--source/-s)/.gitleaks.toml
                   If none of the three options are used,
                   then gitleaks will use the default config
    --exit-code int              exit code when leaks have been encountered (default 1)
  -h, --help                       help for gitleaks
  -l, --log-level string           log level (trace, debug, info, warn, error, fatal) (default "info")
    --max-target-megabytes int   files larger than this will be skipped
    --no-color                   turn off color for verbose output
    --no-banner                  suppress banner
    --redact                     redact secrets from logs and stdout
  -f, --report-format string       output format (json, csv, junit, sarif) (default "json")
  -r, --report-path string         report file
  -s, --source string              path to source (default ".")
  -v, --verbose                    show verbose output from scan


Use "gitleaks [command] --help" for more information about a command.

```text

```shell
git log -L 37,37:checks_test.go ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29
```text

```shell
1 - leaks or error encountered
126 - unknown flag
```text


## Documentation

- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Security Guide](docs/SECURITY_GUIDE.md)
- [Compliance Guide](docs/COMPLIANCE_GUIDE.md)
- [API Reference](docs/API_REFERENCE.md)

## Readiness & Documentation Checks

ODAVL Studio enforces documentation and readiness via CI:

- All guides above must be present and up to date.
- API Reference is auto-generated via `pnpm docs:gen` and checked in CI with
  `pnpm docs:check`.
- CI will fail if documentation is missing or outdated.
- Evidence of documentation is archived in
  `reports/evaluations/<date>/docs/`.

## Quick Start

See [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for setup, workflow, and troubleshooting.

---

<<<<<<< HEAD
## Quickstart
=======
## Gitleaks
  

  
```shell
┌─○───┐
│ │╲  │
  
│ │ ○ │
│ ○ ░ │
└─░───┘
  
```shell

[![Github Test](https://github.com/zricethezav/gitleaks/actions/workflows/test.yml/badge.svg)](https://github.com/zricethezav/gitleaks/actions/workflows/test.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/zricethezav/gitleaks.svg)](https://hub.docker.com/r/zricethezav/gitleaks)
[![Gitleaks Badge](https://img.shields.io/badge/protected%20by-gitleaks-blue)](https://github.com/zricethezav/gitleaks-action)
[![Twitter Follow](https://img.shields.io/twitter/follow/zricethezav?label=Follow%20zricethezav&style=social&color=blue)](https://twitter.com/intent/follow?screen_name=zricethezav)

### Join our Discord

[![Discord](https://img.shields.io/discord/1102689410522284044.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/8Hzbrnkr7E)
Gitleaks is a SAST tool for **detecting** and **preventing** hardcoded secrets like
passwords, api keys, and tokens in git repos. Gitleaks is an **easy-to-use, all-in-one
solution** for detecting secrets, past or present, in your code.
➜  ~/code(master) gitleaks detect --source . -v
for a [native execution of GitLeaks](https://github.com/zricethezav/gitleaks/releases)
or use the [`gitleaks-docker` pre-commit ID](https://github.com/zricethezav/gitleaks/blob/master/.pre-commit-hooks.yaml)
for executing GitLeaks using the [official Docker images](https://docs.docker.com/)
    ○ ░
    ░    gitleaks


Finding:     "export BUNDLE_ENTERPRISE__CONTRIBSYS__COM=cafebabe:deadbeef",
Secret:      cafebabe:deadbeef
RuleID:      sidekiq-secret
Entropy:     2.609850
File:        cmd/generate/config/rules/sidekiq.go
Line:        23
Commit:      cd5226711335c68be1e720b318b7bc3135a30eb2
Author:      John
Email:       john@users.noreply.github.com
Date:        2022-08-03T12:31:40Z
Fingerprint: cd5226711335c68be1e720b318b7bc3135a30eb2:cmd/generate/config/rules/sidekiq.go:sidekiq-secret:23

## Getting Started

Gitleaks can be installed using Homebrew, Docker, or Go. Gitleaks is also available in
binary form for many popular platforms and OS types on the
[releases page](https://github.com/zricethezav/gitleaks/releases). In addition, Gitleaks
can be implemented as a pre-commit hook directly in your repo or as a GitHub action using
[Gitleaks-Action](https://github.com/gitleaks/gitleaks-action).

### Installing
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)

```bash

# MacOS
brew install gitleaks

# Docker (DockerHub)
docker pull zricethezav/gitleaks:latest
docker run -v ${path_to_host_folder_to_scan}:/path zricethezav/gitleaks:latest [COMMAND] --source="/path" [OPTIONS]

# Docker (ghcr.io)
docker pull ghcr.io/gitleaks/gitleaks:latest
docker run -v ${path_to_host_folder_to_scan}:/path \
  ghcr.io/gitleaks/gitleaks:latest [COMMAND] --source="/path" [OPTIONS]

# From Source
git clone https://github.com/gitleaks/gitleaks.git
cd gitleaks
make build
```shell

### GitHub Action

<<<<<<< HEAD
=======
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
# ODAVL Studio

![Readiness](https://img.shields.io/badge/readiness-passing-brightgreen)
ODAVL Studio is an automated development governance platform for code healing,
CI management, and compliance.

- **Automated code health scanning and healing**
- **Governance and risk policy enforcement**
- **Security and compliance automation**
- **Evidence-backed PRs and CI/CD integration**
[...]
[![Github Test](https://github.com/zricethezav/gitleaks/actions/workflows/test.yml/badge.svg)](https://github.com/zricethezav/gitleaks/actions/workflows/test.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/zricethezav/gitleaks.svg)](https://hub.docker.com/r/zricethezav/gitleaks)
[![Gitleaks Badge](https://img.shields.io/badge/protected%20by-gitleaks-blue)](https://github.com/zricethezav/gitleaks-action)
[![Twitter Follow](https://img.shields.io/twitter/follow/zricethezav?label=Follow%20zricethezav&style=social&color=blue)](https://twitter.com/intent/follow?screen_name=zricethezav)

Gitleaks is a SAST tool for **detecting** and **preventing** hardcoded secrets like
passwords, api keys, and tokens in git repos. Gitleaks is an **easy-to-use, all-in-one
solution** for detecting secrets, past or present, in your code.

Gitleaks can be installed using Homebrew, Docker, or Go. Gitleaks is also available in
binary form for many popular platforms and OS types on the
[releases page](https://github.com/zricethezav/gitleaks/releases). In addition, Gitleaks
can be implemented as a pre-commit hook directly in your repo or as a GitHub action using
[Gitleaks-Action](https://github.com/gitleaks/gitleaks-action).

for a [native execution of GitLeaks](https://github.com/zricethezav/gitleaks/releases)
or use the [`gitleaks-docker` pre-commit ID](https://github.com/zricethezav/gitleaks/blob/master/.pre-commit-hooks.yaml)
for executing GitLeaks using the [official Docker images](https://docs.docker.com/)

```shell
➜ git commit -m "this commit contains a secret"
Detect hardcoded secrets.................................................Failed

 

ODAVL Studio is an automated development governance platform for code healing,
CI management, and compliance.

- **Automated code health scanning and healing**
- **Governance and risk policy enforcement**
- **Security and compliance automation**
- **Evidence-backed PRs and CI/CD integration**
- **Comprehensive documentation and readiness gates**
Usage:
  gitleaks [command]

Available Commands:
  completion  generate the autocompletion script for the specified shell
  detect      detect secrets in code
  help        Help about any command
  protect     protect secrets in code
  version     display gitleaks version

Flags:
  -b, --baseline-path string       path to baseline with issues that can be ignored
  -c, --config string              config file path
                   order of precedence:
                   1. --config/-c
                   2. env var GITLEAKS_CONFIG
                   3. (--source/-s)/.gitleaks.toml
                   If none of the three options are used,
                   then gitleaks will use the default config
    --exit-code int              exit code when leaks have been encountered (default 1)
  -h, --help                       help for gitleaks
  -l, --log-level string           log level (trace, debug, info, warn, error, fatal) (default "info")
    --max-target-megabytes int   files larger than this will be skipped
    --no-color                   turn off color for verbose output
    --no-banner                  suppress banner
    --redact                     redact secrets from logs and stdout
  -f, --report-format string       output format (json, csv, junit, sarif) (default "json")
  -r, --report-path string         report file
  -s, --source string              path to source (default ".")
  -v, --verbose                    show verbose output from scan


Use "gitleaks [command] --help" for more information about a command.

```text

```shell
git log -L 37,37:checks_test.go ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29
```text

```shell
1 - leaks or error encountered
126 - unknown flag
```text


## Documentation

- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Security Guide](docs/SECURITY_GUIDE.md)
- [Compliance Guide](docs/COMPLIANCE_GUIDE.md)
- [API Reference](docs/API_REFERENCE.md)

## Readiness & Documentation Checks

ODAVL Studio enforces documentation and readiness via CI:

- All guides above must be present and up to date.
- API Reference is auto-generated via `pnpm docs:gen` and checked in CI with
  `pnpm docs:check`.
- CI will fail if documentation is missing or outdated.
- Evidence of documentation is archived in
  `reports/evaluations/<date>/docs/`.

## Quick Start

See [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for setup, workflow, and troubleshooting.

---

## Gitleaks
  

  
```shell
┌─○───┐
│ │╲  │
  
│ │ ○ │
│ ○ ░ │
└─░───┘
  
```shell

[![Github Test](https://github.com/zricethezav/gitleaks/actions/workflows/test.yml/badge.svg)](https://github.com/zricethezav/gitleaks/actions/workflows/test.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/zricethezav/gitleaks.svg)](https://hub.docker.com/r/zricethezav/gitleaks)
[![Gitleaks Badge](https://img.shields.io/badge/protected%20by-gitleaks-blue)](https://github.com/zricethezav/gitleaks-action)
[![Twitter Follow](https://img.shields.io/twitter/follow/zricethezav?label=Follow%20zricethezav&style=social&color=blue)](https://twitter.com/intent/follow?screen_name=zricethezav)

### Join our Discord

[![Discord](https://img.shields.io/discord/1102689410522284044.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/8Hzbrnkr7E)
Gitleaks is a SAST tool for **detecting** and **preventing** hardcoded secrets like
passwords, api keys, and tokens in git repos. Gitleaks is an **easy-to-use, all-in-one
solution** for detecting secrets, past or present, in your code.
➜  ~/code(master) gitleaks detect --source . -v
for a [native execution of GitLeaks](https://github.com/zricethezav/gitleaks/releases)
or use the [`gitleaks-docker` pre-commit ID](https://github.com/zricethezav/gitleaks/blob/master/.pre-commit-hooks.yaml)
for executing GitLeaks using the [official Docker images](https://docs.docker.com/)
    ○ ░
    ░    gitleaks


Finding:     "export BUNDLE_ENTERPRISE__CONTRIBSYS__COM=cafebabe:deadbeef",
Secret:      cafebabe:deadbeef
RuleID:      sidekiq-secret
Entropy:     2.609850
File:        cmd/generate/config/rules/sidekiq.go
Line:        23
Commit:      cd5226711335c68be1e720b318b7bc3135a30eb2
Author:      John
Email:       john@users.noreply.github.com
Date:        2022-08-03T12:31:40Z
Fingerprint: cd5226711335c68be1e720b318b7bc3135a30eb2:cmd/generate/config/rules/sidekiq.go:sidekiq-secret:23

## Getting Started

Gitleaks can be installed using Homebrew, Docker, or Go. Gitleaks is also available in
binary form for many popular platforms and OS types on the
[releases page](https://github.com/zricethezav/gitleaks/releases). In addition, Gitleaks
can be implemented as a pre-commit hook directly in your repo or as a GitHub action using
[Gitleaks-Action](https://github.com/gitleaks/gitleaks-action).

### Installing

```bash

# MacOS
brew install gitleaks

# Docker (DockerHub)
docker pull zricethezav/gitleaks:latest
docker run -v ${path_to_host_folder_to_scan}:/path zricethezav/gitleaks:latest [COMMAND] --source="/path" [OPTIONS]

# Docker (ghcr.io)
docker pull ghcr.io/gitleaks/gitleaks:latest
docker run -v ${path_to_host_folder_to_scan}:/path \
  ghcr.io/gitleaks/gitleaks:latest [COMMAND] --source="/path" [OPTIONS]

# From Source
git clone https://github.com/gitleaks/gitleaks.git
cd gitleaks
make build
```shell

### GitHub Action

Check out the official
[Gitleaks GitHub Action](https://github.com/gitleaks/gitleaks-action)

<<<<<<< HEAD
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
📖 **Documentation**: [Overview](docs/overview.md) | [Quickstart](docs/quickstart.md) | [FAQ](docs/faq.md) | [MVP Launch Guide](docs/mvp-launch-guide.md) | [📖 Docs Site](https://monawlo812.github.io/odavl_studio/)
📊 **Reports**: Check `reports/` for analysis artifacts and logs

## Policy & Gates

- See `.odavl.policy.yml` for risk budgets, protected paths, and governor settings.
- See `.odavl/gates.yml` for CI/test acceptance gates.

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

<<<<<<< HEAD
=======
Check out the official
[Gitleaks GitHub Action](https://github.com/gitleaks/gitleaks-action)

=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
```shell
name: gitleaks
on: [pull_request, push, workflow_dispatch]
jobs:
  scan:
    name: gitleaks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE}} # Only required for Organizations, not personal accounts.
<<<<<<< HEAD
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
```yaml

### Pre-Commit

1. Install pre-commit from [pre-commit.com](https://pre-commit.com/#install)
2. Create a `.pre-commit-config.yaml` file at the root of your repository with the following content:

  ```yaml
   repos:
     - repo: https://github.com/gitleaks/gitleaks
       rev: v8.16.1
       hooks:
         - id: gitleaks
   ```

  for a [native execution of GitLeaks](https://github.com/zricethezav/gitleaks/releases)
  or use the [`gitleaks-docker` pre-commit ID](https://github.com/zricethezav/gitleaks/blob/master/.pre-commit-hooks.yaml)
  for executing GitLeaks using the [official Docker images](https://docs.docker.com/)

1. Auto-update the config to the latest repos' versions by executing `pre-commit autoupdate`
1. Install with `pre-commit install`
1. Now you're all set!

```shell
➜ git commit -m "this commit contains a secret"
Detect hardcoded secrets.................................................Failed
```shell

Note: to disable the gitleaks pre-commit hook you can prepend `SKIP=gitleaks` to the
commit command and it will skip running gitleaks

```shell
➜ SKIP=gitleaks git commit -m "skip gitleaks check"
Detect hardcoded secrets................................................Skipped
```shell

## Usage

```shell
Usage:
  gitleaks [command]

Available Commands:
  completion  generate the autocompletion script for the specified shell
  detect      detect secrets in code
  help        Help about any command
  protect     protect secrets in code
  version     display gitleaks version

Flags:
  -b, --baseline-path string       path to baseline with issues that can be ignored
  -c, --config string              config file path
                                   order of precedence:
                                   1. --config/-c
                                   2. env var GITLEAKS_CONFIG
                                   3. (--source/-s)/.gitleaks.toml
                                   If none of the three options are used, then gitleaks will use the default config
      --exit-code int              exit code when leaks have been encountered (default 1)
  -h, --help                       help for gitleaks
  -l, --log-level string           log level (trace, debug, info, warn, error, fatal) (default "info")
      --max-target-megabytes int   files larger than this will be skipped
      --no-color                   turn off color for verbose output
      --no-banner                  suppress banner
      --redact                     redact secrets from logs and stdout
  -f, --report-format string       output format (json, csv, junit, sarif) (default "json")
  -r, --report-path string         report file
  -s, --source string              path to source (default ".")
  -v, --verbose                    show verbose output from scan

Use "gitleaks [command] --help" for more information about a command.
```shell

### Commands

There are two commands you will use to detect secrets; `detect` and `protect`.

#### Detect

The `detect` command is used to scan repos, directories, and files. This command can be
used on developer machines and in CI environments.

When running `detect` on a git repository, gitleaks will parse the output of a
`git log -p` command (you can see how this executed
[See git.go patch example](https://github.com/zricethezav/gitleaks/blob/7240e16769b92d2a1b137c17d6bf9d55a8562899/git/git.go#L17-L25)).
[`git log -p` generates patches](https://git-scm.com/docs/git-log#_generating_patch_text_with_p)
which gitleaks will use to detect secrets.
You can configure what commits `git log` will range over by using the `--log-opts` flag.
`--log-opts` accepts any option for `git log -p`.
For example, if you wanted to run gitleaks on a range of commits you could use the
following command: `gitleaks detect --source . --log-opts="--all commitA..commitB"`.
See the `git log` [documentation](https://git-scm.com/docs/git-log) for more information.

You can scan files and directories by using the `--no-git` option.

If you want to run only specific rules you can do so by using the `--enable-rule` option
(with a rule ID as a parameter), this flag can be used multiple times. For example:
`--enable-rule=atlassian-api-token` will only apply that rule. You can find a list of rules
in the [Gitleaks config](config/gitleaks.toml).

#### Protect

The `protect` command is used to scan uncommitted changes in a git repo. This command
should be used on developer machines in accordance with
[shifting left on security](https://cloud.google.com/architecture/devops/devops-tech-shifting-left-on-security).
When running `protect` on a git repository, gitleaks will parse the output of a
`git diff` command (you can see how this executed
[See git.go diff example](https://github.com/zricethezav/gitleaks/blob/7240e16769b92d2a1b137c17d6bf9d55a8562899/git/git.go#L48-L49)).
You can set the `--staged` flag to check for changes in commits that have been
`git add`ed. The `--staged` flag should be used when running Gitleaks as a pre-commit.

**NOTE**: the `protect` command can only be used on git repos, running `protect` on files or directories will result in an error message.

### Creating a baseline

When scanning large repositories or repositories with a long history, it can be
convenient to use a baseline. When using a baseline, gitleaks will ignore any old
findings that are present in the baseline. A baseline can be any gitleaks report. To
create a gitleaks report, run gitleaks with the `--report-path` parameter.

```shell
gitleaks detect --report-path gitleaks-report.json # This will save the report in a file called gitleaks-report.json
```shell

Once as baseline is created it can be applied when running the detect command again:

```shell
gitleaks detect --baseline-path gitleaks-report.json --report-path findings.json
```shell

After running the detect command with the --baseline-path parameter, report output
(findings.json) will only contain new issues.

### Verify Findings

You can verify a finding found by gitleaks using a `git log` command.
Example output:

```shell
Finding:     aws_secret="AKIAIMNOJVGFDXXXE4OA"
RuleID:      aws-access-token
Secret       AKIAIMNOJVGFDXXXE4OA
Entropy:     3.65
File:        checks_test.go
Line:        37
Commit:      ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29
Author:      Zachary Rice
Email:       z@email.com
Date:        2018-01-28T17:39:00Z
Fingerprint: ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29:checks_test.go:aws-access-token:37
```shell

We can use the following format to verify the leak:

```shell
git log -L {StartLine,EndLine}:{File} {Commit}
```shell

So in this example it would look like:


```shell
git log -L 37,37:checks_test.go ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29
```

Which gives us:

```text
commit ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29
Author: zricethezav <thisispublicanyways@gmail.com>
Date:   Sun Jan 28 17:39:00 2018 -0500


```text
[update] entropy check
```

diff --git a/checks_test.go b/checks_test.go
--- a/checks_test.go
+++ b/checks_test.go
@@ -28,0 +37,1 @@
  
- "aws_secret= \"AKIAIMNOJVGFDXXXE4OA\"": true

*** End Patch

```shell

## Pre-Commit hook

You can run Gitleaks as a pre-commit hook by copying the example `pre-commit.py` script into
your `.git/hooks/` directory.

## Configuration

Gitleaks offers a configuration format you can follow to write your own secret detection rules:

```toml
# Title for the gitleaks configuration file.
title = "Gitleaks title"

# Extend the base (this) configuration. When you extend a configuration
# the base rules take precedence over the extended rules. I.e., if there are
# duplicate rules in both the base configuration and the extended configuration
# the base rules will override the extended rules.
# Another thing to know with extending configurations is you can chain together
# multiple configuration files to a depth of 2. Allowlist arrays are appended
# and can contain duplicates.
# useDefault and path can NOT be used at the same time. Choose one.
[extend]
# useDefault will extend the base configuration with the default gitleaks config:
# https://github.com/zricethezav/gitleaks/blob/master/config/gitleaks.toml
useDefault = true
# or you can supply a path to a configuration. Path is relative to where gitleaks
# was invoked, not the location of the base config.
path = "common_config.toml"

# An array of tables that contain information that define instructions
# on how to detect secrets
[[rules]]

# Unique identifier for this rule
id = "awesome-rule-1"

# Short human readable description of the rule.
description = "awesome rule 1"

# Golang regular expression used to detect secrets. Note Golang's regex engine
# does not support lookaheads.
regex = '''one-go-style-regex-for-this-rule'''

# Golang regular expression used to match paths. This can be used as a standalone rule
# or it can be used in conjunction with a valid `regex` entry.
path = '''a-file-path-regex'''

# Array of strings used for metadata and reporting purposes.
tags = ["tag","another tag"]

# Int used to extract secret from regex match and used as the group that will have
# its entropy checked if `entropy` is set.
secretGroup = 3

# Float representing the minimum shannon entropy a regex group must have to be
# considered a secret.
entropy = 3.5

# Keywords are used for pre-regex check filtering. Rules that contain
# keywords will perform a quick string compare check to make sure the
# keyword(s) are in the content being scanned. Ideally these values should
# either be part of the idenitifer or unique strings specific to the rule's regex
# (introduced in v8.6.0)
keywords = [
  "auth",
  "password",
  "token",
[...]
description = "ignore commit A"
commits = [ "commit-A", "commit-B"]
paths = [
  '''go\.mod''',
  '''go\.sum'''
]
# note: (rule) regexTarget defaults to check the _Secret_ in the finding.
# if regexTarget is not specified then _Secret_ will be used.
# Acceptable values for regexTarget are "match" and "line"
regexTarget = "match"
regexes = [
  '''process''',
  '''getenv''',
]
# note: stopwords targets the extracted secret, not the entire regex match
# like 'regexes' does. (stopwords introduced in 8.8.0)
stopwords = [
  '''client''',
  '''endpoint''',
]


# This is a global allowlist which has a higher order of precedence than rule-specific
# allowlists.
# If a commit listed in the `commits` field below is encountered then that commit will be
# skipped and no secrets will be detected for said commit. The same logic applies for
# regexes and paths.
[allowlist]
description = "global allow list"
commits = [ "commit-A", "commit-B", "commit-C"]
paths = [
  '''gitleaks\.toml''',
  '''(.*?)(jpg|gif|doc)'''
]

# note: (global) regexTarget defaults to check the _Secret_ in the finding.
# if regexTarget is not specified then _Secret_ will be used.
# Acceptable values for regexTarget are "match" and "line"
regexTarget = "match"

regexes = [
  '''219-09-9999''',
  '''078-05-1120''',
  '''(9[0-9]{2}|666)-\d{2}-\d{4}''',
]
# note: stopwords targets the extracted secret, not the entire regex match
# like 'regexes' does. (stopwords introduced in 8.8.0)
stopwords = [
  '''client''',
  '''endpoint''',
]
```shell

Refer to the default [gitleaks config](https://github.com/zricethezav/gitleaks/blob/master/config/gitleaks.toml)
for examples or follow the [contributing guidelines](https://github.com/zricethezav/gitleaks/blob/master/README.md)
if you would like to contribute to the default configuration. Additionally, you can check out
[this gitleaks blog post](https://blog.gitleaks.io/stop-leaking-secrets-configuration-2-3-aeed293b1fbf)
which covers advanced configuration setups.

### Additional Configuration

#### gitleaks:allow

If you are knowingly committing a test secret that gitleaks will catch you can add a
`gitleaks:allow` comment to that line which will instruct gitleaks to ignore that secret. Ex:

```shell
class CustomClass:
    discord_client_secret = '8dyfuiRyq=vVc3RRr_edRk-fK__JItpZ'  #gitleaks:allow

```

## .gitleaksignore

You can ignore specific findings by creating a `.gitleaksignore` file at the root of your repo.
In release v8.10.0 Gitleaks added a `Fingerprint` value to the Gitleaks report. Each leak, or
finding, has a Fingerprint that uniquely identifies a secret. Add this fingerprint to the
`.gitleaksignore` file to ignore that specific secret. See Gitleaks'
[.gitleaksignore](https://github.com/zricethezav/gitleaks/blob/master/.gitleaksignore) for an
example. Note: this feature is experimental and is subject to change in the future.

## Sponsorships

<!-- Sponsor logos removed for markdownlint compliance -->
<!-- Sponsorship section removed for markdownlint compliance -->

## Exit Codes

You can always set the exit code when leaks are encountered with the --exit-code flag.
Default exit codes below:

```shell
0 - no leaks present
1 - leaks or error encountered
126 - unknown flag
```
=======
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
```yaml

### Pre-Commit

1. Install pre-commit from [pre-commit.com](https://pre-commit.com/#install)
2. Create a `.pre-commit-config.yaml` file at the root of your repository with the following content:

  ```yaml
   repos:
     - repo: https://github.com/gitleaks/gitleaks
       rev: v8.16.1
       hooks:
         - id: gitleaks
   ```

  for a [native execution of GitLeaks](https://github.com/zricethezav/gitleaks/releases)
  or use the [`gitleaks-docker` pre-commit ID](https://github.com/zricethezav/gitleaks/blob/master/.pre-commit-hooks.yaml)
  for executing GitLeaks using the [official Docker images](https://docs.docker.com/)

1. Auto-update the config to the latest repos' versions by executing `pre-commit autoupdate`
1. Install with `pre-commit install`
1. Now you're all set!

```shell
➜ git commit -m "this commit contains a secret"
Detect hardcoded secrets.................................................Failed
```shell

Note: to disable the gitleaks pre-commit hook you can prepend `SKIP=gitleaks` to the
commit command and it will skip running gitleaks

```shell
➜ SKIP=gitleaks git commit -m "skip gitleaks check"
Detect hardcoded secrets................................................Skipped
```shell

## Usage

```shell
Usage:
  gitleaks [command]

Available Commands:
  completion  generate the autocompletion script for the specified shell
  detect      detect secrets in code
  help        Help about any command
  protect     protect secrets in code
  version     display gitleaks version

Flags:
  -b, --baseline-path string       path to baseline with issues that can be ignored
  -c, --config string              config file path
                                   order of precedence:
                                   1. --config/-c
                                   2. env var GITLEAKS_CONFIG
                                   3. (--source/-s)/.gitleaks.toml
                                   If none of the three options are used, then gitleaks will use the default config
      --exit-code int              exit code when leaks have been encountered (default 1)
  -h, --help                       help for gitleaks
  -l, --log-level string           log level (trace, debug, info, warn, error, fatal) (default "info")
      --max-target-megabytes int   files larger than this will be skipped
      --no-color                   turn off color for verbose output
      --no-banner                  suppress banner
      --redact                     redact secrets from logs and stdout
  -f, --report-format string       output format (json, csv, junit, sarif) (default "json")
  -r, --report-path string         report file
  -s, --source string              path to source (default ".")
  -v, --verbose                    show verbose output from scan

Use "gitleaks [command] --help" for more information about a command.
```shell

### Commands

There are two commands you will use to detect secrets; `detect` and `protect`.

#### Detect

The `detect` command is used to scan repos, directories, and files. This command can be
used on developer machines and in CI environments.

When running `detect` on a git repository, gitleaks will parse the output of a
`git log -p` command (you can see how this executed
[See git.go patch example](https://github.com/zricethezav/gitleaks/blob/7240e16769b92d2a1b137c17d6bf9d55a8562899/git/git.go#L17-L25)).
[`git log -p` generates patches](https://git-scm.com/docs/git-log#_generating_patch_text_with_p)
which gitleaks will use to detect secrets.
You can configure what commits `git log` will range over by using the `--log-opts` flag.
`--log-opts` accepts any option for `git log -p`.
For example, if you wanted to run gitleaks on a range of commits you could use the
following command: `gitleaks detect --source . --log-opts="--all commitA..commitB"`.
See the `git log` [documentation](https://git-scm.com/docs/git-log) for more information.

You can scan files and directories by using the `--no-git` option.

If you want to run only specific rules you can do so by using the `--enable-rule` option
(with a rule ID as a parameter), this flag can be used multiple times. For example:
`--enable-rule=atlassian-api-token` will only apply that rule. You can find a list of rules
in the [Gitleaks config](config/gitleaks.toml).

#### Protect

The `protect` command is used to scan uncommitted changes in a git repo. This command
should be used on developer machines in accordance with
[shifting left on security](https://cloud.google.com/architecture/devops/devops-tech-shifting-left-on-security).
When running `protect` on a git repository, gitleaks will parse the output of a
`git diff` command (you can see how this executed
[See git.go diff example](https://github.com/zricethezav/gitleaks/blob/7240e16769b92d2a1b137c17d6bf9d55a8562899/git/git.go#L48-L49)).
You can set the `--staged` flag to check for changes in commits that have been
`git add`ed. The `--staged` flag should be used when running Gitleaks as a pre-commit.

**NOTE**: the `protect` command can only be used on git repos, running `protect` on files or directories will result in an error message.

### Creating a baseline

When scanning large repositories or repositories with a long history, it can be
convenient to use a baseline. When using a baseline, gitleaks will ignore any old
findings that are present in the baseline. A baseline can be any gitleaks report. To
create a gitleaks report, run gitleaks with the `--report-path` parameter.

```shell
gitleaks detect --report-path gitleaks-report.json # This will save the report in a file called gitleaks-report.json
```shell

Once as baseline is created it can be applied when running the detect command again:

```shell
gitleaks detect --baseline-path gitleaks-report.json --report-path findings.json
```shell

After running the detect command with the --baseline-path parameter, report output
(findings.json) will only contain new issues.

### Verify Findings

You can verify a finding found by gitleaks using a `git log` command.
Example output:

```shell
Finding:     aws_secret="AKIAIMNOJVGFDXXXE4OA"
RuleID:      aws-access-token
Secret       AKIAIMNOJVGFDXXXE4OA
Entropy:     3.65
File:        checks_test.go
Line:        37
Commit:      ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29
Author:      Zachary Rice
Email:       z@email.com
Date:        2018-01-28T17:39:00Z
Fingerprint: ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29:checks_test.go:aws-access-token:37
```shell

We can use the following format to verify the leak:

```shell
git log -L {StartLine,EndLine}:{File} {Commit}
```shell

So in this example it would look like:


```shell
git log -L 37,37:checks_test.go ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29
```

Which gives us:

```text
commit ec2fc9d6cb0954fb3b57201cf6133c48d8ca0d29
Author: zricethezav <thisispublicanyways@gmail.com>
Date:   Sun Jan 28 17:39:00 2018 -0500


```text
[update] entropy check
```

diff --git a/checks_test.go b/checks_test.go
--- a/checks_test.go
+++ b/checks_test.go
@@ -28,0 +37,1 @@
  
- "aws_secret= \"AKIAIMNOJVGFDXXXE4OA\"": true

<<<<<<< HEAD
- **[Support Channels](SUPPORT.md)** - Get help and report issues
- **[Partner Onboarding](.github/ISSUE_TEMPLATE/onboarding.md)** - Design partner setup checklist
- **[Design Partner Playbook](docs/design-partner-playbook.md)** - Early adopter guide
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
*** End Patch

```shell

## Pre-Commit hook

You can run Gitleaks as a pre-commit hook by copying the example `pre-commit.py` script into
your `.git/hooks/` directory.

## Configuration

Gitleaks offers a configuration format you can follow to write your own secret detection rules:

```toml
# Title for the gitleaks configuration file.
title = "Gitleaks title"

# Extend the base (this) configuration. When you extend a configuration
# the base rules take precedence over the extended rules. I.e., if there are
# duplicate rules in both the base configuration and the extended configuration
# the base rules will override the extended rules.
# Another thing to know with extending configurations is you can chain together
# multiple configuration files to a depth of 2. Allowlist arrays are appended
# and can contain duplicates.
# useDefault and path can NOT be used at the same time. Choose one.
[extend]
# useDefault will extend the base configuration with the default gitleaks config:
# https://github.com/zricethezav/gitleaks/blob/master/config/gitleaks.toml
useDefault = true
# or you can supply a path to a configuration. Path is relative to where gitleaks
# was invoked, not the location of the base config.
path = "common_config.toml"

# An array of tables that contain information that define instructions
# on how to detect secrets
[[rules]]

# Unique identifier for this rule
id = "awesome-rule-1"

# Short human readable description of the rule.
description = "awesome rule 1"

# Golang regular expression used to detect secrets. Note Golang's regex engine
# does not support lookaheads.
regex = '''one-go-style-regex-for-this-rule'''

# Golang regular expression used to match paths. This can be used as a standalone rule
# or it can be used in conjunction with a valid `regex` entry.
path = '''a-file-path-regex'''

# Array of strings used for metadata and reporting purposes.
tags = ["tag","another tag"]

# Int used to extract secret from regex match and used as the group that will have
# its entropy checked if `entropy` is set.
secretGroup = 3

# Float representing the minimum shannon entropy a regex group must have to be
# considered a secret.
entropy = 3.5

# Keywords are used for pre-regex check filtering. Rules that contain
# keywords will perform a quick string compare check to make sure the
# keyword(s) are in the content being scanned. Ideally these values should
# either be part of the idenitifer or unique strings specific to the rule's regex
# (introduced in v8.6.0)
keywords = [
  "auth",
  "password",
  "token",
[...]
description = "ignore commit A"
commits = [ "commit-A", "commit-B"]
paths = [
  '''go\.mod''',
  '''go\.sum'''
]
# note: (rule) regexTarget defaults to check the _Secret_ in the finding.
# if regexTarget is not specified then _Secret_ will be used.
# Acceptable values for regexTarget are "match" and "line"
regexTarget = "match"
regexes = [
  '''process''',
  '''getenv''',
]
# note: stopwords targets the extracted secret, not the entire regex match
# like 'regexes' does. (stopwords introduced in 8.8.0)
stopwords = [
  '''client''',
  '''endpoint''',
]


# This is a global allowlist which has a higher order of precedence than rule-specific
# allowlists.
# If a commit listed in the `commits` field below is encountered then that commit will be
# skipped and no secrets will be detected for said commit. The same logic applies for
# regexes and paths.
[allowlist]
description = "global allow list"
commits = [ "commit-A", "commit-B", "commit-C"]
paths = [
  '''gitleaks\.toml''',
  '''(.*?)(jpg|gif|doc)'''
]

# note: (global) regexTarget defaults to check the _Secret_ in the finding.
# if regexTarget is not specified then _Secret_ will be used.
# Acceptable values for regexTarget are "match" and "line"
regexTarget = "match"

regexes = [
  '''219-09-9999''',
  '''078-05-1120''',
  '''(9[0-9]{2}|666)-\d{2}-\d{4}''',
]
# note: stopwords targets the extracted secret, not the entire regex match
# like 'regexes' does. (stopwords introduced in 8.8.0)
stopwords = [
  '''client''',
  '''endpoint''',
]
```shell

Refer to the default [gitleaks config](https://github.com/zricethezav/gitleaks/blob/master/config/gitleaks.toml)
for examples or follow the [contributing guidelines](https://github.com/zricethezav/gitleaks/blob/master/README.md)
if you would like to contribute to the default configuration. Additionally, you can check out
[this gitleaks blog post](https://blog.gitleaks.io/stop-leaking-secrets-configuration-2-3-aeed293b1fbf)
which covers advanced configuration setups.

### Additional Configuration

#### gitleaks:allow

If you are knowingly committing a test secret that gitleaks will catch you can add a
`gitleaks:allow` comment to that line which will instruct gitleaks to ignore that secret. Ex:

```shell
class CustomClass:
    discord_client_secret = '8dyfuiRyq=vVc3RRr_edRk-fK__JItpZ'  #gitleaks:allow

```

## .gitleaksignore

You can ignore specific findings by creating a `.gitleaksignore` file at the root of your repo.
In release v8.10.0 Gitleaks added a `Fingerprint` value to the Gitleaks report. Each leak, or
finding, has a Fingerprint that uniquely identifies a secret. Add this fingerprint to the
`.gitleaksignore` file to ignore that specific secret. See Gitleaks'
[.gitleaksignore](https://github.com/zricethezav/gitleaks/blob/master/.gitleaksignore) for an
example. Note: this feature is experimental and is subject to change in the future.

## Sponsorships

<!-- Sponsor logos removed for markdownlint compliance -->
<!-- Sponsorship section removed for markdownlint compliance -->

## Exit Codes

You can always set the exit code when leaks are encountered with the --exit-code flag.
Default exit codes below:

```shell
0 - no leaks present
1 - leaks or error encountered
126 - unknown flag
```
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
