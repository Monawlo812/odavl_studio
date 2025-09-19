# ODAVL Studio - AI Coding Agent Instructions

## Project Overview
ODAVL Studio is a bootstrap monorepo using **pnpm workspaces** and **Turborepo** designed to host:
- VS Code extension
- CLI tools  
- Core packages
- Infrastructure components

This is currently a bootstrap setup - the workspace directories (`apps/`, `packages/`, `examples/`) are defined but not yet created.

## Monorepo Architecture

### Workspace Structure
```
odavl_studio/
├── apps/          # Applications (VS Code extension, CLI)
├── packages/      # Shared libraries and core packages
├── examples/      # Example implementations
├── pnpm-workspace.yaml  # Workspace configuration
└── turbo.json     # Build pipeline configuration
```

### Package Management
- **pnpm workspaces**: Manages dependencies across packages with efficient disk usage
- **Workspace packages** defined in `pnpm-workspace.yaml` include `apps/*`, `packages/*`, `examples/*`
- No root `package.json` yet - each workspace will have its own

## Build System & Workflows

### Turborepo Pipeline
Current `turbo.json` defines basic pipeline tasks:
- `build`: Compile/bundle packages
- `lint`: Code quality checks  
- `test`: Run test suites

**Key Commands** (when workspace packages exist):
```bash
# Install dependencies across all workspaces
pnpm install

# Run builds for all packages
pnpm turbo build

# Run specific task
pnpm turbo lint
pnpm turbo test

# Run task for specific package
pnpm turbo build --filter=package-name
```

## Development Conventions

### Code Standards
- **Indentation**: 2 spaces (`.editorconfig`)
- **Line endings**: LF
- **Charset**: UTF-8
- **Final newline**: Required

### File Patterns to Ignore
Based on `.gitignore`:
- `node_modules/`, `dist/`, `coverage/`
- `pnpm-lock.yaml` (managed by pnpm)
- Environment files (`.env`)
- Log files (`*.log`)

## Getting Started Workflows

### Creating New Packages
When adding packages to this monorepo:

1. **Create workspace directory**:
   ```bash
   mkdir apps/my-app  # or packages/my-package
   ```

2. **Initialize package.json** with workspace references:
   ```json
   {
     "name": "@odavl/my-package",
     "dependencies": {
       "@odavl/core": "workspace:*"
     }
   }
   ```

3. **Install dependencies** from root:
   ```bash
   pnpm install
   ```

### VS Code Extension Development
As this will host a VS Code extension, expect:
- TypeScript configuration for extension API
- Extension manifest (`package.json` with `engines.vscode`)
- Build pipeline for `.vsix` packaging

## Current State
This is a **fresh bootstrap setup**. When working with this codebase:
- Workspace directories need to be created first
- Root `package.json` may need to be added for shared tooling
- Turborepo pipeline will need expansion as packages are added
- Consider adding shared tooling packages (ESLint config, TypeScript config)

## Key Integration Points
- **pnpm**: Manages cross-package dependencies and hoisting
- **Turborepo**: Orchestrates builds and caching across packages  
- **VS Code**: Target platform for extension development
- Future CLI tools will likely share core packages with the extension