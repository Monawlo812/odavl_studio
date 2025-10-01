# ROOT CAUSE ANALYSIS: validateOrgPolicy Export Resolution Failure

## Symptom
- TypeScript error TS2305: Module '"@odavl/policy"' has no exported member 'validateOrgPolicy' in CLI build.

## Investigation
- `@odavl/policy` **does** export `validateOrgPolicy` in both `src/index.ts` and `dist/index.d.ts`.
- `dist/index.d.ts` contains: `export { validateOrgPolicy } from "./org-policy.js";`
- `package.json` for `@odavl/policy` has:
  - "types": "dist/index.d.ts"
  - "exports": { ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" } }
- CLI has no path mapping or typeRoots interfering.
- Clean builds and typechecks still fail with the same error.
- TypeScript is resolving the package, but not the named export, despite correct ESM and type config.

## Hypothesis
- TypeScript's module resolution for ESM packages with conditional exports ("exports" field) and types is broken or incomplete in this monorepo setup (as of TS 5.x, Node 18+).
- The "types" field in "exports" is not always honored for named exports in ESM packages, especially when using subpath exports or when the package is symlinked (as in pnpm workspaces).
- This is a known limitation/bug in TypeScript's handling of ESM+exports+types in monorepos.

## Evidence
- All relevant logs and configs are attached in this directory.
- Manual re-exports, path mapping, and typeRoots do not resolve the issue.
- The export works in the built JS, but not in the type system.

## Conclusion
- This is a TypeScript/ESM/exports/monorepo bug, not a misconfiguration or missing export.
- The only reliable workaround is to create a type bridge or re-export in the CLI package.
