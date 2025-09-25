# Doctor Hospital v1 Report (2025-09-25)

- CI YAML: skipped
- OSV Scan: skipped
- Hygiene: passed
- Overall: healthy-with-skips

---

## CI YAML

```
rhysd/actionlint:latest skipped (not available)
```

## OSV Scan

```
ghcr.io/google/osv-scanner:latest skipped (not available)
```

## Build

```

> odavl-studio@0.5.0 build C:\Users\sabou\odavl_studio
> turbo run build

• Packages in scope: @odavl/cli, @odavl/codemods, @odavl/core, @odavl/launcher, @odavl/orchestrator, @odavl/policy, @odavl/reporters, @odavl/vscode-ext, golden-repo
• Running build in 9 packages
• Remote caching disabled
@odavl/orchestrator:build: cache hit, replaying logs 72bbd7b62dc2dd2a
@odavl/orchestrator:build: 
@odavl/orchestrator:build: > @odavl/orchestrator@0.4.0 build C:\Users\sabou\odavl_studio\apps\orchestrator
```

## Test

```

> odavl-studio@0.5.0 test C:\Users\sabou\odavl_studio
> echo "no tests" && exit 0 "--if-present"

"no tests" 

```

## Hygiene

```

> odavl-studio@0.5.0 odavl:problems:run C:\Users\sabou\odavl_studio
> node scripts/immune/problems/run.mjs

Problems-Pro: noop | VERIFY:PASS | before=0 after=0

```

## Security Ward Findings

```
Security Ward: Running gitleaks...
No secrets found.
Security Ward: Running osv-scanner...
No high-risk vulnerabilities.

```

## Bundle Ward Status

```
Bundle Ward: Measuring build size...
Bundle size OK: 0 bytes.
Bundle Ward error: Error: Command failed: git checkout -b odavl/guardian-v6-2025-09-25
fatal: a branch named 'odavl/guardian-v6-2025-09-25' already exists


```

## Auto-Fix Attempts

```

```