// Redacting writer for reporters
// Stub redact until module is available
export function redactLine(msg: string) {
  // Simple redaction: replace token=... with token=***REDACTED***
  return msg.replace(/token=[^\s]+/g, 'token=***REDACTED***');
}
export function writeRedacted(msg: string) {
  process.stdout.write(redactLine(msg));
}
