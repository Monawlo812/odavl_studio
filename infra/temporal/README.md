# Temporal Orchestration (Bootstrap)

This directory contains the Temporal worker, activities, and workflow stubs for ODAVL Studio.

## Local Development

1. Start Temporal server and UI:
   ```
   docker-compose -f ../docker-compose.temporal.yml up
   ```
2. Start the worker:
   ```
   pnpm odavl orchestration worker
   ```

## Activities
- scan, heal, branch, shadow, pr (map to CLI)

## Next Steps
- Implement scanHealPrWorkflow
- Add retry/timeout policies
- Integrate with org-wide scheduling
