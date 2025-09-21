---
name: Partner Onboarding
about: Design partner onboarding checklist for ODAVL Studio
title: "[PARTNER] Organization Name - Onboarding"
labels: ["partner", "onboarding"]
---

# Partner Onboarding Checklist

**Organization**: <!-- Replace with partner organization name -->
**Primary Contact**: <!-- Replace with partner contact -->
**Repository**: <!-- Replace with target repository URL -->

## Pre-requisites

- [ ] GitHub organization with admin access
- [ ] Repository with CI/CD pipeline (GitHub Actions)
- [ ] Node.js 18+ environment available
- [ ] Understanding of automated governance concepts

## Setup Phase

### 1. Permissions & Access
- [ ] GitHub App installed with required permissions
- [ ] Repository access granted to ODAVL Studio
- [ ] Team members added to partner workspace

### 2. Configuration
- [ ] `.odavl.policy.yml` created with initial settings
- [ ] Governor limits configured (PRs/day, CI minutes)
- [ ] Wave windows defined for automation timing
- [ ] Telemetry preference set (on/off/anonymized)

### 3. CI Integration
- [ ] GitHub Actions workflows validated
- [ ] Shadow workflow triggers configured
- [ ] Branch protection rules reviewed
- [ ] Required status checks identified

## Genesis Run

### 4. First Scan
- [ ] Initial codebase scan completed
- [ ] Baseline metrics captured (ESLint, TypeScript errors)
- [ ] Health report reviewed with partner

### 5. First Heal
- [ ] Test healing recipe selected (esm-hygiene recommended)
- [ ] Dry-run executed and reviewed
- [ ] First automated PR created with safety limits
- [ ] Partner review and merge process validated

## Monitoring Setup

### 6. KPI Baseline
- [ ] Weekly telemetry summary configured
- [ ] Success metrics defined with partner
- [ ] Escalation thresholds established
- [ ] Reporting cadence agreed upon

### 7. Documentation
- [ ] Partner-specific runbook created
- [ ] Team training materials provided
- [ ] Support channels established
- [ ] Feedback loop process defined

## Success Validation

- [ ] End-to-end workflow executed successfully
- [ ] Partner team comfortable with process
- [ ] Automation running within policy limits
- [ ] Monitoring and alerting functional

## Notes

<!-- Add any partner-specific notes, customizations, or special requirements -->

## Next Steps

<!-- Define post-onboarding activities and ongoing partnership goals -->