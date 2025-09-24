# Codemod: Remove Unused

**Scope:** All `src/` files (excluding protected paths)
**Risk Cost:** 2 tokens
**What it does:** Safely removes unused variables, imports, and exports (no side effects).
**Rollback:** Restore from git or undo chunk via ODAVL Studio.
**Gate:** Must pass smoke test and API check before merge.
