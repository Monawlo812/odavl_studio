// Redacting writer for reporters
// Stub redact until module is available
function redact(msg: string) { return msg; }
export function writeRedacted(msg: string) {
  process.stdout.write(redact(msg));
}
