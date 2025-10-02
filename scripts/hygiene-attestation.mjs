#!/usr/bin/env node
// ODAVL Studio Hygiene Attestation Generator (Wave H8)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'reports');
const HYGIENE = path.join(REPORTS, 'hygiene');
const ATTEST = path.join(HYGIENE, 'attestations');
const INDEX = path.join(REPORTS, 'INDEX.md');
const SUMMARY = path.join(HYGIENE, 'final-hygiene-summary.md');
const AUTOLOG = path.join(HYGIENE, 'auto-repair-log.md');
const AUTOSUM = path.join(HYGIENE, 'auto-repair-summary.md');

if (!fs.existsSync(ATTEST)) fs.mkdirSync(ATTEST, { recursive: true });

function sha256(file) {
  const data = fs.readFileSync(file);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function getCommitSHA() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'UNKNOWN';
  }
}

function getRepoName() {
  try {
    const remotes = execSync('git remote get-url origin').toString().trim();
    return remotes.split('/').slice(-2).join('/').replace(/\.git$/, '');
  } catch {
    return path.basename(ROOT);
  }
}

function countFiles(dir, filter) {
  return fs.readdirSync(dir).filter(filter).length;
}

function collectEvidence() {
  const evidence = [
    { path: INDEX, sha256: sha256(INDEX) },
    { path: SUMMARY, sha256: sha256(SUMMARY) },
    { path: AUTOLOG, sha256: sha256(AUTOLOG) },
    { path: AUTOSUM, sha256: sha256(AUTOSUM) },
  ];
  return evidence;
}

function getStatus() {
  // Parse summary for status
  const txt = fs.readFileSync(SUMMARY, 'utf8');
  if (/auto-fix|auto-repair/i.test(txt)) return 'AUTO-FIXED';
  if (/pass/i.test(txt)) return 'CLEAN';
  return 'ISSUES';
}

function main() {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
  const commit = getCommitSHA();
  const repo = getRepoName();
  const status = getStatus();
  const core = countFiles(path.join(REPORTS, 'final'), f => f.endsWith('.md'));
  const archived = countFiles(path.join(REPORTS, 'archive'), f => f.endsWith('.md') || f.endsWith('.json'));
  const evidence = collectEvidence();
  const attestation = {
    repo,
    commit,
    timestamp,
    status,
    counts: {
      final_reports: core,
      archived_reports: archived
    },
    evidence
  };
  const attestationPath = path.join(ATTEST, `hygiene-${timestamp}.json`);
  fs.writeFileSync(attestationPath, JSON.stringify(attestation, null, 2));

  // Sign with cosign or gpg
  let sigPath = path.join(ATTEST, `hygiene-${timestamp}.sig`);
  try {
    if (process.env.COSIGN_KEY) {
      execSync(`cosign sign-blob --key $COSIGN_KEY --output-signature ${sigPath} ${attestationPath}`);
    } else {
      execSync(`gpg --batch --yes --armor --output ${sigPath} --detach-sign ${attestationPath}`);
    }
  } catch (e) {
    fs.writeFileSync(sigPath, 'SIGNATURE_FAILED: ' + e.toString());
  }
  console.log('Attestation generated:', attestationPath);
  console.log('Signature:', sigPath);
}

main();
