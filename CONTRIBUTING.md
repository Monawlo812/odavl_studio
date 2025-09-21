# Contributing to ODAVL Studio

Thank you for your interest in contributing! This guide outlines our development practices and submission requirements.

## Getting Started

1. Fork the repository and create a feature branch
2. Install dependencies: `pnpm install`
3. Build the project: `pnpm build`
4. Run tests: `pnpm test` and `pnpm e2e`

## Development Guidelines

### Pull Request Best Practices

- **Small, focused PRs**: Keep changes under 200 lines when possible
- **Single responsibility**: One feature or fix per PR
- **Risk budget awareness**: Consider blast radius of changes
- **Test coverage**: Include tests for new functionality

### Protected Paths

The following paths are automatically excluded from automated changes and require manual review:

- `security/` - Security-related configuration
- `*.spec.*` - Test files and specifications  
- `public-api/` - Public API definitions
- `.github/workflows/` - CI/CD pipelines

### Code Style

#### Commit Messages
```
type(scope): brief description

Detailed explanation if needed

Examples:
feat(cli): add weekly telemetry summary command
fix(governor): handle rate limit edge case  
docs(readme): update installation instructions
```

#### TypeScript Standards
- Use strict mode and explicit types
- Prefer composition over inheritance
- Include JSDoc for public APIs
- Follow existing naming conventions

### Testing Requirements

#### Unit Tests
- Test new functionality with appropriate coverage
- Mock external dependencies (GitHub API, file system)
- Include edge cases and error conditions

#### E2E Tests
- Update `scripts/e2e-golden.mjs` for CLI changes
- Ensure tests pass in clean environment
- Document any new test artifacts in `reports/`

### Submission Process

1. **Before submitting**:
   - Run full test suite: `pnpm test && pnpm e2e`
   - Check lint: `pnpm lint`
   - Verify build: `pnpm build`

2. **PR Description**:
   - Clear summary of changes
   - Reference related issues
   - Include testing approach
   - Note any breaking changes

3. **Review process**:
   - Automated checks must pass
   - Manual review by maintainers
   - Address feedback promptly
   - Squash commits before merge

## Development Environment

### Local Testing
```bash
# Test CLI commands locally
node apps/cli/dist/index.js scan
node apps/cli/dist/index.js status

# Test with example repository
cd examples/golden-repo
../../node apps/cli/dist/index.js heal --dry-run
```

### VS Code Extension Development
```bash
# Build extension
pnpm --filter @odavl/vscode-ext run build

# Test in VS Code
# Open workspace in VS Code, press F5 to launch Extension Development Host
```

## Documentation

- Update relevant documentation for user-facing changes
- Include inline code comments for complex logic
- Update `CHANGELOG.md` for version releases
- Ensure examples in docs are current

## Questions?

- Check [FAQ](docs/faq.md) for common questions
- Review [Support](SUPPORT.md) for help channels
- Join discussions in GitHub Issues