# Codemod: ESM Hygiene

**Scope:** All `src/` files (excluding protected paths)
**Risk Cost:** 2 tokens
**What it does:** Converts CommonJS/legacy imports/exports to ESM syntax, adds `.js` extensions to relative imports.
**Rollback:** Restore from git or undo chunk via ODAVL Studio.
**Gate:** Must pass smoke test and API check before merge.
