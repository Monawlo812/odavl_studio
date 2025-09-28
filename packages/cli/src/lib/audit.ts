<<<<<<< HEAD
/* eslint-env node */
/* global process */
=======
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
// Audit logger stub with redaction
import { redact } from './redaction.js';
export function logAudit(entry: string) {
  // In real use, append to audit log file
  process.stdout.write(redact(entry));
}
