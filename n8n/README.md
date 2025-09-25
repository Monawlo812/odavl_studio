# n8n Integration Flows

## Freeze on PR
- **Trigger:** GitHub PR webhook (HTTP In)
- **Steps:**
  1. Parse PR info from webhook
  2. Fetch PR details from GitHub
  3. Run Freeze (evaluate gates)
  4. If all gates pass, comment/label PR
- **Inputs:** GitHub PR webhook payload ([samples/pr-opened.json](samples/pr-opened.json))
- **Outputs:** PR comment, label
- **Credentials:** GitHub OAuth2 (referenced, not hardcoded)

## Weekly OSV Sweep
- **Trigger:** Cron (weekly)
- **Steps:**
  1. Run OSV scan (simulated)
  2. If issues found, open GitHub issue/PR
  3. Attach osv.json as evidence
- **Inputs:** None (scheduled)
- **Outputs:** GitHub issue/PR, attached osv.json ([samples/osv-sweep.json](samples/osv-sweep.json))
- **Credentials:** GitHub OAuth2 (referenced)

## Canary Promotion
- **Trigger:** Push to canary branch (webhook)
- **Steps:**
  1. Check if push is to canary
  2. Run Freeze (simulate)
  3. If green, promote canary to main
  4. Post attestation
- **Inputs:** Push webhook ([samples/canary-promotion.json](samples/canary-promotion.json))
- **Outputs:** Merge to main, attestation file
- **Credentials:** GitHub OAuth2 (referenced)

## Auto-Rollback
- **Trigger:** Failure on main (webhook)
- **Steps:**
  1. Parse failure event
  2. Open revert PR on GitHub
  3. Attach logs as evidence
- **Inputs:** Failure webhook ([samples/auto-rollback.json](samples/auto-rollback.json))
- **Outputs:** Revert PR, attached logs
- **Credentials:** GitHub OAuth2 (referenced)

## Attestation Bundler
- **Trigger:** Release event (webhook)
- **Steps:**
  1. Collect all reports/* artifacts (simulate)
  2. Zip and upload to release assets
- **Inputs:** Release webhook ([samples/attestation-bundler.json](samples/attestation-bundler.json))
- **Outputs:** Uploaded bundle.zip
- **Credentials:** GitHub OAuth2 (referenced)

## Dry-Run Evidence
- Freeze on PR: [reports/n8n/freeze-on-pr/dry-run.log](../../reports/n8n/freeze-on-pr/dry-run.log)
- OSV Sweep: [reports/n8n/osv-sweep/dry-run.log](../../reports/n8n/osv-sweep/dry-run.log)
- Canary Promotion: [reports/n8n/canary-promotion/dry-run.log](../../reports/n8n/canary-promotion/dry-run.log)
- Auto-Rollback: [reports/n8n/auto-rollback/dry-run.log](../../reports/n8n/auto-rollback/dry-run.log)
- Attestation Bundler: [reports/n8n/attestation-bundler/dry-run.log](../../reports/n8n/attestation-bundler/dry-run.log)

All flows: dry-run simulated, evidence present.

## Setup Guide
- Place all flows in n8n/flows/ and import into your n8n instance
- Place sample payloads in n8n/samples/ for testing
- Required credentials:
  - GitHub OAuth2: set up in n8n credentials, reference in HTTP Request nodes
  - Slack/Teams: (if used) set up webhook credentials
- Environment variables (example):
  - N8N_BASE_URL, GITHUB_TOKEN, SLACK_WEBHOOK_URL
- Do not hardcode secrets; use n8n credential references
