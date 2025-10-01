
# ODAVL Studio Compliance Guide

This guide covers compliance checklists, evidence, retention, mapping, and change management for ODAVL Studio.

## 1. Baseline Checklist (SOC2/ISO)

- Access controls, change management, CI, dependency scanning, code review, incident response, audit logging, secure pipeline, rollback, attestation.

## 2. Evidence Requirements

- All evidence stored in `reports/evaluations/<date>/`.
- Attestation logs: `attestation/attestation.log`, rollback: `attestation/rollback.log`.
- Governance: `governance/` (freeze/canary/final logs).
- Compliance: `compliance/compliance.md`.

## 3. Retention Policy

- Evidence retained for 1 year minimum.

## 4. Mapping Artifacts

| Checklist Item     | Evidence Path                                    |
|-------------------|-------------------------------------------------|
| Access control    | compliance/compliance.md                         |
| Change management | attestation/attestation.log, governance/freeze.* |
| Incident response | attestation/rollback.log                         |
| Dependency policy | governance/freeze.*, compliance/compliance.md    |
| Attestation       | attestation/attestation.log                      |

## 5. Change Management

- All changes require PR, review, and signed commit.
- CI enforces doc and evidence presence.
