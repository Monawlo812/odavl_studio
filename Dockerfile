# Multi-stage build for ODAVL Studio CLI
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY apps/cli/package.json ./apps/cli/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build CLI and dependencies
RUN pnpm turbo build --filter=@odavl/cli

# Production image
FROM node:20-alpine

# Install git (required for CLI operations)
RUN apk add --no-cache git

# Create non-root user
RUN addgroup -g 1001 -S odavl && \
    adduser -S odavl -u 1001

# Set working directory
WORKDIR /app

# Copy built CLI from builder stage
COPY --from=builder --chown=odavl:odavl /app/apps/cli/dist ./apps/cli/dist
COPY --from=builder --chown=odavl:odavl /app/packages/*/dist ./packages/
COPY --from=builder --chown=odavl:odavl /app/node_modules ./node_modules

# Switch to non-root user
USER odavl

# Default command: scan workspace
CMD ["node", "apps/cli/dist/index.js", "scan"]