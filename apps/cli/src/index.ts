#!/usr/bin/env node
// ODAVL CLI placeholder
const cmd = process.argv[2] ?? 'help';

if (cmd === 'scan') {
  const out = {
    tool: 'odavl',
    action: 'scan',
    pass: true,
    metrics: { eslint: 17, typeErrors: 0 },
    generatedAt: new Date().toISOString()
  };
  console.log(JSON.stringify(out));
} else {
  console.log('Usage: odavl <command>');
  console.log('Commands:');
  console.log('  scan   Outputs placeholder HealthSnapshot JSON');
}