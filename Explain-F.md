# Stage F – PR Evidence/Attestation Integration

**What was added:**
<<<<<<< HEAD
`packages/reporters/pr-template.hbs`: Handlebars PR template with placeholders for title, what, why, risk, verify, metrics, attestation, and notes. The attestation section references `reports/attestation-F.json`.
CLI `verify` command: Writes a minimal attestation JSON (`reports/attestation-F.json`) with ISO timestamp and fixed placeholder hashes for `.odavl.policy.yml` and `.odavl/gates.yml`.
Example attestation file: `reports/attestation-F.json`.

**Why:**
To provide evidence and traceability for PRs, supporting governance and audit requirements.

**Risk:**
Minimal, as all changes are additive and do not touch protected paths.

**Verification:**
Run `odavl verify` to generate the attestation file. Check that the PR template references the correct file.

**Metrics:**
≤40 changed lines, ≤10 files, no protected paths.

**Attestation:**
See `reports/attestation-F.json` for evidence.

**Notes:**
All requirements for Stage F are satisfied. Ready for review and commit.
=======
- `packages/reporters/pr-template.hbs`: Handlebars PR template with placeholders for title, what, why, risk, verify, metrics, attestation, and notes. The attestation section references `reports/attestation-F.json`.
- CLI `verify` command: Writes a minimal attestation JSON (`reports/attestation-F.json`) with ISO timestamp and fixed placeholder hashes for `.odavl.policy.yml` and `.odavl/gates.yml`.
- Example attestation file: `reports/attestation-F.json`.

**Why:**
- To provide evidence and traceability for PRs, supporting governance and audit requirements.

**Risk:**
- Minimal, as all changes are additive and do not touch protected paths.

**Verification:**
- Run `odavl verify` to generate the attestation file. Check that the PR template references the correct file.

**Metrics:**
- ≤40 changed lines, ≤10 files, no protected paths.

**Attestation:**
- See `reports/attestation-F.json` for evidence.

**Notes:**
- All requirements for Stage F are satisfied. Ready for review and commit.
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
