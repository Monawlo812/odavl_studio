/* global process */
// Main CLI entrypoint for ODAVL
import { showPricing } from './commands/pricing';
import { runOrgPolicyValidate } from './commands/policy-org';
import { metricsServe } from './commands/metrics';
import { runDemo } from './commands/demo';
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
