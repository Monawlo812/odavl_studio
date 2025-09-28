
<<<<<<< HEAD

# ODAVL Studio – AI Coding Agent Instructions

> **Purpose:** Enable AI agents to work productively and safely in the ODAVL Studio monorepo. Focus on actionable, project-specific knowledge and workflows.

## 1. Architecture & Key Components

- **Monorepo:** Uses pnpm + Turborepo. Main directories:
  - `apps/` – CLI (`cli/`), VS Code extension (`vscode-ext/`), launcher (`launcher/`)
  - `packages/` – Core logic, codemods, policy, recipes
  - `reports/` – Logs, undo, CI artifacts, evidence
  - `docs/`, `examples/` – Onboarding, reference, media
=======
# ODAVL Studio – AI Coding Agent Instructions

> **Purpose:** This guide enables AI agents to work productively and safely in the ODAVL Studio monorepo. Focus on actionable, project-specific knowledge and workflows.

## 1. Architecture & Key Components

- **Monorepo:** pnpm + Turborepo. Main dirs:
	- `apps/` – CLI (`cli/`), VS Code extension (`vscode-ext/`), launcher (`launcher/`)
	- `packages/` – Core logic, codemods, policy, recipes
	- `reports/` – All logs, undo, evidence, and CI artifacts
	- `docs/`, `examples/` – Onboarding, reference, media
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
- **CLI (`apps/cli`)**: Main automation entrypoint. All output is JSON. Supports `scan`, `heal`, `pr`, `shadow`, `governor`, `undo`.
- **VS Code Extension (`apps/vscode-ext`)**: Webview panel, invokes CLI, shows telemetry, scan/heal/reports.
- **Governor (`packages/policy`)**: Enforces PR/CI rate limits, wave windows, and risk budgets. Configured in `.odavl.policy.yml`.
- **Codemods (`packages/codemods`)**: Automated code transforms (e.g., `esmHygiene`, `depsPatchMinor`).
- **Undo System:** Snapshots before changes, stored in `reports/undo/`.

## 2. Critical Workflows

- **Install/build:**
<<<<<<< HEAD
  - `pnpm install`
  - `pnpm --filter @odavl/cli run build` (CLI)
  - `pnpm --filter @odavl/vscode-ext run build` (VS Code ext)
=======
	- `pnpm install`
	- `pnpm --filter @odavl/cli run build` (CLI)
	- `pnpm --filter @odavl/vscode-ext run build` (VS Code ext)
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
- **Scan:** `node apps/cli/dist/index.js scan`
- **Heal:** `node apps/cli/dist/index.js heal --recipe esm-hygiene --dry-run --max-lines 40 --max-files 10`
- **Apply healing:** Add `--apply` and restrict with `--max-files`/`--max-lines` for safety
- **Undo:** `node apps/cli/dist/index.js undo last` (restores from `reports/undo/`)
- **PR/CI:** `pr open` and `shadow run` require GitHub CLI (`gh`) and a GitHub remote
- **Web Launcher:** `pnpm launcher start` for a local web UI

## 3. Project Conventions & Patterns

- **All CLI output is JSON** for downstream automation
- **Risk budgets:** Healing is always chunked by `max-lines`/`max-files` (see `.odavl.policy.yml`)
- **Protected paths:** `security/`, `*.spec.*`, `public-api/` are skipped by healers
- **Telemetry:** Controlled by `studio.telemetry` in `.odavl.policy.yml` (default: off). Logs in `reports/telemetry.log.jsonl`
- **TypeScript:** All packages use ES modules (`"type": "module"`)
- **Chunked automation:** Never apply large-scale changes in a single run
- **Policy-driven:** `.odavl.policy.yml` governs risk budgets, protected paths, and governor settings

## 4. Integration Points

- **GitHub CLI:** Needed for PR/CI commands
- **VS Code Extension:** Calls CLI, shows status, provides a control panel
- **Web Launcher:** `pnpm launcher start` for a local web UI

## 5. Debugging & Troubleshooting

- **Heal fails:** Check `.odavl.policy.yml` for limits, use `--dry-run`, and check `reports/undo/stack.json`
- **Governor blocks:** Run `governor explain`, check wave windows, verify `gh auth status`
- **VS Code issues:** Ensure CLI is built, check extension activation, and CLI path

## 6. Examples

```sh
pnpm install
pnpm --filter @odavl/cli run build
node apps/cli/dist/index.js scan
node apps/cli/dist/index.js heal --recipe esm-hygiene --dry-run
```

## 7. References

- [README.md](../README.md) – Big picture, quickstart, and features
- [docs/](../docs/) – Guides, onboarding, and media
- [odavl.policy.yml.sample](../odavl.policy.yml.sample) – Policy config reference
- [apps/cli/README.md](../apps/cli/README.md) – CLI usage
- [apps/vscode-ext/README.md](../apps/vscode-ext/README.md) – Extension usage

---

_Update this file as workflows or conventions change. Focus on actionable, project-specific guidance for AI agents._
