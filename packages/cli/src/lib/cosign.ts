// Cosign availability stub for attestation signing
import { execSync } from 'child_process';

export function isCosignAvailable(): boolean {
  try {
    execSync('cosign version', { stdio: 'ignore' });
    return true;
  } catch {
    return false; // fallback: cosign not found
  }
}

// Future: add sign/verify helpers here
