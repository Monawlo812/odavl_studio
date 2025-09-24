// Secrets redaction utility
export const REDACT_PATTERNS = [
  /AKIA[0-9A-Z]{16}/g,                 // AWS
  /xox[baprs]-[0-9A-Za-z-]+/g,         // Slack
  /ghp_[A-Za-z0-9]{36}/g,              // GitHub
  /(?:secret|token|apikey)=\S+/gi      // generic
];

export function redact(str: string): string {
  let result = str;
  for (const pat of REDACT_PATTERNS) {
    result = result.replace(pat, '***REDACTED***');
  }
  return result;
}
