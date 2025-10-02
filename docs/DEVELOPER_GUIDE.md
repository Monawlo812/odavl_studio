
# ODAVL Studio Developer Guide

This guide covers setup, workflow, standards, commit conventions, troubleshooting, and common pitfalls for ODAVL Studio contributors.

## 1. Setup

- Clone the repo, install pnpm, run `pnpm install`.
- Node.js 18+ required. See README for details.

## 2. Development Workflow

- Use feature branches, sign all commits (`git commit -S`).
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Run CLI:

```bash
pnpm --filter @odavl/cli run build
node apps/cli/dist/index.js <command>
```

- Run VS Code extension:

```bash
pnpm --filter @odavl/vscode-ext run build
# Then launch VS Code
```

## 3. Coding Standards

- TypeScript, ES modules, strict linting, max 80 cols for code.
- Use protected paths for security (`security/`, `public-api/`).
- All PRs require review and signed commits.

## 4. Commit Conventions

- All commits must be GPG signed.
- Conventional commits recommended (feat:, fix:, chore:, etc).

## 5. Local Runs & Testing

- Run all checks:

```bash
pnpm run doctor
pnpm run test
pnpm run bundle:log
pnpm run metrics:log
```

- View evidence in `reports/evaluations/<date>/`.

## 6. Troubleshooting

- If build fails, check `reports/` logs and CI output.
- Use `pnpm install --force` if dependency issues.
- For CI failures, see `.github/workflows/ci.yml` and logs.

## 7. Common Pitfalls

- Unsigned commits will block CI.
- Outdated docs or missing evidence will fail PRs.
- Always run `pnpm docs:gen` before pushing.
