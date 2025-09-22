// Minimal Temporal Orchestrator bootstrap

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const registry: Record<string, (input: any) => any> = {
  echo: (input) => input,
  'scan-plan-heal': () => ({ steps: ['scan', 'plan', 'heal'], ok: true })
};

export function runWorkflow(name: string, input: any): any {
  const fn = registry[name];
  if (!fn) return { error: 'unknown workflow', name };
  return fn(input);
}

if (require.main === module) {
  const [, , cmd, wfName, ...rest] = process.argv;
  if (cmd === 'run' && wfName) {
    let input = {};
    for (let i = 0; i < rest.length; ++i) {
      if (rest[i] === '--input' && rest[i + 1]) {
        try { input = JSON.parse(rest[i + 1]); } catch {}
        break;
      }
    }
    const ts = Date.now();
    const id = `run-${ts}-${wfName}`;
    const result = runWorkflow(wfName, input);
    const report = { id, name: wfName, input, result, ts };
    const dir = resolve(__dirname, '../../../reports/runs');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const outPath = resolve(dir, `${id}.json`);
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(outPath);
    console.error(`Report written for workflow '${wfName}'.`);
  }
}
