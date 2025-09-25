import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';

function stripAnsi(str: string) {
  return str.replace(/[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[\dA-ORZcf-nqry=><]/g, '');
}
function redactPaths(str: string) {
  return str.replace(/([A-Z]:)?\\[\w\\.-]+/gi, '[REDACTED_PATH]');
}

export function runCli(args: string[], onData: (s: string) => void, onExit: (code: number) => void): () => void {
  const config = vscode.workspace.getConfiguration('odavl');
  const cliCmd = config.get<string>('cliCommand') || 'node apps/cli/dist/index.js';
  const [cmd, ...baseArgs] = cliCmd.split(' ');
  const proc: ChildProcess = spawn(cmd, [...baseArgs, ...args], { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const onChunk = (chunk: Buffer) => {
    let s = chunk.toString();
  // Sanitize regex: use \d instead of [0-9], remove control chars
  s = s.replace(/[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[\dA-ORZcf-nqry=><]/g, '');
  s = stripAnsi(redactPaths(s));
    onData(s);
  };
  proc.stdout?.on('data', onChunk);
  proc.stderr?.on('data', onChunk);
  proc.on('close', onExit);
  return () => proc.kill();
}
