# ODAVL Studio — Public Beta

**Ship clean code, every day — automatically.** ODAVL Studio turns maintenance into safe, tiny PRs you can trust.

## Why teams love it (value)
- **Small, safe changes** — micro-fixes with gates & shadow checks.
- **Visible & reversible** — runs in front of you, with Undo/Abort.
- **Faster velocity** — lower tech-debt, quicker builds, happier devs.

## The 4-step journey
1. **Scan** → find small wins (lint/types/deps).
2. **Heal** → apply safe fixes (or Dry-Run to preview).
3. **Shadow** → verify in isolated CI (Node 18/20).
4. **Open PR** → auto template with metrics & attestation.

## Peek (screens)
![Scan](./media/scan.png)
![PR](./media/pr.png)

## Try it now (CTA)
- **Quickstart (60s):** see [docs/quickstart.md](./quickstart.md).
- **One-button demo:** `pnpm run e2e` (artifacts in `./reports`).
- Big picture: [docs/overview.md](./overview.md) · [FAQ](./faq.md).

## Notes
- Telemetry is opt-in (off/anonymized/on).
- Governor caps PR/day & CI minutes to avoid overload.
- All changes on side branches; protected paths respected.