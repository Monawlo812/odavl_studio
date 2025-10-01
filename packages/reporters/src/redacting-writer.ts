// Redacting writer for reporters
// Stub redact until module is available
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
export function redactLine(msg: string) {
  // Simple redaction: replace token=... with token=***REDACTED***
  return msg.replace(/token=[^\s]+/g, 'token=***REDACTED***');
}
export function writeRedacted(msg: string) {
  process.stdout.write(redactLine(msg));
<<<<<<< HEAD
=======
function redact(msg: string) { return msg; }
export function writeRedacted(msg: string) {
  process.stdout.write(redact(msg));
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
}
