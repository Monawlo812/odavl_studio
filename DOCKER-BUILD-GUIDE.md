# 🐳 Docker Build Instructions for ODAVL Studio

## Prerequisites

Docker must be installed on your system. If not installed:

<<<<<<< HEAD
Windows: Download Docker Desktop from [https://docker.com/products/docker-desktop](https://docker.com/products/docker-desktop)
Linux: Install Docker Engine
macOS: Download Docker Desktop
=======
- Windows: Download Docker Desktop from https://docker.com/products/docker-desktop
- Linux: Install Docker Engine
- macOS: Download Docker Desktop
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)

## 🚀 Docker Commands

### 1. Build the Docker Image

```bash
cd odavl_studio
docker build -t ghcr.io/monawlo812/odavl-runner:0.3.0 .
```

### 2. Alternative Local Tag

```bash
docker build -t odavl-runner:0.3.0 .
```

### 3. Login to GitHub Container Registry (Optional)

```bash
# Set your GitHub token
export GHCR_TOKEN=your_github_personal_access_token

# Login to GHCR
echo $GHCR_TOKEN | docker login ghcr.io -u monawlo812 --password-stdin
```

### 4. Push to Registry (Optional)

```bash
docker push ghcr.io/monawlo812/odavl-runner:0.3.0
```

## 📋 Docker Image Details

<<<<<<< HEAD
### Multi-stage Build Structure
=======
### Multi-stage Build Structure:
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)

- **Stage 1 (builder)**: Node.js 20 Alpine with pnpm
- **Stage 2 (runner)**: Lightweight production image
- **Final Size**: Optimized for production deployment

<<<<<<< HEAD
### Image Contents
=======
### Image Contents:
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)

- ODAVL CLI built and ready
- All dependencies included
- Entry point configured for CLI usage

<<<<<<< HEAD
### Usage Examples
=======
### Usage Examples:
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)

```bash
# Run ODAVL CLI scan
docker run --rm -v $(pwd):/workspace ghcr.io/monawlo812/odavl-runner:0.3.0 scan

# Run ODAVL CLI help
docker run --rm ghcr.io/monawlo812/odavl-runner:0.3.0 --help

# Interactive shell
docker run --rm -it -v $(pwd):/workspace ghcr.io/monawlo812/odavl-runner:0.3.0 /bin/sh
```

## 🔧 Current Status

✅ Dockerfile verified and ready
⚠️ Docker not installed on current system
📦 Ready for build when Docker is available

## 🏷️ Recommended Tags

- `ghcr.io/monawlo812/odavl-runner:0.3.0` - Version specific
- `ghcr.io/monawlo812/odavl-runner:latest` - Latest release
- `ghcr.io/monawlo812/odavl-runner:wave3` - Wave 3 milestone

---

<<<<<<< HEAD
Generated on ${new Date().toISOString()}
=======
_Generated on ${new Date().toISOString()}_
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
