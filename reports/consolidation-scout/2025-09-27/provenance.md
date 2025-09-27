
# Provenance Log — Batch 1 (2025-09-27)

## Phase 5.5 Fixes (2025-09-27)

- Removed duplicate workspace for @odavl/cli:
	- Deleted `apps/cli/` (kept `packages/cli/` as canonical)
	- Updated all workspace globs and references as needed
	- See commit: fix(workspace): remove duplicate @odavl/cli entry (Phase 5.5)

| Path                        | Source Folder                  | Notes                                 |
|-----------------------------|-------------------------------|---------------------------------------|
| tools/                      | odavl__all-in-one-20250924    | Not present in canonical              |
| examples/                   | odavl__all-in-one-20250924    | Not present in canonical              |
| .vscode/                    | odavl__all-in-one-20250924    | Not present in canonical              |
| infra/                      | odavl__bundle-gates-20250924  | Not present in canonical              |
| scripts/                    | odavl__bundle-gates-20250924  | Not present in canonical              |
| reports/novel-diagnostics/  | odavl__codemods-tests-20250924| Not present in canonical (skipped: source missing) |

- All files and subfolders in each path were imported as-is.
- See logs/consolidate-batch-1.log for full command output.
- If a source was missing, it is noted above.
