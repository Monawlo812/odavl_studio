# ODAVL VS Code Extension Parity Verification

## Commands Available
- Run Codemod (list/dry-run/diff/apply)
- Freeze Now
- Undo
- Open Evidence (browser/search/filter)

## Sample Outputs
- Codemod: OutputChannel logs, diff preview, evidence refresh
- Freeze: OutputChannel logs, attestation/bundle.log opened
- Undo: Snapshot picker, evidence refresh
- Evidence: Webview panel, search/filter artifacts

## Screenshots (placeholders)
- ![Panel](docs/media/vscode-panel.png)
- ![Evidence](docs/media/status-bar.png)

## Test Results
- Activation/command registration: ✅
- Evidence panel open: ✅
- Lint/build: (see CI)

## Rubric
| Feature                | Status |
|------------------------|--------|
| Run Codemod (full)     |   ✅   |
| Freeze Now             |   ✅   |
| Undo                   |   ✅   |
| Evidence Browser       |   ✅   |
| Policy Preview         |   ⏳   |
| Telemetry (opt-in)     |   ✅   |
| Tests                  |   ✅   |
| CSP/Redaction          |   ✅   |

---
Validated: 2025-09-25
