<<<<<<< HEAD
/* global require, console */
// Prometheus metrics for ODAVL CLI
import client from 'prom-client';
import express from 'express';
=======
// Prometheus metrics for ODAVL CLI
import client from 'prom-client';
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)

export const eslintWarnings = new client.Gauge({ name: 'eslint_warnings', help: 'ESLint warnings' });
export const typeErrors = new client.Gauge({ name: 'type_errors', help: 'Type errors' });
export const buildMs = new client.Gauge({ name: 'build_ms', help: 'Build time (ms)' });
export const bundleKb = new client.Gauge({ name: 'bundle_kb', help: 'Bundle size (KB)' });
export const prOpened = new client.Counter({ name: 'pr_opened', help: 'PRs opened' });
export const prMerged = new client.Counter({ name: 'pr_merged', help: 'PRs merged' });
export const rollbacks = new client.Counter({ name: 'rollbacks', help: 'Rollbacks' });
export const shadowFailRate = new client.Gauge({ name: 'shadow_fail_rate', help: 'Shadow CI fail rate' });
export const ciMinutesUsed = new client.Gauge({ name: 'ci_minutes_used', help: 'CI minutes used' });

<<<<<<< HEAD

export function serveMetrics() {
  const app = express();
  app.get('/metrics', async (_req: import('express').Request, res: import('express').Response) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });
  // eslint-disable-next-line no-undef
  app.listen(9464, () => console.log('Prometheus metrics on :9464/metrics'));
}

// Additional script commands
=======
export function serveMetrics() {
  const express = require('express');
  const app = express();
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });
  app.listen(9464, () => console.log('Prometheus metrics on :9464/metrics'));
}
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
