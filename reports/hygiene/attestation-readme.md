# ODAVL Studio Hygiene Attestation System

## What is a Hygiene Attestation?

A hygiene attestation is a cryptographically signed JSON document generated after every hygiene check or auto-repair run. It proves the repository's Zero Noise / Zero Risk status and provides verifiable evidence for external auditors.

## How to Verify an Attestation

1. Obtain the attestation JSON and signature files from `reports/hygiene/attestations/`.

2. Run the verification script:

   ```sh
   node scripts/verify-hygiene-attestation.mjs <attestation.json>
   ```

   - This checks the signature (using GPG or cosign) and validates the SHA256 digests of all referenced evidence files.

3. If all checks pass, you will see `VERIFICATION: PASS`.

## How to Interpret PASS/FAIL

- **PASS:** Signature is valid and all evidence files match their recorded digests. The attestation is trustworthy.
- **FAIL:** Signature is invalid or evidence files have changed. The attestation cannot be trusted for compliance.

## Latest Attestations

<!-- LATEST_ATTESTATIONS -->

- [hygiene-20251002T0000.json](attestations/hygiene-20251002T0000.json)
- [hygiene-20251002T0000.sig](attestations/hygiene-20251002T0000.sig)

*This section is auto-updated with links to the latest attestation JSON and signature files.*
