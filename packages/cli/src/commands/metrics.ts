<<<<<<< HEAD
/* global console, process */
// CLI: odavl metrics serve
import { serveMetrics } from '../lib/metrics.js';
=======
// CLI: odavl metrics serve
<<<<<<< HEAD
import { serveMetrics } from '../lib/metrics';
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
import { serveMetrics } from '../lib/metrics.js';
>>>>>>> 79b66b0 (fix: remove broken submodule reference for CI security jobs)

export function metricsServe() {
  try {
    serveMetrics();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(
      `Metrics server failed to start: ${msg}. Ensure prom-client and express are installed.`
    );
    process.exit(1);
  }
}
