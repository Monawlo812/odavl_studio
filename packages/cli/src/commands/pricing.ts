// CLI: odavl pricing show
import * as fs from 'fs';
import * as path from 'path';
export function showPricing() {
  const root = process.cwd();
  const file = path.join(root, 'config', 'pricing.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const tier of data.tiers) {
    console.log(`\n${tier.name}\nFeatures: ${tier.features.join(', ')}\nLimits: ${JSON.stringify(tier.limits)}\nSLA: ${tier.sla}`);
  }
}
