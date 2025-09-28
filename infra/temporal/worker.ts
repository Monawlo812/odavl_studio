// Minimal Temporal worker bootstrap
import { Worker } from '@temporalio/worker';
import * as activities from './activities.js';

async function run() {
  await Worker.create({
    workflowsPath: require.resolve('./workflows.js'),
    activities,
    taskQueue: 'odavl',
  }).then(worker => worker.run());
}
run();
