# 0.1.0 — First Public Release (MVP)

Initial public MVP release.

**Major deliverables:**
CLI (`@odavl/cli`): scan, heal, pr, shadow, undo, governor
VS Code extension: Control Center, status bar, telemetry
Golden repo: baseline, lint/build/test pass, golden-snapshot
Shadow CI: Node 18/20 matrix, risk-budgeted automation

## [0.4.0] – 2025-09-22

- Wave 4 (Polyglot I): Python Pack (scan/heal dry-run), codemods (axios→fetch, requests→httpx), CI matrix (Node+Python)
- Orchestrator stub + CLI `run` wiring
- Polyglot gates + unified verify report
- Expanded `odavl status` (polyglot) + Dual-lang E2E
- QA report under `reports/Wave4-QA-Report.md`

## Changelog

## 0.5.0 — Wave 5 (Polyglot II & Intelligence)

- New Packs: Go (lint/test/vuln, dry-run heal proposals) & Java (maven/gradle, dry-run heals).
- ProofTwin Lite (preview): contract test snippets + preview verify runner.
- Mutation Gate (preview): selective analyzer with opt-in.
- Planner: Risk Tokens v2 + ablation artifact.
- Polyglot E2E aggregator, QA & FinalCheck artifacts.
- Docs for Go/Java packs; compact CI matrices.

All notable changes to this project will be documented in this file.

## [0.3.0] - 2025-09-21

### Added

- CLI: `odavl status` command (branch/governor/telemetry/CI snapshot).
- E2E demo: `scripts/e2e-golden.mjs` and root script `pnpm run e2e`.
- PR & Issue templates under `.github/`.

### Changed

- VS Code: Status bar (Governor & Telemetry) and UX polish.
- Docs: README + docs/overview.md + docs/quickstart.md + docs/faq.md + docs/landing.md.
- Media: placeholders + recording guide in `docs/media/`.
- Playbook: `docs/design-partner-playbook.md`.

### Notes

- Wave 3 production polish for Public Beta.
