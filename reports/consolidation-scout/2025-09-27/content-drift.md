# ODAVL Content Drift Report

**Date:** 2025-09-27

## Scope
- Compared canonical repo (`odavl__add-dispatch-20250924`) to trusted sources (`odavl__all-in-one-20250924`, `odavl__attestation-20250924`, `odavl__bundle-gates-20250924`)
- Folders/files checked: `.github/workflows/*` (full set, line-by-line)

---

## Results: .github/workflows/*

### Identical Files
- `ci.yml` — identical
- `all-in-one.yml` — identical
- `shadow.yml` — identical
- `security.yml` — identical
- `release.yml` — identical
- `pages.yml` — identical
- `orchestrator.yml` — identical
- `java-ci.yml` — identical
- `go-ci.yml` — identical

### Drift Detected
- `waivers.yml` — present in canonical, **missing** in trusted source (cannot compare)
- `vscode-smoke.yml` — present in canonical, **missing** in trusted source (cannot compare)
- `observability.yml` — present in canonical, **missing** in trusted source (cannot compare)
- `kill-list.yml` — present in canonical, **missing** in trusted source (cannot compare)
- `freeze.yml` — present in canonical, **missing** in trusted source (cannot compare)
- `codemods.yml` — present in canonical, **missing** in trusted source (cannot compare)

#### Classification
- All compared files are **identical** (no drift)
- Files missing in trusted source: cannot classify drift (likely canonical is superset)

---

## Summary Table
| File                  | Status     | Drift Type   | Newer/Safer Source |
|-----------------------|------------|--------------|--------------------|
| ci.yml                | identical  | —            | —                  |
| all-in-one.yml        | identical  | —            | —                  |
| shadow.yml            | identical  | —            | —                  |
| security.yml          | identical  | —            | —                  |
| release.yml           | identical  | —            | —                  |
| pages.yml             | identical  | —            | —                  |
| orchestrator.yml      | identical  | —            | —                  |
| java-ci.yml           | identical  | —            | —                  |
| go-ci.yml             | identical  | —            | —                  |
| waivers.yml           | only in canonical | —      | canonical          |
| vscode-smoke.yml      | only in canonical | —      | canonical          |
| observability.yml     | only in canonical | —      | canonical          |
| kill-list.yml         | only in canonical | —      | canonical          |
| freeze.yml            | only in canonical | —      | canonical          |
| codemods.yml          | only in canonical | —      | canonical          |

---

## Notes
- No critical, minor, or non-critical drift detected in `.github/workflows/*` for files present in both canonical and trusted sources.
- Canonical repo contains additional workflow files not present in trusted sources.
- Further checks needed for other folders/files (apps, packages, infra, scripts, config, etc.)

---

*See logs/drift-check.log for evidence and details.*
