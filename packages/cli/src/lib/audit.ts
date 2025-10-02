/* eslint-env node */
/* global process */
// Audit logger stub with redaction
import { redact } from './redaction.js';
export function logAudit(entry: string) {
  // In real use, append to audit log file
  process.stdout.write(redact(entry));
}
