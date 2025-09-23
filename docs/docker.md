# Docker Usage Guide

ODAVL Studio can be run in Docker for consistent execution across environments.

## Build Image

```bash
# Build the Docker image
docker build -t odavl-studio .

# Build with specific tag
docker build -t odavl-studio:v0.3.0 .
```

## Basic Usage

```bash
# Scan current directory (read-only)
docker run --rm -v "$(pwd):/workspace:ro" odavl-studio

# Run with specific command
docker run --rm -v "$(pwd):/workspace:ro" odavl-studio \
  node apps/cli/dist/index.js status

# Interactive shell access
docker run --rm -it -v "$(pwd):/workspace" odavl-studio sh
```

## Environment Variables

Set GitHub token for PR and CI operations:

```bash
# With GitHub token
docker run --rm \
  -v "$(pwd):/workspace:ro" \
  -e GITHUB_TOKEN="your_token_here" \
  odavl-studio

# From environment file
docker run --rm \
  -v "$(pwd):/workspace:ro" \
  --env-file .env \
  odavl-studio
```

## Docker Compose Example

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  odavl:
    build: .
    volumes:
      - .:/workspace:ro
      - ./reports:/app/reports:rw
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    command: ["node", "apps/cli/dist/index.js", "scan"]

  odavl-heal:
    build: .
    volumes:
      - .:/workspace:rw
      - ./reports:/app/reports:rw
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    command:
      [
        "node",
        "apps/cli/dist/index.js",
        "heal",
        "--recipe",
        "esm-hygiene",
        "--dry-run",
      ]
    profiles: ["heal"]
```

Usage:

```bash
# Run scan service
docker-compose up odavl

# Run healing (with profile)
docker-compose --profile heal up odavl-heal
```

## Volume Mounts

- **Workspace**: `/workspace` - Mount your project directory
- **Reports**: `/app/reports` - Persistent storage for logs and snapshots
- **Config**: Mount `.odavl.policy.yml` if using custom location

## Security Notes

- **Read-only mounts**: Use `:ro` for scanning operations
- **Limited write access**: Only mount specific directories for write operations
- **Non-root user**: Container runs as user `odavl` (uid 1001)
- **Token security**: Use environment files, avoid command-line token exposure

## Common Patterns

```bash
# CI/CD pipeline scan
docker run --rm -v "$(pwd):/workspace:ro" odavl-studio

# Automated healing with volume persistence
docker run --rm \
  -v "$(pwd):/workspace:rw" \
  -v "./reports:/app/reports:rw" \
  -e GITHUB_TOKEN="$GITHUB_TOKEN" \
  odavl-studio node apps/cli/dist/index.js heal --apply --max-files 5
```
