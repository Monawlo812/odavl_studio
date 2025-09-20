# Design Partner Playbook

A short, operational guide for early partners using **ODAVL Studio** (Public Beta).

## 1) Onboarding (15–30 min)
**Prereqs**
- GitHub org + target repos
- CI available (GitHub Actions) with a small minutes budget
- Contact channel: Slack/Email
- Owner who can approve PRs

**Permissions**
- Git App: read repos, create branches, set checks/statuses (no write to `main`)
- Optional: secrets for CI (scoped, minimal)

**Steps**
1. Install the ODAVL Git App with **least privilege** (selected repos only).
2. Add/confirm CI workflow (Node matrix 18/20 + cache).
3. Commit default policy files:
   - `.odavl.policy.yml` (riskBudget, protected paths)
   - `.odavl/gates.yml` (types/eslint/build/bundle/shadow)
4. Run **Quickstart**:
   - `pnpm i && pnpm --filter @odavl/cli run build`
   - `node apps/cli/dist/index.js scan` → verify `reports/`
5. Enable the daily loop with **Governor** caps (see below).
6. Try a first **Genesis** change (Scan→Heal→Shadow→PR).

## 2) KPIs (track weekly)
- **eslintΔ** ≤ **-50** (warnings reduced)  
- **typeErrorsΔ** ≤ **0** (never increases)  
- **Shadow pass rate** ≥ **95%**  
- **PR merge SLA** ≤ **72h** for small patches  
- **Rollbacks/mo** ≤ **2%**  
- **CI minutes / 100 LoC** within budget  
- Optional: **Build(ms)Δ**, **Bundle(KB)Δ**, **DBR/RAV** trendlines

## 3) Safety & Governor (defaults)
- Risk budget (per patch): **≤40 lines**, **≤10 files**, **≤3 patches/run**
- Protected: `**/security/**`, `**/*.spec.*`, `**/public-api/**`
- PR caps: **prsPerDay=2**
- CI guard: **ciMinutesPerHour=30**, **maxConcurrentShadows=2**
- Backoff after 2 shadow failures; wave windows (e.g., 22:00–06:00)
- **Waivers**: time-boxed, documented in PR (with expiry)
- **Kill-Switch / Break-Glass**: stop instantly; auto-rollback latest change

## 4) Privacy (what we do / don't do)
- **We process**: tool metrics (lint/types/build), diffs, run logs
- **We don't store**: full code, secrets, customer data
- **Redaction**: common secret patterns masked in logs
- **Retention**: 30–90 days (configurable)
- **Telemetry**: off/anonymized/on (partner's choice; default: anonymized/off)
- On-prem/self-host options supported later

## 5) Shadow usage (CI "safe room")
- Every change runs in **shadow** (separate branch, no `main` writes)
- Matrix: Node **18/20** (expand on demand)
- Flaky handling: auto-retry (≤2), quarantine suspicious tests, follow-up PR
- Merge gate: **all gates pass** + shadow ✅

## 6) Rollback / Undo
- Auto-rollback on shadow failure (no side effects on `main`)
- Manual: **VS Code Undo** or revert branch/PR
- Always keep PRs **small** to simplify rollback

## 7) CI minutes guard (cost sanity)
- Budget weekly minutes; monitor in `reports/` and PR checks
- Tips to reduce:
  - Cache deps; limit matrix; batch tiny fixes; prefer off-hours waves
  - Keep patches under the risk budget; avoid touching heavy build paths

## 8) Working agreements
- Small PRs, clear titles, **Why + Metrics(Δ)** in the template
- No touches to protected paths without explicit waiver
- Review within 72h; ask for **Explain** if unclear
- Security: no secrets in repo; use CI secrets minimally

## 9) Support & SLA
- Channels: GitHub Issues + (optional) Slack
- Severity
  - **S1**: CI blocked for all repos → response ≤ **4h**
  - **S2**: Single-repo failure → ≤ **24h**
  - **S3**: Question/feature → ≤ **48h**
- Provide `reports/` artifacts and PR links in tickets

## 10) First 7 days (suggested plan)
- **Day 1**: Install, CI check, run Quickstart, 1 Genesis PR
- **Day 2–3**: Enable daily loop; confirm Governor caps
- **Day 4–5**: Review KPIs; adjust waivers/caps if needed
- **Day 6–7**: Demo to team; agree on next recipes (deps/security hygiene)

## 11) Exit / Pause
- Turn telemetry **off**
- Disable daily loop (Governor=0 PR/day)
- Remove app from repos (keeps history intact)

**References**
- README / Overview / Quickstart / FAQ
- Media guide & GIFs
- Policy & Gates samples
- Status command: `node apps/cli/dist/index.js status`