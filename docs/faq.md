# Frequently Asked Questions

## Privacy & Telemetry

**Q: What data does ODAVL collect?**  
A: Only usage metrics (command durations, success rates, operation counts). No source code or secrets are captured.

**Q: How do I disable telemetry?**  
A: Set `studio.telemetry: off` in `.odavl.policy.yml` (default setting).

**Q: Where is telemetry data stored?**  
A: Locally in `reports/telemetry.log.jsonl`. Remote sending requires explicit endpoint configuration.

## Governor System

**Q: Why was my PR creation blocked?**  
A: Governor enforces daily PR limits. Run `node apps/cli/dist/index.js governor explain` to check current usage.

**Q: What are wave windows?**  
A: Time-based scheduling (e.g., "22:00-06:00") that allows automation during off-hours while blocking during business hours.

**Q: How do I increase limits?**  
A: Edit `.odavl.policy.yml` and adjust `governor.prsPerDay` or `governor.ciMinutesPerHour`.

## Safety & Recovery

**Q: Can I undo heal operations?**  
A: Yes, use `node apps/cli/dist/index.js undo last` to restore from automatic snapshots.

**Q: What paths are protected?**  
A: `security/`, `*.spec.*`, and `public-api/` directories are automatically excluded from healing.

**Q: How do risk budgets work?**  
A: `--max-lines` and `--max-files` flags limit the blast radius of changes, splitting large operations into safe chunks.

## Troubleshooting

**Q: CLI commands fail with "Module not found"**  
A: Run `pnpm --filter @odavl/cli run build` to compile TypeScript sources.

**Q: GitHub operations fail**  
A: Ensure `gh` CLI is installed and authenticated: `gh auth login`

For detailed analysis reports, check the `reports/` directory.