CI Pipeline Fix Applied:

FILE CHANGED: .github/workflows/ci.yml

CHANGE MADE:

- Line 15: Changed pnpm version from "9" to "10.17.0"
- This matches the packageManager version in package.json: "pnpm@10.17.0"

IMPACT:

- Resolves "Multiple versions of pnpm specified" error
- All CI runs should now pass the pnpm setup step
- Enables builds, type-checking, and linting to execute

LINES CHANGED: 1 line (well within 40 line limit)

This fix addresses the root cause of all recent CI failures.
