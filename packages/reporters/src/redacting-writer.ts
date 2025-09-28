// Redacting writer for reporters
// Stub redact until module is available
<<<<<<< HEAD
export function redactLine(msg: string) {
  // Simple redaction: replace token=... with token=***REDACTED***
  return msg.replace(/token=[^\s]+/g, 'token=***REDACTED***');
}
export function writeRedacted(msg: string) {
  process.stdout.write(redactLine(msg));
=======
function redact(msg: string) { return msg; }
export function writeRedacted(msg: string) {
  process.stdout.write(redact(msg));
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
}
