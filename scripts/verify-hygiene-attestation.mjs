#!/usr/bin/env node
// ODAVL Studio Hygiene Attestation Verifier (Wave H8)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

if (process.argv.length < 3) {
  console.error('Usage: node verify-hygiene-attestation.mjs <attestation.json>');
  process.exit(1);
}

const attestationPath = process.argv[2];
const sigPath = attestationPath.replace(/\.json$/, '.sig');

function sha256(file) {
  const data = fs.readFileSync(file);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function verifySignature(attestation, sig) {
  try {
    if (process.env.COSIGN_PUB) {
      execSync(`cosign verify-blob --key $COSIGN_PUB --signature ${sig} ${attestation}`);
      return true;
    } else {
      execSync(`gpg --verify ${sig} ${attestation}`);
      return true;
    }
  } catch {
    return false;
  }
}

function main() {
  if (!fs.existsSync(attestationPath) || !fs.existsSync(sigPath)) {
    console.error('Attestation or signature file missing.');
    process.exit(2);
  }
  const attestation = JSON.parse(fs.readFileSync(attestationPath, 'utf8'));
  let pass = true;
  // 1. Verify signature
  if (!verifySignature(attestationPath, sigPath)) {
    console.error('Signature verification FAILED.');
    pass = false;
  } else {
    console.log('Signature verification PASS.');
  }
  // 2. Check evidence digests
  for (const ev of attestation.evidence) {
    if (!fs.existsSync(ev.path)) {
      console.error('Missing evidence file:', ev.path);
      pass = false;
      continue;
    }
    const actual = sha256(ev.path);
    if (actual !== ev.sha256) {
      console.error(`Digest mismatch for ${ev.path}: expected ${ev.sha256}, got ${actual}`);
      pass = false;
    } else {
      console.log(`Digest match: ${ev.path}`);
    }
  }
  if (pass) {
    console.log('VERIFICATION: PASS');
    process.exit(0);
  } else {
    console.log('VERIFICATION: FAIL');
    process.exit(3);
  }
}

main();
