<<<<<<< HEAD
/* eslint-env node */
/* global process, console */
=======
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
// Structured JSON logging for ODAVL CLI
export function logJson(obj: Record<string, unknown>) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

export function logWithCorrelation(msg: string, correlationId?: string, verbose?: boolean) {
  if (verbose && correlationId) {
    logJson({ msg, correlationId, ts: new Date().toISOString() });
  } else {
    console.log(msg);
  }
}
