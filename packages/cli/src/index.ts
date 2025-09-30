// Main CLI entrypoint for ODAVL
import { showPricing } from './commands/pricing.js';
import { runOrgPolicyValidate } from './commands/policy-org.js';
import { metricsServe } from './commands/metrics.js';
import { runDemo } from './commands/demo.js';
import { Command } from 'commander';

const program = new Command();

program
  .command('pricing show')
  .description('Show pricing tiers')
  .action(showPricing);

program
  .command('policy validate --org')
  .description('Validate organization policy')
  .action(runOrgPolicyValidate);

program
  .command('metrics serve')
  .description('Serve Prometheus metrics')
  .action(metricsServe);

program
  .command('demo')
  .description('Run demo smoke on examples/demo')
  .action(runDemo);

program.parse(process.argv);
