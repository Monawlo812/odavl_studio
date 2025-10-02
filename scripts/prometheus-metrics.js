
// prometheus-metrics.js - ODAVL Studio Prometheus metrics using prom-client
const client = require('prom-client');
const fs = require('fs');
const path = require('path');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const requestCounter = new client.Counter({
  name: 'odavl_requests_total',
  help: 'Total requests',
  labelNames: ['command'],
  registers: [register]
});

function logMetric(command) {
  requestCounter.inc({ command });
  register.metrics().then(metrics => {
    const outDir = path.join('reports', 'evaluations', new Date().toISOString().slice(0,10), 'observability');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'metrics.prom'), metrics);
    console.log('Prometheus metrics written:', path.join(outDir, 'metrics.prom'));
  });
}

if (require.main === module) {
  logMetric(process.argv[2] || 'manual');
}

module.exports = { logMetric };
