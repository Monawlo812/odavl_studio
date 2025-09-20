# PR: What / Why / Risk / Verify / Metrics

## What
<!-- Brief summary + key files touched -->

## Why
<!-- Problem this fixes / references -->

## Risk
- Lines: <!-- e.g., 32 --> | Files: <!-- e.g., 9 --> | Protected: 0 | Tokens: <!-- e.g., 2 -->
- Risk Class: Low | Waivers (if any): <!-- id + expiry -->

## Verify
- tsc: ✅/❌ | tests: ✅/❌ | build: ✅/❌ | shadow: ✅/❌ (matrix: <!-- e.g., node18,node20 -->)
- Gates: Types ✅ | ESLint ✅ | Bundle ✅ | Build ✅ | Policy ✅ | Shadow ✅

## Metrics (Δ)
- ESLint: <!-- -17 --> | TypeErrors: <!-- 0 --> | Build(ms): <!-- -500 --> | Bundle(KB): <!-- -4 -->

## Attestation
- Link: <!-- cosign/sigstore or reports path -->

## Repro
```bash
pnpm i && pnpm odavl report show --last
```

## Checklist
- [ ] Follows .odavl.policy.yml
- [ ] No protected paths touched
- [ ] Adds/updates docs if needed
- [ ] Linked issues