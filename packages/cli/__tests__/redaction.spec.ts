import { redact } from '../src/lib/redaction.js';
describe('redact', () => {
  it('redacts AWS, Slack, GitHub, and generic secrets', () => {
    const input = 'AKIA1234567890ABCD xoxb-1234567890-ghp_abcdefghijklmnopqrstuvwxyz123456 secret=foo';
    const out = redact(input);
    expect(out).not.toMatch(/AKIA|xoxb|ghp_|secret=foo/);
    expect(out).toMatch(/\*\*\*REDACTED\*\*\*/);
  });
});
