# ODAVL Studio v0.5.0 — Wave 5

**Highlights**
- Go & Java packs (scan/heal dry-run + CI matrices).
- ProofTwin Lite (preview): contract snippets + verify runner.
- Mutation preview (opt-in).
- Planner v2 tokens + ablation report.
- Polyglot E2E + QA/FinalCheck.

**Run Polyglot E2E**
```bash
node scripts/e2e-polyglot.js
node scripts/w5-finalize.js
```
Artifacts land under reports/w5/. Gates remain conservative by default.

Update root package.json (single-line change):

"version": "0.5.0"
