// CLI: odavl metrics serve
import { serveMetrics } from '../lib/metrics.js';

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
