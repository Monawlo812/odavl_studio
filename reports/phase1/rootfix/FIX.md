# FIX: validateOrgPolicy Export Resolution (TypeScript/ESM/Monorepo)

## Final Fix Applied

A type bridge file was created in the CLI package to re-export the needed symbol from @odavl/policy, bypassing the TypeScript/ESM/exports bug.

### File: packages/cli/src/policy-bridge.ts

```ts
// TypeScript bridge for @odavl/policy exports
export { validateOrgPolicy } from '@odavl/policy';
```

### Usage

In any CLI file that needs `validateOrgPolicy`, import from `./policy-bridge` instead of directly from `@odavl/policy`:

```ts
import { validateOrgPolicy } from '../policy-bridge';
```

This ensures TypeScript resolves the type correctly, even if the ESM/exports/types bug persists.

## Why This Works
- Forces TypeScript to resolve the type in the local context, bypassing the monorepo/exports bug.
- No changes to protected paths or external packages.
- All other config and build steps remain standard.
